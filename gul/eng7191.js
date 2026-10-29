// v7.19.1 시험 — eng7191.js v1.5 (v1.5: 공중제비 시험의 맞는 쪽은 맨손 (v9.14.0 손 닿는 창병이 제자리에서 찔러 무구로 받아 냄) · v1.4: 후리기는 1.6초 (v7.24.4 모음 + 한 바퀴) · v1.3: 후리기 시험의 모닝스타는 오래 버팀 (v7.24.1 철퇴 2.3M) · v1.2: 로그 flailSweep · v1.1: 스스로 샷건 시험은 다가오는 검기사 (창병은 던지며 거리를 둠) · 고유 기술: 공중제비 내려찍기 · 뒤로 빠짐 · 머리 찍기 (한 번 · 확정 치명 · 즉사 확률) · 영거리 사격 (특수탄 · 날림) · 철퇴 후리기 (동료도 · 큰 몸이 막으면 멈춤) · 휘둘러 치기 (먼 상대 · 머리 직격) · 스스로 씀)
const {E,R,U,DES,INJ,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const WT=(units,seed,roe)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def=roe||'hold'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:30,H:16,seed:7,units,torches:[{x:10,y:8,r:40}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); return W; };
const FAR=()=>mk(DES['창병'],1,28.5,1.5);
const TANG={ref:'C-221',name:'탕아',tier:2,cls:'근접',role:'공격수',weapon:'대검',sm:1.38,height:1.82,weight:82,ov:{hp:150,atk:34},traits:['베테랑','영웅','지휘B','사격B','회피B'],gear:{몸:{name:'용사의 갑옷',mat:'판금',tier:2}},active:['공중제비']};
const JANG={ref:'C-262',name:'쟝',tier:2,cls:'기동',role:'미드필더',weapon:'장도리',sm:0.81,height:1.8,weight:72,ov:{hp:95,atk:30},traits:['회피A','급소A','후각B','일반인'],active:['머리 찍기']};
const GAN={ref:'C-195',name:'간두',tier:2,cls:'원거리',role:'사수',weapon:'권총',ammo:100,height:1.9,weight:85,sizeCls:'중형',ov:{hp:110,atk:26},traits:['사격A','회피B'],active:['영거리 사격']};
const MOR={ref:'C-005',name:'모닝스타',tier:2,cls:'근접',role:'공격수',weapon:'모닝스타',sm:1.12,height:1.72,weight:62,ov:{hp:140,atk:30},traits:['근력A','괴력A','회피C'],gear:{몸:{name:'경갑',mat:'경갑',tier:1}},active:['철퇴 후리기','휘둘러 치기']};
const TOUGH=x=>({...DES['창병'],ov:{hp:99999,atk:30},...(x||{})});

console.log('A. 탕아 공중제비');
{ const W=WT([mk(TANG,0,6,8,{hero:true}),mk(TOUGH({weapon:'맨손',shield:false}),1,8.9,8),FAR()]);   /* v1.5 맞는 쪽은 맨손 — v9.14.0 부터 손 닿는 창병은 제자리에서 찌르며 무구로 받아 냄 (예전엔 던질 자리만 찾느라 서 있었음) */ const a=W.units[0], t=W.units[1]; t.order={k:'hold'}; const okF=E.startFlip(W,a,t,false); const hp0=t.hp; run(W,0.6);
  const sl=W.log.find(x=>x.k==='slam'), hit=W.log.find(x=>x.k==='hit'&&x.a===a.i&&/내려찍기/.test(x.tag||'')); console.log(`    뜀 ${okF} · 내려찍기 ${!!sl} (${sl?sl.n:0}명) · 피해 ${Math.round(hp0-t.hp)} · 넘어짐 ${W.t<t.proneT}`);
  ok(okF&&sl&&sl.n>=1,'뛰어올라 내려찍음'); ok(Math.hypot(a.x-t.x,a.y-t.y)<1.2,'상대 바로 앞에 내려앉음');
  const W2=WT([mk(TANG,0,6,8,{hero:true}),mk(TOUGH(),1,6.8,8),FAR()]); const b=W2.units[0], e=W2.units[1]; const x0=b.x; E.startFlip(W2,b,e,true); run(W2,0.6); console.log(`    뒤로 빠짐 ${(x0-b.x).toFixed(2)}칸`); ok(x0-b.x>2,'뒤로 2칸 넘게 빠짐'); }

