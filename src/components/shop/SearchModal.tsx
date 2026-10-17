"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useSiteTheme } from "@/context/ThemeContext";
import { searchProducts } from "@/data/products";
import { formatPrice } from "@/lib/catalogueUtils";
import { Product } from "@/types/catalogue";
import { DoodleCloud, DoodleStar } from "@/components/kids/KidsDoodles";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, openQuickShop } = useShop();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { isKids: isSiteKids } = useSiteTheme();
  const isKids = isSiteKids || Boolean(pathname?.startsWith("/kids"));

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  // Live filter results
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const found = searchProducts(query);
    // If on kids route, prioritize kids products
    if (isKids) {
      const kidsOnly = found.filter((p) => p.gender === "kids");
      setResults(kidsOnly.length > 0 ? kidsOnly : found);
    } else {
      setResults(found);
    }
  }, [query, isKids]);

  // Handle escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const quickCategories = isKids
    ? [
        { label: "ALL KIDS", href: "/kids" },
        { label: "BOYS", href: "/kids#kids-collection" },
        { label: "GIRLS", href: "/kids#kids-collection" },
        { label: "BABY & TODDLER", href: "/kids#kids-collection" },
        { label: "CLOTHING", href: "/kids#kids-collection" },
        { label: "FOOTWEAR", href: "/kids#kids-collection" },
      ]
    : [
        { label: "NEW ARRIVALS", href: "/men" },
        { label: "OUTERWEAR", href: "/men/outerwear" },
        { label: "KNITWEAR", href: "/men/knitwear" },
        { label: "TAILORING", href: "/men/tailoring" },
        { label: "WOMEN", href: "/women" },
        { label: "KIDS", href: "/kids" },
        { label: "SALE", href: "/sale" },
      ];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col animate-in fade-in duration-200 ${
        isKids ? "bg-[#EBF4FA]" : "bg-[#EAE8E1]"
      }`}
    >
      {/* Top Header / Search Bar */}
      <div
        className={`w-full ${
          isKids
            ? "border-b-2 border-[#181818] bg-[#FEF08A]/70 shadow-[0_2px_0px_#181818]"
            : "border-b border-[#D9D8D3]"
        }`}
      >
        <div className="page-container py-4 sm:py-6 flex items-center gap-4 sm:gap-6">
        {isKids ? (
          <div className="w-8 h-8 rounded-full bg-[#FEF08A] border-2 border-[#181818] flex items-center justify-center shadow-[1px_1px_0px_#181818] shrink-0">
            <svg className="w-4 h-4 fill-[#181818]" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        ) : (
          <svg className="w-5 h-5 text-[#666666] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isKids
              ? "Search Kids tees, hoodies, trousers, sneakers..."
              : "Search products, silhouettes, fabrics, collections..."
          }
          className={`flex-1 bg-transparent border-none text-lg lg:text-2xl ${
            isKids
              ? "font-sans font-bold text-[#181818] placeholder-[#777]"
              : "font-serif text-[#111111] placeholder-[#999999]"
          } focus:outline-none`}
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className={`text-xs uppercase tracking-wider ${
              isKids
                ? "px-2.5 py-1 rounded-full border border-[#181818] bg-white text-[#181818] font-bold text-[10px]"
                : "text-[#666666] hover:text-[#111111]"
            }`}
          >
            Clear
          </button>
        )}

        <button
          onClick={() => setIsSearchOpen(false)}
          className={`p-2 transition-colors cursor-pointer ${
            isKids
              ? "rounded-full border-2 border-[#181818] bg-white hover:bg-[#FEF08A] text-[#181818] shadow-[1px_1px_0px_#181818]"
              : "text-[#666666] hover:text-[#111111]"
          }`}
          aria-label="Close search"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isKids ? "2.5" : "1.5"} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        </div>
      </div>

      {/* Body: Quick suggestions or Live Results */}
      <div className="flex-1 overflow-y-auto py-8">
        <div className="page-container">
        {!query.trim() ? (
          <div className="max-w-3xl space-y-8">
            <div>
              <p
                className={`text-[11px] uppercase tracking-[0.2em] mb-4 font-bold ${
                  isKids ? "text-[#181818]" : "font-sans text-[#999999]"
                }`}
              >
                {isKids ? "POPULAR KIDS CATEGORIES" : "SUGGESTED SEARCHES"}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickCategories.map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    onClick={() => setIsSearchOpen(false)}
                    className={`px-4 py-2 text-xs font-sans tracking-wider transition-all ${
                      isKids
                        ? "bg-white border-2 border-[#181818] rounded-full text-[#181818] font-bold shadow-[2px_2px_0px_#181818] hover:bg-[#FEF08A]"
                        : "bg-white/70 hover:bg-white text-[#111111] border border-[#D9D8D3]"
                    }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p
                className={`text-[11px] uppercase tracking-[0.2em] mb-2 font-bold ${
                  isKids ? "text-[#181818]" : "font-sans text-[#999999]"
                }`}
              >
                {isKids ? "PLAYFUL LUXURY" : "EDITORIAL INSPIRATION"}
              </p>
              <p
                className={`leading-relaxed ${
                  isKids
                    ? "font-sans text-sm text-[#475569] font-medium"
                    : "font-serif text-base text-[#666666] italic"
                }`}
              >
                {isKids
                  ? "Explore scaled-down tailoring, organic Supima cotton tees, and cloud-soft knitwear built for movement, play, and curiosity."
                  : "Discover the Autumn / Winter 2026 campaign featuring double-faced virgin wool coats, structured silk blazers, and ultra-fine cashmere turtlenecks."}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div
              className={`flex items-baseline justify-between mb-6 pb-2 ${
                isKids ? "border-b-2 border-[#181818]" : "border-b border-[#D9D8D3]"
              }`}
            >
              <p
                className={`text-xs uppercase tracking-wider ${
                  isKids ? "font-sans font-bold text-[#181818]" : "font-sans text-[#666666]"
                }`}
              >
                {results.length} {results.length === 1 ? "Result" : "Results"} for &ldquo;{query}&rdquo;
              </p>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16 kids-reveal-scale">
                {isKids ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#FEF08A] border-2 border-[#181818] shadow-[3px_3px_0px_#181818] flex items-center justify-center mb-3 animate-kids-float">
                      <DoodleCloud className="w-10 h-auto" color="#FFFFFF" borderColor="#181818" borderWidth={2} />
                    </div>
                    <p className="font-sans font-black text-lg text-[#181818] uppercase tracking-wider">
                      Oops! Nothing hiding here.
                    </p>
                    <p className="font-sans text-xs text-[#555] font-medium mt-1.5 max-w-xs">
                      Try searching for &ldquo;tee&rdquo;, &ldquo;jacket&rdquo;, &ldquo;pants&rdquo;, or &ldquo;sneakers&rdquo;!
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-serif text-xl text-[#111111]">No garments found</p>
                    <p className="font-sans text-xs text-[#666666] mt-2">
                      Try refining your search terms or explore our curated collections.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {results.map((product, idx) => (
                  <div
                    key={product.id}
                    className={`group flex flex-col ${
                      isKids
                        ? `bg-white border-2 border-[#181818] rounded-xl p-2.5 shadow-[3px_3px_0px_#181818] kids-grid-enter kids-stagger-${Math.min(idx + 1, 8)}`
                        : ""
                    }`}
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className={`relative aspect-[3/4] overflow-hidden mb-3 ${
                        isKids ? "rounded-lg border border-[#181818]" : "bg-[#DFDDD6]"
                      }`}
                    >
                      <Image
                        src={product.primaryImage || product.images?.[0]?.url || "/images/pablo-hero-cutout.webp"}
                        alt={product.images?.[0]?.alt || product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={`object-cover ${
                          isKids
                            ? "kids-card-img group-hover:scale-105"
                            : "group-hover:scale-105 transition-transform duration-500"
                        }`}
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span
                          className={`text-[10px] uppercase tracking-wider ${
                            isKids ? "font-bold text-[#666]" : "text-[#999999]"
                          }`}
                        >
                          {product.category}
                        </span>
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className={`block text-sm font-medium line-clamp-1 mt-0.5 ${
                            isKids
                              ? "font-sans font-bold text-[#181818]"
                              : "font-serif text-[#111111] hover:underline"
                          }`}
                        >
                          {product.name}
                        </Link>
                        <p className="font-sans text-[11px] text-[#666666] line-clamp-1">{product.subtitle}</p>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`text-xs font-sans ${
                            isKids ? "font-bold text-[#181818]" : "font-medium text-[#111111]"
                          }`}
                        >
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={() => {
                            setIsSearchOpen(false);
                            openQuickShop(product);
                          }}
                          className={`text-[10px] font-sans tracking-widest uppercase cursor-pointer ${
                            isKids
                              ? "px-2.5 py-1 rounded-full bg-[#FEF08A] border border-[#181818] font-bold text-[#181818] shadow-[1px_1px_0px_#181818]"
                              : "text-[#666666] hover:text-[#111111] underline underline-offset-2"
                          }`}
                        >
                          QUICK ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
