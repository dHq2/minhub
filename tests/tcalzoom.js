/* tcalzoom v1 (2026-11-15, B) — 달력 확대·축소: 컴퓨터는 휠(커서 자리 고정), 끝까지 줄이면 한 달 전체가 한 화면(옆·아래로 안 넘침, 글 안 잘림),
   휠 누르고 끌기(가운데 버튼) = 손바닥, 낙서는 확대해도 같은 칸에, 처음 열 땐 오늘 쪽 확대 · 닫았다 열면 보스가 둔 대로(배율·위치) · 그사이 일정이 바뀌면 그 날을 다시 확대 · 날짜 있는 일을 적어도 달력으로 안 넘어감(calendar:true 일 때만). 폰은 두 손가락 벌리기·오므리기. 스크롤바 안 보임. 가짜 일정만 */
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  for (const [tag, opt] of [['d', { viewport:{ width:1366, height:860 } }], ['m', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }]]){
    const ctx = await b.newContext({ ...opt, locale:'ko-KR', serviceWorkers:'block' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    const open = async () => { await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded && S.today);
      await p.evaluate(() => calPageOpen()); await p.waitForSelector('#calPage.in'); await p.waitForFunction(() => $('calSheet').querySelector('.cb-ink')); await p.waitForTimeout(450); };
    await open();
    await p.evaluate(async () => { localStorage.removeItem('sehee.calZoom'); CAL.zoom = 1;
      const pr = await todayPanRef(), t = parseYmd(S.today), y = t.getFullYear(), m = pad(t.getMonth() + 1), sc = secById('sched') ? 'sched' : secs()[0].id, D = d => `${y}-${m}-${pad(d)}`;
      const add = (id, d, text, time) => pr.items.push({ id, sec:sc, text, due:D(d), ...(time ? { time } : {}), since:pr.date });
      add('z1', 12, '가상 납품 확인 전화', '10:00'); add('z2', 19, '거래처 매니저 센터 실사', '14:00'); add('z3', 19, '안전교육 (신규 입사자 필참)', '14:00'); add('z4', 19, '분기 재고 맞춰 보기', '16:00'); add('z5', 19, '저녁 거래처 통화', '18:00');
      await putPan(pr); await calLoad(); calMonth(CAL.month, true);
      INK.strokes = [{ c:'r', w:.004, p:[(3.5 / 7), .5, (3.5 / 7) + .0001, .5] }]; inkPut(INK.key, INK.strokes); calInk(); });   /* 수요일 칸 줄 가운데 점 */
    await p.waitForTimeout(250);
    const S = () => p.evaluate(() => { const sh = $('calSheet'), sr = sh.getBoundingClientRect(), g = sh.querySelector('.cb-grid').getBoundingClientRect(), its = [...sh.querySelectorAll('.cb-it')];
      const cut = its.filter(it => { const c = (it.closest('.cb-pi') || it.closest('.cb-c')).getBoundingClientRect(), r = it.getBoundingClientRect(); return r.bottom > c.bottom + 2 || r.right > c.right + 3; }).length;
      return { z:+CAL.zoom.toFixed(3), cz:+getComputedStyle(sh).getPropertyValue('--cz'), fitsW:g.width <= sr.width + 2 && sh.scrollWidth <= sh.clientWidth + 2, fitsH:sh.scrollHeight <= sh.clientHeight + 2,
        gw:Math.round(g.width), gh:Math.round(g.height), sw:Math.round(sr.width), x:Math.round(sh.scrollLeft), y:Math.round(sh.scrollTop), cut, chips:its.length, fs19:+(sh.querySelector('.cb-c[data-d$="-19"]').style.getPropertyValue('--fs') || 1),
        bar:sh.offsetWidth - sh.clientWidth, saved:localStorage.getItem('sehee.calZoom') }; });
    const at = (fx, fy) => p.evaluate(([fx, fy]) => { const sh = $('calSheet'), r = sh.getBoundingClientRect(), x = r.left + r.width * fx, y = r.top + r.height * fy, e = document.elementFromPoint(x, y), c = e && e.closest('.cb-c'); return c ? c.dataset.d : null; }, [fx, fy]);
    const dot = () => p.evaluate(() => { const cv = $('calSheet').querySelector('.cb-ink'), r = cv.getBoundingClientRect(), d = cv.width / r.width, x = cv.getContext('2d');
      const a = x.getImageData(Math.round(r.width * 3.5 / 7 * d) - 3, Math.round(r.height * .5 * d) - 3, 7, 7).data; let m = 0; for (let i = 3; i < a.length; i += 4) m = Math.max(m, a[i]);
      const c = [...document.querySelectorAll('#calSheet .cb-grid > .cb-c')], cell = c.find(el => { const q = el.getBoundingClientRect(); return q.left <= r.left + r.width * 3.5 / 7 && q.right >= r.left + r.width * 3.5 / 7 && q.top <= r.top + r.height * .5 && q.bottom >= r.top + r.height * .5; });
      return { ink:m, cell:cell && cell.dataset.d }; });
    const R = { start:await S(), dot0:await dot() };
    const sr = await p.locator('#calSheet').boundingBox(), cx = sr.x + sr.width * .5, cy = sr.y + sr.height * .45;
    if (tag === 'd'){
      for (let i = 0; i < 14; i++){ await p.mouse.move(cx, cy); await p.mouse.wheel(0, 120); await p.waitForTimeout(40); }
      await p.waitForTimeout(200); R.min = { ...(await S()), dot:await dot() }; await p.screenshot({ path:`/tmp/vcalzoom-${tag}-min.png` });
      const before = await at(.5, .45);
      for (let i = 0; i < 16; i++){ await p.mouse.move(cx, cy); await p.mouse.wheel(0, -120); await p.waitForTimeout(40); }
      await p.waitForTimeout(200); R.zin = { ...(await S()), sameUnder:before === await at(.5, .45), under:before, dot:await dot() }; await p.screenshot({ path:`/tmp/vcalzoom-${tag}-in.png` });
      const x0 = (await S()).x; await p.mouse.move(cx, cy); await p.mouse.down({ button:'middle' }); await p.mouse.move(cx - 160, cy - 40, { steps:8 }); await p.mouse.up({ button:'middle' }); await p.waitForTimeout(150);
      R.midPan = { moved:(await S()).x - x0, note:await p.evaluate(() => $('calDay').classList.contains('on')), month:await p.evaluate(() => CAL.month === parseYmd(S.today).getMonth()) };
      await p.keyboard.down('Shift'); const x1 = (await S()).x; await p.mouse.wheel(0, 200); await p.keyboard.up('Shift'); await p.waitForTimeout(150); R.shiftWheel = (await S()).x - x1;
      const z1 = (await S()).z; await p.evaluate(() => calPageClose()); await p.waitForTimeout(450); await p.evaluate(() => calPageOpen()); await p.waitForTimeout(500);
      R.reopen = { z:(await S()).z, was:z1, x:(await S()).x };
      R.focus = await p.evaluate(async () => { calPageClose(); await new Promise(r => setTimeout(r, 450));
        const t = parseYmd(S.today), nx = new Date(t.getFullYear(), t.getMonth() + 1, 3), d = ymd(nx);
        const r = await runTool({ name:'add_item', args:{ section:secById('sched') ? 'sched' : secs()[0].id, text:'가상 거래처 미팅이 있습니다', memo:'거래처 미팅', due:d, time:'15:00' } });
        const jumped = CAL.on, changed = CAL.changed, relay = calItemOf({ name:'add_item', args:{ due:d } });
        await calPageOpen(); await new Promise(r => setTimeout(r, 500));
        const sh = $('calSheet'), sr = sh.getBoundingClientRect(), c = sh.querySelector(`.cb-c[data-d="${d}"]`), q = c && c.getBoundingClientRect();
        const out = { ok:r.ok, jumped, changed, relay, month:CAL.month === nx.getMonth(), z:CAL.zoom, inView:!!q && q.left >= sr.left - 1 && q.right <= sr.right + 1 && q.top >= sr.top - 1 && q.bottom <= sr.bottom + 1, text:c && c.textContent };
        calPageClose(); await new Promise(r => setTimeout(r, 450));
        await runTool({ name:'add_item', args:{ section:secById('sched') ? 'sched' : secs()[0].id, text:'가상 회의가 있습니다', memo:'회의', due:d, calendar:true } });
        out.askedChanged = CAL.changed === d; out.askedRelay = !!calItemOf({ name:'add_item', args:{ due:d, calendar:true } }); CAL.changed = null; return out; });
    } else {
      const cdp = await ctx.newCDPSession(p), T = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints:pts });
      const pinch = async (d0, d1) => { await T('touchStart', [{ x:cx - d0, y:cy, id:1 }, { x:cx + d0, y:cy, id:2 }]); for (let i = 1; i <= 10; i++){ const d = d0 + (d1 - d0) * i / 10; await T('touchMove', [{ x:cx - d, y:cy, id:1 }, { x:cx + d, y:cy, id:2 }]); await p.waitForTimeout(16); } await T('touchEnd', []); await p.waitForTimeout(200); };
      await pinch(120, 20); await pinch(120, 30); R.min = { ...(await S()), dot:await dot(), note:await p.evaluate(() => $('calDay').classList.contains('on')) }; await p.screenshot({ path:`/tmp/vcalzoom-${tag}-min.png` });
      await pinch(30, 140); R.zin = { ...(await S()), dot:await dot() }; await p.screenshot({ path:`/tmp/vcalzoom-${tag}-in.png` });
    }
    console.log(tag, JSON.stringify(R)); console.log(tag, 'errors', errs); await ctx.close();
  }
  await b.close(); })();
