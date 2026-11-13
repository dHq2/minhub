const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:860 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#cal'); await p.waitForTimeout(1600);
  await p.locator('#calTabs button').nth(10).click(); await p.waitForTimeout(500);
  console.log(await p.evaluate(() => { const s = document.getElementById('calSheet'); const r = s.getBoundingClientRect(); return { cls:s.className, month:CAL.month, rect:[r.x, r.y, r.width, r.height], tf:getComputedStyle(s).transform, html:s.innerHTML.length }; }), errs);
  await b.close();
})();
