import React from "react";
import Image from "next/image";
import PageWrapper from "@/components/layout/PageWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sale — PABLO",
  description: "PABLO — Distinctive luxury fashion editorial sale.",
};

export default function SalePage() {
  return (
    <PageWrapper navbarProps={{ isHeroOverlay: true }}>
      <main className="w-full min-h-[100svh] relative bg-[#181818] overflow-hidden -mt-px">
        {/* Large, full-width, cinematic hero filling entire viewport */}
        <section
          aria-label="PABLO Sale Campaign Hero"
          className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden bg-[#181818]"
        >
          <Image
            src="/images/sale-hero-damask-sofa.png"
            alt="PABLO Sale Campaign — Vintage Recline on a Damask Sofa"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[42%_center] sm:object-center w-full h-full select-none"
          />
        </section>
      </main>
    </PageWrapper>
  );
}
