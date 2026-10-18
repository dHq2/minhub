// v7.16 시험 — supp716.js v1.2 (v1.2: 총은 기록으로 셈 · v1.1: 적 시험 배치 — 추정 자리가 사거리 안 · 몇 번 굴림 · 견제사격 = 직사 · 지역사격 = 활 곡사 · 총은 같음 · 옛 명령 · 적 궁수의 선택 · 친칠라 관통)
const {E,DES,NOR,INJ,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const CHI={ref:'C-106',name:'친칠라',tier:2,cls:'원거리',role:'사수',weapon:'하얀 나무',ammo:30,sm:1.34,height:1.65,nv:true,nvG:'S',ov:{hp:100,atk:25},traits:['사격A','은신S'],active:['도약']};
const shots=(W,u,arc,sec)=>{ let a=0,d=0; run(W,sec,()=>{ for(const s of W.shots) if(s.a===u.i&&s.supp&&!s.cnt){ s.cnt=1; if(s.arc) a++; else d++; } }); return {a,d}; };
const dark=W=>{ for(const u of W.units){ u.torch=false; } W.torches=[]; E.computeLight(W); };

console.log('A. 아군 명령: 친칠라 견제 (직사) · 지역 (곡사) · 노먼 지역 = 직사 · 옛 명령 (arc 없음) = 활 곡사');
{ const mkW=()=>{ const W=W_([mk(CHI,0,4,8),mk(NOR,0,4,10),mk(INJ,0,2,14,{hero:true})],[mk(DES['창병'],1,28,2)],1,'hold'); dark(W); return W; };
  let W=mkW(), c=W.units[0]; ok(E.suppOK(c),'친칠라 (사격 A) 도 견제 · 지역사격 가능');
  c.order={k:'supp',x:11,y:8,n:3,arc:false}; const r1=shots(W,c,false,4); console.log('    견제', JSON.stringify(r1)); ok(r1.d>=2&&r1.a===0,'친칠라 견제사격 = 직사');
  W=mkW(); c=W.units[0]; c.order={k:'supp',x:11,y:8,n:3,arc:true}; const r2=shots(W,c,true,4); console.log('    지역', JSON.stringify(r2)); ok(r2.a>=2&&r2.d===0,'친칠라 지역사격 = 곡사');
  W=mkW(); c=W.units[0]; c.order={k:'supp',x:11,y:8,n:3}; const r3=shots(W,c,true,4); ok(r3.a>=2,'옛 명령 (arc 없음) 은 활이면 곡사');
  W=mkW(); const n=W.units[1], o4={k:'supp',x:11,y:10,n:3,arc:true}; n.order=o4; const r4=shots(W,n,true,4), lg=W.log.find(l=>l.k==='supp'&&l.a===n.i), le=W.log.find(l=>l.k==='suppEnd'&&l.a===n.i); console.log('    노먼 지역', JSON.stringify(r4), '기록 arc', lg&&lg.arc, '끝', JSON.stringify(le)); ok(r4.a===0&&lg&&lg.arc===false&&le&&le.n===3,'총은 지역사격 = 견제사격 (직사 · 3발로 끝)'); }   /* v1.2 총알은 한 걸음 안에 끝나 기록으로 셈 */

console.log('B. 적 궁수의 선택 (같은 규칙)');
{ const pick=(blk,hid)=>{ const W=W_([mk(NOR,0,12,8),mk(INJ,0,2,14,{hero:true})],[mk(DES['궁수'],1,18,8),mk(DES['곤봉적'],1,19,10),...(blk?[mk(DES['검방패기사'],1,15.5,8)]:[])],1,'hold'); dark(W);
    const a=W.units[2]; a.state='hunt'; for(const u of W.units) if(u.side===1){ u.roam=null; u.woke=true; }
    W.inc=[{side:1,x:18,y:8,dx:-1,dy:0,tr:6,t:W.t,gun:true,by:a.i}]; if(hid){ W.inc=[]; const n=W.units[0]; n.lastFireT=W.t; a.sense[n.i]={x:n.x,y:n.y,t:W.t,exact:true}; }
    let P=null; for(let k=0;k<12&&!P;k++){ a.suppCd=-9; a.suppPend=null; E.suppAI(W); P=a.suppPend; } return P; };
  const p1=pick(false,false), p2=pick(true,false), p3=pick(false,true); console.log('    사선 열림', JSON.stringify(p1), '· 동료가 사선에', JSON.stringify(p2), '· 숨은 사수의 안 자리', JSON.stringify(p3));
  ok(p1&&p1.arc===false,'사선이 열렸으면 견제사격 (직사)'); ok(p2&&p2.arc===true,'사선에 동료가 있으면 지역사격 (곡사)'); ok(!p3||p3.arc===true,'숨은 사수의 안 자리는 지역사격 (곡사)'); }

console.log('C. 친칠라 하얀 나무 관통 (창병 · 2성 판금)');
{ let hits=0,pen=0; for(let sd=1;sd<=12;sd++){ const W=W_([mk(CHI,0,4,8),mk(INJ,0,2,15,{hero:true})],[mk(DES['창병'],1,13,8)],sd,'free'); W.torches=[{x:10,y:8,r:30}]; E.computeLight(W);
    const s=W.units[0], k=W.units[2]; k.order=null; k.state='idle'; k.wander=99; s.order={k:'attack',b:k.i}; run(W,10,()=>{ k.x=13; k.y=8; k.vx=0; k.vy=0; k.act=null; k.target=null; if(!k.alive) W.over=true; });
    for(const l of W.log) if(l.k==='hit'&&l.a===s.i&&l.b===k.i){ hits++; if(l.pen) pen++; } }
  console.log(`    맞음 ${hits} · 뚫음 ${pen} (${(pen/hits*100).toFixed(0)}%)`); ok(pen/hits>=0.28,'2성 판금을 꽤 뚫음 (예전 15%)'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 716 OK');
