# v9.5.1 엔진 — patch9070.py v1.1 (v1.1: '방패병의 장검' 처럼 주인 이름이 붙은 이름표는 끝의 장비 이름만 바꿈 (방패병의 암계 장검) · v1.0: 암계 장비 드랍 그림 (명세 A11) — 암계 병사의 무기 · 방패 · 갑옷 · 투구가 전리품이 될 때 도감 그림 (art/abyss/eq_*.webp) 이름표 (art) 를 달고 이름도 암계 장비로: 장검 → 암계 장검 · 활 → 암계 장궁 · 대형 방패 → 암계 탑 방패 · 중형 방패 → 암계 연형 방패 · 암계 흉갑 · 암계 투구)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9060.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
rep("      hitKb: +p.hitKb || 0,", "      origin: p.origin || null, hitKb: +p.hitKb || 0,")   # v9.5.1 출신 (암계 장비 드랍)
rep("function lootOf(W){", """// v9.5.1 암계 장비 (명세 A11): 암계 병사의 무구 · 갑옷은 도감 그림 이름표 (art) 와 암계 이름으로
const ABYSS_ART = { weapon: { '장검': ['암계 장검', 'eq_sword'], '활': ['암계 장궁', 'eq_bow'] }, shield: { '대형': ['암계 탑 방패', 'eq_tower'], '중형': ['암계 연형 방패', 'eq_kite'] }, gear: { '암계 흉갑': 'eq_chest', '암계 투구': 'eq_helm' } };
function abyssLabel(it, ab){ const L = it.label || ''; return L && L.endsWith(it.name) ? L.slice(0, L.length - it.name.length) + ab.label : L ? L : ab.label; }   // '방패병의 장검' → '방패병의 암계 장검'
function abyssTag(W, it, ow){
  if (!ow || ow.origin !== '암계') return null;
  if (it.k === 'weapon'){ const x = ABYSS_ART.weapon[it.name]; return x ? { label: x[0], art: x[1] } : null; }
  if (it.k === 'shield'){ const x = ABYSS_ART.shield[ow.shSize || '중형']; return x ? { label: x[0], art: x[1] } : null; }
  return null;
}
function lootOf(W){""")
rep("    put('g' + it.id, { k: it.k, name: it.name, label: it.label || '', dur:", "    const ab = abyssTag(W, it, W.units[it.owner]);   /* v9.5.1 */\n    put('g' + it.id, { k: it.k, name: it.name, label: ab ? abyssLabel(it, ab) : it.label || '', ...(ab ? { art: ab.art } : {}), dur:")
rep("      put(rk, { k: sl === '몸' ? 'armor' : 'helm', name: g.name,", "      put(rk, { k: sl === '몸' ? 'armor' : 'helm', name: g.name, ...(ABYSS_ART.gear[g.name] ? { art: ABYSS_ART.gear[g.name] } : {}),")
rep("module.exports = { vialSync,", "module.exports = { abyssTag, ABYSS_ART, vialSync,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9070 OK')
