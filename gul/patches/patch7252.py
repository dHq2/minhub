# v7.25.2 엔진 — patch7252.py v1.1 (v1.1: 이름 붙은 고유 장비 (노인의 왕관 같은 것) · [보스] 의 장비는 늘 · 멀쩡히 · 전리품: 무구 (무기 · 방패) 는 모두 — 쓰러진 적의 가방 무기 · 두 번째 총도 / 방어구 (갑옷 · 투구) 는 낮은 확률 (벗기기 힘듦) · 나와도 대개 망가져 있음 (내구 15 ~ 60))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def load(n): return open(D + 'rt3_%s_v7251.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)
H = rep(H, "  inv: { cap:", "  loot: { armorP: 0.25, helmP: 0.3, worn: [15, 60] },   /* v7.25.2 전리품: 방어구는 낮은 확률 · 대개 망가짐 (내구 범위) */\n  inv: { cap:")
T = rep(T, "  for (const u of W.units){ if (u.side === 0 || u.alive) continue; const nm = String(u.name || '').replace(/\\s*\\d+$/, ''), sz = sizeOf(u);\n    for (const sl of GEAR_SLOTS){ const g0 = (u.gear || {})[sl], g = g0 && g0.innate ? g0.under : g0; if (!g || g.innate || (g.dur != null && g.dur <= 0)) continue;   /* v7.23.3 갑피 아래의 장비도 */\n      out.push({ k: sl === '몸' ? 'armor' : 'helm', name: g.name, label: / ?의 /.test(g.name || '') ? g.name : nm + '의 ' + (sl === '몸' ? '갑옷' : g.mat === '두건' ? '두건' : '투구'), mat: g.mat, tier: g.tier, dur: g.dur != null ? +g.dur : 100, size: sz, own: ownKey(u) }); } }",
           "  const LR = W.rules.loot || {}, wr = LR.worn || [15, 60];\n"
           "  for (const u of W.units){ if (u.side === 0 || u.alive) continue; const nm = String(u.name || '').replace(/\\s*\\d+$/, ''), sz = sizeOf(u);\n"
           "    for (const x of u.bag || []) if (x.k === 'weapon' || x.k === 'shield'){ const { uid, ...o } = x; out.push({ ...o, label: o.label || (x.k === 'weapon' ? nm + '의 ' + o.name : nm + '의 방패'), dur: o.dur != null ? +o.dur : 100, own: o.own || ownKey(u) }); }   /* v7.25.2 무구는 모두: 가방의 무기 · 방패 */\n"
           "    if (u.alt && u.alt.name){ const at = ammoTOf(W, u.alt.name); if (at && u.alt.ammo > 0) out.push({ k: 'ammo', at, n: u.alt.ammo, label: nm + '의 ' + u.alt.name + '에 남은 ' + at + ' 탄' }); out.push({ k: 'weapon', name: u.alt.name, label: nm + '의 ' + u.alt.name, dur: 100, own: ownKey(u), ...(at ? { ammo: 0 } : {}) }); }   /* 두 번째 총 */\n"
           "    for (const sl of GEAR_SLOTS){ const g0 = (u.gear || {})[sl], g = g0 && g0.innate ? g0.under : g0; if (!g || g.innate || (g.dur != null && g.dur <= 0)) continue;   /* v7.23.3 갑피 아래의 장비도 */\n"
           "      const uq = / ?의 /.test(g.name || '') || (u.traits || []).includes('보스');   /* v7.25.2 이름 붙은 고유 장비 · [보스] 의 것은 늘 · 멀쩡히 */\n"
           "      if (!uq && W.rand() >= (sl === '몸' ? (LR.armorP != null ? LR.armorP : 0.25) : (LR.helmP != null ? LR.helmP : 0.3))) continue;   /* v7.25.2 방어구는 낮은 확률 (망가지고 벗기기 힘듦) */\n"
           "      const d0 = g.dur != null ? +g.dur : 100, dw = uq ? d0 : Math.min(d0, Math.round(wr[0] + W.rand() * (wr[1] - wr[0])));\n"
           "      out.push({ k: sl === '몸' ? 'armor' : 'helm', name: g.name, label: / ?의 /.test(g.name || '') ? g.name : nm + '의 ' + (sl === '몸' ? '갑옷' : g.mat === '두건' ? '두건' : '투구'), mat: g.mat, tier: g.tier, dur: dw, ...(uq ? {} : { worn: true }), size: sz, own: ownKey(u) }); } }")
for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch7252 OK')
