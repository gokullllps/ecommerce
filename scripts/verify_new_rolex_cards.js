const puppeteer = require('puppeteer-core');
const path = require('path');

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
  await page.screenshot({ path: path.join(artifactDir, 'rolex_01_scroll_0.png') });
  console.log('Saved rolex_01_scroll_0.png');

  // 2. Staggered Entrance (scroll = 240px) - Card 1 up, Card 2 following, Card 3 entering
  await page.evaluate(() => window.scrollTo({ top: 240, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'rolex_02_staggered_entrance_240.png') });
  console.log('Saved rolex_02_staggered_entrance_240.png');

  // 3. Settled Large Cards (scroll = 560px) - All 3 tall cards filling viewport
  await page.evaluate(() => window.scrollTo({ top: 560, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'rolex_03_tall_cards_settled_560.png') });
  console.log('Saved rolex_03_tall_cards_settled_560.png');

  await browser.close();
  console.log('Verification done!');
}

main().catch(console.error);
