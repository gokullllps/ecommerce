import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import MenHero from "@/components/sections/MenHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Clothing & Tailoring — PABLO",
  description: "Explore the Men's clothing collection: double-faced cashmere coats, virgin wool trousers, poplin shirts, and knitwear.",
};

export default function MenClothingPage() {
  const products = getProductsByDepartment("clothing", "men");

  return (
    <CataloguePage
      gender="men"
      title="MEN'S CLOTHING"
      subtitle="Double-faced cashmere outerwear, virgin wool trousers, silk overshirts, and architectural knitwear."
      products={products}
      currentDepartment="clothing"
      breadcrumbs={[
        { label: "MEN", href: "/men" },
        { label: "CLOTHING", href: "/men/clothing" },
      ]}
      heroSlot={<MenHero key="men-clothing-hero" />}
    />
  );
}
