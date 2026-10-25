# v9.7.1 페이지 — page9160.py v1.0 (v1.0: 상태 줄에 "지금 하는 일" (행동 이유 코드 → 짧은 글) · 엔진 patch9130 — 이유 코드 · 전우조는 싸움 · 전열 버팀 다음 · 제 편 오사 허용치 한 기준)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9150.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.7.0 (2026-10-25)', '<!-- 굴의 전투판 v9.7.1 (2026-10-25)')
rep('     v9.7.0: 리모델 시험판 UI 1단계', '''     v9.7.1: 생각 순서 고침 (리모델 P1a 1단계) — 저마다 "왜 이걸 하는지" 이유를 남기고 상태 줄에 보임 · 전우조 따라붙기는 싸움 · 전열 버팀 다음 (적이 팔 닿을 데 있으면 붙어 가기를 쉼) · 거구 휘두르기 · 곡사의 제 편 오사 조심은 양쪽 같은 기준
     v9.7.0: 리모델 시험판 UI 1단계''')
for a, b in (('h1::after{content:" v9.7.0"', 'h1::after{content:" v9.7.1"'), ('<footer>굴의 전투판 v9.7.0', '<footer>굴의 전투판 v9.7.1'), ('return `굴의 전투판 v9.7.0 · ${title}', 'return `굴의 전투판 v9.7.1 · ${title}'),
             ("copyText('굴의 전투판 v9.7.0 자동 판 기록", "copyText('굴의 전투판 v9.7.1 자동 판 기록"), ("o.push(`굴의 전투판 v9.7.0 — ${C.run", "o.push(`굴의 전투판 v9.7.1 — ${C.run"),
             ('의 버전 기록에 — v9.7.0 시험판 UI', '의 버전 기록에 — v9.7.1 생각 순서 (이유 코드) / v9.7.0 시험판 UI'),
             ('">v9.7.0 시험판 · 판 위 무기 그림 · 명령 칸 정리 (핵심 / 전술 / 고급) · 일행 상한 없음</span>', '">v9.7.1 시험판 · 지금 하는 일 (이유) 보임 · 전우조는 싸움 · 전열 다음 · 무기 그림 · 명령 칸 정리</span>'),
             ("ver: '9.7.0', kind:", "ver: '9.7.1', kind:"), ("RULES_MIG = '9.7.0',", "RULES_MIG = '9.7.1',")):
    rep(a, b)
rep("function selStateHtml(Wd, u){", """// v9.7.1 행동 이유 코드 → 짧은 글
const WHY_TXT = { UNIQUE: '고유 기술 판단', EMERGENCY_HEAL: '위급 — 약', RELOAD: '재장전', TAKE_HEAL: '약 받는 중', EVADE: '회피 기동', PLAYER_ORDER: '명령 수행', RALLY: '집결', COMMAND_UNHEARD: '연락 두절 — 스스로 판단',
  HAMMER: '망치 — 붙들린 적의 옆 · 뒤로', FILL_GAP: '전열 틈 메움', PIN_DOWN: '쓰러진 적을 누름', PAIR_LINK: '전우와 붙어 감', PAIR_KEEP: '전우 곁으로', PAIR_FLANK: '전우의 돌격 — 옆구리로', PAIR_REAR: '전우의 돌격 — 뒤에서 엄호',
  PAIR_PINCER: '전우와 포위', PAIR_RETREAT: '전우와 함께 물러남', FORMATION: '대형 자리', ENEMY_PLAN: '지휘관 임무', PATROL: '순찰', AMBUSH: '매복', WARDEN: '방 지킴', EVADE_AOE: '큰 공격 피함', LINE_RETREAT: '전열 후퇴',
  MANEUVER: '기동', DODGE_AIM: '총구 피함', HOLD_FORM: '진형 · 대치', TANK: '탱커 — 막아섬', LINE: '전열', PICKUP: '줍기', COVER: '방패 뒤로', FIGHT: '맞붙어 싸움', HUNT: '적에게 다가감', HEAL: '치유' };
function selStateHtml(Wd, u){""")
rep("  if (u.lie) g.push('🦎 포복'); if (u.stealth) g.push('🥷 은신');", "  if (u.lie) g.push('🦎 포복'); if (u.stealth) g.push('🥷 은신');\n  if (u.why && WHY_TXT[u.why]) g.push(`<b title=\"지금 하는 일 (생각한 이유)\">▶ ${WHY_TXT[u.why]}</b>`);   /* v9.7.1 */")
open(F, 'w', encoding='utf-8').write(s)
print('page9160 OK')
