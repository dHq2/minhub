# v7.10.0 A: 야간 시야 3단계 (기척 · 형체 · 식별) — 달 없는 맑은 밤, 어둠에 적응한 눈 기준
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rep(s,a,b,c=1):
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    return s.replace(a,b)
h=open(D+'rt3_head.js').read()
h=rep(h,"   v7.9.5: 사용자 검수","""   v7.10.0: 야간 시야 개편 — 달 없는 맑은 밤, 모두 어둠에 적응한 눈 (1칸 ≈ 1 m). 시야는 세 단계: 기척 (소리 · 냄새 · 희미한 움직임, 대략 방향 · 자리만) → 형체 (사람 · 거구 · 대략 자리 = 보임) → 식별 (무기 · 방향 · 공격 동작 = 회피 · 막기 · 정확한 사격).
           등급 [기척, 형체, 식별] (칸): 일반인 C 12·9·4 · 정규군 B 16·11·6 · 감각 특화 A 20·14·7 · 개조체 S 20·16·9. 기척 거리는 청각 · 후각을 포함해 시각 거리가 아님 (후각은 정확한 좌표를 주지 않음 — 오차가 따름).
           대상 보정: 거구 ×1.25 · 작은 몸 ×0.85 · 움직이는 중 ×1.25 · 가만히 (1.5초 넘게) ×0.8 · 은신 · 전장 소음이 기척을 줄임. 빛 밖 어둠: 위 거리. 빛 안 (횃불 · 모닥불): 식별 9칸 (불이 식별을 도움).
           횃불은 비대칭: 든 이는 눈이 부셔 빛 밖 어둠의 형체 · 식별이 ×0.6 로 줄고, 불꽃은 18칸 밖에서도 (바위가 가리지 않으면) 보여 든 이의 대략 자리가 드러남. 양쪽 모두 같은 규칙.
   v7.9.5: 사용자 검수""")
h=rep(h,"  darkHit: { A: 0.95,","  night: { C: [12, 9, 4], B: [16, 11, 6], A: [20, 14, 7], S: [20, 16, 9], big: 1.25, small: 0.85, move: 1.25, still: 0.8, hold: 1.5, glare: 0.6, flame: 18, litIdent: 9, dimIdent: 1.3, senseErr: 0.2, idDodge: 0.35, idBlock: 0.6 },   // v7.10 달 없는 맑은 밤 [기척, 형체, 식별] · 대상 보정 · 눈부심 · 불꽃이 보이는 거리 · 빛 안 식별 거리 · 기척의 어림 오차 · 식별 못 하면 피하기 · 막기 ×\n  darkHit: { form: 0.8, A: 0.95,")
open(D+'rt3_head.js','w').write(h)

m=open(D+'rt3_mid.js').read()
m=rep(m,"""  const d = Math.hypot(u.x - t.x, u.y - t.y);
  if (d > W.rules.sight) return false;
  if (u.smell && d <= u.smell) return true;""","""  const d = Math.hypot(u.x - t.x, u.y - t.y), NG = (W.rules.night || {})[u.vg || 'C'];
  if (d > Math.max(W.rules.sight, NG ? NG[1] * 1.6 : 0)) return false;   // v7.10 어둠 속 형체는 sight 보다 멀리도 (등급 · 대상 보정은 아래)
  if (d > W.rules.sight && glowAt(W, t.x, t.y)) return false;   // 빛 안 · 어스름은 sight 까지
  if (u.smell && d <= u.smell) return true;""")
m=rep(m,"""  if (!glowAt(W, t.x, t.y)){ if (!u.nv) return false; if (glareAt(W, u) && d > glareReach(W, u) * sk) return false; if (u.nvG === 'B' && d > (W.rules.nvB || 5) * sk) return false; if (u.nvG === 'C' && d > (W.rules.nvC || 2.5) * sk) return false; }""","""  if (!glowAt(W, t.x, t.y)){ if (d > nightR(W, u, t).form * sk) return false; }   // v7.10 어둠 속 형체 (등급 · 대상 크기 · 움직임 · 눈부심 · 은신)""")
open(D+'rt3_mid.js','w').write(m)

