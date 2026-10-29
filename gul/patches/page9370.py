# v9.13.0 페이지 — page9370.py v1.0 (v1.0: 버전 v9.13.0 · 엔진 patch9320 (막힘 — 이어 닿기 도착 · 차지된 자리 받아들임 · 둘 다 치는 중에도 반씩 밀어냄) · patch9330 (총안 다시 — 총구가 전열 몸 앞으로) · 1× = 현실 시간 (현실 1초 = 판 1초 — 전엔 1× 단추가 실제로는 0.25배) · 훈련장 '☀ 밝은 맵' (맵 전체 주변광 1))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9360.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.12.0 (2026-10-28)', '<!-- 굴의 전투판 v9.13.0 (2026-10-29)')
rep('     v9.12.0: 세자르 다시', '''     v9.13.0: 총안 다시 — 표적 쪽 전열 (근접 · 지원 아님) 과 0.45칸 안이면 바로 총안 · 총구가 전열 몸 앞으로 나와 그 전열은 절대 안 맞음 · 점사 다음 발도 · 전열이 막아 주는 가까운 적에게도 물러서지 않고 쏨 · 막힘 — 같은 자리로 가는 무리는 먼저 선 동료에 닿으면 도착 · 차지된 자리로 되돌아가 밀지 않음 · 둘 다 치는 중이어도 겹치면 반씩 밀어냄 · 1× = 현실 시간 (현실 1초 = 판 1초 · ½× · 2× · 4× 도 그 배수 그대로 — 전엔 1× 가 실제로 0.25배)
     v9.12.0: 세자르 다시''')
for a, b in (('h1::after{content:" v9.12.0"', 'h1::after{content:" v9.13.0"'), ('<footer>굴의 전투판 v9.12.0', '<footer>굴의 전투판 v9.13.0'), ('return `굴의 전투판 v9.12.0 · ${title}', 'return `굴의 전투판 v9.13.0 · ${title}'),
             ("copyText('굴의 전투판 v9.12.0 자동 판 기록", "copyText('굴의 전투판 v9.13.0 자동 판 기록"), ("o.push(`굴의 전투판 v9.12.0 — ${C.run", "o.push(`굴의 전투판 v9.13.0 — ${C.run"),
             ('의 버전 기록에 — v9.12.0 세자르 다시', '의 버전 기록에 — v9.13.0 총안 · 막힘 / v9.12.0 세자르 다시'),
             ('">v9.12.0 세자르 다시', '">v9.13.0 총안 (총구가 전열 앞) · 막힘 없는 자리 잡기 · v9.12.0 세자르 다시'),
             ("ver: '9.12.0', kind:", "ver: '9.13.0', kind:"), ("RULES_MIG = '9.12.0',", "RULES_MIG = '9.13.0',")):
    rep(a, b)
rep("    let budget = dt * speed * (slowNow() ? FOCUS_SLOW : 1) * fxTimeK();", "    let budget = dt * speed * 4 * (slowNow() ? FOCUS_SLOW : 1) * fxTimeK();   /* v9.13.0 1× = 현실 시간 (단추 값 0.25 = 1× · 1 = 4×) — 전엔 1× 가 실제로 0.25배 */")
rep('<div class="row"><label class="ck" for="randStart"><input id="randStart" type="checkbox">', '<div class="row"><label class="ck" for="brightMap"><input id="brightMap" type="checkbox"> ☀ 밝은 맵 (맵 전체가 밝음 — 횃불 없이도 다 보임 · 어둠 · 야시 · 은신의 어둠 몫이 사라짐)</label></div>\n          <div class="row"><label class="ck" for="randStart"><input id="randStart" type="checkbox">')   # v9.13.0
rep("  $('randStart').checked = !!S.randStart;   // v6.1", "  $('randStart').checked = !!S.randStart;   // v6.1\n  $('brightMap').checked = (+S.amb || 0) >= 1;   /* v9.13.0 */")
rep("$('randStart').addEventListener('change', e => {", "$('brightMap').addEventListener('change', e => { S.amb = e.target.checked ? 1 : 0; changed(); toast(S.amb ? '☀ 밝은 맵 — 맵 전체가 밝아요 (횃불 없이도 다 보임)' : '밝은 맵 끔 — 횃불 · 빛이 있는 곳만 밝아요'); });   /* v9.13.0 훈련장 밝은 맵 */\n$('randStart').addEventListener('change', e => {")
open(F, 'w', encoding='utf-8').write(s)
print('page9370 OK')
