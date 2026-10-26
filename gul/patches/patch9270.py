# v9.9.9 엔진 — patch9270.py v1.0 (v1.0: 보호 = 대장 관계의 두 번째 종류로 다시 — 대장-따를이 (chiefMode 'follow': 평소엔 대장 약간 뒤 · 대장이 싸우면 적극 가담 · 발 빠르면 상대 등 뒤로) / 대장-보호받을이 ('cover': 대장 등 뒤에 딱 붙어 가능한 한 안전하게 · 겨눠지면 대장을 방패 삼는 자리로 · 쏘기 · 찌르기 · 치료는 그 자리에서 닿을 때만 · 대장의 공격 지시도 받지 않음). 둘 다 대장을 따라 움직이고 · 붙고 · 돌격이 오면 함께 버팀. 종류를 정하지 않은 옛 관계는 장비로 (사수 · 무구 없는 치유 = 보호받을이). 잘못 만든 옛 '보호' (protOf — 대상이 노려지면 뛰어들어 막기) 는 없애고, 저장된 것은 '대상 = 지켜 주던 이의 보호받을이' 로 바꿔 불러옴 · 양쪽 편 같음)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch9260.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
# 보호받을이 판단
rep("const isSupport = u => isFar(u) || (u.cls === '치유' && !u.shield && !u.armShield && (unarmed(u) || !u.canGuard));",
    "const isSupport = u => isFar(u) || (u.cls === '치유' && !u.shield && !u.armShield && (unarmed(u) || !u.canGuard));\n// v9.9.9 대장의 보호받을이: 정했으면 그대로 (cover · follow) · 안 정한 옛 관계는 장비로\nconst coverU = u => !!u.chiefLk && (u.chiefMode === 'cover' || (u.chiefMode !== 'follow' && isSupport(u)));")
rep("    if (W.units.some(f => seenF(f) && gap(u, f) < Math.max(u.rng, 0.5) + 0.3 && !isFar(u))) return false;   // 코앞 적은 쳐냄",
    "    coverFr = !isFar(u) && W.units.filter(f => seenF(f) && gap(u, f) <= Math.max(u.rng, 0.5) + 0.05).sort((a, b) => gap(u, a) - gap(u, b))[0]; if (coverFr && u.act) return true;   // v9.9.9 닿는 적만 — 자리 (대장 등 뒤) 에서 찌름 (아래) · 쫓아가지 않음")
rep("  const heal = isSupport(u), ft = C.target", "  let coverFr = null; const heal = coverU(u), ft = C.target")
rep("  if (dd < 0.15){ stop(u); u.fg = th ? Math.atan2(th.y - u.y, th.x - u.x) : C.face || 0; u.pairHow = 'back'; return true; }", "  if (coverFr && dd < 0.35){ stop(u); u.target = coverFr; u.fg = Math.atan2(coverFr.y - u.y, coverFr.x - u.x); u.pairHow = 'back'; startAct(W, u, coverFr); return true; }   /* v9.9.9 보호받을이: 자리에서 닿는 적을 (창이면 어깨 너머로) */\n  if (dd < 0.15){ stop(u); u.fg = th ? Math.atan2(th.y - u.y, th.x - u.x) : C.face || 0; u.pairHow = 'back'; return true; }")
rep("  const R = C.r + u.r + (heal && !isFar(u) ? 0.3 : 0.06), sx =", "  const R = C.r + u.r + (heal && u.cls === '치유' && isSupport(u) ? 0.3 : 0.06), sx =")
# 대장의 공격 지시는 보호받을이에게 가지 않음
rep("&& !(!isFar(m) && m.chiefLk && m.sqLead === D.i && (m.role === '미드필더'", "&& !(m.chiefLk && m.sqLead === D.i && coverU(m)) && !(!isFar(m) && m.chiefLk && m.sqLead === D.i && (m.role === '미드필더'")
# 옛 보호 (뛰어들기) 없앰
rep("  if (!u.order && protStep(W, u, dt)) return whyS(W, u, 'PROTECT');   /* v9.9.1 보호 (망치보다 먼저) */\n", "")
# 대장 연결 종류
rep("function chiefSet(W, followers, chief){", "function chiefSet(W, followers, chief, mode){   /* v9.9.9 mode: 'follow' (따를이) · 'cover' (보호받을이) · 없으면 장비로 */")
rep("  if (F.every(u => u.chiefLk && u.sqLead === chief.i)){", "  if (F.every(u => u.chiefLk && u.sqLead === chief.i && (u.chiefMode || null) === (mode || null))){")
rep("  F.forEach(u => { u.sqLead = chief.i; u.chiefLk = true; u.sqFix = true; u.sqAuto = false;", "  F.forEach(u => { u.sqLead = chief.i; u.chiefLk = true; u.chiefMode = mode || null; u.sqFix = true; u.sqAuto = false; u.protOf = null;")
rep("function chiefClear(W, list){ const T = list.filter(u => u && u.chiefLk); T.forEach(u => { u.sqLead = null; u.chiefLk = false;", "function chiefClear(W, list){ const T = list.filter(u => u && u.chiefLk); T.forEach(u => { u.sqLead = null; u.chiefLk = false; u.chiefMode = null;")
# 저장 · 불러오기
rep("    if (p.protNm){ const Pt = W.units.find(c => c.side === 0 && c !== u && c.name === p.protNm && !c.summon); u.protOf = Pt ? Pt.i : null; }   /* v9.9.6 보호도 이어짐 */\n", "")
rep("      if (C){ u.sqLead = C.i; u.sqAuto = false; u.sqFix = true; u.chiefLk = true; }", "      if (C){ u.sqLead = C.i; u.sqAuto = false; u.sqFix = true; u.chiefLk = true; u.chiefMode = p.chiefMode === 'cover' || p.chiefMode === 'follow' ? p.chiefMode : null; }")
rep("  mateSlots(W);\n}", """  setup.units.forEach((p, k) => { const u = W.units[k]; if (!u || u.side !== 0 || !p.protNm) return; const Pt = W.units.find(c => c.side === 0 && c !== u && c.name === p.protNm && !c.summon);   /* v9.9.9 옛 보호 (u 가 Pt 를 지킴) → Pt 는 u 의 보호받을이 */
    if (Pt && !Pt.chiefLk && !(u.chiefLk && u.sqLead === Pt.i)){ Pt.sqLead = u.i; Pt.chiefLk = true; Pt.sqFix = true; Pt.sqAuto = false; Pt.chiefMode = 'cover'; } });
  mateSlots(W);
}""")
rep("p.chiefNm = C ? C.name : ''; const Pt = u.protOf != null ? W.units[u.protOf] : null; p.protNm = Pt && Pt.alive ? Pt.name : ''; }", "p.chiefNm = C ? C.name : ''; p.chiefMode = C && u.chiefMode ? u.chiefMode : ''; p.protNm = ''; }   /* v9.9.9 보호는 대장 관계의 종류 */")
rep("module.exports = { clumpTough,", "module.exports = { coverU, clumpTough,")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
print('patch9270 OK')
