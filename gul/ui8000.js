// (v8.8.7: 2층이 고정층 (무너진 유적) 이 되어, 옛 2층 흐름을 쓰는 이 시험은 FIX8[2] 를 지우고 시작)
// v8.0.0 UI 시험 — ui8000.js v1.8 (v1.8: 들어온 자리 단추는 ▲ 올라가는 계단 (v8.8.0 — 예전 ↩ 물러나기) · v1.7: 히든 층 (과거의 칼데라 6%) 끔 — 나오면 층 줄이 2 · 다른 지대 맵이라 시험이 어긋남 · 맵 그림은 불러올 때까지 기다림 (최대 6초) · 들어서는 곳의 바닥이 동료 수보다 적으면 곁 칸 (3칸) 까지 들어선 것으로 봄 (예전 sewer2 처럼 가끔 어긋나던 것) · v1.6: 세르파는 보스판에서 오지 않음 — 보스판 앞뒤를 비교 (앞선 수정동굴 맵에서 만남으로 이미 동료가 된 판이 있음) · v1.5: v8.7.4 5층 보스는 붉은암석 · 세르파는 만남 영입 동료 · v1.4: v8.7.3 출구는 누가 보기 전엔 모름 — 끝난 판 단추는 🔎 출구 찾기 → 찾으면 ▼ 출구로 · v1.3: v8.7.0 여정 구조 v2 — 층 흐름 8줄 (첫 줄 MS 하나 · 맨 위 층 보스) · 싸움판은 맵을 잘라 만든 구획 (S.art8 = '~…' · base 가 그 지대의 맵) · 모든 맵 돌리기도 구획으로 · v1.2: v1.2: 판 위의 확인 창 — 자동 시험은 __askAuto 로 바로 '예' · v1.1: 결승 전용 링 맵은 모든 맵 돌리기에서 뺌 · v1.0: 30층 여정: 프롤로그 끝 → ▼ 2층으로 · 층 카드 · 뽑기 · 갈림길 지도 · 싸움 칸 (그림 맵 · 들어온 자리 · 출구 · 물러남) · 보상 · 쉼터 · 상인 · 보물 · 글 만남 · 인카운터 칸 · 보스 (세르파 영입) · 고정 (여신) · 정산 10 · 20 (MC) · 결말 · 다시 열기 · 모든 그림 맵 · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); }";
 const TALKYES = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 for (const vw of [{width:1280,height:860,nm:'pc'},{width:412,height:880,nm:'mo',mob:true}]){
 const ctx=await b.newContext({viewport:{width:vw.width,height:vw.height},...(vw.mob?{isMobile:true,hasTouch:true,deviceScaleFactor:2}:{})}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000); await p.evaluate(()=>{ delete FIX8[2]; });   /* v8.8.7 옛 2층 (무작위 지대) 흐름으로 시험 */
 console.log('== '+vw.nm);
 // 1. 프롤로그 끝 → 2층
 const a = await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); return { btn: !!document.getElementById('campRun8'), n: party.length }; });
 ok(a.btn,'프롤로그 끝 화면에 ▼ 2층으로 — 30층 여정 ('+a.n+'명)');
 await p.evaluate(()=>document.getElementById('campRun8').click()); await wait(p,100);
 await p.evaluate(TALKEND); await wait(p,250);
 await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; const h=(R.hid||{})[R.f]; R.hid={}; if (h&&h!=='none'){ F8[R.f]=null; R.fm=r8Gen(R.f); } });   // 히든 층 끔 (무작위 6% — 과거의 칼데라면 줄 2 · 다른 맵)
 const d = await p.evaluate(()=>{ const R=R8S(); return { on: run8On(), f: R&&R.f, cards: document.querySelectorAll('#run8 [data-r8d]').length, gold: R.gold }; });
 ok(d.on&&d.f===2&&d.cards===3,'2층 — 층 카드 뒤 뽑기 세 장 ('+JSON.stringify(d)+')');
 await p.evaluate(()=>{ document.getElementById('r8dAll').click(); }); await wait(p,50);
 const d2 = await p.evaluate(()=>{ const R=R8S(), n0=R.party.length, r0=R.relics.length, g0=R.gold; document.getElementById('r8dGo').click(); return { got: R.party.length-n0+R.relics.length-r0+(R.gold>g0?1:0), av: document.querySelectorAll('#run8 .r8n.av').length, rows: R.fm.rows.length, top: R.fm.rows[R.fm.rows.length-1][0].t }; });
 ok(d2.got>=1&&d2.av>=1&&d2.rows===8&&d2.top==='elite','뽑기를 받고 층 지도 (빛나는 칸 '+d2.av+' · 줄 '+d2.rows+' · 맨 위 층 보스)');
 if (vw.mob){ const sw = await p.evaluate(()=>({ sw: document.getElementById('run8').scrollWidth, w: innerWidth })); ok(sw.sw<=sw.w+1,'휴대폰: 지도가 옆으로 넘치지 않음 ('+sw.sw+'/'+sw.w+')'); }
 // 2. 싸움 칸
 await p.evaluate(()=>{ const id=r8Avail()[0]; const q=()=>document.querySelector(`[data-r8n="${id}"]`); q().click(); q().click(); }); await wait(p,300);
 const bt = await p.evaluate(()=>{ const W=world, M=MAPS8[S.art8], al=W.units.filter(u=>u.side===0), fo=W.units.filter(u=>u.side===1);
   let nIn=0; for (let y=M.in[1];y<=M.in[3];y++) for (let x=M.in[0];x<=M.in[2];x++) if (M.rows[y]&&M.rows[y][x]&&M.rows[y][x]!=='#') nIn++; const mg=nIn<al.length?3:1;   /* 들어서는 곳이 동료 수보다 좁으면 (바닥 8 ~ 9칸인 맵이 스물 남짓) 곁 칸에 이어 섬 */
   const inIn=al.every(u=>u.x>=M.in[0]-mg+1&&u.x<=M.in[2]+mg&&u.y>=M.in[1]-mg+1&&u.y<=M.in[3]+mg), onFloor=W.units.every(u=>M.rows[Math.floor(u.y)][Math.floor(u.x)]!=='#');
   const bar=document.getElementById('campBar').innerHTML; return { lock: W.exitLock, art: S.art8, base: M.base, inTheme: THEME8[F8[2].theme].maps.includes(M.base), W: S.W, H: S.H, nx: M.NX, al: al.length, fo: fo.length, inIn, onFloor, st: W.stairs, en: W.entry, r8: W.r8, bar: /2층 · 싸움/.test(bar), up: /data-cexit="up"/.test(bar), down: /data-cexit="down"[^>]*>▲ 올라가는 계단/.test(bar) }; });
 console.log('    싸움', JSON.stringify(bt));
 ok(bt.base&&bt.inTheme&&bt.art.startsWith('~')&&bt.W===bt.nx&&bt.fo>=3,'2층 싸움 = 그 층 지대 맵 ('+bt.base+') 의 구획 · 적 '+bt.fo);
 ok(bt.inIn&&bt.onFloor,'아군은 들어선 곳 안 · 모두 막힌 칸 밖');
 ok(bt.st&&bt.en&&bt.r8&&bt.r8.t==='fight','출구 계단 · 들어온 자리 · 여정 표시');
 ok(bt.bar&&(bt.lock?!bt.up:bt.up)&&bt.down,'캠페인 띠: 2층 · 싸움 · 끝나기 전엔 출구 단추 없음 (지나가기 · 칼데라는 처음부터 있음) · ▲ 올라가는 계단');
 await p.evaluate(TALKEND); await wait(p,200);
 await p.waitForFunction(()=>{ const a=ART8IMG[MAPS8[S.art8].src]; return a&&a.naturalWidth>0; },null,{timeout:6000}).catch(()=>{});   // 큰 맵 그림은 불러오는 데 시간이 걸림
 const img = await p.evaluate(()=>{ const a=ART8IMG[MAPS8[S.art8].src]; return a&&a.naturalWidth; }); ok(img>500,'그림 맵 그림을 불러옴 ('+img+'px)');
 // 물러남: 들어온 자리로 가서 나감
 const rt = await p.evaluate(()=>{ const W=world, u=W.units.find(x=>x.side===0&&x.alive); const o={ k:'exit', dir:'down', x:u.x }; u.order=o; exitStep(W,u,o,1/60); const mood=u.mood; const far=!u.gone; u.x=W.entry.x+0.3; u.y=W.entry.y; exitStep(W,u,o,1/60); return { mood, far, gone: u.gone }; });
 ok(rt.gone==='down','▲ 올라가는 계단 — 들어온 자리로 가서 나감 ('+JSON.stringify(rt)+')');
 // 이기고 출구로
 const win = await p.evaluate(()=>{ const W=world; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } W.cleared=true; campBarRender(true); const hid=!!(W.exitHide&&!W.exitSeen), bar0=document.getElementById('campBar').innerHTML; W.exitSeen=true; campBarRender(true); const bar=document.getElementById('campBar').innerHTML; const g0=R8S().gold;
   for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); checkEnd(W); W.over=true; W.result=W.result||'exit'; mode='plan'; onOver(); return { find: !hid || /출구 찾기/.test(bar0), exit: /▼ 출구로/.test(bar), bn: !document.getElementById('banner').hidden, txt: document.getElementById('banner').textContent, g0 }; });
 ok(win.find&&win.exit,'끝난 판 — 출구를 못 찾았으면 🔎 출구 찾기 · 찾으면 ▼ 출구로 단추');
 ok(win.bn&&/^2층 정산/.test(win.txt)&&/지도로/.test(win.txt)&&/얻은 것/.test(win.txt),'정산 화면 (N층 정산) · 얻은 것 · 지도로');
 const back = await p.evaluate(()=>{ const bs=[...document.querySelectorAll('#banner button')].find(x=>/지도로/.test(x.textContent)); if (bs) bs.click(); const R=R8S(); return { map: !document.getElementById('run8').hidden, done: R.done.length, gold: R.gold, party: R.party.length, av: r8Avail().length }; });
 ok(back.map&&back.done===1&&back.gold>win.g0&&back.av>=1,'지도로 돌아옴 — 칸 끝 · 동전 늚 ('+JSON.stringify(back)+')');
 // 3. 물러난 칸은 다시 고를 수 있음
 const ret = await p.evaluate(()=>{ const R=R8S(), id=r8Avail()[0], n=r8Node(id); n.t='fight'; r8Enter(n); const W=world; for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'down'); W.over=true; W.result='exit'; mode='plan'; onOver(); return { map: !document.getElementById('run8').hidden, done: R.done.includes(id), av: r8Avail().includes(id), party: R.party.length }; });
 await p.evaluate(TALKEND);
 ok(ret.map&&!ret.done&&ret.av,'물러남 — 칸은 그대로 · 다시 고를 수 있음');
 // 4. 쉼터 · 상인 · 보물 · 글 만남
 const nd = await p.evaluate((TE)=>{ const R=R8S(), out={}; const fake=t=>{ const n={ id:'x'+t+Math.random(), r:1, i:0, t, x:.5, next:[] }; R.fm.rows[1].push(n); R.at=n.id; return n; };
   for (const p of R.party) p.hpNow=10; r8RestPanel(fake('rest')); document.getElementById('r8rest').click(); out.rest=R.party.every(p=>p.hpNow>10);
   R.gold=500; const sn=fake('shop'); r8ShopPanel(sn); const r0=R.relics.length; document.querySelector('[data-r8buy="0"]').click(); out.shop=R.relics.length===r0+1&&R.gold<500; document.getElementById('r8shopX').click();
   const cn=fake('chest'); cn.mimic=true; const r1=R.relics.length; r8ChestPanel(cn); out.chest=R.relics.length===r1+1||R.relics.length===RELIC8_POOL.length; document.getElementById('r8chX').click();
   const en=fake('enc'); r8TextEvent(en,'smith'); out.talk=!document.getElementById('talk').hidden; out.name=document.getElementById('tkName').textContent; eval(TE); out.encDone=R.done.includes(en.id);
   const un=fake('enc'); const hp0=R.party.map(p=>statsOf(p,rules).hp); r8TextEvent(un,'uncle'); eval(TE); out.uncle=R.party.every((p,i)=>statsOf(p,rules).hp===hp0[i]+5);
   const an=fake('enc'); r8TextEvent(an,'admin'); out.adm=document.getElementById('tkImg').getAttribute('src'); eval(TE);
   return out; }, TALKEND);
 console.log('    칸', JSON.stringify(nd));
 ok(nd.rest,'쉼터 — 쉬기 (모두 회복)'); ok(nd.shop,'상인 — 유물을 삼'); ok(nd.chest,'보물 — 유물 하나'); ok(nd.talk&&nd.encDone,'글 만남 (탄탄만) — 대화 · 지나가면 칸 끝'); ok(nd.uncle,'무서운 아재 — 모두 체력 +5');
 ok(/run8\/admin/.test(nd.adm||''),'관리자 그림 (art/run8/admin)');
 // 5. 인카운터 칸 (1F 의 만남을 그대로)
 const npc = await p.evaluate(()=>{ const R=R8S(); const n={ id:'xnpc', r:1, i:0, t:'enc', x:.5, next:[] }; R.fm.rows[1].push(n); R.at=n.id; r8NpcNode(n,'aiten'); const bar=document.getElementById('campBar').innerHTML; return { s: S.camp.s, w: !!world, art: S.art8, bar: /층 · 만남/.test(bar), ld: (document.getElementById('ldFx').textContent||'') }; });
 await wait(p,100); await p.evaluate(()=>{ if (typeof ldEnd==='function') ldEnd(true); }); await p.evaluate(TALKEND);
 ok(npc.s===3&&npc.w&&!npc.art&&npc.bar,'인카운터 칸 — 1F 의 만남 맵 (아이텐) · 띠 N층 · 만남');
 const npc2 = await p.evaluate(()=>{ const W=world, R=R8S(); for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); W.over=true; W.result='exit'; mode='plan'; onOver(); const bs=[...document.querySelectorAll('#banner button')].find(x=>/지도로/.test(x.textContent)); if (bs) bs.click(); return { map: !document.getElementById('run8').hidden, done: R.done.includes('xnpc'), on: run8On() }; });
 ok(npc2.map&&npc2.done&&npc2.on,'만남 맵을 나가면 지도로 · 칸 끝');
 // 6. 보스 (5층 붉은암석 — v8.7.4) → 6층 · 세르파는 보스가 아님 (수정동굴의 만남 칸에서 영입)
 const bs = await p.evaluate(()=>{ const R=R8S(); R.party=R.party.slice(0,7); r8FloorEnter(5); return R.f; }); await wait(p,200);
 await p.evaluate(()=>{ const D=document.getElementById('r8dAll'); if (D){ D.click(); document.getElementById('r8dGo').click(); } });
 const bs2 = await p.evaluate(()=>{ const R=R8S(), top=R.fm.rows[R.fm.rows.length-1][0]; R.at=R.fm.rows[R.fm.rows.length-2][0].id; R.done.push(R.at); const serpa0=R.party.some(p=>p.ref==='C-277'); r8Enter(top); const W=world; return { serpa0, t: top.t, b: top.b, art: S.art8, base: MAPS8[S.art8].base, foes: W.units.filter(u=>u.side===1).length, names: [...new Set(W.units.filter(u=>u.side===1).map(u=>u.name.replace(/\s*\d+$/,'')))].join(',') }; });
 await wait(p,100); await p.evaluate(TALKEND);
 console.log('    보스', JSON.stringify(bs2)); ok(bs2.t==='boss'&&bs2.b==='redrock'&&/crystal/.test(bs2.base)&&bs2.foes>=1&&/붉은암석/.test(bs2.names),'5층 보스 칸 — 수정동굴 · 붉은암석');
 const bs3 = await p.evaluate((TE)=>{ const W=world, R=R8S(); for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } W.cleared=true; for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); W.over=true; W.result='exit'; mode='plan'; onOver(); const bs=[...document.querySelectorAll('#banner button')].find(x=>/지도로/.test(x.textContent)); if (bs) bs.click(); const serpa=R.party.some(p=>p.ref==='C-277'); eval(TE); return { serpa, f: R.f, cards: document.querySelectorAll('#run8 [data-r8d]').length }; }, TALKEND);
 await wait(p,200);
 const bs4 = await p.evaluate(()=>({ f: R8S().f, cards: document.querySelectorAll('#run8 [data-r8d]').length }));
 ok(bs3.serpa===bs2.serpa0&&bs4.f===6,'붉은암석을 쓰러뜨리면 6층 (세르파는 보스판에서 오지 않음 — 앞 '+bs2.serpa0+' · 뒤 '+bs3.serpa+') ('+JSON.stringify(bs4)+')');
 // 7. 고정 (3층 여신의 호수)
 const fx = await p.evaluate((TE)=>{ const R=R8S(), t0=R.tears; const n={ id:'fixed', t:'fixed', k:'goddess', r:5, i:0, x:.5, next:[] }; R.fm.rows.push([n]); R.at=n.id; r8Fixed(n); const bg=document.getElementById('talk').style.backgroundImage; eval(TE); return { tear: R.tears-t0, bg: /r8_goddess/.test(bg) }; }, TALKEND);
 ok(fx.tear===1&&fx.bg,'여신의 호수 — 장면 그림 · 여신의 눈물 ①');
 // 8. 정산 10 → 11층
 const st = await p.evaluate(()=>{ const R=R8S(); R.f=10; r8AfterBoss({ t:'boss', b:'regina' }); const has=!!document.getElementById('r8on')&&!!document.getElementById('r8out'); for (const p of R.party) p.hpNow=1; document.getElementById('r8on').click(); return { has, f: R.f, full: R.party.every(p=>p.hpNow>1) }; });
 ok(st.has&&st.f===11&&st.full,'10층 정산 — 나감 / 계속 (계속 → 모두 회복 · 11층)');
 // 9. 20층 정산 → MC 더 플링 → 21층
 const mc = await p.evaluate((TE)=>{ const R=R8S(); R.f=20; r8AfterBoss({ t:'boss', b:'theron' }); document.getElementById('r8on').click(); const nm=[]; while (TK){ if (TK.timer) talkDone(); nm.push(document.getElementById('tkName').textContent); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); } return { mc: nm.includes('MC 더 플링'), crowd: R.crowd, f: R.f }; }, TALKEND);
 await wait(p,200);
 const mc2 = await p.evaluate(()=>({ f: R8S().f }));
 ok(mc.mc&&mc.crowd===60&&mc2.f===21,'20층 — MC 더 플링 등장 (이름 띠) · 관중 열기 · 21층');
 // 10. 다시 열기 (저장 → 새로 고침 → 지도)
 await p.evaluate(()=>save()); await p.reload(); await wait(p,1400);
 const re = await p.evaluate(()=>({ on: run8On(), f: R8S()&&R8S().f, map: !!document.getElementById('run8')&&!document.getElementById('run8').hidden }));
 ok(re.on&&re.f===21&&re.map,'새로 고침 — 여정이 그대로 · 지도');
 // 11. 모든 그림 맵에서 판이 섬
 const all = await p.evaluate(()=>{ const R=R8S(), bad=[]; const F=F8[R.f], m0=F.maps; const ids=Object.keys(MAPS8).filter(k=>k!=='stadium'&&k!=='ring'&&!MAPS8[k].sec);
   for (const id of ids){ F.maps=[id]; const n={ id:'m_'+id, r:1, i:0, t:'fight', x:.5, next:[], seed: 5 }; R.fm.rows[1].push(n); R.at=n.id; try { r8Battle(n); } catch (e) { bad.push(id+':'+e.message); continue; } const W=world, M=MAPS8[S.art8];
     if (M.base!==id) bad.push(id+':art'); if (!W.units.every(u=>M.rows[Math.floor(u.y)]&&M.rows[Math.floor(u.y)][Math.floor(u.x)]!=='#')) bad.push(id+':wall'); if (W.units.filter(u=>u.side===1).length<2) bad.push(id+':foes');
     if (Math.abs(W.stairs.x-0.5-M.out[0])>0.01) bad.push(id+':out');
     for (let k=0;k<40;k++) stepWorld(W,0.05); draw(); if (TK) { while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); } } }
   F.maps=m0; return { n: ids.length, bad }; });
 console.log('    맵', JSON.stringify(all)); ok(!all.bad.length&&all.n>=30,'그림 맵 '+all.n+'개 모두 — 배치 · 출구 · 몇 초 돌려 보기 · 그리기');
 // 12. 결말
 const end = await p.evaluate(()=>{ const R=R8S(); r8End('out20'); const t=document.getElementById('run8').textContent; const log=(S.storyLog||[])[0]; document.getElementById('r8fin').click(); return { t: /20층 생환/.test(t), log: log&&log.kind, camp: !!S.camp }; });
 ok(end.t&&end.log==='run:out20'&&!end.camp,'결말 (20층 생환) — 이야기 기록 · 끝내기');
 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 await ctx.close(); }
 console.log(fails ? 'FAIL '+fails : 'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
