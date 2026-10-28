NAME = '적 지휘관 AI(작전·공동 표적·쐐기·포위·돌진 명령·협동 기동·임무판·영향 지도) 스위치'
# 원본은 이 묶음을 1진영(적)에게만 돌린다 (플레이어가 아군의 지휘관이라서). 우리 판은 "적도 유저처럼"이라 규칙 수치표의 staff1 로 켜고 끈다.
#   rules.staff1 === false → 적에게도 이 묶음을 돌리지 않음 (아군과 같은 조건)
#   그 밖(기본) → 원본 그대로
OLD1 = "if (side === 1 && known.length && awake && !AI6.includes('plan')) planPlan("
NEW1 = "if (side === 1 && W.rules.staff1 !== false && known.length && awake && !AI6.includes('plan')) planPlan("
OLD2 = "if (side === 1 && known.length && awake && coord){ planFocus("
NEW2 = "if (side === 1 && W.rules.staff1 !== false && known.length && awake && coord){ planFocus("
OLD3 = "if (side === 1){ opTick(W, coord);"
NEW3 = "if (side === 1 && W.rules.staff1 !== false){ opTick(W, coord);"


def apply(s):
    for o, n in ((OLD1, NEW1), (OLD2, NEW2), (OLD3, NEW3)):
        if s.count(o) != 1:
            raise Exception('찾는 줄이 %d 번 나옴: %s' % (s.count(o), o))
        s = s.replace(o, n)
    return s
