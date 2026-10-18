# v7.9.5 페이지: 지휘망 그림 (선 · 전달 점 · 못 닿음 ✗) + 켜고 끄기 · 시야 설명 · 옛 저장의 야시 되돌림 · 횃불 켠 채 은신 정리 · 로그
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v7.9.4 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v7.9.5 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.9.5: 검수 — 코앞 지휘 · 밑도 끝도 없는 따라감 · 임시 자리 합류 · 지휘망 그림 · 시야 · 야시 되돌림.
             ① 코앞 (2.5칸 안) 의 아군에게는 지휘가 바로 닿음 (확률 · 지연 · 소음 영향 없음 — 전엔 맞붙은 상태면 85%, 98% 상한). 지휘관 자신은 늘 바로.
             ② 밑도 끝도 없이 따라가는 것: (가) 주인공이 쓰러지거나 자동일 때 동료 · 주인공이 '가장 가까운 적' 을 전지하게 (보이지도 않는 적의 진짜 자리를) 찾아 나섰음 → 보았거나 냄새 · 외침 · 총성으로 안 적 (8초 안) 쪽으로만. (나) 보이지 않는 상대를 브리핑 · 외침 따라 8초 넘게 · 12칸 넘게 쫓지 않고 포기 (10초간 다시 안 쫓음, 로그 chaseEnd).
             ③ 임시 자리: 이동 명령이 끝나면 지키는 자리가 생기는데, 이건 정지 명령이 아님 — 가까운 동료가 8칸 넘게 멀어지고 (사수는 16칸) 교전 소리가 나면, 또는 주인공이 14칸 밖으로 6초 넘게 멀면 스스로 풀고 합류 (로그 rejoin). '제자리' 명령 (H) 은 죽을 때까지 그대로.
               시험: 28칸 밖 임시 자리의 레베카 10/10 합류 · 제자리 명령은 0/10 (그대로). 동료 외침 ('저기 있다') 도 전장 소음에 묻힘.
             ④ 📡 지휘망 그림 (더 보기 · 데스크톱 체크): 지휘관에서 각 아군으로 선 — 초록 (80%↑) · 노랑 · 빨강 (45% 아래) · 외침 = 실선 · 손짓 = 긴 점선 · 동료를 거쳐 = 짧은 점선 (거치는 이를 지남, 두 다리면 둘 다) · 닿지 않음 = 성긴 점선 + ✗ · 명령이 가는 중이면 선 위를 달리는 점 (남은 초).
             ⑤ 인주가 밤에 못 본다? 야시 없는 몸은 횃불 빛 (5칸) 안만 보임 — 설계의 인주는 야시 C (어둠 속 2.5칸) 인데 옛 저장 · 도감에서 놓은 인주에는 빠져 있었음 → 한 번만 되돌림 (토스트). 상세정보에 '시야' 줄 (횃불 · 야시 · 어디까지 보이나).
             ⑥ 인주 칩이 '횃불' 이라 나오던 것: 은신을 켠 채 횃불을 든 상태 (🥷 칩의 설명 '횃불을 켜서 못 숨음') 였음 — 시작 설정으로 이어받은 은신 · 횃불을 켤 때 은신이 있으면 풀림 (횃불 든 이는 못 숨으므로).
             측정 (자동 전투): /*MEAS795*/
