// v7.20 시험 — eng720.js v1.1 (v1.1: 탄 시험은 1발 · 가까이 · 갑옷 시험은 장검으로 · 루팅 이름은 '검기사의 ' 로 · 가방 탄 · 탄이 떨어지면 가방 무기 · 방패 · 무기 부러짐 → 가방 무기 · 방패 부서짐 · 갑옷 닳음 · 망가짐 · 루팅 이름 · 카리우스 제한 · 두 손 무기 · 남의 무기 · 큰 갑옷 무게 · 꺼내 듦 명령 · 들던 무기는 가방으로)
const {E,DES,NOR,INJ,KAR,mk,W_}=require('./scen_lib790.js');
let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
const run=(W,sec,cb)=>{ const end=W.t+sec; while(W.t<end&&!W.over){ E.stepWorld(W,1/30); if(cb&&cb()===true) break; } };
const lit=W=>{ W.torches=[{x:10,y:8,r:30}]; E.computeLight(W); };
const KN={...DES['검기사'],weapon:'장검'};

console.log('A. 가방 탄: 든 무기의 탄이 다 떨어지면 같은 종류 탄을 꺼냄');
{ const W=W_([mk({...NOR,ammo:1,bag:[{k:'ammo',at:'일반',n:40}]},0,4,8),mk(INJ,0,1,1,{hero:true})],[mk(DES['창병'],1,9,8)],1,'free'); lit(W); const n=W.units[0];
  run(W,12,()=>W.log.some(l=>l.k==='bagAmmo'&&l.a===n.i)); const l=W.log.find(x=>x.k==='bagAmmo'&&x.a===n.i);
  console.log('    ', JSON.stringify(l), '남은 탄', n.ammo, '가방', JSON.stringify(n.bag));
  ok(!!l&&l.n>0&&n.ammo>0&&n.weaponNow!=='맨손','탄을 꺼내 다시 쏨'); }

console.log('B. 탄이 없고 가방 탄도 없으면 가방의 근접 무기 · 방패를 꺼내 듦');
{ const W=W_([mk({...NOR,ammo:0,bag:[{k:'weapon',name:'검',label:'노먼의 검'},{k:'shield',name:'방패',label:'노먼의 방패'}]},0,4,8),mk(INJ,0,1,1,{hero:true})],[mk(DES['창병'],1,12,8)],1,'free'); lit(W); const n=W.units[0];
  run(W,4,()=>W.log.some(l=>l.k==='bagSwap'&&l.a===n.i)); const l=W.log.find(x=>x.k==='bagSwap'&&x.a===n.i);
  console.log('    ', JSON.stringify(l), '든 것', n.weapon, n.wName, '방패', n.shield, '가방', JSON.stringify(n.bag.map(x=>x.label||x.name)));
  ok(!!l&&n.weapon==='검'&&n.wName==='노먼의 검'&&n.shield&&!E.unarmed?.(n)&&n.rng<1,'검 + 방패를 꺼내 듦'); ok(n.bag.some(x=>x.name==='소총'),'빈 소총은 가방으로');
  ok(l&&l.t-0<2.5,'1.3초 남짓 (꺼내는 시간)'); }

console.log('C. 근접 무기 부러짐 → 가방 무기');
{ const W=W_([mk({...KN,name:'검사',bag:[{k:'weapon',name:'둔기',label:'예비 철퇴'}]},0,4,8),mk(INJ,0,1,1,{hero:true})],[mk({...DES['검방패기사'],weapon:'장검'},1,5.3,8)],1,'free'); lit(W);
  W.rules.dur.breakP=1; const a=W.units[0], b=W.units[2]; a.order={k:'attack',b:b.i};
  run(W,10,()=>W.log.some(l=>l.k==='bagSwap'&&l.a===a.i)); const br=W.log.find(l=>l.k==='wBreak'), sw=W.log.find(l=>l.k==='bagSwap'&&l.a===a.i);
  console.log('    ', JSON.stringify(br), JSON.stringify(sw));
  ok(!!br,'막힐 때 무기가 부러짐 (확률 1 로 맞춤)'); ok(!!sw&&(a.weapon==='둔기'||W.log.some(l=>l.k==='wBreak'&&l.a===a.i&&l.t>sw.t)),'가방의 철퇴를 꺼내 듦'); }

console.log('D. 방패 부서짐');
{ const W=W_([mk(KN,0,4,8),mk(INJ,0,1,1,{hero:true})],[mk({...DES['검방패기사'],weapon:'장검',sDur:2},1,5.3,8)],1,'free'); lit(W); const a=W.units[0], b=W.units[2]; a.order={k:'attack',b:b.i};
  run(W,12,()=>W.log.some(l=>l.k==='sBreak')); const l=W.log.find(x=>x.k==='sBreak');
  console.log('    ', JSON.stringify(l), '방패', b.shield, 'canGuard', b.canGuard);
  ok(!!l&&!b.shield&&b.sDur===0,'막다 방패가 부서져 잃음'); }

