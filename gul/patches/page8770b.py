# v8.7.7 페이지 둘째 쪽 — page8770b.py v1.2 (v1.2: 삼신 심판 둘째 판부터 모래시계를 쥐었으면 그때 붙잡음 (없으면 그냥 전멸이던 것) · v1.1: 모래시계로 삼신 심판 둘째 · 셋째 판에서 되돌아가면 그 칸을 다시 (예전 판을 이겨 '지난 칸' 에 들어가 있어 건너뛰던 것) · 설계에 얹은 유물 몫 (가호 · 은신 · 약) 을 걷은 뒤 다시 저장 (싸우다 새로 고침해도 남지 않게) · v1.0: 유물 34 (F · J9) — 새 유물 16 · 지닌 이 (끼운 인물만 — 유물 칸에서 고름) · 뽑기 풀 24 (가뮤의 대검 · 비늘조각 · 간호사장의 모자 · 루미의 바이올린 · 오딜의 눈물은 얻는 길만) ·
#   효과가 걸리지 않던 것 고침 (오딜의 눈물 · 로켈의 갑옷 받는 피해 · 왕관 조각 · 여신의 눈물 횃불 · 비늘조각 불 · 냉기) · 왐의 머리촛대는 지닌 이만 · 일어나면 중상이 나음 · 힘으로 주는 유물 (r8GiveRelic force) 이 풀이 비면 안 주던 것 ·
#   삼신의 심판: 판마다 그 신의 유물 (라비스 · 로켈 · 모란) · 눈물은 마지막 판에만 (예전엔 판마다 하나 — 셋) · 붉은암석의 핵 · 페흐토의 청염 조각 · 망각의 데이터 조각 · 3층을 자주 오가면 사르딜 락의 비늘조각)
# page8770.py 가 exec 로 부름 (s · rep 를 함께 씀)

def cut(a, b, new, inc_b=True):
    """a 로 시작해 b 까지 (b 포함) 를 new 로 갈아 끼움 — a · b 는 하나씩만"""
    global s
    assert s.count(a) == 1, ('cut a', s.count(a), a[:80])
    i = s.index(a); j = s.index(b, i)
    assert j > i, ('cut b', b[:80])
    j = j + len(b) if inc_b else j
    s = s[:i] + new + s[j:]

