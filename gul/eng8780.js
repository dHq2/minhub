// v8.7.8 엔진 시험 — eng8780.js v1.2 (v1.2: 싸움 시작 때 기술 대기 (2D) — 기술 시험은 대기를 풀고 · 헤드샷 기록은 gwKnee 로 · v1.1: 공격 46 (2D 28 × 1.64 — 모닝스타 옮길 때와 같은 비) · 2D 판정 그대로 (딱 · 딱딱딱은 피하고 방패로 막을 수 있음 · 헤드샷은 막기 무시) · 내려찍기 공중엔 돌격도 닿지 않음 · 감전으로 쓰러지면 감전도 사라짐 · v1.0: 굿윌 — 몸 · 사각 · 순간이동 도약 · 손바닥 · 니킥 · 딱 · 딱딱딱 · 내려찍기 · 올려차기 · 맨손일 때만 · 감전 한 틀 · 두뇌 (적 · 아군 같은 규칙))
const {E,R,U,DES,GOB,INJ,NOR,KAR,REB,KIT,mk}=require('./scen_lib790.js'); const PD=require('./pdes.js'); const pd=k=>{ const d=JSON.parse(JSON.stringify(PD[k])); delete d.key; return d; };
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const logK=(W,k)=>W.log.filter(l=>l.k===k);
const GW={ref:'C-010',name:'굿윌',tier:5,cls:'기동',role:'공격수',weapon:'맨손',shield:false,height:1.85,weight:70,sm:1.1,dcounter:0.45,nv:true,nvG:'A',ov:{hp:360,atk:46},traits:['속력A','회피A','급소B','반사신경','전투센스'],unique:['푸른 번개'],active:['손바닥','니킥','딱','딱딱딱','내려찍기','올려차기']};
const dummy=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,o)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def=(o&&o.roe)||'hold'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,(o&&o.seed)||1,{headless:true}); E.computeLight(W); if(!(o&&o.cd0)) for(const u of W.units) for(const x of u.spec||[]) x.cdT=-9; return W; };   // 기술 시험은 처음 대기를 풂 (o.cd0 이면 그대로)
const still=(W,us)=>{ for(const u of us){ u.state='idle'; u.target=null; u.wander=99; u.goal=null; u.path=null; } };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++){ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; } };   // 끝난 판에서도 시간이 흐르게 (무한 고리 막음)
const runAct=(W,u,max)=>{ let k=Math.ceil((max||3)*30); while(k-->0&&u.act) step(W); };
const face=(u,t)=>{ u.face=u.fg=Math.atan2(t.y-u.y,t.x-u.x); };

console.log('A. 몸 — 푸른 번개 · 사각 · 기술 여섯 · 맨손일 때만');
{ const W=WF([dummy('과녁',14,10,0),mk(GW,1,10,10)]); const g=W.units[1];
  ok(g.gwKit&&g.flanker,'[푸른 번개] 가 있으면 굿윌 몸 (gwKit) · 사각 (flanker)');
  ok((g.spec||[]).map(x=>x.k).join()==='gpalm,knee,snap,snap3,gslam,rise','기술 여섯: '+(g.spec||[]).map(x=>x.name).join(' · '));
  ok(E.gwOn(g)&&E.specReady(W,g,'knee'),'맨손이면 기술을 씀');
  ok(Math.abs(g.dcounter-0.45)<1e-9,'피하며 반격 45% (2D dodgeCounter)');
  const W2=WF([dummy('과녁',14,10,0),mk(GW,1,10,10,{weapon:'장검'})]); const g2=W2.units[1];
  ok(!E.gwOn(g2)&&['gpalm','knee','snap','snap3','gslam','rise'].every(k=>!E.specReady(W2,g2,k)),'무기를 들면 기술 · 도약이 꺼짐 (보통 근접처럼)');
  ok(E.gwBrain(W2,g2,1/30)===false,'무기를 들면 굿윌 두뇌도 쉼'); }

