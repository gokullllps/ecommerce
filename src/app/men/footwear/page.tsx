import React from "react";
import { getProductsByDepartment } from "@/data/products";
import MenCatalogueGrid from "@/components/men/MenCatalogueGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Luxury Footwear — PABLO",
  description: "Blake-stitched calfskin loafers, monolithic leather Chelsea boots, cordovan derbies, and court sneakers.",
};

export default function MenFootwearPage() {
  const products = getProductsByDepartment("footwear", "men");

  return (
    <MenCatalogueGrid
      products={products}
      currentDepartment="footwear"
      defaultCategory="footwear"
    />
  );
}
