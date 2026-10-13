"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { PromotionalTicker } from "@/components/ui/PromotionalTicker";
import { HeroSaleStamp } from "@/components/ui/HeroSaleStamp";
import { CollectionCard } from "@/components/ui/CollectionCard";
import collectionsData from "@/data/collections.json";
import { AdminCollection } from "@/types/admin";

export interface HeroSectionProps {
  isIntroActive?: boolean;
  onCardsVisibilityChange?: (active: boolean) => void;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

type ModelFadeState = "initial-settle" | "initial-exit" | "female" | "male";

export function HeroSection({ isIntroActive = false, onCardsVisibilityChange }: HeroSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Staged entrance phases for hero elements
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(isIntroActive ? 0 : 3);
  const [mobilePhase, setMobilePhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(isIntroActive ? 0 : 5);
  const sequenceStartedRef = useRef(false);

  // Model animation cycle: female entrance -> hold -> exit -> male -> female loop
  const [modelState, setModelState] = useState<ModelFadeState>("initial-settle");
  const [cycleKey, setCycleKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const lastActiveRef = useRef<boolean>(false);

  // Load the 3 editorial collections
  const editorialCollections: AdminCollection[] = (
    collectionsData as unknown as AdminCollection[]
  )
    .filter((c) => c.status === "active" || !c.status)
    .slice(0, 3);

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
    const isCardsVisible = progress >= 0.12 && progress < 0.95;
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

  // Hero entrance sequence on fresh load or after intro completes
  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase(3);
      setMobilePhase(5);
      return;
    }

    if (sequenceStartedRef.current) return;

    if (!isIntroActive) {
      sequenceStartedRef.current = true;
      const t1 = setTimeout(() => setPhase(1), 50);
      const t2 = setTimeout(() => setPhase(2), 250);
      const t3 = setTimeout(() => setPhase(3), 600);

      const m1 = setTimeout(() => setMobilePhase(1), 150);
      const m2 = setTimeout(() => setMobilePhase(2), 250);
      const m3 = setTimeout(() => setMobilePhase(3), 350);
      const m4 = setTimeout(() => setMobilePhase(4), 1000);
      const m5 = setTimeout(() => setMobilePhase(5), 1150);

      timeoutsRef.current.push(t1, t2, t3, m1, m2, m3, m4, m5);
    }
  }, [isIntroActive, prefersReducedMotion]);

