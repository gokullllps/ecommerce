"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ActiveFilterState, FilterGroupConfig, FilterGroupId } from "@/types/filters";

import { useSiteTheme } from "@/context/ThemeContext";

interface ProductFiltersProps {
  filterGroups: FilterGroupConfig[];
  activeFilters: ActiveFilterState;
  priceBounds: [number, number];
  onToggleOption: (groupId: FilterGroupId, optionId: string) => void;
  onSetPriceRange: (min?: number, max?: number) => void;
  onClearFilterGroup?: (groupId: string) => void;
  onResetAll: () => void;
  isOpen: boolean;
  onClose: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  totalFilteredCount: number;
}

interface PriceFilterSectionProps {
  minBound: number;
  maxBound: number;
  currentMin?: number;
  currentMax?: number;
  onChange: (min?: number, max?: number) => void;
  isKids?: boolean;
}

function PriceFilterSection({
  minBound,
  maxBound,
  currentMin,
  currentMax,
  onChange,
  isKids,
}: PriceFilterSectionProps) {
  const [minInput, setMinInput] = useState(currentMin !== undefined ? String(currentMin) : "");
  const [maxInput, setMaxInput] = useState(currentMax !== undefined ? String(currentMax) : "");

  useEffect(() => {
    setMinInput(currentMin !== undefined ? String(currentMin) : "");
    setMaxInput(currentMax !== undefined ? String(currentMax) : "");
  }, [currentMin, currentMax]);

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const minVal = minInput.trim() === "" ? undefined : Number(minInput);
    const maxVal = maxInput.trim() === "" ? undefined : Number(maxInput);
    onChange(minVal, maxVal);
  };

  const handlePreset = (min?: number, max?: number) => {
    setMinInput(min !== undefined ? String(min) : "");
    setMaxInput(max !== undefined ? String(max) : "");
    onChange(min, max);
  };

  return (
    <div className="space-y-3 pt-1">
      {/* Quick Price Brackets */}
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => handlePreset(undefined, 500)}
          className={`w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
            isKids
              ? currentMin === undefined && currentMax === 500
                ? "rounded-xl border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                : "rounded-xl border-2 border-[#181818] bg-white text-[#181818] font-medium hover:bg-[#FEF08A]/30"
              : currentMin === undefined && currentMax === 500
              ? "border bg-[#181818] text-[#EAE8E1] border-[#181818]"
              : "border bg-white text-[#666666] border-[#D9D8D3] hover:border-[#111111]"
          }`}
        >
          Under $500
        </button>
        <button
          type="button"
          onClick={() => handlePreset(500, 1500)}
          className={`w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
            isKids
              ? currentMin === 500 && currentMax === 1500
                ? "rounded-xl border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                : "rounded-xl border-2 border-[#181818] bg-white text-[#181818] font-medium hover:bg-[#FEF08A]/30"
              : currentMin === 500 && currentMax === 1500
              ? "border bg-[#181818] text-[#EAE8E1] border-[#181818]"
              : "border bg-white text-[#666666] border-[#D9D8D3] hover:border-[#111111]"
          }`}
        >
          $500 — $1,500
        </button>
        <button
          type="button"
          onClick={() => handlePreset(1500, undefined)}
          className={`w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
            isKids
              ? currentMin === 1500 && currentMax === undefined
                ? "rounded-xl border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                : "rounded-xl border-2 border-[#181818] bg-white text-[#181818] font-medium hover:bg-[#FEF08A]/30"
              : currentMin === 1500 && currentMax === undefined
              ? "border bg-[#181818] text-[#EAE8E1] border-[#181818]"
              : "border bg-white text-[#666666] border-[#D9D8D3] hover:border-[#111111]"
          }`}
        >
          Above $1,500
        </button>
      </div>

      {/* Manual Dual Inputs */}
      <form onSubmit={handleApply} className={`pt-2 space-y-2 ${isKids ? "border-t-2 border-[#181818]" : "border-t border-[#D9D8D3]/70"}`}>
        <div className={`text-[10px] uppercase tracking-[0.2em] ${isKids ? "font-bold text-[#181818]" : "text-[#666666]"}`}>Custom Range</div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-xs ${isKids ? "text-[#181818] font-bold" : "text-[#999999]"}`}>$</span>
            <input
              type="number"
              min={minBound}
              max={maxBound}
              placeholder={String(minBound)}
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              className={`w-full pl-6 pr-2 py-1 text-xs bg-white outline-none text-[#111111] ${
                isKids ? "border-2 border-[#181818] rounded-lg font-medium" : "border border-[#D9D8D3] focus:border-[#111111]"
              }`}
            />
          </div>
          <span className={`text-xs ${isKids ? "text-[#181818] font-bold" : "text-[#999999]"}`}>—</span>
          <div className="relative flex-1">
            <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-xs ${isKids ? "text-[#181818] font-bold" : "text-[#999999]"}`}>$</span>
            <input
              type="number"
              min={minBound}
              max={maxBound}
              placeholder={String(maxBound)}
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              className={`w-full pl-6 pr-2 py-1 text-xs bg-white outline-none text-[#111111] ${
                isKids ? "border-2 border-[#181818] rounded-lg font-medium" : "border border-[#D9D8D3] focus:border-[#111111]"
              }`}
            />
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-1 text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer ${
            isKids
              ? "rounded-full border-2 border-[#181818] bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
              : "border border-[#111111] text-[#111111] hover:bg-black/5"
          }`}
        >
          Set Price
        </button>
      </form>
    </div>
  );
}

export function ProductFilters({
  filterGroups,
  activeFilters,
  priceBounds,
  onToggleOption,
  onSetPriceRange,
  onClearFilterGroup,
  onResetAll,
  isOpen,
  onClose,
  mobileOpen,
  onMobileClose,
  totalFilteredCount,
}: ProductFiltersProps) {
  const pathname = usePathname();
  const { isKids: isThemeKids } = useSiteTheme();
  const isKids = isThemeKids || Boolean(pathname?.startsWith("/kids"));

  // Desktop: ID of currently open dropdown (only one open at a time, or null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Mobile: expanded accordion IDs
  const [mobileAccordions, setMobileAccordions] = useState<Record<string, boolean>>({});

  const desktopContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    if (!openDropdownId) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        desktopContainerRef.current &&
        !desktopContainerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openDropdownId]);

  // Toggle mobile accordion section
  const toggleMobileAccordion = (groupId: string) => {
    setMobileAccordions((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Check if option is selected
  const isOptionSelected = (groupId: FilterGroupId, optionId: string): boolean => {
    switch (groupId) {
      case "category":
        return activeFilters.categories.includes(optionId);
      case "productType":
        return activeFilters.productTypes.includes(optionId);
      case "footwearType":
        return activeFilters.footwearTypes.includes(optionId);
      case "accessoryType":
        return activeFilters.accessoryTypes.includes(optionId);
      case "size":
        return activeFilters.sizes.includes(optionId);
      case "color":
        return activeFilters.colors.includes(optionId);
      case "fit":
        return activeFilters.fits.includes(optionId);
      case "material":
        return activeFilters.materials.includes(optionId);
      case "collection":
        return activeFilters.collections.includes(optionId);
      case "availability":
        if (optionId === "inStockOnly") return activeFilters.inStockOnly;
        if (optionId === "saleOnly") return activeFilters.saleOnly;
        if (optionId === "newOnly") return activeFilters.newOnly;
        return false;
      default:
        return false;
    }
  };

  // Get count of active filters for a given group
  const getGroupActiveCount = (groupId: string): number => {
    switch (groupId) {
      case "category":
        return activeFilters.categories.length;
      case "productType":
        return activeFilters.productTypes.length;
      case "footwearType":
        return activeFilters.footwearTypes.length;
      case "accessoryType":
        return activeFilters.accessoryTypes.length;
      case "size":
        return activeFilters.sizes.length;
      case "color":
        return activeFilters.colors.length;
      case "fit":
        return activeFilters.fits.length;
      case "material":
        return activeFilters.materials.length;
      case "collection":
        return activeFilters.collections.length;
      case "availability": {
        let count = 0;
        if (activeFilters.inStockOnly) count++;
        if (activeFilters.saleOnly) count++;
        if (activeFilters.newOnly) count++;
        return count;
      }
      case "price":
        return activeFilters.minPrice !== undefined || activeFilters.maxPrice !== undefined ? 1 : 0;
      default:
        return 0;
    }
  };

  // Build unified list of filter buttons (Filter Groups + Price)
  const allFilterItems = useMemo(() => {
    const items: Array<{
      id: string;
      label: string;
      group?: FilterGroupConfig;
      isPrice?: boolean;
    }> = [];

    // Order: category / types, size, color, fit, material, price, collection, availability
    const categoryGroup = filterGroups.find((g) => g.id === "category");
    const productTypeGroup = filterGroups.find((g) => g.id === "productType");
    const footwearTypeGroup = filterGroups.find((g) => g.id === "footwearType");
    const accessoryTypeGroup = filterGroups.find((g) => g.id === "accessoryType");
    const sizeGroup = filterGroups.find((g) => g.id === "size");
    const colorGroup = filterGroups.find((g) => g.id === "color");
    const fitGroup = filterGroups.find((g) => g.id === "fit");
    const materialGroup = filterGroups.find((g) => g.id === "material");
    const collectionGroup = filterGroups.find((g) => g.id === "collection");
    const availabilityGroup = filterGroups.find((g) => g.id === "availability");

    if (categoryGroup) items.push({ id: categoryGroup.id, label: categoryGroup.label, group: categoryGroup });
    if (productTypeGroup) items.push({ id: productTypeGroup.id, label: productTypeGroup.label, group: productTypeGroup });
    if (footwearTypeGroup) items.push({ id: footwearTypeGroup.id, label: footwearTypeGroup.label, group: footwearTypeGroup });
    if (accessoryTypeGroup) items.push({ id: accessoryTypeGroup.id, label: accessoryTypeGroup.label, group: accessoryTypeGroup });
    if (sizeGroup) items.push({ id: sizeGroup.id, label: sizeGroup.label, group: sizeGroup });
    if (colorGroup) items.push({ id: colorGroup.id, label: colorGroup.label, group: colorGroup });
    if (fitGroup) items.push({ id: fitGroup.id, label: fitGroup.label, group: fitGroup });
    if (materialGroup) items.push({ id: materialGroup.id, label: materialGroup.label, group: materialGroup });

    // Insert Price here
    items.push({ id: "price", label: "PRICE", isPrice: true });

    if (collectionGroup) items.push({ id: collectionGroup.id, label: collectionGroup.label, group: collectionGroup });
    if (availabilityGroup) items.push({ id: availabilityGroup.id, label: availabilityGroup.label, group: availabilityGroup });

    return items;
  }, [filterGroups]);

  // Handle Clear for a specific group
  const handleClearGroup = (groupId: string) => {
    if (onClearFilterGroup) {
      onClearFilterGroup(groupId);
    } else {
      if (groupId === "price") {
        onSetPriceRange(undefined, undefined);
      }
    }
  };

  // Render options inside dropdown panel
  const renderDropdownOptions = (group: FilterGroupConfig) => {
    // 1. SIZE: Compact 4-column button grid
    if (group.id === "size") {
      return (
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {group.options.map((opt) => {
            const selected = isOptionSelected(group.id, opt.id);
            const disabled = opt.disabled && !selected;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggleOption(group.id, opt.id)}
                className={`py-2 px-1 text-[11px] font-sans uppercase tracking-wider text-center transition-all cursor-pointer select-none ${
                  isKids
                    ? disabled
                      ? "opacity-25 border-2 border-[#181818]/30 cursor-not-allowed bg-transparent text-[#999999] rounded-xl"
                      : selected
                      ? "rounded-xl border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                      : "rounded-xl border-2 border-[#181818] bg-white text-[#181818] font-medium hover:bg-[#FEF08A]/30"
                    : disabled
                    ? "opacity-25 border border-[#D9D8D3] cursor-not-allowed bg-transparent text-[#999999]"
                    : selected
                    ? "border border-[#111111] bg-[#181818] text-[#EAE8E1] font-medium shadow-xs"
                    : "border border-[#D9D8D3] bg-white text-[#111111] hover:border-[#111111]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    // 2. COLOR: 2-column swatch grid with color circles and names
    if (group.id === "color" || group.type === "swatch") {
      return (
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {group.options.map((opt) => {
            const selected = isOptionSelected(group.id, opt.id);
            const disabled = opt.disabled && !selected;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggleOption(group.id, opt.id)}
                title={`${opt.label} (${opt.count})`}
                className={`flex items-center space-x-2 px-2.5 py-1.5 text-[11px] font-sans tracking-wider uppercase transition-all cursor-pointer select-none text-left ${
                  isKids
                    ? disabled
                      ? "opacity-30 border-2 border-[#181818]/30 cursor-not-allowed bg-transparent text-[#999999] rounded-xl"
                      : selected
                      ? "rounded-xl border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                      : "rounded-xl border-2 border-[#181818] bg-white text-[#181818] font-medium hover:bg-[#FEF08A]/30"
                    : disabled
                    ? "opacity-30 border border-[#D9D8D3] cursor-not-allowed bg-transparent text-[#999999]"
                    : selected
                    ? "border border-[#111111] bg-[#181818] text-[#EAE8E1] font-medium shadow-xs"
                    : "border border-[#D9D8D3] bg-white text-[#111111] hover:border-[#111111]"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full shrink-0 ${isKids ? "border-2 border-[#181818]" : "border border-black/20"}`}
                  style={{ backgroundColor: opt.hex || "#111111" }}
                />
                <span className="truncate flex-1 text-[10px] font-medium">{opt.label}</span>
                <span
                  className={`text-[9px] shrink-0 ${
                    selected ? (isKids ? "text-[#181818]/80 font-bold" : "text-[#EAE8E1]/70") : "text-[#999999]"
                  }`}
                >
                  ({opt.count})
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    // 3. CATEGORY / PRODUCT TYPE / FOOTWEAR TYPE / ACCESSORY TYPE: Clean checkbox list
    if (
      group.id === "category" ||
      group.id === "productType" ||
      group.id === "footwearType" ||
      group.id === "accessoryType"
    ) {
      return (
        <div className="space-y-1.5 pt-1">
          {group.options.map((opt) => {
            const selected = isOptionSelected(group.id, opt.id);
            const disabled = opt.disabled && !selected;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggleOption(group.id, opt.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-sans uppercase tracking-wider transition-colors cursor-pointer text-left select-none ${
                  isKids
                    ? disabled
                      ? "opacity-30 border-2 border-[#181818]/30 cursor-not-allowed bg-transparent text-[#999999] rounded-xl"
                      : selected
                      ? "rounded-xl border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                      : "rounded-xl border-2 border-[#181818] bg-white text-[#181818] font-medium hover:bg-[#FEF08A]/30"
                    : disabled
                    ? "opacity-30 border border-[#D9D8D3] cursor-not-allowed bg-transparent text-[#999999]"
                    : selected
                    ? "border border-[#111111] bg-[#181818] text-[#EAE8E1] font-medium"
                    : "border border-[#D9D8D3] bg-white text-[#111111] hover:border-[#111111]"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={
                      isKids
                        ? `w-4 h-4 rounded-md border-2 border-[#181818] flex items-center justify-center text-[10px] leading-none shrink-0 ${
                            selected ? "bg-[#181818] text-[#FEF08A] font-black" : "bg-white text-transparent"
                          }`
                        : `w-3.5 h-3.5 border flex items-center justify-center text-[10px] leading-none shrink-0 ${
                            selected
                              ? "border-[#EAE8E1] bg-[#EAE8E1] text-[#181818] font-bold"
                              : "border-[#999999] bg-white text-transparent"
                          }`
                    }
                  >
                    {selected ? "✓" : ""}
                  </span>
                  <span>{opt.label}</span>
                </div>
                <span
                  className={
                    selected ? (isKids ? "text-[#181818]/80 font-bold text-[10px]" : "text-[#EAE8E1]/70 text-[10px]") : "text-[#999999] text-[10px]"
                  }
                >
                  ({opt.count})
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    // 4. FIT / MATERIAL / COLLECTION / AVAILABILITY
    return (
      <div className="space-y-1.5 pt-1">
        {group.options.map((opt) => {
          const selected = isOptionSelected(group.id, opt.id);
          const disabled = opt.disabled && !selected;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggleOption(group.id, opt.id)}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-sans uppercase tracking-wider transition-colors cursor-pointer text-left select-none ${
                isKids
                  ? disabled
                    ? "opacity-30 border-2 border-[#181818]/30 cursor-not-allowed bg-transparent text-[#999999] rounded-xl"
                    : selected
                    ? "rounded-xl border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                    : "rounded-xl border-2 border-[#181818] bg-white text-[#181818] font-medium hover:bg-[#FEF08A]/30"
                  : disabled
                  ? "opacity-30 border border-[#D9D8D3] cursor-not-allowed bg-transparent text-[#999999]"
                  : selected
                  ? "border border-[#111111] bg-[#181818] text-[#EAE8E1] font-medium"
                  : "border border-[#D9D8D3] bg-white text-[#111111] hover:border-[#111111]"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span
                  className={
                    isKids
                      ? `w-4 h-4 rounded-md border-2 border-[#181818] flex items-center justify-center text-[10px] leading-none shrink-0 ${
                          selected ? "bg-[#181818] text-[#FEF08A] font-black" : "bg-white text-transparent"
                        }`
                      : `w-3.5 h-3.5 border flex items-center justify-center text-[10px] leading-none shrink-0 ${
                          selected
                            ? "border-[#EAE8E1] bg-[#EAE8E1] text-[#181818] font-bold"
                            : "border-[#999999] bg-white text-transparent"
                        }`
                  }
                >
                  {selected ? "✓" : ""}
                </span>
                <span>{opt.label}</span>
              </div>
              <span
                className={
                  selected ? (isKids ? "text-[#181818]/80 font-bold text-[10px]" : "text-[#EAE8E1]/70 text-[10px]") : "text-[#999999] text-[10px]"
                }
              >
                ({opt.count})
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. COMPACT DESKTOP FILTER BAR & OVERLAY DROPDOWNS
      ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={desktopContainerRef}
          className={`hidden lg:block p-5 mb-6 relative select-none animate-in fade-in duration-200 ${
            isKids
              ? "bg-white border-2 border-[#181818] shadow-[4px_4px_0px_#181818] rounded-2xl"
              : "bg-[#EAE8E1] border border-[#D9D8D3]"
          }`}
          style={{ backgroundColor: isKids ? "#FFFFFF" : "#EAE8E1" }}
        >
          {/* Top Compact Filter Header */}
          <div className={`flex items-center justify-between pb-3 mb-4 ${
            isKids ? "border-b-2 border-[#181818]" : "border-b border-[#D9D8D3]"
          }`}>
            <div className="flex items-center space-x-3">
              <span className={`text-[11px] uppercase tracking-[0.24em] ${isKids ? "font-bold text-[#181818]" : "font-medium text-[#111111]"}`}>
                FILTER CATALOGUE
              </span>
              <span className={`text-[11px] ${isKids ? "text-[#181818]/70 font-medium" : "text-[#666666] font-light"}`}>
                {totalFilteredCount} matching
              </span>
            </div>
            <div className="flex items-center space-x-6 text-xs">
              <button
                type="button"
                onClick={onResetAll}
                className={`${isKids ? "text-[#181818] font-bold" : "text-[#666666] hover:text-[#111111]"} text-[11px] uppercase tracking-[0.16em] underline underline-offset-4 cursor-pointer transition-colors`}
              >
                RESET ALL
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`${isKids ? "text-[#181818] font-bold" : "text-[#666666] hover:text-[#111111]"} text-[11px] uppercase tracking-[0.16em] cursor-pointer transition-colors`}
              >
                CLOSE &times;
              </button>
            </div>
          </div>

          {/* Compact Horizontal Filter Dropdown Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            {allFilterItems.map((item, index) => {
              const isDropdownOpen = openDropdownId === item.id;
              const activeCount = getGroupActiveCount(item.id);
              const isRightAligned = index >= allFilterItems.length - 2;

              return (
                <div key={item.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdownId(isDropdownOpen ? null : item.id)}
                    className={`inline-flex items-center space-x-1.5 px-3.5 py-2 text-[11px] font-sans uppercase tracking-[0.18em] transition-all cursor-pointer select-none ${
                      isKids
                        ? isDropdownOpen
                          ? "rounded-full border-2 border-[#181818] bg-[#181818] text-white font-bold"
                          : activeCount > 0
                          ? "rounded-full border-2 border-[#181818] bg-[#FEF08A] text-[#181818] font-bold shadow-[2px_2px_0px_#181818]"
                          : "rounded-full border-2 border-[#181818] bg-white text-[#181818] font-bold hover:bg-[#FEF08A]/30 shadow-[1px_1px_0px_#181818]"
                        : isDropdownOpen
                        ? "border bg-[#181818] text-[#EAE8E1] border-[#181818]"
                        : activeCount > 0
                        ? "border bg-white text-[#111111] border-[#111111] font-medium"
                        : "border bg-white/90 text-[#111111] border-[#D9D8D3] hover:border-[#111111]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeCount > 0 && (
                      <span
                        className={`text-[10px] font-bold ${
                          isDropdownOpen ? "text-[#FEF08A]" : "text-[#181818]"
                        }`}
                      >
                        ({activeCount})
                      </span>
                    )}
                    <span className="text-[9px] opacity-70 ml-0.5">
                      {isDropdownOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Dropdown Overlay (Directly underneath this button, does not expand page) */}
                  {isDropdownOpen && (
                    <div
                      className={`absolute top-full mt-2 z-40 p-4 animate-in fade-in zoom-in-95 duration-150 ${
                        isKids
                          ? "bg-white border-2 border-[#181818] shadow-[4px_4px_0px_#181818] rounded-xl"
                          : "bg-[#EAE8E1] border border-[#D9D8D3] shadow-xl"
                      } ${
                        item.id === "color" || item.id === "size" || item.id === "price"
                          ? "w-80"
                          : "w-72"
                      } ${isRightAligned ? "right-0" : "left-0"}`}
                      style={{ backgroundColor: isKids ? "#FFFFFF" : "#EAE8E1" }}
                    >
                      {/* Scrollable Container with Max Height */}
                      <div className="max-h-72 overflow-y-auto pr-1">
                        {item.isPrice ? (
                          <PriceFilterSection
                            minBound={priceBounds[0]}
                            maxBound={priceBounds[1]}
                            currentMin={activeFilters.minPrice}
                            currentMax={activeFilters.maxPrice}
                            onChange={onSetPriceRange}
                            isKids={isKids}
                          />
                        ) : item.group ? (
                          renderDropdownOptions(item.group)
                        ) : null}
                      </div>

                      {/* Dropdown Footer: CLEAR & APPLY */}
                      <div className={`flex items-center justify-between pt-3 mt-3 text-[10px] uppercase tracking-wider ${
                        isKids ? "border-t-2 border-[#181818]" : "border-t border-[#D9D8D3]"
                      }`}>
                        <button
                          type="button"
                          onClick={() => handleClearGroup(item.id)}
                          className={`cursor-pointer transition-colors ${
                            isKids
                              ? "text-[#181818] font-bold underline underline-offset-4"
                              : "text-[#666666] hover:text-[#111111] underline underline-offset-4"
                          }`}
                        >
                          CLEAR
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenDropdownId(null)}
                          className={`cursor-pointer transition-all ${
                            isKids
                              ? "px-5 py-1.5 rounded-full border-2 border-[#181818] bg-[#FEF08A] hover:bg-[#FDE047] text-[#181818] font-bold shadow-[2px_2px_0px_#181818] active:scale-95"
                              : "px-4 py-1.5 pablo-btn-dark text-[#EAE8E1] border border-[#222222] hover:border-white font-medium"
                          }`}
                        >
                          APPLY
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE FILTER DRAWER (Bottom-Sheet Slide-Over Accordions)
      ───────────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-h-[88vh] h-full flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 ${
              isKids
                ? "bg-[#EBF4FA] border-t-2 border-[#181818]"
                : "bg-[#EAE8E1] border-t border-[#D9D8D3]"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Filter Catalogue"
            style={{ backgroundColor: isKids ? "#EBF4FA" : "#EAE8E1" }}
          >
            {/* Drawer Header */}
            <div className={`flex items-center justify-between px-6 py-4 shrink-0 ${
              isKids ? "border-b-2 border-[#181818] bg-[#EBF4FA]" : "border-b border-[#D9D8D3] bg-[#EAE8E1]"
            }`}>
              <div>
                <h2 className={isKids ? "font-sans font-black text-xl tracking-tight text-[#181818] uppercase" : "font-serif text-lg tracking-wider text-[#111111] uppercase font-medium"}>
                  FILTERS
                </h2>
                <span className={`text-[11px] ${isKids ? "text-[#181818]/70 font-medium" : "text-[#666666]"}`}>
                  {totalFilteredCount} matching pieces
                </span>
              </div>
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close filters"
                className={`p-2 ${isKids ? "text-[#181818] font-bold" : "text-[#111111] hover:text-[#666666]"} text-2xl leading-none cursor-pointer`}
              >
                &times;
              </button>
            </div>

            {/* Scrollable Collapsible Accordions (all collapsed by default) */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {allFilterItems.map((item) => {
                const isAccordionOpen = !!mobileAccordions[item.id];
                const activeCount = getGroupActiveCount(item.id);

                return (
                  <div key={item.id} className={isKids ? "border-b-2 border-[#181818]/15 pb-3" : "border-b border-[#D9D8D3]/70 pb-3"}>
                    <button
                      type="button"
                      onClick={() => toggleMobileAccordion(item.id)}
                      className="w-full flex items-center justify-between py-2 text-left cursor-pointer select-none"
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`text-[11px] uppercase tracking-[0.22em] ${isKids ? "font-bold text-[#181818]" : "font-medium text-[#111111]"}`}>
                          {item.label}
                        </span>
                        {activeCount > 0 && (
                          <span className={`text-[10px] ${isKids ? "font-bold text-[#181818] bg-[#FEF08A] px-1.5 py-0.5 rounded-full border border-[#181818]" : "font-medium text-[#111111]"}`}>
                            ({activeCount})
                          </span>
                        )}
                      </div>
                      <span className={`text-xs ${isKids ? "text-[#181818] font-bold" : "text-[#666666]"}`}>
                        {isAccordionOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isAccordionOpen && (
                      <div className="pt-2 pb-1">
                        {item.isPrice ? (
                          <PriceFilterSection
                            minBound={priceBounds[0]}
                            maxBound={priceBounds[1]}
                            currentMin={activeFilters.minPrice}
                            currentMax={activeFilters.maxPrice}
                            onChange={onSetPriceRange}
                            isKids={isKids}
                          />
                        ) : item.group ? (
                          renderDropdownOptions(item.group)
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sticky Action Footer */}
            <div className={`p-4 flex items-center space-x-3 shrink-0 ${
              isKids ? "border-t-2 border-[#181818] bg-[#EBF4FA]" : "border-t border-[#D9D8D3] bg-[#EAE8E1]"
            }`}>
              <button
                type="button"
                onClick={onResetAll}
                className={`flex-1 py-3 text-xs uppercase tracking-[0.16em] cursor-pointer font-medium transition-colors ${
                  isKids
                    ? "rounded-xl border-2 border-[#181818] bg-white text-[#181818] font-bold shadow-[2px_2px_0px_#181818] hover:bg-[#FEF08A]/40"
                    : "border border-[#111111] text-[#111111] hover:bg-black/5"
                }`}
              >
                CLEAR ALL
              </button>
              <button
                type="button"
                onClick={onMobileClose}
                className={`flex-1 py-3 text-xs uppercase tracking-[0.16em] cursor-pointer font-bold ${
                  isKids
                    ? "rounded-xl border-2 border-[#181818] bg-[#FEF08A] text-[#181818] shadow-[2px_2px_0px_#181818] hover:brightness-105"
                    : "pablo-btn-dark font-medium"
                }`}
              >
                APPLY FILTERS ({totalFilteredCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductFilters;
