import React from "react";
import { usePathname } from "next/navigation";
import { ActiveFilterState } from "@/types/filters";
import { useSiteTheme } from "@/context/ThemeContext";

interface AppliedFiltersProps {
  activeFilters: ActiveFilterState;
  onRemove: (dimension: keyof ActiveFilterState, value?: string | number) => void;
  onClearAll: () => void;
  isSalePage?: boolean;
  isNewInPage?: boolean;
}

export function AppliedFilters({
  activeFilters,
  onRemove,
  onClearAll,
  isSalePage,
  isNewInPage,
}: AppliedFiltersProps) {
  const { isKids: isSiteKids } = useSiteTheme();
  const pathname = usePathname();
  const isKids = isSiteKids || Boolean(pathname?.startsWith("/kids"));
  const chips: { id: string; label: string; onRemove: () => void }[] = [];

  // Category
  activeFilters.categories.forEach((cat) => {
    chips.push({
      id: `cat-${cat}`,
      label: cat.toUpperCase(),
      onRemove: () => onRemove("categories", cat),
    });
  });

  // Product Type
  activeFilters.productTypes.forEach((pt) => {
    chips.push({
      id: `pt-${pt}`,
      label: pt.toUpperCase(),
      onRemove: () => onRemove("productTypes", pt),
    });
  });

  // Footwear Type
  activeFilters.footwearTypes.forEach((fw) => {
    chips.push({
      id: `fw-${fw}`,
      label: fw.toUpperCase(),
      onRemove: () => onRemove("footwearTypes", fw),
    });
  });

  // Accessory Type
  activeFilters.accessoryTypes.forEach((acc) => {
    chips.push({
      id: `acc-${acc}`,
      label: acc.toUpperCase(),
      onRemove: () => onRemove("accessoryTypes", acc),
    });
  });

  // Sizes
  activeFilters.sizes.forEach((s) => {
    chips.push({
      id: `size-${s}`,
      label: `SIZE: ${s}`,
      onRemove: () => onRemove("sizes", s),
    });
  });

  // Colors
  activeFilters.colors.forEach((c) => {
    chips.push({
      id: `color-${c}`,
      label: `COLOR: ${c}`,
      onRemove: () => onRemove("colors", c),
    });
  });

  // Fits
  activeFilters.fits.forEach((f) => {
    chips.push({
      id: `fit-${f}`,
      label: `FIT: ${f}`,
      onRemove: () => onRemove("fits", f),
    });
  });

  // Materials
  activeFilters.materials.forEach((m) => {
    chips.push({
      id: `mat-${m}`,
      label: m.toUpperCase(),
      onRemove: () => onRemove("materials", m),
    });
  });

  // Collections
  activeFilters.collections.forEach((col) => {
    chips.push({
      id: `col-${col}`,
      label: col.replace("-", " ").toUpperCase(),
      onRemove: () => onRemove("collections", col),
    });
  });

  // Price Range
  if (activeFilters.minPrice !== undefined || activeFilters.maxPrice !== undefined) {
    const min = activeFilters.minPrice ? `$${activeFilters.minPrice}` : "$0";
    const max = activeFilters.maxPrice ? `$${activeFilters.maxPrice}` : "Max";
    chips.push({
      id: "price-range",
      label: `${min} — ${max}`,
      onRemove: () => onRemove("minPrice"),
    });
  }

  // Toggles
  if (activeFilters.inStockOnly) {
    chips.push({
      id: "inStock",
      label: "IN STOCK",
      onRemove: () => onRemove("inStockOnly"),
    });
  }

  if (activeFilters.saleOnly && !isSalePage) {
    chips.push({
      id: "sale",
      label: "SALE",
      onRemove: () => onRemove("saleOnly"),
    });
  }

  if (activeFilters.newOnly && !isNewInPage) {
    chips.push({
      id: "newIn",
      label: "NEW IN",
      onRemove: () => onRemove("newOnly"),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 pt-1">
      <span
        className={`text-[10px] uppercase tracking-[0.24em] font-medium mr-1 ${
          isKids ? "font-bold text-[#181818]" : "text-[#999999]"
        }`}
      >
        Applied:
      </span>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onRemove}
          className={`inline-flex items-center space-x-1.5 transition-all cursor-pointer group select-none ${
            isKids
              ? "px-3 py-1 text-[10.5px] font-sans font-bold tracking-wider uppercase bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] border-2 border-[#181818] rounded-full shadow-[2px_2px_0px_#181818]"
              : "px-2.5 py-1 text-[11px] font-sans tracking-wider uppercase bg-white border border-[#D9D8D3] hover:border-[#111111]"
          }`}
        >
          <span className={isKids ? "text-[#181818]" : "text-[#111111]"}>{chip.label}</span>
          <span
            className={`text-xs leading-none ${
              isKids ? "text-[#181818] font-bold" : "text-[#999999] group-hover:text-[#111111]"
            }`}
          >
            &times;
          </span>
        </button>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className={`text-[11px] uppercase tracking-wider underline underline-offset-4 ml-2 transition-colors cursor-pointer ${
          isKids
            ? "font-bold text-[#181818] hover:text-[#555]"
            : "text-[#999999] hover:text-[#111111]"
        }`}
      >
        Clear All
      </button>
    </div>
  );
}
