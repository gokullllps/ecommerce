const sharp = require('sharp');
const path = require('path');

async function cropAmura() {
  const imgPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\.user_uploaded\\media_1791368574143.png';
  const outPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\crop_amura.png';
  
  // The image is around 800x1000 or similar. Let's get metadata first.
  const meta = await sharp(imgPath).metadata();
  console.log('Metadata:', meta);
  
  // AMURA is in the center, around y: 30% to 50%
  const width = meta.width;
  const height = meta.height;
  
  await sharp(imgPath)
    .extract({
      left: Math.round(width * 0.1),
      top: Math.round(height * 0.32),
      width: Math.round(width * 0.8),
      height: Math.round(height * 0.22)
    })
    .toFile(outPath);
    
  console.log('Cropped AMURA saved to', outPath);
}

cropAmura().catch(console.error);