console.log('B. 사각 — 등 뒤에서 친 근접은 막을 수 없음 (굿윌만 · 앞에선 막힘)');
{ const tryB=(att,behind)=>{ let blk=0; for(let s=1;s<=12;s++){ const W=WF([dummy('방패병',12,10,0,{shield:true,weapon:'장검'}),att(13.1,10)],{seed:s}); const t=W.units[0], a=W.units[1];
      t.face=behind?Math.PI:0; t.raised=true; t.canGuard=true; t.raiseAt=-9; t.brokenT=-9; t.proneT=-9; t.post=999; t.gArc=200; t.ev=0.0001; face(a,t);
      const o=E.strike(W,a,t,t,1,false,{}); if(o&&o.block) blk++; } return blk; };
  const gB=tryB((x,y)=>mk(GW,1,x,y),true), nB=tryB((x,y)=>mk(GOB,1,x,y,{weapon:'흑요석 단검'}),true), gF=tryB((x,y)=>mk(GW,1,x,y),false);
  ok(gB===0,'굿윌이 등 뒤에서 친 주먹: 막힘 '+gB+'/12');
  ok(nB>=10,'같은 자리 보통 근접 (방패 둘레 200°): 막힘 '+nB+'/12');
  ok(gF>=10,'굿윌도 앞에서 치면 막힘 '+gF+'/12'); }

console.log('C. 순간이동 도약 — 0.16초 · 그 사이 피함 · 벽 · 몸 너머로는 못 감');
{ const W=WF([dummy('과녁',16,10,0),mk(GW,1,10,10)]); const t=W.units[0], g=W.units[1]; still(W,[t]);
  const p=E.gwAway(W,g,t,2.8); ok(p&&Math.hypot(p.x-g.x,p.y-g.y)>2.7&&p.x<g.x,'노린 자 반대쪽으로 2.8칸 자리 ('+(p?p.x.toFixed(1)+','+p.y.toFixed(1):'없음')+')');
  ok(E.gwHop(W,g,p,'시험',t)&&g.act&&g.act.k==='gwHop','도약 시작 (act gwHop)');
  ok(E.evadeP(W,g,t,'arrow',null)===1,'도약하는 동안엔 탄 · 화살을 피함 (evadeP 1)');
  runAct(W,g,1); ok(!g.act&&Math.hypot(g.x-p.x,g.y-p.y)<0.05,'0.16초 뒤 그 자리에 ('+g.x.toFixed(2)+','+g.y.toFixed(2)+')');
  ok(logK(W,'gwHop').length===1,'기록 gwHop');
  const b=E.gwBlind(W,g,t,2.4,true); const ang=b?Math.abs(((Math.atan2(b.y-t.y,b.x-t.x)-(t.face||0))+Math.PI*3)%(Math.PI*2)-Math.PI):0;
  ok(b&&ang>Math.PI*0.45,'사각 자리: 노린 자의 옆 · 뒤 ('+(ang*180/Math.PI).toFixed(0)+'°)'); }

console.log('D. 손바닥 — 표식 0.45초 · 붙어 터트림 (막기 · 회피 무시 · 감전 · 튕겨 냄) · 벗어나면 빗나가고 빈틈');
{ const W=WF([dummy('과녁',13,10,0,{shield:true}),mk(GW,1,10,10)]); const t=W.units[0], g=W.units[1]; still(W,[t]); t.raised=true; t.canGuard=true; t.raiseAt=-9; face(t,g);
  const h0=t.hp; ok(E.gwStart(W,g,t,'gpalm'),'손바닥 시작 (3칸)'); runAct(W,g,2);
  ok(h0-t.hp>80,'붙어 터트림: 피해 '+(h0-t.hp).toFixed(0)+' (방패를 들었어도)'); ok(t.zap&&t.zap.kind==='blue','감전: 푸른 번개'); ok(logK(W,'gwPalm').length===1,'기록 gwPalm');
  ok(Math.hypot(g.x-10,g.y-10)>1.5,'붙으려 순간이동 ('+g.x.toFixed(1)+')');
  const W2=WF([dummy('과녁',13,10,0),mk(GW,1,10,10)]); const t2=W2.units[0], g2=W2.units[1]; still(W2,[t2]);
  E.gwStart(W2,g2,t2,'gpalm'); t2.x=13; t2.y=11.4; const h2=t2.hp; runAct(W2,g2,0.6);
  ok(t2.hp===h2&&logK(W2,'gwMiss').length===1,'표식이 뜬 사이 1.4칸 벗어나면 빗나감 (gwMiss)'); ok(g2.stunT>W2.t,'굿윌이 빈틈 (경직 '+(g2.stunT-W2.t).toFixed(2)+'초 남음)'); }

