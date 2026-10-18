// 주운 장비가 다음 판으로 넘어가는지: 판 안에서 줍게 한 뒤 → 편집으로 → 새 판 · 새로 읽기
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(500);
  const kit = W => W.units.map(u => `${u.name}:${u.weapon}${u.shield ? (u.armShield ? '+팔' : '+방패') : ''}`).join(' ');
  await p.evaluate(()=>start()); await p.waitForTimeout(200);
  console.log('battle1 start', await p.evaluate(()=>world.units.map(u => `${u.name}:${u.weapon}${u.shield ? (u.armShield ? '+팔' : '+방패') : ''}`).join(' ')));
  console.log('picked', await p.evaluate(()=>{ const K = world.units.find(u => u.ref === 'C-003'), I = world.units.find(u => u.ref === 'C-001');
    world.items.push({ id: 901, k: 'weapon', name: '검', x: K.x, y: K.y, owner: null, t: 0 }); takeItem(world, K, world.items.find(x => x.id === 901));
    world.items.push({ id: 902, k: 'shield', name: '방패', x: I.x, y: I.y, owner: null, t: 0 }); const ok = canTake(world, I, world.items.find(x => x.id === 902)); if (ok) takeItem(world, I, world.items.find(x => x.id === 902));
    return `카리우스 ${K.weapon}${K.shield ? (K.armShield ? '+팔' : '+방패') : ''} · 인주 ${I.weapon}${I.shield ? '+방패' : ''} (canTake ${ok})`; }));
  await p.evaluate(()=>{ resetToEdit(); }); await p.waitForTimeout(200);
  console.log('board after', await p.evaluate(()=>S.units.map(u => `${u.name}:${u.weapon}${u.shield ? '+방패' : ''}`).join(' ')));
  await p.evaluate(()=>start()); await p.waitForTimeout(200);
  console.log('battle2 start', await p.evaluate(()=>world.units.map(u => `${u.name}:${u.weapon}${u.shield ? (u.armShield ? '+팔' : '+방패') : ''}`).join(' ')));
  await p.reload(); await p.waitForTimeout(700); await p.evaluate(()=>start()); await p.waitForTimeout(200);
  console.log('after reload', await p.evaluate(()=>world.units.map(u => `${u.name}:${u.weapon}${u.shield ? (u.armShield ? '+팔' : '+방패') : ''}`).join(' ')));
  console.log('errors', errs); await b.close(); })();
