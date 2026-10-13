const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1200']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928';

  // 1. Screenshot Hero section (verify untouched PABLO wordmark)
  const heroPath = path.join(artifactDir, 'final_verify_hero_pablo.png');
  await page.screenshot({ path: heroPath });
  console.log('Hero screenshot saved to:', heroPath);

  // 2. Screenshot New Arrivals section (verify exact Image 2 typography match)
  await page.evaluate(() => {
    const el = document.querySelector('#new-arrivals');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1500));
  const newArrivalsPath = path.join(artifactDir, 'final_verify_new_arrivals.png');
  const newArrivalsEl = await page.$('#new-arrivals');
  if (newArrivalsEl) {
    await newArrivalsEl.screenshot({ path: newArrivalsPath });
  } else {
    await page.screenshot({ path: newArrivalsPath });
  }
  console.log('New Arrivals screenshot saved to:', newArrivalsPath);

  // 3. Screenshot Bestsellers section
  await page.evaluate(() => {
    const el = document.querySelector('#bestsellers');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1500));
  const bestsellersPath = path.join(artifactDir, 'final_verify_bestsellers.png');
  const bestsellersEl = await page.$('#bestsellers');
  if (bestsellersEl) {
    await bestsellersEl.screenshot({ path: bestsellersPath });
  }
  console.log('Bestsellers screenshot saved to:', bestsellersPath);

  // 4. Screenshot Categories section
  await page.evaluate(() => {
    const el = document.querySelector('#categories');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1500));
  const categoriesPath = path.join(artifactDir, 'final_verify_categories.png');
  const categoriesEl = await page.$('#categories');
  if (categoriesEl) {
    await categoriesEl.screenshot({ path: categoriesPath });
  }
  console.log('Categories screenshot saved to:', categoriesPath);

  await browser.close();
}

main().catch(console.error);