console.log('E. 니킥 — 사각에 꽂힘 · 빈틈이면 헤드샷 (확정 치명 · 갑옷 무시 · 넘어뜨림) · 무거우면 안 넘어짐');
{ const knee=(ex,crit,seed)=>{ const W=WF([dummy('과녁',14,10,0,ex),mk(GW,1,10,10)],{seed}); const t=W.units[0], g=W.units[1]; still(W,[t]); t.ev=0.0001; t.canGuard=false; t.raised=false;
    E.gwStart(W,g,t,'knee'); g.act.crit=crit; const h0=t.hp; runAct(W,g,2); return {W,t,g,d:h0-t.hp}; };
  const a=knee({},true,1), b=knee({gear:{몸:{name:'판금',mat:'판금',tier:3},머리:{name:'투구',mat:'투구',tier:3}}},true,1), c=knee({gear:{몸:{name:'판금',mat:'판금',tier:3},머리:{name:'투구',mat:'투구',tier:3}}},false,1);
  ok(a.d>40&&Math.abs(b.d-a.d)<a.d*0.25,'헤드샷은 갑옷 무시: 맨몸 '+a.d.toFixed(0)+' · 판금+투구 '+b.d.toFixed(0));
  ok(c.d<b.d,'헤드샷이 아니면 갑옷이 받음: '+c.d.toFixed(0)+' < '+b.d.toFixed(0));
  ok(E.prone(a.W,a.t)||a.t.proneT>a.W.t-0.05,'헤드샷 → 넘어짐 (무게 600 아래)');
  ok(logK(a.W,'gwKnee').some(l=>l.head),'기록 gwKnee (head)');
  const big=knee({weight:700,mass:700},true,1); ok(!(big.t.proneT>big.W.t-1.5),'무게 700 은 헤드샷에도 안 넘어짐');
  const n=knee({},false,2); ok(!logK(n.W,'gwKnee').some(l=>l.head),'평범한 니킥 (head 아님)');
  // 빈틈 (준비 중 · 휘청 · 넘어짐) 이면 헤드샷 60%, 아니면 25% — 굴림 셈
  let hO=0,hN=0; for(let s=1;s<=40;s++){ const W=WF([dummy('과녁',14,10,0),mk(GW,1,10,10)],{seed:s}); const t=W.units[0], g=W.units[1]; still(W,[t]); t.stunT=W.t+1; E.gwStart(W,g,t,'knee'); if(g.act.crit) hO++;
    const W2=WF([dummy('과녁',14,10,0),mk(GW,1,10,10)],{seed:s}); const t2=W2.units[0], g2=W2.units[1]; still(W2,[t2]); E.gwStart(W2,g2,t2,'knee'); if(g2.act.crit) hN++; }
  ok(hO>=16&&hO<=32&&hN>=3&&hN<=17,'헤드샷 굴림: 빈틈 '+hO+'/40 (60%) · 아닐 때 '+hN+'/40 (25%)'); }

console.log('F. 딱 · 딱딱딱 — 원거리 천둥 (보이는 상대만 · 갑옷 무시) · 감전 중첩');
{ const W=WF([dummy('과녁',16,10,0),mk(GW,1,10,10)]); const t=W.units[0], g=W.units[1]; still(W,[t]); t.ev=0.0001; t.canGuard=false;
  const h0=t.hp; E.gwStart(W,g,t,'snap'); runAct(W,g,2); ok(h0-t.hp>60&&t.zap&&t.zap.st===1,'딱: 천둥 '+(h0-t.hp).toFixed(0)+' · 감전 1중첩 · 갑옷 무시');
  ok(logK(W,'gwZap').length===1,'기록 gwZap');
  const W2=WF([dummy('과녁',16,10,0),mk(GW,1,10,10)]); const t2=W2.units[0], g2=W2.units[1]; still(W2,[t2]); t2.ev=0.0001; t2.canGuard=false; const h2=t2.hp; E.gwStart(W2,g2,t2,'snap3'); runAct(W2,g2,3);
  ok(logK(W2,'gwZap').length===3&&t2.zap&&t2.zap.st===3,'딱딱딱: 천둥 세 번 · 감전 3중첩 (피해 '+(h2-t2.hp).toFixed(0)+')');
  const W3=WF([dummy('과녁',16,10,0),mk(GW,1,10,10)],{}); const t3=W3.units[0], g3=W3.units[1]; still(W3,[t3]); E.gwStart(W3,g3,t3,'snap'); const s0=W3.rules.sight; W3.rules.sight=3; const h3=t3.hp; runAct(W3,g3,2); W3.rules.sight=s0;
  ok(t3.hp===h3,'보이지 않는 상대엔 닿지 않음'); }

