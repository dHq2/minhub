# v7.8.3 페이지: 은신 표시 (판 · 칩 · 인물 칸) · 들킴 표시 · 로그 · 이야기 · 쓸모없는 단추 숨김
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
# 노트 · 버전
rep("<!-- 굴의 전투판 v7.8.2 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n",
"""<!-- 굴의 전투판 v7.8.3 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.8.3: 은신이 보이고, 헛짓하지 않음 (아군 · 적 같은 규칙).
             ① 들킴을 느낌: 숨은 몸은 상대가 나를 0.3초 넘게 앞 · 옆으로 보거나 (스치는 눈길은 아님) 맞으면 들킨 걸 앎 — 그냥 숨어 걷던 몸은 은신을 풀고 제 걸음 (×0.6 → ×1) ·
               정찰은 곧바로 도망 (돌아와서도 은신을 되살리지 않음) · 적 매복은 터짐 · 적 우회조는 숨기를 풂. 암살 명령 · 적 암살조는 원래대로 들키면 그만둠.
             ② 판: 숨은 아군 초상화 왼쪽 아래에 🥷 · 켰지만 지금 숨지 못하면 (횃불을 켬 · 방금 치거나 쏨 · 뛰는 중 · 몸이 큼) 빗금 친 🥷 · 들키면 붉은 👁 (깜빡임) + 머리 위 '들킴!' (4초).
             ③ 모바일 아래 칩 (얼굴 위) 과 인물 칸에도 같은 표시 · 까닭. 로그 · 이야기에 '들킨 걸 느낌' (누가 봤는지는 우리 눈에 보이는 적일 때만).
             ④ 아래 조작판: 고른 아군이 할 수 없는 단추는 숨김 — 견제 (베테랑 사수 · 탄) · 암살 (암살 솜씨) · 던지기 (횃불을 든 이) · 은신 (숨을 수 있는 몸). 단추가 줄어 던지기가 밀려나지 않음.
     v7.8.2: 모바일에서 정찰 · 암살 · 견제 ·""")
rep('<span class="ver">v7.8.2 · 모바일','<span class="ver">v7.8.3 · 은신 표시 🥷 · 들킴 👁 (느끼면 숨기를 그만둠 · 정찰은 도망) · 쓸모없는 단추 숨김 · v7.8.2 · 모바일')
rep("<footer>굴의 전투판 v7.8.2 —","<footer>굴의 전투판 v7.8.3 —")
rep("return `굴의 전투판 v7.8.2 · ${title}","return `굴의 전투판 v7.8.3 · ${title}")
rep("copyText('굴의 전투판 v7.8.2 자동 판 기록","copyText('굴의 전투판 v7.8.3 자동 판 기록")
# 은신 상태 도우미 (dockState 앞)
rep("const dockState = (Wd, u) =>","""// v7.8.3 은신 상태 (우리 몸): on = 숨어 있음 · off = 켰지만 지금 숨지 못함 (까닭) · blown = 방금 들킴 (4초 — 누가 봤는지는 보이는 적일 때만)
function stlInfo(Wd, u){
  if (!Wd || !u || !u.alive || u.side !== 0 || mode === 'edit') return null;
  if (!u.stealth && u.blown && Wd.t - u.blown.t < 4){ const b = u.blown.by != null ? Wd.units[u.blown.by] : null; return { k: 'blown', why: u.blown.why === '맞음' ? '맞아서 들킴' : b && b.seenBy ? b.name + '에게 들킴' : '어둠 속 시선을 느낌 — 들킴' }; }
  if (!u.stealth) return null;
  if (stealthK(Wd, u) < 1) return { k: 'on', why: '숨어 있음' };
  const S2 = Wd.rules.stealth || {};
  return { k: 'off', why: u.torch && !u.torchOff ? '횃불을 켜서 못 숨음' : (u.stealthE || 0) < (S2.min || 0) ? '몸이 커서 못 숨음' : Wd.t - (u.revealT == null ? -9 : u.revealT) < (S2.reveal || 2) ? '방금 치거나 쏴서 드러남' : '뛰는 중이라 못 숨음' };
}
const stlChip = (Wd, u) => { const si = stlInfo(Wd, u); return si ? `<i class="stb ${si.k}" title="${esc(si.why)}">${si.k === 'blown' ? '👁' : '🥷'}</i>` : ''; };
const dockState = (Wd, u) =>""")
# 칩
rep("""data-dc="${u.i}"><span class="fc" style="${faceCss(faceOf(u.ref), 30)}"></span>""","""data-dc="${u.i}"><span class="fc" style="${faceCss(faceOf(u.ref), 30)}"></span>${ed ? '' : stlChip(Wd, u)}""")
rep(".dchip .fc{flex:0 0 28px;",".dchip{position:relative} .dchip .stb{position:absolute;left:21px;top:0;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:12px/1 sans-serif;font-style:normal;background:rgba(40,30,62,.95);box-shadow:0 0 0 1.5px #a78bfa;pointer-events:none}\n.dchip .stb.off{opacity:.55;background:linear-gradient(135deg,transparent 45%,#ff5a4a 45%,#ff5a4a 57%,transparent 57%),rgba(40,30,62,.95);box-shadow:0 0 0 1.5px #8a7f9e}\n.dchip .stb.blown{background:#ffe1dc;box-shadow:0 0 0 1.5px #dc2626;animation:stbBlink .6s ease-in-out infinite alternate}\n@keyframes stbBlink{from{opacity:1}to{opacity:.45}}\n.pm .stb{font-style:normal;margin-left:3px} .pm .stb.off{opacity:.5;text-decoration:line-through} .pm .stb.blown{color:#ff6b5a;font-weight:700}\n.dchip .fc{flex:0 0 28px;")
# 인물 칸 (데스크톱)
rep("""<span class="nm"><b class="no">${allyNo(Wd, u)}</b> ${esc(u.name)}${u.torch || (mode === 'edit' && u.hero) ? ' 🔥' : ''} <i>${coord(u.x, u.y)}</i></span>""",
    """<span class="nm"><b class="no">${allyNo(Wd, u)}</b> ${esc(u.name)}${u.torch || (mode === 'edit' && u.hero) ? ' 🔥' : ''}${(() => { const si = stlInfo(Wd, u); return si ? `<i class="stb ${si.k}" title="${esc(si.why)}">${si.k === 'blown' ? '👁 ' + esc(si.why) : '🥷' + (si.k === 'off' ? ' ' + esc(si.why) : '')}</i>` : ''; })()} <i>${coord(u.x, u.y)}</i></span>""")
