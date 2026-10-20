"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
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
    tagColor: string;
    highlightColor: string;
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
      tagColor: "#C084FC",
      highlightColor: "#C084FC",
      dotColor: "#C084FC",
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
      tagColor: "#F59E0B",
      highlightColor: "#EF4444",
      dotColor: "#F59E0B",
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
      tagColor: "#F87171",
      highlightColor: "#38BDF8",
      dotColor: "#38BDF8",
    },
  },
];

export function NewInSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
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

  // Autoplay: 6.5s interval, pauses ONLY when pointer is over carousel content
  useEffect(() => {
    if (isHovered || isReducedMotion) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(interval);
  }, [isHovered, isReducedMotion, handleNext]);

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
      {/* ─── 1. SECTION TITLE ─── */}
      <Reveal direction="up" distance={20} duration={750}>
        <div className="page-container text-center mb-6 sm:mb-8 pointer-events-none">
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#666666] font-medium mb-1.5">
            Maison Capsule · 2026
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.22em] text-[#111111] inline-block leading-tight"
            style={{ fontFamily: "'Orborn', sans-serif" }}
          >
            NEW IN
          </h2>
          <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-2.5 opacity-40" />
        </div>
      </Reveal>

      {/* ─── 2. CINEMATIC EDITORIAL CAROUSEL (Clean #050505, Zero Neon Glow) ─── */}
      <div className="w-full relative">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Marvel Character Edition Campaigns"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full bg-[#050505] overflow-hidden h-[440px] sm:h-[400px] md:h-[420px] lg:h-[440px] focus:outline-none border-y border-[#141414]"
          style={{ backgroundColor: "#050505" }}
        >
          {/* Slides Track */}
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
                  {/* ─── DESKTOP SLIDE LAYOUT (>= md) ─── */}
                  <div className="hidden md:flex w-full h-full relative items-center justify-between px-10 lg:px-20 max-w-7xl mx-auto">
                    {/* LEFT: MODEL WEARING MARVEL LUXURY TEE (Preserved Exactly, Zero Glow) */}
                    <div className="w-1/2 h-full flex items-end justify-center relative overflow-hidden pointer-events-none z-10">
                      <div
                        className={`relative w-full h-full flex items-end justify-center transition-all duration-700 ease-out ${
                          isActive ? "scale-100 opacity-100" : "scale-[0.98] opacity-70"
                        }`}
                      >
                        <Image
                          src={slide.imageSrc}
                          alt={slide.imageAlt}
                          width={600}
                          height={600}
                          priority={index === 0}
                          unoptimized
                          className="object-contain object-bottom w-auto h-full max-h-[385px] lg:max-h-[415px] select-none"
                        />
                      </div>
                    </div>

                    {/* RIGHT: EDITORIAL CONTENT (Luxury Fashion Editorial, Clean Contrast) */}
                    <div className="w-1/2 h-full flex flex-col justify-center pl-8 lg:pl-16 z-10">
                      <div
                        className={`max-w-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "translate-y-3 opacity-0 pointer-events-none"
                        }`}
                      >
                        {/* Eyebrow */}
                        <p
                          className="text-xs lg:text-[13px] font-medium uppercase tracking-[0.26em] transition-colors duration-500 mb-2 sm:mb-2.5"
                          style={{ color: slide.theme.eyebrowColor }}
                        >
                          {slide.eyebrow}
                        </p>

                        {/* Title */}
                        <h3
                          className="font-serif text-4xl lg:text-5xl xl:text-[54px] font-normal tracking-[0.12em] uppercase text-white leading-tight"
                        >
                          {slide.title}
                        </h3>

                        {/* Tag */}
                        <p
                          className="text-xs lg:text-sm font-medium uppercase tracking-[0.24em] mt-1.5 transition-colors duration-500"
                          style={{ color: slide.theme.tagColor }}
                        >
                          {slide.tag}
                        </p>

                        {/* Minimal Divider */}
                        <div className="w-10 h-[1px] bg-white/15 my-4 sm:my-5" aria-hidden="true" />

                        {/* Subtitle & Action */}
                        <div className="space-y-1">
                          <p className="text-xs lg:text-sm font-light uppercase tracking-[0.24em] text-[#CCCCCC]">
                            {slide.subtitle}
                          </p>
                          <p className="text-xs lg:text-sm font-normal uppercase tracking-[0.24em] text-white">
                            {slide.actionPrefix}{" "}
                            <span
                              className="font-semibold transition-colors duration-500"
                              style={{ color: slide.theme.highlightColor }}
                            >
                              {slide.actionHighlight}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Edition Tag Bottom Left */}
                    <div className="absolute bottom-4 left-10 lg:left-20 z-20 pointer-events-none">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#777777] font-mono">
                        {slide.editionTag}
                      </span>
                    </div>
                  </div>

                  {/* ─── DEDICATED MOBILE SLIDE LAYOUT (< md) ─── */}
                  <div className="flex md:hidden flex-col items-center justify-between w-full h-full p-5 relative z-10 select-none">
                    {/* Model Feature (Clean, Zero Glow) */}
                    <div className="relative w-full h-[190px] flex items-center justify-center overflow-hidden">
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
                          className="h-full w-auto object-contain object-bottom"
                        />
                      </div>
                    </div>

                    {/* Title & Editorial Details */}
                    <div className="w-full text-center flex flex-col items-center px-4">
                      <span
                        className="text-[10px] font-medium uppercase tracking-[0.24em]"
                        style={{ color: slide.theme.eyebrowColor }}
                      >
                        {slide.eyebrow}
                      </span>
                      <h3
                        className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.14em] uppercase text-white mt-1 leading-tight"
                      >
                        {slide.title}
                      </h3>
                      <span
                        className="text-xs font-medium uppercase tracking-[0.22em] mt-0.5"
                        style={{ color: slide.theme.tagColor }}
                      >
                        {slide.tag}
                      </span>

                      {/* Action Pill Without Glow */}
                      <div className="mt-3.5">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-white text-[10px] font-medium tracking-[0.2em] uppercase">
                          <span className="text-[#BBBBBB]">{slide.subtitle}</span>
                          <span style={{ color: slide.theme.highlightColor }}>{slide.actionHighlight}</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Edition Tag & Swipe Hint */}
                    <div className="w-full flex justify-between items-center text-[9px] uppercase tracking-[0.18em] text-[#777777] pt-1 px-1">
                      <span>{slide.editionTag}</span>
                      <span className="text-[#555555]">SWIPE TO EXPLORE</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── 3. PREVIOUS CHEVRON ─── */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Campaign"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* ─── 4. NEXT CHEVRON ─── */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Campaign"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* ─── 5. SLIDE INDICATORS (Clean Minimalist Lines, Zero Glow) ─── */}
          <div className="absolute bottom-3 right-6 sm:bottom-4 sm:right-10 md:right-12 z-30 flex items-center gap-2">
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
                    className={`block h-1 rounded-full transition-all duration-300 ease-out ${
                      isActive
                        ? "w-7 opacity-100"
                        : "w-2 bg-white/25 group-hover:bg-white/50 opacity-60"
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: slide.theme.dotColor,
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
