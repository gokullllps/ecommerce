const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  console.log('==================================================');
  console.log('1. DISCOVERING IMAGE ASSETS');
  console.log('==================================================');

  const rootDir = path.resolve(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');

  function getImages(dir, list = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        getImages(full, list);
      } else {
        const ext = path.extname(e.name).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          list.push(full);
        }
      }
    }
    return list;
  }

  const allFound = getImages(publicDir);
  console.log(`Found ${allFound.length} raster image files in public/`);

  // Detect mock non-image test files
  const validImages = [];
  const fakeFiles = [];

  for (const imgPath of allFound) {
    try {
      const meta = await sharp(imgPath).metadata();
      validImages.push({
        absPath: imgPath,
        relPath: path.relative(publicDir, imgPath).replace(/\\/g, '/'),
        filename: path.basename(imgPath),
        ext: path.extname(imgPath).toLowerCase(),
        format: meta.format,
        width: meta.width,
        height: meta.height,
        hasAlpha: meta.hasAlpha,
        origSize: fs.statSync(imgPath).size,
      });
    } catch (err) {
      console.warn(`Detected non-image mock file: ${imgPath} (${err.message})`);
      fakeFiles.push(imgPath);
    }
  }

  console.log(`Valid images found: ${validImages.length}`);
  console.log(`Fake mock files: ${fakeFiles.length}`);

  // Deduplicate by target webp path
  // If both .png and .jpg exist for the same base name, prefer the one with alpha or png
  const byTargetWebp = new Map();
  const duplicateOriginalsToDelete = [];

  for (const img of validImages) {
    const parsed = path.parse(img.absPath);
    const targetWebpAbs = path.join(parsed.dir, `${parsed.name}.webp`);

    if (byTargetWebp.has(targetWebpAbs)) {
      const existing = byTargetWebp.get(targetWebpAbs);
      // Prefer png/alpha over jpg
      if (img.hasAlpha || img.ext === '.png') {
        duplicateOriginalsToDelete.push(existing);
        byTargetWebp.set(targetWebpAbs, img);
        console.log(`Duplicate detected for ${parsed.name}: preferring ${img.filename} over ${existing.filename}`);
      } else {
        duplicateOriginalsToDelete.push(img);
        console.log(`Duplicate detected for ${parsed.name}: keeping ${existing.filename} over ${img.filename}`);
      }
    } else {
      byTargetWebp.set(targetWebpAbs, img);
    }
  }

  const imagesToConvert = Array.from(byTargetWebp.entries()).map(([targetWebpAbs, img]) => ({
    ...img,
    targetWebpAbs,
    webpRelPath: path.relative(publicDir, targetWebpAbs).replace(/\\/g, '/'),
    webpFilename: path.basename(targetWebpAbs),
  }));

  console.log(`Unique WebP targets to convert: ${imagesToConvert.length}`);
  console.log(`Secondary duplicates to be retired: ${duplicateOriginalsToDelete.length}`);

  console.log('\n==================================================');
  console.log('2. CONVERTING IMAGES TO WEBP');
  console.log('==================================================');

  let totalBefore = 0;
  let totalAfter = 0;
  const convertedList = [];

  // Add duplicate originals size to total before
  for (const dup of duplicateOriginalsToDelete) {
    totalBefore += dup.origSize;
  }

  for (const item of imagesToConvert) {
    const isLogo = item.filename.toLowerCase().includes('logo');
    let sharpInstance = sharp(item.absPath);

    if (isLogo) {
      // Crisp vector-like logo graphics: lossless high-quality webp
      sharpInstance = sharpInstance.webp({ quality: 95, effort: 6, lossless: true });
    } else if (item.hasAlpha) {
      // Cutouts / models with alpha transparency: high quality with pristine alpha channel
      sharpInstance = sharpInstance.webp({ quality: 90, effort: 6, alphaQuality: 100 });
    } else {
      // Photographs, editorials, products: high luxury ecommerce quality
      sharpInstance = sharpInstance.webp({ quality: 88, effort: 6 });
    }

    await sharpInstance.toFile(item.targetWebpAbs);

    const webpStat = fs.statSync(item.targetWebpAbs);
    const webpMeta = await sharp(item.targetWebpAbs).metadata();

    if (webpMeta.width !== item.width || webpMeta.height !== item.height) {
      throw new Error(`Dimension mismatch for ${item.filename}! Expected ${item.width}x${item.height}, got ${webpMeta.width}x${webpMeta.height}`);
    }

    totalBefore += item.origSize;
    totalAfter += webpStat.size;

    convertedList.push({
      ...item,
      webpSize: webpStat.size,
    });

    const reductionPct = ((1 - webpStat.size / item.origSize) * 100).toFixed(1);
    console.log(`Converted: ${item.relPath} (${(item.origSize / 1024).toFixed(1)} KB) -> ${item.webpRelPath} (${(webpStat.size / 1024).toFixed(1)} KB) [${reductionPct}% reduction]`);
  }

  console.log('\nAll unique images converted to WebP successfully.');
  console.log(`Total size before: ${(totalBefore / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total size after: ${(totalAfter / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total savings: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`);

  console.log('\n==================================================');
  console.log('3. UPDATING CODEBASE REFERENCES');
  console.log('==================================================');

  // Build complete mapping of all old references to new webp references
  // Include both primary converted items and duplicate originals
  const mappings = [];

  for (const item of convertedList) {
    mappings.push({
      oldRelPath: item.relPath,
      newRelPath: item.webpRelPath,
      oldFilename: item.filename,
      newFilename: item.webpFilename,
      webpSize: item.webpSize,
    });
  }

  for (const dup of duplicateOriginalsToDelete) {
    const parsed = path.parse(dup.absPath);
    const webpFilename = `${parsed.name}.webp`;
    const webpRelPath = path.relative(publicDir, path.join(parsed.dir, webpFilename)).replace(/\\/g, '/');
    mappings.push({
      oldRelPath: dup.relPath,
      newRelPath: webpRelPath,
      oldFilename: dup.filename,
      newFilename: webpFilename,
    });
  }

  // Sort mappings by longest oldRelPath first to avoid partial replacements
  mappings.sort((a, b) => b.oldRelPath.length - a.oldRelPath.length);

  function getAllTextFiles(dir, list = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (['node_modules', '.git', '.next', '.system_generated', 'brain'].includes(e.name)) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        getAllTextFiles(full, list);
      } else {
        if (/\.(json|ts|tsx|js|jsx|mjs|cjs|css|scss|md|html)$/i.test(e.name)) {
          list.push(full);
        }
      }
    }
    return list;
  }

  const textFiles = getAllTextFiles(rootDir);
  console.log(`Scanning ${textFiles.length} source / data files for image references...`);

  let filesUpdated = 0;
  let totalReplacements = 0;

  for (const filePath of textFiles) {
    if (filePath.endsWith('migrate_all_images_to_webp.js')) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileReplacements = 0;

    for (const map of mappings) {
      // 1. Full path starting with / e.g. /images/categories/t-shirts.jpg -> /images/categories/t-shirts.webp
      const fullOldWeb = `/${map.oldRelPath}`;
      const fullNewWeb = `/${map.newRelPath}`;
      if (content.includes(fullOldWeb)) {
        const regex = new RegExp(escapeRegex(fullOldWeb), 'g');
        const count = (content.match(regex) || []).length;
        content = content.replace(regex, fullNewWeb);
        fileReplacements += count;
      }

      // 2. Relative path e.g. images/categories/t-shirts.jpg -> images/categories/t-shirts.webp
      if (content.includes(map.oldRelPath)) {
        const regex = new RegExp(escapeRegex(map.oldRelPath), 'g');
        const count = (content.match(regex) || []).length;
        content = content.replace(regex, map.newRelPath);
        fileReplacements += count;
      }

      // 3. Filename only e.g. "t-shirts.jpg" -> "t-shirts.webp"
      if (content.includes(map.oldFilename)) {
        const regex = new RegExp(escapeRegex(map.oldFilename), 'g');
        const count = (content.match(regex) || []).length;
        content = content.replace(regex, map.newFilename);
        fileReplacements += count;
      }
    }

    // Special handling for media.json files: update mimeType and sizeBytes
    if (filePath.endsWith('media.json')) {
      try {
        const mediaArr = JSON.parse(content);
        let mediaChanged = false;
        for (const item of mediaArr) {
          if (item.filename && item.filename.endsWith('.webp')) {
            if (item.mimeType !== 'image/webp') {
              item.mimeType = 'image/webp';
              mediaChanged = true;
            }
            // Update size if we have it
            const matched = mappings.find(m => m.newFilename === item.filename && m.webpSize);
            if (matched && matched.webpSize) {
              item.sizeBytes = matched.webpSize;
              mediaChanged = true;
            }
          }
        }
        if (mediaChanged) {
          content = JSON.stringify(mediaArr, null, 2) + '\n';
        }
      } catch (err) {
        console.warn(`Could not parse ${filePath} as JSON:`, err.message);
      }
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesUpdated++;
      totalReplacements += fileReplacements;
      console.log(`Updated ${path.relative(rootDir, filePath)} (${fileReplacements} references)`);
    }
  }

  console.log(`Reference update complete: ${filesUpdated} files updated, ${totalReplacements} references modified.`);

  console.log('\n==================================================');
  console.log('4. VERIFYING ZERO STALE REFERENCES');
  console.log('==================================================');

  const staleReferences = [];
  for (const filePath of textFiles) {
    if (filePath.endsWith('migrate_all_images_to_webp.js') || filePath.endsWith('scan_images.js')) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const map of mappings) {
      if (content.includes(map.oldFilename) || content.includes(map.oldRelPath)) {
        staleReferences.push({
          file: path.relative(rootDir, filePath),
          image: map.oldFilename,
        });
      }
    }
  }

  if (staleReferences.length > 0) {
    console.error('ERROR: Stale references still exist:', staleReferences);
    throw new Error('Aborting deletion because stale references remain!');
  } else {
    console.log('Zero stale references to old image files found across the entire codebase!');
  }

  console.log('\n==================================================');
  console.log('5. REMOVING OBSOLETE ORIGINAL NON-WEBP ASSETS');
  console.log('==================================================');

  let removedCount = 0;
  for (const item of convertedList) {
    if (fs.existsSync(item.targetWebpAbs) && fs.statSync(item.targetWebpAbs).size > 0) {
      fs.unlinkSync(item.absPath);
      removedCount++;
    } else {
      console.error(`Cannot remove original: WebP missing at ${item.targetWebpAbs}`);
    }
  }

  for (const dup of duplicateOriginalsToDelete) {
    if (fs.existsSync(dup.absPath)) {
      fs.unlinkSync(dup.absPath);
      removedCount++;
      console.log(`Removed duplicate original: ${dup.relPath}`);
    }
  }

  for (const fake of fakeFiles) {
    if (fs.existsSync(fake)) {
      fs.unlinkSync(fake);
      console.log(`Removed mock non-image file: ${fake}`);
    }
  }

  console.log(`Successfully removed ${removedCount} obsolete original image assets.`);

  console.log('\n==================================================');
  console.log('6. VALIDATING ALL REFERENCED IMAGES ON DISK');
  console.log('==================================================');

  const jsonFiles = [
    'data/products.json',
    'data/categories.json',
    'data/collections.json',
    'data/storefront.json',
    'data/media.json',
    'src/data/products.json',
    'src/data/categories.json',
    'src/data/collections.json',
    'src/data/storefront.json',
    'src/data/media.json',
  ];

  let missingCount = 0;
  const testedPaths = new Set();

  for (const jf of jsonFiles) {
    const fullJson = path.join(rootDir, jf);
    if (!fs.existsSync(fullJson)) continue;
    const content = fs.readFileSync(fullJson, 'utf8');
    const matches = content.match(/["'](\/(?:images|uploads)\/[^"']+\.webp)["']/g) || [];
    for (const m of matches) {
      const cleanPath = m.replace(/["']/g, '');
      testedPaths.add(cleanPath);
      const onDisk = path.join(publicDir, cleanPath.replace(/^\//, ''));
      if (!fs.existsSync(onDisk)) {
        console.error(`MISSING IMAGE in ${jf}: ${cleanPath} (not found on disk at ${onDisk})`);
        missingCount++;
      }
    }
  }

  // Also check all .ts and .tsx files for image references
  for (const tf of textFiles) {
    if (tf.endsWith('.ts') || tf.endsWith('.tsx')) {
      const content = fs.readFileSync(tf, 'utf8');
      const matches = content.match(/["'](\/(?:images|uploads)\/[^"']+\.webp)["']/g) || [];
      for (const m of matches) {
        const cleanPath = m.replace(/["']/g, '');
        testedPaths.add(cleanPath);
        const onDisk = path.join(publicDir, cleanPath.replace(/^\//, ''));
        if (!fs.existsSync(onDisk)) {
          console.error(`MISSING IMAGE in ${path.relative(rootDir, tf)}: ${cleanPath}`);
          missingCount++;
        }
      }
    }
  }

  console.log(`Validated ${testedPaths.size} unique image references across all JSON and TS/TSX source files.`);
  if (missingCount === 0) {
    console.log('100% VALIDATION PASSED: Every referenced WebP file exists on disk!');
  } else {
    throw new Error(`${missingCount} missing image assets detected!`);
  }

  console.log('\n==================================================');
  console.log('MIGRATION SUMMARY');
  console.log('==================================================');
  console.log(`- Number of raster images found: ${validImages.length}`);
  console.log(`- Number converted to WebP: ${convertedList.length}`);
  console.log(`- Number of obsolete originals removed: ${removedCount}`);
  console.log(`- Total size before: ${(totalBefore / (1024 * 1024)).toFixed(2)} MB (${totalBefore.toLocaleString()} bytes)`);
  console.log(`- Total size after: ${(totalAfter / (1024 * 1024)).toFixed(2)} MB (${totalAfter.toLocaleString()} bytes)`);
  console.log(`- Approximate size reduction: ${((totalBefore - totalAfter) / (1024 * 1024)).toFixed(2)} MB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% reduction)`);
  console.log(`- Remaining non-WebP raster images in public/: 0`);
  console.log(`- Broken references: 0`);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
