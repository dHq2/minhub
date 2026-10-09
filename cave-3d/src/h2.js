/* h2.js v2.6 — (v2.6, v0.80 동작 점검: 막기 기술 (성벽 방패 · 바위 갑피 …) 을 막기 그림 없는 인물이 쓰면 공격 그림으로 3 ~ 5초 굳어 있던 것 · 쏘기 · 연사 기술이 예고 중에 기절 · 넘어짐으로 끊겨도 그대로 쏘던 것 (휘청이 풀렸음) · 넘어뜨리기 (trip) 맞은 놈이 누운 채 걷고 치던 것 → 일어날 때까지 (1.2초) 휘청 · 기술을 걷다가 쓰면 걷기 · 달리기 그림 그대로 쏘거나 서 있던 것 → 예고 그림 (없으면 공격 대기 · 서 있음) · 뒤로 빠지기 (backstep) 는 깡충 · 걸을 때 출렁임은 움직임 판정 (motion.js) 을 따라 깜빡이지 않게 · 뒷걸음은 뒤로 기울임) (v2.5, v0.79: 고대사슴 산호 도감 설정 크기 — 몸길이 5m · 등 높이 3m (노트 tall 5.3) · 몸 반경 1.1 → 1.45. 잉끌레이도르 = 잭 (도감 본명, names.js) · 돌장갑 NPC) (v2.4, v0.78: 기술 끝 그림 pose2 를 장판 기술 (베기 · 찌르기 · 찍기 · 마무리 …) 에도 — 칠 때 그 그림. 용묘화: 모아 내려치기 charge → smash · 파내기 · 파묻기 dig → dig2 (도감 움짤)) (v2.3, v0.77: 1차 업뎃 새 동작 프레임 H2MOV (src/h2_mov.js, tools/h2_moves.py) — 걷기 · 달리기 · 맞음 · 기절 · 쓰러짐 · 기술 그림을 노트 동작 위에 덮어씀. 옐로는 새 디자인만 (replace). 걷기 그림이 진짜면 출렁임을 끔) (v2.2: 기사단장은 4성 — 체력 1900 → 340 · 공격 30 → 22 · 보스 · 2페이즈 뺌) (v2.1: 노트의 크기 맞춤은 gscale (scale 은 자를 때 배율이라 쓰면 안 됨 — v2.0 에서 쥐 베테랑 등이 작아지던 것 고침) · 다 큰 쥐 기사 · 쥐 베테랑 키를 인주 · 청광묵과 비슷하거나 살짝 작게) (v2.0: 동작 검토 — 노트의 f (보는 방향) · flat (누운 그림) · scale (크기 맞춤) 을 씀) (v1.9: 쥐 기사 단계를 미리 정할 수 있음 H2.ratLv (포렌의 기억하는 쥐) · 포렌 (poren.js) 이 2기 목록에 붙음) (v1.8: 쥐 기사 성장 단계 1~4 (크기 · 체력 · 공격) · 하르겐 · 마도사 (맨얼굴) 이름) (v1.7: 3기-2 26명 기술표 (포렌의 쥐 · 아해 · 5성 서포터 · 1기 인물 새 시트 · 로젤 · 왕님 · 기사단장) · 패시브 25종 · 거르개 3기-2 / 1기 / 5성 · 포렌의 쥐 분대 단추) (v1.6: 자체점검 — 글만 있던 패시브 19개에 효과 · 주먹 화상 hitSts · 연계 도중 맞거나 넘어지면 끊김 (전엔 경직을 풀어 버림)) (v1.5: 3기 1차 25명 기술표 · 2기 7명 덧붙임 · 패시브 13종 · 소환 kind/hpk) (v1.4: 3기 — 기술 종류 rain 연속 장판 · wave 충격파 · beam 광선 · trap 덫 · combo 연계, 보스 2페이즈 phase · 2페이즈 기술 ph) (v1.3, v0.61: 움직임 기울기도 보이는 방향 fS를 따름) (v1.2: 묶음 그림 H2A (h2_atlas.js)가 있으면 그 칸을 씀 · 얼굴 모음) (v1.1: 기술 이름을 덮던 발수 n → cnt · 이름 괄호 정리 · 등급 묶음 · 패시브 효과 21종 H2PAS) (v1.0, v0.60) 2기 멤버: 드라이브 '2기멤버 동료,적 모음' 1차 반영
   ■ 그림 · 키 · 적성 · 배낭은 h2_roster.js (tools/h2_roster.py가 art/h2/notes/*.json에서 만듦)
   ■ 기술은 아래 H2K (인물마다 손으로 정함 — 그림 (동작)과 짝지음)
   ■ 한 인물이 동료로도 적으로도 나올 수 있음: DEFS['h2_' + slug] (동료) · DEFS['h2e_' + slug] (적)
   ■ 공통 기술 종류 (H2SK): slash 부채꼴 · thrust 찌르기 줄 · slam 둘레 내려찍기 · dash 돌진 줄 · leap 뛰어 내려찍기 · shot 쏘기 (n발)
     · volley 연사 · zone 지정 장판 (늦게 터짐) · heal 치유 · buff 힘 · guard 막기 자세 (+도발) · summon 소환 · finisher 확인사살 · backstep 뒤로
     · pull 끌어오기 · transform 변신
   ■ 패시브: H2PAS (pas[0] 이름 → in · out · tick · kb · dodge · last)
   ■ 훈련장 '2기' 탭: 인물마다 그림 · 노트 요약 · 동료로 부르기 / 적으로 부르기 */
'use strict';
const H2 = { list: [], sk: {} };
// 엔진 동작 이름 ← 노트의 동작 이름 (먼저 있는 것)
const H2POSE = {
  idle: ['idle'], walk: ['walk', 'run', 'idle'], windup: ['windup', 'aim'], attack: ['attack', 'attack2', 'skill', 'windup', 'dash', 'cast', 'slam'],
  hurt: ['hurt', 'guard'], down: ['down', 'dead'], dead: ['dead', 'down'], squat: ['crouch', 'rest'], block: ['guard'], aim: ['aim', 'shoot', 'windup'],
};
const tallOf = o => Math.max((o.tall || 1.7) < 0.6 ? 0.15 : 0.9, Math.min(9, (o.tall || 1.7) * 0.88));   // v1.7 작은 짐승 (일반 쥐 0.25m) 은 0.9 아래로   // m → 게임 키 (인주 1.25 ≈ 1.42m)
function h2Build(){
  if (typeof H2R === 'undefined') return;
  for (const [slug, o] of Object.entries(H2R)){
    const P = o.poses || {}; if (!P.idle) { const k = Object.keys(P)[0]; if (!k) continue; P.idle = P[k]; }
    const AT = typeof H2A !== 'undefined' && H2A[slug];   // 묶음 그림이 있으면 그 칸을 씀 (아티팩트 파일 수 줄이기)
    const pose = p => { const q = { src: p.src, w: p.w, h: p.h, ax: p.ax ?? Math.round(p.w / 2), ay: p.ay ?? p.h - 3, f: p.f || 1, ...(p.flat ? { flat: true } : {}), ...(p.gscale ? { scale: p.gscale } : {}) }, n = AT && Object.keys(P).find(k => P[k] === p), r = n && AT.poses[n];
      if (r){ q.src = AT.src; q.rect = [...r, AT.W, AT.H]; } return q; };
    const poses = {}, MV = typeof H2MOV !== 'undefined' && H2MOV[slug];   // v2.3 1차 업뎃 새 동작 (h2_mov.js)
    if (!(MV && MV.replace)) for (const [k, v] of Object.entries(P)) poses[k] = pose(v);
    if (MV){ for (const [k, p] of Object.entries(MV.poses)) poses[k] = { src: p.src || MV.src, f: 1, ...p }; if (MV.poses.down && !MV.poses.dead) poses.dead = poses.down; }   // 죽음도 새 누운 그림
    for (const [eng, from] of Object.entries(H2POSE)) if (!poses[eng]){ const k = from.find(f => poses[f]); if (k) poses[eng] = poses[k]; }
    SPR['h2_' + slug] = { h0: P.idle.h, tall: tallOf(o), poses, ...(MV && MV.poses.walk && MV.poses.walk.n > 1 ? { mov: true } : {}) };   // mov: 진짜 걷기 그림 (motion.js 가 걷기 · 달리기 · 맞음을 고름)
    const K = H2K[slug] || {}, st = K.st || {}, w = o.weight || st.weight || 70, big = tallOf(o) > 2.4;
    const base = { spr: 'h2_' + slug, name: (o.name || slug).replace(/\s*\(.*\)\s*$/, ''), hp: st.hp || 120, atk: st.atk || 14, spd: st.spd || 3.0, r: st.r || (big ? 0.6 : 0.34), weight: w,
      melee: st.melee || { range: 1.6, arc: 1.6, windup: 0.4, cd: 1.2, mul: 1, kb: 0.6 }, h2: slug, heavy: w >= 200 || big };
    if (st.bow) base.bow = st.bow;
    if (st.armor) base.armor = st.armor;
    DEFS['h2_' + slug] = { ...base };
    DEFS['h2e_' + slug] = { ...base, hp: Math.round(base.hp * (K.boss ? 1 : 1.1)), boss: !!K.boss, think: h2EnemyThink };
    if (typeof FOE_XP !== 'undefined') FOE_XP['h2e_' + slug] = K.boss ? 300 : 30 + (parseInt(o.rank) || 1) * 15;
    if (typeof SOLP !== 'undefined' && o.apt) SOLP['h2_' + slug] = { apt: { melee: 2, spear: 1, bow: 1, gun: 1, magic: 0, stealth: 1, ...o.apt }, tag: o.tag || 'soldier', pas: K.pas || [o.name, ''] };
    H2.list.push(slug);
  }
}
// 기술 하나 쓰기 (동료 · 적 같음). 성공하면 true
function h2Cast(u, s, tgt){
  const d = tgt ? dist(u, tgt) : 0, a = tgt ? Math.atan2(tgt.z - u.z, tgt.x - u.x) : u.aim, P = p => u.S.poses[p] ? p : u.S.poses.attack ? 'attack' : 'idle';
  const hit = (mul, o = {}) => t => { hurt(u, t, u.atk * mul, { from: u, kb: o.kb ?? 0.8, stun: o.stun, crit: o.crit, ranged: o.ranged }); if (o.sts && typeof addStatus === 'function') addStatus(t, o.sts, { t: o.stsT || 3, dps: o.dps || u.atk * 0.2, k: o.stsK || 0.4 }); if (o.trip && !t.D.heavy && !t.D.boss && !t.dead && !t.downed){ interrupt(t); t.lying = true; t.tripT = G.t + 1.2; if (t.st !== 'hurt' || (t.stT || 0) < 1.2){ t.st = 'hurt'; t.stT = 1.2; } setPose(t, 'hurt'); } };   // v2.6 넘어진 놈은 일어날 때까지 못 움직임 (전엔 누운 채 걷고 쳤음)
  if (tgt) setAim(u, tgt.x, tgt.z);
  u.h2cd = u.h2cd || {}; u.h2cd[s.id] = s.cd;
  if (s.say) say(u, s.say, 'big', 1.2); else popText(u.x, u.y + bodyH(u) + 0.5, u.z, s.n, 'alert', 0.8);
  setPose(u, P(s.pose || 'windup'));
  const W = s.windup ?? 0.5;
  u.pose2Next = s.type !== 'volley' && s.type !== 'shot' && s.pose2 || null;   // v2.4 칠 때 그림 (windup() 이 한 번 읽음)
  switch (s.type){
    case 'slash': windup(u, 'sector', { x: u.x, z: u.z, r: s.r || 2.2, a, arc: s.arc || 2.0, windup: W }, hit(s.mul || 1.4, s)); break;
    case 'thrust': windup(u, 'line', { x: u.x, z: u.z, len: s.len || 3.5, w: s.w || 0.9, a, windup: W }, hit(s.mul || 1.5, s)); break;
    case 'slam': windup(u, 'circle', { x: s.atTarget && tgt ? tgt.x : u.x, z: s.atTarget && tgt ? tgt.z : u.z, r: s.r || 2.2, windup: W }, hit(s.mul || 1.6, { kb: 2.2, stun: 0.6, ...s })); break;
    case 'dash': case 'leap': {
      const len = Math.min(s.len || 5, d + 0.6);
      windup(u, 'line', { x: u.x, z: u.z, len, w: s.w || 1.1, a, windup: W, after: () => { let k = 0; for (; k < len; k += 0.3) if (solidAt(G.map, u.x + Math.cos(a) * (k + 0.3), u.z + Math.sin(a) * (k + 0.3))) break; moveBy(u, Math.cos(a) * k, Math.sin(a) * k); dust(u.x, u.z, 8); if (s.type === 'leap'){ ring(u.x, u.z, 0xffd0a0, s.r || 2, 0.4); camShake(0.2, 0.2); for (const t of G.units) if (t.side !== u.side && !t.dead && !t.downed && t.side !== 'neutral' && dist(t, u) < (s.r || 2)) hurt(u, t, u.atk * (s.mul2 || 1.2), { from: u, kb: 2, stun: 0.5 }); } } }, hit(s.mul || 1.3, s));
      break; }
    case 'shot': case 'volley': {
      const n = s.cnt || 1, gap = s.type === 'volley' ? (s.gap || 0.12) : 0;
      u.st = 'windup';
      setTimeout(() => {
        if (u.dead || u.downed || u.st !== 'windup') return; u.st = 'strike'; u.stT = 0.3 + n * gap; setPose(u, P(s.pose2 || 'attack'));   // v2.6 기절 · 넘어짐으로 끊겼으면 쏘지 않음 (전엔 휘청하다가도 쏘고 휘청이 풀렸음)
        for (let i = 0; i < n; i++) setTimeout(() => {
          if (u.dead) return; const sp = (s.spread || 0.06) * (n > 1 && !gap ? (i - (n - 1) / 2) : (Math.random() - 0.5) * 2), aa = (tgt && !tgt.dead ? Math.atan2(tgt.z - u.z, tgt.x - u.x) : a) + sp, y0 = u.y + bodyH(u) * 0.6;
          shoot({ x: u.x + Math.cos(aa) * 0.5, y: y0, z: u.z + Math.sin(aa) * 0.5, a: aa, speed: s.speed || 26, range: s.range || 10, side: u.side, len: s.len || 0.4, thick: s.thick || 0.05, color: s.color || 0xffe08a, glow: s.glow, dy: tgt ? aimDy(u.x, y0, u.z, tgt, s.speed || 26) : 0, hitsAir: true, pierce: s.pierce,
            onHit: (p, t) => hurt(u, t, u.atk * (s.mul || 0.8), { from: { x: p.x - Math.cos(p.a), z: p.z - Math.sin(p.a) }, ranged: true, kb: s.kb || 0.3, fam: s.fam || 'gun' }) });
          spark(u.x + Math.cos(aa) * 0.6, y0, u.z + Math.sin(aa) * 0.6, s.color || 0xffd080, 4, 3);
        }, i * gap * 1000);
      }, W * 1000);
      break; }
    case 'zone': { const x = tgt ? tgt.x : u.x, z = tgt ? tgt.z : u.z; u.st = 'strike'; u.stT = 0.6;
      const dd = decal('circle', { x, z, r: s.r || 2.2, dur: s.delay || 1.2, color: s.color || BLUE, hostile: u.side === 'enemy' });
      dd.onDone = () => { ring(x, z, s.color || 0x9fd0ff, s.r || 2.2, 0.5); camShake(0.15, 0.2); for (const t of G.units) if (t.side !== u.side && t.side !== 'neutral' && !t.dead && !t.downed && Math.hypot(t.x - x, t.z - z) < (s.r || 2.2)) hurt(u, t, u.atk * (s.mul || 1.5), { from: { x, z }, kb: 1.2, stun: s.stun, fam: 'magic' }); };
      break; }
    case 'heal': { u.st = 'strike'; u.stT = 0.7;
      const team = G.units.filter(o => o.side === u.side && !o.dead && dist(o, u) < (s.r || 5));
      for (const o of team){ if (o.downed && s.revive){ revivePut && revivePut(o); continue; } const h = Math.round(o.max * (s.amt || 0.2)); o.hp = Math.min(o.max, o.hp + h); popText(o.x, o.y + bodyH(o) + 0.3, o.z, '+' + h, 'heal', 0.8); }
      ring(u.x, u.z, 0x8dffb0, s.r || 5, 0.6); break; }
    case 'buff': { u.st = 'strike'; u.stT = 0.6; ring(u.x, u.z, 0xffd35a, s.r || 6, 0.6);
      for (const o of G.units) if (o.side === u.side && !o.dead && dist(o, u) < (s.r || 6)){ const k = s.k || 1.25; o.atk = Math.round(o.atk * k); popText(o.x, o.y + bodyH(o) + 0.4, o.z, s.n, 'heal', 0.8); setTimeout(() => { o.atk = Math.round(o.atk / k); }, (s.t || 8) * 1000); }
      break; }
    case 'guard': { u.st = 'strike'; u.stT = s.t || 2.5; u.guardStance = true; setPose(u, u.S.poses.block ? 'block' : u.S.poses[s.pose] ? s.pose : 'idle');   // v2.6 막기 그림이 없으면 기술 그림 (없으면 서 있음) — 전엔 공격 그림으로 3 ~ 5초 굳어 있었음
      if (s.taunt) for (const e of G.units) if (e.side !== u.side && !e.dead && dist(e, u) < (s.r || 5)){ e.focusOn = u; }
      setTimeout(() => { u.guardStance = false; }, (s.t || 2.5) * 1000); break; }
    case 'summon': { u.st = 'strike'; u.stT = 0.8; setPose(u, P(s.pose || 'summon'));
      if ((u.minions || []).filter(m => !m.dead).length >= (s.max || 1)) break;
      const k = s.kind || (u.side === 'enemy' ? 'h2e_' : 'h2_') + s.what; if (!DEFS[k]) break;
      const m = spawn(k, u.x + Math.cos(a) * 1.5, u.z + Math.sin(a) * 1.5, u.side); m.summoner = u; m.alert = true; m.seen = G.t; (u.minions = u.minions || []).push(m);
      if (s.hpk) m.max = m.hp = Math.round(m.D.hp * s.hpk); else if (u.side === 'enemy' && typeof spawnFoe === 'function' && EXP){ m.max = m.hp = Math.round(m.D.hp * 0.8); }
      smoke(m.x, m.z, 6, 1, 1); dust(m.x, m.z, 10); if (s.t) setTimeout(() => { if (!m.dead){ smoke(m.x, m.z, 4, 0.8, 0.8); removeUnit(m); } }, s.t * 1000);
      break; }
    case 'finisher': windup(u, 'sector', { x: u.x, z: u.z, r: s.r || 1.6, a, arc: 1.2, windup: W }, t => hurt(u, t, u.atk * ((t.lying || t.downed || t.st === 'hurt') ? (s.mul || 3) : 1), { from: u, crit: !!(t.lying || t.st === 'hurt'), kb: 0.3 })); break;
    case 'pull': windup(u, 'line', { x: u.x, z: u.z, len: s.len || 6, w: s.w || 0.9, a, windup: W }, t => { hurt(u, t, u.atk * (s.mul || 0.8), { from: u, kb: 0 }); if (!t.D.boss && !t.D.heavy){ const n = norm(u.x - t.x, u.z - t.z), L = Math.max(0, dist(u, t) - 1.2); moveBy(t, n.x * L, n.z * L); t.st = 'hurt'; t.stT = 0.6; popText(t.x, t.y + bodyH(t) + 0.3, t.z, '끌려옴', 'alert', 0.6); } }); break;
    case 'transform': { const to = SPR['h2_' + s.to]; if (!to || u.h2form) break; const S0 = u.S; u.h2form = true; u.S = to; u.atk = Math.round(u.atk * (s.k || 1.5)); ring(u.x, u.z, 0xffd0f0, 2.4, 0.8); spark(u.x, u.y + 1.2, u.z, 0xffe0ff, 24, 5); camShake(0.2, 0.3); setPose(u, 'idle');
      setTimeout(() => { if (u.dead) return; u.S = S0; u.h2form = false; u.atk = Math.round(u.atk / (s.k || 1.5)); spark(u.x, u.y + 1.2, u.z, 0xffe0ff, 12, 3); popText(u.x, u.y + 2, u.z, '변신 풀림', 'miss', 0.8); }, (s.t || 15) * 1000); u.st = 'strike'; u.stT = 0.8; break; }
    // v1.4 (3기) 새 기술 종류
    case 'rain': {   // 연속 장판: 표적 둘레에 n개를 차례로 떨어뜨림 (운석 · 창비 · 낙뢰)
      u.st = 'strike'; u.stT = 0.6; const n = s.cnt || 5, cx = tgt ? tgt.x : u.x, cz = tgt ? tgt.z : u.z;
      for (let i = 0; i < n; i++) setTimeout(() => { if (u.dead) return; const t2 = i === 0 && tgt && !tgt.dead ? tgt : null, x = t2 ? t2.x : cx + rnd(-1, 1) * (s.spread || 3), z = t2 ? t2.z : cz + rnd(-1, 1) * (s.spread || 3), r = s.r || 1.4;
        const dd = decal('circle', { x, z, r, dur: s.delay || 0.9, color: s.color || BLUE, hostile: u.side === 'enemy' });
        dd.onDone = () => { ring(x, z, s.color || 0xffb070, r, 0.35); dust(x, z, 6); for (const t of G.units) if (t.side !== u.side && t.side !== 'neutral' && !t.dead && !t.downed && Math.hypot(t.x - x, t.z - z) < r) hurt(u, t, u.atk * (s.mul || 0.9), { from: { x, z }, kb: 0.8, stun: s.stun, fam: s.fam || 'magic' }); };
      }, i * (s.gap || 0.22) * 1000);
      break; }
    case 'wave': {   // 충격파: 몸에서 둥글게 퍼지는 고리 (가까운 고리부터, 고리 사이에 서면 안 맞음)
      u.st = 'strike'; u.stT = 0.8; camShake(0.18, 0.3); const n = s.cnt || 3, x = u.x, z = u.z;
      for (let i = 0; i < n; i++) setTimeout(() => { if (u.dead) return; const R = (s.r || 2) * (i + 1), w = s.w || 1.1; ring(x, z, s.color || 0xffe0a0, R, 0.4);
        for (const t of G.units) if (t.side !== u.side && t.side !== 'neutral' && !t.dead && !t.downed){ const dd = Math.hypot(t.x - x, t.z - z); if (dd < R && dd > R - w * 1.6) hurt(u, t, u.atk * (s.mul || 1), { from: { x, z }, kb: s.kb || 1.6, stun: s.stun }); } }, W * 1000 + i * (s.gap || 0.3) * 1000);
      decal('circle', { x, z, r: (s.r || 2) * n, dur: W, color: s.color || BLUE, hostile: u.side === 'enemy' });
      break; }
    case 'beam': windup(u, 'line', { x: u.x, z: u.z, len: s.len || 12, w: s.w || 1.4, a, windup: W }, hit(s.mul || 2, { kb: 1.2, ...s })); camShake(0.1, 0.2); break;   // 광선: 길고 굵은 줄, 예고가 김
    case 'trap': {   // 덫 · 감옥: 표적 발밑에 늦게 닫히는 원 → 걸리면 오래 묶임
      u.st = 'strike'; u.stT = 0.5; const x = tgt ? tgt.x : u.x, z = tgt ? tgt.z : u.z, r = s.r || 1.5;
      const dd = decal('circle', { x, z, r, dur: s.delay || 1.0, color: s.color || 0xc070ff, hostile: u.side === 'enemy' });
      dd.onDone = () => { ring(x, z, s.color || 0xc070ff, r, 0.6); for (const t of G.units) if (t.side !== u.side && t.side !== 'neutral' && !t.dead && !t.downed && Math.hypot(t.x - x, t.z - z) < r){ hurt(u, t, u.atk * (s.mul || 0.6), { from: { x, z }, kb: 0, stun: s.stun || 2.2 }); popText(t.x, t.y + bodyH(t) + 0.3, t.z, s.tag || '갇힘', 'alert', 0.9); } };
      break; }
    case 'combo': {   // 연계: 여러 기술을 차례로 (sub: [기술, …], gap 초)
      const subs = s.sub || []; let tm = 0;
      for (const x of subs){ setTimeout(() => { if (u.dead || u.downed || u.lying || u.st === 'hurt' || u.grabbed) return; u.st = 'idle'; h2Cast(u, { cd: 0, id: s.id + '_' + x.type, n: x.n || s.n, ...x }, tgt && !tgt.dead ? tgt : null); }, tm * 1000); tm += (x.windup ?? 0.4) + (s.gap || 0.35); }
      u.h2cd[s.id] = s.cd; break; }
    case 'backstep': { const n = norm(u.x - (tgt ? tgt.x : u.x + 1), u.z - (tgt ? tgt.z : u.z)); moveBy(u, n.x * (s.len || 2.4), n.z * (s.len || 2.4)); dust(u.x, u.z, 5); u.st = 'strike'; u.stT = 0.35; u._dodgeS = G.t; u._dodgeT = G.t + 0.3; break; }   // v2.6 깡충 (motion.js)
  }
  if (u.st !== 'idle' && (u.pose === 'walk' || u.pose === 'walkB' || u.pose === 'run')) setPose(u, u.S.poses.windup ? 'windup' : u.S.poses.ready ? 'ready' : 'idle');   // v2.6 걷다가 쓴 기술: 걷기 그림 그대로 쏘지 않게
  u.pose2Next = null;
  return true;
}
// 쓸 만한 기술 고르기
function h2Pick(u, tgt){
  const K = H2K[u.D.h2]; if (!K || !K.sk || !tgt) return null;
  const d = dist(u, tgt), cd = u.h2cd || {};
  for (const s of K.sk){
    if ((cd[s.id] || 0) > 0) continue;
    if (s.ph && !u.h2ph) continue;   // 2페이즈 기술
    if (s.type === 'heal'){ if (G.units.some(o => o.side === u.side && !o.dead && (o.downed && s.revive || o.hp < o.max * 0.55) && dist(o, u) < (s.r || 5))) return s; continue; }
    if (s.type === 'buff' || s.type === 'summon'){ if (d < (s.use || 10)) return s; continue; }
    if (s.type === 'guard'){ if (d < (s.use || 3) && Math.random() < 0.5) return s; continue; }
    if (s.type === 'finisher'){ if (d < 2 && (tgt.lying || tgt.downed || tgt.st === 'hurt')) return s; continue; }
    if (s.type === 'backstep'){ if (d < 1.4) return s; continue; }
    if (d <= (s.use || 3) && d >= (s.min || 0)) return s;
  }
  return null;
}
function h2Tick(u, dt){
  if (u.h2cd) for (const k in u.h2cd) u.h2cd[k] -= dt;
  // v1.4 보스 2페이즈: K.phase = { at: 체력 비율, k: 공격 배율, spd: 속도 배율, say, pose (바꿀 서 있는 그림) }
  const K = H2K[u.D.h2], P = K && K.phase;
  if (P && !u.h2ph && !u.dead && u.hp < u.max * (P.at || 0.5)){
    u.h2ph = true; u.atk = Math.round(u.atk * (P.k || 1.3)); u.spd *= P.spd || 1.15; u.h2cd = {};
    if (P.pose && u.S.poses[P.pose]) u.S = { ...u.S, poses: { ...u.S.poses, idle: u.S.poses[P.pose] } };
    ring(u.x, u.z, 0xff4060, 3.2, 0.9); camShake(0.35, 0.5); spark(u.x, u.y + 1.5, u.z, 0xff6080, 30, 6);
    say(u, P.say || '……이제부터다.', 'big', 2); popText(u.x, u.y + bodyH(u) + 0.8, u.z, '2페이즈', 'alert', 1.4);
  }
}
// 적: 기술이 있으면 쓰고, 아니면 보통 적 두뇌 (근접 · 활)
function h2EnemyThink(u, dt){
  h2Tick(u, dt);
  if (u.alert && u.st === 'idle' && !u.lock && !G.lock && !(u.prowl && !u.revealed)){
    const t = nearest(u, G.units.filter(a => a.side === 'ally' && !a.dead && !a.downed), 30), s = t && h2Pick(u, t);
    if (s && Math.random() < dt * 4) return void h2Cast(u, s, t);
  }
  return enemyThink(u, dt);
}
// 동료: 기술 (싸울 때)
{
  const _hc = typeof heroCombat === 'function' ? heroCombat : null;
  heroCombat = function(u, dt){
    if (u.D && u.D.h2){
      h2Tick(u, dt);
      if (u.st === 'idle' && !u.lock && !G.lock && !u.downed && !u.escape){   // v2.6 피하려는 참엔 기술을 걸지 않음 (걸자마자 끊겨 그림이 깜빡이던 것)
        const t = nearest(u, foes().filter(e => e.alert && !e.dead && !e.D.dummy), 14), s = t && h2Pick(u, t);
        if (s && Math.random() < dt * 3){ h2Cast(u, s, t); return true; }
      }
    }
    return _hc ? _hc(u, dt) : false;
  };
}

