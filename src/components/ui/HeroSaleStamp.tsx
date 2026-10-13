"use client";

import Link from "next/link";
import React from "react";

interface HeroSaleStampProps {
  isVisible: boolean;
  className?: string;
}

export function HeroSaleStamp({ isVisible, className }: HeroSaleStampProps) {
  return (
    <div
      className={
        className
          ? `z-30 pointer-events-auto select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`
          : "absolute top-5 sm:top-6 md:top-8 lg:top-10 right-[18vw] sm:right-[19vw] md:right-[20vw] lg:right-[21vw] z-30 pointer-events-auto select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      }
      style={{
        opacity: isVisible ? 0.85 : 0,
        transform: isVisible ? "scale(1) rotate(-8deg)" : "scale(0.9) rotate(-14deg)",
        transitionDelay: "240ms",
      }}
    >
      <Link
        href="/sale"
        aria-label="Sale is live: Up to 40% off — Explore the PABLO sale collection"
        className="group block cursor-pointer w-[96px] h-[96px] sm:w-[110px] sm:h-[110px] md:w-[120px] md:h-[120px] lg:w-[128px] lg:h-[128px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-100 hover:scale-[1.04] active:scale-[0.98] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
      >
        {/* Continuous Smooth Slow Wheel Rotation Container - pauses on hover */}
        <div className="w-full h-full animate-wheel-spin group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]">
          <svg
            viewBox="0 0 140 140"
            className="w-full h-full text-[#111111] overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              {/* Subtle rubber ink distress filter for authentic printed irregularity */}
              <filter id="pablo-rubber-stamp-distress" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
              </filter>

              {/* Top arc for PABLO · AUTUMN / WINTER 2026 */}
              <path
                id="stamp-top-arc"
                d="M 23,70 A 47,47 0 0,1 117,70"
              />

              {/* Bottom arc for UP TO 40% OFF */}
              <path
                id="stamp-bottom-arc"
                d="M 23,70 A 47,47 0 0,0 117,70"
              />
            </defs>

            <g filter="url(#pablo-rubber-stamp-distress)">
              {/* Outer Circular Seal with slight ink variations */}
              <circle
                cx="70"
                cy="70"
                r="66"
                stroke="#111111"
                strokeWidth="1.6"
                strokeDasharray="48 0.8 32 0.6 42 1.2"
              />

              {/* Outer Fine Concentric Stippled Ring */}
              <circle
                cx="70"
                cy="70"
                r="61.5"
                stroke="#111111"
                strokeWidth="1"
                strokeDasharray="3 2"
                opacity="0.75"
              />

              {/* Inner Circular Line */}
              <circle
                cx="70"
                cy="70"
                r="40"
                stroke="#111111"
                strokeWidth="1.1"
              />

              {/* Top Circular Text: PABLO · AUTUMN / WINTER 2026 */}
              <text
                fontSize="6.8"
                fontWeight="500"
                fontFamily="var(--font-body, 'Inter', sans-serif)"
                letterSpacing="0.26em"
                fill="#111111"
              >
                <textPath href="#stamp-top-arc" startOffset="50%" textAnchor="middle">
                  ★ PABLO · A/W 2026 ★
                </textPath>
              </text>

              {/* Bottom Circular Text: UP TO 40% OFF */}
              <text
                fontSize="7.2"
                fontWeight="600"
                fontFamily="var(--font-body, 'Inter', sans-serif)"
                letterSpacing="0.24em"
                fill="#111111"
              >
                <textPath href="#stamp-bottom-arc" startOffset="50%" textAnchor="middle">
                  ★ UP TO 40% OFF ★
                </textPath>
              </text>

              {/* Central Horizontal Stamped Band */}
              {/* Top Band Border */}
              <line
                x1="18"
                y1="53"
                x2="122"
                y2="53"
                stroke="#111111"
                strokeWidth="1.5"
              />

              {/* Center Solid Ink Bar */}
              <rect
                x="20"
                y="55"
                width="100"
                height="30"
                fill="#111111"
              />

              {/* Dominant Central Word: SALE */}
              <text
                x="70"
                y="77"
                textAnchor="middle"
                fontSize="22"
                fontWeight="500"
                fontFamily="'Beverly', var(--font-editorial), serif"
                letterSpacing="0.08em"
                fill="#EAE8E1"
              >
                SALE
              </text>

              {/* Bottom Band Border */}
              <line
                x1="18"
                y1="87"
                x2="122"
                y2="87"
                stroke="#111111"
                strokeWidth="1.5"
              />

              {/* Subtle vintage ink distress flecks */}
              <circle cx="35" cy="46" r="0.6" fill="#111111" opacity="0.5" />
              <circle cx="105" cy="46" r="0.7" fill="#111111" opacity="0.5" />
              <circle cx="36" cy="94" r="0.7" fill="#111111" opacity="0.5" />
              <circle cx="104" cy="94" r="0.6" fill="#111111" opacity="0.5" />
            </g>
          </svg>
        </div>
      </Link>
    </div>
  );
}
