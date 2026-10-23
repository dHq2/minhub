// v8.7.1 UI 시험 — ui8710.js v1.7 (v1.7: 맵 위 NPC 칸에선 인사 (v8.7.8 — 일행에 콜라이더 · 물레가 뽑히면 고르기 창) 를 건너뜀 — 고르기 창에서 시험 고리가 멈추던 것 · v1.6: v8.7.6 D1 — 페흐토의 투구 · 망토 갑주는 땅이 아니라 전리품으로 · v1.5: v8.7.4 맵 위 NPC 에 세르파 (수정동굴) — 10 · v1.4: 카드 그림은 묶음 (atlas) · v1.3: 히든 층은 히든 시험에서만 (나머지는 끔) · v1.2: 자기 검토 — 페흐토 손님 · 고급 드랍 · 노라의 짐 · 죽은 단독 개체 · 비전투 회랑 따라 나감 · v1.1: 영입 시험 전에 자리를 비움 (뽑기로 8명이면 가득 참) · v1.0: 맵 위 NPC 9 (판 안 대화 · 숨었다 나옴 · 판에 바로 영입 · 지도로 안 감) · 손님 로지나 (튐) · 셰도르 · 항복 (페흐토 · 아해) · 도감 카드 212 · 이름 있는 만남 20 (그림 · 행동 · 싸움) · 히든 층 2 · 단달로 약속 · 정예 전용 유물)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 await p.evaluate(TALKEND); await wait(p,250); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; const h=(R.hid||{})[R.f]; R.hid={}; if (h&&h!=='none'){ F8[R.f]=null; R.fm=r8Gen(R.f); r8MapShow(); } });   // 히든 층 끔 (무작위)
 // 판 하나 열기 (지정한 맵 위 NPC)
 await p.evaluate(()=>{ window.__open = (k, f) => { const R=R8S(); world=null; R.f=f||8; R.themes[R.f]=k==='ahae'?'yokai':(R.themes[R.f]||'medieval'); F8[R.f]=null; R.fm=r8Gen(R.f); const n=R.fm.rows[0][0]; n.ms='fight'; n.npc8=k; R.at=null; R.done=[]; R.gold=500; (R.flags=R.flags||{})['bow'+R.f]=1; r8Enter(n); return n; };
   window.__near = (E) => { const h=world.units.find(u=>u.side===0&&u.alive); h.x=E.x+1; h.y=E.y; }; });
 // 1. 맵 위 NPC 10 (v8.7.4 세르파 — 수정동굴) — 놓임 · 숨음 · 말 걸기 · 대화가 끝나도 판 그대로
 const npc = await p.evaluate((TE)=>{ const out={};
   for (const k of Object.keys(MNPC8)){ let n=__open(k); while (TK) talkAdv();
     const C=S.camp, E=C.stages[1].enc; if (!E){ out[k]= k==='ahae' && world.units.some(u=>u.r8surr) ? 'foe' : 'none'; continue; }
     const st0=E.st, live0=encLive(E); if (E.st==='hidden'){ for (const u of world.units) if (u.side===1){ u.alive=false; u.hp=0; } world.cleared=true; r8Tick(world); }
     const st1=E.st; __near(E); E.seen=true; encTalk(E); const opened=!!TK && TK.npc==='m_'+k; const L=TK? TK.lines.find(l=>l.ask):null;
     // 마지막 앞의 선택 (실제 행동) 을 고름
     const pick = L ? L.ask[0][1] : ''; if (TK) talkPick(pick); let guard=0; while (TK && guard++<30){ const L2=TK.lines[TK.i]; if (L2&&L2.ask){ talkPick(L2.ask[L2.ask.length-1][1]); continue; } if (TK.timer) talkDone(); talkAdv(); }
     const shop=!document.getElementById('run8').hidden && /상인/.test(document.getElementById('run8').innerHTML); if (shop) document.getElementById('r8shopX').click();
     out[k] = { st0, live0, st1, opened, pick, world: !!world && !world.over && S.camp.s===1, at: R8S().done.length, art: !!S.art8, prop: !MNPC8[k].prop || (MAPS8[S.art8].props||[]).some(q=>q.npc8) }; }
   return out; }, TALKEND);
 console.log('    맵 위 NPC', JSON.stringify(npc));
 const ks=Object.keys(npc); ok(ks.length===10&&ks.includes('serpa'),'맵 위 NPC 10 ('+ks.join(' · ')+')');
 ok(ks.every(k=>npc[k]==='foe'||(npc[k].opened&&npc[k].world&&npc[k].at===0)),'말을 걸면 대화 · 고른 뒤에도 판은 그대로 (지도로 안 감)');
 ok(['tent','nora'].every(k=>npc[k].st0==='hidden'&&!npc[k].live0&&npc[k].st1==='sit'),'천막 · 노라는 싸움 동안 숨었다가 끝나면 나옴');
 ok(ks.every(k=>npc[k]==='foe'||npc[k].prop),'천막 · 대장장이 · 왐 곁에 소품 (도감 그림)');
 // 2. 판 안 영입 (마리와 와킨 · 셰도르) → 판에 바로 · 끝나면 여정 동료
 const jn = await p.evaluate(()=>{ R8S().party=R8S().party.slice(0,5); __open('marie'); while (TK) talkAdv(); const n0=world.units.filter(u=>u.side===0).length; r8Act('marie'); let g=0; while (TK&&g++<20){ if (TK.timer) talkDone(); talkAdv(); }
   const n1=world.units.filter(u=>u.side===0).length; const W=world; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } W.cleared=true; for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); checkEnd(W); W.over=true; W.result=W.result||'exit'; mode='plan'; onOver();
   return { n0, n1, party: R8S().party.map(p=>p.name) }; });
 await p.evaluate(TALKEND); await p.evaluate(()=>{ const b=[...document.querySelectorAll('#banner button')].find(x=>/지도로/.test(x.textContent)); if (b) b.click(); }); await p.evaluate(TALKEND);
 console.log('    영입', JSON.stringify(jn));
 ok(jn.n1===jn.n0+2&&jn.party.includes('마리')&&jn.party.includes('와킨'),'판 안에서 마리와 와킨 영입 → 판에 바로 · 끝나면 여정 동료');
 // 3. 손님: 로지나 (두 판 · 위험하면 튐) · 셰도르
 const gs = await p.evaluate(()=>{ const R=R8S(); R.flags.rosinaHelp=2; R.flags.shedorHelp=1; __open('wam'); while (TK) talkAdv(); const W=world; const ro=W.units.find(u=>u.r8guest==='rosina'), sh=W.units.find(u=>u.r8guest==='shedor');
   const a={ ro: !!ro, sh: !!sh, left: R.flags.rosinaHelp }; ro.hp=ro.max*0.2; r8Tick(W); a.fled=!ro.alive||!!ro.gone; a.partyHas = R.party.some(p=>p.name==='로지나'); return a; });
 ok(gs.ro&&gs.sh&&gs.left===1&&gs.fled&&!gs.partyHas,'손님 로지나 · 셰도르가 판에 · 로지나는 35% 아래면 튐 · 여정 동료로는 안 셈 '+JSON.stringify(gs));
 // 4. 항복 — 유적의 페흐토 (빈사면 항복 → 데려감)
 const sr = await p.evaluate(()=>{ const R=R8S(); R.party=R.party.filter(q=>!['마리','와킨'].includes(q.name)).slice(0,6); world=null; R.f=9; F8[9]=null; R.themes[9]='temple'; R.fm=r8Gen(9); const n=R.fm.rows[2][0]; n.t='enc'; n.s=true; n.enc='x:pehtoR'; R.at=n.id; R.done=[]; r8Enter(n); while (TK){ const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); }
   const W=world; if (!W) return { none: true }; const pe=W.units.find(u=>u.side===1&&u.name==='페흐토'); const a={ map: (MAPS8[S.art8]||{}).base||S.art8, surr: !!(pe&&pe.r8surr) }; pe.hp=pe.max*0.15; r8Tick(W); a.gone=pe.gone; a.cleared=W.cleared;
   for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); checkEnd(W); W.over=true; W.result=W.result||'exit'; mode='plan'; onOver(); return a; });
 const sr2 = await p.evaluate(()=>{ let g0=0; while (TK&&g0++<50) talkAdv(); const btn=[...document.querySelectorAll('#banner button')].find(x=>/지도로/.test(x.textContent)); const bt=[...document.querySelectorAll('#banner button')].map(x=>x.textContent).join(','); if (btn) btn.click(); const L = TK && TK.lines.find(l=>l.ask); window.__sr = { bt, tk: TK ? TK.lines.map(l=>l.t||l.narr||l.box||(l.ask?'ASK':l.go)) : null }; const has = !!L && L.ask.some(a=>/영입/.test(a[0])); if (L){ while (TK){ const q=TK.lines[TK.i]; if (q&&q.ask){ talkPick(q.ask[0][1]); continue; } talkAdv(); } } let g=0; while (TK&&g++<20) talkAdv(); return { has, party: R8S().party.map(p=>p.name), dbg: window.__sr }; });
 console.log('    항복', JSON.stringify(sr), JSON.stringify(sr2));
 ok(sr.surr&&sr.gone==='surr'&&sr.cleared&&sr2.has&&sr2.party.includes('페흐토'),'페흐토 — 빈사면 항복 · 싸움 끝 · 데려가면 동료 (맵 '+sr.map+')');
 // 5. 도감 카드 — 212 · 그림 · 갈래마다 행동
 const cd = await p.evaluate(async ()=>{ const kinds={}; for (const c of CARD8){ const k=r8CardKind(c); kinds[k]=(kinds[k]||0)+1; }
   let bad=[]; await Promise.all(CARD8.map(c=>new Promise(r=>{ const im=new Image(); im.onload=r; im.onerror=()=>{ bad.push(c.id); r(); }; const A=CARDATLAS8[c.id]; if (!A){ bad.push(c.id+' 묶음 없음'); return r(); } im.src='art/card/atlas'+A[0]+'.webp'; })));
   const errs=[]; const R=R8S(); world=null; R.f=8; F8[8]=null; R.fm=r8Gen(8); for (const k of Object.keys(CARD_TXT8)) for (const [,a] of CARD_TXT8[k][1]){ if (a==='done') continue; R.at=R.fm.rows[2][0].id; R.gold=200; try { if (a==='cFight'||a==='cSneak'||a==='cOpen'){ const n=r8Node(R.at); n.t='enc'; } R8X[a](); let g=0; while (TK&&g++<20){ const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } talkAdv(); } world=null; } catch(e){ errs.push(a+': '+e.message); } }
   return { n: CARD8.length, kinds, bad, errs }; });
 console.log('    카드', JSON.stringify(cd));
 ok(cd.n===212&&!cd.bad.length&&Object.keys(cd.kinds).length>=6,'도감 조우 카드 212 — 그림 모두 · 갈래 '+Object.keys(cd.kinds).length);
 ok(!cd.errs.length,'카드 행동 모두 오류 없음 '+cd.errs.join(' | '));
 // 6. 이름 있는 만남 20 — 그림 · 모든 고름 · 싸움은 맵이 있는 판
 const xe = await p.evaluate(async ()=>{ const R=R8S(), out={ img: [], miss: [], errs: [], fights: {} }; const cap=[]; const tl0=talkLines;
   for (const [k] of XENC8){ world=null; R.f=12; F8[12]=null; R.fm=r8Gen(12); const n=R.fm.rows[2][0]; n.t='enc'; n.s=true; R.at=n.id; R.done=[]; R.npcDone=[]; R.gold=300; R.flags.dandal=0;
     let lines=null; window.talkLines = (L,a,b)=>{ if (!lines) lines=L; return tl0(L,a,b); }; try { r8XEvent(n,k); } catch(e){ out.errs.push(k+' 열기: '+e.message); }
     window.talkLines=tl0; for (const L of lines||[]){ if (L.cg) out.img.push('art/room/'+L.cg+'.webp'); if (L.img) out.img.push('art/'+L.img+'.webp'); }
     const acts=[...new Set((lines||[]).flatMap(L=>L.ask?L.ask.map(a=>a[1]):L.go?[L.go]:[]))].filter(a=>a&&a.startsWith('!r8:')).map(a=>a.slice(4));
     while (TK) talkClose();
     for (const a of acts){ if (a==='done') continue; world=null; R.at=n.id; n.t='enc'; R.gold=300; try { r8Act(a); let g=0; while (TK&&g++<40){ const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[0][1]); continue; } if (TK.timer) talkDone(); talkAdv(); }
         if (world&&world.r8&&!world.over){ out.fights[k+'/'+a]=((MAPS8[S.art8]||{}).base||S.art8||'없음')+' 적'+world.units.filter(u=>u.side===1).length; for (let i=0;i<60&&!world.over;i++) stepWorld(world,0.05); world=null; } }
       catch(e){ out.errs.push(k+'/'+a+': '+e.message); } } }
   out.img=[...new Set(out.img)]; await Promise.all(out.img.map(src=>new Promise(r=>{ const im=new Image(); im.onload=r; im.onerror=()=>{ out.miss.push(src); r(); }; im.src=src; }))); out.nImg=out.img.length; delete out.img; return out; });
 console.log('    만남', JSON.stringify(xe));
 ok(!xe.errs.length,'이름 있는 만남 20 — 모든 고름 오류 없음 '+xe.errs.slice(0,4).join(' | '));
 ok(!xe.miss.length&&xe.nImg>=30,'만남 그림 '+xe.nImg+' 모두 불러옴 '+xe.miss.join(' '));
 const fk=Object.keys(xe.fights); ok(fk.length>=7&&Object.values(xe.fights).every(v=>!/없음|적0$/.test(v)),'만남 싸움 '+fk.length+' — 모두 맵 · 적이 있는 판');
 // 7. 히든 층 — 하르겐의 성당 (빈 회랑 둘 → 하르겐 / 돌아 나가는 계단) · 과거의 칼데라
 const hd = await p.evaluate(()=>{ const R=R8S(), o={}; world=null; R.hid=R.hid||{}; R.hid[17]='hargen'; R.f=17; F8[17]=null; R.fm=r8Gen(17); const F=F8[17];
   o.plan=R.fm.rows.map(r=>r.map(n=>n.t+(n.src8?':'+n.src8:'')+(n.b?':'+n.b:'')).join('/')); o.name=F.name;
   R.at=null; R.done=[]; r8Enter(R.fm.rows[0][0]); while (TK) talkAdv(); o.empty={ fo: world.units.filter(u=>u.side===1).length, lock: world.exitLock, base: (MAPS8[S.art8]||{}).base };
   world=null; R.at=R.fm.rows[1][0].id; r8Enter(R.fm.rows[2][0]); while (TK) talkAdv(); o.boss={ art: S.art8, foes: world.units.filter(u=>u.side===1).map(u=>u.name) }; for (let i=0;i<100&&!world.over;i++) stepWorld(world,0.05);
   world=null; R.hid[4]='calderap'; R.f=4; F8[4]=null; R.fm=r8Gen(4); o.cplan=R.fm.rows.map(r=>r.map(n=>n.t+(n.b?':'+n.b:'')).join('/')); R.at=R.fm.rows[0][0].id; r8Enter(R.fm.rows[1][0]); while (TK) talkAdv(); o.cboss={ art: S.art8, foes: world.units.filter(u=>u.side===1).map(u=>u.name) }; world=null;
   // 확률: 2 ~ 9 · 16 ~ 28층만 · 여정에 한 번
   let nh=0, bad=0; for (let t=0;t<400;t++){ R.hid={}; R.flags.hargenSeen=0; R.flags.calderapSeen=0; for (let f=2; f<=29; f++){ const H=r8Hidden(f); if (H){ nh++; if (FIX8[f]||(H.name.includes('하르겐')&&(f<16||f>28))||(H.name.includes('칼데라')&&f>9)) bad++; } } }
   o.rate=nh/400; o.bad=bad; R.hid={}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; return o; });
 console.log('    히든', JSON.stringify(hd));
 ok(hd.plan.length===3&&/hargen0a/.test(hd.plan[0])&&/boss:hargen\/stairs/.test(hd.plan[2])&&hd.empty.fo===0&&!hd.empty.lock,'하르겐의 성당 — 빈 회랑 (출구 열림) 둘 → 하르겐 / 돌아 나가는 계단');
 ok(hd.boss.art==='hargen1'&&hd.boss.foes.includes('하르겐')&&hd.cboss.art==='calderap'&&hd.cboss.foes.includes('고대 몬스터 데두라'),'히든 보스: 하르겐 (성당 맵) · 데두라 (과거의 칼데라)');
 ok(hd.bad===0&&hd.rate>0.3&&hd.rate<1.6,'히든 층은 2 ~ 9 · 16 ~ 28층의 무작위 층에서만 · 여정에 한 번씩 (여정당 '+hd.rate.toFixed(2)+')');
 // 8. 만남 뽑기: x: · c: 가 섞임 · 단달로 약속 · 한 번 본 이름 있는 만남은 다시 안 나옴