/* ---------- 기술표 (인물마다): st = 능력치, sk = 기술, pas = 패시브 [이름, 설명], boss = 보스 ---------- */

/* ---------- 대충 움직이기 (그림이 한 장씩이라 몸을 눌렀다 폈다 · 기울여 살아 있게) ----------
   · 서 있음: 숨쉬기 (세로 1.5% · 3초)
   · 걸음: 위아래 출렁 + 앞으로 기울임 (걸음 그림이 없으면)
   · 예고 (windup): 뒤로 젖히며 움츠림 → 침 (strike): 앞으로 쭉 + 살짝 늘어남
   · 맞음: 좌우로 떨림 · 기술: 둘레가 빛남 (잔광) · 돌진: 잔상 */
const _updateSpriteH2 = updateSprite;
updateSprite = function(u, dt){
  _updateSpriteH2(u, dt);
  if (!u.D || !u.D.h2 || u.dead) return;
  const t = G.t + (u.uid || 0) * 0.37, m = u.mesh, f = -(u.fS ?? u.face);
  let sy = 1, sx = 1, rz = 0, dy = 0;
  if (u.downed || u.lying) return;
  if (u.st === 'windup'){ const k = Math.min(1, u.poseT / 0.35); sy = 1 - 0.06 * k; sx = 1 + 0.04 * k; rz = -0.1 * k * f; }
  else if (u.st === 'strike'){ const k = Math.max(0, 1 - u.poseT / 0.25); sy = 1 + 0.05 * k; sx = 1 - 0.03 * k; rz = 0.16 * k * f; }
  else if (u.st === 'hurt'){ rz = Math.sin(t * 60) * 0.05; }
  else if ((u._mvOn ?? u.moving) && !u.S.poses.walk_real && !u.S.mov && !(u._dodgeT > G.t) && !(u.lift > 0.05)){ const w = t * (u._runOn ? 11 : 9); dy = Math.abs(Math.sin(w)) * 0.06; rz = (u._bp ? -0.035 : 0.06) * f + Math.sin(w) * 0.02; }   // v2.3 진짜 걷기 그림이면 출렁임 없음 · v2.6 움직임 판정 (motion.js) 을 따름 · 뒷걸음은 뒤로
  else { sy = 1 + Math.sin(t * 2.1) * 0.015; }
  m.scale.y *= sy; m.scale.x *= sx; m.position.y *= sy; u.pivot.rotation.z += rz; u.pivot.position.y += dy;
  // 잔상: 빨리 움직이는 동안
  const sp = u._lp2 ? Math.hypot(u.x - u._lp2.x, u.z - u._lp2.z) / Math.max(dt, 1e-3) : 0; u._lp2 = { x: u.x, z: u.z };
  if (sp > 7 && (u._gh = (u._gh || 0) - dt) <= 0){ u._gh = 0.05; h2Ghost(u); }
};
function h2Ghost(u){
  const g = new THREE.Mesh(u.mesh.geometry, new THREE.MeshBasicMaterial({ map: u.mat.map, transparent: true, opacity: 0.45, depthWrite: false, color: u.side === 'enemy' ? 0xff9a9a : 0x9fd0ff }));
  g.scale.copy(u.mesh.scale); u.mesh.getWorldPosition(g.position); u.mesh.getWorldQuaternion(g.quaternion); G.scene.add(g);
  const t0 = G.t; const step = () => { const k = (G.t - t0) / 0.3; if (k >= 1 || !G.scene){ G.scene.remove(g); g.material.dispose(); return; } g.material.opacity = 0.45 * (1 - k); requestAnimationFrame(step); }; requestAnimationFrame(step);
}
// sk(id, 이름, 종류, 그림, 대기, 쓰는 거리, 덧붙임)
const sk = (id, n, type, pose, cd, use, o = {}) => ({ id, n, type, pose, cd, use, ...o });
const ML = (range, mul = 1, windup = 0.4, cd = 1.2, arc = 1.6, kb = 0.6) => ({ range, arc, windup, cd, mul, kb });
const H2K = {
  // ── 1성 ──
  bel: { st: { hp: 95, atk: 11, spd: 3.4, melee: ML(1.3, 0.6), bow: { range: 10, windup: 0.3, cd: 0.7, speed: 34 } }, pas: ['인공 후광', '아군 곁에서 명중 +10%'],
    sk: [sk('barrage', '천사의 탄막', 'volley', 'jump', 7, 9, { cnt: 8, gap: 0.08, mul: 0.5, pose2: 'jump', spread: 0.25, color: 0xfff0b0, glow: 0xffe08a }), sk('low', '낮은 사격', 'shot', 'low', 4, 7, { cnt: 2, mul: 0.8, sts: 'slow' }), sk('cover', '엄호 자세', 'volley', 'crouch', 9, 10, { cnt: 5, gap: 0.15, mul: 0.6, pose2: 'crouch' })] },
  gari: { st: { hp: 170, atk: 17, spd: 3.4, melee: ML(1.4, 0.9, 0.25, 0.75, 1.4) }, pas: ['뒷골목 맷집', '체력 30% 아래에서 공격 +20%'],
    sk: [sk('body', '바디블로', 'thrust', 'attack2', 4, 1.8, { len: 1.8, mul: 1.5, stun: 0.6 }), sk('elbow', '엘보 훅', 'slash', 'attack3', 6, 1.6, { r: 1.7, arc: 1.4, mul: 2, crit: true }), sk('hold', '버티기', 'guard', 'guard', 9, 2.5, { t: 2 })] },
  rook: { st: { hp: 180, atk: 15, spd: 2.8, melee: ML(2.4, 1, 0.45, 1.3, 0.9), armor: 0.8 }, pas: ['대방패', '정면 원거리 피해 40% 감소'],
    sk: [sk('rush', '방패 돌진', 'dash', 'dash', 7, 5, { len: 5, mul: 1, trip: true }), sk('wall', '창벽', 'guard', 'guard', 8, 4, { t: 3, taunt: true }), sk('low', '땅 찌르기', 'finisher', 'low', 4, 2, { mul: 2.5 })] },
  goldknight: { st: { hp: 175, atk: 17, spd: 3.0, melee: ML(1.9, 1.1, 0.45, 1.25, 2.0) }, pas: ['기사의 맹세', '아군이 쓰러지면 공격 +25%'],
    sk: [sk('lunge', '관통 찌르기', 'thrust', 'attack2', 5, 3.2, { len: 3.4, mul: 1.6, windup: 0.45 }), sk('parry', '검 세우기', 'guard', 'guard', 8, 2.2, { t: 1.5 }), sk('breath', '숨 고르기', 'buff', 'windup', 14, 4, { k: 1.4, t: 5, r: 0.5 })] },
  pearl: { st: { hp: 110, atk: 14, spd: 3.6, melee: ML(1.4, 0.9, 0.3, 1.0, 1.4, 1.4) }, pas: ['타천 날개', '떨어져도 다치지 않음'],
    sk: [sk('feather', '철 깃털', 'shot', 'special', 6, 8, { cnt: 5, spread: 0.12, mul: 0.6, color: 0xc8d0e0, len: 0.5, sts: 'bleed', fam: 'magic' }), sk('land', '꼬깃꼬깃 착지', 'leap', 'land', 8, 5, { len: 5, r: 2, mul: 0.6, mul2: 1.3 }), sk('wrap', '움츠리기', 'guard', 'crouch', 10, 2, { t: 2 })] },
  whistle: { st: { hp: 125, atk: 17, spd: 3.6, melee: ML(1.9, 1.1, 0.3, 0.95, 2.0) }, pas: ['무심', '첫 공격은 늘 치명'],
    sk: [sk('red', '붉은 검기', 'slash', 'attack', 5, 2.8, { r: 3, arc: 3.0, mul: 1.5, sts: 'bleed' }), sk('flash', '수평 일섬', 'dash', 'attack2', 6, 4, { len: 4, mul: 1.7, w: 0.8 }), sk('taunt', '도발', 'guard', 'taunt', 12, 4, { t: 2.5, taunt: true })] },
  gundevil: { st: { hp: 100, atk: 12, spd: 3.5, melee: ML(1.3, 0.6), bow: { range: 10, windup: 0.3, cd: 0.6, speed: 34 } }, pas: ['악마의 뿔', '어두운 곳에서 치명 +15%'],
    sk: [sk('jumpfire', '도약 난사', 'volley', 'jump', 7, 9, { cnt: 6, gap: 0.08, mul: 0.55, pose2: 'jump', spread: 0.2 }), sk('ground', '발밑 사격', 'zone', 'low', 6, 4, { r: 1.8, delay: 0.4, mul: 1, color: 0xffb070, sts: 'slow' }), sk('prone', '엎드려쏴', 'volley', 'prone', 10, 11, { cnt: 4, gap: 0.2, mul: 0.9, pose2: 'prone' })] },
  ohe: { st: { hp: 95, atk: 14, spd: 3.8, melee: ML(1.4, 1, 0.25, 0.85) }, pas: ['악마의 눈', '어둠에서 잘 봄 · 빛에 약함'],
    sk: [sk('claw', '뒤에서 할퀴기', 'slash', 'sneak', 4, 1.8, { r: 1.7, mul: 1.6, sts: 'bleed' })] },
  // ── 2성 ──
  venti: { st: { hp: 210, atk: 16, spd: 2.8, melee: ML(1.8, 1, 0.45, 1.3, 1.0), armor: 0.75 }, pas: ['중장갑', '넘어짐 저항 · 화살 피해 -20%'],
    sk: [sk('bash', '방패 밀치기', 'slam', 'bash', 6, 1.6, { r: 1.5, mul: 0.6, kb: 3, stun: 0.8 }), sk('wall', '청동 벽', 'guard', 'guard', 9, 3, { t: 3, taunt: true }), sk('deep', '낮은 찌르기', 'dash', 'attack2', 7, 3, { len: 2.6, mul: 1.6 })] },
  inclador: { st: { hp: 135, atk: 18, spd: 3.4, melee: ML(1.3, 1.2, 0.35, 1.0, 1.2) }, pas: ['흉터', '피 30% 아래 공격 속도 +25%'],
    sk: [sk('nail', '못 빼기', 'slash', 'windup', 7, 1.6, { r: 1.5, arc: 1.2, mul: 1.4, sts: 'mark', stsT: 5 }), sk('laugh', '미친 웃음', 'guard', 'idle', 14, 3, { t: 1, taunt: true, say: '킥킥킥킥…!' })] },
  kanya: { st: { hp: 190, atk: 16, spd: 3.0, melee: ML(2.0, 1, 0.4, 1.15, 1.2) }, pas: ['남색 결의', '뒤에 사수가 있으면 방어 +15%'],
    sk: [sk('charge', '방패 돌진', 'dash', 'jump', 7, 4.5, { len: 4, mul: 1.1, trip: true }), sk('stance', '검방 자세', 'guard', 'guard', 8, 2.5, { t: 2 }), sk('kneel', '무릎 방벽', 'guard', 'crouch', 12, 6, { t: 3.5, use: 8 })] },
  tank: { st: { hp: 300, atk: 18, spd: 2.4, melee: ML(1.8, 1.2, 0.6, 1.6, 1.6, 1.4), armor: 0.6, r: 0.45 }, pas: ['청록 바이저', '어둠 · 연기 속에서도 봄 · 넘어짐 저항'],
    sk: [sk('smash', '내려찍기', 'slam', 'attack2', 7, 2.2, { r: 2.2, mul: 1.6, trip: true, windup: 0.7 }), sk('sweep', '다리 쓸기', 'slash', 'low', 6, 2, { r: 2.2, arc: 2.1, mul: 0.9, trip: true }), sk('wall', '강철 방벽', 'guard', 'guard', 10, 4, { t: 3.5, taunt: true, r: 6 })] },
  dolsoe: { st: { hp: 140, atk: 16, spd: 3.6, melee: ML(1.5, 1.1, 0.4, 1.0, 1.4) }, pas: ['복면', '은신 중 첫 공격 +40%'],
    sk: [sk('hook', '갈고리 걸기', 'pull', 'low', 7, 4, { len: 4, mul: 0.6 }), sk('twist', '비틀어 치기', 'slash', 'attack2', 5, 2, { r: 2.2, arc: 3.2, mul: 1.3 })] },
  madangsoe: { st: { hp: 175, atk: 17, spd: 3.6, melee: ML(1.2, 0.9, 0.22, 0.7, 1.3) }, pas: ['황금 늑대 가면', '돌쇠와 함께면 회복'],
    sk: [sk('kick', '늑대 날아차기', 'dash', 'kick', 6, 3.5, { len: 3, mul: 1.5, kb: 2.5 }), sk('quake', '땅 울리기', 'slam', 'special', 8, 2, { r: 2.5, mul: 1.1, trip: true }), sk('guard', '가드 올리기', 'guard', 'guard', 8, 2, { t: 1.6 })] },
  bishot: { st: { hp: 160, atk: 19, spd: 3.4, melee: ML(1.5, 1.1, 0.35, 0.95, 1.4) }, pas: ['초인계 마수', '불에 강함 · 주먹마다 화상'],
    sk: [sk('fire', '점핑파이어', 'slam', 'special', 7, 2, { r: 2, mul: 1.4, sts: 'burn', color: 0xff7030 }), sk('slam', '내려찍기', 'thrust', 'finisher', 7, 3, { len: 3, w: 1.4, mul: 1.6, sts: 'burn' }), sk('fin', '확인사살', 'finisher', 'finisher', 5, 2, { mul: 3 })] },
  gandu: { st: { hp: 120, atk: 13, spd: 3.3, melee: ML(1.3, 0.6), bow: { range: 12, windup: 0.4, cd: 0.9, speed: 36 } }, pas: ['의리파', '곁의 아군이 쓰러지면 5초 공격 +30%'],
    sk: [sk('back', '백스텝 사격', 'backstep', 'backstep', 6, 2, { len: 3 }), sk('sit', '앉아쏴', 'volley', 'crouch', 8, 12, { cnt: 3, gap: 0.3, mul: 1.1, pose2: 'crouch', spread: 0.02 }), sk('fin', '확인사살', 'finisher', 'finisher', 5, 2, { mul: 3 })] },
  // ── 3성 ──
  sanddalgi: { st: { hp: 140, atk: 15, spd: 3.0, melee: ML(1.8, 0.9, 0.4, 1.2, 1.6, 1.0) }, pas: ['대정령의 숲', '곁의 아군 체력이 조금씩 참'],
    sk: [sk('vine', '덩굴 속박', 'zone', 'skill', 7, 9, { r: 2, delay: 0.8, mul: 1.0, stun: 2, color: 0x7dff6a }), sk('leaf', '수정잎 방벽', 'guard', 'guard', 10, 4, { t: 3 }), sk('heal', '정령의 손짓', 'heal', 'cast', 9, 10, { r: 6, amt: 0.2 })] },
  tanga: { st: { hp: 230, atk: 22, spd: 3.3, melee: ML(2.6, 1.2, 0.45, 1.2, 2.2, 1.0) }, pas: ['용사의 기세', '적을 쓰러뜨리면 다음 공격 +30%'],
    sk: [sk('air', '공중 참격', 'leap', 'jump', 8, 6, { len: 6, r: 2, mul: 0.8, mul2: 1.8 }), sk('hook', '갈고리 찌르기', 'pull', 'attack2', 7, 4, { len: 4, mul: 1.2 }), sk('flash', '일섬', 'dash', 'attack3', 9, 6, { len: 6, mul: 2.2, w: 1, windup: 0.7 }), sk('guard', '수비', 'guard', 'guard', 9, 2.5, { t: 2 })] },
  gallia: { st: { hp: 260, atk: 21, spd: 2.9, melee: ML(2.6, 1.2, 0.5, 1.3, 2.4, 1.2), armor: 0.75 }, pas: ['장군의 위엄', '곁 아군 방어 +10% · 넉백 면역'],
    sk: [sk('split', '대지 가르기', 'thrust', 'attack3', 8, 5, { len: 5, w: 1.3, mul: 1.6, trip: true, windup: 0.7 }), sk('leap', '도약 강타', 'leap', 'jump', 9, 6, { len: 6, r: 2.5, mul: 0.6, mul2: 1.7 }), sk('pierce', '장군의 찌르기', 'thrust', 'attack2', 6, 4, { len: 4, w: 0.8, mul: 1.8, windup: 0.6 }), sk('wall', '철벽', 'guard', 'guard', 10, 3, { t: 3 })] },
  langpang: { st: { hp: 115, atk: 15, spd: 3.3, melee: ML(1.4, 0.8) }, pas: ['이계 탐험가', '함정 피해 반 · 상자 · 유물 +1'],
    sk: [sk('shock', '마력 충격', 'thrust', 'attack', 4, 6, { len: 6, w: 1.4, mul: 1.0, kb: 1.6, windup: 0.35 }), sk('gear', '톱니 마법진', 'zone', 'skill', 9, 3, { r: 2.2, delay: 0.3, mul: 1.3, color: 0xffd080 }), sk('disch', '지면 방전', 'slam', 'special', 9, 3, { r: 3, mul: 1.2, stun: 1.5, sts: 'shock', stsT: 1 })] },
  changra: { st: { hp: 320, atk: 22, spd: 2.7, melee: ML(2.0, 1.3, 0.5, 1.3, 1.6, 2.2), r: 0.5 }, pas: ['거구', '넉백 · 경직에 강함'],
    sk: [sk('quake', '대지 찍기', 'slam', 'attack2', 8, 3, { r: 3, mul: 1.4, trip: true, windup: 0.7 }), sk('charge', '돌격', 'dash', 'dash', 8, 8, { len: 8, mul: 1.4, stun: 1, kb: 3 }), sk('rock', '바위 막기', 'guard', 'guard', 10, 3, { t: 3 })] },
  hari: { st: { hp: 115, atk: 16, spd: 3.2, melee: ML(1.6, 0.8), bow: { range: 10, windup: 0.45, cd: 1.1, speed: 22 } }, pas: ['깃털귀 천사', '은신 중 첫 마법 +40%'],
    sk: [sk('abyss', '심연 내려찍기', 'slam', 'attack2', 7, 2.5, { r: 2.5, mul: 1.6, color: 0xb070ff }), sk('vortex', '보라 소용돌이', 'zone', 'skill', 10, 8, { r: 2.6, delay: 1.0, mul: 1.8, stun: 1, color: 0xb070ff }), sk('guard', '지팡이 막기', 'backstep', 'guard', 6, 1.5, { len: 2.5 })] },
  // ── 4성 ──
  levi: { st: { hp: 140, atk: 16, spd: 3.2, melee: ML(1.5, 0.9), bow: { range: 12, windup: 0.4, cd: 0.8, speed: 38 } }, pas: ['계약의 그림자', '위험하면 소환수가 나타나 막음'],
    sk: [sk('beast', '그림자 용 소환', 'summon', 'summon', 18, 12, { what: 'levi_beast', t: 14, max: 1 }), sk('knee', '무릎 강타', 'slam', 'special', 7, 2, { r: 2.2, mul: 1.2, kb: 2.4 }), sk('kneel', '무릎 쏴', 'volley', 'crouch', 8, 13, { cnt: 3, gap: 0.35, mul: 1.3, pose2: 'crouch', spread: 0.02, speed: 44 })] },
  levi_beast: { st: { hp: 260, atk: 24, spd: 4.2, melee: ML(2.2, 1.2, 0.35, 1.0, 2.0, 2.0), r: 0.7 }, pas: ['그림자 몸', '시간이 지나면 사라짐'],
    sk: [sk('dash', '돌진', 'dash', 'dash', 5, 8, { len: 8, mul: 1.5, kb: 3, trip: true, windup: 0.35 })] },
  joshua: { st: { hp: 340, atk: 20, spd: 2.8, melee: ML(1.8, 1.2, 0.4, 1.1, 1.4, 1.6), armor: 0.8, r: 0.48 }, pas: ['갑각 장갑', '물리 피해 -20% · 넉백 면역'],
    sk: [sk('smash', '지면 강타', 'slash', 'special', 8, 3, { r: 3.2, arc: 1.6, mul: 1.5, stun: 1.2, windup: 0.6 }), sk('cable', '케이블 채찍', 'pull', 'skill', 8, 6, { len: 6, mul: 0.9 }), sk('wall', '철벽', 'guard', 'guard', 10, 3, { t: 3, taunt: true })] },
  yuli: { st: { hp: 130, atk: 17, spd: 3.3, melee: ML(1.4, 0.9), bow: { range: 9, windup: 0.4, cd: 1.0, speed: 20 } }, pas: ['얼굴 없는 자', '어둠 속에서 늦게 발견됨'],
    sk: [sk('orb', '중력구', 'zone', 'skill', 9, 8, { r: 2.8, delay: 1.1, mul: 1.4, stun: 1.6, color: 0x6040a0 }), sk('erupt', '그림자 분출', 'slam', 'special', 7, 2.5, { r: 2.5, mul: 1.4, sts: 'slow', color: 0x402060 }), sk('wall', '그림자 벽', 'guard', 'guard', 10, 6, { t: 3 }), sk('knife', '그림자 단검', 'thrust', 'ready', 5, 2, { len: 2, mul: 1.8, crit: true })] },
  sosucha: { st: { hp: 150, atk: 19, spd: 3.9, melee: ML(1.3, 1.0, 0.22, 0.7, 1.3) }, pas: ['악마의 몸', '빠르고 회피 +15%'],
    sk: [sk('kick', '공중 옆차기', 'dash', 'attack3', 5, 4, { len: 4, mul: 1.4, kb: 2 }), sk('stomp', '진각', 'slam', 'attack2', 7, 2, { r: 2, mul: 1.2, trip: true }), sk('soul', '영혼검', 'thrust', 'windup', 9, 3.5, { len: 3.6, w: 1.2, mul: 2.2, windup: 0.6 }), sk('flame', '마젠타 불꽃', 'shot', 'skill', 6, 8, { cnt: 3, spread: 0.15, mul: 0.8, color: 0xff40c0, glow: 0xff40c0, sts: 'burn', fam: 'magic', speed: 18 })] },
  gun: { st: { hp: 200, atk: 19, spd: 3.3, melee: ML(2.2, 1.1, 0.4, 1.1, 1.0) }, pas: ['차원 영웅', '곤봉 · 조율봉 · 권총을 바꿔 듦'],
    sk: [sk('swing', '브레이커 휘두르기', 'slash', 'attack2', 5, 2.5, { r: 2.6, arc: 2.6, mul: 1.3 }), sk('crush', '지면 분쇄', 'slam', 'special', 8, 2.5, { r: 2.6, mul: 1.5, sts: 'mark', stsT: 5 }), sk('tune', '차원 조율', 'buff', 'rod', 15, 8, { k: 1.25, t: 8 }), sk('pistol', '예비 권총', 'volley', 'pistol', 6, 9, { cnt: 3, gap: 0.18, mul: 0.7, pose2: 'pistol' })] },
  // ── 가람 · 히라리 ──
  garam: { st: { hp: 150, atk: 19, spd: 3.7, melee: ML(2.1, 1.1, 0.3, 0.9, 1.0) }, pas: ['그림자 검사', '은신 · 포복 뒤 첫 공격 치명'],
    sk: [sk('rise', '청록 검기 올려베기', 'slash', 'special', 6, 3.5, { r: 4, arc: 1.6, mul: 1.7, windup: 0.35 }), sk('fin', '확인사살', 'finisher', 'finisher', 5, 2, { mul: 3.2 }), sk('guard', '사선 막기', 'guard', 'guard', 7, 2, { t: 1.2 })] },
  garam2: { st: { hp: 175, atk: 20, spd: 3.5, melee: ML(2.4, 1.1, 0.35, 1.0, 1.0) }, pas: ['찢긴 망토', '회피 +10%'],
    sk: [sk('leap', '도약 베기', 'leap', 'attack2', 7, 4, { len: 4, r: 2, mul: 0.8, mul2: 1.6 }), sk('low', '낮은 자세 베기', 'slash', 'low', 6, 2, { r: 2, arc: 1.8, mul: 1.1, sts: 'slow' }), sk('guard', '겨눔', 'guard', 'guard', 8, 2, { t: 1.5 })] },
  hirari: { st: { hp: 105, atk: 14, spd: 3.3, melee: ML(1.3, 0.7), bow: { range: 8, windup: 0.35, cd: 0.9, speed: 20 } }, pas: ['후광', '곁의 아군 정신도 회복 · 때가 되면 변신'],
    sk: [sk('pyororong', '뾰로롱', 'heal', 'skill', 8, 10, { r: 7, amt: 0.18, say: '뾰로롱~!' }), sk('stars', '별똥별 무리', 'zone', 'special', 9, 8, { r: 3, delay: 1.0, mul: 1.6, color: 0xffd0f0 }), sk('ground', '땅별 터뜨리기', 'slam', 'low', 6, 2, { r: 2, mul: 1.1, color: 0xffd0f0 }), sk('grow', '변신', 'transform', 'special', 40, 8, { to: 'hirari2', t: 18, k: 1.6, say: '히라히라 — 변신!' })] },
  hirari2: { st: { hp: 150, atk: 20, spd: 3.4, melee: ML(2.4, 1.1, 0.35, 1.0, 1.8) }, pas: ['성장한 천사', '변신 동안 받는 피해 -20%'],
    sk: [sk('light', '천상 광휘', 'slash', 'special', 7, 4.5, { r: 5, arc: 1.6, mul: 1.8, color: 0xfff0b0 }), sk('ground', '대지 내려치기', 'slam', 'low', 7, 2.5, { r: 2.6, mul: 1.3, trip: true }), sk('guard', '지팡이 막기', 'guard', 'guard', 8, 2, { t: 1.5 })] },
  manghyang: { st: { hp: 155, atk: 18, spd: 3.7, melee: ML(1.7, 0.7, 0.25, 0.65, 1.6) }, pas: ['이계의 몸', '쓰러질 때 한 번 1로 버팀'],
    sk: [sk('rush', '돌진 할퀴기', 'dash', 'attack', 6, 4, { len: 4, mul: 1.4, sts: 'bleed' }), sk('x', '엑스 막기', 'guard', 'guard', 8, 2, { t: 1.5 })] },
  // ── 적 · 강적 ──
  makarov: { st: { hp: 520, atk: 26, spd: 2.6, melee: ML(2.5, 1.2, 0.55, 1.5, 2.6, 1.8), armor: 0.7, r: 0.5 }, pas: ['뼈갑옷', '앞에서 오는 화살 · 총알 -30%'],
    sk: [sk('smash', '내려찍기', 'slam', 'attack2', 7, 3, { r: 3, atTarget: true, mul: 1.6, stun: 1, windup: 0.9 }), sk('leap', '도약 강타', 'leap', 'jump', 9, 6, { len: 6, r: 2.4, mul: 0.6, mul2: 1.8, windup: 0.6 }), sk('sweep', '쓸어치기', 'slash', 'attack', 6, 2.6, { r: 3, arc: 3.2, mul: 1.2 })] },
  shedor: { st: { hp: 170, atk: 18, spd: 3.5, melee: ML(2.0, 1.1, 0.4, 1.1, 1.6) }, pas: ['웃는 가면', '속임수 · 배신'],
    sk: [sk('betray', '배신의 일격', 'slash', 'windup', 7, 2.4, { r: 2.4, arc: 1.8, mul: 2.0, windup: 0.7 }), sk('guard', '겨눔', 'guard', 'guard', 8, 2, { t: 1.6 }), sk('kneel', '무릎 꿇는 척', 'guard', 'crouch', 20, 2, { t: 1.2, say: '…살려 줘.' })] },
  // ── 보스 ──
  hadim: { boss: true, st: { hp: 1600, atk: 34, spd: 2.8, melee: ML(3.0, 1.2, 0.6, 1.5, 2.6, 2.0), armor: 0.75, r: 0.6, weight: 260 }, pas: ['찢긴 망토', '피가 반 아래면 더 빨라짐'],
    sk: [sk('tear', '찢는 일격', 'thrust', 'attack', 6, 4, { len: 4.5, w: 1.6, mul: 1.5, sts: 'bleed', windup: 0.7 }), sk('bone', '뼈날개 개방', 'slam', 'special', 12, 4, { r: 4, mul: 1.8, stun: 0.8, windup: 1.2, say: '크하하하…!' }), sk('mock', '비웃음', 'guard', 'idle2', 16, 6, { t: 1.2, taunt: true, say: '…약하군.' })] },
  cheonmyeong: { boss: true, st: { hp: 1700, atk: 32, spd: 2.6, melee: ML(3.0, 1.2, 0.6, 1.5, 2.4, 1.6), armor: 0.7, r: 0.6, weight: 300 }, pas: ['붕대 갑옷', '근접 피해 -20% · 불에 약함'],
    sk: [sk('helm', '하늘의 명령 (투구창)', 'thrust', 'special', 8, 7, { len: 7.5, w: 0.9, mul: 2.0, windup: 0.9, say: '명령이다.' }), sk('grab', '붙잡기', 'pull', 'special', 9, 6, { len: 6, mul: 0.8 }), sk('low', '낮은 베기', 'slash', 'attack', 5, 3, { r: 3, arc: 2.4, mul: 1.1, sts: 'slow' })] },
  ryang: { boss: true, st: { hp: 1300, atk: 30, spd: 2.4, melee: ML(2.0, 1.0, 0.5, 1.3, 2.0), r: 0.6, weight: 120 }, pas: ['유령 몸', '물리 피해 -30% · 빛에 약함'],
    sk: [sk('ghosts', '유령 떼', 'volley', 'attack', 7, 9, { cnt: 10, gap: 0.08, mul: 0.4, spread: 0.35, color: 0xd8e8ff, glow: 0xa8c8ff, speed: 14, fam: 'magic', pose2: 'attack' }), sk('maw', '삼키는 망토', 'pull', 'special', 10, 5.5, { len: 5.5, w: 2.2, mul: 1.4, windup: 1.0 }), sk('fog', '망령 안개', 'zone', 'idle2', 9, 9, { r: 3, delay: 1.3, mul: 1.3, sts: 'slow', color: 0x8090c0 })] },
  mano: { boss: true, st: { hp: 1250, atk: 30, spd: 4.0, melee: ML(3.5, 1.0, 0.4, 1.0, 1.4), r: 0.5, weight: 90 }, pas: ['그림자 몸', '어둠에서 빠름 · 빛에 약함'],
    sk: [sk('scythe', '그림자 낫', 'slam', 'special', 9, 4, { r: 5, mul: 1.6, sts: 'bleed', windup: 0.9, say: '…' }), sk('reach', '늘어난 손', 'pull', 'attack', 6, 6, { len: 6, mul: 1.0 }), sk('crawl', '기어 다가오기', 'dash', 'walk', 7, 7, { len: 6, mul: 0.6 })] },
  ancientangel: { boss: true, st: { hp: 1900, atk: 33, spd: 2.6, melee: ML(2.6, 1.1, 0.6, 1.4, 2.6, 2.0), r: 0.8, weight: 220 }, pas: ['깃털 몸', '떠 있어 근접 피해 -25%'],
    sk: [sk('rain', '깃털 비', 'volley', 'idle', 7, 11, { cnt: 12, gap: 0.06, mul: 0.45, spread: 0.5, color: 0xf0f0ff, glow: 0xfff0d0, speed: 24 }), sk('snatch', '갈퀴 낚아채기', 'pull', 'idle', 9, 5, { len: 5, w: 1.6, mul: 1.2 }), sk('gust', '고대의 날갯짓', 'slam', 'idle', 10, 4, { r: 4.5, mul: 1.0, kb: 4, windup: 1.0 })] },
  mangak: { boss: true, st: { hp: 3200, atk: 40, spd: 2.2, melee: ML(5.5, 1.2, 0.8, 1.8, 2.0, 3.0), armor: 0.7, r: 2.2, weight: 18000 }, pas: ['비늘 깃털 갑옷', '정면 원거리 -30% · 옆구리 · 등이 약점'],
    sk: [sk('rush', '돌진 할퀴기', 'dash', 'attack', 8, 8, { len: 8, w: 2.4, mul: 1.6, trip: true, windup: 0.9 }), sk('maw', '망각의 아가리', 'slash', 'special', 12, 5.5, { r: 5.5, arc: 1.6, mul: 2.4, stun: 1.5, windup: 1.3, say: '(아가리가 네 갈래로 벌어진다)' }), sk('prowl', '어슬렁 포위', 'backstep', 'walk', 9, 3, { len: 4 })] },
};
/* ---------- 3기 1차 (v1.5) — 드라이브 '3기' 폴더 · 망향 새 시트. 기술은 그림 (동작)에 짝지음. 수치는 게임 기준 (노트의 제안 수치는 너무 커서 비율만 따옴)
   등급 눈금: 졸개 정예 hp 300~450 · 강적 / 중간급 600~1100 · 장군 / 보스 1500~2400 · 거대 2600~5000 (2기 보스와 같은 줄) ---------- */
