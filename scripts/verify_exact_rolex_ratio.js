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
  
  // 1. Desktop 1440x950
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2200));

  await page.evaluate(() => window.scrollTo({ top: 560, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'verify_exact_3_5_ratio_1440.png') });
  console.log('Saved verify_exact_3_5_ratio_1440.png');

  // 2. Exact resolution of user screenshot: 1024x575
  await page.setViewport({ width: 1024, height: 575 });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(artifactDir, 'verify_exact_3_5_ratio_1024x575.png') });
  console.log('Saved verify_exact_3_5_ratio_1024x575.png');

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
