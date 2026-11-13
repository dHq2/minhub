const { chromium } = require('playwright');
const APP = 'http://localhost:8765/sehee/';
(async () => {
  const b = await chromium.launch(); const errs = [];
  const open = async (tag, vp, mob) => {
    const ctx = await b.newContext({ viewport:vp, isMobile:mob, hasTouch:mob, locale:'ko-KR', serviceWorkers:'block', userAgent:mob ? 'Mozilla/5.0 (Linux; Android 14; SM-N981N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36' : undefined });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(tag + ': ' + e.message)); return p;
  };
  const pin = async (p, code) => { for (const d of code) await p.locator(`#pinVeil [data-k="${d}"]`).click(); };
  // A: phone
  const A = await open('A', { width:412, height:915 }, true);
  await A.goto(APP + '?sync=http://localhost:8787#office'); await A.waitForSelector('#pinVeil');
  await A.screenshot({ path:'v10-pin.png' });
  await pin(A, '1111'); await A.waitForTimeout(500); console.log('A wrong:', await A.locator('#pinM').textContent());
  await pin(A, '2580'); await A.waitForSelector('#pinVeil', { state:'detached' }); await A.waitForTimeout(1500);
  console.log('A logged:', await A.evaluate(() => [SYNC.user, SYNC.on, SYNC.device]), '| badge:', await A.locator('#cloud').textContent());
  // A writes an item on 판
  await A.locator('#tabPan').click(); await A.waitForTimeout(300);
  await A.locator('.add input').first().fill('A폰에서 적은 일'); await A.locator('.add input').first().press('Enter'); await A.waitForTimeout(2500);
  console.log('A dirty left:', await A.evaluate(() => SYNC.dirty.size), '| last:', await A.evaluate(() => !!SYNC.last));
  // B: desktop
  const B = await open('B', { width:1366, height:860 }, false);
  await B.goto(APP + '?sync=http://localhost:8787'); await B.waitForSelector('#pinVeil');
  await pin(B, '2580'); await B.waitForSelector('#pinVeil', { state:'detached' }); await B.waitForTimeout(1800);
  console.log('B sees:', await B.evaluate(() => S.pan.items.map(i => i.text)));
  await B.screenshot({ path:'v10-B.png' });
  // A notices takeover when it comes back to the screen
  await A.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await A.waitForTimeout(800);
  console.log('A dead:', await A.evaluate(() => SYNC.dead), '|', await A.locator('#deadVeil b').textContent().catch(() => '-'));
  await A.screenshot({ path:'v10-A-dead.png' });
  // B edits
  await B.locator('.add input').first().fill('B컴퓨터에서 적은 일'); await B.locator('.add input').first().press('Enter'); await B.evaluate(() => kvSet('b_ppPos', { p1:[0.2, 0.3] })); await B.waitForTimeout(2500);
  // A reopens → PIN with note → pulls
  await A.locator('#dvGo').click(); await A.waitForSelector('#pinVeil');
  console.log('A note:', await A.locator('#pinM').textContent());
  await pin(A, '2580'); await A.waitForSelector('#pinVeil', { state:'detached' }); await A.waitForTimeout(1800);
  console.log('A sees:', await A.evaluate(() => S.pan.items.map(i => i.text)), 'b_ppPos:', JSON.stringify(await A.evaluate(() => kvGet('b_ppPos'))));
  // same device reopen with token → no PIN
  await A.reload(); await A.waitForTimeout(2500);
  console.log('A reopen without pin:', !(await A.locator('#pinVeil').count()), await A.evaluate(() => SYNC.on));
  // lockout
  const C = await open('C', { width:412, height:915 }, true);
  await C.goto(APP + '?sync=http://localhost:8787'); await C.waitForSelector('#pinVeil');
  for (let i = 0; i < 5; i++){ await pin(C, '0000'); await C.waitForTimeout(350); }
  console.log('C after 5 wrong:', await C.locator('#pinM').textContent());
  await pin(C, '2580'); await C.waitForTimeout(500); console.log('C right pin while locked:', await C.locator('#pinM').textContent());
  console.log('errors', errs); await b.close();
})();
