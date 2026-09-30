const fs = require('fs');

console.log("Checking ProductCard redesign requirements...");

const cardFile = fs.readFileSync('src/components/catalogue/ProductCard.tsx', 'utf-8');
const gridFile = fs.readFileSync('src/components/catalogue/ProductGrid.tsx', 'utf-8');

const tests = [
  // Structure & Badges
  { name: "Contains ADD TO BAG button text", pass: cardFile.includes("ADD TO BAG") },
  { name: "Arrow character or element in ADD TO BAG", pass: cardFile.includes("→") },
  { name: "Contains NEW IN / SALE badge logic", pass: cardFile.includes("NEW IN") && cardFile.includes("SALE") },
  { name: "Contains Wishlist heart icon", pass: cardFile.includes("toggleWishlist") && cardFile.includes("isInWishlist") },
  { name: "Contains Editorial Micro-label annotations", pass: cardFile.includes("AUTUMN / WINTER 2026") || cardFile.includes("MODERN ESSENTIALS") || cardFile.includes("TAILORED FOR TOMORROW") },
  
  // Design & Interactions
  { name: "Subtle zoom around 1.03", pass: cardFile.includes("scale-[1.03]") },
  { name: "Dark #181818 button background default", pass: cardFile.includes("#181818") },
  { name: "Button hover inversion", pass: cardFile.includes("hover:bg-white") || cardFile.includes("hover:bg-[#FFFFFF]") },
  { name: "Material / fabric description included", pass: cardFile.includes("product.material") },
  { name: "Arrow translates on hover", pass: cardFile.includes("translate-x") },
  { name: "Directly calls addToCart", pass: cardFile.includes("addToCart(") },
  
  // Layout in ProductGrid
  { name: "Grid has 4 columns on desktop", pass: gridFile.includes("lg:grid-cols-4") },
  { name: "Grid has 2 columns on tablet", pass: gridFile.includes("sm:grid-cols-2") },
  { name: "Grid has generous spacing gap", pass: gridFile.includes("gap-6") || gridFile.includes("gap-8") },
];

let allPassed = true;
tests.forEach(t => {
  if (t.pass) {
    console.log(`✓ ${t.name}`);
  } else {
    console.error(`✗ FAIL: ${t.name}`);
    allPassed = false;
  }
});

if (!allPassed) {
  console.log("\nSome requirements are not yet satisfied in the current files.");
  process.exit(1);
} else {
  console.log("\nAll ProductCard requirements PASSED!");
}
