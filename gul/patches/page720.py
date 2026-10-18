# v7.20 페이지 — page720.py v1.1 (v1.1: 소지품 칸 색은 테마 변수로 (밝은 테마에서 글씨가 안 보이던 것) · 3단계 소지품: 배치 상세의 소지품 (장비 네 칸 · 가방 칩 · 끼우기 · 벗기 · 넘겨주기 · 버리기 · 넣기) · 판 위 상세의 소지품 (내구도 · 들기 명령) · 로그 · 서술 · 동작 이름표 · 명령 이름 · 떨어진 물건 이름 · 검기사 투구 없음 · [개조된 신체] 장비 제한 글 · 옛 저장 한 번 · 수치표 7.20.0)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 판 번호 ----------
rep('<!-- 굴의 전투판 v7.19.2 (2026-10-18)', '<!-- 굴의 전투판 v7.20.0 (2026-10-18)')
rep('     v7.19.2: ', '''     v7.20.0: 3단계 소지품 · 장비 · 내구도 (적 · 아군 같은 규칙).
         가방 (체급별 칸: 소형 5 · 중형 8 · 중대형 10 · 대형 12 · 카리우스 16 — 탄은 한 칸에 일반 20 · 특수 8 · 화살 30) — 배치 상세 '소지품' 에서 끼우기 · 벗기 · 넘겨주기 · 버리기 · 넣기.
         싸우는 중: 탄이 다 떨어지면 가방의 같은 종류 탄을 꺼냄 (1.2초) · 탄도 없거나 무기를 잃으면 가방의 무기 (+ 한 손 근접이면 방패) 를 꺼내 듦 (0.8초 · 방패 +0.5) · 상세 창 '들기' 로 명령도.
         내구도 (0 ~ 100): 근접 무기는 맞힐 때 · 막힐 때 닳고 막힐 때 아주 드물게 부러짐 (낡을수록 · 둔기 · 센 기술에 더) · 방패는 막은 만큼 닳아 0 이면 부서짐 · 갑옷 · 투구는 막아 낸 만큼 닳아 25 아래면 덜 막고 0 이면 망가짐.
         루팅 이름 ('검기사의 장검' · '창병의 방패') · 남의 장비 (근접 공격 ×0.93 · 준비 ×1.06 · 갑옷 무게 ×1.1) · 한 단계 큰 갑옷 무게 ×1.35 · 대검 (두 손) 은 방패와 함께 못 듦.
         [개조된 신체] 카리우스: 몸 갑옷 못 입음 · 투구는 됨 (머리는 일반인) · 원거리 무기 못 씀 · 무기 4개까지.
         1층 적: 검기사는 투구 없음 (나머지 기사는 투구).
     v7.19.2: ''')
rep('h1::after{content:" v7.19.2"', 'h1::after{content:" v7.20.0"')
rep('<footer>굴의 전투판 v7.19.2', '<footer>굴의 전투판 v7.20.0')
rep('return `굴의 전투판 v7.19.2 · ${title}', 'return `굴의 전투판 v7.20.0 · ${title}')
rep("copyText('굴의 전투판 v7.19.2 자동 판 기록", "copyText('굴의 전투판 v7.20.0 자동 판 기록")
rep('의 버전 기록에 — v7.19.2 딸기 역장 · 뿌리 벽 · 열매 · 무기 잡기', '의 버전 기록에 — v7.20.0 소지품 · 내구도 · 파손 · 루팅 이름 / v7.19.2 딸기 역장 · 뿌리 벽 · 열매 · 무기 잡기')
rep('">v7.19.2 · 딸기 역장 · 뿌리 벽 · 무기 잡기</span>', '">v7.20.0 · 소지품 · 내구도 · 파손</span>')
rep("RULES_MIG = '7.19.2'", "RULES_MIG = '7.20.0'")

