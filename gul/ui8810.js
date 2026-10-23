// v8.8.1 진형 폐기 UI 시험 — ui8810.js v1.1 (v1.1: 키 이벤트는 body 로 · v1.0: 대형 띠 · 편성 창 · W · D 없음 · 도움말에서 걷어냄 · 아군은 각자 명령 · 진형 버프 없음 · 조합 버프는 그대로 · 여정 판도 대형 없이)
const { chromium } = require('playwright');
const vge=(s,m)=>{ const a=String(s||'').match(/(\d+)\.(\d+)\.(\d+)/), b=m.split('.').map(Number); if(!a) return false; for(let i=0;i<3;i++){ const x=+a[i+1]; if(x!==b[i]) return x>b[i]; } return true; };
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ window.__mkF = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...(FOE8[k] && s===1 ? fromDesign(clone(FOE8[k]),1) : fromDesign(designByKey(k),s)), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); W.amb = 1; computeLight(W); markExplored(W); return W; };
   window.__run = (W, sec) => { const n = Math.round(sec / 0.05); for (let i=0;i<n && !W.over;i++) stepWorld(W, 0.05); }; });
 // 1) 버전 · 수치표 · 도움말
 const d = await p.evaluate(()=>({ ver: document.querySelector('span.ver').textContent, mig: RULES_MIG, on: rules.fbuf && rules.fbuf.on, kb: KB_GROUPS.flat(2).join(' '), foot: document.querySelector('footer').textContent }));
 ok(vge(d.ver,'8.8.1')&&vge(d.mig,'8.8.1'),'버전 8.8.1 이상 · 수치표 이전 8.8.1 이상 ('+d.ver+' · '+d.mig+')'); ok(d.on===0,'수치표 fbuf.on = 0');
 ok(!/모여|편성 창|깃발 —/.test(d.kb),'단축키 도움말에 대형 글 없음 (W · Shift + W · D)');
 // 2) 판: 대형 없음
 const r = await p.evaluate(()=>{ const W=__mkF([['인주',0,10,10],['레베카',0,11,10],['청광묵',0,10,11],['노먼',0,11,11],['검기사',1,40,10]]); const out={ e: [] };
   out.form = W.form === undefined; hud(); out.barHidden = $('fmbar').hidden; out.chipHidden = !$('fmChip') || $('fmChip').hidden;
   document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', bubbles: true })); out.winHidden = $('fmWin').hidden;
   document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', bubbles: true }));
   sel = new Set([0,1,2,3]); groupMove(selUnits(W), 20.3, 10.4, 'move');
   out.ords = W.units.filter(u => u.side === 0).map(u => u.order ? u.order.k + (u.order.form ? '/form' : '') : null);
   const ordN = W.units.filter(u => u.side === 0 && u.order).length;
   sel = new Set([2]); groupMove(selUnits(W), 30.5, 14.5, 'move'); const t = W.units[2].order;
   out.single = !!t && Math.abs(t.x - 30.5) < 1 && W.units[0].order && Math.abs(W.units[0].order.x - 30.5) > 3;
   try { draw(); } catch (e) { out.e.push(e.message); }
   paused = false; __run(W, 6); out.moved = W.units.slice(0,4).map(u => +Math.hypot(u.x - 10.5, u.y - 10.5).toFixed(1)); out.fb = W.units.some(u => u.fb); out.log = W.log.some(l => ['formForm','formWait','formSet','fbOn','form8Start'].includes(l.k));
   hud(); out.barHidden2 = $('fmbar').hidden; return out; });
 console.log('    ', JSON.stringify(r).slice(0, 500));
 ok(r.form,'판에 대형 없음 (W.form 없음)'); ok(r.barHidden&&r.chipHidden&&r.barHidden2,'대형 띠 · 칩 안 보임'); ok(r.winHidden,'D 를 눌러도 편성 창 안 열림');
 ok(r.ords.every(o=>o==='move'),'여럿을 골라 이동하면 모두 제 명령 (대형 표시 없음) — '+r.ords.join(',')); ok(r.single,'한 명만 골라 명령하면 그 사람만 움직임');
 ok(r.moved.every(m=>m>3),'모두 제 발로 감 ('+r.moved.join(',')+')'); ok(!r.fb&&!r.log,'진형 버프 · 대형 기록 없음'); ok(!r.e.length,'그림 오류 없음 '+JSON.stringify(r.e));
 // 3) 여정 (이야기) 판도 대형 없이
 const j = await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); return { form: world ? world.form === undefined : null, txt: !!document.querySelector('[data-fopen]') }; });
 ok(j.form!==false,'이야기 판에도 대형 없음'); ok(!j.txt,'편성 단추 없음');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8810 OK'); await b.close(); process.exit(fails ? 1 : 0); })();