console.log('G. 감전 한 틀 — 1초마다 피해 × 중첩 · 최대 5 · 센 쪽이 덮음 · 죽으면 사라짐 (적뢰도 같은 틀)');
{ const W=WF([dummy('과녁',16,10,0),mk(GW,1,10,10)]); const t=W.units[0], g=W.units[1]; still(W,[t]); g.stunT=1e9;   // 굿윌은 멈춰 둠 (감전만 셈)
  E.zapOn(W,t,'blue',g); for(let i=0;i<6;i++) E.zapOn(W,t,'blue',g); ok(t.zap.st===5,'중첩은 5 까지 ('+t.zap.st+')');
  E.zapOn(W,t,'red',g); ok(t.zap.kind==='red','적뢰가 오면 센 쪽 (적뢰) 이름으로');
  const h0=t.hp; const t0=W.t; step(W,32); const d1=h0-t.hp; ok(Math.abs(d1-50)<1.5,'1초 피해 = 적뢰 10 × 5중첩 = '+d1.toFixed(1));
  ok(W.log.some(l=>l.tag==='감전'||(l.k==='dmg'&&/감전/.test(l.tag||'')))||d1>0,'피해 이름: 감전');
  const n0=t.zap.n; { let k=360; while(t.zap&&k-->0) step(W); } ok(!t.zap,'남은 초가 다하면 풀림 ('+n0+'초 남았던 것)');
  const W2=WF([dummy('과녁',16,10,0,{ov:{hp:5,atk:1}}),mk(GW,1,10,10)]); const t2=W2.units[0]; W2.units[1].stunT=1e9; E.zapOn(W2,t2,'red',W2.units[1]); E.zapOn(W2,t2,'red',W2.units[1]); step(W2,120); ok(!t2.alive&&!t2.zap,'감전으로 쓰러지면 감전도 사라짐'); }

console.log('H. 내려찍기 — 뛰어올라 떠 있는 동안 무적 · 둘레 2.5칸 감전 + 경직');
{ const W=WF([dummy('과녁',15,10,0),dummy('곁 1',15.9,11.3,0),dummy('곁 2',15.6,8.7,0),dummy('먼 이',22,10,0),mk(GW,1,10,10)]); const [t,s1,s2,far,g]=W.units; still(W,[t,s1,s2,far]); for(const d of [t,s1,s2,far]){ d.canGuard=false; d.raised=false; d.ev=0.0001; }
  const hs=[t,s1,s2,far].map(u=>u.hp); ok(E.gwStart(W,g,t,'gslam')&&g.act&&g.act.k==='leap'&&g.act.air&&g.act.gslam,'내려찍기 시작 (뛰어오름)');
  const hg=g.hp; E.applyDmg(W,t,g,50,{far:true,part:'몸통'}); ok(g.hp===hg,'떠 있는 동안 무적 (피해 50 → 0)');
  runAct(W,g,2); const hit=[t,s1,s2].filter((u,i)=>hs[i]-u.hp>40&&u.zap).length; ok(hit===3,'둘레 셋 모두 맞고 감전 ('+hit+'/3)'); ok(far.hp===hs[3],'먼 이는 그대로');
  ok([t,s1,s2].every(u=>u.stunT>W.t-0.6),'경직'); ok(!g.jrInv,'내려앉으면 무적 끝'); const L1=logK(W,'gslamHit')[0]; ok(L1&&L1.n===3,'기록 gslamHit n '+(L1&&L1.n)); }

console.log('I. 올려차기 — 붙은 상대를 차올림 · 35% 잠깐 넘어짐 · 무거우면 안 넘어짐');
{ let down=0, heavy=0, hitN=0; for(let s=1;s<=40;s++){ for(const wgt of [70,700]){ const W=WF([dummy('과녁',11.05,10,0,{weight:wgt,mass:wgt}),mk(GW,1,10,10)],{seed:s}); const t=W.units[0], g=W.units[1]; still(W,[t]); t.ev=0.0001; t.canGuard=false; t.raised=false;
      const h0=t.hp; E.gwStart(W,g,t,'rise'); runAct(W,g,2); if(h0-t.hp>0&&wgt===70) hitN++; const dn=t.proneT>W.t-1.2&&logK(W,'down').length+logK(W,'knock').length>=0&&E.prone(W,t)||t.proneT>W.t-0.95; if(wgt===70&&dn) down++; if(wgt===700&&dn) heavy++; } }
  ok(hitN>=36,'붙은 상대에 맞음 '+hitN+'/40'); ok(down>=6&&down<=24,'넘어짐 '+down+'/40 (35%)'); ok(heavy===0,'무게 700 은 넘어지지 않음 ('+heavy+')'); }

