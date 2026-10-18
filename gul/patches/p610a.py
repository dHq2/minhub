import re
def rep(path, a, b, n=1):
    s = open(path, encoding='utf8').read(); c = s.count(a)
    assert c == n, (path, a[:80], c); s = s.replace(a, b); open(path, 'w', encoding='utf8').write(s)
P='page10.tpl.html'
# 특성 설명
rep(P, "  '일반인': '일반 인간계 사람", "  '베테랑': '죽은 시대를 살아남은 숙련자 — 막는 재능 0.9 · 막을 때 자세가 덜 깎임 (×0.75) · 자세 회복 ×1.5 · 무너졌다 일어나면 자세 55 · 방패를 빨리 듦 (×0.7) · 움찔 · 휘청 · 넘어짐 ×0.7 · 체력이 15% 아래가 되기 전엔 물러나지 않음',\n  '일반인': '일반 인간계 사람")
# 정체성: 노먼 · 레베카는 베테랑 (카리우스는 아님)
rep(P, "function identityOf(ref){ return ({ 'C-001': { traits: ['일반인'] }, 'C-002': { traits: ['불사', '재생'] },", "function identityOf(ref){ return ({ 'C-001': { traits: ['일반인'] }, 'C-002': { traits: ['불사', '재생', '베테랑'] },")
s=open(P,encoding='utf8').read()
m=re.search(r"'C-007': \{ skill: true \}", s); assert m, 'C-007 identity'
s=s.replace("'C-007': { skill: true }", "'C-007': { skill: true, traits: ['베테랑'] }",1)
open(P,'w',encoding='utf8').write(s)
# 프로필 · 설계 기본값: 인주 체력 85, 노먼 · 레베카 베테랑
rep(P, "  'C-001': { cls: '근접', role: '공격수', weapon: '어부의 창', traits: ['일반인', '지휘B'], height: 1.6,", "  'C-001': { cls: '근접', role: '공격수', weapon: '어부의 창', traits: ['일반인', '지휘B'], ov: { hp: 85 }, height: 1.6,")
rep(P, "  'C-007': { cls: '기동', role: '사수', weapon: '소총', bold: 0.5, traits: ['지휘C', '사격A'],", "  'C-007': { cls: '기동', role: '사수', weapon: '소총', bold: 0.5, traits: ['지휘C', '사격A', '베테랑'],")
rep(P, "  'C-002': { traits: ['불사', '재생'], shield: true,", "  'C-002': { traits: ['불사', '재생', '베테랑'], shield: true,")
rep(P, "{ key: '인주', side: 0, ref: 'C-001', name: '인주', tier: 2, hero: true, cls: '근접', role: '공격수', weapon: '어부의 창', height: 1.6,", "{ key: '인주', side: 0, ref: 'C-001', name: '인주', tier: 2, hero: true, cls: '근접', role: '공격수', weapon: '어부의 창', ov: { hp: 85 }, height: 1.6,")
rep(P, "weapon: '소총', bold: 0.5, height: 1.8, nv: true, nvG: 'A', traits: ['지휘C', '사격A'],", "weapon: '소총', bold: 0.5, height: 1.8, nv: true, nvG: 'A', traits: ['지휘C', '사격A', '베테랑'],")
rep(P, "weapon: '장검', height: 1.6, nv: true, nvG: 'A', traits: ['불사', '재생'],", "weapon: '장검', height: 1.6, nv: true, nvG: 'A', traits: ['불사', '재생', '베테랑'],")
# 적 기사조: 죽은 시대의 베테랑 기사 (키 2m+, 갑옷)
rep(P, "{ key: '검방패기사', side: 1, ref: 'C-054', name: '검방패기사', tier: 2, height: 2.1, gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 2 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 1 } },",
       "{ key: '검방패기사', side: 1, ref: 'C-054', name: '검방패기사', tier: 2, height: 2.1, ov: { hp: 200, atk: 28 }, traits: ['베테랑'], gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 2 } },")
rep(P, "{ key: '창병', side: 1, ref: 'C-053', name: '창병', tier: 2, height: 2.0, traits: ['공통스킬:투창'], gear: { 몸: { name: '사슬 갑옷', mat: '사슬', tier: 2 } },",
       "{ key: '창병', side: 1, ref: 'C-053', name: '창병', tier: 2, height: 2.0, ov: { hp: 150, atk: 34 }, traits: ['공통스킬:투창', '베테랑'], gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 2 }, 머리: { name: '쇠 투구', mat: '투구', tier: 2 } },")
