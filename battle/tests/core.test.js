// 어댑터 시험: 설계 변환 · 판 진행 · 명령 · 규모
const { load, ok, done } = require('./lib.js');
const GB = load(), E = GB.E;

// 1) 설계 변환
const roster = GB.startRoster(5);
ok(roster.length === 4 && roster.map(p => p.name).join() === '탱커1,보병1,보병2,사수1', '시작 4인: 탱커1 보병1 보병2 사수1');
ok(roster[1].skill && roster[1].skill.kit && !roster[2].skill, '의무는 보병1 만 (첫 1명 보장)');
ok(roster[3].gear.몸 === undefined && roster[0].gear.몸 && roster[0].gear.머리, '사수는 맨몸 · 방어는 갑옷 + 투구');
ok(GB.kindOf(roster[0]) === 'tank' && GB.kindOf(roster[1]) === 'inf' && GB.kindOf(roster[3]) === 'arc', '병종 판별 (엔진 직업 · 역할에서)');

// 2) 4 대 4 한 판 끝까지, 같은 씨앗 → 같은 결과
function fight(seed, n) {
  const rng = GB.rng(seed);
  const A = n === 4 ? GB.startRoster(seed) : Array.from({ length: n }, () => GB.genDesign(rng, { power: 0 }));
  const F = Array.from({ length: n }, () => GB.genDesign(rng, { power: 0 }));
  const map = GB.mapFor(n); GB.deploy(A, 0, map); GB.deploy(F, 1, map);
  const B = new GB.Battle({ allies: A, enemies: F, seed: seed });
  const t0 = Date.now(); B.runToEnd();
  return { B, ms: Date.now() - t0 };
}
const r1 = fight(11, 4), r2 = fight(11, 4);
ok(r1.B.over && ['win', 'lose', 'time'].includes(r1.B.result), '4대4 판이 끝남: ' + r1.B.result + ' ' + r1.B.W.t.toFixed(1) + 's');
ok(JSON.stringify(r1.B.W.log.length) === JSON.stringify(r2.B.W.log.length) && r1.B.W.t === r2.B.W.t, '같은 씨앗 → 같은 결과 (결정론)');

// 3) 명령: 이동 · 공격 · 돌격이 엔진 명령 줄을 타고 닿음
{
  const rng = GB.rng(3), A = GB.startRoster(3), F = [0, 1, 2, 3].map(() => GB.genDesign(rng, {}));
  const map = GB.mapFor(4); GB.deploy(A, 0, map); GB.deploy(F, 1, map);
  const B = new GB.Battle({ allies: A, enemies: F, seed: 3 });
  const u0 = B.W.units[1];
  const mv = GB.Orders.move(B, [1], u0.x + 6, u0.y);
  ok(mv.ok && u0.order && u0.order.k === 'move', '이동 명령 (0초: 바로 걸림)');
  B.start(); const x0 = u0.x; B.advance(3);
  ok(u0.x > x0 + 2, '명령대로 걸어감 (' + (u0.x - x0).toFixed(1) + '칸)');
  const foe = B.W.units.find(u => u.side === 1);
  const at = GB.Orders.attack(B, [0, 1, 2], foe);
  ok(at.ok, '공격 명령: ' + at.msg);
  B.advance(0.5);
  ok(B.W.units[2].ordPend || B.W.units[2].order, '진행 중 명령은 지휘관을 거쳐 닿음 (대기 또는 도착)');
  const rl = GB.Orders.mate(B, [2, 3]);
  ok(rl.ok, '전우조 만들기: ' + rl.msg);
  const po = GB.Orders.posture(B, [0, 1], 'roe', 'hold');
  ok(po.ok, '교전 규칙 태세 명령');
}

// 3.6) 대칭: 같은 설계를 양쪽에 세우면(적에게만 주는 특혜가 없으면) 어느 쪽도 압도하지 않는다
{
  let win = 0, n = 36;
  for (let r = 0; r < n; r++) {
    const rng = GB.rng(900 + r * 7919), L = [];
    for (let i = 0; i < 5; i++) { const p = GB.genDesign(rng, { power: GB.TUNE.powerAt(4), uid: 'x' + i }); p.name = 'n' + i; L.push(p); }
    const mk = pre => L.map((p, i) => { const q = GB.clone(p); q.uid = pre + i; q.ref = 'G-' + pre + i; q.name = pre + i; return q; });
    const al = mk('a'), en = mk('e'), map = GB.mapFor(5); GB.deploy(al, 0, map); GB.deploy(en, 1, map);
    const B = new GB.Battle({ allies: al, enemies: en, seed: (GB.rng(r + 1)() * 4e9 >>> 0) || 1 }); B.runToEnd(); if (B.result === 'win') win++;
  }
  ok(win / n > 0.25 && win / n < 0.75, '대칭 시험: 같은 설계끼리 아군 승률 ' + Math.round(win / n * 100) + '% (' + n + '판, 25~75% 이내여야 공정)');
}

// 4) 규모: 10대10 · 20대20 이 돌고 시간이 합리적
for (const n of [10, 20]) {
  const r = fight(21 + n, n);
  console.log('      ' + n + '대' + n + ': ' + r.B.result + ' ' + r.B.W.t.toFixed(0) + 's · 계산 ' + r.ms + 'ms · 틱당 ' + (r.ms / (r.B.W.t * 30)).toFixed(2) + 'ms · 맵 ' + r.B.map.W + 'x' + r.B.map.H);
  ok(r.B.over, n + '대' + n + ' 판이 끝남');
}
done();
