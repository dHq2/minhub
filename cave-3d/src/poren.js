/* poren.js v1.0 — 포렌 (쥐들의 대왕 · 1인군단) (v1.0, v0.68: 2D 판 '야광 포렌' 을 3D 로. 그림 13동작 (tools/poren_art.py → art/poren 묶음 2장) · 쥐 군단 · 기억하는 쥐)
   140cm 에메랄드 갑주 · 대검 탱커. 혼자서 군단 — 쥐들이 끝없이 몰려와 싸움. 세자르와 같은 급 (인간의 정점들)
   2기 목록에 붙음: DEFS.h2_poren (동료) · DEFS.h2e_poren (적 · 보스로도). 훈련장 '2기' 탭 · 투기장에서 그대로 씀
   기술 (위에 있을수록 먼저):
   · 충성 (상시): 쥐가 끊임없이 달려옴 (화면 밖 같은 편 쪽에서). 작은 쥐 58% · 중간 쥐 27% · 큰 쥐 13% · 쥐 기사 2%. 70% 는 포렌 곁 · 30% 는 떠돌이. 한 번에 최대 12마리
   · 쥐 방진 (14초): 체력 40% 아래 · 센 한 방을 맞으면 → 대검을 꽂고 2.5초 버팀, 쥐 최대 8마리가 둘러쌈, 받는 피해 70% 를 둘레 쥐들이 나눠 받음 → 이중 회전 반격
   · 쥐 포박 (12초): 4.5칸 안 가장 위험한 적에게 쥐 5마리가 달라붙음 — 쥐 하나당 0.6초 묶임 (최대 3초, 보스 · 거구는 절반) — 2D 판 4.5초에서 줄임
   · 쥐 표식 '물어라!' (12초): 위험한 적 하나에 5초 표식 + 쥐 셋이 더 옴 → 모든 쥐가 그놈만 물어뜯음
   · 도발 '쥐들의 대왕' (10초): 3칸 안 적들이 포렌만 봄
   · 쥐 사다리 (7초): 쥐 셋을 타고 2.5~7칸을 미끄러져 와 내려찍기 (×1.5)
   · 대검 내려베기 (5초) · 기본 대검 베기 (둘째 적에게 60% 베어 넘김)
   · 쥐 망토 (패시브): 곁 (2칸) 의 쥐 하나마다 받는 피해 -3% (최대 -25%) · 정면 막기 (25%, 30% 만 받음) · 갑주 피해 -10% · 잘 안 밀림
   기억하는 쥐 (민수: 쥐들도 유닛 — 살아남으면 같은 쥐가 레벨 · 등급을 달고 돌아옴):
   · 동료 포렌의 쥐 기사는 이름 (A, B, …) 이 붙음. 싸움이 끝날 때 (적이 6초 없음) 살아 있으면 단계 +1 · 돌아온 횟수 +1, 3번 돌아오면 베테랑
   · 죽으면 기억에서 빠짐. 다음 쥐 기사는 기억하는 쥐부터 나옴 — 기술 글에 '다음 생성 때 N단계 기사가 먼저 (A, B)'
   · 평소엔 숨어 지냄 (로비에는 안 나옴). 베테랑이 로비에서 포렌을 따르는 건 다음에 */
