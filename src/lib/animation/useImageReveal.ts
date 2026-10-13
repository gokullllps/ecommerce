"use client";

import { useRevealOnScroll, RevealOptions } from "./useRevealOnScroll";

export interface ImageRevealOptions extends RevealOptions {
  duration?: number;
  easing?: string;
  initialScale?: number;
  initialTranslateY?: number;
}

/**
 * Hook for cinematic image mask reveal.
 * As the image enters the viewport:
 * Container unmasks with clip-path: inset(8% 0 8% 0) -> inset(0)
 * Image scales down from 1.08 -> 1.00 and translateY 20px -> 0.
 */
export function useImageReveal<T extends HTMLElement = HTMLDivElement>(
  options: ImageRevealOptions = {}
) {
  const {
    duration = 900,
    easing = "cubic-bezier(0.22, 1, 0.36, 1)",
    initialScale = 1.08,
    initialTranslateY = 20,
    ...revealOptions
  } = options;

  const { ref, isVisible, reducedMotion } = useRevealOnScroll<T>(revealOptions);

  const containerStyle: React.CSSProperties = reducedMotion
    ? {}
    : {
        clipPath: isVisible ? "inset(0% 0% 0% 0%)" : "inset(8% 0% 8% 0%)",
        opacity: isVisible ? 1 : 0,
        transition: `clip-path ${duration}ms ${easing}, opacity ${duration * 0.7}ms ease-out`,
        willChange: "clip-path, opacity",
      };

  const imageStyle: React.CSSProperties = reducedMotion
    ? {}
    : {
        transform: isVisible
          ? "scale(1) translate3d(0, 0, 0)"
          : `scale(${initialScale}) translate3d(0, ${initialTranslateY}px, 0)`,
        transition: `transform ${duration * 1.1}ms ${easing}`,
        willChange: "transform",
      };

  return {
    ref,
    isVisible,
    containerStyle,
    imageStyle,
    reducedMotion,
  };
}
