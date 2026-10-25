// v7.23.0 시험 — eng7230.js v1.4 (v1.4: 이름 warden · v1.3: 모퉁이 시험에서 인주를 제자리에 · v1.2: 모퉁이 시험은 어두운 방 · v1.1: 지킴이는 판을 만들 때 같이 — 적이 없으면 시작하자마자 끝난 판 · 실내 규칙: 벽 너머는 지금 보이는 곳이 아님 · 가 본 곳도 벽을 봄 (실내만 — 다른 맵은 그대로) · 구역 빛 · 방 지킴이: 숨어 지킴 · 가까이 오면 터짐 · 문틈으로 보면 모퉁이로 → 안 오면 뒤따름 · 같은 방 동료가 맞으면 같이 · 들킴을 느끼면)
const {E,R,DES,INJ,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
// 20 × 12 · x = 10 세로 벽 (y = 5 만 문틈) · 오른쪽 방 (x 11 ~ 19)
const WALL=[]; for(let y=0;y<12;y++) if(y!==5) WALL.push('10,'+y);
const mkW=(units,ex)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='hold'; R2.roe.autoLift=false; return E.createWorld({type:'grid',W:20,H:12,seed:3,units,torches:[],flips:WALL.slice(),...(ex||{})},R2,5,{headless:true}); };
const C=(W,x,y)=>y*W.map.W+x;
// 1) 실내: 벽 너머 불 켜진 방은 지금 보이는 곳 · 가 본 곳이 아님 · 문틈 줄은 보임
{ const W=mkW([mk(INJ,0,6.5,5.5,{hero:true})],{indoor:true,zones:[{x0:11,y0:0,x1:19,y1:11,amb:0.5}]}); W.units[0].torchOff=true; E.computeLight(W); E.markIndoor(W,W.units.filter(u=>u.side===0));
  ok(W.light[C(W,15,2)]>0.4&&W.light[C(W,5,2)]===0,'구역 빛 — 방 안만 밝음 ('+W.light[C(W,15,2)].toFixed(2)+' · 밖 '+W.light[C(W,5,2)]+')');
  ok(W.visNow[C(W,15,2)]===0&&W.explored[C(W,15,2)]===0,'벽 너머 (15,2) — 안 보임 · 가 본 곳 아님');
  ok(W.visNow[C(W,13,5)]===1&&W.explored[C(W,13,5)]===2,'문틈 줄 (13,5) — 보임 · 밝아서 가 본 곳');
  ok(W.visNow[C(W,10,3)]===1,'벽 앞면 (10,3) 은 보임'); }
// 2) 실내가 아니면 그대로 (빛이 닿은 곳은 가 본 곳)
{ const W=mkW([mk(INJ,0,6.5,5.5,{hero:true})],{zones:[{x0:11,y0:0,x1:19,y1:11,amb:0.5}]}); E.computeLight(W); E.stepWorld(W,1/30); run(W,0.2);
  ok(W.explored[C(W,15,2)]===2&&!W.visNow,'실내가 아닌 맵 — 예전 그대로 (벽 너머도 가 본 곳)'); }
const KN=()=>JSON.parse(JSON.stringify(DES['검기사']));
const POST={room:'A',door:{x:10.5,y:5.5},corner:{x:11.6,y:4.2}};
// 3) 숨어 지킴 → 가까이 오면 터짐
{ const W=mkW([mk(INJ,0,4.5,5.5,{hero:true}),{...mk(KN(),1,15.5,2.5),warden:{...POST}}],{indoor:true}); const g=W.units[1]; W.amb=0.02;
  run(W,2); const still=Math.hypot(g.x-15.5,g.y-2.5)<0.2&&g.warden.on;
  ok(still,'지킴이 — 제자리에 숨어 지킴 ('+g.mood+')');
  const a=W.units[0]; a.x=13.5; a.y=3.5; run(W,1);
  const L=W.log.find(l=>l.k==='wardenOut'); console.log('     ',JSON.stringify(L));
  ok(L&&L.why==='near'&&!g.warden.on&&g.state==='hunt','상대가 3.5칸 안 → 터져서 덮침'); }
