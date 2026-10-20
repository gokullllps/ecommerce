"use client";

import React from "react";
import Link from "next/link";
import collectionsData from "@/data/collections.json";
import { AdminCollection } from "@/types/admin";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";

export interface CollectionEditorialGridProps {
  collections?: AdminCollection[];
  className?: string;
}

export function CollectionEditorialGrid({
  collections,
  className = "",
}: CollectionEditorialGridProps) {
  // Use passed collections or load from collections.json
  const allCollections: AdminCollection[] = (collections || (collectionsData as unknown as AdminCollection[])).filter(
    (c) => c.status === "active" || !c.status
  );

  // Take the top 3 editorial collections
  const editorialCollections = allCollections.slice(0, 3);

  return (
    <section
      id="editorial-collections"
      aria-label="PABLO Featured Editorial Collections"
      className={`w-full py-16 sm:py-24 lg:py-28 bg-[#EAE8E1] text-[#111111] select-none ${className}`}
      style={{
        backgroundColor: "#EAE8E1",
      }}
    >
      <div className="page-container w-full">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-14 lg:mb-16 pb-4 border-b border-[#D9D8D3]">
          <div>
            <RevealOnScroll direction="up" distance={15} duration={700}>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#666666] font-medium block mb-2 sm:mb-3">
                CAMPAIGN EDITIONS · AUTUMN / WINTER 2026
              </span>
            </RevealOnScroll>

            <RevealOnScroll direction="up" distance={25} duration={850} delay={0}>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal uppercase tracking-[0.04em] text-[#111111] leading-none"
                style={{
                  fontFamily: "'Orborn', sans-serif",
                  fontKerning: "normal",
                }}
              >
                COLLECTIONS
              </h2>
            </RevealOnScroll>
          </div>

          <RevealOnScroll direction="up" distance={15} duration={700} delay={160}>
            <div className="mt-4 md:mt-0 flex items-center gap-6">
              <span className="text-[11px] font-mono tracking-widest text-[#999999] uppercase">
                [03 EDITIONS]
              </span>
              <Link
                href="/men"
                className="group inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.24em] font-medium text-[#111111] hover:text-[#666666] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
              >
                <span>VIEW ALL</span>
                <span
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>

        {/* ── 3 LARGE EDITORIAL CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full">
          {editorialCollections.map((col, index) => (
            <CollectionCard
              key={col.id || col.slug || index}
              collection={col}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CollectionEditorialGrid;
