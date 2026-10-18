// v6.3.3 지휘관의 돌진 명령 — 상황 따라 (함께 돌격 · 참음 · 틈)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ let rec = []; const orig = startCharge; startCharge = function(W, u, t, pt){ rec.push({ W, t: +W.t.toFixed(2), i: u.i, line: !!u.line, ord: !!(u.order && u.order.k === 'charge'), side: u.side }); return orig.apply(this, arguments); };
    const out = {}, ex = [], nar = []; let rvS = null;
    for (const fl of [false, true]){ if (fl){ S.randStart = false; placeFloor('1층'); } rec = []; let orders = 0, mem = 0, waves = 0, holds = 0, games = 0, wins = 0; const sit = {}, hw = {}, res = {}, gaps = [];
      for (let s = 1; s <= 40; s++){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W); games++; if (W.result === 'win') wins++;
        const cc = W.log.filter(e => e.k === 'cmdCharge'), ts = [...new Set(cc.map(e => e.t))]; orders += ts.length; mem += cc.length; waves += ts.filter(t => cc.filter(e => e.t === t).length > 1).length;
        for (let k = 1; k < ts.length; k++) gaps.push(ts[k] - ts[k - 1]);
        for (const e of cc){ for (const x of (e.sit || '').split(' · ').filter(Boolean)) sit[x] = (sit[x] || 0) + 1;
          const im = W.log.find(x => x.t >= e.t && x.a === e.b && (x.k === 'impact' || x.k === 'tooClose' || x.k === 'chargeMiss')); const k = !im ? '부딪히지 못함' : im.k === 'chargeMiss' ? '피함' : im.k === 'tooClose' ? '가까워 밀치기' : im.held ? '태세에 막힘' : im.setBroke ? '태세를 무너뜨림' : im.full ? '전력질주' : '들이받음'; res[k] = (res[k] || 0) + 1; }
        for (const e of W.log.filter(e => e.k === 'cmdHold')){ holds++; for (const x of e.why.split(' · ')) hw[x] = (hw[x] || 0) + 1; }
        if (ex.length < 8){ const L = logLines(W).filter(l => /적 지휘 \(/.test(l) && /돌진 명령|참게|직접/.test(l)); ex.push(...L.slice(0, 2)); }
        if (nar.length < 4) for (const e of cc){ const x = narrOf(W, e); if (x) nar.push(x.s); }
        if (!rvS && cc.some(e => e.wave > 1)) rvS = reviewSummary(W).split('\n').filter(l => /지휘관의 돌격|본 상황|참게 한|함께/.test(l)).join('\n'); }
      const inLine = rec.filter(x => x.side === 1 && x.line && !x.ord), matched = inLine.filter(x => x.W.log.some(e => e.k === 'cmdCharge' && e.b === x.i && Math.abs(e.t - x.t) < 0.01));
      gaps.sort((a, b) => a - b);
      out[fl ? '1층' : '순찰판'] = { 승: wins + '/' + games, 명령: orders, 마디: mem, 함께돌격: waves, 참게함: holds, 명령사이: gaps.length ? `최소 ${gaps[0].toFixed(1)} · 중간 ${gaps[gaps.length >> 1].toFixed(1)} · 최대 ${gaps[gaps.length - 1].toFixed(1)}초` : '-', 전열안명령없이: inLine.length - matched.length, 아군전열안자동: rec.filter(x => x.side === 0 && x.line && !x.ord).length, 결과: res, 상황: sit, 참은까닭: hw }; }
    return { out, ex, nar, rvS }; });
  console.log(JSON.stringify(r.out, null, 1)); console.log(r.ex.join('\n')); console.log(r.nar.map(s => '▸ ' + s).join('\n')); console.log('복기:\n' + r.rvS);
  console.log('errors', errs); await b.close(); })();
