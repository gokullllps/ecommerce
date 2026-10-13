"use client";

import Image from "next/image";
import React, { useState, useCallback, useRef, useSyncExternalStore } from "react";
import { Reveal } from "@/components/animation/Reveal";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface CampaignSlide {
  id: string;
  character: string;
  eyebrow: string;
  title: string;
  tag: string;
  subtitle: string;
  actionPrefix: string;
  actionHighlight: string;
  editionTag: string;
  imageSrc: string;
  imageAlt: string;
  theme: {
    eyebrowColor: string;
    textShadowEyebrow: string;
    textShadowTitle: string;
    tagColor: string;
    textShadowTag: string;
    highlightColor: string;
    textShadowHighlight: string;
    radialGlow: string;
    dotColor: string;
  };
}

const CAMPAIGN_SLIDES: CampaignSlide[] = [
  {
    id: "campaign-wakanda",
    character: "Black Panther",
    eyebrow: "A TRIBUTE TO THE",
    title: "WAKANDA",
    tag: "LEGEND",
    subtitle: "MEMBER EARLY",
    actionPrefix: "ACCESS",
    actionHighlight: "NOW LIVE",
    editionTag: "© 2026 MARVEL · PABLO ATELIER",
    imageSrc: "/images/marvel-wakanda.webp",
    imageAlt: "PABLO Wakanda Vibranium Claw Luxury Tee Edition",
    theme: {
      eyebrowColor: "#D8B4FE",
      textShadowEyebrow: "0 0 10px rgba(192, 132, 252, 0.7), 0 0 20px rgba(168, 85, 247, 0.4)",
      textShadowTitle:
        "0 0 24px rgba(168, 85, 247, 0.85), 0 0 50px rgba(147, 51, 234, 0.5), 0 0 12px rgba(233, 213, 255, 0.95)",
      tagColor: "#C084FC",
      textShadowTag: "0 0 14px rgba(192, 132, 252, 0.85), 0 0 28px rgba(168, 85, 247, 0.5)",
      highlightColor: "#C084FC",
      textShadowHighlight: "0 0 12px rgba(192, 132, 252, 0.95), 0 0 24px rgba(168, 85, 247, 0.65)",
      radialGlow:
        "radial-gradient(ellipse at 40% 50%, rgba(168, 85, 247, 0.28) 0%, rgba(126, 34, 206, 0.1) 48%, transparent 72%)",
      dotColor: "#A855F7",
    },
  },
  {
    id: "campaign-ironman",
    character: "Iron Man",
    eyebrow: "THE ARMOR OF INNOVATION",
    title: "INVINCIBLE",
    tag: "STARK ATELIER",
    subtitle: "ARC REACTOR CORE",
    actionPrefix: "MEMBER ACCESS",
    actionHighlight: "NOW LIVE",
    editionTag: "© 2026 MARVEL · PABLO ATELIER",
    imageSrc: "/images/marvel-ironman.webp",
    imageAlt: "PABLO Stark Arc Reactor Luxury Tee Edition",
    theme: {
      eyebrowColor: "#FDE68A",
      textShadowEyebrow: "0 0 10px rgba(251, 191, 36, 0.7), 0 0 20px rgba(245, 158, 11, 0.4)",
      textShadowTitle:
        "0 0 24px rgba(239, 68, 68, 0.85), 0 0 50px rgba(220, 38, 38, 0.5), 0 0 12px rgba(254, 202, 202, 0.95)",
      tagColor: "#F59E0B",
      textShadowTag: "0 0 14px rgba(245, 158, 11, 0.85), 0 0 28px rgba(239, 68, 68, 0.5)",
      highlightColor: "#EF4444",
      textShadowHighlight: "0 0 12px rgba(239, 68, 68, 0.95), 0 0 24px rgba(245, 158, 11, 0.65)",
      radialGlow:
        "radial-gradient(ellipse at 40% 50%, rgba(239, 68, 68, 0.26) 0%, rgba(245, 158, 11, 0.12) 48%, transparent 72%)",
      dotColor: "#EF4444",
    },
  },
  {
    id: "campaign-spiderman",
    character: "Spider-Man",
    eyebrow: "ARACHNID PERSPECTIVES",
    title: "SPIDER-MAN",
    tag: "QUEENS ATELIER",
    subtitle: "LIMITED DROP",
    actionPrefix: "EARLY ACCESS",
    actionHighlight: "NOW LIVE",
    editionTag: "© 2026 MARVEL · PABLO ATELIER",
    imageSrc: "/images/marvel-spiderman.webp",
    imageAlt: "PABLO Spider Emblem Web-Slinger Luxury Tee Edition",
    theme: {
      eyebrowColor: "#BAE6FD",
      textShadowEyebrow: "0 0 10px rgba(56, 189, 248, 0.7), 0 0 20px rgba(14, 165, 233, 0.4)",
      textShadowTitle:
        "0 0 24px rgba(56, 189, 248, 0.85), 0 0 50px rgba(2, 132, 199, 0.5), 0 0 12px rgba(224, 242, 254, 0.95)",
      tagColor: "#F87171",
      textShadowTag: "0 0 14px rgba(248, 113, 113, 0.85), 0 0 28px rgba(239, 68, 68, 0.5)",
      highlightColor: "#38BDF8",
      textShadowHighlight: "0 0 12px rgba(56, 189, 248, 0.95), 0 0 24px rgba(14, 165, 233, 0.65)",
      radialGlow:
        "radial-gradient(ellipse at 40% 50%, rgba(56, 189, 248, 0.26) 0%, rgba(239, 68, 68, 0.1) 48%, transparent 72%)",
      dotColor: "#38BDF8",
    },
  },
];

