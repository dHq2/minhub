# v7.23.3 엔진 — patch7233.py v1.0 ([갑피] 가 덮은 장비도 남음: 갑피보다 낮은 장비 (세자르의 노인의 왕관) 는 갑피 아래에 씀 (under) — 막는 건 갑피 · 쓰러지면 그 장비가 전리품으로)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
FS = {k: open(D + k + '_v7232.js', encoding='utf-8').read() for k in ('rt3_head', 'rt3_mid', 'rt3_tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in FS.values())
    assert n == c, (n, c, a[:100])
    for k in FS:
        FS[k] = FS[k].replace(a, b)

rep("    if (A['판금'] && (!out['몸'] || out['몸'].tier < tg)) out['몸'] = { name: '갑피', mat: '판금', tier: tg, innate: true };\n    if (A['투구'] && (!out['머리'] || out['머리'].tier < tg)) out['머리'] = { name: '갑피', mat: '투구', tier: tg, innate: true };",
    "    if (A['판금'] && (!out['몸'] || out['몸'].tier < tg)) out['몸'] = { name: '갑피', mat: '판금', tier: tg, innate: true, ...(out['몸'] ? { under: out['몸'] } : {}) };\n    if (A['투구'] && (!out['머리'] || out['머리'].tier < tg)) out['머리'] = { name: '갑피', mat: '투구', tier: tg, innate: true, ...(out['머리'] ? { under: out['머리'] } : {}) };   /* v7.23.3 덮인 장비는 under 로 남음 (쓰러지면 전리품) */")
rep("    for (const sl of GEAR_SLOTS){ const g = (u.gear || {})[sl]; if (!g || g.innate || (g.dur != null && g.dur <= 0)) continue;",
    "    for (const sl of GEAR_SLOTS){ const g0 = (u.gear || {})[sl], g = g0 && g0.innate ? g0.under : g0; if (!g || g.innate || (g.dur != null && g.dur <= 0)) continue;   /* v7.23.3 갑피 아래의 장비도 */")
for k, v in FS.items():
    open(D + k + '.js', 'w', encoding='utf-8').write(v)
print('ok')
