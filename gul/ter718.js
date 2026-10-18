// v7.18 시험 — ter718.js v1.1 (v1.1: 이동 시험엔 먼 적 하나 (판이 바로 끝나지 않게) · 무더기 바로 뒤 사수는 먼 적을 봄 · 지형: 더미 = 못 지나감 · 시야/탄은 높이로 · 무작위 1F 지형 · 엄폐 드러난 몫 · 웅크림 · 엎드림 · 엄폐에 막힘 · 언덕 마루 · 고지 시야 · 고지 명중 · 근접 고저 · 오르막 느림 · 비탈 미끄러짐)
const {E,R,U,DES,NOR,INJ,GOB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const WT=(units,ter,seed,roe)=>{ const R2=JSON.parse(JSON.stringify(R)); if(roe) R2.roe.def=roe; R2.roe.autoLift=false; return E.createWorld({type:'grid',W:30,H:16,seed:7,units,torches:[],flips:[],...ter},R2,seed||1,{headless:true}); };
const lit=W=>{ W.torches=[{x:10,y:8,r:40}]; E.computeLight(W); };

console.log('A. 지형 만들기');
{ const m=E.buildMap({type:'grid',W:30,H:16,flips:[],units:[],torches:[],piles:['11,8,1','11,9,1','20,4,2'],hills:[{x:6,y:6,r:3,h:2}]});
  ok(E.rock(m,11.5,8.5)&&!E.solid(m,11.5,8.5)&&E.pileAt(m,11.5,8.5)===1&&E.pileAt(m,20.5,4.5)===2,'더미 = 못 지나감 · 시야 바위 아님 · 종류');
  ok(Math.abs(E.gH(m,6,6)-2)<0.01&&E.gH(m,20,12)<0.01,'언덕 꼭대기 2M · 먼 곳 0');
  const st={type:'grid',W:30,H:16,flips:[],units:[{x:5.5,y:5.5},{x:15.5,y:13.5}],torches:[],terr:'1F',tseed:42}, a=E.buildMap(st), b=E.buildMap(st);
  ok(a.piles>0&&a.piles===b.piles&&JSON.stringify(a.hills)===JSON.stringify(b.hills),'1F 무작위 지형 — 같은 씨앗이면 같음 (더미 '+a.piles+'칸 · 언덕 '+(a.hills?a.hills.length:0)+')');
  ok(!E.rock(a,5.5,5.5)&&!E.rock(a,15.5,13.5),'서 있는 칸에는 더미가 없음');
  let hl=0, pl=0; for(let s=1;s<=20;s++){ const m2=E.buildMap({...st,tseed:s}); if(m2.hills) hl++; pl+=m2.piles; } console.log(`    1F 20판: 언덕 있는 판 ${hl} · 더미 평균 ${(pl/20).toFixed(1)}칸`); ok(hl>=3&&hl<=15,'1F 는 가끔 언덕');
  const h2=E.buildMap({...st,terr:'hills',tseed:5}); ok(h2.hills&&h2.hills.length>=2,'언덕 많음 = 둘 이상'); }

console.log('B. 엄폐 · 드러난 몫 · 웅크림 · 엎드림');
{ const W=WT([mk(NOR,0,4.5,8.5),mk(INJ,1,12.4,8.5)],{piles:['11,8,1','11,7,1','11,9,1','20,8,2']}); lit(W); const n=W.units[0], t=W.units[1]; t.state='idle';
  const e0=E.expoOf(W,n,t), a0=E.aimP(W,n,t); t.stealth=true; t.stealthE=1; const e1=E.expoOf(W,n,t), see1=E.canSee(W,n,t); t.stealth=false;
  console.log(`    서 있음 드러남 ${e0.toFixed(2)} · 명중 ${a0.toFixed(2)} | 웅크림 ${e1.toFixed(2)} · 보임 ${see1}`);
  ok(e0>0.15&&e0<0.6,'무더기 뒤에 서면 머리 · 어깨만 드러남'); ok(e1===0&&!see1,'웅크리면 (은신) 다 가려져 안 보임');
  const W2=WT([mk(NOR,0,4.5,8.5),mk(INJ,1,12.4,8.5)],{}); lit(W2); const a1=E.aimP(W2,W2.units[0],W2.units[1]); ok(a0<a1*0.6,`엄폐 뒤 명중이 줄어듦 (${a0.toFixed(2)} < 트인 곳 ${a1.toFixed(2)})`);
  t.x=21.4; t.y=8.5; const ec=E.expoOf(W,n,t); t.lie=true; const el=E.expoOf(W,n,t); t.lie=false; console.log(`    굳은 시체 뒤: 서 있음 ${ec.toFixed(2)} · 엎드림 ${el.toFixed(2)}`); ok(ec>0.5&&el===0,'낮은 시체 뒤는 엎드려야 가려짐');
  n.x=10.5; t.x=24.4; t.y=12.5; const eS=E.expoOf(W,n,t); ok(eS>0.9,'무더기 바로 뒤에 선 사수는 넘어 쏨 (드러남 '+eS.toFixed(2)+')'); }

console.log('C. 엄폐에 막힘 (탄)');
{ let cov=0, hit=0, n=0; for(let sd=1;sd<=12;sd++){ const W=WT([mk(NOR,0,4.5,8.5),mk({...INJ,ov:{hp:9999}},1,12.4,8.5)],{piles:['11,8,1','11,7,1','11,9,1']},sd,'hold'); lit(W); const s=W.units[0], t=W.units[1]; t.order={k:'hold'};
    for(let k=0;k<6;k++){ E.launch(W,s,t,1,1,false); run(W,0.4); n++; } cov+=W.log.filter(l=>l.k==='miss'&&l.cover).length; hit+=W.log.filter(l=>l.k==='hit'&&l.a===s.i).length; }
  console.log(`    ${n}발 — 엄폐에 막힘 ${cov} · 맞음 ${hit}`); ok(cov>=8,'빗나간 탄 중 엄폐에 막힌 것이 있음'); }

console.log('D. 언덕: 마루 너머 · 고지 시야 · 고지 명중');
{ const H={hills:[{x:10,y:8,r:2.5,h:2.6}]}; const W=WT([mk(NOR,0,3.5,8.5),mk(INJ,1,16.5,8.5)],H); lit(W); const n=W.units[0], t=W.units[1];
  const e0=E.expoOf(W,n,t), s0=E.canSee(W,n,t); n.x=10; n.y=8; const e1=E.expoOf(W,n,t), s1=E.canSee(W,n,t);
  console.log(`    아래 → 너머: 드러남 ${e0.toFixed(2)} 보임 ${s0} | 꼭대기 → 아래: ${e1.toFixed(2)} 보임 ${s1}`); ok(!s0&&s1,'언덕 마루 너머는 안 보이고, 꼭대기에선 보임');
  const up=E.aimP(W,n,t); n.x=16.5; n.y=8.5; t.x=10; t.y=8; const dn=E.aimP(W,n,t); console.log(`    명중 위→아래 ${up.toFixed(2)} · 아래→위 ${dn.toFixed(2)}`); ok(up>dn,'고지에서 쏘면 더 잘 맞음');
  const sg=W.rules.sight; n.x=10; n.y=8; t.x=10+sg+0.8; t.y=8; const sF=E.canSee(W,n,t); n.x=24; n.y=8; t.x=24+sg+0.8; const sF0=E.canSee(W,n,t); ok(sF&&!sF0,'꼭대기에선 더 멀리 봄 (시야 '+sg+'칸 + 높이)');
  const k=E.hiMelee(W,{x:10,y:8},{x:11.5,y:8},false), k2=E.hiMelee(W,{x:11.5,y:8},{x:10,y:8},false); console.log(`    근접 위 ${k.toFixed(3)} · 아래 ${k2.toFixed(3)}`); ok(k>1&&k2<1,'근접도 높은 쪽이 셈'); }

console.log('E. 오르막 느림 · 비탈 미끄러짐');
{ const H={hills:[{x:15,y:8,r:3,h:2.5}]}; const go=(ter,x0,x1,hurry)=>{ const W=WT([mk(INJ,0,x0,8.5,{hero:true}),mk(DES['창병'],1,28.5,1.5)],ter,1,'hold'); lit(W); W.units[1].order={k:'hold'}; const u=W.units[0]; u.order={k:'move',x:x1,y:8.5,hurry:!!hurry}; const x=u.x; run(W,1); return Math.abs(u.x-x); };
  const flat=go({},9,14), up=go(H,10,15); console.log(`    1초 이동 평지 ${flat.toFixed(2)} · 오르막 ${up.toFixed(2)}`); ok(up<flat*0.9,'오르막은 느림');
  let tr=0, trF=0; for(let sd=1;sd<=25;sd++){ for(const ter of [H,{}]){ const W=WT([mk(INJ,0,15,8.5,{hero:true}),mk(DES['창병'],1,28.5,1.5)],ter,sd,'hold'); lit(W); W.units[1].order={k:'hold'}; const u=W.units[0]; u.order={k:'move',x:21,y:8.5,hurry:true}; run(W,2); const n=W.log.filter(l=>l.k==='prone'&&/미끄러짐/.test(l.why||'')).length; if(ter===H) tr+=n; else trF+=n; } }
  console.log(`    뛰어 내려감 25번: 미끄러짐 ${tr} · 평지 ${trF}`); ok(tr>=1&&trF===0,'비탈을 뛰면 가끔 미끄러짐 (평지는 없음)'); }

console.log('F. 평지 판은 그대로');
{ const W=WT([mk(NOR,0,4.5,8.5),mk(INJ,1,12.4,8.5)],{}); ok(!E.terrOn(W)&&E.expoOf(W,W.units[0],W.units[1])===1,'지형 없으면 보정 없음'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 718 OK');
