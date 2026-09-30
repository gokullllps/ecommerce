const fs = require('fs');
let content = fs.readFileSync('src/data/products.ts', 'utf8');
const lines = content.split(/\r?\n/);

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('KIDS: ATELIER PETIT (31-40)')) {
    startIdx = i - 1; // include the comment header separator
  }
  if (startIdx !== -1 && lines[i].includes('ADDITIONAL ARCHIVAL & EDITORIAL PIECES')) {
    endIdx = i - 1;
    break;
  }
}

console.log('startIdx:', startIdx, lines[startIdx]);
console.log('endIdx:', endIdx, lines[endIdx]);

if (startIdx !== -1 && endIdx !== -1) {
  const newLines = [
    ...lines.slice(0, startIdx),
    ...lines.slice(endIdx)
  ];
  fs.writeFileSync('src/data/products.ts', newLines.join('\n'), 'utf8');
  console.log('Cleaned old Kids Atelier Petit section!');
} else {
  console.error('Could not find slice boundaries');
}
