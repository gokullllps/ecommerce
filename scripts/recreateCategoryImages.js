const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const refPath = 'C:/Users/gokul/.gemini/antigravity-ide/brain/e9106997-e741-4901-bfed-767aeb21bee3/.user_uploaded/media_1790844665376.png';
const outDir = path.resolve(__dirname, '../public/images/categories');

async function run() {
  const { data, info } = await sharp(refPath).raw().toBuffer({ resolveWithObject: true });

  // 1. Detect card vertical bounds (starts ~y=878)
  const topY = 878;
  const bottomY = info.height - 1; // 1023
  const cardHeight = bottomY - topY + 1; // ~146px

  // 2. Detect card horizontal bounds at y = 920
  const cardsX = [];
  let inCard = false;
  let startX = 0;
  for (let x = 0; x < info.width; x++) {
    const idx = (920 * info.width + x) * info.channels;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    const isBeige = (r > 200 && g > 190 && b > 180);
    if (!isBeige && !inCard) {
      inCard = true;
      startX = x;
    } else if (isBeige && inCard) {
      inCard = false;
      cardsX.push({ left: startX, width: x - startX });
    }
  }
  if (inCard) cardsX.push({ left: startX, width: info.width - startX });
  const validCards = cardsX.filter(c => c.width > 50);
  console.log('Valid horizontal cards:', validCards);

  const cardFiles = [
    'women-category-tops.webp',
    'women-category-bottoms.webp',
    'women-category-footwear.webp',
    'women-category-accessories.webp',
  ];

  for (let i = 0; i < Math.min(validCards.length, 4); i++) {
    const c = validCards[i];
    const filename = cardFiles[i];

    // Crop card image accurately without any outer beige or top pill
    // Add 1px inset to avoid any border artifacts
    const left = c.left + 1;
    const width = c.width - 2;
    const top = topY + 1;
    const height = cardHeight - 2;

    const targetWidth = 312;
    const targetHeight = 396;

    const cropped = await sharp(refPath)
      .extract({ left, top, width, height })
      .resize(targetWidth, targetHeight, { kernel: 'lanczos3' })
      .toBuffer();

    // Darken the bottom where low-res text "TOPS / BOTTOMS / ..." was
    // The graphic ends above y=225. From y=225 to y=245 we fade smoothly to solid #080808.
    const svg = `
      <svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#080808" stop-opacity="0" />
            <stop offset="20%" stop-color="#080808" stop-opacity="0.85" />
            <stop offset="35%" stop-color="#080808" stop-opacity="1" />
            <stop offset="100%" stop-color="#080808" stop-opacity="1" />
          </linearGradient>
        </defs>
        <rect x="0" y="215" width="${targetWidth}" height="${targetHeight - 215}" fill="url(#bgFade)" />
      </svg>
    `;

    const finalBuffer = await sharp(cropped)
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .jpeg({ quality: 96 })
      .toBuffer();

    const dest = path.join(outDir, filename);
    fs.writeFileSync(dest, finalBuffer);
    console.log(`Saved pristine ${filename}: left=${left}, top=${top}, w=${width}, h=${height}`);
  }

  // 3. Intro thumbnail
  // Find exact intro thumbnail boundary around y=748
  const introSize = 168;
  const introCropped = await sharp(refPath)
    .extract({ left: 16, top: 748, width: 56, height: 56 })
    .resize(introSize, introSize, { kernel: 'lanczos3' })
    .jpeg({ quality: 96 })
    .toBuffer();

  fs.writeFileSync(path.join(outDir, 'women-collection-intro.webp'), introCropped);
  console.log('Saved pristine women-collection-intro.webp');
}

run().catch(console.error);
