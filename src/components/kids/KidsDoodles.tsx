"use client";

import React from "react";

// ─── 1. FLUFFY CARTOON CLOUD ─────────────────────────────────────
export function DoodleCloud({
  className = "w-24 h-16",
  color = "#FFFFFF",
  borderColor = "#181818",
  borderWidth = 2.5,
}: {
  className?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 120 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M28 62H94C104.5 62 113 53.5 113 43C113 33.2 105.6 25.2 96 24.2C94.2 13.8 85.1 6 74 6C65.4 6 58 10.7 54.3 17.7C50.7 15.3 46.4 14 41.7 14C30.2 14 20.8 22.8 20.2 34.1C13.2 36.1 8 42.4 8 50C8 56.6 13.4 62 20 62H28Z"
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Subtle cloud inner smile curve */}
      <path
        d="M48 42C52 46 62 46 66 42"
        stroke={borderColor}
        strokeWidth={Math.max(1.8, borderWidth - 0.5)}
        strokeLinecap="round"
      />
      {/* Tiny happy eye dots */}
      <circle cx="44" cy="36" r="2" fill={borderColor} />
      <circle cx="70" cy="36" r="2" fill={borderColor} />
    </svg>
  );
}

// ─── 2. PLAYFUL TWINKLE STAR (4-Point or 5-Point) ────────────────
export function DoodleStar({
  className = "w-8 h-8",
  color = "#FEF08A",
  strokeColor = "#181818",
  strokeWidth = 2,
  variant = "sparkle",
}: {
  className?: string;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  variant?: "sparkle" | "classic" | "burst";
}) {
  if (variant === "sparkle") {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M20 2C20 12 28 20 38 20C28 20 20 28 20 38C20 28 12 20 2 20C12 20 20 12 20 2Z"
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 3L24.5 13.5L36 15L27.5 23L30 35L20 29L10 35L12.5 23L4 15L15.5 13.5L20 3Z"
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── 3. SNEAKER CARTOON SPEED & MOTION LINES ─────────────────────
export function DoodleSneakerMotion({
  className = "w-28 h-12",
  color = "#FB923C",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 140 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Dynamic speed woosh curves */}
      <path
        d="M6 34C30 34 50 28 85 14"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M24 42C48 42 70 36 115 22"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 6"
      />
      <path
        d="M50 48C76 48 100 42 134 32"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Little energy burst sparks */}
      <circle cx="120" cy="12" r="2.5" fill={color} />
      <circle cx="102" cy="6" r="1.8" fill={color} />
      <circle cx="132" cy="20" r="2" fill={color} />
    </svg>
  );
}

// ─── 4. CARTOON SUNSHINE WITH PLAYFUL SMILE ──────────────────────
export function DoodleSun({
  className = "w-16 h-16",
  color = "#FEF08A",
  borderColor = "#181818",
}: {
  className?: string;
  color?: string;
  borderColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Sun rays */}
      <line x1="40" y1="6" x2="40" y2="14" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="66" x2="40" y2="74" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="6" y1="40" x2="14" y2="40" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="66" y1="40" x2="74" y2="40" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="16" x2="22" y2="22" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="58" x2="64" y2="64" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="64" x2="22" y2="58" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="22" x2="64" y2="16" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
      {/* Sun Body */}
      <circle cx="40" cy="40" r="22" fill={color} stroke={borderColor} strokeWidth="3" />
      {/* Happy Face */}
      <circle cx="33" cy="36" r="2.5" fill={borderColor} />
      <circle cx="47" cy="36" r="2.5" fill={borderColor} />
      <path d="M34 44C36 48 44 48 46 44" stroke={borderColor} strokeWidth="2.5" strokeLinecap="round" />
      {/* Cute rosy cheeks */}
      <circle cx="28" cy="42" r="2" fill="#F472B6" />
      <circle cx="52" cy="42" r="2" fill="#F472B6" />
    </svg>
  );
}

// ─── 5. PLAYFUL STICKER BADGE ────────────────────────────────────
export function StickerBadge({
  text,
  icon,
  bgColor = "#FFFFFF",
  textColor = "#181818",
  borderColor = "#181818",
  rotate = "-3deg",
  className = "",
}: {
  text: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  rotate?: string;
  className?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderColor: borderColor,
        transform: `rotate(${rotate})`,
        boxShadow: "3px 3px 0px #181818",
      }}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 text-[11px] font-sans font-bold tracking-wider uppercase select-none transition-transform duration-200 hover:scale-105 ${className}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}

// ─── 6. DOODLE ARROW (Hand-drawn smooth arrow) ───────────────────
export function DoodleArrow({
  className = "w-12 h-12",
  color = "#181818",
  direction = "down",
}: {
  className?: string;
  color?: string;
  direction?: "down" | "right" | "curve-down";
}) {
  if (direction === "curve-down") {
    return (
      <svg
        viewBox="0 0 60 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M12 12C36 10 50 28 42 54"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M32 46L42 56L54 48"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 8V32M20 32L12 24M20 32L28 24"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── 7. PLAYFUL DOODLE HEART ─────────────────────────────────────
export function DoodleHeart({
  className = "w-7 h-7",
  color = "#F472B6",
  strokeColor = "#181818",
}: {
  className?: string;
  color?: string;
  strokeColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 26C16 26 5 19 5 11.5C5 7.5 8 4.5 12 4.5C14.2 4.5 15.5 5.5 16 6.5C16.5 5.5 17.8 4.5 20 4.5C24 4.5 27 7.5 27 11.5C27 19 16 26 16 26Z"
        fill={color}
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
