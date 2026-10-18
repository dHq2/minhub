// v6.3.2 적 지휘관의 돌진 명령: 전열 안 적 마디는 명령으로만 돌진 · 명령이 닿는 거리 · 결과 · 로그 / 이야기 / 복기
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ let rec = []; const orig = startCharge; startCharge = function(W, u, t, pt){ rec.push({ W, t: +W.t.toFixed(2), i: u.i, line: !!u.line, ord: !!(u.order && u.order.k === 'charge'), side: u.side }); return orig.apply(this, arguments); };
    const out = {}, ex = []; for (const fl of [false, true]){ if (fl){ S.randStart = false; placeFloor('1층'); } rec = []; let cc = 0, games = 0, far = 0, res = {}, wins = 0;
      for (let s = 1; s <= 40; s++){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W); games++; if (W.result === 'win') wins++;
        for (const e of W.log.filter(e => e.k === 'cmdCharge')){ cc++; const C = W.units[e.a];
          const im = W.log.find(x => x.t >= e.t && x.a === e.b && (x.k === 'impact' || x.k === 'tooClose' || x.k === 'chargeMiss'));
          const k = !im ? '부딪히지 못함' : im.k === 'chargeMiss' ? '피함' : im.k === 'tooClose' ? '가까워 밀치기' : im.held ? '태세에 막힘' : im.setBroke ? '태세를 무너뜨림' : im.full ? '전력질주로 들이받음' : '들이받음'; res[k] = (res[k] || 0) + 1;
          if (ex.length < 6) ex.push(logLines(W).find(l => l.includes('돌진 명령') && l.startsWith(f2(e.t))) + '\n      ▸ ' + ((narrOf(W, e) || {}).s || '(이야기 없음 — 우리 눈에 안 보임)')); } }
      const inLine = rec.filter(x => x.side === 1 && x.line && !x.ord), matched = inLine.filter(x => x.W.log.some(e => e.k === 'cmdCharge' && e.b === x.i && Math.abs(e.t - x.t) < 0.01));
      out[fl ? '1층' : '순찰판'] = { 승: wins + '/' + games, 지휘돌진명령: cc, 판당: +(cc / games).toFixed(2), 전열안적돌진: inLine.length, 그중명령: matched.length, 아군전열안자동: rec.filter(x => x.side === 0 && x.line && !x.ord).length, 결과: res }; }
    // 복기 · 정보
    const W = createWorld(clone(S), clone(rules), 7, { headless: true }); let s = 7; let W2 = W; while (!W2.over) runTurn(W2);
    for (let q = 8; q < 60 && !W2.log.some(e => e.k === 'cmdCharge'); q++){ W2 = createWorld(clone(S), clone(rules), q, { headless: true }); while (!W2.over) runTurn(W2); s = q; }
    const rv = reviewSummary(W2).split('\n').filter(l => /지휘 돌진|지휘 \(/.test(l)), it = logLines(W2).filter(l => /우리가 알게 됨: .* — 지휘/.test(l));
    return { out, ex, seed: s, rv, it }; });
  console.log(JSON.stringify(r.out, null, 1)); console.log(r.ex.join('\n')); console.log('복기 (seed ' + r.seed + '):\n' + r.rv.join('\n')); console.log(r.it.join('\n'));
  console.log('errors', errs); await b.close(); })();
