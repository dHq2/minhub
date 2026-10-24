# v9.5.1 페이지 — page9070.py v1.0 (v1.0: 암계 장비 드랍 그림 (명세 A11) — 전리품 · 가방 · 장비 칸에서 이모지 대신 도감 그림 (art 이름표 · 또는 이름이 암계 흉갑 · 투구) )
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9060.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.5.0 (2026-10-24)', '<!-- 굴의 전투판 v9.5.1 (2026-10-24)')
rep('     v9.5.0: 2층 대규모 업데이트 6단계', '''     v9.5.1: 암계 장비 드랍 그림 (명세 A11) — 암계 병사의 무기 · 방패 · 갑옷 · 투구가 전리품이 되면 도감 그림 (art/abyss/eq_*.webp) 과 암계 이름 (암계 장검 · 장궁 · 탑 방패 · 연형 방패 · 흉갑 · 투구) 으로 — 전리품 · 가방 · 장비 칸 모두 이모지 대신 그림
     v9.5.0: 2층 대규모 업데이트 6단계''')
for a, b in (('h1::after{content:" v9.5.0"', 'h1::after{content:" v9.5.1"'), ('<footer>굴의 전투판 v9.5.0', '<footer>굴의 전투판 v9.5.1'), ('return `굴의 전투판 v9.5.0 · ${title}', 'return `굴의 전투판 v9.5.1 · ${title}'),
             ("copyText('굴의 전투판 v9.5.0 자동 판 기록", "copyText('굴의 전투판 v9.5.1 자동 판 기록"), ("o.push(`굴의 전투판 v9.5.0 — ${C.run", "o.push(`굴의 전투판 v9.5.1 — ${C.run"),
             ('의 버전 기록에 — v9.5.0 심계 제3세력', '의 버전 기록에 — v9.5.1 암계 장비 그림 / v9.5.0 심계 제3세력'),
             ('">v9.5.0 · 심계 제3세력 (헌팅나이프 · 카밀라) · 망자 맵</span>', '">v9.5.1 · 암계 장비 그림 · 심계 제3세력 · 망자 맵</span>'),
             ("ver: '9.5.0', kind:", "ver: '9.5.1', kind:"), ("RULES_MIG = '9.5.0',", "RULES_MIG = '9.5.1',")):
    rep(a, b)
rep("const INV_IC = { weapon: '🗡', shield: '🛡', armor: '🥋', helm: '⛑', ammo: '➶', potion: '🧪' };",
    """const INV_IC = { weapon: '🗡', shield: '🛡', armor: '🥋', helm: '⛑', ammo: '➶', potion: '🧪' };
const EQART9 = { '암계 흉갑': 'eq_chest', '암계 투구': 'eq_helm', '암계 장검': 'eq_sword', '암계 장궁': 'eq_bow', '암계 탑 방패': 'eq_tower', '암계 연형 방패': 'eq_kite' };   /* v9.5.1 암계 장비 그림 (도감) */
const itIc = (it, d0) => { const a = it && (it.art || EQART9[it.name] || EQART9[it.label]); return a ? `<img class="eqimg" src="art/abyss/${a}.webp" alt="" loading="lazy">` : (it && INV_IC[it.k]) || (d0 != null ? d0 : '·'); };""")
rep("INV_IC[it.k] || '·'", "itIc(it)", 6)
rep("INV_IC[it.k] || ''", "itIc(it, '')")
rep("INV_IC[it.k] || (it.k === 'nat' ?", "(it.art || EQART9[it.name] ? itIc(it) : INV_IC[it.k]) || (it.k === 'nat' ?")
rep("INV_IC[o.it.k] || '·'", "itIc(o.it)")
rep("INV_IC[x.k] || '·'", "itIc(x)")
rep(".eqs small{", ".eqimg{width:1.7em;height:1.7em;object-fit:contain;vertical-align:-0.45em;filter:drop-shadow(0 1px 1px rgba(0,0,0,.45))} .eqc b .eqimg,.l8r .lic .eqimg{width:1.9em;height:1.9em;vertical-align:middle}\n.eqs small{") if '.eqs small{' in s else None
open(F, 'w', encoding='utf-8').write(s)
print('page9070 OK')
