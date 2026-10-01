import React from "react";
import { getProductsByDepartment } from "@/data/products";
import MenCatalogueGrid from "@/components/men/MenCatalogueGrid";
import type { Metadata } from "next";

interface MenClothingTypePageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: MenClothingTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const formatted = type.replace("-", " ").toUpperCase();
  return {
    title: `Men's ${formatted} — PABLO`,
    description: `Shop luxury Men's ${formatted} at Maison PABLO.`,
  };
}

export default async function MenClothingTypePage({ params }: MenClothingTypePageProps) {
  const { type } = await params;
  const products = getProductsByDepartment("clothing", "men");

  return (
    <MenCatalogueGrid
      products={products}
      currentDepartment="clothing"
      defaultSubtype={type}
      title={`MEN'S ${type.replace("-", " ").toUpperCase()}`}
      subtitle={`Architectural ${type.replace("-", " ")} engineered with sartorial precision and timeless character.`}
      breadcrumbs={[
        { label: "MEN", href: "/men" },
        { label: "CLOTHING", href: "/men/clothing" },
        { label: type.toUpperCase(), href: `/men/clothing/${type}` },
      ]}
    />
  );
}
