// v7.20 UI 시험 — ui720.js v1.3 (v1.3: 꺼내 듦 칸의 적은 멀리 + 움직이지 않게 (멀리 옮긴 적의 투창에 노먼이 쓰러지면 꺼내 듦을 못 보던 것 — 옛 빌드에서도 12판에 1 · 2판) · v1.2: 모바일은 배치 탭을 열고 봄 · v1.1: 넣기 선택은 다시 그린 뒤 새로 찾음 · 배치 소지품: 넣기 · 끼우기 · 벗기 · 넘겨주기 · 버리기 · 못 끼우는 까닭 (카리우스 갑옷 · 활 · 대검 + 방패) · 판 위: 탄이 떨어지면 가방 무기 · 상세 '들기' 명령 · 로그 · 옛 저장 검기사 투구 · 모바일 넓이)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); let fails=0; const ok=(c,s)=>{ console.log((c?'  OK  ':'  FAIL ')+s); if(!c) fails++; };
 const url='file://'+process.cwd()+'/build/wrapped.html';
 const setup = async p => { await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(1000);
   await p.evaluate(()=>{ S.units=S.units.filter(u=>u.side===1||u.hero); const h=S.units.find(u=>u.hero); for (const [k,dx] of [['노먼',1],['레베카',-1],['카리우스',2.2],['탕아',-2.2]]){ const u=fromDesign(designByKey(k),0); u.x=h.x+dx; u.y=h.y+0.5; S.units.push(u); } rebuildMap(); changed(); }); await p.waitForTimeout(300); };
 const pick = (k) => `S.units.find(u=>u.name==='${k}')`;
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await setup(p);
   const r1 = await p.evaluate(`(()=>{ const n=${pick('노먼')}; selId=n.id; renderSel(); const box=document.getElementById('selBox'); const inv=box.querySelector('.inv');
     const slots=[...box.querySelectorAll('[data-ieq]')].map(x=>x.innerText.replace(/\\s+/g,' ').trim());
     for (const v of ['w:검','s','m:일반']){ const sel=box.querySelector('[data-iadd]'); sel.value=v; sel.dispatchEvent(new Event('change',{bubbles:true})); }
     return { inv: !!inv, slots, bag: (n.bag||[]).map(x=>x.k+':'+(x.name||x.at)), head: box.querySelector('.ivh').innerText }; })()`);
   console.log('    노먼 소지품', JSON.stringify(r1)); ok(r1.inv&&r1.slots[0].includes('소총')&&r1.bag.join()==='weapon:검,shield:방패,ammo:일반','소지품 칸 · 가방에 넣기');
   const r2 = await p.evaluate(`(()=>{ const n=${pick('노먼')}; const box=document.getElementById('selBox'); const ch=()=>[...box.querySelectorAll('[data-ibag]')];
     ch()[0].click(); box.querySelector('[data-iact="equip"]').click(); const w1=n.weapon, bag1=n.bag.map(x=>x.name||x.at);
     const si=n.bag.findIndex(x=>x.k==='shield'); ch()[si].click(); box.querySelector('[data-iact="equip"]').click(); const sh=n.shield;
     box.querySelector('[data-ieq="weapon"]').click(); box.querySelector('[data-iact="unequip"]').click();
     return { w1, bag1, sh, w2: n.weapon, bag2: n.bag.map(x=>x.name||x.at) }; })()`);
   console.log('    끼우기 · 벗기', JSON.stringify(r2)); ok(r2.w1==='검'&&r2.bag1.includes('소총')&&r2.sh&&r2.w2==='맨손'&&r2.bag2.includes('검'),'검 끼움 (소총은 가방) · 방패 끼움 · 무기 벗기');
   const r3 = await p.evaluate(`(()=>{ const k=${pick('카리우스')}, t=${pick('탕아')}; const box=document.getElementById('selBox'); const add=v=>{ const s=box.querySelector('[data-iadd]'); s.value=v; s.dispatchEvent(new Event('change',{bubbles:true})); };
     selId=k.id; invPick=null; renderSel(); add('a:판금'); add('w:단궁'); add('h:투구'); const out={};
     const why=i=>{ [...box.querySelectorAll('[data-ibag]')][i].click(); const e=box.querySelector('[data-iact="equip"]'); return [e?e.disabled:null, (box.querySelector('.iva .why')||{}).innerText||'']; };
     out.armor=why(0); out.bow=why(1); out.helm=why(2); out.head=box.querySelector('.ivh').innerText;
     selId=t.id; invPick=null; renderSel(); add('s'); out.tsh=why(0); return out; })()`);
   console.log('    못 끼우는 까닭', JSON.stringify(r3)); ok(r3.armor[0]===true&&/갑옷은 없음/.test(r3.armor[1])&&r3.bow[0]===true&&/원거리/.test(r3.bow[1])&&r3.helm[0]===false,'카리우스: 갑옷 · 활은 못 끼움 (까닭) · 투구는 됨'); ok(/16칸/.test(r3.head)&&/무기/.test(r3.head),'카리우스 가방 16칸 · 무기 한도'); ok(r3.tsh[0]===true&&/두 손/.test(r3.tsh[1]),'탕아: 대검 (두 손) + 방패 못 끼움');
   const r4 = await p.evaluate(`(()=>{ const n=${pick('노먼')}, r=${pick('레베카')}; const box=document.getElementById('selBox'); selId=n.id; invPick=null; renderSel(); const i=n.bag.findIndex(x=>x.name==='검'); [...box.querySelectorAll('[data-ibag]')][i].click();
     const g=box.querySelector('[data-igive="'+r.id+'"]'); g.click(); const ok1=(r.bag||[]).some(x=>x.name==='검')&&!n.bag.some(x=>x.name==='검');
     [...box.querySelectorAll('[data-ibag]')][0].click(); const nm=n.bag[0].name||n.bag[0].at; box.querySelector('[data-iact="drop"]').click(); return { ok1, dropped: !n.bag.some(x=>(x.name||x.at)===nm)||n.bag.length===0, saved: JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>/state|cave|board|tac/i.test(k))||'null')) ? true : true }; })()`);
   ok(r4.ok1&&r4.dropped,'넘겨주기 (레베카 가방으로) · 버리기');
   // 판 위: 노먼은 탄 0 + 가방에 검 · 방패 → 꺼내 듦 / 레베카는 가방의 검 '들기'
   const r5 = await p.evaluate(`(()=>{ const n=${pick('노먼')}; n.weapon='소총'; n.ammo=0; n.shield=false; n.bag=[{k:'weapon',name:'검',label:'노먼의 검',dur:100},{k:'shield',name:'방패',label:'',dur:100}]; changed(); start(); const c=document.getElementById('contBtn'); if(c) c.click(); paused=true;
     for(const e of world.units) if(e.side===1){ e.x=Math.min(world.map.W-2,e.x+8); e.stunT=1e9; }
     const u=world.units.find(x=>x.name==='노먼'); for(let i=0;i<120&&!world.log.some(l=>l.k==='bagSwap'&&l.a===u.i);i++) stepWorld(world,1/30);
     return { w: u.weapon, sh: u.shield, line: logLines(world).filter(s=>/가방에서/.test(s)).slice(0,2) }; })()`);
   console.log('    탄이 떨어진 노먼', JSON.stringify(r5)); ok(r5.w==='검'&&r5.sh&&r5.line.length>=1,'탄이 없으면 가방의 검 + 방패를 꺼내 듦 (로그)');
   const r6 = await p.evaluate(`(()=>{ const r=world.units.find(x=>x.name==='레베카'); sel=new Set([r.i]); hover=null; hud(); renderDetail(); const btn=document.querySelector('#det [data-bswap]'); if(!btn) return { btn:false, det: (document.getElementById('det')||{}).innerText };
     btn.click(); for(let i=0;i<90&&r.weapon!=='검';i++) stepWorld(world,1/30); hud(); return { btn:true, w: r.weapon, line: logLines(world).filter(s=>/레베카 가방에서/.test(s)).length, lab: orderLabel(world,['swap',1]) }; })()`);
   console.log('    들기 명령', JSON.stringify(r6)); ok(r6.btn&&r6.w==='검'&&r6.line>=1,'상세 창 들기 → 레베카가 검을 꺼내 듦');
   const r7 = await p.evaluate(()=>{ const d=world.units.find(x=>x.name==='레베카'); const div=document.createElement('div'); div.innerHTML=unitDetailHtml(world,d); return (div.innerText.match(/소지품[^\n]*/)||[''])[0]; });
   console.log('    상세', r7); ok(/든 것/.test(r7),'상세에 소지품 줄');
   ok(errs.length===0,'오류 없음 (데스크톱) '+JSON.stringify(errs)); }
 { const ctx=await b.newContext({viewport:{width:412,height:915}, deviceScaleFactor:2.625, isMobile:true, hasTouch:true}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await setup(p);
   const m = await p.evaluate(`(()=>{ const n=${pick('노먼')}; showTab('place'); n.bag=[{k:'weapon',name:'장검',label:'검방패기사의 아주 긴 이름의 장검',dur:40},{k:'shield',name:'방패',dur:10},{k:'ammo',at:'일반',n:20}]; selId=n.id; changed(); const box=document.getElementById('selBox'); box.scrollIntoView(); const inv=box.querySelector('.inv'); if(!inv) return { inv:false };
     const els=[...inv.querySelectorAll('button,select')]; const over=els.filter(x=>{ const q=x.getBoundingClientRect(); return q.right>innerWidth+1||q.left<-1; }).length, small=els.filter(x=>x.getBoundingClientRect().height<30).length;
     return { inv:true, n: els.length, over, small, sw: document.documentElement.scrollWidth, iw: innerWidth }; })()`);
   console.log('    모바일 소지품', JSON.stringify(m)); ok(m.inv&&m.over===0&&m.small===0&&m.sw<=m.iw+1,'모바일: 화면 안 · 손가락 크기 · 가로 스크롤 없음');
   ok(errs.length===0,'오류 없음 (모바일) '+JSON.stringify(errs)); }
 { const p=await (await b.newContext({viewport:{width:1280,height:860}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url); await p.waitForTimeout(400); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(900);
   await p.evaluate(()=>{ const u=fromDesign(designByKey('검기사'),1); u.gear={몸:{name:'판금 갑옷',mat:'판금',tier:3},머리:{name:'쇠 기사 투구',mat:'투구',tier:2}}; u.x=20.5; u.y=4.5; S.units.push(u); delete S.v720k; save(); }); await p.reload(); await p.waitForTimeout(2600);
   const mg = await p.evaluate(()=>{ const L=S.units.filter(x=>x.ref==='C-052'); return { n: L.length, helm: L.filter(x=>x.gear&&x.gear['머리']).length, d: !!(designByKey('검기사').gear||{})['머리'] }; });
   console.log('    옛 저장 검기사', JSON.stringify(mg)); ok(mg.n>=1&&mg.helm===0&&!mg.d,'옛 저장 · 설계 모두 검기사 투구 없음'); ok(errs.length===0,'오류 없음 (옛 저장)'); }
 console.log(fails?`${fails} FAIL`:'ALL UI720 OK'); await b.close(); })();
