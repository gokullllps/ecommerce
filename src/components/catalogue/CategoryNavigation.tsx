"use client";

import React, { useRef } from "react";
import { Category, CategoryId, Collection, CollectionId } from "@/types/catalogue";

interface CategoryNavigationProps {
  categories: Category[];
  collections: Collection[];
  activeCategory?: CategoryId | "all";
  activeSubCategory?: string;
  activeCollection?: CollectionId;
  onSelectCategory: (categoryId: CategoryId | "all") => void;
  onSelectSubCategory: (subCategorySlug?: string) => void;
  onSelectCollection: (collectionId?: CollectionId) => void;
}

export function CategoryNavigation({
  categories,
  collections,
  activeCategory = "all",
  activeSubCategory,
  activeCollection,
  onSelectCategory,
  onSelectSubCategory,
  onSelectCollection,
}: CategoryNavigationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentCategoryObj = categories.find((c) => c.id === activeCategory);

  return (
    <div className="w-full mb-8 sm:mb-10 select-none">
      {/* ─── Level 1: Curated Collections Quick Access ─── */}
      <div className="flex items-center space-x-6 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-[#D9D8D3]/50">
        <span className="text-[10px] uppercase tracking-[0.24em] text-[#999999] font-medium shrink-0">
          Collections:
        </span>
        <button
          type="button"
          onClick={() => onSelectCollection(undefined)}
          className={`text-[10px] sm:text-[11px] uppercase tracking-[0.2em] shrink-0 transition-colors cursor-pointer py-1 ${
            !activeCollection
              ? "text-[#111111] font-medium border-b border-[#111111]"
              : "text-[#666666] hover:text-[#111111] font-light"
          }`}
        >
          All
        </button>
        {collections.map((col) => (
          <button
            key={col.id}
            type="button"
            onClick={() => onSelectCollection(col.id === activeCollection ? undefined : col.id)}
            className={`text-[10px] sm:text-[11px] uppercase tracking-[0.2em] shrink-0 transition-colors cursor-pointer py-1 ${
              activeCollection === col.id
                ? "text-[#111111] font-medium border-b border-[#111111]"
                : "text-[#666666] hover:text-[#111111] font-light"
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* ─── Level 2: Primary Men's Categories ─── */}
      <div
        ref={scrollRef}
        className="flex items-center space-x-5 sm:space-x-8 overflow-x-auto pb-2 scrollbar-none"
      >
        <button
          type="button"
          onClick={() => {
            onSelectCategory("all");
            onSelectSubCategory(undefined);
          }}
          className={`text-xs sm:text-[13px] uppercase tracking-[0.18em] shrink-0 transition-all cursor-pointer py-1.5 ${
            activeCategory === "all"
              ? "text-[#111111] font-medium border-b-2 border-[#111111]"
              : "text-[#666666] hover:text-[#111111] font-normal"
          }`}
        >
          View All
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onSelectCategory(cat.id);
                onSelectSubCategory(undefined);
              }}
              className={`text-xs sm:text-[13px] uppercase tracking-[0.18em] shrink-0 transition-all cursor-pointer py-1.5 ${
                isActive
                  ? "text-[#111111] font-medium border-b-2 border-[#111111]"
                  : "text-[#666666] hover:text-[#111111] font-normal"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* ─── Level 3: Subcategories (Revealed if active category has subcategories) ─── */}
      {currentCategoryObj && currentCategoryObj.subcategories.length > 0 && (
        <div className="flex items-center space-x-3 overflow-x-auto pt-4 pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectSubCategory(undefined)}
            className={`px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] rounded-full shrink-0 transition-all cursor-pointer ${
              !activeSubCategory
                ? "bg-[#111111] text-[#EAE8E1]"
                : "border border-[#D9D8D3] text-[#666666] hover:border-[#111111] hover:text-[#111111]"
            }`}
          >
            All {currentCategoryObj.name}
          </button>
          {currentCategoryObj.subcategories.map((sub) => {
            const isSubActive = activeSubCategory === sub.slug;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectSubCategory(isSubActive ? undefined : sub.slug)}
                className={`px-3 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] rounded-full shrink-0 transition-all cursor-pointer ${
                  isSubActive
                    ? "bg-[#111111] text-[#EAE8E1]"
                    : "border border-[#D9D8D3] text-[#666666] hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
