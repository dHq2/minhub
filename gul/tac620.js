// v6.2 조우 전 시작 · 로그 · 이야기 (우리는 모름) · 옛 20×14 이전
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(600);
  console.log('board', await p.evaluate(()=>JSON.stringify({ type: S.type, W: S.W, H: S.H, rand: S.randStart, units: S.units.map(u => u.name + ':' + coord(u.x, u.y)).join(' ') })));
  const r = await p.evaluate(()=>{ const out = []; for (const s of [3, 11]){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W);
      out.push('== seed ' + s + ' ' + W.result + ' ' + W.t.toFixed(1)); out.push(...logLines(W).filter(l => /📋|◆ 적 지휘: 표적|◇ /.test(l)).slice(0, 7));
      const nar = []; for (const e of W.log){ try { const x = narrOf(W, e); if (x && x.s && ['start', 'focus', 'plan', 'sentry', 'alarm', 'contact', 'wedge', 'env', 'ambush'].includes(e.k)) nar.push('  ▸ [' + e.k + '] ' + x.s); } catch (err) { nar.push('ERR ' + e.k + ' ' + err); } } out.push(...nar.slice(0, 6)); }
    return out.join('\n'); });
  console.log(r);
  // 옛 20×14 판 (v6.1) → 32×20
  await p.evaluate(()=>{ S.type = 'grid'; S.W = 20; S.H = 14; delete S.v620; for (const u of S.units){ u.x = Math.min(19.5, u.x - 6); u.y = Math.min(13.5, u.y - 3); } save(); });
  await p.reload(); await p.waitForTimeout(3000);
  console.log('migrated', await p.evaluate(()=>JSON.stringify({ W: S.W, H: S.H, units: S.units.slice(0, 4).map(u => u.name + ':' + coord(u.x, u.y)).join(' ') })), '| toast:', await p.evaluate(()=>document.getElementById('toast').textContent));
  console.log('errors', errs); await b.close(); })();
