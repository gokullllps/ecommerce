"use client";

import React from "react";
import { DoodleStar } from "@/components/kids/KidsDoodles";
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

export default function KidsCategorySection({
  activeCategory = "all",
  onSelectCategory,
}: KidsCategorySectionProps) {
  const handleClick = (e: React.MouseEvent, catId: string) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  return (
    <section
      id="kids-collection"
      aria-label="Kids Category Navigation"
      className="page-container pt-4 pb-4 sm:pb-6 flex flex-col items-center justify-center select-none bg-transparent scroll-mt-16"
      style={{
        backgroundColor: "transparent",
      }}
    >
      {/* Playful Sticker Badge with Candidate Hidden Star tucked partially behind border */}
      <div className="relative inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF08A] hover:bg-[#FDE047] border-2 border-[#181818] shadow-[2px_2px_0px_#181818] text-[10.5px] font-sans font-bold tracking-widest uppercase mb-4 select-none cursor-pointer transition-transform hover:-translate-y-0.5 z-10">
        <DoodleStar className="w-3.5 h-3.5 pointer-events-none" color="#181818" strokeColor="#181818" />
        <span>PLAYFUL WARDROBE</span>
        {/* Zone C: Tucked behind the badge border */}
        <HiddenStar slotId="slot-c-badge-tuck" className="-top-1.5 -right-2 z-30 pointer-events-auto" rotate="15deg" />
      </div>

      {/* 
        ── CATEGORY CARDS BAR ──
        Horizontal strip containing cards for ALL, BOYS, GIRLS, BABY & TODDLER, CLOTHING, FOOTWEAR, ACCESSORIES
      */}
      <div className="relative inline-flex flex-wrap items-center justify-center p-1.5 sm:p-2 bg-white border-2 border-[#181818] shadow-[4px_4px_0px_#181818] rounded-xl sm:rounded-2xl gap-1.5 sm:gap-2 max-w-full">
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
              className={`
                px-4 sm:px-6 py-2.5 sm:py-3
                text-xs sm:text-[13px] font-sans font-black tracking-wider uppercase
                transition-all duration-200 cursor-pointer whitespace-nowrap
                rounded-lg sm:rounded-xl select-none active:scale-95
                ${
                  isActive
                    ? "bg-[#FEF08A] text-[#181818] border-2 border-[#181818] shadow-[2px_2px_0px_#181818] scale-[1.02]"
                    : "text-[#181818] hover:bg-[#FEF08A]/40 border-2 border-transparent"
                }
              `}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
