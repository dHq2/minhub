// v5.9.0 모바일 (노트 20): 꾹 = 슬로우 + 기술 부채 · 끌어 고름 · 아래 = 취소 · 켜진 기술 = 대상 탭 · 탭은 이동 · 공격만 — mob7.js v1.1 (v1.1: 재생 뒤 동료들이 대형 자리로 걸음을 멈출 때까지 기다린 뒤 꾹 — v8.7.5 부터 싸움이 시작되면 대형으로 모여서, 그 사이 인주 자리를 꾹 누르면 지나가던 노먼이 눌리던 것)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx = await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  const cdp = await ctx.newCDPSession(p);
  const T = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  const posOf = n => p.evaluate(n=>{ const u=world.units.find(u=>u.name===n); return {x:u.x,y:u.y}; }, n);
  const tapSel = async (sel) => { const r = await p.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const q=e.getBoundingClientRect(); return {x:q.left+q.width/2,y:q.top+q.height/2}; }, sel); if(!r){ console.log('  !! no', sel); return; } await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(150); };
  const st = () => p.evaluate(()=>({ focus: focus ? { phase: focus.phase, hi: focus.hi, cancel: focus.cancel, items: focus.items.map(i=>i.k).join(',') } : null, chargePick, throwPick, skillPick, armed: armed && armed.k, slow: slowNow(), sel: [...sel].map(i=>world.units[i].name).join(','), t: +world.t.toFixed(2) }));
  await tapSel('#dPlay [data-dk="start"]'); await p.waitForTimeout(300); await tapSel('#dPlay [data-dk="play"]'); await p.waitForTimeout(500);
  await p.waitForFunction(()=>{ const L=world.units.filter(u=>u.side===0&&u.alive); const st=L.every(u=>Math.hypot(u.vx||0,u.vy||0)<0.05); window.__still=(st?(window.__still||0)+1:0); return window.__still>=8; }, null, { timeout: 8000, polling: 50 }).catch(()=>{});   // v1.1 대형으로 모이는 걸음이 멈출 때까지
  // 1) 인주를 꾹 → 부채
  let q = await scr(...Object.values(await posOf('인주')));
  const t0 = await p.evaluate(()=>world.t); await T('touchStart', q.x, q.y); await p.waitForTimeout(600);
  console.log('1 꾹:', JSON.stringify(await st())); await p.screenshot({path:'m7-fan.png'});
  const t1 = await p.evaluate(()=>world.t); await p.waitForTimeout(500); const t2 = await p.evaluate(()=>world.t);
  console.log('  슬로우: 0.5초 동안 게임 시간', (t2-t1).toFixed(3), '초');
  // 2) 돌진 쪽으로 끌기
  const ang = await p.evaluate(()=>focus.items.find(i=>i.k==='charge').a);
  await T('touchMove', q.x + Math.cos(ang*Math.PI/180)*70, q.y + Math.sin(ang*Math.PI/180)*70); await p.waitForTimeout(120);
  console.log('2 끌기 →', JSON.stringify(await st())); await p.screenshot({path:'m7-drag.png'});
  await T('touchEnd'); await p.waitForTimeout(150);
  console.log('  놓음 →', JSON.stringify(await st()), '| 조작판', await p.evaluate(()=>document.getElementById('dActs').innerText.replace(/\n/g,' ').slice(0,60)));
  // 3) 켜진 돌진: 아군 탭 = 명령 없음
  const ord0 = await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='인주').order));
  q = await scr(...Object.values(await posOf('노먼'))); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(150);
  console.log('3 아군 탭 (돌진 켜짐) → 인주 명령', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='인주').order)), '(전:', ord0, ') · 켜짐', JSON.stringify(await st()), '| toast', await p.evaluate(()=>document.getElementById('toast').textContent));
  // 4) 아래로 쓸어 취소
  await T('touchStart', 200, 300); await p.waitForTimeout(60); await T('touchMove', 205, 340); await T('touchMove', 208, 400); await p.waitForTimeout(60); await T('touchEnd'); await p.waitForTimeout(150);
  console.log('4 아래로 쓸기 →', JSON.stringify(await st()), '| toast', await p.evaluate(()=>document.getElementById('toast').textContent));
  // 5) 꾹 → 아래로 끌어 취소
  q = await scr(...Object.values(await posOf('인주'))); await T('touchStart', q.x, q.y); await p.waitForTimeout(550); await T('touchMove', q.x, q.y + 80); await p.waitForTimeout(80);
  console.log('5 꾹 + 아래로 →', JSON.stringify(await st())); await T('touchEnd'); await p.waitForTimeout(150); console.log('  놓음 →', JSON.stringify(await st()));
  // 6) 꾹 → 그냥 뗌 → 부채 남음 → 투창 탭 → 적 탭
  await T('touchStart', q.x, q.y); await p.waitForTimeout(550); await T('touchEnd'); await p.waitForTimeout(150);
  console.log('6 꾹 뗌 →', JSON.stringify(await st()));
  await tapSel('#fan [data-fk="throw"]'); console.log('  투창 탭 →', JSON.stringify(await st()));
  const E = await p.evaluate(()=>{ const e=world.units.filter(u=>u.side===1&&u.alive&&u.seenBy)[0]; return e?{x:e.x,y:e.y,n:e.name}:null; });
  if (E){ q = await scr(E.x, E.y); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(150); console.log('  적 탭 →', E.n, await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='인주').order)), JSON.stringify(await st())); }
  // 7) 탭 두 번 (빠르게) 적 → 그냥 공격 (now 없음) · 바닥 두 번 → 그냥 이동 (hurry 없음)
  q = await scr(...Object.values(await posOf('노먼'))); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(100);
  if (E){ q = await scr(E.x, E.y); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(80); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(150); console.log('7 적 두 번 탭 (빠르게 공격 기대) → 노먼', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='노먼').order))); }
  const g = await scr(3.5, 7.5); await p.touchscreen.tap(g.x, g.y); await p.waitForTimeout(80); await p.touchscreen.tap(g.x, g.y); await p.waitForTimeout(150);
  console.log('  바닥 두 번 탭 (서둘러 이동 기대) → 노먼', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='노먼').order)));
  // 8) 부채 열린 채 바깥 탭 = 닫기 (명령 없음)
  q = await scr(...Object.values(await posOf('레베카'))); await T('touchStart', q.x, q.y); await p.waitForTimeout(550); await T('touchEnd'); await p.waitForTimeout(120);
  const ordR = await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='레베카').order));
  await p.touchscreen.tap(60, 200); await p.waitForTimeout(150);
  console.log('8 바깥 탭 →', JSON.stringify(await st()), '레베카 명령 그대로?', ordR === await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='레베카').order)));
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
