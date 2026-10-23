# v8.7.8 엔진 (2) — patch8780b.py v1.4 (v1.4: 명세 C5 의 베테랑 기사 그대로 — 구르기 범위 넓고 오래 (3.6칸 · 0.55초 · 닿는 폭 +0.35) · 잘 넘어뜨림 (1.4초) · 투창 좋음 (겨눔 × 1.25) · 방어 자세 좋음 (버팀 × 1.4) · v1.3: 도감 · 위키 민수 메모 그대로 — 고유 이름 ◆쥐들의 왕 (도감 · 2D 의 '쥐들의 대왕' 도발 · 대검 베기는 그 안에) · 큰 쥐도 C-270 (도감: 쥐 · 중쥐 · 대쥐 하나로) ·
#   쥐 베테랑 (C-274 · 4성): 구르기 (앞 — 진형을 무너뜨림 · 중대형까지 넘어뜨림 / 뒤 — 노린 일격을 빠져나감 · 구르는 동안 받는 피해 × 0.6 · 급소 보호) · 투창 뒤 검으로 근접전 ·
#   지휘의 열화 카피 (포렌이 쓰러지면 베테랑이 쥐를 이끌고 표식) · 쥐 기사는 싸움이 끝나면 경례하고 사라짐 (도감) · 쥐의 무구는 쓰러져도 전리품이 되지 않음 · v1.2: 방벽 쥐가 몸으로 밀어 내 노린 동료에게 손이 안 닿아도 사이의 쥐에겐 닿으면 그 쥐가 맞음 (2D — 사이에 선 쥐가 대신 맞음) · v1.1: 싸움 끝 (적이 모두 쓰러짐) 정리는 그 순간 바로 — 판이 끝나면 (W.over) 더 셈하지 않아 쥐 기사가 돌아온 셈이 안 되던 것 · 싸우는 중 판단에 나를 노리는 적도 · v1.0: 포렌 (명세 C5 — 2D 미궁 프롤로그 그대로: 충성 · 쥐 군단 (쥐 표식 · 방벽) · 쥐 망토 · 쥐 방진 · 쥐 방패 · 쥐 사다리 · 쥐 포박 · 쥐들의 대왕 (도발 · 대검 베기)
#   · 쥐 기사는 3D (이름 A, B … · 살아 돌아올 때마다 단계 +1 (최대 4) · 세 번 돌아오면 쥐 베테랑 · 죽으면 기억에서 빠짐) · 쥐는 포렌의 기술로만 움직임 (다른 이의 명령은 받지 않음) · 적 · 아군 같은 규칙)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8780.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# ---------- 수치표: 포렌 · 쥐 (2D HEROES.poren · ratS · ratM · ratL · ratKnight · RAT_ROLL · RAT_ASSAULT · RAT_WALL · CLOAK · FORT · RAT_SHIELD · LADDER · BIND) ----------
#   옮김: 체력 × 1.2 (쥐) · 공격 × 1.64 (굿윌 · 모닝스타와 같은 비) · 걸음은 2D 칸/초 그대로. 포렌 본인 수치는 설계 (페이지).
rep("  gw: { lo: 3,", """  poren: {   /* v8.7.8 포렌 — 2D 쥐 군단 그대로 (쥐 기사의 이름 · 단계 · 베테랑은 3D) */
    cap: 24, few: 4, fewK: 2.5, idleK: 0.25, idleCap: 4, wildP: 0.3, init: 4, initKnight: 0.5,
    roll: [['ratS', 0.58, 0.8], ['ratM', 0.27, 3], ['ratL', 0.13, 8], ['ratKnight', 0.02, 8]],   // [쥐, 확률, 게이지 초] — 다음 쥐는 미리 정해짐
    rats: {
      ratS: { name: '작은 쥐', ref: 'C-270', cls: '기동', hp: 18, atk: 5, spd: 3.8, height: 0.3, weight: 3, rMul: 0.5, traits: ['회피A', '후각B'] },
      ratM: { name: '쥐', ref: 'C-270', cls: '기동', hp: 48, atk: 11, spd: 3.2, height: 0.45, weight: 12, rMul: 0.7, traits: ['회피B', '후각B'] },
      ratL: { name: '큰 쥐', ref: 'C-270', cls: '근접', hp: 240, atk: 23, spd: 2.6, height: 1.0, weight: 70, rMul: 1.15, traits: ['후각B'] },
      ratKnight: { name: '쥐 기사', ref: 'C-059', cls: '근접', weapon: '창', shield: true, charge: true, hp: 108, atk: 21, spd: 3.0, height: 0.9, weight: 40, traits: ['회피C'], active: ['돌진'], gear: { 몸: { name: '판금 흉갑', mat: '판금', tier: 1 } } },
      ratVet: { name: '쥐 베테랑', ref: 'C-274', cls: '근접', weapon: '창', javSide: '검', shield: true, charge: true, hp: 300, atk: 26, spd: 2.7, height: 1.0, weight: 62, traits: ['베테랑', '공통스킬:투창', '대방패', '회피C'], active: ['돌진', '구르기'], poise: 1.4, javK: 1.25, gear: { 몸: { name: '판금 흉갑', mat: '판금', tier: 2 } } } },
    vetRoll: { cd: 6, fMin: 1.6, fMax: 4.6, fDist: 3.6, fDur: 0.55, bDist: 2.4, bDur: 0.38, backP: 0.6, def: 0.6, w: 0.35, mul: 0.5, kd: 1.4, shove: 1.0 },   // 구르기 (민수 메모: 앞뒤 · 방어 보정 · 급소 보호 · 중대형까지 넘어뜨림)
    vetCmd: { cd: 18, dur: 3 }, leave: 1.5,   // 지휘의 열화 카피 (포렌이 쓰러지면 베테랑의 표식 — 덤 쥐 없이 3초) · 경례 뒤 사라지기까지
    mark: { cd: 12, dur: 5, extra: 3, knightP: 0.3 },   // 쥐 표식 '물어라!' — 3D: 덤으로 오는 첫 쥐는 30% 쥐 기사
    wall: { cd: 6, dur: 3, minAtk: 30, bigAtk: 50 },   // 방벽: 동료에게 강공 (보스 · 공격 30 넘음) 이 오면 2 ~ 4마리가 앞을 막음
    cloak: { r: 1.6, per: 0.035, max: 0.16 },   // 쥐 망토: 곁의 쥐 하나마다 받는 피해 -3.5% (최대 -16% — 2D 방어 +2 · +10 을 방어 22 위에서 옮김)
    fort: { cd: 14, dur: 2.5, share: 0.7, near: 1.6, lowHp: 0.4, maxRats: 8, minRats: 2, counter: 0.6, weightK: 0.164, crit: 0.25, spinR: 1.8 },
    shield: { cd: 16, dur: 6, jump: 2.2, maxRats: 12, gap: 0.55, bigStun: 0.5, ahead: 1.1, allyHp: 0.45, allyR: 3, selfHp: 0.5, selfR: 2, shareR: 2.5 },
    ladder: { cd: 7, min: 2.5, max: 8, speed: 7, rats: 3, mul: 1.5, r: 1.3, stun: 0.5 },
    bind: { cd: 12, range: 4.5, rats: 5, min: 3, per: 22, max: 100, drain: 22, dur: 3, boss: 2.5 },   // 3D: 최대 3초 (2D 4.5초에서 줄임)
    taunt: 3, cleave: 0.6 },
  gw: { lo: 3,""")
rep("'대검':{rng:0.7, guard:true, two:true, kind:'날붙이'}", "'대검':{rng:0.7, guard:true, two:true, kind:'날붙이'}, '포렌의 대검':{rng:0.75, guard:true, two:true, kind:'날붙이'}")   # v8.7.8 에메랄드 대검 (대검이 곧 방패)
rep("  spec: { gpalm:", "  spec: { pmark: { cd: 12, rng: 9 }, pfort: { cd: 14 }, pshield: { cd: 16 }, pladder: { cd: 7, rng: 8 }, pbind: { cd: 12, rng: 4.5 }, gpalm:")
rep("'혈영보': 'blink',", "'혈영보': 'blink', '쥐 표식': 'pmark', '쥐 방진': 'pfort', '쥐 방패': 'pshield', '쥐 사다리': 'pladder', '쥐 포박': 'pbind',")

# ---------- 몸: 포렌 · 쥐 ----------
rep("U.gwKit = (p.unique || []).includes('푸른 번개');",
    "U.gwKit = (p.unique || []).includes('푸른 번개'); U.porenKit = (p.unique || []).includes('쥐들의 왕'); if (U.porenKit){ const PR = rules.poren || {}; U.taunt = PR.taunt || 3; U.cleave = PR.cleave || 0.6; U.ratMem = U.side === 0 ? (Array.isArray(p.ratMem) ? p.ratMem : (p.ratMem = [])) : null; } if (p.ratOf != null){ U.ratOf = p.ratOf; U.summon = p.summon || 'rat'; U.ratKind = p.ratKind || null; } if (p.javSide) U.javSide = p.javSide; if (+p.javK > 0) U.javK = +p.javK;   /* v8.7.8 포렌 (◆쥐들의 왕) · 쥐 · 투창 뒤 드는 검 · 투창 솜씨 */")

