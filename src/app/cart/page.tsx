"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/lib/catalogueUtils";
import PageWrapper from "@/components/layout/PageWrapper";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, clearCart } = useShop();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

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
    <PageWrapper navbarProps={{ isStaticPage: true }}>
      <main className="flex-1 page-container py-8 sm:py-10 lg:py-12 relative z-10">
        {/* Header */}
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

        {cart.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/70 border border-[#D9D8D3] flex items-center justify-center text-[#999999]">
              <svg className="w-8 h-8 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-[#111111]">Your bag is currently empty</h2>
            <p className="text-xs text-[#666666] leading-relaxed">
              Items added to your shopping bag will be reserved for you. Explore our new season campaign and classic essentials.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/men"
                className="px-6 py-3.5 pablo-btn-dark text-xs font-medium uppercase tracking-[0.2em]"
              >
                EXPLORE MEN
              </Link>
              <Link
                href="/women"
                className="px-6 py-3.5 border border-[#181818] text-[#181818] text-xs font-medium uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
              >
                EXPLORE WOMEN
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Bag Line Items: 7 Columns */}
            <div className="lg:col-span-7 divide-y divide-[#D9D8D3]">
              {cart.map((item) => (
                <div key={item.id} className="py-6 flex gap-6 first:pt-0">
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative w-24 sm:w-32 aspect-[3/4] bg-[#DFDDD6] overflow-hidden shrink-0 group"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-serif text-lg font-medium text-[#111111] hover:underline"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#999999] hover:text-[#111111] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <p className="text-xs text-[#666666] mt-0.5">{item.subtitle}</p>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#666666]">
                        <span>Size: <strong className="text-[#111111]">{item.size}</strong></span>
                        {item.color && (
                          <span className="flex items-center gap-1.5">
                            Color: <strong className="text-[#111111]">{item.color}</strong>
                            {item.colorHex && (
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: item.colorHex }}
                              />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-6">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#D9D8D3] bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-xs text-[#666666] hover:bg-[#EAE8E1]"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-xs font-sans text-[#111111]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-xs text-[#666666] hover:bg-[#EAE8E1]"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-sans text-sm font-semibold text-[#111111]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary: 5 Columns */}
            <div className="lg:col-span-5">
              <div className="bg-white/70 border border-[#D9D8D3] p-6 sm:p-8 space-y-6 sticky top-8">
                <h2 className="font-serif text-xl text-[#111111] border-b border-[#D9D8D3] pb-3">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="text-[#111111] font-medium">{formatPrice(cartSubtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#666666]">Complimentary Express Shipping</span>
                    <span className="text-emerald-700 font-medium">Free</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#666666]">Bespoke Luxury Gift Packaging</span>
                    <span className="text-emerald-700 font-medium">Included</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-medium pt-1">
                      <span>Privilege Reduction ({discountPercent}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="border-t border-[#D9D8D3] pt-4 flex justify-between items-baseline">
                    <span className="font-sans text-sm uppercase tracking-wider text-[#111111] font-semibold">
                      Total
                    </span>
                    <span className="font-serif text-2xl text-[#111111] font-normal">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="pt-2 border-t border-[#D9D8D3]">
                  <label className="block text-[11px] uppercase tracking-wider text-[#666666] mb-2">
                    Promotional / VIP Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Try PABLO10"
                      className="flex-1 bg-white border border-[#D9D8D3] px-3 py-2 text-xs text-[#111111] uppercase tracking-wider focus:outline-none focus:border-[#111111]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 pablo-btn-dark text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoSuccess && (
                    <p className="mt-2 text-xs text-emerald-700">{promoSuccess}</p>
                  )}
                  {promoError && (
                    <p className="mt-2 text-xs text-red-600">{promoError}</p>
                  )}
                </form>

                {/* Checkout CTA */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="block w-full py-4 text-center pablo-btn-dark text-[#EAE8E1] text-xs font-sans font-medium uppercase tracking-[0.24em] border border-[#222222] hover:border-white transition-all shadow-xs"
                  >
                    PROCEED TO CHECKOUT
                  </Link>
                  <Link
                    href="/men"
                    className="block w-full py-3 text-center text-xs uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
                  >
                    &larr; Continue Browsing Collections
                  </Link>
                </div>

                {/* Guarantees */}
                <div className="pt-4 border-t border-[#D9D8D3] text-[11px] text-[#666666] space-y-2">
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>256-Bit Encrypted Secure Checkout</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Visa, Mastercard, American Express & UPI</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </PageWrapper>
  );
}
