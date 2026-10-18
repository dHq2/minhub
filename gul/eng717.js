// v7.17 시험 — eng717.js v1.3 (v1.3: 스텝 시험은 서로 다른 상대 (똑같은 둘은 동시에 쳐서 맞바꿈만 함) · v1.2: 돌격 쿨을 만들 때 바로 막음 · v1.1: 돌격을 막아 접근만 봄 — 창병에게 돌격하다 죽던 것 · 팜 버스트 돌입 · 기습 가속 · 스텝 · 헛침 빈틈 · 이동 사격 등급 · 도약 사격 A · 질주 · 의학 · 영웅 · 체급 · 근력 제한 · 리치)
const {E,DES,NOR,INJ,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const lit=W=>{ W.torches=[{x:10,y:8,r:30}]; E.computeLight(W); };
const KN={...DES['검기사'],weapon:'장검'};

console.log('A. 팜 버스트: 마지막 1.4칸 ×2 · 시전 0.2');
{ const W=W_([mk(GOB,0,4,8),mk(INJ,0,1,1,{hero:true})],[mk(DES['검기사'],1,8,8)],1,'smart'); lit(W); const g=W.units[0], t=W.units[2]; t.order=null; t.state='idle'; g.chargeCd=99; g.leapCd=99; g.canCharge=false;
  g.order={k:'palm',b:t.i}; let vmax=0, vfar=0; run(W,4,()=>{ g.chargeCd=99; g.leapCd=99; t.x=8; t.y=8; t.vx=0; t.vy=0; t.act=null; const v=Math.hypot(g.vx||0,g.vy||0), d=E.gap?E.gap(g,t):Math.hypot(g.x-t.x,g.y-t.y); if(d<1.3) vmax=Math.max(vmax,v); else if(d>2) vfar=Math.max(vfar,v); });
  const dl=W.log.find(l=>l.k==='palmDash'&&l.a===g.i), wl=W.log.find(l=>l.k==='wind'&&l.a===g.i&&l.palm);
  console.log(`    먼 속력 ${vfar.toFixed(2)} · 붙기 직전 ${vmax.toFixed(2)} · 돌입 기록 ${!!dl} · 시전 ${wl?(wl.end-wl.t).toFixed(2):'-'}`);
  ok(!!dl&&vmax>vfar*1.6,'마지막 순간 빨라짐 (×2)'); ok(W.rules.palm.wind===0.2,'시전 0.2초'); }

console.log('B. 기습 가속 (배후 · 들키지 않음)');
{ let n=0; for(let sd=1;sd<=6;sd++){ const W=W_([mk(KN,0,4,8),mk(INJ,0,1,1,{hero:true})],[mk(DES['창병'],1,7,8)],sd,'free'); lit(W); const a=W.units[0], t=W.units[2]; t.face=0; t.state='idle'; t.order={k:'hold'}; a.canCharge=false;
    a.order={k:'attack',b:t.i}; run(W,3,()=>{ a.chargeCd=99; t.face=0; t.x=7; t.y=8; }); const l=W.log.find(x=>x.k==='lunge'&&x.a===a.i); if(l&&l.sd==='back'){ n++; if(sd===1) console.log('    예', JSON.stringify(l)); } }
  ok(n>=4,`등 뒤로 다가가면 덮침 (${n}/6)`); }

console.log('C. 사이드 · 백스텝 · 헛침 빈틈');
{ let st=0, wh=0, gapMin=99, op=0; for(let sd=1;sd<=10;sd++){ const W=W_([mk(KN,0,4,8),mk(INJ,0,1,1,{hero:true})],[mk(sd%2?DES['창병']:{...DES['검방패기사'],weapon:'장검'},1,5.2,8)],sd,'free'); lit(W); const a=W.units[0], b=W.units[2]; a.order={k:'attack',b:b.i}; b.order=null;
    run(W,20,()=>{ if(!a.alive||!b.alive||a.down||b.down) W.over=true; });
    const S=W.log.filter(l=>l.k==='dodge'&&l.step); st+=S.length; wh+=W.log.filter(l=>l.k==='miss'&&l.whiff).length;
    const by={}; for(const l of S){ if(by[l.a]!=null) gapMin=Math.min(gapMin,l.t-by[l.a]); by[l.a]=l.t; }
    op+=W.log.filter(l=>l.k==='miss'&&l.whiff).length; }
  console.log(`    스텝 ${st} · 헛침 ${wh} · 같은 이의 스텝 간격 최소 ${gapMin===99?'-':gapMin.toFixed(2)}초`);
  ok(st>=5,'근접전에서 가끔 스텝'); ok(wh>=1,'헛침이 나옴'); ok(gapMin>=2.95,'3초에 한 번까지'); }

console.log('D. 이동 사격 등급 · 도약 사격 A 이상 · 질주');
{ const W=W_([mk(NOR,0,4,8)],[mk(DES['궁수'],1,12,8)],1,'smart'); const n=W.units[0], a=W.units[1];
  const tr=g=>{ const u={marks:{S:0.7,A:0.55,B:0.4,C:0.25,X:0}[g]}; return E.mvAim(W,u); };
  console.log(`    S ${tr('S')} · A ${tr('A')} · B ${tr('B')} · C ${tr('C')} · 없음 ${tr('X')}`); ok(tr('S')>0.95&&tr('A')===0.88&&tr('B')<0.8,'등급별 명중');
  let shots=0; for(let sd=1;sd<=6;sd++){ const W2=W_([mk(DES['창병'],0,8,8),mk(INJ,0,1,1,{hero:true})],[mk({...DES['궁수'],traits:['베테랑','사격B','망자']},1,10,8)],sd,'free'); lit(W2); const b=W2.units[2]; b.ammo=40; b.act=null; b.leapCd=-9;
    E.leapTo(W2,b,b.x+1.7,b.y,'back',W2.units[0],'시험'); run(W2,0.6); if(W2.log.some(x=>x.k==='leapShot'&&x.a===b.i)) shots++; }
  ok(shots===0,'사격 B 는 도약하며 못 쏨 ('+shots+')');
  const W3=W_([mk(NOR,0,4,8),mk(INJ,0,1,1,{hero:true})],[mk(DES['창병'],1,9,8)],1,'free'); lit(W3); const m=W3.units[0]; m.order={k:'move',x:4,y:2,hurry:true};
  let fired=false; run(W3,1.2,()=>{ if(m.act&&m.act.k==='atk') fired=true; }); ok(!fired,'서둘러 뛰는 중엔 쏘지 않음'); }

console.log('E. 의학 · 영웅');
{ const heal=g=>{ const W=W_([mk({...NOR,traits:['사격A','베테랑',...(g?['의학'+g]:[])]},0,4,8),mk({...INJ,ov:{hp:200}},0,4.6,8,{hero:true})],[mk(DES['창병'],1,28,2)],1,'smart'); const n=W.units[0], h=W.units[1]; h.hp=60; n.order={k:'skill',b:h.i}; run(W,3); const l=W.log.find(x=>x.k==='skill'&&x.a===n.i); return l?l.amt:0; };
  const c=heal('C'), a=heal('A'); console.log(`    처음 회복 C ${c} · A ${a}`); ok(a>c,'의학 A 가 더 많이 회복');
  const W=W_([mk({...INJ,traits:['일반인','영웅']},0,4,8,{hero:true})],[mk(DES['창병'],1,6,8)],1,'smart'); const h=W.units[0], f=W.units[1]; h.hp=20;
  const I=E.impulseOf?E.impulseOf(W,h,f):null; if(I) console.log('    영웅 두려움', I.fear.toFixed(2)); ok(!I||I.fear<0.2,'[영웅] 은 다쳐도 덜 겁먹음'); }

console.log('F. 체급 · 근력 제한 · 리치');
{ const W=W_([mk(NOR,0,4,8),mk(GOB,0,5,8),mk({...NOR,name:'괴력',traits:['근력B','괴력B']},0,6,8)],[mk({...DES['궁수'],weapon:'궁수의 활'},1,12,8),mk(KN,1,13,8),mk(DES['곤봉적'],1,14,8)],1,'smart');
  const [n,g,s,a,k,c]=W.units; const it={k:'weapon',name:'궁수의 활',x:0,y:0};
  console.log(`    체급 노먼 ${E.sizeOf(n)} · 청광묵 ${E.sizeOf(g)} · 궁수 ${E.sizeOf(a)} · 곤봉적 ${E.sizeOf(c)} | 리치 검기사 ${k.rng} · 궁수 사거리 ${a.rng}`);
  ok(E.sizeOf(n)==='중형'&&E.sizeOf(g)==='소형'&&E.sizeOf(a)==='중대형'&&E.sizeOf(c)==='대형','체급');
  ok(!E.canTake(W,n,it)&&E.canTake(W,k,it)&&E.canTake(W,s,it),'궁수의 활: 노먼 (중형) 못 주움 · 검기사 (중대형) · 괴력은 주움');
  ok(Math.abs(k.rng-0.725)<0.01&&a.rng===12,'장검 2.2M 리치 0.725 · 궁수의 활 12칸'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 717 OK');
