// sim8200.js v1.0 — 30층 결승 (1대1) 판 재기: 가만히 공격만 하는 유저 vs 같은 대시 반사를 쓰는 유저 (자동) — 동료마다 승률 · 시간
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(300);
 const N = +(process.argv[2]||6);
 const r = await p.evaluate((N)=>{ const R=R8S(), out={}; const ps=R.party.slice();
   for (const pp of ps) for (const mode of ['passive','skilled']){ const k=pp.name+'|'+mode; out[k]={ w:0, n:0, t:0 };
     for (let i=0;i<N;i++){ R.at='final'; duel8Begin(pp); const W=world; mode0=mode; const me=W.units[W.duel.me], foe=W.units[W.duel.foe]; me.order={ k:'attack', b: foe.i }; W.duel.atkOn=true; const seen=new WeakSet();
       while (!W.over && W.t<180){ stepWorld(W,0.05); duel8Tick(W);
         if (mode==='skilled'){ const a=foe.act; if (a && a.b===me.i && a.phase==='wind' && !seen.has(a) && gap(me,foe)<1.8){ seen.add(a); if (Math.random()<0.45) duel8Dash(W, me, duel8Away(me, foe, true)); } if (!me.order) { me.order={ k:'attack', b: foe.i }; } } }
       out[k].n++; if (W.duel.res==='win') out[k].w++; out[k].t+=W.t; W.duel.done=true; duel8Ui(false); world=null; } }
   return out; }, N);
 for (const [k,v] of Object.entries(r)) console.log(k.padEnd(18), 'win', v.w+'/'+v.n, 'avgT', (v.t/v.n).toFixed(0));
 console.log('errs', errs.slice(0,3).join(' | ')); await b.close(); })();
