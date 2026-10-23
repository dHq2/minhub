// v8.7.3 바로잡기 4 UI 시험 — ui8730b.js v1.4 (v1.4: 2층 뽑기 창은 뜰 때까지 기다림 (나란히 돌려 느릴 때) · v1.3: v8.7.4 5층 보스 붉은암석 · 세르파는 만남의 그림으로 · v1.2: 맵 시작 채움은 여정 맵만 — 훈련장은 정한 탄 그대로 (2/60) · 여정 맵 (createWorld … { camp: true }) 은 가방 화살로 가득 · 다음 맵도 여정 맵으로 · v1.1: 유물 시험은 30층 판 (S.camp.run.relics) 으로 — const r8Has 는 바꿔 끼울 수 없음 · 화살통 크기는 설계 (가방 150) · 정산이 크기를 따로 적음 · 옛 저장 되살림 · 간두가 샷건을 든 채 끝나도 권총 · 원거리 무기는 무기 표로 (단궁 · 하얀 나무 · 샷건) · v1.0: 희귀도 별 (도감) · 30층 여정 기록 (층 · 지대 · 칸 · 유물 · 칸 기록 · 머리글) · 유물 둘 (간호사장 모자 한 번 · 록토 로브 은신 E) · 30층 무리에 1층 설계 없음 · 보스 대사 그림 · 화살통 채우기 (시작 · 20%) · 맨손 글 · 쏜 것 이름 · 회피기동 글 · 받침 · 띄어쓰기 · 적이 없는 맵의 명령 · 전리품 (쓸 사람 · 주인 · 탭) · 목이 꿰뚫림)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const TALKEND = "while (TK){ if (TK.timer) talkDone(); const L=TK.lines[TK.i]; if (L&&L.ask){ talkPick(L.ask[L.ask.length>1?1:0][1]); continue; } talkAdv(); }";
 const wait = (p, ms) => p.waitForTimeout(ms);
 const ctx=await b.newContext({viewport:{width:1280,height:860}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.addInitScript('window.__askAuto=true; window.__noJit=true');
 await p.goto(url); await wait(p,400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await wait(p,1000);
 await p.evaluate(()=>{ window.__mk = (list) => { setMode('train'); resetToEdit(); S.units = list.map(([k,s,x,y])=>({ ...fromDesign(designByKey(k),s), x, y, id: uid() })); start(); paused = true; const W=world; list.forEach(([k,s,x,y],i)=>{ W.units[i].x=x; W.units[i].y=y; W.units[i].order=null; W.units[i].stay=null; }); return W; };
   window.__lit = (W) => { W.amb = 1; computeLight(W); markExplored(W); for (const u of W.units) if (u.side===1) u.seenBy = 1; return W; }; });

 // 1. 희귀도 별 = 도감 (전투 등급 아님)
 const r1 = await p.evaluate(()=>{ const ch = fromDesign(designByKey('친칠라'), 0), ka = fromDesign(designByKey('카리우스'), 0), tr = fromDesign(designByKey('트라카'), 0);
   const card = gachaCard(ch, true); return { ch: RAR_STAR(ch), ka: RAR_STAR(ka), tr: RAR_STAR(tr), tier: ka.tier, card: /★★★★/.test(card) }; });
 console.log('    희귀도', JSON.stringify(r1));
 ok(r1.ch==='★★★★'&&r1.ka==='★★★★★'&&r1.tr==='★'&&r1.tier===2,'별은 도감 희귀도 — 친칠라 ★4 · 카리우스 ★5 · 트라카 ★1 (전투 등급은 그대로 2)');
 ok(r1.card,'뽑기 카드에 희귀도 별 (★★★★ 친칠라)');

 // 2. 유물: 간호사장의 모자 (+2 는 한 번) · 록토의 로브 (은신 E → D)
 const r2 = await p.evaluate(()=>{ const n = fromDesign(designByKey('노먼'), 0), k = fromDesign(designByKey('카리우스'), 0); n.skLeft = 1; const C0 = S.camp; S.camp = { run: { relics: ['nurse', 'rokto'] } };
   const L = []; for (let m = 0; m < 3; m++){ const undo = r8Pre([n, k]); L.push([n.skLeft, n.skill.pool, (k.traits || []).filter(t => /^은신/.test(t)).join('')]); undo(); }
   S.camp = C0; return { L, after: (k.traits || []).filter(t => /^은신/.test(t)).join('') }; });
 console.log('    유물', JSON.stringify(r2));
 ok(r2.L[0][0]===3&&r2.L[1][0]===3&&r2.L[2][0]===3,'간호사장의 모자: 남은 약 +2 는 한 번만 (1 → 3 · 3 · 3, 쌓이지 않음)');
 ok(r2.L.every(x=>x[2]==='은신D')&&r2.after==='은신E','록토의 로브: 은신 E → D 한 단계 (둘이 되지 않음) · 판 뒤엔 E 로');

 // 3. 30층 무리에 1층 설계 없음 · 동굴 괴수 이름
 const r3 = await p.evaluate(()=>{ const oneF = new Set(['C-052','C-053','C-054','C-055','C-056','C-076','C-158','C-045','C-097']); const bad = [];
   for (const [k, z] of Object.entries(THEME8)) for (const [nm] of (z.band || [])){ const f = FOE8[nm]; if (f && oneF.has(f.ref)) bad.push(k + ':' + nm); }
   for (const [k, band] of Object.entries(BAND8)) for (const [nm] of band){ const f = FOE8[nm]; if (f && oneF.has(f.ref)) bad.push('B ' + k + ':' + nm); }
   const missing = []; for (const [k, z] of Object.entries(THEME8)) for (const [nm] of (z.band || [])) if (nm !== '@saved' && !FOE8[nm]) missing.push(k + ':' + nm);
   return { bad, missing, beast: foe8('괴수 A', 3).name }; });
 console.log('    무리', JSON.stringify(r3));
 ok(!r3.bad.length,'30층 무리에 1층 설계 (검사 · 창병 · 검방패병 · 곤봉 거한 · 붉은 망토 궁수 · 똥개 …) 없음 '+r3.bad.join(' '));
 ok(!r3.missing.length,'바꾼 무리 이름이 모두 설계에 있음 '+r3.missing.join(' '));
 ok(r3.beast==='동굴 괴수','자리표시 이름 \'괴수 A\' → 동굴 괴수 ('+r3.beast+')');

 // 4. 보스 대사: 말하는 줄은 모두 그림 (who · img · 이름 → 인물)
 const r4 = await p.evaluate(()=>{ const out = []; const R0 = S.camp; S.camp = S.camp || { run: { neo: 'neodemon', f: 3, flags: {} } };
   for (const b of ['redrock', 'serpa', 'neo', 'theron', 'gods']){ let L = []; try { L = r8BossIntro(b, 0) || []; } catch (e) { out.push(b + ' 오류'); continue; } for (const l of L) if (l.t && !l.who && !l.img && !TALK_WHO[l.name]) out.push(b + ': ' + l.name); }
   S.camp = R0; return { out, serpa: MNPC8.serpa && MNPC8.serpa.ref, art: talkArt('C-277') }; });   // v8.7.4 세르파는 보스가 아님 — 수정동굴 만남의 그림
 console.log('    보스 대사', JSON.stringify(r4));
 ok(!r4.out.length&&r4.serpa==='C-277'&&/serpa/.test(r4.art||''),'보스 대사 줄은 모두 그림 · 세르파 만남 (C-277 · '+r4.art+') '+r4.out.join(' '));

 // 5. 화살통: 맵 시작 때 가방 화살로 가득 · 싸움 중 20% 아래 · 곁에 적이 없으면 미리 채움 · 탄이 떨어져도 가방에 있으면 '맨손' 아님
 const r5 = await p.evaluate(()=>{ setMode('train'); resetToEdit(); const t = { ...fromDesign(designByKey('트라카'), 0), x: 6, y: 10, id: uid() }; t.ammo = 2; t.bag = [{ k: 'ammo', at: '화살', n: 150 }]; S.units = [t, { ...fromDesign(designByKey('검기사'), 1), x: 28, y: 3, id: uid() }]; start(); paused = true; const tr = world.units[0].ammo;
   world = createWorld(S, rules, 7, { camp: true }); const W = world, u = W.units[0], a0 = u.ammo, max = u.ammoMax, bag0 = u.bag.reduce((s, x) => s + (x.k === 'ammo' ? x.n : 0), 0);
   u.ammo = Math.floor(max * 0.15); let k = 0; for (; k < 80 && !(u.act && u.act.k === 'bagAmmo'); k++) stepWorld(W, 0.05); const started = !!(u.act && u.act.k === 'bagAmmo'); for (let i = 0; i < 40 && u.act; i++) stepWorld(W, 0.05);
   const a1 = u.ammo; const nOut0 = W.log.length; u.ammo = 0; outOfAmmo(W, u); const lo = W.log.slice(nOut0).find(l => l.k === 'ammoOut'); const nar = narrOf(W, lo);
   return { tr, a0, max, bag0, started, a1, out: lo && lo.bag, nar: nar && nar.s }; });
 console.log('    화살통', JSON.stringify(r5));
 ok(r5.tr===2,'훈련장은 정한 탄 그대로 (2 → '+r5.tr+')');
 ok(r5.a0===r5.max&&r5.max===60,'여정 맵 시작 때 가방 화살로 화살통을 채움 — 크기는 설계 60 (2 → '+r5.a0+'/'+r5.max+')');
 ok(r5.started&&r5.a1===r5.max,'20% 아래 · 곁에 적이 없으면 미리 꺼내 채움 ('+r5.a1+'/'+r5.max+')');
 ok(r5.out>0&&!/맨손/.test(r5.nar||'')&&/화살통/.test(r5.nar||''),'화살통이 비어도 가방에 있으면 \'맨손\' 이 아님 ("'+r5.nar+'")');

 // 5b. 화살통 크기: 정산이 남은 탄과 크기를 따로 적음 · 다음 맵 크기 그대로 · 옛 저장 (크기 없음) 은 설계로 · 간두가 샷건을 든 채 끝나도 권총
 const r5b = await p.evaluate(()=>{ setMode('train'); resetToEdit(); const t = { ...fromDesign(designByKey('트라카'), 0), x: 6, y: 10, id: uid() }, g = { ...fromDesign(designByKey('간두'), 0), x: 6, y: 12, id: uid() }; fix7251(g);
   S.units = [t, g, { ...fromDesign(designByKey('검기사'), 1), x: 28, y: 3, id: uid() }]; start(); paused = true; const W = world, tu = W.units[0], gu = W.units[1];
   tu.ammo = 13; const gAlt0 = gu.alt && gu.alt.name, pist = gu.ammo; startAlt(W, gu, 'test'); for (let i = 0; i < 20 && gu.act; i++) stepWorld(W, 0.05); const held = gu.weapon; gu.ammo = Math.max(0, gu.ammo - 7);
   settleWorld(W); const pt = S.units.find(x => x.id === t.id), pg = S.units.find(x => x.id === g.id); const out = { a: pt.ammo, mx: pt.ammoMax, gW: pg.weapon, gA: pg.ammo, gAlt: pg.alt && pg.alt.name, gAltA: pg.alt && pg.alt.ammo, gAlt0, held, pist };
   pt.ammo = 5; delete pt.ammoMax; fix873(pt); out.legacy = pt.ammoMax; const lg = { ...fromDesign(designByKey('트라카'), 0) }; lg.weapon = '활'; lg.ammo = 4; fix873(lg); out.picked = lg.ammoMax;
   pt.bag = [{ k: 'ammo', at: '화살', n: 20 }]; resetToEdit(); S.units = [pt, { ...fromDesign(designByKey('검기사'), 1), x: 28, y: 3, id: uid() }]; start(); paused = true; world = createWorld(S, rules, 7, { camp: true }); const u2 = world.units[0]; out.next = [u2.ammo, u2.ammoMax];
   out.far = ['단궁', '하얀 나무', '샷건', '권총', '활', '장검', '흑요석 단검'].map(w => w + ':' + (farW(w) ? 1 : 0)).join(' '); return out; });
 console.log('    화살통 정산', JSON.stringify(r5b));
 ok(r5b.a===13&&r5b.mx===60,'정산: 남은 화살 13 · 화살통 크기 60 을 따로 적음 ('+r5b.a+'/'+r5b.mx+')');
 ok(r5b.legacy===60&&r5b.picked===Math.max(4,(r5b.picked||0)),'옛 저장 (크기 없음) 은 설계 크기로 되살림 (트라카 '+r5b.legacy+') · 주운 활은 무기 기본 ('+r5b.picked+')');
 ok(r5b.next[1]===60&&r5b.next[0]===25,'다음 맵: 크기 60 그대로 · 가방 20 으로 5 → 25 ('+r5b.next.join('/')+')');
 ok(r5b.held==='샷건'&&r5b.gW==='권총'&&r5b.gAlt==='샷건'&&r5b.gA===r5b.pist,'간두가 샷건을 든 채 끝나도 권총 · 두 번째 총은 샷건 그대로 (든 것 '+r5b.held+' → '+r5b.gW+' · 탄 '+r5b.gA+' · 두 번째 '+r5b.gAlt+')');
 ok(r5b.far==='단궁:1 하얀 나무:1 샷건:1 권총:1 활:1 장검:0 흑요석 단검:0','원거리 무기는 무기 표로 ('+r5b.far+')');

 // 6. 글: 쏜 것 이름 · 회피기동 · 받침 · 띄어쓰기 · 간격 · 바꿔 드는 중 · 치료 보류 · 목이 꿰뚫림
 const r6 = await p.evaluate(()=>{ const W = __lit(__mk([['트라카',0,6,10],['간두',0,7,12],['검기사',1,9,10],['창병',1,9,12]])); const tr = W.units[0], ga0 = W.units[1], k = W.units[2];
   const bowNm = shotNm(W, tr), gunNm = shotNm(W, ga0), axe = shotNm(W, k, { tag: '회전하는 도끼' }), kn = shotNm(W, k, { jav: true, kn: true });
   W.log.push({ k: 'evade', a: 0, b: 2, m: 'kite', vis: true, t: 1 }); const ev = narrOf(W, W.log[W.log.length - 1]);
   W.log.push({ k: 'burst', a: 0, b: 2, n: 3, vis: true, t: 1.2 }); const bu = narrOf(W, W.log[W.log.length - 1]);
   W.log.push({ k: 'healHeld', a: 1, b: 0, o: 'exit', hp: 98, t: 101.25 }); W.t = 101.3; const LL = logLines(W); const hh = LL.find(s => /치료 보류/.test(s)) || '';
   const sw = actLabel(W, ga0, { k: 'altSwap', ph: 'wind', b: null, left: 0.2 });
   const dk = typeof DK_TXT !== 'undefined' ? DK_TXT.throatP : null;
   return { bowNm, gunNm, axe, kn, ev: ev && ev.s, bu: bu && bu.s, hh, sw, dk, josa: [reul('곤봉적'), reul('카리우스'), ga('망자 5'), ga(String(3))] }; });
 console.log('    글', JSON.stringify(r6));
 ok(r6.bowNm==='화살'&&r6.gunNm==='탄환'&&r6.axe==='도끼'&&r6.kn==='단검','쏜 것 이름: 활 = 화살 · 총 = 탄환 · 회전 투척 = 도끼 · 투척 = 단검');
 ok(r6.ev&&!/undefined/.test(r6.ev)&&/트라카/.test(r6.ev),'회피기동 이야기에 undefined 없음 ("'+r6.ev+'")');
 ok(r6.bu&&!/드르르륵/.test(r6.bu)&&/시위/.test(r6.bu),'활의 연사는 "드르르륵" 이 아님 ("'+r6.bu+'")');
 ok(/101\.25초 /.test(r6.hh)&&/출구로 명령 중/.test(r6.hh)&&!/exit/.test(r6.hh),'100초 넘는 시각 띄어 씀 · 출구 명령은 한국말 ("'+r6.hh.trim().slice(0,40)+'")');
 ok(/바꿔 드는 중/.test(r6.sw)&&!/\?/.test(r6.sw),'바꿔 드는 동안 "공격 준비 → ?" 가 아님 ("'+r6.sw+'")');
 ok(r6.dk==='목이 꿰뚫림','총 · 화살이 목에 맞으면 "목이 꿰뚫림" (베임은 칼날)');
 ok(r6.josa.join('|')==='곤봉적을|카리우스를|망자 5가|3이','받침 글 ('+r6.josa.join(' · ')+')');

 // 7. 적이 없는 맵: 부르면 닿고 (멀어도) · 자리를 앎
 const r7 = await p.evaluate(()=>{ const W = __mk([['탕아',0,3,3],['트라카',0,28,17],['검기사',1,30,2]]); W.units[0].cmd = 2; const foe = W.units[2]; foe.alive = false; foe.hp = 0; checkEnd(W); W.cleared = true;
   const lk = cmdLink1(W, W.units[0], W.units[1]); for (let i = 0; i < 40; i++) stepWorld(W, 0.05); return { p: lk.p, calm: !!lk.calm, unk: !!W.units[1].posUnk, lost: W.log.filter(l => l.k === 'posLost').length }; });
 console.log('    적 없는 맵', JSON.stringify(r7));
 ok(r7.p===1&&r7.calm&&!r7.unk&&r7.lost===0,'적이 없는 맵: 멀어도 명령이 닿음 (확률 '+r7.p+') · 소식 끊김 없음');

 // 8. 전리품: 쓸 사람이 없으면 나누지 않음 · 제 것은 주인에게 · 남은 게 있으면 전리품 탭부터
 const r8 = await p.evaluate(()=>{ const PL = [{ ...fromDesign(designByKey('노먼'), 0), id: 'n1' }, { ...fromDesign(designByKey('트라카'), 0), id: 't1' }, { ...fromDesign(designByKey('청광묵'), 0), id: 'c1' }];
   const bow = lootFit({ k: 'weapon', name: '활', dur: 100 }, [PL[0]]), knife = lootFit({ k: 'weapon', name: '흑요석 단검', dur: 100, own: PL[2].ref }, PL), bow2 = lootFit({ k: 'weapon', name: '활', dur: 100 }, PL);
   return { bowToNorman: bow ? bow.name : null, knife: knife ? knife.name : null, bow2: bow2 ? bow2.name : null }; });
 console.log('    전리품', JSON.stringify(r8));
 ok(!r8.bowToNorman&&r8.knife==='청광묵'&&r8.bow2==='트라카','전리품: 활을 소총수에게 억지로 안 줌 · 던진 흑요석 단검은 청광묵에게 · 활은 트라카에게');

 // 9. 30층 여정 기록: 층 · 지대 · 칸 · 머리글 · 상인 칸
 await p.evaluate(()=>{ setMode('story'); campStart(); document.getElementById('gAll').click(); document.getElementById('gGo').click(); const C=S.camp; const party=S.units.filter(u=>u.side===0); C.s=6; S.units=party; campEnd('clear'); document.getElementById('campRun8').click(); });
 await p.evaluate(TALKEND); await wait(p,250); await p.waitForSelector('#r8dAll', { state: 'attached', timeout: 15000 }); await p.evaluate(()=>{ document.getElementById('r8dAll').click(); document.getElementById('r8dGo').click(); });
 const r9 = await p.evaluate(async (TE)=>{ const R=R8S(); R.flags=R.flags||{}; R.flags.hargenSeen=1; R.flags.calderapSeen=1; world=null; const n=R.fm.rows[0][0]; n.t='fight'; n.ms='fight'; delete n.npc8; R.at=null; R.done=[]; r8Enter(n); eval(TE);
   const J = S.camp.jr, v = J.visits[J.visits.length - 1]; const shop = { id: 'tshop', t: 'shop' }; R.at = shop.id; jrPanel(shop); jrTalk({ pick: '화살 10발을 산다' });
   const out = await campLogAll(); const txt = out.text.join('\n');
   return { name: v.name, kind: v.kind, back: v.back, r8: v.r8, hasRel: Array.isArray(v.relics), head: out.text[0], kindOut: out.kind, res: out.summary.result, shop: /상인/.test(txt) && /화살 10발을 산다/.test(txt), no1S: !/1S · 공통 전투/.test(txt), maps: out.summary.maps }; }, TALKEND);
 console.log('    30층 기록', JSON.stringify(r9));
 ok(/층 싸움$/.test(r9.name)&&r9.back===false&&r9.r8&&r9.r8.f>=1&&r9.r8.node==='fight'&&r9.hasRel,'30층 맵 기록: "'+r9.name+' · '+r9.kind+'" (1S · 공통 전투 · 다시 들어섬 아님) · 층 · 지대 · 유물');
 ok(/30층 여정 기록/.test(r9.head)&&r9.kindOut==='30층 여정 기록'&&/진행 중 — \d+층/.test(r9.res),'머리글 · 결과: '+r9.head.replace(/^.*— /,'')+' · '+r9.res);
 ok(r9.shop&&r9.no1S,'상인 칸도 기록 (고른 대화) · "1S · 공통 전투" 없음');

 ok(!errs.length,'오류 없음 '+errs.slice(0,3).join(' | '));
 console.log(fails ? fails + ' FAIL' : 'ALL UI8730B OK');
 await b.close(); })();
