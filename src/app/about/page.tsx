import React from "react";
import Image from "next/image";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import type { Metadata } from "next";

import { AboutHero } from "@/components/sections/AboutHero";

export const metadata: Metadata = {
  title: "About the Maison — PABLO",
  description: "Maison PABLO: Architectural silhouettes, sartorial discipline, and Italian textile excellence.",
};

export default function AboutPage() {
  return (
    <PageWrapper navbarProps={{ isHeroOverlay: true }}>
      <AboutHero />

      <main
        id="story"
        className="flex-1 page-container-reading py-16 sm:py-20 lg:py-24 space-y-16 sm:space-y-20 relative z-10 scroll-mt-14 sm:scroll-mt-16"
      >

        {/* Campaign Imagery Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[3/4] bg-[#DFDDD6] overflow-hidden">
            <Image
              src="/images/banners/about-atelier-craft.webp"
              alt="Maison PABLO Atelier Craftsmanship"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6 md:pl-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#666666]">
              ORIGIN & PURPOSE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#111111]">
              Architectural Tailoring & Textile Integrity
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-light">
              Founded with the conviction that fashion should emulate modernist sculpture, Maison PABLO rejects superfluous embellishment in favor of exacting proportion, hand-finished canvassing, and rare materials sourced from century-old mills across Biella, Como, and the Scottish Highlands.
            </p>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-light">
              Every garment undergoes a rigorous progression of prototyping, drape analysis, and sartorial refinement before entering production in limited batches.
            </p>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="border-t border-[#D9D8D3] pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <span className="font-serif text-2xl text-[#111111]">01</span>
            <h3 className="font-serif text-lg text-[#111111]">Tactile Excellence</h3>
            <p className="text-xs text-[#666666] leading-relaxed font-light">
              Double-faced virgin wool, 15-micron Mongolian cashmere, hand-loomed mulberry silks, and unwashed raw Japanese selvage denim form our foundation.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-serif text-2xl text-[#111111]">02</span>
            <h3 className="font-serif text-lg text-[#111111]">Sartorial Restraint</h3>
            <p className="text-xs text-[#666666] leading-relaxed font-light">
              Proportions are calculated to balance volume with sharpness. Clean lines, hidden closures, and balanced drops create an unmistakable presence without noise.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-serif text-2xl text-[#111111]">03</span>
            <h3 className="font-serif text-lg text-[#111111]">Conscious Permanence</h3>
            <p className="text-xs text-[#666666] leading-relaxed font-light">
              Our pieces are engineered to endure across decades. We offer complimentary lifelong repairs and garment refresh services through our atelier concierge.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-8 border-t border-[#D9D8D3] space-y-4">
          <h3 className="font-serif text-2xl text-[#111111]">Experience the Autumn / Winter 2026 Collection</h3>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/men"
              className="px-8 py-3.5 pablo-btn-dark text-[#EAE8E1] text-xs uppercase tracking-[0.2em] border border-[#222222] hover:border-white transition-all"
            >
              EXPLORE MEN
            </Link>
            <Link
              href="/women"
              className="px-8 py-3.5 border border-[#181818] text-[#181818] text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
            >
              EXPLORE WOMEN
            </Link>
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
