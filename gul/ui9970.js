// v9.9.7 UI 시험 — ui9970.js v1.0 (공식 부대장 없앰: 옛 저장 (노먼 부대장 · 2편대 · 기본값으로 생긴 노먼의 부하) 은 한 번 정리 · 손으로 맺은 다른 대장 관계는 그대로 · 판에 직책 없음 · 배치 칸에 부대장 체크 없음 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 await p.evaluate(()=>{ const N=n=>S.units.find(u=>u.name===n); N('노먼').rank='부대장'; N('노먼').sq='B'; N('청광묵').sq='B'; N('친칠라').sq='B'; N('친칠라').chiefNm='노먼'; N('레베카').chiefNm='카리우스'; delete S.v997r; save(); });
 await p.reload(); await p.waitForTimeout(2800);
 const r = await p.evaluate(()=>{ const N=n=>S.units.find(u=>u.name===n); const o={ rank: S.units.filter(u=>u.rank).length, sq: S.units.filter(u=>u.side===0&&u.sq==='B').length, g: relChiefName(N('청광묵')), c: relChiefName(N('친칠라')), r: relChiefName(N('레베카')), toast:(document.querySelector('#toast')||{}).textContent||'' };
   start(); const W=world; o.wr = W.units.filter(u=>u.rank).length; o.rl = W.units.find(u=>u.name==='레베카').sqLead===W.units.find(u=>u.name==='카리우스').i;
   showTab('place'); resetToEdit(); selId=N('노먼').id; renderSel(); o.chk = !!document.getElementById('selSqLead'); return o; });
 console.log('    ', JSON.stringify(r));
 ok(r.rank===0&&r.sq===0,'옛 저장의 직책 · 2편대가 지워짐'); ok(r.g===''&&r.c==='','기본값으로 생긴 노먼의 부하 관계는 풀림'); ok(r.r==='카리우스'&&r.rl,'손으로 맺은 다른 대장 관계 (레베카 → 카리우스) 는 그대로');
 ok(r.wr===0,'판에 직책 없음'); ok(!r.chk,'배치 칸에 부대장 체크 없음'); ok(/부대장/.test(r.toast),'알림 '+r.toast.slice(0,60));
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