'use strict';
const PQ = (k, o = {}) => ({ ...POREN_SHEETS[k], f: 1, fps: 14, ...o });
const PO = { tall: 1.35, cap: 12, rec: 'poren_rats' };
SPR.h2_poren = { h0: POREN_SHEETS.idle.h, tall: PO.tall, poses: {
  idle: PQ('idle', { fps: 8, pingpong: true }), walk: PQ('idle', { fps: 16, pingpong: true }), hurt: PQ('block', { count: 3, fps: 12, once: true }), block: PQ('block', { fps: 12, once: true }),
  down: PQ('ground', { from: 12, count: 1 }), dead: PQ('ground', { from: 12, count: 1 }),
  slashA: PQ('slash_diag', { count: 5, fps: 14, once: true }), slashB: PQ('slash_diag', { from: 5, count: 6, fps: 20, once: true }), attack: PQ('slash_diag', { from: 5, count: 6, fps: 20, once: true }),
  bigA: PQ('bigslash', { count: 5, fps: 10, once: true }), bigB: PQ('bigslash', { from: 5, count: 6, fps: 18, once: true }),
  thrA: PQ('dash_thrust', { count: 5, fps: 12, once: true }), thrB: PQ('dash_thrust', { from: 5, count: 7, fps: 20, once: true }),
  surf: PQ('dash_spin', { fps: 18, once: true }), slam: PQ('slam', { fps: 18, once: true }), ground: PQ('ground', { fps: 9, once: true }), spin: PQ('spin_slash', { fps: 16, once: true }),
  burst: PQ('burst', { fps: 14, once: true }), command: PQ('command', { fps: 12, once: true }), command2: PQ('command2', { fps: 12, once: true }), order: PQ('order', { fps: 14, once: true }) } };
{
  const base = { spr: 'h2_poren', name: '포렌', hp: 1000, atk: 22, spd: 3.0, r: 0.36, weight: 140, dr: 0.1, h2: 'poren', melee: { range: 1.9, arc: 1.8, windup: 0.35, cd: 1.1, mul: 1, kb: 0.8 }, think: porenThink };
  DEFS.h2_poren = { ...base }; DEFS.h2e_poren = { ...base, boss: true };
  if (typeof FOE_XP !== 'undefined') FOE_XP.h2e_poren = 300;
  if (typeof SOLP !== 'undefined') SOLP.h2_poren = { apt: { melee: 4, spear: 1, bow: 0, gun: 0, magic: 0, stealth: 0 }, tag: 'knight', pas: ['쥐들의 대왕', ''] };
  H2R.poren = { slug: 'poren', name: '포렌 (쥐들의 대왕 · 1인군단)', gen: 1, rank: '', tall: 1.4, role_job: '1인군단 · 대검 탱커', apt: SOLP && SOLP.h2_poren ? SOLP.h2_poren.apt : {}, bag: 10, poses: Object.fromEntries(Object.keys(POREN_SHEETS).map(k => [k, 1])), missing: [] };
  H2K.poren = { boss: true, pas: ['쥐들의 대왕', ''], sk: ['충성', '쥐 방진', '쥐 포박', '쥐 표식 — 물어라!', '쥐들의 대왕 (도발)', '쥐 사다리', '대검 내려베기', '대검 베기'].map(n => ({ n, show: true })) };
  H2PAS['쥐들의 대왕'] = { kb: 0.4 };
  H2.list.push('poren');
  const _pick = h2Pick; h2Pick = (u, t) => u && u.D && u.D.h2 === 'poren' ? null : _pick(u, t);   // 기술은 porenThink 가 직접
  const _face = h2FaceHtml; h2FaceHtml = o => o.slug === 'poren' ? '<i class="h2f" style="background:url(art/poren/face.webp) center / cover"></i>' : _face(o);
  if (typeof HERO_FACE !== 'undefined') HERO_FACE.h2_poren = 'art/poren/face.webp';
}

