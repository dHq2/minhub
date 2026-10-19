// sim8400.js v1.0 — 세르파 판 재기: 5층 보스 (세르파 · 몽 · 슬라임 넷 — 조직이 커짐) 와 보통 싸움에 동료 세르파를 더한 판 (명령 없음). 이김 · 시간 · 뽑은 수 · 합친 것
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true');
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(300); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 const N=+(process.argv[2]||5), out=[];
 for (const kind of ['boss','ally']) for (let i=0;i<N;i++){
  const r = await p.evaluate((kind)=>{ const R=R8S(); R.f=5; for (const q of R.party) q.hpNow=null; R.party=R.party.filter(q=>q.ref!=='C-277');
    if (kind==='ally'){ const fd=FOE8['세르파']; R.party.push({ ...fromDesign({ ...clone(fd), side:0, traits: fd.traits.filter(t=>t!=='보스'), ov: { ...fd.ov, ...fd.allyOv } }, 0), id: uid(), side: 0 }); }
    const n = kind==='boss' ? { id:'b'+Math.random(), r:1, i:0, t:'boss', b:'serpa', x:.5, next:[] } : { id:'s'+Math.random(), r:1, i:0, t:'fight', x:.5, next:[] }; R.fm.rows[1].push(n); R.at=n.id; r8Battle(n); while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }
    const W=world; paused=true; const al0=W.units.filter(u=>u.side===0).length;
    while (!W.over && W.t<240 && !W.cleared){ stepWorld(W,0.05); sp8Tick(W); }
    const side = kind==='boss'?1:0, made=W.units.filter(u=>u.summon&&u.side===side), sv=W.units.find(u=>u.ref==='C-277');
    const res={ kind, win: !!W.cleared, t: Math.round(W.t), dead: W.units.filter(u=>u.side===0&&!u.summon&&!u.alive&&!u.gone).length, al0, slimes: made.filter(u=>u.summon==='slime').length, ups: made.filter(u=>u.summon==='up').map(u=>u.name).join('/'), serpa: sv?(sv.alive?Math.round(sv.hp)+'/'+sv.max:'down'):'-', hails: W.log.filter(l=>l.k==='r8'&&/우박!/.test(l.s)).length };
    world=null; return res; }, kind);
  console.log(JSON.stringify(r)); out.push(r); }
 for (const k of ['boss','ally']){ const L=out.filter(r=>r.kind===k); console.log(k, 'win', L.filter(r=>r.win).length+'/'+L.length, 'avgT', Math.round(L.reduce((a,r)=>a+r.t,0)/L.length), 'dead', (L.reduce((a,r)=>a+r.dead,0)/L.length).toFixed(1)); }
 console.log('errs', errs.slice(0,3).join(' | ')); await b.close(); })();
