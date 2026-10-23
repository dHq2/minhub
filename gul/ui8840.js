// v8.8.4 UI 시험 — ui8840.js v1.0 (옐로: 저항 게이지 그림 · 3 ~ 5타 기록 · 도약 칸 스택 ●○ · 버전 · 설명)
const { chromium } = require('playwright');
const vge=(s,m)=>{ const a=String(s||'').match(/(\d+)\.(\d+)\.(\d+)/), b=m.split('.').map(Number); if(!a) return false; for(let i=0;i<3;i++){ const x=+a[i+1]; if(x!==b[i]) return x>b[i]; } return true; };
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ window.__mkF = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...(FOE8[k] && s===1 ? fromDesign(clone(FOE8[k]),1) : fromDesign(designByKey(k),s)), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].home={x,y}; }); return W; };
   window.__run = (W, sec) => { const n = Math.round(sec / 0.05); for (let i=0;i<n && !W.over;i++) stepWorld(W, 0.05); }; });
 const d = await p.evaluate(()=>({ ver: document.querySelector('span.ver').textContent, mig: RULES_MIG, leap: ACTIVE['연속 도약'], claw: ACTIVE['달라붙기 난도질'], rush: ACTIVE['돌진'], sp0: rules.claw.rush.sp0, spd: rules.claw.rush.spd, c0: rules.charge.sp0 }));
 ok(vge(d.ver,'8.8.4')&&vge(d.mig,'8.8.4'),'버전 8.8.4 이상 ('+d.ver+')'); ok(/스택/.test(d.leap)&&/3 ~ 5타/.test(d.claw)&&/저항 게이지/.test(d.claw),'기술 설명: 스택 · 3 ~ 5타 · 저항 게이지'); ok(/남들과 같은 도움닫기/.test(d.rush),'돌진 설명: 출발은 남들과 같음'); ok(d.sp0===d.c0&&d.spd>2.6,'수치표: 출발 같음 · 최고 더 큼 ('+d.sp0+' → '+d.spd+')');
 const r = await p.evaluate(()=>{ const out={ e: [] }; const W=__mkF([['옐로',0,10,10],['검기사',1,11.2,10]]); const y=W.units[0], f=W.units[1]; f.order={k:'hold'}; f.canCharge=false; f.canLeap=false; f.atk=1; y.order={k:'spec',s:'yclaw',b:1}; sel=new Set([0]); paused=false;
   __run(W,0.85); try { draw(); } catch (e) { out.e.push('draw '+e.message); } const A=y.act; out.held = f.heldBy===0; out.res = A && A.res != null ? +A.res.toFixed(2) : null; out.n = A && A.n; out.hn = A && A.hn;
   try { hud(); const lp = slotState(world, selUnits(world), 3); out.sb = lp.ix; out.ix = lp.ix; } catch (e) { out.e.push('slot '+e.message); }
   out.card = document.body.innerText.includes('저항') || true;
   __run(W,2); out.hits = W.log.filter(l=>l.k==='hit'&&l.a===0&&/할큄/.test(l.tag||'')).length; out.end = W.log.some(l=>l.k==='clawEnd');
   const lines = logLines(W,0).join('\n'); out.log = /타까지 · 상대는 저항 게이지로 버팀/.test(lines);
   y.act=null; y.x=24; y.y=10; y.stk=2; y.leapCd=0; y.order={k:'leap',x:18,y:10}; __run(W,0.3); try { hud(); out.sb2 = slotState(world, selUnits(world), 3).ix; draw(); } catch (e) { out.e.push('slot2 '+e.message); } out.stk=y.stk; return out; });
 console.log('    ', JSON.stringify(r));
 ok(r.held&&r.res>0&&r.res<1,'붙잡힌 동안 저항 게이지가 차오르는 중 ('+r.res+')'); ok(r.n>=3&&r.n<=5,'정해진 타수 3 ~ 5 ('+r.n+')'); ok(r.hits===r.n&&r.end,'친 타수 = 정한 타수 · 마무리'); ok(r.log,'기록에 타수 · 저항'); ok(/●/.test(r.sb||''),'도약 칸에 스택 ●○ ('+r.sb+')'); ok(r.stk===0&&/○○/.test(r.sb2||''),'멀리 뛰면 스택이 다 비어 보임 ('+r.sb2+')'); ok(!r.e.length,'그림 오류 없음 '+JSON.stringify(r.e));
 const shot = await p.evaluate(()=>{ const W=__mkF([['옐로',0,10,10],['검기사',1,11.2,10]]); const y=W.units[0], f=W.units[1]; f.order={k:'hold'}; f.canCharge=false; f.canLeap=false; f.atk=1; y.order={k:'spec',s:'yclaw',b:1}; paused=false; __run(W,0.75); draw(); return true; });
 await p.screenshot({ path: 'ui8840_claw.png', clip: { x: 0, y: 60, width: 820, height: 720 } }).catch(()=>{});
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8840 OK'); await b.close(); process.exit(fails ? 1 : 0); })();
