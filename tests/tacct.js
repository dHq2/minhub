// v1.0 (2026-11-15, A) — 한 기기에서 다른 계정으로 열 때: 앞 계정 기록을 새 계정에 안 올림, 머리 설정만 남김, 다시 돌아오면 그대로
const { chromium } = require('playwright');
const APP = 'http://localhost:8765/sehee/', SRV = 'http://localhost:8787';
(async () => {
  const b = await chromium.launch(); let bad = 0;
  const check = (n, c, x) => { console.log((c ? 'OK   ' : 'FAIL ') + n + (x !== undefined ? ' · ' + x : '')); if (!c) bad++; };
  const p = await (await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' })).newPage();
  const pin = async code => { for (const d of code) await p.locator(`#pinVeil [data-k="${d}"]`).click(); };
  await p.goto(APP + '?sync=' + SRV); await p.waitForSelector('#pinVeil'); await pin('2580'); await p.waitForSelector('#pinVeil', { state:'detached' }); await p.waitForTimeout(1500);
  await p.evaluate(async () => { AI.cfg.model = AI.cfg.model || 'claude-haiku-5-5'; AI.cfg.keyMark = 'KEEPME'; await saveAi(); });
  await p.locator('#tabPan').click(); await p.waitForTimeout(300);
  await p.locator('.add input').first().fill('본 계정의 비밀 일'); await p.locator('.add input').first().press('Enter'); await p.waitForTimeout(2500);
  check('본 계정에 적힘', (await p.evaluate(() => S.pan.items.map(i => i.text))).includes('본 계정의 비밀 일'));
  await p.evaluate(() => syncLogout()); await p.waitForSelector('#pinVeil'); await pin('1357'); await p.waitForSelector('#pinVeil', { state:'detached' }); await p.waitForTimeout(2000);
  check('테스트 계정으로 열림', (await p.evaluate(() => SYNC.user)) === 'manbok');
  check('판이 비어 있음', (await p.evaluate(() => S.pan.items.length)) === 0, JSON.stringify(await p.evaluate(() => S.pan.items.map(i => i.text))));
  check('머리 설정은 남음', (await p.evaluate(() => AI.cfg.keyMark)) === 'KEEPME');
  const tok = await p.evaluate(() => SYNC.token);
  const recs = (await (await fetch(SRV + '/data', { headers:{ authorization:'Bearer ' + tok } })).json()).records || {};
  check('테스트 계정 서버에 본 계정 기록 없음', !JSON.stringify(recs).includes('본 계정의 비밀 일') && !('kv:chat' in recs && JSON.stringify(recs['kv:chat']).includes('비밀')), Object.keys(recs).join(','));
  check('테스트 계정 서버에 머리 설정은 있음', 'kv:ai' in recs);
  await p.locator('.add input').first().fill('만복상회 일'); await p.locator('.add input').first().press('Enter'); await p.waitForTimeout(2500);
  await p.evaluate(() => syncLogout()); await p.waitForSelector('#pinVeil'); await pin('2580'); await p.waitForSelector('#pinVeil', { state:'detached' }); await p.waitForTimeout(2000);
  const back = await p.evaluate(() => S.pan.items.map(i => i.text));
  check('본 계정으로 돌아오면 그대로', back.includes('본 계정의 비밀 일') && !back.includes('만복상회 일'), back.join(' / '));
  console.log('ACCT bad', bad); await b.close(); if (bad) process.exit(1);
})();
