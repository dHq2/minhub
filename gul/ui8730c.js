// v8.7.3 바로잡기 4c UI 시험 — ui8730c.js v1.4 (v1.4: 0.3초 규칙은 여정 맵만 — 훈련장은 0초부터 봄 · v1.3: 30층 판 뒤 로딩이 걷히며 열린 대화를 닫고 다음 시험으로 (대화가 판을 덮어 끌기가 닿지 않던 것) · v1.2: 첫 발견은 먼 적만 셈 (몸이 닿은 창병은 처음부터 앎) · 30층 판은 실제처럼 지도를 접고 들어감 · 30층 지도 화면에서 훈련장으로 바꾸면 지도가 접힘 · v1.1: 끌기 시험은 카메라를 그 인물에 맞춘 뒤 (판 밖을 누르던 것) · 누른 곳이 판인지 확인 · 0.3초 시험은 시작 뒤 자리를 다시 놓음 · v1.0: 처음 배치 (30층 · 1층 캠페인 — 대장 둘레 반지름 1.5칸 · 시작 흔들기 포함) · 여정 대기 화면 (⟲ 맵 처음부터) 에서 끌기 · 지우기 잠금 (훈련장은 그대로) · 시작 0.3초는 발견 없음 (양쪽) · 카메라 (확대해도 따라감 · 끌면 멈췄다가 10초 뒤 다시 · 원래 배율로))
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000);
 await p.evaluate(()=>{ window.__spread = (W) => { const A = ancOf(W), al = W.units.filter(u => u.side === 0 && u.alive && !u.gone); return { n: al.length, lead: A && A.name, max: +Math.max(...al.map(u => Math.hypot(u.x - A.x, u.y - A.y))).toFixed(2), pair: +Math.max(...al.flatMap(a => al.map(c => Math.hypot(a.x - c.x, a.y - c.y)))).toFixed(2) }; }; });

 // 1. 1층 캠페인: 들어서는 띠 안에서 대장 둘레로 모임 (시작 흔들기 포함)
 const r1 = await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); return __spread(world); });
 await p.evaluate(TALKEND);
 console.log('    1층 배치', JSON.stringify(r1));
 ok(r1.n>=4&&r1.max<=1.7,'1층: 아군 '+r1.n+'명이 대장 ('+r1.lead+') 둘레 1.6칸 안 (가장 먼 '+r1.max+'칸 · 둘 사이 최대 '+r1.pair+')');

 // 2. 여정 대기 화면 (⟲ 맵 처음부터): 끌어도 · 오른쪽 클릭해도 그대로 · 배치 칸 잠김
 const cv0 = await p.evaluate(()=>cv.id);
 const pos = await p.evaluate(()=>{ resetToEdit(); paused = true; const u = S.units.find(x => x.side === 0); cam.x = u.x; cam.y = u.y; const r = cv.getBoundingClientRect(), ts = TS * cam.z, sx = r.left + r.width / 2 + (u.x - cam.x) * ts, sy = r.top + r.height / 2 + (u.y - cam.y) * ts; return { id: u.id, x: u.x, y: u.y, sx, sy, el: (document.elementFromPoint(sx, sy) || {}).id, n: S.units.length, lock: campLock(), mode }; });
 await p.mouse.move(pos.sx, pos.sy); await p.mouse.down(); await p.mouse.move(pos.sx + 90, pos.sy + 60, { steps: 6 }); await p.mouse.up(); await wait(p, 80);
 await p.mouse.click(pos.sx, pos.sy, { button: 'right' }); await wait(p, 80);
 const r2 = await p.evaluate((id)=>{ const u = S.units.find(x => x.id === id); return { x: u ? u.x : null, y: u ? u.y : null, n: S.units.length, msg: document.getElementById('lockMsg').hidden ? '' : document.getElementById('lockMsg').textContent, box: getComputedStyle(document.querySelector('#selBox')).pointerEvents }; }, pos.id);
 console.log('    대기 화면', JSON.stringify({ ...pos, ...r2 }));
 ok(pos.el===cv0&&pos.lock&&pos.mode==='edit'&&r2.x===pos.x&&r2.y===pos.y,'여정: 맵 처음부터 (배치 화면) 에서 끌어도 처음 자리 그대로');
 ok(r2.n===pos.n,'여정: 오른쪽 클릭으로 지워지지 않음 ('+pos.n+' → '+r2.n+')');
 ok(/여정에선 처음 자리를/.test(r2.msg)&&r2.box==='none','여정: 배치 칸 잠금 · 까닭 글 ("'+r2.msg.slice(0,30)+'")');
 await p.evaluate(()=>{ campQuit(true); });

 // 3. 훈련장은 그대로 끌어 옮김
 const t0 = await p.evaluate(()=>{ setMode('train'); resetToEdit(); S.units = [{ ...fromDesign(designByKey('카리우스'), 0), x: 8.5, y: 8.5, id: uid() }, { ...fromDesign(designByKey('검기사'), 1), x: 20.5, y: 8.5, id: uid() }]; rebuildPreview(); paused = true; const u = S.units[0]; cam.x = u.x; cam.y = u.y; const r = cv.getBoundingClientRect(), ts = TS * cam.z, sx = r.left + r.width / 2 + (u.x - cam.x) * ts, sy = r.top + r.height / 2 + (u.y - cam.y) * ts; return { id: u.id, x: u.x, sx, sy, el: (document.elementFromPoint(sx, sy) || {}).id, lock: campLock() }; });
 await p.mouse.move(t0.sx, t0.sy); await p.mouse.down(); await p.mouse.move(t0.sx + 3 * 32, t0.sy, { steps: 6 }); await p.mouse.up(); await wait(p, 80);
 const t1 = await p.evaluate((id)=>S.units.find(x => x.id === id).x, t0.id);
 ok(t0.el===cv0&&!t0.lock&&t1!==t0.x,'훈련장: 배치 화면에서 끌어 옮김은 그대로 ('+t0.x+' → '+t1+')');

 // 4. 30층: 들어서는 곳에서 대장 둘레로 (여러 판 · 시작 흔들기 포함)
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 await p.evaluate(TALKEND); await wait(p,250); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 await p.evaluate(TALKEND);
 const r4 = await p.evaluate(()=>{ const R = R8S(), out = []; for (const k of ['노먼', '트라카', '간두', '모닝스타', '가윤', '청광묵']) if (R.party.length < 8 && designByKey(k) && !R.party.some(x => x.name === k)) R.party.push({ ...fromDesign(designByKey(k), 0), id: uid() });
   for (let i = 0; i < 6; i++){ r8Hide(); r8Battle({ t: 'fight', id: 'tt' + i }); out.push(__spread(world)); if (typeof ldEnd === 'function') ldEnd(true); while (TK){ if (TK.timer) talkDone(); const L = TK.lines[TK.i]; if (L && L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); } }
   return out; });
 await wait(p, 400); await p.evaluate(TALKEND);
 console.log('    30층 배치', JSON.stringify(r4));
 const inR = r4.filter(x => x.max <= 1.7).length;
 ok(r4.every(x=>x.n>=6)&&inR>=5&&r4.every(x=>x.max<=3.2),'30층: 6판 가운데 '+inR+'판이 대장 둘레 1.6칸 안 · 모두 3.2칸 안 (예전 5 ~ 8.6칸)');

 // 5. 시작 0.3초는 발견 없음 (양쪽 같음) · 몸이 닿으면 앎
 const r5 = await p.evaluate(()=>{ setMode('train'); resetToEdit(); S.units = [{ ...fromDesign(designByKey('카리우스'), 0), x: 8.5, y: 10.5, id: uid() }, { ...fromDesign(designByKey('검기사'), 1), x: 13.5, y: 10.5, id: uid() }, { ...fromDesign(designByKey('창병'), 1), x: 9.2, y: 10.5, id: uid() }]; start(); paused = true; const W = world; W.amb = 1; [[8.5, 10.5], [13.5, 10.5], [9.15, 10.5]].forEach(([x, y], i) => { const u = W.units[i]; u.x = u.px = x; u.y = u.py = y; u.order = null; u.stay = null; u.face = i ? Math.PI : 0; }); computeLight(W);
   const a = W.units[0], e = W.units[1], c = W.units[2]; const train = canSee(W, a, e); W.camp = true; const t0 = { see: canSee(W, a, e), back: canSee(W, e, a), touch: canSee(W, a, c), train };
   for (let k = 0; k < 12; k++) stepWorld(W, 0.05); const firstT = W.log.filter(l => (l.k === 'spot' || l.k === 'contact') && (l.a === e.i || l.b === e.i)).map(l => l.t);
   return { t0, t1: { see: canSee(W, a, e), back: canSee(W, e, a) }, first: firstT.length ? Math.min(...firstT.filter(x => x != null)) : null, T: +W.t.toFixed(2) }; });
 console.log('    0.3초', JSON.stringify(r5));
 ok(r5.t0.train&&!r5.t0.see&&!r5.t0.back&&r5.t0.touch,'여정 맵 0초: 서로 못 봄 (양쪽) · 몸이 닿은 상대만 앎 · 훈련장은 0초부터 봄');
 ok(r5.t1.see&&r5.t1.back&&(r5.first==null||r5.first>=0.3),'0.3초 뒤부터 봄 · 첫 발견 '+r5.first+'초');

 // 5b. 30층 지도 화면에서 훈련장으로 바꾸면 지도가 접힘 · 스토리로 돌아오면 다시 폄
 const r5b = await p.evaluate(()=>{ setMode('story'); r8MapShow(); const a = !document.getElementById('run8').hidden; setMode('train'); const b = !document.getElementById('run8').hidden; setMode('story'); const c = !document.getElementById('run8').hidden; setMode('train'); return { a, b, c }; });
 ok(r5b.a&&!r5b.b&&r5b.c,'30층 지도 화면 → 훈련장: 지도가 판을 덮지 않음 · 스토리로 돌아오면 다시 '+JSON.stringify(r5b));

 // 6. 카메라: 확대해도 따라감 · 10초 뒤 원래 배율 · 끌어서 꺼진 따라가기는 10초 뒤 다시
 const r6 = await p.evaluate(()=>{ setMode('train'); resetToEdit(); S.W = 40; S.H = 28; rebuildMap(); S.units = [{ ...fromDesign(designByKey('카리우스'), 0), x: 8.5, y: 10.5, id: uid() }, { ...fromDesign(designByKey('검기사'), 1), x: 30.5, y: 20.5, id: uid() }]; start(); cam.follow = true; const z0 = cam.z;
   zoom(1.5); const zf = cam.follow, z1 = cam.z, home = CD.homeZ; CD.userT = performance.now() - 11000; for (let i = 0; i < 80; i++) camIdleTick(0.1); const z2 = cam.z;
   cam.follow = true; return { z0, z1, zf, home, z2, small: small() }; });
 const sc = await p.evaluate(()=>{ const r = cv.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; return { x, y, el: (document.elementFromPoint(x, y) || {}).id || (document.elementFromPoint(x, y) || {}).className }; });
 console.log('    카메라 누른 곳', JSON.stringify(sc));
 await p.mouse.move(sc.x, sc.y); await p.mouse.down({ button: 'right' }); await p.mouse.move(sc.x + 120, sc.y + 40, { steps: 6 }); await p.mouse.up({ button: 'right' }); await wait(p, 60);
 const r6b = await p.evaluate(()=>{ const off = cam.follow, pan = CD.panOff; camIdleTick(0.1); const still = cam.follow; CD.userT = performance.now() - 11000; camIdleTick(0.1); return { off, pan, still, back: cam.follow }; });
 console.log('    카메라', JSON.stringify({ ...r6, ...r6b }));
 ok(!r6.small&&r6.zf&&Math.abs(r6.z1-r6.z0*1.5)<0.01,'손으로 확대해도 따라가기는 켜진 채 ('+r6.z0.toFixed(2)+' → '+r6.z1.toFixed(2)+')');
 ok(Math.abs(r6.home-r6.z0)<1e-6&&Math.abs(r6.z2-r6.z0)<0.01,'10초 손대지 않으면 원래 배율로 천천히 ('+r6.z2.toFixed(3)+')');
 ok(r6b.off===false&&r6b.pan===true&&r6b.still===false&&r6b.back===true,'끌어서 둘러보면 따라가기가 멈췄다가 10초 뒤 다시 켜짐');

 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8730C OK'); await b.close(); process.exit(fails ? 1 : 0); })();
