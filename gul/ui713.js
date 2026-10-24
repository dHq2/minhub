// v7.13 UI 시험 — ui713.js v1.1 (v1.1: v9.1.0 — 편대 줄 → 대장 · 전우 줄 · 기본 배치 편대 · 편대 줄 · 2편대장 바꾸기 · 그물 · 0% 알림)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:800}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const sq = await p.evaluate(()=>S.units.filter(u=>u.side===0).map(u=>[u.name,u.sq||'A',u.rank||''])); console.log('    기본 배치', JSON.stringify(sq));
 ok(sq.some(([n,s])=>n==='청광묵'&&s==='B')&&sq.some(([n,s,r])=>n==='노먼'&&s==='B'&&r==='부대장'),'기본 배치에 청광묵 · 2편대 (노먼 · 청광묵)');
 await p.evaluate(()=>{ showTab('place'); const g=S.units.find(u=>u.name==='청광묵'); selId=g.id; renderSel(); }); await p.waitForTimeout(200);
 const row = await p.evaluate(()=>{ const s=document.getElementById('selRelChief'); return s ? s.options[s.selectedIndex].text : ''; }); console.log('    대장 줄:', row); ok(row==='노먼','고른 아군의 대장 줄 (청광묵 → 노먼)');
 // 레베카를 2편대장으로
 await p.evaluate(()=>{ const r=S.units.find(u=>u.name==='레베카'); selId=r.id; renderSel(); }); 
 await p.evaluate(()=>{ const r=S.units.find(u=>u.name==='레베카'); selId=r.id; renderSel(); }); const lab = await p.evaluate(()=>{ const c=document.getElementById('selSqLead'); return c ? c.closest('label').innerText : ''; }); console.log('    ', lab);
 await p.click('#selSqLead'); await p.waitForTimeout(150);
 const r2 = await p.evaluate(()=>S.units.filter(u=>u.side===0).map(u=>[u.name,u.sq||'A',u.rank||''])); console.log('    바꾼 뒤', JSON.stringify(r2));
 ok(r2.find(x=>x[0]==='레베카')[2]==='부대장'&&r2.find(x=>x[0]==='노먼')[2]==='','2편대장은 하나 (레베카로 바뀌고 노먼은 직책 없음)'); ok(/지휘 D/.test(lab),'지휘 스킬 없는 편대장은 D 로 보임');
 // 되돌리고 판 시작
 await p.evaluate(()=>{ for(const u of S.units){ if(u.name==='노먼') u.rank='부대장'; if(u.name==='레베카'){ u.rank=''; u.sq='A'; } } changed(); start(); }); await p.waitForTimeout(300); await p.click('#contBtn').catch(()=>{}); await p.waitForTimeout(1500);
 const w = await p.evaluate(()=>{ const n=world.units.find(u=>u.name==='노먼'), g=world.units.find(u=>u.name==='청광묵'); return { lead: g.sqLead===n.i, mesh: !!(world.mesh0&&world.mesh0.edges.length) }; }); console.log('    판', JSON.stringify(w));
 ok(w.lead,'판에서 청광묵이 노먼 편대'); ok(w.mesh,'지휘망 그물 줄이 있음');
 await p.screenshot({path:'ui713.png'});
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs));
 console.log(fails?`${fails} FAIL`:'ALL UI713 OK'); await b.close(); })();
