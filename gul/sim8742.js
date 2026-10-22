// sim8742.js v1.1 (v1.1: AIM=near|best — 세자르 하늘 가르기 · 관통 찌르기 · 냉기 참격의 노림 (2D 그대로 = near)) — 세자르 판 재기 (1F 5S 알현실 · 1F 일행 모두 자동 · 150초): 이김 · 시간 · 쓰러진 아군 · 세자르 넘어짐 · 휘청 · 버팀 · 기술마다 · 받은 피해 · 큰 한 방 · 붙어 있던 시간
// 쓰는 법: N=판 수 AIM=near|best node sim8742.js
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const N=+(process.env.N||6), R=[];
 for (let s=0;s<N;s++){ const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true');
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(300); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(800);
  await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); });
  const r = await p.evaluate(([s, AIM])=>{ const C=S.camp, party=S.units.filter(u=>u.side===0); C.s=5; campBuild(5,'down',party); while (TK){ if (TK.timer) talkDone(); talkAdv(); }
   czRise(world,C.stages[5].cz); while (TK){ if (TK.timer) talkDone(); talkAdv(); } const W=world, k=W.units.find(u=>u.brain==='cesar'); if (AIM) W.rules.cz.aim=AIM; let x=12345+s*7919; W.rand=()=>{ x=(x*1103515245+12345)%2147483648; return x/2147483648; };
   mode='run'; paused=false; let T=0, near=0; for (let i=0;i<4500&&!W.over&&k.alive;i++){ stepWorld(W,1/30); T+=1/30; if (W.units.some(u=>u.alive&&u.side===0&&gap(u,k)<1.5)) near+=1/30; try{ czEvTick(W); czCutTick(W); }catch(e){} while (TK){ if (TK.timer) talkDone(); talkAdv(); } } paused=true;
   const A=W.units.filter(u=>u.side===0&&!u.summon), L=W.log, sk={}; for (const l of L) if (l.k==='czStart'&&l.a===k.i) sk[l.s]=(sk[l.s]||0)+1;
   const toK=L.filter(l=>l.k==='hit'&&l.b===k.i), big=toK.filter(l=>l.dmg>=60).map(l=>W.units[l.a].name+':'+Math.round(l.dmg)+(l.crit?'치명':'')+(l.tag?'('+l.tag.slice(0,10)+')':''));
   return { T:+T.toFixed(0), czHp: Math.round(k.hp), win: !k.alive?'party':A.every(u=>!u.alive)?'cesar':'-', dead: A.filter(u=>!u.alive).length, n: A.length, near: +near.toFixed(0),
     prone: L.filter(l=>l.k==='prone'&&l.b===k.i).length, stun: L.filter(l=>l.k==='stun'&&l.b===k.i).length, res: L.filter(l=>l.k==='ccRes'&&l.b===k.i).length, kb: L.filter(l=>l.k==='shove'&&l.b===k.i).length, sk, dmg: Math.round(toK.reduce((a,l)=>a+(l.dmg||0),0)), big: big.slice(0,8).join(' '), deaths: L.filter(l=>l.k==='die'&&W.units[l.b].side===0).map(l=>W.units[l.b].name+'@'+l.t).join(' ') };
  }, [s, process.env.AIM||'']); R.push(r); console.log(s, JSON.stringify(r)); await ctx.close(); }
 const av=k=>(R.reduce((a,r)=>a+r[k],0)/R.length).toFixed(1); console.log(`== 일행 승 ${R.filter(r=>r.win==='party').length}/${R.length} · 세자르 승 ${R.filter(r=>r.win==='cesar').length} · 평균 ${av('T')}초 · 쓰러진 아군 ${av('dead')} · 세자르 넘어짐 ${av('prone')} · 휘청 ${av('stun')} · 버팀 ${av('res')} · 밀림 ${av('kb')}`);
 await b.close(); })();
