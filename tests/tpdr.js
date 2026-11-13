const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const errs = [];
  for (const [vp, mob, tag] of [[{ width:412, height:915 }, true, 'm'], [{ width:1366, height:860 }, false, 'd']]){
    const ctx = await b.newContext({ viewport:vp, isMobile:mob, hasTouch:mob, serviceWorkers:'block' }); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(2000);
    await p.evaluate(async () => { const pr = await todayPanRef(); for (let i = 0; i < 12; i++) pr.items.push({ id:uid(), sec:'today', text:'테스트 항목 ' + i, by:'sehee', at:Date.now() }); await putPan(pr); render(); });
    await p.waitForTimeout(400); await p.screenshot({ path:`v137-${tag}.png` });
    const g = await p.evaluate(() => { const r = $('panDrawer').getBoundingClientRect(), t = document.querySelector('#panDw').getBoundingClientRect(), m = $('main'); return { drawerRight:Math.round(r.right), tabsLeft:Math.round(t.left), canScroll:m.scrollHeight > m.clientHeight }; });
    // scroll
    const r = await p.locator('#main').boundingBox();
    if (mob){ const cdp = await ctx.newCDPSession(p); await cdp.send('Input.synthesizeScrollGesture', { x:150, y:450, yDistance:-300, speed:800 }); } else { await p.mouse.move(r.x + 100, r.y + 200); await p.mouse.wheel(0, 300); }
    await p.waitForTimeout(500); g.scrolled = await p.evaluate(() => $('main').scrollTop);
    // head drag closes
    const h = await p.locator('#panHead b').boundingBox();
    await p.mouse.move(h.x + 60, h.y + 5); await p.mouse.down(); await p.mouse.move(h.x - 80, h.y + 5, { steps:5 }); await p.screenshot({ path:`v137-drag-${tag}.png` }); await p.mouse.move(h.x - 260, h.y + 5, { steps:4 }); await p.mouse.up(); await p.waitForTimeout(500);
    g.afterDrag = await p.evaluate(() => curView());
    await p.evaluate(() => goView('pan')); await p.waitForTimeout(400); await p.locator('#panX').click(); await p.waitForTimeout(400); g.afterX = await p.evaluate(() => curView());
    await p.evaluate(() => goView('pan')); await p.waitForTimeout(400); await p.locator('#panDw [data-pdw="cal"]').click(); await p.waitForTimeout(700); g.tab = await p.evaluate(() => [curView(), DW.open]);
    await p.evaluate(() => { dwClose(); goView('pan'); }); await p.waitForTimeout(400); await p.locator('#sayText').focus(); await p.waitForTimeout(300); await p.screenshot({ path:`v137-typing-${tag}.png` });
    g.sayIn = await p.evaluate(() => $('say').closest('#panDrawer') ? 'drawer' : 'other');
    console.log(tag, JSON.stringify(g)); await ctx.close(); }
  console.log('errors', errs); await b.close(); })();
