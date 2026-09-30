"use client";

import React, { useCallback, useRef } from "react";

interface KidsCartFlyProps {
  /** Ref to the product image element to fly from */
  imageRef: React.RefObject<HTMLElement | null>;
  /** Image URL to show in the flying thumbnail */
  imageSrc: string;
  /** Called to trigger the actual cart add */
  onAdd: () => void;
  isKids?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Enhanced KidsCartFly:
 * On clicking Add to Bag:
 * 1. Runs the real cart operation immediately
 * 2. Spawns an arched flying product thumbnail from the card to the navbar bag icon
 * 3. Triggers the bounce and counter bump on the bag icon
 */
export function KidsCartFly({
  imageRef,
  imageSrc,
  onAdd,
  isKids,
  children,
  className,
}: KidsCartFlyProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 1. Run actual cart logic
      onAdd();

      if (!isKids) return;

      // Respect prefers-reduced-motion
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // 2. Locate target bag icon
      let bagEl = document.getElementById("kids-bag-icon");
      if (!bagEl) {
        bagEl = document.querySelector('button[aria-label*="Shopping Bag"]') as HTMLElement;
      }
      if (!bagEl) return;

      const bagRect = bagEl.getBoundingClientRect();

      // 3. Determine start position from image or button
      let startX = window.innerWidth / 2;
      let startY = window.innerHeight / 2;

      if (imageRef.current) {
        const imgRect = imageRef.current.getBoundingClientRect();
        startX = imgRect.left + imgRect.width / 2 - 30;
        startY = imgRect.top + imgRect.height / 3;
      } else if (buttonRef.current) {
        const btnRect = buttonRef.current.getBoundingClientRect();
        startX = btnRect.left + btnRect.width / 2 - 30;
        startY = btnRect.top - 40;
      }

      const targetX = bagRect.left + bagRect.width / 2 - 30;
      const targetY = bagRect.top + bagRect.height / 2 - 38;

      const deltaX = targetX - startX;
      const deltaY = targetY - startY;

      // 4. Create flying thumbnail DOM node
      const flyer = document.createElement("div");
      flyer.className = "kids-fly-to-bag";
      flyer.style.cssText = `
        position: fixed;
        width: 60px;
        height: 75px;
        left: ${startX}px;
        top: ${startY}px;
        z-index: 99999;
        pointer-events: none;
        border-radius: 12px;
        border: 2.5px solid #181818;
        box-shadow: 4px 4px 0px #181818;
        background-color: #FEF08A;
        overflow: hidden;
        --fly-x: ${deltaX}px;
        --fly-y: ${deltaY}px;
      `;

      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = "";
      img.style.cssText = "width: 100%; height: 100%; object-fit: cover; display: block;";
      flyer.appendChild(img);

      document.body.appendChild(flyer);

      // 5. Trigger bag bounce when flyer lands
      setTimeout(() => {
        bagEl.classList.remove("kids-bag-bounce");
        void bagEl.offsetWidth; // force DOM reflow
        bagEl.classList.add("kids-bag-bounce");
      }, 500);

      // 6. Clean up flyer element
      setTimeout(() => {
        flyer.remove();
      }, 700);
    },
    [onAdd, isKids, imageRef, imageSrc]
  );

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className={className}
      aria-label="Add to bag"
    >
      {children}
    </button>
  );
}

export default KidsCartFly;
