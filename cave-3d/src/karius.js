/* karius.js v1.2 — (v1.2, v0.54: 광대의 팔 잡아뚫기는 공중에 뜬 적도 붙잡아 끌어내림 (3.4칸, 보스도 — 끌어내려 잠깐 휘청). 어퍼 둘째 · 훅 셋째 · 노인의 팔 · 꿰뚫기는 공중도 침) (v1.1, v0.53: 불경자 · 근성을 2D판 원본대로 — 불경자 체력 15%: 공격력 ×2.5 (기술 포함) · 받는 피해 67% 더 감소 · 이동 ×1.4 · 공격 간격 ×0.8 · 철퇴 100 · 돌진 88. 근성 = 마지막 항전: 체력 0 → 3초 무적 발버둥 → 안광 → 7초 쓰러지지 않음 (공격속도 ×1.5 · 모든 공격 치명 · 슈퍼아머) → 실이 끊긴 듯 쓰러짐. 3D판에서 따로 만든 '체력 45% 포효 근성'은 뺌)
   v1.0 — Sir. 카리우스 (v0.47: prologue.js에서 옮김 + 드라이브 새 그림 · 발 기술 · 짓뭉개짐 · 근성 · 개조된 신체)
   그림: art/kar (tools/kar_art.py가 드라이브 '카리우스' 폴더 그림을 정리). 3m 융합 거구 — 카이로스 경 (안경 대머리) · 광대 · 노인 · 슬픈 여자
   체력 500 · 개조된 신체 (모든 피해 60% 감소 + 상태 이상 절반) · 느림 · 무거움 (무게 300)
   기술 (동료 AI가 고름. 위에 있을수록 먼저):
   · 확인사살 짓밟기: 누운 적 (넘어짐 · 짓뭉개짐 · 그라운드)이 2.6칸 안 → 발 들기 → 쾅. 보스가 아니면 그 자리에서 죽음. 서 있는 놈에겐 26 · 넘어뜨림
   · 딥킥 '뻥' (7초): 앞 2.2칸 한 놈을 멀리 걷어참 (무게로 거리). 날아가다 벽에 박으면 짓뭉개짐. 벽을 등진 놈을 먼저 노림
   · 잡아뚫기 (11초): 광대의 팔이 돋아 끌어와 → 레프트 꿰뚫기 (30, 치명 50%, 방어 무시)
   · 라이트 훅 다단히트 (6초): 팔 여럿으로 세 번 (부채꼴 1.9칸)
   · 노인의 팔 후려치기 (4초): 앞 2.7칸 부채꼴, 30 · 밀침 · 경직
   · 기본: 라이트 준비 → 어퍼 (두 대)
   · 체력 15% 아래: 불경자 카리우스 (컷씬 · 공격력 2.5배 · 받는 피해 67% 더 감소 · 이동 1.4배 · 걸을 때 쿵쿵) + 노인의 팔 철퇴 (원 1.3칸, 100 · 경직) · 돌진 몸박 (88, 밀고 나가 벽에 짓뭉갬)
   · 근성 (마지막 항전): 체력 0 → 3초 무적 발버둥 (안경 빛 꺼짐) → 안광이 살아나 울부짖음 → 7초 쓰러지지 않음 (공격속도 1.5배 · 모든 공격 치명 · 슈퍼아머) → 실이 끊긴 듯 쓰러짐
   · 벼락을 맞으면: 연기를 토하며 차갑게 미쳐 감 (6초 공격력 ×1.3)
   짓뭉개짐 (밀치기 공통 규칙, 누구든):
   · shove(시전자, 대상, 힘, 방향): 무게 비 (시전자 ÷ 대상)^0.6 만큼 날아감 (보스는 ¼). 날아가다 벽에 박으면 남은 기세만큼 짓뭉개짐 (치명 · 방어 무시 · 넘어짐 1.6초)
     이미 벽에 붙어 있으면 (벽과 시전자 사이에 낌) 그 자리에서 1.2배로 짓뭉개짐. 날아가다 다른 놈과 부딪히면 둘 다 다침 (볼링)
   · 밀어내는 공격 (밀침 1 이상)에 맞은 놈 바로 뒤가 벽이면, 시전자가 비슷하게 무거울 때 짓눌림 (적이 인주를 벽에 몰아도 똑같음 — 적들은 바보가 아님) */
