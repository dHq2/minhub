const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(400);
  // 어디서 인주가 총을 드는지: 도감 붓 · 예제들 · 옛 저장
  console.log(await p.evaluate(()=>{ const out={};
    out.fromRef = (()=>{ const u=unitFromRef('C-001',0,{hero:true}); return [u.weapon,u.cls,u.role||'-'].join('/'); })();
    out.exampleBase = (()=>{ const s=exampleBase(); const u=s.units.find(x=>x.ref==='C-001'); return [u.weapon,u.cls,u.role||'-'].join('/'); })();
    out.exampleShield = (()=>{ const s=exampleShield(); const u=s.units.find(x=>x.ref==='C-001'); return [u.weapon,u.cls,u.role||'-'].join('/'); })();
    out.exampleDraft = (()=>{ const s=exampleDraft(); const u=s.units.find(x=>x.ref==='C-001'); return [u.weapon,u.cls,u.role||'-'].join('/'); })();
    out.design = (()=>{ const d=designByKey('인주'); return d ? [d.weapon,d.cls,d.role].join('/') : 'none'; })();
    out.roster = RBY['C-001'].slice(0,12).filter((x,i)=>[1,4,11].includes(i)).join('/');
    return JSON.stringify(out,null,1); }));
  await b.close(); })();
