// v7.25.4 UI 시험 — ui7254.js v1.2 (v1.2: 판 위의 확인 창 — 자동 시험은 __askAuto 로 바로 '예' · v1.1: 그림은 열리는지만 (file:// 은 캔버스로 픽셀을 못 읽음 — 투명은 talkcut.py 에서 봄) · 대화 화면: 양 끝 큰 그림 — 왼쪽 = 우리 (인주 · 얼굴로 대신) · 오른쪽 = 말하는 NPC / 말하는 쪽만 밝게 · 이름표는 말하는 쪽 ·
//   아군이 NPC 와 말하면 왼쪽에 아군 (대화 끝까지) · NPC 없이 아군이 말하면 오른쪽 / 나레이션 · 사각형 나레이션 / 새 그림 (오딜 · 모닝스타 · 레베카 · 탕아) 이 실제로 열림 · 배경 투명 /
//   가로 띠는 화면 아래 끝까지 · ▼ SPACE (휴대폰 ▼ 탭) · 휴대폰 넓이)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const ST = `(()=>{ const T=document.getElementById('talk'), L=document.getElementById('tkL'), R=document.getElementById('tkPic'), bx=document.getElementById('tkBox').getBoundingClientRect(), nm=document.getElementById('tkName'), nq=nm.getBoundingClientRect(), rq=R.getBoundingClientRect(), lq=L.getBoundingClientRect();
   const st = el => el.classList.contains('none') ? 'none' : (el.classList.contains('tk-face') ? 'face' : 'img') + (el.classList.contains('on') ? ':on' : ':dim');
   return { vis: !T.hidden, L: st(L), R: st(R), Lsrc: (document.getElementById('tkImgL').getAttribute('src')||''), Rsrc: (document.getElementById('tkImg').getAttribute('src')||''), name: nm.textContent, nameSide: nq.width ? (nq.left + nq.width/2 > innerWidth/2 ? 'R' : 'L') : '',
     band: [Math.round(bx.left), Math.round(bx.right), Math.round(bx.bottom), Math.round(bx.top)], rq: [Math.round(rq.left), Math.round(rq.right), Math.round(rq.height)], lq: [Math.round(lq.left), Math.round(lq.right), Math.round(lq.height)], narr: T.classList.contains('tk-narr'), boxed: T.classList.contains('tk-boxed'),
     nx: document.getElementById('tkNx').textContent, iw: innerWidth, ih: innerHeight, sw: document.documentElement.scrollWidth }; })()`;
 const DONE = "(()=>{ if (TK && TK.timer) talkDone(); })()";
 for (const vw of [{width:1280,height:860,nm:'PC'},{width:412,height:880,nm:'휴대폰',mob:true}]){
   const p=await (await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true');
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp, party=S.units.filter(u=>u.side===0&&u.name!=='친칠라'); C.stages[3]={ seed: 11, tseed: 7, e3: 'chin' }; C.s=3; campBuild(3,'down',party); while (TK){ if (TK.timer) talkDone(); talkAdv(); }
     const E=encCur(); const h=world.units.find(u=>u.hero); h.x=E.x; h.y=E.y+2.6; computeLight(world); encTick(world); });
   await p.waitForTimeout(700); await p.evaluate(DONE);
   const a = await p.evaluate(ST); console.log('    '+vw.nm+' 친칠라 (나레이션)', JSON.stringify(a));
   ok(a.vis&&a.narr&&/C-106_talk06/.test(a.Rsrc)&&/^img/.test(a.R)&&a.L.startsWith('face')&&!a.name,vw.nm+': 처음 보일 때 나레이션 — 오른쪽 친칠라 그림 · 왼쪽 인주 (얼굴) · 이름표 없음');
   ok(a.band[0]<=0&&a.band[1]>=a.iw-1&&a.band[2]>=a.ih-2&&a.sw<=a.iw+1,vw.nm+': 가로 띠가 화면 아래 끝까지 (넘침 없음)');
   ok(vw.mob ? /탭/.test(a.nx) : /SPACE/.test(a.nx),vw.nm+': ▼ '+(vw.mob?'탭':'SPACE')+' 안내');
   await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } encTalk(); }); await p.waitForTimeout(600); await p.evaluate(DONE);
   const c = await p.evaluate(()=>{ talkLines([{ t: '...너, 어디로 가는 거야?', img: 'C-106_talk09' }], 'chin', encCur()); if (TK.timer) talkDone(); return 1; }); await p.waitForTimeout(600);
   const c2 = await p.evaluate(ST); console.log('    '+vw.nm+' 친칠라 말', JSON.stringify(c2));
   ok(/C-106_talk09/.test(c2.Rsrc)&&c2.R==='img:on'&&c2.L==='face:dim'&&c2.name&&c2.nameSide==='R',vw.nm+': NPC 가 말하면 오른쪽만 밝게 · 왼쪽은 어둡게 · 이름표는 오른쪽 ('+c2.name+')');
   ok(c2.rq[2]>(vw.mob?300:500)&&c2.rq[1]>=c2.iw-2,vw.nm+': 오른쪽 그림이 크고 화면 오른쪽 끝에 ('+c2.rq[2]+'px)');
   if (vw.mob) await p.screenshot({path:'_s7254_chin_mo.png'}); else await p.screenshot({path:'_s7254_chin.png'});
   // 아군 (레베카) 과 NPC (아이텐) — 레베카는 왼쪽 · 대화 끝까지
   await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } talkLines([{ who: 'C-002', t: '...안녕하세요! 와... 예쁜 방이네요' }, { t: '고마워. 아가씨도 한잔?', img: 'C-033_art' }], 'aiten', null); if (TK.timer) talkDone(); });
   await p.waitForTimeout(700); const r1 = await p.evaluate(ST);
   if (vw.mob) await p.screenshot({path:'_s7254_ally_mo.png'}); else await p.screenshot({path:'_s7254_ally.png'});
   await p.evaluate(()=>{ talkAdv(); if (TK.timer) talkDone(); }); await p.waitForTimeout(500); const r2 = await p.evaluate(ST);
   console.log('    '+vw.nm+' 레베카 · 아이텐', JSON.stringify([r1.L,r1.R,r1.name,r1.nameSide,r1.Lsrc]), JSON.stringify([r2.L,r2.R,r2.name,r2.nameSide,r2.Lsrc]));
   ok(r1.L==='img:on'&&/C-002_art/.test(r1.Lsrc)&&r1.name==='레베카'&&r1.nameSide==='L'&&r1.R==='img:dim',vw.nm+': 아군 (레베카) 이 NPC 와 말하면 왼쪽 · 이름표 왼쪽 · 오른쪽 NPC 는 어둡게');
   ok(r2.L==='img:dim'&&/C-002_art/.test(r2.Lsrc)&&r2.R==='img:on'&&r2.nameSide==='R',vw.nm+': 다음 줄 (NPC) — 레베카는 왼쪽에 남고 어둡게 · 오른쪽 밝게');
   // NPC 없이 아군 (모닝스타) 이 말함 → 오른쪽 · 새 그림들이 열림 (배경 투명)
   await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } talkLines([{ who: 'C-005', t: '키히히! 다 부숴 버리자고!', img: 'mstar_t1' }]); if (TK.timer) talkDone(); });
   await p.waitForTimeout(700); const m1 = await p.evaluate(ST); console.log('    '+vw.nm+' 모닝스타', JSON.stringify([m1.L,m1.R,m1.name,m1.Rsrc]));
   ok(m1.R==='img:on'&&/mstar_t1/.test(m1.Rsrc)&&m1.name==='모닝스타'&&m1.L.startsWith('face'),vw.nm+': NPC 없이 아군이 말하면 오른쪽 (모닝스타) · 왼쪽 인주');
   if (!vw.mob){
     const im = await p.evaluate(async()=>{ const out={}; for (const n of ['odile_t1','odile_t2','odile_t3','odile_t4','odile_t5','mstar_t1','mstar_t2','mstar_t3','C-002_art','C-221_art']){ const i=new Image(); i.src='art/'+n+'.webp'; try { await i.decode(); out[n]={ w:i.naturalWidth, h:i.naturalHeight }; } catch(e){ out[n]={ err:String(e) }; } } return out; });
     console.log('    그림', JSON.stringify(im)); ok(Object.values(im).every(x=>x.w>300&&x.h>800),'새 대화 그림 열 장이 열림 (오딜 5 · 모닝스타 3 · 레베카 · 탕아)');
     await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } talkLines([{ box: '권위 — 신성이 극도로 제한됩니다' }]); if (TK.timer) talkDone(); }); await p.waitForTimeout(400);
     const bx = await p.evaluate(()=>{ const r=document.getElementById('tkBox').getBoundingClientRect(); return { boxed: document.getElementById('talk').classList.contains('tk-boxed'), cx: Math.round(r.left+r.width/2), cy: Math.round(r.top+r.height/2), iw: innerWidth, ih: innerHeight, w: Math.round(r.width) }; });
     ok(bx.boxed&&Math.abs(bx.cx-bx.iw/2)<4&&Math.abs(bx.cy-bx.ih/2)<60&&bx.w<=530,'사각형 나레이션은 화면 가운데 상자');
     await p.evaluate(()=>{ while (TK){ if (TK.timer) talkDone(); talkAdv(); } talkLines([{ narr: '천장이 보이지 않을 만큼 높습니다. 가운데에 관 하나.' }]); if (TK.timer) talkDone(); }); await p.waitForTimeout(300);
     const n0 = await p.evaluate(ST); ok(n0.L==='none'&&n0.R==='none'&&n0.narr,'그림 없는 나레이션은 양쪽을 비움');
     // 클릭 · Space 로 넘어감
     const adv = await p.evaluate(()=>{ talkLines([{ t: '하나', img: 'C-033_art' }, { t: '둘', img: 'C-033_art' }], 'aiten', null); if (TK.timer) talkDone(); return TK.i; }); await p.mouse.click(640, 300); await p.waitForTimeout(100);
     const adv2 = await p.evaluate(()=>{ if (TK && TK.timer) talkDone(); return TK ? TK.i : -1; }); await p.keyboard.press('Space'); await p.waitForTimeout(100); const adv3 = await p.evaluate(()=>TK ? TK.i : -1);
     ok(adv===0&&adv2===1&&adv3===-1,'빈 곳 클릭 · Space 로 다음 줄 · 끝나면 닫힘'); }
   ok(!errs.length,vw.nm+' 오류 없음 '+errs.slice(0,2).join(' | ')); }
 await b.close(); console.log(fails?`${fails} FAIL`:'ALL UI7254 OK'); })();
