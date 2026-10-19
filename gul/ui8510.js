// v8.5.1 UI 시험 — ui8510.js v1.0 (여정 목록: 인카운터 탭에 30층 여정 (층 표 29줄 · 보스 · 정예 · 만남 · 히든 적뢰 · 결승) · 설계 칸에 여정 인물 (세르파 · 적뢰 · 굴란 …) · 누르면 붓 · 판에 놓기 · 특성 탭 명단 · 휴대폰 가로 넘침 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); await ctx.addInitScript('window.__askAuto=true'); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.dismiss());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 console.log('== '+vw.nm);
 const e = await p.evaluate(()=>{ setMode('train'); renderEncTab(); const el=$('pane-enc'), t=el.textContent; const rows=[...el.querySelectorAll('table')].find(tb=>/스타디움/.test(tb.textContent)&&/하수구/.test(tb.textContent)); return { floors: rows ? rows.querySelectorAll('tbody tr').length : 0, boss: /슬라임의 왕 세르파/.test(t)&&/테이론/.test(t)&&/삼신의 심판/.test(t), elite: /헌팅나이프/.test(t)&&/15M 거인병사/.test(t), enc: /지식의 저주/.test(t)&&/관리자/.test(t), jr: /히든보스 적뢰/.test(t), fin: /30층 결승/.test(t), old: /공통 전투/.test(t) }; });
 console.log('    인카운터', JSON.stringify(e)); ok(e.floors===29,'30층 여정 층 표 (2 ~ 30층)'); ok(e.boss&&e.elite&&e.enc,'보스 · 정예 · 만남'); ok(e.jr&&e.fin,'히든 적뢰 · 결승'); ok(e.old,'1F 목록은 그대로');
 const d = await p.evaluate(()=>{ renderDesigns(); const box=$('designBox'), sec=box.querySelector('.r8dsg'), keys=[...(sec?sec.querySelectorAll('[data-dsg]'):[])].map(b=>b.dataset.dsg); const main=[...box.querySelectorAll('.dgrid')][0]; return { n: keys.length, has: ['세르파','굴란','튤린','적뢰','테이론','헬바 로젤'].filter(k=>keys.includes(k)), mainRun: main ? [...main.querySelectorAll('[data-dsg]')].some(b=>b.dataset.dsg==='세르파') : null, w: box.scrollWidth, cw: box.clientWidth }; });
 console.log('    설계 칸', JSON.stringify(d)); ok(d.n>=40&&d.has.length===6,'설계 칸에 여정 인물 '+d.n+' (세르파 · 굴란 · 튤린 · 적뢰 · 테이론 · 헬바 로젤)'); ok(d.mainRun===false,'기본 칸과 따로 묶음'); ok(d.w<=d.cw+2,'가로 넘침 없음');
 const pl = await p.evaluate(()=>{ resetToEdit(); const b=document.querySelector('#designBox [data-dsg="세르파"]'); b.click(); const br=brush&&brush.design; const n0=S.units.length; const d=designByKey('세르파'); const u=fromDesign(d, 1); u.x=5.5; u.y=5.5; S.units.push(u); const tp=traitPeople().map(x=>x.p.name); return { br, ok: S.units.length===n0+1, name: u.name, tr: (u.traits||[]).includes('군주'), tp: tp.includes('세르파')&&tp.includes('적뢰') }; });
 console.log('    붓', JSON.stringify(pl)); ok(pl.br==='세르파','누르면 그 인물이 붓'); ok(pl.ok&&pl.tr,'여정 설계로 판에 놓기 ([군주])'); ok(pl.tp,'특성 탭 명단에도');
 const st = await p.evaluate(()=>{ start(); const W=world, s=W.units.find(u=>u.name==='세르파'); return { s: !!s, side: s&&s.side }; }); ok(st.s&&st.side===1,'훈련장 판에서 세르파가 섬');
 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 await ctx.close(); }
 console.log(fails ? 'FAIL '+fails : 'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
