import React from "react";
import { getProductsByDepartment } from "@/data/products";
import MenPageTemplate from "@/components/men/MenPageTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Luxury Accessories & Leather Goods — PABLO",
  description: "Architectural grain leather briefcases, palladium buckle belts, Japanese titanium sunglasses, and atelier caps.",
};

export default function MenAccessoriesPage() {
  const products = getProductsByDepartment("accessories", "men");

  return (
    <MenPageTemplate
      products={products}
      currentDepartment="accessories"
      defaultCategory="accessories"
      showHeroAndCategories={true}
    />
  );
}
