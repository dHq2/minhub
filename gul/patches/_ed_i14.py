p='run8_i.js'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)
rep('/* ===== run8_i.js v1.3 — v8.7.1','/* ===== run8_i.js v1.4 — v8.7.1 · v8.7.1.1')
rep("   v1.3: 비전투 맵","   v1.4: v8.7.1.1 맵 장치 — 봉인된 출구 (지나가기의 35%: 빛나는 문양 셋을 밟아야 열림 · 적은 자고 있음 · 다 쓰러뜨려도 열림) · 진지 설비 (진지 MS 의 큰 설비 자리에 팩션 보급 포대 — 움직이지 않는 적 · 같은 사격 규칙 · 부술 수 있음)\n   v1.3: 비전투 맵")
rep("""// 판을 만든 뒤 (r8BattleHook 끝에서): 손님 · 맵 위 NPC · 항복할 수 있는 적 · 빈 회랑""",
"""// ---------- v8.7.1.1 봉인된 출구 (A4 퍼즐) ----------
function r8Seals(W){
  const m = W.map, al = W.units.filter(u => u.side === 0 && u.alive); if (!al.length) return; const h = al.find(u => u.hero) || al[0];
  const d = new Int32Array(m.W * m.H).fill(-1), q = [[Math.floor(h.x), Math.floor(h.y)]]; d[q[0][1] * m.W + q[0][0]] = 0;
  for (let i = 0; i < q.length; i++){ const [x, y] = q[i]; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const a = x + dx, b = y + dy; if (a < 1 || b < 1 || a >= m.W - 1 || b >= m.H - 1 || d[b * m.W + a] >= 0 || m.t[b * m.W + a] !== 0) continue; d[b * m.W + a] = d[y * m.W + x] + 1; q.push([a, b]); } }
  const far = Math.max(...d); const L = q.filter(([x, y]) => d[y * m.W + x] > far * 0.25); const S0 = [];
  for (let k = 0; k < 200 && S0.length < 3; k++){ const c = L[Math.floor(Math.random() * L.length)]; if (!c) break; if (S0.some(o => Math.hypot(o.x - c[0], o.y - c[1]) < 7)) continue; if (W.stairs && Math.hypot(W.stairs.x - c[0], W.stairs.y - c[1]) < 4) continue; S0.push({ x: c[0] + 0.5, y: c[1] + 0.5, on: false }); }
  if (S0.length < 3) return; W.r8.seals = S0; W.exitLock = true;
  logEv(W, { k: 'r8', s: '🔮 출구가 봉인되어 있다 — 바닥의 빛나는 문양 셋을 밟으면 열린다 (적은 아직 자고 있다)', c: 'dim', vis: true });
}
function r8SealTick(W){
  const L = W.r8 && W.r8.seals; if (!L || W.r8.sealOpen) return; if (W.cleared){ W.r8.sealOpen = 1; return; }
  for (const s of L){ if (s.on) continue; const near = W.units.some(u => u.side === 0 && u.alive && Math.hypot(u.x - s.x, u.y - s.y) <= 0.8); if (!near){ s.since = null; continue; } if (s.since == null) s.since = W.t; if (W.t - s.since >= 0.8){ s.on = true; logEv(W, { k: 'r8', s: `문양 하나가 켜졌다 (${L.filter(o => o.on).length}/${L.length})`, c: 'good', vis: true }); } }
  if (L.every(o => o.on)){ W.r8.sealOpen = 1; W.exitLock = false; logEv(W, { k: 'r8', s: '🔓 봉인이 풀렸다 — 출구가 열렸다', c: 'good', vis: true }); try { campBarRender(true); } catch (e) {} }
}
function r8DrawI(Wd, ox, oy, ts){
  const L = Wd.r8 && Wd.r8.seals; if (!L) return; const t = performance.now() / 500;
  for (const s of L){ const x = ox + s.x * ts, y = oy + s.y * ts, r = ts * 0.55; ctx.save(); ctx.lineWidth = Math.max(1.5, ts * 0.07);
    ctx.strokeStyle = s.on ? 'rgba(250,210,120,.95)' : `rgba(170,130,255,${0.45 + 0.3 * Math.sin(t + s.x)})`; ctx.fillStyle = s.on ? 'rgba(250,210,120,.25)' : 'rgba(150,110,255,.12)';
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.beginPath(); for (let i = 0; i < 6; i++){ const a = i * 1.047 + (s.on ? 0 : t * 0.3); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); } ctx.stroke(); ctx.restore(); }
}
// ---------- v8.7.1.1 진지 설비 (A7): 팩션마다 보급한 포대 — 움직이지 않는 적 (같은 사격 규칙 · 부술 수 있음) ----------
const TURRET8 = { iron: ['철벽 포대', '소총', '판금'], urban: ['기관포 진지', '소총', '판금'], mech: ['기계 포탑', '소총', '판금'], arc: ['아크 방어탑', '마법', null], odd: ['기묘한 방어 장치', '마법', null], grim: ['생체 포탑', '총', '가죽'], camp: ['쇠뇌 노포', '활', null] };
function r8Turrets(W){
  const R = R8S(), F = F8[R.f] || {}, T = THEME8[F.theme] || {}, D = TURRET8[T.fort]; const M = MAPS8[S.art8]; if (!D || !M) return 0;
  const m = W.map, inn = M.in || [0, 0, 1, 1], cx = (inn[0] + inn[2]) / 2, cy = (inn[1] + inn[3]) / 2; let n = 0;
  for (const p of (M.props || []).filter(q => q.big).slice(0, 2)){
    let best = null; for (let y = p.y - 1; y <= p.y + p.h; y++) for (let x = p.x - 1; x <= p.x + p.w; x++){ if (x < 1 || y < 1 || x >= m.W - 1 || y >= m.H - 1 || m.t[y * m.W + x] !== 0) continue; if (W.units.some(u => u.alive && Math.hypot(u.x - x - 0.5, u.y - y - 0.5) < 0.9)) continue; const dd = Math.hypot(x - cx, y - cy); if (!best || dd > best.d) best = { x, y, d: dd }; }
    if (!best) continue;
    const d = { key: D[0], name: D[0], side: 1, tier: 3, cls: '원거리', role: '사수', weapon: D[1], ammo: 999, height: 1.5, weight: 900, sizeCls: '대형', nv: true, nvG: 'A', ov: { hp: 150 + R.f * 8, atk: 24 + R.f, spd: 0.04 }, traits: ['갑피'], tactic: '진지 설비 — 움직이지 않음', note: `${T.name || ''} 팩션이 보급한 설비`, turret8: true, ...(D[2] ? { gear: { 몸: { name: D[0] + ' 장갑', mat: D[2], tier: 3 } } } : {}) };
    const u0 = { ...fromDesign(d, 1), id: uid(), x: best.x + 0.5, y: best.y + 0.5 }; try { lockIdentity(u0); } catch (e) {} S.units.push(u0); const u = addUnit(W, u0); u.turret8 = true; n++; }
  if (n) logEv(W, { k: 'r8', s: `⚙ 적 진지에 설비 ${n} — ${D[0]} (움직이지 않음 · 부술 수 있음)`, c: 'dim', vis: true });
  return n;
}
// 판을 만든 뒤 (r8BattleHook 끝에서): 손님 · 맵 위 NPC · 항복할 수 있는 적 · 빈 회랑""")
rep("""  if (n.empty){ W.exitLock = false; W.r8.pass = true; logEv(W, { k: 'r8', s: '…아무도 없다. 발소리만 울린다.', c: 'dim', vis: true }); }
}""","""  if (n.empty){ W.exitLock = false; W.r8.pass = true; logEv(W, { k: 'r8', s: '…아무도 없다. 발소리만 울린다.', c: 'dim', vis: true }); }
  if (n.ms === 'pass' && !n.empty && !n.champ && ((n.seed || 7) % 100) < 35) r8Seals(W);   // v8.7.1.1 봉인된 출구
  if (n.ms === 'fort' && n.t === 'fight') r8Turrets(W);   // v8.7.1.1 진지 설비
}""")
rep("""function r8NpcTick(W){
  r8FollowTick(W);""","""function r8NpcTick(W){
  r8FollowTick(W); r8SealTick(W);""")
open(p,'w',encoding='utf-8').write(s)
print('ok')