// 4) 벽 너머 가까이는 안 터짐 (벽이 막음)
{ const W=mkW([mk(INJ,0,8.5,2.5,{hero:true}),{...mk(KN(),1,11.5,2.5),warden:{...POST}}],{indoor:true}); const g=W.units[1]; W.amb=0.02; W.units[0].order={k:'hold'};   /* v9.8.1 곧은 길로 2초 안에 문을 지나가 버려서 — 벽 너머를 시험하려고 세움 */
  run(W,2); ok(g.warden.on&&!W.log.some(l=>l.k==='wardenOut'),'벽 너머 3칸 — 터지지 않음'); }
// 5) 문틈으로 보면 모퉁이로 → 안 오면 (지나쳐 감) 어둠 속으로 뒤따름
{ const W=mkW([mk(INJ,0,6.5,5.5,{hero:true}),{...mk(KN(),1,14.5,5.5),warden:{...POST}}],{indoor:true}); const g=W.units[1]; E.computeLight(W);   // 어두운 방 · 인주는 횃불 (지킴이는 봄 · 인주는 못 봄)
  const a0=W.units[0], pin=()=>{ a0.x=6.5; a0.y=5.5; a0.vx=0; a0.vy=0; };   // 인주는 제자리 (다가가면 들켜서 터짐 — 그건 3) 에서 봄)
  let cAt=null; run(W,4,()=>{ pin(); if(cAt==null&&W.log.some(l=>l.k==='wardenCorner')) cAt=W.t; });
  ok(cAt!=null&&Math.hypot(g.x-POST.corner.x,g.y-POST.corner.y)<0.6&&g.warden.on,'문틈으로 봄 → 문 옆 모퉁이로 붙어 기다림 ('+g.x.toFixed(1)+','+g.y.toFixed(1)+')');
  run(W,9,()=>{ pin(); }); const L=W.log.find(l=>l.k==='wardenOut'); console.log('     ',JSON.stringify(L));
  ok(L&&L.why==='pass'&&g.stalk&&!g.warden.on,'오지 않음 → 지나쳐 감 → 어둠 속으로 뒤따름 (stalk)'); }
// 6) 같은 방 동료가 맞으면 같이 터짐 · 다른 방은 그대로
{ const W=mkW([mk(INJ,0,4.5,9.5,{hero:true}),{...mk(KN(),1,15.5,2.5),warden:{...POST}},{...mk(KN(),1,17.5,8.5),warden:{...POST}},{...mk(KN(),1,2.5,1.5),warden:{room:'B'}}],{indoor:true}); W.amb=0.02; const [,g1,g2,g3]=W.units;
  g1.taken=5; run(W,0.2); const L=W.log.find(l=>l.k==='wardenOut'); console.log('     ',JSON.stringify(L));
  ok(L&&L.why==='hit'&&L.n===2&&!g1.warden.on&&!g2.warden.on&&g3.warden.on,'맞음 → 같은 방 둘이 같이 터짐 · 다른 방 (B) 은 그대로'); }
// 7) 들킴을 느끼면 터짐
{ const W=mkW([mk(INJ,0,4.5,9.5,{hero:true}),{...mk(KN(),1,15.5,2.5),warden:{...POST}}],{indoor:true}); W.amb=0.02; const g=W.units[1]; g.warden.seen=0; run(W,0.2);
  const L=W.log.find(l=>l.k==='wardenOut'); ok(L&&L.why==='seen'&&g.target===W.units[0],'들킴을 느낌 → 터짐 (본 이를 노림)'); }
// 8) 숨음: 지킴이는 은신 (검기사 은신A) 만큼 덜 멀리 보임
{ const W=mkW([mk(REB,0,7.5,5.5),{...mk(KN(),1,15.5,5.5),warden:{...POST}}],{indoor:true}); W.amb=1; const g=W.units[1]; E.computeLight(W); E.stepWorld(W,1/30);
  ok(!g.seenBy,'밝은 곳에서도 8칸 밖 숨은 지킴이는 안 보임'); g.warden.on=false; E.stepWorld(W,1/30); ok(g.seenBy,'숨기를 풀면 보임'); }
console.log(fails?`${fails} FAIL`:'ALL 7230 OK');
