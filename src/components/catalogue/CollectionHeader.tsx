"use client";

import Link from "next/link";
import React from "react";
import { Category, Collection } from "@/types/catalogue";

interface CollectionHeaderProps {
  currentCategory?: Category;
  currentSubCategoryName?: string;
  currentCollection?: Collection;
  productCount: number;
}

export function CollectionHeader({
  currentCategory,
  currentSubCategoryName,
  currentCollection,
  productCount,
}: CollectionHeaderProps) {
  const displayTitle =
    currentSubCategoryName ??
    currentCategory?.name ??
    currentCollection?.name ??
    "All Men's Collection";

  const displayDescription =
    currentCategory?.description ??
    currentCollection?.description ??
    "A restrained exploration of proportion, texture, and sartorial precision for the modern masculine silhouette.";

  return (
    <header className="w-full border-b border-[#D9D8D3] pb-8 pt-4 sm:pt-6 mb-8 sm:mb-12 select-none">
      {/* Main Title & Description Grid */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#666666] font-medium mb-2">
            Pablo Haute Couture
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight uppercase text-[#111111] leading-[1.08]"
            style={{ fontFamily: "'Beverly', var(--font-editorial), serif", fontKerning: "normal" }}
          >
            {displayTitle}
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#666666] leading-relaxed font-light max-w-xl">
            {displayDescription}
          </p>
        </div>

        <div className="flex items-center self-start lg:self-end">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#666666] font-light">
            {productCount} {productCount === 1 ? "Piece" : "Pieces"}
          </span>
        </div>
      </div>
    </header>
  );
}
