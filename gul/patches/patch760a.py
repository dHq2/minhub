p='rt3_tail.js'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(a[:70],c); s=s.replace(a,b)

# 1. stealthK: 어둠 속 우회 (stalk) 도 숨음
rep("""  if (!(t.stealth || t.lurk) || !t.stealthE""","""  if (!(t.stealth || t.lurk || t.stalk) || !t.stealthE""")

# 2. 암살 함수 묶음 (stealthK 다음)
rep("""// 지금 낼 수 있는 속력: 다리 상처""","""// v7.6 암살: 숨은 채 (은신 · 매복 · 어둠 속 우회) 아무에게도 들키지 않고 · 상대가 알아채지 못하고 · 경계가 강하지 않을 때 등 뒤를 잡으면 소리 없이 숨을 끊음 (아군 · 적 같음)
const ASN = W => W.rules.assn;
function assnSkill(W, u){ const A = ASN(W); if (!A) return 0; const tr = u.traits || [], vg = (tr.find(x => /^급소[SABC]$/.test(x)) || '').slice(2);
  const s = ((A.cls || {})[u.cls] != null ? A.cls[u.cls] : 0.6) * Math.sqrt(u.stealthE || 0) * (u.vet ? A.vet || 1 : 1) * (vg ? (A.vital || {})[vg] || 1 : 1) * (tr.includes('일반인') ? A.layman || 1 : 1) * (u.giant || u.modBody ? A.giant || 0.25 : 1);
  return Math.max(0, Math.min(A.max || 0.95, s)); }
// 경계: 우리 편을 알고 있음 · 곁의 동료 (결집) · 경계 자세 · 초병 · 두리번거림 (수색 · 방금 맞음). 다른 상대와 맞붙어 손이 묶였으면 덜함. 앎 + 동료 둘 이상 + 경계 = 불가능
function assnVigil(W, t, a){
  const A = ASN(W) || {}, why = []; let v = 0;
  const know = t.side === 1 ? !!W.alarm1 || t.state === 'hunt' || t.state === 'search' : W.units.some(e => e.alive && e.side !== t.side && (e.seenBy || fresh(W, t.sense[e.i])));
  if (know){ v += A.know || 0; why.push('알고 있음'); }
  const n = W.units.filter(o => o.alive && !o.down && o !== t && o.side === t.side && dist(o, t) <= (A.near || 2.5)).length;
  if (n){ v += Math.min(A.clusterMax || 0.45, n * (A.cluster || 0.15)); why.push('곁에 동료 ' + n); }
  const f = focusOf(W, t), busy = !!(f && f !== a && f.alive && f.side !== t.side && gap(t, f) < (t.rng || 0.5) + 0.6);
  const grd = guardOn(W, t) || t.guardMode === 'hold' || !!t.sentry;
  if (grd){ v += A.guard || 0; why.push(t.sentry ? '초병' : '경계 자세'); }
  const look = !busy && (t.state === 'search' || W.t - (t.hitT == null ? -9 : t.hitT) < (A.hitT || 3));
  if (look){ v += A.search || 0; why.push('두리번거림'); }
  if (busy){ v -= A.busy || 0; why.push('다른 상대에 묶임'); }
  return { v: Math.max(0, Math.min(1, v)), why, no: know && n >= 2 && (grd || look), n, know };
}
// 지금 이 자리에서 암살할 수 있나: ok · 확률 p · 까닭 why (loose = 자리 · 숨음은 보지 않음 — 노릴 만한가)
function assnCan(W, a, t, loose){
  const A = ASN(W);
  if (!A || AI6.includes('assn') || !(a.assnE > 0)) return { ok: false, why: '암살 솜씨 없음' };
  if (!t || !t.alive || t.down || t.side === a.side) return { ok: false, why: '대상 없음' };
  if (t.giant || t.modBody || t.bodyShield || t.max >= (A.big || 300)) return { ok: false, why: '한 번에 끊을 수 없는 몸' };
  if (!loose){
    if (!(a.stealth || a.lurk || a.stalk) || stealthK(W, a) >= 1) return { ok: false, why: '숨지 않음' };
    if ((t.heads || 1) > 1 || sideOf(W, t, a) !== 'back') return { ok: false, why: '등 뒤가 아님' };
    if (gap(a, t) > (isFar(a) ? A.knife || 0.35 : a.rng + W.rules.reach)) return { ok: false, why: '손이 안 닿음' };
  }
  if (aware(W, t, a)) return { ok: false, why: '알아챔' };
  const eye = W.units.find(o => o.alive && !o.down && o !== t && o.side === t.side && canSee(W, o, a) && ((o.heads || 1) > 1 || sideOf(W, o, a) !== 'back'));
  if (eye) return { ok: false, why: '보는 눈 (' + eye.name + ')', eye: eye.i };
  const V = assnVigil(W, t, a);
  if (V.no) return { ok: false, why: '결집 · 경계 (' + V.why.join(' · ') + ')', V };
  const p = a.assnE * (1 - V.v) * (a.exhausted ? 0.8 : 1);
  return { ok: p > 0.01, p, V, why: V.why.join(' · ') };
}
function startAssn(W, u, t, AS){
  const A = ASN(W) || {}, wind = (A.wind || 0.45) * (u.injWind || 1);
  u.act = { k: 'assn', b: t.i, phase: 'wind', t0: W.t, end: W.t + wind, why: '암살', p: AS.p };
  u.fg = Math.atan2(t.y - u.y, t.x - u.x); stop(u); u.waitT = 0;
  setMood(W, u, '암살', t.i);
  L(W, { k: 'wind', a: u.i, b: t.i, assn: true, p: +AS.p.toFixed(2), w: isFar(u) ? '단검' : u.weaponNow || u.weapon || '', end: +(W.t + wind).toFixed(2), hid: u.side === 1 && !u.seenBy, why: '암살' });
  if (W.fxOn) W.fx.push({ k: 'wind', a: u.i, b: t.i, t0: W.t, dur: wind, assn: true });
}
// 준비 끝: 다시 봄 (그새 돌아섰나 · 누가 봤나) → 성공이면 소리 없이 숨을 끊음 (소음 · 비명 · 경보 없음, 드러나지 않음). 실패면 몸부림 — 기습 일격 · 외침 · 들킴
function resolveAssn(W, u){
  const A = u.act, t = W.units[A.b], AR = ASN(W) || {};
  if (A.phase !== 'wind'){ u.act = null; return; }
  A.phase = 'rec'; A.t1 = W.t; A.end = W.t + (AR.rec || 0.5);
  if (!t || !t.alive || t.down){ L(W, { k: 'miss', a: u.i, b: A.b, why: '대상이 이미 쓰러짐' }); return; }
  if (gap(u, t) > (isFar(u) ? AR.knife || 0.35 : u.rng) + W.rules.reach){ u.miss++; L(W, { k: 'miss', a: u.i, b: t.i, why: `손이 안 닿음 (${gap(u, t).toFixed(1)}칸 떨어짐)` }); return; }
  const AS = assnCan(W, u, t);
  if (AS.ok && W.rand() < AS.p){
    u.assnN = (u.assnN || 0) + 1; t.assnBy = u.i; t.assnT = W.t;
    L(W, { k: 'assn', a: u.i, b: t.i, p: +AS.p.toFixed(2), hp: Math.round(t.hp), why: AS.why || '', hid: u.side === 1 && !u.seenBy });
    applyDmg(W, u, t, Math.ceil(t.hp) + 1, { dir: 'back', far: false, silent: true, assn: true, part: '목', tag: '소리 없이 숨을 끊음 (암살)', death: 'assn' });
    assnWitness(W, u, t);
    return;
  }
  u.revealT = W.t;
  L(W, { k: 'assnFail', a: u.i, b: t.i, p: AS.ok ? +AS.p.toFixed(2) : 0, why: AS.ok ? '몸부림' : AS.why, hid: u.side === 1 && !u.seenBy });
  if (!evadeMelee(W, t, u)) strike(W, u, t, t, 1, false, isFar(u) ? { mul: AR.knifeMul || 0.6 } : null);
  if (W.rules.din) dinAdd(W, t.x, t.y, W.rules.din.shout || 1.5);   // 외침
  for (const o of W.units) if (o.alive && o !== t && o.side === t.side && dist(o, t) <= hearR(W, o, t)) o.sense[u.i] = { x: u.x + (W.rand() - 0.5), y: u.y + (W.rand() - 0.5), t: W.t, exact: false, scream: true };
}
// 쓰러지는 걸 본 동료 (앞 · 옆으로 피해자를 봄) → 그쪽을 경계 · 수색 (적은 경보)
function assnAlarm(W, o, t, u){
  if (u && u.alive) o.sense[u.i] = { x: t.x + (W.rand() - 0.5) * 1.5, y: t.y + (W.rand() - 0.5) * 1.5, t: W.t, exact: false, corpse: true };
  if (o.side !== 1) return;
  if (o.state !== 'hunt'){ o.state = 'search'; o.last = { x: t.x, y: t.y }; o.searchT = 6; }
  if (!W.alarm1){ W.alarm1 = { t: W.t, by: o.i, b: u ? u.i : t.i, x: t.x, y: t.y, surprise: surpriseEst(W) }; L(W, { k: 'sentry', side: 1, a: o.i, b: u ? u.i : t.i, sentry: !!o.sentry, patrol: !!o.patrol, surprise: W.alarm1.surprise, corpse: true, d: +dist(o, t).toFixed(1), vis: true }); }
}
const assnEye = (W, o, t) => o.alive && !o.down && o !== t && o.side === t.side && canSee(W, o, t) && ((o.heads || 1) > 1 || sideOf(W, o, t) !== 'back');
function assnWitness(W, u, t){
  for (const o of W.units){ if (!assnEye(W, o, t)) continue; t.assnFound = true;
    L(W, { k: 'assnSeen', a: o.i, b: t.i, by: u.i, see: canSee(W, o, u), hid: o.side === 1 && !o.seenBy }); assnAlarm(W, o, t, u); }
}
// 시신 발견: 암살당한 몸을 동료가 (앞 · 옆으로) 보면 그때 앎
function assnFoundTick(W){
  if (!ASN(W)) return;
  for (const t of W.units){ if (t.alive || t.assnT == null || t.assnFound) continue;
    const o = W.units.find(o => assnEye(W, o, t)); if (!o) continue; t.assnFound = true;
    L(W, { k: 'assnFound', a: o.i, b: t.i, sec: +(W.t - t.assnT).toFixed(1), hid: o.side === 1 && !o.seenBy }); assnAlarm(W, o, t, W.units[t.assnBy]); }
}
// 등 뒤로 숨어 다가감: 상대가 바라보는 반대쪽 (몸 + 손 닿는 거리). 앞 · 옆 가까이면 옆으로 크게 돌아 들어감. 등 뒤 · 손 닿으면 'go' (암살 시작), 못 하면 까닭
function assnStep(W, u, t, dt){
  const A = ASN(W) || {}, sd = sideOf(W, t, u), rch = isFar(u) ? A.knife || 0.35 : u.rng + W.rules.reach * 0.5;
  if (sd === 'back' && gap(u, t) <= rch){ const AS = assnCan(W, u, t); if (AS.ok){ startAssn(W, u, t, AS); return 'go'; } return AS.why; }
  const d0 = t.r + u.r + Math.min(rch, 0.5) * 0.5; let gx = t.x - Math.cos(t.face) * d0, gy = t.y - Math.sin(t.face) * d0;
  if (sd === 'front' || (sd === 'side' && dist(u, t) < 2.2)){
    const cw = Math.sin(Math.atan2(u.y - t.y, u.x - t.x) - t.face) >= 0 ? 1 : -1, a2 = t.face + cw * (sd === 'front' ? 1.9 : 2.6), r2 = Math.max(2, Math.min(3, dist(u, t)));
    const x2 = t.x + Math.cos(a2) * r2, y2 = t.y + Math.sin(a2) * r2;
    if (x2 > 0.6 && y2 > 0.6 && x2 < W.map.W - 0.6 && y2 < W.map.H - 0.6 && !boxRock(W, x2, y2, u.r)){ gx = x2; gy = y2; }
  }
  setMood(W, u, '숨어 등 뒤로', t.i); goTo(W, u, gx, gy, dt); u.fg = Math.atan2(t.y - u.y, t.x - u.x);
  return 'move';
}
// 들킴: 상대 누구라도 앞 · 옆으로 나를 봄
const assnSpotted = (W, u) => W.units.find(e => e.alive && !e.down && e.side !== u.side && canSee(W, e, u) && ((e.heads || 1) > 1 || sideOf(W, e, u) !== 'back'));
// 암살 명령 (아군): 숨어서 (은신을 켬) 그 상대의 등 뒤로 → 손 닿으면 처치. 들키거나 · 놓치거나 · 경계가 풀리지 않으면 그만두고 자동 전투
function assnOrder(W, u, dt){
  const o = u.order, t = W.units[o.b], A = ASN(W) || {};
  if (!o.on){ o.on = true; o.st0 = !!u.stealth; o.t0 = W.t; u.stealth = true; L(W, { k: 'assnGo', a: u.i, b: o.b, e: +(u.assnE || 0).toFixed(2), vis: true }); }
  const end = (why, keep) => { if (!keep) u.stealth = o.st0; u.order = null; u.stay = { x: u.x, y: u.y }; if (why) L(W, { k: 'assnAbort', a: u.i, b: o.b, why, vis: true }); };
  if (!t || !t.alive || t.down){ end(t && t.assnBy === u.i ? '' : '대상이 쓰러짐', t && t.assnBy === u.i); return; }   // 해냄 → 숨은 채 그 자리 (자동)
  if (!(u.assnE > 0) || !ASN(W)){ end('암살 솜씨 없음'); return; }
  const sp = assnSpotted(W, u);
  if (sp && W.t - o.t0 > 0.3){ end('들킴 (' + sp.name + ')'); return; }
  if (W.t - o.t0 > (A.ordMax || 30)){ end('시간이 너무 걸림'); return; }
  const see = canSee(W, u, t) || (u.side === 0 && !!t.seenBy);
  if (see) o.last = { x: t.x, y: t.y };
  else { if (!o.last || Math.hypot(o.last.x - u.x, o.last.y - u.y) < 0.4){ end('대상을 놓침'); return; } setMood(W, u, '숨어 찾음', t.i); goTo(W, u, o.last.x, o.last.y, dt); return; }
  const r = assnStep(W, u, t, dt);
  if (r === 'go' || r === 'move'){ o.blockT = null; return; }
  if (o.blockT == null) o.blockT = W.t;
  if (W.t - o.blockT > 2){ end(r); return; }
  stop(u); u.fg = Math.atan2(t.y - u.y, t.x - u.x); setMood(W, u, '숨어 틈을 봄 (' + r + ')', t.i);
}
// 자동 전투 (아군 · 적 같음): 솜씨가 ai 이상인 근접이 어둠 속에서 아무에게도 안 보이고 맞붙지 않았으면, seek 칸 안의 등이 열린 상대를 숨어서 노림 (들키면 그만둠)
function assnAIoff(W, u, why){ const S = u.asAI; if (!S) return; u.stealth = S.st0; u.asAI = null; u.asNext = W.t + 3; if (why) L(W, { k: 'assnAIend', a: u.i, b: S.b, why, hid: u.side === 1 && !u.seenBy }); }
function assnAI(W, u, dt){
  const A = ASN(W);
  if (!A || AI6.includes('assn') || isFar(u) || !(u.assnE >= (A.ai || 0.4)) || u.line || u.lretId != null || u.pact || u.crawl || u.kb || u.role === '전선' || u.act){ if (u.asAI && !u.act) assnAIoff(W, u, ''); return false; }
  const sp = assnSpotted(W, u);
  if (sp){ if (u.asAI) assnAIoff(W, u, '들킴 (' + sp.name + ')'); return false; }
  if (W.units.some(f => f.alive && !f.down && f.side !== u.side && !isFar(f) && gap(u, f) < Math.max(u.rng, f.rng) + 0.3 && sideOf(W, f, u) !== 'back')){ if (u.asAI) assnAIoff(W, u, '맞붙음'); return false; }
  if (!u.asAI){
    if (W.t < (u.asNext || 0) || litAt(W, u.x, u.y)) return false; u.asNext = W.t + 0.3;
    let best = null, bp = 0.3;
    for (const c of W.units){ if (!c.alive || c.down || c.side === u.side || dist(u, c) > (A.seek || 5) || !canSee(W, u, c) || (sideOf(W, c, u) === 'front' && dist(u, c) < 1.6)) continue;
      const AS = assnCan(W, u, c, true); if (!AS.ok) continue; const p = AS.p - dist(u, c) * 0.02; if (p > bp){ bp = p; best = c; } }
    if (!best) return false;
    u.asAI = { b: best.i, t0: W.t, st0: !!u.stealth }; u.stealth = true;
    L(W, { k: 'assnAI', a: u.i, b: best.i, p: +bp.toFixed(2), hid: u.side === 1 && !u.seenBy });
  }
  const c = W.units[u.asAI.b];
  if (!c || !c.alive || c.down){ assnAIoff(W, u, ''); return false; }
  if (W.t - u.asAI.t0 > 10 || dist(u, c) > (A.seek || 5) + 2 || aware(W, c, u)){ assnAIoff(W, u, W.t - u.asAI.t0 > 10 ? '시간' : aware(W, c, u) ? '알아챔' : '멀어짐'); return false; }
  const r = assnStep(W, u, c, dt);
  if (r === 'go' || r === 'move') return true;
  assnAIoff(W, u, r); return false;
}
// 지금 낼 수 있는 속력: 다리 상처""")

