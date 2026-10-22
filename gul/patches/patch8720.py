# v8.7.2 엔진 — patch8720.py v1.1 (v1.1: 처음부터 지휘관이 없는 우리 편은 0초부터 임시 지휘 (혼자 남은 이의 0초 명령이 안 닿던 것) · v1.0: patch8600.py 를 먼저 돌린 뒤: 지휘관이 처음부터 없는 우리 편도 임시 지휘 (명령이 닿게) · 스스로 돌격은 더 가까운 적을 지나쳐 가지 않음 · 타고난 '돌격 안 함' 은 지휘관의 돌격 명령은 따름 (유저가 켠 것은 그대로 막음) · 치유 역할은 타고나길 돌격 안 함 · 리치 = 맨손 리치 + 무기 (무기를 바꿔 들어도 몸 리치가 남음 — 카리우스가 망치를 들면 짧아지던 것) · 움직이는 중에도 후각 · 세자르 원형 베기는 빠르고 약한 견제 · 돌진 유도 조금 더 · 공중제비 내려찍기는 상대를 살짝 따라감)
import subprocess, json, os, shutil
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8600.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)

# E1 지휘관이 처음부터 없는 우리 편: 2.5초 뒤 임시 지휘관 (명령이 닿을 길) — 적은 그대로 (지휘 없는 짐승 무리는 각자)
rep("W.hadCmd = [0, 1].map(s => W.units.some(u => u.side === s && u.cmd > 0));",
    "W.hadCmd = [0, 1].map(s => W.units.some(u => u.side === s && u.cmd > 0) || (s === 0 && W.units.some(u => u.side === 0 && !u.summon)));   /* v8.7.2 우리 편은 지휘관이 없어도 누군가 이어받음 (유저 명령이 닿을 길) */\n"
    "  if (!W.units.some(u => u.side === 0 && u.cmd > 0)){ const c = W.units.filter(u => u.side === 0 && !u.summon).sort((a, b) => (b.vet ? 1 : 0) - (a.vet ? 1 : 0) || b.tier - a.tier || b.hp - a.hp)[0]; if (c){ c.cmd = 1; c.cmdTmp = true; } }   /* v8.7.2 처음부터 지휘관이 없으면 0초부터 임시 지휘 (혼자 남은 이도 제 명령은 받음) */")
# E3 돌격 안 함: 타고난 성향이면 지휘관 · 유저의 돌격 명령은 따름 · 유저가 켠 '돌격 안 함' 은 명령도 막음 / 치유 역할은 타고나길 돌격 안 함
rep("  if (u.noChg) return false;   // v7.29.0",
    "  if (u.noChg && !(forced && u.noChg0 && u.noChg === u.noChg0 && !u.noChgUser)) return false;   /* v8.7.2 타고난 성향은 지휘관의 돌격 명령은 따름 */   // v7.29.0")
rep("noChg: !!p.noChg, noChg0: !!p.noChg,", "noChg: !!p.noChg || p.cls === '치유', noChg0: !!p.noChg || p.cls === '치유',   /* v8.7.2 치유는 타고나길 돌격 안 함 */")
# E2 스스로 돌격: 눈앞 (2.5칸 안) 에 더 가까운 적이 있으면 그 너머의 적에게 돌격하지 않음 (앞을 비우고 뒤로 뛰어들던 것)
rep("  if (!forced && !chargeOk(W, u, t)) return false;   // v5.3",
    "  if (!forced && W.units.some(f => f.alive && f !== t && f.side !== u.side && !f.down && !f.crawl && canSee(W, u, f) && gap(u, f) < Math.min(2.5, g - 1.2))) return false;   /* v8.7.2 더 가까운 적을 지나쳐 돌격하지 않음 */\n  if (!forced && !chargeOk(W, u, t)) return false;   // v5.3")
# E6 리치 = 맨손 리치 (몸) + 무기 — 처음 든 무기에서 몸 리치를 셈 (카리우스 0.6 − 맨손 0.3 = 0.3), 무기를 바꿔 들어도 남음
rep("  { const U = W.units[i]; U.poise = +p.poise > 0",
    "  { const U = W.units[i], w0 = (rules.weapons || {})[p.weapon]; U.reachX = far ? Math.max(0, Math.min(0.5, ((rules.reachB || {}).k || 0.25) * (hh - 1.7))) : Math.max(0, +(U.rng0 - (w0 && !isRangedW(w0) ? w0.rng : 0.3)).toFixed(3)); }   /* v8.7.2 몸 리치 (맨손 리치 − 맨손 기본) */\n  { const U = W.units[i]; U.poise = +p.poise > 0")
