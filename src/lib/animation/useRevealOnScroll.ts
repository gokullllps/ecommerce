"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./useScrollProgress";

export interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  once?: boolean;
}

/**
 * Hook to trigger element reveals upon entering the viewport via IntersectionObserver.
 * GPU-friendly, fires once by default, respects prefers-reduced-motion.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
) {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -50px 0px",
    delay = 0,
    once = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    let timer: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              timer = setTimeout(() => {
                setIsVisible(true);
              }, delay);
            } else {
              setIsVisible(true);
            }

            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            if (timer) clearTimeout(timer);
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [threshold, rootMargin, delay, once, reducedMotion]);

  return { ref, isVisible, reducedMotion };
}
