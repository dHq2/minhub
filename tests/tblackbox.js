// v1.2 (2026-11-15, A: 기기 이름) · v1.1 (같은 브라우저 탭 둘) · v1.0 (2026-11-14, A) — 개발 블랙박스(/log · 금고 내보내기) + 관전석(보기 전용, 주 기기 안 밀어냄)
const { chromium } = require('playwright');
const APP = 'http://localhost:8765/sehee/', SRV = 'http://localhost:8787';
(async () => {
  const b = await chromium.launch();
  const open = async (tag, vp, mob) => {
    const ctx = await b.newContext({ viewport:vp, isMobile:mob, hasTouch:mob, locale:'ko-KR', serviceWorkers:'block' });
    const p = await ctx.newPage(); if (global.__guard) global.__guard(p, tag); else p.on('pageerror', e => console.log('PAGEERR', tag, e.message)); return p;
  };
  const pin = async (p, code) => { for (const d of code) await p.locator(`#pinVeil [data-k="${d}"]`).click(); };
  const ok = (name, cond, extra) => console.log((cond ? 'OK   ' : 'FAIL ') + name + (extra !== undefined ? ' · ' + extra : ''));
  let bad = 0; const check = (n, c, x) => { ok(n, c, x); if (!c) bad++; };

  // A: 폰 — 주 기기
  const A = await open('A', { width:412, height:915 }, true);
  await A.goto(APP + '?sync=' + SRV + '#office'); await A.waitForSelector('#pinVeil');
  await pin(A, '2580'); await A.waitForSelector('#pinVeil', { state:'detached' }); await A.waitForTimeout(1500);
  check('A 주 기기로 열림', await A.evaluate(() => SYNC.on && !SYNC.observer));
  await A.evaluate(() => { dlog('대화', '보스 → 긴 말 앞부분…', '보스가 한 말 원문 전체 — 김가상 씨랑 내일 3시 약속, 자세한 내용까지 다 남아야 함'); dlog('대화', '세희 ← [1] 네', '네, 적어 둘게요. 원문 그대로.'); });
  await A.locator('#tabPan').click(); await A.waitForTimeout(300);
  await A.evaluate(() => logPush(true)); await A.waitForTimeout(600);
  const tokA = await A.evaluate(() => SYNC.token);
  const g = await (await fetch(SRV + '/log', { headers:{ authorization:'Bearer ' + tokA } })).json();
  const lines = g.lines || [];
  check('서버가 줄을 받음', g.logging === true && lines.length > 3, lines.length + '줄');
  check('대화 원문이 d 에 통째로', lines.some(l => l.c === '대화' && /자세한 내용까지 다 남아야 함/.test(l.d || '')));
  check('누른 단추가 남음', lines.some(l => l.c === '누름'), (lines.find(l => l.c === '누름') || {}).m);
  check('암호는 안 남음', !lines.some(l => /2580/.test((l.m || '') + (l.d || ''))));
  check('상태 요약이 남음', g.states.length && g.states[0].state.v && 'pan' in g.states[0].state, JSON.stringify(g.states[0] && g.states[0].state).slice(0, 120));
  const sentA = await A.evaluate(() => LOGUP.sent); await A.evaluate(() => logPush(true)); await A.waitForTimeout(400);
  const g2 = await (await fetch(SRV + '/log', { headers:{ authorization:'Bearer ' + tokA } })).json();
  check('같은 줄은 두 번 안 들어감', g2.lines.length <= lines.length + 3, `${lines.length} → ${g2.lines.length} · sent ${sentA}`);

  // B: 컴퓨터 — 관전석
  const B = await open('B', { width:1366, height:860 }, false);
  await B.goto(APP + '?sync=' + SRV + '&watch=1'); await B.waitForSelector('#pinVeil');
  check('?watch=1 이면 관전석이 미리 골라짐', await B.locator('#pinOb').isChecked());
  await pin(B, '2580'); await B.waitForSelector('#pinVeil', { state:'detached' }); await B.waitForTimeout(1500);
  check('B 관전석으로 열림 + 띠', await B.evaluate(() => SYNC.observer) && await B.locator('#obsBar').isVisible(), await B.locator('#obsBar').textContent());
  await B.screenshot({ path:'/tmp/tblackbox-B.png' });
  await A.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await A.waitForTimeout(800);
  check('A 는 안 밀려남', !(await A.evaluate(() => SYNC.dead)));
  check('관전석은 세희를 안 부름', !(await B.evaluate(() => aiReady())));
  const tokB = await B.evaluate(() => SYNC.token);
  const w = await fetch(SRV + '/data', { method:'POST', headers:{ authorization:'Bearer ' + tokB, 'content-type':'application/json' }, body:JSON.stringify({ puts:{ 'kv:x':1 }, dels:[] }) });
  check('관전석이 쓰려 하면 403', w.status === 403, w.status);
  await B.evaluate(() => { syncMark('kv:test'); }); check('관전석은 올릴 것을 안 모음', (await B.evaluate(() => SYNC.dirty.size)) === 0);

  // A 가 적으면 B 가 따라 봄
  await A.locator('.add input').first().fill('폰에서 방금 적은 일'); await A.locator('.add input').first().press('Enter'); await A.waitForTimeout(2500);
  await B.evaluate(() => obsTick()); await B.waitForTimeout(1200);
  check('관전석이 새 기록을 다시 그림', (await B.evaluate(() => S.pan.items.map(i => i.text))).includes('폰에서 방금 적은 일'));

  // 5분마다 금고로
  await A.evaluate(() => logPush(true)); await B.evaluate(() => logPush(true)); await A.waitForTimeout(500);
  const c = await (await fetch(SRV + '/__cron')).json();
  const vault = await (await fetch(SRV + '/__vault')).json();
  const all = vault.map(f => f.text).join('');
  check('금고에 파일이 생김', c.files >= 1 && vault.every(f => /^logs\/\d{4}-\d\d-\d\d\/\d{6}-test-\w+\.jsonl$/.test(f.path)), vault.map(f => f.path).join(', '));
  check('금고에 원문·상태·두 기기', /자세한 내용까지 다 남아야 함/.test(all) && /"type":"state"/.test(all) && /관전석/.test(all));
  check('JSONL 줄마다 읽힘', all.trim().split('\n').every(l => { try{ JSON.parse(l); return true; }catch(e){ return false; } }));
  const c2 = await (await fetch(SRV + '/__cron')).json(), v2 = await (await fetch(SRV + '/__vault')).json();
  check('보낸 줄은 다시 안 보냄', v2.length === vault.length, `${vault.length} → ${v2.length}`);

  // 개발 기록 끔 → 안 올림
  await A.evaluate(() => { localStorage.setItem('sehee.devlog', '0'); dlog('대화', '끈 뒤', '끈 뒤 원문'); });
  await A.evaluate(() => logPush(true)); await A.waitForTimeout(400);
  const g3 = await (await fetch(SRV + '/log', { headers:{ authorization:'Bearer ' + tokA } })).json();
  check('끄면 안 올라감', !g3.lines.some(l => l.d === '끈 뒤 원문'));

  // 관전석 나가기 → A 그대로
  await B.locator('#obsOut').click(); await B.waitForSelector('#pinVeil');
  await A.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await A.waitForTimeout(800);
  check('관전석 나가도 A 그대로', !(await A.evaluate(() => SYNC.dead)));
  const r = await fetch(SRV + '/session', { headers:{ authorization:'Bearer ' + tokB } });
  check('나간 관전석 표는 막힘', r.status === 401, r.status);
  // 같은 브라우저에 탭 둘 — 둘 다 빠짐없이 (v1.5.22)
  await A.evaluate(() => localStorage.setItem('sehee.devlog', '1'));
  const A2 = await A.context().newPage(); await A2.goto(APP); await A2.waitForTimeout(2500);
  await A.evaluate(() => { dlog('대화', '탭1', '탭1 원문 xyz'); }); await A2.evaluate(() => { dlog('대화', '탭2', '탭2 원문 xyz'); });
  await A.evaluate(() => logPush(true)); await A2.evaluate(() => logPush(true)); await A.waitForTimeout(400);
  await A.evaluate(() => { dlog('대화', '탭1 둘째', '탭1 둘째 xyz'); }); await A2.evaluate(() => { dlog('대화', '탭2 둘째', '탭2 둘째 xyz'); });
  await A2.evaluate(() => logPush(true)); await A.evaluate(() => logPush(true)); await A.waitForTimeout(400);
  const g4 = await (await fetch(SRV + '/log?n=500', { headers:{ authorization:'Bearer ' + tokA } })).json();
  const got = g4.lines.filter(l => /xyz/.test(l.d || '')).map(l => l.d);
  check('탭 둘 — 네 줄 다 들어감', ['탭1 원문 xyz', '탭2 원문 xyz', '탭1 둘째 xyz', '탭2 둘째 xyz'].every(x => got.includes(x)), got.join(' / '));
  check('탭마다 이름이 다름', (await A.evaluate(() => devId())) !== (await A2.evaluate(() => devId())));
  // 기기 이름 (v1.5.23)
  await A.evaluate(() => { localStorage.setItem('sehee.devname', '집 데스크탑'); dlog('설정', '이름 확인', '이름 확인 qqq'); });
  await A.evaluate(() => logPush(true)); await A.waitForTimeout(400);
  const g5 = await (await fetch(SRV + '/log?n=500', { headers:{ authorization:'Bearer ' + tokA } })).json();
  const ln = g5.lines.find(l => l.d === '이름 확인 qqq');
  check('정한 기기 이름으로 올라감', ln && /^집 데스크탑 #/.test(ln.dev), ln && ln.dev);
  check('계정 줄에도 그 이름', /집 데스크탑/.test(await A.evaluate(() => syncLine())));
  console.log('BLACKBOX bad', bad);
  await b.close();
  if (bad) process.exit(1);
})();