# 3. 숨는 솜씨 다음 암살 솜씨
rep("""  for (const u of W.units) u.stealthE = stealthOf(W, u);   // v7.5 숨는 솜씨""","""  for (const u of W.units){ u.stealthE = stealthOf(W, u); u.assnE = assnSkill(W, u); }   // v7.5 숨는 솜씨   // v7.6 암살 솜씨""")

# 4. 소음 · 비명 없음
rep("""function dinLog(W, o){ const D = W.rules.din,""","""function dinLog(W, o){ if (o.silent) return; const D = W.rules.din,""")
rep("""  if (o.k === 'die' && un(ub) && !W.over){""","""  if (o.k === 'die' && un(ub) && !W.over && !o.silent){""")

# 5. applyDmg: 소리 없는 처치
rep("""far: o.far, ambush: !!o.ambush, blade:""","""far: o.far, ambush: !!o.ambush, assn: o.assn ? true : null, silent: o.silent ? true : null, blade:""")
rep("""  if (t.side === 1 && !o.ff && t.state !== 'hunt'){ t.state = 'hunt';""","""  if (t.side === 1 && !o.ff && !o.silent && t.state !== 'hunt'){ t.state = 'hunt';""")
rep("""L(W, { k: 'down', a: u.i, b: t.i, ff: !!o.ff, need:""","""L(W, { k: 'down', a: u.i, b: t.i, ff: !!o.ff, silent: o.silent ? true : null, need:""")
rep("""L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff, last: !!t.undying, how: t.deathKind || null });""","""L(W, { k: 'die', a: u.i, b: t.i, ff: !!o.ff, last: !!t.undying, how: t.deathKind || null, silent: o.silent ? true : null });""")

