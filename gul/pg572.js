// v5.7.2: Space 재생 · 멈춤 · 시작 행동 저장 · 기본 ½×
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await (await b.newContext({viewport:{width:1600,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(500);
  await p.evaluate(()=>showTab('fight')); await p.waitForTimeout(200);
  const st = () => p.evaluate(()=>({mode, paused, cont, t: world? +world.t.toFixed(2):null, speed, step: document.getElementById('stepBtn').textContent, cont2: document.getElementById('contBtn').textContent}));
  console.log('init', JSON.stringify(await st()), 'speedOn', await p.evaluate(()=>document.querySelector('#speedSeg .on').textContent));
  await p.focus('#contBtn');   // 단추에 초점이 있어도 Space 는 재생 · 멈춤
  await p.keyboard.press('Space'); await p.waitForTimeout(100); console.log('space1 (edit→t0)', JSON.stringify(await st()));
  // 시작 행동: 레베카를 앞으로 · 카리우스 제자리 · 인주 공격 (검방패기사)
  await p.evaluate(()=>{ const W=world, R=W.units.find(u=>u.name==='레베카'), K=W.units.find(u=>u.name==='카리우스'), I=W.units.find(u=>u.name==='인주'), E1=W.units.find(u=>u.name==='검방패기사');
    sel=new Set([R.i]); hud(); groupMove([R], R.x+1, R.y-2, 'move'); K.order={k:'hold'}; I.order={k:'attack', b:E1.i}; R.guardMode='hold'; noteOrders([K,I]); hud(); });
  console.log('ti', await p.evaluate(()=>document.getElementById('turnInfo').innerText.slice(0,160)));
  await p.keyboard.press('Space'); await p.waitForTimeout(700); const a1 = await st(); console.log('space2 (play)', JSON.stringify(a1));
  console.log('openers saved', await p.evaluate(()=>JSON.stringify(S.openers)));
  await p.keyboard.press('Space'); await p.waitForTimeout(80); const a2 = await st(); await p.waitForTimeout(600); const a3 = await st();
  console.log('space3 (pause)', JSON.stringify(a2), '→ after 0.6s t', a3.t, '| ovl', await p.evaluate(()=>document.getElementById('ovl').textContent.slice(0,40)), '| ti', await p.evaluate(()=>document.getElementById('turnInfo').innerText.slice(0,60)));
  // 멈춘 채로 명령
  await p.evaluate(()=>{ const N=world.units.find(u=>u.name==='노먼'); N.order={k:'hold'}; noteOrders([N]); });
  await p.keyboard.press('Space'); await p.waitForTimeout(500); console.log('space4 (resume)', JSON.stringify(await st()));
  await p.keyboard.press('Enter'); await p.waitForTimeout(50);
  // 같은 배치로 다시: 시작 행동이 다시 걸리는가
  await p.evaluate(()=>{ resetToEdit(); }); await p.waitForTimeout(100);
  console.log('edit ti', await p.evaluate(()=>document.getElementById('turnInfo').innerText.slice(0,140)));
  await p.keyboard.press('Space'); await p.waitForTimeout(150);
  console.log('restart orders', await p.evaluate(()=>world.units.filter(u=>u.side===0).map(u=>u.name+':'+(u.order?u.order.k+(u.order.b!=null?'>'+world.units[u.order.b].name:''):'-')+'/'+u.guardMode).join(' ')), '| toast', await p.evaluate(()=>document.getElementById('toast').textContent.slice(0,60)));
  // 지우기
  await p.click('#turnInfo [data-op="clear"]'); await p.waitForTimeout(100);
  console.log('after clear', await p.evaluate(()=>JSON.stringify(S.openers)), await p.evaluate(()=>world.units.filter(u=>u.side===0).map(u=>u.name+':'+(u.order?u.order.k:'-')).join(' ')));
  // 속도 기억
  await p.click('#speedSeg [data-sp="1"]'); await p.reload(); await p.waitForTimeout(500); console.log('speed after reload', await p.evaluate(()=>speed), await p.evaluate(()=>document.querySelector('#speedSeg .on').textContent));
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
