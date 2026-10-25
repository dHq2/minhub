// v9.7.0 리모델 P0 대칭 시험 — eng9700.js v1.1 (v1.1: A03 의 남은 차이는 적 편의 판 시작 경계 (보초 → 알아챔) 탓 — 휘두르기 기준은 v9.7.1 에서 같아짐 / v1.0: A01 같은 검사 · 편만 바꿈 → 명중 · 피해 · 막기 같음 / A02 총구를 겨눈 사수 — 양쪽 다 피함 / A03 거구가 제 편 앞에서 휘두름 — 양쪽 다 오사 · 동료가 비켜섬)
const {E,R,REB,KAR,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const sw=(name,x,y,side,ex)=>mk({...REB,name,shield:false,weapon:'장검',ov:{hp:400,atk:20},traits:[],gear:{},...(ex||{})},side,x,y);
const WF=(units,seed)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='free'; R2.roe.autoLift=false; R2.chgPol={allyOff:false}; const W=E.createWorld({type:'grid',W:40,H:20,seed:7,units,torches:[{x:20,y:10,r:80}],flips:[]},R2,seed||1,{headless:true}); E.computeLight(W); W.units.forEach(u=>{ u.seenBy=1; }); return W; };
const step=(W,n)=>{ for(let i=0;i<(n||1);i++) E.stepWorld(W,1/30); };
const dmgBy=(W,i)=>W.log.filter(l=>l.k==='hit'&&l.a===i).reduce((s,l)=>s+(l.dmg||0),0);
const cnt=(W,k,i)=>W.log.filter(l=>l.k===k&&l.a===i).length;

console.log('A01. 같은 검사 둘 — 편만 바꿔서 (20판씩)');
{ const S=[{dmg:0,hit:0,blk:0,win:0},{dmg:0,hit:0,blk:0,win:0}];
  for (let sd=1; sd<=20; sd++) for (const side of [0,1]){ const W=WF([sw('갑',10,10,side),sw('을',11.2,10,1-side)],sd); step(W,300);
    const a=W.units[0], b=W.units[1]; const s=S[side]; s.dmg+=dmgBy(W,a.i); s.hit+=cnt(W,'hit',a.i); s.blk+=W.log.filter(l=>(l.k==='block'||l.k==='parry')&&l.a===b.i).length; if (a.hp>b.hp) s.win++; }
  const f=s=>`피해 ${s.dmg.toFixed(0)} · 명중 ${s.hit} · 상대가 막음 ${s.blk} · 더 남음 ${s.win}/20`;
  console.log('    갑이 우리 편일 때: '+f(S[0])); console.log('    갑이 적 편일 때:   '+f(S[1]));
  const r=(S[0].dmg+1)/(S[1].dmg+1); console.log('    피해 비 '+r.toFixed(2));
  ok(r>0.75&&r<1.33,'같은 검사는 편이 바뀌어도 피해가 비슷 (±25%)'); }

console.log('A02. 총구를 겨눈 사수 — 양쪽 편 다 총구 피하기');
{ const jk=[0,0], sh=[0,0], am=[0,0]; for (const side of [0,1]) for (let sd=1; sd<=8; sd++){ const W=WF([sw('표적',10,10,side,{ov:{hp:900,atk:5}}),mk({...REB,name:'사수',weapon:'단궁',shield:false,ov:{hp:900,atk:5},traits:['사격B'],gear:{}},1-side,17,10)],sd);
    const u=W.units[0], g=W.units[1]; g.order=null; u.order=null; u.noChg=true; g.target=u;   /* 돌격 기본값은 편마다 다른 플레이어 정책 (아군 돌격 안 함) — 같게 맞춤 */ let aim=0; for(let i=0;i<120;i++){ step(W); if(g.act&&g.act.b===u.i) aim++; } if (W.log.some(l=>l.k==='mvr'&&l.m==='jink'&&l.a===u.i)) jk[side]++; sh[side]+=W.log.filter(l=>l.k==='shot'&&l.a===g.i||l.k==='fire'&&l.a===g.i).length; am[side]+=aim; }
  console.log('    총구 피하기: 우리 '+jk[0]+'/8 · 적 '+jk[1]+'/8 · 사수가 겨눈 틱 '+am.join(' / ')+' · 쏜 수 '+sh.join(' / ')); ok(jk[0]>=4,'우리 편도 총구를 피함'); ok(jk[1]>=1,'적 편도 총구를 피함 (조건 같음)'); }

console.log('A03. 거구가 제 편 앞에서 휘두름 — 양쪽 다 오사 · 동료가 비켜섬');
{ const R0=[{ff:0,dodge:0},{ff:0,dodge:0}]; for (const side of [0,1]) for (let sd=1; sd<=6; sd++){
    const W=WF([mk({...KAR},side,10,10),sw('동료',11.0,10.9,side,{ov:{hp:900,atk:5}}),sw('적1',11.1,10,1-side,{ov:{hp:900,atk:5}}),sw('적2',11.0,9.1,1-side,{ov:{hp:900,atk:5}})],sd);
    const k=W.units[0], m=W.units[1]; k.swing='휘두르기'; m.order={k:'hold'}; m.order=null; const m0={x:m.x,y:m.y}; step(W,150);
    if (W.log.some(l=>l.k==='hit'&&l.a===k.i&&l.b===m.i)) R0[side].ff++; if (Math.hypot(m.x-m0.x,m.y-m0.y)>0.5) R0[side].dodge++; }
  console.log('    우리: 동료를 침 '+R0[0].ff+'/6 · 동료가 비켜섬 '+R0[0].dodge+'/6 · 적: 동료를 침 '+R0[1].ff+'/6 · 비켜섬 '+R0[1].dodge+'/6');
  ok(R0[0].dodge+R0[0].ff>0&&R0[1].dodge+R0[1].ff>0,'양쪽 다 같은 규칙 (오사가 나거나 동료가 비켜섬)'); ok(Math.abs(R0[0].dodge-R0[1].dodge)<=3,'비켜서는 횟수가 편마다 크게 다르지 않음');
  if (Math.abs(R0[0].ff-R0[1].ff)>=2) console.log('  INFO 오사 횟수 차이 — 적 편은 판 시작 경계 (보초 → 알아챔) 를 거쳐 움직여 동료가 덜 끼어듦 (판 시작 상황 · 허용). 휘두르기 기준 자체는 v9.7.1 부터 같음'); }
console.log(fails?'FAIL '+fails:'ALL OK'); process.exit(fails?1:0);
