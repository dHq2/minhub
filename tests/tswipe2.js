const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{ width:412, height:860 }, deviceScaleFactor:2, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const cdp = await ctx.newCDPSession(p);
  await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(700);
  for (const [x,y] of [[330,450],[200,300],[200,600],[200,750]]){
    console.log(x,y, await p.evaluate(([x,y]) => { const e = document.elementFromPoint(x,y); return e ? e.tagName + '.' + e.className + ' > ' + (e.parentElement && e.parentElement.className) : null; }, [x,y]));
  }
  await p.evaluate(() => { document.addEventListener('touchstart', e => console.log('ts', e.target.tagName, e.target.className), { passive:true }); });
  p.on('console', m => console.log('console:', m.text()));
  await cdp.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[{ x:330, y:450 }] });
  for (let i = 1; i <= 8; i++){ await cdp.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[{ x:330 - 29*i, y:451 }] }); await p.waitForTimeout(20); }
  console.log('mid transform:', await p.evaluate(() => document.getElementById('main').style.transform));
  await cdp.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] }); await p.waitForTimeout(400);
  console.log('view:', await p.evaluate(() => document.body.className), 'hash', await p.evaluate(() => location.hash));
  console.log(errs); await b.close();
})();
