"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";
import { useSiteTheme } from "@/context/ThemeContext";

export const TOTAL_STARS = 10;
export const DISCOUNT_CODE = "KIDS10";
export const STORAGE_KEY = "pablo-kids-hidden-stars-v2";

export interface StarAssignment {
  id: string; // "star-01" ... "star-10"
  zone: string;
  anchorId: string;
}

export interface HiddenStarsGameState {
  version: 2;
  cycleId: string;
  stars: StarAssignment[];
  collected: string[];
}

export interface StarZoneConfig {
  id: string;
  name: string;
  candidateAnchors: string[];
}

/**
 * 10 Distinct Geographic Zones across the Kids Experience:
 * Exactly 1 candidate anchor is randomly selected per zone per cycle,
 * creating 20,000+ unique, non-overlapping layouts across users.
 */
export const STAR_ZONES: StarZoneConfig[] = [
  {
    id: "zone-01-hero-sky",
    name: "Hero Sky Atmosphere",
    candidateAnchors: [
      "slot-a-cloud-left-tuck",
      "slot-a-cloud-right-rim",
      "slot-a-sky-star-cluster",
    ],
  },
  {
    id: "zone-02-hero-doodle",
    name: "Hero Model & Doodles",
    candidateAnchors: [
      "slot-b-badge-under",
      "slot-b-sneaker-trail",
      "slot-b-badge-play-ready",
    ],
  },
  {
    id: "zone-03-hero-cta",
    name: "Hero Interactive CTA & Headlines",
    candidateAnchors: [
      "slot-b-explore-btn",
      "slot-b-headline-period",
      "slot-b-sticker-cloud-soft",
    ],
  },
  {
    id: "zone-04-category-nav",
    name: "Category & Tab Bar",
    candidateAnchors: [
      "slot-c-badge-tuck",
      "slot-c-bar-left-rim",
      "slot-c-bar-right-rim",
    ],
  },
  {
    id: "zone-05-controls",
    name: "Catalogue Controls & Filters",
    candidateAnchors: [
      "slot-d-ctrl-left",
      "slot-d-filter-btn",
      "slot-d-ctrl-right",
    ],
  },
  {
    id: "zone-06-grid-upper",
    name: "Upper Product Grid Whitespace",
    candidateAnchors: [
      "slot-e-grid-top-gutter",
      "slot-e-left-flank",
    ],
  },
  {
    id: "zone-07-grid-mid",
    name: "Middle Product Grid Margins",
    candidateAnchors: [
      "slot-e-right-flank",
      "slot-e-grid-mid-gutter",
    ],
  },
  {
    id: "zone-08-ambient",
    name: "Lower Ambient Atmosphere",
    candidateAnchors: [
      "slot-f-ambient-mint",
      "slot-f-ambient-lavender",
    ],
  },
  {
    id: "zone-09-grid-lower",
    name: "Grid Lower Edge",
    candidateAnchors: [
      "slot-f-grid-bottom-edge",
      "slot-f-grid-bottom-left",
    ],
  },
  {
    id: "zone-10-footer",
    name: "Footer Brand Boundaries",
    candidateAnchors: [
      "slot-g-footer-border-left",
      "slot-g-footer-border-right",
      "slot-g-footer-wordmark",
    ],
  },
];

