// v9.6.1 엔진 시험 — eng9080.js v1.0 (대장이 서둘러 뛰면 부하도 서둘러: 따르는 이가 뛰는 동안 따라가는 이도 뜀걸음 · 걸을 땐 걸음)
const {E,R,U,DES,NOR,INJ,KAR,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec)=>{ const n=Math.round(sec*30); for(let i=0;i<n&&!W.over;i++) E.stepWorld(W,1/30); };
const WT=(units,seed)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.autoLift=false; R2.chgPol={allyOff:false}; return E.createWorld({type:'grid',W:50,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed||1,{headless:true}); };
const go=(hurry, chiefMode)=>{ const W=WT([mk(INJ,0,5,10,{hero:true}),mk(KAR,0,3.5,10),mk(DES['창병'],1,48,2)],1); W.torches=[{x:20,y:10,r:80}]; E.computeLight(W); const [h,f,e]=W.units; e.order={k:'hold'}; h.order={k:'move',x:40,y:10,hurry}; f.state='follow'; run(W,0.5); const x0=f.x, hx0=h.x; run(W,2.5); return { f:f.x-x0, h:h.x-hx0 }; };
const a=go(true), b=go(false);
console.log(`    2.5초: 인주가 서두름 — 인주 ${a.h.toFixed(1)} · 따르는 이 ${a.f.toFixed(1)} / 걸음 — 인주 ${b.h.toFixed(1)} · 따르는 이 ${b.f.toFixed(1)}`);
ok(a.h>b.h*1.2,'인주가 서두르면 더 멀리 감 (뜀 ' + a.h.toFixed(1) + ' > 걸음 ' + b.h.toFixed(1) + ')');
ok(a.f>b.f*1.15,'따르는 이도 같이 뜀 — 걸을 때보다 더 감 (' + a.f.toFixed(1) + ' / 인주 ' + a.h.toFixed(1) + ')');
ok(b.f<=b.h*1.15,'걸을 땐 따르는 이도 걸음 ('+b.f.toFixed(1)+')');
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
