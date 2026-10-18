// v7.26.0 UI 시험 — ui7260.js v1.1 (v1.1: 선택지 바로 앞 줄도 읽음 · 오딜의 방: 축복 엔진 (공격 × 1.1 · 회피 +0.1) · 방 판 (16 × 12 · 벽 · 문 · 가구 칸 · 한눈에) · 들어서면 "어머나." 와 네 선택지 · 장면 그림 /
//   말을 건다 → 홀짝홀짝 · 용케 살아 왔네 · 차를 받는다 (모두 조금 회복 · 한 번) / 차 두 잔 가져가기 (가방으로 · 다시 안 생김) · 쉬기 (한 번) /
//   동료 자율 (반쯤만 움직임 · 물건 · 공격 없음 · 이야기 줄) · 레베카 인사 장면 (왼쪽 레베카) · 카리우스 · 탕아 장면 / 인연: 판마다 한 번 · 2 알아봄 (이름) · 3 장미장식 <축복:오딜> · 다음 판도 지님 /
//   공격 → 약한 오딜 (도감 C-027) · 죽으면 다음 판부터 시신 · 대화 · 차 없음 / 인카운터 목록 · 여정 기록 · 휴대폰)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const ENTER = `(async()=>{ if (S.mode!=='story') setMode('story'); if (S.camp) campQuit(true); if (mode!=='edit') resetToEdit(); const party=campStart({ direct:true }); const C=S.camp; C.t0=Date.now()+Math.floor(Math.random()*1e6);
   if (!party.some(p=>p.name==='탕아')){ const t=fromDesign(designByKey('탕아'),0); t.id=uid(); party.push(t); }
   C.stages[3]={ seed: 11, tseed: 7, e3: 'odile' }; C.s=3; S.units=party; campBuild(3,'down',party); await new Promise(r=>setTimeout(r,700)); return { room: S.room, W: world.map.W, H: world.map.H, tk: !!TK, met: S.odile&&S.odile.met }; })()`;
 const LINES = "(()=>{ const out=[]; for (let k=0;k<30&&TK;k++){ const nm=document.getElementById('tkName').textContent||'', i0=TK.i, f0=TK.full; if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ if (TK.i!==i0) out.push(nm+'|'+f0); return { out, ask: L.ask.map(a=>a[0]) }; } out.push((document.getElementById('tkName').textContent||'')+'|'+TK.full); talkAdv(); } return { out, ask: null }; })()"; /* v1.1: 글이 다 찍히면 바로 선택지로 넘어가는 줄 (talkDone) 도 기록 */
 const PICK = t => `(()=>{ if (TK && TK.timer) talkDone(); const bt=[...document.querySelectorAll('#tkCh button')].find(x=>x.textContent.includes('${t}')); if (!bt) return 'nobtn'; bt.click(); return 'ok'; })()`;
 const CLOSE = "(()=>{ for (let k=0;k<30&&TK;k++){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(''); break; } talkAdv(); } return !TK; })()";
 const RUN = s => `(()=>{ mode='run'; paused=false; const acts=[]; let mx=0; const al=()=>world.units.filter(u=>u.side===0&&u.alive); for (let i=0;i<30*${s}&&!world.over;i++){ stepWorld(world,1/30); odTick(world); const mv=al().filter(u=>u.order&&u.order.room&&u.order.k==='move'&&Math.hypot(u.x-u.order.x,u.y-u.order.y)>0.6).length; if (mv>mx) mx=mv; if (TK) break; } mode='plan';
   return { mx, n: al().length, odAct: world.log.filter(e=>e.k==='odAct').map(e=>e.s), hits: world.log.filter(e=>(e.k==='hit'||e.k==='atk')&&world.units[e.a]&&world.units[e.a].side===0).length, tk: !!TK, t: +world.t.toFixed(1) }; })()`;
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   const eng = await p.evaluate(()=>{ const mk=t=>createWorld({ type:'gridC', W:14, H:10, seed:1, flips:[], torches:[], units:[{ ...fromDesign(designByKey('인주'),0), traits: t, x:2.5, y:2.5 }] }, rules, 1, { headless:true }).units[0]; const a=mk([]), c=mk(['축복:오딜']); return { a: a.atk, c: c.atk, ev: c.blessEv, ev0: a.blessEv, tr: traitDesc('축복:오딜') }; });
   console.log('    축복', JSON.stringify(eng)); ok(eng.c===Math.round(eng.a*1.1)&&eng.ev===0.1&&!eng.ev0&&/공격 × 1.1/.test(eng.tr),'<축복:오딜> 엔진: 공격 × 1.1 · 회피 +0.1 · 설명');
   // 1) 첫 만남
   const e1 = await p.evaluate(ENTER); console.log('    들어섬', JSON.stringify(e1));
   const r1 = await p.evaluate(()=>{ const m=world.map; let walls=0, doors=0; for (let x=0;x<16;x++){ if (m.t[x]===1) walls++; else doors++; } const bg=document.getElementById('talk').style.backgroundImage; return { walls, doors, piles: S.piles.length, exp: [...world.explored].every(v=>v===2), bg: /bg_enc/.test(bg), name: document.getElementById('tkName').textContent, cleared: world.cleared }; });
   console.log('    방', JSON.stringify(r1)); ok(e1.room&&e1.W===16&&e1.H===12&&r1.walls===14&&r1.doors===2&&r1.piles>=25&&r1.exp,'방 판: 16 × 12 · 위 벽에 문 두 칸 · 가구 칸 · 한눈에 다 보임');
   ok(e1.tk&&e1.met===1&&r1.bg,'들어서면 바로 대화 (만남 1번째) · 뒤에 장면 그림 (붉은 소파)');
   await p.screenshot({path:'_s7260_enter.png'});
   const l1 = await p.evaluate(LINES); console.log('    첫마디', JSON.stringify(l1));
   ok(l1.out.some(x=>/문을 지나자 작고 어두운 방/.test(x))&&l1.out.some(x=>/가면을 쓴 여자.*\|어머나\./.test(x))&&l1.out.some(x=>/아무 말 없이, 당신을 응시합니다/.test(x))&&JSON.stringify(l1.ask)===JSON.stringify(['말을 건다','조용히 쉬고 간다','방을 나간다','공격한다']),'"어머나." · 응시 · 네 선택지 (말을 건다 · 조용히 쉬고 간다 · 방을 나간다 · 공격한다)');
   await p.evaluate(PICK('말을 건다')); const l2 = await p.evaluate(LINES); console.log('    말', JSON.stringify(l2));
   ok(l2.out.some(x=>/홀짝홀짝/.test(x))&&l2.out.some(x=>/큰 관심은 없는 듯하다/.test(x))&&l2.out.some(x=>/용케 살아 왔네\. 반 죽어있다고 해야하나\./.test(x))&&l2.ask&&l2.ask[0]==='차를 받는다','말을 건다 → (홀짝홀짝) 큰 관심 없음 · "용케 살아 왔네…" · 차를 받는다');
   const h0 = await p.evaluate(()=>{ for (const u of world.units.filter(u=>u.side===0)) u.hp=Math.max(1,u.max-40); return world.units.filter(u=>u.side===0).reduce((a,u)=>a+u.hp,0); });
   await p.evaluate(PICK('차를 받는다')); const l3 = await p.evaluate(LINES); const h1 = await p.evaluate(()=>world.units.filter(u=>u.side===0).reduce((a,u)=>a+u.hp,0));
   console.log('    차', JSON.stringify(l3), h0, h1); ok(h1>h0&&l3.out.some(x=>/찻잔 하나를 건넨다/.test(x))&&l3.ask&&!l3.ask.includes('차를 받는다'),'차를 받는다 → 모두 조금 회복 (+'+(h1-h0)+') · 다시 물으면 차는 없음');
   await p.evaluate(PICK('그만둔다')); await p.waitForTimeout(100);
   // 차 두 잔 · 쉬기
   const t1 = await p.evaluate(()=>{ campBarRender(true); const tb=document.querySelector('[data-otea]'), rb=document.querySelector('[data-orest]'), talkB=document.querySelector('[data-ctalk]'); if (tb) tb.click(); const cards=document.querySelectorAll('#banner .lcard').length;
     const P=lootParty(), a=P.find(x=>x.name==='레베카'), c=P.find(x=>x.name==='카리우스'); const b0=(a.bag||[]).length; document.querySelector(`[data-otake="0"][data-lp="${a.id}"]`).click(); document.querySelector(`[data-otake="1"][data-lp="${(c&&!bagRoom(c,OD_TEA)?c:P.find(x=>x!==a&&!bagRoom(x,OD_TEA))).id}"]`).click();
     const tea=(a.bag||[]).find(x=>x.name==='오딜의 차'); document.querySelector('[data-oclose]').click(); campBarRender(true); return { tb: !!tb, rb: !!rb, talkB: !!talkB, cards, got: (a.bag||[]).length-b0, tea: tea&&[tea.k,tea.heal], left: !!document.querySelector('[data-otea]'), taken: encCur().teaTaken }; });
   console.log('    차 두 잔', JSON.stringify(t1)); ok(t1.tb&&t1.rb&&t1.talkB&&t1.cards===2&&t1.got===1&&t1.tea&&t1.tea[0]==='potion'&&t1.tea[1]===0.15&&!t1.left&&t1.taken.every(Boolean),'🍵 차 두 잔: 동료 가방으로 (마시는 약 · 15%) · 다 가져가면 단추가 사라짐 (다시 안 생김) · 💬 말 걸기 · 🛋 쉬기');
   const rs = await p.evaluate(()=>{ for (const u of world.units.filter(u=>u.side===0)) u.hp=Math.max(1,u.max-30); const a=world.units.filter(u=>u.side===0).reduce((s,u)=>s+u.hp,0); document.querySelector('[data-orest]').click(); const t=TK&&TK.full; const b=world.units.filter(u=>u.side===0).reduce((s,u)=>s+u.hp,0); campBarRender(true); return { a, b, t, again: !!document.querySelector('[data-orest]') }; });
   console.log('    쉬기', JSON.stringify(rs)); ok(rs.b>rs.a&&/숨을 고른다/.test(rs.t||'')&&!rs.again,'🛋 쉬기 → 조금 회복 · 낡은 의자에서 숨을 고름 · 한 번만');
   await p.evaluate(CLOSE);
   // 동료 자율 · 레베카 인사
   const a1 = await p.evaluate(RUN(16)); console.log('    자율', JSON.stringify(a1).slice(0,500));
   const sc = await p.evaluate(()=>({ lines: TK ? TK.lines.map(l=>(l.who||'')+':'+(l.t||l.narr||'')) : [], left: document.getElementById('tkImgL').getAttribute('src')||'', name: document.getElementById('tkName').textContent }));
   console.log('    레베카 장면', JSON.stringify(sc)); ok(a1.tk&&sc.lines.some(x=>/C-002:\.\.\.안녕하세요! 와\.\.\. 예쁜 방이네요/.test(x))&&sc.lines.some(x=>/아가씨도 한잔/.test(x))&&sc.lines.some(x=>/네 넷/.test(x))&&/C-002_art/.test(sc.left)&&sc.name==='레베카','레베카가 구경하다 먼저 인사 (왼쪽 레베카 · "...네 넷!")');
   await p.screenshot({path:'_s7260_rebecca.png'}); await p.evaluate(CLOSE);
   const a2 = await p.evaluate(()=>{ const E=encCur(); E.scnK=-1; E.scnT=-1; return 1; }); const a3 = await p.evaluate(RUN(24)); console.log('    자율 2', JSON.stringify(a3).slice(0,600));
   const ord = await p.evaluate(()=>({ room: world.units.filter(u=>u.side===0&&u.alive&&u.order&&u.order.room).length, kar: (()=>{ const k=world.units.find(u=>u.name==='카리우스'); return k ? Math.round(Math.hypot(k.x-k.home.x,k.y-k.home.y)*10)/10 : -1; })(), taken: encCur().teaTaken.filter(Boolean).length, foes: world.units.filter(u=>u.side===1).length }));
   console.log('    자율 상태', JSON.stringify(ord));
   ok(a3.odAct.length>=2&&a3.mx<=Math.ceil(a3.n/2)&&a3.hits===0&&ord.foes===0,'동료 자율: 구경 · 앉음 · 서성 (이야기 줄 '+a3.odAct.length+') · 한 번에 반쯤만 움직임 (최대 '+a3.mx+'/'+a3.n+') · 공격 없음');
   // 카리우스 · 탕아 장면
   const k1 = await p.evaluate(()=>{ const E=encCur(); E.scnK=world.t; return 1; }); await p.evaluate(()=>{ odTick(world); }); const kl = await p.evaluate(()=>TK ? TK.lines.map(l=>(l.name||l.who||'')+':'+(l.t||l.narr||'')) : []);
   console.log('    카리우스', JSON.stringify(kl)); ok(kl.some(x=>/만듦새가 좋네\. 사랑받았어\?/.test(x))&&kl.some(x=>/C-003:\(무시\)/.test(x)) || kl.some(x=>/광대:낄낄\. 낄낄\./.test(x))&&kl.some(x=>/조금 싫어하는/.test(x)),'카리우스 장면 (만듦새 · 무시 / 광대 낄낄 · 싫어함)');
   await p.evaluate(CLOSE); await p.evaluate(()=>{ const E=encCur(); E.scnT=world.t; odTick(world); }); const tl = await p.evaluate(()=>TK ? TK.lines.map(l=>(l.who||'')+':'+(l.t||l.narr||'')) : []);
   console.log('    탕아', JSON.stringify(tl)); ok(tl.some(x=>/진짜 용사님이시네/.test(x))&&tl.some(x=>/C-221:\(무반응\)/.test(x)),'탕아 장면 ("...어머나, 진짜 용사님이시네." · 무반응)'); await p.evaluate(CLOSE);
   // 같은 판에 다시 들어와도 만남은 그대로
   const re = await p.evaluate(()=>{ const party=S.units.filter(u=>u.side===0); campBuild(3,'down',party); return S.odile.met; }); await p.waitForTimeout(600); await p.evaluate(CLOSE); ok(re===1,'같은 판에 다시 들어와도 만남은 한 번 (1)');
   // 2) 두 번째 판 — 알아봄 (이름)
   await p.evaluate(ENTER); const m2 = await p.evaluate(LINES); console.log('    두 번째', JSON.stringify(m2)); ok(m2.out.some(x=>/오딜\|\.\.\.또 왔네\./.test(x))&&m2.out.some(x=>/알아본다/.test(x)),'두 번째 판: "...또 왔네." · 이름 (오딜) 이 보임');
   await p.evaluate(PICK('말을 건다')); const m2b = await p.evaluate(LINES); ok(m2b.out.some(x=>/지난번에도 반쯤 죽어 있었지/.test(x)),'두 번째 판의 대화: 지난 일을 기억'); await p.evaluate(CLOSE);
   // 3) 세 번째 판 — 개인적인 질문 → 장미장식
   await p.evaluate(ENTER); await p.evaluate(LINES); await p.evaluate(PICK('말을 건다')); const m3 = await p.evaluate(LINES); console.log('    세 번째', JSON.stringify(m3));
   ok(m3.out.some(x=>/어디까지 갈 생각이야/.test(x))&&JSON.stringify(m3.ask)===JSON.stringify(['끝까지','모르겠어']),'세 번째 판: "...너는 어디까지 갈 생각이야?"');
   const atk0 = await p.evaluate(()=>world.units.find(u=>u.hero).atk); await p.evaluate(PICK('끝까지')); const m3b = await p.evaluate(LINES); await p.waitForTimeout(100);
   const bl = await p.evaluate(()=>{ const h=world.units.find(u=>u.hero), hp=S.units.find(p=>p.side===0&&p.hero); return { bl: S.odile.blessed, tr: hp.traits.includes('축복:오딜'), wtr: (h.traits||[]).includes('축복:오딜'), atk: h.atk, ev: h.blessEv }; });
   console.log('    장미장식', JSON.stringify(m3b), JSON.stringify(bl), atk0); ok(m3b.out.some(x=>/장미 장식을 하나 떼어 내민다/.test(x))&&bl.bl&&bl.tr&&bl.wtr&&bl.atk===Math.round(atk0*1.1)&&bl.ev===0.1,'"가져가. 별건 아니야." → <축복:오딜> (인주 · 공격 '+atk0+' → '+bl.atk+' · 회피 +0.1)');
   await p.evaluate(CLOSE);
   // 4) 네 번째 판 — 축복을 지니고 시작 · 익숙함
   await p.evaluate(ENTER); const m4 = await p.evaluate(()=>{ const h=world.units.find(u=>u.hero); return { tr: (h.traits||[]).includes('축복:오딜'), ev: h.blessEv, met: S.odile.met }; }); const m4l = await p.evaluate(LINES);
   ok(m4.tr&&m4.ev===0.1&&m4.met===4&&m4l.out.some(x=>/왔어\?/.test(x)),'다음 판도 인주가 <축복:오딜> 을 지니고 시작 · 네 번째: "왔어?"');
   // 공격 → 약한 오딜 · 죽음 → 시신
   await p.evaluate(PICK('공격한다')); const f1 = await p.evaluate(LINES); await p.waitForTimeout(50);
   const f2 = await p.evaluate(()=>{ const u=world.units.find(x=>x.ref==='C-027'&&x.side===1); const r={ u: !!u, name: u&&u.name, hp: u&&u.max, tier: u&&u.tier, x: u&&+u.x.toFixed(1), y: u&&+u.y.toFixed(1), st: encCur().st }; const h=world.units.find(x=>x.hero); applyDmg(world,h,u,9999,{}); odTick(world); return { ...r, dead: S.odile.dead, st2: (S.camp.stages[3].enc||{}).st }; });
   console.log('    공격', JSON.stringify(f1), JSON.stringify(f2)); ok(f1.out.some(x=>/찻잔을 내려놓는다/.test(x))&&f2.u&&f2.name==='오딜'&&f2.tier===1&&f2.st==='foe'&&f2.dead&&f2.st2==='dead','공격한다 → 약한 오딜 (도감 C-027 · 1성 · 소파에서 일어남) · 쓰러지면 죽음이 남음');
   await p.screenshot({path:'_s7260_dead_now.png'});
   await p.evaluate(ENTER); const d1 = await p.evaluate(LINES); await p.evaluate(CLOSE); const d2 = await p.evaluate(()=>{ campBarRender(true); return { st: encCur().st, talk: !!document.querySelector('[data-ctalk]'), tea: !!document.querySelector('[data-otea]'), met: S.odile.met, near: encNear() }; });
   console.log('    시신', JSON.stringify(d1), JSON.stringify(d2)); ok(d1.out.some(x=>/쓰러져 있다\. 찻잔은 식은 지 오래다/.test(x))&&!d1.ask&&d2.st==='dead'&&!d2.talk&&!d2.tea&&d2.met===4,'다음 판: 소파 위의 시신 · 대화 · 차 없음 · 인연 멈춤 (4)');
   await p.waitForTimeout(300); await p.screenshot({path:'_s7260_corpse.png'});
   // 인카운터 목록 · 여정 기록
   const enc = await p.evaluate(async()=>{ const A=await campLogAll(); setMode('train'); document.querySelector('.tab[data-tab="enc"]').click(); const bx=[...document.querySelectorAll('#pane-enc .box')].find(x=>/오딜의 방/.test(x.querySelector('.lab').textContent)); return { box: !!bx, txt: bx ? bx.innerText : '', tryB: !!(bx&&bx.querySelector('[data-etry="odile"]')), jr: A.text.some(l=>/어머나|시신|쓰러져/.test(l)) }; });
   console.log('    목록', enc.box, enc.tryB, enc.jr); ok(enc.box&&enc.tryB&&/장미장식/.test(enc.txt)&&/죽음/.test(enc.txt)&&enc.jr,'인카운터 목록: 오딜의 방 (흐름 · 인연 · 지금 상태) · 해 보기 / 여정 기록에 대화');
   ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | ')); }
 // 휴대폰 — 방 · 대화
 { const p=await (await b.newContext({viewport:{width:412,height:880},isMobile:true,hasTouch:true,deviceScaleFactor:2})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   await p.evaluate(ENTER); await p.waitForTimeout(400); await p.screenshot({path:'_s7260_enter_mo.png'}); await p.evaluate(CLOSE); await p.waitForTimeout(300);
   const m = await p.evaluate(()=>({ sw: document.documentElement.scrollWidth, iw: innerWidth, bar: [...document.querySelectorAll('#campBar button')].map(x=>x.textContent) }));
   console.log('    휴대폰', JSON.stringify(m)); ok(m.sw<=m.iw+1&&m.iw===412&&m.bar.some(x=>/차 2/.test(x))&&m.bar.some(x=>/쉬기/.test(x)),'휴대폰: 넘침 없음 · 🍵 차 · 🛋 쉬기 단추');
   await p.screenshot({path:'_s7260_room_mo.png'}); ok(!errs.length,'휴대폰 오류 없음 '+errs.slice(0,2).join(' | ')); }
 await b.close(); console.log(fails?`${fails} FAIL`:'ALL UI7260 OK'); })();
