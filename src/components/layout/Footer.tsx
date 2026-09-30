"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { DoodleStar } from "@/components/kids/KidsDoodles";
import { useSiteTheme } from "@/context/ThemeContext";
import { HiddenStar } from "@/components/kids/games/HiddenStar";

interface FooterProps {
  theme?: "normal" | "kids";
}

export function Footer({ theme: themeProp }: FooterProps = {}) {
  const pathname = usePathname();
  const { isKids: isSiteKids } = useSiteTheme();
  const isKidsRoute = themeProp === "kids" || isSiteKids || Boolean(pathname?.startsWith("/kids"));

  if (isKidsRoute) {
    return (
      <footer
        id="footer"
        aria-label="PABLO Kids Official Footer"
        className="w-full pt-12 sm:pt-14 pb-8 select-none border-t-2 border-[#181818]/15 relative overflow-hidden"
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 0,
          background: "linear-gradient(180deg, #EBF4FA 0%, #E0F2FE 45%, #D4EBF8 100%)",
          color: "#181818",
          width: "100%",
          minWidth: "100%",
        }}
      >
        {/* Soft pastel ambient background glow circles matching Kids Hero */}
        <div
          className="absolute -bottom-20 -left-20 w-[420px] h-[420px] rounded-full bg-[#FEF08A]/25 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 right-10 w-[450px] h-[350px] rounded-full bg-[#DCFCE7]/30 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="page-container relative z-10">
          {/* Zone G: Near top border divider of the Kids footer */}
          <div className="relative w-full h-0 pointer-events-none">
            <HiddenStar slotId="slot-g-footer-border-left" className="-top-3 left-6 sm:left-12 pointer-events-auto z-30" rotate="-14deg" />
            <HiddenStar slotId="slot-g-footer-border-right" className="-top-3 right-6 sm:right-12 pointer-events-auto z-30" rotate="16deg" />
          </div>

          {/* ─── TOP SECTION: BRAND WORDMARK & REGION SELECTOR ─── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 mb-8 border-b border-[#181818]/15 gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="inline-block" aria-label="PABLO — Home">
                <div className="relative h-7 sm:h-8 w-auto">
                  <Image
                    src="/images/pablo-logo.png"
                    alt="PABLO — Luxury Fashion"
                    width={566}
                    height={156}
                    className="h-full w-auto object-contain select-none opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </Link>
              <div className="relative inline-flex items-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-[#181818] border border-[#181818] text-[9.5px] font-sans font-bold tracking-wider shadow-[1px_1px_0px_#181818] relative z-10 pointer-events-none">
                  <DoodleStar className="w-2.5 h-2.5 pointer-events-none" color="#181818" strokeColor="#181818" />
                  KIDS EDITION
                </span>
                {/* Zone G: Tucked behind the Kids Edition badge border */}
                <HiddenStar slotId="slot-g-footer-wordmark" className="-top-1.5 -right-2 z-30 pointer-events-auto" rotate="10deg" />
              </div>
            </div>

            <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-[#64748B]">
              <span>LOCATION: <strong className="text-[#181818] font-bold">INDIA</strong></span>
              <span>CURRENCY: <strong className="text-[#181818] font-bold">INR (₹)</strong></span>
            </div>
          </div>

          {/* ─── MAIN FOOTER NAVIGATION COLUMNS ─── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-8 mb-10 text-xs">
            {/* Col 1: Client Relations */}
            <div>
              <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#181818] font-bold mb-4">
                Client Services
              </h3>
              <ul className="space-y-3 font-normal tracking-wide text-[#475569]">
                <li>
                  <Link href="/customer-service" className="hover:text-[#181818] transition-colors">
                    Customer Concierge
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#181818] transition-colors">
                    Private Salon Appointments
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-[#181818] transition-colors">
                    Delivery &amp; Shipping Charter
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-[#181818] transition-colors">
                    Complimentary 30-Day Returns
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#181818] transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: The Maison */}
            <div>
              <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#181818] font-bold mb-4">
                The Maison
              </h3>
              <ul className="space-y-3 font-normal tracking-wide text-[#475569]">
                <li>
                  <Link href="/kids" className="hover:text-[#181818] transition-colors font-medium text-[#181818]">
                    Kids&apos; Capsule Wardrobe
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#181818] transition-colors">
                    Biella &amp; Como Ateliers
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#181818] transition-colors">
                    Material Provenance &amp; Craft
                  </Link>
                </li>
                <li>
                  <Link href="/men" className="hover:text-[#181818] transition-colors">
                    Men&apos;s Collection
                  </Link>
                </li>
                <li>
                  <Link href="/women" className="hover:text-[#181818] transition-colors">
                    Women&apos;s Collection
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Boutiques & Salons */}
            <div>
              <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#181818] font-bold mb-4">
                Salons &amp; Boutiques
              </h3>
              <ul className="space-y-3 font-normal tracking-wide text-[#475569]">
                <li>
                  <span className="block text-[#181818] font-medium">Milan</span>
                  <span className="text-[11px] text-[#64748B]">Via Montenapoleone 18</span>
                </li>
                <li>
                  <span className="block text-[#181818] font-medium">Paris</span>
                  <span className="text-[11px] text-[#64748B]">Place Vendôme 12</span>
                </li>
                <li>
                  <span className="block text-[#181818] font-medium">Mumbai</span>
                  <span className="text-[11px] text-[#64748B]">Bandra Atelier 04</span>
                </li>
                <li>
                  <span className="block text-[#181818] font-medium">Tokyo</span>
                  <span className="text-[11px] text-[#64748B]">Ginza Six Floor 5</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal & Ethics */}
            <div>
              <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#181818] font-bold mb-4">
                Legal &amp; Privacy
              </h3>
              <ul className="space-y-3 font-normal tracking-wide text-[#475569]">
                <li>
                  <Link href="/terms" className="hover:text-[#181818] transition-colors">
                    Terms of Sale
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#181818] transition-colors">
                    Privacy Policy &amp; Data Charter
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-[#181818] transition-colors">
                    Client Account Portal
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="hover:text-[#181818] transition-colors">
                    Personal Wishlist
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ─── BOTTOM COPYRIGHT ─── */}
          <div className="pt-8 border-t border-[#181818]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64748B] font-normal">
            <p>© 2026 PABLO Haute Couture. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 font-sans tracking-wide text-xs text-[#181818] font-bold">
              PLAY. MOVE. EXPLORE. — PABLO Kids Edition
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // 100% UNCHANGED ORIGINAL PABLO DARK LUXURY FOOTER FOR ALL OTHER ROUTES
  return (
    <footer
      id="footer"
      aria-label="PABLO Haute Couture Official Footer"
      className="w-full text-[#EAE8E1] pt-12 sm:pt-14 pb-8 select-none border-t border-[#222222] pablo-dark-footer"
      style={{
        position: "sticky",
        bottom: 0,
        zIndex: 0,
        background: "var(--gradient-dark-footer)",
        color: "#EAE8E1",
        width: "100%",
        minWidth: "100%",
      }}
    >
      <div className="page-container relative z-10">
        {/* ─── TOP SECTION: BRAND WORDMARK & REGION SELECTOR ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 mb-8 border-b border-[#2A2A2A] gap-4">
          <Link href="/" className="inline-block" aria-label="PABLO — Home">
            <div className="relative h-7 sm:h-8 w-auto">
              <Image
                src="/images/pablo-logo-white.png"
                alt="PABLO — Luxury Fashion"
                width={566}
                height={156}
                className="h-full w-auto object-contain select-none opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </Link>

          <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-[#999999]">
            <span>LOCATION: <strong className="text-[#EAE8E1] font-normal">INDIA</strong></span>
            <span>CURRENCY: <strong className="text-[#EAE8E1] font-normal">INR (₹)</strong></span>
          </div>
        </div>

        {/* ─── MAIN FOOTER NAVIGATION COLUMNS ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-8 mb-10 text-xs">
          {/* Col 1: Client Relations */}
          <div>
            <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#999999] font-medium mb-4">
              Client Services
            </h3>
            <ul className="space-y-3 font-light tracking-wide text-[#D9D8D3]">
              <li>
                <Link href="/customer-service" className="hover:text-[#FFFFFF] transition-colors">
                  Customer Concierge
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FFFFFF] transition-colors">
                  Private Salon Appointments
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[#FFFFFF] transition-colors">
                  Delivery &amp; Shipping Charter
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#FFFFFF] transition-colors">
                  Complimentary 30-Day Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#FFFFFF] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: The Maison */}
          <div>
            <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#999999] font-medium mb-4">
              The Maison
            </h3>
            <ul className="space-y-3 font-light tracking-wide text-[#D9D8D3]">
              <li>
                <Link href="/about" className="hover:text-[#FFFFFF] transition-colors">
                  Biella &amp; Como Ateliers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFFFFF] transition-colors">
                  Material Provenance &amp; Craft
                </Link>
              </li>
              <li>
                <Link href="/men" className="hover:text-[#FFFFFF] transition-colors">
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-[#FFFFFF] transition-colors">
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/sale" className="hover:text-[#FFFFFF] transition-colors">
                  Numbered Archive Editions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Boutiques & Salons */}
          <div>
            <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#999999] font-medium mb-4">
              Salons &amp; Boutiques
            </h3>
            <ul className="space-y-3 font-light tracking-wide text-[#D9D8D3]">
              <li>
                <span className="block text-[#FFFFFF]">Milan</span>
                <span className="text-[11px] text-[#999999]">Via Montenapoleone 18</span>
              </li>
              <li>
                <span className="block text-[#FFFFFF]">Paris</span>
                <span className="text-[11px] text-[#999999]">Place Vendôme 12</span>
              </li>
              <li>
                <span className="block text-[#FFFFFF]">Mumbai</span>
                <span className="text-[11px] text-[#999999]">Bandra Atelier 04</span>
              </li>
              <li>
                <span className="block text-[#FFFFFF]">Tokyo</span>
                <span className="text-[11px] text-[#999999]">Ginza Six Floor 5</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Ethics */}
          <div>
            <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#999999] font-medium mb-4">
              Legal &amp; Privacy
            </h3>
            <ul className="space-y-3 font-light tracking-wide text-[#D9D8D3]">
              <li>
                <Link href="/terms" className="hover:text-[#FFFFFF] transition-colors">
                  Terms of Sale
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FFFFFF] transition-colors">
                  Privacy Policy &amp; Data Charter
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#FFFFFF] transition-colors">
                  Client Account Portal
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#FFFFFF] transition-colors">
                  Personal Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── BOTTOM COPYRIGHT ─── */}
        <div className="pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#999999] font-light">
          <p>© 2026 PABLO Haute Couture. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-serif italic text-xs text-[#666666]">
            Architectural Precision &amp; Luxury Silhouettes
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
