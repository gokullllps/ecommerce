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
    href: "/men/t-shirts",
    imageSrc: "/images/categories/t-shirts.jpg",
    imageAlt: "PABLO Men's Heavyweight Supima T-Shirts",
    indexNumber: "01",
  },
  {
    id: "shirts",
    name: "SHIRTS",
    slug: "shirts",
    href: "/men/shirts",
    imageSrc: "/images/categories/shirts.jpg",
    imageAlt: "PABLO Men's Tailored Italian Shirts",
    indexNumber: "02",
  },
  {
    id: "polos",
    name: "POLOS",
    slug: "polos",
    href: "/men/polos",
    imageSrc: "/images/categories/polos.jpg",
    imageAlt: "PABLO Men's Fine-Gauge Knit & Piqué Polos",
    indexNumber: "03",
  },

  // ROW 2: TROUSERS | DENIM | OUTERWEAR
  {
    id: "trousers",
    name: "TROUSERS",
    slug: "trousers",
    href: "/men/trousers",
    imageSrc: "/images/categories/trousers.jpg",
    imageAlt: "PABLO Men's Architectural Wool Trousers",
    indexNumber: "04",
  },
  {
    id: "denim",
    name: "DENIM",
    slug: "denim",
    href: "/men/denim",
    imageSrc: "/images/categories/denim.jpg",
    imageAlt: "PABLO Men's Japanese Selvedge Denim",
    indexNumber: "05",
  },
  {
    id: "outerwear",
    name: "OUTERWEAR",
    slug: "outerwear",
    href: "/men/outerwear",
    imageSrc: "/images/categories/outerwear.png",
    imageAlt: "PABLO Men's Sculptural Overcoats and Outerwear",
    indexNumber: "06",
  },

  // ROW 3: KNITWEAR | SWEATSHIRTS | SHORTS
  {
    id: "knitwear",
    name: "KNITWEAR",
    slug: "knitwear",
    href: "/men/knitwear",
    imageSrc: "/images/categories/knitwear.jpg",
    imageAlt: "PABLO Men's Cashmere & Merino Knitwear",
    indexNumber: "07",
  },
  {
    id: "sweatshirts",
    name: "SWEATSHIRTS",
    slug: "sweatshirts",
    href: "/men/sweatshirts",
    imageSrc: "/images/categories/sweatshirts.png",
    imageAlt: "PABLO Men's Heavyweight Cotton Sweatshirts",
    indexNumber: "08",
  },
  {
    id: "shorts",
    name: "SHORTS",
    slug: "shorts",
    href: "/men/shorts",
    imageSrc: "/images/categories/shorts.jpg",
    imageAlt: "PABLO Men's Tailored Relaxed Shorts",
    indexNumber: "09",
  },

  // ROW 4: FOOTWEAR | BAGS | ACCESSORIES
  {
    id: "footwear",
    name: "FOOTWEAR",
    slug: "footwear",
    href: "/men/footwear",
    imageSrc: "/images/categories/footwear.jpg",
    imageAlt: "PABLO Men's Handcrafted Leather Footwear",
    indexNumber: "10",
  },
  {
    id: "bags",
    name: "BAGS",
    slug: "bags",
    href: "/men/bags",
    imageSrc: "/images/categories/bags.jpg",
    imageAlt: "PABLO Men's Architectural Leather Bags & Luggage",
    indexNumber: "11",
  },
  {
    id: "accessories",
    name: "ACCESSORIES",
    slug: "accessories",
    href: "/men/accessories",
    imageSrc: "/images/categories/accessories.jpg",
    imageAlt: "PABLO Men's Sartorial Accessories & Atelier Jewelry",
    indexNumber: "12",
  },
];
