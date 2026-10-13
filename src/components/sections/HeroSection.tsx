"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { PromotionalTicker } from "@/components/ui/PromotionalTicker";
import { HeroSaleStamp } from "@/components/ui/HeroSaleStamp";

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

interface EditorialCardItem {
  id: string;
  category: string;
  subtitle: string;
  image: string;
  href: string;
}

const EDITORIAL_CARDS: EditorialCardItem[] = [
  {
    id: "card-men",
    category: "Men",
    subtitle: "MENSWEAR",
    image: "/images/cards/card-men.jpg",
    href: "/men",
  },
  {
    id: "card-women",
    category: "Women",
    subtitle: "WOMENSWEAR",
    image: "/images/cards/card-women.jpg",
    href: "/women",
  },
  {
    id: "card-kids",
    category: "Kids",
    subtitle: "KIDSWEAR",
    image: "/images/cards/card-kids.jpg",
    href: "/kids",
  },
];

type ModelFadeState = "initial-settle" | "initial-exit" | "female" | "male";

export function HeroSection({ isIntroActive = false, onCardsVisibilityChange }: HeroSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lastActiveRef = useRef<boolean>(false);

  // If intro is not active, reveal hero elements immediately in Phase 3
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(isIntroActive ? 0 : 3);
  const sequenceStartedRef = useRef(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Phone 1 Mobile Hero Cinematic Staged Entrance
  const [mobilePhase, setMobilePhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  // Hero Model Simple Fade Cycle
  const [modelState, setModelState] = useState<ModelFadeState>("initial-settle");
  const [cycleKey, setCycleKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Coordinate cards presentation state with Navbar
  useEffect(() => {
    const isCardsVisible = progress >= 0.02 && progress < 0.96;
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

  // After the hero entrance completes (phase === 3), cycle between female and male
  useEffect(() => {
    if (phase < 3 || prefersReducedMotion) return;

    let isMounted = true;
    let maleTimer: NodeJS.Timeout | null = null;
    const initialHoldTimer = setTimeout(() => {
      if (!isMounted) return;
      setModelState("initial-exit");

      maleTimer = setTimeout(() => {
        if (!isMounted) return;
        setModelState("male");
        setCycleKey((k) => k + 1);

        const loopInterval = setInterval(() => {
          if (!isMounted) return;
          setModelState((current) => (current === "male" ? "female" : "male"));
          setCycleKey((k) => k + 1);
        }, 3500);

        timerRef.current = loopInterval as any;
      }, 500);

      timeoutsRef.current.push(maleTimer);
    }, 2400);

    timeoutsRef.current.push(initialHoldTimer);

    return () => {
      isMounted = false;
      clearTimeout(initialHoldTimer);
      if (maleTimer) clearTimeout(maleTimer);
      if (timerRef.current) {
        clearInterval(timerRef.current as any);
        timerRef.current = null;
      }
    };
  }, [phase, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase(3);
      setMobilePhase(5);
      return;
    }

    if (sequenceStartedRef.current) {
      return;
    }

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

      const t1 = setTimeout(() => setPhase(1), 50);
      const t2 = setTimeout(() => setPhase(2), 250);
      const t3 = setTimeout(() => setPhase(3), 600);

      const m1 = setTimeout(() => setMobilePhase(1), 150);
      const m2 = setTimeout(() => setMobilePhase(2), 250);
      const m3 = setTimeout(() => setMobilePhase(3), 350);
      const m4 = setTimeout(() => setMobilePhase(4), 1000);
      const m5 = setTimeout(() => setMobilePhase(5), 1150);

      timeoutsRef.current.push(t1, t2, t3, m1, m2, m3, m4, m5);
    };

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
  }, [isIntroActive, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current as any);
        clearTimeout(timerRef.current as any);
        timerRef.current = null;
      }
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  // ─── SCROLL INTERPOLATION VALUES ───────────────────────────────────────────
  // Stage 1 (p <= 0.02): Original hero, completely sharp (blur 0px)
  // Stage 2 (p: 0.02 -> 0.30): Hero scene gradually blurs from 0px to 14px
  // Stage 3 & 4 (p >= 0.30): Hero scene stays blurred at 14px behind cards
  const blurProgress = prefersReducedMotion
    ? 0
    : progress <= 0.02
    ? 0
    : Math.min(1, (progress - 0.02) / 0.28);
  const blurAmount = easeInOut(blurProgress) * 14;

  // Hero interactive controls (CTAs and overlines) fade out as blur starts
  const heroUiFade = prefersReducedMotion
    ? 1
    : progress <= 0.02
    ? 1
    : Math.max(0, 1 - (progress - 0.02) / 0.14);

  // Ticker slides down and fades out during stage 2
  const tickerProgress = prefersReducedMotion
    ? 0
    : progress <= 0.02
    ? 0
    : Math.min(1, (progress - 0.02) / 0.14);
  const tickerTranslateY = tickerProgress * 105;
  const tickerOpacity = 1 - tickerProgress;

  // Coordinated staggered entrance for the 3 Rolex-style cards
  const cardStates = EDITORIAL_CARDS.map((_, idx) => {
    if (prefersReducedMotion) {
      return { translateY: "0px", opacity: 1, scale: 1 };
    }
    const startP = 0.06 + idx * 0.08; // Men: 0.06, Women: 0.14, Kids: 0.22
    const endP = startP + 0.20;       // Men: 0.26, Women: 0.34, Kids: 0.42
    const rawT = Math.min(1, Math.max(0, (progress - startP) / (endP - startP)));
    const e = easeOutCubic(rawT);
    const translateY = `${(1 - e) * 75}px`;
    const opacity = Math.min(1, e * 1.5);
    const scale = 0.94 + e * 0.06;
    return { translateY, opacity, scale };
  });

  const handleScrollToCards = () => {
    if (outerRef.current) {
      const rect = outerRef.current.getBoundingClientRect();
      const outerTop = window.scrollY + rect.top;
      const outerHeight = outerRef.current.offsetHeight;
      const targetScroll = outerTop + (outerHeight - window.innerHeight) * 0.45;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  // ─── REDUCED MOTION STATIC FALLBACK ─────────────────────────────────────────
  if (prefersReducedMotion) {
    return (
      <div className="w-full">
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
              <Image src="/images/main-hero.png" alt="PABLO Editorial Fashion Campaign — Male Model" width={403} height={619} priority unoptimized className="object-contain object-bottom w-auto select-none h-[66vh] sm:h-[72vh] md:h-[76vh] lg:h-[80vh] max-h-[840px]" />
            </div>
          </div>
          <PromotionalTicker />
        </section>

        <section id="editorial-collections" className="w-full py-12 sm:py-16 bg-[#EAE8E1] text-[#111111]">
          <div className="w-full flex items-center justify-center px-2 sm:px-4">
            <div className="flex justify-center items-center gap-2.5 sm:gap-3 md:gap-3.5">
              {EDITORIAL_CARDS.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group relative block h-[76vh] sm:h-[80vh] md:h-[83vh] max-h-[780px] aspect-[3/5] rounded-[18px] sm:rounded-[22px] md:rounded-[24px] overflow-hidden bg-[#181818] shadow-2xl"
                >
                  <Image
                    src={card.image}
                    alt={`PABLO ${card.category}`}
                    fill
                    sizes="(max-width: 768px) 80vw, 450px"
                    className="object-cover object-center w-full h-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 pb-8 sm:pb-10 px-5 text-center flex flex-col items-center">
                    <span className="text-[10.5px] uppercase tracking-[0.28em] text-white/80 block mb-1.5 font-medium">
                      {card.subtitle}
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl font-normal text-white"
                      style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
                    >
                      {card.category}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div
      ref={outerRef}
      id="hero-scroll-container"
      className="relative w-full"
      style={{ height: "240vh" }}
    >
      <section
        ref={containerRef}
        id="hero"
        aria-label="PABLO Luxury Fashion Showcase"
        className="sticky top-0 w-full h-[100svh] min-h-[100svh] overflow-hidden flex flex-col justify-between select-none bg-[#11100E] text-[#111111]"
        style={{
          backgroundColor: "#11100E",
          minHeight: "100svh",
          height: "100svh",
        }}
      >
        {/* ─── LAYER 1: HERO VISUAL SCENE (BACKGROUND + TYPOGRAPHY + ANIMATED MODELS) ─── */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
          style={{
            filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none",
            transform: blurAmount > 0 ? "scale(1.03)" : "none",
            willChange: blurProgress > 0 && blurProgress < 1 ? "filter, transform" : "auto",
          }}
          aria-hidden="true"
        >
          {/* HERO BACKGROUND */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-cover bg-center bg-no-repeat select-none"
            style={{
              backgroundImage: "url('/images/pablo-hero-bg-editorial.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Image
              src="/images/pablo-hero-bg-editorial.jpg"
              alt="PABLO Luxury Fashion Campaign"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center w-full h-full select-none"
            />

            {/* Top Shadow */}
            <div
              className="absolute inset-x-0 top-0 h-28 sm:h-36 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(17,16,14,0.75) 0%, rgba(17,16,14,0.3) 55%, transparent 100%)",
              }}
            />

            {/* Bottom Subtle Vignette */}
            <div
              className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to top, rgba(17,16,14,0.45) 0%, transparent 100%)",
              }}
            />
          </div>

          {/* DESKTOP PABLO TYPOGRAPHY */}
          <div
            className="hidden md:flex absolute inset-0 items-center justify-between pointer-events-none z-10 select-none overflow-hidden px-4 sm:px-8 md:px-12 lg:px-16"
            aria-hidden="true"
          >
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

          {/* DESKTOP FASHION MODEL SUBJECT (CYCLE) */}
          <div className="hidden md:flex absolute inset-0 pointer-events-none z-20 items-end justify-center pb-3 sm:pb-4 lg:pb-5">
            <div className="relative flex items-end justify-center -ml-[12.5vw] sm:-ml-[16.5vw] lg:-ml-[17.5vw]">
              <div
                className="absolute bottom-1 w-64 sm:w-72 lg:w-80 h-3 rounded-[100%] bg-[#111111]/30 blur-[4px] pointer-events-none z-0"
                aria-hidden="true"
              />

              {modelState === "initial-settle" && (
                <div
                  className="relative z-10 flex items-end transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: phase >= 2 ? 1 : 0,
                    transform:
                      phase >= 2
                        ? "translate3d(0, 0, 0)"
                        : "translate3d(-30px, 0, 0)",
                  }}
                >
                  <Image
                    src="/images/woman-main-hero.png"
                    alt="PABLO Editorial Fashion Campaign — Female Model"
                    width={666}
                    height={1024}
                    priority
                    unoptimized
                    className="object-contain object-bottom w-auto select-none h-[66vh] sm:h-[72vh] md:h-[76vh] lg:h-[80vh] max-h-[840px]"
                  />
                </div>
              )}

              {modelState === "initial-exit" && (
                <div className="relative z-10 flex items-end animate-model-initial-fadeout">
                  <Image
                    src="/images/woman-main-hero.png"
                    alt="PABLO Editorial Fashion Campaign — Female Model"
                    width={666}
                    height={1024}
                    priority
                    unoptimized
                    className="object-contain object-bottom w-auto select-none h-[66vh] sm:h-[72vh] md:h-[76vh] lg:h-[80vh] max-h-[840px]"
                  />
                </div>
              )}

              {modelState === "female" && (
                <div key={`female-${cycleKey}`} className="relative z-10 flex items-end animate-model-subtle-fade">
                  <Image
                    src="/images/woman-main-hero.png"
                    alt="PABLO Editorial Fashion Campaign — Female Model"
                    width={666}
                    height={1024}
                    priority
                    unoptimized
                    className="object-contain object-bottom w-auto select-none h-[66vh] sm:h-[72vh] md:h-[76vh] lg:h-[80vh] max-h-[840px]"
                  />
                </div>
              )}

              {modelState === "male" && (
                <div key={`male-${cycleKey}`} className="relative z-10 flex items-end animate-model-subtle-fade">
                  <Image
                    src="/images/main-hero.png"
                    alt="PABLO Editorial Fashion Campaign — Male Model"
                    width={403}
                    height={619}
                    priority
                    unoptimized
                    className="object-contain object-bottom w-auto select-none h-[66vh] sm:h-[72vh] md:h-[76vh] lg:h-[80vh] max-h-[840px]"
                  />
                </div>
              )}

              <div className="sr-only" aria-hidden="true">
                <Image src="/images/main-hero.png" alt="" width={403} height={619} priority unoptimized />
                <Image src="/images/woman-main-hero.png" alt="" width={666} height={1024} priority unoptimized />
              </div>
            </div>
          </div>

          {/* MOBILE MODEL STAGE (< md) */}
          <div className="flex md:hidden absolute inset-0 items-center justify-center pointer-events-none z-20">
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

            <div
              className="relative z-20 flex flex-col items-center justify-end h-full w-auto"
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
              <div className="absolute bottom-12 w-36 sm:w-40 h-2.5 rounded-[100%] bg-[#111111]/20 blur-[2px] z-0" aria-hidden="true" />
              <Image
                src="/images/main-hero.png"
                alt="PABLO Luxury Fashion Campaign"
                width={403}
                height={619}
                priority
                unoptimized
                className="object-contain object-bottom w-auto h-[330px] sm:h-[360px] max-h-[365px] select-none pointer-events-none drop-shadow-sm z-10"
              />
            </div>
          </div>
        </div>

        {/* ─── LAYER 2: HERO UI CONTROLS & EDITORIAL DETAILS ─── */}
        {/* Mobile UI (< md) */}
        <div
          className="flex md:hidden relative flex-1 min-h-0 flex-col justify-between w-full overflow-hidden select-none px-4 pt-16 sm:pt-20 pb-2 z-10 transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: heroUiFade,
            pointerEvents: heroUiFade > 0.4 ? "auto" : "none",
          }}
        >
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

          {/* Bottom CTAs */}
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
                const target = document.getElementById("campaign") || document.getElementById("categories");
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
            {/* Top Row: Vintage Sale Stamp */}
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

        {/* ─── LAYER 3: COLLECTION TRANSITION LAYER (3 Rolex-Style 3:5 Editorial Cards) ─── */}
        <div
          id="editorial-collections"
          aria-label="PABLO Featured Editorial Collections"
          className="absolute inset-0 z-20 flex items-center justify-center px-2 sm:px-4"
          style={{
            pointerEvents: progress >= 0.18 ? "auto" : "none",
          }}
        >
          <div className="w-full flex items-center justify-center">
            <div className="flex justify-center items-center gap-2.5 sm:gap-3 md:gap-3.5 max-w-full overflow-x-auto md:overflow-visible no-scrollbar pb-2">
              {EDITORIAL_CARDS.map((card, index) => (
                <div
                  key={card.id}
                  className="shrink-0"
                  style={{
                    transform: `translate3d(0, ${cardStates[index].translateY}, 0) scale(${cardStates[index].scale})`,
                    opacity: cardStates[index].opacity,
                    willChange: "transform, opacity",
                  }}
                >
                  <Link
                    href={card.href}
                    aria-label={`Explore ${card.category} Collection`}
                    className="group relative block h-[76vh] sm:h-[80vh] md:h-[83vh] max-h-[780px] aspect-[3/5] max-w-[calc((100vw-48px)/3)] md:max-w-none rounded-[18px] sm:rounded-[22px] md:rounded-[24px] overflow-hidden bg-[#181818] shadow-2xl transition-all duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer select-none"
                    style={{
                      pointerEvents: cardStates[index].opacity > 0.4 ? "auto" : "none",
                    }}
                  >
                    {/* Background Editorial Image */}
                    <Image
                      src={card.image}
                      alt={`PABLO ${card.category} Collection`}
                      fill
                      sizes="(max-width: 768px) 80vw, 450px"
                      priority={index === 0}
                      className="object-cover object-center w-full h-full select-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />

                    {/* Top Subtle Vignette */}
                    <div
                      className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Bottom Vignette for High Text Legibility */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-52 sm:h-60 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Centered Typography at Bottom (Rolex Style) */}
                    <div className="absolute inset-x-0 bottom-0 z-20 pb-8 sm:pb-9 md:pb-10 px-5 text-center flex flex-col items-center justify-end pointer-events-none">
                      <span className="text-[10.5px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-white/80 block mb-1.5 transition-colors duration-300 group-hover:text-white">
                        {card.subtitle}
                      </span>
                      <h3
                        className="text-2xl sm:text-3xl md:text-[2.6rem] lg:text-[2.85rem] font-normal text-white tracking-[0.02em] leading-tight transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
                        style={{
                          fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                        }}
                      >
                        {card.category}
                      </h3>
                    </div>

                    {/* Subtle Luxury Card Border */}
                    <div
                      className="absolute inset-0 rounded-[18px] sm:rounded-[22px] md:rounded-[24px] border border-white/15 group-hover:border-white/40 transition-colors duration-500 pointer-events-none z-20"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── LAYER 4: HERO END PROMOTIONAL TICKER ─── */}
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
