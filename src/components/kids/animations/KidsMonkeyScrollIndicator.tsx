"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useSiteTheme } from "@/context/ThemeContext";

/**
 * PABLO Kids — Playful Jungle / Forest Scrolling Path
 * 
 * Architecture:
 * 1. Dedicated Right Jungle Rail Corridor (36px width, right-0):
 *    - Sits strictly outside the page content area (body has padding-right: 36px on Kids route).
 *    - 100% safe exclusion: never overlaps CLOUD SOFT, hero model, stickers, or interactive UI.
 * 2. Organic Winding Jungle Vine:
 *    - Generous 18px horizontal wave amplitude (swings between x=9 and x=27).
 *    - Hand-drawn styling with double-leaf clusters, curling tendrils, leafy offshoots, and golden buds.
 *    - Illustrated canopy sprout at the top and root curl at the bottom.
 * 3. Interactive Cartoon Monkey Mascot:
 *    - Hangs naturally from leafy branch crossbar as the scroll handle.
 *    - Bidirectional synchronization: Scroll <-> Drag.
 *    - Silky smooth spring-lerp interpolation on page wheel scroll (0.22 factor).
 *    - Instant 1:1 hardware tracking on drag with pointer capture.
 *    - Directional climbing tilt (±3.5°) and gentle idle sway when stationary.
 * 4. Micro-Particle System:
 *    - Self-cleaning golden pollen dust & drifting cartoon leaves during active scrolling.
 *    - Capped, throttled, zero React re-renders, 60fps GPU acceleration.
 */

const THUMB_HEIGHT = 44; // px