/* ---------- 기억하는 쥐 ---------- */
const PMEM = {
  load(){ try { const L = JSON.parse(localStorage.getItem(PO.rec) || '[]'); return Array.isArray(L) ? L : []; } catch (e) { return []; } },
  save(L){ try { localStorage.setItem(PO.rec, JSON.stringify(L)); } catch (e) {} porenText(); },
  letter(L){ const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; for (let i = 0; ; i++){ const n = i < 26 ? AB[i] : AB[i % 26] + Math.floor(i / 26); if (!L.some(r => r.n === n)) return n; } },
};
function porenText(){
  const L = PMEM.load().filter(r => !G.units.some(u => u.rec && u.rec.n === r.n && !u.dead)).slice(0, 4);
  H2K.poren.pas[1] = '쥐 망토 — 곁의 쥐마다 받는 피해 -3% (최대 -25%) · 정면 막기 · 잘 안 밀림. 쥐는 끝없이 달려옴 (충성)'
    + (L.length ? ` · 다음 생성 때 ${Math.max(...L.map(r => r.lv))}단계 기사가 먼저 (${L.map(r => r.n + (r.vet ? '★' : '')).join(', ')})` : ' · 기억하는 쥐 기사 없음');
  if (typeof SOLP !== 'undefined' && SOLP.h2_poren) SOLP.h2_poren.pas = H2K.poren.pas;
}
porenText();

/* ---------- 쥐 부르기 ---------- */
const porenFoes = u => G.units.filter(o => o.side !== u.side && o.side !== 'neutral' && !o.dead && !o.downed && !o.D.dummy && !(o.kind === 'player' && o.hp > 1e8));
const porenRats = u => G.units.filter(o => o.king === u && !o.dead && !o.downed);
function porenSpot(u, far){
  const t = nearest(u, porenFoes(u), 40), a0 = t ? Math.atan2(u.z - t.z, u.x - t.x) : Math.random() * 6.28;
  for (let k = 0; k < 8; k++){
    const a = a0 + rnd(-0.9, 0.9), r = far ? rnd(7, 9) : rnd(0.8, 1.6), x = u.x + Math.cos(a) * r, z = u.z + Math.sin(a) * r;
    if (!solidAt(G.map, x, z)) return { x, z };
  }
  return { x: u.x + rnd(-0.6, 0.6), z: u.z + rnd(-0.6, 0.6) };
}
// what: small · mid · large · knight. o.near: 곁에서 솟아남 (방진 · 포박 · 표식) / 아니면 화면 밖에서 달려옴
function porenRat(u, what, o = {}){
  if (porenRats(u).length >= PO.cap + (o.extra || 0)) return null;
  const pre = u.side === 'enemy' ? 'h2e_' : 'h2_', at = o.at || porenSpot(u, !o.near);
  let kind = pre + 'ratsmall', rec = null;
  if (what === 'knight'){
    kind = pre + 'ratknight';
    if (u.side === 'ally'){   // 기억하는 쥐부터
      const L = PMEM.load(); rec = L.find(r => !G.units.some(m => m.rec && m.rec.n === r.n && !m.dead));
      if (!rec){ rec = { n: PMEM.letter(L), lv: 1, ret: 0, vet: false }; L.push(rec); PMEM.save(L); }
      if (rec.vet) kind = pre + 'ratvet'; else H2.ratLv = rec.lv;
    }
  }
  if (!DEFS[kind]) return null;
  const m = spawn(kind, at.x, at.z, u.side); H2.ratLv = 0;
  if (!m) return null;
  m.king = u; m.alert = true; m.seen = G.t; m.follower = o.follower ?? Math.random() < 0.7; m.face = u.face;
  m.D = { ...m.D, think: porenRatThink };
  if (what === 'mid' || what === 'large'){
    const k = what === 'mid' ? 1.7 : 2.6; m.S = { ...m.S, tall: m.S.tall * k }; m.r *= k * 0.8; m.max = m.hp = Math.round(m.max * (what === 'mid' ? 2.5 : 6)); m.atk = Math.round(m.atk * (what === 'mid' ? 1.8 : 3));
    m.D = { ...m.D, name: what === 'mid' ? '중간 쥐' : '큰 쥐', melee: { ...m.D.melee, range: m.D.melee.range * k * 0.8 } };
  }
  if (rec){ m.rec = rec; m.D = { ...m.D, name: `쥐 ${rec.vet ? '베테랑' : '기사'} ${rec.n}` }; popText(m.x, m.y + 1.6, m.z, `${m.D.name}${rec.ret ? ` (돌아옴 ${rec.ret})` : ''}`, 'heal', 1.2); porenText(); }
  if (m.tag) m.tag.textContent = m.D.name;
  if (o.near){ dust(m.x, m.z, 4); spark(m.x, m.y + 0.3, m.z, 0x7dffb0, 4, 2); }
  (u.minions = u.minions || []).push(m);
  return m;
}
const porenRoll = () => { const r = Math.random(); return r < 0.58 ? 'small' : r < 0.85 ? 'mid' : r < 0.98 ? 'large' : 'knight'; };

