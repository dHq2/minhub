/* mortal.js v1.0 — (v0.93) 사망률 (민수: 인원 제한 대신 영입의 희소성과 사망률의 증가)
   봇 두 판 (원정 28번) 에서 죽은 동료 0명 → 동료는 정말로 죽는다. 인주 · 레베카 (불사) · 손님은 빼고 (인주의 죽음은 캠페인 설계와 함께)
   ■ 쓰러질 때: 그냥 쓰러져도 10% 는 반시체 (쓰러지며 크게 다침). 반시체가 되는 큰 한 방 (최대 체력의 절반 넘게 넘침) 은 30% 즉사
   ■ 반시체로 굴에 돌아오면 수술 — 살 확률: 레베카 70% · 청광묵 60% · 카리우스 50% · 의사가 없으면 40%. 못 살면 그 밤에 숨이 멎음
   ■ 잃은 동료는 기록 (RPG.meta.fallen: 이름 · 날 · 까닭) — 원정 준비 창 아래에. 같은 세계선에선 다시 오지 않음 (기원 후보에서도 빠짐)
   숫자는 MORT 한 곳에서 */
'use strict';
const MORT = { instant: 0.3, downHalf: 0.1, surg: { reb: 0.7, ch: 0.6, ka: 0.5, none: 0.4 }, docN: { reb: '레베카', ch: '청광묵', ka: '카리우스', none: '의사 없음' } };
const mortable = u => !!(u && u.hero && u.side === 'ally' && u !== G.player && u.hero.id !== 'inju' && !(u.D && u.D.undying) && !u.guest);
function mortRecord(h, why){ RPG.meta.fallen = RPG.meta.fallen || []; if (!RPG.meta.fallen.some(f => f.id === h.id)) RPG.meta.fallen.push({ id: h.id, name: h.name, day: PRO.day, why }); }
const mortDoc = () => { const C = PRO.cave || {}, here = u => u && !u.gone && !u.dead; return PRO.rebOut && here(C.reb) ? 'reb' : here(C.ch) ? 'ch' : here(C.ka) ? 'ka' : 'none'; };
// 굴에 있는 그 사람의 몸을 치움 (다른 세계선 동료 · 굴 식구)
function mortHideCave(id){
  const C = PRO.cave || {}, key = typeof WL !== 'undefined' && WL.key[id];
  const u = key ? C[key] : G.units.find(o => o.capSlug && 'x_' + o.capSlug === id);
  if (!u) return;
  u.gone = true; u.away = true; u.lock = true; u.moving = false; if (u.group) u.group.visible = false; if (u.bar) u.bar.remove(); if (u.tag) u.tag.remove();
  G.inspect = G.inspect.filter(o => o.unit !== u);
}
// 원정 중 즉사
function mortDie(u, why){
  const h = u.hero; h.st = 'dead'; h.halfDead = false; RPG.party = RPG.party.filter(k => k !== h.id);
  u.dead = true; u.downed = false; u.halfDead = false; u.st = 'dead'; u.fading = G.t; u.bar && u.bar.remove(); u.tag && u.tag.remove();
  spark(u.x, u.y + 0.6, u.z, 0x8a0a14, 34, 7); camShake(0.4, 0.35); popText(u.x, u.y + bodyH(u) + 0.8, u.z, '즉사', 'crit', 2.2);
  caption(`${h.name}를 잃었다`, `${why}. 다시는 돌아오지 않는다`);
  if (typeof clashLog === 'function') clashLog(`${h.name}가 죽었다.`);
  for (const b of allies()) if (b.hero) b.hero.san = Math.max(0, (b.hero.san ?? 50) - 20);
  mortRecord(h, why); if (typeof saveRpg === 'function') saveRpg();
}
// 반시체가 되는 큰 한 방 → 30% 즉사 · 반시체 알림에 수술로 살 확률
{ const _mhM = makeHalfDead; makeHalfDead = function(u, why){
    if (mortable(u) && G.mode === 'exp' && !u.halfDead && why === '크게 당했다' && Math.random() < MORT.instant) return mortDie(u, '한 방에 숨이 끊겼다');
    const was = u && u.halfDead, r = _mhM.apply(this, arguments);
    if (mortable(u) && !was && u.halfDead && typeof uiToast === 'function'){ const d = mortDoc(); uiToast(`<b style="color:#ff8a7a">${u.hero.name}</b> <small>굴에 데려가면 수술 — 살 확률 ${Math.round(MORT.surg[d] * 100)}% (${MORT.docN[d]})</small>`, 'warn'); }
    return r; }; }
