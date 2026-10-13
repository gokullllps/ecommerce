const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\c9d296ec-8eeb-4794-a40b-51f74b4a0389';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runVerification() {
  console.log('Launching browser for discrete card stages verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. TEST /women (Verifying titles TOPS, BOTTOMS, FOOTWEAR, ACCESSORIES + No counter)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('Navigating to http://localhost:3000/women...');
  await page.goto('http://localhost:3000/women', { waitUntil: 'networkidle2', timeout: 35000 });
  await sleep(2500);

  // State 0: Initial Hero at Scroll = 0
  console.log('Women Step 0: Initial Hero...');
  await page.screenshot({ path: path.join(artifactDir, 'step_women_00_hero.png') });

  // State 1: Scroll step 1 -> Card 0 TOPS
  console.log('Women Step 1: Scroll to 200px (Card 0 TOPS)...');
  await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'instant' }));
  await sleep(400);
  await page.screenshot({ path: path.join(artifactDir, 'step_women_01_card0_tops.png') });

  // State 2: Scroll step 2 -> Card 1 BOTTOMS
  console.log('Women Step 2: Scroll to 530px (Card 1 BOTTOMS)...');
  await page.evaluate(() => window.scrollTo({ top: 530, behavior: 'instant' }));
  await sleep(400);
  await page.screenshot({ path: path.join(artifactDir, 'step_women_02_card1_bottoms.png') });

  // State 3: Scroll step 3 -> Card 2 FOOTWEAR
  console.log('Women Step 3: Scroll to 860px (Card 2 FOOTWEAR)...');
  await page.evaluate(() => window.scrollTo({ top: 860, behavior: 'instant' }));
  await sleep(400);
  await page.screenshot({ path: path.join(artifactDir, 'step_women_03_card2_footwear.png') });

  // State 4: Scroll step 4 -> Card 3 ACCESSORIES
  console.log('Women Step 4: Scroll to 1100px (Card 3 ACCESSORIES)...');
  await page.evaluate(() => window.scrollTo({ top: 1100, behavior: 'instant' }));
  await sleep(400);
  await page.screenshot({ path: path.join(artifactDir, 'step_women_04_card3_accessories.png') });

  // State 5: Scroll step 5 -> Release into Catalogue
  console.log('Women Step 5: Scroll to 1500px (Catalogue Grid)...');
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
  await sleep(500);
  await page.screenshot({ path: path.join(artifactDir, 'step_women_05_catalogue.png') });

  // State 6: Reverse scroll back to Card 1
  console.log('Women Step 6: Reverse scroll back to 530px (Card 1 BOTTOMS)...');
  await page.evaluate(() => window.scrollTo({ top: 530, behavior: 'instant' }));
  await sleep(400);
  await page.screenshot({ path: path.join(artifactDir, 'step_women_06_reverse_card1.png') });

  // State 7: Reverse scroll back to 0
  console.log('Women Step 7: Reverse scroll back to 0 (Hero pristine)...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await sleep(400);
  await page.screenshot({ path: path.join(artifactDir, 'step_women_07_reverse_hero.png') });

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. TEST /men (Verifying SHIRTS, TROUSERS, FOOTWEAR, ACCESSORIES + No counter)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('Navigating to http://localhost:3000/men...');
  await page.goto('http://localhost:3000/men', { waitUntil: 'networkidle2', timeout: 35000 });
  await sleep(2500);

  // Men Step 0: Initial Hero
  console.log('Men Step 0: Initial Hero...');
  await page.screenshot({ path: path.join(artifactDir, 'step_men_00_hero.png') });

  // Men Step 1: Card 0 SHIRTS
  console.log('Men Step 1: Scroll to 200px (Card 0 SHIRTS)...');
  await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'instant' }));
  await sleep(400);
  await page.screenshot({ path: path.join(artifactDir, 'step_men_01_card0_shirts.png') });

  // Men Step 2: Card 1 TROUSERS
  console.log('Men Step 2: Scroll to 530px (Card 1 TROUSERS)...');
  await page.evaluate(() => window.scrollTo({ top: 530, behavior: 'instant' }));
  await sleep(400);
  await page.screenshot({ path: path.join(artifactDir, 'step_men_02_card1_trousers.png') });

  // Men Step 3: Card 2 FOOTWEAR
  console.log('Men Step 3: Scroll to 860px (Card 2 FOOTWEAR)...');
  await page.evaluate(() => window.scrollTo({ top: 860, behavior: 'instant' }));
  await sleep(400);
  await page.screenshot({ path: path.join(artifactDir, 'step_men_03_card2_footwear.png') });

  // Men Step 4: Card 3 ACCESSORIES
  console.log('Men Step 4: Scroll to 1100px (Card 3 ACCESSORIES)...');
  await page.evaluate(() => window.scrollTo({ top: 1100, behavior: 'instant' }));
  await sleep(400);
  await page.screenshot({ path: path.join(artifactDir, 'step_men_04_card3_accessories.png') });

  // Men Step 5: Release into Catalogue
  console.log('Men Step 5: Scroll to 1500px (Catalogue Grid)...');
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
  await sleep(500);
  await page.screenshot({ path: path.join(artifactDir, 'step_men_05_catalogue.png') });

  await browser.close();
  console.log('Discrete stages verification completed successfully!');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
