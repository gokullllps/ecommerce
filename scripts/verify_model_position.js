const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\c9d296ec-8eeb-4794-a40b-51f74b4a0389';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  
  // 1. Initial Male Model (after entrance completes)
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, 'verify_model_left_male.png') });
  console.log('Saved verify_model_left_male.png');

  // 2. Wait for transition to female model (initial hold is 2.4s, then 0.5s exit, then female enters)
  await new Promise(r => setTimeout(r, 2600));
  await page.screenshot({ path: path.join(artifactDir, 'verify_model_left_female.png') });
  console.log('Saved verify_model_left_female.png');

  await browser.close();
  console.log('All done!');
}

main().catch(console.error);
