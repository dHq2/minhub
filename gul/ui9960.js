// v9.9.6 UI 시험 — ui9960.js v1.1 (v1.1: v9.9.9 보호 = 대장의 보호받을이 — 대장을 누름 · 종류 바꾸기 · 대장을 골라 풀면 보호받을이도 · v1.0: 횃불은 꺼진 채 시작 · 판 아래 막대 관계 단추 (전우조 · 대장 · 보호 · 풀기) · 대장을 골라 풀면 부하도 · 지켜지는 이를 골라 풀면 지키던 이도 · 대장 다시 누르면 풀림 · 보호 연결 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const r = await p.evaluate(()=>{ resetToEdit(); start(); const W=world; paused=true; const h=W.units.find(u=>u.hero), A=W.units.filter(x=>x.side===0&&x.alive&&!x.hero).slice(0,3); const [a,c,d]=A; const out={};
   out.torch = h&&h.torch ? h.torchOff : 'none';
   const btn=k=>document.querySelector(`#skbar [data-cmd="${k}"]`);
   sel=new Set([a.i]); hud(); renderSkillBar(W); out.bar=['mate','chief','prot'].map(k=>!!btn(k)); out.cut0=!!btn('relcut')===(relCount(W,[a])>0);
   btn('chief').click(); relApply(c.i); out.chief = a.chiefLk && a.sqLead===c.i;
   sel=new Set([d.i]); hud(); renderSkillBar(W); btn('chief').click(); relApply(c.i); out.chief2 = d.chiefLk && d.sqLead===c.i;
   sel=new Set([d.i]); hud(); renderSkillBar(W); btn('chief').click(); relApply(c.i); out.again = !d.chiefLk;   // 지금 대장을 다시 누름 → 풀림
   sel=new Set([c.i]); hud(); renderSkillBar(W); out.cut1=!!btn('relcut'); btn('relcut').click(); out.fol = !a.chiefLk && a.sqLead==null; out.toast=(document.querySelector('#toast')||{}).textContent||'';
   sel=new Set([a.i]); hud(); renderSkillBar(W); btn('prot').click(); relApply(d.i); out.prot = a.chiefLk&&a.sqLead===d.i&&a.chiefMode==='cover'&&coverU(a); out.kindTag=(document.querySelector('#skbar [data-cmd="prot"]')||{}).textContent||''; sel=new Set([a.i]); hud(); renderSkillBar(W); btn('chief').click(); relApply(d.i); out.swap = a.chiefLk&&a.chiefMode==='follow'&&!coverU(a); btn('prot').click(); relApply(d.i);
   sel=new Set([d.i]); hud(); renderSkillBar(W); btn('relcut').click(); out.protCut = !a.chiefLk;
   draw(); return out; });
 console.log('    ', JSON.stringify(r));
 ok(r.torch===true,'횃불은 꺼진 채 시작'); ok(r.bar.every(Boolean),'판 아래 막대에 전우조 · 대장 · 보호'); ok(r.cut0,'풀기 단추는 풀 관계가 있을 때만');
 ok(r.chief&&r.chief2,'대장 연결 (막대에서)'); ok(r.again,'지금 대장을 다시 누르면 풀림'); ok(r.cut1&&r.fol&&/따를이/.test(r.toast),'대장을 골라 풀면 따를이도 풀림 (알림에 따를이)');
 ok(r.prot,'보호 = 대장의 보호받을이 (막대에서 · 대장을 누름)'); ok(r.swap,'같은 대장에게 대장 (따를이) 로 다시 누르면 종류가 바뀜'); ok(r.protCut,'대장을 골라 풀면 보호받을이도 풀림');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
