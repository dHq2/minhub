import sys
def check(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs:
        if s.count(o)!=1: print('MISMATCH',p,s.count(o),o[:140]); sys.exit(1)
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for o,n in pairs: s=s.replace(o,n)
    open(p,'w',encoding='utf-8').write(s)
H=[
("/* ===== 전투 엔진 v5.5.4 —", "/* ===== 전투 엔진 v5.6 —"),
("""   v5.5.4: 전력질주는 방향을 잘 못 틂""", """   v5.6: 줍기 · 회수 — 쓰러지면 들고 있던 무기 · 방패가 땅에 떨어짐 (방패 팔 · 두 팔 · 활 팔을 잃어도). 창 · 검 · 방패 · 활 · 총 (남은 탄과 함께) 을 주울 수 있음:
         명령 (고른 아군이 떨어진 물건을 누르거나 E) 이면 그리로 가서 집어 들고, 무기가 없는 쪽은 안전할 때 스스로 (5칸 안). 다른 무기를 집으면 들던 무기는 발밑에.
         방패 = 왼팔이 있고 두 손 원거리 무기를 안 들었을 때 (방패를 들면 방어 자세 · 밀치기 · 방패 돌진). 투구 · 갑옷은 나중에 (루팅).
   v5.5.4: 전력질주는 방향을 잘 못 틂"""),
]
T=[
# 죽으면 떨어뜨림
("""    else { u.kills++; if (!o.ff) W.kills[u.side]++; L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff, last: !!t.undying }); }""",
 """    else { u.kills++; if (!o.ff) W.kills[u.side]++; L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff, last: !!t.undying }); dropOnDeath(W, t); }   // v5.6 무기 · 방패가 땅에"""),
# 팔을 잃으면 떨어뜨림
("""    t.noArms = true; t.canGuard = false; t.canBash = false; t.jav = false; t.spearHeld = false; t.skill = null;""",
 """    dropHeld(W, t, 'arms'); dropShield(W, t, 'arms');   // v5.6 무기 · 방패가 땅에
    t.noArms = true; t.canGuard = false; t.canBash = false; t.jav = false; t.spearHeld = false; t.skill = null;"""),
("""  } else if (wp.kind === '활' && isFar(t)){
    t.rng""", """  } else if (wp.kind === '활' && isFar(t)){
    dropHeld(W, t, 'arm');   // v5.6 활을 떨어뜨림
    t.rng"""),
("""    t.shield = false; t.shieldLost = true; t.canGuard = !!wp.guard; t.canBash = false; eff.push('방패를 놓침');""",
 """    dropShield(W, t, 'arm'); t.shieldLost = true; t.canGuard = !!wp.guard; t.canBash = false; eff.push('방패를 놓침');   // v5.6 방패가 땅에"""),
# 던진 창: id
("""  W.items.push({ k: 'spear', x: +x.toFixed(2), y: +y.toFixed(2), owner: s.a, name: s.wpn || '창', t: W.t });""",
 """  W.items.push({ id: (W.itemN = (W.itemN || 0) + 1), k: W.units[s.a] && W.units[s.a].alive ? 'spear' : 'weapon', x: +x.toFixed(2), y: +y.toFixed(2), owner: s.a, name: s.wpn || '창', t: W.t });   // v5.6 id · 주인이 쓰러졌으면 누구나"""),
("""// 땅에 떨어진 창: 바위 안이면 날아온 쪽으로 물려 놓음""", open('items_block.js',encoding='utf-8').read() + """// 땅에 떨어진 창: 바위 안이면 날아온 쪽으로 물려 놓음"""),
# 줍기 명령 (물건 id)
("""  if (o.k === 'pick' && o.spear){""", """  if (o.k === 'pick' && o.id != null){   // v5.6 떨어진 물건 줍기 (명령이면 둘레가 위험해도)
    const it = W.items.find(x => x.id === o.id);
    if (!it || !canTake(W, u, it)){ if (it) L(W, { k: 'lost', a: u.i, b: u.i, why: '못 집음 (' + it.name + ')' }); u.order = null; return; }
    if (Math.hypot(it.x - u.x, it.y - u.y) <= 0.6){ takeItem(W, u, it); u.order = null; u.stay = { x: u.x, y: u.y }; return; }
    setMood(W, u, it.name + ' 주우러'); goTo(W, u, it.x, it.y, dt); return;
  }
  if (o.k === 'pick' && o.spear){"""),
# 자동: 무기가 없으면 줍기
("""  if (!u.order && u.jav && !u.spearHeld && retrieveSpear(W, u, dt)) return;""", """  if (!u.order && u.jav && !u.spearHeld && retrieveSpear(W, u, dt)) return;
  if (!u.order && scavenge(W, u, dt)) return;   // v5.6 무기가 없으면 안전할 때 주움"""),
("""    if (retrieveSpear(W, u, dt)) return;
    if (behindCover(W, u, dt)) return;""", """    if (retrieveSpear(W, u, dt)) return;
    if (scavenge(W, u, dt)) return;   // v5.6
    if (behindCover(W, u, dt)) return;"""),
("""o.k === 'pick' && o.spear ? ['pickSpear'] :""", """o.k === 'pick' && o.id != null ? ['pickItem', o.id] : o && o.k === 'pick' && o.spear ? ['pickSpear'] :"""),
("""if (typeof module !== 'undefined') module.exports = { startCharge,""", """if (typeof module !== 'undefined') module.exports = { canTake, takeItem, setWeapon, dropItem, dropOnDeath, scavenge, unarmed, startCharge,"""),
]
check('rt3_head.js',H); check('rt3_tail.js',T)
patch('rt3_head.js',H); patch('rt3_tail.js',T)
print('ok')
