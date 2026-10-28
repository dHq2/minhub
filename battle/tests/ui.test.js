// 화면 시험 (Playwright · 모바일 세로 + PC 가로): 막사 → 준비 → 조작 → 전투 → 결과.  dist/battle.html 이 먼저 빌드돼 있어야 함.
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { console.log('playwright 없음 — 화면 시험 건너뜀'); process.exit(0); }
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'dist', 'battle.html');
const OUT = process.env.UI_OUT || path.join(__dirname, '..', 'build', 'shots');
require('fs').mkdirSync(OUT, { recursive: true });
let fails = 0; const ok = (c, s) => { console.log((c ? '  OK   ' : '  FAIL ') + s); if (!c) fails++; };

(async () => {
  const browser = await chromium.launch();
  for (const [name, vp, mobile] of [['mobile', { width: 390, height: 800 }, true], ['pc', { width: 1280, height: 800 }, false]]) {
    console.log('\n== ' + name);
    const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile, deviceScaleFactor: 2 });
    const page = await ctx.newPage(); const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
    page.on('pageerror', e => errs.push(e.message.slice(0, 200)));
    await page.goto(URL); await page.waitForTimeout(400);
    await page.click('#hClose'); await page.click('#btnStart'); await page.waitForTimeout(400);
    const box = await page.locator('#cv').boundingBox();
    const toS = (x, y) => page.evaluate(([a, b]) => GB.app.view.toS(a, b), [x, y]).then(p => ({ x: box.x + p.x, y: box.y + p.y }));
    const q = fn => page.evaluate(fn);
    ok(await q(() => !!GB.app.B && !GB.app.B.started), '준비 단계에서 열림');
    await page.screenshot({ path: OUT + '/' + name + '_prep.png' });
    // 칩으로 보병1 고르기 → 땅 탭 = 이동 (0초: 바로 걸림)
    await page.dispatchEvent('.chip[data-i="1"]', 'pointerdown');
    ok(await q(() => GB.app.ui.sel.has(1)), '칩 탭으로 고르기');
    const u1 = await q(() => { const u = GB.app.B.W.units[1]; return { x: u.x, y: u.y }; });
    let p = await toS(u1.x + 8, u1.y);
    // 입력 체계: 마우스 왼쪽 클릭 = 빈 땅은 선택 해제 (명령 아님), 오른쪽 클릭 = 이동. 터치 탭 = 이동
    await page.mouse.click(p.x, p.y);
    ok(await q(() => !GB.app.B.W.units[1].order && GB.app.ui.sel.size === 0), '마우스 왼쪽 클릭(빈 땅) = 선택 해제, 명령 없음');
    await page.dispatchEvent('.chip[data-i="1"]', 'pointerdown');
    await page.mouse.click(p.x, p.y, { button: 'right' });
    ok(await q(() => GB.app.B.W.units[1].order && GB.app.B.W.units[1].order.k === 'move'), '마우스 오른쪽 클릭(땅) = 이동 명령');
    if (mobile) {
      await page.dispatchEvent('.chip[data-i="2"]', 'pointerdown'); const p2 = await toS(u1.x + 6, u1.y + 4); await page.touchscreen.tap(p2.x, p2.y);
      ok(await q(() => GB.app.B.W.units[2].order && GB.app.B.W.units[2].order.k === 'move'), '터치 탭(땅) = 이동 명령');
    }
    // 관계 설정 흐름: 아군을 누르면 관계 칸 → 대장 지정 → 부하 1명 이상 → 확정 (없으면 파기)
    await page.dispatchEvent('.chip[data-i="0"]', 'pointerdown');
    ok(await q(() => !!document.querySelector('#info [data-rel="boss"]')), '아군을 고르면 관계 칸(대장 지정 단추)이 나옴');
    await page.dispatchEvent('#info [data-rel="boss"]', 'pointerdown');
    ok(await q(() => !!GB.app.ui.rel && !document.getElementById('relBar').classList.contains('hidden')), '대장 지정 시작: 확정 줄이 뜸');
    ok(await q(() => document.querySelector('#relBar [data-relact="ok"]').disabled), '부하가 0명이면 확정이 막힘');
    await page.dispatchEvent('#relBar [data-relact="no"]', 'pointerdown');
    ok(await q(() => !GB.app.ui.rel && !GB.app.B.W.units.some(u => u.side === 0 && u.chiefLk && u.sqLead === 0)), '파기하면 관계가 만들어지지 않음');
    await page.dispatchEvent('.chip[data-i="0"]', 'pointerdown'); await page.dispatchEvent('#info [data-rel="boss"]', 'pointerdown');
    await page.dispatchEvent('.chip[data-i="2"]', 'pointerdown'); await page.dispatchEvent('.chip[data-i="3"]', 'pointerdown');
    await page.dispatchEvent('#relBar [data-relact="ok"]', 'pointerdown'); await page.waitForTimeout(100);
    ok(await q(() => GB.app.B.W.units.filter(u => u.side === 0 && u.chiefLk && u.sqLead === 0).length === 2), '부하 2명을 골라 확정하면 대장-부하가 만들어짐');
    await page.dispatchEvent('.chip[data-i="0"]', 'pointerdown'); await page.dispatchEvent('#info [data-rel="cut"]', 'pointerdown');
    await page.click('#tabs .tab[data-tab="t3"]');
    await page.click('#bAll'); ok(await q(() => GB.app.ui.sel.size === 4), '전체 선택');
    await page.click('#bCut');
    // 기술 단추: 투창은 창을 든 이(보병1)만, 응급처치는 의무병만, 돌격은 돌진 가능한 이
    await page.dispatchEvent('.chip[data-i="3"]', 'pointerdown');   // 사수1: 기술 없음
    ok(await q(() => document.getElementById('skills').classList.contains('hidden')), '사수를 고르면 기술 줄이 숨음');
    await page.dispatchEvent('.chip[data-i="1"]', 'pointerdown');   // 보병1: 창 + 의무
    ok(await q(() => !document.getElementById('sThrow').classList.contains('hidden') && !document.getElementById('sHeal').classList.contains('hidden') && !document.getElementById('sCharge').classList.contains('hidden')), '보병1(창·의무): 돌격 · 투창 · 응급처치 모두 보임');
    await page.dispatchEvent('.chip[data-i="0"]', 'pointerdown');   // 탱커1: 창 없음
    ok(await q(() => document.getElementById('sThrow').classList.contains('hidden') && !document.getElementById('sCharge').classList.contains('hidden')), '탱커1: 투창은 숨고 돌격은 보임');
    await page.click('#zRange'); ok(await q(() => GB.app.ui.detail), '범위 보기 켬'); await page.screenshot({ path: OUT + '/' + name + '_range.png' }); await page.click('#zRange');
    // 전투 개시
    await page.click('#btnPlay'); await page.waitForTimeout(2500);
    ok(await q(() => GB.app.B.started && GB.app.B.W.t > 1), '전투가 진행됨 (t=' + (await q(() => GB.app.B.W.t.toFixed(1))) + ')');
    // 정지 → 명령(지휘관을 거쳐 닿음) → 재개
    await page.click('#btnPlay'); ok(await q(() => GB.app.B.paused), '일시정지');
    const foe = await q(() => { const f = GB.app.B.W.units.find(u => u.side === 1 && u.alive); return { x: f.x, y: f.y, i: f.i }; });
    await page.dispatchEvent('.chip[data-i="0"]', 'pointerdown');
    p = await toS(foe.x, foe.y); await page.mouse.click(p.x, p.y); await page.waitForTimeout(100);
    ok(await q(() => { const u = GB.app.B.W.units[0]; return !!(u.order || u.ordPend); }), '마우스 왼쪽 클릭(적) = 공격 명령');
    await page.screenshot({ path: OUT + '/' + name + '_paused.png' });
    await page.click('#btnBack'); ok(await q(() => !!document.getElementById('sgRun') && !!document.getElementById('sgYes')), '전투 중 ← 단추: 철수 · 항복 · 계속 선택 창');
    await page.click('#sgNo');
    await page.click('#btnSpeed'); await page.click('#btnPlay');
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); if (await q(() => GB.app.B.over)) break; }
    ok(await q(() => GB.app.B.over), '판이 끝남: ' + (await q(() => GB.app.B.result)));
    await page.waitForTimeout(500);
    ok(await q(() => !document.getElementById('modal').classList.contains('hidden')), '결과 창이 뜸');
    await page.screenshot({ path: OUT + '/' + name + '_result.png' });
    await page.click('#rNext');
    ok(await q(() => !document.getElementById('scrHome').classList.contains('hidden')), '막사로 돌아옴');
    // 전멸로 런이 끝났으면 새 런
    if (await q(() => GB.app.run.over)) { await page.click('#btnNewRun'); await page.click('#nrYes'); await page.waitForTimeout(200); }
    // 장비 창
    await page.click('[data-eq]'); ok(await q(() => document.getElementById('modalBox').innerText.indexOf('장비') >= 0), '장비 창');
    await page.click('#eqClose');
    await page.screenshot({ path: OUT + '/' + name + '_home2.png' });
    ok(errs.length === 0, '콘솔 오류 없음' + (errs.length ? ': ' + errs[0] : ''));
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? '\n실패 ' + fails + '건' : '\n모두 통과'); process.exit(fails ? 1 : 0);
})();
