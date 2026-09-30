import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import KidsHero from "@/components/sections/KidsHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kids' Clothing — PABLO",
  description: "Explore the Kids' collection: organic cotton t-shirts, fleece sweatshirts, and comfortable tailoring.",
};

export default function KidsClothingPage() {
  const products = getProductsByDepartment("clothing", "kids");

  return (
    <CataloguePage
      gender="kids"
      title="KIDS' CLOTHING"
      subtitle="Pure organic cotton jersey, soft cashmere-blend knitwear, and timeless relaxed silhouettes."
      products={products}
      currentDepartment="clothing"
      breadcrumbs={[
        { label: "KIDS", href: "/kids" },
        { label: "CLOTHING", href: "/kids/clothing" },
      ]}
      heroSlot={<KidsHero key="kids-clothing-hero" />}
    />
  );
}
