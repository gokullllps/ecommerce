"use client";

import React from "react";
import Link from "next/link";
import { NavDropdownItem } from "@/data/navigation";

export interface NavbarDropdownProps {
  items: NavDropdownItem[];
  isOpen: boolean;
  onClose: () => void;
  align?: "center" | "left" | "right";
}

export function NavbarDropdown({
  items,
  isOpen,
  onClose,
  align = "left",
}: NavbarDropdownProps) {
  if (!isOpen || !items || items.length === 0) return null;

  const alignmentClass =
    align === "right"
      ? "right-0"
      : align === "center"
      ? "left-1/2 -translate-x-1/2"
      : "left-0";

  return (
    <div
      role="menu"
      aria-label="Navigation Submenu"
      className={`absolute top-full ${alignmentClass} mt-1.5 w-[250px] sm:w-[270px] bg-[#FFFFFF]/98 backdrop-blur-md border-x border-b border-[#D9D8D3] border-t-2 border-t-[#111111] shadow-[0_20px_40px_-12px_rgba(17,17,17,0.12),0_4px_12px_rgba(17,17,17,0.04)] z-[200] animate-dropdown-reveal select-none before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2`}
    >
      <ul className="divide-y divide-[#D9D8D3]/50 font-sans">
        {items.map((item) => {
          const upperLabel = item.label.toUpperCase();
          const isSale = upperLabel === "SALE" || upperLabel.includes("SALE");
          const isAll = upperLabel.startsWith("ALL ");

          return (
            <li key={item.label} role="none">
              <Link
                href={item.href}
                onClick={onClose}
                role="menuitem"
                className="group flex items-center justify-between h-[42px] sm:h-[44px] px-5 text-[11px] sm:text-[11.5px] uppercase tracking-[0.18em] text-[#111111] hover:bg-[#111111]/[0.035] transition-all duration-200"
              >
                {/* Left: Indicator + Label */}
                <span className="flex items-center gap-2 transition-transform duration-200 ease-out group-hover:translate-x-1">
                  {isSale && (
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-[#111111] opacity-65 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <span
                    className={
                      isAll
                        ? "font-medium text-[#111111]"
                        : "font-normal text-[#222222] group-hover:text-[#111111]"
                    }
                  >
                    {item.label}
                  </span>
                </span>

                {/* Right: Editorial Line Arrow indicator on hover */}
                <span
                  aria-hidden="true"
                  className="text-[#111111] opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out flex items-center justify-center"
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Backwards compatibility aliases
export const MegaMenu = ({
  config,
  isOpen,
  onClose,
}: {
  config: any;
  isOpen: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose: () => void;
}) => {
  if (!config || !config.items) return null;
  return <NavbarDropdown items={config.items} isOpen={isOpen} onClose={onClose} />;
};

export default NavbarDropdown;
