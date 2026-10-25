// v7.13 시험 — net713.js v1.2 (v1.2: v9.9.1 — 발 빠른 근접 부하는 지시 대신 추종 규칙으로 대장의 적에게 (그것도 받음으로 셈) · v1.1: v9.1.0 — 부하를 둔 대장은 지휘 스킬이 없어도 기본 지시 (옛: D 는 못 함) · 지휘망 그물 · 편대 · 편대장 자율 지시 · 피한 일격 · 서둘러 일어남 · 약속 교전 규칙)
const {E,R,DES,NOR,INJ,KAR,REB,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const lit=W=>{ W.torches=[{x:8,y:8,r:30}]; E.computeLight(W); };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };

console.log('A. 그물: 동료가 많을수록 · 이중 전달 (어둠 · 14칸 떨어진 청광묵)');
{ const dk=W=>{ for(const u of W.units){u.torch=false;u.torchOff=false; if(u.blindL){ u.face=Math.PI; u.fg=Math.PI; } } W.torches=[]; E.computeLight(W); };   /* 청광묵은 왼눈이 멀어 지휘관 쪽을 보게 */
  const cfg={0:[],1:[[9,8]],2:[[7.5,8],[11.5,8]],3:[[6,8],[9.5,8],[13,8]]}, res=[];
  for(const n of [0,1,2,3]){ const al=[mk(INJ,0,2,8,{hero:true})]; for(const [x,y] of cfg[n]) al.push(mk(REB,0,x,y)); al.push(mk(GOB,0,16,8)); const W=W_(al,[mk(DES['창병'],1,28,2)],1,'smart'); dk(W);
    const C=W.units[0], tg=W.units[n+1], lk=E.cmdLinkM(W,C,tg); res.push([n,+lk.p.toFixed(2),lk.via,+(lk.t||0).toFixed(2)]); }
  console.log('    [사이 동료 수, 확률, 길, 초]', JSON.stringify(res));
  ok(res[0][1]<0.2,'사이에 동료가 없으면 14칸 밖 청광묵에게 거의 안 닿음'); ok(res[3][1]>res[2][1]&&res[2][1]>res[1][1],'사이 동료가 많을수록 잘 닿음');
  const one=[mk(INJ,0,2,8,{hero:true}),mk(REB,0,8,8),mk(GOB,0,12,8)], two=[mk(INJ,0,2,8,{hero:true}),mk(REB,0,8,8),mk(REB,0,8,8.9),mk(GOB,0,12,8)];
  const W1=W_(one,[mk(DES['창병'],1,28,2)],1,'smart'); dk(W1); const W2=W_(two,[mk(DES['창병'],1,28,2)],1,'smart'); dk(W2);
  const p1=E.meshNet(W1,0,W1.units[0]).P[2], p2=E.meshNet(W2,0,W2.units[0]).P[3]; console.log(`    전해 줄 동료 하나 ${p1.toFixed(2)} · 둘 ${p2.toFixed(2)}`); ok(p2>p1,'곁에 전해 줄 동료가 둘이면 더 잘 닿음 (이중 전달)'); }

console.log('B. 시작 배치 편대 · 무스킬 편대장 D');
{ const al=[mk(INJ,0,4,8,{hero:true,sq:'A'}),mk(NOR,0,5,9,{sq:'B',rank:'부대장'}),mk(GOB,0,6,9,{sq:'B'}),mk(REB,0,4,9.5,{sq:'A'})]; const W=W_(al,[mk(DES['창병'],1,27,3)],1,'smart');
  const n=W.units[1], g=W.units[2], rb=W.units[3]; console.log(`    노먼 직책 ${n.rank} · 지휘 ${n.cmd} · 청광묵 편대장 ${g.sqLead} · 레베카 ${rb.sqLead}`);
  ok(n.rank==='부대장'&&g.sqLead===n.i&&rb.sqLead==null,'2편대 = 노먼 · 청광묵'); ok(n.cmd===1,'노먼 지휘 C (1)');
  const al2=[mk(INJ,0,4,8,{hero:true}),mk(REB,0,5,9,{sq:'B',rank:'부대장'}),mk(GOB,0,6,9,{sq:'B'}),mk(NOR,0,4,10,{sq:'A',rank:''})]; const W2=W_(al2,[mk(DES['창병'],1,10,9)],1,'smart'); lit(W2);
  const r2=W2.units[1], n2=W2.units[3]; console.log(`    레베카 편대장: 지휘 ${r2.cmd} · 노먼 직책 '${n2.rank}'`); ok(r2.cmd===0&&n2.rank==='','지휘 스킬 없는 편대장 = D · 노먼은 직책 없음');
  run(W2,3); ok(!W2.log.some(x=>x.k==='sqWeak'&&x.a===r2.i),'v9.1 부하를 둔 대장은 지휘 스킬이 없어도 기본 지시는 함 (지휘 D 여도 sqWeak 없음)'); }

