// v7.24.4 시험 — eng7244.js v1.0 (모닝스타 철퇴: 관성 던지기 (속도가 변함 · 사슬 끝에서 되튕김 · 맞고 튕김 · 끌려 돌아옴) / 철퇴 후리기 (정한 거리 · 한 바퀴 · 지나는 순서대로 · 중형은 크게 밀리고 대형은 덜 · 동료도 · 막기 성공이면 튕기고 멈춤 · 스스로 쓸 때 거리))
const {E,R,DES,INJ,REB,KAR,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const MS={ref:'C-005',name:'모닝스타',tier:2,cls:'근접',role:'공격수',weapon:'모닝스타',sm:1.12,height:1.72,weight:62,ov:{hp:9000,atk:30},traits:['근력A','괴력A','회피C'],active:['철퇴 후리기','휘둘러 치기']};
const KN=()=>({...JSON.parse(JSON.stringify(DES['검기사'])),ov:{hp:9000,atk:5}});
const lit=W=>{ W.amb=1; E.computeLight(W); };
const pin=(u,x,y)=>{ u.x=x; u.y=y; u.vx=0; u.vy=0; u.goal=null; u.path=[]; };
// 1) 관성 던지기: 빈 곳으로 — 속도가 줄고 · 사슬 끝에서 되튕김 · 끌려 돌아옴
{ const W=W_([mk(MS,0,8,8)],[mk(KN(),1,25,2)],1,'hold'); lit(W); const [m]=W.units; const dummy={x:11,y:8,vx:0,vy:0}; E.throwFlail(W,m,dummy); const F=W.flails[0]; const sp=[], dd=[]; let ph=[];
  for (let i=0;i<40&&W.flails.length;i++){ sp.push(Math.hypot(F.vx,F.vy)); dd.push(Math.hypot(F.x-m.x,F.y-m.y)); ph.push(F.ph); E.stepWorld(W,1/30); pin(m,8,8); }
  console.log('      속력',sp.slice(0,8).map(v=>v.toFixed(1)).join(' '),'… 거리 최대',Math.max(...dd).toFixed(2),'L',F.L.toFixed(2),'· 돌아온 틱',dd.length);
  ok(sp[1]<sp[0]&&Math.max(...dd)<=m.r+m.rng+0.25,'날아가며 느려지고 · 사슬 길이 (2.3M + 몸) 를 넘지 않음'); ok(ph.includes('back')&&!W.flails.length&&dd.length<40,'사슬 끝에서 되튕겨 끌려 돌아옴 ('+dd.length+'틱)'); }
// 2) 맞고 튕김
{ const W=W_([mk(MS,0,8,8)],[mk(KN(),1,10.3,8)],1,'hold'); lit(W); const [m,k]=W.units; k.stunT=1e9; E.throwFlail(W,m,k); const F=W.flails[0]; let vx0=null;
  for (let i=0;i<12;i++){ E.stepWorld(W,1/30); pin(m,8,8); pin(k,10.3,8); if (F.hit!=null&&vx0==null) vx0=F.vx; }
  console.log('      맞은 뒤 vx',vx0&&vx0.toFixed(2)); ok(F.hit===k.i&&vx0<0.5,'몸에 맞고 튕겨 나옴'); }
// 3) 철퇴 후리기: 정한 거리 · 한 바퀴 · 중형은 크게 · 대형은 덜 · 동료도
{ const W=W_([mk(MS,0,10,8),mk({...REB,name:'동료',ov:{hp:9000}},0,10,6.3)],[mk(KN(),1,11.9,8),mk({...KAR,side:1,name:'적 카리우스',ov:{hp:9000}},1,10,10.2),mk(KN(),1,14.5,8)],1,'hold'); lit(W); const [m,r,k1,kr,kfar]=W.units; for (const e of [k1,kr,kfar]){ e.stunT=1e9; e.guardMode='off'; e.raised=false; }
  m.face=0; const p0={k1:[k1.x,k1.y],kr:[kr.x,kr.y],r:[r.x,r.y]}; E.startSpec(W,m,null,'sweep','시험'); m.act.R=2.1; const seq=[];
  run(W,1.8,()=>{ for (const l of W.log.filter(l=>l.k==='hit'&&l.a===m.i&&l.tag==='철퇴 후리기')) if (!seq.includes(l.b)) seq.push(l.b); });
  const S=W.log.find(l=>l.k==='flailSpin'), SW=W.log.find(l=>l.k==='flailSweep'); const mv=u=>Math.hypot(u.x-p0[u===k1?'k1':u===kr?'kr':'r'][0],u.y-p0[u===k1?'k1':u===kr?'kr':'r'][1]);
  console.log('      ',JSON.stringify(S),JSON.stringify(SW),'순서',seq.map(i=>W.units[i].name).join(' → '),'밀림 — 검기사',mv(k1).toFixed(2),'카리우스',mv(kr).toFixed(2),'동료',mv(r).toFixed(2));
  ok(S&&S.R===2.1&&SW&&SW.n===3&&!seq.includes(kfar.i),'정한 거리 2.1M · 한 바퀴에 안의 셋 (동료 포함) · 밖 (4.5M) 은 아님');
  { const rel=u=>{ let r=Math.atan2(p0[u===k1?'k1':u===kr?'kr':'r'][1]-8,p0[u===k1?'k1':u===kr?'kr':'r'][0]-10)-S.a0; return ((r%(2*Math.PI))+2*Math.PI)%(2*Math.PI); }, exp=[k1,kr,r].sort((a,b)=>rel(a)-rel(b)).map(u=>u.i);
    ok(seq.length===3&&seq.join()===exp.join(),'머리 위로 돌던 각에서 이어 시계방향 — 지나는 순서대로'); }
  ok(mv(k1)>1.2&&mv(kr)<mv(k1)*0.6,'중형 · 중대형은 크게 밀리고 대형 (카리우스) 은 덜'); ok(W.log.some(l=>l.k==='hit'&&l.a===m.i&&l.b===r.i),'동료도 맞음'); }
// 4) 막기 성공 → 튕기고 멈춤 (뒤의 몸은 안 맞음)
{ const SH={...KN(),name:'방패기사',shield:true}; const W=W_([mk(MS,0,10,8)],[mk(SH,1,10,10),mk(KN(),1,8.1,8)],1,'hold'); W.rules.spec.sweep.blk={shield:1,weapon:0}; lit(W); const [m,s,k]=W.units; s.stunT=-9; s.face=s.fg=-Math.PI/2; s.raised=true; s.raiseAt=-9; s.guardMode='hold'; k.stunT=1e9;
  m.face=0; E.startSpec(W,m,null,'sweep','시험'); m.act.R=2.1; run(W,1.6,()=>{ pin(s,10,10); s.face=s.fg=-Math.PI/2; s.raised=true; }); const SW=W.log.find(l=>l.k==='flailSweep'); console.log('      ',JSON.stringify(SW));
  ok(SW&&SW.stop===s.i&&!W.log.some(l=>l.k==='hit'&&l.a===m.i&&l.b===k.i&&l.tag==='철퇴 후리기'),'방패로 막는 데 성공 → 그 자리에서 튕기고 멈춤 (뒤의 검기사는 안 맞음)'); }
// 5) 스스로: 둘러싸이면 둘레의 적을 덮는 거리로
{ let used=0, Rs=[]; for (let sd=1;sd<=4;sd++){ const W=W_([mk(MS,0,10,8)],[mk(KN(),1,11.4,8),mk(KN(),1,10,9.6),mk(KN(),1,8.4,8.3)],sd,'free'); lit(W); run(W,3); const S=W.log.find(l=>l.k==='flailSpin'); if (S){ used++; Rs.push(S.R); } }
  console.log('      스스로',used,'/ 4 · 거리',Rs.join(' ')); ok(used>=2&&Rs.every(r=>r>=1.2&&r<=2.6),'셋에게 둘러싸이면 스스로 철퇴 후리기 (1.2 ~ 2.6M)'); }
console.log(fails?`${fails} FAIL`:'ALL 7244 OK');
