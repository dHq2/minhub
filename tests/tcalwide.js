/* tcalwide v1 (2026-11-15, B) — 달력 가로 보드: 칸 넉넉히(폰 한 화면 3~4일) 옆으로 밀어 보기, 매직 글씨(개구 굵게·마커 색·기울임),
   글은 자르지도 줄이지도 않음(+N 없음, 칸 밖으로 안 넘침, 넘치는 주만 길어짐), 열면 오늘이 보임, 옆으로 밀어도 달은 그대로(‹ › 로만), 날짜 누르면 쪽지. 폰·컴퓨터. 가짜 일정만 */
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  for (const [tag, opt] of [['m', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }], ['d', { viewport:{ width:1366, height:860 } }]]){
    const ctx = await b.newContext({ ...opt, locale:'ko-KR', serviceWorkers:'block' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded && S.today);
    await p.evaluate(async () => { const pr = await todayPanRef(), t = parseYmd(S.today), y = t.getFullYear(), m = pad(t.getMonth() + 1), sc = secById('sched') ? 'sched' : secs()[0].id, D = d => `${y}-${m}-${pad(d)}`;
      const add = (id, d, text, time, sec) => pr.items.push({ id, sec:sec || sc, text, due:D(d), ...(time ? { time } : {}), since:pr.date });
      add('k1', 18, '가상설비 이사장 방문(B동 3번 도어 점검, 전날 확인 전화)', '10:00'); add('k2', 17, '인사팀 서류 원본 등본 제출', null, 'today'); add('k3', 17, '아이 체육복 준비', null, 'me');
      add('k4', 19, '거래처 매니저 센터 실사', '14:00'); add('k5', 19, '안전교육 (신규 입사자 필참)', '14:00'); add('k6', 19, '가족 병원 동행', '14:30'); add('k7', 19, '분기 재고 맞춰 보기', '16:00');
      add('k8', 19, '저녁 거래처 통화', '18:00'); add('k9', 19, '연말 물량 계획 받아 공유하기', null); add('k10', 20, '송별회 (가상 화로, 회비 2만원)', '18:30');
      await putPan(pr); await goDate(S.today); });
    await p.evaluate(() => calPageOpen()); await p.waitForSelector('#calPage.in');
    await p.waitForFunction(() => getComputedStyle($('calSheet')).getPropertyValue('--cbw')); await p.evaluate(() => document.fonts.ready);
    await p.waitForFunction(() => document.fonts.check('700 16px Gaegu'), null, { timeout:8000 }).catch(() => {});
    const R = {};
    R.board = await p.evaluate(() => { const sh = $('calSheet'), its = [...sh.querySelectorAll('.cb-it')], cs = getComputedStyle(its[0]);
      const cut = its.filter(it => { const c = it.closest('.cb-c').getBoundingClientRect(), r = it.getBoundingClientRect(); return r.bottom > c.bottom + 1 || r.right > c.right + 2 || it.scrollHeight > it.clientHeight + 1; }).map(it => it.textContent.slice(0, 8));
      const t = sh.querySelector('.cb-c.today'), tr = t && t.getBoundingClientRect(), sr = sh.getBoundingClientRect();
      const col = sh.querySelector('.cb-grid > .cb-c').getBoundingClientRect().width;
      return { wide:sh.classList.contains('wide'), scrollW:sh.scrollWidth > sh.clientWidth + 2, colsInView:+(sh.clientWidth / col).toFixed(1), chips:its.length, more:sh.querySelectorAll('.more').length, cut,
        font:cs.fontFamily.split(',')[0], fontSize:parseFloat(cs.fontSize), gaegu:document.fonts.check('700 16px Gaegu'), colors:[...new Set(its.map(it => getComputedStyle(it).color))].length, todayInView:!!tr && tr.left >= sr.left - 1 && tr.right <= sr.right + 1,
        tilt:its.some(it => getComputedStyle(it).transform !== 'none'), rowH:[...sh.querySelectorAll('.cb-grid > .cb-c')].filter((_, i) => i % 7 === 0).map(c => Math.round(c.getBoundingClientRect().height)) }; });
    await p.screenshot({ path:`/tmp/vcalwide-${tag}-1.png` });
    /* 옆으로 밀기 — 보드가 움직이고 달은 그대로 */
    const m0 = await p.evaluate(() => CAL.month), x0 = await p.evaluate(() => $('calSheet').scrollLeft), sr = await p.locator('#calSheet').boundingBox();
    if (tag === 'm'){ const cdp = await ctx.newCDPSession(p), T = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints:pts });
      await T('touchStart', [{ x:sr.x + sr.width * 0.85, y:sr.y + 120 }]); for (let i = 1; i <= 10; i++){ await T('touchMove', [{ x:sr.x + sr.width * (0.85 - i * 0.07), y:sr.y + 122 }]); await p.waitForTimeout(16); } await T('touchEnd', []); }
    else { await p.mouse.move(sr.x + sr.width * 0.85, sr.y + 120); await p.mouse.down(); await p.mouse.move(sr.x + sr.width * 0.2, sr.y + 122, { steps:8 }); await p.mouse.up(); }
    await p.waitForTimeout(500);
    R.swipe = await p.evaluate(([m0, x0]) => ({ sameMonth:CAL.month === m0, moved:Math.round($('calSheet').scrollLeft - x0) }), [m0, x0]);
    await p.screenshot({ path:`/tmp/vcalwide-${tag}-2.png` });
    /* ‹ › 로 달 바꿈 */
    await p.locator('[data-cal="nm"]').click(); await p.waitForFunction(m0 => CAL.month !== m0, m0);
    R.nextMonth = await p.evaluate(() => ({ title:$('cpTitle').textContent, left:$('calSheet').scrollLeft }));
    await p.locator('[data-cal="pm"]').click(); await p.waitForFunction(m0 => CAL.month === m0, m0);
    /* 날짜 누르면 쪽지 */
    await p.evaluate(() => { const c = document.querySelector('#calSheet [data-d$="-18"]'); c.scrollIntoView({ inline:'center', block:'nearest' }); }); await p.waitForTimeout(200);
    const c18 = await p.locator('#calSheet [data-d$="-18"]').boundingBox();
    if (tag === 'm') await p.touchscreen.tap(c18.x + c18.width / 2, c18.y + c18.height / 2); else await p.mouse.click(c18.x + c18.width / 2, c18.y + c18.height / 2);
    await p.waitForFunction(() => $('calDay').classList.contains('on'), null, { timeout:3000 }).catch(() => {});
    R.note = await p.evaluate(() => ({ on:$('calDay').classList.contains('on'), text:$('calDay').textContent.includes('가상설비') }));
    console.log(tag, JSON.stringify(R)); console.log(tag, 'errors', errs); await ctx.close();
  }
  await b.close(); })();
