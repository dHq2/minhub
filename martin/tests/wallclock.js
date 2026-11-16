// 벽시계 점검 v1.0 (2026-11-17, A) — 판 왼쪽 위에 걸림 · 사건 시계(10:50 + S.clock.ms)를 가리킴 · 보이는 동안 흐름 · 누르면 크게
// 쓰는 법: bash martin/tests/run.sh wallclock   (스크린샷 /tmp/martin-벽시계.png, /tmp/martin-벽시계-크게.png)
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const SEED = { v: 3, id: '20261117-wc', at: 1, turn: 1, nid: 3, notes: [], memo: [], links: [], clock: { ms: 125000, start: '10:50' },
  log: [{ who: 'p', text: '가짜', at: 1 }, { who: 'm', text: '가짜 답', at: 2 }], nodes: [{ id: 'n1', kind: 'brief', title: '가짜 사건', note: '', x: 1000, y: 900, r: 0 }] };
(async () => {
  const b = await chromium.launch(); let bad = 0; const errs = [];
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.claude = { use: async () => null }; });
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.evaluate(() => dispatchEvent(new Event('focus'))); await p.waitForTimeout(1500);
  const box = await p.$eval('#wallclock', e => { const r = e.getBoundingClientRect(), bd = document.getElementById('board').getBoundingClientRect(); return { l: r.left - bd.left, t: r.top - bd.top, w: r.width, h: r.height }; });
  want(box.l < 20 && box.t < 20 && box.w >= 50, `판 왼쪽 위에 걸림 (${Math.round(box.l)},${Math.round(box.t)} ${Math.round(box.w)}×${Math.round(box.h)})`);
  const t1 = await p.$eval('#wallclock', e => e.dataset.t);
  want(/^10:52:0\d$/.test(t1), `사건 시계 10:50 + 2분 5초 남짓을 가리킴 (${t1})`);
  const ang = await p.$eval('#wallclock .wc-m', e => e.getAttribute('transform'));
  want(/rotate\(31[0-9]\./.test(ang), `분침이 52분 쪽 (${ang})`);
  await p.waitForTimeout(2200);
  const t2 = await p.$eval('#wallclock', e => e.dataset.t);
  const sec = t => { const [h, m, s] = t.split(':').map(Number); return h * 3600 + m * 60 + s; };
  want(sec(t2) - sec(t1) >= 2 && sec(t2) - sec(t1) <= 4, `보이는 동안 실제 속도로 흐름 (${t1} → ${t2})`);
  await p.screenshot({ path: '/tmp/martin-벽시계.png', clip: { x: 0, y: 0, width: 412, height: 420 } });
  await p.tap('#wallclock'); await p.waitForTimeout(800);
  const big = await p.evaluate(() => ({ face: !!document.querySelector('#sheet .wc-big .wc-face'), info: (document.getElementById('wcInfo') || {}).textContent || '' }));
  want(big.face && /10:5\d:\d\d/.test(big.info) && big.info.includes('들인 시간'), '누르면 크게 + 사건 시계·들인 시간 ' + JSON.stringify(big.info.slice(0, 60)));
  await p.screenshot({ path: '/tmp/martin-벽시계-크게.png' });
  const last = await p.evaluate(() => JSON.parse(localStorage.getItem('drmartin.log') || '[]').filter(e => e.type === 'action').pop());
  want(last && last.act === '벽시계 크게', '행동 기록에 남음');
  want(!errs.length, '페이지 오류 없음 ' + errs.join(' | '));
  await b.close(); console.log(bad ? `\n실패 ${bad}` : '\n전부 통과'); process.exit(bad ? 1 : 0);
})();
