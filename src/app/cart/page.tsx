"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { useSiteTheme } from "@/context/ThemeContext";
import { formatPrice } from "@/lib/catalogueUtils";
import PageWrapper from "@/components/layout/PageWrapper";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, clearCart, toggleWishlist, isInWishlist } = useShop();
  const { isKids: isSiteKids } = useSiteTheme();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  const hasKidsItems = cart.some((i) => (i as any).gender === "kids" || i.id.startsWith("pab-k-"));
  const isKids = isSiteKids || hasKidsItems;

  const totalQty = cart.reduce((s, i) => s + i.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (!promoCode.trim()) return;

    const code = promoCode.trim().toUpperCase();
    if (code === "PABLO10" || code === "VIP10" || code === "KIDS10") {
      setDiscountPercent(10);
      setPromoSuccess(code === "KIDS10" ? "10% Kids Star Collector discount applied!" : "10% VIP reduction applied to your order");
    } else if (code === "ARCHIVE20") {
      setDiscountPercent(20);
      setPromoSuccess("20% Archival reduction applied to your order");
    } else {
      setPromoError("Invalid or expired promotional invitation code");
    }
  };

  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <PageWrapper navbarProps={{ isStaticPage: true }} forceKidsTheme={isKids}>
      <main className="flex-1 page-container py-6 sm:py-10 lg:py-12 relative z-10 select-none">
        {/* ── MOBILE HEADER FOR KIDS (Screen 5 Reference) ── */}
        {isKids ? (
          <div className="flex sm:hidden items-center justify-between pb-3 mb-4 border-b-2 border-[#181818]">
            <div className="flex items-center gap-2">
              <Link
                href="/kids"
                className="w-8 h-8 rounded-full border-2 border-[#181818] bg-white flex items-center justify-center text-xs font-bold text-[#181818] shadow-[1px_1px_0px_#181818] active:scale-90 transition-transform"
                aria-label="Back to Kids"
              >
                &larr;
              </Link>
              <h1 className="text-xl font-sans font-black text-[#181818] tracking-tight">
                My Bag ({totalQty})
              </h1>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-sans font-bold text-[#666666] hover:text-[#181818] underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        ) : (
          /* Desktop & Non-Kids Header */
          <div className="flex items-baseline justify-between border-b border-[#D9D8D3] pb-6 mb-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#666666]">
                CLIENT ORDERS
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1">
                SHOPPING BAG
              </h1>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs uppercase tracking-wider text-[#666666] hover:text-[#111111] underline underline-offset-4"
              >
                Clear Bag
              </button>
            )}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {cart.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-6">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              isKids
                ? "bg-[#FEF08A] border-2 border-[#181818] shadow-[3px_3px_0px_#181818] text-[#181818]"
                : "bg-white/70 border border-[#D9D8D3] text-[#999999]"
            }`}>
              <svg className="w-8 h-8 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className={isKids ? "font-sans font-black text-2xl text-[#181818]" : "font-serif text-2xl text-[#111111]"}>
              Your bag is currently empty
            </h2>
            <p className="text-xs text-[#666666] leading-relaxed">
              {isKids
                ? "Explore our playful Kids collection to discover cloud-soft knits and heirlooms."
                : "Items added to your shopping bag will be reserved for you. Explore our new season campaign."}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={isKids ? "/kids" : "/men"}
                className={`px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] ${
                  isKids
                    ? "rounded-full bg-[#FEF08A] text-[#181818] border-2 border-[#181818] shadow-[3px_3px_0px_#181818]"
                    : "pablo-btn-dark"
                }`}
              >
                {isKids ? "EXPLORE KIDS' WORLD" : "EXPLORE MEN"}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
            {/* Bag Line Items: 7 Columns */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-0 sm:divide-y sm:divide-[#D9D8D3]">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-3.5 sm:gap-6 ${
                    isKids
                      ? "p-3.5 sm:py-6 rounded-2xl sm:rounded-none bg-white sm:bg-transparent border-2 sm:border-0 border-[#181818] shadow-[2px_2px_0px_#181818] sm:shadow-none"
                      : "py-6 first:pt-0"
                  }`}
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${item.slug}`}
                    className={`relative w-20 sm:w-28 aspect-[3/4] overflow-hidden shrink-0 group ${
                      isKids
                        ? "rounded-xl border-2 border-[#181818] bg-[#EBF4FA]"
                        : "bg-[#DFDDD6]"
                    }`}
                  >
                    <Image
                      src={item.image || "/images/pablo-hero-cutout.webp"}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          className={`truncate block ${
                            isKids
                              ? "font-sans font-black text-sm text-[#181818] hover:underline"
                              : "font-serif text-lg font-medium text-[#111111] hover:underline"
                          }`}
                        >
                          {item.name}
                        </Link>

                        {/* Top-Right Heart / Wishlist Toggle */}
                        {isKids ? (
                          <button
                            type="button"
                            onClick={() => toggleWishlist({ id: item.id, name: item.name, slug: item.slug, price: item.price, images: [{ url: item.image, alt: item.name }] } as any)}
                            className="text-[#181818] hover:text-[#EA580C] p-0.5"
                            aria-label="Save to wishlist"
                          >
                            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#999999] hover:text-[#111111] transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Variant line: e.g. "Forest Green / 6Y" (Screen 5 Reference) */}
                      <p className={`text-xs mt-0.5 truncate ${isKids ? "font-sans text-[#666666] font-medium" : "text-[#666666]"}`}>
                        {item.color ? `${item.color} / ${item.size}` : item.size}
                      </p>

                      <div className="mt-1.5 flex items-baseline">
                        <span className={`text-sm font-sans ${isKids ? "font-black text-[#181818]" : "font-semibold text-[#111111]"}`}>
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Controls: Stepper on left, Trash on right (Screen 5 Reference) */}
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#181818]/10 sm:border-0 sm:pt-0">
                      {/* Stepper [ - 1 + ] */}
                      <div className={`flex items-center ${
                        isKids
                          ? "rounded-full border-2 border-[#181818] bg-white overflow-hidden shadow-[1px_1px_0px_#181818]"
                          : "border border-[#D9D8D3] bg-white"
                      }`}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={`w-7 h-7 flex items-center justify-center text-xs transition-colors cursor-pointer ${
                            isKids ? "font-black text-[#181818] hover:bg-[#FEF08A]" : "text-[#666666] hover:bg-[#EAE8E1]"
                          }`}
                        >
                          -
                        </button>
                        <span className={`w-8 text-center text-xs font-sans ${isKids ? "font-black text-[#181818]" : "text-[#111111]"}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={`w-7 h-7 flex items-center justify-center text-xs transition-colors cursor-pointer ${
                            isKids ? "font-black text-[#181818] hover:bg-[#FEF08A]" : "text-[#666666] hover:bg-[#EAE8E1]"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      {/* Trash Delete Icon */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`p-1.5 transition-colors cursor-pointer ${
                          isKids
                            ? "text-[#181818] hover:text-[#EF4444]"
                            : "text-[#999999] hover:text-[#111111]"
                        }`}
                        aria-label="Delete item from bag"
                      >
                        <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* ── APPLY COUPON ROW (Screen 5 Reference) ── */}
              <div className="pt-2">
                <div
                  onClick={() => setIsCouponOpen(!isCouponOpen)}
                  className={`w-full p-3.5 flex items-center justify-between rounded-xl cursor-pointer transition-all ${
                    isKids
                      ? "bg-white border-2 border-[#181818] shadow-[2px_2px_0px_#181818]"
                      : "bg-white/80 border border-[#D9D8D3]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#181818]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    <span className="font-sans font-bold text-xs text-[#181818]">
                      Apply Coupon
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#181818]">&rsaquo;</span>
                </div>

                {isCouponOpen && (
                  <form onSubmit={handleApplyPromo} className="mt-2 p-3 bg-white rounded-xl border-2 border-[#181818] flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Try KIDS10"
                      className="flex-1 px-3 py-2 text-xs font-sans uppercase font-bold text-[#181818] border border-[#181818] rounded-lg focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FEF08A] border-2 border-[#181818] rounded-lg font-sans font-bold text-xs uppercase cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoSuccess && (
                  <p className="mt-1.5 text-xs text-emerald-700 font-bold px-1">{promoSuccess}</p>
                )}
                {promoError && (
                  <p className="mt-1.5 text-xs text-red-600 font-bold px-1">{promoError}</p>
                )}
              </div>
            </div>

            {/* Order Summary: 5 Columns */}
            <div className="lg:col-span-5">
              <div className={`p-5 sm:p-8 space-y-4 sm:space-y-6 sticky top-8 ${
                isKids
                  ? "bg-white rounded-2xl border-2 border-[#181818] shadow-[3px_3px_0px_#181818]"
                  : "bg-white/70 border border-[#D9D8D3]"
              }`}>
                <h2 className={`text-base sm:text-xl border-b pb-3 ${
                  isKids
                    ? "font-sans font-black text-[#181818] border-[#181818]"
                    : "font-serif text-[#111111] border-[#D9D8D3]"
                }`}>
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Subtotal</span>
                    <span className="text-[#181818] font-bold">{formatPrice(cartSubtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#666666]">Shipping</span>
                    <span className="text-emerald-700 font-bold">Free</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-bold pt-1">
                      <span>Reduction ({discountPercent}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className={`border-t pt-3 flex justify-between items-baseline ${
                    isKids ? "border-[#181818]" : "border-[#D9D8D3]"
                  }`}>
                    <span className="font-sans text-sm uppercase tracking-wider text-[#181818] font-black">
                      Total
                    </span>
                    <span className="font-sans text-xl text-[#181818] font-black">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA — Screen 5 Reference Full-Width Yellow Pill */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className={`block w-full py-4 text-center transition-all cursor-pointer ${
                      isKids
                        ? "rounded-full bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] border-2 border-[#181818] font-sans font-black text-xs uppercase tracking-[0.16em] shadow-[3px_3px_0px_#181818] active:translate-x-[2px] active:translate-y-[2px]"
                        : "pablo-btn-dark text-[#EAE8E1] text-xs font-sans font-medium uppercase tracking-[0.24em] border border-[#222222] hover:border-white shadow-xs"
                    }`}
                  >
                    PROCEED TO CHECKOUT
                  </Link>
                  <Link
                    href={isKids ? "/kids" : "/men"}
                    className="block w-full py-2 text-center text-xs uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                  >
                    &larr; Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </PageWrapper>
  );
}