/* ---------- 쥐 두뇌 (양쪽 공용) ---------- */
function porenRatThink(m, dt){
  if (m.downed || m.dead) return;
  m.cd = (m.cd || 0) - dt;
  if (m.st === 'hurt'){ m.stT -= dt; if (m.stT <= 0){ m.st = 'idle'; setPose(m, 'idle'); } m.bind = null; return; }
  if (m.st === 'windup'){ if (!m.decal) m.st = 'idle'; return; }
  if (m.st === 'strike'){ m.stT -= dt; if (m.stT <= 0){ m.st = 'idle'; setPose(m, 'idle'); } return; }
  const K = m.king && !m.king.dead ? m.king : null;
  if (m.bind){   // 포박: 달라붙어 갉음
    const t = m.bind.t;
    if (t.dead || t.downed || G.t > m.bind.end){ m.bind = null; }
    else { m.x = t.x + Math.cos(m.bind.a) * (t.r || 0.4); m.z = t.z + Math.sin(m.bind.a) * (t.r || 0.4); m.moving = false; setAim(m, t.x, t.z); setPose(m, m.S.poses.attack ? 'attack' : 'idle');
      if ((m.bt = (m.bt || 0) - dt) <= 0){ m.bt = 0.6; hurt(m, t, m.atk * 0.5, { from: m, kb: 0 }); } return; }
  }
  if (K && K.fortT > G.t && m.fortA != null){   // 방진: 둘레를 돎
    const a = m.fortA + G.t * 1.6; m.moving = true; navTo(m, K.x + Math.cos(a) * 1.25, K.z + Math.sin(a) * 1.25, m.spd * 1.3, dt, 0.05); setPose(m, m.S.poses.walk ? 'walk' : 'idle'); return;
  }
  let t = K && K.mark && !K.mark.dead && !K.mark.downed && G.t < K.markEnd ? K.mark : null;
  if (!t){ const F = porenFoes(m), anc = m.follower && K ? K : m; t = nearest(anc, F, m.follower && K ? 7 : 16); if (t && anc !== m && dist(m, t) > 12) t = null; }
  if (!t){
    if (K && dist(m, K) > (m.follower ? 2.2 : 6)){ m.moving = true; navTo(m, K.x + Math.cos(m.uid || 0) * 1.4, K.z + Math.sin(m.uid || 0) * 1.4, m.spd, dt, 0.4); setPose(m, m.S.poses.walk ? 'walk' : 'idle'); }
    else { m.moving = false; setPose(m, 'idle'); }
    return;
  }
  const M = m.D.melee || { range: 0.7, arc: 1.4, windup: 0.15, cd: 0.6, mul: 1, kb: 0 }, reach = Math.max(0.55, M.range * 0.85) + (t.r || 0.3);
  setAim(m, t.x, t.z);
  if (dist(m, t) > reach){ m.moving = true; navTo(m, t.x, t.z, m.spd * (t === (K && K.mark) ? 1.25 : 1), dt, reach * 0.8); setPose(m, m.S.poses.walk ? 'walk' : 'idle'); return; }
  m.moving = false;
  if (m.cd <= 0){ m.cd = M.cd + rnd(0, 0.2); setPose(m, m.S.poses.windup ? 'windup' : 'idle'); windup(m, 'sector', { x: m.x, z: m.z, r: reach + 0.2, a: m.aim, arc: M.arc || 1.4, windup: M.windup || 0.2 }, meleeHit(m, M)); }
}

