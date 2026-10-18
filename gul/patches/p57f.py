import sys
T='rt3_tail.js'; t=open(T).read()
def rep(s,a,b,n):
    c=s.count(a)
    if c!=1: print('ANCHOR',n,c); sys.exit(1)
    return s.replace(a,b)
# hysteresis: previous joints keep with looser limits
t=rep(t,"""    const adj = new Map(M.map(u => [u, []]));
    for (let a = 0; a < M.length; a++) for (let b = a + 1; b < M.length; b++){
      const P = M[a], Q = M[b], d = dist(P, Q); if (d > (LN.link || 1.6) || angDiff(P.face, Q.face) > 0.87) continue;
      const mf = Math.atan2(Math.sin(P.face) + Math.sin(Q.face), Math.cos(P.face) + Math.cos(Q.face));
      if (Math.abs(((Q.x - P.x) * Math.cos(mf) + (Q.y - P.y) * Math.sin(mf)) / (d || 1)) > 0.6) continue;   // 앞뒤로 선 것은 관절이 아님""",
"""    const adj = new Map(M.map(u => [u, []]));
    for (let a = 0; a < M.length; a++) for (let b = a + 1; b < M.length; b++){
      const P = M[a], Q = M[b], d = dist(P, Q), was = P.lineJ && (P.lineJ.left === Q.i || P.lineJ.right === Q.i), hy = was ? (LN.hold || 1.3) : 1;   // 이어져 있던 관절은 조금 더 버팀 (몸을 돌리는 사이 끊기지 않음)
      if (d > (LN.link || 1.6) * hy || angDiff(P.face, Q.face) > 0.87 * hy) continue;
      const mf = Math.atan2(Math.sin(P.face) + Math.sin(Q.face), Math.cos(P.face) + Math.cos(Q.face));
      if (Math.abs(((Q.x - P.x) * Math.cos(mf) + (Q.y - P.y) * Math.sin(mf)) / (d || 1)) > 0.6 * hy) continue;   // 앞뒤로 선 것은 관절이 아님""",'adj')
t=rep(t,"""  const LN = W.rules.line || {}, prev = W.lines || [];
  for (const u of W.units) u.line = null;""","""  const LN = W.rules.line || {}, prev = W.lines || [];
  for (const u of W.units){ u.lineJ = u.line ? { left: u.line.left, right: u.line.right } : null; u.line = null; }""",'reset')
# membership time & leave only after 1s in line
t=rep(t,"""      comp.forEach((x, k) => { x.line = { ln, k, n: comp.length, left: k > 0 ? comp[k - 1].i : null, right: k < comp.length - 1 ? comp[k + 1].i : null }; });""",
"""      comp.forEach((x, k) => { x.line = { ln, k, n: comp.length, left: k > 0 ? comp[k - 1].i : null, right: k < comp.length - 1 ? comp[k + 1].i : null }; if (!x.lineJ) x.lineT0 = W.t; });""",'mem')
t=rep(t,"""    const u = W.units[i]; if (u.line) continue;
    const fell = !u.alive || prone(W, u) || u.crawl || u.kb;""","""    const u = W.units[i]; if (u.line) continue;
    const fell = !u.alive || prone(W, u) || u.crawl || u.kb;
    if (!fell && W.t - (u.lineT0 != null ? u.lineT0 : W.t) < 1) continue;   // 잠깐 붙었다 떨어진 것은 이탈이 아님""",'leave')
open(T,'w').write(t)
h=open('rt3_head.js').read()
h=rep(h,"  line: { link: 1.6, opp: 0.6, fill: 2.6, gap: 1.05 },","  line: { link: 1.6, opp: 0.6, fill: 2.6, gap: 1.05, hold: 1.3 },",'rule')
h=rep(h,"전열 명령의 마디 간격","전열 명령의 마디 간격 · 이어져 있던 관절은 hold 배까지 버팀",'rulec')
open('rt3_head.js','w').write(h); print('ok')
