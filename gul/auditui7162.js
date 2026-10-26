// v7.16.2 점검 — auditui7162.js v1 (PC 명령 칸 vs 모바일 조작판 · 단축키 표 · 아군 카드 vs 상세 칸)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const url='file://'+process.cwd()+'/build/wrapped.html';
 const get = async (mob) => { const p=await (await b.newContext(mob?{viewport:{width:412,height:883},isMobile:true,hasTouch:true,deviceScaleFactor:2.6}:{viewport:{width:1280,height:860}})).newPage();
  await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
  const r = await p.evaluate((mob)=>{ start(); const out={}; for (const u of world.units.filter(x=>x.side===0)){ sel=new Set([u.i]); if (typeof dockHtml!=='undefined') dockHtml[1]=''; hud();
      const ords=[...document.querySelectorAll(mob?'#dActs [data-dk]':'#orders [data-ord]')].map(e=>(mob?e.dataset.dk:e.dataset.ord)).filter(Boolean);
      const slots=[...document.querySelectorAll('[data-slot]')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,22));
      out[u.name]={ ords:[...new Set(ords)].sort(), slots }; } return out; }, mob);
  await p.close(); return r; };
 const pc = await get(false), mb = await get(true);
 for (const n of Object.keys(pc)){ const a=new Set(pc[n].ords), m=new Set(mb[n].ords); const onlyPc=[...a].filter(x=>!m.has(x)), onlyMb=[...m].filter(x=>!a.has(x));
   console.log(`== ${n}\n   PC만: ${onlyPc.join(' ')}\n   모바일만: ${onlyMb.join(' ')}\n   PC 기술 칸: ${pc[n].slots.join(' | ')}\n   모바일 기술 칸: ${mb[n].slots.join(' | ')}`); }
 await b.close(); })();
