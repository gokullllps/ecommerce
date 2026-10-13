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

  console.log('Testing Forward Scroll...');
  // 1. Initial load
  await page.screenshot({ path: path.join(artifactDir, 'seq_newin_01_hero.png') });

  // 2. 3 cards over blurred hero
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'seq_newin_02_cards.png') });

  // 3. New In directly below Hero
  await page.evaluate(() => window.scrollTo({ top: 1600, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'seq_newin_03_newin.png') });

  // 4. Categories section below New In
  await page.evaluate(() => window.scrollTo({ top: 2500, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'seq_newin_04_categories.png') });

  console.log('Testing Reverse Scroll...');
  // 5. Reverse back to cards
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'seq_newin_05_reverse_cards.png') });

  // 6. Reverse back to hero top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'seq_newin_06_reverse_hero.png') });

  await browser.close();
  console.log('Verification finished successfully!');
}

run().catch(console.error);
