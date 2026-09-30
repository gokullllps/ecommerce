import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import MenHero from "@/components/sections/MenHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Luxury Accessories & Leather Goods — PABLO",
  description: "Architectural grain leather briefcases, palladium buckle belts, Japanese titanium sunglasses, and atelier caps.",
};

export default function MenAccessoriesPage() {
  const products = getProductsByDepartment("accessories", "men");

  return (
    <CataloguePage
      gender="men"
      title="MEN'S ACCESSORIES"
      subtitle="Architectural calfskin bags, palladium buckle belts, titanium eyewear, and wool gabardine caps."
      products={products}
      currentDepartment="accessories"
      breadcrumbs={[
        { label: "MEN", href: "/men" },
        { label: "ACCESSORIES", href: "/men/accessories" },
      ]}
      heroSlot={<MenHero key="men-accessories-hero" />}
    />
  );
}