# 판: 은신 배지 · 들킴 (부위 칩 앞)
rep("    // v5.5 부위: 실명은 얼굴에 검은 띠, 초상화 안쪽 위에 밝은 칩으로",
"""    // v7.8.3 은신: 숨음 🥷 · 켰지만 못 숨음 (빗금) · 들킴 👁 (깜빡임 + 머리 위 '들킴!') — 초상화 왼쪽 아래 (우리 몸만)
    if (!ed && u.side === 0 && u.alive){ const si = stlInfo(Wd, u); if (si){ const fs = Math.max(11, Math.min(17, r * 0.55)), x = px - r * 0.66, y = py + r * 0.66, bl = si.k === 'blown';
      ctx.save(); ctx.globalAlpha = bl ? 0.65 + 0.35 * Math.sin(now * 9) : si.k === 'off' ? 0.6 : 0.97; ctx.fillStyle = bl ? 'rgba(255,225,220,.96)' : 'rgba(40,30,62,.94)'; ctx.strokeStyle = bl ? '#dc2626' : '#a78bfa'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, fs * 0.7, 0, 7); ctx.fill(); ctx.stroke(); ctx.font = `${fs}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#1a0a0c'; ctx.fillText(bl ? '👁' : '🥷', x, y + 0.5);
      if (si.k === 'off'){ ctx.strokeStyle = '#ff5a4a'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x - fs * 0.5, y + fs * 0.5); ctx.lineTo(x + fs * 0.5, y - fs * 0.5); ctx.stroke(); }
      if (bl && ts >= 18){ const k = Math.max(0, 1 - (now - u.blown.t) / 4), t = '👁 들킴!'; ctx.globalAlpha = 0.35 + 0.65 * k; ctx.font = '800 11px IBM Plex Sans KR, sans-serif'; const tw = ctx.measureText(t).width, ly = py - r - 14 - (1 - k) * 6;
        ctx.fillStyle = 'rgba(70,10,10,.9)'; ctx.fillRect(px - tw / 2 - 4, ly - 8, tw + 8, 16); ctx.fillStyle = '#ffd2c8'; ctx.fillText(t, px, ly); }
      ctx.restore(); } }
    // v5.5 부위: 실명은 얼굴에 검은 띠, 초상화 안쪽 위에 밝은 칩으로""")