const ec = await p.evaluate(()=>{ const R=R8S(); R.hid={}; R.f=12; F8[12]=null; R.fm=r8Gen(12); const cnt={x:0,c:0,o:0}; for (let t=0;t<300;t++){ world=null; R.f=12; R.npcDone=[]; const n={ id:'tst'+t, t:'enc' }; R.fm.rows[2].push(n); R.at=n.id; r8Enc(n); while (TK) talkClose(); r8Hide(); const k=n.enc; cnt[k.startsWith('x:')?'x':k.startsWith('c:')?'c':'o']++; R.fm.rows[2].pop(); }
   world=null; R.flags.dandal=1; const n={ id:'tsd', t:'enc' }; R.fm.rows[2].push(n); R.at=n.id; r8Enc(n); const dd=n.enc; while (TK) talkClose(); R.fm.rows[2].pop();
   R.npcDone=['x:bell']; let bell=0; for (let t=0;t<300;t++){ const m={ id:'tb'+t, t:'enc' }; R.fm.rows[2].push(m); R.at=m.id; R.flags.dandal=0; r8Enc(m); while (TK) talkClose(); if (m.enc==='x:bell') bell++; R.fm.rows[2].pop(); }
   r8Hide(); return { cnt, dd, bell }; });
 console.log('    만남 뽑기', JSON.stringify(ec));
 ok(ec.cnt.x>30&&ec.cnt.c>30&&ec.cnt.o>30,'만남 칸 = 1F 인물 · 글 만남 · 이름 있는 만남 · 도감 카드가 섞임');
 ok(ec.dd==='x:dandal'&&ec.bell===0,'로지나 약속 → 다음 만남은 단달로의 저택 · 본 만남 (벨) 은 다시 안 나옴');
 // 9. 정예 전용 유물 — 사르딜 락 → 비늘조각
 const rl = await p.evaluate(()=>{ const R=R8S(); world=null; R.relics=R.relics.filter(k=>k!=='scale'); R.f=12; F8[12]=null; R.fm=r8Gen(12); const n=R.fm.rows[2][0]; n.t='enc'; R.at=n.id; R.done=[]; r8XFight('x_sardil','lakeruin'); while (TK) talkAdv(); const W=world; for (const u of W.units) if (u.side===1){ u.alive=false; u.hp=0; } W.cleared=true; for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); checkEnd(W); W.over=true; W.result=W.result||'exit'; mode='plan'; onOver(); return R.relics.includes('scale'); });
 await p.evaluate(TALKEND); ok(rl,'사르딜 락을 이기면 사르딜락의 비늘조각');
 // 11. 자기 검토: 페흐토 손님 · 죽이면 고급 투구 · 망토 · 노라의 짐 · 죽은 단독 개체는 맵에 다시 안 나옴 · 빈 회랑에서 대장이 나가면 모두 따라감
 const au = await p.evaluate(()=>{ const R=R8S(), o={}; const rr=Math.random;
   world=null; R.f=8; F8[8]=null; R.themes[8]='medieval'; R.fm=r8Gen(8); R.flags.pehtoDead=0; R.party=R.party.filter(q=>q.name!=='페흐토'); const n=R.fm.rows[0][0]; n.ms='fight'; n.npc8=null; R.at=null; R.done=[]; Math.random=()=>0.01; try { r8Enter(n); } finally { Math.random=rr; } while (TK) talkAdv();
   o.guest=world.units.some(u=>u.side===0&&u.r8guest==='pehto'&&u.name==='페흐토');
   world=null; const m=R.fm.rows[2][0]; m.t='enc'; R.at=m.id; r8XFight('x_pehto','ruina',{}); while (TK) talkAdv(); const W=world, pe=W.units.find(u=>u.side===1&&u.name==='페흐토'); pe.alive=false; pe.hp=0; r8Tick(W);
   o.drops=lootOf(W).filter(it=>/페흐토의 (투구|망토 갑주)/.test(it.label||it.name||'')).map(it=>it.k+':'+it.tier); o.ground=W.items.filter(it=>it.k==='helm'||it.k==='armor').length; o.dead=!!R.flags.pehtoDead; world=null;
   R.npcDone=[]; let pr=0; for (let t=0;t<200;t++){ const q={ id:'tp'+t, t:'enc' }; R.fm.rows[2].push(q); R.at=q.id; r8Enc(q); while (TK) talkClose(); if (q.enc==='x:pehtoR') pr++; R.fm.rows[2].pop(); world=null; } r8Hide(); o.pehtoR=pr;
   const g0=R.gold, rew=[]; r8NoraLoot(rew); o.nora={ gold: R.gold-g0, txt: rew[0] };
   R.dead=[...R.dead,'마리']; R.party=R.party.filter(q=>q.name!=='마리'); let mar=0; for (let t=0;t<60;t++){ world=null; const k=R.fm.rows[0][0]; k.npc8=undefined; k.ms='fight'; R.at=null; R.done=[]; Math.random=()=>0.05; try { r8Enter(k); } finally { Math.random=rr; } while (TK) talkAdv(); if (k.npc8==='marie') mar++; } o.marie=mar;
   world=null; R.hid={17:'hargen'}; R.f=17; F8[17]=null; R.fm=r8Gen(17); R.at=null; R.done=[]; r8Enter(R.fm.rows[0][0]); while (TK) talkAdv(); const W2=world, al=W2.units.filter(u=>u.side===0&&u.alive), h=al.find(u=>u.hero)||al[0];
   leaveMap(W2,h,'up'); for (let i=0;i<120&&!W2.over;i++){ stepWorld(W2,0.05); r8Tick(W2); } o.follow={ n: al.length, gone: al.filter(u=>u.gone==='up').length, over: !!W2.over }; R.hid={}; world=null; return o; });
 console.log('    자기 검토', JSON.stringify(au));
 ok(au.guest,'페흐토가 가끔 보통 싸움에 손님으로 끼어듦');
 ok(au.drops.includes('helm:3')&&au.drops.includes('armor:3')&&au.ground===0&&au.dead&&au.pehtoR===0,'페흐토를 죽이면 고급 투구 · 망토 갑주 (싸움이 끝나면 전리품 — 땅에는 무기 · 방패만) · 그 뒤 유적의 페흐토 안 나옴');
 ok(au.nora.gold===120&&/탄 가득/.test(au.nora.txt),'노라를 쓰러뜨리면 상품 모두 ('+au.nora.txt+')');
 ok(au.marie===0,'죽은 마리는 맵 위에 다시 안 나옴');
 ok(au.follow.gone===au.follow.n||au.follow.over,'비전투 회랑: 대장이 나가면 모두 따라 나감 '+JSON.stringify(au.follow));
 // 10. 화면: 맵 위 NPC (천막)
 await p.evaluate(()=>{ __open('tent'); while (TK) talkAdv(); const E=S.camp.stages[1].enc; for (const u of world.units) if (u.side===1){ u.alive=false; u.hp=0; } world.cleared=true; r8Tick(world); __near(E); E.seen=true; }); await wait(p,600);
 await p.screenshot({ path: 'shots/v871_tent.png' });
 await p.evaluate(()=>{ const E=S.camp.stages[1].enc; encTalk(E); }); await wait(p,500); await p.screenshot({ path: 'shots/v871_talk.png' }); await p.evaluate(TALKEND);
 await p.evaluate(()=>{ world=null; const R=R8S(); const n=R.fm.rows[2][0]; n.t='enc'; R.at=n.id; r8XEvent(n,'chicken'); }); await wait(p,500); await p.screenshot({ path: 'shots/v871_chicken.png' }); await p.evaluate(()=>{ while (TK) talkClose(); });
 const cs = await p.evaluate(()=>{ world=null; const R=R8S(); const n=R.fm.rows[2][0]; n.t='enc'; n.card8='ENC-riddle'; R.at=n.id; r8Card(n); const el=document.getElementById('tkCard8'); return { shown: !!el&&!el.hidden, w: el?el.clientWidth:0, h: el?el.clientHeight:0, bg: el?el.style.backgroundImage:'' }; });
 await wait(p,600); await p.screenshot({ path: 'shots/v871_card.png' }); await p.evaluate(()=>{ while (TK) talkClose(); });
 ok(cs.shown&&cs.h>100&&/atlas/.test(cs.bg),'도감 카드 — 묶음 그림에서 그 칸을 가운데 크게 '+JSON.stringify(cs));
 ok(!errs.length,'페이지 오류 없음 '+errs.slice(0,3).join(' | '));
 console.log(fails?'FAIL '+fails:'ALL OK'); await b.close(); process.exit(fails?1:0);
})();
