/* gore.js v1.2 — (v1.2, v0.87: 박힌 창 · 도끼는 다가가면 바로 뽑아 쥠 (민수) — 산 적이든 시체든. 전엔 적이 죽거나 8초 · 시체는 4.5초 뒤 땅에 떨어져야 주웠음) (v1.1: 누운 그림 (flat) 으로 바뀐 시체는 박힌 것을 몸 가운데에 — 전엔 머리 자리를 어림해 몸 밖으로 나갔음) (v1.0, v0.86) 즉사 연출 · 박힘 (민수: 헤드샷 · 목 절단은 진짜 즉사 — 머리에 화살 · 창이 박히고 파르르 떨며 쓰러짐)
   ■ 헤드샷: 아군이 던지거나 쏜 것 (투창 · 도끼 · 화살 · 총알) 이 머리에 들어감
     · 완벽 투창 · 완벽 화살 · 조준 사격 ('조준!') 은 40%, 그 밖은 6% (집중 사격 + 10% · 앉아쏴 + 8%)
     · 날아가는 것만 (화살 · 볼트 · 총알 · 던진 무기 · 동료의 총 · 활 · 투창 (펄)) — 폭발 · 광선 · 마력탄 · 검기는 아님
     · 보스 · 거구 (D.heavy) 는 즉사 대신 피해 ×1.6. 그 밖은 즉사 — 큰 숫자 (500 넘게) · '헤드샷' · 머리에 박힘 (화살 · 창 · 도끼) · 파르르 떨다 멎음
   ■ 목 절단: 아군 근접이 상단 (▲) 으로 들어가면 2.5% (미리 정해진 치명이면 10%, 도끼 · 대검 · 낫은 두 배) — '목이 떨어졌다' 즉사 (보스 · 거구 빼고).
     동료의 목 절단은 wounds.js beheaded (레베카는 빼고) — 쓰러질 때 똑같이 파르르
   ■ 던진 창 · 도끼가 산 적에 박히면: 다가가면 바로 뽑아 쥠 (v1.2). 안 뽑으면 그 적이 죽거나 8초 지나 땅에 떨어짐 (weapons.js throwWeapon 의 결과 'stick')
   ■ 시체는 조금 더 오래 남음 (6초) — 박힌 것이 보이게 */
