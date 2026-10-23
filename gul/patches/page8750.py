# v8.7.5 페이지 — page8750.py v1.4 (v1.4: 휴대폰 대형 띠는 판 위에 두지 않음 — 세로 화면은 머리줄 (멈춤 · 슬로우 옆) 의 작은 칩 ⚑, 누르면 판 왼쪽 위에 펼침 (▴ 접기) · 가로 화면은 판 왼쪽 위 한 줄 칩 (판 가운데 · 아래의 인물 꾹 누르기 · 탭을 가리던 것) · 휴대폰 도움말에 ⚑ 칩 · 띠 글: 한 번도 갖춘 적 없으면 '무너짐' 대신 '모이는 중' · 기다리는 중이면 '기다림' 먼저 · v1.3: 휴대폰 대형 띠는 상호작용 단추 (판 아래 가운데) 가 뜨면 그 위로 비켜 앉음 · v1.2: 시작할 때 기본 = 놓인 자리 그대로 (훈련장에서 손으로 놓은 자리를 말없이 옮기지 않게 — 편성 창에서 '대형 자리로 모여서' 를 고름) · 휴대폰 대형 띠는 판 오른쪽 아래 (여정 띠 · 확인 창을 가리지 않게) · v1.1: 여정 시작 모임은 대장 (주인공 · 지휘관) 둘레 그대로 — 시작할 때 대형 자리로는 훈련장만 (여정은 싸움이 시작되면 대형으로) · 시험 스위치 __noJit 이면 놓인 자리 그대로 · 휴대폰 대형 띠 한 줄 · v1.0: page8740.py 를 먼저 돌린 뒤 — 대형 (J7 · J16 · I20): 대형 띠 (편대마다 기준 ★ · 모양 · 유지율 · 진형 버프 · 떼어 맡김 · 모양 단추 · 🚩 모여 · 📍 깃발 · 켜고 끔 · 조합 버프 줄 · ⚑ 편성) ·
#   판 위 그림 (공세선 — 대형이 설 앞줄을 실제 선으로: 갖추면 실선 · 70% 아래면 점선 · 가는 곳의 그림자 대형 · 제 자리 고리 · 처진 편대원 점선 · 유지율 고리 · ★ 기준 · 편대 깃발 (떼어 맡기면 빈 깃발) · 🚩 깃발) ·
#   명령은 기준에게 (고른 무리에 기준이 있으면 같은 편대원은 대형으로 따라감 · 떼어 맡겼던 이는 모여) · 모여 (W · 띠의 🚩) · 깃발 (Shift + W · 📍 — 꽂을 바닥을 찍으면 기준이 그리로) · 자동 (G) = 대형으로 ·
#   시작할 때 모임 (대형 자리로 · 놓인 자리 그대로) · 상세정보 칸 (대형 · 진형 버프 · 조합 버프 · ★ 기준으로) · 기록 · 서술 · 단축키 (W · D) · 편성 창 (K5 — 편대 나누기 · 기준 · 모양 · 자리 맞바꾸기 · 자유 대형 끌어 놓기 ·
#   버프 미리 보기 (진형 · 조합) · 시작할 때 · 싸울 때 (대형 지킴 · 맞붙으면 각자) · 시작 교전 규칙 — 배치 · 0초엔 판에도 바로) · 모닝스타 좁은 골목 (돌리지 않고 뒤로 당겨 던짐) · 여정 기록 ver 8.7.5 · 수치표 이전 8.7.5)
import subprocess
D = '/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
F = D + 'page10.tpl.html'
subprocess.run(['python3', D + 'page8740.py'], check=True)
s = open(F, encoding='utf-8').read()
def rep(a, b, c=1):
    global s
    n = s.count(a)
    assert n == c, (n, c, a[:100])
    s = s.replace(a, b)

# ---------- 버전 ----------
rep('<!-- 굴의 전투판 v8.7.4 (2026-10-22)', '<!-- 굴의 전투판 v8.7.5 (2026-10-23)')
rep('     v8.7.4: ', '''     v8.7.5: 대형 — 편대 (본대 · 2편대) 마다 기준 (기준병 — 기본은 주 방어대장) 을 두고 모양 (일자 · 쐐기 · 삼각 · 방진 · 산개 · 자유) 의 제 자리를 지킴 · 이동 명령은 기준에게 (편대원은 대형으로 따라감 · 따로 명령하면 떼어 맡김 · 🚩 모여 W 로 돌아옴 · Shift + W 깃발) ·
         공세선 (판 위에 대형이 설 앞줄을 실제 선으로 — 갖추면 실선 · 70% 아래면 점선 · 기준이 기다림) · 가장 느린 편대원에 걸음을 맞춤 · 맞붙은 편대원은 그 자리에서 싸우고 끝나면 제 자리로 ·
         진형 버프 (방패벽 · 쐐기 돌파 · 삼각 엄호 · 사방 경계 · 흩어짐 — 적의 대치 진형 · 쐐기 돌파도 같은 규칙) · 조합 버프 (고블린즈 · 갱스터 파라다이스 · 굴에 떨어진 이들 · 노먼의 2편대 — 도감의 무리) ·
         편성 창 (D — 편대 나누기 · 기준 · 모양 · 자리 맞바꾸기 · 자유 대형 · 버프 미리 보기 · 시작할 때 모임 · 싸울 때 방식 · 시작 교전 규칙) · 좁은 길 비켜서기 (J12) · 모닝스타 좁은 골목 (A6 — 철퇴를 돌리지 못하고 앞뒤로 던지기만)
     v8.7.4: ''')
for a, b in (('h1::after{content:" v8.7.4"', 'h1::after{content:" v8.7.5"'), ('<footer>굴의 전투판 v8.7.4', '<footer>굴의 전투판 v8.7.5'), ('return `굴의 전투판 v8.7.4 · ${title}', 'return `굴의 전투판 v8.7.5 · ${title}'),
             ("copyText('굴의 전투판 v8.7.4 자동 판 기록", "copyText('굴의 전투판 v8.7.5 자동 판 기록"), ("o.push(`굴의 전투판 v8.7.4 — ${C.run", "o.push(`굴의 전투판 v8.7.5 — ${C.run"),
             ('의 버전 기록에 — v8.7.4 전투 바로잡기 (붉은암석 · 망각 · 세르파)', '의 버전 기록에 — v8.7.5 대형 (공세선 · 진형 · 조합 · 편성 창) / v8.7.4 전투 바로잡기 (붉은암석 · 망각 · 세르파)'),
             ('">v8.7.4 · 전투 바로잡기 (5층 붉은암석 · 세르파 동료)</span>', '">v8.7.5 · 대형 (공세선 · 진형 버프 · 조합 버프 · 편성 창)</span>'),
             ("return { game: '굴의 전투판', ver: '8.7.3', kind:", "return { game: '굴의 전투판', ver: '8.7.5', kind:")):   # v8.7.5 여정 기록 파일의 버전 (8.7.4 때 빠졌던 것도)
    rep(a, b)
# 수치표 이전: 새 칸 (form8 · fbuf · combo) 을 저장된 수치표에 채움 — 바뀐 옛 기본값은 없음
rep("const OLD_DEFAULTS = /*OLDDEF*/, RULES_MIG = '8.7.4',", "const OLD_DEFAULTS = /*OLDDEF*/, RULES_MIG = '8.7.5',")

# ---------- 모여 (frally) 명령: 확인 글 · 명령 줄 글 · 지금 명령 ----------
rep("o.k === 'swap' ? ['🎒 꺼내 듦', '#e6d3a3'] : ", "o.k === 'swap' ? ['🎒 꺼내 듦', '#e6d3a3'] : o.k === 'frally' ? ['🚩 대형으로', '#8ccaff'] : ")   # v8.7.5
rep("  if (o[0] === 'hold') return '제자리';\n", "  if (o[0] === 'hold') return '제자리';\n  if (o[0] === 'frally') return '대형으로 모여';   /* v8.7.5 */\n")
rep("const ordOf = u => u.order && (u.order.room || u.order.rejoin) ? ['auto'] : ", "const ordOf = u => u.order && u.order.k === 'frally' ? ['frally'] : u.order && (u.order.room || u.order.rejoin) ? ['auto'] : ")

# ---------- 대형 띠 · 편성 창 (자리 · 모양) ----------
rep('        <div class="swbar" id="swbar" hidden aria-label="카리우스 휘두르기 모드"></div>\n',
    '        <div class="swbar" id="swbar" hidden aria-label="카리우스 휘두르기 모드"></div>\n        <div class="fmbar" id="fmbar" hidden aria-label="대형"></div>\n')
