// sim8300.js v1.0 — 히든보스 적뢰 판 재기: 1S 에서 프롤로그 일행 그대로 (명령 없음 · 피하지 않음) — 이김 · 시간 · 쓰러진 이 · 낙인
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true');
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const N=+(process.argv[2]||6), out=[];
 for (let i=0;i<N;i++){
  const r = await p.evaluate(()=>{ if (S.camp) campQuit(true); setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } if (typeof ldEnd==='function') ldEnd(true);
    const W=world; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } jrWait(); const J=W.jr8; J.t0=W.t-30; while (J.st!=='fight' && W.t<60){ stepWorld(W,0.05); jrTickAll(W); while (TK){ if (TK.timer) talkDone(); talkAdv(); } }
    const n0=W.units.filter(u=>u.side===0&&u.alive).length; const t0=W.t; let k=0;
    while (J.st==='fight' && W.t<t0+300){ stepWorld(W,0.05); jrTickAll(W); while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); } if (!W.units.some(u=>u.side===0&&u.alive)) break; }
    const bb=W.units[J.bi]; return { win: J.st==='won', t: Math.round(W.t-t0), fall: W.units.filter(u=>u.side===0).length-n0, alive0: n0, left: W.units.filter(u=>u.side===0&&u.alive).length, bossHp: bb?Math.round(bb.hp):null, p2: !!J.p2, brand: S.units.filter(q=>(q.curses||[]).includes('낙인:적뢰')).length, party: W.units.filter(u=>u.side===0).map(u=>u.name).join(',') }; });
  console.log(JSON.stringify(r)); out.push(r); }
 console.log('win', out.filter(r=>r.win).length+'/'+N, 'avgT', Math.round(out.reduce((a,r)=>a+r.t,0)/N), 'errs', errs.slice(0,2).join(' | ')); await b.close(); })();
