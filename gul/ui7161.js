// v7.16.1 UI 시험 — ui7161.js v1.4 (v1.4: '멀리' 는 그때의 지휘관에게서 — 지휘가 부대장 (노먼 · 지휘 6칸) 에게 가 있으면 주인공 기준 9칸은 지시가 아예 닿지 않음 · 이미 기어가는 몸 (은신 포복) 은 엎드리기를 받지 않음 — 둘 다 규칙대로라 시험은 살아 서 있고 기어가지 않는 동료를 골라 지휘관의 지시가 늦게라도 닿는 거리 (9 → 7칸) 에 둠 (옛 빌드도 6번에 3번 어긋남) · 판 밖이면 반대쪽 · '교전 금지 남은 이' 는 살아 있는 동료만 셈 (자동 해제는 산 몸만 바꿈 — 멀리 보낸 동료가 쓰러지면 남던 것) · v1.3: 시작 자리 무작위 (v8.4.1) 는 끔 — '멀리 있으면' 거리 시험이라 · v1.2: 싸움이 늦게 열리는 판 (무작위 시작) 이면 8초까지 더 돌려 봄 · v1.1: 예시 판은 1.6초에 적이 쫓아와 싸움이 열림 — 교전 금지를 0초에 걸어 둠 · 포복 명령 전달 · 가는 중인 지시를 셈 (두 번 누르면 일어나) · 알림 · 교전 금지 자동 해제 로그 · 서술 · 아군 카드 · 모바일)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const mob of [false,true]){
  const cx=await b.newContext(mob?{viewport:{width:412,height:883},isMobile:true,hasTouch:true,deviceScaleFactor:2.6}:{viewport:{width:1280,height:860}}); await cx.addInitScript('window.__noJit=true'); const p=await cx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); const tag=mob?'모바일 ':'PC ';
  await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
  const r = await p.evaluate(()=>{ start(); const W=world, h=W.units.find(u=>u.hero);
    for (const u of W.units) if (u.side===0) u.roe='hold'; for (let k=0;k<60;k++) stepWorld(W,1/30);   /* 0초가 지나 전달이 걸리게 · 교전 금지는 0초에 */
    const C0=cmdBoss(W,0)||h, far=W.units.filter(u=>u.side===0&&u.alive&&!u.down&&!u.gone&&u!==C0&&!u.hero&&!u.modBody&&!u.crawl).sort((a,b)=>Math.hypot(b.x-C0.x,b.y-C0.y)-Math.hypot(a.x-C0.x,a.y-C0.y))[0];   /* v1.4 그때의 지휘관에게서 멂 · 기어가지 않는 몸 */
    for (const d of [9, 8.5, 8, 7.5, 7]){ far.x=C0.x+d<(W.map.W||S.W)-0.5?C0.x+d:C0.x-d; far.y=C0.y; const lk=(cmdWave(W,C0,[far])||[])[0]; if (lk&&lk.via!=='none'&&lk.t>0) break; } far.order={k:'hold'}; far.ordLive=far.order; sel=new Set([far.i]); hud(); ordKey('lie'); const q1=(far.posPend||[]).find(q=>q.key==='lie'), t1=document.getElementById('toast')?document.getElementById('toast').innerText:'';
    ordKey('lie'); const q2=(far.posPend||[]).find(q=>q.key==='lie');
    return { nm: far.name, q1: q1&&q1.val, at: q1&&+(q1.at-W.t).toFixed(2), q2: q2&&q2.val, t1, lie: !!far.lie }; });
  console.log('    '+tag+'포복', JSON.stringify(r)); ok(r.q1==='down'&&r.at>0&&!r.lie, tag+'멀리 있으면 엎드려 지시가 전해지는 중'); ok(/전하는 중/.test(r.t1), tag+'알림에 전하는 중'); ok(r.q2==='up', tag+'한 번 더 누르면 (가는 중인 지시를 셈) 일어나');
  const g = await p.evaluate(()=>{ const W=world; for (let k=0;k<240&&!W.log.some(x=>x.k==='roeAuto');k++) stepWorld(W,1/30); const a=W.units.find(u=>u.side===0&&!u.hero);
    const l=W.log.find(x=>x.k==='roeAuto'), line=logLines(W).filter(s=>/🕊→⚖/.test(s)), nar=l?narrOf(W,l):null; sel=new Set([a.i]); hud(); const card=(document.querySelector(`#party [data-ally="${a.i}"]`)||document.querySelector(`[data-dc="${a.i}"]`)||{}).innerText||'';
    return { l: !!l, n: l?l.a.length:0, line: line.join(' | ').slice(0,200), nar: nar&&nar.s, roe: W.units.filter(u=>u.side===0&&u.alive).map(u=>roeOf(W,u)).join(','), card: card.replace(/\s+/g,' ').slice(0,80) }; });
  console.log('    '+tag+'자동 해제', JSON.stringify(g)); ok(g.l&&g.n>=4, tag+'동료가 맞자 모두 판단 교전'); ok(/교전 금지였던/.test(g.line)&&/판단 교전/.test(g.line), tag+'로그 줄 '); ok(!/hold/.test(g.roe), tag+'교전 금지 남은 이 없음');
  if (g.nar!=null) ok(/손을 푼다/.test(g.nar), tag+'서술');
  const sw = await p.evaluate(()=>({ sw: document.documentElement.scrollWidth, iw: innerWidth })); ok(sw.sw<=sw.iw+1, tag+'가로 넘침 없음');
  ok(errs.length===0, tag+'오류 없음 '+JSON.stringify(errs)); await p.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7161 OK'); await b.close(); })();
