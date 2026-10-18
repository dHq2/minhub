// v7.23.1 시험 — eng7231.js v1.1 (v1.1: 원형 베기는 버티는 몸 (인주 체력 500 · 카리우스) · 리듬은 오래 버티는 레베카 · 자세 기준 0.6 · 세자르 1 — 2D 판 두뇌 이식: 깨어남 · 리듬 (탐색 ↔ 딜타임) · 탐색 중 간격 · 원형 베기 (둘레 모두 · 동상 · 밀림) · 끊김 · 어깨 박치기 · 뒷걸음 점프 · 빈틈 찌르기 → 확정 3연격 · 회피 반격 (확정 치명) · 동상 (걸음 ×0.55) · 자세 (덜 밀림) · 노인의 검 냉기 · 무덤의 계단 · 일행과 한 판)
const {E,R,DES,INJ,NOR,REB,KAR,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const CZ={ref:'C-045',name:'세자르',tier:6,cls:'근접',role:'공격수',weapon:'노인의 검',height:2.1,weight:70,poise:6,sizeCls:'중대형',nv:true,nvG:'S',bold:1,ov:{hp:2000,atk:62},traits:['보스','베테랑','회피S','속력S','갑피','망자'],gear:{머리:{name:'노인의 왕관',mat:'투구',tier:1}},brain:'cesar',dcounter:0.5,frostP:0.25,severP:0.35};
const KN=()=>JSON.parse(JSON.stringify(DES['검기사']));
const lit=W=>{ W.amb=1; E.computeLight(W); };
// 1) 깨어남 · 리듬
{ const W=W_([mk(REB,0,8,8,{ov:{hp:5000}})],[mk(CZ,1,15,8)],1,'hold'); lit(W); const k=W.units[1];
  run(W,0.5); ok(W.log.some(l=>l.k==='czWake')&&k.cz.on,'상대를 보면 깨어남');
  let fz=null, pr=null; run(W,12,()=>{ const m=W.log.filter(l=>l.k==='czMode'); if(m[0]&&fz==null) fz=m[0].t; if(m[1]&&pr==null) pr=m[1].t; return pr!=null; });
  console.log('      딜타임', fz, '탐색', pr); ok(fz!=null&&fz>4&&fz<5.2&&pr!=null&&pr-fz>4.2&&pr-fz<4.9,'리듬 — 탐색 4.5초 → 딜타임 4.5초 → 탐색'); }
// 2) 탐색 중엔 간격을 잼 (바로 붙지 않음)
{ const W=W_([mk(REB,0,8,8)],[mk(CZ,1,15,8)],1,'hold'); lit(W); const [r,k]=W.units; let mn=99; run(W,3.5,()=>{ r.x=8; r.y=8; mn=Math.min(mn,E.dist?E.dist(r,k):Math.hypot(r.x-k.x,r.y-k.y)); });
  console.log('      가장 가까이', mn.toFixed(2)); ok(mn>2.4,'탐색 중 — 간격 3.5 를 재며 돎 (가장 가까이 '+mn.toFixed(1)+')'); }
// 3) 원형 베기: 둘레 모두 · 동상 · 밀림
{ const W=W_([mk(INJ,0,6,8,{hero:true,ov:{hp:500}}),mk(KAR,0,8.6,9.6)],[mk(CZ,1,7.6,8)],1,'hold'); lit(W); const [a,b,k]=W.units; k.cz.on=true; k.cz.phaseT=99; const x0=[a.x,b.x];
  E.czStart(W,k,'spin',a); run(W,1.2); const L=W.log.find(l=>l.k==='czSpin'); console.log('      ',JSON.stringify(L), 'frost', [a,b].map(u=>(u.frostT||0).toFixed(1)));
  ok(L&&L.n===2,'원형 베기 — 둘레 둘 모두'); ok([a,b].some(u=>u.taken>0)&&[a,b].some(u=>(u.frostT||-9)>W.t-1.5),'맞으면 동상'); ok(k.cz.spin>6,'대기 8초'); }
// 4) 끊김: 모으는 동안 휘청이면
{ const W=W_([mk(INJ,0,6,8,{hero:true})],[mk(CZ,1,7.4,8)],1,'hold'); lit(W); const [a,k]=W.units; k.cz.on=true; k.cz.phaseT=99;
  E.czStart(W,k,'spin',a); E.stepWorld(W,1/30); E.stun(W,k,0.5,a.i); run(W,0.3); ok(W.log.some(l=>l.k==='czBreak')&&!W.log.some(l=>l.k==='czSpin')&&k.cz.spin>2.5,'모으는 동안 휘청 → 끊김 (대기 3초)'); }
// 5) 어깨 박치기
{ const W=W_([mk(INJ,0,5,8,{hero:true})],[mk(CZ,1,7.6,8)],1,'hold'); lit(W); const [a,k]=W.units; k.cz.on=true; k.cz.phaseT=99; const ax=a.x;
  E.czStart(W,k,'shoulder',a); run(W,1.2); const L=W.log.find(l=>l.k==='czShoulder'); console.log('      ',JSON.stringify(L), '밀림', (ax-a.x).toFixed(2));
  ok(L&&!L.miss&&a.taken>0,'어깨 박치기 — 달려들어 받음'); }
// 6) 뒷걸음 점프 (붙으면)
{ const W=W_([mk(REB,0,7,8)],[mk(CZ,1,8.1,8)],1,'hold'); lit(W); const [r,k]=W.units; k.cz.on=true; k.cz.phaseT=99; const d0=Math.hypot(r.x-k.x,r.y-k.y);
  E.czStart(W,k,'backs',r,{n:3}); run(W,1.6,()=>{ r.x=7; r.y=8; }); const d1=Math.hypot(r.x-k.x,r.y-k.y), n=W.log.filter(l=>l.k==='czBack').length; console.log('      ',d0.toFixed(2),'→',d1.toFixed(2),'번',n);
  ok(n===3&&d1-d0>3.5,'뒷걸음 점프 세 번 — '+(d1-d0).toFixed(1)+'M 물러남'); }
// 7) 빈틈 찌르기 → 확정 3연격
{ let got=0, punish=0; for(let s=1;s<=4;s++){ const W=W_([mk(INJ,0,6,8,{hero:true,ov:{hp:400}})],[mk(CZ,1,10,8)],s,'hold'); lit(W); const [a,k]=W.units; k.cz.on=true; k.cz.phaseT=99; k.cz.punish=0; a.stunT=W.t+1.5;
    run(W,2.5); if(W.log.some(l=>l.k==='czPunish')) punish++; const C=W.log.find(l=>l.k==='czCombo'); if(C&&C.n>=3) got++; }
  ok(punish===4&&got>=2,'휘청인 상대 → 빈틈 찌르기 ('+punish+'/4) · 확정 3연격 ('+got+'/4)'); }
// 8) 회피 반격 (확정 치명)
{ const W=W_([mk(REB,0,7.2,8)],[mk(CZ,1,8.2,8)],1,'hold'); lit(W); const [r,k]=W.units; k.cz.on=true; k.cz.phaseT=99; k.cz.spin=99; k.cz.back=99; k.cz.punish=99; k.dcPend={b:r.i,at:W.t};
  E.stepWorld(W,1/30); const L=W.log.find(l=>l.k==='dcounter'), H=W.log.find(l=>l.k==='hit'&&l.a===k.i); console.log('      ',JSON.stringify(L), H&&JSON.stringify({crit:H.crit,dmg:H.dmg,tag:H.tag}));
  ok(L&&r.taken>0,'회피 반격 — 피한 뒤 곧바로 되벰'); }
// 9) 동상: 걸음 × 0.55
{ const W=W_([mk(REB,0,7,8)],[mk(DES['창병'],1,15,8)],1,'hold'); const r=W.units[0], s0=E.spdNow0(W,r); E.frostOn(W,r,4,1); const s1=E.spdNow0(W,r);
  ok(Math.abs(s1/s0-0.55)<0.01,'동상 — 걸음 × 0.55 ('+(s1/s0).toFixed(2)+')'); run(W,4.2); ok(Math.abs(E.spdNow0(W,r)/s0-1)<0.01,'4초 뒤 풀림'); }
// 10) 자세: 가벼운 몸이지만 덜 밀림
{ const W=W_([mk(KAR,0,6,8)],[mk(CZ,1,8,8),{...mk(CZ,1,8,11),poise:1}],1,'hold'); const [c,k1,k2]=W.units; const l1=E.kbLen(W,c,k1,1), l2=E.kbLen(W,c,k2,1);
  console.log('      밀림', l1.toFixed(2), '자세 없으면', l2.toFixed(2)); ok(l1<l2*0.6,'자세 × 6 — 카리우스에게도 덜 밀림'); }
// 11) 노인의 검: 냉기 8%
ok(((R.weapons||{})['노인의 검']||{}).frost===0.08,'노인의 검 — 한 손 장검 · 냉기 8%');
// 12) 무덤의 계단: 위로 = 계단으로
{ const W=W_([mk(REB,0,7,12)],[mk(DES['창병'],1,25,2)],1,'hold'); W.camp=true; W.stairs={x:12.5,y:8.5}; const r=W.units[0]; r.order={k:'exit',dir:'up',x:r.x};
  run(W,6,()=>r.gone==='up'); ok(r.gone==='up'&&Math.hypot(r.x-12.5,r.y-8.5)<1.2,'계단으로 — 계단에 닿으면 위 맵으로'); }
// 13) 일행과 한 판 (자동)
{ let res=[]; for(let s=1;s<=3;s++){ const W=W_([mk(INJ,0,4,6,{hero:true}),mk(REB,0,5,8),mk(KAR,0,4,10),mk(NOR,0,3,7),mk(GOB,0,5,11),mk(KN(),0,6,9)],[mk(CZ,1,20,8)],s); lit(W); const k=W.units[6];
    run(W,60); const K=W.log.filter(l=>l.a===k.i&&['czStart','czCombo','dcounter','czPunish'].includes(l.k)).map(l=>l.k==='czStart'?l.s:l.k); const tally={}; for(const x of K) tally[x]=(tally[x]||0)+1;
    res.push({ t: W.t.toFixed(0), cz: k.alive?Math.round(k.hp):0, down: W.units.filter(u=>u.side===0&&!u.alive).length, use: tally }); }
  for(const r of res) console.log('      ',JSON.stringify(r)); ok(res.every(r=>Object.keys(r.use).length>=3),'한 판 — 여러 기술을 씀'); }
console.log(fails?`${fails} FAIL`:'ALL 7231 OK');
