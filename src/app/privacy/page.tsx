import React from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Charter — PABLO",
  description: "Maison PABLO Client Data Charter and privacy protection protocols.",
};

export default function PrivacyPage() {
  return (
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container-reading py-12 sm:py-16 lg:py-20 space-y-10 relative z-10">
        <div className="border-b border-[#D9D8D3] pb-6">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#666666]">
            LEGAL NOTICE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
            Privacy Charter & Data Governance
          </h1>
          <p className="text-xs text-[#666666] mt-1">Last revised: September 2026</p>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light">
          <h2 className="font-serif text-xl text-[#111111]">1. Commitment to Client Confidentiality</h2>
          <p>
            Maison PABLO holds client privacy as a cornerstone of luxury service. We collect and process personal information strictly to fulfill bespoke orders, coordinate white glove courier delivery, and extend private collection invitations. We never monetize, sell, or rent client data to third-party commercial brokers.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light border-t border-[#D9D8D3] pt-8">
          <h2 className="font-serif text-xl text-[#111111]">2. Information Collected</h2>
          <p>
            When you register an account or acquire garments, we collect necessary contact information (name, address, telephone, email), measurements (if recorded for tailoring), and transaction records. Payment credentials are processed via PCI-DSS Level 1 certified gateways and are never stored in plain text.
          </p>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-[#444444] leading-relaxed font-light border-t border-[#D9D8D3] pt-8">
          <h2 className="font-serif text-xl text-[#111111]">3. Your Rights & Data Custody</h2>
          <p>
            Clients may review, rectify, or request complete expungement of their personal profile and history at any time by contacting privacy@maisonpablo.com.
          </p>
        </section>
      </main>
    </PageWrapper>
  );
}
