// v8.7.4 전투 바로잡기 UI 시험 — ui8740.js v1.4 (v1.4: 버전 견줌을 숫자로 (8.8.0 · 그 뒤도 '이상') · v1.3: 버전은 8.7.4 이상 (8.7.5 대형) · v1.2: 세르파 동료 슬라임 조직 (C9) · 역할 진화 · 자리 옮김 기록 · v1.1: 돌진 길 비킴 기록 · 서술 (아군 · 적 궁수) · v1.0: 버전 · 갑피 등급 (특성 검사 · 특성 탭 등급표 · 설계 칸) · 5층 층 보스 붉은암석 (보스 소개 · 옛 저장 serpa) · 망각은 데이터층 정예 · 세르파는 동료 (뽑기 · 만남) · 붉은암석 기술 설명 · 그림 (방어모드 테두리 · 붙잡힌 손 · 바위던지기 예고 줄 · 날아가는 바위 · 망각 예고 · 잡아찢김 시신) 이 오류 없이 · 기록 · 서술 · 동작 이름 · 지휘 기록의 붙잡힘)
const { chromium } = require('playwright');
const vge=(s,m)=>{ const a=String(s||'').match(/(\d+)\.(\d+)\.(\d+)/), b=m.split('.').map(Number); if(!a) return false; for(let i=0;i<3;i++){ const x=+a[i+1]; if(x!==b[i]) return x>b[i]; } return true; };   /* 버전 x.y.z 이상 (숫자로 견줌) */
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/'+(process.argv[2]||'build')+'/wrapped.html';
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ window.__mkF = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...(FOE8[k] && s===1 ? fromDesign(clone(FOE8[k]),1) : fromDesign(designByKey(k),s)), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); W.amb = 1; computeLight(W); markExplored(W); for (const u of W.units) if (u.side===1) u.seenBy = 1; return W; };
   window.__run = (W, sec) => { const n = Math.round(sec / 0.05); for (let i=0;i<n && !W.over;i++) stepWorld(W, 0.05); }; });
 // 1) 버전 · 자료
 const d = await p.evaluate(()=>({ ver: document.querySelector('span.ver') && document.querySelector('span.ver').textContent, mig: RULES_MIG, tk: ['갑피SS','갑피S','갑피A','갑피C','갑피D','속력SS','갑피E','비늘 깃털 갑옷'].map(t=>traitKnown(t)), gt: ['갑피SS','갑피S','갑피C','갑피'].map(galpiTier),
   rr: (({ quakeKill, traits, active }) => ({ quakeKill, traits, active }))(FOE8['붉은암석']), mg: { h2: FOE8['망각'].h2, ov: FOE8['망각'].ov }, sp: { ally: FOE8['세르파'].ally, ov: FOE8['세르파'].ov, traits: FOE8['세르파'].traits },
   boss: [BOSS8.redrock && BOSS8.redrock.foes, BOSS8.serpa && BOSS8.serpa.foes], fix5: FIX8[5].top, f5: F8[5] && F8[5].boss, forget: ELITE8.forget.foes, intro: r8BossIntro('redrock').length, introOld: r8BossIntro('serpa').length,
   act: ['잡아찢기','딥 킥','방어모드','바위던지기'].map(k=>!!ACTIVE[k]), aud: traitAudit([FOE8['붉은암석'], FOE8['세르파'], FOE8['망각'], FOE8['굴란'], FOE8['몽']].map(x=>({ ...x, name: x.key }))).filter(x=>x.lv!=='ok').map(x=>x.msg), dk: [DK_TXT.tear, !!DIE_N.tear] }));
 console.log('    ', JSON.stringify(d).slice(0, 900));
 ok(vge(d.ver,'8.7.4')&&vge(d.mig,'8.7.4'),'버전 8.7.4 이상 · 수치표 이전 8.7.4 이상 ('+d.mig+')');
 ok(JSON.stringify(d.tk)===JSON.stringify([true,true,true,true,true,false,false,true]),'갑피 등급 특성 검사 (SS · S · A · C · D 알고 · 속력SS · 갑피E 모름)');
 ok(JSON.stringify(d.gt)==='[6,5,2,3]','갑피 등급 → 판금 · 투구 (SS 6 · S 5 · C 2 · 등급 없음 3)');
 ok(d.rr.quakeKill==='중대형'&&d.rr.traits.includes('갑피SS')&&d.rr.active.length===5,'붉은암석: 갑피SS · 점프 찍기 중대형 · 기술 다섯 (J22)');
 ok(d.mg.h2==='mangak'&&d.mg.ov.hp===1900&&d.mg.ov.atk===73,'망각: 3D 기술표 · 체력 1900 · 공격 73 (하딤 비율)');
 ok(d.sp.ally&&d.sp.ov.hp===90&&d.sp.traits.includes('갑피C')&&!d.sp.traits.includes('보스'),'세르파: 동료 (체력 90 · 갑피C · 보스 아님)');
 ok(JSON.stringify(d.boss)==='[[["붉은암석",1]],[["붉은암석",1]]]'&&d.fix5.b==='redrock'&&d.f5==='redrock','5층 층 보스 = 붉은암석 (옛 저장 serpa 칸도)');
 ok(JSON.stringify(d.forget)==='[["망각",1],["@saved",2]]','데이터층 정예 = 망각 + 저장된 도전자 둘');
 ok(d.intro===3&&d.introOld===3,'보스 소개 (붉은암석 · 옛 serpa)'); ok(d.act.every(Boolean),'기술 설명 넷 (잡아찢기 · 딥 킥 · 방어모드 · 바위던지기)');
 ok(!d.aud.length,'특성 검사: 경고 없음 '+JSON.stringify(d.aud)); ok(d.dk[0]==='잡아찢김'&&d.dk[1],'죽음 모습 · 서술: 잡아찢김');
 // 2) 특성 탭 등급표 · 설계 칸
 const tt = await p.evaluate(()=>{ renderTraitsTab(); const t = document.getElementById('traitGradeTbl').textContent; return { row: /갑피/.test(t), ss: /\(SS\)/.test(t) }; });
 ok(tt.row,'특성 탭 등급표에 갑피 줄');
 // 3) 판: 붉은암석 — 방어모드 · 붙잡힘 · 바위 · 그림 · 기록 · 서술 · 동작 이름
 const r1 = await p.evaluate(()=>{ const W=__mkF([['붉은암석',1,10,10],['레베카',0,11.2,10],['청광묵',0,13,10],['노먼',0,16,10]]); const R=W.units[0], a=W.units[1], g=W.units[2], n=W.units[3]; const out={ e: [] };
   const tryDraw = (why) => { try { draw(); } catch (e) { out.e.push(why + ': ' + e.message); } };
   R.stoneT = W.t + 3; tryDraw('방어모드'); L(W, { k: 'stoneOn', a: R.i, sec: 3, vis: true });
   R.stoneT = null; R.act = { k: 'spec', s: 'tear', b: a.i, phase: 'run', t0: W.t, end: W.t + 2.2, held: a.i, dmg: 0 }; a.heldBy = R.i; tryDraw('붙잡힘');
   out.lab = actLabel(W, R, liveAct(W, R)); out.ctx = JSON.stringify(cmdCtx(W, [a]));
   L(W, { k: 'tearGrab', a: R.i, b: a.i, sec: 2.2, vis: true }); L(W, { k: 'tearLet', a: R.i, b: a.i, by: g.i, why: '맞아서 놓침', vis: true }); a.heldBy = null; R.act = null;
   R.act = { k: 'spec', s: 'boulder', b: n.i, phase: 'wind', t0: W.t, end: W.t + 0.8 }; tryDraw('바위 예고'); R.act = null;
   (W.spins || (W.spins = [])).push({ boulder: true, by: R.i, side: 1, x: 12, y: 10, dx: 1, dy: 0, v: 14, left: 8, w: 0.6, mul: 1.3, kb: 1.6, hit: [], t0: W.t }); tryDraw('날아가는 바위'); W.spins = [];
   L(W, { k: 'boulder', a: R.i, b: n.i, vis: true }); L(W, { k: 'boulderEnd', a: R.i, b: g.i, x: 13, y: 10, vis: true }); L(W, { k: 'kick', a: R.i, b: g.i, vis: true }); L(W, { k: 'stoneOff', a: R.i, vis: true });
   L(W, { k: 'tear', a: R.i, b: g.i, res: 'break', size: '소형', vis: true }); L(W, { k: 'tear', a: R.i, b: g.i, res: 'hurt', size: '소형', vis: true });
   g.alive = false; g.deathKind = 'tear'; g.deadT = W.t; tryDraw('잡아찢김 시신'); L(W, { k: 'die', a: R.i, b: g.i, how: 'tear', vis: true });
   const lines = logLines(W, 0).join('\n'); out.log = ['잡아찢기 — ','붙잡음','놓침','딥 킥','방어모드 (','방어모드 풀림','바위던지기','바위 — ','팔다리 하나를 부러뜨림','짓이김','잡아찢김'].filter(s => !lines.includes(s));
   const nar = W.log.filter(e => ['tearGrab','tearLet','kick','stoneOn','boulder','boulderEnd','die','tear'].includes(e.k)).map(e => { try { const r = narrOf(W, e); return r ? r.s : null; } catch (x) { out.e.push('narr ' + e.k + ': ' + x.message); return 'ERR'; } });
   out.nar = nar; return out; });
 console.log('     동작', r1.lab, '· 지휘 기록', r1.ctx.slice(0, 120)); console.log('     서술', JSON.stringify(r1.nar).slice(0, 700));
 ok(!r1.e.length,'그림 (방어모드 · 붙잡힘 · 바위 예고 · 날아가는 바위 · 잡아찢김 시신) 오류 없음 '+JSON.stringify(r1.e));
 ok(/잡아찢기 — 레베카를 붙잡고 있음/.test(r1.lab),'붙잡은 쪽 동작 이름 ('+r1.lab+')'); ok(/붙잡힘/.test(r1.ctx),'지휘 기록 상황에 붙잡힘');
 ok(!r1.log.length,'기록 줄 (빠진 글 '+JSON.stringify(r1.log)+')'); ok(r1.nar.filter(Boolean).length>=7&&!r1.nar.includes('ERR'),'서술 (오류 없음 · '+r1.nar.filter(Boolean).length+'줄)');
 // 4) 망각 — 기술표 예고 그림 · 동작 이름 ('공격 준비' 가 아님) · 실제로 몇 초 돌려 봄
 const r2 = await p.evaluate(()=>{ const W=__mkF([['망각',1,10,12],['레베카',0,16,12],['청광묵',0,17,13]]); const M=W.units[0], a=W.units[1]; const out={ e: [] };
   M.act = { k: 'h2', s: 'maw', n: '망각의 아가리', type: 'slash', b: a.i, phase: 'wind', t0: W.t, end: W.t + 1.3, Z: { sh: 'fan', x: M.x, y: M.y, ang: 0, r: 5.5, arc: 1.6 }, mul: 2.4 };
   try { draw(); } catch (e) { out.e.push('h2 예고: ' + e.message); } out.lab = actLabel(W, M, liveAct(W, M)); M.act = null;
   (W.h2z || (W.h2z = [])).push({ by: M.i, side: 1, x: 16, y: 12, r: 1.5, t0: W.t, at: W.t + 0.9, mul: 0.8, n: '망각의 그림자' }); try { draw(); } catch (e) { out.e.push('그림자: ' + e.message); }
   W.h2z = []; paused = false; __run(W, 6); try { draw(); } catch (e) { out.e.push('돌린 뒤: ' + e.message); } out.h2 = W.log.filter(l => l.k === 'h2' || l.k === 'h2Hit').length; out.log = logLines(W, 0).filter(s => /🐾/.test(s)).length; return out; });
 ok(!r2.e.length,'망각 예고 그림 오류 없음 '+JSON.stringify(r2.e)); ok(/망각의 아가리 → 레베카/.test(r2.lab),'기술표 동작 이름 ('+r2.lab+')'); ok(r2.h2>0&&r2.log>0,'6초 돌림: 기술표 기록 '+r2.h2+'줄');
 // 5) 돌진 길 비킴 (엔진 v1.5): 기록 · 서술 — 아군 회피기동 · 적 궁수 본능
 const r5 = await p.evaluate(()=>{ const W=__mkF([['노먼',0,8,10],['검기사',1,13,10],['궁수',1,16,6]]); const n=W.units[0], k=W.units[1], a=W.units[2]; const out={ e: [] };
   L(W, { k: 'evade', a: n.i, b: k.i, m: 'kite', lane: true, vis: true }); L(W, { k: 'mvr', side: 1, m: 'kite', a: a.i, b: n.i, lane: true, obs: true, vis: true }); L(W, { k: 'evade', a: n.i, b: k.i, m: 'kite', vis: true });
   out.log = logLines(W, 0).filter(s => /돌진 길|거리 벌림/.test(s));
   out.nar = W.log.filter(e => e.k === 'evade' || e.k === 'mvr').map(e => { try { const r = narrOf(W, e); return r ? r.s : null; } catch (x) { out.e.push('narr ' + e.k + ': ' + x.message); return 'ERR'; } });
   return out; });
 console.log('     돌진 길', JSON.stringify(r5).slice(0, 600));
 ok(!r5.e.length && r5.log.some(s => /노먼 — 돌진 길 밖으로 옆으로 빠짐 ← 검기사/.test(s)) && r5.log.some(s => /돌진 길 비킴 \(본능\): 궁수.* 달려드는 노먼의 돌진 길 밖으로 옆으로 빠짐/.test(s)) && r5.log.some(s => /거리 벌림 \(쏘고 물러남\)/.test(s)), '기록: 돌진 길 비킴 (아군 · 적 궁수) · 보통 물러남은 그대로');
 ok(r5.nar[0] && /돌진 길에서 옆으로 비켜난다/.test(r5.nar[0]) && r5.nar[1] && /돌진 길에서 옆으로 비켜난다/.test(r5.nar[1]) && r5.nar[2] === '노먼이 거리를 벌린다.', '서술: 돌진 길에서 옆으로 비켜남 ('+JSON.stringify(r5.nar)+')');
 // 6) 세르파 동료의 슬라임 조직 (C9) · 역할 진화 (I25) · 자리 옮김 (J24) 기록
 const r6 = await p.evaluate(()=>{ const out={ e: [] }; let W;
   try { W=__mkF([['세르파',0,8,10],['인주',0,6,10],['검기사',1,28,4]]); } catch(e){ out.e.push('mk '+e.message); return out; }
   const sp=W.units.find(u=>u.name==='세르파'); paused=false; for (let i=0;i<300;i++){ stepWorld(W,1/30); sp8Tick(W); } paused=true;
   out.sp = !!sp; out.ally = sp && sp.side; out.slimes = W.units.filter(u=>u.alive&&u.owner===sp.i&&u.summon==='slime'&&u.side===0).length;
   const g=W.units.find(u=>u.name==='인주'); L(W,{ k:'roleEvo', a:g.i, from:'미드필더', to:'전선', w:'장검', vis:true }); L(W,{ k:'reloc', a:g.i, b:W.units.find(u=>u.side===1).i, why:'바위에 가림', vis:true });
   const lines=logLines(W,0).join('\n'); out.evo=/방패와 장검: 전열 쪽으로 \(역할 진화 · 미드필더 → 전선\)/.test(lines); out.reloc=/같은 까닭으로 두 번 빗나감 \(바위에 가림\): 자리를 옮김/.test(lines);
   try { const r=narrOf(W, W.log.find(e=>e.k==='roleEvo')); out.nar = r && r.s; } catch(e){ out.e.push('narr '+e.message); }
   try { draw(); } catch(e){ out.e.push('draw '+e.message); }
   return out; });
 console.log('     세르파 · 기록', JSON.stringify(r6));
 ok(!r6.e.length&&r6.sp&&r6.ally===0&&r6.slimes>=1,'세르파 (동료) 가 작은 슬라임을 뽑아 곁에 둠 (C9 — '+r6.slimes+'마리)');
 ok(r6.evo&&r6.reloc&&/방패와 장검을 들고 전열에 선다/.test(r6.nar||''),'기록 · 서술: 역할 진화 · 자리 옮김');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,3)));
 console.log(fails ? 'FAILS ' + fails : 'ALL UI8740 OK'); await b.close(); process.exit(fails ? 1 : 0); })();
