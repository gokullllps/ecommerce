const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

async function extractMU() {
  const imgPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\.user_uploaded\\media_1791368574143.png';
  const meta = await sharp(imgPath).metadata();
  const width = meta.width;
  const height = meta.height;

  // Letter M
  const cropBoxM = {
    left: Math.round(width * 0.1 + width * 0.8 * 0.23),
    top: Math.round(height * 0.32 + height * 0.22 * 0.15),
    width: Math.round(width * 0.8 * 0.20),
    height: Math.round(height * 0.22 * 0.70)
  };
  await sharp(imgPath).extract(cropBoxM).toFile('scripts/crop_letter_M.png');

  // Letter U
  const cropBoxU = {
    left: Math.round(width * 0.1 + width * 0.8 * 0.42),
    top: Math.round(height * 0.32 + height * 0.22 * 0.15),
    width: Math.round(width * 0.8 * 0.20),
    height: Math.round(height * 0.22 * 0.70)
  };
  await sharp(imgPath).extract(cropBoxU).toFile('scripts/crop_letter_U.png');

  const params = { threshold: 180, turdSize: 1, optCurve: true, optTolerance: 0.1 };
  
  potrace.trace('scripts/crop_letter_M.png', params, (err, svgM) => {
    if (err) throw err;
    fs.writeFileSync('scripts/letter_M.svg', svgM);
    console.log('Letter M traced!');
  });

  potrace.trace('scripts/crop_letter_U.png', params, (err, svgU) => {
    if (err) throw err;
    fs.writeFileSync('scripts/letter_U.svg', svgU);
    console.log('Letter U traced!');
  });
}

extractMU().catch(console.error);