// 그냥 쓰러져도 10% 는 반시체
{ const _kM = kill; kill = function(u, by){
    const was = u && (u.downed || u.dead); const r = _kM.apply(this, arguments);
    try { if (!was && mortable(u) && G.mode === 'exp' && u.downed && !u.halfDead && !u.dead && Math.random() < MORT.downHalf) makeHalfDead(u, '쓰러지며 크게 다쳤다'); } catch (e) {}
    return r; }; }
// 확인사살 · 목이 떨어짐으로 죽은 것도 기록
{ const _fbM = finishBlow; finishBlow = function(e, a){
    const h = a && a.hero, was = h && h.st; const r = _fbM.apply(this, arguments);
    if (h && was !== 'dead' && h.st === 'dead') mortRecord(h, `${e && e.D ? e.D.name : '적'}의 확인사살`); return r; }; }
if (typeof beheaded === 'function'){ const _bhM = beheaded; beheaded = function(u){
    const h = u && u.hero, was = h && h.st; const r = _bhM.apply(this, arguments);
    if (h && was !== 'dead' && h.st === 'dead') mortRecord(h, '목이 떨어졌다'); return r; }; }
// 수술: 의사에 따라 살 확률. 못 살면 그 밤에 숨이 멎음
{ const _sgM = surgery; surgery = async function(ids){
    const d = mortDoc(), p = MORT.surg[d], live = [], lost = [];
    for (const id of ids){ const h = hero(id); if (id === 'inju' || !h || Math.random() < p) live.push(id); else lost.push(id); }
    if (live.length) await _sgM.call(this, live);
    for (const id of lost) await mortSurgeryLost(id, d, p);
  }; }
const MORT_LOST = { reb: ['…안 돼요. 조금만, 조금만 더…', '(레베카가 오래도록 손을 놓지 못한다)'], ch: ['대장… 청광묵이 불로 지졌다…', '…근데… 안 깬다…'], ka: ['....늦었다.', '(카리우스가 천으로 얼굴을 덮는다)'], none: ['(인주 혼자서는 피를 멈출 수 없었다)'] };
async function mortSurgeryLost(id, d, p){
  G.lock = true;
  const h = hero(id); h.halfDead = false; h.st = 'dead'; RPG.party = RPG.party.filter(k => k !== id);
  try { await (typeof vnTalk === 'function' && d !== 'none' ? vnTalk(MORT.docN[d], MORT_LOST[d]) : textbox(d === 'none' ? '' : MORT.docN[d], MORT_LOST[d])); } catch (e) {}
  mortHideCave(id); mortRecord(h, `수술이 닿지 못했다 (${MORT.docN[d]} · 살 확률 ${Math.round(p * 100)}%)`);
  caption(`${h.name} — 숨이 멎었다`, '굴 한쪽에 묻었다. 다시는 돌아오지 않는다');
  for (const k of Object.keys(RPG.heroes)){ const o = RPG.heroes[k]; if (o && o.st !== 'dead') o.san = Math.max(0, (o.san ?? 50) - 10); }
  await wait(2.6); G.lock = false; if (typeof saveRpg === 'function') saveRpg();
}
// 원정 준비 창 아래: 잃은 동료
const mortFallenHtml = () => { const F = RPG.meta.fallen || []; return F.length ? `<div class="pp-row"><span>잃은 동료</span><b>${F.length}명</b><em>${F.slice(-6).map(f => `${f.name} (${f.day}일)`).join(' · ')}${F.length > 6 ? ' …' : ''}</em></div>` : ''; };
