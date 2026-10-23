// v8.7.8 엔진 시험 (4) — eng8780d.js v1.1 (v1.1: 재생 · 날개 방패 끝을 잴 때는 치유 방침 '명령만' (마력 치유의 기본이 '알아서' 가 되어 기본 치유가 섞이던 것) · 마력 치유의 기본 방침 시험 · v1.0: 물레 · 콜라이더 · 테헤라 — 몸 · 정령 계약 · 정령의 손길 · 정령 강림 · 정령 방벽 · 땅의 정령 · 물 정령 탄 / 갈퀴 꼬리 · 별빛 지목 · 차원 문 · 마계 장막 · 유혹의 손짓 · 마계 대사 /
//   축복:테헤라 · 요정 날개 · 요정의 축복 · 광역 손짓 · 은빛 비행 · 날개 방패 · 나른한 꿈 · 명령 · 스스로 (적 · 아군 같은 두뇌))
const {E,R,U,REB,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const logK=(W,k)=>W.log.filter(l=>l.k===k);
const MU={ref:'C-174',name:'물레',tier:2,cls:'치유',role:'지원',weapon:'정령 지시',sm:0.93,height:1.72,weight:55,sizeCls:'중형',nv:true,nvG:'B',ov:{hp:280,atk:26},traits:[],unique:['정령 계약'],race:'정령 (물 — 대정령)',origin:'정령계',active:['정령 강림','정령 방벽','땅의 정령','물 정령 탄'],skill:{name:'정령의 손길',kit:true,inf:true,pool:99,pct:0.25,min:10,cap:999,hot:0,hotN:0,cd:10,wind:0.5,rec:0.4,rng:10,auto:0.55,hotB:0.02,hotT:4},gear:{}};
const CO={ref:'C-175',name:'콜라이더',tier:2,cls:'근접',role:'미드필더',weapon:'갈퀴 꼬리',sm:1.04,height:1.8,weight:58,sizeCls:'중형',nv:true,nvG:'A',ov:{hp:320,atk:34},traits:['갑피C','괴력C','속력B'],unique:['마계 대사'],race:'마족 (심연계)',origin:'마계 (차원계에 가까움)',active:['별빛 지목','차원 문','마계 장막','유혹의 손짓'],gear:{}};
const TE={ref:'C-016',name:'테헤라',tier:2,cls:'치유',role:'지원',weapon:'손짓',sm:0.98,height:1.7,weight:40,sizeCls:'중형',nv:true,nvG:'B',ov:{hp:200,atk:18},traits:['축복:테헤라'],unique:['요정 날개'],race:'요정',origin:'외계',active:['광역 손짓','은빛 비행','날개 방패','나른한 꿈'],skill:{name:'요정의 축복',kit:true,inf:true,pool:99,pct:0.25,min:10,cap:999,hot:0,hotN:0,cd:9,wind:0.5,rec:0.4,rng:5,auto:0.55,aoe:5,gK:0.85,gT:4},gear:{}};
const dummy=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:900,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const archer=(name,x,y,side,ex)=>mk({ref:'C-056',name,tier:2,cls:'원거리',role:'사수',weapon:'궁수의 활',ammo:99,nv:true,nvG:'A',ov:{hp:300,atk:30},traits:['사격A'],gear:{},...(ex||{})},side,x,y);
const WF=(units,o)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def=(o&&o.roe)||'hold'; R2.roe.autoLift=false; if(o&&o.rules) o.rules(R2); const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[],...(o&&o.rocks?{rocks:o.rocks}:{})},R2,(o&&o.seed)||1,{headless:true}); E.computeLight(W); for(const u of W.units) for(const x of u.spec||[]) x.cdT=-9; return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++){ const t0=W.t; E.stepWorld(W,1/30); if(W.t===t0) W.t+=1/30; } };
const hold=(u,...ks)=>{ for(const k of ks){ const x=(u.spec||[]).find(s=>s.k===k); if(x) x.cdT=1e9; } };
const holdAll=u=>{ for(const x of u.spec||[]) x.cdT=1e9; if(u.skill) u.skill.cdT=1e9; };
const freeze=W=>{ for(const u of W.units){ u.state='idle'; u.target=null; u.goal=null; u.path=null; } };
const still=(...us)=>{ for(const u of us){ u.order={k:'hold'}; u.ev=0.0001; u.spd=0.001; } };
const runAct=(W,u,n)=>{ let k=n||200; while(k-->0&&u.act) step(W); return k>0; };
const SUP=['mdesc','mwall','mspirit','mvolley','cgate','cstar','cveil','clure','tsweep','tflight','twing','tdream'];

