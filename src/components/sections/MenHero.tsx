"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function MenHero() {
  // Staged luxury editorial entrance animation:
  // Phase 1 (50ms):  Background subtle typography and metadata appear
  // Phase 2 (200ms): Men model softly fades in from left with subtle horizontal shift
  // Phase 3 (400ms): Monumental heading "THE MODERN MAN" appears
  // Phase 4 (600ms): Supporting philosophy description appears
  // Phase 5 (750ms): Explore collection CTA button appears
  // Phase 6 (900ms): Right-side editorial details & progress indicator appear
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPrefersReducedMotion(true);
      setPhase(6);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 200);
    const t3 = setTimeout(() => setPhase(3), 400);
    const t4 = setTimeout(() => setPhase(4), 600);
    const t5 = setTimeout(() => setPhase(5), 750);
    const t6 = setTimeout(() => setPhase(6), 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
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
      className="relative w-full bg-[#EAE8E1] select-none flex flex-col justify-between overflow-hidden border-b border-[#D9D8D3]"
      style={{
        backgroundColor: "#EAE8E1",
        minHeight: "calc(100vh - 4rem)",
      }}
    >


      <div className="page-container relative flex-1 flex items-center z-10 py-4 sm:py-6 lg:py-8">
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
