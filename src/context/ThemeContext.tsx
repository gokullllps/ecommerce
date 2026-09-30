"use client";

import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type SiteTheme = "normal" | "kids";

interface ThemeContextType {
  theme: SiteTheme;
  isKids: boolean;
  setOverrideTheme: (theme: SiteTheme | null) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "normal",
  isKids: false,
  setOverrideTheme: () => {},
});

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: SiteTheme;
}) {
  const pathname = usePathname();
  const [overrideTheme, setOverrideTheme] = useState<SiteTheme | null>(initialTheme || null);

  const isKids = useMemo(() => {
    if (overrideTheme) return overrideTheme === "kids";
    if (!pathname) return false;
    if (pathname === "/kids" || pathname.startsWith("/kids/")) return true;
    return false;
  }, [pathname, overrideTheme]);

  const theme: SiteTheme = isKids ? "kids" : "normal";

  // Synchronize <html> and <body> attributes and background color dynamically
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isKids) {
      document.documentElement.setAttribute("data-theme", "kids");
      document.body.setAttribute("data-theme", "kids");
      document.documentElement.style.backgroundColor = "#EBF4FA";
      document.body.style.backgroundColor = "#EBF4FA";
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.removeAttribute("data-theme");
      document.documentElement.style.backgroundColor = "#EAE8E1";
      document.body.style.backgroundColor = "#EAE8E1";
    }
  }, [isKids]);

  const value = useMemo(
    () => ({
      theme,
      isKids,
      setOverrideTheme,
    }),
    [theme, isKids]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useSiteTheme(): ThemeContextType {
  return useContext(ThemeContext);
}

export default ThemeProvider;
