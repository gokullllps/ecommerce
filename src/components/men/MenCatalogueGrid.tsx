"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Product } from "@/types/catalogue";
import { CatalogueContext, DepartmentId } from "@/types/filters";
import { useProductFilters } from "@/components/catalogue/filters/useProductFilters";
import { ProductFilters } from "@/components/catalogue/ProductFilters";
import { AppliedFilters } from "@/components/catalogue/filters/AppliedFilters";
import { ProductSort } from "@/components/catalogue/ProductSort";
import { ProductGrid } from "@/components/catalogue/ProductGrid";

import { matchesCategory } from "@/data/products";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface MenCatalogueGridProps {
  products: Product[];
  currentDepartment?: DepartmentId;
  defaultCategory?: string;
  defaultSubtype?: string;
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  activeCategory?: string;
}

function MenCatalogueGridInner({
  products,
  currentDepartment = "all",
  defaultCategory,
  defaultSubtype,
  title,
  subtitle,
  breadcrumbs,
  activeCategory = "all",
}: MenCatalogueGridProps) {
  const context: CatalogueContext = {
    gender: "men",
    department: currentDepartment,
    defaultCategory,
    defaultSubtype,
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
          setLiveProducts(active.filter((p: Product) => (p.gender || "men") === "men"));
        }
      }
    } catch {}
  }, [products]);

  // Dynamically filter according to activeCategory
  const categoryFilteredBaseProducts = React.useMemo(() => {
    if (!activeCategory || activeCategory === "all") return liveProducts;
    return liveProducts.filter((p) => matchesCategory(p, activeCategory));
  }, [liveProducts, activeCategory]);

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
  } = useProductFilters(categoryFilteredBaseProducts, context);

  return (
    <div className="w-full">
      {/* Optional Breadcrumbs & Title for deep subtype pages (e.g. /men/clothing/shirts) */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4 pt-2">
          <ol className="flex items-center gap-1.5 text-xs text-[#666666]">
            {breadcrumbs.map((crumb, idx) => (
              <li key={crumb.href || idx} className="flex items-center gap-1.5">
                {idx > 0 && <span className="text-[#999999] select-none">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-[#111111] font-medium tracking-wider">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-[#111111] tracking-wider transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Active Category Header when a specific category is active */}
      {activeCategory && activeCategory !== "all" ? (
        <div
          id={`category-heading-${activeCategory}`}
          className="text-center max-w-3xl mx-auto pt-2 pb-3 mb-4 scroll-mt-24 sm:scroll-mt-28"
        >
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#111111] uppercase">
            {activeCategory.replace("-", " ")}
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] font-light mt-1.5 max-w-lg mx-auto tracking-wide">
            Archival craftsmanship and contemporary silhouettes.
          </p>
        </div>
      ) : title ? (
        <div id="category-heading" className="text-center max-w-3xl mx-auto pt-2 pb-2 mb-4 scroll-mt-24 sm:scroll-mt-28">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#111111]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#666666] font-light mt-2 max-w-lg mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      ) : null}

      {/* ─── DEDICATED MOBILE CONTROL BAR (< sm) ─── */}
      <div className="flex sm:hidden items-center justify-between py-2 mb-4 text-xs select-none border-y border-[#D9D8D3]">
        {/* Left: Filter Trigger Button */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-1.5 border-r border-[#D9D8D3]/70 font-medium text-[#111111] active:bg-black/5 transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
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
          <span className="tracking-[0.16em] uppercase">FILTER</span>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
          )}
        </button>

        {/* Right: Sort Trigger */}
        <div className="flex-1 flex items-center justify-center">
          <ProductSort currentSort={activeFilters.sort} onSortChange={setSort} />
        </div>
      </div>

      {/* ─── DESKTOP CONTROLS ROW (>= sm) ─── */}
      <div
        id="catalogue-controls"
        className="hidden sm:flex relative items-center justify-between py-3 mb-6 text-xs select-none border-y border-[#D9D8D3]"
      >
        {/* Left: Product count */}
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-[0.2em] uppercase text-[#666666]">
            {totalCount} {totalCount === 1 ? "PIECE" : "PIECES"}
          </span>
        </div>

        {/* Right: Filter & Sort Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
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
              isFilterDrawerOpen || hasActiveFilters
                ? "border border-[#111111] bg-[#181818] text-[#EAE8E1]"
                : "border border-[#D9D8D3] bg-white/80 hover:border-[#111111] text-[#111111]"
            }`}
          >
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#EAE8E1]" />
            )}
          </button>

          {/* Sort Dropdown */}
          <ProductSort currentSort={activeFilters.sort} onSortChange={setSort} />
        </div>
      </div>

      {/* Global Context-Aware Filter Panel */}
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

      {/* Removable Applied Filter Chips */}
      {hasActiveFilters && (
        <AppliedFilters
          activeFilters={activeFilters}
          onRemove={removeFilter}
          onClearAll={resetAllFilters}
        />
      )}

      {/* Product Grid */}
      <div className="relative w-full">
        <ProductGrid
          products={sortedProducts}
          onResetFilters={resetAllFilters}
        />
      </div>
    </div>
  );
}

function MenCatalogueSkeleton() {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-5 h-5 border border-[#111111] border-t-transparent rounded-full animate-spin opacity-40 mb-3" />
      <span className="text-[10px] tracking-[0.2em] uppercase text-[#666666] font-sans">
        LOADING COLLECTION
      </span>
    </div>
  );
}

export default function MenCatalogueGrid(props: MenCatalogueGridProps) {
  return (
    <Suspense fallback={<MenCatalogueSkeleton />}>
      <MenCatalogueGridInner {...props} />
    </Suspense>
  );
}
