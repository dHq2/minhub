// v7.13 UI 시험 — ui713.js v1.2 (v1.2: v9.9.7 공식 부대장 · 2편대 기본값 없앰 — 기본은 인주 · 대장 고르기 상자로 노먼을 대장으로 · v1.1: v9.1.0 — 편대 줄 → 대장 · 전우 줄 · 기본 배치 편대 · 편대 줄 · 2편대장 바꾸기 · 그물 · 0% 알림)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:800}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const sq = await p.evaluate(()=>S.units.filter(u=>u.side===0).map(u=>[u.name,u.sq||'A',u.rank||''])); console.log('    기본 배치', JSON.stringify(sq));
 ok(!sq.some(([n,s,r])=>s==='B'||r),'기본 배치엔 직책 · 2편대 없음 (v9.9.7)');
 await p.evaluate(()=>{ showTab('place'); const g=S.units.find(u=>u.name==='청광묵'); selId=g.id; renderSel(); }); await p.waitForTimeout(200);
 const row = await p.evaluate(()=>{ const s=document.getElementById('selRelChief'); return s ? s.options[s.selectedIndex].text : ''; }); console.log('    대장 줄:', row); ok(/인주/.test(row),'고른 아군의 대장 줄 — 기본은 인주 ('+row+')');
 // 청광묵의 대장을 노먼으로 (고르기 상자)
 await p.selectOption('#selRelChief','노먼'); await p.waitForTimeout(150);
 const ch = await p.evaluate(()=>S.units.find(u=>u.name==='청광묵').chiefNm); ok(ch==='노먼','대장 고르기 → 노먼');
 const lab = await p.evaluate(()=>{ const r=S.units.find(u=>u.name==='레베카'); selId=r.id; renderSel(); const c=document.getElementById('selRelChief'); return c ? c.closest('.row').innerText : ''; }); console.log('    ', lab);
 ok(/지휘 D/.test(lab)&&!/부대장/.test(lab),'지휘 스킬 없는 이는 D 로 보임 · 부대장 체크 없음');
 await p.evaluate(()=>{ changed(); start(); }); await p.waitForTimeout(300); await p.click('#contBtn').catch(()=>{}); await p.waitForTimeout(1500);
 const w = await p.evaluate(()=>{ const n=world.units.find(u=>u.name==='노먼'), g=world.units.find(u=>u.name==='청광묵'); return { lead: g.sqLead===n.i&&g.chiefLk, mesh: !!(world.mesh0&&world.mesh0.edges.length) }; }); console.log('    판', JSON.stringify(w));
 ok(w.lead,'판에서 청광묵이 노먼의 부하'); ok(w.mesh,'지휘망 그물 줄이 있음');
 await p.screenshot({path:'ui713.png'});
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs));
 console.log(fails?`${fails} FAIL`:'ALL UI713 OK'); await b.close(); })();
