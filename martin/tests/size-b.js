// 마틴 점검 — 두 손가락 확대·축소는 노란 크기 손잡이를 건드리지 않음 v1.0 (2026-11-17, B). 폰 화면(412×915), 진짜 터치 두 손가락.
// ① 한 손가락은 판, 두 번째 손가락이 손잡이 → 판 확대·축소, 카드 크기 그대로
// ② 손잡이로 늘이던 중 두 번째 손가락 → 늘이던 크기는 원래대로, 판 확대·축소
// ③ 한 손가락 손잡이는 예전처럼 늘이기(그대로 되는지)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => { window.claude = { use: async n => { if (n !== 'sample') return null; const f = async () => ({ text: '' }); f.limits = async () => ({ images: true }); f.json = async () => ({ say: ['그래.'] }); return f; } }; };
const SEED = { v: 3, id: '20261117-sizeb', at: 1, turn: 2, nid: 6, nmax: 0, suspect: null, notes: [], memo: [], log: [],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 실종 사건', note: '', x: 1000, y: 820, r: 0 },
    { id: 'n5', kind: 'doc', title: '언니의 마지막 말', note: '11/12 11:42 며칠 어디 좀 다녀올게.', x: 1000, y: 1000, r: 0 }], links: [] };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(2600);
  const cdp = await ctx.newCDPSession(p);
  const touch = (type, list) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: list.map(([x, y], i) => ({ x, y, id: i + 1, radiusX: 4, radiusY: 4, force: 1 })) });
  const st = () => p.evaluate(() => { const n = nodeOf('n5'); return { k: +cam.k.toFixed(3), cw: n.cw || null, ch: n.ch || null, sc: n.sc || null }; });
  const hb = k => p.evaluate(k => { const e = document.querySelector(`#nodes .card[data-id="n5"] .szh-${k}`); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, k);
  const reset = async () => { await p.evaluate(() => { const n = nodeOf('n5'); delete n.cw; delete n.ch; delete n.sc; renderAll(); cam.x = n.x; cam.y = n.y; cam.k = .8; applyCam(0); selectCard('n5'); }); await p.waitForTimeout(300); };
  const free = () => p.evaluate(() => { const r = board.getBoundingClientRect(); return { x: r.left + 40, y: r.bottom - 120 }; });

  /* ① 판 먼저, 두 번째 손가락이 손잡이(오른쪽 변) */
  await reset(); let a = await st(); let h = await hb('r'), f = await free();
  await touch('touchStart', [[f.x, f.y]]); await p.waitForTimeout(40);
  await touch('touchStart', [[f.x, f.y], [h.x, h.y]]); await p.waitForTimeout(40);
  for (let i = 1; i <= 8; i++){ await touch('touchMove', [[f.x - 8 * i, f.y + 6 * i], [h.x + 10 * i, h.y - 8 * i]]); await p.waitForTimeout(20); }
  await touch('touchEnd', []); await p.waitForTimeout(250);
  let z = await st();
  want(z.k > a.k * 1.15, `① 판이 확대됨 ${a.k} → ${z.k}`);
  want(!z.cw && !z.ch && !z.sc, `① 카드 크기 그대로 (cw ${z.cw} · ch ${z.ch} · sc ${z.sc})`);

  /* ② 손잡이(모서리)로 늘이던 중 두 번째 손가락 */
  await reset(); a = await st(); h = await hb('c'); f = await free();
  await touch('touchStart', [[h.x, h.y]]); await p.waitForTimeout(40);
  for (let i = 1; i <= 4; i++){ await touch('touchMove', [[h.x - 10 * i, h.y + 10 * i]]); await p.waitForTimeout(20); }
  const mid = await st();
  want(mid.sc && mid.sc !== 1, `② 한 손가락일 땐 늘어나는 중 (sc ${mid.sc})`);
  const h2 = { x: h.x - 40, y: h.y + 40 };
  await touch('touchStart', [[h2.x, h2.y], [f.x, f.y]]); await p.waitForTimeout(40);
  for (let i = 1; i <= 8; i++){ await touch('touchMove', [[h2.x + 9 * i, h2.y - 9 * i], [f.x - 6 * i, f.y + 6 * i]]); await p.waitForTimeout(20); }
  await touch('touchEnd', []); await p.waitForTimeout(250);
  z = await st();
  want(!z.sc && !z.cw && !z.ch, `② 두 번째 손가락이 닿으면 늘이던 크기는 원래대로 (sc ${z.sc})`);
  want(z.k > a.k * 1.1, `② 그대로 판 확대·축소로 넘어감 ${a.k} → ${z.k}`);
  want(await p.evaluate(() => !document.querySelector('#nodes .card.sizing')), '② 늘이기 표시도 꺼짐');

  /* ③ 한 손가락 손잡이 = 예전처럼 늘이기 */
  await reset(); a = await st(); h = await hb('r');
  await touch('touchStart', [[h.x, h.y]]); await p.waitForTimeout(40);
  for (let i = 1; i <= 8; i++){ await touch('touchMove', [[h.x + 8 * i, h.y]]); await p.waitForTimeout(20); }
  await touch('touchEnd', []); await p.waitForTimeout(250);
  z = await st();
  want(z.cw && Math.abs(z.k - a.k) < .001, `③ 한 손가락 손잡이는 가로 늘이기 그대로 (cw ${z.cw}, 판 배율 ${z.k})`);
  await p.screenshot({ path: '/tmp/martin-크기-두손가락.png' });

  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); if (bad){ console.log(`실패 ${bad}`); process.exit(1); } console.log('전부 통과');
})();
