const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\260b2cc8-09de-4259-a363-0e741c07b655';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 850 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Initial State (scrollY = 0): Female model + exact text + transparent navbar at top
  const initialNavState = await page.evaluate(() => {
    const header = document.querySelector('header');
    const heroImg = document.querySelector('img[src*="woman-main-hero"]');
    return {
      headerVisible: header ? window.getComputedStyle(header).opacity : null,
      headerTransform: header ? window.getComputedStyle(header).transform : null,
      femaleModelFound: Boolean(heroImg)
    };
  });
  console.log('1. Initial State (scrollY = 0):', initialNavState);
  await page.screenshot({ path: path.join(artifactDir, 'verify_01_hero_scroll_0_female.png') });

  // 2. Scroll to 350px (inside Hero page): Navbar should NOT appear
  await page.evaluate(() => window.scrollTo({ top: 350, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 450));
  const scroll350NavState = await page.evaluate(() => {
    const header = document.querySelector('header');
    return {
      scrollY: window.scrollY,
      headerOpacity: header ? window.getComputedStyle(header).opacity : null,
      headerPointerEvents: header ? window.getComputedStyle(header).pointerEvents : null,
      headerTransform: header ? window.getComputedStyle(header).transform : null
    };
  });
  console.log('2. Inside Hero (scrollY = 350):', scroll350NavState);
  await page.screenshot({ path: path.join(artifactDir, 'verify_02_hero_scroll_350_navbar_hidden.png') });

  // 3. Scroll to 700px (still inside Hero page cards animation): Navbar should NOT appear
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 450));
  const scroll700NavState = await page.evaluate(() => {
    const header = document.querySelector('header');
    return {
      scrollY: window.scrollY,
      headerOpacity: header ? window.getComputedStyle(header).opacity : null,
      headerPointerEvents: header ? window.getComputedStyle(header).pointerEvents : null,
      headerTransform: header ? window.getComputedStyle(header).transform : null
    };
  });
  console.log('3. Inside Hero (scrollY = 700):', scroll700NavState);
  await page.screenshot({ path: path.join(artifactDir, 'verify_03_hero_scroll_700_navbar_hidden.png') });

  // 4. Scroll to 1500px (after scrolling down from hero page): Navbar SHOULD APPEAR!
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 550));
  const scroll1500NavState = await page.evaluate(() => {
    const header = document.querySelector('header');
    return {
      scrollY: window.scrollY,
      headerOpacity: header ? window.getComputedStyle(header).opacity : null,
      headerBg: header ? window.getComputedStyle(header).backgroundColor : null,
      headerTransform: header ? window.getComputedStyle(header).transform : null
    };
  });
  console.log('4. Past Hero (scrollY = 1500, New In / Categories):', scroll1500NavState);
  await page.screenshot({ path: path.join(artifactDir, 'verify_04_past_hero_navbar_appeared.png') });

  // 5. Scroll to Categories Section (~2100px)
  await page.evaluate(() => window.scrollTo({ top: 2100, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 450));
  await page.screenshot({ path: path.join(artifactDir, 'verify_05_categories_navbar_present.png') });

  // 6. Scroll back to top (scrollY = 0): Navbar restored to transparent overlay
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 450));
  const backToTopNavState = await page.evaluate(() => {
    const header = document.querySelector('header');
    return {
      scrollY: window.scrollY,
      headerOpacity: header ? window.getComputedStyle(header).opacity : null,
      headerBg: header ? window.getComputedStyle(header).backgroundColor : null
    };
  });
  console.log('6. Back to Top (scrollY = 0):', backToTopNavState);
  await page.screenshot({ path: path.join(artifactDir, 'verify_06_back_to_top_navbar_restored.png') });

  await browser.close();
  console.log('Verification completed successfully!');
}

main().catch(console.error);
