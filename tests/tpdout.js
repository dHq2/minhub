const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const errs = [];
  for (const [vp, mob] of [[{ width:412, height:915 }, true], [{ width:1366, height:860 }, false]]){
  const ctx = await b.newContext({ viewport:vp, isMobile:mob, hasTouch:mob, serviceWorkers:'block' }); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2000);
  await p.evaluate(() => pdOpen('me')); await p.waitForTimeout(500);
  const box = await p.locator('#pdBody').boundingBox();
  const inside = await p.locator('.pd-paper h1').boundingBox();
  if (mob) await p.touchscreen.tap(inside.x + 5, inside.y + 5); else await p.mouse.click(inside.x + 5, inside.y + 5);
  await p.waitForTimeout(200); const stillOpen = await p.evaluate(() => $('pd').classList.contains('on'));
  if (mob) await p.touchscreen.tap(box.x + box.width / 2, box.y + box.height - 40); else await p.mouse.click(box.x + box.width / 2, box.y + box.height - 40);
  await p.waitForTimeout(300); console.log(mob ? 'm' : 'd', 'inside keeps open:', stillOpen, '| outside closes:', !(await p.evaluate(() => $('pd').classList.contains('on'))));
  await ctx.close(); }
  console.log('errors', errs); await b.close(); })();
