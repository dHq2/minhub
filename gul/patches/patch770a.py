import re
def load(p): return open(p).read()
def rep(s,a,b,n=1):
    c=s.count(a); assert c==n,(a[:70],c); return s.replace(a,b)
# head
p='rt3_head.js'; s=load(p)
s=rep(s,"""const LIT = 0.12;     // 빛이 이보다 밝으면 '밝은 칸'""","""const LIT = 0.12;     // 빛이 이보다 밝으면 '밝은 칸'
const DIM = 0.004;    // v7.7 빛 가장자리 너머 (실루엣 띠): 이보다 밝고 LIT 이하면 '어스름' — 야시 없이도 실루엣은 보임""")
s=rep(s,"""  darkHit: { A: 0.95, B: 0.9, C: 0.85, smell: 0.8, melee: 0.96 },""","""  darkHit: { A: 0.95, B: 0.9, C: 0.85, smell: 0.8, melee: 0.96, dim: 0.75 },""")
s=rep(s,"""small: 1.1, heavy: 0.65, giant: 0.1, back: 1 },""","""small: 1.1, heavy: 0.65, giant: 0.1, back: 1, dim: 0.6 },""")
s=rep(s,"""  heroLight: 5,       // 주인공이 든 횃불 빛 반경""","""  heroLight: 5,       // 주인공이 든 횃불 빛 반경
  dimR: 1.6,          // v7.7 횃불 빛 반경 × dimR 까지 어스름 (실루엣 띠): 야시가 없어도 실루엣으로 보임 · 누구인지는 모름 · 맞히기 어려움 (darkHit.dim) · 숨기 덜 좋음 (stealth.dim)""")
open(p,'w').write(s)
# mid
p='rt3_mid.js'; s=load(p)
s=rep(s,"""    const r = s.r * (1 + 0.035 * Math.sin(W.t * 11 + s.f * 2.1) + 0.02 * Math.sin(W.t * 23 + s.f));
    const x0 = Math.max(0, Math.floor(s.x - r)), x1 = Math.min(m.W - 1, Math.ceil(s.x + r)), y0 = Math.max(0, Math.floor(s.y - r)), y1 = Math.min(m.H - 1, Math.ceil(s.y + r));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++){
      const cx = x + 0.5, cy = y + 0.5, d = Math.hypot(cx - s.x, cy - s.y); if (d > r) continue;""","""    const r = s.r * (1 + 0.035 * Math.sin(W.t * 11 + s.f * 2.1) + 0.02 * Math.sin(W.t * 23 + s.f)), r2 = r * Math.max(1, W.rules.dimR || 1);   // v7.7 어스름 띠
    const x0 = Math.max(0, Math.floor(s.x - r2)), x1 = Math.min(m.W - 1, Math.ceil(s.x + r2)), y0 = Math.max(0, Math.floor(s.y - r2)), y1 = Math.min(m.H - 1, Math.ceil(s.y + r2));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++){
      const cx = x + 0.5, cy = y + 0.5, d = Math.hypot(cx - s.x, cy - s.y); if (d > r2) continue;""")
s=rep(s,"""      const v = Math.pow(1 - d / r, 0.75);""","""      const v = d <= r ? Math.pow(1 - d / r, 0.75) : DIM + (LIT * 0.9 - DIM) * (1 - (d - r) / Math.max(0.01, r2 - r));   // v7.7 빛 밖 = 어스름 (LIT 아래)""")
s=rep(s,"""  if (!litAt(W, t.x, t.y)){ if (!u.nv) return false;""","""  if (!glowAt(W, t.x, t.y)){ if (!u.nv) return false;""")
open(p,'w').write(s)
p='rt3_mid.js'; s=load(p)
s=rep(s,"""const litAt = (W, x, y) => W.light[(y | 0) * W.map.W + (x | 0)] > LIT;""","""const litAt = (W, x, y) => W.light[(y | 0) * W.map.W + (x | 0)] > LIT;
const glowAt = (W, x, y) => W.light[(y | 0) * W.map.W + (x | 0)] > DIM;   // v7.7 빛 또는 어스름 (실루엣이라도 보임)""")
open(p,'w').write(s)
# tail
p='rt3_tail.js'; s=load(p)
s=rep(s,"""  const S = STL(W), base = litAt(W, t.x, t.y) ? (S.lit || 0.75) : (S.dark || 0.45); return 1 - t.stealthE * (1 - base);""","""  const S = STL(W), base = litAt(W, t.x, t.y) ? (S.lit || 0.75) : glowAt(W, t.x, t.y) ? (S.dim || 0.6) : (S.dark || 0.45); return 1 - t.stealthE * (1 - base);   // v7.7 어스름""")
s=rep(s,"""const blindTo = (W, u, t) => !u.nv && !(u.smell && dist(u, t) <= u.smell) && !litAt(W, t.x, t.y);""","""const blindTo = (W, u, t) => !u.nv && !(u.smell && dist(u, t) <= u.smell) && !glowAt(W, t.x, t.y);   // v7.7 어스름이면 실루엣은 보임""")
s=rep(s,"""p *= u.nv ? (R.darkHit[u.nvG || 'A'] || 0.9) : (R.darkHit.smell || 0.8);   // v7.5""","""p *= u.nv ? (R.darkHit[u.nvG || 'A'] || 0.9) : glowAt(W, t.x, t.y) ? (R.darkHit.dim || 0.75) : (R.darkHit.smell || 0.8);   // v7.7 실루엣만 보고 쏨   // v7.5""")
s=rep(s,"""  if (!litAt(W, x, y)) return true;
  const back = (180 - W.rules.frontArc)""","""  if (!glowAt(W, x, y)) return true;   // v7.7 어스름은 실루엣으로 보임
  const back = (180 - W.rules.frontArc)""")
s=rep(s,"""      if (u.side === 1 && !litAt(W, x, y)) s += u.stalk ? 3 : 1.2;""","""      if (u.side === 1 && !glowAt(W, x, y)) s += u.stalk ? 3 : 1.2;""")
s=rep(s,"""    if (u.side === 1 && !litAt(W, x, y)) sc += 0.6;""","""    if (u.side === 1 && !glowAt(W, x, y)) sc += 0.6;""")
s=rep(s,"""    if (W.t < (u.asNext || 0) || litAt(W, u.x, u.y)) return false;""","""    if (W.t < (u.asNext || 0) || glowAt(W, u.x, u.y)) return false;""")
s=rep(s,"""u.assnE >= (A6.ai || 0.4) && !litAt(W, u.x, u.y) && !u.seenBy;""","""u.assnE >= (A6.ai || 0.4) && !glowAt(W, u.x, u.y) && !u.seenBy;""")
s=rep(s,"""  if (!u.smellG && !litAt(W, u.x, u.y) && W.t >= S.nextLost){""","""  if (!u.smellG && !glowAt(W, u.x, u.y) && W.t >= S.nextLost){""")
# 실루엣: 야시 · 후각 없는 아군만 (어스름으로) 본 적
s=rep(s,"""    e.seenBy = s;
""","""    e.seenBy = s;
    e.sil = s && !litAt(W, e.x, e.y) && !W.units.some(a => a.alive && a.side === 0 && !a.posUnk && (a.nv || (a.smell && dist(a, e) <= a.smell) || gap(a, e) < 0.4) && canSee(W, a, e));   // v7.7 어스름 속 실루엣만 (누구인지 모름)
""")
s=rep(s,"""module.exports = { litAt,""","""module.exports = { glowAt, litAt,""")
open(p,'w').write(s)
