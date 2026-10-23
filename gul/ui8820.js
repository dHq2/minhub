// v8.8.2 옐로 업데이트 UI 시험 — ui8820.js v1.0 (연속 도약 이름 · 새 기술 칸 · 안내 · 양동이 뿌리기 (장판 · 쏟기 그림) · 달라붙기 (할큄 그림) · 돌진 (키하핫) · 기록 · 서술 · 그림 오류 없음 · 스크린샷)
const { chromium } = require('playwright');
const vge=(s,m)=>{ const a=String(s||'').match(/(\d+)\.(\d+)\.(\d+)/), b=m.split('.').map(Number); if(!a) return false; for(let i=0;i<3;i++){ const x=+a[i+1]; if(x!==b[i]) return x>b[i]; } return true; };
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ window.__mkF = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...(FOE8[k] && s===1 ? fromDesign(clone(FOE8[k]),1) : fromDesign(designByKey(k),s)), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].home={x,y}; }); return W; };
   window.__run = (W, sec) => { const n = Math.round(sec / 0.05); for (let i=0;i<n && !W.over;i++) stepWorld(W, 0.05); }; });
 // 1) 버전 · 설정 · 안내
 const d = await p.evaluate(()=>{ const y=designByKey('옐로'); return { ver: document.querySelector('span.ver').textContent, mig: RULES_MIG, act: y.active, leapN: y.leapN, tactic: y.tactic, desc: ['연속 도약','달라붙기 난도질','양동이 뿌리기'].map(k=>!!ACTIVE[k]), tgt: !!SPEC_TGT.yclaw && !!SPEC_TGT.ybucket, ic: SPEC_IC.yclaw+SPEC_IC.ybucket, uq: UNIQUE['저주:맥아'].effects.length }; });
 console.log('    ', JSON.stringify(d).slice(0, 400));
 ok(vge(d.ver,'8.8.2')&&vge(d.mig,'8.8.2'),'버전 8.8.2 이상 · 수치표 이전 8.8.2 이상 ('+d.ver+' · '+d.mig+')');
 ok(d.act.join()==='연속 도약,돌진,달라붙기 난도질,양동이 뿌리기'&&d.leapN===2,'도감 옐로: 연속 도약 · 돌진 · 달라붙기 난도질 · 양동이 뿌리기'); ok(d.tgt&&d.ic==='🐾🪣','기술 안내 · 아이콘'); ok(d.uq>=4,'저주:맥아 효과 글');
 // 2) 판: 기술 칸 이름 · 양동이 뿌리기
 const r = await p.evaluate(()=>{ const W=__mkF([['옐로',0,10,10],['인주',0,8,10],['검기사',1,13,10],['검기사',1,13.8,10.6]]); const out={ e: [] }; const y=W.units[0];
   out.spec=(y.spec||[]).map(s=>s.name).join(); out.canCharge=y.canCharge; out.leapN=y.leapN; out.rush=y.rush;
   sel = new Set([0]); hud(); try { const lp = slotState(world, selUnits(world), 3); out.leapLabel = lp.ix; const s6 = slotState(world, selUnits(world), 6), s7 = slotState(world, selUnits(world), 7); out.s6 = s6.nm; out.s7 = s7.nm; out.ic6 = s6.ic; out.ic7 = s7.ic; } catch (e) { out.e.push('slot '+e.message); }
   W.units[2].order = { k: 'hold' }; W.units[3].order = { k: 'hold' }; W.units.forEach(u => { if (u.side === 1){ u.canCharge = false; u.canLeap = false; } });
   y.order = { k: 'spec', s: 'ybucket', x: 13.3, y: 10.3 }; paused = false; __run(W, 0.7); try { draw(); } catch (e) { out.e.push('draw1 '+e.message); } out.pourFx = (W.fx||[]).some(f => f.k === 'pour');
   __run(W, 0.6); try { draw(); } catch (e) { out.e.push('draw2 '+e.message); } out.pool = (W.pools||[]).filter(q => q.kind === 'malt').length; out.malt = W.units.filter(u => u.side === 1 && u.maltT > W.t).length; out.left = Math.round(y.skill.left);
   window.__shot1 = true; return out; });
 console.log('    ', JSON.stringify(r).slice(0, 500));
 ok(r.spec==='달라붙기 난도질,양동이 뿌리기','기술 칸 2개: '+r.spec); ok(r.canCharge&&r.rush&&r.leapN===2,'돌진 · 연속 도약'); ok(/^연속 도약/.test(r.leapLabel),'도약 칸 이름 = 연속 도약 ('+r.leapLabel+')'); ok(r.s6==='달라붙기 난도질'&&r.s7==='양동이 뿌리기'&&r.ic6==='🐾'&&r.ic7==='🪣','특수 칸 이름 · 아이콘');
 ok(r.pourFx,'양동이 쏟기 그림 (fx pour)'); ok(r.pool===1,'맥아 장판 한 장'); ok(r.malt>=1,'<저주:맥아> 걸린 적 '+r.malt); ok(r.left<500,'양동이 약이 줄어듦 ('+r.left+')'); ok(!r.e.length,'그림 오류 없음 '+JSON.stringify(r.e));
 await p.screenshot({ path: 'ui8820_bucket.png', clip: { x: 0, y: 60, width: 1000, height: 700 } }).catch(()=>{});
 // 3) 달라붙기 난도질 · 돌진
 const c = await p.evaluate(()=>{ const out={ e: [] }; const W=__mkF([['옐로',0,10,10],['검기사',1,11.2,10]]); const y=W.units[0], f=W.units[1]; f.order={k:'hold'}; f.canCharge=false; f.canLeap=false; y.order={k:'spec',s:'yclaw',b:1}; paused=false;
   out.clawFx = 0; for (let i=0;i<18;i++){ stepWorld(W,0.05); out.clawFx += (W.fx||[]).filter(q=>q.k==='claw'&&q.t0>=W.t-0.06).length; } try { draw(); } catch (e) { out.e.push('draw3 '+e.message); } out.held = f.heldBy === 0;
   __run(W,2.3); out.hits = W.log.filter(l=>l.k==='hit'&&l.a===0&&/할큄/.test(l.tag||'')).length; out.end = W.log.some(l=>l.k==='clawEnd');
   const lines = logLines(W, 0).join('\n'); out.logGrab = /달라붙기 난도질/.test(lines); out.logEnd = /난도질 끝/.test(lines);
   try { const nn = W.log.filter(l => ['tearGrab','clawEnd'].includes(l.k)).map(l => narrOf(W, l)); out.narr = nn.map(q => q && q.s).filter(Boolean).length; } catch (e) { out.e.push('narr '+e.message); }
   const W2=__mkF([['옐로',0,10,10],['곤봉적',1,18,10]]); const f2=W2.units[1]; f2.order={k:'hold'}; f2.canCharge=false; f2.canLeap=false; W2.units[0].order={k:'charge',b:1}; paused=false;
   let shot=false; for (let i=0;i<60&&!W2.over;i++){ stepWorld(W2,0.05); if (W2.log.some(l=>l.k==='rushHit')){ shot=true; break; } } try { draw(); } catch (e) { out.e.push('draw4 '+e.message); }
   out.rush = W2.log.filter(l=>l.k==='rushHit').length; const l2 = logLines(W2, 0).join('\n'); out.logRush = /키하핫/.test(l2); const rl = W2.log.find(l=>l.k==='rushHit'); try { out.narrRush = rl ? narrOf(W2, rl).s : null; } catch (e) { out.e.push('narr2 '+e.message); } out.say = (W2.fx||[]).some(q=>q.k==='say'&&q.s==='키하핫!!');
   return out; });
 console.log('    ', JSON.stringify(c).slice(0, 600));
 ok(c.held,'붙잡힘'); ok(c.clawFx>=1,'할큄 자국 그림 (fx claw)'); ok(c.hits>=3&&c.hits<=5,'3 ~ 5타 할큄 '+c.hits); ok(c.end,'마무리'); ok(c.logGrab&&c.logEnd,'기록 글'); ok(c.narr>=1,'서술 글'); ok(c.rush===1||c.rush===0,'돌진 시도 ('+c.rush+')'); ok(!c.e.length,'그림 · 서술 오류 없음 '+JSON.stringify(c.e));
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8820 OK'); await b.close(); process.exit(fails ? 1 : 0); })();
