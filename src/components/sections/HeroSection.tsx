"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState, useCallback } from "react";

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

export function HeroSection({ onCardsVisibilityChange }: HeroSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasSettled, setHasSettled] = useState(false);
  const lastActiveRef = useRef<boolean>(false);

  // Cinematic initial load reveal (smooth settle from scale(1.06) to scale(1.0))
  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setIsRevealed(true);
    }, 60);
    const settleTimer = setTimeout(() => {
      setHasSettled(true);
    }, 1700);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(settleTimer);
    };
  }, []);

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
    window.addEventListener("popstate", handleScroll, { passive: true });
    window.addEventListener("pablo-intro-update", handleScroll, { passive: true });
    updateProgress();
    const initRaf = requestAnimationFrame(updateProgress);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("popstate", handleScroll);
      window.removeEventListener("pablo-intro-update", handleScroll);
      cancelAnimationFrame(initRaf);
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

  // ─── REDUCED MOTION STATIC FALLBACK ─────────────────────────────────────────
  if (prefersReducedMotion) {
    return (
      <div className="w-full">
        <section
          ref={containerRef}
          id="hero"
          aria-label="PABLO Luxury Fashion Showcase"
          className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden select-none bg-[#0B0A09] text-[#111111]"
          style={{ height: "100svh", minHeight: "100svh", backgroundColor: "#0B0A09" }}
        >
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
            <Image
              src="/images/main-hero.png"
              alt="PABLO Luxury Fashion Campaign"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-[65%_center] md:object-center w-full h-full select-none"
            />
          </div>
          <div
            className="absolute inset-0 pointer-events-none z-10 select-none"
            style={{
              background:
                "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 35%, rgba(10, 9, 8, 0.45) 70%, rgba(8, 7, 6, 0.90) 100%), linear-gradient(to bottom, rgba(8, 7, 6, 0.65) 0%, transparent 16%, transparent 80%, rgba(8, 7, 6, 0.82) 100%)",
            }}
            aria-hidden="true"
          />
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
        className="sticky top-0 w-full h-[100svh] min-h-[100svh] overflow-hidden select-none bg-[#0B0A09] text-[#111111]"
        style={{
          backgroundColor: "#0B0A09",
          minHeight: "100svh",
          height: "100svh",
        }}
      >
        {/* ─── LAYER 1: HERO VISUAL SCENE (CINEMATIC REVEAL & SCROLL DEPTH) ─── */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
          style={{
            filter: blurAmount > 0 ? `blur(${blurAmount}px)` : "none",
            transform: prefersReducedMotion
              ? "none"
              : progress > 0
                ? `scale(${1.0 + progress * 0.08}) translate3d(0, ${progress * 30}px, 0)`
                : isRevealed
                  ? "scale(1.0) translate3d(0, 0, 0)"
                  : "scale(1.06) translate3d(0, 0, 0)",
            opacity: prefersReducedMotion ? 1 : isRevealed ? 1 : 0.3,
            transition: prefersReducedMotion || hasSettled || progress > 0
              ? "none"
              : isRevealed
                ? "transform 1600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1)"
                : "none",
            willChange: prefersReducedMotion ? "auto" : "transform, filter, opacity",
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
            <Image
              src="/images/main-hero.png"
              alt="PABLO Luxury Fashion Campaign"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-[65%_center] md:object-center w-full h-full select-none"
            />
          </div>
        </div>

        {/* ─── CINEMATIC VIGNETTE & EDGE SHADOW OVERLAY ─── */}
        <div
          className="absolute inset-0 pointer-events-none z-10 select-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 45%, rgba(10, 9, 8, 0.25) 78%, rgba(8, 7, 6, 0.55) 100%), linear-gradient(to bottom, rgba(8, 7, 6, 0.45) 0%, transparent 16%, transparent 84%, rgba(8, 7, 6, 0.55) 100%)",
          }}
          aria-hidden="true"
        />

        {/* ─── LAYER 2: COLLECTION TRANSITION LAYER (3 Rolex-Style 3:5 Editorial Cards) ─── */}
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
                    className="shiny-card group relative block h-[76vh] sm:h-[80vh] md:h-[83vh] max-h-[780px] aspect-[3/5] max-w-[calc((100vw-48px)/3)] md:max-w-none rounded-[18px] sm:rounded-[22px] md:rounded-[24px] overflow-hidden bg-[#181818] shadow-2xl transition-all duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer select-none"
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
                      className="object-cover object-center w-full h-full select-none transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:contrast-[1.05]"
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

                    {/* Hover Enhanced Bottom Gradient to elevate text readability */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-64 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-[850ms] ease-out"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)",
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

      </section>
    </div>
  );
}

export default HeroSection;
