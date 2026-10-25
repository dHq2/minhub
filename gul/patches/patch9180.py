# v9.8.2 엔진 — patch9180.py v1.0 (v1.0: ① 암계 역장 새로 — 방패 앞 (몸 + 0.9칸) 에 바라보는 쪽을 가로지르는 직사각형 장벽 (길이 5 · 두께 0.8 · 6초) · 내구 160: 막은 탄 · 막힌 근접 공격 · 밀어붙이는 몸만큼 깎임 · 0 이면 깨짐 · 상대 몸 · 직사 탄을 막음 (곡사는 넘어감) ② 화살비 (지역사격) 새로 — 화살 하나가 하늘로 · 붉은 원 예고 1초 · 그 뒤 1초 동안 10발이 원 안 무작위 자리에 1 ~ 2발씩 떨어짐 (곡사와 같은 판정) · 원을 본 몸은 피해 달아남 (양쪽 편) — 활의 지역사격 · 어둠의 화살비 (암계 궁수) 모두)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9170.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- ① 역장 ----------
rep("bfield: { ahead: 3, len: 6, lenV: 2, t: 3, wind: 0.5, rec: 0.4, cd: 12 }", "bfield: { ahead: 0.9, len: 5, th: 0.8, hp: 160, t: 6, wind: 0.5, rec: 0.4, cd: 14 }")
rep("""  if (k === 'bfield'){ const c = Math.cos(A.ang), s = Math.sin(A.ang); let d = S.ahead || 3; while (d > 1 && solid(W.map, u.x + c * d, u.y + s * d)) d -= 0.5;
    const len = (S.len || 6) + (W.rand() - 0.5) * (S.lenV || 2);
    sfAdd(W, { k: 'wall', hard: true, by: u.i, side: u.side, x: u.x + c * d, y: u.y + s * d, ux: -s, uy: c, nx: c, ny: s, h: len / 2, push: 0, t0: W.t, until: W.t + (S.t || 3), pushed: {}, blkT: -9 });""",
"""  if (k === 'bfield'){ const c = Math.cos(A.ang), s = Math.sin(A.ang); let d = u.r + (S.ahead != null ? S.ahead : 0.9); while (d > u.r + 0.3 && solid(W.map, u.x + c * d, u.y + s * d)) d -= 0.2;   /* v9.8.2 방패 바로 앞 */
    const len = S.len || 5, hp = S.hp || 160;
    sfAdd(W, { k: 'wall', hard: true, by: u.i, side: u.side, x: u.x + c * d, y: u.y + s * d, ux: -s, uy: c, nx: c, ny: s, h: len / 2, th: S.th || 0.8, hp, hpMax: hp, ht: {}, push: 0, t0: W.t, until: W.t + (S.t || 6), pushed: {}, blkT: -9 });""")
rep("""function wallHold(W, F){""", """// v9.8.2 역장 내구: 깎이면 깨짐
function wallHurt(W, F, n, why){ if (!F || F.hpMax == null || W.t >= F.until) return; F.hp -= n; if (F.hp <= 0){ F.hp = 0; F.until = W.t; L(W, { k: 'bfieldBreak', a: F.by, why, vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: F.x, y: F.y, s: '역장 깨짐!', c: 'r', t0: W.t }); } }
function wallHold(W, F){""")
rep("const d = Math.hypot(ex, ey), need = e.r + 0.22;\n    if (d >= need) continue;", "const d = Math.hypot(ex, ey), need = e.r + (F.th ? F.th / 2 + 0.05 : 0.22);\n    if (d >= need){ if (F.ht) delete F.ht[e.i]; continue; }\n    if (F.ht){ const t0 = F.ht[e.i] != null ? F.ht[e.i] : W.t; F.ht[e.i] = W.t; wallHurt(W, F, (e.atk || 10) * (e.atkMul || 1) * 0.5 * Math.min(0.1, W.t - t0), '밀어붙임'); if (W.t >= F.until) return; }   /* v9.8.2 미는 몸만큼 깎임 */")
rep("    s.done = true; s.x = x0 + (x1 - x0) * k; s.y = y0 + (y1 - y0) * k; if (arc){ s.lx = s.x; s.ly = s.y; }", "    s.done = true; s.x = x0 + (x1 - x0) * k; s.y = y0 + (y1 - y0) * k; if (arc){ s.lx = s.x; s.ly = s.y; }\n    if (F.hard){ const sh = W.units[s.a]; wallHurt(W, F, (sh ? (sh.atk || 10) * (sh.atkMul || 1) : 15) * (s.jav ? 1.5 : 1) * (s.mul || 1), '탄'); }   /* v9.8.2 */")
rep("if (FW){ if (W.t - (FW.blkT || -9) > 0.4){ FW.blkT = W.t;", "if (FW){ wallHurt(W, FW, (u.atk || 10) * (u.atkMul || 1), '근접');   /* v9.8.2 */ if (W.t - (FW.blkT || -9) > 0.4){ FW.blkT = W.t;")

