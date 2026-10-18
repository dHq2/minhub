const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ const out = []; for (const s of [3, 25, 40]){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W);
      const txt = logLines(W).join('\n'); out.push('== seed ' + s + ' ' + W.result); out.push(...txt.split('\n').filter(l => /📋|🤝 약속:|후퇴|재집결|방패 뒤로|총구|무장 회복|무기 없이/.test(l)).slice(0, 12));
      const nar = []; for (const e of W.log){ try { const x = narrOf(W, e); if (x && x.s && (e.k === 'plan' || e.k === 'pact')) nar.push('  ▸ ' + x.s); } catch (err) { nar.push('ERR ' + err); } } out.push(...nar.slice(0, 5)); } return out.join('\n'); });
  console.log(r); console.log('errors', errs); await b.close(); })();