# ---------- 투창 뒤 검 (쥐 베테랑 — 도감: 투창 후 검으로 근접전) ----------
rep("u.shots++; u.spearHeld = false; u.rngSpear = u.rng; u.rng = (W.rules.weapons['맨손'] || { rng: 0.3 }).rng + (u.reachX || 0); u.weaponNow = '맨손';",
    "u.shots++; u.spearHeld = false; u.rngSpear = u.rng; javAfter(W, u);", 2)
rep("u.weaponNow === '맨손' || u.weaponNow === '발' || (u.jav && !u.spearHeld);",
    "u.weaponNow === '맨손' || u.weaponNow === '발' || (u.jav && !u.spearHeld && !(u.javSide && u.weaponNow === u.javSide));   /* v8.7.8 투창 뒤 검 */")

# ---------- 쥐는 쓰러져도 무구가 남지 않음 (전리품이 되지 않음 — 포렌의 쥐와 함께 사라짐) ----------
rep("  for (const it of W.items) if (it.k === 'spear' && it.owner === t.i) it.k = 'weapon';\n  dropHeld(W, t, 'death'); dropShield(W, t, 'death');",
    "  if (t.ratOf != null){ W.items = W.items.filter(it => !(it.k === 'spear' && it.owner === t.i)); t.weaponGone = true; t.shield = false; return; }   /* v8.7.8 포렌의 쥐 */\n"
    "  for (const it of W.items) if (it.k === 'spear' && it.owner === t.i) it.k = 'weapon';\n  dropHeld(W, t, 'death'); dropShield(W, t, 'death');")
rep("  for (const it of W.items || []){ if (it.k !== 'weapon' && it.k !== 'shield') continue; if (it.own && mine.has(it.own)) continue;",
    "  for (const it of W.items || []){ if (it.k !== 'weapon' && it.k !== 'shield') continue; if (it.own && mine.has(it.own)) continue; if (W.units[it.owner] && W.units[it.owner].ratOf != null) continue;   /* v8.7.8 쥐의 무구는 전리품이 아님 */")

# ---------- 구르기 (쥐 베테랑): 구르는 동안 받는 피해 × 0.6 · 급소 보호 ----------
rep("    if (vp && !(extra && extra.noWound) && !o.deflect && !t.marble && !t.noOrg){",
    "    if (vp && !(extra && extra.noWound) && !o.deflect && !t.marble && !t.noOrg && !(t.act && t.act.k === 'roll')){   /* v8.7.8 구르는 동안 급소 보호 */")

# ---------- 두뇌 · 동작 ----------
rep("  if (u.gwKit && !u.order && gwBrain(W, u, dt)) return;   /* v8.7.8 굿윌 (2D goodwillBrain) */",
    "  if (u.gwKit && !u.order && gwBrain(W, u, dt)) return;   /* v8.7.8 굿윌 (2D goodwillBrain) */\n"
    "  if (u.ratOf != null && ratBrain(W, u, dt)) return;   /* v8.7.8 포렌의 쥐 (포렌의 기술로만 · 명령은 받지 않음) */\n"
    "  if (u.porenKit && !u.order && porenBrain(W, u, dt)) return;   /* v8.7.8 포렌 (2D porenUpdate) */")
rep("  if (u.act && u.act.k === 'gwHop'){ gwHopStep(W, u); return; }   /* v8.7.8 굿윌 순간이동 도약 */",
    "  if (u.act && u.act.k === 'gwHop'){ gwHopStep(W, u); return; }   /* v8.7.8 굿윌 순간이동 도약 */\n  if (u.act && u.act.k === 'pr'){ prStep(W, u, dt); return; }   /* v8.7.8 포렌: 쥐 방진 · 쥐 사다리 · 쥐 방패 지휘 */\n  if (u.act && u.act.k === 'roll'){ rollStep(W, u, dt); return; }   /* v8.7.8 쥐 베테랑 구르기 */")
rep("  zapTick(W);   /* v8.7.8", "  porenTick(W, dt);   /* v8.7.8 포렌: 충성 · 쥐 망토 · 표식 · 방벽 · 포박 · 기억하는 쥐 */\n  zapTick(W);   /* v8.7.8")

# ---------- 받는 피해: 쥐 망토 · 방진 (쥐들이 70% 를 나눠 받음) · 쥐 방패 (구성원이 충격을 나눠 받음) ----------
rep("    if (t.dmgK > 0 && t.dmgK !== 1) dmg *= t.dmgK;",
    "    if (t.porenKit || (t.rs && t.rs.k === 'shieldWall') || (t.act && t.act.k === 'roll')){ dmg = porenTake(W, u, t, dmg, o); if (!(dmg > 0)) return; }   /* v8.7.8 포렌 · 쥐 방패 · 구르기 */\n    if (t.dmgK > 0 && t.dmgK !== 1) dmg *= t.dmgK;")

# ---------- 근접 일격: 방벽 쥐가 대신 맞음 · 대검 베기 (옆 하나 60%) ----------
rep("else { const so = strike(W, u, t, t, dp); if (u.cz) czHit(W, u, t, so); }",
    "else { const wr = ratWallHit(W, u, t), so = strike(W, u, wr || t, t, dp); if (u.cz) czHit(W, u, t, so); if (u.cleave) prnCleave(W, u, wr || t); }   /* v8.7.8 방벽 쥐가 대신 맞음 · 대검 베기 */")

rep("    else if (gap(u, t) > (!far && flailOf(W, u) ? (flailOf(W, u).sw || 1.3) : u.rng) + (far ? 0.5 : R.reach)) why =",
    "    else if (gap(u, t) > (!far && flailOf(W, u) ? (flailOf(W, u).sw || 1.3) : u.rng) + (far ? 0.5 : R.reach) && !(!far && A.k === 'atk' && ratWallReach(W, u, t))) why =")   # v8.7.8 사이에 선 방벽 쥐

# ---------- 도발: 3칸 안의 적은 포렌을 먼저 노림 (보스 · 쥐 빼고) ----------
rep("u.state = 'hunt'; u.target = pick; u.last = { x: pick.x, y: pick.y }; u.searchT = 6;",
    "pick = tauntOf(W, u, pick, seen); u.state = 'hunt'; u.target = pick; u.last = { x: pick.x, y: pick.y }; u.searchT = 6;   /* v8.7.8 도발 */")
rep("if (u.target !== pick) u.waitT = 0; u.state = 'fight'; u.target = pick; return;",
    "pick = tauntOf(W, u, pick, seen); if (u.target !== pick) u.waitT = 0; u.state = 'fight'; u.target = pick; return;   /* v8.7.8 도발 */")

# ---------- 명령으로 쓰는 포렌 기술 (기술 칸: 쥐 표식 · 쥐 방진) ----------
rep("    if (o.s === 'sweep' || o.s === 'ward'){",
    "    if (o.s === 'pfort'){ const x = specOf(u, 'pfort'); if (x && W.t < x.cdT){ setMood(W, u, '쥐 방진 대기 (' + (x.cdT - W.t).toFixed(1) + '초)'); stop(u); return; } if (!prFort(W, u, '명령')) L(W, { k: 'specFail', a: u.i, s: 'pfort', why: '곁에 쥐가 둘은 있어야', vis: true }); u.order = null; return; }   /* v8.7.8 쥐 방진 (제자리) */\n"
    "    if (o.s === 'sweep' || o.s === 'ward'){")
rep("GW_K.includes(o.s) ? gwStart(W, u, t, o.s, '명령') : startSpec(W, u, t, o.s, '명령')",
    "GW_K.includes(o.s) ? gwStart(W, u, t, o.s, '명령') : o.s === 'pmark' ? prnMark(W, u, t, '명령') : startSpec(W, u, t, o.s, '명령')")

