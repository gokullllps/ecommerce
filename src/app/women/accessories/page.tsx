import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import CategoryHero from "@/components/sections/CategoryHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Luxury Accessories — PABLO",
  description: "Explore the Women's accessories collection: sculptural leather bags, cardholders, belts, and eyewear.",
};

export default function WomenAccessoriesPage() {
  const products = getProductsByDepartment("accessories", "women");

  return (
    <CataloguePage
      gender="women"
      title="WOMEN'S ACCESSORIES"
      subtitle="Architectural handbags, fine Italian leather wallets, and atelier eyewear."
      products={products}
      currentDepartment="accessories"
      breadcrumbs={[
        { label: "WOMEN", href: "/women" },
        { label: "ACCESSORIES", href: "/women/accessories" },
      ]}
      heroSlot={<CategoryHero key="women-accessories-hero" gender="women" />}
    />
  );
}
