# v7.27.0 엔진 — patch7270.py v1.0 (더미 종류 4 = 잔해 (쓰러진 기둥 · 돌무더기 — 세자르의 알현실): 못 지나가는 낮은 엄폐 1.0M · 엄폐에 막힌 탄의 글 (잔해 · 관))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def load(n): return open(D + 'rt3_%s_v7261.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)

H = rep(H, "pileH: { 갑옷: 1.1, 시체: 0.6, 관: 0.9 }", "pileH: { 갑옷: 1.1, 시체: 0.6, 관: 0.9, 잔해: 1 }")   # v7.27.0
M = rep(M, "const PILE_NM = { 1: '갑옷', 2: '시체', 3: '관' };   /* v7.23.1 관 (5S 알현실) */",
        "const PILE_NM = { 1: '갑옷', 2: '시체', 3: '관', 4: '잔해' };   /* v7.23.1 관 (5S 알현실) · v7.27.0 잔해 (쓰러진 기둥 · 돌무더기) */")
T = rep(T, "why: s.cov.pile ? (s.cov.pile === 2 ? '굳은 시체에 막힘 (엄폐)' : '갑옷 무더기에 막힘 (엄폐)') : '언덕 마루에 막힘'",
        "why: s.cov.pile ? (s.cov.pile === 2 ? '굳은 시체에 막힘 (엄폐)' : s.cov.pile === 3 ? '관에 막힘 (엄폐)' : s.cov.pile === 4 ? '쓰러진 기둥에 막힘 (엄폐)' : '갑옷 무더기에 막힘 (엄폐)') : '언덕 마루에 막힘'")   # v7.27.0
for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch7270 OK')
