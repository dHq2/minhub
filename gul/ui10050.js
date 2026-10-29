// v9.14.0 UI 시험 — ui10050.js v1.0 (나달 = 동그라미 · 헌팅나이프 = 세모 · 역장을 누르면 역장 치기 명령 · 기록 글의 시간 = 현실 초 (판 셈 × 4) · 칸/초 ÷ 4)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const r = await p.evaluate(()=>{ const o={}; const n=fromDesign(designByKey('나달'),0); o.nadal=shapeOf(n); const hd=designByKey('헌팅나이프'); o.hk = hd ? shapeOf(fromDesign(hd,1)) : 'nodesign';
   S.units=S.units.filter(u=>u.side===0).slice(0,2); const sh=fromDesign(designByKey('암계 방패병'),1); sh.x=16.5; sh.y=10.5; S.units.push(sh); S.units.forEach((u,k)=>{ if(u.side===0){ u.x=10.5; u.y=9.5+k; } }); rebuildMap(); changed(); start(); paused=true;
   const s=world.units.find(u=>u.side===1); s.face=Math.PI; supStart(world,s,'bfield',null,'시험',10,10); for(let i=0;i<20;i++) stepWorld(world,1/30); const F=world.sf8.find(f=>f.hard); o.field=!!F;
   const a=world.units.find(u=>u.side===0&&!isFar(u)); sel.clear(); sel.add(a.i); o.at=!!fieldAt(world,F.x,F.y); giveFieldAtk(F); o.ord=a.order&&a.order.k;
   return o; });
 console.log('    ', JSON.stringify(r)); ok(r.nadal==='circ','나달 = 동그라미 (보병)'); ok(r.hk==='tri','헌팅나이프 = 세모 (기동)'); ok(r.field&&r.at,'역장을 누를 수 있음'); ok(r.ord==='fatk','역장을 누르면 역장 치기 명령');
 const t = await p.evaluate(async ()=>{ paused=false; mode='run'; world.turnEnd=999; await new Promise(r=>setTimeout(r,1200)); paused=true; renderLog(); await new Promise(r=>setTimeout(r,200)); const txt=document.getElementById('logView').textContent; const m=[...txt.matchAll(/(\d+\.\d+)초/g)].map(x=>+x[1]); return { maxShown: Math.max(0,...m), simT: world.t, sp: (document.getElementById('app').textContent.match(/속력 (\d+(?:\.\d+)?)칸\/초/)||[])[1] }; });
 console.log('    ', JSON.stringify(t)); ok(t.maxShown<=t.simT*4+0.6&&t.maxShown>t.simT*2,'기록의 시각 = 현실 초 (판 셈 × 4)'); ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,2)));
 await b.close(); console.log(fails?'FAIL '+fails:'ALL OK'); })();
