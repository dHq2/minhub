// v7.12 시험 — lie712.js v1 (빨리 일어남 · 카리우스 · 스스로 엎드림 · 곡사 면 제압 · 측후방 도약 · 돌격 · 우회)
const {E,R,DES,NOR,INJ,KAR,REB,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const dark=W=>{ for(const u of W.units){u.torch=false;u.torchOff=false;} W.torches=[]; E.computeLight(W); };
const lit=W=>{ W.torches=[{x:8,y:8,r:14}]; E.computeLight(W); };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };

console.log('A. 일어남 · 카리우스');
{ const W=W_([mk(NOR,0,4,8),mk(INJ,0,4,10),mk(KAR,0,6,12)],[mk(DES['창병'],1,27,3)],1,'smart'); dark(W); const n=W.units[0], j=W.units[1], k=W.units[2];
  E.lieSet(W,n,true,'명령'); E.lieSet(W,j,true,'명령'); run(W,0.7); E.lieSet(W,n,false,'명령'); E.lieSet(W,j,false,'명령');
  const un=W.log.filter(x=>x.k==='lieUp'); console.log('    일어남', un.map(x=>W.units[x.a].name+' '+x.sec+'초').join(' · '));
  ok(un.find(x=>x.a===n.i).sec<=0.15&&un.find(x=>x.a===j.i).sec<=0.2,'기동 0.15초 · 그 밖 0.2초'); run(W,0.25); ok(!n.lie&&!j.lie,'0.25초 뒤 다 일어남');
  ok(E.lieSet(W,k,true,'명령')===false&&!k.lie,'카리우스는 못 엎드림'); }

console.log('B. 스스로 엎드림 (고립 · 어디선가 사격 집중)');
{ const W=W_([mk(NOR,0,4,8),mk(INJ,0,4,14)],[mk(DES['궁수'],1,24,3)],1,'smart'); dark(W); const n=W.units[0], a=W.units[2];
  const s={a:a.i,side:1}; E.stepWorld(W,1/30); W.units[0].fireP=[];
  const fake=()=>{ n.fireP=n.fireP||[]; n.fireP.push({t:W.t,seen:false}); };
  fake(); run(W,0.5); fake(); run(W,0.5); const l=W.log.find(x=>x.k==='lieDown'&&x.a===n.i);
  console.log('    ', l?'엎드림 — '+l.why:'안 엎드림'); ok(!!l&&/고립/.test(l.why),'혼자 · 두 발 → 스스로 엎드림'); ok(n.lieAuto!=null,'lieAuto 표시');
  run(W,7); const u2=W.log.find(x=>x.k==='lieUp'&&x.a===n.i); console.log('    ', u2?'일어남 — '+u2.why:'안 일어남'); ok(!!u2&&/멎음/.test(u2.why),'사격이 6초 멎으면 일어남');
  const W2=W_([mk(NOR,0,4,8),mk(INJ,0,5,8.5)],[mk(DES['궁수'],1,24,3)],1,'smart'); dark(W2); const n2=W2.units[0]; E.stepWorld(W2,1/30);
  n2.fireP=[{t:W2.t,seen:false}]; run(W2,0.3); n2.fireP.push({t:W2.t,seen:false}); run(W2,0.5); ok(!W2.log.some(x=>x.k==='lieDown'),'곁에 동료가 있으면 안 엎드림');
  const W3=W_([mk(NOR,0,4,8),mk(KAR,0,4,14)],[mk(DES['궁수'],1,24,3)],1,'smart'); dark(W3); const k3=W3.units[1]; E.stepWorld(W3,1/30);
  k3.fireP=[{t:W3.t,seen:false},{t:W3.t,seen:false}]; run(W3,0.5); ok(!W3.log.some(x=>x.k==='lieDown'&&x.a===k3.i),'카리우스는 스스로도 안 엎드림');
  const W4=W_([mk(NOR,0,4,8),mk(INJ,0,4,14)],[mk(DES['궁수'],1,24,3),mk(DES['창병'],1,26,12)],1,'smart'); dark(W4); const a4=W4.units[2]; E.stepWorld(W4,1/30);
  a4.fireP=[{t:W4.t,seen:false},{t:W4.t,seen:false}]; run(W4,0.5); const l4=W4.log.find(x=>x.k==='lieDown'&&x.a===a4.i); ok(!!l4,'적 궁수도 고립 · 사격 집중이면 엎드림'); }

console.log('C. 곡사 면 제압 (방패 무시)');
{ let hits=0,blk=0,fired=0;
  for(let sd=1;sd<=6;sd++){ const W=W_([mk(REB,0,6,8),mk(INJ,0,3,14)],[mk(DES['궁수'],1,12.6,8),mk(DES['곤봉적'],1,27,2)],sd,'smart'); dark(W); const rb=W.units[0], a=W.units[2]; let endT=null;
    rb.face=0; rb.fg=0; a.face=Math.PI; const P=[rb.x,rb.y]; a.supp={x:rb.x,y:rb.y,n:12,ai:true}; a.ammo=99;
    run(W,14,()=>{ rb.x=P[0]; rb.y=P[1]; rb.face=0; rb.fg=0; rb.vx=0; rb.vy=0; rb.raised=true; rb.guardMode='hold'; });
    const sp=W.log.filter(x=>x.k==='supp'&&x.a===a.i); const e0=W.log.find(x=>x.k==='suppEnd'&&x.a===a.i), tEnd=e0?e0.t+2:99, H=W.log.filter(x=>(x.k==='hit'||x.k==='block')&&x.a===a.i&&x.b===rb.i&&x.t<=tEnd); hits+=H.filter(x=>!x.block).length; blk+=H.filter(x=>x.block).length; const e=W.log.find(x=>x.k==='suppEnd'&&x.a===a.i); fired+=e?e.n:0;
    if(sd===1) console.log('    ', JSON.stringify(sp[0]||null), e?JSON.stringify(e):'(끝 없음)'); }
  console.log(`    쏜 ${fired}발 · 레베카 맞음 ${hits} · 방패에 막힘 ${blk}`); ok(fired>20,'활은 곡사로 면 제압'); ok(hits>0&&blk===0,'든 방패가 머리 위를 못 막음'); }

