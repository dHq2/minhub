// v6.4.1 새 기동 · 아낀 투창 · 직사 각 — 로그 · 이야기 · 복기
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ const out = [], seen = new Set(); let rv = null, ang = 0;
    for (let s = 1; s <= 60 && seen.size < 9; s++){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W);
      for (const e of W.log.filter(e => (e.k === 'mvr' && ['scatter', 'interpose', 'escort', 'near', 'rush', 'pace', 'recall'].includes(e.m)) || e.k === 'javHold')){ const key = e.k + (e.m || ''); if (seen.has(key)) continue; seen.add(key);
        const line = logLines(W).find(l => l.startsWith(f2(e.t)) && (l.includes('🏃') || l.includes('아낌'))); const x = narrOf(W, e); out.push(line + '\n      ▸ ' + (x ? x.s : '(이야기 없음)')); }
      if (!rv && W.log.some(e => e.k === 'mvr' && e.m === 'interpose')) rv = reviewSummary(W).split('\n').filter(l => /적의 기동|사이를 막음|호위/.test(l)).slice(0, 4).join('\n'); }
    return out.join('\n') + '\n복기:\n' + rv; });
  console.log(r); console.log('errors', errs); await b.close(); })();
