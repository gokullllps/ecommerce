import React from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions of Sale — PABLO",
  description: "Terms and conditions of sale and client service for Maison PABLO.",
};

export default function TermsPage() {
  return (
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container-reading py-12 sm:py-16 lg:py-20 space-y-10 relative z-10">
        <div className="border-b border-[#D9D8D3] pb-6">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#666666]">
            LEGAL NOTICE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
            Terms & Conditions of Sale
          </h1>
          <p className="text-xs text-[#666666] mt-1">Effective Date: Autumn / Winter 2026</p>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light">
          <h2 className="font-serif text-xl text-[#111111]">1. Scope & Jurisdiction</h2>
          <p>
            These General Terms and Conditions govern all acquisitions of garments, leather goods, and accessories executed through the Maison PABLO digital flagship and private client concierge.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light border-t border-[#D9D8D3] pt-8">
          <h2 className="font-serif text-xl text-[#111111]">2. Limited Editions & Availability</h2>
          <p>
            Given our dedication to textile provenance and artisanal small-batch construction, all items are offered subject to limited quantity limits. An order confirmation email certifies receipt of your purchase request; order execution is finalized upon parcel dispatch and assignment of tracking coordinates.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light border-t border-[#D9D8D3] pt-8">
          <h2 className="font-serif text-xl text-[#111111]">3. Pricing & Currency</h2>
          <p>
            All prices displayed on the Indian digital storefront are denominated in Indian Rupees (INR) and are inclusive of applicable goods and service taxes (GST) and domestic delivery duties.
          </p>
        </section>
      </main>
    </PageWrapper>
  );
}
