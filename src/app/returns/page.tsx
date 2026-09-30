import React from "react";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchanges — PABLO",
  description: "Maison PABLO returns charter: 30-day complimentary courier pickup and seamless exchanges.",
};

export default function ReturnsPage() {
  return (
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container-reading py-12 sm:py-16 lg:py-20 space-y-12 relative z-10">
        <div className="border-b border-[#D9D8D3] pb-6">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#666666]">
            POLICY CHARTER
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] mt-1">
            Complimentary Returns & Exchanges
          </h1>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light">
          <h2 className="font-serif text-2xl text-[#111111]">30-Day Client Guarantee</h2>
          <p>
            Maison PABLO gladly accepts returns and exchanges within thirty (30) days from the date of delivery. All returns are complimentary. Our courier will collect the package directly from your address at a time coordinated to suit your schedule.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light border-t border-[#D9D8D3] pt-8">
          <h2 className="font-serif text-2xl text-[#111111]">Conditions for Return</h2>
          <ul className="list-disc list-inside space-y-2 text-xs">
            <li>Garments must be in new, unworn, unwashed, and unaltered condition with all original Maison PABLO tags and security seals intact.</li>
            <li>Footwear must include the original shoe box and dust bags with zero sole abrasions. We recommend trying footwear on clean, carpeted surfaces.</li>
            <li>Bespoke commissioned pieces and made-to-measure tailored garments are non-returnable unless defective.</li>
          </ul>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light border-t border-[#D9D8D3] pt-8">
          <h2 className="font-serif text-2xl text-[#111111]">How to Initiate a Return</h2>
          <ol className="list-decimal list-inside space-y-2 text-xs">
            <li>Access your order in the <Link href="/account" className="underline font-medium text-[#111111]">Client Account</Link> or contact our concierge via email at concierge@maisonpablo.com.</li>
            <li>Select the items you wish to exchange or return, specifying your preferred collection window.</li>
            <li>Place the garments inside the original protective packaging and seal with the included return label.</li>
            <li>Upon inspection at our atelier (usually within 48 hours of receipt), your refund or replacement will be initiated immediately.</li>
          </ol>
        </section>
      </main>
    </PageWrapper>
  );
}
