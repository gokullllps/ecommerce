"use client";
import { useEffect, useRef, useState } from "react";

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Returns a ref to attach to a DOM element and a boolean `revealed`.
 * Uses IntersectionObserver — fires once by default.
 */
export function useKidsReveal<T extends HTMLElement = HTMLDivElement>(
  opts: RevealOptions = {}
) {
  const { threshold = 0.12, rootMargin = "0px 0px -40px 0px", once = true } = opts;
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, revealed };
}
