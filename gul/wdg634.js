// v6.3.4 쐐기 · 매복 · 취소 문구 로그 / 이야기 / 복기
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ const out = []; let got = 0, amb = 0, cnt = {};
    for (let s = 1; s <= 80 && got < 2; s++){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W);
      for (const e of W.log) if (e.k === 'wedge') cnt[e.s] = (cnt[e.s] || 0) + 1; if (W.log.some(e => e.k === 'ambush' && e.why === 'mate')) amb++;
      if (W.log.some(e => e.k === 'wedge' && (e.s === 'turn' || e.s === 'drop'))){ got++; out.push('== seed ' + s, ...logLines(W).filter(l => /쐐기|적의 작전/.test(l)));
        for (const e of W.log.filter(e => e.k === 'wedge' && e.s === 'turn')){ const x = narrOf(W, e); out.push('  ▸ ' + (x ? x.s : '(이야기 없음 — 안 보임)')); }
        out.push(...reviewSummary(W).split('\n').filter(l => /쐐기/.test(l))); } }
    // 끝난 약 붓기 뒤 회복 동작만 끊김
    const W = createWorld(clone(S), clone(rules), 3, { headless: true }); const N = W.units.find(u => u.skill); N.act = { k: 'skill', phase: 'rec', b: N.i, t0: W.t, t1: W.t, end: W.t + 0.3 }; N.order = { k: 'move', x: N.x + 2, y: N.y }; preempt(W, N);
    out.push(logLines(W).filter(l => /회복 동작|멈추고/.test(l)).join(' / '));
    out.push('wedge 이벤트 ' + JSON.stringify(cnt) + ' · 동료 싸움으로 터진 매복 ' + amb);
    return out.join('\n'); });
  console.log(r); console.log('errors', errs); await b.close(); })();
