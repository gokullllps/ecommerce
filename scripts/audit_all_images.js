const fs = require('fs');
const path = require('path');

function checkFileExists(relPath) {
  if (!relPath.startsWith('/')) return false;
  const fullPath = path.join(__dirname, '..', 'public', relPath.slice(1));
  if (!fs.existsSync(fullPath)) return false;
  const stat = fs.statSync(fullPath);
  return stat.size > 0;
}

function runAudit() {
  console.log('=== PABLO COMPREHENSIVE IMAGE AUDIT ===\n');

  const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json'), 'utf8'));
  const collections = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'collections.json'), 'utf8'));
  const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'categories.json'), 'utf8'));

  console.log(`Auditing ${products.length} products...`);
  console.log(`Auditing ${collections.length} collections...`);
  console.log(`Auditing ${categories.length} categories...`);

  let missingFiles = [];
  let productPrimaryMap = new Map();
  let allProductImagesMap = new Map();
  let galleryShortfalls = [];

  // 1. Audit Products
  products.forEach((p, index) => {
    // Check primary image
    if (!p.primaryImage) {
      missingFiles.push(`Product ${p.id} (${p.name}) has no primaryImage`);
    } else {
      if (!checkFileExists(p.primaryImage)) {
        missingFiles.push(`Product ${p.id} missing file: ${p.primaryImage}`);
      }
      if (!productPrimaryMap.has(p.primaryImage)) {
        productPrimaryMap.set(p.primaryImage, []);
      }
      productPrimaryMap.get(p.primaryImage).push({ id: p.id, name: p.name });
    }

    // Check gallery
    if (!p.images || p.images.length < 4) {
      galleryShortfalls.push(`Product ${p.id} (${p.name}) has only ${p.images?.length || 0} images in gallery (expected >= 4)`);
    }

    const seenInProduct = new Set();
    (p.images || []).forEach((img) => {
      const url = typeof img === 'string' ? img : img.url;
      if (!url) return;

      if (!checkFileExists(url)) {
        missingFiles.push(`Product ${p.id} gallery image missing file: ${url}`);
      }

      if (seenInProduct.has(url)) {
        // Repeated image within same product's own gallery
        console.warn(`Product ${p.id} repeats image ${url} within its own gallery!`);
      }
      seenInProduct.add(url);

      if (!allProductImagesMap.has(url)) {
        allProductImagesMap.set(url, []);
      }
      allProductImagesMap.get(url).push(p.id);
    });
  });

  // Check duplicate primary images across different products
  let duplicatePrimaryCount = 0;
  for (const [url, prods] of productPrimaryMap.entries()) {
    if (prods.length > 1) {
      duplicatePrimaryCount++;
      console.error(`DUPLICATE PRIMARY IMAGE: ${url} used in ${prods.map(x => `${x.id} (${x.name})`).join(', ')}`);
    }
  }

  // Check duplicate gallery images across different products
  let crossProductDuplicateCount = 0;
  for (const [url, prodIds] of allProductImagesMap.entries()) {
    const uniqueIds = Array.from(new Set(prodIds));
    if (uniqueIds.length > 1) {
      crossProductDuplicateCount++;
      console.error(`CROSS-PRODUCT IMAGE OVERLAP: ${url} used in ${uniqueIds.join(', ')}`);
    }
  }

  // 2. Audit Collections
  let collectionBannersMap = new Map();
  collections.forEach((c) => {
    const banner = c.bannerImage || c.heroImage || c.image;
    if (banner) {
      if (!checkFileExists(banner)) {
        missingFiles.push(`Collection ${c.id} missing banner file: ${banner}`);
      }
      if (!collectionBannersMap.has(banner)) collectionBannersMap.set(banner, []);
      collectionBannersMap.get(banner).push(c.id);

      // Check if banner overlaps with any product image
      if (allProductImagesMap.has(banner)) {
        console.error(`COLLECTION BANNER OVERLAPS WITH PRODUCT: ${banner} used in collection ${c.id} and product ${allProductImagesMap.get(banner).join(', ')}`);
      }
    }
  });

  let duplicateCollectionBanners = 0;
  for (const [url, collIds] of collectionBannersMap.entries()) {
    if (collIds.length > 1) {
      duplicateCollectionBanners++;
      console.error(`DUPLICATE COLLECTION BANNER: ${url} used in collections ${collIds.join(', ')}`);
    }
  }

  // 3. Audit Categories
  let categoryImagesMap = new Map();
  categories.forEach((cat) => {
    const img = cat.image;
    if (img) {
      if (!checkFileExists(img)) {
        missingFiles.push(`Category ${cat.id} missing image file: ${img}`);
      }
      if (!categoryImagesMap.has(img)) categoryImagesMap.set(img, []);
      categoryImagesMap.get(img).push(cat.id);

      if (allProductImagesMap.has(img)) {
        console.error(`CATEGORY IMAGE OVERLAPS WITH PRODUCT: ${img} used in category ${cat.id} and product ${allProductImagesMap.get(img).join(', ')}`);
      }
    }
  });

  let duplicateCategoryImages = 0;
  for (const [url, catIds] of categoryImagesMap.entries()) {
    if (catIds.length > 1) {
      duplicateCategoryImages++;
      console.error(`DUPLICATE CATEGORY IMAGE: ${url} used in categories ${catIds.join(', ')}`);
    }
  }

  // Summary
  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Total Products: ${products.length}`);
  console.log(`Total Unique Product Images: ${allProductImagesMap.size}`);
  console.log(`Duplicate Primary Images across different products: ${duplicatePrimaryCount}`);
  console.log(`Cross-product image overlaps: ${crossProductDuplicateCount}`);
  console.log(`Missing or 0-byte files: ${missingFiles.length}`);
  console.log(`Gallery shortfalls (< 4 images): ${galleryShortfalls.length}`);
  console.log(`Duplicate Collection Banners: ${duplicateCollectionBanners}`);
  console.log(`Duplicate Category Images: ${duplicateCategoryImages}`);

  if (missingFiles.length > 0) {
    console.log('\nMissing Files details:');
    missingFiles.forEach(f => console.log(' - ' + f));
  }
  if (galleryShortfalls.length > 0) {
    console.log('\nGallery shortfalls details:');
    galleryShortfalls.forEach(s => console.log(' - ' + s));
  }

  if (
    duplicatePrimaryCount === 0 &&
    crossProductDuplicateCount === 0 &&
    missingFiles.length === 0 &&
    galleryShortfalls.length === 0 &&
    duplicateCollectionBanners === 0 &&
    duplicateCategoryImages === 0
  ) {
    console.log('\n>>> AUDIT PASSED 100%! ZERO DUPLICATES, ZERO BROKEN IMAGES, FULL 4-VIEW GALLERIES EVERYWHERE. <<<');
  } else {
    console.error('\n>>> AUDIT FOUND ISSUES TO FIX! <<<');
    process.exit(1);
  }
}

runAudit();
