// v8.7.6 시험 — eng8760.js v1.2 (v1.2: 누가 주우면 빠짐은 챙기지 않은 땅의 무기로 (전리품 창에서 챙긴 것은 '챙긴 것' 으로 남는 게 맞음 — 엔진 v1.3) · 챙겨서 땅에서 사라진 것은 챙긴 줄로 남음 · v1.1: 갑피 위의 장비 — 판을 넘어가도 갑피 위 · 덮여 있던 장비는 가방으로 · 망가지면 갑피가 드러남 · v1.0: 인벤토리 v2 엔진 — 두 손 무기는 무기 칸 둘 (카리우스 한 손 넷 · 두 손 둘 · J10) · 싸우는 중 장비 명령 inv (입기 · 벗기 · 방패 벗기 · 건네기 · 내려놓기 · 휘청이면 끊김 · 걸음 다시 셈 · 갑피 위에 입기) · 전리품 (쓰러진 동료의 것 · 진짜 시체만 · 주우면 다시 셈 · 챙긴 표시 이어 받음 · 갑옷 굴림 한 번 · 출처 열쇠) · 명령 글)
const {E,R,U,DES,GOB,INJ,NOR,KAR,REB,KIT,mk}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()) break; } };
const FAR=()=>mk({...DES['창병'],ov:{hp:9999}},1,58.5,1.5,{spdMul:0});
const WF=(units,o)=>{ const R2=JSON.parse(JSON.stringify(R)); R2.roe.def='hold'; R2.roe.autoLift=false; const W=E.createWorld({type:'grid',W:60,H:20,seed:7,units:[...units,FAR()],torches:[{x:20,y:10,r:60}],flips:[]},R2,o&&o.seed||1,{headless:true}); E.computeLight(W); const f=W.units[W.units.length-1]; f.order={k:'hold'}; return W; };
const ord=(W,u,o)=>{ u.order=o; };
const logK=(W,k,a)=>W.log.filter(l=>l.k===k&&(a==null||l.a===a));
const ARM=(mat,tier,nm,ex)=>({k:'armor',name:nm||mat+' 갑옷',label:nm||'',mat,tier,dur:100,...(ex||{})});
const HELM=(tier,nm)=>({k:'helm',name:nm||'투구',label:nm||'',mat:'투구',tier,dur:100});
const WPN=(name,ex)=>({k:'weapon',name,label:'',dur:100,...(ex||{})});

console.log('A. J10 두 손 무기는 무기 칸 둘 (카리우스 한 손 넷 · 두 손 둘)');
{ const W=WF([mk(KAR,0,10,10,{bag:[WPN('대검'),WPN('대검')]}),mk(INJ,0,12,10,{hero:true})]); const k=W.units[0];
  ok(E.wTwo(W,'대검')===2&&E.wTwo(W,'장검')===1&&E.wTwo(W,'대장군의 도끼')===2,'대검 · 대장군의 도끼 = 2칸 · 장검 = 1칸');
  ok(k.eqRule&&k.eqRule.wmax===4&&E.bagWpnN(k,W)===4,'카리우스: 대검 둘 = 무기 칸 4/4');
  ok(/무기 칸이 참/.test(E.bagRoomU(W,k,WPN('장검'))),'대검 둘이면 한 손 무기도 더 못 넣음 ('+E.bagRoomU(W,k,WPN('장검'))+')');
  const W2=WF([mk(KAR,0,10,10,{bag:[WPN('장검'),WPN('검'),WPN('둔기')]}),mk(INJ,0,12,10,{hero:true})]); const k2=W2.units[0];
  ok(E.bagWpnN(k2,W2)===3&&E.bagRoomU(W2,k2,WPN('창'))===''&&/무기 칸이 참/.test(E.bagRoomU(W2,k2,WPN('대검'))),'한 손 셋 (3/4) — 한 손 하나는 더 · 두 손은 못 넣음');
  const W3=WF([mk(KAR,0,10,10,{bag:[WPN('장검'),WPN('검'),WPN('둔기'),WPN('창')]}),mk(INJ,0,12,10,{hero:true})]); const k3=W3.units[0];
  ok(E.bagWpnN(k3,W3)===4&&/무기 칸이 참/.test(E.bagRoomU(W3,k3,WPN('단검'))),'한 손 넷 (4/4) 이면 더 못 넣음');
  const inj=W3.units[1]; ok(!inj.eqRule&&E.bagRoomU(W3,inj,WPN('대검'))==='','보통 사람은 무기 칸 한도 없음 (가방 칸만)'); }

