// v7.22 시험 — eng722.js v1.0 (판 도중에 유닛을 넣음 (addUnit — 같은 만들기 · 같은 규칙 · 끝난 맵이 다시 싸움 중 · 넣은 적이 싸움) · 얕은 물 걸음 0.7 배 (양쪽 같음) · 두건 (막지 못함 · 숨는 솜씨 바닥 B · 원래 좋으면 그대로) · 전리품 이름)
const {E,DES,INJ,NOR,REB,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
// 1) addUnit: 끝난 맵에 적이 생기면 다시 싸움 · 같은 규칙으로 움직임
{ const W=W_([mk(REB,0,10,8),mk(INJ,0,11,8,{hero:true})],[mk(DES['창병'],1,25,12)],1,'free'); W.camp=true; const e=W.units[2]; e.hp=0; e.alive=false; run(W,0.2);
  ok(W.cleared&&!W.over,'적을 다 쓰러뜨리면 끝난 맵');
  const n0=W.units.length, u=E.addUnit(W,mk(DES['검방패기사'],1,14,8)); ok(W.units.length===n0+1&&u.i===n0&&u.alive&&u.side===1&&u.hp===u.max&&u.max>0,'addUnit: 끝 번호로 같은 만들기 (피 '+u.hp+')');
  ok(!W.cleared,'적이 새로 생기면 끝난 맵이 아님'); run(W,12,()=>!u.alive||W.units.slice(0,2).some(a=>a.taken>0));
  ok(W.units.slice(0,2).some(a=>a.taken>0)||u.taken>0,'넣은 적도 같은 규칙으로 싸움 (주고받음)');
  const a=E.addUnit(W,mk(NOR,0,9,9)); ok(a.side===0&&a.slot>=1&&a.stealthE>0&&a.alive,'아군도 넣을 수 있음 (편대 자리 · 숨는 솜씨)'); }
// 2) 얕은 물: 양쪽 같은 걸음 ×
{ const R=E.createWorld; const mkW=w=>{ const W=E.createWorld({type:'grid',W:30,H:16,seed:7,units:[mk(REB,0,5,5),mk(DES['창병'],1,20,10)],torches:[],flips:[],water:w},require('./t4.js').R,1,{headless:true}); return W; };
  const W=mkW([{x:5,y:5,rx:3,ry:2},{x:20,y:10,rx:2,ry:2}]), [a,e]=W.units; const s0=E.spdNow0(W,a), s1=E.spdNow(W,a), e0=E.spdNow0(W,e), e1=E.spdNow(W,e);
  ok(Math.abs(s1/s0-0.7)<1e-6&&Math.abs(e1/e0-0.7)<1e-6,'물 속 걸음 0.7 배 (아군 '+(s1/s0).toFixed(2)+' · 적 '+(e1/e0).toFixed(2)+')');
  a.x=12; a.y=5; ok(Math.abs(E.spdNow(W,a)/E.spdNow0(W,a)-1)<1e-6,'물 밖이면 그대로');
  const W2=mkW([]); ok(!W2.map.water,'물이 없으면 그대로 (map.water 없음)'); }
// 3) 두건: 막지 못함 · 숨는 솜씨 바닥 B
{ const hood={머리:{name:'친칠라의 후드',mat:'두건',tier:1}};
  const W=W_([mk({...INJ,traits:[...INJ.traits,'은신D'],gear:{...hood}},0,5,5,{hero:true}),mk({...INJ,traits:[...INJ.traits,'은신D']},0,6,5),mk({...REB,traits:[...REB.traits.filter(t=>!/^은신/.test(t)),'은신S'],gear:{...hood}},0,7,5)],[mk(DES['궁수'],1,20,10)],1,'hold');
  const [h,n,s]=W.units, G=W.rules.grades['은신']; ok(h.stealthE>=G.B-1e-9&&h.stealthE>n.stealthE,'두건을 쓰면 숨는 솜씨가 적어도 B ('+n.stealthE.toFixed(2)+' → '+h.stealthE.toFixed(2)+')');
  ok(Math.abs(s.stealthE-G.S)<1e-9,'원래 더 좋으면 (은신S) 그대로');
  const am=E.armorMul(W.rules,h,'머리','날붙이'); ok(am.m===1,'두건은 머리를 막지 못함 (받는 피해 × '+am.m+')');
  const pr=E.penRes(W,W.units[3],h,'머리','front',false,W.rules.weapons['활'],false,false,null); ok(pr.pen&&pr.m===1,'화살이 두건에 박히지 않음 (관통 × '+pr.m+')');
  h.gear['머리'].dur=0; ok(Math.abs(E.stealthOf(W,h)-E.stealthOf0(W,h))<1e-9,'망가진 두건은 효과 없음'); }
// 4) 전리품 이름: 이름이 'X의 Y' 면 그대로
{ const W=W_([mk(INJ,0,5,5,{hero:true})],[mk({...DES['궁수'],name:'친칠라',gear:{머리:{name:'친칠라의 후드',mat:'두건',tier:1}}},1,8,5)],1,'hold'); W.camp=true; const e=W.units[1]; E.applyDmg(W,W.units[0],e,9999,{}); E.checkEnd(W);
  const L=E.lootOf(W); ok(L.some(x=>x.label==='친칠라의 후드'&&x.k==='helm'&&x.mat==='두건'),'전리품: 친칠라의 후드 (이름 그대로) · '+L.map(x=>x.label).join(' / ')); }
console.log(fails?`\n${fails} FAIL`:'\nALL 722 OK');
