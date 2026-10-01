import React from "react";
import { notFound, redirect } from "next/navigation";
import { ALL_PRODUCTS, getProductsByGender } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    gender: string;
    category: string;
  }>;
}

// Men has dedicated route structure under /men/[category]
const VALID_GENDERS = ["women", "kids"];

export async function generateStaticParams() {
  const params: { gender: string; category: string }[] = [];
  
  VALID_GENDERS.forEach((gender) => {
    const genderProducts = ALL_PRODUCTS.filter((p) => p.gender === gender);
    const categories = Array.from(new Set(genderProducts.map((p) => p.category)));
    categories.forEach((cat) => {
      params.push({ gender, category: cat });
    });
  });

  return params;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { gender, category } = await params;
  if (gender === "men") {
    const formattedCategory = category.replace("-", " ").toUpperCase();
    return {
      title: `Men's ${formattedCategory} — PABLO`,
      description: `Shop luxury Men's ${category.replace("-", " ")} at Maison PABLO.`,
    };
  }

  const formattedCategory = category.replace("-", " ").toUpperCase();
  const formattedGender = gender.toUpperCase();

  return {
    title: `${formattedCategory} — ${formattedGender} | PABLO`,
    description: `Shop luxury ${category} for ${gender} at Maison PABLO. Exceptional materials and contemporary architectural design.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { gender, category } = await params;

  if (gender === "men") {
    redirect(`/men/${category}`);
  }

  if (!VALID_GENDERS.includes(gender)) {
    notFound();
  }

  const genderProducts = getProductsByGender(gender as "women" | "kids");

  return (
    <CataloguePage
      gender={gender as "women" | "kids"}
      title={`${category.replace("-", " ").toUpperCase()}`}
      subtitle={`Curated ${category.replace("-", " ")} engineered with sartorial precision and timeless character.`}
      products={genderProducts}
      defaultCategory={category}
    />
  );
}
