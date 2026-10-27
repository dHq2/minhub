/* 렌더러: 흑백 격자판 위에 엔진 월드(W)를 그린다. 엔진 상태는 읽기만 한다.
 *  - 흰 격자 · 아군 = 흰 몸 + 검은 선 · 적 = 검은 몸 · 병종 = 모양 (■ 방어 ● 보병 ▲ 기동 ⬟ 사수) · 체급 = 크기
 *  - 투구 · 갑옷은 몸 크기에 맞춰 그림 · 의무 = 몸 가운데 붉은 십자 · 무기 · 방패는 바라보는 쪽에
 *  - 부상(팔 · 다리 · 눈) · 출혈 · 넘어짐 · 기어다님 · 바닥의 물건 · 전우조 / 대장 관계선 · 명령선
 *  - 연출: 피 얼룩 · 타격 파편 · 숫자 · 흔들림 · 쓰러짐 파문. 몸이 겹치면 눌려 찌그러지는 "비비적" 표현 (그림만 — 충돌은 엔진 그대로) */
GB.UI = GB.UI || {};
GB.View = function (canvas, ui) {
  this.cv = canvas; this.g = canvas.getContext('2d'); this.ui = ui;
  this.cam = { zoom: 1, cx: 0, cy: 0 };
  this.fx = []; this.stains = []; this.logIdx = 0; this.shake = 0; this.drip = {}; this.auto = true;
  this.cw = 1; this.ch = 1; this.dpr = 1; this.portrait = false; this.base = 1; this.scale = 1;
  this.B = null;
};
const VIS = 1.5;   // 그림 반지름 = 몸 반지름 × VIS (몸이 작아도 보이게 — 겹쳐 보이면 눌려 찌그러짐)
const RED = '#c4161c', INK = '#111';