console.log('A. 몸 — 기술 · 무기 · 치유 틀 · 표시');
{ const W=WF([mk(MU,0,10,10),mk(CO,0,12,10),mk(TE,0,14,10),dummy('적',30,10,1)]); const m=W.units[0], c=W.units[1], t=W.units[2];
  ok((m.spec||[]).map(x=>x.k).join()==='mdesc,mwall,mspirit,mvolley'&&m.mulKit&&m.supKit,'물레 기술: '+(m.spec||[]).map(x=>x.name).join(' · ')+' · ◆정령 계약');
  ok((c.spec||[]).map(x=>x.k).join()==='cstar,cgate,cveil,clure'&&c.colKit,'콜라이더 기술: '+(c.spec||[]).map(x=>x.name).join(' · ')+' · ◆마계 대사');
  ok((t.spec||[]).map(x=>x.k).join()==='tsweep,tflight,twing,tdream'&&t.fairyW&&t.tBless,'테헤라 기술: '+(t.spec||[]).map(x=>x.name).join(' · ')+' · [축복:테헤라] · ◆요정 날개');
  const WP=E.DEFAULT_RULES.weapons; ok(WP['정령 지시'].kind==='마법'&&WP['정령 지시'].rng===12&&WP['손짓'].kind==='마법'&&!WP['손짓'].lob&&WP['갈퀴 꼬리'].tail,'무기: 정령 지시 (마법 12칸) · 손짓 (마법 12칸 · 곡사 없음) · 갈퀴 꼬리');
  ok(!E.isFar(c)&&c.longReach&&c.rng>=2.3,'콜라이더의 꼬리 (몸끼리 '+c.rng+'칸) 는 사수가 아님');
  ok(E.isFar(m)&&E.isFar(t),'물레 · 테헤라는 원거리 (마법 탄)');
  ok(m.skill&&m.skill.kit&&m.skill.inf&&m.skill.hotB===0.02&&m.skill.rng===10,'물레 치유 틀: 정령의 손길 (마력 · 10칸 · 이어서 초당 2%)');
  ok(t.skill&&t.skill.aoe===5&&t.skill.gK===0.85,'테헤라 치유 틀: 요정의 축복 (곁 5칸 모두 · 받는 피해 × 0.85)'); }

console.log('B. ◆정령 계약 — 최대 체력 +8% · 곁 5칸 초당 0.6% · 쓰러진 [불사] 동료가 두 배 빨리');
{ const W=WF([mk(MU,0,10,10),dummy('동료',11,10,0),dummy('먼 동료',30,3,0),dummy('적',35,17,1)]); const m=W.units[0], a=W.units[1], far=W.units[2]; holdAll(m); freeze(W); still(...W.units);
  const a0=a.max, m0=m.max; step(W,2);
  ok(a.max===a0+Math.round(a0*0.08)&&m.max===m0+Math.round(m0*0.08)&&far.max>a0,'편 모두 최대 체력 +8% ('+a0+' → '+a.max+' · 물레 '+m0+' → '+m.max+')');
  a.hp=a.max*0.5; far.hp=far.max*0.5; const h0=a.hp, f0=far.hp; step(W,30);
  ok(a.hp>h0+a.max*0.005&&Math.abs(far.hp-f0)<0.01,'곁 5칸만 회복 ('+(a.hp-h0).toFixed(1)+' / 1초 · 먼 동료 '+(far.hp-f0).toFixed(1)+')');
  ok(logK(W,'pact').length===1,'기록: 정령 계약'); }
{ const mkW=pact=>{ const L=[dummy('불사',10,10,0,{traits:['불사']}),dummy('적',35,17,1),dummy('곁의 동료',8,12,0)]; if(pact) L.push(mk(MU,0,12,10)); const W=WF(L); freeze(W); still(...W.units); for(const u of W.units) holdAll(u); return W; };
  const T=pact=>{ const W=mkW(pact), u=W.units[0]; step(W,2); E.applyDmg(W,W.units[1],u,u.hp+5,{tag:'시험'}); let k=0; while(k<3000&&u.down){ step(W); k++; } return k/30; };
  const t0=T(false), t1=T(true); ok(t1>0&&t1<t0*0.62,'쓰러진 [불사] 동료가 일어나는 때: '+t0.toFixed(1)+'초 → 물레 곁 '+t1.toFixed(1)+'초'); }

console.log('C. 정령의 손길 — 마력 10칸 · 25% + 이어서 4초 초당 2%');
{ const W=WF([mk(MU,0,10,10),dummy('다친 동료',18,10,0),dummy('적',35,17,1)]); const m=W.units[0], a=W.units[1]; hold(m,...SUP); freeze(W); still(m,a,W.units[2]);
  step(W,2); a.hp=a.max*0.3; const h0=a.hp; E.startSkill(W,m,a,true); runAct(W,m,60);
  const sk=logK(W,'skill').slice(-1)[0]; ok(sk&&sk.b===a.i&&Math.abs(sk.amt-Math.round(a.max*0.25))<=1,'처음 '+(sk&&sk.amt)+' (최대 체력 '+a.max+'의 25%) — '+Math.round(dist(m,a))+'칸 밖에서');
  const h1=a.hp; step(W,60); ok(a.hp-h1>a.max*0.02*2*0.8&&a.hotB8,'이어서 회복 '+(a.hp-h1).toFixed(1)+' (2초)');
  while(W.t<a.hotB8.until+0.1) step(W); const h2=a.hp; step(W,60); ok(a.hp-h2<0.5,'4초 뒤엔 멈춤 (그 뒤 2초 +'+(a.hp-h2).toFixed(1)+')'); }
