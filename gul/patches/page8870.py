# v8.8.7 페이지 — page8870.py v1.0 (v1.0: 2층 맵 — 무너진 유적 (입구 · 계단 · 회랑/방) · 아무것도 놓지 않은 맵 (bare) · 1층이 끝나면 2층으로)
import subprocess, re
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8860.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v8.8.6 (2026-10-23)', '<!-- 굴의 전투판 v8.8.7 (2026-10-23)')
rep('     v8.8.6: 영거리 사격 (', '''     v8.8.7: 2층 맵 (민수 — "2층이 추가될 것임 … 1. 처음에 들어가면 약간 어둡고 계단이 있는 유적 2. 상층으로 향하는 계단과 공간 3. 회랑이나 방으로 쓸 것 · 랜덤 맵 … 일단 아무것도 없이 만들기만 해놔 … 1층 끝나면 2층으로 가게"):
         2층 = 무너진 유적 (임시 이름): 입구 유적 (어둡게) → 계단 · 위층 → 회랑 · 방 (방 · 회랑 · 둘 이은 것 중 무작위) → 아래 계단. 모두 지나가기 (싸움 · 소품 · 만남 없음 — 나중에 채움). 그림은 민수가 그린 붉은 동그라미 (사람 크기) 에 맞춰 한 칸 = 사람 몸 ≒ 0.65 ~ 0.75 칸이 되게 칸을 키움 (입구 15 × 10 · 계단 18 × 12 · 회랑과 방 18 × 12 — 다른 맵은 칸이 훨씬 잘아 사람이 작게 보임). 칸 수는 d5/poly/*.json 의 nx 로 바꿔 다시 뽑을 수 있음.
     v8.8.6: 영거리 사격 (''')
for a, b in (('h1::after{content:" v8.8.6"', 'h1::after{content:" v8.8.7"'), ('<footer>굴의 전투판 v8.8.6', '<footer>굴의 전투판 v8.8.7'), ('return `굴의 전투판 v8.8.6 · ${title}', 'return `굴의 전투판 v8.8.7 · ${title}'),
             ("copyText('굴의 전투판 v8.8.6 자동 판 기록", "copyText('굴의 전투판 v8.8.7 자동 판 기록"), ("o.push(`굴의 전투판 v8.8.6 — ${C.run", "o.push(`굴의 전투판 v8.8.7 — ${C.run"),
             ('의 버전 기록에 — v8.8.6 영거리 사격 /', '의 버전 기록에 — v8.8.7 2층 맵 / v8.8.6 영거리 사격 /'),
             ('">v8.8.6 · 영거리 사격 (총 · 활 코앞 관통)</span>', '">v8.8.7 · 2층 맵 (무너진 유적)</span>'),
             ("ver: '8.8.6', kind:", "ver: '8.8.7', kind:"), ("RULES_MIG = '8.8.6',", "RULES_MIG = '8.8.7',")):
    rep(a, b)
# 칸 확대 없이 (그림의 사람 크기에 맞춘 칸)
rep("const F8 = {", "for (const k of ['ruin2a', 'ruin2b', 'ruin2c', 'ruin2c1', 'ruin2c2']) if (MAPS8[k]) MAPS8[k].z = 1;   /* v8.8.7 2층 맵은 칸을 잘게 쪼개지 않음 (칸 = 그림 속 사람 크기에 맞춰 뽑음) */\nconst F8 = {")
# 2층 고정 (층 정의에 rows)
rep("const FIX8 = {\n", """const FIX8 = {
  2: { name: '무너진 유적', band: 'ruin', maps: ['ruin2c', 'ruin2c1', 'ruin2c2'], narr: ['어둠 속에 무너진 유적이 떠 있다.', '위로 이어지는 계단이 보인다.'],   /* v8.8.7 2층: 입구 → 계단 → 회랑 · 방 (무작위) → 아래 계단 · 모두 비어 있음 */
    rows: [[{ t: 'fight', ms: 'pass', src8: 'ruin2a', empty: true, bare: true }], [{ t: 'fight', ms: 'pass', src8: 'ruin2b', empty: true, bare: true }], [{ t: 'fight', ms: 'pass', empty: true, bare: true }], [{ t: 'stairs' }]] },
""")
rep("encFix: (X && X.enc) || null };", "encFix: (X && X.enc) || null, rows: (X && X.rows) || undefined };")
# 아무것도 놓지 않는 구획 (bare)
rep("  const place = (P, zone, tries0) => {\n", "  const place = (P, zone, tries0) => {\n    if (o.bare) return false;   /* v8.8.7 아무것도 놓지 않는 맵 */\n")
rep("S.art8sec = { key, src: n.src8, src2, seed: n.seed || 7, kind, theme: F.theme };", "S.art8sec = { key, src: n.src8, src2, seed: n.seed || 7, kind, theme: F.theme, bare: !!n.bare };")
rep("return r8SecReg(key, n.src8, n.seed || 7, { kind, theme: F.theme, src2 });", "return r8SecReg(key, n.src8, n.seed || 7, { kind, theme: F.theme, src2, bare: !!n.bare });")
rep("{ kind: A.kind, theme: A.theme, src2: A.src2 || null }); }", "{ kind: A.kind, theme: A.theme, src2: A.src2 || null, bare: !!A.bare }); }")
open(F, 'w', encoding='utf-8').write(s)
print('page8870 OK')
