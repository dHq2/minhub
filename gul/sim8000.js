// sim8000.js v1.0 — 30층 여정 싸움 칸을 엔진만으로 끝까지 (층마다 · 맵마다): 이김 · 걸린 시간 · 쓰러진 아군 · 출구까지 걸어가 나감
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(300); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 const floors = (process.argv[2]||'2,4,6,8,11,13,16,18,21,23,26,28').split(',').map(Number), out=[];
 for (const f of floors){ for (let rep=0; rep<2; rep++){
  const r = await p.evaluate((f)=>{ const R=R8S(); R.f=f; for (const q of R.party) q.hpNow=null; const n={ id:'s'+Math.random(), r:1, i:0, t:'fight', x:.5, next:[] }; R.fm.rows[1].push(n); R.at=n.id; r8Battle(n); while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }
    const W=world; const al0=W.units.filter(u=>u.side===0).length, fo0=W.units.filter(u=>u.side===1).length, foes=[...new Set(W.units.filter(u=>u.side===1).map(u=>u.name.replace(/\s*\d+$/,'')))].join('/');
    let t=0; while (!W.over && W.t<240 && !W.cleared){ stepWorld(W,0.05); }
    const tc=+W.t.toFixed(0), dead=W.units.filter(u=>u.side===0&&!u.alive&&!u.gone).length, cl=!!W.cleared;
    if (cl){ for (const u of W.units) if (u.side===0&&u.alive&&!u.down) u.order={ k:'exit', dir:'up', x:u.x }; const t0=W.t; while (!W.over && W.t<t0+90) stepWorld(W,0.05); }
    const out={ f, map: S.art8, al0, fo0, foes, win: cl, t: tc, dead, exitT: cl ? +(W.t-tc).toFixed(0) : null, gone: W.units.filter(u=>u.side===0&&u.gone==='up').length, stuck: W.units.filter(u=>u.side===0&&u.alive).length };
    world=null; return out; }, f);
  console.log(JSON.stringify(r)); out.push(r); } }
 const w=out.filter(r=>r.win).length; console.log('win', w+'/'+out.length, 'avgT', Math.round(out.reduce((a,r)=>a+r.t,0)/out.length), 'stuck', out.reduce((a,r)=>a+r.stuck,0), 'errs', errs.slice(0,3).join(' | ')); await b.close(); })();
