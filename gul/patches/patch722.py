# v7.22.0 엔진 — patch722.py v1.1 (v1.1: 시험용 내보내기 (addUnit · unitInit · wetAt · stealthOf0 · spdNow) · 5단계 인카운터 바탕: 판 도중에 유닛을 넣음 (addUnit — createWorld 의 유닛 만들기를 unitInit 으로 떼어 같이 씀 · 규칙은 양쪽이 같음) · 얕은 물 (setup.water 타원 — 걸음 × terrain.water, 양쪽 같음) · 두건 (친칠라의 후드: 막는 힘 없음 · 쓰면 숨는 솜씨가 적어도 B) · 전리품 이름 (이미 'X의 Y' 면 그대로))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
# 두건: 막는 힘 없음 (vs 모두 1 · 관통 판정 0) · 무게 없음 · stl = 쓰면 숨는 솜씨가 적어도 이 등급
h = rep(h, "    '투구': { slot: '머리', w: 0.004, vs: { '날붙이': 0.5, '둔기': 0.85, '짐승': 0.6, '활': 0.45, '총포류': 0.6, '마법': 1, '맨손': 0.7 } },   // 헤드샷 · 날붙이에 강하고 둔기에 약함",
    "    '투구': { slot: '머리', w: 0.004, vs: { '날붙이': 0.5, '둔기': 0.85, '짐승': 0.6, '활': 0.45, '총포류': 0.6, '마법': 1, '맨손': 0.7 } },   // 헤드샷 · 날붙이에 강하고 둔기에 약함\n    '두건': { slot: '머리', w: 0, vs: { '날붙이': 1, '둔기': 1, '짐승': 1, '활': 1, '총포류': 1, '마법': 1, '맨손': 1 }, stl: 'B' },   // v7.22 천 두건 (친칠라의 후드) — 막지는 못하고 쓰면 숨는 솜씨가 적어도 B")
h = rep(h, "'방탄': [100, 55], '투구': [90, 90] },", "'방탄': [100, 55], '투구': [90, 90], '두건': [0, 0] },")
h = rep(h, "climb: 0.8, down: 0.1, tripS: 0.3, trip: 0.12, tripT: 0.8 },", "climb: 0.8, down: 0.1, tripS: 0.3, trip: 0.12, tripT: 0.8, water: 0.7 },   /* v7.22 water = 얕은 물 속 걸음 × (양쪽 같음) */")
wr('rt3_head.js', h)

m = rd('rt3_mid.js')
m = rep(m, "  m.hills = hills.length ? hills : null; m.pk = null; m.piles = 0;",
    "  m.hills = hills.length ? hills : null; m.pk = null; m.piles = 0;\n  { const Wt = (setup.water || []).filter(w => w && isFinite(+w.x) && isFinite(+w.y)).map(w => ({ x: +w.x, y: +w.y, rx: Math.max(0.5, +w.rx || 3), ry: Math.max(0.5, +w.ry || 2) })); m.water = Wt.length ? Wt : null; }   // v7.22 얕은 물 (타원)")
wr('rt3_mid.js', m)