# 6. startAct: 조건이 맞으면 암살로
rep("""  const heal = u.cls === '치유' && t.side === u.side;
""","""  const heal = u.cls === '치유' && t.side === u.side;
  if (!heal && t.side !== u.side && u.assnE > 0 && ASN(W) && !AI6.includes('assn')){ const AS = assnCan(W, u, t); if (AS.ok){ startAssn(W, u, t, AS); return; } }   // v7.6 숨은 채 등 뒤 · 아무도 못 봄 · 알아채지 못함 → 암살
""")

# 7. resolveAct
rep("""  if (u.act.k === 'palm'){ resolvePalm(W, u); return; }   // v6.7""","""  if (u.act.k === 'palm'){ resolvePalm(W, u); return; }   // v6.7
  if (u.act.k === 'assn'){ resolveAssn(W, u); return; }   // v7.6""")

# 8. interrupt · preempt
rep("""    if (a.b != null && (a.k === 'atk' || a.k === 'throw' || a.k === 'bash' || a.k === 'skill' || a.k === 'heal' || a.k === 'palm')) L(W, { k: 'miss', a: u.i, b: a.b, why });""","""    if (a.b != null && (a.k === 'atk' || a.k === 'throw' || a.k === 'bash' || a.k === 'skill' || a.k === 'heal' || a.k === 'palm' || a.k === 'assn')) L(W, { k: 'miss', a: u.i, b: a.b, why });""")
rep("""  else if (mv && a && (['atk', 'throw', 'skill', 'bash', 'heal', 'reload', 'palm'].includes(a.k)""","""  else if (mv && a && (['atk', 'throw', 'skill', 'bash', 'heal', 'reload', 'palm', 'assn'].includes(a.k)""")
rep("""  else if (a && a.phase === 'wind' && (['atk', 'throw', 'skill', 'bash', 'heal', 'palm'].includes(a.k) || (a.k === 'reload' && o && o.k === 'skill'))){
    const same = o && a.b === o.b && ((o.k === 'attack' && (a.k === 'atk' || a.k === 'palm'))""","""  else if (a && a.phase === 'wind' && (['atk', 'throw', 'skill', 'bash', 'heal', 'palm', 'assn'].includes(a.k) || (a.k === 'reload' && o && o.k === 'skill'))){
    const same = o && a.b === o.b && ((o.k === 'attack' && (a.k === 'atk' || a.k === 'palm' || a.k === 'assn')) || (o.k === 'assn' && a.k === 'assn')""")

