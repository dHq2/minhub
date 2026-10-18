import sys
p='page10.tpl.html'; s=open(p,encoding='utf-8').read()
def rep(o,n,c=1):
    global s
    k=s.count(o)
    if k!=c: print('MISMATCH',k,o[:110]); sys.exit(1)
    s=s.replace(o,n)
# CSS
rep(""".dgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:6px}""",""".dgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:6px}
.dsl{display:flex;flex-direction:column;gap:4px;min-width:0}
.dsl .dc{height:100%}
.dsl.on .dc{border-color:#d9a94e;box-shadow:inset 0 0 0 1px #d9a94e}
.dsl.f .dc .n{color:#ffb8a8}
.dsl .dc .n i{font-style:normal;color:#d9a94e;font-size:9px;vertical-align:middle}
.btn.sm{padding:3px 8px;font-size:11.5px}
.xo{display:inline-block;margin-left:4px;padding:0 5px;border-radius:4px;background:rgba(255,120,95,.18);color:#ffb8a8;cursor:pointer;font-weight:700}
.xo:hover{background:rgba(255,120,95,.38)}""")
# 판 위 방어구 아이콘
rep("""function iconShield(x, y, s, col, fill){""","""// v5.1 방어구 아이콘: 몸 (흉갑) · 머리 (투구) + 등급 숫자. 재질마다 색, [갑피] 는 살빛
function gearBadge(x, y, s, tier){ ctx.font = `700 ${Math.max(8, s * 1.05)}px IBM Plex Mono, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(10,8,12,.9)'; ctx.fillRect(x + s * 0.35, y + s * 0.2, s * 0.95, s * 0.95); ctx.fillStyle = '#f1d27a'; ctx.fillText(String(tier), x + s * 0.83, y + s * 0.7); }
function iconArmor(x, y, s, col, tier){
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(10,8,12,.85)'; ctx.beginPath(); ctx.arc(0, 0, s, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-s * 0.66, -s * 0.48); ctx.lineTo(-s * 0.24, -s * 0.62); ctx.lineTo(0, -s * 0.42); ctx.lineTo(s * 0.24, -s * 0.62); ctx.lineTo(s * 0.66, -s * 0.48); ctx.lineTo(s * 0.5, s * 0.08); ctx.lineTo(s * 0.4, s * 0.62); ctx.lineTo(-s * 0.4, s * 0.62); ctx.lineTo(-s * 0.5, s * 0.08); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); gearBadge(x, y, s, tier);
}
function iconHelm(x, y, s, col, tier){
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(10,8,12,.85)'; ctx.beginPath(); ctx.arc(0, 0, s, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-s * 0.6, s * 0.55); ctx.lineTo(-s * 0.6, 0); ctx.arc(0, 0, s * 0.6, Math.PI, 0); ctx.lineTo(s * 0.6, s * 0.55); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = 'rgba(10,8,12,.95)'; ctx.lineWidth = Math.max(1.2, s * 0.16); ctx.beginPath(); ctx.moveTo(-s * 0.42, s * 0.12); ctx.lineTo(s * 0.42, s * 0.12); ctx.stroke(); ctx.restore(); gearBadge(x, y, s, tier);
}
function iconShield(x, y, s, col, fill){""")
rep("""    if (!ed && u.act){ const a = u.act, span = a.phase === 'wind' ? a.end - a.t0 : a.end - a.t1,""","""    // v5.1 방어구 (몸 · 머리): 오른쪽 가운데. 적은 보일 때
    if (vis && ts >= 26 && u.gear){ const gs = Math.max(5.5, Math.min(9, r * 0.3)), gx = px + r + gs * 0.55;
      if (u.gear['머리']){ const it = u.gear['머리']; iconHelm(gx, py - gs * 1.05, gs, it.innate ? '#e6b98c' : MAT_IC[it.mat] || '#d8dde6', it.tier); }
      if (u.gear['몸']){ const it = u.gear['몸']; iconArmor(gx, py + gs * 1.05, gs, it.innate ? '#e6b98c' : MAT_IC[it.mat] || '#d8dde6', it.tier); } }
    if (!ed && u.act){ const a = u.act, span = a.phase === 'wind' || a.phase === 'run' ? a.end - a.t0 : a.end - a.t1,""")
