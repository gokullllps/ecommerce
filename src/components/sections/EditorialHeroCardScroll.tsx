"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface EditorialCategoryItem {
  id: string;
  label?: string;
  title?: string;
  category: string;
  image: string;
  alt: string;
  objectPosition?: string;
}

export interface EditorialHeroCardScrollProps {
  gender: "men" | "women";
  heroNode: React.ReactNode;
  cards: EditorialCategoryItem[];
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  onCardsVisibilityChange?: (active: boolean) => void;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function EditorialHeroCardScroll({
  gender,
  heroNode,
  cards,
  activeCategory = "all",
  onSelectCategory,
  onCardsVisibilityChange,
}: EditorialHeroCardScrollProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lastActiveRef = useRef<boolean>(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Real-time scroll progress scrubber on outer container
  const updateProgress = useCallback(() => {
    if (!outerRef.current) return;
    const rect = outerRef.current.getBoundingClientRect();
    const outerHeight = outerRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollRange = outerHeight - viewportHeight;
    if (scrollRange <= 0) {
      setProgress(0);
      return;
    }
    const p = Math.min(Math.max(-rect.top / scrollRange, 0), 1);
    setProgress(p);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateProgress();
        rafId = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateProgress();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion, updateProgress]);

  // Coordinate cards presentation state with Navbar (hide during card presentation)
  useEffect(() => {
    const isCardsVisible = progress >= 0.02 && progress < 0.94;
    if (lastActiveRef.current !== isCardsVisible) {
      lastActiveRef.current = isCardsVisible;
      onCardsVisibilityChange?.(isCardsVisible);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("pablo-cards-active", { detail: { active: isCardsVisible } })
        );
      }
    }
  }, [progress, onCardsVisibilityChange]);

  // ─── SCROLL INTERPOLATION VALUES ───────────────────────────────────────────
  // 1. Hero Blur Transition (p: 0.02 -> 0.14): Hero blurs from 0px to 16px
  const blurProgress = prefersReducedMotion
    ? 0
    : progress <= 0.02
    ? 0
    : Math.min(1, (progress - 0.02) / 0.14);
  const blurAmount = easeInOut(blurProgress) * 16;

  // 2. Stack Entrance Opacity (p: 0.03 -> 0.12): The deck fades into view
  const stackEntranceT = prefersReducedMotion
    ? 1
    : Math.min(1, Math.max(0, (progress - 0.03) / 0.09));
  const stackOpacity = easeInOut(stackEntranceT);
  const stackScale = 0.94 + stackOpacity * 0.06;

  // 3. Stack Exit Transition (p: 0.88 -> 0.98): Smoothly exit before unpinning
  const stackExitT = prefersReducedMotion
    ? 0
    : progress >= 0.88
    ? Math.min(1, (progress - 0.88) / 0.09)
    : 0;
  const finalContainerOpacity = stackOpacity * (1 - stackExitT);

  // 4. Discrete card stages with stable plateaus for controlled storytelling:
  // Each card has a dedicated, rock-solid resting plateau where it sits 100% active.
  // In between plateaus is a smooth, concise transition window.
  // This ensures exactly one deliberate scroll step advances exactly one card.
  const numCards = cards.length;
  const maxStackIndex = Math.max(1, numCards - 1);

  // Active progression window: [0.08, 0.88]
  const pActiveStart = 0.08;
  const pActiveEnd = 0.88;
  const numSegments = maxStackIndex; // 3 transitions for 4 cards
  const segSpan = (pActiveEnd - pActiveStart) / numSegments;

  let stageFloat = 0;
  if (!prefersReducedMotion) {
    if (progress <= pActiveStart) {
      stageFloat = 0;
    } else if (progress >= pActiveEnd) {
      stageFloat = maxStackIndex;
    } else {
      const pNorm = (progress - pActiveStart) / (pActiveEnd - pActiveStart);
      const segFloat = pNorm * numSegments;
      const segIndex = Math.min(numSegments - 1, Math.floor(segFloat));
      const segLocal = segFloat - segIndex; // 0.0 -> 1.0 within this segment

      // 60% of segment is stable resting plateau, 40% is smooth transition to next card
      const plateauRatio = 0.60;
      if (segLocal <= plateauRatio) {
        stageFloat = segIndex;
      } else {
        const transT = (segLocal - plateauRatio) / (1.0 - plateauRatio);
        // Smoothstep interpolation (3t^2 - 2t^3)
        const smoothT = transT * transT * (3 - 2 * transT);
        stageFloat = segIndex + smoothT;
      }
    }
  }

  const currentActiveIndex = Math.min(
    maxStackIndex,
    Math.max(0, Math.round(stageFloat))
  );