# ---------- 유물 34 ----------
RELIC_JS = r'''// 유물 — 효과는 싸움을 만들 때 (r8Pre: 설계에 얹었다가 판을 만든 뒤 걷음 · r8Post: 판의 몸에) 또는 정해진 때 · v8.7.7 34종 · hold = 지닌 이 (끼운 인물만 — 유물 칸에서 고름)
const RELIC8 = {
  tear: { name: '여신의 눈물', ic: '💧', d: '횃불이 더 밝음 (+10% · 모을수록) · 아군 최대 체력 +6% (모을수록)', st: true, how: '여신의 호수 · 테이론 · 삼신의 심판' },
  odtear: { name: '오딜의 눈물', ic: '🌹', hold: true, d: '과거의 오딜이 남긴 선물 — 지닌 이에게 [가호:오딜] (받는 피해 −10%)', how: '신성 오딜의 차 (신성을 지닌 동료가 있을 때)' },
  scale: { name: '사르딜 락의 비늘조각', ic: '🐉', hold: true, d: '지닌 이 최대 체력 +20% · 화상 · 동상을 반으로', how: '3층 (여신의 호수) 을 자주 오가면 · 호수 유적의 사르딜 락' },
  nurse: { name: '간호사장의 모자', ic: '⛑', hold: true, d: '간호사 전용 — 지닌 간호사의 약 +3 · 치유량 +30%', how: '야전병원 간호사장과 인연 3 (간호사가 동료일 때)' },
  violin: { name: '루미의 바이올린', ic: '🎻', d: '싸움이 끝날 때마다 모두 최대 체력의 10% 회복', how: '야전병원 간호사장과 인연 5 (최대)' },
  candle: { name: '왐의 머리촛대', ic: '🕯', hold: true, d: '지닌 이가 쓰러지면 체력 10% 로 일어남 · 중상도 나음 — 다섯 번' },
  gamyu: { name: '가뮤의 대검', ic: '🗡', hold: true, d: '중대형 · 대형 · 초대형만 — 지닌 이의 공격 +30%', how: '거대 해양괴수 가뮤를 이기면' },
  duck: { name: '러버덕의 리볼버', ic: '🦆', d: '사수들의 공격 +20%' },
  rabis: { name: '라비스의 투구', ic: '🪶', d: '아군 모두 최대 체력 +10% (삼신 — 질서)', how: '삼신의 심판 — 라비스의 판을 넘기면' },
  moran: { name: '모란의 가면', ic: '🎭', hold: true, d: '지닌 이의 회피 +15% (삼신 — 칼끝)', how: '갈대숲의 모란 · 삼신의 심판 — 모란의 판' },
  mokel: { name: '로켈의 갑옷', ic: '🛡', hold: true, d: '지닌 이가 받는 피해 −15% (삼신 — 거래)', how: '삼신의 심판 — 로켈의 판을 넘기면' },
  rokto: { name: '록토의 로브', ic: '💀', d: '아군 모두 은신이 한 단계 좋아짐 (괴이)' },
  tea: { name: '오딜의 차', ic: '🍵', d: '층에 들어설 때 모두 최대 체력의 20% 회복' },
  branch: { name: '친칠라의 하얀 가지', ic: '🌿', d: '활을 쏘는 동료의 공격 +25%' },
  coin: { name: '굴 동전 주머니', ic: '👛', d: '싸움에서 얻는 동전 +50%' },
  boots: { name: '망자의 장화', ic: '🥾', d: '아군 모두 조금 빠름 (+6%)' },
  crown: { name: '부서진 왕관 조각', ic: '👑', d: '싸움마다 한 번 — 치명타를 맞아도 체력 1 로 버팀 (처음 맞는 동료)' },
  dice: { name: '왐의 주사위', ic: '🎲', d: '상인 값이 20% 쌈' },
  compass: { name: '랑팡의 나침반', ic: '🧭', d: '싸움판의 출구를 처음부터 앎 (찾지 않아도 됨)' },
  whet: { name: '탄탄만의 숫돌', ic: '⚒', d: '무기 · 방패 · 갑옷이 40% 덜 닳음' },
  belt: { name: '노라의 탄띠', ic: '🎗', d: '층에 들어설 때 사수의 화살 · 탄이 가득 참' },
  rabbit: { name: '아이텐의 토끼발', ic: '🐇', d: '아군 모두 회피 +8%' },
  sheath: { name: '셰도르의 단검집', ic: '🔪', d: '단검을 든 동료의 공격 +25%' },
  banner: { name: '호레이쇼의 군기', ic: '🚩', d: '명령이 닿을 확률 +15% (외침 · 손짓 · 전달이 닿는 곳에서)' },
  flame: { name: '페흐토의 청염 조각', ic: '🔥', hold: true, d: '지닌 이의 근접 공격에 청염 — 맞은 상대에게 불이 붙음', how: '페흐토를 이기면' },
  jelly: { name: '세르파의 젤리', ic: '🟢', d: '싸움이 끝날 때 가장 다친 동료가 최대 체력의 25% 회복' },
  feather: { name: '인공천사 벨의 깃털', ic: '🪽', d: '싸움마다 한 번 — 체력이 30% 아래로 떨어진 첫 동료를 감쌈 (체력 +20% · 피가 멎음)' },
  herbs: { name: '마리의 약초 주머니', ic: '🍃', d: '치유하는 동료의 치유량 +25%' },
  ribbon: { name: '로지나의 리본', ic: '🎀', d: '뛸 때 (서두름) 걸음 +15%' },
  glass: { name: '테헤라의 모래시계', ic: '⏳', d: '한 번 — 모두 쓰러지면 그 싸움 앞으로 되돌아감 (모래시계는 깨짐)' },
  drop: { name: '각혈의 핏방울', ic: '🩸', d: '피 흘리는 상대에게 주는 피해 +15%' },
  shard: { name: '망각의 데이터 조각', ic: '💾', d: '숨은 상대가 더 멀리서 보임 (은신 × 1.3)' },
  core: { name: '붉은암석의 핵', ic: '🌋', d: '아군 모두 넘어짐 · 밀려남 버팀 +20%' },
  key: { name: '도굴꾼의 열쇠', ic: '🗝', d: '보물 상자의 미믹을 알아봄 (미믹 없음) · 상자에서 동전 +30' } };
// 뽑기 · 상인 · 보물 · 만남이 주는 풀 (24) — 오딜의 눈물 · 비늘조각 · 간호사장의 모자 · 루미의 바이올린 · 가뮤의 대검 · 삼신의 셋 · 청염 조각 · 여신의 눈물은 얻는 길만 (J9)
const RELIC8_POOL = ['candle', 'duck', 'rokto', 'tea', 'branch', 'coin', 'boots', 'crown', 'dice', 'compass', 'whet', 'belt', 'rabbit', 'sheath', 'banner', 'jelly', 'feather', 'herbs', 'ribbon', 'glass', 'drop', 'shard', 'core', 'key'];
// v8.7.7 지닌 이 (끼운 인물만): 유물 칸에서 고름 — 고르지 않았거나 · 떠났거나 · 조건이 안 맞으면 기본 (간호사 · 가장 큰 몸 · 주인공)
const isNurse8 = p => !!p && (p.ref === 'C-018' || /간호사/.test(p.name || ''));   /* 가윤 = 1성 간호사 (C-018) */
const REL_BIG = ['중대형', '대형', '초대형'];
const sizeP8 = p => { try { return sizeP(p); } catch (e) { return p.sizeCls || '중형'; } };
const REL_OK = { nurse: p => isNurse8(p), gamyu: p => REL_BIG.includes(sizeP8(p)) }, REL_WHY = { nurse: '간호사만', gamyu: '중대형 · 대형 · 초대형만' };
const r8HoldOK = (k, p) => !REL_OK[k] || REL_OK[k](p);
function r8Holder(k){
  const R = R8S(); if (!R || !(R.relics || []).includes(k) || !(RELIC8[k] || {}).hold) return null;
  const live = (R.party || []).filter(p => !(R.dead || []).includes(p.name)), id = (R.relHold || {})[k];
  let p = id != null ? live.find(x => String(x.id) === String(id)) : null; if (p && !r8HoldOK(k, p)) p = null;
  if (!p){ const L = live.filter(x => r8HoldOK(k, x)); p = k === 'gamyu' ? L.sort((a, b) => (SIZE_RANK[sizeP8(b)] || 0) - (SIZE_RANK[sizeP8(a)] || 0) || (+b.weight || 0) - (+a.weight || 0))[0] : (L.find(x => x.hero) || L[0]); }
  return p || null;
}
const r8HeldIc = p => { const R = R8S(); if (!R || !p) return ''; const L = (R.relics || []).filter(k => (RELIC8[k] || {}).hold && (r8Holder(k) || {}).id === p.id); return L.length ? ' <span class="r8held" title="' + esc(L.map(k => RELIC8[k].name).join(' · ')) + '">' + L.map(k => RELIC8[k].ic).join('') + '</span>' : ''; };
// 유물을 얻음 (한 곳으로): 이미 있으면 false · 촛대는 불꽃 다섯
function r8AddRelic(k){ const R = R8S(); if (!R || !RELIC8[k] || R.relics.includes(k)) return false; R.relics.push(k); if (k === 'candle') R.flags.candle = 5; return true; }
// 지닐 사람 고르기
function r8HoldPanel(k){
  const R = R8S(), D = RELIC8[k]; if (!R || !D || !D.hold) return; const cur = r8Holder(k), live = R.party.filter(p => !R.dead.includes(p.name));
  const el = r8Panel(`<h2>${D.ic} ${esc(D.name)} — 지닐 사람</h2><div class="r8sub">${esc(D.d)}${REL_WHY[k] ? ' · ' + esc(REL_WHY[k]) : ''}${k === 'candle' ? ` · 남은 불꽃 ${R.flags.candle != null ? R.flags.candle : 5}` : ''}</div><div class="r8pan">${live.map(p => { const ok = r8HoldOK(k, p), on = cur && cur.id === p.id; return `<button class="btn r8hp${on ? ' go' : ''}" type="button" ${ok ? `data-r8hp="${esc(String(p.id))}"` : 'disabled'}><i style="${r8Face(p.ref, 34)};border-radius:8px"></i><span><b>${esc(jobNm8(p))}</b> <small>${on ? '지니고 있음' : ok ? '' : esc(REL_WHY[k] || '')}</small></span></button>`; }).join('') || '<p>지닐 동료가 없어요.</p>'}<div class="row"><button class="btn" type="button" id="r8hX">지도로</button></div></div>`);
  el.querySelectorAll('[data-r8hp]').forEach(b => b.onclick = () => { R.relHold = R.relHold || {}; R.relHold[k] = b.dataset.r8hp; save(); toast(`${D.name} — ${jobNm8(R.party.find(p => String(p.id) === b.dataset.r8hp) || {})}`); r8MapShow(); });
  $('r8hX').onclick = () => r8MapShow();
}
// 상세 칸 (싸움 중): 지닌 유물 · 전직
function r8DetLine(Wd, u){
  if (!Wd || !Wd.r8 || u.side !== 0 || !run8On()) return ''; const R = R8S(), p = S.units.find(x => x.id === u.pid) || {}, L = [];
  for (const k of R.relics || []) if ((RELIC8[k] || {}).hold && (r8Holder(k) || {}).id === p.id) L.push(RELIC8[k].ic + ' ' + RELIC8[k].name + (k === 'candle' && Wd.r8candle && Wd.r8candle.i === u.i ? ' (불꽃 ' + Wd.r8candle.left + ')' : ''));
  const j = jobOf8(p);
  return (j ? `<span class="tr"><span class="lb">전직</span> ⭐ ${esc(j.name)} — ${esc(j.d)}</span>` : '') + (L.length ? `<span class="tr"><span class="lb">유물</span> ${esc(L.join(' · '))}</span>` : '');
}'''
cut("// 유물 — 효과는 싸움을 만들 때 (r8Pre: 설계에 얹었다가 판을 만든 뒤 걷음 · r8Post: 판의 몸에) 또는 정해진 때\nconst RELIC8 = {",
    "const RELIC8_POOL = ['odtear', 'scale', 'nurse', 'violin', 'candle', 'gamyu', 'duck', 'rokto', 'tea', 'branch', 'coin', 'boots', 'crown', 'dice'];", RELIC_JS)