/** Generate a brand-new randomized cycle ensuring unique layout */
export function generateNewCycle(previousState?: HiddenStarsGameState): HiddenStarsGameState {
  const cycleId = `cycle-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  
  const stars: StarAssignment[] = STAR_ZONES.map((zone, index) => {
    const starNumber = String(index + 1).padStart(2, "0");
    const id = `star-${starNumber}`;
    
    // If regenerating after a cycle, prefer a different anchor than previous cycle
    const prevAnchor = previousState?.stars.find((s) => s.id === id)?.anchorId;
    let pool = zone.candidateAnchors;
    if (prevAnchor && pool.length > 1) {
      pool = pool.filter((a) => a !== prevAnchor);
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    const anchorId = pool[randomIndex];

    return {
      id,
      zone: zone.id,
      anchorId,
    };
  });

  return {
    version: 2,
    cycleId,
    stars,
    collected: [],
  };
}

/** Validate structure against corruption */
export function isValidGameState(state: unknown): state is HiddenStarsGameState {
  if (!state || typeof state !== "object") return false;
  const s = state as Partial<HiddenStarsGameState>;
  if (s.version !== 2) return false;
  if (typeof s.cycleId !== "string" || !s.cycleId) return false;
  if (!Array.isArray(s.stars) || s.stars.length !== TOTAL_STARS) return false;
  if (!Array.isArray(s.collected)) return false;

  const validAnchors = new Set<string>();
  STAR_ZONES.forEach((zone) => {
    zone.candidateAnchors.forEach((a) => validAnchors.add(a));
  });

  const validIds = new Set<string>();
  for (let i = 0; i < s.stars.length; i++) {
    const star = s.stars[i];
    if (!star || typeof star !== "object") return false;
    const expectedId = `star-${String(i + 1).padStart(2, "0")}`;
    if (star.id !== expectedId) return false;
    if (typeof star.zone !== "string" || !star.zone) return false;
    if (typeof star.anchorId !== "string" || !validAnchors.has(star.anchorId)) return false;
    if (validIds.has(star.id)) return false;
    validIds.add(star.id);
  }

  for (const collectedId of s.collected) {
    if (typeof collectedId !== "string" || !validIds.has(collectedId)) {
      return false;
    }
  }

  return true;
}

/** Load state safely from localStorage or generate fresh */
function loadPersistedState(): HiddenStarsGameState {
  if (typeof window === "undefined") {
    return generateNewCycle();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidGameState(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[PABLO Kids] Failed to load saved star state, resetting cycle:", err);
  }

  // Not present or invalid -> generate fresh arrangement and save
  const fresh = generateNewCycle();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {}
  return fresh;
}

function persistStateToStorage(state: HiddenStarsGameState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("[PABLO Kids] Failed to persist star state:", err);
  }
}

export interface HiddenStarsContextType {
  stars: StarAssignment[];
  collectedStars: string[];
  foundCount: number;
  totalStars: number;
  progress: { found: number; total: number; percent: number };
  isComplete: boolean;
  allFound: boolean;
  isSlotActive: (anchorId: string) => boolean;
  getStarForAnchor: (anchorId: string) => StarAssignment | undefined;
  collectStar: (identifier: string) => boolean;
  generateNextCycle: () => void;
  resetHunt: () => void;
  mounted: boolean;
  activeSlots: string[];
  cycleId: string;
}

const HiddenStarsContext = createContext<HiddenStarsContextType | undefined>(undefined);

export function HiddenStarsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isKids: isSiteKids } = useSiteTheme();
  const isKidsRoute = isSiteKids || Boolean(pathname?.startsWith("/kids"));

  const [mounted, setMounted] = useState<boolean>(false);
  const [gameState, setGameState] = useState<HiddenStarsGameState | null>(null);

  // Initialize once on client mount to guarantee hydration safety
  useEffect(() => {
    setMounted(true);
    const initial = loadPersistedState();
    setGameState(initial);
  }, []);

  const stars = useMemo(() => gameState?.stars || [], [gameState]);
  const collectedStars = useMemo(() => gameState?.collected || [], [gameState]);
  const foundCount = collectedStars.length;
  const isComplete = foundCount >= TOTAL_STARS;
  const cycleId = gameState?.cycleId || "";

  const activeSlots = useMemo(() => {
    return stars.map((s) => s.anchorId);
  }, [stars]);

  const progress = useMemo(() => ({
    found: foundCount,
    total: TOTAL_STARS,
    percent: Math.min(100, Math.round((foundCount / TOTAL_STARS) * 100)),
  }), [foundCount]);

  // Check if an anchor slot has an active, uncollected star
  const isSlotActive = useCallback(
    (anchorId: string): boolean => {
      if (!isKidsRoute || !gameState) return false;
      const star = gameState.stars.find((s) => s.anchorId === anchorId);
      if (!star) return false;
      return !gameState.collected.includes(star.id);
    },
    [isKidsRoute, gameState]
  );

  const getStarForAnchor = useCallback(
    (anchorId: string): StarAssignment | undefined => {
      if (!gameState) return undefined;
      return gameState.stars.find((s) => s.anchorId === anchorId);
    },
    [gameState]
  );

  // Collect a star by star ID or anchor slot ID
  const collectStar = useCallback(
    (identifier: string): boolean => {
      let collected = false;
      setGameState((prev) => {
        if (!prev) return prev;

        // Find star by id ("star-01") or anchor ("slot-a-cloud-left-tuck")
        let targetStar = prev.stars.find((s) => s.id === identifier);
        if (!targetStar) {
          targetStar = prev.stars.find((s) => s.anchorId === identifier);
        }

        if (!targetStar) return prev;

        // Prevent duplicate collection: do nothing if already collected
        if (prev.collected.includes(targetStar.id)) {
          return prev;
        }

        const nextCollected = [...prev.collected, targetStar.id];
        const nextState: HiddenStarsGameState = {
          ...prev,
          collected: nextCollected,
        };

        persistStateToStorage(nextState);
        collected = true;
        return nextState;
      });
      return collected;
    },
    []
  );

  // Advance to next cycle with a new randomized arrangement
  const generateNextCycle = useCallback(() => {
    setGameState((prev) => {
      const fresh = generateNewCycle(prev || undefined);
      persistStateToStorage(fresh);
      return fresh;
    });
  }, []);

  const value = useMemo<HiddenStarsContextType>(
    () => ({
      stars,
      collectedStars,
      foundCount,
      totalStars: TOTAL_STARS,
      progress,
      isComplete,
      allFound: isComplete,
      isSlotActive,
      getStarForAnchor,
      collectStar,
      generateNextCycle,
      resetHunt: generateNextCycle,
      mounted,
      activeSlots,
      cycleId,
    }),
    [
      stars,
      collectedStars,
      foundCount,
      progress,
      isComplete,
      isSlotActive,
      getStarForAnchor,
      collectStar,
      generateNextCycle,
      mounted,
      activeSlots,
      cycleId,
    ]
  );

  if (!isKidsRoute) {
    return <>{children}</>;
  }

  return (
    <HiddenStarsContext.Provider value={value}>
      {children}
    </HiddenStarsContext.Provider>
  );
}

export function useKidsHiddenStars() {
  const ctx = useContext(HiddenStarsContext);
  if (!ctx) {
    return {
      stars: [],
      collectedStars: [],
      foundCount: 0,
      totalStars: TOTAL_STARS,
      progress: { found: 0, total: TOTAL_STARS, percent: 0 },
      isComplete: false,
      allFound: false,
      isSlotActive: () => false,
      getStarForAnchor: () => undefined,
      collectStar: () => false,
      generateNextCycle: () => {},
      resetHunt: () => {},
      mounted: false,
      activeSlots: [],
      cycleId: "",
    };
  }
  return ctx;
}

export default HiddenStarsProvider;
