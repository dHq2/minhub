// v8.7.3 바로잡기 2 UI 시험 — ui8730.js v1.7 (v1.7: v8.7.6 끝난 맵에서 처음 나가려 하면 남은 전리품을 한 번 보여 줌 (J11) — ▶ 이대로 나가기 · 창이 뜬 채 두 번 누르면 서둘러 · v1.6: 근접 마지막 추적 칸은 상대 (검기사) 의 백스텝 · 피하기를 끄고 봄 — 따라가 치는 것만 보는 칸인데 상대가 백스텝으로 피한 판 (v8.7.4 빌드도 80판에 18판) 이 섞여 닿음 5/8 이 가끔 떨어지던 것 · 끄면 80판 모두 닿음 → 이제 8판에 7판 넘게 · 손이 안 닿아 헛침 0 · 따라붙어 다시 내지른 일격까지 · v1.5: v8.7.5 대형 — 지킴 자리를 가진 편대원은 떼어 맡긴 이 (fdet) 로 · v1.4: v8.7.4 세르파는 보스도 적도 아님 — 도감 체력 90 동료 · v1.3: 샷건은 밝은 판에서 네 발 (한 발의 겨눔이 빗나가면 알 대부분이 비킴) · 창 되찾기 시험의 탕아는 쓰러지지 않게 · 벽 짓눌림은 날아가 부딪힌 뒤 봄 · 예고 회피 · 추적은 밝은 판에서 · 손이 안 닿음만 셈 · 근접 첫 1초 명중 · 끝난 맵 편대장 고립 · 배 안 출혈 판에 적 하나 · v1.2: 3부 — [무장기] (급소 · 출혈 · 실명 없음) · 벽 짓눌림은 밀린 힘만큼 · 회전 도끼 관통 · 예고 회피 '!' · 근접 마지막 추적 · 샷건 산탄 부채꼴 · 창을 던진 적의 무장 회복 · 성한 몸의 배 안 출혈 · 세르파 체력 · v1.1: 2부 — 다시 쥔 근접 무기 (사수 아님) · 공중제비 태세 막힘 · 철퇴 던지는 순간 사선 · 도약 사격 사선 · 트라카 곡사 주기 · 후리기 경고 · 그만둠 · 공중제비 바닥 (동료 곁) · v1.0: 1부 — 주인공 없는 편의 기준 (지휘관) · 끝난 맵의 옛 지킴 자리 · 명령 줄 (늦게 온 옛 명령 · 같은 명령 · 바로 걸린 명령 · 무기 바꾸기 뒤 공격) · 지휘관이 먼저 나감 (끊김 없이 이어받음 · 전열 · 적 표적) · 30층 보통 맵 출구 열림 · 출구 발견 · 찾으러 · 대장은 마지막 · 출구 두 번 = 서둘러 · 시작 행동은 같은 맵에서만 · 고유 기술 명령 글 · 막힌 공중제비 알림)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000);
 // 훈련장 판 만들기 (주인공 없음)
 await p.evaluate(()=>{ window.__mk = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...fromDesign(designByKey(k),s), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); return W; };
   window.__lit = (W) => { W.amb = 1; computeLight(W); markExplored(W); for (const u of W.units) if (u.side===1) u.seenBy = 1; return W; };
   window.__run = (W, sec) => { const n = Math.round(sec / 0.05); for (let i=0;i<n && !W.over;i++) stepWorld(W, 0.05); }; });
 // 1. 기준 = 지휘관 (주인공 없음): 동료가 지휘관을 따라감 · 지휘관은 둘러봄
 const a1 = await p.evaluate(()=>{ const W=__mk([['카리우스',0,8,10],['트라카',0,4,15],['가윤',0,13,15],['검기사',1,30,2]]); W.units.forEach(u=>{ if (u.side===0){ u.cmd=0; u.cmdTmp=false; } }); W.units[0].cmd=2; W.ancT=null;
   const A = ancOf(W); __run(W, 6); const k=W.units[0], t=W.units[1], g=W.units[2];
   return { anc: A && A.name, sT: t.state, sG: g.state, dT: +dist(t,k).toFixed(1), dG: +dist(g,k).toFixed(1), sK: k.state }; });
 console.log('    기준', JSON.stringify(a1));
 ok(a1.anc==='카리우스','주인공이 없으면 지휘관 (카리우스) 이 기준');
 ok(a1.sT==='follow'&&a1.sG==='follow'&&a1.dT<3.2&&a1.dG<3.2,'동료는 기준을 따라감 (트라카 '+a1.dT+'칸 · 가윤 '+a1.dG+'칸)');
 ok(a1.sK==='explore','기준은 둘러봄 (explore)');
 // 2. 끝난 맵: 싸울 때 잡은 지킴 자리는 풀고 기준을 따라감 · 끝난 뒤에 보낸 자리는 지킴
 const a2 = await p.evaluate(()=>{ const W=__mk([['카리우스',0,8,10],['트라카',0,4,15],['가윤',0,13,15],['검기사',1,30,2]]); W.units[0].cmd=2; W.units[1].cmd=0; W.units[2].cmd=0; W.ancT=null; W.camp=true; W.over=false;
   const t=W.units[1], g=W.units[2]; t.stay={x:20,y:16}; t.x=20; t.y=16; g.stay={x:2,y:16}; g.x=2; g.y=16;
   W.units[3].alive=false; W.units[3].hp=0; checkEnd(W); const old = !!t.stay.old; g.stay = { x: 6, y: 13 }; g.x = 6; g.y = 13;   // 끝난 뒤에 보낸 자리 (old 없음 · 동료 곁)
   __run(W, 2.5); const gS = !!g.stay, dG = +Math.hypot(g.x-6,g.y-13).toFixed(1); __run(W, 3.5); return { cleared: !!W.cleared, old, tStay: !!t.stay, gStay: gS, dT: +dist(t,W.units[0]).toFixed(1), dG }; });
 console.log('    끝난 맵', JSON.stringify(a2));
 ok(a2.cleared&&a2.old&&!a2.tStay&&a2.dT<3.5,'끝난 맵: 싸울 때 잡은 자리는 풀고 기준 곁으로 ('+a2.dT+'칸)');
 ok(a2.gStay&&a2.dG<0.8,'끝난 뒤에 보낸 자리는 그대로 지킴 (동료 곁 · 혼자 멀리 떨어지면 4초 뒤 합류는 그대로)');
 // 3. 싸움이 붙은 지킴이는 그 자리를 새 자리로 (옛 자리로 물러나 동료를 두고 가지 않음)
 const a3 = await p.evaluate(()=>{ const W=__mk([['카리우스',0,8,10],['탕아',0,14,10],['검기사',1,16,10]]); const t=W.units[1]; t.stay={x:8,y:14}; t.fdet=true; t.cmd=0; W.units[0].cmd=2; W.ancT=null; t.x=14; t.y=10; W.units[2].x=15.2; W.units[2].y=10; __run(W, 0.6); return { stay: t.stay && [+t.stay.x.toFixed(1), +t.stay.y.toFixed(1)], st: t.state }; });
 ok(a3.stay&&Math.hypot(a3.stay[0]-14,a3.stay[1]-10)<2,'싸움이 붙으면 지킴 자리를 그곳으로 ('+JSON.stringify(a3.stay)+')');
 // 4. 명령 줄
 const q = await p.evaluate(()=>{ const W=__mk([['간두',0,8,10],['카리우스',0,6,10],['검기사',1,28,3]]); const g=W.units[0]; const out={};
   // 늦게 낸 명령이 먼저 닿음 → 옛 명령은 버림
   ordPush(W, g, { o: { k:'move', x:3, y:3 }, at: W.t+0.6, ok: true, p: 1, via: 'voice', t0: W.t, c: 1 });
   ordPush(W, g, { o: { k:'move', x:5, y:5 }, at: W.t+0.2, ok: true, p: 1, via: 'voice', t0: W.t+0.01, c: 1 });
   __run(W, 1); out.late = g.order ? [g.order.x, g.order.y] : null; out.recv = W.log.filter(l=>l.k==='cmdRecv'&&l.a===g.i).length;
   // 같은 명령 두 번 = 하나 (닿을 확률만)
   g.order=null; ordPush(W, g, { o: { k:'move', x:7, y:7 }, at: W.t+0.4, ok: false, p: 0.5, via: 'voice', t0: W.t, c: 1 }); ordPush(W, g, { o: { k:'move', x:7, y:7 }, at: W.t+0.5, ok: true, p: 0.6, via: 'voice', t0: W.t+0.02, c: 1 });
   out.qn = (g.ordQ||[]).length; __run(W, 0.8); out.same = g.order ? [g.order.x, g.order.y] : null;
   // 가던 명령은 도착: 이동 (닿는 중) → 그 뒤에 낸 다른 명령도 줄에 남음
   g.order=null; const w0 = g.weapon; ordPush(W, g, { o: { k:'alt' }, at: W.t+0.3, ok: true, p: 1, via: 'voice', t0: W.t, c: 1 }); ordPush(W, g, { o: { k:'attack', b: 2 }, at: W.t+0.3, ok: true, p: 1, via: 'voice', t0: W.t+0.01, c: 1 });
   __run(W, 0.36); out.alt = !!(g.act && g.act.k === 'altSwap'); __run(W, 0.6); out.w = [w0, g.weapon]; out.atk = W.log.filter(l=>l.k==='cmdRecv'&&l.a===g.i).map(l=>l.o&&l.o[0]).slice(-1)[0]; out.acts = W.log.filter(l=>l.a===g.i).slice(-6).map(l=>l.k);
   return out; });
 console.log('    명령 줄', JSON.stringify(q));
 ok(q.late&&q.late[0]===5,'나중에 낸 명령이 먼저 닿으면 늦게 온 옛 명령이 덮지 않음 ('+JSON.stringify(q.late)+')');
 ok(q.qn===1&&q.same&&q.same[0]===7,'같은 명령 두 번 = 하나 (두 번 외치면 닿음)');
 ok(q.alt&&q.w[0]!==q.w[1]&&q.atk==='attack','무기 바꾸기와 공격을 함께 — 바꿔 든 뒤 ('+q.w.join(' → ')+') 공격도 도착');
 // 바로 걸린 명령 (끝난 맵 출구) 은 옛 줄을 지움
 const q2 = await p.evaluate(()=>{ const W=__mk([['간두',0,8,10],['카리우스',0,6,10],['검기사',1,28,3]]); const g=W.units[0]; ordPush(W, g, { o: { k:'move', x:3, y:3 }, at: W.t+5, ok: true, p: 1, via: 'voice', t0: W.t, c: 1 });
   g.order = { k: 'exit', dir: 'up', x: g.x }; noteOrders([g], 'user', 't', true); return { q: (g.ordQ||[]).length, pend: !!g.ordPend, o: g.order && g.order.k }; });
 ok(q2.q===0&&!q2.pend&&q2.o==='exit','바로 걸린 명령 (끝난 맵 출구) 은 가던 옛 명령을 지움');
 // 5. 지휘관이 먼저 나감 → 끊김 없이 이어받음 (지휘가 끊겼다 · 쓰러짐 글 없음)
 const h = await p.evaluate(()=>{ const W=__mk([['탕아',0,8,10],['카리우스',0,9,10],['가윤',0,10,10],['검기사',1,28,3]]); W.camp=true; W.over=false; W.units.forEach(u=>{ if(u.side===0){u.cmd=0;u.cmdTmp=false;} }); W.units[0].cmd=2; W.ancT=null; __run(W,0.5);
   const n0 = W.log.length; leaveMap(W, W.units[0], 'up'); __run(W, 3); const L = W.log.slice(n0); const c = cmdBoss(W,0);
   const lines = logLines(W).slice(-40).join('\n');
   return { boss: c && c.name, lost: L.some(l=>l.k==='cmdLost'), acting: L.filter(l=>l.k==='acting').map(l=>[l.a,l.left]), succeed: L.filter(l=>l.k==='succeed').length, fall: L.some(l=>l.k==='lineFall'&&l.a===0), follow: W.units.filter(u=>u.side===0&&u.order&&u.order.k==='exit').length, txt: /먼저 올라감/.test(lines), bad: /탕아 쓰러짐|지휘가 끊김/.test(lines) }; });
 console.log('    먼저 나감', JSON.stringify(h));
 ok(h.boss&&!h.lost&&h.acting.length===1&&h.acting[0][1]===0&&h.succeed===0,'지휘관이 먼저 나가면 바로 이어받음 ('+h.boss+') — "지휘가 끊겼다" 없음 · 이어받음 줄 하나');
 ok(h.txt&&!h.bad&&!h.fall,'기록: "먼저 올라감" (쓰러짐 · 전열 끊김 아님)');
 ok(h.follow===2,'대장이 넘어가자 남은 둘이 따라 나섬');
 // 8. 고유 기술 명령 글 · 막힌 공중제비
 const sp = await p.evaluate(()=>{ const W=__mk([['모닝스타',0,12,12],['탕아',0,5,5],['검기사',1,14,12]]); const m=W.units[0], t=W.units[1];
   m.order = { k: 'spec', s: 'sweep', R: 2.34 }; const lab = orderLabel(W, orderTxt(m.order, m)), ack = ACK(m.order)[0];
   t.order = { k: 'spec', s: 'flip', b: 2 }; const lab2 = orderLabel(W, orderTxt(t.order, t));
   t.x = 0.45; t.y = 5; t.order = { k: 'spec', s: 'flip', x: -3, y: 5 }; for (let i=0;i<4;i++) stepWorld(W,0.05);
   return { lab, ack, lab2, fail: W.log.some(l=>l.k==='specFail'&&l.a===t.i), txt: logLines(W).filter(s=>/못 함/.test(s)).slice(-1)[0] || '' }; });
 console.log('    기술 글', JSON.stringify(sp));
 ok(/철퇴 후리기/.test(sp.lab)&&!/제자리/.test(sp.lab)&&/철퇴 후리기/.test(sp.ack),'고유 기술 명령 글: "'+sp.lab+'" · 응답 "'+sp.ack+'" (제자리 · 명령 아님)');
 ok(/공중제비/.test(sp.lab2),'공중제비 명령 글: "'+sp.lab2+'"');
 ok(sp.fail&&/공중제비 못 함/.test(sp.txt),'막힌 공중제비는 알림 ("'+sp.txt.trim()+'")');
 // ===== 2부 =====
 // 9. 다시 쥔 근접 무기는 사수가 아님 (호레이쇼 · 카리우스 + 대장군의 도끼)
 const rg = await p.evaluate(()=>{ const out={}; for (const k of ['호레이쇼','카리우스']){ const W=__mk([[k,0,6,6],['검기사',1,12,6]]), u=W.units[0]; setWeapon(W, u, '대장군의 도끼'); const a = isFar(u); u.rng = ((W.rules.weapons||{})['맨손']||{rng:0.3}).rng + 1.0; out[k] = { rng: u.rng0, far: a }; } return out; });
 ok(!rg['호레이쇼'].far&&!rg['카리우스'].far,'도끼를 다시 쥐어도 근접 (호레이쇼 '+rg['호레이쇼'].rng+'M · 카리우스 '+rg['카리우스'].rng+'M — 사수 아님)');
 // 10. 공중제비 내려찍기: 방패를 들고 마주 본 태세면 막힘 · 아니면 그대로
 const fl = await p.evaluate(()=>{ const res={};
   for (const brace of [true,false]){ const W=__lit(__mk([['탕아',1,6,10],['레베카',0,10,10]])); const u=W.units[0], e=W.units[1]; u.seenBy=1; e.face=e.fg=Math.PI; e.order={k:'hold'}; if (!brace){ e.canGuard=false; }   // 제자리를 지키는 방패병 (적 탕아가 뛰어듦 — 같은 규칙)
     for (let i=0;i<4;i++) stepWorld(W,0.03); const hp0=e.hp; startFlip(W, u, e, false); for (let i=0;i<40 && u.act;i++) stepWorld(W,0.03);
     res[brace?'brace':'open'] = { held: W.log.some(l=>l.k==='slamHeld'), dmg: Math.round(hp0-e.hp), down: !!(W.t < (e.proneT||-9)), stun: W.t < (u.stunT||-9) || W.log.some(l=>l.k==='stun'&&l.b===u.i) }; }
   return res; });
 console.log('    공중제비', JSON.stringify(fl));
 ok(fl.brace.held&&fl.brace.dmg===0&&!fl.brace.down,'태세 (방패 · 마주 봄) 면 내려찍기가 막힘 (피해 0 · 안 넘어짐)');
 ok(!fl.open.held&&fl.open.dmg>0,'등 · 옆이면 그대로 들어감 (피해 '+fl.open.dmg+')');
 // 11. 철퇴: 준비 중 동료가 길에 들어오면 던지지 않음
 const fx = await p.evaluate(()=>{ const W=__mk([['모닝스타',0,6,10],['카리우스',0,4,12],['검기사',1,8.2,10]]); const m=W.units[0], k=W.units[1], e=W.units[2]; m.order=null; k.order={k:'hold'}; e.order=null; e.state='idle'; e.face=0;
   const n0=W.log.length; startAct(W, m, e, '공격'); const A=m.act; const fl0 = !!(A&&A.fl); if (A) A.fl = true; k.x=7.1; k.y=10.05; for (let i=0;i<20;i++) stepWorld(W,0.03);
   const L=W.log.slice(n0); return { fl0, held: L.some(l=>l.k==='hold'&&l.flail), threw: L.some(l=>l.k==='flail'), ff: L.some(l=>l.k==='flailFF') }; });
 console.log('    철퇴', JSON.stringify(fx));
 ok(fx.held&&!fx.threw&&!fx.ff,'철퇴: 던지는 순간 동료가 길에 있으면 멈춤 (오사 없음)');
 // 12. 도약 사격: 사선에 동료가 있으면 그 표적에 쏘지 않음
 const ls = await p.evaluate(()=>{ const W=__lit(__mk([['트라카',0,4,10],['가윤',0,6,10],['검기사',1,8.2,10]])); const u=W.units[0], g=W.units[1], e=W.units[2]; e.seenBy=1; const n0=W.log.length, sh0=u.shots||0; leapShot(W, u, { b: e.i }); const L=W.log.slice(n0); return { shot: L.some(l=>l.k==='leapShot'), hold: L.some(l=>l.k==='hold'&&l.leap) }; });
 ok(!ls.shot&&ls.hold,'도약 사격: 동료가 사선에 있으면 쏘지 않음 (멈춤 기록)');
 // 13. 트라카 곡사 주기: 동료가 가려도 직사와 같은 짧은 주기
 const cy = await p.evaluate(()=>{ const W=__lit(__mk([['트라카',0,4,10],['카리우스',0,5.6,10],['검기사',1,8.4,10]])); const u=W.units[0], e=W.units[2]; u.face=u.fg=0;
   u.lobB=null; u.angT=0; u.inRangeT=0; const a0 = angleFirst(W, u, e, 0.05);   // 동료가 가림 · 직사 각 자리가 있음 → 먼저 각을 잡으러 감
   u.path=null; u.angT=0; u.lobB=e.i; u.lobT=W.t; const a1 = angleFirst(W, u, e, 0.05);   // 방금 이 표적을 곡사로 쐈음 → 각을 다시 찾지 않고 곡사를 이어 감
   W.t += 3.2; u.angT=0; const a2 = angleFirst(W, u, e, 0.05);   // 3초가 지나면 다시 각을 봄
   return { a0, a1, a2, spot: !!directSpot(W, u, e) }; });
 console.log('    곡사 주기', JSON.stringify(cy));
 ok(cy.spot&&cy.a0===true&&cy.a1===false&&cy.a2===true,'트라카 곡사: 같은 표적을 곡사로 쏘는 중엔 직사 각을 다시 찾느라 멈칫하지 않음 (연사 주기 그대로 · 3초 뒤엔 다시 봄)');
 // 14. 철퇴 후리기: 준비 중 원 안의 동료는 "!" 하고 비켜섬 · 단추 한 번 더 = 그만둠
 const sw = await p.evaluate(()=>{ const W=__lit(__mk([['모닝스타',0,10,10],['가윤',0,11.2,10.4],['검기사',1,12.8,10]])); const m=W.units[0], g=W.units[1], e=W.units[2]; g.order=null; e.order={k:'hold'}; e.hp=e.max=9999;
   const n0=W.log.length; m.order={ k:'spec', s:'sweep', R: 2.2 }; for (let i=0;i<80 && !W.log.slice(n0).some(l=>l.k==='flailSweep');i++) stepWorld(W,0.025);
   const L=W.log.slice(n0); return { names: W.units.map(u=>u.name).join(','), warn: L.some(l=>l.k==='sweepWarn'&&l.a===g.i), ffHit: L.some(l=>(l.k==='hit'||l.k==='strike')&&l.a===m.i&&l.b===g.i), hits: L.filter(l=>l.k==='hit'&&l.a===m.i).map(l=>l.b+':'+(l.tag||'')).join(','), dG: +dist(g,m).toFixed(2), gp: [+g.x.toFixed(1), +g.y.toFixed(1)], swept: L.some(l=>l.k==='flailSweep') }; });
 console.log('    후리기', JSON.stringify(sw));
 ok(sw.warn&&!sw.ffHit&&sw.dG>2.2,'후리기 준비 중 원 안의 동료가 "!" 하고 원 밖으로 ('+sw.dG+'칸) — 오사 없음');
 const sc = await p.evaluate(()=>{ const W=__mk([['모닝스타',0,10,10],['검기사',1,12.8,10]]); const m=W.units[0]; m.order={ k:'spec', s:'sweep' }; for (let i=0;i<6;i++) stepWorld(W,0.025); const w0 = !!(m.act&&m.act.k==='spec'&&m.act.phase==='wind');
   sel = new Set([m.i]); const slot = [1,2,3,4,5,6,7,8,9].find(n=>{ const S2=SLOTS[n-1]; return S2&&S2.has(m)&&(S2.k==='spec1'||S2.k==='spec2')&&(specAt(m,S2.k)||{}).k==='sweep'; }); useSlot(slot);
   for (let i=0;i<40;i++) stepWorld(W,0.025); return { w0, slot, cancel: W.log.some(l=>l.k==='specCancel'&&l.a===m.i), swept: W.log.some(l=>l.k==='flailSweep'), lab: orderLabel(W, ['specCancel','sweep']) }; });
 console.log('    그만둠', JSON.stringify(sc));
 ok(sc.w0&&sc.cancel&&!sc.swept,'후리기 준비 중 단추를 한 번 더 = 그만둠 (휘두르지 않음 · "'+sc.lab+'")');
 // 15. 공중제비 바닥: 동료 곁을 찍어도 바닥으로 (그 동료를 고르지 않음)
 const W2S = async (x,y) => p.evaluate(([x,y])=>{ const r=cv.getBoundingClientRect(), ts=TS*cam.z; return { x: r.left + r.width/2 + (x-cam.x)*ts, y: r.top + r.height/2 + (y-cam.y)*ts }; }, [x,y]);
 await p.evaluate(TALKEND); await p.evaluate(()=>{ const t=document.getElementById('talk'); if (t) t.hidden=true; const W=__mk([['탕아',0,12,12],['가윤',0,10,10.5],['검기사',1,16,12]]); cam.x=12; cam.y=12; cam.z=1.6; cam.follow=false; for (const u of W.units) if (u.side===1) u.seenBy=1; sel=new Set([0]); hud(); });
 await p.waitForTimeout(200);
 const fs2 = await p.evaluate(()=>{ const b=[...document.querySelectorAll('[data-sk]')].find(e=>/공중제비/.test(e.textContent)&&e.offsetParent!==null); return b ? b.dataset.sk : null; });
 if (fs2){ await p.click(`[data-sk="${fs2}"]`); await p.waitForTimeout(200); const s=await W2S(10.25,10.8); await p.mouse.click(s.x, s.y); await p.waitForTimeout(250); }
 const fo = await p.evaluate(()=>{ const u=world.units[0]; const o = u.order || (u.ordPend && u.ordPend.o); return { o: o && [o.k, o.s, o.x != null], sel: [...sel] }; });
 console.log('    공중제비 바닥', JSON.stringify({ fs2, ...fo }));
 ok(fo.o&&fo.o[0]==='spec'&&fo.o[1]==='flip'&&fo.o[2],'공중제비: 동료 곁 바닥을 찍어도 그쪽으로 빠지는 명령');
 // ===== 3부 =====
 await p.evaluate(()=>{ window.__mkF = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...(FOE8[k] && s===1 ? fromDesign(clone(FOE8[k]),1) : fromDesign(designByKey(k),s)), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); return __lit(W); }; });
 // 16. [무장기]: 붉은암석은 급소 · 즉사 · 출혈 · 실명이 없음 (깎아 내려야 쓰러짐)
 const no = await p.evaluate(()=>{ const W=__mkF([['트라카',0,4,10],['붉은암석',1,9,10]]); const u=W.units[0], t=W.units[1]; const v0 = { noOrg: !!t.noOrg, h: t.h, w: t.weapon, hp: t.max, quake: (t.spec||[]).some(x=>x.k==='quake') };
   let vit=0, kill=0, n=0; for (let i=0;i<120 && t.alive;i++){ const hp0=t.hp; const o=strike(W, u, t, t, 1, true, {}); n++; if (o && o.vital) vit++; if (!t.alive && hp0 > 200) kill++; t.hp = Math.max(t.hp, t.max*0.5); }
   for (let i=0;i<60;i++){ const o={ far:false, part:'몸통', dir:'front' }; woundRoll(W, u, t, o, 80, ['머리','몸통','팔','다리'][i%4], true, true); }
   return { ...v0, vit, kill, n, bleed: !!t.bleed, ibleed: !!t.ibleed, eye: t.eyeLost || 0 }; });
 console.log('    무장기', JSON.stringify(no));
 ok(no.noOrg&&no.h>=2.9&&no.w==='맨손'&&no.quake,'붉은암석: 키 '+no.h+'M · 손 · [무장기] · 도약 강타');
 ok(no.vit===0&&no.kill===0&&!no.bleed&&!no.ibleed&&no.eye===0,'[무장기]: 급소 '+no.vit+' · 즉사 '+no.kill+' · 출혈 · 실명 없음 ('+no.n+'번 쏨)');
 const sp6 = await p.evaluate(()=>({ hp: FOE8['세르파'].ov.hp, ally: !!FOE8['세르파'].ally, boss: (FOE8['세르파'].traits || []).includes('보스') }));
 ok(sp6.hp===90&&sp6.ally&&!sp6.boss,'세르파는 동료 — 도감 체력 90 · 보스 아님 (v8.7.4) '+JSON.stringify(sp6));
 // 17. 벽 짓눌림은 밀린 힘만큼: 살짝 밀리면 기대 버팀 · 크게 밀리면 짓눌림
 const wc = await p.evaluate(()=>{ const res={}; for (const pw of [0.15, 1.6]){ const W=__mk([['카리우스',0,3,10],['세자르',1,0.62,10]]); const a=W.units[0], t=W.units[1]; t.cz=null; const hp0=t.hp; const r=shove(W, a, t, pw, -1, 0, { tag: '시험' }); for (let i=0;i<40&&t.kb;i++) stepKb(W,t,0.02); res[pw]={ r, dmg: Math.round(hp0-t.hp), crush: W.log.some(l=>l.k==='crush') }; } return res; });
 console.log('    벽', JSON.stringify(wc));
 ok(!wc['0.15'].crush&&wc['1.6'].crush,'살짝 밀리면 벽에 기대 버팀 (짓눌림 없음) · 크게 밀리면 짓눌림 ('+wc['1.6'].dmg+')');
 // 18. 회전 투척 도끼: 길 위의 모두를 관통 (뒤로 갈수록 약하게)
 const spn = await p.evaluate(()=>{ const W=__mk([['호레이쇼',1,4,10],['카리우스',0,7,10],['가윤',0,9,10.1],['트라카',0,11,9.9]]); const h=W.units[0]; for (const u of W.units) if (u.side===0) u.ev = 0.0001; startSpec(W, h, W.units[1], 'spin', '시험'); h.act.end = W.t; resolveSpec(W, h); for (let i=0;i<60;i++) stepSpins(W, 0.03);
   const hits = W.log.filter(l=>l.k==='hit'&&l.a===0&&/도끼/.test(l.tag||'')).map(l=>[l.b, l.dmg||l.amt||0]); return { hits, n: new Set(hits.map(h=>h[0])).size, drop: W.log.some(l=>l.k==='spinDrop') }; });
 console.log('    도끼', JSON.stringify(spn));
 ok(spn.n>=2&&spn.drop,'회전 도끼가 길 위의 '+spn.n+'명을 관통 (박혀 멈추지 않음)');
 // 19. 예고 회피: 도끼 던지기 · 투창 조준을 본 몸이 "!" 하고 비킴 (적 · 아군 같게)
 const tg = await p.evaluate(()=>{ let dodge=0, late=0, n=0; for (let k=0;k<12;k++){ const W=__lit(__mk([['호레이쇼',1,4,10],['탕아',0,8,10]])); const h=W.units[0], t=W.units[1]; t.face=t.fg=Math.PI; t.order=null; startSpec(W, h, t, 'spin', '시험'); for (let i=0;i<5;i++) stepWorld(W,0.03); n++; if (W.log.some(l=>l.k==='tgDodge'&&l.a===1)) dodge++; if (W.log.some(l=>l.k==='tgLate'&&l.a===1)) late++; }
   let jd=0; for (let k=0;k<12;k++){ const W=__lit(__mk([['창병',1,4,10],['모닝스타',0,9,10]])); const s=W.units[0], m=W.units[1]; m.face=m.fg=Math.PI; m.order=null; if (!s.jav) return { dodge, late, n, jav: 'none' }; startThrow(W, s, m, '시험'); for (let i=0;i<4;i++) stepWorld(W,0.03); if (W.log.some(l=>l.k==='tgDodge'&&l.a===1)) jd++; }
   return { dodge, late, n, jd }; });
 console.log('    예고 회피', JSON.stringify(tg));
 ok(tg.dodge>=2&&tg.dodge+tg.late===tg.n,'도끼 던지기 예고를 본 탕아가 "!" 하고 비킴 ('+tg.dodge+'/'+tg.n+' · 늦음 '+tg.late+')');
 ok(tg.jd>=2,'투창 조준을 본 모닝스타도 비킴 ('+tg.jd+'/12)');
 // 20. 근접 마지막 추적: 준비 중 상대가 0.4칸 밀려나도 따라가 침 (손이 안 닿음 없음)
 const tr = await p.evaluate(()=>{ let hit=0, miss=0, dodge=0; for (let k=0;k<8;k++){ const W=__lit(__mk([['탕아',0,8,10],['검기사',1,9.2,10]])); const u=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.canGuard=false; e.ev=0.0001; e.stepCd=1e9; e.dodgeCd=1e9; u.order=null; startAct(W, u, e, '시험'); const A=u.act; if (!A) continue; e.x += 0.45; for (let i=0;i<30 && u.act===A;i++) stepWorld(W,0.02);
     const got = () => W.log.some(l=>l.k==='hit'&&l.a===0&&l.b===1), dg = () => W.log.some(l=>(l.k==='dodge'&&(l.a===1||l.b===1))||(l.k==='miss'&&l.a===0&&/백스텝|피함|비킴|흘림/.test(l.why||''))); for (let i=0;i<40 && !got() && !dg();i++) stepWorld(W,0.02);   /* v1.6 따라붙어 한 번 더 내지른 일격까지 · 상대가 백스텝으로 피한 판은 따로 셈 */
     if (got()) hit++; else if (dg()) dodge++; if (W.log.some(l=>l.k==='miss'&&l.a===0&&/안 닿음|닿지/.test(l.why||''))) miss++; } return { hit, miss, dodge }; });
 console.log('    추적', JSON.stringify(tr));
 ok(tr.miss===0&&tr.hit>=7,'준비 중 0.45칸 밀려난 상대를 따라가 침 (닿음 '+tr.hit+'/8 · 상대 백스텝 끔 · 피함 '+tr.dodge+' · 손이 안 닿아 헛침 '+tr.miss+')');
 // 21. 샷건 산탄: 가까우면 한 몸에 여러 알 · 나란한 둘도 함께
 const sg = await p.evaluate(()=>{ let best=0, tot=0, pel=0, w=null, who=new Set(); for (let k=0;k<4;k++){ const W=__lit(__mk([['간두',0,6,10],['검기사',1,7.2,10],['검기사',1,8.4,10.55],['검기사',1,8.4,9.45]])); const g=W.units[0]; if (!g.alt) return { none: true }; setWeapon(W, g, g.alt.name); g.ammo=4; g.mag=4; w=g.weapon; const e=W.units[1]; const n0=W.shots.length; launch(W, g, e, 1, 1); pel = W.shots.length - n0; for (let i=0;i<20;i++) stepShots(W, 0.02);
   const hits = W.log.filter(l=>l.k==='hit'&&l.a===0); best=Math.max(best, hits.length); tot+=hits.length; hits.forEach(l=>who.add(l.b)); } return { w, pel, hits: best, tot, who: [...who] }; });
 console.log('    샷건', JSON.stringify(sg));
 ok(sg.pel===5&&sg.hits>=3&&sg.tot>=8,'샷건 한 발 = 산탄 '+sg.pel+'알 · 네 발에 맞은 알 '+sg.tot+' (한 발에 많게는 '+sg.hits+' — 가까울수록 한 몸에 많이)');
 // 22. 창을 던진 적: 방패 뒤에서 5초 넘게 숨지 않고 창을 되찾으러 감
 const ra = await p.evaluate(()=>{ const W=__mk([['창병',1,10,10],['방패기사 0',1,10.8,10],['탕아',0,13,10]].filter(x=>x[0]!=='방패기사 0').concat([['검방패기사',1,10.8,10.6]])); const s=W.units[0]; if (!s.jav) return { none: true }; s.spearHeld=false; const it = dropItem(W, s, 'weapon', s.weapon, heldItem(s), 'throw'); it.x=12.4; it.y=10; const t=W.units[1]; t.max=t.hp=5000;
   let got=false, tGot=null; for (let i=0;i<300 && !got;i++){ stepWorld(W,0.05); if (s.spearHeld){ got=true; tGot=+W.t.toFixed(1); } } return { got, tGot, mood: s.mood }; });
 console.log('    무장 회복', JSON.stringify(ra));
 ok(ra.got,'창을 던진 창병이 끝까지 숨지 않고 창을 되찾음 ('+ra.tGot+'초)');
 // 23. 성한 몸 (체력 100%) 의 배 안 출혈은 급하지 않음 (약을 버리지 않음)
 const ib = await p.evaluate(()=>{ const W=__mk([['노먼',0,6,10],['간두',0,7,10],['검기사',1,28,3]]); const g=W.units[1], n=W.units[0]; g.ibleed={ dps: 0.5, until: 99, by: 0 }; const t0 = healTier(W, n, g, 0.5); g.hp = g.max*0.5; const t1 = healTier(W, n, g, 0.5); return { full: t0, half: t1 }; });
 ok(ib.full<2&&ib.half===2,'배 안 출혈: 성한 몸은 급하지 않음 ('+ib.full+') · 반 넘게 다치면 급함 ('+ib.half+')');
 // 24. 근접 명중: 싸움 첫 1초에도 밝은 곳이면 어둠 헛침 없음 (식 가운데 주석이 명중률을 시각으로 만들던 것)
 const dk = await p.evaluate(()=>{ let dark=0, n=0; for (let k=0;k<16;k++){ const W=__lit(__mk([['탕아',0,8,10],['검기사',1,8.9,10]])); const u=W.units[0], e=W.units[1]; e.order={k:'hold'}; e.canGuard=false; e.ev=0.0001; u.face=0; startAct(W, u, e, '시험'); if (!u.act) continue; n++; for (let i=0;i<40&&u.act;i++) stepWorld(W,0.02); if (W.log.some(l=>l.k==='miss'&&l.a===0&&l.dark)) dark++; } return { dark, n }; });
 console.log('    첫 1초', JSON.stringify(dk));
 ok(dk.n>=12&&dk.dark===0,'싸움 첫 1초 근접 — 밝은 곳에서 "어둠 속에서 헛침" 없음 ('+dk.dark+'/'+dk.n+')');
 // 6. 30층: 보통 맵 출구 열림 · 발견해야 보임 · 찾으러 · 대장은 마지막 · 두 번 = 서둘러
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 await p.evaluate(TALKEND); await wait(p,250); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; const h=(R.hid||{})[R.f]; R.hid={}; if (h&&h!=='none'){ F8[R.f]=null; R.fm=r8Gen(R.f); r8MapShow(); } });
 const e1 = await p.evaluate(()=>{ const R=R8S(); world=null; const n=R.fm.rows[0][0]; n.t='fight'; n.ms='fight'; delete n.npc8; R.at=null; R.done=[]; r8Enter(n); while (TK) talkAdv(); const W=world;
   const bar = document.getElementById('campBar').textContent; return { lock: W.exitLock, hide: W.exitHide, seen: !!W.exitSeen, bar: /출구 찾기/.test(bar), st: W.stairs && [W.stairs.x, W.stairs.y], n: W.units.filter(u=>u.side===0).length }; });
 console.log('    30층 보통 맵', JSON.stringify(e1));
 ok(e1.lock===false&&e1.hide===true,'30층 보통 싸움 맵: 출구가 처음부터 열림 · 발견해야 앎');
 ok(!e1.seen&&e1.bar,'처음엔 출구를 모름 — 단추는 "🔎 출구 찾기"');
 const e2 = await p.evaluate(async ()=>{ const W=world; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } checkEnd(W); campBarRender(true);
   document.querySelector('#campBar [data-cexit="up"]').click(); { const lg=document.getElementById('lootGo'); if (lg) lg.click(); } const o0 = W.units.filter(u=>u.side===0&&u.order&&u.order.k==='exit').length;
   let tFound=null, t0=W.t; for (let i=0;i<2400 && !W.over;i++){ stepWorld(W,0.05); if (tFound==null && W.exitSeen) tFound=+(W.t-t0).toFixed(1); }
   const L=W.log, lv=L.filter(l=>l.k==='leave').map(l=>l.a), anc = L.find(l=>l.k==='exitWait'), lastA = lv[lv.length-1];
   return { o0, tFound, found: L.filter(l=>l.k==='exitFound').length, search: L.some(l=>l.k==='exitSearch'), left: lv.length, n: W.units.filter(u=>u.side===0&&!u.summon).length, over: W.over, res: W.result, wait: !!anc, lastIsAnc: anc ? anc.a===lastA : null, t: +(W.t-t0).toFixed(1) }; });
 console.log('    출구 찾기', JSON.stringify(e2));
 ok(e2.o0>0&&e2.search&&e2.tFound!=null&&e2.found===1,'출구 단추 → 안 가 본 곳을 뒤져 출구를 찾음 ('+e2.tFound+'초)');
 ok(e2.over&&e2.res==='exit'&&e2.left===e2.n,'찾은 뒤 모두 출구로 나감 ('+e2.left+'/'+e2.n+' · '+e2.t+'초)');
 ok(e2.wait&&e2.lastIsAnc,'대장은 출구 앞에서 기다렸다 마지막에 나감');
 // 두 번 = 서둘러 · 정예는 잠김
 const e3 = await p.evaluate(()=>{ const R=R8S(); world=null; const n=R.fm.rows[1][0]; n.t='fight'; n.ms='fight'; delete n.npc8; R.at=null; R.done=[]; r8Enter(n); while (TK) talkAdv(); const W=world; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } checkEnd(W); campBarRender(true);
   const b=()=>document.querySelector('#campBar [data-cexit="up"]'); b().click(); b().click(); const al=W.units.filter(u=>u.side===0&&u.alive); const hur = al.filter(u=>u.order&&u.order.hurry).length; stepWorld(W,0.05);
   const run = al.filter(u=>running(W,u)).length; return { hur, n: al.length, run }; });
 ok(e3.hur===e3.n&&e3.run>0,'출구 단추 두 번 = 서둘러 (뜀 '+e3.run+'/'+e3.n+')');
 const e4 = await p.evaluate(()=>{ const R=R8S(); world=null; const n=R.fm.rows[1][0]; n.t='elite'; n.e=Object.keys(ELITE8).find(k=>!ELITE8[k].open); delete n.ms; R.at=null; R.done=[]; r8Enter(n); while (TK) talkAdv(); const W=world; return { lock: W.exitLock, e: n.e }; });
 ok(e4.lock===true,'정예 맵은 잠김 ('+e4.e+')');
 // 7. 시작 행동: 같은 맵에서만 (다음 맵에 옛 좌표 명령이 걸리지 않음)
 const op = await p.evaluate(()=>{ const W=world; const u=W.units.find(x=>x.side===0); u.order={ k:'move', x:3, y:3 }; saveOpeners(W); const k0=S.openersK; resetToEdit(); start(); const same = !!(world.units.find(x=>x.pid===u.pid)||{}).order;
   S.seed = (S.seed||1) + 7; resetToEdit(); start(); const other = !!(world.units.find(x=>x.pid===u.pid)||{}).order; return { k0: !!k0, same, other }; });
 ok(op.k0&&op.same&&!op.other,'시작 행동은 같은 맵 (다시 하기) 에서만 — 다른 맵엔 옛 명령이 안 걸림');
 ok(errs.length===0,'페이지 오류 없음'+(errs.length?' — '+errs.slice(0,3).join(' | '):''));
 console.log(fails ? `FAIL ${fails}` : 'ALL OK');
 await b.close(); })();
