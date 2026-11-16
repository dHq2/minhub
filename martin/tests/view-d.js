// 사진 크게 보기 — 바깥 눌러 닫기 점검 v1.0 (2026-11-16, D). 폰 화면.
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
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
