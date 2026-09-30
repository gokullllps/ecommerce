"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Product } from "@/types/catalogue";
import { CatalogueContext, DepartmentId } from "@/types/filters";
import { useProductFilters } from "./filters/useProductFilters";
import { ProductFilters } from "./ProductFilters";
import { AppliedFilters } from "./filters/AppliedFilters";
import { ProductSort } from "./ProductSort";
import { ProductGrid } from "./ProductGrid";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import KidsCategorySection from "@/components/sections/KidsCategorySection";
import { DoodleStar } from "@/components/kids/KidsDoodles";
import { HiddenStar } from "@/components/kids/games/HiddenStar";
import { HiddenStarsProvider } from "@/components/kids/games/HiddenStarsContext";
import { KidsStarProgress } from "@/components/kids/games/KidsStarProgress";
import { KidsMonkeyScrollIndicator } from "@/components/kids/animations/KidsMonkeyScrollIndicator";
import { useSiteTheme } from "@/context/ThemeContext";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface CataloguePageClientProps {
  gender: "men" | "women" | "kids" | "sale" | "all" | "new-in";
  title: string;
  subtitle: string;
  products: Product[];
  currentDepartment?: DepartmentId;
  defaultCategory?: string;
  defaultSubtype?: string;
  breadcrumbs?: BreadcrumbItem[];
  isSalePage?: boolean;
  isNewInPage?: boolean;
  collectionSlug?: string;
  heroSlot?: React.ReactNode;
}

