# v7.9.2 페이지: 전달망 (두 다리) 로그 · 임무 · 못 들음 ✗ + 재전달 · 독단 ⚡ 표시 · 노트 · 버전
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v7.9.1 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v7.9.2 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.9.2: 지휘 체계 3 — 전달망 · 임무 · 못 들은 명령.
             ① 지휘관의 말이 안 닿으면 동료를 거침 — 전엔 한 다리뿐, 이제 두 다리까지 (인주 → 노먼 → 청광묵 …). 거치는 이가 맞붙었거나 · 쏘고 · 붓는 중이면 덜 전하고 (×0.6), 지휘 점수가 있는 동료 (노먼 = 부지휘관) 는 더 믿음직.
               인주가 쓰러지면 노먼이 지휘를 이어받음 (지휘 점수가 가장 높은 살아 있는 이 — 전엔 2.5초 뒤 임시 지휘). 로그에 어떤 길로 닿았는지 (동료를 거쳐 · 두 다리) 남음.
             ② 임무 = 마지막으로 받은 명령 (끝나도 남음). 명령이 끊겨도 무엇을 하러 온 건지는 알고, 상세정보 · 카드 설명에 '임무 · 받은 지 N초' 로 보임.
             ③ 못 들은 명령은 칩 · 카드에 ✗ 로 남고 (새 명령을 받으면 사라짐), '재전달' 단추 (모바일 도크 · 데스크톱 명령 막대) 로 같은 명령을 다시 보냄 — 다시 보내도 또 못 들을 수 있음. 새 명령이 오면 이전 명령은 대신됨 (늦게 닿은 옛 명령이 새것을 덮지 않음).
             ④ 충동으로 규칙을 어긴 아군은 ⚡ 독단 표시 (8초) — 지휘관과 닿는 동안만 보임 (소식 없는 동료의 일은 모름).
             측정 (자동 전투): /*MEAS792*/
""")
rep('<span class="ver">v7.9.1 · 정찰 방침','<span class="ver">v7.9.2 · 전달망 두 다리 · 임무 · 못 들은 명령 재전달 · v7.9.1 · 정찰 방침')
rep("<footer>굴의 전투판 v7.9.1 —","<footer>굴의 전투판 v7.9.2 —")
rep("return `굴의 전투판 v7.9.1 · ${title}","return `굴의 전투판 v7.9.2 · ${title}")
rep("copyText('굴의 전투판 v7.9.1 자동 판 기록","copyText('굴의 전투판 v7.9.2 자동 판 기록")
rep('body.mob .top h1::after{content:" v7.9.1";','body.mob .top h1::after{content:" v7.9.2";')
# 로그: 전달 경로
rep("{ voice: '외침', sign: '손짓 · 깃발', relay: '동료를 거쳐', self: '지휘관' }[e.via] || e.via}${e.sec","{ voice: '외침', sign: '손짓 · 깃발', relay: e.m2 != null ? '두 다리 (' + n(e.m) + ' → ' + n(e.m2) + ')' : e.m != null ? n(e.m) + '을 거쳐' : '동료를 거쳐', self: '지휘관' }[e.via] || e.via}${e.sec")
# 칩: 못 들음 ✗ · 독단 ⚡ (linkBadge)
rep("  if (u.ordPend) return `<span class=\"lk q\"","  const xm = !u.ordPend && u.missT != null && Wd.t - u.missT < 60 ? `<span class=\"lk r\" title=\"명령이 안 닿았어요 (${esc(orderLabel(Wd, orderTxt(u.missO, u)))}) — 재전달 단추로 다시 보내거나 새 명령을 주세요\">✗ 못 들음</span>` : '', dv = u.deviT != null && Wd.t - u.deviT < 8 && !u.posUnk ? `<span class=\"lk y\" title=\"규칙을 어기고 스스로 덤빔 (충동) — 로그에 까닭이 있어요\">⚡ 독단</span>` : '';   // v7.9.2\n  if (u.ordPend) return `<span class=\"lk q\"")
rep("  return `<span class=\"lk ${cl}\" title=\"${esc((lk.via === 'voice' ? '외침' : lk.via === 'sign' ? '손짓' : lk.via === 'relay' ? '전달' : '닿지 않음') + (lk.why ? ' · ' + lk.why : ''))}\">📣 ${pc}%</span>${u.posUnk ?",
    "  return xm + dv + `<span class=\"lk ${cl}\" title=\"${esc((lk.via === 'voice' ? '외침' : lk.via === 'sign' ? '손짓' : lk.via === 'relay' ? '전달' : '닿지 않음') + (lk.why ? ' · ' + lk.why : ''))}\">📣 ${pc}%</span>${u.posUnk ?")
# 상세: 임무
rep("    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) ? `<span class=\"tr\"><span class=\"lb\">교전 규칙</span>","""    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) && u.mission ? `<span class="tr"><span class="lb">임무</span> ${esc(orderLabel(Wd, orderTxt(u.mission.o, u)))} · 받은 지 ${Math.round(Wd.t - u.mission.t)}초${u.order ? '' : ' (끝났거나 끊김 — 스스로 판단 중)'}${u.missT != null && !u.ordPend ? ' · ✗ 새 명령을 못 들음' : ''}</span>` : ''}
    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) ? `<span class="tr"><span class="lb">교전 규칙</span>""")
# 재전달
rep("let sacConf = null;","""// v7.9.2 못 들은 명령 다시 보내기: 고른 아군 (없으면 못 들은 모두) 에게 같은 명령을 다시 (지휘관을 거쳐 — 또 못 들을 수 있음)
function resendMissed(){
  const W = world; if (!W) return; const L0 = selUnits(W), C = (L0.length ? L0 : W.units.filter(u => u.side === 0 && u.alive)).filter(u => u.alive && u.missT != null && u.missO);
  if (!C.length){ toast('못 들은 명령이 없어요'); return; }
  C.forEach(u => { u.order = u.missO; u.missT = null; }); noteOrders(C, 'user', '재전달'); toast(`📣 ${C.map(u => u.name).join(' · ')}에게 같은 명령을 다시 전해요`); hud();
}
let sacConf = null;""")
rep("function ordKey(k){\n  const L = selUnits(world);\n  if (k === 'sac'){","function ordKey(k){\n  const L = selUnits(world);\n  if (k === 'resend'){ resendMissed(); return; }\n  if (k === 'sac'){")
rep("""<button class="btn" type="button" data-ord="sac" title""","""${(Wd.units.some(u => u.side === 0 && u.alive && u.missT != null && u.missO)) ? '<button class="btn" type="button" data-ord="resend" title="못 들은 명령을 다시 보냄">📣 재전달</button>' : ''}<button class="btn" type="button" data-ord="sac" title""")
rep("      + (L.length === 1 && !L[0].crawl ? `<button type=\"button\" class=\"db ${sacConf","      + (Wd.units.some(u => u.side === 0 && u.alive && u.missT != null && u.missO) ? `<button type=\"button\" class=\"db\" data-dk=\"resend\"><span class=\"ic\">📣</span>재전달</button>` : '')\n      + (L.length === 1 && !L[0].crawl ? `<button type=\"button\" class=\"db ${sacConf")
rep("  if (k === 'sac'){ ordKey('sac'); hud(); return; }","  if (k === 'sac'){ ordKey('sac'); hud(); return; }\n  if (k === 'resend'){ ordKey('resend'); return; }")
open(f,'w').write(s); print('ok')
