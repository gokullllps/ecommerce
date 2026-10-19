export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  indexNumber: string;
}

export const MEN_CATEGORIES_DATA: CategoryCardData[] = [
  // ROW 1: T-SHIRTS | SHIRTS | POLOS
  {
    id: "t-shirts",
    name: "T-SHIRTS",
    slug: "t-shirts",
    href: "/men?category=t-shirts",
    imageSrc: "/images/categories/card-tshirts.webp",
    imageAlt: "PABLO Men's Heavyweight Supima T-Shirts",
    indexNumber: "01",
  },
  {
    id: "shirts",
    name: "SHIRTS",
    slug: "shirts",
    href: "/men?category=shirts",
    imageSrc: "/images/categories/card-shirts.webp",
    imageAlt: "PABLO Men's Tailored Italian Shirts",
    indexNumber: "02",
  },
  {
    id: "polos",
    name: "POLOS",
    slug: "polos",
    href: "/men?category=polos",
    imageSrc: "/images/categories/card-polos.webp",
    imageAlt: "PABLO Men's Fine-Gauge Knit & Piqué Polos",
    indexNumber: "03",
  },

  // ROW 2: TROUSERS | DENIM | OUTERWEAR
  {
    id: "trousers",
    name: "TROUSERS",
    slug: "trousers",
    href: "/men?category=trousers",
    imageSrc: "/images/categories/card-trousers.webp",
    imageAlt: "PABLO Men's Architectural Wool Trousers",
    indexNumber: "04",
  },
  {
    id: "denim",
    name: "DENIM",
    slug: "denim",
    href: "/men?category=denim",
    imageSrc: "/images/categories/card-denim.webp",
    imageAlt: "PABLO Men's Japanese Selvedge Denim",
    indexNumber: "05",
  },
  {
    id: "outerwear",
    name: "OUTERWEAR",
    slug: "outerwear",
    href: "/men?category=outerwear",
    imageSrc: "/images/categories/card-outerwear.webp",
    imageAlt: "PABLO Men's Sculptural Overcoats and Outerwear",
    indexNumber: "06",
  },

  // ROW 3: KNITWEAR | SWEATSHIRTS | SHORTS
  {
    id: "knitwear",
    name: "KNITWEAR",
    slug: "knitwear",
    href: "/men?category=knitwear",
    imageSrc: "/images/categories/card-knitwear.webp",
    imageAlt: "PABLO Men's Cashmere & Merino Knitwear",
    indexNumber: "07",
  },
  {
    id: "sweatshirts",
    name: "SWEATSHIRTS",
    slug: "sweatshirts",
    href: "/men?category=sweatshirts",
    imageSrc: "/images/categories/card-sweatshirts.webp",
    imageAlt: "PABLO Men's Heavyweight Cotton Sweatshirts",
    indexNumber: "08",
  },
  {
    id: "shorts",
    name: "SHORTS",
    slug: "shorts",
    href: "/men?category=shorts",
    imageSrc: "/images/categories/card-shorts.webp",
    imageAlt: "PABLO Men's Tailored Relaxed Shorts",
    indexNumber: "09",
  },

  // ROW 4: FOOTWEAR | BAGS | ACCESSORIES
  {
    id: "footwear",
    name: "FOOTWEAR",
    slug: "footwear",
    href: "/men?category=footwear",
    imageSrc: "/images/categories/card-footwear.webp",
    imageAlt: "PABLO Men's Handcrafted Leather Footwear",
    indexNumber: "10",
  },
  {
    id: "bags",
    name: "BAGS",
    slug: "bags",
    href: "/men?category=bags",
    imageSrc: "/images/categories/card-bags.webp",
    imageAlt: "PABLO Men's Architectural Leather Bags & Luggage",
    indexNumber: "11",
  },
  {
    id: "accessories",
    name: "ACCESSORIES",
    slug: "accessories",
    href: "/men?category=accessories",
    imageSrc: "/images/categories/card-accessories.webp",
    imageAlt: "PABLO Men's Sartorial Accessories & Atelier Jewelry",
    indexNumber: "12",
  },
];

export interface MenEditorialCategory {
  id: string;
  label: string;
  route: string;
  category: string;
  image: string;
  alt: string;
  objectPosition: string;
}

export const MEN_EDITORIAL_CATEGORIES: MenEditorialCategory[] = [
  {
    id: "shirts",
    label: "SHIRTS",
    route: "/men?category=shirts",
    category: "shirts",
    image: "/images/categories/men-category-shirts.webp",
    alt: "Men's Black Graphic Heavyweight Shirt",
    objectPosition: "center 10%",
  },
  {
    id: "trousers",
    label: "TROUSERS",
    route: "/men?category=trousers",
    category: "trousers",
    image: "/images/categories/men-category-trousers.webp",
    alt: "Men's Black Cargo Trousers with Chains",
    objectPosition: "center center",
  },
  {
    id: "outerwear",
    label: "OUTERWEAR",
    route: "/men?category=outerwear",
    category: "outerwear",
    image: "/images/categories/card-outerwear.webp",
    alt: "Men's Luxury Outerwear and Tailored Overcoats",
    objectPosition: "center center",
  },
  {
    id: "footwear",
    label: "FOOTWEAR",
    route: "/men?category=footwear",
    category: "footwear",
    image: "/images/categories/men-category-footwear.webp",
    alt: "Black and White High-Top Leather Sneakers",
    objectPosition: "center 50%",
  },
  {
    id: "accessories",
    label: "ACCESSORIES",
    route: "/men?category=accessories",
    category: "accessories",
    image: "/images/categories/men-category-accessories.webp",
    alt: "Luxury Sunglasses, Chronograph Watch, Wallet, and Silver Jewelry",
    objectPosition: "center center",
  },
];

