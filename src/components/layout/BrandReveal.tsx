"use client";

import { useEffect, useState, useCallback } from "react";

type AnimationPhase =
  | "enter"
  | "reveal"
  | "hold"
  | "black_transition"
  | "black_hold"
  | "hero_reveal"
  | "complete";

export function BrandReveal() {
  const [phase, setPhase] = useState<AnimationPhase>("enter");

  const handleForward = useCallback(() => {
    setPhase((current) => (current === "black_hold" ? "hero_reveal" : current));
  }, []);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = mediaQuery.matches;

    if (prefersReducedMotion) {
      // Streamlined minimal sequence for reduced-motion users
      const r1 = setTimeout(() => setPhase("reveal"), 50);
      const r2 = setTimeout(() => setPhase("black_hold"), 600);
      const r3 = setTimeout(() => setPhase("hero_reveal"), 1000);
      const r4 = setTimeout(() => setPhase("complete"), 1350);

      return () => {
        clearTimeout(r1);
        clearTimeout(r2);
        clearTimeout(r3);
        clearTimeout(r4);
      };
    }

    // Standard cinematic sequence:
    // 1. PABLO Intro (#EAE8E1) — exactly as approved
    const revealTimer = setTimeout(() => {
      setPhase("reveal");
    }, 100);

    const holdTimer = setTimeout(() => {
      setPhase("hold");
    }, 950);

    // 2. Black Transition (#181818)
    const blackTransitionTimer = setTimeout(() => {
      setPhase("black_transition");
    }, 1550);

    const blackHoldTimer = setTimeout(() => {
      setPhase("black_hold");
    }, 2050);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(holdTimer);
      clearTimeout(blackTransitionTimer);
      clearTimeout(blackHoldTimer);
    };
  }, []);

  // Listen for natural user movement/scroll during black_hold phase
  useEffect(() => {
    if (phase !== "black_hold") return;

    // Natural forward movement triggers (wheel, touch, keys) with ZERO scroll lock
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 5) {
        handleForward();
      }
    };

    const onTouchMove = () => {
      handleForward();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "Space", "Enter"].includes(e.key)) {
        handleForward();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown, { passive: true });

    // Automatic progression if user pauses without scrolling
    const holdAutoTimer = setTimeout(() => {
      handleForward();
    }, 1000);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(holdAutoTimer);
    };
  }, [phase, handleForward]);

  // Clean transition to complete when hero reveal begins
  useEffect(() => {
    if (phase !== "hero_reveal") return;

    const completeTimer = setTimeout(() => {
      setPhase("complete");
    }, 850);

    return () => clearTimeout(completeTimer);
  }, [phase]);

  if (phase === "complete") {
    return null;
  }

  const isWordmarkVisible = phase === "reveal" || phase === "hold";
  const isBlackPhase =
    phase === "black_transition" ||
    phase === "black_hold" ||
    phase === "hero_reveal";
  const isHeroRevealing = phase === "hero_reveal";

  return (
    <aside
      aria-hidden={isHeroRevealing}
      aria-live="polite"
      aria-label="PABLO brand introduction and hero transition"
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-opacity ${
        isHeroRevealing
          ? "opacity-0 -translate-y-3 pointer-events-none duration-[800ms]"
          : "opacity-100"
      }`}
      style={{
        backgroundColor: isBlackPhase ? "#181818" : "#EAE8E1",
        transitionProperty: "background-color, opacity, transform",
      }}
    >
      {/* PABLO Wordmark: Centered, fades out cleanly as black transition takes over */}
      <div className="flex flex-col items-center justify-center -translate-y-[1.5vh] select-none">
        <span
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#111111] transition-all ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-opacity ${
            isWordmarkVisible
              ? "opacity-100 tracking-[0.3em] duration-[850ms]"
              : "opacity-0 tracking-[0.18em] duration-[400ms]"
          }`}
          style={{
            fontFamily: "var(--font-display, serif)",
            color: "#111111",
          }}
        >
          PABLO
        </span>
      </div>
    </aside>
  );
}

