"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function KidsHero() {
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
      id="kids-hero"
      aria-label="PABLO Kids Luxury Editorial Showcase"
      className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden select-none bg-[#E4C7A8] text-[#111111]"
      style={{
        backgroundColor: "#E4C7A8",
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
          Maintains full 1024x576 original asset resolution via unoptimized WebP,
          preserving natural sunlight, fine details, and warm editorial composition.
        */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
          <Image
            src="/images/pablo-kids-hero.webp"
            alt="PABLO Kids Luxury Editorial Showcase"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[55%_center] sm:object-[54%_center] md:object-center w-full h-full select-none pointer-events-none"
          />
        </div>

        {/* Subtle Top Vignette: Seamless contrast for the transparent sticky navbar */}
        <div
          className="absolute inset-x-0 top-0 h-28 sm:h-32 md:h-36 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(24,24,24,0.42) 0%, rgba(24,24,24,0.12) 55%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
