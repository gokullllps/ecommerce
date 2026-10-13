"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MEN_CATEGORIES_DATA } from "@/data/categories";

export function CategoriesSection() {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Duplicate items for a mathematically seamless, infinite horizontal loop
  const duplicatedCategories = [...MEN_CATEGORIES_DATA, ...MEN_CATEGORIES_DATA];

  // Static accessible layout if reduced motion is requested
  if (prefersReducedMotion) {
    return (
      <section
        id="categories"
        aria-label="PABLO Categories Showcase"
        className="relative w-full py-16 sm:py-24 bg-[#EAE8E1] text-[#111111] overflow-hidden select-none"
      >
        <div className="text-center shrink-0 px-4 mb-8 sm:mb-12">
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#666666] font-medium mb-2.5">
            Maison Portfolio · 2026
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.22em] text-[#111111] inline-block"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
          >
            CATEGORIES
          </h2>
          <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-3.5 opacity-40" />
        </div>

        <div className="page-container w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {MEN_CATEGORIES_DATA.map((category) => (
              <div
                key={category.id}
                className="relative w-full aspect-[3/4.4] rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#181818] shadow-[0_20px_45px_rgba(0,0,0,0.20)] border border-black/10"
              >
                <Link
                  href={category.href}
                  aria-label={`Explore ${category.name} Collection`}
                  className="group relative block w-full h-full"
                >
                  <Image
                    src={category.imageSrc}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/92 via-black/45 to-transparent pointer-events-none" />
                  <div className="absolute top-4 right-4 z-20 pointer-events-none">
                    <span className="text-[9px] uppercase tracking-[0.22em] text-white/50 font-medium font-sans">
                      PABLO
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-20 pb-6 px-5 text-center flex flex-col items-center">
                    <span className="text-[10px] font-sans font-medium uppercase tracking-[0.26em] text-white/70 block mb-1">
                      COLLECTION
                    </span>
                    <h3
                      className="text-2xl font-normal text-white tracking-[0.06em]"
                      style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
                    >
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="categories"
      aria-label="PABLO Categories Showcase"
      className="pablo-category-section relative w-full py-16 sm:py-24 bg-[#EAE8E1] text-[#111111] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes pabloCategoryGlide {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .pablo-category-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: pabloCategoryGlide 48s linear infinite;
        }
        .pablo-category-section:hover .pablo-category-track,
        .pablo-category-section:focus-within .pablo-category-track,
        .pablo-category-track:hover,
        .pablo-category-track:focus-within {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* ─── 1. SECTION HEADER ─── */}
      <div className="text-center shrink-0 px-4 mb-8 sm:mb-12">
        <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#666666] font-medium mb-2.5">
          Maison Portfolio · 2026
        </span>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.22em] text-[#111111] inline-block"
          style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
        >
          CATEGORIES
        </h2>
        <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-3.5 opacity-40" />
      </div>

      {/* ─── 2. CONTINUOUS HORIZONTAL CINEMATIC LOOP CONTAINER ─── */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left Edge Luxury Vignette Fade */}
        <div
          className="absolute left-0 inset-y-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#EAE8E1] via-[#EAE8E1]/80 to-transparent pointer-events-none z-20"
          aria-hidden="true"
        />

        {/* Right Edge Luxury Vignette Fade */}
        <div
          className="absolute right-0 inset-y-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#EAE8E1] via-[#EAE8E1]/80 to-transparent pointer-events-none z-20"
          aria-hidden="true"
        />

        {/* Glide Track with Seamless Duplicated Items */}
        <div
          className="pablo-category-track flex items-center gap-6 sm:gap-7 md:gap-8 px-4"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {duplicatedCategories.map((category, index) => (
            <div
              key={`${category.id}-${index}`}
              className="shrink-0 w-[245px] sm:w-[280px] md:w-[320px] h-[365px] sm:h-[420px] md:h-[475px]"
            >
              <Link
                href={category.href}
                aria-label={`Explore ${category.name} Collection`}
                className="group relative block w-full h-full rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#181818] shadow-[0_20px_45px_rgba(0,0,0,0.20)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.30)] border border-black/10 hover:border-black/30 transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] cursor-pointer select-none hover:scale-[1.015]"
              >
                {/* Category Photographic Asset */}
                <Image
                  src={category.imageSrc}
                  alt={category.imageAlt}
                  fill
                  sizes="(max-width: 768px) 260px, 340px"
                  priority={index < 4}
                  className="object-cover object-center w-full h-full select-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />

                {/* Top Subtle Vignette */}
                <div
                  className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10 bg-gradient-to-b from-black/45 via-black/15 to-transparent"
                  aria-hidden="true"
                />

                {/* Brand Watermark (Top-Right) */}
                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                  <span className="text-[9px] uppercase tracking-[0.22em] text-white/50 font-medium font-sans">
                    PABLO
                  </span>
                </div>

                {/* Bottom Vignette for High Text Legibility */}
                <div
                  className="absolute inset-x-0 bottom-0 h-44 sm:h-52 pointer-events-none z-10 bg-gradient-to-t from-black/92 via-black/45 to-transparent"
                  aria-hidden="true"
                />

                {/* Bottom Typography & Discover Pill */}
                <div className="absolute inset-x-0 bottom-0 z-20 pb-6 sm:pb-8 px-5 sm:px-6 text-center flex flex-col items-center justify-end pointer-events-none">
                  <span className="text-[10px] sm:text-[10.5px] font-sans font-medium uppercase tracking-[0.26em] text-white/70 block mb-1">
                    COLLECTION
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl md:text-[2rem] font-normal text-white tracking-[0.06em] leading-tight mb-3 transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                    }}
                  >
                    {category.name}
                  </h3>

                  {/* Discover Pill */}
                  <div className="transition-all duration-300 flex items-center gap-2 bg-[#EAE8E1] text-[#111111] px-4 py-1.5 rounded-full text-[9.5px] uppercase tracking-[0.22em] font-medium shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>DISCOVER</span>
                    <span className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
