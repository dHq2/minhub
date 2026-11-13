const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const [vp, mob] of [[{ width:1366, height:860 }, false], [{ width:412, height:915 }, true]]){
    const ctx = await b.newContext({ viewport:vp, isMobile:mob, hasTouch:mob, serviceWorkers:'block' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
    for (const k of ['board', 'cal', 'people']){
      await p.evaluate(k => dwOpen(k), k); await p.waitForTimeout(500);
      const x = await p.locator(`#dw-${k} .dw-x`).boundingBox();
      // real pointer press/release at X center (mouse or touch)
      if (mob) await p.touchscreen.tap(x.x + x.width / 2, x.y + x.height / 2);
      else { await p.mouse.move(x.x + x.width / 2, x.y + x.height / 2); await p.mouse.down(); await p.mouse.up(); }
      await p.waitForTimeout(450);
      const top = await p.evaluate(k => getComputedStyle(document.querySelector(`#dw-${k} .dw-grip.r`)).top, k);
      console.log(mob ? 'm' : 'd', k, 'X → open:', await p.evaluate(() => DW.open), '| grip top', top);
    }
    console.log('errors', errs); await ctx.close();
  }
  await b.close();
})();