console.log('B. 싸우는 중 갑옷 입기 · 벗기 (걸음 다시 셈 · 걸리는 시간)');
{ const W=WF([mk(INJ,0,10,10,{hero:true,bag:[ARM('판금',3,'기사의 판금 갑옷'),HELM(2,'낡은 투구')]}),mk(GOB,0,12,10)]); const u=W.units[0], sp0=u.spd;
  const a=u.bag.find(x=>x.k==='armor'), h=u.bag.find(x=>x.k==='helm');
  ord(W,u,{k:'inv',op:'wear',uid:a.uid}); E.stepWorld(W,1/30);
  ok(u.act&&u.act.k==='invAct'&&u.act.op==='wear'&&Math.abs(u.act.end-u.act.t0-4)<0.05,'갑옷 입기 4초 (invAct)');
  run(W,4.3); const g=u.gear['몸'];
  ok(g&&g.mat==='판금'&&g.tier===3&&g.name==='기사의 판금 갑옷'&&!u.bag.includes(a),'4초 뒤 몸에 판금 3성 · 가방에서 빠짐');
  const k1=1-E.gearW({몸:g},W.rules,{size:'중형',ref:E.ownKey(u)}); ok(Math.abs(u.spd-sp0*k1)<0.01&&u.spd<sp0,'걸음 = 무게만큼 느려짐 ('+sp0+' → '+u.spd+')');
  ok(logK(W,'gearOn',u.i).length===1,'기록: 입음 (gearOn)');
  ord(W,u,{k:'inv',op:'wear',uid:h.uid}); E.stepWorld(W,1/30); ok(u.act&&Math.abs(u.act.end-u.act.t0-1.5)<0.05,'투구 1.5초'); run(W,1.7);
  ok(u.gear['머리']&&u.gear['머리'].tier===2,'머리에 투구');
  const sp1=u.spd; ord(W,u,{k:'inv',op:'off',slot:'몸'}); run(W,4.3);
  ok(!u.gear['몸']&&u.bag.some(x=>x.k==='armor'&&x.mat==='판금'&&x.tier===3&&x.label==='기사의 판금 갑옷')&&u.spd>sp1&&Math.abs(u.spd-sp0*(1-E.gearW({머리:u.gear['머리']},W.rules,{size:'중형',ref:E.ownKey(u)})))<0.01,'갑옷 벗음 → 가방으로 · 걸음 돌아옴 ('+u.spd+')');
  ok(logK(W,'gearOff',u.i).length===1,'기록: 벗음 (gearOff)'); }

