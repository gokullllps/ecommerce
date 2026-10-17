"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { MEN_CATEGORIES_DATA } from "@/data/categories";

export function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const isVisibleRef = useRef(false);

  const [hasEntered, setHasEntered] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const lastDotRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [dimensions, setDimensions] = useState({
    cardWidth: 310,
    cardHeight: 460,
    cardSpacing: 280,
    arcDrop: 24,
    rotZ: 5.4,
    rotY: 8.2,
  });

  // 24 cards pool (12 duplicated twice) for mathematically seamless, infinite looping
  const duplicatedCategories = [...MEN_CATEGORIES_DATA, ...MEN_CATEGORIES_DATA];
  const N = duplicatedCategories.length;
  const numUnique = MEN_CATEGORIES_DATA.length;

  // Track responsive dimensions (restoring substantial, visually grand editorial scale)
  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    if (w < 640) {
      setDimensions({
        cardWidth: 220,
        cardHeight: 330,
        cardSpacing: 185,
        arcDrop: 14,
        rotZ: 3.8,
        rotY: 5.6,
      });
    } else if (w < 1024) {
      setDimensions({
        cardWidth: 260,
        cardHeight: 390,
        cardSpacing: 230,
        arcDrop: 18,
        rotZ: 4.6,
        rotY: 7.0,
      });
    } else {
      setDimensions({
        cardWidth: 310,
        cardHeight: 460,
        cardSpacing: 280,
        arcDrop: 24,
        rotZ: 5.4,
        rotY: 8.2,
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  // Direct GPU DOM render function: purely transform, opacity, and zIndex for 120fps smoothness
  const renderCards = useCallback(
    (currentP: number) => {
      const { cardSpacing, arcDrop, rotZ, rotY } = dimensions;

      for (let k = 0; k < N; k++) {
        const el = cardRefs.current[k];
        if (!el) continue;

        // Relative offset u from center in range [-N/2, N/2)
        let u = (k - currentP) % N;
        if (u < -N / 2) u += N;
        if (u > N / 2) u -= N;

        const absU = Math.abs(u);

        // Cull cards outside view bounds
        if (absU > 3.8) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.style.visibility = "hidden";
          continue;
        }

        el.style.visibility = "visible";

        // Curved 3D Arc Math
        const translateX = u * cardSpacing;
        const translateY = Math.pow(absU, 1.45) * arcDrop;
        const rotateZ = u * rotZ;
        const rotateY = -u * rotY;
        const scale = Math.max(0.70, 1 - absU * 0.075);
        const zIndex = Math.round(50 - absU * 8);

        const opacity =
          absU > 2.6 ? Math.max(0, Math.min(1, 1 - (absU - 2.6) * 0.85)) : 1;

        el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`;
        el.style.zIndex = zIndex.toString();
        el.style.opacity = opacity.toString();
        el.style.pointerEvents = absU < 2.0 ? "auto" : "none";
      }

      // Sync active dot without re-render thrashing
      const currentDot = ((Math.round(currentP) % numUnique) + numUnique) % numUnique;
      if (currentDot !== lastDotRef.current) {
        lastDotRef.current = currentDot;
        setActiveDot(currentDot);
      }
    },
    [N, numUnique, dimensions]
  );

  // IntersectionObserver: Trigger smooth entrance once visible and run rAF only when in view
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      isVisibleRef.current = true;
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setHasEntered(true);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Continuous animation loop (with silky smooth spring/decay interpolation for dot clicks)
  useEffect(() => {
    if (prefersReducedMotion) return;

    // Speed: 0.28 card steps per second (calm, luxurious glide)
    const speed = 0.28;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const deltaSec = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Handle smooth animated glide when user clicks a dot
      if (targetProgressRef.current !== null) {
        const diff = targetProgressRef.current - progressRef.current;
        if (Math.abs(diff) < 0.005) {
          progressRef.current = ((targetProgressRef.current % N) + N) % N;
          targetProgressRef.current = null;
          isPausedRef.current = false;
        } else {
          // Smooth exponential ease-out glide
          const step = diff * Math.min(1, deltaSec * 7.5);
          progressRef.current = progressRef.current + step;
        }
        renderCards(progressRef.current);
      } else if (isVisibleRef.current && !isPausedRef.current && !isDraggingRef.current) {
        progressRef.current = (progressRef.current + speed * deltaSec) % N;
        if (progressRef.current < 0) progressRef.current += N;
        renderCards(progressRef.current);
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    // Initial render
    renderCards(progressRef.current);
    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [N, prefersReducedMotion, renderCards]);

  // Interaction Handlers (Hover & Focus Pause / Resume)
  const handleMouseEnter = () => {
    if (targetProgressRef.current === null) {
      isPausedRef.current = true;
    }
  };

  const handleMouseLeave = () => {
    if (!isDraggingRef.current && targetProgressRef.current === null) {
      isPausedRef.current = false;
    }
  };

  const handleFocus = () => {
    isPausedRef.current = true;
  };

  const handleBlur = () => {
    isPausedRef.current = false;
  };

  // Touch & Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    targetProgressRef.current = null;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    hasDraggedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;

    if (Math.abs(e.clientX - startXRef.current) > 5) {
      hasDraggedRef.current = true;
    }

    progressRef.current =
      (progressRef.current - deltaX / dimensions.cardSpacing) % N;
    if (progressRef.current < 0) progressRef.current += N;
    renderCards(progressRef.current);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Smooth next/previous dot glide navigation
  const handleDotClick = (targetIndex: number) => {
    const curP = progressRef.current;
    const currentBase = Math.floor(curP / numUnique) * numUnique;
    let targetP = currentBase + targetIndex;
    if (targetP - curP > numUnique / 2) targetP -= numUnique;
    if (targetP - curP < -numUnique / 2) targetP += numUnique;
    targetProgressRef.current = targetP;
  };

  // Static fallback if prefers-reduced-motion is active
  if (prefersReducedMotion) {
    return (
      <section
        ref={sectionRef}
        id="categories"
        aria-label="PABLO Categories Showcase"
        className="relative w-full py-12 sm:py-16 bg-[#EAE8E1] text-[#111111] overflow-hidden select-none"
      >
        <div className="text-center shrink-0 px-4 mb-6 sm:mb-8">
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#666666] font-medium mb-1.5">
            Maison Portfolio · 2026
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.22em] text-[#111111] inline-block"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
          >
            CATEGORIES
          </h2>
          <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-2.5 opacity-40" />
        </div>

        <div className="page-container w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {MEN_CATEGORIES_DATA.map((category) => (
              <div
                key={category.id}
                className="relative w-full aspect-[3/4.4] rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#181818] shadow-[0_20px_45px_rgba(0,0,0,0.20)] border border-black/10"
              >
                <Link
                  href={category.href}
                  aria-label={`Explore ${category.name} Collection`}
                  className="shiny-card group relative block w-full h-full transition-all duration-500 ease-out hover:-translate-y-[4px]"
                >
                  <Image
                    src={category.imageSrc}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 310px"
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/92 via-black/45 to-transparent pointer-events-none z-10" />
                  <div
                    className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                    }}
                    aria-hidden="true"
                  />
                  <div className="absolute top-4 right-4 z-20 pointer-events-none">
                    <span className="text-[9px] uppercase tracking-[0.22em] text-white/50 font-medium font-sans">
                      PABLO
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-20 pb-6 px-5 text-center flex flex-col items-center">
                    <span className="text-[10px] font-sans font-medium uppercase tracking-[0.26em] text-white/70 block mb-1">
                      COLLECTION
                    </span>
                    <h3
                      className="text-2xl font-normal text-white tracking-[0.06em]"
                      style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
                    >
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="categories"
      aria-label="PABLO Categories Showcase"
      className="relative w-full pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20 bg-[#EAE8E1] text-[#111111] overflow-hidden select-none"
    >
      {/* ─── 1. ELEGANT SECTION HEADER ─── */}
      <div className="text-center shrink-0 px-4 mb-5 sm:mb-7 pointer-events-none">
        <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#666666] font-medium mb-1.5">
          Maison Portfolio · 2026
        </span>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.22em] text-[#111111] inline-block leading-tight"
          style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
        >
          CATEGORIES
        </h2>
        <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-2.5 opacity-40" />
      </div>

      {/* ─── 2. CINEMATIC 3D CURVED CAROUSEL STAGE ─── */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden flex items-center justify-center py-2 cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          height: `${dimensions.cardHeight + dimensions.arcDrop * 1.8 + 24}px`,
          perspective: "1400px",
          transformStyle: "preserve-3d",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Left Edge Luxury Vignette Fade */}
        <div
          className="absolute left-0 inset-y-0 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-[#EAE8E1] via-[#EAE8E1]/85 to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* Right Edge Luxury Vignette Fade */}
        <div
          className="absolute right-0 inset-y-0 w-16 sm:w-28 md:w-40 bg-gradient-to-l from-[#EAE8E1] via-[#EAE8E1]/85 to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* Center Origin Stage: Smooth, cinematic upward glide on entrance (700-900ms cubic-bezier) */}
        <div
          className="relative w-full h-full flex items-start justify-center pt-2"
          style={{
            opacity: prefersReducedMotion ? 1 : hasEntered ? 1 : 0,
            transform: prefersReducedMotion
              ? "none"
              : hasEntered
              ? "translate3d(0, 0px, 0) scale(1.0)"
              : "translate3d(0, 32px, 0) scale(0.97)",
            transition: prefersReducedMotion
              ? "none"
              : "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 850ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: prefersReducedMotion || hasEntered ? "auto" : "opacity, transform",
          }}
        >
          {duplicatedCategories.map((category, index) => (
            <div
              key={`${category.id}-${index}`}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="absolute will-change-transform"
              style={{
                width: `${dimensions.cardWidth}px`,
                height: `${dimensions.cardHeight}px`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <Link
                href={category.href}
                aria-label={`Explore ${category.name} Collection`}
                onClick={(e) => {
                  if (hasDraggedRef.current) {
                    e.preventDefault();
                  }
                }}
                className="shiny-card group relative block w-full h-full rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#181818] shadow-[0_20px_45px_rgba(0,0,0,0.22)] border border-black/10 hover:border-black/30 transition-all duration-500 ease-out hover:-translate-y-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] cursor-pointer select-none"
              >
                {/* Category Photographic Asset */}
                <Image
                  src={category.imageSrc}
                  alt={category.imageAlt}
                  fill
                  sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 310px"
                  priority={index < 2}
                  loading={index < 4 ? "eager" : "lazy"}
                  className="object-cover object-center w-full h-full select-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />

                {/* Top Subtle Vignette */}
                <div
                  className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10 bg-gradient-to-b from-black/45 via-black/15 to-transparent"
                  aria-hidden="true"
                />

                {/* Brand Watermark (Top-Right) */}
                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                  <span className="text-[9px] uppercase tracking-[0.22em] text-white/50 font-medium font-sans">
                    PABLO
                  </span>
                </div>

                {/* Bottom Vignette for High Text Legibility */}
                <div
                  className="absolute inset-x-0 bottom-0 h-44 sm:h-52 pointer-events-none z-10 bg-gradient-to-t from-black/92 via-black/45 to-transparent"
                  aria-hidden="true"
                />

                {/* Ambient vignette: Slightly increase bottom gradient opacity on hover */}
                <div
                  className="absolute inset-x-0 bottom-0 h-44 sm:h-52 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                  }}
                  aria-hidden="true"
                />

                {/* Bottom Typography & Discover Pill */}
                <div className="absolute inset-x-0 bottom-0 z-20 pb-6 sm:pb-7 px-5 sm:px-6 text-center flex flex-col items-center justify-end pointer-events-none">
                  <span className="text-[10px] sm:text-[10.5px] font-sans font-medium uppercase tracking-[0.26em] text-white/70 block mb-1">
                    COLLECTION
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl md:text-[2rem] font-normal text-white tracking-[0.06em] leading-tight mb-3 transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                    }}
                  >
                    {category.name}
                  </h3>

                  {/* Discover Pill */}
                  <div className="transition-all duration-300 flex items-center gap-2 bg-[#EAE8E1] text-[#111111] px-4 py-1.5 rounded-full text-[9.5px] uppercase tracking-[0.22em] font-medium shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>DISCOVER</span>
                    <span className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. ELEGANT CAROUSEL PAGINATION DOTS ─── */}
      <div
        className="flex items-center justify-center gap-2 mt-4 sm:mt-5 pointer-events-auto"
        aria-label="Category Carousel Navigation"
      >
        {MEN_CATEGORIES_DATA.map((cat, idx) => {
          const isActive = activeDot === idx;
          return (
            <button
              key={`dot-${cat.id}`}
              type="button"
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to ${cat.name}`}
              className={`h-1.5 rounded-full transition-all duration-400 ease-out focus:outline-none cursor-pointer ${
                isActive
                  ? "w-7 sm:w-8 bg-[#111111]"
                  : "w-1.5 bg-[#111111]/25 hover:bg-[#111111]/55"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}

export default CategoriesSection;
