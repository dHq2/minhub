// 사진 크게 보기 점검 v1.3 (2026-11-17, D — v1.3 B: 화면 안내는 상태 + 원칙 4 「말이 가리키는 것에 답한다」). 폰 화면.
// v1.0 바깥 눌러 닫기 → v1.1 사진 띄운 채 한 말: 막 띄운 첫마디 / 띄워 둔 채 이어지는 대화를 프롬프트가 가르는지
// v1.1 → v1.2 (11-17): 폰 톡톡 두 번 눌러 확대 — 손가락이 0.09초 닿는 실제 톡, 손 뗀 뒤 0.3초 간격까지 확대, 세 번째 톡이 되돌리지 않음
// 사진 위 톡 → 그대로 · 바깥 끌기 → 그대로 · 바깥 톡 → 닫힘. 스크린샷 /tmp/martin-사진보기.png
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const SEED = { v: 3, id: '20261116-pv', at: 1, nodes: [{ id: 'n1', kind: 'brief', title: '가짜 실종 사건', note: '', x: 1000, y: 1000, r: 0 }], links: [], log: [], memo: [], turn: 1, nid: 2, suspect: null };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, hasTouch: false });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.claude = { use: async () => null }; });
  await p.addInitScript(s => { localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(3000);
  const open = () => p.evaluate(() => { const c = document.createElement('canvas'); c.width = 300; c.height = 600; const g = c.getContext('2d'); g.fillStyle = '#9fb3c8'; g.fillRect(0, 0, 300, 600); g.fillStyle = '#fff'; g.fillRect(30, 40, 200, 60);
    if (!S.nodes.some(n => n.id === 'n9')) S.nodes.push({ id: 'n9', kind: 'photo', title: '가짜 캡처', note: '', x: 1100, y: 1100, r: 0, mid: c.toDataURL() }); openPv('n9'); });
  const isOpen = () => p.evaluate(() => document.getElementById('pv').classList.contains('on'));
  await open(); await p.waitForTimeout(600);
  const r = await p.evaluate(() => { const a = document.getElementById('pvI').getBoundingClientRect(), s = document.getElementById('pvS').getBoundingClientRect(); return { a: [a.left, a.top, a.right, a.bottom], s: [s.left, s.top, s.right, s.bottom] }; });
  want(r.a[0] - r.s[0] > 20, `사진 옆에 바깥 자리가 있다 ${JSON.stringify(r)}`);
  await p.screenshot({ path: '/tmp/martin-사진보기.png' });
  const cx = (r.a[0] + r.a[2]) / 2, cy = (r.a[1] + r.a[3]) / 2, ox = (r.s[0] + r.a[0]) / 2, oy = cy;
  await p.mouse.click(cx, cy); await p.waitForTimeout(400);
  want(await isOpen(), '사진 위 톡 → 그대로');
  await p.mouse.move(ox, oy); await p.mouse.down(); await p.mouse.move(ox + 60, oy + 40, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(400);
  want(await isOpen(), '바깥에서 끌기 → 그대로');
  await p.evaluate(() => pvFit()); await p.waitForTimeout(200);
  await p.mouse.click(ox, oy); await p.waitForTimeout(400);
  want(!(await isOpen()), '바깥 톡 → 닫힘');
  await open(); await p.waitForTimeout(600);
  await p.mouse.click(ox, r.s[3] - 20); await p.waitForTimeout(400);
  want(!(await isOpen()), '다시 열고 아래 바깥 톡 → 닫힘');
  await p.close();
  /* 11-16 D: 사진 띄운 채 한 말 — 프롬프트의 화면 안내 */
  const q = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  q.on('pageerror', e => errs.push(e.message));
  await q.addInitScript(() => { window.__pr = []; window.claude = { use: async n => { if (n !== 'sample') return null; const f = async () => ({ text: '' }); f.limits = async () => ({ images: true });
    f.json = async pr => { window.__pr.push(String(pr)); await new Promise(r => setTimeout(r, 150)); return { say: ['그래.'] }; }; return f; } }; });
  await q.addInitScript(s => { localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); }, JSON.stringify(SEED));
  await q.goto(URL); await q.waitForTimeout(3000);
  await q.evaluate(() => { const c = document.createElement('canvas'); c.width = 200; c.height = 300; c.getContext('2d').fillRect(0, 0, 200, 300);
    S.nodes.push({ id: 'n9', kind: 'photo', title: '가짜 캡처', note: '', x: 1100, y: 1100, r: 0, mid: c.toDataURL() }); openPv('n9'); });
  const say = async t => { await q.click('#msg'); await q.keyboard.type(t); await q.keyboard.press('Enter'); await q.waitForFunction(n => window.__pr.length >= n && !busy, (await q.evaluate(() => window.__pr.length)) + 1, { timeout: 15000 }); await q.waitForTimeout(400); return q.evaluate(() => window.__pr[window.__pr.length - 1]); };
  let pr = await say('여기 이 사람 누구야');
  want(/화면 — 동료 옆에/.test(pr) && /저절로 뜬 것일 수도/.test(pr) && /동료의 말이 가리키는 것에 답한다 — 화면에 떠 있는 사진/.test(pr) && !/띄운 뒤로 동료가/.test(pr), '띄운 뒤 첫마디 → 화면은 상태, 「말이 가리키는 것에 답한다」(원칙 4 — 11-17 B)');
  pr = await say('평소에도 가족이랑 연락했을까?');
  want(/띄운 뒤로 동료가 1번 더 말했다/.test(pr) && /단서일 뿐 화제가 아니다/.test(pr), '띄워 둔 채 이어지는 말 → 몇 번 더 말했는지 상태 + 원칙 4');
  want(await q.evaluate(() => (S.log.filter(l => l.who === 'p').pop() || {}).viewing === 'n9'), '대화창 꼬리표 「보면서」는 그대로');
  await q.close();
  /* 11-17 D: 폰 톡톡 — 터치 기기로 */
  const tc = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }), t = await tc.newPage();
  t.on('pageerror', e => errs.push(e.message));
  await t.addInitScript(() => { window.claude = { use: async () => null }; });
  await t.addInitScript(s => { localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); }, JSON.stringify(SEED));
  await t.goto(URL); await t.waitForTimeout(3000);
  await t.evaluate(() => { const c = document.createElement('canvas'); c.width = 1080; c.height = 2400; c.getContext('2d').fillRect(0, 0, 1080, 2400);
    S.nodes.push({ id: 'n9', kind: 'photo', title: '가짜 캡처', note: '', x: 1100, y: 1100, r: 0, mid: c.toDataURL('image/jpeg', .7) }); openPv('n9'); });
  await t.waitForTimeout(800);
  const cdp = await tc.newCDPSession(t), c0 = await t.evaluate(() => { const a = document.getElementById('pvI').getBoundingClientRect(); return [a.left + a.width / 2, a.top + a.height / 2]; });
  const tap = async (dx = 0) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c0[0] + dx, y: c0[1] }] }); await t.waitForTimeout(90); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
  const kNow = () => t.evaluate(() => PV.k), kFit = await kNow();
  await tap(); await t.waitForTimeout(280); await tap(8); await t.waitForTimeout(350);
  want((await kNow()) > kFit * 1.2, '폰 톡톡(손 뗀 뒤 0.28초) → 확대');
  await tap(); await t.waitForTimeout(450);
  want((await kNow()) > kFit * 1.2, '확대된 채 세 번째 톡 → 되돌리지 않음');
  await tap(); await t.waitForTimeout(150); await tap(); await t.waitForTimeout(350);
  want(Math.abs((await kNow()) - kFit) < 1e-6, '확대된 채 톡톡 → 원래 크기');
  await tap(); await t.waitForTimeout(500); await tap(); await t.waitForTimeout(350);
  want(Math.abs((await kNow()) - kFit) < 1e-6, '느린 두 번(0.5초) → 그대로');
  await tc.close();
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
