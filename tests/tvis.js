const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const errs = []; const ctx = await b.newContext({ viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, serviceWorkers:'block' });
  await ctx.route('https://commons.wikimedia.org/**', r => r.fulfill({ status:200, headers:{ 'content-type':'application/json', 'access-control-allow-origin':'*' }, body:JSON.stringify({ query:{ pages:{ 1:{ title:'File:(G마켓x위즈돔) DreaminG 비전강연.jpg', imageinfo:[{ thumburl:'https://x/a.jpg', url:'https://x/a.jpg', descriptionurl:'https://x', extmetadata:{} }] } } } }) }));
  await ctx.route('https://*.wikipedia.org/**', r => r.fulfill({ status:200, headers:{ 'content-type':'application/json', 'access-control-allow-origin':'*' }, body:'{}' }));
  await ctx.route('https://s0.wp.com/**', r => r.fulfill({ status:200, headers:{ 'content-type':'image/png' }, body:Buffer.alloc(10) }));
  await ctx.route('https://cdn.test/**', r => r.fulfill({ status:200, headers:{ 'content-type':'image/svg+xml' }, body:'<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="100" cy="100" r="80" fill="#7fd1b0"/><text x="60" y="110">candy</text></svg>' }));
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/sehee/#office'); await p.waitForTimeout(2500);
  for (const withOg of [false, true]){
    await p.evaluate(async withOg => {
      if (withOg) SEHEE.og = async u => ({ img:'https://cdn.test/' + encodeURIComponent(u) + '.svg', title:'무설탕 비타민 캔디 민트 800g', site:'G마켓' });
      else SEHEE.og = async () => null;
      const at = Date.now();
      O.log.push({ who:'u', text:'무설탕 사탕 찾아줘', at:at - 1000 }, { who:'s', text:'무설탕 비타민 캔디를 찾았어요.', face:3, at, src:[{ u:'https://item.gmarket.co.kr/Item?goodscode=1', t:'G마켓 - MOLANWANG 무설탕 비타민C 캔디 800g X 2개' }, { u:'https://www.11st.co.kr/products/2', t:'[11번가] 무란왕 무설탕 12가지맛 비타민C 민트 미니 캔디 800g' }, { u:'https://lifestyle.example/3', t:'금연 사탕 가성비 추천 무설탕 캔디 BEST 5 (2026) : 라이프' }] });
      renderLog(); bonusEmit('turnEnd');
    }, withOg);
    await p.waitForTimeout(2500);
    const vis = await p.evaluate(async () => { const v = await kvGet('b_vis'); const last = v && Object.entries(v).sort((a, b) => b[0] - a[0])[0]; return last ? last[1].map(g => g.kind + ':' + g.title + ':' + g.items.length + ':' + g.items.map(i => i.title.slice(0, 18)).join('|')).join(' / ') : 'none'; });
    console.log(withOg ? 'with og →' : 'no og   →', vis);
    await p.screenshot({ path:`vis-${withOg ? 'og' : 'noog'}.png` });
  }
  console.log('errors', errs); await b.close(); })();
