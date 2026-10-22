# ---------- J. 길 비켜 주기 (I21): 같은 편 둘이 겹칠 때 — 마주 오면 둘 다 제 오른쪽으로 (오른쪽 통행) · 하나만 가는 중이면 서 있는 쪽이 가는 쪽 길 옆으로 비켜섬 (앞으로 떠밀려 비비지 않음) ----------
rep("    if (pw) tryMove(W, P, P.x - ux * push * pw, P.y - uy * push * pw);\n    if (qw) tryMove(W, Q, Q.x + ux * push * qw, Q.y + uy * push * qw);\n    P.moved = pm; Q.moved = qm;",
    "    if (pw) tryMove(W, P, P.x - ux * push * pw, P.y - uy * push * pw);\n    if (qw) tryMove(W, Q, Q.x + ux * push * qw, Q.y + uy * push * qw);\n"
    "    if (P.side === Q.side && !P.act && !Q.act && !P.kb && !Q.kb) giveWay(W, P, Q, need - d);   /* v8.7.4 길 비켜 주기 (I21) */\n"
    "    P.moved = pm; Q.moved = qm;")
rep("/* ---------- 방향: 앞 · 측면 · 뒤 ---------- */",
    "// v8.7.4 길 비켜 주기 (I21): 가는 쪽 (다음 길목) · 마주 오면 둘 다 제 오른쪽으로 · 하나만 가는 중이면 서 있는 쪽이 그 길 옆으로 (교전 중 · 붙잡힘 · 엎드림은 그대로)\n"
    "const hdOf = u => u.path && u.path[0] && Math.hypot(u.path[0].x - u.x, u.path[0].y - u.y) > 0.05 ? Math.atan2(u.path[0].y - u.y, u.path[0].x - u.x) : null;\n"
    "function giveWay(W, P, Q, ov){\n"
    "  if (P.lie || Q.lie || P.heldBy != null || Q.heldBy != null || P.line || Q.line) return;\n"
    "  const hP = hdOf(P), hQ = hdOf(Q), k = Math.min(0.06, ov * 0.6);\n"
    "  if (hP != null && hQ != null){ if (Math.cos(hP - hQ) < -0.5){ tryMove(W, P, P.x + Math.cos(hP - Math.PI / 2) * k, P.y + Math.sin(hP - Math.PI / 2) * k); tryMove(W, Q, Q.x + Math.cos(hQ - Math.PI / 2) * k, Q.y + Math.sin(hQ - Math.PI / 2) * k); } return; }   // 마주 옴 — 오른쪽 통행\n"
    "  if (hP == null && hQ == null) return;\n"
    "  const M = hP != null ? P : Q, S = M === P ? Q : P, h = M === P ? hP : hQ; if (S.order && S.order.k === 'hold') return;   // 제자리 명령은 그대로\n"
    "  const cr = Math.cos(h) * (S.y - M.y) - Math.sin(h) * (S.x - M.x), sg = cr >= 0 ? 1 : -1, kk = k * 1.5;\n"
    "  tryMove(W, S, S.x + Math.cos(h + sg * Math.PI / 2) * kk, S.y + Math.sin(h + sg * Math.PI / 2) * kk);   // 서 있는 쪽이 길 옆으로\n"
    "}\n"
    "/* ---------- 방향: 앞 · 측면 · 뒤 ---------- */")
