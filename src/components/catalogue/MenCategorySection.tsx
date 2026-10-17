"use client";

import React from "react";
import { MEN_EDITORIAL_CATEGORIES } from "@/data/categories";
import { scrollToCategorySection } from "@/lib/scrollUtils";

export interface MenCategorySectionProps {
  currentDepartment?: string;
  activeCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export default function MenCategorySection({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentDepartment,
  activeCategory = "all",
  onSelectCategory,
}: MenCategorySectionProps) {
  const handleClick = (e: React.MouseEvent, catId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectCategory) {
      const nextCategory = activeCategory === catId ? "all" : catId;
      onSelectCategory(nextCategory);
    }
    const norm = catId.toLowerCase().trim();
    scrollToCategorySection(norm);
  };

  return (
    <section aria-label="Men's Editorial Collection" className="w-full select-none pt-4 sm:pt-6 lg:pt-8">
      {/* ─── SECTION HEADING: CATEGORIES ─── */}
      <div className="text-center mb-5 sm:mb-7 lg:mb-8 pt-1 sm:pt-2">
        <span className="block text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.28em] text-[#666666] font-medium mb-1.5">
          COLLECTION
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal uppercase tracking-[0.03em] sm:tracking-[0.04em] text-[#111111]">
          CATEGORIES
        </h2>
        <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-2.5 sm:mt-3 opacity-30" />
      </div>

      {/* ─── CATEGORY DISCOVERY CARDS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-4 mb-5 sm:mb-7">
        {MEN_EDITORIAL_CATEGORIES.map((card) => {
          const isSelected = activeCategory === card.category;
          return (
            <button
              key={card.id}
              type="button"
              onClick={(e) => handleClick(e, card.category)}
              data-no-transition="true"
              aria-label={`Explore ${card.label}`}
              className={`shiny-card group relative block aspect-[0.78/1] overflow-hidden bg-[#181818] border transition-all duration-300 cursor-pointer select-none text-left p-0 w-full ${
                isSelected
                  ? "border-[#181818] ring-2 ring-[#111111] ring-offset-2 ring-offset-[#EAE8E1]"
                  : "border-[#181818]/15 hover:border-[#181818]"
              }`}
            >
              {/* Full HD Pristine Image */}
              <img
                src={card.image}
                alt={card.alt}
                className="w-full h-full object-cover block transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:contrast-[1.05]"
                style={{
                  objectPosition: card.objectPosition,
                  filter: "none",
                  opacity: 1,
                  transform: "translateZ(0)",
                }}
                loading="eager"
              />

              {/* Active Badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 bg-[#181818]/90 text-white text-[8px] font-sans tracking-[0.2em] uppercase border border-white/30 backdrop-blur-sm">
                  ACTIVE
                </div>
              )}

              {/* Subtle bottom gradient for text legibility */}
              <div
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10"
                aria-hidden="true"
              />

              {/* Hover enhanced bottom gradient to elevate text readability */}
              <div
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-[850ms] ease-out"
                aria-hidden="true"
              />

              {/* Bottom Content: Category Name + EXPLORE / VIEWING → */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3.5 z-10 flex flex-col items-start justify-end">
                <span className="block font-editorial text-sm sm:text-base md:text-lg font-normal tracking-[0.06em] uppercase text-white leading-tight">
                  {card.label}
                </span>
                <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-sans tracking-[0.2em] uppercase text-white/80 mt-1 group-hover:text-white transition-colors">
                  {isSelected ? "VIEWING" : "EXPLORE"}{" "}
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
