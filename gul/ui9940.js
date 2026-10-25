// v9.9.4 UI 시험 — ui9940.js v1.0 (v1.0: 모닝스타는 막대 무기 그림 없이 사슬 + 공 (예전 그대로) · 고르거나 마우스를 올리면 사거리 원 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 const r = await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); const m=fromDesign(designByKey('모닝스타'),0); m.x=12.5; m.y=15.5; S.units.push(m); rebuildMap(); changed(); start(); paused=true;
   const u=world.units.find(x=>x.name==='모닝스타'); let n2=0; const w0=weaponMark2; weaponMark2=function(Wd,q){ if(q===u) n2++; return w0.apply(this,arguments); };
   let arcs=[]; const a0=CanvasRenderingContext2D.prototype.arc; CanvasRenderingContext2D.prototype.arc=function(x,y,R){ arcs.push(R); return a0.apply(this,arguments); };
   draw(); const before=arcs.length; arcs=[]; sel.clear(); sel.add(u.i); draw(); const ts=world._ts||null; CanvasRenderingContext2D.prototype.arc=a0; weaponMark2=w0;
   return { n2, picked: arcs.length, before, rng: u.rng }; });
 console.log('    ', JSON.stringify(r));
 ok(r.n2===0,'모닝스타에겐 막대 무기 그림을 그리지 않음 (사슬 + 공만)'); ok(r.picked>r.before,'고르면 사거리 원이 더 그려짐');
 await p.screenshot({path:'_s9940.png'});
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3))); console.log(fails?`${fails} FAIL`:'ALL UI9940 OK'); await b.close(); })();