# 최대 체력: 비늘조각 (지닌 이)
rep("const r8MaxHp = p => { try { return Math.round(statsOf(p, rules).hp * (1 + 0.06 * ((R8S() || {}).tears || 0)) * (r8Has('rabis') ? 1.1 : 1)); } catch (e) { return 100; } };",
    "const r8MaxHp = p => { try { return Math.round(statsOf(p, rules).hp * (1 + 0.06 * ((R8S() || {}).tears || 0)) * (r8Has('rabis') ? 1.1 : 1) * (r8Has('scale') && (r8Holder('scale') || {}).id === p.id ? 1.2 : 1)); } catch (e) { return 100; } };   /* v8.7.7 비늘조각 (지닌 이) 도 */")

# 층에 들어설 때: 노라의 탄띠
rep("  for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, Math.round((p.hpNow != null ? p.hpNow : mx) + mx * (R8.floorHeal + (r8Has('tea') ? 0.2 : 0)))); }",
    "  for (const p of R.party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, Math.round((p.hpNow != null ? p.hpNow : mx) + mx * (R8.floorHeal + (r8Has('tea') ? 0.2 : 0)))); }\n"
    "  if (r8Has('belt')) for (const p of R.party) if (p.ammo != null && p.ammo !== ''){ fix873(p); if (p.ammoMax != null) p.ammo = Math.max(+p.ammo || 0, +p.ammoMax); }   /* v8.7.7 노라의 탄띠 */")