GB.View.prototype = {
  setBattle(B) {
    this.B = B; this.fx = []; this.stains = []; this.logIdx = B ? B.W.log.length : 0; this.shake = 0; this.drip = {};
    this.cam = { zoom: 1, cx: B.map.W / 2, cy: B.map.H / 2 };
    this.fit();
  },
  // 살아 있는 몸들이 화면에 꽉 차게 (여백 6 m). all=true 면 맵 전체
  target(all) {
    const B = this.B;
    const us = B.W.units.filter(u => u.alive);
    if (all || !us.length) return { zoom: 1, cx: B.map.W / 2, cy: B.map.H / 2 };
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    us.forEach(u => { x0 = Math.min(x0, u.x); x1 = Math.max(x1, u.x); y0 = Math.min(y0, u.y); y1 = Math.max(y1, u.y); });
    const bw = Math.max(14, x1 - x0 + 12), bh = Math.max(14, y1 - y0 + 12);
    const visW = (this.portrait ? this.ch : this.cw) / this.base, visH = (this.portrait ? this.cw : this.ch) / this.base;
    return { zoom: GB.clamp(Math.min(visW / bw, visH / bh), 1, 8), cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  },
  fit(all) {
    const B = this.B; if (!B) return;
    this.layout();
    if (this.cw < 20 || this.ch < 20) return;   // 아직 보이지 않음
    const t = this.target(all);
    this.cam.zoom = t.zoom; this.cam.cx = t.cx; this.cam.cy = t.cy; this.auto = !all;
  },
  // 자동 카메라: 직접 확대 · 이동하기 전까지 싸움을 따라감
  follow() {
    if (!this.auto || !this.B.started) return;
    const t = this.target(false), k = 0.07;
    this.cam.zoom += (t.zoom - this.cam.zoom) * k; this.cam.cx += (t.cx - this.cam.cx) * k; this.cam.cy += (t.cy - this.cam.cy) * k;
  },
  // ---------- 좌표 ----------
  layout() {
    const cv = this.cv, r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    this.cw = r.width; this.ch = r.height; this.dpr = dpr;
    this.portrait = this.ch > this.cw * 1.05;
    const m = this.B.map;
    const base = this.portrait ? Math.min(this.cw / m.H, this.ch / m.W) : Math.min(this.cw / m.W, this.ch / m.H);
    this.base = base * 0.97; this.scale = this.base * this.cam.zoom;
    if (this.cam.zoom <= 1.001) { this.cam.cx = m.W / 2; this.cam.cy = m.H / 2; }
    else { this.cam.cx = GB.clamp(this.cam.cx, 0, m.W); this.cam.cy = GB.clamp(this.cam.cy, 0, m.H); }
  },
  toS(wx, wy) {
    return this.portrait
      ? { x: this.cw / 2 + (wy - this.cam.cy) * this.scale, y: this.ch / 2 - (wx - this.cam.cx) * this.scale }
      : { x: this.cw / 2 + (wx - this.cam.cx) * this.scale, y: this.ch / 2 + (wy - this.cam.cy) * this.scale };
  },
  toW(sx, sy) {
    return this.portrait
      ? { x: this.cam.cx - (sy - this.ch / 2) / this.scale, y: this.cam.cy + (sx - this.cw / 2) / this.scale }
      : { x: this.cam.cx + (sx - this.cw / 2) / this.scale, y: this.cam.cy + (sy - this.ch / 2) / this.scale };
  },
  sAng(a) { return a - (this.portrait ? Math.PI / 2 : 0); },
  anchor(wx, wy, sx, sy) {   // 월드 점이 화면 (sx, sy) 에 오도록
    if (this.portrait) { this.cam.cy = wy - (sx - this.cw / 2) / this.scale; this.cam.cx = wx + (sy - this.ch / 2) / this.scale; }
    else { this.cam.cx = wx - (sx - this.cw / 2) / this.scale; this.cam.cy = wy - (sy - this.ch / 2) / this.scale; }
  },
  setZoom(z, ax, ay) {
    ax = ax == null ? this.cw / 2 : ax; ay = ay == null ? this.ch / 2 : ay;
    const wp = this.toW(ax, ay);
    this.cam.zoom = GB.clamp(z, 1, 8); this.scale = this.base * this.cam.zoom;
    this.anchor(wp.x, wp.y, ax, ay);
  },
  vr(u) { return Math.max(u.r * this.scale * VIS, 6.5); },
  unitAt(sx, sy, side, any) {
    let best = null, bd = 1e9;
    for (const u of this.B.W.units) {
      if (!u.alive || (side != null && u.side !== side)) continue;
      const p = this.toS(u.x, u.y), d = Math.hypot(p.x - sx, p.y - sy);
      if (d <= Math.max(this.vr(u) + 5, 17) && d < bd) { bd = d; best = u; }
    }
    return best;
  },
  itemAt(sx, sy) {
    let best = null, bd = 1e9;
    for (const it of this.B.W.items || []) {
      const p = this.toS(it.x, it.y), d = Math.hypot(p.x - sx, p.y - sy);
      if (d <= 15 && d < bd) { bd = d; best = it; }
    }
    return best;
  },

  // ---------- 사건 → 연출 ----------
  consume(now) {
    const W = this.B.W, L = W.log;
    for (; this.logIdx < L.length; this.logIdx++) {
      const e = L[this.logIdx];
      if (e.k === 'hit') {
        const t = W.units[e.b], a = W.units[e.a]; if (!t) continue;
        const dmg = e.dmg || 0;
        this.fx.push({ k: 'num', x: t.x, y: t.y, t0: now, s: (e.block ? '막' : '') + (dmg ? '-' + dmg : ''), c: e.block ? '#777' : (t.side === 0 ? RED : INK), big: !!e.hcrit || dmg >= 25 });
        if (!e.block) {
          this.fx.push({ k: 'burst', x: t.x, y: t.y, t0: now, n: 4 + Math.min(8, Math.round(dmg / 6)), a: a ? Math.atan2(t.y - a.y, t.x - a.x) : 0 });
          this.stain(t.x, t.y, 0.15 + Math.min(0.5, dmg / 60), 1 + Math.min(4, Math.round(dmg / 12)));
        } else this.fx.push({ k: 'spark', x: t.x, y: t.y, t0: now });
        if (dmg >= 20 || e.hcrit) this.shake = Math.min(7, this.shake + (e.hcrit ? 3 : 1.6));
      } else if (e.k === 'die') {
        const t = W.units[e.b]; if (!t) continue;
        this.fx.push({ k: 'ring', x: t.x, y: t.y, t0: now, r: t.r * 3 });
        this.stain(t.x, t.y, 0.5 + t.r, 9);
        this.shake = Math.min(8, this.shake + 2 + t.r * 2);
      } else if (e.k === 'charge') {
        const a = W.units[e.a]; if (a) this.fx.push({ k: 'dust', x: a.x, y: a.y, t0: now });
      } else if (e.k === 'stomp') {
        const t = W.units[e.b]; if (t) { this.fx.push({ k: 'ring', x: t.x, y: t.y, t0: now, r: t.r * 4 }); this.shake = Math.min(9, this.shake + 4); }
      } else if (e.k === 'heal' || e.k === 'tend') {
        const t = W.units[e.b]; if (t) this.fx.push({ k: 'cross', x: t.x, y: t.y, t0: now });
      } else if (e.k === 'pickItem') {
        const a = W.units[e.a]; if (a) this.fx.push({ k: 'num', x: a.x, y: a.y, t0: now, s: '줍기', c: '#555' });
      }
    }
    if (this.fx.length > 220) this.fx.splice(0, this.fx.length - 220);
  },
  stain(x, y, r, n) {
    const R = this.B.W.rand ? Math.random : Math.random;
    for (let i = 0; i < n; i++) this.stains.push({ x: x + (R() - 0.5) * 0.9, y: y + (R() - 0.5) * 0.9, r: r * (0.3 + R() * 0.8), a: 0.14 + R() * 0.22 });
    if (this.stains.length > 700) this.stains.splice(0, this.stains.length - 700);
  },

  // ---------- 그리기 ----------
  draw(now) {
    const B = this.B; if (!B) return;
    const g = this.g, W = B.W, ui = this.ui;
    this.layout(); this.follow(); this.layout(); this.consume(now);
    this.shake *= Math.exp(-0.12 * 4); if (this.shake < 0.05) this.shake = 0;
    const sh = this.shake, ox = (Math.random() - 0.5) * sh, oy = (Math.random() - 0.5) * sh;
    g.setTransform(this.dpr, 0, 0, this.dpr, ox * this.dpr, oy * this.dpr);
    g.fillStyle = '#d6d6d6'; g.fillRect(-20, -20, this.cw + 40, this.ch + 40);
    const m = B.map, c0 = this.toS(0, 0), c1 = this.toS(m.W, m.H);
    const mx = Math.min(c0.x, c1.x), my = Math.min(c0.y, c1.y), mw = Math.abs(c1.x - c0.x), mh = Math.abs(c1.y - c0.y);
    g.fillStyle = '#fff'; g.fillRect(mx, my, mw, mh);
    g.save(); g.beginPath(); g.rect(mx, my, mw, mh); g.clip();
    this.drawGrid(m);
    if (!B.started) this.drawZones(m);
    this.drawStains();
    this.drawItems(now);
    this.drawCorpses();
    this.drawRelations();
    this.drawOrders(now);
    this.drawShots();
    this.drawUnits(now);
    this.drawFx(now);
    g.restore();
    g.strokeStyle = '#8a8a8a'; g.lineWidth = 1.5; g.strokeRect(mx, my, mw, mh);
    this.drawOverlay(now);
  },
  drawGrid(m) {
    const g = this.g;
    for (let x = 0; x <= m.W; x += 2) { const a = this.toS(x, 0), b = this.toS(x, m.H); g.strokeStyle = x % 10 === 0 ? '#dcdcdc' : '#efefef'; g.lineWidth = x % 10 === 0 ? 1.2 : 1; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
    for (let y = 0; y <= m.H; y += 2) { const a = this.toS(0, y), b = this.toS(m.W, y); g.strokeStyle = y % 10 === 0 ? '#dcdcdc' : '#efefef'; g.lineWidth = y % 10 === 0 ? 1.2 : 1; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
  },
  drawZones(m) {
    const g = this.g;
    [0, 1].forEach(side => {
      const z = GB.zone(m, side), a = this.toS(z.x0, z.y0), b = this.toS(z.x1, z.y1);
      const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y), w = Math.abs(b.x - a.x), h = Math.abs(b.y - a.y);
      g.fillStyle = side === 0 ? 'rgba(0,0,0,.035)' : 'rgba(0,0,0,.07)'; g.fillRect(x, y, w, h);
      g.setLineDash([6, 5]); g.strokeStyle = '#999'; g.lineWidth = 1; g.strokeRect(x, y, w, h); g.setLineDash([]);
    });
  },
  drawStains() {
    const g = this.g;
    for (const s of this.stains) { const p = this.toS(s.x, s.y); g.fillStyle = 'rgba(110,14,14,' + s.a + ')'; g.beginPath(); g.arc(p.x, p.y, Math.max(1.5, s.r * this.scale), 0, 7); g.fill(); }
  },
  drawItems(now) {
    const g = this.g, ui = this.ui, W = this.B.W;
    const sel = ui.selUnits();
    for (const it of W.items || []) {
      const p = this.toS(it.x, it.y), s = 7;
      const canPick = sel.some(u => E.canTake(W, u, it));
      g.save(); g.translate(p.x, p.y);
      g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(0, 0, s + 2.5, 0, 7); g.fill();
      if (canPick && sel.length) { g.strokeStyle = INK; g.setLineDash([2, 2]); g.lineWidth = 1.2; g.beginPath(); g.arc(0, 0, s + 4, 0, 7); g.stroke(); g.setLineDash([]); }
      g.strokeStyle = INK; g.fillStyle = INK; g.lineWidth = 1.7; g.lineCap = 'round';
      if (it.k === 'weapon') {
        const n = it.name, far = /활|총|샷건/.test(n);
        if (far) { g.beginPath(); g.arc(-1, 0, s * 0.8, -1.1, 1.1); g.stroke(); g.beginPath(); g.moveTo(-1 + Math.cos(1.1) * s * 0.8, Math.sin(1.1) * s * 0.8); g.lineTo(-1 + Math.cos(-1.1) * s * 0.8, Math.sin(-1.1) * s * 0.8); g.stroke(); }
        else { g.beginPath(); g.moveTo(-s, s * 0.6); g.lineTo(s, -s * 0.6); g.stroke(); if (/창/.test(n)) { g.beginPath(); g.moveTo(s, -s * 0.6); g.lineTo(s - 4, -s * 0.6 + 1); g.lineTo(s - 1, -s * 0.6 + 4); g.fill(); } else { g.beginPath(); g.moveTo(-s * 0.2, -s * 0.1); g.lineTo(s * 0.1, s * 0.2); g.stroke(); } }
      } else if (it.k === 'shield') { g.beginPath(); g.arc(0, -1, s * 0.9, 0.2, Math.PI - 0.2); g.lineTo(0, s); g.closePath(); g.stroke(); }
      else if (it.k === 'helm') { g.beginPath(); g.arc(0, 1, s * 0.85, Math.PI, 0); g.lineTo(s * 0.85, s * 0.6); g.lineTo(-s * 0.85, s * 0.6); g.closePath(); g.stroke(); }
      else if (it.k === 'armor') { g.beginPath(); g.moveTo(-s * 0.9, -s * 0.8); g.lineTo(s * 0.9, -s * 0.8); g.lineTo(s * 0.7, s * 0.9); g.lineTo(-s * 0.7, s * 0.9); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(0, -s * 0.8); g.lineTo(0, s * 0.9); g.stroke(); }
      else { g.beginPath(); g.arc(0, 0, 3, 0, 7); g.fill(); }
      g.restore();
    }
  },
  drawCorpses() {
    const g = this.g;
    for (const u of this.B.W.units) {
      if (u.alive) continue;
      const p = this.toS(u.x, u.y), R = this.vr(u) * 0.85;
      g.save(); g.globalAlpha = 0.28; g.translate(p.x, p.y);
      this.bodyPath(GB.kindOf(u), R, this.sAng(u.face || 0), 1);
      g.fillStyle = u.side === 0 ? '#fff' : '#222'; g.fill(); g.strokeStyle = '#000'; g.lineWidth = 1.5; g.stroke();
      g.globalAlpha = 0.5; g.strokeStyle = INK; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-R * 0.6, -R * 0.6); g.lineTo(R * 0.6, R * 0.6); g.moveTo(R * 0.6, -R * 0.6); g.lineTo(-R * 0.6, R * 0.6); g.stroke();
      g.restore();
    }
  },
  // 관계: 전우조 = 굵은 두 줄, 대장 = 점선 + 왕관, 보호받을이 = 긴 점선
  drawRelations() {
    const g = this.g, W = this.B.W; g.save();
    const seen = new Set();
    for (const u of W.units) {
      if (!u.alive || u.side !== 0) continue;
      if (u.cg) for (const m of W.units) {
        if (m === u || !m.alive || m.cg !== u.cg || m.side !== 0 || seen.has(m.i + '-' + u.i)) continue;
        seen.add(u.i + '-' + m.i);
        const a = this.toS(u.x, u.y), b = this.toS(m.x, m.y), dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, nx = -dy / d * 2, ny = dx / d * 2;
        g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(a.x + nx, a.y + ny); g.lineTo(b.x + nx, b.y + ny); g.moveTo(a.x - nx, a.y - ny); g.lineTo(b.x - nx, b.y - ny); g.stroke();
      }
      if (u.chiefLk && u.sqLead != null) {
        const c = W.units[u.sqLead]; if (!c || !c.alive) continue;
        const a = this.toS(u.x, u.y), b = this.toS(c.x, c.y);
        g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 1.3; g.setLineDash(u.chiefMode === 'cover' ? [8, 5] : [2, 4]);
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); g.setLineDash([]);
        g.fillStyle = INK; g.font = '11px sans-serif'; g.textAlign = 'center'; g.fillText(u.chiefMode === 'cover' ? '⛨' : '♛', b.x, b.y - this.vr(c) - 12);
      }
    }
    g.restore();
  },
  arrow(x0, y0, x1, y1, hs) {
    const g = this.g, a = Math.atan2(y1 - y0, x1 - x0);
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - Math.cos(a - 0.45) * hs, y1 - Math.sin(a - 0.45) * hs); g.lineTo(x1 - Math.cos(a + 0.45) * hs, y1 - Math.sin(a + 0.45) * hs); g.closePath(); g.fill();
  },
  drawOrders(now) {
    const g = this.g, W = this.B.W, ui = this.ui;
    for (const u of W.units) {
      if (!u.alive || u.side !== 0) continue;
      const emph = ui.sel.has(u.i);
      const o = u.order || (u.ordPend && u.ordPend.o);
      if (!o) continue;
      const a = this.toS(u.x, u.y);
      g.save(); g.globalAlpha = emph ? 0.9 : 0.28; g.strokeStyle = INK; g.fillStyle = INK; g.lineWidth = emph ? 2 : 1.2;
      const pts = [];
      if (o.via) pts.push(o.via);
      if (['move', 'amove', 'charge', 'hold'].includes(o.k) && o.x != null) pts.push({ x: o.x, y: o.y });
      const tgt = (o.b != null && W.units[o.b] && W.units[o.b].alive) ? W.units[o.b] : null;
      if (['attack', 'charge', 'throw', 'assn', 'palm'].includes(o.k) && tgt) pts.push(tgt);
      if (o.k === 'pick' && o.id != null) { const it = (W.items || []).find(i => i.id === o.id); if (it) pts.push(it); }
      if (pts.length) {
        const dashed = o.k === 'move' || o.k === 'amove';
        g.setLineDash(dashed ? [7, 5] : o.k === 'pick' ? [2, 3] : []); if (o.k === 'charge') g.lineWidth = emph ? 4 : 2.4;
        g.beginPath(); g.moveTo(a.x, a.y);
        let last = a, prev = a;
        pts.forEach(p => { const s = this.toS(p.x, p.y); g.lineTo(s.x, s.y); prev = last; last = s; });
        g.stroke(); g.setLineDash([]);
        this.arrow(prev.x, prev.y, last.x, last.y, emph ? 10 : 6);
        if (['attack', 'throw', 'charge'].includes(o.k) && tgt) { g.lineWidth = 1.5; const s = this.toS(tgt.x, tgt.y); g.beginPath(); g.arc(s.x, s.y, this.vr(tgt) + 5, 0, 7); g.stroke(); }
      } else if (o.k === 'hold' && emph) { g.strokeRect(a.x - 6, a.y - 6, 12, 12); }
      g.restore();
    }
    // 전달 중인 명령: 지휘관 ★ 에서 번지는 점선 파동
    const boss = E.cmdBoss(W, 0);
    if (boss) {
      for (const u of W.units) {
        if (!u.alive || u.side !== 0 || !u.ordPend || u === boss) continue;
        const a = this.toS(boss.x, boss.y), b = this.toS(u.x, u.y), left = Math.max(0, u.ordPend.at - W.t), tot = Math.max(0.2, u.ordPend.at - u.ordPend.t0), pr = GB.clamp(1 - left / tot, 0, 1);
        g.save(); g.strokeStyle = 'rgba(0,0,0,.4)'; g.fillStyle = INK; g.lineWidth = 1.2; g.setLineDash([2, 4]);
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(a.x + (b.x - a.x) * pr, a.y + (b.y - a.y) * pr); g.stroke(); g.setLineDash([]);
        g.beginPath(); g.arc(a.x + (b.x - a.x) * pr, a.y + (b.y - a.y) * pr, 2.5, 0, 7); g.fill(); g.restore();
      }
    }
  },
  drawShots() {
    const g = this.g, W = this.B.W; g.save();
    for (const s of W.shots || []) {
      if (s.arc && s.T) {   // 곡사: 떨어질 자리까지
        const pr = GB.clamp((s.el || 0) / s.T, 0, 1), x = s.x0 + (s.lx - s.x0) * pr, y = s.y0 + (s.ly - s.y0) * pr, p = this.toS(x, y);
        g.fillStyle = INK; g.beginPath(); g.arc(p.x, p.y - Math.sin(pr * Math.PI) * 14, 2.4, 0, 7); g.fill(); continue;
      }
      const a = this.toS(s.x, s.y), b = this.toS(s.x - (s.dx || 0) * 0.9, s.y - (s.dy || 0) * 0.9);
      g.strokeStyle = INK; g.lineWidth = s.jav ? 2.6 : 1.8; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    }
    g.restore();
  },

  // ---------- 몸 ----------
  bodyPath(kind, R, th, sq) {
    const g = this.g;
    g.beginPath();
    if (kind === 'inf') { g.ellipse(0, 0, R, R * sq, th, 0, 7); return; }
    const n = kind === 'tank' ? 4 : kind === 'cav' ? 3 : 5, rot = kind === 'tank' ? th + Math.PI / 4 : th, rr = kind === 'tank' ? R * 1.25 : kind === 'cav' ? R * 1.3 : R * 1.12;
    for (let i = 0; i < n; i++) { const a = rot + i * 2 * Math.PI / n, x = Math.cos(a) * rr, y = Math.sin(a) * rr; if (i) g.lineTo(x, y); else g.moveTo(x, y); }
    g.closePath();
  },
  drawUnits(now) {
    const g = this.g, W = this.B.W, ui = this.ui;
    const live = W.units.filter(u => u.alive).sort((a, b) => a.y - b.y);
    // 비비적: 몸이 겹친 만큼 눌림 (그림 반지름 기준)
    const sq = new Map();
    for (const a of live) {
      let px = 0, py = 0, n = 0; const ra = this.vr(a);
      for (const b of live) {
        if (a === b) continue;
        const A = this.toS(a.x, a.y), Bp = this.toS(b.x, b.y), dx = Bp.x - A.x, dy = Bp.y - A.y, d = Math.hypot(dx, dy) || 0.01, need = (ra + this.vr(b)) * 0.92;
        if (d < need) { const ov = (need - d) / need; px += dx / d * ov; py += dy / d * ov; n += ov; }
      }
      if (n > 0) sq.set(a, { ang: Math.atan2(py, px), k: GB.clamp(n * 0.55, 0, 0.3) });
    }
    const boss = E.cmdBoss(W, 0);
    for (const u of live) this.drawUnit(u, now, sq.get(u), boss);
  },
  drawUnit(u, now, squish, boss) {
    const g = this.g, W = this.B.W, ui = this.ui, kind = GB.kindOf(u), ally = u.side === 0;
    const p = this.toS(u.x, u.y), R = this.vr(u), th = this.sAng(u.face || 0);
    const low = u.down || u.crawl || (u.proneT != null && W.t < u.proneT) || u.lie;
    g.save(); g.translate(p.x, p.y);
    // 쓰러진 · 기어다니는 몸은 납작하고 흐리게
    if (low) g.globalAlpha = 0.62;
    // 그림자
    g.fillStyle = 'rgba(0,0,0,.10)'; g.beginPath(); g.ellipse(2, 3, R * 1.05, R * 0.85, 0, 0, 7); g.fill();
    // 방어 태세 고리 (방패/무기로 막는 중)
    if (u.raised && u.canGuard) { g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.2; g.setLineDash([3, 3]); g.beginPath(); g.arc(0, 0, R + 4, th - u.gArc / 114.6, th + u.gArc / 114.6); g.stroke(); g.setLineDash([]); }
    // 몸 (눌림 반영: 눌리는 방향으로 납작, 직각으로 늘어남)
    g.save();
    if (squish) { g.rotate(squish.ang); g.scale(1 - squish.k, 1 + squish.k * 0.7); g.rotate(-squish.ang); }
    this.bodyPath(kind, R * (low ? 0.9 : 1), th, 1);
    g.fillStyle = ally ? '#fff' : '#161616'; g.fill();
    g.strokeStyle = '#000'; g.lineWidth = 2.2; g.stroke();
    if (!ally) { g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1; g.stroke(); }
    g.restore();
    const gear = u.gear || {}, body = gear['몸'], head = gear['머리'];
    const ink = ally ? INK : '#f2f2f2';
    // 갑옷: 몸 안쪽에 한 겹 더 (등급만큼 굵게) — 망가지면 사라짐
    if (body && !(body.dur != null && body.dur <= 0)) {
      g.save(); g.scale(0.72, 0.72); this.bodyPath(kind, R, th, 1); g.strokeStyle = ink; g.lineWidth = 1 + (body.tier || 1) * 0.7 + (R > 10 ? 0.6 : 0); g.stroke();
      if ((body.tier || 1) >= 3) { g.globalAlpha *= 0.55; g.setLineDash([2, 2]); g.scale(0.7, 0.7); this.bodyPath(kind, R, th, 1); g.stroke(); g.setLineDash([]); }
      g.restore();
    }
    // 머리 (몸 크기에 맞춤): 투구 = 굵은 테 + 눈 가리개, 없으면 작은 맨머리
    const hr = R * 0.33, hx = Math.cos(th) * R * 0.18, hy = Math.sin(th) * R * 0.18;
    g.save(); g.translate(hx, hy);
    if (head && !(head.dur != null && head.dur <= 0)) {
      g.beginPath(); g.arc(0, 0, hr * 1.12, 0, 7); g.fillStyle = ally ? '#cfcfcf' : '#555'; g.fill(); g.strokeStyle = ally ? '#000' : '#f2f2f2'; g.lineWidth = 1.8; g.stroke();
      g.strokeStyle = ally ? '#000' : '#fff'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(Math.cos(th - 1.1) * hr * 1.1, Math.sin(th - 1.1) * hr * 1.1); g.lineTo(Math.cos(th + 1.1) * hr * 1.1, Math.sin(th + 1.1) * hr * 1.1); g.stroke();
      if (u.sizeCls === '대형' || u.sizeCls === '초대형' || u.giant) { g.beginPath(); g.moveTo(Math.cos(th + 2) * hr * 1.1, Math.sin(th + 2) * hr * 1.1); g.lineTo(Math.cos(th + 2) * hr * 1.9, Math.sin(th + 2) * hr * 1.9); g.moveTo(Math.cos(th - 2) * hr * 1.1, Math.sin(th - 2) * hr * 1.1); g.lineTo(Math.cos(th - 2) * hr * 1.9, Math.sin(th - 2) * hr * 1.9); g.stroke(); }
    } else {
      g.beginPath(); g.arc(0, 0, hr, 0, 7); g.fillStyle = ally ? '#fff' : '#161616'; g.fill(); g.strokeStyle = ally ? '#000' : '#f2f2f2'; g.lineWidth = 1.2; g.stroke();
    }
    g.restore();
    // 의무: 몸 가운데 붉은 십자
    if (u.skill && u.skill.kit) {
      const c = Math.max(4, R * 0.5);
      g.fillStyle = '#fff'; g.fillRect(-c - 1.2, -c * 0.36 - 1.2, 2 * c + 2.4, c * 0.72 + 2.4); g.fillRect(-c * 0.36 - 1.2, -c - 1.2, c * 0.72 + 2.4, 2 * c + 2.4);
      g.fillStyle = RED; g.fillRect(-c, -c * 0.36, 2 * c, c * 0.72); g.fillRect(-c * 0.36, -c, c * 0.72, 2 * c);
    }
    if (!low) this.drawArms(u, R, th, now, ally);
    // 부상 표시: 상처 난 부위를 몸 둘레에 붉은 점으로
    this.drawWounds(u, R, th);
    g.restore();
    // 선택 고리 (검은 이중 고리)
    if (ui.sel.has(u.i)) { g.save(); g.translate(p.x, p.y); g.strokeStyle = '#fff'; g.lineWidth = 4.4; g.beginPath(); g.arc(0, 0, R + 5, 0, 7); g.stroke(); g.strokeStyle = INK; g.lineWidth = 2.2; g.beginPath(); g.arc(0, 0, R + 5, 0, 7); g.stroke(); g.restore(); }
    else if (ui.inspect === u.i) { g.save(); g.translate(p.x, p.y); g.strokeStyle = INK; g.lineWidth = 1.6; g.setLineDash([3, 3]); g.beginPath(); g.arc(0, 0, R + 5, 0, 7); g.stroke(); g.restore(); }
    // 체력 · 자세 막대
    const bw = Math.max(16, R * 2.3), bx = p.x - bw / 2, by = p.y - R - 10;
    g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(bx, by, bw, 3.6);
    g.fillStyle = ally ? '#111' : '#555'; g.fillRect(bx, by, bw * GB.clamp(u.hp / u.max, 0, 1), 3.6);
    if (u.canGuard && u.post < 100) { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(bx, by + 4.4, bw * GB.clamp(u.post / 100, 0, 1), 1.6); }
    // 지휘관 별 · 관계 표식
    if (boss === u) { g.save(); g.font = 'bold 12px sans-serif'; g.textAlign = 'center'; g.lineWidth = 3; g.strokeStyle = '#fff'; g.fillStyle = INK; g.strokeText('★', p.x, by - 1); g.fillText('★', p.x, by - 1); g.restore(); }
    // 출혈 · 넘어짐 · 명령 대기
    if (u.bleed) { const k = u.i; this.drip[k] = (this.drip[k] || 0) + 1; if (this.drip[k] % 14 === 0) this.stains.push({ x: u.x + (Math.random() - 0.5) * 0.5, y: u.y + (Math.random() - 0.5) * 0.5, r: 0.08, a: 0.3 }); }
    if (ally) {
      if (u.ordPend) { g.save(); g.fillStyle = INK; g.font = 'bold 12px sans-serif'; g.textAlign = 'center'; g.fillText('…', p.x + R + 6, p.y + 4); g.restore(); }
      else if (u.missT != null && W.t - u.missT < 3) { g.save(); g.fillStyle = RED; g.font = 'bold 13px sans-serif'; g.textAlign = 'center'; g.fillText('✗', p.x + R + 6, p.y + 4); g.restore(); }
    }
    if (u.down || u.crawl) { g.save(); g.strokeStyle = RED; g.lineWidth = 1.8; const r = R * 0.5; g.beginPath(); g.moveTo(p.x - r, p.y - r); g.lineTo(p.x + r, p.y + r); g.moveTo(p.x + r, p.y - r); g.lineTo(p.x - r, p.y + r); g.stroke(); g.restore(); }
    if (this.scale >= 13 || ui.sel.has(u.i) || ui.inspect === u.i) { g.save(); g.font = '10px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'top'; g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,.92)'; g.fillStyle = INK; g.strokeText(u.name, p.x, p.y + R + 4); g.fillText(u.name, p.x, p.y + R + 4); g.restore(); }
  },
  // 무기 · 방패 (바라보는 쪽). 준비(wind)에서는 뒤로 젖히고, 회복에서는 앞으로
  drawArms(u, R, th, now, ally) {
    const g = this.g, W = this.B.W, w = (W.rules.weapons || {})[u.weapon] || {};
    const col = ally ? INK : '#f2f2f2';
    const act = u.act; let wind = 0, rec = 0;
    if (act && (act.k === 'atk' || act.k === 'throw' || act.k === 'bash' || act.k === 'charge')) { const tot = Math.max(0.05, act.end - act.t0), pr = GB.clamp((W.t - act.t0) / tot, 0, 1); if (act.phase === 'wind') wind = pr; else rec = 1 - pr; }
    g.save(); g.rotate(th); g.strokeStyle = col; g.fillStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
    const back = -wind * R * 0.5 + rec * R * 0.35;
    const reach = Math.max(R * 1.5, (u.rng || 0.5) * this.scale * 0.9);
    const k = w.kind;
    if (k === '활') { g.lineWidth = 2; g.beginPath(); g.arc(R * 0.6 + back, 0, R * 0.7, -1.2, 1.2); g.stroke(); g.lineWidth = 0.8; g.beginPath(); g.moveTo(R * 0.6 + back + Math.cos(1.2) * R * 0.7, Math.sin(1.2) * R * 0.7); g.lineTo(R * 0.6 + back + Math.cos(-1.2) * R * 0.7, Math.sin(-1.2) * R * 0.7); g.stroke(); }
    else if (k === '총포류') { g.lineWidth = 4.2; g.beginPath(); g.moveTo(R * 0.3, 0); g.lineTo(R + 6 + Math.min(reach * 0.18, 8) + back, 0); g.stroke(); }
    else if (u.weapon === '맨손' || !u.weapon || k === '맨손') { g.beginPath(); g.arc(R + 2 + back, -R * 0.45, 2.6, 0, 7); g.arc(R + 2 + back, R * 0.45, 2.6, 0, 7); g.fill(); }
    else if (/창/.test(u.weapon)) { const e = R * 0.3 + reach * 0.95 + back; g.lineWidth = 2; g.beginPath(); g.moveTo(-R * 0.4, R * 0.15); g.lineTo(e, R * 0.15); g.stroke(); g.beginPath(); g.moveTo(e + 5, R * 0.15); g.lineTo(e - 2, R * 0.15 - 3); g.lineTo(e - 2, R * 0.15 + 3); g.closePath(); g.fill(); }
    else if (k === '둔기') { const e = R * 0.5 + reach * 0.85 + back; g.lineWidth = 2.6; g.beginPath(); g.moveTo(R * 0.4, R * 0.25); g.lineTo(e, R * 0.25); g.stroke(); g.fillRect(e - 1, R * 0.25 - 4, 7, 8); }
    else { const e = R * 0.6 + reach * 0.8 + back; g.lineWidth = 2.4; g.beginPath(); g.moveTo(R * 0.6, R * 0.3); g.lineTo(e, R * 0.1); g.stroke(); g.lineWidth = 1.6; g.beginPath(); g.moveTo(R * 0.7, R * 0.3 - 3); g.lineTo(R * 0.7, R * 0.3 + 3); g.stroke(); }
    if (u.shield && !u.armShield) {
      g.lineWidth = Math.max(3, R * 0.36); g.strokeStyle = ally ? INK : '#cfcfcf';
      g.beginPath(); g.arc(0, 0, R + 2.5, -0.95, 0.95); g.stroke();
      if (ally) { g.strokeStyle = '#fff'; g.lineWidth = 1; g.beginPath(); g.arc(0, 0, R + 2.5, -0.95, 0.95); g.stroke(); }
    }
    g.restore();
  },
  drawWounds(u, R, th) {
    const g = this.g, W = this.B.W; if (!u.wounds || !u.wounds.length && !u.arms.L && !u.arms.R && !u.eyeLost && !u.crawl) return;
    g.save(); g.fillStyle = RED;
    const dot = (a, r) => { g.beginPath(); g.arc(Math.cos(th + a) * (R + 2), Math.sin(th + a) * (R + 2), r, 0, 7); g.fill(); };
    if (u.arms.L) dot(-1.57, 3); if (u.arms.R) dot(1.57, 3);
    if (u.eyeLost) dot(0, 2.4);
    if (u.crawl) { dot(2.5, 3); dot(-2.5, 3); }
    for (let i = 0; i < Math.min(5, (u.wounds || []).length); i++) dot(0.6 + i * 1.2, 1.8);
    g.restore();
  },
  drawFx(now) {
    const g = this.g, keep = [];
    for (const f of this.fx) {
      const age = (now - f.t0) / 1000, p = this.toS(f.x, f.y);
      const life = f.k === 'num' ? 0.95 : f.k === 'ring' ? 0.6 : f.k === 'burst' ? 0.35 : f.k === 'cross' ? 0.9 : f.k === 'dust' ? 0.6 : 0.3;
      if (age > life) continue; keep.push(f);
      const k = age / life;
      g.save(); g.globalAlpha = 1 - k;
      if (f.k === 'num') { g.font = (f.big ? 'bold 15px' : 'bold 12px') + ' sans-serif'; g.textAlign = 'center'; g.lineWidth = 3; g.strokeStyle = '#fff'; g.fillStyle = f.c; const y = p.y - 14 - k * 24; g.strokeText(f.s, p.x, y); g.fillText(f.s, p.x, y); }
      else if (f.k === 'burst') { g.strokeStyle = INK; g.lineWidth = 1.6; for (let i = 0; i < f.n; i++) { const a = f.a + (i - f.n / 2) * (2.6 / f.n) + (this.portrait ? -Math.PI / 2 : 0), r0 = 4 + k * 6, r1 = 8 + k * 16; g.beginPath(); g.moveTo(p.x + Math.cos(a) * r0, p.y + Math.sin(a) * r0); g.lineTo(p.x + Math.cos(a) * r1, p.y + Math.sin(a) * r1); g.stroke(); } }
      else if (f.k === 'spark') { g.strokeStyle = INK; g.lineWidth = 1.8; for (let i = 0; i < 4; i++) { const a = i * 1.57 + 0.78; g.beginPath(); g.moveTo(p.x + Math.cos(a) * 4, p.y + Math.sin(a) * 4); g.lineTo(p.x + Math.cos(a) * (8 + k * 6), p.y + Math.sin(a) * (8 + k * 6)); g.stroke(); } }
      else if (f.k === 'ring') { g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, 6 + k * f.r * this.scale * 1.4, 0, 7); g.stroke(); }
      else if (f.k === 'dust') { g.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(p.x + Math.cos(i * 1.3) * (6 + k * 10), p.y + Math.sin(i * 1.3) * (6 + k * 10), 3 - k * 2, 0, 7); g.fill(); } }
      else if (f.k === 'cross') { const c = 5 + k * 6; g.fillStyle = RED; g.fillRect(p.x - c, p.y - 14 - k * 18 - c * 0.3, 2 * c, c * 0.6); g.fillRect(p.x - c * 0.3, p.y - 14 - k * 18 - c, c * 0.6, 2 * c); }
      g.restore();
    }
    this.fx = keep;
  },
  drawOverlay(now) {
    const g = this.g, ui = this.ui, B = this.B;
    if (ui.box) { const b = ui.box; g.save(); g.strokeStyle = INK; g.fillStyle = 'rgba(0,0,0,.06)'; g.setLineDash([5, 4]); g.fillRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0)); g.strokeRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0)); g.restore(); }
    g.save(); g.fillStyle = 'rgba(0,0,0,.35)'; g.font = '11px sans-serif'; g.textAlign = 'center';
    const e = this.toS(B.map.W - 1.5, B.map.H / 2), a = this.toS(1.5, B.map.H / 2);
    g.fillText('적', e.x, e.y); g.fillText('아군', a.x, a.y); g.restore();
  }
};