'use strict';
const KA = 'art/kar/';
const kq = (k, o = {}) => ({ ...KAR_SHEETS[k], f: 1, ...o });
SPR.karius = { h0: 560, tall: 2.45, poses: {
  idle: kq('idle'), walk: kq('walk2', { fps: 3.2 }), step: kq('walk'), dig: kq('dig', { fps: 2.2 }),
  heretic: kq('hIdle'), hWalk: kq('hWalk2', { fps: 4.4 }), hRoar: kq('hRoar'), grit: kq('grit'), gritRoar: kq('gritRoar'),
  prep: kq('hurt', { f: -1 }), hurt: kq('hurt', { f: -1 }), upper: kq('upper'), punch: kq('upper'),
  hookPrep: kq('hookPrep', { f: -1 }), hook: kq('hook', { f: -1 }), sweep: kq('swat', { f: -1 }), swat: kq('swat', { f: -1 }),
  sprout: kq('sprout'), grab: kq('grab'), pierce: kq('pierce'), raise: kq('raise'), slam: kq('mace'), mace: kq('mace'),
  tackle: kq('tackle'), rush: kq('rush'), footUp: kq('footUp'), kick: kq('kick') } };
DEFS.kariusAlly = { spr: 'karius', name: '카리우스', hp: 500, atk: 12, spd: 2.0, r: 0.6, weight: 300, dr: 0.6, resist: 0.5, think: kariusThink };
const KSK = {   // 기술 그림 · 이름 (상태 창 · 기술 알림)
  body:   { icon: KA + 'icon_body.webp', n: '개조된 신체', d: '고유 특성 — 모든 피해 60% 감소 · 상태 이상 (불 · 얼음 · 벼락 · 독 · 경직) 절반. 꿰맨 신의 정성으로 후유증이 없다' },
  grit:   { icon: KA + 'icon_grit.webp', n: '근성', d: '마지막 항전 — 체력이 0이 되면 3초 무적으로 꿈틀거리다 안광이 살아나 울부짖고, 7초 동안 무슨 일이 있어도 쓰러지지 않음. 공격속도 1.5배 · 모든 공격 치명타 · 슈퍼아머 (경직 없음 · 거의 안 밀림). 7초가 되면 실이 끊긴 듯 쓰러짐' },
  pierce: { icon: KA + 'icon_pierce.webp', n: '잡아뚫기', d: '광대의 팔이 돋아 붙잡아 끌어와 레프트로 꿰뚫음 — 30 · 치명 50% · 방어 무시 (11초)' },
  heretic:{ icon: KA + 'icon_heretic.webp', n: '불경자', d: '체력 15% 아래 — 얼굴이 새까매지고 안경만 빛남. 공격력 2.5배 (기술 포함) · 받는 피해 67% 더 감소 · 이동 1.4배 · 공격 간격 0.8배 · 막지 않음. 철퇴 (100 · 경직, 5초) · 돌진 몸박 (88, 8초)' },
  stomp:  { icon: KA + 'footUp.webp', n: '짓밟기', d: '누운 적은 확인사살 (보스 제외). 서 있으면 26 · 넘어뜨림' },
  kick:   { icon: KA + 'kick.webp', n: '딥킥', d: '앞의 한 놈을 멀리 걷어참 — 벽에 박으면 짓뭉개짐 (7초)' },
};
const HERO_SK = { karius: ['body', 'grit', 'pierce', 'stomp', 'kick', 'heretic'] };
function heroSkillsHtml(h){
  const L = HERO_SK[h.id]; if (!L) return '';
  return `<div class="rw-sk"><div class="rw-sub">고유 특성 · 기술</div>${L.map(k => { const s = KSK[k]; return `<div class="rw-ski">${s.icon ? `<img src="${s.icon}" alt="">` : '<i></i>'}<div><b>${s.n}</b><small>${s.d}</small></div></div>`; }).join('')}</div>`;
}
const KCD = ['cd', 'swCd', 'grCd', 'slCd', 'rsCd', 'stCd', 'dkCd', 'gtCd', 'hkCd'];
const isLying = e => !!(e && !e.dead && (e.lying || (e.tripT && e.tripT > G.t)));

/* ---------- 기술 알림 · 컷씬 ---------- */
function skillCall(u, sk, name){
  let box = document.getElementById('skcall'); if (!box){ box = document.createElement('div'); box.id = 'skcall'; document.body.appendChild(box); }
  const el = document.createElement('div'); el.className = 'skc'; el.innerHTML = `${sk.icon ? `<img src="${sk.icon}" alt="">` : ''}<b>${name || sk.n}</b><small>${u.D.name}</small>`;
  box.appendChild(el); setTimeout(() => el.classList.add('out'), 1300); setTimeout(() => el.remove(), 1800);
}
function cutIn(src, big, small){
  let el = document.getElementById('cutin'); if (!el){ el = document.createElement('div'); el.id = 'cutin'; document.body.appendChild(el); }
  el.innerHTML = `<img src="${src}" alt=""><div><b>${big}</b><span>${small || ''}</span></div>`; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
}

