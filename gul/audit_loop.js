// 총안 점검 v1.0 — 전열 바로 뒤 사수 (붙은 정도 · 옆 어긋남 · 앞 전열이 싸우는 중) · 양쪽 편 · RT3=옛 엔진
const {E,R,REB,mk}=require('./scen_lib790.js');
const sw=(n,x,y,s,ex)=>mk({...REB,name:n,shield:true,weapon:'장검',ov:{hp:9e4,atk:2},traits:[],gear:{},...(ex||{})},s,x,y);
const gun=(n,x,y,s)=>mk({...REB,name:n,weapon:'소총',shield:false,ammo:300,ov:{hp:9e4,atk:3},traits:['사격A'],gear:{}},s,x,y);
const WF=(units,sd)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,sd,{headless:true}); E.computeLight(W); W.units.forEach(u=>{ u.noFid=true; u.seenBy=1; }); return W; };
const S={}; const add=(k,o)=>{ const A=S[k]||(S[k]={n:0,shot:0,ff:0,hitT:0,hold:0}); A.n++; for (const q in o) A[q]+=o[q]; };
for (const side of [0,1]) for (let sd=1; sd<=4; sd++) for (const [nm,gp,lat,fight] of [['딱 붙음',0.05,0,false],['살짝 띄움',0.35,0,false],['옆 어긋남',0.1,0.35,false],['앞이 싸우는 중',0.1,0.15,true]]){
  const us=[sw('앞',12,10,side),gun('사수',10,10,side),sw('표적',18,10.2,1-side)]; if (fight) us.push(sw('붙은적',13.0,10,1-side));
  const W=WF(us,sd); const [f,g,t]=W.units; g.x=f.x-f.r-g.r-gp; g.y=f.y+lat; f.spdMul=0; t.spdMul=0; g.spdMul=0; f.order={k:'hold'}; t.order={k:'hold'}; g.target=t; g.state='fight'; if (fight){ const e=W.units[3]; e.spdMul=0; e.x=f.x+f.r+e.r+0.05; }
  for (let i=0;i<180;i++) E.stepWorld(W,1/30);
  add(nm,{ shot:W.log.filter(l=>(l.k==='hit'||l.k==='miss')&&l.a===g.i).length, ff:W.log.filter(l=>l.k==='hit'&&l.a===g.i&&l.b===f.i).length, hitT:W.log.filter(l=>l.k==='hit'&&l.a===g.i&&l.b!==f.i).length, hold:W.log.filter(l=>l.k==='hold'&&l.a===g.i).length });
}
for (const k in S){ const A=S[k]; console.log(k.padEnd(9),'판',A.n,'· 쏜',A.shot,'· 앞 전열 맞음',A.ff,'· 적 맞힘',A.hitT,'· 쏘지 못하고 멈춤',A.hold); }
