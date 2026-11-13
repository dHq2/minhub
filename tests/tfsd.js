const { chromium } = require('playwright');
// v1.0 (2026-11-14, C) 글씨 크기 따로 — 판 가−·가+ 는 할 일 칸만, 설정 대화 글씨 −1·+1·기본은 말풍선·대화 상자만, 다시 켜도 남음
(async () => { const b = await chromium.launch();
  for (const [name, opt] of [['폰', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }], ['컴', { viewport:{ width:1366, height:860 } }]]){
    const ctx = await b.newContext({ ...opt, serviceWorkers:'block' }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    const tap = sel => name === '폰' ? p.locator(sel).first().tap() : p.locator(sel).first().click();
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(1800);
    await p.evaluate(async () => { const pr = await todayPanRef(); pr.items.push({ id:'f1', sec:'today', text:'글씨 크기 확인용 할 일', since:pr.date }); await putPan(pr); await goDate(S.today); render();
      O.log.push({ who:'u', text:'보스 말 글씨', at:Date.now() }, { who:'s', text:'[미소] 세희 말 글씨', face:2, at:Date.now() + 1 }); renderLog(); goView('pan'); });
    await p.waitForTimeout(700);
    const m = () => p.evaluate(() => { const fs = el => el ? Math.round(parseFloat(getComputedStyle(el).fontSize) * 100) / 100 : null, tx = document.querySelector('.it[data-id="f1"] .tx');
      return { 판글: tx ? Math.round(tx.getBoundingClientRect().height * 10) / 10 : null, 판줌: getComputedStyle(document.querySelector('#main .sec')).zoom, 날짜줄: fs(document.getElementById('day')), 말풍선: fs(document.querySelector('.msg.u')), 세희말: fs(document.querySelector('.msg.s')), 대화상자: fs(document.querySelector('.bt-bub')), panD:S.settings.panD || 0, chatD:S.settings.chatD || 0 }; });
    const t0 = await m(); console.log(name, '처음', JSON.stringify(t0));
    const navOk = await p.evaluate(() => { const h = $('panHead').getBoundingClientRect(), up = $('panFsUp').getBoundingClientRect(), x = $('panX').getBoundingClientRect();
      return up.top >= h.top && up.bottom <= h.bottom && up.right <= x.left; });
    console.log(name, '판 머리 띠에 가−·가+ (✕ 왼쪽)', navOk);
    await p.screenshot({ path:`/tmp/fsd-${name}-0.png` });
    for (let i = 0; i < 2; i++){ await tap('#panFsDn'); await p.waitForTimeout(200); }
    const t1 = await m(); console.log(name, '판 가− 두 번', JSON.stringify(t1), '| 알림', await p.evaluate(() => $('toastMsg').textContent));
    await p.screenshot({ path:`/tmp/fsd-${name}-1.png` });
    for (let i = 0; i < 10; i++){ await tap('#panFsDn'); await p.waitForTimeout(60); }
    console.log(name, '끝까지 줄이면', await p.evaluate(() => S.settings.panD), '|', await p.evaluate(() => $('toastMsg').textContent));
    await tap('#panFsUp'); await p.waitForTimeout(200); console.log(name, '가+', await p.evaluate(() => S.settings.panD));
    // 설정 — 대화 글씨
    await p.evaluate(() => settingsSheet()); await p.waitForTimeout(400);
    await p.evaluate(() => document.querySelector('[data-sact="fsd"][data-k="chatD"]').scrollIntoView({ block:'center' }));
    await tap('[data-sact="fsd"][data-k="chatD"][data-d="-1"]'); await p.waitForTimeout(300);
    await tap('[data-sact="fsd"][data-k="chatD"][data-d="-1"]'); await p.waitForTimeout(300);
    console.log(name, '설정 숫자', await p.evaluate(() => [$('fsdN-chatD').textContent, $('fsdN-panD').textContent].join(' / ')), '| 기본으로 단추', await p.locator('[data-sact="fsd"][data-k="chatD"][data-d="0"]').count());
    await p.evaluate(() => document.querySelector('[data-sact="fsd"][data-k="chatD"]').scrollIntoView({ block:'center' })); await p.waitForTimeout(150);
    await p.screenshot({ path:`/tmp/fsd-${name}-2.png` });
    await p.evaluate(() => closeSheet()); await p.waitForTimeout(300);
    const t2 = await m(); console.log(name, '대화 −2 뒤', JSON.stringify(t2));
    await p.reload(); await p.waitForTimeout(1800); await p.evaluate(() => { renderLog(); goView('office'); }); await p.waitForTimeout(500);
    console.log(name, '다시 켬', JSON.stringify(await p.evaluate(() => ({ panD:S.settings.panD, chatD:S.settings.chatD, z:getComputedStyle(document.documentElement).getPropertyValue('--pan-z').trim(), d:getComputedStyle(document.documentElement).getPropertyValue('--chat-d').trim() }))));
    await p.screenshot({ path:`/tmp/fsd-${name}-3.png` });
    await p.evaluate(async () => { await stepFsd('chatD', 0); await stepFsd('panD', 0); });
    console.log(name, '기본으로', await p.evaluate(() => [S.settings.panD, S.settings.chatD].join(',')), '| 오류', errs);
    await ctx.close();
  }
  await b.close(); })();
