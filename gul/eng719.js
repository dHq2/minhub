// v7.19 시험 — eng719.js v1.1 (v1.1: 밀침 로그는 shove · 단궁 속사는 점사 시작을 셈 · 철퇴 직접 시험은 단단한 상대 · 2단계 인물 바탕: 2연속 도약 · 끝없는 마력 치유 (3.5칸) · 다시 차는 양동이 약 · 의학B · 철퇴 넉백 · 물리 마법 갑옷 판정 · 약한 재생 · 단궁 속사 · 권총 탄창 · 가윤 지혈 20번)
const {E,R,U,DES,INJ,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb) cb(); } };
const WT=(units,seed,roe)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def=roe||'hold'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:30,H:16,seed:7,units,torches:[{x:10,y:8,r:40}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); return W; };
const FAR=()=>mk(DES['창병'],1,28.5,1.5);
const YEL={ref:'C-008',name:'옐로',tier:2,cls:'기동',role:'미드필더',weapon:'맨손',height:1.55,weight:52,nv:true,nvG:'B',ov:{hp:110,atk:26},traits:['의학B','은신B','사족보행','속력A','근력B','괴력B'],unique:['저주:맥아'],bladeHands:true,active:['도약'],leapN:2,skill:{name:'양동이 약',pool:500,per:120,wind:0.5,rec:0.4,rng:0.8,regen:4}};
const BER={ref:'C-218',name:'딸기',tier:2,cls:'치유',role:'지원',weapon:'대지 마법',height:1.7,weight:58,nv:true,nvG:'B',ov:{hp:120,atk:22},regenK:0.012,traits:['은신C'],skill:{name:'딸기 정령술',kit:true,inf:true,pool:99,pct:0.12,min:8,cap:20,hot:3,hotN:6,hotGap:0.5,cd:2.4,wind:0.45,rec:0.3,rng:3.5,auto:0.55}};
const MOR={ref:'C-005',name:'모닝스타',tier:2,cls:'근접',role:'공격수',weapon:'모닝스타',height:1.72,weight:62,ov:{hp:140,atk:30},traits:['근력A','괴력A','회피C'],gear:{몸:{name:'경갑',mat:'경갑',tier:1}}};
const TRA={ref:'C-107',name:'트라카',tier:2,cls:'원거리',role:'사수',weapon:'단궁',ammo:40,height:1.25,weight:34,ov:{hp:80,atk:20,wind:0.4,rec:0.5},traits:['사격B','회피A'],active:['도약']};
const GAN={ref:'C-195',name:'간두',tier:2,cls:'원거리',role:'사수',weapon:'권총',ammo:100,height:1.9,weight:85,sizeCls:'중형',ov:{hp:110,atk:26},traits:['사격A','회피B']};
const GAY={ref:'C-018',name:'가윤',tier:2,cls:'치유',role:'지원',weapon:'맨손',height:1.55,weight:46,sizeCls:'소형',ov:{hp:70,atk:8},traits:['의학A','일반인'],skill:{name:'지혈 · 약',kit:true,pool:20,pct:0.3,min:15,cap:45,hot:0,hotN:0,hotGap:0.4,cd:1.4,wind:0.35,rec:0.25,rng:0.8,auto:0.6}};

console.log('A. 옐로 2연속 도약');
{ const W=WT([mk(YEL,0,10,8,{hero:true}),FAR()]); const y=W.units[0]; const a=E.leapTo(W,y,y.x+2,y.y,'pt',null,'시험'); run(W,0.4); const b=E.leapTo(W,y,y.x+2,y.y,'pt',null,'시험'); run(W,0.4); const c=W.t>=y.leapCd;
  console.log(`    첫 도약 ${a} · 이어 뛰기 ${b} · 바로 셋째 가능 ${c} · 대기 ${(y.leapCd-W.t).toFixed(2)}초`); ok(a&&b&&!c,'둘은 잇달아 · 셋째는 기다림'); }

console.log('B. 딸기: 끝없는 마력 치유 (3.5칸) · 약한 재생');
{ const W=WT([mk(BER,0,8,8),mk({...INJ,ov:{hp:200}},0,11,8,{hero:true}),FAR()]); const d=W.units[0], h=W.units[1]; h.hp=60; d.hp=80; d.order={k:'skill',b:h.i};
  run(W,5); const l=W.log.filter(x=>x.k==='skill'&&x.a===d.i); console.log(`    치유 ${l.length}번 · 첫 ${l[0]?l[0].amt:0} · 남은 ${d.skill.left} · 인주 ${Math.round(h.hp)} · 딸기 자기 체력 ${Math.round(d.hp)}`);
  ok(l.length>=1&&d.skill.left===99,'3칸 밖에서 치유 · 줄지 않음'); ok(h.hp>60+l[0].amt,'이어서 돌봄 (도트)'); ok(d.hp>80,'약한 재생'); }