console.log('C. 노먼 (C) 편대장 자율 지시');
{ let dec=0,recv=0,N=8,ex=null; for(let sd=1;sd<=N;sd++){ const al=[mk(INJ,0,3,8,{hero:true}),mk(NOR,0,8,9,{sq:'B',rank:'부대장'}),mk(GOB,0,9,9.5,{sq:'B'})]; const W=W_(al,[mk(DES['궁수'],1,15,9)],sd,'free'); lit(W);
    const g=W.units[2]; run(W,6); const d=W.log.filter(x=>x.k==='sqDec'); if(d.length){ dec++; if(!ex) ex=d[0]; } if(W.log.some(x=>x.k==='cmdRecv'&&x.a===g.i&&x.c===W.units[1].i)||(g.chiefLk&&g.target===W.units[3])) recv++; }   /* v9.9.1 발 빠른 근접 부하 (청광묵) 는 지시 대신 추종 규칙으로 대장의 적에게 */
  console.log('    예', JSON.stringify(ex)); console.log(`    지시한 판 ${dec}/${N} · 청광묵이 노먼의 지시를 받은 판 ${recv}/${N}`); ok(dec>=N*0.6,'노먼이 스스로 지시'); ok(recv>=1,'청광묵이 지휘망으로 받거나 (발 빠른 부하는) 추종 규칙으로 같은 적에게');
  const al=[mk(INJ,0,3,8,{hero:true}),mk(NOR,0,8,9,{sq:'B',rank:'부대장'}),mk(GOB,0,9,9.5,{sq:'B'})]; const W=W_(al,[mk(DES['궁수'],1,15,9)],1,'free'); lit(W); const g=W.units[2]; g.order={k:'hold'}; run(W,5);
  ok(!W.log.some(x=>x.k==='cmdRecv'&&x.a===g.i&&x.c===W.units[1].i),'대장의 명령 (제자리) 을 받은 편대원은 건드리지 않음'); }

console.log('D. 피한 밀치기의 손 안으로 다시 안 들어감');
{ let back=0,hit=0,N=0; for(let sd=1;sd<=30;sd++){ const al=[mk(GOB,0,8,8),mk(INJ,0,3,14,{hero:true})]; const W=W_(al,[mk(DES['검방패기사'],1,8.6,8),mk(DES['창병'],1,9.6,8.4)],sd,'free'); lit(W);
    const g=W.units[0], k=W.units[2], sp=W.units[3]; g.order={k:'palm',b:sp.i}; g.dodgeCd=-9; k.face=Math.PI; k.bashCd=-9;
    let dodged=null; run(W,2.5,()=>{ if(!dodged){ const l=W.log.find(x=>x.k==='dodge'&&x.a===g.i&&x.b===k.i); if(l) dodged=l.t; } });
    if(!dodged) continue; N++; const hb=W.log.find(x=>x.k==='hit'&&x.a===k.i&&x.b===g.i&&x.t>dodged&&x.t<dodged+0.6); if(hb) hit++; }
  console.log(`    밀치기를 피한 판 ${N} · 그 뒤 같은 밀치기에 맞은 판 ${hit}`); ok(N===0||hit<=N*0.2,'피한 뒤 다시 걸어 들어가 맞는 일이 드묾'); }

console.log('E. 서둘러 이동 = 엎드렸다면 일어나 뜀 · 빠르게 공격 (총) = 엎드린 채');
{ const W=W_([mk(NOR,0,4,8),mk(INJ,0,3,14,{hero:true})],[mk(DES['궁수'],1,11,8)],1,'smart'); lit(W); const n=W.units[0];
  E.lieSet(W,n,true,'명령'); run(W,0.7); n.order={k:'move',x:4,y:13,hurry:true}; run(W,1.5); const u1=W.log.find(x=>x.k==='lieUp'&&x.a===n.i); ok(!!u1&&/서둘러/.test(u1.why),'서둘러 이동 → 일어남');
  const W2=W_([mk(NOR,0,4,8),mk(INJ,0,3,14,{hero:true})],[mk(DES['궁수'],1,11,8)],1,'smart'); lit(W2); const n2=W2.units[0];
  E.lieSet(W2,n2,true,'명령'); run(W2,0.7); n2.order={k:'attack',b:W2.units[2].i,now:true}; run(W2,1.5); ok(n2.lie&&W2.log.some(x=>x.k==='wind'&&x.a===n2.i),'빠르게 공격 (총) → 엎드린 채 쏨'); }

console.log('F. 교전 금지 몸은 약속에 안 듦');
{ let inP=0,N=10; for(let sd=1;sd<=N;sd++){ const al=[mk(REB,0,8,8),mk(GOB,0,9,10),mk(INJ,0,3,14,{hero:true})]; const W=W_(al,[mk(DES['검기사'],1,9,8)],sd,'hold'); lit(W); const g=W.units[1]; g.roe='hold';
    run(W,4,()=>{ if((W.pacts||[]).some(P=>P.b===g.i)) inP++; }); }
  ok(inP===0,'교전 금지 청광묵은 약속 (막아 주기 · 붙들기) 에 끌려가지 않음'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 713 OK');
