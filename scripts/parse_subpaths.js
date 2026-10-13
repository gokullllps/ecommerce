const fs = require('fs');

const svg = fs.readFileSync('scripts/amura_traced.svg', 'utf8');
const dMatch = svg.match(/d="([^"]+)"/);
if (!dMatch) {
  console.error('No d found');
  process.exit(1);
}

const d = dMatch[1];
const subpaths = d.split(/(?=M\s)/).filter(Boolean);
console.log('Total subpaths:', subpaths.length);

subpaths.forEach((p, idx) => {
  // Find min/max X and Y in this subpath to see which letter it belongs to
  const coords = p.match(/-?\d+(\.\d+)?/g).map(Number);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < coords.length; i += 2) {
    const x = coords[i];
    const y = coords[i + 1];
    if (x !== undefined && y !== undefined) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  console.log(`Subpath ${idx}: X range [${minX.toFixed(1)}, ${maxX.toFixed(1)}], Y range [${minY.toFixed(1)}, ${maxY.toFixed(1)}], length ${p.length}`);
});
