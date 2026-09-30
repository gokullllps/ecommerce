import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import CategoryHero from "@/components/sections/CategoryHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Footwear — PABLO",
  description: "Explore the Women's footwear collection: artisanal leather boots, minimalist slides, and elegant evening pumps.",
};

export default function WomenFootwearPage() {
  const products = getProductsByDepartment("footwear", "women");

  return (
    <CataloguePage
      gender="women"
      title="WOMEN'S FOOTWEAR"
      subtitle="Italian leather craftsmanship, sculptural lasts, and minimalist silhouette construction."
      products={products}
      currentDepartment="footwear"
      breadcrumbs={[
        { label: "WOMEN", href: "/women" },
        { label: "FOOTWEAR", href: "/women/footwear" },
      ]}
      heroSlot={<CategoryHero key="women-footwear-hero" gender="women" />}
    />
  );
}