/* ---------- 포렌 두뇌 ---------- */
function porenInit(u){
  if (u.pc) return;
  u.pc = { atk: 0.4, big: 2, mark: 2, bind: 4, fort: 3, ladder: 1.5, taunt: 3, loyal: 0.3 };
  for (let i = 0; i < 4; i++) porenRat(u, i === 0 && Math.random() < 0.5 ? 'knight' : 'small', { near: true });   // 처음엔 곁에 넷
}
const porenDanger = (u, F, r) => F.filter(e => dist(u, e) < r).sort((a, b) => (b.atk * (b.D.boss ? 2 : 1)) - (a.atk * (a.D.boss ? 2 : 1)))[0];
// 매 순간 (두뇌가 대열 · 지휘에 넘어가 있어도): 대기 시간 · 충성 (쥐 부르기) · 싸움 끝 정리
function porenTick(u, dt){
  porenInit(u);
  const C = u.pc; for (const k in C) C[k] -= dt;
  const t = nearest(u, porenFoes(u), 30);
  // 충성: 싸움이면 1.5초마다, 아니면 4초마다 한 마리
  if (C.loyal <= 0){ C.loyal = t ? rnd(1.3, 1.8) : 4; if (t || porenRats(u).length < 4) porenRat(u, porenRoll()); }
  // 싸움 끝 → 기억하는 쥐 정리
  if (t && dist(u, t) < 20) u.inFight = G.t; else if (u.inFight && G.t - u.inFight > 6){ u.inFight = 0; porenSettle(u); }
}
TICKS.push(dt => { if (G.lock || G.waitInput) return; for (const u of G.units) if (u.D.h2 === 'poren' && !u.dead && !u.downed) porenTick(u, dt); });
// 동료 포렌: 적이 14칸 안이면 대열 (sol) 보다 포렌 두뇌가 먼저
{ const _hcP = heroCombat; heroCombat = function(u, dt){ if (u.D && u.D.h2 === 'poren' && porenFoes(u).some(e => dist(e, u) < 14)) return false; return _hcP(u, dt); }; }
function porenThink(u, dt){
  if (u.downed || u.dead) return;
  porenInit(u);
  const C = u.pc, F = porenFoes(u), t = nearest(u, F, 30);
  if (u.pact) return porenAct(u, dt);
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  if (u.st === 'windup'){ if (!u.decal) u.st = 'idle'; return; }   // 예고가 끊기면 (맞아서 취소) 멈춰 서지 않게
  if (u.st === 'strike'){ u.stT -= dt; if (u.stT <= 0){ u.st = 'idle'; setPose(u, 'idle'); } return; }
  if (u.side === 'ally' && G.mode === 'exp' && (!t || (G.cmd === 'follow' && G.player && !G.player.downed))) return allyThink(u, dt);
  if (!t){ u.moving = false; setPose(u, 'idle'); return; }
  if (u.side === 'enemy' && !u.alert){ if (dist(u, t) < 9){ u.alert = true; u.seen = G.t; } else return; }
  const d = dist(u, t);
  if (C.fort <= 0 && (u.hp < u.max * 0.4 || u._wantFort)) return porenFort(u);
  u._wantFort = false;
  const th = porenDanger(u, F, 4.5);
  if (C.bind <= 0 && th) return porenBind(u, th);
  const mk = porenDanger(u, F, 9);
  if (C.mark <= 0 && mk) return porenMark(u, mk);
  if (C.taunt <= 0 && F.filter(e => dist(e, u) < 3).length >= 2) return porenTaunt(u);
  if (C.ladder <= 0 && d > 2.5 && d < 7) return porenLadder(u, t);
  setAim(u, t.x, t.z);
  if (d > 2.0){ u.moving = true; navTo(u, t.x, t.z, u.spd, dt, 1.7); setPose(u, 'walk'); return; }
  u.moving = false;
  if (C.big <= 0) return porenBig(u, t);
  if (C.atk <= 0) return porenSlash(u, t);
  setPose(u, 'idle');
}
// 대검 베기: 첫 놈 100% · 나머지 60% (베어 넘김)
function porenSlash(u, t){
  u.pc.atk = 1.1; setAim(u, t.x, t.z); setPose(u, 'slashA'); let n = 0;
  windup(u, 'sector', { x: u.x, z: u.z, r: 2.2, a: u.aim, arc: 1.8, windup: 0.35, after: () => { setPose(u, 'slashB'); } }, e => { hurt(u, e, u.atk * (n++ ? 0.6 : 1), { from: u, kb: 0.8, crit: Math.random() < 0.1 }); }, GREEN_P);
}
function porenBig(u, t){
  u.pc.big = 5; u.pc.atk = 1.2; setAim(u, t.x, t.z); setPose(u, 'bigA'); popText(u.x, u.y + bodyH(u) + 0.5, u.z, '대검 내려베기', 'alert', 0.8);
  windup(u, 'sector', { x: u.x, z: u.z, r: 2.6, a: u.aim, arc: 1.3, windup: 0.55, after: () => { setPose(u, 'bigB'); camShake(0.2, 0.2); dust(u.x + Math.cos(u.aim) * 1.6, u.z + Math.sin(u.aim) * 1.6, 10); } }, e => hurt(u, e, u.atk * 1.7, { from: u, kb: 1.8, stun: 0.5 }), GREEN_P);
}
const GREEN_P = 0x58e0a0;
// 쥐 사다리: 쥐 셋을 타고 미끄러져 와 내려찍기
function porenLadder(u, t){
  u.pc.ladder = 7; setAim(u, t.x, t.z); setPose(u, 'surf'); say(u, '사다리!', '', 0.9);
  const a = u.aim, len = Math.min(7, dist(u, t) - 0.6);
  for (let i = 0; i < 3; i++){ const r = porenRat(u, 'small', { near: true, extra: 3, at: { x: u.x + Math.cos(a) * (0.6 + i * 0.5), z: u.z + Math.sin(a) * (0.6 + i * 0.5) } }); if (r) r.follower = true; }
  windup(u, 'line', { x: u.x, z: u.z, len, w: 1.2, a, windup: 0.45, after: () => {
    let k = 0; for (; k < len; k += 0.3) if (solidAt(G.map, u.x + Math.cos(a) * (k + 0.3), u.z + Math.sin(a) * (k + 0.3))) break;
    for (let s = 0; s < 4; s++) setTimeout(() => !u.dead && h2Ghost(u), s * 30);
    moveBy(u, Math.cos(a) * k, Math.sin(a) * k); dust(u.x, u.z, 10); setPose(u, 'slam'); u.st = 'strike'; u.stT = 0.5;
    ring(u.x, u.z, GREEN_P, 2, 0.4); camShake(0.25, 0.25);
    for (const e of porenFoes(u)) if (dist(e, u) < 2) hurt(u, e, u.atk * 1.5, { from: u, kb: 2, stun: 0.5 });
  } }, e => hurt(u, e, u.atk * 0.5, { from: u, kb: 0.6 }), GREEN_P);
}
// 쥐 표식: 물어라!
function porenMark(u, t){
  u.pc.mark = 12; setAim(u, t.x, t.z); setPose(u, 'order'); u.st = 'strike'; u.stT = 0.8; say(u, '물어라!', 'big', 1.2);
  u.mark = t; u.markEnd = G.t + 5; ring(t.x, t.z, 0x7dffb0, 1.2, 0.8); popText(t.x, t.y + bodyH(t) + 0.6, t.z, '쥐 표식', 'alert', 1.2);
  for (let i = 0; i < 3; i++) porenRat(u, i === 0 && Math.random() < 0.3 ? 'knight' : porenRoll() === 'large' ? 'large' : 'small', { extra: 3 });
  const mk = setInterval(() => { if (u.dead || !u.mark || u.mark.dead || G.t > u.markEnd){ clearInterval(mk); return; } ring(u.mark.x, u.mark.z, 0x7dffb0, 0.9, 0.3); }, 500);
}
// 쥐 포박: 다섯 마리가 달라붙음
function porenBind(u, t){
  u.pc.bind = 12; setAim(u, t.x, t.z); setPose(u, 'command2'); u.st = 'strike'; u.stT = 0.8; say(u, '붙잡아!', '', 1);
  const R = porenRats(u).filter(m => !m.bind && dist(m, t) < 6).sort((a, b) => dist(a, t) - dist(b, t)).slice(0, 5);
  while (R.length < 5){ const m = porenRat(u, 'small', { near: true, extra: 5, at: { x: t.x + rnd(-1, 1), z: t.z + rnd(-1, 1) } }); if (!m) break; R.push(m); }
  const T = Math.min(3, R.length * 0.6) * (t.D.boss || t.D.heavy || t.max > 1500 ? 0.5 : 1);
  R.forEach((m, i) => { m.bind = { t, end: G.t + T, a: i / R.length * 6.28 }; m.st = 'idle'; });
  if (!R.length) return;
  t.st = 'hurt'; t.stT = T; if (typeof interrupt === 'function') interrupt(t); t.st = 'hurt'; t.stT = T; setPose(t, t.S.poses.hurt ? 'hurt' : 'idle');
  if (t.B) t.B.act = null;
  t.bindT = G.t + T; popText(t.x, t.y + bodyH(t) + 0.5, t.z, `쥐 포박 ${T.toFixed(1)}초`, 'crit', 1.2); spark(t.x, t.y + 0.6, t.z, 0x7dffb0, 12, 3);
}
// 도발
function porenTaunt(u){
  u.pc.taunt = 10; setPose(u, 'burst'); u.st = 'strike'; u.stT = 0.7; say(u, '쥐들의 대왕 앞이다!', 'big', 1.3); ring(u.x, u.z, GREEN_P, 3.2, 0.6);
  for (const e of porenFoes(u)) if (dist(e, u) < 3.5){ e.focusOn = u; e._engFo = false; popText(e.x, e.y + bodyH(e) + 0.3, e.z, '도발', 'alert', 0.8); }
}
// 쥐 방진: 대검을 꽂고 버팀 → 이중 회전 반격
function porenFort(u){
  u.pc.fort = 14; u._wantFort = false; u.pact = { type: 'fort', t: 0, spun: 0 }; u.fortT = G.t + 2.5; u.st = 'skill'; u.moving = false;
  setPose(u, 'ground'); say(u, '방진!', 'big', 1.2); ring(u.x, u.z, GREEN_P, 1.8, 0.6); camShake(0.2, 0.2);
  const R = porenRats(u).filter(m => dist(m, u) < 8 && !m.bind).slice(0, 8);
  while (R.length < 8){ const m = porenRat(u, Math.random() < 0.3 ? 'mid' : 'small', { near: true, extra: 8 }); if (!m) break; R.push(m); }
  R.forEach((m, i) => { m.fortA = i / R.length * 6.28; });
}
function porenAct(u, dt){
  const A = u.pact; A.t += dt;
  if (A.type === 'fort'){
    u.moving = false;
    if (A.t < 2.5){ if (u.st === 'hurt') u.st = 'skill'; return; }
    if (!A.spun){ A.spun = 1; setPose(u, 'spin'); for (const m of porenRats(u)) m.fortA = null;
      const spin = k => { if (u.dead || u.downed) return; ring(u.x, u.z, GREEN_P, 2.6, 0.35); camShake(0.15, 0.15); for (const e of porenFoes(u)) if (dist(e, u) < 2.6) hurt(u, e, u.atk * 1.3, { from: u, kb: k ? 2 : 0.8, stun: 0.3 }); };
      spin(0); setTimeout(() => spin(1), 350); popText(u.x, u.y + bodyH(u) + 0.6, u.z, '이중 회전 반격', 'crit', 1); }
    if (A.t > 3.3){ u.pact = null; u.st = 'idle'; setPose(u, 'idle'); }
  }
}
// 싸움 끝: 살아남은 이름 있는 쥐는 성장해서 돌아옴
function porenSettle(u){
  if (u.side !== 'ally') return;
  const L = PMEM.load(); let said = [];
  for (const m of porenRats(u)) if (m.rec){ const r = L.find(x => x.n === m.rec.n); if (!r) continue;
    r.ret++; r.lv = Math.min(4, r.lv + 1); if (r.ret >= 3 && !r.vet){ r.vet = true; popText(m.x, m.y + 1.8, m.z, `${r.n} — 베테랑!`, 'crit', 1.6); }
    m.rec = r; said.push(r.n); }
  if (said.length){ PMEM.save(L); popText(u.x, u.y + bodyH(u) + 0.8, u.z, `살아남은 쥐 기사 ${said.join(', ')} — 다음엔 더 커서 옴`, 'heal', 1.8); }
}
/* ---------- 피해 규칙: 쥐 망토 · 막기 · 방진 나눠 받기 · 기억하는 쥐가 죽음 ---------- */
{
  const _hurtP = hurt;
  hurt = function(att, tgt, base, o = {}){
    if (tgt && tgt.D && tgt.D.h2 === 'poren' && !tgt.dead && !tgt.downed && base > 0 && !o._share){
      const R = porenRats(tgt), near = R.filter(m => dist(m, tgt) < 2);
      base *= 1 - Math.min(0.25, 0.03 * near.length);
      if (tgt.fortT > G.t){
        const S = R.filter(m => dist(m, tgt) < 3);
        if (S.length){ const sh = base * 0.7; base -= sh; for (const m of S) _hurtP(att, m, sh / S.length, { from: tgt, kb: 0, _share: true }); }
        o = { ...o, kb: 0, stun: 0 };
      } else if (!o.unblockable && !o.dot && tgt.st === 'idle' && Math.random() < 0.25 && o.from && Math.abs(angDiff(Math.atan2(o.from.z - tgt.z, o.from.x - tgt.x), tgt.aim)) < 1.25){
        base *= 0.3; setPose(tgt, 'block'); popText(tgt.x, tgt.y + bodyH(tgt) + 0.2, tgt.z, '막음', 'miss', 0.6);
      }
      if (base > tgt.max * 0.08 && tgt.pc && tgt.pc.fort <= 0) tgt._wantFort = true;
    }
    const r = _hurtP(att, tgt, base, o);
    if (tgt && tgt.king && tgt.downed && !tgt.dead){ tgt.downed = false; tgt.dead = true; tgt.st = 'dead'; dust(tgt.x, tgt.z, 4); setTimeout(() => { if (tgt.dead) fadeOut(tgt); }, 1500); }   // 쥐는 쓰러지지 않고 죽음 (동료 쪽도)
    if (tgt && tgt.rec && tgt.dead && !tgt._recGone){ tgt._recGone = true; const L = PMEM.load().filter(x => x.n !== tgt.rec.n); PMEM.save(L); popText(tgt.x, tgt.y + 1.4, tgt.z, `${tgt.D.name} 전사`, 'miss', 1.2); }
    return r;
  };
}
// 포박 중인 적은 움직이지 못함
TICKS.push(dt => { for (const u of G.units) if (u.bindT && !u.dead){ if (G.t < u.bindT){ u.moving = false; if (u.st !== 'hurt'){ u.st = 'hurt'; u.stT = u.bindT - G.t; } } else u.bindT = 0; } });