POREN = r"""
/* ---------- v8.7.8 포렌 (명세 C5 — 2D 미궁 프롤로그 porenUpdate · 쥐 군단 그대로 · 쥐 기사는 3D) ----------
   충성: 게이지가 차면 쥐가 포렌 뒤쪽에서 달려옴 (다음 쥐는 미리 정해짐 — 작은 쥐 58% 0.8초 · 쥐 27% 3초 · 큰 쥐 13% 8초 · 쥐 기사 2% 8초 ·
   쥐가 넷보다 적으면 2.5배 빨리 · 싸움이 없으면 넷까지만 천천히 · 최대 24). 쥐는 포렌의 기술로만 움직임 (다른 이의 명령은 받지 않음).
   따르는 쥐 70% (포렌 곁 · 포렌이 노린 적) · 떠돌이 30% (둘레를 싸돌아다니며 마주친 적). 적 포렌도 같은 규칙 */
const PRN = W => W.rules.poren || {};
const PRN_BUSY = ['wall', 'fort', 'ladder', 'bind', 'bindRun', 'shieldWall'];
const prnRats = (W, u) => W.units.filter(r => r.alive && !r.gone && r.ratOf === u.i);
const ratBusy = r => !!(r.rs && PRN_BUSY.includes(r.rs.k));
function ratFree(r){ r.rs = { k: 'idle' }; }
const prnFoes = (W, u) => W.units.filter(e => e.alive && !e.gone && e.side !== u.side);
const prnVis = (W, u, t) => u.side === 0 || !!u.seenBy || !!(t && t.seenBy);
function prnLetter(M){ const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; for (let i = 0; ; i++){ const n = i < 26 ? AB[i] : AB[i % 26] + Math.floor(i / 26); if (!M.some(r => r.n === n)) return n; } }
function prnRoll(W){ let r = W.rand(); for (const [k, p] of PRN(W).roll || []){ if ((r -= p) <= 0) return k; } return 'ratS'; }
const prnFill = (W, k) => ((PRN(W).roll || []).find(x => x[0] === k) || [k, 0, 1])[2];
// 쥐가 생기는 자리: 멀면 포렌 뒤쪽 3.5 ~ 5칸 (적 반대편 — 그 자리부터 달려옴) · 가까우면 곁 (방진 · 포박 · 사다리)
function prnSpot(W, u, near){
  const m = W.map, F = prnFoes(W, u).sort((a, b) => dist(u, a) - dist(u, b))[0], a0 = F ? Math.atan2(u.y - F.y, u.x - F.x) : W.rand() * 6.283;
  for (let k = 0; k < 12; k++){
    const a = a0 + (W.rand() - 0.5) * (near ? 3.4 : 1.8), r = near ? 0.8 + W.rand() * 0.8 : 3.5 + W.rand() * 1.5, x = u.x + Math.cos(a) * r, y = u.y + Math.sin(a) * r;
    if (x < 0.7 || y < 0.7 || x > m.W - 0.7 || y > m.H - 0.7 || boxRock(W, x, y, 0.25)) continue;
    if (!near && !losClear(m, u.x, u.y, x, y)) continue;
    if (W.units.some(o => o.alive && !o.gone && Math.hypot(o.x - x, o.y - y) < 0.4)) continue;
    return { x, y };
  }
  return { x: u.x + (W.rand() - 0.5) * 0.6, y: u.y + (W.rand() - 0.5) * 0.6 };
}
// 쥐 부르기 — 쥐 기사는 기억하는 쥐부터 (동료 포렌: 이름 · 단계 · 세 번 살아 돌아오면 쥐 베테랑)
function prnRat(W, u, kind, o){
  const P = PRN(W), O = o || {};
  if (prnRats(W, u).length >= (P.cap || 24) + (O.extra || 0)) return null;
  let rec = null, k = kind;
  if (k === 'ratKnight' && u.ratMem){ rec = u.ratMem.find(x => !W.units.some(m => m.alive && !m.gone && m.ratRec === x)); if (!rec){ rec = { n: prnLetter(u.ratMem), lv: 1, ret: 0, vet: false }; u.ratMem.push(rec); } if (rec.vet) k = 'ratVet'; }
  const Dz = (P.rats || {})[k]; if (!Dz) return null;
  const q = O.at || prnSpot(W, u, !!O.near), lv = rec && !rec.vet ? rec.lv || 1 : 1;
  W.ratSeq = (W.ratSeq || 0) + 1;
  const p = { id: 'rat-' + u.i + '-' + W.ratSeq, name: rec ? Dz.name + ' ' + rec.n : Dz.name, ref: Dz.ref, tier: 1, cls: Dz.cls || '기동', role: '공격수', side: u.side, weapon: Dz.weapon || '이빨·발톱', javSide: Dz.javSide || null, poise: Dz.poise || undefined, javK: Dz.javK || undefined, shield: !!Dz.shield,
    height: Dz.height, weight: Dz.weight, rMul: Dz.rMul, noChg: !Dz.charge, nv: true, nvG: 'B', ov: { hp: Math.round(Dz.hp * (1 + (lv - 1) * 0.15)), atk: Math.round(Dz.atk * (1 + (lv - 1) * 0.1)), spd: Dz.spd },
    traits: (Dz.traits || []).slice(), active: (Dz.active || []).slice(), gear: Dz.gear ? JSON.parse(JSON.stringify(Dz.gear)) : {}, x: q.x, y: q.y, summon: 'rat', ratOf: u.i, ratKind: k };
  const r = (typeof engineSpawn === 'function' ? engineSpawn : addUnit)(W, p); if (!r) return null;
  r.summon = 'rat'; r.ratOf = u.i; r.ratKind = k; r.ratRec = rec; r.ratLv = lv; r.ratWild = !rec && k !== 'ratKnight' && W.rand() < (P.wildP != null ? P.wildP : 0.3); r.rs = { k: 'idle' }; r.state = u.side ? 'hunt' : 'fight';
  if (rec || k === 'ratL' || k === 'ratKnight') L(W, { k: 'ratCome', a: u.i, b: r.i, kind: k, n: rec ? rec.n : null, lv, ret: rec ? rec.ret || 0 : 0, vet: !!(rec && rec.vet), vis: prnVis(W, u) });
  return r;
}
// 싸우는 중 (아는 적이 14칸 안)
const prnFight = (W, u) => W.units.some(e => e.alive && !e.gone && e.side !== u.side && dist(u, e) < 14 && (e.target === u || (u.side === 0 ? !!e.seenBy || canSee(W, u, e) : u.target === e || canSee(W, u, e))));
function prnInit(W, u){
  const P = PRN(W), n = P.init != null ? P.init : 4, kn = (u.ratMem && u.ratMem.length) || W.rand() < (P.initKnight != null ? P.initKnight : 0.5);   // 3D: 처음엔 곁에 넷 (반은 쥐 기사부터)
  for (let i = 0; i < n; i++) prnRat(W, u, i === 0 && kn ? 'ratKnight' : 'ratS', { near: true });
}
// 쥐 표식 '물어라!': 그 적에게 5초 표식 · 어디선가 쥐 셋이 더 달려옴 · 모든 쥐가 우르르 몰려들어 둘러싸고 물어뜯음 (새로 온 쥐도 합류)
function prnMark(W, u, t, why){
  const M = PRN(W).mark || {}, x = specOf(u, 'pmark'); if (!x || W.t < x.cdT || !t || !t.alive || t.side === u.side) return false;
  const rats = prnRats(W, u).filter(r => !ratBusy(r)); if (!rats.length) return false;
  x.cdT = W.t + (M.cd || 12); u.ratMark = { b: t.i, until: W.t + (M.dur || 5) };
  for (let i = 0; i < (M.extra || 3); i++){ const r = prnRat(W, u, i === 0 && W.rand() < (M.knightP || 0.3) ? 'ratKnight' : prnRoll(W), { extra: M.extra || 3 }); if (r) rats.push(r); }
  rats.forEach((r, i) => { r.rs = { k: 'assault', b: t.i, until: u.ratMark.until, a: i / rats.length * 6.283 }; });
  L(W, { k: 'prMark', a: u.i, b: t.i, n: rats.length, why: why || '', vis: prnVis(W, u, t) });
  if (W.fxOn) W.fx.push({ k: 'ratmark', b: t.i, t0: W.t, until: u.ratMark.until });
  return true;
}
const markOn = (W, u) => !!(u && u.ratMark && W.t < u.ratMark.until && W.units[u.ratMark.b] && W.units[u.ratMark.b].alive);
// 방벽: 동료에게 강공 (보스 · 공격 30 넘음) 이 오면 가까운 쥐 2 ~ 4마리가 그 앞에 3초 줄을 섬 — 사이에 선 쥐가 근접 일격을 대신 맞음
const prnStrong = (W, e) => (e.traits || []).includes('보스') || !!e.jrB || (e.atk || 0) >= ((PRN(W).wall || {}).minAtk || 30);
function prnWall(W, u, g, e){
  const P = PRN(W).wall || {}; if (W.t < (u.prn.wallCd || -9)) return false;
  const need = (e.traits || []).includes('보스') ? 4 : (e.atk || 0) >= (P.bigAtk || 50) ? 3 : 2;
  const M = prnRats(W, u).filter(r => !ratBusy(r)).sort((a, b) => dist(a, g) - dist(b, g)).slice(0, need); if (!M.length) return false;
  u.prn.wallCd = W.t + (P.cd || 6);
  M.forEach((r, i) => { r.rs = { k: 'wall', g: g.i, a: e.i, idx: i, n: M.length, until: W.t + (P.dur || 3) }; });
  L(W, { k: 'ratWall', a: u.i, b: g.i, c: e.i, n: M.length, vis: prnVis(W, u, e) });
  return true;
}
const ratWallReach = (W, u, t) => W.units.some(r => r.alive && !r.gone && r.rs && r.rs.k === 'wall' && r.rs.g === t.i && r.rs.a === u.i && gap(u, r) <= u.rng + (W.rules.reach || 0.3));
function ratWallHit(W, u, t){
  if (!t || t.ratOf != null) return null;
  const k = gap(u, t);
  for (const r of W.units) if (r.alive && !r.gone && r.rs && r.rs.k === 'wall' && r.rs.g === t.i && r.rs.a === u.i && dist(u, r) < dist(u, t) && gap(u, r) <= Math.max(k, u.rng) + 0.35) return r;
  return null;
}
// 쥐 방진: 체력 40% 아래 · 강공이 날아옴 → 대검을 꽂고 2.5초 버팀 (움직이지 않음 · 휘청 · 밀림 없음) · 둘레 쥐 (최대 8) 가 받는 피해 70% 를 똑같이 나눠 받음
//   끝에 대검을 뽑으며 두 바퀴 — 공격 + 쥐들이 대신 맞은 피해 60% + 버틴 무게 (포렌 × 4 + 둘레 쥐) × 0.164 · 치명 25%. 곁에 적이 없으면 방진 쥐 셋을 타고 가장 위험한 적 (8칸) 에게 날아가 거기서
function prFort(W, u, why){
  const F = PRN(W).fort || {}, x = specOf(u, 'pfort');
  if (!x || W.t < x.cdT || !u.alive || u.down || (u.act && u.act.k === 'pr')) return false;
  const rats = prnRats(W, u).filter(r => !(r.rs && (r.rs.k === 'bind' || r.rs.k === 'bindRun'))).sort((a, b) => dist(a, u) - dist(b, u)).slice(0, F.maxRats || 8);
  if (rats.length < (F.minRats || 2)) return false;
  x.cdT = W.t + (F.cd || 14); if (u.act) interrupt(W, u, '쥐 방진');
  u.act = { k: 'pr', s: 'fort', phase: 'fort', t0: W.t, end: W.t + (F.dur || 2.5), rats: rats.map(r => r.i), absorbed: 0, dead: 0, why: why || '' };
  u.saT = Math.max(u.saT || -9, u.act.end + 0.05); stop(u);
  rats.forEach((r, i) => { r.rs = { k: 'fort', a: i / rats.length * 6.283, until: u.act.end + 0.5 }; });
  L(W, { k: 'prFort', a: u.i, n: rats.length, why: why || '', vis: prnVis(W, u) });
  if (W.fxOn) W.fx.push({ k: 'prRing', a: u.i, x: u.x, y: u.y, r: 1.6, t0: W.t, c: 'g' });
  return true;
}
function prSpin(W, u, cn){
  const F = PRN(W).fort || {}, hits = prnFoes(W, u).filter(e => dist(e, u) < (F.spinR || 1.8) + e.r);
  for (const e of hits){ strike(W, u, e, e, 1, false, { mul: cn.mul, crit: cn.crit || undefined, tag: '쥐 방진 — 대검 회전' }); if (e.alive) shove(W, u, e, 0.8, e.x - u.x, e.y - u.y, { tag: '대검 회전에 밀려남' }); }
  L(W, { k: 'prSpin', a: u.i, n: hits.length, abs: cn.absorbed, w: cn.w, dead: cn.dead, crit: !!cn.crit, mul: +cn.mul.toFixed(2), vis: prnVis(W, u) });
  if (W.fxOn) W.fx.push({ k: 'prRing', a: u.i, x: u.x, y: u.y, r: F.spinR || 1.8, t0: W.t, c: hits.length ? 'g' : 'm', spin: true });
}
// 쥐 사다리: 2.5 ~ 8칸 떨어진 적에게 — 쥐 셋이 발밑에 모이고 (0.4초) 그 위에 올라타 파도처럼 미끄러져 들어가 (7칸/초) 내려찍음 (1.3칸 · 공격 × 1.5 · 휘청 0.5)
function prLadder(W, u, t, cn, rats){
  const Ld = PRN(W).ladder || {}, x = specOf(u, 'pladder');
  if (!cn){ if (!x || W.t < x.cdT) return false; x.cdT = W.t + (Ld.cd || 7); }
  const d = Math.hypot(t.x - u.x, t.y - u.y) || 1;
  u.act = { k: 'pr', s: 'ladder', phase: 'gather', t0: W.t, b: t.i, rats: rats.map(r => r.i), dx: (t.x - u.x) / d, dy: (t.y - u.y) / d, cn: cn || null, hit: false };
  u.saT = Math.max(u.saT || -9, W.t + 2.6); stop(u);
  rats.forEach(r => { r.rs = { k: 'ladder', until: W.t + 3 }; });
  L(W, { k: 'prLadder', a: u.i, b: t.i, counter: !!cn, vis: prnVis(W, u, t) });
  return true;
}
function prLadderEnd(W, u){ const A = u.act; if (A && A.rats) for (const i of A.rats){ const r = W.units[i]; if (r && r.rs && r.rs.k === 'ladder') ratFree(r); } u.act = null; u.saT = Math.min(u.saT || -9, W.t); }
// 쥐 방패: 동료가 위험 (체력 45% 아래 · 3칸 안에 적) 하거나 포렌이 위험 (50% · 2칸) 하면 — 포렌이 뒤로 뛰어 빠져 6초 지휘 (큰 휘청이면 끊김) ·
//   쥐 (최대 12) 가 적과 지킬 이 사이에 한 줄 (일곱부터 두 줄) 로 서서 온몸으로 막음 — 치지 않고 막기도 아님 · 맞은 충격은 곁의 구성원이 똑같이 나눠 받음
function prShield(W, u){
  const S = PRN(W).shield || {}, x = specOf(u, 'pshield');
  if (!x || W.t < x.cdT || (u.act && u.act.k === 'pr')) return false;
  const rats = prnRats(W, u).filter(r => !ratBusy(r) || (r.rs && r.rs.k === 'wall')); if (!rats.length) return false;
  const near = (o, r) => W.units.some(e => e.alive && !e.gone && e.side !== o.side && dist(e, o) < r);
  let pr = W.units.filter(o => o.alive && !o.gone && o.side === u.side && !o.summon && o !== u && o.hp < o.max * (S.allyHp || 0.45) && near(o, S.allyR || 3)).sort((a, b) => a.hp / a.max - b.hp / b.max)[0];
  if (!pr && u.hp < u.max * (S.selfHp || 0.5) && near(u, S.selfR || 2)) pr = u;
  if (!pr) return false;
  x.cdT = W.t + (S.cd || 16);
  const foe = prnFoes(W, u).sort((a, b) => dist(a, u) - dist(b, u))[0];
  let ax = foe ? u.x - foe.x : -Math.cos(u.face || 0), ay = foe ? u.y - foe.y : -Math.sin(u.face || 0); const al = Math.hypot(ax, ay) || 1; ax /= al; ay /= al;
  let tx = u.x + ax * (S.jump || 2.2), ty = u.y + ay * (S.jump || 2.2); if (boxRock(W, tx, ty, u.r) || tx < 0.7 || ty < 0.7 || tx > W.map.W - 0.7 || ty > W.map.H - 0.7){ tx = u.x; ty = u.y; }
  const use = rats.sort((a, b) => dist(a, pr) - dist(b, pr)).slice(0, S.maxRats || 12);
  if (u.act) interrupt(W, u, '쥐 방패');
  u.act = { k: 'pr', s: 'cmd', phase: 'jump', t0: W.t, sx: u.x, sy: u.y, tx, ty, pr: pr.i, rats: use.map(r => r.i), ex: foe ? foe.x : u.x + Math.cos(u.face || 0), ey: foe ? foe.y : u.y + Math.sin(u.face || 0) };
  stop(u);
  if (pr !== u && !(pr.side === 0 && pr.order)){ const fx = pr.x + (pr.x - u.act.ex) / (Math.hypot(pr.x - u.act.ex, pr.y - u.act.ey) || 1) * 1.6, fy = pr.y + (pr.y - u.act.ey) / (Math.hypot(pr.x - u.act.ex, pr.y - u.act.ey) || 1) * 1.6; if (!boxRock(W, fx, fy, pr.r)) pr.flee = { x: fx, y: fy, until: W.t + 1.1, why: '물러나! (쥐 방패)' }; }
  use.forEach(r => { r.rs = { k: 'shieldWall', until: W.t + (S.dur || 6) + 1.5 }; });
  prSlots(W, u, u.act);
  L(W, { k: 'prShield', a: u.i, b: pr.i, n: use.length, vis: prnVis(W, u) });
  return true;
}
function prSlots(W, u, A){
  const S = PRN(W).shield || {}, P0 = W.units[A.pr] && W.units[A.pr].alive ? W.units[A.pr] : u;
  const F = prnFoes(W, u).filter(e => Math.hypot(e.x - P0.x, e.y - P0.y) < 6); if (F.length){ A.ex = F.reduce((s, e) => s + e.x, 0) / F.length; A.ey = F.reduce((s, e) => s + e.y, 0) / F.length; }
  const dE = Math.hypot(A.ex - P0.x, A.ey - P0.y) || 1, nx = (A.ex - P0.x) / dE, ny = (A.ey - P0.y) / dE, px = -ny, py = nx, lead = Math.min(S.ahead || 1.1, Math.max(0.55, dE * 0.55));
  const rats = A.rats.map(i => W.units[i]).filter(r => r && r.alive && r.rs && r.rs.k === 'shieldWall'), k = rats.length, rows = k > 6 ? 2 : 1, per = Math.ceil(k / rows) || 1, gp = S.gap || 0.55;
  rats.forEach((r, i) => { const row = Math.floor(i / per), col = i % per, cnt = Math.min(per, k - row * per), off = (col - (cnt - 1) / 2) * gp, ah = lead + P0.r + (rows === 2 ? (row ? 0 : 0.5) : 0);
    r.rs.slot = { x: Math.max(0.6, Math.min(W.map.W - 0.6, P0.x + nx * ah + px * off)), y: Math.max(0.6, Math.min(W.map.H - 0.6, P0.y + ny * ah + py * off)) }; r.rs.face = Math.atan2(ny, nx); });
}
function prCmdEnd(W, u, why){
  const A = u.act; if (!A || A.s !== 'cmd') return;
  for (const i of A.rats){ const r = W.units[i]; if (r && r.rs && r.rs.k === 'shieldWall') ratFree(r); }
  u.act = null; L(W, { k: 'prShieldEnd', a: u.i, why: why || '', vis: prnVis(W, u) });
}
// 쥐 포박: 4.5칸 안 가장 위험한 (공격이 가장 센) 적에게 쥐 다섯이 달려들어 매달림 — 매달린 쥐 하나마다 게이지 +22 (최대 100) · 게이지가 남은 동안 움직이지도 치지도 못함
//   대상은 버둥거려 깎음 (무거울수록 빨리 · 보스는 2.5배) · 최대 3초 (3D)
function prBind(W, u, t){
  const B = PRN(W).bind || {}, x = specOf(u, 'pbind'); if (!x || W.t < x.cdT || !t || !t.alive || t.bind) return false;
  const rats = prnRats(W, u).filter(r => !(r.rs && ['fort', 'bind', 'bindRun', 'ladder', 'shieldWall'].includes(r.rs.k)));
  if (rats.length < (B.min || 3)) return false;
  x.cdT = W.t + (B.cd || 12); t.bind = { by: u.i, rats: [], gauge: 0, t0: W.t };
  rats.sort((a, b) => dist(a, t) - dist(b, t)).slice(0, B.rats || 5).forEach(r => { r.rs = { k: 'bindRun', b: t.i, until: W.t + 2.5 }; });
  L(W, { k: 'prBind', a: u.i, b: t.i, vis: prnVis(W, u, t) });
  return true;
}
function bindAttach(W, r, t){
  const B = PRN(W).bind || {}; r.rs = { k: 'bind', b: t.i, until: W.t + (B.dur || 3) + 0.5 }; t.bind.rats.push(r.i); t.bind.gauge = Math.min(B.max || 100, t.bind.gauge + (B.per || 22));
  if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.3, s: '찍!', c: 'g', t0: W.t });
}
function bindTick(W, dt){
  const B = PRN(W).bind || {};
  for (const t of W.units){ const bd = t.bind; if (!bd) continue;
    bd.rats = bd.rats.filter(i => W.units[i] && W.units[i].alive && W.units[i].rs && W.units[i].rs.k === 'bind' && W.units[i].rs.b === t.i);
    const el = W.t - bd.t0, boss = (t.traits || []).includes('보스') || !!t.jrB || !!t.h2;
    if (bd.rats.length) bd.gauge -= (B.drain || 22) * (1 + (t.mass || 70) / 200) * (boss ? B.boss || 2.5 : 1) * dt;
    if (bd.gauge > 0 && t.alive){ t.bound = true; t.stunT = Math.max(t.stunT || -9, W.t + 0.15); if (t.act && (t.act.phase === 'wind' || t.act.phase === 'run') && t.act.k !== 'reload') t.act = null; stop(t); }
    else t.bound = false;
    if (!t.alive || el > (B.dur || 3) || (el > 1.2 && bd.gauge <= 0) || (el > 2.5 && !bd.rats.length)){
      for (const i of bd.rats){ const r = W.units[i]; if (r && r.alive){ ratFree(r); shove(W, t, r, 0.8, r.x - t.x, r.y - t.y, { tag: '뿌리침' }); } }
      if (t.alive && bd.rats.length) L(W, { k: 'prUnbind', a: t.i, n: bd.rats.length, el: +el.toFixed(1), vis: t.side === 0 || !!t.seenBy });
      t.bind = null; t.bound = false; } }
}
// 받는 피해 (porenTake): 쥐 망토 · 방진 (쥐들이 70% 를 나눠 받음) · 쥐 방패 (구성원이 충격을 나눠 받음)
function porenTake(W, a, t, dmg, o){
  if (o && (o.share || o.dot)) return dmg;
  const P = PRN(W);
  if (t.act && t.act.k === 'roll') dmg *= (P.vetRoll || {}).def || 0.6;   // 구르는 동안 (방어 보정)
  if (t.porenKit){
    const C = P.cloak || {}, n = t.cloakN || 0; if (n > 0) dmg *= 1 - Math.min(C.max || 0.16, (C.per || 0.035) * n);
    const A = t.act; if (A && A.k === 'pr' && A.s === 'fort' && dmg > 0){ const F = P.fort || {}, near = A.rats.map(i => W.units[i]).filter(r => r && r.alive && dist(r, t) < (F.near || 1.6));
      if (near.length){ const share = dmg * (F.share || 0.7), each = Math.max(1, Math.round(share / near.length)); for (const r of near){ applyDmg(W, a, r, each, { tag: '쥐 방진 — 포렌 대신 맞음', share: true }); if (!r.alive) A.dead++; } A.absorbed += share; dmg -= share;
        if (W.fxOn) W.fx.push({ k: 'num', x: t.x, y: t.y - 0.5, s: '나눠 받음 ' + Math.round(share) + ' ÷ ' + near.length, c: 'g', t0: W.t }); } }
  } else if (t.rs && t.rs.k === 'shieldWall'){
    const S = P.shield || {}, mem = W.units.filter(r => r !== t && r.alive && !r.gone && r.ratOf === t.ratOf && r.rs && r.rs.k === 'shieldWall' && dist(r, t) < (S.shareR || 2.5));
    if (mem.length){ const part = Math.max(1, Math.round(dmg / (mem.length + 1))); for (const r of mem) applyDmg(W, a, r, part, { tag: '쥐 방패 — 충격을 나눠 받음', share: true }); dmg = part; }
  }
  return dmg;
}
// 도발 (쥐들의 대왕): 3칸 안의 적은 포렌을 먼저 노림 — 보스는 따르지 않음
function tauntOf(W, u, pick, seen){
  if (!pick || u.ratOf != null || u.jrB || (u.traits || []).includes('보스')) return pick;
  let best = null, bd = 1e9; for (const f of seen || []){ if (!f.taunt || !f.alive || f.gone) continue; const d = gap(u, f); if (d <= f.taunt && d < bd){ bd = d; best = f; } }
  return best || pick;
}
// 대검 베기: 앞의 다른 적 하나까지 60% 피해로 베어 넘김
function prnCleave(W, u, t){
  const o = W.units.filter(e => e !== t && e.alive && !e.gone && e.side !== u.side && gap(u, e) <= u.rng + 0.3 && angDiff(Math.atan2(e.y - u.y, e.x - u.x), u.face || 0) < 1.3).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (o) strike(W, u, o, o, 1, false, { mul: u.cleave, tag: '대검 베기 — 베어 넘김' });
}
// 포렌 두뇌 (2D porenUpdate 의 순서 그대로): 쥐 방패 → 위기면 쥐 방진 → 쥐 포박 → 쥐 사다리 (그 밖엔 보통 근접 — 대검으로 막으며 벰)
function porenBrain(W, u, dt){
  if (!u.prn || u.act || u.kb || W.t < (u.stunT || -9) || prone(W, u)) return false;
  const P = PRN(W);
  if (prShield(W, u)) return true;
  if (u.hp < u.max * ((P.fort || {}).lowHp || 0.4) && prFort(W, u, '위기')) return true;
  if (specReady(W, u, 'pbind')){ const B = P.bind || {}, F = prnFoes(W, u).filter(e => !e.bind && dist(u, e) <= (B.range || 4.5) && canSee(W, u, e));
    if (F.length && prBind(W, u, F.reduce((a, b) => (b.atk || 0) > (a.atk || 0) ? b : a))) return true; }
  const t = u.target, Ld = P.ladder || {};
  if (t && t.alive && !t.gone && t.side !== u.side && specReady(W, u, 'pladder')){ const d = dist(u, t);
    if (d >= (Ld.min || 2.5) && d <= (Ld.max || 8) && canSee(W, u, t)){ const rats = prnRats(W, u).filter(r => !(r.rs && ['fort', 'bind', 'bindRun', 'ladder', 'shieldWall'].includes(r.rs.k))).sort((a, b) => dist(a, u) - dist(b, u)).slice(0, Ld.rats || 3);
      if (rats.length >= (Ld.rats || 3) && prLadder(W, u, t, null, rats)) return true; } }
  return false;
}
// 동작 (u.act.k === 'pr')
function prStep(W, u, dt){
  const A = u.act, P = PRN(W);
  if (A.s === 'fort'){ stop(u);
    if (W.t < A.end) return;
    const F = P.fort || {}, rats = A.rats.map(i => W.units[i]).filter(r => r && r.alive), fw = (u.mass || 140) * 4 + rats.filter(r => dist(r, u) < (F.near || 1.6)).reduce((s, r) => s + (r.mass || 10), 0);
    const cn = { mul: (u.atk + A.absorbed * (F.counter || 0.6) + fw * (F.weightK || 0.164)) / Math.max(1, u.atk), crit: W.rand() < (F.crit || 0.25), absorbed: Math.round(A.absorbed), w: Math.round(fw), dead: A.dead };
    for (const r of rats) if (r.rs && r.rs.k === 'fort') ratFree(r);
    u.act = null; u.saT = Math.min(u.saT || -9, W.t);
    if (!prnFoes(W, u).some(e => dist(e, u) < (F.spinR || 1.8) + e.r)){ const Ld = P.ladder || {}, far = prnFoes(W, u).filter(e => dist(e, u) <= (Ld.max || 8) && canSee(W, u, e)).sort((a, b) => (b.atk || 0) - (a.atk || 0))[0];
      if (far && rats.length >= (Ld.rats || 3)){ prLadder(W, u, far, cn, rats.sort((a, b) => dist(a, u) - dist(b, u)).slice(0, Ld.rats || 3)); return; } }
    prSpin(W, u, cn); return;
  }
  if (A.s === 'ladder'){
    const t = W.units[A.b], rats = A.rats.map(i => W.units[i]).filter(r => r && r.alive), Ld = P.ladder || {};
    if (!t || !t.alive || t.gone){ prLadderEnd(W, u); return; }
    if (A.phase === 'gather'){ stop(u); const k = Math.min(1, dt * 10); rats.forEach((r, i) => { r.x += (u.x - (i - 1) * 0.35 * A.dx - r.x) * k; r.y += (u.y - (i - 1) * 0.35 * A.dy - r.y) * k; }); if (W.t - A.t0 >= 0.4){ A.phase = 'ride'; A.t1 = W.t; } return; }
    if (A.phase === 'ride'){ const d = Math.hypot(t.x - u.x, t.y - u.y) || 1, nx = (t.x - u.x) / d, ny = (t.y - u.y) / d, st = Math.min(d, (Ld.speed || 7) * dt), px = u.x + nx * st, py = u.y + ny * st, blk = boxRock(W, px, py, u.r * 0.8);
      if (!blk){ u.x = px; u.y = py; } u.fg = u.face = Math.atan2(ny, nx); stop(u);
      rats.forEach((r, i) => { r.x = u.x - nx * (i - 1) * 0.35; r.y = u.y - ny * (i - 1) * 0.35; });
      if (blk || d < 1.2 + t.r || W.t - A.t1 > 1.6){ A.phase = 'slam'; A.t2 = W.t; } return; }
    if (A.phase === 'slam'){ stop(u);
      if (!A.hit && W.t - A.t2 >= 0.15){ A.hit = true;
        if (A.cn) prSpin(W, u, A.cn);
        else { const hits = prnFoes(W, u).filter(e => Math.hypot(e.x - t.x, e.y - t.y) < (Ld.r || 1.3) + e.r);
          for (const e of hits){ strike(W, u, e, e, 1, false, { mul: Ld.mul || 1.5, tag: '쥐 사다리 — 내려찍기' }); if (e.alive){ if ((e.mass || 70) < (u.mass || 140) * 3) stun(W, e, Ld.stun || 0.5, u.i); shove(W, u, e, 0.6, e.x - u.x, e.y - u.y, { tag: '내려찍기에 밀려남' }); } }
          L(W, { k: 'prSlam', a: u.i, b: t.i, n: hits.length, vis: prnVis(W, u, t) }); if (W.fxOn) W.fx.push({ k: 'quake', x: t.x, y: t.y, r: Ld.r || 1.3, t0: W.t }); } }
      if (W.t - A.t2 >= 0.4) prLadderEnd(W, u); return; }
    return;
  }
  if (A.s === 'cmd'){ const S = P.shield || {};
    if (A.phase === 'jump'){ const k = Math.min(1, (W.t - A.t0) / 0.4), e = 1 - (1 - k) * (1 - k); u.x = A.sx + (A.tx - A.sx) * e; u.y = A.sy + (A.ty - A.sy) * e; stop(u); if (k >= 1){ A.phase = 'hold'; A.t1 = W.t; } return; }
    stop(u); prSlots(W, u, A); u.fg = Math.atan2(A.ey - u.y, A.ex - u.x);
    if (W.t - A.t1 >= (S.dur || 6) || !A.rats.some(i => W.units[i] && W.units[i].alive && W.units[i].rs && W.units[i].rs.k === 'shieldWall')) prCmdEnd(W, u, W.t - A.t1 >= (S.dur || 6) ? '' : '쥐가 모두 쓰러짐');
    return;
  }
  u.act = null;
}
// 쥐 두뇌 (양쪽 같음) — 포렌의 기술로만 움직임 · 명령은 받지 않음
function ratBrain(W, r, dt){
  if (r.order) r.order = null;
  const S = r.rs || (r.rs = { k: 'idle' }), K = W.units[r.ratOf], king = K && K.alive && !K.gone ? K : null, tgt = i => { const t = W.units[i]; return t && t.alive && !t.gone ? t : null; };
  const lead = king || (r.ratKind === 'ratVet' ? null : vetOf(W, r));   // 지휘의 열화 카피: 포렌이 쓰러지면 쥐 베테랑을 따름
  if (r.leaveT != null){ stop(r); if (king) faceTo(r, king); setMood(W, r, '경례'); return true; }   // 싸움 끝 — 경례하고 사라짐 (도감)
  if (S.k !== 'idle' && S.until != null && W.t >= S.until) ratFree(r);
  const s = r.rs;
  if (r.ratKind === 'ratVet' && (s.k === 'idle' || s.k === 'assault') && vetRoll(W, r, s.k === 'assault' ? tgt(s.b) : r.target && r.target.alive && !r.target.gone && r.target.side !== r.side ? r.target : null)) return true;   // 구르기
  if (s.k === 'fort'){ if (!king){ ratFree(r); } else { const a = s.a + W.t * 1.6; setMood(W, r, '쥐 방진 — 대검 둘레'); goTo(W, r, king.x + Math.cos(a) * 1.25, king.y + Math.sin(a) * 1.25, dt); return true; } }
  if (s.k === 'ladder'){ stop(r); setMood(W, r, '쥐 사다리 — 포렌을 태움'); return true; }
  if (s.k === 'bindRun'){ const t = tgt(s.b); if (!t || !t.bind){ ratFree(r); } else { if (dist(r, t) < t.r + r.r + 0.35) bindAttach(W, r, t); else { setMood(W, r, '묶으러', t.i); goTo(W, r, t.x, t.y, dt); } return true; } }
  if (s.k === 'bind'){ const t = tgt(s.b); if (!t || !t.bind){ ratFree(r); } else { const B = t.bind, j = B.rats.indexOf(r.i), a = j / Math.max(1, B.rats.length) * 6.283 + (W.t - B.t0) * 2; r.x = t.x + Math.cos(a) * (t.r + r.r * 0.5); r.y = t.y + Math.sin(a) * (t.r + r.r * 0.5); stop(r); setMood(W, r, '매달림', t.i); return true; } }
  if (s.k === 'shieldWall'){ if (!s.slot){ ratFree(r); } else { if (Math.hypot(s.slot.x - r.x, s.slot.y - r.y) > 0.15){ setMood(W, r, '쥐 방패 — 자리로'); goTo(W, r, s.slot.x, s.slot.y, dt); } else { stop(r); r.fg = s.face; setMood(W, r, '쥐 방패 — 온몸으로 막음'); } return true; } }
  if (s.k === 'wall'){ const g = tgt(s.g), e = tgt(s.a); if (!g || !e){ ratFree(r); } else { const d = dist(g, e) || 1, nx = (e.x - g.x) / d, ny = (e.y - g.y) / d, ah = Math.min(d * 0.6, g.r + r.r + 0.25), off = (s.idx - (s.n - 1) / 2) * 0.5;
      const x = g.x + nx * ah - ny * off, y = g.y + ny * ah + nx * off; if (Math.hypot(x - r.x, y - r.y) > 0.12){ setMood(W, r, '방벽 — ' + g.name + ' 앞으로', e.i); goTo(W, r, x, y, dt); } else { stop(r); r.fg = Math.atan2(ny, nx); setMood(W, r, '방벽', e.i); } return true; } }
  if (s.k === 'assault'){ const t = tgt(s.b); if (!t || !(lead ? markOn(W, lead) : W.t < (s.until || 0))){ ratFree(r); } else { r.target = t; r.state = r.side ? 'hunt' : 'fight'; fight(W, r, t, dt, true, true); return true; } }
  // 쉬는 쥐: 표식이 남아 있으면 합류
  if (lead && markOn(W, lead)){ const t = W.units[lead.ratMark.b]; r.rs = { k: 'assault', b: t.i, until: lead.ratMark.until, a: W.rand() * 6.283 }; r.target = t; fight(W, r, t, dt, true, true); return true; }
  const knight = r.ratKind === 'ratKnight' || r.ratKind === 'ratVet';
  if (!s.tgT || W.t >= s.tgT){ s.tgT = W.t + 0.3 + W.rand() * 0.2; let t = null;
    const anc = !r.ratWild && lead ? lead : r, lim = r.ratWild || !lead ? 16 : 7;
    if (!r.ratWild && lead && lead.target && lead.target.alive && !lead.target.gone && lead.target.side !== r.side && dist(lead, lead.target) <= 7) t = lead.target;
    else t = prnFoes(W, r).filter(e => dist(anc, e) <= lim && (dist(r, e) < 2.5 || canSee(W, r, e) || (r.side === 0 ? !!e.seenBy : false))).sort((a, b) => dist(r, a) - dist(r, b))[0] || null;
    s.tg = t ? t.i : null; }
  const t = s.tg != null ? tgt(s.tg) : null;
  if (t){ if (knight) return false;   // 쥐 기사 · 베테랑: 창 거리 · 방패 · 돌격은 보통 근접 그대로
    if (!r.flee && W.rand() < dt * 0.05){ const d = dist(r, t) || 1, fx = r.x + (r.x - t.x) / d * 2.5, fy = r.y + (r.y - t.y) / d * 2.5; if (!boxRock(W, fx, fy, r.r)) r.flee = { x: fx, y: fy, until: W.t + 0.7, why: '쌩 — 도망쳤다 돌아옴' }; }   // 갑자기 뒤로 쌩
    r.target = t; r.state = r.side ? 'hunt' : 'fight'; fight(W, r, t, dt, true, true); return true; }
  if (!r.ratWild && lead){ if (dist(r, lead) > 2.2){ const a = (r.i * 2.399) % 6.283; setMood(W, r, lead === king ? '포렌을 따름' : '베테랑을 따름'); goTo(W, r, lead.x + Math.cos(a) * 1.4, lead.y + Math.sin(a) * 1.4, dt); } else { stop(r); setMood(W, r, lead === king ? '포렌 곁' : '베테랑 곁'); } return true; }
  if (!s.wp || W.t >= (s.wpT || 0) || Math.hypot(s.wp.x - r.x, s.wp.y - r.y) < 0.5){ const c = lead || r; s.wpT = W.t + 3 + W.rand() * 3; s.wp = null;
    for (let k = 0; k < 8; k++){ const a = W.rand() * 6.283, d = 1.5 + W.rand() * 4.5, x = c.x + Math.cos(a) * d, y = c.y + Math.sin(a) * d; if (x > 0.7 && y > 0.7 && x < W.map.W - 0.7 && y < W.map.H - 0.7 && !boxRock(W, x, y, r.r)){ s.wp = { x, y }; break; } } }
  if (s.wp){ setMood(W, r, '어슬렁'); goTo(W, r, s.wp.x, s.wp.y, dt); } else stop(r);
  return true;
}
// 포렌마다 (매 순간): 충성 · 쥐 망토 · 쥐 표식 · 방벽 · 강공에 방진 · 지휘가 끊김 · 기억하는 쥐
function porenTick(W, dt){
  let any = false;
  for (const u of W.units){ if (!u.porenKit) continue; any = true; prnMemTick(W, u); if (u.gone){ ratsOut(W, u.side, r => r.ratOf === u.i, u.i, '포렌을 따라 나감'); continue; } if (!u.alive) continue; prnUnitTick(W, u, dt); }   // 포렌이 맵을 나가면 쥐도 함께
  if (any) for (const v of W.units){ if (v.ratOf == null || !v.alive || v.gone) continue;
    if (v.leaveT != null && W.t >= v.leaveT){ v.alive = false; v.gone = 'left'; stop(v); continue; }   // 경례 뒤 사라짐
    if (v.ratKind === 'ratVet'){ const K = W.units[v.ratOf]; if (!(K && K.alive && !K.gone)) vetCmd(W, v); } }
  if (any) for (const t of W.units) if (t.bind){ bindTick(W, dt); break; }
  if (any) for (const s of [0, 1, 2]){ if (!W.units.some(r => r.alive && !r.gone && r.side === s && r.ratOf != null)) continue;   // 편에 쥐만 남으면 흩어짐
    if (!W.units.some(o => o.alive && !o.gone && o.side === s && !o.summon)) ratsOut(W, s, () => true, null, '편에 쥐만 남아 흩어짐'); }
}
// 쥐가 한꺼번에 사라짐 (한 줄로 적음)
function ratsOut(W, side, f, by, why){
  const R = W.units.filter(r => r.alive && !r.gone && r.side === side && r.ratOf != null && f(r)); if (!R.length) return;
  for (const r of R){ r.alive = false; r.gone = 'left'; r.act = null; stop(r); }
  L(W, { k: 'ratScatter', a: by != null ? by : R[0].i, n: R.length, why: why || '', vis: side === 0 || R.some(r => !!r.seenBy) });
}
function prnUnitTick(W, u, dt){
  const P = PRN(W); if (!u.prn){ u.prn = { loyal: null, wallCd: -9, settled: false, calmT: null }; prnInit(W, u); }
  const Q = u.prn, rats = prnRats(W, u), on = prnFight(W, u), cap = on ? (P.cap || 24) : Math.min(P.cap || 24, P.idleCap || 4);
  if (!Q.loyal){ const k = prnRoll(W); Q.loyal = { t: 0, next: k, dur: prnFill(W, k) }; }
  Q.full = rats.length >= cap;
  if (!Q.full){ Q.loyal.t += dt * (on ? (rats.length < (P.few || 4) ? P.fewK || 2.5 : 1) : P.idleK || 0.25);
    if (Q.loyal.t >= Q.loyal.dur){ prnRat(W, u, Q.loyal.next); const k = prnRoll(W); Q.loyal = { t: 0, next: k, dur: prnFill(W, k) }; } }
  { const C = P.cloak || {}; u.cloakN = Math.min(Math.round((C.max || 0.16) / (C.per || 0.035)), rats.filter(r => dist(r, u) < (C.r || 1.6)).length); }
  if (u.act && u.act.k === 'atk' && u.act.phase === 'wind'){ const t = W.units[u.act.b]; if (t && t.alive && t.side !== u.side && specReady(W, u, 'pmark')) prnMark(W, u, t, '쳐들어가며'); }
  for (const e of W.units){ const A = e.act; if (!e.alive || e.gone || e.side === u.side || !A || A.phase !== 'wind' || A.b == null) continue;
    if (!(A.k === 'charge' || A.k === 'bash' || A.k === 'h2' || A.k === 'spec' || (A.k === 'atk' && !isFar(e)))) continue;
    const g = W.units[A.b]; if (!g || !g.alive || g.side !== u.side || g.ratOf != null || !prnStrong(W, e)) continue;
    if (g === u){ if (!(u.act && u.act.k === 'pr')) prFort(W, u, '강공'); }   // 포렌 본인: 대검을 꽂고 쥐 방진
    else prnWall(W, u, g, e); }
  if (u.act && u.act.k === 'pr' && u.act.s === 'cmd' && (u.stunT || -9) - W.t >= ((P.shield || {}).bigStun || 0.5)) prCmdEnd(W, u, '지휘 끊김!');
  if (!Q.settled && !prnFoes(W, u).length) prnSettle(W, u);
  else if (Q.settled && prnFoes(W, u).length) Q.settled = false;   // 새 적이 생김 (여정 맵 · 만남) — 다음 싸움 끝에 다시   // 싸움 끝 (적이 모두 쓰러짐) — 판이 끝나기 전 그 순간에
}
// 투창 뒤: 검 (javSide) 이 있으면 그것으로 근접 · 없으면 맨손 — 쥐 베테랑 (도감: 투창 후 검으로 근접전)
function javAfter(W, u){ const sw = u.javSide && (W.rules.weapons || {})[u.javSide]; u.rng = (sw || W.rules.weapons['맨손'] || { rng: 0.3 }).rng + (u.reachX || 0); u.weaponNow = sw ? u.javSide : '맨손'; }
// 지휘의 열화 카피 (쥐 베테랑): 포렌이 쓰러지면 쥐들이 베테랑을 따르고, 베테랑이 치려는 적에게 표식 (덤 쥐 없이 3초 · 대기 18초)
const vetOf = (W, r) => W.units.find(v => v !== r && v.alive && !v.gone && v.ratOf === r.ratOf && v.ratKind === 'ratVet' && v.leaveT == null) || null;
function vetCmd(W, v){
  const C = PRN(W).vetCmd || {}, A = v.act; if (W.t < (v.vcmdCd || -9) || !A || A.k !== 'atk' || A.phase !== 'wind') return;
  const t = W.units[A.b]; if (!t || !t.alive || t.side === v.side) return;
  const rats = W.units.filter(r => r !== v && r.alive && !r.gone && r.ratOf === v.ratOf && r.leaveT == null && !ratBusy(r)); if (!rats.length) return;
  v.vcmdCd = W.t + (C.cd || 18); v.ratMark = { b: t.i, until: W.t + (C.dur || 3) };
  rats.forEach((r, i) => { r.rs = { k: 'assault', b: t.i, until: v.ratMark.until, a: i / rats.length * 6.283 }; });
  L(W, { k: 'ratVetCmd', a: v.i, b: t.i, n: rats.length, vis: v.side === 0 || !!v.seenBy || !!t.seenBy });
  if (W.fxOn) W.fx.push({ k: 'ratmark', b: t.i, t0: W.t, until: v.ratMark.until });
}
// 구르기 (쥐 베테랑 — 민수 메모: 앞뒤 · 방어 보정 · 급소 보호 · 중대형까지 넘어뜨림 / 도감: 진형을 붕괴시키는 구르기)
//   뒤: 나를 노린 근접 일격이 손 안에서 준비 중이면 60% 로 뒤로 굴러 빠짐 · 앞: 1.6 ~ 4.2칸의 적에게 굴러 들어가 닿는 몸을 넘어뜨림 (대형 · 초대형은 밀기만)
const ROLL_BIG = ['대형', '초대형'];
function vetRoll(W, r, t){
  const V = PRN(W).vetRoll || {}; if (W.t < (r.rollCd || -9) || r.act || r.bound || prone(W, r) || W.t < (r.stunT || -9) || r.kb) return false;
  const e = W.units.find(f => f.alive && !f.gone && f.side !== r.side && f.act && f.act.phase === 'wind' && f.act.b === r.i && f.act !== r.rollSeen && !isFar(f) && (f.act.k === 'atk' || f.act.k === 'bash' || f.act.k === 'spec' || f.act.k === 'h2') && gap(f, r) < (f.rng || 0.5) + (W.rules.reach || 0.3) + 0.5 && f.act.end - W.t > 0.1);
  if (e){ r.rollSeen = e.act;
    if (W.rand() < (V.backP != null ? V.backP : 0.6)){ const a0 = Math.atan2(r.y - e.y, r.x - e.x), d = V.bDist || 2.2;
      for (const da of [0, 0.6, -0.6, 1.1, -1.1]){ const x = r.x + Math.cos(a0 + da) * d, y = r.y + Math.sin(a0 + da) * d;
        if (x < 0.7 || y < 0.7 || x > W.map.W - 0.7 || y > W.map.H - 0.7 || boxRock(W, x, y, r.r) || !fatClear(W.map, r.x, r.y, x, y, r.r * 0.7)) continue;
        rollStart(W, r, 'back', x, y, e); return true; } } }
  if (!t || !t.alive || t.gone || t.side === r.side || ROLL_BIG.includes(sizeOf(t))) return false;
  const d = dist(r, t); if (d < (V.fMin || 1.6) || d > (V.fMax || 4.2) || !canSee(W, r, t) || !fatClear(W.map, r.x, r.y, t.x, t.y, r.r * 0.7)) return false;
  const k = Math.min(V.fDist || 3.2, d + 0.2) / d; rollStart(W, r, 'fwd', r.x + (t.x - r.x) * k, r.y + (t.y - r.y) * k, t); return true;
}
function rollStart(W, r, dir, tx, ty, t){
  const V = PRN(W).vetRoll || {}, dur = dir === 'fwd' ? V.fDur || 0.42 : V.bDur || 0.34;
  stop(r); r.act = { k: 'roll', dir, phase: 'run', t0: W.t, end: W.t + dur, sx: r.x, sy: r.y, tx, ty, b: t ? t.i : null, hit: [] };
  r.rollCd = W.t + (V.cd || 6); r.fg = r.face = Math.atan2(ty - r.y, tx - r.x) + (dir === 'back' ? Math.PI : 0);
  L(W, { k: 'ratRoll', a: r.i, b: t ? t.i : null, dir, vis: r.side === 0 || !!r.seenBy || !!(t && t.seenBy) });
  if (W.fxOn) W.fx.push({ k: 'num', x: r.x, y: r.y - 0.3, s: dir === 'fwd' ? '앞구르기!' : '뒷구르기!', c: 'g', t0: W.t });
}
function rollStep(W, r, dt){
  const A = r.act, k = Math.min(1, (W.t - A.t0) / Math.max(0.05, A.end - A.t0)), e = 1 - (1 - k) * (1 - k), nx = A.sx + (A.tx - A.sx) * e, ny = A.sy + (A.ty - A.sy) * e;
  stop(r); let blk = false;
  if (!boxRock(W, nx, ny, r.r * 0.8)){ r.x = nx; r.y = ny; } else blk = true;
  if (A.dir === 'fwd') for (const o of W.units){ if (!o.alive || o.gone || o.side === r.side || A.hit.includes(o.i)) continue; if (Math.hypot(o.x - r.x, o.y - r.y) < o.r + r.r + ((PRN(W).vetRoll || {}).w || 0.35)){ A.hit.push(o.i); rollBump(W, r, o); } }
  if (k >= 1 || blk){ r.act = null; if (A.dir === 'fwd' && A.hit.length) L(W, { k: 'ratRollHit', a: r.i, n: A.hit.length, vis: r.side === 0 || !!r.seenBy }); }
}
function rollBump(W, r, o){
  const V = PRN(W).vetRoll || {}, big = ROLL_BIG.includes(sizeOf(o));
  strike(W, r, o, o, 1, false, { mul: V.mul || 0.5, wk: '둔기', noWound: true, tag: '구르기 — 들이받음' });
  if (!o.alive) return;
  if (!big) knockDown(W, o, V.kd || 1.1, r.i, '쥐 베테랑의 구르기에 발이 걸림');
  shove(W, r, o, big ? 0.3 : V.shove || 0.9, o.x - r.x, o.y - r.y, { tag: '구르기에 밀려남' });
}
// 기억에서 빠짐: 쓰러진 쥐 기사 (포렌이 쓰러져 있어도 셈)
function prnMemTick(W, u){
  if (u.ratMem) for (const r of W.units) if (r.ratOf === u.i && r.ratRec && !r.alive && !r.gone && !r.recGone){ r.recGone = true; const j = u.ratMem.indexOf(r.ratRec); if (j >= 0) u.ratMem.splice(j, 1); L(W, { k: 'ratLost', a: r.i, n: r.ratRec.n, vis: true }); }
}
// 싸움 끝: 살아남은 쥐 기사 — 돌아온 횟수 +1 · 단계 +1 (최대 4) · 세 번 돌아오면 쥐 베테랑 · 경례하고 사라짐 (도감 — 적 포렌의 기사도)
function prnSettle(W, u){
  u.prn.settled = true;
  const ns = [], lv = PRN(W).leave != null ? PRN(W).leave : 1.5;
  for (const r of prnRats(W, u)){ if (r.ratKind !== 'ratKnight' && r.ratKind !== 'ratVet') continue; r.leaveT = W.t + lv; stop(r); r.act = null;
    if (r.ratRec && u.ratMem){ const x = r.ratRec; x.ret = (x.ret || 0) + 1; x.lv = Math.min(4, (x.lv || 1) + 1); if (x.ret >= 3 && !x.vet){ x.vet = true; L(W, { k: 'ratVet', a: r.i, n: x.n, vis: true }); } ns.push(x.n + (x.vet ? '★' : '')); }
    else ns.push(r.name); }
  if (ns.length) L(W, { k: 'ratSalute', a: u.i, ns: ns.join(', '), vis: u.side === 0 || !!u.seenBy });
}
"""
rep("function aimJ(W, u, t){\n  const J = JVu(W, u), f = Math.min(1, Math.max(0, gap(u, t)) / J.rng);\n  let p = J.aimNear + (J.aimFar - J.aimNear) * f;", "function aimJ(W, u, t){\n  const J = JVu(W, u), f = Math.min(1, Math.max(0, gap(u, t)) / J.rng);\n  let p = (J.aimNear + (J.aimFar - J.aimNear) * f) * (u.javK || 1);   /* v8.7.8 투창 솜씨 (쥐 베테랑 — 투창 좋음) */")
rep("if (typeof module !== 'undefined') module.exports = { zapOn,", POREN + "\nif (typeof module !== 'undefined') module.exports = { think, prnRat, ratsOut, vetRoll, rollStep, javAfter, vetCmd, vetOf, prnMemTick, prnMark, prFort, prShield, prLadder, prBind, prSpin, porenTick, porenBrain, ratBrain, porenTake, tauntOf, prnCleave, ratWallHit, bindTick, prnSettle, prnRoll, zapOn,")

for n, s in P.items():
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch8780b OK')
