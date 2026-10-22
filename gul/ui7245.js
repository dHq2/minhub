// v7.24.5 UI 시험 — ui7245.js v1.3 (v1.3: v8.7.2 처음 동료 일곱 (뽑기 셋) · v1.2: 판 위의 확인 창 — 자동 시험은 __askAuto 로 바로 '예' · v1.1: 첫 화면에서 ▶ 전투 시작 = 프롤로그 시작 · 오른쪽 안내 글 · 스토리 · 훈련장: 처음 고르기 · 머리글 단추 · 탭과 단추가 모드마다 · 스토리 첫 화면 · 프롤로그 시작 · 싸우다 훈련장으로 (맡겨 둠) · 돌아오면 그 맵 · 기록 · 다시 열어도 모드 그대로 · 모바일 조작판 · 더 보기)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const vis = (p, sel) => p.evaluate(s=>{ const e=document.querySelector(s); return !!(e && e.offsetParent!==null && getComputedStyle(e).display!=='none'); }, sel);
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 console.log('  ['+vw.nm+']');
 // 1) 자동 시험은 훈련장으로 열림 (고르기 창 없음)
 const a = await p.evaluate(()=>({ mode:S.mode, body:document.body.className, pick:!document.getElementById('mPick').hidden, home:!document.getElementById('sHome').hidden, n:S.units.length }));
 ok(a.mode==='train'&&/train/.test(a.body)&&!a.pick&&!a.home,'처음: 훈련장 (자동 시험은 고르기 창 없이)');
 if (!vw.mob){ ok(await vis(p,'.tab[data-tab="place"]')&&await vis(p,'.tab[data-tab="rules"]')&&!(await vis(p,'.tab[data-tab="story"]')),'훈련장 탭: 배치 · 수치 (이야기 없음)');
   ok(await vis(p,'#modeSeg [data-mode="story"]')&&await vis(p,'#modeSeg [data-mode="train"]'),'머리글에 📖 스토리 · 🛠 훈련장'); }
 // 2) 처음 고르기 창 → 스토리
 await p.evaluate(()=>mPickShow()); await p.waitForTimeout(200);
 ok(await vis(p,'#mPick .mcard[data-mp="story"]')&&await vis(p,'#mPick .mcard[data-mp="train"]'),'처음 고르기: 스토리 · 훈련장 카드');
 if (vw.mob) await p.screenshot({path:'_s7245_pick_mo.png'}); else await p.screenshot({path:'_s7245_pick.png'});
 await p.click('#mPick .mcard[data-mp="story"]'); await p.waitForTimeout(300);
 const b1 = await p.evaluate(()=>({ mode:S.mode, pick:!document.getElementById('mPick').hidden, home:!document.getElementById('sHome').hidden, tab:(document.querySelector('.tab.on')||{}).dataset.tab, start:!!document.querySelector('#sHome [data-sh="start"]') }));
 console.log('     ',JSON.stringify(b1));
 ok(b1.mode==='story'&&!b1.pick&&b1.home&&b1.start&&b1.tab==='story','스토리 → 판 위 첫 화면 (▶ 프롤로그 시작) · 이야기 탭');
 if (!vw.mob){ ok(!(await vis(p,'.tab[data-tab="place"]'))&&!(await vis(p,'.tab[data-tab="rules"]'))&&!(await vis(p,'.tab[data-tab="log"]'))&&await vis(p,'.tab[data-tab="story"]'),'스토리 탭: 이야기 · 전투 · 특성만');
   ok(!(await vis(p,'label[for="seeAll"]')),'스토리엔 모두 보기 없음'); await p.screenshot({path:'_s7245_home.png'}); }
 else { await p.screenshot({path:'_s7245_home_mo.png'}); const d = await p.evaluate(()=>({ ss:!!document.querySelector('#dPlay [data-dk="sstart"]'), st:!!document.querySelector('#dPlay [data-dk="start"]'), chips:document.querySelectorAll('#dChips .dchip').length }));
   ok(d.ss&&!d.st&&d.chips===0,'모바일 조작판: 📖 프롤로그 시작 (전투 시작 · 칩 없음)'); }
 // 3) 첫 화면에서 ▶ 전투 시작 (Space) = 프롤로그 시작 · 오른쪽 안내 글
 if (!vw.mob) ok(/스토리/.test(await p.evaluate(()=>document.getElementById('turnInfo').textContent))&&!/배치 중이에요/.test(await p.evaluate(()=>document.getElementById('turnInfo').textContent)),'오른쪽 안내 글도 스토리 말로');
 const n0 = a.n;
 const c0 = await p.evaluate(()=>{ if (MOB) document.querySelector('#dPlay [data-dk="sstart"]').click(); else start(); return !!world; }); await p.waitForTimeout(200);
 ok(!c0,'훈련장 판으로 싸움이 열리지 않음');
 ok(!(await p.evaluate(()=>document.getElementById('gacha').hidden))&&(await p.evaluate(()=>document.getElementById('sHome').hidden)),'시작 → 뽑기 연출 (첫 화면은 숨음)');
 await p.evaluate(()=>{ document.getElementById('gAll').click(); document.getElementById('gGo').click(); }); await p.waitForTimeout(500);
 const d1 = await p.evaluate(()=>({ s:S.camp&&S.camp.s, w:!!world, bar:!document.getElementById('campBar').hidden, W:S.W, H:S.H, party:S.units.filter(u=>u.side===0).length }));
 console.log('     ',JSON.stringify(d1)); ok(d1.s===1&&d1.w&&d1.bar&&d1.party===7,'1S — 인주 · 확정 셋 · 뽑기 둘');
 // 5) 싸우다 훈련장으로: 프롤로그는 맡겨 둠 · 훈련장 판이 돌아옴
 await p.evaluate(()=>{ mode='run'; paused=false; for (let i=0;i<40;i++) stepWorld(world,1/30); });
 await p.evaluate(()=>setMode('train')); await p.waitForTimeout(300);
 const e1 = await p.evaluate(()=>({ mode:S.mode, camp:!!S.camp, story:!!(S.story&&S.story.camp), n:S.units.length, bar:!document.getElementById('campBar').hidden, home:!document.getElementById('sHome').hidden, w:!!world, lbl:document.getElementById('campBtn').textContent }));
 console.log('     ',JSON.stringify(e1));
 ok(e1.mode==='train'&&!e1.camp&&e1.story&&e1.n===n0&&!e1.bar&&!e1.home&&!e1.w,'훈련장으로 — 프롤로그는 맡겨 두고 훈련장 판 그대로 (캠페인 띠 없음)');
 ok(/진행 중/.test(e1.lbl),'층 칸 단추: 📖 스토리로 (진행 중인 프롤로그)');
 const tr = await p.evaluate(()=>{ S.draft.done=true; start(); const r={ w:!!world, camp:!!(world&&world.camp) }; resetToEdit(); return r; });
 ok(tr.w&&!tr.camp,'훈련장 전투는 캠페인 판이 아님');
 // 6) 다시 스토리 → 그 맵 (들어온 때부터)
 await p.evaluate(()=>setMode('story')); await p.waitForTimeout(300);
 const f1 = await p.evaluate(()=>({ s:S.camp&&S.camp.s, story:!!S.story, W:S.W, H:S.H, party:S.units.filter(u=>u.side===0).length, home:!document.getElementById('sHome').hidden, go:!!document.querySelector('#pane-story [data-sh="go"]'), bak:!!S.campBak }));
 console.log('     ',JSON.stringify(f1));
 ok(f1.s===1&&!f1.story&&f1.W===d1.W&&f1.H===d1.H&&f1.party===7&&!f1.home&&f1.go&&f1.bak,'스토리로 돌아옴 — 1S 그 맵 · 동료 그대로 · 이야기 탭에 ▶ 이 맵 시작');
 await p.evaluate(()=>document.querySelector('#pane-story [data-sh="go"]').click()); await p.waitForTimeout(300);
 ok(await p.evaluate(()=>!!(world&&world.camp)),'▶ 이 맵 시작 → 캠페인 판');
 if (vw.mob){ await p.evaluate(()=>toggleMenu(true)); await p.waitForTimeout(150);
   const m = await p.evaluate(()=>({ mode:!!document.querySelector('#dMenu [data-dm="mode"][data-v="train"]'), see:!!document.querySelector('#dMenu [data-dm="see"]'), floor:!!document.querySelector('#dMenu [data-dm="floor"]') }));
   ok(m.mode&&!m.see&&!m.floor,'더 보기: 모드 단추 · 스토리엔 모두 보기 · 층 없음'); await p.screenshot({path:'_s7245_menu_mo.png'}); await p.evaluate(()=>toggleMenu(false)); }
 // 7) 끝 → 기록 · 첫 화면
 await p.evaluate(()=>{ world.over=true; world.result='lose'; S.camp.why=''; campEnd('wipe'); }); await p.waitForTimeout(200);
 const g1 = await p.evaluate(()=>({ log:(S.storyLog||[]).length, lbl:(document.getElementById('campDone')||{}).textContent }));
 ok(g1.log===1&&/프롤로그 끝내기/.test(g1.lbl||''),'끝 창: 프롤로그 끝내기 · 기록 하나');
 await p.evaluate(()=>document.getElementById('campDone').click()); await p.waitForTimeout(300);
 const h1 = await p.evaluate(()=>({ camp:!!S.camp, home:!document.getElementById('sHome').hidden, last:(document.querySelector('#sHome .slast')||{}).textContent||'', n:S.units.length, rec:(document.getElementById('pane-story').textContent||'').includes('지난 프롤로그') }));
 console.log('     ',JSON.stringify(h1));
 ok(!h1.camp&&h1.home&&/1S 에서 전멸/.test(h1.last)&&h1.n===n0&&h1.rec,'끝내면 스토리 첫 화면 · 지난 프롤로그 기록 (1S 에서 전멸)');
 // 8) 다시 열어도 모드 그대로 · 고르기 창 없음
 await p.reload(); await p.waitForTimeout(1000);
 const i1 = await p.evaluate(()=>({ mode:S.mode, home:!document.getElementById('sHome').hidden, pick:!document.getElementById('mPick').hidden, log:(S.storyLog||[]).length }));
 ok(i1.mode==='story'&&i1.home&&!i1.pick&&i1.log===1,'다시 열면 스토리 그대로 (고르기 창 없음 · 기록 남음)');
 // 9) 머리글 단추로 훈련장 (PC)
 if (!vw.mob){ await p.click('#modeSeg [data-mode="train"]'); await p.waitForTimeout(300);
   const j1 = await p.evaluate(()=>({ mode:S.mode, home:!document.getElementById('sHome').hidden, tab:(document.querySelector('.tab.on')||{}).dataset.tab }));
   ok(j1.mode==='train'&&!j1.home&&j1.tab!=='story','머리글 🛠 훈련장 → 첫 화면 사라짐'); }
 ok(!errs.length,'페이지 오류 없음 '+errs.slice(0,3).join(' | '));
 await ctx.close(); }
 await b.close(); console.log(fails?`${fails} FAIL`:'ALL UI7245 OK'); })();