rep('ⓘ 상세 · ☰ 더 보기.</p>', 'ⓘ 상세 · ☰ 더 보기. 머리줄 ⚑ = 대형 (누르면 판 왼쪽 위에 펼침 — 🚩 모여 · 📍 깃발 · ⏻ 켜고 끔 · ⚑ 편성 창 · ▴ 접기 · 가로 화면은 판 왼쪽 위 칩).</p>')   # v1.4 휴대폰 도움말
rep('<span class="assist" id="assist" aria-label="보조 (멈춤 · 슬로우)"></span>', '<span class="assist" id="assist" aria-label="보조 (멈춤 · 슬로우)"></span><button type="button" class="fmchip" id="fmChip" hidden aria-expanded="false" title="대형 — 눌러서 펼침 (편대 · ★ 기준 · 유지율 · 🚩 모여 · 📍 깃발 · ⚑ 편성)"></button>')   # v1.4 휴대폰 세로: 대형 칩
rep('  <div class="kbsheet" id="kbsheet" hidden role="dialog" aria-label="단축키"><div class="kbc" id="kbc"></div></div>',
    '  <div class="kbsheet" id="kbsheet" hidden role="dialog" aria-label="단축키"><div class="kbc" id="kbc"></div></div>\n  <div class="fmwin" id="fmWin" hidden role="dialog" aria-label="편성 창"><div class="fmc" id="fmC"></div></div>')
FM_CSS = r'''/* v8.7.5 대형 띠 (판 오른쪽 · 작은 지도 아래) */
.fmbar{position:absolute;right:8px;top:8px;z-index:6;display:flex;flex-direction:column;gap:3px;background:rgba(12,15,22,.9);border:1px solid #2f3b52;border-radius:9px;padding:5px 7px;font:600 11px var(--body);color:#dbe8ff;max-width:min(330px,46%);box-shadow:0 4px 14px rgba(0,0,0,.45)}
.fmbar[hidden]{display:none}
.fmbar .fr{display:flex;align-items:center;gap:4px;flex-wrap:wrap;min-width:0}
.fmbar .fq{font:800 10.5px var(--body);padding:1px 6px;border-radius:5px;color:#0d1420;background:rgb(120,200,255)} .fmbar .fq.B{background:rgb(140,235,160)}
.fmbar .fl{color:#ffe7a0;max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fmbar .fi{font:700 10.5px var(--mono);padding:1px 5px;border-radius:5px;background:#1d2636;white-space:nowrap} .fmbar .fi.ok{color:#9ff0b0} .fmbar .fi.lo{color:#ffd27a} .fmbar .fi.br{color:#ff8a7a} .fmbar .fi.off{color:#8a96aa}
.fmbar .fb{font:700 10px var(--body);color:#bfe4ff} .fmbar .fd{font:600 10px var(--body);color:#ffb27a}
.fmbar .fc{color:#ffe2a8;font-weight:600} .fmbar .fh{font:500 10px var(--body);color:#8a96aa}
.fmbar .fsp{flex:1}
.fmbar button{border:1px solid #3a4a66;background:#182132;color:#dbe8ff;border-radius:6px;padding:2px 6px;font:700 11px var(--body);cursor:pointer;min-width:24px;line-height:1.3}
.fmbar button:hover{border-color:#8ccaff} .fmbar button.on{background:#8ccaff;color:#0d1420;border-color:#fff}
.fmbar kbd{font:700 9.5px var(--mono);opacity:.75}
body.mob .fmbar{left:6px;right:auto;bottom:auto!important;max-width:calc(100% - 12px);font-size:10px;padding:3px 5px;gap:2px;background:rgba(12,15,22,.86)} body.mob .fmbar .fsh,body.mob .fmbar .fh,body.mob .fmbar kbd,body.mob .fmbar .fb{display:none}
/* v1.4 휴대폰 대형 칩 — 세로: 머리줄 (판을 가리지 않음) · 가로: 판 왼쪽 위 한 줄 */
.fmchip{display:none}
body.mob .fmchip:not([hidden]){display:inline-flex;align-items:center;gap:3px;font:700 11px var(--body);padding:2px 8px;border-radius:999px;border:1px solid #3a4a66;background:#182132;color:#dbe8ff;cursor:pointer;white-space:nowrap;overflow:hidden;max-width:calc(100vw - 150px);min-height:22px;line-height:1.2}
body.mob .fmchip.open{border-color:#8ccaff;box-shadow:0 0 0 1px #8ccaff inset}
.fmchip .fq,.fmbar .fsum .fq{font:800 10px var(--body);padding:0 4px;border-radius:4px;color:#0d1420;background:rgb(120,200,255)} .fmchip .fq.B,.fmbar .fsum .fq.B{background:rgb(140,235,160)}
.fmchip .fi{font:700 10.5px var(--mono)} .fmchip .ok{color:#9ff0b0} .fmchip .lo{color:#ffd27a} .fmchip .br{color:#ff8a7a} .fmchip .off{color:#8a96aa} .fmchip .fx{opacity:.8}
.fmbar .fsum button{display:inline-flex;align-items:center;gap:3px;white-space:nowrap} .fmbar .fsum .fi{font:700 10.5px var(--mono);background:none;padding:0} .fmbar .fsum .ok{color:#9ff0b0} .fmbar .fsum .lo{color:#ffd27a} .fmbar .fsum .br{color:#ff8a7a} .fmbar .fsum .off{color:#8a96aa}
body.mob .fmbar button{min-height:26px;min-width:28px;padding:1px 4px;font-size:11px} body.mob .fmbar .fl{max-width:64px}
/* v8.7.5 편성 창 (준비 창) */
.fmwin{position:fixed;inset:0;z-index:61;background:rgba(4,6,10,.66);display:flex;align-items:center;justify-content:center;padding:12px}
.fmwin[hidden]{display:none}
.fmc{width:min(1000px,100%);max-height:calc(100vh - 24px);overflow:auto;background:#141820;border:1px solid #33405a;border-radius:12px;padding:12px 14px;color:#e6edf8;font:500 12.5px/1.45 var(--body);box-shadow:0 18px 50px rgba(0,0,0,.6)}
.fmc h3{margin:0 0 8px;font:800 16px var(--body);display:flex;align-items:center;gap:8px;flex-wrap:wrap} .fmc h3 small{font:500 11px var(--body);color:#9fb0c8} .fmc h3 .fmx{margin-left:auto}
.fmc h4{margin:2px 0 6px;font:800 13px var(--body);color:#cfe3ff;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.fmgrid{display:grid;grid-template-columns:minmax(230px,1fr) minmax(290px,1.35fr) minmax(220px,1fr);gap:10px}
.fmsec{background:#1a2030;border:1px solid #2c3850;border-radius:10px;padding:8px 10px;min-width:0}
.fmrow{display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid #222b3d} .fmrow:last-child{border-bottom:none}
.fmrow .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}
.fmrow .ck{font:700 10px var(--body);padding:1px 5px;border-radius:5px;background:#26314a;color:#cfe3ff;white-space:nowrap}
.fmc .seg2{display:inline-flex;border:1px solid #3a4a66;border-radius:7px;overflow:hidden;flex-wrap:wrap}
.fmc .seg2 button{border:0;background:#182132;color:#cfe3ff;padding:4px 8px;font:700 11.5px var(--body);cursor:pointer} .fmc .seg2 button+button{border-left:1px solid #3a4a66}
.fmc .seg2 button.on{background:#8ccaff;color:#0d1420} .fmc .seg2 button:disabled{opacity:.45;cursor:default}
.fmc .star{border:1px solid #6b5a2a;background:#2a2412;color:#ffd76a;border-radius:6px;padding:2px 7px;cursor:pointer;font:800 12px var(--body)} .fmc .star.on{background:#ffd76a;color:#2a2412}
.fmc .star:disabled{opacity:.4;cursor:default}
.fmsh{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0}
.fmsh button{border:1px solid #3a4a66;background:#182132;color:#dbe8ff;border-radius:7px;padding:4px 8px;font:700 12px var(--body);cursor:pointer} .fmsh button.on{background:#8ccaff;color:#0d1420;border-color:#fff}
.fmcv{display:block;width:100%;background:#0d1119;border:1px solid #2c3850;border-radius:8px;touch-action:none;cursor:pointer}
.fmnote{font:500 11px/1.45 var(--body);color:#9fb0c8;margin:4px 0}
.fmbuf{margin:4px 0;padding:6px 8px;border-radius:8px;background:#1f2a40;border-left:3px solid #8ccaff} .fmbuf b{color:#bfe4ff}
.fmbuf.cb{border-left-color:#ffcf6e} .fmbuf.cb b{color:#ffe2a8} .fmbuf.off{opacity:.5}
.fmfoot{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin-top:10px}
.fmfoot .lab{font:700 11.5px var(--body);color:#cfe3ff}
@media (max-width:860px){ .fmgrid{grid-template-columns:1fr} }
body.mob .fmc{padding:10px;font-size:12px} body.mob .fmc .seg2 button,body.mob .fmsh button{min-height:34px}
'''
rep(".swbar[hidden],body.mob .swbar{display:none}\n", ".swbar[hidden],body.mob .swbar{display:none}\n" + FM_CSS)