function dist(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }

console.log('D. 정령 강림 — 반지름 8 · 6초: 동료 초당 3% · 이동 +15% / 적 이동 −30%');
{ const W=WF([mk(MU,0,10,10),dummy('동료',14,10,0),dummy('적',16,11,1),dummy('먼 적',34,10,1)]); const m=W.units[0], a=W.units[1], e=W.units[2], f=W.units[3]; hold(m,'mwall','mspirit','mvolley'); freeze(W); still(a,e,f);
  step(W,2); a.hp=a.max*0.5; const ok1=E.supStart(W,m,'mdesc',null,'시험',15,10); ok(ok1&&m.act&&m.act.s==='mdesc','정령 강림 시작 (예고 0.6초)');
  runAct(W,m,60); const F=E.sfOf(W,'desc'); ok(F&&F.r===8&&F.until-W.t>5,'장판: 반지름 '+(F&&F.r)+' · 남은 '+(F?(F.until-W.t).toFixed(1):0)+'초');
  const h0=a.hp; step(W,30); ok(a.hp-h0>a.max*0.025,'동료 1초 회복 '+(a.hp-h0).toFixed(1)+' (3% = '+(a.max*0.03).toFixed(1)+')');
  a.spd=2; e.spd=2; f.spd=2; ok(Math.abs(E.supSpd(W,a)-1.15)<0.01&&Math.abs(E.supSpd(W,e)-0.7)<0.01&&E.supSpd(W,f)===1,'걸음: 동료 × '+E.supSpd(W,a)+' · 적 × '+E.supSpd(W,e)+' · 밖의 적 × '+E.supSpd(W,f));
  step(W,190); ok(!E.sfOf(W,'desc')&&E.supSpd(W,a)===1,'6초 뒤 사라짐'); }

console.log('E. 정령 방벽 — 앞 3칸 · 너비 4 · 4초: 적 탄을 막음 · 닿은 근접 적을 2칸 밀어냄');
{ const W=WF([mk(MU,0,10,10),archer('궁수',18,10,1)]); const m=W.units[0], b=W.units[1]; hold(m,'mdesc','mspirit','mvolley'); m.skill.cdT=1e9; freeze(W); still(m,b); b.seenBy=1;
  E.supStart(W,m,'mwall',null,'시험',18,10); runAct(W,m,40); const F=E.sfOf(W,'wall'); ok(F&&Math.abs(F.x-13)<0.2&&Math.abs(F.y-10)<0.2&&F.h===2,'방벽: 물레 앞 3칸 ('+(F?F.x.toFixed(1)+','+F.y.toFixed(1):'없음')+') · 너비 4');
  const h0=m.hp; b.order={k:'attack',b:m.i,now:true}; step(W,100); const blk=logK(W,'wallBlock'); ok(blk.length>=2&&m.hp===h0,'궁수의 화살이 방벽에 막힘 (막힘 '+blk.length+' · 물레 체력 그대로)'); }
{ const W=WF([mk(MU,0,10,10),dummy('돌격',16,10,1)]); const m=W.units[0], e=W.units[1]; hold(m,'mdesc','mspirit','mvolley'); freeze(W); still(m); e.order={k:'attack',b:m.i}; e.seenBy=1; e.ev=0.0001;
  E.supStart(W,m,'mwall',null,'시험',16,10); runAct(W,m,40); let pushed=null; for(let i=0;i<120&&!pushed;i++){ step(W); pushed=logK(W,'wallPush')[0]; }
  const x0=e.x; step(W,15); ok(pushed&&pushed.b===e.i&&e.x>13.6,'다가온 근접 적이 방벽에 닿아 밀려남 ('+e.x.toFixed(1)+')'); }
{ const W=WF([mk(MU,0,10,10),archer('궁수',21,10,1)]); const m=W.units[0], b=W.units[1]; hold(m,'mdesc','mspirit','mvolley'); m.skill.cdT=1e9; b.seenBy=1; b.order={k:'attack',b:m.i}; let used=false;
  for(let i=0;i<150&&!used;i++){ step(W); used=!!E.sfOf(W,'wall'); } ok(used,'스스로: 나를 노려 쏘려는 사수 쪽으로 방벽'); }

console.log('F. 땅의 정령 — 20초 · 체력이 가장 낮은 동료를 따라 3초마다 5%');
{ const W=WF([mk(MU,0,10,10),dummy('다친 동료',16,12,0),dummy('조금 다친 동료',8,8,0),dummy('적',30,10,1)]); const m=W.units[0], a=W.units[1], b=W.units[2]; hold(m,'mdesc','mwall','mvolley'); m.skill.cdT=1e9; freeze(W); still(a,b,W.units[3]);
  step(W,2); a.hp=a.max*0.3; b.hp=b.max*0.8; E.supStart(W,m,'mspirit',null,'시험'); runAct(W,m,60); const s=W.units.find(x=>x.spiritOf===m.i);
  ok(s&&s.summon==='spirit'&&s.side===0&&s.max===40,'땅의 정령 (체력 '+(s&&s.max)+' · 소환)');
  const h0=a.hp; step(W,30*7); ok(s.spiritFol===a.i&&dist(s,a)<2.2&&a.hp>h0+a.max*0.05*1.5,'가장 다친 동료 곁에서 회복탄 ('+logK(W,'spiritHeal').length+'번 · +'+(a.hp-h0).toFixed(0)+')');
  step(W,30*14); ok(!s.alive&&s.gone&&logK(W,'spiritGone').length===1,'20초 뒤 사라짐'); }

