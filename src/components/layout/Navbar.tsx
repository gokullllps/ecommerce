"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useRef } from "react";
import { useShop } from "@/context/ShopContext";
import { useSiteTheme } from "@/context/ThemeContext";
import { NAVIGATION_DATA } from "@/data/navigation";
import { NavbarDropdown } from "./MegaMenu";

interface NavbarProps {
  isIntroActive?: boolean;
  isHeroOverlay?: boolean;
  isStaticPage?: boolean;
  theme?: "normal" | "kids";
}

export function Navbar({ isIntroActive = false, theme: themeProp }: NavbarProps) {
  const pathname = usePathname();
  const { isKids: isSiteKids } = useSiteTheme();
  const isKidsRoute = themeProp === "kids" || isSiteKids || Boolean(pathname?.startsWith("/kids"));
  const { cartCount, wishlistCount, setIsCartOpen, setIsSearchOpen } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);

  // Active dropdown state (e.g. 'men', 'women', 'kids', etc.)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll state for luxury transparent-to-opaque navbar transition
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Regular pages: opaque when scrolled OR dropdown open OR mobile menu open
  const isOpaque = isScrolled || activeMenuId !== null || mobileMenuOpen;
  // Kids pages: ONLY opaque when scrolled — keeps gradient visible during dropdown hover
  const isKidsOpaque = isScrolled || mobileMenuOpen;

  const handleNavMouseEnter = (menuId: string, hasDropdown: boolean) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    if (hasDropdown) {
      setActiveMenuId(menuId);
    } else {
      setActiveMenuId(null);
    }
  };

  const handleNavMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenuId(null);
    }, 180);
  };

  const handleCloseMenu = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenuId(null);
    setMobileMenuOpen(false);
  };

  const navActions = (
    <div className="flex items-center space-x-1 sm:space-x-2">
      {/* Search trigger */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        aria-label="Open search"
        className={`text-[#111111] hover:text-[#666666] transition-all p-2 focus-visible:outline-2 focus-visible:outline-[#111111] cursor-pointer ${
          isKidsRoute ? "rounded-full hover:bg-white/80 hover:border border-[#181818]" : ""
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={isKidsRoute ? "1.8" : "1.4"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {/* Account Icon */}
      <Link
        href="/account"
        aria-label="My Account"
        className={`text-[#111111] hover:text-[#666666] transition-all p-2 focus-visible:outline-2 focus-visible:outline-[#111111] ${
          isKidsRoute ? "rounded-full hover:bg-white/80 hover:border border-[#181818]" : ""
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={isKidsRoute ? "1.8" : "1.4"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
        </svg>
      </Link>

      {/* Wishlist Icon */}
      <Link
        href="/wishlist"
        aria-label={`Wishlist (${wishlistCount} items)`}
        className={`text-[#111111] hover:text-[#666666] transition-all p-2 relative focus-visible:outline-2 focus-visible:outline-[#111111] ${
          isKidsRoute ? "rounded-full hover:bg-white/80 hover:border border-[#181818]" : ""
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={isKidsRoute ? "1.8" : "1.4"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        {wishlistCount > 0 && (
          <span
            className={`absolute top-1 right-0 min-w-[13px] h-[13px] px-0.5 flex items-center justify-center text-[8.5px] font-medium rounded-full ${
              isKidsRoute
                ? "bg-[#F472B6] text-[#181818] border border-[#181818] font-bold shadow-[1px_1px_0px_#181818]"
                : "pablo-dark-badge text-[#EAE8E1] font-mono"
            }`}
          >
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* Shopping Bag Icon / Trigger */}
      <button
        id="kids-bag-icon"
        type="button"
        onClick={() => setIsCartOpen(true)}
        aria-label={`Shopping Bag (${cartCount} items)`}
        className={`text-[#111111] hover:text-[#666666] transition-all p-2 relative focus-visible:outline-2 focus-visible:outline-[#111111] cursor-pointer ${
          isKidsRoute ? "rounded-full hover:bg-white/80 hover:border border-[#181818]" : ""
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={isKidsRoute ? "1.8" : "1.4"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        {cartCount > 0 && (
          <span
            className={`absolute top-1 right-0 min-w-[14px] h-[14px] px-0.5 flex items-center justify-center text-[9px] font-medium rounded-full ${
              isKidsRoute
                ? "bg-[#FEF08A] text-[#181818] border border-[#181818] font-bold shadow-[1px_1px_0px_#181818]"
                : "pablo-dark-badge text-[#EAE8E1] font-mono"
            }`}
          >
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <header
      className={`sticky top-0 ${isKidsRoute ? "z-[100]" : "z-50"} w-full select-none ${
        isKidsRoute
          ? isOpaque
            ? "border-b border-[#181818]/10"
            : "border-b-0"
          : "border-b"
      } ${
        isIntroActive
          ? "opacity-0 pointer-events-none -translate-y-2"
          : "opacity-100 pointer-events-auto translate-y-0"
      }`}
      style={{
        backgroundColor: isKidsRoute
          ? isKidsOpaque
            ? "rgba(235, 244, 250, 0.82)"
            : "transparent"
          : isOpaque
          ? "rgba(234, 232, 225, 0.96)"
          : "rgba(234, 232, 225, 0.08)",
        backdropFilter: isKidsRoute
          ? isKidsOpaque
            ? "blur(12px)"
            : "none"
          : isOpaque
          ? "blur(8px)"
          : "blur(0px)",
        WebkitBackdropFilter: isKidsRoute
          ? isKidsOpaque
            ? "blur(12px)"
            : "none"
          : isOpaque
          ? "blur(8px)"
          : "blur(0px)",
        borderBottomColor: isKidsRoute
          ? isKidsOpaque
            ? "rgba(24, 24, 24, 0.08)"
            : "transparent"
          : isOpaque
          ? "rgba(217, 216, 211, 0.8)"
          : "transparent",
        boxShadow: isKidsRoute
          ? isKidsOpaque
            ? "0 4px 16px -2px rgba(24, 24, 24, 0.04)"
            : "none"
          : isOpaque
          ? "0 4px 20px -4px rgba(0, 0, 0, 0.03)"
          : "none",
        transition:
          "background-color 320ms cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 320ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-backdrop-filter 320ms cubic-bezier(0.22, 1, 0.36, 1), border-color 320ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease, transform 300ms ease",
      }}
    >

      <div className="page-container h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Brand Logo - 100% UNCHANGED */}
        <div className="flex-1 flex items-center justify-start">
          <Link
            href="/"
            onClick={handleCloseMenu}
            className="flex items-center space-x-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] transition-opacity hover:opacity-85 py-1"
            aria-label="PABLO — Home"
          >
            <div className="relative h-8 sm:h-9 md:h-10 w-auto flex items-center">
              <Image
                src="/images/pablo-logo.png"
                alt="PABLO — Luxury Fashion"
                width={566}
                height={156}
                priority
                unoptimized
                className="h-full w-auto object-contain select-none"
              />
            </div>
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center space-x-2 lg:space-x-6"
        >
          {NAVIGATION_DATA.map((link, idx) => {
            const isHovered = activeMenuId === link.id;
            const isKidsActive = isKidsRoute && link.id === "kids";
            const align = idx > 4 ? "right" : "left";
            return (
              <div
                key={link.id}
                onMouseEnter={() => handleNavMouseEnter(link.id, link.hasDropdown)}
                onMouseLeave={handleNavMouseLeave}
                className="relative py-3.5"
              >
                {isKidsActive ? (
                  <Link
                    href={link.href}
                    onClick={() => {
                      handleCloseMenu();
                      try {
                        sessionStorage.removeItem("pablo-kids-scroll-y");
                      } catch {}
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] text-[#181818] font-bold text-xs tracking-wider border-2 border-[#181818] shadow-[2px_2px_0px_#181818] transform hover:scale-105 transition-all select-none"
                  >
                    <svg className="w-2.5 h-2.5 fill-[#181818]" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>KIDS</span>
                  </Link>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => {
                      handleCloseMenu();
                      if (link.id === "kids") {
                        try {
                          sessionStorage.removeItem("pablo-kids-scroll-y");
                        } catch {}
                      }
                    }}
                    className={`text-xs sm:text-[13px] tracking-[0.16em] uppercase transition-colors duration-200 relative px-2.5 py-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] ${
                      isKidsRoute
                        ? "hover:bg-black/5 font-semibold text-[#181818]"
                        : isHovered
                        ? "text-[#111111] font-medium hover:text-[#666666]"
                        : "text-[#111111] hover:text-[#666666] font-normal"
                    }`}
                  >
                    {link.label}
                    {link.id === "sale" && (
                      <span className="absolute top-1/2 -translate-y-1/2 -right-2 w-1.5 h-1.5 rounded-full bg-[#111111] opacity-80" />
                    )}
                  </Link>
                )}

                {/* Compact Vertical Dropdown List directly underneath this item */}
                <NavbarDropdown
                  items={link.items}
                  isOpen={isHovered}
                  onClose={handleCloseMenu}
                  align={align}
                />
              </div>
            );
          })}
        </nav>

        {/* Right Column: Search + Account, Wishlist, Bag */}
        <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-3">
          {navActions}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#111111] hover:text-[#666666] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown (Expandable Accordion Sections) */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-6 sm:px-12 py-4 ${
            isKidsRoute
              ? "bg-[#EBF4FA] border-t-2 border-[#181818]"
              : "bg-[#EAE8E1] border-t border-[#D9D8D3]"
          } space-y-2 max-h-[80vh] overflow-y-auto`}
        >
          {NAVIGATION_DATA.map((link) => {
            const isExpanded = expandedMobileSection === link.id;
            return (
              <div key={link.id} className={`${isKidsRoute ? "border-b border-[#181818]/15" : "border-b border-[#D9D8D3]/50"} pb-2`}>
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    onClick={handleCloseMenu}
                    className={`block py-1.5 text-xs tracking-[0.16em] uppercase ${
                      isKidsRoute && link.id === "kids"
                        ? "text-[#181818] font-bold"
                        : "text-[#111111] hover:text-[#666666] font-medium"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {link.items && link.items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpandedMobileSection(isExpanded ? null : link.id)}
                      className={`p-1 text-sm ${isKidsRoute ? "text-[#181818] font-bold" : "text-[#666666]"}`}
                      aria-label={`Expand ${link.label} submenu`}
                    >
                      {isExpanded ? "−" : "+"}
                    </button>
                  )}
                </div>

                {/* Expanded mobile links */}
                {isExpanded && link.items && (
                  <ul className={`divide-y ${isKidsRoute ? "divide-[#181818]/10 bg-white/90 border-l-2 border-[#181818] rounded-r-xl shadow-[1px_1px_0px_#181818]" : "divide-[#D9D8D3]/40 bg-white/60 border-l-2 border-[#111111]"} my-1`}>
                    {link.items.map((sublink) => (
                      <li key={sublink.label}>
                        <Link
                          href={sublink.href}
                          onClick={handleCloseMenu}
                          className={`block py-2.5 px-4 text-xs tracking-[0.16em] uppercase ${
                            isKidsRoute ? "text-[#181818] font-medium hover:bg-[#FEF08A]/40" : "text-[#111111] hover:bg-black/5"
                          }`}
                        >
                          {sublink.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
}

export default Navbar;
