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

  // 1. Capture gallery with dots-only page indicator (slide 1)
  const galleryElem = await page.$('.pdp-gallery-container');
  await galleryElem.screenshot({ path: path.join(scratchDir, 'pdp_dots_only_01.png') });
  console.log('Saved pdp_dots_only_01.png');

  // Zoomed screenshot of the dots pill
  const indicatorPill = await page.$('div[role="tablist"]');
  if (indicatorPill) {
    await indicatorPill.screenshot({ path: path.join(scratchDir, 'pdp_dots_pill_zoom.png') });
    console.log('Saved pdp_dots_pill_zoom.png');
  }

  // 2. Click next arrow button to advance to slide 2
  const nextBtn = await page.$('button[aria-label="Next image"]');
  if (nextBtn) {
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await galleryElem.screenshot({ path: path.join(scratchDir, 'pdp_dots_only_02.png') });
    console.log('Saved pdp_dots_only_02.png');
  }

  // 3. Click dot 4 directly
  const dot4 = await page.$('button[aria-label="Go to slide 4"]');
  if (dot4) {
    await dot4.click();
    await new Promise(r => setTimeout(r, 800));
    await galleryElem.screenshot({ path: path.join(scratchDir, 'pdp_dots_only_04.png') });
    console.log('Saved pdp_dots_only_04.png');
    if (indicatorPill) {
      await indicatorPill.screenshot({ path: path.join(scratchDir, 'pdp_dots_pill_slide4_zoom.png') });
      console.log('Saved pdp_dots_pill_slide4_zoom.png');
    }
  }

  await browser.close();
  console.log('Verification completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
