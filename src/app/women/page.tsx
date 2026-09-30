import React from "react";
import { getProductsByGender } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import CategoryHero from "@/components/sections/CategoryHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Luxury Editorial Collection — PABLO",
  description:
    "Raw Form & Modern Silhouettes: sculptural column draping, oversized tailoring, and contemporary essentials for the PABLO Women's collection.",
};

export default function WomenPage() {
  const products = getProductsByGender("women");

  return (
    <CataloguePage
      gender="women"
      title="WOMEN'S COLLECTION"
      subtitle="Fluid silhouettes, architectural draping, and raw modern forms."
      products={products}
      currentDepartment="all"
      breadcrumbs={[{ label: "WOMEN", href: "/women" }]}
      heroSlot={<CategoryHero key="women-category-hero" gender="women" />}
    />
  );
}