/* ---------- 두뇌 ---------- */
function kariusThink(u, dt){
  if (u.downed) return;
  if (u.ls && kLastStand(u, dt)) return;   // 근성: 발버둥 중
  if (u.p2 && !u.ls && u.hp > u.max * 0.5){ u.p2 = false; u.atk = DEFS.kariusAlly.atk; }   // 쉬어서 회복하면 원래대로
  for (const k of KCD) u[k] = (u[k] ?? 0) - dt * (u.ls ? 1.5 : 1);   // 근성: 공격속도 1.5배
  const m = (u.p2 ? KH.atk : 1) * (u.rageT > G.t ? 1.3 : 1), K = u.kc;
  if (K){ K.t += dt; kariusSkill(u, K, m, dt); return; }
  if (u.st === 'hurt'){ u.stT -= dt; if (u.stT <= 0) u.st = 'idle'; return; }
  if (!u.p2 && u.hp <= u.max * 0.15){   // 불경자
    u.kc = { type: 'heretic', t: 0 }; setPose(u, 'hRoar'); popText(u.x, u.y + 3.4, u.z, '불경자 카리우스', 'crit', 1.6); camShake(0.4, 0.4); ring(u.x, u.z, 0xfff6c0, 3, 0.5);
    if (!G.kHereticCut){ G.kHereticCut = true; cutIn(KA + 'cut_heretic.webp', '불경자 카리우스', '…신을 모욕한 학자'); }
    skillCall(u, KSK.heretic); return;
  }
  const pl = G.player, list = foes().filter(e => e.alert && !e.dead);
  const tg = G.mode === 'exp' && G.cmd === 'focus' && G.focusTarget && !G.focusTarget.dead ? G.focusTarget : nearest(u, list, 30);
  const follow = G.mode === 'exp' && G.cmd === 'follow' && pl && !pl.downed;
  if (!tg || follow){ if (G.mode === 'exp') return allyThink(u, dt); setPose(u, u.p2 ? 'heretic' : 'idle'); u.moving = false; return; }
  // 확인사살: 누운 적
  const down = list.filter(e => isLying(e) && dist(u, e) < 3.4).sort((a, b) => dist(u, a) - dist(u, b))[0];
  if (down && u.stCd <= 0){
    if (dist(u, down) > 1.5){ navTo(u, down.x, down.z, u.spd * (u.p2 ? 1.6 : 1.3), dt, 1.2); setPose(u, u.p2 ? 'hWalk' : 'walk'); return; }
    return kStomp(u, down);
  }
  const d = dist(u, tg), a = Math.atan2(tg.z - u.z, tg.x - u.x);
  setAim(u, tg.x, tg.z);
  const front = o => { const dd = Math.hypot(o.x - u.x, o.z - u.z); return dd < 2.7 && Math.abs(angDiff(Math.atan2(o.z - u.z, o.x - u.x), a)) < 1.2; };
  // 딥킥: 벽을 등진 놈은 바로, 아니면 가끔
  if (u.dkCd <= 0 && d <= 2.0 && !tg.D.boss && (wallBehind(tg, a, 3.5) || Math.random() < 0.35)){
    u.dkCd = 7; u.kc = { type: 'dkick', t: 0, a, tg, dec: decal('line', { x: u.x, z: u.z, len: 2.3, w: 1.1, a, dur: 0.45, color: BLUE }) }; setPose(u, 'footUp'); return;
  }
  if (u.p2 && u.rsCd <= 0 && d > 2.8 && d < 7){ u.rsCd = 8; u.kc = { type: 'rush', t: 0, a, dec: decal('line', { x: u.x, z: u.z, len: 4.5, w: 1.3, a, dur: 0.5, color: BLUE }), hit: new Set() }; setPose(u, 'tackle'); say(u, '우오오오!', 'soft', 0.8); return; }
  if (u.p2 && u.slCd <= 0 && d <= 2.3){ u.slCd = 5; const px = u.x + Math.cos(a) * 1.3, pz = u.z + Math.sin(a) * 1.3; u.kc = { type: 'slam', t: 0, px, pz, dec: decal('circle', { x: px, z: pz, r: 1.3, dur: 0.7, color: BLUE }) }; setPose(u, 'raise'); return; }
  const air = tg.airborne || (tg.lift || 0) > 0.6;   // v1.2 광대의 팔은 공중에 뜬 놈도 붙잡아 끌어내림 (보스도)
  if (u.grCd <= 0 && (air ? d <= 3.4 : d <= 1.9 && !tg.D.boss)){ u.grCd = 11; u.kc = { type: 'grab', t: 0, tg, air }; setPose(u, 'sprout'); skillCall(u, KSK.pierce); popText(tg.x, tg.y + 1.8, tg.z, '잡힘!', 'hurt big', 1); return; }
  if (u.stCd <= 0 && d <= 1.6 && Math.random() < 0.3){ return kStomp(u, tg); }
  if (u.hkCd <= 0 && d <= 1.9){ u.hkCd = 6; u.kc = { type: 'hook', t: 0, a, n: 0, dec: decal('sector', { x: u.x, z: u.z, r: 1.9, a, arc: 1.7, dur: 0.5, color: BLUE }) }; setPose(u, 'hookPrep'); return; }
  if (u.swCd <= 0 && list.some(front)){ u.swCd = 4; u.kc = { type: 'sweep', t: 0, a, dec: decal('sector', { x: u.x, z: u.z, r: 2.7, a, arc: 2.4, dur: 0.5, color: BLUE }) }; setPose(u, 'hookPrep'); return; }
  if (d > 1.8){ navTo(u, tg.x, tg.z, u.spd * (u.p2 ? 1.4 : 1), dt, 1.5); setPose(u, u.p2 ? 'hWalk' : 'walk'); if (u.p2){ u.stomp = (u.stomp || 0) - dt; if (u.stomp <= 0){ u.stomp = 0.42; camShake(0.08, 0.1); dust(u.x, u.z, 4); } } return; }
  setPose(u, u.p2 ? 'heretic' : 'idle');
  if (u.cd <= 0){ u.cd = u.p2 ? 1.4 * 0.8 : 1.4; u.kc = { type: 'punch', t: 0, a, n: 0, dec: decal('sector', { x: u.x, z: u.z, r: 1.9, a, arc: 1.5, dur: 0.45, color: BLUE }) }; setPose(u, 'prep'); }
}
function kStomp(u, e){
  u.stCd = isLying(e) ? 4 : 8; setAim(u, e.x, e.z);
  const px = e.x, pz = e.z;
  u.kc = { type: 'stomp', t: 0, px, pz, conf: isLying(e), dec: decal('circle', { x: px, z: pz, r: 0.95, dur: 0.55, color: BLUE }) }; setPose(u, 'footUp');
  if (u.kc.conf) skillCall(u, KSK.stomp, '확인사살');
}
function kariusSkill(u, K, m, dt){
  const hitIn = (pred, dmg, o) => { for (const e of foes()) if (!e.dead && pred(e)) hurt(u, e, dmg * m, { from: u, ...o }); };
  const inDec = e => K.dec && inShape(K.dec, e);
  const done = () => { u.kc = null; setPose(u, u.p2 ? 'heretic' : 'idle'); };
  if (K.type === 'heretic'){ if (K.t >= 0.5){ u.kc = null; u.p2 = true; u.atk = DEFS.kariusAlly.atk * KH.atk; say(u, '으으으…', 'soft', 1.2); camShake(0.5, 0.3); setPose(u, 'heretic'); } return; }
  if (K.type === 'stomp'){
    if (!K.hit && K.t >= 0.55){
      K.hit = true; setPose(u, 'step'); camShake(0.5, 0.3); G.hitstop = Math.max(G.hitstop, 0.12); dust(K.px, K.pz, 18); SFX.boom && SFX.boom(0.9);
      for (const e of foes()){
        if (e.dead || Math.hypot(e.x - K.px, e.z - K.pz) > 0.95 + e.r) continue;
        if (isLying(e) && !e.D.boss){   // 확인사살
          hurt(u, e, e.hp + 999, { from: u, crit: true, unblockable: true, pierce: true, noCam: true });
          popText(e.x, e.y + 1.2, e.z, '확인사살', 'crit', 1.6); spark(e.x, 0.3, e.z, 0x8a0a14, 30, 6);
          if (typeof clashLog === 'function') clashLog(`카리우스가 쓰러진 ${e.D.name}를 짓밟았다. 움직이지 않는다.`);
        } else if (isLying(e)) hurt(u, e, 60 * m, { from: u, crit: true, pierce: true });
        else { hurt(u, e, 26 * m, { from: u, stun: 0.5 }); if (!e.dead && !tooBig(u, e)){ e.lying = true; e.tripT = G.t + 1.0; e.st = 'hurt'; e.stT = 1.0; popText(e.x, e.y + 1.4, e.z, '넘어짐!', 'big', 0.8); } }
      }
    }
    if (K.t >= 0.95) done(); return;
  }
  if (K.type === 'dkick'){
    if (!K.hit && K.t >= 0.45){
      K.hit = true; setPose(u, 'kick'); SFX.thump && SFX.thump(120, 0.5, 0.2); camShake(0.3, 0.2);
      let any = false;
      for (const e of foes()) if (!e.dead && inDec(e)){ any = true; hurt(u, e, 22 * m, { from: u, noCam: true }); if (!e.dead) shove(u, e, 6.5, K.a, { crush: 42 * m }); popText(e.x, e.y + 1.6, e.z, '뻥!', 'big', 0.8); }
      if (any) skillCall(u, KSK.kick);
    }
    if (K.t >= 0.9) done(); return;
  }
  if (K.type === 'punch'){   // 라이트 준비 → 어퍼 (팔이 많아 두 대)
    if (K.n === 0 && K.t >= 0.42) setPose(u, 'upper');
    if (K.n === 0 && K.t >= 0.45){ K.n = 1; hitIn(inDec, u.atk / m, { kb: 0.4 }); }
    if (K.n === 1 && K.t >= 0.6){ K.n = 2; hitIn(inDec, u.atk / m, { kb: 0.7, hitsAir: true }); spark(u.x + Math.cos(K.a) * 1.4, 1.3, u.z + Math.sin(K.a) * 1.4, 0xd8d0e8, 6, 3); }
    if (K.t >= 0.85) done(); return;
  }
  if (K.type === 'hook'){    // 라이트 훅 다단히트: 세 번
    if (K.t >= 0.5) setPose(u, 'hook');
    for (const [i, at] of [[0, 0.55], [1, 0.7], [2, 0.85]]) if (K.n === i && K.t >= at){ K.n++; hitIn(inDec, u.atk * 0.9 / m, { kb: i === 2 ? 1.0 : 0.2, hitsAir: i === 2 }); spark(u.x + Math.cos(K.a) * 1.3, 1.4, u.z + Math.sin(K.a) * 1.3, 0xe8e0d0, 5, 3); }
    if (K.t >= 1.15) done(); return;
  }
  if (K.type === 'sweep'){   // 노인의 팔: 후려치기
    if (K.t >= 0.55) setPose(u, 'swat');
    if (!K.hit && K.t >= 0.62){ K.hit = true; camShake(0.3, 0.2); G.hitstop = Math.max(G.hitstop, 0.08); hitIn(inDec, 30, { kb: 1.6, stun: 0.5, hitsAir: true }); SFX.boom(0.5); }
    if (K.t >= 1.15) done(); return;
  }
  if (K.type === 'grab'){    // 잡아뚫기: 광대의 팔 → 끌어옴 → 레프트 꿰뚫기
    const t = K.tg; if (!t || t.dead || (t.D.boss && !K.air)){ done(); return; }
    if (t.D.boss){ if (K.t >= 0.4){ t.lift = Math.max(0, (t.lift || 0) - dt * 8); t.airborne = false; t.parried = Math.max(t.parried || 0, 0.4); if (t.B && t.B.act){ t.B.act = null; } t.inv = 0; if (t.decal){ cancelDecal(t.decal); t.decal = null; } if (!K.pulled){ K.pulled = true; popText(t.x, t.y + 3.5, t.z, '끌어내림!', 'crit', 1.2); camShake(0.4, 0.3); } } }
    else { t.st = 'hurt'; t.stT = 0.3; interrupt(t); if (K.t >= 0.4){ t.lift = Math.max(0, (t.lift || 0) - dt * 10); if (t.lift < 0.3) t.airborne = false; } }
    if (K.t >= 0.4 && K.t < 1.0) setPose(u, 'grab');
    if (K.t > 0.4 && K.t < 1.0 && !t.D.boss){ const gx = u.x + Math.cos(u.aim) * 0.9, gz = u.z + Math.sin(u.aim) * 0.9, k = Math.min(1, dt * 8); t.x += (gx - t.x) * k; t.z += (gz - t.z) * k; }
    if (!K.hit && K.t >= 1.0){ K.hit = true; setPose(u, 'pierce'); hurt(u, t, 30 * m, { from: u, crit: Math.random() < 0.5, critMul: 2, pierce: true, hitsAir: true, unblockable: !!t.D.boss }); spark(t.x, 1, t.z, 0xb3122a, 22, 5); camShake(0.35, 0.2); }
    if (K.t >= 1.5) done(); return;
  }
  if (K.type === 'slam'){    // 노인의 팔이 부풀어 철퇴처럼
    if (K.t >= 0.62) setPose(u, 'mace');
    if (!K.hit && K.t >= 0.7){ K.hit = true; camShake(0.55, 0.3); G.hitstop = Math.max(G.hitstop, 0.12); hitIn(e => Math.hypot(e.x - K.px, e.z - K.pz) < 1.3 + e.r, 40, { kb: 0.8, stun: 0.6 }); dust(K.px, K.pz, 16); popText(K.px, 1.4, K.pz, '쾅!', 'big', 0.6); SFX.boom(0.9); }
    if (K.t >= 1.15) done(); return;
  }
  if (K.type === 'rush'){    // 몸을 낮췄다가 일직선으로 밀고 나가 몸박 → 맞은 놈은 밀려 날아감 (벽이면 짓뭉개짐)
    if (K.t < 0.5) return;
    setPose(u, 'rush');
    if (K.t < 1.0){ moveBy(u, Math.cos(K.a) * 9 * dt, Math.sin(K.a) * 9 * dt); dust(u.x, u.z, 1); if (Math.random() < dt * 20) camShake(0.12, 0.08);
      for (const e of foes()) if (!e.dead && !K.hit.has(e) && Math.hypot(e.x - u.x, e.z - u.z) < 1.1){ K.hit.add(e); hurt(u, e, 35 * m, { from: u, noCam: true }); if (!e.dead) shove(u, e, 4.5, K.a, { crush: 45 * m }); } }
    else done();
  }
}

