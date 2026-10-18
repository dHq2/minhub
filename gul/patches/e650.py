def rep(p,a,b,n=1):
    s=open(p,encoding='utf-8').read(); c=s.count(a)
    assert c==n,(p,a[:70],c); s=s.replace(a,b); open(p,'w',encoding='utf-8').write(s)
T='rt3_tail.js'
# fire 시각
rep(T,"function fire(W, u){\n  u.shots++;","function fire(W, u){\n  u.shots++; u.lastFireT = W.t; u.inRangeT = 0;   // v6.5 마지막으로 쏜 때")
# ---- 예측 추격 (카이팅 파훼) ----
rep(T,"function melee(W, u, t, dt, ordered){","""// v6.5 따라잡을 자리: 달아나는 상대는 지금 자리가 아니라 닿을 때의 자리로 (최대 2초 앞) — 사수가 빠지며 쏘는 걸 쫓아다니기만 하지 않음
const leadPt = (W, u, t) => { const sp = Math.hypot(t.vx || 0, t.vy || 0); if (u.side !== 1 || sp < 0.8 || AI6.includes('lead')) return t; const k = Math.min(2, dist(u, t) / Math.max(0.5, spdNow(W, u)));
  const x = Math.max(0.6, Math.min(W.map.W - 0.6, t.x + (t.vx || 0) * k)), y = Math.max(0.6, Math.min(W.map.H - 0.6, t.y + (t.vy || 0) * k)); return rock(W.map, x, y) ? t : { x, y }; };
function melee(W, u, t, dt, ordered){""")
rep(T,"        if (g > want + 0.8){ setMood(W, u, '다가감', t.i); goTo(W, u, t.x, t.y, dt); return; }","        if (g > want + 0.8){ setMood(W, u, '다가감', t.i); const lp = leadPt(W, u, t); goTo(W, u, lp.x, lp.y, dt); return; }")
rep(T,"    goTo(W, u, ap ? ap.x : t.x, ap ? ap.y : t.y, dt); return;\n  }","    const lp = leadPt(W, u, t); goTo(W, u, ap ? ap.x : lp.x, ap ? ap.y : lp.y, dt); return;\n  }")
# ---- 표적 유지 ----
rep(T,"  if (cur === best || (cur && cur.alive && !cur.down && cand.includes(cur) && !(weakScore(W, best) > weakScore(W, cur) * 1.4))) return;","  if (cur === best || (cur && cur.alive && !cur.down && cand.includes(cur) && !(weakScore(W, best) > weakScore(W, cur) * 1.6 && (W.t - W.focus.t0 >= 4 || pHp(W, 1, best) < 0.25)))) return;   // v6.5 표적은 4초는 지킴 (끝낼 수 있는 놈이면 예외) · 1.6배는 나아야 바꿈")
rep(T,"  const cand = known.filter(f => f.alive && !f.down && iKnow(W, 1, f)); if (!cand.length) return;   // v6.3 본 적 있는 상대만","  const cand = known.filter(f => f.alive && !f.down && iKnow(W, 1, f)); if (!cand.length) return;   // v6.3 본 적 있는 상대만\n  if (W.hunt && W.units[W.hunt.g].alive) return;   // v6.5 사수 몰이 중엔 그 사수")
# ---- 정보 갱신: 치료 · 일어남 · 오래 못 봄 ----
rep(T,"    else if (l.k === 'skill' && a && sees(1 - a.side, a)){","    else if (l.k === 'skill' && b && l.amt && sees(1 - b.side, b) && !AI6.includes('stale')){ const r = iRec(W, 1 - b.side, b); r.dmg = Math.max(0, r.dmg - l.amt); if (sees(1 - a.side, a)){ r.heals; } const r2 = iRec(W, 1 - a.side, a); r2.heals++; iTag(W, 1 - a.side, a, '구급', `${b.name}에게 약을 씀`); }   // v6.5 치료를 보면 짐작한 피해에서 뺌\n    else if (l.k === 'skill' && a && sees(1 - a.side, a)){")
rep(T,"    else if (l.k === 'rise' && a && sees(1 - a.side, a))","    else if (l.k === 'rise' && a && sees(1 - a.side, a) && !AI6.includes('stale') && (iRec(W, 1 - a.side, a).dmg = iRec(W, 1 - a.side, a).guess * 0.6, false)) ;\n    else if (l.k === 'rise' && a && sees(1 - a.side, a))")
rep(T,"if (!f.alive && f.down && r.seenT != null) return 0.02; return Math.max(0.03, Math.min(1, 1 - r.dmg / Math.max(1, r.guess))); }","if (!f.alive && f.down && r.seenT != null) return 0.02; const est = 1 - r.dmg / Math.max(1, r.guess), age = r.last && !AI6.includes('stale') ? W.t - r.last.t : 0; return Math.max(0.03, Math.min(1, est + (age > 6 ? (age - 6) * 0.03 : 0))); }   // v6.5 6초 넘게 못 본 상대는 그사이 회복했을 수 있음 (짐작이 흐려짐)")
