// v8.8.4 엔진 시험 — eng8840.js v1.0 (옐로: 돌진 출발은 남들과 같고 달릴수록 훨씬 빠름 · 달라붙기 난도질 3 ~ 5타 + 저항 게이지 · 도약 스택제 (짧으면 하나 · 멀면 둘 다 · 쿨마다 충전))
const {E,R,U,DES,GOB,INJ,NOR,KAR,REB,KIT,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec)=>{ const end=W.t+sec; while(W.t<end&&!W.over) E.stepWorld(W,1/30); };
const YEL={ref:'C-008',name:'옐로',tier:2,cls:'기동',role:'미드필더',weapon:'맨손',height:1.55,weight:52,nv:true,nvG:'B',ov:{hp:110,atk:26},traits:['의학B','은신B','사족보행','속력A','근력B','괴력B','제약:총포류','제약:활'],unique:['저주:맥아'],bladeHands:true,active:['연속 도약','돌진','달라붙기 난도질','양동이 뿌리기'],leapN:2,skill:{name:'양동이 약',pool:500,per:120,wind:0.5,rec:0.4,rng:0.8,regen:4}};
const FOE=(x,y,ex,def)=>mk(def||{...DES['창병'],ov:{hp:9999,atk:5},traits:[],gear:{}},1,x,y,{spdMul:0,...(ex||{})});
const WD=(units)=>{ const W=E.createWorld({type:'grid',W:60,H:20,seed:7,units,torches:[{x:20,y:10,r:60}],flips:[]},JSON.parse(JSON.stringify(R)),1,{headless:true}); W.fxOn=true; W.fx=[]; W.units.forEach(u=>{ if(u.side===1){ u.order={k:'hold'}; u.canCharge=false; u.canLeap=false; } }); return W; };
console.log('A. 돌진: 출발은 남들과 같고 달릴수록 훨씬 빠름');
{ const C=R.charge, Y=R.claw.rush; const f=(c,run)=>(c.sp0)+(c.spd-c.sp0)*Math.pow(Math.min(1,run/c.full),c.pow||1);
  console.log('    남들 sp0',C.sp0,'→',C.spd,' 옐로 sp0',Y.sp0,'→',Y.spd,'(pow',Y.pow,'full',Y.full+')'); ok(Y.sp0===C.sp0,'출발 배율이 남들과 같음 (×'+C.sp0+')'); ok(Y.spd>=C.spd*1.4,'최고 배율이 남들보다 훨씬 큼 (×'+Y.spd+' vs ×'+C.spd+')');
  const rr=[0,0.5,1,1.5,2,3,4,5,6]; ok(rr.every(x=>f(Y,x)>=f(C,x)-1e-9),'어느 거리에서도 남들보다 느리지 않음 ('+rr.map(x=>(f(Y,x)/f(C,x)).toFixed(2)).join(' ')+')');
  const W=WD([mk(YEL,0,10,10),FOE(18,10)]); const y=W.units[0]; y.order={k:'charge',b:1}; const sp=[]; let px=y.x; for(let i=0;i<150&&!W.over;i++){ E.stepWorld(W,1/30); if(y.act&&y.act.k==='charge'&&y.act.phase==='run'){ sp.push(Math.abs(y.x-px)*30); } px=y.x; }
  const a=sp.slice(0,3).reduce((s,v)=>s+v,0)/3, b=sp.slice(-3).reduce((s,v)=>s+v,0)/3; console.log('    실제 달린 걸음 처음',a.toFixed(1),'→ 끝',b.toFixed(1),'칸/초'); ok(b>a*2.5,'처음 낮게 출발해 끝에서 크게 빨라짐 (×'+(b/a).toFixed(1)+')'); }