t=open(D+'rt3_tail.js').read()
# 유닛 생성
t=rep(t,"nv: !!p.nv, nvG: p.nv ? (p.nvG === 'A' ? 'A' : p.nvG === 'C' ? 'C' : 'B') : '',","nv: true, vg: vgOf(p), nvG: vgNv(vgOf(p)),")   # v7.10 모두 어둠에 적응 · 시력 등급
# 시야 함수
t=rep(t,"""const glareReach = (W, u) => {""","""function vgOf(p){ return p.vg && 'CBAS'.includes(p.vg) ? p.vg : !p.nv ? 'C' : p.nvG === 'A' ? 'A' : p.nvG === 'C' ? 'C' : 'B'; }   // v7.10 시력 등급 (옛 야시 등급에서 어림)
const vgNv = g => g === 'S' ? 'A' : g || 'C';   // 옛 nvG 로 (명중 표 · 신호 표가 읽음)
// v7.10 [기척, 형체, 식별] 거리: u 의 등급 × 대상 t 의 크기 · 움직임. 형체 · 식별은 눈부시면 줄고, 기척 (소리 · 냄새) 은 안 줄어듦
function nightR(W, u, t){
  const N = W.rules.night || {}, g = N[u.vg || 'C'] || N.C || [12, 9, 4], h = t.h || 1.7;
  let m = h >= 2.2 ? N.big || 1.25 : h <= 1.4 ? N.small || 0.85 : 1;
  m *= Math.hypot(t.vx || 0, t.vy || 0) > 0.5 ? N.move || 1.25 : W.t - (t.moveT == null ? -9 : t.moveT) > (N.hold || 1.5) ? N.still || 0.8 : 1;
  const gl = glareAt(W, u) ? N.glare || 0.6 : 1;
  return { pres: g[0] * m, form: g[1] * m * gl, ident: g[2] * m * gl };
}
// 식별: 무기 · 방향 · 공격 동작을 알아봄 — 빛 안 (litIdent) · 어스름 (×dimIdent) · 어둠 (등급 식별 거리) · 몸이 닿음. 아군은 늘 앎
function identOK(W, u, t){
  if (!t || t.side === u.side || gap(u, t) < 1.2) return true;
  const N = W.rules.night || {}, d = dist(u, t), sk = stealthK(W, t);
  if (litAt(W, t.x, t.y)) return d <= (N.litIdent || 9) * sk;
  return d <= nightR(W, u, t).ident * sk * (glowAt(W, t.x, t.y) ? N.dimIdent || 1.3 : 1);
}
const glareReach = (W, u) => { const N = W.rules.night || {}; return ((N[u.vg || 'C'] || N.C || [12, 9, 4])[1]) * (glareAt(W, u) ? N.glare || 0.6 : 1); };   // v7.10 (옛 정의는 아래)
const glareReach0 = (W, u) => {""")
t=rep(t,"const nvReach = (W, u) => { if (!u.nv) return 0;","const nvReach = (W, u) => { const N = W.rules.night || {}; return ((N[u.vg || 'C'] || N.C || [12, 9, 4])[2]) * (glareAt(W, u) ? N.glare || 0.6 : 1); };   // v7.10 식별 거리 (보통 몸)\nconst nvReach0 = (W, u) => { if (!u.nv) return 0;")
t=rep(t,"const clearSee = (W, a, e) => canSee(W, a, e) && (litAt(W, e.x, e.y) || dist(a, e) <= nvReach(W, a) || (a.smell && dist(a, e) <= a.smell) || gap(a, e) < 0.4);","const clearSee = (W, a, e) => canSee(W, a, e) && identOK(W, a, e);   // v7.10 또렷이 = 식별")
t=rep(t,"const blindTo = (W, u, t) => !u.nv && !(u.smell && dist(u, t) <= u.smell) && !glowAt(W, t.x, t.y);","const blindTo = (W, u, t) => !glowAt(W, t.x, t.y) && !(u.smell && dist(u, t) <= u.smell) && dist(u, t) > nightR(W, u, t).form + 0.01;   // v7.10 형체도 안 잡힘")
t=rep(t,"p *= u.nv && dist(u, t) <= nvReach(W, u) ? (R.darkHit[u.nvG || 'A'] || 0.9) : glowAt(W, t.x, t.y) ? (R.darkHit.dim || 0.75) : (R.darkHit.smell || 0.8);","p *= identOK(W, u, t) ? (R.darkHit[u.nvG || 'A'] || 0.9) : glowAt(W, t.x, t.y) ? (R.darkHit.dim || 0.75) : (R.darkHit.form || R.darkHit.smell || 0.8);   // v7.10 식별하면 등급 값 · 형체만 보고 쏘면 form")
# 탐색 지도
t=rep(t,"""for (const a of al){ const d = Math.hypot(a.x - x, a.y - y); if (d > W.rules.sight + 3) continue;
      if (W.light[i] > LIT){ W.explored[i] = 2; break; }
      if (a.nv && d <= (a.nvG === 'C' ? W.rules.nvC || 2.5 : a.nvG === 'B' ? W.rules.nvB || 5 : W.rules.sight)){ W.explored[i] = Math.max(W.explored[i], 1); } }""","""for (const a of al){ const d = Math.hypot(a.x - x, a.y - y); if (d > Math.max(W.rules.sight + 3, 17)) continue;
      if (W.light[i] > LIT && d <= W.rules.sight + 3){ W.explored[i] = 2; break; }
      const N = W.rules.night || {}, g = N[a.vg || 'C'] || N.C || [12, 9, 4];
      if (d <= g[1] * (glareAt(W, a) ? N.glare || 0.6 : 1)){ W.explored[i] = Math.max(W.explored[i], 1); } }   // v7.10 어둠 속에서는 등급 형체 거리까지 희미하게""")
