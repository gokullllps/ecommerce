"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { MEN_CATEGORIES_DATA } from "@/data/categories";

const INITIAL_VISIBLE = 6;

export function CategoriesSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const hiddenCount = MEN_CATEGORIES_DATA.length - INITIAL_VISIBLE;

  const handleCollapse = () => {
    setIsExpanded(false);
    // Scroll back so the user lands near the section heading
    if (sectionRef.current) {
      const offset = 80; // account for sticky navbar height
      const top =
        sectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="categories"
      aria-label="PABLO Men's Categories"
      className="w-full bg-[#EAE8E1] text-[#111111] py-12 sm:py-16 lg:py-20 select-none"
      style={{ backgroundColor: "#EAE8E1", color: "#111111" }}
    >
      <div className="page-container">
        {/* ─── 1. SECTION TITLE ─── */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#666666] font-medium mb-3">
            Maison Portfolio · 2026
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.22em] text-[#111111] inline-block"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
          >
            CATEGORIES
          </h2>
          <div className="w-8 h-[1px] bg-[#111111] mx-auto mt-4 opacity-40" />
        </div>

        {/* ─── 2. EDITORIAL CATEGORY GRID ─── */}
        {/*
          All cards live in ONE flat grid.
          Cards beyond INITIAL_VISIBLE are hidden with aria-hidden + CSS opacity/translate.
          When expanded, they fade + slide in with a staggered delay per card.
        */}
        <div
          id="categories-grid"
          className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-10"
        >
          {MEN_CATEGORIES_DATA.map((category, index) => {
            const isHidden = index >= INITIAL_VISIBLE;
            const staggerDelay = isExpanded ? (index - INITIAL_VISIBLE) * 60 : 0;

            return (
              <div
                key={category.id}
                aria-hidden={isHidden && !isExpanded ? "true" : undefined}
                className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isHidden
                    ? isExpanded
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-6 pointer-events-none h-0 overflow-hidden !mt-0 !pt-0"
                    : "opacity-100 translate-y-0 pointer-events-auto"
                }`}
                style={
                  isHidden && isExpanded
                    ? { transitionDelay: `${staggerDelay}ms` }
                    : undefined
                }
              >
                <CategoryCard category={category} />
              </div>
            );
          })}
        </div>

        {/* ─── 3. VIEW MORE / VIEW LESS BUTTON ─── */}
        {hiddenCount > 0 && (
          <div className="flex justify-center mt-10 sm:mt-12">
            {!isExpanded ? (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="group inline-flex items-center gap-2.5 px-8 py-3 border border-[#111111] text-xs uppercase tracking-[0.24em] text-[#111111] hover:bg-[#111111] hover:text-[#EAE8E1] transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#111111]"
                aria-expanded={false}
                aria-controls="categories-grid"
              >
                <span>VIEW MORE</span>
                <span
                  className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCollapse}
                className="group inline-flex items-center gap-2.5 px-8 py-3 border border-[#111111] bg-[#111111] text-[#EAE8E1] hover:bg-transparent hover:text-[#111111] text-xs uppercase tracking-[0.24em] transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#111111]"
                aria-expanded={true}
                aria-controls="categories-grid"
              >
                <span>VIEW LESS</span>
                <span
                  className="text-[11px] transition-transform duration-300 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                >
                  ↑
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Sub-component: single category card (design unchanged) ──────────────────
function CategoryCard({
  category,
}: {
  category: (typeof MEN_CATEGORIES_DATA)[number];
}) {
  return (
    <Link
      href={category.href}
      className="group block cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] focus-visible:ring-offset-4 focus-visible:ring-offset-[#EAE8E1]"
      aria-label={`Explore ${category.name} collection`}
    >
      {/* ─── LARGE FASHION IMAGE CONTAINER WITH HOVER DYNAMICS ─── */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#DDD9D0]">
        {/* Editorial Catalogue Index Number (Top-Left) */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.24em] text-[#111111]/50 group-hover:text-[#111111] transition-colors duration-500 font-semibold bg-[#EAE8E1]/60 group-hover:bg-[#EAE8E1]/90 backdrop-blur-sm px-2 py-1 rounded-[2px]">
            {category.indexNumber}
          </span>
        </div>

        {/* Fine Micro Hairline Framing on Hover */}
        <div
          className="absolute inset-0 z-20 border border-[#111111]/0 group-hover:border-[#111111]/20 transition-colors duration-700 pointer-events-none"
          aria-hidden="true"
        />

        {/* High-Resolution Fashion Photograph with Smooth Depth Zoom */}
        <Image
          src={category.imageSrc}
          alt={category.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035] filter brightness-[0.99] group-hover:brightness-[1.02] contrast-[1.01] group-hover:contrast-[1.03]"
        />

        {/* Subtle Luxury Frosted Glass Pill (Rises Up On Hover) */}
        <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#EAE8E1]/95 backdrop-blur-md border border-[#FFFFFF]/80 px-4 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-2">
            <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.24em] uppercase text-[#111111]">
              DISCOVER
            </span>
            <span className="text-[9px] text-[#111111] transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </div>
        </div>
      </div>

      {/* ─── CATEGORY NAME WITH ANIMATED CENTER HAIRLINE ─── */}
      <div className="mt-4 sm:mt-5 text-center">
        <span
          className="inline-block relative text-xs sm:text-[13px] md:text-sm font-medium uppercase tracking-[0.2em] group-hover:tracking-[0.24em] text-[#111111] transition-all duration-500"
          style={{ fontFamily: "var(--font-body, 'Inter', sans-serif)" }}
        >
          {category.name}
          {/* Expanding Center Underline */}
          <span
            className="block w-0 group-hover:w-full h-[1px] bg-[#111111] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] mx-auto mt-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

export default CategoriesSection;