Object.assign(H2K, {
  // ── 둘 다 (동료로도) ──
  blueflame: { st: { hp: 165, atk: 19, spd: 4.0, melee: ML(1.9, 0.9, 0.25, 0.6, 1.6) }, pas: ['사냥꾼의 눈', '끌어오거나 묶인 · 둔화된 적에게 +20%'],
    sk: [sk('snare', '철사 올가미', 'pull', 'attack', 8, 8, { len: 8, w: 0.8, mul: 0.8, stun: 1 }), sk('flame', '푸른 불꽃', 'slash', 'attack', 7, 3.5, { r: 4, arc: 2.1, mul: 1.3, sts: 'burn', stsT: 4, color: 0x40e0d0 }),
      sk('shade', '그림자 걸음', 'dash', 'front', 6, 5, { len: 5.5, mul: 1.1, w: 1.2, windup: 0.25 }), sk('chain', '올가미 연계', 'combo', 'attack', 14, 7, { sub: [{ type: 'pull', pose: 'attack', len: 8, w: 0.8, mul: 0.6, stun: 1, windup: 0.35 }, { type: 'slash', pose: 'attack', r: 2.6, arc: 2.0, mul: 1.8, sts: 'burn', windup: 0.2 }] })] },
  jaru: { st: { hp: 120, atk: 14, spd: 3.2, melee: ML(2.2, 0.8, 0.35, 1.0, 1.6, 1.0), bow: { range: 12, windup: 0.35, cd: 1.0, speed: 26 } }, pas: ['수집가의 자루', '쓰러뜨린 적에게서 유물 · 아이템을 더 얻음 (원정)'],
    sk: [sk('shard', '달빛 파편', 'shot', 'attack', 5, 12, { cnt: 3, spread: 0.18, mul: 0.8, sts: 'slow', color: 0xfff2b0, glow: 0xfff2b0, speed: 22, fam: 'magic' }), sk('spirit', '달 정령 소환', 'volley', 'front', 12, 10, { cnt: 6, gap: 0.5, mul: 0.5, color: 0xd8f0ff, glow: 0xd8f0ff, speed: 16, fam: 'magic' }),
      sk('appraise', '유물 감정', 'buff', 'idle', 18, 9, { k: 1.2, t: 8, r: 6 })] },
  vicky: { st: { hp: 110, atk: 15, spd: 3.4, melee: ML(2.0, 0.8, 0.3, 0.9, 0.9), bow: { range: 11, windup: 0.4, cd: 1.1, speed: 30 } }, pas: ['관측 기록', '같은 적을 맞힐 때마다 마법 피해 +5% (5번까지)'],
    sk: [sk('beam', '차원 투사', 'beam', 'attack', 7, 10, { len: 10, w: 0.9, mul: 1.6, windup: 0.8, fam: 'magic', color: 0xb070ff }), sk('fix', '좌표 고정', 'trap', 'front', 10, 12, { r: 3, delay: 1.1, mul: 1.0, stun: 1.6, tag: '좌표 고정', color: 0xb070ff }),
      sk('fold', '공간 접기', 'backstep', 'idle', 7, 3, { len: 6 })] },
  stoneglove: { st: { hp: 230, atk: 20, spd: 3.3, melee: ML(1.8, 1.0, 0.25, 0.7, 1.4, 1.2), armor: 0.85 }, pas: ['돌갑주', '근접 피해 -20% · 넘어지지 않음'],
    sk: [sk('leap', '도약 돌주먹', 'leap', 'attack', 8, 6, { len: 6, r: 2.5, mul: 0.8, mul2: 1.5, kb: 3 }), sk('rock', '바위 자세', 'guard', 'guard', 9, 2.5, { t: 2 }), sk('yell', '토끼 고함', 'guard', 'idle2', 16, 6, { t: 1.5, taunt: true, r: 6, say: '덤벼!!' }),
      sk('jab', '돌주먹 연타', 'combo', 'guard', 6, 2, { sub: [{ type: 'thrust', pose: 'guard', len: 2, w: 1, mul: 0.8, windup: 0.15 }, { type: 'thrust', pose: 'attack', len: 2, w: 1, mul: 0.8, windup: 0.15 }, { type: 'slam', pose: 'attack', r: 1.8, mul: 1.2, trip: true, windup: 0.25 }], gap: 0.1 })] },
  // ── 적 · 정예 · 강적 ──
  majin: { st: { hp: 240, atk: 18, spd: 3.2, melee: ML(2.4, 1.0, 0.45, 1.2, 1.6, 1.0), r: 0.45, weight: 170 }, pas: ['마신족 무리', '곁의 마신족 하나마다 공격 +10% (3까지)'],
    sk: [sk('smash', '마신 내려찍기', 'slam', 'windup', 7, 3, { r: 2, atTarget: true, mul: 1.6, trip: true, windup: 1.0 }), sk('sweep', '철퇴 쓸어치기', 'slash', 'front', 6, 3, { r: 3, arc: 2.8, mul: 1.1, kb: 2 }), sk('hop', '날개 뛰기', 'leap', 'idle', 10, 8, { len: 8, r: 2, mul: 0.5, mul2: 1.0 })] },
  hammerknight: { st: { hp: 420, atk: 22, spd: 2.6, melee: ML(2.5, 1.1, 0.7, 1.4, 1.6, 2.0), armor: 0.75, r: 0.5, weight: 260 }, pas: ['두꺼운 판금', '근접 · 화살 -25% · 넘어짐 절반 · 마법에 약함'],
    sk: [sk('quake', '대지 내려찍기', 'slam', 'windup', 8, 3, { r: 3, atTarget: true, mul: 1.8, trip: true, windup: 1.0, sts: 'slow' }), sk('brace', '해머 버티기', 'guard', 'front', 10, 2.5, { t: 2 }), sk('fin', '짓밟기 확인사살', 'finisher', 'windup', 5, 2, { mul: 2.5 })] },
  wraitha: { st: { hp: 600, atk: 21, spd: 3.6, melee: ML(2.8, 1.0, 0.4, 1.0, 1.1) }, pas: ['망령', '물리 피해 -20% · 마법에 약함'],
    sk: [sk('hook', '갈고리 낚아채기', 'pull', 'attack', 8, 7, { len: 7, mul: 0.9, stun: 1 }), sk('blink', '망령 걸음', 'dash', 'front', 7, 5, { len: 5, mul: 1.5, windup: 0.2 }), sk('veil', '넝마 장막', 'guard', 'front', 10, 2.5, { t: 2 })] },
  redarmor: { st: { hp: 620, atk: 24, spd: 3.0, melee: ML(3.0, 1.1, 0.5, 1.2, 2.6, 1.2), armor: 0.8, r: 0.5, weight: 320 }, pas: ['붉은 갑주', '정면 -25% · 등은 +20%'],
    sk: [sk('dash', '돌진 베기', 'dash', 'attack', 7, 6, { len: 6, w: 1.4, mul: 1.4, sts: 'bleed' }), sk('shell', '갑각 굳히기', 'guard', 'front', 10, 3, { t: 3 }), sk('exec', '붉은 처형', 'finisher', 'attack', 5, 2, { mul: 2.6 })] },
  scythebeast: { st: { hp: 760, atk: 25, spd: 3.8, melee: ML(3.0, 1.1, 0.45, 1.1, 2.4, 1.0), r: 0.6, weight: 380 }, pas: ['가시 비늘', '근접으로 때린 적에게 10% 되돌림'],
    sk: [sk('crescent', '초승 대참', 'slash', 'attack', 8, 4.5, { r: 5, arc: 3.14, mul: 1.8, trip: true, windup: 0.7 }), sk('leap', '도약 베기', 'leap', 'attack', 9, 8, { len: 8, r: 2.5, mul: 0.6, mul2: 1.6 }), sk('grin', '포식의 웃음', 'buff', 'front', 14, 6, { k: 1.2, t: 6, r: 1 })] },
  hongdukkae: { st: { hp: 820, atk: 27, spd: 2.8, melee: ML(2.8, 1.2, 0.55, 1.3, 1.8, 2.0), r: 0.55, weight: 230 }, pas: ['오니 가면', '피 반 아래면 공격 +25%'],
    sk: [sk('sweep', '홍두깨 휩쓸기', 'slash', 'attack', 7, 3.8, { r: 4, arc: 2.8, mul: 1.5, trip: true, windup: 0.6 }), sk('charge', '어깨 메고 돌진', 'dash', 'idle', 9, 7, { len: 7, w: 1.4, mul: 1.0, stun: 1.5 }), sk('fin', '오니의 확인사살', 'finisher', 'attack', 5, 2, { mul: 2.6 })] },
  madosa: { st: { hp: 560, atk: 22, spd: 2.9, melee: ML(1.8, 0.7, 0.4, 1.2, 1.2), bow: { range: 14, windup: 0.5, cd: 1.3, speed: 22 } }, pas: ['얼굴 없는 자', '조준 · 표식이 가끔 빗나감 (회피 12%)'],
    sk: [sk('curse', '저주의 창끝', 'beam', 'cast', 8, 14, { len: 16, w: 1.0, mul: 1.6, windup: 1.0, sts: 'mark', stsT: 4, color: 0xa040ff, fam: 'magic' }), sk('veil', '그림자 장막', 'zone', 'idle', 10, 6, { r: 4, delay: 0.6, mul: 0.6, sts: 'slow', color: 0x402060 }),
      sk('call', '이빨 모자의 부름', 'summon', 'front', 20, 12, { what: 'wraitha', max: 2, t: 12, hpk: 0.35 }), sk('rain', '보랏빛 마탄 비', 'rain', 'cast', 12, 12, { cnt: 6, r: 1.3, spread: 3, mul: 0.9, delay: 0.8, color: 0xa040ff })] },
  spore: { st: { hp: 880, atk: 22, spd: 3.0, melee: ML(2.4, 1.0, 0.4, 1.0, 1.8) }, pas: ['공허의 껍질', '몸통 피해 -20% · 천천히 아묾'],
    sk: [sk('maw', '공허의 아가리', 'pull', 'attack', 8, 4.5, { len: 4.5, w: 1.6, mul: 1.6, stun: 1.5, windup: 0.6 }), sk('cloud', '황금 포자 구름', 'zone', 'front', 10, 5, { r: 5, delay: 0.8, mul: 0.7, sts: 'poison', stsT: 5, color: 0xd8c040 }),
      sk('burst', '포자 터뜨리기', 'rain', 'idle', 12, 9, { cnt: 5, r: 1.6, spread: 3.5, mul: 0.7, delay: 1.0, color: 0xd8c040 })] },
  khaki: { st: { hp: 960, atk: 24, spd: 3.0, melee: ML(2.4, 1.0, 0.4, 1.1, 1.8), armor: 0.85, r: 0.5, weight: 420 }, pas: ['초월 신체', '정면 근접 -25% · 넘어지지 않음'],
    sk: [sk('claw', '신장 집게팔', 'pull', 'attack', 8, 9, { len: 9, w: 0.9, mul: 1.0, stun: 0.8 }), sk('cannon', '축전 포격', 'beam', 'attack', 10, 16, { len: 16, w: 1.0, mul: 2.2, windup: 1.2, color: 0x60c0ff }), sk('lens', '분석 렌즈', 'zone', 'front', 14, 10, { r: 5, delay: 0.5, mul: 0.2, sts: 'mark', stsT: 5, color: 0xff5050 })] },
  rain: { st: { hp: 900, atk: 21, spd: 2.6, melee: ML(3.5, 1.0, 0.5, 1.2, 2.2), r: 0.6, weight: 260 }, pas: ['흐르는 몸', '물리 피해 -20% · 불에 약함'],
    sk: [sk('stretch', '늘어나는 손', 'pull', 'attack', 7, 7, { len: 7, w: 1.2, mul: 1.0, sts: 'slow' }), sk('trail', '왕의 점액길', 'rain', 'idle', 11, 8, { cnt: 6, r: 1.6, spread: 2.5, mul: 0.5, delay: 0.5, gap: 0.35, color: 0x80ffb0 }),
      sk('acid', '산성 왕관', 'wave', 'front', 12, 6, { cnt: 2, r: 3, mul: 0.8, color: 0xa0ff60 })] },
  mintbeast: { st: { hp: 980, atk: 25, spd: 3.6, melee: ML(2.8, 1.1, 0.45, 1.1, 2.2), r: 0.7, weight: 240 }, pas: ['누더기 그림자', '어두운 곳에서 잘 안 맞음 (회피 12%)'],
    sk: [sk('maw', '둥근 아가리', 'dash', 'attack', 8, 5, { len: 5, w: 1.6, mul: 1.8, stun: 1, windup: 0.5 }), sk('gaze', '외눈 응시', 'beam', 'front', 10, 12, { len: 12, w: 1.2, mul: 0.6, stun: 2, windup: 0.9, color: 0x60ffd0 }), sk('hide', '누더기 숨기', 'backstep', 'idle', 9, 3, { len: 4 })] },
  grinvan: { st: { hp: 2200, atk: 30, spd: 2.2, melee: ML(3.5, 1.2, 0.7, 1.5, 1.8, 2.5), armor: 0.7, r: 1.2, weight: 3500 }, pas: ['무쇠 몸통', '넘어지지 않음 · 정면 -30% · 등이 약점'],
    sk: [sk('shield', '방패 돌진', 'dash', 'dash', 9, 10, { len: 10, w: 2.4, mul: 1.4, trip: true, windup: 0.8 }), sk('wall', '성벽 방패', 'guard', 'idle', 12, 4, { t: 3, taunt: true, r: 8 }), sk('smile', '검은 미소', 'guard', 'front', 18, 8, { t: 4, taunt: true, r: 8, say: '(까만 얼굴 속에서 눈이 웃는다)' })] },
  redrock: { st: { hp: 2600, atk: 34, spd: 2.0, melee: ML(4.0, 1.2, 0.8, 1.6, 2.0, 3.0), r: 1.4, weight: 9000 }, pas: ['붉은 암석 몸', '화살 · 총알 -40% · 둔기에 약함'],
    sk: [sk('quake', '대지 내려찍기', 'wave', 'windup', 10, 6, { cnt: 3, r: 2, mul: 1.3, trip: true, windup: 1.2 }), sk('charge', '암석 돌진', 'dash', 'idle', 10, 10, { len: 10, w: 2.4, mul: 1.3, kb: 4, windup: 0.8 }), sk('skin', '바위 갑피', 'guard', 'front', 14, 4, { t: 5 })] },
  // ── 장군 · 보스 ──
  ted: { st: { hp: 950, atk: 26, spd: 3.4, melee: ML(3.2, 1.0, 0.3, 0.9, 0.8, 0.8), armor: 0.85, r: 0.45, weight: 95 }, pas: ['흑철 갑주', '정면 근접 -25% · 곁의 졸개가 쓰러질 때마다 공격 +5%'],
    sk: [sk('lunge', '마계 돌격찌르기', 'dash', 'attack', 8, 8, { len: 8, w: 1.0, mul: 1.6, sts: 'bleed' }), sk('order', '사령관의 호령', 'buff', 'idle', 20, 12, { k: 1.2, t: 8, r: 12, say: '진격하라.' }), sk('exec', '처단', 'finisher', 'attack', 6, 3, { mul: 2.5 }),
      sk('twin', '두 번 찌르기', 'combo', 'attack', 6, 3.5, { sub: [{ type: 'thrust', pose: 'attack', len: 3.5, w: 0.8, mul: 0.9, windup: 0.2 }, { type: 'thrust', pose: 'attack', len: 3.5, w: 0.8, mul: 1.1, windup: 0.15 }], gap: 0.1 })] },
  haryu: { boss: true, st: { hp: 1600, atk: 31, spd: 3.6, melee: ML(3.0, 1.1, 0.45, 1.1, 2.1, 1.2), r: 0.5, weight: 68 }, pas: ['암계의 장군', '흑익이 곁에 있으면 둘 다 받는 피해 -15%'],
    phase: { at: 0.5, k: 1.25, spd: 1.15, say: '흑익, 끝내자.' },
    sk: [sk('rise', '암류 베어올리기', 'dash', 'attack', 7, 5, { len: 5, w: 1.2, mul: 1.6, trip: true }), sk('wave', '검은 물결', 'beam', 'front', 9, 8, { len: 8, w: 2.2, mul: 1.3, sts: 'slow', color: 0x302040 }), sk('exec', '처형 일섬', 'finisher', 'attack', 6, 2.5, { mul: 3 }),
      sk('tide', '암계 해일', 'wave', 'front', 16, 6, { cnt: 3, r: 2.4, mul: 1.4, ph: 2, color: 0x402060, say: '가라앉아라.' })] },
  heugik: { boss: true, st: { hp: 1550, atk: 30, spd: 3.8, melee: ML(3.0, 1.0, 0.3, 0.8, 0.8, 0.8), r: 0.5, weight: 95 }, pas: ['암계의 장군', '하류가 곁에 있으면 둘 다 받는 피해 -15%'],
    phase: { at: 0.5, k: 1.25, spd: 1.2, say: '…날개를 편다.' },
    sk: [sk('flash', '흑익 섬격', 'dash', 'attack', 6, 6, { len: 6, w: 1.0, mul: 1.6, sts: 'bleed' }), sk('cloak', '검은 날개 망토', 'guard', 'front', 9, 3, { t: 2 }), sk('exec', '확인사살', 'finisher', 'idle', 6, 2.5, { mul: 3 }),
      sk('storm', '흑익 난무', 'combo', 'attack', 14, 6, { ph: 2, sub: [{ type: 'dash', pose: 'attack', len: 6, w: 1, mul: 1.2, windup: 0.25 }, { type: 'dash', pose: 'attack', len: 6, w: 1, mul: 1.2, windup: 0.2 }, { type: 'dash', pose: 'attack', len: 6, w: 1, mul: 1.6, sts: 'bleed', windup: 0.2 }] })] },
  arkam: { boss: true, st: { hp: 1700, atk: 31, spd: 3.0, melee: ML(4.0, 1.1, 0.5, 1.2, 0.8, 1.0), r: 0.55, weight: 110 }, pas: ['긴 팔', '3m 밖 적에게 +15%'],
    phase: { at: 0.5, k: 1.2, spd: 1.1, say: '별이 떨어진다.' },
    sk: [sk('crescent', '초승 베기', 'pull', 'attack', 7, 4.5, { len: 4.5, w: 2.4, mul: 1.4, windup: 0.5 }), sk('charge', '성계 돌진', 'dash', 'attack', 9, 7, { len: 7, w: 1.0, mul: 1.6, trip: true }), sk('wall', '별의 창벽', 'guard', 'idle', 11, 4, { t: 3 }),
      sk('stars', '유성 낙하', 'rain', 'front', 14, 12, { cnt: 7, r: 1.5, spread: 4, mul: 1.0, delay: 1.0, ph: 2, color: 0x80c0ff, say: '별이여.' })] },
  goldmask: { boss: true, st: { hp: 1500, atk: 29, spd: 4.2, melee: ML(2.4, 1.0, 0.3, 0.8, 1.6) }, pas: ['빛나는 눈', '피 반 아래면 광폭 (공격 +25%)'],
    phase: { at: 0.5, k: 1.3, spd: 1.2, say: '아하하하! 이제 재밌어지네!' },
    sk: [sk('pounce', '악마의 덮치기', 'combo', 'attack', 9, 7, { sub: [{ type: 'dash', pose: 'attack', len: 7, w: 1.4, mul: 0.8, windup: 0.4 }, { type: 'slash', pose: 'attack', r: 3, arc: 1.8, mul: 0.9, sts: 'bleed', windup: 0.15 }, { type: 'slash', pose: 'attack', r: 3, arc: 1.8, mul: 1.1, sts: 'bleed', windup: 0.15 }], gap: 0.12 }),
      sk('shadow', '그림자 자락', 'zone', 'front', 11, 5, { r: 5, delay: 0.7, mul: 0.6, sts: 'slow', color: 0x504020 }), sk('chain', '사슬 끌어오기', 'pull', 'idle', 8, 8, { len: 8, mul: 0.7 })] },
  ghostgirl: { boss: true, st: { hp: 1400, atk: 26, spd: 3.4, melee: ML(2.0, 1.0, 0.35, 0.9, 1.4) }, pas: ['원령', '물리 피해 -40% · 마법에 약함'],
    phase: { at: 0.45, k: 1.3, spd: 1.25, say: '…으아아아아아.' },
    sk: [sk('lunge', '원령의 덮침', 'dash', 'attack', 7, 7, { len: 7, w: 1.5, mul: 1.4, stun: 1.2 }), sk('scream', '비명', 'wave', 'front', 14, 6, { cnt: 2, r: 3, mul: 0.6, stun: 1.5, color: 0xe0e0ff, say: '끼아아아악!!' }), sk('drift', '그림자 걸음', 'backstep', 'idle', 8, 3, { len: 5 }),
      sk('hands', '무덤의 손', 'trap', 'front', 12, 10, { r: 2, delay: 1.0, mul: 0.8, stun: 2, ph: 2, tag: '붙잡힘', color: 0x203040 })] },
  // ── 거대 ──
  hornbeast: { boss: true, st: { hp: 3600, atk: 42, spd: 2.4, melee: ML(6.0, 1.2, 0.8, 1.7, 2.1, 3.0), r: 2.2, weight: 26000 }, pas: ['가시 털가죽', '근접으로 때린 적에게 15% 되돌림 · 원거리 -20%'],
    phase: { at: 0.5, k: 1.25, spd: 1.15, say: '(땅이 울릴 만큼 울부짖는다)' },
    sk: [sk('horn', '뿔 들이받기', 'dash', 'idle', 10, 14, { len: 14, w: 3, mul: 1.6, kb: 5, trip: true, windup: 1.1 }), sk('roar', '아가리 포효', 'wave', 'attack', 16, 9, { cnt: 3, r: 3.5, mul: 0.5, stun: 1.2, windup: 1.0 }),
      sk('quake', '대지 내려찍기', 'slam', 'front', 12, 7, { r: 7, mul: 1.8, trip: true, windup: 1.4 }), sk('rubble', '바위 비', 'rain', 'front', 16, 14, { cnt: 8, r: 1.8, spread: 5, mul: 1.0, delay: 1.1, ph: 2, color: 0xc08040 })] },
  colossus15: { boss: true, st: { hp: 5000, atk: 48, spd: 1.8, melee: ML(10, 1.2, 1.0, 2.2, 0.5, 3.0), armor: 0.7, r: 3.0, weight: 90000 }, pas: ['돌 거신', '넘어지지 않음 · 원거리 -25%'],
    phase: { at: 0.5, k: 1.2, spd: 1.1, say: '(거신의 투구에서 푸른 불꽃이 치솟는다)' },
    sk: [sk('pierce', '성벽 찌르기', 'beam', 'attack', 10, 18, { len: 18, w: 3, mul: 2.0, trip: true, windup: 1.4 }), sk('shield', '탑방패 내려찍기', 'slam', 'front', 12, 8, { r: 6, mul: 1.6, trip: true, windup: 1.3 }),
      sk('march', '거인의 행군', 'wave', 'idle', 14, 6, { cnt: 2, r: 3, mul: 1.2, windup: 0.9 }), sk('flame', '푸른 불꽃 창비', 'rain', 'attack', 16, 16, { cnt: 9, r: 1.8, spread: 6, mul: 1.0, delay: 1.2, ph: 2, color: 0x60a0ff })] },
});
/* ---------- 3기-2 (v1.7) — 드라이브 '3기-2': 포렌의 쥐 · 도깨비 아해 · 5성 서포터 · 1기 인물 새 시트 (마리 · 모닝스타 · 옐로 · 용묘화 · 테헤라 · 흑토끼기사 · 로젤 · 왕님 · 기사단장).
   수치는 같은 눈금 (동료 100~250 · 정예 300~450 · 강적 / 중적 600~1100 · 초강적 1400~1800 · 보스 2400~4000). 그림 (동작)에 짝지음 ---------- */
