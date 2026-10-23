// v8.8.0 엔진 시험 — eng8800.js v1.1 (v1.1: [방어X] = 막는 재능의 바닥 (C 0.7 · B 0.8 · A 0.9 · S 1 — 베테랑 · 반사신경 틀) · 막는 폭도 · v1.0: 한 일대로 성장의 셈 — [방어X] 등급 (막을 수 있는 몸만 · 막을 때 깎이는 자세 · 받는 피해) ·
//   숨은 채 걸은 거리 (sneakMv — 숨기를 풀면 멈춤 · 숨을 수 없는 몸은 셈하지 않음) · 닿은 명령 (cmdOk — 내린 이 · 전한 이 · 받은 이 자신은 빼고 · 적 편은 셈하지 않음))
const {E,R,REB,KAR,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const WF=(units,o)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def=(o&&o.roe)||'hold'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:(o&&o.dark)?[]:[{x:20,y:10,r:80}],flips:[]},R2,(o&&o.seed)||1,{headless:true}); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++){ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; } };

console.log('A. [방어X] — 막는 재능의 바닥 (C 0.7 · B 0.8 · A 0.9 · S 1) · 막을 수 있는 몸만');
{ const G=R.grades['방어']||{}; ok(G.S===1&&G.A===0.9&&G.B===0.8&&G.C===0.7,'수치표 grades.방어 = '+JSON.stringify(G));
  const base={...REB,traits:[],gear:{}};
  const W=WF([mk({...base,name:'방패 맨'},0,5,5),mk({...base,name:'방패 A',traits:['방어A']},0,7,5),mk({...base,name:'방패 S',traits:['방어S']},0,9,5),mk({...base,name:'맨손 A',shield:false,weapon:'맨손',traits:['방어A']},0,11,5),mk({...base,name:'맨손',shield:false,weapon:'맨손'},0,13,5),mk({...base,name:'방패 C 베테랑',traits:['방어C','베테랑']},0,15,5),mk({...base,name:'적',side:1},1,35,15)]);
  const [a0,aA,aS,bA,b0,cV]=W.units;
  ok(a0.gTal===0.5&&aA.gTal===0.9&&aS.gTal===1,'방패 (공격수): 재능 '+a0.gTal+' → A '+aA.gTal+' · S '+aS.gTal);
  ok(cV.gTal===0.9,'바닥이니 더 높은 재능은 그대로 (베테랑 0.9 + [방어C] 0.7 → '+cV.gTal+')');
  ok(bA.gTal===b0.gTal,'막을 수 없는 몸 (맨손) 은 그대로 '+bA.gTal+' = '+b0.gTal);
  ok(aA.gArc>a0.gArc,'막는 폭도 넓어짐 '+a0.gArc+' → '+aA.gArc); }
// 막을 때: 같은 시드 여럿 — 막아 낸 공격 한 번에 깎인 자세 · 받은 피해 (A 가 적어야)
{ const run=tr=>{ let post=0,blk=0,tk=0; for(const sd of [1,2,3,4,5,6]){ const W=WF([mk({...REB,name:'방패',traits:tr,gear:{},ov:{hp:5000}},0,10,10),mk({...REB,name:'적',shield:false,weapon:'장검',traits:[],gear:{},ov:{hp:5000,atk:30}},1,11.2,10)],{roe:'free',seed:sd});
    const t=W.units[0], f=W.units[1]; t.order={k:'hold'}; t.guardMode='hold';
    for(let i=0;i<30*20;i++){ const p0=t.post, b0=t.blocked; step(W,1); if(t.blocked>b0) { post+=Math.max(0,p0-t.post); blk+=t.blocked-b0; } t.post=Math.max(t.post,40); }
    tk+=t.taken; }
    return { per: blk? post/blk : 0, blk, tk: Math.round(tk) }; };
  const r0=run([]), rA=run(['방어A']);
  console.log('    맨 '+JSON.stringify(r0)+' · A '+JSON.stringify(rA));
  ok(r0.blk>10&&rA.blk>10,'막아 낸 공격이 셈됨 (blocked — 성장의 바탕) '+r0.blk+' · '+rA.blk);
  ok(rA.per<r0.per*0.97,'막을 때 깎이는 자세 (막은 한 번에) '+r0.per.toFixed(1)+' → '+rA.per.toFixed(1)+' (×'+(rA.per/r0.per).toFixed(2)+')'); }

