"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

export interface MenHeroProps {
  onExploreClick?: (e: React.MouseEvent) => void;
}

export default function MenHero({ onExploreClick }: MenHeroProps = {}) {
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
      id="men-hero"
      aria-label="PABLO Men Autumn / Winter 2026 Campaign"
      className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden select-none bg-[#11100E] text-[#FFFFFF]"
      style={{
        backgroundColor: "#11100E",
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
          IMAGE SIZING & VERTICAL POSITIONING CONTAINER:
          Engineered with calibrated vertical bleed to prevent side and top/bottom gaps
          while positioning the model's head comfortably below the centered PABLO logo,
          preserving the chair, gun, shoes, and shadows with zero cropping.
        */}
        <div
          className="absolute inset-x-0 w-full -top-14 sm:-top-12 md:-top-12 h-[calc(100%+7rem)] sm:h-[calc(100%+6rem)] md:h-[calc(100%+6rem)] pointer-events-none z-0 overflow-hidden select-none translate-y-20 sm:translate-y-12 md:translate-y-10"
        >
          <Image
            src="/images/pablo-men-hero.webp"
            alt="PABLO Men Autumn / Winter 2026 Campaign"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[46%_center] sm:object-[45%_center] md:object-center w-full h-full select-none pointer-events-none"
          />
        </div>

        {/* Subtle Top Vignette: Seamless contrast for the transparent sticky navbar */}
        <div
          className="absolute inset-x-0 top-0 h-28 sm:h-32 md:h-36 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(17,16,14,0.45) 0%, rgba(17,16,14,0.15) 60%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
