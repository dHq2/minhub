/* tcalink v1 (2026-11-15, B) — 달력 칠판 낙서: 받침대 마커를 들면 그림(보드는 안 움직이고 쪽지도 안 열림), 다른 색, 지우개로 문지르면 지워짐(일정 글씨는 그대로),
   지우개 두 번 톡 = 싹 지우기 + 되돌리기, 다시 누르면 내려놓기(다시 밀림), 새로 열어도 남아 있음, 달마다 따로. 폰(터치)·컴퓨터(마우스). 가짜 일정만 */
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  for (const [tag, opt] of [['m', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }], ['d', { viewport:{ width:1366, height:860 } }]]){
    const ctx = await b.newContext({ ...opt, locale:'ko-KR', serviceWorkers:'block' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    const cdp = tag === 'm' ? await ctx.newCDPSession(p) : null;
    const open = async () => { await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded && S.today);
      await p.evaluate(() => calPageOpen()); await p.waitForSelector('#calPage.in'); await p.waitForFunction(() => $('calSheet').querySelector('.cb-ink')); await p.waitForTimeout(450); };
    await open();
    await p.evaluate(async () => { const pr = await todayPanRef(), t = parseYmd(S.today), y = t.getFullYear(), m = pad(t.getMonth() + 1), sc = secById('sched') ? 'sched' : secs()[0].id;
      pr.items.push({ id:'ik1', sec:sc, text:'가상 회의실 점검', due:`${y}-${m}-${pad(t.getDate())}`, since:pr.date }); await putPan(pr); await calLoad(); calMonth(CAL.month, true); });
    await p.waitForTimeout(200);
    const tap = async (x, y) => { if (tag === 'm') await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); };
    const tool = async (t, dy = 0) => { const r = await p.locator(`#cal .cp-tray [data-t="${t}"]`).boundingBox(); await tap(r.x + r.width / 2, r.y + r.height / 2 + dy); await p.waitForTimeout(120); };
    const drag = async (pts) => { const sr = await p.locator('#calSheet').boundingBox(), P = pts.map(([fx, fy]) => ({ x:sr.x + sr.width * fx, y:sr.y + sr.height * fy }));
      if (cdp){ const T = (type, tp) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints:tp }); await T('touchStart', [P[0]]);
        for (let i = 1; i < P.length; i++) for (let k = 1; k <= 6; k++){ const a = P[i - 1], c = P[i]; await T('touchMove', [{ x:a.x + (c.x - a.x) * k / 6, y:a.y + (c.y - a.y) * k / 6 }]); await p.waitForTimeout(12); }
        await T('touchEnd', []); }
      else { await p.mouse.move(P[0].x, P[0].y); await p.mouse.down(); for (let i = 1; i < P.length; i++) await p.mouse.move(P[i].x, P[i].y, { steps:6 }); await p.mouse.up(); }
      await p.waitForTimeout(150); };
    const ink = (fx, fy) => p.evaluate(([fx, fy]) => { const sh = $('calSheet'), cv = sh.querySelector('.cb-ink'), sr = sh.getBoundingClientRect(), cr = cv.getBoundingClientRect();
      const x = sr.left + sr.width * fx - cr.left, y = sr.top + sr.height * fy - cr.top, d = cv.width / cv.clientWidth;
      const a = cv.getContext('2d').getImageData(Math.round(x * d) - 2, Math.round(y * d) - 2, 5, 5).data; let m = 0; for (let i = 3; i < a.length; i += 4) m = Math.max(m, a[i]); return m; }, [fx, fy]);
    const st = () => p.evaluate(() => ({ tool:INK.tool, n:INK.strokes.length, pen:$('calSheet').classList.contains('pen'), on:[...document.querySelectorAll('#cal .cp-tray .on')].map(i => i.dataset.t),
      saved:(JSON.parse(localStorage.getItem('sehee.calInk') || '{}')[INK.key] || []).length, x:Math.round($('calSheet').scrollLeft), note:$('calDay').classList.contains('on') }));
    const R = {};
    await tool('k', -14); R.pickNear = await st(); await tool('k'); R.putDown = await st();   /* 마커 조금 위(안내 줄 쪽)를 눌러도 집힘 · 다시 누르면 내려놓기 */
    await tool('r'); R.pick = await st();
    const x0 = R.pick.x;
    await drag([[0.15, 0.35], [0.5, 0.42], [0.85, 0.36]]); R.red = { ...(await st()), px:await ink(0.5, 0.42) };
    await tool('b'); await drag([[0.2, 0.62], [0.8, 0.66]]); R.blue = { ...(await st()), px:await ink(0.5, 0.64) };
    await p.screenshot({ path:`/tmp/vcalink-${tag}-1.png` });
    await tool('er'); await drag([[0.38, 0.40], [0.62, 0.42], [0.38, 0.43], [0.62, 0.41]]);
    R.erase = { ...(await st()), redGone:await ink(0.5, 0.42), redLeft:await ink(0.17, 0.355), blueStays:await ink(0.5, 0.64), textStays:await p.evaluate(() => $('calSheet').textContent.includes('가상 회의실 점검')) };
    await p.screenshot({ path:`/tmp/vcalink-${tag}-2.png` });
    await p.waitForTimeout(450); await tool('er'); await tool('er');   /* 두 번 톡 */
    R.wipe = { ...(await st()), px:await ink(0.5, 0.64), undo:await p.evaluate(() => $('toast').classList.contains('on') && $('toastUndo').style.display !== 'none') };
    await p.locator('#toastUndo').click({ timeout:4000 }); await p.waitForTimeout(150); R.undo = { ...(await st()), px:await ink(0.5, 0.64) };
    await p.waitForTimeout(450); await tool('er'); R.down = await st();   /* 내려놓기 → 다시 밀림 */
    await drag([[0.85, 0.5], [0.2, 0.5]]); R.panAgain = { moved:(await st()).x !== R.down.x, n:(await st()).n };
    await p.waitForTimeout(450); await open(); R.reload = { ...(await st()), px:await ink(0.5, 0.64) - 0 };
    await p.locator('[data-cal="nm"]').click(); await p.waitForTimeout(300); R.next = await st();
    await p.locator('[data-cal="pm"]').click(); await p.waitForTimeout(300); R.back = await st();
    R.closeDrops = await p.evaluate(() => { inkSet('r'); calPageClose(); return INK.tool; });
    console.log(tag, JSON.stringify(R)); console.log(tag, 'errors', errs); await ctx.close();
  }
  await b.close(); })();
