// v7.26.1 UI 시험 — ui7261.js v1.4 (v1.4: 바꿔 들기 시험의 창병은 체력을 넉넉히 (권총이 1초 안에 쓰러뜨린 드문 판 — 바꿔 들 까닭이 사라지고 다음 줄이 멈추던 것) · 적이 없으면 멈추지 않고 실패로 적음 · v1.3: v8.7.3 바꿔 들기는 보이는 근접이 2.6칸 안에 1초 머물 때 (1.2칸 안이면 곧바로) · 되돌림 시험은 간두 제자리 (어둠 속 탐색으로 적에게 다가가 흔들리던 것) · v1.2: 훈련장으로 바꾼 뒤 잠깐 기다림 · 적이 없으면 창병 하나 · v1.1: 확인 창은 판 위의 창 (v8.2.1) — __askAuto 로 예 · v1.0: ↑ 맵 단추 = 모두 (대장만 골라도) · 대장이 넘어가면 남은 동료가 따라감 · 제자리 (정지) 는 남음 / 고립 합류: 6칸 안에 동료 없이 4초 → 자리를 풀고 합류 · 제자리는 그대로 /
//   명령이 안 닿음 로그는 3초에 한 번 / 간두: 겨누는 중에도 코앞 (2.6칸) 이면 샷건 · 멀어지면 권총 · 탄 칸에 총 이름 · '🔁 샷건으로' 띠 / 갑옷 아이콘이 작은 판에서도 / 좁은 문: 4S 유적 다섯 판 모두 도착)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const ctx0=await b.newContext({viewport:{width:1280,height:860}}); await ctx0.addInitScript('window.__askAuto=true'); const p=await ctx0.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const STEP = n => `(()=>{ mode='run'; paused=false; for (let k=0;k<${n};k++) stepWorld(world,1/30); paused=true; mode='plan'; return world.t; })()`;
 const CAMP1 = `(()=>{ setMode('story'); if (S.camp) campQuit(); campStart({ direct: true }); const C=S.camp, party=S.units.filter(u=>u.side===0); C.stages[1]={ seed: 5, tseed: 5 }; C.s=1; campBuild(1,'down',party); while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   for (const f of world.units) if (f.side===1) f.alive=false; checkEnd(world); world.cleared=true; campBarRender(true); return world.units.filter(u=>u.side===0&&u.alive).length; })()`;

 // 1) ↑ 단추는 모두 (대장만 골라도)
 const n1 = await p.evaluate(CAMP1);
 const e1 = await p.evaluate(()=>{ const h=world.units.find(u=>u.hero); sel=new Set([h.i]); const bt=document.querySelector('#campBar [data-cexit="up"]'); if (!bt) return { nobtn:true }; bt.click(); const al=world.units.filter(u=>u.side===0&&u.alive);
   return { n: al.length, exit: al.filter(u=>u.order&&u.order.k==='exit').length, pend: al.filter(u=>u.ordPend).length }; });
 console.log('    ↑ 단추', JSON.stringify(e1)); ok(!e1.nobtn&&e1.n>=5&&e1.exit===e1.n&&e1.pend===0,'끝난 맵: ↑ 4S 단추를 누르면 고른 이와 상관없이 모두 위로 (말이 바로 닿음)');

 // 2) 대장이 넘어가면 따라감 · 제자리는 남음
 await p.evaluate(CAMP1);
 const f2 = await p.evaluate(()=>{ const al=world.units.filter(u=>u.side===0&&u.alive), h=al.find(u=>u.hero), hold=al.find(u=>!u.hero); for (const u of al){ u.order=null; u.ordPend=null; } hold.order={k:'hold'}; hold.ordLive=hold.order;
   leaveMap(world, h, 'up'); return { hold: hold.name, follow: al.filter(u=>u!==h&&u!==hold&&u.order&&u.order.k==='exit'&&u.order.dir==='up').length, others: al.length-2, holdK: hold.order&&hold.order.k, log: world.log.some(l=>l.k==='followOut') }; });
 console.log('    따라감', JSON.stringify(f2)); ok(f2.follow===f2.others&&f2.holdK==='hold'&&f2.log,'대장이 맵을 나가면 남은 동료가 같은 길로 따라감 · 제자리 (정지) 명령인 '+f2.hold+'만 남음');
 await p.evaluate(STEP(30*25)); const f3 = await p.evaluate(()=>({ gone: world.units.filter(u=>u.side===0&&u.gone==='up').length, left: world.units.filter(u=>u.side===0&&u.alive).map(u=>u.name) }));
 console.log('    25초 뒤', JSON.stringify(f3)); ok(f3.left.length===1&&f3.gone>=4,'25초 뒤 모두 넘어가고 제자리 한 명만 남음 ('+f3.left.join('')+')');

 // 3) 명령이 안 닿음 로그는 3초에 한 번
 await p.evaluate(CAMP1);
 const m3 = await p.evaluate(()=>{ const u=world.units.find(u=>u.side===0&&u.alive&&!u.hero); const n0=world.log.filter(l=>l.k==='cmdMiss').length; mode='run'; paused=false;
   for (let k=0;k<6;k++){ u.ordPend={ o:{k:'hold'}, at: world.t, ok:false, p:0, via:'none', why:'닿지 않음', c:null, t0: world.t }; stepWorld(world,1/30); stepWorld(world,1/30); } paused=true; mode='plan';
   return world.log.filter(l=>l.k==='cmdMiss').length - n0; });
 ok(m3===1,'명령이 안 닿음 — 짧은 사이 여섯 번 안 닿아도 로그 한 줄 ('+m3+')');

 // 4) 고립 합류 (끝난 맵 — 적 없음) · 제자리는 그대로
 await p.evaluate(CAMP1);
 const g4 = await p.evaluate(()=>{ const al=world.units.filter(u=>u.side===0&&u.alive&&!u.hero), a=al[0], c=al[1]; const W=world; for (const u of al){ u.order=null; u.ordPend=null; }
   const q=freeSpot(W, W.map.W-2.5, 2.5, a.r) || { x: W.map.W-2.5, y: 2.5 }; a.x=q.x; a.y=q.y; a.stay={x:a.x,y:a.y}; const q2=freeSpot(W, 1.5, 2.5, c.r) || { x: 1.5, y: 2.5 }; c.x=q2.x; c.y=q2.y; c.order={k:'hold'}; c.stay=null; c.ordLive=c.order; return { a: a.name, c: c.name, t0: W.t }; });
 await p.evaluate(STEP(30*3)); const g4a = await p.evaluate(()=>{ const a=world.units.filter(u=>u.side===0&&!u.hero&&u.alive)[0]; return { stay: !!a.stay, rj: world.log.filter(l=>l.k==='rejoin').map(l=>world.units[l.a].name) }; });
 await p.evaluate(STEP(30*2.2)); const g4b = await p.evaluate(()=>{ const al=world.units.filter(u=>u.side===0&&!u.hero&&u.alive); return { stay: !!al[0].stay, ord: al[0].order&&al[0].order.k, rj: world.log.filter(l=>l.k==='rejoin').map(l=>world.units[l.a].name), holdK: al[1].order&&al[1].order.k }; });
 await p.evaluate(STEP(30*12)); const g4c = await p.evaluate(()=>{ const al=world.units.filter(u=>u.side===0&&u.alive), a=al.filter(u=>!u.hero)[0], h=al.find(u=>u.hero); return { d: +Math.hypot(a.x-h.x,a.y-h.y).toFixed(1) }; });
 console.log('    고립', JSON.stringify(g4), JSON.stringify(g4a), JSON.stringify(g4b), JSON.stringify(g4c)); ok(g4a.stay&&!g4b.stay&&g4b.rj.includes(g4.a)&&!g4b.rj.includes(g4.c)&&g4b.holdK==='hold'&&g4c.d<4,'끝난 맵 고립: 3초엔 그대로 · 4초 넘으면 '+g4.a+'이(가) 스스로 대장 곁으로 ('+g4c.d+'칸) · 제자리 '+g4.c+'는 그대로');

 // 5) 간두: 겨누는 중에도 코앞이면 샷건 · 멀어지면 권총 · 탄 칸 · 띠 (훈련장)
 await p.evaluate(()=>{ setMode('train'); if (S.camp) campQuit(); }); await p.waitForTimeout(200);
 await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1).slice(0,1); if (!S.units.length){ const f=fromDesign(designByKey('창병'),1); f.x=20.5; f.y=10.5; S.units.push(f); } const g=fromDesign(designByKey('간두'),0); g.x=10.5; g.y=10.5; S.units.push(g); rebuildMap(); changed(); start(); });
 const s5 = await p.evaluate(()=>{ const W=world, g=W.units.find(u=>u.name==='간두'), e=W.units.find(u=>u.side===1&&u.alive); e.max=e.hp=Math.max(e.hp,5000); e.seenBy=true; e.x=g.x+6; e.y=g.y; g.face=0; e.face=Math.PI; computeLight(W);
   mode='run'; paused=false; startAct(W,g,e,'시험'); const a0=g.act&&g.act.k; e.x=g.x+g.r+e.r+2.0; let sw=null, lab=null; for (let k=0;k<60;k++){ stepWorld(W,1/30); if (g.act&&g.act.k==='altSwap'&&!sw){ sw=k; draw(); } if (g.weapon==='샷건') break; } paused=true; mode='plan';
   return { a0, sw, w: g.weapon, alt: g.alt&&g.alt.name, log: W.log.filter(l=>l.k==='altSwap').map(l=>l.why) }; });
 console.log('    간두', JSON.stringify(s5)); ok(s5.a0==='atk'&&s5.sw!=null&&s5.sw>=24&&s5.sw<=40&&s5.w==='샷건'&&s5.alt==='권총','간두: 권총으로 겨누던 중 적이 2칸 안에 1초 머물면 샷건 ('+(s5.sw)+' 틱 · '+s5.log.join('')+')');
 const s5b = await p.evaluate(()=>{ const W=world, g=W.units.find(u=>u.name==='간두'), e=W.units.find(u=>u.side===1&&u.alive); if (!e) return { w: null }; e.x=g.x+9; e.order={k:'hold'}; g.order={k:'hold'}; g.ordLive=g.order; mode='run'; paused=false; for (let k=0;k<30*3;k++){ stepWorld(W,1/30); if (g.weapon==='권총') break; } paused=true; mode='plan'; g.order=null; g.ordLive=null; return { w: g.weapon }; });
 ok(s5b.w==='권총','적이 멀어지면 (4.2칸 밖 1.5초) 다시 권총');
 const lab = await p.evaluate(()=>{ const W=world, g=W.units.find(u=>u.name==='간두'); const txt=[]; const ft=ctx.fillText.bind(ctx); ctx.fillText=(s,...a)=>{ txt.push(String(s)); return ft(s,...a); }; draw(); g.act={ k:'altSwap', phase:'wind', t0:W.t, end:W.t+0.35 }; draw(); g.act=null; ctx.fillText=ft; return txt.filter(s=>/권총|샷건/.test(s)); });
 console.log('    글', JSON.stringify(lab)); ok(lab.some(s=>/^권총 \d/.test(s))&&lab.some(s=>/🔁 샷건으로/.test(s)),'탄 칸에 든 총 이름 (권총 n·n) · 바꿔 드는 동안 "🔁 샷건으로"');
 const s5c = await p.evaluate(()=>{ const W=world, g=W.units.find(u=>u.name==='간두'), e=W.units.find(u=>u.side===1&&u.alive); g.act=null; g.altNearT=null; e.x=g.x+g.r+e.r+0.9; e.y=g.y; computeLight(W); mode='run'; paused=false; let sw=null; for (let k=0;k<30;k++){ stepWorld(W,1/30); if (g.act&&g.act.k==='altSwap'&&sw==null) sw=k; if (g.weapon==='샷건') break; } paused=true; mode='plan'; return { sw, w: g.weapon }; });
 ok(s5c.sw!=null&&s5c.sw<=3,'코앞 (1칸 안) 이면 머물지 않고 곧바로 샷건 ('+s5c.sw+' 틱)');

 // 6) 갑옷 아이콘: 작은 판에서도
 const ar = await p.evaluate(()=>{ const e0=S.units.find(u=>u.side===1); S.units=S.units.filter(u=>u.side===0||u===e0); const k=fromDesign(designByKey('레베카'),0); k.x=8.5; k.y=8.5; S.units.push(k); rebuildMap(); changed(); start(); let n=0; const f0=window.iconArmor; window.iconArmor=(...a)=>{ n++; return f0(...a); }; const z0=cam.z; cam.z=Math.min(cam.z, 20/TS); draw(); const ts=TS*cam.z; window.iconArmor=f0; cam.z=z0; return { n, ts: +ts.toFixed(1) }; });
 ok(ar.n>=1&&ar.ts<26,'갑옷 아이콘: 칸 '+ar.ts+'px 의 작은 판에서도 그려짐 ('+ar.n+')');

 ok(!errs.length,'오류 없음 '+errs.slice(0,2).join(' | '));
 await b.close(); console.log(fails?`${fails} FAIL`:'ALL UI7261 OK'); })();
