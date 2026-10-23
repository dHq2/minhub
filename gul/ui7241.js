// v7.24.1 UI 시험 — ui7241.js v1.4 (v1.4: 수치표 이전 칸 — 옛 저장을 써 넣은 뒤 다시 불러오기 전까지 판이 저장하지 않게 (넷을 나란히 돌려 느릴 때 밀린 저장이 써 넣은 옛 값을 덮어 손으로 바꾼 0.95 가 1 로 보이던 것) · v1.3: 던지기 장면은 세 번까지 다시 (적이 움직여 휘청이면 취소되는 것은 규칙) · v1.2: 이전 표시는 지금 판의 RULES_MIG · v1.1: 이전 시험은 옛 저장처럼 철퇴 칸을 모르는 상태로 · 모닝스타 철퇴: 판에서 던짐 (줄 + 공 그리기 · 머리 위로 돌림 · 매달림 — 오류 없음) · 사거리 2.3 · 설명 · 수치표 이전 (옛 기본값 1.3 · 도약 강타 2.2 · 세자르 걸음 0.45 → 새 값 · 손으로 바꾼 값은 둠) · 휴대폰 그림)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 let r = null; for (let k=0; k<3 && !(r && !r.err && r.wind && r.out && r.thrown>=1); k++){   /* v1.3: 적이 실제로 움직임 — 돌리는 중에 맞아 휘청이면 던지기가 취소됨 (v7.25.0 규칙) → 세 번까지 다시 */
 await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); const m=fromDesign(designByKey('모닝스타'),0); m.x=12.5; m.y=15.5; S.units.push(m); rebuildMap(); changed(); start(); });
 await p.waitForTimeout(300);
 r = await p.evaluate(()=>{ paused=true; const m=world.units.find(u=>u.name==='모닝스타'), e=world.units.find(u=>u.side===1&&u.alive); e.seenBy=true; m.x=e.x-(m.r+e.r+2.0); m.y=e.y; m.order=null;
   let err=null, wind=false, out=false; mode='run'; paused=false;
   try { startAct(world,m,e,'시험'); for (let i=0;i<60;i++){ stepWorld(world,1/30); if (m.act&&m.act.fl&&m.act.phase==='wind') wind=true; if ((world.flails||[]).length) out=true; if (i%3===0) draw(); } } catch(x){ err=x.message; }
   paused=true; mode='plan'; return { rng: m.rng, err, wind, out, thrown: world.log.filter(l=>l.k==='flail'&&l.a===m.i).length, back: !(world.flails||[]).length }; }); }
 console.log('    철퇴 ('+vw.nm+')', JSON.stringify(r)); ok(r.rng>2.29&&r.rng<2.31,'모닝스타 사거리 2.3'); ok(!r.err&&r.wind&&r.out&&r.thrown>=1,'판에서 던짐 — 돌리기 · 날아감 · 그리기 오류 없음'); ok(r.back,'공이 돌아옴');
 await p.evaluate(()=>{ const m=world.units.find(u=>u.name==='모닝스타'), e=world.units.find(u=>u.side===1&&u.alive); world.flails=[{by:m.i,side:0,b:e.i,ox:m.x,oy:m.y,dx:1,dy:0,s:1.2,L:2.9,x:m.x+1.2,y:m.y,v:13,vb:11,br:0.2,ph:'out',hit:null,ev:[],t0:world.t}]; cam.x=m.x+1; cam.y=m.y; cam.z=2.2; draw(); });
 await p.screenshot({path:`_s7241_${vw.nm}.png`});
 const d = await p.evaluate(()=>{ const x=designList().find(q=>q.key==='모닝스타'); return /2\.3M/.test(x.note)&&/던졌다 당겨/.test(x.tactic); }); ok(d,'모닝스타 설명 — 던졌다 당겨 옴 (2.3M)');
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 // 수치표 이전: 저장된 옛 기본값 → 새 값 (손으로 바꾼 값은 그대로)
 { const ctx=await b.newContext(); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
   await p.evaluate(()=>{ save(); const o=JSON.parse(localStorage.getItem('gul-battle-v3')); o.rulesMig='7.21.0'; o.rulesKeys=(o.rulesKeys||[]).filter(k=>!/flail/.test(k)); o.rules.weapons['모닝스타'].rng=1.3; delete o.rules.weapons['모닝스타'].flail; o.rules.spec.quake.mul=2.2; o.rules.spec.quake.kb=1.6; o.rules.spec.quake.down=1.4; o.rules.cz.walk=0.45; o.rules.cz.furyWalk=0.95; localStorage.setItem('gul-battle-v3', JSON.stringify(o)); window.save = () => {}; });
   await p.reload(); await p.waitForTimeout(900);
   const m = await p.evaluate(()=>({ rng: rules.weapons['모닝스타'].rng, fl: !!rules.weapons['모닝스타'].flail, qm: rules.spec.quake.mul, qk: rules.spec.quake.kb, qd: rules.spec.quake.down, w: rules.cz.walk, fw: rules.cz.furyWalk, mig: S.rulesMig, cur: RULES_MIG }));
   console.log('    이전', JSON.stringify(m)); ok(m.rng===2.3&&m.fl&&m.qm===0.3&&m.qk===0.7&&m.qd===undefined&&m.w===0.6&&m.mig===m.cur,'옛 기본값 그대로인 칸은 새 값으로 (사거리 · 도약 강타 · 세자르 걸음) · 철퇴 칸 채움 · 없앤 칸 지움');
   ok(m.fw===0.95,'손으로 바꾼 값 (세자르 딜타임 걸음 0.95) 은 그대로'); ok(errs.length===0,'오류 없음 (이전) '+JSON.stringify(errs.slice(0,3))); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7241 OK'); await b.close(); })();
