// 마틴 점검 — 고른 카드 크기 손잡이 v1.0 (2026-11-16, C)
// 확인: 고르면 손잡이 셋 · 오른쪽 변 = 가로(위쪽 고정) · 아래 변 = 세로 · 왼쪽 아래 모서리 = 통째 확대(오른쪽 위 고정) · 실이 따라감 ·
//       손잡이는 판 배율과 상관없이 손가락 크기 · 두 번 누르면 원래대로 · 되돌리기 · 다시 열어도 크기 남음 · 판 끌기와 안 엉킴
// 쓰는 법: bash martin/tests/run.sh size   (스크린샷 /tmp/martin-크기.png — 손잡이·늘인 카드를 직접 연다)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const MOCK = () => { window.claude = { use: async n => { if (n !== 'sample') return null; const f = async () => ({ text: '' }); f.limits = async () => ({ images: true }); f.json = async () => ({ say: ['봐라.'] }); return f; } }; };
const SEED = { v: 3, id: '20261116-size', at: 1, turn: 2, nid: 6, nmax: 0, suspect: null, notes: [], memo: [], log: [{ who: 'm', text: '하! 판이다.', at: 2 }],
  nodes: [{ id: 'n1', kind: 'brief', title: '가짜 실종 사건', note: '', x: 1000, y: 820, r: 0 },
    { id: 'n3', kind: 'person', title: '김지민', note: '실종자', x: 860, y: 1060, r: 1 },
    { id: 'n5', kind: 'doc', title: '언니의 마지막 말', note: '11/12 11:42 며칠 어디 좀 다녀올게. 엄마한테는 출장이라고 해줘.', x: 1080, y: 1060, r: 0 }],
  links: [{ a: 'n3', b: 'n5', id: 'n3-n5', label: '본인말', sure: true }] };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const p = await b.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(MOCK);
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(2600);
  const node = () => p.evaluate(() => { const n = nodeOf('n5'); return { x: n.x, y: n.y, w: n.w, h: n.h, cw: n.cw, ch: n.ch, sc: n.sc, k: cam.k }; });
  const hb = k => p.evaluate(k => { const e = document.querySelector(`#nodes .card[data-id="n5"] .szh-${k}`); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; }, k);
  const pin = () => p.evaluate(() => [...document.querySelectorAll('#strings path, #xl path')].map(d => d.getAttribute('d')).join('|'));
  const center = () => p.evaluate(() => { const n = nodeOf('n5'); cam.x = n.x; cam.y = n.y; applyCam(0); });
  const dragBy = async (k, dx, dy) => { await center(); await p.waitForTimeout(120); const h = await hb(k); await p.mouse.move(h.x, h.y); await p.mouse.down(); for (let i = 1; i <= 8; i++){ await p.mouse.move(h.x + dx * i / 8, h.y + dy * i / 8); await p.waitForTimeout(16); } await p.mouse.up(); await p.waitForTimeout(400); };

  want(!(await hb('r')), '고르기 전엔 손잡이 없음');
  await p.evaluate(() => selectCard('n5')); await p.waitForTimeout(300);
  const hr = await hb('r'), hbb = await hb('b'), hc = await hb('c');
  want(hr && hbb && hc, '고르면 손잡이 셋(오른쪽 변·아래 변·왼쪽 아래 모서리)');
  want(hr && Math.abs(hr.h - 64) < 6 && Math.abs(hc.w - 44) < 6, `손잡이는 판 배율과 상관없이 손가락 크기 (${hr && hr.w.toFixed(0)}×${hr && hr.h.toFixed(0)}, 모서리 ${hc && hc.w.toFixed(0)})`);
  await p.screenshot({ path: '/tmp/martin-크기-손잡이.png' });

  /* 가로 */
  let a = await node(); const top0 = a.y - a.h / 2, left0 = a.x - a.w / 2, s0 = await pin();
  await dragBy('r', 70, 0);
  let z = await node();
  want(z.cw && Math.abs(z.w - (a.w + 70 / a.k)) < 6, `오른쪽 변 → 가로 늘어남 ${a.w} → ${z.w} (cw ${z.cw})`);
  want(Math.abs((z.x - z.w / 2) - left0) < 2 && Math.abs((z.y - z.h / 2) - top0) < 2, '가로 늘일 때 왼쪽·위쪽 제자리');
  want(z.h < a.h, `가로가 넓어지니 글이 덜 접혀 키가 줄어듦 ${a.h} → ${z.h}`);
  want((await pin()) !== s0, '실이 카드를 따라감');

  /* 세로 */
  a = z; await dragBy('b', 0, 90); z = await node();
  want(z.ch && Math.abs(z.h - (a.h + 90 / a.k)) < 8, `아래 변 → 세로 늘어남 ${a.h} → ${z.h} (ch ${z.ch})`);
  want(Math.abs((z.y - z.h / 2) - (a.y - a.h / 2)) < 2, '세로 늘일 때 위쪽 제자리');

  /* 통째 확대 — 오른쪽 위 고정 */
  a = z; const tr = { x: a.x + a.w / 2, y: a.y - a.h / 2 };
  await dragBy('c', -60, 60); z = await node();
  want(z.sc > 1.15 && Math.abs(z.w / a.w - z.sc) < .05, `모서리 → 통째 확대 sc ${z.sc} (보이는 너비 ${a.w} → ${z.w})`);
  want(Math.abs(z.x + z.w / 2 - tr.x) < 3 && Math.abs(z.y - z.h / 2 - tr.y) < 3, '확대할 때 오른쪽 위 모서리 제자리');
  const hc2 = await hb('c'); want(hc2 && Math.abs(hc2.w - 44) < 6, `확대된 카드에서도 손잡이 크기 그대로 (${hc2 && hc2.w.toFixed(0)})`);
  await p.screenshot({ path: '/tmp/martin-크기.png' });

  /* 줄이기 */
  a = z; await dragBy('c', 70, -70); z = await node();
  want(z.sc < a.sc, `모서리 안쪽으로 → 축소 ${a.sc} → ${z.sc}`);

  /* 두 번 누르면 원래대로(그 크기만) */
  const scBefore = (await node()).sc; await center(); await p.waitForTimeout(120); const c3 = await hb('c'); await p.mouse.dblclick(c3.x, c3.y); await p.waitForTimeout(400); z = await node();
  want(!z.sc && z.cw && z.ch, `모서리 두 번 → 확대·축소만 원래대로 (sc ${z.sc}, cw ${z.cw}, ch ${z.ch})`);

  /* 되돌리기 */
  await p.waitForTimeout(900); await p.click('#btnUndo'); await p.waitForTimeout(500); z = await node();
  want(z.sc && z.sc === scBefore, `되돌리기 → 확대·축소 돌아옴 (sc ${z.sc}, 원래대로 하기 전 ${scBefore})`);
  const toast = await p.evaluate(() => (document.querySelector('.undo-toast') || {}).textContent || '');
  want(/크기 바꿈/.test(toast), `되돌리기 띠 「${toast}」`);

  /* 손잡이를 끌어도 판이 굴러가거나 고름이 풀리지 않음 */
  await center(); await p.waitForTimeout(150); const cam0 = await p.evaluate(() => ({ x: cam.x, y: cam.y })); await dragBy('b', 0, -30);
  const cam1 = await p.evaluate(() => ({ x: cam.x, y: cam.y, sel: SELC }));
  want(cam0.x === cam1.x && cam0.y === cam1.y && cam1.sel === 'n5', '손잡이 끌기는 판 끌기·고름과 안 엉킴');

  /* 다시 열어도 크기 남음 */
  await p.waitForTimeout(1200); const before = await node(); await p.reload(); await p.waitForTimeout(2600);
  const after = await p.evaluate(() => { const n = nodeOf('n5'), el = document.querySelector('#nodes .card[data-id="n5"]'); return { cw: n.cw, ch: n.ch, sc: n.sc, w: n.w, el: el.style.width }; });
  want(after.cw === before.cw && after.ch === before.ch && after.sc === before.sc && after.el === before.cw + 'px', `다시 열어도 크기 그대로 (${JSON.stringify(after)})`);
  want(!errs.length, '페이지 오류 없음 ' + errs.join(' / '));
  await b.close(); process.exit(bad ? 1 : 0);
})();
