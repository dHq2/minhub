/* 균형 수치 한 곳 모음 (v3.1.0). 숫자를 바꾸고 싶으면 여기만 본다.
 *  tools/playbot/run.js --tune 이름=값,… 으로 덮어써 가며 비교할 수 있다. 원본 엔진 수치표(DEFAULT_RULES)는 건드리지 않는다. */
GB.TUNE = {
  allyRoe: 'free',      // 아군 기본 교전 규칙 (free 자유 · smart 판단 · hold 교전 금지) — 적은 엔진이 늘 free
  durability: 1.5,        // 모든 유닛 체력 배수 — 클수록 판이 길어지고 부상 · 응급처치 · 후퇴가 의미를 가짐
  enemyRatio0: 0.75,    // 1단계 적 수 / 아군 수
  enemyRatioUp: 0.04,   // 단계마다 늘어나는 비율
  enemyRatioMax: 1.6,   // 상한 — 아군이 많을수록 적도 같이 많아짐
  powerPerStage: 0.7,   // 신규 동료와 적이 단계마다 얻는 power (같은 식 — 적에게만 주는 배율은 없음)
  uiSpeed: 0.5,         // 화면에서 전투를 시작할 때 재생 속도 (0.5x → 1x → 2x → 4x 순으로 바꿈)
  flawlessBonus: 1,     // 한 명도 잃지 않은 승리에 더해지는 신규 동료 수
  powerAt: function (stage) { return stage * GB.TUNE.powerPerStage; }
};
