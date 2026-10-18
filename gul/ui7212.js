// v7.21.2 UI 시험 — ui7212.js v1.0 (맵마다 정산 · 성장: 넘어가면 정산 창 (초상화 · 셈) · 많이 맞힌 이 → 사격 한 단계 · 많이 버틴 이 → 체력 +5 · 재능 0.7 ~ 1.3 · 다음 맵 단추 → 2S · 끝 화면에 성장 모음 · 모바일)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 for (const [nm,vp] of [['데스크톱',{viewport:{width:1280,height:860}}],['모바일',{viewport:{width:412,height:915},deviceScaleFactor:2.625,isMobile:true,hasTouch:true}]]){
  const p=await (await b.newContext(vp)).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept()); await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
  const r = await p.evaluate(()=>{ showTab('place'); renderFloors(); document.getElementById('campBtn').click(); document.getElementById('gAll').click(); document.getElementById('gGo').click();
    const tal = ['사격','회피','속력','괴력','체력'].map(k=>talent('C-002',k)); const rb=world.units.find(u=>u.name==='레베카'), ka=world.units.find(u=>u.name==='카리우스'), inj=world.units.find(u=>u.name==='인주');
    const s0=(S.units.find(u=>u.name==='레베카').traits||[]).find(t=>/^사격/.test(t))||''; rb.shots=30; rb.miss=2; ka.taken=400; inj.moved=900;
    for (const u of world.units.filter(u=>u.side===0)) leaveMap(world,u,'up'); checkEnd(world); mode='plan'; onOver();
    const bn=document.getElementById('banner'), txt=bn.innerText.replace(/\s+/g,' '), rows=bn.querySelectorAll('.cr').length, faces=bn.querySelectorAll('.cr i').length;
    const rbp=S.units.find(u=>u.name==='레베카'), kap=S.units.find(u=>u.name==='카리우스'), injp=S.units.find(u=>u.name==='인주');
    const lay={ over:[...bn.querySelectorAll('.cr,.btn')].filter(x=>{ const q=x.getBoundingClientRect(); return q.right>innerWidth+1||q.left<-1; }).length, sw: document.documentElement.scrollWidth, iw: innerWidth };
    const before={ s: S.camp.s, vis: !bn.hidden }; document.getElementById('campNext').click();
    return { tal: tal.map(x=>+x.toFixed(2)), s0, txt: txt.slice(0,260), rows, faces, rb: (rbp.traits||[]).filter(t=>/^사격/.test(t)), kahp: kap.ov&&kap.ov.hp, kagrow: kap.growHp, injs: (injp.traits||[]).filter(t=>/^속력/.test(t)), grown: rbp.grown, before, after: { s: S.camp.s, hidden: bn.hidden, camp: world.camp }, lay }; });
  console.log('    '+nm, JSON.stringify(r)); ok(r.tal.every(x=>x>=0.7&&x<=1.3),nm+': 재능 0.7 ~ 1.3'); ok(r.before.vis&&r.rows===6&&r.faces===6&&/1S 정산/.test(r.txt),nm+': 넘어가면 1S 정산 창 (여섯 · 초상화)');
  ok(r.rb.length===1&&r.rb[0]!==r.s0&&/✦/.test(r.txt),nm+': 많이 맞힌 레베카 사격 한 단계 ('+(r.s0||'없음')+' → '+r.rb[0]+')'); ok(r.kagrow===5&&r.kahp>700,nm+': 많이 버틴 카리우스 체력 +5'); ok(r.injs.length===1,nm+': 많이 걸은 인주 속력 '+r.injs[0]);
  ok(r.after.s===2&&r.after.hidden&&r.after.camp,nm+': 다음 맵 단추 → 2S'); ok(r.lay.over===0&&r.lay.sw<=r.lay.iw+1,nm+': 정산 창이 화면 안');
  ok(errs.length===0,nm+' 오류 없음 '+JSON.stringify(errs)); await p.close(); }
 console.log(fails?`${fails} FAIL`:'ALL UI7212 OK'); await b.close(); })();