Object.assign(H2K, {
  // ── 포렌의 쥐 (동료 · 포렌이 부름) ──
  ratknight: { st: { hp: 75, atk: 10, spd: 3.6, melee: ML(2.2, 1.0, 0.3, 0.9, 0.8), r: 0.3, weight: 45 }, pas: ['쥐 떼', '곁의 쥐 기사마다 받는 피해 -5% (최대 -15%)'],
    sk: [sk('stance', '창 거리 유지', 'thrust', 'stance', 4, 2.4, { len: 2.4, mul: 0.7, windup: 0.2 }), sk('shield', '방패 막기', 'guard', 'guard', 6, 2, { t: 2 }), sk('charge', '돌격', 'dash', 'dash', 10, 6, { len: 6, mul: 1.3, kb: 1, windup: 0.3 })] },
  ratvet: { st: { hp: 180, atk: 16, spd: 3.8, melee: ML(3.0, 1.0, 0.3, 0.9, 0.9, 0.8), r: 0.32, weight: 62 }, pas: ['베테랑의 근성', '첫 치명상 한 번은 1로 버팀 · 정면 원거리 -35%'],
    sk: [sk('bash', '구르기 방패 박치기', 'combo', 'roll_in', 9, 5, { sub: [{ type: 'dash', pose: 'roll_flip', len: 4, w: 1.2, mul: 0.5, windup: 0.25 }, { type: 'slam', pose: 'bash', r: 1.8, mul: 1.6, kb: 2.5, stun: 1, windup: 0.15 }] }),
      sk('broll', '뒷구르기', 'backstep', 'broll_flip', 7, 2.5, { len: 3 }), sk('phalanx', '작은 방진', 'guard', 'guard2', 15, 3, { t: 4, taunt: true, r: 4 }),
      sk('mark', '작은 표식 — 찍!', 'summon', 'command', 18, 9, { what: 'ratsmall', t: 10, max: 2, say: '찍!' }), sk('sword', '검 찌르기', 'thrust', 'sword_thrust', 4, 1.8, { len: 1.8, mul: 1.4, windup: 0.2 })] },
  ratsmall: { st: { hp: 10, atk: 3, spd: 5.2, melee: ML(0.6, 1.0, 0.1, 0.35, 1.4, 0), r: 0.14, weight: 0.4 }, pas: ['작은 몸', '회피 +25%'], sk: [sk('scurry', '호다닥', 'dash', 'idle', 6, 8, { len: 8, mul: 0.6, sts: 'slow', windup: 0.1 })] },
  // ── 도깨비 아해 (4성) ──
  ahae: { st: { hp: 185, atk: 21, spd: 3.7, melee: ML(2.3, 1.0, 0.3, 0.8, 1.6) }, pas: ['무기 바꿔 쥐기', '세 번째 공격마다 +25% (검 · 차크람 · 맨손)'],
    sk: [sk('chakram', '차크람 던지기', 'shot', 'throw', 6, 12, { range: 12, mul: 1.2, pierce: true, speed: 22, len: 0.6, thick: 0.18, color: 0xd0d8e0, fam: 'blade' }),
      sk('wraith', '원념 소환', 'summon', 'summon', 18, 9, { what: 'ahae_wraith', t: 12, max: 1 }), sk('leap', '도약 내려치기', 'leap', 'jump', 9, 6, { len: 6, r: 2.5, mul: 0.6, mul2: 1.6, windup: 0.4 }),
      sk('low', '쓰러진 적 베기', 'finisher', 'low2', 6, 2, { mul: 2.5 }), sk('awaken', '각성 — 사슬낫', 'transform', 'summon2', 40, 8, { to: 'ahae2', t: 20, k: 1.4, say: '…다 데려가.' })] },
  ahae2: { st: { hp: 230, atk: 27, spd: 4.0, melee: ML(4.0, 1.0, 0.35, 0.9, 2.1) }, pas: ['각성', '변신 동안 받는 피해 -20%'],
    sk: [sk('chain', '사슬 끌어오기', 'pull', 'throw', 8, 10, { len: 10, mul: 0.8, stun: 0.6 }), sk('bind', '휘감아 묶기', 'trap', 'bind', 12, 6, { r: 1.6, delay: 0.6, mul: 0.6, stun: 2, color: 0xc02020 }),
      sk('spin', '붉은 회전베기', 'combo', 'spin', 10, 4, { sub: [{ type: 'slash', pose: 'spin', r: 4, arc: 6.3, mul: 0.8, sts: 'bleed', windup: 0.3 }, { type: 'slam', pose: 'slam', r: 3, mul: 1.3, windup: 0.3 }] }),
      sk('horde', '원념 무리', 'slash', 'summon', 14, 5, { r: 5, arc: 1.6, mul: 1.6, windup: 0.6, color: 0xc02020 })] },
  ahae_wraith: { st: { hp: 110, atk: 15, spd: 3.8, melee: ML(3.5, 1.0, 0.35, 1.0, 0.8, 0.4) }, pas: ['원령', '물리 피해 -40%'],
    sk: [sk('grab', '움켜쥐기', 'pull', 'attack2', 7, 4, { len: 4, mul: 0.7, stun: 1.5 })] },
  // ── 5성 서포터 · 3기 동료 ──
  collider: { st: { hp: 200, atk: 21, spd: 3.6, melee: ML(3.0, 1.0, 0.3, 0.9, 1.8) }, pas: ['마계 대사', '쓰러질 때 한 번 1로 버팀 (꼬리 그림자)'],
    sk: [sk('gate', '차원 문', 'pull', 'cast2', 12, 8, { len: 8, w: 2.4, mul: 0.6, stun: 0.8 }), sk('star', '별빛 지목', 'shot', 'shoot', 8, 15, { range: 15, mul: 1.0, stun: 0.8, color: 0xe0e0ff, fam: 'magic' }),
      sk('veil', '마계 장막', 'guard', 'special', 16, 5, { t: 3, taunt: true, r: 6 }), sk('lure', '유혹의 손짓', 'trap', 'cast', 12, 8, { r: 1.6, delay: 0.7, mul: 0.3, stun: 2, color: 0xb070ff })] },
  mulle: { st: { hp: 175, atk: 16, spd: 3.5, melee: ML(1.4, 0.8), bow: { range: 12, windup: 0.35, cd: 1.0, speed: 22 } }, pas: ['정령 계약', '곁의 아군을 천천히 회복'],
    sk: [sk('touch', '정령의 손길', 'heal', 'cast', 10, 10, { r: 10, amt: 0.22 }), sk('wall', '정령 방벽', 'guard', 'guard', 10, 4, { t: 3 }),
      sk('descend', '정령 강림', 'zone', 'skill', 14, 9, { r: 4, delay: 1.0, mul: 0.8, sts: 'slow', color: 0x60c0ff }), sk('spirit', '물 정령 탄', 'volley', 'attack', 6, 12, { cnt: 3, gap: 0.2, mul: 0.6, color: 0x80d0ff, fam: 'magic' })] },
  moro: { st: { hp: 240, atk: 26, spd: 4.1, melee: ML(2.8, 1.0, 0.28, 0.8, 2.8) }, pas: ['밤나방', '어두운 곳에서 회피 +10% · 피해 +10%'],
    sk: [sk('hack', '난도질', 'slash', 'attack2', 7, 3.5, { r: 4, arc: 1.6, mul: 1.5, sts: 'bleed' }), sk('pierce', '나방 찌르기', 'dash', 'skill', 8, 6, { len: 6, w: 1, mul: 1.3, windup: 0.3 }),
      sk('dust', '가루 날개', 'guard', 'guard', 12, 2, { t: 2 }), sk('dive', '급강하', 'leap', 'crouch', 10, 8, { len: 8, r: 3, mul: 0.6, mul2: 1.5, trip: true }), sk('reap', '쓸어베기', 'finisher', 'low', 6, 2, { mul: 2.5 })] },
  ancientdeer: { st: { hp: 900, atk: 34, spd: 3.6, melee: ML(4.2, 1.1, 0.5, 1.3, 1.6, 2.0), r: 1.45, weight: 3000 },   // v2.5 도감 설정 몸길이 5m · 등 높이 3m (노트 tall 4.0 → 5.3) — 몸 반경도 같이 pas: ['고대의 가시', '근접 피해 15% 되돌림 · 반 아래서 공격 +20%'],
    sk: [sk('horn', '가시뿔 돌진', 'combo', 'windup', 10, 12, { sub: [{ type: 'dash', pose: 'dash', len: 12, w: 2.2, mul: 1.5, kb: 3, trip: true, windup: 0.6 }] }),
      sk('stomp', '대지 짓밟기', 'slam', 'slam', 11, 5, { r: 6, mul: 1.5, stun: 1, windup: 0.9 }), sk('antler', '뿔 방벽', 'guard', 'low', 12, 3, { t: 3 })] },
  slra: { st: { hp: 165, atk: 13, spd: 3.3, melee: ML(1.4, 0.7), bow: { range: 8, windup: 0.4, cd: 1.1, speed: 16 } }, pas: ['젤리 몸', '근접 피해 -15%'],
    sk: [sk('bless', '산호 축복', 'heal', 'special', 10, 7, { r: 7, amt: 0.18 }), sk('twirl', '젤리 회전', 'slam', 'skill', 8, 3, { r: 3, mul: 0.7, kb: 3, sts: 'slow' }),
      sk('sprout', '산호 싹', 'zone', 'summon', 14, 6, { r: 3, delay: 1.2, mul: 0.6, sts: 'slow', color: 0xc080ff }), sk('knight', '산호 기사 변신', 'transform', 'bow', 40, 6, { to: 'slra2', t: 25, k: 1.6, say: '산호 기사, 나갑니다~' })] },
  slra2: { st: { hp: 210, atk: 21, spd: 3.6, melee: ML(2.6, 1.0, 0.3, 0.85, 0.9) }, pas: ['산호 갑옷', '변신 동안 받는 피해 -15%'],
    sk: [sk('leap', '도약 베기', 'leap', 'jump', 9, 7, { len: 7, r: 2.5, mul: 0.6, mul2: 1.5, trip: true }), sk('parry', '산호 자세', 'guard', 'guard', 8, 2, { t: 2 }),
      sk('lunge', '기합 돌진', 'dash', 'windup', 10, 10, { len: 10, w: 1, mul: 1.6, windup: 0.9 }), sk('taunt', '웃음 도발', 'guard', 'taunt', 14, 6, { t: 2, taunt: true, r: 8 })] },
  // ── 1기 인물 (도감 묶음이 이미 있음) ──
  mari: { st: { hp: 240, atk: 24, spd: 3.8, melee: ML(3.0, 1.0, 0.3, 0.9, 0.8) }, pas: ['부족 전사의 피', '적을 쓰러뜨린 다음 공격 +30%'],
    sk: [sk('charge', '창 돌진', 'dash', 'dash', 9, 8, { len: 8, w: 1.1, mul: 1.6, trip: true, windup: 0.35 }), sk('javelin', '투창', 'volley', 'throw', 9, 22, { cnt: 3, gap: 0.45, range: 22, mul: 1.4, pierce: true, speed: 30, len: 1.2, pose2: 'throw', fam: 'spear' }),
      sk('skyfall', '하늘 내리꽂기', 'leap', 'slam', 12, 6, { len: 6, r: 3.5, mul: 0.6, mul2: 1.7, trip: true }), sk('spin', '금빛 원 베기', 'slash', 'spin', 7, 2.5, { r: 3, arc: 6.3, mul: 1.2, kb: 1.5 })] },
  mstar: { st: { hp: 175, atk: 22, spd: 3.6, melee: ML(3.2, 1.1, 0.35, 1.0, 2.1, 1.0) }, pas: ['슈퍼스타의 광기', '잃은 체력만큼 공격 +, 한 번은 웃으며 일어남'],
    sk: [sk('hook', '철퇴 던지기', 'pull', 'attack2', 8, 7, { len: 7, mul: 1.5 }), sk('frenzy', '광란의 회전', 'wave', 'spin', 10, 3, { cnt: 3, r: 1.2, w: 1.4, mul: 0.9, gap: 0.4 }),
      sk('star', '별 떨어뜨리기', 'slam', 'windup', 10, 4, { r: 1.8, atTarget: true, mul: 1.8, stun: 1, trip: true, windup: 0.6 })] },
  yellow: { st: { hp: 150, atk: 17, spd: 4.2, melee: ML(1.7, 0.9, 0.2, 0.6, 1.6) }, pas: ['장난꾸러기 간호사', '때린 피해의 15% 로 다친 아군 회복'],
    sk: [sk('pounce', '덮치기', 'leap', 'jump2', 7, 7, { len: 7, r: 1.5, mul: 0.5, mul2: 1.3, trip: true, windup: 0.3 }), sk('rake', '연속 할퀴기', 'slash', 'attack2', 6, 2.5, { r: 2.5, arc: 1.6, mul: 1.4, sts: 'bleed' }),
      sk('aid', '응급 처치', 'heal', 'heal', 12, 4, { r: 4, amt: 0.3, revive: true }), sk('dart', '치고 빠지기', 'dash', 'dash', 6, 6, { len: 6, mul: 0.8, windup: 0.15 })] },
  yongmyo: { st: { hp: 190, atk: 20, spd: 3.5, melee: ML(2.8, 1.0, 0.3, 0.9, 0.9, 0.8) }, pas: ['묘지기', '쓰러진 적에게 +30% · 쓰러뜨리면 체력 3% 회복'],
    sk: [sk('smash', '모아 내려치기', 'slam', 'charge', 8, 3, { r: 1.6, atTarget: true, mul: 2.2, stun: 1, windup: 0.6, pose2: 'smash' }), sk('dig', '파내기', 'slash', 'dig', 8, 4, { r: 4, arc: 1.6, mul: 1.2, sts: 'slow', pose2: 'dig2' }),
      sk('sweep', '휘둘러 쳐내기', 'slash', 'attack2', 7, 3, { r: 3.2, arc: 2.6, mul: 1.1, kb: 2 }), sk('bury', '파묻기', 'finisher', 'dig', 6, 2, { mul: 2.6, pose2: 'dig2' })] },
  tehera: { st: { hp: 125, atk: 11, spd: 3.6, melee: ML(1.2, 0.6), bow: { range: 12, windup: 0.35, cd: 0.9, speed: 18 } }, pas: ['요정 날개', '회피 +10%'],
    sk: [sk('bless', '요정의 축복', 'heal', 'reach', 9, 5, { r: 5, amt: 0.25 }), sk('wings', '날개 방패', 'guard', 'guard', 10, 2, { t: 2 }),
      sk('flight', '은빛 비행', 'dash', 'dash', 7, 8, { len: 8, mul: 0.4, sts: 'slow', windup: 0.15 }), sk('dream', '나른한 꿈', 'zone', 'sit', 14, 8, { r: 4, delay: 1.2, mul: 0.4, sts: 'slow', stun: 0.8, color: 0xffd0e8 })] },
  blackrabbit: { st: { hp: 215, atk: 23, spd: 3.5, melee: ML(3.2, 1.1, 0.35, 1.0, 0.9, 1.0) }, pas: ['흑토끼의 충성', '곁의 아군이 쓰러지면 5초 공격 +25%'],
    sk: [sk('cleave', '내리쪼개기', 'thrust', 'windup', 8, 4, { len: 4, w: 1.2, mul: 2.2, trip: true, windup: 0.5 }), sk('plunge', '토끼 도약', 'leap', 'plunge', 9, 6, { len: 6, r: 2, mul: 0.5, mul2: 1.5, stun: 0.8 }),
      sk('plant', '붉은 검 꽂기', 'guard', 'guard', 10, 2, { t: 2 }), sk('taunt', '도발', 'guard', 'front', 14, 8, { t: 1.5, taunt: true, r: 8 })] },
  // ── 3기 적 (중적 · 초강적 · 기체) ──
  magusgirl: { st: { hp: 640, atk: 22, spd: 3.2, melee: ML(2.0, 0.9), bow: { range: 14, windup: 0.4, cd: 1.0, speed: 24 } }, pas: ['마녀의 망토', '쓰러질 때 한 번 1로 버팀'],
    sk: [sk('shards', '혈편 사격', 'volley', 'cast', 6, 14, { cnt: 5, gap: 0, spread: 0.1, mul: 0.5, color: 0xff3040, fam: 'magic' }), sk('ward', '푸른 반달 방벽', 'guard', 'guard', 10, 6, { t: 3 }),
      sk('circle', '혈마법진', 'zone', 'skill', 10, 12, { r: 3.5, delay: 1.0, mul: 1.3, sts: 'slow', color: 0xc02040 }), sk('drop', '지팡이 낙하', 'slam', 'slam', 9, 3, { r: 4, mul: 1.4, trip: true, windup: 0.7 }),
      sk('vortex', '붉은 소용돌이', 'pull', 'attack', 8, 4, { len: 4, mul: 1.1 })] },
  stagbeast: { st: { hp: 1450, atk: 31, spd: 3.4, melee: ML(2.8, 1.1, 0.35, 0.9, 1.6, 1.4), armor: 0.85, r: 0.75, weight: 320 }, pas: ['고목의 뿔', '정면 근접 -20% · 반 아래서 더 빨라짐'],
    phase: { at: 0.4, k: 1.25, spd: 1.2, say: '(푸른 문양이 숲처럼 타오른다)' },
    sk: [sk('charge', '뿔소 돌진', 'dash', 'dash', 9, 12, { len: 12, w: 1.6, mul: 1.5, kb: 3, trip: true, windup: 0.6 }), sk('stomp', '대지 짓밟기', 'wave', 'slam', 11, 5, { cnt: 2, r: 2.5, mul: 1.1, windup: 0.8 }),
      sk('knee', '무릎 차올리기', 'leap', 'jump', 8, 4, { len: 4, r: 1.6, mul: 0.6, mul2: 1.5, stun: 1 }), sk('roar', '숲의 포효', 'buff', 'roar', 18, 10, { r: 3, k: 1.3, t: 8, ph: 2 })] },
  hiddenkkaebi: { st: { hp: 1650, atk: 32, spd: 3.5, melee: ML(3.6, 1.1, 0.3, 0.9, 2.1, 1.0), r: 0.6, weight: 130 }, pas: ['숨은 도깨비', '첫 공격 치명 · 반 아래서 공격 +25%'],
    phase: { at: 0.5, k: 1.3, spd: 1.15, say: '(붉은 기운이 로브 밖으로 넘쳐흐른다)' },
    sk: [sk('afterimage', '잔영 돌진', 'combo', 'dash', 10, 14, { sub: [{ type: 'dash', pose: 'dash', len: 14, w: 1.4, mul: 1.4, windup: 0.4 }, { type: 'slash', pose: 'attack', r: 3, arc: 6.3, mul: 0.8, windup: 0.3 }] }),
      sk('crack', '혈검 낙하', 'slam', 'slam', 11, 4, { r: 5, mul: 1.5, trip: true, windup: 0.9 }), sk('daggers', '혈단검 고리', 'volley', 'skill', 12, 15, { cnt: 12, gap: 0, spread: 0.26, mul: 0.4, color: 0xff2030, ph: 2 }),
      sk('rift', '공간 찢기', 'beam', 'attack2', 10, 6, { len: 6, w: 1.2, mul: 1.5, windup: 1.0, color: 0x9040c0 }), sk('rise', '올려 베기', 'slash', 'attack3', 7, 3, { r: 3, arc: 1.4, mul: 1.3, stun: 1 })] },
  unitA: { st: { hp: 900, atk: 30, spd: 3.6, melee: ML(4.0, 1.0, 0.3, 0.9, 0.7, 0.8), r: 0.6, weight: 180 }, pas: ['4족 기체', '넘어지지 않음 · 정면 근접 -20%'],
    sk: [sk('crawl', '4족 돌격', 'dash', 'walk', 9, 8, { len: 8, w: 1.6, mul: 1.3, trip: true, windup: 0.4 }), sk('whirl', '날개 회전 베기', 'slash', 'skill', 9, 3.5, { r: 3.5, arc: 6.3, mul: 1.1, sts: 'bleed' }),
      sk('flip', '공중제비 꿰뚫기', 'leap', 'flip', 11, 6, { len: 6, r: 2, mul: 0.5, mul2: 1.8, stun: 1 }), sk('x', 'X 날 내려베기', 'slash', 'windup', 8, 4, { r: 4, arc: 1.6, mul: 1.6, windup: 0.6 })] },
  unitB: { st: { hp: 720, atk: 32, spd: 4.4, melee: ML(2.8, 1.0, 0.22, 0.7, 1.8) }, pas: ['큰 삿갓', '위에서 오는 원거리 -30% · 회피 +12%'],
    sk: [sk('swoop', '비상 돌입', 'leap', 'fly', 9, 10, { len: 10, r: 2, mul: 0.6, mul2: 1.4 }), sk('flip', '공중제비 베기', 'slash', 'flip', 7, 2.5, { r: 2.5, arc: 6.3, mul: 1.2 }),
      sk('rise', '승천 베기', 'slash', 'skill', 8, 2, { r: 2.2, arc: 1.4, mul: 1.5, stun: 1.2 }), sk('cross', '십자 막기', 'guard', 'guard', 9, 2, { t: 1.5 })] },
  // ── 보스 · 장군급 ──
  knightcaptain: { st: { hp: 340, atk: 22, spd: 3.4, melee: ML(2.6, 1.1, 0.35, 0.9, 1.6, 1.0), armor: 0.85, r: 0.42, weight: 90 }, pas: ['백랑 털망토', '정면 피해 -15% · 30% 아래서 공격 +20%'],   // v2.2 민수: 4성 정도 — 그렇게 강하지 않음 (보스 · 2페이즈 뺌)
    sk: [sk('flash', '일섬 찌르기', 'thrust', 'attack2', 7, 6, { len: 6, w: 0.9, mul: 1.7 }), sk('charge', '돌진 베기', 'dash', 'dash', 9, 8, { len: 8, w: 1.2, mul: 1.5, trip: true, windup: 0.4 }),
      sk('heavy', '천근 내려찍기', 'slam', 'windup', 10, 3, { r: 2.5, atTarget: true, mul: 2.0, stun: 1, windup: 0.8 }), sk('order', '기사단 호령', 'buff', 'skill', 18, 10, { r: 10, k: 1.15, t: 8 })] },
  rozel: { boss: true, st: { hp: 2800, atk: 30, spd: 2.8, melee: ML(1.8, 0.8), bow: { range: 9, windup: 0.4, cd: 1.1, speed: 18 }, r: 0.45 }, pas: ['붉은 가시 로브', '근접 피해 20% 되돌림 · 넘어지지 않음'],
    phase: { at: 0.5, k: 1.25, spd: 1.1, say: '성당의 가시가… 너를 기억해.' },
    sk: [sk('crest', '가시 문장', 'trap', 'cast2', 6, 10, { r: 2.5, delay: 1.0, mul: 1.4, stun: 0.8, color: 0xc01830 }), sk('garden', '가시 정원', 'zone', 'front', 16, 3, { r: 8, delay: 1.4, mul: 0.8, sts: 'slow', color: 0x801020 }),
      sk('roots', '뿌리 부르기', 'rain', 'skill', 14, 10, { cnt: 3, r: 1.4, spread: 4, mul: 1.0, stun: 0.5, delay: 0.9, color: 0xc02030 }), sk('crest2', '이중 문장', 'rain', 'cast3', 10, 10, { cnt: 2, r: 2.5, spread: 2, mul: 1.4, stun: 0.8, delay: 1.0, ph: 2, color: 0xc01830 })] },
  wangnim: { boss: true, st: { hp: 3600, atk: 40, spd: 3.2, melee: ML(4.5, 1.1, 0.35, 1.0, 0.8, 1.0), armor: 0.85, r: 0.5, weight: 110 }, pas: ['하늘만 보는 왕', '정면 원거리 -30% · 반 아래서 더 빨라짐'],
    phase: { at: 0.5, k: 1.2, spd: 1.2, say: '…하늘이 대답하지 않는군.' },
    sk: [sk('issen', '청검 일섬', 'beam', 'special', 9, 12, { len: 12, w: 1.2, mul: 2.2, windup: 1.0, color: 0x6090ff }), sk('crown', '왕의 내려찍기', 'slam', 'windup', 9, 3, { r: 2, atTarget: true, mul: 1.8, trip: true, windup: 0.8 }),
      sk('sweep', '망토 쓸어 베기', 'slash', 'low', 8, 5, { r: 5, arc: 2.6, mul: 1.1, sts: 'slow' }), sk('rise', '올려 베기', 'slash', 'attack2', 6, 3, { r: 3, arc: 1.4, mul: 1.3, stun: 1 }),
      sk('issen2', '청검 이섬', 'combo', 'special', 14, 12, { ph: 2, sub: [{ type: 'beam', pose: 'special', len: 12, w: 1.2, mul: 2.0, windup: 0.9, color: 0x6090ff }, { type: 'beam', pose: 'special', len: 12, w: 1.2, mul: 2.0, windup: 0.5, color: 0x6090ff }] })] },
});
// 2기 인물의 3기 덧붙임: 새 그림 (동작) · 새 기술 · 2페이즈
H2K.mangak.sk.push(sk('pounce', '갈퀴 덮치기', 'dash', 'attack_b', 12, 10, { len: 10, w: 3, mul: 1.8, trip: true, windup: 0.8 }), sk('shadow', '망각의 그림자', 'rain', 'walk_b', 14, 10, { cnt: 6, r: 1.5, spread: 4, mul: 0.8, delay: 0.9, ph: 2, color: 0x802020 }));
H2K.mangak.phase = { at: 0.5, k: 1.2, spd: 1.15, say: '(망각의 눈이 붉게 타오른다)' };
H2K.ancientangel.sk.push(sk('cage', '날개 감옥', 'guard', 'idle_b', 14, 4, { t: 2 }), sk('grab', '천상의 낚아채기', 'pull', 'attack', 10, 8, { len: 8, w: 1.4, mul: 1.2, stun: 1 }), sk('judg', '고대의 심판', 'rain', 'idle', 16, 12, { cnt: 8, r: 1.6, spread: 5, mul: 1.0, delay: 1.1, ph: 2, color: 0xfff0b0, say: '…심판.' }));
H2K.ancientangel.phase = { at: 0.5, k: 1.2, spd: 1.1, pose: 'idle_b', say: '(고대천사가 날개를 접는다)' };
H2K.manghyang.sk.push(sk('fall', '이계 낙하', 'leap', 'slam', 9, 6, { len: 6, r: 2.5, mul: 0.6, mul2: 1.6, stun: 0.8 }), sk('long', '향수의 손톱', 'buff', 'back', 14, 3, { k: 1.4, t: 6, r: 1 }));
H2K.cheonmyeong.sk.push(sk('cage', '황금 감옥', 'trap', 'special', 14, 8, { r: 2, delay: 0.9, mul: 0.6, stun: 3, tag: '황금 감옥', color: 0xffd040 }), sk('exec', '공허의 처형', 'finisher', 'attack', 6, 3, { mul: 3 }));
H2K.cheonmyeong.phase = { at: 0.5, k: 1.2, spd: 1.1, say: '집행한다.' };
H2K.ryang.sk.push(sk('call', '뿔 왕관의 부름', 'summon', 'idle2', 22, 10, { what: 'wraitha', max: 3, t: 20, hpk: 0.3, ph: 2, say: '일어나라.' }), sk('ward', '망령 장벽', 'guard', 'idle', 12, 5, { t: 3 }));
H2K.ryang.phase = { at: 0.5, k: 1.15, spd: 1.1, say: '…배가 고프구나.' };
H2K.mano.sk.push(sk('hook', '공허 갈고리', 'dash', 'special', 9, 8, { len: 8, w: 1.2, mul: 1.2, stun: 1 }), sk('gaze', '푸른 눈 응시', 'beam', 'idle', 12, 6, { len: 6, w: 3, mul: 0.4, stun: 1.5, color: 0x60a0ff, windup: 0.6 }));
H2K.mano.phase = { at: 0.5, k: 1.2, spd: 1.2, say: '…' };
H2K.hadim.sk.push(sk('crown', '뿔 왕관 수직 강타', 'leap', 'special', 12, 5, { len: 5, r: 2.5, mul: 0.6, mul2: 2.0, trip: true, windup: 1.0, ph: 2, say: '무릎 꿇어라!' }), sk('order', '악마 장군의 호령', 'buff', 'idle', 25, 12, { k: 1.2, t: 10, r: 12 }));
H2K.hadim.phase = { at: 0.5, k: 1.25, spd: 1.15, say: '크하하하하! 이제야 몸이 풀리는군!' };
h2Build();
// v2.1 민수: 다 큰 쥐 기사 · 베테랑 · 포렌은 인주 · 청광묵 크기 (비슷하거나 살짝 작게). 그림 키에 머리 위 창끝이 들어 있어 숫자가 큼 — 머리 높이로 맞춤 (쥐 기사 1~4단계는 이 키의 0.7 ~ 1)
if (SPR.h2_ratknight) SPR.h2_ratknight.tall = 1.2;
if (SPR.h2_ratvet) SPR.h2_ratvet.tall = 1.27;
// v2.0 동작 검토 (v0.69): 2기 · 3기 밖 인물의 발 위치 (ax) · 보는 방향 (f) · 크기 (scale) 보정 — 자동 측정 + 눈 검토로 고름 (발이 칼끝 · 무기 밑에 서 있던 것들)
const MOTION_FIX = {"axeKnight": {"idle": {"ax": 121}}, "bk": {"idle": {"ax": 68}, "thrust": {"ax": 86}, "attack": {"ax": 123}, "heavy": {"ax": 125}, "kick": {"ax": 81}, "bash": {"ax": 66}}, "catw": {"pounce": {"ax": 166}}, "cs": {"attack": {"ax": 101}, "jump": {"ax": 96}}, "foeJelly": {"idle": {"f": -1}}, "gwangnyang": {"attack": {"ax": 179}}, "jakyak": {"attack": {"scale": 2.0}}, "player": {"kick": {"ax": 417}}};
for (const [k, L] of Object.entries(MOTION_FIX)) if (SPR[k]) for (const [p, v] of Object.entries(L)) if (SPR[k].poses[p]) Object.assign(SPR[k].poses[p], v);

