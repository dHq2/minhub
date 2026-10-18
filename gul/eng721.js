// v7.21 시험 — eng721.js v1.0 (캠페인 판: 적을 다 쓰러뜨려도 끝나지 않음 (끝난 맵) · 위 끝으로 나감 · 모두 나가면 exit · 모두 쓰러지면 lose · 버림 (left) 은 exit 아님 · 체력 · 치료 횟수 이어받음)
const {E,DES,INJ,NOR,REB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
{ const W=W_([mk(REB,0,4,5),mk({...INJ,hpNow:30},0,5,5,{hero:true}),mk({...NOR,skLeft:2},0,6,5)],[mk(DES['창병'],1,20,12)],1,'hold'); W.camp=true;
  const [r,h,n,e]=W.units; ok(h.hp===30&&n.skill&&n.skill.left===2,'이어받은 체력 30 · 남은 치료 2');
  e.hp=0; e.alive=false; run(W,0.2); ok(W.cleared&&!W.over&&W.log.some(l=>l.k==='cleared'),'적을 다 쓰러뜨려도 끝나지 않음 (끝난 맵)');
  for (const u of [r,h,n]) u.order={k:'exit',dir:'up'}; run(W,20,()=>W.over);
  console.log('    ', W.result, W.units.filter(u=>u.side===0).map(u=>u.name+':'+u.gone).join(' '), W.t.toFixed(1)+'초');
  ok(W.over&&W.result==='exit'&&[r,h,n].every(u=>u.gone==='up'),'모두 위 끝으로 나가면 exit'); }
{ const W=W_([mk(INJ,0,5,5,{hero:true}),mk(NOR,0,6,5)],[mk(DES['창병'],1,20,12)],1,'hold'); W.camp=true; const [h,n]=W.units;
  E.leaveMap(W,h,'up'); n.gone='left'; n.alive=false; E.checkEnd(W); ok(W.over&&W.result==='exit','한 명은 나가고 한 명은 버림 → exit');
  const W2=W_([mk(INJ,0,5,5,{hero:true})],[mk(DES['창병'],1,20,12)],1,'hold'); W2.camp=true; W2.units[0].hp=0; W2.units[0].alive=false; E.checkEnd(W2); ok(W2.over&&W2.result==='lose','모두 쓰러지면 lose');
  const W3=W_([mk(INJ,0,5,5,{hero:true})],[mk(DES['창병'],1,20,12)],1,'hold'); W3.camp=true; W3.t=999; E.checkEnd(W3); ok(!W3.over,'캠페인 판엔 시간 제한 없음'); }
console.log(fails?`\n${fails} FAIL`:'\nALL 721 OK');
