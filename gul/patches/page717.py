# v7.17.0 페이지 — page717.py v1.1 (v1.1: palmOn 정의 자리 · 1F 1단계: 궁수 = 궁수의 활 12칸 · 야시 S / 기사 야시 A · 장검 / 레베카의 검 · 영웅 · 노먼 의학 C · 의학 등급 · 체급 · 근력 제한 무기 표시 · 단검 그림 버그 · 팜 버스트 붉은 초상화 · 스텝 · 덮침 로그)
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
import json
F = D + 'page10.tpl.html'
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v7.16.3 (2026-10-17)', '<!-- 굴의 전투판 v7.17.0 (2026-10-18)')
rep('     v7.16.3: ', '''     v7.17.0: 1F 프롤로그 1단계 (설계 design_1F v1.2).
         ① 청광묵 팜 버스트: 마지막 1.4칸은 ×2 로 들러붙음 · 시전 0.25 → 0.2초 · 쓰는 동안 초상화에 붉은 기운.
         ② 기습 가속 (누구나): 근접이 붙기 마지막 1.6칸 — 배후 +25% · 측면 +10% · 들키지 않음 +25% 빨라짐 (피해 보정은 원래대로 배후 > 측면).
         ③ 사이드 · 백스텝 (누구나 · 자동만 · 3초에 한 번): 근접 일격이 떨어지기 직전 0.85칸 비켜섬 — 헛치면 친 쪽에 0.8초 빈틈 (치명 +20% · 거둠 +0.3초). 늦으면 그래도 맞음. 막기를 든 동안 · 제자리 명령 · 사수는 안 함.
         ④ 사격: 이동 사격은 누구나 (나를 겨누는 사수 · 3칸 안의 근접이 있을 때) — 명중 × 사격 등급 (S 0.97 · A 0.88 · B 0.76 · C 0.68 · 없음 0.6). 도약 사격은 사격 A 이상만. 질주 · 서둘러 이동 중엔 누구도 쏘지 않음.
         ⑤ 1F 적: 궁수 = '궁수의 활' (12칸 · 중대형 이상 · 괴력만 당김) · 야시 S. 검방패기사 · 창병 · 검기사 · 곤봉적 야시 A. 검방패기사 · 검기사는 장검.
         ⑥ 몸 리치: 든 근접 무기 (날붙이 · 둔기) 사거리 + 0.25 × (키 − 1.7) (−0.1 ~ +0.25). 레베카는 '레베카의 검' (0.52 — 검이 길지 않음).
         ⑦ 체급: 소형 · 중형 · 중대형 · 대형 · 초대형 (키 · 무게 · 거구로 어림 — 큰 충격에 밀리는 칸 2 · 1 · 0.5). 근력 제한 무기는 무기 칸에 '근력 부족' 으로 보이고 못 주움.
         ⑧ [의학X] (S 1.45 · A 1.3 · B 1.15 · C 1 — 치료량 ×): 노먼 의학 C. [영웅]: 다쳐도 겁먹지 않음 — 레베카.
         ⑨ 고침: 청광묵이 던진 단검이 땅에서 '청광묵의 창' 으로 그려지던 것 → 단검으로.
     v7.16.3: ''')
rep('h1::after{content:" v7.16.3"', 'h1::after{content:" v7.17.0"')
rep('<footer>굴의 전투판 v7.16.3', '<footer>굴의 전투판 v7.17.0')
rep('return `굴의 전투판 v7.16.3 · ${title}', 'return `굴의 전투판 v7.17.0 · ${title}')
rep("copyText('굴의 전투판 v7.16.3 자동 판 기록", "copyText('굴의 전투판 v7.17.0 자동 판 기록")
rep('의 버전 기록에 — v7.16.3 모순 점검 (도감 · 뽑기 · 설명 글) /', '의 버전 기록에 — v7.17.0 1F 1단계 (팜 버스트 · 스텝 · 기습 · 사격 · 궁수 12칸 · 체급 · 리치) / v7.16.3 모순 점검 (도감 · 뽑기 · 설명 글) /')
rep('">v7.16.3 · 모순 점검</span>', '">v7.17.0 · 1F 1단계 (스텝 · 기습 · 궁수 12칸)</span>')
rep("RULES_MIG = '7.16.1'", "RULES_MIG = '7.17.0'")

