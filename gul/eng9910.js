// v9.9.1 엔진 시험 — eng9910.js v1.1 (v1.1: v9.9.9 옛 보호 (뛰어들기) 시험 뺌 — 보호받을이는 eng9990 · v1.0: 추종: 대장 등 뒤에 비비듯 · 대장이 싸우면 닿는 부하는 같이 침 · 발 빠른 부하는 상대 등 뒤로 · 치유는 한 걸음 뒤 / 보호: 대상이 노려지면 사이로 / 지휘: 대장을 거치면 더 빠름 · 양쪽 편)
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:10},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,sd)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,sd||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>u.seenBy=1); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y), gp=(a,b)=>d(a,b)-a.r-b.r;
for (const side of [0,1]){
  console.log('A. 추종 — 대장 등 뒤 ('+(side?'적':'우리')+')');
  { const W=WF([sw('대장',10,10,side),sw('부하',15,12,side),sw('먼 적',38,2,1-side)]); const [c,f]=W.units; f.sqLead=c.i; f.chiefLk=true; f.sqFix=true; c.order={k:'move',x:20,y:8}; if(side) { c.order=null; c.home={x:20,y:8}; c.state='return'; }
    let mx=0; for(let i=0;i<240;i++){ step(W); if(i>90) mx=Math.max(mx,gp(c,f)); } console.log('    따라가는 동안 몸 사이 최대 '+mx.toFixed(2)+'칸 · 끝 '+gp(c,f).toFixed(2));
    ok(gp(c,f)<0.7,'멈추면 등 뒤에 붙음 (몸 사이 0.7칸 안 — 적 대장은 집 둘레를 서성임)'); }
  console.log('B. 대장이 싸우면');
  { const W=WF([sw('대장',10,10,side,{ov:{hp:9e4,atk:1}}),sw('창 부하',9,10,side,{weapon:'창'}),sw('빠른 부하',9,11,side,{role:'공격수'}),sw('적',11.2,10,1-side,{ov:{hp:9e4,atk:1}})]); const [c,s,q,e]=W.units; for(const f of [s,q]){ f.sqLead=c.i; f.chiefLk=true; f.sqFix=true; } c.target=e; c.state='fight'; e.order={k:'hold'}; e.spd=0.001;
    let spHit=false, rear=0; for(let i=0;i<150;i++){ c.target=e; c.state='fight'; step(W); if(W.log.some(l=>l.k==='hit'&&l.a===s.i&&l.b===e.i)) spHit=true; const ac=Math.atan2(c.y-e.y,c.x-e.x), aq=Math.atan2(q.y-e.y,q.x-e.x); if(Math.abs(Math.atan2(Math.sin(aq-ac),Math.cos(aq-ac)))>1.4&&gp(q,e)<0.9) rear++; }
    ok(spHit,'창 부하가 대장 뒤에서 같이 침'); ok(rear>10,'발 빠른 부하는 상대 등 뒤로 ('+rear+'틱)'); }
  /* v9.9.9 옛 '보호' (대상이 노려지면 뛰어들기) 는 없앰 — 보호는 대장 관계의 종류 (보호받을이) 로 eng9990 에서 */
}
console.log('D. 지휘 — 대장을 거침');
{ const W=WF([sw('지휘관',5,10,0,{cmd:2}),sw('대장',9,10,0),sw('부하',16,10,0),sw('먼 적',38,2,1)]); const [C,c,f]=W.units; const a=E.cmdLink(W,C,f); f.sqLead=c.i; f.chiefLk=true; const b=E.cmdLink(W,C,f); console.log('    대장 없이 '+a.p.toFixed(2)+'/'+a.t.toFixed(2)+'초 · 대장을 거쳐 '+b.p.toFixed(2)+'/'+b.t.toFixed(2)+'초 '+(b.why||''));
  ok(b.p>=a.p&&(b.p>a.p+0.01||b.t<a.t),'대장을 거치면 더 확실하거나 빠름'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
