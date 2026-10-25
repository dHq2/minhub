// v9.7.2 엔진 시험 — eng9720.js v1.0 (리모델 P1b 1단계: A18 버팀은 닿은 몸만 · 돌격 방어 본능 (양쪽 편) — 곁의 동료 뒤에 붙어 받침 · 덜 밀림 · 뭉침 명령 — 어깨를 붙여 섬)
const {E,R,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:true,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,seed)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='hold'; R2.roe.autoLift=false; R2.chgPol={allyOff:false}; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>{ u.seenBy=1; }); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

console.log('A18. 앞줄 셋 — 느슨하면 (0.6칸 틈) 무게가 안 옴 · 붙으면 옴');
{ const res=[]; for (const g of [0.6,0.02]){ const W=WF([sw('가운데',10,10,0),sw('왼',10,10,0),sw('오른',10,10,0),sw('적',14,10,1)]); const [c,l,r,e]=W.units; const sp=c.r+l.r+g; l.y=10-sp; r.y=10+sp;
    const b=E.braceOf(W,c,e,-1,0); res.push(b.mass/(c.mass*(c.poise||1))); console.log('    틈 '+g+'칸: 버팀 ×'+res[res.length-1].toFixed(2)+' (받친 몸 '+b.ids.length+')'); }
  ok(res[0]<1.05,'느슨한 앞줄은 이웃 무게가 더해지지 않음'); ok(res[1]>1.3,'어깨를 붙이면 옆 무게가 더해짐'); }

console.log('B. 돌격 방어 본능 — 곁의 동료 뒤에 붙어 받침 (양쪽 편)');
for (const side of [0,1]){ const kb=[], br=[]; for (const help of [false,true]) for (let sd=1; sd<=4; sd++){
    const units=[sw('받는 이',10,10,side),mk({...REB,name:'돌격자',shield:true,weapon:'장검',ov:{hp:9e4,atk:5},traits:[],gear:{},weight:140},1-side,16,10)]; if (help) units.push(sw('곁',10.2,11.4,side));
    const W=WF(units,sd); const [t,e,h]=W.units; t.order={k:'hold'}; if(h) h.order={k:'hold'}; e.order=null; const x0=t.x; E.startCharge(W,e,t,null);
    let braced=0; for(let i=0;i<60;i++){ step(W); if(h&&h.why==='BRACE_CHARGE') braced++; } kb.push({help, mv:Math.abs(t.x-x0)}); if(h) br.push({braced, log:W.log.some(l=>l.k==='cbrace'&&l.a===h.i), gap:d(h,t)-h.r-t.r}); }
  const m0=kb.filter(k=>!k.help).reduce((s,k)=>s+k.mv,0)/4, m1=kb.filter(k=>k.help).reduce((s,k)=>s+k.mv,0)/4;
  console.log('    '+(side?'적':'우리')+': 혼자 밀린 거리 '+m0.toFixed(2)+' · 곁이 받칠 때 '+m1.toFixed(2)+' · 받친 틱 '+br.map(b=>b.braced).join(',')+' · 로그 '+br.filter(b=>b.log).length+'/4');
  ok(br.filter(b=>b.log&&b.braced>0).length>=3,(side?'적 편':'우리 편')+' — 곁의 동료가 돌격을 보고 뒤를 받침'); ok(m1<=m0+0.01,'받쳐 주면 덜 밀림 (또는 같음)'); }

console.log('C. 뭉침 명령 — 어깨를 붙여 적 쪽으로');
{ const W=WF([sw('1',8,6,0),sw('2',8,9,0),sw('3',8,12,0),sw('4',6,9,0),mk({...REB,name:'궁',weapon:'단궁',shield:false,ov:{hp:9e4,atk:5},traits:[],gear:{}},0,5,9),sw('적',20,9,1)]); const A=W.units.slice(0,5), e=W.units[5]; e.order={k:'hold'};
  const cx=A.reduce((s,u)=>s+u.x,0)/5, cy=A.reduce((s,u)=>s+u.y,0)/5; A.forEach((u,j)=>{ u.order={k:'clump',g:1,j,x:cx,y:cy,f:Math.atan2(e.y-cy,e.x-cx)}; });
  step(W,150); const M=A.slice(0,4).sort((a,b)=>a.y-b.y); const gaps=M.slice(1).map((u,i)=>d(u,M[i])-u.r-M[i].r);
  console.log('    앞줄 틈 '+gaps.map(g=>g.toFixed(2)).join(' · ')+' · 사수 x '+A[4].x.toFixed(2)+' (앞줄 x '+M.map(u=>u.x.toFixed(2)).join(',')+') · 막기 '+A.filter(u=>u.raised).length+' · why '+A.map(u=>u.why).join(','));
  ok(gaps.every(g=>g<0.15),'앞줄이 어깨를 붙임 (틈 0.15칸 아래)'); ok(A[4].x<Math.min(...M.map(u=>u.x))-0.3,'사수는 뒷줄'); ok(A.slice(0,4).every(u=>u.raised),'근접은 막기를 듦'); ok(A.every(u=>u.why==='CLUMP'),'이유: 뭉침');
  const b=E.braceOf(W,M[1],e,-1,0); console.log('    뭉친 앞줄 가운데 버팀 ×'+(b.mass/(M[1].mass*(M[1].poise||1))).toFixed(2)); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
