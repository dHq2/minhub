// v7.14.1 시험 — step7141.js v1.2 (v1.2: A 셋째 확인 = 그대로 쏨 (명중은 사수 자리 따라 달라 비교 안 함) · v1.1: A · B 의 적을 검기사로 — 창병이 엎드린 동료에게 창을 던져 시험이 흐려짐) (엎드린 동료 위로 쏨 · 노린 엎드린 몸은 맞음 · 징검다리 지휘 전달)
const {E,DES,NOR,INJ,REB,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const lit=W=>{ W.torches=[{x:8,y:8,r:30}]; E.computeLight(W); };

console.log('A. 사선 위의 동료: 엎드림 vs 서 있음 (노먼이 급히 쏨 — 오사 감수)');
{ const res={}; for (const lie of [true,false]){ let ff=0,shots=0,eh=0; for(let sd=1;sd<=16;sd++){ const W=W_([mk(NOR,0,4,8),mk(REB,0,8,8),mk(INJ,0,2,14,{hero:true})],[mk(DES['검기사'],1,12.5,8)],sd,'hold'); lit(W);
      const n=W.units[0], r=W.units[1], e=W.units[3]; r.roe='hold'; r.order={k:'hold'}; e.order=null; e.state='idle'; e.wander=99; if(lie){ E.lieSet(W,r,true,'시험'); run(W,0.7); }
      n.order={k:'attack',b:e.i,now:true}; const s0=n.shots||0; run(W,4,()=>{ e.x=12.5; e.y=8; e.vx=0; e.vy=0; if(e.act) e.act=null; r.x=8; r.y=8; });
      shots+=(n.shots||0)-s0; ff+=W.log.filter(x=>x.k==='hit'&&x.a===n.i&&x.b===r.i).length; eh+=W.log.filter(x=>x.k==='hit'&&x.a===n.i&&x.b===e.i).length; }
    res[lie?'엎드림':'서 있음']={shots,ff,eh}; }
  console.log('    ', JSON.stringify(res)); ok(res['엎드림'].ff<=res['엎드림'].shots*0.12,'엎드린 동료는 거의 안 맞음'); ok(res['서 있음'].ff>res['엎드림'].ff*2,'서 있는 동료는 훨씬 자주 맞음'); ok(res['엎드림'].shots>=res['서 있음'].shots*0.7,'엎드린 동료가 있어도 그대로 쏨'); }

console.log('B. 사선 판단: 엎드린 동료는 막는 몸이 아님 (보통 공격 · 기다리지 않음)');
{ const W=W_([mk(NOR,0,4,8),mk(REB,0,8,8),mk(INJ,0,2,14,{hero:true})],[mk(DES['창병'],1,12.5,8)],1,'free'); lit(W); const n=W.units[0], r=W.units[1], e=W.units[3];
  E.lieSet(W,r,true,'시험'); run(W,0.7); const f1=E.ffOdds?E.ffOdds(W,n,e,n.x,n.y).p:null; const W2=W_([mk(NOR,0,4,8),mk(REB,0,8,8),mk(INJ,0,2,14,{hero:true})],[mk(DES['창병'],1,12.5,8)],1,'free'); lit(W2); const f2=E.ffOdds?E.ffOdds(W2,W2.units[0],W2.units[3],4,8).p:null;
  console.log(`    오사 확률: 엎드림 ${f1&&f1.toFixed(3)} · 서 있음 ${f2&&f2.toFixed(3)}`); ok(f1!=null&&f1<0.1&&f2>0.5,'오사 확률 계산도 엎드린 동료는 낮게');
  const n2=W.units[0]; n2.order={k:'attack',b:e.i}; run(W,2.5); ok(!W.log.some(x=>x.k==='hold'&&x.a===n2.i&&x.by===r.i),'엎드린 동료 때문에 쏘기를 멈추지 않음'); }

console.log('C. 노린 엎드린 몸은 맞을 수 있음 · 엎드려 쏘면 엎드린 동료가 사선을 막음');
{ let hit=0; for(let sd=1;sd<=10;sd++){ const W=W_([mk(REB,0,8,8),mk(INJ,0,2,14,{hero:true})],[mk(DES['궁수'],1,13,8)],sd,'free'); lit(W); const r=W.units[0], a=W.units[2]; r.order={k:'hold'}; r.roe='hold'; E.lieSet(W,r,true,'시험'); run(W,0.7);
    a.order=null; run(W,6,()=>{ r.x=8; r.y=8; }); hit+=W.log.filter(x=>x.k==='hit'&&x.a===a.i&&x.b===r.i).length; }
  console.log(`    궁수가 엎드린 레베카를 맞힘 ${hit}번 (10판)`); ok(hit>0,'노린 엎드린 몸은 맞음');
  const W=W_([mk(NOR,0,4,8),mk(REB,0,6,8),mk(INJ,0,2,14,{hero:true})],[mk(DES['창병'],1,12.5,8)],1,'free'); lit(W); const n=W.units[0], r=W.units[1], e=W.units[3]; E.lieSet(W,n,true,'시험'); E.lieSet(W,r,true,'시험'); run(W,0.7);
  const lb=E.lineBodies?E.lineBodies(W,n,e,n,null).map(b=>b.name):[]; console.log('    엎드린 노먼의 사선 위', JSON.stringify(lb)); ok(lb.includes('레베카'),'둘 다 엎드리면 낮게 날아 동료가 사선을 막음'); }

console.log('D. 징검다리: 중간에 동료가 있으면 명령이 더 빨리 닿음');
{ const T=(mid,dark)=>{ let st=0,sp=0,n=0,est=0; for(let sd=1;sd<=30;sd++){ const al=[mk(INJ,0,2,8,{hero:true})]; for(const x of mid) al.push(mk(REB,0,x,8)); al.push(mk(GOB,0,11,8)); const W=W_(al,[mk(DES['창병'],1,28,2)],sd,'smart');
      if(dark){ for(const u of W.units){ u.torch=false; } W.torches=[]; E.computeLight(W); } else lit(W); const C=W.units[0], g=W.units[W.units.length-2]; if(g.blindL){ g.face=Math.PI; g.fg=Math.PI; }
      const r=E.cmdWave(W,C,[g])[0]; if(r.ok){ st+=r.t; n++; } sp+=r.p; if(sd===1) est=E.cmdLinkM(W,C,g).t; }
    return { 받음:n, 평균초: n?+(st/n).toFixed(2):null, 확률: +(sp/30).toFixed(2), 어림초: +est.toFixed(2) }; };
  for (const dk of [false,true]){ const a=T([],dk), b=T([6.5],dk), c=T([4.3,6.6,8.9],dk); console.log(`    ${dk?'어둠':'빛'} 9칸 — 사이 없음 ${JSON.stringify(a)} · 하나 ${JSON.stringify(b)} · 셋 (2.3칸 간격) ${JSON.stringify(c)}`);
    ok(c.평균초<a.평균초||!a.평균초,(dk?'어둠':'빛')+': 징검다리 셋이면 더 빨리 닿음'); ok(c.어림초<=a.어림초+1e-9||!(a.받음),(dk?'어둠':'빛')+': 어림 시간도 징검다리가 빠름'); ok(c.받음>=a.받음,(dk?'어둠':'빛')+': 더 잘 닿음'); } }

console.log(fails?`\n${fails} FAIL`:'\nALL 7141 OK');
