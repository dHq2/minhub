/* 기술(스킬) 3개의 상태 한 곳: 돌격 · 투창 · 응급처치.  화면(단추 · 게이지)과 명령(Orders)이 같은 판정을 쓰도록 모았다.
 *  - 돌격: 돌진 가능한 몸(canCharge)만. 쓰고 나면 쿨타임(W.rules.charge.cd 초) — 엔진 u.chargeCd 는 "다시 쓸 수 있는 시각"
 *  - 투창: 창(또는 단검)을 손에 들고 있을 때만 (u.jav && u.spearHeld). 던지고 나면 사라지고, 주워야 다시 생김
 *  - 응급처치: 의무 스킬(u.skill.kit)이 있는 몸만. 횟수(left/pool)와 다음 사용 시각(cdT) */
GB.Skills = (function () {
  const clock = W => W.t;
  function charge(W, u) {
    const total = (W.rules.charge || {}).cd || 8;
    if (!u || !u.canCharge) return { has: false };
    const cd = Math.max(0, (u.chargeCd == null ? -9 : u.chargeCd) - clock(W));
    const why = u.crawl ? '기어다녀서 못 함' : cd > 0 ? '쿨타임 ' + cd.toFixed(1) + '초' : W.t < (u.brokenT || -9) ? '자세 무너짐' : '';
    return { has: true, ready: !why, cd: cd, total: total, why: why, frac: GB.clamp(1 - cd / total, 0, 1) };
  }
  function jav(W, u) {
    if (!u || !u.jav) return { has: false };
    const held = !!u.spearHeld, can = held && !u.crawl;
    return { has: true, ready: can, why: held ? (u.crawl ? '기어다녀서 못 함' : '') : '창이 없어요 (던졌으면 줍기)', held: held };
  }
  function heal(W, u) {
    if (!u || !u.skill || !u.skill.kit) return { has: false };
    const k = u.skill, cd = Math.max(0, (k.cdT == null ? -9 : k.cdT) - clock(W)), left = k.left == null ? k.pool : k.left;
    const why = left <= 0 ? '약이 떨어졌어요' : u.crawl ? '기어다녀서 못 함' : cd > 0 ? '준비 ' + cd.toFixed(1) + '초' : '';
    return { has: true, ready: !why, cd: cd, total: k.cd || 2.2, left: left, pool: k.pool, why: why, frac: GB.clamp(1 - cd / (k.cd || 2.2), 0, 1) };
  }
  // 고른 몸들의 요약: 하나라도 가진 이가 있나(has) · 바로 쓸 수 있나(ready) · 가장 짧은 대기(cd)
  function summary(W, units, fn) {
    const L = units.map(u => fn(W, u)).filter(s => s.has);
    if (!L.length) return { has: false };
    const rd = L.filter(s => s.ready), cd = Math.min.apply(null, L.map(s => s.cd == null ? 0 : s.cd));
    return { has: true, ready: rd.length > 0, nReady: rd.length, n: L.length, cd: rd.length ? 0 : cd, total: L[0].total, why: rd.length ? '' : L[0].why, left: L.reduce((a, s) => a + (s.left || 0), 0) };
  }
  return { charge: charge, jav: jav, heal: heal, summary: summary };
})();
