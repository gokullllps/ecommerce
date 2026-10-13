"use client";

import React from "react";
import { useRevealOnScroll } from "@/lib/animation/useRevealOnScroll";

export interface StaggerGroupProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  staggerMs?: number; // default 60ms increments
  threshold?: number;
  rootMargin?: string;
}

export function StaggerGroup({
  children,
  as: Component = "div",
  className = "",
  style = {},
  staggerMs = 60,
  threshold = 0.1,
  rootMargin = "0px 0px -40px 0px",
}: StaggerGroupProps) {
  const { ref, isVisible, reducedMotion } = useRevealOnScroll<HTMLElement>({
    threshold,
    rootMargin,
  });

  return (
    <Component ref={ref} className={className} style={style}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;

        if (reducedMotion) return child;

        const delay = idx * staggerMs;
        const itemStyle: React.CSSProperties = {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 18px, 0)",
          transition: `opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)`,
          transitionDelay: `${delay}ms`,
          willChange: isVisible ? "auto" : "opacity, transform",
        };

        return (
          <div style={itemStyle} className="h-full w-full">
            {child}
          </div>
        );
      })}
    </Component>
  );
}

export default StaggerGroup;