# 판 위 탄약: 탄창
rep("""const t = u.ammo ? '탄' + u.ammo : '탄0',""","""const t = u.magMax ? '탄' + u.mag + '·' + u.ammo : u.ammo ? '탄' + u.ammo : '탄0',""")
# 카드 · 설명 상자
rep("""${u.skill ? ' · 약 ' + u.skill.left : ''}${u.ammo != null ? ' · 탄 ' + u.ammo + '/' + u.ammoMax : ''}""","""${u.skill ? (u.skill.kit ? ' · 구급 ' : ' · 약 ') + u.skill.left : ''}${u.ammo != null ? ' · 탄 ' + (u.magMax ? `${u.mag}/${u.magMax} (${u.ammo})` : u.ammo + '/' + u.ammoMax) : ''}${u.gear && Object.keys(u.gear).length ? ' · ' + GEAR_SLOTS.filter(k => u.gear[k]).map(k => (k === '몸' ? '갑' : '투') + u.gear[k].tier).join('') : ''}""")
rep("""    ${u.ammo != null && known ? `<span class="tr"><span class="lb">탄약</span> ${u.ammo}/${u.ammoMax}""","""    ${u.gear && Object.keys(u.gear).length && known ? `<span class="tr"><span class="lb">방어구</span> ${GEAR_SLOTS.filter(k => u.gear[k]).map(k => `${k} ${esc(u.gear[k].name)} ${u.gear[k].tier}성 (${esc(u.gear[k].mat)})`).join(' · ')}${gearW(u.gear, Wd.rules) ? ` · 무게 −${Math.round(gearW(u.gear, Wd.rules) * 100)}%` : ''} — 몸: 날붙이 ×${armorMul(Wd.rules, u, '몸', '날붙이').m.toFixed(2)} · 둔기 ×${armorMul(Wd.rules, u, '몸', '둔기').m.toFixed(2)} · 화살 ×${armorMul(Wd.rules, u, '몸', '활').m.toFixed(2)} · 총 ×${armorMul(Wd.rules, u, '몸', '총포류').m.toFixed(2)}${u.gear['머리'] ? ` · 머리: 날붙이 ×${armorMul(Wd.rules, u, '머리', '날붙이').m.toFixed(2)} · 둔기 ×${armorMul(Wd.rules, u, '머리', '둔기').m.toFixed(2)}` : ''}</span>` : ''}
    <span class="tr"><span class="lb">몸</span> 키 ${u.h}m${u.h >= 2.2 ? ' (큰 몸 — 1M 넘게 작은 쪽은 이 너머를 못 봄)' : ''} · ${u.human ? '일반 인간계 사람 — 총에 그대로 다침' : '굴의 몸 — 총 피해 ×' + Wd.rules.gunTough}${u.modBody ? ' · 개조된 신체 (받는 피해 ×' + (Wd.rules.modBody || {}).dmg + ')' : ''}${u.undying ? ' · 불사' : ''}</span>
    ${u.ammo != null && known ? `<span class="tr"><span class="lb">탄약</span> ${u.magMax ? `탄창 ${u.mag}/${u.magMax} · 남은 탄 ${u.ammo}/${u.ammoMax} · 재장전 ${(Wd.rules.weapons[u.weapon] || {}).reload || 2}초${(Wd.rules.weapons[u.weapon] || {}).burst ? ' · 점사 ' + Wd.rules.weapons[u.weapon].burst + '발 (가끔 ' + Wd.rules.weapons[u.weapon].burstMax + '발)' : ''}` : `${u.ammo}/${u.ammoMax}`}""")
