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
  await page.goto('http://localhost:3000/product/architectural-relaxed-trousers', { waitUntil: 'networkidle2' });
  
  // 1. Initial settled view
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(scratchDir, 'pdp_fixed_initial.png') });
  console.log('Saved pdp_fixed_initial.png');

  // 2. Capture progress bar mid-interval (after ~1000ms)
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(scratchDir, 'pdp_fixed_progress_mid.png') });
  console.log('Saved pdp_fixed_progress_mid.png');

  // 3. Wait for auto-transition to image 2 (at ~2000ms)
  await new Promise(r => setTimeout(r, 1400));
  await page.screenshot({ path: path.join(scratchDir, 'pdp_fixed_auto_transition.png') });
  console.log('Saved pdp_fixed_auto_transition.png');

  await browser.close();
  console.log('All verification captures completed!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
