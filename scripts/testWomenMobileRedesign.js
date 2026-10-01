const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { name: 'mobile_390x844', width: 390, height: 844 },
  { name: 'mobile_360x800', width: 360, height: 800 },
  { name: 'mobile_430x932', width: 430, height: 932 },
  { name: 'desktop_1440x900', width: 1440, height: 900 },
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/women', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    // Scroll slightly down to capture the transition from Hero to Women's Collection and Category Cards
    if (vp.name === 'mobile_390x844') {
      const metrics = await page.evaluate(() => {
        const cta = document.querySelector('a[href="#catalogue"]');
        const ctaRect = cta ? cta.getBoundingClientRect() : null;

        const womenSection = document.querySelector('section[aria-label="Women\'s Editorial Collection"]');
        const womenRect = womenSection ? womenSection.getBoundingClientRect() : null;

        const introHeading = document.querySelector('section[aria-label="Women\'s Editorial Collection"] h2');
        const introRect = introHeading ? introHeading.getBoundingClientRect() : null;

        const navPills = document.querySelector('section[aria-label="Women\'s Editorial Collection"] .overflow-x-auto');
        const navRect = navPills ? navPills.getBoundingClientRect() : null;

        const cardGrid = document.querySelector('section[aria-label="Women\'s Editorial Collection"] .grid');
        const gridRect = cardGrid ? cardGrid.getBoundingClientRect() : null;

        const cards = Array.from(document.querySelectorAll('section[aria-label="Women\'s Editorial Collection"] .grid a'));
        const cardData = cards.map(c => ({
          href: c.getAttribute('href'),
          text: c.innerText.trim().replace(/\n+/g, ' '),
        }));

        const bodyWidth = document.body.scrollWidth;
        const windowWidth = window.innerWidth;
        const hasOverflow = bodyWidth > windowWidth;

        return {
          gapCtaToIntro: (ctaRect && introRect) ? Math.round(introRect.top - ctaRect.bottom) : null,
          gapIntroToNav: (introRect && navRect) ? Math.round(navRect.top - introRect.bottom) : null,
          gapNavToGrid: (navRect && gridRect) ? Math.round(gridRect.top - navRect.bottom) : null,
          cardCount: cards.length,
          cards: cardData,
          hasOverflow,
          bodyWidth,
          windowWidth,
        };
      });

      console.log('390x844 Metrics:', JSON.stringify(metrics, null, 2));

      // Take a screenshot of the initial viewport
      const initialPath = path.resolve(__dirname, '../women_390x844_top.png');
      await page.screenshot({ path: initialPath });
      console.log('Saved top screenshot:', initialPath);

      // Scroll to show the hero ending and category section clearly
      await page.evaluate(() => {
        window.scrollBy(0, 420);
      });
      await new Promise(r => setTimeout(r, 400));
      const sectionPath = path.resolve(__dirname, '../women_390x844_category_section.png');
      await page.screenshot({ path: sectionPath });
      console.log('Saved category section screenshot:', sectionPath);
    } else {
      const outPath = path.resolve(__dirname, `../women_${vp.name}.png`);
      await page.screenshot({ path: outPath });
      console.log(`Saved screenshot for ${vp.name}:`, outPath);
    }
  }

  await browser.close();
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