console.log('C. 휘청이면 끊김 · 못 입는 까닭 · 가방이 가득');
{ const W=WF([mk(INJ,0,10,10,{hero:true,bag:[ARM('판금',3)]}),mk(GOB,0,12,10)]); const u=W.units[0], a=u.bag[0];
  ord(W,u,{k:'inv',op:'wear',uid:a.uid}); run(W,1); E.stun(W,u,0.6); ok(!u.act&&logK(W,'invBreak',u.i).length===1,'입는 중 휘청 → 끊김 (invBreak)');
  run(W,4); ok(!u.gear['몸']&&u.bag.includes(a),'끊기면 아무것도 바뀌지 않음 (갑옷은 가방에)');
  const W2=WF([mk(KAR,0,10,10,{bag:[ARM('판금',4,'큰 판금')]}),mk(INJ,0,12,10,{hero:true})]); const k=W2.units[0];
  const why=E.wearWhyU(W2,k,k.bag[0]); ok(/카리우스 몸에 맞는 갑옷은 없음|갑피/.test(why),'카리우스: 몸 갑옷 못 입음 ('+why+')');
  ord(W2,k,{k:'inv',op:'wear',uid:k.bag[0].uid}); E.stepWorld(W2,1/30); ok(!k.act&&logK(W2,'miss',k.i).some(l=>l.inv==='wear'),'못 입으면 명령이 바로 안 됨 (까닭 기록)');
  const full=[...Array(8)].map(()=>({k:'ammo',at:'화살',n:30})); const W3=WF([mk(INJ,0,10,10,{hero:true,gear:{몸:{name:'가죽옷',mat:'가죽',tier:1}},bag:full}),mk(GOB,0,12,10)]); const u3=W3.units[0];
  ord(W3,u3,{k:'inv',op:'off',slot:'몸'}); E.stepWorld(W3,1/30); ok(!u3.act&&u3.gear['몸']&&logK(W3,'miss',u3.i).some(l=>/가방이 가득/.test(l.why)),'가방이 가득하면 못 벗음'); }

console.log('D. 갑피 위에 입기 (카리우스 투구) · 벗으면 갑피로');
{ const W=WF([mk(KAR,0,10,10,{bag:[HELM(2,'작은 투구'),HELM(5,'용사의 투구')]}),mk(INJ,0,12,10,{hero:true})]); const k=W.units[0], g0=k.gear['머리'];
  ok(g0&&g0.innate,'카리우스 머리 = 갑피 ('+(g0&&g0.tier)+'성)');
  const lo=k.bag.find(x=>x.tier===2), hi=k.bag.find(x=>x.tier===5);
  ok(/갑피/.test(E.wearWhyU(W,k,lo)),'갑피보다 낮은 투구는 소용없음 ('+E.wearWhyU(W,k,lo)+')');
  ord(W,k,{k:'inv',op:'wear',uid:hi.uid}); run(W,1.7);
  ok(k.gear['머리']&&k.gear['머리'].tier===5&&k.gear['머리'].over&&k.gear['머리'].over.innate,'더 단단한 투구는 갑피 위에 (벗으면 돌아갈 갑피를 기억)');
  ord(W,k,{k:'inv',op:'off',slot:'머리'}); run(W,1.7);
  ok(k.gear['머리']&&k.gear['머리'].innate&&k.bag.some(x=>x.k==='helm'&&x.tier===5),'벗으면 갑피로 · 투구는 가방에'); }

console.log('E. 방패 벗기 · 내려놓기 (무기 · 방패만)');
{ const W=WF([mk(REB,0,10,10,{bag:[WPN('검'),ARM('가죽',1)]}),mk(INJ,0,12,10,{hero:true})]); const r=W.units[0];
  ok(r.shield&&r.canBash,'레베카 방패');
  ord(W,r,{k:'inv',op:'off',slot:'shield'}); E.stepWorld(W,1/30); ok(r.act&&Math.abs(r.act.end-r.act.t0-0.5)<0.05,'방패 벗기 0.5초'); run(W,0.7);
  ok(!r.shield&&!r.canBash&&r.bag.some(x=>x.k==='shield'),'방패를 가방에 (밀치기 없음)');
  ok(r.canGuard===(!!W.rules.weapons[r.weapon].guard||!!r.reflex||!!r.parry),'막기는 든 무기대로');
  const sw=r.bag.find(x=>x.k==='weapon'); ord(W,r,{k:'inv',op:'drop',uid:sw.uid}); run(W,0.5);
  ok(!r.bag.includes(sw)&&W.items.some(it=>it.k==='weapon'&&it.name==='검'&&it.how==='put'),'가방의 검을 발밑에 내려놓음');
  const ar=r.bag.find(x=>x.k==='armor'); ord(W,r,{k:'inv',op:'drop',uid:ar.uid}); E.stepWorld(W,1/30);
  ok(r.bag.includes(ar)&&logK(W,'miss',r.i).some(l=>/무기 · 방패만/.test(l.why)),'싸우는 중엔 갑옷은 못 내려놓음 (D1 — 무기 · 방패만 바닥에)'); }

