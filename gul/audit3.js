const { chromium } = require('playwright');
(async () => { const fs=require('fs');
  fs.writeFileSync('build/wrapped.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>'+fs.readFileSync('build/gul-battle.html','utf8')+'</body></html>');
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400);
  console.log('ver', await p.evaluate(()=>document.querySelector('.ver').textContent.slice(0,8)));
  console.log('paths', await p.evaluate(()=>{ const f=u=>[u.weapon,u.cls,u.role||'-',(u.traits||[]).join('+'),u.nv?u.nvG:'no-nv'].join('/'); return JSON.stringify({fromRef:f(unitFromRef('C-001',0,{hero:true})), shield:f(exampleShield().units.find(x=>x.ref==='C-001')), draft:f(exampleDraft().units.find(x=>x.ref==='C-001')), norman:f(unitFromRef('C-007',0)), rebecca:f(unitFromRef('C-002',0))}); }));
  // 옛 저장: 총을 든 인주 (예제 방패 대치, v5.0 시절) + 총을 든 인주 설계 칸
  await p.evaluate(()=>{ const o=exampleShield(); for(const u of o.units) if(u.ref==='C-001'){ u.weapon='총'; u.cls='원거리'; delete u.role; u.traits=[]; } delete o.v54; delete o.v53; delete o.v52; localStorage.setItem('gul-battle-v3',JSON.stringify(o)); localStorage.setItem('gul-battle-designs', JSON.stringify({v:1,list:[{key:'인주',side:0,ref:'C-001',name:'인주',tier:2,hero:true,weapon:'총',cls:'원거리',traits:[]}]})); });
  await p.reload(); await p.waitForTimeout(500);
  console.log('old save injoo', await p.evaluate(()=>{ const u=S.units.find(x=>x.ref==='C-001'); return [u.weapon,u.cls,u.role,(u.traits||[]).join('+')].join('/'); }), 'design', await p.evaluate(()=>{ const d=designByKey('인주'); return [d.weapon,d.cls,d.role].join('/'); }));
  // 그 판으로 싸움: 인주가 쏘는지
  await p.evaluate(()=>showTab('fight')); await p.click('#stepBtn'); await p.waitForTimeout(300);
  const r = await p.evaluate(()=>{ let shots=0, ticks=0; const I=world.units.find(u=>u.ref==='C-001'); while(!world.over && world.t<60){ stepWorld(world,1/30); ticks++; for(const s of world.shots) if(s.a===I.i && s.t0===world.t) shots++; } return { shots, isFar: isFar(I), rng: I.rng, weapon: I.weapon, result: world.result, t: world.t.toFixed(1), injooHits: world.log.filter(l=>l.k==='hit'&&l.a===I.i).length, injooFarHits: world.log.filter(l=>l.k==='hit'&&l.a===I.i&&l.far).length }; });
  console.log('battle', JSON.stringify(r));
  console.log('errors', errs); await b.close(); })();
