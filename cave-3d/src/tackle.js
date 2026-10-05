/* tackle.js v1.11 — (v1.11: 대련 더미에도 걸림) (v1.1: 다리후리기 · 슬라이딩 · 넘어뜨리기) (v1.01: 부딪히는 순간 어깨빵 자세) 바디 태클 (T, v0.33)
   · T: 바라보는 쪽으로 직선 예고 (0.3초) → 돌진. Shift를 누르고 있으면 더 멀리 · 더 세게 (피해 ×1.5, 기절 80%)
   · 부딪힌 적은 앞에 겹쳐 붙어 같이 감 (부딪힐 때 공격의 50% · 40%로 기절)
   · 같이 벽 (바위 · 기둥 포함)에 박으면: 30 + 공격의 절반, 기절 1.2초. 여럿이면 맨 앞놈이 머릿수만큼 더 (한 명당 +20%), 나머지는 옆으로 흩어짐. 인주는 한 칸 튕겨 나옴
   · 혼자 벽에 박으면: 5 피해 · 0.8초 기절
   · 나보다 2.4배 넘게 무거운 놈 (곤봉 거한 · 단달로 · 보스)은 안 밀림: 부딪히는 순간 멈추고 튕겨 나옴 (서로 조금 다침). 무거운 놈을 밀수록 느려짐
   · 아무도 못 맞히면 헛돌진: 1.5초 취약 (받는 피해 ×1.4). 끝자리 곁에 적이 있으면 그놈이 곧장 반격, 내 등 뒤면 뒤잡 (×1.5)
   · 돌진 중 Q: 멈춤 (3초 둔화) */
