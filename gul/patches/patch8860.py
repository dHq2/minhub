# v8.8.6 엔진 — patch8860.py v1.0 (v1.0: 영거리 사격 — 민수 "총이나 화살류가 지근거리에서 더 효과를 받는 영거리 사격 판정" · 샷건 알갱이가 판금에 2~3 만 뜨던 것)
#   rules.pb: 무기 종류별 (총포류 · 활) r = 영향 거리 (칸, 몸 사이 틈) · k = 코앞 (틈 0) 에서 관통력에 더하는 비율. 관통력 P × (1 + k × (1 − 틈 / r)). 무기 칸에 pb 가 있으면 그것이 먼저 (샷건)
#   기존 관통 판정 (penPower · penRes · 방패 관통) 에 그대로 얹음 — 확률은 원래 있던 ±15% 흔들림이 그대로. 곡사 · 투창 · 마법은 제외. 적 · 아군 똑같이
import subprocess, json, os
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
subprocess.run(['python3', D + 'patch8850.py'], check=True)
def load(n): return open(D + 'rt3_%s.js' % n, encoding='utf-8').read()
P = {'head': load('head'), 'mid': load('mid'), 'tail': load('tail')}
def rep(a, b, c=1):
    n = sum(v.count(a) for v in P.values())
    assert n == c, (n, c, a[:110])
    for k in P: P[k] = P[k].replace(a, b)
T = dict(gr=2.0, gk=0.8, br=1.8, bk=0.5, sr=2.4, sk=2.0)
T.update(json.loads(os.environ.get('PB', '{}')))
# 수치표
rep("rnd: 0.15, bow: { S: 1.25, A: 1.1 } },", "rnd: 0.15, bow: { S: 1.25, A: 1.1 }, pb: { '총포류': { r: %s, k: %s }, '활': { r: %s, k: %s } } },   /* v8.8.6 영거리 사격 */" % (T['gr'], T['gk'], T['br'], T['bk']))
rep("kind:'총포류', pen:1, penK:0.5, jit:0.1, near:{r:2.2, mul:3.2, kb:1.5}}", "kind:'총포류', pen:1, penK:0.5, jit:0.1, near:{r:2.2, mul:3.2, kb:1.5}, pb:{r:%s, k:%s}}" % (T['sr'], T['sk']))
# 관통력: 거리 보정
rep("function penPower(W, u, J, pw, extra, arcX){ const PN = W.rules.pen; let P =",
    "function pbMul(W, u, t, J, pw, arcX){   /* v8.8.6 영거리 사격: 몸 사이 틈이 좁을수록 관통력 ↑ (총 · 활만 · 곡사 제외) */\n  if (J || arcX || !t || !pw || (pw.kind !== '총포류' && pw.kind !== '활')) return 1; const B = (W.rules.pen.pb || {})[pw.kind], Q = pw.pb || B; if (!Q || !Q.r) return 1;\n  const g = Math.max(0, Math.hypot(t.x - u.x, t.y - u.y) - (u.r || 0) - (t.r || 0)); return 1 + Q.k * Math.max(0, 1 - g / Q.r); }\nfunction penPower(W, u, J, pw, extra, arcX, t){ const PN = W.rules.pen; let P =")
rep("  return P * (extra && extra.pm ? extra.pm : 1) * (arcX ? PN.arc || 0.8 : 1) * (1 - (PN.rnd || 0) + 2 * (PN.rnd || 0) * W.rand()); }",
    "  return P * (extra && extra.pm ? extra.pm : 1) * (arcX ? PN.arc || 0.8 : 1) * pbMul(W, u, t, J, pw, arcX) * (1 - (PN.rnd || 0) + 2 * (PN.rnd || 0) * W.rand()); }")
rep("gun = !J && pw.kind === '총포류', P = penPower(W, u, J, pw, extra, arcX);", "gun = !J && pw.kind === '총포류', P = penPower(W, u, J, pw, extra, arcX, t), pbm = pbMul(W, u, t, J, pw, arcX);")
rep("  if (P > A) return { pen: true, m: Math.max(0.45, Math.min(1, 0.45 + (P - A) / P)), P, A, how };",
    "  if (P > A) return { pen: true, m: Math.max(0.45, Math.min(1, 0.45 + (P - A) / P)), P, A, how, pb: pbm > 1.05 && P / pbm <= A ? +pbm.toFixed(2) : 0 };   /* v8.8.6 pb = 영거리가 아니면 못 뚫었을 것을 뚫음 */")
rep("const PN = R.pen, P = penPower(W, u, J, pw, extra, arcX), A = (t.armShield", "const PN = R.pen, P = penPower(W, u, J, pw, extra, arcX, t), A = (t.armShield")
rep("else if (PNR.how) o.gapHow = PNR.how; }", "else if (PNR.how) o.gapHow = PNR.how; if (PNR.pb){ o.pb = PNR.pb; o.tag = o.tag || '영거리 사격 — 갑옷을 뚫음 (관통 ' + o.P + ' > 방호 ' + o.A + ')'; } }")
for k in P: open(D + 'rt3_%s.js' % k, 'w', encoding='utf-8').write(P[k])
# 저장된 수치표: pen 에 pb 가 없던 옛 표 / 옛 샷건 표
O = json.load(open(D + 'oldrules.json'))
old = {"rng": 2.5, "cone": {"n": 5, "ang": 0.32, "mul": 0.4}, "ammo": 4, "loud": True, "aim": 0.6, "aimK": 0.2, "recK": 0.55, "vel": 220, "P": 55, "draw": 0.02, "kind": "총포류", "pen": 1, "penK": 0.5, "jit": 0.1, "near": {"r": 2.2, "mul": 3.2, "kb": 1.5}}
if not any(p == ['weapons', '샷건'] and old in v for p, v in O): O.append([['weapons', '샷건'], [old]])
json.dump(O, open(D + 'oldrules.json', 'w'), ensure_ascii=False)
print('patch8860 OK', T)
