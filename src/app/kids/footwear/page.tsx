import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import KidsHero from "@/components/sections/KidsHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kids' Footwear — PABLO",
  description: "Explore the Kids' footwear collection: court sneakers, leather slides, and comfortable slip-ons.",
};

export default function KidsFootwearPage() {
  const products = getProductsByDepartment("footwear", "kids");

  return (
    <CataloguePage
      gender="kids"
      title="KIDS' FOOTWEAR"
      subtitle="Supple calfskin sneakers, lightweight rubber slides, and flexible artisanal construction."
      products={products}
      currentDepartment="footwear"
      breadcrumbs={[
        { label: "KIDS", href: "/kids" },
        { label: "FOOTWEAR", href: "/kids/footwear" },
      ]}
      heroSlot={<KidsHero key="kids-footwear-hero" />}
    />
  );
}
