// v7.16.3 UI 시험 — ui7163.js v1 (동료 뽑기 = 설계대로 (야시 · 응급처치 · 편대) · '지금 동료' = 실제 배치 · 옛 저장 한 번 고침 · 후각 설명 = 수치표 · 응급처치 편집 칸 · 설명 글)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+process.cwd()+'/build/wrapped.html';
 await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
 // '지금 동료' = 실제 배치
 const d0 = await p.evaluate(()=>{ renderDraft(); return document.getElementById('draftBox').innerText.replace(/\s+/g,' '); });
 ok(/청광묵/.test(d0)&&/친칠라/.test(d0), "뽑기 칸 '지금 동료' 에 실제 배치 (청광묵 · 친칠라 포함)");
 // 동료 뽑기로 노먼 · 청광묵
 const dr = await p.evaluate(()=>{ S.draft.picks=['C-007','C-004']; S.draft.done=false; renderDraft(); document.getElementById('draftOk').click();
   const n=S.units.find(u=>u.ref==='C-007'), g=S.units.find(u=>u.ref==='C-004'), h=S.units.find(u=>u.hero); const k=n.skill||{};
   return { n: { nv: n.nv&&n.nvG, hot: k.hot, cap: k.cap, pct: k.pct, rank: n.rank, sq: n.sq }, g: { nv: g.nv&&g.nvG, sq: g.sq, w: g.weapon }, h: h&&(h.nv&&h.nvG), txt: document.getElementById('draftBox').innerText.replace(/\s+/g,' ').slice(0,80) }; });
 console.log('    뽑기', JSON.stringify(dr));
 ok(dr.n.nv==='A'&&dr.g.nv==='B'&&dr.h==='C','뽑기로 들어와도 야시 그대로 (노먼 A · 청광묵 B · 인주 C)'); ok(dr.n.hot===4&&dr.n.cap===30&&dr.n.pct===0.2,'노먼 응급처치 = 설계 (20% · 10~30 · 돌봄 4)'); ok(dr.n.rank==='부대장'&&dr.n.sq==='B'&&dr.g.sq==='B','노먼 2편대장 · 청광묵 2편대'); ok(/노먼/.test(dr.txt)&&/청광묵/.test(dr.txt),'지금 동료 = 노먼 · 청광묵');
 // 도감 붓으로 놓은 노먼
 const rf = await p.evaluate(()=>{ const u=unitFromRef('C-007',0); return { hot: u.skill&&u.skill.hot, rank: u.rank, sq: u.sq, nv: u.nv&&u.nvG }; }); ok(rf.hot===4&&rf.rank==='부대장'&&rf.sq==='B'&&rf.nv==='A','도감에서 놓은 노먼도 설계대로 '+JSON.stringify(rf));
 // 옛 저장: 옛 응급처치 · 꺼진 야시 · 빈 편대
 await p.evaluate(()=>{ const n=S.units.find(u=>u.ref==='C-007'), g=S.units.find(u=>u.ref==='C-004'); n.skill={ name:'응급처치', kit:true, pool:7, pct:0.4, cap:100, cd:2.2, wind:0.5, rec:0.3, rng:0.8, auto:0.5 }; n.nv=false; delete n.sq; delete n.rank; delete g.sq; g.nv=false; delete S.v7163k; save(); });
 await p.reload(); await p.waitForTimeout(1800);
 const mg = await p.evaluate(()=>{ const n=S.units.find(u=>u.ref==='C-007'), g=S.units.find(u=>u.ref==='C-004'); return { hot:n.skill.hot, nv:n.nv&&n.nvG, rank:n.rank, sq:n.sq, gsq:g.sq, gnv:g.nv&&g.nvG, toast:document.getElementById('toast').innerText }; });
 console.log('    옛 저장', JSON.stringify(mg)); ok(mg.hot===4&&mg.nv==='A'&&mg.rank==='부대장'&&mg.sq==='B'&&mg.gsq==='B'&&mg.gnv==='B','옛 저장 한 번 설계대로'); ok(/설계대로 맞췄어요/.test(mg.toast),'알림 '+mg.toast);
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
