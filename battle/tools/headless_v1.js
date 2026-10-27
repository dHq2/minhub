#!/usr/bin/env node
/* 굴 전투판 v1 · 헤드리스 시험 도구
 * 사용: node battle/tools/headless_v1.js [판수] [모드]
 *   모드: mirror(AI vs AI, 적은 단계 성장) | sym(같은 편성 AI 대칭) | vsrush(AI vs 돌진) | vspassive(AI vs 제자리) | det(결정론 검사)
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..', 'js');
const ctx = { console: console, Math: Math, JSON: JSON, Date: Date };
ctx.globalThis = ctx;
vm.createContext(ctx);
['core', 'data', 'log', 'command', 'sim', 'ai'].forEach(f => vm.runInContext(fs.readFileSync(path.join(dir, f + '.js'), 'utf8'), ctx, { filename: f + '.js' }));
const BG = ctx.BG;

function runBattle(seed, stage, mode, opts) {
  opts = opts || {};
  const rng = new BG.Rng(seed);
  BG.setUidCounter(1);
  const ally = BG.startRoster(rng);
  const n = opts.n || 4;
  while (ally.length < n) ally.push(BG.genUnit(rng, 0));
  const enemy = (mode === 'sym') ? JSON.parse(JSON.stringify(ally)).map(u => { u.uid = BG.newUid(); return u; }) : BG.genEnemies(rng, n, stage);
  const W = BG.sim.create({ seed: seed, stage: stage, ally: ally, enemy: enemy });
  const ai = () => BG.AI.create();
  if (mode === 'mirror' || mode === 'sym') { BG.sim.setController(W, 'ally', ai()); BG.sim.setController(W, 'enemy', ai()); }
  else if (mode === 'vsrush') { BG.sim.setController(W, 'ally', ai()); BG.sim.setController(W, 'enemy', BG.AI.createRush()); }
  else if (mode === 'vspassive') { BG.sim.setController(W, 'ally', BG.AI.createPassive()); BG.sim.setController(W, 'enemy', ai()); }
  else if (mode === 'rushvsai') { BG.sim.setController(W, 'ally', BG.AI.createRush()); BG.sim.setController(W, 'enemy', ai()); }
  BG.sim.startBattle(W);
  let guard = 0;
  while (W.phase === 'run' && guard++ < 40000) BG.sim.step(W);
  return W;
}

function summarize(W) {
  const a = BG.sim.alive(W, 'ally').length, e = BG.sim.alive(W, 'enemy').length;
  return { winner: W.result.winner, t: W.result.t, a: a, e: e, ff: W.stats.ff, shots: W.stats.shots, hits: W.stats.hits, ev: W.log.events.length };
}

const N = parseInt(process.argv[2] || '20', 10), mode = process.argv[3] || 'mirror';

if (mode === 'det') {
  const sig = W => JSON.stringify(W.log.events) + W.units.map(u => u.x.toFixed(4) + u.y.toFixed(4) + u.hp.toFixed(3)).join();
  const A = runBattle(12345, 3, 'mirror'), B = runBattle(12345, 3, 'mirror');
  console.log('결정론:', sig(A) === sig(B) ? 'OK (동일 시드 → 동일 결과)' : 'FAIL', summarize(A));
  process.exit(sig(A) === sig(B) ? 0 : 1);
}

const agg = { ally: 0, enemy: 0, draw: 0 }, tt = [], ffs = [], shotsA = [];
const rows = [];
for (let i = 0; i < N; i++) {
  const W = runBattle(1000 + i * 7, 1 + (i % 6), mode, { n: 4 + (i % 3) });
  const s = summarize(W);
  agg[s.winner]++; tt.push(s.t); ffs.push(s.ff); shotsA.push(s.shots);
  rows.push(s);
}
const avg = a => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1);
console.log('모드 ' + mode + ' · ' + N + '판 → 아군 ' + agg.ally + ' / 적 ' + agg.enemy + ' / 무승부 ' + agg.draw);
console.log('평균 시간 ' + avg(tt) + 's, 오사 ' + avg(ffs) + '회/판, 사격 ' + avg(shotsA) + '회/판');
if (process.argv[4] === 'v') rows.forEach((r, i) => console.log(i, JSON.stringify(r)));
