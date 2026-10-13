"use client";

import React from "react";
import { useRevealOnScroll, RevealOptions } from "@/lib/animation/useRevealOnScroll";

export interface RevealProps extends RevealOptions {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
}

export function Reveal({
  children,
  as: Component = "div",
  className = "",
  style = {},
  direction = "up",
  distance = 25,
  duration = 800,
  threshold = 0.15,
  rootMargin = "0px 0px -40px 0px",
  delay = 0,
  once = true,
}: RevealProps) {
  const { ref, isVisible, reducedMotion } = useRevealOnScroll<HTMLElement>({
    threshold,
    rootMargin,
    delay,
    once,
  });

  if (reducedMotion) {
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }

  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      case "none":
      default:
        return "none";
    }
  };

  const animationStyle: React.CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translate3d(0, 0, 0)" : getInitialTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    willChange: isVisible ? "auto" : "opacity, transform",
  };

  return (
    <Component ref={ref} className={className} style={animationStyle}>
      {children}
    </Component>
  );
}

export default Reveal;
