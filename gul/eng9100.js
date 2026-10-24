// v9.6.5 엔진 시험 — eng9100.js v1.2 (v1.2: 전우조 포위 · 함께 물러남 · 몰린 전우 구원 · 개인 본능 양쪽 (총구 피하기 · 망치 · 비켜섬) · v1.1: 전우조는 한 몸처럼 — 1 ~ 1.5칸 · 짝이 움직이면 연동 · 멈추면 같이 멈춤 · v1.0: 전우조 · 부하는 3칸 넘게 떨어지지 않음 · 짝이 돌격하면 대상의 옆구리로 질주 · 맞붙은 몸은 그대로 · 적 편도 같은 규칙 · 서둘러 줍기)
const {E,R,U,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const dummy=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,seed)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='hold'; R2.roe.autoLift=false; R2.chgPol={allyOff:false}; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

for (const side of [0,1]){
  console.log('A. 전우조는 1 ~ 1.5칸 — '+(side?'적 편':'우리 편'));
  const W=WF([dummy('갑',10,10,side,{cg:'p'}),dummy('을',17,10,side,{cg:'p'}),dummy('먼 이',36,18,1-side)]); const a=W.units[0], b=W.units[1]; b.order={k:'hold'};
  const d0=d(a,b); step(W,90); ok(d(a,b)<=1.55&&d(a,b)>=0.8,'처음 '+d0.toFixed(1)+'칸 → 3초 뒤 '+d(a,b).toFixed(1)+'칸'); ok(W.log.some(l=>l.k==='pairGo'&&l.a===a.i&&l.how==='keep'),'로그: 짝 곁으로'); }

console.log('A2. 짝이 움직이면 연동돼 따라감 · 멈추면 같이 멈춤');
for (const side of [0,1]){ const W=WF([dummy('갑',10,10,side,{cg:'p'}),dummy('을',10,11.1,side,{cg:'p'}),dummy('먼 이',38,2,1-side)]); const a=W.units[0], b=W.units[1]; a.order={k:'move',x:24,y:14};
  let mx=0; for(let i=0;i<240;i++){ E.stepWorld(W,1/30); if(i>30) mx=Math.max(mx,d(a,b)); } const bx=b.x, by=b.y; step(W,30);
  console.log('    '+(side?'적':'우리')+': 가는 동안 가장 멀 때 '+mx.toFixed(2)+'칸 · 도착 뒤 '+d(a,b).toFixed(2)+'칸 · 멈춘 뒤 1초 움직임 '+Math.hypot(b.x-bx,b.y-by).toFixed(2));
  ok(mx<=1.9,(side?'적 편':'우리 편')+' — 가는 동안 줄곧 붙어 감 (가장 멀 때 '+mx.toFixed(2)+'칸)'); ok(d(a,b)<=1.55,'도착하면 1.5칸 안'); ok(Math.hypot(b.x-bx,b.y-by)<0.4,'짝이 멈추면 같이 멈춤 (맴돌지 않음)'); }

console.log('B. 짝이 돌격하면 대상의 옆구리로 질주');
{ let ok1=0, run=0, side=0, n=0; for (let sd=1; sd<=8; sd++){ const W=WF([dummy('돌격',10,10,0,{cg:'p'}),dummy('짝',10,12.2,0,{cg:'p'}),dummy('적',16,10,1)],sd); const a=W.units[0], m=W.units[1], t=W.units[2]; t.order={k:'hold'}; t.seenBy=1; t.ev=0.0001;
    E.startCharge(W,a,t,null); let r=false; for(let i=0;i<75;i++){ step(W); if(m.mv&&m.mv.run&&W.t<m.mv.until) r=true; } n++;
    if(W.log.some(l=>l.k==='pairGo'&&l.a===m.i&&l.how==='flank'&&l.tg===t.i)) ok1++; if(r) run++;
    const am=Math.atan2(m.y-t.y,m.x-t.x), aa=Math.atan2(a.y-t.y,a.x-t.x), df=Math.abs(Math.atan2(Math.sin(am-aa),Math.cos(am-aa))); if(df>0.8&&Math.hypot(m.x-t.x,m.y-t.y)<2.6) side++; }
  console.log('    8판: 옆구리로 '+ok1+' · 질주 '+run+' · 2.5초 뒤 대상 옆 (짝과 45° 넘게 벌어짐) '+side);
  ok(ok1>=7&&run>=7,'짝의 돌격 → 대상 옆구리로 질주'); ok(side>=6,'대상의 옆에 자리 잡음'); }

