# ---------- I. 모닝스타 (C2 · 민수 메모 1018: '중거리를 유지하는 인원 — 적을 보자마자 닥돌 아님'): 철퇴를 든 이는 붙은 상대가 치려고 준비 · 거두는 동안 (교전 구속이 없음) 철퇴 거리로 물러섬 ----------
# 손이 빈 상대가 손 닿는 곳이면 그대로 침 (걸어서 빠지면 틈에 맞음 — 사수의 맞붙음과 같은 규칙) · 궁지 · 명령이면 그대로 · 양쪽 같음 (철퇴를 든 누구나)
rep("  if (!ordered && avoidGiant(W, u, t, dt)) return;   // v5.3 거구 앞에 서지 않음",
    "  if (!ordered && flailKeep(W, u, t, dt)) return;   /* v8.7.4 철퇴: 중거리를 지킴 (C2) */\n"
    "  if (!ordered && avoidGiant(W, u, t, dt)) return;   // v5.3 거구 앞에 서지 않음")
rep("// 개 (포위 사냥): 앞의 개가 짖으며 붙잡아 두고,",
    "// v8.7.4 철퇴 (모닝스타 — 중거리를 지키는 인원): 붙은 상대 (close 칸 안) 가 무언가 하는 동안 (치려고 준비 · 거둠 · 다른 이를 침 — 교전 구속이 없음) 은 mid 칸으로 물러섬\n"
    "// 손이 빈 상대가 손 닿는 곳에 있으면 걸어서 빠지지 않고 그대로 침 (틈에 맞음) · 궁지면 그대로\n"
    "function flailKeep(W, u, t, dt){\n"
    "  const FL = flailOf(W, u); if (!FL || isFar(t) || !t.alive || t.down || cornered(W, u)) return false;\n"
    "  const g = gap(u, t); if (g >= (FL.close || 0.9)) return false;\n"
    "  if (!t.act && kiteEng(W, u)) return false;   // 손이 빈 상대 — 그대로 침\n"
    "  const p = fallbackPt(W, u, t, (FL.mid || 1.6) - g + 0.3); if (!p) return false;\n"
    "  setMood(W, u, '중거리 — 물러섬', t.i); goTo(W, u, p.x, p.y, dt); return true;\n"
    "}\n"
    "// 개 (포위 사냥): 앞의 개가 짖으며 붙잡아 두고,")
rep("flail:{sw:1.3, close:0.9, swingP:0.25,", "flail:{sw:1.3, close:0.9, mid:1.6, swingP:0.25,")
