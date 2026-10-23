// v8.8.3 엔진 시험 — eng8830.js v1.0 (양동이 뿌리기 다시: 아군 · 적군 모두 맞음 · 옐로는 안 맞음 · 초당 피해 (맥아 상태) · 부상이 쌓임 · 숫자 · 나간 뒤 잠깐 · 죽으면 맥아 부식 · 스스로는 곁에 동료가 없을 때만)
const {E,R,U,DES,GOB,INJ,NOR,KAR,REB,KIT,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec)=>{ const end=W.t+sec; while(W.t<end&&!W.over) E.stepWorld(W,1/30); };
const YEL={ref:'C-008',name:'옐로',tier:2,cls:'기동',role:'미드필더',weapon:'맨손',height:1.55,weight:52,nv:true,nvG:'B',ov:{hp:110,atk:26},traits:['의학B','은신B','사족보행','속력A','근력B','괴력B','제약:총포류','제약:활'],unique:['저주:맥아'],bladeHands:true,active:['연속 도약','돌진','달라붙기 난도질','양동이 뿌리기'],leapN:2,skill:{name:'양동이 약',pool:500,per:120,wind:0.5,rec:0.4,rng:0.8,regen:4}};
const FOE=(x,y,ex)=>mk({...DES['창병'],ov:{hp:9999,atk:5},traits:[],gear:{}},1,x,y,{spdMul:0,...(ex||{})});
const ALLY=(x,y,ex)=>mk({...INJ,ov:{hp:9999,atk:5}},0,x,y,{spdMul:0,...(ex||{})});
const WD=(units)=>{ const W=E.createWorld({type:'grid',W:60,H:20,seed:7,units,torches:[{x:20,y:10,r:60}],flips:[]},JSON.parse(JSON.stringify(R)),1,{headless:true}); W.fxOn=true; W.fx=[]; W.units.forEach(u=>{ if(u.side===1){ u.order={k:'hold'}; u.canCharge=false; u.canLeap=false; } }); return W; };
console.log('A. 아군 · 적군 모두 맞고 옐로는 안 맞음');
{ const W=WD([mk(YEL,0,10,10),ALLY(13.0,10.4),FOE(13.6,9.8)]); const y=W.units[0], al=W.units[1], f=W.units[2]; al.order={k:'hold'}; y.order={k:'spec',s:'ybucket',x:13.3,y:10.1};
  const hp0=[al.hp,f.hp,y.hp]; let nums=0; for(let i=0;i<90;i++){ E.stepWorld(W,1/30); nums+=(W.fx||[]).filter(q=>q.k==='num'&&/^-\d+/.test(q.s)&&q.t0>=W.t-0.04).length; }
  console.log('    1.6초: 아군 hp',(hp0[0]-al.hp).toFixed(1),' 적 hp',(hp0[1]-f.hp).toFixed(1),' 옐로',(hp0[2]-y.hp).toFixed(1),' 숫자',nums);
  ok(al.malt||al.maltDmg>0,'아군도 맥아에 걸림'); ok(f.maltDmg>0,'적도 걸림'); ok(!y.malt&&!(y.maltDmg>0),'뿌린 옐로는 안 걸림'); ok(al.maltDmg>3&&f.maltDmg>3,'초당 피해가 들어감 (아군 '+al.maltDmg.toFixed(1)+' · 적 '+f.maltDmg.toFixed(1)+')');
  ok(nums>=2,'떠오르는 숫자 (-N) '+nums+'번'); ok(W.log.some(l=>l.k==='maltOn'&&l.ff===true),'아군이 걸리면 기록에 같은 편 장판 표시 (ff)'); }
