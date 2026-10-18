// v5.10.0 인주 태그 · 방패 줍기 (데스크톱 클릭 · 모바일 부채 줍기 · E) 끝까지
const { chromium, devices } = require('playwright');
async function setup(p){ await p.goto('file://'+process.cwd()+'/build/wrapped.html'); await p.waitForTimeout(600); await p.evaluate(()=>start()); await p.waitForTimeout(200);
  return p.evaluate(()=>{ const I = world.units.find(u => u.ref === 'C-001'), E = world.units.find(u => u.name === '검방패기사'); E.x = I.x + 1.6; E.y = I.y; E.face = Math.PI; E.hp = 0; E.alive = false; dropOnDeath(world, E);
    return world.items.map(x => `${x.k}:${x.name}@${x.x.toFixed(2)},${x.y.toFixed(2)}`).join(' · '); }); }
const finish = p => p.evaluate(()=>{ const I = world.units.find(u => u.ref === 'C-001'); for (let k = 0; k < 3 && !I.shield; k++) runTurn(world); return `인주 ${I.weapon}${I.shield ? '+방패' : ''} · 땅: ${world.items.map(x => x.name).join(',')}`; });
(async () => { const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const errs=[];
  // 데스크톱
  let p = await b.newPage({ viewport: { width: 1400, height: 900 } }); p.on('pageerror',e=>errs.push(String(e)));
  console.log('drops', await setup(p));
  console.log('tag', await p.evaluate(()=>{ const I = world.units.find(u => u.ref === 'C-001'); hoverPid = I.pid; renderDetail(); const t = document.getElementById('det').innerText.split('\n').filter(l => /무구로 막기|방어 자세|\[방패\]/.test(l)); hoverPid = null; return t.join(' / ').slice(0, 300); }));
  // 방패와 검 사이 (가운데) 를 눌러도 방패
  console.log('mid pick', await p.evaluate(()=>{ const I = world.units.find(u => u.ref === 'C-001'), sh = world.items.find(x => x.k === 'shield'), sw = world.items.find(x => x.k === 'weapon'); sel = new Set([I.i]); const it = pickAt(world, [I], (sh.x + sw.x) / 2, (sh.y + sw.y) / 2, 0.9); const it2 = nearItem(world, [I]); givePick(it); return `탭 → ${it && it.name} · 가까운 줍기 (E) → ${it2 && it2.name} · 알림 ${document.getElementById('toast').textContent}`; }));
  console.log('desktop', await finish(p));
  // 칼만 누르면 바꿔 듦 알림
  console.log('sword', await p.evaluate(()=>{ const I = world.units.find(u => u.ref === 'C-001'), sw = world.items.find(x => x.k === 'weapon'); if (!sw) return 'no sword'; sel = new Set([I.i]); givePick(sw); return document.getElementById('toast').textContent; }));
  await p.close();
  // 모바일: 부채 → 줍기 → 방패 탭
  const ctx = await b.newContext({ ...devices['Galaxy S9+'], viewport: { width: 412, height: 915 } }); p = await ctx.newPage(); p.on('pageerror',e=>errs.push(String(e)));
  console.log('m drops', await setup(p));
  console.log('m pick', await p.evaluate(()=>{ const I = world.units.find(u => u.ref === 'C-001'), sh = world.items.find(x => x.k === 'shield'); sel = new Set([I.i]); armed = { k: 'pick', cas: [I.i] }; armedTap({ x: sh.x + 0.2, y: sh.y }); return document.getElementById('toast').textContent + ' · order ' + JSON.stringify(I.order); }));
  console.log('mobile', await finish(p));
  console.log('errors', errs); await b.close(); })();
