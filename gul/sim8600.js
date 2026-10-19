// sim8600.js v1.0 — 적뢰 (v8.6.0 충실 이식) 판 재기. 모드: dps = 패턴 없이 서 있는 적뢰에게 2D 와 같은 넷 (인주 · 레베카 · 카리우스 · 청광묵) 이 넣는 초당 피해 (체력 환산용) / fight = 1F 일행 그대로 / raid = 가장 센 동료 여덟 (레이드) — 명령 없음
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await p.addInitScript('window.__askAuto=true;window.__noJit=true');
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const mode=process.argv[2]||'fight', N=+(process.argv[3]||6), out=[];
 for (let i=0;i<N;i++){
  const r = await p.evaluate((mode)=>{ const TE=()=>{ while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); } };
    if (S.camp) campQuit(true); setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); TE(); if (typeof ldEnd==='function') ldEnd(true);
    let W=world; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; }
    const keep = mode==='dps' ? ['C-001','C-002','C-003','C-004'] : null;
    if (mode==='raid'){ const want=['카리우스','탕아','모닝스타','나달','쟝','간두','청광묵','인주']; for (const u of W.units) if (u.side===0){ u.alive=false; u.hp=0; u.gone='merge'; }
      let k=0; for (const nm of want){ const d=DESIGN_DEFAULTS.find(x=>x.key===nm); const q={ ...fromDesign(d,0), id: uid(), side:0, x: 4+(k%4)*1.6, y: W.map.H-3-Math.floor(k/4)*1.6 }; S.units.push(q); const u=addUnit(W,q); const f=freeSpot(W,u.x,u.y,u.r); if (f){ u.x=f.x; u.y=f.y; } k++; } }
    if (keep) for (const u of W.units) if (u.side===0 && !keep.includes(u.ref)){ u.alive=false; u.hp=0; u.gone='merge'; }
    jrWait(); const J=W.jr8; J.t0=W.t-30; while (J.st!=='fall' && W.t<80){ stepWorld(W,0.05); jrTickAll(W); TE(); }
    if (mode==='dps'){ const al=W.units.filter(u=>u.side===0&&u.alive), cx=al.reduce((a,u)=>a+u.x,0)/al.length, cy=al.reduce((a,u)=>a+u.y,0)/al.length; let best=null; for (let a=0;a<12;a++){ const x=cx+Math.cos(a/12*6.28)*4.5, y=cy+Math.sin(a/12*6.28)*4.5; if (x<2||y<2||x>W.map.W-2||y>W.map.H-2||boxRock(W,x,y,1)) continue; best={x,y}; break; } if (best){ J.mark.x=best.x; J.mark.y=best.y; } }
    while (J.st!=='fight' && W.t<90){ stepWorld(W,0.05); jrTickAll(W); TE(); }
    const bb=W.units[J.bi], n0=W.units.filter(u=>u.side===0&&u.alive).length, t0=W.t;
    for (const u of W.units) if (u.side===0){ u.order=null; u.ordLive=null; }
    if (mode==='dps'){ J.st='dummy'; bb.hp=bb.max=1e5; const T=40; const tk0=bb.taken; let first=null; while (W.t<t0+T){ stepWorld(W,0.05); jrTickAll(W); TE(); if (first==null && bb.taken>tk0) first=W.t; }
      const st=W.log.filter(l=>l.k==='marble'), per={}; for (const u of W.units) if (u.side===0&&u.ref&&keep.includes(u.ref)) per[u.name]=Math.round(u.dealt/(W.t-(first||t0))*10)/10;
      return { dps: Math.round((bb.taken-tk0)/(W.t-(first||t0))*10)/10, per, steps: st.filter(l=>l.how==='step').length, blocks: st.filter(l=>l.how==='block').length, first: first&&+(first-t0).toFixed(1), hits: (()=>{ const H={}; for (const l of W.log) if (l.k==='hit'&&l.b===bb.i){ const k=(l.vital?'V:':'')+(l.hcrit?'C:':'')+(l.tag||l.wk||'-'); H[k]=H[k]||[0,0]; H[k][0]++; H[k][1]+=l.dmg; } return H; })(), dist: W.units.filter(u=>u.side===0&&u.alive).map(u=>Math.round(Math.hypot(u.x-bb.x,u.y-bb.y)*10)/10+(canSee(W,u,bb)?'s':'')).join(',') }; }
    while (J.st==='fight' && W.t<t0+400){ stepWorld(W,0.05); jrTickAll(W); TE(); if (!W.units.some(u=>u.side===0&&u.alive)) break; }
    const L=W.log.filter(l=>l.k==='r8').map(l=>l.s), cnt=re=>L.filter(s=>re.test(s)).length;
    return { win: J.st==='won', t: Math.round(W.t-t0), fall: n0-W.units.filter(u=>u.side===0&&u.alive).length, n0, bossHp: bb?Math.round(bb.hp)+'/'+bb.max:null, p2: !!J.p2, kick: cnt(/날아차기 →|날아차기를 막음/), kill: cnt(/머리가 터졌다/), th: cnt(/천벌 (치명 )?직격 →/), storm: cnt(/번개비$/), laser: cnt(/정면/), jump: cnt(/바닥 창/), desc: cnt(/내려꽂힌다/), steps: W.log.filter(l=>l.k==='marble'&&l.how==='step').length, brand: S.units.filter(q=>(q.curses||[]).includes('낙인:적뢰')).length, src: (()=>{ const H={}; for (const l of W.log) if (l.k==='hit'&&W.units[l.b]&&W.units[l.b].side===0&&l.a===J.bi){ const k=(l.tag||'-').replace(/ \(.*\)/,''); H[k]=(H[k]||0)+l.dmg; } return H; })() }; }, mode);
  console.log(JSON.stringify(r)); out.push(r); }
 if (mode==='dps') console.log('avg dps', (out.reduce((a,r)=>a+r.dps,0)/N).toFixed(1));
 else console.log(mode, 'win', out.filter(r=>r.win).length+'/'+N, 'avgT', Math.round(out.reduce((a,r)=>a+r.t,0)/N), 'fall', (out.reduce((a,r)=>a+r.fall,0)/N).toFixed(1), 'p2', out.filter(r=>r.p2).length);
 console.log('errs', errs.slice(0,3).join(' | ')); await b.close(); })();
