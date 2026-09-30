import fs from "fs";
import path from "path";
import { ALL_PRODUCTS } from "../src/data/products";
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_PROMOTIONS,
  INITIAL_THEMES,
  INITIAL_HERO_SLIDES,
  INITIAL_SECTIONS,
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CATEGORIES,
  INITIAL_COLLECTIONS,
  INITIAL_INVENTORY_LOGS,
} from "../src/lib/admin/initialData";
import { MediaAsset } from "../src/types/admin";

const DATA_DIR = path.join(process.cwd(), "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Media assets based on existing files in public/images
const INITIAL_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "med_01",
    filename: "hero-desktop.jpg",
    url: "/images/hero-desktop.jpg",
    sizeBytes: 1420000,
    mimeType: "image/jpeg",
    folder: "heroes",
    tags: ["hero", "campaign", "desktop"],
    dimensions: { width: 2880, height: 1620 },
    uploadedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "med_02",
    filename: "hero-desktop-2.jpg",
    url: "/images/hero-desktop-2.jpg",
    sizeBytes: 1350000,
    mimeType: "image/jpeg",
    folder: "heroes",
    tags: ["hero", "outerwear", "desktop"],
    dimensions: { width: 2880, height: 1620 },
    uploadedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "med_03",
    filename: "knitwear.jpg",
    url: "/images/categories/knitwear.jpg",
    sizeBytes: 620000,
    mimeType: "image/jpeg",
    folder: "products",
    tags: ["category", "knitwear", "cashmere"],
    dimensions: { width: 1200, height: 1600 },
    uploadedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "med_04",
    filename: "outerwear.png",
    url: "/images/categories/outerwear.png",
    sizeBytes: 840000,
    mimeType: "image/png",
    folder: "products",
    tags: ["category", "outerwear", "overcoat"],
    dimensions: { width: 1200, height: 1600 },
    uploadedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "med_05",
    filename: "t-shirts.jpg",
    url: "/images/categories/t-shirts.jpg",
    sizeBytes: 540000,
    mimeType: "image/jpeg",
    folder: "products",
    tags: ["category", "t-shirts", "supima"],
    dimensions: { width: 1200, height: 1600 },
    uploadedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "med_06",
    filename: "denim.jpg",
    url: "/images/categories/denim.jpg",
    sizeBytes: 780000,
    mimeType: "image/jpeg",
    folder: "products",
    tags: ["category", "denim", "selvedge"],
    dimensions: { width: 1200, height: 1600 },
    uploadedAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "med_07",
    filename: "pablo-logo.png",
    url: "/images/pablo-logo.png",
    sizeBytes: 120000,
    mimeType: "image/png",
    folder: "general",
    tags: ["logo", "brand", "monochrome"],
    dimensions: { width: 800, height: 240 },
    uploadedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "med_08",
    filename: "pablo-kids-hero.png",
    url: "/images/pablo-kids-hero.png",
    sizeBytes: 691000,
    mimeType: "image/png",
    folder: "campaigns",
    tags: ["kids", "campaign", "hero"],
    dimensions: { width: 1920, height: 1080 },
    uploadedAt: "2026-09-10T00:00:00Z",
  },
];

// Combined storefront JSON
const STOREFRONT_DATA = {
  settings: INITIAL_SETTINGS,
  heroSlides: INITIAL_HERO_SLIDES,
  sections: INITIAL_SECTIONS,
};

function writeJson(filename: string, data: any) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`✓ Wrote ${filename} (${Array.isArray(data) ? data.length + ' items' : 'object'})`);
}

console.log("Migrating PABLO seed data into canonical JSON files...");

writeJson("products.json", ALL_PRODUCTS);
writeJson("categories.json", INITIAL_CATEGORIES);
writeJson("collections.json", INITIAL_COLLECTIONS);
writeJson("inventory.json", INITIAL_INVENTORY_LOGS);
writeJson("orders.json", INITIAL_ORDERS);
writeJson("customers.json", INITIAL_CUSTOMERS);
writeJson("promotions.json", INITIAL_PROMOTIONS);
writeJson("themes.json", INITIAL_THEMES);
writeJson("storefront.json", STOREFRONT_DATA);
writeJson("media.json", INITIAL_MEDIA_ASSETS);
writeJson("admin-users.json", INITIAL_ADMIN_USERS);
writeJson("audit-logs.json", INITIAL_AUDIT_LOGS);

console.log("\nAll 12 JSON files successfully created in data/ directory!");
