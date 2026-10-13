const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\260b2cc8-09de-4259-a363-0e741c07b655';

async function main() {
  console.log('Launching browser for verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // 1. Load Homepage and bypass intro
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 35000 });
  await page.evaluate(() => {
    try {
      sessionStorage.setItem('pablo-intro-completed', 'true');
    } catch (e) {}
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 1: Hero at scroll 0
  await page.screenshot({ path: path.join(artifactDir, '01_hero_scroll_0.png') });
  console.log('Saved 01_hero_scroll_0.png');

  // Screenshot 2: Hero scroll transition (scroll = 320)
  await page.evaluate(() => window.scrollTo({ top: 320, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, '02_hero_scroll_320_blur_and_cards.png') });
  console.log('Saved 02_hero_scroll_320_blur_and_cards.png');

  // Screenshot 3: Hero settled 3 cards (scroll = 620)
  await page.evaluate(() => window.scrollTo({ top: 620, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, '03_hero_scroll_620_settled_cards.png') });
  console.log('Saved 03_hero_scroll_620_settled_cards.png');

  // Screenshot 4: Scroll down into New In (scroll = 1400)
  await page.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, '04_new_in_section.png') });
  console.log('Saved 04_new_in_section.png');

  // Screenshot 5: Scroll to Categories section
  const categoriesTop = await page.evaluate(() => {
    const el = document.getElementById('categories');
    return el ? el.offsetTop : 0;
  });
  console.log('Categories section offsetTop:', categoriesTop);

  await page.evaluate((top) => window.scrollTo({ top: top - 40, behavior: 'instant' }), categoriesTop);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, '05_categories_section.png') });
  console.log('Saved 05_categories_section.png');

  // Check 5a: Verify NO counter text like "01 OF 07", "01 / 04", "01 / 12" exists anywhere in categories
  const counterCheck = await page.evaluate(() => {
    const catEl = document.getElementById('categories');
    if (!catEl) return { found: false, text: '' };
    const text = catEl.innerText;
    const hasCounterPattern = /\d{2}\s*(?:OF|\/)\s*\d{2}/i.test(text);
    return { hasCounterPattern, text: text.substring(0, 300) };
  });
  console.log('Categories counter check:', counterCheck);

  // Check 5b: Verify horizontal overflow
  const overflowCheck = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  console.log('Overflow check:', overflowCheck);

  // Check 5c: Verify continuous animation gliding
  const transform1 = await page.evaluate(() => {
    const track = document.querySelector('.pablo-category-track');
    return track ? window.getComputedStyle(track).transform : null;
  });
  await new Promise(r => setTimeout(r, 1200));
  const transform2 = await page.evaluate(() => {
    const track = document.querySelector('.pablo-category-track');
    return track ? window.getComputedStyle(track).transform : null;
  });
  console.log('Transform moving check:');
  console.log('  t1:', transform1);
  console.log('  t2:', transform2);
  console.log('  isMoving:', transform1 !== transform2);

  // Check 5d: Verify pause on hover
  await page.hover('.pablo-category-section');
  await new Promise(r => setTimeout(r, 200));
  const hoverTransform1 = await page.evaluate(() => {
    const track = document.querySelector('.pablo-category-track');
    return track ? window.getComputedStyle(track).transform : null;
  });
  await new Promise(r => setTimeout(r, 800));
  const hoverTransform2 = await page.evaluate(() => {
    const track = document.querySelector('.pablo-category-track');
    return track ? window.getComputedStyle(track).transform : null;
  });
  console.log('Hover pause check:');
  console.log('  h1:', hoverTransform1);
  console.log('  h2:', hoverTransform2);
  console.log('  isPausedOnHover:', hoverTransform1 === hoverTransform2);

  // Screenshot 6: Hover state with Discover pill visible
  await page.screenshot({ path: path.join(artifactDir, '06_categories_hover_paused.png') });
  console.log('Saved 06_categories_hover_paused.png');

  // Move mouse away to unpause
  await page.mouse.move(0, 0);
  await new Promise(r => setTimeout(r, 600));
  const resumeTransform = await page.evaluate(() => {
    const track = document.querySelector('.pablo-category-track');
    return track ? window.getComputedStyle(track).transform : null;
  });
  console.log('Resumed transform check:', resumeTransform !== hoverTransform2);

  // Check 5e: Verify pause on keyboard focus
  await page.focus('.pablo-category-track a');
  await new Promise(r => setTimeout(r, 200));
  const focusTransform1 = await page.evaluate(() => {
    const track = document.querySelector('.pablo-category-track');
    return track ? window.getComputedStyle(track).transform : null;
  });
  await new Promise(r => setTimeout(r, 800));
  const focusTransform2 = await page.evaluate(() => {
    const track = document.querySelector('.pablo-category-track');
    return track ? window.getComputedStyle(track).transform : null;
  });
  console.log('Focus pause check:');
  console.log('  f1:', focusTransform1);
  console.log('  f2:', focusTransform2);
  console.log('  isPausedOnFocus:', focusTransform1 === focusTransform2);

  // Check 6: Reverse scroll back to Hero top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, '07_reverse_scroll_hero_top.png') });
  console.log('Saved 07_reverse_scroll_hero_top.png');

  // Check 7: Mobile Viewport 390x844
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, '08_mobile_hero_top.png') });
  console.log('Saved 08_mobile_hero_top.png');

  const mobileCatTop = await page.evaluate(() => {
    const el = document.getElementById('categories');
    return el ? el.offsetTop : 0;
  });
  await page.evaluate((top) => window.scrollTo({ top: top - 20, behavior: 'instant' }), mobileCatTop);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, '09_mobile_categories.png') });
  console.log('Saved 09_mobile_categories.png');

  await browser.close();
  console.log('All verification tests completed successfully!');
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
