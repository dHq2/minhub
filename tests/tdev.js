const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const c2 = await b.newContext({ viewport:{ width:1366, height:860 }, serviceWorkers:'block' }); const q = await c2.newPage();
  await q.goto('http://localhost:8765/sehee/'); await q.waitForTimeout(2000);
  await q.evaluate(() => { localStorage.setItem('sehee.dev', '1'); devApply(); }); await q.locator('#tabDev').click(); await q.waitForTimeout(300);
  console.log(await q.evaluate(() => JSON.stringify({ dev:$('dev').getBoundingClientRect(), bar:document.querySelector('.dev-bar').getBoundingClientRect(), barDisp:getComputedStyle(document.querySelector('.dev-bar')).display, sy:scrollY, bst:document.body.scrollTop, body:document.body.getBoundingClientRect() })));
  await q.screenshot({ path:'v128-dev2.png' }); await b.close(); })();