# ---------- 대형: 설정 · 띠 · 모여 · 기준 · 시작 모임 (판 진행 앞에) ----------
FM_JS = r'''/* ---------- v8.7.5 대형 (기준 · 모양 · 공세선 · 모여 깃발 · 진형 버프 · 조합 버프 · 편성 창) ---------- */
// 편대 (본대 A · 2편대 B) 마다 기준 (기준병 — 기본은 주 방어대장) 을 두고 모양의 제 자리를 지킴. 이동 명령은 기준에게 (편대원은 대형으로 따라감), 따로 명령한 편대원은 떼어 맡김 (🚩 모여로 돌아옴)
const FSH = { 일자: '▬', 쐐기: '⋀', 삼각: '△', 방진: '◯', 산개: '⁘', 자유: '✥' }, FSH_ALL = ['일자', '쐐기', '삼각', '방진', '산개', '자유'], FSQ_NM = { A: '본대', B: '2편대' }, FSQ_COL = { A: '120,200,255', B: '140,235,160' };
const FSH_TXT = { 일자: '칼 (앞줄) 은 기준 양옆으로 한 줄 · 창은 2열 · 사수와 치유는 뒷줄', 쐐기: '기준이 끝 · 칼과 창이 양 날개로 비스듬히 · 사수와 치유는 날개 안', 삼각: '기준이 꼭짓점 · 줄마다 하나씩 늘어남 · 칼과 창은 바깥 · 사수와 치유는 안쪽',
  방진: '기준이 앞 · 근접은 둥글게 바깥을 봄 · 사수와 치유는 가운데', 산개: '일자를 넓게 (사이 2.2칸 · 뒷줄은 3칸 뒤)', 자유: '편성 창에서 끌어 놓은 자리 그대로 (진형 버프 없음)' };
const FBUF_TXT = R => { const B = (R || rules).fbuf || {}; return { 방패벽: `일자 앞줄 — 막는 폭 +${B.arc || 20}° · 밀림 · 넘어짐 버팀 ×${B.poise || 1.3}`, '쐐기 돌파': `쐐기 — 밀치는 힘 ×${B.shove || 1.2} · 끝 (기준) 버팀 ×${B.tipPoise || 1.2}`,
  '삼각 엄호': `삼각 — 안쪽 사수 명중 ×${B.aim || 1.1} · 꼭짓점 (기준) 버팀 ×${B.tipPoise || 1.2}`, '사방 경계': `방진 — 옆 · 뒤에서 맞아도 정면으로 받음 (옆 · 뒤가 더 아프지 않음) · 걸음 ×${B.slow || 0.9}`, 흩어짐: `산개 — 날아오는 화살 · 총알 · 투창 명중 ×${B.loose || 0.85}` }; };
const FORM8_KEY = 'gul.form8.v1';
let form8C = null;
// 편성 (판이 바뀌어도 기억 — 이 브라우저): 편대마다 모양 · 켜고 끔 · 싸울 때 방식 · 기준 (이름표) · 맞바꾼 자리 · 자유 자리 + 시작할 때 모임 · 시작 교전 규칙
function form8Cfg(){
  if (form8C) return form8C; let c = null; try { c = JSON.parse(localStorage.getItem(FORM8_KEY) || 'null'); } catch (e){ c = null; }
  const sq = (o, sh) => ({ shape: FSH_ALL.includes(o && o.shape) ? o.shape : sh, on: !(o && o.on === false), style: o && o.style === 'loose' ? 'loose' : 'keep', lead: o && o.lead != null ? String(o.lead) : null,
    swaps: Array.isArray(o && o.swaps) ? o.swaps.filter(p => Array.isArray(p) && p.length === 2).map(p => p.map(String)).slice(-24) : [], pin: o && o.pin && typeof o.pin === 'object' ? o.pin : null, prevShape: o && FSH_ALL.includes(o.prevShape) && o.prevShape !== '자유' ? o.prevShape : null });
  form8C = { A: sq(c && c.A, '삼각'), B: sq(c && c.B, '산개'), start: c && c.start === 'form' ? 'form' : 'loose', roe: c && ['free', 'smart', 'hold', 'nofire'].includes(c.roe) ? c.roe : '' };
  return form8C;
}
function form8Save(){ try { localStorage.setItem(FORM8_KEY, JSON.stringify(form8Cfg())); } catch (e){} }
// 대형의 이름표: 도감 번호 (같은 번호가 둘이면 놓은 칸 id) — 기준 · 맞바꾼 자리 · 자유 자리를 판이 바뀌어도 기억
const fkeyOf = (p, A) => { const L = (A || S.units).filter(q => q.side === 0); return p.ref && L.filter(q => q.ref === p.ref).length === 1 ? p.ref : String(p.id || p.name); };
const fsqOf = p => p.hero ? 'A' : p.sq === 'B' ? 'B' : 'A';
// 판을 만들기 전: 편성을 setup.form 으로 · 아군마다 이름표 · 편대
function form8Setup(S0){
  const C = form8Cfg(), pick = c => ({ shape: c.shape, on: c.on, style: c.style, lead: c.lead, swaps: c.swaps, pin: c.pin });
  S0.form = { A: pick(C.A), B: pick(C.B) };
  for (const p of S0.units) if (p.side === 0){ p.fkey = fkeyOf(p, S0.units); p.fsq = fsqOf(p); }
}
const fmOn = F => !!(F && F.on && F.lead != null && (F.act != null ? F.act : true));
const fmMembers = (W, sq) => W.units.filter(u => u.side === 0 && u.alive && !u.gone && !u.summon && (u.fsq || 'A') === sq);
const fmMem = (W, u) => { if (!W || !W.form || !u || u.side !== 0) return null; const F = W.form[u.fsq || 'A']; return fmOn(F) && F.lead !== u.i ? F : null; };
// 이동 · 공격 이동: 고른 무리에 기준이 있으면 명령은 기준에게 — 같은 편대원은 대형으로 따라감 (떼어 맡겼던 이 · 다른 명령을 받던 이는 모여)
function formSplit(W, L){
  if (!W || !W.form) return null; const lead = [], fol = [];
  for (const sq in W.form){ const F = W.form[sq]; if (!fmOn(F)) continue; const ld = W.units[F.lead]; if (!ld || !L.includes(ld)) continue;
    lead.push(ld); fol.push(...L.filter(u => u !== ld && (u.fsq || 'A') === sq && !u.summon)); }
  return lead.length ? { lead, fol, rest: L.filter(u => !lead.includes(u) && !fol.includes(u)) } : null;
}
// 🚩 모여: 편대원 (떼어 맡긴 이 · 다른 명령을 받던 이) 에게 '대형으로' 를 지휘망으로 · 깃발 자리를 주면 기준이 그리로 (편대원은 대형으로 따라감)
function form8Rally(sqs, x, y){
  const W = world; if (!W || W.over || !W.form) return 0; let n = 0; const tell = [];
  if (x != null && rock(W.map, x, y)){ toast('바위 칸에는 깃발을 꽂을 수 없어요'); return 0; }
  for (const sq of sqs){ const F = W.form[sq]; if (!F || F.lead == null) continue; const ld = W.units[F.lead]; if (!ld || !ld.alive) continue;
    const C = form8Cfg(); if (!C[sq].on){ C[sq].on = true; form8Save(); }
    formRally(W, sq, x != null ? Math.floor(x) + 0.5 : null, y != null ? Math.floor(y) + 0.5 : null);
    for (const u of fmMembers(W, sq)){ if (u === ld) continue; if (u.fdet || u.order || u.ordPend){ u.order = { k: 'frally' }; tell.push(u); } }
    if (x != null){ ld.order = { k: 'move', x: Math.floor(x) + 0.5, y: Math.floor(y) + 0.5, form: true }; tell.push(ld); }
    n++; }
  if (tell.length) noteOrders(tell, 'user', '모여 (대형으로)');
  return n;
}
function formRallyKey(flag, only){
  const W = world; if (!W || W.over || mode === 'edit') return; if (!W.form){ toast('대형이 없는 판이에요'); return; }
  const L = selUnits(W), sqs = only ? [only] : L.length ? [...new Set(L.map(u => u.fsq || 'A'))] : Object.keys(W.form);
  const ok = sqs.filter(sq => W.form[sq] && W.form[sq].lead != null && fmMembers(W, sq).length >= 2); if (!ok.length){ toast('모을 편대가 없어요 (둘 이상 남은 편대만)'); return; }
  if (flag){ armed = armed && armed.k === 'frally' ? null : { k: 'frally', sqs: ok, cas: [] }; chargePick = throwPick = skillPick = palmPick = leapPick = null; if (armed) toast(armedTxt()); hud(); return; }
  form8Rally(ok); toast(`🚩 ${ok.map(sq => FSQ_NM[sq]).join(' · ')} 모여 — 기준 곁 제 자리로 (말은 지휘망으로 — 못 들은 이는 늦게)`); hud();
}
// ★ 기준 바꾸기 (상세정보 칸 · 편성 창): 대형의 기준 — 이동 명령을 받고, 편대원은 그 둘레 제 자리로
function form8Lead(u){
  const W = world; if (!W || !W.form || !u || u.side !== 0) return; const sq = u.fsq || 'A', F = W.form[sq]; if (!F) return;
  if (!u.alive || u.down || u.crawl){ toast('쓰러진 · 기는 이는 기준이 될 수 없어요'); return; }
  formSet(W, sq, { lead: u.i }); const C = form8Cfg(); C[sq].lead = u.fkey || fkeyOf(S.units[u.i] || u); form8Save(); fmPlace0(W);
  toast(`★ ${u.name} — ${FSQ_NM[sq]} 기준 (대형이 이 사람에 맞춰 섬 · 이동 명령은 기준에게)`); hud();
}
// 모양 · 켜고 끔 (띠 · 편성 창): 이 브라우저에 기억 · 판에도 바로
function form8Shape(sq, sh){
  const C = form8Cfg(); if (!C[sq] || !FSH_ALL.includes(sh)) return; const W = world && mode !== 'edit' ? world : null;
  if (sh === '자유' && C[sq].shape !== '자유'){ C[sq].prevShape = C[sq].shape; if (!C[sq].pin) C[sq].pin = fmPinSeed(sq); }   // 자유로 처음 바꾸면 지금 모양의 자리에서 시작
  C[sq].shape = sh; form8Save();
  if (W && W.form && W.form[sq]){ formSet(W, sq, { shape: sh, ...(sh === '자유' && C[sq].pin ? { pin: C[sq].pin } : {}) }); fmPlace0(W); }
  toast(`${FSH[sh]} ${FSQ_NM[sq]} ${sh} — ${FSH_TXT[sh]}`); hud(); if (!$('fmWin').hidden) fmRender();
}
function form8Toggle(sq){
  const C = form8Cfg(); if (!C[sq]) return; C[sq].on = !C[sq].on; form8Save(); const W = world && mode !== 'edit' ? world : null;
  if (W && W.form && W.form[sq]){ formSet(W, sq, { on: C[sq].on }); fmPlace0(W); }
  toast(`${FSQ_NM[sq]} 대형 ${C[sq].on ? '켬 — 기준 둘레 제 자리로' : '끔 — 예전처럼 각자 (주인공 · 편대장을 따라감)'}`); hud(); if (!$('fmWin').hidden) fmRender();
}
// 0초 (싸움 전) 엔 바꾼 편성대로 판 위 자리도 바로 (시작할 때 모임이 '대형 자리로' 일 때)
function fmPlace0(W){ if (W && W === world && mode === 'plan' && W.t < 1e-6){ formStartPlace(W); computeLight(W); } }
// v8.7.5 시작할 때 모임 (편성 창 — 훈련장): 기준 둘레 6칸 안의 편대원을 제 자리로 (바닥 · 겹치지 않게 · 여정은 들어선 곳 안) · 더 멀리 놓인 이는 그 자리를 지킴 (떼어 맡김 — 🚩 모여로 돌아옴) · 대형은 맵 가운데 쪽을 봄
function formStartPlace(W){
  if (!W || !W.form || W.duel || W.t > 1e-6) return; const C = form8Cfg(), m = W.map, free = (x, y) => { const cx = Math.floor(x), cy = Math.floor(y); return cx >= 0 && cy >= 0 && cx < m.W && cy < m.H && m.t[cy * m.W + cx] === 0; };
  const IN = typeof run8On === 'function' && run8On() && S.art8 && typeof MAPS8 !== 'undefined' && MAPS8[S.art8] ? MAPS8[S.art8].in : null;
  const camp = !!(S.camp && !S.camp.end);   // 여정: 대장 둘레에 모인 채로 시작 (들어선 곳 · 문 앞) — 싸움이 시작되면 대형 자리로
  for (const sq in W.form){ const F = W.form[sq]; if (!F || F.lead == null) continue; const ld = W.units[F.lead]; if (!ld || !ld.alive) continue;
    const M = fmMembers(W, sq); if (M.length < 2 || !F.on) continue;
    if (!camp) for (const u of M) if (u !== ld){ const far = Math.hypot(u.x - ld.x, u.y - ld.y) > 6; if (far && !u.fdet){ u.fdet = true; u.stay = { x: u.x, y: u.y }; } }   // 훈련장: 멀리 따로 놓은 이는 그 자리를 지킴
    F.face = Math.hypot(m.W / 2 - ld.x, m.H / 2 - ld.y) > 1.5 ? Math.atan2(m.H / 2 - ld.y, m.W / 2 - ld.x) : (ld.face || 0); ld.face = F.face; F.key = '';
    if (C.start === 'loose' || camp || window.__noJit) continue;   // 놓인 자리 그대로 · 여정 · 시험 스위치
    const inF = M.filter(u => !u.fdet); formLayout(W, F, inF);
    const done = new Set([ld]);
    for (let pass = 0; pass < 2; pass++) for (const u of inF){ if (done.has(u)) continue; const s = F.slots[u.i]; if (!s) continue; const p = formPt(W, F, s), x = +p.x.toFixed(2), y = +p.y.toFixed(2);
      if (IN && !(x >= IN[0] && x <= IN[2] + 1 && y >= IN[1] && y <= IN[3] + 1)) continue;
      if (x < 0.5 || y < 0.5 || x > m.W - 0.5 || y > m.H - 0.5 || !free(x, y) || rock(m, x, y) || boxRock(W, x, y, u.r * 0.9) || W.units.some(o => o !== u && o.alive && !o.gone && Math.hypot(o.x - x, o.y - y) < o.r + u.r + 0.05)) continue;
      u.x = u.px = x; u.y = u.py = y; u.face = F.face + (s.fo || 0); done.add(u); }
  }
  if (W.fxOn) W.fx = [];
}
// v8.7.5 대형 띠: 편대마다 ★ 기준 · 유지율 · 진형 버프 · 떼어 맡김 · 모양 단추 · 🚩 모여 · 📍 깃발 · 켜고 끔 — 조합 버프 줄 · ⚑ 편성
let fmHtml = '', fmChipHtml = '', fmMobOpen = false;   /* v1.4 휴대폰: 칩을 누르면 펼침 */
// 띠 · 칩 · 상세의 대형 상태 글 — 한 번도 갖춘 적 없으면 '모이는 중' (시작 · 새 편성) · 기다리는 중이면 '기다림'
function fmSt(F, need){ const ig = F.integ || 0, was = F.lastLog === 'form' || F.lastLog === 'broken';
  return !F.on ? ['off', '꺼짐'] : F.act === false ? ['off', F.style === 'loose' && F.combat ? '각자 싸움' : '—'] : ig >= need ? ['ok', '갖춤'] : F.waitT0 != null ? ['lo', '기다림'] : !was ? ['lo', '모이는 중'] : ig < 0.4 ? ['br', '무너짐'] : ['lo', '흩어짐']; }
function renderFormBar(Wd){
  const el = $('fmbar'), ch = $('fmChip'); if (!el) return;
  const show = !!Wd && !!Wd.form && mode !== 'edit' && !Wd.over && !Wd.duel && ['A', 'B'].some(sq => Wd.form[sq] && fmMembers(Wd, sq).length >= 2);
  const land = MOB && document.body.classList.contains('land');   // 가로 화면은 머리줄이 숨음 — 칩을 판 왼쪽 위에
  if (ch) ch.hidden = !show || !MOB || land;
  if (!show){ el.hidden = true; fmHtml = ''; return; }
  const need = (Wd.rules.form8 || {}).need || 0.7, rows = [], sum = [], BT = FBUF_TXT(Wd.rules);
  for (const sq of ['A', 'B']){ const F = Wd.form[sq]; if (!F) continue; const M = fmMembers(Wd, sq); if (M.length < 2) continue;
    const ld = F.lead != null ? Wd.units[F.lead] : null, det = M.filter(u => u.fdet && u !== ld).length, on = F.on && F.act !== false;
    const st = fmSt(F, need), pc = Math.round((F.integ || 0) * 100);
    sum.push(`<span class="fq ${sq}">${FSQ_NM[sq]}</span><span class="fi ${st[0]}">${on ? pc + '%' : st[1]}</span>`);
    const buf = on && F.fbOn && FBUF[F.shape] ? FBUF[F.shape] : '';
    rows.push(`<div class="fr"><span class="fq ${sq}">${FSQ_NM[sq]}</span><span class="fl" title="기준 (기준병) — 대형이 이 사람에 맞춰 섬 · 이동 명령은 기준에게 (상세정보 칸 · 편성 창에서 바꿈)">★ ${esc(ld ? ld.name : '?')}</span><span class="fi ${st[0]}" title="대형 유지율 — 제 자리에 선 편대원 비율 · ${Math.round(need * 100)}% 아래면 기준이 기다림 (공세선)">${on ? pc + '% ' : ''}${st[1]}</span>${buf ? `<span class="fb" title="${esc(BT[buf] || '')}">✦ ${esc(buf)}</span>` : ''}${det ? `<span class="fd" title="따로 명령을 받아 떼어 맡긴 편대원 — 🚩 모여 (W) 로 돌아옴">떼어 맡김 ${det}</span>` : ''}`
      + `<span class="fsh">${FSH_ALL.map(sh => `<button type="button" class="${F.shape === sh ? 'on' : ''}" data-fsh="${sq}:${sh}" title="${esc(sh + ' — ' + FSH_TXT[sh])}">${FSH[sh]}</button>`).join('')}</span><span class="fsp"></span><button type="button" data-frally="${sq}" title="🚩 모여 (W) — 떼어 맡긴 이 · 다른 명령을 받던 이를 대형으로">🚩</button><button type="button" data-fflag="${sq}" title="📍 깃발 (Shift + W) — 꽂을 바닥을 찍으면 기준이 그리로 가고 편대원은 대형으로 따라감">📍</button><button type="button" class="${F.on ? 'on' : ''}" data-fon="${sq}" title="대형 켜고 끔 — 끄면 예전처럼 각자 (주인공 · 편대장을 따라감)">⏻</button></div>`);
  }
  const cb = (Wd.combos || []).filter(c => c.side === 0);
  if (cb.length) rows.push(`<div class="fr fc">🤝 ${cb.map(c => { const C = COMBO.find(x => x.k === c.k) || {}; return `<span title="${esc((C.why || '') + ' — ' + (C.fx || ''))}">${esc(c.nm)} ${c.ids.length}</span>`; }).join(' · ')}</div>`);
  rows.push(`<div class="fr"><button type="button" data-fopen="1" title="편성 창 (D) — 편대 · 기준 · 모양 · 자리 · 버프 미리 보기 · 시작할 때 · 싸울 때">⚑ 편성 <kbd>D</kbd></button><span class="fh">W 모여 · Shift+W 깃발</span>${MOB ? '<span class="fsp"></span><button type="button" data-fmob="0" title="대형 띠 접기">▴ 접기</button>' : ''}</div>`);
  if (MOB){   // v1.4 휴대폰: 판 위에는 펼쳤을 때만 (세로 = 머리줄 칩 · 가로 = 판 왼쪽 위 한 줄 칩)
    const sumH = `⚑ ${sum.join(' ')} <span class="fx">${fmMobOpen ? '▴' : '▾'}</span>`;
    if (ch && !land && sumH !== fmChipHtml){ fmChipHtml = sumH; ch.innerHTML = sumH; }
    if (ch){ ch.classList.toggle('open', fmMobOpen); ch.setAttribute('aria-expanded', fmMobOpen ? 'true' : 'false'); }
    if (!fmMobOpen){ if (!land){ el.hidden = true; fmHtml = ''; return; } rows.length = 0; rows.push(`<div class="fr fsum"><button type="button" data-fmob="1" title="대형 — 눌러서 펼침">${sumH}</button></div>`); }
  }
  el.hidden = false;
  const h = rows.join('');
  if (h !== fmHtml){ fmHtml = h; el.innerHTML = h; }
  if (!MOB){ const mi = $('mini'); el.style.top = (mi && !mi.hidden && mi.offsetHeight ? mi.offsetTop + mi.offsetHeight + 6 : 8) + 'px'; el.style.bottom = ''; }
  else { const cb2 = $('campBar'); el.style.top = (cb2 && !cb2.hidden && cb2.offsetHeight ? cb2.offsetTop + cb2.offsetHeight + 4 : 6) + 'px'; el.style.bottom = ''; }   // 휴대폰: 판 왼쪽 위 — 여정 띠가 있으면 그 아래
}
$('fmbar').addEventListener('pointerdown', e => e.stopPropagation());
$('fmbar').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.fmob != null){ fmMobOpen = b.dataset.fmob === '1'; renderFormBar(world); return; }   /* v1.4 휴대폰 펼침 · 접기 */
  if (b.dataset.fsh){ const [sq, sh] = b.dataset.fsh.split(':'); form8Shape(sq, sh); return; }
  if (b.dataset.frally){ formRallyKey(e.shiftKey, b.dataset.frally); return; }
  if (b.dataset.fflag){ formRallyKey(true, b.dataset.fflag); return; }
  if (b.dataset.fon){ form8Toggle(b.dataset.fon); return; }
  if (b.dataset.fopen) fmOpen(); });
$('fmChip').addEventListener('click', () => { fmMobOpen = !fmMobOpen; renderFormBar(world); });   /* v1.4 휴대폰 세로: 머리줄 칩 = 펼침 · 접기 */
// 상세정보 칸: 대형 (편대 · 모양 · 기준 · 제 자리 · 맞붙음 · 떼어 맡김 · ★ 기준으로) · 진형 버프 · 조합 버프
function fmDetail(Wd, u){
  const out = [];
  if (u.side === 0 && Wd.form && !u.summon){ const sq = u.fsq || 'A', F = Wd.form[sq];
    if (F){ const ld = F.lead != null ? Wd.units[F.lead] : null, s = F.slots && F.slots[u.i], need = (Wd.rules.form8 || {}).need || 0.7;
      const st = !F.on ? '꺼짐 (예전처럼 각자)' : F.act === false ? (F.style === 'loose' && F.combat ? '맞붙으면 각자 — 싸움이 끝나면 다시 모임' : '대형을 이룰 동료가 없음') : u === ld ? `★ 기준 — 대형이 이 사람에 맞춰 섬 · 유지율 ${Math.round((F.integ || 0) * 100)}%${(F.integ || 0) < need ? ' (' + Math.round(need * 100) + '% 아래면 가다가 기다림)' : ''}` : u.fdet ? '떼어 맡김 — 따로 받은 명령대로 · 🚩 모여 (W) 로 돌아옴' : u.fEng ? '맞붙음 — 그 자리에서 싸움 (끝나면 제 자리로)' : s ? `제 자리 (${{ front: '앞줄 칼', spear: '2열 창', back: '뒷줄 사수 · 치유' }[s.k] || s.k}) 에서 ${u.fD != null ? u.fD.toFixed(1) : '?'}칸` : '자리 잡는 중';
      out.push(`<span class="tr"><span class="lb">대형</span> ${FSQ_NM[sq]} · ${FSH[F.shape] || ''} ${esc(F.shape)}${ld && ld !== u ? ' · 기준 ' + esc(ld.name) : ''} — ${st}${u !== ld && u.alive && !u.down && mode !== 'edit' ? ` <button type="button" class="btn sm" data-flead="${u.i}" title="이 동료를 ${FSQ_NM[sq]}의 기준 (대형이 맞춰 서는 사람 · 이동 명령을 받음) 으로">★ 기준으로</button>` : ''}</span>`); } }
  if (u.fb && (u.side === 0 || u.seenBy)){ const T = FBUF_TXT(Wd.rules); out.push(`<span class="tr" style="color:#bfe4ff"><span class="lb">진형 버프</span> ✦ ${esc(u.fb.nm)}${u.fb.tip ? ' (끝 · 꼭짓점)' : u.fb.row === 'front' ? ' (앞줄)' : u.fb.back ? ' (안쪽)' : ''} — ${esc(T[u.fb.nm] || '')}</span>`); }
  if (u.cb && u.cb.length && (u.side === 0 || u.seenBy)) for (const k of u.cb){ const C = COMBO.find(x => x.k === k); if (C) out.push(`<span class="tr" style="color:#ffe2a8"><span class="lb">조합 버프</span> 🤝 ${esc(C.nm)} — ${esc(C.fx)} <small>(${esc(C.why)})</small></span>`); }
  return out.join('');
}
$('det').addEventListener('click', e => { const b = e.target.closest('[data-flead]'); if (!b || !world || world.over || mode === 'edit') return; form8Lead(world.units[+b.dataset.flead]); });
'''
rep("\n/* ---------- 턴 진행 ---------- */\nlet lastTs = 0, cont = false;", "\n" + FM_JS + "\n/* ---------- 턴 진행 ---------- */\nlet lastTs = 0, cont = false;")

