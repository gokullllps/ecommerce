"use client";
import { useEffect, useState } from "react";

/** Reads prefers-reduced-motion and returns motion preferences + shared timing */
export function useKidsMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return {
    reducedMotion,
    /** Durations in ms */
    timing: {
      tabExit: reducedMotion ? 0 : 180,
      tabEnter: reducedMotion ? 0 : 280,
      reveal: reducedMotion ? 0 : 380,
      heartPop: reducedMotion ? 0 : 420,
      flyToBag: reducedMotion ? 0 : 650,
      starPop: reducedMotion ? 0 : 380,
    },
  };
}