# 지도: 유물 칸 (지닌 이 · 누르면 고름) · 동료 줄 (전직 이름 · 지닌 유물) · 3층 비늘조각
rep("    <div class=\"r8rel\">${R.relics.length ? R.relics.map(k => `<span title=\"${esc((RELIC8[k] || {}).d || '')}\">${(RELIC8[k] || {}).ic || '?'} ${esc((RELIC8[k] || {}).name || k)}</span>`).join('') : '<span style=\"opacity:.6\">유물 없음</span>'}</div>",
    "    <div class=\"r8rel\">${R.relics.length ? R.relics.map(k => { const D = RELIC8[k] || {}, h = D.hold ? r8Holder(k) : null; return D.hold ? `<button type=\"button\" class=\"r8hold\" data-r8hold=\"${k}\" title=\"${esc(D.d || '')} — 눌러서 지닐 사람을 고름\">${D.ic || '?'} ${esc(D.name || k)}${k === 'candle' ? ` (불꽃 ${R.flags.candle != null ? R.flags.candle : 5})` : ''} <small>· ${h ? esc(jobNm8(h)) : '지닐 사람 없음'}</small></button>` : `<span title=\"${esc(D.d || '')}\">${D.ic || '?'} ${esc(D.name || k)}</span>`; }).join('') : '<span style=\"opacity:.6\">유물 없음</span>'}</div>")
rep("return `<div class=\"r8p\"><i style=\"${r8Face(p.ref, 34)}\"></i><div><b>${esc(p.name)}</b>${p.hero ? ' 🔥' : ''}",
    "return `<div class=\"r8p\"><i style=\"${r8Face(p.ref, 34)}\"></i><div><b>${esc(jobNm8(p))}</b>${p.hero ? ' 🔥' : ''}${r8HeldIc(p)}")
rep("  const R = R8S(); if (!R || !R.on) return; r8Css();\n  let el = $('run8');",
    "  const R = R8S(); if (!R || !R.on) return; r8Css();\n"
    "  if (R.f === 3 && (R.flags.f3n || 0) >= 6 && !R.relics.includes('scale') && !R.flags.sardilGift && !(world && !world.over)){   /* v8.7.7 3층 (여신의 호수) 을 자주 오가면 — 사르딜 락의 비늘조각 */\n"
    "    R.flags.sardilGift = 1; r8AddRelic('scale'); save(); r8Hide(); R8T = () => r8MapShow();\n"
    "    talkLines([{ narr: '호수 가장자리를 몇 번이나 오갔을까. 물 밑에서 푸른 빛이 줄곧 따라오고 있었다.', img: IMG8.sardil2 }, { t: '…시끄럽게도 오가는군, 작은 것들. 이거나 가지고 조용히 지나가라.', name: '사르딜 락', img: IMG8.sardil }, { narr: '물 위로 손바닥만 한 푸른 비늘 한 조각이 떠오른다.' }, { box: '🐉 사르딜 락의 비늘조각 — 지닌 이 최대 체력 +20% · 화상 · 동상을 반으로 (유물 칸에서 지닐 사람을 고름)' }, { go: '!r8:then' }]); return; }\n"
    "  let el = $('run8');")
rep("  const b = e.target.closest('[data-r8]'); if (!b) return; const k = b.dataset.r8;",
    "  const hb = e.target.closest('[data-r8hold]'); if (hb){ r8HoldPanel(hb.dataset.r8hold); return; }   /* v8.7.7 지닐 사람 */\n"
    "  const b = e.target.closest('[data-r8]'); if (!b) return; const k = b.dataset.r8;")
rep("  const R = R8S(); if (!R || !n) return; r8Sel = null; R.at = n.id; save();",
    "  const R = R8S(); if (!R || !n) return; r8Sel = null; R.at = n.id; if (R.f === 3) R.flags.f3n = (R.flags.f3n || 0) + 1; save();   /* v8.7.7 3층을 오간 수 (비늘조각) */")