# 이동 · 공격 이동: 명령은 기준에게 — 같은 편대원은 대형으로 따라감
rep("""  const tx = Math.floor(wx) + 0.5, ty = Math.floor(wy) + 0.5;
  if (L.length === 1){ L[0].order = { k: kind, x: tx, y: ty, ...(hurry ? { hurry: true } : {}) }; if (det) applyDetour(L, tx, ty); noteOrders(L); return; }""",
"""  const tx = Math.floor(wx) + 0.5, ty = Math.floor(wy) + 0.5;
  { const FS = formSplit(world, L); if (FS){ const back = FS.fol.filter(u => u.fdet || u.order || u.ordPend);   /* v8.7.5 대형: 명령은 기준에게 — 같은 편대원은 대형으로 따라감 (떼어 맡겼던 이 · 다른 명령을 받던 이는 모여) */
      FS.lead.forEach(u => { u.order = { k: kind, x: tx, y: ty, form: true, ...(hurry ? { hurry: true } : {}) }; }); back.forEach(u => { u.order = { k: 'frally' }; });
      if (det) applyDetour(FS.lead, tx, ty); noteOrders([...FS.lead, ...back]); if (!FS.rest.length) return; L = FS.rest; } }
  if (L.length === 1){ L[0].order = { k: kind, x: tx, y: ty, ...(hurry ? { hurry: true } : {}) }; if (det) applyDetour(L, tx, ty); noteOrders(L); return; }""")
