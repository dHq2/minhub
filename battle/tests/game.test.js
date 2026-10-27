// 캠페인 층 시험: 런 · 적 편성 · 판 결과 반영 · 영구 손실 · 보상 · 전리품 · 성장 · 저장 · 기록
const { load, ok, done } = require('./lib.js');
const GB = load(), E = GB.E;

const run = GB.Campaign.create(777);
ok(run.roster.length === 4 && run.stage === 1, '런 시작: 4인, 1단계');
const en = GB.Campaign.enemyDesigns(run);
ok(en.length === 3 && en.some(p => GB.kindOf(p) === 'arc') && en.some(p => GB.kindOf(p) === 'tank'), '1단계 적 3인 (방어 · 사수 포함)');
ok(en.every(p => (p.gear.몸 ? p.gear.몸.size === p.sizeCls : true)), '장비 체급이 몸 크기와 같음');

// 여러 단계를 AI에게 맡겨 진행 (아군도 자동): 영구 손실 · 보상 · 단계 증가 · 저장 직렬화
let stages = 0, lostTotal = 0, rewards = 0, grown = 0, loot = 0;
const r2 = GB.Campaign.create(41);
for (let i = 0; i < 12 && !r2.over; i++) {
  const B = GB.Campaign.makeBattle(r2);
  B.runToEnd();
  const n0 = r2.roster.length;
  const o = GB.Campaign.finish(r2, B);
  lostTotal += o.lost.length; rewards += o.rewards.length; grown += o.grown.length; loot += o.loot; stages++;
  ok(r2.roster.length === n0 - o.lost.length + o.rewards.length, '단계 ' + (stages) + ' ' + o.outcome + ': 손실 ' + o.lost.length + ' 보상 ' + (o.rewards.map(p => p.name).join('+') || '-') + ' 보유 ' + r2.roster.length + ' 전리품 ' + o.loot);
  JSON.parse(JSON.stringify(r2));  // 저장 가능
  if (o.outcome === 'win') { const rec = GB.BattleLog.make(B, r2, o); ok(rec.events.length > 0 && GB.BattleLog.text(rec).length > 100, '기록 생성 (' + rec.events.length + '건)'); }
}
console.log('      진행 ' + stages + '판 · 손실 ' + lostTotal + ' · 보상 ' + rewards + ' · 성장 ' + grown + ' · 전리품 ' + loot + ' · 최종 단계 ' + r2.stage);
ok(stages >= 3 || r2.over, '캠페인이 이어짐 (또는 전멸로 종료)');

// 전리품 장착 · 크기 규칙
const rr = GB.Campaign.create(5);
const mid = rr.roster[3];              // 사수1 (중형, 맨몸)
const armor = { id: 'x1', k: 'armor', name: '사슬 갑옷', mat: '사슬', tier: 2, dur: 80, size: '중형' };
const small = { id: 'x2', k: 'armor', name: '사슬 갑옷', mat: '사슬', tier: 2, dur: 80, size: '소형' };
ok(!GB.Loot.wearWhy(mid, armor), '중형 갑옷은 중형이 입음');
ok(!!GB.Loot.wearWhy(mid, small), '소형 갑옷은 중형에게 작아서 못 입음: ' + GB.Loot.wearWhy(mid, small));
GB.Loot.putOn(mid, armor); ok(mid.gear.몸 && mid.gear.몸.mat === '사슬', '갑옷을 입힘');
const old = GB.Loot.takeOff(mid, '몸'); ok(old && old.k === 'armor' && !mid.gear.몸, '벗겨 창고로');

// 저장소 (localStorage 없는 환경에서도 동작)
GB.Store.saveRun(r2); ok(GB.Store.loadRun() && GB.Store.loadRun().id === r2.id, '런 저장/불러오기');
// 철수: 일찍 빠지면 살아 나가고, 단계는 그대로이며, 보상은 없다
{
  const r = GB.Campaign.create(9), n0 = r.roster.length, st0 = r.stage, B = GB.Campaign.makeBattle(r);
  B.autoPause.on = false; B.start(); B.advance(0.5); GB.Orders.retreat(B);
  let g = 0; while (!B.over && g++ < 400) B.advance(0.5);
  ok(B.over && B.result === 'retreat' && B.escaped.length > 0, '철수: 결과 ' + B.result + ', 빠져나감 ' + B.escaped.length + '/' + n0 + ' (t=' + B.W.t.toFixed(0) + ')');
  const o = GB.Campaign.finish(r, B);
  ok(o.outcome === 'retreat' && r.stage === st0 && !o.rewards.length && !r.over, '철수 결과 반영: 단계 그대로 · 보상 없음 · 런 계속');
  ok(r.roster.length === n0 - o.lost.length && r.roster.length >= B.escaped.length, '살아 나간 동료는 남고 못 나간 동료만 잃음 (손실 ' + o.lost.length + ')');
}
done();
