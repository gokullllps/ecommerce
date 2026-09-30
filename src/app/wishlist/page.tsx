"use client";

import React from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { ProductCard } from "@/components/catalogue/ProductCard";
import PageWrapper from "@/components/layout/PageWrapper";

export default function WishlistPage() {
  const { wishlist, wishlistCount } = useShop();

  return (
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container py-8 sm:py-10 lg:py-12 relative z-10">
        {/* Header */}
        <div className="border-b border-[#D9D8D3] pb-6 mb-10 text-center max-w-xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#666666]">
            PERSONAL CURATION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] mt-2">
            YOUR WISHLIST
          </h1>
          <p className="text-xs text-[#666666] mt-2">
            {wishlistCount} {wishlistCount === 1 ? "garment saved" : "garments saved"} for your private consideration.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/60 border border-[#D9D8D3] flex items-center justify-center text-[#999999]">
              <svg className="w-8 h-8 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-[#111111]">Your curation is currently empty</h2>
            <p className="text-xs text-[#666666] leading-relaxed">
              Explore the collection and click the heart icon on any silhouette to reserve it in your personal wishlist.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/men"
                className="px-6 py-3.5 pablo-btn-dark text-[#EAE8E1] text-xs font-medium uppercase tracking-[0.2em] border border-[#222222] hover:border-white transition-all"
              >
                EXPLORE MEN
              </Link>
              <Link
                href="/women"
                className="px-6 py-3.5 border border-[#181818] text-[#181818] text-xs font-medium uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
              >
                EXPLORE WOMEN
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {wishlist.map((item) => (
              <ProductCard key={item.productId} product={item.product} />
            ))}
          </div>
        )}
      </main>
    </PageWrapper>
  );
}
