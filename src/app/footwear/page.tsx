import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maison Footwear — PABLO",
  description: "Explore Maison PABLO luxury footwear: Blake-stitched loafers, boots, derbies, and minimalist sneakers.",
};

export default function GlobalFootwearPage() {
  const products = getProductsByDepartment("footwear");

  return (
    <CataloguePage
      gender="all"
      title="MAISON FOOTWEAR"
      subtitle="Artisanal leather craftsmanship, sculptural lasts, and Blake-stitched construction."
      products={products}
      currentDepartment="footwear"
      breadcrumbs={[{ label: "FOOTWEAR", href: "/footwear" }]}
    />
  );
}
