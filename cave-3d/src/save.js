/* save.js v1.4 — (v1.4, v0.90: 방 저장의 인카운터는 고른 것만 끝난 걸로) (v1.3, v0.89: 방마다 저장 — 싸움이 있던 방을 비우고 조용해지면 그 자리에서 저장. 다시 열면 같은 층을 같은 시드로 만들고, 깬 방의 적 · 열린 상자 · 바닥 물건 · 본 지도 · 들어간 인카운터를 되돌린 뒤 저장한 자리부터) (v1.2: 적뢰 오는 날 · 쥐 기사 순찰 날도 저장) (v1.1: 진행 중 저장 — 원정 층마다 체크포인트 · 다시 열면 그 층 처음부터 이어함. 게임이 업데이트되면 (VERSION이 바뀌면) 저장을 모두 지우고 새로 시작) (v1.01: 레베카 꺼낸 날도 저장) 굴의 하루 저장 (RPG는 rpg.js가 따로 저장)
   · 새 아침 (잠에서 깸) · 원정에서 돌아옴 · 적뢰를 쓰러뜨림 · 굴에서 1분마다 저장
   · 주소에 아무것도 없이 열면: 저장이 있으면 굴에서 이어함 (프롤로그 건너뜀). I 창의 "처음부터"로 지움 */
'use strict';
const PRO_SAVE = 'cave3d.pro.v1';
const PRO_KEYS = ['day', 'store', 'trash', 'buried', 'wood', 'penFood', 'snailLost', 'snailHd', 'meal', 'hpf', 'fireLit', 'ap', 'dig', 'jrDone', 'rebOut', 'rebDig', 'rebOutDay', 'autoCook', 'cookDay', 'placed',
  'pigData', 'eggs', 'babies', 'weather', 'hasToilet', 'tentGone', 'necklace', 'dropDay', 'cursed', 'didBury', 'mine', 'jrDay', 'jrSeen', 'ratLast'];
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
function newGame(){ try { localStorage.removeItem(PRO_SAVE); localStorage.removeItem(SAVE_KEY); localStorage.removeItem(EXP_SAVE); } catch (e) {} location.hash = ''; location.reload(); }
// 새 아침에 저장
const _endDaySave = endDay;
endDay = async function(...a){ const r = await _endDaySave.apply(this, a); proSave(); return r; };
setInterval(() => { if (G.mode === 'cave' && !G.lock && !G.paused && PRO.cave) proSave(); }, 60000);

/* ---------- v1.1 원정 체크포인트: 층에 들어갈 때마다 (원정 상태 + 굴 + RPG). 다시 열면 그 층 처음부터 ---------- */
const EXP_SAVE = 'cave3d.exp.v1';
const EXP_KEYS = ['F', 'startF', 'seed', 'torches', 'torchT', 'food', 'hungry', 'kills', 'gold0', 'xp0', 'got', 'deepest', 'day', 'tehera', 'blessing'];
function expCheckpoint(){
  if (!EXP || EXP.test || EXP.ending) return;
  const o = { v: 1, ver: VERSION, t: Date.now() }; for (const k of EXP_KEYS) o[k] = plainOf(EXP[k]);
  try { localStorage.setItem(EXP_SAVE, JSON.stringify(o)); } catch (e) {}
  proSave();
}
function expHasCheckpoint(){ try { const o = JSON.parse(localStorage.getItem(EXP_SAVE) || 'null'); return o && o.v === 1 ? o : null; } catch (e) { return null; } }
function expClearCheckpoint(){ try { localStorage.removeItem(EXP_SAVE); } catch (e) {} }
async function expResume(o){
  lootPools();
  EXP = { kills: 0, gold0: RPG.gold, xp0: [], got: [], deepest: o.F, t0: G.t, day: PRO.day, torches: 2, torchT: EXP_TORCH, food: 0, hungry: false };
  for (const k of EXP_KEYS) if (o[k] !== undefined) EXP[k] = o[k];
  EXP.t0 = G.t; EXP.test = false;
  await expLoadFloor(EXP.F, 'start');
  caption(`${EXP.F}층 — 이어함`, '이 층 처음부터 (주웠던 것 · 쓰러뜨린 적은 다시)');
}
{ const _elf = expLoadFloor; expLoadFloor = async function(F, how){ const r = await _elf.apply(this, arguments); setTimeout(expCheckpoint, 500); return r; }; }
{ const _e2cS = expToCave; expToCave = function(sum){ expClearCheckpoint(); return _e2cS.apply(this, arguments); }; }

/* ---------- v1.3 (v0.89) 방마다 저장 (민수 · 검토 3.11) ----------
   · 싸움이 있던 방 (무리 'r' + 방 번호) 이 모두 쓰러지고, 경계 중인 적이 14칸 안에 없이 2초 조용하면 저장 ('저장됨')
   · 다시 열면: 같은 시드 · 같은 인카운터 목록으로 층을 다시 만들고 → 깬 방의 적을 치우고 · 열린 상자 · 바닥 물건 · 본 지도 · 들어간 인카운터를 되돌림 → 저장한 자리부터
   · 층을 내려가면 그 층 처음 저장부터 다시 셈 */
