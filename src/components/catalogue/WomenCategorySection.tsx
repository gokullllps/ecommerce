"use client";

import React from "react";
import Link from "next/link";

interface WomenCategorySectionProps {
  currentDepartment?: string;
}

const CATEGORY_CARDS = [
  {
    id: "tops",
    title: "TOPS",
    href: "/women/clothing?category=tops#catalogue",
    image: "/images/categories/women-category-tops.jpg",
    alt: "Women's Luxury Tops & Tailoring",
  },
  {
    id: "bottoms",
    title: "BOTTOMS",
    href: "/women/clothing?category=trousers#catalogue",
    image: "/images/categories/women-category-bottoms.jpg",
    alt: "Women's Wide-Leg & Tailored Bottoms",
  },
  {
    id: "footwear",
    title: "FOOTWEAR",
    href: "/women/footwear#catalogue",
    image: "/images/categories/women-category-footwear.jpg",
    alt: "Women's Architectural Footwear",
  },
  {
    id: "accessories",
    title: "ACCESSORIES",
    href: "/women/accessories#catalogue",
    image: "/images/categories/women-category-accessories.jpg",
    alt: "Women's Leather Accessories & Bags",
  },
];

export default function WomenCategorySection({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentDepartment,
}: WomenCategorySectionProps) {
  return (
    <section aria-label="Women's Categories" className="w-full select-none pt-4 sm:pt-6 lg:pt-8">
      {/* ─── SECTION HEADING: CATEGORIES ─── */}
      <div className="text-center mb-5 sm:mb-7 lg:mb-8 pt-1 sm:pt-2">
        <span className="block text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.28em] text-[#666666] font-medium mb-1.5">
          COLLECTION
        </span>
        <h2
          className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal uppercase tracking-[0.2em] text-[#111111]"
        >
          CATEGORIES
        </h2>
        <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-2.5 sm:mt-3 opacity-30" />
      </div>

      {/* ─── CATEGORY DISCOVERY CARDS (2x2 on Mobile, 4x1 on Desktop) ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4 mb-5 sm:mb-7">
        {CATEGORY_CARDS.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="group relative block aspect-[0.78/1] overflow-hidden bg-[#181818] border border-[#181818]/15 hover:border-[#181818] transition-colors cursor-pointer select-none"
          >
            {/* Full HD Pristine Image - No downsampling, no compression, no blur */}
            <img
              src={card.image}
              alt={card.alt}
              className="w-full h-full object-cover block"
              style={{
                objectPosition: "center center",
                filter: "none",
                opacity: 1,
                transform: "translateZ(0)",
              }}
              loading="eager"
            />

            {/* Subtle bottom gradient only behind text for legibility without darkening subject */}
            <div
              className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Bottom Content: Category Name + EXPLORE → */}
            <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3.5 z-10 flex flex-col items-start justify-end">
              <span className="block font-sans text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.16em] uppercase text-white leading-tight">
                {card.title}
              </span>
              <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-sans tracking-[0.2em] uppercase text-white/80 mt-1 group-hover:text-white transition-colors">
                EXPLORE <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