# 9. doOrder · orderTxt · manDodge
rep("""  if (o.k === 'scout'){ scoutStep(W, u, dt); return; }   // v7.5 정찰""","""  if (o.k === 'scout'){ scoutStep(W, u, dt); return; }   // v7.5 정찰
  if (o.k === 'assn'){ assnOrder(W, u, dt); return; }   // v7.6 암살""")
rep("""const orderTxt = (o, u) => o && o.k === 'scout' ?""","""const orderTxt = (o, u) => o && o.k === 'assn' ? ['assn', o.b] : o && o.k === 'scout' ?""")
rep("""['move', 'amove', 'line', 'lret', 'scout', 'pick',""","""['move', 'amove', 'line', 'lret', 'scout', 'assn', 'pick',""")

# 10. fight: 자동 암살 (보이든 안 보이든 — 스스로 고름)
rep("""  if (u.crawl && !isFar(u)){ if (see) crawlAway(W, u, t, dt); else stop(u); return; }   // v5.2 기어다님: 근접은 못 함
""","""  if (u.crawl && !isFar(u)){ if (see) crawlAway(W, u, t, dt); else stop(u); return; }   // v5.2 기어다님: 근접은 못 함
  if (!ordered && assnAI(W, u, dt)) return;   // v7.6 어둠 속에서 등이 열린 상대를 숨어서 노림
""")

# 11. stepWorld: 시신 발견
rep("""  torchTick(W);   // v7.5 횃불을 켜고 끔""","""  torchTick(W);   // v7.5 횃불을 켜고 끔
  assnFoundTick(W);   // v7.6 암살당한 시신을 동료가 봄""")

# 12. exports
rep("""module.exports = { scoutStep, scoutReport,""","""module.exports = { assnSkill, assnVigil, assnCan, assnStep, assnOrder, assnAI, assnFoundTick, scoutStep, scoutReport,""")
open(p,'w').write(s)
print('ok')
