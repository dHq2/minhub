# v7.25.1 엔진 — patch7251.py v1.1 (v1.1: 샷건을 든 동안엔 카이팅하지 않음 · 두 번째 무기 (alt): 늘 지니는 다른 총 — 바꿔 들면 지금 무기와 탄이 서로 자리를 바꿈 (총은 빠르게 0.35초) · 명령 { k: 'alt' } · 자동: 근접이 붙으면 샷건으로, 멀어지면 다시 /
#   샷건: 가까이 (몸 가장자리 1.8칸 안) 맞으면 피해 × 2.2 · 밀려남 1.0 (산탄) / [전투센스]: 못 본 쪽 공격도 잘 피함 (감 0.8) · 고립돼 맞아도 엎드리지 않고 움직이며 쏨)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
def load(n): return open(D + 'rt3_%s_v7250.js' % n, encoding='utf-8').read()
H, M, T = load('head'), load('mid'), load('tail')
def rep(s, a, b, c=1):
    n = s.count(a)
    assert n == c, (n, c, a[:110])
    return s.replace(a, b)

H = rep(H, "'샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:220, P:45, draw:0.05, kind:'총포류', pen:1, penK:0.3, jit:0.1}",
           "'샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:220, P:45, draw:0.05, kind:'총포류', pen:1, penK:0.3, jit:0.1, near:{r:1.8, mul:2.2, kb:1.0}}")
H = rep(H, "special: ['저격총', '샷건'], swap: 0.8,", "special: ['저격총', '샷건'], quick: 0.35, altIn: 2.2, altOut: 3.6, altCalm: 1.5, swap: 0.8,")
H = rep(H, "  evade: { react: 0.18,", "  evade: { csense: 0.8, react: 0.18,")

# 두 번째 무기를 지님
T = rep(T, "shells: acts.includes('영거리 사격') ? (p.shells != null ? +p.shells : 100) : null,",
           "shells: acts.includes('영거리 사격') ? (p.shells != null ? +p.shells : 100) : null, alt: p.alt && p.alt.name ? { name: p.alt.name, ammo: p.alt.ammo != null ? +p.alt.ammo : null, mag: p.alt.mag != null ? +p.alt.mag : null } : null, csense: tr.includes('전투센스'),")
# 샷건 탄에 무기 이름
T = rep(T, "p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1, gun: wp.kind === '총포류', cov });",
           "p: +p.toFixed(2), good, t0: W.t, side: u.side, mul: mul || 1, pm: pm || 1, gun: wp.kind === '총포류', cov, wn: u.weapon });")
T = rep(T, "        const o2 = strike(W, u, hit, s.meant != null ? W.units[s.meant] : hit, hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true, s.jav ? { jav: true, kn: !!s.kn } : (s.mul && s.mul !== 1) || (s.pm && s.pm !== 1) ? { mul: s.mul || 1, pm: s.pm || 1 } : null);\n",
           "        const NW = !s.jav && s.wn ? ((W.rules.weapons || {})[s.wn] || {}).near : null, near = !!NW && hit.side !== s.side && Math.hypot(hit.x - s.x0, hit.y - s.y0) - hit.r <= (NW.r || 1.8);   /* v7.25.1 샷건 산탄: 가까우면 크게 · 밀어냄 */\n"
           "        const o2 = strike(W, u, hit, s.meant != null ? W.units[s.meant] : hit, hit.i === s.meant ? s.p : Math.max(s.p, 0.9), true, s.jav ? { jav: true, kn: !!s.kn } : near ? { mul: (s.mul || 1) * (NW.mul || 2), pm: s.pm || 1, tag: '샷건 산탄 (코앞)' } : (s.mul && s.mul !== 1) || (s.pm && s.pm !== 1) ? { mul: s.mul || 1, pm: s.pm || 1 } : null);\n"
           "        if (near && o2 && hit.alive && !hit.kb && !o2.block) shove(W, u, hit, NW.kb || 1, s.dx, s.dy, { tag: '샷건에 날아감' });\n")
