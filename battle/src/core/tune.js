/* 균형 수치 한 곳 모음 (v3.1.0). 숫자를 바꾸고 싶으면 여기만 본다.
 *  tools/playbot/run.js --tune 이름=값,… 으로 덮어써 가며 비교할 수 있다. 원본 엔진 수치표(DEFAULT_RULES)는 건드리지 않는다. */
GB.TUNE = {
  allyRoe: 'free',      // 아군 기본 교전 규칙 (free 자유 · smart 판단 · hold 교전 금지) — 적은 엔진이 늘 free
  durability: 1.5,        // 모든 유닛 체력 배수 — 클수록 판이 길어지고 부상 · 응급처치 · 후퇴가 의미를 가짐
  enemyRatio0: 0.5,      // 1단계 적 수 / 아군 수
  enemyRatioUp: 0.03,     // 단계마다 늘어나는 비율
  enemyRatioMax: 1,     // 상한
  handicap0: 0.7,       // 1단계 적 체력·공격 배수 (초반 완화)
  handicapUp: 0.04,     // 단계마다 +
  handicapMax: 1,
  pauseDist: 11,        // 자동정지: 양쪽이 이 거리(칸) 안으로 들어오면 한 번 멈춤
  flawlessBonus: 1      // 한 명도 잃지 않은 승리에 더해지는 신규 동료 수
};
