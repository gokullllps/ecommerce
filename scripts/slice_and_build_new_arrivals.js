const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

// Let's crop individual letters A and R directly from media_1791368574143.png
// and trace each letter individually!
// That way, we get 100.0% pure, isolated, perfect vector paths for A and R!

async function extractLetters() {
  const imgPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\.user_uploaded\\media_1791368574143.png';
  const meta = await sharp(imgPath).metadata();
  const width = meta.width;
  const height = meta.height;

  // Let's crop Letter A (first A with full left swan flourish)
  // In crop_amura.png, AMURA width was width * 0.8 (left: width * 0.1, top: height * 0.32, height: height * 0.22)
  // Pure A crop: avoid touching M on the right
  const cropBoxA = {
    left: Math.round(width * 0.1 + width * 0.8 * 0.02),
    top: Math.round(height * 0.32 + height * 0.22 * 0.15),
    width: Math.round(width * 0.8 * 0.225),
    height: Math.round(height * 0.22 * 0.70)
  };

  await sharp(imgPath).extract(cropBoxA).toFile('scripts/crop_letter_A.png');
  console.log('Cropped Letter A saved');

  // Pure R crop: avoid touching U on the left and A on the right
  const cropBoxR = {
    left: Math.round(width * 0.1 + width * 0.8 * 0.62),
    top: Math.round(height * 0.32 + height * 0.22 * 0.15),
    width: Math.round(width * 0.8 * 0.16),
    height: Math.round(height * 0.22 * 0.70)
  };


  await sharp(imgPath).extract(cropBoxR).toFile('scripts/crop_letter_R.png');
  console.log('Cropped Letter R saved');
}

extractLetters().catch(console.error);
