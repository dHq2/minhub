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
    ok(await q(() => !!document.getElementById('btnAP') && GB.app.B.autoPause.on), '자동정지 단추가 있고 기본 켬');
    await page.click('#btnAP'); ok(await q(() => !GB.app.B.autoPause.on), '자동정지 끄기 (이 시험은 멈춤 없이 진행)');
    // 칩으로 보병1 고르기 → 땅 탭 = 이동 (0초: 바로 걸림)
    await page.dispatchEvent('.chip[data-i="1"]', 'pointerdown');
    ok(await q(() => GB.app.ui.sel.has(1)), '칩 탭으로 고르기');
    const u1 = await q(() => { const u = GB.app.B.W.units[1]; return { x: u.x, y: u.y }; });
    let p = await toS(u1.x + 8, u1.y); await page.mouse.click(p.x, p.y);
    ok(await q(() => GB.app.B.W.units[1].order && GB.app.B.W.units[1].order.k === 'move'), '땅 탭 = 이동 명령');
    // 전우조 / 대장 / 다중 선택
    await page.click('#tabs .tab[data-tab="t3"]');
    await page.click('#bAll'); ok(await q(() => GB.app.ui.sel.size === 4), '전체 선택');
    await page.click('#bMate'); await page.waitForTimeout(100);
    ok(await q(() => GB.app.B.W.units.filter(u => u.side === 0 && u.cg).length >= 2), '전우조 단추 (엔진 cgJoin)');
    await page.click('#bCut');
    // 전투 개시
    await page.click('#btnPlay'); await page.waitForTimeout(2500);
    ok(await q(() => GB.app.B.started && GB.app.B.W.t > 1), '전투가 진행됨 (t=' + (await q(() => GB.app.B.W.t.toFixed(1))) + ')');
    // 정지 → 명령(지휘관을 거쳐 닿음) → 재개
    await page.click('#btnPlay'); ok(await q(() => GB.app.B.paused), '일시정지');
    const foe = await q(() => { const f = GB.app.B.W.units.find(u => u.side === 1 && u.alive); return { x: f.x, y: f.y, i: f.i }; });
    await page.dispatchEvent('.chip[data-i="0"]', 'pointerdown');
    p = await toS(foe.x, foe.y); await page.mouse.click(p.x, p.y); await page.waitForTimeout(100);
    ok(await q(() => { const u = GB.app.B.W.units[0]; return !!(u.order || u.ordPend); }), '적 탭 = 공격 명령');
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
