// v8.7.3 바로잡기 4d UI 시험 — ui8730d.js v1.4 (v1.4: 적 진형 기록 — 지휘관이 쓰러져 '지휘를 잃음' 으로 제각기 (free) 가 된 줄만 이름 없음이 맞음 · v1.3: 늦게 띄우는 나레이션 · 알림 (ldAfter) 은 맵이 바뀌면 버림 · v1.2: 막 닫힌 대화 (0.45초) 막이는 누르는 곳 (판 클릭 · 💬 단추) 에 — encTalk 자체는 열려 있을 때만 막음 (시험 · 이야기 흐름이 바로 여는 것은 됨) · v1.1: 전투 일지는 끝난 판에서만 (over) · 진형 기록은 지휘관 · 방패가 있는 적으로 실제로 남김 · v1.0: 적 진형 글은 그때의 지휘관 · 상처 묶음 · 전리품 수 한 번 · 이야기 되풀이 줄임 · 치료 도구 글 · 자기 치료는 '동료의 상처' 에서 뺌 · 끝난 맵의 적 판단 · 소음 · 전열 기록 없음 · 마법은 떨어뜨리지 않음 · 심장 급소 → 심장 글 · 대화 겹침 · 노라 · 세르파 글)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000);
 await p.evaluate(()=>{ window.__mk = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...fromDesign(designByKey(k),s), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ const u = W.units[i]; u.x=u.px=x; u.y=u.py=y; u.order=null; u.stay=null; }); return W; }; });

 // 1. 적 진형 글: 기록에 남은 그때의 지휘관 (죽은 이가 아님)
 const r1 = await p.evaluate(()=>{ const W = __mk([['카리우스',0,5,10],['검기사',1,20,10],['창병',1,22,10]]); const a = W.units[1], c = W.units[2]; a.cmd = 9; c.cmd = 3; a.alive = false;
   const W2 = __mk([['카리우스',0,5,10],['모닝스타',0,6,11],['검방패기사',1,12,10],['곤봉적',1,13,11],['창병',1,13,9]]); W2.amb = 1; computeLight(W2); for (let i = 0; i < 160; i++) stepWorld(W2, 0.05); const st2 = W2.log.filter(l => l.k === 'stance' && l.side === 1).map(l => [l.s, l.by != null ? W2.units[l.by].name : null, l.why]);
   const l1 = narrOf(W, { k: 'stance', side: 1, s: 'hold', by: c.i, t: 1 }), l2 = narrOf(W, { k: 'stance', side: 1, s: 'hold', t: 2 });
   W.log.length = 0; stepWorld(W, 0.05); for (let i = 0; i < 40; i++) stepWorld(W, 0.05); const st = W.log.filter(l => l.k === 'stance'); return { l1: l1 && l1.s, l2: l2 && l2.s, by: st.map(l => l.by), st2 }; });
 console.log('    진형', JSON.stringify(r1));
 ok(/창병이 지휘한다/.test(r1.l1||'')&&!/검기사/.test(r1.l1||'')&&!/지휘한다/.test(r1.l2||''),'적 진형 글: 그때의 지휘관 (창병) — 죽은 검기사가 아님 · 모르면 이름 없이');
 ok(r1.st2.length>0&&r1.st2.every(x=>x[1]||(x[0]==='free'&&x[2]==='지휘를 잃음')),'엔진의 적 진형 기록에 그때의 지휘관 (지휘를 잃은 제각기만 이름 없음) '+JSON.stringify(r1.st2.slice(0,3)));

 // 2. 상처 묶음 · 전리품 수 한 번
 const r2 = await p.evaluate(()=>{ const w = woundTxt(['팔', '팔', '오른팔 파괴']), h = woundTxt(['머리 하나를 잃음', '머리 하나를 잃음']);
   const it = { k: 'ammo', at: '화살', n: 0, n0: 39, taken: '저절로 · 트라카 39' }; const t = `${itName(it)} → ${it.taken}`; return { w, h, t, src: /x\.n0 \? ' ' \+ x\.n0/.test(String(jrLoot)) }; });
 console.log('    상처 · 전리품', JSON.stringify(r2));
 ok(r2.w==='팔 ×2, 오른팔 파괴'&&r2.h==='머리 하나를 잃음 ×2','상처 목록 묶음 ("'+r2.w+'" · "'+r2.h+'")');
 ok(r2.t==='화살 39 → 저절로 · 트라카 39'&&!r2.src,'전리품 기록: "'+r2.t+'" (화살 39 39 아님)');

 // 3. 이야기 되풀이 줄임: 같은 이의 '몸을 돌린다' 6초 · '숨이 차' 20초 · 전열 이룸 / 흩어짐 6초 (편마다)
 const r3 = await p.evaluate(()=>{ const W = __mk([['카리우스',0,5,10],['모닝스타',0,6,10],['검기사',1,20,10],['창병',1,22,10]]); const E = W.units; E[2].seenBy = 1;
   const ev = [{ k: 'retarget', a: 2, b: 0, vis: true, t: 1 }, { k: 'retarget', a: 2, b: 1, vis: true, t: 2 }, { k: 'retarget', a: 2, b: 0, vis: true, t: 8.5 }, { k: 'winded', a: 0, vis: true, t: 3 }, { k: 'winded', a: 0, vis: true, t: 12 }, { k: 'winded', a: 0, vis: true, t: 24 },
     { k: 'lineForm', side: 0, ids: [0, 1], n: 2, vis: true, t: 4 }, { k: 'lineBreak', side: 0, ids: [0, 1], n: 2, vis: true, t: 5 }, { k: 'lineForm', side: 0, ids: [0, 1], n: 2, vis: true, t: 11 }];
   const out = ev.map(e => !!narrOf(W, e)); const again = ev.map(e => !!narrOf(W, e)); return { out, same: JSON.stringify(out) === JSON.stringify(again) }; });
 console.log('    되풀이', JSON.stringify(r3));
 ok(JSON.stringify(r3.out)===JSON.stringify([true,false,true,true,false,true,true,false,true])&&r3.same,'되풀이 줄임 — 몸을 돌린다 · 숨이 차 · 전열 (다시 읽어도 같음)');

 // 4. 치료 도구 글: 양동이는 옐로만
 const r4 = await p.evaluate(()=>{ const W = __mk([['노먼',0,5,10],['옐로',0,6,10],['가윤',0,7,10],['딸기',0,8,10],['검기사',1,20,10]]); return W.units.slice(0, 4).map(u => u.name + ': ' + healRun(u, '카리우스') + ' / ' + healPour(u, '카리우스')); });
 console.log('    치료 도구', JSON.stringify(r4));
 ok(/구급상자를 들고/.test(r4[0])&&/양동이를 들고/.test(r4[1])&&/구급상자를 들고/.test(r4[2])&&!/양동이/.test(r4[0]+r4[2]+r4[3])&&/딸기 정령술/.test(r4[3]),'치료 도구 글: 노먼 · 가윤 = 구급상자 · 옐로 = 양동이 · 딸기 = 정령술');

 // 5. 자기 치료는 '동료의 상처' 에서 뺌
 const r5 = await p.evaluate(()=>{ const W = __mk([['노먼',0,5,10],['카리우스',0,6,10],['검기사',1,20,10]]); W.over = true; const n = W.units[0]; n.healed = 50; n.healedSelf = 50; const a = chronicle(W).join(' | '); n.healedSelf = 20; const b2 = chronicle(W).join(' | '); return { a: /동료의 상처/.test(a), b: (b2.match(/동료의 상처를 \d+/) || [''])[0] }; });
 console.log('    자기 치료', JSON.stringify(r5));
 ok(!r5.a&&r5.b==='동료의 상처를 30','전투 일지: 자기 치료만 했으면 "동료의 상처" 없음 · 섞이면 남의 몫만 ('+r5.b+')');

 // 6. 끝난 맵: 적 판단 · 싸움 소리 · 전열 기록 없음
 const r6 = await p.evaluate(()=>{ const W = __mk([['카리우스',0,5,10],['모닝스타',0,6,10],['검기사',1,20,10]]); W.amb = 1; computeLight(W); for (let i = 0; i < 30; i++) stepWorld(W, 0.05);
   const e = W.units[2]; e.alive = false; e.hp = 0; const n0 = W.log.length; W.dinEv = [{ x: 5, y: 10, t: W.t, v: 40 }]; W.dinLogLv = 0;
   for (let i = 0; i < 120; i++) stepWorld(W, 0.05); const L = W.log.slice(n0); return { judge1: L.filter(l => l.k === 'judge' && l.side === 1).length, dinUp: L.filter(l => l.k === 'din' && l.lv > 0).length, line: L.filter(l => l.k === 'lineForm' || l.k === 'lineBreak').length }; });
 console.log('    끝난 맵', JSON.stringify(r6));
 ok(r6.judge1===0&&r6.dinUp===0&&r6.line===0,'적이 다 쓰러진 뒤: "◆ 적의 판단" · "싸움 소리가 커진다" · 전열 이룸/흩어짐 기록 없음');

 // 7. 마법은 떨어뜨리지 않음 · 심장 급소 → 심장 글
 const r7 = await p.evaluate(()=>{ const W = __mk([['노먼',0,5,10],['세르파',1,8,10],['검기사',1,12,10]]); const sp = W.units[1]; dropOnDeath(W, sp); const magic = (W.items || []).filter(it => it.name === '마법').length;
   const k = W.units[2], kinds = []; for (let i = 0; i < 12; i++){ k.alive = false; k.down = false; k.deathKind = null; woundRoll(W, W.units[0], k, { vital: '심장', far: true, wk: '총포류', dir: 'front' }, 80, '몸통', false, true, [0, 1, 0]); kinds.push(k.deathKind); }
   return { magic, wp: sp.weapon, kinds: [...new Set(kinds)] }; });
 console.log('    마법 · 급소', JSON.stringify(r7));
 ok(r7.wp==='마법'&&r7.magic===0,'세르파가 쓰러져도 "마법" 이 바닥에 떨어지지 않음');
 ok(r7.kinds.length&&r7.kinds.every(x=>x==='heart'),'심장을 꿰뚫으면 죽음 글도 심장 ('+r7.kinds.join(',')+')');

 // 8. 대화가 열려 있거나 막 닫힌 때 또 누르면 겹쳐 열리지 않음
 const r8 = await p.evaluate(()=>{ const src = String(encTalk), ck = String(encClick); const btn = [...document.querySelectorAll('script')].some(s => /if \(b\.dataset\.ctalk\)\{ if \(performance\.now\(\) - talkShutT >= 450\) encTalk\(\); return; \}/.test(s.textContent));
   return { open: /if \(TK\) return;/.test(src) && !/talkShutT/.test(src), click: /if \(performance\.now\(\) - talkShutT >= 450\) encTalk\(E\);/.test(ck), btn, close: /talkShutT = performance\.now\(\)/.test(String(talkClose)) }; });
 console.log('    대화 막이', JSON.stringify(r8));
 ok(r8.open&&r8.click&&r8.btn&&r8.close,'만남 대화: 열려 있으면 다시 열지 않음 · 막 닫힌 (0.45초) 누름은 판 클릭 · 💬 단추에서 막음');

 // 9. 노라 · 세르파 글
 const r9 = await p.evaluate(()=>({ nora: MNPC8.nora.seen, serpa: (r8BossIntro('serpa', 0) || []).map(l => l.narr || l.t).join(' / ') }));
 console.log('    글', JSON.stringify(r9));
 ok(!/\(싸움 동안/.test(r9.nora)&&/아무도 보지 못했다/.test(r9.nora),'노라: 메모 같은 괄호 글 대신 이야기 글');
 ok(/모이고 엉기면/.test(r9.serpa),'세르파 소개: 조직은 싸우면서 자람 ("모이고 엉기면 …")');

 // 10. 늦게 띄우는 것 (맵에 들어선 나레이션 · 알림) 은 건 때의 맵이 그대로일 때만
 const r10 = await p.evaluate(async ()=>{ __mk([['카리우스',0,5,10],['검기사',1,20,10]]); const out = []; ldAfter(() => out.push('같은 맵'), 0); await new Promise(r => setTimeout(r, 80)); ldAfter(() => out.push('앞 맵'), 0); __mk([['카리우스',0,5,10],['검기사',1,20,10]]); await new Promise(r => setTimeout(r, 80)); return out; });
 ok(JSON.stringify(r10)==='["같은 맵"]','늦게 띄우는 나레이션 · 알림: 맵이 바뀌면 앞 맵 것은 버림 ('+JSON.stringify(r10)+')');

 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8730D OK'); await b.close(); process.exit(fails ? 1 : 0); })();
