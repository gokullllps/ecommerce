"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import "./PageTransition.css";

export type TransitionPhase = "idle" | "collapsing" | "midpoint" | "expanding";

export interface PageTransitionContextValue {
  isTransitioning: boolean;
  phase: TransitionPhase;
  targetUrl: string | null;
  navigate: (url: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  isTransitioning: false,
  phase: "idle",
  targetUrl: null,
  navigate: () => {},
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

/**
 * Determine brand-consistent luxury background color for any route
 */
export function getRouteBackgroundColor(pathname: string): string {
  if (pathname.startsWith("/kids")) {
    return "#EBF4FA"; // Official PABLO Kids background
  }
  return "#EAE8E1"; // Official PABLO standard editorial background
}

/**
 * Check if a given route is a product detail route (/product/[slug] or /product/*)
 */
export function isProductDetailRoute(pathname?: string | null): boolean {
  if (!pathname) return false;
  const clean = pathname.split("?")[0].split("#")[0];
  return clean === "/product" || clean.startsWith("/product/");
}

interface PageTransitionProps {
  children: React.ReactNode;
}

const EXIT_DURATION_MS = 950;
const ENTER_DURATION_MS = 950;

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [currentBg, setCurrentBg] = useState<string>(() =>
    getRouteBackgroundColor(typeof window !== "undefined" ? window.location.pathname : "/")
  );
  const [destBg, setDestBg] = useState<string>(() =>
    getRouteBackgroundColor(typeof window !== "undefined" ? window.location.pathname : "/")
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const phaseRef = useRef<TransitionPhase>("idle");
  phaseRef.current = phase;

  const isTransitioningRef = useRef(false);
  isTransitioningRef.current = phase !== "idle";

  const targetUrlRef = useRef<string | null>(null);
  const isInitialMountRef = useRef(true);
  const prevPathnameRef = useRef(pathname);

  // Timers
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const expandTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const midpointFallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset all state to idle safely
  const resetToIdle = useCallback(() => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    if (midpointFallbackTimerRef.current) clearTimeout(midpointFallbackTimerRef.current);

    isTransitioningRef.current = false;
    targetUrlRef.current = null;
    setPhase("idle");

    if (contentRef.current) {
      contentRef.current.style.transform = "";
    }
  }, []);

  // Initiate transition sequence
  const startTransition = useCallback(
    (url: string) => {
      if (isTransitioningRef.current) return;

      // Honor prefers-reduced-motion
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        router.push(url);
        return;
      }

      isTransitioningRef.current = true;
      targetUrlRef.current = url;

      const currentPath = typeof window !== "undefined" ? window.location.pathname : pathname;

      // BYPASS: If current route or target route is a product detail route, navigate immediately without animation
      if (isProductDetailRoute(currentPath) || isProductDetailRoute(url)) {
        router.push(url);
        resetToIdle();
        return;
      }

      const curBg = getRouteBackgroundColor(currentPath);
      const targetBg = getRouteBackgroundColor(url);

      setCurrentBg(curBg);
      setDestBg(targetBg);
      setPhase("collapsing");

      // Freeze visual vertical scroll position during collapse to avoid jarring jump
      if (contentRef.current && typeof window !== "undefined") {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        contentRef.current.style.transform = `translateY(-${scrollY}px)`;
      }

      // Safety timer (screen will NEVER remain stuck under any circumstances)
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = setTimeout(() => {
        resetToIdle();
      }, 3500);

      // Collapsing phase duration
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = setTimeout(() => {
        setPhase("midpoint");

        // Clear inner transform & reset scroll to top before loading destination
        if (contentRef.current) {
          contentRef.current.style.transform = "";
        }
        if (typeof window !== "undefined") {
          window.scrollTo(0, 0);
        }

        // Push new route in Next.js router
        router.push(url);

        // Fallback in case route change detection is delayed
        if (midpointFallbackTimerRef.current) clearTimeout(midpointFallbackTimerRef.current);
        midpointFallbackTimerRef.current = setTimeout(() => {
          if (phaseRef.current === "midpoint") {
            setPhase("expanding");
            if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
            expandTimerRef.current = setTimeout(() => {
              resetToIdle();
            }, ENTER_DURATION_MS);
          }
        }, 900);
      }, EXIT_DURATION_MS);
    },
    [pathname, resetToIdle, router]
  );