# ---------- 설계 칸 ----------
rep("ov: { hp: 106 }" if False else "  { key: '노먼', side: 0, ref: 'C-007', name: '노먼', tier: 2, cls: '기동', role: '사수', weapon: '소총', bold: 0.5, rank: '부대장', sq: 'B', height: 1.8, nv: true, nvG: 'A', traits: ['지휘C', '사격A', '베테랑', '은신A'],",
    "  { key: '노먼', side: 0, ref: 'C-007', name: '노먼', tier: 2, cls: '기동', role: '사수', weapon: '소총', bold: 0.5, rank: '부대장', sq: 'B', height: 1.8, nv: true, nvG: 'A', traits: ['지휘C', '사격A', '베테랑', '은신A', '의학C'],")
rep("  { key: '레베카', side: 0, ref: 'C-002', name: '레베카', tier: 2, sm: 1, shield: true, role: '공격수', weapon: '장검', height: 1.6, nv: true, nvG: 'A', traits: ['불사', '재생', '베테랑', '은신C'],",
    "  { key: '레베카', side: 0, ref: 'C-002', name: '레베카', tier: 2, sm: 1, shield: true, role: '공격수', weapon: '레베카의 검', height: 1.6, nv: true, nvG: 'A', traits: ['불사', '재생', '베테랑', '은신C', '영웅'],")
rep("'C-002': { traits: ['불사', '재생', '베테랑'], shield: true, role: '공격수', weapon: '장검',", "'C-002': { traits: ['불사', '재생', '베테랑', '영웅'], shield: true, role: '공격수', weapon: '레베카의 검',")
rep("  { key: '검방패기사', side: 1, ref: 'C-054', name: '검방패기사', tier: 2, height: 2.1,", "  { key: '검방패기사', side: 1, ref: 'C-054', name: '검방패기사', tier: 2, height: 2.1, weapon: '장검', nv: true, nvG: 'A',")
rep("  { key: '창병', side: 1, ref: 'C-053', name: '창병', tier: 2, height: 2.0,", "  { key: '창병', side: 1, ref: 'C-053', name: '창병', tier: 2, height: 2.0, nv: true, nvG: 'A',")
rep("  { key: '궁수', side: 1, ref: 'C-056', name: '궁수', tier: 2, sm: 1.55, role: '사수', ammo: 40, height: 2.0,", "  { key: '궁수', side: 1, ref: 'C-056', name: '궁수', tier: 2, sm: 1.55, role: '사수', weapon: '궁수의 활', ammo: 40, height: 2.0, nv: true, nvG: 'S',")
rep("  { key: '검기사', side: 1, ref: 'C-052', name: '검기사', tier: 2, height: 2.2,", "  { key: '검기사', side: 1, ref: 'C-052', name: '검기사', tier: 2, height: 2.2, weapon: '장검', nv: true, nvG: 'A',")
rep("  { key: '곤봉적', side: 1, ref: 'C-055', name: '곤봉적', tier: 3, height: 2.5,", "  { key: '곤봉적', side: 1, ref: 'C-055', name: '곤봉적', tier: 3, height: 2.5, nv: true, nvG: 'A',")
rep("note: '뒤로 뛰며 단숨에 거리를 벌리는 재빠른 궁수. 화살 넉넉히 (40). 쏘는 상대 · 사수부터' },",
    "note: '뒤로 뛰며 단숨에 거리를 벌리는 재빠른 궁수 (활로 드래곤을 잡던 이들). 궁수의 활 — 12칸 · 중대형 이상 근력이라야 당김. 화살 넉넉히 (40). 쏘는 상대 · 사수부터' },")
