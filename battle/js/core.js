/* 굴 전투판 v1 · core: 네임스페이스, 상수, 난수, 수학 유틸 */
(function (root) {
  'use strict';
  const BG = root.BG = root.BG || {};
  BG.VERSION = 'v1';

  BG.C = {
    DT: 0.05,          // 시뮬레이션 1틱(초)
    MAP_W: 64,         // 가로(m), 1칸 = 1m
    MAP_H: 40,
    MAX_T: 1200,       // 안전 종료(초). 교착 시 무승부 처리
    AI_EVERY: 0.5,     // AI 재판단 주기(초)
    ZONE_W: 14         // 배치 구역 폭(m)
  };

  // 결정론적 난수(mulberry32). 시드+명령 로그로 재현 가능하게 한다.
  function Rng(seed) { this.a = (seed >>> 0) || 1; }
  Rng.prototype.next = function () {
    this.a = (this.a + 0x6D2B79F5) | 0;
    let t = this.a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  Rng.prototype.range = function (a, b) { return a + (b - a) * this.next(); };
  Rng.prototype.int = function (a, b) { return Math.floor(this.range(a, b + 1)); };
  Rng.prototype.chance = function (p) { return this.next() < p; };
  Rng.prototype.pick = function (arr) { return arr[Math.floor(this.next() * arr.length)]; };
  Rng.prototype.gauss = function () { return (this.next() + this.next() + this.next() - 1.5) / 0.5; };
  Rng.prototype.weighted = function (obj) {
    let sum = 0, k;
    for (k in obj) sum += obj[k];
    let r = this.next() * sum;
    for (k in obj) { r -= obj[k]; if (r <= 0) return k; }
    return k;
  };
  BG.Rng = Rng;

  const U = BG.U = {};
  U.clamp = (v, a, b) => v < a ? a : (v > b ? b : v);
  U.lerp = (a, b, t) => a + (b - a) * t;
  U.dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  U.len = (x, y) => Math.hypot(x, y);
  U.ang = (dx, dy) => Math.atan2(dy, dx);
  U.angNorm = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  U.angDiff = (a, b) => U.angNorm(a - b);
  U.rot = (x, y, a) => ({ x: x * Math.cos(a) - y * Math.sin(a), y: x * Math.sin(a) + y * Math.cos(a) });
  U.r1 = v => Math.round(v * 10) / 10;
  U.r2 = v => Math.round(v * 100) / 100;
  U.fmtT = t => {
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  };
})(typeof window !== 'undefined' ? window : globalThis);
