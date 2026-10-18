// v5.8.6 페이지: 가까운 돌진 명령 → 밀치기 (서술 · 기록 · 상태 글)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await (await b.newContext({viewport:{width:1600,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  await p.evaluate(()=>showTab('fight')); await p.keyboard.press('Space'); await p.waitForTimeout(200);
  const r = await p.evaluate(()=>{ const W=world, I=W.units.find(u=>u.name==='인주'), R=W.units.find(u=>u.name==='레베카'), e1=W.units.find(u=>u.name==='검기사'), e2=W.units.find(u=>u.name==='검방패기사');
    R.x=I.x+3; R.y=I.y; e1.x=I.x; e1.y=I.y-1.1; e2.x=R.x; e2.y=R.y-1.1; I.order={k:'charge', b:e1.i}; R.order={k:'charge', b:e2.i}; noteOrders([I,R]); hud(); return 'ok'; });
  const labels=new Set(); for (let k=0;k<40;k++){ const L = await p.evaluate(()=>{ stepWorld(world,1/30); const I=world.units.find(u=>u.name==='인주'), R=world.units.find(u=>u.name==='레베카'); return [I,R].map(u=>u.act?actLabel(world,u,liveAct(world,u)):moodLabel(world,u)).join(' | '); }); labels.add(L); }
  console.log('labels', [...labels].slice(0,6).join(' || '));
  console.log('log', await p.evaluate(()=>logLines(world,0).filter(l=>/가까움|밀치기|어깨|밀침/.test(l)).slice(0,6).join('\n   ')));
  console.log('narr', await p.evaluate(()=>world.log.filter(e=>['tooClose','wind','impact','shove'].includes(e.k)&&(e.k!=='wind'||e.bash)).map(e=>{ const r=narrOf(world,e); return r&&r.s; }).filter(Boolean).join(' / ')));
  await p.evaluate(()=>{ draw(); hud(); }); console.log('errors', JSON.stringify(errs)); await b.close(); })();
