// v9.4.1 엔진 시험 — eng9060.js v1.0 (오래된 약병 = 특수 스킬: 가방에 있으면 기술이 뜸 · 동료 (자기도) 에게 먹임 · 최대 체력 25% (15 ~ 60) · 하나씩 · 다 쓰면 기술이 사라짐)
const {E,R,U,DES,mk,W_,REB}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++){ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; } };
const run=(W,sec,fn)=>{ const n=Math.round(sec*30); for(let i=0;i<n&&!W.over;i++){ step(W); if(fn&&fn(W)) break; } };
const logK=(W,k)=>W.log.filter(l=>l.k===k);
const base={...REB,shield:false,weapon:'장검',ov:{hp:200,atk:20},traits:[],gear:{},nv:true};
const dummy=(name,x,y,side,ex)=>mk({...base,name,...(ex||{})},side,x,y);
const WF=(al,fo,o)=>{ const units=[...al,...(fo||[])]; const R2=JSON.parse(JSON.stringify(R)); R2.chgPol={allyOff:false}; R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,(o&&o.seed)||1,{headless:true}); W.amb=1; E.computeLight(W); return W; };
const hold=(...us)=>{ for(const u of us){ u.state='idle'; u.target=null; u.goal=null; u.path=null; u.wander=99; } };
const VIAL=()=>({k:'potion',name:'오래된 약병',label:'',vial:true,heal:0.25,min:15,cap:60});
const bagOf=(n)=>Array.from({length:n},(_,i)=>({...VIAL(),uid:900+i}));
console.log('A. 기술이 뜸');
{ const W=WF([dummy('주인',10,10,0,{bag:bagOf(3)}),dummy('동료',11.2,10,0,{ov:{hp:200,atk:20}})],[dummy('적',30,10,1)]); const [a,b,e]=W.units; hold(a,b,e); ok(!(a.spec||[]).some(x=>x.k==='vial'),'처음엔 아직 (0.5초 뒤 맞춤)'); run(W,0.7);
  const sp=(a.spec||[]).find(x=>x.k==='vial'); ok(!!sp&&sp.n===3&&sp.name==='오래된 약병','가방의 약병 셋 → 특수 스킬 "오래된 약병" (남은 '+(sp&&sp.n)+')'); ok(!(b.spec||[]).some(x=>x.k==='vial'),'약병이 없는 동료에겐 안 뜸');
  ok(E.DEFAULT_RULES.spec.vial&&E.SUP_K.includes('vial'),'수치표 spec.vial · SUP_K 에 있음 (rng '+E.DEFAULT_RULES.spec.vial.rng+')'); }
console.log('B. 동료에게 먹임');
{ const W=WF([dummy('주인',10,10,0,{bag:bagOf(3)}),dummy('동료',11.2,10,0,{ov:{hp:200,atk:20}})],[dummy('적',30,10,1)]); const [a,b,e]=W.units; hold(a,b,e); run(W,0.7); b.hp=40; a.order={k:'spec',s:'vial',b:b.i}; run(W,2.0);
  ok(Math.abs(b.hp-90)<=1.5,'동료 체력 40 → '+Math.round(b.hp)+' (최대 200 의 25% = 50 · 상한 60 이하)'); ok(a.bag.filter(x=>x.vial).length===2&&(a.spec.find(x=>x.k==='vial')||{}).n===2,'약병 하나 씀 → 남은 2 (스킬 n '+((a.spec.find(x=>x.k==='vial')||{}).n)+')');
  ok(logK(W,'vial').length===1&&logK(W,'vial')[0].a===a.i&&logK(W,'vial')[0].b===b.i,'로그 vial 한 줄'); ok(!a.order,'명령이 끝나 비워짐'); }
{ const W=WF([dummy('주인',10,10,0,{bag:bagOf(1),ov:{hp:400,atk:20}}),dummy('먼 동료',16,10,0,{ov:{hp:200,atk:20}})],[dummy('적',35,10,1)]); const [a,b,e]=W.units; hold(a,b,e); run(W,0.7); b.hp=10; const ax0=a.x; a.order={k:'spec',s:'vial',b:b.i}; run(W,4.0);
  ok(a.x>ax0+2&&b.hp>=10+49&&b.hp<=10+51,'멀면 다가가서 먹임 (동료 10 → '+Math.round(b.hp)+' · 주인이 '+(a.x-ax0).toFixed(1)+'칸 감)'); }
console.log('C. 자기에게 · 상한 · 다 쓰면');
{ const W=WF([dummy('주인',10,10,0,{bag:bagOf(2),ov:{hp:1000,atk:20}})],[dummy('적',35,10,1)]); const [a,e]=W.units; hold(a,e); run(W,0.7); a.hp=100; a.order={k:'spec',s:'vial',b:a.i}; run(W,2.0);
  ok(Math.abs(a.hp-160)<=1.5,'자기에게: 체력 100 → '+Math.round(a.hp)+' (최대 1000 의 25% = 250 이지만 상한 60)'); a.hp=100; const sp0=a.spec.find(x=>x.k==='vial'); sp0.cdT=-9; a.order={k:'spec',s:'vial',b:a.i}; run(W,2.0);
  ok(a.bag.filter(x=>x.vial).length===0,'두 번 먹이면 약병이 없음'); run(W,0.8); ok(!(a.spec||[]).some(x=>x.k==='vial'),'다 쓰면 기술도 사라짐'); }
{ const W=WF([dummy('주인',10,10,0,{bag:bagOf(1),ov:{hp:100,atk:20}})],[dummy('적',35,10,1)]); const [a,e]=W.units; hold(a,e); run(W,0.7); a.hp=a.max-3; a.order={k:'spec',s:'vial',b:a.i}; run(W,2.0); ok(a.hp===a.max,'거의 찬 체력은 최대까지만 (+3)'); }
console.log('D. 쓰러진 · 다른 편');
{ const W=WF([dummy('주인',10,10,0,{bag:bagOf(1)}),dummy('쓰러진 동료',11,10,0)],[dummy('적',35,10,1)]); const [a,b,e]=W.units; hold(a,b,e); run(W,0.7); b.hp=0; E.applyDmg(W,e,b,999,{tag:'시험'}); a.order={k:'spec',s:'vial',b:b.i}; run(W,2.0); ok(a.bag.filter(x=>x.vial).length===1,'숨이 끊어진 동료에게는 안 씀 (약병 그대로)'); }
console.log('E. 일반 회복약은 해당 없음');
{ const W=WF([dummy('주인',10,10,0,{bag:[{k:'potion',name:'회복약',label:'',uid:700}]})],[dummy('적',35,10,1)]); const [a,e]=W.units; hold(a,e); run(W,0.7); ok(!(a.spec||[]).some(x=>x.k==='vial'),'보통 회복약 (회복약) 은 이 기술이 아님 — 마시기 단추로'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
