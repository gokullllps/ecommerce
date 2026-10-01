"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/catalogue";
import { formatPrice } from "@/lib/catalogueUtils";
import { useShop } from "@/context/ShopContext";
import { useSiteTheme } from "@/context/ThemeContext";
import { ProductCard } from "@/components/catalogue/ProductCard";
import PageWrapper from "@/components/layout/PageWrapper";
import { KidsWishlistButton } from "@/components/kids/animations/KidsWishlistButton";
import { KidsMonkeyScrollIndicator } from "@/components/kids/animations/KidsMonkeyScrollIndicator";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product: initialProduct, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { setOverrideTheme } = useSiteTheme();

  const [product, setProduct] = useState<Product>(initialProduct);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pablo_admin_store_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.products && Array.isArray(parsed.products)) {
          const match = parsed.products.find(
            (p: Product) => p.id === initialProduct.id || p.slug === initialProduct.slug
          );
          if (match) setProduct(match);
        }
      }
    } catch {}
  }, [initialProduct]);

  const isKids = product.gender === "kids";

  // When viewing a Kids product, set the global theme context to 'kids'
  useEffect(() => {
    if (isKids) {
      setOverrideTheme("kids");
      const prevHtmlBg = document.documentElement.style.backgroundColor;
      const prevBodyBg = document.body.style.backgroundColor;
      document.documentElement.style.backgroundColor = "#EBF4FA";
      document.body.style.backgroundColor = "#EBF4FA";
      return () => {
        setOverrideTheme(null);
        document.documentElement.style.backgroundColor = prevHtmlBg || "#EAE8E1";
        document.body.style.backgroundColor = prevBodyBg || "#EAE8E1";
      };
    }
  }, [isKids, setOverrideTheme]);

  // Initial color determination
  const initialColor =
    product.colorVariants?.[0]?.name ||
    product.colors?.[0]?.name ||
    "Standard";

  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Active color variant
  const activeVariant = product.colorVariants?.find(
    (v) => v.name.toLowerCase() === selectedColor.toLowerCase()
  ) || product.colorVariants?.[0];

  // Resolve active gallery images from color variant (or fallback to product.images / primaryImage)
  const images = (activeVariant?.images && activeVariant.images.length > 0)
    ? activeVariant.images
    : (product.images && product.images.length > 0
        ? product.images
        : (product.primaryImage ? [{ url: product.primaryImage, alt: product.name }] : [{ url: "/images/pablo-hero-cutout.png", alt: product.name }]));

  // When color changes, reset image index to 0
  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    setActiveImageIdx(0);
  };

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    const firstAvailable = product.sizes.find(
      (s: any) => s.inStock !== false && s.available !== false
    );
    return firstAvailable ? ((firstAvailable as any).name || (firstAvailable as any).size) : (product.sizes?.[0]?.name || "4Y");
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedNotification, setAddedNotification] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const isWishlisted = isInWishlist(product.id);

  // Prev / Next Image Navigation
  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    setTouchStartX(null);
  };

  const handleAddToBag = () => {
    const currentVariantImage = images[activeImageIdx]?.url || images[0]?.url;
    addToCart(product, selectedSize, selectedColor, quantity, currentVariantImage);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 3000);
  };

  const handleBuyNow = () => {
    const currentVariantImage = images[activeImageIdx]?.url || images[0]?.url;
    addToCart(product, selectedSize, selectedColor, quantity, currentVariantImage);
    router.push("/checkout");
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  // Available colors/variants list
  const variantList = product.colorVariants && product.colorVariants.length > 0
    ? product.colorVariants
    : product.colors.map((c) => ({
        name: c.name,
        hex: c.hex,
        images: product.images,
      }));

  // Filter out current product from related items
  const cleanRelated = relatedProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <PageWrapper navbarProps={{ isStaticPage: true }} forceKidsTheme={isKids}>
      {/* Main Content */}
      <main
        data-gender={isKids ? "kids" : undefined}
        className="flex-1 page-container py-8 sm:py-10 lg:py-12 relative z-10"
      >
        {/* Kids Breadcrumbs / Collection Backlink */}
        {isKids && (
          <nav aria-label="Kids navigation breadcrumbs" className="flex items-center gap-2 mb-6 select-none flex-wrap">
            <Link
              href="/kids"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border-2 border-[#181818] shadow-[2px_2px_0px_#181818] text-xs font-sans font-bold text-[#181818] hover:bg-[#FEF08A] transition-all cursor-pointer"
            >
              <span>&larr;</span>
              <span>KIDS WARDROBE</span>
            </Link>
            <span className="text-[#181818]/40">&bull;</span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FEF08A] text-[#181818] border-2 border-[#181818] text-[10.5px] font-sans font-bold uppercase tracking-wider shadow-[2px_2px_0px_#181818]">
              {product.department || product.category}
            </span>
            {product.badge && (
              <span className="px-3 py-1 rounded-full bg-[#FFFFFF] text-[#181818] border-2 border-[#181818] text-[10px] font-sans font-bold uppercase tracking-wider shadow-[2px_2px_0px_#181818]">
                {product.badge}
              </span>
            )}
          </nav>
        )}

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Gallery: 7 Columns */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails (Desktop column, Mobile horizontal row) */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[720px] scrollbar-none flex-shrink-0 py-1">
                {images.map((img, idx) => {
                  const isCurrent = activeImageIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      aria-label={`View photo ${idx + 1}`}
                      className={`relative w-16 md:w-20 aspect-[3/4] flex-shrink-0 overflow-hidden transition-all cursor-pointer ${
                        isKids
                          ? isCurrent
                            ? "rounded-xl border-2 border-[#181818] shadow-[3px_3px_0px_#181818] scale-95 ring-2 ring-[#FEF08A]"
                            : "rounded-xl border-2 border-[#181818]/30 opacity-75 hover:opacity-100 hover:border-[#181818]"
                          : isCurrent
                          ? "border-[#111111] scale-95 ring-1 ring-[#111111] bg-[#DFDDD6]"
                          : "border-transparent opacity-70 hover:opacity-100 bg-[#DFDDD6]"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || `${product.name} view ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Featured Image with Prev/Next Controls & Touch Swipe */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={`relative flex-1 min-w-0 aspect-[3/4] overflow-hidden group select-none ${
                isKids
                  ? "rounded-2xl border-2 border-[#181818] shadow-[5px_5px_0px_#181818] bg-white"
                  : "bg-[#DFDDD6]"
              }`}
            >
              <Image
                src={images[activeImageIdx]?.url || images[0].url}
                alt={images[activeImageIdx]?.alt || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className={`object-cover transition-transform duration-500 ${
                  isKids ? "kids-card-img" : "group-hover:scale-105"
                }`}
              />

              {/* Prev / Next Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center transition-all cursor-pointer ${
                      isKids
                        ? "rounded-full bg-white/95 border-2 border-[#181818] shadow-[2px_2px_0px_#181818] text-[#181818] hover:bg-[#FEF08A] active:scale-95"
                        : "rounded-full bg-white/80 hover:bg-white text-[#111] shadow-md hover:scale-105"
                    }`}
                  >
                    <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next image"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center transition-all cursor-pointer ${
                      isKids
                        ? "rounded-full bg-white/95 border-2 border-[#181818] shadow-[2px_2px_0px_#181818] text-[#181818] hover:bg-[#FEF08A] active:scale-95"
                        : "rounded-full bg-white/80 hover:bg-white text-[#111] shadow-md hover:scale-105"
                    }`}
                  >
                    <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Pagination Dots at bottom of image (Screen 4 Reference) */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 pointer-events-none">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImageIdx === i
                          ? isKids
                            ? "w-4 bg-[#181818]"
                            : "w-4 bg-[#111111]"
                          : isKids
                          ? "w-1.5 bg-[#181818]/30"
                          : "w-1.5 bg-[#111111]/30"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Wishlist floating button */}
              {isKids ? (
                <div className="absolute top-4 right-4 z-20">
                  <KidsWishlistButton
                    isWishlisted={isWishlisted}
                    onToggle={() => toggleWishlist(product)}
                    isKids
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className="absolute top-4 right-4 p-3 bg-white/80 hover:bg-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? "#111111" : "none"}
                    stroke="#111111"
                    strokeWidth="1.5"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>
              )}

              {/* Tag pill */}
              {product.isSale && (
                <div
                  className={`absolute bottom-4 left-4 uppercase tracking-[0.2em] font-medium px-3 py-1 ${
                    isKids
                      ? "rounded-full border-2 border-[#181818] bg-[#FECDD3] text-[#181818] font-bold text-[10.5px] shadow-[2px_2px_0px_#181818]"
                      : "pablo-dark-badge text-white text-[10px] border border-white/20"
                  }`}
                >
                  SALE — LIMITED AVAILABILITY
                </div>
              )}
            </div>
          </div>

          {/* Product Info: 5 Columns */}
          <div className="lg:col-span-5 flex flex-col justify-between select-none">
            <div>
              {/* Category & Collection */}
              <div
                className={`flex items-center justify-between text-xs tracking-[0.2em] uppercase mb-2 ${
                  isKids ? "text-[#181818] font-bold" : "text-[#666666]"
                }`}
              >
                <span>{product.gender} &bull; {product.category}</span>
                {product.collections && product.collections[0] && (
                  <span className={isKids ? "font-sans font-bold text-[#181818] uppercase" : "font-serif italic capitalize text-[#111111]"}>
                    {product.collections[0].replace("-", " ")}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                className={
                  isKids
                    ? "font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#181818]"
                    : "font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#111111]"
                }
              >
                {product.name}
              </h1>

              {/* Subtitle */}
              <p className={`text-sm mt-1 ${isKids ? "font-sans text-[#475569] font-medium" : "text-[#666666] font-light"}`}>
                {product.subtitle || product.material}
              </p>

              {/* Pricing & Rating Row (Screen 4 Reference) */}
              <div
                className={`flex items-center justify-between pb-5 mt-3 ${
                  isKids ? "border-b-2 border-[#181818]" : "border-b border-[#D9D8D3]"
                }`}
              >
                <div className="flex items-baseline space-x-3">
                  <span
                    className={
                      isKids
                        ? "text-2xl sm:text-3xl font-sans font-black text-[#181818]"
                        : "text-xl sm:text-2xl font-medium text-[#111111]"
                    }
                  >
                    {formatPrice(product.salePrice || product.price)}
                  </span>
                  {(product.originalPrice || product.salePrice) && (
                    <span className="text-base text-[#999999] line-through font-light">
                      {formatPrice(product.originalPrice || product.price)}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span
                      className={`text-xs uppercase tracking-wider px-2 py-0.5 ${
                        isKids
                          ? "rounded-full border border-[#181818] bg-[#FEF08A] text-[#181818] font-bold"
                          : "text-red-700 bg-red-100/60"
                      }`}
                    >
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Rating Badge for Kids (★ 4.8 (120) — Screen 4 Reference) */}
                {isKids && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-[#181818] shadow-[1.5px_1.5px_0px_#181818] text-xs font-sans font-black text-[#181818]">
                    <span className="text-[#EA580C] text-sm leading-none">★</span>
                    <span>4.8</span>
                    <span className="text-[#666666] font-normal text-[11px]">(120)</span>
                  </div>
                )}
              </div>

              {/* Color Selection (Switches active variant and gallery photography!) */}
              {variantList.length > 0 && (
                <div className={`py-5 ${isKids ? "border-b-2 border-[#181818]" : "border-b border-[#D9D8D3]"}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs uppercase tracking-wider ${isKids ? "font-bold text-[#181818]" : "text-[#666666]"}`}>
                      Colour: <strong className={isKids ? "text-[#181818] font-black" : "text-[#111111]"}>{selectedColor}</strong>
                    </span>
                    <span className="text-[11px] text-[#666666]">
                      {variantList.length} {variantList.length === 1 ? "Option" : "Options"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {variantList.map((c) => {
                      const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleColorChange(c.name)}
                          className={`w-8 h-8 rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? isKids
                                ? "ring-2 ring-[#181818] ring-offset-2 ring-offset-[#EBF4FA] border-2 border-[#181818] scale-110"
                                : "ring-2 ring-[#111111] ring-offset-2 ring-offset-[#EAE8E1] scale-105"
                              : isKids
                              ? "border-2 border-[#181818]/50 hover:scale-110"
                              : "border-black/20 hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex || (c as any).value }}
                          title={c.name}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div className={`py-5 ${isKids ? "border-b-2 border-[#181818]" : "border-b border-[#D9D8D3]"}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs uppercase tracking-wider ${isKids ? "font-bold text-[#181818]" : "text-[#666666]"}`}>
                    Select Size: <strong className="text-[#181818] font-black">{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-xs uppercase tracking-wider text-[#111111] font-bold underline underline-offset-4 hover:text-[#666666] cursor-pointer"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((s: any) => {
                    const sizeLabel = s.name || s.size;
                    const isAvailable = s.inStock !== false && s.available !== false;
                    return (
                      <button
                        key={sizeLabel}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(sizeLabel)}
                        className={`h-11 font-sans text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          isKids
                            ? !isAvailable
                              ? "rounded-xl border-2 border-[#181818]/25 text-[#999] opacity-40 cursor-not-allowed line-through"
                              : selectedSize === sizeLabel
                              ? "rounded-xl border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-black shadow-[2px_2px_0px_#181818]"
                              : "rounded-xl border-2 border-[#181818] bg-white text-[#181818] font-bold hover:bg-[#FEF08A]/40"
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

              {/* Quantity Stepper */}
              <div className={`py-5 flex items-center justify-between ${isKids ? "border-b-2 border-[#181818]" : "border-b border-[#D9D8D3]"}`}>
                <span className={`text-xs uppercase tracking-wider ${isKids ? "font-bold text-[#181818]" : "text-[#666666]"}`}>Quantity</span>
                <div
                  className={`flex items-center ${
                    isKids
                      ? "rounded-full border-2 border-[#181818] bg-white shadow-[2px_2px_0px_#181818] overflow-hidden"
                      : "border border-[#D9D8D3] bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`w-9 h-9 flex items-center justify-center text-sm transition-colors cursor-pointer ${
                      isKids ? "text-[#181818] font-bold hover:bg-[#FEF08A]" : "text-[#666666] hover:bg-[#EAE8E1]"
                    }`}
                  >
                    -
                  </button>
                  <span className={`w-10 text-center text-xs font-sans ${isKids ? "font-black text-[#181818]" : "text-[#111111]"}`}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className={`w-9 h-9 flex items-center justify-center text-sm transition-colors cursor-pointer ${
                      isKids ? "text-[#181818] font-bold hover:bg-[#FEF08A]" : "text-[#666666] hover:bg-[#EAE8E1]"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons (Screen 4 Reference) */}
              <div className="py-5 space-y-2.5">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className={`w-full py-3.5 uppercase tracking-[0.16em] transition-all cursor-pointer active:scale-[0.98] ${
                    isKids
                      ? "rounded-full border-2 border-[#181818] bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] font-sans font-black text-xs shadow-[3px_3px_0px_#181818] flex items-center justify-center gap-2"
                      : "pablo-btn-dark text-[#EAE8E1] text-xs font-sans font-medium border border-[#222222] hover:border-white shadow-xs"
                  }`}
                >
                  {isKids && (
                    <svg className="w-4 h-4 fill-none stroke-[#181818] stroke-[2.2]" viewBox="0 0 24 24">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  )}
                  <span>ADD TO BAG</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className={`w-full py-3.5 uppercase tracking-[0.16em] transition-all cursor-pointer active:scale-[0.98] ${
                    isKids
                      ? "rounded-full border-2 border-[#181818] bg-white hover:bg-black hover:text-white text-[#181818] font-sans font-black text-xs shadow-[2px_2px_0px_#181818]"
                      : "border border-[#181818] text-[#181818] hover:bg-black hover:text-white text-xs font-sans font-medium"
                  }`}
                >
                  BUY NOW
                </button>

                {addedNotification && (
                  <p
                    className={`text-xs text-center py-2 transition-all ${
                      isKids
                        ? "rounded-full border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                        : "text-emerald-800 bg-emerald-100/80"
                    }`}
                  >
                    ✓ Added to your shopping bag
                  </p>
                )}
              </div>

              {/* Value Guarantees */}
              <div
                className={`grid grid-cols-2 gap-4 py-4 text-[11px] ${
                  isKids
                    ? "rounded-2xl border-2 border-[#181818] bg-white p-4 shadow-[2px_2px_0px_#181818] text-[#181818] font-medium"
                    : "border-t border-[#D9D8D3] text-[#666666]"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Complimentary Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>30-Day Complimentary Returns</span>
                </div>
              </div>

              {/* Accordions */}
              <div className={isKids ? "mt-4 space-y-2.5" : "mt-4 border-t border-[#D9D8D3] divide-y divide-[#D9D8D3]"}>
                {/* Description & Fit */}
                <div className={isKids ? "rounded-xl border-2 border-[#181818] bg-white p-3.5 shadow-[2px_2px_0px_#181818]" : "py-4"}>
                  <button
                    onClick={() => toggleAccordion("details")}
                    className="w-full flex justify-between items-center text-xs uppercase tracking-wider text-[#111111] font-bold cursor-pointer"
                  >
                    <span>Description & Details</span>
                    <span>{activeAccordion === "details" ? "—" : "+"}</span>
                  </button>
                  {activeAccordion === "details" && (
                    <div className="pt-3 text-xs text-[#555] leading-relaxed space-y-2">
                      <p>{product.description}</p>
                      <ul className="list-disc list-inside pt-2 space-y-1">
                        <li>Crafted from {product.material}</li>
                        <li>Fit: {product.fit || "Relaxed Play Fit"}</li>
                        <li>Designed for play, movement, and enduring luxury</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Materials & Care */}
                <div className={isKids ? "rounded-xl border-2 border-[#181818] bg-white p-3.5 shadow-[2px_2px_0px_#181818]" : "py-4"}>
                  <button
                    onClick={() => toggleAccordion("care")}
                    className="w-full flex justify-between items-center text-xs uppercase tracking-wider text-[#111111] font-bold cursor-pointer"
                  >
                    <span>Care & Maintenance</span>
                    <span>{activeAccordion === "care" ? "—" : "+"}</span>
                  </button>
                  {activeAccordion === "care" && (
                    <div className="pt-3 text-xs text-[#555] leading-relaxed space-y-1">
                      <p>{product.careInstructions || "Gentle cold cycle or hand wash with mild eco-friendly detergent."}</p>
                      <p>Air dry flat in shade. Do not tumble dry.</p>
                    </div>
                  )}
                </div>

                {/* Delivery & Shipping */}
                <div className={isKids ? "rounded-xl border-2 border-[#181818] bg-white p-3.5 shadow-[2px_2px_0px_#181818]" : "py-4"}>
                  <button
                    onClick={() => toggleAccordion("shipping")}
                    className="w-full flex justify-between items-center text-xs uppercase tracking-wider text-[#111111] font-bold cursor-pointer"
                  >
                    <span>Delivery & Returns</span>
                    <span>{activeAccordion === "shipping" ? "—" : "+"}</span>
                  </button>
                  {activeAccordion === "shipping" && (
                    <div className="pt-3 text-xs text-[#555] leading-relaxed space-y-1">
                      <p>{product.deliveryInfo || "Complimentary express courier delivery across all orders (2–4 business days)."}</p>
                      <p>{product.returnsInfo || "Hassle-free 30-day doorstep returns and size exchanges."}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {cleanRelated.length > 0 && (
          <section className={`mt-20 pt-10 ${isKids ? "border-t-2 border-[#181818]" : "border-t border-[#D9D8D3]"}`}>
            <div className="flex items-baseline justify-between mb-8">
              <h2
                className={
                  isKids
                    ? "font-sans font-black text-2xl sm:text-3xl text-[#181818] uppercase tracking-wider"
                    : "font-serif text-2xl sm:text-3xl text-[#111111]"
                }
              >
                {isKids ? "MORE PLAYFUL STYLES" : "CURATED COMPANIONS"}
              </h2>
              <Link
                href={isKids ? "/kids" : `/${product.gender}`}
                className={`text-xs uppercase tracking-widest transition-colors ${
                  isKids ? "font-bold text-[#181818] hover:underline" : "text-[#666666] hover:text-[#111111]"
                }`}
              >
                VIEW FULL COLLECTION &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {cleanRelated.map((p, idx) => (
                <ProductCard key={p.id} product={p} isKids={isKids} index={idx} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSizeGuideOpen(false)} />
          <div
            className={`relative max-w-lg w-full p-6 z-10 ${
              isKids
                ? "bg-white border-2 border-[#181818] rounded-2xl shadow-[6px_6px_0px_#181818]"
                : "bg-[#EAE8E1] border border-[#D9D8D3] shadow-2xl"
            }`}
          >
            <div className={`flex justify-between items-baseline mb-4 pb-3 ${isKids ? "border-b-2 border-[#181818]" : "border-b border-[#D9D8D3]"}`}>
              <h3 className={`text-xl ${isKids ? "font-sans font-black text-[#181818]" : "font-serif text-[#111111]"}`}>
                {isKids ? "KIDS SIZE GUIDE" : "SIZE SPECIFICATIONS (CM)"}
              </h3>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className={`text-xs uppercase tracking-wider cursor-pointer ${
                  isKids ? "font-bold text-[#181818] hover:underline" : "text-[#666666] hover:text-[#111111]"
                }`}
              >
                Close
              </button>
            </div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className={isKids ? "border-b-2 border-[#181818] text-[#181818] font-bold" : "border-b border-[#D9D8D3] text-[#666666]"}>
                  <th className="py-2">SIZE</th>
                  <th className="py-2">AGE / HEIGHT</th>
                  <th className="py-2">CHEST</th>
                  <th className="py-2">WAIST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181818]/15">
                <tr><td className="py-2 font-medium">2Y</td><td>86 - 92 cm</td><td>52 - 54 cm</td><td>50 - 52 cm</td></tr>
                <tr><td className="py-2 font-medium">4Y</td><td>98 - 104 cm</td><td>56 - 58 cm</td><td>53 - 55 cm</td></tr>
                <tr><td className="py-2 font-medium">6Y</td><td>110 - 116 cm</td><td>60 - 62 cm</td><td>56 - 58 cm</td></tr>
                <tr><td className="py-2 font-medium">8Y</td><td>122 - 128 cm</td><td>64 - 66 cm</td><td>59 - 61 cm</td></tr>
                <tr><td className="py-2 font-medium">10Y</td><td>134 - 140 cm</td><td>68 - 72 cm</td><td>62 - 65 cm</td></tr>
                <tr><td className="py-2 font-medium">12Y</td><td>146 - 152 cm</td><td>74 - 78 cm</td><td>66 - 69 cm</td></tr>
              </tbody>
            </table>
            <p className={`mt-4 text-[11px] ${isKids ? "text-[#555] font-medium" : "text-[#666666]"}`}>
              Designed with room for play and growth. If between sizes, choose the larger size for extended comfort.
            </p>
          </div>
        </div>
      )}
      {isKids && <KidsMonkeyScrollIndicator />}
    </PageWrapper>
  );
}