# 자동 (G) = 대형으로 (대형 편대원) · 예전처럼 주인공을 따라감 (대형이 없으면)
rep("  if (k === 'auto'){ L.forEach(u => { u.order = null; u.stay = null; }); noteOrders(L, 'user', '자동 (자리를 풀고 주인공을 따라감)');",
    "  if (k === 'auto'){ L.forEach(u => { u.order = fmMem(world, u) ? { k: 'frally' } : null; u.stay = null; }); noteOrders(L, 'user', L.some(u => fmMem(world, u)) ? '자동 (자리를 풀고 대형으로 · 대형이 없으면 주인공을 따라감)' : '자동 (자리를 풀고 주인공을 따라감)');   /* v8.7.5 */")

# 시작: 편성 (setup.form) · 시작할 때 모임 · 시작 교전 규칙
rep("  world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0, S.camp && !S.camp.end ? { camp: true } : undefined);",
    "  form8Setup(S);   /* v8.7.5 대형 */\n  world = createWorld(S, rules, (Math.random() * 2 ** 32) >>> 0, S.camp && !S.camp.end ? { camp: true } : undefined);")
rep("  const A = S.camp && typeof ancOf === 'function' ? ancOf(W) : null, JR = A ? 0.35 : START_JIT;", "  const A = S.camp && typeof ancOf === 'function' ? (typeof chiefOf === 'function' ? chiefOf(W) : ancOf(W)) : null, JR = A ? 0.35 : START_JIT;   /* v8.7.5 대장 (주인공 · 지휘관) 둘레 — 대형의 기준과 따로 */")
rep("  startJit(world);   /* v8.4.1 시작 자리 살짝 무작위 */", "  startJit(world);   /* v8.4.1 시작 자리 살짝 무작위 */ formStartPlace(world);   /* v8.7.5 시작할 때 모임 */")
rep("  const nOp = applyOpeners(world);   // v5.7.2 저장된 시작 행동\n",
    "  const nOp = applyOpeners(world);   // v5.7.2 저장된 시작 행동\n"
    "  if (world.form){ const C = form8Cfg(); if (C.roe) for (const u of world.units) if (u.side === 0 && u.alive) u.roe = C.roe;   /* v8.7.5 편성 창의 시작 교전 규칙 */\n"
    "    logEv(world, { k: 'form8Start', sq: Object.keys(world.form).map(q => { const F = world.form[q]; return [q, F.shape, F.lead, F.on ? 1 : 0, F.style, fmMembers(world, q).length]; }), start: C.start, roe: C.roe || '' }); }\n")