'use strict';
const GORE = { stuck: null, head: { pre: 0.4, base: 0.06, focus: 0.1, kneel: 0.08 }, neck: { base: 0.025, pre: 0.1, heavy: 2 } };
const HEAVY_W = new Set(['axe', 'greatsword', 'scythe', 'hammer']);
// 박힌 것 그림: 화살 · 던진 무기 (무기 그림 그대로)
function goreMesh(kind){
  if (kind === 'arrow' && typeof arrowMesh === 'function') return arrowMesh();
  if (kind === 'jav' && typeof arrowMesh === 'function'){ const m = arrowMesh(); m.scale.setScalar(2.3); return m; }   // 동료의 투창: 큰 화살 그림
  if ((kind === 'spear' || kind === 'axe') && typeof makeHeldMesh === 'function' && typeof W !== 'undefined' && W.def && W.def.d){
    const fm = makeHeldMesh(W.def.d); if (!fm) return null;
    const holder = new THREE.Group(), g = new THREE.Group(); holder.add(fm); fm.position.x = -(0.5 - fm.userData.grip) * fm.userData.L * 0.6; holder.rotation.x = Math.PI / 2; g.add(holder); return g;
  }
  return null;
}
// 몸에 박음: 몸과 함께 움직임 (세계 방향 그대로 — 화살 박힘과 같은 방식). head 면 머리 높이
function goreStick(t, kind, a, head){
  const m = goreMesh(kind); if (!m || !t.group) return null;
  const hy = bodyH(t) * (head ? 0.86 : 0.55);
  m.position.set(-Math.cos(a) * 0.22, hy, -Math.sin(a) * 0.22); m.rotation.y = -a; m.rotation.z = rnd(-0.18, 0.18);
  t.group.add(m); (t.goreMeshes = t.goreMeshes || []).push({ m, head, hy, a });
  return m;
}
// 즉사: 큰 숫자 · 피 · 파르르 · 시체 오래 남음
const _hurtGore = hurt;
function goreKill(att, tgt, base, o, kind){
  const big = Math.max(500, Math.round(tgt.hp * 2 + 300));
  const r = _hurtGore(att, tgt, big, { ...o, crit: true, critMul: 1, unblockable: true, pierce: true });
  if (!tgt.dead) return r;
  const hy = tgt.y + bodyH(tgt) * 0.86;
  popText(tgt.x, hy + 0.9, tgt.z, kind === 'neck' ? '목이 떨어졌다' : '헤드샷 — 즉사', 'crit', 1.6);
  spark(tgt.x, hy, tgt.z, 0x8a0a14, 34, 7); if (typeof bloodBurst === 'function') bloodBurst(tgt.x, tgt.z, bodyH(tgt));
  camShake(0.32, 0.25); G.hitstop = Math.max(G.hitstop, 0.14); SFX.thump && SFX.thump(80, 0.5, 0.2);
  tgt.twitch = { t0: G.t, dur: 1.5 }; tgt.goreHold = G.t + 6;
  const sk = o.thrown || (o.arrow || o.fam === 'bow' ? 'arrow' : o.fam === 'spear' ? 'jav' : null);   // 동료 (펄 · 궁수) 의 투창 · 화살도 박힘
  if (sk) goreStick(tgt, sk, o.ang ?? Math.atan2(tgt.z - att.z, tgt.x - att.x), true);
  if (typeof clashLog === 'function') clashLog(`${tgt.D.name} — ${kind === 'neck' ? '목이 떨어졌다' : '머리를 꿰뚫었다'}. 즉사.`);
  return r;
}
hurt = function(att, tgt, base, o = {}){
  if (!tgt || tgt.dead || tgt.downed || !att || att.side !== 'ally' || tgt.side !== 'enemy' || tgt.D.dummy || o.dot || o.combo || !PLAY_MODES.has(G.mode)) return _hurtGore(att, tgt, base, o);
  const tough = tgt.D.boss || tgt.D.heavy;
  if (o.ranged){
    if (!(o.arrow || o.bullet || o.thrown || o.fam === 'gun' || o.fam === 'bow' || o.fam === 'spear')) return _hurtGore(att, tgt, base, o);   // 날아가는 것만
    const focus = att === G.player && typeof P !== 'undefined' && P.focus;
    const p = o.crit ? GORE.head.pre : GORE.head.base + (focus ? GORE.head.focus : 0) + (att.kneelShot ? GORE.head.kneel : 0);
    if (Math.random() < p){
      if (tough){ popText(tgt.x, tgt.y + bodyH(tgt) + 0.7, tgt.z, '헤드샷!', 'crit', 1.1); return _hurtGore(att, tgt, base * 1.6, { ...o, crit: true }); }
      return goreKill(att, tgt, base, o, 'head');
    }
    return _hurtGore(att, tgt, base, o);
  }
  const zone = o.zone || (att.pose && typeof PZONE !== 'undefined' ? PZONE[att.pose] : null);
  if (zone === 'high' && !tough){
    const heavy = att === G.player && typeof W !== 'undefined' && W.def && HEAVY_W.has(W.def.kind);
    if (Math.random() < (o.crit ? GORE.neck.pre : GORE.neck.base) * (heavy ? GORE.neck.heavy : 1)) return goreKill(att, tgt, base, o, 'neck');
  }
  return _hurtGore(att, tgt, base, o);
};
// 파르르: 죽은 (쓰러진) 몸이 1.5초 동안 떨다 멎음 · 머리에 박힌 것은 쓰러진 머리 자리로
const _updateSpriteGore = updateSprite;
updateSprite = function(u, dt){
  const r = _updateSpriteGore(u, dt);
  const T = u.twitch;
  if (T){
    const k = 1 - (G.t - T.t0) / T.dur;
    if (k <= 0) u.twitch = null;
    else { const j = (Math.sin(G.t * 64) * 0.05 + rnd(-0.03, 0.03)) * k; if (u.pivot) u.pivot.rotation.z += j; if (u.group){ u.group.position.x += rnd(-0.02, 0.02) * k; u.group.position.z += rnd(-0.02, 0.02) * k; } }
  }
  if (u.goreMeshes && (u.dead || u.downed || u.lying)){
    const full = Math.PI / 2 * 0.92, flat = !!(u.pose && u.S.poses[u.pose] && u.S.poses[u.pose].flat), fall = flat ? 1 : Math.min(1, Math.abs(u.tilt || 0) / full);
    const rx = Math.cos(CAM.yaw || 0), rz = -Math.sin(CAM.yaw || 0), s = (u.tilt || 0) < 0 ? 1 : (u.tilt || 0) > 0 ? -1 : (u.fS || u.face || 1);
    for (const G2 of u.goreMeshes){ if (!G2.head) continue; const hl = flat ? 0 : bodyH(u) * 0.8, lx = rx * s * hl, lz = rz * s * hl;   // v1.1 누운 그림 (flat) 은 몸 가운데에 박힌 채
      G2.m.position.set(lerp(-Math.cos(G2.a) * 0.22, lx, fall), lerp(G2.hy, 0.22, fall), lerp(-Math.sin(G2.a) * 0.22, lz, fall)); }
  }
  return r;
};
// 시체: 박힌 게 보이게 조금 더 남음
const _fadeOutGore = fadeOut;
fadeOut = function(u){ if (u && u.goreHold && G.t < u.goreHold) return setTimeout(() => fadeOut(u), (u.goreHold - G.t) * 1000); return _fadeOutGore(u); };
// 산 적에 박힌 던진 무기: 다가가면 바로 뽑음 (goreGrab) · 아니면 그 적이 죽거나 8초 지나면 떨어짐
function goreStickWeapon(t, kind, a, sec){
  const m = goreStick(t, kind, a, false); GORE.stuck = { t, m, a, until: G.t + (sec || 8) };
  if (!t.dead) popText(t.x, t.y + bodyH(t) + 0.4, t.z, kind === 'axe' ? '도끼가 박혔다' : '창이 박혔다', 'big', 0.9);
}
const eulOf = s => { const c = s.charCodeAt(s.length - 1) - 0xac00; return c >= 0 && c <= 11171 && c % 28 ? '을' : '를'; };
// v1.2 박힌 것에 다가가면 바로 뽑아 쥠 (산 적 · 시체 모두)
function goreGrab(pl){
  const S = GORE.stuck; if (!S || !pl || pl.downed || pl.dead || pl.lock) return false;
  const t = S.t; if (!t || !G.units.includes(t)) return false;
  if (Math.hypot(t.x - pl.x, t.z - pl.z) > (pl.r || 0.32) + (t.r || 0.4) + 0.6) return false;
  GORE.stuck = null;
  if (S.m && S.m.parent) S.m.parent.remove(S.m);
  if (t.goreMeshes) t.goreMeshes = t.goreMeshes.filter(o => o.m !== S.m);
  P.spear = true; const n = W.def.d ? W.def.d.n : '창';
  popText(pl.x, pl.y + 2, pl.z, `${n}${eulOf(n)} 뽑았다`, 'heal', 0.8); SFX.burst && SFX.burst({ type: 'bandpass', f: 900, f2: 300, q: 2, gain: 0.25, dec: 0.12 });
  return true;
}
TICKS.push(() => {
  const S = GORE.stuck; if (!S) return;
  if (typeof P !== 'undefined' && !P.spear && goreGrab(G.player)) return;
  const t = S.t, gone = !t || !G.units.includes(t);
  if (!gone && !t.dead && G.t < S.until) return;
  if (gone && G.mode !== 'exp' && G.mode !== 'drill' && G.mode !== 'colo' && G.mode !== 'cave') { GORE.stuck = null; return; }
  if (!gone && t.dead && G.t < S.until && S.corpse) return;   // 머리에 박힌 채 쓰러진 시체: 조금 뒤에
  GORE.stuck = null;
  if (S.m && S.m.parent) S.m.parent.remove(S.m);
  if (t && t.goreMeshes) t.goreMeshes = t.goreMeshes.filter(o => o.m !== S.m);
  const x = t ? t.x + rnd(-0.5, 0.5) : G.player.x, z = t ? t.z + rnd(0.2, 0.7) : G.player.z;
  if (typeof dropWeapon === 'function' && typeof P !== 'undefined' && !P.spear) dropWeapon(x, z, S.a);
});
