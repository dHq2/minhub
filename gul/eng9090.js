// v9.6.3 엔진 시험 — eng9090.js v1.0 (따라다니던 날쌘 이 포함 · 전열 명단이 늘지 않음 · 카리우스 기술은 동료도 맞음 · 찍기는 한 점 · 위험 범위의 동료는 서둘러 피함 · 카리우스는 못 피할 동료가 걸리면 아낌 · 자리를 지키다 화살 맞으면 움직임)
const {E,R,U,KAR,REB,GOB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const KA={...KAR,traits:['거구','갑피','근력A','괴력A','머리 넷','은신E','근성','불경자'],active:['돌진','잡아뚫기','노인의 팔','라이트 훅','딥 킥','짓밟기']};
const dummy=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,seed)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='hold'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); for(const u of W.units) for(const x of u.spec||[]) x.cdT=-9; return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const freeze=W=>{ for(const u of W.units){ u.state='idle'; u.target=null; u.goal=null; u.path=null; } };
const hold=(u,...ks)=>{ for(const k of ks){ const x=(u.spec||[]).find(s=>s.k===k); if(x) x.cdT=1e9; } };
const runAct=(W,u,n)=>{ let k=n||200; while(k-->0&&u.act) step(W); };

console.log('A. 버팀 계산이 전열 명단을 늘리지 않음');
{ const W=WF([dummy('갑',10,9,0),dummy('을',10,10,0),dummy('병',10,11,0),dummy('적',14,10,1)]); for(const u of W.units){ u.face=0; u.order={k:'hold'}; }
  step(W,15); const a=W.units[1], ln=a.line&&a.line.ln; ok(!!ln,'전열이 섬 ('+(ln?ln.ids.length:0)+'마디)');
  if(ln){ const n0=ln.ids.length; for(let i=0;i<50;i++) E.braceOf(W,a,W.units[3],-1,0); ok(ln.ids.length===n0&&new Set(ln.ids).size===n0,'버팀을 50번 셈 → 명단 '+n0+' → '+ln.ids.length+' (같음)'); } }

console.log('B. 카리우스의 기술은 자리 안의 동료도 맞음 (오사)');
{ const W=WF([mk(KA,0,10,10),dummy('적',11.6,10,1),dummy('동료',11.2,11.0,0)]); const k=W.units[0], t=W.units[1], m=W.units[2]; freeze(W); t.order={k:'hold'}; t.seenBy=1; t.canGuard=false; m.order={k:'hold'}; m.stunT=999; m.canGuard=false;
  const h0=m.hp; E.startSpec(W,k,t,'ksw','시험'); runAct(W,k,80); ok(m.hp<h0,'노인의 팔 — 부채꼴 안의 동료가 맞음 ('+h0+' → '+Math.round(m.hp)+')'); }
{ const W=WF([mk(KA,0,10,10),dummy('적',11.4,10,1),dummy('먼 동료',10,14,0)]); const k=W.units[0], t=W.units[1], m=W.units[2]; freeze(W); t.order={k:'hold'}; t.seenBy=1; m.order={k:'hold'};
  const h0=m.hp; E.startSpec(W,k,t,'ksw','시험'); runAct(W,k,80); ok(m.hp===h0,'범위 밖 동료는 그대로'); }

console.log('C. 찍기는 한 점 — 표적 둘레 0.45칸에 걸친 몸만');
{ const W=WF([mk(KA,0,10,10),dummy('적',11.5,10,1),dummy('붙은 동료',11.5,10.75,0),dummy('옆 동료',11.5,12,0)]); const k=W.units[0], t=W.units[1], m=W.units[2], f=W.units[3]; freeze(W);
  const h0=m.hp, h1=f.hp, ht=t.hp; E.heavyHit(W,k,t,'smash'); ok(t.hp<ht,'표적이 맞음'); ok(m.hp<h0,'표적에 붙은 동료 (0.75칸) 도 휩쓸림 ('+h0+' → '+Math.round(m.hp)+')'); ok(f.hp===h1,'2칸 떨어진 동료는 안 맞음'); }

