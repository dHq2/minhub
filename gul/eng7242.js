// v7.24.2 시험 — eng7242.js v1.2 (v1.2: 돌격 버팀 시험의 기사는 방패 (몸으로 들이받음 — v9.9.0 무기를 든 이는 무기로 침) · v1.1: 공격 비교는 정한 값 없이 · 돌격 시험의 쟝은 버팀 · 근력 · 괴력: [근력X] = 늘 쓰는 공격 × · 자세 깎기 (예전 괴력 몫) · [괴력X] 만으로는 공격 그대로 / 괴력 순간: 크게 밀릴 때 버팀 (÷ 괴력) · 대기 · 넘어지려 할 때 버팀 · 잡힌 무기를 뿌리침 (거구에겐 안 됨) · 무너지려던 막기를 튕겨냄 · 쓴 뒤 빈틈 · 돌격에 버팀)
const {E,R,DES,INJ,REB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const JEAN={ref:'C-262',name:'쟝',tier:2,cls:'기동',role:'미드필더',weapon:'장도리',sm:0.81,height:1.8,weight:72,bold:0.75,ov:{hp:9000,atk:30},traits:['회피A','급소A','후각B','은신B','괴력C','일반인']};
const PLAIN={...JEAN,name:'쟝0',traits:['회피A','급소A','후각B','은신B','일반인']};
const KAR={ref:'C-003',name:'카리우스',tier:2,sm:0.75,shield:false,weapon:'맨손',height:3,weight:300,ov:{hp:9000,atk:40,rng:0.6},traits:['거구','갑피','근력A','괴력A','머리 넷'],unique:['개조된 신체'],modBody:true};
const KN=()=>({...JSON.parse(JSON.stringify(DES['검기사'])),ov:{hp:9000,atk:30}});
const lit=W=>{ W.amb=1; E.computeLight(W); };
// 1) 근력 = 늘 쓰는 몫 · 괴력만으로는 공격 그대로
{ const NA=d=>({...d,ov:{hp:9000}}); const W=W_([mk(NA(PLAIN),0,5,5),mk(NA(JEAN),0,7,5),mk(NA({...PLAIN,name:'근력',traits:['근력A']}),0,9,5),mk(KAR,0,11,5)],[mk(KN(),1,20,5)],1,'hold');   /* 공격은 정한 값 (ov.atk) 없이 */ const [p,j,s,k]=W.units;
  console.log('      공격',p.atk,j.atk,s.atk,'· 근력 배율',p.strMul,j.strMul,s.strMul,k.strMul,'· 괴력',p.might,j.might,s.might,k.might);
  ok(j.atk===p.atk&&j.strMul===1&&j.might===1.2,'쟝 [괴력C] — 공격 · 근력 배율 그대로 · 순간 ×1.2'); ok(Math.abs(s.atk/p.atk-1.45)<0.05&&s.strMul===1.45&&s.might===1,'[근력A] — 공격 × 1.45 · 자세 깎기 1.45 (예전 괴력A 몫)'); ok(k.strMul===1.45&&k.might===1.7,'카리우스 [근력A] [괴력A] — 늘 1.45 · 순간 1.7'); }
// 2) 크게 밀릴 때 버팀 (÷ 1.2) · 대기 · 쓴 뒤 빈틈
{ const mkW=d=>{ const W=W_([mk(d,0,10,8)],[mk(KN(),1,8.8,8)],1,'hold'); lit(W); return W; };
  const W0=mkW(PLAIN), W1=mkW(JEAN), L=[];
  for (const W of [W0,W1]){ const [j,k]=W.units; E.shove(W,k,j,1.4,1,0,{how:'bash'}); L.push(j.kb?j.kb.len:0); }
  const j1=W1.units[0]; console.log('      밀린 거리 — 괴력 없음',L[0].toFixed(2),'· 쟝',L[1].toFixed(2));
  ok(Math.abs(L[0]/L[1]-1.2)<0.02&&W1.log.some(l=>l.k==='might'&&l.how==='resist'),'크게 밀리려는 순간 버팀 — 밀린 거리 ÷ 1.2');
  ok(j1.openT>W1.t&&j1.offBal>W1.t,'쓴 뒤 잠깐 빈틈 (막기 어려움)');
  run(W1,1.5); const before=W1.log.filter(l=>l.k==='might').length; E.shove(W1,W1.units[1],j1,1.4,1,0,{how:'bash'}); ok(W1.log.filter(l=>l.k==='might').length===before,'대기 (괴력C 7초) 동안은 다시 못 씀'); }
// 3) 넘어지려 할 때 버팀
{ let st=0, dn=0; for (let s=1;s<=10;s++){ const W=W_([mk(JEAN,0,10,8)],[mk(KN(),1,8.8,8)],s,'hold'); lit(W); const [j,k]=W.units; j.mightCd=-9;
    j.kb={ by:k.i, dx:1, dy:0, left:0.005, len:2.5, hit:[], o:{}, p:2 }; E.stepWorld(W,1/30); if (W.log.some(l=>l.k==='might'&&l.how==='stand')) st++; if (W.t<(j.proneT||-9)) dn++; }
  console.log('      버팀',st,'넘어짐',dn); ok(st>0&&dn===0,'넘어지려는 순간 버팀 (괴력이 준비돼 있으면)'); }
// 4) 잡힌 무기를 뿌리침 — 거구에겐 안 됨
{ const SP={...PLAIN,name:'창쟝',weapon:'창',traits:['괴력C']}; const R2=x=>{ x.grab={...x.grab,p:1,cap:1}; return x; };
  const go=gr=>{ const W=W_([mk(SP,0,10,8)],[mk(gr,1,10.9,8)],1,'hold'); R2(W.rules); lit(W); const [a,t]=W.units; const r=E.grabTry?E.grabTry(W,t,a,'evade'):null; return { got: !!a.weaponGone, might: W.log.some(l=>l.k==='might'&&l.how==='grip') }; };
  const g1=go(KN()), g2=go({...KAR,side:1}); console.log('      검기사가 잡음',JSON.stringify(g1),'· 카리우스가 잡음',JSON.stringify(g2));
  ok(!g1.got&&g1.might,'검기사가 창 자루를 잡음 → 괴력으로 뿌리침'); ok(g2.got&&!g2.might,'카리우스 (300 · 근력A) 가 잡으면 못 뿌리침 — 뺏김'); }
// 5) 무너지려던 막기를 튕겨냄
{ const SK={...KN(),name:'방패기사',shield:true,traits:['괴력B']}; const W=W_([mk({...KN(),name:'공격자'},0,10,8)],[mk(SK,1,10.95,8)],1,'hold'); lit(W); const [a,t]=W.units; t.face=t.fg=Math.PI; t.raised=true; t.raiseAt=-9; t.post=4;
  const o=E.strike(W,a,t,t,1,false,{}); console.log('      막기',JSON.stringify({block:o&&o.block,mp:o&&o.mightParry,post:Math.round(t.post),broke:o&&o.broke,stun:+((a.stunT||0)-W.t).toFixed(2)}));
  ok(o&&o.block&&o.mightParry&&!o.broke&&t.post>=1,'무너지려던 막기를 괴력으로 버팀 (자세 남음)'); ok(a.stunT>W.t&&(a.kb||W.log.some(l=>l.k==='shove'||l.k==='kb')||true),'튕겨낸 상대는 잠깐 휘청'); }
// 6) 돌격에 버팀 (들이받히는 순간)
{ let br=0; for (let s=1;s<=4;s++){ const W=W_([mk(JEAN,0,12,8)],[mk({...KN(),weight:110,shield:true},1,6,8)],s,'hold'); lit(W); const [j,k]=W.units; k.canCharge=true; j.canCharge=false;   /* 쟝은 맞받아 달리지 않고 버팀 */
    E.stepWorld(W,1/30); if (E.startCharge) E.startCharge(W,k,j); run(W,2.5); if (W.log.some(l=>l.k==='might'&&(l.how==='brace'||l.how==='resist'||l.how==='stand'))) br++; }
  console.log('      돌격에 괴력',br,'/ 4'); ok(br>0,'들이받히는 순간 · 밀리는 순간 괴력으로 버팀'); }
console.log(fails?`${fails} FAIL`:'ALL 7242 OK');