export function NewInSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? CAMPAIGN_SLIDES.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === CAMPAIGN_SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  const handleSelectSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="new-in"
      aria-label="PABLO New In Section"
      className="w-full bg-[#EAE8E1] text-[#111111] pt-8 pb-10 sm:pt-12 sm:pb-14 select-none scroll-mt-14 sm:scroll-mt-16"
      style={{ backgroundColor: "#EAE8E1", color: "#111111" }}
    >
      {/* ─── 1. SECTION TITLE (Exact Reference Alignment & Spacing) ─── */}
      <Reveal direction="up" distance={20} duration={750}>
        <div className="page-container text-center mb-5 sm:mb-7">
          <h2
            className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-[0.24em] text-[#111111] inline-block"
            style={{ fontFamily: "var(--font-body, 'Inter', sans-serif)" }}
          >
            NEW IN
          </h2>
        </div>
      </Reveal>

      {/* ─── 2. FEATURED CAROUSEL (Letterbox Height, Full-Bleed Corners, Theme Neon Aura) ─── */}
      <div className="w-full relative">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Marvel Character Edition Campaigns"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full bg-[#050505] overflow-hidden h-[380px] md:h-[350px] lg:h-[370px] focus:outline-none"
          style={{ backgroundColor: "#050505" }}
        >
          {/* Slides Track with Ultra-Smooth Hardware Accelerated Motion */}
          <div
            className="flex h-full w-full"
            style={{
              transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
              transition: isReducedMotion
                ? "none"
                : "transform 750ms cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "transform",
            }}
          >
            {CAMPAIGN_SLIDES.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${CAMPAIGN_SLIDES.length}: ${slide.character} Edition`}
                  className="relative w-full h-full shrink-0 flex-none bg-[#050505] overflow-hidden flex items-center"
                  style={{ backgroundColor: "#050505" }}
                >
                  {/* ─── DESKTOP SLIDE LAYOUT (>= md) — 100% UNTOUCHED ─── */}
                  <div className="hidden md:flex w-full h-full relative items-center">
                    {/* LEFT: MODEL WEARING MARVEL LUXURY TEE */}
                    <div className="absolute left-0 top-0 bottom-0 w-[40%] flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                      <div
                        className="absolute inset-0 pointer-events-none opacity-90 transition-opacity duration-700"
                        style={{ background: slide.theme.radialGlow }}
                        aria-hidden="true"
                      />
                      <div
                        className={`relative w-full h-full flex items-end justify-center transition-all duration-700 ease-out ${
                          isActive ? "scale-100 opacity-100" : "scale-[0.97] opacity-80"
                        }`}
                      >
                        <Image
                          src={slide.imageSrc}
                          alt={slide.imageAlt}
                          width={600}
                          height={600}
                          priority={index === 0}
                          unoptimized
                          className="object-contain object-bottom w-auto h-full max-h-[365px] select-none filter contrast-105"
                        />
                      </div>
                    </div>

                    {/* RIGHT: EDITORIAL TYPOGRAPHY */}
                    <div className="relative z-10 w-full flex justify-end items-center pr-16 lg:pr-36 pl-[40%]">
                      <div
                        className={`w-full max-w-xl text-center flex flex-col items-center select-none transition-all duration-700 ease-out ${
                          isActive ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
                        }`}
                      >
                        <p
                          className="text-xs md:text-sm font-semibold uppercase tracking-[0.28em] transition-colors duration-500"
                          style={{
                            color: slide.theme.eyebrowColor,
                            textShadow: slide.theme.textShadowEyebrow,
                          }}
                        >
                          {slide.eyebrow}
                        </p>

                        <h3
                          className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-[0.16em] uppercase text-white leading-tight mt-1 sm:mt-1.5"
                          style={{
                            fontFamily: "var(--font-body, 'Inter', sans-serif)",
                            textShadow: slide.theme.textShadowTitle,
                          }}
                        >
                          {slide.title}
                        </h3>

                        <p
                          className="text-sm md:text-base font-extrabold uppercase tracking-[0.24em] mt-0.5 sm:mt-1 transition-colors duration-500"
                          style={{
                            color: slide.theme.tagColor,
                            textShadow: slide.theme.textShadowTag,
                          }}
                        >
                          {slide.tag}
                        </p>

                        <div className="h-3.5 md:h-4" aria-hidden="true" />

                        <p className="text-xs md:text-sm font-bold uppercase tracking-[0.26em] text-white">
                          {slide.subtitle}
                        </p>

                        <p className="text-xs md:text-sm font-bold uppercase tracking-[0.26em] text-white mt-0.5">
                          {slide.actionPrefix}{" "}
                          <span
                            className="font-black transition-colors duration-500"
                            style={{
                              color: slide.theme.highlightColor,
                              textShadow: slide.theme.textShadowHighlight,
                            }}
                          >
                            {slide.actionHighlight}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="absolute bottom-3.5 left-8 z-20 pointer-events-none">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#888888] font-normal">
                        {slide.editionTag}
                      </span>
                    </div>
                  </div>

                  {/* ─── DEDICATED PURPOSE-BUILT MOBILE SLIDE LAYOUT (< md) ─── */}
                  <div className="flex md:hidden flex-col items-center justify-between w-full h-full p-4 relative z-10 select-none">
                    {/* Top: Glowing Hero Model Feature */}
                    <div className="relative w-full h-[180px] flex items-center justify-center overflow-hidden">
                      <div
                        className="absolute inset-0 pointer-events-none opacity-85"
                        style={{ background: slide.theme.radialGlow }}
                        aria-hidden="true"
                      />
                      <div
                        className={`relative h-full w-auto transition-transform duration-500 ${
                          isActive ? "scale-100 opacity-100" : "scale-95 opacity-70"
                        }`}
                      >
                        <Image
                          src={slide.imageSrc}
                          alt={slide.imageAlt}
                          width={400}
                          height={400}
                          priority={index === 0}
                          unoptimized
                          className="h-full w-auto object-contain filter contrast-105"
                        />
                      </div>
                    </div>

                    {/* Center: Compact Title & Editorial Details */}
                    <div className="w-full text-center flex flex-col items-center px-2">
                      <span
                        className="text-[9px] font-semibold uppercase tracking-[0.26em]"
                        style={{
                          color: slide.theme.eyebrowColor,
                          textShadow: slide.theme.textShadowEyebrow,
                        }}
                      >
                        {slide.eyebrow}
                      </span>
                      <h3
                        className="text-2xl font-black tracking-[0.16em] uppercase text-white mt-0.5"
                        style={{
                          fontFamily: "var(--font-body, 'Inter', sans-serif)",
                          textShadow: slide.theme.textShadowTitle,
                        }}
                      >
                        {slide.title}
                      </h3>
                      <span
                        className="text-[11px] font-extrabold uppercase tracking-[0.22em]"
                        style={{
                          color: slide.theme.tagColor,
                          textShadow: slide.theme.textShadowTag,
                        }}
                      >
                        {slide.tag}
                      </span>

                      {/* Tappable Mobile Action Pill */}
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                          <span>{slide.subtitle}</span>
                          <span style={{ color: slide.theme.highlightColor }}>{slide.actionHighlight}</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Tag */}
                    <div className="w-full flex justify-between items-center text-[8px] uppercase tracking-[0.18em] text-[#888888] pt-1">
                      <span>{slide.editionTag}</span>
                      <span className="text-[#666]">SWIPE TO EXPLORE</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── 3. LEFT NAVIGATION CHEVRON (Clean White) ─── */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Campaign"
            className="absolute left-3 sm:left-5 md:left-7 top-1/2 -translate-y-1/2 z-30 text-white opacity-85 hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200 p-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* ─── 4. RIGHT NAVIGATION CHEVRON (Clean White) ─── */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Campaign"
            className="absolute right-3 sm:right-5 md:right-7 top-1/2 -translate-y-1/2 z-30 text-white opacity-85 hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200 p-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* ─── 5. SLICK THEME PAGINATION INDICATORS (Centered At Bottom of Card) ─── */}
          <div className="absolute bottom-2.5 right-6 sm:bottom-3 sm:right-8 md:bottom-3.5 md:right-10 z-30 flex items-center gap-2">
            {CAMPAIGN_SLIDES.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={`dot-${slide.id}`}
                  type="button"
                  onClick={() => handleSelectSlide(index)}
                  aria-label={`Go to ${slide.character} Edition`}
                  aria-current={isActive ? "true" : undefined}
                  className="h-6 flex items-center justify-center p-1 group cursor-pointer focus-visible:outline-none"
                >
                  <span
                    className={`block h-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "w-7 opacity-100 shadow-[0_0_8px_currentColor]"
                        : "w-2 bg-white/35 group-hover:bg-white/60 opacity-60"
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: slide.theme.dotColor,
                            color: slide.theme.dotColor,
                          }
                        : undefined
                    }
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
