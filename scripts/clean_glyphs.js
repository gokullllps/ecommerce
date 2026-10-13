const fs = require('fs');

// Clean Letter A: remove artifacts on right (x > 158)
const svgA = fs.readFileSync('scripts/letter_A.svg', 'utf8');
const dMatchA = svgA.match(/d="([^"]+)"/);
let dA = dMatchA[1];

// Clean Letter R: remove artifacts on left (x < 24)
const svgR = fs.readFileSync('scripts/letter_R.svg', 'utf8');
const dMatchR = svgR.match(/d="([^"]+)"/);
let dR = dMatchR[1];

// Let's inspect the subpaths of A and R
console.log('A subpaths count:', dA.split(/(?=M\s)/).length);
console.log('R subpaths count:', dR.split(/(?=M\s)/).length);
