const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const errs = [], cons = [];
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') cons.push(m.text()); });
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2500);
  console.log('ver', await p.locator('#ver').textContent(), '| log msgs', await p.locator('#log .msg').count());
  await p.screenshot({ path:'v150-load.png' });
  console.log('errors', errs, cons.slice(0,5)); await b.close(); })();
