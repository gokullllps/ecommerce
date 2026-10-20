"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Product } from "@/types/catalogue";
import { ProductCard } from "./ProductCard";
import { DoodleCloud } from "@/components/kids/KidsDoodles";

import { useSiteTheme } from "@/context/ThemeContext";

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
  activeCategory?: string;
}

export function ProductGrid({ products, onResetFilters, activeCategory = "all" }: ProductGridProps) {
  const pathname = usePathname();
  const { isKids: isThemeKids } = useSiteTheme();
  const isKids = isThemeKids || Boolean(pathname?.startsWith("/kids"));

  // Luxury category transition state (SAME PAGE, no page reload)
  const [displayedProducts, setDisplayedProducts] = React.useState<Product[]>(products);
  const [transitionState, setTransitionState] = React.useState<"idle" | "exit" | "enter">("idle");
  const prevCategoryRef = React.useRef(activeCategory);

  React.useEffect(() => {
    if (isKids) {
      setDisplayedProducts(products);
      return;
    }

    if (prevCategoryRef.current !== activeCategory) {
      prevCategoryRef.current = activeCategory;
      setTransitionState("exit");

      const exitTimer = setTimeout(() => {
        setDisplayedProducts(products);
        setTransitionState("enter");

        const enterTimer = setTimeout(() => {
          setTransitionState("idle");
        }, 480);

        return () => clearTimeout(enterTimer);
      }, 250);

      return () => clearTimeout(exitTimer);
    } else {
      setDisplayedProducts(products);
    }
  }, [products, activeCategory, isKids]);

  if (displayedProducts.length === 0) {
    if (isKids) {
      return (
        <div className="w-full py-20 sm:py-28 flex flex-col items-center justify-center text-center select-none kids-reveal-scale">
          <div className="mb-4 animate-kids-float">
            <DoodleCloud className="w-24 h-auto" color="#FEF08A" borderColor="#181818" borderWidth={2.5} />
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#181818] font-bold mb-2">
            OOPS! NO MATCHES FOUND
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#181818] mb-3 font-sans">
            Nothing Matches That Filter
          </h3>
          <p className="text-xs sm:text-sm text-[#475569] font-medium max-w-sm mb-6 leading-relaxed">
            Try resetting your filters or exploring another playful category like Clothing, Footwear, or Accessories!
          </p>
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-8 py-3 bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] text-xs uppercase tracking-widest font-bold border-2 border-[#181818] rounded-full shadow-[3px_3px_0px_#181818] hover:shadow-[1px_1px_0px_#181818] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="w-full py-24 sm:py-32 flex flex-col items-center justify-center text-center select-none">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#999999] mb-3">
          No Results Found
        </p>
        <h3
          className="text-2xl sm:text-3xl font-normal uppercase text-[#111111] mb-4"
          style={{ fontFamily: "'Orborn', sans-serif", fontKerning: "normal" }}
        >
          No Pieces Match Your Current Selection
        </h3>
        <p className="text-xs sm:text-sm text-[#666666] font-light max-w-md mb-8">
          Try clearing selected filters or exploring our curated seasonal collections.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-8 py-3.5 pablo-btn-dark text-[#EAE8E1] text-xs uppercase tracking-[0.24em] font-medium border border-[#222222] hover:border-white transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  const transitionClass = isKids
    ? "kids-grid-enter"
    : transitionState === "exit"
    ? "pablo-category-exit"
    : transitionState === "enter"
    ? "pablo-category-enter"
    : "";

  const gridClasses = isKids
    ? "kids-product-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-5 sm:gap-x-6 sm:gap-y-7 md:gap-x-[24px] md:gap-y-8 lg:gap-x-[30px] lg:gap-y-[36px]"
    : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8";

  return (
    <div key={isKids ? activeCategory : undefined} className={`w-full ${transitionClass}`}>
      <div className={gridClasses}>
        {displayedProducts.map((product, idx) => (
          <ProductCard
            key={`${activeCategory}-${product.id}`}
            product={product}
            isKids={isKids}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
