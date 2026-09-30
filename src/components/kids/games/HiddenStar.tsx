"use client";

import React, { useState } from "react";
import { useKidsHiddenStars } from "./HiddenStarsContext";

interface HiddenStarProps {
  slotId?: string;
  anchorId?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Optional rotation degrees or transform string */
  rotate?: string;
}

export function HiddenStar({
  slotId,
  anchorId,
  className = "",
  style,
  rotate,
}: HiddenStarProps) {
  const targetAnchor = anchorId || slotId;
  const { stars, collectedStars, collectStar, mounted } = useKidsHiddenStars();
  const [collecting, setCollecting] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Clean SSR hydration guard
  if (!mounted || !targetAnchor) {
    return null;
  }

  // Find if this anchor holds an assigned star in current cycle
  const star = stars.find((s) => s.anchorId === targetAnchor);
  if (!star || collectedStars.includes(star.id)) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (collecting) return;

    setCollecting(true);
    // Micro-sparkle celebration plays, then persists collection and unmounts
    setTimeout(() => {
      collectStar(star.id);
    }, 450);
  };

  return (
    <div
      data-slot={targetAnchor}
      data-star-id={star.id}
      className={`absolute z-30 select-none pointer-events-auto ${className}`}
      style={{
        transform: rotate ? `rotate(${rotate})` : undefined,
        ...style,
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`Collect hidden star ${star.id}`}
        className={`relative w-8 h-8 sm:w-9 sm:h-9 -m-2 sm:-m-2.5 flex items-center justify-center cursor-pointer focus:outline-none transition-transform duration-200 ${
          collecting ? "pointer-events-none" : "hover:scale-115 active:scale-90"
        }`}
      >
        {/* Subtle, discoverable Easter Egg Star (12–14px visible) */}
        <svg
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#FDE047] stroke-[#181818] stroke-[1.5] transition-all duration-300 ${
            collecting
              ? "scale-150 opacity-0 translate-x-3 translate-y-5 transition-all duration-500 ease-in"
              : hovered
              ? "opacity-100 scale-125 drop-shadow-[0_0_5px_rgba(250,204,21,0.9)]"
              : "opacity-75 drop-shadow-[0.5px_0.5px_0px_#181818] animate-kids-pulse"
          }`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>

        {/* Playful micro-sparkle particles radiating outward on collection */}
        {collecting && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span
              className="absolute w-1.5 h-1.5 rounded-full bg-[#FEF08A] shadow-[0_0_3px_#EAB308] animate-ping"
              style={{ transform: "translate(-9px, -9px)" }}
            />
            <span
              className="absolute w-1.5 h-1.5 rounded-full bg-[#F472B6] shadow-[0_0_3px_#EC4899] animate-ping"
              style={{ transform: "translate(9px, -7px)", animationDelay: "50ms" }}
            />
            <span
              className="absolute w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_3px_#0284C7] animate-ping"
              style={{ transform: "translate(-7px, 9px)", animationDelay: "90ms" }}
            />
            <span
              className="absolute w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_3px_#16A34A] animate-ping"
              style={{ transform: "translate(10px, 10px)", animationDelay: "40ms" }}
            />
          </div>
        )}
      </button>
    </div>
  );
}

export default HiddenStar;