# ---------- ② 화살비 ----------
rep("brain: { rng: 16, minD: 6, cnt: 7, r: 1.3, spread: 4.5, mul: 0.8, delay: 1.1, gap: 0.12, wind: 0.9, rec: 0.6, cd: 14 }", "brain: { rng: 16, minD: 6, cnt: 10, R: 1.5, spread: 2, mul: 0.8, delay: 1, wind: 0.9, rec: 0.6, cd: 14 }")
rep("""  if (k === 'brain'){ const tx = A.px != null ? A.px : (t ? t.x : u.x), ty = A.py != null ? A.py : (t ? t.y : u.y), Z = W.h2z || (W.h2z = []), m = W.map;
    for (let i = 0; i < (S.cnt || 7); i++){""", """  if (k === 'brain'){ const tx = A.px != null ? A.px : (t ? t.x : u.x), ty = A.py != null ? A.py : (t ? t.y : u.y);   /* v9.8.2 화살비 (예고 원 · 곡사 판정) */
    volStart(W, u, tx, ty, { n: S.cnt || 10, R: S.R || 1.5, mul: S.mul || 0.8, delay: S.delay || 1, tag: '어둠의 화살비' }); return; }
  if (k === 'brainOld'){ const tx = A.px != null ? A.px : (t ? t.x : u.x), ty = A.py != null ? A.py : (t ? t.y : u.y), Z = W.h2z || (W.h2z = []), m = W.map;
    for (let i = 0; i < (S.cnt || 7); i++){""")
rep("  fire(W, u); if (suppArc(u, A.so)) launchArcAt(W, u, A.px, A.py, A.so); else launchAt(W, u, A.px, A.py, A.so);",
    "  fire(W, u); if (suppArc(u, A.so)){ volStart(W, u, A.px, A.py, { n: 10, R: 1.5, mul: 0.7, delay: 1, tag: '화살비' }); A.so.left -= 4; A.so.fired += 10; if (u.ammo != null) u.ammo = Math.max(0, u.ammo - 1); A.phase = 'rec'; A.t1 = W.t; A.end = W.t + u.rec + 4; if (u.ammo === 0) outOfAmmo(W, u); return; } else launchAt(W, u, A.px, A.py, A.so);   /* v9.8.2 활의 지역사격 = 화살비 (한 번 쏘고 4초 쉼) */")
