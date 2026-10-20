"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CinematicSection } from "@/components/animation/CinematicSection";
import { Reveal } from "@/components/animation/Reveal";
import { Parallax } from "@/components/animation/Parallax";

export function FeaturedCollectionSection() {
  return (
    <CinematicSection
      id="featured-collection"
      aria-label="PABLO Featured Campaign — The Autumn / Winter Edit"
      className="w-full relative overflow-hidden bg-[#050505] text-[#FFFFFF] select-none min-h-[500px] sm:min-h-[560px] lg:min-h-[640px] flex items-center group"
    >
      {/* Background High-Fashion Campaign Image — Full Width with Subtle Parallax */}
      <Parallax speed={0.03} maxOffset={20} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <Image
          src="/images/banners/featured-cashmere-suite.webp"
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
      </Parallax>

      {/* Editorial Content Overlay — Aligned to Master Page Container */}
      <div className="page-container relative z-10 w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl text-[#FFFFFF]">
          <Reveal direction="up" distance={16} delay={100}>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-[#EAE8E1]/75 font-medium mb-3 sm:mb-4 block">
              Maison Campaign · Vol. 04
            </span>
          </Reveal>

          <Reveal direction="up" distance={25} delay={200}>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal uppercase tracking-[0.03em] sm:tracking-[0.04em] leading-[1.1] mb-4 sm:mb-6"
              style={{ fontFamily: "'Orborn', sans-serif", fontKerning: "normal" }}
            >
              THE AUTUMN /<br />
              WINTER EDIT
            </h2>
          </Reveal>

          <Reveal direction="up" distance={20} delay={300}>
            <p className="text-xs sm:text-sm font-light tracking-wide text-[#EAE8E1]/85 leading-relaxed max-w-lg mb-8 sm:mb-10">
              A study in sartorial proportion, dense Italian virgin wool, and seamless cashmere.
              Engineered silhouettes designed for contemplative presence.
            </p>

            <div>
              <Link
                href="/men?collection=new-season"
                className="group pablo-btn-luxury inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 bg-[#EAE8E1] text-[#111111] hover:bg-[#FFFFFF] text-xs uppercase tracking-[0.24em] font-medium transition-all duration-300 shadow-sm hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
              >
                <span>Shop Collection</span>
                <span className="btn-arrow text-[11px]" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </CinematicSection>
  );
}
