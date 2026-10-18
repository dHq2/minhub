# v7.19.0 엔진 — patch719.py v1.2 (v1.2: 판의 기술에 inf · regen 을 옮김 · strike · penRes 내보냄 · v1.1: [의학X] 는 양동이 약에도 · 2단계 인물 바탕: 새 무기 6 (대지 마법 · 단궁 · 장도리 · 나달의 낡은 장검 · 권총 · 모닝스타) · 약한 재생 (regenK) · 무한 · 저절로 차는 치유 (inf · regen) · 2연속 도약 (leapN) · 무기 넉백 (kb) · 물리 마법 (phys — 갑옷 판정))
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def rd(f): return open(D + f, encoding='utf-8').read()
def wr(f, s): open(D + f, 'w', encoding='utf-8').write(s)
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    return s.replace(a, b)

h = rd('rt3_head.js')
h = rep(h, "'레베카의 검':{rng:0.52, kind:'날붙이'}", "'레베카의 검':{rng:0.52, kind:'날붙이'}, '나달의 낡은 장검':{rng:0.62, kind:'날붙이'}, '장도리':{rng:0.36, kind:'둔기', spdW:0.85}, '모닝스타':{rng:1.3, kind:'둔기', spdW:1.15, kb:0.45}, '대지 마법':{rng:6, aim:0.55, vel:20, P:60, draw:0.1, kind:'마법', phys:true, pen:0.6, penK:0.6, jit:0.2, kb:0.25}, '단궁':{rng:4, ammo:40, aim:0.5, vel:200, P:55, draw:0.08, kind:'활', pen:0.5, penK:0.75, jit:0.3, burst:2, burstMax:3, burstP:0.25, burstGap:0.2, burstMul:0.85}, '권총':{rng:5.5, ammo:100, mag:12, reload:1.6, burst:2, burstMax:3, burstP:0.2, burstGap:0.12, burstMul:0.75, loud:true, aim:0.55, vel:260, P:60, draw:0.05, kind:'총포류', pen:1, penK:0.45, jit:0.08}")   # v7.19 새 무기
h = rep(h, "  leap: {", "  leap: { chain: 0.3, chainCd: 1.6,")   # v7.19 2연속 도약: 이어 뛰기 대기 · 다 쓴 뒤 대기 ×
wr('rt3_head.js', h)

s = rd('rt3_tail.js')
s = rep(s, "sizeCls: p.sizeCls || null,", "sizeCls: p.sizeCls || null, leapN: +p.leapN || 1,")   # v7.19
s = rep(s, "regen: tr.includes('재생') ? ((rules.regen || {}).hp != null ? rules.regen.hp : 0.04) : 0,", "regen: tr.includes('재생') ? ((rules.regen || {}).hp != null ? rules.regen.hp : 0.04) : +p.regenK || 0,")   # v7.19 약한 재생 (딸기)
# 2연속 도약
s = rep(s, "  u.leapCd = W.t + (R.cd || 1.1); stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x);", "  u.leapCd = W.t + leapCdNext(W, u, R); stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x);")
s = rep(s, "  u.leapCd = W.t + (R.cd || 1.1); stop(u); u.fg = t && dir !== 'fwd'", "  u.leapCd = W.t + leapCdNext(W, u, R); stop(u); u.fg = t && dir !== 'fwd'")
s = rep(s, "/* ---------- v5.1 [도약] · [돌진] ---------- */", """/* ---------- v5.1 [도약] · [돌진] ---------- */
// v7.19 2연속 도약 (leapN 2 — 옐로): 남은 횟수가 있으면 chain 초 뒤 또 뜀, 다 쓰면 대기 × chainCd
function leapCdNext(W, u, R){ const n = u.leapN || 1; if (n <= 1) return R.cd || 1.1; u.leapQ = (u.leapQ == null ? n : u.leapQ) - 1; if (u.leapQ > 0) return R.chain || 0.3; u.leapQ = n; return (R.cd || 1.1) * (R.chainCd || 1.6); }""")
# 무한 · 저절로 차는 치유
s = rep(s, "const amt = revive ? Math.round(t.hp) : Math.round(t.hp - hp0); K.left--; K.cdT = W.t + K.cd; u.healed += amt;", "const amt = revive ? Math.round(t.hp) : Math.round(t.hp - hp0); if (!K.inf) K.left--; K.cdT = W.t + K.cd; u.healed += amt;   /* v7.19 inf = 마력 (딸기) */")
s = rep(s, "    const amt = Math.max(0, Math.min(K.per, K.left, Math.round(t.max - t.hp)));\n    t.hp += amt; K.left -= amt; u.healed += amt;", "    const medB = gradeMul(W.rules, u.traits, '의학'), base0 = Math.min(K.per, K.inf ? K.per : K.left), amt = Math.max(0, Math.min(Math.round(base0 * medB), Math.round(t.max - t.hp)));   /* v7.19 [의학X] 는 양동이 약에도 · inf = 끝없음 */\n    t.hp += amt; if (!K.inf) K.left = Math.max(0, K.left - Math.ceil(amt / medB)); u.healed += amt;")
s = rep(s, "  for (const u of W.units){ if (!u.undying && !(u.regen > 0)) continue;", "  for (const u of W.units) if (u.alive && u.skill && u.skill.regen > 0 && u.skill.left < u.skill.pool) u.skill.left = Math.min(u.skill.pool, u.skill.left + u.skill.regen * dt);   // v7.19 저절로 차는 약 (옐로의 양동이)\n  for (const u of W.units){ if (!u.undying && !(u.regen > 0)) continue;")
# 무기 넉백 (철퇴 · 대지 마법)
s = rep(s, "  applyDmg(W, u, t, dmg, o);\n  if (u.fire && !o.far", "  applyDmg(W, u, t, dmg, o);\n  { const wkb = !J && ((R.weapons || {})[u.weaponNow || u.weapon] || {}).kb; if (wkb && t.alive && !t.kb && t.side !== u.side) shove(W, u, t, wkb * (o.far ? 1 : u.strMul || 1), t.x - u.x, t.y - u.y, { tag: o.far ? '흙덩이에 밀림' : '철퇴에 밀림' }); }   // v7.19 무기 넉백\n  if (u.fire && !o.far")
# 물리 마법은 갑옷 판정
s = rep(s, "  if (!it || pw.kind === '마법') return { pen: true, m: 1, P, A: 0 };", "  if (!it || (pw.kind === '마법' && !pw.phys)) return { pen: true, m: 1, P, A: 0 };   // v7.19 바위 · 흙 마법 (phys) 은 갑옷 판정")
s = rep(s, "hotGap: +(p.skill.hotGap || 0.4) } : null,", "hotGap: +(p.skill.hotGap || 0.4), inf: !!p.skill.inf, regen: +(p.skill.regen || 0) } : null,")   # v7.19 끝없음 · 다시 참
s = rep(s, "if (typeof module !== 'undefined') module.exports = { ", "if (typeof module !== 'undefined') module.exports = { leapCdNext, strike, penRes, ")
wr('rt3_tail.js', s)
print('patch719 OK')
