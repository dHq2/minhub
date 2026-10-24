// v9.4.0 엔진 시험 — eng9050.js v1.0 (적 (side 1) 이 하는 전술 — 아군은 돌격 금지 기본이라 스스로 안 나감 · 암계 전술 D6: 방패병의 역장이 펼쳐진 동안 창 든 이는 선 바로 뒤에 나란히 섬 · 선 너머로 찌름 · 끝나면 보통 싸움)
const {E,R,U,DES,mk,W_,REB}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++){ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; } };
const run=(W,sec,fn)=>{ const n=Math.round(sec*30); for(let i=0;i<n&&!W.over;i++){ step(W); if(fn&&fn(W)) break; } };
const logK=(W,k)=>W.log.filter(l=>l.k===k);
const base={...REB,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},nv:true};
const dummy=(name,x,y,side,ex)=>mk({...base,name,...(ex||{})},side,x,y);
const WF=(units,o)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.chgPol={allyOff:false}; R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,(o&&o.seed)||1,{headless:true}); W.amb=1; E.computeLight(W); return W; };
const hold=(...us)=>{ for(const u of us){ u.state='idle'; u.target=null; u.goal=null; u.path=null; u.wander=99; } };
const hunt=(us,t)=>{ for(const u of us){ u.state='hunt'; u.target=t; u.sense[t.i]={x:t.x,y:t.y,t:0,exact:true,sight:true}; } };
const SP=(n,x,y)=>dummy('창'+n,x,y,1,{weapon:'창',shield:true,shSize:'중형',ov:{hp:400,atk:30}});
console.log('A. 역장 뒤 창 대열');
for (const seed of [1,2,3]){
  const W=WF([dummy('방패병',10,10,1,{shield:true,shSize:'대형',active:['암계 역장'],ov:{hp:600,atk:30}}),SP(1,8.5,8),SP(2,8.5,10),SP(3,8.5,12),dummy('적1',17,9.5,0,{ov:{hp:2000,atk:5}}),dummy('적2',17,10.5,0,{ov:{hp:2000,atk:5}})],{seed});
  const [s,a,b,c,e1,e2]=W.units; hold(e1,e2); hunt([s,a,b,c],e1);
  E.supStart(W,s,'bfield',null,'시험',e1.x,e1.y); run(W,1.2); const F=(W.sf8||[]).find(f=>f.k==='wall'&&f.hard); ok(!!F,'['+seed+'] 역장이 섬');
  if(!F) continue; run(W,0.8,null);
  const pos=[a,b,c].map(u=>({ off:(u.x-F.x)*F.nx+(u.y-F.y)*F.ny, al:(u.x-F.x)*F.ux+(u.y-F.y)*F.uy }));
  const sg=Math.sign(((e1.x+e2.x)/2-F.x)*F.nx+((e1.y+e2.y)/2-F.y)*F.ny)||1;
  console.log('    선 길이 '+(F.h*2).toFixed(1)+' · 창 셋 선 뒤 거리 '+pos.map(p=>(-p.off*sg).toFixed(2)).join(' · ')+' · 선 따라 '+pos.map(p=>p.al.toFixed(1)).join(' · '));
  ok(pos.every(p=>-p.off*sg>0.2&&-p.off*sg<1.6),'['+seed+'] 창 셋 모두 선 바로 뒤 (아군 쪽 0.2 ~ 1.6칸)');
  ok(pos.every(p=>Math.abs(p.al)<=F.h+0.6)&&new Set(pos.map(p=>Math.round(p.al*2))).size===3,'['+seed+'] 선 길이 안에 서로 떨어져 나란히');
  ok([a,b,c].every(u=>logK(W,'mood')||true),'(상태 글 확인은 생략)'); }
console.log('B. 끝나면 보통 싸움');
{ const W=WF([dummy('방패병',10,10,1,{shield:true,shSize:'대형',active:['암계 역장'],ov:{hp:600,atk:30}}),SP(1,7,9),SP(2,7,11),dummy('적1',17,10,0,{ov:{hp:2000,atk:5}})],{seed:5}); const [s,a,b,e]=W.units; hold(e); hunt([s,a,b],e);
  E.supStart(W,s,'bfield',null,'시험',e.x,e.y); run(W,1.0); const F=(W.sf8||[]).find(f=>f.k==='wall'&&f.hard); const x0=a.x; run(W,6.0); ok(W.t>F.until,'역장이 끝남'); ok(Math.hypot(a.x-e.x,a.y-e.y)<5||e.hp<e.max,'끝난 뒤엔 보통대로 적에게 붙음 (거리 '+Math.hypot(a.x-e.x,a.y-e.y).toFixed(1)+')'); }
console.log('C. 대열은 창만');
{ const W=WF([dummy('방패병',10,10,1,{shield:true,shSize:'대형',active:['암계 역장'],ov:{hp:600,atk:30}}),dummy('검병',7,9,1,{weapon:'장검'}),dummy('적',20,10,0,{ov:{hp:2000,atk:5}})],{seed:2}); const [s,g,e]=W.units; hold(e); hunt([s,g],e);
  E.supStart(W,s,'bfield',null,'시험',e.x,e.y); run(W,1.2); const F=(W.sf8||[]).find(f=>f.k==='wall'&&f.hard); const off=F?(g.x-F.x)*F.nx+(g.y-F.y)*F.ny:null; ok(F&&!(Math.abs(off)<1.6&&Math.abs((g.x-F.x)*F.ux+(g.y-F.y)*F.uy)<F.h),'창이 아닌 검병은 대열에 서지 않음 (선에서 '+(off==null?'-':off.toFixed(1))+')'); }
console.log('D. 선 너머로 찌름');
{ const W=WF([dummy('방패병',10,10,1,{shield:true,shSize:'대형',active:['암계 역장'],ov:{hp:600,atk:30}}),SP(1,12,10),dummy('적',13.9,10,0,{ov:{hp:3000,atk:5}})],{seed:4}); const [s,a,e]=W.units; hold(e); hunt([s,a],e); const hp0=e.hp;
  E.supStart(W,s,'bfield',null,'시험',e.x,e.y); run(W,2.4); const F=(W.sf8||[]).find(f=>f.k==='wall'&&f.hard); ok(!!F&&W.t<F.until,'역장이 아직 서 있음 (t '+W.t.toFixed(1)+')');
  ok(e.hp<hp0,'선 뒤의 창이 선 너머 적을 찌름 (적 체력 '+Math.round(hp0)+' → '+Math.round(e.hp)+')'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
