"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useSiteTheme } from "@/context/ThemeContext";
import { formatPrice } from "@/lib/catalogueUtils";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, isCartOpen, setIsCartOpen } = useShop();
  const pathname = usePathname();
  const { isKids: isSiteKids } = useSiteTheme();
  const isKids = isSiteKids || Boolean(pathname?.startsWith("/kids"));

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) setIsCartOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  /* ─── Theme tokens ─── */
  const T = isKids
    ? {
        panel:   "bg-[#EBF4FA] border-l-2 border-[#181818] shadow-[-6px_0px_0px_#181818]",
        header:  "bg-[#FEF08A] border-b-2 border-[#181818]",
        title:   "font-sans font-black text-[15px] tracking-widest uppercase text-[#181818]",
        count:   "font-sans font-bold text-[11px] text-[#181818] bg-[#181818] text-[#FEF08A] px-1.5 py-0.5 rounded-full ml-1",
        closeBtn:"p-1.5 rounded-full border-2 border-[#181818] text-[#181818] hover:bg-white transition-colors",
        divider: "divide-[#181818]/20",
        imgWrap: "relative w-20 h-28 flex-shrink-0 overflow-hidden rounded-xl border-2 border-[#181818] shadow-[2px_2px_0px_#181818]",
        name:    "font-sans font-bold text-sm text-[#181818] hover:text-black line-clamp-1",
        meta:    "font-sans text-[11px] text-[#555] mt-0.5",
        sizeTag: "font-sans text-[11px] text-[#555]",
        removeBtn:"text-[#999999] hover:text-[#FF4444] transition-colors p-0.5",
        qtyWrap: "flex items-center rounded-full border-2 border-[#181818] bg-white shadow-[1px_1px_0px_#181818] overflow-hidden",
        qtyBtn:  "w-7 h-7 flex items-center justify-center text-xs font-bold text-[#181818] hover:bg-[#FEF08A] transition-colors",
        qtyNum:  "w-7 text-center text-xs font-sans font-bold text-[#181818]",
        price:   "font-sans text-xs font-bold text-[#181818]",
        footer:  "border-t-2 border-[#181818] p-5 bg-[#EBF4FA] space-y-3",
        subLabel:"font-sans text-[10.5px] uppercase tracking-widest font-bold text-[#181818]",
        subPrice:"font-sans text-lg font-black text-[#181818]",
        note:    "font-sans text-[10.5px] text-[#555]",
        viewBag: "w-full text-center py-3 rounded-full border-2 border-[#181818] bg-white text-[#181818] font-sans text-[10.5px] font-bold tracking-[0.15em] uppercase shadow-[2px_2px_0px_#181818] hover:shadow-[1px_1px_0px_#181818] hover:translate-x-[1px] hover:translate-y-[1px] transition-all",
        checkout:"w-full text-center py-3 rounded-full border-2 border-[#181818] bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] font-sans text-[10.5px] font-bold tracking-[0.15em] uppercase shadow-[3px_3px_0px_#181818] hover:shadow-[1px_1px_0px_#181818] hover:translate-x-[2px] hover:translate-y-[2px] transition-all",
        emptyIcon:"text-[#FEF08A]",
        emptyTitle:"font-sans font-black text-lg text-[#181818]",
        emptyDesc:"font-sans text-xs text-[#555] max-w-xs",
        emptyBtn: "mt-4 inline-block px-6 py-3 rounded-full border-2 border-[#181818] bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] text-[11px] tracking-widest font-bold uppercase shadow-[3px_3px_0px_#181818] hover:shadow-[1px_1px_0px_#181818] hover:translate-x-[2px] hover:translate-y-[2px] transition-all",
      }
    : {
        panel:   "bg-[#EAE8E1] border-l border-[#D9D8D3] shadow-2xl",
        header:  "bg-[#EAE8E1] border-b border-[#D9D8D3]",
        title:   "font-serif text-xl tracking-tight text-[#111111]",
        count:   "font-sans text-xs text-[#666666] ml-1",
        closeBtn:"p-1 text-[#666666] hover:text-[#111111] transition-colors",
        divider: "divide-[#D9D8D3]",
        imgWrap: "relative w-20 h-28 bg-[#DFDDD6] flex-shrink-0 overflow-hidden",
        name:    "font-serif text-sm font-medium text-[#111111] hover:underline line-clamp-1",
        meta:    "font-sans text-[11px] text-[#666666] mt-0.5",
        sizeTag: "font-sans text-[11px] text-[#666666]",
        removeBtn:"text-[#999999] hover:text-[#111111] transition-colors p-0.5",
        qtyWrap: "flex items-center border border-[#D9D8D3] bg-white",
        qtyBtn:  "w-7 h-7 flex items-center justify-center text-xs text-[#666666] hover:bg-[#EAE8E1] transition-colors",
        qtyNum:  "w-8 text-center text-xs font-sans text-[#111111]",
        price:   "font-sans text-xs font-medium text-[#111111]",
        footer:  "border-t border-[#D9D8D3] p-6 bg-[#EAE8E1] space-y-4",
        subLabel:"font-sans text-xs uppercase tracking-wider text-[#666666]",
        subPrice:"font-serif text-lg font-medium text-[#111111]",
        note:    "font-sans text-[11px] text-[#666666]",
        viewBag: "w-full text-center py-3 border border-[#181818] text-[#181818] font-sans text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-black/5 transition-colors",
        checkout:"w-full text-center py-3 pablo-btn-dark text-[#EAE8E1] font-sans text-[11px] font-medium tracking-[0.15em] uppercase border border-[#222222] hover:border-white transition-all",
        emptyIcon:"text-[#999999]",
        emptyTitle:"font-serif text-lg text-[#111111]",
        emptyDesc:"font-sans text-xs text-[#666666] max-w-xs",
        emptyBtn: "mt-4 inline-block px-6 py-3 pablo-btn-dark text-[#EAE8E1] text-[11px] tracking-[0.2em] font-medium uppercase border border-[#222222] hover:border-white transition-all",
      };

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div className={`relative w-full max-w-md h-full flex flex-col z-10 animate-in slide-in-from-right duration-300 ${T.panel}`}>

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 ${T.header}`}>
          <div className="flex items-center">
            {isKids && (
              <svg className="w-4 h-4 mr-2 stroke-[#181818] fill-none" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            )}
            <h2 className={T.title}>
              {isKids ? "MY BAG" : "SHOPPING BAG"}
            </h2>
            <span className={T.count}>{totalQty}</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Shopping Bag"
            className={T.closeBtn}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isKids ? "2.5" : "1.5"} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto px-6 py-4 divide-y ${T.divider}`}>
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              {isKids ? (
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#FEF08A] border-2 border-[#181818] shadow-[3px_3px_0px_#181818] animate-kids-twinkle">
                  <svg className="w-7 h-7 stroke-[#181818] fill-none" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              ) : (
                <svg className={`w-12 h-12 stroke-1 ${T.emptyIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              )}
              <p className={T.emptyTitle}>
                {isKids ? "Your bag is empty" : "Your bag is currently empty"}
              </p>
              <p className={T.emptyDesc}>
                {isKids
                  ? "Explore our playful Kids collection and add some amazing pieces!"
                  : "Explore our latest campaign and seasonal arrivals crafted with exquisite Italian fabrics."}
              </p>
              <Link
                href={isKids ? "/kids" : "/men"}
                onClick={() => setIsCartOpen(false)}
                className={T.emptyBtn}
              >
                {isKids ? "EXPLORE KIDS' WORLD" : "EXPLORE COLLECTION"}
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                {/* Product image */}
                <div className={T.imgWrap}>
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className={T.name}
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={T.removeBtn}
                        title="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isKids ? "2" : "1.5"} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <p className={T.meta}>{item.subtitle}</p>

                    <div className={`flex items-center gap-3 mt-1.5 ${T.sizeTag}`}>
                      <span>Size: <strong className={isKids ? "font-bold text-[#181818]" : "font-medium text-[#111111]"}>{item.size}</strong></span>
                      {item.color && (
                        <span className="flex items-center gap-1">
                          Color: <span className={isKids ? "font-bold text-[#181818]" : "text-[#111111]"}>{item.color}</span>
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

                  {/* Qty & Price */}
                  <div className="flex justify-between items-end mt-3">
                    <div className={T.qtyWrap}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={T.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={T.qtyNum}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={T.qtyBtn}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className={T.price}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className={T.footer}>
            <div className="flex justify-between items-baseline">
              <span className={T.subLabel}>
                {isKids ? "Total" : "Estimated Subtotal"}
              </span>
              <span className={T.subPrice}>{formatPrice(cartSubtotal)}</span>
            </div>
            <p className={T.note}>
              {isKids ? (
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3 h-3 stroke-[#181818] fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 12v10H4V12" />
                    <path d="M2 7h20v5H2z" />
                    <path d="M12 22V7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                  <span>Free gift wrapping on all Kids orders!</span>
                </span>
              ) : (
                "Complimentary express shipping and bespoke gift packaging included."
              )}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Link href="/cart" onClick={() => setIsCartOpen(false)} className={T.viewBag}>
                VIEW BAG
              </Link>
              <Link href="/checkout" onClick={() => setIsCartOpen(false)} className={T.checkout}>
                CHECKOUT
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