# ---------- 검기사 투구 없음 · [개조된 신체] 글 ----------
rep("tac: '', gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 2 } }, tactic: '검기사'", "tac: '', gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 3 } }, tactic: '검기사'")
rep("  'C-052': { hp: 170, atk: 32, h: 2.2, gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 2 } } },", "  'C-052': { hp: 170, atk: 32, h: 2.2, gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 3 } } },   /* v7.20 1층 검기사는 투구 없음 */")
rep("'머리 넷 — 시야를 나눠 사방을 봄 (몸은 천천히 돎)'],", "'머리 넷 — 시야를 나눠 사방을 봄 (몸은 천천히 돎)', '손이 기형 — 원거리 무기를 못 씀 · 몸에 맞는 갑옷이 없음 (머리는 일반인이라 투구는 됨) · 무기는 4개까지 지님 · 가방 16칸 (v7.20)'],")

# ---------- 옛 저장 한 번: 검기사 투구 뺌 ----------
rep("// v7.19.2 딸기 (한 번): 역장 · 뿌리 벽 · [열매 맺기]", """// v7.20 검기사 (한 번): 1층 검기사는 투구 없음 — 옛 기본 투구 (쇠 기사 투구 2성) 만 뺌 (손으로 바꾼 투구는 그대로)
const fix720 = p => { const g = p && p.gear && p.gear['머리']; if (!p || p.side !== 1 || p.ref !== 'C-052' || !g || g.name !== '쇠 기사 투구' || +g.tier !== 2) return false; delete p.gear['머리']; return true; };
if (!S.v720k){ let n = 0; for (const u of S.units) if (fix720(u)) n++; try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fix720(d)){ dc = true; n++; } if (dc) saveMyDesigns(mine); } catch (e) {}
  S.v720k = true; if (n) setTimeout(() => { save(); toast(`1층 검기사의 투구를 뺐어요 (${n}곳 — 이제 검기사만 투구가 없음)`); }, 2300); }
// v7.19.2 딸기 (한 번): 역장 · 뿌리 벽 · [열매 맺기]""")