rep("  const seed = (Math.random() * 2 ** 31) | 0, Wd = createWorld(clone(S), clone(rules), seed, { headless: true });",
    "  form8Setup(S); const seed = (Math.random() * 2 ** 31) | 0, Wd = createWorld(clone(S), clone(rules), seed, { headless: true });   /* v8.7.5 대형도 같은 규칙 */")

# hud: 대형 띠
rep("  const Wd = W_(); renderSkillBar(Wd); renderDetail(); renderDock(Wd);", "  const Wd = W_(); renderSkillBar(Wd); renderFormBar(Wd); renderDetail(); renderDock(Wd);")

# 깃발 꽂기 (겨눔 'frally'): 판 클릭 · 오른쪽 클릭 · 겨눔 글
rep("  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp' || armed.k === 'area' || armed.k === 'flare' || armed.k === 'flank' || armed.k === 'spec') && armedTap(w) !== 'pass') return;",
    "  if (armed && (armed.k === 'lret' || armed.k === 'scout' || armed.k === 'assn' || armed.k === 'supp' || armed.k === 'area' || armed.k === 'flare' || armed.k === 'flank' || armed.k === 'spec' || armed.k === 'frally') && armedTap(w) !== 'pass') return;", 2)
rep("  if (k === 'skill'){ if (u && u.side === 0){ giveSkill(u); return done(); } return armPass('약'); }\n",
    "  if (k === 'skill'){ if (u && u.side === 0){ giveSkill(u); return done(); } return armPass('약'); }\n"
    "  if (k === 'frally'){ const sqs = armed.sqs || ['A']; if (form8Rally(sqs, w.x, w.y)) toast(`📍 ${sqs.map(q => FSQ_NM[q]).join(' · ')} — ${coord(w.x, w.y)} 에 깃발: 기준이 그리로 · 편대원은 대형으로`); return done(); }   /* v8.7.5 깃발 */\n")
rep("pick: '✋ 줍기: 떨어진 물건을 탭' }[k] || k)", "pick: '✋ 줍기: 떨어진 물건을 탭', frally: '📍 깃발: 꽂을 바닥을 탭 — 기준이 그리로 가고 편대원은 대형으로 따라감' }[k] || k)")

# 단축키: W 모여 (Shift + W 깃발) · D 편성 창
rep("  if (k === 't' && mode !== 'edit' && world && !world.over){",
    "  if (k === 'w' && !e.ctrlKey && !e.metaKey && mode !== 'edit' && world && !world.over){ e.preventDefault(); formRallyKey(e.shiftKey); return; }   /* v8.7.5 모여 · 깃발 */\n"
    "  if (k === 'd' && !e.ctrlKey && !e.metaKey){ e.preventDefault(); fmOpen(); return; }   /* v8.7.5 편성 창 */\n"
    "  if (k === 't' && mode !== 'edit' && world && !world.over){")
rep("['N', '측면 기동'], ['L', '전열'], ['K', '전열 후퇴'], ['X · Backspace', '명령 취소']]],",
    "['N', '측면 기동'], ['L', '전열'], ['K', '전열 후퇴'], ['W', '🚩 모여 — 떼어 맡긴 편대원을 대형으로'], ['Shift + W', '📍 깃발 — 꽂을 바닥을 찍으면 기준이 그리로'], ['D', '⚑ 편성 창 (편대 · 기준 · 모양 · 자리 · 버프 · 시작 · 싸울 때)'], ['X · Backspace', '명령 취소']]],")
rep("if (k === 'escape' && !$('kbsheet').hidden){ kbOpen(false); return; }", "if (k === 'escape' && !$('kbsheet').hidden){ kbOpen(false); return; }\n  if (k === 'escape' && !$('fmWin').hidden){ fmClose(); return; }   /* v8.7.5 */")

# 상세정보 칸: 대형 · 진형 버프 · 조합 버프
rep("    ${u.canSweep && u.noArms ? `<span class=\"tr\"><span class=\"lb\">거구의 공격</span> 두 팔이 없음",
    "    ${!ed && u.alive ? fmDetail(Wd, u) : ''}\n    ${u.canSweep && u.noArms ? `<span class=\"tr\"><span class=\"lb\">거구의 공격</span> 두 팔이 없음")

