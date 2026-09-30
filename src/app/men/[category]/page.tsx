import React from "react";
import { getProductsByGender } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `Men's ${category.replace("-", " ").toUpperCase()} — PABLO`,
    description: `Shop luxury Men's ${category} at Maison PABLO. Exceptional materials and contemporary architectural design.`,
  };
}

export default async function MenCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const menProducts = getProductsByGender("men");

  return (
    <CataloguePage
      gender="men"
      title={`MEN'S ${category.replace("-", " ").toUpperCase()}`}
      subtitle={`Curated ${category.replace("-", " ")} engineered with sartorial precision and timeless character.`}
      products={menProducts}
      defaultCategory={category}
    />
  );
}
