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

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. TEST /men
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('Testing /men...');
  await page.goto('http://localhost:3000/men', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2200));

  // Men 0: Initial Hero
  await page.screenshot({ path: path.join(artifactDir, 'test_men_01_initial_hero.png') });
  console.log('Saved test_men_01_initial_hero.png');

  // Men 1: Mid-Scroll Cards Entering
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'test_men_02_cards_entering.png') });
  console.log('Saved test_men_02_cards_entering.png');

  // Men 2: Settled Cards over Blurred Hero
  await page.evaluate(() => window.scrollTo({ top: 650, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'test_men_03_cards_settled.png') });
  console.log('Saved test_men_03_cards_settled.png');

  // Men 3: Scrolled into Catalogue Grid
  await page.evaluate(() => window.scrollTo({ top: 1550, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'test_men_04_catalogue_grid.png') });
  console.log('Saved test_men_04_catalogue_grid.png');

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. TEST /women
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('Testing /women...');
  await page.goto('http://localhost:3000/women', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2200));

  // Women 0: Initial Hero
  await page.screenshot({ path: path.join(artifactDir, 'test_women_01_initial_hero.png') });
  console.log('Saved test_women_01_initial_hero.png');

  // Women 1: Mid-Scroll Cards Entering
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'test_women_02_cards_entering.png') });
  console.log('Saved test_women_02_cards_entering.png');

  // Women 2: Settled Cards over Blurred Hero
  await page.evaluate(() => window.scrollTo({ top: 650, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'test_women_03_cards_settled.png') });
  console.log('Saved test_women_03_cards_settled.png');

  // Women 3: Scrolled into Catalogue Grid
  await page.evaluate(() => window.scrollTo({ top: 1550, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'test_women_04_catalogue_grid.png') });
  console.log('Saved test_women_04_catalogue_grid.png');

  await browser.close();
  console.log('All tests completed successfully!');
}

main().catch(console.error);
