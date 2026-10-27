/* 굴 전투판 v1 · ui: 캔버스 렌더, 입력(탭/더블탭/드래그/핀치), 지휘 버튼, 막사·결과·승급 화면 */
(function (root) {
  'use strict';
  const BG = root.BG, U = BG.U, C = BG.C, cmd = BG.cmd;
  const $ = id => document.getElementById(id);
  const UI = BG.UI = {};
  const S = UI.s = {
    run: null, W: null, sel: new Set(), inspect: null, mode: 'normal', multi: false, route: null, speed: 1, paused: true,
    cam: { zoom: 1.45, cx: C.MAP_W / 2, cy: C.MAP_H / 2 }, fx: [], recent: [], pend: null, ptr: new Map(), g: null, box: null,
    portrait: false, scale: 1, cw: 0, ch: 0, dpr: 1, finished: false, lastFrame: 0, acc: 0, chipSig: '', infoSig: '', hintMsg: '', hintT: 0
  };
  let cv, g;

  // ---------- 좌표 ----------
  function layout() {
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(2, root.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    S.cw = r.width; S.ch = r.height; S.dpr = dpr;
    S.portrait = S.ch > S.cw * 1.05;
    const base = S.portrait ? Math.min(S.cw / C.MAP_H, S.ch / C.MAP_W) : Math.min(S.cw / C.MAP_W, S.ch / C.MAP_H);
    S.base = base * 0.96;
    S.scale = S.base * S.cam.zoom;
    if (S.cam.zoom <= 1.001) { S.cam.cx = C.MAP_W / 2; S.cam.cy = C.MAP_H / 2; }
    else { S.cam.cx = U.clamp(S.cam.cx, 0, C.MAP_W); S.cam.cy = U.clamp(S.cam.cy, 0, C.MAP_H); }
  }
  function toS(wx, wy) {
    return S.portrait
      ? { x: S.cw / 2 + (wy - S.cam.cy) * S.scale, y: S.ch / 2 - (wx - S.cam.cx) * S.scale }
      : { x: S.cw / 2 + (wx - S.cam.cx) * S.scale, y: S.ch / 2 + (wy - S.cam.cy) * S.scale };
  }
  function toW(sx, sy) {
    return S.portrait
      ? { x: S.cam.cx - (sy - S.ch / 2) / S.scale, y: S.cam.cy + (sx - S.cw / 2) / S.scale }
      : { x: S.cam.cx + (sx - S.cw / 2) / S.scale, y: S.cam.cy + (sy - S.ch / 2) / S.scale };
  }
  const sAng = a => a - (S.portrait ? Math.PI / 2 : 0);
  function camSetAnchor(wx, wy, sx, sy) { // 월드 점 (wx,wy)이 화면 (sx,sy)에 오도록 카메라 이동
    if (S.portrait) { S.cam.cy = wy - (sx - S.cw / 2) / S.scale; S.cam.cx = wx + (sy - S.ch / 2) / S.scale; }
    else { S.cam.cx = wx - (sx - S.cw / 2) / S.scale; S.cam.cy = wy - (sy - S.ch / 2) / S.scale; }
  }
  function setZoom(z, ax, ay) {
    ax = ax == null ? S.cw / 2 : ax; ay = ay == null ? S.ch / 2 : ay;
    const wp = toW(ax, ay);
    S.cam.zoom = U.clamp(z, 1, 7);
    S.scale = S.base * S.cam.zoom;
    camSetAnchor(wp.x, wp.y, ax, ay);
  }
  const vr = u => Math.max(u.s.r * S.scale * 1.1, 7);

  // ---------- 선택 ----------
  const W_ = () => S.W;
  const allies = () => S.W ? S.W.units.filter(u => u.side === 'ally' && u.alive) : [];
  const selUnits = () => [...S.sel].map(id => S.W.units[id - 1]).filter(u => u && u.alive && u.side === 'ally');
  function selectOnly(id) { S.sel.clear(); if (id) S.sel.add(id); S.inspect = null; S.chipSig = ''; }
  function toggleSel(id) { if (S.sel.has(id)) S.sel.delete(id); else S.sel.add(id); S.inspect = null; S.chipSig = ''; }
  function toast(msg) { S.hintMsg = msg; S.hintT = performance.now(); }

  // ---------- 명령 ----------
  const sideF = 0;
  function exactSquad(us) {
    const net = S.W.net.ally;
    for (const sq of net.squads) {
      if (sq.members.length === us.length && us.every(u => sq.members.indexOf(u.id) >= 0)) return sq;
    }
    return null;
  }
  // 선택 유닛들의 목적지: 진형(상대 위치)을 유지하며 P로
  function groupDests(us, P) {
    if (us.length === 1) return [{ u: us[0], dest: { x: U.clamp(P.x, 1, C.MAP_W - 1), y: U.clamp(P.y, 1, C.MAP_H - 1) } }];
    const sq = exactSquad(us);
    let L, offs = {};
    if (sq) { L = S.W.units[sq.leader - 1]; us.forEach(u => { offs[u.id] = sq.off[u.id] || { x: 0, y: 0 }; }); }
    else {
      let x = 0, y = 0; us.forEach(u => { x += u.x; y += u.y; });
      L = { x: x / us.length, y: y / us.length };
      us.forEach(u => { offs[u.id] = U.rot(u.x - L.x, u.y - L.y, -sideF); });
    }
    const dd = Math.hypot(P.x - L.x, P.y - L.y);
    const h = dd < 2 ? sideF : Math.atan2(P.y - L.y, P.x - L.x);
    return us.map(u => {
      const o = U.rot(offs[u.id].x, offs[u.id].y, h);
      return { u: u, dest: { x: U.clamp(P.x + o.x, 1, C.MAP_W - 1), y: U.clamp(P.y + o.y, 1, C.MAP_H - 1) } };
    });
  }
  function issue(items, prio) {
    if (!S.W || S.W.phase === 'end') return;
    const n = cmd.issueMany(S.W, 'ally', items, { prio: !!prio });
    if (!n && S.W.phase === 'run') toast('총지휘관이 없어 명령을 전달할 수 없습니다');
  }
  function orderMove(P, kind, prio) {
    const us = selUnits();
    if (!us.length) return;
    const ds = groupDests(us, P);
    const cap = us.length > 1 ? Math.min.apply(null, us.map(u => u.s.spd)) * 0.95 : 0;
    issue(ds.map(d => ({
      id: d.u.id,
      order: kind === 'retreat' ? cmd.O.retreat(d.dest) : kind === 'charge' ? cmd.O.charge(0, d.dest) : cmd.O.move([d.dest], cap ? { cap: cap } : {})
    })), prio);
  }
  function orderAttack(t, kind, prio) {
    const us = selUnits();
    if (!us.length) return;
    issue(us.map(u => ({ id: u.id, order: kind === 'charge' ? cmd.O.charge(t.id) : cmd.O.attack(t.id) })), prio);
  }
  function sendRoute() {
    const us = selUnits();
    if (!us.length || !S.route || !S.route.length) { S.route = null; return; }
    const pts = S.route.slice();
    const ds = groupDests(us, pts[0]);
    const cap = us.length > 1 ? Math.min.apply(null, us.map(u => u.s.spd)) * 0.95 : 0;
    // 첫 점은 진형 오프셋을 적용하고, 나머지 경유점은 같은 오프셋으로 이동
    issue(ds.map(d => {
      const off = { x: d.dest.x - pts[0].x, y: d.dest.y - pts[0].y };
      const list = pts.map(p => ({ x: U.clamp(p.x + off.x, 1, C.MAP_W - 1), y: U.clamp(p.y + off.y, 1, C.MAP_H - 1) }));
      return { id: d.u.id, order: cmd.O.move(list, cap ? { cap: cap } : {}) };
    }), false);
    S.route = null;
  }

  // ---------- 입력 ----------
  function unitAt(sx, sy, side) {
    let best = null, bd = 1e9;
    for (const u of S.W.units) {
      if (!u.alive || (side && u.side !== side)) continue;
      const p = toS(u.x, u.y);
      const d = Math.hypot(p.x - sx, p.y - sy);
      if (d <= Math.max(vr(u) + 5, 17) && d < bd) { bd = d; best = u; }
    }
    return best;
  }

  function flushPend() {
    const p = S.pend;
    if (!p) return;
    clearTimeout(p.timer);
    S.pend = null;
    commitTap(p, false);
  }
  function commitTap(p, prio) {
    if (!S.W) return;
    if (p.kind === 'enemy') {
      const t = S.W.units[p.id - 1];
      if (t && t.alive) orderAttack(t, S.mode === 'charge' ? 'charge' : 'attack', prio);
    } else {
      orderMove(p.P, S.mode === 'charge' ? 'charge' : (S.mode === 'retreat' ? 'retreat' : 'move'), prio);
    }
    if (S.mode !== 'normal') { S.mode = 'normal'; syncButtons(); }
  }

  function handleTap(sx, sy, additive) {
    if (!S.W) return;
    const own = unitAt(sx, sy, 'ally');
    if (own) {
      flushPend();
      if (S.multi || additive) toggleSel(own.id); else selectOnly(own.id);
      return;
    }
    const foe = unitAt(sx, sy, 'enemy');
    const P = toW(sx, sy);
    if (foe) {
      if (!S.sel.size) { S.inspect = foe.id; return; }
      if (S.route) { return; }
      queueTap({ kind: 'enemy', id: foe.id, sx: sx, sy: sy });
      return;
    }
    if (!S.sel.size) { S.inspect = null; return; }
    if (S.route) { S.route.push({ x: U.clamp(P.x, 1, C.MAP_W - 1), y: U.clamp(P.y, 1, C.MAP_H - 1) }); syncButtons(); return; }
    queueTap({ kind: 'ground', P: P, sx: sx, sy: sy });
  }
  // 같은 곳을 빠르게 두 번 탭하면 우선 명령
  function queueTap(p) {
    const old = S.pend;
    if (old && old.kind === p.kind && Math.hypot(old.sx - p.sx, old.sy - p.sy) < 30 && (p.kind === 'ground' || old.id === p.id)) {
      clearTimeout(old.timer); S.pend = null;
      commitTap(p, true);
      toast('우선 명령: 기존 명령은 보류했다가 끝나면 재개');
      return;
    }
    flushPend();
    p.timer = setTimeout(() => { S.pend = null; commitTap(p, false); }, 260);
    S.pend = p;
  }

  function initInput() {
    cv.addEventListener('contextmenu', e => e.preventDefault());
    cv.addEventListener('pointerdown', e => {
      if (!S.W) return;
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      const r = cv.getBoundingClientRect();
      const p = { x: e.clientX - r.left, y: e.clientY - r.top, sx: e.clientX - r.left, sy: e.clientY - r.top, t: performance.now(), btn: e.button, type: e.pointerType, moved: false };
      S.ptr.set(e.pointerId, p);
      if (S.ptr.size === 1) {
        S.g = { mode: null, hit: S.W.phase === 'prep' ? unitAt(p.x, p.y, 'ally') : null, shift: e.shiftKey || e.ctrlKey };
      } else if (S.ptr.size === 2) {
        const [a, b] = [...S.ptr.values()];
        const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        S.g = { mode: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: S.cam.zoom, wp: toW(cx, cy) };
        S.box = null;
      }
    });
    cv.addEventListener('pointermove', e => {
      const p = S.ptr.get(e.pointerId);
      if (!p || !S.W) return;
      const r = cv.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      const ddx = nx - p.x, ddy = ny - p.y;
      p.x = nx; p.y = ny;
      if (S.g && S.g.mode === 'pinch' && S.ptr.size >= 2) {
        const [a, b] = [...S.ptr.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        S.cam.zoom = U.clamp(S.g.z0 * d / S.g.d0, 1, 7);
        S.scale = S.base * S.cam.zoom;
        camSetAnchor(S.g.wp.x, S.g.wp.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
        return;
      }
      if (Math.hypot(nx - p.sx, ny - p.sy) > 9) p.moved = true;
      if (!p.moved || !S.g) return;
      if (!S.g.mode) {
        if (p.btn === 1 || p.btn === 2) S.g.mode = 'pan';
        else if (S.g.hit && S.W.phase === 'prep') S.g.mode = 'drag';
        else S.g.mode = 'box';
      }
      if (S.g.mode === 'pan') {
        if (S.cam.zoom > 1.001) {
          const w0 = toW(nx - ddx, ny - ddy);
          camSetAnchor(w0.x, w0.y, nx, ny);
        }
      } else if (S.g.mode === 'drag') {
        const u = S.g.hit, P = toW(nx, ny), z = BG.sim.zone('ally');
        u.x = U.clamp(P.x, z.x0, z.x1); u.y = U.clamp(P.y, z.y0, z.y1);
        u.vx = u.vy = 0; u.order = { type: 'hold', pos: { x: u.x, y: u.y } };
        if (!S.sel.has(u.id)) selectOnly(u.id);
      } else if (S.g.mode === 'box') {
        S.box = { x0: p.sx, y0: p.sy, x1: nx, y1: ny };
      }
    });
    const up = e => {
      const p = S.ptr.get(e.pointerId);
      if (!p) return;
      S.ptr.delete(e.pointerId);
      if (!S.W || !S.g) return;
      const g0 = S.g;
      if (g0.mode === 'pinch') { if (S.ptr.size < 2) S.g = null; return; }
      if (S.ptr.size === 0) S.g = null;
      if (g0.mode === 'box' && S.box) {
        const b = S.box; S.box = null;
        const x0 = Math.min(b.x0, b.x1), x1 = Math.max(b.x0, b.x1), y0 = Math.min(b.y0, b.y1), y1 = Math.max(b.y0, b.y1);
        const ids = allies().filter(u => { const s = toS(u.x, u.y); return s.x >= x0 && s.x <= x1 && s.y >= y0 && s.y <= y1; }).map(u => u.id);
        if (!(S.multi || g0.shift)) S.sel.clear();
        ids.forEach(id => S.sel.add(id));
        S.inspect = null; S.chipSig = '';
        return;
      }
      if (g0.mode === 'drag') { S.chipSig = ''; return; }
      if (!p.moved && e.type !== 'pointercancel' && p.btn === 0 || (!p.moved && p.type === 'touch')) handleTap(p.x, p.y, g0.shift);
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', e => { S.ptr.delete(e.pointerId); S.box = null; if (!S.ptr.size) S.g = null; });
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      const r = cv.getBoundingClientRect();
      setZoom(S.cam.zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    root.addEventListener('keydown', e => {
      if (!S.W || $('scrBattle').classList.contains('hidden')) return;
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'Escape') { S.sel.clear(); S.route = null; S.mode = 'normal'; syncButtons(); }
      else if (e.key === 'a' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); selectAll(); }
    });
  }

  // ---------- 그리기 ----------
  function poly(g2, n, R, rot) {
    g2.beginPath();
    for (let i = 0; i < n; i++) {
      const a = rot + i * 2 * Math.PI / n;
      if (i) g2.lineTo(Math.cos(a) * R, Math.sin(a) * R); else g2.moveTo(Math.cos(a) * R, Math.sin(a) * R);
    }
    g2.closePath();
  }
  function drawBody(u, x, y, R, th, alpha) {
    const ally = u.side === 'ally';
    g.save(); g.translate(x, y); g.globalAlpha = alpha;
    g.fillStyle = ally ? '#ffffff' : '#171717'; g.strokeStyle = '#000'; g.lineWidth = 2;
    if (u.shape === 'circle') { g.beginPath(); g.arc(0, 0, R, 0, 7); }
    else if (u.shape === 'square') poly(g, 4, R * 1.28, th + Math.PI / 4);
    else if (u.shape === 'triangle') poly(g, 3, R * 1.3, th);
    else poly(g, 5, R * 1.12, th);
    g.fill(); g.stroke();
    if (!ally) { g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; g.stroke(); }
    g.restore();
  }
  function drawWeapon(u, x, y, R, th) {
    const w = BG.WEAPONS[u.weapon], sc = S.scale;
    const wind = u.act && u.act.k === 'wind' ? 1 - u.act.t / u.act.tot : 0;
    const rec = u.act && u.act.k === 'rec';
    g.save(); g.translate(x, y); g.rotate(th);
    const col = wind > 0 ? '#c0392b' : '#111';
    g.strokeStyle = col; g.fillStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
    const back = -wind * R * 0.5 + (rec ? R * 0.25 : 0);
    const L = Math.max(R * 1.4, w.reach * sc);
    g.lineWidth = 2;
    if (u.weapon === 'fist') {
      g.beginPath(); g.arc(R + 2 + back, -R * 0.45, 2.6, 0, 7); g.arc(R + 2 + back, R * 0.45, 2.6, 0, 7); g.fill();
    } else if (u.weapon === 'sword') {
      g.lineWidth = 2.4; g.beginPath(); g.moveTo(R * 0.6, R * 0.3); g.lineTo(R * 0.6 + L * 0.8 + back, R * 0.1); g.stroke();
      g.beginPath(); g.moveTo(R * 0.7, R * 0.3 - 3); g.lineTo(R * 0.7, R * 0.3 + 3); g.stroke();
    } else if (u.weapon === 'spear') {
      const e = R * 0.3 + L * 0.95 + back;
      g.lineWidth = 2; g.beginPath(); g.moveTo(-R * 0.4, R * 0.15); g.lineTo(e, R * 0.15); g.stroke();
      g.beginPath(); g.moveTo(e + 5, R * 0.15); g.lineTo(e - 2, R * 0.15 - 3); g.lineTo(e - 2, R * 0.15 + 3); g.closePath(); g.fill();
    } else if (u.weapon === 'mace') {
      const e = R * 0.5 + L * 0.8 + back;
      g.lineWidth = 2.6; g.beginPath(); g.moveTo(R * 0.4, R * 0.25); g.lineTo(e, R * 0.25); g.stroke();
      g.fillRect(e - 1, R * 0.25 - 4, 7, 8);
    } else if (u.weapon === 'cannon') {
      g.lineWidth = 4.5; g.beginPath(); g.moveTo(R * 0.3, 0); g.lineTo(R + 7 + back, 0); g.stroke();
    }
    if (u.shield) {
      g.strokeStyle = '#111'; g.lineWidth = Math.max(3, R * 0.38);
      g.beginPath(); g.arc(0, 0, R + 2.5, -0.95, 0.95); g.stroke();
      g.strokeStyle = u.side === 'ally' ? '#fff' : '#888'; g.lineWidth = 1;
      g.beginPath(); g.arc(0, 0, R + 2.5, -0.95, 0.95); g.stroke();
    }
    g.restore();
  }
  function drawUnit(u, pendingIds) {
    const p = toS(u.x, u.y), R = vr(u), th = sAng(u.f);
    const down = BG.sim.isDown(u);
    // 방어 태세 고리
    if (u.stance === 'defend') {
      g.save(); g.strokeStyle = '#2a6df4'; g.lineWidth = 2; g.setLineDash([4, 3]);
      g.beginPath(); g.arc(p.x, p.y, R + 6, 0, 7); g.stroke(); g.restore();
    }
    // 돌격 잔상
    if (u.charge) {
      g.save(); g.strokeStyle = '#e67e00'; g.lineWidth = 2;
      for (let i = -1; i <= 1; i++) {
        const a = sAng(u.f) + Math.PI, ox = Math.cos(a + 1.57) * i * R * 0.6, oy = Math.sin(a + 1.57) * i * R * 0.6;
        g.beginPath(); g.moveTo(p.x + ox + Math.cos(a) * R * 1.1, p.y + oy + Math.sin(a) * R * 1.1);
        g.lineTo(p.x + ox + Math.cos(a) * R * 2.4, p.y + oy + Math.sin(a) * R * 2.4); g.stroke();
      }
      g.restore();
    }
    drawBody(u, p.x, p.y, R, th, down ? 0.5 : 1);
    if (!down) drawWeapon(u, p.x, p.y, R, th);
    else { g.save(); g.strokeStyle = '#c0392b'; g.lineWidth = 2; g.beginPath(); g.moveTo(p.x - R * .6, p.y - R * .6); g.lineTo(p.x + R * .6, p.y + R * .6); g.moveTo(p.x + R * .6, p.y - R * .6); g.lineTo(p.x - R * .6, p.y + R * .6); g.stroke(); g.restore(); }
    if (u.act && u.act.k === 'stun') { g.save(); g.strokeStyle = '#e0a800'; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y - R - 4, 3.5, 0, 7); g.stroke(); g.restore(); }
    // 선택 고리
    if (u.side === 'ally' && S.sel.has(u.id)) {
      g.save(); g.strokeStyle = '#f5a300'; g.lineWidth = 2.6; g.beginPath(); g.arc(p.x, p.y, R + 4.5, 0, 7); g.stroke(); g.restore();
    } else if (S.inspect === u.id) {
      g.save(); g.strokeStyle = '#c0392b'; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, R + 4.5, 0, 7); g.stroke(); g.restore();
    }
    // 체력/스태미나
    const bw = Math.max(16, R * 2.2), bx = p.x - bw / 2, by = p.y - R - 9;
    g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(bx, by, bw, 3.5);
    g.fillStyle = u.side === 'ally' ? '#2fb36b' : '#d9483b'; g.fillRect(bx, by, bw * U.clamp(u.hp / u.s.hp, 0, 1), 3.5);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(bx, by + 4, bw, 2);
    g.fillStyle = '#3b82f6'; g.fillRect(bx, by + 4, bw * U.clamp(u.stam / u.s.stam, 0, 1), 2);
    // 별 / 분대 문자
    const stars = cmd.stars(S.W, u);
    if (stars) {
      g.save(); g.font = 'bold 12px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'bottom';
      g.lineWidth = 3; g.strokeStyle = '#000'; g.fillStyle = '#ffd23a';
      const t = stars === 2 ? '★★' : '★';
      g.strokeText(t, p.x, by - 1); g.fillText(t, p.x, by - 1); g.restore();
    }
    const sq = cmd.squadOf(S.W, u);
    if (sq) {
      g.save(); g.font = 'bold 10px sans-serif'; g.textAlign = 'left'; g.textBaseline = 'middle';
      g.lineWidth = 3; g.strokeStyle = '#fff'; g.fillStyle = u.side === 'ally' ? '#1a4fd0' : '#a02020';
      const t = String.fromCharCode(64 + sq.id);
      g.strokeText(t, p.x + R + 3, p.y - R); g.fillText(t, p.x + R + 3, p.y - R); g.restore();
    }
    if (S.scale >= 11 || S.sel.has(u.id) || S.inspect === u.id) {
      g.save(); g.font = '10px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'top';
      g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,.9)'; g.fillStyle = '#111';
      g.strokeText(u.name, p.x, p.y + R + 4); g.fillText(u.name, p.x, p.y + R + 4); g.restore();
    }
    // 명령 대기/실패 표시
    if (u.side === 'ally') {
      if (pendingIds[u.id]) { g.save(); g.fillStyle = '#00a0b0'; g.font = 'bold 12px sans-serif'; g.textAlign = 'center'; g.fillText('…', p.x + R + 6, p.y + 4); g.restore(); }
      else if (S.W.t - u.lostMark < 2.2) { g.save(); g.fillStyle = '#d33'; g.font = 'bold 13px sans-serif'; g.textAlign = 'center'; g.fillText('✗', p.x + R + 6, p.y + 4); g.restore(); }
    }
  }
  function arrow(x0, y0, x1, y1, hs) {
    const a = Math.atan2(y1 - y0, x1 - x0);
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - Math.cos(a - 0.45) * hs, y1 - Math.sin(a - 0.45) * hs);
    g.lineTo(x1 - Math.cos(a + 0.45) * hs, y1 - Math.sin(a + 0.45) * hs); g.closePath(); g.fill();
  }
  function drawOrder(u, emph) {
    const o = u.order, a = toS(u.x, u.y);
    g.save(); g.globalAlpha = emph ? 0.95 : 0.32; g.lineWidth = emph ? 2.4 : 1.4;
    const line = (pts, col, dash, hs) => {
      g.strokeStyle = col; g.fillStyle = col; g.setLineDash(dash);
      let px = a.x, py = a.y;
      g.beginPath(); g.moveTo(px, py);
      const ss = pts.map(p => toS(p.x, p.y));
      ss.forEach(s => g.lineTo(s.x, s.y)); g.stroke();
      g.setLineDash([]);
      if (ss.length) { const l = ss[ss.length - 1], pv = ss.length > 1 ? ss[ss.length - 2] : a; arrow(pv.x, pv.y, l.x, l.y, hs); }
    };
    if (o.type === 'move' && o.pts.length) line(o.pts, '#2a6df4', [7, 5], emph ? 9 : 6);
    else if (o.type === 'retreat' && o.pts.length) line(o.pts, '#777', [4, 5], emph ? 9 : 6);
    else if (o.type === 'attack') { const t = S.W.units[o.target - 1]; if (t && t.alive) line([t], '#d33', [], emph ? 10 : 6); }
    else if (o.type === 'charge') {
      g.lineWidth = emph ? 4 : 2.4;
      const t = o.target ? S.W.units[o.target - 1] : null;
      if (t && t.alive) line([t], '#e67e00', [], 12); else if (o.pts && o.pts.length) line(o.pts, '#e67e00', [], 12);
    } else if (o.type === 'hold' && emph && o.pos) {
      const s = toS(o.pos.x, o.pos.y);
      g.strokeStyle = '#2a6df4'; g.lineWidth = 2; g.strokeRect(s.x - 5, s.y - 5, 10, 10);
    }
    g.restore();
  }
  function drawPulses() {
    const W = S.W;
    for (const p of W.pulses) {
      const a = W.units[p.from - 1], b = W.units[p.to - 1];
      if (!a || !b || a.side !== 'ally') continue;
      if (W.t < p.t0 || W.t > p.t1 + 0.9) continue;
      const A = toS(a.x, a.y), B = toS(b.x, b.y);
      const pr = U.clamp((W.t - p.t0) / Math.max(0.01, p.t1 - p.t0), 0, 1);
      const col = p.kind === 'relay' ? '#d98a00' : '#00a0b0';
      g.save(); g.strokeStyle = col; g.fillStyle = col; g.globalAlpha = 0.55; g.lineWidth = 1.5; g.setLineDash([2, 4]);
      g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(A.x + (B.x - A.x) * pr, A.y + (B.y - A.y) * pr); g.stroke();
      g.setLineDash([]); g.globalAlpha = 0.9;
      if (pr < 1) { g.beginPath(); g.arc(A.x + (B.x - A.x) * pr, A.y + (B.y - A.y) * pr, 3, 0, 7); g.fill(); }
      else if (!p.ok) { g.fillStyle = '#d33'; g.font = 'bold 14px sans-serif'; g.textAlign = 'center'; g.fillText('✗', B.x, B.y - vr(b) - 12); }
      g.restore();
    }
  }
  function drawSquadLinks() {
    const W = S.W, net = W.net.ally;
    g.save(); g.strokeStyle = 'rgba(214,160,0,.5)'; g.lineWidth = 1; g.setLineDash([1, 4]);
    net.squads.forEach(sq => {
      const L = W.units[sq.leader - 1], A = toS(L.x, L.y);
      sq.members.forEach(id => { if (id === sq.leader) return; const m = W.units[id - 1], B = toS(m.x, m.y); g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y); g.stroke(); });
    });
    g.restore();
  }
  function drawFx(now) {
    S.fx = S.fx.filter(f => now - f.t0 < 1000);
    g.save(); g.textAlign = 'center'; g.font = 'bold 12px sans-serif';
    for (const f of S.fx) {
      const k = (now - f.t0) / 1000, p = toS(f.x, f.y);
      g.globalAlpha = 1 - k; g.lineWidth = 3; g.strokeStyle = '#fff'; g.fillStyle = f.col;
      g.strokeText(f.text, p.x, p.y - 12 - k * 22); g.fillText(f.text, p.x, p.y - 12 - k * 22);
    }
    g.restore();
  }

  function draw(now) {
    layout();
    g.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    g.fillStyle = '#cfd2d8'; g.fillRect(0, 0, S.cw, S.ch);
    const W = S.W;
    if (!W) return;
    // 맵
    const c0 = toS(0, 0), c1 = toS(C.MAP_W, C.MAP_H);
    const mx = Math.min(c0.x, c1.x), my = Math.min(c0.y, c1.y), mw = Math.abs(c1.x - c0.x), mh = Math.abs(c1.y - c0.y);
    g.fillStyle = '#fff'; g.fillRect(mx, my, mw, mh);
    g.save(); g.beginPath(); g.rect(mx, my, mw, mh); g.clip();
    g.strokeStyle = '#ececec'; g.lineWidth = 1;
    for (let x = 0; x <= C.MAP_W; x += 4) { const a = toS(x, 0), b = toS(x, C.MAP_H); g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
    for (let y = 0; y <= C.MAP_H; y += 4) { const a = toS(0, y), b = toS(C.MAP_W, y); g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
    if (W.phase === 'prep') {
      [['ally', 'rgba(60,120,255,.08)', '#7aa2ff'], ['enemy', 'rgba(220,60,60,.07)', '#e59a9a']].forEach(zz => {
        const z = BG.sim.zone(zz[0]), a = toS(z.x0, z.y0), b = toS(z.x1, z.y1);
        g.fillStyle = zz[1]; g.fillRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
        g.strokeStyle = zz[2]; g.setLineDash([6, 5]); g.strokeRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y)); g.setLineDash([]);
      });
    }
    g.restore();
    g.strokeStyle = '#999'; g.lineWidth = 1.5; g.strokeRect(mx, my, mw, mh);

    const pendingIds = {};
    W.msgs.forEach(m => { pendingIds[m.to] = 1; });
    // 쓰러진 자리 표시
    W.units.forEach(u => {
      if (u.alive) return;
      const p = toS(u.x, u.y);
      g.save(); g.globalAlpha = 0.3; g.strokeStyle = u.side === 'ally' ? '#2a6df4' : '#222'; g.lineWidth = 2;
      const r = 5; g.beginPath(); g.moveTo(p.x - r, p.y - r); g.lineTo(p.x + r, p.y + r); g.moveTo(p.x + r, p.y - r); g.lineTo(p.x - r, p.y + r); g.stroke(); g.restore();
    });
    drawSquadLinks();
    // 명령선: 선택 유닛은 진하게, 나머지 아군은 연하게
    W.units.forEach(u => { if (u.alive && u.side === 'ally') drawOrder(u, S.sel.has(u.id)); });
    if (S.inspect) { const t = W.units[S.inspect - 1]; if (t && t.alive) drawOrder(t, false); }
    const order = W.units.filter(u => u.alive).sort((a, b) => a.y - b.y);
    order.forEach(u => drawUnit(u, pendingIds));
    // 투사체
    g.save();
    W.projs.forEach(p => {
      const a = toS(p.x, p.y), b = toS(p.x - p.vx * 0.05, p.y - p.vy * 0.05);
      g.strokeStyle = '#333'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    });
    g.restore();
    drawPulses();
    drawFx(now);
    // 경유 경로 미리보기
    if (S.route && S.route.length) {
      const us = selUnits();
      g.save(); g.strokeStyle = '#2a6df4'; g.fillStyle = '#2a6df4'; g.lineWidth = 2; g.setLineDash([6, 4]);
      let a = us.length ? toS(us[0].x, us[0].y) : toS(S.route[0].x, S.route[0].y);
      g.beginPath(); g.moveTo(a.x, a.y);
      S.route.forEach(p => { const s = toS(p.x, p.y); g.lineTo(s.x, s.y); });
      g.stroke(); g.setLineDash([]);
      S.route.forEach((p, i) => { const s = toS(p.x, p.y); g.beginPath(); g.arc(s.x, s.y, 6, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = 'bold 9px sans-serif'; g.textAlign = 'center'; g.fillText(String(i + 1), s.x, s.y + 3); g.fillStyle = '#2a6df4'; });
      g.restore();
    }
    if (S.box) {
      g.save(); g.strokeStyle = '#f5a300'; g.fillStyle = 'rgba(245,163,0,.12)'; g.setLineDash([5, 4]);
      const b = S.box; g.fillRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0));
      g.strokeRect(Math.min(b.x0, b.x1), Math.min(b.y0, b.y1), Math.abs(b.x1 - b.x0), Math.abs(b.y1 - b.y0)); g.restore();
    }
    // 방향 표시: 적 진영 쪽
    g.save(); g.fillStyle = 'rgba(0,0,0,.35)'; g.font = '11px sans-serif'; g.textAlign = 'center';
    const e = toS(C.MAP_W - 1.5, C.MAP_H / 2), a2 = toS(1.5, C.MAP_H / 2);
    g.fillText('적', e.x, e.y); g.fillText('아군', a2.x, a2.y); g.restore();
  }

  // ---------- HUD ----------
  const shapeIcon = s => BG.SHAPES[s].icon;
  function unitDesc(u) {
    return shapeIcon(u.shape) + BG.SHAPES[u.shape].name + ' · ' + BG.WEAPONS[u.weapon].name + (u.shield ? '+방패' : '');
  }
  function orderText(u) {
    const o = u.order;
    const t = { move: '이동', hold: '정지 사수', attack: '공격', charge: '돌격', retreat: '이탈', auto: '자율' }[o.type] || o.type;
    let s = t;
    if (o.type === 'attack' || (o.type === 'charge' && o.target)) { const e = S.W.units[o.target - 1]; if (e) s += ' → ' + e.name; }
    if (u.stack.length) s += ' (보류 ' + u.stack.length + ')';
    return s;
  }
  function refreshHud(force) {
    const W = S.W;
    if (!W) return;
    // 상단 라벨
    const na = W.units.filter(u => u.side === 'ally' && u.alive).length, nt = W.units.filter(u => u.side === 'ally').length;
    const ne = W.units.filter(u => u.side === 'enemy' && u.alive).length, nte = W.units.filter(u => u.side === 'enemy').length;
    const M = cmd.main(W, 'ally');
    $('lblTop').innerHTML = '<b>단계 ' + W.stage + '</b> · ' + U.fmtT(W.t) + ' · ' + (W.phase === 'prep' ? '준비' : (W.phase === 'end' ? '종료' : (S.paused ? '정지' : '진행'))) +
      '<br>아군 ' + na + '/' + nt + ' vs 적 ' + ne + '/' + nte + (M ? ' · 총지휘 ★ ' + M.name : '');
    // 칩
    const us = W.units.filter(u => u.side === 'ally');
    const sig = us.map(u => u.id + (u.alive ? 1 : 0) + (S.sel.has(u.id) ? 's' : '') + Math.round(u.hp / u.s.hp * 20) + Math.round(u.stam / u.s.stam * 10) + cmd.stars(W, u) + (cmd.squadOf(W, u) ? cmd.squadOf(W, u).id : '')).join('|');
    if (force || sig !== S.chipSig) {
      S.chipSig = sig;
      $('chips').innerHTML = us.map(u => {
        const sq = cmd.squadOf(W, u), st = cmd.stars(W, u);
        return '<div class="chip' + (S.sel.has(u.id) ? ' sel' : '') + (u.alive ? '' : ' dead') + '" data-id="' + u.id + '">' +
          '<span class="star">' + (st === 2 ? '★★' : st ? '★' : '') + '</span>' + shapeIcon(u.shape) + ' ' + u.name + (sq ? ' <b style="color:#7aa2ff">' + String.fromCharCode(64 + sq.id) + '</b>' : '') +
          '<div class="bar"><i style="width:' + Math.round(Math.max(0, u.hp) / u.s.hp * 100) + '%"></i></div>' +
          '<div class="bar st"><i style="width:' + Math.round(u.stam / u.s.stam * 100) + '%"></i></div></div>';
      }).join('');
    }
    // 정보 패널
    const sel = selUnits();
    let html = '';
    const one = sel.length === 1 ? sel[0] : (S.inspect ? W.units[S.inspect - 1] : null);
    if (one && one.alive) {
      const sq = cmd.squadOf(W, one), st = cmd.stars(W, one);
      html = '<div class="h">' + (st ? '★'.repeat(st) + ' ' : '') + (one.side === 'enemy' ? '적 ' : '') + one.name + ' <span class="dim">' + BG.RANKS[one.rank].name + '</span></div>' +
        unitDesc(one) + '<br>HP ' + Math.round(one.hp) + '/' + Math.round(one.s.hp) + ' · 스태미나 ' + Math.round(one.stam / one.s.stam * 100) + '% · 균형 ' + Math.round(one.poise / one.poiseMax * 100) + '%' +
        '<br><span class="dim">공격 ' + Math.round(one.s.atk) + ' 방어 ' + U.r1(one.s.def) + ' 기동 ' + U.r1(one.s.spd) + ' 막기 ' + Math.round(one.s.blk) + ' 사격 ' + Math.round(one.s.shoot) + ' 지휘 ' + Math.round(one.s.cmd) + '</span>' +
        '<br>' + (one.side === 'ally' ? '명령: ' + orderText(one) + (one.stance === 'defend' ? ' · 방어 태세' : '') : (BG.BG_SHOW_ENEMY_ORDERS ? orderText(one) : '')) +
        (sq ? '<br><span class="dim">분대 ' + String.fromCharCode(64 + sq.id) + (sq.leader === one.id ? ' (분대장)' : '') + '</span>' : '') +
        (one.side === 'ally' ? '<br><span class="dim">지휘 범위 ' + U.r1(cmd.cmdRange(one)) + 'm</span>' : '');
    } else if (sel.length > 1) {
      html = '<div class="h">' + sel.length + '명 선택</div>' + sel.map(u => u.name).join(', ') + (exactSquad(sel) ? '<br><span class="dim">분대 전원 — 진형 유지 이동</span>' : '<br><span class="dim">현재 간격을 유지하며 이동</span>');
    }
    const now = performance.now();
    $('info').innerHTML = html;
    $('info').style.display = html ? '' : 'none';
    // 힌트
    let hint = '';
    if (now - S.hintT < 3500 && S.hintMsg) hint = S.hintMsg;
    else if (S.route) hint = '경유점을 탭해 추가 · 다시 "경유 +" 를 누르면 전송 (' + S.route.length + ')';
    else if (S.mode === 'charge') hint = '돌격: 적 또는 지점을 탭';
    else if (S.mode === 'retreat') hint = '이탈: 후퇴할 지점을 탭';
    else if (W.phase === 'prep') hint = '준비: 유닛을 끌어 배치 · 지휘관/분대 편성 · 명령을 미리 내리고 "전투 개시"';
    else if (!S.sel.size) hint = '유닛을 탭해 선택 (여러 명은 "다중 선택" 또는 끌어서 선택)';
    else hint = '땅 탭=이동 · 적 탭=공격 · 같은 곳 두 번 탭=우선 명령';
    $('hint').textContent = hint;
    // 미니 로그
    $('minilog').innerHTML = S.recent.slice(-4).map(s => '<div>' + s + '</div>').join('');
    $('minilog').style.display = S.recent.length ? '' : 'none';
    syncPlayBtn();
  }
  function syncPlayBtn() {
    const W = S.W, b = $('btnPlay');
    if (!W) return;
    if (W.phase === 'prep') { b.textContent = '▶ 전투 개시'; b.disabled = false; }
    else if (W.phase === 'run') { b.textContent = S.paused ? '▶ 재개' : '⏸ 정지'; b.disabled = false; }
    else { b.textContent = '종료'; b.disabled = true; }
  }
  function syncButtons() {
    $('mNormal').classList.toggle('on', S.mode === 'normal');
    $('mCharge').classList.toggle('on', S.mode === 'charge');
    $('mRetreat').classList.toggle('on', S.mode === 'retreat');
    $('bMulti').classList.toggle('on', S.multi);
    $('bRoute').classList.toggle('on', !!S.route);
    $('bRoute').textContent = S.route ? '경로 전송 (' + S.route.length + ')' : '경유 +';
    $('btnSpeed').textContent = S.speed + 'x';
    $('btnAI').classList.toggle('on', !!(S.W && S.W.ctrl.ally));
    const us = selUnits();
    const allDef = us.length && us.every(u => u.stance === 'defend');
    $('bDefend').classList.toggle('on', !!allDef);
  }

  // ---------- 전투 진행 ----------
  function togglePlay() {
    const W = S.W;
    if (!W || W.phase === 'end') return;
    flushPend();
    if (W.phase === 'prep') { BG.sim.startBattle(W); S.paused = false; }
    else S.paused = !S.paused;
    syncButtons(); refreshHud(true);
  }
  function selectAll() { S.sel.clear(); allies().forEach(u => S.sel.add(u.id)); S.chipSig = ''; }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!S.W || $('scrBattle').classList.contains('hidden')) { S.lastFrame = now; return; }
    const dt = Math.min(0.1, (now - S.lastFrame) / 1000); S.lastFrame = now;
    const W = S.W;
    if (W.phase === 'run' && !S.paused) {
      S.acc += dt * S.speed;
      let n = 0;
      while (S.acc >= C.DT && n < 24 && W.phase === 'run') { BG.sim.step(W); S.acc -= C.DT; n++; }
      if (n >= 24) S.acc = 0;
    }
    draw(now);
    if (now - (S.hudT || 0) > 120) { S.hudT = now; refreshHud(false); syncButtons(); }
    if (W.phase === 'end' && !S.finished) onBattleEnd();
  }

  // 로그 이벤트 → 미니 로그와 떠오르는 글자
  BG.Log.onEvent = function (W, e) {
    if (W !== S.W) return;
    const txt = BG.Log.text(W, e);
    if (e.k !== 'shot' && e.k !== 'miss') { S.recent.push(txt); if (S.recent.length > 40) S.recent.shift(); }
    const now = performance.now();
    if (e.k === 'hit') {
      const d = W.units[e.d - 1];
      if (!d) return;
      S.fx.push({ x: d.x, y: d.y, t0: now, text: (e.blk ? '막 ' : '') + '-' + Math.round(e.dmg), col: e.blk ? '#666' : (d.side === 'ally' ? '#d33' : '#1a4fd0') });
    } else if (e.k === 'down') {
      const d = W.units[e.d - 1]; if (d) S.fx.push({ x: d.x, y: d.y, t0: now, text: '넘어짐', col: '#b06000' });
    } else if (e.k === 'dead') {
      const d = W.units[e.d - 1]; if (d) S.fx.push({ x: d.x, y: d.y, t0: now, text: '쓰러짐', col: '#000' });
    } else if (e.k === 'guardbreak') {
      const d = W.units[e.d - 1]; if (d) S.fx.push({ x: d.x, y: d.y, t0: now, text: '막기 붕괴', col: '#b06000' });
    }
  };

  // ---------- 모달 ----------
  function modal(html, bind) {
    const m = $('modal'), box = $('modalBox');
    box.innerHTML = html;
    m.classList.remove('hidden');
    if (bind) bind(box);
  }
  function closeModal() { $('modal').classList.add('hidden'); }
  function cardHtml(d, extra) {
    const s = BG.calcStats(d), ri = BG.rankIdx(d.wins || 0);
    return '<div class="card' + (extra ? ' new' : '') + '"><div class="nm">' + BG.SHAPES[d.shape].icon + ' ' + d.name + '<span class="badge">' + BG.RANKS[ri].name + '</span>' + (extra ? '<span class="badge" style="background:#17503a;color:#9ef0c4">신규</span>' : '') + '</div>' +
      '<div>' + BG.SHAPES[d.shape].name + ' · ' + BG.WEAPONS[d.weapon].name + (d.shield ? ' + 방패' : '') + '</div>' +
      '<div class="st">생존 승리 ' + (d.wins || 0) + ' · 처치 ' + (d.kills || 0) + '</div>' +
      '<div class="st">HP ' + Math.round(s.hp) + ' 공격 ' + Math.round(s.atk) + ' 방어 ' + U.r1(s.def) + ' 기동 ' + U.r1(s.spd) + '<br>막기 ' + Math.round(s.blk) + ' 스태미나 ' + Math.round(s.stam) + ' 사격 ' + Math.round(s.shoot) + ' 지휘 ' + Math.round(s.cmd) + '</div></div>';
  }

  function renderHome() {
    const run = S.run;
    $('homeSub').innerHTML = '단계 <b>' + run.stage + '</b> · 보유 <b>' + run.roster.length + '</b>명 · 누적 승리 ' + run.totalWins + ' · 최고 ' + run.best + '단계' +
      '<br>승리하면 랜덤 유닛이 합류하고, 쓰러진 유닛은 영구 손실됩니다. 생존 승리 2회마다 승급(강화)합니다.';
    $('rosterCards').innerHTML = run.roster.map(d => cardHtml(d)).join('') || '<div class="sub">보유 유닛이 없습니다. 새 런을 시작하세요.</div>';
    $('btnStart').disabled = run.over || !run.roster.length;
    $('btnStart').textContent = run.over ? '런 종료됨' : '전투 시작 (단계 ' + run.stage + ')';
  }
  function renderLogs() {
    const list = BG.Log.listLogs().slice().reverse();
    $('logsList').innerHTML = list.length ? list.map((lg, i) => {
      const r = lg.result ? ({ ally: '승리', enemy: '패배', draw: '무승부' }[lg.result.winner]) : '-';
      return '<div class="logrow"><span>단계 ' + lg.stage + ' · ' + r + ' · ' + U.fmtT(lg.result ? lg.result.t : 0) + ' · 이벤트 ' + lg.events.length + '<br><span style="color:var(--dim)">' + (lg.startedAt || '').slice(0, 16).replace('T', ' ') + '</span></span>' +
        '<span class="row"><button class="btn sm" data-j="' + i + '">JSON</button><button class="btn sm" data-t="' + i + '">TXT</button></span></div>';
    }).join('') : '<div class="sub">아직 저장된 로그가 없습니다.</div>';
    $('logsList').dataset.n = list.length;
    UI._logList = list;
  }
  function textFromLog(lg) {
    const Wl = { units: lg.units };
    return '굴 전투판 ' + lg.v + ' 전투 로그 · 단계 ' + lg.stage + ' · 시드 ' + lg.seed + ' · ' + lg.startedAt + '\n' +
      lg.units.map(u => (u.side === 'ally' ? '[아군] ' : '[적] ') + u.name + ' ' + u.rank + ' ' + BG.SHAPES[u.shape].name + ' ' + BG.WEAPONS[u.weapon].name + (u.shield ? '+방패' : '') + ' ' + JSON.stringify(u.stats) + (u.res ? ' → ' + (u.res.alive ? '생존' : '쓰러짐') + ' 처치' + u.res.kills + ' 가한피해' + u.res.dealt + ' 받은피해' + u.res.taken : '')).join('\n') +
      '\n----\n' + lg.events.map(e => BG.Log.text(Wl, e)).join('\n') + (lg.overflow ? '\n(이후 ' + lg.overflow + '건 생략)' : '');
  }
  function showHome() {
    S.W = null; S.paused = true;
    $('scrBattle').classList.add('hidden');
    $('scrHome').classList.remove('hidden');
    renderHome(); renderLogs();
  }

  function startBattle() {
    const run = S.run;
    if (run.over || !run.roster.length) return;
    S.W = BG.Run.world(run);
    BG.sim.setController(S.W, 'enemy', BG.AI.create());
    S.sel.clear(); S.inspect = null; S.mode = 'normal'; S.multi = false; S.route = null; S.pend = null;
    S.fx = []; S.recent = []; S.paused = true; S.finished = false; S.speed = 1; S.acc = 0;
    S.cam = { zoom: 1.45, cx: C.MAP_W / 2, cy: C.MAP_H / 2 };
    S.chipSig = '';
    $('scrHome').classList.add('hidden');
    $('scrBattle').classList.remove('hidden');
    $('logDrawer').classList.add('hidden');
    S.lastFrame = performance.now();
    syncButtons(); refreshHud(true);
  }

  function onBattleEnd() {
    S.finished = true; S.paused = true;
    const W = S.W, run = S.run;
    const res = BG.Run.finish(run, W);
    BG.Log.saveLog(W, { outcome: res.outcome, lost: res.lost.map(l => l.name), reward: res.reward ? res.reward.name : null, promoted: res.promoted.map(p => p.name + '→' + p.to) });
    BG.Log.saveRun(run);
    refreshHud(true);
    const title = res.outcome === 'win' ? '<span class="win">승리</span>' : (res.outcome === 'lose' ? '<span class="lose">패배</span>' : '<span class="draw">무승부(교착)</span>');
    let h = '<h2>' + title + ' · 단계 ' + W.stage + '</h2><p>전투 시간 ' + U.fmtT(W.result.t) + ' · 아군 처치 ' + res.kills + '</p>';
    if (res.lost.length) h += '<p class="lose">영구 손실: ' + res.lost.map(l => l.name).join(', ') + '</p>';
    else h += '<p>손실 없음</p>';
    if (res.promoted.length) h += '<p class="win">승급: ' + res.promoted.map(p => p.name + ' → ' + p.to).join(', ') + '</p>';
    if (res.reward) h += '<p>합류한 유닛</p>' + cardHtml(res.reward, true);
    if (res.outcome === 'win' && !res.reward) h += '<p class="dim">편성이 가득 차 신규 유닛은 합류하지 않았습니다.</p>';
    if (res.over) h += '<p class="lose">모든 유닛을 잃어 런이 종료되었습니다. (최고 ' + run.best + '단계)</p>';
    if (res.outcome === 'draw') h += '<p>교착으로 판정되어 단계와 보유 유닛은 그대로입니다.</p>';
    h += '<div class="row" style="margin-top:10px"><button class="btn" id="rJson">로그 JSON</button><button class="btn" id="rTxt">로그 TXT</button><button class="btn go" id="rNext">계속</button></div>';
    modal(h, box => {
      $('rJson').onclick = () => BG.Log.download(BG.Log.fileName(W.log, 'json'), JSON.stringify(W.log));
      $('rTxt').onclick = () => BG.Log.download(BG.Log.fileName(W.log, 'txt'), textFromLog(W.log), 'text/plain');
      $('rNext').onclick = () => { closeModal(); promoteNext(); };
    });
  }
  function promoteNext() {
    const run = S.run;
    if (!run.pending.length) { BG.Log.saveRun(run); showHome(); return; }
    const p = run.pending[0], d = run.roster.find(r => r.uid === p.uid);
    if (!d) { run.pending.shift(); promoteNext(); return; }
    let h = '<h2>승급 · ' + d.name + '</h2><p>' + p.from + ' → <b>' + p.to + '</b> 강화를 하나 고르세요.</p>' + cardHtml(d);
    p.options.forEach((o, i) => { h += '<button class="opt" data-i="' + i + '">' + o.label + '</button>'; });
    modal(h, box => {
      box.querySelectorAll('.opt').forEach(b => {
        b.onclick = () => { BG.Run.applyUpgrade(run, p.uid, p.options[+b.dataset.i]); BG.Log.saveRun(run); closeModal(); promoteNext(); };
      });
    });
  }

  function helpHtml() {
    return '<h2>조작법 v1</h2><div class="help">' +
      '<b>선택</b> 유닛 탭 · 위쪽 칩 탭 · 빈 땅을 끌어 박스 선택 · "다중 선택"을 켜면 탭할 때마다 추가/해제<br>' +
      '<b>명령</b> 땅 탭=이동(만나는 적은 교전) · 적 탭=공격 · "돌격"/"이탈" 버튼을 누른 뒤 탭 · "정지 사수" · "방어 태세"(돌격·사격을 잘 버팀, 이동 느림) · "명령 취소"<br>' +
      '<b>우선 명령</b> 같은 곳을 두 번 빠르게 탭 — 기존 명령을 보류하고 즉시 수행, 끝나면 원래 명령 재개<br>' +
      '<b>경유 +</b> 누른 뒤 땅을 여러 번 탭해 우회 경로를 만들고, 다시 눌러 전송 (측면 기동)<br>' +
      '<b>지휘망</b> ★ = 지휘관. 총지휘관(★)의 명령은 거리만큼 늦게, 때론 소음·거리로 실패합니다. 분대장(★)을 거치면 부하에게 더 빠르고 확실합니다. 총지휘관 아래 분대가 생기면 ★★가 됩니다. 선택한 유닛이 총지휘관에게 직접 닿지 못하면 "…" 표시(전달 중)와 "✗"(실패)가 나옵니다.<br>' +
      '<b>분대</b> 2명 이상 선택 → "분대 편성". 분대 전원을 선택해 이동하면 진형(상대 위치)을 유지합니다. "분대장 임명" · "지휘관 임명"은 유닛 1명 선택 후.<br>' +
      '<b>준비 단계</b> 전투 개시 전에는 시간이 멈춰 있습니다. 유닛을 끌어 배치하고, 지휘관과 분대를 정하고, 명령을 미리 내리세요.<br>' +
      '<b>시간</b> ⏸로 멈추고 계획 → ▶ 재개. 1x/2x/4x. 실시간 중에도 명령 가능.<br>' +
      '<b>화면</b> 핀치/휠 확대 · 두 손가락/가운데·오른쪽 버튼 이동 · "맞춤".<br>' +
      '<b>규칙</b> 흰색=아군 / 검정=적 · ■방어(탱커) ●보병 ▲기동 ⬟사수. 방패는 정면 넓게 막고, 옆·뒤를 맞으면 막지 못하며 배후 피해가 커집니다. 균형이 0이 되면 넘어집니다. 포는 사선에 아군이 끼면 오사합니다.' +
      '</div><div class="row" style="margin-top:10px"><button class="btn go" id="hClose">닫기</button></div>';
  }

  // ---------- 초기화 ----------
  function bindUI() {
    $('btnStart').onclick = () => startBattle();
    $('btnHelp').onclick = () => modal(helpHtml(), () => { $('hClose').onclick = closeModal; });
    $('btnLogs').onclick = () => { $('logsBox').classList.toggle('hidden'); renderLogs(); };
    $('btnNewRun').onclick = () => modal('<h2>새 런</h2><p>현재 진행 상황이 사라집니다(저장된 전투 로그는 유지). 새 런을 시작할까요?</p><div class="row"><button class="btn danger" id="nrYes">새 런 시작</button><button class="btn" id="nrNo">취소</button></div>', () => {
      $('nrNo').onclick = closeModal;
      $('nrYes').onclick = () => { S.run = BG.Run.create(); BG.Log.saveRun(S.run); closeModal(); renderHome(); };
    });
    $('logsList').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      const list = UI._logList || [];
      if (b.dataset.j != null) { const lg = list[+b.dataset.j]; BG.Log.download(BG.Log.fileName(lg, 'json'), JSON.stringify(lg)); }
      if (b.dataset.t != null) { const lg = list[+b.dataset.t]; BG.Log.download(BG.Log.fileName(lg, 'txt'), textFromLog(lg), 'text/plain'); }
    });
    $('btnExportAll').onclick = () => BG.Log.download('battle_logs_' + BG.VERSION + '_all.json', JSON.stringify(BG.Log.listLogs()));
    $('btnExportRun').onclick = () => BG.Log.download('battle_run_' + BG.VERSION + '_' + S.run.id + '.json', JSON.stringify(S.run));

    $('btnBack').onclick = () => {
      const W = S.W;
      if (!W) return;
      if (W.phase === 'prep') { showHome(); return; }
      if (W.phase === 'end') { return; }
      S.paused = true; syncButtons();
      modal('<h2>항복</h2><p>전투 중에는 막사로 돌아갈 수 없습니다. 항복하면 이 전투는 패배로 처리되고 런이 종료됩니다.</p><div class="row"><button class="btn danger" id="sgYes">항복</button><button class="btn" id="sgNo">계속 싸운다</button></div>', () => {
        $('sgNo').onclick = closeModal;
        $('sgYes').onclick = () => {
          closeModal();
          W.phase = 'end'; W.result = { winner: 'enemy', t: U.r1(W.t), surrender: true };
          BG.Log.add(W, 'end', { winner: 'enemy' });
        };
      });
    };
    $('btnPlay').onclick = togglePlay;
    $('btnSpeed').onclick = () => { S.speed = S.speed === 1 ? 2 : (S.speed === 2 ? 4 : 1); syncButtons(); };
    $('btnAI').onclick = () => {
      const W = S.W; if (!W || W.phase === 'end') return;
      if (W.ctrl.ally) { W.ctrl.ally = null; toast('수동 지휘로 복귀'); }
      else { BG.sim.setController(W, 'ally', BG.AI.create()); toast('AI 지휘관이 아군을 지휘합니다'); }
      syncButtons();
    };
    $('btnLog').onclick = () => { $('logText').textContent = BG.Log.fullText(S.W); $('logDrawer').classList.remove('hidden'); const t = $('logText'); t.scrollTop = t.scrollHeight; };
    $('lgClose').onclick = () => $('logDrawer').classList.add('hidden');
    $('lgJson').onclick = () => S.W && BG.Log.download(BG.Log.fileName(S.W.log, 'json'), JSON.stringify(S.W.log));
    $('lgTxt').onclick = () => S.W && BG.Log.download(BG.Log.fileName(S.W.log, 'txt'), BG.Log.fullText(S.W), 'text/plain');
    $('zIn').onclick = () => setZoom(S.cam.zoom * 1.4);
    $('zOut').onclick = () => setZoom(S.cam.zoom / 1.4);
    $('zFit').onclick = () => { S.cam = { zoom: 1, cx: C.MAP_W / 2, cy: C.MAP_H / 2 }; };
    $('chips').addEventListener('pointerdown', e => {
      const c = e.target.closest('.chip');
      if (!c || !S.W) return;
      const id = +c.dataset.id;
      if (S.multi || e.shiftKey) toggleSel(id); else selectOnly(id);
      refreshHud(true);
    });

    const modes = { mNormal: 'normal', mCharge: 'charge', mRetreat: 'retreat' };
    Object.keys(modes).forEach(k => { $(k).onclick = () => { S.mode = (S.mode === modes[k] && k !== 'mNormal') ? 'normal' : modes[k]; syncButtons(); }; });
    $('bHold').onclick = () => { const us = selUnits(); if (us.length) issue(us.map(u => ({ id: u.id, order: cmd.O.hold(null) })), false); };
    $('bCancel').onclick = () => { const us = selUnits(); if (us.length) { issue(us.map(u => ({ id: u.id, order: cmd.O.clear() })), false); S.route = null; syncButtons(); } };
    $('bDefend').onclick = () => {
      const us = selUnits(); if (!us.length) return;
      const allDef = us.every(u => u.stance === 'defend');
      issue(us.map(u => ({ id: u.id, order: cmd.O.stance(allDef ? 'normal' : 'defend') })), false);
    };
    $('bRoute').onclick = () => {
      if (S.route) { sendRoute(); } else { if (!selUnits().length) { toast('먼저 유닛을 선택하세요'); return; } flushPend(); S.route = []; }
      syncButtons();
    };
    $('bMulti').onclick = () => { S.multi = !S.multi; syncButtons(); };
    $('bAll').onclick = selectAll;
    $('bSqSel').onclick = () => {
      const W = S.W, ids = new Set();
      selUnits().forEach(u => { const sq = cmd.squadOf(W, u); if (sq) sq.members.forEach(id => ids.add(id)); else ids.add(u.id); });
      S.sel = ids; S.chipSig = '';
    };
    $('bSquad').onclick = () => {
      const us = selUnits();
      if (us.length < 2) { toast('분대 편성: 2명 이상 선택하세요'); return; }
      const sq = cmd.makeSquad(S.W, 'ally', us.map(u => u.id));
      if (sq) toast('분대 ' + String.fromCharCode(64 + sq.id) + ' 편성 — 분대장 ' + S.W.units[sq.leader - 1].name);
      S.chipSig = '';
    };
    $('bUnsquad').onclick = () => {
      const W = S.W;
      selUnits().forEach(u => { const sq = cmd.squadOf(W, u); if (sq) cmd.disband(W, 'ally', sq.id); });
      S.chipSig = '';
    };
    $('bLeader').onclick = () => {
      const us = selUnits(), W = S.W;
      if (us.length !== 1) { toast('분대원 1명을 선택하세요'); return; }
      const sq = cmd.squadOf(W, us[0]);
      if (!sq) { toast('분대에 속해 있지 않습니다'); return; }
      cmd.setLeader(W, 'ally', sq.id, us[0].id); S.chipSig = '';
    };
    $('bMain').onclick = () => {
      const us = selUnits(), W = S.W;
      if (us.length !== 1) { toast('총지휘관으로 임명할 유닛 1명을 선택하세요'); return; }
      cmd.setMain(W, 'ally', us[0].id, '임명');
      if (W.phase === 'run') W.net.ally.confusionUntil = W.t + 2.0;
      S.chipSig = '';
    };
    root.addEventListener('resize', () => { S.chipSig = ''; });
  }

  UI.init = function (run) {
    cv = $('cv'); g = cv.getContext('2d');
    S.run = run;
    bindUI(); initInput(); syncButtons();
    showHome();
    S.lastFrame = performance.now();
    requestAnimationFrame(frame);
  };
  UI._toS = toS; UI._toW = toW;
  UI.showHelp = () => modal(helpHtml(), () => { $('hClose').onclick = closeModal; });
})(typeof window !== 'undefined' ? window : globalThis);
