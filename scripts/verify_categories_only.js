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
  await page.evaluate(() => {
    try {
      sessionStorage.setItem('pablo_intro_completed', 'true');
    } catch (e) {}
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('1. Checking Hero at top...');
  await page.screenshot({ path: path.join(artifactDir, 'cat_01_hero_untouched.png') });

  console.log('2. Scrolling to Categories section...');
  const catTop = await page.evaluate(() => {
    const el = document.getElementById('categories-scroll-container');
    return el ? el.offsetTop : 0;
  });
  console.log('Categories container offsetTop:', catTop);

  // Scroll to start of categories
  await page.evaluate((top) => window.scrollTo({ top: top + 100, behavior: 'instant' }), catTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'cat_02_categories_pinned_start.png') });

  // Scroll midway through categories
  await page.evaluate((top) => window.scrollTo({ top: top + 900, behavior: 'instant' }), catTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'cat_03_categories_pinned_mid.png') });

  // Scroll towards end of categories
  await page.evaluate((top) => window.scrollTo({ top: top + 1800, behavior: 'instant' }), catTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'cat_04_categories_pinned_late.png') });

  // Scroll past categories section
  await page.evaluate((top) => window.scrollTo({ top: top + 2600, behavior: 'instant' }), catTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'cat_05_past_categories.png') });

  console.log('3. Testing reverse scroll back up...');
  await page.evaluate((top) => window.scrollTo({ top: top + 900, behavior: 'instant' }), catTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'cat_06_reverse_categories.png') });

  // Reverse back to hero top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'cat_07_reverse_hero_top.png') });

  await browser.close();
  console.log('Categories section verification complete!');
}

run().catch(console.error);
