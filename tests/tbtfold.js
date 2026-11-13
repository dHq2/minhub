/* tbtfold v1.1 (2026-11-14, B — 대화 보기 없음·▶▷ 끌기 추가, 스크린샷 /tmp)  v1 (2026-11-13, B) — 대화 상자 옆으로 접기: 판·보드·사람 상자 이름표 끌기/누르기 → 접힘, 꼬리 당기기/누르기 → 펴짐,
   짧게 끌면 제자리, 접힌 채 새 답 → 빨간 점, 다시 켜도 기억. 폰(손가락)·컴퓨터(마우스) 둘 다 */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width:412, height:915, mob:true, tag:'m' }, { width:1366, height:860, tag:'d' }]){
    const ctx = await b.newContext({ viewport:{ width:vp.width, height:vp.height }, isMobile:!!vp.mob, hasTouch:!!vp.mob, locale:'ko-KR', serviceWorkers:'block' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(400);
    await p.evaluate(() => { ['pan', 'board', 'people'].forEach(k => localStorage.removeItem('sehee.fold.' + k)); localStorage.removeItem('sehee.ptFold'); });
    await p.reload(); await p.waitForTimeout(2200); await p.evaluate(() => goView('pan')); await p.waitForTimeout(800);
    await p.evaluate(() => { O.log.push({ who:'u', text:'오늘 할 일 정리해 줘', at:Date.now() - 5000 }); O.log.push({ who:'s', text:'판에 세 가지 남았어요. 공지 올리기부터 하시면 돼요.', face:3, at:Date.now() - 4000 }); renderPanTalk(); });
    const cdp = vp.mob ? await ctx.newCDPSession(p) : null;
    const center = async sel => { const r = await p.locator(sel).first().boundingBox(); if (!r) throw new Error('안 보임 ' + sel); return [r.x + r.width / 2, r.y + r.height / 2]; };
    async function drag(sel, dx, steps = 10){
      const [x, y] = await center(sel);
      if (cdp){ const T = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints:pts });
        await T('touchStart', [{ x, y }]); for (let i = 1; i <= steps; i++){ await T('touchMove', [{ x:x + dx * i / steps, y }]); await p.waitForTimeout(16); } await T('touchEnd', []); }
      else { await p.mouse.move(x, y); await p.mouse.down(); for (let i = 1; i <= steps; i++){ await p.mouse.move(x + dx * i / steps, y); await p.waitForTimeout(16); } await p.mouse.up(); }
      await p.waitForTimeout(450);
    }
    async function tap(sel){ const [x, y] = await center(sel); if (cdp) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); await p.waitForTimeout(450); }
    const st = box => p.evaluate(s => { const e = document.querySelector(s); const pk = e.querySelector('.bt-peek'), r = pk.getBoundingClientRect();
      return { folded:e.classList.contains('sfold'), h:Math.round(e.getBoundingClientRect().height), peekVis:getComputedStyle(pk).display !== 'none', peekRight:Math.round(innerWidth - r.right), dot:pk.classList.contains('new') }; }, box);
    const R = {};
    const PT = '#panTalk .pt-box';
    R.pan0 = await st(PT); R.pth0 = await p.evaluate(() => getComputedStyle(document.body).getPropertyValue('--pth'));
    await drag('#ptName', 40, 4); R.panShort = await st(PT);                       // 짧게 끌기 → 제자리
    await drag('#ptName', 260); R.panDragged = await st(PT);                       // 길게 끌기 → 접힘
    R.pthFold = await p.evaluate(() => getComputedStyle(document.body).getPropertyValue('--pth')); R.saved = await p.evaluate(() => localStorage.getItem('sehee.fold.pan'));
    await p.screenshot({ path:`/tmp/vbtfold-${vp.tag}-pan-folded.png` });
    await p.evaluate(() => { O.log.push({ who:'s', text:'참고로 내일은 보강반 공지가 먼저예요.', face:0, at:Date.now() }); });
    await p.waitForTimeout(1200); R.panDot = await st(PT);                          // 접힌 채 새 답 → 빨간 점
    await drag(`${PT} .bt-peek`, -20, 3); R.peekShort = await st(PT);               // 꼬리 조금 당기기 → 다시 접힘
    await drag(`${PT} .bt-peek`, -260); R.peekPulled = await st(PT);                // 꼬리 당기기 → 펴짐
    await tap('#ptName'); R.tagTap = await st(PT);                                   // 이름표 누르기 → 접힘
    await tap(`${PT} .bt-peek`); R.peekTap = await st(PT);                           // 꼬리 누르기 → 펴짐
    await p.screenshot({ path:`/tmp/vbtfold-${vp.tag}-pan-open.png` });
    /* v1.5.11 — 대화 보기 단추 없음, 이름 옆 ▶▷ 가 있고 그걸 끌어도 접힘 */
    R.allBtns = await p.evaluate(() => [...document.querySelectorAll('button')].filter(x => /대화 보기/.test(x.textContent)).length);
    R.hint = await p.evaluate(() => { const h = document.querySelector('#ptName .bt-hint'); return h ? { text:h.textContent, op:getComputedStyle(h.querySelector('span')).animationName } : null; });
    await drag('#ptName .bt-hint', 260); R.hintDrag = await st(PT);
    await tap(`${PT} .bt-peek`); R.hintReopen = await st(PT);
    await drag('#ptName', 260);
    await p.reload(); await p.waitForTimeout(2200); await p.evaluate(() => goView('pan')); await p.waitForTimeout(800); R.afterReload = await st(PT);   // 다시 켜도 접힌 채
    await tap(`${PT} .bt-peek`);
    /* 보드 서랍 */
    await p.evaluate(() => goView('board')); await p.waitForTimeout(900);
    await drag('#dw-board .bt-name b', 260); R.board = await st('#dw-board .bt');
    await p.screenshot({ path:`/tmp/vbtfold-${vp.tag}-board-folded.png` });
    await tap('#dw-board .bt-peek'); R.boardOpen = await st('#dw-board .bt');
    /* 사람 서랍(실험 B 상자) */
    await p.evaluate(() => { closeDrawer && closeDrawer(); }).catch(() => {}); await p.evaluate(() => goView('people')); await p.waitForTimeout(1200);
    const hasPpl = await p.locator('#bPpTalk').count();
    if (hasPpl){ await drag('#bPpTalk .bt-name b', 260); R.people = await st('#bPpTalk'); await p.screenshot({ path:`/tmp/vbtfold-${vp.tag}-people-folded.png` }); await tap('#bPpTalk .bt-peek'); R.peopleOpen = await st('#bPpTalk'); }
    else R.people = '실험 B 꺼짐';
    console.log(vp.tag, JSON.stringify(R));
    console.log(vp.tag, 'errors', errs); await ctx.close();
  }
  await b.close();
})();
