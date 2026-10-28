/* 수치표: 엔진 기본값(DEFAULT_RULES)을 복제하고, 우리 판에 맞게 바꾼 칸만 여기에 모아 둔다.
 * 바꾼 칸마다 까닭을 적는다 — 원본이 새로 나와도 이 목록만 보면 무엇이 우리 설정인지 안다. */
GB.OVERRIDES = {
  sight: [999, '시야 개념 없음 (민수 명세): 보이는 거리를 무한으로'],
  spareTorches: [0, '횃불 없음'],
  // roe 는 중첩이라 아래 makeRules 에서 따로 넣는다 (기본 교전 규칙)
  tmax: [600, '대규모(10~20명) 판은 300초가 모자람 — 시간 제한을 늘림']
};
GB.makeRules = function (extra) {
  const R = GB.clone(E.DEFAULT_RULES);
  for (const k in GB.OVERRIDES) R[k] = GB.OVERRIDES[k][0];
  // 전리품: 기동 · 사수가 맨몸으로 시작하므로 루팅이 넉넉해야 한다 (원본 armorP 0.25 · helmP 0.3 → 올림)
  R.loot = Object.assign({}, R.loot, { armorP: 0.5, helmP: 0.55 });
  // 기본 교전 규칙: 원본에서 적(1진영)은 늘 '자유'인데 아군 기본은 '판단'이라 가만히 먼저 맞아 줌 → 같은 조건으로 맞춘다.
  // (측정: 같은 전력 6단계 100판 승률 판단 50% → 자유 70%). 플레이어는 태세 탭에서 언제든 바꿀 수 있다.
  R.roe = Object.assign({}, R.roe, { def: GB.TUNE.allyRoe });
  // 적 지휘관 AI 묶음 (tools/patches/10): 1이면 원본처럼 적에게만 돌림, 0이면 적도 아군과 같은 조건
  R.staff1 = GB.TUNE.enemyStaff ? undefined : false;
  if (extra) Object.assign(R, extra);
  return R;
};