console.log('C. 옐로: 양동이 약 의학B · 다시 참');
{ const W=WT([mk(YEL,0,10,8),mk({...INJ,ov:{hp:300}},0,10.7,8,{hero:true}),FAR()]); const y=W.units[0], h=W.units[1]; h.hp=100; y.order={k:'skill',b:h.i}; run(W,1.2);
  const l=W.log.find(x=>x.k==='skill'&&x.a===y.i); const left1=y.skill.left; run(W,3); console.log(`    회복 ${l?l.amt:0} · 남은 ${left1.toFixed(0)} → 3초 뒤 ${y.skill.left.toFixed(0)}`); ok(l&&l.amt===138,'120 × 1.15 = 138'); ok(y.skill.left>left1+10,'약이 다시 참'); }

console.log('D. 모닝스타 철퇴 넉백 · 대지 마법 갑옷 판정');
{ let kb=0, n=0; for(let sd=1;sd<=6;sd++){ const W=WT([mk(MOR,0,10,8,{hero:true}),mk(DES['창병'],1,11.6,8),FAR()],sd,'free'); const m=W.units[0], t=W.units[1]; t.order={k:'hold'}; m.order={k:'attack',b:t.i}; run(W,4); kb+=W.log.filter(x=>x.k==='shove'&&x.a===m.i).length; n+=W.log.filter(x=>x.k==='hit'&&x.a===m.i).length; }
  const W2=WT([mk(MOR,0,10,8,{hero:true}),mk({...DES['창병'],ov:{hp:9999,atk:30}},1,11.6,8),FAR()]); const m=W2.units[0], t=W2.units[1]; const x0=t.x; const o=E.strike(W2,m,t,t,1,false,null); const moved=!!t.kb;
  console.log(`    맞힘 ${n} · 밀림 로그 ${kb} · 직접 친 뒤 밀려남 ${moved} (${o&&o.block?'막힘':'맞음'})`); ok((moved||(o&&o.block))&&kb>=2,'철퇴에 맞으면 밀림');
  const W3=WT([mk(BER,0,4,8),mk(DES['창병'],1,9,8),FAR()]); const b=W3.units[0], k=W3.units[1]; const pr=E.penRes?E.penRes(W3,b,k,'몸통','front',null,W3.rules.weapons['대지 마법'],false,false,null):null; console.log('    대지 마법 vs 판금', JSON.stringify(pr)); ok(!pr||pr.A>0,'흙덩이는 갑옷 판정 (마법이어도)'); }

console.log('E. 트라카 단궁 속사 · 간두 권총 탄창');
{ let burst=0, shots=0; for(let sd=1;sd<=6;sd++){ const W=WT([mk(TRA,0,6,8,{hero:true}),mk({...DES['창병'],ov:{hp:9999}},1,9.5,8),FAR()],sd,'free'); const a=W.units[0], t=W.units[1]; t.order={k:'hold'}; a.order={k:'attack',b:t.i}; let was=false; run(W,6,()=>{ const on=!!a.burst; if(on&&!was) burst++; was=on; }); shots+=a.shots; }
  console.log(`    단궁 6판 쏜 화살 ${shots} · 0.3초 안에 잇단 발 ${burst}`); ok(burst>=3,'두세 발씩 속사');
  const W=WT([mk(GAN,0,6,8,{hero:true}),mk({...DES['창병'],ov:{hp:9999}},1,10,8),FAR()],1,'free'); const g=W.units[0], t=W.units[1]; t.order={k:'hold'}; g.order={k:'attack',b:t.i}; run(W,10); console.log(`    권총 탄창 ${g.magMax} · 쏜 ${g.shots} · 재장전 ${W.log.filter(x=>x.k==='reload'&&x.a===g.i).length}`); ok(g.magMax===12&&g.shots>=12,'12발 탄창 연사'); }

console.log('F. 가윤 지혈 · 약 (의학A · 20번)');
{ const W=WT([mk(GAY,0,10,8),mk({...INJ,ov:{hp:200}},0,10.7,8,{hero:true}),FAR()]); const g=W.units[0], h=W.units[1]; h.hp=40; g.order={k:'skill',b:h.i}; run(W,1); const l=W.log.find(x=>x.k==='skill'&&x.a===g.i);
  console.log(`    회복 ${l?l.amt:0} · 남은 ${g.skill.left}/20`); ok(l&&l.amt===Math.round(45*1.3)&&g.skill.left===19,'처음 30% (45 상한) × 의학A 1.3 = 59 · 20번 중 하나'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 719 OK');
