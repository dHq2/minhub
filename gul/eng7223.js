// v7.22.3 시험 — eng7223.js v1.1 (v1.1: 불 붙는 무기는 막지 못하는 상대로 · 히든보스 각혈의 기술 — 양쪽 같은 규칙: 혈영보 (등 뒤로) · 혈염 (둘레 · 동료도 · 화상) · 핏빛 장판 (화상 · 느려짐 · 본 쪽은 피함) · 피의 검기 (둘까지 꿰뚫음 · 화상 · 떨어뜨리는 것 없음) · 불 붙는 무기 · 무기가 주는 열화판 · 전리품 · 실제 싸움)
const {E,DES,INJ,NOR,REB,KAR,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const KH={ref:'C-097',name:'각혈',tier:6,cls:'근접',role:'공격수',weapon:'각혈의 장검',height:2.1,weight:120,sizeCls:'중대형',nv:true,nvG:'S',bold:0.9,ov:{hp:3200,atk:70},traits:['보스','베테랑','속력A','회피A','발화A','근력B','괴력B','망자','은신B'],gear:{몸:{name:'각혈의 갑옷',mat:'각혈갑',tier:3},머리:{name:'각혈의 투구',mat:'투구',tier:3}},active:['혈영보','혈염','핏빛 장판','피의 검기']};
const cast=(W,u,k,t,px,py)=>{ const x=u.spec.find(s=>s.k===k); x.cdT=-9; u.act={ k:'spec', s:k, b:t?t.i:null, phase:'wind', t0:W.t, end:W.t, px, py }; E.stepWorld(W,1/30); };
// 1) 혈영보: 등 뒤로
{ const W=W_([mk(NOR,0,15,8)],[mk(KH,1,4,8)],1,'hold'); W.amb=1; E.computeLight(W); const [n,k]=W.units; n.face=Math.PI; n.fg=Math.PI;   // 노먼은 왼쪽 (각혈 쪽) 을 봄
  cast(W,k,'blink',n); const dx=k.x-n.x; const L=W.log.find(l=>l.k==='blink'); console.log('     ', JSON.stringify(L));
  ok(L&&L.back&&dx>0.3,'혈영보 — 노먼의 등 뒤 (오른쪽) 에 나타남'); }
// 2) 혈염: 둘레 모두 (동료도) · 화상
{ const W=W_([mk(NOR,0,6,8),mk(INJ,0,4,10,{hero:true}),mk(REB,0,2.5,8)],[mk(KH,1,4,8),mk(DES['창병'],1,4,6)],1,'hold'); W.amb=1; E.computeLight(W); const k=W.units[3];
  for (const u of W.units) if (u!==k){ u.hp=u.max=9999; } cast(W,k,'pyre',null); const L=W.log.find(l=>l.k==='pyre'); const burned=W.units.filter(u=>u!==k&&u.burn).map(u=>u.name);
  console.log('      혈염', JSON.stringify(L), burned.join(',')); ok(L&&L.n===4&&burned.includes('창병')&&burned.length===4,'혈염 — 둘레 넷 (동료 창병도) 을 태움 · 화상'); }
// 3) 핏빛 장판: 화상 · 느려짐 · 본 쪽은 피함
{ const W=W_([mk(NOR,0,10,8),mk(REB,0,10.6,8.4)],[mk(KH,1,3,8)],1,'hold'); W.amb=1; E.computeLight(W); const [n,r,k]=W.units; n.hp=n.max=9999; r.hp=r.max=9999;
  cast(W,k,'pool',n,10.2,8.2); const P=(W.pools||[])[0]; const s0=E.spdNow0(W,n), s1=E.spdNow(W,n); run(W,1.2);
  console.log('      장판', JSON.stringify(P&&{x:P.x,y:P.y,r:P.r}), 'slow', (s1/s0).toFixed(2), 'burn', !!n.burn, 'flee', W.log.filter(l=>l.k==='poolFlee').length);
  ok(P&&(n.burn||r.burn)&&W.log.some(l=>l.k==='poolFlee'),'핏빛 장판 — 안에 선 이는 타고 · 장판을 본 쪽은 밖으로 피함');
  const W2=W_([mk(NOR,0,10,8)],[mk(KH,1,3,8)],1,'hold'); const [n2,k2]=W2.units; W2.pools=[{by:k2.i,side:1,x:10,y:8,r:2,until:99,tickT:0,t0:0}]; E.stepPools(W2,1/30); n2.flee=null; ok(Math.abs(E.spdNow(W2,n2)/E.spdNow0(W2,n2)-0.7)<1e-6,'장판 안에서는 걸음 0.7 배'); }
// 4) 피의 검기: 둘까지 꿰뚫음 · 화상 · 떨어뜨리는 것 없음
{ const W=W_([mk(NOR,0,8,8),mk(INJ,0,10,8,{hero:true}),mk(REB,0,12,8)],[mk(KH,1,3,8)],1,'hold'); W.amb=1; E.computeLight(W); const [a,b,c,k]=W.units; for (const u of [a,b,c]){ u.hp=u.max=9999; u.flee=null; }
  cast(W,k,'wave',c); run(W,1,()=>!(W.spins||[]).length); const hit=W.log.filter(l=>(l.k==='hit'||l.k==='dodge'||l.k==='block')&&l.a===k.i&&l.tag!=='혈염').map(l=>W.units[l.b].name), end=W.log.find(l=>l.k==='waveEnd');
  console.log('      검기', JSON.stringify(hit), JSON.stringify(end)); ok(end&&end.n<=2&&!W.items.length&&!k.weaponGone,'피의 검기 — 둘까지 · 무기는 그대로 · 떨어뜨리는 것 없음'); }
// 5) 각혈의 장검: 든 이는 열화판 검기 · 베면 불이 붙음 (발화 특성이 없어도)
{ const W=W_([mk({...REB,weapon:'각혈의 장검',shield:false},0,5,8)],[mk(DES['창병'],1,5.9,8)],1,'free'); const [r,e]=W.units; const sp=r.spec.find(s=>s.k==='wave');
  ok(sp&&sp.weak,'각혈의 장검을 든 이는 피의 검기 (열화) 를 씀'); e.hp=e.max=9999; e.canGuard=false; e.parry=false;   /* 막힌 일격엔 불이 붙지 않음 — 막지 못하는 상대로 */ let burned=false; run(W,8,()=>{ if (e.burn){ burned=true; return true; } }); ok(burned,'각혈의 장검으로 베면 불이 붙음 (발화 특성 없이도)'); }
// 6) 전리품
{ const W=W_([mk(INJ,0,5,5,{hero:true})],[mk(KH,1,8,5)],1,'hold'); W.camp=true; const k=W.units[1]; E.applyDmg(W,W.units[0],k,99999,{}); E.checkEnd(W); const L=E.lootOf(W).map(x=>x.label||x.name);
  console.log('      전리품', JSON.stringify(L)); ok(L.some(x=>/각혈의 장검/.test(x))&&L.includes('각혈의 갑옷')&&L.includes('각혈의 투구'),'쓰러뜨리면 각혈의 장검 · 갑옷 · 투구'); }
// 7) 실제 싸움 (재기만): 각혈 혼자 vs 일행 여섯
{ const N=6, kinds=new Set(); let win=0, lose=0;
  for (let sd=1; sd<=N; sd++){ const W=W_([mk(INJ,0,12,13,{hero:true}),mk(KAR,0,10,13),mk(REB,0,14,13),mk(NOR,0,8,14),mk(GOB,0,16,14),mk({...REB,name:'레베카2'},0,12,14.5)],[mk(KH,1,15,2)],sd,'free'); W.camp=true; E.computeLight(W);
    const k=W.units.find(u=>u.name==='각혈'); const a=W.units[0]; k.state='hunt'; k.target=a; k.last={x:a.x,y:a.y}; k.searchT=30; k.sense[a.i]={x:a.x,y:a.y,t:0,exact:true};
    run(W,150,()=>W.cleared); const cnt=kk=>W.log.filter(l=>l.k===kk&&l.a===k.i).length; for (const kk of ['blink','pyre','pool','wave']) if (cnt(kk)) kinds.add(kk);
    if (!k.alive) win++; if (!W.units.some(u=>u.side===0&&u.alive)) lose++;
    console.log(`      판 ${sd}: ${k.alive?'각혈 살아 있음 (피 '+Math.round(k.hp)+')':'각혈 쓰러짐'} · ${W.t.toFixed(0)}초 · 혈영보 ${cnt('blink')} · 혈염 ${cnt('pyre')} · 장판 ${cnt('pool')} · 검기 ${cnt('wave')} · 쓰러진 아군 ${W.units.filter(u=>u.side===0&&!u.alive).length}`); }
  console.log(`      합계: 각혈 쓰러짐 ${win}/${N} · 전멸 ${lose}/${N} · 쓴 기술 ${[...kinds].join(',')}`); ok(kinds.size>=3,'실제 싸움에서 기술을 셋 넘게 스스로 씀'); }
console.log(fails?`\n${fails} FAIL`:'\nALL 7223 OK');
