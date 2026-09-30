"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export function FeaturedCollectionSection() {
  return (
    <section
      id="featured-collection"
      aria-label="PABLO Featured Campaign — The Autumn / Winter Edit"
      className="w-full relative overflow-hidden bg-[#050505] text-[#FFFFFF] select-none min-h-[500px] sm:min-h-[560px] lg:min-h-[640px] flex items-center group"
    >
      {/* Background High-Fashion Campaign Image — Full Width */}
      <div className="absolute inset-0">
        <Image
          src="/images/categories/knitwear.jpg"
          alt="PABLO Autumn / Winter 2026 Collection Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top sm:object-center filter brightness-[0.80] contrast-[1.05] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
        />
        {/* Subtle Editorial Gradient Vignette */}
        <div
          className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#050505]/95 via-[#111111]/60 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Editorial Content Overlay — Aligned to Master Page Container */}
      <div className="page-container relative z-10 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl text-[#FFFFFF]">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-[#EAE8E1]/75 font-medium mb-3 sm:mb-4 block">
            Maison Campaign · Vol. 04
          </span>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal uppercase tracking-[0.14em] sm:tracking-[0.18em] leading-[1.1] mb-4 sm:mb-6"
            style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
          >
            THE AUTUMN /<br />
            WINTER EDIT
          </h2>

          <p className="text-xs sm:text-sm font-light tracking-wide text-[#EAE8E1]/85 leading-relaxed max-w-lg mb-8 sm:mb-10">
            A study in sartorial proportion, dense Italian virgin wool, and seamless cashmere.
            Engineered silhouettes designed for contemplative presence.
          </p>

          <div>
            <Link
              href="/men?collection=new-season"
              className="inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 bg-[#EAE8E1] text-[#111111] hover:bg-[#FFFFFF] text-xs uppercase tracking-[0.24em] font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
            >
              <span>Shop Collection</span>
              <span className="text-[11px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
