// v7.14 UI 시험 — ui714.js v1.4 (v1.4: v9.9.7 2편대 기본값 없음 · v1.3: 종족 · 가호 표는 앞 6000자를 봄 — v8.7.8 서포터 셋 · 적의 종족 (마족 · 정령 · 요정) 이 늘어 앞 300자 밖으로 밀리던 것 · v1.2: 훈련장 탭 여섯 (v7.25.3 인카운터) · v1.1: 모바일 탭 폭은 보이는 탭만 — 훈련장에선 이야기 탭이 숨음 (v7.24.5) · 친칠라 기본 배치 · 옛 저장 이전 · 특성 탭 · 매 판 특성 검사 · 은신 등급 고르기 · 모바일 폭)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:800}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+process.cwd()+'/build/wrapped.html';
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 const c0 = await p.evaluate(()=>{ const c=S.units.find(u=>u.name==='친칠라'); return c ? { sq:c.sq, nvG:c.nvG, w:c.weapon, tr:c.traits, ammo:c.ammo, race:c.race } : null; }); console.log('    친칠라', JSON.stringify(c0));
 ok(c0 && !c0.sq && c0.nvG==='S' && c0.w==='하얀 나무' && c0.tr.includes('은신S') && c0.tr.includes('가호:바다'),'기본 배치에 친칠라 (2편대 기본값 없음 · 야시 S · 하얀 나무 · 은신 S)');
 const g0 = await p.evaluate(()=>S.units.map(u=>u.name+':'+((u.traits||[]).find(t=>/^은신/.test(t))||'-')).join(' ')); console.log('    은신', g0);
 ok(/노먼:은신A/.test(g0)&&/청광묵:은신B/.test(g0)&&/레베카:은신C/.test(g0)&&/카리우스:은신E/.test(g0)&&/궁수:은신S/.test(g0)&&/곤봉적:은신C/.test(g0)&&/검기사:은신A/.test(g0),'정한 은신 등급');
 // 검사: 판 · 설계 · 도감 전체
 const au = await p.evaluate(()=>{ const all = ROSTER.map(r => unitFromRef(r[0], r[2] === '적' ? 1 : 0)); return { board: auditGroup(traitAudit(S.units)), des: auditGroup(traitAudit(designList().map(d => ({ ...d, name: d.key })))), dex: auditGroup(traitAudit(all)) }; });
 console.log('    판', JSON.stringify(au.board)); console.log('    설계', JSON.stringify(au.des)); console.log('    도감 전체 ('+au.dex.length+')', JSON.stringify(au.dex).slice(0,900));
 ok(au.board.length===0 && au.des.length===0,'기본 판 · 설계 칸 특성 검사 이상 없음'); ok(!au.dex.some(x=>x.lv==='bad'||x.lv==='dup'),'도감 전체에 모순 · 중복 없음');
 // 옛 저장 → 이전 (친칠라 없음 · 은신 등급 없음)
 await p.evaluate(()=>{ const o=JSON.parse(localStorage.getItem('gul-battle-v3')||JSON.stringify(S)); o.units=o.units.filter(u=>u.ref!=='C-106'); for(const u of o.units) u.traits=(u.traits||[]).filter(t=>!/^은신/.test(t)); delete o.v714s; localStorage.setItem('gul-battle-v3',JSON.stringify(o)); });
 await p.reload(); await p.waitForTimeout(2000);
 const mg = await p.evaluate(()=>{ const c=S.units.find(u=>u.ref==='C-106'), n=S.units.find(u=>u.ref==='C-007'); return { c: !!c, d: c&&n ? +Math.hypot(c.x-n.x,c.y-n.y).toFixed(2) : null, g: S.units.map(u=>u.name+':'+((u.traits||[]).find(t=>/^은신/.test(t))||'-')).join(' '), toast: document.getElementById('toast').textContent }; });
 console.log('    이전', JSON.stringify(mg)); ok(mg.c && mg.d <= 2.3,'옛 판에 친칠라를 노먼 곁에 놓음'); ok(/노먼:은신A/.test(mg.g)&&/궁수:은신S/.test(mg.g),'옛 판에 은신 등급을 붙임');
 // 특성 탭
 await p.click('.tab[data-tab="traits"]'); await p.waitForTimeout(300);
 const tb = await p.evaluate(()=>({ vis: !document.getElementById('pane-traits').hidden, aud: document.getElementById('traitAuditBox').innerText.replace(/\s+/g,' '), gr: document.querySelectorAll('#traitGradeTbl tr').length, row: [...document.querySelectorAll('#traitGradeTbl tr')].find(r=>r.cells[0]&&r.cells[0].innerText==='은신')?.innerText.replace(/\s+/g,' '), tr: document.querySelectorAll('#traitTbl tr').length, race: document.getElementById('traitRaceTbl').innerText.replace(/\s+/g,' ').slice(0,6000), note: document.getElementById('traitGradeNote').textContent }));
 console.log('    탭', JSON.stringify(tb)); ok(tb.vis && /지금 판 — 이상 없음/.test(tb.aud) && tb.gr>=10 && tb.tr>10,'특성 탭: 검사 · 등급 · 보통 특성'); ok(/친칠라/.test(tb.row||'')&&/카리우스/.test(tb.row||''),'은신 줄에 등급별 인물'); ok(/가호:바다/.test(tb.race)&&/친칠라/.test(tb.race),'종족 · 가호 줄');
 await p.screenshot({path:'ui714_tab.png', fullPage:false});
 // 은신 등급 고르기 (E ~ S)
 await p.evaluate(()=>{ showTab('place'); const k=S.units.find(u=>u.name==='카리우스'); selId=k.id; renderSel(); }); await p.waitForTimeout(200);
 const sel = await p.evaluate(()=>{ const s=document.getElementById('gr-은신'); return s ? [...s.options].map(o=>o.value||'-').join('') + ' / ' + s.value : ''; }); console.log('    고르기', sel); ok(sel==='-EDCBAS / E','은신 고르기에 D · E (카리우스 E)');
 // 매 판 검사: 기본 판은 이상 없음 → 모순을 넣으면 알림
 await p.evaluate(()=>start()); await p.waitForTimeout(300);
 const l1 = await p.evaluate(()=>world.log.find(e=>e.k==='traitAudit')); console.log('    기록', JSON.stringify(l1)); ok(l1 && l1.n===0,'판을 시작하면 특성 검사 (이상 없음)');
 await p.evaluate(()=>{ endFight ? endFight() : null; }).catch(()=>{});
 await p.evaluate(()=>{ mode='edit'; const n=S.units.find(u=>u.name==='노먼'); n.traits=[...n.traits,'사격S','베테랑']; start(); }); await p.waitForTimeout(400);
 const l2 = await p.evaluate(()=>({ e: world.log.find(e=>e.k==='traitAudit'), t: document.getElementById('toast').textContent })); console.log('    모순', JSON.stringify(l2)); ok(l2.e && l2.e.n===2 && /특성 검사: 모순 1 · 중복 1/.test(l2.t),'모순 · 중복이 있으면 알림 · 기록');
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs));
 // 모바일 폭: 특성 탭이 가로로 넘치지 않음
 const m=await (await b.newContext({viewport:{width:412,height:883},isMobile:true,hasTouch:true,deviceScaleFactor:2.6})).newPage(); const e2=[]; m.on('pageerror',e=>e2.push(e.message));
 await m.goto(url); await m.waitForTimeout(400); await m.evaluate(()=>localStorage.clear()); await m.reload(); await m.waitForTimeout(900);
 await m.evaluate(()=>showTab('traits')); await m.waitForTimeout(300); const ov = await m.evaluate(()=>({ sw: document.documentElement.scrollWidth, iw: innerWidth, tabs: [...document.querySelectorAll('.tab')].filter(t=>t.offsetParent!==null).map(t=>t.getBoundingClientRect().width|0) }));
 console.log('    모바일', JSON.stringify(ov)); ok(ov.sw<=ov.iw+1,'모바일: 가로 넘침 없음'); ok(ov.tabs.length===6&&Math.min(...ov.tabs)>=60,'모바일: 탭 여섯이 누를 만한 폭 (보이는 탭 '+ov.tabs.length+')'); await m.screenshot({path:'ui714_mob.png'});
 ok(e2.length===0,'모바일 오류 없음 '+JSON.stringify(e2));
 console.log(fails?`${fails} FAIL`:'ALL UI714 OK'); await b.close(); })();