# 편대 상자: 편성 창 열기
rep("'</div><p class=\"note\">지휘 스킬이 없으면 지휘 D (스스로 지시 못 함) · C 는 기본 지시만 · 제대로 지휘하려면 B 이상. 편대장의 지시는 판에 하늘색 점으로 보여요.</p>';",
    "'</div><p class=\"note\">지휘 스킬이 없으면 지휘 D (스스로 지시 못 함) · C 는 기본 지시만 · 제대로 지휘하려면 B 이상. 편대장의 지시는 판에 하늘색 점으로 보여요.</p>' + '<div class=\"row\"><button type=\"button\" class=\"btn sm\" data-fopen=\"1\" title=\"편성 창 (D)\">⚑ 편성 창 — 대형 · 기준 · 모양 · 버프 · 시작할 때 · 싸울 때</button></div>';   /* v8.7.5 */")

# ---------- 기록 · 서술 ----------
rep("      case 'reloc': out.push(",
    "      case 'formForm': out.push(`${T(e)}${FSH[e.shape] || '▲'} ${FSQ_NM[e.sq] || e.sq} 대형 갖춤 — ${e.shape} · 기준 ${n(e.a)} · ${e.n}명 · 유지율 ${Math.round(e.integ * 100)}%`); break;   /* v8.7.5 대형 */\n"
    "      case 'formBreak': out.push(`${T(e)}💢 ${FSQ_NM[e.sq] || e.sq} 대형 무너짐 — ${e.shape} · 유지율 ${Math.round(e.integ * 100)}% (기준 ${n(e.a)})`); break;\n"
    "      case 'formWait': out.push(`${T(e)}⏸ ${n(e.a)} (${FSQ_NM[e.sq] || e.sq} 기준) — 대형 유지율 ${Math.round(e.integ * 100)}%: 공세선을 맞추려 기다림`); break;\n"
    "      case 'formLead': out.push(`${T(e)}★ ${FSQ_NM[e.sq] || e.sq} 기준 ${n(e.b)} → ${n(e.a)} (이어받음)`); break;\n"
    "      case 'formRally': out.push(`${T(e)}🚩 ${FSQ_NM[e.sq] || e.sq} 모여 — ${e.a != null ? n(e.a) + ' 곁 · ' : ''}${coord(e.x, e.y)}`); break;\n"
    "      case 'formSet': out.push(`${T(e)}⚑ ${FSQ_NM[e.sq] || e.sq} 편성 — ${e.on ? (FSH[e.shape] || '') + ' ' + e.shape + (e.a != null ? ' · 기준 ' + n(e.a) : '') : '대형 끔'}`); break;\n"
    "      case 'form8Start': out.push(`${T(e)}⚑ 편성 — ${e.sq.filter(x => x[5] >= 2).map(([q, sh, a, on, st]) => `${FSQ_NM[q]} ${on ? (FSH[sh] || '') + ' ' + sh + (a != null ? ' (기준 ' + n(a) + ')' : '') + (st === 'loose' ? ' · 맞붙으면 각자' : ' · 대형 지킴') : '대형 끔'}`).join(' / ') || '대형을 이룰 편대 없음'} · 시작: ${e.start === 'loose' ? '놓인 자리 그대로' : '대형 자리로 모여서'}${e.roe ? ' · 교전 규칙 ' + ROE_NM[e.roe] : ''}`); break;\n"
    "      case 'frallyOk': out.push(`${T(e)}🚩 ${n(e.a)} — 대형으로 돌아감`); break;\n"
    "      case 'fbOn': case 'fbOff': if (e.side && !e.vis && !$('seeAll').checked && !Wd.over) break; out.push(`${T(e)}${e.k === 'fbOn' ? '✦' : '✧'} ${e.side ? '적 ' : (FSQ_NM[e.sq] || '') + ' '}진형 버프 ${e.k === 'fbOn' ? '— ' + e.nm + ' (' + e.sh + ')' : '풀림 — ' + e.nm}`); break;\n"
    "      case 'combo': if (e.side && !e.vis && !$('seeAll').checked && !Wd.over) break; out.push(`${T(e)}🤝 ${e.side ? '적 ' : ''}조합 버프 — ${e.nm}: ${e.ids.map(n).join(' · ')}`); break;\n"
    "      case 'alleyNo': out.push(`${T(e)}🚫 ${n(e.a)} — 좁은 골목: 철퇴를 돌릴 수 없음 (후리기 그만둠 · 앞뒤로 던지기만)`); break;\n"
    "      case 'reloc': out.push(")
rep("    case 'roleEvo': return e.to === '전선' ?",
    "    case 'formForm': return e.n >= 3 ? { c: 'good', s: `${ga(FSQ_NM[e.sq] || '대형')} ${e.shape} 대형을 갖춘다 — ${ga(n(e.a))} 앞에 선다.` } : null;   /* v8.7.5 대형 */\n"
    "    case 'formBreak': return { c: 'bad', s: `${FSQ_NM[e.sq] || ''}의 ${e.shape} 대형이 무너진다!` };\n"
    "    case 'formLead': return { c: 'dim', s: `${ga(n(e.a))} ${FSQ_NM[e.sq] || ''}의 기준을 이어받는다.` };\n"
    "    case 'formRally': return { c: 'good', s: `🚩 ${FSQ_NM[e.sq] || ''}, 모여라!` };\n"
    "    case 'combo': return e.side === 0 || e.vis ? { c: e.side ? 'bad' : 'good', s: `${e.ids.map(n).join(' · ')} — ${e.nm}!` } : null;\n"
    "    case 'alleyNo': return U(e.a).side === 0 || e.vis ? { c: 'dim', s: `골목이 좁아 ${ga(n(e.a))} 철퇴를 돌리지 못한다.` } : null;\n"
    "    case 'roleEvo': return e.to === '전선' ?")

