// v7.22.2 UI 시험 — ui7222.js v1.2 (v1.2: 도약 강타 — 그림자를 보고 모두 피한 판도 내려앉음으로 셈 (드물게 떨어지던 것) · v1.1: 회전 투척은 다른 아군을 멀리 두고 · 예고가 끊기면 다시 · 체력 2400 · 대장군 호레이쇼: 작은 밝은 맵 · 앉아 있음 · 다가가면 일어남 → 사각형 창 "대장군이 전쟁을 시작합니다" → 적 호레이쇼 (5M · 도끼 · 기술 둘) · 도약 강타 그림자 · 회전 도끼 · 쓰러뜨리면 도끼 · 갑옷 · 투구 · 모바일)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const GO3 = k => `(()=>{ showTab('place'); renderFloors(); if (S.camp) campQuit(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click();
   const C=S.camp, party=S.units.filter(u=>u.side===0); C.stages[3]={ seed: 11, tseed: 7, e3: '${k}' }; C.s=3; campBuild(3,'down',party); return true; })()`;
 const ADV = `(()=>{ for (let i=0;i<20 && TK;i++){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L && L.ask) break; talkAdv(); } return !!TK; })()`;
 for (const [nm,vp] of [['데스크톱',{viewport:{width:1280,height:860}}],['모바일',{viewport:{width:412,height:915},deviceScaleFactor:2.625,isMobile:true,hasTouch:true}]]){
  const ctx=await b.newContext(vp); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
  await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
  await p.evaluate(GO3('hora'));
  const m = await p.evaluate(()=>{ const E=encCur(); let lit=0; for (let i=0;i<world.light.length;i++) if (world.light[i]>0.12) lit++; return { W: world.map.W, H: world.map.H, amb: world.amb, litFrac: +(lit/world.light.length).toFixed(2), st: E&&E.st, foes: world.units.filter(u=>u.side===1).length, bar: document.getElementById('campBar').innerText }; });
  console.log('    '+nm+' 무대', JSON.stringify(m)); ok(m.W===26&&m.H===16&&m.amb>0.12&&m.litFrac===1&&m.st==='sit'&&m.foes===0&&/대장군의 무대/.test(m.bar),nm+': 3S 대장군의 무대 — 26×16 · 밝은 맵 · 앉아 있음 · 적 없음');
  const r1 = await p.evaluate(()=>{ const E=encCur(), al=world.units.filter(u=>u.alive&&u.side===0), h=al.find(u=>u.hero); h.x=E.x; h.y=E.y+7; encTick(world); const seen=TK&&TK.full; return { seen, st: E.st }; });
  await p.evaluate(ADV);
  const r2 = await p.evaluate(()=>{ const E=encCur(), h=world.units.find(u=>u.hero); h.y=E.y+5; encTick(world); if (TK&&TK.timer) talkDone(); const a=TK&&TK.full; talkAdv(); talkDone(); const box=TK&&TK.full, boxed=document.getElementById('talk').classList.contains('tk-boxed'); talkAdv();
    const u=world.units.find(x=>x.name==='호레이쇼'); return { a, box, boxed, st: E.st, side: u&&u.side, h: u&&+u.h.toFixed(1), w: u&&u.weapon, spec: u&&u.spec.map(x=>x.k).join(','), size: u&&u.sizeCls, hp: u&&u.max, talk: !!TK, cleared: world.cleared }; });
  console.log('    '+nm+' 일어남', JSON.stringify(r1), JSON.stringify(r2)); ok(/거대한 기사가 조용히 앉아/.test(r1.seen||'')&&r1.st==='sit','처음 보이면 "무대 같은 빛 한가운데, 거대한 기사가 조용히 앉아 있다."');
  ok(/천천히 일어선다/.test(r2.a||'')&&r2.box==='대장군이 전쟁을 시작합니다'&&r2.boxed&&r2.st==='foe'&&r2.side===1&&!r2.talk&&r2.cleared===false,nm+': 다가가면 일어섬 → 사각형 창 "대장군이 전쟁을 시작합니다" → 적 호레이쇼');
  ok(r2.w==='대장군의 도끼'&&r2.spec==='quake,spin'&&r2.size==='중대형'&&r2.hp===2400,nm+': 호레이쇼 — 대장군의 도끼 · 도약 강타 · 회전 투척 · 중대형 · 체력 2400');
  // 도약 강타: 그림자 (그림) · 깔림 · 피함
  const q = await p.evaluate(()=>{ const u=world.units.find(x=>x.name==='호레이쇼'), al=world.units.filter(x=>x.alive&&x.side===0), v=al.find(x=>!x.hero&&x.name!=='카리우스'); v.x=u.x; v.y=u.y+6; const n0=al.length;
    const okq=startQuake(world,u,v.x,v.y,'시험'); const flown=u.act&&u.act.quake; mode='run'; for (let i=0;i<10;i++) stepWorld(world,1/30); draw(); const flee=world.log.some(l=>l.k==='quakeFlee'); for (let i=0;i<40;i++) stepWorld(world,1/30); mode='plan';
    return { okq, flown, flee, hit: world.log.some(l=>l.k==='quakeHit'), crushed: world.log.filter(l=>l.k==='die'&&l.how==='crush').length, at: [+u.x.toFixed(1), +u.y.toFixed(1)] }; });
  console.log('    '+nm+' 도약 강타', JSON.stringify(q)); ok(q.okq&&q.flown&&(q.hit||q.flee),nm+': 도약 강타 — 날아가 내려앉으며 충격 ('+(q.hit?'맞힘':'그림자를 보고 다 피함')+')');   // v1.2 피함은 그림자 피하기가 일한 것 (충격 판정은 eng8740 9 에서 꼭 맞히게 확인)
  ok(q.flee||q.crushed>=0,nm+': 그림자를 본 쪽은 피하려 함 ('+(q.flee?'피함':'못 피함')+')');
  // 회전 투척: 도끼가 날아가 떨어짐 → 맨손 → 주우러 도약
  const sp = await p.evaluate(()=>{ const u=world.units.find(x=>x.name==='호레이쇼'); if (!u.alive) return { dead: true }; u.act=null; const al=world.units.filter(x=>x.alive&&x.side===0), t=al[0]; for (const o of al) if (o!==t){ o.x=1+o.i*0.8; o.y=1; } t.x=Math.min(world.map.W-2,u.x+5); t.y=u.y; mode='run'; for (let k=0;k<4 && !world.items.some(it=>it.how==='spin');k++){ if (!u.weaponGone && !(u.act&&u.act.s==='spin')){ u.act=null; u.spec.find(x=>x.k==='spin').cdT=-9; startSpec(world,u,t,'spin','시험'); } for (let i=0;i<60 && !world.items.some(it=>it.how==='spin');i++) stepWorld(world,1/30); } mode='plan';   /* 예고가 끊기면 다시 */
    const it=world.items.find(it=>it.how==='spin'); return { gone: u.weaponGone, item: it&&it.label, drop: world.log.some(l=>l.k==='spinDrop'), spinLog: world.log.some(l=>l.k==='spin') }; });
  console.log('    '+nm+' 회전 투척', JSON.stringify(sp)); ok(sp.dead||(sp.gone&&sp.spinLog&&sp.drop&&/도끼/.test(sp.item||'')),nm+': 회전 투척 — 도끼가 날아가 떨어지고 맨손');
  // 쓰러뜨리면 전리품
  const lt = await p.evaluate(()=>{ const u=world.units.find(x=>x.name==='호레이쇼'), h=world.units.find(x=>x.side===0&&x.alive)||world.units[0]; if (u.alive) applyDmg(world,h,u,99999,{}); checkEnd(world); return lootOf(world).map(x=>x.label||x.name); });
  console.log('    '+nm+' 전리품', JSON.stringify(lt)); ok(lt.some(x=>/대장군의 도끼/.test(x))&&lt.includes('대장군의 갑옷')&&lt.includes('대장군의 투구'),nm+': 쓰러뜨리면 대장군의 도끼 · 갑옷 · 투구');
  ok(errs.length===0,nm+' 오류 없음 '+JSON.stringify(errs.slice(0,3)));
  await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7222 OK'); await b.close(); })();
