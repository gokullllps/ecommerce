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
  // hold the settled hero model for 2 seconds, then begin the gentle fade loop
  useEffect(() => {
    if (phase < 3 || prefersReducedMotion) return;

    const t = setTimeout(() => {
      setModelState("initial-exit");
    }, 2000);

    timerRef.current = t;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, prefersReducedMotion]);

  const handleAnimationEnd = () => {
    if (prefersReducedMotion) return;

    setModelState((current) => {
      if (current === "initial-exit") {
        return "female";
      } else if (current === "female") {
        return "male";
      } else {
        return "female";
      }
    });
    setCycleKey((k) => k + 1);
  };

  useEffect(() => {
    // Check for reduced motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const rmTimer = setTimeout(() => setPhase(3), 0);
      return () => clearTimeout(rmTimer);
    }

    // If sequence is already in progress, let it play through smoothly to completion
    if (sequenceStartedRef.current) {
      return;
    }

    // If intro is not active or intro has already been viewed, reveal hero immediately
    if (!isIntroActive) {
      const timer = setTimeout(() => setPhase(3), 0);
      return () => clearTimeout(timer);
    }
    try {
      if (sessionStorage.getItem("pablo-intro-completed") === "true") {
        const timer = setTimeout(() => setPhase(3), 0);
        return () => clearTimeout(timer);
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

      timeoutsRef.current.push(t1, t2, t3);
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
      className="relative w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] min-h-[560px] bg-[#EAE8E1] overflow-hidden flex flex-col justify-between select-none"
      style={{ backgroundColor: "#EAE8E1" }}
    >
      {/* ─── MAIN EDITORIAL STAGE ─── */}
      <div className="relative flex-1 min-h-0 w-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-2 sm:py-4 overflow-hidden">
        
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