console.log('D. 숨은 사수의 안 자리 → 적 지휘관이 곡사 면 제압');
{ const W=W_([mk(NOR,0,4,8),mk(INJ,0,3,14)],[mk(DES['궁수'],1,9,8),mk(DES['곤봉적'],1,13,8)],1,'smart'); dark(W); const n=W.units[0], a=W.units[2], c=W.units[3];
  E.stepWorld(W,1/30); n.lie=true; n.lieSw=null; n.lieSeen={}; n.lastFireT=W.t; a.sense[n.i]={x:n.x,y:n.y,t:W.t,exact:true}; a.face=Math.PI; a.act=null; a.supp=null; a.suppPend=null; a.suppCd=0; W.inc=[];
  const see=E.canSee(W,a,n), hs=E.suppHid(W); E.suppAI(W);
  console.log(`    궁수가 봄 ${see} · 안 자리 ${hs?hs.x.toFixed(1)+','+hs.y.toFixed(1):'없음'} · 명령 ${a.suppPend?JSON.stringify({x:+a.suppPend.x.toFixed(1),y:+a.suppPend.y.toFixed(1),hid:a.suppPend.hid}):'없음 (지휘가 닿지 않았을 수 있음)'}`);
  ok(!see&&!!hs,'못 보는데 안 자리가 있음'); ok(!!a.suppPend&&a.suppPend.hid,'궁수에게 곡사 면 제압 명령'); }

console.log('E. 측후방 도약 (청광묵)');
{ let okN=0,N=0;
  for(let sd=1;sd<=20;sd++){ const W=W_([mk(GOB,0,6,8),mk(INJ,0,3,14)],[mk(DES['검기사'],1,7.4,8),mk(DES['곤봉적'],1,27,2)],sd,'smart'); lit(W); const g=W.units[0], e=W.units[2];
    e.face=Math.PI; e.fg=Math.PI; g.face=0; g.leapCd=-9; const r=E.flankLeap(W,g,e); N++; if(!r) continue; run(W,0.35,()=>{ e.face=Math.PI; e.fg=Math.PI; });
    const l=W.log.find(x=>x.k==='leap'&&x.a===g.i); const sd2=(()=>{ const d=Math.abs(((Math.atan2(g.y-e.y,g.x-e.x)-e.face)+Math.PI*3)%(Math.PI*2)-Math.PI)*180/Math.PI; return d; })();
    if(sd===1) console.log('    ', l?l.why:'', '착지 뒤 상대 기준 각도', sd2.toFixed(0)+'°'); if(sd2>60) okN++; }
  ok(okN>=N*0.8,`앞을 보고 선 상대의 옆 · 뒤로 도약 (${okN}/${N})`); }

console.log('F. 청광묵 공격 명령 → 돌격을 아끼지 않음');
{ let ch=0,N=10; for(let sd=1;sd<=N;sd++){ const W=W_([mk(GOB,0,4,8),mk(INJ,0,3,14)],[mk(DES['창병'],1,8.5,8),mk(DES['곤봉적'],1,27,2)],sd,'smart'); lit(W); const g=W.units[0], e=W.units[2];
    g.order={k:'attack',b:e.i}; run(W,2.5); if(W.log.some(x=>x.k==='charge'&&x.a===g.i)) ch++; }
  console.log(`    돌격 쓴 판 ${ch}/${N}`); ok(ch>=N*0.7,'공격 명령이면 거의 늘 돌격'); }

console.log('G. 우회 경유점');
{ const W=W_([mk(INJ,0,3,8),mk(NOR,0,3,9)],[mk(DES['창병'],1,14,5),mk(DES['검기사'],1,15,6),mk(DES['궁수'],1,13,4.5)],1,'smart'); lit(W); E.stepWorld(W,1/30);
  for(const f of W.units.filter(u=>u.side===1)) f.seenBy=f.seenBy||[0];
  const L=W.units.filter(u=>u.side===0), v=E.detourVia(W,L,26,8); console.log('    경유점', JSON.stringify(v));
  ok(!!v&&v.y>8,'적이 북쪽 (y 작음) 에 있으면 남쪽으로 돌아감'); }
{ const W=W_([mk(INJ,0,3,8),mk(NOR,0,3,13)],[mk(DES['창병'],1,27,2)],1,'smart'); lit(W); const j=W.units[0];
  j.order={k:'move',x:20,y:8,via:{x:11.5,y:12.5}}; let md=99; run(W,14,()=>{ md=Math.min(md,Math.hypot(j.x-11.5,j.y-12.5)); });
  const vd=W.log.find(x=>x.k==='viaDone'&&x.a===j.i); console.log(`    경유점에 가장 가까이 ${md.toFixed(2)}칸 · ${vd?vd.why:'-'} · 끝 자리 ${j.x.toFixed(1)},${j.y.toFixed(1)}`);
  ok(md<0.8&&vd&&vd.why==='닿음','경유점을 거침'); ok(Math.hypot(j.x-20,j.y-8)<0.6,'목적지에 닿음'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 712 OK');