# ---------- 판 위 그림: 공세선 · 제 자리 · 유지율 · ★ 기준 · 편대 깃발 · 가는 곳 · 🚩 ----------
DRAW_JS = r'''// v8.7.5 대형 그림: 공세선 (대형이 설 앞줄 — 갖추면 실선 · 70% 아래면 점선) · 가는 곳 (그림자 대형 · 공세선) · 제 자리 고리 · 처진 편대원 점선 · 유지율 고리 (기준 발밑) · ★ 기준 · 편대 깃발 (떼어 맡기면 빈 깃발) · 🚩 깃발
function drawForm(Wd, ox, oy, ts, see){
  if (!Wd.form) return; const need = (Wd.rules.form8 || {}).need || 0.7, cu = (Wd.rules.form8 || {}).catchup || 1.6;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const sq of ['A', 'B']){ const F = Wd.form[sq]; if (!F || !F.on || F.lead == null) continue; const ld = Wd.units[F.lead]; if (!ld || !ld.alive || ld.gone) continue;
    const M = fmMembers(Wd, sq); if (M.length < 2) continue; const col = FSQ_COL[sq], act = F.act !== false, ok = (F.integ || 0) >= need;
    const at = (x0, y0, fc, s) => { const c = Math.cos(fc), n = Math.sin(fc); return { x: x0 + c * s.f - n * s.l, y: y0 + n * s.f + c * s.l }; };
    const front = () => { const bins = new Map(); for (const i in F.slots){ const u = Wd.units[i], s = F.slots[i]; if (!u || !u.alive || u.fdet) continue; const k = Math.round(s.l / 0.6), f = s.f + (u.r || 0.4) + 0.45, cur = bins.get(k); if (!cur || f > cur.f) bins.set(k, { f, l: s.l }); } return [...bins.values()].sort((a, b) => a.l - b.l); };
    const stroke = (pts, w, a, dash) => { if (pts.length < 2) return; ctx.setLineDash(dash || []); ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(ox + p.x * ts, oy + p.y * ts) : ctx.moveTo(ox + p.x * ts, oy + p.y * ts)); ctx.strokeStyle = 'rgba(8,10,16,.82)'; ctx.lineWidth = w + 3; ctx.stroke(); ctx.strokeStyle = `rgba(${col},${a})`; ctx.lineWidth = w; ctx.stroke(); ctx.setLineDash([]); };
    if (act && F.slots){
      const FL = front(), fc = F.face || 0;
      // 가는 곳: 기준의 이동 · 공격 이동 (가는 중인 명령도) — 그림자 대형 · 공세선
      const po = ld.ordPend && ld.ordPend.o, o = ld.order && (ld.order.k === 'move' || ld.order.k === 'amove') ? ld.order : po && (po.k === 'move' || po.k === 'amove') ? po : null;
      if (o && Math.hypot(o.x - ld.x, o.y - ld.y) > 1.2){ const fd = Math.atan2(o.y - ld.y, o.x - ld.x);
        ctx.globalAlpha = 0.55; for (const i in F.slots){ const u = Wd.units[i]; if (!u || !u.alive || u.fdet) continue; const p = at(o.x, o.y, fd, F.slots[i]); ctx.strokeStyle = `rgba(${col},.7)`; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(ox + p.x * ts, oy + p.y * ts, Math.max(3, (u.r || 0.4) * ts * 0.8), 0, 6.283); ctx.stroke(); ctx.setLineDash([]); }
        stroke(FL.map(s => at(o.x, o.y, fd, s)), Math.max(2, ts * 0.08), 0.75, [8, 6]); ctx.globalAlpha = 1;
        if (ts >= 18){ const m = at(o.x, o.y, fd, { f: (FL.reduce((a, s) => Math.max(a, s.f), 0)) + 0.5, l: 0 }); ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const t = `${FSQ_NM[sq]} 가는 곳`, tw = ctx.measureText(t).width; ctx.fillStyle = 'rgba(8,10,16,.75)'; ctx.fillRect(ox + m.x * ts - tw / 2 - 4, oy + m.y * ts - 7, tw + 8, 14); ctx.fillStyle = `rgb(${col})`; ctx.fillText(t, ox + m.x * ts, oy + m.y * ts + 0.5); } }
      // 지금 공세선 (갖추면 실선 · 아니면 점선 — 기준이 기다림)
      const P = FL.map(s => at(ld.x, ld.y, fc, s)); stroke(P, Math.max(3, ts * 0.12), ok ? 0.95 : 0.7, ok ? null : [10, 7]);
      if (P.length >= 2){ const a = P[0], b = P[P.length - 1], fx = Math.cos(fc), fy = Math.sin(fc); ctx.strokeStyle = `rgba(${col},.9)`; ctx.lineWidth = 2;   // 양 끝: 앞쪽으로 짧은 눈금 (어느 쪽을 보는지)
        for (const p of [a, b]){ ctx.beginPath(); ctx.moveTo(ox + p.x * ts, oy + p.y * ts); ctx.lineTo(ox + (p.x + fx * 0.35) * ts, oy + (p.y + fy * 0.35) * ts); ctx.stroke(); }
        if (ts >= 16){ const mx = P.reduce((s2, p) => s2 + p.x, 0) / P.length + fx * 0.55, my = P.reduce((s2, p) => s2 + p.y, 0) / P.length + fy * 0.55, t = `${FSQ_NM[sq]} ${FSH[F.shape] || ''} ${Math.round((F.integ || 0) * 100)}%${F.waitT0 != null ? ' · 기다림' : ''}${F.fbOn && FBUF[F.shape] ? ' · ✦' + FBUF[F.shape] : ''}`;
          ctx.font = '700 10.5px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(t).width; ctx.fillStyle = 'rgba(8,10,16,.8)'; ctx.fillRect(ox + mx * ts - tw / 2 - 4, oy + my * ts - 8, tw + 8, 16); ctx.fillStyle = ok ? `rgb(${col})` : '#ffd27a'; ctx.fillText(t, ox + mx * ts, oy + my * ts + 0.5); } }
      // 제 자리 고리 · 처진 편대원 점선
      if (ts >= 12) for (const u of M){ if (u === ld || u.fdet || !F.slots[u.i]) continue; const p = at(ld.x, ld.y, fc, F.slots[u.i]), d = Math.hypot(u.x - p.x, u.y - p.y); if (d < 0.35) continue;
        ctx.strokeStyle = `rgba(${col},${u.fEng ? 0.3 : 0.6})`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(ox + p.x * ts, oy + p.y * ts, Math.max(3, (u.r || 0.4) * ts * 0.7), 0, 6.283); ctx.stroke();
        if (d > cu && !u.fEng){ ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(ox + u.x * ts, oy + u.y * ts); ctx.lineTo(ox + p.x * ts, oy + p.y * ts); ctx.stroke(); ctx.setLineDash([]); } }
      // 유지율 고리 (기준 발밑)
      { const R = ((ld.r || 0.4) + 0.3) * ts, a0 = -Math.PI / 2, g = Math.max(0, Math.min(1, F.integ || 0)); ctx.lineWidth = Math.max(2, ts * 0.07); ctx.strokeStyle = 'rgba(8,10,16,.6)'; ctx.beginPath(); ctx.arc(ox + ld.x * ts, oy + ld.y * ts, R, 0, 6.283); ctx.stroke();
        ctx.strokeStyle = g >= need ? 'rgba(130,240,150,.95)' : g >= 0.4 ? 'rgba(255,210,120,.95)' : 'rgba(255,120,100,.95)'; ctx.beginPath(); ctx.arc(ox + ld.x * ts, oy + ld.y * ts, R, a0, a0 + g * 6.283); ctx.stroke(); }
    }
    // 🚩 깃발 (모여 · 깃발 자리) — 10초 동안 또는 기준이 닿기 전까지
    if (F.flag && Wd.t - F.flag.t < 10 && Math.hypot(ld.x - F.flag.x, ld.y - F.flag.y) > 0.8){ const x = ox + F.flag.x * ts, y = oy + F.flag.y * ts, h = Math.max(14, ts * 0.8);
      ctx.strokeStyle = '#e8e0d0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.stroke(); ctx.fillStyle = `rgb(${col})`; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + h * 0.6, y - h * 0.78); ctx.lineTo(x, y - h * 0.56); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = `rgba(${col},.5)`; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(ox + ld.x * ts, oy + ld.y * ts); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]); }
    // ★ 기준 · 편대 깃발 (인물 왼쪽 위 — 떼어 맡기면 빈 깃발)
    if (ts >= 14) for (const u of M){ const r = (u.r || 0.4) * ts, x = ox + u.x * ts - r * 0.85, y = oy + u.y * ts - r * 0.85;
      if (u === ld){ ctx.font = `800 ${Math.max(11, Math.min(16, ts * 0.45))}px IBM Plex Sans KR, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(8,10,16,.9)'; ctx.strokeText('★', x, y); ctx.fillStyle = '#ffd76a'; ctx.fillText('★', x, y); continue; }
      const h = Math.max(7, Math.min(11, ts * 0.3)); ctx.strokeStyle = 'rgba(8,10,16,.85)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y + h * 0.5); ctx.lineTo(x, y - h * 0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - h * 0.6); ctx.lineTo(x + h * 0.8, y - h * 0.3); ctx.lineTo(x, y); ctx.closePath(); if (u.fdet){ ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = 1.3; ctx.stroke(); } else { ctx.fillStyle = `rgb(${col})`; ctx.fill(); ctx.strokeStyle = 'rgba(8,10,16,.8)'; ctx.lineWidth = 0.8; ctx.stroke(); } }
  }
  ctx.restore();
}
'''
rep("function drawBattleLines(Wd, ox, oy, ts, see){\n", DRAW_JS + "function drawBattleLines(Wd, ox, oy, ts, see){\n")
rep("  if (!ed) drawBattleLines(Wd, ox, oy, ts, see);   // v5.7 전열", "  if (!ed) drawForm(Wd, ox, oy, ts, see);   /* v8.7.5 대형 · 공세선 */\n  if (!ed) drawBattleLines(Wd, ox, oy, ts, see);   // v5.7 전열")

# ---------- 모닝스타 좁은 골목 (A6): 철퇴를 머리 위로 돌리지 않고 뒤로 당겨 곧게 던짐 ----------
rep("    const spin = A && ((A.k === 'atk' && A.fl && A.phase === 'wind') || (A.k === 'spec' && (A.s === 'sweep' || A.s === 'hurl') && A.phase === 'wind'));",
    "    if (A && A.k === 'atk' && A.fl && A.alley && A.phase === 'wind'){ const tb = Wd.units[A.b], aa = tb ? Math.atan2(tb.y - u.y, tb.x - u.x) : (u.face || 0), k = Math.min(1, (Wd.t - A.t0) / Math.max(0.1, A.end - A.t0)), Rb = (u.r + 0.25 + 0.35 * k) * ts, bx = hx - Math.cos(aa) * Rb, by = hy - Math.sin(aa) * Rb;   /* v8.7.5 좁은 골목: 뒤로 당겨 곧게 던짐 */\n"
    "      if (ts >= 22){ ctx.save(); ctx.font = '700 9.5px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd29a'; ctx.fillText('↔ 좁은 골목', hx, hy - u.r * ts - 8); ctx.restore(); }\n"
    "      flailChain(hx, hy, bx, by, 0, ts); flailBall(bx, by, rr, aa); flailHang.delete(u.i); continue; }\n"
    "    const spin = A && ((A.k === 'atk' && A.fl && !A.alley && A.phase === 'wind') || (A.k === 'spec' && (A.s === 'sweep' || A.s === 'hurl') && A.phase === 'wind'));")

open(F, 'w', encoding='utf-8').write(s)
print('page8750 OK (편성 창은 page8751.py)')
