// v8.7.5 대형 UI 시험 — ui8750.js v1.3 (v1.3: 휴대폰 대형 띠는 판 위에 두지 않음 — 세로는 머리줄 칩 (판 밖) · 누르면 판 왼쪽 위에 펼침 · ▴ 접기 · 가로는 판 왼쪽 위 한 줄 칩 · 펼친 띠의 판 위 인물 꾹 누르기를 가리지 않음 · '모이는 중' · v1.2: 시작할 때 기본은 놓인 자리 그대로 · 휴대폰 띠는 판 아래쪽 · v1.1: 시작할 때 모임 칸은 시험 스위치 __noJit 를 끄고 봄 · v1.0: 버전 · 수치표 · 대형 띠 · 기준 · 명령은 기준에게 · 모여 · 깃발 · 모양 단추 · 켜고 끔 · 상세정보 칸 · 기록 · 서술 · 그림 · 단축키 · 편성 창 (편대 나누기 · 기준 · 모양 · 맞바꾸기 · 자유 끌기 · 되돌리기 · 시작할 때 · 싸울 때 · 교전 규칙) · 시작 모임 · 모닝스타 좁은 골목 그림 · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ window.__mkF = (list, keep, oneSq) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...(FOE8[k] && s===1 ? fromDesign(clone(FOE8[k]),1) : fromDesign(designByKey(k),s)), x, y, id: uid() })); if (oneSq) S.units.forEach(p => { if (p.side === 0){ p.sq = 'A'; p.rank = ''; } }); start(); paused = true; const W=world; if (!keep) list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); W.amb = 1; computeLight(W); markExplored(W); return W; };
   window.__run = (W, sec) => { const n = Math.round(sec / 0.05); for (let i=0;i<n && !W.over;i++) stepWorld(W, 0.05); }; });
 // 1) 버전 · 수치표
 const d = await p.evaluate(()=>({ ver: document.querySelector('span.ver').textContent, mig: RULES_MIG, r: [!!rules.form8, !!rules.fbuf, !!rules.combo], kb: KB_GROUPS.flat(2).join(' '), st0: form8Cfg().start }));
 ok(/v8\.7\.5/.test(d.ver)&&d.mig==='8.7.5','버전 8.7.5 · 수치표 이전 8.7.5'); ok(d.r.every(Boolean),'수치표에 form8 · fbuf · combo'); ok(d.st0==='loose','시작할 때 기본 = 놓인 자리 그대로 (손으로 놓은 자리를 옮기지 않음)'); ok(/모여/.test(d.kb)&&/편성 창/.test(d.kb),'단축키 표에 W · D');
 // 2) 판: 대형 · 기준 · 띠 · 명령은 기준에게 · 그림
 const r1 = await p.evaluate(()=>{ const W=__mkF([['인주',0,10,10],['레베카',0,11,10],['청광묵',0,10,11],['노먼',0,11,11],['검기사',1,40,10]], false, true); const out={ e: [] };
   const F = W.form && W.form.A; out.has = !!F; out.lead = F && W.units[F.lead].name; out.shape = F && F.shape;
   hud(); out.bar = !$('fmbar').hidden; out.barTxt = $('fmbar').textContent;
   sel = new Set([0,1,2,3]); groupMove(selUnits(W), 20.3, 10.4, 'move');
   const ld = W.units[F.lead]; out.ldOrd = ld.order && ld.order.form && ld.order.k; out.mem = W.units.filter(u => u.side === 0 && u !== ld).map(u => u.order ? u.order.k : null);
   try { draw(); } catch (e) { out.e.push('가는 곳: ' + e.message); }
   paused = false; __run(W, 8); out.dist = Math.hypot(ld.x - 20.5, ld.y - 10.5).toFixed(2); out.integ = +(F.integ || 0).toFixed(2); out.form = W.log.some(e => e.k === 'formForm');
   try { draw(); } catch (e) { out.e.push('도착: ' + e.message); }
   const D = W.units.filter(u => u.side === 0 && u !== ld).map(u => { const s = F.slots[u.i]; if (!s) return 9; const q = formPt(W, F, s); return +Math.hypot(u.x - q.x, u.y - q.y).toFixed(2); }); out.slotD = D;
   hud(); out.barTxt2 = $('fmbar').textContent; return out; });
 console.log('    ', JSON.stringify(r1).slice(0, 700));
 ok(r1.has&&r1.lead==='레베카'&&r1.shape==='삼각','대형: 본대 · 기준 = 레베카 (주 방어대장) · 삼각 (기본)');
 ok(r1.bar&&/본대/.test(r1.barTxt)&&/★ 레베카/.test(r1.barTxt),'대형 띠 보임 (본대 · ★ 레베카)');
 ok(r1.ldOrd==='move'&&r1.mem.every(x=>x===null),'고른 무리 이동 = 기준에게 (form) · 편대원은 명령 없이 따라감 '+JSON.stringify(r1.mem));
 ok(+r1.dist<1&&r1.integ>=0.7&&r1.form,'8초 뒤 기준 도착 · 유지율 '+r1.integ+' · 갖춤 기록'); ok(r1.slotD.every(x=>x<1.3),'편대원이 제 자리 둘레 '+JSON.stringify(r1.slotD));
 ok(!r1.e.length,'대형 그림 오류 없음 '+JSON.stringify(r1.e)); ok(/갖춤/.test(r1.barTxt2),'띠: 갖춤 ('+r1.barTxt2.slice(0, 80)+')');
 // 3) 떼어 맡김 · 모여 (W) · 깃발 (Shift + W) · 자동 (G) = 대형으로
 const r2 = await p.evaluate(()=>{ const W=world, F=W.form.A, ld=W.units[F.lead], m=W.units.find(u=>u.side===0&&u!==ld&&u.name==='노먼'); const out={ e: [] };
   sel = new Set([m.i]); groupMove([m], 26.2, 14.2, 'move'); __run(W, 1); out.det = !!m.fdet;
   hud(); out.barDet = /떼어 맡김/.test($('fmbar').textContent);
   sel = new Set(); formRallyKey(false); out.rallyOrd = (m.ordPend && m.ordPend.o && m.ordPend.o.k) || (m.order && m.order.k);   /* 지휘망으로 가는 중이면 ordPend */
   __run(W, 6); out.det2 = !!m.fdet; out.flag = !!F.flag;
   formRallyKey(true); out.armed = armed && armed.k; armedTap({ x: 14.4, y: 8.6 }); { const o = (ld.ordPend && ld.ordPend.o) || ld.order; out.ldTo = o && [o.k, o.x, o.y, !!o.form]; } out.flag2 = F.flag && [F.flag.x, F.flag.y];
   try { draw(); } catch (e) { out.e.push('깃발: ' + e.message); }
   __run(W, 8); out.ldAt = +Math.hypot(ld.x - 14.5, ld.y - 8.5).toFixed(2);
   const c = W.units.find(u=>u.side===0&&u.name==='청광묵'); sel = new Set([c.i]); ordKey('auto'); out.auto = (c.order && c.order.k) || (c.ordPend && c.ordPend.o && c.ordPend.o.k) || null;
   const lines = logLines(W, 0).join('\n'); out.log = ['모여 —', '대형으로 돌아감', '대형 갖춤'].filter(s => !lines.includes(s));
   return out; });
 console.log('    ', JSON.stringify(r2));
 ok(r2.det&&r2.barDet,'따로 이동 명령 = 떼어 맡김 (띠에 표시)'); ok(r2.rallyOrd==='frally'&&!r2.det2,'🚩 모여 (W) → 대형으로 (지휘망) → 돌아옴');
 ok(r2.armed==='frally'&&r2.ldTo&&r2.ldTo[0]==='move'&&r2.ldTo[3]&&r2.flag2&&r2.flag2[0]===14.5,'📍 깃발 (Shift + W) → 기준이 깃발 자리로 · 깃발 표시'); ok(r2.ldAt<1,'기준이 깃발에 닿음 ('+r2.ldAt+')');
 ok(r2.auto==='frally','자동 (G) = 대형으로 (대형 편대원)'); ok(!r2.log.length,'기록 줄 (빠진 것 '+JSON.stringify(r2.log)+')'); ok(!r2.e.length,'깃발 그림 오류 없음 '+JSON.stringify(r2.e));
 // 4) 띠 단추: 모양 · 켜고 끔 (기억) · 상세정보 칸 ★ 기준으로
 await p.click('#fmbar [data-fsh="A:일자"]'); await p.waitForTimeout(100);
 const r3a = await p.evaluate(()=>({ sh: world.form.A.shape, cfg: JSON.parse(localStorage.getItem('gul.form8.v1') || '{}').A }));
 ok(r3a.sh==='일자'&&r3a.cfg&&r3a.cfg.shape==='일자','띠의 모양 단추 → 일자 (판 · 기억)');
 await p.click('#fmbar [data-fon="A"]'); await p.waitForTimeout(100);
 const r3b = await p.evaluate(()=>({ on: world.form.A.on })); ok(r3b.on===false,'⏻ 대형 끔');
 await p.click('#fmbar [data-fon="A"]'); await p.waitForTimeout(100);
 const r3 = await p.evaluate(()=>{ const W=world, F=W.form.A, c=W.units.find(u=>u.side===0&&u.name==='청광묵'); sel = new Set([c.i]); hoverPid = null; renderDetail(); const h = $('det').innerHTML; return { on: F.on, row: /대형<\/span>/.test(h), btn: !!$('det').querySelector('[data-flead]') }; });
 ok(r3.on&&r3.row&&r3.btn,'다시 켬 · 상세정보 칸: 대형 줄 · ★ 기준으로 단추');
 await p.evaluate(()=>document.querySelector('#det [data-flead]').click()); await p.waitForTimeout(100);
 const r3c = await p.evaluate(()=>{ const W=world; return { lead: W.units[W.form.A.lead].name, cfg: form8Cfg().A.lead, log: logLines(W, 0).filter(s => /편성 —/.test(s)).length }; });
 ok(r3c.lead==='청광묵'&&r3c.cfg,'★ 기준으로 → 청광묵 (기억 '+r3c.cfg+')'); ok(r3c.log>=1,'편성 바꿈 기록');
 // 5) 진형 버프 · 조합 버프: 상세정보 칸 · 기록 · 서술 · 띠
 const r4 = await p.evaluate(()=>{ const W=__mkF([['간두',0,10,10],['쟝',0,11,10],['청광묵',0,10,12],['트라카',0,11,12],['검기사',1,40,10]]); const out={ e: [] }; paused = false; __run(W, 3);
   out.cb = W.units.filter(u=>u.side===0).map(u=>(u.cb||[]).join('+')); out.combos = (W.combos||[]).filter(c=>c.side===0).map(c=>c.nm);
   hud(); out.bar = /갱스터 파라다이스/.test($('fmbar').textContent) && /고블린즈/.test($('fmbar').textContent);
   const g = W.units[0]; sel = new Set([g.i]); renderDetail(); out.det = /조합 버프/.test($('det').innerHTML);
   g.fb = { sh: '삼각', nm: '삼각 엄호', row: 'front', back: false, tip: true }; renderDetail(); out.det2 = /진형 버프/.test($('det').innerHTML) && /삼각 엄호/.test($('det').innerHTML);
   L(W, { k: 'fbOn', side: 0, sq: 'A', sh: '삼각', nm: '삼각 엄호', a: g.i, vis: true }); L(W, { k: 'fbOff', side: 0, sq: 'A', sh: '삼각', nm: '삼각 엄호', vis: true }); L(W, { k: 'fbOn', side: 1, sh: '일자', nm: '방패벽', vis: true });
   L(W, { k: 'formBreak', a: g.i, sq: 'A', shape: '삼각', n: 4, integ: 0.3, vis: true }); L(W, { k: 'formWait', a: g.i, sq: 'A', integ: 0.5, vis: true }); L(W, { k: 'formLead', a: g.i, b: W.units[1].i, sq: 'A', vis: true }); L(W, { k: 'alleyNo', a: g.i, s: 'sweep', vis: true });
   const lines = logLines(W, 0).join('\n'); out.log = ['조합 버프 — 갱스터 파라다이스', '조합 버프 — 고블린즈', '진형 버프 — 삼각 엄호', '진형 버프 풀림', '적 진형 버프 — 방패벽', '대형 무너짐', '공세선을 맞추려 기다림', '이어받음', '좁은 골목', '⚑ 편성 — 본대'].filter(s => !lines.includes(s));
   out.nar = W.log.filter(e => ['combo','formForm','formBreak','formLead','formRally','alleyNo','fbOn','fbOff','formWait','formSet','frallyOk','form8Start'].includes(e.k)).map(e => { try { const r = narrOf(W, e); return r ? r.s : null; } catch (x) { out.e.push('narr ' + e.k + ': ' + x.message); return 'ERR'; } });
   return out; });
 console.log('    ', JSON.stringify(r4).slice(0, 900));
 ok(r4.combos.includes('갱스터 파라다이스')&&r4.combos.includes('고블린즈')&&r4.bar,'조합 버프: 갱스터 파라다이스 · 고블린즈 (띠에 🤝)'); ok(r4.det&&r4.det2,'상세정보 칸: 조합 버프 · 진형 버프 줄');
 ok(!r4.log.length,'기록 줄 (빠진 것 '+JSON.stringify(r4.log)+')'); ok(!r4.e.length&&r4.nar.filter(Boolean).length>=3,'서술 오류 없음 ('+r4.nar.filter(Boolean).length+'줄)');
 // 6) 시작할 때 모임 · 시작 교전 규칙 · 시작 기록
 const r5 = await p.evaluate(()=>{ window.__noJit = false; const C = form8Cfg(); C.start = 'form'; C.roe = 'hold'; C.A.lead = null; C.A.shape = '삼각'; form8Save();   /* 시험 스위치 __noJit 이면 놓인 자리 그대로 — 이 칸만 끔 */
   const W=__mkF([['인주',0,10,10],['레베카',0,12,11],['청광묵',0,9,12],['노먼',0,13,9],['검기사',1,40,10]], true, true); const F=W.form.A, ld=W.units[F.lead];
   const D = W.units.filter(u=>u.side===0&&u!==ld).map(u=>{ const s=F.slots[u.i]; if (!s) return 9; const q=formPt(W,F,s); return +Math.hypot(u.x-q.x,u.y-q.y).toFixed(2); });
   const roe = W.units.filter(u=>u.side===0).map(u=>u.roe); const st = logLines(W, 0).filter(s=>/⚑ 편성 —/.test(s)); C.roe = ''; form8Save(); window.__noJit = true; return { D, roe, st }; });
 console.log('    ', JSON.stringify(r5));
 ok(r5.D.every(x=>x<0.3),'시작할 때 대형 자리로 모여서 (편대원이 제 자리에서 시작) '+JSON.stringify(r5.D)); ok(r5.roe.every(x=>x==='hold'),'시작 교전 규칙 (교전 금지) 이 모두에게'); ok(r5.st.length===1&&/교전 금지/.test(r5.st[0]),'시작 기록: '+(r5.st[0]||''));
 // 7) 단축키: W · D · Esc
 await p.evaluate(()=>{ const W=world; paused = true; mode = 'plan'; });
 await p.keyboard.press('d'); await p.waitForTimeout(150);
 const k1 = await p.evaluate(()=>({ open: !$('fmWin').hidden, rows: document.querySelectorAll('#fmC .fmrow').length, cv: !!($('fmCv') && $('fmCv')._fm), hit: $('fmCv') && $('fmCv')._fm ? $('fmCv')._fm.hit.length : 0 }));
 ok(k1.open&&k1.rows===4&&k1.cv&&k1.hit===4,'D = 편성 창 (4명 · 미리 보기 '+k1.hit+')');
 await p.keyboard.press('Escape'); await p.waitForTimeout(100);
 ok(await p.evaluate(()=>$('fmWin').hidden),'Esc = 편성 창 닫기');
 // 8) 편성 창 (0초): 편대 나누기 → 판에도 바로 · 모양 · 맞바꾸기 · 자유 끌기 · 되돌리기 · 싸울 때 · 시작할 때
 const r6 = await p.evaluate(()=>{ const W=world; W.t = 0; mode = 'plan'; fmOpen(); const out={};
   const nor = W.units.find(u=>u.side===0&&u.name==='노먼'); const key = nor.fkey; fmSetSq(key, 'B'); out.fsq = nor.fsq; out.B = !!(W.form.B); out.rank = (S.units[nor.i]||{}).rank;
   const cq = document.querySelector('#fmC [data-fmsh="A:쐐기"]'); cq.click(); out.sh = W.form.A.shape; return out; });
 ok(r6.fsq==='B'&&r6.B&&r6.rank==='부대장','편성 창 0초: 노먼 → 2편대 (판에도 · 부대장)'); ok(r6.sh==='쐐기','편성 창 모양 → 쐐기 (판에도)');
 // 맞바꾸기 (마우스로 두 사람)
 const hp = await p.evaluate(()=>{ const cv=$('fmCv'), r0=cv.getBoundingClientRect(); return cv._fm.hit.filter(h=>!h.lead).map(h=>({ key: h.key, x: r0.left + h.x, y: r0.top + h.y })); });
 if (hp.length >= 2){ await p.mouse.click(hp[0].x, hp[0].y); await p.waitForTimeout(80); await p.mouse.click(hp[1].x, hp[1].y); await p.waitForTimeout(150); }
 const r7 = await p.evaluate(()=>({ sw: form8Cfg().A.swaps.length, wsw: (world.form.A.swaps||[]).length })); ok(r7.sw===1&&r7.wsw===1,'미리 보기에서 두 사람을 눌러 자리 맞바꿈 (기억 · 판)');
 await p.click('#fmC [data-fmreset="A"]'); await p.waitForTimeout(100); ok(await p.evaluate(()=>form8Cfg().A.swaps.length===0),'↺ 자리 되돌리기');
 await p.click('#fmC [data-fmsh="A:자유"]'); await p.waitForTimeout(150);
 const r8 = await p.evaluate(()=>{ const C=form8Cfg().A; return { sh: C.shape, pins: Object.keys(C.pin||{}).length, prev: C.prevShape }; }); ok(r8.sh==='자유'&&r8.pins>=1&&r8.prev==='쐐기','자유로 바꾸면 쐐기 자리에서 시작 (자리 '+r8.pins+')');
 const dp = await p.evaluate(()=>{ const cv=$('fmCv'), r0=cv.getBoundingClientRect(), h=cv._fm.hit.find(x=>!x.lead); return h ? { key: h.key, x: r0.left + h.x, y: r0.top + h.y } : null; });
 if (dp){ await p.mouse.move(dp.x, dp.y); await p.mouse.down(); await p.mouse.move(dp.x + 40, dp.y + 30, { steps: 5 }); await p.mouse.up(); await p.waitForTimeout(150); }
 const r9 = await p.evaluate((k)=>{ const C=form8Cfg().A, q=(C.pin||{})[k]; const F=world.form.A; return { q, wpin: !!(F.pin && F.pin[k]), sh: F.shape }; }, dp && dp.key);
 ok(r9.q&&r9.wpin&&r9.sh==='자유','자유 대형: 끌어 놓은 자리 (기억 · 판) '+JSON.stringify(r9.q));
 await p.click('#fmC [data-fmstyle="B:loose"]'); await p.click('#fmC [data-fmstart="form"]'); await p.click('#fmC [data-fmroe="smart"]'); await p.waitForTimeout(100);
 const r10 = await p.evaluate(()=>{ const C=form8Cfg(); return { st: C.B.style, wst: world.form.B && world.form.B.style, start: C.start, roe: C.roe }; });
 ok(r10.st==='loose'&&r10.wst==='loose'&&r10.start==='form'&&r10.roe==='smart','싸울 때 (2편대 맞붙으면 각자) · 시작할 때 (대형 자리로) · 교전 규칙 (판단) 기억');
 const rb = await p.evaluate(()=>{ const t=$('fmC').innerText; return { buf: /진형 —/.test(t), combo: /굴에 떨어진 이들|노먼의 2편대|고블린즈/.test(t) }; }); ok(rb.buf&&rb.combo,'버프 미리 보기 (진형 · 조합)');
 await p.evaluate(()=>{ fmClose(); const C=form8Cfg(); C.A.shape='삼각'; C.A.pin=null; C.start='form'; C.roe=''; C.B.style='keep'; form8Save(); });
 // 9) 배치 (편집) 에서 편성 창 · 편대 상자 단추
 const r11 = await p.evaluate(()=>{ resetToEdit(); renderSqBox(); const b = document.querySelector('#sqBoxP [data-fopen]'); if (b) b.click(); const out = { btn: !!b, open: !$('fmWin').hidden, rows: document.querySelectorAll('#fmC .fmrow').length, live: /배치 — 다음 판부터/.test($('fmC').textContent) }; fmClose(); return out; });
 ok(r11.btn&&r11.open&&r11.rows>=1&&r11.live,'배치 탭 편대 상자 → ⚑ 편성 창 (배치 — 다음 판부터)');
 // 10) 모닝스타 좁은 골목 그림 (A6) · 대형 끔 판의 띠
 const r12 = await p.evaluate(()=>{ const W=__mkF([['모닝스타',0,10,10],['검기사',1,11.5,10]]); const m=W.units[0], out={ e: [] }; m.act = { k: 'atk', b: 1, phase: 'wind', t0: W.t, end: W.t + 0.8, fl: true, alley: true }; try { draw(); } catch (e) { out.e.push(e.message); } m.act = null; hud(); out.bar = $('fmbar').hidden; return out; });
 ok(!r12.e.length,'좁은 골목 철퇴 그림 오류 없음 '+JSON.stringify(r12.e)); ok(r12.bar,'혼자인 판엔 대형 띠 없음');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 // 11) 휴대폰: 띠 · 편성 창 한 줄
 const mc = await b.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.6 }); const mp = await mc.newPage(); const merr=[]; mp.on('pageerror',e=>merr.push(e.message)); await mp.addInitScript('window.__askAuto=true; window.__noJit=true');
 await mp.goto(url); await mp.waitForTimeout(1200);
 const m1 = await mp.evaluate(()=>{ setMode('train'); resetToEdit(); S.units = [['인주',0,10,10],['레베카',0,11,10],['청광묵',0,10,11],['노먼',0,11,11],['검기사',1,40,10]].map(([k,s,x,y])=>({ ...fromDesign(designByKey(k),s), x, y, id: uid() })); start(); paused = true; hud();
   const R = e => { if (!e || e.hidden) return null; const q = e.getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom]; };
   const bar = $('fmbar'), ch = $('fmChip'), vw = document.documentElement.clientWidth, vr = $('view').getBoundingClientRect(), c0 = R(ch);
   const out = { bar0: bar.hidden, chip: !!c0, chipOut: !!c0 && c0[3] <= vr.top + 1 && c0[2] <= vw + 1 && c0[0] >= 0, chipTxt: ch.textContent, st0: /모이는 중|갖춤|기다림/.test(ch.textContent + ' ' + fmSt(world.form.A, 0.7)[1]) };
   ch.click(); const r = R(bar); out.open = !!r && !bar.hidden; out.inView = !!r && r[2] <= vw + 1 && r[0] >= 0; out.top = !!r && r[1] < vr.top + vr.height / 2; out.shp = getComputedStyle(bar.querySelector('.fsh') || bar).display; out.fold = !!bar.querySelector('[data-fmob="0"]');
   bar.querySelector('[data-fmob="0"]').click(); out.closed = bar.hidden && !/▴/.test(ch.textContent);
   fmOpen(); const c = $('fmC'), rc = c.getBoundingClientRect(); out.win = rc.width <= vw + 1; out.cols = getComputedStyle(document.querySelector('.fmgrid')).gridTemplateColumns.split(' ').length; out.sx = document.documentElement.scrollWidth <= vw + 1; fmClose(); return out; });
 console.log('     휴대폰', JSON.stringify(m1));
 ok(m1.bar0&&m1.chip&&m1.chipOut&&/본대/.test(m1.chipTxt),'휴대폰 세로: 대형은 머리줄 칩 (판 밖 — 판 위 인물 · 여정 띠를 가리지 않음) · 처음엔 띠를 펼치지 않음');
 ok(m1.open&&m1.inView&&m1.top&&m1.shp==='none'&&m1.fold&&m1.closed,'휴대폰 세로: 칩을 누르면 판 왼쪽 위에 펼침 (모양 단추는 편성 창에) · ▴ 접기');
 ok(m1.win&&m1.cols===1&&m1.sx,'휴대폰: 편성 창 한 줄 · 가로 넘침 없음');
 // 휴대폰 가로: 머리줄이 숨음 — 판 왼쪽 위 한 줄 칩 · 꾹 누르기 자리 (판 가운데) 를 가리지 않음
 await mp.setViewportSize({ width: 915, height: 412 }); await mp.waitForTimeout(500);
 const m2 = await mp.evaluate(()=>{ hud(); const bar = $('fmbar'), ch = $('fmChip'), vr = $('view').getBoundingClientRect(), r = bar.getBoundingClientRect();
   const out = { land: document.body.classList.contains('land'), chipHid: ch.hidden, bar: !bar.hidden, one: !!bar.querySelector('.fsum [data-fmob="1"]'), small: r.height < 60 && r.bottom < vr.top + vr.height / 3, mid: document.elementFromPoint(vr.left + vr.width / 2, vr.top + vr.height / 2) === $('cv') };
   bar.querySelector('[data-fmob="1"]').click(); out.open = !!bar.querySelector('[data-fsh], [data-frally]'); bar.querySelector('[data-fmob="0"]').click(); out.closed = !!bar.querySelector('.fsum'); return out; });
 console.log('     휴대폰 가로', JSON.stringify(m2));
 ok(m2.land&&m2.chipHid&&m2.bar&&m2.one&&m2.small&&m2.mid&&m2.open&&m2.closed,'휴대폰 가로: 판 왼쪽 위 한 줄 칩 (판 가운데는 비어 꾹 누르기 그대로) · 펼침 · 접기');
 ok(!merr.length,'휴대폰 페이지 오류 없음 '+JSON.stringify(merr.slice(0,3)));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8750 OK'); await b.close(); process.exit(fails ? 1 : 0); })();
