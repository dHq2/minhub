// v9.8.1 엔진 시험 — eng9810.js v1.0 (길찾기: A* 곧은 길 · 모퉁이 적음 · 서 있는 동료 무리를 비켜 지나감 · 마주 오는 둘이 엇갈림 · 벽 너머로 돌아감)
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:5},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,flips)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='hold'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:flips||[]},R2,1,{headless:true}); E.computeLight(W); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const far=sw('먼 적',38,1,1);
console.log('A. 벽을 돌아가는 길 — 곧고 모퉁이가 적음');
{ const fl=[]; for(let y=3;y<=16;y++) fl.push('20,'+y); const W=WF([sw('걷는 이',5,10,0),{...far}],fl); const u=W.units[0]; u.order={k:'move',x:35,y:10};
  let t=0, len=0, px=u.x, py=u.y; while(t++<600 && Math.hypot(u.x-35,u.y-10)>0.4){ step(W); len+=Math.hypot(u.x-px,u.y-py); px=u.x; py=u.y; }
  const best=Math.hypot(20-5,2.5-10)+Math.hypot(35-20,10-2.5); console.log('    걸은 길 '+len.toFixed(1)+'칸 (최단 약 '+best.toFixed(1)+') · '+(t/30).toFixed(1)+'초');
  ok(Math.hypot(u.x-35,u.y-10)<=0.5,'도착'); ok(len<best*1.15,'최단에 가까운 길 (15% 안)'); }
console.log('B. 서 있는 동료 무리를 비켜 지나감');
{ const W=WF([sw('걷는 이',5,10,0),sw('벽1',10,9.4,0),sw('벽2',10,10,0),sw('벽3',10,10.6,0),{...far}]); const u=W.units[0]; W.units.slice(1,4).forEach(o=>o.order={k:'hold'}); u.order={k:'move',x:16,y:10};
  let t=0; while(t++<300 && Math.hypot(u.x-16,u.y-10)>0.4) step(W); const mv=Math.max(...W.units.slice(1,4).map(o=>Math.hypot(o.x-10,o.y-(o.name==='벽1'?9.4:o.name==='벽2'?10:10.6))));
  console.log('    '+(t/30).toFixed(1)+'초 · 동료가 밀려난 최대 '+mv.toFixed(2)+'칸'); ok(t<300,'건너편 도착'); ok(t/30<6,'오래 끼지 않음'); ok(mv<1.5,'동료를 멀리 밀어내지 않음 (옛 길찾기: 6칸 넘게)'); }
console.log('C. 마주 오는 둘이 엇갈림');
{ const W=WF([sw('갑',5,10,0),sw('을',15,10,0),{...far}]); const [a,b]=W.units; a.order={k:'move',x:15,y:10}; b.order={k:'move',x:5,y:10};
  let t=0; while(t++<300 && (Math.hypot(a.x-15,a.y-10)>0.4 || Math.hypot(b.x-5,b.y-10)>0.4)) step(W); console.log('    '+(t/30).toFixed(1)+'초'); ok(t/30<7,'둘 다 도착 (끼지 않음)'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