/* ---------- 훈련장 '2기' 탭 (drill.js가 부름) ----------
   인물마다: 얼굴 · 이름 · 등급 · 보직 · 키 · 기술 이름 · 빠진 그림 + 동료로 (2조) / 적으로 / 보스로 부르기 */
const H2UI = { f: 'all' };
function h2FaceHtml(o){
  const F = typeof H2A !== 'undefined' && H2A.faces, i = F && F.i[o.slug];
  if (i == null) return `<i class="h2f"></i>`;
  const s = 64 / F.cell; return `<i class="h2f" style="background:url(${F.src}) ${-(i % F.cols) * 64}px ${-Math.floor(i / F.cols) * 64}px / ${F.cols * F.cell * s}px ${F.rows * F.cell * s}px"></i>`;
}
const H2NOMIX = new Set(['levi_beast', 'garam2', 'hirari2', 'ahae2', 'ahae_wraith', 'slra2', 'ratsmall']);   // 변신 · 소환물은 혼전에 따로 안 나옴
const h2Rank = o => { const m = /[1-5]성/.exec(o.rank || ''); return m ? m[0] : H2K[o.slug] && H2K[o.slug].boss ? '보스' : '기타'; };
function h2Main(o){ const A = o.apt || {}; return A.gun >= 4 ? 'pistol' : A.bow >= 4 ? 'bow' : A.magic >= 4 ? 'wand' : null; }
function h2Ally(slug, at){
  const k = 'h2_' + slug; if (!DEFS[k]) return null;
  const pl = G.player, c = at || { x: pl.x + rnd(-2, 2), z: pl.z + rnd(1.5, 3) };
  const u = spawn(k, c.x, c.z, 'ally'); u.face = 1;
  if (typeof solInit === 'function') solInit(u, { role: 'vanguard', sq: 2, main: h2Main(H2R[slug]) });
  if (typeof BAG_CAP !== 'undefined') BAG_CAP['h2_' + slug] = (H2R[slug] && H2R[slug].bag) || 8;
  dust(u.x, u.z, 8); popText(u.x, u.y + bodyH(u) + 0.4, u.z, u.D.name, 'heal', 1); return u;
}
function h2Foe(slug, boss){
  const k = 'h2e_' + slug; if (!DEFS[k]) return null;
  drillSpawn([k], { title: DEFS[k].name, sub: boss ? '보스' : '2기 — 적으로' });
  const e = foes()[foes().length - 1]; if (e && boss){ e.max = e.hp = Math.round(e.max * 2.5); e.D = { ...e.D, boss: true }; }
  return e;
}
function h2Panel(){
  const groups = ['all', '3기', '3기-2', '1기', '1성', '2성', '3성', '4성', '5성', '보스', '기타'];
  const L = H2.list.map(s => H2R[s]).filter(o => H2UI.f === 'all' || (H2UI.f === '3기' ? o.gen === 3 : H2UI.f === '3기-2' ? o.batch === '3기-2' : H2UI.f === '1기' ? o.gen === 1 : h2Rank(o) === H2UI.f));
  const card = o => { const K = H2K[o.slug] || {}, sk = (K.sk || []).map(s => s.n).join(' · '), miss = (o.missing || []).map(m => String(m).split(' ')[0]).join(', ');
    return `<div class="h2c">${h2FaceHtml(o)}<div><b>${DEFS['h2_' + o.slug].name}</b> <small>${o.gen === 3 ? '3기 · ' + String(o.rank || '').split(' ')[0] : o.gen === 1 ? '1기 · ' + h2Rank(o) : h2Rank(o)} · ${o.role_job || o.role || ''} · ${o.tall || '?'}m</small>
      <p>${K.pas ? `<em>${K.pas[0]}</em> ${K.pas[1]}<br>` : ''}기술: ${sk || '—'}<br><small>그림 ${Object.keys(o.poses).join(' · ')}${miss ? ` / 빠짐 ${miss}` : ''}</small></p>
      <span><button data-h2="ally" data-s="${o.slug}">동료로</button><button data-h2="foe" data-s="${o.slug}">적으로</button>${K.boss ? `<button data-h2="boss" data-s="${o.slug}">보스로</button>` : ''}</span></div></div>`; };
  return `<p class="dp-note">2기 · 3기 멤버 (드라이브 그림 ${H2.list.length}명, 3기 ${H2.list.filter(x => H2R[x].gen === 3).length}명 · 3기-2 ${H2.list.filter(x => H2R[x].batch === '3기-2').length}명 · 1기 새 시트 ${H2.list.filter(x => H2R[x].gen === 1).length}명). 동료는 2조로 들어옴 — 기술은 알아서 씀. 그림이 한 장씩이라 몸을 눌렀다 폈다 하며 움직임 (걷기 · 맞기 그림이 오면 바꿈).</p>
    <div class="dp-row">${groups.map(g => `<button data-h2="f" data-s="${g}" class="${H2UI.f === g ? 'on' : ''}">${g === 'all' ? '전부' : g}</button>`).join('')}<button data-h2="mix">혼전 (동료 넷 · 적 넷)</button><button data-h2="mix3">3기 적 습격 (강적 셋)</button><button data-h2="rats">포렌의 쥐 분대</button><button data-h2="clr">2기 동료 돌려보내기</button></div>
    <div class="h2g">${L.map(card).join('')}</div>`;
}
function h2PanelClick(b){
  const a = b.dataset.h2, s = b.dataset.s;
  if (a === 'f') H2UI.f = s;
  if (a === 'ally') h2Ally(s);
  if (a === 'foe' || a === 'boss'){ drillPanel(false); h2Foe(s, a === 'boss'); }
  if (a === 'clr') for (const u of G.units.filter(u => u.side === 'ally' && u.D.h2)) removeUnit(u);
  if (a === 'rats'){ drillPanel(false); h2Ally('ratvet'); h2Ally('ratknight'); h2Ally('ratknight'); h2Ally('ratsmall'); h2Ally('ratsmall'); caption('포렌의 쥐 분대', '쥐 베테랑 · 쥐 기사 둘 · 일반 쥐 둘'); }
  if (a === 'mix3'){ drillPanel(false); const P = H2.list.filter(s => H2R[s].gen === 3 && !(H2K[s] || {}).boss && !H2NOMIX.has(s)).sort(() => Math.random() - 0.5); P.slice(0, 3).forEach(s => h2Foe(s)); caption('3기 적 습격', P.slice(0, 3).map(s => DEFS['h2e_' + s].name).join(' · ')); }
  if (a === 'mix'){ drillPanel(false); const P = H2.list.filter(s => !(H2K[s] || {}).boss && !H2NOMIX.has(s)).sort(() => Math.random() - 0.5); P.slice(0, 4).forEach(s => h2Ally(s)); P.slice(4, 8).forEach(s => h2Foe(s)); caption('2기 혼전', '동료 넷 · 적 넷 — 기술이 섞임'); }
}

