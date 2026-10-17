const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function main() {
  const scratchDir = path.resolve(__dirname, '../scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to architectural-relaxed-trousers...');
  await page.goto('http://localhost:3000/product/architectural-relaxed-trousers', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.pdp-gallery-container', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 600));

  // Find the previous and next arrow buttons
  const prevBtn = await page.$('button[aria-label="Previous image"]');
  const nextBtn = await page.$('button[aria-label="Next image"]');

  if (!nextBtn) {
    throw new Error('Next image button not found!');
  }

  // 1. Initial settled state (unhovered)
  const galleryElem = await page.$('.pdp-gallery-container');
  await galleryElem.screenshot({ path: path.join(scratchDir, 'arrow_01_idle.png') });
  console.log('Saved arrow_01_idle.png');

  // Zoomed screenshot of next arrow button before hover
  await nextBtn.screenshot({ path: path.join(scratchDir, 'arrow_next_idle.png') });
  console.log('Saved arrow_next_idle.png');

  // 2. Hover over the next button
  const box = await nextBtn.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

  // Capture early mid-fill (~150ms)
  await new Promise(r => setTimeout(r, 160));
  await nextBtn.screenshot({ path: path.join(scratchDir, 'arrow_next_hover_150ms.png') });
  console.log('Saved arrow_next_hover_150ms.png');

  // Capture mid-fill (~320ms)
  await new Promise(r => setTimeout(r, 160));
  await nextBtn.screenshot({ path: path.join(scratchDir, 'arrow_next_hover_320ms.png') });
  console.log('Saved arrow_next_hover_320ms.png');

  // Capture fully filled (~700ms)
  await new Promise(r => setTimeout(r, 400));
  await nextBtn.screenshot({ path: path.join(scratchDir, 'arrow_next_hover_full.png') });
  console.log('Saved arrow_next_hover_full.png');

  // Capture gallery context with hovered button
  await galleryElem.screenshot({ path: path.join(scratchDir, 'arrow_02_gallery_hovered.png') });
  console.log('Saved arrow_02_gallery_hovered.png');

  // 3. Move mouse away to test draining back
  await page.mouse.move(10, 10);

  // Capture mid-drain (~250ms after leave)
  await new Promise(r => setTimeout(r, 250));
  await nextBtn.screenshot({ path: path.join(scratchDir, 'arrow_next_drain_250ms.png') });
  console.log('Saved arrow_next_drain_250ms.png');

  // Capture fully drained (~750ms after leave)
  await new Promise(r => setTimeout(r, 500));
  await nextBtn.screenshot({ path: path.join(scratchDir, 'arrow_next_restored.png') });
  console.log('Saved arrow_next_restored.png');

  // Test previous button hover as well
  const prevBox = await prevBtn.boundingBox();
  await page.mouse.move(prevBox.x + prevBox.width / 2, prevBox.y + prevBox.height / 2);
  await new Promise(r => setTimeout(r, 200));
  await prevBtn.screenshot({ path: path.join(scratchDir, 'arrow_prev_hover_mid.png') });
  await new Promise(r => setTimeout(r, 500));
  await prevBtn.screenshot({ path: path.join(scratchDir, 'arrow_prev_hover_full.png') });
  console.log('Saved arrow_prev screenshots');

  await browser.close();
  console.log('All water-fill hover verifications completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