rep("""    ${u.skill ? `<span class="tr"><i>[${esc(u.skill.name)}]</i> 남은""","""    ${u.skill && u.skill.kit ? `<span class="tr"><i>[${esc(u.skill.name)}]</i> 구급상자 ${u.skill.left}/${u.skill.pool} · 한 번에 최대 체력의 ${Math.round(u.skill.pct * 100)}% · 쓰고 나면 ${u.skill.cd}초 대기 · 동료 체력 ${Math.round((u.skill.auto != null ? u.skill.auto : Wd.rules.bucketAuto) * 100)}% 아래면 스스로 · 쓰러진 [불사] 동료는 바로 일으킴</span>` : ''}
    ${u.skill && !u.skill.kit ? `<span class="tr"><i>[${esc(u.skill.name)}]</i> 남은""")
# 행동 이름
rep("""  const b = Wd.units[a.b];
  if (a.k === 'skill')""","""  const b = Wd.units[a.b];
  if (a.k === 'reload') return `재장전 (${f2(a.left)}초)`;
  if (a.k === 'leap') return '뒤로 도약';
  if (a.k === 'charge') return `돌진 → ${b ? b.name : ''}`;
  if (a.k === 'skill')""")
rep("""'치고 나감': '치고 나감', '돌파': '돌파', '빠져나감': '빠져나감', '마무리': '마무리' };""","""'치고 나감': '치고 나감', '돌파': '돌파', '빠져나감': '빠져나감', '마무리': '마무리', '재장전': '재장전', '뒤로 도약': '뒤로 도약', '돌진': '돌진!', '구급상자 준비': '구급상자 준비' };""")
# 이야기
rep("""    case 'skill': return { c: 'good', s: `${ga(n(e.a))} 양동이의 약을""","""    case 'skill': if (e.kit) return { c: 'good', s: `${ga(n(e.a))} 구급상자로 ${e.revive ? `쓰러진 ${reul(n(e.b))} 일으킨다` : n(e.b) + '의 상처를 싸맨다'} (+${e.amt}, 남은 구급상자 ${e.left}).` };
      return { c: 'good', s: `${ga(n(e.a))} 양동이의 약을""")
rep("""    case 'die': return U(e.b).side === 1 ?""","""    case 'down': return { c: U(e.b).side ? 'good' : 'dim', s: `${ga(n(e.b))} 쓰러진다… 그러나 [불사] — ${e.rise}초 뒤 다시 일어난다.` };
    case 'rise': return U(e.a).side === 0 || e.vis ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 다시 일어난다! (체력 ${e.hp})` } : null;
    case 'reload': return U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} 탄창을 간다.` } : e.vis ? { c: 'good', s: `${ga(n(e.a))} 탄창을 간다 — 틈이다.` } : null;
    case 'burst': return e.vis || U(e.a).side === 0 ? { c: U(e.a).side ? 'bad' : 'good', s: `"드르르륵!" ${ga(n(e.a))} ${reul(n(e.b))} 향해 길게 긁어 쏜다!` } : null;
    case 'leap': return e.vis || U(e.a).side === 0 ? { c: 'dim', s: `${ga(n(e.a))} 뒤로 훌쩍 뛰어 거리를 벌린다.` } : null;
    case 'charge': return e.vis || U(e.a).side === 0 ? { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} 땅을 울리며 ${reul(n(e.b))} 향해 돌진한다!` } : null;
    case 'impact': return { c: U(e.a).side ? 'bad' : 'good', s: `${ga(n(e.a))} ${reul(n(e.b))} 들이받는다${e.block ? ' — 방패가 크게 흔들린다' : ''}${e.broke ? '. 자세가 무너졌다!' : '!'}` };
    case 'equip': return { c: 'dim', s: e.name ? `${ga(n(e.a))} ${e.name} (${e.tier}성) 을 입는다.` : `${ga(n(e.a))} ${e.slot} 방어구를 벗는다.` };
    case 'die': return U(e.b).side === 1 ?""")
