// sim8800.js v1.0 — 한 일대로 성장 재기 (명령 없음 · 자동): 보통 싸움 칸 (층 FL) 을 N 판 — 판마다 동료의 셈 (막음 · 치유 · 숨어 걸음 · 명령 닿음 · 맞힘 · 피함 · 걸음 · 근접 피해 · 받은 피해) 과
//   그 셈으로 자랄 갈래 (설계는 건드리지 않고 복사본으로) — 문턱이 너무 쉽거나 어려운지 봄
// 쓰는 법: node sim8800.js [판 수 6] [층 4] [dir build]
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 const dir=process.argv[4]||'build';
 await p.goto('file://'+process.cwd()+'/'+dir+'/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); while (TK){ if (TK.timer) talkDone(); talkAdv(); } });
 await p.waitForTimeout(300); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 const N=+(process.argv[2]||6), FL=+(process.argv[3]||4), out=[];
 for (let i=0;i<N;i++){
  const r = await p.evaluate((FL)=>{ const R=R8S(); R.f=FL; r8FloorDef(FL); R.flags.calderapSeen=1; R.flags.hargenSeen=1; R.fm=r8Gen(FL); const keep=clone(R.party); for (const q of R.party) q.hpNow=null; R.relics=[];
    const n=R.fm.rows[0][0]; n.ms='fight'; R.at=n.id; world=null; r8Battle(n); let g=0; while (TK && g++<200){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }
    const W=world; if (!W) return { err: 'no world' }; paused=true;
    while (!W.over && W.t<240 && !(W.cleared && !W.units.some(u=>u.side===1&&u.alive))){ stepWorld(W,0.05); if (W.r8 && run8On()) r8Tick(W); }
    const rows=stageStats(W), gr={};
    for (const r of rows){ const q=clone(R.party.find(x=>x.id===r.pid)||{}); if (!q.name) continue; const o=growFor(q,r); if (o.length) gr[r.name]=o.join(' · '); }
    const res={ t: Math.round(W.t), win: !W.units.some(u=>u.side===1&&u.alive), dead: W.units.filter(u=>u.side===0&&!u.summon&&!u.alive).length,
      rows: rows.map(r=>`${r.name}: 막${r.blocked} 치${r.healed} 숨${r.sneak} 명${r.cmds} 맞${r.hits} 피${r.dodges} 걸${r.moved} 근${r.meleeDealt} 받${r.taken} gT${r.gT} stB${(+r.stB).toFixed(2)}`), gr };
    R.party=keep; world=null; return res; }, FL);
  console.log(JSON.stringify(r)); out.push(r); }
 const ok=out.filter(r=>!r.err), cnt={}; for (const r of ok) for (const v of Object.values(r.gr)) for (const g of v.split(' · ')) { const k=g.split(' ')[0]; cnt[k]=(cnt[k]||0)+1; }
 console.log('층', FL, '판', ok.length, '이김', ok.filter(r=>r.win).length, '평균 시간', Math.round(ok.reduce((a,r)=>a+r.t,0)/ok.length), '자란 갈래 (판 모두)', JSON.stringify(cnt), '판마다 자란 이', (ok.reduce((a,r)=>a+Object.keys(r.gr).length,0)/ok.length).toFixed(1));
 console.log('errs', errs.slice(0,3).join(' | ')); await b.close(); })();