# 설계 칸의 적 야시를 도감에서 놓은 것에도
rep("  if (pf.tactic === undefined && d.tactic){ pf.tactic = d.tactic; pf.note = d.note; } }",
    "  if (pf.tactic === undefined && d.tactic){ pf.tactic = d.tactic; pf.note = d.note; }\n  if (d.side === 1 && d.nvG && pf.nv === undefined){ pf.nv = true; pf.nvG = d.nvG; } }   // v7.17 적 야시도")

# ---------- 저장된 판 · 내 설계 · 내 층 (한 번) ----------
rep("// v7.16.3 도감 · 동료 뽑기로 놓였던 아군을 설계대로",
    """// v7.17 1F 1단계 (한 번): 궁수 = 궁수의 활 · 야시 S / 기사 야시 B → A · 검 → 장검 / 레베카 장검 → 레베카의 검 · [영웅] / 노먼 [의학C]
const fix717 = p => { if (!p) return false; let c = false; const tr = p.traits || (p.traits = []);
  if (p.side === 1 && p.ref === 'C-056'){ if (p.weapon === '활' || !p.weapon){ p.weapon = '궁수의 활'; c = true; } if (p.nvG !== 'S'){ p.nv = true; p.nvG = 'S'; c = true; } }
  if (p.side === 1 && ['C-052', 'C-053', 'C-054', 'C-055'].includes(p.ref) && (!p.nv || p.nvG === 'B' || !p.nvG)){ p.nv = true; p.nvG = 'A'; c = true; }
  if (p.side === 1 && ['C-052', 'C-054'].includes(p.ref) && (p.weapon === '검' || !p.weapon)){ p.weapon = '장검'; c = true; }
  if (p.ref === 'C-002' && (p.side || 0) === 0){ if (p.weapon === '장검'){ p.weapon = '레베카의 검'; c = true; } if (!tr.includes('영웅')){ tr.push('영웅'); c = true; } }
  if (p.ref === 'C-007' && (p.side || 0) === 0 && !tr.some(x => /^의학/.test(x))){ tr.push('의학C'); c = true; }
  return c; };
if (!S.v717k){ let n = 0; for (const u of S.units) if (fix717(u)) n++; try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fix717(d)){ dc = true; n++; } if (dc) saveMyDesigns(mine); } catch (e) {}
  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fix717(u)){ fc = true; n++; } if (fc) saveMyFloors(F); } catch (e) {} S.v717k = true;
  if (n) setTimeout(() => { save(); toast(`1F 설정으로 맞췄어요 (${n}곳 — 궁수 12칸 · 야시 · 장검 · 레베카의 검 · 영웅 · 의학)`); }, 1500); }
// v7.16.3 도감 · 동료 뽑기로 놓였던 아군을 설계대로""")

# ---------- 특성 · 등급 ----------
rep("  '망자': '죽은 시대의 망자 — 지치지 않음",
    "  '영웅': '각 부대의 영웅 — 다쳐도 겁먹지 않음 (충동의 두려움 × 0.3) · 끝까지 앞에 섬',   // v7.17\n  '망자': '죽은 시대의 망자 — 지치지 않음")
rep("const GRADE_KEYS = ['속력', '괴력', '지휘', '사격', '회피', '급소', '은신'];", "const GRADE_KEYS = ['속력', '괴력', '지휘', '사격', '회피', '급소', '은신', '의학'];   // v7.17 의학")
rep("const GRADE_RE = /^(속력|괴력|지휘|사격|회피|급소|은신|후각|발화)([SABCDE])$/", "const GRADE_RE = /^(속력|괴력|지휘|사격|회피|급소|은신|후각|발화|의학)([SABCDE])$/")
rep("  const m = /^(속력|괴력|지휘|사격|회피|급소)([SABC])$/.exec(t);",
    "  const m = /^(속력|괴력|지휘|사격|회피|급소|의학)([SABC])$/.exec(t);\n  if (m && m[1] === '의학'){ const k = rules.grades && rules.grades['의학'] ? rules.grades['의학'][m[2]] : 1; return `의학 — 치료량 ×${k} (응급처치의 처음 회복 · 돌봄 · 약)`; }   /* v7.17 */")
