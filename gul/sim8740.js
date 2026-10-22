// sim8740.js v1.1 — 층 보스 · 정예 판 재기 (명령 없음 · 자동): 이김 · 시간 · 쓰러진 동료 · 보스 체력 · 기술마다 쓴 수 · 맞힌 수 · 예고를 보고 비킨 수 · 보스가 끼어 못 움직인 때
// v1.1: 판을 고름 (boss redrock = 5층 붉은암석 · elite forget = 데이터층 망각) · 붉은암석 기술 (잡아찢기 · 딥 킥 · 방어모드 · 바위던지기 · 점프 찍기) 셈 · v1.0: 5층 망각
// 쓰는 법: node sim8740.js [판 수 5] [층 5] [boss|elite] [redrock|forget|…]
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true');
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(300); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 const N=+(process.argv[2]||5), FL=+(process.argv[3]||5), KIND=process.argv[4]||'boss', KEY=process.argv[5]||'redrock', out=[];
 for (let i=0;i<N;i++){
  const r = await p.evaluate(([FL,KIND,KEY])=>{ const R=R8S(); R.f=FL; r8FloorDef(FL); for (const q of R.party) q.hpNow=null;
    const n = KIND==='boss' ? { id:'b'+Math.random(), r:1, i:0, t:'boss', b:KEY, x:.5, next:[] } : { id:'e'+Math.random(), r:1, i:0, t:'elite', e:KEY, x:.5, next:[] };
    R.fm.rows[1].push(n); R.at=n.id; r8Battle(n); while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }
    const W=world; paused=true; const al0=W.units.filter(u=>u.side===0&&!u.summon).length, M=W.units.filter(u=>u.side===1).sort((a,c)=>c.max-a.max)[0];
    let last={x:M.x,y:M.y,t:0}, maxStill=0, still=0;
    while (!W.over && W.t<300 && !W.cleared){ stepWorld(W,0.05); if (W.r8 && run8On()) r8Tick(W); jrTickAll(W); sp8Tick(W);
      if (M.alive && W.t-last.t>=1){ const mv=Math.hypot(M.x-last.x,M.y-last.y), known=czKnown(W,M).length; if (mv<0.15 && known && !M.act && !(W.t<(M.stunT||-9)) && !(W.t<(M.proneT||-9)) && !(M.stoneT!=null&&W.t<M.stoneT)){ still++; maxStill=Math.max(maxStill,still); } else still=0; last={x:M.x,y:M.y,t:W.t}; } }
    const L=W.log, mine=l=>l.a===M.i, sk={}, hit={};
    for (const l of L){ if (!mine(l)) continue;
      if (l.k==='h2') sk[l.s]=(sk[l.s]||0)+1; if (l.k==='h2Hit'){ hit[l.s]=(hit[l.s]||0)+(l.hit||[]).length; if (l.s==='ml') sk.ml=(sk.ml||0)+1; } if (l.k==='h2Rain') hit.shadow=(hit.shadow||0)+(l.hit||[]).length;
      if (l.k==='wind' && l.spec && l.spec!=='h2') sk[l.spec]=(sk[l.spec]||0)+1;
      if (l.k==='tearGrab') hit.grab=(hit.grab||0)+1; if (l.k==='tear') hit['tear:'+l.res]=(hit['tear:'+l.res]||0)+1; if (l.k==='tearLet') hit.let=(hit.let||0)+1; if (l.k==='kick') hit.kick=(hit.kick||0)+1;
      if (l.k==='boulderEnd') hit[l.b!=null ? 'rock:'+(W.units[l.b].side?'ff':'hit') : 'rock:none']=(hit[l.b!=null ? 'rock:'+(W.units[l.b].side?'ff':'hit') : 'rock:none']||0)+1;
      if (l.k==='quakeHit'){ hit.quake=(hit.quake||0)+(l.n||0); if (l.kills) hit.squash=(hit.squash||0)+l.kills; } }
    const dodge=L.filter(l=>l.k==='tgDodge'&&l.b===M.i).length, late=L.filter(l=>l.k==='tgLate'&&l.b===M.i).length;
    const toM=L.filter(l=>l.k==='hit'&&l.b===M.i), dmgTo=toM.reduce((a,l)=>a+(l.dmg||0),0), crit=toM.filter(l=>l.crit).length, vital=toM.filter(l=>l.vital).length, stoneHits=toM.filter(l=>/방어모드/.test(l.tag||'')).length;
    const byTag={}, deaths=[];
    for (const l of L){ if (l.k==='hit'&&l.a===M.i&&W.units[l.b]&&W.units[l.b].side===0){ const k=(l.tag||'?')+(l.block?'(막음)':''); byTag[k]=Math.round((byTag[k]||0)+(l.dmg||0)); } if (l.k==='die'&&W.units[l.b]&&W.units[l.b].side===0) deaths.push(W.units[l.b].name+'@'+l.t+(l.how?':'+l.how:'')); }
    const dealt={}; for (const l of toM) if (W.units[l.a]) dealt[W.units[l.a].name]=Math.round((dealt[W.units[l.a].name]||0)+(l.dmg||0));
    const res={ boss: M.name, win: !!W.cleared, t: Math.round(W.t), dead: W.units.filter(u=>u.side===0&&!u.summon&&!u.alive&&!u.gone).length, al0, bossHp: Math.round(M.hp/M.max*100), ph: !!(M.h2&&M.h2.ph), sk, hit, dodge, late, brk: L.filter(l=>l.k==='h2Break'&&l.a===M.i).length, dmgTo: Math.round(dmgTo), crit, vital, stoneHits, maxStill, deaths: deaths.join(' '), byTag, dealt, party: R.party.map(q=>q.name).join(',') };
    world=null; return res; }, [FL,KIND,KEY]);
  console.log(JSON.stringify(r)); out.push(r); }
 const w=out.filter(r=>r.win).length; console.log('win', w+'/'+out.length, 'avgT', Math.round(out.reduce((a,r)=>a+r.t,0)/out.length), 'dead', (out.reduce((a,r)=>a+r.dead,0)/out.length).toFixed(1)+'/'+out[0].al0, 'bossHp', Math.round(out.reduce((a,r)=>a+r.bossHp,0)/out.length)+'%', 'ph2', out.filter(r=>r.ph).length, 'maxStill', Math.max(...out.map(r=>r.maxStill)));
 console.log('errs', errs.slice(0,3).join(' | ')); await b.close(); })();
