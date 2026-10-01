"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PromotionalTicker } from "@/components/ui/PromotionalTicker";
import { HeroSaleStamp } from "@/components/ui/HeroSaleStamp";

interface HeroSectionProps {
  isIntroActive?: boolean;
}

export function HeroSection({ isIntroActive = false }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  
  // If intro is not active, reveal hero elements immediately in Phase 3
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(isIntroActive ? 0 : 3);
  const sequenceStartedRef = useRef(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Phone 1 Mobile Hero Cinematic Staged Entrance:
  // 0.15s: campaign label appears (NEW COLLECTIONS AVAILABLE)
  // 0.25s: PABLO typography begins reveal
  // 0.35s: model begins entering from LEFT (-25vw to 0 over 900ms)
  // 1.00s: supporting copy & editorial marks reveal
  // 1.15s: CTAs reveal
  const [mobilePhase, setMobilePhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  // Hero Model Simple Fade Cycle:
  // "initial-settle" -> initial male entrance with PABLO hero typography
  // "initial-exit"   -> male model softly fades out toward right (0 -> 30px, 500ms)
  // "female"         -> female fades in from left (-30px -> 0, 500ms), visible ~1.8s, fades out to right (0 -> 30px, 500ms)
  // "male"           -> male fades in from left (-30px -> 0, 500ms), visible ~1.8s, fades out to right (0 -> 30px, 500ms)
  // Continuous loop: female -> male -> female -> male...
  type ModelFadeState = "initial-settle" | "initial-exit" | "female" | "male";
  const [modelState, setModelState] = useState<ModelFadeState>("initial-settle");
  const [cycleKey, setCycleKey] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPrefersReducedMotion(true);
    }
  }, []);

  // After the existing hero entrance completes (phase === 3),
  // hold the settled hero model for 2.2s, exit, and cycle continuously between female and male
  useEffect(() => {
    if (phase < 3 || prefersReducedMotion) return;

    let isMounted = true;
    const initialHoldTimer = setTimeout(() => {
      if (!isMounted) return;
      setModelState("initial-exit");

      const femaleTimer = setTimeout(() => {
        if (!isMounted) return;
        setModelState("female");
        setCycleKey((k) => k + 1);

        const loopInterval = setInterval(() => {
          if (!isMounted) return;
          setModelState((current) => (current === "female" ? "male" : "female"));
          setCycleKey((k) => k + 1);
        }, 3500);

        timerRef.current = loopInterval as any;
      }, 500);

      timeoutsRef.current.push(femaleTimer);
    }, 2200);

    timeoutsRef.current.push(initialHoldTimer);

    return () => {
      isMounted = false;
      clearTimeout(initialHoldTimer);
      if (timerRef.current) clearInterval(timerRef.current as any);
    };
  }, [phase, prefersReducedMotion]);

  const handleAnimationEnd = () => {
    // Timer handles transitions deterministically across both mobile and desktop
  };

  useEffect(() => {
    // Check for reduced motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const rmTimer = setTimeout(() => {
        setPhase(3);
        setMobilePhase(5);
      }, 0);
      return () => clearTimeout(rmTimer);
    }

    // If sequence is already in progress, let it play through smoothly to completion
    if (sequenceStartedRef.current) {
      return;
    }

    // If intro is not active or intro has already been viewed, reveal hero smoothly
    if (!isIntroActive) {
      const timer = setTimeout(() => setPhase(3), 0);
      const m1 = setTimeout(() => setMobilePhase(1), 150);
      const m2 = setTimeout(() => setMobilePhase(2), 250);
      const m3 = setTimeout(() => setMobilePhase(3), 350);
      const m4 = setTimeout(() => setMobilePhase(4), 1000);
      const m5 = setTimeout(() => setMobilePhase(5), 1150);
      timeoutsRef.current.push(timer, m1, m2, m3, m4, m5);
      return () => {
        clearTimeout(timer);
        clearTimeout(m1);
        clearTimeout(m2);
        clearTimeout(m3);
        clearTimeout(m4);
        clearTimeout(m5);
      };
    }
    try {
      if (sessionStorage.getItem("pablo-intro-completed") === "true") {
        const timer = setTimeout(() => setPhase(3), 0);
        const m1 = setTimeout(() => setMobilePhase(1), 150);
        const m2 = setTimeout(() => setMobilePhase(2), 250);
        const m3 = setTimeout(() => setMobilePhase(3), 350);
        const m4 = setTimeout(() => setMobilePhase(4), 1000);
        const m5 = setTimeout(() => setMobilePhase(5), 1150);
        timeoutsRef.current.push(timer, m1, m2, m3, m4, m5);
        return () => {
          clearTimeout(timer);
          clearTimeout(m1);
          clearTimeout(m2);
          clearTimeout(m3);
          clearTimeout(m4);
          clearTimeout(m5);
        };
      }
    } catch {}

    const startSequence = () => {
      if (sequenceStartedRef.current) return;
      sequenceStartedRef.current = true;

      // Phase 1: PABLO oversized typography enters gently at 50ms
      const t1 = setTimeout(() => {
        setPhase(1);
      }, 50);

      // Phase 2: Fashion model enters with calm fade at 250ms
      const t2 = setTimeout(() => {
        setPhase(2);
      }, 250);

      // Phase 3: Editorial details, CTAs, and stamp reveal at 600ms
      const t3 = setTimeout(() => {
        setPhase(3);
      }, 600);

      // Mobile Dedicated Staged Sequence:
      const m1 = setTimeout(() => setMobilePhase(1), 150);
      const m2 = setTimeout(() => setMobilePhase(2), 250);
      const m3 = setTimeout(() => setMobilePhase(3), 350);
      const m4 = setTimeout(() => setMobilePhase(4), 1000);
      const m5 = setTimeout(() => setMobilePhase(5), 1150);

      timeoutsRef.current.push(t1, t2, t3, m1, m2, m3, m4, m5);
    };

    // Use IntersectionObserver to trigger animation the moment Hero enters the viewport
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startSequence();
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      // Safety timeout: if observer does not trigger within 1.8s
      const fallbackTimer = setTimeout(() => {
        startSequence();
      }, 1800);

      timeoutsRef.current.push(fallbackTimer);

      return () => {
        observer.disconnect();
      };
    } else {
      startSequence();
    }
  }, [isIntroActive]);

  // Clean up animation timeouts on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="PABLO Luxury Fashion Showcase"
      className="relative w-full md:h-[calc(100vh-4rem)] md:min-h-[560px] bg-[#EAE8E1] overflow-hidden flex flex-col md:justify-between select-none"
      style={{ backgroundColor: "#EAE8E1" }}
    >
      {/* ══════════════════════════════════════════════════════════════════════════
          1. DEDICATED PURPOSE-BUILT MOBILE HERO (< md)
          - Built strictly from Phone 1 in primary art-direction reference:
            NAVBAR
            ↓
            small campaign label (NEW COLLECTIONS AVAILABLE)
            ↓ (12-16px)
            DEDICATED VISUAL STAGE (PABLO typography + model + sale stamp + star)
            ↓ (10-14px)
            editorial details (LUXURY BEYOND TRENDS / CLOTHING FOR A BOLDER TOMORROW)
            ↓ (12-16px)
            PRIMARY CTA (EXPLORE COLLECTION →)
            ↓ (8-10px)
            secondary campaign link (VIEW CAMPAIGN →)
            ↓ (12px)
            ticker
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden flex-col w-full relative overflow-hidden select-none px-4 pt-2.5 pb-3">
        {/* Top: Small Campaign Label */}
        <div
          className="w-full flex flex-col items-start px-1 pt-0.5 z-20 shrink-0 transition-all duration-500 ease-out"
          style={{
            opacity: mobilePhase >= 1 || prefersReducedMotion ? 1 : 0,
            transform: mobilePhase >= 1 || prefersReducedMotion ? "translateY(0)" : "translateY(-6px)",
          }}
        >
          <span className="text-[10px] tracking-[0.26em] font-sans font-medium text-[#111111] uppercase">
            NEW COLLECTIONS AVAILABLE
          </span>
          <div className="w-12 h-[1px] bg-[#111111] mt-1.5 opacity-80" />
        </div>

        {/* Dedicated Mobile Visual Stage: PABLO Typography + Model + Sale Badge + Slender Star */}
        <div className="relative w-full h-[345px] sm:h-[375px] flex items-center justify-center mt-2.5 sm:mt-3 shrink-0">
          {/* Huge Editorial PABLO Typography Behind/Around Model */}
          <div
            className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-10 overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="font-normal text-[#111111] tracking-[0.06em] sm:tracking-[0.08em] leading-none whitespace-nowrap transition-all duration-800 ease-out"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                fontSize: "clamp(5.8rem, 27vw, 8rem)",
                opacity: mobilePhase >= 2 || prefersReducedMotion ? 1 : 0,
                transform: mobilePhase >= 2 || prefersReducedMotion ? "scale(1)" : "scale(0.97)",
              }}
            >
              PABLO
            </span>
          </div>

          {/* Slender Diamond Star / Crosshair on Left Margin */}
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

          {/* Circular SALE Stamp in Upper Right Negative Space */}
          <div className="absolute right-0 sm:right-1 top-1 z-30 pointer-events-auto">
            <HeroSaleStamp
              isVisible={mobilePhase >= 4 || prefersReducedMotion}
              className="static !top-0 !right-0 scale-[0.68] sm:scale-75 origin-top-right"
            />
          </div>

          {/* Center: Exact Homepage Model Asset Crossing Through Typography */}
          <div
            className="relative z-20 flex flex-col items-center justify-end h-full w-auto pointer-events-none"
            style={{
              transform: prefersReducedMotion
                ? "none"
                : mobilePhase >= 3
                ? "translate3d(0, 0, 0) scale(1)"
                : "translate3d(-25vw, 0, 0) scale(1.03)",
              opacity: mobilePhase >= 3 || prefersReducedMotion ? 1 : 0,
              transition: prefersReducedMotion
                ? "none"
                : "transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 750ms ease-out",
            }}
          >
            {/* Ground shadow oval under shoes */}
            <div
              className="absolute bottom-0 w-36 sm:w-40 h-2.5 rounded-[100%] bg-[#111111]/20 blur-[2px] z-0"
              aria-hidden="true"
            />

            <Image
              src="/images/pablo-hero-cutout.png"
              alt="PABLO Luxury Fashion Campaign"
              width={403}
              height={619}
              priority
              unoptimized
              className="object-contain object-bottom w-auto h-[330px] sm:h-[360px] max-h-[365px] select-none pointer-events-none drop-shadow-sm z-10"
            />
          </div>
        </div>

        {/* Lower Editorial Details Row: LUXURY BEYOND TRENDS & CLOTHING FOR A BOLDER TOMORROW */}
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
            onClick={() => {
              const target = document.getElementById("new-in") || document.getElementById("categories");
              target?.scrollIntoView({ behavior: "smooth" });
            }}
            className="
              w-[90%] max-w-[340px] py-3.5 min-h-[46px]
              bg-[#181818] text-[#FFFFFF] active:bg-[#333333]
              border border-[#181818]
              text-xs font-sans tracking-[0.22em] uppercase font-medium
              transition-all duration-200 ease-out shadow-xs cursor-pointer select-none text-center
              flex items-center justify-center gap-2
            "
          >
            <span>EXPLORE COLLECTION</span>
            <span>→</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const target = document.getElementById("campaign") || document.getElementById("categories");
              target?.scrollIntoView({ behavior: "smooth" });
            }}
            className="
              inline-flex items-center gap-2 py-1 text-[11px] font-sans tracking-[0.22em] uppercase font-medium
              text-[#111111] hover:text-[#666666] active:opacity-70 transition-colors cursor-pointer select-none
            "
          >
            <span>VIEW CAMPAIGN</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. DESKTOP HERO (>= md) — 100% UNTOUCHED ORIGINAL EDITORIAL COMPOSITION
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex relative flex-1 min-h-0 w-full flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-2 sm:py-4 overflow-hidden">
        
        {/*
          ─── LAYER 1: OVERSIZED (PA [IMAGE] BLO) TYPOGRAPHY ──────────────────────────
          Exact brand logo font: Cormorant Garamond (Weight 400).
          Monumental editorial scale: clamp(6.5rem, 23vw, 29rem).
          Sits BEHIND the fashion model (z-10).
          PA on the left, BLO on the right, fashion model in the center.
          Calm, stately cinematic opacity and subtle translation entrance.
        */}
        <div
          className="absolute inset-0 flex items-center justify-between pointer-events-none z-10 select-none overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16"
          aria-hidden="true"
        >
          {/* Left Block: PA */}
          <span
            className="
              font-normal text-[#111111] leading-none whitespace-nowrap select-none
              tracking-[0.03em] sm:tracking-[0.05em] lg:tracking-[0.06em]
              transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]
            "
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

          {/* Right Block: BLO */}
          <span
            className="
              font-normal text-[#111111] leading-none whitespace-nowrap select-none
              tracking-[0.03em] sm:tracking-[0.05em] lg:tracking-[0.06em]
              transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]
            "
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

        {/* Accessible heading for SEO and screen readers */}
        <h1 className="sr-only">PABLO — Autumn / Winter 2026 Luxury Collection</h1>

        {/*
          ─── LAYER 2: FASHION MODEL SUBJECT (SIMPLE SUBTLE FADE CYCLE) ───────────────
          Sits IN FRONT OF the oversized PABLO typography (z-20).
          Stays in the exact existing hero model position (-ml-[10vw] sm:-ml-[14vw] lg:-ml-[15vw]).
          Subtle horizontal shift: -30px (fade-in) -> 0 (visible) -> +30px (fade-out).
          Alternates between Male and Female with zero overlap and zero crossfade.
        */}
        <div
          className="
            relative z-20 pointer-events-none flex items-center justify-center
            w-full h-full max-h-[92vh]
          "
        >
          <div className="relative flex items-center justify-center -ml-[10vw] sm:-ml-[14vw] lg:-ml-[15vw]">
            {/* INITIAL ENTRANCE & SETTLE (Existing Male Entrance) */}
            {modelState === "initial-settle" && (
              <div
                className="transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: phase >= 2 ? 1 : 0,
                  transform:
                    phase >= 2
                      ? "translate3d(0, 0, 0)"
                      : "translate3d(-30px, 0, 0)",
                }}
              >
                <Image
                  src="/images/pablo-hero-cutout.png"
                  alt="PABLO Editorial Fashion Campaign — Male Model"
                  width={403}
                  height={619}
                  priority
                  unoptimized
                  className="
                    object-contain w-auto select-none
                    h-[57vh] sm:h-[68vh] md:h-[74vh] lg:h-[80vh] max-h-[820px]
                  "
                />
              </div>
            )}

            {/* INITIAL EXIT OF SETTLED MALE MODEL (Soft fade out toward right) */}
            {modelState === "initial-exit" && (
              <div
                className="animate-model-initial-fadeout"
                onAnimationEnd={handleAnimationEnd}
              >
                <Image
                  src="/images/pablo-hero-cutout.png"
                  alt="PABLO Editorial Fashion Campaign — Male Model"
                  width={403}
                  height={619}
                  priority
                  unoptimized
                  className="
                    object-contain w-auto select-none
                    h-[57vh] sm:h-[68vh] md:h-[74vh] lg:h-[80vh] max-h-[820px]
                  "
                />
              </div>
            )}

            {/* FEMALE MODEL: FADE IN FROM LEFT -> VISIBLE -> FADE OUT TO RIGHT */}
            {modelState === "female" && (
              <div
                key={`female-${cycleKey}`}
                className="animate-model-subtle-fade"
                onAnimationEnd={handleAnimationEnd}
              >
                <Image
                  src="/images/pablo-hero-female.png"
                  alt="PABLO Editorial Fashion Campaign — Female Model"
                  width={666}
                  height={1024}
                  priority
                  unoptimized
                  className="
                    object-contain w-auto select-none
                    h-[57vh] sm:h-[68vh] md:h-[74vh] lg:h-[80vh] max-h-[820px]
                  "
                />
              </div>
            )}

            {/* MALE MODEL: FADE IN FROM LEFT -> VISIBLE -> FADE OUT TO RIGHT */}
            {modelState === "male" && (
              <div
                key={`male-${cycleKey}`}
                className="animate-model-subtle-fade"
                onAnimationEnd={handleAnimationEnd}
              >
                <Image
                  src="/images/pablo-hero-cutout.png"
                  alt="PABLO Editorial Fashion Campaign — Male Model"
                  width={403}
                  height={619}
                  priority
                  unoptimized
                  className="
                    object-contain w-auto select-none
                    h-[57vh] sm:h-[68vh] md:h-[74vh] lg:h-[80vh] max-h-[820px]
                  "
                />
              </div>
            )}

            {/* Preload both images to prevent any blank frames or decoding delay */}
            <div className="sr-only" aria-hidden="true">
              <Image
                src="/images/pablo-hero-cutout.png"
                alt=""
                width={403}
                height={619}
                priority
                unoptimized
              />
              <Image
                src="/images/pablo-hero-female.png"
                alt=""
                width={666}
                height={1024}
                priority
                unoptimized
              />
            </div>
          </div>
        </div>

        {/*
          ─── LAYER 3: EDITORIAL SUPPORTING DETAILS & CTAs ───────────────────────────
          Sits on z-30 (above typography and model).
          Aligned to the master PageContainer grid so it shares identical left/right margins.
          Reveals gracefully at Phase 3 (600ms).
        */}
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="page-container relative h-full flex flex-col justify-between pt-4 sm:pt-7 lg:pt-8 pb-4 sm:pb-9 lg:pb-12 pointer-events-none">
            {/* Top Row: Campaign Definition on left, Vintage Sale Stamp on right */}
            <div className="flex items-start justify-between w-full pointer-events-none">
              <div
                className="pointer-events-auto transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: phase >= 3 ? 1 : 0,
                  transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
                }}
              >
                <p className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.28em] text-[#111111] font-normal">
                  New Collections Available
                </p>
                <div className="w-8 h-[1px] bg-[#111111] mt-2 opacity-50" />
              </div>

              <div className="pointer-events-auto">
                <HeroSaleStamp isVisible={phase >= 3} />
              </div>
            </div>

            {/* Bottom Row (Desktop & Tablet): Discovery Scroll Cue on left, CTAs on right */}
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
                  onClick={() => {
                    const target = document.getElementById("new-in") || document.getElementById("categories");
                    target?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group inline-flex items-center gap-2 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#999999] hover:text-[#111111] font-light transition-colors cursor-pointer text-left select-none"
                >
                  <span>Scroll to Discover</span>
                  <span
                    className="inline-block transition-transform duration-300 group-hover:translate-y-0.5 text-[10px]"
                    aria-hidden="true"
                  >
                    ↓
                  </span>
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
                  onClick={() => {
                    const target = document.getElementById("new-in") || document.getElementById("categories");
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.location.href = "/men";
                    }
                  }}
                  className="
                    px-7 sm:px-9 py-3 sm:py-3.5 pablo-btn-dark text-[#EAE8E1]
                    border border-[#222222] hover:border-[#333333]
                    text-[11px] sm:text-[12px] uppercase tracking-[0.24em] font-medium
                    transition-all duration-300
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]
                    cursor-pointer select-none
                  "
                >
                  Explore Collection
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
                  className="
                    group inline-flex items-center gap-2.5 py-2
                    text-[11px] sm:text-[12px] uppercase tracking-[0.22em] font-normal text-[#111111]
                    hover:text-[#666666] transition-colors duration-300
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]
                    cursor-pointer select-none
                  "
                >
                  <span>View Campaign</span>
                  <span
                    className="inline-flex items-center transition-transform duration-300 ease-out group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Row (Mobile): Centered touch buttons */}
            <div
              className="sm:hidden flex flex-col items-center gap-2.5 pointer-events-auto transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: phase >= 3 ? 1 : 0,
                transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
                transitionDelay: "160ms",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById("new-in") || document.getElementById("categories");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/men";
                  }
                }}
                className="
                  w-full max-w-[260px] py-3 pablo-btn-dark text-[#EAE8E1]
                  border border-[#222222] hover:border-[#333333]
                  text-[11px] uppercase tracking-[0.24em] font-medium
                  transition-all duration-300 text-center
                "
              >
                Explore Collection
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById("campaign");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/about";
                  }
                }}
                className="
                  inline-flex items-center gap-2 py-1
                  text-[10.5px] uppercase tracking-[0.2em] font-normal text-[#111111]
                  hover:text-[#666666] transition-colors duration-300
                "
              >
                <span>View Campaign</span>
                <span aria-hidden="true" className="text-xs">→</span>
              </button>
            </div>
          </div>
        </div>

      </div>
      
      {/* ─── HERO END PROMOTIONAL TICKER ─── */}
      <PromotionalTicker />
    </section>
  );
}
