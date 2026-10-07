"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export function CampaignEditorialSection() {
  return (
    <section
      id="campaign"
      aria-label="PABLO Atelier Campaign Editorial"
      className="w-full text-[#EAE8E1] py-14 sm:py-20 lg:py-24 select-none pablo-dark-surface"
      style={{ background: "var(--gradient-dark-surface)", color: "#EAE8E1" }}
    >
      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* ─── LEFT COLUMN: MONUMENTAL EDITORIAL PHOTOGRAPH ─── */}
          <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden pablo-dark-card group">
            <Image
              src="/images/categories/outerwear.webp"
              alt="PABLO Atelier Sartorial Silhouette"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center filter brightness-[0.9] contrast-[1.08] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
            {/* Fine Edge Border */}
            <div
              className="absolute inset-0 border border-[#FFFFFF]/10 pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* ─── RIGHT COLUMN: EDITORIAL NARRATIVE & MANIFESTO ─── */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-[#999999] font-medium mb-4">
              Atelier Philosophy · 2026
            </span>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal uppercase tracking-[0.16em] leading-[1.15] text-[#FFFFFF] mb-6"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
            >
              THE ART OF<br />
              REDUCTION
            </h2>

            <div className="w-12 h-[1px] bg-[#EAE8E1]/40 mb-6" />

            <p className="text-xs sm:text-sm font-light tracking-wide text-[#D9D8D3] leading-relaxed mb-6">
              True luxury is not an accumulation of ornament, but an absolute mastery of restraint.
              Every cut is calculated to preserve tension; every hem is finished by hand to eliminate
              visual noise.
            </p>

            <p className="text-xs sm:text-sm font-light tracking-wide text-[#999999] leading-relaxed mb-10">
              Woven in heritage Biella mills and sculpted in Florence, our garments exist outside the
              transience of seasonal cycles.
            </p>

            <div>
              <Link
                href="/men?collection=editorial"
                className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em] font-medium text-[#FFFFFF] hover:text-[#D9D8D3] transition-colors py-1 group"
              >
                <span className="relative">
                  DISCOVER THE ATELIER
                  <span className="block w-full h-[1px] bg-[#FFFFFF] group-hover:bg-[#D9D8D3] transition-colors mt-1" />
                </span>
                <span className="text-[11px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
