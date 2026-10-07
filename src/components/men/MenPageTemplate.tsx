"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenHero from "@/components/sections/MenHero";
import MenCategorySection from "@/components/catalogue/MenCategorySection";
import MenCatalogueGrid from "./MenCatalogueGrid";
import { Product } from "@/types/catalogue";
import { DepartmentId } from "@/types/filters";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface MenPageTemplateProps {
  products: Product[];
  currentDepartment?: DepartmentId;
  defaultCategory?: string;
  defaultSubtype?: string;
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  showHeroAndCategories?: boolean;
}

function MenPageTemplateInner({
  products,
  currentDepartment = "all",
  defaultCategory,
  defaultSubtype,
  title,
  subtitle,
  breadcrumbs,
  showHeroAndCategories = true,
}: MenPageTemplateProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Active category state initialized from URL param, defaultCategory, or 'all'
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const cat = p.get("category");
      if (cat) return cat.toLowerCase().trim();
    }
    return defaultCategory?.toLowerCase().trim() || "all";
  });

  // Sync state if searchParams changes (e.g. initial load or external router change)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setActiveCategory(cat.toLowerCase().trim());
    } else if (!defaultCategory) {
      setActiveCategory("all");
    }
  }, [searchParams, defaultCategory]);

  // Sync state on browser back/forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const cat = p.get("category");
      setActiveCategory(cat ? cat.toLowerCase().trim() : "all");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Category selection handler: updates state, updates URL history without reload, scrolls to catalogue
  const handleSelectCategory = useCallback(
    (catId: string) => {
      const norm = catId.toLowerCase().trim();
      setActiveCategory(norm);

      // Update URL query parameter seamlessly
      const currentParams = new URLSearchParams(window.location.search);
      if (norm === "all") {
        currentParams.delete("category");
      } else {
        currentParams.set("category", norm);
      }
      const qs = currentParams.toString();
      const newUrl = qs ? `${pathname}?${qs}` : pathname;
      window.history.pushState({ category: norm }, "", newUrl);

      // Smoothly scroll down to the catalogue section
      const catalogueEl = document.getElementById("catalogue");
      if (catalogueEl) {
        catalogueEl.scrollIntoView({ behavior: "smooth" });
      }
    },
    [pathname]
  );

  return (
    <div
      className="text-[#111111] font-sans w-full min-w-full bg-[#EAE8E1]"
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        minWidth: "100%",
        backgroundColor: "#EAE8E1",
      }}
    >
      {/* ── FOOTER: FIRST in DOM, visual bottom, z-index 0 ── */}
      <Footer />

      {/* ── MAIN CONTENT: SECOND in DOM, visual top, z-index 1 ── */}
      <div
        className="flex flex-col min-h-screen w-full min-w-full bg-[#EAE8E1]"
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "#EAE8E1",
          width: "100%",
          minWidth: "100%",
        }}
      >
        <Navbar isHeroOverlay={showHeroAndCategories} />

        {/* Full-Width Men Hero — STAYS MOUNTED AND INTACT */}
        {showHeroAndCategories && (
          <div className="relative z-10 w-full">
            <MenHero />
          </div>
        )}

        {/* Dedicated Categories Section (Above Product Catalogue) */}
        {showHeroAndCategories && (
          <section
            id="categories"
            aria-label="Men's Categories"
            className="page-container relative z-10 scroll-mt-14 sm:scroll-mt-16 pt-0 sm:pt-4 lg:pt-6"
          >
            <MenCategorySection
              currentDepartment={currentDepartment}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
          </section>
        )}

        {/* Main Catalogue Container */}
        <main
          id="catalogue"
          data-gender="men"
          className="page-container relative z-10 flex-1 scroll-mt-14 sm:scroll-mt-16 pt-0 sm:pt-2 lg:pt-4 pb-16 lg:pb-20"
        >
          {/* Product Grid and Controls with Active Category Filtering */}
          <MenCatalogueGrid
            products={products}
            currentDepartment={currentDepartment}
            defaultCategory={defaultCategory}
            defaultSubtype={defaultSubtype}
            title={title}
            subtitle={subtitle}
            breadcrumbs={breadcrumbs}
            activeCategory={activeCategory}
          />
        </main>
      </div>
    </div>
  );
}

export default function MenPageTemplate(props: MenPageTemplateProps) {
  return (
    <Suspense fallback={null}>
      <MenPageTemplateInner {...props} />
    </Suspense>
  );
}
