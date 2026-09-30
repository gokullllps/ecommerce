import React from "react";
import { notFound } from "next/navigation";
import { ALL_PRODUCTS, getProductBySlug } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return {
      title: "Product Not Found — PABLO",
    };
  }

  return {
    title: `${product.name} — PABLO`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — PABLO Luxury Fashion`,
      description: product.description.slice(0, 160),
      images: [
        {
          url: product.images[0]?.url || "",
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products from the same gender or category
  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.gender === product.gender || p.category === product.category)
  ).slice(0, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
