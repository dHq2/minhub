// v7.22.3 UI 시험 — ui7223.js v1.1 (v1.1: v8.7.4 각혈은 제3세력 (2편 · 보라) — 알림 둘째 상자 · 망자와 서로 싸움 · 각혈이 살아 있으면 맵 정리 안 됨 · v1.0: 히든보스 각혈: 1S 에 들어설 때 정해짐 · 시간이 되면 먼 쪽 끝에 나타남 → 사각형 창 "피할 수 없는 죽음이 찾아왔습니다." · 6성 · 기술 넷 · [보스] · 캠페인에 한 번 · 장판 · 검기 그림 · 로그 · 모바일)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const [nm,vp] of [['데스크톱',{viewport:{width:1280,height:860}}],['모바일',{viewport:{width:412,height:915},deviceScaleFactor:2.625,isMobile:true,hasTouch:true}]]){
  const ctx=await b.newContext(vp); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
  await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
  const r1 = await p.evaluate(()=>{ showTab('place'); renderFloors(); S.camp && campQuit(); document.getElementById('campBtn').click(); document.getElementById('gAll').click();
    S.camp.khForce = true; document.getElementById('gGo').click(); const st=S.camp.stages[1]; return { kh: S.camp.kh, khT: st.khT, foes: world.units.filter(u=>u.side===1).map(u=>u.name) }; });
  console.log('    '+nm+' 1S', JSON.stringify(r1)); ok(r1.kh===1&&r1.khT>=6&&r1.khT<=14&&!r1.foes.includes('각혈'),nm+': 1S 에 들어설 때 정해짐 (6 ~ 14초 뒤) · 처음엔 없음');
  const r2 = await p.evaluate(()=>{ world.t = S.camp.stages[1].khT + 0.01; khTick(world); if (TK && TK.timer) talkDone(); const k=world.units.find(u=>u.name==='각혈'), al=world.units.filter(u=>u.side===0&&u.alive), cy=al.reduce((a,u)=>a+u.y,0)/al.length;
    const T=document.getElementById('talk'); return { has: !!k, side: k&&k.side, hp: k&&k.max, spec: k&&k.spec.map(x=>x.k).join(','), boss: k&&k.traits.includes('보스'), w: k&&k.weapon, far: k&&Math.abs(k.y-cy)>world.map.H*0.4, hunt: k&&k.state, box: TK&&TK.full, boxed: T.classList.contains('tk-boxed'), cleared: world.cleared,
      rect: (()=>{ const q=document.getElementById('tkBox').getBoundingClientRect(); return [Math.round(q.left),Math.round(q.right),Math.round(q.top),Math.round(q.bottom)]; })(), iw: innerWidth, ih: innerHeight }; });
  console.log('    '+nm+' 나타남', JSON.stringify(r2)); ok(r2.has&&r2.side===2&&r2.hp===3200&&r2.spec==='blink,pyre,pool,wave'&&r2.boss&&r2.w==='각혈의 장검',nm+': 각혈 — 체력 3200 · 혈영보 · 혈염 · 핏빛 장판 · 피의 검기 · [보스] · 각혈의 장검');
  ok(r2.far&&r2.hunt==='hunt'&&r2.box==='피할 수 없는 죽음이 찾아왔습니다.'&&r2.boxed,nm+': 일행에게서 먼 쪽 끝에 나타나 쫓음 · 사각형 창 "피할 수 없는 죽음이 찾아왔습니다."');
  ok(r2.rect[0]>=0&&r2.rect[1]<=r2.iw+1&&r2.rect[2]>=0&&r2.rect[3]<=r2.ih+1,nm+': 사각형 창이 화면 안');
  const r2b = await p.evaluate(()=>{ talkAdv(); const box2=TK&&TK.full; if (TK) talkAdv(); const k=world.units.find(u=>u.name==='각혈'); return { box2, col: SIDEC[k.side], home: k.home && [Math.round(k.home.x), Math.round(k.home.y)], mid: [Math.round(world.map.W/2), Math.round(world.map.H/2)] }; });
  console.log('    '+nm+' 제3세력', JSON.stringify(r2b)); ok(/누구의 편도 아님/.test(r2b.box2||'')&&r2b.col==='#b06ae8'&&JSON.stringify(r2b.home)===JSON.stringify(r2b.mid),nm+': 각혈 — 누구의 편도 아님 (알림 · 보라 · 놓치면 맵 가운데)');
  const r2c = await p.evaluate(()=>{ const k=world.units.find(u=>u.name==='각혈'); const z=world.units.filter(u=>u.side===1&&u.alive); for (const u of world.units) if (u.side===0){ u.order={k:'hold'}; } if (z[0]){ z[0].x=k.x+1.2; z[0].y=k.y; z[0].state='hunt'; z[0].target=k; } for (let i=0;i<120;i++) stepWorld(world,1/30);
    return { z: z.length, kz: world.log.filter(l=>l.k==='hit'&&l.a===k.i&&world.units[l.b].side===1).length, zk: world.log.filter(l=>l.k==='hit'&&l.b===k.i&&world.units[l.a].side===1).length, cleared: !!world.cleared }; });
  console.log('    '+nm+' 망자와 싸움', JSON.stringify(r2c)); ok(r2c.z===0||(r2c.kz+r2c.zk>0),nm+': 각혈과 망자가 서로 침'); ok(!r2c.cleared,nm+': 각혈이 살아 있으면 맵이 정리되지 않음');
  // 그림 · 로그: 장판 · 검기 · 혈영보 · 혈염
  const r3 = await p.evaluate(()=>{ const k=world.units.find(u=>u.name==='각혈'), a=world.units.find(u=>u.side===0&&u.alive); world.pools=[{by:k.i,side:1,x:a.x,y:a.y,r:2,until:world.t+5,tickT:world.t,t0:world.t}];
    (world.spins=world.spins||[]).push({ wave:true, by:k.i, side:1, x:k.x, y:k.y+1, dx:0, dy:1, v:16, left:8, w:0.45, mul:1.6, kb:0, pierce:2, burn:1, hit:[], t0:world.t });
    $('seeAll').checked=true; draw(); for (const kk of ['blink','pyre']){ const x=k.spec.find(s=>s.k===kk); x.cdT=-9; k.act={ k:'spec', s:kk, b:a.i, phase:'wind', t0:world.t, end:world.t }; stepWorld(world,1/30); } for (let i=0;i<20;i++) stepWorld(world,1/30); draw(); renderLog(true); renderNarr();
    const lg=(document.getElementById('log')||document.body).innerText; return { kinds: ['khCome','blink','pyre','waveEnd'].filter(kk=>world.log.some(l=>l.k===kk)), logTxt: /혈영보/.test(lg)||/혈염/.test(lg) }; });
  console.log('    '+nm+' 그림 · 로그', JSON.stringify(r3)); ok(r3.kinds.length===4,nm+': 장판 · 검기 그림 · 혈영보 · 혈염 · 로그');
  // 캠페인에 한 번
  const r4 = await p.evaluate(()=>{ S.camp.khForce=true; const party=S.units.filter(u=>u.side===0); S.camp.s=2; campBuild(2,'down',party); return { khT: S.camp.stages[2].khT, kh: S.camp.kh }; });
  ok(r4.khT==null&&r4.kh===1,nm+': 캠페인에 한 번만 (2S 에는 안 나옴)');
  ok(errs.length===0,nm+' 오류 없음 '+JSON.stringify(errs.slice(0,3)));
  await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7223 OK'); await b.close(); })();
