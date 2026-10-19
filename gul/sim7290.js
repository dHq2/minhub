// v7.29.0 세자르 판 재기 — sim7290.js v1.0 (5S 알현실 · 1F 일행 모두 자동 · 120초 · 예전 (버팀 0 · 원형 베기 0.5 · 돌진 원형 베기 없음) 과 새 방식 비교)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const N=+(process.env.N||4);
 for (const cfg of ['old','new']) { const R=[];
 for (let s=0;s<N;s++){ const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); p.on('dialog',d=>d.accept());
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(300); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
  await p.evaluate(()=>{ showTab('place'); renderFloors(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); });
  const r = await p.evaluate(([cfg,s])=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.s=5; campBuild(5,'down',party); while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   czRise(world,C.stages[5].cz); while (TK){ if (TK.timer) talkDone(); talkAdv(); } const W=world, k=W.units.find(u=>u.brain==='cesar'); let x=12345+s*7919; W.rand=()=>{ x=(x*1103515245+12345)%2147483648; return x/2147483648; };
   if (cfg==='old'){ k.ccRes=0; W.rules.cz.spinP=0.5; W.rules.cz.rspin=[1e9,1e9]; }
   mode='run'; paused=false; let T=0; for (let i=0;i<3600&&!W.over&&k.alive;i++){ stepWorld(W,1/30); T+=1/30; try{ czEvTick(W); czCutTick(W); }catch(e){} while (TK){ if (TK.timer) talkDone(); talkAdv(); } } paused=true;
   const A=W.units.filter(u=>u.side===0); return { T:+T.toFixed(0), czHp: Math.round(k.hp), win: !k.alive?'party':A.every(u=>!u.alive)?'cesar':'-', dead: A.filter(u=>!u.alive).length, n: A.length, prone: W.log.filter(l=>l.k==='prone'&&l.b===k.i).length, stun: W.log.filter(l=>l.k==='stun'&&l.b===k.i).length, res: W.log.filter(l=>l.k==='ccRes'&&l.b===k.i).length, spin: W.log.filter(l=>l.k==='czStart'&&l.a===k.i&&l.s==='spin').length, rush: W.log.filter(l=>l.k==='czStart'&&l.a===k.i&&l.s==='rush').length };
  }, [cfg,s]); R.push(r); console.log(cfg, s, JSON.stringify(r)); await ctx.close(); }
  const av=k=>(R.reduce((a,r)=>a+r[k],0)/R.length).toFixed(1); console.log(`== ${cfg}: 일행 승 ${R.filter(r=>r.win==='party').length}/${R.length} · 세자르 승 ${R.filter(r=>r.win==='cesar').length} · 평균 ${av('T')}초 · 쓰러진 아군 ${av('dead')} · 세자르 넘어짐 ${av('prone')} · 휘청 ${av('stun')} · 버팀 ${av('res')} · 원형 베기 ${av('spin')} · 돌진 ${av('rush')}`); }
 await b.close(); })();
