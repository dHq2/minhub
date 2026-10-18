// v7.16.1 시험 — roe7161.js v1.1 (v1.1: C 는 닿는 거리에서 (q.ok 확인) · A · B 의 적을 멀리 · 어둠에 — 적이 먼저 쫓지 않게 · 교전 금지 자동 해제 · 한 번만 · 우리가 먼저 침 · 가는 중인 지시 · 끔 / 포복 · 일어남 명령 전달 · 0초 · 못 닿음 · 자동 = 스스로 판단)
const {E,DES,NOR,INJ,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const lift=W=>{ W.rules.roe.autoLift=true; return W; };
const lit=W=>{ W.torches=[{x:10,y:8,r:30}]; E.computeLight(W); };

console.log('A. 기본 교전 금지 → 동료가 맞으면 모두 판단 교전 (한 번)');
{ const W=lift(W_([mk(NOR,0,4,8),mk(DES['창병'],0,5,10),mk(INJ,0,2,8,{hero:true})],[mk(DES['궁수'],1,28,2)],1,'hold'));
  const [n,s,h]=W.units; ok(E.roeOf(W,n)==='hold'&&E.roeOf(W,h)==='hold','처음엔 모두 교전 금지');
  run(W,1); ok(W.battle0==null,'싸움 전엔 그대로'); n.hp-=5; n.hitT=W.t; run(W,1);
  const l=W.log.find(x=>x.k==='roeAuto'); console.log('    기록', JSON.stringify(l));
  ok(W.battle0!=null&&l&&l.a.length===3,'맞자마자 셋 모두 풀림'); ok(W.units.slice(0,3).every(u=>E.roeOf(W,u)==='smart'&&u.roeAuto!=null),'판단 교전 (자동 표시)');
  n.roe='hold'; n.hp-=5; n.hitT=W.t; run(W,2); ok(E.roeOf(W,n)==='hold'&&W.log.filter(x=>x.k==='roeAuto').length===1,'싸움 뒤 다시 준 교전 금지는 그대로 (한 번만)'); }

console.log('B. 우리가 먼저 맞힘 (적은 아직 모름)');
{ const W=lift(W_([mk(NOR,0,4,8),mk(INJ,0,2,8,{hero:true})],[mk(DES['창병'],1,26,8)],1,'smart')); const [n,h,e]=W.units; n.roe='hold';
  run(W,0.6); ok(W.battle0==null,'싸움 전'); e.hp-=3; e.hitT=W.t; e.hitSide=0; run(W,0.6);
  const l=W.log.find(x=>x.k==='roeAuto'); console.log('    기록', JSON.stringify(l)); ok(l&&l.a.includes(n.i)&&!l.a.includes(h.i),'교전 금지였던 노먼만 판단 교전 (인주는 원래 판단)'); ok(E.roeOf(W,n)==='smart','노먼 판단 교전'); }

console.log('C. 가는 중인 교전 금지 지시도 판단 교전으로');
{ const W=lift(W_([mk(NOR,0,8,8),mk(INJ,0,2,8,{hero:true})],[mk(DES['궁수'],1,28,2)],1,'smart')); lit(W); const [n,h]=W.units; run(W,0.5);
  E.sendPosture(W,[n],'roe','hold',{}); const q=(n.posPend||[]).find(x=>x.key==='roe'); console.log('    가는 중', q&&q.val, q&&+(q.at-W.t).toFixed(2), q&&q.via, q&&q.ok); if(q) q.ok=true;
  h.hp-=3; h.hitT=W.t; run(W,0.6); ok(q&&q.val==='smart'&&q.at>W.t-0.6,'가는 중이던 지시가 판단 교전으로 바뀜'); run(W,4); ok(E.roeOf(W,n)==='smart','닿은 뒤에도 판단 교전');
  const l=W.log.find(x=>x.k==='roeAuto'); ok(l&&l.pend.includes(n.i),'기록에 가는 중이던 지시'); }

console.log('D. 끄면 (autoLift false) 그대로');
{ const W=W_([mk(NOR,0,4,8),mk(INJ,0,2,8,{hero:true})],[mk(DES['궁수'],1,12,8)],1,'hold'); const n=W.units[0]; n.hitT=0.5; run(W,2); ok(E.roeOf(W,n)==='hold'&&!W.log.some(x=>x.k==='roeAuto'),'꺼 두면 교전 금지 그대로'); }

console.log('E. 포복 · 일어남 = 명령 (지휘관을 거쳐 닿고 닿으면 바로)');
{ const W=W_([mk(NOR,0,13,8),mk(DES['창병'],0,3,9),mk(INJ,0,2,8,{hero:true})],[mk(DES['창병'],1,28,2)],1,'smart'); const [n,s,h]=W.units;
  E.sendPosture(W,[n,s,h],'lie','down',{}); ok(n.lie&&s.lie&&h.lie,'0초 (작전 회의) 는 바로');
  E.sendPosture(W,[n,s,h],'lie','up',{}); run(W,1); ok(!n.lie&&!s.lie&&!h.lie,'0초 일어남도 바로');
  run(W,8.5); E.sendPosture(W,[n,s,h],'lie','down',{}); const qn=(n.posPend||[]).find(x=>x.key==='lie'), qs=(s.posPend||[]).find(x=>x.key==='lie');
  console.log(`    인주 바로 ${h.lie} · 창병 (곁) ${qs?(qs.at-W.t).toFixed(2)+'초':'바로'} · 노먼 (11칸) ${qn?(qn.at-W.t).toFixed(2)+'초 '+qn.via:'바로'}`);
  ok(h.lie,'지휘관 자신은 바로'); ok(qn&&qn.at>W.t&&!n.lie,'멀리 있는 노먼에겐 전해지는 중');
  let tLie=null; const t0=W.t; run(W,3,()=>{ if(tLie==null&&n.lie) tLie=W.t-t0; }); ok(tLie!=null&&Math.abs(tLie-(qn.at-t0))<0.1,`닿는 그 순간 엎드림 (${tLie&&tLie.toFixed(2)}초)`);
  const ld=W.log.filter(x=>x.k==='lieDown'&&x.a===n.i).pop(); ok(ld&&ld.why==='명령','명령으로 엎드림 기록'); ok(n.order==null||n.order.k!=='lie','명령 (하던 일) 은 그대로 — 자세만 바뀜'); }

console.log('F. 못 닿으면 하던 대로 (기록)');
{ const W=W_([mk(NOR,0,27,14),mk(INJ,0,2,2,{hero:true})],[mk(DES['창병'],1,28,2)],1,'smart'); const [n,h]=W.units; W.torches=[]; E.computeLight(W); run(W,0.5);
  E.sendPosture(W,[n],'lie','down',{}); const q=(n.posPend||[]).find(x=>x.key==='lie'); if(q) q.ok=false; run(W,(q?q.at-W.t:0)+0.5);
  const m=W.log.find(x=>x.k==='cmdMiss'&&x.a===n.i); console.log('    기록', JSON.stringify(m)); ok(!n.lie&&m&&/엎드려/.test(m.o),'안 닿으면 서 있고 기록에 엎드려 (포복)'); }

console.log('G. 자동 · 명령 취소 = 포복도 스스로 판단');
{ const W=W_([mk(NOR,0,4,8),mk(INJ,0,2,8,{hero:true})],[mk(DES['창병'],1,28,2)],1,'smart'); const n=W.units[0];
  E.lieSet(W,n,true,'명령'); run(W,1); ok(n.lie&&n.lieAuto==null,'명령으로 엎드림 — 혼자 안 일어남'); run(W,7); ok(n.lie,'7초 조용해도 엎드린 채');
  n.order={k:'hold'}; n.ordLive=n.order; n.ordPend={o:null,at:W.t+0.1,ok:true,p:1,via:'voice',c:1,t0:W.t}; run(W,0.5); ok(n.lie&&n.lieAuto!=null,'자동이 닿으면 스스로 판단으로');
  run(W,7.5); const lu=W.log.filter(x=>x.k==='lieUp'&&x.a===n.i).pop(); ok(!n.lie&&lu&&lu.why==='사격이 멎음','조용하니 스스로 일어남'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 7161 OK');