/* ---------- 짓뭉개짐: 밀치기 공통 ---------- */
const SHV = { list: [] };
const shoveW = u => (u.D.weight || 60) + ((u.rpg && u.rpg.A && u.rpg.A.str) || 0) * 3;
function wallBehind(e, a, reach){ const ca = Math.cos(a), sa = Math.sin(a); for (let s = e.r + 0.2; s <= reach; s += 0.35) if (solidAt(G.map, e.x + ca * s, e.z + sa * s)) return s; return 0; }
function shove(att, tgt, power, a, o = {}){
  if (!tgt || tgt.dead || (tgt.D.dummy && !tgt.D.spar)) return;
  const ratio = Math.pow(shoveW(att) / Math.max(30, shoveW(tgt)), 0.6), len = Math.min(power * 1.6, power * Math.max(0.12, ratio)) * (tgt.D.boss ? 0.25 : 1);
  if (wallBehind(tgt, a, tgt.r + 0.45)) return crush(att, tgt, a, 1, o, true);   // 벽과 시전자 사이에 낌
  interrupt(tgt); tgt.kx = tgt.kz = 0;
  SHV.list = SHV.list.filter(s => s.u !== tgt);
  SHV.list.push({ u: tgt, by: att, a, left: len, len, v: o.v || 13, o, hit: new Set([att, tgt]) });
  if (!tgt.D.boss){ tgt.st = 'hurt'; tgt.stT = Math.max(tgt.stT || 0, len / 13 + 0.3); setPose(tgt, 'hurt'); }
}
function shoveTick(dt){
  if (!SHV.list.length) return;
  SHV.list = SHV.list.filter(s => {
    const u = s.u; if (u.dead || G.units.indexOf(u) < 0){ return false; }
    const ca = Math.cos(s.a), sa = Math.sin(s.a), step = Math.min(s.left, s.v * dt);
    if (solidAt(G.map, u.x + ca * (u.r + step + 0.05), u.z + sa * (u.r + step + 0.05))){ u.lift = 0; crush(s.by, u, s.a, s.left / s.len, s.o); return false; }
    u.x += ca * step; u.z += sa * step; u.y = heightAt(G.map, u.x, u.z); s.left -= step;
    u.lift = Math.sin(Math.PI * (1 - s.left / s.len)) * Math.min(0.6, s.len * 0.08); if (Math.random() < 0.5) dust(u.x, u.z, 1);
    for (const e of G.units){   // 날아가다 부딪힘 (볼링)
      if (s.hit.has(e) || e.dead || e.downed || e.side === 'neutral' && !e.D.hittable || Math.hypot(e.x - u.x, e.z - u.z) > e.r + u.r) continue;
      s.hit.add(e); const c = s.o.crush || 30;
      hurt(s.by, e, c * 0.35, { from: u, noCrit: true, kb: 1.2, noCam: true }); hurt(s.by, u, c * 0.25, { from: e, noCrit: true, noCam: true });
      popText(e.x, e.y + bodyH(e) + 0.2, e.z, '쿵!', 'big', 0.7); SFX.thump && SFX.thump(130, 0.4, 0.15); s.left *= 0.5;
    }
    if (s.left <= 0.01){ u.lift = 0; if (!u.dead && !u.D.boss && !u.downed){ u.lying = true; u.tripT = G.t + 0.9; } return false; }
    return true;
  });
}
function crush(att, tgt, a, k, o = {}, pinned){
  if (!tgt || tgt.dead) return;
  const base = (o.crush || 35) * (0.5 + 0.5 * Math.max(0, Math.min(1, k))) * (pinned ? 1.2 : 1);
  hurt(att, tgt, base, { from: att, crit: true, critMul: 1.4, unblockable: true, noCam: true, crush: true });
  const ca = Math.cos(a), sa = Math.sin(a);
  popText(tgt.x, tgt.y + bodyH(tgt) + 0.5, tgt.z, pinned ? '벽에 짓눌림!' : '짓뭉개짐!', 'crit', 1.3);
  spark(tgt.x + ca * tgt.r, tgt.y + bodyH(tgt) * 0.5, tgt.z + sa * tgt.r, 0x8a0a14, 26, 6); dust(tgt.x + ca * (tgt.r + 0.3), tgt.z + sa * (tgt.r + 0.3), 16);
  camShake(0.5, 0.3); G.hitstop = Math.max(G.hitstop, 0.14); SFX.boom && SFX.boom(0.8);
  tgt.lift = 0;
  if (!tgt.dead && !tgt.downed && !tgt.D.boss){ interrupt(tgt); tgt.lying = true; tgt.tripT = G.t + 1.6; tgt.st = 'hurt'; tgt.stT = 1.6; setPose(tgt, 'hurt'); }
  if (typeof clashLog === 'function') clashLog(`${tgt.D.name}가 벽에 짓뭉개졌다.`);
  if (typeof crushWound === 'function') crushWound(tgt);   // v0.48: 부러짐 · 반병신
}
// 밀어내는 공격에 맞은 놈 바로 뒤가 벽 → 짓눌림 (시전자가 비슷하게 무거우면)
const _hurtK = hurt;
hurt = function(att, tgt, base, o = {}){
  const kar = tgt && tgt.D === DEFS.kariusAlly && !tgt.dead && !tgt.downed;
  if (kar && tgt.ls && tgt.ls.ph === 'agony') return 0;   // 근성: 발버둥 3초는 무적
  if (kar && !tgt.lsEnd){ o = { ...o, keep1: true }; if (tgt.ls) o = { ...o, stun: 0, kb: (o.kb || 0) / 4 }; }   // 체력 0 대신 근성 · 슈퍼아머 (경직 없음, 버티기 무게 4배)
  if (kar && tgt.p2 && !o.pierce) base *= 1 - KH.def;   // 불경자: 방어력 +50 (받는 피해 67% 더 감소)
  if (att && att.ls && att.ls.ph === 'last' && att.D === DEFS.kariusAlly) o = { ...o, crit: true };   // 근성: 모든 공격 치명타
  if (tgt && tgt.D.resist && o.stun) o = { ...o, stun: o.stun * (1 - tgt.D.resist) };   // 개조된 신체: 경직 절반
  const dmg = _hurtK(att, tgt, base, o);
  if (kar && !tgt.ls && !tgt.lsEnd && dmg > 0 && tgt.hp <= 1) kLastStandStart(tgt);
  const s = o.from || att;
  if (dmg > 0 && o.kb >= 1 && !o.crush && s && s.D && tgt && !tgt.dead && !tgt.D.heavy && !tgt.D.boss && shoveW(s) >= shoveW(tgt) * 0.8){
    const a = Math.atan2(tgt.z - s.z, tgt.x - s.x);
    if (wallBehind(tgt, a, tgt.r + 0.4)) crush(att, tgt, a, Math.min(1, o.kb / 2), { crush: base * 0.6 }, true);
  }
  return dmg;
};
// 개조된 신체: 상태 이상 절반 · 벼락 → 연기를 토하며 차갑게 미쳐 감
const _addStatusK = addStatus;
addStatus = function(u, k, v){
  if (u && u.D && u.D.resist && v && v.t && ['burn', 'freeze', 'shock', 'poison', 'slow', 'bleed', 'fear', 'confuse'].includes(k)) v = { ...v, t: v.t * (1 - u.D.resist), dps: v.dps ? v.dps * (1 - u.D.resist * 0.5) : v.dps };
  if (u && u.D === DEFS.kariusAlly && k === 'shock' && !(u.rageT > G.t)){ u.rageT = G.t + 6; smoke(u.x, u.z, 10, 1.2, 0.8, 0x4a4a52, 2.2); popText(u.x, u.y + 3.2, u.z, '…(연기를 토한다)', 'whisper', 1.6); }
  return _addStatusK(u, k, v);
};

