// v6.2 달리는 돌진 중 새 명령 → 돌진을 멈추고 새 명령
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  await p.evaluate(()=>{ S.randStart = false; placeFloor('1층'); start(); });
  const r = await p.evaluate(()=>{ const K = world.units.find(u => u.ref === 'C-003'), e = world.units.filter(u => u.side === 1 && u.alive).sort((a, b) => Math.hypot(a.x - K.x, a.y - K.y) - Math.hypot(b.x - K.x, b.y - K.y))[0];
    K.chargeCd = -9; K.x = e.x; K.y = e.y + 4.5; startCharge(world, K, e, null); for (let i = 0; i < 20 && !(K.act && K.act.k === 'charge' && K.act.phase === 'run'); i++) stepWorld(world, 1 / 30);
    const before = K.act ? K.act.k + ':' + K.act.phase : 'none'; for (let i = 0; i < 3; i++) stepWorld(world, 1 / 30);
    groupMove([K], K.x, K.y + 2, 'move'); const after = K.act ? K.act.k + ':' + K.act.phase : 'none'; const x0 = K.x, y0 = K.y; for (let i = 0; i < 6; i++) stepWorld(world, 1 / 30);
    const L = logLines(world).filter(l => /카리우스/.test(l) && /돌진|새 명령/.test(l)).slice(-3);
    return { before, after, order: JSON.stringify(K.order), moved: +(Math.hypot(K.x - x0, K.y - y0)).toFixed(2), dirY: +(K.y - y0).toFixed(2), log: L }; });
  console.log(JSON.stringify(r, null, 1)); console.log('errors', errs); await b.close(); })();
