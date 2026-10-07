import React from "react";
import { getProductsByGender } from "@/data/products";
import MenPageTemplate from "@/components/men/MenPageTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Luxury Editorial Collection — PABLO",
  description:
    "The Modern Man: architectural menswear, Italian tailoring, industrial accents, and street-luxury essentials.",
};

export default function MenPage() {
  const products = getProductsByGender("men");

  return (
    <MenPageTemplate
      products={products}
      currentDepartment="all"
      showHeroAndCategories={true}
    />
  );
}