/* ---------- 패시브 (pas[0] 이름 → 실제 효과). 이름이 없는 것은 아직 글만 ----------
   피해 받을 때 (in) · 줄 때 (out) · 매 순간 (tick) */
const H2PAS = {
  '뒷골목 맷집': { out: (u) => u.hp < u.max * 0.3 ? 1.2 : 1 },
  '흉터': { out: (u) => u.hp < u.max * 0.3 ? 1.25 : 1 },
  '무심': { out: (u, t) => { if (u._h2first) return 1; u._h2first = true; return 1.8; } },
  '복면': { out: (u) => isCrouched(u) ? 1.4 : 1 },
  '그림자 검사': { out: (u) => isCrouched(u) ? 1.6 : 1 },
  '용사의 기세': { out: (u) => { if (!u._h2kill) return 1; u._h2kill = false; return 1.3; } },
  '기사의 맹세': { out: (u) => u._h2rage > G.t ? 1.25 : 1, ally: 1 },
  '의리파': { out: (u) => u._h2rage > G.t ? 1.3 : 1, ally: 1 },
  '대방패': { in: (u, o) => o.ranged && h2Front(u, o.from) ? 0.6 : 1 },
  '뼈갑옷': { in: (u, o) => o.ranged && h2Front(u, o.from) ? 0.7 : 1 },
  '중장갑': { in: (u, o) => o.ranged ? 0.8 : 1, kb: 0.4 },
  '갑각 장갑': { in: (u, o) => o.ranged || o.fam === 'magic' ? 1 : 0.8, kb: 0 },
  '거구': { kb: 0.3 }, '장군의 위엄': { kb: 0 }, '청록 바이저': { kb: 0.5 },
  '악마의 몸': { dodge: 0.15 }, '찢긴 망토': { dodge: 0.1 },
  '성장한 천사': { in: (u) => u.h2form ? 0.8 : 1 },
  '이계의 몸': { last: 1 },
  '대정령의 숲': { tick: (u, dt) => { for (const o of G.units) if (o.side === u.side && !o.dead && !o.downed && o.hp < o.max && dist(o, u) < 5) o.hp = Math.min(o.max, o.hp + o.max * 0.012 * dt); } },
  '황금 늑대 가면': { tick: (u, dt) => { if (G.units.some(o => o.D.h2 === 'dolsoe' && o.side === u.side && !o.dead && dist(o, u) < 6)) u.hp = Math.min(u.max, u.hp + u.max * 0.01 * dt); } },
};

