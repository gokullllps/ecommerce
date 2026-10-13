"use client";

import React from "react";
import { useRevealOnScroll } from "@/lib/animation/useRevealOnScroll";

export interface CinematicSectionProps {
  children: React.ReactNode;
  as?: React.ElementType;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  threshold?: number;
  rootMargin?: string;
}

export function CinematicSection({
  children,
  as: Component = "section",
  id,
  className = "",
  style = {},
  "aria-label": ariaLabel,
  threshold = 0.12,
  rootMargin = "0px 0px -50px 0px",
}: CinematicSectionProps) {
  const { ref, isVisible, reducedMotion } = useRevealOnScroll<HTMLElement>({
    threshold,
    rootMargin,
  });

  const sectionStyle: React.CSSProperties = reducedMotion
    ? style
    : {
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 24px, 0)",
        transition: `opacity 850ms cubic-bezier(0.22, 1, 0.36, 1), transform 850ms cubic-bezier(0.22, 1, 0.36, 1)`,
        willChange: isVisible ? "auto" : "opacity, transform",
      };

  return (
    <Component
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      className={className}
      style={sectionStyle}
    >
      {children}
    </Component>
  );
}

export default CinematicSection;
