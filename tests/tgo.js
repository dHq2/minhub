const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const errs = []; const ctx = await b.newContext({ viewport:{ width:1366, height:860 }, serviceWorkers:'block' }); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(2000);
  await p.evaluate(() => goView('board')); await p.waitForTimeout(600);
  console.log('after goView(board): scrollY', await p.evaluate(() => [scrollY, document.body.scrollTop, location.hash, curView(), DW.open]));
  await p.evaluate(() => { dwClose(); goView('pan'); }); await p.waitForTimeout(500);
  // grip lower part drag twice
  for (let k = 0; k < 2; k++){ const g = await p.locator('#panGrip').boundingBox(); const y = g.y + 476;
    await p.mouse.move(g.x + 12, y); await p.mouse.down(); await p.mouse.move(g.x - 200, y, { steps:6 }); await p.mouse.up(); await p.waitForTimeout(500);
    console.log('grip drag', k, '→', await p.evaluate(() => curView()), 'grip', JSON.stringify(g)); await p.evaluate(() => goView('pan')); await p.waitForTimeout(500); }
  await p.goBack(); await p.waitForTimeout(400); console.log('back →', await p.evaluate(() => curView()));
  console.log('errors', errs); await b.close(); })();
