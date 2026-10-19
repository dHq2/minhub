// v8.2.1 UI 시험 — ui8210.js v1.0 (브라우저 확인 · 입력 창이 막힌 화면 (아티팩트) 그대로: 모든 dialog 를 거절하고 confirm · prompt 를 부르면 실패로 셈.
//   그만두기 (캠페인 띠 · 여정 지도 · 첫 화면) · 아니오 · Esc · Enter · 새로 시작 · 모드 바꾸기 · 아군 두고 가기 · 동료 떠나보냄 · 층 저장 (입력) · PC · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const BLOCK = `window.__dlg=0; window.confirm=()=>{ window.__dlg++; return false; }; window.prompt=()=>{ window.__dlg++; return null; }; window.alert=()=>{ window.__dlg++; };`;
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); await ctx.addInitScript(BLOCK); const p=await ctx.newPage(); const errs=[]; let dlg=0; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>{ dlg++; d.dismiss(); });
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 console.log('== '+vw.nm);
 const tap = async sel => { if (vw.mob) await p.tap(sel); else await p.click(sel); await p.waitForTimeout(80); };
 const box = () => p.evaluate(()=>{ const el=document.getElementById('askBox'); return el ? el.querySelector('p').textContent : null; });
 const startStory = () => p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); return !!S.camp; });
 // 1. 캠페인 띠 그만두기 — 아니오 · 예
 await startStory(); await p.waitForTimeout(300); await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } if (typeof ldEnd==='function') ldEnd(true); campBarRender(true); });
 await tap('#campBar [data-cquit]'); const b1 = await box(); ok(/그만둘까요/.test(b1||''),'캠페인 띠 그만두기 → 판 위의 확인 창 ('+(b1||'없음').slice(0,20)+')');
 await tap('#askBox [data-ask="0"]'); const s1 = await p.evaluate(()=>({ camp: !!S.camp, box: !!document.getElementById('askBox') })); ok(s1.camp&&!s1.box,'아니오 → 그대로');
 await tap('#campBar [data-cquit]'); await tap('#askBox [data-ask="1"]'); const s2 = await p.evaluate(()=>({ camp: !!S.camp, mode })); ok(!s2.camp,'예 → 프롤로그를 그만둠 (캠페인 없음)');
 // 2. Esc · Enter
 await startStory(); await p.waitForTimeout(300); await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } if (typeof ldEnd==='function') ldEnd(true); campBarRender(true); });
 if (!vw.mob){ await tap('#campBar [data-cquit]'); await p.keyboard.press('Escape'); const e1 = await p.evaluate(()=>({ camp: !!S.camp, box: !!document.getElementById('askBox') })); ok(e1.camp&&!e1.box,'Esc → 아니오');
   await tap('#campBar [data-cquit]'); await p.keyboard.press('Enter'); const e2 = await p.evaluate(()=>!!S.camp); ok(!e2,'Enter → 예'); await startStory(); await p.waitForTimeout(300); await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } if (typeof ldEnd==='function') ldEnd(true); }); }
 // 3. 아군 두고 가기 (넘어간 이가 있을 때)
 const ab = await p.evaluate(async ()=>{ const W=world; const u=W.units.find(x=>x.side===0&&x.alive&&!x.hero); leaveMap(W,u,'up'); campBarRender(true); await new Promise(r=>setTimeout(r,50)); return !!document.querySelector('#campBar [data-cabandon]'); });
 if (ab){ await tap('#campBar [data-cabandon]'); const b3 = await box(); ok(/두고 갈까요/.test(b3||''),'아군 두고 가기 → 확인 창'); await tap('#askBox [data-ask="0"]'); const a3 = await p.evaluate(()=>world.units.filter(u=>u.side===0&&u.gone==='left').length); ok(a3===0,'아니오 → 아무도 두고 가지 않음'); }
 // 4. 새로 시작 (진행 중) — 확인 뒤 다시
 const ns = await p.evaluate(async ()=>{ resetToEdit(); campStart(); await new Promise(r=>setTimeout(r,50)); return !!document.getElementById('askBox'); }); ok(ns,'진행 중에 새로 시작 → 확인 창');
 await tap('#askBox [data-ask="1"]'); await p.waitForTimeout(200); const ns2 = await p.evaluate(()=>!document.getElementById('gacha').hidden || !!world); ok(ns2,'예 → 새 프롤로그 (뽑기)');
 await p.evaluate(()=>{ if (!document.getElementById('gacha').hidden){ document.getElementById('gAll').click(); document.getElementById('gGo').click(); } while (TK){ if (TK.timer) talkDone(); talkAdv(); } if (typeof ldEnd==='function') ldEnd(true); });
 // 5. 모드 바꾸기 (판 중간)
 const md = await p.evaluate(async ()=>{ world.t=3; const r=setMode('train'); await new Promise(r=>setTimeout(r,50)); return { r, box: !!document.getElementById('askBox') }; }); ok(md.r===false&&md.box,'판 중간에 훈련장으로 → 확인 창');
 await tap('#askBox [data-ask="1"]'); const md2 = await p.evaluate(()=>S.mode); ok(md2==='train','예 → 훈련장');
 // 6. 여정 지도 그만두기 · 떠나보냄
 await p.evaluate(()=>setMode('story')); await p.waitForTimeout(100);
 await p.evaluate(()=>{ if (!S.camp || S.camp.end){ campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); } const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(300); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 await tap('#run8 [data-r8="party"]'); const n0 = await p.evaluate(()=>R8S().party.length); await tap('#run8 [data-r8kick]'); const bk = await box(); ok(/떠나보낼까요/.test(bk||''),'동료 떠나보냄 → 확인 창'); await tap('#askBox [data-ask="1"]'); const n1 = await p.evaluate(()=>R8S().party.length); ok(n1===n0-1,'예 → 한 명 떠남 ('+n0+' → '+n1+')');
 await tap('#run8 #r8pX'); await tap('#run8 [data-r8="quit"]'); const bq = await box(); ok(/여정을 그만둘까요/.test(bq||''),'여정 지도 그만두기 → 확인 창'); await tap('#askBox [data-ask="1"]'); const q2 = await p.evaluate(()=>({ camp: !!S.camp, map: !!document.getElementById('run8') && !document.getElementById('run8').hidden })); ok(!q2.camp&&!q2.map,'예 → 여정을 그만둠 · 지도 닫힘');
 // 7. 층 저장 (입력 창)
 if (!vw.mob){ const fs = await p.evaluate(async ()=>{ const b=document.getElementById('floorSave'); if (!b) return null; b.click(); await new Promise(r=>setTimeout(r,50)); return !!document.querySelector('#askBox input'); });
   if (fs !== null){ ok(fs,'층 저장 → 판 위의 입력 창'); await p.fill('#askBox input','시험층'); await p.keyboard.press('Enter'); const fl = await p.evaluate(()=>myFloors().some(f=>f.name==='시험층')); ok(fl,'이름을 넣고 Enter → 저장'); } }
 const d0 = await p.evaluate(()=>window.__dlg); ok(d0===0&&dlg===0,'브라우저 확인 · 입력 창은 한 번도 부르지 않음 ('+d0+' · '+dlg+')');
 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 await ctx.close(); }
 console.log(fails ? 'FAIL '+fails : 'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
