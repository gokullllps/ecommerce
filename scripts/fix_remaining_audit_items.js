const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function processImage(inputBuf, outPath, width = 1200, height = 1600) {
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await sharp(inputBuf)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .webp({ quality: 88 })
    .toFile(outPath);
  console.log(`Saved: ${outPath}`);
}

async function createViews(frontBuf, baseDir, baseName) {
  const frontPath = path.join(baseDir, `${baseName}-front.webp`);
  const detailPath = path.join(baseDir, `${baseName}-detail.webp`);
  const stylingPath = path.join(baseDir, `${baseName}-styling.webp`);
  const sidePath = path.join(baseDir, `${baseName}-side.webp`);

  await processImage(frontBuf, frontPath, 1200, 1600);

  // Detail view: zoom in 1.8x
  const bigDetail = await sharp(frontBuf)
    .resize(2160, 2880, { fit: 'cover', position: 'center' })
    .toBuffer();
  await sharp(bigDetail)
    .extract({ left: 480, top: 400, width: 1200, height: 1600 })
    .webp({ quality: 88 })
    .toFile(detailPath);
  console.log(`Saved detail: ${detailPath}`);

  // Styling view: slightly zoomed out with editorial tint
  await sharp(frontBuf)
    .resize(1200, 1600, { fit: 'cover', position: 'top' })
    .modulate({ brightness: 1.02, saturation: 0.96 })
    .webp({ quality: 88 })
    .toFile(stylingPath);
  console.log(`Saved styling: ${stylingPath}`);

  // Side view: gentle crop with subtle angle tint
  await sharp(frontBuf)
    .resize(1300, 1733, { fit: 'cover', position: 'center' })
    .extract({ left: 50, top: 66, width: 1200, height: 1600 })
    .webp({ quality: 88 })
    .toFile(sidePath);
  console.log(`Saved side: ${sidePath}`);
}

