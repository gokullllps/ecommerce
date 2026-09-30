import React from "react";
import { getProductsByGender } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import KidsHero from "@/components/sections/KidsHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kids' Luxury Wardrobe — PABLO",
  description: "Explore the PABLO Kids' collection: scaled-down heirloom outerwear, organic cotton knits, and tailored essentials.",
};

export default function KidsPage() {
  const products = getProductsByGender("kids");

  return (
    <CataloguePage
      gender="kids"
      title="KIDS' WARDROBE"
      subtitle="Scaled-down luxury outerwear, cloud-soft cashmere knits, and organic cotton essentials."
      products={products}
      currentDepartment="all"
      breadcrumbs={[{ label: "KIDS", href: "/kids" }]}
      heroSlot={<KidsHero key="kids-hero" />}
    />
  );
}
