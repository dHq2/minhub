// v6.1 화면: 시작 무작위 · 적 전술 로그 · 이야기 · 판 위 표시 · 오류
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(600);
  console.log('board', await p.evaluate(()=>JSON.stringify({ type: S.type, W: S.W, H: S.H, rand: S.randStart, check: document.getElementById('randStart').checked, units: S.units.map(u => u.name + ':' + coord(u.x, u.y)).join(' ') })));
  console.log('stats', await p.evaluate(()=>{ const W = createWorld(clone(S), clone(rules), 3, { headless: true }); return W.units.map(u => `${u.name} ${u.max}/${u.atk}${u.vet ? '·베테랑' : ''}`).join(' | '); }));
  const r = await p.evaluate(()=>{ const out = []; for (const s of [3, 11, 40]){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W);
      out.push('== seed ' + s + ' ' + W.result + ' ' + W.t.toFixed(1)); out.push(...logLines(W).filter(l => /📋|◆ 적 지휘: 표적/.test(l)).slice(0, 8));
      for (const e of W.log){ if (!['start', 'focus', 'wedge', 'env', 'ambush'].includes(e.k)) continue; try { const x = narrOf(W, e); if (x && x.s) out.push('  ▸ ' + x.s); } catch (err) { out.push('ERR ' + e.k + ' ' + err); } } }
    return out.join('\n'); });
  console.log(r);
  await p.evaluate(()=>start()); for (let k = 0; k < 4; k++){ await p.evaluate(()=>{ if (!world.over) runTurn(world); }); }
  await p.evaluate(()=>{ const st = document.createElement('style'); st.textContent = '[class*=legend],[id*=legend]{display:none !important}'; document.head.appendChild(st); draw(); });
  await p.waitForTimeout(300); const c = await p.evaluate(()=>{ const r = document.querySelector('canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  await p.screenshot({ path: 'tac610.png', clip: { x: c.x, y: c.y, width: Math.min(c.w, 1000), height: Math.min(c.h, 700) } });
  console.log('live', await p.evaluate(()=>JSON.stringify({ start: world.start, plan: world.plan && world.plan.k, focus: world.focus && world.units[world.focus.b].name, wedge: !!world.wedge, env: !!world.env })));
  await p.evaluate(()=>{ resetToEdit(); }); await p.waitForTimeout(200);
  console.log('after edit', await p.evaluate(()=>S.units.map(u => u.name + ':' + coord(u.x, u.y)).join(' ')));
  console.log('errors', errs); await b.close(); })();
