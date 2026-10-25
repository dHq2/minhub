# v9.8.0 페이지 (모바일) — page9210.py v1.1 (v1.1: 우회 · 전열 후퇴도 '⋯ 더' 안으로 · 지휘 거리 원 (외침 · 손짓) 은 지휘망 늘 보기일 때만 · 머리말 긴 글 숨김 / v1.0: 휴대폰 아래 막대 정리 — 늘 보임: 기술 · 공격 이동 · 제자리 · 자동 · 전열 · 🧱 뭉침 · ⚔ 돌격 방식 · 돌격 안 함 · 막기 · 줍기 · 휘두르기 · 태세 · 전우조 · 측면 · 취소 / '⋯ 더' 안: 정찰 · 암살 · 견제 · 지역 · 사주경계 · 은신 · 포복 · 교전금지 / 지움: 횃불 (켬 · 찾기 · 던지기 · 내려놓기) · 희생돌격 · 동시선택 (끌어 네모로 충분) · 긴 안내 글 줄임 / 겹쳐 보기 단추는 휴대폰에서 그림만 / 냄새 부채꼴은 자세히 보기 · 👁 감각을 켰을 때만)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page9200.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)
rep("function renderDock(Wd){", "let dockMore = !!window.__dockMore;   /* v9.8.0 휴대폰 '⋯ 더' */\nfunction renderDock(Wd){")
for a in ("+ (L.some(u => !u.crawl) ? `<button type=\"button\" class=\"db\" data-dk=\"scout\">", "+ (L.some(u => !u.crawl && (u.assnE || 0) > 0", "+ (L.some(u => suppOK(u)) ? `<button type=\"button\" class=\"db\" data-dk=\"supp\">",
          "(L.some(u => suppOK(u) && u.lob)", "+ (L.some(u => (u.stealthE || 0) >= ((Wd.rules.stealth || {}).min || 0)) ? `<button type=\"button\" class=\"db ${L.every(u => u.stealth)", "+ (L.some(u => !u.crawl && !u.modBody) ? `<button type=\"button\" class=\"db ${L.every(u => u.lie)"):
    b = a.replace("(L.some(", "(dockMore && L.some(", 1); rep(a, b)
for a in ("+ (L.some(u => u.torch && !u.crawl) ? `<button type=\"button\" class=\"db\" data-dk=\"flare\">", "+ (L.some(u => u.i === Wd.spareBy) && Wd.spare > 0 ?", "+ (L.length === 1 && !L[0].crawl ? `<button type=\"button\" class=\"db ${sacConf",
          "+ (Wd && !Wd.units.some(u => u.alive && u.side === 0 && u.torch) && torchSrc(Wd).length", "+ (Wd && Wd.units.some(u => u.alive && u.side === 0 && u.torch) ? `<button type=\"button\" class=\"db ${Wd.units.some(u => u.alive && u.side === 0 && u.torch && !u.torchOff) ? 'on' : ''}\" data-dk=\"torchT\">"):
    rep(a, a.replace("+ (", "+ (false && ", 1))
rep("+ `<button type=\"button\" class=\"db\" data-dk=\"watch\"><span class=\"ic\">👁</span>사주경계</button>`", "+ (dockMore ? `<button type=\"button\" class=\"db\" data-dk=\"watch\"><span class=\"ic\">👁</span>사주경계</button>` : '')")
i0 = s.index("+ `<button type=\"button\" class=\"db ${L.every(u => roeOf(Wd, u) === 'hold') ? 'on' : ''}\" data-dk=\"roeH\">"); i1 = s.index("</small></button>`", i0) + len("</small></button>`")
s = s[:i0] + "+ (dockMore ? `" + s[i0 + 3:i1] + " : '')" + s[i1:]
rep("      + `<button type=\"button\" class=\"db ${boxArm ? 'on' : ''}\" data-dk=\"boxsel\"><span class=\"ic\">🔲</span>동시선택</button>`",
    "      + `<button type=\"button\" class=\"db ${dockMore ? 'on' : ''}\" data-dk=\"more\"><span class=\"ic\">⋯</span>${dockMore ? '접기' : '더'}</button>`")
