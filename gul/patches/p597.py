import re
def rep(path, a, b, n=1):
    s = open(path, encoding='utf8').read(); c = s.count(a)
    assert c == n, (path, a[:60], c); s = s.replace(a, b); open(path, 'w', encoding='utf8').write(s)
T = 'rt3_tail.js'; P = 'page10.tpl.html'
rep(T, "shield: !!p.shield, smellG", "shield: !!p.shield, kit0: { weapon: p.weapon || '', shield: !!p.shield }, smellG")
rep(P, "function logHeader(Wd, title){", """// v5.9.7 로그 머리 인물표 = 판을 시작할 때 든 것. 쓰러지며 떨어뜨렸거나 주워 바뀌었으면 → 지금 … 을 덧붙임
const startKit = u => u.kit0 ? Object.assign({}, u, { weapon: u.kit0.weapon, shield: u.kit0.shield, weaponNow: null, weaponGone: false, act: null }) : u;
const kitNow = u => { const k = u.kit0; if (!k) return ''; const w = u.weaponGone ? '맨손' : (u.weaponNow || u.weapon || '맨손'); return w !== (k.weapon || '맨손') || !!u.shield !== k.shield ? ` → 지금 ${w} + ${u.shield ? '방패' : '방패 없음'}` : ''; };
function logHeader(Wd, title){""")
rep(P, "든 것 ${u.weapon || '맨손'} + ${u.shield ? '방패' : '방패 없음'}", "든 것 ${startKit(u).weapon || '맨손'} + ${startKit(u).shield ? '방패' : '방패 없음'}${kitNow(u)}")
rep(P, "guardArc(Wd, u)) + '° (' + guardName(u) + ')'", "guardArc(Wd, startKit(u))) + '° (' + guardName(startKit(u)) + ')'")
# 버전 5곳
s = open(P, encoding='utf8').read(); print('v5.9.6 count', s.count('v5.9.6'))
