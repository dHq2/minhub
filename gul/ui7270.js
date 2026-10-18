// v7.27.0 UI 시험 — ui7270.js v1.0 (레지나: 인카운터 목록 ▶ → 복도 (아래) 에서 시작 · 맵 24 × 40 · 벽 · 기둥 · 화로 · 옥좌는 막힘 · 그림 셋이 열림 / 알현실에 들어서면 장면 그림 + "...또 누가 왔네." · 네 선택지 아님 (세 개) /
//   지나간다 → 옥좌 뒤 길 (↑ 단추가 생김) · 칼을 맞대 본다 → 적 레지나 (보스 · 흑갑 · 레지나의 검) · 쓰러지면 다음부터 빈 옥좌 / 세 번째 만남 → 같이 가자 → 동료 / 판을 다시 불러와도 오류 없음 / 새 대화 그림 / 목록은 '시험용' · 랜덤 몫 0)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const LINES = "(()=>{ const out=[]; for (let k=0;k<30&&TK;k++){ const nm=document.getElementById('tkName').textContent||'', i0=TK.i, f0=TK.full; if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ if (TK.i!==i0) out.push(nm+'|'+f0); return { out, ask: L.ask.map(a=>a[0]), bg: document.getElementById('talk').style.backgroundImage.slice(0,200) }; } out.push((document.getElementById('tkName').textContent||'')+'|'+TK.full); talkAdv(); } return { out, ask: null }; })()";
 const PICK = t => `(()=>{ if (TK && TK.timer) talkDone(); const bt=[...document.querySelectorAll('#tkCh button')].find(x=>x.textContent.includes('${t}')); if (!bt) return 'nobtn'; bt.click(); return 'ok'; })()`;
 const CLOSE = "(()=>{ for (let k=0;k<30&&TK;k++){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask) break; talkAdv(); } })()";
 const GO = "(()=>{ setMode('train'); document.querySelector('.tab[data-tab=\"enc\"]').click(); document.querySelector('[data-etry=\"regina\"]').click(); return 1; })()";
 const HALL = "(()=>{ const al=world.units.filter(u=>u.side===0&&u.alive); al.forEach((u,i)=>{ u.x=9.5+(i%5); u.y=9.5+Math.floor(i/5); }); mode='run'; paused=false; for (let k=0;k<12;k++) stepWorld(world,1/30); paused=true; mode='plan'; rgTick(world); return !!TK; })()";
 // 목록
 const lst = await p.evaluate(()=>{ setMode('train'); document.querySelector('.tab[data-tab="enc"]').click(); const pn=document.getElementById('pane-enc'); return { box: [...pn.querySelectorAll('.box > .lab')].some(x=>/레지나의 알현실/.test(x.textContent)), test: /시험용/.test(pn.innerText), btn: !!pn.querySelector('[data-etry="regina"]'), w: ENC3.find(e=>e.k==='regina').w }; });
 ok(lst.box&&lst.test&&lst.btn&&lst.w===0,'인카운터 목록: 레지나의 알현실 (시험용 · 랜덤 몫 0 · ▶)');
 // 그림
 const im = await p.evaluate(async()=>{ const out={}; for (const n of ['regina/boss','regina/hall','regina/throne','room/rg_cut','room/rg_bg','regina_t1','regina_t5','rebecca_t2','mstar_t8','C-106_talk06','riwan_t1','serpa_t1','pehto_t1','poren_t1']){ const i=new Image(); i.src='art/'+n+'.webp'; try { await i.decode(); out[n]=[i.naturalWidth,i.naturalHeight]; } catch(e){ out[n]='ERR'; } } return out; });
 console.log('    그림', JSON.stringify(im)); ok(Object.values(im).every(v=>Array.isArray(v)&&v[0]>200),'그림 열넷이 모두 열림 (알현실 · 복도 · 옥좌 · 장면 · 대화 그림)');
 // 1) 들어섬
 await p.evaluate(GO); await p.waitForTimeout(1200);
 const m1 = await p.evaluate(()=>{ const W=world, m=W.map; const blk=(x,y)=>rock(m,x+0.5,y+0.5); const al=W.units.filter(u=>u.side===0&&u.alive);
   return { W: m.W, H: m.H, reg: !!S.regina, ally: al.length, ys: al.map(u=>+u.y.toFixed(1)), xs: al.map(u=>+u.x.toFixed(1)), walls: [blk(0,5),blk(23,8),blk(12,0),blk(11,1),blk(5,20),blk(18,30),blk(2,14),blk(9,15)], open: [blk(12,8),blk(3,3),blk(20,12),blk(11,14),blk(12,15),blk(7,25),blk(16,39)], up: !!document.querySelector('#campBar [data-cexit="up"]'), tk: !!TK, st: encCur().st }; });
 console.log('    맵', JSON.stringify(m1));
 ok(m1.W===24&&m1.H===40&&m1.reg&&m1.ally>=5&&m1.ys.every(y=>y>35)&&m1.xs.every(x=>x>=7&&x<=17),'맵 24 × 40 · 복도 아래에서 시작 (모두 복도 안)');
 ok(m1.walls.every(Boolean)&&m1.open.every(v=>!v),'벽 · 기둥 · 화로 · 옥좌 · 복도 바깥은 막힘 · 알현실 바닥 · 문턱 · 복도 길은 열림');
 ok(!m1.up&&!m1.tk&&m1.st==='throne','처음엔 ↑ 단추 없음 · 대화 없음 (알현실에 들어서야)');
 // 복도에서 알현실로 실제로 걸어감 (길 찾기)
 const walk = await p.evaluate(()=>{ const h=world.units.find(u=>u.hero); h.order={k:'move',x:12,y:9}; h.ordLive=h.order; mode='run'; paused=false; let k=0; for (;k<30*30&&!TK;k++) stepWorld(world,1/30), rgTick(world); paused=true; mode='plan'; return { y: +h.y.toFixed(1), t: +(k/30).toFixed(1), tk: !!TK }; });
 console.log('    걸어감', JSON.stringify(walk)); ok(walk.tk&&walk.y<16,'인주가 복도를 걸어 문턱을 지나 알현실로 ('+walk.t+'초) → 들어서자 대화');
 const l1 = await p.evaluate(LINES); console.log('    첫마디', JSON.stringify(l1).slice(0,400));
 ok(l1.out.some(x=>/푸른 불꽃이 늘어선 알현실/.test(x))&&l1.out.some(x=>/또 누가 왔네/.test(x))&&JSON.stringify(l1.ask)===JSON.stringify(['이야기를 나눈다','칼을 맞대 본다','지나간다']),'들어서면 장면 그림 · "...또 누가 왔네." · 이야기 · 칼 · 지나간다 (첫 만남엔 영입 없음)');
 await p.screenshot({path:'_s7270_talk.png'});
 await p.evaluate(PICK('이야기를 나눈다')); const l2 = await p.evaluate(LINES); ok(l2.out.length>=1&&l2.ask&&l2.ask[0]==='이야기를 나눈다','이야기 → 한마디 → 다시 고름');
 await p.evaluate(PICK('지나간다')); await p.evaluate(CLOSE); await p.waitForTimeout(200);
 const ps = await p.evaluate(()=>({ st: encCur().st, stairs: world.stairs, up: !!document.querySelector('#campBar [data-cexit="up"]'), log: world.log.some(l=>l.k==='rgPass') }));
 ok(ps.st==='rpass'&&ps.stairs&&ps.up&&ps.log,'지나간다 → 옥좌 뒤 길 · ↑ 단추가 생김');
 await p.evaluate(()=>{ draw(); }); await p.screenshot({path:'_s7270_hall.png'});
 const ex = await p.evaluate(()=>{ const al=world.units.filter(u=>u.side===0&&u.alive); for (const u of al){ u.order={k:'exit',dir:'up',x:u.x}; u.ordLive=u.order; } mode='run'; paused=false; for (let k=0;k<30*30&&world.units.some(u=>u.side===0&&u.alive);k++) stepWorld(world,1/30); paused=true; mode='plan'; return world.units.filter(u=>u.side===0&&u.gone==='up').length; });
 ok(ex>=5,'옥좌 뒤 길로 모두 넘어감 ('+ex+')');
 // 2) 두 번째 판 — 싸움
 await p.evaluate(GO); await p.waitForTimeout(1200); await p.evaluate(HALL); await p.waitForTimeout(100);
 const l3 = await p.evaluate(LINES); ok(l3.out.some(x=>/또 너야/.test(x))&&l3.out.some(x=>/^레지나\|/.test(x)),'두 번째 만남: "또 너야?" · 이름 (레지나) 이 보임');
 await p.evaluate(PICK('칼을 맞대 본다')); await p.evaluate(CLOSE); await p.waitForTimeout(200);
 const f1 = await p.evaluate(()=>{ const u=world.units.find(x=>x.ref==='C-085'); return u ? { side: u.side, tr: u.traits, wn: u.wName, gear: u.gear&&u.gear['몸']&&u.gear['몸'].name, x: +u.x.toFixed(1), y: +u.y.toFixed(1), st: encCur().st, hp: Math.round(u.max) } : null; });
 console.log('    싸움', JSON.stringify(f1)); ok(f1&&f1.side===1&&f1.tr.includes('보스')&&f1.wn==='레지나의 검'&&f1.gear==='레지나의 흑갑'&&f1.st==='foe'&&f1.y>3,'칼을 맞대 본다 → 적 레지나 ([보스] · 레지나의 검 · 흑갑 · 옥좌에서 일어남)');
 const d1 = await p.evaluate(()=>{ const u=world.units.find(x=>x.ref==='C-085'); u.hp=0; u.alive=false; u.down=false; rgTick(world); return { dead: S.rgBond.dead, st: encCur().st, stairs: !!world.stairs }; });
 ok(d1.dead&&d1.st==='rdead'&&d1.stairs,'쓰러지면 죽음이 남고 옥좌 뒤 길이 열림');
 // 3) 세 번째 판 — 빈 옥좌
 await p.evaluate(GO); await p.waitForTimeout(1200); await p.evaluate(HALL);
 const l4 = await p.evaluate(LINES); ok(l4.out.some(x=>/옥좌는 비어 있다/.test(x))&&!l4.ask,'다음 판: 빈 옥좌 (대화 · 선택 없음)');
 // 4) 영입 (죽음을 지우고 세 번째 만남)
 await p.evaluate(()=>{ S.rgBond={ met: 2, dead: false, joined: false, lastRun: null }; save(); });
 await p.evaluate(GO); await p.waitForTimeout(1200); await p.evaluate(HALL);
 const l5 = await p.evaluate(LINES); ok(l5.ask&&l5.ask.includes('같이 가자')&&l5.out.some(x=>/이번엔 뭘 할 건데/.test(x)),'세 번째 만남: "왔어? 이번엔 뭘 할 건데." · 같이 가자');
 await p.evaluate(PICK('같이 가자')); await p.evaluate(CLOSE); await p.waitForTimeout(200);
 const j1 = await p.evaluate(()=>{ const u=world.units.find(x=>x.ref==='C-085'); return { side: u&&u.side, boss: u&&u.traits.includes('보스'), st: encCur().st, joined: S.rgBond.joined, stairs: !!world.stairs }; });
 ok(j1.side===0&&!j1.boss&&j1.st==='joined'&&j1.joined&&j1.stairs,'같이 가자 → 레지나가 동료 (보스 특성은 적일 때만) · 옥좌 뒤 길');
 // 5) 다시 불러오기 (레지나 맵에서)
 await p.evaluate(GO); await p.waitForTimeout(1000); await p.evaluate(()=>save());
 await p.reload(); await p.waitForTimeout(1500);
 const rl = await p.evaluate(()=>({ reg: !!S.regina, W: S.W, H: S.H }));
 ok(errs.length===0,'레지나 맵에서 다시 불러와도 오류 없음 '+JSON.stringify(rl)+' '+errs.slice(0,2).join(' | '));
 await b.close(); console.log(fails?`${fails} FAIL`:'ALL UI7270 OK'); })();
