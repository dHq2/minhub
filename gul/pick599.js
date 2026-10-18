// v5.9.9 주운 장비 표시: 로그 줄 · 결과 · 로그 머리 · 상세 칸 · 판 그림 · 끝 알림
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{ for (let s = 1; s < 80; s++){ const W = createWorld(clone(S), clone(rules), s, { headless: true }); while (!W.over) runTurn(W);
      if (!W.log.some(e => e.k === 'pickItem' && !e.own)) continue;
      const txt = logHeader(W, 't') + logLines(W).join('\n') + resultLine(W);
      return { seed: s, lines: txt.split('\n').filter(l => /✋|→ 지금/.test(l)).slice(0, 12) }; } return null; });
  console.log(JSON.stringify(r, null, 1));
  await p.evaluate(()=>start()); await p.waitForTimeout(200);
  const d = await p.evaluate(()=>{ const K = world.units.find(u => u.ref === 'C-003'); world.items.push({ id: 901, k: 'weapon', name: '활', x: K.x, y: K.y, owner: null, t: 0, ammo: 10 }); takeItem(world, K, world.items.find(x => x.id === 901));
    hoverPid = K.pid; renderDetail(); const row = (document.getElementById('det').innerHTML.match(/주운 것<\/span>[^<]*/) || [''])[0]; draw && draw(); return row; });
  console.log('detail:', d);
  await p.waitForTimeout(300);
  const ban = await p.evaluate(()=>{ world.over = true; world.result = 'win'; onOver(); return document.getElementById('banner').textContent; });
  console.log('banner:', ban);
  await p.screenshot({ path: 'pick599.png' });
  console.log('errors', errs); await b.close(); })();
