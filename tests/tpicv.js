const { chromium } = require('playwright');
// v1.0 (2026-11-15, C) 보스가 보낸 사진 — 보낼 때 이 기기 사본 저장 · 다시 켜도 작은 사진 · 누르면 전체 화면 · 두 번 눌러/휠로 확대 · 밀어서 다음 · 저장(내려받기) · 말 지우면 사본도
(async () => { const b = await chromium.launch();
  for (const [name, opt] of [['폰', { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true }], ['컴', { viewport:{ width:1366, height:860 } }]]){
    const ctx = await b.newContext({ ...opt, locale:'ko-KR', serviceWorkers:'block', acceptDownloads:true });
    const p = await ctx.newPage();
    const tap = sel => name === '폰' ? p.locator(sel).first().tap() : p.locator(sel).first().click();
    await p.goto('http://localhost:8765/sehee/#office'); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded);
    // 1) 보낼 때 사본 저장 — sendSay 가 picSave 를 부르는지(머리 없는 깡통으로)
    await p.evaluate(() => { window.__ps = []; const o = window.picSave; window.picSave = (at, f) => { window.__ps.push([at, f.length]); return o(at, f); }; });
    await p.locator('#sayFile').setInputFiles([__dirname + '/img/wide.jpg', __dirname + '/img/long.jpg']); await p.waitForTimeout(300);
    await p.locator('#sayText').fill('이 사진 봐'); await p.evaluate(() => sendSay());
    await p.waitForFunction(() => window.__ps.length > 0); await p.waitForTimeout(1200);
    const at = await p.evaluate(() => window.__ps[0][0]);
    console.log(name, '보낼 때 사본', await p.evaluate(async at => { const v = await kvGet('chatpic_' + at); return v ? v.length + '장 · ' + v.map(x => Math.round(x.size / 1024) + 'KB').join(',') : '없음'; }, at),
      '| 동기화 대상 아님', await p.evaluate(at => !syncKey('chatpic_' + at), at));
    // 2) 다시 켬 → 작은 사진 되살아남
    await p.reload(); await p.waitForFunction(() => typeof O !== 'undefined' && O.loaded); await p.evaluate(() => goView('office'));
    await p.waitForFunction(at => document.querySelectorAll(`.pics img[data-pv-at="${at}"]`).length === 2, at, { timeout:8000 });
    console.log(name, '다시 켠 뒤 작은 사진', await p.evaluate(at => document.querySelectorAll(`#log .pics img[data-pv-at="${at}"]`).length, at));
    // 3) 누르면 전체 화면
    await p.evaluate(at => document.querySelector(`#log .pics img[data-pv-at="${at}"]`).scrollIntoView({ block:'center' }), at);
    await tap(`#log .pics img[data-pv-at="${at}"][data-pv-i="0"]`); await p.waitForSelector('#pv.in');
    await p.waitForFunction(() => $('pvImg').complete && $('pvImg').naturalWidth > 0);
    const s0 = await p.evaluate(() => ({ n:$('pvN').textContent, w:$('pvImg').naturalWidth, h:$('pvImg').naturalHeight, box:(r => [Math.round(r.width), Math.round(r.height)])($('pvImg').getBoundingClientRect()) }));
    console.log(name, '크게 보기', JSON.stringify(s0)); await p.screenshot({ path:`/tmp/picv-${name}-1.png` });
    // 4) 두 번 눌러 확대 → 다시 두 번 = 원래대로
    const st = await p.locator('#pvStage').boundingBox(), cx = st.x + st.width * 0.4, cy = st.y + st.height * 0.45;
    const dbl = async () => { if (name === '폰'){ await p.touchscreen.tap(cx, cy); await p.waitForTimeout(90); await p.touchscreen.tap(cx, cy); } else { await p.mouse.click(cx, cy); await p.waitForTimeout(90); await p.mouse.click(cx, cy); } await p.waitForTimeout(350); };
    await dbl(); const z1 = await p.evaluate(() => [PICV.s.toFixed(2), $('pv').classList.contains('zoomed')]); await p.screenshot({ path:`/tmp/picv-${name}-2.png` });
    await dbl(); const z2 = await p.evaluate(() => PICV.s.toFixed(2));
    let z3 = '-'; if (name === '컴'){ await p.mouse.move(cx, cy); await p.mouse.wheel(0, -300); await p.mouse.wheel(0, -300); await p.waitForTimeout(150); z3 = await p.evaluate(() => PICV.s.toFixed(2)); await p.mouse.wheel(0, 2000); await p.mouse.wheel(0, 2000); await p.mouse.wheel(0, 2000); await p.waitForTimeout(150); z3 += '→' + await p.evaluate(() => PICV.s.toFixed(2)); }
    console.log(name, '두 번 눌러 확대', JSON.stringify(z1), '| 다시 두 번', z2, '| 휠', z3);
    // 5) 밀어서 다음 사진
    if (name === '폰'){ await p.evaluate(({ x, y }) => { const el = $('pvStage'); const ev = (t, cx) => el.dispatchEvent(new PointerEvent(t, { pointerId:7, clientX:cx, clientY:y, bubbles:true, pointerType:'touch', isPrimary:true }));
      ev('pointerdown', x + 120); ev('pointermove', x + 40); ev('pointermove', x - 60); ev('pointerup', x - 60); }, { x:cx, y:cy }); }
    else { await tap('#pv [data-pv="next"]'); }
    await p.waitForTimeout(250); console.log(name, '다음 사진', await p.evaluate(() => $('pvN').textContent));
    // 6) 저장 = 내려받기
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout:5000 }).catch(() => null), tap('#pv [data-pv="save"]')]);
    console.log(name, '저장', dl ? dl.suggestedFilename() : '내려받기 없음', '| 알림', await p.evaluate(() => (document.querySelector('.toast') || {}).textContent || ''));
    await tap('#pv [data-pv="x"]'); await p.waitForTimeout(200); console.log(name, '닫힘', await p.evaluate(() => $('pv').hidden));
    // 7) 말 지우면 사본도
    await p.evaluate(async at => { const i = O.log.findIndex(m => m.at === at); await deleteMsg(at, i); }, at); await p.waitForTimeout(400);
    console.log(name, '말 지운 뒤 사본', await p.evaluate(async at => (await kvGet('chatpic_' + at)) ? '남음' : '지워짐', at));
    await ctx.close();
  }
  await b.close(); })();
