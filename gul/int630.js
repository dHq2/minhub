// v6.3 양쪽 다 본 것만 앎 · 알게 됨 · 판단 · 초전 복기
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(600);
  const seed = +(process.argv[2] || 3);
  const r = await p.evaluate(seed=>{ const W = createWorld(clone(S), clone(rules), seed, { headless: true }); while (!W.over) runTurn(W);
    const L = logLines(W), cnt = { intel0: W.log.filter(e => e.k === 'intel' && e.side === 0).length, intel1: W.log.filter(e => e.k === 'intel' && e.side === 1).length, judge0: W.log.filter(e => e.k === 'judge' && e.side === 0).length, judge1: W.log.filter(e => e.k === 'judge' && e.side === 1).length };
    const nar = []; for (const e of W.log){ if (e.k !== 'intel' && e.k !== 'judge') continue; const x = narrOf(W, e); if (x) nar.push('▸ ' + x.s); }
    return 'result ' + W.result + ' ' + W.t.toFixed(1) + ' ' + JSON.stringify(cnt) + '\n' + L.filter(l => /알게 됨|판단/.test(l)).slice(0, 18).join('\n') + '\n' + nar.slice(0, 4).join('\n') + reviewSummary(W); }, seed);
  console.log(r);
  console.log('errors', errs); await b.close(); })();
