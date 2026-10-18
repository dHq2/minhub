// v6.3.1 전열 안에서는 스스로 돌진 안 함 · 벗어나면 다시 · 돌진 명령은 됨
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ const rec = []; const orig = startCharge; startCharge = function(W, u, t, pt){ rec.push({ line: !!u.line, ord: !!(u.order && u.order.k === 'charge'), side: u.side, name: u.name }); return orig.apply(this, arguments); };
    const out = {}; for (const fl of [false, true]){ if (fl){ S.randStart = false; placeFloor('1층'); } rec.length = 0; let lineT = 0;
      for (let s = 1; s <= 30; s++){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over){ runTurn(W); lineT += W.units.filter(u => u.line && u.canCharge).length; } }
      out[fl ? '1층' : '순찰판'] = { charges: rec.length, autoInLine: rec.filter(x => x.line && !x.ord).length, autoOutLine: rec.filter(x => !x.line && !x.ord).length, byName: Object.entries(rec.reduce((m, x) => (m[x.name] = (m[x.name] || 0) + 1, m), {})).map(x => x.join(' ')).join(', '), lineSamples: lineT }; }
    // 전열 안 아군에게 돌진 명령
    start(); let k = 0; while (!world.units.some(u => u.side === 0 && u.line && u.canCharge && u.alive) && k++ < 400) stepWorld(world, 1 / 30);
    const A = world.units.find(u => u.side === 0 && u.line && u.canCharge && u.alive), e = world.units.filter(u => u.side === 1 && u.alive).sort((a, c) => Math.hypot(a.x - A.x, a.y - A.y) - Math.hypot(c.x - A.x, c.y - A.y))[0];
    rec.length = 0; A.chargeCd = -9; A.act = null; A.x = e.x; A.y = e.y + 4; e.seenBy = e.seenBy || 1; const inLine = !!A.line; A.order = { k: 'charge', b: e.i }; A.last = { x: e.x, y: e.y };
    for (let i = 0; i < 30 && !rec.length; i++) stepWorld(world, 1 / 30);
    out.order = { who: A.name, inLineBefore: inLine, started: rec.length > 0, rec: rec[0] || null, act: A.act ? A.act.k + ':' + A.act.phase : 'none' };
    out.detail = (() => { hoverPid = null; sel = new Set([A.i]); const h = unitDetailHtml(world, A); const m = h.match(/스스로는 돌진 안 함[^<]*/); return m ? m[0] : '(없음 — 지금 전열 ' + !!A.line + ')'; })();
    return out; });
  console.log(JSON.stringify(r, null, 1)); console.log('errors', errs); await b.close(); })();
