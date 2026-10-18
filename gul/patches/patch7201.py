# v7.20.1 엔진 — patch7201.py v1.1 (v1.1: 판 시작 때 가방을 bag0 으로 기억 (반영할 때 판 뒤에 들어온 전리품을 살림) · 전리품: 이긴 판의 땅에 떨어진 무기 · 방패 (아군 제 것 · 던진 창 빼고) + 쓰러진 적의 갑옷 · 투구 (망가진 것 빼고, 체급째) + 무기에 남은 화살 · 탄 (따로) — lootOf)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

s = rd('rt3_tail.js')
s = rep(s, "/* ---------- v7.19.1 고유 기술:", r"""// v7.20.1 전리품 (판이 끝나면): 땅의 무기 · 방패 (아군 제 것은 저절로 돌아오니 빼고 · 던진 창 빼고) + 쓰러진 적의 갑옷 · 투구 (망가진 것 빼고 · 그 몸의 체급) + 무기에 남은 화살 · 탄 (따로 묶음)
function lootOf(W){
  if (W.loot) return W.loot;
  const out = [], mine = new Set(W.units.filter(u => u.side === 0).map(ownKey));
  for (const it of W.items || []){ if (it.k !== 'weapon' && it.k !== 'shield') continue; if (it.own && mine.has(it.own)) continue;
    const at = it.k === 'weapon' ? ammoTOf(W, it.name) : null;
    if (at && it.ammo > 0) out.push({ k: 'ammo', at, n: it.ammo, label: (it.label || it.name) + '에 남은 ' + (at === '화살' ? '화살' : at + ' 탄') });
    out.push({ k: it.k, name: it.name, label: it.label || '', dur: it.dur != null ? +it.dur : 100, own: it.own || null, ...(at ? { ammo: 0 } : {}) }); }
  for (const u of W.units){ if (u.side === 0 || u.alive) continue; const nm = String(u.name || '').replace(/\s*\d+$/, ''), sz = sizeOf(u);
    for (const sl of GEAR_SLOTS){ const g = (u.gear || {})[sl]; if (!g || g.innate || (g.dur != null && g.dur <= 0)) continue;
      out.push({ k: sl === '몸' ? 'armor' : 'helm', name: g.name, label: nm + '의 ' + (sl === '몸' ? '갑옷' : '투구'), mat: g.mat, tier: g.tier, dur: g.dur != null ? +g.dur : 100, size: sz, own: ownKey(u) }); } }
  return (W.loot = out);
}
/* ---------- v7.19.1 고유 기술:""")
s = rep(s, "bag: (p.bag || []).filter(it => it && it.k).map((it, k) => ({ ...it, uid: i * 100 + k + 1 })),", "bag: (p.bag || []).filter(it => it && it.k).map((it, k) => ({ ...it, uid: i * 100 + k + 1 })), bag0: JSON.stringify(p.bag || []),")
s = rep(s, "if (typeof module !== 'undefined') module.exports = { ", "if (typeof module !== 'undefined') module.exports = { lootOf, ")
wr('rt3_tail.js', s)
print('patch7201 OK')
