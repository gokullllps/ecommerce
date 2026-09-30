import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { ThemeProvider } from "@/context/ThemeContext";
import CartDrawer from "@/components/shop/CartDrawer";
import SearchModal from "@/components/shop/SearchModal";
import QuickShopModal from "@/components/shop/QuickShopModal";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
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
      className={`${cormorantGaramond.variable} ${inter.variable} bg-[#EAE8E1]`}
      style={{ backgroundColor: "#EAE8E1" }}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(window.location.pathname.startsWith('/kids')){document.documentElement.setAttribute('data-theme','kids');if('scrollRestoration' in history)history.scrollRestoration='manual';var savedKidsY=sessionStorage.getItem('pablo-kids-scroll-y');if(savedKidsY){var ky=parseInt(savedKidsY,10);if(!isNaN(ky)&&ky>0){window.scrollTo(0,ky);}}}else if(window.location.pathname==='/'&&sessionStorage.getItem('pablo-intro-completed')!=='true'){if('scrollRestoration' in history)history.scrollRestoration='manual';window.scrollTo(0,0);}else{if('scrollRestoration' in history)history.scrollRestoration='auto';}}catch(e){}`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#EAE8E1] text-[#111111]"
        style={{ backgroundColor: "#EAE8E1", color: "#111111" }}
      >
        <ThemeProvider>
          <ShopProvider>
            {children}
            <CartDrawer />
            <SearchModal />
            <QuickShopModal />
          </ShopProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

