"use client";

import React from "react";
import { useParallax, ParallaxOptions } from "@/lib/animation/useParallax";

export interface ParallaxProps extends ParallaxOptions {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function Parallax({
  children,
  as: Component = "div",
  className = "",
  style = {},
  speed = 0.04,
  maxOffset = 25,
  direction = "up",
}: ParallaxProps) {
  const { ref, transform, reducedMotion } = useParallax<HTMLElement>({
    speed,
    maxOffset,
    direction,
  });

  const combinedStyle: React.CSSProperties = reducedMotion
    ? style
    : {
        ...style,
        transform,
        willChange: "transform",
      };

  return (
    <Component ref={ref} className={className} style={combinedStyle}>
      {children}
    </Component>
  );
}

export default Parallax;
