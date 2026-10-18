// v6.5 로그 · 이야기 · 복기 · 카드/상세 숨 표시
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ const out = [], seen = new Set();
    for (let s = 1; s <= 80 && seen.size < 9; s++){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W);
      for (const e of W.log.filter(e => (e.k === 'mvr' && ['rejoin', 'rally', 'bguard', 'kite', 'nochase'].includes(e.m)) || e.k === 'hunt' || e.k === 'winded' || (e.k === 'wedge' && (e.s === 'contact' || e.s === 'breach')))){ const key = e.k + (e.m || e.s || ''); if (seen.has(key)) continue; seen.add(key);
        const line = logLines(W).find(l => l.startsWith(f2(e.t)) && (l.includes('🏃') || l.includes('📋') || l.includes('숨'))); let x = null; try { x = narrOf(W, e); } catch (err) { x = { s: 'ERR ' + err }; } out.push((line || '(줄 없음 ' + key + ')') + '\n      ▸ ' + (x ? x.s : '(이야기 없음)')); } }
    // 숨 표시: 전투 시작 후 노먼을 달리게
    start(); const N = world.units.find(u => u.name === '노먼'); N.sta = 30; N.winded = false; world.units.filter(u => u.side === 1).forEach(u => u.alive = false);
    N.order = { k: 'move', x: N.x + 8, y: N.y, hurry: true }; for (let i = 0; i < 90; i++) stepWorld(world, 1 / 30); hud(); sel = new Set([N.i]); renderDetail();
    out.push('카드: ' + (document.querySelector('#party').textContent.match(/숨[^·]*/) || ['(없음)'])[0] + ' · 상세: ' + ((document.getElementById('det').textContent.match(/숨\s*\d+\/100[^·]*/) || ['(없음)'])[0]).slice(0, 80) + ' · 숨 ' + Math.round(N.sta) + ' · 숨참 ' + N.winded);
    return out.join('\n'); });
  console.log(r); console.log('errors', errs); await b.close(); })();
