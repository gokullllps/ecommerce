const puppeteer = require('puppeteer-core');
const fs = require('fs');

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

const executablePath = edgePaths.find(p => fs.existsSync(p));

const viewports = [
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'mobile-393x852', width: 393, height: 852 },
  { name: 'mobile-430x932', width: 430, height: 932 }
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/sale', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));

    const check = await page.evaluate(() => {
      const hero = document.querySelector('section[aria-label="PABLO Archival Sale Campaign"]');
      const catalogue = document.getElementById('catalogue');
      const body = document.body;
      const heroRect = hero ? hero.getBoundingClientRect() : null;
      const catRect = catalogue ? catalogue.getBoundingClientRect() : null;
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

      return {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        heroHeight: heroRect ? heroRect.height : null,
        heroTop: heroRect ? heroRect.top : null,
        heroBottom: heroRect ? heroRect.bottom : null,
        catalogueTop: catRect ? catRect.top : null,
        hasHorizontalScroll: hasHorizontalScroll,
        scrollWidth: document.documentElement.scrollWidth
      };
    });

    console.log(`[${vp.name}] metrics:`, check);
    await page.screenshot({ path: `scripts/${vp.name}.png` });
    await page.close();
  }

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
