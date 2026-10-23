// v8.8.2 엔진 시험 — eng8820.js v1.0 (옐로: 연속 도약 (v8.8.4 스택제로 시험 바뀜) · 돌진 (사족보행 · 5칸 넘게 달리면 확정 밀침) · 달라붙기 난도질 · 양동이 뿌리기 (저주:맥아 장판) · 날붙이 손 절삭력 · 단단한 손)
const {E,R,U,DES,GOB,INJ,NOR,KAR,REB,KIT,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec)=>{ const end=W.t+sec; while(W.t<end&&!W.over) E.stepWorld(W,1/30); };
const YEL={ref:'C-008',name:'옐로',tier:2,cls:'기동',role:'미드필더',weapon:'맨손',height:1.55,weight:52,nv:true,nvG:'B',ov:{hp:110,atk:26},traits:['의학B','은신B','사족보행','속력A','근력B','괴력B','제약:총포류','제약:활'],unique:['저주:맥아'],bladeHands:true,active:['연속 도약','돌진','달라붙기 난도질','양동이 뿌리기'],leapN:2,skill:{name:'양동이 약',pool:500,per:120,wind:0.5,rec:0.4,rng:0.8,regen:4}};
const FOE=(o)=>mk({...DES['창병'],ov:{hp:9999,atk:5},traits:[],gear:{}},1,0,0,{spdMul:0,...(o||{})});
const WD2=(foes,ex)=>{ const W=WD(foes,ex); W.units.forEach(u=>{ if(u.side===1){ u.canCharge=false; u.canLeap=false; } }); return W; };
const WD=(foes,ex)=>{ const R2=JSON.parse(JSON.stringify(R)); const y=mk(YEL,0,10,10,ex||{}); const W=E.createWorld({type:'grid',W:60,H:20,seed:7,units:[y,...foes],torches:[{x:20,y:10,r:60}],flips:[],},R2,1,{headless:true}); W.units.forEach(u=>{ if(u.side===1){ u.order={k:'hold'}; } }); return W; };
console.log('A. 인물 몸');
{ const W=WD([FOE({x:30,y:10})]); const y=W.units[0];
  ok(y.leapN===2&&y.canLeap,'연속 도약 (leapN 2 · canLeap)'); ok(y.canCharge&&y.rush,'돌진 (canCharge · 사족보행 rush)'); ok(y.sharp>0&&y.hardHands,`날붙이 손 (sharp ${y.sharp} · 단단한 손)`);
  ok((y.spec||[]).map(s=>s.k).join()==='yclaw,ybucket','기술 칸: 달라붙기 난도질 · 양동이 뿌리기'); ok(R.spec&&R.spec.yclaw&&R.spec.ybucket&&R.claw&&R.claw.rush,'수치표에 새 칸'); }
console.log('B. 절삭력: 같은 갑옷이라도 옐로의 손은 덜 막힘');
{ const arm={몸:{name:'판금',mat:'판금',tier:3}}; const hit=(bh)=>{ let sum=0; for(let s=0;s<30;s++){ const R2=JSON.parse(JSON.stringify(R)); const y=mk(YEL,0,10,10,{}); const f0=mk({...DES['창병'],ov:{hp:9999,atk:5},traits:[],gear:arm},1,10.6,10,{spdMul:0}); const W=E.createWorld({type:'grid',W:30,H:16,seed:s+1,units:[y,f0],torches:[],flips:[]},R2,s+1,{headless:true}); const f=W.units[1]; if(!bh) W.units[0].sharp=0; W.units[0].order={k:'attack',b:1}; f.order={k:'hold'}; const h0=f.hp; run(W,2.5); sum+=h0-f.hp; } return sum; };
  const a=hit(true), b=hit(false); console.log('    판금 상대 2.5초 피해 합 (30판) 절삭력 있음:',Math.round(a),' 없음:',Math.round(b)); ok(a>b*1.04,'절삭력이 있으면 판금 상대 피해가 더 큼'); }
