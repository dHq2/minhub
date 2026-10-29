# v9.14.3 페이지 — page9410.py v1.0 (v1.0: 부상이 다음 판 · 다음 층으로 이어짐 — 판을 넘길 때 (여정 · 프롤로그) 부상을 명단에 남기고 (injC) 새 판을 만들면 다시 얹음: 잘린 · 부서진 팔 · 눈 · 다리 · 척추 · 머리 (카리우스) · 골절 · 관통 · 힘줄 · 부식 · 공격 · 속력 배수 · 부상 글 — 뇌진탕 (잠깐) · 출혈은 넘기지 않음 (판 사이에 지혈))
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9400.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep('<!-- 굴의 전투판 v9.14.2 (2026-10-29)', '<!-- 굴의 전투판 v9.14.3 (2026-10-29)')
rep('     v9.14.2: 층마다 동료', '''     v9.14.3: 부상이 다음 판 · 다음 층으로 이어짐 (팔 · 눈 · 다리 · 척추 · 골절 · 관통 · 힘줄 · 부식 · 공격 · 속력 배수 · 부상 글 — 뇌진탕 · 출혈은 판 사이에 가라앉음)
     v9.14.2: 층마다 동료''')
for a, b in (('h1::after{content:" v9.14.2"', 'h1::after{content:" v9.14.3"'), ('<footer>굴의 전투판 v9.14.2', '<footer>굴의 전투판 v9.14.3'), ('return `굴의 전투판 v9.14.2 · ${title}', 'return `굴의 전투판 v9.14.3 · ${title}'),
             ("copyText('굴의 전투판 v9.14.2 자동 판 기록", "copyText('굴의 전투판 v9.14.3 자동 판 기록"), ("o.push(`굴의 전투판 v9.14.2 — ${C.run", "o.push(`굴의 전투판 v9.14.3 — ${C.run"),
             ('의 버전 기록에 — v9.14.2 층마다 동료', '의 버전 기록에 — v9.14.3 부상 이어짐 / v9.14.2 층마다 동료'),
             ('">v9.14.2 층마다 동료', '">v9.14.3 부상 이어짐 · v9.14.2 층마다 동료')):
    rep(a, b)
# 판을 넘길 때 (settleWorld — 여정 · 프롤로그만. 훈련장 '반영' 은 부상을 안 남김)
rep("    for (const it of Wd.items || []) if ((it.k === 'weapon' || it.k === 'shield') && it.own === ownKey(u)",
    "    if (S.camp && !S.camp.end){ const c = injSnap(u); if (c) p.injC = c; else delete p.injC; }   /* v9.14.3 부상을 명단에 */\n    for (const it of Wd.items || []) if ((it.k === 'weapon' || it.k === 'shield') && it.own === ownKey(u)")
rep("function settleWorld(Wd){", """// v9.14.3 부상 이어짐: 판이 끝날 때 남은 부상 (잠깐 가는 뇌진탕 · 출혈은 뺌) → 새 판에서 다시 얹음 (팔 · 눈 · 다리는 그 효과까지 · 배수는 그대로)
function injSnap(u){
  const I = (u.inj || []).filter(w => w.k !== 'daze' && w.until == null).map(w => ({ k: w.k, txt: w.txt, ...(w.zone ? { zone: w.zone } : {}) })), A = u.arms || {};
  const wn = (u.wounds || []).filter(t => !/뇌진탕|어지러움/.test(t)), atk = Math.min(1, u.atkMul == null ? 1 : u.atkMul), spd = Math.min(1, u.spdMul == null ? 1 : u.spdMul);
  if (!I.length && !A.L && !A.R && !u.legLoss && !(u.eyeLost > 0) && !wn.length && atk > 0.999 && spd > 0.999 && !(u.headsLost > 0)) return null;
  return { inj: I, wounds: wn, arms: { L: A.L || null, R: A.R || null }, leg: u.legLoss || null, eyes: u.eyeLost || 0, heads: u.heads, atk: +atk.toFixed(3), spd: +spd.toFixed(3) };
}
function injRestore(Wd){
  if (!Wd || !S.camp || S.camp.end) return 0; let n = 0;
  for (const u of Wd.units){ if (u.side !== 0 || !u.alive) continue; const p = S.units.find(x => x.id === u.pid), C = p && p.injC; if (!C) continue;
    const n0 = Wd.log.length, f0 = (Wd.fx || []).length;
    try {
      if (C.heads != null && u.heads > C.heads){ const lost = u.heads - C.heads; u.heads = C.heads; u.eyes = Math.max(0, (u.eyes || 2) - 2 * lost); }   // 카리우스: 잃은 머리
      for (const k of ['L', 'R']) if (C.arms && C.arms[k] && !(u.arms || {})[k]) maimArm(Wd, u, null, C.arms[k] === '절단' ? '날붙이' : '둔기', k);
      for (let i = 0; i < (C.eyes || 0) && u.eyeLost < u.eyes; i++) maimEye(Wd, u, null);
      if (C.leg === '절단' || C.leg === '파괴') cripple(Wd, u, null, C.leg === '절단' ? '날붙이' : '둔기'); else if (C.leg === '척추'){ u.crawl = true; u.legLoss = '척추'; u.proneT = -9; }
      u.inj = (C.inj || []).map(w => ({ ...w, t: 0, old: true })); u.atkMul = C.atk != null ? C.atk : u.atkMul; u.spdMul = C.spd != null ? C.spd : u.spdMul; u.wounds = (C.wounds || []).slice();
      u.bleed = null; u.ibleed = null; injRecalc(Wd, u);
    } catch (e) { console.warn('injRestore', e); }
    Wd.log.length = n0; if (Wd.fx) Wd.fx.length = f0; n++;
    logEv(Wd, { k: 'r8', s: `🩹 ${u.name} — 지난 부상 그대로: ${(C.wounds || []).join(' · ') || '몸이 무거움'}${C.atk < 1 ? ' · 공격 ×' + C.atk.toFixed(2) : ''}${C.spd < 1 ? ' · 속력 ×' + C.spd.toFixed(2) : ''}`, c: 'dim', vis: true }); }
  return n;
}
function settleWorld(Wd){""")
rep("  startJit(world);   /* v8.4.1 시작 자리 살짝 무작위 */ formStartPlace(world);", "  startJit(world);   /* v8.4.1 시작 자리 살짝 무작위 */ formStartPlace(world); injRestore(world);   /* v9.14.3 지난 부상 */")
open(F, 'w', encoding='utf-8').write(s)
print('page9410 OK')