# 바꿔 들기
T = rep(T, "// 명령: { k: 'swap', uid } — 가방의 그 무기 · 방패를 꺼내 듦 (명령은 닿아야 함)\n",
"""// v7.25.1 두 번째 무기 (alt): 늘 지니는 다른 총 — 바꿔 들면 지금 무기 (와 남은 탄) 와 자리를 바꿈. 총끼리는 빠름 (quick 초)
function startAlt(W, u, why){
  if (!u.alt || !u.alive || u.noArms || u.weaponGone || u.down || u.crawl || u.kb) return false;
  u.act = { k: 'altSwap', phase: 'wind', t0: W.t, end: W.t + (INV(W).quick || 0.35), why: why || '' }; setMood(W, u, u.alt.name + '으로 바꿔 듦'); return true;
}
function resolveAlt(W, u){
  const A = u.act; u.act = null; if (!u.alive || !u.alt || u.weaponGone) return;
  const cur = { name: u.weapon, ammo: u.ammo, mag: u.mag }, nx = u.alt; setWeapon(W, u, nx.name, { ammo: nx.ammo, mag: nx.mag }); u.alt = cur; u.altFarT = null;
  L(W, { k: 'altSwap', a: u.i, w: nx.name, from: cur.name, n: u.ammo, why: A.why, vis: u.side === 0 || !!u.seenBy });
}
// 자동: 근접 상대가 altIn 칸 안 (나를 노리거나 코앞) 이면 가까운 총 (샷건) 으로 · altOut 칸 안에 아무도 없이 altCalm 초면 (또는 탄이 떨어지면) 원래 총으로
function altAuto(W, u){
  if (!u.alt || u.act || u.weaponGone || u.down || u.crawl || u.kb || u.lie || (u.order && u.order.k !== 'attack')) return false;
  const I = INV(W), nearW = n => !!((W.rules.weapons || {})[n] || {}).near, holdNear = nearW(u.weapon), altNear = nearW(u.alt.name);
  const seen = W.units.filter(f => f.alive && !f.down && f.side !== u.side && !isFar(f) && canSee(W, u, f));
  if (!holdNear && altNear && (u.alt.ammo == null || u.alt.ammo > 0)){ const f = seen.find(f => gap(u, f) < (I.altIn || 2.2) && (f.target === u || (f.act && f.act.b === u.i) || gap(u, f) < 1.2)); if (f) return startAlt(W, u, f.name + '이(가) 붙음'); }
  if (holdNear && !altNear){ if (u.ammo === 0) return startAlt(W, u, '산탄이 떨어짐'); const any = seen.some(f => gap(u, f) < (I.altOut || 3.6));
    if (any) u.altFarT = null; else { if (u.altFarT == null) u.altFarT = W.t; if (W.t - u.altFarT >= (I.altCalm || 1.5)) return startAlt(W, u, '근접이 멀어짐'); } }
  return false;
}
// 명령: { k: 'swap', uid } — 가방의 그 무기 · 방패를 꺼내 듦 (명령은 닿아야 함)
""")
T = rep(T, "  if (u.act.k === 'bagSwap'){ resolveSwap(W, u); return; }   // v7.20\n", "  if (u.act.k === 'bagSwap'){ resolveSwap(W, u); return; }   // v7.20\n  if (u.act.k === 'altSwap'){ resolveAlt(W, u); return; }   // v7.25.1\n")
T = rep(T, "  if (invAuto(W, u)) return;   // v7.20 소지품: 탄이 다 떨어졌거나 무기를 잃으면 가방에서 꺼냄\n",
           "  if (altAuto(W, u)) return;   // v7.25.1 두 번째 총\n  if (invAuto(W, u)) return;   // v7.20 소지품: 탄이 다 떨어졌거나 무기를 잃으면 가방에서 꺼냄\n")
T = rep(T, "  if (o.k === 'swap'){ invOrder(W, u, o); return; }", "  if (o.k === 'swap'){ invOrder(W, u, o); return; }\n  if (o.k === 'alt'){ u.order = null; if (u.act && u.act.phase === 'wind' && u.act.k !== 'charge') u.act = null; if (!u.act && !startAlt(W, u, '명령')) L(W, { k: 'miss', a: u.i, why: '바꿔 들 총이 없음', vis: u.side === 0 }); return; }   /* v7.25.1 */")
T = rep(T, "const orderTxt = (o, u) => o && o.k === 'exit' ?", "const orderTxt = (o, u) => o && o.k === 'alt' ? ['alt'] : o && o.k === 'exit' ?")
T = rep(T, "  if (isFar(u)) return u.side === 0 && free && kiteMove(W, u, dt, seen);", "  if (isFar(u)) return u.side === 0 && free && !((W.rules.weapons || {})[u.weapon] || {}).near && kiteMove(W, u, dt, seen);   /* v7.25.1 샷건을 들면 물러나지 않고 맞쏨 */")
# [전투센스]
T = rep(T, "  const sense = a && !aware(W, u, a) ? (E.sense != null ? E.sense : 0.35) : 1; if (!sense) return 0;   // v6.7.1",
           "  const sense = a && !aware(W, u, a) ? (u.csense ? E.csense || 0.8 : E.sense != null ? E.sense : 0.35) : 1; if (!sense) return 0;   // v6.7.1   // v7.25.1 [전투센스] 못 본 쪽도 감")
T = rep(T, "  if (W.units.some(a => a !== u && a.alive && !a.down && a.side === u.side && dist(a, u) < (A.alone || 5))) return;   // 완전히 고립됐을 때만",
           "  if (u.csense) return;   // v7.25.1 [전투센스] 기동 사수: 엎드리지 않고 움직이며 쏨\n  if (W.units.some(a => a !== u && a.alive && !a.down && a.side === u.side && dist(a, u) < (A.alone || 5))) return;   // 완전히 고립됐을 때만")
T = rep(T, "if (typeof module !== 'undefined') module.exports = { flailDrop,", "if (typeof module !== 'undefined') module.exports = { startAlt, resolveAlt, altAuto, flailDrop,")

for n, s in (('head', H), ('mid', M), ('tail', T)):
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
print('patch7251 OK')
