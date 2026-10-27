/* 자동 플레이 정책 모음. 각 정책: { prep(GB,B)?, turn(GB,B)?, tick(GB,B)? }
 * 새 정책은 여기에 이름으로 추가하면 run.js --policy 이름 으로 비교할 수 있다. */
const foes = B => B.W.units.filter(u => u.alive && u.side === 1 && !u.gone);
const mine = B => B.W.units.filter(u => u.alive && u.side === 0 && !u.gone && !u.summon);
const kindOf = u => (u.role || u.cls || '');
const near = (u, list) => list.reduce((b, f) => (!b || Math.hypot(f.x - u.x, f.y - u.y) < Math.hypot(b.x - u.x, b.y - u.y) ? f : b), null);
const centroid = L => ({ x: L.reduce((a, u) => a + u.x, 0) / L.length, y: L.reduce((a, u) => a + u.y, 0) / L.length });

module.exports = {
  auto: {},   // 명령 없음: 엔진 AI 가 알아서 (우리 편도 적과 같은 두뇌)

  // 전열 명령: 막는 병과는 전열(line), 나머지는 자동
  line: {
    prep(GB, B) {
      const L = mine(B).filter(u => u.shield || /탱|방패|tank/.test(kindOf(u)));
      if (L.length) GB.Orders.line(B, L.map(u => u.i));
    }
  },

  // 집중 사격: 매 턴 가장 약한(남은 체력 비율 낮은) 가까운 적을 모두가 공격
  focus: {
    turn(GB, B) {
      const F = foes(B), M = mine(B); if (!F.length || !M.length) return;
      const c = centroid(M);
      const tgt = F.slice().sort((a, b) => (Math.hypot(a.x - c.x, a.y - c.y) + 12 * a.hp / a.max) - (Math.hypot(b.x - c.x, b.y - c.y) + 12 * b.hp / b.max))[0];
      GB.Orders.attack(B, M.map(u => u.i), tgt, {});
    }
  },

  // 집중 + 전열: 방패는 전열, 나머지는 집중 공격
  focusline: {
    prep(GB, B) { module.exports.line.prep(GB, B); },
    turn(GB, B) {
      const F = foes(B), M = mine(B).filter(u => !u.shield); if (!F.length || !M.length) return;
      const c = centroid(M);
      const tgt = near({ x: c.x, y: c.y }, F);
      GB.Orders.attack(B, M.map(u => u.i), tgt, {});
    }
  },

  // 방어: 먼저 교전 금지로 모여 있다가, 적이 일정 거리 안으로 들어오면 자유 교전
  defend: {
    prep(GB, B) { GB.Orders.posture(B, mine(B).map(u => u.i), 'roe', 'hold'); },
    turn(GB, B) {
      const M = mine(B), F = foes(B); if (!M.length || !F.length || B._freed) return;
      const c = centroid(M), d = Math.min(...F.map(f => Math.hypot(f.x - c.x, f.y - c.y)));
      if (d < (B.defD || 14)) { B._freed = true; GB.Orders.posture(B, M.map(u => u.i), 'roe', 'free'); }
    }
  },

  // 자유 교전(먼저 친다)
  free: { prep(GB, B) { GB.Orders.posture(B, mine(B).map(u => u.i), 'roe', 'free'); } },

  // 모여서 전진: 처음에 모두 한 점(자기 진영 앞쪽 가운데)으로 모은 뒤 자동
  gather: {
    prep(GB, B) {
      const M = mine(B), z = GB.zone(B.map, 0), cx = (z.x0 + z.x1) / 2, cy = (z.y0 + z.y1) / 2;
      GB.Orders.move(B, M.map(u => u.i), cx, cy, {});
    }
  },

  // 공격이동 집중: 2턴마다 사수 외 전원이 가장 가까운 적 무리 쪽으로 공격이동 (가다가 만나는 적은 상대)
  amove: {
    turn(GB, B) {
      const F = foes(B), M = mine(B).filter(u => GB.kindOf(u) !== 'arc'); if (!F.length || !M.length) return;
      const c = centroid(M), t = near(c, F);
      GB.Orders.move(B, M.map(u => u.i), t.x, t.y, { kind: 'amove' });
    }
  },

  // 사수만 집중 사격(가장 위험한 가까운 적), 나머지는 자동
  arcfocus: {
    turn(GB, B) {
      const F = foes(B), A = mine(B).filter(u => GB.kindOf(u) === 'arc'); if (!F.length || !A.length) return;
      const c = centroid(A), t = F.slice().sort((a, b) => (Math.hypot(a.x - c.x, a.y - c.y) + 8 * a.hp / a.max) - (Math.hypot(b.x - c.x, b.y - c.y) + 8 * b.hp / b.max))[0];
      GB.Orders.attack(B, A.map(u => u.i), t, {});
    }
  },

  // 기동병 우회: 처음에 기동병이 적 뒤쪽(적 진영 옆 가장자리)으로 돌아 들어간 뒤 돌격
  flank: {
    prep(GB, B) {
      const C = mine(B).filter(u => GB.kindOf(u) === 'cav'); if (!C.length) return;
      const m = B.map, y = (C[0].y < m.H / 2) ? 3 : m.H - 3;
      GB.Orders.move(B, C.map(u => u.i), m.W - 6, y, { kind: 'move', hurry: true });
      B._flank = C.map(u => u.i);
    },
    turn(GB, B) {
      if (!B._flank || B._flanked || B.W.t < 6) return;
      const F = foes(B); if (!F.length) return;
      const C = B._flank.map(i => B.W.units[i]).filter(u => u.alive); B._flanked = true;
      if (C.length) { const c = centroid(F); GB.Orders.charge(B, C.map(u => u.i), null, { x: c.x, y: c.y }, {}); }
    }
  },

  // 끌어들이기: 뒤쪽 가장자리로 물러나 모여 있다가 선두 적이 가까워지면 자유 교전 (속도 차로 적이 줄지어 옴)
  draw: {
    prep(GB, B) {
      const M = mine(B), z = GB.zone(B.map, 0);
      GB.Orders.move(B, M.map(u => u.i), z.x0 + 1.5, (z.y0 + z.y1) / 2, {});
      GB.Orders.posture(B, M.map(u => u.i), 'roe', 'hold');
    },
    turn(GB, B) {
      const M = mine(B), F = foes(B); if (!M.length || !F.length || B._freed) return;
      const c = centroid(M), d = Math.min(...F.map(f => Math.hypot(f.x - c.x, f.y - c.y)));
      if (d < 9) { B._freed = true; GB.Orders.posture(B, M.map(u => u.i), 'roe', 'free'); GB.Orders.auto(B, M.map(u => u.i)); }
    }
  },

  // 부상자 후송: 체력이 낮은 아군은 가까운 적 반대쪽으로 물러나 의무병 곁으로 (림월드의 부상자 처리)
  rescue: {
    thr: 0.4,
    turn(GB, B) {
      const F = foes(B), M = mine(B); if (!F.length || !M.length) return;
      const thr = module.exports.rescue.thr;
      for (const u of M) {
        if (u.hp / u.max >= thr || u.crawl || u.down) continue;
        const f = near(u, F); if (!f) continue;
        const d = Math.hypot(u.x - f.x, u.y - f.y) || 1, back = B.map.W * 0.0 + 8;
        const tx = GB.clamp(u.x + (u.x - f.x) / d * back, 1.5, B.map.W - 1.5), ty = GB.clamp(u.y + (u.y - f.y) / d * back, 1.5, B.map.H - 1.5);
        GB.Orders.move(B, [u.i], tx, ty, { kind: 'move', hurry: true });
      }
    }
  },

  // 사람처럼: 목표가 쓰러졌을 때만 새 명령 (매 턴 다시 내리면 휘두르던 동작이 끊김)
  arcfocus2: {
    turn(GB, B) {
      const F = foes(B), A = mine(B).filter(u => GB.kindOf(u) === 'arc'); if (!F.length || !A.length) return;
      if (B._t && B._t.alive) return;
      const c = centroid(A);
      B._t = F.slice().sort((a, b) => (Math.hypot(a.x - c.x, a.y - c.y) + 8 * a.hp / a.max) - (Math.hypot(b.x - c.x, b.y - c.y) + 8 * b.hp / b.max))[0];
      GB.Orders.attack(B, A.map(u => u.i), B._t, {});
    }
  },
  focus2: {
    turn(GB, B) {
      const F = foes(B), M = mine(B); if (!F.length || !M.length) return;
      if (B._t && B._t.alive) return;
      const c = centroid(M);
      B._t = near(c, F);
      GB.Orders.attack(B, M.map(u => u.i), B._t, {});
    }
  },

  // 처음부터 전원 공격이동(서둘러)
  rush: {
    prep(GB, B) {
      const M = mine(B), F = foes(B), c = centroid(F);
      GB.Orders.move(B, M.map(u => u.i), c.x, c.y, { kind: 'amove', hurry: true });
    }
  },
  // 사수 제외 공격이동, 사수는 자동
  rushmelee: {
    prep(GB, B) {
      const M = mine(B).filter(u => GB.kindOf(u) !== 'arc'), F = foes(B), c = centroid(F);
      GB.Orders.move(B, M.map(u => u.i), c.x, c.y, { kind: 'amove', hurry: true });
    }
  },
  // 기동병만 먼저 돌격 (적 사수 쪽으로)
  cavcharge: {
    prep(GB, B) {
      const C = mine(B).filter(u => GB.kindOf(u) === 'cav'), F = foes(B).filter(f => GB.kindOf(f) === 'arc'); if (!C.length || !F.length) return;
      GB.Orders.charge(B, C.map(u => u.i), F[0], null, {});
    }
  },

  // 전우조: 가까이 배치된 둘씩 짝 (전우 = 옆구리 · 등 덮어 줌, 쓰러지면 구하러 감)
  pairs: {
    prep(GB, B) {
      const M = mine(B).slice().sort((a, b) => a.y - b.y), used = new Set();
      for (let i = 0; i < M.length; i++) {
        if (used.has(M[i].i)) continue;
        const j = M.findIndex((q, k) => k > i && !used.has(q.i) && Math.hypot(q.x - M[i].x, q.y - M[i].y) < 4.5);
        if (j < 0) continue;
        used.add(M[i].i); used.add(M[j].i); GB.Orders.mate(B, [M[i].i, M[j].i]);
      }
    }
  },
  // 짝 + 지휘 사슬: 탱커가 대장, 나머지는 따름
  chain: {
    prep(GB, B) {
      module.exports.pairs.prep(GB, B);
      const M = mine(B), boss = M.slice().sort((a, b) => b.max - a.max)[0];
      GB.Orders.chief(B, M.filter(u => u !== boss).map(u => u.i), boss.i, 'follow');
    }
  },

  // 대조군: 명령은 내지만 '자동'일 뿐 (명령을 낸다는 사실 자체가 판을 바꾸는지 확인)
  noop: { prep(GB, B) { GB.Orders.auto(B, mine(B).map(u => u.i)); } },

  // 치료 방침: 의무병이 위급하지 않아도 다친 사람을 치료
  healfree: { prep(GB, B) { GB.Orders.posture(B, mine(B).map(u => u.i), 'heal', 'free'); } },

  // 불리하면 철수: 아군 총 체력 / 적 총 체력 이 문턱보다 낮으면 (한 번) 철수 — 성장 게임에서는 이기는 것보다 살리는 게 중요할 때가 많다
  retreat: {
    thr: 0.45, minT: 4,
    turn(GB, B) {
      if (B.retreating || B.W.t < module.exports.retreat.minT) return;
      const hp = L => L.reduce((a, u) => a + Math.max(0, u.hp), 0), A = mine(B), F = foes(B);
      if (!A.length || !F.length) return;
      if (hp(A) / hp(F) < module.exports.retreat.thr) GB.Orders.retreat(B);
    }
  }
};
