"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * Hook to detect prefers-reduced-motion
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

/**
 * Reusable luxury scroll progress hook.
 * Uses requestAnimationFrame with passive scroll listener.
 * Returns scroll progress between 0 and 1, either for a specific container ref or window.
 */
export function useScrollProgress(targetRef?: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId: number | null = null;

    const updateScroll = () => {
      const currentY = window.scrollY || window.pageYOffset;
      setScrollY(currentY);

      if (targetRef && targetRef.current) {
        const el = targetRef.current;
        const rect = el.getBoundingClientRect();
        const elHeight = el.offsetHeight;
        const winHeight = window.innerHeight;

        // Progress 0 when element top reaches bottom of viewport,
        // 1 when element bottom leaves top of viewport
        const totalDistance = elHeight + winHeight;
        const currentDistance = winHeight - rect.top;
        const p = Math.min(Math.max(currentDistance / totalDistance, 0), 1);
        setProgress(p);
      } else {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const p = docHeight > 0 ? Math.min(Math.max(currentY / docHeight, 0), 1) : 0;
        setProgress(p);
      }
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateScroll();
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [targetRef, reducedMotion]);

  return { progress, scrollY, reducedMotion };
}