  // Listen to Next.js route changes
  useEffect(() => {
    // Initial mount: Direct URL loads and refreshes render immediately without transition
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    if (prevPathnameRef.current !== pathname) {
      const prevPath = prevPathnameRef.current;
      prevPathnameRef.current = pathname;

      // BYPASS: If either previous or incoming route is a product detail route (/product/*),
      // completely bypass transition and ensure idle state
      if (isProductDetailRoute(prevPath) || isProductDetailRoute(pathname)) {
        resetToIdle();
        return;
      }

      if (isTransitioningRef.current) {
        // Controlled transition from link click: incoming route has mounted!
        if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
        if (midpointFallbackTimerRef.current) clearTimeout(midpointFallbackTimerRef.current);

        const newBg = getRouteBackgroundColor(pathname);
        setDestBg(newBg);
        setPhase("expanding");

        if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
        expandTimerRef.current = setTimeout(() => {
          resetToIdle();
        }, ENTER_DURATION_MS);
      } else {
        // Navigation without click event (e.g. Browser Back/Forward buttons)
        isTransitioningRef.current = true;
        const newBg = getRouteBackgroundColor(pathname);
        setDestBg(newBg);
        setPhase("expanding");

        if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
        expandTimerRef.current = setTimeout(() => {
          resetToIdle();
        }, ENTER_DURATION_MS);
      }
    }
  }, [pathname, resetToIdle]);

  // Centralized click interceptor for internal links
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // 1. If currently in transition, prevent double navigation
      if (isTransitioningRef.current) {
        const anchor = (e.target as Element)?.closest?.("a");
        if (anchor) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      // 2. Only intercept standard left clicks without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // 3. Find closest anchor tag
      const anchor = (e.target as Element)?.closest?.("a");
      if (!anchor) return;

      // 4. Do not intercept if click is inside an interactive control (button, input, select)
      const targetElement = e.target as Element;
      if (targetElement?.closest?.("button, input, select, textarea, [data-no-transition]")) {
        return;
      }

      // 5. Check if anchor explicitly opts out
      if (
        anchor.hasAttribute("data-no-transition") ||
        (anchor.target && anchor.target !== "_self") ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      // 6. Check href validity
      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      // 7. Verify origin (must be same origin internal link)
      if (anchor.origin !== window.location.origin) {
        return;
      }

      const targetPath = anchor.pathname;
      const targetSearch = anchor.search;
      const targetHash = anchor.hash;

      // 8. If destination is the same pathname (even with query params or hash),
      // do NOT trigger page transition. Same-page category filters and section scrolls must not animate.
      if (targetPath === window.location.pathname) {
        return;
      }

      // 9. Exclude admin and API routes (Requirement #6 & #9)
      if (targetPath.startsWith("/admin") || targetPath.startsWith("/api")) {
        return;
      }

      // 10. PRODUCT DETAIL ROUTE BYPASS:
      // If either current route or target route is a product detail route (/product/*),
      // bypass transition completely and let Next.js handle normal instant navigation.
      const currentPath = window.location.pathname;
      if (isProductDetailRoute(currentPath) || isProductDetailRoute(targetPath)) {
        return;
      }

      // 11. Valid internal customer route transition: intercept and run animation!
      e.preventDefault();
      e.stopPropagation();

      const fullTarget = `${targetPath}${targetSearch}${targetHash}`;
      startTransition(fullTarget);
    };

    // Attach in capture phase to catch link clicks before Next.js default click handlers
    document.addEventListener("click", handleGlobalClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
      if (expandTimerRef.current) clearTimeout(expandTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      if (midpointFallbackTimerRef.current) clearTimeout(midpointFallbackTimerRef.current);
    };
  }, [startTransition]);

  const isBackdropActive = phase === "collapsing" || phase === "midpoint" || phase === "expanding";

  const stageClassName = [
    "pablo-transition-stage",
    phase === "collapsing" ? "is-collapsing" : "",
    phase === "midpoint" ? "is-midpoint" : "",
    phase === "expanding" ? "is-expanding" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning: phase !== "idle",
        phase,
        targetUrl: targetUrlRef.current,
        navigate: startTransition,
      }}
    >
      {/* ── Dark Surface Backdrop revealed as page collapses ── */}
      <div
        className={`pablo-transition-backdrop ${isBackdropActive ? "is-active" : ""}`}
        aria-hidden="true"
      />

      {/* ── Main Transition Stage ── */}
      <div
        ref={containerRef}
        className={stageClassName}
        style={
          {
            "--pablo-current-bg": currentBg,
            "--pablo-dest-bg": destBg,
          } as React.CSSProperties
        }
      >
        <div ref={contentRef} className="pablo-transition-content">
          {children}
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}

export default PageTransition;