  const handleCardClick = (e: React.MouseEvent, catId: string) => {
    e.preventDefault();
    if (onSelectCategory) {
      const nextCategory = activeCategory === catId ? "all" : catId;
      onSelectCategory(nextCategory);
    }
    const catalogueEl = document.getElementById("catalogue");
    if (catalogueEl) {
      catalogueEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDotClick = (targetIndex: number) => {
    if (!outerRef.current) return;
    const rect = outerRef.current.getBoundingClientRect();
    const outerTop = window.scrollY + rect.top;
    const outerHeight = outerRef.current.offsetHeight;
    const scrollRange = outerHeight - window.innerHeight;
    // Target progress lands in the center of the card's resting plateau
    let targetP = pActiveStart + (targetIndex + 0.30) * segSpan;
    if (targetIndex >= maxStackIndex) {
      targetP = 0.89;
    }
    window.scrollTo({ top: outerTop + scrollRange * targetP, behavior: "smooth" });
  };

  // ─── REDUCED MOTION STATIC FALLBACK ─────────────────────────────────────────
  if (prefersReducedMotion) {
    return (
      <div className="w-full">
        {heroNode}
        <section id="categories" className="page-container w-full py-8 sm:py-12 bg-[#EAE8E1] text-[#111111]">
          <div className="text-center mb-6 sm:mb-8">
            <span className="block text-[9.5px] sm:text-[10.5px] font-sans uppercase tracking-[0.32em] text-[#666666] font-medium mb-1">
              COLLECTION
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal uppercase tracking-[0.04em] text-[#111111]">
              CATEGORIES
            </h2>
            <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-2.5 opacity-30" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full">
            {cards.map((card) => {
              const isSelected = activeCategory === card.category;
              return (
                <a
                  key={card.id}
                  href={`/${gender}?category=${card.category}`}
                  onClick={(e) => handleCardClick(e, card.category)}
                  className={`group relative block aspect-[0.78/1] overflow-hidden rounded-[20px] bg-[#181818] border transition-all duration-300 ${
                    isSelected
                      ? "border-[#181818] ring-2 ring-[#111111] ring-offset-2 ring-offset-[#EAE8E1]"
                      : "border-[#181818]/15 hover:border-[#181818]"
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="w-full h-full object-cover block"
                    style={{ objectPosition: card.objectPosition || "center center" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex flex-col items-start justify-end">
                    <span className="block font-editorial text-base sm:text-lg font-normal tracking-[0.06em] uppercase text-white leading-tight">
                      {card.label || card.title || card.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-sans tracking-[0.2em] uppercase text-white/80 mt-1">
                      {isSelected ? "VIEWING" : "EXPLORE"} →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // ─── CONTINUOUS SCROLL-PINNED TRANSITION ───────────────────────────────────
  return (
    <div
      ref={outerRef}
      id={`${gender}-hero-scroll-container`}
      className="relative w-full"
      style={{ height: "230vh" }}
    >
      {/*
       * STICKY VIEWPORT: Pinned at 100svh across the 230vh scroll range.
       * Contains:
       *   1. Hero Visual Layer (Original Background + Animated Model + Editorial Typography)
       *      Gradually blurs from 0px to 16px based on scroll. Everything remains intact.
       *   2. iOS Card Stack Overlay: Category Cards stacked with 3D depth, scale, and blur
       *      Dissolves & transitions sequentially based on continuous scroll progress.
       */}
      <section
        id={`${gender}-hero-sticky`}
        aria-label={`PABLO ${gender === "men" ? "Men's" : "Women's"} Showcase`}
        className="sticky top-0 w-full overflow-hidden select-none bg-[#11100E] text-[#111111]"
        style={{ height: "100svh", minHeight: "100svh", backgroundColor: "#11100E" }}
      >
        {/* ══════════════════════════════════════════════════════════════════
            LAYER 1: HERO VISUAL SCENE (ORIGINAL HERO + PROGRESSIVE BLUR)
            Z-INDEX: 0 — Blurs smoothly from 0px to 16px as user scrolls.
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 w-full h-full select-none overflow-hidden"
          style={{
            filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none",
            transform: blurAmount > 0 ? "scale(1.03)" : "none",
            pointerEvents: progress <= 0.05 ? "auto" : "none",
            willChange: blurProgress > 0 && blurProgress < 1 ? "filter, transform" : "auto",
          }}
        >
          {heroNode}

          {/* Subtle Darkening Overlay as Blur Advances */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
            style={{
              backgroundColor: "rgba(17, 16, 14, 0.52)",
              opacity: Math.min(1, blurProgress * 1.3),
            }}
            aria-hidden="true"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            LAYER 2: CINEMATIC iOS CARD STACK OVERLAY (Inspired by Reference Video)
            Z-INDEX: 30 — Emerges directly on top of the pinned blurred hero.
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          id="categories"
          aria-label={`${gender === "men" ? "Men's" : "Women's"} Category Collection`}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4"
          style={{
            opacity: finalContainerOpacity,
            transform: `scale(${stackScale})`,
            pointerEvents: progress >= 0.08 && progress <= 0.90 ? "auto" : "none",
            willChange: "opacity, transform",
          }}
        >
          {/* Header Tag */}
          <div className="text-center mb-4 sm:mb-6 pointer-events-none">
            <span className="block text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.36em] text-white/75 font-medium mb-1">
              CAMPAIGN COLLECTION
            </span>
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.04em] text-white leading-tight"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
            >
              CATEGORIES
            </h2>
          </div>

          {/* The iOS Card Stack Deck */}
          <div className="relative w-[86vw] sm:w-[380px] md:w-[420px] lg:w-[450px] aspect-[4/4.9] max-h-[580px] flex items-center justify-center">
            {cards.map((card, index) => {
              // Compute exact relative position to current discrete stage progress
              const rel = index - stageFloat;
              const isSelected = activeCategory === card.category;

              let scale = 1;
              let translateY = 0;
              let opacity = 1;
              let blur = 0;
              let zIndex = 30;

              if (rel <= -0.01) {
                // EXITED / DISSOLVING CARD (Transitioning up and away in front)
                const exitProgress = Math.min(1, Math.abs(rel));
                scale = 1.0 + exitProgress * 0.08;
                translateY = -exitProgress * 45;
                opacity = Math.max(0, 1.0 - exitProgress * 1.5);
                blur = exitProgress * 12;
                zIndex = 50 + index;
              } else if (rel < 0.99) {
                // ACTIVE FOREGROUND CARD (Blending into full active state)
                scale = 1.0 - rel * 0.08;
                translateY = -rel * 28;
                opacity = 1.0 - rel * 0.15;
                blur = rel * 2.5;
                zIndex = 40;
              } else {
                // STACKED CARDS BEHIND (Peeking out at top with perspective depth)
                const clampedBehind = Math.min(3, rel);
                scale = Math.max(0.76, 1.0 - clampedBehind * 0.075);
                translateY = -clampedBehind * 26;
                opacity = Math.max(0, 0.45 - (clampedBehind - 1) * 0.2);
                blur = clampedBehind * 2.8;
                zIndex = 30 - Math.round(clampedBehind * 5);
              }

              const rawTitle = card.label || card.title || (card as { name?: string }).name || card.category || "";
              const cardTitle = typeof rawTitle === "string" ? rawTitle.toUpperCase() : "";

              return (
                <div
                  key={card.id}
                  className="absolute inset-0 transition-transform duration-100 ease-out"
                  style={{
                    transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                    opacity: Math.max(0, opacity),
                    filter: blur > 0 ? `blur(${blur}px)` : "none",
                    zIndex,
                    pointerEvents: Math.abs(rel) < 0.45 ? "auto" : "none",
                    willChange: "transform, opacity, filter",
                  }}
                >
                  <a
                    href={`/${gender}?category=${card.category}`}
                    onClick={(e) => handleCardClick(e, card.category)}
                    aria-label={`Explore ${cardTitle}`}
                    className={`group relative block w-full h-full rounded-[26px] sm:rounded-[32px] md:rounded-[36px] overflow-hidden bg-[#181818] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] border transition-all duration-300 cursor-pointer select-none ${
                      isSelected
                        ? "border-white ring-2 ring-white ring-offset-2 ring-offset-black/60"
                        : "border-white/20 group-hover:border-white/40"
                    }`}
                  >
                    {/* Category Photographic Asset */}
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="w-full h-full object-cover block select-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      style={{
                        objectPosition: card.objectPosition || "center center",
                      }}
                      loading="eager"
                    />

                    {/* Top Subtle Shadow */}
                    <div
                      className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Bottom Deep Vignette */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-48 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Bottom Card Content: Title + Explore Pill Button */}
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 z-20 flex flex-col items-start justify-end pointer-events-none">
                      <span className="block font-editorial text-2xl sm:text-3xl lg:text-[2.2rem] font-normal tracking-[0.04em] uppercase text-white leading-tight mb-3 transition-transform duration-300 group-hover:-translate-y-0.5">
                        {cardTitle}
                      </span>

                      {/* Explore Pill Button (inspired by reference video) */}
                      <div className="pointer-events-auto">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/30 text-[11px] font-sans tracking-[0.22em] uppercase font-medium transition-all duration-300 ease-out shadow-lg">
                          <span>{isSelected ? "VIEWING" : "EXPLORE"}</span>
                          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Stack Pagination Indicator Dots */}
          <div className="mt-5 sm:mt-6 flex items-center justify-center gap-2.5 z-40">
            {cards.map((card, idx) => {
              const isActive = idx === currentActiveIndex;
              const rawTitle = card.label || card.title || (card as { name?: string }).name || card.category || "";
              const dotTitle = typeof rawTitle === "string" ? rawTitle.toUpperCase() : "";
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleDotClick(idx)}
                  aria-label={`Jump to ${dotTitle}`}
                  className={`transition-all duration-300 ease-out rounded-full cursor-pointer ${
                    isActive
                      ? "w-8 h-2 bg-white"
                      : "w-2 h-2 bg-white/35 hover:bg-white/60"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default EditorialHeroCardScroll;
