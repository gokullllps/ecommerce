const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  try {
    await page.goto('https://www.rolex.com/en-in', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise(r => setTimeout(r, 3000));
    
    const cardInfo = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a'));
      const target = allLinks.find(a => (a.innerText || '').includes('Datejust') || (a.innerText || '').includes('Sonya Yoncheva'));
      if (!target) return 'Not found';
      
      const rect = target.getBoundingClientRect();
      const style = window.getComputedStyle(target);
      const parent = target.parentElement;
      const parentRect = parent ? parent.getBoundingClientRect() : null;
      
      return {
        text: target.innerText,
        width: rect.width,
        height: rect.height,
        aspectRatio: (rect.width / rect.height).toFixed(3),
        borderRadius: style.borderRadius,
        parentWidth: parentRect ? parentRect.width : null,
        parentHeight: parentRect ? parentRect.height : null,
      };
    });
    console.log('Rolex Card Info:', JSON.stringify(cardInfo, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}
run();
