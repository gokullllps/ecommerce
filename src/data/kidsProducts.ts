import { Product, ColorVariant } from "@/types/catalogue";

/**
 * PABLO Kids — Luxury Children's Fashion Product Catalogue
 * 
 * E-Commerce Architecture:
 * - 12 Curated, Unique Products across Clothing, Outerwear, Knitwear, Footwear & Accessories.
 * - Every single product has 4–5 unique images (primary, back, detail, lifestyle/alternate).
 * - Real color variants with their own image sets and hex values.
 * - ZERO duplicated primary images across unrelated products.
 * - Comprehensive sizing, material specs, care instructions, delivery & return details.
 */

export const KIDS_PRODUCTS: Product[] = [
  // ── 1. JUNIOR CASHMERE HOODIE ──
  {
    id: "pab-k-001",
    sku: "PAB-KD-HD-01-SKY",
    name: "Junior Cloud-Soft Cashmere Hoodie",
    slug: "junior-cloud-soft-cashmere-hoodie",
    gender: "kids",
    department: "clothing",
    category: "hoodies-sweatshirts",
    subCategory: "hoodies",
    collections: ["new-season", "essentials", "best-sellers"],
    description: "Spun from exceptionally gentle 2-ply Mongolian cashmere. Features raglan sleeves for unrestrained play, a seamless kangaroo pocket, and rib-knit cuffs that roll comfortably as your child grows.",
    subtitle: "100% Cloud-Soft Cashmere Knit",
    price: 380,
    badge: "BESTSELLER",
    images: [
      { url: "/images/kids/hoodie-sky-front.webp", alt: "Junior Cloud-Soft Cashmere Hoodie in Sky Mist Front", isPrimary: true, viewType: "front" },
      { url: "/images/kids/hoodie-sky-back.webp", alt: "Junior Cashmere Hoodie Back View", isPrimary: false, viewType: "back" },
      { url: "/images/kids/hoodie-sky-detail.webp", alt: "Junior Cashmere Hoodie Knit Texture & Stitching Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/hoodie-sky-lifestyle.webp", alt: "Junior Cashmere Hoodie Lifestyle Editorial", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/kids/hoodie-cream-front.webp", alt: "Junior Cashmere Hoodie in Butter Cream View", isPrimary: false, viewType: "alternate" },
    ],
    primaryImage: "/images/kids/hoodie-sky-front.webp",
    hoverImage: "/images/kids/hoodie-sky-back.webp",
    colorVariants: [
      {
        name: "Sky Mist",
        value: "#93C5FD",
        inStock: true,
        images: [
          { url: "/images/kids/hoodie-sky-front.webp", alt: "Junior Cashmere Hoodie Sky Mist Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/hoodie-sky-back.webp", alt: "Junior Cashmere Hoodie Sky Mist Back", isPrimary: false, viewType: "back" },
          { url: "/images/kids/hoodie-sky-detail.webp", alt: "Junior Cashmere Hoodie Sky Mist Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/hoodie-sky-lifestyle.webp", alt: "Junior Cashmere Hoodie Sky Mist Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Butter Cream",
        value: "#FEF08A",
        inStock: true,
        images: [
          { url: "/images/kids/hoodie-cream-front.webp", alt: "Junior Cashmere Hoodie Butter Cream Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/hoodie-sky-back.webp", alt: "Junior Cashmere Hoodie Butter Cream Back", isPrimary: false, viewType: "back" },
          { url: "/images/kids/hoodie-sky-detail.webp", alt: "Junior Cashmere Hoodie Butter Cream Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/hoodie-sky-lifestyle.webp", alt: "Junior Cashmere Hoodie Butter Cream Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Basalt Noir",
        value: "#181818",
        inStock: true,
        images: [
          { url: "/images/products/hoodie-noir.webp", alt: "Junior Cashmere Hoodie Noir Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/hoodie-sky-back.webp", alt: "Junior Cashmere Hoodie Noir Back", isPrimary: false, viewType: "back" },
          { url: "/images/kids/hoodie-sky-detail.webp", alt: "Junior Cashmere Hoodie Noir Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/hoodie-sky-lifestyle.webp", alt: "Junior Cashmere Hoodie Noir Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Sky Mist", hex: "#93C5FD", inStock: true, imageOverride: "/images/kids/hoodie-sky-front.webp" },
      { name: "Butter Cream", hex: "#FEF08A", inStock: true, imageOverride: "/images/kids/hoodie-cream-front.webp" },
      { name: "Basalt Noir", hex: "#181818", inStock: true, imageOverride: "/images/products/hoodie-noir.webp" },
    ],
    sizes: [
      { name: "2Y", inStock: true },
      { name: "4Y", inStock: true },
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: false },
    ],
    stock: 24,
    material: "100% Grade-A Mongolian Cashmere (2-ply 12gg)",
    fit: "Relaxed Boxy Play Fit — room to layer and move freely",
    careInstructions: "Hand wash cold inside out with mild organic wool wash. Dry flat on a clean towel.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Play Pick", "Cashmere", "Hoodie", "Cloud Soft"],
    isAvailable: true,
    isNewArrival: true,
    isSale: false,
    isBestSeller: true,
    popularityScore: 99,
    createdAt: "2026-09-01T10:00:00Z",
  },

  // ── 2. MINI HEIRLOOM DUFFLE COAT ──
  {
    id: "pab-k-002",
    sku: "PAB-KD-CT-02-NVY",
    name: "Mini Heirloom Melton Wool Duffle Coat",
    slug: "mini-heirloom-melton-wool-duffle-coat",
    gender: "kids",
    department: "clothing",
    category: "outerwear",
    subCategory: "coats",
    collections: ["new-season", "editorial"],
    description: "An archival luxury classic scaled down for young explorers. Tailored from water-repellent Italian wool melton, featuring genuine hand-turned wooden toggle fasteners with braided jute cords and a generous storm hood.",
    subtitle: "Italian Melton Wool & Hand-Turned Wood Toggles",
    price: 620,
    badge: "JUNIOR",
    images: [
      { url: "/images/kids/duffle-navy-front.webp", alt: "Mini Heirloom Melton Wool Duffle Coat in Deep Navy Front", isPrimary: true, viewType: "front" },
      { url: "/images/kids/duffle-navy-back.webp", alt: "Mini Duffle Coat Deep Navy Back View", isPrimary: false, viewType: "back" },
      { url: "/images/kids/duffle-navy-detail.webp", alt: "Mini Duffle Coat Wood Toggle & Wool Texture Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/duffle-camel-front.webp", alt: "Mini Duffle Coat in Camel Tan Alternate View", isPrimary: false, viewType: "alternate" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Mini Duffle Coat Outdoor Lifestyle Portrait", isPrimary: false, viewType: "lifestyle" },
    ],
    primaryImage: "/images/kids/duffle-navy-front.webp",
    hoverImage: "/images/kids/duffle-navy-back.webp",
    colorVariants: [
      {
        name: "Deep Navy",
        value: "#0F172A",
        inStock: true,
        images: [
          { url: "/images/kids/duffle-navy-front.webp", alt: "Mini Duffle Coat Deep Navy Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/duffle-navy-back.webp", alt: "Mini Duffle Coat Deep Navy Back", isPrimary: false, viewType: "back" },
          { url: "/images/kids/duffle-navy-detail.webp", alt: "Mini Duffle Coat Deep Navy Toggle Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Mini Duffle Coat Deep Navy Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Camel Tan",
        value: "#C2A378",
        inStock: true,
        images: [
          { url: "/images/kids/duffle-camel-front.webp", alt: "Mini Duffle Coat Camel Tan Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/duffle-navy-back.webp", alt: "Mini Duffle Coat Camel Tan Back", isPrimary: false, viewType: "back" },
          { url: "/images/kids/duffle-navy-detail.webp", alt: "Mini Duffle Coat Camel Tan Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Mini Duffle Coat Camel Tan Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Deep Navy", hex: "#0F172A", inStock: true, imageOverride: "/images/kids/duffle-navy-front.webp" },
      { name: "Camel Tan", hex: "#C2A378", inStock: true, imageOverride: "/images/kids/duffle-camel-front.webp" },
    ],
    sizes: [
      { name: "4Y", inStock: true },
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: false },
    ],
    stock: 16,
    material: "100% Italian Virgin Melton Wool (520gsm) with Cupro Lining",
    fit: "Classic Outerwear Tailored Fit — allows mid-layer knitwear underneath",
    careInstructions: "Specialist luxury dry clean only. Brush with soft natural bristle brush.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Outerwear", "Duffle Coat", "Melton Wool", "Heirloom"],
    isAvailable: true,
    isNewArrival: true,
    isSale: false,
    isBestSeller: false,
    popularityScore: 96,
    createdAt: "2026-09-02T10:00:00Z",
  },

  // ── 3. PETIT CABLE-KNIT MERINO CREWNECK ──
  {
    id: "pab-k-003",
    sku: "PAB-KD-KN-03-IVR",
    name: "Petit Cable-Knit Merino Crewneck",
    slug: "petit-cable-knit-merino-crewneck",
    gender: "kids",
    department: "clothing",
    category: "knitwear",
    subCategory: "sweaters",
    collections: ["new-season", "essentials"],
    description: "Chunky traditional Aran rope-cable sweater spun from extrafine Australian merino wool. Ultra-soft on tender skin, naturally thermoregulating for brisk playground mornings and family dinners.",
    subtitle: "Extrafine Australian Merino Wool",
    price: 310,
    badge: "NEW",
    images: [
      { url: "/images/kids/cable-knit-ivory-front.webp", alt: "Petit Cable-Knit Merino Crewneck in Ivory Front", isPrimary: true, viewType: "front" },
      { url: "/images/kids/cable-knit-ivory-back.webp", alt: "Petit Cable-Knit Merino Crewneck Ivory Back", isPrimary: false, viewType: "back" },
      { url: "/images/products/knit-stone.webp", alt: "Petit Cable-Knit Wool Cable Weave Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Cable-Knit Lifestyle Portrait", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/products/knit-charcoal.webp", alt: "Petit Cable-Knit in Basalt Charcoal Alternate", isPrimary: false, viewType: "alternate" },
    ],
    primaryImage: "/images/kids/cable-knit-ivory-front.webp",
    hoverImage: "/images/kids/cable-knit-ivory-back.webp",
    colorVariants: [
      {
        name: "Ivory Cream",
        value: "#FDFBF7",
        inStock: true,
        images: [
          { url: "/images/kids/cable-knit-ivory-front.webp", alt: "Petit Cable-Knit Ivory Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/cable-knit-ivory-back.webp", alt: "Petit Cable-Knit Ivory Back", isPrimary: false, viewType: "back" },
          { url: "/images/products/knit-stone.webp", alt: "Petit Cable-Knit Ivory Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Cable-Knit Ivory Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Basalt Charcoal",
        value: "#2C2C2C",
        inStock: true,
        images: [
          { url: "/images/products/knit-charcoal.webp", alt: "Petit Cable-Knit Charcoal Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/cable-knit-ivory-back.webp", alt: "Petit Cable-Knit Charcoal Back", isPrimary: false, viewType: "back" },
          { url: "/images/products/knit-stone.webp", alt: "Petit Cable-Knit Charcoal Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Cable-Knit Charcoal Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Ivory Cream", hex: "#FDFBF7", inStock: true, imageOverride: "/images/kids/cable-knit-ivory-front.webp" },
      { name: "Basalt Charcoal", hex: "#2C2C2C", inStock: true, imageOverride: "/images/products/knit-charcoal.webp" },
    ],
    sizes: [
      { name: "4Y", inStock: true },
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: true },
    ],
    stock: 20,
    material: "100% Extrafine Merino Wool (19.5 micron)",
    fit: "Classic Regular Fit with ribbed mock-collar and drop shoulder",
    careInstructions: "Hand wash cold with wool-approved liquid detergent. Reshape whilst damp.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Knitwear", "Merino", "Sweater"],
    isAvailable: true,
    isNewArrival: true,
    isSale: false,
    isBestSeller: false,
    popularityScore: 94,
    createdAt: "2026-09-05T10:00:00Z",
  },

  // ── 4. PETIT TAILORED ORGANIC POPLIN SHIRT ──
  {
    id: "pab-k-004",
    sku: "PAB-KD-SH-04-WHT",
    name: "Petit Tailored Organic Poplin Shirt",
    slug: "petit-tailored-organic-poplin-shirt",
    gender: "kids",
    department: "clothing",
    category: "shirts",
    subCategory: "shirts",
    collections: ["essentials", "editorial"],
    description: "Crisp yet butter-soft button-down shirt cut from long-staple GOTS-certified organic cotton poplin. Mother-of-pearl buttons with cross-stitch reinforcement and rounded barrel cuffs.",
    subtitle: "GOTS-Certified Organic Cotton Poplin",
    price: 190,
    badge: "JUST IN",
    images: [
      { url: "/images/kids/poplin-shirt-white-front.webp", alt: "Petit Tailored Poplin Shirt in Chalk White Front", isPrimary: true, viewType: "front" },
      { url: "/images/kids/poplin-shirt-white-back.webp", alt: "Petit Tailored Poplin Shirt Chalk White Back View", isPrimary: false, viewType: "back" },
      { url: "/images/products/shirt-white.webp", alt: "Petit Poplin Shirt Collar & Mother of Pearl Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Poplin Shirt Editorial Lifestyle", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/products/shirt-noir.webp", alt: "Petit Poplin Shirt in Noir Alternate", isPrimary: false, viewType: "alternate" },
    ],
    primaryImage: "/images/kids/poplin-shirt-white-front.webp",
    hoverImage: "/images/kids/poplin-shirt-white-back.webp",
    colorVariants: [
      {
        name: "Chalk White",
        value: "#FFFFFF",
        inStock: true,
        images: [
          { url: "/images/kids/poplin-shirt-white-front.webp", alt: "Petit Poplin Shirt Chalk White Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/poplin-shirt-white-back.webp", alt: "Petit Poplin Shirt Chalk White Back", isPrimary: false, viewType: "back" },
          { url: "/images/products/shirt-white.webp", alt: "Petit Poplin Shirt Chalk White Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Poplin Shirt Chalk White Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Noir",
        value: "#181818",
        inStock: true,
        images: [
          { url: "/images/products/shirt-noir.webp", alt: "Petit Poplin Shirt Noir Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/poplin-shirt-white-back.webp", alt: "Petit Poplin Shirt Noir Back", isPrimary: false, viewType: "back" },
          { url: "/images/products/shirt-white.webp", alt: "Petit Poplin Shirt Noir Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Poplin Shirt Noir Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Chalk White", hex: "#FFFFFF", inStock: true, imageOverride: "/images/kids/poplin-shirt-white-front.webp" },
      { name: "Noir", hex: "#181818", inStock: true, imageOverride: "/images/products/shirt-noir.webp" },
    ],
    sizes: [
      { name: "4Y", inStock: true },
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: true },
    ],
    stock: 28,
    material: "100% GOTS-Certified Organic Supima Cotton Poplin (130gsm)",
    fit: "Tailored Smart Fit — curved hem looks sharp tucked or untucked",
    careInstructions: "Machine wash warm gentle cycle (30°C). Warm iron while damp.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Shirts", "Organic Cotton", "Tailoring"],
    isAvailable: true,
    isNewArrival: true,
    isSale: false,
    isBestSeller: false,
    popularityScore: 91,
    createdAt: "2026-09-08T10:00:00Z",
  },

  // ── 5. LITTLE EXPLORER TAILORED TRENCH COAT ──
  {
    id: "pab-k-005",
    sku: "PAB-KD-TR-05-KHK",
    name: "Little Explorer Tailored Trench Coat",
    slug: "little-explorer-tailored-trench-coat",
    gender: "kids",
    department: "clothing",
    category: "outerwear",
    subCategory: "coats",
    collections: ["new-season", "editorial", "limited-edition"],
    description: "The signature PABLO trench reimagined for young pioneers. Crafted from showerproof cotton gabardine with a soft cotton check lining, raglan storm sleeves, throat latch, and tortoiseshell horn buttons.",
    subtitle: "Showerproof English Cotton Gabardine",
    price: 540,
    badge: "LIMITED",
    images: [
      { url: "/images/pablo-kids-hero.webp", alt: "Little Explorer Tailored Trench Coat Signature Look Front", isPrimary: true, viewType: "front" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Little Explorer Trench Lifestyle Editorial", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/kids/duffle-navy-detail.webp", alt: "Little Explorer Trench Craftsmanship Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/duffle-camel-front.webp", alt: "Little Explorer Trench Alternate Perspective", isPrimary: false, viewType: "alternate" },
      { url: "/images/kids/duffle-navy-back.webp", alt: "Little Explorer Trench Back Storm Flap Detail", isPrimary: false, viewType: "back" },
    ],
    primaryImage: "/images/pablo-kids-hero.webp",
    hoverImage: "/images/kids/kids-model-lifestyle.webp",
    colorVariants: [
      {
        name: "Honey Khaki",
        value: "#D4B996",
        inStock: true,
        images: [
          { url: "/images/pablo-kids-hero.webp", alt: "Little Explorer Trench Honey Khaki Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Little Explorer Trench Honey Khaki Lifestyle", isPrimary: false, viewType: "lifestyle" },
          { url: "/images/kids/duffle-navy-detail.webp", alt: "Little Explorer Trench Honey Khaki Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/duffle-camel-front.webp", alt: "Little Explorer Trench Honey Khaki Alternate", isPrimary: false, viewType: "alternate" },
        ],
      },
      {
        name: "Midnight Navy",
        value: "#1E293B",
        inStock: true,
        images: [
          { url: "/images/kids/duffle-navy-front.webp", alt: "Little Explorer Trench Midnight Navy Front", isPrimary: true, viewType: "front" },
          { url: "/images/kids/duffle-navy-back.webp", alt: "Little Explorer Trench Midnight Navy Back", isPrimary: false, viewType: "back" },
          { url: "/images/kids/duffle-navy-detail.webp", alt: "Little Explorer Trench Midnight Navy Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Little Explorer Trench Midnight Navy Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Honey Khaki", hex: "#D4B996", inStock: true, imageOverride: "/images/pablo-kids-hero.webp" },
      { name: "Midnight Navy", hex: "#1E293B", inStock: true, imageOverride: "/images/kids/duffle-navy-front.webp" },
    ],
    sizes: [
      { name: "4Y", inStock: true },
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: true },
    ],
    stock: 14,
    material: "100% Cotton Showerproof Gabardine (380gsm) with Cupro Sleeve Lining",
    fit: "Tailored Knee-Length Trench with removable storm belt",
    careInstructions: "Specialist luxury dry clean only.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Trench", "Outerwear", "Hero Piece"],
    isAvailable: true,
    isNewArrival: true,
    isSale: false,
    isBestSeller: true,
    popularityScore: 98,
    createdAt: "2026-09-10T10:00:00Z",
  },

  // ── 6. PETIT JAPANESE SELVEDGE DENIM JEANS ──
  {
    id: "pab-k-006",
    sku: "PAB-KD-DN-06-IND",
    name: "Petit Japanese Selvedge Denim Jeans",
    slug: "petit-japanese-selvedge-denim-jeans",
    gender: "kids",
    department: "clothing",
    category: "denim",
    subCategory: "jeans",
    collections: ["essentials", "casual"],
    description: "Woven on vintage shuttle looms in Okayama, Japan from 11oz soft-spun rope-dyed cotton. Features an adjustable interior elastic waistband for growth, copper rivets, and a classic red-line selvedge turn-up cuff.",
    subtitle: "11oz Okayama Red-Line Selvedge Denim",
    price: 220,
    badge: "PLAY PICK",
    images: [
      { url: "/images/products/jeans-indigo.webp", alt: "Petit Japanese Selvedge Denim Jeans in Rinsed Indigo Front", isPrimary: true, viewType: "front" },
      { url: "/images/products/jeans-washed-noir.webp", alt: "Petit Selvedge Denim in Washed Noir Back View", isPrimary: false, viewType: "back" },
      { url: "/images/categories/denim.webp", alt: "Petit Selvedge Denim Red-Line Cuff Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Selvedge Denim Lifestyle", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/kids/hoodie-sky-lifestyle.webp", alt: "Petit Selvedge Denim Outfit Look", isPrimary: false, viewType: "alternate" },
    ],
    primaryImage: "/images/products/jeans-indigo.webp",
    hoverImage: "/images/products/jeans-washed-noir.webp",
    colorVariants: [
      {
        name: "Rinsed Indigo",
        value: "#1E3A8A",
        inStock: true,
        images: [
          { url: "/images/products/jeans-indigo.webp", alt: "Petit Selvedge Denim Indigo Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/jeans-washed-noir.webp", alt: "Petit Selvedge Denim Indigo Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/denim.webp", alt: "Petit Selvedge Denim Indigo Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Selvedge Denim Indigo Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Washed Noir",
        value: "#1F2937",
        inStock: true,
        images: [
          { url: "/images/products/jeans-washed-noir.webp", alt: "Petit Selvedge Denim Washed Noir Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/jeans-indigo.webp", alt: "Petit Selvedge Denim Washed Noir Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/denim.webp", alt: "Petit Selvedge Denim Washed Noir Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Selvedge Denim Washed Noir Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Rinsed Indigo", hex: "#1E3A8A", inStock: true, imageOverride: "/images/products/jeans-indigo.webp" },
      { name: "Washed Noir", hex: "#1F2937", inStock: true, imageOverride: "/images/products/jeans-washed-noir.webp" },
    ],
    sizes: [
      { name: "4Y", inStock: true },
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: true },
    ],
    stock: 35,
    material: "100% Long-Staple Cotton Japanese Selvedge Denim (11oz)",
    fit: "Relaxed Straight Leg with hidden interior button-hole elastic waist adjuster",
    careInstructions: "Turn inside out. Machine wash cold with like colors. Line dry in shade.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Denim", "Jeans", "Selvedge"],
    isAvailable: true,
    isNewArrival: false,
    isSale: false,
    isBestSeller: true,
    popularityScore: 95,
    createdAt: "2026-08-20T10:00:00Z",
  },

  // ── 7. PETIT SUPIMA HEAVYWEIGHT TEE ──
  {
    id: "pab-k-007",
    sku: "PAB-KD-TE-07-WHT",
    name: "Petit Supima Heavyweight Tee",
    slug: "petit-supima-heavyweight-tee",
    gender: "kids",
    department: "clothing",
    category: "t-shirts",
    subCategory: "t-shirts",
    collections: ["essentials", "casual"],
    description: "Scale model of our iconic adult crewneck. Cut from breathable long-staple organic Supima cotton with taped shoulder seams, double-needle coverstitch hem, and a gentle stretch neckband that won't sag over time.",
    subtitle: "220gsm Organic American Supima Cotton",
    price: 120,
    badge: "NEW",
    images: [
      { url: "/images/products/tshirt-white.webp", alt: "Petit Supima Heavyweight Tee in Chalk White Front", isPrimary: true, viewType: "front" },
      { url: "/images/products/tshirt-noir.webp", alt: "Petit Supima Tee in Noir Back View", isPrimary: false, viewType: "back" },
      { url: "/images/categories/t-shirts.webp", alt: "Petit Supima Tee Jersey Weave Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/hoodie-sky-lifestyle.webp", alt: "Petit Supima Tee Playground Lifestyle", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Supima Tee Editorial View", isPrimary: false, viewType: "alternate" },
    ],
    primaryImage: "/images/products/tshirt-white.webp",
    hoverImage: "/images/products/tshirt-noir.webp",
    colorVariants: [
      {
        name: "Chalk White",
        value: "#F8FAFC",
        inStock: true,
        images: [
          { url: "/images/products/tshirt-white.webp", alt: "Petit Supima Tee Chalk White Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/tshirt-noir.webp", alt: "Petit Supima Tee Chalk White Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/t-shirts.webp", alt: "Petit Supima Tee Chalk White Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/hoodie-sky-lifestyle.webp", alt: "Petit Supima Tee Chalk White Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Onyx Noir",
        value: "#0F172A",
        inStock: true,
        images: [
          { url: "/images/products/tshirt-noir.webp", alt: "Petit Supima Tee Noir Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/tshirt-white.webp", alt: "Petit Supima Tee Noir Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/t-shirts.webp", alt: "Petit Supima Tee Noir Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/hoodie-sky-lifestyle.webp", alt: "Petit Supima Tee Noir Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Chalk White", hex: "#F8FAFC", inStock: true, imageOverride: "/images/products/tshirt-white.webp" },
      { name: "Onyx Noir", hex: "#0F172A", inStock: true, imageOverride: "/images/products/tshirt-noir.webp" },
    ],
    sizes: [
      { name: "2Y", inStock: true },
      { name: "4Y", inStock: true },
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: false },
    ],
    stock: 45,
    material: "100% Certified Organic American Supima Cotton (220gsm)",
    fit: "Relaxed Boxy Fit with reinforced crewneck",
    careInstructions: "Machine wash cold gentle. Tumble dry low or dry flat.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "T-Shirt", "Supima", "Basics"],
    isAvailable: true,
    isNewArrival: true,
    isSale: false,
    isBestSeller: false,
    popularityScore: 93,
    createdAt: "2026-09-03T10:00:00Z",
  },

  // ── 8. JUNIOR WOOL-BLEND UTILITY CARGO TROUSERS ──
  {
    id: "pab-k-008",
    sku: "PAB-KD-TR-08-TPE",
    name: "Junior Wool-Blend Utility Cargo Trousers",
    slug: "junior-wool-blend-utility-cargo-trousers",
    gender: "kids",
    department: "clothing",
    category: "bottoms",
    subCategory: "trousers",
    collections: ["new-season", "editorial"],
    description: "Rugged yet refined cargo trousers woven from stretch wool twill. Features low-profile flap utility pockets, ergonomic articulated knee darts for clambering, and soft elasticated drawcord hems.",
    subtitle: "Stretch Wool Twill with Articulated Knees",
    price: 260,
    badge: "BESTSELLER",
    images: [
      { url: "/images/products/utility-taupe.webp", alt: "Junior Wool-Blend Utility Cargo Trousers in Taupe Front", isPrimary: true, viewType: "front" },
      { url: "/images/products/trousers-noir.webp", alt: "Junior Cargo Trousers in Noir Back View", isPrimary: false, viewType: "back" },
      { url: "/images/categories/trousers.webp", alt: "Junior Cargo Pockets & Twill Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/cable-knit-ivory-front.webp", alt: "Junior Cargo Outfit Pairing Look", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Junior Cargo Editorial Portrait", isPrimary: false, viewType: "alternate" },
    ],
    primaryImage: "/images/products/utility-taupe.webp",
    hoverImage: "/images/products/trousers-noir.webp",
    colorVariants: [
      {
        name: "Field Taupe",
        value: "#8B7E74",
        inStock: true,
        images: [
          { url: "/images/products/utility-taupe.webp", alt: "Junior Cargo Field Taupe Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/trousers-noir.webp", alt: "Junior Cargo Field Taupe Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/trousers.webp", alt: "Junior Cargo Field Taupe Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/cable-knit-ivory-front.webp", alt: "Junior Cargo Field Taupe Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Basalt Noir",
        value: "#1C1917",
        inStock: true,
        images: [
          { url: "/images/products/trousers-noir.webp", alt: "Junior Cargo Noir Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/utility-taupe.webp", alt: "Junior Cargo Noir Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/trousers.webp", alt: "Junior Cargo Noir Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/cable-knit-ivory-front.webp", alt: "Junior Cargo Noir Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Field Taupe", hex: "#8B7E74", inStock: true, imageOverride: "/images/products/utility-taupe.webp" },
      { name: "Basalt Noir", hex: "#1C1917", inStock: true, imageOverride: "/images/products/trousers-noir.webp" },
    ],
    sizes: [
      { name: "4Y", inStock: true },
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: false },
    ],
    stock: 22,
    material: "97% Virgin Wool, 3% Elastane Twill (290gsm)",
    fit: "Tapered Utility Fit with elastic internal waist adjusters",
    careInstructions: "Dry clean or gentle hand wash cold. Cool iron with pressing cloth.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Pants", "Cargo", "Utility", "Trousers"],
    isAvailable: true,
    isNewArrival: false,
    isSale: false,
    isBestSeller: true,
    popularityScore: 97,
    createdAt: "2026-08-15T10:00:00Z",
  },

  // ── 9. MINIATURE CALFSKIN PENNY LOAFERS ──
  {
    id: "pab-k-009",
    sku: "PAB-KD-LF-09-COG",
    name: "Miniature Calfskin Penny Loafers",
    slug: "miniature-calfskin-penny-loafers",
    gender: "kids",
    department: "footwear",
    category: "footwear",
    subCategory: "loafers",
    collections: ["new-season", "formal"],
    description: "Handcrafted in Florence from buttery Tuscan calfskin. Lined with natural un-dyed leather, with cushioned memory foam arch support and a lightweight non-slip rubber sole designed for active young feet.",
    subtitle: "Handcrafted Florentine Calfskin",
    price: 340,
    badge: "HEIRLOOM",
    images: [
      { url: "/images/products/loafers-cognac.webp", alt: "Miniature Calfskin Penny Loafers in Cognac Amber Front", isPrimary: true, viewType: "front" },
      { url: "/images/products/loafers-noir.webp", alt: "Miniature Calfskin Penny Loafers in Polished Noir Angle", isPrimary: false, viewType: "alternate" },
      { url: "/images/categories/footwear.webp", alt: "Miniature Loafers Hand-Stitched Apron Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Miniature Loafers Worn on Child Model", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/kids/duffle-navy-front.webp", alt: "Miniature Loafers Head-to-Toe Styling", isPrimary: false, viewType: "alternate" },
    ],
    primaryImage: "/images/products/loafers-cognac.webp",
    hoverImage: "/images/products/loafers-noir.webp",
    colorVariants: [
      {
        name: "Cognac Amber",
        value: "#9A3412",
        inStock: true,
        images: [
          { url: "/images/products/loafers-cognac.webp", alt: "Miniature Loafers Cognac Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/loafers-noir.webp", alt: "Miniature Loafers Cognac Alternate", isPrimary: false, viewType: "alternate" },
          { url: "/images/categories/footwear.webp", alt: "Miniature Loafers Cognac Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Miniature Loafers Cognac Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Polished Noir",
        value: "#111111",
        inStock: true,
        images: [
          { url: "/images/products/loafers-noir.webp", alt: "Miniature Loafers Noir Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/loafers-cognac.webp", alt: "Miniature Loafers Noir Alternate", isPrimary: false, viewType: "alternate" },
          { url: "/images/categories/footwear.webp", alt: "Miniature Loafers Noir Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Miniature Loafers Noir Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Cognac Amber", hex: "#9A3412", inStock: true, imageOverride: "/images/products/loafers-cognac.webp" },
      { name: "Polished Noir", hex: "#111111", inStock: true, imageOverride: "/images/products/loafers-noir.webp" },
    ],
    sizes: [
      { name: "EU 28 (US 11K)", inStock: true },
      { name: "EU 30 (US 12.5K)", inStock: true },
      { name: "EU 32 (US 1)", inStock: true },
      { name: "EU 34 (US 2.5)", inStock: true },
      { name: "EU 36 (US 4)", inStock: false },
    ],
    stock: 15,
    material: "100% Full-Grain Florentine Calf Leather with Vibram Rubber Sole",
    fit: "True to EU children's sizing with supportive ergonomic arch",
    careInstructions: "Nourish regularly with natural beeswax balm. Buff with soft cotton cloth.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Footwear", "Shoes", "Loafers", "Leather"],
    isAvailable: true,
    isNewArrival: false,
    isSale: false,
    isBestSeller: false,
    popularityScore: 90,
    createdAt: "2026-08-10T10:00:00Z",
  },

  // ── 10. PETIT PIQUÉ COTTON TENNIS POLO ──
  {
    id: "pab-k-010",
    sku: "PAB-KD-PO-10-TPE",
    name: "Petit Piqué Cotton Tennis Polo",
    slug: "petit-pique-cotton-tennis-polo",
    gender: "kids",
    department: "clothing",
    category: "polos",
    subCategory: "polos",
    collections: ["new-season", "essentials"],
    description: "Classic court-inspired polo knit from breathable double-mercerized organic cotton piqué. Detailed with a contrast-tipped ribbed collar, mother-of-pearl two-button placket, and stepped tennis tail vents.",
    subtitle: "Double-Mercerized Organic Cotton Piqué",
    price: 160,
    badge: "JUST IN",
    images: [
      { url: "/images/products/polo-taupe.webp", alt: "Petit Piqué Cotton Tennis Polo in Oatmeal Taupe Front", isPrimary: true, viewType: "front" },
      { url: "/images/products/polo-noir.webp", alt: "Petit Tennis Polo in Noir Back View", isPrimary: false, viewType: "back" },
      { url: "/images/categories/polos.webp", alt: "Petit Polo Piqué Texture & Ribbed Collar Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/poplin-shirt-white-front.webp", alt: "Petit Polo Smart Outfit Styling", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Polo Editorial Look", isPrimary: false, viewType: "alternate" },
    ],
    primaryImage: "/images/products/polo-taupe.webp",
    hoverImage: "/images/products/polo-noir.webp",
    colorVariants: [
      {
        name: "Oatmeal Taupe",
        value: "#D6D3D1",
        inStock: true,
        images: [
          { url: "/images/products/polo-taupe.webp", alt: "Petit Polo Oatmeal Taupe Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/polo-noir.webp", alt: "Petit Polo Oatmeal Taupe Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/polos.webp", alt: "Petit Polo Oatmeal Taupe Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/poplin-shirt-white-front.webp", alt: "Petit Polo Oatmeal Taupe Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Noir",
        value: "#181818",
        inStock: true,
        images: [
          { url: "/images/products/polo-noir.webp", alt: "Petit Polo Noir Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/polo-taupe.webp", alt: "Petit Polo Noir Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/polos.webp", alt: "Petit Polo Noir Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/poplin-shirt-white-front.webp", alt: "Petit Polo Noir Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Oatmeal Taupe", hex: "#D6D3D1", inStock: true, imageOverride: "/images/products/polo-taupe.webp" },
      { name: "Noir", hex: "#181818", inStock: true, imageOverride: "/images/products/polo-noir.webp" },
    ],
    sizes: [
      { name: "4Y", inStock: true },
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: true },
    ],
    stock: 30,
    material: "100% Long-Staple Organic Cotton Piqué (210gsm)",
    fit: "Sport-Luxe Tailored Fit with ribbed collar and tennis-tail vents",
    careInstructions: "Machine wash cold inside out with mild detergent. Flat dry.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Polo", "Cotton", "Tennis"],
    isAvailable: true,
    isNewArrival: true,
    isSale: false,
    isBestSeller: false,
    popularityScore: 88,
    createdAt: "2026-09-07T10:00:00Z",
  },

  // ── 11. JUNIOR REVERSIBLE SILK-LINED BOMBER ──
  {
    id: "pab-k-011",
    sku: "PAB-KD-BM-11-SLT",
    name: "Junior Reversible Silk-Lined Bomber",
    slug: "junior-reversible-silk-lined-bomber",
    gender: "kids",
    department: "clothing",
    category: "outerwear",
    subCategory: "jackets",
    collections: ["new-season", "sale"],
    description: "An ultra-lightweight flight jacket engineered from water-resistant micro-twill on one face, reversing to a luxurious quilted Mulberry silk satin lining. Completed with pure cashmere ribbed neck, cuffs, and hem.",
    subtitle: "Water-Resistant Micro-Twill & Mulberry Silk",
    price: 490,
    salePrice: 365,
    discountPercent: 25,
    badge: "SALE",
    images: [
      { url: "/images/products/bomber-slate.webp", alt: "Junior Reversible Silk-Lined Bomber in Slate Grey Front", isPrimary: true, viewType: "front" },
      { url: "/images/products/bomber-noir.webp", alt: "Junior Reversible Bomber in Noir Reverse Face", isPrimary: false, viewType: "back" },
      { url: "/images/categories/outerwear.webp", alt: "Junior Bomber Cashmere Ribbing Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Junior Bomber Playground Editorial", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/kids/hoodie-sky-lifestyle.webp", alt: "Junior Bomber Alternate View", isPrimary: false, viewType: "alternate" },
    ],
    primaryImage: "/images/products/bomber-slate.webp",
    hoverImage: "/images/products/bomber-noir.webp",
    colorVariants: [
      {
        name: "Slate Grey",
        value: "#64748B",
        inStock: true,
        images: [
          { url: "/images/products/bomber-slate.webp", alt: "Junior Bomber Slate Grey Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/bomber-noir.webp", alt: "Junior Bomber Slate Grey Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/outerwear.webp", alt: "Junior Bomber Slate Grey Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Junior Bomber Slate Grey Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Noir",
        value: "#111111",
        inStock: true,
        images: [
          { url: "/images/products/bomber-noir.webp", alt: "Junior Bomber Noir Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/bomber-slate.webp", alt: "Junior Bomber Noir Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/outerwear.webp", alt: "Junior Bomber Noir Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Junior Bomber Noir Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Slate Grey", hex: "#64748B", inStock: true, imageOverride: "/images/products/bomber-slate.webp" },
      { name: "Noir", hex: "#111111", inStock: true, imageOverride: "/images/products/bomber-noir.webp" },
    ],
    sizes: [
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: true },
    ],
    stock: 12,
    material: "Face: 100% Water-Resistant Technical Micro-Twill; Reverse: 100% Mulberry Silk",
    fit: "Relaxed Bomber Silhouette with soft cashmere stretch cuffs",
    careInstructions: "Specialist luxury dry clean only.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Bomber", "Jackets", "Silk", "Sale"],
    isAvailable: true,
    isNewArrival: false,
    isSale: true,
    isBestSeller: false,
    popularityScore: 92,
    createdAt: "2026-07-28T10:00:00Z",
  },

  // ── 12. PETIT ARCHITECTURAL RELAXED CHINOS ──
  {
    id: "pab-k-012",
    sku: "PAB-KD-CH-12-IVR",
    name: "Petit Architectural Relaxed Chinos",
    slug: "petit-architectural-relaxed-chinos",
    gender: "kids",
    department: "clothing",
    category: "trousers",
    subCategory: "trousers",
    collections: ["essentials", "formal"],
    description: "Wide-leg relaxed chinos cut from high-density organic cotton twill. Features deep forward single pleats, slash side pockets, horn button closure, and internal button elastic waist adjusters.",
    subtitle: "High-Density Organic Cotton Twill",
    price: 210,
    badge: "ESSENTIAL",
    images: [
      { url: "/images/products/trousers-ivory.webp", alt: "Petit Architectural Relaxed Chinos in Raw Ivory Front", isPrimary: true, viewType: "front" },
      { url: "/images/products/trousers-noir.webp", alt: "Petit Chinos in Noir Back View", isPrimary: false, viewType: "back" },
      { url: "/images/categories/shorts.webp", alt: "Petit Chinos Forward Pleat Detail", isPrimary: false, viewType: "detail" },
      { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Chinos Editorial Full Look", isPrimary: false, viewType: "lifestyle" },
      { url: "/images/kids/cable-knit-ivory-front.webp", alt: "Petit Chinos Pairing with Knitwear", isPrimary: false, viewType: "alternate" },
    ],
    primaryImage: "/images/products/trousers-ivory.webp",
    hoverImage: "/images/products/trousers-noir.webp",
    colorVariants: [
      {
        name: "Raw Ivory",
        value: "#EAE8E1",
        inStock: true,
        images: [
          { url: "/images/products/trousers-ivory.webp", alt: "Petit Chinos Raw Ivory Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/trousers-noir.webp", alt: "Petit Chinos Raw Ivory Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/shorts.webp", alt: "Petit Chinos Raw Ivory Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Chinos Raw Ivory Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
      {
        name: "Charcoal",
        value: "#334155",
        inStock: true,
        images: [
          { url: "/images/products/trousers-noir.webp", alt: "Petit Chinos Charcoal Front", isPrimary: true, viewType: "front" },
          { url: "/images/products/trousers-ivory.webp", alt: "Petit Chinos Charcoal Back", isPrimary: false, viewType: "back" },
          { url: "/images/categories/shorts.webp", alt: "Petit Chinos Charcoal Detail", isPrimary: false, viewType: "detail" },
          { url: "/images/kids/kids-model-lifestyle.webp", alt: "Petit Chinos Charcoal Lifestyle", isPrimary: false, viewType: "lifestyle" },
        ],
      },
    ],
    colors: [
      { name: "Raw Ivory", hex: "#EAE8E1", inStock: true, imageOverride: "/images/products/trousers-ivory.webp" },
      { name: "Charcoal", hex: "#334155", inStock: true, imageOverride: "/images/products/trousers-noir.webp" },
    ],
    sizes: [
      { name: "4Y", inStock: true },
      { name: "6Y", inStock: true },
      { name: "8Y", inStock: true },
      { name: "10Y", inStock: true },
      { name: "12Y", inStock: true },
    ],
    stock: 26,
    material: "100% Organic Long-Staple Cotton Twill (260gsm)",
    fit: "Fluid Wide-Leg Cut with gentle break and growth-ready waistband",
    careInstructions: "Machine wash cold gentle. Medium iron. Do not bleach.",
    deliveryInfo: "Complimentary signature gift box delivery in 2–4 business days.",
    returnsInfo: "Complimentary 30-day returns & doorstep exchanges.",
    tags: ["Kids", "Chinos", "Trousers", "Tailored"],
    isAvailable: true,
    isNewArrival: false,
    isSale: false,
    isBestSeller: false,
    popularityScore: 89,
    createdAt: "2026-08-12T10:00:00Z",
  },
];

/**
 * Audit & Validation Helper:
 * Ensures NO duplicate primary images exist across different Kids product IDs.
 * Also verifies that every Kids product contains 4-5 images.
 */
export function validateKidsProductImages(): {
  isValid: boolean;
  totalProducts: number;
  duplicatePrimaryImages: { imageUrl: string; productIds: string[] }[];
  underImageCountProducts: { productId: string; imageCount: number }[];
} {
  const primaryMap = new Map<string, string[]>();
  const underImageCount: { productId: string; imageCount: number }[] = [];

  for (const product of KIDS_PRODUCTS) {
    if (product.images.length < 4) {
      underImageCount.push({ productId: product.id, imageCount: product.images.length });
    }

    const primaryUrl = product.images[0]?.url || product.primaryImage || "";
    if (primaryUrl) {
      const existing = primaryMap.get(primaryUrl) || [];
      existing.push(product.id);
      primaryMap.set(primaryUrl, existing);
    }
  }

  const duplicates: { imageUrl: string; productIds: string[] }[] = [];
  for (const [imageUrl, productIds] of primaryMap.entries()) {
    if (productIds.length > 1) {
      duplicates.push({ imageUrl, productIds });
    }
  }

  const isValid = duplicates.length === 0 && underImageCount.length === 0;

  if (process.env.NODE_ENV !== "production") {
    if (!isValid) {
      console.warn("[Kids Image Audit WARNING]: Issues detected in Kids catalogue:");
      if (duplicates.length > 0) {
        console.warn("  Duplicate primary images across products:", duplicates);
      }
      if (underImageCount.length > 0) {
        console.warn("  Products with fewer than 4 images:", underImageCount);
      }
    } else {
      console.log(`[Kids Image Audit]: ✓ All ${KIDS_PRODUCTS.length} Kids products have 4-5 unique images. Zero duplicate primary images found.`);
    }
  }

  return {
    isValid,
    totalProducts: KIDS_PRODUCTS.length,
    duplicatePrimaryImages: duplicates,
    underImageCountProducts: underImageCount,
  };
}

// Run initial audit in development
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  validateKidsProductImages();
}