rep("""      case 'hold': out.push(""","""      case 'reload': out.push(`${T(e)}${n(e.a)} 재장전 (탄창 ${e.mag} · 남은 탄 ${e.ammo})`); break;
      case 'reloaded': out.push(`${T(e)}${n(e.a)} 재장전 끝 (탄창 ${e.mag} · 남은 탄 ${e.ammo})`); break;
      case 'burst': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 긴 점사 ${e.n}발 "드르르륵!"`); break;
      case 'down': out.push(`${T(e)}${n(e.b)} 쓰러짐 ([불사] — ${e.rise}초 뒤 일어남, ${n(e.a)}의 공격)`); break;
      case 'rise': out.push(`${T(e)}${n(e.a)} 다시 일어남 (체력 ${e.hp})`); break;
      case 'leap': out.push(`${T(e)}${n(e.a)} 뒤로 도약 (${n(e.b)}에게서)`); break;
      case 'charge': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 돌진!`); break;
      case 'impact': out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 들이받음${e.block ? ' (방패로 받음 · 자세 크게 깎임)' : ''}${e.broke ? ' · 자세 무너짐' : ''} · 밀려남 · 움찔`); break;
      case 'equip': out.push(`${T(e)}${n(e.a)} ${e.slot} ${e.name ? e.name + ' ' + e.tier + '성 입음' : '방어구 벗음'}`); break;
      case 'hold': out.push(""")
# 맞음 글: 방어구가 덜어 냄
rep("""v = ` (−${e.dmg}${e.part && e.part !== '몸통' ? ', ' + e.part : ''}${e.dir === 'back' ? ', 뒤' : e.dir === 'side' ? ', 측면' : ''})`;""","""v = ` (−${e.dmg}${e.part && e.part !== '몸통' ? ', ' + e.part : ''}${e.dir === 'back' ? ', 뒤' : e.dir === 'side' ? ', 측면' : ''}${e.armor ? ', ' + e.armor + '이 덜어 냄' : ''})`;""")
# 편집: 야시 C · 방어구 · 키 · 탄약 · 이름 · 설계 저장
rep("""<option value="B" ${p.nvG !== 'A' ? 'selected' : ''}>야시 B (5칸)</option></select>""","""<option value="B" ${p.nvG !== 'A' && p.nvG !== 'C' ? 'selected' : ''}>야시 B (${rules.nvB || 5}칸)</option><option value="C" ${p.nvG === 'C' ? 'selected' : ''}>야시 C (${rules.nvC || 2.5}칸)</option></select>""")
rep("""    <div class="grid6">${f('hp', '체력')}""","""    <div class="row"><label class="brush" for="selName">이름 <input id="selName" type="text" style="width:9em" value="${esc(p.name)}"></label><label class="brush" for="selHeight">키 (m) <input id="selHeight" type="number" min="0.3" max="6" step="0.05" style="width:5em" value="${p.height != null ? p.height : ''}" placeholder="1.7"></label>${(rules.weapons[p.weapon] || {}).rng > 1 ? `<label class="brush" for="selAmmo">탄약 <input id="selAmmo" type="number" min="0" step="1" style="width:5em" value="${p.ammo != null ? p.ammo : ''}" placeholder="${(rules.weapons[p.weapon] || {}).ammo != null ? rules.weapons[p.weapon].ammo : '무한'}"></label>` : ''}</div>
    <div class="row">${GEAR_SLOTS.map(sl => { const it = (p.gear || {})[sl] || {}, mats = Object.keys(rules.armor || {}).filter(m => (rules.armor[m].slot || '몸') === sl);
      return `<span class="brush">${sl === '몸' ? '갑옷 (몸)' : '투구 (머리)'} <select data-gmat="${sl}" aria-label="${sl} 재질"><option value="">없음</option>${mats.map(m => `<option ${it.mat === m ? 'selected' : ''}>${m}</option>`).join('')}</select>${it.mat ? ` <input data-gname="${sl}" type="text" style="width:7em" value="${esc(it.name || '')}" placeholder="이름" aria-label="${sl} 이름"> <select data-gtier="${sl}" aria-label="${sl} 등급">${[1, 2, 3, 4, 5].map(t => `<option value="${t}" ${(+it.tier || 1) === t ? 'selected' : ''}>${t}성</option>`).join('')}</select>` : ''}</span>`; }).join('')}${(p.traits || []).includes('갑피') ? '<span class="brush">[갑피]: 장비가 없어도 판금 · 투구 ' + (rules.galpi || 3) + '성</span>' : ''}</div>
    <div class="grid6">${f('hp', '체력')}""")