rep("u.rng = u.rng0 = u.rngSpear = wp.rng;", "u.rng = u.rng0 = u.rngSpear = far ? wp.rng : +(wp.rng + (u.reachX || 0)).toFixed(3);   /* v8.7.2 몸 리치 + 무기 */")
import re
n0 = sum(len(re.findall(r"(\w)\.rng = \(\(W\.rules\.weapons \|\| \{\}\)\['맨손'\] \|\| \{ rng: 0\.3 \}\)\.rng;", v)) for v in P.values())
n1 = sum(len(re.findall(r"u\.rng = \(W\.rules\.weapons\['맨손'\] \|\| \{ rng: 0\.3 \}\)\.rng;", v)) for v in P.values())
assert n0 == 6 and n1 == 2, (n0, n1)
for k in P:
    P[k] = re.sub(r"(\w)\.rng = \(\(W\.rules\.weapons \|\| \{\}\)\['맨손'\] \|\| \{ rng: 0\.3 \}\)\.rng;", r"\1.rng = ((W.rules.weapons || {})['맨손'] || { rng: 0.3 }).rng + (\1.reachX || 0);", P[k])
    P[k] = re.sub(r"u\.rng = \(W\.rules\.weapons\['맨손'\] \|\| \{ rng: 0\.3 \}\)\.rng;", "u.rng = (W.rules.weapons['맨손'] || { rng: 0.3 }).rng + (u.reachX || 0);", P[k])
# E7 후각은 움직이는 (무엇을 하는) 중에도
rep("    if (doThink && !u.act) think(W, u);",
    "    if (doThink && !u.act) think(W, u);\n    else if (doThink && u.smellG){ smellTick(W, u); if (u.side === 0 && W.t - u.briefAt >= W.rules.briefT) brief(W, u); }   /* v8.7.2 후각은 움직이는 중에도 */")
# E8 세자르 원형 베기: 한 방이 아니라 빠르고 약한 견제 (자주 씀)
rep("spin: { r: 2.6, wind: 0.35, rec: 0.5, mul: 2.0, kb: 1.6, stun: 0.5, frost: 2, cd: 8, brk: 3 }", "spin: { r: 2.4, wind: 0.22, rec: 0.3, mul: 0.6, kb: 0.5, stun: 0.15, frost: 0.6, cd: 2.2, brk: 1.5 }")
# E12 돌진: 달리며 조금 더 틂 · 공중제비 내려찍기는 움직인 상대를 살짝 따라감 (1칸까지)
rep("turn: 0.6, commit: 1.2,", "turn: 1.0, commit: 0.8,")
rep("function stepLeap(W, u, dt){\n  const A = u.act, q = Math.min(1, (W.t - A.t0) / Math.max(0.05, A.end - A.t0));\n",
    "function stepLeap(W, u, dt){\n  const A = u.act, q = Math.min(1, (W.t - A.t0) / Math.max(0.05, A.end - A.t0));\n"
    "  if (A.flip && A.slam && A.b != null && q < 0.85){ const t = W.units[A.b]; if (t && t.alive){ if (A.bx == null){ A.bx = t.x; A.by = t.y; A.hom = 0; }   /* v8.7.2 공중제비 유도 (살짝) */\n"
    "    let dx = t.x - A.bx, dy = t.y - A.by; const l = Math.hypot(dx, dy), room = 1 - A.hom; if (l > 0.001 && room > 0){ const k = Math.min(1, room / l); dx *= k; dy *= k; if (!boxRock(W, A.tx + dx, A.ty + dy, u.r * 0.9)){ A.tx += dx; A.ty += dy; A.hom += Math.hypot(dx, dy); } }\n"
    "    A.bx = t.x; A.by = t.y; } }\n")
for n, s in P.items():
    open(D + 'rt3_%s.js' % n, 'w', encoding='utf-8').write(s)
# 저장된 수치표: 옛 기본값이면 새 기본값으로
if not os.path.exists(D + 'oldrules_v8710.json'): shutil.copy(D + 'oldrules.json', D + 'oldrules_v8710.json')
O = json.load(open(D + 'oldrules_v8710.json'))
O += [[['charge', 'turn'], [0.6]], [['charge', 'commit'], [1.2]], [['cz', 'spin'], [{'r': 2.6, 'wind': 0.35, 'rec': 0.5, 'mul': 2.0, 'kb': 1.6, 'stun': 0.5, 'frost': 2, 'cd': 8, 'brk': 3}]]]
json.dump(O, open(D + 'oldrules.json', 'w'), ensure_ascii=False)
print('patch8720 OK')
