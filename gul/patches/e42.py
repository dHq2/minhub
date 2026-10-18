h=open('rt3_head.js').read()
def rh(a,b):
    global h
    assert h.count(a)==1,(a[:80],h.count(a)); h=h.replace(a,b)
rh("""/* ===== 전투 엔진 v4.1 —""","""/* ===== 전투 엔진 v4.2 —""")
rh("""   v3.4: 맵 종류 gridC""","""   v4.2: 기술 (skill): 정해진 총량을 나눠 쓰는 치유 (옐로 '양동이 약' 500). 손 닿는 동료 (자기 자신도) 에게 한 번에 per 만큼.
         평소엔 명령 (order k: 'skill') 으로, 동료 체력이 bucketAuto 아래로 떨어지면 (아주 위급) 명령 없이도 달려가 씀.
   v3.4: 맵 종류 gridC""")
rh("""  reflexCost: 0.6,    // [반사신경] 은 막을 때 자세가 덜 깎임 (×)""","""  reflexCost: 0.6,    // [반사신경] 은 막을 때 자세가 덜 깎임 (×)
  bucketAuto: 0.25,   // 치유 기술: 동료 체력이 이 비율 아래면 '아주 위급' → 명령 없이도 씀
  skillReach: 3,      // 다른 명령을 받고 있어도 위급한 동료가 이 거리 (칸) 안이면 달려가 씀 (자동이면 leash 거리까지)""")
open('rt3_head.js','w').write(h)

s=open('rt3_tail.js').read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:80],s.count(a)); s=s.replace(a,b)
rep("""      sense: {}, briefAt: 0,""","""      skill: p.skill && +p.skill.pool > 0 ? { name: p.skill.name || '치유', pool: +p.skill.pool, left: +p.skill.pool, per: +(p.skill.per || 120), wind: +(p.skill.wind || 0.8), rec: +(p.skill.rec || 0.4), rng: +(p.skill.rng != null ? p.skill.rng : 0.5) } : null,
      sense: {}, briefAt: 0,""")
# startSkill + emergency after startAct
rep("""function resolveAct(W, u){
  const A = u.act, t = W.units[A.b], R = W.rules;""","""// v4.2 기술 (치유): 준비 (붓는 중, 못 움직임) → 회복량만큼 총량에서 덜어 냄 → 잠깐 회복
function startSkill(W, u, t, auto){
  u.act = { k: 'skill', b: t.i, phase: 'wind', t0: W.t, end: W.t + u.skill.wind, why: auto ? '위급' : '', auto: !!auto };
  if (t !== u) u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u);
  setMood(W, u, auto ? '응급' : '치유', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, heal: true, skill: u.skill.name, auto: !!auto, end: +(W.t + u.skill.wind).toFixed(2) });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: u.skill.wind, heal: true });
}
function resolveSkill(W, u){
  const A = u.act, t = W.units[A.b], K = u.skill, R = W.rules;
  if (A.phase !== 'wind'){ u.act = null; return; }
  let why = '';
  if (!t.alive) why = '대상이 이미 쓰러짐';
  else if (t !== u && gap(u, t) > K.rng + R.reach) why = `손이 안 닿음 (${gap(u, t).toFixed(1)}칸 떨어짐)`;
  else if (K.left <= 0) why = '약이 다 떨어짐';
  if (why) L(W, { k: 'miss', a: u.i, b: t.i, why, skill: K.name });
  else {
    const amt = Math.max(0, Math.min(K.per, K.left, Math.round(t.max - t.hp)));
    t.hp += amt; K.left -= amt; u.healed += amt;
    L(W, { k: 'skill', a: u.i, b: t.i, amt, hp: Math.round(t.hp), left: K.left, name: K.name, auto: A.auto });
    if (W.fxOn){ W.fx.push({ k: 'shot', a: u.i, b: t.i, t0: W.t, dur: 0.25, heal: true }); W.fx.push({ k: 'num', x: t.x, y: t.y, s: '+' + amt, c: 'h', t0: W.t }); }
  }
  A.phase = 'rec'; A.end = W.t + K.rec; A.t1 = W.t;
}
// 아주 위급 (체력 bucketAuto 아래) 한 동료가 가까이 있으면 명령 없이도 달려가 씀
function emergency(W, u, dt){
  const K = u.skill; if (!K || K.left <= 0) return false;
  const R = W.rules, far = u.side === 0 && u.order ? R.skillReach : R.leash;
  const v = W.units.filter(a => a.alive && a.side === u.side && a.hp < a.max * R.bucketAuto && dist(a, u) <= far).sort((a, b) => a.hp / a.max - b.hp / b.max)[0];
  if (!v) return false;
  if (v === u || gap(u, v) <= K.rng){ startSkill(W, u, v, true); return true; }
  setMood(W, u, '응급', v.i); goTo(W, u, v.x, v.y, dt); return true;
}
function resolveAct(W, u){
  if (u.act.k === 'skill'){ resolveSkill(W, u); return; }
  const A = u.act, t = W.units[A.b], R = W.rules;""")
# order skill
rep("""  if (o.k === 'hold'){
    // 제자리 = 지키는 자세""","""  if (o.k === 'skill'){
    // 기술 명령: 그 동료에게 가서 한 번 씀 (체력이 가득이면 아낌). 쓴 뒤엔 제자리
    const t = W.units[o.b], K = u.skill;
    if (!K || !t || !t.alive || K.left <= 0){ u.order = { k: 'hold' }; return; }
    if (t.hp >= t.max - 0.5){ L(W, { k: 'skillSkip', a: u.i, b: t.i }); u.order = { k: 'hold' }; return; }
    if (t === u || gap(u, t) <= K.rng){ startSkill(W, u, t, false); u.order = { k: 'hold' }; return; }
    setMood(W, u, '치유하러', t.i); goTo(W, u, t.x, t.y, dt); return;
  }
  if (o.k === 'hold'){
    // 제자리 = 지키는 자세""")
rep("""function act2(W, u, dt){
  if (u.side === 0 && u.order){ doOrder(W, u, dt); return; }""","""function act2(W, u, dt){
  if (u.skill && emergency(W, u, dt)) return;
  if (u.side === 0 && u.order){ doOrder(W, u, dt); return; }""")
rep("""const orderTxt = o => !o ? ['auto'] : o.k === 'move' ? ['move', +o.x.toFixed(2), +o.y.toFixed(2)] : o.k === 'attack' ? ['attack', o.b] : ['hold'];""","""const orderTxt = o => !o ? ['auto'] : o.k === 'move' ? ['move', +o.x.toFixed(2), +o.y.toFixed(2)] : o.k === 'attack' ? ['attack', o.b] : o.k === 'skill' ? ['skill', o.b] : ['hold'];""")
rep("""      mood: u.mood || '', ammo: u.ammo,""","""      mood: u.mood || '', ammo: u.ammo, skill: u.skill ? u.skill.left : null,""")
open('rt3_tail.js','w').write(s)
print('ok')
