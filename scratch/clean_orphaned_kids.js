const fs = require('fs');
let content = fs.readFileSync('src/data/products.ts', 'utf8');

// First remove lines 1392 to 1436
const lines = content.split(/\r?\n/);
let startRemove = -1;
let endRemove = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Petit Trench Collar Detail')) {
    startRemove = i;
  }
  if (startRemove !== -1 && lines[i].includes('createdAt: "2026-06-20T10:00:00Z",')) {
    endRemove = i + 1; // line after closing brace
    break;
  }
}

console.log('startRemove:', startRemove, lines[startRemove]);
console.log('endRemove:', endRemove, lines[endRemove]);

if (startRemove !== -1 && endRemove !== -1) {
  lines.splice(startRemove, endRemove - startRemove + 1);
  fs.writeFileSync('src/data/products.ts', lines.join('\n'), 'utf8');
  console.log('Removed orphaned kids section!');
}

// Now check if there are any other syntax errors or brace depth issues
const checkLines = fs.readFileSync('src/data/products.ts', 'utf8').split(/\r?\n/);
let bDepth = 0;
let sqDepth = 0;
for (let i = 0; i < checkLines.length; i++) {
  const line = checkLines[i];
  for (let c of line) {
    if (c === '{') bDepth++;
    if (c === '}') bDepth--;
    if (c === '[') sqDepth++;
    if (c === ']') sqDepth--;
  }
  if (bDepth < 0 || sqDepth < 0) {
    console.log(`Negative depth at line ${i+1}: bDepth=${bDepth}, sqDepth=${sqDepth}, line: ${line}`);
    break;
  }
}
console.log(`Final depth: bDepth=${bDepth}, sqDepth=${sqDepth}`);