rep("R.at = r8PrevAt(); save(); toast('물러났어요 — 그 칸은 다시 고를 수 있어요');",
    "R.at = r8PrevAt(); if (R.f === 3) R.flags.f3n = (R.flags.f3n || 0) + 1; save(); toast('물러났어요 — 그 칸은 다시 고를 수 있어요');")
rep(".r8rel span{background:#241f33;border:1px solid #3b3350;border-radius:8px;padding:2px 7px;font-size:12px}",
    ".r8rel span{background:#241f33;border:1px solid #3b3350;border-radius:8px;padding:2px 7px;font-size:12px}\n"
    ".r8rel button.r8hold{background:#2a2438;border:1px solid #7a6431;border-radius:8px;padding:2px 8px;font:inherit;font-size:12px;color:inherit;cursor:pointer;min-height:32px}.r8rel button.r8hold small{opacity:.85;color:#f0d690}\n"
    "body.mob .r8rel button.r8hold{min-height:36px}.r8held{font-size:12px;letter-spacing:1px}\n"
    ".r8 .btn.r8hp{display:flex;align-items:center;gap:8px;margin:4px 0;width:100%;text-align:left;min-height:44px}.r8 .r8jimg{display:block;width:100%;height:170px;background:center/contain no-repeat;margin-bottom:4px}")

# ---------- 효과 (설계 · 몸 · 판마다) ----------
EFF_JS = r'''// 유물 효과 (판을 만들기 전 설계 · 만든 뒤 몸) — v8.7.7 지닌 이 (끼운 인물만)
function r8Pre(party){
  const undo = []; const add = (p, t) => { if (!(p.traits || []).includes(t)){ p.traits = [...(p.traits || []), t]; undo.push(() => { p.traits = (p.traits || []).filter(x => x !== t); }); } };
  const hp = k => { const h = r8Holder(k); return h ? party.find(p => p.id === h.id) || null : null; };
  { const p = hp('odtear'); if (p) add(p, '가호:오딜'); }   /* v8.7.7 [가호:오딜] — 받는 피해 × 0.9 (엔진) · 예전 '축복:오딜' 은 아무 효과도 없었음 */
  if (r8Has('rokto')) for (const p of party){ const cur = (p.traits || []).find(t => /^은신[SABCDE]$/.test(t)); const up = { E: 'D', D: 'C', C: 'B', B: 'A', A: 'S', S: 'S' }[cur ? cur.slice(-1) : 'D'] || 'C'; if (cur){ p.traits = p.traits.filter(t => t !== cur); undo.push(() => { p.traits = [...p.traits.filter(t => t !== '은신' + up), cur]; }); } add(p, '은신' + up); }
  { const p = hp('nurse'); if (p && p.skill && p.skill.pool){ const s0 = p.skill.pool; p.skill.pool += 3; if (!p.nurse3){ p.nurse3 = true; if (p.skLeft != null) p.skLeft += 3; } undo.push(() => { p.skill.pool = s0; }); } }   /* v8.7.7 간호사 전용 · 약 +3 (남은 약 +3 은 처음 한 번만) */
  for (const p of party) if (p.skill && p.skill.pool && p.skLeft != null && p.skLeft > p.skill.pool) p.skLeft = p.skill.pool;   /* v8.7.3 쌓였던 약은 최대까지 */
  return () => undo.forEach(f => f());
}
const r8HealK = (u, k) => { const s = u.skill; if (!s) return; for (const f of ['per', 'pct', 'min', 'cap', 'hot']) if (s[f] != null && isFinite(s[f]) && s[f] > 0) s[f] = +(s[f] * k).toFixed(3); };   /* v8.7.7 치유량 × */
function r8Post(W){
  if (!W) return; const R = R8S(), al = W.units.filter(u => u.side === 0), hero = al.find(u => u.hero) || al[0];
  const mul = (u, k) => { const r = u.hp / u.max; u.max = Math.round(u.max * k); u.hp = Math.max(1, Math.round(u.max * r)); };
  const hu = k => { const p = r8Holder(k); return p ? al.find(u => u.pid === p.id) || null : null; };   /* v8.7.7 지닌 이의 몸 */
  const tk = 1 + 0.06 * R.tears; for (const u of al){ if (tk > 1) mul(u, tk); if (r8Has('rabis')) mul(u, 1.1); if (r8Has('boots')) u.spd *= 1.06; }
  if (R.tears > 0) W.torchK = 1 + 0.1 * R.tears;   // 여신의 눈물 — 횃불이 더 밝음
  { const u = hu('scale'); if (u){ mul(u, 1.2); u.fireRes = 0.5; u.frostRes = 0.5; } }
  { const u = hu('moran'); if (u) u.ev = (u.ev || 1) * 1.15; }
  { const u = hu('gamyu'); if (u && REL_BIG.includes(sizeOf(u))){ u.atk = Math.round(u.atk * 1.3); u.r8gamyu = true; } }
  { const u = hu('mokel'); if (u) u.dmgK = (u.dmgK || 1) * 0.85; }
  { const u = hu('flame'); if (u) u.wFire = 2; }
  { const u = hu('nurse'); if (u) r8HealK(u, 1.3); }
  for (const u of al){ const w = u.weaponNow || u.weapon || '';
    if (r8Has('duck') && isFar(u)) u.atk = Math.round(u.atk * 1.2);
    if (r8Has('branch') && /활/.test(w)) u.atk = Math.round(u.atk * 1.25);
    if (r8Has('sheath') && /단검/.test(w)) u.atk = Math.round(u.atk * 1.25);
    if (r8Has('rabbit')) u.ev = (u.ev || 1) * 1.08;
    if (r8Has('whet')) u.durK = 0.6;
    if (r8Has('ribbon')) u.runK = 1.15;
    if (r8Has('drop')) u.bleedK = 1.15;
    if (r8Has('shard')) u.spotK = 1.3;
    if (r8Has('core')) u.poise = (u.poise || 1) * 1.2;
    if (r8Has('herbs')) r8HealK(u, 1.25); }
  if (r8Has('banner')) W.cmdBonus = { 0: 0.15 };
  if (r8Has('candle')){ const c = R.flags.candle == null ? (R.flags.candle = 5) : R.flags.candle, u = hu('candle'); if (c > 0 && u) W.r8candle = { i: u.i, left: c }; }
  if (r8Has('crown')) W.crown = { 0: 1 };
  if (r8Has('feather')) W.r8feather = 1;
}
// 판마다 (draw 쪽에서 부름): 촛대 · 깃털 · 옥상 낙사
function r8Tick(W){
  if (!W || !W.r8) return; const R = R8S(); if (!R) return;
  if (W.duel){ if (typeof duel8Tick === 'function') duel8Tick(W); return; }   // v8.2 결승 (촛대 · 관중 없음)
  const c = W.r8candle; if (c && c.left > 0){ const u = W.units[c.i]; if (u && !u.alive && !u.gone && !u.down){ try { rise(W, u, 0.1, true); } catch (e) {} c.left--; R.flags.candle = c.left; logEv(W, { k: 'r8', s: `🕯 촛대의 불꽃 — ${u.name} 이(가) 다시 일어난다 · 중상이 나음 (남은 불꽃 ${c.left})`, c: 'good', vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '🕯 다시 일어남', c: 'h', t0: W.t }); } }
  if (W.r8feather > 0){ const u = W.units.find(x => x.side === 0 && x.alive && !x.summon && !x.gone && x.hp > 0 && x.hp < x.max * 0.3); if (u){ W.r8feather--; u.hp = Math.min(u.max, u.hp + u.max * 0.2); u.bleed = null; u.ibleed = null; logEv(W, { k: 'r8', s: `🪽 깃털이 ${u.name} 을(를) 감싼다 — 체력 +20% · 피가 멎음`, c: 'good', vis: true }); if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '🪽 감쌈', c: 'h', t0: W.t }); } }
'''
cut("// 유물 효과 (판을 만들기 전 설계 · 만든 뒤 몸)\nfunction r8Pre(party){", "  if (r8Has('crown')) W.r8crown = 1;\n}\n", "", True)
cut("// 판마다 (draw 쪽에서 부름): 촛대 · 옥상 낙사\nfunction r8Tick(W){",
    "if (W.fxOn) W.fx.push({ k: 'num', x: u.x, y: u.y, s: '🕯 다시 일어남', c: 'h', t0: W.t }); } }\n", EFF_JS)

