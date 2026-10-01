import React from "react";
import { getProductsByDepartment } from "@/data/products";
import MenCatalogueGrid from "@/components/men/MenCatalogueGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Clothing & Tailoring — PABLO",
  description: "Explore the Men's clothing collection: double-faced cashmere coats, virgin wool trousers, poplin shirts, and knitwear.",
};

export default function MenClothingPage() {
  const products = getProductsByDepartment("clothing", "men");

  return (
    <MenCatalogueGrid
      products={products}
      currentDepartment="clothing"
      defaultCategory="clothing"
    />
  );
}