# 움직임 시각
t=rep(t,"    u.vx = u.vx * 0.7 + 0.3 * (u.x - u.px) / dt; u.vy = u.vy * 0.7 + 0.3 * (u.y - u.py) / dt;","    u.vx = u.vx * 0.7 + 0.3 * (u.x - u.px) / dt; u.vy = u.vy * 0.7 + 0.3 * (u.y - u.py) / dt; if (Math.hypot(u.vx, u.vy) > 0.5) u.moveT = W.t;   // v7.10 마지막으로 움직인 때 (가만히 있으면 덜 보임)")
# 회피: 식별 못 하면
t=rep(t,"  p *= fatMul(W, u, 'dodge');   // v6.6 지치면 덜 피함","  p *= fatMul(W, u, 'dodge');   // v6.6 지치면 덜 피함\n  if (!mate && !identOK(W, u, atk)){ p *= (W.rules.night || {}).idDodge != null ? W.rules.night.idDodge : 0.35; atk.act.noId = true; }   // v7.10 형체만 보이고 동작은 안 보임")
# 불꽃: 멀리서
t=rep(t,"dist(u, c) <= R.sight * 1.6 && !canSee(W, u, c)","dist(u, c) <= ((R.night || {}).flame || R.sight * 1.6) && !canSee(W, u, c)")
t=rep(t,"u.sense[c.i] = { x: c.x + (W.rand() - 0.5), y: c.y + (W.rand() - 0.5), t: W.t, exact: false, light: true };","{ const fe = 0.5 + dist(u, c) * 0.04; u.sense[c.i] = { x: c.x + (W.rand() - 0.5) * 2 * fe, y: c.y + (W.rand() - 0.5) * 2 * fe, t: W.t, exact: false, light: true }; }")
# 기척
t=rep(t,"  if (u.side === 0 && u.smellG && W.t - u.briefAt >= R.briefT) brief(W, u);","  if (u.side === 0 && u.smellG && W.t - u.briefAt >= R.briefT) brief(W, u);\n  presenceTick(W, u, foes);")
t=rep(t,"function alertNear(W, e, target){","""// v7.10 기척: 보이진 않지만 소리 · 냄새 · 희미한 움직임으로 '무언가 있다' — 대략 자리 (오차 있음) 만. 후각도 정확한 좌표는 못 줌
function presenceTick(W, u, foes){
  const N = W.rules.night; if (!N || AI6.includes('presence') || u.down || u.sleep) return;
  const hr = Math.max(0.5, Math.min(1, hearR(W, u, null) / (W.rules.hear || 9)));
  for (const f of foes){
    const x0 = u.sense[f.i]; if (x0 && W.t - x0.t < 1.2) continue;
    const d = dist(u, f); if (d > 27 || canSee(W, u, f)) continue;
    const nr = nightR(W, u, f), los = losClear(W.map, u.x, u.y, f.x, f.y), pr = nr.pres * stealthK(W, f) * (0.6 + 0.4 * hr) * (los ? 1 : 0.7);
    if (d > pr) continue;
    const e = Math.min(3.5, 0.6 + d * (N.senseErr || 0.2));
    u.sense[f.i] = { x: f.x + (W.rand() - 0.5) * 2 * e, y: f.y + (W.rand() - 0.5) * 2 * e, t: W.t, exact: false, pres: true, err: +e.toFixed(1) };
    u.presAt = u.presAt || {};
    if (W.t - (u.presAt[f.i] == null ? -99 : u.presAt[f.i]) > 10){ u.presAt[f.i] = W.t; const s = u.sense[f.i];
      L(W, { k: 'presence', a: u.i, b: f.i, dir: dirName(s.x - u.x, s.y - u.y), d: Math.round(d), err: u.sense[f.i].err, vis: u.side === 0 || !!u.seenBy });
      if (u.side === 0) u.lastDec = { t: W.t, s: `${dirName(s.x - u.x, s.y - u.y)} 쪽 ${Math.round(d)}칸 안팎에서 기척 — 형체는 안 보임` }; }
  }
}
function alertNear(W, e, target){""")
open(D+'rt3_tail.js','w').write(t); print('ok')
