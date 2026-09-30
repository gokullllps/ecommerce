import React from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery & Shipping — PABLO",
  description: "Maison PABLO shipping policy: Complimentary express delivery, signature packaging, and white glove courier service.",
};

export default function ShippingPage() {
  return (
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container-reading py-12 sm:py-16 lg:py-20 space-y-12 relative z-10">
        <div className="border-b border-[#D9D8D3] pb-6">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#666666]">
            CLIENT CONCIERGE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] mt-1">
            Shipping & White Glove Delivery
          </h1>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light">
          <h2 className="font-serif text-2xl text-[#111111]">Complimentary Express Transit</h2>
          <p>
            Maison PABLO provides complimentary insured express courier delivery on all domestic orders across India. Orders placed before 2:00 PM IST Monday through Friday are processed and dispatched on the same business day from our central Mumbai atelier.
          </p>
          <div className="bg-white/70 border border-[#D9D8D3] p-6 space-y-2 mt-4">
            <div className="flex justify-between border-b border-[#D9D8D3] pb-2 font-medium text-[#111111]">
              <span>Service Level</span>
              <span>Estimated Transit</span>
              <span>Cost</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Standard Express Courier (Metro Hubs)</span>
              <span>1–2 Business Days</span>
              <span className="text-emerald-800 font-medium">Complimentary</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Standard Express Courier (Rest of India)</span>
              <span>2–4 Business Days</span>
              <span className="text-emerald-800 font-medium">Complimentary</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>White Glove Private Courier & Fitting</span>
              <span>Next Day by Appointment</span>
              <span>₹1,500</span>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light border-t border-[#D9D8D3] pt-8">
          <h2 className="font-serif text-2xl text-[#111111]">Signature Atelier Packaging</h2>
          <p>
            All garments arrive in our bespoke Maison PABLO archival boxes crafted from certified recycled fibers, encased in breathable canvas dust covers with custom matte cedarwood hangers. Outerwear garments include an embroidered travel garment carrier.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light border-t border-[#D9D8D3] pt-8">
          <h2 className="font-serif text-2xl text-[#111111]">Tracking & Security Signature</h2>
          <p>
            For your security, all shipments require an adult signature upon delivery. You will receive real-time SMS and email dispatch updates containing live courier tracking coordinates the moment your parcel departs our facility.
          </p>
        </section>
      </main>
    </PageWrapper>
  );
}