console.log('B. 숨은 채 걸은 거리 (sneakMv)');
{ const W=WF([mk({...REB,name:'숨는 이',shield:false,weapon:'단검',cls:'기동',traits:[],gear:{}},0,5,5),mk({...KAR,name:'거구'},0,5,12),mk({...REB,name:'적',traits:[],gear:{}},1,38,18)],{dark:true});
  const u=W.units[0], k=W.units[1]; u.stealth=true; k.stealth=true; u.order={k:'move',x:15,y:5}; k.order={k:'move',x:15,y:12};
  step(W,30*4); const m1=u.moved, s1=u.sneakMv||0;
  ok(s1>3&&Math.abs(s1-m1)<0.01,'숨은 채 걸음 = 걸은 거리 '+s1.toFixed(2)+' / '+m1.toFixed(2)+' · 숨는 솜씨 '+(u.stealthE||0).toFixed(2));
  ok(!(k.sneakMv>0)&&k.moved>1,'숨을 수 없는 몸 (거구 — 솜씨 '+(k.stealthE||0).toFixed(2)+' < '+(R.stealth.min)+') 은 셈하지 않음 (걸음 '+k.moved.toFixed(1)+')');
  u.stealth=false; u.order={k:'move',x:5,y:5}; step(W,30*3);
  ok((u.sneakMv||0)===s1&&u.moved>m1+2,'숨기를 풀면 (들킴 · 스스로) 멈춤 — '+(u.sneakMv||0).toFixed(2)+' · 걸음 '+u.moved.toFixed(1)); }

console.log('C. 닿은 명령 (cmdOk) — 내린 이 · 전한 이 (받은 이 자신은 빼고 · 적 편은 아님)');
{ const W=WF([mk({...REB,name:'대장',traits:['지휘B'],gear:{}},0,5,5),mk({...REB,name:'전하는 이',traits:[],gear:{}},0,7,5),mk({...REB,name:'받는 이 1',traits:[],gear:{}},0,9,5),mk({...REB,name:'받는 이 2',traits:[],gear:{}},0,11,5),mk({...REB,name:'적',traits:[],gear:{}},1,38,18)]);
  const [c,m,a,b,f]=W.units; const push=(u,P)=>{ (u.ordQ=u.ordQ||[]).push(P); u.ordPend=P; };
  push(a,{o:{k:'move',x:9,y:8},at:W.t,ok:true,c:c.i,m:m.i,p:1,t0:W.t,via:'relay'}); push(b,{o:{k:'move',x:11,y:8},at:W.t,ok:true,c:c.i,p:1,t0:W.t,via:'voice'});
  push(m,{o:{k:'move',x:7,y:8},at:W.t,ok:true,c:c.i,m:m.i,p:1,t0:W.t,via:'voice'});   // 전하는 이 자신에게 닿은 것은 그 몫에서 빠짐
  push(f,{o:{k:'move',x:30,y:18},at:W.t,ok:true,c:f.i,p:1,t0:W.t,via:'voice'});
  step(W,3);
  ok(c.cmdOk===3,'내린 이 (대장) '+c.cmdOk+' — 닿은 셋');
  ok(m.cmdOk===1,'전한 이 '+m.cmdOk+' — 전해서 닿은 하나 (제게 온 것은 빼고)');
  ok(!(a.cmdOk>0)&&!(b.cmdOk>0),'받기만 한 이는 0');
  ok(!(f.cmdOk>0),'적 편은 셈하지 않음 (성장은 동료만)');
  push(b,{o:{k:'move',x:12,y:9},at:W.t,ok:false,c:c.i,p:0.1,t0:W.t,via:'voice'}); step(W,3);
  ok(c.cmdOk===3,'못 닿은 명령은 셈하지 않음 ('+c.cmdOk+')'); }

console.log(fails?`\n${fails} FAIL`:'\nALL OK'); process.exitCode=fails?1:0;
