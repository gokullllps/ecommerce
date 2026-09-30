"use client";

import React from "react";

const PROMO_ITEMS = [
  "FREE DELIVERY ON ORDERS ABOVE €999",
  "NEW SEASON — LIMITED COLLECTION",
  "COMPLIMENTARY RETURNS",
  "EXCLUSIVE PABLO COLLECTION",
  "SARTORIAL PRECISION & ARCHITECTURAL SILHOUETTES",
  "AUTUMN — WINTER 2026 CAMPAIGN",
];

// Doubled to ensure sufficient track width across all displays including 4K
const TICKER_TRACK = [...PROMO_ITEMS, ...PROMO_ITEMS];

/**
 * Editorial Luxury Diamond Separator
 * - Clean 4-point star/diamond vector
 * - Replaces retail discount coupon icons with authentic fashion house restraint
 */
function EditorialDiamond() {
  return (
    <svg
      width="7"
      height="7"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-[#EAE8E1]/40 shrink-0 select-none block"
      aria-hidden="true"
    >
      <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
    </svg>
  );
}

export function PromotionalTicker() {
  return (
    <div
      role="region"
      aria-label="PABLO Announcements"
      id="hero-promotional-ticker"
      tabIndex={0}
      className="group w-full text-white overflow-hidden h-8 sm:h-9 z-30 select-none shrink-0 cursor-default focus:outline-none flex items-center border-t border-[#222222]/90 pablo-dark-ticker"
      style={{ background: "var(--gradient-dark-ticker)", color: "#FFFFFF" }}
    >
      <div className="relative w-full overflow-hidden flex items-center">
        <div className="animate-pablo-ticker group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] flex items-center shrink-0">
          {/* Primary Track */}
          <div className="flex items-center shrink-0">
            {TICKER_TRACK.map((item, idx) => (
              <span
                key={`track1-${idx}`}
                className="inline-flex items-center shrink-0 font-body text-[9px] sm:text-[10px] uppercase tracking-[0.26em] font-light text-[#EAE8E1]/90 whitespace-nowrap"
              >
                <span>{item}</span>
                <span
                  className="inline-flex items-center justify-center mx-5 sm:mx-7 md:mx-8 shrink-0 select-none"
                  aria-hidden="true"
                >
                  <EditorialDiamond />
                </span>
              </span>
            ))}
          </div>

          {/* Secondary Clone Track for mathematically seamless loop */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {TICKER_TRACK.map((item, idx) => (
              <span
                key={`track2-${idx}`}
                className="inline-flex items-center shrink-0 font-body text-[9px] sm:text-[10px] uppercase tracking-[0.26em] font-light text-[#EAE8E1]/90 whitespace-nowrap"
              >
                <span>{item}</span>
                <span
                  className="inline-flex items-center justify-center mx-5 sm:mx-7 md:mx-8 shrink-0 select-none"
                  aria-hidden="true"
                >
                  <EditorialDiamond />
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
