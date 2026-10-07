const puppeteer = require('puppeteer-core');
const fs = require('fs');

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];

const executablePath = edgePaths.find(p => fs.existsSync(p));

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/sale', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const info = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="Desert Ruins Landscape"]');
    if (!img) return { error: 'img not found' };
    const cs = window.getComputedStyle(img);
    const parentCs = window.getComputedStyle(img.parentElement);
    return {
      src: img.currentSrc || img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      objectPosition: cs.objectPosition,
      imgOpacity: cs.opacity,
      parentOpacity: parentCs.opacity,
      parentTransform: parentCs.transform,
      rect: img.getBoundingClientRect()
    };
  });

  console.log('IMG INFO:', info);
  await browser.close();
}

run().catch(console.error);
