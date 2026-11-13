const { chromium } = require('playwright'); const fs = require('fs'); const D = '/tmp/updt/sehee/';
const bump = v => { for (const f of ['sw.js', 'index.html']){ let s = fs.readFileSync(D + f, 'utf8'); s = s.replace(/const VERSION = '[^']+'/, `const VERSION = '${v}'`).replace(/const APP_VERSION = '[^']+'/, `const APP_VERSION = '${v}'`); fs.writeFileSync(D + f, s); } };
(async () => {
  bump('v1.3.9'); const b = await chromium.launch(); const ctx = await b.newContext({ viewport:{ width:412, height:915 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8766/sehee/#office'); await p.waitForTimeout(2500); await p.reload(); await p.waitForTimeout(2500);
  const ver = () => p.evaluate(() => APP_VERSION), band = () => p.evaluate(() => $('upd').classList.contains('on') ? $('upd').querySelector('span').textContent : '(없음)');
  console.log('start', await ver());
  bump('v1.4.0'); bump('v1.4.1'); bump('v1.4.2');
  await p.reload(); await p.waitForTimeout(4000);   // launch: should ask, not auto
  console.log('launch: ver', await ver(), '| band:', await band());
  await p.screenshot({ path:'v139-upd.png' }); await p.locator('#updNo').click(); await p.waitForTimeout(500); console.log('declined: ver', await ver(), '| band:', await band());
  await p.reload(); await p.waitForTimeout(3000); console.log('next launch: ver', await ver(), '| band:', await band());
  await p.locator('#updGo').click(); await p.waitForTimeout(4000); console.log('after 업데이트 once: ver', await ver(), '| band:', await band());
  console.log('errors', errs); await b.close(); })();
