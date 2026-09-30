const fs = require('fs');

console.log("Checking vertical dropdown navbar implementation...");

const navFile = fs.readFileSync('src/data/navigation.ts', 'utf-8');
const navbar = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf-8');
const dropdown = fs.readFileSync('src/components/layout/MegaMenu.tsx', 'utf-8');

// Parse items per category from navigation.ts
const strippedNav = navFile
  .replace(/export interface[\s\S]*?}\s*/g, '')
  .replace(/export type[\s\S]*?;\s*/g, '')
  .replace(/export const NAVIGATION_DATA:[^=]+=\s*/, '');
const parsedNav = eval(strippedNav);

const expected = {
  men: ["ALL MEN", "NEW IN", "CLOTHING", "FOOTWEAR", "ACCESSORIES", "SALE"],
  women: ["ALL WOMEN", "NEW IN", "CLOTHING", "FOOTWEAR", "ACCESSORIES", "SALE"],
  kids: ["ALL KIDS", "NEW IN", "CLOTHING", "FOOTWEAR", "ACCESSORIES", "SALE"],
  footwear: ["ALL FOOTWEAR", "SNEAKERS", "LOAFERS", "BOOTS", "SANDALS"],
  accessories: ["ALL ACCESSORIES", "BAGS", "WALLETS", "BELTS", "CAPS", "OTHER ACCESSORIES"],
  sale: ["ALL SALE", "MEN", "WOMEN", "KIDS", "FOOTWEAR", "ACCESSORIES"],
};

let allPassed = true;

for (const [id, list] of Object.entries(expected)) {
  const cat = parsedNav.find(c => c.id === id);
  if (!cat) {
    console.error(`✗ Missing category: ${id}`);
    allPassed = false;
    continue;
  }
  const actualLabels = cat.items.map(i => i.label);
  const match = JSON.stringify(actualLabels) === JSON.stringify(list);
  if (match) {
    console.log(`✓ ${id.toUpperCase()}: exact match [${actualLabels.join(", ")}]`);
  } else {
    console.error(`✗ ${id.toUpperCase()} mismatch!\n  Expected: ${JSON.stringify(list)}\n  Got:      ${JSON.stringify(actualLabels)}`);
    allPassed = false;
  }
}

// Check dropdown component attributes
const dropdownAssertions = [
  { name: "NavbarDropdown has divide-y divider lines", pass: dropdown.includes("divide-y divide-[#D9D8D3]") },
  { name: "NavbarDropdown has white background #FFFFFF", pass: dropdown.includes("#FFFFFF") },
  { name: "NavbarDropdown has width 280-320px", pass: dropdown.includes("w-[280px]") },
  { name: "NavbarDropdown has row height 48-50px", pass: dropdown.includes("h-[48px]") },
  { name: "Navbar directly attaches dropdown to nav items", pass: navbar.includes("<NavbarDropdown") },
];

dropdownAssertions.forEach(a => {
  if (a.pass) {
    console.log(`✓ ${a.name}`);
  } else {
    console.error(`✗ FAIL: ${a.name}`);
    allPassed = false;
  }
});

if (!allPassed) process.exit(1);
console.log("\nAll dropdown navbar checks PASSED!");