# ---------- 배치 상세: 소지품 ----------
rep("function renderSel(){", r"""// v7.20 소지품 (배치): 장비 네 칸 (무기 · 방패 · 몸 · 머리) + 가방 칩 — 칩을 누르면 끼우기 · 넘겨주기 · 버리기, 장비 칸을 누르면 벗기 (가방으로)
let invPick = null;   // { id, at: 'bag' | 'eq', i, sl }
const INV_IC = { weapon: '🗡', shield: '🛡', armor: '🥋', helm: '⛑', ammo: '➶' };
const durBar = d => d == null ? '' : `<i class="dur${d <= 0 ? ' z' : d < 25 ? ' lo' : ''}" style="--d:${Math.max(0, Math.min(100, Math.round(d)))}%" title="내구도 ${Math.round(d)}"></i>`;
const itName = it => it.k === 'ammo' ? `${it.at} 탄 ${it.n}` : it.label || it.name;
const invEq = p => [['weapon', p.weapon && !ITEM_NATURAL.includes(p.weapon) && (rules.weapons[p.weapon] || {}).kind !== '마법' ? { k: 'weapon', name: p.weapon, label: p.wName || '', dur: p.wDur != null ? p.wDur : 100 } : null, '무기'],
  ['shield', p.shield ? { k: 'shield', name: '방패', label: p.sName || '', dur: p.sDur != null ? p.sDur : 100 } : null, '방패'],
  ['몸', (p.gear || {})['몸'] ? { k: 'armor', ...p.gear['몸'] } : null, '몸'], ['머리', (p.gear || {})['머리'] ? { k: 'helm', ...p.gear['머리'] } : null, '머리']];
const bagWpns = p => (p.bag || []).filter(x => x.k === 'weapon').length + (p.weapon && !ITEM_NATURAL.includes(p.weapon) ? 1 : 0);
const bagRoom = (p, it) => { const E = eqRuleP(rules, p) || {}; if ((p.bag || []).length >= bagCapP(rules, p)) return '가방이 가득'; if (it && it.k === 'weapon' && E.wmax && bagWpns(p) >= E.wmax) return '무기는 ' + E.wmax + '개까지'; return ''; };
function takeOff(p, sl){
  if (sl === 'weapon'){ const wp = rules.weapons[p.weapon] || {}, it = { k: 'weapon', name: p.weapon, label: p.wName || '', dur: p.wDur != null ? p.wDur : 100, ...(p.wOwn ? { own: p.wOwn } : {}), ...(isRangedW(wp) && p.ammo != null ? { ammo: p.ammo } : {}) };
    p.weapon = p.natW || '맨손'; if (p.natRng != null){ p.ov = p.ov || {}; p.ov.rng = p.natRng; } delete p.wName; delete p.wDur; delete p.wOwn; delete p.ammo; return it; }
  if (sl === 'shield'){ const it = { k: 'shield', name: '방패', label: p.sName || '', dur: p.sDur != null ? p.sDur : 100, ...(p.sOwn ? { own: p.sOwn } : {}) }; p.shield = false; delete p.sName; delete p.sDur; delete p.sOwn; return it; }
  const g = (p.gear || {})[sl]; if (!g) return null; delete p.gear[sl]; return { k: sl === '몸' ? 'armor' : 'helm', ...g, dur: g.dur != null ? g.dur : 100 };
}
function putOn(p, it){
  if (it.k === 'weapon'){ let old = null; if (p.weapon && !ITEM_NATURAL.includes(p.weapon)) old = takeOff(p, 'weapon'); else { p.natW = p.weapon || '맨손'; if (p.ov && p.ov.rng != null) p.natRng = p.ov.rng; }
    p.weapon = it.name; if (it.label) p.wName = it.label; else delete p.wName; p.wDur = it.dur != null ? it.dur : 100; if (it.own) p.wOwn = it.own; else delete p.wOwn;
    if (isRangedW(rules.weapons[it.name] || {}) && it.ammo != null) p.ammo = it.ammo; else delete p.ammo; if (p.ov) delete p.ov.rng; return old; }
  if (it.k === 'shield'){ p.shield = true; if (it.label) p.sName = it.label; p.sDur = it.dur != null ? it.dur : 100; if (it.own) p.sOwn = it.own; return null; }
  const sl = it.k === 'armor' ? '몸' : '머리', old = (p.gear || {})[sl] ? takeOff(p, sl) : null; p.gear = p.gear || {};
  p.gear[sl] = { name: it.name || it.mat, mat: it.mat, tier: it.tier || 2, dur: it.dur != null ? it.dur : 100, ...(it.size ? { size: it.size } : {}), ...(it.own ? { own: it.own } : {}) }; return old;
}
function invAct(p, a){
  const pk = invPick; if (!pk || pk.id !== p.id) return; p.bag = p.bag || [];
  if (a === 'drop' && pk.at === 'bag'){ const it = p.bag.splice(pk.i, 1)[0]; invPick = null; changed(); if (it) toast(`${itName(it)} — 버렸어요`); return; }
  if (a === 'unequip' && pk.at === 'eq'){ const it0 = invEq(p).find(x => x[0] === pk.sl), why = bagRoom(p, it0 && it0[1]); if (why){ toast(why); return; } const it = takeOff(p, pk.sl); if (it) p.bag.push(it); invPick = null; changed(); return; }
  if (a === 'equip' && pk.at === 'bag'){ const it = p.bag[pk.i], why = it ? wearWhy(rules, p, it) : '없음'; if (why){ toast(why); return; } p.bag.splice(pk.i, 1); const old = putOn(p, it); if (old) p.bag.splice(pk.i, 0, old); invPick = null; changed(); toast(`${p.name} — ${itName(it)} 끼움${old ? ' (' + itName(old) + ' 는 가방에)' : ''}`); return; }
}
function invGive(p, qid){
  const pk = invPick, q = S.units.find(x => String(x.id) === String(qid)); if (!pk || pk.at !== 'bag' || !q || !p.bag || !p.bag[pk.i]) return;
  const it = p.bag[pk.i], why = bagRoom(q, it); if (why){ toast(`${q.name}: ${why}`); return; }
  p.bag.splice(pk.i, 1); (q.bag = q.bag || []).push(it); invPick = null; changed(); toast(`${itName(it)} → ${q.name}의 가방`);
}
const INV_ADD = () => [...Object.keys(rules.weapons).filter(w => !ITEM_NATURAL.includes(w) && rules.weapons[w].kind !== '마법').map(w => ['w:' + w, '🗡 ' + w]), ['s', '🛡 방패'],
  ...Object.keys(rules.armor || {}).map(m => [(rules.armor[m].slot || '몸') === '머리' ? 'h:' + m : 'a:' + m, (rules.armor[m].slot === '머리' ? '⛑ ' : '🥋 ') + m + ' 2성']), ['m:일반', '➶ 일반 탄 20'], ['m:특수', '➶ 특수 탄 8'], ['m:화살', '➶ 화살 30']];
function invAdd(p, v){
  if (!v) return; const [k, x] = v.split(':'), ST = (rules.inv || {}).stack || {};
  const it = k === 'w' ? { k: 'weapon', name: x, label: '', dur: 100 } : k === 's' ? { k: 'shield', name: '방패', label: '', dur: 100 } : k === 'a' ? { k: 'armor', name: x + ' 갑옷', mat: x, tier: 2, dur: 100 } : k === 'h' ? { k: 'helm', name: x, mat: x, tier: 2, dur: 100 } : { k: 'ammo', at: x, n: ST[x] || 20 };
  const why = bagRoom(p, it); if (why){ toast(why); renderSel(); return; }
  (p.bag = p.bag || []).push(it); changed();
}
function invHtml(p){
  const bag = p.bag || [], cap = bagCapP(rules, p), E = eqRuleP(rules, p) || {}, pk = invPick && invPick.id === p.id ? invPick : null;
  const eq = invEq(p).map(([sl, it, lb]) => `<button type="button" class="ivs${pk && pk.at === 'eq' && pk.sl === sl ? ' on' : ''}" data-ieq="${sl}" ${it ? '' : 'disabled'}><small>${lb}</small>${it ? `<span>${INV_IC[it.k]} ${esc(itName(it))}</span>${durBar(it.dur)}` : '<em>비었음</em>'}</button>`).join('');
  const chips = bag.map((it, i) => `<button type="button" class="ivc${pk && pk.at === 'bag' && pk.i === i ? ' on' : ''}" data-ibag="${i}"><span>${INV_IC[it.k] || '·'} ${esc(itName(it))}</span>${it.k === 'ammo' ? '' : durBar(it.dur)}</button>`).join('');
  let act = '';
  if (pk && pk.at === 'bag' && bag[pk.i]){ const it = bag[pk.i], why = wearWhy(rules, p, it), mates = S.units.filter(q => q !== p && q.side === p.side);
    act = `<div class="iva">${it.k !== 'ammo' ? `<button type="button" class="btn go" data-iact="equip" ${why ? 'disabled' : ''}>끼우기</button>${why ? `<small class="why">${esc(why)}</small>` : ''}` : `<small class="why">${esc(why)}</small>`}${mates.map(q => { const w = bagRoom(q, it); return `<button type="button" class="btn" data-igive="${esc(String(q.id))}" ${w ? `disabled title="${esc(w)}"` : ''}>${esc(q.name)}에게</button>`; }).join('')}<button type="button" class="btn warn" data-iact="drop">버리기</button></div>`; }
  if (pk && pk.at === 'eq'){ const it0 = invEq(p).find(x => x[0] === pk.sl), w = bagRoom(p, it0 && it0[1]); act = `<div class="iva"><button type="button" class="btn" data-iact="unequip" ${w ? 'disabled' : ''}>벗기 (가방으로)</button>${w ? `<small class="why">${esc(w)}</small>` : ''}</div>`; }
  return `<div class="inv"><div class="ivh"><b>소지품</b> <small>가방 ${bag.length}/${cap}칸${E.wmax ? ' · 무기 ' + bagWpns(p) + '/' + E.wmax + '개' : ''}${E.body === false ? ' · 몸 갑옷 못 입음' : ''}${E.ranged === false ? ' · 원거리 못 씀' : ''} — 싸우다 탄이 떨어지거나 무기를 잃으면 가방에서 꺼냄</small></div><div class="ivr">${eq}</div><div class="ivr">${chips || '<em class="ivn">가방이 비었음</em>'}</div>${act}<div class="ivr"><select data-iadd="1" aria-label="가방에 넣기"><option value="">+ 가방에 넣기…</option>${INV_ADD().map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select></div></div>`;
}
function renderSel(){""")
rep("    <div class=\"grid6\">${f('hp', '체력')}", "    ${invHtml(p)}\n    <div class=\"grid6\">${f('hp', '체력')}")
rep("  if (e.target.id === 'ovClear'){ p.ov = {}; changed(); }", """  { const ib = e.target.closest('[data-ibag]'), ie = e.target.closest('[data-ieq]'), ia = e.target.closest('[data-iact]'), ig = e.target.closest('[data-igive]');   // v7.20 소지품
    if (ib){ const i = +ib.dataset.ibag; invPick = invPick && invPick.id === p.id && invPick.at === 'bag' && invPick.i === i ? null : { id: p.id, at: 'bag', i }; renderSel(); return; }
    if (ie){ const sl = ie.dataset.ieq; invPick = invPick && invPick.id === p.id && invPick.at === 'eq' && invPick.sl === sl ? null : { id: p.id, at: 'eq', sl }; renderSel(); return; }
    if (ia){ invAct(p, ia.dataset.iact); return; } if (ig){ invGive(p, ig.dataset.igive); return; } }
  if (e.target.id === 'ovClear'){ p.ov = {}; changed(); }""")
