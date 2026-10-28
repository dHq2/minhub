// 지휘 체계 · 기술 시험: 명령이 닿는 거리 · 소음 · 새 명령이 옛 명령에 씹히지 않음 · 돌격 쿨타임 · 투창은 창이 있을 때만 · 응급처치
const { load, ok, done } = require('./lib.js');
const GB = load(), E = GB.E, O = GB.Orders;

function mk(seed, n, stage) {
  const run = GB.Campaign.create(seed); run.stage = stage || 5; const rng = GB.rng(seed * 7 + 1);
  while (run.roster.length < n) { const p = GB.genDesign(rng, { power: 3, uid: 'c' + run.roster.length }); p.name = 'c' + run.roster.length; run.roster.push(p); }
  const B = GB.Campaign.makeBattle(run); B.start(); return B;
}
const run1 = (B, t) => { while (B.W.t < t && !B.over) B.advance(0.25); };

// 1) 지휘 거리 · 소음: 조용할 땐 외침이 멀리(규칙 hear), 싸움이 시끄러울수록 줄어든다. 코앞(2.5칸)과 대장-부하는 바로
{
  const B = mk(11, 10, 6), W = B.W; run1(B, 1);
  const C = E.cmdBoss(W, 0), quiet = E.hearR(W, C, null);
  ok(C && quiet >= 9, '조용할 때 외침 닿는 거리 ' + quiet.toFixed(1) + '칸 (규칙 hear ' + E.DEFAULT_RULES.hear + ')');
  run1(B, 16);
  const loud = E.hearR(W, E.cmdBoss(W, 0), null);
  ok(loud < quiet, '시끄러운 싸움 중엔 줄어듦: ' + quiet.toFixed(1) + ' → ' + loud.toFixed(1) + '칸 (소음 ' + E.dinAt(W, C.x, C.y).toFixed(1) + ')');
  const near = W.units.find(u => u.side === 0 && u.alive && u !== E.cmdBoss(W, 0) && Math.hypot(u.x - C.x, u.y - C.y) <= 2.4);
  if (near) ok(E.cmdLink(W, E.cmdBoss(W, 0), near).p === 1, '코앞 (2.5칸 안)은 소음에도 100%');
}

// 2) 대장 → 부하는 바로 닿음 (원본 v9.1.0)
{
  const B = mk(12, 6, 3), W = B.W, boss = W.units[0];
  O.chief(B, [2, 3], 0, 'follow'); run1(B, 2);
  const lk = E.cmdLink(W, E.cmdBoss(W, 0) === boss ? boss : E.cmdBoss(W, 0), W.units[2]);
  ok(E.cmdBoss(W, 0) !== boss || lk.p === 1, '대장의 말은 부하에게 100% (지휘관이 대장일 때)');
  const u = W.units[2], r = O.move(B, [2], u.x + 4, u.y);
  ok(r.ok && (u.order || u.ordPend), '부하에게 이동 명령이 걸림');
}

// 3) 가장 나중에 준 명령이 이긴다: 전달 중이던 옛 명령은 버려져 새 명령이 못 닿았을 때도 옛 명령이 뒤늦게 실행되지 않는다
{
  const B = mk(13, 8, 5), W = B.W; run1(B, 6);
  const C = E.cmdBoss(W, 0), far = W.units.filter(u => u.side === 0 && u.alive && u !== C && !(u.chiefLk && u.sqLead === C.i)).sort((a, b) => Math.hypot(b.x - C.x, b.y - C.y) - Math.hypot(a.x - C.x, a.y - C.y))[0];
  O.move(B, [far.i], far.x + 3, far.y); O.move(B, [far.i], far.x - 3, far.y + 2);
  const q = (far.ordQ || []).length + (far.ordPend && !(far.ordQ || []).includes(far.ordPend) ? 1 : 0);
  ok(q <= 1, '명령을 연달아 주면 전달 줄에 가장 나중 것만 남음 (줄 ' + q + ')');
}

