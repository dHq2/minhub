# v7.14.1 페이지 — page7141.py v1 (엎드린 동료 위로 쏨 · 징검다리 지휘 — 버전 · 수치표 줄 · 포복 설명 · 옛 기본값)
import json
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

rep('<!-- 굴의 전투판 v7.14.0 (2026-10-17)', '<!-- 굴의 전투판 v7.14.1 (2026-10-17)')
rep('     v7.14.0: ', '''     v7.14.1: 엎드린 몸 위로 지나감 — 노린 몸이 아닌 엎드린 몸은 서서 쏜 탄 · 화살 · 창에 8% 만 맞음 (나머지는 위로 넘어감 · 스침은 그대로). 사선 판단 · 오사 확률 계산도 같게 —
         엎드린 동료가 사선에 있어도 기다리거나 비켜서지 않고 그 위로 쏨. 노린 몸이면 예전처럼 맞을 수 있음 (먼 곳 ×0.55). 쏘는 쪽도 엎드렸으면 낮게 날아 50% · 엎드린 동료가 사선을 막는 몸. 아군 · 적 같음.
         징검다리 (지휘): 명령을 꺼내는 시간 (0.4초 · 손짓 0.35초) 은 지휘관만 들고 전하는 동료는 들은 대로 바로 되외침 (0.12초 · 지휘 점수마다 빨라짐) · 멀리 외칠수록 되풀이하느라 늦고 (끝까지 + 0.8초)
         멀리 손짓할수록 눈 맞추는 데 늦음 (+0.8초) — 곁의 동료가 징검다리면 더 빨리 · 더 확실히 닿음. 전파는 가장 먼저 닿는 길로 (시간 순). 셋째 다리부터 더 늦던 0.6초 → 0.05초. 적도 같음.
     v7.14.0: ''')
rep('h1::after{content:" v7.14.0"', 'h1::after{content:" v7.14.1"')
rep('<footer>굴의 전투판 v7.14.0', '<footer>굴의 전투판 v7.14.1')
rep('return `굴의 전투판 v7.14.0 · ${title}', 'return `굴의 전투판 v7.14.1 · ${title}')
rep("copyText('굴의 전투판 v7.14.0 자동 판 기록", "copyText('굴의 전투판 v7.14.1 자동 판 기록")
rep('의 버전 기록에 — v7.14.0 친칠라', '의 버전 기록에 — v7.14.1 엎드린 동료 위로 쏨 · 징검다리 지휘 / v7.14.0 친칠라')
rep('">v7.14.0 · 친칠라 · 은신 등급 · 특성 탭</span>', '">v7.14.1 · 엎드린 동료 위로 쏨 · 징검다리 지휘</span>')
rep("RULES_MIG = '7.14.0'", "RULES_MIG = '7.14.1'")
rep("['lie.hitR', '포복: 스치는 탄에 엎드린 몸 폭 ×']", "['lie.hitR', '포복: 스치는 탄에 엎드린 몸 폭 ×'], ['lie.over', '포복: 노리지 않은 엎드린 몸이 사선에 있을 때 맞을 확률 (서서 쏨 — 나머지는 위로 넘어감)'], ['lie.overLow', '포복: 같은데 쏘는 쪽도 엎드림 (낮게 날아감)'], ['cmdLinkX.hopT', '징검다리: 전하는 동료가 되외치는 데 (초)'], ['cmdLinkX.farT', '징검다리: 멀리 외칠수록 되풀이 (외침 거리 끝에서 + 초)'], ['cmdLinkX.signFar', '징검다리: 멀리 손짓할수록 눈 맞추기 (손짓 거리 끝에서 + 초)']")
rep("${LR.near}칸 밖에서 맞을 확률 ×${LR.hitFar} (곡사 · 투창 ×${LR.hitArc}) · ", "${LR.near}칸 밖에서 맞을 확률 ×${LR.hitFar} (곡사 · 투창 ×${LR.hitArc}) · 노린 게 아닌 탄은 거의 위로 넘어감 (${Math.round((LR.over != null ? LR.over : 0.08) * 100)}%) · ")
open(F, 'w', encoding='utf-8').write(s)
O = json.load(open(D + 'oldrules.json', encoding='utf-8'))
if not any(tuple(p) == ('cmdLinkX', 'hop2T') for p, _ in O): O.append([["cmdLinkX", "hop2T"], [0.6]])
json.dump(O, open(D + 'oldrules.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('page7141 OK')
