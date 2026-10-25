// v7.24.0 시험 — eng7240.js v1.3 (v1.3: 스텝 갈래 시험은 5판 (3판이면 드문 치고 빠짐이 안 나올 때가 있음 — v9.9.5 대기 몸짓이 한가할 때만이 되며 난수 순서가 바뀜) · v1.2: v9.0.0 — 아군 기본 지침이 돌격 금지라 이 시험 (돌격과 상관없는 것) 은 옛 기본 (allyOff 끔) 으로 (아군마다 돌격 허용) · v1.1: v7.29.0 부터 붙으면 대개 원형 베기 → 몇 초 뒤 돌진 원형 베기라 스텝 틈이 조금 줄어듦 — 판마다 초당 0.3번 · 모두 합쳐 0.5번 넘게 · v1.0: 세자르: 피 500 · 스텝을 마구 밟음 (비켜 섬 · 치고 빠짐 · 밟아 들어가 벰 · 옆걸음) · 스텝 중 회피 / 호레이쇼 도약 강타: 공중은 피해 없음 · 절반 넘게 겹치면 찌부러짐 · 몸에 걸치면 밀려나며 약한 피해 · 범위는 약한 피해 · 넘어짐 없음 · 여덟 판)
const {E,R,DES,INJ,NOR,REB,KAR,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const CZ={ref:'C-045',name:'세자르',tier:6,cls:'근접',role:'공격수',weapon:'노인의 검',height:2.1,weight:70,poise:6,sizeCls:'중대형',nv:true,nvG:'S',bold:1,ov:{hp:500,atk:62},traits:['보스','베테랑','회피S','속력S','갑피','망자'],gear:{머리:{name:'노인의 왕관',mat:'투구',tier:1}},brain:'cesar',dcounter:0.5,frostP:0.25,severP:0.35,unique:['권위']};
const HORA={ref:'C-158',name:'호레이쇼',tier:4,cls:'근접',role:'공격수',weapon:'대장군의 도끼',height:5,weight:1100,sizeCls:'중대형',rMul:1.8,nv:true,nvG:'A',bold:0.8,ov:{hp:2400,atk:75},traits:['거구','근력S','괴력S','베테랑','망자','보스'],gear:{몸:{name:'대장군의 갑옷',mat:'판금',tier:3},머리:{name:'대장군의 투구',mat:'투구',tier:3}},active:['도약 강타','회전 투척']};
const KN=()=>JSON.parse(JSON.stringify(DES['검기사']));
const lit=W=>{ W.amb=1; E.computeLight(W); };
// 1) 세자르의 스텝: 10초 싸움에 자주 · 갈래
{ let st={}, n=0, side=0, T=0; for (let s=1;s<=5;s++){ const W=W_([mk(KAR,0,9,8,{ov:{hp:20000}}),mk(REB,0,10,10,{ov:{hp:20000}}),mk(KN(),0,10,6,{ov:{hp:20000}})],[mk(CZ,1,16,8,{ov:{hp:20000,atk:62}})],s,'free'); lit(W); const k=W.units[3];
    run(W,10); n+=k.cz.nStep+W.log.filter(l=>l.k==='czBack'&&l.a===k.i).length; T+=W.t; side+=W.log.filter(l=>l.k==='czSide').length; for (const [a,b] of Object.entries(k.cz.stepK||{})) st[a]=(st[a]||0)+b; }
  console.log('      스텝',n,'번 /',T.toFixed(0),'초 ·',JSON.stringify(st),'· 비켜 섬 로그',side);
  ok(n/T>=0.75,'스텝 (뒷걸음 점프 포함) 을 마구 밟음 (초당 '+(n/T).toFixed(2)+'번)'); ok(['비켜 섬','치고 빠짐','밟아 들어가 벰'].every(x=>st[x]>0),'비켜 섬 · 치고 빠짐 · 밟아 들어가 벰 모두 나옴'); }
// 2) 들어오는 일격을 비켜 섬 → 그 일격은 헛침
{ let whiff=0, tried=0; for (let s=1;s<=6;s++){ const W=W_([mk(KN(),0,10,8,{ov:{hp:20000}})],[mk(CZ,1,11.2,8,{ov:{hp:20000,atk:1}})],s,'free'); lit(W); const [a,k]=W.units; k.cz.on=true; k.cz.auth=null;
    run(W,8); tried+=W.log.filter(l=>l.k==='czSide').length; whiff+=W.log.filter(l=>l.k==='miss'&&l.a===a.i&&l.b===k.i).length; }
  console.log('      비켜 섬',tried,'· 검기사의 헛침',whiff); ok(tried>0&&whiff>0,'들어오는 일격을 옆 · 뒤로 비켜 섬 — 헛침이 나옴'); }
// 3) 스텝 중 회피 바닥
{ const W=W_([mk(KN(),0,10,8)],[mk(CZ,1,13,8)],1,'hold'); lit(W); const [a,k]=W.units; k.cz.on=true; E.czStep(W,k,a,[Math.PI/2],1.6,null,'시험'); ok(k.act&&k.act.s==='step'&&E.evadeP(W,k,a,'melee')>=0.6,'스텝 중엔 근접 회피 '+E.evadeP(W,k,a,'melee').toFixed(2)+' (바닥 0.6)');
  const x0=k.x,y0=k.y; run(W,0.2); ok(Math.hypot(k.x-x0,k.y-y0)>1.4,'0.13초에 1.6M'); }
// 4) 호레이쇼 도약 강타
{ const W=W_([mk(INJ,0,10,8,{hero:true,ov:{hp:600}}),mk(GOB,0,10,8.95,{ov:{hp:600}}),mk(REB,0,12.6,8,{ov:{hp:600}}),mk(GOB,0,10,6.6,{ov:{hp:600}})],[mk(HORA,1,4,8)],1,'hold'); lit(W); const [a,g,r,j,h]=W.units;
  console.log('      호레이쇼 몸 반지름',h.r.toFixed(2),'· 인주',a.r.toFixed(2),'청광묵',g.r.toFixed(2));
  const ovA=E.circOv(0,h.r,a.r)/(Math.PI*a.r*a.r), ovG=E.circOv(0.95,h.r,g.r)/(Math.PI*g.r*g.r); console.log('      겹친 몫 — 인주',ovA.toFixed(2),'청광묵(0.95M)',ovG.toFixed(2)); ok(ovG>0&&ovG<0.5,'청광묵은 몸에 걸침 (절반 아래)');
  j.act={k:'leap',phase:'run',t0:W.t,end:W.t+9,fx:j.x,fy:j.y,tx:j.x,ty:j.y};   // 청광묵 2 는 도약 중 (공중)
  const P={}; for (const u of [a,g,r,j]) P[u.i]={hp:u.hp,x:u.x,y:u.y};
  ok(E.startQuake(W,h,10,8,'시험'),'인주 자리로 도약 강타'); for (const u of [a,g,r]){ u.flee=null; u.order=null; }
  run(W,1.3,()=>{ for (const u of [a,g,r]){ u.flee=null; if (h.act){ u.x=P[u.i].x; u.y=P[u.i].y; } }   /* 시험: 그림자를 보고 걸어 피하지 않게 자리를 묶음 */ j.act={k:'leap',phase:'run',t0:W.t,end:W.t+9,fx:j.x,fy:j.y,tx:j.x,ty:j.y}; return !h.act; });
  const Lq=W.log.find(l=>l.k==='quakeHit'); console.log('      ',JSON.stringify(Lq),'피',[a,g,r,j].map(u=>Math.round(P[u.i].hp-u.hp)));
  ok(!a.alive&&W.log.some(l=>l.k==='die'&&l.b===a.i&&l.how==='crush'),'절반 넘게 겹친 인주 — 찌부러짐');
  ok(g.alive&&P[g.i].hp-g.hp>0&&P[g.i].hp-g.hp<60&&Math.hypot(g.x-h.x,g.y-h.y)>=h.r+g.r,'몸에 걸친 청광묵 (절반 아래) — 약한 피해 · 몸 밖으로 밀려남 (피 −'+Math.round(P[g.i].hp-g.hp)+')');
  ok(r.alive&&P[r.i].hp-r.hp<60&&!W.log.some(l=>l.k==='down'&&l.b===r.i)&&!(W.t<(r.proneT||-9)),'충격 범위의 레베카 — 약한 피해 · 넘어지지 않음 (피 −'+Math.round(P[r.i].hp-r.hp)+')');
  ok(j.hp===P[j.i].hp&&W.log.some(l=>l.k==='quakeAir'&&l.b===j.i),'도약 중 (공중) 인 청광묵 — 피해 없음'); }
// 5) 여덟 판 (피 500 · 권위 · 스텝)
{ let res=[]; for (let s=1;s<=8;s++){ const W=W_([mk(INJ,0,4,6,{hero:true}),mk(REB,0,5,8),mk(KAR,0,4,10),mk(NOR,0,3,7),mk(GOB,0,5,11),mk(KN(),0,6,9)],[mk(CZ,1,20,8)],s); for(const u of W.units) if(u.side===0) u.noChg=u.noChg0=false; lit(W); const k=W.units[6];
    run(W,90); res.push({ t: +W.t.toFixed(0), cz: k.alive?Math.round(k.hp):0, down: W.units.filter(u=>u.side===0&&!u.alive).length, step: k.cz.nStep+W.log.filter(l=>l.k==='czBack'&&l.a===k.i).length, ev: W.log.filter(l=>l.k==='evade'&&l.b===k.i).length }); }
  for (const r of res) console.log('      ',JSON.stringify(r)); const win=res.filter(r=>r.cz===0).length; console.log('      일행이 이긴 판',win,'/ 8');
  ok(res.every(r=>r.step/Math.max(1,r.t)>=0.3)&&res.reduce((a,r)=>a+r.step,0)/Math.max(1,res.reduce((a,r)=>a+r.t,0))>=0.5,'판마다 스텝을 밟음 (초당 0.3번 · 모두 합쳐 0.5번 넘게)'); }
console.log(fails?`${fails} FAIL`:'ALL 7240 OK');
