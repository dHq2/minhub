// v7.24.1 시험 — eng7241.js v1.2 (v1.2: v7.24.4 관성 물리 (공의 거리 · 속도) · v1.1: 방패 시험은 묶지 않고 자리만 고정 · 다가가기 시험은 돌진 끔 · 모닝스타 철퇴: 2M 떨어진 상대에게 던짐 · 맞음 (철퇴 던지기) · 공이 돌아와야 다음 · 붙으면 휘두름 · 방패 정면은 막힘 · 날랜 몸은 피하기도 함 · 바위에 막힘 · 동료는 비껴감 · 2.3M 밖은 다가감)
const {E,R,DES,INJ,NOR,REB,KAR,GOB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const MS={ref:'C-005',name:'모닝스타',tier:2,cls:'근접',role:'공격수',weapon:'모닝스타',sm:1.12,height:1.72,weight:62,bold:0.65,nv:true,nvG:'C',ov:{hp:9000,atk:30},traits:['근력A','괴력A','회피C','은신D'],gear:{몸:{name:'경갑',mat:'경갑',tier:1}}};
const KN=()=>JSON.parse(JSON.stringify(DES['검기사']));
const lit=W=>{ W.amb=1; E.computeLight(W); };
const pin=(u,x,y)=>{ u.x=x; u.y=y; u.vx=0; u.vy=0; u.goal=null; u.path=[]; };
// 1) 2M 밖의 상대에게 던짐 → 맞음 → 공이 돌아옴
{ const W=W_([mk(MS,0,8,8)],[mk(KN(),1,8+0.31+0.31+2.0,8,{ov:{hp:9000}})],1,'free'); lit(W); const [m,k]=W.units; k.stunT=1e9;   // 상대는 묶어 둠
  console.log('      모닝스타 사거리',m.rng,'· 장창식 근접',m.longReach,'· 원거리?',E.isFar?E.isFar(m):'');
  let maxS=0, outT=null; run(W,4,()=>{ pin(m,8,8); pin(k,8+m.r+k.r+2.0,8); for (const F of W.flails||[]){ maxS=Math.max(maxS,Math.hypot(F.x-m.x,F.y-m.y)); if (outT==null) outT=W.t; } });
  const T=W.log.filter(l=>l.k==='flail'&&l.a===m.i), H=W.log.filter(l=>l.k==='hit'&&l.a===m.i&&l.tag==='철퇴 던지기'); console.log('      던짐',T.length,'맞음',H.length,'· 공이 간 거리',maxS.toFixed(2));
  ok(T.length>=2&&H.length>=1,'2M 떨어진 검기사에게 철퇴를 던져 맞힘 (던짐 '+T.length+' · 맞음 '+H.length+')'); ok(!(W.flails||[]).length||W.flails.every(F=>F.ph),'공은 돌아옴'); }
// 2) 붙어 있으면 휘두름
{ const W=W_([mk(MS,0,8,8)],[mk(KN(),1,8.75,8,{ov:{hp:9000}})],1,'free'); lit(W); const [m,k]=W.units; k.stunT=1e9;
  run(W,3,()=>{ pin(m,8,8); pin(k,8+m.r+k.r+0.15,8); }); const T=W.log.filter(l=>l.k==='flail'&&l.a===m.i), H=W.log.filter(l=>l.k==='hit'&&l.a===m.i&&l.tag!=='철퇴 던지기');
  ok(T.length===0&&H.length>=1,'붙어 있으면 (0.15M) 던지지 않고 휘두름 (휘두름 '+H.length+')'); }
// 3) 공이 돌아와야 다음 공격
{ const W=W_([mk(MS,0,8,8)],[mk(KN(),1,10.6,8,{ov:{hp:9000}})],1,'free'); lit(W); const [m,k]=W.units; k.stunT=1e9; let both=0;
  run(W,4,()=>{ pin(m,8,8); pin(k,10.6,8); if ((W.flails||[]).filter(F=>F.by===m.i).length>1) both++; }); ok(both===0,'철퇴는 하나 — 돌아오기 전엔 다시 던지지 않음'); }
// 4) 방패 정면은 막힘
{ const SH={...KN(),name:'방패기사',shield:true}; let blk=0, n=0; for (let s=1;s<=4;s++){ const W=W_([mk(MS,0,8,8)],[mk(SH,1,10.6,8,{ov:{hp:9000}})],s,'free'); lit(W); const [m,k]=W.units; k.face=k.fg=Math.PI; k.guardMode='hold';
    run(W,4,()=>{ pin(m,8,8); pin(k,10.6,8); k.face=k.fg=Math.PI; }); const H=W.log.filter(l=>l.k==='hit'&&l.a===m.i&&l.tag==='철퇴 던지기'); n+=H.length; blk+=H.filter(h=>h.block).length; }
  console.log('      방패 정면 맞음',n,'막힘',blk); ok(n>0&&blk>0,'방패 정면은 막힘 ('+blk+' / '+n+')'); }
// 5) 날랜 몸 (청광묵) 은 피하기도 함
{ let ev=0, n=0; for (let s=1;s<=6;s++){ const W=W_([mk(MS,0,8,8)],[mk(GOB,1,10.5,8,{ov:{hp:9000}})],s,'free'); lit(W); const [m,g]=W.units;
    run(W,5,()=>{ pin(m,8,8); pin(g,10.5,8); g.act=null; }); n+=W.log.filter(l=>l.k==='flail'&&l.a===m.i).length; ev+=W.log.filter(l=>l.k==='evade'&&l.b===g.i&&/철퇴/.test(l.why||'')).length; }
  console.log('      청광묵에게 던짐',n,'피함',ev); ok(ev>0,'날랜 청광묵은 날아오는 철퇴를 피하기도 함 ('+ev+' / '+n+')'); }
// 6) 바위에 막힘
{ const W=W_([mk(MS,0,8,8)],[mk(KN(),1,10.6,8,{ov:{hp:9000}})],1,'free'); lit(W); const [m,k]=W.units; k.stunT=1e9; const F0={by:m.i,side:0,b:k.i,x:8.2,y:8,vx:13,vy:0,L:2.9,br:0.2,ph:'out',hit:null,ev:[],t0:0};   /* v1.4 관성 물리 (속도) */
  W.map.t[8*W.map.W+9]=1; W.flails=[F0]; for (let i=0;i<6;i++) E.stepWorld(W,1/30); ok(F0.wall&&F0.hit==null,'길에 바위가 있으면 공이 막혀 되돌아옴'); }
// 7) 동료는 비껴감
{ const W=W_([mk(MS,0,8,8),mk(REB,0,9.3,8,{ov:{hp:9000}})],[mk(KN(),1,10.8,8,{ov:{hp:9000}})],1,'free'); lit(W); const [m,r,k]=W.units; const h0=r.hp; k.stunT=1e9;
  E.throwFlail(W,m,k); for (let i=0;i<20;i++){ E.stepWorld(W,1/30); pin(m,8,8); pin(r,9.3,8); pin(k,10.8,8); } ok(r.hp===h0,'사이의 동료 (레베카) 는 비껴감 — 피해 없음'); }
// 8) 2.3M 밖이면 다가가서 던짐
{ const W=W_([mk(MS,0,6,8)],[mk(KN(),1,12,8,{ov:{hp:9000}})],1,'free'); lit(W); const [m,k]=W.units; k.stunT=1e9; m.canCharge=false; let g0=null;
  run(W,6,()=>{ pin(k,12,8); const T=W.log.find(l=>l.k==='flail'&&l.a===m.i); if (T&&g0==null) g0=E.gap?E.gap(m,k):Math.hypot(m.x-k.x,m.y-k.y)-m.r-k.r; });
  console.log('      처음 던진 간격',g0&&g0.toFixed(2)); ok(g0!=null&&g0<=2.35,'멀면 다가가서 2.3M 안에서 던짐'); }
console.log(fails?`${fails} FAIL`:'ALL 7241 OK');
