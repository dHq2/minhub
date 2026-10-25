// v9.7.1 엔진 시험 — eng9710.js v1.0 (리모델 P1a 1단계: 행동 이유 코드 · 전우조 따라붙기는 맞붙은 싸움 · 전열 버팀 다음 · 같이 물러남은 그대로 · 휘두르기 제 편 조심은 양쪽 같음)
const {E,R,REB,KAR,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,seed)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; R2.chgPol={allyOff:false}; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>{ u.seenBy=1; }); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

console.log('A. 이유 코드가 남음');
{ const W=WF([sw('갑',10,10,0),sw('을',12,10,1)]); step(W,60); const k=Object.keys(W.whyN||{});
  console.log('    '+JSON.stringify(W.whyN)); ok(k.length>=2&&k.some(x=>/FIGHT|HUNT/.test(x)),'싸움 이유 코드'); ok(W.units.every(u=>!u.alive||u.why!==undefined),'저마다 why 를 가짐'); }

console.log('B. 짝이 옆으로 떠나도 팔 닿는 적과 맞서면 그 자리 (양쪽 편 · 적에게서 물러나는 짝은 함께 물러남 — eng9100 G)');
for (const side of [0,1]){ let stay=0, n=0; for (let sd=1; sd<=6; sd++){ const W=WF([sw('떠나는 짝',10,10,side,{cg:'p'}),sw('맞선 이',10,11.1,side,{cg:'p',ov:{hp:9e4,atk:5}}),sw('적',10,12.4,1-side,{ov:{hp:9e4,atk:5}})],sd);
    const a=W.units[0], b=W.units[1], e=W.units[2]; a.order={k:'move',x:22,y:10}; if (side===1){ a.order=null; a.mv=null; }
    let link=0; for(let i=0;i<90;i++){ if(side===1){ a.vx=2; a.vy=0; a.x+=2/30; a.state='idle'; a.target=null; } step(W); if(b.why==='PAIR_LINK'||b.why==='PAIR_KEEP') link++; } n++; if (link<10 && (d(b,e)<2.2 || b.why==='PAIR_RETREAT')) stay++;   /* 피한 뒤 짝이 적에게서 멀어지면 함께 물러남도 맞음 */ else if (process.env.DBG) console.log('      seed',sd,'link',link,'d',d(b,e).toFixed(2),b.why,W.log.filter(l=>l.a===b.i&&['kb','fling','dodge','backstep'].includes(l.k)).map(l=>l.k).join(',')); }
  console.log('    '+(side?'적':'우리')+': 적과 맞선 채 남음 '+stay+'/'+n); ok(stay>=5,(side?'적 편':'우리 편')+' — 맞선 적을 두고 짝을 따라가지 않음'); }

console.log('C. 적이 없으면 그대로 붙어 감');
{ const W=WF([sw('갑',10,10,0,{cg:'p'}),sw('을',10,11.1,0,{cg:'p'}),sw('먼 적',38,2,1)]); const a=W.units[0], b=W.units[1]; a.order={k:'move',x:22,y:12}; let mx=0; for(let i=0;i<200;i++){ step(W); if(i>30) mx=Math.max(mx,d(a,b)); }
  ok(mx<=1.9,'붙어 감 (가장 멀 때 '+mx.toFixed(2)+'칸)'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
