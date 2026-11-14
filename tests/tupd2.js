const { chromium } = require('playwright'); const fs = require('fs'); const D = '/tmp/updt/sehee/';
const bump = v => { for (const f of ['sw.js', 'index.html']){ let s = fs.readFileSync(D + f, 'utf8'); s = s.replace(/const VERSION = '[^']+'/, `const VERSION = '${v}'`).replace(/const APP_VERSION = '[^']+'/, `const APP_VERSION = '${v}'`); fs.writeFileSync(D + f, s); } };
(async () => {
  bump('v1.3.9'); const b = await chromium.launch(); const ctx = await b.newContext({ viewport:{ width:412, height:915 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8766/sehee/#office'); await p.waitForTimeout(2500); await p.reload(); await p.waitForTimeout(2500);
  /* (2026-11-15, B) 띠 대신 게임 대화 장면(v1.5.30) — #updNo·#updGo 대신 장면에서 고름. band 는 장면이 떠 있으면 장면 글로 */
  const vnPick = async t => { for (let i = 0; i < 25 && !(await p.locator('.vn-c').count()); i++){ if (await p.locator('.vn-box').count()) await p.locator('.vn-box').click(); await p.waitForTimeout(400); } await p.locator('.vn-c', { hasText:t }).first().click(); };
  const ver = () => p.evaluate(() => APP_VERSION), band = () => p.evaluate(() => document.querySelector('.vn') ? '장면: ' + document.querySelector('.vn-text').textContent : $('upd').classList.contains('on') ? $('upd').querySelector('span').textContent : '(없음)');
  console.log('start', await ver());
  bump('v1.4.0'); bump('v1.4.1'); bump('v1.4.2');
  await p.reload(); await p.waitForTimeout(4000);   // launch: should ask, not auto
  console.log('launch: ver', await ver(), '| band:', await band());
  await p.screenshot({ path:'/tmp/v139-upd.png' }); await vnPick('구버전'); await p.waitForTimeout(2600); await p.locator('.vn-box').click(); await p.waitForTimeout(600); console.log('declined: ver', await ver(), '| band:', await band());
  await p.reload(); await p.waitForTimeout(3000); console.log('next launch: ver', await ver(), '| band:', await band());
  await vnPick('예'); await p.waitForTimeout(7000); console.log('after 업데이트 once: ver', await ver(), '| band:', await band());
  console.log('errors', errs); await b.close(); })();
