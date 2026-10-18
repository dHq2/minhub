// v7.26.2 UI 시험 — ui7262.js v1.0 (인카운터 목록 ▶: 확인 창 없이 · 지금 배치된 아군 그대로 (뽑기 없음) · 로딩 뒤 그 만남 / 그만두면 훈련장 배치 그대로 · 맡긴 스토리 프롤로그도 그대로 / 공통 전투 무리 · 상황 고르기)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); const dlg=[]; p.on('dialog',d=>{ dlg.push(d.message().slice(0,40)); d.accept(); });
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 // 진행 중인 스토리 프롤로그 하나 (맡겨질 것)
 const st0 = await p.evaluate(()=>{ setMode('story'); campStart({ direct: true }); const C=S.camp; C.s=2; const t0=C.t0; setMode('train'); return { t0, story: !!S.story, mode: S.mode }; });
 // 훈련장 배치: 인주 · 간두 · 모닝스타 · 딸기
 const dep = await p.evaluate(()=>{ const keep=['인주','간두','모닝스타','딸기']; S.units = S.units.filter(u=>u.side===1).concat(keep.map((k,i)=>({ ...fromDesign(designByKey(k),0), id: uid(), x: 6.5+i, y: 10.5 }))); rebuildMap(); changed(); return S.units.filter(u=>u.side===0).map(u=>u.name+'@'+u.x+','+u.y); });
 console.log('    배치', JSON.stringify(dep), JSON.stringify(st0));
 const n0 = dlg.length;
 const t1 = await p.evaluate(()=>{ document.querySelector('.tab[data-tab="enc"]').click(); document.querySelector('[data-etry="chin"]').click(); return 1; });
 await p.waitForTimeout(1200);
 const r1 = await p.evaluate(()=>{ for (let k=0;k<40&&TK;k++){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask) break; talkAdv(); } const C=S.camp; return { mode: S.mode, s: C&&C.s, test: !!(C&&C.test), party: (world&&world.units||[]).filter(u=>u.side===0).map(u=>u.name), npc: (encCur()||{}).npc, hero: (world.units.find(u=>u.hero)||{}).name, gacha: !document.getElementById('gacha').hidden }; });
 console.log('    ▶ 친칠라', JSON.stringify(r1), '창', dlg.slice(n0));
 ok(dlg.length===n0,'확인 창 없이 바로 들어감');
 ok(r1.mode==='story'&&r1.s===3&&r1.test&&r1.npc==='chin'&&!r1.gacha,'로딩 뒤 3S 친칠라 만남으로 (뽑기 없음)');
 ok(JSON.stringify(r1.party.slice().sort())===JSON.stringify(['인주','간두','모닝스타','딸기'].sort())&&r1.hero==='인주','아군은 지금 배치 그대로 ('+r1.party.join(' · ')+') · 대장 인주');
 // 그만두기 → 훈련장 배치 그대로 · 맡긴 프롤로그 그대로
 await p.evaluate(()=>{ const q=document.querySelector('#campBar [data-cquit]'); if (q) q.click(); else campQuit(); });
 await p.waitForTimeout(400);
 const r2 = await p.evaluate(()=>({ mode: S.mode, camp: !!S.camp, dep: S.units.filter(u=>u.side===0).map(u=>u.name+'@'+u.x+','+u.y), story: S.story ? { t0: S.story.camp.t0, s: S.story.camp.s } : null }));
 console.log('    그만두기', JSON.stringify(r2));
 ok(r2.mode==='train'&&!r2.camp&&JSON.stringify(r2.dep)===JSON.stringify(dep),'그만두면 훈련장 · 배치가 그대로 (자리까지)');
 ok(r2.story&&r2.story.t0===st0.t0&&r2.story.s===2,'맡겨 둔 스토리 프롤로그 (2S) 가 그대로 남음');
 const r3 = await p.evaluate(()=>{ setMode('story'); const o={ mode: S.mode, s: S.camp&&S.camp.s, t0: S.camp&&S.camp.t0 }; setMode('train'); return o; });
 ok(r3.s===2&&r3.t0===st0.t0,'스토리로 가면 그 프롤로그가 이어짐');
 // 공통 전투: 무리 · 상황을 골라 1S
 const n1 = dlg.length;
 await p.evaluate(()=>{ document.querySelector('.tab[data-tab="enc"]').click(); document.getElementById('encBtC').value='c2'; document.getElementById('encBtS').value='front'; document.querySelector('[data-etry="fight"]').click(); });
 await p.waitForTimeout(1200);
 const r4 = await p.evaluate(()=>({ s: S.camp&&S.camp.s, bt: S.camp&&S.camp.stages[1]&&S.camp.stages[1].bt, foes: world.units.filter(u=>u.side===1).map(u=>u.name).slice(0,3), party: world.units.filter(u=>u.side===0).length }));
 console.log('    ▶ 공통 전투', JSON.stringify(r4));
 ok(dlg.length===n1&&r4.s===1&&r4.bt&&r4.bt.c==='c2'&&r4.bt.s==='front'&&r4.party===4,'공통 전투: 고른 무리 (똥개 무리) · 상황 (정면 대치) · 배치 그대로 넷');
 // 시험 중에 다른 만남 ▶ — 바로 바뀜 · 프롤로그는 계속 맡겨진 채
 await p.evaluate(()=>{ setMode('train'); });
 const r5a = await p.evaluate(()=>({ mode: S.mode, story: S.story ? S.story.camp.t0 : null, camp: !!S.camp, dep: S.units.filter(u=>u.side===0).length }));
 ok(r5a.mode==='train'&&!r5a.camp&&r5a.story===st0.t0&&r5a.dep===4,'시험 맵에서 훈련장으로 가면 시험은 접히고 · 배치 넷 · 맡긴 프롤로그 그대로');
 await p.evaluate(()=>{ document.querySelector('.tab[data-tab="enc"]').click(); document.querySelector('[data-etry="odile"]').click(); });
 await p.waitForTimeout(1200); await p.evaluate(()=>{ for (let k=0;k<40&&TK;k++){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask) break; talkAdv(); } });
 const r5 = await p.evaluate(()=>({ s: S.camp&&S.camp.s, e3: S.camp&&S.camp.stages[3]&&S.camp.stages[3].e3, test: !!(S.camp&&S.camp.test), keep: !!(S.camp&&S.camp.test&&S.camp.test.keep) }));
 console.log('    다른 만남', JSON.stringify(r5a), JSON.stringify(r5));
 ok(r5.s===3&&r5.e3==='odile'&&r5.test&&r5.keep,'시험 맵에서 훈련장으로 가 다른 만남 ▶ (오딜의 방) — 프롤로그는 계속 맡겨진 채');
 ok(!errs.length,'오류 없음 '+errs.slice(0,2).join(' | '));
 await b.close(); console.log(fails?`${fails} FAIL`:'ALL UI7262 OK'); })();
