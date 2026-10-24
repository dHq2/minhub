// v9.2.0 UI 시험 — ui9020.js v1.0 (2층의 적 열셋 + 망자 다섯: 설계 · 얼굴 · 특성 검사 · 판에 올려 돌려 봄 · 그림 오류 없음 · 스크린샷)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const KEYS=['암계 방패병','암계 창방패병','암계 장송기사','암계 장궁병','반','테리','흑익','하류','헌팅나이프','카밀라','일반 망자','사족 망자','근육 망자','뚱보 망자','기형 망자'];
 const r = await p.evaluate((KEYS)=>KEYS.map(k=>{ const d=foe8(k,2); const au=traitAudit([d]).filter(x=>x.lv!=='dup'||true).map(x=>x.msg); const rr=RBY[d.ref]; return { k, ref:d.ref, face: faceOf(d.ref), name: rr&&rr[1], hp: d.ov&&d.ov.hp, au, act:(d.active||[]).filter(a=>!ACTIVE[a]) }; }), KEYS);
 for(const x of r) console.log('    '+x.k+' · 얼굴 '+x.face+' · 체력 '+x.hp+(x.au.length?' · 검사: '+x.au.join(' / '):'')+(x.act.length?' · 설명 없는 기술 '+x.act:''));
 ok(r.every(x=>x.face>=0),'모두 얼굴 그림이 있음 (아틀라스)'); ok(r.every(x=>!x.au.length),'특성 검사에 걸리는 것이 없음'); ok(r.every(x=>!x.act.length),'기술 설명이 모두 있음');
 // 판에 올려 돌려 봄
 const w = await p.evaluate((KEYS)=>{ resetToEdit(); const me=S.units.filter(u=>u.side===0).slice(0,5); S.units=[...me]; let x=24; for(const k of KEYS){ const d=foe8(k,2); S.units.push({ ...d, side:1, x: x%34+14, y: 6+Math.floor(x/34)*3.5, id: uid() }); x+=3; }
   start(); const W=world; let err=null; try { for(let i=0;i<300;i++){ stepWorld(W,1/30); } draw(); } catch(e){ err=e.message+' '+(e.stack||'').split('\n')[1]; } return { n: W.units.filter(u=>u.side===1).length, err, t: +W.t.toFixed(1) }; }, KEYS);
 console.log('    ', JSON.stringify(w)); ok(w.n===KEYS.length&&!w.err,'열다섯을 판에 올려 10초 돌려도 오류 없음'+(w.err?' — '+w.err:''));
 await p.screenshot({path:'ui9020_a.png'});
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
