import sys
P='page10.tpl.html'; s=open(P).read()
def rep(a,b,n,cnt=1):
    global s
    c=s.count(a)
    if c!=cnt: print('ANCHOR',n,c); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v5.8.4 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v5.8.5 (2026-10-11) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v5.8.5: 기술 준비 · 대기를 ½× 기본 속도에 맞게 줄임 (아군 · 적 같음).
             · 돌격: 준비 0.35 → 0.2초 · 대기 8 → 4초. 도움닫기 — 달리기 시작은 ×1.2, 달린 거리가 3칸이면 전력질주 ×2.6 (전엔 늘 ×2.2).
               부딪히는 힘도 그 속력이라 짧은 돌격은 덜 세고, 3칸 넘게 달려온 돌격은 더 셈. 적 AI 도 멀리서 달려올 수 있는 상대를 더 높게 침.
             · 투창 준비 0.7 → 0.45초 · 구급상자 (노먼) 준비 0.85 → 0.5초 · 대기 5 → 2.5초 · 양동이 약 (옐로) 준비 0.8 → 0.5초. 도약 (1.1초) · 방패 밀치기는 그대로.
             · 옛 저장 (수치표 · 판의 인물 · 내 설계) 도 옛 기본값이면 새 값으로 바꿈 (한 번).
""",'notes')
rep('<span class="ver">v5.8.4 · 보병 모두 돌진','<span class="ver">v5.8.5 · 기술 대기 ½ · 돌격 도움닫기 (3칸 전력질주) · v5.8.4 · 보병 모두 돌진','ver')
rep("<footer>굴의 전투판 v5.8.4","<footer>굴의 전투판 v5.8.5",'footer')
rep("return `굴의 전투판 v5.8.4 · ${title}","return `굴의 전투판 v5.8.5 · ${title}",'export')
rep("body.mob .top h1::after{content:\" v5.8.4\";","body.mob .top h1::after{content:\" v5.8.5\";",'mobver')
# 기술 값
rep("skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.8, rec: 0.4, rng: 0.8 }","skill: { name: '양동이 약', pool: 500, per: 120, wind: 0.5, rec: 0.4, rng: 0.8 }",'bucket')
rep("skill: { name: '응급처치', kit: true, pool: 5, pct: 0.4, cd: 5, wind: 0.85, rec: 0.3, rng: 0.8, auto: 0.5 }","skill: { name: '응급처치', kit: true, pool: 5, pct: 0.4, cd: 2.5, wind: 0.5, rec: 0.3, rng: 0.8, auto: 0.5 }",'pfKit')
rep("const KIT = { name: '응급처치', kit: true, pool: 5, pct: 0.4, cd: 5, wind: 0.85, rec: 0.3, rng: 0.8, auto: 0.5 };","const KIT = { name: '응급처치', kit: true, pool: 5, pct: 0.4, cd: 2.5, wind: 0.5, rec: 0.3, rng: 0.8, auto: 0.5 };   // v5.8.5 준비 · 대기 ½",'kit')
# 이주 (한 번): 옛 기본값만 새 값으로
rep("// v5.8.4 레베카 = 장검 · 방패를 든 보병 (기본).",
"""// v5.8.5 기술 준비 · 대기 ½ (½× 기본 속도에 맞춤): 옛 기본값 그대로인 것만 새 값으로 (손으로 바꾼 값은 둠)
const fixCast = p => { const k = p && p.skill; if (!k) return false; let ch = false;
  if (k.kit && k.name === '응급처치'){ if (+k.wind === 0.85){ k.wind = 0.5; ch = true; } if (+k.cd === 5){ k.cd = 2.5; ch = true; } }
  if (k.name === '양동이 약' && +k.wind === 0.8){ k.wind = 0.5; ch = true; } return ch; };
if (!S.v585){ const c = S.rules.charge, d = DEFAULT_RULES.charge, J = S.rules.javelin;
  if (c){ if (c.wind === 0.35) c.wind = d.wind; if (c.cd === 8) c.cd = d.cd; if (c.spd === 2.2) c.spd = d.spd; for (const j in d) if (c[j] === undefined) c[j] = d[j]; }
  if (J && J.wind === 0.7) J.wind = DEFAULT_RULES.javelin.wind;
  for (const u of S.units) fixCast(u); try { const mine = myDesigns(); let dc = false; for (const x of mine) if (fixCast(x)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}
  S.v585 = true; }
// v5.8.4 레베카 = 장검 · 방패를 든 보병 (기본).""",'migr')
# 설명 글
rep("1.5 ~ 5칸 앞으로 전력질주해 들이받음. 무게 × 속력으로 부딪힘 (둘 다 달려오면 합쳐짐 · 가벼운 쪽이 튕겨 나감 · 빠르면 넘어짐). 버티는 방진 (뒤 · 옆 동료 · 막고 선 전선) 은 잘 안 밀려서 빈틈 (옆 · 뒤 · 사수 · 준비 중 · 벽 쪽) 을 노림. 8초마다'",
    "1.5 ~ 5칸 앞으로 달려 들이받음. 달릴수록 빨라져 3칸을 달리면 전력질주 (짧은 돌격은 덜 셈). 무게 × 속력으로 부딪힘 (둘 다 달려오면 합쳐짐 · 가벼운 쪽이 튕겨 나감 · 빠르면 넘어짐). 버티는 방진 (뒤 · 옆 동료 · 막고 선 전선) 은 잘 안 밀려서 빈틈 (옆 · 뒤 · 사수 · 준비 중 · 벽 쪽) 을 노림. 4초마다'",'descA')
rep("방패 자세를 크게 깎음 · 준비를 끊음. 8초마다'","방패 자세를 크게 깎음 · 준비를 끊음. 3칸을 달리면 전력질주. 4초마다'",'descB')
rep("<span class=\"lb\">돌진</span> 근접 보병 모두의 기술 (방패가 있든 없든) — 정한 적 · 바닥으로 곧장 전력질주해 들이받음",
    "<span class=\"lb\">돌진</span> 근접 보병 모두의 기술 (방패가 있든 없든) — 정한 적 · 바닥으로 곧장 달려 들이받음 · 달릴수록 빨라져 3칸이면 전력질주 (×${(Wd.rules.charge || {}).spd || 2.6}, 짧으면 덜 셈) · 준비 ${(Wd.rules.charge || {}).wind}초 · 대기 ${(Wd.rules.charge || {}).cd}초",'detTxt')
# 서술: 전력질주
rep("      return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${reul(n(e.b))} 들이받는다${e.block ? ' — 방패가 크게 흔들린다' : ''}${e.broke ? '. 자세가 무너졌다!' : '!'}` };",
    "      return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${e.full ? '전력으로 달려와 ' : ''}${reul(n(e.b))} 들이받는다${e.block ? ' — 방패가 크게 흔들린다' : ''}${e.broke ? '. 자세가 무너졌다!' : '!'}` };   // v5.8.5 전력질주",'narr')
rep("${e.clash ? '마주 돌격 — 정면 충돌' : '들이받음'}${e.vr ? ' (부딪힌 속력 ' + e.vr + ')' : ''}",
    "${e.clash ? '마주 돌격 — 정면 충돌' : '들이받음'}${e.vr ? ' (부딪힌 속력 ' + e.vr + (e.run != null ? ' · ' + e.run + '칸 달림' + (e.full ? ' · 전력질주' : '') : '') + ')' : ''}",'log')
open(P,'w').write(s); print('ok')
