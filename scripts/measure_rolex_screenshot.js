const puppeteer = require('puppeteer-core');
const fs = require('fs');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const imgPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\c9d296ec-8eeb-4794-a40b-51f74b4a0389\\.user_uploaded\\media_1791872484804.png';

async function measure() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' });
  const page = await browser.newPage();
  
  const b64 = fs.readFileSync(imgPath).toString('base64');
  const dataUrl = `data:image/png;base64,${b64}`;
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body>
        <img id="img" src="${dataUrl}" />
        <canvas id="c"></canvas>
      </body>
    </html>
  `);
  
  const result = await page.evaluate(() => {
    const img = document.getElementById('img');
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const w = canvas.width;
    const h = canvas.height;
    
    // Sample vertical line through Card 3 (Cyclops lens white card)
    const card3X = Math.round(w * 0.77);
    const col3 = ctx.getImageData(card3X, 0, 1, h).data;
    
    let topY = -1;
    let botY = -1;
    for (let y = 80; y < h - 10; y++) {
      const idx = y * 4;
      const r = col3[idx];
      const g = col3[idx + 1];
      const b = col3[idx + 2];
      if (r > 190 && g > 190 && b > 190) {
        if (topY === -1) topY = y;
        botY = y;
      }
    }
    
    // Sample horizontal line across mid of Card 3
    const midCardY = Math.round((topY + botY) / 2);
    const rowMid = ctx.getImageData(0, midCardY, w, 1).data;
    
    let card3Left = -1;
    let card3Right = -1;
    for (let x = Math.round(w * 0.5); x < w - 5; x++) {
      const idx = x * 4;
      const r = rowMid[idx];
      const g = rowMid[idx + 1];
      const b = rowMid[idx + 2];
      if (r > 190 && g > 190 && b > 190) {
        if (card3Left === -1) card3Left = x;
        card3Right = x;
      }
    }
    
    // Find gap between Card 2 and Card 3
    let gapLeft = -1;
    for (let x = card3Left - 1; x > 0; x--) {
      const idx = x * 4;
      const r = rowMid[idx];
      const g = rowMid[idx + 1];
      const b = rowMid[idx + 2];
      if (r < 50 && g < 50 && b < 50) {
        // dark gap
      } else {
        gapLeft = x;
        break;
      }
    }
    
    // Also find Card 1 (left) width
    // Card 1 has greyish green background. Let's find its left edge near x=50
    let card1Left = -1;
    let card1Right = -1;
    for (let x = 10; x < Math.round(w * 0.4); x++) {
      const idx = x * 4;
      const r = rowMid[idx];
      const g = rowMid[idx + 1];
      const b = rowMid[idx + 2];
      if (r > 40 || g > 40 || b > 40) {
        if (card1Left === -1) card1Left = x;
        card1Right = x;
      }
    }
    
    return {
      imageWidth: w,
      imageHeight: h,
      cardTopY: topY,
      cardBottomY: botY,
      cardHeight: botY - topY,
      card3Left,
      card3Right,
      card3Width: card3Right - card3Left,
      gapBetweenCard2And3: card3Left - gapLeft,
      card1Left,
      card1Right,
      card1Width: card1Right - card1Left
    };
  });
  
  console.log('RESULTS:', JSON.stringify(result, null, 2));
  console.log('CARD ASPECT RATIO (Width / Height):', (result.card3Width / result.cardHeight).toFixed(3));
  console.log('CARD ASPECT RATIO (Height / Width):', (result.cardHeight / result.card3Width).toFixed(3));
  console.log('FRACTION RATIO (e.g. 3/4 or 9/14 or ...):', `${result.card3Width} x ${result.cardHeight}`);
  console.log('GAP IN PIXELS:', result.gapBetweenCard2And3);
  console.log('IMAGE MARGIN LEFT:', result.card1Left);
  console.log('IMAGE MARGIN RIGHT:', result.imageWidth - result.card3Right);
  console.log('TOP MARGIN FROM BROWSER BAR:', result.cardTopY - 72); // approx browser bar
  console.log('BOTTOM MARGIN:', result.imageHeight - result.cardBottomY);
  
  await browser.close();
}

measure().catch(console.error);