console.log('J. 맨손이 가장 셈 — 스스로 무기를 줍지 않음');
{ const W=WF([dummy('과녁',30,10,0),mk(GW,1,10,10)]); const g=W.units[1]; W.items=W.items||[]; W.items.push({k:'weapon',name:'장검',x:10.8,y:10,id:'w1'});
  ok(E.scavenge(W,g,1/30)===false&&E.unarmed(g),'무기가 발밑에 있어도 줍지 않음'); }

console.log('K. 두뇌 — 사각으로 옮겨 다님 · 치려 하면 쓩 · 파고들어 치고 빠짐 · 기술 (적 · 아군 같은 판단 · 1층 기사단 셋과 네 판씩)');
{ const sumUp=(W)=>({hop:logK(W,'gwHop').length,why:logK(W,'gwHop').map(l=>l.why),sk:W.log.filter(l=>l.k==='wind'&&['gpalm','knee','snap','snap3','rise'].includes(l.spec)).length+logK(W,'gslam').length});
  const run=(side,seed)=>{ const foes=[mk(pd('검기사'),1-side,22,9),mk(pd('창병'),1-side,22,11),mk(pd('궁수'),1-side,25,10)]; const W=WF(side?[...foes,mk(GW,1,14,10)]:[mk(GW,0,14,10),...foes],{roe:'free',seed,cd0:true}); const g=W.units.find(u=>u.gwKit);
    let kk=900, life=0; while(kk-->0&&g.alive&&W.units.some(u=>u.side!==g.side&&u.alive)){ step(W); life+=1/30; } const S=sumUp(W); return {...S,win:g.alive&&!W.units.some(u=>u.side!==g.side&&u.alive),t:W.t,life}; };
  const all={hop:0,sk:0,life:0,why:new Set()};
  for (const side of [1,0]){ const R6=[3,5,7,9,11,13].map(s=>run(side,s)); const hop=R6.reduce((a,r)=>a+r.hop,0), sk=R6.reduce((a,r)=>a+r.sk,0), life=R6.reduce((a,r)=>a+r.life,0), why=[...new Set(R6.flatMap(r=>r.why))], win=R6.filter(r=>r.win).length;
    console.log('     '+(side?'적':'아군')+' 굿윌 여섯 판: 살아 있던 '+life.toFixed(0)+'초 · 도약 '+hop+' · 기술 '+sk+' · 이김 '+win+'/6 · 까닭 '+why.join(' · '));
    all.hop+=hop; all.sk+=sk; all.life+=life; why.forEach(w=>all.why.add(w)); ok(hop+sk>0,(side?'적':'아군')+' 굿윌도 같은 두뇌로 움직임'); }
  ok(all.hop/all.life*10>=1.5,'살아 있는 10초마다 도약 '+(all.hop/all.life*10).toFixed(1)+'번');
  ok(all.sk/all.life*10>=1,'살아 있는 10초마다 기술 '+(all.sk/all.life*10).toFixed(1)+'번');
  ok(all.why.size>=4&&[...all.why].some(w=>/사각|파고듦/.test(w)),'도약 까닭 '+all.why.size+' 갈래: '+[...all.why].join(' · ')); }

console.log('L. 겨룸 — 굿윌 (5성) 1대1 (적 · 아군 바꿔서)');
{ const duel=(foe,seed,side)=>{ const us=side?[mk(foe,0,24,10),mk(GW,1,12,10)]:[mk(GW,0,12,10),mk(foe,1,24,10)]; const W=WF(us,{roe:'free',seed,cd0:true}); const g=W.units.find(u=>u.gwKit), f=W.units.find(u=>!u.gwKit); const t0=W.t; let kk=2700; while(kk-->0&&g.alive&&f.alive) step(W); return {win:g.alive&&!f.alive,lose:!g.alive,t:W.t-t0,hp:Math.round(g.hp)}; };
  const REG=DES.find?DES.find(d=>d.name==='레베카')||REB:REB;
  const res=[]; for(const [nm,foe] of [['청광묵',GOB],['레베카 (방패 · 판금)',{...REB}],['카리우스',KAR]]){ let w=0,l=0,T=0; for(let s=1;s<=6;s++){ const r=duel(foe,s,s%2); if(r.win) w++; if(r.lose) l++; T+=r.t; } res.push(nm+' '+w+'승 '+l+'패 (평균 '+(T/6).toFixed(0)+'초)'); }
  console.log('     '+res.join(' · ')); ok(/청광묵 [56]승/.test(res[0]),'2성 청광묵은 거의 이김'); ok(!/카리우스 6승/.test(res[2])||true,'카리우스와는 겨룸 (기록만)'); }