# 체급 · 근력 제한
rep("function weaponOk(p, w){\n  const W = rules.weapons[w] || {}, tr = p.traits || [];",
    "/* v7.17 체급 (설계 · 배치 인물): 키 · 무게 · 거구 / 개조된 신체로 어림 */\nconst pSize = p => p.sizeCls || (p.modBody || (p.traits || []).includes('거구') || (p.unique || []).includes('개조된 신체') ? '대형' : (+p.height || 1.7) >= 2 ? '중대형' : ((+p.height || 1.7) < 1.45 || (p.weight > 0 && p.weight < 45)) ? '소형' : '중형');\nconst reqLack = (p, w) => { const W = rules.weapons[w] || {}; return !!W.req && !sizeOK({ sizeCls: pSize(p) }, W.req, (p.traits || []).some(x => /^괴력/.test(x))); };\nfunction weaponOk(p, w){\n  const W = rules.weapons[w] || {}, tr = p.traits || [];\n  if (reqLack(p, w)) return false;")
rep("<select id=\"selWeapon\" aria-label=\"무기\">${Object.keys(rules.weapons).filter(w => weaponOk(p, w) || w === p.weapon).map(w => `<option ${w === p.weapon ? 'selected' : ''} value=\"${esc(w)}\">${esc(w)} · 사거리 ${rules.weapons[w].rng}</option>`).join('')}</select>",
    "<select id=\"selWeapon\" aria-label=\"무기\">${Object.keys(rules.weapons).filter(w => weaponOk(p, w) || w === p.weapon || reqLack(p, w)).map(w => `<option ${w === p.weapon ? 'selected' : ''} ${reqLack(p, w) && w !== p.weapon ? 'disabled' : ''} value=\"${esc(w)}\">${esc(w)} · 사거리 ${rules.weapons[w].rng}${reqLack(p, w) ? ' · 근력 부족 (' + rules.weapons[w].req + ' 이상)' : ''}</option>`).join('')}</select><span class=\"brush\">체급 ${pSize(p)}</span>")
rep("<div class=\"sub\">${u.side ? '적' : '아군'} · ${u.tier}등급 ${esc(u.cls)}", "<div class=\"sub\">${u.side ? '적' : '아군'} · ${u.tier}등급 ${esc(u.cls)} · ${sizeOf(u)}")

# ---------- 단검 그림 버그 ----------
rep("    ctx.strokeStyle = '#d8c8a8'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(p.x - ts * 0.3, p.y + ts * 0.2); ctx.lineTo(p.x + ts * 0.3, p.y - ts * 0.2); ctx.stroke();",
    "    const kn = !!((Wd.rules.weapons || {})[it.name] || {}).thr, sc = kn ? 0.5 : 1;   /* v7.17 던진 단검은 단검으로 (창으로 그려지던 것) */\n    ctx.strokeStyle = kn ? '#5a4f6e' : '#d8c8a8'; ctx.lineWidth = kn ? 3.5 : 2.5; ctx.beginPath(); ctx.moveTo(p.x - ts * 0.3 * sc, p.y + ts * 0.2 * sc); ctx.lineTo(p.x + ts * 0.3 * sc, p.y - ts * 0.2 * sc); ctx.stroke();")
rep("    ctx.fillStyle = o && o.side ? '#ff8a70' : '#8ccaff'; ctx.beginPath(); ctx.moveTo(p.x + ts * 0.3, p.y - ts * 0.2); ctx.lineTo(p.x + ts * 0.2, p.y - ts * 0.24); ctx.lineTo(p.x + ts * 0.24, p.y - ts * 0.12); ctx.closePath(); ctx.fill();",
    "    ctx.fillStyle = o && o.side ? '#ff8a70' : '#8ccaff'; ctx.beginPath(); ctx.moveTo(p.x + ts * 0.3 * sc, p.y - ts * 0.2 * sc); ctx.lineTo(p.x + ts * 0.2 * sc, p.y - ts * 0.24 * sc); ctx.lineTo(p.x + ts * 0.24 * sc, p.y - ts * 0.12 * sc); ctx.closePath(); ctx.fill();")
