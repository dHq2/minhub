def rep(path, a, b, n=1):
    s = open(path).read(); c = s.count(a); assert c == n, (path, a[:90], c); open(path, 'w').write(s.replace(a, b))
T, H, P = 'rt3_tail.js', 'rt3_head.js', 'page10.tpl.html'
s = open(T).read(); i = s.index("    if (palmReady(W, u) && gap(u, t) <= PALM(W).reach){ startPalm("); j = s.index("\n", i)
s = s[:i] + "    if (!ordered && palmReady(W, u) && gap(u, t) <= PALM(W).reach){ const why = palmNeed(W, u, t); if (why){ startPalm(W, u, t, why); return; } }   // v6.7.2 [팜 버스트] 는 액티브 — 기본은 단검, 스스로는 꼭 필요한 순간만 (나머지는 플레이어의 명령)" + s[j:]
open(T, 'w').write(s)
rep(T, "function startPalm(W, u, t, why){",
"""// v6.7.2 스스로 팜 버스트를 쓰는 '필요한 순간' (그 밖엔 단검으로 싸우고, 언제 쓸지는 플레이어의 명령 — 기술 칸 5):
// ① 등 뒤가 벽 (날려 보내면 짓눌림) ② 막고 선 방패 · 무구에 1초 넘게 막힘 (방패째 터뜨려 자세를 무너뜨림) ③ 다쳐서 (40% 아래) 치려는 놈을 밀쳐 내고 빠짐
// ④ 쓰러지거나 많이 다친 동료를 치려는 놈을 떼어 냄 ⑤ 손 닿는 적이 둘 이상 (틈을 만듦)
function palmNeed(W, u, t){
  const d = dist(u, t) || 1, dx = (t.x - u.x) / d, dy = (t.y - u.y) / d, P = PALM(W);
  const kb = (P.kb || 1) * Math.max(0.25, Math.min(1.4, Math.pow(80 / Math.max(30, t.mass || 62), P.kbExp || 0.6)));
  if (!inGuard(W, t, u) && wallBehind(W, t, dx, dy, t.r + Math.max(0.3, kb))) return '벽으로 날려 보냄';
  if (inGuard(W, t, u) && (u.waitT || 0) > 1) return '방패째 터뜨림';
  if (u.hp / u.max < 0.4 && t.act && t.act.k === 'atk' && t.act.b === u.i && t.act.phase === 'wind') return '밀쳐 내고 빠짐';
  const v = t.act && t.act.phase === 'wind' && t.act.b != null ? W.units[t.act.b] : null;
  if (v && v !== u && v.side === u.side && v.alive && (prone(W, v) || v.hp / v.max < 0.35)) return v.name + '에게서 떼어 냄';
  if (W.units.filter(f => f.alive && f.side !== u.side && !isFar(f) && gap(u, f) <= Math.max(u.rng, 0.35) + 0.1).length >= 2) return '둘러싸여 틈을 만듦';
  return null;
}
function startPalm(W, u, t, why){""")
rep(H, "   v6.7.1: 확률 회피", "   v6.7.2: [팜 버스트] 는 액티브 — 기본 공격은 단검, 스스로는 꼭 필요한 순간 (벽 · 막힌 방패 · 다쳐서 빠질 때 · 동료 구출 · 둘러싸임) 만, 나머지는 플레이어의 명령 (기술 칸 5).\n   v6.7.1: 확률 회피")
# page
rep(P, "<!-- 굴의 전투판 v6.7.1 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v6.7.2 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v6.7.2: 청광묵의 기본 공격은 흑요석 단검. [팜 버스트] 는 액티브 — 스스로는 꼭 필요한 순간만 (① 상대 등 뒤가 벽 — 날려 보내 짓눌림 ② 막고 선 방패 · 무구에 1초 넘게 막힘 — 방패째 터뜨림 ③ 다쳐서 (40% 아래) 치려는 놈을 밀쳐 내고 빠짐 ④ 쓰러지거나 많이 다친 동료를 치려는 놈을 떼어 냄 ⑤ 손 닿는 적이 둘 이상), 공격 명령 중엔 스스로 안 씀. 나머지는 플레이어가 기술 칸 5 (숫자키 5) 로.
""")
rep(P, 'body.mob .top h1::after{content:" v6.7.1";', 'body.mob .top h1::after{content:" v6.7.2";')
rep(P, '<span class="ver">v6.7.1 · ', '<span class="ver">v6.7.2 · 청광묵 기본 = 단검 · 팜 버스트는 필요할 때만 · v6.7.1 · ')
rep(P, '<footer>굴의 전투판 v6.7.1 —', '<footer>굴의 전투판 v6.7.2 —')
rep(P, "return `굴의 전투판 v6.7.1 · ${title}", "return `굴의 전투판 v6.7.2 · ${title}")
rep(P, "  '팜 버스트': '청광묵의 고유 기술 — 손바닥을 상대에게 대고 터뜨림 (준비 0.25초 · 5초마다).", "  '팜 버스트': '청광묵의 고유 액티브 — 손바닥을 상대에게 대고 터뜨림 (준비 0.25초 · 5초마다). 기본 공격은 단검이고, 언제 쓸지는 플레이어의 명령 (기술 칸 5) — 스스로는 꼭 필요한 순간만 (상대 등 뒤가 벽 · 막고 선 방패에 1초 넘게 막힘 · 다쳐서 빠질 때 · 쓰러지거나 많이 다친 동료를 치려는 놈 · 둘러싸임).")
print('ok')
