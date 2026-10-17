"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useShop } from "@/context/ShopContext";
import { useSiteTheme } from "@/context/ThemeContext";
import { searchProducts } from "@/data/products";
import { formatPrice } from "@/lib/catalogueUtils";

const OVERLAY_NAV_ITEMS = [
  { id: "men", label: "MEN", href: "/men" },
  { id: "women", label: "WOMEN", href: "/women" },
  { id: "kids", label: "KIDS", href: "/kids" },
  { id: "sale", label: "SALE", href: "/sale" },
  { id: "about", label: "ABOUT", href: "/about" },
];

interface NavbarProps {
  isIntroActive?: boolean;
  isHeroOverlay?: boolean;
  isStaticPage?: boolean;
  theme?: "normal" | "kids";
  isCardsActive?: boolean;
}

type ActivePopover = "search" | "account" | "wishlist" | "cart" | null;

export function Navbar({
  isIntroActive = false,
  isHeroOverlay = false,
  theme: themeProp,
  isCardsActive = false,
}: NavbarProps) {
  const pathname = usePathname();
  const { isKids: isSiteKids } = useSiteTheme();
  const isKidsRoute = themeProp === "kids" || isSiteKids || Boolean(pathname?.startsWith("/kids"));
  const {
    cart,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
    wishlist,
    wishlistCount,
    toggleWishlist,
    setIsCartOpen,
    setIsSearchOpen,
  } = useShop();
  const [menuOverlayOpen, setMenuOverlayOpen] = useState(false);

  // Floating Popover State — Exactly one panel open at a time
  const [activePopover, setActivePopover] = useState<ActivePopover>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const utilityContainerRef = useRef<HTMLDivElement>(null);

  const togglePopover = (popover: ActivePopover) => {
    setActivePopover((prev) => (prev === popover ? null : popover));
  };

  const closeAllPopovers = () => {
    setActivePopover(null);
  };

  // Live filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const found = searchProducts(searchQuery);
    if (isKidsRoute) {
      const kidsOnly = found.filter((p) => p.gender === "kids");
      return kidsOnly.length > 0 ? kidsOnly : found;
    }
    return found;
  }, [searchQuery, isKidsRoute]);

  // Focus search input when search popover is opened
  useEffect(() => {
    if (activePopover === "search") {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
    }
  }, [activePopover]);

  // Close active popover on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePopover(null);
      }
    };
    if (activePopover) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [activePopover]);

  // Close active popover on click outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (
        utilityContainerRef.current &&
        !utilityContainerRef.current.contains(e.target as Node)
      ) {
        setActivePopover(null);
      }
    };
    if (activePopover) {
      document.addEventListener("mousedown", handlePointerDown);
      return () => document.removeEventListener("mousedown", handlePointerDown);
    }
  }, [activePopover]);

  // Scroll state for luxury transparent-to-opaque navbar transition
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInsideHeroScroll, setIsInsideHeroScroll] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Subtle luxury entrance reveal on page mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      if (isHeroOverlay) {
        const heroEl =
          document.getElementById("hero-scroll-container") ||
          document.getElementById("men-hero-scroll-container") ||
          document.getElementById("women-hero-scroll-container") ||
          document.querySelector('[id$="-hero-scroll-container"]');
        if (heroEl) {
          // The hero scroll container pins content for (heroEl.offsetHeight - window.innerHeight)
          const heroScrollLimit = heroEl.offsetTop + heroEl.offsetHeight - window.innerHeight;
          // Only after scrolling past the hero page (leaving hero container and entering New In / Catalogue):
          const hasPassedHero = scrollY >= Math.max(heroScrollLimit - 40, 300);

          setIsScrolled(hasPassedHero);
          // When scrolling down inside hero page (scrollY > 24), the navbar must NOT appear!
          setIsInsideHeroScroll((scrollY > 24 && !hasPassedHero) || (isCardsActive && !hasPassedHero));
          return;
        }
      }

      setIsScrolled(scrollY > 24);
      setIsInsideHeroScroll(false);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isHeroOverlay, isCardsActive]);

  // Lock body scroll when overlay menu is open, restore on close
  useEffect(() => {
    if (menuOverlayOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [menuOverlayOpen]);

  // Support keyboard navigation: Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOverlayOpen(false);
      }
    };
    if (menuOverlayOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [menuOverlayOpen]);

  // Close menu upon navigation
  const handleCloseMenu = () => {
    setMenuOverlayOpen(false);
  };

  // Check active navigation link
  const isItemActive = (id: string, href: string) => {
    if (!pathname) return false;
    if (id === "kids") {
      return Boolean(isKidsRoute);
    }
    if (href === "/sale") {
      return pathname === "/sale" || pathname.startsWith("/sale/");
    }
    if (href === "/about") {
      return pathname === "/about" || pathname.startsWith("/about/");
    }
    if (href === "/men") {
      return pathname === "/men" || pathname.startsWith("/men/");
    }
    if (href === "/women") {
      return pathname === "/women" || pathname.startsWith("/women/");
    }
    return pathname === href;
  };

  // Regular & static pages: immediately visible with subtle background tint and dark text
  // Hero overlay pages: completely transparent with white text at page top, transitions to opaque when scrolled past hero
  const isTransparentOverlay = Boolean(isHeroOverlay) && (!isScrolled || menuOverlayOpen);
  const isOpaque = !isTransparentOverlay && !menuOverlayOpen;
  const isKidsOpaque = isOpaque;

  const actionColorClass = isTransparentOverlay
    ? "text-white/95 hover:text-white"
    : "text-[#111111] hover:text-[#666666]";

  return (
    <>
      {/* Subtle click-outside backdrop for active popover */}
      {activePopover && (
        <div
          className="fixed inset-0 z-40 bg-black/[0.02] cursor-default pointer-events-auto"
          onClick={closeAllPopovers}
          aria-hidden="true"
        />
      )}

      <header
        className={`sticky top-0 ${isKidsRoute ? "z-[100]" : "z-50"} w-full select-none ${
          isHeroOverlay ? "-mb-16 sm:-mb-20 md:-mb-22" : ""
        } ${
          isIntroActive || isInsideHeroScroll
            ? "opacity-0 pointer-events-none -translate-y-full"
            : !isRevealed
            ? "opacity-0 pointer-events-none -translate-y-2.5"
            : "opacity-100 pointer-events-auto translate-y-0"
        }`}
        style={{
          backgroundColor: menuOverlayOpen
            ? "transparent"
            : isTransparentOverlay
            ? "transparent"
            : isKidsRoute
            ? isScrolled
              ? "rgba(235, 244, 250, 0.96)"
              : "rgba(235, 244, 250, 0.92)"
            : isScrolled
            ? "rgba(234, 232, 225, 0.96)"
            : "rgba(234, 232, 225, 0.92)",
          backdropFilter: menuOverlayOpen || isTransparentOverlay ? "none" : "blur(12px)",
          WebkitBackdropFilter: menuOverlayOpen || isTransparentOverlay ? "none" : "blur(12px)",
          borderBottom: menuOverlayOpen || isTransparentOverlay
            ? "1px solid transparent"
            : isKidsRoute
            ? "1px solid rgba(24, 24, 24, 0.08)"
            : "1px solid rgba(217, 216, 211, 0.65)",
          boxShadow: menuOverlayOpen || isTransparentOverlay
            ? "none"
            : isScrolled
            ? "0 4px 20px -4px rgba(0, 0, 0, 0.04)"
            : "0 1px 3px 0 rgba(0, 0, 0, 0.02)",
          transition:
            "background-color 250ms ease-out, backdrop-filter 250ms ease-out, -webkit-backdrop-filter 250ms ease-out, border-color 250ms ease-out, box-shadow 250ms ease-out, opacity 400ms ease-out, transform 400ms ease-out",
        }}
      >
        {/* ─── FULL-WIDTH EDITORIAL NAVBAR ─── */}
        <div className="relative w-full h-16 sm:h-20 md:h-22 flex items-center justify-between px-5 sm:px-8 lg:px-10 xl:px-12">
          {/* Left: + Contact Us */}
          <div className="flex items-center z-10 min-w-0 shrink-0">
            <Link
              href="/contact"
              onClick={handleCloseMenu}
              className={`group inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs tracking-[0.11em] uppercase font-medium transition-all duration-200 ease-out hover:-translate-y-[2px] motion-reduce:hover:translate-y-0 opacity-85 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current ${actionColorClass}`}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 ease-out group-hover:rotate-90 shrink-0"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="select-none">Contact Us</span>
            </Link>
          </div>

          {/* Center: The existing PABLO logo, precisely centered horizontally and vertically */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto flex items-center justify-center">
            <Link
              href="/"
              onClick={handleCloseMenu}
              className="group flex items-center justify-center py-1 transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.99] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
              aria-label="PABLO — Home"
            >
              <div
                className="relative h-7 sm:h-8 md:h-9 lg:h-10 w-auto flex items-center transition-all duration-200 ease-out"
                style={{
                  filter: isTransparentOverlay
                    ? "brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.45))"
                    : "none",
                }}
              >
                <Image
                  src="/images/pablo-logo.webp"
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

          {/* Right: Visible Navigation Links (Desktop) + Utility Icons + Mobile Drawer Toggle */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 z-10 ml-auto">
            {/* Desktop Navigation Links: MEN | WOMEN | KIDS | SALE | ABOUT */}
            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center gap-3.5 xl:gap-5"
            >
              {OVERLAY_NAV_ITEMS.map((item) => {
                const isActive = isItemActive(item.id, item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`group relative inline-flex items-center py-1 text-[11px] xl:text-[11.5px] font-medium tracking-[0.10em] uppercase select-none cursor-pointer
                      transition-transform duration-200 ease-out hover:-translate-y-[2px] motion-reduce:hover:translate-y-0
                      after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:bg-current
                      after:transition-all after:duration-200 after:ease-out motion-reduce:after:transition-none
                      ${
                        isActive
                          ? "opacity-100 after:w-full"
                          : "opacity-80 hover:opacity-100 after:w-0 hover:after:w-full"
                      }
                      ${actionColorClass}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Subtle Vertical Divider between Navigation Links and Utility Icons (Desktop) */}
            <span
              className={`hidden lg:block h-3.5 w-[1px] transition-colors duration-200 ${
                isTransparentOverlay ? "bg-white/30" : "bg-[#111111]/25"
              }`}
              aria-hidden="true"
            />

            {/* Utility Icons: Search | Account | Wishlist | Shopping Bag */}
            <div ref={utilityContainerRef} className="relative flex items-center gap-1 sm:gap-1.5">
              {/* Search icon */}
              <button
                type="button"
                onClick={() => togglePopover("search")}
                aria-expanded={activePopover === "search"}
                aria-haspopup="dialog"
                aria-label="Search silhouettes and collections"
                className={`group/icon relative inline-flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full transition-all duration-200 ease-out hover:ring-1 hover:ring-current/25 hover:bg-current/[0.05] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current
                  ${activePopover === "search" ? "ring-1 ring-current/30 bg-current/[0.08]" : ""}
                  after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[1.5px] after:bg-current after:rounded-full after:transition-all after:duration-200 after:ease-out
                  ${activePopover === "search" ? "after:w-3.5 opacity-100" : "after:w-0 group-hover/icon:after:w-3.5 opacity-85 hover:opacity-100"}
                  ${actionColorClass}`}
              >
                <span className="transition-transform duration-200 ease-out group-hover/icon:scale-[1.08] flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
              </button>

              {/* Account icon */}
              <button
                type="button"
                onClick={() => togglePopover("account")}
                aria-expanded={activePopover === "account"}
                aria-haspopup="dialog"
                aria-label="Client account portal"
                className={`group/icon relative hidden sm:inline-flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full transition-all duration-200 ease-out hover:ring-1 hover:ring-current/25 hover:bg-current/[0.05] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current
                  ${activePopover === "account" ? "ring-1 ring-current/30 bg-current/[0.08]" : ""}
                  after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[1.5px] after:bg-current after:rounded-full after:transition-all after:duration-200 after:ease-out
                  ${activePopover === "account" ? "after:w-3.5 opacity-100" : "after:w-0 group-hover/icon:after:w-3.5 opacity-85 hover:opacity-100"}
                  ${actionColorClass}`}
              >
                <span className="transition-transform duration-200 ease-out group-hover/icon:scale-[1.08] flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
              </button>

              {/* Wishlist icon */}
              <button
                type="button"
                onClick={() => togglePopover("wishlist")}
                aria-expanded={activePopover === "wishlist"}
                aria-haspopup="dialog"
                aria-label={`Wishlist (${wishlistCount} items)`}
                className={`group/icon relative hidden sm:inline-flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full transition-all duration-200 ease-out hover:ring-1 hover:ring-current/25 hover:bg-current/[0.05] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current
                  ${activePopover === "wishlist" ? "ring-1 ring-current/30 bg-current/[0.08]" : ""}
                  after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[1.5px] after:bg-current after:rounded-full after:transition-all after:duration-200 after:ease-out
                  ${activePopover === "wishlist" ? "after:w-3.5 opacity-100" : "after:w-0 group-hover/icon:after:w-3.5 opacity-85 hover:opacity-100"}
                  ${actionColorClass}`}
              >
                <span className="transition-transform duration-200 ease-out group-hover/icon:scale-[1.08] flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 font-mono text-[8.5px] leading-none px-1 py-0.5 min-w-[13px] text-center bg-[#111111] text-white rounded-full border border-white/20">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag icon */}
              <button
                type="button"
                onClick={() => togglePopover("cart")}
                aria-expanded={activePopover === "cart"}
                aria-haspopup="dialog"
                aria-label={`Shopping Bag (${cartCount} items)`}
                className={`group/icon relative inline-flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full transition-all duration-200 ease-out hover:ring-1 hover:ring-current/25 hover:bg-current/[0.05] active:scale-95 motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current cursor-pointer
                  ${activePopover === "cart" ? "ring-1 ring-current/30 bg-current/[0.08]" : ""}
                  after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[1.5px] after:bg-current after:rounded-full after:transition-all after:duration-200 after:ease-out
                  ${activePopover === "cart" ? "after:w-3.5 opacity-100" : "after:w-0 group-hover/icon:after:w-3.5 opacity-85 hover:opacity-100"}
                  ${actionColorClass}`}
              >
                <span className="transition-transform duration-200 ease-out group-hover/icon:scale-[1.08] flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 font-mono text-[8.5px] leading-none px-1 py-0.5 min-w-[13px] text-center bg-[#111111] text-white rounded-full border border-white/20">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Only: Hamburger Menu Button (lg:hidden) */}
              <button
                type="button"
                onClick={() => setMenuOverlayOpen(true)}
                aria-label="Open navigation menu"
                className={`lg:hidden group inline-flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-200 ease-out hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current ${actionColorClass}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </svg>
              </button>

              {/* ─── LUXURY FLOATING POPOVER CONTAINER (REUSING OLD MENU POPUP CARD ANIMATION) ─── */}
              {activePopover && (
                <div
                  role="dialog"
                  aria-modal="false"
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute top-full right-0 mt-3 border z-[200] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none text-[#111111] animate-in fade-in slide-in-from-bottom-2 zoom-in-95`}
                  style={{
                    backgroundColor: "rgba(234, 232, 225, 0.82)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    borderColor: "rgba(217, 216, 211, 0.85)",
                    boxShadow: "0 16px 40px -8px rgba(17, 17, 17, 0.08), 0 4px 16px -2px rgba(17, 17, 17, 0.03)",
                  }}
                >
                  {/* Subtle Pointer Notch anchored to the active icon */}
                  <div
                    className="absolute -top-[5px] w-2.5 h-2.5 border-t border-l rotate-45 transition-all duration-200 pointer-events-none"
                    style={{
                      backgroundColor: "rgba(234, 232, 225, 0.95)",
                      borderColor: "rgba(217, 216, 211, 0.85)",
                      right:
                        activePopover === "cart"
                          ? "12px"
                          : activePopover === "wishlist"
                          ? "46px"
                          : activePopover === "account"
                          ? "80px"
                          : "114px",
                    }}
                  />

                  {/* ─── 1. SEARCH POPOVER PANEL ─── */}
                  {activePopover === "search" && (
                    <div className="w-[340px] sm:w-[390px] max-w-[calc(100vw-32px)]">
                      {/* Search Input Bar */}
                      <div className="relative p-3.5 border-b border-[#D9D8D3]/70 bg-white/30 backdrop-blur-sm">
                        <div className="relative flex items-center">
                          <svg
                            className="absolute left-3 w-3.5 h-3.5 text-[#666666] pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="1.5" />
                          </svg>
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search silhouettes, materials, codes..."
                            className="w-full pl-8 pr-7 py-2 text-xs bg-white/60 hover:bg-white/75 focus:bg-white/90 border border-[#D9D8D3] rounded-sm text-[#111111] placeholder:text-[#666666] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/15 transition-all"
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery("")}
                              className="absolute right-2 text-[#666666] hover:text-[#111111] p-1 cursor-pointer"
                              aria-label="Clear search query"
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Default Suggestions (when input is empty) */}
                      {!searchQuery.trim() ? (
                        <div className="p-4 space-y-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#666666] block mb-2 font-medium">
                              Popular Searches
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {["Outerwear", "Cashmere", "Tailoring", "Silk", "Tote", "Footwear"].map((term) => (
                                <button
                                  key={term}
                                  type="button"
                                  onClick={() => setSearchQuery(term)}
                                  className="text-[11px] px-2.5 py-1 bg-white/45 hover:bg-[#111111] text-[#222222] hover:text-white border border-[#D9D8D3]/70 hover:border-[#111111] transition-all rounded-sm cursor-pointer"
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#D9D8D3]/60">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#666666] block mb-2 font-medium">
                              Editorial Collections
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <Link
                                href="/men"
                                onClick={closeAllPopovers}
                                className="text-[#333333] hover:text-[#111111] hover:translate-x-0.5 transition-all py-0.5"
                              >
                                → New In Men
                              </Link>
                              <Link
                                href="/women"
                                onClick={closeAllPopovers}
                                className="text-[#333333] hover:text-[#111111] hover:translate-x-0.5 transition-all py-0.5"
                              >
                                → New In Women
                              </Link>
                              <Link
                                href="/kids"
                                onClick={closeAllPopovers}
                                className="text-[#333333] hover:text-[#111111] hover:translate-x-0.5 transition-all py-0.5"
                              >
                                → Kids Wardrobe
                              </Link>
                              <Link
                                href="/sale"
                                onClick={closeAllPopovers}
                                className="text-[#333333] hover:text-[#111111] hover:translate-x-0.5 transition-all py-0.5"
                              >
                                → Seasonal Sale
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Live Working Product Search Results */
                        <div className="max-h-72 overflow-y-auto divide-y divide-[#D9D8D3]/50">
                          {searchResults.length > 0 ? (
                            searchResults.slice(0, 4).map((product) => (
                              <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                onClick={closeAllPopovers}
                                className="group/item flex items-center gap-3 p-3 hover:bg-white/40 transition-colors"
                              >
                                <div className="relative w-11 h-14 bg-[#DFDDD6]/70 shrink-0 overflow-hidden border border-[#D9D8D3]/60">
                                  <Image
                                    src={product.primaryImage || product.images?.[0]?.url || "/images/pablo-hero-cutout.webp"}
                                    alt={product.name}
                                    fill
                                    className="object-cover object-top transition-transform duration-300 group-hover/item:scale-105"
                                    sizes="44px"
                                    unoptimized
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="block text-[9.5px] uppercase tracking-wider text-[#666666] truncate">
                                    {product.category || product.gender}
                                  </span>
                                  <span className="block text-xs font-serif text-[#111111] group-hover/item:underline truncate">
                                    {product.name}
                                  </span>
                                  <span className="block text-[11px] font-mono text-[#333333] mt-0.5">
                                    {formatPrice(product.price)}
                                  </span>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="p-6 text-center text-xs text-[#666666]">
                              No silhouettes found matching &ldquo;{searchQuery}&rdquo;.
                              <div className="mt-3">
                                <Link
                                  href="/men"
                                  onClick={closeAllPopovers}
                                  className="text-[11px] uppercase tracking-wider text-[#111111] underline underline-offset-4"
                                >
                                  Browse Collections
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ─── 2. ACCOUNT POPOVER PANEL ─── */}
                  {activePopover === "account" && (
                    <div className="w-[300px] sm:w-[320px] max-w-[calc(100vw-32px)]">
                      <div className="p-4 border-b border-[#D9D8D3]/70 bg-white/30 backdrop-blur-sm">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#666666] block">
                          Client Portal
                        </span>
                        <h3 className="font-serif text-base text-[#111111] mt-0.5">
                          Maison PABLO Account
                        </h3>
                        <p className="text-[11px] text-[#555555] mt-1 leading-relaxed">
                          Access your private appointments, order archive, and tailored wishlist.
                        </p>
                      </div>

                      <div className="p-4 space-y-2 border-b border-[#D9D8D3]/70">
                        <Link
                          href="/account"
                          onClick={closeAllPopovers}
                          className="w-full block py-2.5 px-4 text-center bg-[#111111] text-[#EAE8E1] text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-[#2c2c2c] transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/account"
                          onClick={closeAllPopovers}
                          className="w-full block py-2 px-4 text-center border border-[#111111]/70 bg-white/40 hover:bg-white/70 text-[#111111] text-[11px] uppercase tracking-[0.14em] font-medium transition-colors"
                        >
                          Create Account
                        </Link>
                      </div>

                      <div className="p-3 text-xs divide-y divide-[#D9D8D3]/50">
                        <Link
                          href="/account"
                          onClick={closeAllPopovers}
                          className="flex items-center justify-between py-2 px-2 text-[#444444] hover:text-[#111111] hover:bg-white/40 transition-colors"
                        >
                          <span>Orders & Appointments</span>
                          <span className="text-[#888888]">→</span>
                        </Link>
                        <Link
                          href="/contact"
                          onClick={closeAllPopovers}
                          className="flex items-center justify-between py-2 px-2 text-[#444444] hover:text-[#111111] hover:bg-white/40 transition-colors"
                        >
                          <span>Client Concierge</span>
                          <span className="text-[#888888]">→</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* ─── 3. WISHLIST POPOVER PANEL ─── */}
                  {activePopover === "wishlist" && (
                    <div className="w-[330px] sm:w-[360px] max-w-[calc(100vw-32px)]">
                      <div className="p-3.5 border-b border-[#D9D8D3]/70 flex items-center justify-between bg-white/30 backdrop-blur-sm">
                        <div>
                          <span className="text-[9.5px] uppercase tracking-[0.2em] text-[#666666] block">
                            Personal Curation
                          </span>
                          <h3 className="font-serif text-sm text-[#111111]">
                            Your Wishlist
                          </h3>
                        </div>
                        <span className="font-mono text-[11px] px-2 py-0.5 bg-[#111111] text-white rounded-full">
                          {wishlistCount}
                        </span>
                      </div>

                      {wishlistCount === 0 ? (
                        <div className="p-6 text-center text-xs text-[#666666] space-y-2">
                          <p>Your curation is currently empty.</p>
                          <p className="text-[11px] text-[#777777]">
                            Select the heart icon on any garment to reserve it here.
                          </p>
                          <div className="pt-2">
                            <Link
                              href="/men"
                              onClick={closeAllPopovers}
                              className="inline-block py-2 px-4 bg-[#111111] text-white text-[10.5px] uppercase tracking-[0.14em]"
                            >
                              Explore Collections
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="max-h-60 overflow-y-auto divide-y divide-[#D9D8D3]/50">
                            {wishlist.map((item) => (
                              <div
                                key={item.productId}
                                className="flex items-center justify-between p-3 hover:bg-white/40 transition-colors group/wish"
                              >
                                <Link
                                  href={`/product/${item.product.slug}`}
                                  onClick={closeAllPopovers}
                                  className="flex items-center gap-2.5 flex-1 min-w-0"
                                >
                                  <div className="relative w-10 h-13 bg-[#DFDDD6]/70 shrink-0 overflow-hidden border border-[#D9D8D3]/60">
                                    <Image
                                      src={item.product.primaryImage || item.product.images?.[0]?.url || "/images/pablo-hero-cutout.webp"}
                                      alt={item.product.name}
                                      fill
                                      className="object-cover object-top"
                                      sizes="40px"
                                      unoptimized
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="block text-xs font-serif text-[#111111] truncate group-hover/wish:underline">
                                      {item.product.name}
                                    </span>
                                    <span className="block text-[11px] font-mono text-[#444444]">
                                      {formatPrice(item.product.price)}
                                    </span>
                                  </div>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => toggleWishlist(item.product)}
                                  className="text-[#888888] hover:text-[#111111] p-1.5 transition-colors cursor-pointer"
                                  aria-label="Remove from wishlist"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="p-3 border-t border-[#D9D8D3]/70 bg-white/30 backdrop-blur-sm">
                            <Link
                              href="/wishlist"
                              onClick={closeAllPopovers}
                              className="w-full block py-2.5 text-center bg-[#111111] text-[#EAE8E1] text-[10.5px] uppercase tracking-[0.14em] font-medium hover:bg-[#2c2c2c] transition-colors"
                            >
                              View Full Wishlist ({wishlistCount})
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ─── 4. SHOPPING BAG (MINI-CART) POPOVER PANEL ─── */}
                  {activePopover === "cart" && (
                    <div className="w-[340px] sm:w-[370px] max-w-[calc(100vw-32px)]">
                      <div className="p-3.5 border-b border-[#D9D8D3]/70 flex items-center justify-between bg-white/30 backdrop-blur-sm">
                        <div>
                          <span className="text-[9.5px] uppercase tracking-[0.2em] text-[#666666] block">
                            Editorial Order
                          </span>
                          <h3 className="font-serif text-sm text-[#111111]">
                            Shopping Bag
                          </h3>
                        </div>
                        <span className="font-mono text-[11px] px-2 py-0.5 bg-[#111111] text-white rounded-full">
                          {cartCount}
                        </span>
                      </div>

                      {cartCount === 0 ? (
                        <div className="p-6 text-center text-xs text-[#666666] space-y-2">
                          <p>Your shopping bag is currently empty.</p>
                          <div className="pt-2">
                            <Link
                              href="/men"
                              onClick={closeAllPopovers}
                              className="inline-block py-2 px-4 bg-[#111111] text-white text-[10.5px] uppercase tracking-[0.14em]"
                            >
                              Discover New Arrivals
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="max-h-64 overflow-y-auto divide-y divide-[#D9D8D3]/50">
                            {cart.map((item) => (
                              <div key={item.id} className="p-3 flex items-start gap-3 hover:bg-white/40 transition-colors">
                                <div className="relative w-12 h-16 bg-[#DFDDD6]/70 shrink-0 overflow-hidden border border-[#D9D8D3]/60">
                                  <Image
                                    src={item.image || "/images/pablo-hero-cutout.webp"}
                                    alt={item.name}
                                    fill
                                    className="object-cover object-top"
                                    sizes="48px"
                                    unoptimized
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/product/${item.slug}`}
                                    onClick={closeAllPopovers}
                                    className="block text-xs font-serif text-[#111111] truncate hover:underline"
                                  >
                                    {item.name}
                                  </Link>
                                  <div className="text-[10px] text-[#666666] mt-0.5">
                                    Size {item.size} • {item.color}
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    {/* Compact Quantity Control */}
                                    <div className="flex items-center border border-[#D9D8D3] bg-white/70 text-[10px]">
                                      <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-5 h-5 flex items-center justify-center hover:bg-[#EAE8E1] cursor-pointer"
                                        aria-label="Decrease quantity"
                                      >
                                        −
                                      </button>
                                      <span className="w-5 text-center font-mono">{item.quantity}</span>
                                      <button
                                        type="button"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-5 h-5 flex items-center justify-center hover:bg-[#EAE8E1] cursor-pointer"
                                        aria-label="Increase quantity"
                                      >
                                        +
                                      </button>
                                    </div>
                                    <span className="text-[11px] font-mono font-medium text-[#111111]">
                                      {formatPrice(item.price * item.quantity)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-[#888888] hover:text-[#111111] p-1 transition-colors cursor-pointer"
                                  aria-label="Remove item"
                                >
                                  <svg width="11" height="11" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="p-3.5 border-t border-[#D9D8D3]/70 bg-white/30 backdrop-blur-sm space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#666666] uppercase tracking-wider text-[10px]">Subtotal</span>
                              <span className="font-mono font-medium text-[#111111] text-sm">{formatPrice(cartSubtotal)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                href="/cart"
                                onClick={closeAllPopovers}
                                className="block py-2 text-center border border-[#111111]/70 bg-white/40 hover:bg-white/70 text-[#111111] text-[10px] uppercase tracking-[0.14em] font-medium transition-colors"
                              >
                                View Bag
                              </Link>
                              <Link
                                href="/cart"
                                onClick={closeAllPopovers}
                                className="block py-2 text-center bg-[#111111] text-white text-[10px] uppercase tracking-[0.14em] font-medium hover:bg-[#2c2c2c] transition-colors"
                              >
                                Checkout
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── LUXURY SLIDE-OVER DRAWER MENU (IN EXACT REFERENCE RATIO) ─── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`fixed inset-0 z-[200] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOverlayOpen
            ? "visible pointer-events-auto"
            : "invisible pointer-events-none"
        }`}
      >
        {/* Softly Dimmed & Blurred Backdrop */}
        <div
          onClick={handleCloseMenu}
          aria-hidden="true"
          className={`absolute inset-0 bg-black/45 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
            menuOverlayOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Slide-over Drawer Panel (Matching Reference Ratio ~38-40%) */}
        <div
          className={`absolute top-0 right-0 h-full w-full sm:w-[440px] md:w-[480px] lg:w-[40%] xl:w-[38%] max-w-[540px] bg-[#FFFFFF] text-[#111111] shadow-[-16px_0_50px_rgba(0,0,0,0.18)] flex flex-col justify-between overflow-y-auto overscroll-contain transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            menuOverlayOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Top Bar with PABLO Logo and Circular Close Button (matching Gucci reference) */}
          <div className="flex items-center justify-between px-8 sm:px-12 md:px-14 pt-8 pb-4 shrink-0">
            <Link
              href="/"
              onClick={handleCloseMenu}
              className="flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] transition-opacity hover:opacity-80"
              aria-label="PABLO — Home"
            >
              <div className="relative h-6 sm:h-7 w-auto flex items-center">
                <Image
                  src="/images/pablo-logo.webp"
                  alt="PABLO — Luxury Fashion"
                  width={566}
                  height={156}
                  priority
                  unoptimized
                  className="h-full w-auto object-contain select-none"
                />
              </div>
            </Link>

            {/* Circular Close Button (Black circle with white X, matching reference) */}
            <button
              type="button"
              onClick={handleCloseMenu}
              aria-label="Close navigation menu"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#111111] text-white hover:bg-[#2c2c2c] active:scale-95 transition-all duration-300 hover:rotate-90 shadow-md flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Navigation Links with Smooth Staggered Reveal Animation */}
          <div className="flex-1 px-8 sm:px-12 md:px-14 py-8 flex flex-col justify-center">
            {/* Primary Categories (MEN, WOMEN, KIDS, SALE, ABOUT) */}
            <nav aria-label="Menu Navigation" className="space-y-4 sm:space-y-5">
              {OVERLAY_NAV_ITEMS.map((item, index) => (
                <div
                  key={item.id}
                  className="transform transition-all duration-500 ease-out"
                  style={{
                    transitionDelay: menuOverlayOpen ? `${100 + index * 45}ms` : "0ms",
                    transform: menuOverlayOpen ? "translateX(0)" : "translateX(20px)",
                    opacity: menuOverlayOpen ? 1 : 0,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={handleCloseMenu}
                    className="group inline-flex items-center text-xl sm:text-2xl md:text-[26px] font-normal tracking-[0.04em] text-[#111111] hover:text-[#666666] hover:translate-x-1.5 transition-all duration-200 py-1"
                  >
                    <span>{item.label}</span>
                  </Link>
                </div>
              ))}
            </nav>

            {/* Secondary Services & Utilities matching Gucci Reference Layout */}
            <div className="mt-10 pt-8 border-t border-[#D9D8D3]/70 space-y-3 sm:space-y-3.5">
              <div
                className="transform transition-all duration-500 ease-out"
                style={{
                  transitionDelay: menuOverlayOpen ? "350ms" : "0ms",
                  transform: menuOverlayOpen ? "translateX(0)" : "translateX(20px)",
                  opacity: menuOverlayOpen ? 1 : 0,
                }}
              >
                <Link
                  href="/contact"
                  onClick={handleCloseMenu}
                  className="group inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] tracking-[0.08em] text-[#444444] hover:text-[#111111] transition-colors py-0.5"
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-200 group-hover:rotate-90 shrink-0"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Contact Us</span>
                </Link>
              </div>

              <div
                className="transform transition-all duration-500 ease-out"
                style={{
                  transitionDelay: menuOverlayOpen ? "390ms" : "0ms",
                  transform: menuOverlayOpen ? "translateX(0)" : "translateX(20px)",
                  opacity: menuOverlayOpen ? 1 : 0,
                }}
              >
                <Link
                  href="/account"
                  onClick={handleCloseMenu}
                  className="inline-block text-[13px] sm:text-[14px] tracking-[0.08em] text-[#444444] hover:text-[#111111] transition-colors py-0.5"
                >
                  Account
                </Link>
              </div>

              <div
                className="transform transition-all duration-500 ease-out"
                style={{
                  transitionDelay: menuOverlayOpen ? "430ms" : "0ms",
                  transform: menuOverlayOpen ? "translateX(0)" : "translateX(20px)",
                  opacity: menuOverlayOpen ? 1 : 0,
                }}
              >
                <Link
                  href="/wishlist"
                  onClick={handleCloseMenu}
                  className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] tracking-[0.08em] text-[#444444] hover:text-[#111111] transition-colors py-0.5"
                >
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#111111] text-white rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              <div
                className="transform transition-all duration-500 ease-out"
                style={{
                  transitionDelay: menuOverlayOpen ? "470ms" : "0ms",
                  transform: menuOverlayOpen ? "translateX(0)" : "translateX(20px)",
                  opacity: menuOverlayOpen ? 1 : 0,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    handleCloseMenu();
                    setIsCartOpen(true);
                  }}
                  className="inline-flex items-center gap-2 text-[13px] sm:text-[14px] tracking-[0.08em] text-[#444444] hover:text-[#111111] transition-colors py-0.5 cursor-pointer"
                >
                  <span>Shopping Bag</span>
                  {cartCount > 0 && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#111111] text-white rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Client Utilities (Location & Currency) */}
          <div className="px-8 sm:px-12 md:px-14 py-6 border-t border-[#D9D8D3]/70 bg-[#FBFBFA] shrink-0">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-[0.06em] text-[#777777]">
              <span>Location: India</span>
              <span>Currency: INR (₹)</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
