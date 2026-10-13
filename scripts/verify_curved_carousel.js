const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\260b2cc8-09de-4259-a363-0e741c07b655';

async function main() {
  console.log('Launching browser to test curved category carousel & hero...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // 1. Initial Page Load (Verify Hero untouched, intro completed)
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 35000 });
  await page.evaluate(() => {
    try {
      sessionStorage.setItem('pablo-intro-completed', 'true');
    } catch (e) {}
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(artifactDir, 'curved_01_hero_scroll0.png') });
  console.log('Saved curved_01_hero_scroll0.png');

  // 2. Test Hero Scroll Animation (scroll = 400)
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'curved_02_hero_scroll_cards.png') });
  console.log('Saved curved_02_hero_scroll_cards.png');

  // 3. Scroll to Categories Section
  const catTop = await page.evaluate(() => {
    const el = document.getElementById('categories');
    return el ? el.offsetTop : 0;
  });
  console.log('Categories section offsetTop:', catTop);

  await page.evaluate((top) => window.scrollTo({ top: top - 20, behavior: 'instant' }), catTop);
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 3: Categories section curved arc initial view
  await page.screenshot({ path: path.join(artifactDir, 'curved_03_categories_arc_initial.png') });
  console.log('Saved curved_03_categories_arc_initial.png');

  // 4. Measure transforms of cards to confirm curved arrangement:
  // Center card should have highest Y (smallest translateY) and scale ~ 1.0, rotateZ ~ 0
  // Left and right cards should have larger translateY (dropped down), rotateZ tilt, smaller scale
  const cardMetrics = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#categories .will-change-transform'));
    return cards.slice(0, 7).map((el, idx) => {
      const transform = el.style.transform;
      const zIndex = el.style.zIndex;
      const opacity = el.style.opacity;
      const rect = el.getBoundingClientRect();
      return { idx, transform, zIndex, opacity, top: rect.top, left: rect.left };
    });
  });
  console.log('Card metrics sample:');
  console.log(cardMetrics);

  // 5. Test continuous movement:
  // Capture snapshot at t0, wait 1.5s, capture snapshot at t1
  const t0Transform = await page.evaluate(() => {
    const el = document.querySelector('#categories .will-change-transform');
    return el ? el.style.transform : null;
  });
  await new Promise(r => setTimeout(r, 1500));
  const t1Transform = await page.evaluate(() => {
    const el = document.querySelector('#categories .will-change-transform');
    return el ? el.style.transform : null;
  });
  console.log('Movement test:');
  console.log('  t0:', t0Transform);
  console.log('  t1:', t1Transform);
  console.log('  isMoving:', t0Transform !== t1Transform);

  await page.screenshot({ path: path.join(artifactDir, 'curved_04_categories_arc_gliding.png') });
  console.log('Saved curved_04_categories_arc_gliding.png');

  // 6. Test pause on hover:
  await page.hover('#categories');
  await new Promise(r => setTimeout(r, 300));
  const h0Transform = await page.evaluate(() => {
    const el = document.querySelector('#categories .will-change-transform');
    return el ? el.style.transform : null;
  });
  await new Promise(r => setTimeout(r, 1000));
  const h1Transform = await page.evaluate(() => {
    const el = document.querySelector('#categories .will-change-transform');
    return el ? el.style.transform : null;
  });
  console.log('Hover pause test:');
  console.log('  h0:', h0Transform);
  console.log('  h1:', h1Transform);
  console.log('  isPausedOnHover:', h0Transform === h1Transform);

  await page.screenshot({ path: path.join(artifactDir, 'curved_05_categories_hover_paused.png') });
  console.log('Saved curved_05_categories_hover_paused.png');

  // 7. Resume on mouse leave:
  await page.mouse.move(0, 0);
  await new Promise(r => setTimeout(r, 1000));
  const resumeTransform = await page.evaluate(() => {
    const el = document.querySelector('#categories .will-change-transform');
    return el ? el.style.transform : null;
  });
  console.log('Resume test:');
  console.log('  isResumed:', resumeTransform !== h1Transform);

  // 8. Focus test:
  await page.focus('#categories a');
  await new Promise(r => setTimeout(r, 300));
  const f0Transform = await page.evaluate(() => {
    const el = document.querySelector('#categories .will-change-transform');
    return el ? el.style.transform : null;
  });
  await new Promise(r => setTimeout(r, 1000));
  const f1Transform = await page.evaluate(() => {
    const el = document.querySelector('#categories .will-change-transform');
    return el ? el.style.transform : null;
  });
  console.log('Focus pause test:');
  console.log('  isPausedOnFocus:', f0Transform === f1Transform);

  // 9. Verify no counter text:
  const counterCheck = await page.evaluate(() => {
    const text = document.getElementById('categories').innerText;
    return {
      hasCounterPattern: /\d{2}\s*(?:OF|\/)\s*\d{2}/i.test(text),
      sampleText: text.substring(0, 200)
    };
  });
  console.log('Counter check:', counterCheck);

  // 10. Check horizontal page overflow:
  const overflowCheck = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  console.log('Overflow check:', overflowCheck);

  // 11. Mobile Viewport Check (390x844)
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate((top) => window.scrollTo({ top: top - 20, behavior: 'instant' }), catTop);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'curved_06_mobile_curved_categories.png') });
  console.log('Saved curved_06_mobile_curved_categories.png');

  await browser.close();
  console.log('All curved carousel checks completed successfully!');
}

main().catch(err => {
  console.error('Error in verification:', err);
  process.exit(1);
});
