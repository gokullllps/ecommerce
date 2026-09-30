const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\a841cc81-3ee9-44ba-97e1-b38a1d3ec995';
const destDir = 'd:\\ecommerce\\public\\images\\kids';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const map = {
  'kids_hoodie_front_1790322274781.jpg': 'hoodie-sky-front.jpg',
  'kids_hoodie_back_1790322298752.jpg': 'hoodie-sky-back.jpg',
  'kids_hoodie_detail_1790322323665.jpg': 'hoodie-sky-detail.jpg',
  'kids_hoodie_lifestyle_1790322353225.jpg': 'hoodie-sky-lifestyle.jpg',
  'kids_hoodie_cream_1790322382819.jpg': 'hoodie-cream-front.jpg',

  'kids_duffle_coat_front_1790322413841.jpg': 'duffle-navy-front.jpg',
  'kids_duffle_coat_back_1790322441432.jpg': 'duffle-navy-back.jpg',
  'kids_duffle_detail_1790322467666.jpg': 'duffle-navy-detail.jpg',
  'kids_duffle_camel_1790322496946.jpg': 'duffle-camel-front.jpg',

  'kids_cable_knit_front_1790322529200.jpg': 'cable-knit-ivory-front.jpg',
  'kids_cable_knit_back_1790322556597.jpg': 'cable-knit-ivory-back.jpg',

  'kids_poplin_shirt_1790322587849.jpg': 'poplin-shirt-white-front.jpg',
  'kids_poplin_back_1790322623692.jpg': 'poplin-shirt-white-back.jpg',
  'kids_hero_model_1790230352277.jpg': 'kids-model-lifestyle.jpg',
};

for (const [srcName, destName] of Object.entries(map)) {
  const srcPath = path.join(srcDir, srcName);
  const destPath = path.join(destDir, destName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcName} -> ${destName}`);
  } else {
    console.warn(`Source not found: ${srcPath}`);
  }
}

console.log('Finished copying images.');
