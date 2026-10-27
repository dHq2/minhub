/* 입력: 선택 · 탭 · 끌기 · 핀치 · 키보드를 명령(GB.Orders)으로 바꾼다. 화면(DOM)은 app 을 통해서만 건드린다.
 *  - 유닛 탭 = 고르기 · 땅 탭 = 이동 · 적 탭 = 공격 · 바닥 물건 탭 = 줍기 · 같은 곳 다시 탭 = 서둘러(사수는 바로 쏨)
 *  - 빈 땅 끌기 = 네모 고르기 · 준비 단계에서 아군 끌기 = 배치 · 두 손가락 = 확대 · 이동 */
GB.UI.State = function () {
  this.sel = new Set(); this.inspect = null; this.mode = 'normal'; this.multi = false; this.detour = false;
  this.box = null; this.app = null; this.lastTap = null;
};
GB.UI.State.prototype = {
  selUnits() {
    const B = this.app && this.app.B; if (!B) return [];
    return [...this.sel].map(i => B.W.units[i]).filter(u => u && u.alive && u.side === 0);
  },
  clearSel() { this.sel.clear(); this.inspect = null; },
  selectOnly(i) { this.sel.clear(); if (i != null) this.sel.add(i); this.inspect = null; },
  toggle(i) { if (this.sel.has(i)) this.sel.delete(i); else this.sel.add(i); this.inspect = null; },
  selectAll() { const B = this.app.B; this.sel.clear(); B.W.units.forEach(u => { if (u.alive && u.side === 0) this.sel.add(u.i); }); }
};

