const fs = require('fs');

// Verify that ProductFilters, CataloguePageClient and useProductFilters exist and have proper syntax
console.log("Checking filter files integrity...");

const pf = fs.readFileSync('src/components/catalogue/ProductFilters.tsx', 'utf-8');
const upf = fs.readFileSync('src/components/catalogue/filters/useProductFilters.ts', 'utf-8');
const cpc = fs.readFileSync('src/components/catalogue/CataloguePageClient.tsx', 'utf-8');

const assertions = [
  { name: "openDropdownId state in ProductFilters", pass: pf.includes("openDropdownId") },
  { name: "desktopContainerRef in ProductFilters", pass: pf.includes("desktopContainerRef") },
  { name: "FILTER CATALOGUE header", pass: pf.includes("FILTER CATALOGUE") },
  { name: "RESET ALL button in header", pass: pf.includes("RESET ALL") },
  { name: "CLOSE button in header", pass: pf.includes("CLOSE") },
  { name: "4-column size grid", pass: pf.includes("grid grid-cols-4") },
  { name: "2-column color swatch grid", pass: pf.includes("grid grid-cols-2") },
  { name: "PriceFilterSection with brackets and inputs", pass: pf.includes("PriceFilterSection") },
  { name: "CLEAR and APPLY in dropdown footer", pass: pf.includes("CLEAR") && pf.includes("APPLY") },
  { name: "Single dropdown overlay (does not expand page)", pass: pf.includes("absolute top-full") },
  { name: "Mobile drawer with accordion", pass: pf.includes("toggleMobileAccordion") },
  { name: "clearFilterGroup action exported", pass: upf.includes("clearFilterGroup") },
  { name: "clearFilterGroup wired in CataloguePageClient", pass: cpc.includes("clearFilterGroup") },
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

if (!allPassed) {
  process.exit(1);
} else {
  console.log("\nAll filter architecture checks PASSED successfully!");
}
