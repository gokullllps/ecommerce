import { ALL_PRODUCTS, getProductsByGender } from "@/data/products";
import { Product } from "@/types/catalogue";
import MenCatalogueGrid from "@/components/men/MenCatalogueGrid";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const MEN_VALID_CATEGORIES = [
  "shirts",
  "trousers",
  "outerwear",
  "denim",
  "t-shirts",
  "polos",
  "knitwear",
  "sweatshirts",
  "shorts",
  "bags",
];

const STATIC_FOLDERS = ["footwear", "accessories", "clothing"];

export async function generateStaticParams() {
  const menProducts = ALL_PRODUCTS.filter((p) => (p.gender || "men") === "men");
  const categoriesFromProducts = Array.from(new Set(menProducts.map((p) => p.category.toLowerCase())));
  const allCats = Array.from(new Set([...MEN_VALID_CATEGORIES, ...categoriesFromProducts]));
  return allCats
    .filter((cat) => !STATIC_FOLDERS.includes(cat))
    .map((cat) => ({ category: cat }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const formattedCategory = category.replace("-", " ").toUpperCase();
  return {
    title: `Men's ${formattedCategory} — PABLO`,
    description: `Shop luxury Men's ${category.replace("-", " ")} at Maison PABLO. Exceptional materials and contemporary architectural design.`,
  };
}

function getDepartmentForCategory(category: string): "clothing" | "footwear" | "accessories" {
  const norm = category.toLowerCase().trim();
  if (norm === "footwear" || norm === "shoes" || norm === "sneakers" || norm === "boots" || norm === "loafers") {
    return "footwear";
  }
  if (
    [
      "accessories",
      "bags",
      "wallets",
      "belts",
      "caps",
      "sunglasses",
      "jewelry",
      "socks",
      "gloves",
      "scarves",
    ].includes(norm)
  ) {
    return "accessories";
  }
  return "clothing";
}

function getMenCategoryProducts(category: string): Product[] {
  const norm = category.toLowerCase().trim();
  const allMen = getProductsByGender("men");

  return allMen.filter((p) => {
    const cat = (p.category || "").toLowerCase();
    const sub = (p.subCategory || "").toLowerCase();

    if (cat === norm || sub === norm) return true;

    // Taxonomy aliases
    if (norm === "shirts" && (cat === "shirts" || sub.includes("shirt"))) return true;
    if (norm === "trousers" && (cat === "trousers" || sub.includes("trouser"))) return true;

    return p.tags?.some((t) => t.toLowerCase() === norm);
  });
}

export default async function MenCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const department = getDepartmentForCategory(category);
  const categoryProducts = getMenCategoryProducts(category);

  return (
    <MenCatalogueGrid
      products={categoryProducts}
      currentDepartment={department}
      defaultCategory={category}
    />
  );
}