rep("  if (e.target.id === 'selTier'){ p.tier = +e.target.value; changed(); return; }", "  if (e.target.dataset.iadd){ invAdd(p, e.target.value); return; }   // v7.20 가방에 넣기\n  if (e.target.id === 'selTier'){ p.tier = +e.target.value; changed(); return; }")

# ---------- 판 위 상세: 소지품 · 내구도 · 들기 ----------
rep("    ${!ed && pickedOf(u) && known ?", """    ${known && !ed && (u.side === 0 || see || u.seenBy) && ((u.bag || []).length || u.wDur < 100 || u.wName || (u.shield && u.sDur < 100)) ? `<span class="tr"><span class="lb">소지품</span> ${invLine(Wd, u)}</span>` : ''}
    ${!ed && pickedOf(u) && known ?""")
rep("${k} ${esc(u.gear[k].name)} ${u.gear[k].tier}성 (${esc(u.gear[k].mat)})", "${k} ${esc(u.gear[k].name)} ${u.gear[k].tier}성 (${esc(u.gear[k].mat)})${u.gear[k].dur != null && u.gear[k].dur < 100 && !u.gear[k].innate ? (u.gear[k].dur <= 0 ? ' 망가짐' : ' 내구 ' + Math.round(u.gear[k].dur)) : ''}")
rep("function unitDetailHtml(Wd, u){", """// v7.20 판 위 소지품 한 줄: 든 것의 내구도 + 가방 (아군은 '들기' — 명령이라 닿아야 함)
function invLine(Wd, u){
  const wl = u.weaponGone ? '' : `${esc(u.wName || u.weapon || '')}${u.wDur != null && u.wDur < 100 && !ITEM_NATURAL.includes(u.weapon || '') ? ' 내구 ' + Math.round(u.wDur) : ''}${u.wForeign ? ' (남의 것)' : ''}`;
  const sl = u.shield && !u.armShield ? ` · ${esc(u.sName || '방패')}${u.sDur < 100 ? ' 내구 ' + Math.round(u.sDur) : ''}` : '';
  const bag = (u.bag || []).map(it => `<span class="ivi">${INV_IC[it.k] || '·'} ${esc(itName(it))}${it.k !== 'ammo' && it.dur != null && it.dur < 100 ? ' ' + Math.round(it.dur) : ''}${u.side === 0 && u.alive && !Wd.over && (it.k === 'weapon' || it.k === 'shield') ? ` <button type="button" class="ivb" data-bswap="${it.uid}" data-u="${u.i}" ${canHold(Wd, u, it) ? '' : 'disabled'}>들기</button>` : ''}</span>`).join(' ');
  return `${wl ? '든 것 ' + wl : ''}${sl}${(u.bag || []).length ? ` · 가방 ${(u.bag || []).length}/${u.bagCap || bagCapOf(Wd, u)} ${bag}` : ''}`;
}
function unitDetailHtml(Wd, u){""")
rep("// 줍기 명령: 고른 아군 중 집어 들 수 있는 가장 가까운 쪽이 그 물건을 주우러 감", """// v7.20 상세 창의 '들기': 가방의 무기 · 방패를 꺼내 듦 (명령 — 지휘가 닿아야 함)
$('det').addEventListener('click', e => { const b = e.target.closest('[data-bswap]'); if (!b || b.disabled || !world || world.over || mode === 'edit') return;
  const u = world.units[+b.dataset.u], it = u && (u.bag || []).find(x => x.uid === +b.dataset.bswap); if (!u || u.side !== 0 || !u.alive || !it) return;
  u.order = { k: 'swap', uid: it.uid }; noteOrders([u]); toast(`${u.name} — 가방에서 ${itName(it)} 꺼내 듦`); hud(); });
// 줍기 명령: 고른 아군 중 집어 들 수 있는 가장 가까운 쪽이 그 물건을 주우러 감""")

