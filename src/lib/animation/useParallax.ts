"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./useScrollProgress";

export interface ParallaxOptions {
  speed?: number; // Recommended -0.1 to 0.1 for luxury restraint
  maxOffset?: number; // Max px offset to strictly clamp movement (e.g. 30px)
  direction?: "up" | "down";
}

/**
 * Hook for subtle editorial parallax.
 * Strictly clamps offset to maintain visual grounding and avoid unnatural floating.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {}
) {
  const { speed = 0.05, maxOffset = 30, direction = "up" } = options;
  const ref = useRef<T | null>(null);
  const [offsetY, setOffsetY] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") {
      setOffsetY(0);
      return;
    }

    let rafId: number | null = null;

    const calculate = () => {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const winHeight = window.innerHeight;

      // Calculate when element is in or near viewport
      if (rect.bottom >= -100 && rect.top <= winHeight + 100) {
        const center = rect.top + rect.height / 2;
        const distFromCenter = center - winHeight / 2;
        const dirMultiplier = direction === "up" ? -1 : 1;
        const rawOffset = distFromCenter * speed * dirMultiplier;
        const clamped = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
        setOffsetY(Math.round(clamped * 10) / 10);
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        calculate();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    calculate();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [speed, maxOffset, direction, reducedMotion]);

  return {
    ref,
    offsetY,
    transform: reducedMotion ? "none" : `translate3d(0, ${offsetY}px, 0)`,
    reducedMotion,
  };
}
