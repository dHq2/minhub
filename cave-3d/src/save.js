/* save.js v1.0 — 굴의 하루 저장 (RPG는 rpg.js가 따로 저장)
   · 새 아침 (잠에서 깸) · 원정에서 돌아옴 · 적뢰를 쓰러뜨림 · 굴에서 1분마다 저장
   · 주소에 아무것도 없이 열면: 저장이 있으면 굴에서 이어함 (프롤로그 건너뜀). I 창의 "처음부터"로 지움 */
'use strict';
const PRO_SAVE = 'cave3d.pro.v1';
const PRO_KEYS = ['day', 'store', 'trash', 'buried', 'wood', 'penFood', 'snailLost', 'snailHd', 'meal', 'hpf', 'fireLit', 'ap', 'dig', 'jrDone', 'rebOut', 'rebDig', 'placed',
  'pigData', 'eggs', 'babies', 'weather', 'hasToilet', 'tentGone', 'necklace', 'dropDay', 'cursed', 'didBury', 'mine'];
const SKIP_K = new Set(['b', 'u', 'g', 'm', 'mesh', 'unit', 'bill', 'ring', 'insp', 'carrier', 'claimed']);
function plainOf(v, depth = 0){
  if (v == null || typeof v !== 'object') return v;
  if (depth > 6) return undefined;
  if (Array.isArray(v)) return v.map(x => plainOf(x, depth + 1)).filter(x => x !== undefined);
  if (Object.getPrototypeOf(v) !== Object.prototype) return undefined;   // THREE · DOM 같은 것은 버림
  const o = {}; for (const [k, x] of Object.entries(v)){ if (SKIP_K.has(k)) continue; const y = plainOf(x, depth + 1); if (y !== undefined) o[k] = y; }
  return o;
}
function proSave(){
  if (!PRO.jrDone && PRO.day <= 1 && G.mode !== 'cave') return;   // 프롤로그 중에는 저장 안 함
  const o = { v: 1, t: Date.now() }; for (const k of PRO_KEYS) o[k] = plainOf(PRO[k]);
  try { localStorage.setItem(PRO_SAVE, JSON.stringify(o)); } catch (e) {}
  if (typeof saveRpg === 'function') saveRpg();
}
function proHasSave(){ try { return !!localStorage.getItem(PRO_SAVE); } catch (e) { return false; } }
function proLoad(){
  try { const o = JSON.parse(localStorage.getItem(PRO_SAVE) || 'null'); if (!o || o.v !== 1) return false; for (const k of PRO_KEYS) if (o[k] !== undefined) PRO[k] = o[k]; return true; } catch (e) { return false; }
}
function newGame(){ try { localStorage.removeItem(PRO_SAVE); localStorage.removeItem(SAVE_KEY); } catch (e) {} location.hash = ''; location.reload(); }
// 새 아침에 저장
const _endDaySave = endDay;
endDay = async function(...a){ const r = await _endDaySave.apply(this, a); proSave(); return r; };
setInterval(() => { if (G.mode === 'cave' && !G.lock && !G.paused && PRO.cave) proSave(); }, 60000);