# 판을 만들 때: 모래시계 (되돌아갈 자리) · 나침반 (출구를 앎)
rep("  selId = null; rebuildMap(); setMapUI(); save(); start(); renderFloors(); pre();\n", "  selId = null; rebuildMap(); setMapUI(); save(); start(); renderFloors(); pre(); save();   /* v8.7.7 설계에 얹었던 유물 몫 (가호 · 은신 · 약) 을 걷은 뒤 다시 저장 — 싸우다 새로 고침해도 남지 않게 */\n")
rep("  const pre = r8Pre(party);\n", "  if (r8Has('glass') && (!waveK || !R.glassSnap)) R.glassSnap = clone(R.party); else if (!r8Has('glass')) delete R.glassSnap;   /* v8.7.7 테헤라의 모래시계 — 싸움 앞의 동료들 */\n  const pre = r8Pre(party);\n")
rep("world.exitLock = n.t === 'elite' || n.t === 'boss'; world.exitHide = true;",
    "world.exitLock = n.t === 'elite' || n.t === 'boss'; world.exitHide = !r8Has('compass'); if (r8Has('compass')) world.exitSeen = true;   /* v8.7.7 랑팡의 나침반 — 출구를 처음부터 앎 */")

# 판을 나감: 모래시계 · 젤리 · 삼신 · 보스 유물 · 눈물
rep("  for (const u of W.units){ if (u.side !== 0 || u.summon) continue; const p = S.units.find(x => x.id === u.pid); if (!p) continue;\n    if (u.gone === 'up' || u.gone === 'down'){ dirs[u.gone] = (dirs[u.gone] || 0) + 1; settleWorld({ units: [{ ...u, alive: true }], items: W.items }); p.hpNow = Math.round(u.hp); if (u.skill) p.skLeft = u.skill.left; else delete p.skLeft; party.push(p); }\n    else if (u.gone === 'left'){ C.lost.push(p.name); } else { C.fallen.push(p.name); R.dead.push(p.name); } }",
    "  if ((W.result === 'lose' || !W.units.some(u => u.side === 0 && !u.summon && (u.gone === 'up' || u.gone === 'down'))) && r8Has('glass') && R.glassSnap){   /* v8.7.7 테헤라의 모래시계 — 모두 쓰러지면 그 싸움 앞으로 (한 번 · 깨짐) */\n"
    "    R.party = R.glassSnap; delete R.glassSnap; R.relics = R.relics.filter(k => k !== 'glass'); { const nid = R.at; R.done = R.done.filter(x => x !== nid); } R.at = r8PrevAt(); R.log.push({ f: R.f, k: 'glass', t: Date.now() }); save(); world = null;\n"
    "    R8T = () => r8MapShow(); talkLines([{ narr: '모래시계가 손 안에서 깨진다. 흩어진 모래가 거꾸로 흐른다 —' }, { narr: '눈을 뜨니, 싸움이 시작되기 전이다. 아무도 쓰러지지 않았다.' }, { box: '⏳ 테헤라의 모래시계 — 그 싸움 앞으로 되돌아감 (모래시계는 깨짐)' }, { go: '!r8:then' }]); return; }\n"
    "  for (const u of W.units){ if (u.side !== 0 || u.summon) continue; const p = S.units.find(x => x.id === u.pid); if (!p) continue;\n    if (u.gone === 'up' || u.gone === 'down'){ dirs[u.gone] = (dirs[u.gone] || 0) + 1; settleWorld({ units: [{ ...u, alive: true }], items: W.items }); p.hpNow = Math.round(u.hp); if (u.skill) p.skLeft = u.skill.left; else delete p.skLeft; party.push(p); }\n    else if (u.gone === 'left'){ C.lost.push(p.name); } else { C.fallen.push(p.name); R.dead.push(p.name); } }")
