import React from "react";
import { getProductsByGender } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import MenHero from "@/components/sections/MenHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Luxury Editorial Collection — PABLO",
  description:
    "The Modern Man: architectural menswear, Italian tailoring, industrial accents, and street-luxury essentials.",
};

export default function MenPage() {
  const products = getProductsByGender("men");

  return (
    <CataloguePage
      gender="men"
      title="MEN'S COLLECTION"
      subtitle="Architectural silhouettes, Italian tailoring, and refined street-luxury essentials."
      products={products}
      currentDepartment="all"
      breadcrumbs={[{ label: "MEN", href: "/men" }]}
      heroSlot={<MenHero key="men-hero" />}
    />
  );
}
