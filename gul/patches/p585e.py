import sys
def patch(P, reps):
    s=open(P).read()
    for a,b,n in reps:
        c=s.count(a)
        if c!=1: print('ANCHOR',P,n,c); sys.exit(1)
        s=s.replace(a,b)
    open(P,'w').write(s)
patch('rt3_head.js',[
("  charge: { stun: 1.0, maxOrd: 8, shieldKb: 1.3, shieldStun: 1.25, wind: 0.35, min: 1.5, max: 5, spd: 2.2, dmg: 0.6, post: 60, push: 1.2, pin: 1.2, cd: 8,",
 "  charge: { stun: 1.0, maxOrd: 8, shieldKb: 1.3, shieldStun: 1.25, wind: 0.2, min: 1.5, max: 5, spd: 2.6, sp0: 1.2, full: 3, dmg: 0.6, post: 60, push: 1.2, pin: 1.2, cd: 4,",'charge'),
("  javelin: { wind: 0.7,", "  javelin: { wind: 0.45,",'jav'),
])
H=open('rt3_head.js').read(); i=H.index("  charge: { stun:"); j=H.index("\n",i)
H=H[:j]+"   // v5.8.5 준비 0.2초 · 대기 4초 · 도움닫기: 달리기 시작은 ×sp0, 달린 거리가 full 칸이면 전력질주 ×spd (짧으면 덜 셈)"+H[j:]
open('rt3_head.js','w').write(H)
patch('rt3_tail.js',[
("// v5.4 돌격 예고: wind 초 동안 자세를 낮추고 노려봄 (예고선) → 달림.",
 """// v5.8.5 도움닫기: 달린 거리만큼 빨라짐 — 처음 ×sp0 → full 칸을 달리면 전력질주 ×spd. 부딪히는 힘 (속력) 도 그만큼이라 짧은 돌격은 덜 셈
const chargeSp = (C, v0, run) => { const top = C.spd || 2.2, s0 = C.sp0 != null ? C.sp0 : top; return v0 * (s0 + (top - s0) * Math.min(1, run / Math.max(0.1, C.full || 3))); };
function chargeTime(C, v0, s){ let t = 0, run = 0; const ds = 0.05; while (run < s){ t += ds / Math.max(0.1, chargeSp(C, v0, run)); run += ds; } return t; }
// v5.4 돌격 예고: wind 초 동안 자세를 낮추고 노려봄 (예고선) → 달림.""",'helpers'),
("  if (aim0){ const want = Math.atan2(aim0.y - u.y, aim0.x - u.x), cur = Math.atan2(A.dy, A.dx);",
 "  if (A.v0 != null) A.sp = chargeSp(C, A.v0, A.run || 0);   // v5.8.5 도움닫기\n  if (aim0){ const want = Math.atan2(aim0.y - u.y, aim0.x - u.x), cur = Math.atan2(A.dy, A.dx);",'stepSp'),
("  tryMove(W, u, u.x + A.dx * A.sp * dt, u.y + A.dy * A.sp * dt);\n",
 "  tryMove(W, u, u.x + A.dx * A.sp * dt, u.y + A.dy * A.sp * dt);\n  A.run = (A.run || 0) + Math.hypot(u.x - x0, u.y - y0);\n",'run'),
("    L(W, { k: 'impact', a: u.i, b: hit.i, block: blocked, broke: blocked && hit.brokenT > W.t, clash: !!hc, braced: !!(br.trained || br.mates), trained: !!br.trained, vr: +vr.toFixed(1), shield: sh,",
 "    L(W, { k: 'impact', a: u.i, b: hit.i, block: blocked, broke: blocked && hit.brokenT > W.t, clash: !!hc, braced: !!(br.trained || br.mates), trained: !!br.trained, vr: +vr.toFixed(1), shield: sh, run: +(A.run || 0).toFixed(1), full: (A.run || 0) >= (C.full || 3) - 0.05,",'log'),
("    const tx = t && t.alive ? t.x : pt.x, ty = t && t.alive ? t.y : pt.y, d = Math.hypot(tx - u.x, ty - u.y) || 1, sp = spdNow(W, u) * (C.spd || 2.2);\n    u.act = { k: 'charge', phase: 'run', b: t ? t.i : null, px: pt ? pt.x : null, py: pt ? pt.y : null, t0: W.t, end: W.t + (d + (t ? 0.6 : 0.15)) / sp, dx: (tx - u.x) / d, dy: (ty - u.y) / d, sp };",
 "    const tx = t && t.alive ? t.x : pt.x, ty = t && t.alive ? t.y : pt.y, d = Math.hypot(tx - u.x, ty - u.y) || 1, v0 = spdNow(W, u), sp = chargeSp(C, v0, 0);   // v5.8.5 도움닫기 (달릴수록 빨라짐)\n    u.act = { k: 'charge', phase: 'run', b: t ? t.i : null, px: pt ? pt.x : null, py: pt ? pt.y : null, t0: W.t, end: W.t + chargeTime(C, v0, d + (t ? 0.6 : 0.15)), dx: (tx - u.x) / d, dy: (ty - u.y) / d, sp, v0, run: 0 };",'resolve'),
("  const vA = spdNow(W, u) * (C.spd || 2.2), br = braceOf(W, t, u, dx, dy);",
 "  const vA = chargeSp(C, spdNow(W, u), Math.max(0, gap(u, t))), br = braceOf(W, t, u, dx, dy);   // v5.8.5 거리만큼 붙는 속력 (멀리서 달려올수록 셈)",'value'),
])
print('ok')
