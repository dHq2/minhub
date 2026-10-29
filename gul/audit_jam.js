// 막힘 점검 v1.0 — 같은 편끼리 길이 겹칠 때: 엇갈려 지나가기 · 한 점으로 모이기 · 싸우는 무리 · 명령 무리 (RT3=옛 엔진)
const {E,R,INJ,NOR,REB,KAR,GOB,mk,W_}=require('./scen_lib790.js');
const N=+process.env.N||6, dt=1/30;
const sw=(n,x,y,s,ex)=>mk({...REB,name:n,shield:false,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},...(ex||{})},s,x,y);
function meas(W, us, sec, done){ let stuck=0, ov=0, ovMax=0, ovN=0, rev=0, t=0, fin=null; const last={}, dir={};
  for (let i=0;i<sec*30;i++){ const p0=us.map(u=>({x:u.x,y:u.y})); E.stepWorld(W,dt); t+=dt;
    us.forEach((u,k)=>{ if(!u.alive) return; const dx=u.x-p0[k].x, dy=u.y-p0[k].y, d=Math.hypot(dx,dy); const want=(u.order&&u.order.k==='move')||(u.path&&u.path.length);
      if (want && d < (u.spd||2)*dt*0.25) stuck++; if (d>0.01){ const a=Math.atan2(dy,dx); if (dir[u.i]!=null && Math.cos(a-dir[u.i])<-0.5) rev++; dir[u.i]=a; } });
    for (let a=0;a<us.length;a++) for (let b=a+1;b<us.length;b++){ const P=us[a],Q=us[b]; if(!P.alive||!Q.alive) continue; const o=P.r+Q.r-Math.hypot(P.x-Q.x,P.y-Q.y); if (o>0.02){ ov+=o; ovN++; ovMax=Math.max(ovMax,o); } }
    if (fin==null && done && done()) fin=t; }
  return { stuck: stuck/30, ovAvg: ovN? ov/ovN:0, ovMax, rev, fin: fin==null?99:fin };
}
const acc={}; const add=(k,r)=>{ const A=acc[k]||(acc[k]={n:0,stuck:0,ovAvg:0,ovMax:0,rev:0,fin:[]}); A.n++; A.stuck+=r.stuck; A.ovAvg+=r.ovAvg; A.ovMax=Math.max(A.ovMax,r.ovMax); A.rev+=r.rev; A.fin.push(r.fin); };
const far=()=>sw('먼적',28,1,1,{ov:{hp:9e4,atk:0}});
for (let sd=1; sd<=N; sd++){
  // A 엇갈려 지나가기: 3 + 3 이 마주 보고 서로의 자리로
  { const L=[], Rr=[]; for (let j=0;j<3;j++){ L.push(sw('왼'+j,10,7+j*0.9,0)); Rr.push(sw('오'+j,14,7+j*0.9,0)); } const W=W_([...L,...Rr],[far()],sd,'hold'); const us=W.units.filter(u=>u.side===0); const fz=W.units.find(u=>u.side===1); fz.spdMul=0;
    us.forEach((u,k)=>{ const g=k<3?{x:14,y:7+k*0.9}:{x:10,y:7+(k-3)*0.9}; u.order={k:'move',x:g.x,y:g.y}; u._g=g; });
    add('A 엇갈림', meas(W,us,8,()=>us.every(u=>Math.hypot(u.x-u._g.x,u.y-u._g.y)<0.6))); }
  // B 한 점으로 모이기: 6명이 같은 자리로 (뭉쳐 섬)
  { const us0=[0,1,2,3,4,5].map(j=>sw('모'+j,6+(j%3)*1.2,5+Math.floor(j/3)*1.2,0)); const W=W_(us0,[far()],sd,'hold'); const us=W.units.filter(u=>u.side===0); W.units.find(u=>u.side===1).spdMul=0;
    us.forEach(u=>u.order={k:'move',x:16,y:9}); add('B 한 점', meas(W,us,8,()=>us.every(u=>!u.order||u.order.k!=='move'))); }
  // C 싸우는 무리: 근접 5명 (카리우스 포함) vs 단단한 적 1
  { const us0=[mk(KAR,0,10,8),mk(REB,0,10,9),mk(INJ,0,9,8),sw('검',9,9,0),mk(NOR,0,8,8)]; const W=W_(us0,[sw('적',14,8.5,1,{ov:{hp:9e4,atk:3}})],sd,'free'); W.amb=1; E.computeLight(W);
    const us=W.units.filter(u=>u.side===0); add('C 싸우는 무리', meas(W,us,8)); }
  // D 길이 겹치는 명령: 뒤의 둘이 앞의 셋을 뚫고 지나가야 함 (앞 셋은 제자리)
  { const F=[sw('앞0',12,7.6,0),sw('앞1',12,8.5,0),sw('앞2',12,9.4,0)], B=[sw('뒤0',9,8.2,0),sw('뒤1',9,8.9,0)]; const W=W_([...F,...B],[far()],sd,'hold'); const us=W.units.filter(u=>u.side===0); W.units.find(u=>u.side===1).spdMul=0;
    us.slice(0,3).forEach(u=>u.order={k:'hold'}); us[3].order={k:'move',x:16,y:8.2}; us[4].order={k:'move',x:16,y:8.9}; us[3]._g={x:16,y:8.2}; us[4]._g={x:16,y:8.9};
    add('D 제자리 줄 뚫기', meas(W,us,8,()=>[us[3],us[4]].every(u=>Math.hypot(u.x-u._g.x,u.y-u._g.y)<0.6))); }
}
for (const k in acc){ const A=acc[k], f=A.fin.slice().sort((a,b)=>a-b); console.log(k.padEnd(10), '막힌 초', (A.stuck/A.n).toFixed(2), '· 겹침 평균', (A.ovAvg/A.n).toFixed(3), '최대', A.ovMax.toFixed(2), '· 되돌기', (A.rev/A.n).toFixed(0), '· 다 닿음 (중앙)', f[Math.floor(f.length/2)].toFixed(1)+'초', '· 못 닿은 판', f.filter(x=>x>=99).length); }
