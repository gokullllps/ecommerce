"use client";

import React from "react";
import { useRevealOnScroll, RevealOptions } from "@/lib/animation/useRevealOnScroll";

export interface EditorialImageRevealProps extends RevealOptions {
  children: React.ReactNode;
  className?: string;
  imageWrapperClassName?: string;
  style?: React.CSSProperties;
  duration?: number;
  delay?: number;
  initialScale?: number;
  initialTranslateY?: number;
  initialClipInset?: string;
}

/**
 * EditorialImageReveal component.
 * Exact cinematic unmasking sequence from the art-direction reference:
 * - clip-path: inset(8% 0 8% 0) -> inset(0)
 * - transform: translateY(50px) -> translateY(0)
 * - image: scale(1.06) -> scale(1)
 * - opacity: 0 -> 1
 * - easing: cubic-bezier(0.22, 1, 0.36, 1)
 * - duration: 800-1100ms
 */
export function EditorialImageReveal({
  children,
  className = "",
  imageWrapperClassName = "",
  style = {},
  duration = 950,
  delay = 0,
  initialScale = 1.06,
  initialTranslateY = 50,
  initialClipInset = "8% 0% 8% 0%",
  threshold = 0.15,
  rootMargin = "0px 0px -40px 0px",
  once = true,
}: EditorialImageRevealProps) {
  const { ref, isVisible, reducedMotion } = useRevealOnScroll<HTMLDivElement>({
    threshold,
    rootMargin,
    delay,
    once,
  });

  if (reducedMotion) {
    return (
      <div className={`overflow-hidden ${className}`} style={style}>
        <div className={`w-full h-full ${imageWrapperClassName}`}>
          {children}
        </div>
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translate3d(0, 0, 0)"
      : `translate3d(0, ${initialTranslateY}px, 0)`,
    clipPath: isVisible
      ? "inset(0% 0% 0% 0%)"
      : `inset(${initialClipInset})`,
    transition: `opacity ${duration * 0.85}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), clip-path ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    willChange: isVisible ? "auto" : "transform, clip-path, opacity",
  };

  const imageTransformStyle: React.CSSProperties = {
    transform: isVisible
      ? "scale(1)"
      : `scale(${initialScale})`,
    transition: `transform ${duration * 1.15}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    willChange: isVisible ? "auto" : "transform",
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} style={containerStyle}>
      <div className={`w-full h-full ${imageWrapperClassName}`} style={imageTransformStyle}>
        {children}
      </div>
    </div>
  );
}

export default EditorialImageReveal;
