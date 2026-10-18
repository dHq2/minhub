// v6.6 지침 · 탈진 표시: 카드 · 상세정보 · 판 그림 (오류 없이) · 로그 · 이야기
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ S.randStart = false; placeFloor('1층'); start(); const R = world.units.find(u => u.name === '레베카'), K = world.units.find(u => u.side === 1 && u.alive);
    R.fat = 99; tire(world, R, 'swing'); K.fat = 60; fatState(world, K); K.seenBy = 1; hud(); sel = new Set([R.i]); renderDetail(); draw && draw();
    const card = (document.getElementById('party').textContent.match(/🥵[^·]*/) || ['(없음)'])[0], det = (document.getElementById('det').textContent.match(/지침[^·]*·[^·]*/) || ['(없음)'])[0];
    const L = logLines(world).filter(l => /지침|탈진/.test(l)); const nar = world.log.filter(e => e.k === 'exhaust' || e.k === 'tired').map(e => { const x = narrOf(world, e); return x ? x.s : '(이야기 없음)'; });
    return { card, det: det.slice(0, 120), state: [R.tired, R.exhausted, K.tired, K.exhausted], L, nar }; });
  console.log(JSON.stringify(r, null, 1)); await p.screenshot({ path: 'fatui660.png' }); console.log('errors', errs); await b.close(); })();
