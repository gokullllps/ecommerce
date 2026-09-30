import React from "react";
import { getSaleProducts } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archival Sale — Up to 40% Off — PABLO",
  description: "Limited seasonal reductions on select archival silhouettes, virgin wool tailoring, and double-faced knitwear.",
};

export default function SalePage() {
  const products = getSaleProducts();

  return (
    <CataloguePage
      gender="sale"
      title="ARCHIVAL SALE"
      subtitle="Exclusive seasonal reductions of up to 40% on rare runway and signature silhouettes."
      products={products}
      isSalePage={true}
      breadcrumbs={[{ label: "SALE", href: "/sale" }]}
    />
  );
}