console.log('G. 물 정령 탄 — 세 발 × 0.6 · 마법 (갑옷 무시) · 맞으면 1초 이동 −20%');
{ const W=WF([mk(MU,0,10,10),dummy('판금',18,10,1)]); const m=W.units[0], e=W.units[1]; hold(m,'mdesc','mwall','mspirit'); m.skill.cdT=1e9; freeze(W); still(e); e.seenBy=1; e.ev=0;
  E.supStart(W,m,'mvolley',e,'시험'); runAct(W,m,90); step(W,30);
  const hs=W.log.filter(l=>l.k==='hit'&&l.a===m.i&&l.b===e.i); ok(logK(W,'mvolley').length===1&&hs.length>=2,'세 발 ('+hs.length+'발 맞음)');
  ok(hs.every(l=>!l.armor),'갑옷 (판금 · 투구) 이 막지 않음 (마법)'); }
{ const W=WF([mk(MU,0,10,10),dummy('표적',18,10,1)]); const m=W.units[0], e=W.units[1]; holdAll(m); freeze(W); still(e); e.seenBy=1; e.ev=0; e.spd=2;
  let hit=null; m.order={k:'attack',b:e.i,now:true}; for(let i=0;i<120&&!hit;i++){ step(W); hit=W.log.find(l=>l.k==='hit'&&l.a===m.i); }
  ok(hit&&e.slow8&&Math.abs(E.supSpd(W,e)-0.8)<0.01,'정령 지시 (기본) 에 맞으면 이동 × '+E.supSpd(W,e)); }

console.log('H. 갈퀴 꼬리 — 몸 가운데부터 3칸 · 100° · 두 번 (둘째 0.5초 휘청)');
{ const W=WF([mk(CO,0,10,10),dummy('앞',12.8,10,1),dummy('옆',12.2,11.6,1),dummy('뒤',8,10,1)]); const c=W.units[0], a=W.units[1], b=W.units[2], z=W.units[3]; holdAll(c); freeze(W); still(a,b,z); for(const x of [a,b,z]){ x.seenBy=1; x.canGuard=false; }
  E.cwhipStart(W,c,a,'시험'); ok(c.act&&c.act.k==='cwhip','꼬리 채찍 준비 0.3초'); runAct(W,c,60);
  const L1=logK(W,'cwhip'); ok(L1.length===2&&L1[0].hit.includes(a.i)&&L1[0].hit.includes(b.i)&&!L1[0].hit.includes(z.i),'부채꼴 안의 둘 (앞 · 옆) · 뒤는 안 맞음 ('+L1.map(l=>l.hit.length).join(' · ')+')');
  ok(W.log.filter(l=>l.k==='hit'&&l.a===c.i&&l.b===a.i).length===2,'두 번 맞음');
  ok(logK(W,'stun').some(l=>l.b===a.i),'둘째 (검은 파편) — 휘청'); }

console.log('I. 별빛 지목 — 15칸 탄 · 6초 받는 피해 +20% (모두) · 처음 맞을 때 0.8초 묶임');
{ const W=WF([mk(CO,0,10,10),dummy('표적',22,10,1),dummy('동료',20,11,0)]); const c=W.units[0], e=W.units[1], a=W.units[2]; holdAll(c); freeze(W); still(e,a); e.seenBy=1; e.ev=0; e.spd=2;
  c.spec.find(x=>x.k==='cstar').cdT=-9; E.supStart(W,c,'cstar',e,'시험'); let mk1=null; for(let i=0;i<90&&!mk1;i++){ step(W); mk1=logK(W,'starMark')[0]; }
  ok(mk1&&mk1.vine&&e.star8&&e.star8.until-W.t>5.5,'맞음 → 표식 6초 · 덩굴');
  ok(E.supSpd(W,e)<0.05,'묶임 (걸음 × '+E.supSpd(W,e)+')'); step(W,30); ok(E.supSpd(W,e)===1,'0.8초 뒤 풀림');
  const d0=E.supTake(W,a,e,100,{}), d1=E.supTake(W,W.units[1],a,100,{}); ok(Math.abs(d0-120)<0.01&&d1===100,'표식의 적이 동료에게 받는 피해 × '+(d0/100)+' (표식 없는 쪽은 그대로)'); }