# ---------- 떨어진 물건: 이름 · 내구도 ----------
rep("<div><b>${esc(it.name)}</b><div class=\"sub\">땅에 떨어진 ${it.k === 'shield' ? '방패' : '무기'}", "<div><b>${esc(it.label || it.name)}</b><div class=\"sub\">땅에 떨어진 ${it.k === 'shield' ? '방패' : '무기'}${it.label && it.label !== it.name && it.k !== 'shield' ? ' (' + esc(it.name) + ')' : ''}${it.dur != null && it.dur < 100 ? ' · 내구 ' + Math.round(it.dur) : ''}")
rep('<span class="tr lb">투구 · 갑옷은 나중에 (루팅)</span>', '<span class="tr lb">줍는 쪽 가방에 자리가 있으면 들던 무기는 가방으로 · 투구 · 갑옷은 싸우는 중엔 못 갈아입음</span>')

# ---------- 로그 ----------
rep("      case 'grab': out.push(", """      case 'bagSwap': out.push(`${T(e)}🎒 ${n(e.a)} 가방에서 ${e.w}${e.sh ? ' + ' + e.sh : ''} 꺼내 듦${e.from ? ' (' + e.from + ' 은 가방에)' : ''}${e.why ? ' — ' + e.why : ''}`); break;   // v7.20 소지품
      case 'bagAmmo': out.push(`${T(e)}🎒 ${n(e.a)} 가방에서 ${e.at} 탄 ${e.n}발을 꺼내 채움 (가방에 ${e.left} 남음)`); break;
      case 'stow': out.push(`${T(e)}🎒 ${n(e.a)} ${reul(e.w)} 가방에 넣음`); break;
      case 'wBreak': out.push(`${T(e)}💥 ${n(e.a)}의 ${ga(e.w)} 부러짐${e.why ? ' (' + e.why + ')' : ''} — 맨손`); break;
      case 'sBreak': out.push(`${T(e)}💥 ${n(e.a)}의 ${ga(e.name)} 부서짐${e.b != null ? ' (' + n(e.b) + '의 일격)' : ''} — 방패를 잃음`); break;
      case 'aBreak': out.push(`${T(e)}💥 ${n(e.a)}의 ${e.slot} ${ga(e.name)} 망가짐 — 이제 막지 못함`); break;
      case 'grab': out.push(""")
