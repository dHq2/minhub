// v7.9 UI 시험 (모바일 + 데스크톱): 태세 단추 · 동시 선택 (드래그) · 정찰 방침 창 · 희생 돌격 확정 · 시작 행동 저장  /* v9.7.0: 명령 칸 접기 — 시험 전에 펼침 */
const { chromium } = require('playwright');
const errs=[], fails=[]; const ok=(c,m)=>{ console.log((c?'  ok  ':'  FAIL ')+m); if(!c) fails.push(m); };
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 for (const [name,vp,mob] of [['모바일',{width:412,height:915},true],['데스크톱',{width:1280,height:800},false]]){
  console.log('==',name);
  const ctx = await b.newContext({viewport:vp, deviceScaleFactor:mob?2.625:1, isMobile:mob, hasTouch:mob});
  const p=await ctx.newPage(); await p.addInitScript(()=>{ try{ localStorage.setItem('gulOrdGrp','{"tac":true,"adv":true}'); }catch(e){} });   /* v9.7.0 명령 칸 전술 · 고급 펼침 */ p.on('pageerror',e=>errs.push(name+': '+String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  const tap = async sel => { const r = await p.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const q=e.getBoundingClientRect(); return {x:q.left+q.width/2,y:q.top+q.height/2,vis:q.width>0}; }, sel); if(!r){ console.log('  !! no',sel); return null; } if (mob) await p.touchscreen.tap(r.x,r.y); else await p.click(sel); await p.waitForTimeout(220); return r; };
  const scr = (x,y)=>p.evaluate(([x,y])=>{ const ts=TS*cam.z, r=document.getElementById('cv').getBoundingClientRect(); return {x:r.left+(x-cam.x)*ts+r.width/2, y:r.top+(y-cam.y)*ts+r.height/2}; }, [x,y]);
  // 시작 전: 0초에 은신 + 교전금지 정해 두고 시작 → 다음 판에 유지
  await tap(mob?'#dPlay [data-dk="start"]':'#startBtn'); await p.waitForTimeout(300);
  if (!(await p.evaluate(()=>!!world))){ await p.evaluate(()=>start()); await p.waitForTimeout(300); }
  ok(await p.evaluate(()=>!!world && world.units.length>0), '판 시작');
  const names = await p.evaluate(()=>world.units.filter(u=>u.side===0).map(u=>u.name+':'+u.i)); console.log('  아군', names.join(' '));
  const idx = n => +names.find(x=>x.startsWith(n+':')).split(':')[1];
  // 칩/카드로 노먼 선택
  await p.evaluate(i=>{ sel=new Set([i]); hud(); }, idx('노먼')); await p.waitForTimeout(200);
  // 태세 단추 (모바일: dock, 데스크톱: orders)
  if (mob){ ok(!!(await p.$('[data-dk="roeH"]')), '교전금지 단추 있음'); ok(!!(await p.$('[data-dk="posture"]')), '태세 단추 있음'); ok(!!(await p.$('[data-dk="sac"]')), '희생돌격 단추 있음 (1명 선택)'); ok(!!(await p.$('[data-dk="boxsel"]')), '동시선택 단추 있음'); }
  else { ok(!!(await p.$('[data-ord="roe:hold"]')), '교전금지 단추 있음'); ok(!!(await p.$('[data-ord="roe:nofire"]')), '사격금지 단추'); ok(!!(await p.$('[data-ord="heal:order"]')), '치료 방침 단추'); ok(!!(await p.$('[data-ord="sac"]')), '희생 돌격 단추'); ok(!!(await p.$('[data-ord="boxsel"]')), '동시 선택 단추'); }
  await tap(mob?'[data-dk="roeH"]':'[data-ord="roe:hold"]'); // 싸움 전 0초라 바로
  ok(await p.evaluate(i=>roeOf(world, world.units[i])==='hold', idx('노먼')), '교전금지 적용 (0초)');
  await tap(mob?'[data-dk="roeH"]':'[data-ord="roe:smart"]');
  ok(await p.evaluate(i=>roeOf(world, world.units[i])==='smart', idx('노먼')), '다시 누르면 판단 교전으로');
  if (mob){ await tap('[data-dk="posture"]'); ok(await p.evaluate(()=>!document.getElementById('ask').hidden), '태세 창이 뜸'); await tap('[data-pst="roe:nofire"]'); } else await tap('[data-ord="roe:nofire"]'); ok(await p.evaluate(i=>roeOf(world, world.units[i])==='nofire', idx('노먼')), '사격금지');
  if (mob){ await tap('[data-dk="posture"]'); await tap('[data-pst="heal:order"]'); } else await tap('[data-ord="heal:order"]'); const hp1=await p.evaluate(i=>world.units[i].healPol, idx('노먼')); ok(hp1==='order'||hp1==='free', '치료 방침 바뀜 → '+hp1);
  // 은신 켜고 시작 행동 저장
  await p.evaluate(i=>{ sel=new Set([i]); hud(); }, idx('레베카'));
  await tap(mob?'[data-dk="roeH"]':'[data-ord="roe:hold"]');
  await p.evaluate(()=>{ const t=world.units.find(u=>u.torch); if(t){ t.torchOff=true; computeLight(world);} });
  await p.evaluate(()=>{ nextTurn(); }); await p.waitForTimeout(300);
  const sv = await p.evaluate(()=>JSON.stringify(S.openers)); console.log('  openers', sv.slice(0,300));
  ok(/"ro":"hold"/.test(sv)&&/"ro":"nofire"/.test(sv), '시작 행동에 교전 규칙 저장'); ok(/"tf":1/.test(sv), '시작 행동에 횃불 꺼 둠 저장'); ok(/"hp":"(order|free)"/.test(sv), '시작 행동에 치료 방침 저장');
  await p.evaluate(()=>{ resetToEdit(); }); await p.waitForTimeout(300); await p.evaluate(()=>start()); await p.waitForTimeout(400);
  const r2 = await p.evaluate(()=>({ n: roeOf(world, world.units.find(u=>u.name==='노먼')), r: roeOf(world, world.units.find(u=>u.name==='레베카')), torchOff: world.units.filter(u=>u.torch).map(u=>u.torchOff) }));
  ok(r2.n==='nofire' && r2.r==='hold', '다음 판에 교전 규칙 유지 '+JSON.stringify(r2)); ok(r2.torchOff.every(Boolean), '다음 판에 횃불 꺼 둠 유지');
  // 동시 선택: 단추 → 끌기
  await p.evaluate(()=>{ sel=new Set(); hud(); });
  await tap(mob?'[data-dk="boxsel"]':'[data-ord="boxsel"]'); ok(await p.evaluate(()=>boxArm), '동시 선택 켜짐');
  const pts = await p.evaluate(()=>world.units.filter(u=>u.side===0).map(u=>[u.x,u.y]));
  const mnx=Math.min(...pts.map(q=>q[0]))-1.2, mxx=Math.max(...pts.map(q=>q[0]))+1.2, mny=Math.min(...pts.map(q=>q[1]))-1.2, mxy=Math.max(...pts.map(q=>q[1]))+1.2;
  const a=await scr(mnx,mny), c=await scr(mxx,mxy);
  if (mob){ const cdp = await ctx.newCDPSession(p); const T=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y,id:1}]});
    await T('touchStart',a.x,a.y); for(let k=1;k<=8;k++){ await T('touchMove',a.x+(c.x-a.x)*k/8,a.y+(c.y-a.y)*k/8); await p.waitForTimeout(25);} await T('touchEnd',c.x,c.y); }
  else { await p.mouse.move(a.x,a.y); await p.mouse.down(); await p.mouse.move((a.x+c.x)/2,(a.y+c.y)/2,{steps:6}); await p.mouse.move(c.x,c.y,{steps:6}); await p.mouse.up(); }
  await p.waitForTimeout(300);
  const nsel = await p.evaluate(()=>({ n: sel.size, arm: boxArm, all: world.units.filter(u=>u.side===0&&u.alive).length }));
  ok(nsel.n===nsel.all && !nsel.arm, `끌어서 아군 ${nsel.n}/${nsel.all}명 고름 · 한 번 쓰고 꺼짐`);
  // 정찰 방침 창
  await p.evaluate(i=>{ sel=new Set([i]); hud(); }, idx('노먼'));
  await tap(mob?'[data-dk="scout"]':'[data-ord="scout"]');
  const u0 = await p.evaluate(i=>({x:world.units[i].x,y:world.units[i].y}), idx('노먼')); const g = await scr(u0.x, u0.y-5);
  if (mob) await p.touchscreen.tap(g.x,g.y); else await p.mouse.click(g.x,g.y); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!document.getElementById('ask').hidden), '정찰 방침 창이 뜸');
  const bt = await p.evaluate(()=>[...document.querySelectorAll('#ask [data-pol]')].map(e=>{ const q=e.getBoundingClientRect(); return [e.dataset.pol, Math.round(q.height), q.top>=0&&q.bottom<=innerHeight]; })); console.log('  창 단추', JSON.stringify(bt));
  ok(bt.length===4 && bt.every(x=>x[2]) && bt.slice(0,3).every(x=>x[1]>=44), '창 단추 4개 · 화면 안 · 높이 44px 이상');
  await tap('#ask [data-pol="survive"]');
  const od = await p.evaluate(i=>world.units[i].order, idx('노먼')); ok(od && od.k==='scout' && od.pol==='survive', '정찰 방침 = 생존 우선 '+JSON.stringify(od));
  ok(await p.evaluate(()=>document.getElementById('ask').hidden), '창이 닫힘'); ok(await p.evaluate(()=>S.scoutPol)==='survive', '마지막 방침 기억');
  // 희생 돌격 확정
  await p.evaluate(i=>{ sel=new Set([i]); world.units[i].order=null; hud(); }, idx('카리우스'));
  await tap(mob?'[data-dk="sac"]':'[data-ord="sac"]'); ok(await p.evaluate(i=>!world.units[i].order, idx('카리우스')), '첫 누름은 확인만');
  await tap(mob?'[data-dk="sac"]':'[data-ord="sac"]'); ok(await p.evaluate(i=>world.units[i].order && world.units[i].order.k==='sac', idx('카리우스')), '두 번째 누름으로 확정');
  // 모바일: 단추 줄이 화면 밖으로 넘치지 않나
  if (mob){ const ov = await p.evaluate(()=>{ const a=document.getElementById('dActs'); const bs=[...a.querySelectorAll('.db')]; const r=bs.map(e=>e.getBoundingClientRect()); return { n:bs.length, right:Math.max(...r.map(q=>q.right)), left:Math.min(...r.map(q=>q.left)), bottom:Math.max(...r.map(q=>q.bottom)), vh: innerHeight, vw: innerWidth, scrollW: a.scrollWidth, clientW: a.clientWidth }; }); console.log('  dActs', JSON.stringify(ov)); }
  await p.screenshot({path:'ui790_'+(mob?'m':'d')+'.png'});
  await ctx.close();
 }
 console.log('errors', JSON.stringify(errs)); console.log(fails.length?'FAILS '+fails.length+': '+fails.join(' | '):'ALL PASS'); await b.close(); })();
