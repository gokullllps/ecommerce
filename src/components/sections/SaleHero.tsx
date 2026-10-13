"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export interface SaleHeroProps {
  onExploreClick?: (e: React.MouseEvent) => void;
}

export default function SaleHero({ onExploreClick }: SaleHeroProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPrefersReducedMotion(true);
      setPhase(5);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 60);    // Background & landscape reveal
    const t2 = setTimeout(() => setPhase(2), 220);   // Model smooth entrance
    const t3 = setTimeout(() => setPhase(3), 480);   // Main typography reveal
    const t4 = setTimeout(() => setPhase(4), 720);   // 40% OFF & supporting copy
    const t5 = setTimeout(() => setPhase(5), 940);   // CTAs and stamp badge

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Subtle GPU-accelerated hero scroll tracking
  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const height = containerRef.current.offsetHeight || window.innerHeight;
          const p = Math.min(Math.max(-rect.top / height, 0), 1);
          setScrollProgress(p);
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  const handleScrollToCatalogue = (e: React.MouseEvent) => {
    if (onExploreClick) {
      onExploreClick(e);
      return;
    }
    e.preventDefault();
    const catalogueEl = document.getElementById("catalogue");
    if (catalogueEl) {
      catalogueEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      aria-label="PABLO Archival Sale Campaign"
      className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden select-none bg-[#11100E] text-[#EAE8E1]"
      style={{
        backgroundColor: "#11100E",
        minHeight: "100svh",
        height: "100svh",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════
          LAYER 1: CINEMATIC LANDSCAPE BACKGROUND
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden pablo-page-resolve"
        style={{
          opacity: phase >= 1 || prefersReducedMotion ? 1 : 0,
          transform: prefersReducedMotion
            ? "none"
            : phase >= 1
            ? `translate3d(0, ${scrollProgress * -20}px, 0) scale(1)`
            : "scale(1.04)",
          transition: prefersReducedMotion
            ? "none"
            : "opacity 1000ms ease-out, transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: prefersReducedMotion ? "auto" : "transform",
        }}
      >
        <Image
          src="/images/sale-hero-bg.webp"
          alt="PABLO Archival Desert Ruins Landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_35%] md:object-[center_42%] w-full h-full"
          style={{
            filter: "contrast(1.08) brightness(0.92)",
          }}
        />

        {/* Cinematic Vignette & Atmospheric Contrast Gradient */}
        {/* Left Side Shadow: Enhances text readability while preserving the central ruins */}
        <div
          className="absolute inset-y-0 left-0 w-3/4 sm:w-2/3 md:w-3/5 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(17,16,14,0.85) 0%, rgba(17,16,14,0.6) 45%, rgba(17,16,14,0.15) 80%, transparent 100%)",
          }}
        />

        {/* Top Shadow: Seamless integration with sticky navbar */}
        <div
          className="absolute inset-x-0 top-0 h-28 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(17,16,14,0.7) 0%, rgba(17,16,14,0.2) 60%, transparent 100%)",
          }}
        />

        {/* Bottom Shadow: Grounds the terrain into the catalogue border */}
        <div
          className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(17,16,14,0.92) 0%, rgba(17,16,14,0.45) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 2: GROUND DUST & ATMOSPHERIC MIST
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-10 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(200, 185, 165, 0.18) 0%, rgba(180, 165, 145, 0.08) 45%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 3: FOREGROUND MODEL (Integrated with physical lighting)
          ══════════════════════════════════════════════════════════════════ */}
      {/* Desktop Model Container */}
      <div
        className="hidden md:flex absolute bottom-0 right-[4%] lg:right-[10%] xl:right-[15%] h-[84%] lg:h-[88%] xl:h-[92%] items-end pointer-events-none z-20"
        style={{
          opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
          transform: prefersReducedMotion
            ? "none"
            : phase >= 2
            ? `translate3d(0, ${scrollProgress * -35}px, 0)`
            : "translate3d(-24px, 16px, 0)",
          transition: prefersReducedMotion
            ? "none"
            : "opacity 900ms ease-out, transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: prefersReducedMotion ? "auto" : "transform",
        }}
      >
        {/* Contact shadow beneath model's coat & feet */}
        <div
          className="absolute bottom-0 left-1/4 w-[60%] h-8 rounded-[100%] bg-black/60 blur-[10px] -z-10"
          aria-hidden="true"
        />

        {/* Ambient warm light reflection matching desert sun */}
        <div
          className="relative h-full w-auto flex items-end"
          style={{
            filter: "contrast(1.04) brightness(0.96) drop-shadow(0 16px 32px rgba(0,0,0,0.5))",
          }}
        >
          <Image
            src="/images/sale-hero-model.webp"
            alt="PABLO Archival Male Campaign Model"
            width={1024}
            height={985}
            priority
            unoptimized
            className="h-full w-auto object-contain object-bottom select-none pointer-events-none"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 4: STAMP BADGE (Upper Right on Desktop)
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:block absolute top-16 lg:top-20 right-6 lg:right-14 xl:right-24 z-30 pointer-events-none select-none"
        style={{
          opacity: prefersReducedMotion ? 0.88 : phase >= 5 ? Math.max(0, 0.88 - scrollProgress * 1.8) : 0,
          transform:
            phase >= 5 || prefersReducedMotion
              ? `rotate(-9deg) translate3d(0, ${scrollProgress * -15}px, 0) scale(1)`
              : "rotate(-18deg) scale(0.85)",
          transition: prefersReducedMotion
            ? "none"
            : "opacity 700ms ease-out, transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="w-[110px] h-[110px] lg:w-[130px] lg:h-[130px] rounded-full border-2 border-dashed border-[#EAE8E1]/60 flex flex-col items-center justify-center p-2 relative shadow-lg bg-black/25 backdrop-blur-[2px]">
          {/* Outer ring */}
          <div className="absolute inset-1.5 rounded-full border border-[#EAE8E1]/40" />

          {/* Stars */}
          <div className="flex items-center gap-1 mb-0.5 text-[#EAE8E1]/80 text-[10px] tracking-widest">
            <span>★</span>
            <span className="text-[12px]">★</span>
            <span>★</span>
          </div>

          {/* Stamp Text */}
          <span className="font-sans font-bold text-[9px] lg:text-[10px] tracking-[0.22em] text-[#EAE8E1] uppercase">
            ARCHIVAL
          </span>
          <span className="font-serif italic font-normal text-[15px] lg:text-[18px] tracking-[0.14em] text-[#EAE8E1] uppercase leading-none my-0.5">
            SALE
          </span>
          <span className="font-sans font-medium text-[9px] lg:text-[10px] tracking-[0.18em] text-[#EAE8E1]/90">
            — 40% —
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 5: EDITORIAL TYPOGRAPHY & CONTENT (DESKTOP >= md)
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex page-container relative z-30 w-full h-full min-h-[100svh] flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16"
        style={{
          opacity: prefersReducedMotion ? 1 : Math.max(0, 1 - scrollProgress * 1.8),
          transform: prefersReducedMotion ? "none" : `translate3d(0, ${scrollProgress * -15}px, 0)`,
          willChange: prefersReducedMotion ? "auto" : "opacity, transform",
        }}
      >
        {/* Main Editorial Block */}
        <div className="max-w-xl lg:max-w-2xl pt-4">
          {/* Overline with clean divider */}
          <div
            className="flex items-center gap-3 mb-4"
            style={{
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 2 || prefersReducedMotion
                  ? "translateX(0)"
                  : "translateX(-12px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 600ms ease-out, transform 600ms ease-out",
            }}
          >
            <span className="text-[10px] lg:text-[11px] font-sans tracking-[0.32em] uppercase text-[#EAE8E1]/80 font-medium">
              ARCHIVAL SALE
            </span>
            <span className="w-8 h-[1px] bg-[#EAE8E1]/50" />
            <span className="text-[10px] lg:text-[11px] font-sans tracking-[0.32em] uppercase text-[#EAE8E1]/80 font-medium">
              LIMITED EDITION
            </span>
          </div>

          {/* Grand Headline: THE LAST COLLECTION */}
          <h1
            className="font-normal text-[#EAE8E1] uppercase tracking-[0.02em] leading-[0.88] select-none text-5xl lg:text-7xl xl:text-8xl mb-5"
            style={{
              fontFamily: "'Beverly', var(--font-editorial), serif",
              fontKerning: "normal",
              opacity: phase >= 3 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 3 || prefersReducedMotion
                  ? "translateY(0)"
                  : "translateY(16px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
              textShadow: "0 2px 20px rgba(0, 0, 0, 0.7)",
            }}
          >
            THE LAST<br />
            COLLECTION
          </h1>

          {/* Supporting Statement */}
          <p
            className="text-[11px] lg:text-xs text-[#EAE8E1]/80 font-light tracking-[0.24em] uppercase leading-relaxed mb-6"
            style={{
              opacity: phase >= 4 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 4 || prefersReducedMotion
                  ? "translateY(0)"
                  : "translateY(10px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 700ms ease-out, transform 700ms ease-out",
            }}
          >
            RARE SILHOUETTES. LIMITED PRICES. FINAL RELEASE.
          </p>

          {/* Dominant Highlight: UP TO 40% OFF */}
          <div
            className="mb-8"
            style={{
              opacity: phase >= 4 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 4 || prefersReducedMotion
                  ? "translateY(0)"
                  : "translateY(10px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 700ms ease-out, transform 700ms ease-out",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-[1px] bg-[#EAE8E1]/60" />
              <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-[#EAE8E1]/80 font-medium">
                UP TO
              </span>
            </div>
            <div
              className="text-4xl lg:text-6xl font-normal text-[#EAE8E1] tracking-tight leading-none"
              style={{
                fontFamily: "'Beverly', var(--font-editorial), serif",
                fontKerning: "normal",
                textShadow: "0 2px 16px rgba(0, 0, 0, 0.6)",
              }}
            >
              40% OFF
            </div>
          </div>

          {/* CTAs */}
          <div
            className="flex items-center gap-5"
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
              className="group pablo-btn-luxury inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#181818]/90 hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#181818] border border-white/25 hover:border-white backdrop-blur-sm text-[11px] sm:text-[12px] uppercase tracking-[0.26em] font-sans font-medium shadow-lg hover:shadow-xl cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>EXPLORE ARCHIVAL PIECES</span>
              <span
                className="btn-arrow inline-block text-xs"
                aria-hidden="true"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          LAYER 6: DEDICATED PURPOSE-BUILT MOBILE HERO (< md)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden relative flex-col justify-between z-30 px-5 pt-16 pb-3 h-[100svh] min-h-[100svh] w-full overflow-hidden">
        {/* Subtle Top-Left Vignette for Typography Contrast without darkening the ruins */}
        <div
          className="absolute inset-y-0 left-0 w-4/5 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 15% 25%, rgba(17,16,14,0.65) 0%, rgba(17,16,14,0.25) 50%, transparent 80%)",
          }}
          aria-hidden="true"
        />

        {/* 1. Mobile Top Row: Left Overline + Right Stamp Badge */}
        <div className="flex items-start justify-between w-full pt-1 z-30">
          {/* Top Left: ARCHIVAL SALE — LIMITED EDITION */}
          <div
            className="flex flex-col gap-1"
            style={{
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 2 || prefersReducedMotion
                  ? "translateX(0)"
                  : "translateX(-8px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 600ms ease-out, transform 600ms ease-out",
            }}
          >
            <span className="text-[10px] font-sans tracking-[0.28em] uppercase text-[#EAE8E1]/90 font-medium">
              ARCHIVAL SALE
            </span>
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#EAE8E1]/60" />
              <span className="text-[9px] font-sans tracking-[0.24em] uppercase text-[#EAE8E1]/70">
                LIMITED EDITION
              </span>
            </div>
          </div>

          {/* Top Right: Subtle Circular ARCHIVAL SALE Badge */}
          <div
            className="w-[66px] h-[66px] rounded-full border border-dashed border-[#EAE8E1]/60 flex flex-col items-center justify-center p-1.5 bg-black/40 backdrop-blur-xs shadow-md select-none shrink-0"
            style={{
              transform: "rotate(-7deg)",
              opacity: phase >= 5 || prefersReducedMotion ? 0.92 : 0,
              transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out",
            }}
          >
            <span className="text-[7px] text-[#EAE8E1]/70 leading-none tracking-widest mb-0.5">★ ★ ★</span>
            <span className="text-[7.5px] font-sans font-bold text-[#EAE8E1] tracking-[0.2em] uppercase leading-none">
              ARCHIVAL
            </span>
            <span
              className="text-[12px] font-normal italic text-[#EAE8E1] tracking-[0.1em] uppercase leading-tight my-0.5"
              style={{ fontFamily: "'Beverly', var(--font-editorial), serif", fontKerning: "normal" }}
            >
              SALE
            </span>
            <span className="text-[7.5px] font-sans font-semibold text-[#EAE8E1]/90 tracking-wider leading-none">
              — 40% —
            </span>
          </div>
        </div>

        {/* 2. Mobile Recomposed Model Stage (Lower ~58% of the hero, anchored right/middle) */}
        <div className="absolute bottom-0 right-[-10%] sm:right-[-4%] h-[58%] sm:h-[62%] flex items-end justify-end pointer-events-none z-15 overflow-hidden">
          {/* Contact shadow beneath coat */}
          <div
            className="absolute bottom-0 right-1/4 w-[75%] h-6 rounded-[100%] bg-black/75 blur-md -z-10"
            aria-hidden="true"
          />

          <div
            className="relative h-full w-auto flex items-end"
            style={{
              opacity: phase >= 2 || prefersReducedMotion ? 1 : 0,
              transform: prefersReducedMotion
                ? "none"
                : phase >= 2
                ? "translate3d(0, 0, 0)"
                : "translate3d(12px, 12px, 0)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 800ms ease-out, transform 950ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Image
              src="/images/sale-hero-model.webp"
              alt="PABLO Archival Campaign Male Model"
              width={1024}
              height={985}
              priority
              unoptimized
              className="h-full w-auto object-contain object-bottom select-none pointer-events-none drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)]"
            />
          </div>
        </div>

        {/* 3. Mobile Middle Typography: THE LAST COLLECTION, Supporting Copy, 40% OFF */}
        <div className="relative z-25 max-w-[270px] sm:max-w-[310px] mt-2 mb-auto">
          {/* Main Title: THE LAST COLLECTION */}
          <h1
            className="font-normal text-[#EAE8E1] uppercase tracking-[0.02em] leading-[0.88] select-none text-[40px] sm:text-[46px] mb-2.5"
            style={{
              fontFamily: "'Beverly', var(--font-editorial), serif",
              fontKerning: "normal",
              textShadow: "0 2px 18px rgba(0, 0, 0, 0.9)",
              opacity: phase >= 3 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 3 || prefersReducedMotion
                  ? "translateY(0)"
                  : "translateY(12px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            THE LAST<br />
            COLLECTION
          </h1>

          {/* Supporting Copy */}
          <p
            className="text-[9.5px] sm:text-[10px] text-[#EAE8E1]/85 font-light tracking-[0.18em] uppercase leading-relaxed mb-3"
            style={{
              opacity: phase >= 4 || prefersReducedMotion ? 1 : 0,
              transform:
                phase >= 4 || prefersReducedMotion
                  ? "translateY(0)"
                  : "translateY(8px)",
              transition: prefersReducedMotion
                ? "none"
                : "opacity 600ms ease-out, transform 600ms ease-out",
            }}
          >
            RARE SILHOUETTES.<br />
            FINAL RELEASE.
          </p>

          {/* 40% OFF */}
          <div
            className="flex items-baseline gap-2"
            style={{
              opacity: phase >= 4 || prefersReducedMotion ? 1 : 0,
              transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out",
            }}
          >
            <span className="text-[10px] font-sans tracking-[0.24em] uppercase text-[#EAE8E1]/70">
              UP TO
            </span>
            <span
              className="text-3xl sm:text-4xl font-normal text-[#EAE8E1] tracking-tight"
              style={{
                fontFamily: "'Beverly', var(--font-editorial), serif",
                fontKerning: "normal",
                textShadow: "0 2px 14px rgba(0, 0, 0, 0.85)",
              }}
            >
              40% OFF
            </span>
          </div>
        </div>

        {/* 4. Mobile Bottom Portion: Full-Width Luxury CTA + Campaign Metadata */}
        <div className="relative z-30 w-full flex flex-col gap-2.5 pt-2 pb-1">
          {/* Prominent Touch-Friendly CTA Button */}
          <a
            href="#catalogue"
            onClick={handleScrollToCatalogue}
            className="group flex items-center justify-center gap-2.5 w-full py-3.5 min-h-[46px] bg-[#181818]/90 active:bg-[#FFFFFF] text-[#FFFFFF] active:text-[#181818] border border-white/25 active:border-white backdrop-blur-sm text-xs font-sans tracking-[0.24em] uppercase font-medium transition-all duration-300 ease-out shadow-xl cursor-pointer text-center select-none"
          >
            <span>EXPLORE THE SALE</span>
            <span
              className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 text-xs"
              aria-hidden="true"
            >
              →
            </span>
          </a>

          {/* Bottom Campaign Metadata */}
          <div className="flex items-center justify-between text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#EAE8E1]/65 font-sans pt-2 border-t border-[#EAE8E1]/15 w-full">
            <span>LIMITED COLLECTION / 2026</span>
            <span>COMPLIMENTARY GLOBAL SHIPPING</span>
          </div>
        </div>
      </div>
    </section>
  );
}
