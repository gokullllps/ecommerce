"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface CategoryHeroProps {
  gender: "men" | "women";
}

export default function CategoryHero({ gender }: CategoryHeroProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  // Staged luxury entrance animation matching Sale/Men hero:
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPrefersReducedMotion(true);
      setPhase(5);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 60);  // Background reveal
    const t2 = setTimeout(() => setPhase(2), 220); // Model smooth entrance
    const t3 = setTimeout(() => setPhase(3), 480); // Headline reveal
    const t4 = setTimeout(() => setPhase(4), 720); // Supporting description
    const t5 = setTimeout(() => setPhase(5), 940); // CTAs reveal

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Subtle GPU-accelerated hero scroll tracking
  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const height = containerRef.current.offsetHeight || window.innerHeight;
          const p = Math.min(Math.max(-rect.top / height, 0), 1);
          setScrollProgress(p);
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  const isMen = gender === "men";

  const handleScrollToCatalogue = (e: React.MouseEvent) => {
    e.preventDefault();
    const target =
      document.getElementById("categories") ||
      document.getElementById("women-categories") ||
      document.getElementById("catalogue");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="women-hero"
      aria-label={isMen ? "PABLO Men's Editorial" : "PABLO Women's Editorial"}
      className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden select-none bg-[#11100E] text-[#111111]"
      style={{
        backgroundColor: "#11100E",
        minHeight: "100svh",
        height: "100svh",
      }}
    >
      {/* ─── FULL-BLEED EDITORIAL BACKGROUND LAYER ─── */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 pablo-page-resolve"
        style={{
          opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
          transform: prefersReducedMotion
            ? "none"
            : phase >= 1
            ? `translate3d(0, ${scrollProgress * -20}px, 0) scale(1)`
            : "scale(1.04)",
          transition: prefersReducedMotion
            ? "none"
            : "opacity 1000ms ease-out, transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: prefersReducedMotion ? "auto" : "transform",
        }}
      >
        <Image
          src="/images/women-hero-bg.webp"
          alt="PABLO Women's Architectural Editorial Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[25%_center] md:object-[left_center] lg:object-[center_35%] w-full h-full"
          style={{
            filter: "contrast(1.04) brightness(0.98)",
          }}
        />

        {/* Top Shadow: Seamless integration with transparent sticky navbar */}
        <div
          className="absolute inset-x-0 top-0 h-28 sm:h-32 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(17,16,14,0.72) 0%, rgba(17,16,14,0.25) 55%, transparent 100%)",
          }}
        />

        {/* Subtle Bottom Grounding: Integrates ground terrain into catalogue section without borders or lines */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to top, rgba(17,16,14,0.35) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ─── 1. DEDICATED PURPOSE-BUILT MOBILE HERO (< md) ─── */}
      <div className="flex md:hidden relative flex-col justify-between z-20 px-4 pt-16 pb-4 h-[100svh] min-h-[100svh] w-full select-none overflow-hidden">
        {/* Top Metadata Row */}
        <div className="w-full flex items-center justify-between z-30 shrink-0 pt-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5"
            style={{
              opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
              transform: phase >= 1 || prefersReducedMotion ? "translateY(0)" : "translateY(-4px)",
              transition: prefersReducedMotion ? "none" : "opacity 400ms ease-out, transform 400ms ease-out",
            }}
          >
            <span className="text-[10px] font-sans tracking-[0.24em] uppercase text-[#111111]/80 font-medium">
              HOME
            </span>
            <span className="text-[9px] text-[#111111]/50">&gt;</span>
            <span className="text-[10px] font-sans tracking-[0.24em] uppercase text-[#111111] font-semibold">
              {isMen ? "MEN" : "WOMEN"}
            </span>
          </nav>
          <div
            style={{
              opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
              transition: prefersReducedMotion ? "none" : "opacity 400ms ease-out",
            }}
          >
            <span className="text-[9.5px] font-sans tracking-[0.26em] uppercase text-[#111111]/80 font-medium">
              A/W 2026
            </span>
          </div>
        </div>

        {/* Headline */}
        <div
          className="w-full text-left mt-2 z-20 shrink-0"
          style={{
            opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
            transform: phase >= 2 || prefersReducedMotion ? "translateY(0)" : "translateY(6px)",
            transition: prefersReducedMotion ? "none" : "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h1
            className="font-normal text-[#111111] uppercase tracking-[0.01em] leading-[0.88] select-none text-[38px] sm:text-[44px]"
            style={{ fontFamily: "'Beverly', var(--font-editorial), serif", fontKerning: "normal" }}
          >
            RAW FORM.<br />
            MODERN<br />
            SILHOUETTES.
          </h1>
        </div>

        {/* Dedicated Centered Mobile Visual Stage */}
        <div className="relative w-full h-[52%] sm:h-[56%] flex items-end justify-center my-auto shrink-0 pointer-events-none">
          {/* Deliberate Star Accent positioned directly beside the editorial pattern */}
          <div
            className="absolute right-[6%] sm:right-[8%] top-1/4 -translate-y-1/2 z-10 pointer-events-none"
            style={{
              opacity: phase >= 3 || prefersReducedMotion ? 0.7 : 0,
              transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out",
            }}
          >
            <svg width="18" height="42" viewBox="0 0 18 42" fill="none" className="text-[#111111]" aria-hidden="true">
              <line x1="9" y1="0" x2="9" y2="42" stroke="currentColor" strokeWidth="0.75" />
              <line x1="0" y1="21" x2="18" y2="21" stroke="currentColor" strokeWidth="0.75" />
              <polygon points="9,14 11,21 9,28 7,21" fill="currentColor" />
              <polygon points="2,21 9,19 16,21 9,23" fill="currentColor" />
            </svg>
          </div>

          {/* Model Container with subtle entrance translation */}
          <div
            className="relative flex items-end justify-center z-20 pointer-events-none h-full"
            style={{
              transform: prefersReducedMotion
                ? "none"
                : phase >= 2
                ? "translate3d(0, 0, 0) scale(1)"
                : "translate3d(-20px, 0, 0) scale(1.02)",
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transition: prefersReducedMotion
                ? "none"
                : "transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 750ms ease-out",
              willChange: "transform, opacity",
            }}
          >
            {/* Ground shadow under sneakers */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 sm:w-48 h-3 rounded-[100%] bg-black/50 blur-[3px] -z-10"
              aria-hidden="true"
            />
            <Image
              src="/images/women-hero.webp"
              alt="PABLO Women's Campaign Model"
              width={602}
              height={1024}
              priority
              unoptimized
              className="object-contain object-bottom w-auto h-full max-h-[390px] select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] z-10"
            />
          </div>
        </div>

        {/* Supporting Editorial Copy */}
        <div
          className="w-full text-left z-20 shrink-0 mb-2"
          style={{
            opacity: phase >= 4 || prefersReducedMotion ? 1 : 0,
            transform: phase >= 4 || prefersReducedMotion ? "translateY(0)" : "translateY(4px)",
            transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          <p className="text-[10px] sm:text-[10.5px] text-[#222222] font-normal tracking-wide max-w-[290px] leading-[1.45]">
            Sculptural column lines, oversized streetwear tailoring, and contemporary silhouettes.
          </p>
        </div>

        {/* Mobile Bottom CTA & Metadata Strip */}
        <div className="w-full flex flex-col gap-2.5 z-20 shrink-0">
          <a
            href="#catalogue"
            onClick={handleScrollToCatalogue}
            className="group flex items-center justify-center gap-2.5 w-full py-3.5 min-h-[46px] bg-[#181818]/90 active:bg-[#FFFFFF] text-[#FFFFFF] active:text-[#181818] border border-white/25 active:border-white backdrop-blur-sm text-xs font-sans tracking-[0.24em] uppercase font-medium transition-all duration-300 ease-out shadow-lg cursor-pointer select-none text-center"
          >
            <span>EXPLORE WOMEN&apos;S COLLECTION</span>
            <span
              className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 text-xs"
              aria-hidden="true"
            >
              →
            </span>
          </a>

          <div className="flex items-center justify-between text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#111111]/70 font-sans pt-1.5 border-t border-[#111111]/15 w-full">
            <span>A/W 2026 ARCHITECTURAL SILHOUETTES</span>
            <span>COMPLIMENTARY GLOBAL DELIVERY</span>
          </div>
        </div>
      </div>

      {/* ─── 2. PRESERVED UNTOUCHED DESKTOP CATEGORY HERO (>= md) ─── */}
      <div className="hidden md:flex page-container relative z-10 w-full h-full min-h-[100svh] flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16">
        {isMen ? (
          /* Backward-compatibility fallback for Men (Men page uses MenHero) */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full py-4 lg:py-0">
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center z-20 order-2 lg:order-1 pt-4 lg:pt-0">
              <h1
                className="font-normal text-[#111111] uppercase tracking-[0.02em] leading-[0.92] mb-4 sm:mb-6"
                style={{
                  fontFamily: "'Beverly', var(--font-editorial), serif",
                  fontKerning: "normal",
                  fontSize: "clamp(3.2rem, 8vw, 7.5rem)",
                  fontWeight: 400,
                }}
              >
                THE MODERN<br />MAN
              </h1>
            </div>
          </div>
        ) : (
          /* ===================================================
             WOMEN COMPOSITION:
             Left: Large Female Model (Clean Cutout, 45-50% width)
             Right: Large Editorial Typography & CTA
             =================================================== */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full py-4 lg:py-0">
            {/* Left Model Column (5-6 cols on desktop) */}
            <div className="lg:col-span-6 xl:col-span-5 flex items-end justify-center lg:justify-start h-full z-10 order-1 pointer-events-none">
              <div
                className="relative flex items-end justify-center lg:justify-start w-full"
                style={{
                  opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
                  transform: prefersReducedMotion
                    ? "none"
                    : phase >= 2
                    ? `translate3d(0, ${scrollProgress * -35}px, 0)`
                    : "translate3d(-30px, 0, 0)",
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                  willChange: prefersReducedMotion ? "auto" : "transform",
                }}
              >
                {/* Contact shadow beneath model's shoes */}
                <div
                  className="absolute bottom-0 left-1/4 w-[60%] h-6 rounded-[100%] bg-black/60 blur-[10px] -z-10"
                  aria-hidden="true"
                />
                <Image
                  src="/images/women-hero.webp"
                  alt="PABLO Women's Campaign Artwork"
                  width={602}
                  height={1024}
                  priority
                  unoptimized
                  className="object-contain object-bottom w-auto select-none drop-shadow-[0_16px_32px_rgba(0,0,0,0.45)] h-[60vh] sm:h-[70vh] md:h-[76vh] lg:h-[82vh] xl:h-[86vh] max-h-[850px]"
                />
              </div>
            </div>

            {/* Right Content Column (6-7 cols on desktop) */}
            <div
              className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center z-20 order-2 text-left lg:text-right items-start lg:items-end pt-4 lg:pt-0"
              style={{
                opacity: prefersReducedMotion ? 1 : Math.max(0, 1 - scrollProgress * 1.8),
                transform: prefersReducedMotion ? "none" : `translate3d(0, ${scrollProgress * -15}px, 0)`,
                willChange: prefersReducedMotion ? "auto" : "opacity, transform",
              }}
            >
              {/* Overline with clean divider */}
              <div
                className="flex items-center gap-3 mb-4 justify-start lg:justify-end"
                style={{
                  opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
                  transform:
                    phase >= 2 || prefersReducedMotion
                      ? "translateX(0)"
                      : "translateX(12px)",
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 600ms ease-out, transform 600ms ease-out",
                }}
              >
                <span className="text-[10px] lg:text-[11px] font-sans tracking-[0.32em] uppercase text-[#111111]/85 font-medium">
                  AUTUMN / WINTER 2026
                </span>
                <span className="w-8 h-[1px] bg-[#111111]/40" />
                <span className="text-[10px] lg:text-[11px] font-sans tracking-[0.32em] uppercase text-[#111111]/85 font-medium">
                  COLLECTION
                </span>
              </div>

              {/* Large Editorial Heading */}
              <h1
                className="font-normal text-[#111111] uppercase tracking-[0.02em] leading-[0.92] mb-4 sm:mb-6"
                style={{
                  fontFamily: "'Beverly', var(--font-editorial), serif",
                  fontKerning: "normal",
                  fontSize: "clamp(3.2rem, 8vw, 7.5rem)",
                  fontWeight: 400,
                  opacity: phase >= 3 || prefersReducedMotion ? 1 : 0,
                  transform:
                    phase >= 3 || prefersReducedMotion
                      ? "translateY(0)"
                      : "translateY(18px)",
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                RAW FORM.<br />MODERN<br />SILHOUETTES.
              </h1>

              {/* Refined Statement */}
              <p
                className="text-xs sm:text-sm text-[#333333] font-light tracking-wide max-w-md leading-relaxed mb-6 sm:mb-8"
                style={{
                  opacity: phase >= 4 || prefersReducedMotion ? 1 : 0,
                  transform:
                    phase >= 4 || prefersReducedMotion
                      ? "translateY(0)"
                      : "translateY(10px)",
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 700ms ease-out, transform 700ms ease-out",
                }}
              >
                Sculptural column lines, oversized streetwear tailoring, and unapologetic posture defined by raw contemporary silhouettes.
              </p>

              {/* Explore CTA */}
              <div
                style={{
                  opacity: phase >= 5 || prefersReducedMotion ? 1 : 0,
                  transform:
                    phase >= 5 || prefersReducedMotion
                      ? "translateY(0)"
                      : "translateY(8px)",
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 600ms ease-out, transform 600ms ease-out",
                }}
              >
                <a
                  href="#catalogue"
                  onClick={handleScrollToCatalogue}
                  className="group pablo-btn-luxury inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#181818]/90 hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#181818] border border-white/25 hover:border-white backdrop-blur-sm text-[11px] sm:text-[12px] uppercase tracking-[0.26em] font-sans font-medium shadow-lg hover:shadow-xl cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>EXPLORE WOMEN&apos;S COLLECTION</span>
                  <span
                    className="btn-arrow inline-block text-xs"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
