const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ const out = [], pats = [/순찰조 합류/, /집결/, /사수 몰이: .*퇴로/, /맞닿음/, /못 잡음|쫓지 않|nochase/, /교대 \(지휘\)/]; const got = new Set();
    for (let s = 1; s <= 80 && got.size < pats.length; s++){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W); const L = logLines(W);
      pats.forEach((re, k) => { if (got.has(k)) return; const l = L.find(x => re.test(x)); if (l){ got.add(k); out.push(l); } }); if (!out.some(l => /초전 복기/.test(l)) && W.log.some(e => e.k === 'hunt')) out.push(reviewSummary(W).split('\n').filter(l => /사수 몰이|적의 기동/.test(l)).join('\n')); }
    return out.join('\n'); });
  console.log(r); console.log('errors', errs); await b.close(); })();
