def run():
    global s
    p='rt3_head.js'; s=open(p).read()
    def rep(a,b,n=1):
        global s; c=s.count(a); assert c==n,(c,a[:80]); s=s.replace(a,b)
    rep("""  cmdLink: { base: 4,""","""  stealth: { dark: 0.45, lit: 0.75, spd: 0.6, reveal: 2, cls: { '기동': 1, '원거리': 0.8, '치유': 0.8, '근접': 0.7, '지휘': 0.7 }, small: 1.1, heavy: 0.65, giant: 0.1 },   // v7.5 은신: 들킬 거리 × (어둠 dark · 빛 속 lit, 숨는 솜씨만큼) · 은신 걸음 × spd · 치거나 쏘면 reveal 초 드러남 · 숨는 솜씨 = 직업 cls × 작은 몸 (1.5m 아래) small × 중갑 heavy × 거구 · 개조된 몸 giant (횃불을 켜면 없음)
  darkHit: { A: 0.95, B: 0.9, C: 0.85, smell: 0.8, melee: 0.96 },   // v7.5 어둠 속 (빛 없는 칸) 상대를 야시 (등급) · 후각으로 보고 칠 때 명중 × — 모두가 살짝 떨어짐 (못 보면 darkAim · darkAimFar 그대로)
  smellG: { S: [5, 999], A: [4, 9], B: [3, 7], C: [2, 5] },   // v7.5 후각 등급: [정확히 맡는 거리, 대략 맡는 거리] — [높은후각] = A (S 는 맵 전체). 후각이 있으면 어둠 속에서도 아군 자리로 곧장 돌아옴
  scout: { look: 1.5, max: 16, near: 4.5, lost: 0.35, lostT: [0.8, 1.6], mark: 40, jit: 1.2 },   // v7.5 정찰: 다다른 곳에서 둘러보는 시간 · 나가 있는 최대 시간 · 보이는 적에게 이만큼 다가가면 멈춰 봄 · 어둠 속 후각 없는 귀환 — 2초마다 헤맬 확률 · 헤매는 시간 · 보고한 실루엣이 남는 시간 · 자리 흔들림 (칸)
  torchOn: 0.8, torchOff: 0.2,   // v7.5 횃불을 켜는 데 · 끄는 데 걸리는 시간 (초)
  cmdLink: { base: 4,""")
    rep("""   v7.4.0: 지휘 전달""","""   v7.5.0: 은신 (은신 걸음 · 들킬 거리 ↓ — 작은 기동병이 잘 숨고 거구는 못 숨음, 적 매복도) · 정찰 명령 (숨어서 가 보고 · 들키면 도망 · 돌아와 실루엣으로 보고) · 지휘관과 닿지 않는 아군의 일은 모름 (소식 없음)
           횃불 켜고 끄기 (켜는 데 0.8초) · 어둠 속 명중 살짝 ↓ (야시 등급 · 후각) · 후각 등급 S · A · B · C (청광묵 [후각B] — 브리핑 · 어둠 속 귀환).
   v7.4.0: 지휘 전달""")
    open(p,'w').write(s)

    p='rt3_mid.js'; s=open(p).read()
    rep("""  for (const h of W.units) if (h.torch && h.alive) L.push({ x: h.x, y: h.y, r: W.rules.heroLight, f: 0 });   // 횃불을 든 이 (처음엔 주인공)
  W.torches.forEach((t, i) => L.push({ x: t.x, y: t.y, r: W.rules.torchLight, f: i + 1 }));""","""  for (const h of W.units) if (h.torch && h.alive && !h.torchOff) L.push({ x: h.x, y: h.y, r: W.rules.heroLight, f: 0 });   // 횃불을 든 이 (처음엔 주인공)   // v7.5 끈 횃불은 안 비춤
  W.torches.forEach((t, i) => { if (!t.off) L.push({ x: t.x, y: t.y, r: W.rules.torchLight, f: i + 1 }); });""")
    rep("""  if (u.sightMul != null && u.sightMul < 1 && d > W.rules.sight * u.sightMul) return false;   // v5.5 눈을 잃음: 보는 거리 ×""","""  if (u.sightMul != null && u.sightMul < 1 && d > W.rules.sight * u.sightMul) return false;   // v5.5 눈을 잃음: 보는 거리 ×
  const sk = t.side !== u.side ? stealthK(W, t) : 1; if (sk < 1 && d > W.rules.sight * sk) return false;   // v7.5 은신: 들킬 거리 ×""")
    rep("""  if (!litAt(W, t.x, t.y)){ if (!u.nv) return false; if (u.nvG === 'B' && d > (W.rules.nvB || 5)) return false; if (u.nvG === 'C' && d > (W.rules.nvC || 2.5)) return false; }""","""  if (!litAt(W, t.x, t.y)){ if (!u.nv) return false; if (u.nvG === 'B' && d > (W.rules.nvB || 5) * sk) return false; if (u.nvG === 'C' && d > (W.rules.nvC || 2.5) * sk) return false; }""")
    open(p,'w').write(s)

    p='rt3_tail.js'; s=open(p).read()
    # 후각 등급
    rep("""smellG: (p.traits || []).includes('높은후각') ? (p.smellG === 'S' ? 'S' : 'A') : '', smell: (p.traits || []).includes('높은후각') ? rules.smell : 0,""","""smellG: smellGrade(p), smell: smellGrade(p) ? (smellGrade(p) === 'A' ? rules.smell : ((rules.smellG || {})[smellGrade(p)] || [3])[0]) : 0, smellFar: smellGrade(p) ? (smellGrade(p) === 'A' ? rules.smellFar : ((rules.smellG || {})[smellGrade(p)] || [3, 7])[1]) : 0,   // v7.5 후각 등급 S · A · B · C""")
    rep("""  const R = W.rules, far = u.smellG === 'S' ? 1e9 : R.smellFar;""","""  const R = W.rules, far = u.smellG === 'S' ? 1e9 : u.smellFar || R.smellFar;""")
    rep("""  const far = u.smellG === 'S' ? 1e9 : W.rules.smellFar;
  const hid = W.units.filter(f => f.alive && f.side !== u.side && !f.seenBy && dist(u, f) <= far);""","""  const far = u.smellG === 'S' ? 1e9 : u.smellFar || W.rules.smellFar;
  if (u.side === 0 && u.posUnk){ for (const f of W.units) if (f.alive && f.side !== u.side && dist(u, f) <= far && u.sc) u.sc.seen[f.i] = u.sc.seen[f.i] || { x: f.x, y: f.y, t: W.t, look: ['냄새'], smell: true }; return; }   // v7.5 지휘관과 닿지 않으면 알릴 수 없음 (정찰이면 돌아와 보고)
  const hid = W.units.filter(f => f.alive && f.side !== u.side && !f.seenBy && dist(u, f) <= far);""")
    rep("""// 지금 낼 수 있는 속력: 다리 상처""","""// v7.5 후각 등급: [높은후각] = A (smellG S 면 S), [후각S] · [후각A] · [후각B] · [후각C]
function smellGrade(p){ const tr = p.traits || []; if (tr.includes('높은후각')) return p.smellG === 'S' ? 'S' : 'A'; const t = tr.find(x => /^후각[SABC]$/.test(x)); return t ? t.slice(2) : ''; }
// v7.5 은신: 숨는 솜씨 (직업 × 작은 몸 × 중갑 × 거구) — 켜 둔 동안 (은신 · 적 매복) 들킬 거리 × (어둠 dark · 빛 lit 쪽으로). 횃불을 켰거나 · 방금 쳤거나 · 뛰면 없음
const STL = W => W.rules.stealth || {};
function stealthOf(W, u){ const S = STL(W), g = (u.gear || {})['몸']; let e = ((S.cls || {})[u.cls] != null ? S.cls[u.cls] : 0.75) * ((u.h || 1.7) < 1.5 ? (S.small || 1.1) : 1) * (g && (g.mat === '판금' || g.tier >= 3) ? (S.heavy || 0.65) : 1) * (u.giant || u.modBody || u.bodyShield ? (S.giant || 0.1) : 1); return Math.max(0, Math.min(1, e)); }
function stealthK(W, t){
  if (!(t.stealth || t.lurk) || !t.stealthE || AI6.includes('stealth') || (t.torch && !t.torchOff) || W.t - (t.revealT == null ? -9 : t.revealT) < (STL(W).reveal || 2) || (t.order && t.order.hurry) || (t.mv && t.mv.run && W.t < t.mv.until)) return 1;
  const S = STL(W), base = litAt(W, t.x, t.y) ? (S.lit || 0.75) : (S.dark || 0.45); return 1 - t.stealthE * (1 - base);
}
// 지금 낼 수 있는 속력: 다리 상처""")
    rep("""* (u.crawl ? (W.rules.crawl != null ? W.rules.crawl : 0.2) : 1);   // v5.2 기어다님""","""* (u.crawl ? (W.rules.crawl != null ? W.rules.crawl : 0.2) : 1) * (u.stealth && !(u.order && u.order.hurry) && !(u.sc && u.sc.ph === 'flee') ? (STL(W).spd || 0.6) : 1);   // v5.2 기어다님   // v7.5 은신 걸음""")
    rep("""  W.giants = W.units.filter(u => u.h >= 2.2);   // 시야를 가릴 만큼 큰 몸""","""  W.giants = W.units.filter(u => u.h >= 2.2);   // 시야를 가릴 만큼 큰 몸
  for (const u of W.units) u.stealthE = stealthOf(W, u);   // v7.5 숨는 솜씨""")
    # 치거나 쏘면 드러남
    rep("""function fire(W, u){
  u.shots++; u.lastFireT = W.t; u.inRangeT = 0;""","""function fire(W, u){
  u.shots++; u.lastFireT = W.t; u.inRangeT = 0; u.revealT = W.t;   // v7.5 쏘면 드러남""")
    # 어둠 속 명중
    rep("""  if (blindTo(W, u, t)) p *= R.darkAimFar != null ? R.darkAimFar : 0.1;""","""  if (blindTo(W, u, t)) p *= R.darkAimFar != null ? R.darkAimFar : 0.1;
  else if (!litAt(W, t.x, t.y) && R.darkHit) p *= u.nv ? (R.darkHit[u.nvG || 'A'] || 0.9) : (R.darkHit.smell || 0.8);   // v7.5 어둠 속 상대는 보여도 살짝 덜 맞음""")
    rep("""      const dp = blindTo(W, u, t) ? (R.darkAim != null ? R.darkAim : 0.25) : 1;""","""      const dp = blindTo(W, u, t) ? (R.darkAim != null ? R.darkAim : 0.25) : !litAt(W, t.x, t.y) && R.darkHit ? (R.darkHit.melee || 0.96) : 1;   // v7.5 어둠 속은 보여도 살짝 헛침
      u.revealT = W.t;   // v7.5 치면 드러남""")
    # 횃불 (쓰러질 때 떨어뜨림 — 꺼진 채면 꺼진 채로)
    rep("""    if (t.torch){ t.torch = false; W.torches.push({ x: +t.x.toFixed(2), y: +t.y.toFixed(2), dropped: true, fell: true });""","""    if (t.torch){ t.torch = false; W.torches.push({ x: +t.x.toFixed(2), y: +t.y.toFixed(2), dropped: true, fell: true, off: !!t.torchOff }); t.torchOff = false;""")
    rep("""  W.torches = W.torches.filter(t => t !== tc); u.torch = true; computeLight(W);""","""  W.torches = W.torches.filter(t => t !== tc); u.torch = true; u.torchOff = !!tc.off; computeLight(W);""")
    rep("""  for (const c of W.units) if (c.torch && c.alive && c.side !== u.side""","""  for (const c of W.units) if (c.torch && !c.torchOff && c.alive && c.side !== u.side""")
    rep("""  if (d <= sr && (canSee(W, u, C) || (u.blind ? false : C.torch && losClear(W.map, u.x, u.y, C.x, C.y)))){ ps = (K.sign || 0.9) * (1 - 0.35 * Math.pow(d / sr, 2)) * (lit || C.torch ? 1""","""  const ct = C.torch && !C.torchOff;   // v7.5 꺼진 횃불은 안 보임
  if (d <= sr && (canSee(W, u, C) || (u.blind ? false : ct && losClear(W.map, u.x, u.y, C.x, C.y)))){ ps = (K.sign || 0.9) * (1 - 0.35 * Math.pow(d / sr, 2)) * (lit || ct ? 1""")
    rep("""(K.signT || 0.35) * (lit || C.torch ? 1 : 1.4) : 0, via, why, busy };""","""(K.signT || 0.35) * (lit || ct ? 1 : 1.4) : 0, via, why, busy };""")
    open(p,'w').write(s)
run()
print('ok')
