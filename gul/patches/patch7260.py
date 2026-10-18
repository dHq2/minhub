# v7.26.0 엔진 — patch7260.py v1.0 (축복 (bless): 특성마다 공격 배수 · 회피 더함 — <축복:오딜> 공격 × 1.1 · 회피 +10%p (도감의 '공격력 +100 · 회피율 +10%' 를 이 판의 크기로) /
#   차 · 약마다 회복량 (it.heal · min · cap) — 오딜의 차는 회복약보다 적게)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def load(n): return open(D + 'rt3_%s_v7253.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)
H = rep(H, "  potion: { heal: 0.3,", "  bless: { '축복:오딜': { atk: 1.1, ev: 0.1 } },   /* v7.26.0 축복: 공격 배수 · 회피 더함 (특성 이름마다) */\n  potion: { heal: 0.3,")
T = rep(T, "atk: s.atk, spd: s.spd", "atk: Math.round(s.atk * blessOf(rules, tr).atk), blessEv: blessOf(rules, tr).ev, spd: s.spd")   # v7.26.0
T = rep(T, "function evadeP(W, u, a, kind, s){\n", "// v7.26.0 축복: 지닌 특성마다 공격 × atk · 회피 + ev\nconst blessOf = (R, tr) => (tr || []).reduce((o, t) => { const b = ((R || {}).bless || {})[t]; if (b){ o.atk *= b.atk || 1; o.ev += b.ev || 0; } return o; }, { atk: 1, ev: 0 });\nfunction evadeP(W, u, a, kind, s){\n")
T = rep(T, "  return Math.min(E.cap || 0.75, p);", "  if (u.blessEv) p += u.blessEv * sense;   /* v7.26.0 축복 */\n  return Math.min(E.cap || 0.75, p);")
T = rep(T, "u.bag.splice(k, 1); const P = W.rules.potion || {}, amt", "u.bag.splice(k, 1); const P = it.heal != null ? { heal: it.heal, min: it.min != null ? it.min : 0, cap: it.cap != null ? it.cap : 999 } : W.rules.potion || {}, amt")   # v7.26.0 차 · 약마다
for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch7260 OK')