console.log('F. 건네기 (다가가서 · 받는 이 가방 확인)');
{ const W=WF([mk(INJ,0,10,10,{hero:true,bag:[WPN('장검'),{k:'potion',name:'회복약',label:'',heal:0.3}]}),mk(GOB,0,15,10)]); const a=W.units[0], b=W.units[1];
  const it=a.bag.find(x=>x.k==='weapon'); b.order={k:'hold'}; ord(W,a,{k:'inv',op:'give',uid:it.uid,to:b.i});
  run(W,6,()=>logK(W,'give',a.i).length>0);
  ok(logK(W,'give',a.i).length===1&&b.bag.some(x=>x.k==='weapon'&&x.name==='장검')&&!a.bag.includes(it),'5칸 떨어진 청광묵에게 다가가 장검을 건넴');
  ok(Math.hypot(a.x-b.x,a.y-b.y)<2.6,'건넬 때는 곁에서');
  const pot=a.bag.find(x=>x.k==='potion'); b.bag=[...Array(E.bagCapOf(W,b))].map((_,i)=>({k:'ammo',at:'일반',n:1,uid:9000+i}));
  ord(W,a,{k:'inv',op:'give',uid:pot.uid,to:b.i}); E.stepWorld(W,1/30);
  ok(a.bag.includes(pot)&&logK(W,'miss',a.i).some(l=>/가방이 가득/.test(l.why)),'받는 이 가방이 가득하면 안 됨'); }

console.log('G. 전리품 (D1 · J11): 쓰러진 동료의 것 · 진짜 시체만 · 다시 셈 · 챙긴 표시 · 굴림 한 번');
{ const KN={...DES['검기사']}, SP={...DES['창병']};
  const W=WF([mk(INJ,0,10,10,{hero:true}),mk(REB,0,11,10,{bag:[WPN('검')]}),mk(GOB,0,12,10),mk(KN,1,20,10,{gear:{몸:{name:'기사 갑옷',mat:'판금',tier:3},머리:{name:'기사 투구',mat:'투구',tier:2}}}),mk(SP,1,21,10),mk(SP,1,22,10)],{seed:3});
  const reb=W.units[1], kn=W.units[3], s1=W.units[4], s2=W.units[5];
  const kill=u=>{ u.hp=0; u.alive=false; E.dropOnDeath(W,u); };
  kill(reb); kill(kn); s1.alive=false; s1.gone='fled';   // 달아난 창병은 시체가 아님
  const L=E.lootOf(W), names=L.map(x=>(x.fall?'†':'')+(x.label||x.name||x.at));
  console.log('    전리품', names.join(' · '));
  ok(L.some(x=>x.fall==='레베카'&&x.k==='weapon'&&x.name==='검')&&L.some(x=>x.fall==='레베카'&&x.k==='armor')&&L.some(x=>x.fall==='레베카'&&x.k==='helm'),'쓰러진 동료 (레베카) 의 가방 · 갑옷 · 투구 (굴림 없이)');
  ok(L.some(x=>x.fall==='레베카'&&x.k==='shield')&&L.some(x=>x.fall==='레베카'&&x.k==='weapon'&&x.name==='장검'),'쓰러지며 떨어뜨린 레베카의 장검 · 방패도 (예전엔 동료 것이라 빠짐)');
  ok(!L.some(x=>/창병/.test(x.label||'')&&x.own===E.ownKey(s1)),'달아난 창병의 것은 없음 (진짜 시체만)');
  ok(L.every(x=>x.lk),'항목마다 출처 열쇠 (lk)');
  const kA=L.find(x=>x.lk==='a'+kn.i+'몸'), roll=W.lootRoll['a'+kn.i+'몸']; ok(roll!=null,'검기사 갑옷 굴림 한 번 ('+roll.toFixed(2)+(kA?' — 나옴':' — 안 나옴')+')');
  const g=L.find(x=>x.ground&&x.k==='weapon'&&!x.fall); g.taken='인주';
  const L2=E.lootOf(W); ok(L2===L,'바뀐 것 없으면 그대로 (다시 세지 않음)');
  kill(s2); const L3=E.lootOf(W); ok(L3!==L&&L3.find(x=>x.lk===g.lk).taken==='인주','새로 쓰러지면 다시 셈 — 챙긴 표시는 이어 받음');
  ok(!!L3.find(x=>x.lk==='a'+kn.i+'몸')===!!kA,'다시 세도 갑옷 굴림은 그대로');
  const inj=W.units[0], g2=L3.find(x=>x.ground!=null&&x.k==='weapon'&&!x.taken&&x.lk!==g.lk), it=W.items.find(x=>x.k==='weapon'&&x.id===g2.ground); E.takeItem(W,inj,it); const L4=E.lootOf(W);
  ok(!L4.some(x=>x.lk===g2.lk),'누가 주우면 목록에서 빠짐 (예전엔 남아 보였음) — '+(g2.label||g2.name));
  W.items=W.items.filter(x=>x.id!==g.ground); const L5=E.lootOf(W); ok((L5.find(x=>x.lk===g.lk)||{}).taken==='인주','전리품 창에서 챙겨 땅에서 사라진 것은 \'챙긴 것\' 으로 남음 (여정 기록)');
  const mine=W.items.find(x=>x.own===E.ownKey(inj)); ok(!mine||!L4.some(x=>x.ground===mine.id),'살아 있는 동료의 제 것은 전리품이 아님'); }

