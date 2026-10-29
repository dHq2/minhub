// v7.25.0 시험 — eng7250.js v1.2 (v1.2: 허수아비 창병은 치지 않음 (v9.14.0 손 닿는 창병이 찌름) · 공이 돌아온 그 때를 봄 · v1.1: 넘어진 동안 공은 미끄러져 사슬 안에서 멈춤 · 던짐 시험은 4초 · 모닝스타: 한 바퀴 도는 중 넘어지면 끝 · 공은 바닥 → 일어나면 감아 들임 · 그동안 후리기 못 함 / 모으다 넘어져도 같음 / 휘청은 한 바퀴를 끊지 않음 / 던진 뒤 얼음 아님 ·
//   세자르: [보스] 치명상 → 즉사 아님 (큰 피해) · 보스 아니면 그대로 즉사 · 영거리 사격을 자주 비킴 · 한 방에 쓰러지지 않음 · 권총 탄도 비킴)
const {E,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const MS={ref:'C-208',name:'모닝스타',tier:3,cls:'근접',role:'공격수',weapon:'모닝스타',height:1.85,weight:95,ov:{hp:5000,atk:40},traits:['근력A'],active:['철퇴 후리기','휘둘러 치기']};
const DUM=(x,y)=>mk({ref:'C-053',name:'창병',tier:2,height:2,ov:{hp:9000,atk:1,wind:30},noChg:true,traits:['망자']},1,x,y);   /* v1.2 허수아비는 치지 않음 (준비 30초 · 돌격 없음) — v9.14.0 부터 손 닿는 창병은 제자리에서 찔러 모닝스타를 휘청이게 했음 */
const CZ={ref:'C-045',name:'세자르',tier:6,cls:'근접',role:'공격수',weapon:'노인의 검',height:2.1,weight:70,poise:6,sizeCls:'중대형',nv:true,nvG:'S',bold:1,ov:{hp:500,atk:62},traits:['보스','베테랑','회피S','속력S','갑피','망자'],gear:{머리:{name:'노인의 왕관',mat:'투구',tier:1}},brain:'cesar'};
const GAN={ref:'C-195',name:'간두',tier:2,cls:'원거리',role:'사수',weapon:'권총',ammo:100,shells:100,height:1.9,weight:85,sizeCls:'중형',ov:{hp:110,atk:26},traits:['사격A','회피B'],active:['영거리 사격']};
const lit=W=>{ W.amb=1; E.computeLight(W); };
// 1) 한 바퀴 도는 중 넘어짐
{ const W=W_([mk(MS,0,8,8)],[DUM(10,8),DUM(8,10.2)],1,'hold'); lit(W); const [m]=W.units;
  E.startSpec(W,m,null,'sweep','시험'); m.act.R=2; run(W,0.9,()=>m.act&&m.act.phase==='swing'&&m.act.el>0.1); const ph=m.act&&m.act.phase;
  E.knockDown(W,m,1.2,null,'시험'); const F=(W.flails||[]).find(f=>f.by===m.i), L=W.log.find(l=>l.k==='flailDrop');
  console.log('      ',ph,JSON.stringify(L),F&&F.ph);
  ok(ph==='swing'&&!m.act&&F&&F.ph==='drop'&&L&&L.s==='sweep','한 바퀴 도는 중 넘어짐 → 기술 끝 · 공이 바닥에 (철퇴를 놓침)');
  run(W,0.8); ok(F.ph==='drop'&&!m.act&&Math.hypot(F.x-m.x,F.y-m.y)<=F.L+0.05&&Math.hypot(F.vx,F.vy)<0.5,'넘어져 있는 동안 공은 미끄러져 사슬 안에서 멈춤 · 다시 돌리지 않음');
  ok(E.flailOut(W,m),'공이 나가 있음');
  run(W,0.6,()=>F.ph==='back'); ok(F.ph==='back'&&F.reel&&W.log.some(l=>l.k==='flailReel'),'일어나면 감아 들임 (reel)');
  const sx=m.x; m.order={k:'move',x:m.x-3,y:m.y}; run(W,1.2); console.log('       걸음',(sx-m.x).toFixed(2),'공',(W.flails||[]).some(f=>f.by===m.i));
  ok(sx-m.x>0.4,'감아 들이면서 걸음 (얼음 아님)'); run(W,3,()=>!(W.flails||[]).some(f=>f.by===m.i)); ok(!(W.flails||[]).some(f=>f.by===m.i),'공이 손으로 돌아옴'); }   /* v1.2 돌아온 그 때를 봄 (3초 끝엔 다시 휘두를 수 있음) */
// 2) 모으는 중 (머리 위로 돌리던 중) 넘어짐 · 공이 나가 있으면 후리기 못 함
{ const W=W_([mk(MS,0,8,8)],[DUM(10,8),DUM(8,10.2)],2,'hold'); lit(W); const [m]=W.units;
  E.startSpec(W,m,null,'sweep','시험'); run(W,0.3); const ph=m.act&&m.act.phase; E.knockDown(W,m,1,null,'시험');
  ok(ph==='wind'&&!m.act&&(W.flails||[]).some(f=>f.by===m.i&&f.ph==='drop'),'머리 위로 돌리다 넘어짐 → 끝 · 공이 바닥에');
  for (const x of m.spec||[]) x.cdT=0; ok(!E.specReady(W,m,'sweep'),'공이 나가 있으면 (넘어져 있어도) 후리기 못 함'); }
// 3) 휘청은 한 바퀴를 끊지 않음 (기세)
{ const W=W_([mk(MS,0,8,8)],[DUM(10,8)],3,'hold'); lit(W); const [m]=W.units;
  E.startSpec(W,m,null,'sweep','시험'); m.act.R=2; run(W,0.9,()=>m.act&&m.act.phase==='swing'); m.saT=-9; E.stun(W,m,0.3,null);
  ok(m.act&&m.act.s==='sweep'&&m.act.phase==='swing'&&!W.log.some(l=>l.k==='flailDrop'),'한 바퀴 도는 중 휘청 → 기세로 끝까지'); }
// 4) 던진 뒤 얼음 아님
{ const W=W_([mk(MS,0,6,8)],[DUM(8.6,8)],4,'hold'); lit(W); const [m,e]=W.units; m.order={k:'attack',b:e.i};
  let tThrow=null; run(W,4,()=>{ if (tThrow==null&&(W.flails||[]).some(f=>f.by===m.i)) tThrow=W.t; return tThrow!=null&&W.t>tThrow+0.4; });
  console.log('       던짐',tThrow&&tThrow.toFixed(2),'act',m.act&&m.act.k+':'+m.act.phase,'공',(W.flails||[]).length);
  ok(tThrow!=null&&!(m.act&&m.act.fl&&m.act.phase==='rec'),'던지고 0.4초 뒤엔 후속 동작이 끝남 (예전엔 공이 돌아올 때까지 3초)'); }
// 5) [보스] 치명상
{ const W=W_([mk(GAN,0,8,8)],[mk(CZ,1,9.4,8),DUM(12,8)],5,'hold'); lit(W); const [g,k,d]=W.units; const h0=k.hp;
  E.woundFatal(W,g,k,'brain',{}); const B=W.log.find(l=>l.k==='bossFatal'); console.log('      ',JSON.stringify(B),Math.round(k.hp));
  ok(k.alive&&B&&h0-k.hp>=40,'세자르 [보스]: 뇌 관통이어도 즉사하지 않음 — 큰 피해 ('+Math.round(h0-k.hp)+')');
  E.woundFatal(W,g,d,'brain',{}); ok(!d.alive,'보스가 아니면 그대로 즉사'); }
// 6) 영거리 사격 · 권총
{ let ev=0, kill=0, n=0; for (let s=1;s<=40;s++){ const W=W_([mk(GAN,0,8,8)],[mk(CZ,1,9.4,8)],s,'hold'); lit(W); const [g,k]=W.units;
    E.startSpec(W,g,k,'pb','시험'); for (let i=0;i<20&&g.act;i++) E.stepWorld(W,1/30); n++; if (W.log.some(l=>l.k==='pb'&&l.miss)) ev++; if (!k.alive) kill++; }
  console.log('       영거리',ev,'/',n,'비킴 · 쓰러짐',kill); ok(ev>=n*0.5&&kill===0,'영거리 사격: 세자르가 절반 넘게 비킴 · 한 방에 쓰러지지 않음'); }
{ let ev=0, hit=0; for (let s=1;s<=8;s++){ const W=W_([mk(GAN,0,4,8)],[mk(CZ,1,9.5,8,{ov:{hp:5000,atk:62}})],s); lit(W); const [g,k]=W.units; g.order={k:'attack',b:k.i};
    run(W,5,()=>{ k.x=9.5; k.y=8; }); ev+=W.log.filter(l=>l.k==='evade'&&l.b===k.i).length; hit+=W.log.filter(l=>l.k==='hit'&&l.a===g.i&&l.b===k.i).length; }
  console.log('       권총 비킴',ev,'맞음',hit); ok(ev>=hit*0.6,'권총 탄도 많이 비킴 (총구를 읽음)'); }
console.log(fails?`${fails} FAIL`:'ALL 7250 OK');