// 4) 못 들은 명령(✗) 재전달
{
  const B = mk(14, 6, 3), W = B.W; run1(B, 3);
  const u = W.units[1]; u.missO = { k: 'move', x: u.x + 3, y: u.y }; u.missT = W.t; u.order = null;
  const r = O.resend(B, [1]); ok(r.ok, '재전달: ' + r.msg);
  ok(!!(u.order || u.ordPend), '재전달한 명령이 걸림');
}

// 5) 돌격 쿨타임: 쓰고 나면 쿨타임 동안은 거절, 끝나면 다시 가능
{
  const B = mk(15, 8, 4), W = B.W; run1(B, 4);
  const u = W.units.find(x => x.side === 0 && x.alive && x.canCharge), foe = W.units.find(x => x.side === 1 && x.alive);
  foe.seenBy = true; u.chargeCd = W.t + 5;
  const s = GB.Skills.charge(W, u), r = O.charge(B, [u.i], foe, null, {});
  ok(s.has && !s.ready && s.cd > 4 && !r.ok && /쿨타임/.test(r.msg), '돌격 쿨타임 중엔 거절: ' + r.msg);
  u.chargeCd = W.t - 1; ok(GB.Skills.charge(W, u).ready && O.charge(B, [u.i], foe, null, {}).ok, '쿨타임이 끝나면 돌격 명령이 걸림');
  ok(W.rules.charge.cd === GB.TUNE.chargeCd, '돌격 쿨타임 값 ' + W.rules.charge.cd + '초 (TUNE.chargeCd)');
}

// 6) 투창은 창을 손에 들었을 때만
{
  const B = mk(16, 6, 3), W = B.W, foe = W.units.find(x => x.side === 1);
  foe.seenBy = true;
  const sp = W.units.find(x => x.side === 0 && x.jav && x.spearHeld), no = W.units.find(x => x.side === 0 && !x.jav);
  ok(!!sp && GB.Skills.jav(W, sp).ready && O.throwAt(B, [sp.i], foe).ok, '창을 든 아군은 투창 가능');
  ok(!!no && !GB.Skills.jav(W, no).has && !O.throwAt(B, [no.i], foe).ok, '창이 없는 아군은 투창 기술 자체가 없음');
  sp.spearHeld = false; ok(!GB.Skills.jav(W, sp).ready && /창이 없어요/.test(GB.Skills.jav(W, sp).why), '던지고 나면(손에 없음) 못 던짐: ' + GB.Skills.jav(W, sp).why);
}

// 7) 응급처치: 의무 스킬이 있는 이만, 다친 아군에게 명령 (원본 giveSkill)
{
  const B = mk(17, 6, 3), W = B.W; run1(B, 2);
  const med = W.units.find(x => x.side === 0 && x.skill && x.skill.kit), other = W.units.find(x => x.side === 0 && x !== med && x.alive && !(x.skill && x.skill.kit));
  ok(!!med && GB.Skills.heal(W, med).ready, '의무병(붉은 십자)은 응급처치 가능, 남은 약 ' + (med && med.skill.left));
  other.hp = other.max * 0.4;
  const r = O.skill(B, [med.i], other); ok(r.ok && (med.order || med.ordPend), '응급처치 명령: ' + r.msg);
  ok(!O.skill(B, [other.i], med).ok, '의무 스킬이 없는 이는 응급처치 명령 불가');
}

// 8) 평균 도달률: 지휘관에게서 10칸 안, 싸움 중에도 명령이 대부분 닿음 (원본 지휘망 · 소음 포함)
{
  let n = 0, hit = 0;
  for (let r = 0; r < 6; r++) {
    const B = mk(40 + r, 10, 6), W = B.W;
    for (const T of [3, 8, 14]) {
      run1(B, T); if (B.over) break;
      const C = E.cmdBoss(W, 0); if (!C) continue;
      const A = W.units.filter(u => u.side === 0 && u.alive && u !== C && Math.hypot(u.x - C.x, u.y - C.y) <= 10);
      const wv = E.cmdWave(W, C, A); wv.forEach(l => { n++; if (l.p >= 0.8) hit++; });
    }
  }
  ok(n > 30 && hit / n > 0.8, '지휘관 10칸 안 아군의 명령 도달 확률 80% 이상이 ' + Math.round(hit / n * 100) + '% (' + n + '건)');
}
done();
