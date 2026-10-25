// v9.9.5 UI 시험 — ui9950.js v1.0 (뭉침 = 태세: 1명 → 제자리 태세 (선 긋기 없음) · 여럿 → 가장 단단한 이 자리 · 판에 선을 끌면 그 길이 (len) · 끄는 동안 '앞줄 N명' · 다른 명령이면 선 긋기 꺼짐 · 오류 없음)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const r1 = await p.evaluate(()=>{ resetToEdit(); start(); const W=world; paused=true; const A=W.units.filter(x=>x.side===0&&x.alive&&!x.hero).slice(0,3);
   sel=new Set([A[0].i]); hud(); const lab1=(document.querySelector('#orders [data-ord="clump"]')||{}).textContent||''; document.querySelector('#orders [data-ord="clump"]').click();
   const one={ k:A[0].order&&A[0].order.k, x:A[0].order.x-A[0].x, line:!!clumpLine, lab1 };
   sel=new Set(A.map(u=>u.i)); hud(); document.querySelector('#orders [data-ord="clump"]').click(); const T=A.slice().sort((a,b)=>(isFar(a)-isFar(b))||clumpTough(b)-clumpTough(a))[0];
   const many={ ks:A.map(u=>u.order&&u.order.k), atT:Math.hypot(A[0].order.x-T.x,A[0].order.y-T.y), line:!!clumpLine, lab:(document.querySelector('#orders [data-ord="clump"]')||{}).textContent||'' };
   const cv=document.querySelector('canvas#cv')||document.querySelector('canvas'); return { one, many, cvId: cv.id, ids:A.map(u=>u.i) }; });
 console.log('    ', JSON.stringify(r1));
 ok(r1.one.k==='clump'&&Math.abs(r1.one.x)<1e-6&&!r1.one.line&&/태세/.test(r1.one.lab1),'1명: 제자리 태세 (단추 글 태세 · 선 긋기 없음)'); ok(r1.many.ks.every(k=>k==='clump')&&r1.many.atT<1e-6,'여럿: 가장 단단한 이 자리에 먼저'); ok(r1.many.line&&/선을/.test(r1.many.lab),'이어서 선 긋기 켜짐');
 // 판에 선을 끎: 화면 좌표로 (세계 좌표 → 화면)
 const box = await p.evaluate((id)=>{ const cv=document.getElementById(id); const r=cv.getBoundingClientRect(); const u=world.units.find(x=>x.side===0&&!x.hero&&x.alive); const toS=(wx,wy)=>{ for(let sx=r.left;sx<r.right;sx+=4){} return null; }; return { l:r.left, t:r.top, w:r.width, h:r.height }; }, r1.cvId);
 const cx=box.l+box.w/2, cy=box.t+box.h/2; const w0=await p.evaluate(([x,y])=>toWorld(x,y),[cx-60,cy]), w1=await p.evaluate(([x,y])=>toWorld(x,y),[cx+60,cy]);
 await p.mouse.move(cx-60,cy); await p.mouse.down(); await p.mouse.move(cx,cy,{steps:4}); const mid=await p.evaluate(()=>({ draw:!!clDraw })); await p.mouse.move(cx+60,cy,{steps:4}); await p.mouse.up(); await p.waitForTimeout(100);
 const r2 = await p.evaluate((ids)=>{ const A=ids.map(i=>world.units[i]); return { len:A.map(u=>u.order&&u.order.len), x:A[0].order.x, y:A[0].order.y, line:!!clumpLine }; }, r1.ids);
 const want=Math.hypot(w1.x-w0.x,w1.y-w0.y); console.log('    ', JSON.stringify(r2), ' want len', want.toFixed(2), ' mid', JSON.stringify(mid));
 ok(mid.draw,'끄는 동안 선 미리 보기'); ok(r2.len.every(l=>l&&Math.abs(l-want)<0.15),'선 길이가 명령에 (len)'); ok(Math.abs(r2.x-(w0.x+w1.x)/2)<0.2,'선 가운데로'); ok(!r2.line,'한 번 그으면 선 긋기 끝');
 const r3 = await p.evaluate((ids)=>{ sel=new Set(ids); hud(); document.querySelector('#orders [data-ord="clump"]').click(); const on=!!clumpLine; document.querySelector('#orders [data-ord="hold"]')&&document.querySelector('#orders [data-ord="hold"]').click(); return { on, off:!clumpLine }; }, r1.ids);
 ok(r3.on&&r3.off,'다른 명령이면 선 긋기 꺼짐');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0); })();
