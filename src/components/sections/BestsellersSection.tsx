"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import { ProductCarousel } from "@/components/catalogue/ProductCarousel";
import { MEN_PRODUCTS } from "@/data/menCatalogue";
import { EditorialHeading } from "@/components/ui/EditorialHeading";


import { Reveal } from "@/components/animation/Reveal";

export function BestsellersSection() {
  const bestsellers = useMemo(() => {
    // Select top 8 best-selling pieces for horizontal carousel
    return [...MEN_PRODUCTS]
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 8);
  }, []);

  return (
    <section
      id="bestsellers"
      aria-label="PABLO Bestsellers"
      className="w-full bg-[#EAE8E1] text-[#111111] py-10 sm:py-14 lg:py-16 select-none border-t border-[#D9D8D3]/60"
      style={{ backgroundColor: "#EAE8E1", color: "#111111" }}
    >
      <div className="page-container">
        {/* ─── SECTION HEADER (Title Left, View All & Arrows Right) ─── */}
        <Reveal direction="up" distance={22} className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 pb-4 border-b border-[#D9D8D3]">
          <div>
            <span className="block text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#666666] font-medium mb-2">
              ICONIC ATELIER SILHOUETTES
            </span>
            <EditorialHeading
              text="BESTSELLERS"
              as="h2"
              className="h-7 sm:h-8 md:h-9 lg:h-10 text-[#111111]"
            />
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-24">
            <Link
              href="/men?collection=best-sellers"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#111111] hover:text-[#666666] transition-colors py-1"
            >
              <span className="relative">
                VIEW ALL BESTSELLERS
                <span className="block w-0 group-hover:w-full h-[1px] bg-[#111111] transition-all duration-300 mx-auto mt-0.5" />
              </span>
              <span className="text-[11px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </Reveal>

        {/* ─── 4-ACROSS HORIZONTAL CAROUSEL ─── */}
        <ProductCarousel products={bestsellers} ariaLabel="Bestsellers Carousel" />

        {/* ─── MOBILE BOTTOM ACTION ─── */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/men?collection=best-sellers"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#111111] text-xs uppercase tracking-[0.22em] text-[#111111] hover:bg-[#111111] hover:text-[#EAE8E1] transition-colors"
          >
            <span>VIEW ALL BESTSELLERS</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BestsellersSection;