console.log('J. 차원 문 — 앞 4칸 · 8초 · 반지름 4: 1초마다 1.5칸 끌어옴 · 적 탄이 사라짐 · 다시 쓰면 동료를 문 앞으로');
{ const W=WF([mk(CO,0,10,10),dummy('적 1',16.5,10,1),dummy('적 2',14,12.8,1),dummy('보스',14,7.5,1,{traits:['보스']}),dummy('동료',4,10,0)]); const c=W.units[0], e1=W.units[1], e2=W.units[2], bs=W.units[3], al=W.units[4]; holdAll(c); freeze(W); still(e1,e2,bs,al);
  c.spec.find(x=>x.k==='cgate').cdT=-9; E.supStart(W,c,'cgate',null,'시험',20,10); runAct(W,c,40); const G=E.sfOf(W,'gate'); ok(G&&Math.abs(G.x-14)<0.2&&G.r===4,'문: 앞 4칸 ('+(G?G.x.toFixed(1):'없음')+') · 반지름 4');
  const d0=dist(e1,G), d2=dist(e2,G), b0=dist(bs,G); step(W,40); ok(dist(e1,G)<d0-1.2&&dist(e2,G)<d2-0.5,'1초 뒤 끌려옴 ('+d0.toFixed(1)+' → '+dist(e1,G).toFixed(1)+')'); ok(Math.abs(dist(bs,G)-b0)<0.05,'보스는 끌려가지 않음');
  const x=c.spec.find(s=>s.k==='cgate'); ok(x.cdT<W.t+0.1,'열려 있는 동안 다시 쓸 수 있음');
  const okT=E.supStart(W,c,'cgate',al,'시험'); runAct(W,c,40); ok(okT&&logK(W,'gateTp').length===1&&dist(al,G)<2.6,'다시 씀 → 동료가 문 앞으로 ('+dist(al,G).toFixed(1)+'칸)');
  ok(x.cdT>=G.cd0-0.01,'대기는 연 때부터 12초'); }
{ const W=WF([mk(CO,0,10,10),archer('궁수',24,10,1),dummy('동료',15,10.2,0)]); const c=W.units[0], b=W.units[1], a=W.units[2]; holdAll(c); freeze(W); still(c,a); b.seenBy=1;
  c.spec.find(x=>x.k==='cgate').cdT=-9; E.supStart(W,c,'cgate',null,'시험',24,10); runAct(W,c,40); b.order={k:'attack',b:a.i,now:true}; const h0=a.hp; step(W,120);
  ok(logK(W,'gateEat').length>=1&&a.hp===h0,'문에 닿은 적의 화살이 사라짐 ('+logK(W,'gateEat').length+') · 동료 무사'); }

console.log('K. 마계 장막 — 반지름 6 · 5초: 안의 동료 원거리 −50% · 넘어 들어오는 적 0.5초 휘청');
{ const W=WF([mk(CO,0,10,10),dummy('동료',12,10,0),dummy('안의 적',14,10,1),dummy('들어올 적',19,10,1)]); const c=W.units[0], a=W.units[1], ei=W.units[2], eo=W.units[3]; holdAll(c); freeze(W); still(a,ei); eo.order={k:'attack',b:c.i}; eo.seenBy=1;
  c.spec.find(x=>x.k==='cveil').cdT=-9; E.supStart(W,c,'cveil',null,'시험'); runAct(W,c,40); const F=E.sfOf(W,'veil'); ok(F&&F.r===6,'장막 반지름 6'); step(W,2);
  ok(E.supTake(W,ei,a,100,{far:true})===50&&E.supTake(W,ei,a,100,{far:false})===100,'안의 동료: 원거리 × 0.5 · 근접은 그대로');
  let st=null; for(let i=0;i<120&&!st;i++){ step(W); st=logK(W,'veilStun').find(l=>l.b===eo.i); } ok(st,'넘어 들어온 적이 휘청');
  ok(!logK(W,'veilStun').some(l=>l.b===ei.i),'처음부터 안에 있던 적은 휘청하지 않음'); }

console.log('L. 유혹의 손짓 — 앞 8칸 60°: 2초 매혹 (마계 3초 · 보스 절반) · 공격을 멈추고 걸어옴');
{ const W=WF([mk(CO,0,10,10),dummy('적',16,10,1),dummy('마족',16,8.6,1,{race:'마족'})]); const c=W.units[0], e=W.units[1], d=W.units[2]; holdAll(c); freeze(W); still(c); e.seenBy=1; d.seenBy=1; e.order={k:'hold'}; d.order={k:'hold'}; e.ev=0; d.ev=0;
  c.spec.find(x=>x.k==='clure').cdT=-9; E.supStart(W,c,'clure',e,'시험'); runAct(W,c,60); const L1=logK(W,'clure')[0]; ok(L1&&L1.b===e.i&&L1.dur===2&&e.charm,'매혹 2초');
  const x0=dist(e,c); e.order=null; step(W,30); ok(dist(e,c)<x0-0.5&&!(e.act&&e.act.k==='atk'),'콜라이더 쪽으로 걸어옴 ('+x0.toFixed(1)+' → '+dist(e,c).toFixed(1)+') · 치지 않음');
  step(W,45); ok(!e.charm&&logK(W,'charmEnd').length,'2초 뒤 풀림');
  c.spec.find(x=>x.k==='clure').cdT=-9; E.supStart(W,c,'clure',d,'시험'); runAct(W,c,60); const L2=logK(W,'clure')[1]; ok(L2&&L2.b===d.i&&L2.dur===3&&L2.demon,'마족은 3초'); }
{ const W=WF([mk(CO,0,10,10),dummy('적',16,10,1)]); const c=W.units[0], e=W.units[1]; holdAll(c); freeze(W); still(c); e.seenBy=1;
  c.spec.find(x=>x.k==='clure').cdT=-9; E.supStart(W,c,'clure',e,'시험'); e.x=10; e.y=16; step(W,30); ok(!e.charm&&logK(W,'miss').some(l=>/60°/.test(l.why||'')),'준비 동안 부채꼴 밖으로 → 빗나감'); }

