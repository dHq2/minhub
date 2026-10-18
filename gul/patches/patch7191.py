# v7.19.1 엔진 — patch7191.py v1.1 (v1.1: 철퇴 후리기 로그는 flailSweep (카리우스 넓게 휘두르기 sweep 과 겹침) · 고유 기술: 공중제비 (탕아 — 뒤로 빠짐 / 뛰어올라 세로로 내려찍기) · 머리 찍기 (쟝 — 판에 한 번, 머리 확정 치명 · 중대형까지 2% 즉사) · 영거리 사격 (간두 — 특수탄 샷건 · 날려 보냄) · 철퇴 후리기 (모닝스타 — 둘레를 뒤부터 한 바퀴, 동료도 맞음, 큰 몸이 막으면 멈출 수 있음) · 휘둘러 치기 (모닝스타 — 3.6칸까지 · 머리 직격이면 치명 · 2% 즉사 · 크게 날림))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "  terrain: {", """  spec: { flip: { d: 3.2, back: 2.6, time: 0.45, cd: 7, backCd: 3, len: 1.5, w: 0.9, mul: 2.3, crit: 0.25, down: 1.0 }, head: { kill: 0.02, max: '중대형', win: 4 }, pb: { rng: 2.4, wind: 0.25, rec: 0.5, cd: 2.8, mul: 2.6, kb: 1.0 }, sweep: { r: 1.9, wind: 0.6, rec: 0.6, cd: 8, mul: 1.5, kb: 0.8, stop: 0.5 }, hurl: { rng: 3.6, wind: 0.8, rec: 0.6, cd: 6, mul: 2.0, kb: 1.6, head: 0.5, kill: 0.02 } },   /* v7.19.1 고유 기술: 공중제비 (닿는 칸 · 뒤로 · 대기 · 내려찍는 세로 길이 · 폭 · 피해 × · 치명 + · 넘어뜨림 초) · 머리 찍기 (즉사 · 체급 한도 · 노리는 초) · 영거리 사격 · 철퇴 후리기 (반지름 · 막히면 멈출 확률) · 휘둘러 치기 (머리 직격 확률) */
  terrain: {""")
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
s = rep(s, "palm: acts.includes('팜 버스트'), palmCd: -9,", "palm: acts.includes('팜 버스트'), palmCd: -9, spec: acts.filter(a => SPEC_K[a]).map(a => ({ k: SPEC_K[a], name: a, cdT: -9, n: SPEC_K[a] === 'head' ? 1 : null })), shells: acts.includes('영거리 사격') ? (p.shells != null ? +p.shells : 100) : null,")   # v7.19.1
s = rep(s, "  if (q >= 1) u.act = null;", "  if (q >= 1){ if (A.slam) slamHit(W, u, A); u.act = null; }   // v7.19.1 공중제비 내려찍기")
s = rep(s, "  if (u.act.k === 'palm'){ resolvePalm(W, u); return; }   // v6.7", "  if (u.act.k === 'palm'){ resolvePalm(W, u); return; }   // v6.7\n  if (u.act.k === 'spec'){ resolveSpec(W, u); return; }   // v7.19.1 고유 기술")
s = rep(s, "  lungeChk(W, u, t);   /* v7.17 기습 가속 */", "  lungeChk(W, u, t);   /* v7.17 기습 가속 */\n  if (!ordered && specAuto(W, u, t, see)) return;   /* v7.19.1 고유 기술 (스스로) */")
# 머리 찍기 · 휘둘러 치기: 부위 · 치명 · 즉사
s = rep(s, "  for (const k in P){ r -= P[k].w * (k === '머리' ? (exposed ? 2 : 1) * aH : 1); if (r <= 0){ part = k; break; } }",
        "  for (const k in P){ r -= P[k].w * (k === '머리' ? (exposed ? 2 : 1) * aH : 1); if (r <= 0){ part = k; break; } }\n  const HM = !o.far && !J && !!u.headMark && u.headMark.b === t.i && W.t < u.headMark.until, HP = !HM && !!(extra && extra.headP) && W.rand() < extra.headP; if (HM || HP) part = '머리';   // v7.19.1 머리 찍기 · 휘둘러 치기")
s = rep(s, "crit = J ? W.rand() < J.crit + (u.vit || 0) : W.rand() <", "crit = HM || (HP && W.rand() < 0.7) || (J ? W.rand() < J.crit + (u.vit || 0) : W.rand() <")
s = rep(s, "((FATR(W) || {}).ex || {}).crit || 0 : 0);   // v6.6 탈진하면 급소가 열림", "((FATR(W) || {}).ex || {}).crit || 0 : 0));   // v6.6 탈진하면 급소가 열림")
s = rep(s, "  if (o.gapHit && !o.tag) o.tag = '갑옷 틈을 찌름';", """  if ((HM || (HP && part === '머리')) && t.alive){ const SP = R.spec || {}, kill = HM ? ((SP.head || {}).kill != null ? SP.head.kill : 0.02) : ((SP.hurl || {}).kill != null ? SP.hurl.kill : 0.02);   // v7.19.1 머리 직격: 체급 한도 (중대형) 까지 즉사 확률
    if (HM){ u.headMark = null; const sp = (u.spec || []).find(x => x.k === 'head'); if (sp) sp.n = 0; }
    if ((SIZE_RANK[sizeOf(t)] || 0) <= (SIZE_RANK[(SP.head || {}).max || '중대형'] != null ? SIZE_RANK[(SP.head || {}).max || '중대형'] : 2) && W.rand() < kill){ dmg = Math.max(dmg, Math.ceil(t.hp)); o.tag = (HM ? '머리 찍기' : '휘둘러 치기') + ' — 머리 직격 · 즉사'; }
    else o.tag = HM ? '머리 찍기 — 확정 치명' : '휘둘러 치기 — 머리 직격';
    o.spec = HM ? 'head' : 'hurl'; }
  if (o.gapHit && !o.tag) o.tag = '갑옷 틈을 찌름';""")
# 명령
s = rep(s, "  if (o.k === 'palm'){   // v6.7 팜 버스트 명령", """  if (o.k === 'spec'){   // v7.19.1 고유 기술 명령: 닿으면 바로 · 대기 중이면 붙어 싸우며 기다림 · 아니면 다가감
    const sp = specOf(u, o.s), t = o.b != null ? W.units[o.b] : null;
    if (!sp){ u.order = null; return; }
    if (o.s === 'sweep'){ if (specReady(W, u, 'sweep')){ startSpec(W, u, null, 'sweep', '명령'); u.order = null; } else setMood(W, u, '철퇴 후리기 대기'); return; }
    if (o.s === 'flip' && o.x != null){ if (specReady(W, u, 'flip')){ startFlip(W, u, null, true, o.x, o.y); u.order = null; } else setMood(W, u, '공중제비 대기'); return; }
    if (!t || !t.alive){ u.order = null; return; }
    const see = canSee(W, u, t); if (!see && !(u.side === 0 ? t.seenBy : false)){ L(W, { k: 'lost', a: u.i, b: t.i }); u.order = null; return; }
    if (o.s === 'head'){ if (specReady(W, u, 'head')){ u.headMark = { b: t.i, until: W.t + (SPR(W, 'head').win || 4) + 3 }; L(W, { k: 'specArm', a: u.i, b: t.i, s: 'head', vis: true }); } u.order = { k: 'attack', b: t.i }; return; }
    const S = SPR(W, o.s), reach = o.s === 'flip' ? S.d || 3.2 : o.s === 'pb' ? S.rng || 2.4 : S.rng || 3.6;
    if (specReady(W, u, o.s) && gap(u, t) <= reach && (o.s === 'flip' ? startFlip(W, u, t, false) : startSpec(W, u, t, o.s, '명령'))){ u.order = null; return; }
    if (!specReady(W, u, o.s) && gap(u, t) <= u.rng + 0.3){ setMood(W, u, sp.name + ' 대기', t.i); fight(W, u, t, dt, see, true); return; }
    setMood(W, u, sp.name + '하러', t.i); goTo(W, u, t.x, t.y, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return;
  }
  if (o.k === 'palm'){   // v6.7 팜 버스트 명령""")
# 기술 본체
s = rep(s, "function startPalm(W, u, t, why){", """/* ---------- v7.19.1 고유 기술: 공중제비 (탕아) · 머리 찍기 (쟝) · 영거리 사격 (간두) · 철퇴 후리기 · 휘둘러 치기 (모닝스타) — 적 · 아군 같은 규칙 ---------- */
const SPEC_K = { '공중제비': 'flip', '머리 찍기': 'head', '영거리 사격': 'pb', '철퇴 후리기': 'sweep', '휘둘러 치기': 'hurl' };
const SPR = (W, k) => ((W.rules.spec || {})[k]) || {};
const specOf = (u, k) => (u.spec || []).find(x => x.k === k);
function specReady(W, u, k){ const x = specOf(u, k); if (!x || !u.alive || u.down || u.noArms || u.crawl || u.lie || u.kb || W.t < x.cdT || W.t < u.brokenT || W.t < (u.proneT || -9)) return false; if (x.n != null && x.n <= 0) return false; return k !== 'pb' || u.shells > 0; }
// 공중제비: back = 뒤 (또는 찍은 자리) 로 빠짐 · 아니면 그 상대에게 뛰어올라 몸 바로 앞에 내려찍음 (내려앉을 때 slamHit)
function startFlip(W, u, t, back, px, py){
  const F = SPR(W, 'flip'), x = specOf(u, 'flip'); let tx, ty;
  if (back){ const ax = px != null ? px - u.x : u.x - t.x, ay = py != null ? py - u.y : u.y - t.y, l = Math.hypot(ax, ay) || 1, Dd = Math.min(F.back || 2.6, px != null ? l : 99); tx = u.x + ax / l * Dd; ty = u.y + ay / l * Dd; }
  else { if (!t || gap(u, t) > (F.d || 3.2)) return false; const p = leapIn(u, t); tx = p.x; ty = p.y; }
  for (let k = 0; k < 6 && (boxRock(W, tx, ty, u.r * 0.9) || !fatClear(W.map, u.x, u.y, tx, ty, u.r * 0.6)); k++){ tx = u.x + (tx - u.x) * 0.75; ty = u.y + (ty - u.y) * 0.75; }
  const len = Math.hypot(tx - u.x, ty - u.y); if (len < 0.4 || boxRock(W, tx, ty, u.r * 0.9)) return false;
  u.act = { k: 'leap', phase: 'run', t0: W.t, end: W.t + (F.time || 0.45) * Math.max(0.6, len / (F.d || 3.2)), fx: u.x, fy: u.y, tx, ty, b: t ? t.i : null, dir: back ? 'back' : 'fwd', flip: true, slam: !back };
  x.cdT = W.t + (back ? F.backCd || 3 : F.cd || 7); stop(u); u.fg = back && t ? Math.atan2(t.y - u.y, t.x - u.x) : Math.atan2(ty - u.y, tx - u.x);
  L(W, { k: 'flip', a: u.i, b: t ? t.i : null, slam: !back, len: +len.toFixed(2), vis: u.side === 0 || !!u.seenBy }); setMood(W, u, back ? '공중제비로 빠짐' : '공중제비 — 내려찍기', t ? t.i : null);
  return true;
}
// 내려찍기: 뛴 방향으로 세로 len · 폭 w 안의 적을 모두 (막을 수는 있음) — 맞으면 넘어짐 (너무 무거운 몸은 안 넘어짐)
function slamHit(W, u, A){
  const F = SPR(W, 'flip'), dx0 = A.tx - A.fx, dy0 = A.ty - A.fy, l = Math.hypot(dx0, dy0) || 1, dx = dx0 / l, dy = dy0 / l, L0 = F.len || 1.5, w = (F.w || 0.9) / 2; let n = 0;
  for (const e of W.units){ if (!e.alive || e === u || e.side === u.side) continue;
    const ex = e.x - u.x, ey = e.y - u.y, al = ex * dx + ey * dy, lat = Math.abs(ex * dy - ey * dx);
    if (al < -0.3 || al > L0 + e.r || lat > w + e.r) continue;
    const o = strike(W, u, e, e, 1, false, { mul: F.mul || 2.3, heavyCrit: F.crit || 0.25, tag: '공중제비 내려찍기' }); n++;
    if (o && !o.block && e.alive && e.mass <= u.mass * 1.6) knockDown(W, e, F.down || 1.0, u.i, '내려찍기'); }
  L(W, { k: 'slam', a: u.i, n, vis: u.side === 0 || !!u.seenBy }); if (W.fxOn) W.fx.push({ k: 'num', x: A.tx, y: A.ty, s: '내려찍기!', c: 'd', t0: W.t });
}
function startSpec(W, u, t, k, why){
  const S = SPR(W, k), x = specOf(u, k), wind = (S.wind || 0.5) * fatMul(W, u, 'wind');
  u.act = { k: 'spec', s: k, b: t ? t.i : null, phase: 'wind', t0: W.t, end: W.t + wind, why: why || x.name }; x.cdT = W.t + (S.cd || 5); stop(u); u.waitT = 0;
  if (t) u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  setMood(W, u, x.name, t ? t.i : null);
  L(W, { k: 'wind', a: u.i, b: t ? t.i : null, spec: k, w: x.name, end: +(W.t + wind).toFixed(2), why: why || '', hid: u.side === 1 && !u.seenBy });
  if (W.fxOn && t) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind });
  return true;
}
function resolveSpec(W, u){
  const A = u.act, k = A.s, S = SPR(W, k), t = A.b != null ? W.units[A.b] : null;
  if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.end = W.t + (S.rec || 0.5); A.t1 = W.t; u.atkT = W.t;
  if (k === 'pb'){   // 영거리 사격: 특수탄 한 발 · 샷건 (총성) · 크게 날려 보냄
    if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    if (gap(u, t) > (S.rng || 2.4) + 0.3){ L(W, { k: 'miss', a: u.i, b: t.i, why: '샷건이 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); return; }
    u.shells = Math.max(0, (u.shells || 0) - 1); { const a0 = u.ammo, m0 = u.mag, l0 = u.loud; u.loud = true; fire(W, u); u.ammo = a0; u.mag = m0; u.loud = l0; }
    const w0 = u.weaponNow; u.weaponNow = '샷건'; const o = strike(W, u, t, t, 1, true, { mul: S.mul || 2.6, tag: '샷건 영거리 사격' }); u.weaponNow = w0;
    if (o && t.alive && !t.kb) shove(W, u, t, (S.kb || 1) * (o.block ? 0.5 : 1), t.x - u.x, t.y - u.y, { tag: '샷건에 날아감' });
    L(W, { k: 'pb', a: u.i, b: t.i, left: u.shells, vis: true }); return;
  }
  if (k === 'sweep'){   // 철퇴 후리기: 뒤에서부터 한 바퀴 — 둘레의 모두 (동료도) · 큰 몸이 막으면 확률로 회전이 멈춤
    const r = S.r || 1.9, f0 = (u.face || 0) + Math.PI, list = W.units.filter(e => e.alive && e !== u && dist(u, e) <= r + e.r).map(e => ({ e, a: ((Math.atan2(e.y - u.y, e.x - u.x) - f0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) })).sort((p, q) => p.a - q.a);
    let n = 0, stopBy = null;
    for (const { e } of list){ const o = strike(W, u, e, e, 1, false, { mul: S.mul || 1.5, tag: '철퇴 후리기' }); n++;
      if (o && o.block && (SIZE_RANK[sizeOf(e)] || 0) >= 2 && W.rand() < (S.stop != null ? S.stop : 0.5)){ stopBy = e; break; }
      if (o && !o.block && e.alive && !e.kb) shove(W, u, e, (S.kb || 0.8) * (u.strMul || 1), e.x - u.x, e.y - u.y, { tag: '철퇴에 쓸려 나감' }); }
    L(W, { k: 'flailSweep', a: u.i, n, stop: stopBy ? stopBy.i : null, vis: u.side === 0 || !!u.seenBy }); return;
  }
  if (k === 'hurl'){   // 휘둘러 치기: 머리 위로 돌리다 먼 상대를 후려침 — 머리 직격 확률 · 크게 날림
    if (!t || !t.alive){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐', spec: k }); return; }
    if (gap(u, t) > (S.rng || 3.6) + 0.3){ L(W, { k: 'miss', a: u.i, b: t.i, why: '철퇴가 닿지 않음 (' + gap(u, t).toFixed(1) + '칸)', spec: k }); return; }
    if (evadeMelee(W, t, u)) return;
    const o = strike(W, u, t, t, 1, false, { mul: S.mul || 2, headP: S.head != null ? S.head : 0.5, tag: '휘둘러 치기' });
    if (o && t.alive && !t.kb) shove(W, u, t, (S.kb || 1.6) * (o.block ? 0.5 : 1) * (u.strMul || 1), t.x - u.x, t.y - u.y, { tag: '철퇴에 날아감' });
    L(W, { k: 'hurl', a: u.i, b: t.i, vis: u.side === 0 || !!u.seenBy }); return;
  }
}
// 스스로 쓰기 (적 · 아군 같은 판단 — 그 상황일 때만)
function specAuto(W, u, t, see){
  if (!u.spec || !u.spec.length || !t || !t.alive || !see || u.act) return false;
  const g = gap(u, t), near = (r, same) => W.units.filter(e => e.alive && e !== u && (same ? e.side === u.side : e.side !== u.side) && dist(u, e) <= r + e.r).length;
  if (specReady(W, u, 'flip')){ const F = SPR(W, 'flip');
    if (u.hp / u.max < 0.35 && g < u.rng + 0.4 && !isFar(t) && startFlip(W, u, t, true)) return true;
    if (g > u.rng + 0.6 && g <= (F.d || 3.2) && !inGuard(W, t, u) && startFlip(W, u, t, false)) return true; }
  if (specReady(W, u, 'pb') && g <= (SPR(W, 'pb').rng || 2.4) - 0.4 && !isFar(t)) return startSpec(W, u, t, 'pb', '바싹 붙은 상대에게 샷건');
  if (specReady(W, u, 'sweep')){ const r = SPR(W, 'sweep').r || 1.9, fe = near(r, false), al = near(r, true); if ((fe >= 2 && al === 0) || (fe >= 3 && al <= 1)) return startSpec(W, u, null, 'sweep', '둘러싼 적을 쓸어 버림'); }
  if (specReady(W, u, 'hurl')){ const H = SPR(W, 'hurl'); if (g > u.rng + 0.3 && g <= (H.rng || 3.6)){ const fb = firstOnLine(W, u, t, u, knows(W, u)); if (fb === t || fb.side !== u.side) return startSpec(W, u, t, 'hurl', '먼 상대를 후려침'); } }
  if (specReady(W, u, 'head') && !u.headMark && g <= u.rng + 1.5 && (t.max >= 150 || t.hp > 120)){ u.headMark = { b: t.i, until: W.t + (SPR(W, 'head').win || 4) }; L(W, { k: 'specArm', a: u.i, b: t.i, s: 'head', vis: u.side === 0 || !!u.seenBy }); }
  return false;
}
function startPalm(W, u, t, why){""")
s = rep(s, "if (typeof module !== 'undefined') module.exports = { ", "if (typeof module !== 'undefined') module.exports = { SPEC_K, specOf, specReady, startFlip, startSpec, specAuto, slamHit, ")
wr('rt3_tail.js', s)
print('patch7191 OK')
