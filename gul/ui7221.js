// v7.22.1 UI 시험 — ui7221.js v1.2 (v1.2: 공격 시험은 맵을 연 뒤 늦은 나레이션 (0.35초 뒤) 이 다 뜰 때까지 0.8초 기다려 넘김 — 부하가 크면 대화 고름 사이에 끼어 대화 줄이 밀리던 것 · 시험만 고침 · v1.1: 판 위의 확인 창 — 자동 시험은 __askAuto 로 바로 '예' · 토끼마차: 아이텐 · 청갑 둘 · 처음 보임 나레이션 둘 · 청갑 뭘 봐 → 꺼져 → 무시 · 쓸 만한 물건 없음 · 거래 (건네기 → 가치 · 사기 → 가방 · 많이 이용해 주세요) · 넘어가면 산 것 · 판 것 반영 · 회복약 마시기 · 공격 → 사각형 나레이션 → 확정 패배 · 모바일)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const GO3 = k => `(()=>{ showTab('place'); renderFloors(); if (S.camp) campQuit(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click();
   const C=S.camp, party=S.units.filter(u=>u.side===0 && u.name!=='친칠라' && u.name!=='탕아'); for (const p of party) p.bag=[]; C.stages[3]={ seed: 11, tseed: 7, e3: '${k}' }; C.s=3; campBuild(3,'down',party); return true; })()`;
 const ADV = `(()=>{ for (let i=0;i<20 && TK;i++){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L && L.ask) break; talkAdv(); } return TK ? [...document.querySelectorAll('#tkCh button')].map(x=>x.textContent) : null; })()`;
 const PICK = t => `(()=>{ if (TK && TK.timer) talkDone(); const bt=[...document.querySelectorAll('#tkCh button')].find(x=>x.textContent.includes('${t}')); if (!bt) return 'nobtn'; bt.click(); return 'ok'; })()`;
 const NEAR = (k,d) => `(()=>{ const E=encAll().find(q=>q.npc==='${k}'), al=world.units.filter(u=>u.alive&&u.side===0); const h=al.find(u=>u.hero)||al[0]; h.x=E.x; h.y=E.y+${d}; for (const u of al) if (u!==h){ u.x=E.x+((u.i%5)-2)*0.9; u.y=Math.min(world.map.H-1.5,E.y+${d}+1.2+Math.floor(u.i/5)); } computeLight(world); encTick(world); return { talk: !!TK, txt: TK ? TK.full : '' }; })()`;
 const TALKTO = k => `(()=>{ encTalk(encAll().find(q=>q.npc==='${k}')); if (TK && TK.timer) talkDone(); return { txt: TK && TK.full, name: document.getElementById('tkName').textContent }; })()`;
 for (const [nm,vp] of [['데스크톱',{viewport:{width:1280,height:860}}],['모바일',{viewport:{width:412,height:915},deviceScaleFactor:2.625,isMobile:true,hasTouch:true}]]){
  const ctx=await b.newContext(vp); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true');
  await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
  await p.evaluate(GO3('shop'));
  const m = await p.evaluate(()=>({ n: encAll().length, sts: encAll().map(E=>E.npc+':'+E.st), torches: world.torches.length, foes: world.units.filter(u=>u.side===1).length, bar: document.getElementById('campBar').innerText }));
  console.log('    '+nm+' 마차', JSON.stringify(m)); ok(m.n===2&&m.sts.join()==='aiten:shop,cheong:smoke'&&m.torches===1&&m.foes===0&&/토끼마차/.test(m.bar),nm+': 3S 토끼마차 — 아이텐 · 청갑 · 등불 · 적 없음');
  const s1 = await p.evaluate(NEAR('aiten',2.5)); await p.evaluate(ADV); const s2 = await p.evaluate(()=>{ encTick(world); return { talk: !!TK, txt: TK && TK.full }; }); await p.evaluate(ADV);
  ok(/마차 한 대/.test(s1.txt)&&/담배를 줄줄이/.test(s2.txt||''),nm+': 처음 보임 — 마차 · "담배를 줄줄이 피고 있었다"');
  const c1 = await p.evaluate(TALKTO('cheong')); await p.evaluate(PICK('그만둔다')); const c2 = await p.evaluate(TALKTO('cheong')); await p.evaluate(PICK('그만둔다')); const c3 = await p.evaluate(TALKTO('cheong')); await p.evaluate(PICK('그만둔다'));
  console.log('    청갑', c1.txt, '/', c2.txt, '/', c3.txt); ok(c1.txt==='뭘 봐.'&&c2.txt==='꺼져'&&/대꾸하지 않는다/.test(c3.txt||'')&&c1.name==='마차 위의 사내',nm+': 청갑 — 뭘 봐 → 꺼져 → 무시');
  const a0 = await p.evaluate(TALKTO('aiten')); await p.evaluate(PICK('물건을 본다')); const a1 = await p.evaluate(()=>{ if (TK && TK.timer) talkDone(); return { talk: !!TK, txt: TK && TK.full, shop: !document.getElementById('banner').hidden && document.getElementById('banner').classList.contains('shop') }; }); await p.evaluate(ADV);
  ok(/토끼마차 1호점입니다/.test(a0.txt||'')&&/쓸 만한 물건이 없으신걸요/.test(a1.txt||'')&&!a1.shop,nm+': "안녕하세요. 토끼마차 1호점입니다." · 가진 게 없으면 "고객님. 쓸 만한 물건이 없으신걸요"');
  // 건넬 물건을 넣고 다시
  const g = await p.evaluate(()=>{ const pr=shopParty(), q=pr.find(x=>!x.hero)||pr[0]; q.bag=[{k:'weapon',name:'장검',label:'',dur:100},{k:'armor',name:'판금 갑옷',mat:'판금',tier:3,dur:100}]; const u=world.units.find(x=>x.pid===q.id); u.bag=q.bag.map((it,k)=>({...it,uid:900+k})); return q.name; });
  await p.evaluate(TALKTO('aiten')); await p.evaluate(PICK('물건을 본다'));
  const sh0 = await p.evaluate(()=>{ const bn=document.getElementById('banner'); return { vis: !bn.hidden, cr: +document.getElementById('shCr').textContent, sells: bn.querySelectorAll('[data-shsell]').length, buyDis: [...bn.querySelectorAll('[data-shbuy]')].every(x=>x.disabled), paused }; });
  console.log('    '+nm+' 거래', JSON.stringify(sh0)); ok(sh0.vis&&sh0.cr===0&&sh0.sells===2&&sh0.buyDis,nm+': 거래 창 — 쌓인 가치 0 · 건넬 것 둘 · 살 수 없음');
  const sh1 = await p.evaluate(()=>{ const bn=document.getElementById('banner'); for (let k=0;k<2;k++) bn.querySelector('[data-shsell]').click(); return { cr: +document.getElementById('shCr').textContent, say: bn.querySelector('.shsay').textContent }; });
  ok(sh1.cr===49,nm+': 장검 (10) · 판금 갑옷 3성 (39) 을 건네면 가치 49 ('+sh1.cr+')');
  const sh2 = await p.evaluate(()=>{ const bn=document.getElementById('banner'), T=shopState(); const hero=S.units.find(x=>x.hero); T.to=hero.id; shopRender(); bn.querySelector('[data-shbuy="pot"]').click(); bn.querySelector('[data-shbuy="arrow"]').click(); return { cr: T.credit, say: bn.querySelector('.shsay').textContent, bag: (hero.bag||[]).map(x=>x.k+':'+(x.name||x.at)+(x.n?':'+x.n:'')), left: T.left.pot }; });
  console.log('    '+nm+' 삼', JSON.stringify(sh2)); ok(sh2.cr===24&&/많이 이용해 주세요/.test(sh2.say)&&sh2.bag.includes('potion:회복약')&&sh2.bag.includes('ammo:화살:10')&&sh2.left===4,nm+': 회복약 (15) · 화살 10발 (10) 을 사면 받는 동료 가방으로 · "많이 이용해 주세요"');
  const lay = await p.evaluate(()=>{ const bn=document.getElementById('banner'), r=bn.getBoundingClientRect(), bs=[...bn.querySelectorAll('.btn')].map(x=>x.getBoundingClientRect()).filter(q=>q.width>0); return { l: Math.round(r.left), r: Math.round(r.right), iw: innerWidth, out: bs.filter(q=>q.left<-1||q.right>innerWidth+1).length, minH: Math.min(...bs.map(q=>q.height)), sw: document.documentElement.scrollWidth }; });
  ok(lay.l>=0&&lay.r<=lay.iw+1&&lay.out===0&&lay.minH>=34&&lay.sw<=lay.iw+1,nm+': 거래 창이 화면 안 · 단추 '+Math.round(lay.minH)+'px');
  await p.evaluate(()=>document.getElementById('shClose').click());
  // 넘어가면: 판 것은 사라지고 산 것은 가방에
  const x1 = await p.evaluate((gn)=>{ for(const u of world.units.filter(u=>u.side===0&&u.alive)) leaveMap(world,u,'up'); checkEnd(world); mode='plan'; onOver(); const nb=document.getElementById('campNext'); if(nb) nb.click();
    const q=S.units.find(x=>x.name===gn), hero=S.units.find(x=>x.hero); return { s: S.camp.s, sold: (q.bag||[]).filter(x=>x.k!=='ammo').map(x=>x.name), hero: (hero.bag||[]).map(x=>x.k+':'+(x.name||x.at)), world: (world.units.find(u=>u.hero).bag||[]).map(x=>x.k) }; }, g);
  console.log('    '+nm+' 넘어감', JSON.stringify(x1)); ok(x1.s===4&&x1.sold.length===0&&x1.hero.includes('potion:회복약')&&x1.world.includes('potion'),nm+': 넘어가면 건넨 물건은 사라지고 산 회복약 · 화살은 다음 맵 가방에');
  // 회복약 마시기 (명령 → 1초 → 회복 · 가방에서 빠짐)
  const dk = await p.evaluate(()=>{ const u=world.units.find(x=>x.hero), it=u.bag.find(x=>x.k==='potion'); u.hp=20; const h0=u.hp; u.order={k:'swap',uid:it.uid}; mode='run'; for(let i=0;i<60;i++) stepWorld(world,1/30); mode='plan'; return { h0, h1: Math.round(u.hp), max: u.max, left: u.bag.filter(x=>x.k==='potion').length, log: world.log.some(l=>l.k==='drink') }; });
  console.log('    '+nm+' 마심', JSON.stringify(dk)); ok(dk.h1-dk.h0===Math.round(Math.max(20,Math.min(80,dk.max*0.3)))&&dk.left===0&&dk.log,nm+': 회복약을 마시면 최대 체력의 30% (20 ~ 80) 회복 · 가방에서 빠짐');
  // 공격 → 확정 패배
  await p.evaluate(GO3('shop')); await p.waitForTimeout(800); await p.evaluate(ADV); await p.evaluate(NEAR('aiten',2.5)); await p.evaluate(ADV); await p.evaluate(()=>encTick(world)); await p.evaluate(ADV);
  await p.evaluate(TALKTO('cheong')); await p.evaluate(PICK('공격한다'));
  const w1 = await p.evaluate(()=>{ if (TK.timer) talkDone(); const a=TK.full, an=document.getElementById('tkName').textContent; talkAdv(); talkDone(); const b2=TK.full, bn=document.getElementById('tkName').textContent; talkAdv(); talkDone(); const c=TK.full, boxed=document.getElementById('talk').classList.contains('tk-boxed'); talkAdv(); return { a, an, b2, bn, c, boxed, end: S.camp.end, title: document.querySelector('#banner b').textContent, talk: !!TK }; });
  console.log('    '+nm+' 공격', JSON.stringify(w1)); ok(/창을 든다/.test(w1.a)&&/곤란해요/.test(w1.b2)&&w1.bn==='토끼마차 상인'&&w1.boxed&&w1.end==='wipe'&&/토끼마차를 건드렸다/.test(w1.title)&&!w1.talk,nm+': 공격하면 청갑 · 아이텐 → 사각형 나레이션 → 확정 패배 ("토끼마차를 건드렸다")');
  ok(errs.length===0,nm+' 오류 없음 '+JSON.stringify(errs.slice(0,3)));
  await ctx.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7221 OK'); await b.close(); })();
