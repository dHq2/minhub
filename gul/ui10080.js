// v9.14.2 UI 시험 — ui10080.js v1.0 (v1.0: 판 위 아군 지휘관 깃발 = 빨강 (예전 금색) — 지휘관 하나에만 · 임명하면 깃발이 그 사람에게 (지휘 전달망 우두머리) · 아군 칸 🚩 지휘도 같은 사람 · 적 지휘관 깃발은 보라)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1200);
 const a = await p.evaluate(()=>{ S.draft.done=true; start(); paused=true; const W=world, o={};
  const cols=[]; const pf=CanvasRenderingContext2D.prototype.fill; CanvasRenderingContext2D.prototype.fill=function(...q){ cols.push(this.fillStyle); return pf.apply(this,q); };
  const C=cmdBoss(W,0); o.c1=C&&C.name; cols.length=0; draw(); o.red1=cols.filter(c=>c==='#ff2f2f').length; o.gold1=cols.filter(c=>c==='#ffd56a').length;
  const L=W.units.filter(u=>u.side===0&&u.alive&&u!==C&&!u.summon); appointCmdr(W,L[L.length-1]); const C2=cmdBoss(W,0); o.c2=C2&&C2.name; o.hat=L[L.length-1].name; cols.length=0; draw(); o.red2=cols.filter(c=>c==='#ff2f2f').length;
  CanvasRenderingContext2D.prototype.fill=pf; hud(); renderSel && renderSel(); const t=document.getElementById('app').textContent; o.card=/🚩/.test(t);
  return o; });
 console.log('    ', JSON.stringify(a));
 ok(a.c1&&a.red1===1&&a.gold1===0,'아군 지휘관 ('+a.c1+') 깃발이 빨강 (금색 없음)');
 ok(a.c2===a.hat&&a.red2===1,'임명한 이 ('+a.hat+') 가 지휘 전달망의 우두머리 · 깃발도 그 사람에게');
 ok(!errs.length,'페이지 오류 없음 '+JSON.stringify(errs.slice(0,2)));
 await b.close(); console.log(fails?'FAIL '+fails:'ALL OK'); })();
