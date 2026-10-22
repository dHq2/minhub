// v7.23.2 시험 — eng7232.js v1.6 (v1.6: '끝나면 다시 움직임' 은 하늘 가르기가 끝났는가 — v8.7.3 세자르 버팀 (×6) 이 돌격 셈에 들어가 인주가 돌진하지 않으니 판이 달라져 세자르가 새 걸음을 밟는 중일 수 있음 · v1.5: 마구 베기는 '마구 베기' 표시의 타격만 셈 (끝난 뒤 보통 공격 한 번이 더 들어오면 '모두 치명' 이 깨지던 것) · v1.4: 권위 시험의 카리우스는 오래 버팀 · v1.3: 줄 중간 // 주석 고침 · v1.2: 관통 찌르기 시험은 자리만 고정 · v1.1: 시험 대상을 묶어 둠 · 여덟 판 · 세자르 2 — 필살 · 권위: 하늘 가르기 (직선 위 모두 · 못 막음 · 쓰러짐 · 이동 제약 · 모으는 동안 슈퍼아머 · 폭풍) · 이동 제약 (걸음 × 0.4 · 스텝 못 함) · 관통 찌르기 (가벼운 맨 앞은 내던짐 · 무거우면 관통) · 냉기 참격 (부채꼴 · 동상 · 끊김) · 마구 베기 (최전방 · 확정 치명 12번 · 끊김) · 권위 (눈 · 신성 봉인 · 끊김 · 흔들림) · 한 판)
const {E,R,DES,INJ,NOR,REB,KAR,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const CZ={ref:'C-045',name:'세자르',tier:6,cls:'근접',role:'공격수',weapon:'노인의 검',height:2.1,weight:70,poise:6,sizeCls:'중대형',nv:true,nvG:'S',bold:1,ov:{hp:2000,atk:62},traits:['보스','베테랑','회피S','속력S','갑피','망자'],gear:{머리:{name:'노인의 왕관',mat:'투구',tier:1}},brain:'cesar',dcounter:0.5,frostP:0.25,severP:0.35};
const CZA={...CZ,unique:['권위']};
const KN=()=>JSON.parse(JSON.stringify(DES['검기사']));
const lit=W=>{ W.amb=1; E.computeLight(W); };
const frz=(...L)=>{ for(const u of L) u.stunT=1e9; };   // 시험 대상을 묶어 둠 (다가오거나 돌진해서 끊는 걸 따로 봄)
const prep=k=>{ k.cz.on=true; k.cz.phaseT=99; k.cz.fury=true; for(const s of ['spin','shoulder','back','punish','flank','rush','upcut','thrust','wave','ult']) k.cz[s]=99; };
// 1) 하늘 가르기
{ const W=W_([mk(INJ,0,11,8,{hero:true,ov:{hp:600}}),mk(KAR,0,15,8.3),mk(REB,0,11,12,{ov:{hp:600}})],[mk(CZ,1,5,8)],1,'hold'); lit(W); const [a,c,r,k]=W.units; prep(k);
  E.czStart(W,k,'upcut',a,{ang:0}); run(W,0.4); const sa=E.stun(W,k,0.6,a.i); ok(sa===0&&k.act&&k.act.s==='upcut','모으는 동안 슈퍼아머 — 휘청이지 않음');
  run(W,0.8); const L=W.log.find(l=>l.k==='czUpcut'); console.log('      ',JSON.stringify(L),'피',[a,c,r].map(u=>u.taken));
  ok(L&&L.n===2&&a.taken>0&&c.taken>0&&r.taken===0,'직선 위 둘 (인주 · 카리우스) 만 — 옆의 레베카는 아님');
  ok(W.t<a.proneT&&a.hobbleT>W.t+10,'쓰러짐 → 이동 제약 (10초 넘게)'); const ax=a.x; run(W,2.6); console.log('      폭풍에 밀림',(a.x-ax).toFixed(2),'카리우스',c.x.toFixed(2));
  ok(W.log.some(l=>l.k==='czGale')&&a.x-ax>0.5,'갈라진 자리의 폭풍 — 가벼운 몸은 밀려남 ('+(a.x-ax).toFixed(1)+'M)');
  const s0=E.spdNow0(W,r), s1=(r.hobbleT=W.t+5, E.spdNow0(W,r)); ok(Math.abs(s1/s0-0.4)<0.01,'이동 제약 — 걸음 × 0.4'); ok(!(k.act&&k.act.s==='upcut'),'끝나면 다시 움직임 (하늘 가르기가 끝남'+(k.act?' — 지금 '+(k.act.s||k.act.k):'')+')'); }
// 2) 관통 찌르기: 가벼운 맨 앞은 꿰어 내던짐
{ const W=W_([mk(GOB,0,8,8,{ov:{hp:600}}),mk(REB,0,9.6,8,{ov:{hp:600}})],[mk(CZ,1,5,8)],1,'hold'); lit(W); const [g,r,k]=W.units; prep(k); const kx=k.x;
  E.czStart(W,k,'thrust',g,{ang:0}); run(W,0.9,()=>{ if(!k.act||!k.act.hit){ g.x=8; g.y=8; r.x=9.6; r.y=8; } });   /* 모으는 동안 자리 고정 (묶어 두면 휘청 → 심장 관통으로 쓰러짐) */ const L=W.log.find(l=>l.k==='czThrust'), T=W.log.find(l=>l.k==='czToss'); console.log('      ',JSON.stringify(L),JSON.stringify(T),'세자르',(k.x-kx).toFixed(2));
  ok(L&&L.n===2&&g.taken>0&&r.taken>0,'관통 찌르기 — 줄 위 둘'); ok(T&&T.b===g.i,'가벼운 맨 앞 (청광묵) — 꿰어 내던짐'); ok(k.x-kx>1,'세자르가 앞으로 튀어나감'); }
{ const W=W_([mk(KAR,0,8.2,8)],[mk(CZ,1,5,8)],1,'hold'); lit(W); const [c,k]=W.units; prep(k);
  E.czStart(W,k,'thrust',c,{ang:0}); run(W,0.9); ok(!W.log.some(l=>l.k==='czToss')&&W.log.some(l=>l.k==='stun'&&l.b===c.i),'무거운 맨 앞 (카리우스) — 내던지지 못하고 관통 (휘청)'); }
// 3) 냉기 참격: 부채꼴 · 동상 · 끊김
{ const W=W_([mk(KAR,0,10,8),mk(REB,0,9,11,{ov:{hp:600}}),mk(INJ,0,1.5,8,{hero:true,ov:{hp:600}})],[mk(CZ,1,5,8)],1,'hold'); lit(W); const [c,r,a,k]=W.units; prep(k);
  E.czStart(W,k,'wave',c,{ang:0}); run(W,1.0); const L=W.log.find(l=>l.k==='czWave'); console.log('      ',JSON.stringify(L),'동상',[c,r,a].map(u=>((u.frostT||-9)>W.t)));
  ok(L&&L.n===2&&a.taken===0,'냉기 참격 — 앞 부채꼴 둘 · 뒤의 인주는 아님'); ok([c,r].some(u=>(u.frostT||-9)>W.t),'맞으면 동상'); }
{ const W=W_([mk(KAR,0,10,8)],[mk(CZ,1,5,8)],1,'hold'); lit(W); const [c,k]=W.units; prep(k);
  E.czStart(W,k,'wave',c,{ang:0}); run(W,0.3); E.stun(W,k,0.5,c.i); run(W,0.2); ok(W.log.some(l=>l.k==='czBreak'&&l.s==='wave')&&!W.log.some(l=>l.k==='czWave')&&k.cz.wave>3,'모으는 동안 휘청 → 냉기 참격 끊김 (4초 뒤 다시)'); }
// 4) 마구 베기: 최전방 · 확정 치명 12번
{ const W=W_([mk(KAR,0,12,8,{ov:{hp:9000}}),mk(INJ,0,16,8,{hero:true}),mk(REB,0,16,10)],[mk(CZ,1,5,8)],1,'hold'); lit(W); const [c,a,r,k]=W.units; prep(k); frz(c,a,r);
  const fr=E.czFront(W,k); ok(fr===c,'최전방 = 무리에서 세자르 쪽으로 가장 튀어나온 이 (카리우스)');
  E.czStart(W,k,'ult',c,{tb:c.i}); run(W,3.2); const L=W.log.find(l=>l.k==='czUlt'), H=W.log.filter(l=>l.k==='hit'&&l.a===k.i&&l.b===c.i); console.log('      ',JSON.stringify(L),'맞음',H.length,'치명',H.filter(h=>h.crit).length);
  const UH=H.filter(h=>h.tag==='마구 베기'); ok(L&&L.n===12&&UH.length===12&&UH.every(h=>h.crit),'마구 베기 — 돌진 뒤 확정 치명 12번 ('+UH.length+')'); }
{ const W=W_([mk(KAR,0,8,8,{ov:{hp:9000}})],[mk(CZ,1,5,8)],1,'hold'); lit(W); const [c,k]=W.units; prep(k); frz(c);
  E.czStart(W,k,'ult',c,{tb:c.i}); run(W,1.25,()=>k.act&&k.act.arr&&k.act.hits>=3); E.stun(W,k,0.5,c.i); run(W,0.3); const B=W.log.find(l=>l.k==='czBreak'&&l.s==='ult'); console.log('      ',JSON.stringify(B));
  ok(B&&B.n<12,'베는 도중 휘청 → 마구 베기 끊김 ('+(B&&B.n)+'번에서)'); }
// 5) 권위: 눈 · 신성 봉인 · 끊김 · 흔들림
{ const W=W_([mk(KAR,0,10,8,{ov:{hp:30000}})],[mk(CZA,1,16,8)],1,'hold'); lit(W); const [c,k]=W.units; frz(c);   /* 오래 버티게 (판이 먼저 끝나지 않게) */
  ok(E.mbOn(W,c),'처음엔 [개조된 신체] 켜짐'); run(W,2.4,()=>W.snow); const L=W.log.find(l=>l.k==='czAuth'); console.log('      권위',L&&L.t);
  ok(L&&W.snow&&W.seal&&!E.mbOn(W,c),'권위 — 손을 들고 1.1초 → 눈 · 신성 봉인 ([개조된 신체] 꺼짐)');
  const sh=E.stun(W,k,0.5,c.i); run(W,0.1); ok(W.log.some(l=>l.k==='czShaken')&&!W.snow&&E.mbOn(W,c),'세자르가 휘청 → 권위가 흔들림 (눈이 멎고 신성이 돌아옴)');
  run(W,6.2); ok(W.log.some(l=>l.k==='czAuthBack')&&W.snow&&W.seal,'6초 뒤 다시 눈'); }
{ const W=W_([mk(KAR,0,10,8)],[mk(CZA,1,16,8)],1,'hold'); lit(W); const [c,k]=W.units; frz(c);
  run(W,2,()=>k.act&&k.act.s==='auth'); run(W,0.3); E.stun(W,k,0.3,c.i); run(W,0.3); ok(W.log.some(l=>l.k==='czBreak'&&l.s==='auth')&&!W.snow&&k.cz.auth>4,'손을 드는 동안 휘청 → 권위 끊김 (6초 뒤 다시)'); }
// 6) 한 판 (자동 · 권위 있는 세자르)
{ let res=[], use={}; for(let s=1;s<=8;s++){ const W=W_([mk(INJ,0,4,6,{hero:true}),mk(REB,0,5,8),mk(KAR,0,4,10),mk(NOR,0,3,7),mk(GOB,0,5,11),mk(KN(),0,6,9)],[mk(CZA,1,20,8)],s); lit(W); const k=W.units[6];
    run(W,90); for(const l of W.log.filter(l=>l.a===k.i&&['czStart','czUlt','czUpcut','czThrust','czWave','czAuth','czShaken'].includes(l.k))){ const x=l.k==='czStart'?l.s:l.k; use[x]=(use[x]||0)+1; }
    res.push({ t: W.t.toFixed(0), cz: k.alive?Math.round(k.hp):0, down: W.units.filter(u=>u.side===0&&!u.alive).length }); }
  for(const r of res) console.log('      ',JSON.stringify(r)); console.log('      쓴 것',JSON.stringify(use));
  ok(['upcut','thrust','wave','ult','auth'].filter(s=>use[s]).length>=5,'여덟 판 — 필살 넷 · 권위를 모두 씀'); const win=res.filter(r=>r.cz===0).length; console.log('      일행이 이긴 판',win,'/ 8'); }
console.log(fails?`${fails} FAIL`:'ALL 7232 OK');
