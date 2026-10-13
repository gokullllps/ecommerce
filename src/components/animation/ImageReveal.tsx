"use client";

import React from "react";
import { useImageReveal, ImageRevealOptions } from "@/lib/animation/useImageReveal";

export interface ImageRevealProps extends ImageRevealOptions {
  children: React.ReactNode;
  className?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
}

export function ImageReveal({
  children,
  className = "",
  imageClassName = "",
  style = {},
  duration = 900,
  easing = "cubic-bezier(0.22, 1, 0.36, 1)",
  initialScale = 1.08,
  initialTranslateY = 20,
  threshold = 0.15,
  rootMargin = "0px 0px -40px 0px",
  delay = 0,
}: ImageRevealProps) {
  const { ref, containerStyle, imageStyle, reducedMotion } = useImageReveal<HTMLDivElement>({
    duration,
    easing,
    initialScale,
    initialTranslateY,
    threshold,
    rootMargin,
    delay,
  });

  if (reducedMotion) {
    return (
      <div className={`overflow-hidden ${className}`} style={style}>
        <div className={`w-full h-full ${imageClassName}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={{ ...style, ...containerStyle }}
    >
      <div className={`w-full h-full ${imageClassName}`} style={imageStyle}>
        {children}
      </div>
    </div>
  );
}

export default ImageReveal;