console.log('C. 돌진: 5칸 넘게 달리면 확정 밀침 + 키하핫 (상대가 옆으로 흘리는 판은 빼고 여러 판)');
{ const trial=(dist,seed,def,ex)=>{ const y=mk(YEL,0,10,10,{}); const f0=mk(def||{...DES['창병'],ov:{hp:9999,atk:5},traits:[],gear:{}},1,10+dist,10,{spdMul:0,...(ex||{})}); const W=E.createWorld({type:'grid',W:60,H:20,seed:seed,units:[y,f0],torches:[{x:20,y:10,r:60}],flips:[]},JSON.parse(JSON.stringify(R)),seed,{headless:true}); const f=W.units[1]; f.order={k:'hold'}; f.canCharge=false; f.canLeap=false; W.fxOn=true; W.fx=[]; W.units[0].order={k:'charge',b:1}; let sayN=0; { const end=W.t+3; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); sayN+=(W.fx||[]).filter(q=>q.k==='say'&&q.s==='키하핫!!'&&q.t0>=W.t-0.1).length; } }
    const imp=W.log.find(l=>l.k==='impact'&&l.a===0), rh=W.log.filter(l=>l.k==='rushHit'), sh=W.log.filter(l=>l.k==='shove'&&l.how==='rush'); return { imp:!!imp, held:!!(imp&&imp.held), run:imp?imp.run:0, rush:rh.length, len:sh.length?sh[0].len:0, say:sayN>0, hp:W.units[1].hp, dmg:W.log.filter(l=>l.k==='hit'&&l.a===0&&/돌진/.test(l.tag||'')).reduce((s,l)=>s+l.dmg,0) }; };
  const agg=(dist,def,ex)=>{ const r=[]; for(let s=1;s<=30;s++){ const q=trial(dist,s,def,ex); if(q.imp) r.push(q); } return r; };
  const CLUB={...DES['곤봉적'],ov:{hp:9999,atk:5},traits:[],gear:{}}; const far=agg(8,CLUB), near=agg(3.2,CLUB), big=agg(8,CLUB,{sizeCls:'대형'}), mid=agg(8,CLUB,{sizeCls:'중대형'});
  const avg=(a,k)=>a.reduce((s,q)=>s+q[k],0)/Math.max(1,a.length);
  console.log('    8칸: 부딪힌',far.length,'판 · 밀침 평균',avg(far,'len').toFixed(2),'칸 · 키하핫',far.filter(q=>q.rush).length,'  3.2칸:',near.length,'판 · 밀침 평균',avg(near,'len').toFixed(2),'칸 · 키하핫',near.filter(q=>q.rush).length,'  중대형 8칸:',avg(mid,'len').toFixed(2),'  대형 8칸:',avg(big,'len').toFixed(2));
  const cut=(a,f)=>a.filter(f); console.log('    상세(먼 돌진):',far.map(q=>(q.held?'H':'-')+q.len+'/'+q.run).join(' '));
  ok(far.length>=4&&far.every(q=>q.run>=4.9),'멀리서 달려 부딪힘 (달린 거리 5칸 안팎 이상)'); ok(far.every(q=>q.rush===1),'5칸 넘게 달리면 매번 키하핫'); ok(cut(far,q=>!q.held).length>=far.length*0.7,'멀리서 달려오면 상대가 태세를 갖출 틈이 없음 (대부분 못 받음)'); ok(cut(far,q=>!q.held).every(q=>q.len>=3),'받지 못한 상대는 3칸 이상 확정 밀침'); ok(cut(far,q=>q.held).every(q=>q.len>=1.2),'태세로 받아도 1칸 넘게 밀림');
  ok(cut(mid,q=>!q.held).length>=2&&cut(mid,q=>!q.held).every(q=>q.len>=3),'중대형까지 3칸 이상'); ok(cut(big,q=>!q.held).length>=2&&cut(big,q=>!q.held).every(q=>q.len>0.5&&q.len<=1.6),'대형은 1칸쯤');
  ok(near.length>=2&&near.every(q=>q.rush===0),'가까우면 키하핫 없음 (그냥저냥 빠르고 강한 돌격)'); ok(far.some(q=>q.say),'특별 말풍선 키하핫!! (fx say)');
  const hpF=avg(cut(far,q=>!q.held),'dmg'), hpN=avg(near,'dmg'); console.log('    돌진 한 방 피해: 먼 돌진',hpF.toFixed(0),' 가까운 돌진',hpN.toFixed(0)); ok(hpF>hpN*1.5,'먼 돌진이 피해도 큼');
  const W=WD2([FOE({x:18,y:10})]); const y=W.units[0]; y.order={k:'charge',b:1}; const sp=[]; let px=y.x; for(let i=0;i<150&&!W.over;i++){ E.stepWorld(W,1/30); if(y.act&&y.act.k==='charge'&&y.act.phase==='run'){ sp.push(Math.hypot(y.x-px,0)*30); } px=y.x; }
  if(sp.length>6){ const a=sp.slice(0,3).reduce((s,v)=>s+v,0)/3, b=sp.slice(-3).reduce((s,v)=>s+v,0)/3; console.log('    걸음 처음',a.toFixed(1),'→ 끝',b.toFixed(1)); ok(b>a*2.2,'처음엔 살짝 느리게, 끝에서 엄청 빨라짐'); } else ok(false,'돌진 달림이 기록되지 않음'); }
