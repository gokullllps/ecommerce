"use client";

import React, { useEffect } from "react";

export default function KidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure the page root & body background dynamically switch to Kids theme canvas (#EBF4FA)
  // and revert back to standard PABLO (#EAE8E1) on leaving Kids routes.
  useEffect(() => {
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    const prevBodyBg = document.body.style.backgroundColor;

    document.documentElement.style.backgroundColor = "#EBF4FA";
    document.body.style.backgroundColor = "#EBF4FA";

    return () => {
      document.documentElement.style.backgroundColor = prevHtmlBg || "#EAE8E1";
      document.body.style.backgroundColor = prevBodyBg || "#EAE8E1";
    };
  }, []);

  return (
    <div
      className="kids-universe-wrapper w-full min-h-screen text-[#181818] relative"
      style={{
        backgroundColor: "#EBF4FA",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
