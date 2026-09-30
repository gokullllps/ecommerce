import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import KidsHero from "@/components/sections/KidsHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kids' Accessories — PABLO",
  description: "Explore the Kids' accessories collection: wool beanies, caps, and small leather accessories.",
};

export default function KidsAccessoriesPage() {
  const products = getProductsByDepartment("accessories", "kids");

  return (
    <CataloguePage
      gender="kids"
      title="KIDS' ACCESSORIES"
      subtitle="Pure merino wool atelier beanies, organic caps, and fine accessories."
      products={products}
      currentDepartment="accessories"
      breadcrumbs={[
        { label: "KIDS", href: "/kids" },
        { label: "ACCESSORIES", href: "/kids/accessories" },
      ]}
      heroSlot={<KidsHero key="kids-accessories-hero" />}
    />
  );
}
