import { Category, Collection, Product } from "@/types/catalogue";

export const MEN_CATEGORIES: Category[] = [
  {
    id: "new-in",
    name: "New In",
    slug: "new-in",
    description: "The latest sartorial additions, seasonal arrivals, and architectural silhouettes.",
    subcategories: [],
  },
  {
    id: "t-shirts",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Crafted from heavy-gauge organic Supima cotton with precision necklines.",
    subcategories: [
      { id: "regular-fit", name: "Regular Fit", slug: "regular-fit" },
      { id: "oversized", name: "Oversized", slug: "oversized" },
      { id: "full-sleeve", name: "Full Sleeve", slug: "full-sleeve" },
      { id: "graphic", name: "Graphic", slug: "graphic" },
    ],
  },
  {
    id: "shirts",
    name: "Shirts",
    slug: "shirts",
    description: "Italian shirting tailored with crisp collars, concealed plackets, and natural drape.",
    subcategories: [
      { id: "casual-shirts", name: "Casual Shirts", slug: "casual-shirts" },
      { id: "oversized-shirts", name: "Oversized Shirts", slug: "oversized-shirts" },
      { id: "linen-shirts", name: "Linen Shirts", slug: "linen-shirts" },
      { id: "textured-shirts", name: "Textured Shirts", slug: "textured-shirts" },
      { id: "checks-stripes", name: "Checks & Stripes", slug: "checks-stripes" },
      { id: "overshirts", name: "Overshirts", slug: "overshirts" },
    ],
  },
  {
    id: "polos",
    name: "Polos",
    slug: "polos",
    description: "Fine-gauge knit and piqué polos designed for effortless modern elegance.",
    subcategories: [
      { id: "classic-polos", name: "Classic Polos", slug: "classic-polos" },
      { id: "oversized-polos", name: "Oversized Polos", slug: "oversized-polos" },
      { id: "full-sleeve-polos", name: "Full Sleeve Polos", slug: "full-sleeve-polos" },
    ],
  },
  {
    id: "trousers",
    name: "Trousers",
    slug: "trousers",
    description: "Architectural tailoring cut from Italian virgin wool and crisp gabardine.",
    subcategories: [
      { id: "tailored-trousers", name: "Tailored Trousers", slug: "tailored-trousers" },
      { id: "relaxed-trousers", name: "Relaxed Trousers", slug: "relaxed-trousers" },
      { id: "wide-leg", name: "Wide Leg", slug: "wide-leg" },
      { id: "formal-trousers", name: "Formal Trousers", slug: "formal-trousers" },
    ],
  },
  {
    id: "jeans",
    name: "Jeans",
    slug: "jeans",
    description: "Raw Japanese selvedge denim and garment-dyed sculptural washes.",
    subcategories: [
      { id: "straight-fit", name: "Straight Fit", slug: "straight-fit" },
      { id: "slim-fit", name: "Slim Fit", slug: "slim-fit" },
      { id: "relaxed-fit", name: "Relaxed Fit", slug: "relaxed-fit" },
      { id: "baggy-fit", name: "Baggy Fit", slug: "baggy-fit" },
      { id: "wide-leg-jeans", name: "Wide Leg", slug: "wide-leg-jeans" },
    ],
  },
  {
    id: "cargo-utility",
    name: "Cargo & Utility",
    slug: "cargo-utility",
    description: "Minimalist utility garments engineered with concealed pockets and matte hardware.",
    subcategories: [
      { id: "cargo-pants", name: "Cargo Pants", slug: "cargo-pants" },
      { id: "utility-pants", name: "Utility Pants", slug: "utility-pants" },
      { id: "cargo-shorts", name: "Cargo Shorts", slug: "cargo-shorts" },
    ],
  },
  {
    id: "shorts",
    name: "Shorts",
    slug: "shorts",
    description: "Tailored bermudas and relaxed warm-weather silhouettes.",
    subcategories: [
      { id: "casual-shorts", name: "Casual Shorts", slug: "casual-shorts" },
      { id: "tailored-shorts", name: "Tailored Shorts", slug: "tailored-shorts" },
      { id: "relaxed-shorts", name: "Relaxed Shorts", slug: "relaxed-shorts" },
    ],
  },
  {
    id: "knitwear",
    name: "Knitwear",
    slug: "knitwear",
    description: "Pure Mongolian cashmere, extrafine merino wool, and sculptural ribbed knits.",
    subcategories: [
      { id: "sweaters", name: "Sweaters", slug: "sweaters" },
      { id: "cardigans", name: "Cardigans", slug: "cardigans" },
      { id: "knit-polos", name: "Knit Polos", slug: "knit-polos" },
    ],
  },
  {
    id: "outerwear",
    name: "Outerwear",
    slug: "outerwear",
    description: "Statuesque coats, architectural trenches, and structured overshirts.",
    subcategories: [
      { id: "jackets", name: "Jackets", slug: "jackets" },
      { id: "overshirts-outerwear", name: "Overshirts", slug: "overshirts-outerwear" },
      { id: "coats", name: "Coats", slug: "coats" },
      { id: "bomber-jackets", name: "Bomber Jackets", slug: "bomber-jackets" },
    ],
  },
  {
    id: "hoodies-sweatshirts",
    name: "Hoodies & Sweatshirts",
    slug: "hoodies-sweatshirts",
    description: "Elevated heavyweight loopback fleece with seamless ribbing and drop shoulders.",
    subcategories: [],
  },
  {
    id: "activewear",
    name: "Activewear",
    slug: "activewear",
    description: "Performance silhouettes crafted from breathable Italian technical fibers.",
    subcategories: [],
  },
  {
    id: "footwear",
    name: "Footwear",
    slug: "footwear",
    description: "Handcrafted Italian footwear made with Blake-stitched calfskin and sculpted soles.",
    subcategories: [
      { id: "sneakers", name: "Sneakers", slug: "sneakers" },
      { id: "loafers", name: "Loafers", slug: "loafers" },
      { id: "boots", name: "Boots", slug: "boots" },
      { id: "slides", name: "Slides", slug: "slides" },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Artisanal leather goods, sculpted eyewear, and understated luxury essentials.",
    subcategories: [
      { id: "bags", name: "Bags", slug: "bags" },
      { id: "wallets", name: "Wallets", slug: "wallets" },
      { id: "belts", name: "Belts", slug: "belts" },
      { id: "caps", name: "Caps", slug: "caps" },
      { id: "sunglasses", name: "Sunglasses", slug: "sunglasses" },
      { id: "socks", name: "Socks", slug: "socks" },
      { id: "other-accessories", name: "Other Accessories", slug: "other-accessories" },
    ],
  },
];

export const PABLO_COLLECTIONS: Collection[] = [
  {
    id: "new-season",
    name: "New Season",
    slug: "new-season",
    description: "Autumn / Winter 2026 curated runway arrivals and seasonal centerpieces.",
  },
  {
    id: "new-in",
    name: "New In",
    slug: "new-in",
    description: "Freshly unveiled drops and weekly editorial debuts.",
  },
  {
    id: "best-sellers",
    name: "Best Sellers",
    slug: "best-sellers",
    description: "The most sought-after PABLO classics and permanent brand staples.",
  },
  {
    id: "essentials",
    name: "Essentials",
    slug: "essentials",
    description: "Foundational wardrobe pieces engineered with enduring luxury.",
  },
  {
    id: "editorial",
    name: "Editorial",
    slug: "editorial",
    description: "Avant-garde statement pieces directly from our seasonal campaign showcase.",
  },
  {
    id: "limited-edition",
    name: "Limited Edition",
    slug: "limited-edition",
    description: "Hand-numbered garments produced in strictly limited runs of 50 pieces.",
  },
  {
    id: "evening",
    name: "Evening",
    slug: "evening",
    description: "Sharp nocturnal tailoring, silk accents, and formal architectural silhouettes.",
  },
  {
    id: "casual",
    name: "Casual",
    slug: "casual",
    description: "Relaxed proportions and fluid materials designed for modern ease.",
  },
  {
    id: "formal",
    name: "Formal",
    slug: "formal",
    description: "Sartorial precision tailored from heritage Italian mills.",
  },
  {
    id: "sale",
    name: "Sale",
    slug: "sale",
    description: "Archival pieces and seasonal reductions available for a limited time.",
  },
];

import productsJson from "./products.json";

export const MEN_PRODUCTS: Product[] = (productsJson as unknown as Product[]).filter(
  (p) => (p.gender || "men") === "men"
);
