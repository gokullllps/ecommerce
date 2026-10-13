"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./useScrollProgress";

export interface PageEntryState {
  stage: 0 | 1 | 2 | 3 | 4 | 5;
  hasStarted: boolean;
  isComplete: boolean;
  reducedMotion: boolean;
}

/**
 * Hook orchestrating the luxury page entry choreography.
 * Staggered reveals:
 * Stage 0: Initial softened state
 * Stage 1: Background & visual resolving (0ms)
 * Stage 2: Hero typography resolves (100ms)
 * Stage 3: Model / central visual enters with subtle vertical + scale (250ms)
 * Stage 4: Supporting text & metadata follow (450ms)
 * Stage 5: CTAs & navigation follow (600ms)
 */
export function usePageEntry(initialDelay: number = 50): PageEntryState {
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4 | 5>(reducedMotion ? 5 : 0);
  const [isComplete, setIsComplete] = useState<boolean>(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setStage(5);
      setIsComplete(true);
      return;
    }

    const t1 = setTimeout(() => setStage(1), initialDelay);
    const t2 = setTimeout(() => setStage(2), initialDelay + 100);
    const t3 = setTimeout(() => setStage(3), initialDelay + 250);
    const t4 = setTimeout(() => setStage(4), initialDelay + 450);
    const t5 = setTimeout(() => {
      setStage(5);
      setIsComplete(true);
    }, initialDelay + 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [initialDelay, reducedMotion]);

  return {
    stage,
    hasStarted: stage >= 1,
    isComplete,
    reducedMotion,
  };
}
