"use client";

import { useRevealOnScroll, RevealOptions } from "./useRevealOnScroll";

export interface StaggerRevealOptions extends RevealOptions {
  index?: number;
  staggerMs?: number; // default 60ms increments
}

/**
 * Hook for progressive staggered entry.
 * Calculates staggered transition delay based on index (0ms, 60ms, 120ms, 180ms...).
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  options: StaggerRevealOptions = {}
) {
  const { index = 0, staggerMs = 60, ...revealOptions } = options;
  const calculatedDelay = (revealOptions.delay || 0) + index * staggerMs;

  const { ref, isVisible, reducedMotion } = useRevealOnScroll<T>({
    ...revealOptions,
    delay: calculatedDelay,
  });

  const style: React.CSSProperties = reducedMotion
    ? {}
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 16px, 0)",
        transition: `opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)`,
        transitionDelay: `${calculatedDelay}ms`,
        willChange: "opacity, transform",
      };

  return { ref, isVisible, style, delay: calculatedDelay, reducedMotion };
}
