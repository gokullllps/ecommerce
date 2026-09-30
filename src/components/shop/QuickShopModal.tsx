"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useSiteTheme } from "@/context/ThemeContext";
import { formatPrice } from "@/lib/catalogueUtils";

export default function QuickShopModal() {
  const { quickShopProduct, closeQuickShop, addToCart } = useShop();
  const router = useRouter();
  const pathname = usePathname();
  const { isKids: isSiteKids } = useSiteTheme();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const isKids =
    isSiteKids ||
    quickShopProduct?.gender === "kids" ||
    Boolean(pathname?.startsWith("/kids"));

  // Default selection when product changes
  React.useEffect(() => {
    if (quickShopProduct) {
      const firstAvailableSize = quickShopProduct.sizes.find(
        (s: any) => s.inStock !== false && s.available !== false
      );
      setSelectedSize(firstAvailableSize ? ((firstAvailableSize as any).name || (firstAvailableSize as any).size) : "");
      setSelectedColor(quickShopProduct.colors?.[0]?.name || "");
      setQuantity(1);
      setError("");
    }
  }, [quickShopProduct]);

  if (!quickShopProduct) return null;

  const handleAddToBag = () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    addToCart(quickShopProduct, selectedSize, selectedColor, quantity);
    closeQuickShop();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    addToCart(quickShopProduct, selectedSize, selectedColor, quantity);
    closeQuickShop();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeQuickShop}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-xl z-10 animate-in zoom-in-95 duration-200 ${
          isKids
            ? "bg-[#EBF4FA] border-2 border-[#181818] rounded-2xl shadow-[6px_6px_0px_#181818] p-6 lg:p-7"
            : "bg-[#EAE8E1] border border-[#D9D8D3] shadow-2xl p-6 lg:p-8"
        }`}
      >
        <button
          onClick={closeQuickShop}
          aria-label="Close"
          className={`absolute top-4 right-4 transition-colors cursor-pointer ${
            isKids
              ? "w-8 h-8 rounded-full border-2 border-[#181818] bg-white text-[#181818] hover:bg-[#FEF08A] flex items-center justify-center shadow-[1px_1px_0px_#181818]"
              : "p-2 text-[#666666] hover:text-[#111111]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Product Image */}
          <div
            className={`relative w-full sm:w-48 aspect-[3/4] overflow-hidden flex-shrink-0 ${
              isKids
                ? "rounded-xl border-2 border-[#181818] shadow-[3px_3px_0px_#181818] bg-white"
                : "bg-[#DFDDD6]"
            }`}
          >
            <Image
              src={quickShopProduct.images[0].url}
              alt={quickShopProduct.images[0].alt}
              fill
              sizes="200px"
              className={`object-cover ${isKids ? "kids-card-img" : ""}`}
            />
          </div>

          {/* Details & Selectors */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <span
                className={`text-[10px] uppercase tracking-[0.2em] ${
                  isKids ? "font-sans font-bold text-[#666]" : "font-sans text-[#999999]"
                }`}
              >
                {quickShopProduct.department || quickShopProduct.category}
              </span>
              <h3
                className={`text-xl font-bold mt-0.5 ${
                  isKids ? "font-sans text-[#181818] line-clamp-1" : "font-serif font-medium text-[#111111]"
                }`}
              >
                {quickShopProduct.name}
              </h3>
              <p className="font-sans text-xs text-[#666666] mt-0.5 line-clamp-1">
                {quickShopProduct.subtitle || quickShopProduct.material}
              </p>

              <div className="mt-2.5 flex items-baseline gap-2">
                <span
                  className={`text-sm ${
                    isKids ? "font-sans font-black text-[#181818] text-base" : "font-sans font-semibold text-[#111111]"
                  }`}
                >
                  {formatPrice(quickShopProduct.price)}
                </span>
                {quickShopProduct.originalPrice && (
                  <span className="font-sans text-xs text-[#999999] line-through">
                    {formatPrice(quickShopProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Colors */}
              {quickShopProduct.colors && quickShopProduct.colors.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="font-sans text-[11px] uppercase tracking-wider text-[#666666]">
                      Color: <strong className="text-[#111111]">{selectedColor}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {quickShopProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                          selectedColor === c.name
                            ? isKids
                              ? "ring-2 ring-[#181818] ring-offset-2 ring-offset-[#EBF4FA] border-2 border-[#181818]"
                              : "ring-2 ring-[#111111] ring-offset-2 ring-offset-[#EAE8E1]"
                            : isKids
                            ? "border-2 border-[#181818]/50 hover:scale-110"
                            : "border-black/20 hover:scale-110"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div className="mt-4">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className={`text-[11px] uppercase tracking-wider ${isKids ? "font-bold text-[#181818]" : "text-[#666666]"}`}>
                    Select Size
                  </span>
                  {error && <span className="font-sans text-[11px] text-red-600 font-bold">{error}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickShopProduct.sizes.map((s: any) => {
                    const sizeLabel = s.name || s.size;
                    const isAvailable = s.inStock !== false && s.available !== false;
                    return (
                      <button
                        key={sizeLabel}
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedSize(sizeLabel);
                          setError("");
                        }}
                        className={`h-9 px-3 min-w-[36px] font-sans text-xs transition-all cursor-pointer ${
                          isKids
                            ? !isAvailable
                              ? "rounded-xl border-2 border-[#181818]/25 text-[#999] opacity-40 cursor-not-allowed line-through"
                              : selectedSize === sizeLabel
                              ? "rounded-xl border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                              : "rounded-xl border-2 border-[#181818] bg-white text-[#181818] hover:bg-[#FEF08A]/30"
                            : !isAvailable
                            ? "border-[#D9D8D3] text-[#999999] opacity-40 cursor-not-allowed line-through"
                            : selectedSize === sizeLabel
                            ? "border-[#111111] bg-[#181818] text-[#EAE8E1]"
                            : "border-[#D9D8D3] bg-white text-[#111111] hover:border-[#111111]"
                        }`}
                      >
                        {sizeLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className={`text-[11px] uppercase tracking-wider ${isKids ? "font-bold text-[#181818]" : "text-[#666666]"}`}>Quantity</span>
                <div
                  className={`flex items-center ${
                    isKids
                      ? "rounded-full border-2 border-[#181818] bg-white shadow-[1px_1px_0px_#181818] overflow-hidden"
                      : "border border-[#D9D8D3] bg-white"
                  }`}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`w-7 h-7 flex items-center justify-center text-xs transition-colors cursor-pointer ${
                      isKids ? "text-[#181818] font-bold hover:bg-[#FEF08A]" : "text-[#666666] hover:bg-[#EAE8E1]"
                    }`}
                  >
                    -
                  </button>
                  <span className={`w-8 text-center text-xs font-sans ${isKids ? "font-bold text-[#181818]" : "text-[#111111]"}`}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`w-7 h-7 flex items-center justify-center text-xs transition-colors cursor-pointer ${
                      isKids ? "text-[#181818] font-bold hover:bg-[#FEF08A]" : "text-[#666666] hover:bg-[#EAE8E1]"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className={`mt-6 space-y-2 pt-3 ${isKids ? "border-t-2 border-[#181818]" : "border-t border-[#D9D8D3]"}`}>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToBag}
                  className={`w-full py-3 font-sans text-[11px] font-bold tracking-[0.16em] uppercase transition-all cursor-pointer active:scale-95 ${
                    isKids
                      ? "rounded-full border-2 border-[#181818] bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] shadow-[3px_3px_0px_#181818]"
                      : "pablo-btn-dark text-[#EAE8E1] border border-[#222222] hover:border-white"
                  }`}
                >
                  ADD TO BAG
                </button>
                <button
                  onClick={handleBuyNow}
                  className={`w-full py-3 font-sans text-[11px] font-bold tracking-[0.16em] uppercase transition-colors cursor-pointer active:scale-95 ${
                    isKids
                      ? "rounded-full border-2 border-[#181818] bg-white text-[#181818] shadow-[2px_2px_0px_#181818] hover:bg-black hover:text-white"
                      : "border border-[#181818] text-[#181818] hover:bg-black hover:text-white"
                  }`}
                >
                  BUY NOW
                </button>
              </div>

              <Link
                href={`/product/${quickShopProduct.slug}`}
                onClick={closeQuickShop}
                className={`block text-center font-sans text-[11px] uppercase tracking-wider pt-1 transition-colors ${
                  isKids ? "font-bold text-[#181818] hover:underline" : "text-[#666666] hover:text-[#111111]"
                }`}
              >
                VIEW COMPLETE DETAILS →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
