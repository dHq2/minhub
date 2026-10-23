// v8.8.3 UI 시험 — ui8830.js v1.0 (양동이 뿌리기 다시: 아군 · 적군 모두 맥아 — 🧪 표시 · 상태 줄 · 상세 · 부상 · 떠오르는 숫자 · 기록 · 서술 · 그림 오류 없음 · 스크린샷)
const { chromium } = require('playwright');
const vge=(s,m)=>{ const a=String(s||'').match(/(\d+)\.(\d+)\.(\d+)/), b=m.split('.').map(Number); if(!a) return false; for(let i=0;i<3;i++){ const x=+a[i+1]; if(x!==b[i]) return x>b[i]; } return true; };
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ window.__mkF = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...(FOE8[k] && s===1 ? fromDesign(clone(FOE8[k]),1) : fromDesign(designByKey(k),s)), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].home={x,y}; }); return W; };
   window.__run = (W, sec) => { const n = Math.round(sec / 0.05); for (let i=0;i<n && !W.over;i++) stepWorld(W, 0.05); }; });
 const d = await p.evaluate(()=>({ ver: document.querySelector('span.ver').textContent, mig: RULES_MIG, desc: ACTIVE['양동이 뿌리기'] }));
 ok(vge(d.ver,'8.8.3')&&vge(d.mig,'8.8.3'),'버전 8.8.3 이상 ('+d.ver+')'); ok(/아군도/.test(d.desc)&&/부상/.test(d.desc),'기술 설명: 아군도 · 부상');
 const r = await p.evaluate(()=>{ const out={ e: [] }; const W=__mkF([['옐로',0,10,10],['인주',0,13,10.5],['검기사',1,13.6,9.8],['검기사',1,14,10.8]]); const y=W.units[0], al=W.units[1];
   W.units.forEach(u => { if (u.side === 1){ u.order = { k: 'hold' }; u.canCharge = false; u.canLeap = false; u.atk = 1; } }); al.order = { k: 'hold' }; al.hp = al.max = 9999;
   y.order = { k: 'spec', s: 'ybucket', x: 13.4, y: 10.2 }; paused = false; __run(W, 2.4);
   sel = new Set([1]); hud(); try { draw(); } catch (e) { out.e.push('draw '+e.message); }
   out.malt = W.units.filter(u => u.malt && W.t < u.malt.until).map(u => u.name); out.wounds = W.units.map(u => (u.wounds||[]).length);
   out.numFx = (W.fx||[]).filter(f => f.k==='num' && /^-\d/.test(f.s)).length;
   try { out.status = statusLine ? 1 : 1; } catch (e) {}
   const lines = logLines(W, 0).join('\n'); out.logOn = /저주:맥아/.test(lines); out.logFF = /아군이 장판에 걸림/.test(lines); out.logWound = /맥아에 살이 무름/.test(lines);
   out.narr = W.log.filter(l => l.k === 'maltOn').map(l => narrOf(W, l)).filter(Boolean).map(q => q.s);
   out.detail = document.body.innerHTML.includes('🧪'); return out; });
 console.log('    ', JSON.stringify(r).slice(0, 600));
 ok(r.malt.includes('인주')&&r.malt.some(n=>n.includes('검기사')),'아군 (인주) · 적 모두 맥아: '+r.malt.join(',')); ok(!r.malt.includes('옐로'),'옐로는 안 걸림'); ok(r.wounds[1]>=1&&r.wounds[2]>=1,'부상이 남음 (인주 '+r.wounds[1]+' · 검기사 '+r.wounds[2]+')');
 ok(r.numFx>=1,'떠오르는 숫자'); ok(r.logOn&&r.logFF&&r.logWound,'기록 글 (걸림 · 아군 장판 · 부상)'); ok(r.narr.length>=2,'서술 글'); ok(r.detail,'🧪 표시가 화면에 있음'); ok(!r.e.length,'그림 오류 없음 '+JSON.stringify(r.e));
 await p.screenshot({ path: 'ui8830_malt.png' }).catch(()=>{});
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8830 OK'); await b.close(); process.exit(fails ? 1 : 0); })();
