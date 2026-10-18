// v5.8 모바일 검증 (갤럭시 노트 20: 412×915 · DPR 2.625 · 터치)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx = await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true, userAgent:'Mozilla/5.0 (Linux; Android 13; SM-N981N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e))); const cdp = await ctx.newCDPSession(p);
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  const info = () => p.evaluate(()=>({ mob: MOB, mode, t: world? +world.t.toFixed(2):null, sel:[...sel].map(i=>world.units[i].name), z:+cam.z.toFixed(2), follow: cam.follow, viewH: Math.round(document.getElementById('view').getBoundingClientRect().height), dockH: document.getElementById('dock').offsetHeight, docH: document.documentElement.scrollHeight }));
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  const tap = async (x,y) => { await p.touchscreen.tap(x,y); await p.waitForTimeout(120); };
  const tapSel = async (sel) => { const r = await p.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const q=e.getBoundingClientRect(); return {x:q.left+q.width/2,y:q.top+q.height/2}; }, sel); if(!r){ console.log('  !! no', sel); return; } await tap(r.x, r.y); };
  console.log('edit', JSON.stringify(await info()));
  await p.screenshot({path:'m1-edit.png'});
  await tapSel('#dPlay [data-dk="start"]'); await p.waitForTimeout(400);
  console.log('t0', JSON.stringify(await info()));
  await p.screenshot({path:'m1-t0.png'});
  // 판에서 레베카를 탭 → 고름
  let R = await p.evaluate(()=>{ const u=world.units.find(u=>u.name==='레베카'); return {x:u.x,y:u.y}; }); let pr = await scr(R.x,R.y); await tap(pr.x, pr.y);
  console.log('tap rebecca → sel', JSON.stringify((await info()).sel));
  // 바닥을 탭 → 이동
  pr = await scr(R.x+1.2, R.y-1.5); await tap(pr.x, pr.y);
  console.log('tap ground → order', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='레베카').order)));
  await tap(pr.x, pr.y);
  console.log('double tap → hurry', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='레베카').order)));
  // 칩으로 노먼 더하기 → 2명
  await tapSel('#dChips [data-dc="1"]'); console.log('chip norman → sel', JSON.stringify((await info()).sel));
  // 적을 탭 → 공격
  const E = await p.evaluate(()=>{ const e=world.units.find(u=>u.side===1&&u.alive&&u.seenBy); return e?{x:e.x,y:e.y,n:e.name}:null; });
  if (E){ pr = await scr(E.x,E.y); await tap(pr.x, pr.y); console.log('tap enemy', E.n, '→', await p.evaluate(()=>world.units.filter(u=>sel.has(u.i)).map(u=>u.name+':'+JSON.stringify(u.order)).join(' '))); }
  await p.screenshot({path:'m1-orders.png'});
  // 길게 누르기 → 상세 시트
  R = await p.evaluate(()=>{ const u=world.units.find(u=>u.name==='카리우스'); return {x:u.x,y:u.y}; }); pr = await scr(R.x,R.y);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:pr.x,y:pr.y,id:1}]}); await p.waitForTimeout(650); await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await p.waitForTimeout(150);
  console.log('long press → det open', await p.evaluate(()=>document.getElementById('detail').classList.contains('open')), await p.evaluate(()=>document.getElementById('det').innerText.slice(0,60)), 'sel unchanged', JSON.stringify((await info()).sel));
  await p.screenshot({path:'m1-det.png'});
  await tapSel('#detX'); console.log('closed', await p.evaluate(()=>document.getElementById('detail').classList.contains('open')));
  // 두 손가락 확대
  const z0 = (await info()).z; const c = await p.evaluate(()=>{ const r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; });
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x-40,y:c.y,id:1},{x:c.x+40,y:c.y,id:2}]});
  for (let k=1;k<=6;k++){ await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:c.x-40-k*12,y:c.y,id:1},{x:c.x+40+k*12,y:c.y,id:2}]}); await p.waitForTimeout(16); }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await p.waitForTimeout(100);
  console.log('pinch zoom', z0, '→', (await info()).z, 'orders unchanged', await p.evaluate(()=>world.units.find(u=>u.name==='레베카').order.k));
  // 한 손가락 끌기 → 화면 옮기기 (명령 없음)
  const cx0 = await p.evaluate(()=>cam.x);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x,y:c.y,id:1}]}); for (let k=1;k<=5;k++){ await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:c.x-k*20,y:c.y,id:1}]}); await p.waitForTimeout(16); } await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await p.waitForTimeout(100);
  console.log('pan', cx0.toFixed(2), '→', (await p.evaluate(()=>cam.x)).toFixed(2), 'follow', (await info()).follow);
  // 전체 / 가까이
  await tapSel('#dPlay [data-dk="zoom"]'); console.log('zoom all', (await info()).z); await p.screenshot({path:'m1-all.png'});
  await tapSel('#dPlay [data-dk="zoom"]'); console.log('zoom close', (await info()).z);
  // 재생 → 멈춤
  await tapSel('#dPlay [data-dk="play"]'); await p.waitForTimeout(900); const a = await info(); await tapSel('#dPlay [data-dk="play"]'); const b2 = await info(); await p.waitForTimeout(500); const c2 = await info();
  console.log('play', a.mode, a.t, '→ pause', b2.t, '→ after 0.5s', c2.t);
  await p.screenshot({path:'m1-run.png'});
  // 기술: 노먼 고르고 4 (약) → 칩 레베카 탭 → 약 명령
  await p.evaluate(()=>{ sel=new Set([world.units.find(u=>u.name==='노먼').i]); hud(); });
  await p.waitForTimeout(100);
  const skb = await p.evaluate(()=>[...document.querySelectorAll('#dActs .db')].map(b=>b.dataset.dk+':'+b.textContent.trim()).join(' | ')); console.log('acts', skb);
  await tapSel('#dActs [data-dk="sk4"]'); await tapSel('#dChips [data-dc="2"]');
  console.log('heal order', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='노먼').order)));
  // 더 보기 메뉴
  await tapSel('#dPlay [data-dk="menu"]'); await p.screenshot({path:'m1-menu.png'}); await tapSel('#dMenu [data-dm="leg"]'); console.log('legend on', await p.evaluate(()=>document.body.classList.contains('leg'))); await tapSel('#dPlay [data-dk="menu"]');
  // 속도 순환
  await tapSel('#dPlay [data-dk="speed"]'); console.log('speed', await p.evaluate(()=>speed));
  // 겹침 검사: 조작판이 판을 가리는가
  console.log('layout', JSON.stringify(await p.evaluate(()=>{ const v=document.getElementById('view').getBoundingClientRect(), d=document.getElementById('dock').getBoundingClientRect(), n=document.getElementById('narr').getBoundingClientRect(); return {viewTop:Math.round(v.top), viewBot:Math.round(v.bottom), narrBot:Math.round(n.bottom), dockTop:Math.round(d.top), innerH: innerHeight, scrollY}; })));
  // 작은 단추 (44px 미만) 찾기
  console.log('small targets', await p.evaluate(()=>[...document.querySelectorAll('#dock button')].filter(b=>{ const r=b.getBoundingClientRect(); return r.width && (r.height<40||r.width<44); }).map(b=>b.textContent.trim()+':'+Math.round(b.getBoundingClientRect().width)+'x'+Math.round(b.getBoundingClientRect().height)).join(' , ') || 'none'));
  console.log('h-overflow', await p.evaluate(()=>document.documentElement.scrollWidth > innerWidth + 1));
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