'use strict';
const TK = { cd: 6, wind: 0.3, len: 4.2, lenRun: 6.2, spd: 12, wallDmg: 30 };
const TKS = { cd: 0, st: null };
function tackleInput(u, dt){
  TKS.cd -= dt;
  const S = TKS.st;
  if (!S){
    if (!hit('KeyT') || G.lock || u.lock || u.downed || u.st !== 'idle' && u.st !== 'run') return false;
    if (TKS.cd > 0){ popText(u.x, u.y + 2.2, u.z, `태클 ${Math.ceil(TKS.cd)}초`, 'miss', 0.6); return true; }
    const run = down('ShiftLeft') || down('ShiftRight'), a = u.aim, len = run ? TK.lenRun : TK.len;
    TKS.st = { t: 0, a, len, run, went: 0, carry: [], hit: new Set(), phase: 'wind', dec: decal('line', { x: u.x, z: u.z, len: len + 0.5, w: 1.0, a, dur: TK.wind, color: 0xffcf80 }) };
    TKS.cd = TK.cd; u.st = 'tackle'; setPose(u, u.S.poses.grabReady ? 'grabReady' : u.S.poses.windup ? 'windup' : 'idle'); u.leanT = -0.3;
    popText(u.x, u.y + 2.3, u.z, '태클!', 'aim', 0.6);
    return true;
  }
  if (u.st === 'hurt' || u.downed){ tkEnd(u, true); return false; }
  S.t += dt;
  if (S.phase === 'wind'){ if (S.t >= TK.wind){ S.phase = 'go'; S.t = 0; SFX.whoosh && SFX.whoosh(); setPose(u, u.S.poses.dash ? 'dash' : u.S.poses.attack ? 'attack' : 'idle'); } return true; }
  // 돌진 중 Q: 멈춤 (3초 둔화)
  if (hit('KeyQ')){ tkEnd(u); addStatus(u, 'slow', { k: 0.4, t: 3 }); popText(u.x, u.y + 2.2, u.z, '멈춤 (둔화)', 'miss', 0.8); return true; }
  const ca = Math.cos(S.a), sa = Math.sin(S.a), step = Math.min(S.len - S.went, TK.spd * dt);
  // 앞이 막혔나 (겹친 적들 맨 앞 기준)
  const front = S.carry.length ? S.carry[S.carry.length - 1] : u, fr = front.r + 0.12;
  const wall = solidAt(G.map, front.x + ca * (fr + step), front.z + sa * (fr + step));
  if (wall){ tkWall(u, S); return true; }
  const load = S.carry.reduce((w, e) => w + (e.D.weight || 60), 0), slow = 1 / (1 + load / 400);   // 무거운 걸 밀수록 느려짐
  moveBy(u, ca * step * slow, sa * step * slow); S.went += step * slow; u.leanT = 0.35;
  if (Math.random() < 0.6) dust(u.x, u.z, 1);
  // 겹친 적: 앞에 줄줄이 붙음
  let off = u.r;
  for (const e of S.carry){ if (e.dead){ continue; } off += e.r + 0.05; e.x = u.x + ca * off; e.z = u.z + sa * off; off += e.r; e.kx = e.kz = 0; if (e.st !== 'hurt'){ interrupt(e); e.st = 'hurt'; e.stT = 0.4; } }
  S.carry = S.carry.filter(e => !e.dead);
  // 새로 부딪힘
  const lead = S.carry.length ? S.carry[S.carry.length - 1] : u;
  for (const e of fightTargets()){
    if (S.hit.has(e) || e.dead || e.airborne || (e.D.dummy && !e.D.spar)) continue;
    if (Math.hypot(e.x - lead.x, e.z - lead.z) > lead.r + e.r + 0.15) continue;
    S.hit.add(e);
    const myW = (u.D.weight || 55) + ((u.rpg && u.rpg.A.str) || 5) * 3, theirW = e.D.weight || 60;
    if (e.D.boss || e.D.heavy || theirW > myW * 2.4){   // 너무 무거움 (곤봉 거한 · 단달로 · 보스): 튕겨 나옴
      hurt(u, e, u.atk * 0.3, { from: u, noCrit: true }); hurt(e, u, 4, { from: e, noCrit: true });
      const n = norm(u.x - e.x, u.z - e.z); u.kx += n.x * 7; u.kz += n.z * 7;
      popText(e.x, e.y + bodyH(e), e.z, '꿈쩍 않음', 'miss', 1); camShake(0.2, 0.15); SFX.thump(90, 0.5, 0.2);
      tkEnd(u); u.st = 'hurt'; u.stT = 0.5; setPose(u, 'hurt'); return true;
    }
    const mul = 0.5 * (S.run ? 1.5 : 1);
    hurt(u, e, u.atk * mul, { from: u, noCam: true, stun: Math.random() < (S.run ? 0.8 : 0.4) ? 0.8 : 0 });
    if (!S.carry.length && u.S.poses.shoulder) setPose(u, 'shoulder');   // 부딪힘: 어깨빵
    S.carry.push(e); SFX.thump(140, 0.4, 0.15); camShake(0.15, 0.12);
    popText(e.x, e.y + bodyH(e) + 0.2, e.z, '쿵!', 'big', 0.6);
  }
  if (S.went >= S.len - 0.01) tkFinish(u, S);
  return true;
}
// 벽에 박음
function tkWall(u, S){
  camShake(0.45, 0.35); G.hitstop = Math.max(G.hitstop, 0.12); SFX.boom && SFX.boom(0.8);
  const ca = Math.cos(S.a), sa = Math.sin(S.a);
  if (!S.carry.length){
    hurt(null, u, 5, { noCrit: true, unblockable: true }); u.st = 'hurt'; u.stT = 0.8; setPose(u, 'hurt');
    popText(u.x, u.y + 2.2, u.z, '벽에 꽝!', 'hurt', 1); dust(u.x + ca * 0.5, u.z + sa * 0.5, 10);
    tkEnd(u, true); return;
  }
  const n = S.carry.length, mul = S.run ? 1.5 : 1;
  S.carry.forEach((e, i) => {
    const last = i === n - 1;
    const dmg = (TK.wallDmg + u.atk * 0.5) * mul * (last ? 1 + 0.2 * (n - 1) : 1);
    hurt(u, e, dmg, { from: u, crit: last && n >= 2 ? true : undefined, critMul: 1.3, noCam: true });
    if (!e.dead && !e.D.boss){ interrupt(e); e.st = 'hurt'; e.stT = 1.2; setPose(e, 'hurt'); }
    if (!last && !e.dead){   // 나머지는 옆으로 흩어짐
      const side = (i % 2 ? 1 : -1) * (0.9 + Math.random() * 0.4), sx = e.x - sa * side, sz = e.z + ca * side;
      if (!solidAt(G.map, sx, sz)){ e.x = sx; e.z = sz; }
    }
  });
  typeof heroCount === 'function' && u.hero && heroCount(u.hero, 'wall');
  if (typeof clashLog === 'function') clashLog(n >= 2 ? `${n}명을 한꺼번에 벽으로 밀어붙였다. 맨 앞의 ${S.carry[n - 1].D.name}가 짓눌렸다.` : `${S.carry[0].D.name}를 벽에 처박았다.`);
  const L = S.carry[n - 1]; popText(L.x, L.y + bodyH(L) + 0.4, L.z, n >= 2 ? `벽에 꽝! ×${n}` : '벽에 꽝!', 'crit', 1.2);
  dust(L.x + ca * 0.4, L.z + sa * 0.4, 18); ring(L.x, L.z, 0xffcf80, 1.6, 0.35);
  u.kx -= ca * 5; u.kz -= sa * 5;   // 한 칸 튕겨 나옴
  tkEnd(u);
}
// 끝까지 감
function tkFinish(u, S){
  if (!S.hit.size){
    addStatus(u, 'vuln', { t: 1.5 }); popText(u.x, u.y + 2.2, u.z, '헛돌진 — 빈틈!', 'miss', 1);
    // 끝자리 곁의 적이 곧장 반격 (등 뒤면 뒤잡)
    const e = nearest(u, foes().filter(f => f.alert && !f.lock && f.st === 'idle'), 2.4);
    if (e){
      const toE = Math.atan2(e.z - u.z, e.x - u.x), back = Math.abs(angDiff(toE, S.a)) > 2.0;
      setAim(e, u.x, u.z); popText(e.x, e.y + bodyH(e) + 0.3, e.z, back ? '뒤잡!' : '반격!', 'alert', 0.9);
      setTimeout(() => { if (!e.dead && !u.dead && dist(e, u) < 2.6) hurt(e, u, e.atk * (back ? 1.5 : 1), { from: e }); }, 250);
    }
  } else S.carry.forEach(e => { if (!e.dead){ const n = norm(e.x - u.x, e.z - u.z); e.kx += n.x * 4; e.kz += n.z * 4; } });
  tkEnd(u);
}
function tkEnd(u, keepHurt){
  const S = TKS.st; if (S && S.dec) S.dec.done = true;
  TKS.st = null; if (!keepHurt && u.st === 'tackle'){ u.st = 'idle'; setPose(u, 'idle'); }
}

