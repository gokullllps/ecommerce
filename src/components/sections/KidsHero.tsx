"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  DoodleCloud,
  DoodleStar,
  DoodleSneakerMotion,
  DoodleSun,
  StickerBadge,
  DoodleArrow,
  DoodleHeart,
} from "@/components/kids/KidsDoodles";
import { HiddenStar } from "@/components/kids/games/HiddenStar";

export default function KidsHero() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPrefersReducedMotion(true);
      setPhase(3);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 60);
    const t2 = setTimeout(() => setPhase(2), 220);
    const t3 = setTimeout(() => setPhase(3), 420);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
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
      id="kids-hero"
      aria-label="PABLO Kids Cartoon Fashion Universe"
      className="relative w-full bg-transparent select-none flex flex-col md:justify-between overflow-hidden -mt-14 sm:-mt-16 pt-14 sm:pt-16 md:h-auto md:min-h-screen"
      style={{
        backgroundColor: "transparent",
      }}
    >

      {/* â”€â”€â”€ 1. CARTOON SKY BACKGROUND & DECORATIVE HORIZON (DESKTOP ONLY) â”€â”€â”€ */}
      <div className="hidden md:block absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Playful pastel sky glow circle merging with navbar */}
        <div
          className="absolute -top-24 -left-24 sm:-top-32 sm:-left-32 w-[550px] sm:w-[600px] h-[550px] sm:h-[600px] rounded-full bg-[#FEF08A]/35 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 -right-28 w-[550px] h-[550px] rounded-full bg-[#FCE7F3]/40 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[350px] rounded-full bg-[#DCFCE7]/35 blur-2xl"
          aria-hidden="true"
        />

        {/* Playful Smiling Sun in the top corner (safely below navbar) */}
        <div
          className="absolute top-16 sm:top-24 lg:top-28 right-4 sm:right-12 lg:right-16 z-0 animate-kids-pulse pointer-events-none"
          style={{
            opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
            transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out",
          }}
        >
          <DoodleSun className="w-14 h-14 sm:w-20 sm:h-20 pointer-events-none" color="#FEF08A" />
        </div>

        {/* Drifting Cloud with Hidden Star (peeks on hover) */}
        <div
          className="group absolute top-16 sm:top-24 lg:top-28 left-4 sm:left-12 animate-kids-drift"
          style={{
            opacity: phase >= 1 || prefersReducedMotion ? 0.9 : 0,
            transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out",
          }}
        >
          <div className="relative">
            <DoodleCloud
              className="w-24 sm:w-36 h-auto transition-transform group-hover:scale-105 relative z-10 pointer-events-none"
              color="#FFFFFF"
              borderColor="#181818"
              borderWidth={2.5}
            />
            {/* Zone A: Partially tucked ~30% behind the curved cloud outline */}
            <HiddenStar
              slotId="slot-a-cloud-left-tuck"
              className="-top-1 -right-1 z-30"
              rotate="12deg"
            />
          </div>
        </div>

        <div
          className="absolute top-36 sm:top-40 right-[20%] sm:right-[32%] block animate-kids-float-slow"
          style={{
            opacity: phase >= 2 || prefersReducedMotion ? 0.85 : 0,
            transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out",
          }}
        >
          <div className="relative">
            <DoodleCloud
              className="w-24 sm:w-32 h-auto relative z-10 pointer-events-none"
              color="#F0FDF4"
              borderColor="#181818"
              borderWidth={2}
            />
            {/* Zone A: Tucked along the lower rim of the right cloud */}
            <HiddenStar
              slotId="slot-a-cloud-right-rim"
              className="bottom-0 -left-1 z-30"
              rotate="-15deg"
            />
          </div>
        </div>

        {/* Twinkling Cartoon Stars (safely below navbar) */}
        <div className="absolute top-32 sm:top-36 left-[40%] animate-kids-twinkle pointer-events-none">
          <DoodleStar className="w-7 h-7 pointer-events-none" color="#FEF08A" strokeColor="#181818" />
        </div>
        <div className="absolute top-20 sm:top-28 lg:top-32 right-[46%] animate-kids-twinkle pointer-events-none" style={{ animationDelay: "1.2s" }}>
          <div className="relative pointer-events-auto">
            <DoodleStar className="w-5 h-5 pointer-events-none" color="#F472B6" strokeColor="#181818" />
            {/* Zone A: Beside the upper decorative star cluster */}
            <HiddenStar slotId="slot-a-sky-star-cluster" className="-top-2 -right-4 z-30" rotate="22deg" />
          </div>
        </div>
        <div className="absolute bottom-24 left-10 animate-kids-twinkle" style={{ animationDelay: "0.8s" }}>
          <DoodleStar className="w-8 h-8" color="#38BDF8" strokeColor="#181818" />
        </div>
        <div className="absolute bottom-36 right-12 animate-kids-twinkle" style={{ animationDelay: "1.8s" }}>
          <DoodleHeart className="w-7 h-7" color="#F472B6" strokeColor="#181818" />
        </div>
      </div>

      {/* ─── 2. DEDICATED PURPOSE-BUILT MOBILE KIDS HERO COMPOSITION (< md) ─── */}
      <div className="flex md:hidden relative flex-col z-20 px-4 pt-3 pb-5 w-full select-none overflow-hidden">
        {/* Soft pastel ambient sky glow for mobile */}
        <div
          className="absolute -top-16 -left-16 w-[340px] h-[340px] rounded-full bg-[#FEF08A]/35 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 -right-20 w-[300px] h-[300px] rounded-full bg-[#DCFCE7]/25 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* ── Row 1: Top Badges Row [PABLO KIDS] [100% PLAY-READY] + SUN ── */}
        <div className="w-full flex items-center justify-between z-20 shrink-0">
          <div
            className="flex items-center gap-2"
            style={{
              opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
              transform: phase >= 1 || prefersReducedMotion ? "translateY(0)" : "translateY(-6px)",
              transition: prefersReducedMotion ? "none" : "opacity 400ms ease-out, transform 400ms ease-out",
            }}
          >
            <div className="relative inline-flex items-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FEF08A] text-[#181818] border-2 border-[#181818] text-[10px] font-sans font-bold tracking-wider uppercase shadow-[1.5px_1.5px_0px_#181818]">
                <svg className="w-2.5 h-2.5 fill-[#181818]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l2.4 7.6 7.6 2.4-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/>
                </svg>
                <span>PABLO KIDS</span>
              </span>
              <HiddenStar
                slotId="slot-b-badge-under"
                className="-bottom-1 -right-1 z-30 pointer-events-auto"
                rotate="8deg"
              />
            </div>
            <div className="relative inline-block">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#181818] border-2 border-[#181818] text-[10px] font-sans font-bold tracking-wider uppercase shadow-[1.5px_1.5px_0px_#181818]">
                <svg className="w-2.5 h-2.5 fill-[#181818]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <span>PLAY-READY</span>
              </span>
              <HiddenStar
                slotId="slot-b-badge-play-ready"
                className="-top-1 -right-1 z-30 pointer-events-auto"
                rotate="-12deg"
              />
            </div>
          </div>

          {/* Smiling Sun */}
          <div
            className="relative shrink-0 animate-kids-pulse pointer-events-none"
            style={{
              opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
              transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out",
            }}
          >
            <div className="relative pointer-events-auto">
              <DoodleSun className="w-11 h-11 pointer-events-none" color="#FEF08A" />
              <HiddenStar
                slotId="slot-a-sky-star-cluster"
                className="-top-1 -left-2 z-30 pointer-events-auto"
                rotate="18deg"
              />
            </div>
          </div>
        </div>

        {/* ── Row 2: Headline (left) + Model (right) — tight grid ── */}
        <div className="relative w-full grid grid-cols-[1fr_auto] gap-0 items-stretch mt-2.5">

          {/* LEFT: Playful headline + Cloud Soft badge + supporting text */}
          <div
            className="flex flex-col justify-between py-1 z-20"
            style={{
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transform: phase >= 2 || prefersReducedMotion ? "translateY(0)" : "translateY(6px)",
              transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
            }}
          >
            {/* Top: Headline */}
            <div>
              <h1
                className="font-black tracking-tight leading-[0.90] select-none text-[40px] sm:text-[46px]"
                style={{ fontFamily: "var(--font-sans, 'Inter', sans-serif)" }}
              >
                <span className="block text-[#181818]">PLAY.</span>
                <span className="block text-[#EA580C]">MOVE.</span>
                <span className="block text-[#16A34A] relative inline-block">
                  EXPLORE.
                  <HiddenStar
                    slotId="slot-b-headline-period"
                    className="-top-1 -right-4 z-30 pointer-events-auto"
                    rotate="-10deg"
                  />
                </span>
              </h1>

              {/* Cloud Soft badge below headline */}
              <div className="mt-2 animate-kids-float-slow">
                <div className="relative inline-block">
                  <StickerBadge
                    text="CLOUD SOFT"
                    icon={
                      <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                      </svg>
                    }
                    bgColor="#E0F2FE"
                    textColor="#0369A1"
                    borderColor="#181818"
                    rotate="-2deg"
                  />
                  <HiddenStar
                    slotId="slot-b-sticker-cloud-soft"
                    className="-top-1 -left-1 z-30 pointer-events-auto"
                    rotate="-8deg"
                  />
                </div>
              </div>
            </div>

            {/* Bottom: Supporting text */}
            <div>
              <p className="text-[10px] sm:text-[10.5px] text-[#334155] font-semibold leading-snug max-w-[170px] mb-1">
                Luxury silhouettes from cloud-soft natural fibers for wild curiosity.
              </p>
              <DoodleArrow className="w-8 h-auto text-[#181818] opacity-60" />
            </div>
          </div>

          {/* RIGHT: Model â€” fills full column height, anchored bottom */}
          <div
            className="relative flex items-end justify-end pointer-events-none z-10"
            style={{
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transform: prefersReducedMotion
                ? "none"
                : phase >= 2
                ? "translate3d(0, 0, 0) scale(1)"
                : "translate3d(20px, 0, 0) scale(1.02)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 850ms cubic-bezier(0.16, 1, 0.3, 1), transform 850ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Decorative clouds flanking model â€” constrained, not clipping */}
            <div className="absolute top-1/4 -left-10 z-0 animate-kids-float pointer-events-none">
              <div className="relative pointer-events-auto">
                <DoodleCloud className="w-14 h-auto opacity-80" color="#FFFFFF" borderColor="#181818" borderWidth={1.8} />
                <HiddenStar slotId="slot-a-cloud-left-tuck" className="-top-1 -right-1 z-30 pointer-events-auto" rotate="12deg" />
              </div>
            </div>

            {/* Ground shadow */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-2.5 rounded-[100%] bg-[#181818]/15 z-0"
              aria-hidden="true"
            />

            {/* Sneaker motion lines */}
            <div className="absolute bottom-2 -left-4 z-20 pointer-events-none">
              <DoodleSneakerMotion className="w-10 h-auto" color="#FB923C" />
            </div>

            {/* Model â€” full height */}
            <Image
              src="/images/pablo-kids-hero.webp"
              alt="PABLO Kids Fashion Model"
              width={457}
              height={1168}
              priority
              unoptimized
              className="object-contain object-bottom w-auto h-[300px] sm:h-[340px] select-none pointer-events-none drop-shadow-md z-10 -mr-2"
            />
          </div>
        </div>

        {/* â”€â”€ Row 3: CTA â”€â”€ */}
        <div
          className="relative w-full flex justify-center mt-3 shrink-0"
          style={{
            opacity: phase >= 3 || prefersReducedMotion ? 1 : 0,
            transform: phase >= 3 || prefersReducedMotion ? "translateY(0)" : "translateY(6px)",
            transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
          }}
        >
          <a
            href="#kids-category-section"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("kids-category-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group w-[88%] max-w-[320px] flex items-center justify-center gap-2 py-3.5 min-h-[46px] px-6 bg-[#FEF08A] text-[#181818] active:bg-[#FDE047] border-2 border-[#181818] rounded-full text-xs font-sans tracking-[0.14em] uppercase font-black transition-all duration-200 ease-out shadow-[3px_3px_0px_#181818] active:shadow-[1px_1px_0px_#181818] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer select-none text-center"
          >
            <span>EXPLORE KIDS&apos; WORLD</span>
            <span className="text-sm font-bold transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
          <HiddenStar
            slotId="slot-b-explore-btn"
            className="-top-1 right-8 z-30 pointer-events-auto"
            rotate="15deg"
          />
        </div>
      </div>


      {/* â”€â”€â”€ 3. PRESERVED UNTOUCHED DESKTOP KIDS HERO (md:flex) â”€â”€â”€ */}
      <div className="hidden md:flex page-container relative flex-1 items-center z-10 py-8 lg:py-6">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center h-full">

          {/* â”€â”€ LEFT COLUMN: PLAYFUL OVERSIZED DISPLAY TYPOGRAPHY & STICKERS â”€â”€ */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center z-20 order-2 lg:order-1 pt-4 lg:pt-0">
            {/* Top Playful Brand Badge & Season */}
            <div
              className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
              style={{
                opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
                transform:
                  phase >= 1 || prefersReducedMotion
                    ? "translateY(0)"
                    : "translateY(-10px)",
                transition: prefersReducedMotion
                  ? "none"
                  : "opacity 500ms ease-out, transform 500ms ease-out",
              }}
            >
              <div className="group relative inline-flex items-center">
                <StickerBadge
                  text="PABLO KIDS"
                  icon={
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l2.4 7.6 7.6 2.4-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/>
                    </svg>
                  }
                  bgColor="#FEF08A"
                  textColor="#181818"
                  borderColor="#181818"
                  rotate="-2deg"
                />
                {/* Zone B: Tucked under the sticker badge border */}
                <HiddenStar
                  slotId="slot-b-badge-under"
                  className="-bottom-1 -right-1.5 z-30 pointer-events-auto"
                  rotate="8deg"
                />
              </div>
              <div className="relative inline-block">
                <StickerBadge
                  text="100% PLAY-READY"
                  icon={
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  }
                  bgColor="#FFFFFF"
                  textColor="#181818"
                  borderColor="#181818"
                  rotate="2deg"
                />
                <HiddenStar
                  slotId="slot-b-badge-play-ready"
                  className="-top-1 -right-1 z-30 pointer-events-auto"
                  rotate="-12deg"
                />
              </div>
            </div>

            {/* Oversized Rounded Playful Headline: PLAY. MOVE. EXPLORE. */}
            <h1
              className="font-bold text-[#181818] tracking-tight leading-[0.88] mb-5 sm:mb-6 select-none"
              style={{
                fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                fontSize: "clamp(3.8rem, 8.2vw, 8.2rem)",
                opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
                transform:
                  phase >= 2 || prefersReducedMotion
                    ? "translateY(0) rotate(0deg)"
                    : "translateY(20px) rotate(-1deg)",
                transition: prefersReducedMotion
                  ? "none"
                  : "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="block text-[#181818] hover:text-[#0284C7] transition-colors duration-200">
                PLAY.
              </span>
              <span className="block text-[#EA580C] hover:text-[#C2410C] transition-colors duration-200 pl-2 sm:pl-4">
                MOVE.
              </span>
              <span className="block text-[#181818] hover:text-[#16A34A] transition-colors duration-200 relative inline-block">
                EXPLORE.
                {/* Zone B: Subtle star beside the period of the headline */}
                <HiddenStar
                  slotId="slot-b-headline-period"
                  className="-top-1 -right-5 sm:-right-6 z-30 pointer-events-auto"
                  rotate="-10deg"
                />
              </span>
            </h1>

            {/* Cartoon Supporting Philosophy Description */}
            <p
              className="text-sm sm:text-base text-[#334155] font-medium tracking-normal max-w-sm sm:max-w-md leading-relaxed mb-6 sm:mb-8"
              style={{
                opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
                transform:
                  phase >= 2 || prefersReducedMotion
                    ? "translateY(0)"
                    : "translateY(8px)",
                transition: prefersReducedMotion
                  ? "none"
                  : "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
              }}
            >
              Heirloom luxury silhouettes designed for real movement, wild curiosity, and daily adventures. Scaled-down tailoring crafted from cloud-soft natural fibers.
            </p>

            {/* Playful Interactive CTA Button */}
            <div
              className="flex items-center gap-4 flex-wrap"
              style={{
                opacity: phase >= 3 || prefersReducedMotion ? 1 : 0,
                transform:
                  phase >= 3 || prefersReducedMotion
                    ? "translateY(0)"
                    : "translateY(12px)",
                transition: prefersReducedMotion
                  ? "none"
                  : "opacity 500ms ease-out, transform 500ms ease-out",
              }}
            >
              <div className="relative inline-block">
                <a
                  href="#kids-category-section"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("kids-category-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#FEF08A] text-[#181818] hover:bg-[#FDE047] border-2 border-[#181818] rounded-full text-xs sm:text-[13px] font-sans tracking-[0.16em] uppercase font-bold transition-all duration-200 ease-out shadow-[4px_4px_0px_#181818] hover:shadow-[2px_2px_0px_#181818] hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer select-none"
                >
                  <span>EXPLORE KIDS&apos; WORLD</span>
                  <span
                    className="text-base transform group-hover:translate-y-0.5 transition-transform duration-200"
                    aria-hidden="true"
                  >
                    &darr;
                  </span>
                </a>
                {/* Zone B: Subtle star tucked near the button shadow corner */}
                <HiddenStar
                  slotId="slot-b-explore-btn"
                  className="-bottom-2 -left-2 z-30 pointer-events-auto"
                  rotate="15deg"
                />
              </div>

            </div>
          </div>

          {/* â”€â”€ RIGHT COLUMN: REAL CHILD MODEL INSIDE CARTOON SURROUNDINGS â”€â”€ */}
          <div className="lg:col-span-5 xl:col-span-5 relative flex items-end justify-center lg:justify-end xl:justify-center h-full z-10 order-1 lg:order-2">
            <div
              className="relative flex items-end justify-center lg:justify-end xl:justify-center w-full pb-2 sm:pb-4 lg:pb-6"
              style={{
                opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
                transform:
                  phase >= 2 || prefersReducedMotion
                    ? "translate3d(0, 0, 0)"
                    : "translate3d(30px, 0, 0)",
                transition: prefersReducedMotion
                  ? "none"
                  : "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform, opacity",
              }}
            >
              {/* CARTOON LAYER 1: Illustrated Cloud Behind Model (safely below navbar) */}
              <div
                className="absolute top-20 sm:top-24 -left-12 sm:-left-16 z-0 animate-kids-float"
                aria-hidden="true"
              >
                <DoodleCloud
                  className="w-32 sm:w-44 h-auto"
                  color="#FFFFFF"
                  borderColor="#181818"
                  borderWidth={2.5}
                />
              </div>

              {/* CARTOON LAYER 2: Floating Sticker Tag Near Shoulder (contained safely within model frame) */}
              <div
                className="absolute top-1/4 right-2 sm:right-4 z-20 animate-kids-float-slow"
                style={{ animationDelay: "1s" }}
              >
                <div className="relative inline-block">
                  <StickerBadge
                    text="CLOUD SOFT"
                    icon={
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                      </svg>
                    }
                    bgColor="#E0F2FE"
                    textColor="#0369A1"
                    borderColor="#181818"
                    rotate="4deg"
                  />
                  <HiddenStar
                    slotId="slot-b-sticker-cloud-soft"
                    className="-top-1.5 -left-1.5 z-30 pointer-events-auto"
                    rotate="-8deg"
                  />
                </div>
              </div>

              {/* CARTOON LAYER 3: Illustrated Ground Shadow / Sticker Oval beneath child model */}
              <div
                className="absolute -bottom-3 sm:-bottom-4 w-4/5 max-w-[340px] h-9 sm:h-11 rounded-[100%] bg-[#181818]/15 border-2 border-[#181818]/25 z-0"
                aria-hidden="true"
              />

              {/* CARTOON LAYER 4: Sneaker Speed & Motion Lines around feet with Secret Star */}
              <div
                className="absolute bottom-4 -left-12 sm:-left-16 z-30"
              >
                <div className="relative">
                  <DoodleSneakerMotion className="w-28 sm:w-36 h-auto transition-transform group-hover:scale-105 relative z-10 pointer-events-none" color="#FB923C" />
                  {/* Zone B: Secret Star along the orange sneaker motion lines */}
                  <HiddenStar
                    slotId="slot-b-sneaker-trail"
                    className="top-0.5 right-2 z-30 pointer-events-auto"
                    rotate="-20deg"
                  />
                </div>
              </div>

              {/* Twinkling star near sneakers (contained safely within model frame) */}
              <div
                className="absolute bottom-16 right-2 sm:right-4 z-20 animate-kids-twinkle"
                aria-hidden="true"
              >
                <DoodleStar className="w-8 h-8" color="#FEF08A" strokeColor="#181818" />
              </div>

              {/* â”€â”€ THE EXACT CHILD MODEL (Preserved exactly, 0 changes to face, clothes, or shoes) â”€â”€ */}
              <div className="relative z-10">
                <Image
                  src="/images/pablo-kids-hero.webp"
                  alt="PABLO Kids Fashion Model"
                  width={457}
                  height={1168}
                  priority
                  unoptimized
                  className="object-contain object-bottom w-auto select-none pointer-events-none drop-shadow-md h-[54vh] sm:h-[64vh] md:h-[72vh] lg:h-[78vh] xl:h-[82vh] max-h-[790px]"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
