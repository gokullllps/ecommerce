"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Product } from "@/types/catalogue";
import { ProductCard } from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
  ariaLabel?: string;
}

export function ProductCarousel({ products, ariaLabel = "Product Carousel" }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll bounds to enable/disable arrow buttons
  const updateScrollBounds = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollBounds();
    const el = trackRef.current;
    if (!el) return;

    window.addEventListener("resize", updateScrollBounds);
    return () => window.removeEventListener("resize", updateScrollBounds);
  }, [updateScrollBounds, products]);

  // Scroll left by one card width
  const scrollPrev = () => {
    if (!trackRef.current) return;
    const cardEl = trackRef.current.firstElementChild as HTMLElement | null;
    const scrollStep = cardEl ? cardEl.offsetWidth + 28 : trackRef.current.clientWidth * 0.25;
    trackRef.current.scrollBy({ left: -scrollStep, behavior: "smooth" });
  };

  // Scroll right by one card width
  const scrollNext = () => {
    if (!trackRef.current) return;
    const cardEl = trackRef.current.firstElementChild as HTMLElement | null;
    const scrollStep = cardEl ? cardEl.offsetWidth + 28 : trackRef.current.clientWidth * 0.25;
    trackRef.current.scrollBy({ left: scrollStep, behavior: "smooth" });
  };

  return (
    <div className="relative w-full group/carousel select-none">
      {/* ─── Carousel Controls (Floating Navigation Chevrons) ─── */}
      {products.length > 4 && (
        <div className="hidden sm:flex items-center space-x-2 absolute -top-14 right-0 z-20">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollLeft}
            aria-label="Previous products"
            className={`w-9 h-9 border flex items-center justify-center text-xs transition-all cursor-pointer ${
              canScrollLeft
                ? "border-[#111111] text-[#111111] hover:pablo-btn-dark hover:border-[#111111] hover:text-[#EAE8E1]"
                : "border-[#D9D8D3] text-[#999999] opacity-40 cursor-not-allowed"
            }`}
          >
            ←
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollRight}
            aria-label="Next products"
            className={`w-9 h-9 border flex items-center justify-center text-xs transition-all cursor-pointer ${
              canScrollRight
                ? "border-[#111111] text-[#111111] hover:pablo-btn-dark hover:border-[#111111] hover:text-[#EAE8E1]"
                : "border-[#D9D8D3] text-[#999999] opacity-40 cursor-not-allowed"
            }`}
          >
            →
          </button>
        </div>
      )}

      {/* ─── Horizontal Scroll Track ─── */}
      <div
        ref={trackRef}
        onScroll={updateScrollBounds}
        role="region"
        aria-label={ariaLabel}
        className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 pt-1 -mx-[var(--page-gutter-mobile,1.25rem)] sm:-mx-[var(--page-gutter-tablet,2rem)] lg:mx-0 px-[var(--page-gutter-mobile,1.25rem)] sm:px-[var(--page-gutter-tablet,2rem)] lg:px-0"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[calc(72%-10px)] sm:w-[calc(48%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-24px)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCarousel;
