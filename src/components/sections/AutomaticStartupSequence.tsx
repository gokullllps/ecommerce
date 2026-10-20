"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewInSection } from "@/components/sections/NewInSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedCollectionSection } from "@/components/sections/FeaturedCollectionSection";
import { NewArrivalsSection } from "@/components/sections/NewArrivalsSection";
import { BestsellersSection } from "@/components/sections/BestsellersSection";
import { CampaignEditorialSection } from "@/components/sections/CampaignEditorialSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const INTRO_COMPLETED_KEY = "pablo-intro-completed";

function subscribeIntro(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("pablo-intro-update", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("pablo-intro-update", callback);
  };
}

function getIntroCompletedSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INTRO_COMPLETED_KEY) === "true";
  } catch {
    return false;
  }
}

function getIntroCompletedServerSnapshot(): boolean {
  return false;
}

export function AutomaticStartupSequence() {
  const startupRef = useRef<HTMLElement>(null);
  const blackRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const [isRevealed, setIsRevealed] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [hasFinishedAnimation, setHasFinishedAnimation] = useState(false);

  // Read intro completion state from browser session storage via React recommended external store pattern
  const isIntroCompleted = useSyncExternalStore(
    subscribeIntro,
    getIntroCompletedSnapshot,
    getIntroCompletedServerSnapshot
  );

  const showIntro = !isIntroCompleted && !hasFinishedAnimation;

  // Lightweight initial rendering guard state: keeps screen covered by intro background before intro state resolves
  const [isIntroStateResolved, setIsIntroStateResolved] = useState(false);

  useEffect(() => {
    setIsIntroStateResolved(true);
  }, []);

  // Developer console helper to easily clear flag and test first-open experience
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { __pabloResetIntro?: () => void }).__pabloResetIntro = () => {
        try {
          sessionStorage.removeItem(INTRO_COMPLETED_KEY);
          window.location.reload();
        } catch {}
      };
    }
  }, []);

  // Track and persist scroll position when browsing normally so refresh stays at current position
  useEffect(() => {
    const handleScroll = () => {
      try {
        if (sessionStorage.getItem(INTRO_COMPLETED_KEY) === "true") {
          sessionStorage.setItem("pablo-scroll-y", window.scrollY.toString());
        }
      } catch {}
    };

    const handleBeforeUnload = () => {
      try {
        if (sessionStorage.getItem(INTRO_COMPLETED_KEY) === "true") {
          sessionStorage.setItem("pablo-scroll-y", window.scrollY.toString());
        }
      } catch {}
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Restore scroll position on reload if intro has already completed
  useEffect(() => {
    // Disable browser default conflicting scroll restoration
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const timers: NodeJS.Timeout[] = [];

    try {
      if (sessionStorage.getItem(INTRO_COMPLETED_KEY) === "true") {
        const saved = sessionStorage.getItem("pablo-scroll-y");
        if (saved) {
          const y = parseInt(saved, 10);
          if (!isNaN(y) && y > 0) {
            const restore = () => {
              window.scrollTo({ top: y, behavior: "instant" });
            };
            restore();
            requestAnimationFrame(restore);
            timers.push(setTimeout(restore, 40));
            timers.push(setTimeout(restore, 120));
            timers.push(setTimeout(restore, 300));
          }
        }
      }
    } catch {}

    return () => {
      timers.forEach(clearTimeout);
      if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  // Main intro animation sequence: executes ONLY on fresh session when intro has not run
  useEffect(() => {
    // Check sessionStorage directly — if intro was already completed, NEVER scroll to top or run intro!
    try {
      if (sessionStorage.getItem(INTRO_COMPLETED_KEY) === "true") {
        return;
      }
    } catch {}

    if (!showIntro || isIntroCompleted) return;

    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    // Lock user scroll during the opening sequence so the transition is uninterrupted
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventKeyScroll = (e: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "Space", "PageDown", "PageUp", "Home", "End"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyScroll, { passive: false });

    let isUnlocked = false;
    const unlockScroll = () => {
      if (isUnlocked) return;
      isUnlocked = true;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyScroll);
      if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };

    // Step 1: PABLO logo subtle fade-in & scale reveal (~400ms)
    const revealTimer = setTimeout(() => {
      setIsRevealed(true);
    }, 50);

    // Step 2: After brisk reveal (400ms) + brief hold (250ms) = 650ms,
    // initiate smooth, slow, cinematic upward slide of the connected white & black layers (2.5s duration)
    const slideTimer = setTimeout(() => {
      setIsSliding(true);
    }, 650);

    // Step 3: Transition finishes at 650ms + 2500ms = 3150ms:
    // intro unmounts cleanly, scroll unlocks, and homepage is fully interactive
    const completeTimer = setTimeout(() => {
      unlockScroll();
      try {
        sessionStorage.setItem(INTRO_COMPLETED_KEY, "true");
      } catch {}
      setHasFinishedAnimation(true);
      window.dispatchEvent(new Event("pablo-intro-update"));
    }, 3150);

    // Safety fallback timer: guarantee intro completes after sequence duration
    const safetyTimer = setTimeout(() => {
      unlockScroll();
      try {
        sessionStorage.setItem(INTRO_COMPLETED_KEY, "true");
      } catch {}
      setHasFinishedAnimation(true);
      window.dispatchEvent(new Event("pablo-intro-update"));
    }, 3800);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(slideTimer);
      clearTimeout(completeTimer);
      clearTimeout(safetyTimer);
      unlockScroll();
    };
  }, [showIntro, isIntroCompleted]);

  return (
    /*
      ── FOOTER REVEAL: EXACT ARCHITECTURE THE USER REQUESTED ──────────────────

      DOM STRUCTURE:
        .page-wrapper  (flex-direction: column-reverse)
          ├─ .footer-layer  ← FIRST in DOM (sits behind, z-index: 0)
          └─ .main-content  ← SECOND in DOM (on top, z-index: 1)

      HOW column-reverse WORKS:
        • flex-direction: column-reverse reverses the visual stack order.
        • Footer (first in DOM) renders visually at the BOTTOM of the page.
        • Main content (second in DOM) renders visually at the TOP.
        • This is the "footer behind the page" effect — pure CSS, no JS.

      HOW THE REVEAL WORKS:
        • footer: position sticky; bottom: 0; z-index: 0
           → Always at viewport bottom, behind main content.
        • main-content: position relative; z-index: 1; background: #EAE8E1
           → Solid background covers the footer while content is visible.
        • At the very bottom of the page: main content ends, retreats upward,
           and the footer is gradually revealed from underneath.
        • Scrolling upward hides the footer again naturally.

      STACKING ORDER:
        z-index: 50  Navbar   (sticky top-0, inside main-content)
        z-index:  1  Main content (solid #EAE8E1, covers footer)
        z-index:  0  Footer   (sticky bottom-0, behind main content)
      ────────────────────────────────────────────────────────────────────
    */
    <div
      className="w-full"
      style={{
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      {/*
        ══ FOOTER LAYER: FIRST IN DOM ════════════════════════════
        Because of flex-direction: column-reverse, this renders at the
        VISUAL BOTTOM of the page. The footer sits "behind" the main
        content layer. It is only revealed when the user scrolls to the
        very end and the main content retreats upward.
        ══════════════════════════════════════════════════
      */}
      <Footer />

      {/*
        ══ MAIN CONTENT: SECOND IN DOM ═══════════════════════════
        Because of column-reverse, this renders at the VISUAL TOP.
        z-index: 1 + solid #EAE8E1 background keeps the footer hidden
        behind this layer while the user scrolls through the page.
        ══════════════════════════════════════════════════
      */}
      <div
        className="w-full bg-[#EAE8E1]"
        style={{ position: "relative", zIndex: 1, backgroundColor: "#EAE8E1" }}
      >
        {/* Lightweight initial paint guard: keeps page covered by intro background before intro state is resolved */}
        {showIntro && !isIntroStateResolved && (
          <div
            id="pablo-intro-guard"
            aria-hidden="true"
            className="fixed inset-0 z-[99999] pointer-events-none bg-[#EAE8E1]"
            style={{ backgroundColor: "#EAE8E1" }}
          />
        )}

        {/* 
          ONE-TIME INTRO ENTRY SEQUENCE:
          Rendered on initial page load in a clean browser session.
          Contains Section 1 (Startup) and Section 2 (Black Transition).
          Both layers move UPWARD TOGETHER as one connected transition.
          Once the transition completes, the intro is unmounted from the DOM.
        */}
        {showIntro && (
          <div
            id="pablo-intro-container"
            aria-hidden={isSliding}
            className="fixed inset-x-0 top-0 z-[9990] w-full pointer-events-none select-none flex flex-col"
            style={{
              transform: isSliding ? "translate3d(0, -100%, 0)" : "translate3d(0, 0, 0)",
              transition: isSliding
                ? "transform 2500ms cubic-bezier(0.76, 0, 0.24, 1)"
                : "none",
              willChange: "transform",
            }}
          >
            {/* 1. PABLO STARTUP SCREEN (100vh, #EAE8E1) */}
            <section
              ref={startupRef}
              id="pablo-startup-sequence"
              aria-label="PABLO Brand Startup"
              className="h-screen sm:h-[100svh] w-full shrink-0 flex items-center justify-center bg-[#EAE8E1] select-none relative"
              style={{ backgroundColor: "#EAE8E1" }}
            >
              <div className="flex flex-col items-center justify-center -translate-y-[1.5vh] px-6">
                <Image
                  src="/images/pablo-logo.webp"
                  alt="PABLO — Luxury Fashion"
                  priority
                  unoptimized
                  width={566}
                  height={156}
                  className={`w-[260px] sm:w-[360px] md:w-[460px] lg:w-[540px] max-w-[85vw] h-auto object-contain select-none transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
                  }`}
                />
              </div>
            </section>

            {/* 2. BLACK TRANSITION SECTION (#181818) */}
            <section
              ref={blackRef}
              id="pablo-black-transition"
              aria-hidden="true"
              className="h-20 sm:h-24 w-full shrink-0 bg-[#181818] select-none relative flex items-center justify-center"
              style={{ backgroundColor: "#181818" }}
            />
          </div>
        )}

        {/* ONE STABLE STICKY HEADER CONTAINER (Navbar + MegaMenu) */}
        <Navbar isIntroActive={showIntro && !isSliding} isHeroOverlay={true} />

        {/* 3. HERO SECTION */}
        <div ref={heroRef} className="w-full relative">
          <HeroSection isIntroActive={showIntro} />
        </div>

        {/* 4. NEW IN */}
        <NewInSection />

        {/* 5. CATEGORIES */}
        <CategoriesSection />

        {/* 6. FEATURED COLLECTION */}
        <FeaturedCollectionSection />

        {/* 7. NEW ARRIVALS */}
        <NewArrivalsSection />

        {/* 8. BESTSELLERS */}
        <BestsellersSection />

        {/* 9. EDITORIAL / CAMPAIGN */}
        <CampaignEditorialSection />

        {/* 10. NEWSLETTER */}
        <NewsletterSection />
      </div>

    </div>
  );
}
