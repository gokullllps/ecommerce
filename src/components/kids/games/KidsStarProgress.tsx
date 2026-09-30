"use client";

import React, { useState, useCallback } from "react";
import { useKidsHiddenStars, DISCOUNT_CODE, TOTAL_STARS } from "./HiddenStarsContext";

/**
 * KidsStarProgress:
 * Structurally rendered inside <KidsProductSection>, completely outside <Footer>.
 * Uses CSS position: sticky constrained within the Kids product/catalogue container.
 * When the Kids product section ends, the card naturally stops and scrolls away before the footer.
 */
export function KidsStarProgress() {
  const { foundCount, isComplete, generateNextCycle, mounted } = useKidsHiddenStars();
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(DISCOUNT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="kids-star-progress-wrapper sticky top-18 sm:top-20 z-30 w-full flex items-center justify-end py-2 pointer-events-none mb-3"
      aria-label="Kids Star Progress Card Section"
    >
      <aside
        aria-label="Kids Star Reward Progress"
        className="pointer-events-auto select-none mr-2 sm:mr-4 transition-transform hover:scale-102"
      >
        {!isComplete ? (
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#FEF08A] border-2 border-[#181818] shadow-[3px_3px_0px_#181818] text-[#181818] font-sans font-bold text-xs uppercase tracking-wider"
            aria-label={`Hidden star game: ${foundCount} of ${TOTAL_STARS} stars found`}
          >
            <svg
              className="w-3.5 h-3.5 fill-[#181818] animate-kids-pulse"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>
              FIND 10 STARS · {foundCount}/{TOTAL_STARS}
            </span>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 sm:gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#FEF08A] border-2 border-[#181818] shadow-[3px_3px_0px_#181818] text-[#181818] font-sans font-bold text-xs uppercase tracking-wider animate-kids-pop"
            aria-label="10% discount unlocked"
          >
            <svg
              className="w-4 h-4 fill-[#181818] animate-kids-twinkle"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>
              10% OFF: <strong className="font-mono underline">KIDS10</strong>
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-2 py-0.5 rounded-full bg-[#181818] text-[#FEF08A] text-[10px] font-bold tracking-wider hover:bg-black active:scale-95 transition-all cursor-pointer"
              aria-label="Copy discount code KIDS10"
            >
              {copied ? "COPIED!" : "COPY"}
            </button>
            <button
              type="button"
              onClick={generateNextCycle}
              className="px-2 py-0.5 rounded-full bg-white text-[#181818] border border-[#181818] text-[10px] font-bold tracking-wider hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
              aria-label="Start new star hunt cycle"
              title="Start new game cycle"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default KidsStarProgress;