# 로그
rep("      case 'scoutFlee': out.push(`${T(e)}🔭 ${n(e.a)} 들킴 — 뛰어 도망`); break;",
    "      case 'scoutFlee': out.push(`${T(e)}🔭 ${n(e.a)} 들킴 — 뛰어 도망${e.why === '맞음' ? ' (맞음)' : e.b != null && U(e.b) && U(e.b).seenBy ? ' (' + n(e.b) + '의 시선)' : ''}`); break;\n      case 'stealthBlown': out.push(`${T(e)}👁 ${U(e.a).side ? '적 ' : ''}${n(e.a)} 들킨 걸 느낌 — ${e.why === '맞음' ? '맞음' : e.b != null && (U(e.a).side || (U(e.b) && U(e.b).seenBy)) ? n(e.b) + '의 시선' : '어둠 속 누군가의 시선'} → 숨기를 그만둠 (제 걸음)${U(e.a).side && !e.vis ? ' [아군에겐 안 보임]' : ''}`); break;   // v7.8.3")
rep("e.why === 'mate' ? ga(n(e.b)) + ' 곁에서 싸우기 시작함 — 기다리지 않음' : '때가 됨 (10초)'}","e.why === 'mate' ? ga(n(e.b)) + ' 곁에서 싸우기 시작함 — 기다리지 않음' : e.why === 'seen' ? (e.b != null ? ga(n(e.b)) + ' 숨은 적을 알아봄 — 들킨 걸 느낌' : '들킨 걸 느낌') : '때가 됨 (10초)'}")
# 이야기
rep("    case 'ambush': return !e.obs && e.why !== 'near' ? null : { c: 'bad', s: e.why === 'hit' ?","    case 'stealthBlown': return U(e.a).side === 0 ? { c: 'bad', s: `${ga(n(e.a))} 시선을 느낀다 — 들켰다. 숨기를 그만둔다.` } : e.vis ? { c: 'good', s: `적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 들킨 걸 알아챈다.` } : null;   // v7.8.3\n    case 'ambush': return !e.obs && e.why !== 'near' && e.why !== 'seen' ? null : { c: 'bad', s: e.why === 'seen' ? '숨어 있던 적이 들킨 걸 알아채고 어둠에서 뛰쳐나온다!' : e.why === 'hit' ?")
# 조작판: 할 수 없는 단추 숨김
rep("      + `<button type=\"button\" class=\"db\" data-dk=\"scout\"><span class=\"ic\">🔭</span>정찰</button>`   // v7.5",
    "      + (L.some(u => !u.crawl) ? `<button type=\"button\" class=\"db\" data-dk=\"scout\"><span class=\"ic\">🔭</span>정찰</button>` : '')   // v7.5   // v7.8.3 할 수 없는 단추는 숨김")
rep("      + `<button type=\"button\" class=\"db\" data-dk=\"assn\"><span class=\"ic\">🗡</span>암살</button>`   // v7.6",
    "      + (L.some(u => !u.crawl && (u.assnE || 0) > 0) ? `<button type=\"button\" class=\"db\" data-dk=\"assn\"><span class=\"ic\">🗡</span>암살</button>` : '')   // v7.6")
rep("      + `<button type=\"button\" class=\"db\" data-dk=\"supp\"><span class=\"ic\">🎯</span>견제</button>`   // v7.7",
    "      + (L.some(u => isFar(u) && u.vet && !u.crawl && u.ammo !== 0) ? `<button type=\"button\" class=\"db\" data-dk=\"supp\"><span class=\"ic\">🎯</span>견제</button>` : '')   // v7.7")
rep("      + `<button type=\"button\" class=\"db\" data-dk=\"flare\"><span class=\"ic\">🔥</span>던지기</button>`   // v7.8",
    "      + (L.some(u => u.torch && !u.crawl) ? `<button type=\"button\" class=\"db\" data-dk=\"flare\"><span class=\"ic\">🔥</span>던지기</button>` : '')   // v7.8")
rep("      + `<button type=\"button\" class=\"db ${L.every(u => u.stealth) ? 'on' : ''}\" data-dk=\"stealth\"><span class=\"ic\">🥷</span>은신<small>${L.every(u => u.stealth) ? '켬' : '끔'}</small></button>`",
    "      + (L.some(u => (u.stealthE || 0) >= ((Wd.rules.stealth || {}).min || 0)) ? `<button type=\"button\" class=\"db ${L.every(u => u.stealth) ? 'on' : ''}\" data-dk=\"stealth\"><span class=\"ic\">🥷</span>은신<small>${L.every(u => u.stealth) ? '켬' : L.some(u => u.blown && Wd.t - u.blown.t < 4) ? '들킴' : '끔'}</small></button>` : '')")
open(f,'w').write(s); print('ok')
