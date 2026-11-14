// v1.0 (2026-11-15, A) — 데이터 초기화: 판·대화·인간관계·처음 인사 지움, 머리 설정·로그 남김, 서버에서도 지움, 다시 열면 처음 인사
const { chromium } = require('playwright');
const APP = 'http://localhost:8765/sehee/', SRV = 'http://localhost:8787';
(async () => {
  const b = await chromium.launch(); let bad = 0;
  const check = (n, c, x) => { console.log((c ? 'OK   ' : 'FAIL ') + n + (x !== undefined ? ' · ' + x : '')); if (!c) bad++; };
  const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, locale:'ko-KR', serviceWorkers:'block' });
  await ctx.addInitScript(() => { try{ localStorage.removeItem('sehee.nointro'); }catch(e){} });   /* _guard 가 끈 처음 인사를 이 테스트만 켬 */
  const p = await ctx.newPage();
  await p.goto(APP + '?sync=' + SRV); await p.waitForSelector('#pinVeil'); await p.evaluate(() => kvSet('intro', { at:1, v:1 })); const nm = '초기화' + Date.now().toString(36).slice(-4);
  await fetch(SRV + '/signup', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ user:nm, pin:'1357' }) });   /* 다른 테스트와 안 섞이게 제 계정 */
  await p.locator('#pinId').fill(nm);
  for (const d of '1357') await p.locator(`#pinVeil [data-k="${d}"]`).click();
  await p.waitForSelector('#pinVeil', { state:'detached' }); await p.waitForTimeout(1200);
  await p.evaluate(async () => {
    AI.cfg.model = AI.cfg.model || 'claude-haiku-5-5'; AI.cfg.keyMark = 'KEEP'; AI.cfg.callMe = '사장님'; await saveAi();
    await pplLoad(); PPL.list.push({ id:'x1', name:'김가상', group:'지인', rel:'친구', info:[], extra:[], notes:[], links:[] }); await pplSave();
    O.log.push({ who:'u', text:'초기화 전 대화', at:Date.now() }); await saveLog(); await kvSet('intro', { at:Date.now(), v:1 }); await kvSet('b_ppPos', { x1:[0.2, 0.3] });
    dlog('대화', '초기화 전 로그 줄');
  });
  await p.locator('#tabPan').click(); await p.waitForTimeout(300); await p.locator('.add input').first().fill('지워질 일'); await p.locator('.add input').first().press('Enter'); await p.waitForTimeout(2500);
  const tok = await p.evaluate(() => SYNC.token);
  const before = Object.keys(((await (await fetch(SRV + '/data', { headers:{ authorization:'Bearer ' + tok } })).json()).records) || {});
  check('초기화 전 서버에 기록', before.includes('kv:people') && before.some(k => k.startsWith('pan:')), before.join(','));
  await p.evaluate(() => settingsSheet()); await p.waitForTimeout(300);
  await p.locator('[data-sact="reset"]').click(); check('한 번 더 물음', /한 번 더/.test(await p.locator('[data-sact="reset"]').textContent()));
  await Promise.all([p.waitForEvent('load'), p.locator('[data-sact="reset"]').click()]);
  await p.waitForSelector('#vn', { timeout:15000 }).catch(() => {});
  const st = await p.evaluate(async () => { await pplLoad(); await loadChat(); return { items:S.pan ? S.pan.items.length : -1, people:PPL.list.length, chat:O.log.filter(m => m.who === 'u').length, key:AI.cfg.keyMark, call:AI.cfg.callMe || null, pos:await kvGet('b_ppPos'), dbg:DBG.lines.some(l => l.m === '초기화 전 로그 줄'), intro:!!document.getElementById('vn'), user:SYNC.user }; });
  check('판·사람·대화 비움', st.items === 0 && st.people === 0 && st.chat === 0, JSON.stringify(st));
  check('보너스 자료(b_)도 지움', st.pos === undefined);
  check('머리 설정 남고 호칭만 지움', st.key === 'KEEP' && st.call === null);
  check('개발 로그는 남음', st.dbg);
  check('계정은 그대로', st.user === nm);
  check('다시 열면 처음 인사', st.intro);
  const after = ((await (await fetch(SRV + '/data', { headers:{ authorization:'Bearer ' + tok } })).json()).records) || {};
  check('서버에서도 지움', !('kv:people' in after) && !('kv:chat' in after) && !JSON.stringify(after).includes('지워질 일'), Object.keys(after).join(','));
  check('서버에 머리 설정은 남음', 'kv:ai' in after);
  console.log('RESET bad', bad); await b.close(); if (bad) process.exit(1);
})();
