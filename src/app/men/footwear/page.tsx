import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import MenHero from "@/components/sections/MenHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Luxury Footwear — PABLO",
  description: "Blake-stitched calfskin loafers, monolithic leather Chelsea boots, cordovan derbies, and court sneakers.",
};

export default function MenFootwearPage() {
  const products = getProductsByDepartment("footwear", "men");

  return (
    <CataloguePage
      gender="men"
      title="MEN'S FOOTWEAR"
      subtitle="Blake-stitched Italian loafers, monolithic Chelsea boots, and minimalist court sneakers."
      products={products}
      currentDepartment="footwear"
      breadcrumbs={[
        { label: "MEN", href: "/men" },
        { label: "FOOTWEAR", href: "/men/footwear" },
      ]}
      heroSlot={<MenHero key="men-footwear-hero" />}
    />
  );
}
