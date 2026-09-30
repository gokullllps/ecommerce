import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import CategoryHero from "@/components/sections/CategoryHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Clothing & Tailoring — PABLO",
  description: "Explore the Women's clothing collection: sculptural column dresses, fluid silk tops, virgin wool trousers, and cashmere coats.",
};

export default function WomenClothingPage() {
  const products = getProductsByDepartment("clothing", "women");

  return (
    <CataloguePage
      gender="women"
      title="WOMEN'S CLOTHING"
      subtitle="Sculptural column dresses, fluid mulberry silk tops, virgin wool trousers, and double-face coats."
      products={products}
      currentDepartment="clothing"
      breadcrumbs={[
        { label: "WOMEN", href: "/women" },
        { label: "CLOTHING", href: "/women/clothing" },
      ]}
      heroSlot={<CategoryHero key="women-clothing-hero" gender="women" />}
    />
  );
}
