const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for the new arrivals section
  await page.waitForSelector('#new-arrivals', { timeout: 10000 });

  // Scroll to new arrivals section
  await page.evaluate(() => {
    const el = document.querySelector('#new-arrivals');
    if (el) el.scrollIntoView();
  });

  await new Promise(r => setTimeout(r, 1500));

  const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928';
  const outPath = path.join(artifactDir, 'live_new_arrivals_verification.png');
  
  // Screenshot the element or viewport
  const section = await page.$('#new-arrivals');
  if (section) {
    await section.screenshot({ path: outPath });
  } else {
    await page.screenshot({ path: outPath });
  }

  console.log('Saved screenshot to:', outPath);
  await browser.close();
}

main().catch(console.error);
