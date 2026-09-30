const fs = require('fs');
let content = fs.readFileSync('src/data/products.ts', 'utf8');
const lines = content.split(/\r?\n/);

console.log('Total lines:', lines.length);

// Let's find any object in ALL_PRODUCTS that is incomplete or any kids fragments
let cleanedLines = [];
let i = 0;
while (i < lines.length) {
  // Check if this line is an orphaned image line like '      { url: ...' right after '  },'
  if (lines[i].match(/^\s*\{\s*url:/) && (i > 0 && lines[i-1].trim() === '},')) {
    console.log(`Found orphaned block starting at line ${i+1}: ${lines[i]}`);
    // Skip until the next '  },'
    while (i < lines.length && lines[i].trim() !== '},') {
      i++;
    }
    // skip the '  },' itself
    i++;
    console.log(`Skipped orphan up to line ${i}`);
    continue;
  }
  cleanedLines.push(lines[i]);
  i++;
}

fs.writeFileSync('src/data/products.ts', cleanedLines.join('\n'), 'utf8');
console.log('Cleaned orphans. New line count:', cleanedLines.length);

// Now test brace balance
let bDepth = 0;
let sqDepth = 0;
for (let j = 0; j < cleanedLines.length; j++) {
  const line = cleanedLines[j];
  for (let c of line) {
    if (c === '{') bDepth++;
    if (c === '}') bDepth--;
    if (c === '[') sqDepth++;
    if (c === ']') sqDepth--;
  }
  if (bDepth < 0 || sqDepth < 0) {
    console.log(`Negative depth at line ${j+1}: bDepth=${bDepth}, sqDepth=${sqDepth}, line: ${line}`);
    break;
  }
}
console.log(`Final depth: bDepth=${bDepth}, sqDepth=${sqDepth}`);
