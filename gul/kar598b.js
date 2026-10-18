const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  await p.evaluate(()=>start()); await p.waitForTimeout(300);
  console.log(await p.evaluate(()=>{ const K = world.units.find(u => u.ref === 'C-003'); sel = new Set([K.i]); hud(); const h = document.body.innerHTML; const m = h.match(/data-(ord|dk)="guard"[^>]*>[\s\S]{0,80}/); return 'guard button: ' + (m ? m[0].replace(/<[^>]+>/g, '').slice(0, 80) : 'none'); }));
  // B 키 → 막기 유지
  await p.keyboard.press('b'); await p.waitForTimeout(100);
  console.log(await p.evaluate(()=>{ const K = world.units.find(u => u.ref === 'C-003'); return 'mode after B: ' + K.guardMode + ' | toast: ' + document.getElementById('toast').textContent; }));
  // 왼팔을 잃으면
  console.log(await p.evaluate(()=>{ const W = createWorld(clone(S), clone(rules), 5, { headless: true }); const K = W.units.find(u => u.ref === 'C-003'); const e = W.units.find(u => u.side === 1); try { maimArm(W, K, e.i, '검', 'L'); } catch (err) { return 'maim err ' + err; } return JSON.stringify({ shield: K.shield, arm: K.armShield, canGuard: K.canGuard, canBash: K.canBash, items: W.items.length, eff: W.log.filter(x => x.b === K.i).slice(-1) }); }));
  console.log('errors', errs); await b.close(); })();