rep("      case 'drop': out.push(`${T(e)}${n(e.a)} ${e.name} 떨어뜨림", "      case 'drop': out.push(`${T(e)}${n(e.a)} ${e.label || e.name} 떨어뜨림")
rep("out.push(`${T(e)}✋ ${n(e.a)} ${e.name} ${e.own ? '다시 ' : ''}주움", "out.push(`${T(e)}✋ ${n(e.a)} ${e.label || e.name} ${e.own ? '다시 ' : ''}주움")
rep("    case 'grab': return { c: U(e.a).side ? 'bad' : 'good',", """    case 'wBreak': return { c: U(e.a).side ? 'good' : 'bad', s: `쩡 — ${n(e.a)}의 ${ga(e.w)} 부러져 나간다!` };   // v7.20
    case 'sBreak': return { c: U(e.a).side ? 'good' : 'bad', s: `${n(e.a)}의 방패가 산산이 부서진다!` };
    case 'bagSwap': return e.vis ? { c: 'dim', s: `${ga(n(e.a))} 등에 멘 ${reul(e.w)} 뽑아 든다.` } : null;
    case 'grab': return { c: U(e.a).side ? 'bad' : 'good',""")

# ---------- 명령 · 동작 이름 ----------
rep("const ordOf = u => u.order && u.order.k === 'supp' && u.order.arc ?", "const ordOf = u => u.order && u.order.k === 'swap' ? ['swap', u.order.uid] : u.order && u.order.k === 'supp' && u.order.arc ?")
rep("  if (o[0] === 'hold') return '제자리';", "  if (o[0] === 'hold') return '제자리';\n  if (o[0] === 'swap') return '가방에서 꺼내 듦';   // v7.20")
rep("  return !o ? ['자동', '#d8cfc0'] :", "  return !o ? ['자동', '#d8cfc0'] : o.k === 'swap' ? ['🎒 꺼내 듦', '#e6d3a3'] :")
rep("  if (a.k === 'reload') return `재장전 (${f2(a.left)}초)`;", "  if (a.k === 'reload') return `재장전 (${f2(a.left)}초)`;\n  if (a.k === 'bagSwap') return `가방에서 꺼내는 중 (${f2(a.left)}초)`;   // v7.20\n  if (a.k === 'bagAmmo') return `가방에서 탄을 꺼내는 중 (${f2(a.left)}초)`;")

