"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("pablo_admin_store_v1");
      }
      const stored = localStorage.getItem("pablo_admin_store_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.products && Array.isArray(parsed.products)) {
          const match = parsed.products.find(
            (p: Product) => p.id === initialProduct.id || p.slug === initialProduct.slug
          );
          if (match) {
            // Strictly reconcile product images with canonical data
            if (initialProduct.images && initialProduct.images.length > 0) {
              match.images = initialProduct.images;
              match.primaryImage = initialProduct.primaryImage;
              match.hoverImage = initialProduct.hoverImage;
              match.colorVariants = initialProduct.colorVariants;
            }
            setProduct(match);
          }
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


  // Unified color variants list combining product.colorVariants and product.colors
  const variantList = React.useMemo(() => {
    const cvList = product.colorVariants || [];
    const cList = product.colors || [];

    if (cvList.length === 0 && cList.length === 0) {
      return [
        {
          name: "Standard",
          hex: "#111111",
          inStock: product.stock > 0 && product.isAvailable !== false,
          images: product.images && product.images.length > 0
            ? product.images
            : [{ url: product.primaryImage || "/images/pablo-hero-cutout.webp", alt: product.name }],
        },
      ];
    }

    if (cvList.length > 0) {
      return cvList.map((cv) => {
        const matchingColor = cList.find((c) => c.name.toLowerCase() === cv.name.toLowerCase());
        const hex = cv.hex || cv.value || matchingColor?.hex || "#111111";
        const inStock = cv.inStock !== false && (matchingColor ? matchingColor.inStock !== false : true);
        const images = (cv.images && cv.images.length > 0)
          ? cv.images
          : (product.images && product.images.length > 0
              ? product.images
              : [{ url: product.primaryImage || "/images/pablo-hero-cutout.webp", alt: `${product.name} — ${cv.name}` }]);

        return {
          name: cv.name,
          hex,
          inStock,
          images,
        };
      });
    }

    return cList.map((c) => {
      const inStock = c.inStock !== false;
      const images = (c.images && c.images.length > 0)
        ? c.images
        : (c.imageOverride
            ? [{ url: c.imageOverride, alt: `${product.name} — ${c.name}` }]
            : (product.images && product.images.length > 0
                ? product.images
                : [{ url: product.primaryImage || "/images/pablo-hero-cutout.webp", alt: `${product.name} — ${c.name}` }]));

      return {
        name: c.name,
        hex: c.hex || "#111111",
        inStock,
        images,
      };
    });
  }, [product]);

  // Initial color: choose first IN-STOCK variant if possible
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    const firstInStock = variantList.find((v) => v.inStock);
    return firstInStock ? firstInStock.name : (variantList[0]?.name || "Standard");
  });

  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Coordinated physical card stack animation state
  const [animState, setAnimState] = useState<{
    direction: "next" | "prev";
    fromIdx: number;
    toIdx: number;
  } | null>(null);
  const isAnimatingRef = useRef(false);
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);
  const justWrappedIdxRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const activeColorName = hoveredColor || selectedColor;

  // Preload all variant gallery images to prevent delays
  useEffect(() => {
    if (typeof window !== "undefined") {
      variantList.forEach((v) => {
        v.images?.forEach((img: any) => {
          const u = typeof img === "string" ? img : img?.url;
          if (u) {
            const i = new window.Image();
            i.src = u;
          }
        });
      });
    }
  }, [variantList]);

  // Active color variant (previews hovered swatch immediately, otherwise selected)
  const activeVariant = React.useMemo(() => {
    return variantList.find((v) => v.name.toLowerCase() === activeColorName.toLowerCase()) || variantList[0];
  }, [variantList, activeColorName]);

  // Check if variant has price override
  const variantPriceOverride = React.useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      const match = product.variants.find(
        (v) => v.colorName.toLowerCase() === selectedColor.toLowerCase() && v.priceOverride
      );
      if (match?.priceOverride) return match.priceOverride;
    }
    return null;
  }, [product.variants, selectedColor]);

  const currentPrice = variantPriceOverride || product.salePrice || product.price;

  // Variant available sizes
  const availableSizes = React.useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      const matchingVariants = product.variants.filter(
        (v) => v.colorName.toLowerCase() === selectedColor.toLowerCase()
      );
      if (matchingVariants.length > 0) {
        return matchingVariants
          .filter((v) => v.isAvailable !== false && v.stock > 0)
          .map((v) => v.sizeName);
      }
    }
    return (product.sizes || [])
      .filter((s: any) => s.inStock !== false && s.available !== false)
      .map((s: any) => s.name || s.size);
  }, [product.variants, product.sizes, selectedColor]);

  // Variant stock count & in-stock status
  const isVariantInStock = activeVariant ? activeVariant.inStock : true;
  const variantStockCount = React.useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      const matchingVariants = product.variants.filter(
        (v) => v.colorName.toLowerCase() === selectedColor.toLowerCase()
      );
      if (matchingVariants.length > 0) {
        return matchingVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
      }
    }
    return isVariantInStock ? (product.stock ?? 10) : 0;
  }, [product.variants, product.stock, selectedColor, isVariantInStock]);

  // Resolve active gallery images from color variant (or fallback to product.images / primaryImage)
  const rawImages = (activeVariant?.images && activeVariant.images.length > 0)
    ? activeVariant.images
    : (product.images && product.images.length > 0
        ? product.images
        : (product.primaryImage ? [{ url: product.primaryImage, alt: product.name }] : [{ url: "/images/pablo-hero-cutout.webp", alt: product.name }]));

  const parsedImages = rawImages
    .map((img: any) => {
      const url = typeof img === "string" ? img : img?.url;
      return url ? { url, alt: (typeof img === "object" && img?.alt) ? img.alt : product.name } : null;
    })
    .filter(Boolean) as { url: string; alt: string }[];

  const images = parsedImages.length > 0
    ? parsedImages
    : [{ url: product.primaryImage || "/images/pablo-hero-cutout.webp", alt: product.name }];

  // Throttled navigation to prevent rapid click jitter
  // Coordinated physical card stack transition trigger
  const triggerStackTransition = useCallback(
    (targetIdx: number, direction: "next" | "prev") => {
      if (isAnimatingRef.current) return;
      if (targetIdx === activeImageIdx) return;
      if (images.length <= 1 || prefersReducedMotion) {
        setActiveImageIdx(targetIdx);
        return;
      }

      isAnimatingRef.current = true;
      setAnimState({
        direction,
        fromIdx: activeImageIdx,
        toIdx: targetIdx,
      });

      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        justWrappedIdxRef.current = activeImageIdx;
        setActiveImageIdx(targetIdx);
        setAnimState(null);
        isAnimatingRef.current = false;
        setTimeout(() => {
          justWrappedIdxRef.current = null;
        }, 50);
      }, 680);
    },
    [activeImageIdx, images.length, prefersReducedMotion]
  );

  const handlePrevImage = useCallback(() => {
    if (images.length <= 1 || isAnimatingRef.current) return;
    const prevIdx = activeImageIdx > 0 ? activeImageIdx - 1 : images.length - 1;
    triggerStackTransition(prevIdx, "prev");
  }, [activeImageIdx, images.length, triggerStackTransition]);

  const handleNextImage = useCallback(() => {
    if (images.length <= 1 || isAnimatingRef.current) return;
    const nextIdx = activeImageIdx < images.length - 1 ? activeImageIdx + 1 : 0;
    triggerStackTransition(nextIdx, "next");
  }, [activeImageIdx, images.length, triggerStackTransition]);

  const handleNav = useCallback(
    (newIdx: number) => {
      if (newIdx === activeImageIdx || isAnimatingRef.current) return;
      const direction: "next" | "prev" = newIdx > activeImageIdx ? "next" : "prev";
      triggerStackTransition(newIdx, direction);
    },
    [activeImageIdx, triggerStackTransition]
  );

  // When color changes, reset image index to 0 and reset animation state
  const handleColorChange = (newColor: string) => {
    const target = variantList.find((v) => v.name.toLowerCase() === newColor.toLowerCase());
    if (target && !target.inStock) return;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setAnimState(null);
    isAnimatingRef.current = false;
    justWrappedIdxRef.current = null;
    setSelectedColor(newColor);
    setActiveImageIdx(0);
  };

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    const firstAvailable = product.sizes.find(
      (s: any) => s.inStock !== false && s.available !== false
    );
    return firstAvailable ? ((firstAvailable as any).name || (firstAvailable as any).size) : (product.sizes?.[0]?.name || "4Y");
  });

  // Keep selectedSize valid when variant changes
  useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  // Card geometry tokens
  const peekOffset = isMobile ? 18 : 28;
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const standardTransition = prefersReducedMotion
    ? "none"
    : `transform 680ms ${ease}, opacity 600ms ${ease}`;

  // Computes the exact transform, scale, opacity, and z-index for each card in the deck
  const getCardStyle = useCallback(
    (idx: number) => {
      const baseStyle: React.CSSProperties = {
        position: "absolute",
        left: isMobile ? "48%" : "47%",
        top: "50%",
        width: isMobile ? "92%" : "min(92%, 620px)",
        height: isMobile ? "96%" : "95%",
      };

      const total = images.length;
      if (total <= 1) {
        return {
          style: {
            ...baseStyle,
            transform: "translate3d(-50%, -50%, 0) scale(1)",
            opacity: 1,
            zIndex: 30,
            visibility: "visible" as const,
            pointerEvents: "auto" as const,
          },
          isFront: true,
          isBehind1: false,
        };
      }

      // If IDLE (no animation in progress)
      if (!animState) {
        const diff = (idx - activeImageIdx + total) % total;
        const didJustWrap = justWrappedIdxRef.current === idx;

        if (diff === 0) {
          return {
            style: {
              ...baseStyle,
              transform: "translate3d(-50%, -50%, 0) scale(1)",
              opacity: 1,
              zIndex: 30,
              visibility: "visible" as const,
              pointerEvents: "auto" as const,
              transition: didJustWrap ? "none" : standardTransition,
            },
            isFront: true,
            isBehind1: false,
          };
        }

        if (diff === 1) {
          return {
            style: {
              ...baseStyle,
              transform: `translate3d(calc(-50% + ${peekOffset}px), -50%, 0) scale(${isMobile ? 0.95 : 0.94})`,
              opacity: 1,
              zIndex: 20,
              visibility: "visible" as const,
              pointerEvents: "auto" as const,
              transition: didJustWrap ? "none" : standardTransition,
            },
            isFront: false,
            isBehind1: true,
          };
        }

        if (diff === 2 && total > 2) {
          return {
            style: {
              ...baseStyle,
              transform: `translate3d(calc(-50% + ${Math.round(peekOffset * 1.85)}px), -50%, 0) scale(${isMobile ? 0.90 : 0.88})`,
              opacity: 1,
              zIndex: 10,
              visibility: "visible" as const,
              pointerEvents: "none" as const,
              transition: didJustWrap ? "none" : standardTransition,
            },
            isFront: false,
            isBehind1: false,
          };
        }

        // Previous card resting offscreen left ready to enter if "prev" is clicked
        if (diff === total - 1) {
          return {
            style: {
              ...baseStyle,
              transform: "translate3d(calc(-50% - 108%), -50%, 0) scale(0.94)",
              opacity: 0,
              zIndex: 1,
              visibility: "hidden" as const,
              pointerEvents: "none" as const,
              transition: "none",
            },
            isFront: false,
            isBehind1: false,
          };
        }

        // Any deeper cards in stack
        return {
          style: {
            ...baseStyle,
            transform: `translate3d(calc(-50% + ${Math.round(peekOffset * 2.4)}px), -50%, 0) scale(${isMobile ? 0.86 : 0.82})`,
            opacity: 0,
            zIndex: 5,
            visibility: "hidden" as const,
            pointerEvents: "none" as const,
            transition: "none",
          },
          isFront: false,
          isBehind1: false,
        };
      }

      // ANIMATING STATE
      const { direction, fromIdx, toIdx } = animState;

      if (direction === "next") {
        // Outgoing front card: smoothly slides out of stack to the left
        if (idx === fromIdx) {
          return {
            style: {
              ...baseStyle,
              transform: "translate3d(calc(-50% - 108%), -50%, 0) scale(0.94)",
              opacity: 0,
              zIndex: 35,
              visibility: "visible" as const,
              pointerEvents: "none" as const,
              transition: prefersReducedMotion
                ? "none"
                : `transform 680ms ${ease}, opacity 520ms ${ease}`,
            },
            isFront: false,
            isBehind1: false,
          };
        }

        // Incoming front card: advances from rank 1 into front position
        if (idx === toIdx) {
          return {
            style: {
              ...baseStyle,
              transform: "translate3d(-50%, -50%, 0) scale(1)",
              opacity: 1,
              zIndex: 30,
              visibility: "visible" as const,
              pointerEvents: "auto" as const,
              transition: standardTransition,
            },
            isFront: true,
            isBehind1: false,
          };
        }

        // Behind card advancing from rank 2 into rank 1 (peek 1)
        if (idx === (toIdx + 1) % total) {
          return {
            style: {
              ...baseStyle,
              transform: `translate3d(calc(-50% + ${peekOffset}px), -50%, 0) scale(${isMobile ? 0.95 : 0.94})`,
              opacity: 1,
              zIndex: 20,
              visibility: "visible" as const,
              pointerEvents: "auto" as const,
              transition: standardTransition,
            },
            isFront: false,
            isBehind1: true,
          };
        }

        // Deeper card advancing from offstage into rank 2 (peek 2)
        if (idx === (toIdx + 2) % total && total > 2) {
          return {
            style: {
              ...baseStyle,
              transform: `translate3d(calc(-50% + ${Math.round(peekOffset * 1.85)}px), -50%, 0) scale(${isMobile ? 0.90 : 0.88})`,
              opacity: 1,
              zIndex: 10,
              visibility: "visible" as const,
              pointerEvents: "none" as const,
              transition: standardTransition,
            },
            isFront: false,
            isBehind1: false,
          };
        }

        return {
          style: {
            ...baseStyle,
            transform: `translate3d(calc(-50% + ${Math.round(peekOffset * 2.4)}px), -50%, 0) scale(${isMobile ? 0.86 : 0.82})`,
            opacity: 0,
            zIndex: 5,
            visibility: "hidden" as const,
            pointerEvents: "none" as const,
            transition: "none",
          },
          isFront: false,
          isBehind1: false,
        };
      }

      // direction === "prev"
      // Incoming card advances from offscreen left into front position
      if (idx === toIdx) {
        return {
          style: {
            ...baseStyle,
            transform: "translate3d(-50%, -50%, 0) scale(1)",
            opacity: 1,
            zIndex: 35,
            visibility: "visible" as const,
            pointerEvents: "auto" as const,
            transition: standardTransition,
          },
          isFront: true,
          isBehind1: false,
        };
      }

      // Outgoing front card slips back into rank 1 in the stack
      if (idx === fromIdx) {
        return {
          style: {
            ...baseStyle,
            transform: `translate3d(calc(-50% + ${peekOffset}px), -50%, 0) scale(${isMobile ? 0.95 : 0.94})`,
            opacity: 1,
            zIndex: 25,
            visibility: "visible" as const,
            pointerEvents: "auto" as const,
            transition: standardTransition,
          },
          isFront: false,
          isBehind1: true,
        };
      }

      // Card that was at rank 1 slips back to rank 2
      if (idx === (fromIdx + 1) % total && total > 2) {
        return {
          style: {
            ...baseStyle,
            transform: `translate3d(calc(-50% + ${Math.round(peekOffset * 1.85)}px), -50%, 0) scale(${isMobile ? 0.90 : 0.88})`,
            opacity: 1,
            zIndex: 15,
            visibility: "visible" as const,
            pointerEvents: "none" as const,
            transition: standardTransition,
          },
          isFront: false,
          isBehind1: false,
        };
      }

      // Card that was at rank 2 slips deeper/fades
      if (idx === (fromIdx + 2) % total && total > 3) {
        return {
          style: {
            ...baseStyle,
            transform: `translate3d(calc(-50% + ${Math.round(peekOffset * 2.4)}px), -50%, 0) scale(${isMobile ? 0.86 : 0.82})`,
            opacity: 0,
            zIndex: 10,
            visibility: "visible" as const,
            pointerEvents: "none" as const,
            transition: standardTransition,
          },
          isFront: false,
          isBehind1: false,
        };
      }

      // Default hidden
      return {
        style: {
          ...baseStyle,
          transform: `translate3d(calc(-50% + ${Math.round(peekOffset * 2.4)}px), -50%, 0) scale(${isMobile ? 0.86 : 0.82})`,
          opacity: 0,
          zIndex: 5,
          visibility: "hidden" as const,
          pointerEvents: "none" as const,
          transition: "none",
        },
        isFront: false,
        isBehind1: false,
      };
    },
    [images.length, activeImageIdx, animState, isMobile, peekOffset, standardTransition, prefersReducedMotion]
  );

  const [quantity, setQuantity] = useState<number>(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedNotification, setAddedNotification] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

  // Automatic card transition every 2 seconds (paused on hover, cleaned up on unmount)
  useEffect(() => {
    if (images.length <= 1 || isGalleryHovered) return;

    const interval = setInterval(() => {
      if (!isAnimatingRef.current) {
        const nextIdx = activeImageIdx < images.length - 1 ? activeImageIdx + 1 : 0;
        triggerStackTransition(nextIdx, "next");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeImageIdx, images.length, isGalleryHovered, triggerStackTransition]);

  const isWishlisted = isInWishlist(product.id);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevImage, handleNextImage]);

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
    if (!isVariantInStock || variantStockCount === 0) return;
    const currentVariantImage = images[activeImageIdx]?.url || images[0]?.url;
    addToCart(product, selectedSize, selectedColor, quantity, currentVariantImage);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 3000);
  };

  const handleBuyNow = () => {
    if (!isVariantInStock || variantStockCount === 0) return;
    const currentVariantImage = images[activeImageIdx]?.url || images[0]?.url;
    addToCart(product, selectedSize, selectedColor, quantity, currentVariantImage);
    router.push("/checkout");
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  // Filter out current product from related items
  const cleanRelated = relatedProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <PageWrapper navbarProps={{ isStaticPage: true }} forceKidsTheme={isKids}>
      {/* Main Content */}
      <main
        data-gender={isKids ? "kids" : undefined}
        className="flex-1 page-container py-5 relative z-10 w-full min-w-0"
        style={{ minHeight: 0 }}
      >
        {/* Kids Breadcrumbs / Collection Backlink */}
        {isKids && (
          <nav aria-label="Kids navigation breadcrumbs" className="flex items-center gap-2 mb-4 select-none flex-wrap">
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
        <div
          data-kids={isKids ? "true" : undefined}
          className="pdp-hero-grid grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch"
          style={{ minHeight: 0 }}
        >
          {/* Gallery: 7 Columns */}
          <div
            className="lg:col-span-7 pdp-gallery-container flex items-stretch min-w-0 w-full"
            style={{ minHeight: 0 }}
          >

            {/* Main Featured Image Display with Reference Overlapping Card Stack */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={() => setIsGalleryHovered(true)}
              onMouseLeave={() => setIsGalleryHovered(false)}
              className={`relative flex-1 min-w-0 w-full h-[460px] sm:h-[540px] md:h-[600px] lg:h-full max-h-full min-h-[380px] overflow-hidden group select-none flex items-center justify-center ${
                isKids
                  ? "rounded-2xl border-2 border-[#181818] shadow-[5px_5px_0px_#181818] bg-[#F1F5F9]"
                  : "rounded-sm bg-[#EAE8E1]"
              }`}
              style={{ minHeight: 0 }}
            >
              {/* Connected Physical Card Stack */}
              {images.map((img, idx) => {
                const card = getCardStyle(idx);
                const hasError = imageErrors[img.url];
                const imageSrc = hasError
                  ? (product.primaryImage || "/images/pablo-hero-cutout.webp")
                  : img.url;

                return (
                  <div
                    key={`${img.url}-${idx}`}
                    onClick={() => {
                      if (card.isBehind1 && !isAnimatingRef.current) {
                        handleNextImage();
                      }
                    }}
                    className={`flex items-center justify-center overflow-hidden will-change-transform select-none shadow-none ${
                      isKids
                        ? "rounded-2xl bg-white border-2 border-[#181818]"
                        : "rounded-xl sm:rounded-2xl bg-[#1E2323] border border-[#2D3333]"
                    } ${card.isBehind1 ? "cursor-pointer hover:border-white/20" : ""}`}
                    style={card.style}
                    aria-hidden={!card.isFront}
                  >
                    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#1E2323] shadow-none">
                      <Image
                        src={imageSrc}
                        alt={img.alt || `${product.name} view ${idx + 1}`}
                        fill
                        priority={idx === activeImageIdx}
                        loading={idx === activeImageIdx ? undefined : (idx < 2 ? "eager" : "lazy")}
                        sizes="(max-width: 640px) 95vw, (max-width: 1024px) 70vw, 55vw"
                        onError={() => {
                          setImageErrors((prev) => ({ ...prev, [img.url]: true }));
                        }}
                        className="object-cover w-full h-full select-none"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center center",
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Prev / Next Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    disabled={isAnimatingRef.current}
                    aria-label="Previous image"
                    className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center cursor-pointer ${
                      isKids
                        ? "rounded-full bg-white/95 border-2 border-[#181818] shadow-[2px_2px_0px_#181818] text-[#181818] hover:bg-[#FEF08A] active:scale-95 transition-all"
                        : "pablo-gallery-arrow active:scale-95"
                    }`}
                  >
                    <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    disabled={isAnimatingRef.current}
                    aria-label="Next image"
                    className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center cursor-pointer ${
                      isKids
                        ? "rounded-full bg-white/95 border-2 border-[#181818] shadow-[2px_2px_0px_#181818] text-[#181818] hover:bg-[#FEF08A] active:scale-95 transition-all"
                        : "pablo-gallery-arrow active:scale-95"
                    }`}
                  >
                    <svg className="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Editorial Gallery Page Indicator */}
              {images.length > 1 && (
                <div
                  className={`absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full select-none transition-all ${
                    isKids
                      ? "bg-white/95 border-2 border-[#181818] shadow-[2px_2px_0px_#181818] text-[#181818]"
                      : "bg-black/60 backdrop-blur-md border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                  }`}
                  role="tablist"
                  aria-label={`Image gallery, slide ${activeImageIdx + 1} of ${images.length}`}
                >
                  {images.map((_, idx) => {
                    const isActive = idx === activeImageIdx;
                    return (
                      <button
                        key={`page-dot-${idx}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Go to slide ${idx + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNav(idx);
                        }}
                        className="p-1 -m-0.5 flex items-center justify-center cursor-pointer focus:outline-none"
                      >
                        <span
                          className={`block h-1.5 rounded-full transition-all duration-300 ease-out ${
                            isActive
                              ? isKids
                                ? "w-4 bg-[#181818]"
                                : "w-5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                              : isKids
                              ? "w-1.5 bg-[#181818]/30 hover:bg-[#181818]/60"
                              : "w-1.5 bg-white/35 hover:bg-white/70"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Wishlist floating button */}
              {isKids ? (
                <div className="absolute top-4 right-4 z-40">
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
                  className="absolute top-4 right-4 z-40 p-3 bg-white/85 hover:bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-transform hover:scale-110 cursor-pointer"
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
                  className={`absolute bottom-4 left-4 z-30 uppercase tracking-[0.2em] font-medium px-3 py-1 ${
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
          <div
            className="lg:col-span-5 pdp-details-container flex flex-col select-none min-w-0 pr-1 md:pr-3 scrollbar-none"
            style={{ minHeight: 0 }}
          >
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
                    : "font-orborn text-2xl sm:text-3xl lg:text-4xl font-normal uppercase tracking-[0.04em] text-[#111111]"
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
                        : "text-lg sm:text-xl font-orborn font-normal tracking-[0.06em] text-[#111111]"
                    }
                  >
                    {formatPrice(currentPrice)}
                  </span>
                  {(product.originalPrice || (product.salePrice && currentPrice < (product.originalPrice || product.price))) && (
                    <span className="text-base text-[#999999] line-through font-light">
                      {formatPrice(product.originalPrice || product.price)}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > currentPrice && (
                    <span
                      className={`text-xs uppercase tracking-wider px-2 py-0.5 ${
                        isKids
                          ? "rounded-full border border-[#181818] bg-[#FEF08A] text-[#181818] font-bold"
                          : "text-red-700 bg-red-100/60"
                      }`}
                    >
                      Save {Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)}%
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

              {/* Color Selection (Switches active variant, images, and availability!) */}
              {variantList.length > 0 && (
                <div className={`py-5 ${isKids ? "border-b-2 border-[#181818]" : "border-b border-[#D9D8D3]"}`}>
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] uppercase tracking-[0.24em] ${isKids ? "font-bold text-[#181818]" : "text-[#666666]"}`}>
                        Colour
                      </span>
                      <span className="text-xs text-[#999999]" aria-hidden="true">—</span>
                      <span className="text-xs uppercase tracking-[0.14em] font-medium text-[#111111] transition-colors duration-200">
                        {hoveredColor || selectedColor}
                      </span>
                    </div>
                    <span className="text-[10.5px] uppercase tracking-[0.18em] text-[#888888]">
                      {variantList.length} {variantList.length === 1 ? "Shade" : "Shades"}
                    </span>
                  </div>

                  <div 
                    className="flex items-center gap-2.5 flex-wrap py-1"
                    onMouseLeave={() => setHoveredColor(null)}
                  >
                    {variantList.map((c) => {
                      const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
                      const isHighlighted = hoveredColor ? hoveredColor.toLowerCase() === c.name.toLowerCase() : isSelected;
                      const isAvailable = c.inStock;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          disabled={!isAvailable}
                          onMouseEnter={() => isAvailable && setHoveredColor(c.name)}
                          onMouseLeave={() => setHoveredColor(null)}
                          onClick={() => {
                            if (isAvailable) {
                              handleColorChange(c.name);
                              setHoveredColor(null);
                            }
                          }}
                          aria-label={`Select colour ${c.name}${!isAvailable ? " (Out of Stock)" : ""}`}
                          aria-pressed={isSelected}
                          className={`group relative inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                            !isAvailable
                              ? "opacity-35 cursor-not-allowed border border-[#D9D8D3] bg-transparent"
                              : isHighlighted
                              ? isKids
                                ? "border-2 border-[#181818] bg-[#FEF08A] text-[#181818] shadow-[2px_2px_0px_#181818]"
                                : "border-[#111111] bg-white text-[#111111] shadow-xs ring-1 ring-[#111111]"
                              : "border border-[#D9D8D3] bg-white/40 hover:bg-white text-[#666666] hover:text-[#111111] hover:border-[#111111]"
                          }`}
                          title={`${c.name}${!isAvailable ? " — Out of Stock" : ""}`}
                        >
                          {/* Tactile Color Swatch Circle */}
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0 block relative transition-transform duration-200 group-hover:scale-110"
                            style={{ backgroundColor: c.hex }}
                          >
                            {!isAvailable && (
                              <span className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-full">
                                <span className="w-[140%] h-[1.5px] bg-[#999999] rotate-45 transform" />
                              </span>
                            )}
                          </span>

                          {/* Shade Name */}
                          <span
                            className={`text-[11px] font-sans uppercase tracking-[0.16em] ${
                              isSelected ? "font-semibold text-[#111111]" : "font-medium"
                            }`}
                          >
                            {c.name}
                          </span>

                          {!isAvailable && (
                            <span className="text-[9.5px] uppercase tracking-wider text-[#999999] font-normal">
                              Sold Out
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div className={`py-5 ${isKids ? "border-b-2 border-[#181818]" : "border-b border-[#D9D8D3]"}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs uppercase tracking-wider ${isKids ? "font-bold text-[#181818]" : "text-[#666666]"}`}>
                    Select Size: <strong className={isKids ? "text-[#181818] font-black" : "text-[#111111] font-medium"}>{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className={`text-xs uppercase underline underline-offset-4 hover:text-[#666666] cursor-pointer ${
                      isKids ? "tracking-wider text-[#181818] font-bold" : "tracking-[0.14em] text-[#111111] font-medium"
                    }`}
                  >
                    Size Guide
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((s: any) => {
                    const sizeLabel = s.name || s.size;
                    const isAvailable = isVariantInStock && availableSizes.includes(sizeLabel) && s.inStock !== false && s.available !== false;
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

              {/* Stock Availability Indicator */}
              <div className={`py-3 flex items-center gap-2 ${isKids ? "border-b-2 border-[#181818]" : "border-b border-[#D9D8D3]"}`}>
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    !isVariantInStock || variantStockCount === 0
                      ? "bg-red-500"
                      : variantStockCount <= 5
                      ? "bg-amber-500 animate-pulse"
                      : "bg-emerald-600"
                  }`}
                />
                <span className="text-[11px] uppercase tracking-wider text-[#666666] font-medium font-sans">
                  {!isVariantInStock || variantStockCount === 0
                    ? "Out of Stock"
                    : variantStockCount <= 5
                    ? `Only ${variantStockCount} remaining — Order soon`
                    : "In Stock · Ready to dispatch"}
                </span>
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
                    disabled={!isVariantInStock || variantStockCount === 0}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`w-9 h-9 flex items-center justify-center text-sm transition-colors cursor-pointer ${
                      !isVariantInStock || variantStockCount === 0
                        ? "text-[#999] opacity-40 cursor-not-allowed"
                        : isKids ? "text-[#181818] font-bold hover:bg-[#FEF08A]" : "text-[#666666] hover:bg-[#EAE8E1]"
                    }`}
                  >
                    -
                  </button>
                  <span className={`w-10 text-center text-xs font-sans ${isKids ? "font-black text-[#181818]" : "text-[#111111]"}`}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={!isVariantInStock || variantStockCount === 0}
                    onClick={() => setQuantity(quantity + 1)}
                    className={`w-9 h-9 flex items-center justify-center text-sm transition-colors cursor-pointer ${
                      !isVariantInStock || variantStockCount === 0
                        ? "text-[#999] opacity-40 cursor-not-allowed"
                        : isKids ? "text-[#181818] font-bold hover:bg-[#FEF08A]" : "text-[#666666] hover:bg-[#EAE8E1]"
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
                  disabled={!isVariantInStock || variantStockCount === 0}
                  onClick={handleAddToBag}
                  className={`w-full py-3.5 uppercase tracking-[0.16em] transition-all cursor-pointer active:scale-[0.98] ${
                    !isVariantInStock || variantStockCount === 0
                      ? "opacity-40 cursor-not-allowed bg-stone-300 text-stone-600 border-stone-300"
                      : isKids
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
                  <span>{!isVariantInStock || variantStockCount === 0 ? "OUT OF STOCK" : "ADD TO BAG"}</span>
                </button>
                <button
                  type="button"
                  disabled={!isVariantInStock || variantStockCount === 0}
                  onClick={handleBuyNow}
                  className={`w-full py-3.5 uppercase tracking-[0.16em] transition-all cursor-pointer active:scale-[0.98] ${
                    !isVariantInStock || variantStockCount === 0
                      ? "opacity-40 cursor-not-allowed border-stone-300 text-stone-500"
                      : isKids
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
                    className={`w-full flex justify-between items-center text-xs uppercase cursor-pointer ${
                      isKids ? "tracking-wider text-[#181818] font-bold" : "tracking-[0.16em] text-[#111111] font-medium"
                    }`}
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
                    className={`w-full flex justify-between items-center text-xs uppercase cursor-pointer ${
                      isKids ? "tracking-wider text-[#181818] font-bold" : "tracking-[0.16em] text-[#111111] font-medium"
                    }`}
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
                    className={`w-full flex justify-between items-center text-xs uppercase cursor-pointer ${
                      isKids ? "tracking-wider text-[#181818] font-bold" : "tracking-[0.16em] text-[#111111] font-medium"
                    }`}
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
