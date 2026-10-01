import React from "react";
import { getProductsByDepartment } from "@/data/products";
import MenCatalogueGrid from "@/components/men/MenCatalogueGrid";
import type { Metadata } from "next";

interface MenFootwearTypePageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: MenFootwearTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const formatted = type.replace("-", " ").toUpperCase();
  return {
    title: `Men's ${formatted} — PABLO`,
    description: `Shop luxury Men's ${formatted} at Maison PABLO.`,
  };
}

export default async function MenFootwearTypePage({ params }: MenFootwearTypePageProps) {
  const { type } = await params;
  const products = getProductsByDepartment("footwear", "men");

  return (
    <MenCatalogueGrid
      products={products}
      currentDepartment="footwear"
      defaultSubtype={type}
      title={`MEN'S ${type.replace("-", " ").toUpperCase()}`}
      subtitle={`Artisanal ${type.replace("-", " ")} engineered with sculptural lasts and premium Italian leathers.`}
      breadcrumbs={[
        { label: "MEN", href: "/men" },
        { label: "FOOTWEAR", href: "/men/footwear" },
        { label: type.toUpperCase(), href: `/men/footwear/${type}` },
      ]}
    />
  );
}