rep(P, "{ key: '궁수', side: 1, ref: 'C-056', name: '궁수', tier: 2, sm: 1.25, role: '사수', ammo: 40, height: 1.9, active: ['도약'], gear: { 몸: { name: '전신 경갑옷', mat: '경갑', tier: 2 }, 머리: { name: '경갑 투구', mat: '투구', tier: 2 } },",
       "{ key: '궁수', side: 1, ref: 'C-056', name: '궁수', tier: 2, sm: 1.25, role: '사수', ammo: 40, height: 2.0, ov: { hp: 150, atk: 30 }, traits: ['베테랑'], active: ['도약'], gear: { 몸: { name: '사슬 갑옷', mat: '사슬', tier: 2 }, 머리: { name: '쇠 투구', mat: '투구', tier: 2 } },")
rep(P, "{ key: '검기사', side: 1, ref: 'C-052', name: '검기사', tier: 2, height: 2.2, tac: '', gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 2 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 1 } },",
       "{ key: '검기사', side: 1, ref: 'C-052', name: '검기사', tier: 2, height: 2.2, ov: { hp: 170, atk: 32 }, traits: ['베테랑'], tac: '', gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 2 } },")
rep(P, "{ key: '곤봉적', side: 1, ref: 'C-055', name: '곤봉적', tier: 3, height: 2.5, ov: { rng: 0.75 }, traits: ['거구', '지휘B'], gear: { 몸: { name: '두꺼운 판금', mat: '판금', tier: 3 }, 머리: { name: '곤봉적 투구', mat: '투구', tier: 2 } },",
       "{ key: '곤봉적', side: 1, ref: 'C-055', name: '곤봉적', tier: 3, height: 2.5, ov: { rng: 0.75, hp: 400, atk: 55 }, traits: ['거구', '지휘B', '베테랑'], gear: { 몸: { name: '두꺼운 판금', mat: '판금', tier: 3 }, 머리: { name: '곤봉적 투구', mat: '투구', tier: 3 } },")
# 이전 (한 번): 저장된 판 · 설계 · 층의 기사조 → 새 값, 인주 85, 노먼 · 레베카 베테랑 (정체성이 붙임)
MIG = r"""// v6.1 죽은 시대의 베테랑 기사조: 저장된 판 · 내 설계 · 저장한 층의 적 기사조를 한 번만 새 값으로 (그 뒤 고치는 건 자유). 인주 체력 85
const VET6 = { 'C-054': { hp: 200, atk: 28, h: 2.1, gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 2 } } },
  'C-052': { hp: 170, atk: 32, h: 2.2, gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 3 }, 머리: { name: '쇠 기사 투구', mat: '투구', tier: 2 } } },
  'C-053': { hp: 150, atk: 34, h: 2.0, gear: { 몸: { name: '판금 갑옷', mat: '판금', tier: 2 }, 머리: { name: '쇠 투구', mat: '투구', tier: 2 } } },
  'C-056': { hp: 150, atk: 30, h: 2.0, gear: { 몸: { name: '사슬 갑옷', mat: '사슬', tier: 2 }, 머리: { name: '쇠 투구', mat: '투구', tier: 2 } } },
  'C-055': { hp: 400, atk: 55, h: 2.5, gear: { 몸: { name: '두꺼운 판금', mat: '판금', tier: 3 }, 머리: { name: '곤봉적 투구', mat: '투구', tier: 3 } } } };
const fixVet6 = p => { if (!p || !p.ref) return false; let ch = false;
  const v = VET6[p.ref]; if (v && p.side === 1){ p.ov = { ...(p.ov || {}), hp: v.hp, atk: v.atk }; if (!(p.height >= v.h)) p.height = v.h; p.gear = clone(v.gear); p.traits = [...new Set([...(p.traits || []), '베테랑'])]; ch = true; }
  if (p.ref === 'C-001' && !(p.ov && p.ov.hp === 85)){ p.ov = { ...(p.ov || {}), hp: 85 }; ch = true; }
  if ((p.ref === 'C-007' || p.ref === 'C-002') && !(p.traits || []).includes('베테랑')){ p.traits = [...(p.traits || []), '베테랑']; ch = true; }
  return ch; };
if (!S.v610){ let n = 0; for (const u of S.units) if (fixVet6(u)) n++;
  try { const mine = myDesigns(); let dc = false; for (const d of mine) if (fixVet6(d)) dc = true; if (dc) saveMyDesigns(mine); } catch (e) {}
  try { const F = myFloors(); let fc = false; for (const f of F) if (f.snap && f.snap.units) for (const u of f.snap.units) if (fixVet6(u)) fc = true; if (fc) saveMyFloors(F); } catch (e) {}
  S.v610 = true; setTimeout(() => { save(); if (n) toast('적 기사조를 죽은 시대의 베테랑으로 (체력 · 공격 · 갑옷 · 키 2m+) · 인주 체력 85 · 노먼 · 레베카 [베테랑]'); }, 1100); }
if (!S.v586){"""
rep(P, "if (!S.v586){", MIG)