/* ---------- v1.1 다리 기술 (원정) ----------
   · 다리후리기: 숙인 채 (G) 공격 → 둘레 1.8칸을 낮게 쓸어 넘어뜨림 (1.3초 누움 · 취약). 대기 1.1초
   · 슬라이딩: 달리면서 (Shift) G → 앞으로 미끄러짐 (0.5초). 몸이 낮아 높은 공격은 지나가고, 닿은 적은 넘어짐. 대기 1.2초
   · 넘어뜨리기는 공중에 뜬 놈 · 보스 · 아주 무거운 놈 (나보다 2.4배 넘게)에겐 안 통함 ("꿈쩍 안 함", 슬라이딩은 거기서 멈춤) */
const LEG = { sweepR: 1.8, sweepCd: 1.1, slideT: 0.5, slideV: 10, slideCd: 1.2, down: 1.3 };
function tooBig(u, e){ return !!(e.D.boss || e.D.heavy || (e.D.weight || 60) > (u.D.weight || 55) * 2.4); }
function trip(u, e, how){
  if (e.dead || e.downed || e.airborne || (e.lift || 0) > 0.3 || (e.jy || 0) > 0.3) return false;
  hurt(u, e, u.atk * (how === 'slide' ? 0.45 : 0.6), { from: u, kb: 0.3 });
  if (tooBig(u, e)){ popText(e.x, e.y + bodyH(e) + 0.3, e.z, '꿈쩍 안 함', 'miss', 0.8); return false; }
  if (e.dead) return true;
  interrupt(e); e.st = 'hurt'; e.stT = LEG.down; e.lying = true; e.tripT = G.t + LEG.down; setPose(e, 'hurt');
  if (typeof addStatus === 'function') addStatus(e, 'vuln', { t: LEG.down });
  popText(e.x, e.y + 1.4, e.z, '넘어짐!', 'big', 0.8); dust(e.x, e.z, 10); SFX.thump(110, 0.35, 0.12); camShake(0.12, 0.12);
  if (typeof clashLog === 'function') clashLog(how === 'slide' ? `미끄러져 들어가 ${e.D.name}의 발목을 걷어찼다.` : `몸을 낮춰 ${e.D.name}의 다리를 쓸었다.`);
  return true;
}
function legSweep(u){
  P.sweepCd = LEG.sweepCd; P.atkBuf = 0; u.st = 'strike'; u.stT = 0.45; setPose(u, 'sweep'); u.guard = false;
  ring(u.x, u.z, 0xffcf80, LEG.sweepR, 0.3); dust(u.x, u.z, 12); SFX.whoosh && SFX.whoosh();
  for (const e of fightTargets()) if (!e.dead && dist(e, u) < LEG.sweepR + e.r) trip(u, e, 'sweep');
}
function slideStart(u, mv){
  P.slideCd = LEG.slideCd; P.atkBuf = 0; u.st = 'slide'; u.stT = LEG.slideT; u.dvx = mv.x * LEG.slideV; u.dvz = mv.z * LEG.slideV; u.slideHit = new Set();
  u.aim = Math.atan2(mv.z, mv.x); faceToward(u, mv.x, mv.z); u.posture = 'crouch'; u.guard = false; setPose(u, 'slide'); dust(u.x, u.z, 8);
}
function slideTick(u, dt){
  u.stT -= dt; const k = Math.max(0, u.stT / LEG.slideT), sp = 0.3 + 0.7 * k;
  moveBy(u, u.dvx * sp * dt, u.dvz * sp * dt); u.posture = 'crouch'; setPose(u, 'slide');
  if (Math.random() < 0.5) dust(u.x, u.z, 1);
  for (const e of fightTargets()) if (!e.dead && !u.slideHit.has(e) && dist(e, u) < u.r + e.r + 0.35){
    u.slideHit.add(e);
    if (!trip(u, e, 'slide') && tooBig(u, e)){ u.stT = Math.min(u.stT, 0.08); const n = norm(u.x - e.x, u.z - e.z); u.kx += n.x * 4; u.kz += n.z * 4; }   // 큰 놈에 막힘
  }
  if (u.stT <= 0){ u.st = 'idle'; u.posture = 'stand'; }
}

