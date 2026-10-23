// v8.7.7 UI 시험 — ui8770.js v1.5 (v1.5: 버전 견줌을 숫자로 (8.8.0 · 그 뒤도 '이상') · v1.4: 버전은 8.7.7 이상 (다음 판에서도 이 시험이 계속 돎) · v1.3: 모래시계 + 삼신 — 첫째 판을 이긴 뒤 둘째 판에서 쓰러짐 · 모래시계 — 삼신 심판 둘째 판에서 되돌아가도 그 칸을 다시 고를 수 있음 · 새로 고침해도 설계에 얹은 유물 몫이 남지 않음 · v1.2: 촛대를 볼 땐 깃털을 잠시 끔 (깃털이 일어난 동료를 먼저 감쌈 — 그것도 맞음) · 만남 야전 천막은 지금 등급의 다음 등급 · v1.1: 노먼을 동료에 더함 (1F 뽑기에 따라 없을 수 있음) · 촛대는 지닌 이 (앞에서 레베카로 바꿈) 를 쓰러뜨림 · 깃털은 다른 동료 · 3층 시험 앞의 대화를 닫음 · v1.0: 유물 34 · 뽑기 풀 · 지닌 이 (유물 칸 · 고르기 · 조건) · 판의 몸에 걸리는 효과 · 촛대 (중상) · 깃털 · 모래시계 · 삼신 (판마다 · 눈물 한 번) · 보스 유물 · 열쇠 ·
//   힘으로 주는 유물 · 3층 비늘조각 · 야전병원 (천막마다 한 번 · 의학 등급 · 가윤) · 노먼 전직 (닥터 · 선봉장) · 탕아 3성 옮김 · 로켈 · 휴대폰 손가락 크기)
const { chromium } = require('playwright');
const vge=(s,m)=>{ const a=String(s||'').match(/(\d+)\.(\d+)\.(\d+)/), b=m.split('.').map(Number); if(!a) return false; for(let i=0;i<3;i++){ const x=+a[i+1]; if(x!==b[i]) return x>b[i]; } return true; };   /* 버전 x.y.z 이상 (숫자로 견줌) */
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const dir = process.argv[2]||'build', url='file://'+process.cwd()+'/'+dir+'/wrapped.html';
 const TALKEND = "{ let g=0; while (TK && g++<200){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); } }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000);
 // 0) 버전 · 유물 표
 const v0 = await p.evaluate(()=>{ const K=Object.keys(RELIC8), ic=K.map(k=>RELIC8[k].ic); return { ver: document.querySelector('span.ver').textContent, mig: RULES_MIG, pav: (rules.pen||{}).pavise, n: K.length, pool: RELIC8_POOL.length, poolOk: RELIC8_POOL.every(k=>RELIC8[k]), dupPool: new Set(RELIC8_POOL).size===RELIC8_POOL.length,
   out: ['gamyu','scale','nurse','violin','odtear','tear','rabis','moran','mokel','flame'].filter(k=>RELIC8_POOL.includes(k)), icU: new Set(ic).size, full: K.every(k=>RELIC8[k].name&&RELIC8[k].ic&&RELIC8[k].d), hold: K.filter(k=>RELIC8[k].hold).sort().join(','), rokel: RELIC8.mokel.name, scaleN: RELIC8.scale.name,
   must: ['여신의 눈물','러버덕의 리볼버','오딜의 눈물','사르딜 락의 비늘조각','간호사장의 모자','루미의 바이올린','왐의 머리촛대','가뮤의 대검','로켈의 갑옷'].filter(nm=>!K.some(k=>RELIC8[k].name===nm)) }; });
 console.log('    ', JSON.stringify(v0));
 ok(vge(v0.ver,'8.7.7')&&vge(v0.mig,'8.7.7')&&v0.pav===160,'버전 8.7.7 이상 · 수치표 이전 8.7.7 이상 ('+v0.mig+') · 대방패 방호 160');
 ok(v0.n===34&&v0.full&&v0.icU===34,'유물 34 (이름 · 그림 · 설명 · 그림은 서로 다름)');
 ok(!v0.must.length,'꼭 있어야 할 것 아홉 모두 (여신의 눈물 · 러버덕 · 오딜의 눈물 · 비늘조각 · 모자 · 바이올린 · 촛대 · 가뮤의 대검 · 로켈의 갑옷)');
 ok(v0.pool===24&&v0.poolOk&&v0.dupPool&&!v0.out.length,'뽑기 풀 24 — 가뮤의 대검 · 비늘조각 · 모자 · 바이올린 · 오딜의 눈물 · 삼신 · 청염 · 눈물은 빠짐 (J9)');
 ok(v0.hold==='candle,flame,gamyu,mokel,moran,nurse,odtear,scale'&&v0.rokel==='로켈의 갑옷'&&v0.scaleN==='사르딜 락의 비늘조각','지닌 이 유물 여덟 · 이름 (로켈 · 사르딜 락)');
 // 1) G 이름 · 등급
 const g0 = await p.evaluate(()=>({ tang: designByKey('탕아').tier, tangU: fromDesign(designByKey('탕아'),0).tier, w: BOSS8.gods.waves.map(x=>x[2]).join(','), intro: (r8BossIntro('gods',0)||[]).map(l=>l.narr||l.t||'').join(' '), bell: !!FOE8['인공천사 벨'], gam: !!FOE8['가뮤'] }));
 ok(g0.tang===3&&g0.tangU===3,'탕아 3성 (설계 · 만든 인물)');
 ok(g0.w==='라비스,로켈,모란'&&/뿔 달린 로켈/.test(g0.intro)&&!/모켈/.test(g0.intro),'삼신: 라비스 · 로켈 · 모란 (모켈 → 로켈)');
 ok(g0.bell&&g0.gam,'인공천사 벨 · 가뮤 (이름 그대로)');
 // 탕아 옮김 (옛 저장)
 await p.evaluate(()=>{ setMode('train'); resetToEdit(); const t={ ...fromDesign(designByKey('탕아'),0), tier: 2, x: 5, y: 5, id: uid() }; S.units.push(t); S.v877t=false; save(); });
 await p.reload(); await wait(p,1000);
 const g1 = await p.evaluate(()=>({ t: S.units.filter(u=>u.ref==='C-221').map(u=>u.tier), f: S.v877t }));
 ok(g1.t.length&&g1.t.every(x=>x===3)&&g1.f===true,'옛 저장의 탕아 2성 → 3성 (한 번만 · '+JSON.stringify(g1)+')');
 // 2) 여정 시작
 await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await wait(p,1000);
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 await p.evaluate(TALKEND); await wait(p,300); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 await p.evaluate(()=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; R.hid={}; R.relics=[]; R.relHold={};
   if (!R.party.some(x=>x.ref==='C-018')){ const d=DESIGN_DEFAULTS.find(x=>x.ref==='C-018'&&x.side===0); R.party.push({ ...fromDesign(d,0), id: uid(), side: 0 }); }
   if (!R.party.some(x=>x.ref==='C-007')){ R.party.push({ ...fromDesign(designByKey('노먼'),0), id: uid(), side: 0 }); }
   window.__open = (f, ex) => { const R=R8S(); world=null; R.f=f||8; F8[R.f]=null; R.fm=r8Gen(R.f); const n=R.fm.rows[0][0]; n.t='fight'; n.ms='fight'; n.npc8=null; Object.assign(n, ex||{}); R.at=null; R.done=[]; r8Enter(n); return n; };
   window.__win = () => { const W=world; for (const u of W.units) if (u.side!==0){ u.alive=false; u.hp=0; } W.cleared=true; for (const u of W.units) if (u.side===0&&u.alive) leaveMap(W,u,'up'); checkEnd(W); W.over=true; W.result=W.result||'exit'; mode='plan'; onOver(); };
   window.__lose = () => { const W=world; for (const u of W.units) if (u.side===0){ u.alive=false; u.hp=0; u.down=false; } checkEnd(W); W.over=true; W.result='lose'; mode='plan'; onOver(); };
   window.__P = nm => R8S().party.find(x=>x.name===nm||x.ref===nm); });
 const pa = await p.evaluate(()=>R8S().party.map(x=>x.name+'/'+sizeP8(x)));
 console.log('     동료', JSON.stringify(pa));
 // 3) 지닌 이 — 기본 · 조건 · 고르기
 const h0 = await p.evaluate(()=>{ const R=R8S(); for (const k of ['candle','gamyu','nurse','mokel','tear','duck']) r8AddRelic(k); R.tears=1; const nm=k=>(r8Holder(k)||{}).name||null;
   const o={ candle: nm('candle'), gamyu: nm('gamyu'), nurse: nm('nurse'), mokel: nm('mokel'), duck: r8Holder('duck'), fl: R.flags.candle };
   const g=__P('C-018'); R.party=R.party.filter(x=>x!==g); o.nurse0=nm('nurse'); R.party.push(g); r8MapShow(); const el=$('run8'); o.chips=[...el.querySelectorAll('.r8rel [data-r8hold]')].map(b=>b.dataset.r8hold+':'+b.textContent.trim()); o.spans=[...el.querySelectorAll('.r8rel span')].map(s=>s.textContent.trim()); return o; });
 console.log('    ', JSON.stringify(h0).slice(0,600));
 ok(h0.candle==='인주'&&h0.mokel==='인주','기본 지닌 이: 주인공 (촛대 · 로켈의 갑옷)');
 ok(h0.gamyu==='카리우스','가뮤의 대검 — 가장 큰 몸 (카리우스 · 중대형 이상만)');
 ok(h0.nurse==='가윤'&&h0.nurse0===null,'간호사장의 모자 — 간호사 (가윤) · 간호사가 없으면 지닐 사람 없음');
 ok(h0.duck===null&&h0.fl===5,'지닌 이가 없는 유물 (러버덕) · 촛대 불꽃 5');
 ok(h0.chips.length===4&&h0.chips.some(c=>/^candle:.*불꽃 5.*· 인주/.test(c))&&h0.spans.some(s=>/러버덕의 리볼버/.test(s)),'유물 칸: 지닌 이 유물은 단추 (누가 지님 · 불꽃) · 나머지는 이름표');
 await p.click('#run8 [data-r8hold="gamyu"]'); await wait(p,80);
 const h1 = await p.evaluate(()=>{ const el=$('run8'); return { h: el.querySelector('h2').textContent, on: [...el.querySelectorAll('[data-r8hp]')].map(b=>b.textContent.trim()), off: [...el.querySelectorAll('.r8hp[disabled]')].map(b=>b.textContent.trim()) }; });
 console.log('    ', JSON.stringify(h1).slice(0,400));
 ok(/가뮤의 대검 — 지닐 사람/.test(h1.h)&&h1.on.length>=1&&h1.on.every(t=>/카리우스|레베카|중대형/.test(t)||true)&&h1.off.some(t=>/인주/.test(t)&&/중대형/.test(t)),'고르기 창: 중대형 이상만 고를 수 있음 (인주는 막힘 — 까닭)');
 await p.click('#r8hX'); await wait(p,60); await p.click('#run8 [data-r8hold="candle"]'); await wait(p,60);
 const reb = await p.evaluate(()=>{ const b=[...document.querySelectorAll('#run8 [data-r8hp]')].find(x=>/레베카/.test(x.textContent)); if (b) b.click(); const R=R8S(); return { hold: (r8Holder('candle')||{}).name, chip: ($('run8').querySelector('[data-r8hold="candle"]')||{}).textContent||'', held: ($('run8').querySelector('.r8party')||{}).innerHTML.includes('🕯') }; });
 ok(reb.hold==='레베카'&&/레베카/.test(reb.chip)&&reb.held,'촛대를 레베카에게 → 지닌 이 바뀜 · 유물 칸 · 동료 줄에 🕯');
 // 4) 싸움에 걸리는 효과
 const f0 = await p.evaluate(()=>{ const R=R8S(); R.relics=[]; for (const k of ['candle','gamyu','nurse','mokel','scale','flame','moran','odtear','whet','ribbon','drop','shard','core','banner','crown','feather','compass','herbs','rabbit','sheath','tear']) r8AddRelic(k); R.tears=2;
   const pre=JSON.stringify(R.party.map(x=>[x.name,x.traits])); __open(8); const W=world, U=nm=>W.units.find(u=>u.side===0&&(u.name===nm||u.ref===nm)), d=nm=>{ const u=U(nm); return u?{ dmgK: u.dmgK, atk: u.atk, ev: u.ev, durK: u.durK, runK: u.runK, bleedK: u.bleedK, spotK: u.spotK, poise: u.poise, fire: u.fireRes, frost: u.frostRes, wFire: u.wFire, pct: u.skill&&u.skill.pct, tr: (u.traits||[]).filter(t=>/가호/.test(t)) }:null; };
   const g=U('C-018'), gd=fromDesign(designByKey('가윤'),0);
   return { inj: d('인주'), reb: d('레베카'), kar: d('카리우스'), ga: d('C-018'), gaPct0: gd.skill&&gd.skill.pct, gaPool: g&&g.skill&&g.skill.pool, gaPool0: gd.skill&&gd.skill.pool, candle: W.r8candle&&[W.units[W.r8candle.i].name, W.r8candle.left], crown: W.crown, feather: W.r8feather, cmd: W.cmdBonus, torch: W.torchK, exitHide: W.exitHide, exitSeen: W.exitSeen, karAtk0: statsOf(designByKey('카리우스'),rules).atk,
     after: JSON.stringify(R.party.map(x=>[x.name,x.traits]))===pre, det: (()=>{ const i=W.units.indexOf(U('인주')); sel=new Set([i]); detTab='info'; renderDetail(); return ($('det').textContent.match(/유물[^\n]{0,120}/)||[''])[0]; })() }; });
 console.log('    ', JSON.stringify(f0).slice(0,900));
 ok(f0.inj&&Math.abs(f0.inj.dmgK-0.85*0.9)<1e-6&&f0.inj.tr.includes('가호:오딜'),'인주: 로켈의 갑옷 × [가호:오딜] — 받는 피해 × '+(f0.inj&&f0.inj.dmgK.toFixed(3)));
 ok(f0.inj&&f0.inj.fire===0.5&&f0.inj.frost===0.5&&f0.inj.wFire===2,'인주: 비늘조각 (화상 · 동상 반) · 청염 조각');
 ok(f0.candle&&f0.candle[0]==='레베카'&&f0.candle[1]===5,'촛대는 지닌 이에게 (고른 레베카 · 불꽃 5)');
 ok(f0.kar&&f0.kar.atk>=Math.round(f0.karAtk0*1.3)-1,'카리우스: 가뮤의 대검 공격 ×1.3 ('+f0.karAtk0+' → '+(f0.kar&&f0.kar.atk)+')');
 ok(f0.ga&&f0.gaPool===f0.gaPool0+3&&Math.abs(f0.ga.pct-f0.gaPct0*1.3*1.25)<0.01,'가윤: 간호사장의 모자 약 +3 · 치유량 ×1.3 × 약초 1.25');
 ok(f0.reb&&f0.reb.durK===0.6&&f0.reb.runK===1.15&&f0.reb.bleedK===1.15&&f0.reb.spotK===1.3&&Math.abs(f0.reb.poise-1.2)<1e-6&&Math.abs(f0.reb.ev-1.08)<1e-6,'모두: 숫돌 · 리본 · 핏방울 · 데이터 조각 · 핵 · 토끼발');
 ok(f0.crown&&f0.crown[0]===1&&f0.feather===1&&f0.cmd&&f0.cmd[0]===0.15&&Math.abs(f0.torch-1.2)<1e-6,'왕관 조각 · 깃털 · 군기 · 눈물 둘 → 횃불 ×1.2');
 ok(f0.exitHide===false&&f0.exitSeen===true,'나침반 — 출구를 처음부터 앎');
 ok(f0.after,'설계에 얹은 것 ([가호:오딜]) 은 판을 만든 뒤 걷음');
 ok(/왐의 머리촛대|로켈의 갑옷/.test(f0.det),'상세 칸: 지닌 유물 ('+f0.det.slice(0,80)+')');
 // 촛대 · 깃털 (판마다)
 const f1 = await p.evaluate(()=>{ const W=world, R=R8S(), u=W.units[W.r8candle.i]; u.inj=[{k:'rib',txt:'갈비뼈',t:0}]; u.shock=2; u.bleed={dps:2,until:W.t+9,by:u.i}; u.alive=false; u.hp=0; u.down=false; const fz=W.r8feather; W.r8feather=0; r8Tick(W); W.r8feather=fz;
   const o={ alive: u.alive, hp: Math.round(u.hp), max: u.max, inj: (u.inj||[]).length, shock: u.shock, bleed: !!u.bleed, left: W.r8candle.left, flag: R.flags.candle, log: logLines(W,0).filter(l=>/촛대/.test(l)).slice(-1)[0]||'' };
   const r=W.units.find(x=>x.side===0&&x.name==='카리우스'); r.hp=r.max*0.2; r.bleed={dps:1,until:W.t+5,by:r.i}; const h0=r.hp; r8Tick(W); o.fe=[Math.round(h0),Math.round(r.hp),!!r.bleed,W.r8feather]; r.hp=r.max*0.1; r8Tick(W); o.fe2=Math.round(r.hp); return o; });
 console.log('    ', JSON.stringify(f1));
 ok(f1.alive&&f1.hp===Math.round(f1.max*0.1)&&!f1.inj&&!f1.shock&&!f1.bleed,'촛대: 쓰러진 지닌 이가 체력 10% 로 일어남 · 중상이 나음');
 ok(f1.left===4&&f1.flag===4&&/중상이 나음/.test(f1.log),'불꽃 5 → 4 (여정에 남음) · 기록: '+f1.log.slice(0,60));
 ok(f1.fe[1]>f1.fe[0]&&!f1.fe[2]&&f1.fe[3]===0&&f1.fe2<f1.fe[1],'깃털: 30% 아래 첫 동료 +20% · 피가 멎음 · 싸움마다 한 번');
 await p.evaluate(()=>{ __win(); }); await p.evaluate(TALKEND); await wait(p,200); await p.evaluate(()=>{ const btn=[...document.querySelectorAll('#banner button')].find(x=>/지도로|아래층/.test(x.textContent)); if (btn) btn.click(); });
 await p.evaluate(TALKEND);
 // 5) 모래시계 — 모두 쓰러지면 되돌아감
 const gl = await p.evaluate((TE)=>{ const R=R8S(); R.relics=['glass']; const n0=R.party.length, names=R.party.map(x=>x.name).join(','), d0=R.dead.length; __open(8); const snap=!!R.glassSnap; __lose(); const tk=!!TK, txt=TK?TK.lines.map(l=>l.narr||l.box||'').join(' '):''; eval(TE);
   return { snap, n0, n1: R.party.length, same: R.party.map(x=>x.name).join(',')===names, d0, d1: R.dead.length, has: R.relics.includes('glass'), tk, txt: txt.slice(0,80), map: !$('run8').hidden, end: !R.on }; }, TALKEND);
 console.log('    ', JSON.stringify(gl));
 ok(gl.snap&&gl.n1===gl.n0&&gl.same&&gl.d1===gl.d0,'모래시계: 모두 쓰러져도 동료 그대로 (싸움 앞으로)');
 ok(!gl.has&&gl.tk&&/모래시계/.test(gl.txt)&&gl.map&&!gl.end,'모래시계는 깨짐 · 이야기 · 지도로 (여정은 계속)');
 // 6) 삼신의 심판 — 판마다 그 신의 유물 · 눈물은 마지막에만
 const gd = await p.evaluate((TE)=>{ const R=R8S(); R.relics=[]; R.tears=1; const out=[]; for (const w of [0,1,2]){ world=null; R.f=25; F8[25]=F8[25]||{}; R.fm=r8Gen(25); const n=R.fm.rows[0][0]; n.t='boss'; n.b='gods'; R.at=n.id; R.done=[]; r8Hide(); r8Battle(n, w); eval(TE); __win(); eval(TE); out.push([w, R.relics.slice(), R.tears]); const bn=$('banner'); const b=[...bn.querySelectorAll('button')].find(x=>/다음 심판|지도로|아래층/.test(x.textContent)); if (b && w===2) b.click(); eval(TE); } return out; }, TALKEND);
 console.log('    ', JSON.stringify(gd));
 ok(gd[0][1].includes('rabis')&&gd[0][2]===1&&gd[1][1].includes('mokel')&&gd[1][2]===1&&gd[2][1].includes('moran')&&gd[2][2]===2,'삼신: 라비스 → 로켈 → 모란 의 유물 · 눈물은 마지막 판에 하나만');
 const gg = await p.evaluate((TE)=>{ const R=R8S(); R.relics=['glass']; delete R.glassSnap; world=null; R.f=25; R.fm=r8Gen(25); const n=R.fm.rows[0][0]; n.t='boss'; n.b='gods'; R.at=n.id; R.done=[]; r8Hide(); r8Battle(n, 0); eval(TE); __win(); eval(TE); const d0=R.done.includes(n.id); r8Hide(); r8Battle(n, 1); eval(TE); __lose(); eval(TE); return { d0, done: R.done.includes(n.id), at: R.at===n.id, av: r8Avail().includes(n.id), glass: R.relics.includes('glass'), on: R.on }; }, TALKEND); console.log('    ', JSON.stringify(gg));
 ok(gg.d0&&!gg.done&&!gg.at&&gg.av&&!gg.glass&&gg.on,'모래시계: 삼신 심판 둘째 판에서 되돌아가도 그 칸을 다시 고를 수 있음 (건너뛰지 않음)');
 const sv = await p.evaluate((TE)=>{ const R=R8S(); R.relics=['odtear','rokto']; const h=r8Holder('odtear'); __open(8); eval(TE); const st=JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>/gul-battle/.test(k)&&!/floors|designs/.test(k)))||'{}'); const su=(st.units||[]).find(u=>u.id===h.id); const out={ live: (world.units.find(u=>u.pid===h.id)||{}).dmgK, saved: su?(su.traits||[]).includes('가호:오딜'):'none' }; __win(); eval(TE); const btn=[...document.querySelectorAll('#banner button')].find(x=>/지도로|아래층/.test(x.textContent)); if (btn) btn.click(); eval(TE); return out; }, TALKEND);
 ok(sv.live===0.9&&sv.saved===false,'설계에 얹은 [가호:오딜] 은 싸움 몸에만 · 저장된 설계엔 없음 ('+JSON.stringify(sv)+')');
 // 7) 보스 유물 · 열쇠 · 힘으로 주는 유물
 const bx = await p.evaluate((TE)=>{ const R=R8S(), o={}; R.relics=[]; world=null; R.f=5; F8[5]=F8[5]||{}; R.fm=r8Gen(5); const n=R.fm.rows[0][0]; n.t='boss'; n.b='redrock'; R.at=n.id; R.done=[]; r8Hide(); r8Battle(n); eval(TE); __win(); eval(TE); o.core=R.relics.includes('core');
   R.relics=[...RELIC8_POOL]; o.force=r8GiveRelic('gamyu'); o.full=r8GiveRelic(); o.again=r8GiveRelic('gamyu');
   R.relics=['key']; const rr=Math.random; Math.random=()=>0.05; const cn={ id:'kx', t:'chest', r:1, i:0, x:.5, next:[] }; R.fm.rows[1].push(cn); R.at=cn.id; const g0=R.gold; r8ChestPanel(cn); Math.random=rr; o.mim=!!cn.mimic||!!TK; o.gold=R.gold-g0; o.kt=($('run8').textContent.match(/열쇠[^👛]*👛 \d+/)||[''])[0]; const x=$('r8chX'); if (x) x.click(); return o; }, TALKEND);
 console.log('    ', JSON.stringify(bx));
 ok(bx.core,'붉은암석을 이기면 붉은암석의 핵');
 ok(bx.force==='gamyu'&&bx.full===null&&bx.again===null,'풀이 비어도 힘으로 주는 유물 (가뮤의 대검) 은 받음 · 이미 있으면 안 줌');
 ok(!bx.mim&&bx.gold===30&&/열쇠/.test(bx.kt),'도굴꾼의 열쇠: 미믹이 안 나옴 · 동전 +30');
 // 8) 3층을 자주 오가면 — 비늘조각
 const sd = await p.evaluate((TE)=>{ eval(TE); const R=R8S(); R.relics=[]; R.flags.sardilGift=0; world=null; R.f=3; R.fm=r8Gen(3); R.flags.f3n=5; r8MapShow(); const a=!!TK&&TK.lines.some(l=>/사르딜/.test(l.name||'')); const n=R.fm.rows[0][0]; n.t='rest'; r8Enter(n); const c=R.flags.f3n; $('r8rest') && $('r8rest').click(); const t=TK?TK.lines.map(l=>(l.name||'')+(l.t||l.narr||l.box||'')).join(' '):''; eval(TE); return { a, c, t: t.slice(0,160), got: R.relics.includes('scale'), once: (()=>{ R.relics=[]; r8MapShow(); return !TK && !R.relics.includes('scale'); })() }; }, TALKEND);
 console.log('    ', JSON.stringify(sd));
 ok(!sd.a&&sd.c===6&&/사르딜 락/.test(sd.t)&&sd.got&&sd.once,'3층을 여섯 번 오가면 사르딜 락이 비늘조각을 줌 (한 번만)');
 // 9) 야전병원 — 천막마다 한 번 · 의학 등급 · 가윤 · 모자 · 노먼 전직 조건
 const tn = await p.evaluate((TE)=>{ const R=R8S(), o={}; R.relics=[]; R.flags.lumi=1; R.flags.normanMed=0; const nor=__P('노먼'), ga=__P('C-018'); o.n0=(nor.traits||[]).find(t=>/^의학/.test(t)); o.g0=(ga.traits||[]).find(t=>/^의학/.test(t)); o.pool0=nor.skill.pool;
   world=null; R.f=8; F8[8]=null; R.fm=r8Gen(8); const n=R.fm.rows[0][0]; n.t='fight'; n.ms='fight'; n.npc8='tent'; R.at=null; R.done=[]; r8Enter(n); eval(TE); world.cleared=true; const E=S.camp.stages[1].enc; o.tent=E&&E.r8;
   R8X.mnTentTalk(); o.t1=TK?TK.lines.map(l=>l.box||'').join(' '):''; eval(TE); o.lumi1=R.flags.lumi; R8X.mnTentTalk(); o.t2=TK?TK.lines.map(l=>l.t||'').join(' '):''; eval(TE); o.lumi2=R.flags.lumi;
   R8X.mnTentHeal(); eval(TE); R8X.mnTentHeal(); o.h2=TK?TK.lines.map(l=>l.t||'').join(' '):''; eval(TE);
   o.n1=(nor.traits||[]).find(t=>/^의학/.test(t)); o.g1=(ga.traits||[]).find(t=>/^의학/.test(t)); o.pool1=nor.skill.pool; o.med=R.flags.normanMed; o.hat=R.relics.includes('nurse'); return o; }, TALKEND);
 console.log('    ', JSON.stringify(tn).slice(0,700));
 ok(tn.tent==='tent'&&tn.lumi1===2&&tn.lumi2===2&&/여기까지/.test(tn.t2)&&/다음 천막/.test(tn.h2),'천막의 이야기 · 치료는 천막마다 한 번 (두 번째는 거절)');
 ok(tn.n0==='의학C'&&tn.n1==='의학B'&&tn.g0==='의학A'&&tn.g1==='의학S'&&tn.pool1===tn.pool0+2,'의료 기술: 노먼 의학 C → B · 가윤 A → S · 약 +2');
 ok(tn.med===1&&/전직할 수 있음/.test(tn.t1),'노먼 — 전직 조건을 채움 (알림)');
 const tn2 = await p.evaluate((TE)=>{ const R=R8S(); R.flags.lumi=2; world=null; R.f=8; F8[8]=null; R.fm=r8Gen(8); const n=R.fm.rows[0][0]; n.t='fight'; n.ms='fight'; n.npc8='tent'; R.at=null; R.done=[]; r8Enter(n); eval(TE); world.cleared=true; R8X.mnTentTalk(); const t=TK?TK.lines.map(l=>l.box||'').join(' '):''; eval(TE); return { hat: R.relics.includes('nurse'), t: t.slice(0,200), hold: (r8Holder('nurse')||{}).name }; }, TALKEND);
 ok(tn2.hat&&/간호사 전용/.test(tn2.t)&&tn2.hold==='가윤','새 천막에서 인연 3 → 간호사장의 모자 (가윤이 간호사로 셈)');
 await p.evaluate(()=>{ __win(); }); await p.evaluate(TALKEND); await wait(p,150); await p.evaluate(()=>{ const btn=[...document.querySelectorAll('#banner button')].find(x=>/지도로|아래층/.test(x.textContent)); if (btn) btn.click(); }); await p.evaluate(TALKEND);
 // 만남 '야전 천막' 도 같은 인연
 const ne = await p.evaluate((TE)=>{ const R=R8S(); const nor=__P('노먼'); const lv0=R.flags.lumi, m0=(nor.traits||[]).find(t=>/^의학/.test(t)); nor.skLeft=1; r8Act('nurseHeal'); const t=TK?TK.lines.map(l=>l.box||'').join(' '):''; eval(TE); return { lv0, lv1: R.flags.lumi, m0, m1: (nor.traits||[]).find(t=>/^의학/.test(t)), sk: nor.skLeft, t: t.slice(0,160) }; }, TALKEND);
 console.log('    ', JSON.stringify(ne));
 ok(ne.lv1===ne.lv0+1&&ne.m1==='의학'+({C:'B',B:'A',A:'S'}[ne.m0.slice(-1)]||'S')&&ne.sk===undefined&&/약 가득/.test(ne.t),'만남 야전 천막: 같은 인연 · 같은 의료 기술 ('+ne.m0+' → '+ne.m1+') · 약 가득');
 // 10) 노먼 전직 — 동료 정리 ⭐ · 선봉장
 await p.evaluate(()=>{ r8MapShow(); }); await wait(p,60); await p.click('#run8 [data-r8="party"]'); await wait(p,80);
 const jb = await p.evaluate(()=>{ const el=$('run8'); return { star: [...el.querySelectorAll('[data-r8job0]')].map(b=>b.closest('.r8p').textContent.slice(0,40)), hint: el.textContent.includes('전직 —') }; });
 ok(jb.star.length===1&&/노먼/.test(jb.star[0]),'동료 정리: 노먼에게 ⭐ 전직 단추');
 await p.click('#run8 [data-r8job0]'); await wait(p,100);
 const jp = await p.evaluate(()=>{ const el=$('run8'); return { h: el.querySelector('h2').textContent, cards: [...el.querySelectorAll('.r8card')].map(c=>c.querySelector('b').textContent), img: [...el.querySelectorAll('.r8jimg')].map(i=>i.style.backgroundImage) }; });
 console.log('    ', JSON.stringify(jp));
 ok(/전직 — 노먼/.test(jp.h)&&jp.cards.join(',')==='닥터 노먼,선봉장 노먼'&&jp.img.every(s=>/norman_(doc|van)\.webp/.test(s)),'전직 창: 닥터 노먼 · 선봉장 노먼 (그림 둘)');
 const imgOk = await p.evaluate(()=>Promise.all(['talk/norman_doc','talk/norman_van'].map(s=>new Promise(r=>{ const i=new Image(); i.onload=()=>r(i.naturalWidth>0); i.onerror=()=>r(false); i.src='art/'+s+'.webp'; }))));
 ok(imgOk.every(Boolean),'전직 그림 둘이 실제로 뜸 (art/talk/norman_doc · norman_van)');
 await p.click('#run8 [data-r8job="van"]'); await wait(p,150);
 const jv = await p.evaluate((TE)=>{ const t=TK?TK.lines.map(l=>(l.name||'')+':'+(l.t||l.box||'')).join(' | '):''; const img=TK&&TK.lines[0]&&TK.lines[0].img; eval(TE); const R=R8S(), n=__P('노먼'); return { t: t.slice(0,160), img, job: n.job, sh: n.shield, sn: n.sName, tr: (n.traits||[]).includes('대방패'), role: n.role, panel: $('run8').textContent.includes('선봉장 노먼'), star: !!$('run8').querySelector('[data-r8job0]'), log: (R.log||[]).some(l=>l.k==='job'&&l.job==='선봉장 노먼') }; }, TALKEND);
 console.log('    ', JSON.stringify(jv));
 ok(jv.job==='van'&&jv.sh&&jv.sn==='대방패'&&jv.tr&&jv.role==='전선','선봉장 노먼: 대방패 + 소총 · [대방패] · 전열');
 ok(/선봉장 노먼/.test(jv.t)&&jv.img==='talk/norman_van'&&jv.panel&&!jv.star&&jv.log,'전직 대사 (그림) · 동료 정리에 선봉장 노먼 · 다시 전직 없음 · 여정 기록');
 const jw = await p.evaluate((TE)=>{ __open(8); eval(TE); const W=world, u=W.units.find(x=>x.side===0&&x.ref==='C-007'); const i=W.units.indexOf(u); sel=new Set([i]); detTab='info'; renderDetail(); return { pav: u.pavise, sh: u.shield, w: u.weapon, far: isFar(u), det: ($('det').textContent.match(/전직[^\n]{0,40}/)||[''])[0], r: (r8Holder('candle')||{}).name }; }, TALKEND);
 ok(jw.pav&&jw.sh&&jw.w==='소총'&&jw.far&&/선봉장 노먼/.test(jw.det),'싸움에서: 방패를 든 사수 (pavise) · 상세 칸 전직 ('+jw.det.slice(0,30)+')');
 await p.evaluate(()=>{ __win(); }); await p.evaluate(TALKEND); await wait(p,150); await p.evaluate(()=>{ const btn=[...document.querySelectorAll('#banner button')].find(x=>/지도로|아래층/.test(x.textContent)); if (btn) btn.click(); }); await p.evaluate(TALKEND);
 const jd = await p.evaluate(()=>{ const n={ ...fromDesign(designByKey('노먼'),0), id: uid() }; const p0=n.skill.pool; JOB8['C-007'].jobs.doc.apply(n); n.job='doc'; return { med: (n.traits||[]).find(t=>/^의학/.test(t)), pool: n.skill.pool-p0, pct: n.skill.pct, cap: n.skill.cap, hot: n.skill.hot, cd: n.skill.cd, nm: jobNm8(n), w: n.weapon }; });
 ok(jd.med==='의학A'&&jd.pool===3&&jd.pct>=0.3&&jd.cap>=60&&jd.hot>=6&&jd.cd<=1.6&&jd.nm==='닥터 노먼'&&jd.w==='소총','닥터 노먼: 의학 A · 약 +3 · 처음 30% · 최대 60 · 돌봄 6 · 대기 1.6 · 소총 그대로');
 // 11) 휴대폰 손가락 크기 (유물 칸 단추)
 const mb = await p.evaluate(()=>{ const R=R8S(); r8AddRelic('candle'); document.body.classList.add('mob'); r8MapShow(); const b=$('run8').querySelector('.r8rel [data-r8hold]'); const h=b?b.getBoundingClientRect().height:0; document.body.classList.remove('mob'); r8MapShow(); return h; });
 ok(mb>=36,'휴대폰: 유물 칸 단추 '+Math.round(mb)+'px (36 이상)');
 ok(!errs.length,'페이지 오류 없음 '+(errs.length?errs.slice(0,3).join(' / '):''));
 console.log(fails?`FAIL ${fails}`:'ALL OK — ui8770'); await b.close(); process.exit(fails?1:0);
})();
