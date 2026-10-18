// v7.22.2 시험 — eng7222.js v1.4 (v1.4: 실제 싸움 시험은 대장군 체력 6000 (쓰는지만 봄) · 회전 투척은 기록만 · v1.3: [가호:바다] 물속 × 1.15 · v1.2: 회전 투척은 비켜선 이는 피함 · 무기를 주우러 뛰면 내려앉으며 집어 듦 · v1.1: 몸 크기 × 1.8 · 체력 2400 · 회전 투척은 피함 · 막음도 닿은 것으로 · 대장군 호레이쇼의 기술 — 양쪽 같은 규칙: 도약 강타 (깔림 즉사는 중형까지 · 대형은 버팀 · 그림자를 본 쪽은 피함 · 아군도 같은 기술을 쓸 수 있음) · 회전 투척 (줄의 모두 · 동료도 · 끝에 떨어짐 · 맨손 → 주우러 도약 · 다시 듦) · 주변광 · 실제 싸움에서 스스로 씀)
const {E,DES,INJ,NOR,REB,KAR,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const HORA={ref:'C-158',name:'호레이쇼',tier:4,cls:'근접',role:'공격수',weapon:'대장군의 도끼',height:5,weight:1100,sizeCls:'중대형',rMul:1.8,nv:true,nvG:'A',bold:0.8,ov:{hp:2400,atk:75},traits:['거구','근력S','괴력S','베테랑','망자','보스'],gear:{몸:{name:'대장군의 갑옷',mat:'판금',tier:3},머리:{name:'대장군의 투구',mat:'투구',tier:3}},active:['도약 강타','회전 투척']};
// 1) 깔림: 중형은 즉사 · 대형은 버팀
{ const W=W_([mk(INJ,0,10,8,{hero:true}),mk(KAR,0,20,8)],[mk(HORA,1,4,8)],1,'hold'); const [h,k,b]=W.units; W.amb=1; E.computeLight(W);
  ok(E.startQuake(W,b,h.x,h.y,'시험'),'도약 강타 시작'); h.flee=null; h.order=null; const hx=h.x, hy=h.y; let warned=false; run(W,1.3,()=>{ if (h.flee){ h.flee=null; h.x=hx; h.y=hy; warned=true; } return !b.act; });
  const d=W.log.find(l=>l.k==='die'&&l.b===h.i); console.log('     ', JSON.stringify({ alive: h.alive, how: d&&d.how, warned, hit: W.log.find(l=>l.k==='quakeHit') }));
  ok(!h.alive&&d&&d.how==='crush'&&warned,'바로 밑에 깔린 중형 (인주) 은 즉사 · 그 전에 그림자를 보고 피하려 함');
  b.act=null; const sq=b.spec.find(x=>x.k==='quake'); sq.cdT=-9; const k0=k.hp; ok(E.startQuake(W,b,k.x,k.y,'시험'),'카리우스에게 도약 강타'); k.flee=null; run(W,1.3,()=>{ k.flee=null; return !b.act; });
  ok(k.alive&&k.hp<k0,'대형 (카리우스) 은 깔려도 즉사하지 않음 (피 '+Math.round(k0)+' → '+Math.round(k.hp)+')'); }
// 2) 아군도 같은 기술 (규칙은 양쪽이 같음)
{ const W=W_([mk({...REB,active:['도약 강타']},0,5,8)],[mk(DES['창병'],1,12,8)],1,'hold'); const [r,e]=W.units; ok(E.startQuake(W,r,e.x,e.y,'아군 시험'),'아군도 도약 강타를 쓸 수 있음'); run(W,1.3,()=>!r.act); ok(W.log.some(l=>l.k==='quakeHit'&&l.a===r.i),'아군의 도약 강타도 내려앉으며 충격'); }
// 3) 회전 투척: 줄의 모두 (동료도) · 끝에 떨어짐 · 맨손 → 주우러 도약 → 다시 듦
{ const W=W_([mk(NOR,0,12,8),mk(INJ,0,15,8,{hero:true})],[mk(HORA,1,4,8),mk(DES['창병'],1,9,8.2)],1,'free'); W.amb=1; E.computeLight(W); const [n,h,b,ally]=W.units; n.hp=n.max=9999; h.hp=h.max=9999;
  E.startSpec ? 0 : 0; const sp=b.spec.find(x=>x.k==='spin'); b.act={ k:'spec', s:'spin', b:h.i, phase:'wind', t0:W.t, end:W.t }; sp.cdT=W.t+11; run(W,0.05);
  ok(b.weaponGone&&(W.spins||[]).length===1,'회전 투척 — 도끼를 던지고 맨손'); run(W,1.2,()=>!(W.spins||[]).length);
  const hits=W.log.filter(l=>(l.k==='hit'||l.k==='dodge'||l.k==='block')&&l.a===b.i).map(l=>W.units[l.b].name), drop=W.log.find(l=>l.k==='spinDrop'), it=W.items.find(i=>i.how==='spin');
  console.log('      맞은', JSON.stringify(hits), JSON.stringify(drop&&{n:drop.n,x:drop.x,y:drop.y}));
  ok(hits.includes('창병')&&hits.length>=2&&drop&&it,'줄에 선 이들을 벰 (동료 창병도 · 비켜선 이는 피함) · 끝에 떨어짐');
  const qk=b.spec.find(x=>x.k==='quake'); qk.cdT=-9; let pick=false, leapWeapon=false; run(W,20,()=>{ if (W.log.some(l=>l.k==='quake'&&l.a===b.i&&/주우러/.test(l.why))) leapWeapon=true; if (!b.weaponGone){ pick=true; return true; } });
  ok(leapWeapon,'무기를 주우러 도약'); ok(pick&&b.weapon==='대장군의 도끼','다시 도끼를 듦'); }
// 4) 주변광: 밝은 맵이면 모든 칸이 밝음
{ const R=require('./t4.js').R; const W=E.createWorld({type:'grid',W:20,H:12,seed:7,units:[mk(INJ,0,3,3,{hero:true}),mk(DES['창병'],1,15,8)],torches:[],flips:[],amb:0.55},R,1,{headless:true}); let lit=0; for (let i=0;i<W.light.length;i++) if (W.light[i]>0.12) lit++;
  ok(lit===W.light.length,'주변광 0.55 — 모든 칸이 밝음'); const W2=E.createWorld({type:'grid',W:20,H:12,seed:7,units:[mk(INJ,0,3,3,{hero:true}),mk(DES['창병'],1,15,8)],torches:[],flips:[]},R,1,{headless:true}); let l2=0; for (let i=0;i<W2.light.length;i++) if (W2.light[i]>0.12) l2++; ok(l2<W2.light.length*0.3,'주변광이 없으면 그대로 어두움'); }
// 4b) [가호:바다] 는 얕은 물에서 빨라짐 (다른 이는 0.7 배)
{ const R=require('./t4.js').R; const W=E.createWorld({type:'grid',W:20,H:12,seed:7,units:[mk({...NOR,traits:[...NOR.traits,'가호:바다']},0,5,5),mk(NOR,0,5,6)],torches:[],flips:[],water:[{x:5,y:5.5,rx:3,ry:2}]},R,1,{headless:true}); const [a,b]=W.units;
  const ra=E.spdNow(W,a)/E.spdNow0(W,a), rb=E.spdNow(W,b)/E.spdNow0(W,b); ok(Math.abs(ra-1.15)<1e-6&&Math.abs(rb-0.7)<1e-6,'[가호:바다] 는 물속에서 × 1.15 · 다른 이는 0.7 ('+ra.toFixed(2)+' / '+rb.toFixed(2)+')'); }
// 5) 실제 싸움: 대장군 혼자 vs 일행 여섯 — 스스로 도약 강타 · 회전 투척을 씀 (재기만 · 균형은 건드리지 않음)
{ let q=0, s=0, crush=0, win=0, lose=0, both=0; const N=6;
  for (let sd=1; sd<=N; sd++){ const W=W_([mk(INJ,0,12,13,{hero:true}),mk(KAR,0,10,13),mk(REB,0,14,13),mk(NOR,0,8,14),mk(GOB,0,16,14),mk({...REB,name:'레베카2'},0,12,14.5)],[mk({...HORA,ov:{...HORA.ov,hp:6000}},1,13,4)],sd,'free'); W.amb=0.55; W.camp=true; E.computeLight(W);   /* v1.4: 싸움을 길게 (v7.24.0 도약 강타가 약해져 일찍 쓰러짐 — 쓰는지만 봄) */
    run(W,120,()=>W.cleared); const b=W.units.find(u=>u.name==='호레이쇼'), nq=W.log.filter(l=>l.k==='quake'&&l.a===b.i).length, ns=W.log.filter(l=>l.k==='spin'&&l.a===b.i).length;
    q+=nq; s+=ns; crush+=W.log.filter(l=>l.k==='die'&&l.how==='crush').length; if (!b.alive) win++; if (!W.units.some(u=>u.side===0&&u.alive)) lose++; if (nq&&ns) both++;
    console.log(`      판 ${sd}: ${b.alive?'대장군 살아 있음 (피 '+Math.round(b.hp)+')':'대장군 쓰러짐'} · ${W.t.toFixed(0)}초 · 도약 강타 ${nq} · 회전 투척 ${ns} · 쓰러진 아군 ${W.units.filter(u=>u.side===0&&!u.alive).length}`); }
  console.log(`      합계: 도약 강타 ${q} · 회전 투척 ${s} · 깔림 ${crush} · 대장군 쓰러짐 ${win}/${N} · 전멸 ${lose}/${N}`);
  ok(q>=N,'실제 싸움에서 도약 강타를 스스로 씀 (회전 투척은 줄지은 상대 · 도약 강타를 못 쓸 때만이라 기록만 — '+s+'번)'); }
console.log(fails?`\n${fails} FAIL`:'\nALL 7222 OK');