rep("""<button class="btn" type="button" id="ovClear">수치 기본값으로</button>""","""<button class="btn" type="button" id="selSaveDesign" title="같은 이름의 칸이 있으면 덮어씀">설계 칸에 저장</button><button class="btn" type="button" id="ovClear">수치 기본값으로</button>""")
rep("""  if (e.target.id === 'ovClear'){ p.ov = {}; changed(); }""","""  if (e.target.id === 'ovClear'){ p.ov = {}; changed(); }
  if (e.target.id === 'selSaveDesign'){ const d = designFromUnit(p), mine = myDesigns(), i = mine.findIndex(x => x.key === d.key), base = DESIGN_DEFAULTS.some(b => b.key === d.key); if (i >= 0) mine[i] = d; else mine.push(d); if (saveMyDesigns(mine)){ renderDesigns(); toast(`'${d.key}' 를 설계 칸에 저장했어요${i >= 0 || base ? ' (덮어씀)' : ''}`); } return; }""")
rep("""  if (e.target.id === 'selCls'){ p.cls = e.target.value; changed(); return; }""","""  if (e.target.id === 'selCls'){ p.cls = e.target.value; changed(); return; }
  if (e.target.id === 'selName'){ const v = e.target.value.trim(); if (v){ p.name = v; changed(); } return; }
  if (e.target.id === 'selHeight'){ const v = e.target.value.trim(); if (v === '' || !(+v > 0)) delete p.height; else p.height = +(+v).toFixed(2); changed(); return; }
  if (e.target.id === 'selAmmo'){ const v = e.target.value.trim(); if (v === '' || !isFinite(+v)) delete p.ammo; else p.ammo = Math.max(0, Math.round(+v)); changed(); return; }
  if (e.target.dataset.gmat){ const sl = e.target.dataset.gmat, m = e.target.value; p.gear = p.gear || {}; if (!m) delete p.gear[sl]; else { const old = p.gear[sl] || {}; p.gear[sl] = { name: old.name && old.mat === m ? old.name : (sl === '머리' ? '투구' : m + ' 갑옷'), mat: m, tier: old.tier || 2 }; } changed(); return; }
  if (e.target.dataset.gname){ const sl = e.target.dataset.gname; if (p.gear && p.gear[sl]){ p.gear[sl].name = e.target.value.trim() || p.gear[sl].mat; changed(); } return; }
  if (e.target.dataset.gtier){ const sl = e.target.dataset.gtier; if (p.gear && p.gear[sl]){ p.gear[sl].tier = +e.target.value; changed(); } return; }""")
# 규칙 탭: 방어구 표 · 기타
rep("""        <div class="box"><p class="lab">역할 (v5.0)""","""        <div class="box"><p class="lab">방어구 재질 (v5.1) — 3성 기준 받는 피해 ×, 등급이 오르면 막는 몫 × 등급/3 · 무게 = 등급 × w (속력에서 뺌)</p><div class="tw"><table class="tbl" id="armorTbl"></table></div></div>
        <div class="box"><p class="lab">몸 · 기술 (v5.1) — 단단함 · 불사 · 거구 · 돌진 · 도약 · 개조된 신체</p><div class="tw"><table class="tbl" id="bodyTbl"></table></div></div>
        <div class="box"><p class="lab">역할 (v5.0)""")