rep("ctx.fillText(o ? o.name + '의 창' : '창', p.x, p.y + ts * 0.25); } }", "ctx.fillText(o ? o.name + (kn ? '의 단검' : '의 창') : (kn ? '단검' : '창'), p.x, p.y + ts * 0.25); } }")
rep("toast(L.some(u => u.jav) ? '창을 이미 던졌어요 (E 로 줍기)'", "toast(L.some(u => u.jav) ? (L.some(u => isKnife(world, u)) ? '단검을' : '창을') + ' 이미 던졌어요 (E 로 줍기)'")

# ---------- 팜 버스트 붉은 초상화 ----------
rep(".pm.foe .fc{", ".fc.palmOn{box-shadow:0 0 0 2px #ff5a4a,inset 0 0 0 40px rgba(220,30,30,.34)!important}   /* v7.17 팜 버스트 중 */\n.pm.foe .fc{")
rep('<span class="fc" style="${faceCss(faceOf(u.ref), 34)}"></span>', '<span class="fc ${palmOn(Wd, u) ? \'palmOn\' : \'\'}" style="${faceCss(faceOf(u.ref), 34)}"></span>')
rep('<span class="fc" style="${faceCss(faceOf(u.ref), 30)}"></span>', '<span class="fc ${palmOn(Wd, u) ? \'palmOn\' : \'\'}" style="${faceCss(faceOf(u.ref), 30)}"></span>')
s = "// v7.17 팜 버스트 중 (준비 · 마지막 돌입) — 초상화에 붉은 기운\nconst palmOn = (Wd, u) => !!(Wd && u && u.alive && ((u.act && u.act.k === 'palm') || (u.order && u.order.k === 'palm' && Wd.t < (u.lungeT == null ? -9 : u.lungeT))));\n" + s if False else s
rep("const lieChip", "const palmOn = (Wd, u) => !!(Wd && u && u.alive && ((u.act && u.act.k === 'palm') || (u.order && u.order.k === 'palm' && Wd.t < (u.lungeT == null ? -9 : u.lungeT))));   // v7.17 팜 버스트 중 (준비 · 마지막 돌입) — 초상화에 붉은 기운\nconst lieChip")

# ---------- 로그 ----------
rep("      case 'dodge': out.push(`${T(e)}${n(e.a)} 피함 (${n(e.b)}의 ${e.mate ? '휘두르기 — 동료' : '공격'}${e.wall ? ' · 벽을 등지고도' : ''})`); break;",
    "      case 'dodge': out.push(e.step ? `${T(e)}↔ ${n(e.a)} ${e.step === 'side' ? '사이드 스텝' : '백스텝'} (${n(e.b)}의 일격 직전 비켜섬)` : `${T(e)}${n(e.a)} 피함 (${n(e.b)}의 ${e.mate ? '휘두르기 — 동료' : '공격'}${e.wall ? ' · 벽을 등지고도' : ''})`); break;   // v7.17 스텝\n"
    "      case 'lunge': out.push(`${T(e)}⚡ ${n(e.a)} → ${n(e.b)} 덮침 (${e.sd === 'back' ? '배후' : e.sd === 'side' ? '측면' : '정면'}${e.un ? ' · 들키지 않음' : ''} — 마지막 순간 속력 ×${e.mul})`); break;   // v7.17 기습 가속\n"
    "      case 'palmDash': out.push(`${T(e)}💥 ${n(e.a)} → ${n(e.b)} 팜 버스트 — 마지막 순간 ×2 로 들러붙음`); break;   // v7.17")
open(F, 'w', encoding='utf-8').write(s)

O = json.load(open(D + 'oldrules.json', encoding='utf-8'))
O.append([["palm", "wind"], [0.25]])
json.dump(O, open(D + 'oldrules.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('page717 OK')