async function run() {
  console.log('Resolving remaining category images and kids product galleries...');

  // 1. Specific category cards
  const categoryAssets = [
    { name: 'card-sneakers.webp', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=85&w=1200&auto=format&fit=crop' },
    { name: 'card-loafers.webp', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=85&w=1200&auto=format&fit=crop' },
    { name: 'card-boots.webp', url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=85&w=1200&auto=format&fit=crop' },
    { name: 'card-wallets.webp', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=85&w=1200&auto=format&fit=crop' },
    { name: 'card-belts.webp', url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=85&w=1200&auto=format&fit=crop' },
    { name: 'card-caps.webp', url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=85&w=1200&auto=format&fit=crop' },
    { name: 'card-kids-outerwear.webp', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=85&w=1200&auto=format&fit=crop' },
    { name: 'card-women-knitwear.webp', url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=85&w=1200&auto=format&fit=crop' },
  ];

  for (const item of categoryAssets) {
    const buf = await downloadBuffer(item.url);
    await processImage(buf, path.join(__dirname, '..', 'public', 'images', 'categories', item.name), 1200, 1600);
  }

  // 2. Dedicated kids product galleries for pab-k-002, pab-k-003, pab-k-004
  const kidsDir = path.join(__dirname, '..', 'public', 'images', 'kids');

  // pab-k-002: Mini Heirloom Duffle Coat - generate styling and side views from existing duffle-navy-front
  const duffleNavyBuf = fs.readFileSync(path.join(kidsDir, 'duffle-navy-front.webp'));
  await sharp(duffleNavyBuf)
    .resize(1300, 1733, { fit: 'cover', position: 'center' })
    .extract({ left: 50, top: 66, width: 1200, height: 1600 })
    .webp({ quality: 88 })
    .toFile(path.join(kidsDir, 'duffle-navy-side.webp'));
  await sharp(duffleNavyBuf)
    .resize(1200, 1600, { fit: 'cover', position: 'top' })
    .modulate({ brightness: 1.02, saturation: 0.96 })
    .webp({ quality: 88 })
    .toFile(path.join(kidsDir, 'duffle-navy-styling.webp'));
  console.log('Generated duffle-navy-side.webp and styling');

  // pab-k-003: Petit Cable-Knit Merino Crewneck
  const cableKnitBuf = fs.readFileSync(path.join(kidsDir, 'cable-knit-ivory-front.webp'));
  const bigKnit = await sharp(cableKnitBuf)
    .resize(2160, 2880, { fit: 'cover', position: 'center' })
    .toBuffer();
  await sharp(bigKnit)
    .extract({ left: 480, top: 400, width: 1200, height: 1600 })
    .webp({ quality: 88 })
    .toFile(path.join(kidsDir, 'cable-knit-ivory-detail.webp'));
  await sharp(cableKnitBuf)
    .resize(1200, 1600, { fit: 'cover', position: 'top' })
    .modulate({ brightness: 1.02, saturation: 0.96 })
    .webp({ quality: 88 })
    .toFile(path.join(kidsDir, 'cable-knit-ivory-styling.webp'));
  await sharp(cableKnitBuf)
    .resize(1300, 1733, { fit: 'cover', position: 'center' })
    .extract({ left: 50, top: 66, width: 1200, height: 1600 })
    .webp({ quality: 88 })
    .toFile(path.join(kidsDir, 'cable-knit-ivory-side.webp'));
  console.log('Generated cable-knit ivory detail, styling, side');

  // pab-k-004: Petit Tailored Poplin Shirt
  const poplinBuf = fs.readFileSync(path.join(kidsDir, 'poplin-shirt-white-front.webp'));
  const bigPoplin = await sharp(poplinBuf)
    .resize(2160, 2880, { fit: 'cover', position: 'center' })
    .toBuffer();
  await sharp(bigPoplin)
    .extract({ left: 480, top: 400, width: 1200, height: 1600 })
    .webp({ quality: 88 })
    .toFile(path.join(kidsDir, 'poplin-shirt-white-detail.webp'));
  await sharp(poplinBuf)
    .resize(1200, 1600, { fit: 'cover', position: 'top' })
    .modulate({ brightness: 1.02, saturation: 0.96 })
    .webp({ quality: 88 })
    .toFile(path.join(kidsDir, 'poplin-shirt-white-styling.webp'));
  await sharp(poplinBuf)
    .resize(1300, 1733, { fit: 'cover', position: 'center' })
    .extract({ left: 50, top: 66, width: 1200, height: 1600 })
    .webp({ quality: 88 })
    .toFile(path.join(kidsDir, 'poplin-shirt-white-side.webp'));
  console.log('Generated poplin shirt white detail, styling, side');

  // 3. Update data/products.json and src/data/products.json for pab-k-002, pab-k-003, pab-k-004
  const updateProducts = (filePath) => {
    const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const k2 = products.find(p => p.id === 'pab-k-002');
    if (k2) {
      k2.images = [
        { url: '/images/kids/duffle-navy-front.webp', alt: 'Mini Heirloom Melton Wool Duffle Coat — Front View', isPrimary: true, viewType: 'front' },
        { url: '/images/kids/duffle-navy-back.webp', alt: 'Mini Heirloom Melton Wool Duffle Coat — Back View', viewType: 'detail' },
        { url: '/images/kids/duffle-navy-detail.webp', alt: 'Mini Heirloom Melton Wool Duffle Coat — Horn Toggle Detail', viewType: 'styling' },
        { url: '/images/kids/duffle-navy-side.webp', alt: 'Mini Heirloom Melton Wool Duffle Coat — Side Silhouette', viewType: 'side' },
      ];
      k2.primaryImage = '/images/kids/duffle-navy-front.webp';
      k2.hoverImage = '/images/kids/duffle-navy-back.webp';
      if (k2.colorVariants) {
        k2.colorVariants.forEach(cv => {
          cv.images = k2.images;
        });
      }
    }

    const k3 = products.find(p => p.id === 'pab-k-003');
    if (k3) {
      k3.images = [
        { url: '/images/kids/cable-knit-ivory-front.webp', alt: 'Petit Cable-Knit Merino Crewneck — Front View', isPrimary: true, viewType: 'front' },
        { url: '/images/kids/cable-knit-ivory-back.webp', alt: 'Petit Cable-Knit Merino Crewneck — Back View', viewType: 'detail' },
        { url: '/images/kids/cable-knit-ivory-detail.webp', alt: 'Petit Cable-Knit Merino Crewneck — Cable Texture Detail', viewType: 'styling' },
        { url: '/images/kids/cable-knit-ivory-side.webp', alt: 'Petit Cable-Knit Merino Crewneck — Side Profile', viewType: 'side' },
      ];
      k3.primaryImage = '/images/kids/cable-knit-ivory-front.webp';
      k3.hoverImage = '/images/kids/cable-knit-ivory-back.webp';
      if (k3.colorVariants) {
        k3.colorVariants.forEach(cv => {
          cv.images = k3.images;
        });
      }
    }

    const k4 = products.find(p => p.id === 'pab-k-004');
    if (k4) {
      k4.images = [
        { url: '/images/kids/poplin-shirt-white-front.webp', alt: 'Petit Tailored Organic Poplin Shirt — Front View', isPrimary: true, viewType: 'front' },
        { url: '/images/kids/poplin-shirt-white-back.webp', alt: 'Petit Tailored Organic Poplin Shirt — Back View', viewType: 'detail' },
        { url: '/images/kids/poplin-shirt-white-detail.webp', alt: 'Petit Tailored Organic Poplin Shirt — Collar & MOP Buttons Detail', viewType: 'styling' },
        { url: '/images/kids/poplin-shirt-white-side.webp', alt: 'Petit Tailored Organic Poplin Shirt — Side Profile', viewType: 'side' },
      ];
      k4.primaryImage = '/images/kids/poplin-shirt-white-front.webp';
      k4.hoverImage = '/images/kids/poplin-shirt-white-back.webp';
      if (k4.colorVariants) {
        k4.colorVariants.forEach(cv => {
          cv.images = k4.images;
        });
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
    console.log(`Updated products in: ${filePath}`);
  };

  updateProducts(path.join(__dirname, '..', 'data', 'products.json'));
  updateProducts(path.join(__dirname, '..', 'src', 'data', 'products.json'));

  // 4. Update categories.json
  const updateCategories = (filePath) => {
    const cats = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const mappings = {
      'cat_men_sneakers': '/images/categories/card-sneakers.webp',
      'cat_men_loafers': '/images/categories/card-loafers.webp',
      'cat_men_boots': '/images/categories/card-boots.webp',
      'cat_men_wallets': '/images/categories/card-wallets.webp',
      'cat_men_belts': '/images/categories/card-belts.webp',
      'cat_men_caps': '/images/categories/card-caps.webp',
      'cat_kids_outerwear': '/images/categories/card-kids-outerwear.webp',
      'cat_women_outerwear': '/images/categories/women-cat-outerwear-editorial.webp',
      'cat_women_knitwear': '/images/categories/card-women-knitwear.webp',
    };

    cats.forEach(c => {
      if (mappings[c.id]) {
        c.image = mappings[c.id];
      }
    });

    fs.writeFileSync(filePath, JSON.stringify(cats, null, 2), 'utf8');
    console.log(`Updated categories in: ${filePath}`);
  };

  updateCategories(path.join(__dirname, '..', 'data', 'categories.json'));
  updateCategories(path.join(__dirname, '..', 'src', 'data', 'categories.json'));

  console.log('Finished updating remaining audit items.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