console.log('B. 달라붙기 난도질: 3 ~ 5타 + 저항 게이지');
{ const trial=(def,ex)=>{ const W=WD([mk(YEL,0,10,10),FOE(11.2,10,ex,def)]); const y=W.units[0], f=W.units[1]; if(def) { f.hp=f.max=9999; } y.order={k:'spec',s:'yclaw',b:1}; run(W,0.6); const held=f.heldBy===0; const A=y.act; const n=A&&A.n; const gauge=[]; for(let i=0;i<90&&f.heldBy===0;i++){ E.stepWorld(W,1/30); if(y.act&&y.act.res!=null) gauge.push(y.act.res); } run(W,0.6);
    const hits=W.log.filter(l=>l.k==='hit'&&l.a===0&&/할큄/.test(l.tag||'')).length; return { held, n, hits, gauge, end:W.log.some(l=>l.k==='clawEnd'), grab:W.log.find(l=>l.k==='tearGrab'&&l.s==='yclaw') }; };
  const human=trial(), small=trial({...DES['창병'],ov:{hp:9999,atk:5},traits:[],gear:{},weight:35,height:1.25},{}), big=trial({...KAR,ov:{hp:9999,atk:5,rng:0.6}},{});
  console.log('    사람(창병) n',human.n,'타',human.hits,' 작은 고블린 n',small.n,'타',small.hits,' 거구 n',big.n,'타',big.hits);
  for (const [nm,q] of [['사람',human],['고블린',small]]){ ok(q.held,nm+': 붙잡힘'); ok(q.hits>=3&&q.hits<=5&&q.hits===q.n,nm+': 3 ~ 5타 (정한 타수 '+q.n+' = 친 타수 '+q.hits+')'); ok(q.end,nm+': 마무리'); ok(q.gauge.length>3&&q.gauge.every((v,i,a)=>i===0||v>=a[i-1]-1e-9)&&q.gauge[q.gauge.length-1]>0.6,nm+': 저항 게이지가 차오름 (0 → 1)'); }
  ok(small.n>=human.n&&human.n>=big.n,'가벼울수록 타수가 많음 (고블린 '+small.n+' ≥ 사람 '+human.n+' ≥ 거구 '+big.n+')'); ok(small.n===5&&big.n===3||big.n<=4,'가장 가벼우면 5타 · 가장 무거우면 3타 가까이'); ok(human.grab&&human.grab.n===human.n,'붙잡는 기록에 타수 (n)'); }
console.log('C. 도약 스택: 짧으면 하나 · 멀면 둘 다 · 쿨마다 충전');
{ const lp=(dx)=>{ const W=WD([mk(YEL,0,10,10),FOE(40,10)]); const y=W.units[0]; y.order={k:'leap',x:10+dx,y:10}; run(W,0.1); const lg=W.log.filter(l=>l.k==='leap'&&l.a===0); return { W,y,len:lg.length?lg[0].len:0, stk:y.stk }; };
  const sh=lp(1.0), md=lp(1.7), lo=lp(5);
  console.log('    짧게(1.0) 뜀',sh.len,'칸 · 남은 스택',sh.stk,'   보통(1.7)',md.len,'칸 · 남은',md.stk,'   멀리(5.0 찍음)',lo.len,'칸 · 남은',lo.stk);
  ok(sh.stk===1&&sh.len<=1.1,'짧게 찍으면 스택 하나만 (남은 1)'); ok(md.stk===1,'한 번 거리 (1.7) 는 스택 하나'); ok(lo.stk===0&&lo.len>=3.2&&lo.len<=3.45,'멀리 찍으면 둘 다 쓰고 3.4칸까지 한 번에 (남은 0)');
  const y=lo.y, W=lo.W; ok(W.t<y.leapCd,'스택이 없으면 다음 스택이 찰 때까지 못 뜀 ('+(y.leapCd-W.t).toFixed(1)+'초)'); run(W,2.4); ok(y.stk===1,'쿨 (2.2초) 이 지나면 스택 하나 충전 (지금 '+y.stk+')'); run(W,2.4); ok(y.stk===2,'다시 2.2초 뒤 둘 다 참 (지금 '+y.stk+')');
  const W2=lp(1.0).W, y2=W2.units[0]; y2.order={k:'leap',x:y2.x+1.5,y:10}; run(W2,0.5); ok(y2.stk===0||y2.stk===1,'스택 하나 남았을 때 한 번 더 뜀 (남은 '+y2.stk+')'); }
{ const hop=(gap)=>{ const W=WD([mk(YEL,0,10,10),FOE(10+gap+0.6,10)]); const y=W.units[0]; y.canCharge=false; y.target=W.units[1]; y.state='hunt'; run(W,0.25); const lg=W.log.filter(l=>l.k==='leap'&&l.a===0&&l.dir==='fwd'); return { n:lg.length, len:lg.length?lg[0].len:0, stk:y.stk }; };
  const far=hop(3.0), near=hop(1.3); console.log('    스스로: 3.0칸 떨어진 적 → 뜀',far.n,'번 · 첫 도약',far.len,'칸 · 남은 스택',far.stk,'  1.3칸 → 첫 도약',near.len,'칸 · 남은',near.stk);
  ok(far.len>=2.4&&far.stk===0,'멀리 있는 적에게는 스택 둘로 한 번에 뛰어듦'); ok(near.n>=1&&near.stk===1,'가까운 적에게는 스택 하나로 뛰어듦'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
