"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect, useMemo } from "react";
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
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const { isKids: isSiteKids } = useSiteTheme();

  // Use explicit prop if passed (page context), otherwise fall back to theme context or product gender
  const isKids = isKidsProp ?? (isSiteKids || product.gender === "kids");

  // Variant resolution: merge colorVariants with any imageOverride in colors
  const variants = useMemo(() => {
    if (product.colorVariants && product.colorVariants.length > 0) {
      return product.colorVariants.map((v) => {
        const matchingColor = product.colors?.find(
          (c) => c.name.toLowerCase() === v.name.toLowerCase()
        );
        const url = matchingColor?.imageOverride || v.images?.[0]?.url;
        return {
          ...v,
          hex: v.hex || v.value || matchingColor?.hex,
          value: v.value || v.hex || matchingColor?.hex,
          images: url
            ? [{ ...(v.images?.[0] || {}), url, isPrimary: true }, ...(v.images?.slice(1) || [])]
            : v.images,
        };
      });
    }
    return (
      product.colors?.map((c) => ({
        name: c.name,
        hex: c.hex,
        value: c.hex,
        inStock: c.inStock !== false,
        images: c.imageOverride
          ? [{ url: c.imageOverride, alt: `${product.name} in ${c.name}`, isPrimary: true }]
          : product.images,
      })) || []
    );
  }, [product]);

  // Variant state management
  const defaultColor = variants[0]?.name || product.colors?.[0]?.name || "";
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const selectedVariantIndex = variants.findIndex(
    (v) => v.name.toLowerCase() === selectedColor.toLowerCase()
  );
  const safeSelectedIndex = selectedVariantIndex >= 0 ? selectedVariantIndex : 0;
  const selectedVariant = variants[safeSelectedIndex];

  // Alternate variant for photo hover when no specific swatch is hovered
  const alternateVariant = variants.length > 1
    ? variants.find((v, idx) => idx !== safeSelectedIndex && v.inStock !== false) ||
      variants[(safeSelectedIndex + 1) % variants.length]
    : null;

  const selectedVariantImg =
    selectedVariant?.images?.[0]?.url ||
    product.primaryImage ||
    (typeof product.images?.[0] === "string" ? product.images[0] : product.images?.[0]?.url) ||
    "/images/pablo-hero-cutout.webp";

  const altVariantImg = alternateVariant?.images?.[0]?.url || (typeof alternateVariant?.images?.[0] === "string" ? alternateVariant.images[0] : null);
  const hasDistinctAltImage = Boolean(altVariantImg && altVariantImg !== selectedVariantImg);

  // Active color name:
  // - If hovering a swatch -> that hovered color
  // - Else if hovering photo directly and distinct alternate image exists -> alternate variant name
  // - Else -> selected color
  const activeColorName = hoveredColor || (isPhotoHovered && hasDistinctAltImage && alternateVariant ? alternateVariant.name : selectedColor);

  const activeVariant = variants.find(
    (v) => v.name.toLowerCase() === activeColorName.toLowerCase()
  ) || selectedVariant;

  const targetImage = activeVariant?.images?.[0]?.url || selectedVariantImg;

  // Secondary angle image for single-variant products
  const secondaryAngleImage =
    product.hoverImage ||
    product.images?.[1]?.url ||
    (typeof product.images?.[1] === "string" ? product.images[1] : null);

  // Preload all variant images to ensure instant, buttery transitions
  useEffect(() => {
    if (typeof window !== "undefined") {
      variants.forEach((v) => {
        const u = v.images?.[0]?.url;
        if (u) {
          const img = new window.Image();
          img.src = u;
        }
      });
      if (secondaryAngleImage) {
        const img = new window.Image();
        img.src = secondaryAngleImage;
      }
    }
  }, [variants, secondaryAngleImage]);

  const isWishlisted = isInWishlist(product.id);

  // Stagger classes for grid reveal (progressive stagger 0ms, 60ms, 120ms, 180ms)
  const staggerClass = isKids
    ? `kids-grid-enter kids-stagger-${Math.min(index + 1, 8)}`
    : `pablo-grid-item-${index % 4}`;

  // Swatches for UI display
  const swatches = variants;

  // Handle Add to Bag with active variant info
  const handleAddToBag = () => {
    const availableSize =
      product.sizes?.find((s: any) => s.inStock !== false && s.available !== false)?.name ||
      product.sizes?.[0]?.name ||
      "4Y";
    const colorToSave = selectedColor || defaultColor || "Standard";
    const variantImageToSave = activeVariant?.images?.[0]?.url || selectedVariantImg;
    addToCart(product, availableSize, colorToSave, 1, variantImageToSave);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 1400);
  };

  // Previewed color label during hover
  const previewedColorName = hoveredColor || (isPhotoHovered && hasDistinctAltImage && alternateVariant ? alternateVariant.name : selectedColor);

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
        onMouseEnter={() => setIsPhotoHovered(true)}
        onMouseLeave={() => setIsPhotoHovered(false)}
        className={`relative aspect-[3/4] w-full overflow-hidden ${
          isKids ? "rounded-t-[14px]" : "pablo-dark-card border border-[#D9D8D3]/80 pablo-product-image-container"
        }`}
      >
        <Link
          href={`/product/${product.slug}`}
          data-no-transition="true"
          className="block relative w-full h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-[#181818] active:scale-[0.98] transition-transform duration-200"
          aria-label={`View details for ${product.name}`}
        >
          {/* Multi-variant rendering: each color variant rendered as an absolute layer for instant, glitch-free crossfade */}
          {variants.length > 1 ? (
            variants.map((v, i) => {
              const vUrl = v.images?.[0]?.url || selectedVariantImg;
              const isVisible = v.name.toLowerCase() === activeColorName.toLowerCase();
              return (
                <div
                  key={v.name || i}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-out ${
                    isVisible ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  } ${isKids ? "kids-card-img" : "pablo-product-img-primary"}`}
                >
                  <Image
                    src={vUrl}
                    alt={`${product.name} in ${v.name}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover w-full h-full"
                    priority={index < 4 && i === 0}
                  />
                </div>
              );
            })
          ) : (
            <>
              {/* Single-variant primary image */}
              <div
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-out ${
                  isPhotoHovered && secondaryAngleImage ? "opacity-0" : "opacity-100"
                } ${isKids ? "kids-card-img" : "pablo-product-img-primary"}`}
              >
                <Image
                  src={selectedVariantImg}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover w-full h-full"
                  priority={index < 4}
                />
              </div>
              {/* Secondary angle image on hover */}
              {secondaryAngleImage && (
                <div
                  className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-out pointer-events-none ${
                    isPhotoHovered ? "opacity-100" : "opacity-0"
                  } ${isKids ? "kids-card-img" : "pablo-product-img-secondary"}`}
                >
                  <Image
                    src={secondaryAngleImage}
                    alt={`${product.name} alternate angle`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </>
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
        {/* MOBILE KIDS COMPACT INFO (sm:hidden) */}
        {isKids && (
          <div className="flex sm:hidden flex-col justify-between flex-1 space-y-1">
            <Link
              href={`/product/${product.slug}`}
              data-no-transition="true"
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
                  const isCurrent = (hoveredColor ? hoveredColor.toLowerCase() === variant.name.toLowerCase() : selectedColor.toLowerCase() === variant.name.toLowerCase());
                  return (
                    <button
                      key={variant.name}
                      type="button"
                      aria-label={`Select ${variant.name}`}
                      onMouseEnter={() => setHoveredColor(variant.name)}
                      onMouseLeave={() => setHoveredColor(null)}
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

        {/* DESKTOP & NON-KIDS INFO */}
        <div className={`space-y-1 min-w-0 ${isKids ? "hidden sm:block" : "block"}`}>
          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            data-no-transition="true"
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
                  const isCurrent = (hoveredColor ? hoveredColor.toLowerCase() === variant.name.toLowerCase() : selectedColor.toLowerCase() === variant.name.toLowerCase());
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
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-200 focus:outline-none cursor-pointer ${
                        isKids
                          ? isCurrent
                            ? "scale-125 ring-2 ring-[#181818] ring-offset-1 border border-[#181818]"
                            : "border border-[#181818]/40 hover:scale-115"
                          : isCurrent
                          ? "ring-1 ring-[#111111] ring-offset-1 border border-[#111111] scale-105"
                          : "border border-[#999999]/60 hover:scale-110"
                      }`}
                      style={{ backgroundColor: variant.hex || (variant as any).value }}
                    />
                  );
                })}
              </div>

              {/* Active Color Name preview */}
              <span className="text-[10px] text-[#666666] font-medium tracking-tight truncate ml-0.5 transition-colors duration-200">
                {previewedColorName}
              </span>
            </div>
          )}
        </div>

        {/* ─── 3. PRICE + ADD TO BAG ─── */}
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
              imageSrc={targetImage}
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
