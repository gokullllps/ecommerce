const fs = require('fs');

let content = fs.readFileSync('src/data/products.ts', 'utf8');

// 1. Add import at top
if (!content.includes('import { KIDS_PRODUCTS, validateKidsProductImages } from "./kidsProducts";')) {
  content = 'import { Product } from "@/types/catalogue";\nimport { KIDS_PRODUCTS, validateKidsProductImages } from "./kidsProducts";\n' + content.slice(content.indexOf('export const ALL_PRODUCTS: Product[] = ['));
}

// 2. Remove all pab-k- objects from ALL_PRODUCTS
// Each product object starts with { and has id: "pab-k-..."
// Let's use regex to find and remove them.
// A product block looks like:
//   {\n    id: "pab-k-...\n  },
const regex = /\s*\{\s*id:\s*"pab-k-[^}]+?\},\n/gs;
const matches = content.match(regex);
console.log(`Found ${matches ? matches.length : 0} old pab-k blocks to remove.`);

content = content.replace(regex, '\n');

// 3. Before the closing ]; of ALL_PRODUCTS, insert ...KIDS_PRODUCTS
// Let's locate the closing of ALL_PRODUCTS:
// It looks like:
// ];
// // Department classification lookup
const targetClosing = '\n];\n\n// Department classification lookup';
if (content.includes(targetClosing)) {
  content = content.replace(targetClosing, '\n  // ==========================================\n  // KIDS: LUXURY CHILDREN WARDROBE (1-12)\n  // ==========================================\n  ...KIDS_PRODUCTS,\n];\n\n// Department classification lookup');
  console.log('Inserted ...KIDS_PRODUCTS into ALL_PRODUCTS');
} else {
  console.warn('Target closing not found!');
}

// 4. Export at bottom
if (!content.includes('export { KIDS_PRODUCTS, validateKidsProductImages };')) {
  content += '\n\nexport { KIDS_PRODUCTS, validateKidsProductImages };\n';
}

fs.writeFileSync('src/data/products.ts', content, 'utf8');
console.log('Successfully updated src/data/products.ts');
