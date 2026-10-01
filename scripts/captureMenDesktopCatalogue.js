const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // 1. Desktop Test (1440x900)
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/men', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  await page.evaluate(() => {
    const el = document.getElementById('catalogue');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.resolve(__dirname, '../men_desktop_category_section.png') });
  console.log('Saved men desktop screenshot');

  // 2. Mobile Test (390x844)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/men', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  await page.evaluate(() => {
    const el = document.getElementById('catalogue');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.resolve(__dirname, '../men_mobile_category_section.png') });
  console.log('Saved men mobile screenshot');

  await browser.close();
})();
