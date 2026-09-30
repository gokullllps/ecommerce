const fs = require('fs');
const content = fs.readFileSync('src/data/products.ts', 'utf8');
const lines = content.split(/\r?\n/);

let braceDepth = 0;
let bracketDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let c of line) {
    if (c === '{') braceDepth++;
    if (c === '}') braceDepth--;
    if (c === '[') bracketDepth++;
    if (c === ']') bracketDepth--;
  }
  if (braceDepth < 0 || bracketDepth < 0) {
    console.log(`Imbalance negative at line ${i + 1}: braceDepth=${braceDepth}, bracketDepth=${bracketDepth}`);
    console.log(`Line: ${line}`);
    break;
  }
}
console.log(`End of file: braceDepth=${braceDepth}, bracketDepth=${bracketDepth}`);
