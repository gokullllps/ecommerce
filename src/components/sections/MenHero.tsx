"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export interface MenHeroProps {
  onExploreClick?: (e: React.MouseEvent) => void;
}

export default function MenHero({ onExploreClick }: MenHeroProps = {}) {
  // Staged luxury entrance animation system identical to SaleHero:
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

    const t1 = setTimeout(() => setPhase(1), 60);  // Background & cinematic landscape reveal
    const t2 = setTimeout(() => setPhase(2), 220); // Model smooth entrance
    const t3 = setTimeout(() => setPhase(3), 480); // Main headline "THE MODERN MAN" reveal
    const t4 = setTimeout(() => setPhase(4), 720); // Crosshair & philosophy description
    const t5 = setTimeout(() => setPhase(5), 940); // CTAs and secondary navigation

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleScrollToCatalogue = (e: React.MouseEvent) => {
    if (onExploreClick) {
      onExploreClick(e);
      return;
    }
    e.preventDefault();
    const target =
      document.getElementById("categories") ||
      document.getElementById("men-categories") ||
      document.getElementById("catalogue");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="men-hero"
      aria-label="PABLO Men's Architectural Campaign"
      className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden select-none bg-[#11100E] text-[#111111]"
      style={{
        backgroundColor: "#11100E",
        minHeight: "100svh",
        height: "100svh",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════
          LAYER 1: CINEMATIC MONOCHROME LANDSCAPE BACKGROUND
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
        style={{
          opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
          transform:
            phase >= 1 || prefersReducedMotion
              ? "scale(1)"
              : "scale(1.04)",
          transition: prefersReducedMotion
            ? "none"
            : "opacity 1000ms ease-out, transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Image
          src="/images/man-bg.webp"
          alt="PABLO Men's Architectural Campaign Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] md:object-[center_35%] w-full h-full"
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

        {/* Subtle Bottom Boundary Shadow: Grounds the terrain into the catalogue section */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to top, rgba(17,16,14,0.35) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 2: ATMOSPHERIC GROUND MIST
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-x-0 bottom-0 h-36 pointer-events-none z-10 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(234, 232, 225, 0.15) 0%, rgba(200, 195, 185, 0.05) 50%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 3: FOREGROUND MODEL (Desktop >= md)
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex absolute bottom-0 right-[2%] lg:right-[6%] xl:right-[10%] 2xl:right-[14%] h-[82%] lg:h-[88%] xl:h-[94%] items-end pointer-events-none z-20"
        style={{
          opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
          transform: prefersReducedMotion
            ? "none"
            : phase >= 2
              ? "translate3d(0, 0, 0)"
              : "translate3d(-24px, 16px, 0)",
          transition: prefersReducedMotion
            ? "none"
            : "opacity 900ms ease-out, transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform, opacity",
        }}
      >
        {/* Contact shadow beneath model's shoes */}
        <div
          className="absolute bottom-0 left-1/4 w-[65%] h-6 rounded-[100%] bg-black/60 blur-[10px] -z-10"
          aria-hidden="true"
        />

        {/* High-res model with natural smoke integration */}
        <div
          className="relative h-full w-auto flex items-end"
          style={{
            filter: "contrast(1.02) drop-shadow(0 16px 32px rgba(0,0,0,0.5))",
          }}
        >
          <Image
            src="/images/man-hero.webp"
            alt="PABLO Men's Editorial Campaign Model"
            width={1265}
            height={1448}
            priority
            unoptimized
            className="h-full w-auto object-contain object-bottom select-none pointer-events-none"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 4: EDITORIAL TYPOGRAPHY & CONTENT (Desktop >= md)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex page-container relative z-30 w-full h-full min-h-[100svh] flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Overline with clean divider */}
          <div
            className="flex items-center gap-3 mb-4"
            style={{
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 2 || prefersReducedMotion
                  ? "translateX(0)"
                  : "translateX(-12px)",
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
              ARCHITECTURAL MENSWEAR
            </span>
          </div>

          {/* Grand Headline: THE MODERN MAN */}
          <h1
            className="font-normal text-[#111111] uppercase tracking-[0.01em] leading-[0.88] select-none text-5xl lg:text-7xl xl:text-8xl mb-5"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
              opacity: phase >= 3 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 3 || prefersReducedMotion
                  ? "translateY(0)"
                  : "translateY(16px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            THE<br />
            MODERN<br />
            MAN
          </h1>

          {/* Decorative Crosshair Accent */}
          <div
            className="mb-5 pointer-events-none"
            style={{
              opacity: phase >= 4 || prefersReducedMotion ? 0.75 : 0,
              transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out",
            }}
          >
            <svg width="18" height="38" viewBox="0 0 18 42" fill="none" className="text-[#111111]" aria-hidden="true">
              <line x1="9" y1="0" x2="9" y2="42" stroke="currentColor" strokeWidth="0.75" />
              <line x1="0" y1="21" x2="18" y2="21" stroke="currentColor" strokeWidth="0.75" />
              <polygon points="9,14 11,21 9,28 7,21" fill="currentColor" />
              <polygon points="2,21 9,19 16,21 9,23" fill="currentColor" />
            </svg>
          </div>

          {/* Philosophy Statement & Sub-copy */}
          <p
            className="text-xs sm:text-[13px] text-[#333333] font-light tracking-wide max-w-sm sm:max-w-md leading-relaxed mb-8"
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
            FORM. FUNCTION. PRECISION. Industrial accents, street-luxury tailoring, and architectural silhouettes designed for the contemporary vanguard.
          </p>

          {/* Explore Button & Secondary Link */}
          <div
            className="flex items-center gap-5"
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
                px-8 sm:px-10 py-3.5 sm:py-4
                bg-[#181818]/90 hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#181818]
                border border-white/25 hover:border-white
                backdrop-blur-sm
                text-[11px] sm:text-[12px] uppercase tracking-[0.26em] font-sans font-medium
                transition-all duration-300 ease-out
                shadow-lg hover:shadow-xl
                cursor-pointer select-none
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
              "
            >
              <span>EXPLORE MEN&apos;S COLLECTION</span>
              <span
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 text-xs"
                aria-hidden="true"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 5: DEDICATED PURPOSE-BUILT MOBILE HERO (< md)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden relative flex-col justify-between z-30 px-5 pt-16 pb-3 h-[100svh] min-h-[100svh] w-full overflow-hidden">
        {/* 1. Mobile Top Row: Breadcrumb & Season Label */}
        <div className="flex items-center justify-between w-full pt-1 z-30">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5"
            style={{
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 2 || prefersReducedMotion
                  ? "translateX(0)"
                  : "translateX(-8px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 600ms ease-out, transform 600ms ease-out",
            }}
          >
            <span className="text-[10px] font-sans tracking-[0.24em] uppercase text-[#111111]/80 font-medium">
              HOME
            </span>
            <span className="text-[9px] text-[#111111]/50">&gt;</span>
            <span className="text-[10px] font-sans tracking-[0.24em] uppercase text-[#111111] font-semibold">
              MEN
            </span>
          </nav>

          <div
            style={{
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out",
            }}
          >
            <span className="text-[9.5px] font-sans tracking-[0.26em] uppercase text-[#111111]/80 font-medium">
              A/W 2026
            </span>
          </div>
        </div>

        {/* 2. Mobile Typography: THE MODERN MAN + Supporting Copy */}
        <div className="relative z-25 max-w-[280px] sm:max-w-[320px] mt-2 mb-auto">
          <h1
            className="font-normal text-[#111111] uppercase tracking-[0.01em] leading-[0.88] select-none text-[42px] sm:text-[48px] mb-2"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
              opacity: phase >= 3 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 3 || prefersReducedMotion
                  ? "translateY(0)"
                  : "translateY(12px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            THE<br />
            MODERN<br />
            MAN
          </h1>

          <p
            className="text-[9.5px] sm:text-[10px] text-[#222222] font-light tracking-[0.16em] uppercase leading-relaxed mb-2"
            style={{
              opacity: phase >= 4 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 4 || prefersReducedMotion
                  ? "translateY(0)"
                  : "translateY(8px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 600ms ease-out, transform 600ms ease-out",
            }}
          >
            FORM. FUNCTION. PRECISION.<br />
            ARCHITECTURAL TAILORING.
          </p>
        </div>

        {/* 3. Mobile Centrally Positioned Men's Model (Integrated with background) */}
        <div className="absolute inset-x-0 bottom-14 sm:bottom-16 h-[54%] sm:h-[60%] flex items-end justify-center pointer-events-none z-15 overflow-hidden">
          {/* Contact shadow */}
          <div
            className="absolute bottom-0 w-[55%] h-5 rounded-[100%] bg-black/60 blur-md -z-10"
            aria-hidden="true"
          />

          <div
            className="relative h-full w-auto flex items-end"
            style={{
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transform: prefersReducedMotion
                ? "none"
                : phase >= 2
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(0, 16px, 0)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 800ms ease-out, transform 950ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Image
              src="/images/man-hero.webp"
              alt="PABLO Men's Editorial Campaign Model"
              width={1170}
              height={1345}
              priority
              unoptimized
              className="h-full w-auto object-contain object-bottom select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
            />
          </div>
        </div>

        {/* 4. Mobile Bottom CTA & Metadata Strip */}
        <div className="relative z-30 w-full flex flex-col gap-2.5 pt-2 pb-1">
          <a
            href="#catalogue"
            onClick={handleScrollToCatalogue}
            className="
              group flex items-center justify-center gap-2.5
              w-full py-3.5 min-h-[46px]
              bg-[#181818]/90 active:bg-[#FFFFFF] text-[#FFFFFF] active:text-[#181818]
              border border-white/25 active:border-white
              backdrop-blur-sm
              text-xs font-sans tracking-[0.24em] uppercase font-medium
              transition-all duration-300 ease-out shadow-xl cursor-pointer text-center select-none
            "
          >
            <span>EXPLORE MEN&apos;S COLLECTION</span>
            <span
              className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 text-xs"
              aria-hidden="true"
            >
              →
            </span>
          </a>

          <div className="flex items-center justify-between text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#111111]/70 font-sans pt-2 border-t border-[#111111]/15 w-full">
            <span>A/W 2026 ARCHITECTURAL MENSWEAR</span>
            <span>COMPLIMENTARY GLOBAL DELIVERY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
