import React from "react";
import { getProductsByDepartment } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import type { Metadata } from "next";

interface MenAccessoriesTypePageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: MenAccessoriesTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const formatted = type.replace("-", " ").toUpperCase();
  return {
    title: `Men's ${formatted} — PABLO`,
    description: `Shop luxury Men's ${formatted} at Maison PABLO.`,
  };
}

export default async function MenAccessoriesTypePage({ params }: MenAccessoriesTypePageProps) {
  const { type } = await params;
  const products = getProductsByDepartment("accessories", "men");

  return (
    <CataloguePage
      gender="men"
      title={`MEN'S ${type.replace("-", " ").toUpperCase()}`}
      subtitle={`Bespoke ${type.replace("-", " ")} crafted from exceptional materials and architectural finishes.`}
      products={products}
      currentDepartment="accessories"
      defaultSubtype={type}
      breadcrumbs={[
        { label: "MEN", href: "/men" },
        { label: "ACCESSORIES", href: "/men/accessories" },
        { label: type.toUpperCase(), href: `/men/accessories/${type}` },
      ]}
    />
  );
}