rep("function launchArcAt(W, u, x, y, so){", r"""// v9.8.2 화살비: 화살 하나가 하늘로 → 붉은 원 delay 초 → 그 뒤 1초 동안 n 발이 원 안에 1 ~ 2발씩 (곡사와 같은 떨어짐 판정 · 원을 본 몸은 달아남)
function volStart(W, u, x, y, o){ const V = W.vol8 || (W.vol8 = []), R = o.R || 1.5, m = W.map; x = Math.max(0.5, Math.min(m.W - 0.5, x)); y = Math.max(0.5, Math.min(m.H - 0.5, y));
  V.push({ by: u.i, side: u.side, x, y, R, t0: W.t, at: W.t + (o.delay || 1), n: o.n || 10, left: o.n || 10, next: W.t + (o.delay || 1), mul: o.mul || 0.7, tag: o.tag || '화살비', seen: [], sx: u.x, sy: u.y });
  L(W, { k: 'volley', a: u.i, x: +x.toFixed(1), y: +y.toFixed(1), n: o.n || 10, tag: o.tag || '화살비', vis: u.side === 0 || !!u.seenBy || W.units.some(e => e.side === 0 && e.alive && Math.hypot(e.x - x, e.y - y) < R + 2) }); }
function volTick(W){ if (!W.vol8 || !W.vol8.length) return;
  for (const V of W.vol8){ const u = W.units[V.by];
    if (W.t < V.at){ for (const e of W.units){ if (!e.alive || e.gone || e.down || e.kb || e.crawl || e.lie || V.seen.includes(e.i) || W.t < (e.proneT || -9) || W.t < (e.stunT || -9)) continue;
        const cd = Math.hypot(e.x - V.x, e.y - V.y); if (cd - e.r >= V.R) continue; V.seen.push(e.i);
        if (!(litAt(W, V.x, V.y) || (u && canSee(W, e, u))) || (e.order && e.order.k === 'hold') || (e.act && (e.act.k === 'charge' || e.act.k === 'leap'))) continue;
        if (W.rand() >= tgDodgeP(W, e)){ L(W, { k: 'tgLate', a: e.i, b: V.by, what: V.tag, ff: e.side === V.side, vis: e.side === 0 || !!e.seenBy }); continue; }
        const ox = cd > 0.01 ? (e.x - V.x) / cd : 1, oy = cd > 0.01 ? (e.y - V.y) / cd : 0, D = V.R - cd + e.r + 0.4; let fx = Math.max(0.6, Math.min(W.map.W - 0.6, e.x + ox * D)), fy = Math.max(0.6, Math.min(W.map.H - 0.6, e.y + oy * D));
        if (boxRock(W, fx, fy, e.r * 0.9)) continue; if (e.act && e.act.phase === 'wind') e.act = null;
        e.flee = { x: fx, y: fy, until: V.at + 1.1, why: V.tag + ' — 피함' }; e.mv = { k: 'crun', run: true, until: V.at + 1.1 };
        L(W, { k: 'tgDodge', a: e.i, b: V.by, what: V.tag, ff: e.side === V.side, vis: e.side === 0 || !!e.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: e.x, y: e.y - 0.45, s: '!', c: 'g', t0: W.t }); }
      continue; }
    while (V.left > 0 && W.t >= V.next){ const k = Math.min(V.left, W.rand() < 0.5 ? 1 : 2); V.left -= k; V.next += 0.1;
      for (let i = 0; i < k; i++){ const a = W.rand() * 6.283, rr = Math.sqrt(W.rand()) * V.R, lx = Math.max(0.4, Math.min(W.map.W - 0.4, V.x + Math.cos(a) * rr)), ly = Math.max(0.4, Math.min(W.map.H - 0.4, V.y + Math.sin(a) * rr));
        const ddx = lx - V.sx, ddy = ly - V.sy, dl = Math.hypot(ddx, ddy) || 1, ux = ddx / dl, uy = ddy / dl, x0 = lx - ux * 1.2, y0 = ly - uy * 1.2;
        W.shots.push({ id: ++W.shotN, a: V.by, meant: null, x: x0, y: y0, x0, y0, dx: ux, dy: uy, lx, ly, T: 0.28, el: 0, q: 0, arc: true, sp: 0, left: 0, p: 0, good: false, t0: W.t, side: V.side, mul: V.mul, pm: 1, supp: true, so: null, vol: true }); } } }
  W.vol8 = W.vol8.filter(V => V.left > 0 || W.t < V.next + 0.6);
}
function launchArcAt(W, u, x, y, so){""")
rep("  cmdTick(W); tgTick(W);", "  cmdTick(W); tgTick(W); volTick(W);   /* v9.8.2 화살비 */")
rep("module.exports = { smoothPath,", "module.exports = { volStart, volTick, wallHurt, smoothPath,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9180 OK')
