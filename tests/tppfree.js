/* tppfree v1.1 (2026-11-14, B) — v1.1: 꾹 누르기 대신 '한 번 누르면 고름 → 고른 카드는 바로 끌림 → 한 번 더 누르면 기록부'(B0.11), 안 고른 카드는 끌어도 안 움직임
   인간관계 판 자유롭게: ① 카드 누르면 고름 → ⤡ 끌어 크기(저장·다시 그려도 유지·두 번 누르면 100%)
   ② 판 끝으로 끌면 화면이 따라 굴러가고 놓으면 판이 넓어짐(가장 바깥 카드 + 150), 다시 끌면 더 멀리 ③ 가장 작은 배율 = 넓힌 판 전체 ④ 다시 열면 넓힌 판 전체가 한눈에. 폰·컴퓨터 */
const { chromium } = require('playwright');
const PEOPLE = { list:[
  { id:'p1', name:'가람', rel:'같이 일하는 사람', group:'직장', links:['p2'], at:1 }, { id:'p2', name:'도윤', rel:'동료', group:'직장', links:['p1'], at:2 },
  { id:'p3', name:'하늘', rel:'친구', group:'친구', links:[], at:3 }, { id:'p4', name:'서준', rel:'고등학교 친구', group:'친구', links:[], at:4 },
  { id:'p5', name:'엄마', rel:'가족', group:'가족', links:[], at:5 }, { id:'p6', name:'바다', rel:'지인', group:'기타', links:[], at:6 } ], theme:'cork' };
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width:412, height:915, mob:true, tag:'m' }, { width:1366, height:860, tag:'d' }]){
    const ctx = await b.newContext({ viewport:{ width:vp.width, height:vp.height }, isMobile:!!vp.mob, hasTouch:!!vp.mob, locale:'ko-KR', serviceWorkers:'block' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(1500);
    await p.evaluate(async P => { localStorage.removeItem('sehee.bonus'); await SEHEE.kvSet('people', P); await SEHEE.kvSet('b_ppPos', {}); await SEHEE.kvSet('b_ppSize', {}); }, PEOPLE);
    await p.reload(); await p.waitForTimeout(2200); await p.evaluate(() => goView('people')); await p.waitForTimeout(1200);
    const cdp = vp.mob ? await ctx.newCDPSession(p) : null;
    const T = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints:pts });
    const ctr = async sel => { const r = await p.locator(sel).first().boundingBox(); if (!r) throw new Error('안 보임 ' + sel); return [r.x + r.width / 2, r.y + r.height / 2]; };
    const tap = async (x, y) => { if (cdp) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); await p.waitForTimeout(450); };
    const pdOn = () => p.evaluate(() => $('pd').classList.contains('on'));
    async function hold(x, y, path, ms = 60){   // 눌러 path 대로 옮기고 뗌(꾹 누르기 없음)
      if (cdp){ await T('touchStart', [{ x, y }]); await p.waitForTimeout(ms); for (const [a, c] of path){ await T('touchMove', [{ x:a, y:c }]); await p.waitForTimeout(16); } await T('touchEnd', []); }
      else { await p.mouse.move(x, y); await p.mouse.down(); await p.waitForTimeout(ms); for (const [a, c] of path){ await p.mouse.move(a, c); await p.waitForTimeout(16); } await p.mouse.up(); }
      await p.waitForTimeout(700);
    }
    async function dragTo(x, y, x2, y2, steps = 10){ const path = []; for (let i = 1; i <= steps; i++) path.push([x + (x2 - x) * i / steps, y + (y2 - y) * i / steps]); return path; }
    const info = () => p.evaluate(() => { const m = $('ppMap'), sc = $('ppScroll'), sr = sc.getBoundingClientRect();
      const cards = [...m.querySelectorAll('.pp-node')].map(n => { const r = n.getBoundingClientRect(); return { id:n.dataset.pp, inView:r.left >= sr.left - 1 && r.right <= sr.right + 1 && r.top >= sr.top - 1 && r.bottom <= sr.bottom + 1, bs:n.style.getPropertyValue('--bs') || '1' }; });
      return { W:parseFloat(m.style.width), H:parseFloat(m.style.height), S:+m.dataset.s, L:+m.dataset.l, T:+m.dataset.t, zoom:+(+m.style.zoom).toFixed(3), sel:(m.querySelector('.b-sel') || {}).dataset?.pp || null, allInView:cards.every(c => c.inView), cards }; });
    const R = {}; R.start = await info();
    /* ① 고르기 → 크기 */
    let [x, y] = await ctr('[data-pp="p3"]'); await tap(x, y);
    R.selected = (await info()).sel; R.tapNoRecord = !(await pdOn());
    const [hx, hy] = await ctr('[data-pp="p3"] .b-rs');
    const [cx, cy] = [x, y], far = [cx + (hx - cx) * 1.8, cy + (hy - cy) * 1.8];
    if (cdp){ await T('touchStart', [{ x:hx, y:hy }]); for (let i = 1; i <= 8; i++){ await T('touchMove', [{ x:hx + (far[0] - hx) * i / 8, y:hy + (far[1] - hy) * i / 8 }]); await p.waitForTimeout(16); } await T('touchEnd', []); }
    else { await p.mouse.move(hx, hy); await p.mouse.down(); for (let i = 1; i <= 8; i++){ await p.mouse.move(hx + (far[0] - hx) * i / 8, hy + (far[1] - hy) * i / 8); await p.waitForTimeout(16); } await p.mouse.up(); }
    await p.waitForTimeout(600);
    R.sized = { bs:(await info()).cards.find(c => c.id === 'p3').bs, saved:await p.evaluate(() => SEHEE.kvGet('b_ppSize')), label:await p.evaluate(() => (document.querySelector('.b-rsv') || {}).textContent) };
    await p.screenshot({ path:`/tmp/vppfree-${vp.tag}-sized.png` });
    await p.evaluate(() => SEHEE.pplRedraw()); await p.waitForTimeout(600);
    R.afterRedraw = { bs:(await info()).cards.find(c => c.id === 'p3').bs, sel:(await info()).sel };
    /* 빈 곳 누르면 고름 풀림 */
    const sr = await p.locator('#ppScroll').boundingBox(); if (cdp) await p.touchscreen.tap(sr.x + 20, sr.y + 20); else await p.mouse.click(sr.x + 20, sr.y + 20); await p.waitForTimeout(400);
    R.unselected = (await info()).sel;
    /* 안 고른 카드 위에서 끌면 카드는 그대로(판만 굴러감) */
    const l1 = await p.evaluate(() => document.querySelector('#ppMap [data-pp="p1"]').style.left);
    [x, y] = await ctr('[data-pp="p1"]'); await hold(x, y, await dragTo(x, y, x + 60, y + 40, 6));
    R.unselDragStays = l1 === await p.evaluate(() => document.querySelector('#ppMap [data-pp="p1"]').style.left);
    /* ② 판 끝으로 끌기 — 고르고 바로 끎. 화면 끝에서 잠깐 머물면 판이 굴러가고, 놓으면 판이 넓어짐 */
    const before = await info();
    [x, y] = await ctr('[data-pp="p5"]'); await tap(x, y); [x, y] = await ctr('[data-pp="p5"]');
    const path = await dragTo(x, y, sr.x + 6, sr.y + sr.height / 2, 12); for (let i = 0; i < 25; i++) path.push([sr.x + 6, sr.y + sr.height / 2]);
    await hold(x, y, path);
    const after1 = await info(); R.grow1 = { W:[before.W, after1.W], L:[before.L, after1.L], pos:await p.evaluate(() => SEHEE.kvGet('b_ppPos').then(v => v.p5)), stillSel:after1.sel, noRecord:!(await pdOn()) };
    await p.screenshot({ path:`/tmp/vppfree-${vp.tag}-moved.png` });
    [x, y] = await ctr('[data-pp="p5"]');
    const path2 = await dragTo(x, y, sr.x + 6, y, 10); for (let i = 0; i < 25; i++) path2.push([sr.x + 6, y]);
    await hold(x, y, path2);
    const after2 = await info(); R.grow2 = { W:after2.W, L:after2.L, pos:await p.evaluate(() => SEHEE.kvGet('b_ppPos').then(v => v.p5)) };
    /* ③ 가장 작게 = 넓힌 판 전체 */
    if (cdp){ const c = [sr.x + sr.width / 2, sr.y + sr.height / 2]; await T('touchStart', [{ x:c[0] - 150, y:c[1] }, { x:c[0] + 150, y:c[1] }]); for (let i = 1; i <= 14; i++){ await T('touchMove', [{ x:c[0] - 150 + 10 * i, y:c[1] }, { x:c[0] + 150 - 10 * i, y:c[1] }]); await p.waitForTimeout(16); } await T('touchEnd', []); }
    else { await p.mouse.move(sr.x + sr.width / 2, sr.y + sr.height / 2); for (let i = 0; i < 25; i++){ await p.mouse.wheel(0, 300); await p.waitForTimeout(20); } }
    await p.waitForTimeout(500); const zmin = await info(); R.zoomMin = { zoom:zmin.zoom, allInView:zmin.allInView };
    await p.screenshot({ path:`/tmp/vppfree-${vp.tag}-zoomout.png` });
    /* ④ 다시 열면 넓힌 판 전체가 한눈에 */
    await p.evaluate(() => dwClose('people')); await p.waitForTimeout(500); await p.evaluate(() => goView('people')); await p.waitForTimeout(1200);
    const re = await info(); R.reopen = { zoom:re.zoom, allInView:re.allInView, W:re.W, bsP3:re.cards.find(c => c.id === 'p3').bs };
    await p.screenshot({ path:`/tmp/vppfree-${vp.tag}-reopen.png` });
    /* 한 번 누르면 고름만, 고른 카드를 한 번 더 누르면 인물 기록부 */
    [x, y] = await ctr('[data-pp="p1"]'); await tap(x, y);
    R.firstTap = { sel:(await info()).sel, record:await pdOn() };
    await tap(x, y); R.secondTapOpensRecord = await pdOn();
    console.log(vp.tag, JSON.stringify({ ...R, start:{ W:R.start.W, S:R.start.S, L:R.start.L, zoom:R.start.zoom } }));
    console.log(vp.tag, 'errors', errs); await ctx.close();
  }
  await b.close();
})();