console.log('D. 위험 범위의 동료는 서둘러 피함 (제자리 명령이어도)');
{ let dodge=0, run=0, n=0; for(let sd=1;sd<=20;sd++){ const W=WF([mk(KA,0,10,10),dummy('적',11.6,10,1),dummy('동료',11.0,11.0,0)],sd); const k=W.units[0], t=W.units[1], m=W.units[2]; freeze(W); t.order={k:'hold'}; t.seenBy=1; m.order={k:'hold'};
    E.startSpec(W,k,t,'ksw','시험'); for(let i=0;i<12;i++){ step(W); if(m.mv&&m.mv.run&&W.t<m.mv.until) run++; } n++; if(W.log.some(l=>l.k==='tgDodge'&&l.a===m.i&&l.ff)) dodge++; }
  console.log('    20판 중 피함 '+dodge+' · 뛰며 피한 틱 '+run); ok(dodge>=12,'동료의 노인의 팔 범위에서 대부분 피함 ('+dodge+'/20)'); ok(run>0,'서둘러 (뜀걸음)'); }
{ let dodge=0; for(let sd=1;sd<=20;sd++){ const W=WF([mk(KA,1,10,10),dummy('아군',11.6,10,0),dummy('적 동료',11.0,11.0,1)],sd); const k=W.units[0], t=W.units[1], m=W.units[2]; freeze(W); t.order={k:'hold'};
    E.startSpec(W,k,t,'ksw','시험'); step(W,12); if(W.log.some(l=>l.k==='tgDodge'&&l.a===m.i)) dodge++; }
  ok(dodge>=10,'적 편도 같은 규칙 ('+dodge+'/20)'); }

console.log('E. 카리우스는 못 피할 동료가 걸리면 기술을 아낌');
{ const W=WF([mk(KA,0,10,10),dummy('적',11.6,10,1),dummy('넘어진 동료',11.0,11.0,0)]); const k=W.units[0], t=W.units[1], m=W.units[2]; freeze(W); m.proneT=W.t+5;
  ok(!E.karFFOk(W,k,t,'ksw'),'넘어진 동료가 부채꼴에 있음 → 아낌'); m.proneT=-9; ok(!E.karFFOk(W,k,t,'ksw'),'선 동료 1 · 적 1 → 아낌 (적이 더 많아야)');
  const W2=WF([mk(KA,0,10,10),dummy('적',11.6,10,1),dummy('적2',11.2,9.0,1),dummy('동료',11.0,11.0,0)]); ok(E.karFFOk(W2,W2.units[0],W2.units[1],'ksw'),'선 동료 1 · 적 2 → 씀 (동료는 피함)');
  const W3=WF([mk(KA,0,10,10),dummy('적',11.6,10,1)]); ok(E.karFFOk(W3,W3.units[0],W3.units[1],'ksw'),'동료가 없으면 씀'); }

console.log('F. 자리를 지키다 화살을 맞으면');
{ const W=WF([mk(GOB,0,10,10),dummy('먼 적',35,18,1)]); const g=W.units[0]; g.stay={x:10,y:10}; g.order=null; W.inc=[{side:0,x:10,y:10,dx:1,dy:0,tr:6,t:W.t,by:g.i}];
  step(W,12); const L1=W.log.find(l=>l.k==='stayShot'&&l.a===g.i); ok(!!L1&&L1.how==='hunt','날쌘 고블린 (기동) 은 날아온 쪽으로 ('+(L1?L1.how+' '+L1.dir:'없음')+')'); ok(g.stay&&g.stay.x>13,'지킬 자리가 화살이 날아온 쪽으로 옮겨감 (x '+(g.stay?g.stay.x.toFixed(1):'-')+')'); }
{ const W=WF([dummy('겁 많은 이',10,10,0,{bold:0.3}),dummy('먼 적',35,18,1)]); const g=W.units[0]; g.bold=0.3; g.cls='근접'; g.stay={x:10,y:10}; g.order=null; W.inc=[{side:0,x:10,y:10,dx:1,dy:0,tr:6,t:W.t,by:g.i}];
  step(W,12); const L1=W.log.find(l=>l.k==='stayShot'&&l.a===g.i); ok(!!L1&&L1.how==='back'&&!g.stay,'대담하지 않은 근접은 자리를 풀고 본대로'); }

{ const W=WF([mk(GOB,0,10,10),dummy('먼 적',35,18,1)]); const g=W.units[0]; g.stay=null; g.order=null; W.inc=[{side:0,x:10,y:10,dx:0,dy:1,tr:5,t:W.t-1,by:g.i},{side:0,x:10,y:10,dx:0,dy:1,tr:5,t:W.t,by:g.i}];
  step(W,12); const L1=W.log.find(l=>l.k==='stayShot'&&l.a===g.i); ok(!!L1&&L1.how==='hunt'&&g.stay&&g.stay.y>12,'따라다니던 날쌘 이도 두 번 맞으면 날아온 쪽으로 ('+(L1?L1.dir:'없음')+')'); }
{ const W=WF([dummy('겁 많은 이',10,10,0),dummy('먼 적',35,18,1)]); const g=W.units[0]; g.bold=0.3; g.cls='근접'; g.stay=null; g.order=null; W.inc=[{side:0,x:10,y:10,dx:1,dy:0,tr:6,t:W.t-1,by:g.i},{side:0,x:10,y:10,dx:1,dy:0,tr:6,t:W.t,by:g.i}];
  step(W,12); ok(!W.log.some(l=>l.k==='stayShot'),'따라다니던 겁 많은 이는 그대로 (본대 곁)'); }

console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
