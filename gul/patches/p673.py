def rep(path, a, b, n=1):
    s = open(path).read(); c = s.count(a); assert c == n, (path, a[:90], c); open(path, 'w').write(s.replace(a, b))
T, H, P = 'rt3_tail.js', 'rt3_head.js', 'page10.tpl.html'
# rules: contact
rep(H, "palm: { wind: 0.25, rec: 0.45, cd: 5, reach: 0.35,", "palm: { wind: 0.25, rec: 0.45, cd: 5, reach: 0.08, slip: 0.07, step: 0.8,")
rep(H, "손바닥을 대고 터뜨림 — 준비 · 회복 · 대기 (초) · 닿는 거리 ·", "손바닥을 대고 터뜨림 — 준비 · 회복 · 대기 (초) · v6.7.3 닿는 거리 = 완전 밀착 (몸 사이 reach 칸, 준비하는 동안 slip 칸까지 벌어져도 닿음 · 단검 거리에서 한 걸음 더 파고듦, step 초 안에 못 붙으면 그만둠) ·")
rep(H, "   v6.7.2: [팜 버스트] 는 액티브", "   v6.7.3: 단검 = 짧고 (0.3칸) 빠른 근접 날붙이 (기본 공격). [팜 버스트] = 완전히 밀착해야 쓰는 특수기 — 몸이 닿을 만큼 파고들어야 (0.08칸) 씀.\n   v6.7.2: [팜 버스트] 는 액티브")
# auto: step in to contact (with give-up)
s = open(T).read(); i = s.index("    if (!ordered && palmReady(W, u) && gap(u, t) <= PALM(W).reach){ const why = palmNeed(W, u, t);"); j = s.index("\n", i)
s = s[:i] + "    if (!ordered && palmReady(W, u) && W.t >= (u.palmTryCd || -9)){ const why = palmNeed(W, u, t); if (why){ const P = PALM(W); if (gap(u, t) <= P.reach){ u.palmTry = 0; startPalm(W, u, t, why); return; }   // v6.7.2 [팜 버스트] 는 액티브 — 기본은 단검, 스스로는 꼭 필요한 순간만 (나머지는 플레이어의 명령)\n      u.palmTry = (u.palmTry || 0) + dt; if (u.palmTry <= (P.step || 0.8)){ setMood(W, u, '바싹 파고듦', t.i); goTo(W, u, t.x, t.y, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x); return; } u.palmTry = 0; u.palmTryCd = W.t + 1.5; } }   // v6.7.3 완전 밀착해야 씀 — 단검 거리에서 한 걸음 더 파고듦 (step 초 안에 못 붙으면 그만두고 단검으로)" + s[j:]
open(T, 'w').write(s)
rep(T, "  else if (gap(u, t) > P.reach + R.reach) why = W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : '손바닥이 닿지 않음';",
       "  else if (gap(u, t) > P.reach + (P.slip != null ? P.slip : 0.07)) why = W.t - t.dodgedT < 0.5 ? '몸을 빼 피함' : `손바닥이 닿지 않음 (${gap(u, t).toFixed(2)}칸 — 완전히 붙어야 함)`;   // v6.7.3 밀착")
rep(T, "    if (see && gap(u, t) <= PALM(W).reach){ if (palmReady(W, u)){", "    if (see && gap(u, t) <= PALM(W).reach){ if (palmReady(W, u)){   // v6.7.3 명령: 몸이 닿을 때까지 파고듦\n     ")
# page texts + versions + migration
rep(P, "<!-- 굴의 전투판 v6.7.2 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v6.7.3 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v6.7.3: 흑요석 단검 = 짧고 (0.3칸) 빠른 (준비 · 회복 ×0.65) 근접 날붙이 — 청광묵의 기본 공격. [팜 버스트] = 완전히 밀착해야 쓰는 특수기: 몸이 닿을 만큼 (0.08칸) 파고들어야 손바닥을 댐 (준비하는 0.25초 사이 0.15칸 넘게 벌어지면 '손바닥이 닿지 않음'). 단검 거리에서 한 걸음 더 파고들고, 0.8초 안에 못 붙으면 그만두고 단검으로.
""")
rep(P, 'body.mob .top h1::after{content:" v6.7.2";', 'body.mob .top h1::after{content:" v6.7.3";')
rep(P, '<span class="ver">v6.7.2 · ', '<span class="ver">v6.7.3 · 단검 = 짧고 빠른 날붙이 · 팜 버스트 = 완전 밀착 · v6.7.2 · ')
rep(P, '<footer>굴의 전투판 v6.7.2 —', '<footer>굴의 전투판 v6.7.3 —')
rep(P, "return `굴의 전투판 v6.7.2 · ${title}", "return `굴의 전투판 v6.7.3 · ${title}")
rep(P, "  '팜 버스트': '청광묵의 고유 액티브 — 손바닥을 상대에게 대고 터뜨림 (준비 0.25초 · 5초마다).", "  '팜 버스트': '청광묵의 고유 액티브 — 완전히 밀착해야 쓰는 특수기: 몸이 닿을 만큼 파고들어 손바닥을 대고 터뜨림 (준비 0.25초 · 5초마다 · 그 사이 상대가 몸을 빼면 안 닿음).")
rep(P, "흑요석 단검 (빠름 · 던질 수 있음 — 던지면 맨손, 맨손이면 손바닥이 닿아 화상)", "흑요석 단검 (짧고 빠른 근접 날붙이 — 기본 공격 · 던질 수도 있음 — 던지면 맨손, 맨손이면 손바닥이 닿아 화상)")
rep(P, "if (!S.v671){", "if (!S.v673){ const P0 = S.rules.palm, D = DEFAULT_RULES.palm; if (P0){ if (P0.reach === 0.35) P0.reach = D.reach; if (P0.slip === undefined) P0.slip = D.slip; if (P0.step === undefined) P0.step = D.step; } S.v673 = true; }   // v6.7.3 팜 버스트는 완전 밀착 (저장된 수치표의 v6.7.0 값만)\nif (!S.v671){")
print('ok')
