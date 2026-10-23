const {E,R,U,DES,mk,W_}=require('./scen_lib790.js');
const GD={ref:'C-195',name:'간두',tier:2,cls:'기동',role:'사수',weapon:'권총',ammo:100,alt:null,sm:0.95,height:1.9,weight:85,sizeCls:'중형',nv:true,nvG:'B',ov:{hp:110,atk:26},traits:['사격A','회피B','은신C','반사신경','전투센스']};
const tgt={...DES['곤봉적'],ov:{hp:9999,atk:0}};
const N=+process.env.N||20, avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:NaN;
for (const wpn of (process.env.W||'샷건,권총,소총').split(',')) for (const dist of [0.4,1.0,1.8,2.4,4]){ let hits=0,pen=0,Ps=[],As=[],pbT=0,dm=[];
  for (let s=1;s<=N;s++){ const W=W_([mk({...GD,weapon:wpn,ammo:wpn==='샷건'?50:100},0,8,8,{spdMul:0})],[mk(tgt,1,8+dist+0.6,8,{spdMul:0})],s,'hold'); W.amb=1; E.computeLight(W); const [g,d]=W.units; g.order={k:'attack',b:d.i};
    while(W.t<6&&!W.over) E.stepWorld(W,1/30);
    for(const l of W.log) if(l.k==='hit'&&l.a===0&&l.part==='몸통'&&l.A>0&&!l.crit){ hits++; if(l.pen) pen++; Ps.push(l.P); As.push(l.A); if(/영거리/.test(l.tag||'')) pbT++; if(l.pen) dm.push(l.dmg); } }
  console.log(`${wpn} 틈≈${dist}: 몸통 ${hits} · 관통력 ${avg(Ps).toFixed(0)} vs 방호 ${avg(As).toFixed(0)} · 뚫음 ${hits?(pen/hits*100).toFixed(0):0}% · 영거리 글 ${pbT}`); }
