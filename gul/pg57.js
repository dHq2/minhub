// v5.7 페이지: 막기 B · 전열 L · 연타 서두르기 · 전열 곡선 · 서술 · 상세정보
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await (await b.newContext({viewport:{width:1600,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(500);
  await p.evaluate(()=>showTab('fight')); await p.waitForTimeout(200); await p.click('#stepBtn'); await p.waitForTimeout(2600);
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  const toastTxt = () => p.evaluate(()=>{ const t=document.getElementById('toast'); return t?t.textContent:''; });
  // 1) 막기: 인주만 고르고 B → 방패 없음 안내
  await p.evaluate(()=>{ sel=new Set([world.units.find(u=>u.name==='인주').i]); hud(); });
  await p.keyboard.press('b'); await p.waitForTimeout(80); console.log('B injoo:', await toastTxt());
  // 카리우스 (방패 없음 · 거구) / 노먼
  await p.evaluate(()=>{ sel=new Set(world.units.filter(u=>u.side===0).map(u=>u.i)); hud(); });
  await p.keyboard.press('b'); await p.waitForTimeout(80); console.log('B all:', await toastTxt());
  // 2) 전열 L: 인주 · 레베카 · 카리우스 · 노먼
  await p.keyboard.press('l'); await p.waitForTimeout(80); console.log('L:', await toastTxt());
  console.log('orders', await p.evaluate(()=>world.units.filter(u=>u.side===0).map(u=>u.name+':'+JSON.stringify(u.order&&{k:u.order.k,join:!!u.order.join})).join(' ')));
  console.log('buttons', await p.evaluate(()=>[...document.querySelectorAll('#orders [data-ord="line"],#orders [data-ord="guard"]')].map(x=>x.textContent).join(' | ')));
  for (let k=0;k<2;k++){ await p.click('#stepBtn'); await p.waitForTimeout(2300); }
  console.log('lines', await p.evaluate(()=>JSON.stringify((world.lines||[]).map(l=>({s:l.side,n:l.n,ids:l.ids.map(i=>world.units[i].name)})))));
  // 3) 연타 서두르기: 레베카 고르고 같은 곳을 두 번 우클릭
  await p.evaluate(()=>{ sel=new Set([world.units.find(u=>u.name==='레베카').i]); hud(); });
  const R0 = await p.evaluate(()=>{ const r=world.units.find(u=>u.name==='레베카'); return {x:r.x-2,y:r.y+1}; }); const pr = await scr(R0.x,R0.y);
  await p.mouse.click(pr.x,pr.y,{button:'right'}); await p.waitForTimeout(60);
  console.log('one click', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='레베카').order)));
  await p.mouse.click(pr.x,pr.y,{button:'right'}); await p.waitForTimeout(60);
  console.log('double', await p.evaluate(()=>JSON.stringify(world.units.find(u=>u.name==='레베카').order)), '|', await toastTxt(), '| ack', await p.evaluate(()=>world.fx.filter(f=>f.k==='ack').map(f=>f.s).join(',')));
  // 4) 상세정보: 노먼 (지킬 사람) · 인주 (전열 · 방어)
  await p.evaluate(()=>{ sel=new Set([world.units.find(u=>u.name==='노먼').i]); hud(); renderDetail(); });
  console.log('norman det:', await p.evaluate(()=>document.getElementById('det').innerText.split('\n').filter(x=>/지킬|전열|방어|몸/.test(x)).join(' / ')));
  await p.evaluate(()=>{ sel=new Set([world.units.find(u=>u.name==='인주').i]); hud(); renderDetail(); });
  console.log('injoo det:', await p.evaluate(()=>document.getElementById('det').innerText.split('\n').filter(x=>/지킬|전열|방어|몸/.test(x)).join(' / ')));
  // 5) 끝까지 + 서술
  await p.evaluate(()=>{ sel=new Set(); hud(); });
  for (let k=0;k<8;k++){ await p.click('#stepBtn'); await p.waitForTimeout(2300); if (await p.evaluate(()=>world.over)) break; }
  const st = await p.evaluate(()=>{ const out=[]; for (const e of world.log){ if(['lineForm','lineLeave','lineBreak','lineFall','lineFill','opportunity','headLost','ward','guardMode'].includes(e.k)||(e.k==='hit'&&(e.vital||e.bareArm||e.cover!=null))){ const r=narrOf(world,e); out.push(e.k+': '+(r?r.s:'—')); } } return out.slice(0,14).join('\n'); });
  console.log(st);
  console.log('log sample', await p.evaluate(()=>logLines(world,0).filter(x=>/▬|♛|🛡|급소|옆 마디/.test(x)).slice(0,8).join('\n')));
  await p.evaluate(()=>{ document.querySelectorAll('.legend2').forEach(x=>x.hidden=true); });
  await p.screenshot({path:'s57.png'});
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
