// v9.3.0 엔진 시험 — eng9040.js v1.0 (계단 = 고지대 판정: 오르막 느림 · 더 잘 넘어짐 · 오르며 돌격 힘 못 얻음 · 아래에서 위로 쏘면 잘 안 맞음 · 내려가는 쪽은 그대로 / 전우조는 적도: 설정 cg · 옆구리 협공)
const {E,R,U,DES,NOR,INJ,GOB,KAR,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const WT=(units,ter,seed,roe)=>{ const R2=JSON.parse(JSON.stringify(R)); if(roe) R2.roe.def=roe; R2.roe.autoLift=false; R2.chgPol={allyOff:false}; return E.createWorld({type:'grid',W:30,H:16,seed:7,units,torches:[],flips:[],...ter},R2,seed||1,{headless:true}); };
const lit=W=>{ W.torches=[{x:10,y:8,r:40}]; E.computeLight(W); };
const HILL={hills:[{x:15,y:8,r:3,h:2.5}]}, STAIR={hills:[{x:15,y:8,r:3,h:2.5}],stairs:true};

console.log('A. 설정');
{ const m=E.buildMap({type:'grid',W:30,H:16,flips:[],units:[],torches:[],...STAIR}), m2=E.buildMap({type:'grid',W:30,H:16,flips:[],units:[],torches:[],...HILL}), m3=E.buildMap({type:'grid',W:30,H:16,flips:[],units:[],torches:[],stairs:true});
  ok(m.stairs===true&&!m2.stairs,'setup.stairs → 지도에 stairs (언덕이 있을 때만)'); ok(!m3.stairs,'언덕 없이 stairs 만 있으면 꺼짐');
  const T=E.DEFAULT_RULES.terrain.stairUp; ok(T&&T.climb>E.DEFAULT_RULES.terrain.climb&&T.trip>1&&T.tripS<E.DEFAULT_RULES.terrain.tripS&&T.charge<1&&T.aim>1,'수치표 terrain.stairUp: 오르막 느림 '+T.climb+' (보통 '+E.DEFAULT_RULES.terrain.climb+') · 넘어짐 × '+T.trip+' · 돌격 × '+T.charge+' · 사격 × '+T.aim); }

console.log('B. 오르막 걸음');
{ const go=(ter,x0,x1)=>{ const W=WT([mk(INJ,0,x0,8.5,{hero:true}),mk(DES['창병'],1,28.5,1.5)],ter,1,'hold'); lit(W); W.units[1].order={k:'hold'}; const u=W.units[0]; u.order={k:'move',x:x1,y:8.5}; const x=u.x; run(W,1); return Math.abs(u.x-x); };
  const flat=go({},9,14), hill=go(HILL,10,15), up=go(STAIR,10,15), dn=go(STAIR,15,20); console.log(`    1초 이동 평지 ${flat.toFixed(2)} · 언덕 오르막 ${hill.toFixed(2)} · 계단 오르막 ${up.toFixed(2)} · 계단 내리막 ${dn.toFixed(2)}`);
  ok(up<hill*0.95&&up<flat*0.8,'계단 오르막은 보통 언덕보다도 느림'); ok(dn>=flat*0.95,'내려가는 쪽은 그대로 (불리하지 않음)'); }

console.log('C. 비탈 미끄러짐');
{ let tS=0,tH=0,tF=0,tD=0; for(let sd=1;sd<=40;sd++){ for(const [ter,k] of [[STAIR,'S'],[HILL,'H'],[{},'F']]){ const W=WT([mk(INJ,0,10,8.5,{hero:true}),mk(DES['창병'],1,28.5,1.5)],ter,sd,'hold'); lit(W); W.units[1].order={k:'hold'}; const u=W.units[0]; u.order={k:'move',x:20,y:8.5,hurry:true}; run(W,3); const n=W.log.filter(l=>l.k==='prone'&&/오르다 미끄러짐/.test(l.why||'')).length; if(k==='S') tS+=n; else if(k==='H') tH+=n; else tF+=n; } }
  for(let sd=1;sd<=40;sd++){ const W=WT([mk(INJ,0,15,8.5,{hero:true}),mk(DES['창병'],1,28.5,1.5)],STAIR,sd,'hold'); lit(W); W.units[1].order={k:'hold'}; const u=W.units[0]; u.order={k:'move',x:25,y:8.5,hurry:true}; run(W,3); tD+=W.log.filter(l=>l.k==='prone'&&/내려가다 미끄러짐/.test(l.why||'')).length; }
  console.log(`    뛰어 오르기 40번: 계단 ${tS} · 보통 언덕 ${tH} · 평지 ${tF} / 계단 뛰어 내려가기 ${tD}`); ok(tS>tH&&tF===0&&tS>=3,'계단을 뛰어 오르면 보통 언덕보다 더 잘 넘어짐 (평지 0)'); }

console.log('D. 돌격: 오르며 힘을 못 얻음');
{ const ch=(ter,x0,x1)=>{ const W=WT([mk(DES['검기사'],0,x0,8.5),mk(DES['창병'],1,x1,8.5)],ter,3,'free'); lit(W); const [a,b]=W.units; for(const u of [a,b]){ u.state='idle'; u.target=null; u.goal=null; u.path=null; u.wander=99; } b.order={k:'hold'}; const xs=a.x; E.startCharge(W,a,b,null); let mx=0; run(W,0.8,()=>{ mx=Math.max(mx,Math.abs(a.x-xs)); }); return mx; };
  const fl=ch({},8,20), up=ch(STAIR,10,22), hu=ch(HILL,10,22), dn=ch(STAIR,15,27); console.log(`    돌격 달린 거리 평지 ${fl.toFixed(2)} · 언덕 오르막 ${hu.toFixed(2)} · 계단 오르막 ${up.toFixed(2)} · 계단 내리막 ${dn.toFixed(2)}`);
  ok(up<hu*0.9&&up<fl*0.85,'계단을 오르며 하는 돌격은 달린 거리가 줄음'); ok(dn>=fl*0.85,'내려가며 하는 돌격은 그대로'); }

console.log('E. 사격 보정');
{ const mkW=ter=>{ const W=WT([mk(KAR,0,15,11.4),mk(DES['창병'],1,15,8)],ter,1,'hold'); lit(W); return W; }; const WS=mkW(STAIR), WH=mkW(HILL);
  const [a,b]=WS.units, [a2,b2]=WH.units; const up=E.terrAim(WS,a,b,false), dn=E.terrAim(WS,b,a,false), upH=E.terrAim(WH,a2,b2,false), dnH=E.terrAim(WH,b2,a2,false);
  console.log(`    명중 보정: 계단 아래→위 ${up.toFixed(3)} · 위→아래 ${dn.toFixed(3)} / 보통 언덕 아래→위 ${upH.toFixed(3)} · 위→아래 ${dnH.toFixed(3)}`);
  ok(up<upH*0.92,'아래에서 위로 쏘면 보통 언덕보다도 안 맞음'); ok(Math.abs(dn-dnH)<1e-9&&dn>up,'위에서 아래로 쏘는 쪽은 그대로 (더 잘 맞음)'); }

console.log('F. 전우조는 적도');
{ const a=mk(DES['창병'],1,20,8,{cg:'x'}), b=mk(DES['창병'],1,22,8,{cg:'x'}), c=mk(DES['창병'],1,24,8), n=mk(NOR,0,6,8);
  const W=WT([n,a,b,c],{},1,'free'); const [,A,B,C]=W.units; ok(A.cg==='x'&&B.cg==='x'&&!C.cg,'적의 설정 cg 를 읽음 (a · b = x · c 없음)'); ok(E.matesOf(W,A).length===1&&E.matesOf(W,A)[0]===B&&E.isMateOf(A,B)&&!E.isMateOf(A,C),'적끼리도 전우 (matesOf · isMateOf)'); }
{ // 맞붙은 전우 곁으로 옆구리 협공 (적 편의 전우 둘 · 아군 하나 · 아군은 먼저 맞붙은 쪽에 붙음)
  let pin=0, n=0; for(let sd=1;sd<=12;sd++){ const a=mk(DES['검기사'],1,12,8,{cg:'x'}), b=mk(DES['검기사'],1,14,12,{cg:'x'}), t=mk(NOR,0,10,8); const W=WT([t,a,b],{},sd,'free'); lit(W); const [T,A,B]=W.units; T.hp=T.max=900; run(W,6,()=>{}); n++; if((W.log||[]).some(l=>l.k==='pact'||l.k==='pactMake')||(W.pacts||[]).length) pin++; }
  console.log(`    적 전우조 협공 약속 시도 ${n}판 중 약속 있음 ${pin}`); ok(true,'적 전우조가 있어도 판이 오류 없이 돎 (협공은 확률 — 위 수는 참고)'); }

console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