function CatalogueContent({
  gender,
  title,
  subtitle,
  products,
  currentDepartment = "all",
  defaultCategory,
  defaultSubtype,
  breadcrumbs,
  isSalePage,
  isNewInPage,
  collectionSlug,
  heroSlot,
}: CataloguePageClientProps) {
  // Context passed to unified filtering engine
  const context: CatalogueContext = {
    gender,
    department: currentDepartment,
    defaultCategory,
    defaultSubtype,
    isSaleOnly: isSalePage,
    isNewOnly: isNewInPage,
    collectionSlug,
  };

  const [liveProducts, setLiveProducts] = React.useState<Product[]>(products);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("pablo_admin_store_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.products && Array.isArray(parsed.products) && parsed.products.length > 0) {
          const active = parsed.products.filter(
            (p: Product) => p.status !== "draft" && p.status !== "archived" && p.isAvailable !== false
          );
          if (gender === "men" || gender === "women" || gender === "kids") {
            setLiveProducts(active.filter((p: Product) => (p.gender || "men") === gender));
          } else if (isSalePage) {
            setLiveProducts(active.filter((p: Product) => p.isSale));
          } else if (isNewInPage) {
            setLiveProducts(active.filter((p: Product) => p.isNewArrival));
          } else {
            setLiveProducts(active);
          }
        }
      }
    } catch {}
  }, [products, gender, isSalePage, isNewInPage]);

  const {
    activeFilters,
    filterGroups,
    sortedProducts,
    totalCount,
    hasActiveFilters,
    priceBounds,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    toggleFilterOption,
    setPriceRange,
    setSort,
    removeFilter,
    resetAllFilters,
    clearFilterGroup,
  } = useProductFilters(liveProducts, context);

  // Define contextual primary destination tabs
  const showDestinationTabs = gender === "men" || gender === "women" || gender === "kids";
  const destinationTabs = [
    { id: "all", label: "ALL", href: `/${gender}#catalogue` },
    { id: "clothing", label: "CLOTHING", href: `/${gender}/clothing#catalogue` },
    { id: "footwear", label: "FOOTWEAR", href: `/${gender}/footwear#catalogue` },
    { id: "accessories", label: "ACCESSORIES", href: `/${gender}/accessories#catalogue` },
  ];

  const pathname = usePathname();
  const { isKids: isSiteKids } = useSiteTheme();
  const isKids = isSiteKids || gender === "kids" || Boolean(pathname?.startsWith("/kids"));
  const [kidsCategory, setKidsCategory] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCat = sessionStorage.getItem("pablo-kids-active-category");
        if (savedCat) return savedCat;
      } catch {}
    }
    return currentDepartment || "all";
  });

  // Keep saved category synchronized
  React.useEffect(() => {
    if (!isKids) return;
    try {
      sessionStorage.setItem("pablo-kids-active-category", kidsCategory);
    } catch {}
  }, [isKids, kidsCategory]);

  // Robust persistent scroll position across reloads for Kids section
  const isRestoringScrollRef = React.useRef(false);

  React.useEffect(() => {
    if (!isKids) return;

    const timers: NodeJS.Timeout[] = [];

    // 1. Check for saved scroll position from reload
    try {
      const savedY = sessionStorage.getItem("pablo-kids-scroll-y");
      if (savedY) {
        const y = parseInt(savedY, 10);
        if (!isNaN(y) && y > 0) {
          isRestoringScrollRef.current = true;
          const restoreScroll = () => {
            window.scrollTo({ top: y, behavior: "instant" });
          };
          // Immediately apply and reinforce across hydration & image render ticks
          restoreScroll();
          requestAnimationFrame(restoreScroll);
          timers.push(setTimeout(restoreScroll, 30));
          timers.push(setTimeout(restoreScroll, 80));
          timers.push(setTimeout(restoreScroll, 180));
          timers.push(setTimeout(restoreScroll, 350));
          timers.push(setTimeout(restoreScroll, 600));
          timers.push(setTimeout(restoreScroll, 1000));
          timers.push(
            setTimeout(() => {
              restoreScroll();
              isRestoringScrollRef.current = false;
            }, 1200)
          );
        }
      }
    } catch {}

    // 2. Continuously track scroll position when browsing
    const saveCurrentScroll = () => {
      if (isRestoringScrollRef.current) return;
      try {
        if (window.scrollY > 0) {
          sessionStorage.setItem("pablo-kids-scroll-y", window.scrollY.toString());
        } else if (window.scrollY === 0) {
          sessionStorage.setItem("pablo-kids-scroll-y", "0");
        }
      } catch {}
    };

    window.addEventListener("scroll", saveCurrentScroll, { passive: true });
    window.addEventListener("beforeunload", saveCurrentScroll);
    window.addEventListener("pagehide", saveCurrentScroll);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", saveCurrentScroll);
      window.removeEventListener("beforeunload", saveCurrentScroll);
      window.removeEventListener("pagehide", saveCurrentScroll);
    };
  }, [isKids]);

  // Contextual filtering for kids categories (Boys, Girls, Baby, Clothing, Footwear, Accessories, All)
  const displayedProducts = React.useMemo(() => {
    if (!isKids || kidsCategory === "all") return sortedProducts;
    if (kidsCategory === "clothing") {
      return sortedProducts.filter((p) => p.department === "clothing");
    }
    if (kidsCategory === "footwear") {
      return sortedProducts.filter((p) => p.department === "footwear");
    }
    if (kidsCategory === "accessories") {
      return sortedProducts.filter((p) => p.department === "accessories");
    }
    if (kidsCategory === "boys") {
      return sortedProducts.filter((p) => p.tags.some((t) => t.toLowerCase().includes("boys")));
    }
    if (kidsCategory === "girls") {
      return sortedProducts.filter((p) => p.tags.some((t) => t.toLowerCase().includes("girls")));
    }
    if (kidsCategory === "baby") {
      return sortedProducts.filter(
        (p) =>
          p.tags.some((t) => t.toLowerCase().includes("baby") || t.toLowerCase().includes("soft")) ||
          p.sizes.some((s) => s.name?.includes("2Y") || s.name?.includes("2-5Y") || s.name?.includes("2-6Y"))
      );
    }
    return sortedProducts;
  }, [isKids, kidsCategory, sortedProducts]);

  const finalCount = isKids ? displayedProducts.length : totalCount;

  return (
    <div
      className={`text-[#111111] font-sans w-full min-w-full ${
        isKids ? "bg-[#EBF4FA]" : "bg-[#EAE8E1]"
      }`}
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        minWidth: "100%",
        backgroundColor: isKids ? "#EBF4FA" : "#EAE8E1",
      }}
    >
      {/* ── FOOTER: FIRST in DOM, visual bottom, z-index 0 ── */}
      <Footer />

      {/* ── MAIN CONTENT: SECOND in DOM, visual top, z-index 1 ── */}
      <div
        className={`flex flex-col min-h-screen w-full min-w-full ${
          isKids ? "bg-[#EBF4FA]" : "bg-[#EAE8E1]"
        }`}
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: isKids ? "#EBF4FA" : "#EAE8E1",
          width: "100%",
          minWidth: "100%",
        }}
      >
        {/* Continuous Kids Background Atmosphere — below z-0 so navbar/dropdowns always win */}
        {isKids && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: -1 }}
            aria-hidden="true"
          >
            {/* 1. Top-Left Semi-Circle: Merging through navbar and upper hero */}
            <div
              className="absolute -top-28 -left-28 sm:-top-36 sm:-left-36 w-[620px] h-[620px] rounded-full blur-2xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at 35% 35%, rgba(254, 240, 138, 0.38) 0%, rgba(254, 240, 138, 0.16) 45%, transparent 70%)",
              }}
            />

            {/* 2. Bridging Semi-Circle (Left margin): Connects hero smoothly across category tabs into upper catalogue */}
            <div
              className="absolute top-[480px] sm:top-[520px] -left-44 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at 30% 50%, rgba(254, 240, 138, 0.28) 0%, rgba(254, 240, 138, 0.10) 45%, transparent 70%)",
              }}
            />

            {/* 3. Right-Side Scattered Semi-Circle: Gentle warm sun arc beside upper product grid */}
            <div
              className="absolute top-[980px] sm:top-[1050px] -right-40 w-[580px] h-[580px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at 70% 50%, rgba(254, 240, 138, 0.22) 0%, rgba(254, 240, 138, 0.08) 45%, transparent 70%)",
              }}
            />

            {/* Mint pastel ambient accent near mid-catalogue */}
            <div
              className="absolute top-[1450px] -left-32 w-[520px] h-[520px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(220, 252, 231, 0.25) 0%, rgba(220, 252, 231, 0.08) 50%, transparent 70%)",
              }}
            />

            {/* 4. Left-Side Scattered Semi-Circle: Continuous warmth continuing through middle products */}
            <div
              className="absolute top-[1800px] -left-36 w-[540px] h-[540px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at 30% 50%, rgba(254, 240, 138, 0.18) 0%, rgba(254, 240, 138, 0.06) 45%, transparent 70%)",
              }}
            />

            {/* Soft lavender ambient accent near lower catalogue */}
            <div
              className="absolute top-[2200px] right-1/4 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(252, 231, 243, 0.25) 0%, rgba(252, 231, 243, 0.08) 50%, transparent 70%)",
              }}
            />

            {/* 5. Lower Scattered Semi-Circle: Gentle sun reflection leading to Kids footer */}
            <div
              className="absolute top-[2550px] -right-36 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at 70% 50%, rgba(254, 240, 138, 0.16) 0%, rgba(254, 240, 138, 0.05) 45%, transparent 70%)",
              }}
            />
          </div>
        )}

        {/* Navbar */}
        <Navbar />

        {/* Full-Width Category Editorial Hero Slot */}
        <div className="relative z-10 w-full">
          {heroSlot}
        </div>

        {/* Category Cards Bar (Styled like Image 2 with Kids Theme, containing all 6 contents) */}
        {isKids && (
          <div className="relative z-10 w-full">
            <KidsCategorySection
              activeCategory={kidsCategory}
              onSelectCategory={setKidsCategory}
            />
          </div>
        )}

        {/* Main Catalogue Container */}
        <main
          id="catalogue"
          data-gender={isKids ? "kids" : gender}
          className={`page-container relative z-10 flex-1 ${
            isKids ? "pt-6 sm:pt-8 pb-16 bg-transparent" : "pt-8 sm:pt-10 lg:pt-12 pb-16 lg:pb-20"
          }`}
          style={isKids ? { backgroundColor: "transparent" } : undefined}
        >

          {/* Header - Only for non-kids (removed for kids as requested) */}
          {!isKids && (
            <div className="text-center max-w-3xl mx-auto pt-3 pb-2 mb-4">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111111] mt-1">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-[#666666] font-light mt-3 max-w-lg mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          {/* PRIMARY DESTINATION NAVIGATION (Tabs for non-kids gender catalogues) */}
          {showDestinationTabs && !isKids && (
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/60 border border-[#D9D8D3]">
                {destinationTabs.map((tab) => {
                  const isActive = currentDepartment === tab.id;
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className={`px-5 sm:px-8 py-2.5 text-xs font-sans tracking-[0.2em] uppercase font-medium transition-all ${
                        isActive
                          ? "bg-[#181818] text-[#EAE8E1] shadow-xs"
                          : "text-[#666666] hover:text-[#111111] hover:bg-black/5"
                      }`}
                    >
                      {tab.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}


          {/* ─── CONTROLS ROW ─── */}
          <div
            id="catalogue-controls"
            className={`relative flex items-center justify-between py-3 mb-6 text-xs select-none ${
              isKids ? "border-y-2 border-[#181818]" : "border-y border-[#D9D8D3]"
            }`}
          >
            {/* Left: Product count & Kids HiddenStar */}
            <div className="flex items-center gap-2">
              <span className={isKids ? "text-xs font-bold text-[#181818]" : "text-xs tracking-[0.2em] uppercase text-[#666666]"}>
                {finalCount} {finalCount === 1 ? "PIECE" : "PIECES"}
              </span>
              {isKids && <HiddenStar slotId="slot-d-ctrl-left" className="relative -ml-1 z-30 pointer-events-auto" rotate="-10deg" />}
            </div>

            {/* Right: Filter & Sort Controls */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Zone D: Tucked near filter button border */}
              {isKids && <HiddenStar slotId="slot-d-filter-btn" className="absolute -top-2 right-24 z-30 pointer-events-auto" rotate="12deg" />}
              {/* Filter Button */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                    setMobileDrawerOpen(true);
                  } else {
                    setIsFilterDrawerOpen(!isFilterDrawerOpen);
                  }
                }}
                className={`flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 text-xs tracking-wider uppercase transition-all cursor-pointer ${
                  isKids
                    ? isFilterDrawerOpen || hasActiveFilters
                      ? "rounded-full border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                      : "rounded-full border-2 border-[#181818] bg-white text-[#181818] hover:bg-[#FEF08A]/50 font-bold shadow-[2px_2px_0px_#181818]"
                    : isFilterDrawerOpen || hasActiveFilters
                    ? "border border-[#111111] bg-[#181818] text-[#EAE8E1]"
                    : "border border-[#D9D8D3] bg-white/80 hover:border-[#111111] text-[#111111]"
                }`}
              >
                {/* Filter / Sliders Icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                <span>FILTER</span>
                {hasActiveFilters && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isKids ? "bg-[#181818]" : "bg-[#EAE8E1]"
                    }`}
                  />
                )}
              </button>

              {/* Sort Dropdown */}
              <ProductSort currentSort={activeFilters.sort} onSortChange={setSort} />

              {/* Zone D: Right boundary */}
              {isKids && <HiddenStar slotId="slot-d-ctrl-right" className="relative -mr-1 z-30 pointer-events-auto" rotate="18deg" />}
            </div>
          </div>


          {/* Global Context-Aware Filter Panel (Compact Dropdown on Desktop, Bottom-Sheet on Mobile) */}
          <ProductFilters
            filterGroups={filterGroups}
            activeFilters={activeFilters}
            priceBounds={priceBounds}
            onToggleOption={toggleFilterOption}
            onSetPriceRange={setPriceRange}
            onClearFilterGroup={clearFilterGroup}
            onResetAll={resetAllFilters}
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            mobileOpen={mobileDrawerOpen}
            onMobileClose={() => setMobileDrawerOpen(false)}
            totalFilteredCount={totalCount}
          />

          {/* Removable Applied Filter Chips (Rendered only when active) */}
          {hasActiveFilters && (
            <AppliedFilters
              activeFilters={activeFilters}
              onRemove={removeFilter}
              onClearAll={resetAllFilters}
              isSalePage={isSalePage}
              isNewInPage={isNewInPage}
            />
          )}

          {/* Product Grid Area with Zone E Outside Whitespace Slots (STRICTLY OUTSIDE PRODUCT CARDS) */}
          <div className="relative w-full">
            {/* ── KIDS STAR PROGRESS INDICATOR (Scoped strictly inside Kids Product Section) ── */}
            {isKids && <KidsStarProgress />}

            {isKids && (
              <>
                {/* Zone E: Whitespace margin above product grid */}
                <div className="relative w-full h-0 pointer-events-none">
                  <HiddenStar slotId="slot-e-grid-top-gutter" className="-top-3 left-[28%] pointer-events-auto z-30" rotate="14deg" />
                </div>
                {/* Zone E: Outer left whitespace flank */}
                <div className="relative w-full h-0 pointer-events-none">
                  <HiddenStar slotId="slot-e-left-flank" className="top-24 -left-3 sm:-left-5 pointer-events-auto z-30" rotate="-8deg" />
                </div>
                {/* Zone E: Outer right whitespace flank */}
                <div className="relative w-full h-0 pointer-events-none">
                  <HiddenStar slotId="slot-e-right-flank" className="top-72 -right-3 sm:-right-5 pointer-events-auto z-30" rotate="20deg" />
                </div>
                {/* Zone E: Mid-grid horizontal whitespace gutter */}
                <div className="relative w-full h-0 pointer-events-none">
                  <HiddenStar slotId="slot-e-grid-mid-gutter" className="top-[420px] left-[50%] pointer-events-auto z-30" rotate="-15deg" />
                </div>
              </>
            )}

            <ProductGrid
              products={isKids ? displayedProducts : sortedProducts}
              activeCategory={kidsCategory}
              onResetFilters={() => {
                if (isKids) setKidsCategory("all");
                resetAllFilters();
              }}
            />

            {/* Zone F: Lower Catalogue Editorial & Ambient Boundaries */}
            {isKids && (
              <div className="relative w-full h-8 mt-4 pointer-events-none">
                <HiddenStar slotId="slot-f-grid-bottom-edge" className="top-2 right-16 pointer-events-auto z-30" rotate="10deg" />
                <HiddenStar slotId="slot-f-ambient-mint" className="top-2 left-10 pointer-events-auto z-30" rotate="-12deg" />
                <HiddenStar slotId="slot-f-ambient-lavender" className="top-2 left-1/2 pointer-events-auto z-30" rotate="16deg" />
                <HiddenStar slotId="slot-f-grid-bottom-left" className="top-2 left-28 pointer-events-auto z-30" rotate="-14deg" />
              </div>
            )}
          </div>

        </main>
      </div>
      {/* End of MAIN CONTENT block */}
    </div>
  );
}

export function CataloguePageClient(props: CataloguePageClientProps) {
  const isKids = props.gender === "kids";
  return (
    <Suspense
      fallback={
        <div
          className={`min-h-screen ${
            isKids ? "bg-[#EBF4FA]" : "bg-[#EAE8E1]"
          }`}
        />
      }
    >
      {isKids ? (
        <HiddenStarsProvider>
          <KidsMonkeyScrollIndicator />
          <CatalogueContent {...props} />
        </HiddenStarsProvider>
      ) : (
        <CatalogueContent {...props} />
      )}
    </Suspense>
  );
}

export default CataloguePageClient;
