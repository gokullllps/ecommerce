"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { MEN_CATEGORIES_DATA } from "@/data/categories";

export function CategoriesSection() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isTouchPaused, setIsTouchPaused] = useState(false);
  const touchPauseTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Responsive Rummy Card Dimensions
  const [dimensions, setDimensions] = useState({
    cardWidth: 290,
    cardHeight: 440,
    cardSpacing: 215,
    arcDrop: 44,
    maxRot: 3.2,
    containerHeight: 580,
    durationSec: 28, // ~92 px/sec (2580px / 28s)
  });

  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    if (w < 380) {
      setDimensions({
        cardWidth: 185,
        cardHeight: 285,
        cardSpacing: 132,
        arcDrop: 22,
        maxRot: 2.0,
        containerHeight: 385,
        durationSec: 19,
      });
    } else if (w < 640) {
      setDimensions({
        cardWidth: 210,
        cardHeight: 320,
        cardSpacing: 150,
        arcDrop: 28,
        maxRot: 2.4,
        containerHeight: 430,
        durationSec: 21, // ~85 px/sec (1800px / 21s)
      });
    } else if (w < 1024) {
      setDimensions({
        cardWidth: 250,
        cardHeight: 380,
        cardSpacing: 180,
        arcDrop: 36,
        maxRot: 2.8,
        containerHeight: 510,
        durationSec: 24, // ~90 px/sec (2160px / 24s)
      });
    } else {
      setDimensions({
        cardWidth: 290,
        cardHeight: 440,
        cardSpacing: 215,
        arcDrop: 44,
        maxRot: 3.2,
        containerHeight: 580,
        durationSec: 28, // ~92 px/sec (2580px / 28s)
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  // Static fallback if prefers-reduced-motion is active
  if (prefersReducedMotion) {
    return (
      <section
        id="categories"
        aria-label="PABLO Categories Showcase"
        className="relative w-full py-12 sm:py-16 bg-[#EAE8E1] text-[#111111] overflow-hidden select-none"
      >
        <div className="text-center shrink-0 px-4 mb-6 sm:mb-8">
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#666666] font-medium mb-1.5">
            Maison Portfolio · 2026
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.22em] text-[#111111] inline-block"
            style={{ fontFamily: "'Orborn', sans-serif" }}
          >
            CATEGORIES
          </h2>
          <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-2.5 opacity-40" />
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
                  className="shiny-card group relative block w-full h-full transition-all duration-500 ease-out hover:-translate-y-[4px]"
                >
                  <Image
                    src={category.imageSrc}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 310px"
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/92 via-black/45 to-transparent pointer-events-none z-10" />
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
                      style={{ fontFamily: "'Orborn', sans-serif" }}
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

  // Render a sequence of 12 categories in curved Rummy playing-card fanned arrangement
  const renderCardSequence = (isClone: boolean) => {
    return MEN_CATEGORIES_DATA.map((category, idx) => {
      const cardKey = `${isClone ? "clone" : "orig"}-${category.id}-${idx}`;
      const isHovered = hoveredKey === cardKey;

      // Symmetrical curved arc calculation:
      // Center cards (idx 5 & 6) sit highest (offsetY ≈ 0)
      // Cards progressively lower toward both left (idx 0) and right (idx 11) edges
      // Continuous cosine wave over period 12 guarantees seamless boundary continuity
      const theta = ((idx - 5.5) / 6) * Math.PI;
      const archVal = (1 + Math.cos(theta)) / 2; // ~0.983 at center, ~0.017 at edges
      const naturalOffsetY = Math.round((1 - archVal) * dimensions.arcDrop);

      // Arc tangent rotation with subtle rummy playing-card alternation
      const slopeRot = Math.sin(theta) * dimensions.maxRot;
      const rummyJitter = idx % 2 === 0 ? -0.7 : 0.7;
      const naturalRot = Math.round((slopeRot + rummyJitter) * 10) / 10;

      // Layered deck stacking: center cards sit on top, cascading down to outer edges
      const baseZ = 10 + Math.round(archVal * 20);

      return (
        <div
          key={cardKey}
          className={`pablo-card-wrapper relative shrink-0 flex items-center justify-start select-none ${
            isHovered ? "is-hovered" : ""
          }`}
          style={{
            width: `${dimensions.cardSpacing}px`,
            height: `${dimensions.cardHeight}px`,
            zIndex: isHovered ? 90 : baseZ,
            ...({
              "--card-offset-y": `${naturalOffsetY}px`,
              "--card-rot": `${naturalRot}deg`,
            } as React.CSSProperties),
          }}
          onMouseEnter={() => setHoveredKey(cardKey)}
          onMouseLeave={() => setHoveredKey(null)}
        >
          {/* Rummy Playing Card with genuine dimensions and curved arc positioning */}
          <div
            className="pablo-card-inner relative rounded-[22px] sm:rounded-[26px]"
            style={{
              width: `${dimensions.cardWidth}px`,
              height: `${dimensions.cardHeight}px`,
            }}
          >
            <Link
              href={category.href}
              aria-label={isClone ? undefined : `Explore ${category.name} Collection`}
              tabIndex={isClone ? -1 : 0}
              aria-hidden={isClone ? "true" : undefined}
              className="pablo-card-link shiny-card group relative block w-full h-full rounded-[22px] sm:rounded-[26px] overflow-hidden"
            >
              {/* Category Photographic Asset */}
              <Image
                src={category.imageSrc}
                alt={category.imageAlt}
                fill
                sizes="(max-width: 640px) 210px, (max-width: 1024px) 250px, 290px"
                priority={!isClone && idx < 3}
                loading={!isClone && idx < 5 ? "eager" : "lazy"}
                className="pablo-card-image"
              />

              {/* Top Subtle Vignette */}
              <div
                className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10 bg-gradient-to-b from-black/45 via-black/15 to-transparent"
                aria-hidden="true"
              />

              {/* Brand Watermark (Top-Right) */}
              <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <span className="pablo-card-watermark text-[9px] uppercase tracking-[0.22em] text-white/50 font-medium font-sans">
                  PABLO
                </span>
              </div>

              {/* PABLO Signature Warm Cream Highlight Color Veil on Hover */}
              <div className="pablo-card-veil" aria-hidden="true" />

              {/* Bottom Vignette for High Text Legibility */}
              <div
                className="absolute inset-x-0 bottom-0 h-44 sm:h-52 pointer-events-none z-10 bg-gradient-to-t from-black/92 via-black/45 to-transparent"
                aria-hidden="true"
              />

              {/* Ambient dark depth vignette */}
              <div
                className="absolute inset-x-0 bottom-0 h-44 sm:h-52 pointer-events-none z-10 transition-opacity duration-300 ease-out opacity-60"
                style={{
                  background:
                    "linear-gradient(to top, rgba(24,24,24,0.75) 0%, rgba(24,24,24,0.2) 60%, transparent 100%)",
                }}
                aria-hidden="true"
              />

              {/* Bottom Typography & Discover Pill */}
              <div className="absolute inset-x-0 bottom-0 z-20 pb-6 sm:pb-7 px-5 sm:px-6 text-center flex flex-col items-center justify-end pointer-events-none">
                <span className="text-[10px] sm:text-[10.5px] font-sans font-medium uppercase tracking-[0.26em] text-white/70 block mb-1">
                  COLLECTION
                </span>
                <h3
                  className="text-xl sm:text-2xl md:text-[1.75rem] font-normal text-white tracking-[0.08em] leading-tight mb-2.5 whitespace-nowrap transition-transform duration-300 ease-out"
                  style={{
                    fontFamily: "'Orborn', sans-serif",
                  }}
                >
                  {category.name}
                </h3>

                {/* Discover Pill */}
                <div className="pablo-discover-pill flex items-center gap-2 bg-[#EAE8E1] text-[#111111] px-4 py-1.5 rounded-full text-[9.5px] uppercase tracking-[0.22em] font-medium shadow-md">
                  <span>DISCOVER</span>
                  <span className="text-[10px] transition-transform duration-300">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      );
    });
  };

  return (
    <section
      id="categories"
      aria-label="PABLO Categories Showcase"
      className="relative w-full pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20 bg-[#EAE8E1] text-[#111111] overflow-x-clip select-none"
    >
      <style>{`
        @keyframes pabloTrainScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .pablo-train-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: pabloTrainScroll ${dimensions.durationSec}s linear infinite;
        }
        .pablo-train-container:hover .pablo-train-track,
        .pablo-train-container.is-touch-paused .pablo-train-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .pablo-train-track {
            animation: none;
          }
        }

        /* ─── PABLO RUMMY CARDS HOVER & HIGHLIGHT INTERACTION ─── */
        .pablo-card-wrapper {
          position: relative;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          user-select: none;
        }
        .pablo-card-wrapper:hover,
        .pablo-card-wrapper.is-hovered {
          z-index: 90 !important;
        }

        .pablo-card-inner {
          position: relative;
          will-change: transform, box-shadow;
          transform: translate3d(0, var(--card-offset-y), 0) rotate(var(--card-rot)) scale(1);
          box-shadow: 0 16px 38px rgba(0, 0, 0, 0.22);
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pablo-card-wrapper:hover .pablo-card-inner,
        .pablo-card-wrapper.is-hovered .pablo-card-inner {
          transform: translate3d(0, calc(var(--card-offset-y) - 12px), 0) rotate(var(--card-rot)) scale(1.03);
          box-shadow: 0 0 0 1px #EAE8E1, 0 26px 60px rgba(0, 0, 0, 0.45), 0 8px 24px rgba(234, 232, 225, 0.18);
        }

        .pablo-card-link {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #181818;
          border: 1px solid rgba(217, 216, 211, 0.25);
          user-select: none;
          cursor: pointer;
          transition: border-color 280ms ease, background-color 280ms ease;
        }
        .pablo-card-wrapper:hover .pablo-card-link,
        .pablo-card-wrapper.is-hovered .pablo-card-link {
          border-color: #EAE8E1 !important;
          background-color: #201F1C;
        }

        .pablo-card-image {
          object-fit: cover;
          object-position: center;
          width: 100%;
          height: 100%;
          user-select: none;
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
                      filter 300ms ease;
        }
        .pablo-card-wrapper:hover .pablo-card-image,
        .pablo-card-wrapper.is-hovered .pablo-card-image {
          transform: scale(1.025);
          filter: brightness(1.07) contrast(1.03);
        }

        .pablo-card-veil {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 12;
          opacity: 0;
          background: linear-gradient(180deg, rgba(234, 232, 225, 0.20) 0%, rgba(234, 232, 225, 0.08) 45%, rgba(24, 24, 24, 0.25) 100%);
          transition: opacity 280ms ease-out;
        }
        .pablo-card-wrapper:hover .pablo-card-veil,
        .pablo-card-wrapper.is-hovered .pablo-card-veil {
          opacity: 1;
        }

        .pablo-card-watermark {
          transition: color 280ms ease, letter-spacing 280ms ease;
        }
        .pablo-card-wrapper:hover .pablo-card-watermark,
        .pablo-card-wrapper.is-hovered .pablo-card-watermark {
          color: #EAE8E1;
          letter-spacing: 0.26em;
        }

        .pablo-discover-pill {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 280ms ease, transform 280ms cubic-bezier(0.22, 1, 0.36, 1), background-color 280ms ease;
        }
        .pablo-card-wrapper:hover .pablo-discover-pill,
        .pablo-card-wrapper.is-hovered .pablo-discover-pill {
          opacity: 1;
          transform: translateY(0);
          background-color: #FFFFFF;
        }
        @media (hover: none) {
          .pablo-discover-pill {
            opacity: 0.95;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* ─── 1. ELEGANT SECTION HEADER ─── */}
      <div className="text-center shrink-0 px-4 mb-6 sm:mb-8 pointer-events-none">
        <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#666666] font-medium mb-1.5">
          Maison Portfolio · 2026
        </span>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.22em] text-[#111111] inline-block leading-tight"
          style={{ fontFamily: "'Orborn', sans-serif" }}
        >
          CATEGORIES
        </h2>
        <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-2.5 opacity-40" />
      </div>

      {/* ─── 2. CONTINUOUS TRAIN-STYLE RUMMY CARD TRACK ─── */}
      <div
        onTouchStart={() => {
          if (touchPauseTimerRef.current) clearTimeout(touchPauseTimerRef.current);
          setIsTouchPaused(true);
        }}
        onTouchEnd={() => {
          touchPauseTimerRef.current = setTimeout(() => {
            setIsTouchPaused(false);
          }, 1500);
        }}
        className={`pablo-train-container relative w-full overflow-visible flex items-center py-4 cursor-default ${
          isTouchPaused ? "is-touch-paused" : ""
        }`}
        style={{
          height: `${dimensions.containerHeight}px`,
        }}
      >
        {/* Left Edge Luxury Vignette Fade */}
        <div
          className="absolute left-0 inset-y-0 w-16 sm:w-24 md:w-36 bg-gradient-to-r from-[#EAE8E1] to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* Right Edge Luxury Vignette Fade */}
        <div
          className="absolute right-0 inset-y-0 w-16 sm:w-24 md:w-36 bg-gradient-to-l from-[#EAE8E1] to-transparent pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* Continuous Train Track (Sequence 1 + Sequence 2 for seamless infinite loop) */}
        <div className="pablo-train-track flex items-center pt-6 sm:pt-8">
          {/* Sequence 1: Accessible primary items */}
          <div className="flex items-center">
            {renderCardSequence(false)}
          </div>

          {/* Sequence 2: Duplicate clone for seamless infinite loop */}
          <div className="flex items-center" aria-hidden="true">
            {renderCardSequence(true)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
