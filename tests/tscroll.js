const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  for (const [vp, mob] of [[{ width:1366, height:860 }, false], [{ width:412, height:915 }, true]]){
  const ctx = await b.newContext({ viewport:vp, isMobile:mob, hasTouch:mob, serviceWorkers:'block' }); const p = await ctx.newPage();
  await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(2000);
  await p.evaluate(async () => { const pr = await todayPanRef(); for (let i = 0; i < 14; i++) pr.items.push({ id:uid(), sec:i % 2 ? 'today' : 'note', text:'항목 ' + i, by:'sehee', at:Date.now() }); await putPan(pr); render(); });
  await p.waitForTimeout(300);
  const st = () => p.evaluate(() => ({ html:document.documentElement.scrollTop, body:document.body.scrollTop, mainTop:document.getElementById('main').scrollTop, sh:document.body.scrollHeight, bh:document.body.clientHeight, ov:getComputedStyle(document.body).overflowY, hov:getComputedStyle(document.documentElement).overflowY, main:document.getElementById('main').offsetHeight }));
  console.log(mob ? 'm' : 'd', 'before', JSON.stringify(await st()));
  const r = await p.locator('#main').boundingBox();
  if (mob){ const cdp = await ctx.newCDPSession(p); await cdp.send('Input.synthesizeScrollGesture', { x:200, y:500, yDistance:-300, speed:800 }); }
  else { await p.mouse.move(r.x + 150, r.y + 300); await p.mouse.wheel(0, 400); }
  await p.waitForTimeout(600); await p.screenshot({ path:'v132-scroll-' + (mob ? 'm' : 'd') + '.png' }); console.log(mob ? 'm' : 'd', 'after', JSON.stringify(await st()));
  const el = await p.evaluate(({x, y}) => { const e = document.elementFromPoint(x, y); return e && (e.id || e.className); }, { x:r.x + 150, y:r.y + 300 }); console.log('under cursor', el);
  await ctx.close(); }
  await b.close(); })();
