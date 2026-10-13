"use client";

import React from "react";
import Image from "next/image";
import { DoodleStar, DoodleCloud, DoodleSun } from "@/components/kids/KidsDoodles";
import { HiddenStar } from "@/components/kids/games/HiddenStar";

export interface KidsCategorySectionProps {
  activeCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export const KIDS_CATEGORIES = [
  { id: "all", label: "ALL" },
  { id: "boys", label: "BOYS" },
  { id: "girls", label: "GIRLS" },
  { id: "baby", label: "BABY & TODDLER" },
  { id: "clothing", label: "CLOTHING" },
  { id: "footwear", label: "FOOTWEAR" },
  { id: "accessories", label: "ACCESSORIES" },
];

export const MOBILE_2X2_CATEGORIES = [
  {
    id: "boys",
    name: "BOYS",
    image: "/images/kids/hoodie-sky-front.webp",
    alt: "PABLO Kids Boys Collection",
  },
  {
    id: "girls",
    name: "GIRLS",
    image: "/images/kids/cable-knit-ivory-front.webp",
    alt: "PABLO Kids Girls Collection",
  },
  {
    id: "baby",
    name: "BABY & TODDLER",
    image: "/images/kids/hoodie-cream-front.webp",
    alt: "PABLO Kids Baby & Toddler Collection",
  },
  {
    id: "accessories",
    name: "ACCESSORIES",
    image: "/images/categories/bags.webp",
    alt: "PABLO Kids Accessories Collection",
  },
];

export default function KidsCategorySection({
  activeCategory = "all",
  onSelectCategory,
}: KidsCategorySectionProps) {
  const handleClick = (e: React.MouseEvent, catId: string) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    const catalogueEl = document.getElementById("catalogue");
    if (catalogueEl) {
      catalogueEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="kids-category-section"
      aria-label="Kids Category Navigation"
      className="page-container pt-3 pb-4 sm:pb-6 flex flex-col items-center justify-center select-none bg-transparent scroll-mt-14 sm:scroll-mt-16"
      style={{
        backgroundColor: "transparent",
      }}
    >
      {/* 
        ── 1. DEDICATED MOBILE CATEGORY EXPERIENCE (sm:hidden) ──
        Follows Screen 2 of the reference image:
        - Top Promo banner card ("Little Adventures Big Style.")
        - Bold "Shop by Category" header
        - 2x2 grid of category cards with photos & arrows
        - Horizontally scrollable category pills strip
      */}
      <div className="w-full sm:hidden flex flex-col items-start z-10 px-1 pt-4">
        {/* Section Heading: Shop by Category */}
        <div className="w-full flex items-center justify-between mb-3.5 px-1">
          <h2 className="text-xl font-black text-[#181818] font-sans tracking-tight">
            Shop by Category
          </h2>
          <div className="relative inline-flex items-center">
            <HiddenStar slotId="slot-c-badge-tuck" className="-top-1 -right-1 z-30 pointer-events-auto" rotate="15deg" />
          </div>
        </div>

        {/* 2x2 Category Cards Grid */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-5">
          {MOBILE_2X2_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={(e) => handleClick(e, cat.id)}
                className={`group relative flex flex-col justify-between rounded-2xl border-2 border-[#181818] bg-white overflow-hidden cursor-pointer transition-all duration-200 active:scale-[0.98] ${isSelected ? "shadow-[3px_3px_0px_#181818] ring-2 ring-[#FEF08A] bg-[#FEF08A]/10" : "shadow-[2px_2px_0px_#181818] hover:shadow-[3px_3px_0px_#181818]"}`}
              >
                {/* Image Container with Wishlist Icon */}
                <div className="relative aspect-square w-full bg-[#EBF4FA] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="180px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Top-Right Wishlist Heart Indicator */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 border border-[#181818] flex items-center justify-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-[#181818]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Label Strip */}
                <div className="p-2.5 flex items-center justify-between bg-white border-t border-[#181818]/15">
                  <span className="font-sans font-black text-[11px] tracking-wider uppercase text-[#181818]">
                    {cat.name}
                  </span>
                  <span className="text-xs font-bold text-[#181818] transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Horizontal Category Strip (ALL, BOYS, GIRLS, BABY, CLOTHING, FOOTWEAR, ACCESSORIES) */}
        <div className="w-full relative py-1 mb-2">
          <HiddenStar slotId="slot-c-bar-left-rim" className="top-1/2 -translate-y-1/2 left-0.5 z-30 pointer-events-auto" rotate="-12deg" />
          <HiddenStar slotId="slot-c-bar-right-rim" className="top-1/2 -translate-y-1/2 right-0.5 z-30 pointer-events-auto" rotate="12deg" />

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth">
            {KIDS_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={(e) => handleClick(e, cat.id)}
                  className={`px-3.5 py-1.5 shrink-0 text-[10.5px] font-sans font-black tracking-wider uppercase rounded-full transition-all duration-150 cursor-pointer border-2 border-[#181818] select-none active:scale-95 ${isActive ? "bg-[#FEF08A] text-[#181818] shadow-[2px_2px_0px_#181818]" : "bg-white text-[#181818] hover:bg-[#FEF08A]/40"}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 
        ── 2. DESKTOP CATEGORY CARDS BAR (hidden sm:inline-flex) — 100% UNCHANGED ──
        Horizontal strip containing cards for ALL, BOYS, GIRLS, BABY & TODDLER, CLOTHING, FOOTWEAR, ACCESSORIES
      */}
      <div className="hidden sm:inline-flex relative flex-wrap items-center justify-center p-1.5 sm:p-2 bg-white border-2 border-[#181818] shadow-[4px_4px_0px_#181818] rounded-xl sm:rounded-2xl gap-1.5 sm:gap-2 max-w-full">
        {/* Zone C: Tucked along outer edges of the category cards container */}
        <HiddenStar slotId="slot-c-bar-left-rim" className="top-1/2 -translate-y-1/2 -left-2 sm:-left-2.5 z-30 pointer-events-auto" rotate="-12deg" />
        <HiddenStar slotId="slot-c-bar-right-rim" className="top-1/2 -translate-y-1/2 -right-2 sm:-right-2.5 z-30 pointer-events-auto" rotate="12deg" />
        {KIDS_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={(e) => handleClick(e, cat.id)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-[13px] font-sans font-black tracking-wider uppercase transition-all duration-200 cursor-pointer whitespace-nowrap rounded-lg sm:rounded-xl select-none active:scale-95 ${isActive ? "bg-[#FEF08A] text-[#181818] border-2 border-[#181818] shadow-[2px_2px_0px_#181818] scale-[1.02]" : "text-[#181818] hover:bg-[#FEF08A]/40 border-2 border-transparent"}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
