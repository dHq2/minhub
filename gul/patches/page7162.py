# v7.16.2 페이지 — page7162.py v1 (카리우스 체력 700 확실히: 저장된 판 · 내 설계 · 층의 카리우스를 한 번 700 으로 (450 뿐 아니라 빈 칸 · 1265 · 그 밖) · 체력 칸이 빈 인물은 프로필 체력으로 (도감 5성 → 1265 가 새지 않게) · 도감 희귀도 5성이 전투 등급으로 샌 카리우스는 2)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.16.1 (2026-10-17)', '<!-- 굴의 전투판 v7.16.2 (2026-10-17)')
rep('     v7.16.1: ', '''     v7.16.2: 카리우스 체력 700 을 확실히 — v7.15.1 의 이전은 체력 450 인 카리우스만 바꿔서, 체력 칸이 비어 도감 희귀도 (5성) 로 계산되던 카리우스 (1265) 는 그대로 남을 수 있었음.
         저장된 판 · 내 설계 · 내 층의 카리우스는 한 번 모두 700 (그 뒤 손으로 바꾸는 건 자유) · 희귀도 5성이 전투 등급으로 샌 아군 카리우스는 2 로.
         체력 · 공격 칸이 빈 인물은 어디서 놓든 프로필 값으로 채움 (카리우스 700 · 40 · 인주 85).
     v7.16.1: ''')
rep('h1::after{content:" v7.16.1"', 'h1::after{content:" v7.16.2"')
rep('<footer>굴의 전투판 v7.16.1', '<footer>굴의 전투판 v7.16.2')
rep('return `굴의 전투판 v7.16.1 · ${title}', 'return `굴의 전투판 v7.16.2 · ${title}')
rep("copyText('굴의 전투판 v7.16.1 자동 판 기록", "copyText('굴의 전투판 v7.16.2 자동 판 기록")
rep('의 버전 기록에 — v7.16.1 교전 금지 자동 해제 · 포복 명령 /', '의 버전 기록에 — v7.16.2 카리우스 체력 700 / v7.16.1 교전 금지 자동 해제 · 포복 명령 /')
rep('">v7.16.1 · 교전 금지 자동 해제 · 포복 명령</span>', '">v7.16.2 · 카리우스 체력 700</span>')

# ---------- 체력 · 공격 칸이 비면 프로필 값 (정체성) ----------
rep("  if (I.skill && !p.skill && PROFILE[p.ref] && PROFILE[p.ref].skill){ p.skill = clone(PROFILE[p.ref].skill); ch = true; }\n  return ch; }",
    "  if (I.skill && !p.skill && PROFILE[p.ref] && PROFILE[p.ref].skill){ p.skill = clone(PROFILE[p.ref].skill); ch = true; }\n"
    "  { const po = PROFILE[p.ref] && PROFILE[p.ref].ov; if (po) for (const k of ['hp', 'atk']) if (po[k] != null && (!p.ov || p.ov[k] == null)){ p.ov = { ...(p.ov || {}), [k]: po[k] }; ch = true; } }   /* v7.16.2 체력 · 공격 칸이 비면 프로필 값 (도감 5성 → 카리우스 1265 가 새지 않게) */\n"
    "  return ch; }")

# ---------- 카리우스 체력 700 (한 번 · 450 말고도) ----------
rep("// v7.14 은신 등급 (민수가 정한 것)",
    """// v7.16.2 카리우스 체력은 700 (민수) — 저장된 판 · 내 설계 · 내 층에 한 번만 (빈 칸 · 1265 · 그 밖 모두). 도감 희귀도 5성이 전투 등급으로 샌 아군 카리우스는 2
const fixKar7162 = p => { if (!p || p.ref !== 'C-003') return false; let c = false; if (!p.ov || +p.ov.hp !== 700){ p.ov = { ...(p.ov || {}), hp: 700 }; c = true; } if ((p.side || 0) === 0 && p.tier === 5){ p.tier = 2; c = true; } return c; };
if (!S.v7162k){ let n = 0; for (const u of S.units) if (fixKar7162(u)) n++; try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixKar7162(d)){ dc = true; n++; } if (dc) saveMyDesigns(mine); } catch (e) {}
  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fixKar7162(u)){ fc = true; n++; } if (fc) saveMyFloors(F); } catch (e) {} S.v7162k = true;
  if (n) setTimeout(() => { save(); toast(`카리우스 체력을 700 으로 맞췄어요 (${n}곳 — 저장된 판 · 내 설계 · 내 층)`); }, 900); }
// v7.14 은신 등급 (민수가 정한 것)""")

open(F, 'w', encoding='utf-8').write(s)
print('page7162 OK')
