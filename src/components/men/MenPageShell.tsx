"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenHero from "@/components/sections/MenHero";
import MenCategorySection from "@/components/catalogue/MenCategorySection";

export interface MenPageShellProps {
  children: React.ReactNode;
}

export default function MenPageShell({ children }: MenPageShellProps) {
  const pathname = usePathname();
  const segments = (pathname || "").split("/").filter(Boolean);
  // Deep subtype pages like /men/clothing/shirts or /men/footwear/boots have 3 segments
  const isDeepSubtype = segments.length > 2;

  return (
    <div
      className="text-[#111111] font-sans w-full min-w-full bg-[#EAE8E1]"
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        minWidth: "100%",
        backgroundColor: "#EAE8E1",
      }}
    >
      {/* ── FOOTER: FIRST in DOM, visual bottom, z-index 0 ── */}
      <Footer />

      {/* ── MAIN CONTENT: SECOND in DOM, visual top, z-index 1 ── */}
      <div
        className="flex flex-col min-h-screen w-full min-w-full bg-[#EAE8E1]"
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "#EAE8E1",
          width: "100%",
          minWidth: "100%",
        }}
      >
        <Navbar />

        {/* Full-Width Men Hero — rendered once, preserved across navigation */}
        {!isDeepSubtype && (
          <div className="relative z-10 w-full">
            <MenHero />
          </div>
        )}

        {/* Main Catalogue Container */}
        <main
          id="catalogue"
          data-gender="men"
          className="page-container relative z-10 flex-1 scroll-mt-20 pt-0 sm:pt-4 lg:pt-8 pb-16 lg:pb-20"
        >
          {/* Category Cards Navigation — rendered once, preserved across navigation */}
          {!isDeepSubtype && <MenCategorySection />}

          {/* Route-specific Product Grid and Controls */}
          {children}
        </main>
      </div>
    </div>
  );
}
