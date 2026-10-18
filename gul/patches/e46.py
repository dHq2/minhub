h=open('rt3_head.js').read()
def rh(a,b):
    global h
    assert h.count(a)==1,(a[:80],h.count(a)); h=h.replace(a,b)
rh("""/* ===== 전투 엔진 v4.5 —""","""/* ===== 전투 엔진 v4.6 —""")
rh("""   v4.5: 탱커""","""   v4.6: 등급 특성 [속력X] (이동 속력 ×) · [괴력X] (공격 ×, 막힐 때 상대 자세를 더 깎음) — X = S · A · B · C (grades 표).
         무기 종류 (kind): 날붙이 · 둔기 · 맨손 · 짐승 · 총포류 · 활 · 마법. 날붙이 판정 (bladeHands) 이면 맨손 · 발톱이어도 날붙이 — 암살 치명상이 됨.
         제약 (제약:총포류 · 제약:활 …) 은 화면이 무기 고르기에서 막음. ◆고유특성 (하나뿐) 은 화면이 파생특성 · 제약 · 판정으로 풀어 엔진에 넘김.
   v4.5: 탱커""")
rh("""  weapons: { '맨손':{rng:0.3}, '이빨·발톱':{rng:0.3}, '단검':{rng:0.3}, '검':{rng:0.45}, '둔기':{rng:0.45}, '장검':{rng:0.6}, '대검':{rng:0.7, guard:true}, '창':{rng:1.0},
             '샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:45}, '마법':{rng:4, aim:0.6, vel:12}, '총':{rng:5, ammo:8, loud:true, vel:60}, '활':{rng:6, ammo:12, aim:0.5, vel:16}, '저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:80} },""",
"""  weapons: { '맨손':{rng:0.3, kind:'맨손'}, '이빨·발톱':{rng:0.3, kind:'짐승'}, '단검':{rng:0.3, kind:'날붙이'}, '검':{rng:0.45, kind:'날붙이'}, '둔기':{rng:0.45, kind:'둔기'}, '장검':{rng:0.6, kind:'날붙이'}, '대검':{rng:0.7, guard:true, kind:'날붙이'}, '창':{rng:1.0, kind:'날붙이'},
             '샷건':{rng:2.5, ammo:4, loud:true, aim:0.6, vel:45, kind:'총포류'}, '마법':{rng:4, aim:0.6, vel:12, kind:'마법'}, '총':{rng:5, ammo:8, loud:true, vel:60, kind:'총포류'}, '활':{rng:6, ammo:12, aim:0.5, vel:16, kind:'활'}, '저격총':{rng:7, ammo:5, loud:true, aim:0.8, vel:80, kind:'총포류'} },
  // 등급 특성: [속력A] = 이동 속력 ×, [괴력B] = 공격 × (막힐 때 상대 자세도 그만큼 더 깎음)
  grades: { '속력': { S: 1.35, A: 1.2, B: 1.1, C: 1.05 }, '괴력': { S: 1.6, A: 1.45, B: 1.3, C: 1.15 } },""")
open('rt3_head.js','w').write(h)
s=open('rt3_tail.js').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:80],s.count(a)); s=s.replace(a,b)
rep("""function statsOf(p, rules){
  const T = rules.tiers[p.tier] || rules.tiers[1], C = rules.classes[p.cls] || rules.classes['근접'], o = p.ov || {};""","""// 등급 특성 [속력A] · [괴력B] … 의 배율 (없으면 1)
function gradeMul(rules, traits, key){ for (const t of traits || []) if (t.length === key.length + 1 && t.startsWith(key)){ const g = rules.grades && rules.grades[key]; return (g && g[t.slice(-1)]) || 1; } return 1; }
function statsOf(p, rules){
  const T = rules.tiers[p.tier] || rules.tiers[1], C = rules.classes[p.cls] || rules.classes['근접'], o = p.ov || {};""")
rep("""    atk: o.atk != null ? o.atk : Math.max(1, Math.round(T.atk * C.atk * (p.am || 1))),   // am = 인물 공격 배율""","""    atk: o.atk != null ? o.atk : Math.max(1, Math.round(T.atk * C.atk * (p.am || 1) * gradeMul(rules, p.traits, '괴력'))),   // am = 인물 공격 배율, [괴력X]""")
rep("""    spd: o.spd != null ? o.spd : +(C.spd * (p.sm || 1)).toFixed(2),""","""    spd: o.spd != null ? o.spd : +(C.spd * (p.sm || 1) * gradeMul(rules, p.traits, '속력')).toFixed(2),""")
rep("""      quad: (p.traits || []).includes('사족보행'), quadOn: false, quadLogT: -9,""","""      quad: (p.traits || []).includes('사족보행'), quadOn: false, quadLogT: -9,
      bladeHands: !!p.bladeHands, strMul: gradeMul(rules, p.traits, '괴력'),   // 날붙이 판정 · 괴력 (막힐 때 상대 자세를 더 깎음)""")
rep("""    t.post -= R.postCost * (t.gCost || 1); t.blockT = W.t; t.blocked++;""","""    t.post -= R.postCost * (t.gCost || 1) * (o.far ? 1 : u.strMul || 1); t.blockT = W.t; t.blocked++;""")
rep("""  const amb = !o.far && dir !== 'front' && !NO_AMBUSH.includes(u.weaponNow || u.weapon) && !aware(W, t, u);""","""  const amb = !o.far && dir !== 'front' && (u.bladeHands || !NO_AMBUSH.includes(u.weaponNow || u.weapon)) && !aware(W, t, u);   // 날붙이 판정이면 맨손 · 발톱이어도 암살""")
rep("""ff: !!o.ff, meant: o.meant, p: o.p, far: o.far, ambush: !!o.ambush });""","""ff: !!o.ff, meant: o.meant, p: o.p, far: o.far, ambush: !!o.ambush, blade: !o.far && !!u.bladeHands });""")
s=s.replace("module.exports = { tankAI,","module.exports = { gradeMul, tankAI,")
open('rt3_tail.js','w').write(s)
print('ok')