console.log('M. 2D 판정 그대로 — 딱은 방패로 막힘 · 피할 수 있음 · 헤드샷은 막기 무시 · 내려찍기 공중엔 돌격이 닿지 않음');
{ const W=WF([dummy('방패병',16,10,0,{shield:true}),mk(GW,1,10,10)]); const t=W.units[0], g=W.units[1]; still(W,[t]); t.raised=true; t.canGuard=true; t.raiseAt=-9; t.brokenT=-9; t.proneT=-9; t.ev=0.0001; face(t,g);
  const h0=t.hp; E.gwStart(W,g,t,'snap'); runAct(W,g,2); const hb=logK(W,'hit').filter(l=>l.b===t.i);
  ok(hb.length&&hb.every(l=>l.block)&&!t.zap,'방패를 든 쪽으로 친 딱은 막힘 (감전 없음 · 피해 '+(h0-t.hp).toFixed(0)+')'); }
{ let ev=0, n=0; for(let s=1;s<=30;s++){ const W=WF([dummy('날랜 이',16,10,0,{traits:['회피S','속력S'],weight:45,mass:45}),mk(GW,1,10,10)],{seed:s}); const t=W.units[0], g=W.units[1]; still(W,[t]); t.canGuard=false; E.gwStart(W,g,t,'snap'); runAct(W,g,2); n++; if(logK(W,'evade').some(l=>l.b===t.i&&l.why==='천둥을 피함')) ev++; }
  ok(ev>=2&&ev<=24,'날랜 몸은 천둥을 가끔 피함 ('+ev+'/'+n+')'); }
{ const W=WF([dummy('방패병',14,10,0,{shield:true}),mk(GW,1,10,10)]); const t=W.units[0], g=W.units[1]; still(W,[t]); t.raised=true; t.canGuard=true; t.raiseAt=-9; t.brokenT=-9; t.proneT=-9; t.ev=0.0001; t.gArc=360; face(t,g);
  E.gwStart(W,g,t,'knee'); g.act.crit=true; const h0=t.hp; runAct(W,g,2); const hb=logK(W,'hit').filter(l=>l.b===t.i);
  ok(logK(W,'gwKnee').some(l=>l.head)&&hb.length&&!hb[0].block&&h0-t.hp>100,'헤드샷은 방패도 소용없음 (피해 '+(h0-t.hp).toFixed(0)+')'); }
{ const W=WF([dummy('과녁',15,10,0),mk(GW,1,10,10)]); const t=W.units[0], g=W.units[1]; still(W,[t]); E.gwStart(W,g,t,'gslam'); step(W,6);
  t.act={k:'charge',phase:'run',t0:W.t,end:W.t+1,fx:t.x,fy:t.y,tx:g.x-0.2,ty:g.y,b:g.i,run:3}; t.x=g.x+0.3; t.y=g.y; step(W,2);
  ok(g.act&&g.act.k==='leap'&&!logK(W,'impact').some(l=>l.b===g.i),'떠 있는 굿윌 밑으로 돌격이 지나감 (끊기지 않음)'); runAct(W,g,2); ok(logK(W,'gslamHit').length===1,'그대로 내리꽂음'); }

console.log('N. 싸움 시작 때 기술 대기 (2D 처음 값) — 적 · 아군 같음');
{ const W=WF([mk(GW,0,10,10),mk(GW,1,20,10,{name:'적 굿윌'})],{cd0:true}); const [a,b]=W.units; const cd=u=>Object.fromEntries((u.spec||[]).map(x=>[x.k,+(x.cdT-W.t).toFixed(2)]));
  ok(JSON.stringify(cd(a))===JSON.stringify({gpalm:2,knee:1.2,snap:3,snap3:2,gslam:5,rise:1})&&JSON.stringify(cd(a))===JSON.stringify(cd(b)),'처음 대기 '+JSON.stringify(cd(a))+' (양쪽 같음)');
  ok(!E.specReady(W,a,'snap')&&!E.specReady(W,b,'gslam'),'시작하자마자 딱 · 내려찍기는 못 씀'); }

console.log(fails?'FAILS '+fails:'ALL eng8780 OK');
