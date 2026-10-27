#!/usr/bin/env node
/* 자동 플레이 측정: 캠페인을 정책(policy)으로 끝까지(전멸할 때까지) 여러 런 돌려 통계를 낸다.
 *   node tools/playbot/run.js [--runs 20] [--policy auto] [--max-stage 15] [--seed 100] [--v]
 * 정책은 tools/playbot/policies.js 에 있다. 정책은 판 시작 전(prep)과 매 턴(turn) 훅으로 명령을 낸다. */
const path = require('path');
const { load } = require(path.join(__dirname, '..', '..', 'tests', 'lib.js'));
const policies = require('./policies.js');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i < 0 ? d : (process.argv[i + 1] === undefined || process.argv[i + 1][0] === '-' ? true : process.argv[i + 1]); };
const RUNS = +arg('runs', 20), POL = arg('policy', 'auto'), MAXS = +arg('max-stage', 15), SEED0 = +arg('seed', 100), VERB = !!arg('v', false);
const ENROE = arg('enemy-roe', '');
const BENCH = +arg('bench', 0);   // >0: 캠페인 대신 '단계 N 고정, 보유 N+3명 상당' 판만 여러 씨앗으로 돌려 승률·손실만 비교
const GB = load();
const tn = arg('tune', ''); if (tn && tn !== true) tn.split(',').forEach(kv => { const [k, v] = kv.split('='); GB.TUNE[k] = +v; });
const pol = policies[POL]; if (!pol) { console.error('정책 없음:', POL, Object.keys(policies)); process.exit(1); }

function playBattle(B) {
  B.autoPause.on = false;
  if (ENROE) B.W.units.filter(u => u.side === 1).forEach(u => { u.roe = ENROE; });
  pol.prep && pol.prep(GB, B);
  B.start();
  let guard = 0, nextTurn = B.W.turn;
  while (!B.W.over && B.W.t < B.rules.tmax && guard++ < 1e6) {
    B.advance(0.25);
    if (pol.turn && B.W.turn !== nextTurn) { nextTurn = B.W.turn; pol.turn(GB, B); }
    pol.tick && pol.tick(GB, B);
  }
  return B;
}
if (BENCH) {
  let win = 0, lost = 0, n0 = 0, t = 0, draw = 0, N = RUNS;
  for (let r = 0; r < N; r++) {
    const run = GB.Campaign.create(SEED0 + r); run.stage = BENCH;
    const rng = GB.rng(SEED0 + r * 7919);
    while (run.roster.length < Math.min(20, 3 + BENCH)) { const p = GB.genDesign(rng, { power: run.stage * 0.7, uid: 'b' + run.roster.length }); p.name = '신병' + run.roster.length; run.roster.push(p); }
    const B = GB.Campaign.makeBattle(run); const a0 = run.roster.length;
    playBattle(B);
    n0 += a0; lost += a0 - B.alive(0).length; t += B.W.t;
    if (B.result === 'win') win++; else if (B.result !== 'lose') draw++;
  }
  console.log(`bench 단계${BENCH} 정책 ${POL}: 승률 ${(win / N * 100).toFixed(0)}% 시간초과 ${draw} 평균 ${(t / N).toFixed(0)}초 아군 손실률 ${(lost / n0 * 100).toFixed(0)}%`);
  process.exit(0);
}
const agg = { stages: [], peak: [], wins: 0, losses: 0, draws: 0, time: [], lostPerWin: [], idle: [], deaths: 0 };
const perStage = {};
for (let r = 0; r < RUNS; r++) {
  const run = GB.Campaign.create(SEED0 + r);
  let nb = 0;
  while (!run.over && run.stage <= MAXS && nb++ < 80) {
    const B = GB.Campaign.makeBattle(run);
    const n0 = run.roster.length, e0 = B.alive(1).length;
    playBattle(B);
    const st = run.stage, res = B.result;
    const aliveA = B.alive(0).length, aliveE = B.alive(1).length;
    const S = perStage[st] = perStage[st] || { n: 0, win: 0, lose: 0, draw: 0, t: 0, lost: 0, allies: 0, left: 0 };
    S.n++; S.retreat = (S.retreat || 0) + (res === 'retreat' ? 1 : 0); S.t += B.W.t; S.allies += n0; S.lost += n0 - aliveA; S.left += aliveE;
    if (res === 'win') S.win++; else if (res === 'lose') S.lose++; else if (res === 'retreat') { } else S.draw++;
    if (VERB) console.log(`run${r} st${st} ${res} t=${B.W.t.toFixed(0)} ${n0}v${e0} 아군생존 ${aliveA} 적생존 ${aliveE}`);
    const out = GB.Campaign.finish(run, B); run.peakRoster = Math.max(run.peakRoster || 0, run.roster.length);
    if (out.over || (!run.roster.length)) run.over = true;
    if (out.outcome === 'draw') break;
    if (out.outcome === 'retreat') agg.retreats = (agg.retreats || 0) + 1;   // 시간초과 → 런을 끊어 통계에서 따로 센다
  }
  agg.stages.push(run.stage); agg.peak.push(run.peakRoster || 0);
}
agg.stages.sort((a, b) => a - b);
const med = agg.stages[agg.stages.length >> 1], mean = agg.stages.reduce((a, b) => a + b, 0) / agg.stages.length;
console.log(`정책 ${POL} · ${RUNS}런 · 도달 단계 중앙값 ${med} 평균 ${mean.toFixed(1)} (최소 ${agg.stages[0]} 최대 ${agg.stages[agg.stages.length - 1]}) · 최대 보유 평균 ${(agg.peak.reduce((a, b) => a + b, 0) / agg.peak.length).toFixed(1)} · 철수 ${agg.retreats || 0}회`);
console.log('단계 | 판수 | 승 | 패 | 시간초과 | 철수 | 평균초 | 아군(시작) | 아군 손실 | 적 잔존');
Object.keys(perStage).map(Number).sort((a, b) => a - b).forEach(k => {
  const s = perStage[k];
  console.log(`${String(k).padStart(3)} | ${String(s.n).padStart(3)} | ${String(s.win).padStart(3)} | ${String(s.lose).padStart(3)} | ${String(s.draw).padStart(3)} | ${String(s.retreat || 0).padStart(3)} | ${(s.t / s.n).toFixed(0).padStart(4)} | ${(s.allies / s.n).toFixed(1).padStart(5)} | ${(s.lost / s.n).toFixed(1).padStart(5)} | ${(s.left / s.n).toFixed(1)}`);
});