console.log('I. 갑피 위의 장비 (v1.2): 판을 넘어가도 · 덮인 장비 · 망가지면');
{ const W=WF([mk(KAR,0,10,10,{gear:{머리:{name:'용사의 투구',mat:'투구',tier:5}}}),mk(INJ,0,12,10,{hero:true})]); const k=W.units[0], g=k.gear['머리'];
  ok(g&&!g.innate&&g.tier===5&&g.over&&g.over.innate,'명단에 갑피보다 단단한 투구 → 판에서도 갑피 위 (over)');
  ord(W,k,{k:'inv',op:'off',slot:'머리'}); run(W,1.7);
  ok(k.gear['머리']&&k.gear['머리'].innate&&k.bag.some(x=>x.k==='helm'&&x.tier===5),'다음 판에 벗어도 갑피로 (예전엔 머리가 비었음)');
  const W2=WF([mk(KAR,0,10,10,{gear:{머리:{name:'낡은 투구',mat:'투구',tier:2}},bag:[HELM(5,'용사의 투구')]}),mk(INJ,0,12,10,{hero:true})]); const k2=W2.units[0];
  ok(k2.gear['머리'].innate&&k2.gear['머리'].under&&k2.gear['머리'].under.tier===2,'갑피 아래 낡은 투구 (덮임)');
  ord(W2,k2,{k:'inv',op:'wear',uid:k2.bag[0].uid}); run(W2,1.7); const g2=k2.gear['머리'];
  ok(g2.tier===5&&g2.over&&g2.over.innate&&!g2.over.under&&k2.bag.some(x=>x.k==='helm'&&x.tier===2),'갑피 위에 입으면 덮여 있던 낡은 투구는 가방으로 (사라지지 않음)');
  const h=W2.units[1]; g2.dur=0.3; E.wearHit(W2,h,k2,{},g2,40,0.5);
  ok(k2.gear['머리']&&k2.gear['머리'].innate&&logK(W2,'aBreak',k2.i).some(l=>l.bare),'갑피 위의 투구가 망가지면 갑피가 드러남 (aBreak bare)'); }

console.log('H. 명령 글 · 시험용');
{ ok(JSON.stringify(E.orderTxt({k:'inv',op:'give',uid:5,to:2}))===JSON.stringify(['inv','give',5,null,2]),'명령 글: inv'); }

console.log(fails?'FAILS '+fails:'ALL ENG8760 OK');
