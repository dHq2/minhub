// v1.0 (2026-11-15, A) — 체험 공간(?space=): 같은 브라우저에서 따로 된 빈 세희, 원래 기록 안 건드림
const { chromium } = require('playwright');
const APP = 'http://localhost:8765/sehee/';
(async () => {
  const b = await chromium.launch(); let bad = 0;
  const check = (n, c, x) => { console.log((c ? 'OK   ' : 'FAIL ') + n + (x !== undefined ? ' · ' + x : '')); if (!c) bad++; };
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  const add = async (p, t) => { await p.locator('#tabPan').click(); await p.waitForTimeout(300); await p.locator('.add input').first().fill(t); await p.locator('.add input').first().press('Enter'); await p.waitForTimeout(800); };
  const items = p => p.evaluate(() => S.pan.items.map(i => i.text));
  const A = await ctx.newPage(); await A.goto(APP); await A.waitForTimeout(2500);
  await add(A, '원래 세희 일'); await A.evaluate(() => { localStorage.setItem('sehee.devname', '원래이름'); });
  const B = await ctx.newPage(); await B.goto(APP + '?space=manbok'); await B.waitForTimeout(2500);
  check('체험 공간은 비어 있음', (await items(B)).length === 0, (await items(B)).join('/'));
  check('띠가 보임', await B.locator('#spaceBar').isVisible(), await B.locator('#spaceBar').textContent());
  check('주소에서 ?space 지워짐', !(await B.evaluate(() => location.search)));
  check('설정 값도 따로', (await B.evaluate(() => localStorage.getItem('sehee.devname'))) === null);
  await add(B, '만복상회 일');
  await B.screenshot({ path:'/tmp/tspace.png' });
  await B.reload(); await B.waitForTimeout(2500);
  check('새로 고쳐도 체험 공간', (await B.evaluate(() => window.SEHEE_SPACE)) === 'manbok' && (await items(B)).includes('만복상회 일'));
  await A.reload(); await A.waitForTimeout(2500);
  const a = await items(A);
  check('원래 세희는 그대로', a.includes('원래 세희 일') && !a.includes('만복상회 일'), a.join('/'));
  await B.goto(APP + '?space='); await B.waitForTimeout(2500);
  check('?space= 로 나가면 원래 세희', !(await B.evaluate(() => window.SEHEE_SPACE)) && (await items(B)).includes('원래 세희 일'));
  console.log('SPACE bad', bad); await b.close(); if (bad) process.exit(1);
})();