console.log('M. ◆마계 대사 — 같은 편 마법 × 1.1 · 꼬리 그림자 (한 번 체력 1)');
{ const W=WF([mk(CO,0,10,10),mk(MU,0,12,10),dummy('적',16,10,1)]); const c=W.units[0], m=W.units[1], e=W.units[2]; holdAll(c); holdAll(m); freeze(W); still(e); step(W,2);
  ok(Math.abs(E.supTake(W,m,e,100,{wk:'마법'})-110)<0.01&&E.supTake(W,m,e,100,{wk:'날붙이'})===100,'콜라이더 곁의 마법 피해 × 1.1 (날붙이는 그대로)');
  E.applyDmg(W,e,c,c.hp+50,{tag:'시험'}); ok(c.alive&&Math.round(c.hp)===1&&c.tailUsed&&logK(W,'colTail').length===1,'숨이 끊길 일격 → 꼬리 그림자가 막음 (체력 '+Math.round(c.hp)+')');
  E.applyDmg(W,e,c,10,{tag:'시험'}); ok(!c.alive,'두 번째는 막지 못함'); }
{ const W=WF([mk(MU,0,12,10),dummy('적',16,10,1)]); const m=W.units[0], e=W.units[1]; holdAll(m); step(W,2); ok(E.supTake(W,m,e,100,{wk:'마법'})===100,'콜라이더가 없으면 마법 그대로'); }

console.log('N. [축복:테헤라] · ◆요정 날개');
{ const W=WF([mk(TE,0,10,10),dummy('곁의 동료',13,10,0),dummy('먼 동료',30,4,0),dummy('적',35,17,1)]); const t=W.units[0], a=W.units[1], f=W.units[2]; holdAll(t); t.healPol='order';   /* 재생만 재려고 — 치유 방침 '명령만' (마력 치유의 기본은 알아서) */ freeze(W); still(...W.units); step(W,2);
  a.hp=a.max*0.5; f.hp=f.max*0.5; const h0=a.hp, g0=f.hp; step(W,60); ok(Math.abs((a.hp-h0)-3)<0.3&&f.hp===g0,'곁 5칸 동료 재생D (2초 +'+(a.hp-h0).toFixed(1)+') · 먼 동료 그대로');
  ok(Math.abs(E.supTake(W,W.units[3],a,100,{})-90)<0.01&&E.supTake(W,W.units[3],f,100,{})===100,'곁 동료 받는 피해 × 0.9'); }
{ const W=WF([mk(TE,0,10,10),dummy('적',30,10,1)]); const t=W.units[0]; holdAll(t); W.pools=[{by:1,side:1,x:10,y:10,r:2,until:99,tickT:0,t0:0}]; const h0=t.hp; step(W,60); ok(t.hp>=h0-0.01&&!(t.poolSlowT>0),'핏빛 장판을 밟지 않음 (떠 있음)'); }
{ let ev=0, n=0; for(let s=1;s<=6;s++){ const W=WF([mk(TE,0,10,10),archer('궁수',20,10,1,{traits:['사격S']})],{seed:s}); const t=W.units[0], b=W.units[1]; holdAll(t); t.order={k:'hold'}; t.spd=0.001; b.seenBy=1; t.hp=t.max=99999; b.order={k:'attack',b:t.i,now:true}; step(W,30*25); ev+=logK(W,'wingDodge').length; n+=W.shots? W.log.filter(l=>(l.k==='hit'||l.k==='wingDodge'||l.k==='evade')&&(l.b===t.i||l.a===t.i)).length:0; }
  ok(ev>0,'원거리를 날개로 흘림 ('+ev+'번)'); }

console.log('O. 요정의 축복 — 곁 5칸 동료 모두 25% · 4초 받는 피해 × 0.85');
{ const W=WF([mk(TE,0,10,10),dummy('동료 1',12,10,0),dummy('동료 2',10,13,0),dummy('먼 동료',22,10,0),dummy('적',35,17,1)]); const t=W.units[0], a=W.units[1], b=W.units[2], f=W.units[3]; hold(t,...SUP); freeze(W); still(a,b,f,W.units[4]); step(W,2);
  for(const x of [a,b,f]) x.hp=x.max*0.4; const f0=f.hp; E.startSkill(W,t,a,true); runAct(W,t,60);
  ok(a.hp>a.max*0.62&&b.hp>b.max*0.62&&f.hp<f0+5,'둘 다 25% (먼 동료는 빼고)'); ok(a.fairyGT>W.t+3&&Math.abs(E.supTake(W,W.units[4],a,100,{})-85*0.9)<0.6,'받는 피해 × 0.85 (+ 축복 × 0.9)'); }

