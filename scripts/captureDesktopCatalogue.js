const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/women', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  await page.evaluate(() => {
    const el = document.getElementById('catalogue');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: path.resolve(__dirname, '../women_desktop_category_section.png') });
  await browser.close();
  console.log('Saved desktop category section screenshot');
})();
