/* rotation.js v1.0 — (v0.89) 카리우스 피로 · 동료 로테이션 (민수 · 검토 3.7)
   ■ 카리우스는 원정에서 돌아오면 '개조 신체 점검' — 다음 날은 쉼 (원정 준비 창에서 못 고름)
   ■ 피로: 카리우스가 원정을 다녀올 때마다 +1, 굴에서 원정 없이 보낸 날마다 −1 (0 ~ 4). 피로 하나마다 최대 체력 −8%
   ■ 원정 준비 창: 이름 밑에 피로 칸 · 쉬는 날 표시 → 다른 탱커 (레베카 · 굴 식구) 를 번갈아 씀 */
'use strict';
const ROT = { who: new Set(['karius']), max: 4 };
const rotBlock = k => { if (!ROT.who.has(k)) return false; const h = RPG.heroes[k]; return !!(h && h.restUntil != null && PRO.day <= h.restUntil); };
function rotTag(k){
  if (!ROT.who.has(k)) return '';
  const h = RPG.heroes[k] || {}, f = h.fat || 0, pip = Array.from({ length: ROT.max }, (_, i) => `<i style="display:inline-block;width:9px;height:5px;margin-right:2px;border-radius:2px;background:${i < f ? '#e8c27a' : 'rgba(255,255,255,.14)'}"></i>`).join('');
  return `<small style="display:block;color:#a99c8a">피로 ${pip}${f ? ` 체력 −${f * 8}%` : ''}${rotBlock(k) ? ' · <span style="color:#f0b060">오늘은 점검 (쉼)</span>' : ''}</small>`;
}
{ const _dRot = derive; derive = function(h){ const S = _dRot.apply(this, arguments); if (h && ROT.who.has(h.id) && h.fat) S.maxHp = Math.round(S.maxHp * (1 - 0.08 * h.fat)); return S; }; }
// 원정에서 돌아오면 (생환 · 전멸 모두): 피로 +1 · 다음 날은 쉼
{ const _e2cRot = expToCave; expToCave = function(sum){
    for (const k of RPG.party || []) if (ROT.who.has(k) && RPG.heroes[k]){ const h = RPG.heroes[k]; h.fat = Math.min(ROT.max, (h.fat || 0) + 1); h.lastTrip = PRO.day; h.restUntil = PRO.day + 1; }
    return _e2cRot.apply(this, arguments);
  }; }
// 새 아침: 어제 원정을 안 갔으면 피로 −1
{ const _edRot = endDay; endDay = async function(){ const r = await _edRot.apply(this, arguments);
    for (const k of ROT.who){ const h = RPG.heroes[k]; if (h && h.fat && (h.lastTrip == null || h.lastTrip < PRO.day - 1)) h.fat = Math.max(0, h.fat - 1); }
    typeof saveRpg === 'function' && saveRpg(); return r; }; }
