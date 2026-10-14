"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { MEN_CATEGORIES_DATA } from "@/data/categories";

export function CategoriesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [dimensions, setDimensions] = useState({
    cardWidth: 305,
    cardHeight: 460,
    cardSpacing: 275,
    arcDrop: 28,
    rotZ: 6.2,
    rotY: 9.5,
  });

  // 24 cards pool (12 duplicated twice) for mathematically seamless, infinite looping
  const duplicatedCategories = [...MEN_CATEGORIES_DATA, ...MEN_CATEGORIES_DATA];
  const N = duplicatedCategories.length;

  // Track responsive dimensions
  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    if (w < 640) {
      setDimensions({
        cardWidth: 220,
        cardHeight: 330,
        cardSpacing: 185,
        arcDrop: 18,
        rotZ: 4.8,
        rotY: 6.5,
      });
    } else if (w < 1024) {
      setDimensions({
        cardWidth: 260,
        cardHeight: 390,
        cardSpacing: 225,
        arcDrop: 24,
        rotZ: 5.6,
        rotY: 8.0,
      });
    } else {
      setDimensions({
        cardWidth: 305,
        cardHeight: 460,
        cardSpacing: 275,
        arcDrop: 28,
        rotZ: 6.2,
        rotY: 9.5,
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

  // Direct DOM render function for silky 120fps continuous curved track animation
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

        // Cull cards far outside view
        if (absU > 4.4) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.style.visibility = "hidden";
          continue;
        }

        el.style.visibility = "visible";

        // Curved 3D Arc Math matching the reference video (jitter.video Orbit)
        const translateX = u * cardSpacing;
        const translateY = Math.pow(absU, 1.45) * arcDrop;
        const rotateZ = u * rotZ;
        const rotateY = -u * rotY;
        const scale = Math.max(0.68, 1 - absU * 0.08);
        const zIndex = Math.round(50 - absU * 8);

        // Subtle depth blur & smooth edge fadeout
        const blur = absU > 1.3 ? Math.min(6, (absU - 1.3) * 1.6) : 0;
        const opacity =
          absU > 2.8 ? Math.max(0, Math.min(1, 1 - (absU - 2.8) * 0.75)) : 1;

        el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`;
        el.style.zIndex = zIndex.toString();
        el.style.opacity = opacity.toString();
        el.style.filter = blur > 0.1 ? `blur(${blur}px)` : "none";
        el.style.pointerEvents = absU < 2.5 ? "auto" : "none";
      }
    },
    [N, dimensions]
  );

  // Continuous animation loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    // Speed: 0.32 card steps per second (luxurious, calm ~3.1s per category glide)
    const speed = 0.32;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (!isPausedRef.current && !isDraggingRef.current) {
        // Advance continuously
        progressRef.current = (progressRef.current + speed * deltaSec) % N;
        if (progressRef.current < 0) progressRef.current += N;
      }

      renderCards(progressRef.current);
      animFrameIdRef.current = requestAnimationFrame(tick);
    };

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
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    if (!isDraggingRef.current) {
      isPausedRef.current = false;
    }
  };

  const handleFocus = () => {
    isPausedRef.current = true;
  };

  const handleBlur = () => {
    isPausedRef.current = false;
  };

  // Touch & Pointer Drag Handlers (Smooth manual gliding)
  const handlePointerDown = (e: React.PointerEvent) => {
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

    // Move progress in proportion to drag
    progressRef.current =
      (progressRef.current - deltaX / dimensions.cardSpacing) % N;
    if (progressRef.current < 0) progressRef.current += N;
    renderCards(progressRef.current);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    // Allow animation to resume if pointer is not over container
  };

  // Static fallback if prefers-reduced-motion is active
  if (prefersReducedMotion) {
    return (
      <section
        id="categories"
        aria-label="PABLO Categories Showcase"
        className="relative w-full py-16 sm:py-24 bg-[#EAE8E1] text-[#111111] overflow-hidden select-none"
      >
        <div className="text-center shrink-0 px-4 mb-8 sm:mb-12">
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#666666] font-medium mb-2.5">
            Maison Portfolio · 2026
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.22em] text-[#111111] inline-block"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
          >
            CATEGORIES
          </h2>
          <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-3.5 opacity-40" />
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
                  className="group relative block w-full h-full"
                >
                  <Image
                    src={category.imageSrc}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/92 via-black/45 to-transparent pointer-events-none" />
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
      id="categories"
      aria-label="PABLO Categories Showcase"
      className="relative w-full py-16 sm:py-24 bg-[#EAE8E1] text-[#111111] overflow-hidden select-none"
    >
      {/* ─── 1. SECTION HEADER ─── */}
      <div className="text-center shrink-0 px-4 mb-8 sm:mb-12 pointer-events-none">
        <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#666666] font-medium mb-2.5">
          Maison Portfolio · 2026
        </span>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.22em] text-[#111111] inline-block"
          style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
        >
          CATEGORIES
        </h2>
        <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-3.5 opacity-40" />
      </div>

      {/* ─── 2. CINEMATIC 3D CURVED CAROUSEL STAGE ─── */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden flex items-center justify-center py-4 cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          height: `${dimensions.cardHeight + dimensions.arcDrop * 3.5 + 40}px`,
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
          className="absolute left-0 inset-y-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#EAE8E1] via-[#EAE8E1]/80 to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* Right Edge Luxury Vignette Fade */}
        <div
          className="absolute right-0 inset-y-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#EAE8E1] via-[#EAE8E1]/80 to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* Center Origin Stage */}
        <div className="relative w-full h-full flex items-start justify-center pt-2">
          {duplicatedCategories.map((category, index) => (
            <div
              key={`${category.id}-${index}`}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="absolute will-change-transform transition-[filter] duration-200"
              style={{
                width: `${dimensions.cardWidth}px`,
                height: `${dimensions.cardHeight}px`,
                transformStyle: "preserve-3d",
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
                className="group relative block w-full h-full rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#181818] shadow-[0_22px_50px_rgba(0,0,0,0.22)] border border-black/10 hover:border-black/30 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] cursor-pointer select-none"
              >
                {/* Category Photographic Asset */}
                <Image
                  src={category.imageSrc}
                  alt={category.imageAlt}
                  fill
                  sizes="(max-width: 768px) 70vw, 360px"
                  priority={index < 3}
                  className="object-cover object-center w-full h-full select-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
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

                {/* Bottom Typography & Discover Pill */}
                <div className="absolute inset-x-0 bottom-0 z-20 pb-6 sm:pb-8 px-5 sm:px-6 text-center flex flex-col items-center justify-end pointer-events-none">
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
    </section>
  );
}

export default CategoriesSection;
