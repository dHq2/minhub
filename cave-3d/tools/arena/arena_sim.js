// 투기장 시뮬레이터 v1.0 — 훈련장 (#drill)을 열고 그리기를 끈 채 loop()를 직접 돌려 1:1 대결
const { chromium } = require('playwright'); const fs = require('fs');
const OUT = process.argv[2], PAIRS = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')), CAP = +(process.argv[4] || 45);
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 640, height: 360 } })).newPage(); const errs = new Set();
  p.on('pageerror', e => errs.add(e.message));
  await p.route('**/three.min.js', r => r.fulfill({ path: '/tmp/package/build/three.min.js', contentType: 'text/javascript' })); await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p.addInitScript(() => {
    try { localStorage.clear(); } catch (e) {}
    // 게임 시간 setTimeout: 기술의 지연이 실제 시간이 아니라 시뮬 시간으로
    window.__q = []; const realST = window.setTimeout;
    window.__arena = false;
    window.setTimeout = function(fn, ms, ...a){ if (!window.__arena || typeof fn !== 'function') return realST(fn, ms, ...a); window.__q.push({ t: (window.G ? G.t : 0) + (ms || 0) / 1000, fn, a }); return 0; };
  });
  await p.goto('http://localhost:8767/cave-3d/index.html#drill');
  await p.waitForFunction(() => !document.getElementById('boot') && G.mode === 'drill' && G.player, null, { timeout: 120000 });
  await p.evaluate(() => {
    window.requestAnimationFrame = () => 0; G.renderer.render = () => {};
    window.__arena = true; window.__now = performance.now() + 1000;
    G.cmd = 'free'; DRILL.freeze = false; ENG.on = false; SQ.on = false; if (typeof STL !== 'undefined') STL.lethal = false;
    window.__step = n => { for (let i = 0; i < n; i++){ __now += 50; loop(__now); const q = __q; if (q.length){ const due = q.filter(x => x.t <= G.t); if (due.length){ __q = q.filter(x => x.t > G.t); for (const x of due) try { x.fn(...x.a); } catch (e) { console.error(e.message); } } } } };
    window.__fight = (a, b, cap) => {
      drillClear(); for (const u of [...G.units]) if (u !== G.player) removeUnit(u); __q = [];
      for (const k in FORT.pieces) {} ; const pl = G.player; pl.x = 6; pl.z = 44; pl.hp = pl.max = 1e9; pl.inv = 1e9;
      const A = spawn('h2_' + a, 38, 20, 'ally'), B = spawn('h2e_' + b, 42.5, 20, 'enemy');
      A.face = 1; B.face = -1; B.alert = true; B.seen = G.t; B.band = 'arena'; B.home = { x: 42.5, z: 20 };
      window.__dmg = { a: 0, b: 0, ac: 0, bc: 0 }; if (!window.__hw){ window.__hw = true; const _h = hurt; hurt = function(att, tgt, base, o){ const r = _h(att, tgt, base, o); if (att && att.__side) __dmg[att.__side] += r || 0; return r; }; const _c = h2Cast; h2Cast = function(u, s, t){ if (u.__side) __dmg[u.__side + 'c']++; return _c(u, s, t); }; }
      A.__side = 'a'; B.__side = 'b';
      const t0 = G.t, A0 = A.max, B0 = B.max; let dmgA = 0, dmgB = 0, casts = { a: 0, b: 0 };
      const hA = A.hp, hB = B.hp;
      let guard = 0;
      while (G.t - t0 < cap){
        if (++guard > cap * 40) return { dmg: { ...__dmg }, w: 'stuck', t: G.t - t0, a: A.hp / A0, b: B.hp / B0, ko: false, why: 'paused ' + G.paused + ' lock ' + G.lock + ' wait ' + !!G.waitInput };
        G.paused = false; if (G.waitInput) G.waitInput = null; G.lock = false; G.hitstop = 0; G.slow = 1;
        __step(10); B.alert = true; B.seen = G.t; if (pl.downed) pl.downed = false;
        const aOut = A.dead || A.downed, bOut = B.dead || B.downed;
        if (aOut || bOut) return { dmg: { ...__dmg }, w: aOut && bOut ? 'draw' : aOut ? b : a, t: G.t - t0, ka: !bOut ? A.hp / A0 : A.hp / A0, a: Math.max(0, A.hp / A0), b: Math.max(0, B.hp / B0), ko: true };
      }
      const ra = Math.max(0, A.hp / A0), rb = Math.max(0, B.hp / B0);
      return { dmg: { ...__dmg }, w: Math.abs(ra - rb) < 0.03 ? 'draw' : ra > rb ? a : b, t: cap, a: ra, b: rb, ko: false };
    };
  });
  let res = []; try { res = JSON.parse(fs.readFileSync(OUT, 'utf8')).res.filter(r => !r.err && r.w !== 'stuck'); } catch (e) {} const done = new Set(res.map(r => r.A + '|' + r.B)); const T0 = Date.now();
  for (const [a, b] of PAIRS){
    if (done.has(a + '|' + b)) continue;
    try { const r = await p.evaluate(([a, b, c]) => __fight(a, b, c), [a, b, CAP]); res.push({ A: a, B: b, ...r }); }
    catch (e) { res.push({ A: a, B: b, err: e.message.slice(0, 120) }); }
    if (res.length % 10 === 0) fs.writeFileSync(OUT, JSON.stringify({ res, errs: [...errs], ms: Date.now() - T0 }));
  }
  fs.writeFileSync(OUT, JSON.stringify({ res, errs: [...errs], ms: Date.now() - T0 }));
  await b.close();
})();