""")
rep('<span class="ver">v7.9.4 · 임시 집결','<span class="ver">v7.9.5 · 코앞 지휘 · 따라감 한도 · 임시 자리 합류 · 지휘망 · 시야 · v7.9.4 · 임시 집결')
rep("<footer>굴의 전투판 v7.9.4 —","<footer>굴의 전투판 v7.9.5 —")
rep("return `굴의 전투판 v7.9.4 · ${title}","return `굴의 전투판 v7.9.5 · ${title}")
rep("copyText('굴의 전투판 v7.9.4 자동 판 기록","copyText('굴의 전투판 v7.9.5 자동 판 기록")
rep('body.mob .top h1::after{content:" v7.9.4";','body.mob .top h1::after{content:" v7.9.5";')
# 로그
rep("      case 'rally': out.push(","      case 'chaseEnd': out.push(`${T(e)}↩ ${n(e.a)} ${n(e.b)}가 안 보인 채 ${e.sec}초 · ${e.d}칸 쫓다 포기 — 대열로`); break;   // v7.9.5\n      case 'rejoin': out.push(`${T(e)}↩ ${n(e.a)} 지키던 자리를 풀고 합류 — 동료와 ${e.d}칸 (${e.why})`); break;\n      case 'rally': out.push(")
rep("    case 'rally': return","    case 'chaseEnd': return { c: 'dim', s: `${ga(n(e.a))} 놓친 ${reul(n(e.b))} 더는 쫓지 않는다.` };\n    case 'rejoin': return { c: 'dim', s: `${ga(n(e.a))} 혼자 서 있던 자리를 떠나 동료들 쪽으로 간다.` };\n    case 'rally': return")
rep("['impulse', 'regroup', 'healDefer', 'healRisk', 'healAbort', 'pushNo', 'offAct', 'flankMis', 'rally', 'netBack']","['impulse', 'regroup', 'healDefer', 'healRisk', 'healAbort', 'pushNo', 'offAct', 'flankMis', 'rally', 'netBack', 'chaseEnd', 'rejoin']")
rep("healAbort: `✚ ${n(e.a)} 붓던 치료를 끊음`, offAct:","healAbort: `✚ ${n(e.a)} 붓던 치료를 끊음`, chaseEnd: `↩ ${n(e.a)} ${n(e.b)} 추격 포기 (${e.sec}초 · ${e.d}칸)`, rejoin: `↩ ${n(e.a)} 임시 자리를 풀고 합류 (${e.why})`, offAct:")
# 시야 줄 (상세)
rep("    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) ? `<span class=\"tr\"><span class=\"lb\">교전 규칙</span>","""    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) ? (() => { const lit = u.torch && !u.torchOff, S3 = Wd.rules; return `<span class="tr"><span class="lb">시야</span> ${[lit ? '🔥 횃불 켬 — 빛 ' + S3.heroLight + '칸 안은 보임 (멀리서도 보임)' : u.torch ? '🌑 횃불 꺼짐 — 빛이 없어 어둠 속' : '횃불 없음', u.nv ? '야시 ' + (u.nvG || 'B') + ' — 어둠 속 ' + (u.nvG === 'A' ? S3.sight : u.nvG === 'C' ? S3.nvC : S3.nvB) + '칸' : '야시 없음 — 빛 밖은 거의 안 보임 (몸에 닿는 것만)', u.smellG ? '후각 ' + u.smellG + ' — ' + (u.smellFar || S3.smellFar) + '칸' : ''].filter(Boolean).join(' · ')}${u.stealth && lit ? ' · ⚠ 횃불을 든 채라 은신이 소용없음' : ''}</span>`; })() : ''}
    ${!ed && u.side === 0 && u.alive && !hidA(Wd, u) ? `<span class="tr"><span class="lb">교전 규칙</span>""")
# 옛 저장: 야시 되돌림 (한 번)
rep("if (!S.v585){","""if (!S.v795nv){   // v7.9.5 옛 저장 · 도감에서 놓은 아군에 설계의 야시가 빠져 있던 것 (인주가 밤에 아예 못 봄) — 한 번만 설계대로
  const fixed = []; for (const u of S.units){ if (u.side !== 0 || u.nv) continue; const d = DESIGN_DEFAULTS.find(x => x.side === 0 && (x.ref === u.ref || x.name === u.name)); if (d && d.nv){ u.nv = true; u.nvG = d.nvG || 'B'; fixed.push(u.name); } }
  S.v795nv = true; if (fixed.length) setTimeout(() => { save(); toast(`야시를 설계대로 되돌렸어요: ${fixed.join(' · ')} (옛 저장에 빠져 있어 밤에 못 봤음)`); }, 900); }
if (!S.v585){""")
# 시작 설정: 횃불 켠 이는 은신 안 함
rep("if (op.st && (u.stealthE || 0) >= ((Wd.rules.stealth || {}).min || 0)){ u.stealth = true;","if (op.st && (u.stealthE || 0) >= ((Wd.rules.stealth || {}).min || 0) && !(u.torch && !(op.tf))){ u.stealth = true;")
# 지휘망 켜고 끄기
rep("""<label class="ck" for="seeAll"><input id="seeAll" type="checkbox"> 모두 보기</label>""","""<label class="ck" for="seeAll"><input id="seeAll" type="checkbox"> 모두 보기</label>
          <label class="ck" for="netShow" title="지휘관에서 각 아군으로 가는 지휘 전달선 (외침 · 손짓 · 동료를 거침 · 닿지 않음)"><input id="netShow" type="checkbox" checked> 📡 지휘망</label>""")
rep("<button class=\"db ${$('seeAll').checked ? 'on' : ''}\" data-dm=\"see\">👁<small>모두 보기</small></button>","<button class=\"db ${$('seeAll').checked ? 'on' : ''}\" data-dm=\"see\">👁<small>모두 보기</small></button><button class=\"db ${$('netShow').checked ? 'on' : ''}\" data-dm=\"net\">📡<small>지휘망</small></button>")
rep("  if (k === 'see'){ $('seeAll').checked = !$('seeAll').checked;","  if (k === 'net'){ $('netShow').checked = !$('netShow').checked; $('netShow').dispatchEvent(new Event('change')); }\n  else if (k === 'see'){ $('seeAll').checked = !$('seeAll').checked;") if False else None
open(f,'w').write(s); print('ok')
