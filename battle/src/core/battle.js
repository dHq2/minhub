/* 전투 한 판: 엔진 월드(W) 를 만들고 진행한다.
 *  - 판 설정은 흰 격자 (type 'grid'), 조명 최대 (amb 1) · 시야 무한 → 횃불 · 시야 개념 없음
 *  - 턴: 수치표 turn(초) 마다 beginTurn/endTurn. 턴이 끝나면 멈추는 모드(stepMode) 와 이어서 재생하는 모드가 있다.
 *  - 같은 씨앗 · 같은 명령이면 같은 결과 (엔진 W.rand) */
GB.STEP = 1 / 30;

GB.Battle = function (opt) {
  const A = opt.allies, F = opt.enemies;
  this.map = GB.mapFor(Math.max(A.length, F.length));
  this.rules = GB.makeRules(Object.assign({ tmax: 600 }, opt.rules || {}));
  const units = [];
  A.forEach(p => units.push(GB.toEngine(p, 0)));
  F.forEach(p => units.push(GB.toEngine(p, 1)));
  this.setup = { type: 'grid', W: this.map.W, H: this.map.H, seed: opt.seed || 1, units: units, torches: [], flips: [], amb: 1, name: opt.name || '' };
  this.W = E.createWorld(this.setup, this.rules, opt.seed || 1, { headless: true });
  this.byUid = {};
  this.W.units.forEach(u => { this.byUid[u.pid] = u; });
  this.paused = true;           // 준비 단계(0초)에서는 멈춰 있음
  this.stepMode = false;        // true: 턴이 끝날 때마다 멈춤
  this.speed = 1;
  this.started = false;
  this.cmdLog = [];             // 우리가 낸 명령 기록 (내보내기용)
  this.seed = opt.seed || 1;
  this.retreating = false; this.escaped = [];   // 철수 중 · 빠져나간 동료(uid)
};
GB.Battle.prototype = {
  get over() { return !!this.W.over; },
  // 철수해 일부라도 빠져나갔고 남은 아군이 없으면 'retreat' (엔진은 'lose'로 끝냄)
  get result() { const r = this.W.result; return r === 'lose' && this.escaped.length ? 'retreat' : r; },
  // 전투 개시: 0초 명령은 바로 걸린 채 첫 턴을 연다
  start() {
    if (this.started) return;
    this.started = true; this.paused = false;
    E.beginTurn(this.W);
  },
  togglePause() { if (!this.started) this.start(); else this.paused = !this.paused; },
  // 실시간 dt(초) 만큼 진행. 반환: 진행한 시뮬레이션 초
  advance(dt) {
    const W = this.W;
    if (!this.started || this.paused || W.over) return 0;
    let budget = dt * this.speed, done = 0, guard = 0;
    while (budget > 1e-9 && !W.over && guard++ < 600) {
      const s = Math.min(GB.STEP, budget, W.turnEnd - W.t);
      if (s <= 1e-9) { this._turnEnd(); if (this.paused) break; continue; }
      E.stepWorld(W, s); budget -= s; done += s;
      if (this.retreating) this._retreatTick();
      if (W.t >= W.turnEnd - 1e-6) { this._turnEnd(); if (this.paused) break; }
    }
    return done;
  },
  // 철수 중: 자기 쪽 가장자리에 닿은 아군은 판을 떠남. 엔진 leaveMap 은 alive=false + gone 을 세움
  _retreatTick() {
    const W = this.W;
    for (const u of W.units) {
      if (u.side !== 0 || !u.alive || u.gone || u.summon) continue;
      if (u.x - u.r <= 1.3) { E.leaveMap(W, u, 'left'); this.escaped.push(u.pid); }
    }
  },
  _turnEnd() {
    const W = this.W;
    E.endTurn(W);
    if (W.over) return;
    if (this.stepMode) this.paused = true;
    E.beginTurn(W);
  },
  // 한 턴만 진행(멈춘 상태에서 "한 턴" 단추)
  stepTurn() {
    if (!this.started) this.start();
    const W = this.W;
    this.paused = false;
    const prevMode = this.stepMode; this.stepMode = true;
    const turn0 = W.turn;
    let guard = 0;
    while (!W.over && !this.paused && guard++ < 100000) this.advance(GB.STEP * 4);
    this.stepMode = prevMode;
    return W.turn - turn0;
  },
  // 끝까지 (헤드리스): 시험 · 자동 전투용
  runToEnd(maxT) {
    this.start(); this.paused = false;
    const lim = maxT || this.rules.tmax;
    while (!this.W.over && this.W.t < lim + 1) this.advance(1);
    return this.W.result;
  },
  alive(side) { return this.W.units.filter(u => u.alive && u.side === side); },
  unit(i) { return this.W.units[i]; }
};
