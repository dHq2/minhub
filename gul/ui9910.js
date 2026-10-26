// v9.9.1 UI 시험 — ui9910.js v1.1 (v1.1: v9.9.9 보호 = 대장의 보호받을이 (대장을 누름) · v1.0: 🛡 보호 단추 → 지킬 아군 누름 → protOf · 관계 표시 · 다시 누르면 풀림 · 관계 풀기 · 막기 자동 단추 · 인주를 부하로 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const r = await p.evaluate(()=>{ resetToEdit(); start(); const W=world; paused=true; const A=W.units.filter(u=>u.side===0&&u.alive); const g=A.find(u=>u.canGuard&&!u.hero), t=A.find(u=>u!==g&&!u.hero), h=A.find(u=>u.hero);
   sel=new Set([g.i]); hud(); document.querySelector('#orders [data-ord="prot"]').click(); const pick=relPick; relApply(t.i); const on=g.chiefLk&&g.sqLead===t.i&&coverU(g); sel=new Set([g.i]); hud(); const tag=(document.querySelector('#orders .rels')||{}).textContent||'';
   sel=new Set([g.i]); hud(); document.querySelector('#orders [data-ord="prot"]').click(); relApply(t.i); const off=!g.chiefLk;
   sel=new Set([g.i]); hud(); const gb=(document.querySelector('#orders [data-ord="guard"]')||{}).textContent||''; document.querySelector('#orders [data-ord="guard"]').click(); const goff=g.guardOff===true;
   sel=new Set([h.i]); hud(); document.querySelector('#orders [data-ord="chief"]').click(); relApply(g.i); const hc=h.chiefLk&&h.sqLead===g.i;
   return { pick, on, tag, off, gb, goff, hc }; });
 console.log('    ', JSON.stringify(r).slice(0,400));
 ok(r.pick==='prot'&&r.on,'보호 연결 (대장의 보호받을이)'); ok(/보호받을이/.test(r.tag),'관계 표시 (🛡 ~의 보호받을이)'); ok(r.off,'같은 대장 다시 → 풀림'); ok(/막기 자동/.test(r.gb)&&r.goff,'막기 자동 → 누르면 풀어 둠'); ok(r.hc,'인주도 부하가 됨');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
