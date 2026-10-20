const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
  });
  const viewports = [320, 360, 375, 390, 430, 768];
  const routes = ['/', '/men', '/women', '/kids', '/sale', '/about'];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp, height: 800 });
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('pablo-intro-completed', 'true');
    });

    for (const route of routes) {
      await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle2' });
      const overflow = await page.evaluate(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const overflowingEls = [];
        document.querySelectorAll('*').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.right > winW + 1) {
            overflowingEls.push({
              tag: el.tagName,
              id: el.id,
              cls: el.className ? String(el.className).slice(0, 50) : '',
              right: Math.round(r.right),
              width: Math.round(r.width)
            });
          }
        });
        return { hasOverflow: docW > winW, docW, winW, count: overflowingEls.length, topFew: overflowingEls.slice(0, 3) };
      });
      if (overflow.hasOverflow) {
        console.log('[OVERFLOW]', route, '@', vp + 'px: docW=' + overflow.docW + ' > winW=' + overflow.winW, overflow.topFew);
      } else {
        console.log('[OK]', route, '@', vp + 'px');
      }
    }
    await page.close();
  }
  await browser.close();
  console.log('Mobile audit complete.');
})();
