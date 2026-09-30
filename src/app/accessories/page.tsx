import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maison Accessories & Leather Goods — PABLO",
  description: "Explore Maison PABLO luxury accessories: architectural bags, belts, titanium eyewear, and atelier small leather goods.",
};

export default function GlobalAccessoriesPage() {
  const products = getProductsByDepartment("accessories");

  return (
    <CataloguePage
      gender="all"
      title="MAISON ACCESSORIES"
      subtitle="Bespoke leather goods, architectural belts, Japanese titanium eyewear, and fine accessories."
      products={products}
      currentDepartment="accessories"
      breadcrumbs={[{ label: "ACCESSORIES", href: "/accessories" }]}
    />
  );
}
