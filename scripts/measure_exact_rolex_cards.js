const puppeteer = require('puppeteer-core');
const fs = require('fs');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const imgPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\c9d296ec-8eeb-4794-a40b-51f74b4a0389\\.user_uploaded\\media_1791872484804.png';

async function findCards() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' });
  const page = await browser.newPage();
  const b64 = fs.readFileSync(imgPath).toString('base64');
  
  await page.setContent(`
    <!DOCTYPE html>
    <html><body>
      <img id="img" src="data:image/png;base64,${b64}" />
      <canvas id="c"></canvas>
    </body></html>
  `);
  
  const cards = await page.evaluate(() => {
    const img = document.getElementById('img');
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // In this image, background between cards is very dark (#0d0d0d or black)
    // Cards have rounded corners.
    // Let's sample along horizontal line y = 300
    const row = ctx.getImageData(0, 300, canvas.width, 1).data;
    
    // Print colors across x
    const segments = [];
    let inCard = false;
    let startX = 0;
    
    for (let x = 0; x < canvas.width; x++) {
      const idx = x * 4;
      const r = row[idx], g = row[idx+1], b = row[idx+2];
      const brightness = (r + g + b) / 3;
      
      // Background between cards is black/near-black (< 25)
      const isCardPixel = brightness > 25;
      
      if (!inCard && isCardPixel) {
        inCard = true;
        startX = x;
      } else if (inCard && !isCardPixel) {
        inCard = false;
        segments.push({ startX, endX: x - 1, width: x - startX });
      }
    }
    if (inCard) {
      segments.push({ startX, endX: canvas.width - 1, width: canvas.width - startX });
    }
    
    // Top and bottom of cards
    // Sample vertical line at center of segment 0
    let topY = 0, botY = canvas.height;
    if (segments.length > 0) {
      const midX = Math.round((segments[0].startX + segments[0].endX) / 2);
      const col = ctx.getImageData(midX, 0, 1, canvas.height).data;
      for (let y = 50; y < canvas.height; y++) {
        const idx = y * 4;
        const b = (col[idx] + col[idx+1] + col[idx+2]) / 3;
        if (b > 25) {
          topY = y;
          break;
        }
      }
      for (let y = canvas.height - 1; y > topY; y--) {
        const idx = y * 4;
        const b = (col[idx] + col[idx+1] + col[idx+2]) / 3;
        if (b > 25) {
          botY = y;
          break;
        }
      }
    }
    
    return {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      segments,
      topY,
      botY,
      cardHeight: botY - topY
    };
  });
  
  console.log('Detected Cards:', JSON.stringify(cards, null, 2));
  if (cards.segments && cards.segments.length >= 3) {
    cards.segments.forEach((seg, i) => {
      console.log(`Card ${i + 1}: width=${seg.width}, height=${cards.cardHeight}, aspect=${(seg.width / cards.cardHeight).toFixed(3)} (${(cards.cardHeight / seg.width).toFixed(3)}:1)`);
    });
    for (let i = 0; i < cards.segments.length - 1; i++) {
      const gap = cards.segments[i + 1].startX - cards.segments[i].endX;
      console.log(`Gap between Card ${i + 1} and ${i + 2}: ${gap}px`);
    }
  }
  await browser.close();
}

findCards().catch(console.error);
