const fs = require('fs');

console.log("Checking product card & showcase carousel implementation...");

const pc = fs.readFileSync('src/components/catalogue/ProductCard.tsx', 'utf-8');
const carousel = fs.readFileSync('src/components/catalogue/ProductCarousel.tsx', 'utf-8');
const na = fs.readFileSync('src/components/sections/NewArrivalsSection.tsx', 'utf-8');
const bs = fs.readFileSync('src/components/sections/BestsellersSection.tsx', 'utf-8');
const pg = fs.readFileSync('src/components/catalogue/ProductGrid.tsx', 'utf-8');

const assertions = [
  { name: "ProductCard has dark container #181818", pass: pc.includes("bg-[#181818]") },
  { name: "ProductCard has large image with aspect-[16/11] or aspect-[4/3]", pass: pc.includes("aspect-[16/11]") || pc.includes("aspect-[4/3]") },
  { name: "ProductCard has hover zoom effect", pass: pc.includes("group-hover:scale-105") },
  { name: "ProductCard has badge (NEW IN / BESTSELLER / SALE / LIMITED)", pass: pc.includes("NEW IN") && pc.includes("BESTSELLER") },
  { name: "ProductCard has functional wishlist button", pass: pc.includes("toggleWishlist") },
  { name: "ProductCard has product name", pass: pc.includes("product.name") },
  { name: "ProductCard has short description / subtitle", pass: pc.includes("product.subtitle") },
  { name: "ProductCard has price display", pass: pc.includes("formatPrice") },
  { name: "ProductCard has small CTA button (VIEW)", pass: pc.includes(">VIEW<") || pc.includes("VIEW") },
  { name: "ProductCarousel has 4-card desktop width (25%)", pass: carousel.includes("lg:w-[calc(25%") },
  { name: "ProductCarousel has left/right arrow controls", pass: carousel.includes("scrollPrev") && carousel.includes("scrollNext") },
  { name: "NewArrivalsSection uses ProductCarousel", pass: na.includes("<ProductCarousel") },
  { name: "BestsellersSection uses ProductCarousel", pass: bs.includes("<ProductCarousel") },
  { name: "ProductGrid has 4 columns across on desktop", pass: pg.includes("lg:grid-cols-4") },
];

let allPassed = true;
assertions.forEach((a) => {
  if (a.pass) {
    console.log(`✓ ${a.name}`);
  } else {
    console.error(`✗ FAIL: ${a.name}`);
    allPassed = false;
  }
});

if (!allPassed) process.exit(1);
console.log("\nAll product card & showcase checks PASSED!");
