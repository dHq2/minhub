// v8.7.2 바로잡기 UI 시험 — ui8720.js v1.2 (v1.2: 지휘 재능 발견 시험은 도감 정체성이 지휘인 동료 (포렌 [지휘S] — 뽑기로 올 수 있음) 도 뺌 — 그 동료가 있으면 이미 지휘관 · v1.1: 혼자 남은 이의 0초 명령 · 가까운 적 시험은 돌격 값어치를 열어 둠 · 리치 · 성향 시험 전에 여정을 끝냄 (바위 맵 위에서 돌격을 시험하던 것) · 성향 · 가까운 적 · 돌진 표적 시험은 시작 뒤 자리를 다시 놓음 (적이 시작 때 다른 자리로 놓임) · 눈앞 적을 치우면 돌격하는지도 · v1.0: 처음 동료 7 · 지휘관 없는 판의 지휘 재능 · 각혈 재시작 · 훈련장 2층 · 리치 (카리우스 + 둔기) · 가윤 · 모닝스타 돌격 안 함 · 돌진 표적 바꾸기 · 출구 명령 글 · 회피 로그 · 상호작용 단추 · 근력 성장 · 세자르 원형 베기 수치 · 각혈 확률)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000);
 // 1. 처음 동료: 인주 + 확정 셋 + 뽑기 셋
 const st = await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); return { n: S.units.filter(u=>u.side===0).length, kh: S.camp.khWill }; });
 await p.evaluate(TALKEND);
 ok(st.n===7,'처음 동료 '+st.n+' (인주 + 확정 셋 + 뽑기 셋)');
 ok([0,1,2].includes(st.kh),'각혈은 캠페인에 한 번 정함 (khWill '+st.kh+')');
 // 2. 각혈 확률: 캠페인 1000번 — 오는 비율 8% 언저리 · 1S/2S 반반
 const kp = await p.evaluate(()=>{ let n=0,a=0; for (let i=0;i<4000;i++){ const w = Math.random() < KH_P ? (Math.random()<0.5?1:2) : 0; if (w) n++; if (w===1) a++; } return { r: n/4000, a: a/Math.max(1,n) }; });
 ok(kp.r>0.05&&kp.r<0.11,'각혈이 오는 캠페인 '+(kp.r*100).toFixed(1)+'% (매우 낮음 · 못 볼 수도)');
 // 3. 지휘관 없는 판: 인주를 빼고 1S 다시 — 누군가 [지휘C] 를 발견 · 명령이 닿음
 const cm = await p.evaluate(()=>{ resetToEdit(); S.units = S.units.filter(u=>!(u.side===0&&(u.hero||((identityOf(u.ref)||{}).traits||[]).some(t=>/^지휘/.test(t))))); for (const u of S.units) if (u.side===0) u.traits=(u.traits||[]).filter(t=>!/^지휘/.test(t)); start(); const W=world;
   const c = W.units.filter(u=>u.side===0&&u.cmd>0); const who = S.units.filter(u=>u.side===0&&(u.traits||[]).includes('지휘C')).map(u=>u.name);
   const others = W.units.filter(u=>u.side===0&&u.alive&&!(u.cmd>0)); const L = others.length ? cmdLink(W, cmdBoss(W, 0), others[0]) : null; const log = (W.log||[]).some(l=>l.k==='r8'&&/지휘의 재능/.test(l.s||''));
   return { c: c.length, who, p: L ? +(L.p||0).toFixed(2) : null, why: L && L.why, log }; });
 console.log('    지휘', JSON.stringify(cm));
 ok(cm.c===1&&cm.who.length===1&&cm.log,'인주가 없으면 '+cm.who.join('')+' 이 지휘의 재능을 발견 [지휘C] · 로그');
 ok(cm.p>0,'그 지휘관을 거쳐 명령이 닿음 (전달 '+cm.p+')');
 const cm2 = await p.evaluate(()=>{ resetToEdit(); start(); return S.units.filter(u=>u.side===0&&(u.traits||[]).includes('지휘C')).length; });
 ok(cm2===1,'다음 판에도 같은 이가 지님 (새로 뽑지 않음)');
 // 엔진: 처음부터 지휘관이 없는 판 (페이지 밖) 도 임시 지휘가 섬
 const ac = await p.evaluate(()=>{ const W=world; for (const u of W.units) if (u.side===0){ u.cmd=0; u.cmdTmp=false; } W.acting=null; for (let i=0;i<80;i++){ W.t+=0.05; actingCmd(W,0); } return W.units.filter(u=>u.side===0&&u.cmd>0&&u.cmdTmp).length; });
 ok(ac===1,'지휘관이 쓰러지면 2.5초 뒤 임시 지휘 (우리 편)');
 const so = await p.evaluate(()=>{ resetToEdit(); S.units=[{ ...fromDesign(designByKey('카리우스'),0), x:5, y:5, id: uid() }, { ...fromDesign(designByKey('검기사'),1), x:15, y:5, id: uid() }]; start(); const W=world, k=W.units[0]; return { cmd: k.cmd, l: cmdLink(W, cmdBoss(W,0), k).p }; });
 ok(so.cmd>0&&so.l===1,'혼자 남은 이 (지휘 특성 없음) 도 0초부터 제 명령을 받음');
 // 4. 각혈 재시작: 각혈이 나온 1S 를 다시 시작하면 적으로 남지 않음
 const kh = await p.evaluate(async ()=>{ encTry('kh', true); await new Promise(r=>setTimeout(r,1800)); while (TK) talkAdv(); const C=S.camp, st=C.stages[1]; if (!world) start(); const W=world; W.t = (st.khT||0)+0.1; khTick(W); while (TK) talkAdv();
   const a = W.units.filter(u=>u.name==='각혈').length, s1 = S.units.filter(u=>u.name==='각혈').length; resetToEdit(); start(); const W2=world;
   return { a, s1, after: S.units.filter(u=>u.name==='각혈').length, w2: W2.units.filter(u=>u.name==='각혈').length, again: st.khDone === false }; });
 console.log('    각혈', JSON.stringify(kh));
 ok(kh.a===1&&kh.s1===1&&kh.after===0&&kh.w2===0&&kh.again,'각혈이 나온 맵을 다시 시작 — 적으로 남지 않음 (그 때가 오면 다시 나타남)');
 // 5. 훈련장 (인카운터 시험) 에서도 2층으로
 const tr = await p.evaluate(async ()=>{ encTry('5', true); await new Promise(r=>setTimeout(r,1800)); while (TK) talkAdv(); const C=S.camp; const t = !!C.test; campEnd('clear'); const b=document.getElementById('campRun8'); if (!b) return { t, b: false }; b.click(); while (TK) talkAdv(); return { t, b: true, run: !!(S.camp.run&&S.camp.run.on) }; });
 ok(tr.t&&tr.b&&tr.run,'훈련장 (인카운터 시험 5S) 끝 → ▼ 2층으로 단추 · 30층 여정 시작');
 // 6. 리치 = 몸 + 무기: 카리우스가 둔기를 들어도 짧아지지 않음
 await p.evaluate(()=>{ if (typeof r8Hide==='function') r8Hide(); if (S.camp) campQuit(true); setMode('train'); });   // 여정 맵을 떠나 훈련장의 빈 판에서
 const rc = await p.evaluate(()=>{ resetToEdit(); S.units=[{ ...fromDesign(designByKey('카리우스'),0), x:5, y:5, id: uid() }, { ...fromDesign(designByKey('검기사'),1), x:15, y:5, id: uid() }]; start(); const W=world, u=W.units[0];
   const r0 = u.rng; const wn = Object.entries(W.rules.weapons).find(([k,w])=>w.kind==='둔기'&&!w.ammo&&!w.thr&&w.rng<=0.6); setWeapon(W, u, wn[0]); const r1 = u.rng; const w=wn[1].rng;
   unarmed && 0; u.weaponNow='맨손'; return { r0, x: u.reachX, wn: wn[0], w, r1 }; });
 console.log('    리치', JSON.stringify(rc));
 ok(rc.r0===0.6&&Math.abs(rc.x-0.3)<0.01&&Math.abs(rc.r1-(rc.w+0.3))<0.01,'카리우스 맨손 '+rc.r0+' · '+rc.wn+' 를 들면 '+rc.r1+' (무기 '+rc.w+' + 몸 0.3)');
 // 7. 가윤 · 모닝스타 · 치유는 돌격 안 함 (타고남) · 가윤 지혈 최소 50 · 지휘관 명령 돌격은 따름
 const gc = await p.evaluate(()=>{ resetToEdit(); S.units=[{ ...fromDesign(designByKey('가윤'),0), x:5, y:5, id: uid() }, { ...fromDesign(designByKey('모닝스타'),0), x:5, y:7, id: uid() }, { ...fromDesign(designByKey('카리우스'),0), x:5, y:9, id: uid() }, { ...fromDesign(designByKey('검기사'),1), x:8.5, y:7, id: uid() }]; start(); const W=world, g=W.units[0], m=W.units[1], k=W.units[2], e=W.units[3]; const put=(u,x,y)=>{ u.x=x; u.y=y; u.vx=u.vy=0; }; put(g,5,5); put(m,5,7); put(k,5,9); put(e,8.5,7); e.seenBy=true; computeLight(W);
   const auto = tryCharge(W, m, e, false); m.act=null; m.chargeCd=-9; const ord = tryCharge(W, m, e, true);
   k.hp = 200; const per = Math.max(g.skill.min, Math.min(k.max*g.skill.pct, g.skill.cap));
   return { gn: g.noChg, mn: m.noChg, min: g.skill.min, cap: g.skill.cap, auto, ord, per, kmax: k.max }; });
 console.log('    성향', JSON.stringify(gc));
 ok(gc.gn&&gc.mn&&!gc.auto&&gc.ord,'가윤 · 모닝스타 돌격 안 함 (스스로 안 함 · 명령이면 함)');
 ok(gc.min===50&&gc.per>=200,'가윤 지혈 최소 50 · 카리우스 (최대 '+gc.kmax+') 에겐 '+gc.per+' (비율)');
 // 8. 더 가까운 적을 지나쳐 스스로 돌격하지 않음
 const np = await p.evaluate(()=>{ resetToEdit(); S.units=[{ ...fromDesign(designByKey('검기사'),0), x:5, y:5, id: uid() }, { ...fromDesign(designByKey('검기사'),1), x:6.6, y:5, id: uid() }, { ...fromDesign(designByKey('검기사'),1), x:9.5, y:5.6, id: uid() }]; start(); const W=world, a=W.units[0]; a.x=5; a.y=5; W.units[1].x=6.6; W.units[1].y=5; W.units[2].x=9.5; W.units[2].y=5.6; computeLight(W); W.stance={}; const w0=W.rules.charge.worth; W.rules.charge.worth=-99; const far0 = tryCharge(W, a, W.units[2], false, true) === false && W.units.some(f=>f.side===1&&gap(a,f)<2.5); W.units[1].x=20; W.units[1].y=15; a.act=null; a.chargeCd=-9; const ctl = tryCharge(W, a, W.units[2], false, true); a.act=null; W.units[1].x=6.6; W.units[1].y=5; a.line=false; const r = tryCharge(W, a, W.units[2], false, true); W.rules.charge.worth=w0; return { r, far0, ctl }; });
 console.log('    가까운 적', JSON.stringify(np)); ok(np.r===false&&np.ctl===true,'눈앞에 적이 있으면 그 너머의 적에게 돌격하지 않음 (눈앞 적을 치우면 돌격함)');
 // 9. 돌진 준비 중엔 공격 단추로 표적을 바꿈 · 달리기 시작하면 그대로
 const rt = await p.evaluate(()=>{ resetToEdit(); S.units=[{ ...fromDesign(designByKey('카리우스'),0), x:5, y:8, id: uid() }, { ...fromDesign(designByKey('검기사'),1), x:9, y:6, id: uid() }, { ...fromDesign(designByKey('검기사'),1), x:9, y:10, id: uid() }]; start(); const W=world, k=W.units[0], e1=W.units[1], e2=W.units[2]; k.x=5; k.y=8; e1.x=9; e1.y=6; e2.x=9; e2.y=10; e1.seenBy=e2.seenBy=true;
   startCharge(W, k, e1, null); sel=new Set([k.i]); selId=k.i; giveAttack(e2); const b1 = k.act && k.act.b; k.act.phase='run'; giveAttack(e1); const b2 = k.act && k.act.b; return { b1, b2, e1: e1.i, e2: e2.i, o: k.order && k.order.k }; });
 ok(rt.b1===rt.e2&&rt.b2===rt.e2,'돌진 준비 중 공격 → 표적 바뀜 · 달리는 중엔 그대로');
 // 10. 출구 명령 글 · 회피 로그 (undefined · NaN 없음)
 const lg = await p.evaluate(()=>{ const W=world, u=W.units[0]; u.order={ k:'exit', dir:'up', x:u.x }; const t = JSON.stringify(cmdCtx(W,[u])); W.log.push({ k:'evade', a: W.units[1].i, b: u.i, how:'melee', why:'x', p:0.4, t: W.t, vis:true }); const L = logLines(W).join('\n'); return { nan: /NaN/.test(t), exit: /출구/.test(t), und: /undefined/.test(L), ev: /피함 ←/.test(L) }; });
 ok(!lg.nan&&lg.exit,'출구 명령은 "출구" (ANaN 없음)'); ok(!lg.und&&lg.ev,'엔진 회피 로그 — "피함 ← 누구의 일격" (undefined 없음)');
 // 11. 근력: 없던 것이 새로 생기지 않음 (공격 +2)
 const gr = await p.evaluate(()=>{ const q={ ...fromDesign(designByKey('가윤'),0) }; q.traits=(q.traits||[]).filter(t=>!/^근력/.test(t)); const a0 = statsOf(q, rules).atk; const out = growFor(q, { meleeDealt: 99999 }); return { tr: (q.traits||[]).filter(t=>/^근력/.test(t)), out, a0, a1: q.ov && q.ov.atk }; });
 ok(!gr.tr.length&&gr.a1===gr.a0+2,'근력은 새로 생기지 않음 — 공격 +2 ('+gr.out.join(' · ')+')');
 // 12. 세자르 원형 베기: 빠르고 약함 · 자주
 const cz = await p.evaluate(()=>{ const s=rules.cz.spin; return s; });
 ok(cz.mul<=0.7&&cz.cd<=2.5&&cz.wind<=0.25,'세자르 원형 베기 '+JSON.stringify(cz));
 // 13. 상호작용 단추: 5S 관 곁에 가면 화면 아래 '관을 연다'
 const ap = await p.evaluate(async ()=>{ if (S.camp) campQuit(true); setMode('story'); encTry('5', true); await new Promise(r=>setTimeout(r,1800)); while (TK) talkAdv(); if (!world) start(); const W=world; const h=W.units.find(u=>u.side===0&&u.alive); const E=S.camp.stages[5].cz; let tries=0; while (!czNearCoffin(W) && tries<400){ h.x += (HALL.king.x-h.x)*0.05; h.y += (HALL.king.y+1.6-h.y)*0.05; tries++; } hud();
   const P=document.getElementById('actPr'); const v = P && !P.hidden ? P.textContent : ''; if (P && !P.hidden) P.querySelector('button').click(); while (TK) talkAdv(); return { st0: 'coffin', v, st: E.st }; });
 console.log('    상호작용', JSON.stringify(ap)); await wait(p,300); await p.screenshot({ path: 'shots/v872_prompt.png' });
 ok(/관을 연다/.test(ap.v)&&ap.st!=='coffin','관 곁에 가면 화면 아래 "관을 연다" · 누르면 열림');
 ok(!errs.length,'페이지 오류 없음 '+errs.slice(0,3).join(' | '));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); })();
