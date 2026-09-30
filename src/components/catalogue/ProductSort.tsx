"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SortOption } from "@/types/catalogue";

import { useSiteTheme } from "@/context/ThemeContext";

interface ProductSortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  recommended: "Recommended",
  newest: "Newest Arrivals",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  popularity: "Popularity",
  "name-asc": "Alphabetical (A–Z)",
};

export function ProductSort({ currentSort, onSortChange }: ProductSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isKids: isThemeKids } = useSiteTheme();
  const isKids = isThemeKids || Boolean(pathname?.startsWith("/kids"));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center space-x-2 text-xs uppercase tracking-[0.18em] transition-colors py-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#111111] ${
          isKids
            ? "text-[#181818] font-bold hover:text-black"
            : "text-[#111111] hover:text-[#666666]"
        }`}
      >
        <span className={isKids ? "text-[#181818] font-bold" : "text-[#666666] font-light"}>Sort:</span>
        <span className={isKids ? "font-bold text-[#181818]" : "font-medium"}>{SORT_LABELS[currentSort]}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={`absolute right-0 top-full mt-2 w-52 z-40 py-2 ${
            isKids
              ? "bg-white border-2 border-[#181818] shadow-[4px_4px_0px_#181818] rounded-xl"
              : "bg-[#EAE8E1] border border-[#D9D8D3] shadow-lg"
          }`}
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={currentSort === option}
              onClick={() => {
                onSortChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors cursor-pointer flex items-center justify-between ${
                isKids
                  ? currentSort === option
                    ? "bg-[#FEF08A] text-[#181818] font-bold border-l-4 border-[#181818]"
                    : "text-[#181818] hover:bg-[#FEF08A]/30 font-medium"
                  : currentSort === option
                  ? "bg-[#D9D8D3]/50 text-[#111111] font-medium"
                  : "text-[#666666] hover:bg-[#D9D8D3]/30 hover:text-[#111111]"
              }`}
            >
              <span>{SORT_LABELS[option]}</span>
              {currentSort === option && (
                <span className={isKids ? "text-[#181818] font-black text-xs" : "text-[#111111] text-xs"}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
