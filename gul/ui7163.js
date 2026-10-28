// v7.16.3 UI 시험 — ui7163.js v1.2 (v1.2: v9.11.0 훈련장 동료 뽑기 없앰 — 뽑기 칸이 비고 숨었는지 · 노먼 · 청광묵은 도감으로 놓고 같은 검사 · v1.1: v9.9.7 공식 부대장 · 2편대 기본값 없앰 — 직책 · 편대는 '없음' 으로 검사 · v1.0: 동료 뽑기 = 설계대로 (야시 · 응급처치 · 편대) · '지금 동료' = 실제 배치 · 옛 저장 한 번 고침 · 후각 설명 = 수치표 · 응급처치 편집 칸 · 설명 글)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+process.cwd()+'/build/wrapped.html';
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 // '지금 동료' = 실제 배치
 const d0 = await p.evaluate(()=>{ renderDraft(); const b=document.getElementById('draftBox'); return { hid: b.hidden, txt: b.innerText.trim() }; });
 ok(d0.hid&&!d0.txt,'훈련장 동료 뽑기 없앰 (칸이 비고 숨음)');
 // 동료 뽑기로 노먼 · 청광묵
 const dr = await p.evaluate(()=>{ for (const r of ['C-007','C-004']) if (!S.units.some(u=>u.ref===r)){ const u=unitFromRef(r,0); u.x=4.5+S.units.length%6; u.y=4.5; S.units.push(u); } changed();
   const n=S.units.find(u=>u.ref==='C-007'), g=S.units.find(u=>u.ref==='C-004'), h=S.units.find(u=>u.hero); const k=n.skill||{};
   return { n: { nv: n.nv&&n.nvG, hot: k.hot, cap: k.cap, pct: k.pct, rank: n.rank, sq: n.sq }, g: { nv: g.nv&&g.nvG, sq: g.sq, w: g.weapon }, h: h&&(h.nv&&h.nvG), txt: S.units.filter(u=>u.side===0).map(u=>u.name).join(' ') }; });
 console.log('    뽑기', JSON.stringify(dr));
 ok(dr.n.nv==='A'&&dr.g.nv==='B'&&dr.h==='C','뽑기로 들어와도 야시 그대로 (노먼 A · 청광묵 B · 인주 C)'); ok(dr.n.hot===4&&dr.n.cap===30&&dr.n.pct===0.2,'노먼 응급처치 = 설계 (20% · 10~30 · 돌봄 4)'); ok(!dr.n.rank&&!dr.n.sq&&!dr.g.sq,'직책 · 2편대 기본값 없음 (v9.9.7)'); ok(/노먼/.test(dr.txt)&&/청광묵/.test(dr.txt),'지금 동료 = 노먼 · 청광묵');
 // 도감 붓으로 놓은 노먼
 const rf = await p.evaluate(()=>{ const u=unitFromRef('C-007',0); return { hot: u.skill&&u.skill.hot, rank: u.rank, sq: u.sq, nv: u.nv&&u.nvG }; }); ok(rf.hot===4&&!rf.rank&&!rf.sq&&rf.nv==='A','도감에서 놓은 노먼도 설계대로 (직책 없음) '+JSON.stringify(rf));
 // 옛 저장: 옛 응급처치 · 꺼진 야시 · 빈 편대
 await p.evaluate(()=>{ const n=S.units.find(u=>u.ref==='C-007'), g=S.units.find(u=>u.ref==='C-004'); n.skill={ name:'응급처치', kit:true, pool:7, pct:0.4, cap:100, cd:2.2, wind:0.5, rec:0.3, rng:0.8, auto:0.5 }; n.nv=false; delete n.sq; delete n.rank; delete g.sq; g.nv=false; delete S.v7163k; save(); });
 await p.reload(); await p.waitForTimeout(1800);
 const mg = await p.evaluate(()=>{ const n=S.units.find(u=>u.ref==='C-007'), g=S.units.find(u=>u.ref==='C-004'); return { hot:n.skill.hot, nv:n.nv&&n.nvG, rank:n.rank, sq:n.sq, gsq:g.sq, gnv:g.nv&&g.nvG, toast:document.getElementById('toast').innerText }; });
 console.log('    옛 저장', JSON.stringify(mg)); ok(mg.hot===4&&mg.nv==='A'&&!mg.rank&&!mg.sq&&!mg.gsq&&mg.gnv==='B','옛 저장 한 번 설계대로 (직책 · 2편대 없음)'); ok(/설계대로 맞췄어요/.test(mg.toast),'알림 '+mg.toast);
 // 후각 설명 = 수치표
 const sm = await p.evaluate(()=>{ const a=traitDesc('높은후각'); rules.smellFar=11; const b2=traitDesc('높은후각'); rules.smellFar=14; return [a,b2]; });
 ok(/14칸/.test(sm[0])&&/2초마다/.test(sm[0])&&/11칸/.test(sm[1]),'[높은후각] 설명이 수치표를 따라감');
 // 편집 칸 응급처치
 const ed = await p.evaluate(()=>{ const n=S.units.find(u=>u.ref==='C-007'); selId=n.id; renderSel(); const box=document.getElementById('selBox'); const t=box.innerText.replace(/\s+/g,' '); return { per: !!document.getElementById('skPer'), lab: /횟수/.test(t), amt: (t.match(/처음 최대 체력의[^·]*?× \d+/)||[''])[0] }; });
 console.log('    편집 칸', JSON.stringify(ed)); ok(ed.lab&&!ed.per&&/20%/.test(ed.amt)&&/4 × 5/.test(ed.amt),'편집 칸 응급처치 = 횟수 · 회복량');
 // 설명 글
 const nt = await p.evaluate(()=>({ n: DESIGN_DEFAULTS.find(d=>d.key==='노먼').note, c: DESIGN_DEFAULTS.find(d=>d.key==='친칠라').note }));
 ok(!/50%/.test(nt.n)&&/죽기 직전/.test(nt.n),'노먼 설명 = 치료 방침'); ok(/관통력은 활과 같지만/.test(nt.c),'친칠라 설명 = 관통력 70');
 ok(errs.length===0,'오류 없음 '+JSON.stringify(errs));
 console.log(fails?`${fails} FAIL`:'ALL UI7163 OK'); await b.close(); })();