/* ---------- v1.11 대련 더미 (굴): 맞으면 숫자만 뜨고 안 죽음. 넘어지고 · 잡히고 · 밀리고, 가만 두면 제자리로 걸어 돌아옴 ---------- */
DEFS.spar = { spr: 'dummy', name: '대련 더미', hp: 99999, atk: 0, spd: 1.6, r: 0.35, weight: 60, dummy: true, spar: true };
function sparSpawn(){
  const cand = [[6, 8], [5, 8], [7, 8.5], [5.5, 7], [8, 7.5], [6, 6]];
  const ok = ([x, z]) => !solidAt(G.map, x, z) && !G.inspect.some(it => it.x != null && Math.hypot(it.x - x, it.z - z) < 1.6) && !G.units.some(o => Math.hypot(o.x - x, o.z - z) < 1.2);
  const [x, z] = cand.find(ok) || cand[0];
  const u = spawn('spar', x, z, 'neutral'); u.home = { x, z }; u.alert = true; u.face = 1;
  return u;
}
function sparThink(u, dt){
  if (u.lock) return;
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0) u.st = 'idle'; return; }
  if (u.lying) return;
  const d = Math.hypot(u.home.x - u.x, u.home.z - u.z);
  if (d > 0.3){ const n = norm(u.home.x - u.x, u.home.z - u.z); moveBy(u, n.x * u.spd * dt, n.z * u.spd * dt); }
}