rep("""  $('roleTbl').innerHTML =""","""  const AK = ['날붙이', '둔기', '짐승', '활', '총포류', '마법', '맨손'];
  $('armorTbl').innerHTML = '<thead><tr><th class="l">재질</th><th class="l">칸</th><th>무게 w</th>' + AK.map(k => `<th>${k}</th>`).join('') + '</tr></thead><tbody>' + Object.keys(rules.armor || {}).map(m => { const A = rules.armor[m]; return `<tr><td class="l">${esc(m)}</td><td class="l">${esc(A.slot || '몸')}</td><td>${n(`armor.${m}.w`, A.w, 0.002)}</td>${AK.map(k => `<td>${n(`armor.${m}.vs.${k}`, (A.vs || {})[k] != null ? A.vs[k] : 1, 0.05)}</td>`).join('')}</tr>`; }).join('') + '</tbody>';
  $('bodyTbl').innerHTML = '<tbody>' + [['gunTough', '굴의 몸: 총포류에 맞는 피해 × ([일반인] 은 그대로)'], ['galpi', '[갑피]: 몸 · 머리 방어구 등급'], ['nvC', '야시 C: 어둠 속에서 보는 거리 (칸)'], ['giantBlock', '큰 몸이 시야를 가리는 폭 (몸 반지름 ×)'], ['tallBlock.0', '키 차이 (m): 이보다 작으면 안 가림'], ['tallBlock.1', '키 차이 (m): 이 이상이면 다 가림'],
    ['undying.rise', '[불사]: 일어나기까지 (초)'], ['undying.hp', '[불사]: 일어날 때 체력 비율'], ['undying.regen', '[불사]: 초당 재생 (최대 체력 비율)'], ['modBody.dmg', '[개조된 신체]: 받는 피해 ×'], ['modBody.pin', '[개조된 신체]: 움찔 시간 ×'],
    ['charge.min', '[돌진]: 가장 가까운 거리 (칸)'], ['charge.max', '[돌진]: 가장 먼 거리 (칸)'], ['charge.spd', '[돌진]: 속력 ×'], ['charge.dmg', '[돌진]: 공격 ×'], ['charge.post', '[돌진]: 막은 방패 자세 깎임'], ['charge.push', '[돌진]: 밀치는 거리 (칸)'], ['charge.pin', '[돌진]: 움찔 (초)'], ['charge.cd', '[돌진]: 다시 쓰기 (초)'],
    ['leap.near', '[도약]: 근접 상대가 이 거리 안이면 (칸)'], ['leap.dist', '[도약]: 뛰는 거리 (칸)'], ['leap.time', '[도약]: 걸리는 시간 (초)'], ['leap.cd', '[도약]: 다시 쓰기 (초)']].map(([k, lab]) => { const v = k.split('.').reduce((o, x) => o == null ? o : o[x], rules); return `<tr><td class="l">${lab}</td><td>${n(k, v, Math.abs(v) < 1 ? 0.05 : 0.5)}</td></tr>`; }).join('') + '</tbody>';
  $('roleTbl').innerHTML =""")
rep("""['nvB', '야시 B: 어둠 속에서 보는 거리 (칸, A 는 보는 거리 전부)', 0.5],""","""['nvB', '야시 B: 어둠 속에서 보는 거리 (칸, A 는 보는 거리 전부)', 0.5], ['nvC', '야시 C: 어둠 속에서 보는 거리 (칸)', 0.5],""")
rep("""<th>탄약</th><th>끝 명중</th>""","""<th>탄약</th><th>탄창 · 재장전</th><th>끝 명중</th>""")
rep("""<td>${far ? o(`weapons.${w}.ammo`, W.ammo, 1, '무한') : ''}</td>""","""<td>${far ? o(`weapons.${w}.ammo`, W.ammo, 1, '무한') : ''}</td><td>${far ? o(`weapons.${w}.mag`, W.mag, 1, '없음') + ' ' + o(`weapons.${w}.reload`, W.reload, 0.5, '-') : ''}</td>""")
# 처음 그리기
rep("""renderDraft(); renderChips(); renderRoster(); setSide(1);""","""renderDraft(); renderChips(); renderRoster(); renderDesigns(); setSide(1);""")
open(p,'w',encoding='utf-8').write(s)
print('ok part2')
