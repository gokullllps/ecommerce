"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function MenHero() {
  // Desktop staged luxury entrance animation:
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Phone 2 Dedicated Mobile Men Hero Animation Sequence:
  // 0.15s: breadcrumb & campaign label appear
  // 0.25s: headline THE MODERN MAN reveals
  // 0.35s: model begins entering from LEFT (-25vw to 0 over 900ms)
  // 0.85s: editorial crosshair & corner marks reveal
  // 1.00s: supporting copy reveals
  // 1.15s: CTA reveals
  const [menPhase, setMenPhase] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPrefersReducedMotion(true);
      setPhase(6);
      setMenPhase(6);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 200);
    const t3 = setTimeout(() => setPhase(3), 400);
    const t4 = setTimeout(() => setPhase(4), 600);
    const t5 = setTimeout(() => setPhase(5), 750);
    const t6 = setTimeout(() => setPhase(6), 900);

    // Mobile Staged Timers:
    const m1 = setTimeout(() => setMenPhase(1), 150);
    const m2 = setTimeout(() => setMenPhase(2), 250);
    const m3 = setTimeout(() => setMenPhase(3), 350);
    const m4 = setTimeout(() => setMenPhase(4), 850);
    const m5 = setTimeout(() => setMenPhase(5), 1000);
    const m6 = setTimeout(() => setMenPhase(6), 1150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(m1);
      clearTimeout(m2);
      clearTimeout(m3);
      clearTimeout(m4);
      clearTimeout(m5);
      clearTimeout(m6);
    };
  }, []);

  const handleScrollToCatalogue = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("catalogue");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="PABLO Men's Architectural Campaign"
      className="relative w-full bg-[#EAE8E1] select-none flex flex-col md:justify-between overflow-hidden border-b border-[#D9D8D3]"
      style={{
        backgroundColor: "#EAE8E1",
      }}
    >
      {/* ─── 1. DEDICATED PURPOSE-BUILT MOBILE MEN HERO (< md) ─── */}
      {/* Built strictly from Phone 2 in primary art-direction reference */}
      <div className="flex md:hidden relative flex-col z-20 px-5 pt-3 pb-6 w-full overflow-hidden select-none">
        {/* ── Row 1: Breadcrumb + Season label ── */}
        <div className="mobile-hero-meta w-full flex items-center justify-between z-30 shrink-0">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5"
            style={{
              opacity: menPhase >= 1 || prefersReducedMotion ? 1 : 0,
              transform: menPhase >= 1 || prefersReducedMotion ? "translateY(0)" : "translateY(-4px)",
              transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
            }}
          >
            <a href="/" className="text-[11px] font-sans tracking-[0.14em] text-[#666666] hover:text-[#111111] transition-colors">
              Home
            </a>
            <span className="text-[10px] text-[#999999] select-none">&gt;</span>
            <span className="text-[11px] font-sans tracking-[0.14em] text-[#111111] font-medium">Men</span>
          </nav>
          <div
            style={{
              opacity: menPhase >= 1 || prefersReducedMotion ? 1 : 0,
              transform: menPhase >= 1 || prefersReducedMotion ? "translateY(0)" : "translateY(-4px)",
              transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
            }}
          >
            <span className="text-[9.5px] font-sans tracking-[0.24em] uppercase text-[#666666] font-medium">A/W 2026</span>
          </div>
        </div>

        {/* ── Row 2: Headline (left) + Model (right) side by side — NO dead space ── */}
        <div className="relative w-full grid grid-cols-[1fr_auto] gap-0 items-stretch mt-2.5 overflow-hidden">

          {/* LEFT: Stacked headline and supporting copy */}
          <div
            className="flex flex-col justify-between py-2 z-20"
            style={{
              opacity: menPhase >= 2 || prefersReducedMotion ? 1 : 0,
              transform: menPhase >= 2 || prefersReducedMotion ? "translateY(0)" : "translateY(8px)",
              transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
            }}
          >
            {/* Top portion: Headline */}
            <div>
              <h1
                className="font-normal text-[#111111] uppercase tracking-[0.01em] leading-[0.86] select-none text-[44px] sm:text-[50px]"
                style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
              >
                THE<br />
                MODERN<br />
                MAN
              </h1>

              {/* Crosshair accent */}
              <div
                className="mt-3 pointer-events-none"
                style={{
                  opacity: menPhase >= 4 || prefersReducedMotion ? 0.7 : 0,
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
            </div>

            {/* Bottom portion: Supporting copy + editorial tag */}
            <div
              className="mt-auto"
              style={{
                opacity: menPhase >= 5 || prefersReducedMotion ? 1 : 0,
                transform: menPhase >= 5 || prefersReducedMotion ? "translateY(0)" : "translateY(6px)",
                transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out, transform 600ms ease-out",
              }}
            >
              <p className="text-[10px] sm:text-[10.5px] text-[#222222] font-normal tracking-wide max-w-[170px] leading-[1.45] mb-2.5">
                Form. Function. Precision. Industrial accents, street-luxury tailoring for the contemporary vanguard.
              </p>
              <p className="text-[8.5px] tracking-[0.2em] font-sans font-semibold text-[#111111] uppercase leading-[1.3]">
                DETAILS<br />DEFINE<br />CHARACTER.
              </p>
              <div className="w-5 h-[1px] bg-[#111111] mt-1.5 opacity-70" />
            </div>
          </div>

          {/* RIGHT: Model image fills full right column height, touching top */}
          <div
            className="relative flex items-end justify-end z-10 pointer-events-none"
            style={{
              transform: prefersReducedMotion
                ? "none"
                : menPhase >= 3
                ? "translate3d(0, 0, 0) scale(1)"
                : "translate3d(-20vw, 0, 0) scale(1.02)",
              opacity: menPhase >= 3 || prefersReducedMotion ? 1 : 0,
              transition: prefersReducedMotion
                ? "none"
                : "transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 750ms ease-out",
            }}
          >
            {/* Ground shadow */}
            <div
              className="absolute bottom-0 right-4 w-36 h-2.5 rounded-[100%] bg-[#111111]/20 blur-[2px] z-0"
              aria-hidden="true"
            />
            <Image
              src="/images/men_hero.png"
              alt="PABLO Men's Editorial Campaign Artwork"
              width={913}
              height={857}
              priority
              unoptimized
              className="object-contain object-bottom w-auto h-[365px] sm:h-[400px] select-none pointer-events-none drop-shadow-md z-10"
            />
          </div>
        </div>

        {/* ── Row 3: CTA ── */}
        <div
          className="w-full flex justify-center z-20 pt-4 shrink-0"
          style={{
            opacity: menPhase >= 6 || prefersReducedMotion ? 1 : 0,
            transform: menPhase >= 6 || prefersReducedMotion ? "translateY(0)" : "translateY(8px)",
            transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
          }}
        >
          <a
            href="#catalogue"
            onClick={handleScrollToCatalogue}
            className="
              group flex items-center justify-center gap-2
              w-[90%] max-w-[340px] py-3.5 min-h-[46px]
              bg-[#181818] text-[#FFFFFF] active:bg-[#333333]
              border border-[#181818]
              text-xs font-sans tracking-[0.22em] uppercase font-medium
              transition-all duration-200 ease-out shadow-xs cursor-pointer select-none text-center
            "
          >
            <span>EXPLORE MEN&apos;S COLLECTION</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>
      </div>

      {/* ─── 2. PRESERVED UNTOUCHED DESKTOP MEN HERO (>= md) ─── */}
      <div className="hidden md:flex page-container relative flex-1 items-center z-10 py-4 sm:py-6 lg:py-8 md:min-h-[calc(100vh-4rem)]">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center h-full">

          {/* ── LEFT COLUMN: THE MODERN MAN & CTA (Cols 1-6) ── */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center z-20 order-2 lg:order-1">
            {/* Monumental Stacked Heading: THE / MODERN / MAN */}
            <h1
              className="font-normal text-[#111111] uppercase tracking-[0.01em] leading-[0.88] mb-5 sm:mb-6"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                fontSize: "clamp(4rem, 8.8vw, 8.6rem)",
                fontWeight: 400,
                opacity: phase >= 3 || prefersReducedMotion ? 1 : 0,
                transform:
                  phase >= 3 || prefersReducedMotion
                    ? "translateY(0)"
                    : "translateY(16px)",
                transition: prefersReducedMotion
                  ? "none"
                  : "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              THE<br />
              MODERN<br />
              MAN
            </h1>

            {/* Philosophy Statement & Sub-copy */}
            <p
              className="text-xs sm:text-[13px] text-[#666666] font-light tracking-wide max-w-sm sm:max-w-md leading-relaxed mb-6 sm:mb-8"
              style={{
                opacity: phase >= 4 || prefersReducedMotion ? 1 : 0,
                transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out",
              }}
            >
              FORM. FUNCTION. PRECISION. Industrial accents, street-luxury tailoring, and architectural silhouettes designed for the contemporary vanguard.
            </p>

            {/* Rectangular Dark Explore CTA Button */}
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

          {/* ── RIGHT COLUMN: LARGE EDITORIAL ARTWORK (Cols 7-12) ── */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-end justify-center lg:justify-end xl:justify-center h-full z-10 order-1 lg:order-2">

            {/* Editorial Artwork Container — lifted slightly so shoes remain fully visible above the bottom edge */}
            <div
              className="relative flex items-end justify-center lg:justify-end xl:justify-center w-full pb-6 sm:pb-8 lg:pb-10"
              style={{
                opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
                transform:
                  phase >= 2 || prefersReducedMotion
                    ? "translate3d(0, 0, 0)"
                    : "translate3d(-20px, 0, 0)",
                transition: prefersReducedMotion
                  ? "none"
                  : "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform, opacity",
              }}
            >
              {/* Supplied Artwork: Model + Smoke + Pattern on Transparent Background */}
              <Image
                src="/images/men_hero.png"
                alt="PABLO Men's Editorial Campaign Artwork"
                width={913}
                height={857}
                priority
                unoptimized
                className="
                  object-contain object-bottom w-auto select-none pointer-events-none z-10
                  h-[60vh] sm:h-[70vh] md:h-[76vh] lg:h-[82vh] xl:h-[86vh] max-h-[820px]
                "
              />
            </div>

          </div>

        </div>
      </div>


    </section>
  );
}
