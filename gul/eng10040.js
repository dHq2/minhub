// v9.13.0 엔진 시험 — eng10040.js v1.0 (총안: 표적 쪽 전열 0.45칸 안이면 바로 쏨 · 그 전열은 절대 안 맞음 · 앞 전열이 싸우는 중에도 · 치유사 뒤는 총안 아님 · 막힘: 한 점으로 모이는 무리가 빨리 자리를 잡음 (비집지 않음) · 양쪽 편)
const {E,R,REB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(n,x,y,s,ex)=>mk({...REB,name:n,shield:true,weapon:'장검',ov:{hp:9e4,atk:2},traits:[],gear:{},...(ex||{})},s,x,y);
const gun=(n,x,y,s)=>mk({...REB,name:n,weapon:'소총',shield:false,ammo:300,ov:{hp:9e4,atk:3},traits:['사격A'],gear:{}},s,x,y);
const med=(n,x,y,s)=>mk({...REB,name:n,cls:'치유',role:'치유',weapon:'맨손',shield:false,ov:{hp:9e4,atk:1},traits:[],gear:{}},s,x,y);
const WF=(units,sd)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,sd,{headless:true}); E.computeLight(W); W.units.forEach(u=>{ u.noFid=true; u.seenBy=1; }); return W; };
for (const side of [0,1]){ console.log((side?'적':'우리')+' 편'); let shot=0, ff=0, hold=0, shotF=0, ffF=0, lhMed=0;
  for (let sd=1; sd<=3; sd++) for (const [gp,lat,fight] of [[0.05,0,false],[0.4,0,false],[0.1,0.3,false],[0.1,0.15,true]]){
    const us=[sw('앞',12,10,side),gun('사수',10,10,side),sw('표적',18,10.2,1-side)]; if (fight) us.push(sw('붙은적',13,10,1-side)); const W=WF(us,sd); const [f,g,t]=W.units; g.x=f.x-f.r-g.r-gp; g.y=f.y+lat; [f,g,t].forEach(u=>u.spdMul=0); f.order={k:'hold'}; t.order={k:'hold'}; g.target=t; g.state='fight'; if (fight){ const e=W.units[3]; e.spdMul=0; e.x=f.x+f.r+e.r+0.05; }
    for (let i=0;i<150;i++) E.stepWorld(W,1/30); const s0=W.log.filter(l=>(l.k==='hit'||l.k==='miss')&&l.a===g.i).length, f0=W.log.filter(l=>l.k==='hit'&&l.a===g.i&&l.b===f.i).length;
    if (fight){ shotF+=s0; ffF+=f0; } else { shot+=s0; ff+=f0; hold+=W.log.filter(l=>l.k==='hold'&&l.a===g.i).length; } }
  { const W=WF([med('치유',12,10,side),gun('사수',10,10,side),sw('표적',18,10,1-side)],1); const [f,g,t]=W.units; g.x=f.x-f.r-g.r-0.05; lhMed=E.loophole(W,g,t).length; }
  console.log(`    쏜 ${shot} · 앞 전열 맞음 ${ff} · 멈춤 ${hold} · 싸우는 전열 뒤: 쏜 ${shotF} 맞음 ${ffF}`);
  ok(shot>=40&&ff===0,'전열 뒤 0.45칸 안 (붙음 · 살짝 띄움 · 옆 어긋남) — 쏘고 전열은 안 맞음'); ok(hold===0,'총안에선 쏘다 말고 멈추지 않음'); ok(shotF>=8&&ffF===0,'앞 전열이 싸우는 중에도 그 너머로 쏨 (전열은 안 맞음)'); ok(lhMed===0,'치유사 뒤는 총안 아님'); }
// 막힘: 여섯이 한 점으로
{ let T=0, rev=0; for (let sd=1; sd<=3; sd++){ const us0=[0,1,2,3,4,5].map(j=>sw('모'+j,6+(j%3)*1.2,5+Math.floor(j/3)*1.2,0,{shield:false})); const W=W_(us0,[sw('먼적',28,1,1,{ov:{hp:9e4,atk:0}})],sd,'hold'); const us=W.units.filter(u=>u.side===0); W.units.find(u=>u.side===1).spdMul=0; us.forEach(u=>u.order={k:'move',x:16,y:9}); const dir={};
    let t=0; while (t<10 && us.some(u=>u.order&&u.order.k==='move')){ const p0=us.map(u=>[u.x,u.y]); E.stepWorld(W,1/30); t+=1/30; us.forEach((u,k)=>{ const dx=u.x-p0[k][0], dy=u.y-p0[k][1]; if (Math.hypot(dx,dy)>0.01){ const a=Math.atan2(dy,dx); if (dir[u.i]!=null && Math.cos(a-dir[u.i])<-0.5) rev++; dir[u.i]=a; } }); } T+=t; }
  console.log(`    한 점으로 모이기: 다 자리 잡음 평균 ${(T/3).toFixed(1)}초 · 되돌기 ${rev}`); ok(T/3<6,'여섯이 한 점으로 — 6초 안에 모두 자리 잡음'); ok(rev<30,'비집고 되도는 일 적음 (3판 합 30 아래)'); }
console.log(fails?'FAIL '+fails:'ALL OK');
