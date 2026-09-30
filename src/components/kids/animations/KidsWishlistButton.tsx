"use client";
import React, { useCallback, useRef, useState } from "react";

interface KidsWishlistButtonProps {
  isWishlisted: boolean;
  onToggle: () => void;
  isKids?: boolean;
}

const SPARKLE_POSITIONS = [
  { top: "-10px", left: "50%",  delay: "0ms"  },
  { top: "0px",   left: "95%",  delay: "40ms" },
  { top: "45%",   left: "105%", delay: "60ms" },
  { top: "90%",   left: "90%",  delay: "20ms" },
];

/**
 * Wishlist heart button with Kids sparkle micro-interaction.
 * On wishlisting: heart pops + sparkles appear.
 * On un-wishlisting: heart gently deflates.
 */
export function KidsWishlistButton({ isWishlisted, onToggle, isKids }: KidsWishlistButtonProps) {
  const [heartAnim, setHeartAnim] = useState<"pop" | "deflate" | null>(null);
  const [showSparkles, setShowSparkles] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!isWishlisted) {
      // About to wishlist → pop + sparkles
      setHeartAnim("pop");
      setShowSparkles(true);
      timerRef.current = setTimeout(() => {
        setHeartAnim(null);
        setShowSparkles(false);
      }, 520);
    } else {
      // About to un-wishlist → deflate
      setHeartAnim("deflate");
      timerRef.current = setTimeout(() => setHeartAnim(null), 300);
    }

    onToggle();
  }, [isWishlisted, onToggle]);

  if (!isKids) {
    // Render standard wishlist button for non-kids
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${
          isWishlisted
            ? "pablo-btn-dark text-white border border-white/20 shadow-sm"
            : "bg-black/35 backdrop-blur-[2px] text-white/70 group-hover:text-white hover:!bg-black/75"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill={isWishlisted ? "#FFFFFF" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#181818] ${
        isWishlisted
          ? "bg-[#FF6B6B] border-2 border-[#181818] shadow-[2px_2px_0px_#181818]"
          : "bg-white/90 border-2 border-[#181818] shadow-[1px_1px_0px_#181818] hover:bg-[#FFF0F0]"
      }`}
      style={{ position: "relative" }}
    >
      {/* Heart icon with animation class */}
      <span
        className={
          heartAnim === "pop"
            ? "kids-heart-pop"
            : heartAnim === "deflate"
            ? "kids-heart-deflate"
            : ""
        }
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        key={heartAnim ?? "idle"}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={isWishlisted ? "#FFFFFF" : "none"}
          stroke={isWishlisted ? "#FFFFFF" : "#181818"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </span>

      {/* Sparkle particles */}
      {showSparkles && SPARKLE_POSITIONS.map((pos, i) => (
        <span
          key={i}
          className="kids-sparkle-particle"
          style={{
            top: pos.top,
            left: pos.left,
            animationDelay: pos.delay,
          }}
          aria-hidden="true"
        >
          <span className="w-4 h-4 rounded-full bg-[#FEF08A] border border-[#181818] shadow-[1px_1px_0px_#181818] flex items-center justify-center">
            <svg className="w-2.5 h-2.5 fill-[#181818]" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.6 7.6 2.4-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/>
            </svg>
          </span>
        </span>
      ))}
    </button>
  );
}
