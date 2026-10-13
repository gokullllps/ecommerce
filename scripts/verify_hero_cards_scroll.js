const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\c9d296ec-8eeb-4794-a40b-51f74b4a0389';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2200));

  // 1. Initial Hero State (scroll = 0)
  await page.screenshot({ path: path.join(artifactDir, 'verify_01_hero_scroll_0.png') });
  console.log('Saved 01_hero_scroll_0.png');

  // 2. First Scroll (scroll = 120px) - check navbar appearance
  await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'verify_02_first_scroll_120.png') });
  console.log('Saved 02_first_scroll_120.png');

  // 3. Mid Scroll (scroll = 380px) - cards entering one by one smoothly
  await page.evaluate(() => window.scrollTo({ top: 380, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'verify_03_mid_scroll_380.png') });
  console.log('Saved 03_mid_scroll_380.png');

  // 4. Settled Cards (scroll = 650px) - all cards visible in one scroll, no Collections header
  await page.evaluate(() => window.scrollTo({ top: 650, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'verify_04_settled_cards_650.png') });
  console.log('Saved 04_settled_cards_650.png');

  await browser.close();
  console.log('All verification screenshots captured successfully!');
}

main().catch(console.error);
