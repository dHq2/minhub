// v9.6.4 엔진 시험 — eng9100.js v1.0 (전우조 · 부하는 3칸 넘게 떨어지지 않음 · 짝이 돌격하면 대상의 옆구리로 질주 · 맞붙은 몸은 그대로 · 적 편도 같은 규칙 · 서둘러 줍기)
const {E,R,U,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const dummy=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,seed)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='hold'; R2.roe.autoLift=false; R2.chgPol={allyOff:false}; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

for (const side of [0,1]){
  console.log('A. 3칸 넘게 떨어지지 않음 — '+(side?'적 편':'우리 편'));
  const W=WF([dummy('갑',10,10,side,{cg:'p'}),dummy('을',17,10,side,{cg:'p'}),dummy('먼 이',36,18,1-side)]); const a=W.units[0], b=W.units[1]; b.order={k:'hold'};
  const d0=d(a,b); step(W,90); ok(d(a,b)<=3.3,'처음 '+d0.toFixed(1)+'칸 → 3초 뒤 '+d(a,b).toFixed(1)+'칸'); ok(W.log.some(l=>l.k==='pairGo'&&l.a===a.i&&l.how==='keep'),'로그: 짝 곁으로'); }

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

console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