/* ---------- v1.1 불경자 · 근성 (2D판 원본 그대로) ---------- */
const KH = { atk: 2.5, def: 0.67, agony: 3, last: 7 };
function kLastStandStart(u){
  interrupt(u); u.kc = null; u.hp = 1; u.ls = { ph: 'agony', t: 0, tick: 0 };
  if (!u.p2){ u.p2 = true; u.atk = DEFS.kariusAlly.atk * KH.atk; }
  setPose(u, 'hurt'); popText(u.x, u.y + 3.2, u.z, '…안경 빛이 꺼진다', 'whisper', 1.6); camShake(0.3, 0.3);
  if (typeof clashLog === 'function') clashLog('카리우스가 무너졌다… 꿈틀꿈틀 괴로워한다.');
}
// true = 이번 프레임은 근성이 다 씀 (발버둥 · 포효 · 끝)
function kLastStand(u, dt){
  const L = u.ls; L.t += dt; u.hp = Math.max(1, u.hp);
  if (L.ph === 'agony'){
    setPose(u, 'hurt'); u.moving = false; u.x += Math.sin(G.t * 31) * 0.006; if (Math.random() < dt * 2) say(u, '으으…', 'soft', 0.6);
    if (L.t >= KH.agony){
      L.ph = 'last'; L.t = 0; setPose(u, 'gritRoar'); skillCall(u, KSK.grit);
      popText(u.x, u.y + 3.4, u.z, '우어어어어!', 'crit', 1.6); camShake(0.55, 0.5); ring(u.x, u.z, 0xff5a3a, 6, 0.6); SFX.boom && SFX.boom(0.8);
      if (typeof clashLog === 'function') clashLog('카리우스의 안광이 살아난다 — 울부짖으며 최후의 7초 (근성).');
    }
    return true;
  }
  if (L.t < 0.8){ setPose(u, 'gritRoar'); return true; }   // 포효
  if (L.t - L.tick >= 1){ L.tick = Math.floor(L.t); popText(u.x, u.y + 3.6, u.z, `근성 ${Math.max(0, KH.last - L.tick)}초 · 슈퍼아머`, 'hurt', 0.9); if (Math.random() < 0.35) say(u, '우오오…!', 'soft', 0.8); }
  if (u.st === 'hurt'){ u.st = 'idle'; u.stT = 0; }   // 경직 없음
  if (L.t >= KH.last){   // 실이 끊김
    u.ls = null; u.lsEnd = true; u.kc = null; interrupt(u);
    popText(u.x, u.y + 3.2, u.z, '…(안경 빛이 사라진다)', 'whisper', 2); G.hitstop = Math.max(G.hitstop, 0.25);
    if (typeof clashLog === 'function') clashLog('실이 끊긴 것처럼, 카리우스가 선 채로 고개를 떨군다.');
    kill(u, null); return true;
  }
  return false;
}
// 쓰러졌다 일어나면 (부활 · 다음 날) 근성도 다시 쓸 수 있음
setInterval(() => { if (!G.units) return; for (const u of G.units) if (u.D === DEFS.kariusAlly && u.lsEnd && !u.downed && !u.dead){ u.lsEnd = false; u.ls = null; } }, 500);
// 굴 싸움이 끝났는데 근성 중이었으면: 원본처럼 이겨도 쓰러짐 (굴 주민으로 돌아갈 때 체력 5%)
if (typeof endLobbyFight === 'function'){
  const _endLobbyK = endLobbyFight;
  endLobbyFight = function(win){
    const ka = PRO.cave && PRO.cave.ka;
    if (ka && (ka.ls || ka.lsEnd)){ if (ka.ls) popText(ka.x, ka.y + 3.2, ka.z, '…(안경 빛이 사라진다)', 'whisper', 2); ka.ls = null; ka.lsEnd = false; ka.downed = true; }
    _endLobbyK(win);
  };
}