console.log('C. 맞붙어 싸우는 중이면 그 자리');
{ const W=WF([dummy('갑',10,10,0,{cg:'p'}),dummy('을',18,10,0,{cg:'p'}),dummy('적',10.9,10,1)]); const a=W.units[0], b=W.units[1], e=W.units[2]; b.order={k:'hold'}; e.seenBy=1;
  step(W,60); ok(d(a,e)<2&&!W.log.some(l=>l.k==='pairGo'&&l.a===a.i),'붙은 적을 두고 짝에게 가지 않음 (적과 '+d(a,e).toFixed(1)+'칸)'); }

console.log('D. 대장-부하: 부하만 대장을 따라감');
{ const W=WF([dummy('대장',10,10,0),dummy('부하',17,10,0),dummy('먼 이',36,18,1)]); const c=W.units[0], f=W.units[1]; f.sqLead=c.i; f.chiefLk=true; c.order={k:'hold'};
  step(W,90); ok(d(c,f)<=3.3,'부하가 대장 곁으로 ('+d(c,f).toFixed(1)+'칸)'); ok(Math.abs(c.x-10)<0.6,'대장은 부하에게 끌려가지 않음'); }

console.log('E. 두 번 눌러 서둘러 줍기');
{ const t=[]; for (const hurry of [false,true]){ const W=WF([dummy('줍는 이',10,10,0),dummy('먼 이',36,18,1)]); const u=W.units[0]; const it={ id: 99, k:'weapon', name:'장검', x:16, y:10, owner:null, t:0 }; W.items.push(it);
    u.weapon='맨손'; u.weaponNow='맨손'; u.order={k:'pick',id:99,...(hurry?{hurry:true}:{})}; let k=0; while(k++<300&&W.items.includes(it)) step(W); t.push(k/30); }
  console.log('    걸어서 '+t[0].toFixed(2)+'초 · 서둘러 '+t[1].toFixed(2)+'초'); ok(t[1]<t[0]*0.85,'서둘러가 더 빨리 주움'); }

console.log('F. 전우가 붙든 적 — 반대쪽으로 돌아 포위');
for (const side of [0,1]){ let ok1=0, pos=0; for (let sd=1; sd<=6; sd++){ const W=WF([dummy('붙든 이',10,10,side,{cg:'p'}),dummy('짝',9,11.1,side,{cg:'p'}),dummy('적',11.0,10,1-side,{ov:{hp:9e4,atk:1}})],sd); const a=W.units[0], m=W.units[1], t=W.units[2];
    t.order={k:'hold'}; t.seenBy=1; a.target=t; a.state='fight'; a.order=null; const R0=W.rules; let best=0; for(let i=0;i<75;i++){ a.target=t; step(W); const am=Math.atan2(m.y-t.y,m.x-t.x), aa=Math.atan2(a.y-t.y,a.x-t.x); if (Math.hypot(m.x-t.x,m.y-t.y)<1.8) best=Math.max(best,Math.abs(Math.atan2(Math.sin(am-aa),Math.cos(am-aa)))); }
    if (W.log.some(l=>l.k==='pairGo'&&l.a===m.i&&l.how==='pincer')) ok1++; if (best>1.4) pos++; }
  console.log('    '+(side?'적':'우리')+' 6판: 포위 '+ok1+' · 붙은 채 짝과 80° 넘게 벌어져 섬 (적이 피해 움직여도 한 번이라도) '+pos); ok(ok1>=5&&pos>=4,(side?'적 편':'우리 편')+' — 짝이 붙든 적의 반대 옆 · 뒤로'); }

