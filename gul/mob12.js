// v5.9.5 모바일 고르기 풀기: 이야기 칸 · 제목 · 조작판 빈 곳 · 고른 아군 다시 탭
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx = await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  const rect = sel => p.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const q=e.getBoundingClientRect(); return {l:q.left,t:q.top,w:q.width,h:q.height}; }, sel);
  const tapSel = async (sel) => { const r = await rect(sel); await p.touchscreen.tap(r.l+r.w/2, r.t+r.h/2); await p.waitForTimeout(150); };
  const selN = () => p.evaluate(()=>[...sel].map(i=>world.units[i].name).join(',') || '(없음)');
  await tapSel('#dPlay [data-dk="start"]'); await p.waitForTimeout(300);
  const all = async () => { await tapSel('[data-dk="all"]'); await p.waitForTimeout(80); };
  await all(); let r = await rect('#narr'); console.log('narr', JSON.stringify(r)); await p.touchscreen.tap(r.l + r.w*0.5, r.t + r.h*0.5); await p.waitForTimeout(150); console.log('이야기 칸 탭 →', await selN());
  await all(); r = await rect('header.top'); await p.touchscreen.tap(r.l + r.w*0.8, r.t + r.h*0.5); await p.waitForTimeout(150); console.log('제목 탭 →', await selN());
  await all(); r = await rect('#dActs'); console.log('dActs', JSON.stringify(r), await p.evaluate(()=>document.getElementById('dActs').innerText.slice(0,40)));
  const blank = await p.evaluate(()=>{ const d=document.getElementById('dock'), q=d.getBoundingClientRect(); for (let y=q.top+4;y<q.bottom-4;y+=6) for (let x=q.left+4;x<q.right-4;x+=6){ const el=document.elementFromPoint(x,y); if (el && !el.closest('button,[data-dk],[data-dc],[data-slot]')) return {x,y,tag:el.tagName+'.'+el.className}; } return null; });
  console.log('조작판 빈 곳', JSON.stringify(blank)); if (blank){ await p.touchscreen.tap(blank.x, blank.y); await p.waitForTimeout(150); console.log('조작판 빈 곳 탭 →', await selN()); }
  const R = await p.evaluate(()=>{ const u=world.units.find(u=>u.name==='레베카'); return {x:u.x,y:u.y}; }); let q = await scr(R.x, R.y);
  await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(400); console.log('레베카 탭 →', await selN()); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(150); console.log('다시 탭 →', await selN());
  // 단추는 풀지 않음
  await all(); await tapSel('#dPlay [data-dk="play"]'); console.log('재생 단추 →', await selN());
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
