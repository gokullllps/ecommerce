"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSiteTheme } from "@/context/ThemeContext";

interface PageWrapperProps {
  children: React.ReactNode;
  navbarProps?: {
    isStaticPage?: boolean;
    isIntroActive?: boolean;
    isHeroOverlay?: boolean;
  };
  className?: string;
  id?: string;
  forceKidsTheme?: boolean;
}

/**
 * PABLO Universal Page Wrapper for Consistent Footer Reveal
 * Automatically inherits Kids vs Normal theme from SiteTheme context.
 */
export function PageWrapper({
  children,
  navbarProps = { isStaticPage: true },
  className = "",
  id,
  forceKidsTheme,
}: PageWrapperProps) {
  const { isKids: isSiteKids } = useSiteTheme();
  const isKids = forceKidsTheme !== undefined ? forceKidsTheme : isSiteKids;

  const bgColor = isKids ? "#EBF4FA" : "#EAE8E1";
  const textColor = isKids ? "#181818" : "#111111";

  return (
    <div
      id={id}
      data-theme={isKids ? "kids" : "normal"}
      className={`pablo-page-wrapper w-full min-w-full font-sans ${isKids ? "kids-universe-wrapper" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        minHeight: "100vh",
        width: "100%",
        minWidth: "100%",
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {/* ── FOOTER: FIRST in DOM, visual bottom, z-index: 0 ── */}
      <Footer />

      {/* ── MAIN CONTENT LAYER: SECOND in DOM, visual top, z-index: 1 ── */}
      <div
        data-theme={isKids ? "kids" : "normal"}
        className={`pablo-main-layer w-full min-w-full flex flex-col min-h-screen ${className}`}
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: bgColor,
          color: textColor,
          width: "100%",
          minWidth: "100%",
          minHeight: "100vh",
        }}
      >
        {/* Continuous Kids Ambient Background Atmosphere */}
        {isKids && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: -1 }}
            aria-hidden="true"
          >
            <div
              className="absolute -top-28 -left-28 sm:-top-36 sm:-left-36 w-[620px] h-[620px] rounded-full blur-2xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at 35% 35%, rgba(254, 240, 138, 0.38) 0%, rgba(254, 240, 138, 0.16) 45%, transparent 70%)",
              }}
            />
            <div
              className="absolute top-[480px] -left-44 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at 30% 50%, rgba(254, 240, 138, 0.28) 0%, rgba(254, 240, 138, 0.10) 45%, transparent 70%)",
              }}
            />
            <div
              className="absolute top-[980px] -right-40 w-[580px] h-[580px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at 70% 50%, rgba(254, 240, 138, 0.22) 0%, rgba(254, 240, 138, 0.08) 45%, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-10 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(252, 231, 243, 0.25) 0%, rgba(252, 231, 243, 0.08) 50%, transparent 70%)",
              }}
            />
          </div>
        )}

        <Navbar {...navbarProps} />
        {children}
      </div>
    </div>
  );
}

export default PageWrapper;
