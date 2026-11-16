// 카드 고르기·옮기기 점검 v1.0 (2026-11-16, A) — 세희 인간관계 판 방식: 한 번 = 고름 · 고른 카드 한 번 더 = 상세 · 고른 카드 끌기 = 옮김 · 안 고른 카드/빈 곳 끌기 = 판 굴리기 · 빈 곳 = 고름 풀림 · 휠·두 손가락 = 그 자리 중심 확대. 폰(터치)·마우스. · v1.1 (11-17): 빈 곳 누름은 벽시계 아래
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:8790/martin/';
const SEED = { v: 3, id: '20261116-move', at: 1, nodes: [{ id: 'n1', kind: 'brief', title: '가짜 사건', note: '', x: 1000, y: 820, r: 0 }, { id: 'n3', kind: 'person', title: '김지민', note: '총무', x: 900, y: 1050, r: 0 }, { id: 'n4', kind: 'clue', title: '열쇠', note: '반납', x: 1120, y: 1060, r: 2 }],
  links: [{ id: 'n4-n3', a: 'n4', b: 'n3', label: '반납', sure: true }], log: [{ who: 'p', text: '이전', at: 1 }], memo: [], notes: [], nmax: 0, turn: 2, nid: 5, suspect: null };
(async () => {
  const b = await chromium.launch(); const errs = []; let bad = 0;
  const want = (ok, what) => { console.log((ok ? '  ok  ' : '  XX  ') + what); if (!ok) bad++; };
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.claude = { use: async () => null }; });
  await p.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await p.goto(URL); await p.waitForTimeout(3000);
  const ctr = id => p.evaluate(id => { const r = document.querySelector(`#nodes [data-id="${id}"] h4`).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  const ptr = (type, id, x, y) => p.evaluate(([type, id, x, y]) => { const el = document.elementFromPoint(x, y) || board; el.dispatchEvent(new PointerEvent(type, { pointerId: id, clientX: x, clientY: y, bubbles: true, pointerType: 'touch', isPrimary: id === 1, button: 0 })); }, [type, id, x, y]);
  const dragBy = async (from, dx, dy) => { await ptr('pointerdown', 1, from.x, from.y); for (let i = 1; i <= 8; i++) await ptr('pointermove', 1, from.x + dx * i / 8, from.y + dy * i / 8); await ptr('pointerup', 1, from.x + dx, from.y + dy); await p.waitForTimeout(200); };
  // 1) 안 고른 카드 끌기 = 판 굴리기
  let c = await ctr('n3'); const cam0 = await p.evaluate(() => [cam.x, cam.y]); const n0 = await p.evaluate(() => [nodeOf('n3').x, nodeOf('n3').y]);
  await dragBy(c, -60, 0);
  const cam1 = await p.evaluate(() => [cam.x, cam.y]), n1 = await p.evaluate(() => [nodeOf('n3').x, nodeOf('n3').y]);
  want(cam1[0] > cam0[0] + 20 && n1.join() === n0.join(), '안 고른 카드를 끌면 판이 굴러감(카드는 그대로)');
  // 2) 한 번 누르면 고름
  c = await ctr('n3'); await p.touchscreen.tap(c.x, c.y); await p.waitForTimeout(250);
  want(await p.evaluate(() => SELC === 'n3' && document.querySelector('#nodes [data-id="n3"]').classList.contains('sel')), '한 번 누르면 고름(테두리)');
  // 3) 고른 카드 끌기 = 옮김
  const before = await p.evaluate(() => [nodeOf('n3').x, nodeOf('n3').y, cam.x]); c = await ctr('n3');
  await dragBy(c, 80, 50);
  const after = await p.evaluate(() => [nodeOf('n3').x, nodeOf('n3').y, cam.x, JSON.parse(localStorage.getItem('drmartin.v2')).nodes.find(n => n.id === 'n3').x, document.querySelector('#xl .str').getAttribute('d')]);
  want(Math.abs(after[0] - before[0] - 80 / (await p.evaluate(() => cam.k))) < 6 && after[2] === before[2], '고른 카드를 끌면 카드만 옮겨짐 ' + before.slice(0, 2) + ' → ' + after.slice(0, 2));
  want(after[3] === after[0], '옮긴 자리 저장');
  want(after[4].includes(String(after[0])), '실도 따라감 ' + after[4].slice(0, 40));
  // 4) 고른 카드 한 번 더 = 상세
  c = await ctr('n3'); await p.touchscreen.tap(c.x, c.y); await p.waitForTimeout(400);
  want(await p.evaluate(() => $('#app').classList.contains('open') && $('#sheet').textContent.includes('김지민')), '고른 카드를 한 번 더 누르면 상세');
  await p.screenshot({ path: '/tmp/martin-move-sheet.png' });
  await p.evaluate(() => closeSheet()); await p.waitForTimeout(300);
  // 5) 빈 곳 = 고름 풀림
  await p.evaluate(() => selectCard('n4')); const bx = await p.evaluate(() => { const r = board.getBoundingClientRect(); return { x: r.left + 20, y: r.top + 110 }; });   /* 11-17 A: 왼쪽 위 모서리엔 벽시계가 걸려 있다 — 그 아래 빈 곳 */
  await p.touchscreen.tap(bx.x, bx.y); await p.waitForTimeout(200);
  want(await p.evaluate(() => SELC === null && !document.querySelector('#nodes .card.sel')), '빈 곳을 누르면 고름 풀림');
  // 6) 두 손가락 = 그 자리 중심 확대
  const mid = await ctr('n4'); const w0 = await p.evaluate(([x, y]) => { const r = board.getBoundingClientRect(); return [cam.k, cam.x + (x - r.left - r.width / 2) / cam.k, cam.y + (y - r.top - r.height / 2) / cam.k]; }, [mid.x, mid.y]);
  await ptr('pointerdown', 1, mid.x - 40, mid.y); await ptr('pointerdown', 2, mid.x + 40, mid.y);
  for (let i = 1; i <= 6; i++){ await ptr('pointermove', 1, mid.x - 40 - i * 10, mid.y); await ptr('pointermove', 2, mid.x + 40 + i * 10, mid.y); }
  await ptr('pointerup', 1, mid.x - 100, mid.y); await ptr('pointerup', 2, mid.x + 100, mid.y); await p.waitForTimeout(200);
  const w1 = await p.evaluate(([x, y]) => { const r = board.getBoundingClientRect(); return [cam.k, cam.x + (x - r.left - r.width / 2) / cam.k, cam.y + (y - r.top - r.height / 2) / cam.k]; }, [mid.x, mid.y]);
  want(w1[0] > w0[0] * 1.8 && Math.abs(w1[1] - w0[1]) < 6 && Math.abs(w1[2] - w0[2]) < 6, '두 손가락 확대 — 손가락 사이 그 자리는 그대로 ' + w0[0].toFixed(2) + '→' + w1[0].toFixed(2));
  await p.screenshot({ path: '/tmp/martin-move.png' });
  await ctx.close();
  // 7) 마우스: 휠 확대 · 누르기·끌기 똑같이
  const m = await b.newPage({ viewport: { width: 412, height: 915 } }); m.on('pageerror', e => errs.push(e.message));
  await m.addInitScript(() => { window.claude = { use: async () => null }; });
  await m.addInitScript(s => { if (!sessionStorage.getItem('s')){ localStorage.clear(); localStorage.setItem('drmartin.v2', s); localStorage.setItem('drmartin.seen', 'v9.9.9'); sessionStorage.setItem('s', 1); } }, JSON.stringify(SEED));
  await m.goto(URL); await m.waitForTimeout(2500);
  const mc = await m.evaluate(() => { const r = document.querySelector('#nodes [data-id="n4"] h4').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  const k0 = await m.evaluate(() => cam.k); await m.mouse.move(mc.x, mc.y); await m.mouse.wheel(0, -300); await m.waitForTimeout(150);
  want(await m.evaluate(k0 => cam.k > k0, k0), '휠 = 확대');
  const mc2 = await m.evaluate(() => { const r = document.querySelector('#nodes [data-id="n4"] h4').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await m.mouse.click(mc2.x, mc2.y); await m.waitForTimeout(150); const x0 = await m.evaluate(() => nodeOf('n4').x);
  await m.mouse.move(mc2.x, mc2.y); await m.mouse.down(); await m.mouse.move(mc2.x + 60, mc2.y + 10, { steps: 6 }); await m.mouse.up(); await m.waitForTimeout(250);
  want(await m.evaluate(x0 => nodeOf('n4').x > x0 + 20 && SELC === 'n4', x0), '마우스도 고르고 끌어 옮김');
  want(!errs.length, '페이지 오류 ' + JSON.stringify(errs));
  await b.close(); console.log(bad ? `실패 ${bad}` : '전부 통과'); process.exit(bad ? 1 : 0);
})();