rep("  if (r8Has('violin')) for (const p of party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow || 0) + Math.round(mx * 0.1)); }",
    "  if (r8Has('violin')) for (const p of party){ const mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow || 0) + Math.round(mx * 0.1)); }\n"
    "  if (r8Has('jelly') && party.length){ const p = party.slice().sort((a, b) => (a.hpNow != null ? a.hpNow : r8MaxHp(a)) / r8MaxHp(a) - (b.hpNow != null ? b.hpNow : r8MaxHp(b)) / r8MaxHp(b))[0], mx = r8MaxHp(p); p.hpNow = Math.min(mx, (p.hpNow != null ? p.hpNow : mx) + Math.round(mx * 0.25)); }   /* v8.7.7 세르파의 젤리 */")
rep("  if (B && B.tear){ R.tears++; if (!R.relics.includes('tear')) R.relics.push('tear'); rew.push(`💧 여신의 눈물 ${B.tear === 2 ? '②' : '③'}`); }",
    "  const gw = node.t === 'boss' && node.b === 'gods' ? ((W.r8 || {}).wave || 0) : -1;   /* v8.7.7 삼신의 심판: 판마다 그 신의 유물 · 눈물은 마지막 판에만 (예전엔 판마다 하나 — 셋) */\n"
    "  if (gw >= 0 && W.cleared){ const gk = ['rabis', 'mokel', 'moran'][gw]; if (gk && r8AddRelic(gk)) rew.push(`${RELIC8[gk].ic} ${RELIC8[gk].name}`); }\n"
    "  if (B && B.relic && W.cleared && r8AddRelic(B.relic)) rew.push(`${RELIC8[B.relic].ic} ${RELIC8[B.relic].name}`);   /* v8.7.7 보스 유물 (붉은암석의 핵) */\n"
    "  if (B && B.tear && !(gw >= 0 && gw < 2)){ R.tears++; if (!R.relics.includes('tear')) R.relics.push('tear'); rew.push(`💧 여신의 눈물 ${B.tear === 2 ? '②' : '③'}`); }")

# 유물 주기 — 힘으로 주는 것 (정예 · 가뮤) 은 풀과 상관없이
rep("  const R = R8S(); const L = RELIC8_POOL.filter(k => !R.relics.includes(k)); if (!L.length) return null; const k = force || r8Pick(L); R.relics.push(k); if (k === 'candle') R.flags.candle = 5; return k;",
    "  const R = R8S(); if (force) return r8AddRelic(force) ? force : null;   /* v8.7.7 예전엔 풀이 비면 정예 유물 (가뮤의 대검) 도 못 받았음 */\n"
    "  const L = RELIC8_POOL.filter(k => !R.relics.includes(k)); if (!L.length) return null; const k = r8Pick(L); r8AddRelic(k); return k;")
rep("  for (const c of cards){ if (c.k === 'relic'){ if (!R.relics.includes(c.id)){ R.relics.push(c.id); if (c.id === 'candle') R.flags.candle = 5; got.push(RELIC8[c.id].name); } }",
    "  for (const c of cards){ if (c.k === 'relic'){ if (r8AddRelic(c.id)) got.push(RELIC8[c.id].name); }")
