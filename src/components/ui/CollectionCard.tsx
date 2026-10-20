"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminCollection } from "@/types/admin";

export interface CollectionCardProps {
  collection: AdminCollection;
  index: number;
  className?: string;
  customHref?: string;
  forceVisible?: boolean;
}

export function CollectionCard({
  collection,
  index,
  className = "",
  customHref,
  forceVisible = false,
}: CollectionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPrefersReducedMotion(true);
      setIsVisible(true);
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Stagger sequence as specified: Card 1 -> 100ms, Card 2 -> 200ms, Card 3 -> 300ms
  const staggerDelay = (index + 1) * 100;
  const duration = 900;
  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

  // Resolve target route
  const getHref = () => {
    if (customHref) return customHref;
    if (collection.slug === "men") return "/men";
    if (collection.slug === "women") return "/women";
    if (collection.slug === "kids") return "/kids";
    if (collection.slug === "new-in") return "/new-in";
    if (collection.slug === "sale") return "/sale";
    return `/collections/${collection.slug}`;
  };

  const imageSrc =
    collection.image && collection.image.trim() !== ""
      ? collection.image
      : collection.banner && collection.banner.trim() !== ""
      ? collection.banner
      : "/images/categories/knitwear.webp";

  const cardLabel =
    collection.label ||
    (index === 0
      ? "NEW SEASON"
      : index === 1
      ? "ARCHITECTURAL COLLECTION"
      : "RAW FORM");

  const categoryName =
    collection.name ||
    collection.category;

  return (
    <div
      ref={cardRef}
      className={`w-full rounded-[20px] sm:rounded-[22px] overflow-hidden ${className}`}
      style={{
        opacity: forceVisible || prefersReducedMotion ? 1 : isVisible ? 1 : 0,
        transform: forceVisible || prefersReducedMotion
          ? "none"
          : isVisible
          ? "translate3d(0, 0, 0)"
          : "translate3d(0, 40px, 0)",
        clipPath: forceVisible || prefersReducedMotion
          ? "none"
          : isVisible
          ? "inset(0% 0% 0% 0%)"
          : "inset(8% 0% 8% 0%)",
        transition: forceVisible || prefersReducedMotion
          ? "none"
          : `opacity ${duration * 0.85}ms ${easing}, transform ${duration}ms ${easing}, clip-path ${duration}ms ${easing}`,
        transitionDelay: forceVisible || prefersReducedMotion ? "0ms" : `${staggerDelay}ms`,
        willChange: forceVisible ? "auto" : isVisible ? "auto" : "opacity, transform, clip-path",
      }}
    >
      <Link
        href={getHref()}
        className="shiny-card group relative block w-full overflow-hidden bg-[#181818] text-[#FFFFFF] rounded-[20px] sm:rounded-[22px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] cursor-pointer select-none"
        style={{
          aspectRatio: "3 / 4",
          minHeight: "440px",
          borderRadius: "20px",
        }}
        aria-label={`${categoryName} — ${cardLabel}`}
      >
        {/* ── CARD FASHION IMAGE ── */}
        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[20px] sm:rounded-[22px]">
          <Image
            src={imageSrc}
            alt={`${categoryName} — PABLO Editorial Collection`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center w-full h-full transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:contrast-[1.05]"
            style={{
              transform: prefersReducedMotion
                ? "none"
                : isVisible
                ? undefined
                : "scale(1.05)",
              filter: "contrast(1.03) brightness(0.92)",
            }}
          />

          {/* Deep Cinematic Editorial Gradient Vignette */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#111111]/90 via-[#111111]/35 to-transparent transition-opacity duration-500 group-hover:opacity-95"
            aria-hidden="true"
          />

          {/* Top Delicate Vignette */}
          <div
            className="absolute inset-x-0 top-0 h-28 pointer-events-none bg-gradient-to-b from-[#111111]/50 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* ── CARD CONTENT OVERLAY ── */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 pointer-events-none">
          {/* Top Overline Label */}
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-[#EAE8E1]/85">
              {cardLabel}
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#EAE8E1]/60 transition-transform duration-300 group-hover:scale-125"
              aria-hidden="true"
            />
          </div>

          {/* Bottom Editorial Information */}
          <div className="w-full flex flex-col items-start gap-2.5 sm:gap-3">
            {/* Collection Title: Subtle translateY(-4px) on desktop hover */}
            <h3
              className="text-2xl sm:text-3xl lg:text-[2rem] font-normal uppercase tracking-[0.04em] text-[#FFFFFF] leading-[1.12] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1"
              style={{
                fontFamily: "'Orborn', sans-serif",
              }}
            >
              {categoryName}
            </h3>

            {/* Optional Short Description */}
            {collection.description && (
              <p className="text-xs sm:text-[13px] font-light text-[#EAE8E1]/75 leading-relaxed line-clamp-2 max-w-sm transition-opacity duration-300 group-hover:text-[#FFFFFF]/90">
                {collection.description}
              </p>
            )}

            {/* Subtle Editorial Action Link: Arrow translateX(0 -> 5px) on desktop hover */}
            <div className="inline-flex items-center gap-2 pt-2 text-[11px] sm:text-xs font-sans font-medium uppercase tracking-[0.24em] text-[#EAE8E1]">
              <span>EXPLORE</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[5px]"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CollectionCard;