console.log('P. 광역 손짓 — 8칸 90° · 동료도 맞음 · 둔기 · 중대형까지 넘어짐');
{ const W=WF([mk(TE,0,10,10),dummy('적',14,10,1),dummy('중대형',15,11.5,1,{height:2.2,weight:150,sizeCls:'중대형'}),dummy('대형',15,8.4,1,{height:2.6,weight:400,sizeCls:'대형'}),dummy('동료',13,9,0),dummy('뒤의 적',6,10,1)]); const t=W.units[0], e=W.units[1], mid=W.units[2], big=W.units[3], al=W.units[4], bk=W.units[5]; holdAll(t); freeze(W); still(e,mid,big,al,bk); for(const x of W.units) x.canGuard=false;
  t.spec.find(x=>x.k==='tsweep').cdT=-9; E.supStart(W,t,'tsweep',e,'시험'); runAct(W,t,60); const L1=logK(W,'tsweep')[0];
  ok(L1&&L1.hit.includes(e.i)&&L1.hit.includes(mid.i)&&L1.hit.includes(big.i)&&L1.hit.includes(al.i)&&!L1.hit.includes(bk.i),'부채꼴 안 모두 (동료도) · 뒤는 안 맞음');
  ok(L1.ff===1&&W.log.some(l=>l.k==='hit'&&l.b===al.i&&l.ff),'동료가 맞음 (오사)');
  ok(e.proneT>W.t&&mid.proneT>W.t&&!(big.proneT>W.t),'중대형까지 넘어짐 · 대형은 밀리기만'); }
{ const W=WF([mk(TE,0,10,10),dummy('적 1',15,10,1),dummy('적 2',15,11.5,1),dummy('동료',30,4,0)]); const t=W.units[0]; hold(t,'tflight','twing','tdream'); t.skill.cdT=1e9; for(const x of W.units.slice(1)) x.seenBy=1; let used=null;
  for(let i=0;i<90&&!used;i++){ step(W); used=logK(W,'tsweep')[0]; } ok(used&&used.ff===0,'스스로: 적 둘 이상 · 동료 없음'); }

console.log('Q. 은빛 비행 — 8칸 (바위를 넘음) · 지나간 줄의 적 × 0.4 · 0.8초 둔화');
{ const rocks=[]; for(let y=8;y<=12;y++) rocks.push({x:14,y}); const W=WF([mk(TE,0,10,10),dummy('길의 적',12.2,10,1)],{rocks}); const t=W.units[0], e=W.units[1]; holdAll(t); freeze(W); still(e); e.canGuard=false; e.ev=0;
  t.spec.find(x=>x.k==='tflight').cdT=-9; E.supStart(W,t,'tflight',null,'시험',18,10); runAct(W,t,90);
  ok(Math.abs(t.x-18)<0.6,'바위 너머로 날아감 ('+t.x.toFixed(1)+')'); ok(W.log.some(l=>l.k==='hit'&&l.a===t.i&&l.b===e.i)&&e.slow8,'길의 적 × 0.4 · 둔화'); }

console.log('R. 날개 방패 — 2초 받는 피해 × 0.2 · 끝날 때 둘레 3칸 눈멂 1초');
{ const W=WF([mk(TE,0,10,10),dummy('붙은 적',11,10,1),archer('먼 사수',20,10,1)]); const t=W.units[0], e=W.units[1], s=W.units[2]; holdAll(t); t.healPol='order'; freeze(W); still(e,s);
  t.spec.find(x=>x.k==='twing').cdT=-9; E.supStart(W,t,'twing',null,'시험'); runAct(W,t,10); ok(t.act&&t.act.k==='twing','날개로 몸을 감쌈'); ok(Math.abs(E.supTake(W,e,t,100,{})-18)<0.01,'받는 피해 × 0.2 (+ 제 축복 × 0.9 = '+E.supTake(W,e,t,100,{}).toFixed(0)+')');
  step(W,70); ok(!t.act&&e.blindT8>W.t&&!(s.blindT8>W.t),'끝 → 곁의 적만 눈멂'); }

console.log('S. 나른한 꿈 — 앉아서 반지름 6 · 5초: 적 공격 속도 −40% · 동료 초당 1%');
{ const W=WF([mk(TE,0,10,10),dummy('동료',12,10,0),dummy('적',13,10,1),dummy('먼 적',30,10,1)]); const t=W.units[0], a=W.units[1], e=W.units[2], f=W.units[3]; holdAll(t); freeze(W); still(a,e,f);
  t.spec.find(x=>x.k==='tdream').cdT=-9; E.supStart(W,t,'tdream',null,'시험'); runAct(W,t,20); step(W,3); ok(t.act&&t.act.k==='tdream'&&E.sfOf(W,'dream'),'앉아 졸음 · 장판');
  ok(Math.abs(E.supAtkK(W,e)-1/0.6)<0.01&&E.supAtkK(W,f)===1&&E.supAtkK(W,a)===1,'안의 적 공격 간격 × '+E.supAtkK(W,e).toFixed(2)+' (밖 · 동료는 그대로)');
  const x0=t.x; t.order={k:'move',x:20,y:10}; step(W,30); ok(Math.abs(t.x-x0)<0.01,'앉은 동안 못 움직임'); step(W,30*5); ok(!t.act||t.act.k!=='tdream','5초 뒤 일어남'); }

