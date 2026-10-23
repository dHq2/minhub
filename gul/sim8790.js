// sim8790.js v1.0 — 각펄 겨룸 재기 (명령 없음 · 자동): 고대 폐허의 만남 싸움 그대로 (r8XFight x_pearl · 물러날 수 없음 · 만남의 각펄)
//   이김 (무릎) · 시간 · 쓰러진 동료 · 각펄 체력 · 기술마다 쓴 수 · 맞힌 수 · 예고를 보고 비킨 수 · 끝까지 · 각 · 보스가 끼어 못 움직인 때
// 쓰는 법: node sim8790.js [판 수 6] [층 6] [일행 수 0 = 모두] [dir build] · EXCL=이름,이름 (일행에서 뺌)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true; window.__EXCL='+JSON.stringify((process.env.EXCL||'').split(',').filter(Boolean)));
 const dir=process.argv[5]||'build';
 await p.goto('file://'+process.cwd()+'/'+dir+'/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(300); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 const N=+(process.argv[2]||6), FL=+(process.argv[3]||6), PN=+(process.argv[4]||0), out=[];
 const party0 = await p.evaluate(()=>R8S().party.map(q=>q.name));
 console.log('일행', party0.join(','));
 for (let i=0;i<N;i++){
  const r = await p.evaluate(([FL,PN,party0])=>{ const R=R8S(); R.f=FL; r8FloorDef(FL); const keep=R.party.slice(); if (PN>0) R.party=keep.filter(q=>party0.slice(0,PN).includes(q.name)); if (window.__EXCL) R.party=R.party.filter(q=>!window.__EXCL.includes(q.name)); for (const q of R.party) q.hpNow=null; R.relics=[];
    const n = { id:'x'+Math.random(), r:1, i:0, t:'x', x:.5, next:[] }; R.fm.rows[1].push(n); R.at=n.id; world=null;
    r8XFight('x_pearl','pearl1',{ pearl8:true }); while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }
    const W=world; if (!W) return { err: 'no world' }; paused=true; const al0=W.units.filter(u=>u.side===0&&!u.summon).length, M=W.units.find(u=>u.side===1&&u.h2);
    let last={x:M.x,y:M.y,t:0}, maxStill=0, still=0, gakT=null;
    while (!W.over && W.t<300 && !W.cleared){ stepWorld(W,0.05); if (W.r8 && run8On()) r8Tick(W); jrTickAll(W); sp8Tick(W);
      if (M.alive && W.t-last.t>=1){ const mv=Math.hypot(M.x-last.x,M.y-last.y), known=czKnown(W,M).length; if (mv<0.15 && known && !M.act && !(W.t<(M.stunT||-9)) && !(W.t<(M.proneT||-9))){ still++; maxStill=Math.max(maxStill,still); } else still=0; last={x:M.x,y:M.y,t:W.t}; } }
    const L=W.log, mine=l=>l.a===M.i, sk={}, hit={};
    for (const l of L){ if (!mine(l)) continue;
      if (l.k==='h2') sk[l.s]=(sk[l.s]||0)+1; if (l.k==='h2Hit'){ hit[l.s]=(hit[l.s]||0)+(l.hit||[]).length; } }
    const dodge=L.filter(l=>l.k==='tgDodge'&&l.b===M.i).length, late=L.filter(l=>l.k==='tgLate'&&l.b===M.i).length;
    const toM=L.filter(l=>l.k==='hit'&&l.b===M.i), dmgTo=toM.reduce((a,l)=>a+(l.dmg||0),0);
    const byTag={}, deaths=[];
    for (const l of L){ if (l.k==='hit'&&l.a===M.i&&W.units[l.b]&&W.units[l.b].side===0){ const k=(l.tag||'?')+(l.block?'(막음)':''); byTag[k]=Math.round((byTag[k]||0)+(l.dmg||0)); } if (l.k==='die'&&W.units[l.b]&&W.units[l.b].side===0) deaths.push(W.units[l.b].name+'@'+Math.round(l.t||0)); }
    const dealt={}, tagTo={}; for (const l of toM) if (W.units[l.a]){ dealt[W.units[l.a].name]=Math.round((dealt[W.units[l.a].name]||0)+(l.dmg||0)); const k=W.units[l.a].name+':'+(l.tag||(l.far?'사격':'근접'))+(l.block?'(막음)':'')+(l.crit||l.hcrit?'(치명)':''); tagTo[k]=Math.round((tagTo[k]||0)+(l.dmg||0)); }
    const res={ win: !!W.cleared && !!(W.r8&&W.r8.surr), t: Math.round(W.t), over: !!W.over, result: W.result, dead: W.units.filter(u=>u.side===0&&!u.summon&&!u.alive).length, al0, max: M.max, atk: M.atk, bossHp: Math.round(M.hp/M.max*100), ph: !!(M.h2&&M.h2.ph), last: L.some(l=>l.k==='h2Last'&&l.b===M.i), fell: M.fell8!=null, sk, hit, dodge, late, dmgTo: Math.round(dmgTo), maxStill, deaths: deaths.join(' '), byTag, dealt, tagTo, party: R.party.map(q=>q.name).join(',') };
    R.party=keep; world=null; return res; }, [FL,PN,party0]);
  console.log(JSON.stringify(r)); out.push(r); }
 const ok=out.filter(r=>!r.err), w=ok.filter(r=>r.win).length; console.log('층', FL, '일행', PN||'모두', 'win', w+'/'+ok.length, 'avgT', Math.round(ok.reduce((a,r)=>a+r.t,0)/ok.length), 'dead', (ok.reduce((a,r)=>a+r.dead,0)/ok.length).toFixed(1)+'/'+(ok[0]||{}).al0, 'bossHp', Math.round(ok.reduce((a,r)=>a+r.bossHp,0)/ok.length)+'%', 'ph2', ok.filter(r=>r.ph).length, 'last', ok.filter(r=>r.last).length, 'maxStill', Math.max(...ok.map(r=>r.maxStill)));
 console.log('errs', errs.slice(0,3).join(' | ')); await b.close(); })();
