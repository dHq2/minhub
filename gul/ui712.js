// v7.12 UI 시험 — ui712.js v1 (Shift + 오른쪽 클릭 우회 · Shift + 적 클릭 · 모바일 ↪ 우회 · 카리우스 포복 안 됨)
const { chromium } = require('playwright');
const waitT=async(p,sec)=>{ const t0=await p.evaluate(()=>world.t); for(let k=0;k<80;k++){ await p.waitForTimeout(100); if((await p.evaluate(()=>world.t))-t0>=sec) return; } };
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 { const p=await (await b.newContext({viewport:{width:1280,height:800}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
  await p.evaluate(()=>{ start(); }); await p.waitForTimeout(300);
  // 인주 고르고, 판 위의 먼 바닥을 Shift + 오른쪽 클릭 (화면 좌표로)
  const info = await p.evaluate(()=>{ const u=world.units.find(x=>x.name==='인주'); sel=new Set([u.i]); hud(); const a0=toWorld(100,100), b0=toWorld(300,300), k0=(b0.x-a0.x)/200, scrOf=(x,y)=>({x:100+(x-a0.x)/k0,y:100+(y-a0.y)/k0}); let best=null; for(let y=1;y<S.H-1;y++) for(let x=1;x<S.W-1;x++){ if(rock(MAP,x+0.5,y+0.5)) continue; const d=Math.hypot(x+0.5-u.x,y+0.5-u.y), sc=scrOf(x+0.5,y+0.5), el=document.elementFromPoint(sc.x,sc.y); if(!el||el.tagName!=='CANVAS') continue; if(d>8&&d<14&&(!best||d<best.d)) best={x:x+0.5,y:y+0.5,d}; } const cv=document.getElementById('cv')||document.querySelector('canvas'); const r=cv.getBoundingClientRect(); return { i:u.i, tx:best.x, ty:best.y, cv:[r.left,r.top,r.width,r.height] }; });
  const scr = await p.evaluate(({tx,ty})=>{ const a=toWorld(100,100), b=toWorld(300,300), k=(b.x-a.x)/200; return { x: 100+(tx-a.x)/k, y: 100+(ty-a.y)/k }; }, info); console.log('    클릭 자리', JSON.stringify(scr), await p.evaluate(s=>{ const w=toWorld(s.x,s.y); return [+w.x.toFixed(1),+w.y.toFixed(1)]; }, scr), [info.tx, info.ty]);
  let ok1=false;
  if (scr){ await p.keyboard.down('Shift'); await p.mouse.click(scr.x, scr.y, {button:'right'}); await p.keyboard.up('Shift'); await p.waitForTimeout(300); }
  else { await p.evaluate(({tx,ty})=>{ rightClick({x:tx,y:ty}, true); }, info); }
  const o = await p.evaluate(i=>{ const u=world.units[i]; return u.order || u.ordPend && u.ordPend.o || u.ordLive; }, info.i);
  console.log('    Shift 우회 명령', JSON.stringify(o), scr?'(실제 클릭)':'(함수 호출)'); ok(o && o.via, 'Shift + 오른쪽 클릭 → 경유점이 붙은 이동');
  const lg = await p.evaluate(()=>logLines(world).filter(l=>/↪/.test(l)).join('\n')); console.log('    '+lg); ok(/우회/.test(lg), '로그에 우회');
  // 카리우스 포복
  await p.evaluate(()=>{ const k=world.units.find(x=>x.modBody); sel=new Set([k.i]); hud(); }); await p.keyboard.press('c'); await p.waitForTimeout(300);
  ok(!(await p.evaluate(()=>world.units.find(x=>x.modBody).lie)), 'C 키 → 카리우스는 안 엎드림');
  const tst = await p.evaluate(()=>{ const t=document.querySelector('.toast, #toast'); return t ? t.innerText : ''; }); console.log('    알림:', tst.slice(0,80));
  // 명령 칸 우회 단추
  await p.evaluate(()=>{ const u=world.units.find(x=>x.name==='노먼'); sel=new Set([u.i]); hud(); }); await p.waitForTimeout(250);
  const btn = await p.$('#orders [data-ord="detour"]'); ok(!!btn, '명령 칸에 ↪ 우회 단추'); if (btn){ await btn.click(); await p.waitForTimeout(200); ok(await p.evaluate(()=>detourArm), '단추로 우회 켬'); }
  await p.screenshot({path:'ui712_pc.png'});
  ok(errs.length===0, 'PC 오류 없음 '+JSON.stringify(errs)); await p.close(); }
 { const ctx=await b.newContext({viewport:{width:412,height:915},isMobile:true,hasTouch:true,deviceScaleFactor:2.6}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
  await p.evaluate(()=>{ start(); }); await p.waitForTimeout(300);
  const ii = await p.evaluate(()=>{ const u=world.units.find(x=>x.name==='인주'); sel=new Set([u.i]); hud(); return u.i; }); await p.waitForTimeout(300);
  const db = await p.$('[data-dk="detour"]'); ok(!!db, '모바일 아래 칸에 ↪ 우회'); if (db){ await db.tap(); await p.waitForTimeout(250); }
  ok(await p.evaluate(()=>detourArm), '탭 → 우회 켬');
  await p.evaluate(()=>{ const u=world.units.find(x=>x.name==='인주'); let best=null; for(let y=1;y<S.H-1;y++) for(let x=1;x<S.W-1;x++){ if(rock(MAP,x+0.5,y+0.5)) continue; const d=Math.hypot(x+0.5-u.x,y+0.5-u.y); if(d>9&&d<14&&(!best||d<best.d)) best={x:x+0.5,y:y+0.5,d}; } touchTap({x:best.x,y:best.y}); });
  await p.waitForTimeout(250);
  const o = await p.evaluate(i=>{ const u=world.units[i]; return u.order || u.ordPend && u.ordPend.o || u.ordLive; }, ii); console.log('    모바일 명령', JSON.stringify(o));
  ok(o && o.via, '우회를 켜고 바닥 탭 → 경유점이 붙은 이동'); ok(!(await p.evaluate(()=>detourArm)), '한 번 쓰면 꺼짐');
  await p.screenshot({path:'ui712_mob.png'}); ok(errs.length===0, '모바일 오류 없음 '+JSON.stringify(errs)); await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI712 OK'); await b.close(); })();
