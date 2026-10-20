"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HeroSection } from "@/components/sections/HeroSection";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function ScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Real-time scroll scrubber using requestAnimationFrame (zero lag, 100% bidirectional)
  useEffect(() => {
    if (reducedMotion) return;

    let rafId: number | null = null;

    const calculateProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) {
        setProgress(0);
        return;
      }

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollable;
      const clamped = Math.min(Math.max(rawProgress, 0), 1);
      setProgress(clamped);
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        calculateProgress();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  // Reduced motion fallback: display accessible static hero without scroll pinning
  if (reducedMotion) {
    return (
      <div className="w-full bg-[#EAE8E1]">
        <HeroSection />
      </div>
    );
  }

  // --- Choreography Interpolations (p in [0, 1]) ---
  const clamp = (val: number, min = 0, max = 1) => Math.min(Math.max(val, min), max);
  const interpolate = (p: number, pMin: number, pMax: number) =>
    clamp((p - pMin) / (pMax - pMin), 0, 1);

  // 1. Dark Transition Opacity (#181818 layer)
  // Rises 0 -> 1 during p in [0.10, 0.35], holds 1 during p in [0.35, 0.55], falls 1 -> 0 during p in [0.55, 0.90]
  let darkOpacity = 0;
  if (progress < 0.1) {
    darkOpacity = 0;
  } else if (progress <= 0.35) {
    darkOpacity = interpolate(progress, 0.1, 0.35);
  } else if (progress <= 0.55) {
    darkOpacity = 1;
  } else if (progress <= 0.9) {
    darkOpacity = 1 - interpolate(progress, 0.55, 0.9);
  } else {
    darkOpacity = 0;
  }

  // 2. Wordmark Elevation & Scale
  // Holds in optical center during p in [0, 0.35], glides toward top header during p in [0.35, 0.75]
  const wordmarkMoveP = interpolate(progress, 0.35, 0.72);
  const wordmarkY = -wordmarkMoveP * 38; // 0vh -> -38vh upward glide
  const wordmarkScale = 1 - wordmarkMoveP * 0.38; // 1.0 -> 0.62

  // 3. Wordmark Color Shift (Near-black #111111 on ivory -> Ivory #EAE8E1 on dark -> #111111 on ivory hero)
  // ivoryWordmarkOpacity: 1 when on dark surface, 0 when on light surface
  let ivoryWordmarkOpacity = 0;
  if (progress < 0.1) {
    ivoryWordmarkOpacity = 0;
  } else if (progress <= 0.35) {
    ivoryWordmarkOpacity = interpolate(progress, 0.1, 0.35);
  } else if (progress <= 0.55) {
    ivoryWordmarkOpacity = 1;
  } else if (progress <= 0.85) {
    ivoryWordmarkOpacity = 1 - interpolate(progress, 0.55, 0.85);
  } else {
    ivoryWordmarkOpacity = 0;
  }

  // Wordmark overall visibility (seamlessly fades out as the hero's header brand tag takes over at end of sequence)
  const wordmarkVisibility = 1 - interpolate(progress, 0.82, 0.96);

  // 4. Hero Elements Progressive Staggered Emergence
  const heroImageryP = interpolate(progress, 0.52, 0.85);
  const heroHeadlineP = interpolate(progress, 0.62, 0.88);
  const heroBodyP = interpolate(progress, 0.7, 0.94);
  const heroCtasP = interpolate(progress, 0.76, 0.98);
  const heroMetaP = interpolate(progress, 0.68, 0.92);

  // Initial scroll indicator (fades out immediately as scroll begins)
  const hintOpacity = 1 - interpolate(progress, 0, 0.08);

  const isHeroInteractive = progress >= 0.92;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320vh] sm:h-[350vh] bg-[#EAE8E1]"
      style={{ backgroundColor: "#EAE8E1" }}
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#EAE8E1] select-none">
        {/* Layer 1: Dark Transition Background Layer (#181818) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundColor: "#181818",
            opacity: darkOpacity,
            willChange: "opacity",
          }}
        />

        {/* Layer 2: PABLO Wordmark Scrubbed Choreography */}
        <div
          className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
          style={{
            opacity: wordmarkVisibility,
            willChange: "transform, opacity",
          }}
        >
          <div
            className="flex flex-col items-center justify-center -translate-y-[1.5vh]"
            style={{
              transform: `translate3d(0, ${wordmarkY}vh, 0) scale(${wordmarkScale})`,
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            {/* Dual text layers for perfectly crisp, GPU-accelerated color transition */}
            <div className="relative">
              {/* Dark Text Variant (#111111) */}
              <span
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-[0.3em] text-[#111111]"
                style={{
                  fontFamily: "var(--font-display, serif)",
                  color: "#111111",
                  opacity: 1 - ivoryWordmarkOpacity,
                }}
              >
                PABLO
              </span>

              {/* Ivory Text Variant (#EAE8E1) */}
              <span
                className="absolute inset-0 block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-[0.3em] text-[#EAE8E1]"
                style={{
                  fontFamily: "var(--font-display, serif)",
                  color: "#EAE8E1",
                  opacity: ivoryWordmarkOpacity,
                }}
              >
                PABLO
              </span>
            </div>
          </div>
        </div>

        {/* Layer 3: Initial Subtle Scroll Cue */}
        <div
          className="absolute bottom-8 inset-x-0 z-20 flex justify-center pointer-events-none"
          style={{
            opacity: hintOpacity,
            willChange: "opacity",
          }}
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#666666]">
            SCROLL TO EXPLORE ↓
          </span>
        </div>

        {/* Layer 4: Progressive Hero Emergence */}
        <div
          className={`relative z-15 h-full w-full flex flex-col justify-between px-6 sm:px-12 lg:px-20 py-8 sm:py-12 ${
            isHeroInteractive ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{
            color: "#111111",
          }}
        >
          {/* Top Header: Brand Anchor & Collection Tag */}
          <header
            className="w-full flex items-center justify-between border-b border-[#D9D8D3] pb-6 pt-2"
            style={{
              opacity: heroMetaP,
              willChange: "opacity",
            }}
          >
            <span
              className="text-xl sm:text-2xl font-normal tracking-[0.25em] uppercase text-[#111111]"
              style={{ fontFamily: "var(--font-display, serif)" }}
            >
              PABLO
            </span>
            <div className="flex items-center space-x-6 text-xs uppercase tracking-[0.2em] text-[#666666]">
              <span>EDITION 01</span>
              <span className="hidden sm:inline-block text-[#D9D8D3]">/</span>
              <span className="hidden sm:inline-block">AUTUMN / WINTER</span>
            </div>
          </header>

          {/* Main Hero Showcase Grid */}
          <div className="w-full my-auto py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 pr-0 lg:pr-8">
              {/* Category Subhead */}
              <div
                style={{
                  opacity: heroHeadlineP,
                  transform: `translate3d(0, ${(1 - heroHeadlineP) * 20}px, 0)`,
                  willChange: "transform, opacity",
                }}
              >
                <span className="text-xs uppercase tracking-[0.3em] text-[#666666] font-medium">
                  NEW PERSPECTIVES
                </span>
                <h1
                  className="mt-2 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.05] text-[#111111]"
                  style={{ fontFamily: "'Orborn', sans-serif" }}
                >
                  THE ARCHITECTURE OF SILENCE
                </h1>
              </div>

              {/* Supporting Copy */}
              <p
                className="max-w-xl text-sm sm:text-base leading-relaxed text-[#666666] font-light"
                style={{
                  opacity: heroBodyP,
                  transform: `translate3d(0, ${(1 - heroBodyP) * 16}px, 0)`,
                  willChange: "transform, opacity",
                }}
              >
                A restrained exploration of proportion, texture, and sartorial
                precision. Crafted for the modern silhouette with uncompromising
                luxury.
              </p>

              {/* Action Buttons */}
              <div
                className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2"
                style={{
                  opacity: heroCtasP,
                  transform: `translate3d(0, ${(1 - heroCtasP) * 12}px, 0)`,
                  willChange: "transform, opacity",
                }}
              >
                <button
                  type="button"
                  className="px-8 py-3.5 pablo-btn-dark text-xs uppercase tracking-[0.2em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#181818]"
                >
                  EXPLORE COLLECTION
                </button>
                <button
                  type="button"
                  className="px-8 py-3.5 border border-[#D9D8D3] text-[#111111] text-xs uppercase tracking-[0.2em] hover:border-[#111111] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                >
                  VIEW CAMPAIGN
                </button>
              </div>
            </div>

            {/* Right Column: Fashion Imagery Slot */}
            <div
              className="lg:col-span-5 flex items-center justify-center"
              style={{
                opacity: heroImageryP,
                transform: `translate3d(0, ${(1 - heroImageryP) * 32}px, 0) scale(${0.95 + heroImageryP * 0.05})`,
                willChange: "transform, opacity",
              }}
            >
              <div className="relative w-full aspect-[3/4] max-w-md lg:max-w-none bg-[#EAE8E1] border border-[#D9D8D3] overflow-hidden flex items-center justify-center">
                <div className="text-center p-6 space-y-2 select-none">
                  <span className="block text-xs uppercase tracking-[0.25em] text-[#666666]">
                    EDITORIAL CAMPAIGN IMAGE
                  </span>
                  <span className="block text-[11px] uppercase tracking-widest text-[#999999]">
                    ASPECT 3:4 / HIGH RESOLUTION
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Metadata */}
          <footer
            className="w-full flex items-center justify-between border-t border-[#D9D8D3] pt-6 pb-2 text-xs uppercase tracking-[0.2em] text-[#666666]"
            style={{
              opacity: heroMetaP,
              willChange: "opacity",
            }}
          >
            <span>PABLO HAUTE COUTURE</span>
            <span className="hidden sm:inline-block">SCROLL TO DISCOVER ↓</span>
            <span>© 2026</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