console.log('E. 갑옷 닳음 · 망가짐');
{ const W=W_([mk({...KN,name:'검사'},0,4,8),mk(INJ,0,1,1,{hero:true})],[mk({...KN,gear:{몸:{name:'판금 갑옷',mat:'판금',tier:3,dur:6},머리:{name:'쇠 투구',mat:'투구',tier:2}}},1,5.4,8)],1,'free'); lit(W);
  const a=W.units[0], b=W.units[2]; a.order={k:'attack',b:b.i}; b.guardMode='off'; const d0=b.gear['몸'].dur;
  run(W,15,()=>W.log.some(l=>l.k==='aBreak')||!b.alive); const l=W.log.find(x=>x.k==='aBreak'), m=E.armorMul(W.rules,b,'몸통','둔기');
  console.log('    처음', d0, '지금', b.gear['몸'].dur, JSON.stringify(l), '막는 몫', m.m);
  ok(b.gear['몸'].dur<d0,'맞으면 닳음'); ok(!l||m.m===1,'망가지면 막지 못함');
  const it={mat:'판금',tier:3,dur:10}, R=W.rules; const t1={gear:{몸:{...it,dur:100}}}, t2={gear:{몸:{...it,dur:10}}};
  ok(E.armorMul(R,t2,'몸통','날붙이').m>E.armorMul(R,t1,'몸통','날붙이').m,'낡은 갑옷 (25 아래) 은 덜 막음'); }

console.log('F. 루팅 이름');
{ const W=W_([mk(KN,0,4,8),mk(INJ,0,1,1,{hero:true})],[mk(DES['검기사'],1,5.3,8),mk(DES['검방패기사'],1,9,3)],1,'free'); lit(W); const k=W.units[2], s2=W.units[3];
  k.hp=1; W.units[0].order={k:'attack',b:k.i}; run(W,8,()=>!k.alive); s2.hp=0; s2.alive=false; E.dropOnDeath&&E.dropOnDeath(W,s2);
  const L=W.items.map(x=>x.label); console.log('    ', JSON.stringify(L));
  ok(L.some(x=>/^검기사의 /.test(x)),'검기사의 (무기)'); ok(!E.dropOnDeath||L.includes('검방패기사의 방패'),'검방패기사의 방패'); }

console.log('G. 카리우스 · 두 손 무기 · 무기 한도');
{ const W=W_([mk({...KAR,eq:{body:false,ranged:false,wmax:4},headSize:'중형'},0,4,8),mk({...DES['곤봉적'],name:'탕아',weapon:'대검',shield:false,sizeCls:'중형'},0,6,8),mk(INJ,0,1,1,{hero:true})],[mk(DES['창병'],1,20,3)],1,'hold');
  const k=W.units[0], t=W.units[1];
  ok(!E.canTake(W,k,{k:'weapon',name:'궁수의 활'})&&!E.canTake(W,k,{k:'weapon',name:'권총'})&&E.canTake(W,k,{k:'weapon',name:'장검'}),'카리우스: 원거리 무기 못 듦 · 장검은 됨');
  E.equip(W,k,'몸',{name:'판금 갑옷',mat:'판금',tier:3}); ok(!k.gear['몸']||k.gear['몸'].innate,'카리우스: 몸 갑옷 못 입음');
  E.equip(W,k,'머리',{name:'쇠 투구',mat:'투구',tier:2}); ok(k.gear['머리']&&k.gear['머리'].name==='쇠 투구','카리우스: 투구는 됨');
  ok(!E.canTake(W,t,{k:'shield'}),'대검 (두 손) 은 방패와 함께 못 듦'); }

console.log('H. 남의 무기 · 큰 갑옷 무게');
{ const W=W_([mk({...NOR,weapon:'장검',wOwn:'#검기사',wName:'검기사의 장검'},0,4,8),mk(INJ,0,1,1,{hero:true})],[mk(DES['창병'],1,20,3)],1,'hold'); const n=W.units[0];
  ok(n.wForeign&&Math.abs(E.wpnSpd(W,n)-1.06)<1e-9,'남의 무기는 준비 ×1.06');
  const R=W.rules, g={몸:{name:'검기사의 갑옷',mat:'판금',tier:3,size:'중대형',own:'#검기사'}};
  const w0=E.gearW({몸:{name:'갑옷',mat:'판금',tier:3}},R,{size:'중형',ref:'C-007'}), w1=E.gearW(g,R,{size:'중형',ref:'C-007'});
  console.log('    무게 몫 내 것', w0.toFixed(3), '· 검기사의 갑옷', w1.toFixed(3)); ok(Math.abs(w1/w0-1.35*1.1)<1e-6,'한 단계 큰 남의 갑옷 = 무게 ×1.35 ×1.1'); }

console.log('I. 꺼내 듦 명령 · 주우면 든 무기는 가방으로');
{ const W=W_([mk({...KN,name:'검사',bag:[{k:'weapon',name:'창',label:'예비 창'}]},0,4,8),mk(INJ,0,1,1,{hero:true})],[mk(DES['창병'],1,20,3)],1,'hold'); const a=W.units[0];
  const uid=a.bag[0].uid; a.order={k:'swap',uid}; run(W,1.5,()=>a.weapon==='창'); const l=W.log.find(x=>x.k==='bagSwap'&&x.a===a.i);
  console.log('    ', JSON.stringify(l), '가방', JSON.stringify(a.bag.map(x=>x.label||x.name)));
  ok(a.weapon==='창'&&a.bag.some(x=>x.name==='장검')&&l&&l.why==='명령','명령으로 창을 꺼내 듦 · 장검은 가방으로');
  const it={id:999,k:'weapon',name:'둔기',label:'창병의 철퇴',x:a.x,y:a.y,owner:3,own:'#창병',dur:70}; W.items.push(it); E.takeItem(W,a,it);
  ok(a.weapon==='둔기'&&a.wName==='창병의 철퇴'&&a.wDur===70&&a.wForeign&&a.bag.some(x=>x.name==='창'),'주운 철퇴: 이름 · 내구도 · 남의 무기 · 들던 창은 가방으로'); }

console.log(fails?`\n${fails} FAIL`:'\nALL 720 OK');
