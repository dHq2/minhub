// v6.4 적의 기동 — 로그 · 이야기 · 복기 · 상세정보 표시
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ const out = [], seen = new Set();
    for (let s = 1; s <= 40 && seen.size < 6; s++){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W);
      for (const e of W.log.filter(e => e.k === 'mvr')){ const key = e.m + (e.r || ''); if (seen.has(key)) continue; seen.add(key);
        const line = logLines(W).find(l => l.startsWith(f2(e.t)) && l.includes('🏃')); const x = narrOf(W, e); out.push(line + '\n      ▸ ' + (x ? x.s : '(이야기 없음)')); }
      if (s === 3) out.push('복기 (판 3):\n' + reviewSummary(W).split('\n').filter(l => /기동|🏃/.test(l)).slice(0, 8).join('\n')); }
    return out.join('\n'); });
  console.log(r); console.log('errors', errs); await b.close(); })();