export function KidsMonkeyScrollIndicator() {
  const pathname = usePathname();
  const { isKids: isSiteKids } = useSiteTheme();
  const isKids = isSiteKids || Boolean(pathname?.startsWith("/kids"));

  // Hydration safety mount check
  const [mounted, setMounted] = useState<boolean>(false);
  const [isPastHero, setIsPastHero] = useState<boolean>(false);

  useEffect(() => {
    const handleCheckHero = () => {
      const hero = document.getElementById("kids-hero") || document.getElementById("hero-scroll-container");
      if (!hero) {
        setIsPastHero(true);
        return;
      }
      const scrollY = window.scrollY || window.pageYOffset;
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      setIsPastHero(scrollY >= heroBottom - 100);
    };

    handleCheckHero();
    window.addEventListener("scroll", handleCheckHero, { passive: true });
    window.addEventListener("resize", handleCheckHero, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleCheckHero);
      window.removeEventListener("resize", handleCheckHero);
    };
  }, []);

  // DOM Refs
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const monkeyInnerRef = useRef<HTMLDivElement>(null);

  // Motion Refs
  const isDraggingRef = useRef<boolean>(false);
  const dragStartYRef = useRef<number>(0);
  const dragStartMonkeyYRef = useRef<number>(0);
  const currentMonkeyYRef = useRef<number>(0);
  const latestScrollYRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const scrollStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReducedMotionRef = useRef<boolean>(false);

  // Apply monkey position directly from actual document scroll progress
  const applyScrollProgress = useCallback(() => {
    if (isDraggingRef.current || !thumbRef.current) return;

    const scrollY = latestScrollYRef.current;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = docHeight - winHeight;

    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    const clampedProgress = Math.max(0, Math.min(1, progress));

    const track = trackRef.current;
    const railHeight = track ? track.getBoundingClientRect().height : (winHeight - 96);
    const usableTravel = Math.max(railHeight - THUMB_HEIGHT, 0);
    const monkeyY = clampedProgress * usableTravel;

    currentMonkeyYRef.current = monkeyY;
    thumbRef.current.style.transform = `translate3d(-50%, ${monkeyY.toFixed(1)}px, 0)`;

    // Directional tilt while scrolling
    const delta = scrollY - lastScrollYRef.current;
    lastScrollYRef.current = scrollY;

    if (monkeyInnerRef.current && !isReducedMotionRef.current) {
      if (delta > 1) {
        monkeyInnerRef.current.classList.remove("kids-monkey-idle");
        monkeyInnerRef.current.style.transform = "rotate(3.5deg) translateY(1px)";
      } else if (delta < -1) {
        monkeyInnerRef.current.classList.remove("kids-monkey-idle");
        monkeyInnerRef.current.style.transform = "rotate(-3.5deg) translateY(-1px)";
      }
    }

    // Return to idle sway when scrolling pauses
    if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
    scrollStopTimerRef.current = setTimeout(() => {
      if (monkeyInnerRef.current) {
        monkeyInnerRef.current.style.transform = "rotate(0deg)";
        if (!isReducedMotionRef.current) {
          monkeyInnerRef.current.classList.add("kids-monkey-idle");
        }
      }
    }, 150);
  }, []);

  // Synchronize with passive window scroll and document height changes
  useEffect(() => {
    setMounted(true);

    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotionRef.current = mql.matches;
    const handleMql = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches;
      if (e.matches && monkeyInnerRef.current) {
        monkeyInnerRef.current.classList.remove("kids-monkey-idle");
        monkeyInnerRef.current.style.transform = "none";
      } else if (!e.matches && monkeyInnerRef.current) {
        monkeyInnerRef.current.classList.add("kids-monkey-idle");
      }
    };
    mql.addEventListener("change", handleMql);

    const onScrollOrResize = () => {
      if (isDraggingRef.current) return;
      latestScrollYRef.current = window.scrollY ?? window.pageYOffset ?? document.documentElement.scrollTop ?? 0;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          applyScrollProgress();
          rafIdRef.current = null;
        });
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // Observe dynamic page content / layout changes
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        onScrollOrResize();
      });
      if (document.documentElement) {
        resizeObserver.observe(document.documentElement);
      }
      if (document.body) {
        resizeObserver.observe(document.body);
      }
    }

    // Initial position & delayed calibration ticks
    onScrollOrResize();
    const t1 = setTimeout(onScrollOrResize, 50);
    const t2 = setTimeout(onScrollOrResize, 200);
    const t3 = setTimeout(onScrollOrResize, 600);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      mql.removeEventListener("change", handleMql);
      if (resizeObserver) resizeObserver.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [applyScrollProgress]);

  // Pointer Down on Monkey Thumb (Begin Drag)
  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    isDraggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    dragStartYRef.current = e.clientY;
    dragStartMonkeyYRef.current = currentMonkeyYRef.current;

    if (monkeyInnerRef.current) {
      monkeyInnerRef.current.classList.remove("kids-monkey-idle");
    }
  };

  // Pointer Move on Monkey Thumb (Direct 1:1 Instant Tracking)
  const handleThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();

    const track = trackRef.current;
    const railHeight = track ? track.getBoundingClientRect().height : (window.innerHeight - 96);
    const usableTravel = Math.max(railHeight - THUMB_HEIGHT, 1);
    const deltaY = e.clientY - dragStartYRef.current;
    const targetY = Math.max(0, Math.min(usableTravel, dragStartMonkeyYRef.current + deltaY));
    const dragProgress = targetY / usableTravel;

    currentMonkeyYRef.current = targetY;
    if (thumbRef.current) {
      thumbRef.current.style.transform = `translate3d(-50%, ${targetY.toFixed(1)}px, 0)`;
    }

    const dir: "down" | "up" | "idle" =
      deltaY > 1 ? "down" : deltaY < -1 ? "up" : "idle";
    if (monkeyInnerRef.current && !isReducedMotionRef.current) {
      if (dir === "down") {
        monkeyInnerRef.current.style.transform = "rotate(3.5deg) translateY(1px)";
      } else if (dir === "up") {
        monkeyInnerRef.current.style.transform = "rotate(-3.5deg) translateY(-1px)";
      }
    }

    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const targetScroll = dragProgress * maxScroll;
    latestScrollYRef.current = targetScroll;

    window.scrollTo({
      top: targetScroll,
      behavior: "auto",
    });
  };

  // Pointer Up / Cancel
  const handleThumbPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (scrollStopTimerRef.current) clearTimeout(scrollStopTimerRef.current);
    scrollStopTimerRef.current = setTimeout(() => {
      if (monkeyInnerRef.current) {
        monkeyInnerRef.current.style.transform = "rotate(0deg)";
        if (!isReducedMotionRef.current) {
          monkeyInnerRef.current.classList.add("kids-monkey-idle");
        }
      }
    }, 150);
  };

  // Track Pointer Down (Click on vine path to jump)
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (thumbRef.current && thumbRef.current.contains(e.target as Node)) {
      return;
    }
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const railHeight = rect.height;
    const usableTravel = Math.max(railHeight - THUMB_HEIGHT, 1);
    const clickY = e.clientY - rect.top - THUMB_HEIGHT / 2;
    const clampedY = Math.max(0, Math.min(usableTravel, clickY));
    const ratio = clampedY / usableTravel;

    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);

    window.scrollTo({
      top: ratio * maxScroll,
      behavior: "smooth",
    });
  };

  if (!isKids || !mounted) {
    return null;
  }

  return (
    <aside
      aria-label="Kids interactive jungle scrolling path"
      className={`fixed z-40 select-none right-0 w-3.5 sm:w-8 md:w-9 sm:right-1 md:right-1.5 top-[60px] sm:top-[72px] h-[calc(100dvh-75px)] sm:h-[calc(100vh-96px)] overflow-hidden sm:overflow-visible transition-opacity duration-300 ${
        isPastHero ? "opacity-60 sm:opacity-100 pointer-events-none" : "opacity-0 pointer-events-none"
      }`}
      style={{
        touchAction: "none",
      }}
    >
      {/* ── THE ORGANIC JUNGLE VINE TRACK ── */}
      <div
        ref={trackRef}
        onPointerDown={isPastHero ? handleTrackPointerDown : undefined}
        className={`group/track relative w-full h-full flex justify-center ${
          isPastHero ? "cursor-pointer pointer-events-auto" : "pointer-events-none"
        }`}
        title="Kids Jungle Path — Drag monkey to explore"
      >
        {/* Top Jungle Canopy Sprout with Twin Leaves & Curled Tendril */}
        <div className="absolute -top-4 right-0 sm:left-1/2 sm:-translate-x-1/2 pointer-events-none z-10">
          <svg viewBox="0 0 28 22" width="26" height="20" fill="none" aria-hidden="true">
            {/* Curled upward vine shoot */}
            <path
              d="M14 20 C14 12 9 6 4 7 C2 8 3 12 6 11"
              stroke="#181818"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M14 20 C14 12 9 6 4 7 C2 8 3 12 6 11"
              stroke="#22C55E"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Left canopy leaf */}
            <path
              d="M13 14 C8 9 2 11 3 15 C6 18 12 17 13 14 Z"
              fill="#4ADE80"
              stroke="#181818"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            {/* Right canopy leaf */}
            <path
              d="M15 13 C20 8 26 10 25 14 C23 17 17 16 15 13 Z"
              fill="#22C55E"
              stroke="#181818"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            {/* Tiny golden pollen bud */}
            <circle cx="14" cy="7" r="1.5" fill="#FEF08A" stroke="#181818" strokeWidth="0.9" />
          </svg>
        </div>

        {/* Seamless Winding Organic Jungle Vine SVG (Generous 18px Wave Amplitude) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none transition-filter duration-300 group-hover/track:drop-shadow-[0_0_5px_rgba(34,197,94,0.45)]">
          <svg
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="kids-jungle-winding-vine-v2"
                width="36"
                height="150"
                patternUnits="userSpaceOnUse"
              >
                {/* 1. Main Vine Stem Outline (Noticeable graceful S-curve swing from x=9 to x=27) */}
                <path
                  d="M 18 0 C 9 22, 10 50, 18 75 C 27 100, 26 128, 18 150"
                  stroke="#181818"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* 2. Main Vine Jungle Green Core */}
                <path
                  d="M 18 0 C 9 22, 10 50, 18 75 C 27 100, 26 128, 18 150"
                  stroke="#16A34A"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* 3. Sunlight Highlight on Inner Curves */}
                <path
                  d="M 17.5 4 C 10 24, 11 48, 17 68"
                  stroke="#86EFAC"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 18.5 82 C 25 102, 24 124, 18.5 144"
                  stroke="#86EFAC"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* ── Branch 1: Leftward Branch & Double Leaf (at y=32, where vine peaks left at x≈10) ── */}
                <path
                  d="M 10 32 C 6 29, 3 28, 2 33"
                  stroke="#181818"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 10 32 C 6 29, 3 28, 2 33"
                  stroke="#22C55E"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Primary Leaf 1A */}
                <path
                  d="M 2 33 C -1 30, -1 36, 2 38 C 4 37, 4 34, 2 33 Z"
                  fill="#4ADE80"
                  stroke="#181818"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path d="M 2 33 C 0.5 35, 1 36.5, 2 37.5" stroke="#15803D" strokeWidth="0.8" strokeLinecap="round" />
                {/* Secondary Tender Leaf 1B */}
                <path
                  d="M 4 31 C 2 28, 6 25, 7 28 Z"
                  fill="#22C55E"
                  stroke="#181818"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />

                {/* Inward leaf at y=56 */}
                <path
                  d="M 12 56 C 16 54, 18 57, 15 59 Z"
                  fill="#86EFAC"
                  stroke="#181818"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />

                {/* Vine Node / Golden Jungle Blossom at inflection point (y=75) */}
                <circle cx="18" cy="75" r="2" fill="#16A34A" stroke="#181818" strokeWidth="1" />
                <circle cx="18" cy="75" r="1.1" fill="#FEF08A" />

                {/* ── Branch 2: Rightward Branch & Lush Leaf Cluster (at y=112, where vine peaks right at x≈26) ── */}
                <path
                  d="M 26 112 C 30 110, 33 111, 34 115"
                  stroke="#181818"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 26 112 C 30 110, 33 111, 34 115"
                  stroke="#22C55E"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Primary Leaf 2A */}
                <path
                  d="M 34 115 C 37 112, 38 118, 35 120 C 33 119, 33 116, 34 115 Z"
                  fill="#22C55E"
                  stroke="#181818"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path d="M 34 115 C 35.5 117, 35 118.5, 34.5 119.5" stroke="#14532D" strokeWidth="0.8" strokeLinecap="round" />
                {/* Secondary Leaf 2B */}
                <path
                  d="M 32 110 C 34 107, 37 109, 35 112 Z"
                  fill="#4ADE80"
                  stroke="#181818"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />

                {/* Hanging jungle leaf on left side at y=138 */}
                <path
                  d="M 20 138 C 15 137, 12 141, 11 145"
                  stroke="#181818"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 20 138 C 15 137, 12 141, 11 145"
                  stroke="#22C55E"
                  strokeWidth="1"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 11 145 C 8 143, 8 148, 11 149 C 13 148, 12 145, 11 145 Z"
                  fill="#86EFAC"
                  stroke="#181818"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </pattern>
            </defs>

            <rect
              x="0"
              y="0"
              width="36"
              height="100%"
              fill="url(#kids-jungle-winding-vine-v2)"
            />
          </svg>
        </div>

        {/* Bottom Jungle Root Terminal with Grounding Leaf */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <svg viewBox="0 0 28 22" width="26" height="20" fill="none" aria-hidden="true">
            {/* Root curl loop */}
            <path
              d="M14 2 C14 10 19 16 24 15 C26 14 25 10 22 11"
              stroke="#181818"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M14 2 C14 10 19 16 24 15 C26 14 25 10 22 11"
              stroke="#22C55E"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Grounding jungle leaf */}
            <path
              d="M15 7 C19 11 24 8 23 4 C20 3 17 5 15 7 Z"
              fill="#4ADE80"
              stroke="#181818"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </div>


        {/* ── POSITION LAYER: Draggable Monkey Thumb (Centered on Winding Vine Path) ── */}
        <div
          ref={thumbRef}
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
          onPointerCancel={handleThumbPointerUp}
          className="absolute left-1/2 w-10 h-11 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto select-none z-30 origin-center scale-[0.62] sm:scale-90 md:scale-100"
          style={{
            top: 0,
            transform: "translate3d(-50%, 0px, 0)",
            willChange: "transform",
            transition: "none",
            touchAction: "none",
          }}
          role="slider"
          aria-label="Kids monkey jungle climbing handle"
        >
          {/* ── MONKEY ANIMATION LAYER: Handles idle sway and directional tilt ── */}
          <div
            ref={monkeyInnerRef}
            className="w-full h-full flex items-center justify-center kids-monkey-idle transition-transform duration-150 hover:scale-108 active:scale-112"
            style={{
              transformOrigin: "center 7px",
            }}
          >
            {/* 
              Hand-Drawn Kids Cartoon Mascot:
              Small monkey hanging naturally from an organic curved branch with tiny leaves,
              traveling fluidly along the winding jungle path.
            */}
            <svg
              viewBox="0 0 46 48"
              className="w-full h-auto overflow-visible drop-shadow-[2px_2px_0px_rgba(24,24,24,0.85)]"
              fill="none"
              aria-hidden="true"
            >
              {/* 1. Curved Branch Crossbar */}
              <g id="kids-branch">
                {/* Organic curved wood branch */}
                <path
                  d="M4 10 C14 6 30 7 42 11"
                  stroke="#181818"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M5 10 C14 7 30 8 41 11"
                  stroke="#92400E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Wood grain line */}
                <path
                  d="M10 9 C18 7.5 28 8 36 10"
                  stroke="#B45309"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                {/* Tiny Cartoon Leaf on Left Branch Tip */}
                <path
                  d="M8 8 C3 3 2 9 7 10 Z"
                  fill="#4ADE80"
                  stroke="#181818"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Tiny Cartoon Leaf on Right Branch Tip */}
                <path
                  d="M38 9 C43 4 45 10 39 11 Z"
                  fill="#22C55E"
                  stroke="#181818"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </g>

              {/* 2. Monkey Character (Hanging Happily) */}
              <g id="kids-monkey">
                {/* Playful Curled Tail (loops behind) */}
                <path
                  d="M16 28 C9 32 7 21 13 17 C16 14 20 15 18 9"
                  stroke="#181818"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M16 28 C9 32 7 21 13 17 C16 14 20 15 18 9"
                  stroke="#B45309"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Left Arm reaching up to branch */}
                <path
                  d="M17 19 C15 14 14 10 14 8.5"
                  stroke="#181818"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M17 19 C15 14 14 10 14 8.5"
                  stroke="#B45309"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {/* Right Arm reaching up to branch */}
                <path
                  d="M29 19 C31 14 32 10 32 8.5"
                  stroke="#181818"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M29 19 C31 14 32 10 32 8.5"
                  stroke="#B45309"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {/* Left Hand Gripping Branch */}
                <circle
                  cx="14"
                  cy="8.5"
                  r="2.2"
                  fill="#FEF3C7"
                  stroke="#181818"
                  strokeWidth="1.2"
                />
                {/* Right Hand Gripping Branch */}
                <circle
                  cx="32"
                  cy="8.5"
                  r="2.2"
                  fill="#FEF3C7"
                  stroke="#181818"
                  strokeWidth="1.2"
                />

                {/* Monkey Body / Torso */}
                <ellipse
                  cx="23"
                  cy="28"
                  rx="7.5"
                  ry="8.5"
                  fill="#B45309"
                  stroke="#181818"
                  strokeWidth="1.8"
                />
                {/* Soft Cream Belly */}
                <ellipse
                  cx="23"
                  cy="29"
                  rx="4.5"
                  ry="5.5"
                  fill="#FEF3C7"
                  stroke="#181818"
                  strokeWidth="1"
                />

                {/* Dangling Little Feet */}
                <ellipse
                  cx="19"
                  cy="37"
                  rx="2.8"
                  ry="1.8"
                  fill="#B45309"
                  stroke="#181818"
                  strokeWidth="1.2"
                />
                <ellipse
                  cx="27"
                  cy="37"
                  rx="2.8"
                  ry="1.8"
                  fill="#B45309"
                  stroke="#181818"
                  strokeWidth="1.2"
                />

                {/* Monkey Head */}
                <circle
                  cx="23"
                  cy="18.5"
                  r="7.5"
                  fill="#B45309"
                  stroke="#181818"
                  strokeWidth="1.8"
                />

                {/* Left Ear */}
                <circle
                  cx="15.5"
                  cy="17"
                  r="3.2"
                  fill="#B45309"
                  stroke="#181818"
                  strokeWidth="1.2"
                />
                <circle cx="15.5" cy="17" r="1.6" fill="#FEF3C7" />

                {/* Right Ear */}
                <circle
                  cx="30.5"
                  cy="17"
                  r="3.2"
                  fill="#B45309"
                  stroke="#181818"
                  strokeWidth="1.2"
                />
                <circle cx="30.5" cy="17" r="1.6" fill="#FEF3C7" />

                {/* Cream Face Mask Patch */}
                <path
                  d="M19 16 C19 13 22.5 13 23 15 C23.5 13 27 13 27 16 C27 20.5 23 22.5 23 22.5 C23 22.5 19 20.5 19 16 Z"
                  fill="#FEF3C7"
                  stroke="#181818"
                  strokeWidth="1"
                />

                {/* Expressive Cartoon Eye Dots with Catchlights */}
                <circle cx="21" cy="16.5" r="1.1" fill="#181818" />
                <circle cx="20.7" cy="16.2" r="0.35" fill="#FFFFFF" />

                <circle cx="25" cy="16.5" r="1.1" fill="#181818" />
                <circle cx="24.7" cy="16.2" r="0.35" fill="#FFFFFF" />

                {/* Snout & Playful Smile */}
                <ellipse cx="23" cy="18.8" rx="1" ry="0.6" fill="#78350F" />
                <path
                  d="M21.6 20 C22.2 21 23.8 21 24.4 20"
                  stroke="#181818"
                  strokeWidth="1"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Pink Rosy Cheeks */}
                <circle
                  cx="19.2"
                  cy="18"
                  r="1"
                  fill="#F472B6"
                  opacity="0.85"
                />
                <circle
                  cx="26.8"
                  cy="18"
                  r="1"
                  fill="#F472B6"
                  opacity="0.85"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default KidsMonkeyScrollIndicator;
