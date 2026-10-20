import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { ThemeProvider } from "@/context/ThemeContext";
import CartDrawer from "@/components/shop/CartDrawer";
import SearchModal from "@/components/shop/SearchModal";
import QuickShopModal from "@/components/shop/QuickShopModal";
import { RouteScrollReset } from "@/components/layout/RouteScrollReset";
import { PageTransition } from "@/components/transitions/PageTransition";

// Official Orborn Geometric Display Font by Nikola Nikolov
const orborn = localFont({
  src: [
    {
      path: "../../public/fonts/Orborn.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-orborn",
  display: "swap",
});

// Preserved for the giant Hero "PABLO" wordmark only (Requirement #2)
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hero-pablo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PABLO — Luxury Fashion",
  description: "PABLO — Distinctive luxury fashion editorial e-commerce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${orborn.variable} ${cormorantGaramond.variable} ${inter.variable} bg-[#EAE8E1]`}
      style={{ backgroundColor: "#EAE8E1" }}
    >
      <body
        suppressHydrationWarning
        className="bg-[#EAE8E1] text-[#111111]"
        style={{ backgroundColor: "#EAE8E1", color: "#111111" }}
      >
        <Script
          id="pablo-init-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{if(window.location.pathname.startsWith('/kids')){document.documentElement.setAttribute('data-theme','kids');if('scrollRestoration' in history)history.scrollRestoration='manual';var savedKidsY=sessionStorage.getItem('pablo-kids-scroll-y');if(savedKidsY){var ky=parseInt(savedKidsY,10);if(!isNaN(ky)&&ky>0){window.scrollTo(0,ky);}}}else if(window.location.pathname==='/'&&sessionStorage.getItem('pablo-intro-completed')!=='true'){if('scrollRestoration' in history)history.scrollRestoration='manual';window.scrollTo(0,0);}else{if('scrollRestoration' in history)history.scrollRestoration='auto';}}catch(e){}`,
          }}
        />
        <ThemeProvider>
          <ShopProvider>
            <RouteScrollReset />
            <PageTransition>{children}</PageTransition>
            <CartDrawer />
            <SearchModal />
            <QuickShopModal />
          </ShopProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