rep("    if (it.k === 'relic'){ R.relics.push(it.id); if (it.id === 'candle') R.flags.candle = 5; it.sold = true; }",
    "    if (it.k === 'relic'){ r8AddRelic(it.id); it.sold = true; }")

# 보물: 도굴꾼의 열쇠
rep("  if (Math.random() < 0.2 && !n.mimic){ n.mimic = true; n.t = 'fight'; save(); talkLines([{ narr: '상자가 입을 벌렸다 — 미믹이다!' }, { go: '!r8:battle' }]); return; }\n  const k = r8GiveRelic(); save();",
    "  if (Math.random() < 0.2 && !n.mimic && !r8Has('key')){ n.mimic = true; n.t = 'fight'; save(); talkLines([{ narr: '상자가 입을 벌렸다 — 미믹이다!' }, { go: '!r8:battle' }]); return; }   /* v8.7.7 도굴꾼의 열쇠 — 미믹을 알아봄 */\n"
    "  const k = r8GiveRelic(), kg = r8Has('key') && !n.keyG ? 30 : 0; if (kg){ n.keyG = 1; R.gold += kg; } save();")
rep("'<p>비어 있다. 누군가 먼저 다녀갔다.</p>'}<div class=\"row\" style=\"justify-content:center\"><button class=\"btn go\" type=\"button\" id=\"r8chX\">챙긴다</button>",
    "'<p>비어 있다. 누군가 먼저 다녀갔다.</p>'}${kg ? `<p>🗝 열쇠로 연 바닥 칸 — 👛 ${kg}</p>` : ''}<div class=\"row\" style=\"justify-content:center\"><button class=\"btn go\" type=\"button\" id=\"r8chX\">챙긴다</button>")
rep("  cOpen(){ const R = R8S(); if (Math.random() < 0.2){ r8Say([{ narr: '상자에 이빨이 있었다!' }], () => r8XFight('x_mimic')); return; }",
    "  cOpen(){ const R = R8S(); if (Math.random() < 0.2 && !r8Has('key')){ r8Say([{ narr: '상자에 이빨이 있었다!' }], () => r8XFight('x_mimic')); return; }")

# 상세 칸 (싸움 중) — 지닌 유물 · 전직
rep("    <span class=\"tr\"><span class=\"lb\">몸</span> 키 ${u.h}m · 무게 ${u.mass}kg",
    "    ${r8DetLine(Wd, u)}\n    <span class=\"tr\"><span class=\"lb\">몸</span> 키 ${u.h}m · 무게 ${u.mass}kg")

# 얻는 곳: 정예 · 보스 유물 · 이벤트는 r8AddRelic 으로
rep("  x_pehto: { name: '페흐토', foes: [['페흐토', 1]] },", "  x_pehto: { name: '페흐토', foes: [['페흐토', 1]], relic: 'flame' },   /* v8.7.7 페흐토의 청염 조각 */")
rep("  forget: { name: '망각', foes: [['망각', 1], ['@saved', 2]] },", "  forget: { name: '망각', foes: [['망각', 1], ['@saved', 2]], relic: 'shard' },   /* v8.7.7 망각의 데이터 조각 */")
rep("  redrock: { name: '붉은암석', foes: [['붉은암석', 1]] },", "  redrock: { name: '붉은암석', foes: [['붉은암석', 1]], relic: 'core' },   /* v8.7.7 붉은암석의 핵 */")
rep("  serpa: { name: '붉은암석', foes: [['붉은암석', 1]] },", "  serpa: { name: '붉은암석', foes: [['붉은암석', 1]], relic: 'core' },")
rep("x_sardilTalk(){ const R = R8S(); if (R.tears >= 1 && !R.relics.includes('scale')){ R.relics.push('scale');",
    "x_sardilTalk(){ const R = R8S(); if (R.tears >= 1 && !R.relics.includes('scale')){ r8AddRelic('scale');")
rep("{ box: '🐉 사르딜락의 비늘조각 — 인주 최대 체력 +20% · 불 · 냉기에 강함' }",
    "{ box: '🐉 사르딜 락의 비늘조각 — 지닌 이 최대 체력 +20% · 화상 · 동상을 반으로' }")
rep("if (holy && !R.relics.includes('odtear')){ R.relics.push('odtear');", "if (holy && !R.relics.includes('odtear')){ r8AddRelic('odtear');")
rep("{ box: '🌹 오딜의 눈물 (신성일 때만 얻음) — 인주에게 [가호:오딜]' }", "{ box: '🌹 오딜의 눈물 (신성일 때만 얻음) — 지닌 이에게 [가호:오딜] (받는 피해 −10%)' }")
rep("if (!R.relics.includes('moran')){ R.relics.push('moran'); L.push({ box: '🎭 모란의 가면 — 인주의 회피 +15%' }); }",
    "if (r8AddRelic('moran')) L.push({ box: '🎭 모란의 가면 — 지닌 이의 회피 +15%' });")
