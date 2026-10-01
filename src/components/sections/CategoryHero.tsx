"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface CategoryHeroProps {
  gender: "men" | "women";
}

export default function CategoryHero({ gender }: CategoryHeroProps) {
  // Staged luxury entrance animation:
  // Phase 1 (50ms):  Metadata fades in
  // Phase 2 (200ms): Model softly fades in from left with subtle horizontal translation
  // Phase 3 (450ms): Main editorial heading fades in / up
  // Phase 4 (650ms): 4 Category navigation links appear
  // Phase 5 (850ms): Primary CTA appears last
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPrefersReducedMotion(true);
      setPhase(5);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 200);
    const t3 = setTimeout(() => setPhase(3), 450);
    const t4 = setTimeout(() => setPhase(4), 650);
    const t5 = setTimeout(() => setPhase(5), 850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const isMen = gender === "men";

  const handleScrollToCatalogue = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("catalogue");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <section
      aria-label={isMen ? "PABLO Men's Editorial" : "PABLO Women's Editorial"}
      className="relative w-full bg-[#EAE8E1] select-none flex flex-col md:justify-between overflow-hidden border-b border-[#D9D8D3]"
      style={{
        backgroundColor: "#EAE8E1",
      }}
    >
      {/* ─── 1. DEDICATED PURPOSE-BUILT MOBILE HERO (< md) ─── */}
      <div className="flex md:hidden relative flex-col items-center z-20 px-4 pt-3 pb-6 w-full select-none overflow-hidden">
        <div className="women-mobile-hero-content w-full max-w-[340px] sm:max-w-[360px] mx-auto flex flex-col items-start">

          {/* ── Row 1: Dedicated Top Metadata Row ── */}
          <div className="mobile-hero-meta w-full flex items-center justify-between z-30 shrink-0">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5"
              style={{
                opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
                transform: phase >= 1 || prefersReducedMotion ? "translateY(0)" : "translateY(-4px)",
                transition: prefersReducedMotion ? "none" : "opacity 400ms ease-out, transform 400ms ease-out",
              }}
            >
              <a href="/" className="text-[11px] font-sans tracking-[0.14em] text-[#666666] hover:text-[#111111] transition-colors">
                Home
              </a>
              <span className="text-[10px] text-[#999999] select-none">&gt;</span>
              <span className="text-[11px] font-sans tracking-[0.14em] text-[#111111] font-medium">
                {isMen ? "Men" : "Women"}
              </span>
            </nav>
            {isMen && (
              <div
                style={{
                  opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
                  transform: phase >= 1 || prefersReducedMotion ? "translateY(0)" : "translateY(-4px)",
                  transition: prefersReducedMotion ? "none" : "opacity 400ms ease-out, transform 400ms ease-out",
                }}
              >
                <span className="text-[9.5px] font-sans tracking-[0.24em] uppercase text-[#666666] font-medium">
                  A/W 2026
                </span>
              </div>
            )}
          </div>

          {/* ── Row 2: Campaign Sub-Label (compact, Men only) ── */}
          {isMen && (
            <div
              className="w-full text-left mt-2.5 shrink-0"
              style={{
                opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
                transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out",
              }}
            >
              <span className="text-[9px] font-sans tracking-[0.26em] uppercase text-[#666666] font-medium">
                ARCHITECTURAL MENSWEAR // 2026
              </span>
            </div>
          )}

          {/* ── Row 3: Headline (Left-aligned inside Centered Column) ── */}
          <div
            className={`w-full text-left ${isMen ? "mt-3" : "mt-2.5"} z-20 shrink-0`}
            style={{
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transform: phase >= 2 || prefersReducedMotion ? "translateY(0)" : "translateY(6px)",
              transition: prefersReducedMotion ? "none" : "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <h1
              className="font-normal text-[#111111] uppercase tracking-[0.01em] leading-[0.88] select-none text-[38px] sm:text-[44px]"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
            >
              RAW FORM.<br />
              MODERN<br />
              SILHOUETTES.
            </h1>
          </div>

          {/* ── Row 4: Dedicated Centered Mobile Visual Stage ── */}
          <div className="women-mobile-visual-stage relative w-full h-[345px] sm:h-[375px] flex items-end justify-center mt-1 shrink-0">
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

            {/* Model + Editorial Pattern Container — Substantially Scaled (+30%), Enters From Left, Settles Centered */}
            <div
              className="relative flex items-end justify-center z-20 pointer-events-none"
              style={{
                transform: prefersReducedMotion
                  ? "none"
                  : phase >= 2
                  ? "translate3d(0, 0, 0) scale(1)"
                  : "translate3d(-25vw, 0, 0) scale(1.03)",
                opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
                transition: prefersReducedMotion
                  ? "none"
                  : "transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 750ms ease-out",
                willChange: "transform, opacity",
              }}
            >
              {/* Ground shadow under sneakers */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 sm:w-48 h-3 rounded-[100%] bg-[#111111]/20 blur-[2.5px] z-0"
                aria-hidden="true"
              />
              <Image
                src="/images/pablo-women-hero.png"
                alt="PABLO Women's Campaign Model"
                width={602}
                height={1024}
                priority
                unoptimized
                className="object-contain object-bottom w-auto h-[345px] sm:h-[375px] select-none pointer-events-none drop-shadow-sm z-10"
              />
            </div>
          </div>

          {/* ── Row 5: Supporting Editorial Copy (Left-aligned inside Centered Column) ── */}
          <div
            className="w-full text-left mt-3 z-20 shrink-0"
            style={{
              opacity: phase >= 4 || prefersReducedMotion ? 1 : 0,
              transform: phase >= 4 || prefersReducedMotion ? "translateY(0)" : "translateY(4px)",
              transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out, transform 600ms ease-out",
            }}
          >
            <p className="text-[10px] sm:text-[10.5px] text-[#222222] font-normal tracking-wide max-w-[290px] leading-[1.45]">
              Sculptural column lines, oversized streetwear tailoring, and contemporary silhouettes.
            </p>
            <div className="w-5 h-[1px] bg-[#111111] mt-1.5 opacity-70" />
          </div>

          {/* ── Row 6: Centered CTA ── */}
          <div
            className="w-full flex justify-center mt-4 z-20 shrink-0"
            style={{
              opacity: phase >= 5 || prefersReducedMotion ? 1 : 0,
              transform: phase >= 5 || prefersReducedMotion ? "translateY(0)" : "translateY(6px)",
              transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
            }}
          >
            <a
              href="#catalogue"
              onClick={handleScrollToCatalogue}
              className="
                group flex items-center justify-center gap-2
                w-full max-w-[320px] py-3.5 min-h-[46px] mx-auto
                bg-[#181818] text-[#FFFFFF] active:bg-[#333333]
                border border-[#181818]
                text-xs font-sans tracking-[0.22em] uppercase font-medium
                transition-all duration-200 ease-out shadow-xs cursor-pointer select-none text-center
              "
            >
              <span>EXPLORE WOMEN&apos;S COLLECTION</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── 2. PRESERVED UNTOUCHED DESKTOP CATEGORY HERO (>= md) ─── */}
      <div className="hidden md:flex page-container relative flex-1 items-center z-10 py-4 sm:py-6 lg:py-8 md:min-h-[calc(100vh-4rem)]">
        {isMen ? (
          /* ===================================================
             MEN COMPOSITION:
             Left: Large Editorial Typography & CTA
             Right: Large Male Model (45-50% width, 75-88% height)
             =================================================== */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full py-4 lg:py-0">
            {/* Left Content Column (7 cols on desktop) */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center z-20 order-2 lg:order-1 pt-4 lg:pt-0">
              {/* Category Subtitle */}
              <div
                className="mb-3 sm:mb-4"
                style={{
                  opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
                  transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out",
                }}
              >
                <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] uppercase text-[#666666] font-medium">
                  ARCHITECTURAL MENSWEAR // 2026
                </span>
              </div>

              {/* Large Editorial Heading */}
              <h1
                className="font-normal text-[#111111] uppercase tracking-[0.02em] leading-[0.92] mb-4 sm:mb-6"
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
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
                THE MODERN<br />MAN
              </h1>

              {/* Refined Statement */}
              <p
                className="text-xs sm:text-sm text-[#666666] font-light tracking-wide max-w-md leading-relaxed mb-6 sm:mb-8"
                style={{
                  opacity: phase >= 3 || prefersReducedMotion ? 1 : 0,
                  transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out 100ms",
                }}
              >
                FORM. FUNCTION. PRECISION. Industrial accents, street-luxury tailoring, and architectural silhouettes designed for the contemporary vanguard.
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
                  className="
                    group inline-flex items-center justify-center gap-3
                    px-7 sm:px-9 py-3 sm:py-3.5
                    bg-[#181818] text-[#FFFFFF] hover:bg-[#EAE8E1] hover:text-[#111111]
                    border border-[#181818] hover:border-[#111111]
                    text-[11px] sm:text-xs font-sans tracking-[0.22em] uppercase font-medium
                    transition-all duration-300 ease-out shadow-xs cursor-pointer
                  "
                >
                  <span>EXPLORE MEN&apos;S COLLECTION</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">
                    →
                  </span>
                </a>
              </div>
            </div>

            {/* Right Model Column (5-6 cols on desktop) */}
            <div className="lg:col-span-6 xl:col-span-5 flex items-end justify-center lg:justify-end h-full z-10 order-1 lg:order-2 pointer-events-none">
              <div
                className="relative flex items-end justify-center w-full"
                style={{
                  opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
                  transform:
                    phase >= 2 || prefersReducedMotion
                      ? "translate3d(0, 0, 0)"
                      : "translate3d(-30px, 0, 0)",
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                  willChange: "transform, opacity",
                }}
              >
                <Image
                  src="/images/pablo-men-hero.png"
                  alt="PABLO Men's Campaign Model"
                  width={682}
                  height={1024}
                  priority
                  unoptimized
                  className="
                    object-contain w-auto select-none
                    h-[55vh] sm:h-[65vh] md:h-[72vh] lg:h-[80vh] xl:h-[84vh] max-h-[850px]
                  "
                />
              </div>
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
                className="relative flex items-end justify-center w-full"
                style={{
                  opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
                  transform:
                    phase >= 2 || prefersReducedMotion
                      ? "translate3d(0, 0, 0)"
                      : "translate3d(-30px, 0, 0)",
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                  willChange: "transform, opacity",
                }}
              >
                <Image
                  src="/images/pablo-women-hero.png"
                  alt="PABLO Women's Campaign Artwork"
                  width={602}
                  height={1024}
                  priority
                  unoptimized
                  className="
                    object-contain object-bottom w-auto select-none
                    h-[55vh] sm:h-[65vh] md:h-[72vh] lg:h-[80vh] xl:h-[84vh] max-h-[850px]
                  "
                />
              </div>
            </div>

            {/* Right Content Column (6-7 cols on desktop) */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center z-20 order-2 text-left lg:text-right items-start lg:items-end pt-4 lg:pt-0">
              {/* Large Editorial Heading */}
              <h1
                className="font-normal text-[#111111] uppercase tracking-[0.02em] leading-[0.92] mb-4 sm:mb-6"
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
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
                className="text-xs sm:text-sm text-[#666666] font-light tracking-wide max-w-md leading-relaxed mb-6 sm:mb-8"
                style={{
                  opacity: phase >= 3 || prefersReducedMotion ? 1 : 0,
                  transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out 100ms",
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
                  className="
                    group inline-flex items-center justify-center gap-3
                    px-7 sm:px-9 py-3 sm:py-3.5
                    bg-[#181818] text-[#FFFFFF] hover:bg-[#EAE8E1] hover:text-[#111111]
                    border border-[#181818] hover:border-[#111111]
                    text-[11px] sm:text-xs font-sans tracking-[0.22em] uppercase font-medium
                    transition-all duration-300 ease-out shadow-xs
                  "
                >
                  <span>EXPLORE WOMEN&apos;S COLLECTION</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">
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
