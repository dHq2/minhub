// v7.22.0 UI 시험 — ui722.js v1.1 (v1.1: 모바일 대화 창이 화면 아래 · 넓게 · 인사 다음 줄 한 칸씩 · 인카운터: 3S 뽑기 (파티 인물 빠짐) · 친칠라 (호수 · 졸음 · 처음 보임 나레이션 · 깜짝 도약 · 말 걸기 셋 → 영입 · 공격 → 적 · 쓰러뜨리면 하얀 나무 · 친칠라의 후드 · 그냥 넘어가면 따라옴) · 탕아 (불빛 · 인사 · 두고 감 / 같이 감) · 대화 창 그림 · 판 누름 · 모바일)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 /* 공통: 캠페인을 열고 3S 를 정한 만남으로 */
 const GO3 = k => `(()=>{ showTab('place'); renderFloors(); if (S.camp) campQuit(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click();
   const C=S.camp, party=S.units.filter(u=>u.side===0 && u.name!=='친칠라' && u.name!=='탕아'); C.stages[3]={ seed: 11, tseed: 7, e3: '${k}' }; C.s=3; campBuild(3,'down',party); return true; })()`;
 const ADV = `(()=>{ for (let i=0;i<20 && TK;i++){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L && L.ask) break; talkAdv(); } return TK ? [...document.querySelectorAll('#tkCh button')].map(x=>x.textContent) : null; })()`;
 const PICK = t => `(()=>{ if (TK && TK.timer) talkDone(); const bt=[...document.querySelectorAll('#tkCh button')].find(x=>x.textContent.includes('${t}')); if (!bt) return 'nobtn'; bt.click(); return 'ok'; })()`;
 const NEAR = d => `(()=>{ const E=encCur(), al=world.units.filter(u=>u.alive&&u.side===0); const h=al.find(u=>u.hero)||al[0]; h.x=E.x; h.y=E.y+${d}; for (const u of al) if (u!==h){ u.x=E.x+((u.i%5)-2)*0.9; u.y=Math.min(world.map.H-1.5,E.y+${d}+1.2+Math.floor(u.i/5)); } computeLight(world); encTick(world); return { st: E.st, talk: !!TK, txt: TK ? TK.full : '' }; })()`;
 const EXITUP = `(()=>{ for(const u of world.units.filter(u=>u.side===0&&u.alive)) leaveMap(world,u,'up'); checkEnd(world); mode='plan'; onOver(); const nb=document.getElementById('campNext'); if(nb) nb.click(); return { s: S.camp.s, party: S.units.filter(u=>u.side===0).map(u=>u.name) }; })()`;

 // 1) 친칠라: 맵 · 처음 보임 · 깜짝 · 말 걸기 → 영입 → 넘어감
 await p.evaluate(GO3('chin'));
 const m1 = await p.evaluate(()=>{ const E=encCur(); return { water: (world.map.water||[]).length, foes: world.units.filter(u=>u.side===1).length, st: E&&E.st, kind: document.getElementById('campBar').innerText, cleared: world.cleared }; });
 console.log('    친칠라 맵', JSON.stringify(m1)); ok(m1.water===3&&m1.foes===0&&m1.st==='sleep'&&/잠든 사냥꾼/.test(m1.kind),'3S 친칠라: 얕은 호수 셋 · 적 없음 · 졸고 있음 · 띠에 만남 이름');
 const sp = await p.evaluate(()=>{ const u=world.units.find(u=>u.side===0&&!u.hero); const base=spdNow(world,u); const E=encCur(); const w=world.map.water[0]; u.x=w.x; u.y=w.y; const wet=spdNow(world,u); return { r: +(wet/base).toFixed(2) }; }); ok(Math.abs(sp.r-0.7)<0.01,'물 속 걸음 0.7 배 ('+sp.r+')');
 const s1 = await p.evaluate(NEAR(2.6)); console.log('    처음 보임', JSON.stringify(s1)); ok(s1.talk&&/활을 든 인물이 졸고 있다/.test(s1.txt)&&s1.st==='sleep','처음 보이면 나레이션 "활을 든 인물이 졸고 있다." (판 멈춤)');
 await p.evaluate(ADV);
 const s2 = await p.evaluate(()=>{ const E=encCur(), x0=E.x, y0=E.y; encTick(world); return { st: E.st, moved: +Math.hypot(E.x-encCur().x, 0).toFixed(2), bub: E.bub&&E.bub.t, talk: !!TK }; });
 const s2b = await p.evaluate(()=>{ const E=encCur(), h=world.units.find(u=>u.hero); return { d: +Math.hypot(h.x-E.x,h.y-E.y).toFixed(2), x: E.x, y: E.y }; });
 console.log('    깜짝', JSON.stringify(s2), JSON.stringify(s2b)); ok(s2.st==='awake'&&/깜짝/.test(s2.bub||'')&&s2b.d>3.5,'3칸 안으로 오면 "...(깜짝)" 뒤로 도약 (지금 '+s2b.d+'칸)');
 const bar = await p.evaluate(()=>{ encTick(world); campBarRender(true); return !!document.querySelector('[data-ctalk]'); }); ok(bar,'가까이 있으면 캠페인 띠에 💬 말 걸기');
 await p.evaluate(()=>document.querySelector('[data-ctalk]').click());
 const t1 = await p.evaluate(ADV); console.log('    말 1', JSON.stringify(t1)); ok(t1&&t1.length===3&&t1.includes('공격한다'),'말 걸기 1: 노려보기만 · 계속 / 그만 / 공격');
 const img = await p.evaluate(async()=>{ await new Promise(r=>setTimeout(r,500)); const im=document.getElementById('tkImg'); return { src: im.getAttribute('src'), w: im.naturalWidth, face: document.getElementById('tkPic').classList.contains('tk-face') }; });
 console.log('    그림', JSON.stringify(img)); ok(/art\/C-106_talk03\.webp/.test(img.src||'')&&img.w>0&&!img.face,'대화 창에 친칠라 대화 표정 (talk03) 그림');
 await p.evaluate(PICK('계속 말을 건다')); const t2 = await p.evaluate(ADV); const nm2 = await p.evaluate(()=>document.getElementById('tkText').textContent);
 ok(t2&&t2.some(x=>/가리킨다/.test(x))&&/어디로 가는 거야/.test(nm2),'말 걸기 2: "...너, 어디로 가는 거야?"');
 await p.evaluate(PICK('가리킨다')); const t3 = await p.evaluate(ADV); const nm3 = await p.evaluate(()=>document.getElementById('tkText').textContent);
 ok(t3&&t3.includes('동행을 제안한다')&&/동행을 제안해 볼까요/.test(nm3),'말 걸기 3: "일단 간다고? 흐음.." → 나레이션 → 동행 제안');
 await p.evaluate(PICK('동행을 제안한다')); await p.evaluate(ADV);
 const j1 = await p.evaluate(()=>{ const E=encCur(), u=world.units.find(x=>x.name==='친칠라'); return { st: E.st, side: u&&u.side, alive: u&&u.alive, talk: !!TK, hood: u&&u.gear&&u.gear['머리']&&u.gear['머리'].name, inS: S.units.some(x=>x.name==='친칠라'&&x.side===0) }; });
 console.log('    영입', JSON.stringify(j1)); ok(j1.st==='joined'&&j1.side===0&&j1.alive&&!j1.talk&&j1.inS&&j1.hood==='친칠라의 후드','동행 제안 → 친칠라가 동료 (아군 유닛 · 후드)');
 const x1 = await p.evaluate(EXITUP); console.log('    넘어감', JSON.stringify(x1)); ok(x1.s===4&&x1.party.includes('친칠라'),'영입한 친칠라와 함께 4S 로');

 // 2) 친칠라와 싸움 → 적 · 쓰러뜨리면 전리품
 await p.evaluate(GO3('chin')); await p.evaluate(NEAR(2.6)); await p.evaluate(ADV);
 await p.evaluate(()=>encTalk()); await p.evaluate(ADV); await p.evaluate(PICK('공격한다')); const fl = await p.evaluate(()=>TK&&TK.full); await p.evaluate(ADV);
 const f1 = await p.evaluate(()=>{ const u=world.units.find(x=>x.name==='친칠라'); return { side: u&&u.side, st: encCur().st, cleared: world.cleared, state: u&&u.state, tgt: !!(u&&u.target) }; });
 console.log('    싸움', fl, JSON.stringify(f1)); ok(/활시위/.test(fl||'')&&f1.side===1&&f1.st==='foe'&&f1.cleared===false&&f1.state==='hunt'&&f1.tgt,'공격한다 → 나레이션 → 그 자리에서 적 친칠라 (끝난 맵이 아님 · 마주 보던 상대를 앎)');
 const f2 = await p.evaluate(()=>{ const u=world.units.find(x=>x.name==='친칠라'), h=world.units.find(x=>x.hero); applyDmg(world,h,u,9999,{}); checkEnd(world); const L=lootOf(world); return { alive: u.alive, cleared: world.cleared, loot: L.map(x=>x.label||x.name) }; });
 console.log('    전리품', JSON.stringify(f2)); ok(!f2.alive&&f2.cleared&&f2.loot.some(x=>/하얀 나무/.test(x))&&f2.loot.includes('친칠라의 후드'),'쓰러뜨리면 하얀 나무 · 친칠라의 후드');
 const x2 = await p.evaluate(EXITUP); ok(x2.s===4&&!x2.party.includes('친칠라'),'싸운 친칠라는 따라오지 않음');

 // 3) 그냥 넘어가면 따라옴
 await p.evaluate(GO3('chin')); const x3 = await p.evaluate(EXITUP); await p.waitForTimeout(700);
 const n3 = await p.evaluate(()=>({ talk: !!TK, txt: TK&&TK.full }));
 console.log('    지나침', JSON.stringify(x3), JSON.stringify(n3)); ok(x3.party.includes('친칠라')&&n3.talk&&/내비둘까/.test(n3.txt||''),'그냥 넘어가면 다음 맵에서 따라옴 ("누군가 따라온 것 같다. ...내비둘까")');
 await p.evaluate(ADV);

 // 4) 탕아: 불빛 · 인사 · 두고 감
 await p.evaluate(GO3('tang'));
 const m4 = await p.evaluate(()=>({ torches: world.torches.length, piles: world.map.piles, st: encCur().st }));
 ok(m4.torches===1&&m4.piles>=5&&m4.st==='sit','3S 탕아: 가운데 불빛 · 장비 무더기와 시체 · 앉아 있음');
 await p.evaluate(NEAR(3)); await p.evaluate(ADV); const g4 = await p.evaluate(()=>{ encTick(world); return { st: encCur().st, txt: TK&&TK.full }; });
 console.log('    인사', JSON.stringify(g4)); ok(g4.st==='greeted'&&/오랜만에 보는 살아있는 사람/.test(g4.txt||''),'다가가면 "....오, 오랜만에 보는 살아있는 사람이군."');
 await p.evaluate(()=>{ if (TK && TK.timer) talkDone(); talkAdv(); }); const gl = await p.evaluate(()=>TK&&TK.full); ok(/멍하니 걸터앉았다/.test(gl||''),'→ "그는 더 이상 아무 말도 하지 않고 다시 멍하니 걸터앉았다"'); await p.evaluate(ADV);
 await p.evaluate(()=>encTalk()); const t4 = await p.evaluate(ADV); const q4 = await p.evaluate(()=>document.getElementById('tkText').textContent);
 ok(t4&&t4.includes('두고 간다')&&/같이 가자고/.test(q4),'말 걸기: "같이 가자고?" → 같이 가자 / 두고 간다 / 공격');
 await p.evaluate(PICK('두고 간다')); const d4 = await p.evaluate(()=>encCur().st); const x4 = await p.evaluate(EXITUP);
 ok(d4==='declined'&&!x4.party.includes('탕아'),'두고 가면 따라오지 않음');

 // 5) 탕아 같이 감 + 판 누름으로 말 걸기
 await p.evaluate(GO3('tang')); await p.evaluate(NEAR(3)); await p.evaluate(ADV); await p.evaluate(()=>encTick(world)); await p.evaluate(ADV);
 const ck = await p.evaluate(()=>{ const E=encCur(); return encClick({ x: E.x + 0.2, y: E.y }); }); await p.evaluate(ADV); await p.evaluate(PICK('같이 가자')); await p.evaluate(ADV);
 const j5 = await p.evaluate(()=>{ const u=world.units.find(x=>x.name==='탕아'); return { side: u&&u.side, st: encCur().st }; });
 ok(ck&&j5.side===0&&j5.st==='joined','판에서 누르면 말 걸기 · 같이 가자 → 탕아가 동료');

 // 6) 뽑기: 파티에 있으면 빠짐 · 전투 만남은 그대로
 const pk = await p.evaluate(()=>{ const C={ fallen: [], lost: [] }; let chin=0, tang=0, f=0; for(let i=0;i<400;i++){ const e=encPick(C,[{name:'친칠라'}]); if(e.k==='chin') chin++; if(e.k==='tang') tang++; if(e.fight!=null) f++; } return { chin, tang, f }; });
 ok(pk.chin===0&&pk.tang>0&&pk.f>0,'파티에 친칠라가 있으면 친칠라 만남은 안 나옴 ('+JSON.stringify(pk)+')');
 await p.evaluate(GO3('f0')); const m6 = await p.evaluate(()=>({ foes: world.units.filter(u=>u.side===1).length, enc: encCur(), water: (world.map.water||[]).length }));
 ok(m6.foes===6&&!m6.enc&&m6.water===0,'전투 만남 (똥개 무리) 은 그대로 · 물 없음');
 const lg = await p.evaluate(()=>{ renderLog(true); return document.getElementById('log') ? document.getElementById('log').innerText.length : -1; });
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs.slice(0,3)));
 await ctx.close();

 // 7) 모바일: 대화 창이 화면 안
 const mc=await b.newContext({viewport:{width:412,height:915},deviceScaleFactor:2.625,isMobile:true,hasTouch:true}); const q=await mc.newPage(); const e2=[]; q.on('pageerror',e=>e2.push(e.message)); q.on('dialog',d=>d.accept());
 await q.goto(url); await q.waitForTimeout(400); await q.evaluate(()=>localStorage.clear()); await q.reload(); await q.waitForTimeout(1000);
 await q.evaluate(GO3('chin')); await q.evaluate(NEAR(2.6)); await q.evaluate(ADV); await q.evaluate(()=>encTalk()); await q.evaluate(ADV); await q.waitForTimeout(500);
 const lay = await q.evaluate(()=>{ const T=document.getElementById('talk'), bx=document.getElementById('tkBox').getBoundingClientRect(), pic=document.getElementById('tkPic').getBoundingClientRect(), bs=[...document.querySelectorAll('#tkCh button')].map(x=>x.getBoundingClientRect());
   return { vis: !T.hidden, box: [Math.round(bx.left),Math.round(bx.right),Math.round(bx.bottom)], picH: Math.round(pic.height), btnOut: bs.filter(r=>r.left<0||r.right>innerWidth+1||r.bottom>innerHeight+1).length, btnH: Math.min(...bs.map(r=>r.height)), sw: document.documentElement.scrollWidth, iw: innerWidth, ih: innerHeight }; });
 console.log('    모바일', JSON.stringify(lay)); ok(lay.vis&&lay.box[0]>=0&&lay.box[1]<=lay.iw+1&&lay.box[2]<=lay.ih+1&&lay.box[1]-lay.box[0]>=lay.iw*0.85&&lay.box[2]>=lay.ih-40&&lay.btnOut===0&&lay.btnH>=40&&lay.sw<=lay.iw+1&&lay.picH>100,'모바일: 대화 창 · 그림 · 단추가 화면 안 (단추 40px 넘음)');
 ok(e2.length===0,'모바일 오류 없음 '+JSON.stringify(e2.slice(0,3)));
 console.log(fails?`${fails} FAIL`:'ALL UI722 OK'); await b.close(); })();
