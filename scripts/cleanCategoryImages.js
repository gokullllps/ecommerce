const sharp = require('sharp');
const path = require('path');

async function cleanImage(filename) {
  const input = path.resolve(__dirname, '../public/images/categories', filename);
  const meta = await sharp(input).metadata();
  const width = meta.width;
  const height = meta.height;

  // The text starts around y=300 and goes to y=380.
  // Smoothly blend to black from y=285 to y=315, and solid black from y=315 to bottom.
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="darken" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a0a0a" stop-opacity="0" />
          <stop offset="30%" stop-color="#0a0a0a" stop-opacity="0.8" />
          <stop offset="50%" stop-color="#0a0a0a" stop-opacity="1" />
          <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="275" width="${width}" height="${height - 275}" fill="url(#darken)" />
    </svg>
  `;

  const cleanedBuffer = await sharp(input)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 95 })
    .toBuffer();

  const tempFile = input + '.tmp.jpg';
  const fs = require('fs');
  fs.writeFileSync(tempFile, cleanedBuffer);
  fs.renameSync(tempFile, input);
  console.log('Cleaned:', filename);
}

async function run() {
  const files = [
    'women-cat-tops.webp',
    'women-cat-bottoms.webp',
    'women-cat-footwear.webp',
    'women-cat-accessories.webp',
  ];
  for (const f of files) {
    await cleanImage(f);
  }
}

run().catch(console.error);