// v1.5 3기 패시브
const h2Phys = o => o.fam !== 'magic';
const h2Near = (u, f, r = 10) => G.units.some(o => o !== u && o.side === u.side && !o.dead && o.D.h2 && f(o) && dist(o, u) < r);
Object.assign(H2PAS, {
  '사냥꾼의 눈': { out: (u, t) => t && (t.st === 'hurt' || t.lying || (t.sts && t.sts.slow && t.sts.slow.t > 0)) ? 1.2 : 1 },
  '관측 기록': { out: (u, t) => { if (!t) return 1; if (u._obs !== t){ u._obs = t; u._obsN = 0; } u._obsN = Math.min(5, (u._obsN || 0) + 1); return 1 + 0.05 * (u._obsN - 1); } },
  '돌갑주': { in: (u, o) => o.ranged ? 1 : 0.8, kb: 0 },
  '마신족 무리': { out: (u) => 1 + 0.1 * Math.min(3, G.units.filter(o => o !== u && o.D.h2 === 'majin' && o.side === u.side && !o.dead && dist(o, u) < 10).length) },
  '두꺼운 판금': { in: (u, o) => h2Phys(o) ? 0.75 : 1.2, kb: 0.5 },
  '망령': { in: (u, o) => h2Phys(o) ? 0.8 : 1.3 },
  '원령': { in: (u, o) => h2Phys(o) ? 0.6 : 1.5 },
  '붉은 갑주': { in: (u, o) => h2Front(u, o.from) ? 0.75 : 1.2 },
  '무쇠 몸통': { in: (u, o) => h2Front(u, o.from) ? 0.7 : 1.3, kb: 0 },
  '초월 신체': { in: (u, o) => !o.ranged && h2Front(u, o.from) ? 0.75 : 1, kb: 0 },
  '가시 비늘': { thorn: 0.1 },
  '가시 털가죽': { thorn: 0.15, in: (u, o) => o.ranged ? 0.8 : 1, kb: 0.2 },
  '오니 가면': { out: (u) => u.hp < u.max * 0.5 ? 1.25 : 1 },
  '빛나는 눈': { out: (u) => u.hp < u.max * 0.5 ? 1.25 : 1 },
  '얼굴 없는 자': { dodge: 0.12 },
  '누더기 그림자': { dodge: 0.12 },
  '공허의 껍질': { in: (u, o) => h2Phys(o) ? 0.8 : 1, tick: (u, dt) => { u.hp = Math.min(u.max, u.hp + u.max * 0.004 * dt); } },
  '흐르는 몸': { in: (u, o) => o.fam === 'fire' || o.sts === 'burn' ? 1.25 : h2Phys(o) ? 0.8 : 1 },
  '붉은 암석 몸': { in: (u, o) => o.ranged ? 0.6 : 1.1, kb: 0.2 },
  '돌 거신': { in: (u, o) => o.ranged ? 0.75 : 1, kb: 0 },
  '암계의 장군': { in: (u) => h2Near(u, o => o.D.h2 === (u.D.h2 === 'haryu' ? 'heugik' : 'haryu')) ? 0.85 : 1 },
  '흑철 갑주': { in: (u, o) => !o.ranged && h2Front(u, o.from) ? 0.75 : 1, out: (u) => 1 + 0.05 * Math.min(5, u._h2fallen || 0) },
  '긴 팔': { out: (u, t) => t && dist(u, t) > 3 ? 1.15 : 1 },
});

