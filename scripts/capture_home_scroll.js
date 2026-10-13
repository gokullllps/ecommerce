const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\c9d296ec-8eeb-4794-a40b-51f74b4a0389';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2500));

  await page.screenshot({ path: path.join(artifactDir, 'home_scroll_000.png') });

  for (const scrollY of [400, 800, 1200, 1600, 2200, 2800, 3400]) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(artifactDir, `home_scroll_${scrollY}.png`) });
  }

  await browser.close();
  console.log('Homepage scroll screenshots captured!');
}

run().catch(console.error);