console.log('T. 명령 — 바닥 · 동료 · 적 · 제자리');
{ const W=WF([mk(MU,0,10,10),mk(CO,0,10,13),mk(TE,0,10,7),dummy('적',18,10,1),dummy('동료',4,10,0)]); const m=W.units[0], c=W.units[1], t=W.units[2], e=W.units[3], al=W.units[4]; freeze(W); still(e,al); e.seenBy=1; m.skill.cdT=1e9; t.skill.cdT=1e9; holdAll(c); holdAll(t);
  m.order={k:'spec',s:'mdesc',x:20,y:10}; step(W,40); ok(E.sfOf(W,'desc'),'물레: 정령 강림 → 찍은 바닥 쪽 (9칸 안으로 당김)');
  c.spec.find(x=>x.k==='cstar').cdT=-9; c.order={k:'spec',s:'cstar',b:e.i}; let mk1=null; for(let i=0;i<150&&!mk1;i++){ step(W); mk1=logK(W,'wind').find(l=>l.a===c.i&&l.spec==='cstar'); } ok(mk1&&mk1.b===e.i&&mk1.why==='명령','콜라이더: 별빛 지목 → 적을 탭 (명령)'); c.spec.find(x=>x.k==='cgate').cdT=-9;
  c.order={k:'spec',s:'cgate',x:22,y:13}; for(let i=0;i<60&&!E.sfOf(W,'gate');i++) step(W); ok(E.sfOf(W,'gate'),'콜라이더: 차원 문 → 그쪽 앞 4칸');
  for(let i=0;i<40;i++) step(W); c.order={k:'spec',s:'cgate',b:al.i}; for(let i=0;i<60&&!logK(W,'gateTp').length;i++) step(W); ok(logK(W,'gateTp').length===1,'콜라이더: 차원 문 (열림) → 동료를 탭 = 문 앞으로');
  t.spec.find(x=>x.k==='twing').cdT=-9; t.order={k:'spec',s:'twing'}; step(W,8); ok(t.act&&t.act.k==='twing','테헤라: 날개 방패 (제자리 · 바로)'); }

console.log('U. 스스로 — 3 대 3 (적 쪽 서포터도 같은 두뇌)');
{ let used={}; for(let s=1;s<=3;s++){ const W=WF([mk(MU,0,6,9),mk(CO,0,7,11),mk(TE,0,5,12),dummy('전사 1',8,10,0),mk(MU,1,32,9),mk(CO,1,33,11),mk(TE,1,34,12),dummy('적 전사',31,10,1),archer('적 궁수',35,8,1)],{roe:'free',seed:s});
    for(let i=0;i<30*40;i++){ step(W); if(W.over) break; } for(const l of W.log){ if(['mdesc','mwall','mspirit','mvolley','cgate','cstar','cveil','clure','tsweep','tflight','twing','tdream','cwhip','skill','fairyBless'].includes(l.k)){ const side=W.units[l.a]?W.units[l.a].side:9; used[l.k+side]=(used[l.k+side]||0)+1; } } }
  const ks=Object.keys(used).sort(); console.log('    쓴 것 '+ks.map(k=>k+':'+used[k]).join(' '));
  ok(['mvolley','cstar','cwhip'].every(k=>used[k+'0']&&used[k+'1']),'양쪽 모두 물 정령 탄 · 별빛 지목 · 꼬리 채찍');
  ok(ks.filter(k=>/[01]$/.test(k)).length>=14,'여러 기술을 스스로 ('+ks.length+'가지)'); }

console.log('V. 치료 방침의 기본 — 마력 치유 (줄지 않음) 는 알아서 · 구급상자는 위급할 때만 · 고른 방침이 먼저');
{ const W=WF([mk(MU,0,10,10),mk(TE,0,11,12),mk({...REB,name:'노먼',ref:'C-007',skill:{name:'지혈 · 약',kit:true,pool:20,pct:0.3,min:50,cap:250,hot:0,hotN:0,hotGap:0.4,cd:1.4,wind:0.35,rec:0.25,rng:0.8,auto:0.6},gear:{}},0,12,10),dummy('적',30,10,1)]); const [m,t,n]=W.units;
  ok(E.healPolOf(W,m)==='free'&&E.healPolOf(W,t)==='free'&&E.healPolOf(W,n)==='dying','기본: 물레 · 테헤라 알아서 · 약 (노먼) 위급할 때만');
  m.healPol='order'; ok(E.healPolOf(W,m)==='order','고른 방침이 먼저 (명령만)'); }
console.log(fails?'FAIL '+fails:'ALL eng8780d OK'); process.exit(fails?1:0);
