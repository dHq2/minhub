# v9.14.1 페이지 — page9390.py v1.0 (v1.0: 설계의 방패 크기 (shSize) 가 판으로 넘어가게 (암계 방패병 대형 방패) · 암계 장비 그림 (도감 그림 6장) 을 아이템 아이콘으로 — 이름 끝이 맞으면 ('방패병의 암계 장검') 그림 · 암계 병사가 든 무기 · 방패도 장비 칸에 그림 · 땅에 떨어진 무기 · 방패도 판 위에 그림 · 그림 미리 불러옴)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9380.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.14.0 (2026-10-29)', '<!-- 굴의 전투판 v9.14.1 (2026-10-29)')
rep('     v9.14.0: 시간 표기', '''     v9.14.1: 암계 장비 그림 (도감 6장 — 장검 · 장궁 · 탑 방패 · 연형 방패 · 흉갑 · 투구) = 아이템 아이콘 — 전리품 · 가방 · 장비 칸 · 상세 · 땅에 떨어진 무기 모두 (암계 병사가 든 무기 · 방패도) · 아티팩트에 그림이 빠져 있던 것도 올림
     v9.14.0: 시간 표기''')
for a, b in (('h1::after{content:" v9.14.0"', 'h1::after{content:" v9.14.1"'), ('<footer>굴의 전투판 v9.14.0', '<footer>굴의 전투판 v9.14.1'), ('return `굴의 전투판 v9.14.0 · ${title}', 'return `굴의 전투판 v9.14.1 · ${title}'),
             ("copyText('굴의 전투판 v9.14.0 자동 판 기록", "copyText('굴의 전투판 v9.14.1 자동 판 기록"), ("o.push(`굴의 전투판 v9.14.0 — ${C.run", "o.push(`굴의 전투판 v9.14.1 — ${C.run"),
             ('의 버전 기록에 — v9.14.0 현실 초', '의 버전 기록에 — v9.14.1 암계 장비 그림 / v9.14.0 현실 초'),
             ('">v9.14.0 현실 초 표기', '">v9.14.1 암계 장비 아이콘 · v9.14.0 현실 초 표기')):
    rep(a, b)
# 아이콘 열쇠: 그림 이름 (art) · 이름 · 이름표가 딱 맞거나, 이름표 끝이 맞으면 ('방패병의 암계 장검' · '암계 투구 (고급)')
rep("const itIc = (it, d0) => { const a = it && (it.art || EQART9[it.name] || EQART9[it.label]);",
    """const EQK9 = Object.keys(EQART9).sort((a, b) => b.length - a.length);
const artKey = it => !it ? null : it.art || EQART9[it.name] || EQART9[it.label] || (() => { for (const t of [it.label, it.name]) if (t) for (const k of EQK9) if (t.includes(k)) return EQART9[k]; return null; })();   /* v9.14.1 */
const EQIMG9 = {}; function eqImg(a){ if (!a) return null; let im = EQIMG9[a]; if (!im){ im = EQIMG9[a] = new Image(); im.onload = () => { im.ok = 1; }; im.src = `art/abyss/${a}.webp`; } return im.ok ? im : null; }
for (const a of new Set(Object.values(EQART9))) eqImg(a);   /* 판 위에 그릴 수 있게 미리 불러옴 */
const itIc = (it, d0) => { const a = artKey(it);""")
rep("(it.art || EQART9[it.name] ? itIc(it) : INV_IC[it.k])", "(artKey(it) ? itIc(it) : INV_IC[it.k])")
# 암계 병사가 든 무기 · 방패도 장비 칸에서 그림 (전엔 주워야만)
rep("    return { k: 'weapon', name: u.weapon, label: u.wName || u.weapon, dur: u.wDur, own: u.wOwn, ammo: u.ammo, ammoMax: u.ammoMax, foreign: u.wForeign }; }",
    "    { const ab = u.origin === '암계' && !u.wName ? ABYSS_ART.weapon[u.weapon] : null; return { k: 'weapon', name: u.weapon, label: ab ? ab[0] : u.wName || u.weapon, ...(ab ? { art: ab[1] } : {}), dur: u.wDur, own: u.wOwn, ammo: u.ammo, ammoMax: u.ammoMax, foreign: u.wForeign }; } }   /* v9.14.1 암계 무기 그림 */")
rep("return u.shield ? { k: 'shield', name: '방패', label: u.sName || '방패', dur: u.sDur, own: u.sOwn } : null; }",
    "{ const ab = u.shield && u.origin === '암계' && !u.sName ? ABYSS_ART.shield[u.shSize || '중형'] : null; return u.shield ? { k: 'shield', name: '방패', label: ab ? ab[0] : u.sName || '방패', ...(ab ? { art: ab[1] } : {}), dur: u.sDur, own: u.sOwn } : null; } }")
# 땅에 떨어진 무기 · 방패: 그림이 있으면 받침 위에 그림 (비율 그대로)
rep("ctx.fillStyle = '#fff'; ctx.fillText(itemIcon(Wd, it), p.x, p.y + 1);",
    "ctx.fillStyle = '#fff'; { const im = eqImg(artKey(it) || ((typeof abyssTag === 'function' ? abyssTag(Wd, it, o) : null) || {}).art); if (im){ const s0 = rr * 1.6, k0 = s0 / Math.max(im.width, im.height), w0 = im.width * k0, h0 = im.height * k0; ctx.drawImage(im, p.x - w0 / 2, p.y - h0 / 2, w0, h0); } else ctx.fillText(itemIcon(Wd, it), p.x, p.y + 1); }   /* v9.14.1 암계 장비 그림 */")
# 설계의 방패 크기 (shSize) 가 판으로 넘어가지 않았음 (DKEEP 에 없음 — v9.2.0 부터 암계 방패병의 대형 방패가 중형으로 싸움)
rep("const DKEEP = ['rMul', 'sName',", "const DKEEP = ['rMul', 'shSize', 'sName',")
open(F, 'w', encoding='utf-8').write(s)
print('page9390 OK')
