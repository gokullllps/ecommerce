"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function RouteScrollReset() {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      // On cross-page navigation, ensure destination page renders from the top (0, 0)
      if (typeof window !== "undefined") {
        if (!pathname?.startsWith("/kids") && !window.location.hash) {
          window.scrollTo(0, 0);
        }
      }
    }
  }, [pathname]);

  return null;
}