  // Automatic model switching cycle: female settled -> exit right -> male enters left -> female enters left ...
  useEffect(() => {
    if (phase < 3 || prefersReducedMotion) return;

    let isMounted = true;
    let exitTimer: NodeJS.Timeout | null = null;
    let loopInterval: NodeJS.Timeout | null = null;

    // Hold the initial settled female model for 2.4s, exit softly to the right, and start loop
    const initialHoldTimer = setTimeout(() => {
      if (!isMounted) return;
      setModelState("initial-exit");

      exitTimer = setTimeout(() => {
        if (!isMounted) return;
        setModelState("male");
        setCycleKey((k) => k + 1);

        loopInterval = setInterval(() => {
          if (!isMounted) return;
          setModelState((current) => (current === "male" ? "female" : "male"));
          setCycleKey((k) => k + 1);
        }, 3000);

        timerRef.current = loopInterval;
      }, 500);

      timeoutsRef.current.push(exitTimer);
    }, 2400);

    timeoutsRef.current.push(initialHoldTimer);

    return () => {
      isMounted = false;
      clearTimeout(initialHoldTimer);
      if (exitTimer) clearTimeout(exitTimer);
      if (loopInterval) clearInterval(loopInterval);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, prefersReducedMotion]);

  // Clean up all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // ─── SCROLL INTERPOLATION VALUES ───────────────────────────────────────────
  // Stage 1 (p <= 0.05): Original hero, completely sharp (blur 0px)
  // Stage 2 (p: 0.05 -> 0.38): Hero scene gradually blurs from 0px to 14px
  // Stage 3 & 4 (p >= 0.38): Hero scene stays blurred at 14px behind cards
  const blurProgress = prefersReducedMotion
    ? 0
    : progress <= 0.05
    ? 0
    : Math.min(1, (progress - 0.05) / 0.33);
  const blurAmount = easeInOut(blurProgress) * 14;

  // Hero interactive controls (CTAs and overlines) fade out as blur starts
  const heroUiFade = prefersReducedMotion
    ? 1
    : progress <= 0.05
    ? 1
    : Math.max(0, 1 - (progress - 0.05) / 0.18);

  // Ticker slides down and fades out during stage 2
  const tickerProgress = prefersReducedMotion
    ? 0
    : progress <= 0.05
    ? 0
    : Math.min(1, (progress - 0.05) / 0.18);
  const tickerTranslateY = tickerProgress * 105;
  const tickerOpacity = 1 - tickerProgress;

  // Stage 3: Collection cards enter from below (starts at 0.28, settles by 0.72)
  const cardsRawProgress = prefersReducedMotion
    ? 1
    : progress <= 0.28
    ? 0
    : Math.min(1, (progress - 0.28) / 0.44);

  // Coordinated staggered entrance for the 3 cards
  const cardStagger = 0.035;
  const cardStates = [0, 1, 2].map((idx) => {
    if (prefersReducedMotion) {
      return { translateY: "0vh", opacity: 1, scale: 1 };
    }
    const t = Math.min(
      1,
      Math.max(0, (cardsRawProgress - idx * cardStagger) / (1 - 2 * cardStagger))
    );
    const e = easeOutCubic(t);
    const translateY = `${(1 - e) * 40}vh`;
    const opacity = Math.min(1, e * 1.85);
    const scale = 0.95 + e * 0.05;
    return { translateY, opacity, scale };
  });

  // Collections section header entrance
  const headerT = prefersReducedMotion
    ? 1
    : Math.min(1, Math.max(0, (cardsRawProgress - 0.25) / 0.45));
  const headerOpacity = easeInOut(headerT);
  const headerTranslateY = (1 - easeInOut(headerT)) * -18;

  // CTA button click handler (scroll to settled collections position)
  const handleScrollToCards = () => {
    if (outerRef.current) {
      const rect = outerRef.current.getBoundingClientRect();
      const outerTop = window.scrollY + rect.top;
      const outerHeight = outerRef.current.offsetHeight;
      const targetScroll = outerTop + (outerHeight - window.innerHeight) * 0.82;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  // ─── REDUCED MOTION STATIC FALLBACK ─────────────────────────────────────────
  if (prefersReducedMotion) {
    return (
      <div className="w-full">
        {/* Static Original Hero */}
        <section
          ref={containerRef}
          id="hero"
          aria-label="PABLO Luxury Fashion Showcase"
          className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden flex flex-col justify-between select-none bg-[#11100E] text-[#111111]"
          style={{ height: "100svh", minHeight: "100svh", backgroundColor: "#11100E" }}
        >
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-cover bg-center select-none" aria-hidden="true">
            <Image src="/images/pablo-hero-bg-editorial.jpg" alt="PABLO Luxury Fashion Campaign" fill priority sizes="100vw" className="object-cover object-center w-full h-full select-none" />
          </div>
          <div className="hidden md:flex absolute inset-0 items-center justify-between px-8 md:px-16 pointer-events-none z-10 select-none">
            <span className="font-normal text-[#111111] leading-none whitespace-nowrap" style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: "clamp(6.5rem, 23vw, 29rem)" }}>PA</span>
            <span className="font-normal text-[#111111] leading-none whitespace-nowrap" style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)", fontSize: "clamp(6.5rem, 23vw, 29rem)" }}>BLO</span>
          </div>
          <div className="absolute inset-0 pointer-events-none z-20 flex items-end justify-center pb-3">
            <div className="relative flex items-end justify-center -ml-[10vw] sm:-ml-[14vw] lg:-ml-[15vw]">
              <Image src="/images/woman-main-hero.png" alt="PABLO Luxury Fashion Campaign — Female Model" width={666} height={1024} priority unoptimized className="object-contain object-bottom w-auto select-none h-[66vh] sm:h-[72vh] md:h-[76vh] lg:h-[80vh] max-h-[840px]" />
            </div>
          </div>
          <PromotionalTicker />
        </section>

        {/* Static Collections Section */}
        <section id="editorial-collections" className="w-full py-16 sm:py-24 bg-[#EAE8E1] text-[#111111]">
          <div className="page-container w-full">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 pb-4 border-b border-[#D9D8D3]">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#666666] font-medium block mb-2">CAMPAIGN EDITIONS · AUTUMN / WINTER 2026</span>
                <h2 className="text-3xl sm:text-5xl font-normal uppercase tracking-[0.04em] text-[#111111]" style={{ fontFamily: "var(--font-editorial, 'Cormorant Garamond', serif)" }}>COLLECTIONS</h2>
              </div>
              <Link href="/men" className="mt-4 md:mt-0 text-xs uppercase tracking-[0.24em] font-medium text-[#111111]">VIEW ALL →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {editorialCollections.map((col, index) => (
                <CollectionCard key={col.id || col.slug || index} collection={col} index={index} forceVisible={true} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ─── CONTINUOUS SCROLL-DRIVEN TRANSITION ─────────────────────────────────────
  return (
    <div
      ref={outerRef}
      id="hero-scroll-container"
      className="relative w-full"
      style={{ height: "300vh" }}
    >
      {/*
       * STICKY VIEWPORT: Pinned at 100svh across the 300vh scroll range.
       * Contains:
       *   1. Hero Visual Layer (Original Background + Animated Model Sequence + PABLO Typography)
       *      Gradually blurs from 0px to 14px based on scroll. Background & model sequence remain visible.
       *   2. Hero UI Layer (CTAs, overlines, sale stamp)
       *   3. Collection Layer: 3 Rounded Cards + Editorial Header
       *      Rises upward from below over the blurred hero.
       *   4. Promotional Ticker
       */}
      <section
        ref={containerRef}
        id="hero"
        aria-label="PABLO Luxury Fashion Showcase"
        className="sticky top-0 w-full overflow-hidden select-none bg-[#11100E] text-[#111111]"
        style={{ height: "100svh", minHeight: "100svh", backgroundColor: "#11100E" }}
      >
        {/* ══════════════════════════════════════════════════════════════════
            LAYER 1: HERO VISUAL SCENE (BACKGROUND + TYPOGRAPHY + ANIMATED MODELS)
            Z-INDEX: 0 — Blurs smoothly from 0px to 14px as user scrolls.
            The original background and animated model sequence remain visible.
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
          style={{
            filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none",
            transform: blurAmount > 0 ? "scale(1.03)" : "none",
            willChange: blurProgress > 0 && blurProgress < 1 ? "filter, transform" : "auto",
          }}
          aria-hidden="true"
        >
          {/* ── UNCHANGED ORIGINAL HERO BACKGROUND ── */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Image
              src="/images/pablo-hero-bg-editorial.jpg"
              alt="PABLO Luxury Fashion Campaign"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center w-full h-full select-none"
            />
          </div>

          {/* Top Shadow Vignette */}
          <div
            className="absolute inset-x-0 top-0 h-28 sm:h-36 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(17,16,14,0.75) 0%, rgba(17,16,14,0.3) 55%, transparent 100%)",
            }}
          />

          {/* Bottom subtle vignette */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to top, rgba(17,16,14,0.45) 0%, transparent 100%)",
            }}
          />

          {/* ── DESKTOP PABLO TYPOGRAPHY (Part of blurred scene) ───────── */}
          <div className="hidden md:flex absolute inset-0 items-center justify-between pointer-events-none z-10 select-none overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16">
            <span
              className="font-normal text-[#111111] leading-none whitespace-nowrap select-none tracking-[0.03em] sm:tracking-[0.05em] lg:tracking-[0.06em] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                fontSize: "clamp(6.5rem, 23vw, 29rem)",
                fontWeight: 400,
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1 ? "translateY(0)" : "translateY(10px)",
              }}
            >
              PA
            </span>

            <span
              className="font-normal text-[#111111] leading-none whitespace-nowrap select-none tracking-[0.03em] sm:tracking-[0.05em] lg:tracking-[0.06em] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                fontSize: "clamp(6.5rem, 23vw, 29rem)",
                fontWeight: 400,
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1 ? "translateY(0)" : "translateY(10px)",
              }}
            >
              BLO
            </span>
          </div>

          {/* ── DESKTOP ANIMATED MODEL SEQUENCE (Female entrance -> hold -> exit -> male -> female loop) ── */}
          <div className="hidden md:flex absolute inset-0 pointer-events-none z-20 items-end justify-center pb-3 sm:pb-4 lg:pb-5">
            <div className="relative flex items-end justify-center -ml-[10vw] sm:-ml-[14vw] lg:-ml-[15vw]">
              <div className="absolute bottom-1 w-64 sm:w-72 lg:w-80 h-3 rounded-[100%] bg-[#111111]/30 blur-[4px] pointer-events-none z-0" aria-hidden="true" />

              <div className="relative bottom-0 flex items-end z-10">
                {/* 1. INITIAL FEMALE ENTRANCE & SETTLE */}
                {modelState === "initial-settle" && (
                  <div
                    className="transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
                      transform:
                        phase >= 2 || prefersReducedMotion
                          ? "translate3d(0, 0, 0)"
                          : "translate3d(-30px, 0, 0)",
                    }}
                  >
                    <Image
                      src="/images/woman-main-hero.png"
                      alt="PABLO Luxury Fashion Campaign — Female Model"
                      width={666}
                      height={1024}
                      priority
                      unoptimized
                      className="object-contain object-bottom w-auto select-none h-[66vh] sm:h-[72vh] md:h-[76vh] lg:h-[80vh] max-h-[840px]"
                    />
                  </div>
                )}

                {/* 2. INITIAL EXIT OF SETTLED FEMALE MODEL (Soft fade out toward right) */}
                {modelState === "initial-exit" && (
                  <div className="animate-model-initial-fadeout">
                    <Image
                      src="/images/woman-main-hero.png"
                      alt="PABLO Luxury Fashion Campaign — Female Model"
                      width={666}
                      height={1024}
                      priority
                      unoptimized
                      className="object-contain object-bottom w-auto select-none h-[66vh] sm:h-[72vh] md:h-[76vh] lg:h-[80vh] max-h-[840px]"
                    />
                  </div>
                )}

                {/* 3. MALE MODEL ENTRANCE (Fade in from left -> visible -> fade out to right) */}
                {modelState === "male" && (
                  <div key={`male-${cycleKey}`} className="animate-model-subtle-fade">
                    <Image
                      src="/images/main-hero.png"
                      alt="PABLO Luxury Fashion Campaign — Male Model"
                      width={403}
                      height={619}
                      priority
                      unoptimized
                      className="object-contain object-bottom w-auto select-none h-[66vh] sm:h-[72vh] md:h-[76vh] lg:h-[80vh] max-h-[840px]"
                    />
                  </div>
                )}

                {/* 4. FEMALE MODEL RE-ENTRANCE IN LOOP */}
                {modelState === "female" && (
                  <div key={`female-${cycleKey}`} className="animate-model-subtle-fade">
                    <Image
                      src="/images/woman-main-hero.png"
                      alt="PABLO Luxury Fashion Campaign — Female Model"
                      width={666}
                      height={1024}
                      priority
                      unoptimized
                      className="object-contain object-bottom w-auto select-none h-[66vh] sm:h-[72vh] md:h-[76vh] lg:h-[80vh] max-h-[840px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── MOBILE MODEL & TYPOGRAPHY STAGE (< md) ─────────────────── */}
          <div className="flex md:hidden absolute inset-0 items-center justify-center pointer-events-none z-20">
            {/* Mobile PABLO typography */}
            <span
              className="absolute font-normal text-[#111111] tracking-[0.06em] sm:tracking-[0.08em] leading-none whitespace-nowrap z-10 transition-all duration-800 ease-out"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                fontSize: "clamp(5.8rem, 27vw, 8rem)",
                opacity: mobilePhase >= 2 || prefersReducedMotion ? 1 : 0,
                transform: mobilePhase >= 2 || prefersReducedMotion ? "scale(1)" : "scale(0.97)",
              }}
            >
              PABLO
            </span>

            {/* Mobile animated model */}
            <div className="relative z-20 flex flex-col items-center justify-end h-full w-auto">
              <div className="absolute bottom-12 w-36 sm:w-40 h-2.5 rounded-[100%] bg-[#111111]/20 blur-[2px] z-0" aria-hidden="true" />
              <div className="absolute bottom-12 flex items-end justify-center h-full">
                {modelState === "initial-settle" && (
                  <div
                    className="transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: mobilePhase >= 3 || prefersReducedMotion ? 1 : 0,
                      transform: mobilePhase >= 3 || prefersReducedMotion ? "translate3d(0, 0, 0)" : "translate3d(-25vw, 0, 0)",
                    }}
                  >
                    <Image
                      src="/images/woman-main-hero.png"
                      alt="PABLO Luxury Fashion Campaign — Female Model"
                      width={666}
                      height={1024}
                      priority
                      unoptimized
                      className="object-contain object-bottom w-auto h-[330px] sm:h-[360px] max-h-[365px] select-none pointer-events-none drop-shadow-sm"
                    />
                  </div>
                )}
                {modelState === "initial-exit" && (
                  <div className="animate-model-initial-fadeout">
                    <Image
                      src="/images/woman-main-hero.png"
                      alt="PABLO Luxury Fashion Campaign — Female Model"
                      width={666}
                      height={1024}
                      priority
                      unoptimized
                      className="object-contain object-bottom w-auto h-[330px] sm:h-[360px] max-h-[365px] select-none pointer-events-none drop-shadow-sm"
                    />
                  </div>
                )}
                {modelState === "male" && (
                  <div key={`mob-male-${cycleKey}`} className="animate-model-subtle-fade">
                    <Image
                      src="/images/main-hero.png"
                      alt="PABLO Luxury Fashion Campaign — Male Model"
                      width={403}
                      height={619}
                      priority
                      unoptimized
                      className="object-contain object-bottom w-auto h-[330px] sm:h-[360px] max-h-[365px] select-none pointer-events-none drop-shadow-sm"
                    />
                  </div>
                )}
                {modelState === "female" && (
                  <div key={`mob-female-${cycleKey}`} className="animate-model-subtle-fade">
                    <Image
                      src="/images/woman-main-hero.png"
                      alt="PABLO Luxury Fashion Campaign — Female Model"
                      width={666}
                      height={1024}
                      priority
                      unoptimized
                      className="object-contain object-bottom w-auto h-[330px] sm:h-[360px] max-h-[365px] select-none pointer-events-none drop-shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preload both images to prevent any blank frames or decoding delay */}
          <div className="sr-only" aria-hidden="true">
            <Image src="/images/woman-main-hero.png" alt="" width={666} height={1024} priority unoptimized />
            <Image src="/images/main-hero.png" alt="" width={403} height={619} priority unoptimized />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            LAYER 2: HERO UI CONTROLS & EDITORIAL DETAILS
            Z-INDEX: 10 — Overlines, Sale Stamp, CTA buttons.
            Fades out smoothly during stage 2 as blur sets in.
        ═══════════════════════════════════════════════════════════════════ */}
        {/* Mobile UI (< md) */}
        <div
          className="flex md:hidden relative flex-1 min-h-0 flex-col justify-between w-full overflow-hidden select-none px-4 pt-16 sm:pt-20 pb-2 z-10 transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: heroUiFade,
            pointerEvents: heroUiFade > 0.4 ? "auto" : "none",
          }}
        >
          {/* Dedicated Mobile Visual Stage Placeholder with Stamp & Star */}
          <div className="relative w-full h-[345px] sm:h-[375px] flex items-center justify-center mt-2.5 sm:mt-3 shrink-0">
            {/* Slender Diamond Star on Left Margin */}
            <div
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-700 ease-out"
              style={{
                opacity: mobilePhase >= 4 || prefersReducedMotion ? 0.75 : 0,
                transform: mobilePhase >= 4 || prefersReducedMotion ? "translateY(-50%)" : "translateY(-40%)",
              }}
            >
              <svg width="18" height="42" viewBox="0 0 18 42" fill="none" className="text-[#111111]" aria-hidden="true">
                <line x1="9" y1="0" x2="9" y2="42" stroke="currentColor" strokeWidth="0.75" />
                <line x1="0" y1="21" x2="18" y2="21" stroke="currentColor" strokeWidth="0.75" />
                <polygon points="9,14 11,21 9,28 7,21" fill="currentColor" />
                <polygon points="2,21 9,19 16,21 9,23" fill="currentColor" />
              </svg>
            </div>

            {/* Circular SALE Stamp in Upper Right */}
            <div className="absolute right-0 sm:right-1 top-1 z-30 pointer-events-auto">
              <HeroSaleStamp
                isVisible={mobilePhase >= 4 || prefersReducedMotion}
                className="static !top-0 !right-0 scale-[0.68] sm:scale-75 origin-top-right"
              />
            </div>
          </div>

          {/* Lower Editorial Details Row */}
          <div className="w-full flex items-end justify-between px-1 mt-3 sm:mt-3.5 z-20 shrink-0">
            <div
              className="text-left transition-all duration-700 ease-out"
              style={{
                opacity: mobilePhase >= 4 || prefersReducedMotion ? 1 : 0,
                transform: mobilePhase >= 4 || prefersReducedMotion ? "translateY(0)" : "translateY(4px)",
              }}
            >
              <p className="text-[9.5px] sm:text-[10px] tracking-[0.2em] font-sans font-semibold text-[#111111] uppercase leading-[1.3]">
                LUXURY<br />BEYOND<br />TRENDS.
              </p>
              <div className="w-6 h-[1px] bg-[#111111] mt-1 opacity-80" />
            </div>

            <div
              className="text-right transition-all duration-700 ease-out"
              style={{
                opacity: mobilePhase >= 4 || prefersReducedMotion ? 1 : 0,
                transform: mobilePhase >= 4 || prefersReducedMotion ? "translateY(0)" : "translateY(4px)",
              }}
            >
              <p className="text-[9.5px] sm:text-[10px] tracking-[0.2em] font-sans font-semibold text-[#111111] uppercase leading-[1.3]">
                CLOTHING<br />FOR A BOLDER<br />TOMORROW.
              </p>
            </div>
          </div>

          {/* Bottom: Primary CTA + Secondary Link */}
          <div
            className="w-full flex flex-col items-center gap-2 z-20 mt-3.5 sm:mt-4 shrink-0 transition-all duration-700 ease-out"
            style={{
              opacity: mobilePhase >= 5 || prefersReducedMotion ? 1 : 0,
              transform: mobilePhase >= 5 || prefersReducedMotion ? "translateY(0)" : "translateY(6px)",
            }}
          >
            <button
              type="button"
              onClick={handleScrollToCards}
              className="group w-[90%] max-w-[340px] py-3.5 min-h-[46px] bg-[#181818]/90 active:bg-[#FFFFFF] text-[#FFFFFF] active:text-[#181818] border border-white/25 active:border-white backdrop-blur-sm text-xs font-sans tracking-[0.24em] uppercase font-medium transition-all duration-300 ease-out shadow-lg cursor-pointer select-none text-center flex items-center justify-center gap-2.5"
            >
              <span>EXPLORE COLLECTION</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-xs">→</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const target = document.getElementById("campaign") || document.getElementById("new-in");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 py-1 text-[11px] font-sans tracking-[0.22em] uppercase font-medium text-[#111111] hover:text-[#666666] active:opacity-70 transition-colors cursor-pointer select-none"
            >
              <span>VIEW CAMPAIGN</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Desktop UI (>= md) */}
        <div
          className="hidden md:flex absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: heroUiFade,
            pointerEvents: heroUiFade > 0.4 ? "auto" : "none",
          }}
        >
          <div className="page-container relative h-full flex flex-col justify-between pt-16 sm:pt-20 lg:pt-22 pb-4 sm:pb-9 lg:pb-12 pointer-events-none">
            {/* Top Row: Vintage Sale Stamp on right */}
            <div className="flex items-start justify-end w-full pointer-events-none">
              <div className="pointer-events-auto">
                <HeroSaleStamp isVisible={phase >= 3} />
              </div>
            </div>

            {/* Bottom Row: Discovery Scroll Cue on left, CTAs on right */}
            <div className="hidden sm:flex items-end justify-between w-full pointer-events-none">
              <div
                className="pointer-events-auto transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: phase >= 3 ? 1 : 0,
                  transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
                  transitionDelay: "120ms",
                }}
              >
                <button
                  type="button"
                  onClick={handleScrollToCards}
                  className="group inline-flex items-center gap-2 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#111111]/85 hover:text-[#111111] font-normal transition-colors cursor-pointer text-left select-none"
                >
                  <span>Scroll to Discover</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5 text-[10px]" aria-hidden="true">↓</span>
                </button>
              </div>

              <div
                className="flex items-center gap-6 lg:gap-8 pointer-events-auto transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: phase >= 3 ? 1 : 0,
                  transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
                  transitionDelay: "160ms",
                }}
              >
                <button
                  type="button"
                  id="hero-explore-btn"
                  onClick={handleScrollToCards}
                  className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#181818]/90 hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#181818] border border-white/25 hover:border-white backdrop-blur-sm text-[11px] sm:text-[12px] uppercase tracking-[0.26em] font-sans font-medium transition-all duration-300 ease-out shadow-lg hover:shadow-xl cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>EXPLORE COLLECTION</span>
                  <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 text-xs" aria-hidden="true">→</span>
                </button>

                <button
                  type="button"
                  id="hero-campaign-btn"
                  onClick={() => {
                    const target = document.getElementById("campaign");
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.location.href = "/about";
                    }
                  }}
                  className="group inline-flex items-center gap-2.5 py-2 text-[11px] sm:text-[12px] uppercase tracking-[0.22em] font-normal text-[#111111] hover:text-[#666666] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer select-none"
                >
                  <span>View Campaign</span>
                  <span className="inline-flex items-center transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            LAYER 3: COLLECTION TRANSITION LAYER (3 Rounded Cards + Header)
            Z-INDEX: 20 — Physically overlays the blurred hero scene.
            Cards have 20px rounded edges, rising smoothly over the blurred hero.
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          id="editorial-collections"
          aria-label="PABLO Featured Editorial Collections"
          className="absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16"
          style={{
            pointerEvents: cardsRawProgress >= 0.75 ? "auto" : "none",
          }}
        >
          <div className="page-container w-full max-w-7xl mx-auto flex flex-col justify-center">
            {/* ── SECTION HEADER ── */}
            <div
              className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 sm:mb-6 lg:mb-8 pb-3 sm:pb-4 border-b border-[#111111]/25 transition-transform duration-100"
              style={{
                opacity: headerOpacity,
                transform: `translate3d(0, ${headerTranslateY}px, 0)`,
                willChange: "opacity, transform",
              }}
            >
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#111111]/75 font-medium block mb-1.5 sm:mb-2">
                  CAMPAIGN EDITIONS · AUTUMN / WINTER 2026
                </span>
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal uppercase tracking-[0.04em] text-[#111111] leading-none"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                    fontKerning: "normal",
                  }}
                >
                  COLLECTIONS
                </h2>
              </div>

              <div className="mt-3 md:mt-0 flex items-center gap-6">
                <span className="text-[11px] font-mono tracking-widest text-[#111111]/60 uppercase">
                  [03 EDITIONS]
                </span>
                <Link
                  href="/men"
                  className="group inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.24em] font-medium text-[#111111] hover:text-[#444444] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                >
                  <span>VIEW ALL</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* ── 3 ROUNDED COLLECTION CARDS RISING OVER BLURRED HERO ── */}
            <div className="flex md:grid md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 w-full overflow-x-auto md:overflow-visible no-scrollbar pb-2">
              {editorialCollections.map((col, index) => (
                <div
                  key={col.id || col.slug || index}
                  className="w-[82vw] shrink-0 md:w-full md:shrink rounded-[20px] sm:rounded-[22px] overflow-hidden"
                  style={{
                    transform: `translate3d(0, ${cardStates[index].translateY}, 0) scale(${cardStates[index].scale})`,
                    opacity: cardStates[index].opacity,
                    willChange: "transform, opacity",
                    borderRadius: "20px",
                  }}
                >
                  <CollectionCard
                    collection={col}
                    index={index}
                    forceVisible={true}
                    className="rounded-[20px] sm:rounded-[22px] overflow-hidden"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            LAYER 4: PROMOTIONAL TICKER
            Z-INDEX: 30 — Positioned at bottom of hero.
            Translates down & fades out as hero blurs and cards enter.
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute bottom-0 inset-x-0 z-30 pointer-events-auto"
          style={{
            transform: `translate3d(0, ${tickerTranslateY}%, 0)`,
            opacity: tickerOpacity,
            willChange: "transform, opacity",
          }}
        >
          <PromotionalTicker />
        </div>
      </section>
    </div>
  );
}

export default HeroSection;