console.log('B. 초당 피해 = 5 (갑옷과 상관없음) · 부상이 쌓임');
{ const W=WD([mk(YEL,0,10,10),ALLY(13.3,10.1,{gear:{몸:{name:'판금',mat:'판금',tier:3}}}),FOE(45,10)]); const y=W.units[0], f=W.units[1]; f.order={k:'hold'}; y.spdMul=0; y.canCharge=false; y.canLeap=false; y.order={k:'spec',s:'ybucket',x:13.3,y:10.1}; run(W,0.9); const t0=W.t, h0=f.hp, m0=f.maltDmg||0; run(W,2);
  const rate=((m0?f.maltDmg-m0:f.maltDmg))/(W.t-t0); console.log('    맥아 피해 초당',rate.toFixed(1),' hp 변화',(h0-f.hp).toFixed(1)); ok(rate>=4&&rate<=6,'초당 5 안팎'); ok((h0-f.hp)>=8,'판금을 입어도 살이 녹음 (hp 줄어듦)');
  run(W,5); const ws=(f.inj||[]).filter(w=>w.k==='malt').length; console.log('    부상',ws,'개:',(f.wounds||[]).join(' / ')); ok(ws>=3,'머문 만큼 부상이 쌓임 ('+ws+'단계)'); ok(W.log.filter(l=>l.k==='wound'&&l.w==='malt').length===ws,'부상 기록 (로그)'); }
console.log('C. 나간 뒤 잠깐 더 · 그 뒤 멈춤 · 죽으면 맥아 부식');
{ const W=WD([mk(YEL,0,10,10),FOE(13.3,10.1)]); const y=W.units[0], f=W.units[1]; y.order={k:'spec',s:'ybucket',b:1}; run(W,1.2); f.x=25; f.y=10; const h1=f.hp; run(W,1.0); const h2=f.hp; run(W,2); ok(h1>h2,'장판을 나간 뒤에도 잠깐 녹음'); ok(f.hp===h2||W.log.some(l=>l.k==='maltStop'),'곧 멈춤 (maltStop)'); ok(!f.malt,'맥아 상태 끝');
  const W2=WD([mk(YEL,0,10,10),FOE(13.3,10.1,{hpNow:12})]); const y2=W2.units[0], f2=W2.units[1]; y2.spdMul=0; y2.canCharge=false; y2.canLeap=false; f2.hp=12; f2.max=100; y2.order={k:'spec',s:'ybucket',b:1}; run(W2,5); const hit=W2.log.find(l=>l.k==='hit'&&l.b===1&&l.tag==='맥아 부식'); ok(!f2.alive&&!!hit,'녹아 죽으면 맥아 부식 (kill 기록 · 태그)'); }
console.log('D. 스스로: 곁에 동료가 있으면 안 뿌림 · 없으면 뿌림');
{ const t=(allyNear)=>{ const us=[mk(YEL,0,10,10),FOE(13.3,10.1),FOE(13.9,10.6)]; if(allyNear) us.push(ALLY(13.4,9.7)); const W=WD(us); W.units[0].target=W.units[1]; W.units[0].state='hunt'; W.units[0].canLeap=false; W.units[0].canCharge=false; W.units[0].spdMul=0; run(W,6); return (W.pools||[]).filter(p=>p.kind==='malt').length+W.log.filter(l=>l.k==='bucket').length; };
  const a=t(true), b=t(false); console.log('    동료 곁:',a,' 동료 없음:',b); ok(a===0,'적 곁에 동료가 있으면 스스로 안 뿌림'); ok(b>=1,'동료가 없으면 무리에게 뿌림'); }
console.log('E. 장판을 본 쪽은 밖으로 피함 (명령 없는 아군 · 적)');
{ const W=WD([mk(YEL,0,10,10),ALLY(13.3,10.0,{spdMul:1}),FOE(13.6,10.4,{spdMul:1})]); const al=W.units[1]; const f=W.units[2]; W.units[0].order={k:'spec',s:'ybucket',x:13.4,y:10.2}; run(W,0.9); run(W,1.5); const dA=Math.hypot(al.x-13.4,al.y-10.2), dF=Math.hypot(f.x-13.4,f.y-10.2); console.log('    중심에서 거리 아군',dA.toFixed(1),' 적',dF.toFixed(1)); ok(dA>1.2||dF>1.2,'누군가 장판 밖으로 피함'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
