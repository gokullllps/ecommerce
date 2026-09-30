import React from "react";
import { notFound } from "next/navigation";
import { ALL_PRODUCTS } from "@/data/products";
import CataloguePage from "@/components/catalogue/CataloguePageClient";
import type { Metadata } from "next";

interface CollectionPageProps {
  params: Promise<{
    collection: string;
  }>;
}

const KNOWN_COLLECTIONS = [
  "new-season",
  "essentials",
  "editorial",
  "limited-edition",
  "formal",
  "evening",
  "casual",
  "sale",
  "new-in",
  "best-sellers",
];

export async function generateStaticParams() {
  return KNOWN_COLLECTIONS.map((c) => ({ collection: c }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection } = await params;
  const title = collection.replace("-", " ").toUpperCase();
  return {
    title: `${title} Collection — PABLO`,
    description: `Discover the ${title} collection from Maison PABLO. Modern luxury fashion and timeless design.`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params;

  const collectionProducts = ALL_PRODUCTS.filter((p) =>
    p.collections?.includes(collection as any)
  );

  const formattedTitle = collection.replace("-", " ").toUpperCase();

  return (
    <CataloguePage
      gender="all"
      title={`${formattedTitle} EDIT`}
      subtitle={`Curated pieces from the Maison PABLO ${formattedTitle.toLowerCase()} collection.`}
      products={collectionProducts}
      collectionSlug={collection}
      breadcrumbs={[
        { label: "COLLECTIONS", href: "/" },
        { label: formattedTitle, href: `/collections/${collection}` },
      ]}
    />
  );
}
