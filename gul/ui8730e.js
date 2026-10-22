// v8.7.3 바로잡기 휴대폰 UI 시험 — ui8730e.js v1.0 (v1.0: 판 아래쪽 인물을 탭해 고르면 조작판이 커지며 이야기 띠가 그 자리로 올라옴 — 같은 터치에서 뒤따르는 클릭이 '빈 곳 탭' 으로 읽혀 고르기가 풀리지 않음 · 손을 뗀 뒤 (0.5초 넘어) 이야기 띠를 탭하면 그대로 풀림)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const res = [];
 for (let k = 0; k < 4; k++){
  const ctx = await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true, userAgent:'Mozilla/5.0 (Linux; Android 13; SM-N981N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  const r = await p.evaluate(()=>{ const e=document.querySelector('#dPlay [data-dk="start"]'); const q=e.getBoundingClientRect(); return {x:q.left+q.width/2,y:q.top+q.height/2}; }); await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(520);
  // 레베카를 판 아래쪽 (캔버스 바닥에서 70 ~ 130px 위) 에 세움 — 바위가 아닌 칸
  const at = await p.evaluate((k)=>{ const u = world.units.find(u=>u.name==='레베카'), rr = document.getElementById('cv').getBoundingClientRect(), ts = TS * cam.z; cam.follow = false;
    const sy = rr.bottom - 70 - k * 20, wy = cam.y + (sy - rr.top - rr.height / 2) / ts; let wx = u.x; for (let d = 0; d < 6 && rock(world.map, wx, wy); d++) wx += 0.5;
    u.x = u.px = wx; u.y = u.py = wy; return { x: rr.left + (wx - cam.x) * ts + rr.width / 2, y: sy }; }, k);
  await p.touchscreen.tap(at.x, at.y); await p.waitForTimeout(200);
  const s1 = await p.evaluate(()=>[...sel].map(i=>world.units[i].name));
  // 손을 뗀 뒤 이야기 띠 (또는 그 자리의 빈 곳) 를 탭 → 고르기 풀림
  await p.waitForTimeout(700); const nb = await p.evaluate(()=>{ const n = document.getElementById('narr'); if (!n || n.hidden) return null; const q = n.getBoundingClientRect(); return q.height > 4 ? { x: q.left + q.width / 2, y: q.top + Math.min(q.height / 2, 20) } : null; });
  let s2 = null; if (nb){ await p.touchscreen.tap(nb.x, nb.y); await p.waitForTimeout(200); s2 = await p.evaluate(()=>[...sel].map(i=>world.units[i].name)); }
  res.push({ tapY: Math.round(at.y), s1, narr: !!nb, s2, errs: errs.length });
  await ctx.close(); }
 console.log('    탭', JSON.stringify(res));
 ok(res.every(x=>x.s1.length===1&&x.s1[0]==='레베카'),'판 아래쪽 인물을 탭 → 고름 (뒤따르는 클릭에 풀리지 않음)');
 ok(res.some(x=>x.narr)&&res.filter(x=>x.narr).every(x=>x.s2&&x.s2.length===0),'손을 뗀 뒤 이야기 띠를 탭하면 그대로 고르기 풀림');
 ok(res.every(x=>!x.errs),'오류 없음');
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8730E OK'); await b.close(); process.exit(fails ? 1 : 0); })();
