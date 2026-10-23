// sim8750.js v1.0 — 대형 켬 / 끔 견주기 (자동 판 · 명령 없음 · 같은 씨앗): 이김 · 쓰러진 동료 · 쓰러뜨린 적 · 걸린 때 · 대형 유지율 · 진형 버프 시간
const {E,R,DES,INJ,KAR,REB,GOB,NOR,mk}=require('./scen_lib790.js');
const N=+(process.argv[2]||20), shape=process.argv[3]||'삼각', foesK=process.argv[4]||'mix';
const FOES={ mix:[['검방패기사',22,6],['검방패기사',22,9],['창병',23,7.5],['궁수',26,5],['궁수',26,10],['검기사',24,12]], knights:[['검기사',22,6],['검기사',22,8],['검기사',22,10],['검기사',23,12]] };
const run=(form, sd)=>{ const allies=[mk(KAR,0,6,8),mk(REB,0,5,7),mk(INJ,0,5,9,{hero:true}),mk(GOB,0,4,8),mk(NOR,0,3,7)];
  const foes=FOES[foesK].map(([k,x,y])=>mk(DES[k],1,x,y));
  const setup={type:'grid',W:34,H:16,seed:7,units:[...allies,...foes],torches:[{x:15,y:8,r:40}],flips:[]}; if (form) setup.form={A:{shape,on:true,style:'keep'}};
  const W=E.createWorld(setup,JSON.parse(JSON.stringify(R)),sd,{headless:true}); W.amb=1; E.computeLight(W);
  let iS=0,iN=0,fbT=0; for (let i=0;i<1800&&!W.over;i++){ E.stepWorld(W,0.05); const F=W.form&&W.form.A; if (F&&F.act){ iS+=F.integ; iN++; } if (W.units.some(u=>u.side===0&&u.fb)) fbT+=0.05; }
  const A=W.units.filter(u=>u.side===0), B=W.units.filter(u=>u.side===1);
  return { win: W.result==='win'?1:0, aDead: A.filter(u=>!u.alive).length, bDead: B.filter(u=>!u.alive).length, t: W.t, integ: iN?iS/iN:0, fbT, hp: A.reduce((a,u)=>a+Math.max(0,u.hp),0)/A.reduce((a,u)=>a+u.max,0) }; };
for (const form of [false,true]){ const S0={win:0,aDead:0,bDead:0,t:0,integ:0,fbT:0,hp:0}; for (let sd=1;sd<=N;sd++){ const r=run(form,sd); for (const k in S0) S0[k]+=r[k]; }
  console.log(form?'대형 켬 ('+shape+')':'대형 끔        ', Object.entries(S0).map(([k,v])=>k+' '+(k==='win'?v+'/'+N:(v/N).toFixed(2))).join(' · ')); }
