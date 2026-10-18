# v7.10.2: 야시만 v7.9.5 설정으로 되돌림 (3단계 시야 · 밤 시력 등급 · 기척 · 불꽃 18칸 제거). 횃불 로그 · 🕊 · 전파 파동 · 부대장은 그대로
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:110]); sys.exit(1)
    return s.replace(a,b)
def cut(s,a,b,new):
    i=s.index(a); j=s.index(b,i); return s[:i]+new+s[j+len(b):]
P=open(D+'rt3_head_pre7100.js').read()
# ---- head
h=open(D+'rt3_head.js').read()
i=h.index("  night: { C: [12, 9, 4]"); j=h.index("\n",i); h=h[:i]+h[j+1:]
h=rep(h,"  darkHit: { form: 0.8, A: 0.95,","  darkHit: { A: 0.95,")
h=rep(h,"   v7.10.1: 등급 배정 확정","   v7.10.2: 야시만 v7.9.5 설정으로 되돌림 — 기척 · 형체 · 식별 3단계, 밤 시력 등급 (C · B · A · S), 기척 감지, 불꽃 18칸, 식별 못 하면 회피 ↓ 는 모두 없앰. 야시 A · B · C (nvB 5 · nvC 2.5 · glare) 그대로. 횃불 로그 · 🕊 · 전파 파동 · 부대장은 유지.\n   (아래 v7.10.0 · v7.10.1 의 야간 시야 글은 되돌린 기록)\n   v7.10.1: 등급 배정 확정")
open(D+'rt3_head.js','w').write(h)
# ---- mid
m=open(D+'rt3_mid.js').read()
m=rep(m,"""  const d = Math.hypot(u.x - t.x, u.y - t.y), NG = (W.rules.night || {})[u.vg || 'C'];
  if (d > Math.max(W.rules.sight, NG ? NG[1] * 1.6 : 0)) return false;   // v7.10 어둠 속 형체는 sight 보다 멀리도 (등급 · 대상 보정은 아래)
  if (d > W.rules.sight && glowAt(W, t.x, t.y)) return false;   // 빛 안 · 어스름은 sight 까지
""","""  const d = Math.hypot(u.x - t.x, u.y - t.y);
  if (d > W.rules.sight) return false;
""")
m=rep(m,"  if (!glowAt(W, t.x, t.y)){ if (d > nightR(W, u, t).form * sk) return false; }   // v7.10 어둠 속 형체 (등급 · 대상 크기 · 움직임 · 눈부심 · 은신)","  if (!glowAt(W, t.x, t.y)){ if (!u.nv) return false; if (glareAt(W, u) && d > glareReach(W, u) * sk) return false; if (u.nvG === 'B' && d > (W.rules.nvB || 5) * sk) return false; if (u.nvG === 'C' && d > (W.rules.nvC || 2.5) * sk) return false; }   // 야시 B 는 어둠 속에선 nvB 칸까지   // v7.8 화광 실명: 밝은 빛 속에 선 눈은 빛 · 어스름 밖 어둠을 glareReach 까지만")
m=rep(m,"if (u.sightMul != null && u.sightMul < 1 && glowAt(W, t.x, t.y) && d > W.rules.sight * u.sightMul) return false;","if (u.sightMul != null && u.sightMul < 1 && d > W.rules.sight * u.sightMul) return false;")
open(D+'rt3_mid.js','w').write(m)
# ---- tail
t=open(D+'rt3_tail.js').read()
t=rep(t,"nv: true, vg: vgOf(p), nvG: vgNv(vgOf(p)),","nv: !!p.nv, nvG: p.nv ? (p.nvG === 'A' ? 'A' : p.nvG === 'C' ? 'C' : 'B') : '',")
t=cut(t,"const VG_REF = {","const glareReach0 = (W, u) => {","const glareReach = (W, u) => {")
t=cut(t,"const nvReach = (W, u) => { const N","const nvReach0 = (W, u) => { if (!u.nv) return 0;","const nvReach = (W, u) => { if (!u.nv) return 0;")
t=rep(t,"const clearSee = (W, a, e) => canSee(W, a, e) && identOK(W, a, e);   // v7.10 또렷이 = 식별","const clearSee = (W, a, e) => canSee(W, a, e) && (litAt(W, e.x, e.y) || dist(a, e) <= nvReach(W, a) || (a.smell && dist(a, e) <= a.smell) || gap(a, e) < 0.4);   // v7.7 실루엣이 아니라 또렷이 (빛 · 야시 거리 · 후각 · 몸이 닿음)")
t=rep(t,"const blindTo = (W, u, t) => !glowAt(W, t.x, t.y) && !(u.smell && dist(u, t) <= u.smell) && dist(u, t) > nightR(W, u, t).form + 0.01;   // v7.10 형체도 안 잡힘","const blindTo = (W, u, t) => !u.nv && !(u.smell && dist(u, t) <= u.smell) && !glowAt(W, t.x, t.y);   // v7.7 어스름이면 실루엣은 보임")
t=rep(t,"p *= identOK(W, u, t) ? (R.darkHit[u.nvG || 'A'] || 0.9) : glowAt(W, t.x, t.y) ? (R.darkHit.dim || 0.75) : (R.darkHit.form || R.darkHit.smell || 0.8);","p *= u.nv && dist(u, t) <= nvReach(W, u) ? (R.darkHit[u.nvG || 'A'] || 0.9) : glowAt(W, t.x, t.y) ? (R.darkHit.dim || 0.75) : (R.darkHit.smell || 0.8);")
t=rep(t,"""for (const a of al){ const d = Math.hypot(a.x - x, a.y - y); if (d > Math.max(W.rules.sight + 3, 17)) continue;
      if (W.light[i] > LIT && d <= W.rules.sight + 3){ W.explored[i] = 2; break; }
      const N = W.rules.night || {}, g = N[a.vg || 'C'] || N.C || [12, 9, 4];
      if (d <= g[1] * (glareAt(W, a) ? N.glare || 0.6 : 1)){ W.explored[i] = Math.max(W.explored[i], 1); } }   // v7.10 어둠 속에서는 등급 형체 거리까지 희미하게""","""for (const a of al){ const d = Math.hypot(a.x - x, a.y - y); if (d > W.rules.sight + 3) continue;
      if (W.light[i] > LIT){ W.explored[i] = 2; break; }
      if (a.nv && d <= (a.nvG === 'C' ? W.rules.nvC || 2.5 : a.nvG === 'B' ? W.rules.nvB || 5 : W.rules.sight)){ W.explored[i] = Math.max(W.explored[i], 1); } }""")
