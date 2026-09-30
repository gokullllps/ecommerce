const fs = require('fs');

const content = fs.readFileSync('src/data/products.ts', 'utf8');

// Match all product objects
// We can use a parser or regex to extract id, name, gender, images
const lines = content.split('\n');
const kidsProducts = [];
let currentProduct = null;
let inKids = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('id: "pab-k-') || (line.includes('id: "') && currentProduct === null)) {
    const idMatch = line.match(/id:\s*"([^"]+)"/);
    if (idMatch) {
      if (currentProduct) {
        if (currentProduct.gender === 'kids' || currentProduct.id.startsWith('pab-k-')) {
          kidsProducts.push(currentProduct);
        }
      }
      currentProduct = { id: idMatch[1], images: [], colors: [] };
    }
  }
  if (currentProduct) {
    const nameMatch = line.match(/name:\s*"([^"]+)"/);
    if (nameMatch) currentProduct.name = nameMatch[1];
    
    const genderMatch = line.match(/gender:\s*"([^"]+)"/);
    if (genderMatch) currentProduct.gender = genderMatch[1];

    const categoryMatch = line.match(/category:\s*"([^"]+)"/);
    if (categoryMatch) currentProduct.category = categoryMatch[1];

    const imageMatch = line.match(/url:\s*"([^"]+)"/);
    if (imageMatch) currentProduct.images.push(imageMatch[1]);
  }
}
if (currentProduct && (currentProduct.gender === 'kids' || currentProduct.id.startsWith('pab-k-'))) {
  kidsProducts.push(currentProduct);
}

console.log(`Found ${kidsProducts.length} Kids products:`);
kidsProducts.forEach(p => {
  console.log(`- ${p.id}: "${p.name}" (cat: ${p.category}) images: ${p.images.join(', ')}`);
});

// Check duplicate primary images
const primaryImageMap = {};
kidsProducts.forEach(p => {
  const primary = p.images[0] || 'NO_IMAGE';
  if (!primaryImageMap[primary]) primaryImageMap[primary] = [];
  primaryImageMap[primary].push(p.id);
});

console.log('\n--- Primary Image Duplicates ---');
for (const [img, pids] of Object.entries(primaryImageMap)) {
  if (pids.length > 1) {
    console.log(`DUPLICATE: ${img} used by [${pids.join(', ')}]`);
  }
}
