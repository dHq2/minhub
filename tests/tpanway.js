const { chromium } = require('playwright');
// v1.0 (2026-11-13, C) 판 일간보고 방식 — 끝·알바노·내일·기억만 단추, 같은 단추 다시 = 취소, 내일 판에 🔁, 세희가 읽는 판 글
(async () => { const b = await chromium.launch();
  for (const [name, opt] of [['폰', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }], ['컴', { viewport:{ width:1366, height:860 } }]]){
    const ctx = await b.newContext({ ...opt, serviceWorkers:'block' }); const p = await ctx.newPage();
    const tap = sel => name === '폰' ? p.locator(sel).tap() : p.locator(sel).click();
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
    await p.evaluate(async () => { const pr = await todayPanRef();
      pr.items.push({ id:'w1', sec:'today', text:'회의 자료 출력 전달', since:pr.date }, { id:'w2', sec:'today', text:'옆 반 교재 주문 확인', since:pr.date },
        { id:'w3', sec:'today', text:'결석표 셋 시트 확인', since:'2026-11-10' }, { id:'w4', sec:'today', text:'선물 포장 전달 확인', since:pr.date, note:'포장 끝 · 가방은 안 줘도 됨' });
      await putPan(pr); await goDate(S.today); render(); goView('pan'); });
    await p.waitForTimeout(700);
    const st = id => p.evaluate(id => { const it = findItem(id), r = document.querySelector(`.it[data-id="${id}"]`);
      return { way:wayOf(it), done:!!it.done, later:it.later || '', sec:it.sec, ok:r ? (r.querySelector('.wyok') || {}).textContent || '' : '(안 보임)', on:r ? [...r.querySelectorAll('.wy.on')].map(x => x.textContent).join(',') : '' }; }, id);
    await p.screenshot({ path:`/tmp/panway-${name}-0.png` });
    await tap('.it[data-id="w1"] .wy[data-w="끝"]'); await p.waitForTimeout(250);
    console.log(name, '끝', JSON.stringify(await st('w1')), '| 完', await p.evaluate(() => (document.querySelector('.it[data-id="w1"] .seal') || {}).textContent));
    await tap('.it[data-id="w2"] .wy[data-w="알바노"]'); await p.waitForTimeout(250); console.log(name, '알바노', JSON.stringify(await st('w2')));
    await tap('.it[data-id="w3"] .wy[data-w="내일"]'); await p.waitForTimeout(250); console.log(name, '내일', JSON.stringify(await st('w3')), '| 칸 세기', await p.evaluate(() => document.querySelector('.sec[data-sec="today"] .cnt').textContent));
    await tap('.it[data-id="w4"] .wy[data-w="기억만"]'); await p.waitForTimeout(250); console.log(name, '기억만', JSON.stringify(await st('w4')));
    await p.waitForTimeout(400); await p.screenshot({ path:`/tmp/panway-${name}-1.png`, fullPage:false });
    await p.evaluate(() => document.querySelector('.it[data-id="w4"]').scrollIntoView({ block:'center' })); await p.waitForTimeout(200);
    await p.screenshot({ path:`/tmp/panway-${name}-2.png` });
    await tap('.it[data-id="w4"] .wy[data-w="기억만"]'); await p.waitForTimeout(250); console.log(name, '기억만 취소', JSON.stringify(await st('w4')));
    await tap('.it[data-id="w1"] .wy[data-w="끝"]'); await p.waitForTimeout(250); console.log(name, '끝 취소', JSON.stringify(await st('w1')));
    await tap('.it[data-id="w1"] .ck'); await p.waitForTimeout(250); console.log(name, '完 동그라미로도', JSON.stringify(await st('w1')));
    await tap('.it[data-id="w4"] .wy[data-w="기억만"]'); await p.waitForTimeout(250);
    console.log(name, '누른 기록', await p.evaluate(() => ['w1','w2','w3','w4'].map(id => id + ':' + (findItem(id).wayLog || []).map(x => x.w).join('>')).join(' ')));
    // 세희가 읽는 판 글
    const ctxt = await p.evaluate(() => panContext());
    console.log(name, '세희 판 글 — 내일 칸:', ctxt.includes('내일로 미룬 일') && /내일로 미룬 일[^]*결석표 셋/.test(ctxt), '| 안 끝난 일에 결석표 없음:', !/안 끝난 일:[^]*결석표 셋[^]*받은 것/.test(ctxt), '| 알바노 표시:', ctxt.includes('옆 반 교재 주문 확인 (알바노'), '| 기억만 표시:', ctxt.includes('(보스: 기억만'));
    // 다시 켜도 남음
    await p.reload(); await p.waitForTimeout(1600);
    console.log(name, '다시 켬', await p.evaluate(async () => { const pr = await todayPanRef(); return pr.items.filter(i => /^w/.test(i.id)).map(i => i.id + ':' + (i.done ? (i.way || '끝') : i.later ? '내일' : i.way || '-')).join(' '); }));
    // 내일 판 — 내일 누른 일은 🔁 로, 끝·알바노는 안 넘어감, 기억만은 기억 칸 그대로
    const tm = await p.evaluate(async () => { const t = parseYmd(S.today); t.setDate(t.getDate() + 1); const d = ymd(t);
      const pn = await makeToday(d); const g = id => pn.items.find(i => i.id === id);
      const r = { w1:!!g('w1'), w2:!!g('w2'), w3:g('w3') && { back:g('w3').back, later:g('w3').later || '' }, w4:g('w4') && { sec:g('w4').sec, way:g('w4').way } };
      await goDate(d); render(); const row = document.querySelector('.it[data-id="w3"]'); r.mk = row ? (row.querySelector('.mk') || {}).textContent : '';
      return r; });
    console.log(name, '내일 판', JSON.stringify(tm));
    await p.waitForTimeout(300); await p.screenshot({ path:`/tmp/panway-${name}-3.png` });
    await ctx.close();
  }
  await b.close(); })();
