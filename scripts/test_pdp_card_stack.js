const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testCardStack() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  const scratchDir = path.resolve(__dirname, '../scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  console.log('1. Navigating to product detail page...');
  await page.goto('http://localhost:3000/product/double-breasted-wool-overcoat', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot 1: Initial state
  const shot1 = path.join(scratchDir, 'stack_step1_initial.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot 1:', shot1);

  // Check card stack elements in DOM
  const initialData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.pdp-gallery-container .will-change-transform'));
    return cards.map((c, i) => ({
      index: i,
      transform: c.style.transform,
      opacity: c.style.opacity,
      zIndex: c.style.zIndex,
      visibility: c.style.visibility,
      pointerEvents: c.style.pointerEvents,
    }));
  });
  console.log('Initial Card Deck State:', JSON.stringify(initialData, null, 2));

  // 2. Click Next Image button
  console.log('2. Clicking Next image button...');
  const nextBtn = await page.$('button[aria-label="Next image"]');
  if (nextBtn) {
    await nextBtn.click();
    // Capture mid-transition
    await new Promise(r => setTimeout(r, 250));
    const shot2Mid = path.join(scratchDir, 'stack_step2_next_mid.png');
    await page.screenshot({ path: shot2Mid });
    console.log('Saved shot 2 (mid):', shot2Mid);

    // Wait for animation to finish
    await new Promise(r => setTimeout(r, 600));
    const shot2Settled = path.join(scratchDir, 'stack_step2_next_settled.png');
    await page.screenshot({ path: shot2Settled });
    console.log('Saved shot 2 (settled):', shot2Settled);
  } else {
    console.warn('Next button not found!');
  }

  // 3. Rapid repeated clicks
  console.log('3. Testing rapid clicks (3 rapid next clicks)...');
  if (nextBtn) {
    for (let i = 0; i < 3; i++) {
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 80));
    }
    await new Promise(r => setTimeout(r, 850));
    const shot3Rapid = path.join(scratchDir, 'stack_step3_after_rapid.png');
    await page.screenshot({ path: shot3Rapid });
    console.log('Saved shot 3 (after rapid clicks):', shot3Rapid);
  }

  // 4. Click Previous Image button
  console.log('4. Clicking Previous image button...');
  const prevBtn = await page.$('button[aria-label="Previous image"]');
  if (prevBtn) {
    await prevBtn.click();
    await new Promise(r => setTimeout(r, 250));
    const shot4PrevMid = path.join(scratchDir, 'stack_step4_prev_mid.png');
    await page.screenshot({ path: shot4PrevMid });
    console.log('Saved shot 4 (prev mid):', shot4PrevMid);

    await new Promise(r => setTimeout(r, 600));
    const shot4PrevSettled = path.join(scratchDir, 'stack_step4_prev_settled.png');
    await page.screenshot({ path: shot4PrevSettled });
    console.log('Saved shot 4 (prev settled):', shot4PrevSettled);
  }

  // 5. Click Thumbnail 3
  console.log('5. Clicking thumbnail 3...');
  const thumb3 = await page.$('button[aria-label="View photo 3"]');
  if (thumb3) {
    await thumb3.click();
    await new Promise(r => setTimeout(r, 850));
    const shot5Thumb = path.join(scratchDir, 'stack_step5_thumb3.png');
    await page.screenshot({ path: shot5Thumb });
    console.log('Saved shot 5 (thumbnail 3):', shot5Thumb);
  }

  // 6. Test Color Variant Switching
  console.log('6. Switching color variant...');
  const colorSwatches = await page.$$('button[aria-label*="Select colour"]');
  console.log(`Found ${colorSwatches.length} color swatches`);
  if (colorSwatches.length > 1) {
    // Click second color swatch
    console.log('Clicking second color swatch...');
    await colorSwatches[1].click();
    await new Promise(r => setTimeout(r, 900));
    const shot6Color = path.join(scratchDir, 'stack_step6_color_variant.png');
    await page.screenshot({ path: shot6Color });
    console.log('Saved shot 6 (color variant):', shot6Color);
  }

  // 7. Mobile Viewport Test (414x896)
  console.log('7. Testing mobile viewport (414x896)...');
  await page.setViewport({ width: 414, height: 896, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/product/double-breasted-wool-overcoat', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));
  const shot7MobileInitial = path.join(scratchDir, 'stack_step7_mobile_initial.png');
  await page.screenshot({ path: shot7MobileInitial });
  console.log('Saved shot 7 (mobile initial):', shot7MobileInitial);

  const mobileNextBtn = await page.$('button[aria-label="Next image"]');
  if (mobileNextBtn) {
    await mobileNextBtn.click();
    await new Promise(r => setTimeout(r, 850));
    const shot7MobileNext = path.join(scratchDir, 'stack_step7_mobile_next.png');
    await page.screenshot({ path: shot7MobileNext });
    console.log('Saved shot 7 (mobile next):', shot7MobileNext);
  }

  await browser.close();
  console.log('All tests completed successfully!');
}

testCardStack().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