GB.UI.Input = function (view, ui, app) {
  this.view = view; this.ui = ui; this.app = app;
  this.ptr = new Map(); this.g = null;
  const cv = view.cv, self = this;
  cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('pointerdown', e => self.down(e));
  cv.addEventListener('pointermove', e => self.move(e));
  cv.addEventListener('pointerup', e => self.up(e));
  cv.addEventListener('pointercancel', e => { self.ptr.delete(e.pointerId); ui.box = null; if (!self.ptr.size) self.g = null; });
  cv.addEventListener('wheel', e => { e.preventDefault(); view.auto = false; const r = cv.getBoundingClientRect(); view.setZoom(view.cam.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
  window.addEventListener('keydown', e => self.key(e));
};
GB.UI.Input.prototype = {
  pos(e) { const r = this.view.cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; },
  down(e) {
    const B = this.app.B; if (!B) return;
    try { this.view.cv.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    const q = this.pos(e), p = { x: q.x, y: q.y, sx: q.x, sy: q.y, btn: e.button, type: e.pointerType, moved: false, t: performance.now() };
    this.ptr.set(e.pointerId, p);
    if (this.ptr.size === 1) {
      const hit = !B.started ? this.view.unitAt(p.x, p.y, 0) : null;
      this.g = { mode: null, hit: hit, shift: e.shiftKey || e.ctrlKey };
    } else if (this.ptr.size === 2) {
      const [a, b] = [...this.ptr.values()], cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
      this.view.auto = false;
      this.g = { mode: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: this.view.cam.zoom, wp: this.view.toW(cx, cy) };
      this.ui.box = null;
    }
  },
  move(e) {
    const p = this.ptr.get(e.pointerId), B = this.app.B, v = this.view;
    if (!p || !B) return;
    const q = this.pos(e), ddx = q.x - p.x, ddy = q.y - p.y; p.x = q.x; p.y = q.y;
    if (this.g && this.g.mode === 'pinch' && this.ptr.size >= 2) {
      const [a, b] = [...this.ptr.values()], d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      v.cam.zoom = GB.clamp(this.g.z0 * d / this.g.d0, 1, 8); v.scale = v.base * v.cam.zoom;
      v.anchor(this.g.wp.x, this.g.wp.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    if (Math.hypot(q.x - p.sx, q.y - p.sy) > 9) p.moved = true;
    if (!p.moved || !this.g) return;
    if (!this.g.mode) this.g.mode = (p.btn === 1 || p.btn === 2) ? 'pan' : (this.g.hit && !B.started) ? 'drag' : 'box';
    if (this.g.mode === 'pan') { v.auto = false; if (v.cam.zoom > 1.001) { const w0 = v.toW(q.x - ddx, q.y - ddy); v.anchor(w0.x, w0.y, q.x, q.y); } }
    else if (this.g.mode === 'drag') {
      const u = this.g.hit, P = v.toW(q.x, q.y), z = GB.zone(B.map, 0);
      u.x = GB.clamp(P.x, z.x0, z.x1); u.y = GB.clamp(P.y, z.y0, z.y1); u.home = { x: u.x, y: u.y };
      const su = B.setup.units[u.i]; if (su) { su.x = u.x; su.y = u.y; }
      u.path = null; u.order = null;
      if (!this.ui.sel.has(u.i)) this.ui.selectOnly(u.i);
    } else if (this.g.mode === 'box') this.ui.box = { x0: p.sx, y0: p.sy, x1: q.x, y1: q.y };
  },
  up(e) {
    const p = this.ptr.get(e.pointerId), B = this.app.B, v = this.view, ui = this.ui;
    if (!p) return;
    this.ptr.delete(e.pointerId);
    if (!B || !this.g) return;
    const g0 = this.g;
    if (g0.mode === 'pinch') { if (this.ptr.size < 2) this.g = null; return; }
    if (this.ptr.size === 0) this.g = null;
    if (g0.mode === 'box' && ui.box) {
      const b = ui.box; ui.box = null;
      const x0 = Math.min(b.x0, b.x1), x1 = Math.max(b.x0, b.x1), y0 = Math.min(b.y0, b.y1), y1 = Math.max(b.y0, b.y1);
      const ids = B.W.units.filter(u => u.alive && u.side === 0).filter(u => { const s = v.toS(u.x, u.y); return s.x >= x0 && s.x <= x1 && s.y >= y0 && s.y <= y1; }).map(u => u.i);
      if (!(ui.multi || g0.shift)) ui.sel.clear();
      ids.forEach(i => ui.sel.add(i)); ui.inspect = null; this.app.refresh();
      return;
    }
    if (g0.mode === 'drag') { this.app.refresh(); return; }
    if (!p.moved && (p.btn === 0 || p.type === 'touch')) this.tap(p.x, p.y, g0.shift);
  },
  // ---------- 탭 ----------
  tap(sx, sy, additive) {
    const B = this.app.B, v = this.view, ui = this.ui, W = B.W, O = GB.Orders;
    const now = performance.now(), prev = ui.lastTap; ui.lastTap = { x: sx, y: sy, t: now, key: null };
    const twice = prev && now - prev.t < 600 && Math.hypot(prev.x - sx, prev.y - sy) < 26;
    const sel = [...ui.sel];
    const own = v.unitAt(sx, sy, 0);
    // 관계 고르기 모드: 대장(또는 보호해 줄 이)을 탭
    if (own && (ui.mode === 'chief' || ui.mode === 'cover')) {
      const mode = ui.mode === 'cover' ? 'cover' : 'follow';
      const r = O.chief(B, sel.filter(i => i !== own.i), own.i, mode); this.app.toast(r.msg); ui.mode = 'normal'; this.app.refresh(); return;
    }
    if (own) { if (ui.multi || additive) ui.toggle(own.i); else ui.selectOnly(own.i); this.app.refresh(); return; }
    const foe = v.unitAt(sx, sy, 1);
    const detour = ui.detour; ui.detour = false;
    if (foe) {
      if (!sel.length) { ui.inspect = foe.i; this.app.refresh(); return; }
      let r;
      if (ui.mode === 'charge') { r = O.charge(B, sel, foe, null, { detour }); ui.mode = 'normal'; }
      else if (ui.mode === 'throw') { r = O.throwAt(B, sel, foe); ui.mode = 'normal'; }
      else r = O.attack(B, sel, foe, { rush: !!(twice && prev.key === 'a' + foe.i), detour });
      ui.lastTap.key = 'a' + foe.i; this.app.toast(r.msg); this.app.refresh(); return;
    }
    const it = v.itemAt(sx, sy);
    if (it && sel.length) { const r = O.pick(B, sel, it, !!(twice && prev.key === 'i' + it.id)); ui.lastTap.key = 'i' + it.id; this.app.toast(r.msg); this.app.refresh(); return; }
    if (!sel.length) { ui.inspect = null; this.app.refresh(); return; }
    const P = v.toW(sx, sy); let r;
    if (ui.mode === 'charge') { r = O.charge(B, sel, null, P, { detour }); ui.mode = 'normal'; }
    else r = O.move(B, sel, P.x, P.y, { kind: ui.mode === 'amove' ? 'amove' : 'move', hurry: !!(twice && prev.key === 'g'), detour });
    if (ui.mode === 'amove') ui.mode = 'normal';
    ui.lastTap.key = 'g'; this.app.toast(r.msg); this.app.refresh();
  },
  key(e) {
    const B = this.app.B, ui = this.ui;
    if (!B || !this.app.inBattle()) return;
    const sel = [...ui.sel], O = GB.Orders, k = e.key.toLowerCase();
    if (k === ' ') { e.preventDefault(); this.app.togglePlay(); return; }
    if (k === 'escape') { ui.clearSel(); ui.mode = 'normal'; this.app.refresh(); return; }
    if ((e.ctrlKey || e.metaKey) && k === 'a') { e.preventDefault(); ui.selectAll(); this.app.refresh(); return; }
    const say = r => { if (r) this.app.toast(r.msg); this.app.refresh(); };
    if (k === 'h') say(O.hold(B, sel)); else if (k === 'g') say(O.auto(B, sel)); else if (k === 'x' || k === 'backspace') say(O.cancel(B, sel));
    else if (k === 'l') say(O.line(B, sel)); else if (k === 'b') say(O.guardToggle(B, sel));
    else if (k === 'a') { ui.mode = ui.mode === 'amove' ? 'normal' : 'amove'; this.app.refresh(); }
    else if (k === 'f') { ui.mode = ui.mode === 'charge' ? 'normal' : 'charge'; this.app.refresh(); }
    else if (k === 'r') { ui.mode = ui.mode === 'throw' ? 'normal' : 'throw'; this.app.refresh(); }
  }
};
