// v7.21.1 UI 시험 — ui7211.js v1.1 (v1.1: v8.7.2 처음 동료 일곱 (뽑기 셋 — 셋 다 뒤집어야 1S) · 뽑기 연출: 캠페인 시작 → 뽑기 창 · 확정 셋 앞면 · 랜덤 둘 뒷면 · 1S 로는 둘 다 뒤집어야 · 뒤집으면 이름 · 1S 로 → 판 · 모바일 넓이)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const [nm,vp] of [['데스크톱',{viewport:{width:1280,height:860}}],['모바일',{viewport:{width:412,height:915},deviceScaleFactor:2.625,isMobile:true,hasTouch:true}]]){
  const p=await (await b.newContext(vp)).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
  const r1 = await p.evaluate(()=>{ showTab('place'); renderFloors(); document.getElementById('campBtn').click(); const g=document.getElementById('gacha');
    const fix=[...g.querySelectorAll('.gcard.fix')].map(c=>c.innerText.replace(/\s+/g,' ').trim()), rnd=[...g.querySelectorAll('.gcards.rnd .gcard')];
    return { vis: !g.hidden, fix, nr: rnd.length, flipped: rnd.filter(c=>c.classList.contains('flip')).length, go: document.getElementById('gGo').disabled, world: !!(window.world&&world.camp) }; });
  console.log('    '+nm+' 뽑기 창', JSON.stringify(r1)); ok(r1.vis&&r1.fix.length===3&&['카리우스','레베카','청광묵'].every(k=>r1.fix.some(x=>x.includes(k)))&&r1.nr===3&&r1.flipped===0&&r1.go&&!r1.world,nm+': 확정 셋 앞면 · 랜덤 둘 뒷면 · 아직 1S 로 못 감');
  await p.waitForTimeout(200); const cards=await p.$$('#gacha .gcards.rnd .gcard'); await cards[0].click(); await p.waitForTimeout(150);
  const r2 = await p.evaluate(()=>({ go: document.getElementById('gGo').disabled, f: document.querySelectorAll('#gacha .gcards.rnd .gcard.flip').length }));
  await cards[1].click(); await p.waitForTimeout(150); const r2b = await p.evaluate(()=>document.getElementById('gGo').disabled); await cards[2].click(); await p.waitForTimeout(700);
  const lay = await p.evaluate(()=>{ const g=document.getElementById('gacha'), bs=[...g.querySelectorAll('.gcard,.btn')]; return { over: bs.filter(x=>{ const r=x.getBoundingClientRect(); return r.right>innerWidth+1||r.left<-1; }).length, sw: document.documentElement.scrollWidth, iw: innerWidth, names: [...g.querySelectorAll('.gcards.rnd .gcard .f b')].map(x=>x.textContent) }; });
  const r3 = await p.evaluate(()=>{ const go=document.getElementById('gGo'), d=go.disabled; go.click(); return { d, hidden: document.getElementById('gacha').hidden, s: S.camp.s, camp: !!(world&&world.camp), party: S.units.filter(u=>u.side===0).map(u=>u.name) }; });
  console.log('    '+nm+' 뒤집기', JSON.stringify({r2, lay, r3})); ok(r2.f===1&&r2.go&&r2b,nm+': 하나 · 둘 뒤집으면 아직'); ok(!r3.d&&r3.hidden&&r3.s===1&&r3.camp&&r3.party.length===7&&lay.names.every(n=>r3.party.includes(n)),nm+': 셋 다 뒤집으면 1S 로 · 뽑힌 이가 파티에'); ok(lay.over===0&&lay.sw<=lay.iw+1,nm+': 카드가 화면 안');
  ok(errs.length===0,nm+' 오류 없음 '+JSON.stringify(errs)); await p.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7211 OK'); await b.close(); })();
