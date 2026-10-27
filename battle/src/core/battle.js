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
  // 자동 정지 (림월드의 알림 정지): 켜 두면 접촉 · 아군 쓰러짐에서 멈춰 계획을 다시 짤 수 있다
  this.autoPause = { on: true, contact: true, down: true };
  this.pauseWhy = '';
  this._scanIdx = 0; this._lastAP = -99; this._contacted = false; this._proxT = 0;
};
GB.Battle.prototype = {
  get over() { return !!this.W.over; },
  get result() { return this.W.result; },
  // 전투 개시: 0초 명령은 바로 걸린 채 첫 턴을 연다
  start() {
    if (this.started) return;
    this.started = true; this.paused = false;
    E.beginTurn(this.W);
  },
  togglePause() { if (!this.started) this.start(); else { this.paused = !this.paused; if (!this.paused) this.pauseWhy = ''; } },
  // 실시간 dt(초) 만큼 진행. 반환: 진행한 시뮬레이션 초
  advance(dt) {
    const W = this.W;
    if (!this.started || this.paused || W.over) return 0;
    let budget = dt * this.speed, done = 0, guard = 0;
    while (budget > 1e-9 && !W.over && guard++ < 600) {
      const s = Math.min(GB.STEP, budget, W.turnEnd - W.t);
      if (s <= 1e-9) { this._turnEnd(); if (this.paused) break; continue; }
      E.stepWorld(W, s); budget -= s; done += s;
      if (this._scan()) break;
      if (W.t >= W.turnEnd - 1e-6) { this._turnEnd(); if (this.paused) break; }
    }
    return done;
  },
  // 새 로그를 훑어 멈출 사건이 있으면 멈추고 true. 같은 사건이 몰려도 3초에 한 번만.
  _scan() {
    const W = this.W, L = W.log, ap = this.autoPause; let why = '';
    for (; this._scanIdx < L.length; this._scanIdx++) {
      if (!ap.on || why) continue;
      const e = L[this._scanIdx];
      if (e.k === 'die' && ap.down) { const v = W.units[e.b]; if (v && v.side === 0 && !v.summon) why = '아군 쓰러짐: ' + v.name; }
    }
    // 접근: 양쪽이 이 거리(칸) 안으로 처음 들어오면 한 번 — 시야 제한이 없어 엔진의 contact 는 0초에 떠서 쓸 수 없음
    if (ap.on && ap.contact && !this._contacted && !why && W.t >= this._proxT) {
      this._proxT = W.t + 0.2;
      const A = W.units.filter(u => u.alive && u.side === 0), F = W.units.filter(u => u.alive && u.side === 1);
      let d = 1e9; for (const a of A) for (const f of F) { const q = Math.hypot(a.x - f.x, a.y - f.y); if (q < d) d = q; }
      if (d < GB.TUNE.pauseDist) { this._contacted = true; why = '적이 가까워졌어요'; }
    }
    if (!why || W.over || W.t - this._lastAP < 3) return false;
    this._lastAP = W.t; this.paused = true; this.pauseWhy = why; return true;
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
    this.autoPause.on = false; this.start(); this.paused = false;
    const lim = maxT || this.rules.tmax;
    while (!this.W.over && this.W.t < lim + 1) this.advance(1);
    return this.W.result;
  },
  alive(side) { return this.W.units.filter(u => u.alive && u.side === side); },
  unit(i) { return this.W.units[i]; }
};
