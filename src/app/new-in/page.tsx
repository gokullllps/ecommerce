import React from "react";
import { getNewArrivals } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New In Season — Autumn / Winter 2026 — PABLO",
  description: "Explore the latest arrivals from Maison PABLO. Architectural silhouettes, pure virgin wool tailoring, and sculptural footwear.",
};

export default function NewInPage() {
  const products = getNewArrivals();

  return (
    <CataloguePage
      gender="new-in"
      title="NEW IN SEASON"
      subtitle="Autumn / Winter 2026. Architectural tailoring, pure cashmere knitwear, and sculptural artisanal leather."
      products={products}
      isNewInPage={true}
      breadcrumbs={[{ label: "NEW IN", href: "/new-in" }]}
    />
  );
}
