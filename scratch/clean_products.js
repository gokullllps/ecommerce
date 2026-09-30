const fs = require('fs');
const content = fs.readFileSync('src/data/products.ts', 'utf8');
const lines = content.split(/\r?\n/);
console.log('Total lines:', lines.length);

let endMenIndex = -1;
for (let i = 2300; i < lines.length; i++) {
  if (lines[i].includes('tags:') && lines[i].includes('Socks') && lines[i].includes('Men')) {
    endMenIndex = i;
    break;
  }
}
console.log('endMenIndex:', endMenIndex);
// find the next line with '  },'
let closingBraceIdx = -1;
for (let i = endMenIndex; i < endMenIndex + 15; i++) {
  if (lines[i].trim() === '},') {
    closingBraceIdx = i;
    break;
  }
}
console.log('closingBraceIdx:', closingBraceIdx, lines[closingBraceIdx]);

let kidsSpreadIdx = -1;
for (let i = 2500; i < lines.length; i++) {
  if (lines[i].includes('...KIDS_PRODUCTS,')) {
    kidsSpreadIdx = i;
    break;
  }
}
console.log('kidsSpreadIdx:', kidsSpreadIdx, lines[kidsSpreadIdx]);

if (closingBraceIdx !== -1 && kidsSpreadIdx !== -1) {
  const newLines = [
    ...lines.slice(0, closingBraceIdx + 1),
    '',
    '  // ==========================================',
    '  // KIDS: LUXURY CHILDREN WARDROBE (1-12)',
    '  // ==========================================',
    ...lines.slice(kidsSpreadIdx)
  ];
  fs.writeFileSync('src/data/products.ts', newLines.join('\n'), 'utf8');
  console.log('Updated src/data/products.ts. New line count:', newLines.length);
} else {
  console.error('Could not find indices!');
}
