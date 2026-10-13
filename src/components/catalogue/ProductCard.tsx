"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { Product } from "@/types/catalogue";
import { formatPrice } from "@/lib/catalogueUtils";
import { useShop } from "@/context/ShopContext";
import { KidsWishlistButton } from "@/components/kids/animations/KidsWishlistButton";
import { KidsCartFly } from "@/components/kids/animations/KidsCartFly";
import { useSiteTheme } from "@/context/ThemeContext";

interface ProductCardProps {
  product: Product;
  isKids?: boolean;
  /** Stagger index for reveal animation (0–7) */
  index?: number;
}

export function ProductCard({ product, isKids: isKidsProp, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const [isJustAdded, setIsJustAdded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const { isKids: isSiteKids } = useSiteTheme();

  // Use explicit prop if passed (page context), otherwise fall back to theme context or product gender
  const isKids = isKidsProp ?? (isSiteKids || product.gender === "kids");

  // Variant state management
  const defaultColor =
    product.colorVariants?.[0]?.name ||
    product.colors?.[0]?.name ||
    "";
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  // Active color resolution (hovered swatch previews immediately; otherwise selected)
  const activeColorName = hoveredColor || selectedColor;

  // Active color variant object
  const activeVariant = product.colorVariants?.find(
    (v) => v.name.toLowerCase() === activeColorName.toLowerCase()
  ) || product.colorVariants?.[0];

  // Active images for Myntra-style hover (same product, same color variant)
  const primaryImage =
    activeVariant?.images?.[0]?.url ||
    product.primaryImage ||
    product.images?.[0]?.url ||
    "/images/pablo-hero-cutout.webp";

  const secondaryImage =
    product.hoverImage ||
    activeVariant?.images?.[1]?.url ||
    product.images?.[1]?.url ||
    primaryImage;

  const [imgSrc, setImgSrc] = useState(primaryImage);
  const [secImgSrc, setSecImgSrc] = useState(secondaryImage);

  useEffect(() => {
    setImgSrc(primaryImage);
  }, [primaryImage]);

  useEffect(() => {
    setSecImgSrc(secondaryImage);
  }, [secondaryImage]);

  const isWishlisted = isInWishlist(product.id);

  // Stagger classes for grid reveal (progressive stagger 0ms, 60ms, 120ms, 180ms)
  const staggerClass = isKids
    ? `kids-grid-enter kids-stagger-${Math.min(index + 1, 8)}`
    : `pablo-grid-item-${index % 4}`;

  // Available variants / colors for swatches
  const hasVariants = Boolean(product.colorVariants && product.colorVariants.length > 0);
  const swatches = hasVariants
    ? product.colorVariants!
    : product.colors?.map((c) => ({
        name: c.name,
        hex: c.hex,
        images: product.images,
      })) || [];

  // Handle Add to Bag with active variant info
  const handleAddToBag = () => {
    const availableSize =
      product.sizes?.find((s: any) => s.inStock !== false && s.available !== false)?.name ||
      product.sizes?.[0]?.name ||
      "4Y";
    const colorToSave = selectedColor || defaultColor || "Standard";
    const variantImageToSave = activeVariant?.images?.[0]?.url || primaryImage;
    addToCart(product, availableSize, colorToSave, 1, variantImageToSave);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1400);
  };

  return (
    <article
      className={`group relative flex flex-col w-full h-full select-none min-w-0 ${staggerClass} ${
        isKids
          ? "bg-[#EBF4FA] rounded-2xl border-2 border-[#181818] shadow-[4px_4px_0px_#181818] hover:shadow-[7px_7px_0px_#181818] hover:-translate-y-1.5 overflow-hidden transition-all duration-300"
          : "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      }`}
      aria-label={product.name}
    >
      {/* ─── 1. PRODUCT IMAGE CONTAINER ─── */}
      <div
        ref={imageRef}
        className={`relative aspect-[3/4] w-full overflow-hidden ${
          isKids ? "rounded-t-[14px]" : "pablo-dark-card border border-[#D9D8D3]/80 pablo-product-image-container"
        }`}
      >
        <Link
          href={`/product/${product.slug}`}
          className="block relative w-full h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-[#181818] active:scale-[0.98] transition-transform duration-200"
          aria-label={`View details for ${product.name}`}
        >
          {/* Primary image — with subtle 1.03 zoom on hover and editorial crossfade */}
          <div
            className={`absolute inset-0 w-full h-full transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${
              secondaryImage !== primaryImage ? "group-hover:opacity-0" : ""
            } ${isKids ? "kids-card-img" : "pablo-product-img-primary"}`}
          >
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover w-full h-full"
              priority={index < 4}
              onError={() => {
                if (imgSrc !== "/images/pablo-hero-cutout.webp") {
                  setImgSrc("/images/pablo-hero-cutout.webp");
                }
              }}
            />
          </div>

          {/* Secondary hover image — editorial smooth crossfade of the SAME product */}
          {secondaryImage && secondaryImage !== primaryImage && (
            <div
              className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${
                isKids ? "kids-card-img" : "pablo-product-img-secondary"
              }`}
            >
              <Image
                src={secImgSrc}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover w-full h-full"
                onError={() => {
                  if (secImgSrc !== imgSrc) {
                    setSecImgSrc(imgSrc);
                  }
                }}
              />
            </div>
          )}
        </Link>

        {/* Badges container (Playful Kids styling) */}
        {isKids && (
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
            {product.badge && (
              <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-[#FEF08A] text-[#181818] border-2 border-[#181818] rounded-full shadow-[2px_2px_0px_#181818]">
                {product.badge}
              </span>
            )}
            {!product.badge && product.isNewArrival && (
              <span className="inline-block px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-[#FFFFFF] text-[#181818] border-2 border-[#181818] rounded-full shadow-[2px_2px_0px_#181818]">
                NEW
              </span>
            )}
            {product.salePrice && (
              <span className="inline-block px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-[#FECDD3] text-[#181818] border-2 border-[#181818] rounded-full shadow-[2px_2px_0px_#181818]">
                SALE
              </span>
            )}
          </div>
        )}

        {/* Wishlist button */}
        <KidsWishlistButton
          isWishlisted={isWishlisted}
          onToggle={() => toggleWishlist(product)}
          isKids={isKids}
        />
      </div>

      {/* ─── 2. PRODUCT INFO & VARIANTS ─── */}
      <div
        className={`pt-2 pb-2.5 flex flex-col justify-between flex-1 w-full min-w-0 ${
          isKids ? "px-2.5 kids-card-info" : "px-1"
        }`}
      >
        {/* MOBILE KIDS COMPACT INFO (sm:hidden) — Exactly matches Screen 3 reference */}
        {isKids && (
          <div className="flex sm:hidden flex-col justify-between flex-1 space-y-1">
            <Link
              href={`/product/${product.slug}`}
              className="block text-xs font-sans font-black tracking-tight text-[#181818] line-clamp-2 leading-tight"
            >
              {product.name}
            </Link>

            <div className="pt-0.5">
              <span className="text-xs font-sans font-black text-[#181818]">
                {formatPrice(product.salePrice || product.price)}
              </span>
            </div>

            {/* Color Swatch Dots ● ● ● */}
            {swatches.length > 0 && (
              <div className="flex items-center gap-1 pt-0.5">
                {swatches.slice(0, 4).map((variant) => {
                  const isCurrent = activeColorName.toLowerCase() === variant.name.toLowerCase();
                  return (
                    <button
                      key={variant.name}
                      type="button"
                      aria-label={`Select ${variant.name}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedColor(variant.name);
                      }}
                      className={`w-2.5 h-2.5 rounded-full border transition-all ${
                        isCurrent
                          ? "border-[#181818] ring-1 ring-[#181818] scale-110"
                          : "border-[#181818]/40"
                      }`}
                      style={{ backgroundColor: variant.hex || (variant as any).value }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* DESKTOP & NON-KIDS INFO (hidden sm:block for Kids, always block for non-kids) */}
        <div className={`space-y-1 min-w-0 ${isKids ? "hidden sm:block" : "block"}`}>
          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className={`block text-sm sm:text-[15px] ${
              isKids
                ? "font-sans font-bold tracking-tight text-[#181818]"
                : "font-pablo font-normal tracking-[0.03em] text-[#111111]"
            } hover:text-black transition-colors duration-200 truncate`}
          >
            {product.name}
          </Link>

          {/* Subtitle / Material */}
          <p className="text-[11px] text-[#666666] font-light font-sans tracking-[0.02em] truncate">
            {product.material || product.subtitle || product.category}
          </p>

          {/* Colour Swatches (Hover to preview, click to select) */}
          {swatches.length > 1 && (
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex items-center gap-1">
                {swatches.map((variant) => {
                  const isCurrent = activeColorName.toLowerCase() === variant.name.toLowerCase();
                  return (
                    <button
                      key={variant.name}
                      type="button"
                      aria-label={`Preview ${variant.name}`}
                      title={variant.name}
                      onMouseEnter={() => setHoveredColor(variant.name)}
                      onMouseLeave={() => setHoveredColor(null)}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedColor(variant.name);
                      }}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-200 focus:outline-none ${
                        isKids
                          ? isCurrent
                            ? "scale-125 ring-2 ring-[#181818] ring-offset-1 border border-[#181818]"
                            : "border border-[#181818]/40 hover:scale-115"
                          : isCurrent
                          ? "ring-1 ring-[#111111] ring-offset-1 border border-[#111111]"
                          : "border border-[#999999]/60 hover:scale-110"
                      }`}
                      style={{ backgroundColor: variant.hex || (variant as any).value }}
                    />
                  );
                })}
              </div>

              {/* Active Color Name preview */}
              <span className="text-[10px] text-[#666666] font-medium tracking-tight truncate ml-0.5">
                {activeColorName}
              </span>
            </div>
          )}
        </div>

        {/* ─── 3. PRICE + ADD TO BAG (DESKTOP & NON-KIDS) ─── */}
        <div
          className={`items-center justify-between pt-2 mt-auto gap-2 min-w-0 w-full ${
            isKids
              ? "hidden sm:flex border-t-2 border-[#181818]"
              : "flex border-t border-[#D9D8D3]/70"
          }`}
        >
          <div>
            {product.salePrice ? (
              <>
                <span className="text-xs sm:text-[13px] font-medium text-[#111111] font-sans tracking-[0.02em]">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-[10px] text-[#999999] line-through ml-1.5 font-sans">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span
                className={`text-xs sm:text-[13px] font-sans tracking-[0.02em] ${
                  isKids ? "font-bold text-[#181818]" : "font-medium text-[#111111]"
                }`}
              >
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* ADD TO BAG — Kids uses fly animation with variant image */}
          {isKids ? (
            <KidsCartFly
              imageRef={imageRef}
              imageSrc={primaryImage}
              onAdd={handleAddToBag}
              isKids
              className="group/btn shrink-0 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.16em] flex items-center gap-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#181818] rounded-full border-2 border-[#181818] bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] font-bold shadow-[2px_2px_0px_#181818] hover:shadow-[1px_1px_0px_#181818] hover:translate-x-[1px] hover:translate-y-[1px] active:scale-95"
            >
              <span>{isJustAdded ? "ADDED" : "ADD TO BAG"}</span>
              <span
                className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1"
                aria-hidden="true"
              >
                {isJustAdded ? "✓" : "→"}
              </span>
            </KidsCartFly>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToBag();
              }}
              className="group/btn pablo-btn-luxury shrink-0 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.16em] flex items-center gap-1.5 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#181818] pablo-btn-dark text-white border border-[#222222] hover:border-white font-medium"
              aria-label={`Add ${product.name} to bag`}
            >
              <span>{isJustAdded ? "ADDED" : "ADD"}</span>
              {!isJustAdded && <span className="hidden sm:inline"> TO BAG</span>}
              <span
                className="btn-arrow inline-block transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-1.5"
                aria-hidden="true"
              >
                {isJustAdded ? "✓" : "→"}
              </span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
