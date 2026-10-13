const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1100']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928';
  const outPath = path.join(artifactDir, 'verify_hero_without_form_in_motion.png');
  await page.screenshot({ path: outPath });
  console.log('Saved to', outPath);

  // Also check mobile view
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 1000));
  const mobilePath = path.join(artifactDir, 'verify_hero_mobile_without_form_in_motion.png');
  await page.screenshot({ path: mobilePath });
  console.log('Saved to', mobilePath);

  await browser.close();
}

main().catch(console.error);