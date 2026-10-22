// sim8745.js v1.0 — 모닝스타 (C2): 자동 판에서 적과의 거리 (중거리 유지?) · 철퇴 던지기 · 오사 (겹친 아군)
const {E,DES,REB,mk,W_}=require('./scen_lib790.js');
const MS={ref:'C-005',name:'모닝스타',tier:2,cls:'근접',role:'공격수',weapon:'모닝스타',sm:1.12,height:1.72,weight:62,bold:0.65,noChg:true,nv:true,nvG:'C',ov:{hp:140,atk:30},traits:['근력A','괴력A','회피C','은신D'],gear:{몸:{name:'경갑',mat:'경갑',tier:1}},active:['철퇴 후리기','휘둘러 치기']};
const N=+(process.argv[2]||10), mode=process.argv[3]||'range';
let agg={ near:0, mid:0, far:0, throws:0, swings:0, ff:0, ffBack:0, hits:0, tak:0 };
for (let sd=1;sd<=N;sd++){
  const allies=[mk(MS,0,6,8)]; if (mode==='ff') allies.push(mk({...REB,name:'레베카',traits:[],ov:{hp:900,atk:5}},0,7.4,8));
  const W=W_(allies,[mk(DES['검기사'],1,13,8),mk(DES['검기사'],1,13,10)],sd,'free'); W.amb=1; E.computeLight(W);
  const m=W.units[0]; if (mode==='ff'){ const r=W.units[1]; r.order={k:'hold'}; }
  for (let i=0;i<300&&!W.over&&m.alive;i++){ E.stepWorld(W,0.05);
    const g=Math.min(...W.units.filter(f=>f.alive&&f.side===1).map(f=>Math.hypot(f.x-m.x,f.y-m.y)-f.r-m.r)); if (isFinite(g)){ if (g<0.9) agg.near++; else if (g<=2.4) agg.mid++; else agg.far++; } }
  agg.throws+=W.log.filter(l=>l.k==='wind'&&l.a===m.i&&/던지기|철퇴/.test(l.why||'')).length; agg.ff+=W.log.filter(l=>l.k==='flailFF'&&l.a===m.i&&!l.back).length; agg.ffBack+=W.log.filter(l=>l.k==='flailFF'&&l.a===m.i&&l.back).length;
  agg.hits+=W.log.filter(l=>l.k==='hit'&&l.a===m.i&&W.units[l.b].side===1).length; agg.tak+=W.log.filter(l=>l.k==='hit'&&l.b===m.i).length; }
const tot=agg.near+agg.mid+agg.far; console.log(mode, JSON.stringify({ ...agg, near: (agg.near/tot*100).toFixed(0)+'%', mid: (agg.mid/tot*100).toFixed(0)+'%', far: (agg.far/tot*100).toFixed(0)+'%' }));
