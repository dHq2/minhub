/* 수치표: 엔진 기본값(DEFAULT_RULES)을 복제하고, 우리 판에 맞게 바꾼 칸만 여기에 모아 둔다.
 * 바꾼 칸마다 까닭을 적는다 — 원본이 새로 나와도 이 목록만 보면 무엇이 우리 설정인지 안다. */
GB.OVERRIDES = {
  sight: [999, '시야 개념 없음 (민수 명세): 보이는 거리를 무한으로'],
  spareTorches: [0, '횃불 없음'],
  tmax: [600, '대규모(10~20명) 판은 300초가 모자람 — 시간 제한을 늘림']
};
GB.makeRules = function (extra) {
  const R = GB.clone(E.DEFAULT_RULES);
  for (const k in GB.OVERRIDES) R[k] = GB.OVERRIDES[k][0];
  // 전리품: 기동 · 사수가 맨몸으로 시작하므로 루팅이 넉넉해야 한다 (원본 armorP 0.25 · helmP 0.3 → 올림)
  R.loot = Object.assign({}, R.loot, { armorP: 0.5, helmP: 0.55 });
  if (extra) Object.assign(R, extra);
  return R;
};