console.log('D. 태세로 받아도 밀림 (넘어지진 않음)');
{ const res=[]; for(let s=1;s<=40;s++){ const q=trial2(s); if(q) res.push(q); }
  function trial2(s){ const y=mk(YEL,0,10,10,{}); const f0=mk({...DES['검방패기사']},1,18,10,{spdMul:0}); const W=E.createWorld({type:'grid',W:60,H:20,seed:s,units:[y,f0],torches:[{x:20,y:10,r:60}],flips:[]},JSON.parse(JSON.stringify(R)),s,{headless:true}); const f=W.units[1]; f.order={k:'hold'}; f.canCharge=false; f.canLeap=false; W.units[0].order={k:'charge',b:1}; run(W,3); const imp=W.log.find(l=>l.k==='impact'&&l.a===0&&l.held), sh=W.log.find(l=>l.k==='shove'&&l.how==='rush'); return imp&&sh?{len:sh.len,down:W.log.some(l=>l.k==='down'&&l.b===1)}:null; }
  console.log('    검방패기사 (태세로 받음)',res.length,'판 · 밀침',res.map(q=>q.len).join(' ')); ok(res.length>=2&&res.every(q=>q.len>=1.2),'방패로 받아도 1칸 넘게 밀림'); }
console.log('E. 달라붙기 난도질');
{ const W=WD2([FOE({x:11.2,y:10})]); const f=W.units[1], y=W.units[0]; f.order={k:'hold'}; y.order={k:'spec',s:'yclaw',b:1}; const h0=f.hp; run(W,0.6); const held=f.heldBy===0; run(W,2.2); const hits=W.log.filter(l=>l.k==='hit'&&l.a===0&&/할큄/.test(l.tag||'')).length;
  console.log('    붙잡음',held,'· 할큄',hits,'번 · 피해',Math.round(h0-f.hp)); ok(held,'붙잡힘 (heldBy)'); ok(hits>=3&&hits<=5,'여러 번 할큄 (3 ~ 5타: '+hits+')'); ok(W.log.some(l=>l.k==='clawEnd'),'마무리'); ok(f.heldBy==null,'끝나면 풀려남'); }
console.log('F. 양동이 뿌리기');
{ const W=WD2([FOE({x:13,y:10})]); const f=W.units[1], y=W.units[0]; y.order={k:'spec',s:'ybucket',b:1}; const l0=y.skill.left; run(W,1.2); const P=(W.pools||[]).find(p=>p.kind==='malt');
  ok(!!P,'맥아 장판 생김'); if(P){ console.log('    장판 반지름',P.r,'지속',(P.until-P.t0).toFixed(1),'초 · 약',Math.round(l0),'→',Math.round(y.skill.left)); ok(y.skill.left<l0,'양동이 약을 씀'); ok(f.maltT!=null&&f.maltT>W.t,'<저주:맥아> 걸림'); }
  const hp1=f.hp; run(W,2); ok(f.hp<hp1,'살이 녹음 (초당 피해)'); }
{ const dur=(left)=>{ const W=WD2([FOE({x:13,y:10})]); const y=W.units[0]; y.skill.left=left; y.order={k:'spec',s:'ybucket',b:1}; run(W,1.2); const P=(W.pools||[]).find(p=>p.kind==='malt'); return P?P.until-P.t0:0; };
  const a=dur(500), b=dur(150); console.log('    지속: 가득',a.toFixed(1),'초 · 150',b.toFixed(1),'초'); ok(a>b+2,'남은 약이 많을수록 오래 감'); ok(dur(40)===0,'약이 모자라면 못 뿌림'); }
{ const W=WD2([FOE({x:13,y:10})]); const f=W.units[1], y=W.units[0]; y.order={k:'spec',s:'ybucket',b:1}; run(W,1.5); const sp0=E.spdNow?E.spdNow(W,f):null; ok(f.maltT>W.t,'장판 안 상대 느려짐 표지 (maltT)');
  const W2=WD2([FOE({x:30,y:10})]); W2.pools=[{kind:'malt',by:0,side:0,x:10,y:10,r:2,until:99,tickT:0,t0:0}]; const a1=W2.units[0]; run(W2,0.5); ok(a1.maltT==null||a1.maltT<=W2.t,'동료(옐로)는 상관없음'); }
console.log('G. 연속 도약: 붙지 못한 상대에게 스스로 두 번 뜀');
{ const W=WD2([FOE({x:13.2,y:10})]); const y=W.units[0]; y.target=W.units[1]; y.state='hunt'; run(W,1.5); const lp=W.log.filter(l=>l.k==='leap'&&l.a===0&&l.dir==='fwd'); console.log('    앞으로 도약',lp.length,'번'); const tot=lp.reduce((s,l)=>s+l.len,0); ok(lp.length>=1&&tot>=2.0,'연속 도약 (스택으로 멀리 뛰어듦 '+tot.toFixed(1)+'칸)'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