// v1.6 남은 패시브 (자체점검: 글만 있던 것) — 탐험용 (수집가의 자루 · 이계 탐험가 · 타천 날개 · 차원 영웅)은 원정 쪽 효과라 여기선 작게
const h2Dark = u => typeof lightMul === 'function' && lightMul(u.x, u.z) < 0.6;
Object.assign(H2PAS, {
  '깃털 몸': { in: (u, o) => o.ranged ? 1 : 0.75 },
  '인공 후광': { out: (u) => h2Near(u, () => true, 4) ? 1.1 : 1 },
  '초인계 마수': { hitSts: 'burn', in: (u, o) => o.sts === 'burn' || o.fam === 'fire' ? 0.5 : 1 },
  '붕대 갑옷': { in: (u, o) => o.fam === 'fire' ? 1.3 : o.ranged ? 1 : 0.8 },
  '차원 영웅': { out: (u) => (u._h2sw = ((u._h2sw || 0) + 1) % 3) === 0 ? 1.25 : 1 },   // 곤봉 · 조율봉 · 권총을 바꿔 들어 세 번째마다 강타
  '악마의 뿔': { out: (u) => h2Dark(u) ? 1.15 : 1 },
  '깃털귀 천사': { out: (u) => isCrouched(u) ? 1.4 : 1 },
  '후광': { tick: (u, dt) => { for (const o of G.units) if (o !== u && o.side === u.side && !o.dead && !o.downed && o.hp < o.max && dist(o, u) < 4) o.hp = Math.min(o.max, o.hp + o.max * 0.004 * dt); } },
  '남색 결의': { in: (u) => h2Near(u, o => !!(o.D.bow), 6) ? 0.85 : 1 },
  '계약의 그림자': { tick: (u, dt) => { u._h2ct = (u._h2ct || 0) - dt; if (u._h2ct > 0 || u.hp > u.max * 0.4 || u.st !== 'idle') return; const s = (H2K[u.D.h2].sk || []).find(x => x.type === 'summon'); if (!s) return; u._h2ct = 30; h2Cast(u, s, null); popText(u.x, u.y + 2, u.z, '계약의 그림자', 'alert', 1); } },
  '그림자 몸': { in: (u) => h2Dark(u) ? 0.85 : 1.15, out: (u) => h2Dark(u) ? 1.15 : 1 },
  '비늘 깃털 갑옷': { in: (u, o) => o.ranged && h2Front(u, o.from) ? 0.7 : h2Front(u, o.from) ? 1 : 1.15 },
  '악마의 눈': { out: (u) => h2Dark(u) ? 1.1 : 1 },
  '타천 날개': { dodge: 0.08 },
  '유령 몸': { in: (u, o) => h2Phys(o) ? 0.7 : 1.2 },
  '웃는 가면': { out: (u, t) => t && !h2Front(t, u) ? 1.4 : 1 },   // 등 돌린 적에게 배신의 칼
  '수집가의 자루': {}, '이계 탐험가': {},
});
// v1.8 쥐 기사 성장 단계 (민수: 날이 갈수록 커지고, 오래 살아남으면 베테랑). 나올 때 1~4단계 — u.ratLv 를 미리 주면 그 단계
const RAT_LV = [null, { k: 0.7, hp: 0.55, atk: 0.6 }, { k: 0.8, hp: 0.7, atk: 0.75 }, { k: 0.9, hp: 0.85, atk: 0.9 }, { k: 1, hp: 1, atk: 1 }];
{
  const _spawnRat = spawn;
  spawn = function(kind, x, z, side){
    const u = _spawnRat(kind, x, z, side);
    if (u && u.D && u.D.h2 === 'ratknight'){
      const lv = H2.ratLv || u.ratLv || 1 + Math.floor(Math.random() * 4), L = RAT_LV[lv]; u.ratLv = lv;
      u.S = { ...u.S, tall: u.S.tall * L.k }; u.max = u.hp = Math.max(1, Math.round(u.max * L.hp)); u.atk = Math.max(1, Math.round(u.atk * L.atk)); u.r = (u.r || 0.3) * L.k;
      if (typeof popText === 'function') popText(u.x, u.y + 1.4, u.z, `${lv}단계`, 'miss', 0.8);
    }
    return u;
  };
}
// 3기-2 패시브
Object.assign(H2PAS, {
  '쥐 떼': { in: (u) => 1 - 0.05 * Math.min(3, G.units.filter(o => o !== u && /^rat(knight|vet)$/.test(o.D.h2 || '') && o.side === u.side && !o.dead && dist(o, u) < 3).length) },
  '베테랑의 근성': { last: 1, in: (u, o) => o.ranged && h2Front(u, o.from) ? 0.65 : 1 },
  '작은 몸': { dodge: 0.25 },
  '무기 바꿔 쥐기': { out: (u) => (u._h2sw = ((u._h2sw || 0) + 1) % 3) === 0 ? 1.25 : 1 },
  '각성': { in: (u) => u.h2form ? 0.8 : 1 },
  '마계 대사': { last: 1 },
  '정령 계약': { tick: (u, dt) => { for (const o of G.units) if (o.side === u.side && !o.dead && !o.downed && o.hp < o.max && dist(o, u) < 5) o.hp = Math.min(o.max, o.hp + o.max * 0.006 * dt); } },
  '밤나방': { dodge: 0.06, out: (u) => h2Dark(u) ? 1.1 : 1 },
  '고대의 가시': { thorn: 0.15, out: (u) => u.hp < u.max * 0.5 ? 1.2 : 1, kb: 0.2 },
  '젤리 몸': { in: (u, o) => o.ranged ? 1 : 0.85 },
  '산호 갑옷': { in: (u) => u.h2form ? 0.85 : 1 },
  '부족 전사의 피': { out: (u) => { if (!u._h2kill) return 1; u._h2kill = false; return 1.3; }, kb: 0.7 },
  '슈퍼스타의 광기': { last: 1, out: (u) => 1 + 0.4 * (1 - u.hp / u.max) },
  '장난꾸러기 간호사': { out: (u) => { const o = G.units.filter(x => x !== u && x.side === u.side && !x.dead && !x.downed && x.hp < x.max && dist(x, u) < 4).sort((a, b) => a.hp / a.max - b.hp / b.max)[0]; if (o) o.hp = Math.min(o.max, o.hp + u.atk * 0.15); return 1; } },
  '묘지기': { out: (u, t) => t && (t.lying || t.downed) ? 1.3 : 1 },
  '요정 날개': { dodge: 0.1 },
  '흑토끼의 충성': { out: (u) => u._h2rage > G.t ? 1.25 : 1, ally: 1 },
  '마녀의 망토': { last: 1 },
  '고목의 뿔': { in: (u, o) => !o.ranged && h2Front(u, o.from) ? 0.8 : 1 },
  '숨은 도깨비': { out: (u) => { if (!u._h2first){ u._h2first = true; return 1.8; } return u.hp < u.max * 0.5 ? 1.25 : 1; } },
  '4족 기체': { in: (u, o) => !o.ranged && h2Front(u, o.from) ? 0.8 : 1, kb: 0 },
  '큰 삿갓': { dodge: 0.12, in: (u, o) => o.ranged ? 0.85 : 1 },
  '백랑 털망토': { in: (u, o) => h2Front(u, o.from) ? 0.85 : 1, out: (u) => u.hp < u.max * 0.3 ? 1.2 : 1 },
  '붉은 가시 로브': { thorn: 0.2, kb: 0 },
  '하늘만 보는 왕': { in: (u, o) => o.ranged && h2Front(u, o.from) ? 0.7 : 1, kb: 0.4 },
});
const h2Front = (u, f) => !f || f.x == null ? false : Math.cos(Math.atan2(f.z - u.z, f.x - u.x) - (u.aim ?? 0)) > 0.3;
const h2P = u => u && u.D && u.D.h2 && H2K[u.D.h2] && H2K[u.D.h2].pas ? H2PAS[H2K[u.D.h2].pas[0]] : null;
{
  const _hurtH2 = hurt;
  hurt = function(att, tgt, base, o = {}){
    if (!tgt || tgt.dead || tgt.downed) return _hurtH2(att, tgt, base, o);
    const A = h2P(att), T = h2P(tgt);
    if (A && A.out) base *= A.out(att, tgt);
    if (T){
      if (T.dodge && Math.random() < T.dodge && !o.unblockable){ popText(tgt.x, tgt.y + 1.6, tgt.z, '회피', 'miss'); return 0; }
      if (T.in) base *= T.in(tgt, o);
      if (T.kb != null && o.kb) o = { ...o, kb: o.kb * T.kb, stun: T.kb === 0 ? 0 : o.stun };
      if (T.last && !tgt._h2last && tgt.hp - base * 1.1 <= 0){ tgt._h2last = true; base = Math.max(0, tgt.hp - 1); popText(tgt.x, tgt.y + 2, tgt.z, '버팀!', 'alert', 1); }
    }
    const r = _hurtH2(att, tgt, base, o);
    if (A && A.hitSts && r > 0 && typeof addStatus === 'function' && !tgt.dead) addStatus(tgt, A.hitSts, { t: 3, dps: att.atk * 0.15, k: 0.3 });
    if (T && T.thorn && att && !o.ranged && att !== tgt && att.D && !att.dead && r > 0 && !o._thorn) _hurtH2(tgt, att, r * T.thorn, { from: tgt, kb: 0, _thorn: true });
    if (tgt.dead || tgt.downed){
      if (A && (att.D.h2 === 'tanga' || att.D.h2 === 'mari')) att._h2kill = true;
      if (A && att.D.h2 === 'yongmyo' && !att.dead){ att.hp = Math.min(att.max, att.hp + att.max * 0.03); }
      for (const v of G.units) if (v.side === tgt.side && v !== tgt && !v.dead && dist(v, tgt) < 7){ const P = h2P(v); if (v.D.h2 === 'ted') v._h2fallen = (v._h2fallen || 0) + 1; if (P && P.ally){ v._h2rage = G.t + 5; popText(v.x, v.y + 2, v.z, '분노', 'alert', 0.8); } }
    }
    return r;
  };
}
TICKS.push(dt => { for (const u of G.units) if (u.D.h2 && !u.dead && !u.downed){ const P = h2P(u); if (P && P.tick) P.tick(u, dt); } });