rep("      + `<button type=\"button\" class=\"db\" data-dk=\"line\"><span class=\"ic\">▬</span>전열<small>${melee ? '' : '지원'}</small></button>`",
    "      + `<button type=\"button\" class=\"db\" data-dk=\"line\"><span class=\"ic\">▬</span>전열<small>${melee ? '' : '지원'}</small></button>`\n      + `<button type=\"button\" class=\"db ${L.every(u => u.order && u.order.k === 'clump') ? 'on' : ''}\" data-dk=\"clump\"><span class=\"ic\">🧱</span>뭉침<small>돌격 방어</small></button>`   /* v9.8.0 */\n      + (L.some(u => u.canCharge) ? `<button type=\"button\" class=\"db ${L.find(u => u.canCharge).chgMode ? 'on' : ''}\" data-dk=\"chgmode\"><span class=\"ic\">⚔</span>돌격<small>${({ '': '기본', atk: '공격', def: '방어' })[L.find(u => u.canCharge).chgMode || '']}</small></button>` : '')")
rep("  else if (!L.length) acts = `<button type=\"button\" class=\"db ${boxArm ? 'on' : ''}\" data-dk=\"boxsel\"><span class=\"ic\">🔲</span>동시선택</button>${", "  else if (!L.length) acts = `${")
rep("<span class=\"dhint\">아군을 탭해 고르세요. 바닥 탭 = 이동 · 적 탭 = 공격 (빠르게 두 번 = 서둘러 · 사수는 바로 쏨). 꾹 누르면 슬로우 + 기술 부채 (끌어서 고름 · 아래로 = 취소)</span>`;", "<span class=\"dhint\">아군을 탭 → 바닥 = 이동 · 적 = 공격</span>`;")
rep("  if (k === 'boxsel'){ ordKey('boxsel'); return; }", "  if (k === 'boxsel'){ ordKey('boxsel'); return; }\n  if (k === 'more'){ dockMore = !dockMore; hud(); return; }   /* v9.8.0 */\n  if (k === 'clump' || k === 'chgmode'){ ordKey(k); hud(); return; }")
# 겹쳐 보기 단추: 휴대폰은 그림만
rep("`<button type=\"button\" class=\"${OVL[k] ? 'on' : ''}\" data-ovl=\"${k}\" title=\"${tt}\">${nm}</button>`", "`<button type=\"button\" class=\"${OVL[k] ? 'on' : ''}\" data-ovl=\"${k}\" title=\"${tt}\">${MOB ? nm.split(' ')[0] : nm}</button>`")
rep("  if (!ed && Wd.brief && now - Wd.brief.t < Wd.rules.briefT + 1){", "  if (!ed && Wd.brief && now - Wd.brief.t < Wd.rules.briefT + 1 && (detail() || see || OVL.sense)){   /* v9.8.0 냄새 부채꼴은 볼 때만 */")
det = "<button type=\"button\" class=\"db ${detourArm ? 'on' : ''}\" data-dk=\"detour\"><span class=\"ic\">↪</span>우회<small>${detourArm ? '다음 이동' : '끔'}</small></button>"
rep(det, "${dockMore ? `" + det + "` : ''}")
rep("+ (L.some(u => lretLine(Wd, u)) ? `<button type=\"button\" class=\"db ${armed && armed.k === 'lret'", "+ (dockMore && L.some(u => lretLine(Wd, u)) ? `<button type=\"button\" class=\"db ${armed && armed.k === 'lret'")
rep("    if (side === 0 && sel.size && mode !== 'edit'){ const R = cmdRange(Wd, C)", "    if (side === 0 && sel.size && mode !== 'edit' && $('netShow').checked){ const R = cmdRange(Wd, C)")   # 지휘 거리 원은 지휘망 늘 보기일 때만
rep(".row.sst{", ".lede{display:none}   /* v9.8.0 머리말 긴 글 숨김 */\n.cfg>summary{color:#2a2420;border-color:rgba(60,50,40,.4);background:rgba(255,255,255,.5)}\n.row.sst{")
rep("const detail = () => $('detailAll').checked;", "const detail = () => $('detailAll').checked || !!window.__detail;   /* 시험용 */")
open(F, 'w', encoding='utf-8').write(s)
print('page9210 OK')
