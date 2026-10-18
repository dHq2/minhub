def rep(path, a, b, n=1):
    s = open(path, encoding='utf8').read(); c = s.count(a)
    assert c == n, (path, a[:80], c); s = s.replace(a, b); open(path, 'w', encoding='utf8').write(s)
T='rt3_tail.js'; P='page10.tpl.html'
# 엔진: 한 번에 최대 (cap)
rep(T, "kit: !!p.skill.kit, pct: +(p.skill.pct || 0.4), cd: +(p.skill.cd || 0), cdT: -9,", "kit: !!p.skill.kit, pct: +(p.skill.pct || 0.4), cap: p.skill.cap != null ? +p.skill.cap : (p.skill.kit ? 100 : null), cd: +(p.skill.cd || 0), cdT: -9,")
rep(T, "    if (revive) rise(W, t, K.pct); else t.hp += Math.max(0, Math.min(Math.round(t.max * K.pct), Math.round(t.max - t.hp)));\n    const amt = revive ? Math.round(t.hp) : Math.round(Math.min(t.max * K.pct, t.hp)); K.left--;",
       "    const hp0 = t.hp, per = Math.min(t.max * K.pct, K.cap != null ? K.cap : Infinity);   // v6.2 비율로 들어가지만 한 번에 cap (100) 을 넘지 않음 — 크거나 체력이 많은 동료는 한계가 있음\n    if (revive) rise(W, t, per / t.max); else t.hp += Math.max(0, Math.min(Math.round(per), Math.round(t.max - t.hp)));\n    const amt = revive ? Math.round(t.hp) : Math.round(t.hp - hp0); K.left--;")
# 페이지: 노먼 응급처치 7번 · 대기 2.2초 · 한 번에 최대 100
rep(P, "const KIT = { name: '응급처치', kit: true, pool: 5, pct: 0.4, cd: 2.5, wind: 0.5, rec: 0.3, rng: 0.8, auto: 0.5 };", "const KIT = { name: '응급처치', kit: true, pool: 7, pct: 0.4, cap: 100, cd: 2.2, wind: 0.5, rec: 0.3, rng: 0.8, auto: 0.5 };   // v6.2 7번 · 대기 2.2초 · 한 번에 최대 100")
s=open(P,encoding='utf8').read()
a="skill: { name: '응급처치', kit: true, pool: 5, pct: 0.4, cd: 2.5,"
print('profile kit', s.count(a))
s=s.replace(a, "skill: { name: '응급처치', kit: true, pool: 7, pct: 0.4, cap: 100, cd: 2.2,")
open(P,'w',encoding='utf8').write(s)
rep(P, "한 번에 최대 체력의 ${Math.round(u.skill.pct * 100)}% · 쓰고 나면 ${u.skill.cd}초 대기", "한 번에 최대 체력의 ${Math.round(u.skill.pct * 100)}%${u.skill.cap != null ? ' (최대 ' + u.skill.cap + ' — 크거나 체력이 많은 동료는 한계)' : ''} · 쓰고 나면 ${u.skill.cd}초 대기")
# 이전: 저장된 노먼 (판 · 설계 · 층) 의 응급처치
rep(P, "  if ((p.ref === 'C-007' || p.ref === 'C-002') && !(p.traits || []).includes('베테랑')){ p.traits = [...(p.traits || []), '베테랑']; ch = true; }\n  return ch; };",
       "  if ((p.ref === 'C-007' || p.ref === 'C-002') && !(p.traits || []).includes('베테랑')){ p.traits = [...(p.traits || []), '베테랑']; ch = true; }\n  return ch; };\n// v6.2 노먼 응급처치: 5번 → 7번 · 대기 2.5 → 2.2초 · 한 번에 최대 100 (한 번만)\nconst fixKit62 = p => { const k = p && p.ref === 'C-007' && p.skill && p.skill.kit ? p.skill : null; if (!k || k.cap != null) return false; if (+k.pool === 5) k.pool = 7; if (+k.cd === 2.5) k.cd = 2.2; k.cap = 100; return true; };\nif (!S.v620k){ for (const u of S.units) fixKit62(u); try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixKit62(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}\n  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fixKit62(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {} S.v620k = true; }")
rep(P, "             판: 더 넓은 개활지 32×20 (적의 진이 횃불 밖에 들어설 자리).", "             노먼 응급처치: 7번 · 대기 2.2초 · 한 번에 최대 체력의 40% 지만 100 을 넘지 않음 (카리우스처럼 크거나 체력이 많은 동료는 한계).\n             판: 더 넓은 개활지 32×20 (적의 진이 횃불 밖에 들어설 자리).")
# 시험용 판도
t=open('t52.js',encoding='utf8').read(); a2="skill:{name:'응급처치',kit:true,pool:5,pct:0.4,cd:2.5,"; print('t52 kit', t.count(a2)); t=t.replace(a2,"skill:{name:'응급처치',kit:true,pool:7,pct:0.4,cap:100,cd:2.2,"); open('t52.js','w',encoding='utf8').write(t)
# 깨진 시험 셋: 조우 전 끄고 1층 (적이 바로 보임)
for f in ['mob5.js','mob7b.js','det56.js']:
    s=open(f,encoding='utf8').read()
    a="await p.evaluate(()=>{ localStorage.clear(); }); await p.reload(); await p.waitForTimeout("
    i=s.index(a); j=s.index(');', i+len(a))+2
    s=s[:j]+" await p.evaluate(()=>{ S.randStart = false; placeFloor('1층'); });"+s[j:]
    open(f,'w',encoding='utf8').write(s)
print('ok')