# ---------- 모양 ----------
rep("</style>", """/* v7.20 소지품 */
.inv{border:1px solid var(--line);border-radius:8px;padding:6px 8px;margin:6px 0;display:flex;flex-direction:column;gap:6px}
.inv .ivh small{color:var(--dim)}
.inv .ivr{display:flex;flex-wrap:wrap;gap:6px}
.inv .ivs,.inv .ivc{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-height:40px;min-width:76px;max-width:100%;padding:4px 8px 7px;border-radius:7px;border:1px solid var(--line);background:var(--well);color:var(--fg);font:inherit;font-size:12px;cursor:pointer;text-align:left}
.inv .ivs small{font-size:10px;color:var(--dim)}
.inv .ivs em,.inv .ivn{font-style:normal;color:var(--dim);font-size:12px}
.inv .ivs.on,.inv .ivc.on{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent) inset}
.inv .ivs[disabled]{opacity:.55;cursor:default}
.inv .iva{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.inv .iva .why{color:var(--foe)}
.inv select{min-height:36px;max-width:100%}
i.dur{position:absolute;left:6px;right:6px;bottom:3px;height:3px;border-radius:2px;background:var(--line);overflow:hidden}
i.dur::after{content:"";position:absolute;left:0;top:0;bottom:0;width:var(--d);background:var(--heal)}
i.dur.lo::after{background:var(--accent)}
i.dur.z::after{background:var(--foe)}
.ivi{display:inline-flex;align-items:center;gap:4px;margin:2px 4px 2px 0}
.ivb{min-height:30px;padding:2px 8px;border-radius:6px;border:1px solid var(--line);background:var(--panel);color:var(--fg);font:inherit;font-size:12px;cursor:pointer}
.ivb[disabled]{opacity:.5;cursor:default}
</style>""")

open(F, 'w', encoding='utf-8').write(s)
print('page720 OK')