t=rep(t," if (Math.hypot(u.vx, u.vy) > 0.5) u.moveT = W.t;   // v7.10 마지막으로 움직인 때 (가만히 있으면 덜 보임)","")
t=rep(t,"\n  if (!mate && !identOK(W, u, atk)){ p *= (W.rules.night || {}).idDodge != null ? W.rules.night.idDodge : 0.35; atk.act.noId = true; }   // v7.10 형체만 보이고 동작은 안 보임","")
t=rep(t,"dist(u, c) <= ((R.night || {}).flame || R.sight * 1.6) && !canSee(W, u, c)","dist(u, c) <= R.sight * 1.6 && !canSee(W, u, c)")
t=rep(t,"{ const fe = 0.5 + dist(u, c) * 0.04; u.sense[c.i] = { x: c.x + (W.rand() - 0.5) * 2 * fe, y: c.y + (W.rand() - 0.5) * 2 * fe, t: W.t, exact: false, light: true }; }","u.sense[c.i] = { x: c.x + (W.rand() - 0.5), y: c.y + (W.rand() - 0.5), t: W.t, exact: false, light: true };")
t=rep(t,"  presenceTick(W, u, foes);   // v7.10 기척 (불꽃 · 눈으로 본 것이 더 정확해 그 뒤에)\n","")
t=cut(t,"// v7.10 기척: 보이진 않지만","function alertNear(W, e, target){","function alertNear(W, e, target){")
t=rep(t," u.sm0 = u.sightMul;","")
t=rep(t,"cmdWave, identOK, nightR, presenceTick, vgOf, netTick,","cmdWave, netTick,")
open(D+'rt3_tail.js','w').write(t)
print('engine ok')
