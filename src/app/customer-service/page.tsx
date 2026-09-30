import React from "react";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Service & Concierge — PABLO",
  description: "Maison PABLO Client Concierge: Dedicated assistance, private appointments, order guidance, and bespoke styling.",
};

export default function CustomerServicePage() {
  return (
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container-reading py-12 sm:py-16 lg:py-20 space-y-16 relative z-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#666666]">
            PRIVATE CONCIERGE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111]">
            Client Services
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Our private client concierge is available daily to assist with sizing advice, private atelier appointments, and bespoke tailoring requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 border border-[#D9D8D3] p-8 space-y-4">
            <h3 className="font-serif text-xl text-[#111111]">Private Concierge</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Direct assistance with an assigned Maison client advisor for collection previews and personal styling.
            </p>
            <p className="text-xs font-mono text-[#111111]">
              concierge@maisonpablo.com<br />
              +91 (0) 22 8900 4400
            </p>
            <span className="inline-block text-[11px] text-[#666666]">
              Monday – Sunday &bull; 9am – 9pm IST
            </span>
          </div>

          <div className="bg-white/70 border border-[#D9D8D3] p-8 space-y-4">
            <h3 className="font-serif text-xl text-[#111111]">Atelier Fitting</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Book a private fitting session at our flagship salon or arrange a White Glove home appointment with our master tailor.
            </p>
            <Link
              href="/contact"
              className="inline-block text-xs uppercase tracking-wider text-[#111111] underline underline-offset-4"
            >
              Request Private Appointment &rarr;
            </Link>
          </div>

          <div className="bg-white/70 border border-[#D9D8D3] p-8 space-y-4">
            <h3 className="font-serif text-xl text-[#111111]">Care & Alterations</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Complimentary alteration assessments on all tailored outerwear and archival garments within 60 days of acquisition.
            </p>
            <Link
              href="/faq"
              className="inline-block text-xs uppercase tracking-wider text-[#111111] underline underline-offset-4"
            >
              View Care & Sizing FAQs &rarr;
            </Link>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="border-t border-[#D9D8D3] pt-12">
          <h2 className="font-serif text-2xl text-[#111111] mb-6">Service Charters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <Link
              href="/shipping"
              className="p-4 bg-white/40 border border-[#D9D8D3] hover:border-[#111111] transition-colors"
            >
              <strong className="block text-[#111111] font-medium mb-1">Shipping & Transit</strong>
              <span className="text-[#666666]">Express timelines and worldwide couriers.</span>
            </Link>
            <Link
              href="/returns"
              className="p-4 bg-white/40 border border-[#D9D8D3] hover:border-[#111111] transition-colors"
            >
              <strong className="block text-[#111111] font-medium mb-1">Returns & Exchanges</strong>
              <span className="text-[#666666]">Complimentary 30-day collection pickup.</span>
            </Link>
            <Link
              href="/faq"
              className="p-4 bg-white/40 border border-[#D9D8D3] hover:border-[#111111] transition-colors"
            >
              <strong className="block text-[#111111] font-medium mb-1">Frequently Asked</strong>
              <span className="text-[#666666]">Authenticity, sizing, and garment care.</span>
            </Link>
            <Link
              href="/contact"
              className="p-4 bg-white/40 border border-[#D9D8D3] hover:border-[#111111] transition-colors"
            >
              <strong className="block text-[#111111] font-medium mb-1">Direct Contact</strong>
              <span className="text-[#666666]">Send a dispatch directly to our concierge.</span>
            </Link>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
