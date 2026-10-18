// v7.11 포복 v1 시험 — lie711.js v1
const {E,R,DES,NOR,INJ,KAR,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const dark=W=>{ for(const u of W.units){u.torch=false;u.torchOff=false;} W.torches=[]; E.computeLight(W); };
const lit=W=>{ W.torches=[{x:8,y:8,r:12}]; E.computeLight(W); };
const still=(W,us)=>{ for(const u of us){ u.state='idle'; u.target=null; u.wander=99; u.goal=null; u.path=null; u.last=null; } };
const freeze=(W,list,f)=>{ const P=list.map(u=>[u,u.x,u.y,u.face]); return ()=>{ for(const [u,x,y,fa] of P){ u.x=x;u.y=y;u.face=fa;u.fg=fa;u.vx=0;u.vy=0;u.goal=null;u.path=null; } }; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const layFull=(W,u)=>{ E.lieSet(W,u,true,'시험'); run(W,0.7); };

console.log('A. 보이는 거리 (어둠 · 빛) — 모르는 눈');
{ const W=W_([mk(NOR,0,4,8),mk(INJ,0,3,13)],[mk(DES['창병'],1,9,8)],1,'smart'); dark(W); const n=W.units[0], e=W.units[2];
  e.face=Math.PI; const rs=[]; for(const d of [1.5,1.9,3,4.5]){ e.x=n.x+d; e.y=n.y; n.lie=true; n.lieSw=null; n.lieSeen={}; rs.push([d,E.canSee(W,e,n)]); n.lie=false; rs.push(['서서 '+d,E.canSee(W,e,n)]); }
  console.log('   ',JSON.stringify(rs));
  ok(rs[0][1]===true,'어둠 1.5칸 (near 안) — 보임'); ok(rs[2][1]===false,'어둠 1.9칸 (야시B 5 × 0.35 = 1.75 밖) — 안 보임'); ok(rs[3][1]===true,'서 있으면 1.9칸 보임'); ok(rs[6][1]===false && rs[7][1]===true,'4.5칸: 엎드리면 안 보임 · 서면 보임');
  n.lie=true; n.lieSeen={[e.i]:W.t}; e.x=n.x+4.5; ok(E.canSee(W,e,n)===true,'이미 안 눈 (lieSeen) 은 4.5칸에서도 봄'); n.lie=false; n.lieSeen=null;
  lit(W); n.lie=true; n.lieSw=null; n.lieSeen={}; e.x=n.x+7.5; const a=E.canSee(W,e,n); e.x=n.x+8.6; const b=E.canSee(W,e,n); n.lie=false; const c=E.canSee(W,e,n);
  ok(a===true && b===false && c===true,`빛: 7.5칸 보임 (${a}) · 8.6칸 (9 × 0.9 = 8.1 밖) 안 보임 (${b}) · 서면 보임 (${c})`); }

console.log('B. 엎드릴 때 놓침 (멀리 · 어둠) — 400판 (직접 호출)');
{ let lost=0,seen=0,near=0,nearLost=0;
  for(let s=1;s<=400;s++){ const W=W_([mk(NOR,0,4,8),mk(INJ,0,3,13)],[mk(DES['검기사'],1,11,8),mk(DES['창병'],1,7,8.5)],s,'smart'); dark(W); const n=W.units[0], far=W.units[2], cl=W.units[3]; far.face=Math.PI; cl.face=Math.PI;
    n.lie=true; n.lieSw={to:true,at:W.t}; E.lieTick(W,0.01);
    const l=W.log.find(x=>x.k==='lieDone'); if(!l) continue; if(l.lost.includes(far.i)) lost++; else if(l.seen.includes(far.i)) seen++; if(l.lost.includes(cl.i)) nearLost++; else if(l.seen.includes(cl.i)) near++; }
  const p=lost/(lost+seen); console.log(`    7칸 (검기사 야시A): 놓침 ${lost} · 계속 봄 ${seen} → ${(p*100).toFixed(0)}% | 3칸 (창병): 놓침 ${nearLost} · 봄 ${near}`);
  ok(p>0.25&&p<0.5,'7칸 어둠에서 30~50% 사이로 놓침'); ok(nearLost===0&&near===400,'3칸 (loseD 5 안) 은 놓치지 않음');
  { const W=W_([mk(NOR,0,4,8),mk(INJ,0,3,13)],[mk(DES['검기사'],1,11,8)],1,'smart'); lit(W); let L2=0; for(let s=0;s<100;s++){ const n=W.units[0]; n.lie=true; n.lieSw={to:true,at:W.t}; W.units[2].face=Math.PI; E.lieTick(W,0.01); const l=W.log.filter(x=>x.k==='lieDone').pop(); if(l.lost.length) L2++; } ok(L2===0,'빛 속에서는 놓치지 않음'); } }

console.log('C. 관측 기회 굴림 (어둠 · 4칸 · 가만히 30초 · 직접 호출)');
{ let found=0,rolls=0; const N=400;
  for(let s=1;s<=N;s++){ const W=W_([mk(NOR,0,4,8),mk(INJ,0,3,13)],[mk(DES['창병'],1,8,8)],s,'smart'); dark(W); const n=W.units[0], e=W.units[2]; e.face=Math.PI;
    n.lie=true; n.lieSw=null; n.lieSeen={}; n.lieRoll={};
    for(let k=0;k<150;k++){ W.t+=0.2; E.lieTick(W,0.2); if(n.lieSeen[e.i]!=null) break; }
    const R0=W.log.filter(x=>x.k==='lieRoll'&&x.a===e.i); rolls+=R0.length; if(R0.some(x=>x.ok)) found++; }
  console.log(`    판당 굴림 ${(rolls/N).toFixed(1)}번 · 들킨 판 ${found}/${N}`);
  ok(rolls/N>=3&&rolls/N<=6,'가만히 있으면 처음 + 6초마다만 굴림'); ok(found>N*0.2&&found<N*0.5,'30초 동안 들킬 확률 (어림 1 − 0.925^6 ≈ 37%)');
  let f2=0; for(let s=1;s<=N;s++){ const W=W_([mk(NOR,0,4,8),mk(INJ,0,3,13)],[mk(DES['창병'],1,8,8)],s,'smart'); dark(W); const n=W.units[0], e=W.units[2]; e.face=Math.PI;
    n.lie=true; n.lieSw=null; n.lieSeen={}; n.lieRoll={}; for(let k=0;k<150;k++){ W.t+=0.2; e.y=8+Math.sin(k*0.3)*1.2; E.lieTick(W,0.2); if(n.lieSeen[e.i]!=null) break; } if(n.lieSeen[e.i]!=null) f2++; }
  console.log(`    보는 쪽이 왔다 갔다 하면 들킨 판 ${f2}/${N}`); ok(f2>found,'보는 쪽이 움직이면 기회가 더 많음'); }

console.log('D. 명중 (엎드려 쏨 · 엎드린 표적)');
{ const W=W_([mk(NOR,0,4,8),mk(INJ,0,3,13)],[mk(DES['궁수'],1,10,8)],1,'smart'); lit(W); const n=W.units[0], a=W.units[2];
  const p0=E.aimP(W,n,a); n.lie=true; n.lieSw=null; const p1=E.aimP(W,n,a); const q1=E.aimP(W,a,n); n.lie=false; const q0=E.aimP(W,a,n);
  console.log(`    노먼 → 궁수 6칸: 서서 ${p0.toFixed(2)} · 엎드려 ${p1.toFixed(2)} | 궁수 → 노먼: 서 있을 때 ${q0.toFixed(2)} · 엎드렸을 때 ${q1.toFixed(2)}`);
  ok(p1>p0,'엎드려 쏘면 더 정확'); ok(Math.abs(q1/q0-0.55)<0.02,'엎드린 표적은 × 0.55'); }

console.log('E. 모르고 밟음 (직접 호출 · 겹친 채 한 순간)');
{ const W=W_([mk(INJ,0,8,8),mk(NOR,0,3,13)],[mk(DES['곤봉적'],1,8.3,8),mk(DES['창병'],1,8.2,8.1)],1,'smart'); dark(W); const j=W.units[0], g=W.units[2], sp=W.units[3];
  j.lie=true; j.lieSw=null; j.lieSeen={}; const hp0=j.hp; g.vx=2.2; g.vy=0; g.target=null; E.lieTrample(W,g,j); const l=W.log.find(x=>x.k==='trample');
  console.log(`    곤봉적 (240kg · 2.2칸/초): ${l?'밟음 · 피해 '+(hp0-j.hp):'안 밟음'}`); ok(!!l&&hp0-j.hp>10,'모르는 거구가 밟음');
  const n1=W.log.length; E.lieTrample(W,g,j); ok(W.log.length===n1,'한 번 밟은 뒤엔 앎 (또 안 밟음)');
  j.trT={}; sp.vx=2; j.lieSeen={}; const n2=W.log.length; E.lieTrample(W,sp,j); ok(!W.log.slice(n2).some(x=>x.k==='trample'),'가벼운 창병 (112kg) 은 안 밟음');
  g.vx=0.3; j.lieSeen={}; j.trT={}; const n3=W.log.length; E.lieTrample(W,g,j); ok(!W.log.slice(n3).some(x=>x.k==='trample'),'천천히 걸으면 안 밟음'); }

console.log('F. 판단 — 근접이 노리고 오면 일어남 · 노먼은 엎드려 쏨');
{ const W=W_([mk(NOR,0,4,8),mk(INJ,0,4,10)],[mk(DES['검기사'],1,12,8)],3,'smart'); lit(W); const n=W.units[0], j=W.units[1], e=W.units[2];
  E.lieSet(W,n,true,'시험'); E.lieSet(W,j,true,'시험'); run(W,0.7); n.lieSeen={[e.i]:W.t}; j.lieSeen={[e.i]:W.t};
  run(W,8); const wind=W.log.filter(x=>x.k==='wind'&&x.a===n.i).length, up=W.log.filter(x=>x.k==='lieUp');
  console.log(`    노먼 쏨 ${wind}번 · 일어남: ${up.map(x=>W.units[x.a].name+'('+x.why+')').join(' · ')||'없음'} · 노먼 엎드림 ${!!n.lie} · 인주 ${!!j.lie}`);
  ok(wind>=1,'노먼이 엎드린 채 쏨'); ok(Math.hypot(n.x-4,n.y-8)<0.05||!n.lie,'엎드린 노먼은 제자리 (명령 없이 안 감)'); }

console.log('G. 기어감 (이동 명령) · 맞지 않는 명령 → 일어남');
{ const W=W_([mk(INJ,0,4,8),mk(NOR,0,3,13)],[mk(DES['창병'],1,27,3)],1,'smart'); dark(W); const j=W.units[0];
  layFull(W,j); const x0=j.x; j.order={k:'move',x:14,y:8}; run(W,3); const crawl=j.x-x0; const W2=W_([mk(INJ,0,4,8),mk(NOR,0,3,13)],[mk(DES['창병'],1,27,3)],1,'smart'); dark(W2); const j2=W2.units[0]; j2.order={k:'move',x:14,y:8}; run(W2,3); const walk=j2.x-4;
  console.log(`    3초: 기어서 ${crawl.toFixed(2)}칸 · 걸어서 ${walk.toFixed(2)}칸`); ok(crawl>0.3&&crawl<walk*0.4,'기어가면 훨씬 느림');
  j.order={k:'charge',x:20,y:8}; run(W,0.2); ok(W.log.some(x=>x.k==='lieUp'&&x.a===j.i),'돌진 명령 → 일어남'); run(W,1.2); ok(!j.lie,'일어남 끝'); }

console.log('H. 총구 화염 (직접 호출)');
{ const W=W_([mk(NOR,0,4,8),mk(INJ,0,3,13)],[mk(DES['창병'],1,9,8),mk(DES['검기사'],1,9,9),mk(DES['궁수'],1,10,8)],2,'smart'); dark(W); const n=W.units[0], e=W.units[2], f=W.units[3], b=W.units[4];
  e.face=Math.PI; f.face=Math.PI; b.face=0; n.lie=true; n.lieSw=null; n.lieSeen={};
  const before=E.canSee(W,e,n); E.lieFlash(W,n); const fl=W.log.find(x=>x.k==='lieFlash');
  console.log(`    5칸 창병: 쏘기 전 ${before} → 뒤 ${E.canSee(W,e,n)} · 화염을 본 수 ${fl?fl.n:'-'} (등 돌린 궁수 ${n.lieSeen[b.i]!=null?'봄':'못 봄'})`);
  ok(before===false&&E.canSee(W,e,n)===true,'화염으로 자리가 드러남'); ok(fl&&fl.n===2&&n.lieSeen[b.i]==null,'등 돌린 눈은 못 봄'); }

console.log(fails?`\n${fails} FAIL`:'\nALL LIE OK');
