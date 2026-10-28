/* 전투 표현 겹침 — 원본 화면(page10)의 표시를 흑백으로 옮김. 엔진 상태는 읽기만 한다.
 *  밑에 깔리는 것(drawUnder): 측·후방 구역 · 방어 부채꼴 · 사거리 · 지휘 거리(외침/손짓)
 *  위에 얹히는 것(drawOver):  공격 예고선(준비 중) · 돌격 화살표 · 공격 게이지 링(준비 → 나가고/회복) · 돌격 쿨타임 호 · 관계 고르는 중 표시
 *  보여 줄 몸: 고른 아군 · 살펴보는 몸 · 마우스를 올린 몸 · "범위" 단추를 켜면 모두 */
Object.assign(GB.View.prototype, {
  focusUnits() {
    const W = this.B.W, ui = this.ui, set = new Set();
    if (ui.detail) W.units.forEach(u => { if (u.alive) set.add(u); });
    ui.selUnits().forEach(u => set.add(u));
    [ui.inspect, ui.hover].forEach(i => { const u = i != null ? W.units[i] : null; if (u && u.alive) set.add(u); });
    return [...set];
  },
  // 몸 둘레 부채꼴 (월드 방향 a0~a1, 반지름 r0~r1 px)
  sector(p, a0, a1, r0, r1) {
    const g = this.g, s0 = this.sAng(a0), s1 = this.sAng(a1);
    g.beginPath(); g.arc(p.x, p.y, r1, s0, s1); g.arc(p.x, p.y, r0, s1, s0, true); g.closePath();
  },
  drawUnder(now) {
    const B = this.B, W = B.W, g = this.g, F = this.focusUnits(), front = (W.rules.frontArc || 60) * Math.PI / 180;
    g.save();
    // 지휘 거리: 외침(소음에 줄어듦) · 손짓
    const boss = E.cmdBoss(W, 0);
    if (boss && B.started && (F.includes(boss) || this.ui.detail)) {
      const p = this.toS(boss.x, boss.y), R = E.cmdRange(W, boss) * this.scale, H = Math.min(E.hearR(W, boss, null), E.cmdRange(W, boss)) * this.scale;
      g.fillStyle = 'rgba(0,0,0,.035)'; g.beginPath(); g.arc(p.x, p.y, R, 0, 7); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 1.4; g.setLineDash([9, 6]); g.beginPath(); g.arc(p.x, p.y, R, 0, 7); g.stroke();
      g.strokeStyle = 'rgba(0,0,0,.4)'; g.setLineDash([2, 4]); g.beginPath(); g.arc(p.x, p.y, H, 0, 7); g.stroke(); g.setLineDash([]);
      g.font = '10px sans-serif'; g.textAlign = 'center'; g.fillStyle = 'rgba(0,0,0,.7)';
      g.fillText('지휘 ' + E.cmdRange(W, boss) + '칸', p.x, p.y - R - 4); if (H < R - 8) g.fillText('외침 ' + E.hearR(W, boss, null).toFixed(1) + '칸 (소음)', p.x, p.y - H - 4);
    }
    for (const u of F) {
      const p = this.toS(u.x, u.y), r = this.vr(u), ally = u.side === 0, face = u.face || 0, L = Math.max(22, this.scale * 1.0);
      // 측면 · 후방: 바라보는 쪽(앞) ±front 는 앞, 그 바깥은 옆, 뒤쪽 ±front 는 후방 (엔진 sideOf)
      g.fillStyle = 'rgba(0,0,0,.09)'; this.sector(p, face + front, face + Math.PI - front, r + 2, r + L); g.fill(); this.sector(p, face - Math.PI + front, face - front, r + 2, r + L); g.fill();
      g.fillStyle = 'rgba(196,22,28,.2)'; this.sector(p, face + Math.PI - front, face + Math.PI + front, r + 2, r + L); g.fill();
      g.strokeStyle = 'rgba(196,22,28,.7)'; g.lineWidth = 1.3; g.beginPath(); g.arc(p.x, p.y, r + L, this.sAng(face + Math.PI - front), this.sAng(face + Math.PI + front)); g.stroke();
      if (this.scale >= 12 && (u === this.ui.inspect || this.ui.sel.size === 1 && this.ui.sel.has(u.i) || u === this.ui.hover)) {
        g.font = '9.5px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = RED;
        const bx = p.x + Math.cos(this.sAng(face + Math.PI)) * (r + L * 0.6), by = p.y + Math.sin(this.sAng(face + Math.PI)) * (r + L * 0.6); g.fillText('후방', bx, by);
        g.fillStyle = 'rgba(0,0,0,.65)';
        [face + Math.PI / 2, face - Math.PI / 2].forEach(a => g.fillText('측면', p.x + Math.cos(this.sAng(a)) * (r + L * 0.6), p.y + Math.sin(this.sAng(a)) * (r + L * 0.6)));
        g.textBaseline = 'alphabetic';
      }
      // 방어 범위 (방패 · 대검): 막는 쪽 부채꼴 — 막을 수 있으면 짙게, 무너졌거나 못 막으면 붉은 점선
      if (u.canGuard) {
        const ga = Math.max(0.12, (u.gArc || 45) * Math.PI / 180), on = E.guardOn(W, u), R2 = r + this.scale * 1.3;
        g.fillStyle = on ? 'rgba(0,0,0,.16)' : 'rgba(196,22,28,.07)'; this.sector(p, face - ga, face + ga, r, R2); g.fill();
        g.strokeStyle = on ? INK : RED; g.lineWidth = Math.max(3, r * 0.22); if (!on) g.setLineDash([3, 3]);
        g.beginPath(); g.arc(p.x, p.y, r + 1, this.sAng(face - ga), this.sAng(face + ga)); g.stroke(); g.setLineDash([]);
      }
      // 사거리 (몸 가장자리 ~ 무기 닿는 곳)
      if (u.rng) {
        const R = Math.max(r + 4, (u.r + u.rng) * this.scale);
        g.strokeStyle = ally ? 'rgba(0,0,0,.5)' : 'rgba(196,22,28,.6)'; g.lineWidth = 1.3; g.setLineDash([4, 3]); g.beginPath(); g.arc(p.x, p.y, R, 0, 7); g.stroke(); g.setLineDash([]);
        if (R > 24 && (u === this.ui.inspect || this.ui.sel.size === 1 && this.ui.sel.has(u.i) || u === this.ui.hover)) { g.font = '10px sans-serif'; g.textAlign = 'center'; g.fillStyle = ally ? INK : RED; g.fillText((u.weapon || '') + ' ' + u.rng + '칸' + (u.ammo != null ? ' · 탄 ' + u.ammo : ''), p.x, p.y - R - 4); }
      }
    }
    g.restore();
  },
  drawOver(now) {
    const W = this.B.W, g = this.g, ui = this.ui;
    g.save(); g.lineCap = 'round';
    for (const u of W.units) {
      if (!u.alive || !u.act) continue;
      const a = u.act, wind = a.phase === 'wind' || a.phase === 'run', ally = u.side === 0, p = this.toS(u.x, u.y), r = this.vr(u);
      const tgt = a.b != null ? W.units[a.b] : null, tp = tgt && tgt.alive ? this.toS(tgt.x, tgt.y) : (a.px != null ? this.toS(a.px, a.py) : null);
      const col = a.k === 'heal' || a.k === 'skill' ? 'rgba(0,0,0,.8)' : ally ? 'rgba(0,0,0,.85)' : 'rgba(196,22,28,.95)';
      // 예고선: 준비 중에만 (공격 · 사격 · 투창 · 치료 → 노리는 곳, 돌격 → 굵은 화살표)
      if (tp && (a.phase === 'wind' || a.phase === 'run')) {
        if (a.k === 'charge') {
          const run = a.phase === 'run', ang = Math.atan2(tp.y - p.y, tp.x - p.x), hw = Math.max(3, this.scale * (run ? 0.16 : 0.09)), ex = tp.x - Math.cos(ang) * hw * 2.2, ey = tp.y - Math.sin(ang) * hw * 2.2;
          g.strokeStyle = col; g.fillStyle = col; g.lineWidth = hw; g.setLineDash(run ? [] : [hw * 1.2, hw]);
          g.beginPath(); g.moveTo(p.x + Math.cos(ang) * r, p.y + Math.sin(ang) * r); g.lineTo(ex, ey); g.stroke(); g.setLineDash([]);
          g.beginPath(); g.moveTo(tp.x, tp.y); g.lineTo(tp.x - Math.cos(ang - 0.45) * hw * 3, tp.y - Math.sin(ang - 0.45) * hw * 3); g.lineTo(tp.x - Math.cos(ang + 0.45) * hw * 3, tp.y - Math.sin(ang + 0.45) * hw * 3); g.closePath(); g.fill();
        } else {
          const ang = Math.atan2(tp.y - p.y, tp.x - p.x), far = u.rng > 3 || /활|총|샷건|포/.test(u.weapon || '');
          g.strokeStyle = col; g.lineWidth = far ? 2 : 1.6; g.setLineDash(a.k === 'heal' || a.k === 'skill' ? [2, 4] : [6, 4]);
          g.beginPath(); g.moveTo(p.x + Math.cos(ang) * r, p.y + Math.sin(ang) * r); g.lineTo(tp.x, tp.y); g.stroke(); g.setLineDash([]);
          // 맞을 쪽: 조이는 고리 (준비가 끝날수록 작아짐) — 사격 예고
          const span = Math.max(0.05, a.end - a.t0), pr = GB.clamp((W.t - a.t0) / span, 0, 1), tr = tgt ? this.vr(tgt) : 8;
          g.lineWidth = 1.6; g.beginPath(); g.arc(tp.x, tp.y, tr + 3 + (1 - pr) * 12, 0, 7); g.stroke();
          g.beginPath(); g.moveTo(tp.x - tr - 7, tp.y); g.lineTo(tp.x - tr + 1, tp.y); g.moveTo(tp.x + tr - 1, tp.y); g.lineTo(tp.x + tr + 7, tp.y); g.moveTo(tp.x, tp.y - tr - 7); g.lineTo(tp.x, tp.y - tr + 1); g.moveTo(tp.x, tp.y + tr - 1); g.lineTo(tp.x, tp.y + tr + 7); g.stroke();
        }
      }
      // 공격 게이지 링: 준비 = 차오름(굵게) → 나가고 · 회복 = 비워짐(가늘게, 회색)
      const span = wind ? a.end - a.t0 : a.end - (a.t1 != null ? a.t1 : a.t0), pr = span > 0 ? GB.clamp(1 - (a.end - W.t) / span, 0, 1) : 1;
      const rr = r + 5, a0 = -Math.PI / 2;
      g.lineWidth = 5; g.strokeStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(p.x, p.y, rr, 0, 7); g.stroke();
      g.lineWidth = 2; g.strokeStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.arc(p.x, p.y, rr, 0, 7); g.stroke();
      if (wind) { g.lineWidth = 3.4; g.strokeStyle = ally ? INK : RED; g.beginPath(); g.arc(p.x, p.y, rr, a0, a0 + Math.PI * 2 * pr); g.stroke(); }
      else { g.lineWidth = 2.2; g.strokeStyle = 'rgba(90,90,90,.8)'; g.beginPath(); g.arc(p.x, p.y, rr, a0, a0 + Math.PI * 2 * (1 - pr)); g.stroke(); }
    }
    // 돌격 쿨타임: 고른 아군 몸 둘레에 얇은 호 (찰수록 곧 쓸 수 있음)
    for (const u of ui.selUnits()) {
      const s = GB.Skills.charge(W, u); if (!s.has || s.ready || u.act) continue;
      const p = this.toS(u.x, u.y), rr = this.vr(u) + 5;
      g.lineWidth = 2; g.strokeStyle = 'rgba(0,0,0,.55)'; g.setLineDash([2, 3]); g.beginPath(); g.arc(p.x, p.y, rr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s.frac); g.stroke(); g.setLineDash([]);
    }
    // 관계 고르는 중: 대장 ♛ 와 고른 부하 점선 고리
    if (ui.rel) {
      const b = W.units[ui.rel.boss];
      if (b && b.alive) {
        const bp = this.toS(b.x, b.y), br = this.vr(b);
        g.strokeStyle = INK; g.lineWidth = 2.4; g.setLineDash([]); g.beginPath(); g.arc(bp.x, bp.y, br + 9, 0, 7); g.stroke();
        g.fillStyle = INK; g.font = 'bold 13px sans-serif'; g.textAlign = 'center'; g.fillText(ui.rel.mode === 'mate' ? '전우?' : ui.rel.mode === 'cover' ? '⛨' : '♛', bp.x, bp.y - br - 12);
        for (const i of ui.rel.picks) { const m = W.units[i]; if (!m || !m.alive) continue; const mp = this.toS(m.x, m.y), mr = this.vr(m);
          g.setLineDash([4, 3]); g.lineWidth = 2; g.beginPath(); g.arc(mp.x, mp.y, mr + 8, 0, 7); g.stroke(); g.beginPath(); g.moveTo(mp.x, mp.y); g.lineTo(bp.x, bp.y); g.stroke(); g.setLineDash([]); }
      }
    }
    g.restore();
  }
});
