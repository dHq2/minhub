// v7.18 UI 시험 — ui718.js v1 (지형 칸 · 다시 굴리기 · 더미 도구 순환 · 무작위 더미 빼기 · 언덕 도구 · 지우개 · 1층 = 1F · 싸움 중 오류 없음 · 상세 지형 줄 · 그림 스크린샷 · 모바일 넘침)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
   const t0 = await p.evaluate(()=>({ terr: S.terr||'', piles: MAP.piles, sel: document.getElementById('terrSel').value }));
   ok(t0.piles===0&&t0.sel==='','처음 판은 평지 그대로 '+JSON.stringify(t0));
   const t1 = await p.evaluate(()=>{ const s=document.getElementById('terrSel'); s.value='1F'; s.dispatchEvent(new Event('change')); return { terr:S.terr, piles: MAP.piles, hills: MAP.hills?MAP.hills.length:0, ts:S.tseed, toast: document.getElementById('toast').innerText }; });
   console.log('    1F', JSON.stringify(t1)); ok(t1.terr==='1F'&&t1.piles>0&&/더미/.test(t1.toast),'지형 1F 고르면 더미가 생김');
   const t2 = await p.evaluate(()=>{ const a=S.tseed; document.getElementById('terrRoll').click(); return { a, b:S.tseed, piles:MAP.piles }; }); ok(t2.a!==t2.b&&t2.piles>0,'다시 굴리기 = 새 지형');
   // 더미 도구
   const pc = await p.evaluate(()=>{ setTool('pile'); let x=0,y=0; for(y=3;y<S.H-3;y++){ for(x=3;x<S.W-3;x++){ if(!MAP.t[y*S.W+x]&&!S.units.some(u=>Math.floor(u.x)===x&&Math.floor(u.y)===y)) break; } if(x<S.W-3) break; }
     const seq=[]; for(let k=0;k<3;k++){ editClick({x:x+0.5,y:y+0.5}); seq.push(pileAt(MAP,x+0.5,y+0.5)); }
     let gx=-1,gy=-1; for(let c=0;c<S.W*S.H;c++) if(MAP.t[c]===2&&!(S.piles||[]).some(k=>k.startsWith((c%S.W)+','+((c/S.W)|0)+','))){ gx=c%S.W; gy=(c/S.W)|0; break; }
     let off=null; if(gx>=0){ editClick({x:gx+0.5,y:gy+0.5}); off=pileAt(MAP,gx+0.5,gy+0.5); } return { seq, off, n:(S.pileOff||[]).length }; });
   console.log('    더미 도구', JSON.stringify(pc)); ok(pc.seq.join()==='1,2,0','빈 칸 → 갑옷 → 시체 → 없음'); ok(pc.off===0&&pc.n===1,'무작위 더미는 누르면 빠짐');
   const hl = await p.evaluate(()=>{ setTool('hill'); editClick({x:10.5,y:9.5}); const h1=gH(MAP,10.5,9.5); editClick({x:10.6,y:9.4}); const h2=gH(MAP,10.5,9.5); setTool('erase'); editErase({x:10.5,y:9.5}); return { h1, h2, n:(S.hills||[]).length }; });
   console.log('    언덕 도구', JSON.stringify(hl)); ok(hl.h1>=1.5&&hl.h2>hl.h1+0.5&&hl.n===0,'언덕 놓기 · 높이기 · 지우개로 빼기');
   await p.evaluate(()=>{ setTool('hill'); editClick({x:16,y:9}); setTool('select'); }); await p.waitForTimeout(200);
   await p.screenshot({path:'ui718_edit.png'});
   // 저장 · 복사
   const sv = await p.evaluate(()=>JSON.parse(localStorage.getItem(LS)||'{}')); ok(sv.terr==='1F'&&(sv.hills||[]).length===1,'지형이 저장됨');
   // 1층
   const fl = await p.evaluate(()=>{ placeFloor('1층'); return { terr:S.terr, piles:MAP.piles, note: document.getElementById('terrSel').value }; }); ok(fl.terr==='1F'&&fl.note==='1F','1층 놓기 = 1F 지형 '+JSON.stringify(fl));
   // 싸움
   await p.evaluate(()=>{ start(); }); await p.click('#contBtn'); await p.waitForTimeout(400);
   const run = await p.evaluate(()=>{ for(let k=0;k<30*25&&!world.over;k++) stepWorld(world,1/30); hud(); const cov=world.log.filter(l=>l.k==='miss'&&l.cover).length, sl=world.log.filter(l=>l.k==='prone'&&/미끄러짐/.test(l.why||'')).length; return { t:+world.t.toFixed(1), cov, sl, lines: logLines(world).filter(s=>/엄폐|미끄러짐/.test(s)).slice(0,3) }; });
   console.log('    1F 싸움 25초', JSON.stringify(run)); ok(run.t>5,'1F 지형에서 싸움이 돌아감');
   const fx = await p.evaluate(()=>{ const W=world; let best=null; for(const u of W.units){ if(!u.alive) continue; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) if(pileAt(W.map,u.x+dx,u.y+dy)) best=u; } if(!best) return null; const d=document.createElement('div'); d.innerHTML=unitDetailHtml(W,best); return d.innerText.match(/엄폐 곁[^·\n]*/)?.[0]||'없음'; });
   console.log('    상세', fx); ok(fx===null||/엄폐 곁/.test(fx),'더미 곁이면 상세에 엄폐 곁');
   await p.evaluate(()=>{ document.getElementById('seeAll').checked=true; hud(); }); await p.waitForTimeout(300); await p.screenshot({path:'ui718_run.png'});
   ok(errs.length===0,'오류 없음 (데스크톱) '+JSON.stringify(errs)); }
 { const ctx=await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
   const ov = await p.evaluate(()=>{ const s=document.getElementById('terrSel'); s.value='1F'; s.dispatchEvent(new Event('change')); return document.scrollingElement.scrollWidth-innerWidth; }); ok(ov<=1,'모바일 가로 넘침 없음 ('+ov+')');
   const tb = await p.evaluate(()=>{ const r=document.getElementById('toolSeg').getBoundingClientRect(); return [Math.round(r.left),Math.round(r.right),innerWidth]; }); ok(tb[1]<=tb[2]+1,'도구 줄이 화면 안 '+tb.join(','));
   ok(errs.length===0,'오류 없음 (모바일) '+JSON.stringify(errs)); }
 console.log(fails?`${fails} FAIL`:'ALL UI718 OK'); await b.close(); })();
