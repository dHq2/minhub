// v5.8.9: 사선 표시 · 반복 이동 명령 중 치료 재시작 없음
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await (await b.newContext({viewport:{width:1600,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout(700);
  await p.evaluate(()=>showTab('fight')); await p.keyboard.press('Space'); await p.waitForTimeout(300);
  const info = await p.evaluate(()=>{ const W=world, N=W.units.find(u=>u.name==='노먼'), R=W.units.find(u=>u.name==='레베카'), K=W.units.find(u=>u.name==='카리우스'), e=W.units.find(u=>u.name==='검기사');
    for (const u of W.units) if (u.side===1 && u!==e){ u.x=0.6; u.y=0.6; }
    e.x=7.5; e.y=3.5; e.seenBy=true; N.x=7.5; N.y=8.5; R.x=7.5; R.y=6.5; K.x=11.5; K.y=8.5; W.units.find(u=>u.name==='인주').x=3.5;
    sel=new Set([N.i]); hoverPid=e.pid; const a = fireInfo(W, N, e); R.x=8.6; const b = fireInfo(W, N, e); R.x=7.5; draw(); return [a, b].map(x=>x.c+': '+x.s+(x.lob?' → '+x.lob:'')).join(' | '); });
  console.log('fireInfo', info);
  await p.evaluate(()=>{ document.querySelectorAll('.legend2').forEach(e=>e.hidden=true); document.body.classList.remove('leg'); draw(); }); await p.screenshot({path:'s589-fire.png'});
  // 반복 이동: 레베카 30% · 노먼에게 0.05초 간격으로 같은 이동 명령 셋 (진행 중)
  const r = await p.evaluate(()=>{ const W=world, N=W.units.find(u=>u.name==='노먼'), R=W.units.find(u=>u.name==='레베카'); R.hp=R.max*0.3; R.x=8.5; R.y=8.5; N.x=7.5; N.y=8.5;
    cont=true; nextTurn(); const L0=W.log.length;
    for (let k=0;k<3;k++){ sel=new Set([N.i]); groupMove([N], 4.5, 8.5, 'move'); for (let j=0;j<2;j++) stepWorld(W,1/30); }
    for (let j=0;j<20;j++) stepWorld(W,1/30);
    const L=W.log.slice(L0); return { heal: L.filter(l=>l.k==='wind'&&l.a===N.i&&l.heal).length, held: L.filter(l=>l.k==='healHeld').length, cmds: L.filter(l=>l.k==='cmd').length, nx: N.x.toFixed(2) }; });
  console.log('repeat move', JSON.stringify(r));
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
