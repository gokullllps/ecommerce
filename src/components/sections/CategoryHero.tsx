"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

export interface CategoryHeroProps {
  gender?: "men" | "women";
}

export default function CategoryHero({ gender = "women" }: CategoryHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasSettled, setHasSettled] = useState(false);

  // Match homepage hero cinematic entrance reveal timing (scale(1.06) -> scale(1.0))
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPrefersReducedMotion(true);
      setIsRevealed(true);
      setHasSettled(true);
      return;
    }

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

  return (
    <section
      ref={containerRef}
      id="women-hero"
      aria-label="PABLO Women Luxury Beach Editorial Campaign"
      className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden select-none bg-[#0E1A24] text-[#FFFFFF]"
      style={{
        backgroundColor: "#0E1A24",
        minHeight: "100svh",
        height: "100svh",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════
          CINEMATIC ENTRANCE ANIMATION (IDENTICAL TO HOMEPAGE HERO)
          Smooth scale(1.06) -> scale(1.0) settle with opacity fade
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        style={{
          transform: prefersReducedMotion
            ? "none"
            : isRevealed
            ? "scale(1.0) translate3d(0, 0, 0)"
            : "scale(1.06) translate3d(0, 0, 0)",
          opacity: prefersReducedMotion ? 1 : isRevealed ? 1 : 0.3,
          transition: prefersReducedMotion || hasSettled
            ? "none"
            : isRevealed
            ? "transform 1600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
          willChange: prefersReducedMotion ? "auto" : "transform, opacity",
        }}
        aria-hidden="true"
      >
        {/*
          FULL-BLEED EDGE-TO-EDGE PHOTOGRAPHIC HERO:
          Maintains full 1024x575 original asset resolution via unoptimized WebP,
          ensuring sharp ocean waves, fine hair strands, and natural beach lighting.
        */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
          <Image
            src="/images/sasi-women.webp"
            alt="PABLO Women Luxury Beach Editorial Campaign"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[44%_center] sm:object-[45%_center] md:object-center w-full h-full select-none pointer-events-none"
          />
        </div>

        {/* Subtle Top Vignette: Seamless contrast for the transparent sticky navbar */}
        <div
          className="absolute inset-x-0 top-0 h-28 sm:h-32 md:h-36 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(14,26,36,0.48) 0%, rgba(14,26,36,0.15) 55%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