EXP_KEYS.push('cleared', 'room', 'encSeen0', 'route', 'captives', 'doorsOpen');
const RSAVE = { band: new Set(), quiet: 0, n: 0, chests: [] };
// 본 지도 (Uint8Array) ↔ 저장용 줄 (0 · 1 이 이어지는 길이)
function seenPack(a){ if (!a) return null; const out = [a[0] ? 1 : 0]; let cur = a[0] ? 1 : 0, n = 0; for (let i = 0; i < a.length; i++){ const v = a[i] ? 1 : 0; if (v === cur) n++; else { out.push(n); cur = v; n = 1; } } out.push(n); return out; }
function seenUnpack(p, a){ if (!p || !a) return; let v = p[0], i = 0; for (let k = 1; k < p.length; k++){ for (let n = 0; n < p[k] && i < a.length; n++) a[i++] = v; v = v ? 0 : 1; } }
{ const _mcR = makeChest; makeChest = function(){ const c = _mcR.apply(this, arguments); RSAVE.chests.push(c); return c; }; }
{ const _elfR = expLoadFloor; expLoadFloor = async function(F, how){
    if (EXP){ if (how !== 'resume'){ EXP.cleared = []; EXP.room = null; EXP.doorsOpen = []; } EXP.encSeen0 = [...(EXP.encSeen || [])]; }
    RSAVE.chests = [];
    const r = await _elfR.apply(this, arguments);
    RSAVE.band = new Set(foes().map(e => String(e.band || '')).filter(b => /^r\d+$/.test(b)));
    RSAVE.n = EXP ? (EXP.cleared || []).length : 0; RSAVE.quiet = 0;
    return r;
  }; }
function roomCheckpoint(){
  const pl = G.player; if (!pl || !EXP) return;
  syncPartyOut();
  EXP.room = { F: EXP.F, x: +pl.x.toFixed(2), z: +pl.z.toFixed(2),
    items: DUN.items.map(o => o.gold ? { x: +o.x.toFixed(2), z: +o.z.toFixed(2), gold: o.gold } : { x: +o.x.toFixed(2), z: +o.z.toFixed(2), it: plainOf(o.it) }),
    chests: RSAVE.chests.filter(c => c.opened).map(c => [c.x, c.z]), seen: seenPack(DUN.seen),
    encIn: (EXP.encs || []).filter(E => E.done).map(E => E.r.id) };   // v1.4 고른 것만 (살펴보기 전이면 이어할 때 다시 살펴볼 수 있게)
  expCheckpoint();
  popText(pl.x, pl.y + 2.4, pl.z, '저장됨', 'heal', 0.9);
}
TICKS.push(dt => {
  if (G.mode !== 'exp' || !EXP || EXP.ending || EXP.test || G.paused) return;
  const pl = G.player; if (!pl || pl.downed || pl.dead){ RSAVE.quiet = 0; return; }
  const live = foes();
  for (const b of [...RSAVE.band]) if (!live.some(e => e.band === b)){ RSAVE.band.delete(b); const id = +b.slice(1); EXP.cleared = EXP.cleared || []; if (!EXP.cleared.includes(id)) EXP.cleared.push(id); }
  if ((EXP.cleared || []).length === RSAVE.n) return;
  const busy = G.lock || live.some(e => e.alert && !e.downed && dist(e, pl) < 14) || (typeof CARRY !== 'undefined' && CARRY.c);
  RSAVE.quiet = busy ? 0 : RSAVE.quiet + dt;
  if (RSAVE.quiet < 2) return;
  RSAVE.quiet = 0; RSAVE.n = EXP.cleared.length;
  roomCheckpoint();
});
function roomRestore(R){
  const cl = new Set(EXP.cleared || []);
  for (const e of foes()) if (/^r\d+$/.test(String(e.band || '')) && cl.has(+String(e.band).slice(1))) removeUnit(e);
  for (const r of DUN.rooms || []) if (cl.has(r.id)) r.reward = false;
  RSAVE.band = new Set([...RSAVE.band].filter(b => !cl.has(+b.slice(1))));
  for (const o of DUN.items) G.scene.remove(o.g);
  DUN.items = [];
  for (const o of R.items || []) dropLootAt(o.x, o.z, o.gold ? { gold: o.gold } : o.it, { spread: 0 });
  for (const [x, z] of R.chests || []){ const c = RSAVE.chests.find(c => !c.opened && Math.hypot(c.x - x, c.z - z) < 0.7); if (c){ c.opened = true; c.locked = false; if (c.b && c.b.m) c.b.m.material.color.setScalar(0.55); } }
  if (R.seen && DUN.seen) seenUnpack(R.seen, DUN.seen);
  for (const E of EXP.encs || []) if ((R.encIn || []).includes(E.r.id)){ E.entered = true; E.done = true; }
  const pl = G.player, mates = G.units.filter(u => u.side === 'ally' && u !== pl);
  if (pl){ pl.x = R.x; pl.z = R.z; }
  mates.forEach((u, i) => { const a = i * 2.1, x = R.x + Math.cos(a) * 1.1, z = R.z + Math.sin(a) * 1.1, ok = !solidAt(G.map, x, z); u.x = ok ? x : R.x; u.z = ok ? z : R.z; });
  camSnapTo(R.x, R.z);
}
expResume = async function(o){
  lootPools();
  EXP = { kills: 0, gold0: RPG.gold, xp0: [], got: [], deepest: o.F, t0: G.t, day: PRO.day, torches: 2, torchT: EXP_TORCH, food: 0, hungry: false };
  for (const k of EXP_KEYS) if (o[k] !== undefined) EXP[k] = o[k];
  EXP.t0 = G.t; EXP.test = false; EXP.encSeen = new Set(o.encSeen0 || []);
  const R = o.room && o.room.F === o.F ? o.room : null;
  await expLoadFloor(EXP.F, R ? 'resume' : 'start');
  if (R){ roomRestore(R); caption(`${EXP.F}층 — 이어함`, `깬 방 ${(EXP.cleared || []).length}개는 그대로 · 저장한 자리부터`); }
  else caption(`${EXP.F}층 — 이어함`, '이 층 처음부터 (주웠던 것 · 쓰러뜨린 적은 다시)');
};