console.log('B. 쟝 머리 찍기');
{ let kills=0, crit=0, n=0; for(let sd=1;sd<=60;sd++){ const W=WT([mk(JANG,0,10,8,{hero:true}),mk({...DES['검기사'],ov:{hp:2000,atk:5}},1,10.75,8),FAR()],sd,'free'); const j=W.units[0], t=W.units[1]; t.order={k:'hold'}; t.canGuard=false; t.raised=false;
    j.order={k:'spec',s:'head',b:t.i}; run(W,3); const h=W.log.find(x=>x.k==='hit'&&x.a===j.i&&/머리 찍기/.test(x.tag||'')); if(h){ n++; if(h.part==='머리'&&h.crit) crit++; if(/즉사/.test(h.tag)) kills++; }
    if(sd===1) console.log('    예', h?JSON.stringify({part:h.part,crit:h.crit,tag:h.tag,dmg:h.dmg}):'없음', '남은 횟수', E.specOf(j,'head').n); }
  console.log(`    60판: 머리 찍기 ${n} · 머리 + 치명 ${crit} · 즉사 ${kills}`); ok(n>=50&&crit===n,'머리 찍기는 늘 머리 · 치명'); ok(kills<=6,'즉사는 드묾 (2%)'); }

console.log('C. 간두 영거리 사격');
{ const W=WT([mk(GAN,0,10,8,{hero:true}),mk(TOUGH(),1,11.2,8),FAR()],1,'free'); const g=W.units[0], t=W.units[1]; t.order={k:'hold'}; const s0=g.shells; g.order={k:'spec',s:'pb',b:t.i}; run(W,0.5);
  const l=W.log.find(x=>x.k==='pb'), sh=W.log.find(x=>x.k==='shove'&&x.a===g.i); console.log(`    특수탄 ${s0} → ${g.shells} · 쏨 ${!!l} · 날려 보냄 ${!!sh}`); ok(l&&g.shells===s0-1&&!!sh,'특수탄 한 발 · 상대가 날아감');
  let auto=0; for(let sd=1;sd<=5;sd++){ const W2=WT([mk(GAN,0,10,8,{hero:true}),mk({...DES['검기사'],weapon:'장검',ov:{hp:99999,atk:10}},1,13,8),FAR()],sd,'free'); const g2=W2.units[0]; run(W2,6); if(W2.log.some(x=>x.k==='pb'&&x.a===g2.i)) auto++; } console.log(`    다가오는 근접에게 스스로 ${auto}/5`); ok(auto>=3,'붙으면 스스로 샷건'); }

console.log('D. 모닝스타 철퇴 후리기 · 휘둘러 치기');
{ const W=WT([mk(MOR,0,10,8,{hero:true,ov:{hp:9000,atk:30}}),mk(TOUGH(),1,11.4,8),mk(TOUGH(),1,8.6,8),mk({...INJ,ov:{hp:500}},0,10,9.3),FAR()],1,'hold'); const m=W.units[0];   /* v7.24.1: 철퇴 2.3M — 창병이 곧장 치러 들어 시험 중에 쓰러지지 않게 */ for(const u of W.units) if(u!==m){ u.order={k:'hold'}; }
  E.startSpec(W,m,null,'sweep','시험'); run(W,1.6); const sw=W.log.find(x=>x.k==='flailSweep'),   /* v1.4: 모음 0.8 + 한 바퀴 0.45 (v7.24.4) */ hitA=W.log.some(x=>x.k==='hit'&&x.a===m.i&&x.b===3);
  console.log(`    후리기: 맞힌 ${sw?sw.n:0} · 멈춤 ${sw&&sw.stop!=null} · 동료 (인주) 도 맞음 ${hitA}`); ok(sw&&sw.n>=2,'둘레를 한 바퀴'); ok(hitA||(sw&&sw.stop!=null),'동료도 맞을 수 있음 (막히면 멈춤)');
  let head=0, n=0; for(let sd=1;sd<=30;sd++){ const W2=WT([mk(MOR,0,8,8,{hero:true}),mk({...DES['검기사'],ov:{hp:5000,atk:5}},1,11,8),FAR()],sd,'free'); const m2=W2.units[0], t=W2.units[1]; t.order={k:'hold'}; t.canGuard=false;
    E.startSpec(W2,m2,t,'hurl','시험'); run(W2,1.0); const h=W2.log.find(x=>x.k==='hit'&&x.a===m2.i&&/휘둘러 치기/.test(x.tag||'')); if(h){ n++; if(h.part==='머리') head++; } }
  console.log(`    휘둘러 치기 30번: 맞음 ${n} · 머리 ${head}`); ok(n>=20&&head>=n*0.35,'먼 상대를 후려침 · 머리 직격 잦음'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 7191 OK');
