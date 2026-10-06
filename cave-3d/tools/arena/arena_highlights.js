// hl.js v1.3 — (v1.3: requestAnimationFrame 을 판 시간에 맞춰 돌림 — 잔상이 사라지게) v1.2 — (v1.2: 지난 판의 몸 · 소환물을 화면에서 치움) v1.1 — (v1.1: 화면 없이 빨리 돌리다가 한쪽 체력이 35% 아래 (또는 sc.from 초) 가 되면 그때부터 찍음 — 판은 처음부터 끝까지 실제 그대로) v1.0 — 투기장 명경기 다시 찍기: 대진을 여러 번 돌려 조건에 맞는 판의 장면 (0.2초마다) 을 jpg 로 남김
const { chromium } = require('playwright'); const fs = require('fs');
const SC = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 960, height: 600 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/three.min.js', r => r.fulfill({ path: '/tmp/package/build/three.min.js', contentType: 'text/javascript' })); await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p.goto('http://localhost:8767/cave-3d/index.html#drill');
  await p.waitForFunction(() => !document.getElementById('boot') && G.mode === 'drill' && G.player, null, { timeout: 120000 });
  await p.evaluate(() => {
    window.__raf = []; window.requestAnimationFrame = fn => { if (fn !== loop) __raf.push(fn); return 0; }; const R = G.renderer.render.bind(G.renderer); window.__R = R; G.renderer.render = () => {};
    window.__now = performance.now() + 1000; window.__q = []; const st = window.setTimeout; window.setTimeout = (fn, ms, ...a) => { __q.push({ t: G.t + (ms || 0) / 1000, fn, a }); return 0; };
    G.cmd = 'free'; DRILL.freeze = false; ENG.on = false; SQ.on = false; if (typeof STL !== 'undefined') STL.lethal = false;
    for (const el of document.body.children) if (el.id !== 'stage') el.style.visibility = 'hidden';
    const ui = document.getElementById('ui'); if (ui) { let e = ui; while (e && e !== document.body){ e.style.visibility = 'visible'; e = e.parentElement; } }
    for (const id of ['party', 'help', 'hint', 'cmdbox', 'drillhud']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; }
    window.__step = n => { for (let i = 0; i < n; i++){ __now += 50; loop(__now); const rf = __raf; __raf = []; for (const f of rf) try { f(__now); } catch (e) {} const due = __q.filter(x => x.t <= G.t); if (due.length){ __q = __q.filter(x => x.t > G.t); for (const x of due) try { x.fn(...x.a); } catch (e) {} } } };
    { const _sp = spawn; spawn = function(...a){ const u = _sp(...a); if (u && window.__made) __made.push(u); return u; }; }
    window.__setup = (A, B) => {
      drillClear(); for (const u of [...G.units]) if (u !== G.player) removeUnit(u); __q = [];
      for (const u of (window.__made || [])){ G.scene.remove(u.group); if (u.bar) u.bar.remove(); if (u.tag) u.tag.remove(); } window.__made = [];   // 지난 판의 몸 · 이름표를 화면에서도 치움
      const pl = G.player; pl.x = 6; pl.z = 44; pl.max = pl.hp = 1e9; pl.inv = 1e9; pl.group.visible = false;
      const mk = (list, side, x0) => list.map((k, i) => { const u = spawn(k, x0, 20 + (i - (list.length - 1) / 2) * 1.6, side); u.face = side === 'ally' ? 1 : -1; if (side === 'enemy'){ u.alert = true; u.seen = G.t; u.band = 'arena'; u.home = { x: x0, z: 20 }; } __made.push(u); return u; });
      window.__A = mk(A, 'ally', 37.5); window.__B = mk(B, 'enemy', 43);
      for (const u of [...__A, ...__B]){ u.__m0 = u.max; }
      if (!window.__cleared){ window.__cleared = true; const ug = new Set(G.units.map(u => u.group)); const bx = new THREE.Box3(), sz = new THREE.Vector3(), c = new THREE.Vector3();
        for (const o of [...G.scene.children]){ if (ug.has(o) || o.isLight || o.isCamera) continue; bx.setFromObject(o); if (bx.isEmpty()) continue; bx.getSize(sz); bx.getCenter(c);
          if (sz.x > 25 || sz.z > 25) continue; if (Math.hypot(c.x - 40, c.z - 20) < 22 && sz.y > 0.25) o.visible = false; } }
    };
    window.__tick = (draw = true) => { G.paused = false; if (G.waitInput) G.waitInput = null; G.lock = false; G.hitstop = 0; G.slow = 1; __step(4); for (const u of __B) { u.alert = true; u.seen = G.t; }
      const L = [...__A, ...__B].filter(u => !u.dead && !u.downed); const cx = L.length ? L.reduce((s, u) => s + u.x, 0) / L.length : 40, cz = L.length ? L.reduce((s, u) => s + u.z, 0) / L.length : 20;
      const spread = L.length ? Math.max(...L.map(u => Math.hypot(u.x - cx, u.z - cz))) : 2; camFocus(cx, cz, 5, 3.2 + spread * 0.9, 5.2 + spread * 1.45, 0.6, false);
      if (draw) __R(G.scene, camera);
      const out = s => s.every(u => u.dead || u.downed);
      return { t: G.t, aOut: out(__A), bOut: out(__B), a: __A.map(u => Math.max(0, u.hp) / u.__m0), b: __B.map(u => Math.max(0, u.hp) / u.__m0), form: [...__A, ...__B].some(u => u.h2form) };
    };
  });
  const result = {};
  for (const sc of SC){
    let best = null;
    for (let tr = 0; tr < (sc.tries || 6); tr++){
      await p.evaluate(([A, B]) => __setup(A, B), [sc.A, sc.B]); const t0 = await p.evaluate(() => G.t);
      const frames = []; let st, formSeen = false, ff = 0;
      for (; ff < (sc.long || 240) * 5; ff++){   // 빨리 감기 (그림 없이)
        st = await p.evaluate(() => __tick(false)); formSeen = formSeen || st.form;
        if (st.aOut || st.bOut) break;
        const lo = Math.min(Math.min(...st.a), Math.min(...st.b));
        if (lo < (sc.th || 0.35) || (sc.from && st.t - t0 > sc.from)) break;
      }
      const tRec = st.t - t0;
      for (let f = 0; f < (sc.cap || 30) * 5 && !(st.aOut || st.bOut); f++){
        st = await p.evaluate(() => __tick()); formSeen = formSeen || st.form;
        frames.push(await p.screenshot({ type: 'jpeg', quality: 80 }));
        if (st.aOut || st.bOut){ for (let k = 0; k < 8; k++){ await p.evaluate(() => __tick()); frames.push(await p.screenshot({ type: 'jpeg', quality: 80 })); } break; }
      }
      const win = st.bOut && !st.aOut ? 'A' : st.aOut && !st.bOut ? 'B' : 'draw', whp = win === 'A' ? Math.max(...st.a) : win === 'B' ? Math.max(...st.b) : 1;
      const ok = eval(sc.want) && frames.length > 10;   // 조건 (win · whp · formSeen · st)
      console.log(sc.id, 'try', tr, 'rec@', tRec.toFixed(1), win, whp.toFixed(2), (st.t - t0).toFixed(1), formSeen, ok ? 'KEEP' : '');
      const score = (ok ? 10 : 0) + (win !== 'draw' ? 2 : 0) + (1 - whp);
      if (!best || score > best.score) best = { score, frames, win, whp, t: st.t - t0, tRec, formSeen, ok };
      if (ok) break;
    }
    fs.mkdirSync(`f/${sc.id}`, { recursive: true }); best.frames.forEach((fr, i) => fs.writeFileSync(`f/${sc.id}/${String(i).padStart(3, '0')}.jpg`, fr));
    result[sc.id] = { win: best.win, whp: best.whp, t: best.t, tRec: best.tRec, form: best.formSeen, ok: best.ok, n: best.frames.length };
    fs.writeFileSync('result.json', JSON.stringify(result, null, 1));
  }
  console.log('errs', errs.slice(0, 5)); await b.close();
})();
