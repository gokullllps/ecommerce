import React from "react";
import { getProductsByDepartment } from "@/data/products";
import MenCatalogueGrid from "@/components/men/MenCatalogueGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Luxury Accessories & Leather Goods — PABLO",
  description: "Architectural grain leather briefcases, palladium buckle belts, Japanese titanium sunglasses, and atelier caps.",
};

export default function MenAccessoriesPage() {
  const products = getProductsByDepartment("accessories", "men");

  return (
    <MenCatalogueGrid
      products={products}
      currentDepartment="accessories"
      defaultCategory="accessories"
    />
  );
}
