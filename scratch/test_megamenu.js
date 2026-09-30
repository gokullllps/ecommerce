const fs = require('fs');

const navFile = fs.readFileSync('src/data/navigation.ts', 'utf-8');

console.log("Validating mega menu configuration...");

// Extract columns array per section
function getSectionLinks(sectionId) {
  const sectionRegex = new RegExp(`id:\\s*"${sectionId}"[\\s\\S]*?columns:\\s*\\[([\\s\\S]*?)\\]\\s*,\\s*editorial:`);
  const match = navFile.match(sectionRegex);
  if (!match) return { columns: 0, linksPerColumn: [], totalLinks: 0 };
  
  const columnsContent = match[1];
  // Split by individual column blocks
  const columnBlocks = columnsContent.split(/title:\s*"[^"]+"/);
  // Remove first empty split before first title
  const columns = columnBlocks.slice(1);
  
  const linksPerColumn = columns.map(col => {
    const linkMatches = col.match(/label:\s*"[^"]+"/g) || [];
    return linkMatches.length;
  });
  
  const totalLinks = linksPerColumn.reduce((a, b) => a + b, 0);
  return { columns: columns.length, linksPerColumn, totalLinks };
}

const sections = ["men", "women", "kids", "footwear", "accessories", "sale"];

let allPassed = true;

sections.forEach(id => {
  const data = getSectionLinks(id);
  console.log(`${id.toUpperCase()}: ${data.columns} column(s), links: [${data.linksPerColumn.join(", ")}], total: ${data.totalLinks}`);
  
  // Rule: each column must have at most 4 items
  const maxPerCol = Math.max(...data.linksPerColumn);
  if (maxPerCol > 4) {
    console.error(`✗ FAIL: ${id} has a column with >4 links (${maxPerCol})`);
    allPassed = false;
  }
});

// Specific checks:
const men = getSectionLinks("men");
const women = getSectionLinks("women");
const kids = getSectionLinks("kids");
const footwear = getSectionLinks("footwear");
const accessories = getSectionLinks("accessories");
const sale = getSectionLinks("sale");

if (men.columns !== 3 || men.totalLinks !== 12 || men.linksPerColumn.some(c => c !== 4)) {
  console.error("✗ FAIL: Men must have exactly 3 columns with 4 links each.");
  allPassed = false;
} else {
  console.log("✓ MEN has 3 columns with exactly 4 links each");
}

if (women.columns !== 3 || women.totalLinks !== 12 || women.linksPerColumn.some(c => c !== 4)) {
  console.error("✗ FAIL: Women must have exactly 3 columns with 4 links each.");
  allPassed = false;
} else {
  console.log("✓ WOMEN has 3 columns with exactly 4 links each");
}

if (kids.columns !== 3 || kids.totalLinks !== 12 || kids.linksPerColumn.some(c => c !== 4)) {
  console.error("✗ FAIL: Kids must have exactly 3 columns with 4 links each.");
  allPassed = false;
} else {
  console.log("✓ KIDS has 3 columns with exactly 4 links each");
}

if (footwear.totalLinks !== 4) {
  console.error("✗ FAIL: Footwear must have exactly 4 links total.");
  allPassed = false;
} else {
  console.log("✓ FOOTWEAR has exactly 4 links total");
}

if (accessories.totalLinks !== 4) {
  console.error("✗ FAIL: Accessories must have exactly 4 links total.");
  allPassed = false;
} else {
  console.log("✓ ACCESSORIES has exactly 4 links total");
}

if (sale.totalLinks !== 4) {
  console.error("✗ FAIL: Sale must have exactly 4 links total.");
  allPassed = false;
} else {
  console.log("✓ SALE has exactly 4 links total");
}

if (!allPassed) process.exit(1);
console.log("\nAll 6 mega-menu sections strictly meet the 4-item rule!");
