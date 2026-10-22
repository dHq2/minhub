// v8.7.4 시험 — eng8740.js v1.4 (v1.4: 모닝스타 중거리 · 길 비켜 주기 · 전열 끝 · 역할 진화 · 사수 자리 옮김 · 도약으로 사선 · v1.3: 제3세력 (각혈 2편) — 오류 없음 · 망자와 서로 침 · 맵 정리 조건 · 보임 · 쫓음 · 짐작 · v1.2: 노인의 왕관 [★권위E] — 대리석 피부 받아 내는 몫 · 스텝 간격 · 봉인 · 성해포 재생 · 신성이 아닌 재생은 그대로 · v1.1: 돌진 길 — 길 잡기 · 옆은 되고 뒤 · 건너편은 안 됨 · 본 것만 · 노먼이 옆으로 빠짐 · 맞붙음이면 기다렸다가 헛치게 함 · 적 궁수도 같음 · v1.0: 갑피 등급 (SS 6 · S 5 · A 4 · C 2 · 등급 없으면 3) · 붉은암석 (민수 메모 J22) — 방어모드 (피해 1 · 느림 · 치지 않음 · 기술 못 씀 · 풀림) · 잡아찢기 (붙잡음 · 손을 따라감 · 끝까지 쥐면 중형 찢김 / 중대형 팔다리 / 대형 부러짐 · 맞으면 놓침 · 휘청이면 놓침) · 딥 킥 (날려 보냄 · 볼링) · 바위던지기 (처음 닿는 몸 · 벽에 부서짐) · 점프 찍기 체급 (붉은암석 중대형까지 · 호레이쇼는 중형까지 · 걸친 몸 넘어짐) · 망각 기술표 (밀침은 넘어뜨리지 않음 · 갈퀴 덮치기는 넘어뜨림) · 붙잡힌 동료를 구함 · 방어모드 상대는 치지 않고 기다림)
const {E,R,DES,KAR,GOB,REB,NOR,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const lit=W=>{ W.amb=1; E.computeLight(W); };
const RR={ref:'C-245',name:'붉은암석',tier:4,cls:'근접',weapon:'맨손',height:3.0,weight:900,sizeCls:'대형',quakeKill:'중대형',ov:{hp:760,atk:52},traits:['갑피SS','거구','무장기'],active:['도약 강타','잡아찢기','딥 킥','방어모드','바위던지기']};
const HO={ref:'C-158',name:'호레이쇼',tier:4,cls:'근접',weapon:'대장군의 도끼',height:5,weight:1100,ov:{hp:9000,atk:30},traits:['거구'],active:['도약 강타']};
const MG={ref:'C-211',name:'망각',tier:6,cls:'근접',weapon:'이빨·발톱',height:6.6,weight:18000,sizeCls:'초대형',rMul:2.81,h2:'mangak',ov:{hp:1900,atk:73,spd:1.9},traits:['보스','거구','갑피','비늘 깃털 갑옷']};
const dummy=(name,x,y,side,ex)=>mk({...REB,name,ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const run=(W,sec,dt)=>{ const n=Math.round(sec/(dt||0.05)); for (let i=0;i<n&&!W.over;i++) E.stepWorld(W,dt||0.05); };
const hold=(...us)=>{ for (const u of us){ u.order={k:'hold'}; u.state='idle'; u.target=null; } };
const L=(W,k)=>W.log.filter(l=>l.k===k);

// 1) 갑피 등급 → 판금 · 투구 등급
{ const t=tr=>{ const g=E.gearOf({traits:[tr],height:1.7},R); return [g['몸']&&g['몸'].tier,g['머리']&&g['머리'].tier]; };
  const a=t('갑피SS'), b=t('갑피S'), c=t('갑피A'), d=t('갑피C'), e=t('갑피');
  console.log('      SS',a,'S',b,'A',c,'C',d,'등급 없음',e);
  ok(a[0]===6&&a[1]===6,'갑피SS = 판금 · 투구 6성 (S 보다 한 단계 위)'); ok(b[0]===5&&c[0]===4&&d[0]===2,'S 5 · A 4 · C 2'); ok(e[0]===(R.galpi||3),'등급 없는 갑피는 수치표 galpi ('+e[0]+')');
  const m6=E.armorMul(R,{gear:{몸:{mat:'판금',tier:6}}},'몸통','날붙이').m, m5=E.armorMul(R,{gear:{몸:{mat:'판금',tier:5}}},'몸통','날붙이').m, b6=E.armorMul(R,{gear:{몸:{mat:'판금',tier:6}}},'몸통','둔기').m;
  ok(m6<m5&&b6>m6,'6성 판금은 날붙이를 더 막고 ('+m6.toFixed(2)+' < '+m5.toFixed(2)+') 둔기에는 여전히 약함 ('+b6.toFixed(2)+')'); }

// 2) 방어모드: 피해 1 · 느림 · 치지 않음 · 기술 못 씀 · 5초 뒤 풀림
{ const W=W_([dummy('갑',12,8,0)],[mk(RR,1,10,8)],3,'hold'); lit(W); const [a,r]=W.units; hold(a,r);
  const v0=E.spdNow(W,r); E.startSpec(W,r,null,'stone','시험'); run(W,0.4);
  ok(r.stoneT!=null&&r.stoneT>W.t,'방어모드가 걸림 ('+(r.stoneT&&(r.stoneT-W.t).toFixed(1))+'초 남음)');
  const h0=r.hp; E.applyDmg(W,a,r,250,{tag:'시험 일격'}); ok(Math.abs(h0-r.hp-1)<1e-6,'방어모드: 250 피해가 1 로 ('+(h0-r.hp)+')');
  const hl=W.log.filter(l=>l.k==='hit'&&l.b===r.i).pop(); ok(hl&&/방어모드/.test(hl.tag||''),'기록 꼬리표 \''+(hl&&hl.tag)+'\'');
  ok(E.spdNow(W,r)<v0*0.5,'걸음이 느림 ('+E.spdNow(W,r).toFixed(2)+' / '+v0.toFixed(2)+')');
  E.startAct(W,r,a,'시험'); ok(!r.act,'방어모드 동안은 치지 않음 (startAct 무시)'); ok(!E.specReady(W,r,'kick'),'방어모드 동안은 기술도 못 씀');
  run(W,5.2); ok(r.stoneT==null&&L(W,'stoneOff').length===1,'5초 뒤 풀림 (stoneOff 기록)'); const h1=r.hp; E.applyDmg(W,a,r,50,{tag:'시험'}); ok(h1-r.hp>1,'풀린 뒤엔 피해가 그대로 ('+(h1-r.hp)+')'); }

// 3) 잡아찢기 — 중형은 끝까지 쥐면 찢겨 죽음 · 붙잡힌 몸은 손을 따라감
const grabW=(vEx,extra)=>{ const W=W_([dummy('잡힌 이',10+0.47+0.36+0.2,8,0,vEx)].concat(extra||[]),[mk(RR,1,10,8)],5,'hold'); lit(W); const u=W.units; const r=u.find(x=>x.name==='붉은암석'), v=u.find(x=>x.name==='잡힌 이'); hold(...u); v.x=r.x+r.r+v.r+0.15; v.y=r.y; return {W,r,v}; };
{ const {W,r,v}=grabW({height:1.7,weight:70}); const rnd=W.rand; W.rand=()=>0.99;
  E.startSpec(W,r,v,'tear','시험'); run(W,0.7); W.rand=rnd;
  const g=L(W,'tearGrab')[0]; ok(!!g&&v.heldBy===r.i&&r.act&&r.act.phase==='run','붙잡음 (tearGrab · 붙잡힌 몸 heldBy · 손은 run)');
  r.x+=1.0; run(W,0.2); const d=Math.hypot(v.x-r.x,v.y-r.y); ok(Math.abs(d-(r.r+v.r+0.02))<0.15,'손이 움직이면 붙잡힌 몸이 따라감 ('+d.toFixed(2)+'칸)');
  run(W,2.4); const t=L(W,'tear')[0]; ok(!v.alive&&v.deathKind==='tear'&&t&&t.res==='kill','끝까지 쥐면 중형은 찢겨 죽음 ('+(t&&t.res)+' · '+v.deathKind+')'); ok(v.heldBy==null,'쓰러진 뒤 붙잡힘 풀림'); }
// 4) 중대형은 팔다리 하나 · 대형은 부러짐 (둔기)
{ const {W,r,v}=grabW({height:2.1,weight:110}); const rnd=W.rand; W.rand=()=>0.99; E.startSpec(W,r,v,'tear','시험'); run(W,0.7); W.rand=rnd; run(W,2.4);
  const t=L(W,'tear')[0], lost=v.crawl||(v.arms&&(v.arms.L||v.arms.R)); ok(v.alive&&t&&(t.res==='tear'||t.res==='break')&&lost,'중대형: 살아남되 팔다리 하나 ('+(t&&t.res)+' · '+(t&&t.size)+')'); }
{ const {W,r,v}=grabW({height:2.6,weight:300,sizeCls:'대형'}); const rnd=W.rand; W.rand=()=>0.99; E.startSpec(W,r,v,'tear','시험'); run(W,0.7); W.rand=rnd; run(W,2.4);
  const t=L(W,'tear')[0]; ok(v.alive&&t&&t.res==='break','대형: 팔다리 하나 부러짐 ('+(t&&t.res)+' · '+(t&&t.size)+')'); }
// 5) 끊을 수 있음 — 붙잡은 동안 최대 체력 6% 넘게 맞으면 놓침 · 휘청이면 놓침
{ const {W,r,v}=grabW({height:1.7,weight:70},[dummy('구하는 이',8.5,8,0)]); const s=W.units.find(x=>x.name==='구하는 이'); const rnd=W.rand; W.rand=()=>0.99; E.startSpec(W,r,v,'tear','시험'); run(W,0.7); W.rand=rnd;
  E.applyDmg(W,s,r,r.max*0.07,{tag:'시험'}); const lt=L(W,'tearLet')[0]; ok(lt&&v.heldBy==null&&v.alive&&!(r.act&&r.act.phase==='run'),'맞으면 놓침 (tearLet · 놓인 몸은 삶) — '+(lt&&lt.why)); ok(lt&&lt.by===s.i,'놓치게 한 이 기록 ('+(lt&&lt.by)+')'); }
{ const {W,r,v}=grabW({height:1.7,weight:70}); const rnd=W.rand; W.rand=()=>0.99; E.startSpec(W,r,v,'tear','시험'); run(W,0.7); W.rand=rnd;
  E.stun(W,r,0.8,v.i); ok(L(W,'tearLet').length===1&&v.heldBy==null&&v.alive,'휘청이면 놓침 (stun → interrupt → tearLet)'); }
// 6) 동료를 구함: 붙잡힌 동료가 있으면 곁의 아군은 붙잡은 상대를 침 (명령 없을 때)
{ const {W,r,v}=grabW({height:1.7,weight:70},[dummy('동료',7.5,9,0)]); const s=W.units.find(x=>x.name==='동료'); s.order=null; s.state='fight';
  const rnd=W.rand; W.rand=()=>0.99; E.startSpec(W,r,v,'tear','시험'); run(W,0.7); W.rand=rnd; s.target=null; run(W,0.6);
  ok(s.target===r||(s.target&&s.target.i===r.i)||(s.mood&&/구하기/.test(JSON.stringify(s.mood))),'곁의 동료가 붙잡은 상대를 노림 ('+JSON.stringify(s.mood||'').slice(0,40)+')'); }

// 7) 딥 킥 — 차 날림 · 날아간 몸이 뒤의 몸과 부딪힘 (볼링)
{ const W=W_([dummy('차인 이',11.1,8,0,{height:1.7,weight:70}),dummy('뒤 1',12.6,8,0,{height:1.7,weight:70}),dummy('뒤 2',13.4,8.5,0,{height:1.7,weight:70})],[mk(RR,1,10,8)],7,'hold'); lit(W); const [k,b1,b2,r]=W.units; hold(k,b1,b2,r);
  k.x=r.x+r.r+k.r+0.1; const rnd=W.rand; W.rand=()=>0.99; E.startSpec(W,r,k,'kick','시험'); run(W,0.5); W.rand=rnd; run(W,1.5);
  const s=W.log.find(l=>l.k==='shove'&&l.b===k.i&&/딥 킥/.test(l.tag||'')), kk=L(W,'kick')[0], hitB=W.log.some(l=>(l.k==='shove'||l.k==='hit'||l.k==='prone')&&(l.b===b1.i||l.b===b2.i));
  console.log('      딥 킥',JSON.stringify(s&&{len:s.len,tag:s.tag}),'뒤의 몸',hitB);
  ok(kk&&s&&s.len>=1,'딥 킥: 차 날림 ('+(s&&s.len)+'칸)'); ok(hitB,'날아간 몸이 뒤의 몸과 부딪힘 (볼링)'); }

// 8) 바위던지기 — 처음 닿는 몸 (사이에 선 이) · 벽에 부서짐
{ const W=W_([dummy('먼 이',17,8,0),dummy('사이',13.5,8,0)],[mk(RR,1,10,8)],9,'hold'); lit(W); const [f,m,r]=W.units; hold(f,m,r);
  const rnd=W.rand; W.rand=()=>0.99; E.startSpec(W,r,f,'boulder','시험'); run(W,0.9); W.rand=rnd; run(W,1.2);
  const be=L(W,'boulderEnd')[0]; ok(be&&be.b===m.i,'바위는 처음 닿는 몸 (사이에 선 이) 에서 멈춤 ('+(be&&W.units[be.b]&&W.units[be.b].name)+')');
  const hm=W.log.find(l=>l.k==='hit'&&l.b===m.i&&/바위/.test(l.tag||'')); ok(hm&&hm.dmg>0,'맞은 이 피해 '+(hm&&Math.round(hm.dmg))+' · 먼 이는 맞지 않음 ('+!W.log.some(l=>l.k==='hit'&&l.b===f.i)+')'); }
{ const W=W_([dummy('벽 뒤',20,8,0)],[mk(RR,1,10,8)],9,'hold'); lit(W); const [f,r]=W.units; hold(f,r);
  for (let x=14;x<=15;x++) for (let y=6;y<=10;y++) W.map.t[y*W.map.W+x]=1;
  W.spins=[{boulder:true,by:r.i,side:1,x:r.x+r.r+0.3,y:8,dx:1,dy:0,v:14,left:10,w:0.6,mul:1.3,kb:1.6,hit:[],t0:W.t}]; for (let i=0;i<40&&W.spins.length;i++) E.stepSpins(W,1/30);
  const be=L(W,'boulderEnd')[0]; ok(!W.spins.length&&(!be||be.b==null)&&!W.log.some(l=>l.k==='hit'&&l.b===f.i),'벽에 닿으면 부서짐 (벽 뒤는 안 맞음)'); }

// 9) 점프 찍기 체급 — 붉은암석 중대형까지 찌부러뜨림 · 호레이쇼는 중형까지 · 걸친 몸 넘어짐
const quakeOn=(D,vEx)=>{ const W=W_([dummy('밑',16,8,0,vEx)],[mk(D,1,10,8)],11,'hold'); lit(W); const [v,u]=W.units; hold(v,u); v.stunT=1e9; E.startQuake(W,u,v.x,v.y,'시험'); run(W,1.6); return {W,u,v}; };   // 밑의 몸은 휘청 (그림자를 보고 비키지 못하게)
{ const a=quakeOn(RR,{height:2.1,weight:110}); ok(!a.v.alive,'붉은암석: 중대형이 내려앉은 몸 밑에서 찌부러짐 ('+(a.v.alive?'살아남음':a.v.deathKind)+')');
  const b=quakeOn(HO,{height:2.1,weight:110}); ok(b.v.alive,'호레이쇼: 중대형은 찌부러지지 않음 (중형까지)');
  const c=quakeOn(RR,{height:2.7,weight:300,sizeCls:'대형'}); ok(c.v.alive,'붉은암석: 대형은 찌부러지지 않음 (J22 — 대형 이상은 아님)'); }
{ const W=W_([dummy('걸친 이',16,8,0,{height:1.7,weight:70})],[mk(RR,1,10,8)],13,'hold'); lit(W); const [v,u]=W.units; hold(v,u); v.stunT=1e9; E.startQuake(W,u,v.x+u.r+v.r*0.4,v.y,'시험'); run(W,1.6);
  const pr=W.log.find(l=>l.k==='prone'&&l.b===v.i); ok(v.alive&&pr&&/깔림/.test(pr.why||''),'몸에 걸친 이는 밀려나며 넘어짐 ('+(pr&&pr.why)+')'); }

// 10) 망각 기술표 — 기본 일격의 밀침은 넘어뜨리지 않음 · 갈퀴 덮치기 (trip) 는 넘어뜨림
{ const W=W_([dummy('앞',15.5,8,0,{height:1.7,weight:70})],[mk(MG,1,10,8)],15,'hold'); lit(W); const [v,m]=W.units; hold(v,m); v.hp=v.max=9000;
  const K=E.H2K.mangak, ml={id:'ml',n:'할퀴기',type:'slash',r:K.ml.range,arc:K.ml.arc,mul:K.ml.mul,wind:K.ml.wind,cd:K.ml.cd,kb:K.ml.kb};
  v.x=m.x+3.5; E.h2Cast(W,m,ml,v); run(W,1.4);
  const sh=W.log.find(l=>l.k==='shove'&&l.b===v.i), pr=W.log.find(l=>l.k==='prone'&&l.b===v.i&&l.a===m.i); ok(sh&&!pr,'할퀴기: 밀려나되 넘어지지 않음 (3D — 밀침은 넘어뜨리지 않음)');
  const W2=W_([dummy('앞',15.5,8,0,{height:1.7,weight:70})],[mk(MG,1,10,8)],15,'hold'); lit(W2); const [v2,m2]=W2.units; hold(v2,m2); v2.hp=v2.max=9000; v2.x=m2.x+5;
  E.h2Cast(W2,m2,K.sk.find(s=>s.id==='pounce'),v2); run(W2,1.2);
  ok(W2.log.some(l=>l.k==='prone'&&l.b===v2.i),'갈퀴 덮치기 (trip): 넘어뜨림'); }

// 11) 방어모드인 상대는 치지 않고 기다림 (다른 상대가 없으면) — 양쪽 같음
{ const W=W_([dummy('기다리는 이',11.4,8,0)],[mk(RR,1,10,8)],17); lit(W); const [a,r]=W.units; a.order=null; a.state='fight'; a.target=r;
  E.startSpec(W,r,null,'stone','시험'); run(W,0.4); const n0=W.log.filter(l=>l.k==='hit'&&l.a===a.i&&l.b===r.i).length; run(W,3);
  const n1=W.log.filter(l=>l.k==='hit'&&l.a===a.i&&l.b===r.i).length, md=JSON.stringify(a.mood||''); console.log('      기다림',md.slice(0,60),'때림',n1-n0);
  ok(n1-n0===0&&/방어모드/.test(md),'방어모드 상대는 치지 않고 기다리거나 물러남'); }

// 12) 돌진 길 (ev715 A) — 나를 노린 돌진의 길 (띠) 밖 옆으로 · 띠를 가로지르지 않음 · 맞붙음이면 그 일격을 기다렸다가 물러남 (아군 · 적 같은 규칙)
{ const W=W_([mk(NOR,0,6,8)],[mk(DES['검기사'],1,11,8)],21,'free'); lit(W); const [n,k]=W.units; hold(n,k); E.startCharge(W,k,n,null);
  const LN=E.chargeLane(W,n,()=>true); ok(!!LN&&LN.c===k,'돌진 준비가 나를 노리면 돌진 길이 잡힘');
  ok(!E.laneOk(LN,n,4,8)&&E.laneOk(LN,n,6,10.3)&&E.laneOk(LN,n,6,5.7),'길: 곧장 뒤는 안 됨 · 옆은 됨');
  n.y=8.5; ok(!E.laneOk(LN,n,6,5.7)&&E.laneOk(LN,n,6,10.6),'길 한쪽에 있으면 건너편으로 가로지르지 않음');
  ok(!E.chargeLane(W,n,()=>false),'보지 못한 돌진은 모름 (본 것만)'); }
{ const W=W_([mk(NOR,0,6,8)],[mk(DES['검기사'],1,9.4,8)],22,'free'); lit(W); const [n,k]=W.units; n.order=null; n.state='fight'; n.target=k; n.lastFireT=-9; n.kiteT0=-9; hold(k); k.order=null;
  E.startCharge(W,k,n,null); W.t+=0.01; E.stepWorld(W,0.05); const ev=W.log.find(l=>l.k==='evade'&&l.a===n.i);
  ok(ev&&ev.lane&&n.mv&&n.mv.lane,'노먼: 돌진이 오면 길 밖 옆으로 빠짐 ('+(ev?ev.m+(ev.lane?' lane':''):'없음')+')');
  if (n.mv){ const LN=E.chargeLane(W,n,()=>true); ok(LN&&E.laneOk(LN,n,n.mv.x,n.mv.y),'빠질 자리는 길 밖'); } }
{ const W=W_([mk(NOR,0,6,8)],[mk(DES['검기사'],1,6.9,8)],23,'free'); lit(W); const [n,k]=W.units; hold(k); k.jrB=true; n.order=null; n.state='fight'; n.target=k; const x0=n.x, s0=n.shots||0;   // 시험: 손이 빈 채 곁에 선 상대 (치기 시작하지 못하게 잠시 묶음)
  run(W,1.0,1/30); k.jrB=false; ok((n.shots||0)===s0&&Math.hypot(n.x-x0,n.y-8)<0.15&&/일격을 기다림/.test(n.mood||''),'사수 맞붙음: 손이 빈 근접 곁에선 쏘지도 걷지도 않고 기다림 ('+n.mood+' · 쏨 '+((n.shots||0)-s0)+')');
  k.order=null; E.startAct(W,k,n,'시험'); run(W,0.7,1/30); const m=W.log.find(l=>(l.k==='miss'||l.k==='hit')&&l.a===k.i&&l.b===n.i);
  ok(m&&m.k==='miss'&&/안 닿음/.test(m.why||''),'상대가 치려고 준비하면 물러나 헛치게 함 ('+(m?m.k+' '+(m.why||m.tag||''):'없음')+')'); }
{ const AR=DES['궁수']; const W=W_([mk(DES['검기사'],0,10.5,8)],[mk(AR,1,14,8)],24,'free'); lit(W); const [k,a]=W.units; a.target=k; a.state='hunt'; k.order=null;
  for (let i=0;i<10;i++) E.stepWorld(W,0.05); E.startCharge(W,k,a,null); let got=null; for (let i=0;i<20&&!got;i++){ E.stepWorld(W,0.05); if (a.mv&&a.mv.k==='kite') got=a.mv; }
  const LN=E.chargeLane(W,a,()=>true); ok(got&&got.lane&&(!LN||E.laneOk(LN,a,got.x,got.y)),'적 궁수도 같은 규칙 — 돌진 길 밖 옆으로 ('+(got?'lane '+!!got.lane:'물러나지 않음')+')'); }

// 13) 노인의 왕관 [★권위E] (C1) — 맵의 모든 신성 상대: [대리석 피부] (받아 내는 몫 · 스텝 간격) · 성해포의 [재생] 15% 약화 · 권위 (봉인) 중엔 꺼짐
{ const mkW=crown=>{ const W=W_([dummy('왕관 쓴 이',8,8,0,crown?{gear:{머리:{name:'노인의 왕관',mat:'투구',tier:1,auth:'E'}}}:{})],[dummy('대리석',12,8,1,{traits:['신성A','대리석 피부']}),dummy('성해포',14,10,1,{traits:['신성E']}),dummy('재생몸',14,6,1)],31,'hold'); lit(W); const [c,m,h,g]=W.units; hold(c,m,h,g); m.marble=true; h.regenHp=1.5; g.regenHp=1.5; return {W,c,m,h,g}; };
  const A=mkW(false), B=mkW(true); ok(!E.crownOn(A.W.units[0])&&E.crownOn(B.W.units[0])&&E.authOn(B.W,B.m)&&!E.authOn(B.W,B.c),'왕관: 쓴 이의 상대에게만');
  const blk=X=>{ const r=X.W.rand; X.W.rand=()=>0; const d=E.marbleHit(X.W,X.c,X.m,20,{tag:null}); X.W.rand=r; return d; };
  const d0=blk(A), d1=blk(B); ok(d0===6&&d1===8,'대리석 피부: 받아 내는 몫 0.7 → 0.595 (20 → '+d0+' / 왕관 '+d1+')');
  E.marbleHit(A.W,A.c,A.m,80,{tag:null}); E.marbleHit(B.W,B.c,B.m,80,{tag:null}); const sA=A.m.mStepT-A.W.t, sB=B.m.mStepT-B.W.t; ok(Math.abs(sA-4)<0.01&&Math.abs(sB-4/0.85)<0.01,'대리석 피부 스텝 간격 4 → '+sB.toFixed(2)+'초 (왕관)');
  B.W.seal=true; ok(blk(B)===20,'권위 (신성 봉인) 중엔 대리석 피부가 꺼짐'); B.W.seal=false;
  for (const X of [A,B]){ for (const u of [X.h,X.g]){ u.hp=u.max-50; } run(X.W,2,0.05); }
  const rA=A.h.max-50, gH=v=>Math.round((v.hp-(v.max-50))*100)/100; ok(Math.abs(gH(A.h)-3)<0.2&&Math.abs(gH(B.h)-2.55)<0.2&&Math.abs(gH(B.g)-3)<0.2,'성해포 재생 2초: '+gH(A.h)+' / 왕관 '+gH(B.h)+' (신성이 아닌 재생은 그대로 '+gH(B.g)+')');
  B.W.seal=true; B.h.hp=B.h.max-50; run(B.W,1,0.05); ok(B.h.hp===B.h.max-50,'권위 (봉인) 중엔 신성의 재생이 멎음'); }

const KHD={ ref:'C-097', name:'각혈', tier:6, cls:'근접', role:'공격수', weapon:'각혈의 장검', height:2.1, weight:120, sizeCls:'중대형', nv:true, nvG:'S', bold:0.9, ov:{ hp:3200, atk:70 }, traits:['보스','베테랑','속력A','회피A','발화A','근력B','괴력B','망자','은신B'], gear:{ 몸:{ name:'각혈의 갑옷', mat:'각혈갑', tier:3 }, 머리:{ name:'각혈의 투구', mat:'투구', tier:3 } }, active:['혈영보','혈염','핏빛 장판','피의 검기'] };
// 14) 제3세력 (I6 — 각혈): 2편은 누구의 편도 아님 — 보이는 누구든 침 · 망자 (1편) 와 서로 싸움 · 2편이 살아 있으면 맵이 정리되지 않음 · 아군이 본 것만 보임 · 오래 돌려도 오류 없음
{ const KH=KHD;   // 페이지 설계 그대로 (각혈 · C-097)
  const W=W_([dummy('인주',3,8,0,{height:1.6})],[mk(DES['곤봉적'],1,16,8),mk(DES['곤봉적'],1,17,9)],41,'hold'); lit(W); W.camp=true; const kh=E.addUnit(W,{...KH,side:2,x:14,y:8,id:'kh'}); const [p,z1,z2]=W.units; hold(p);
  let err=null; try { for (let i=0;i<200&&!W.over;i++) E.stepWorld(W,0.05); } catch(e){ err=e.message; }
  ok(!err,'2편이 섞인 판 10초 — 오류 없음 '+(err||''));
  const hz=W.log.filter(l=>l.k==='hit'&&l.a===kh.i&&(l.b===z1.i||l.b===z2.i)).length, zh=W.log.filter(l=>l.k==='hit'&&(l.a===z1.i||l.a===z2.i)&&l.b===kh.i).length;
  ok(hz>0&&zh>0,'각혈과 망자가 서로 침 (각혈→망자 '+hz+' · 망자→각혈 '+zh+')');
  ok(!W.cleared||!kh.alive,'2편이 살아 있으면 맵이 정리되지 않음 (정리 '+!!W.cleared+' · 각혈 '+(kh.alive?'삶':'쓰러짐')+')');
  for (const u of [z1,z2]) if (u.alive){ u.hp=0; u.alive=false; } E.stepWorld(W,0.05); ok(!W.cleared&&kh.alive,'망자를 다 쓰러뜨려도 각혈이 남으면 정리 안 됨');
  kh.hp=0; kh.alive=false; E.stepWorld(W,0.05); ok(W.cleared,'각혈까지 쓰러뜨리면 맵 정리'); }
{ const KH=KHD;
  const W=W_([dummy('인주',4,8,0,{height:1.6})],[mk(DES['곤봉적'],1,26,14)],42,'free'); lit(W); const kh=E.addUnit(W,{...KH,side:2,x:9,y:8,id:'kh2'}); const [p]=W.units; p.order=null;
  E.stepWorld(W,0.05); ok(kh.seenBy===true,'아군이 본 2편은 보임 (seenBy)');
  for (let i=0;i<60;i++) E.stepWorld(W,0.05); ok(kh.target===p&&(kh.state==='hunt'),'2편은 본 아군을 쫓음 ('+kh.state+')');
  ok(W.intel&&W.intel[0]&&W.intel[0][kh.i]&&W.intel[0][kh.i].seenT!=null,'아군의 짐작 기록에 2편도 (처음 봄)'); }

// 15) 모닝스타 (C2) · 길 비켜 주기 (I21) · 전열 끝 (I22) · 역할 진화 (I25) · 사수 자리 (J24 · J25)
const MSD={ref:'C-005',name:'모닝스타',tier:2,cls:'근접',role:'공격수',weapon:'모닝스타',sm:1.12,height:1.72,weight:62,bold:0.65,noChg:true,ov:{hp:140,atk:30},traits:['근력A','괴력A'],gear:{몸:{name:'경갑',mat:'경갑',tier:1}}};
{ const W=W_([mk(MSD,0,8,8)],[mk(DES['검기사'],1,8.95,8,{ov:{hp:9000}})],51,'free'); lit(W); const [m,k]=W.units; m.order=null; m.state='fight'; m.target=k; hold(k); k.order=null;
  E.startAct(W,k,m,'시험'); const x0=m.x; for (let i=0;i<6;i++) E.stepWorld(W,0.05); ok(m.x<x0-0.15&&/중거리/.test(m.mood||''),'철퇴: 붙은 상대가 치려고 준비하면 철퇴 거리로 물러섬 ('+m.mood+' · '+(x0-m.x).toFixed(2)+'칸)'); }
{ const W=W_([mk(MSD,0,8,8)],[mk(DES['검기사'],1,8.95,8,{ov:{hp:9000}})],52,'free'); lit(W); const [m,k]=W.units; m.order=null; m.state='fight'; m.target=k; k.stunT=1e9;
  ok(!E.flailKeep(W,m,k,0.05),'철퇴: 휘청인 상대 (빈틈) 앞에선 물러서지 않고 침'); }
{ const P0={...REB,traits:[],gear:{},shield:false,ov:{hp:200,atk:10}}; let tsum=0, fin=0;
  for (let sd=1;sd<=5;sd++){ const W=W_([mk({...P0,name:'갑'},0,5,8),mk({...P0,name:'을'},0,15,8)],[mk({...P0,name:'적'},1,28,14)],60+sd,'hold'); lit(W); const [a,b,f]=W.units; f.order={k:'hold'}; a.order={k:'move',x:15,y:8}; b.order={k:'move',x:5,y:8};
    let t=0; for (let i=0;i<200;i++){ E.stepWorld(W,0.05); t+=0.05; if (Math.hypot(a.x-15,a.y-8)<0.4&&Math.hypot(b.x-5,b.y-8)<0.4){ fin++; break; } } tsum+=t; }
  ok(fin===5&&tsum/5<6,'길 비켜 주기: 마주 오는 둘이 비비지 않고 지나감 ('+fin+'/5 · '+(tsum/5).toFixed(1)+'초)'); }
{ const SH={...REB,name:'방패',traits:[],ov:{hp:900,atk:10}}; const W=W_([mk({...GOB},0,6.5,8)],[mk(SH,1,12,6.8),mk(SH,1,12,8),mk(SH,1,12,9.2),mk(DES['궁수'],1,16,8)],71,'hold'); lit(W); const [g,...F]=W.units; hold(g,...F); for (const f of F) f.stunT=1e9; run(W,1);   // 알아보는 데 0.3초 넘게 (본 몸만)
  const v=E.lineEndVia(W,g,F[3],{x:16,y:8}); ok(v&&Math.abs(v.x-12)<0.6&&(v.y<6.2||v.y>9.8),'전열 끝: 상대 전열을 가로지르면 그 끝을 거쳐 감 ('+(v?v.x.toFixed(1)+','+v.y.toFixed(1):'없음')+')');
  ok(!E.lineEndVia(W,g,F[3],{x:10,y:8}),'전열 끝: 막지 않으면 곧장'); }
{ const W=W_([mk({...GOB},0,6,8)],[mk(DES['검기사'],1,26,14)],72,'hold'); lit(W); const g=W.units[0]; hold(W.units[1]);
  ok(g.role==='미드필더','청광묵은 미드필더로 시작');
  E.takeItem(W,g,{k:'weapon',name:'장검',x:g.x,y:g.y}); ok(g.role==='미드필더','검만으론 그대로');
  E.takeItem(W,g,{k:'shield',name:'방패',x:g.x,y:g.y,dur:100}); const ev=W.log.find(l=>l.k==='roleEvo'&&l.a===g.i); ok(g.role==='전선'&&ev&&ev.to==='전선','방패와 검을 함께 들면 전선 (역할 진화 · 기록)');
  E.dropShield(W,g,'drop'); ok(g.role==='미드필더','방패를 잃으면 본디 역할로'); }
{ const W=W_([mk(DES['궁수'],0,6,8)],[mk(DES['검기사'],1,14,8)],73,'hold'); lit(W); const [a,k]=W.units; hold(k);
  E.missSpot(W,a,k,'바위에 가림'); ok(!a.reloc,'한 번 빗나감으론 그대로'); E.missSpot(W,a,k,'바위에 가림'); ok(a.reloc&&a.reloc.b===k.i&&W.log.some(l=>l.k==='reloc'),'같은 까닭으로 두 번 빗나가면 자리를 옮김 (기록)');
  const p=E.spotFor(W,a,k,'각 잡기'); ok(!p||Math.hypot(p.x-6,p.y-8)>=1.3,'옮길 자리는 빗나간 자리 둘레 밖 ('+(p?p.x.toFixed(1)+','+p.y.toFixed(1):'없음')+')'); }
{ const AR={...DES['궁수'],active:['도약']}; const W=W_([mk(AR,0,6,8)],[mk(DES['검기사'],1,13,8)],74,'hold'); lit(W); const [a,k]=W.units; hold(k); a.canLeap=true; a.leapCd=-9;
  a.spot={t:W.t,b:k.i,p:{x:6,y:6.8}}; E.reposition(W,a,k,0.05,'각 잡기'); const lp=W.log.find(l=>l.k==='leap'&&l.a===a.i);
  ok(lp&&/사선 열린 자리/.test(lp.why||''),'도약이 있는 사수는 각 잡기 대신 도약으로 사선 열린 자리로 ('+(lp?lp.why:'안 뜀')+')'); }

console.log(fails ? 'FAILS ' + fails : 'ALL ENG8740 OK'); process.exit(fails ? 1 : 0);