console.log('G. 짝이 물러나면 적을 보며 함께 물러남');
{ const W=WF([dummy('갑',12,10,0,{cg:'p'}),dummy('을',12,11.1,0,{cg:'p'}),dummy('적',16,10.5,1,{ov:{hp:9e4,atk:1}})]); const a=W.units[0], b=W.units[1], e=W.units[2]; e.order={k:'hold'}; e.seenBy=1; b.canGuard=true;
  a.order={k:'move',x:4,y:10}; let face=0, n=0, guard=0; for(let i=0;i<60;i++){ step(W); if(i>15){ n++; if(Math.cos((b.face||0)-Math.atan2(e.y-b.y,e.x-b.x))>0.5) face++; if(b.raised) guard++; } }
  console.log('    물러나는 동안 적을 본 틱 '+face+'/'+n+' · 방패 든 틱 '+guard+' · 짝과 '+d(a,b).toFixed(2)+'칸');
  ok(W.log.some(l=>l.k==='pairGo'&&l.a===b.i&&l.how==='retreat'),'로그: 함께 물러남'); ok(face>=n*0.6,'적을 마주 본 채 물러남'); ok(d(a,b)<=2.0,'짝 곁 그대로 (적을 보며 뒷걸음이라 조금 처짐 · 2칸 안)'); }

console.log('H. 둘에게 몰린 전우를 구하러 감');
{ const W=WF([dummy('몰린 이',12,10,0,{cg:'p'}),dummy('짝',6,10,0,{cg:'p'}),dummy('적1',13,10,1),dummy('적2',12,11,1)]); const a=W.units[0], m=W.units[1], e1=W.units[2], e2=W.units[3]; a.order={k:'hold'};
  for (const e of [e1,e2]){ e.seenBy=1; e.target=a; e.state='fight'; } step(W,20); ok(W.log.some(l=>l.k==='mateRescue'&&l.a===m.i),'체력이 넉넉해도 둘에게 몰린 전우를 구하러 감'); }

console.log('I. 개인 본능은 양쪽 편 — 총구 피하기 · 망치');
{ let jk=[0,0]; for (const side of [0,1]){ for (let sd=1; sd<=6; sd++){ const W=WF([dummy('표적',10,10,side),mk({...REB,name:'사수',weapon:'단궁',shield:false,ov:{hp:900,atk:5},traits:['사격B'],gear:{}},1-side,17,10)],sd); const u=W.units[0], g=W.units[1]; g.order=side===1?{k:'attack',b:u.i}:{k:'hold'}; g.seenBy=1; u.seenBy=1; 
    step(W,120); if (W.log.some(l=>l.k==='mvr'&&l.m==='jink'&&l.a===u.i)) jk[side]++; } }
  console.log('    총구 피하기: 우리 '+jk[0]+'/6 · 적 '+jk[1]+'/6'); ok(jk[0]>=4,'총구 피하기 — 우리 편도 함 (예전엔 적만 · 적은 이 판에선 바로 돌격해 들어가 피할 틈이 없음)'); }
{ const W=WF([dummy('모루',10,10,0),dummy('적 모루',11,10,1,{role:'전선'}),dummy('적 망치',13,13,1,{role:'공격수'})]); const a=W.units[0], f=W.units[1], h=W.units[2]; a.seenBy=1; f.seenBy=1; h.seenBy=1; f.target=a; a.target=f; a.order={k:'hold'};
  step(W,90); ok(!!(W.log.some(l=>l.k==='hm'&&l.a===h.i&&l.r==='hammer')||dist2side(a,f,h)),'적 편도 망치 — 붙들린 우리의 옆 · 뒤로'); }
function dist2side(a,f,h){ const af=Math.atan2(f.y-a.y,f.x-a.x), ah=Math.atan2(h.y-a.y,h.x-a.x); return Math.abs(Math.atan2(Math.sin(ah-af),Math.cos(ah-af)))>1.2 && Math.hypot(h.x-a.x,h.y-a.y)<2.2; }

console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
