/* tdwstack v1 (2026-11-13, B) — 서류철을 진짜처럼: 오른쪽 서류철 묶음, 견출지를 끌면 서류철 왼쪽 끝에 붙어 1:1 로 딸려 나옴,
   다 열리면 견출지가 사무실 왼쪽 끝에 살짝(틀 밖은 잘림), 그 견출지 누르기·머리 끌기·✕ 로 닫으면 제자리, 다른 견출지는 그대로. 폰·컴퓨터 */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width:412, height:915, mob:true, tag:'m' }, { width:1366, height:860, tag:'d' }]){
    const ctx = await b.newContext({ viewport:{ width:vp.width, height:vp.height }, isMobile:!!vp.mob, hasTouch:!!vp.mob, locale:'ko-KR', serviceWorkers:'block' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/'); await p.waitForTimeout(2200); await p.evaluate(() => goView('office')); await p.waitForTimeout(700);
    const cdp = vp.mob ? await ctx.newCDPSession(p) : null;
    const box = async sel => { const r = await p.locator(sel).first().boundingBox(); if (!r) throw new Error('안 보임 ' + sel); return r; };
    async function drag(x, y, dx, steps = 8, hold = false){
      if (cdp){ const T = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints:pts });
        await T('touchStart', [{ x, y }]); for (let i = 1; i <= steps; i++){ await T('touchMove', [{ x:x + dx * i / steps, y }]); await p.waitForTimeout(16); } if (!hold){ await T('touchEnd', []); await p.waitForTimeout(600); } return () => T('touchEnd', []); }
      await p.mouse.move(x, y); await p.mouse.down(); for (let i = 1; i <= steps; i++){ await p.mouse.move(x + dx * i / steps, y); await p.waitForTimeout(16); }
      if (!hold){ await p.mouse.up(); await p.waitForTimeout(600); } return () => p.mouse.up();
    }
    async function tap(x, y){ if (cdp) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); await p.waitForTimeout(700); }
    const geo = () => p.evaluate(() => { const o = $('office').getBoundingClientRect(), st = $('dwStack').getBoundingClientRect(), tab = k => document.querySelector(`#dwTabs [data-dw=${k}]`).getBoundingClientRect(), dl = $('dw-people').getBoundingClientRect();
      const t = tab('people'), cp = document.querySelector('#dwTabs [data-dw=people]').style.clipPath;
      return { open:DW.open, stackW:Math.round(st.width), stackAtRight:Math.round(o.right - st.right), tabR:Math.round(t.right - o.left), tabL:Math.round(t.left - o.left), drawerL:Math.round(dl.left - o.left), officeW:Math.round(o.width),
        clip:cp || '', calHome:Math.round(o.right - tab('cal').right), boardHome:Math.round(o.right - tab('board').right) }; });
    const R = {};
    R.closed = await geo();
    const t0 = await box('#dwTabs [data-dw=people]'); const x = t0.x + t0.width / 2, y = t0.y + t0.height / 2;
    const end = await drag(x, y, -150, 10, true);
    R.mid = await geo(); await p.screenshot({ path:`vdwstack-${vp.tag}-pulling.png` });
    await end(); await p.waitForTimeout(800);
    R.opened = await geo(); await p.screenshot({ path:`vdwstack-${vp.tag}-open.png` });
    /* 살짝 보이는 견출지를 누르면 닫힘 */
    const g = R.opened, o = await box('#office');
    await tap(o.x + Math.max(3, (g.tabR) / 2) * (o.width / g.officeW), y);
    R.tapClosed = await geo();
    /* 짧게 끌면 다시 들어감 */
    const t1 = await box('#dwTabs [data-dw=people]');
    await drag(t1.x + t1.width / 2, t1.y + t1.height / 2, -50, 5);
    R.shortPull = await geo();
    /* 누르면 열림 → 머리 끌어 닫는 동안 견출지도 따라감 → ✕ */
    await tap(t1.x + t1.width / 2, t1.y + t1.height / 2); R.tapOpen = await geo();
    const h = await box('#dw-people .dw-head b');
    const end2 = await drag(h.x + h.width / 2, h.y + h.height / 2, 120, 6, true);
    R.headDrag = await geo(); await end2(); await p.waitForTimeout(800);
    R.afterHead = await geo();
    if (R.afterHead.open){ await p.locator('#dw-people .dw-x').click(); await p.waitForTimeout(800); }
    R.closedAgain = await geo();
    console.log(vp.tag, JSON.stringify(R));
    console.log(vp.tag, 'errors', errs); await ctx.close();
  }
  await b.close();
})();
