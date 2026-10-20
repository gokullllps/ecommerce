"use client";

import React from "react";
import Image from "next/image";

export function AboutHero() {
  const containerRef = React.useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPrefersReducedMotion(true);
    }
  }, []);

  React.useEffect(() => {
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

  const handleScrollToStory = () => {
    const el = document.getElementById("story");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="about-hero"
      aria-label="Maison PABLO Atelier Showcase"
      className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden flex flex-col justify-center items-center select-none bg-[#11100E] text-[#111111]"
    >
      {/* ─── FULL-BLEED ATELIER BACKGROUND (Primary Uploaded Asset) ─── */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-cover bg-center bg-no-repeat select-none pablo-page-resolve"
        style={{
          transform: prefersReducedMotion ? "none" : `translate3d(0, ${scrollProgress * -20}px, 0)`,
          willChange: prefersReducedMotion ? "auto" : "transform",
        }}
        aria-hidden="true"
      >
        <Image
          src="/images/about-hero-bg.jpg"
          alt="Maison PABLO Vintage Haute Couture Atelier"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] md:object-center w-full h-full select-none"
        />

        {/* ─── TOP SHADOW: Seamless integration with transparent sticky navbar (matching MEN/SALE pages) ─── */}
        <div
          className="absolute inset-x-0 top-0 h-32 sm:h-40 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(17,16,14,0.85) 0%, rgba(17,16,14,0.45) 50%, rgba(17,16,14,0.12) 78%, transparent 100%)",
          }}
        />

        {/* ─── ATMOSPHERIC SOFT CENTER RADIAL: Enhances editorial quote readability while preserving sunlight & architectural details ─── */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(17,16,14,0.52) 0%, rgba(17,16,14,0.22) 55%, transparent 85%)",
          }}
        />

        {/* ─── SUBTLE BOTTOM SHADOW: Softly transitions into the dark promotional ticker ─── */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to top, rgba(17,16,14,0.65) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ─── CENTER EDITORIAL CONTENT (Maison PABLO Hierarchy) ─── */}
      <div className="relative z-20 flex-1 min-h-0 w-full flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 text-center select-none pt-16 sm:pt-20 pb-8">
        <div className="max-w-3xl flex flex-col items-center">
          {/* Small Eyebrow */}
          <span
            className="text-[10px] sm:text-[11.5px] uppercase tracking-[0.32em] sm:tracking-[0.36em] text-white/85 font-sans font-medium mb-3 sm:mb-4 drop-shadow-sm select-none"
          >
            THE PHILOSOPHY
          </span>

          {/* Main Heading */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-normal text-white tracking-[0.02em] sm:tracking-[0.03em] leading-none select-none drop-shadow-md my-1 sm:my-2"
            style={{
              fontFamily: "'Orborn', sans-serif",
              fontKerning: "normal",
            }}
          >
            Maison PABLO
          </h1>

          {/* Supporting Quote */}
          <p
            className="font-serif italic text-[13.5px] sm:text-base md:text-[17px] lg:text-lg text-white/90 max-w-xl sm:max-w-2xl leading-relaxed sm:leading-relaxed font-light mt-4 sm:mt-5 drop-shadow-sm tracking-wide select-none"
            style={{
              fontFamily: "'Orborn', sans-serif",
              fontKerning: "normal",
            }}
          >
            &ldquo;We design for permanence. In an era of fleeting velocity, true luxury is the quiet authority of architectural silhouette and exquisite touch.&rdquo;
          </p>

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={handleScrollToStory}
            className="group pablo-btn-luxury inline-flex items-center gap-3 mt-8 sm:mt-10 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#181818]/90 hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#181818] border border-white/25 hover:border-white backdrop-blur-sm text-[11px] sm:text-[12px] uppercase tracking-[0.26em] font-sans font-medium shadow-lg hover:shadow-xl cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span>DISCOVER OUR STORY</span>
            <span
              className="btn-arrow inline-block text-xs"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>
      </div>

    </section>
  );
}

export default AboutHero;