s = rd('rt3_tail.js')
# ---------- unitInit 로 떼어냄 ----------
a = s.index("  setup.units.forEach((p, i) => {\n    const s = statsOf(p, rules),")
b = s.index("\n  });\n  let k = 0; for (const u of W.units) if (u.side === 0 && !u.hero) u.slot = k++;", a)
body = s[a + len("  setup.units.forEach((p, i) => {\n"):b]
import re
assert not re.search(r'\bsetup\b|\bopt\b|\bseed\b|(?<![.\w])map\b', body), 'body uses setup/opt/seed/map'
s = s[:a] + "  setup.units.forEach((p, i) => unitInit(W, p, i));   // v7.22 유닛 만들기는 unitInit (판 도중에 넣는 addUnit 과 같이 씀)" + s[b + len("\n  });"):]
s = rep(s, "function createWorld(setup, rules, seed, opt){", "// v7.22 유닛 하나 만들기 (createWorld · addUnit 이 같이 씀)\nfunction unitInit(W, p, i){ const rules = W.rules;\n" + body + "\n}\nfunction createWorld(setup, rules, seed, opt){")
s = rep(s, "function markExplored(W){", r"""// v7.22 판 도중에 유닛을 넣음 (만남 인물이 동료 · 적이 될 때) — createWorld 와 같은 만들기 · 같은 규칙. 적이 새로 생기면 '끝난 맵' 은 다시 싸움 중
function addUnit(W, p){
  const i = W.units.length; unitInit(W, p, i); const u = W.units[i], rules = W.rules;
  if (u.side === 0 && !u.hero) u.slot = W.units.reduce((k, o) => o !== u && o.side === 0 && !o.hero ? Math.max(k, (o.slot || 0) + 1) : k, 0);
  if (u.blindL && !u.eyeLost){ const M = rules.maim || {}; u.eyeLost = 1; u.sightMul = 1 - (1 - (M.oneEye != null ? M.oneEye : 0.75)) * 2 / u.eyes; u.eyeAim = 1 - (1 - (M.oneEyeAim != null ? M.oneEyeAim : 0.85)) * 2 / u.eyes; maimAim(u); }
  if (u.h >= 2.2 && W.giants) W.giants.push(u);
  u.stealthE = stealthOf(W, u); u.assnE = assnSkill(W, u);
  if (u.side === 1){ u.seenBy = W.units.some(a => a.alive && a.side === 0 && canSee(W, a, u)); u.visLog = u.seenBy; u.visPend = null; if (W.camp) W.cleared = false; }
  W.loot = null; L(W, { k: 'unitAdd', a: i, side: u.side, vis: true });
  return u;
}
function markExplored(W){""")
# ---------- 얕은 물: 걸음 × ----------
s = rep(s, "const spdNow = (W, u) => spdNow0(W, u) * (u.lie && !u.lieSw ? (W.rules.lie || {}).spd || 0.25 : 1) * (W.t < (u.lungeT == null ? -9 : u.lungeT) ? u.lungeK || 1 : 1);",
    "const wetAt = (m, x, y) => !!m.water && m.water.some(w => ((x - w.x) / w.rx) ** 2 + ((y - w.y) / w.ry) ** 2 <= 1);   // v7.22 얕은 물 속인가\nconst spdNow = (W, u) => spdNow0(W, u) * (u.lie && !u.lieSw ? (W.rules.lie || {}).spd || 0.25 : 1) * (W.t < (u.lungeT == null ? -9 : u.lungeT) ? u.lungeK || 1 : 1) * (W.map.water && wetAt(W.map, u.x, u.y) ? (TER(W).water != null ? TER(W).water : 0.7) : 1);   // v7.22 얕은 물")
# ---------- 두건: 숨는 솜씨 바닥 ----------
s = rep(s, "function stealthOf(W, u){ const tg = (u.traits || []).find(", "function stealthOf0(W, u){ const tg = (u.traits || []).find(")
s = rep(s, "/* ---------- v7.11 포복 (엎드림) ----------", "// v7.22 두건 (armor[mat].stl): 쓰면 숨는 솜씨가 적어도 그 등급 — 원래 더 좋으면 그대로 · 망가지면 없음\nfunction stealthOf(W, u){ const e = stealthOf0(W, u), hd = (u.gear || {})['머리'], A = hd && (W.rules.armor || {})[hd.mat], g = A && A.stl, G = (W.rules.grades || {})['은신'] || {}; return g && G[g] != null && !(hd.dur != null && hd.dur <= 0) ? Math.max(e, G[g]) : e; }\n/* ---------- v7.11 포복 (엎드림) ----------")
# ---------- 전리품 이름 ----------
s = rep(s, "label: nm + '의 ' + (sl === '몸' ? '갑옷' : '투구'), mat: g.mat,", "label: / ?의 /.test(g.name || '') ? g.name : nm + '의 ' + (sl === '몸' ? '갑옷' : g.mat === '두건' ? '두건' : '투구'), mat: g.mat,")   # v7.22 '친칠라의 후드' 처럼 이름이 있으면 그대로
s = rep(s, "if (typeof module !== 'undefined') module.exports = { walkClear,", "if (typeof module !== 'undefined') module.exports = { addUnit, unitInit, wetAt, stealthOf0, spdNow, spdNow0, walkClear,")   # v7.22 시험용
wr('rt3_tail.js', s)
print('patch722 OK')
