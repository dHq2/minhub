# v7.10.0 페이지: 버전 · 횃불 로그(꺼진 채) · 0초 끄기 기록 · 🕊 교전금지 · 밤 시력 칸 · 시야 설명 · 기척 로그 · 기척 고리
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(a,b,c=1):
    global s
    n=s.count(a)
    if n!=c: print('COUNT',n,'::',a[:120]); sys.exit(1)
    s=s.replace(a,b)
rep("<!-- 굴의 전투판 v7.9.5 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v7.9.5: 검수",
"""<!-- 굴의 전투판 v7.10.0 (2026-10-14) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.10.0: 야간 시야 개편 (달 없는 맑은 밤 · 어둠에 적응한 눈) — 기척 · 형체 · 식별 세 단계 / 횃불은 비대칭 / 🕊 교전 금지 표시 / 횃불 로그 바로잡음.
       ① 세 단계: 기척 (소리 · 냄새 · 희미한 움직임 — '무언가 있다' 만, 대략 자리 오차 있음) → 형체 (사람 · 거구 · 대략 자리 = 보임) → 식별 (무기 · 방향 · 공격 동작 — 회피 · 막기 · 정확한 사격).
          등급 [기척 · 형체 · 식별] 칸: C 일반인 12·9·4 (인주) · B 정규군 16·11·6 (노먼 · 레베카 — 눈이 아니라 수색 기술) · A 감각 특화 20·14·7 (청광묵 — 시각 · 후각 · 청각, 왼눈 사각) · S 개조체 20·16·9 (카리우스 — 넓은 시야 · 동시 감지 · 머리 넷).
          대상 보정: 거구 ×1.25 · 작은 몸 ×0.85 · 움직이는 중 (공격 중도) ×1.25 · 1.5초 넘게 가만히 ×0.8 · 은신 · 전장 소음 (기척). 후각은 정확한 좌표를 주지 않음. 식별 못 하면 피하기 ×0.35, 형체만 보고 쏘면 명중 ×0.8.
       ② 횃불은 비대칭: 빛 안은 식별 9칸 (불이 식별을 도움) · 든 이는 눈이 부셔 빛 밖 어둠의 형체 · 식별 ×0.6 · 불꽃은 18칸 밖에서도 보임 (적 · 아군 같은 규칙). 설정의 '밤 시력' 칸에서 등급을 바꿈.
       ③ 로그: '0초에 꺼 둔' 횃불이 떨어지는 기록이 '계속 탐' 이던 것 → 꺼진 채 떨어졌다고 적음 · 0초 끄기도 기록. 교전 금지 태세인 아군 머리 위에 🕊.
     v7.9.5: 검수""")
rep("바뀐 것은 머리 주석 (소스 보기) 의 버전 기록에 — v7.9.4","바뀐 것은 머리 주석 (소스 보기) 의 버전 기록에 — v7.10.0 야간 시야 3단계 · 횃불 비대칭 · 🕊 / v7.9.5 검수 / v7.9.4")
rep(">v7.9.5 · 코앞 지휘 · 따라감 한도 · 임시 자리 합류 · 📡 지휘망 · 시야</span>",">v7.10.0 · 야간 시야 3단계 · 횃불 비대칭 · 🕊</span>")
rep('h1::after{content:" v7.9.5"','h1::after{content:" v7.10.0"')
rep("<footer>굴의 전투판 v7.9.5","<footer>굴의 전투판 v7.10.0")
rep("return `굴의 전투판 v7.9.5 · ${title}","return `굴의 전투판 v7.10.0 · ${title}")
rep("copyText('굴의 전투판 v7.9.5 자동 판 기록","copyText('굴의 전투판 v7.10.0 자동 판 기록")
rep("RULES_MIG = '7.9.0'","RULES_MIG = '7.10.0'")
# 횃불 떨어짐 (꺼진 채)
rep("(${coord(e.x, e.y)}, 계속 탐)`); break;","(${coord(e.x, e.y)}, ${e.off ? '꺼진 채' : '계속 탐'})`); break;   // v7.10")
rep("case 'torchDrop': return { c: 'bad', s: `${n(e.a)}의 손에서 횃불이 떨어져 바닥에서 타오른다.` };","case 'torchDrop': return { c: 'bad', s: e.off ? `${n(e.a)}의 손에서 횃불이 떨어진다 — 꺼져 있어 어둠은 그대로.` : `${n(e.a)}의 손에서 횃불이 떨어져 바닥에서 타오른다.` };   // v7.10")
# 0초 끄기 기록
rep("  if (W.t <= 1e-6) for (const h of H){ if (h.torchSw){ h.torchOff = !h.torchSw.on; h.torchSw = null; } } computeLight(W);","  if (W.t <= 1e-6) for (const h of H){ if (h.torchSw){ h.torchOff = !h.torchSw.on; h.torchSw = null; logEv(W, { k: 'torch', a: h.i, on: !h.torchOff, vis: true, t0: true }); } } computeLight(W);   // v7.10 0초 설정도 기록")
# 🕊
rep("    // v5.5 부위: 실명은 얼굴에 검은 띠","""    // v7.10 교전 금지 태세: 머리 위에 🕊
    if (!ed && u.side === 0 && u.alive && vis && roeOf(Wd, u) === 'hold'){ const fs = Math.max(13, Math.min(20, r * 0.7)), bx = px, by = py - r - fs * 0.7 + Math.sin(now * 2.4 + u.i) * 1.8;
      ctx.save(); ctx.globalAlpha = 0.95; ctx.fillStyle = 'rgba(236,246,255,.92)'; ctx.strokeStyle = '#7fb6e8'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(bx, by, fs * 0.72, 0, 7); ctx.fill(); ctx.stroke(); ctx.font = `${fs}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#10243a'; ctx.fillText('🕊', bx, by + 0.5); ctx.restore(); }
    // v5.5 부위: 실명은 얼굴에 검은 띠""")
# 기척 고리
rep("  for (const u of Wd.units){\n    if (!u.alive && !(hid0(u) && !u.down)) continue;","""  if (!ed && !see){   // v7.10 기척: 보이진 않지만 느낀 곳 — 점선 고리 (오차만큼) 와 ?
    ctx.save(); const done = new Set();
    for (const a of Wd.units){ if (a.side !== 0 || !a.alive || !a.sense || hidA(Wd, a)) continue;
      for (const k in a.sense){ const q = a.sense[k], f = Wd.units[k]; if (!q || !q.pres || !f || !f.alive || f.side === 0 || f.seenBy || Wd.t - q.t > 3 || done.has(k)) continue; done.add(k);
        const cx = ox + q.x * ts, cy = oy + q.y * ts, rr = Math.max(0.9, (q.err || 1) + 0.3) * ts, age = (Wd.t - q.t) / 3;
        ctx.globalAlpha = 0.7 * (1 - age); ctx.strokeStyle = '#ffb08a'; ctx.lineWidth = 1.6; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
        ctx.font = `800 ${Math.max(11, Math.min(18, rr * 0.5))}px IBM Plex Sans KR, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffd2c0'; ctx.fillText('?', cx, cy); } }
    ctx.restore(); }
  for (const u of Wd.units){
    if (!u.alive && !(hid0(u) && !u.down)) continue;""")
# 시야 설명
rep("(u.nv ? '어둠 속 ' + glareReach(Wd, u).toFixed(1) + '칸까지' : '어둠은 안 보임')","('어둠 속 형체 ' + glareReach(Wd, u).toFixed(1) + '칸까지')")
rep("'🔥 횃불 켬 — 빛 ' + S3.heroLight + '칸 안은 보임 (멀리서도 보임)'","'🔥 횃불 켬 — 빛 안은 식별 ' + (S3.night || {}).litIdent + '칸 · 눈이 부셔 빛 밖은 ×' + (S3.night || {}).glare + ' · 불꽃은 ' + (S3.night || {}).flame + '칸 밖에서도 보임'")
rep("u.nv ? '야시 ' + (u.nvG || 'B') + ' — 어둠 속 ' + (u.nvG === 'A' ? S3.sight : u.nvG === 'C' ? S3.nvC : S3.nvB) + '칸' : '야시 없음 — 빛 밖은 거의 안 보임 (몸에 닿는 것만)'","nightTxt(Wd, u)")
rep("function linkBadge(Wd, u){","""const VGN = { C: '일반인', B: '정규군', A: '감각 특화', S: '개조체' };
function nightTxt(W, u){ const N = W.rules.night || {}, g = N[u.vg || 'C'] || [12, 9, 4], k = glareAt(W, u) ? N.glare || 0.6 : 1, f = x => +x.toFixed(1); return `밤 시력 ${u.vg || 'C'} (${VGN[u.vg || 'C']}) — 기척 ${g[0]} · 형체 ${f(g[1] * k)} · 식별 ${f(g[2] * k)}${k < 1 ? ' (눈부심)' : ''}`; }   // v7.10
function linkBadge(Wd, u){""")
# 밤 시력 칸
rep("""<label class="ck" for="selNv"><input id="selNv" type="checkbox" ${p.nv ? 'checked' : ''}> 야시 (어둠 속에서도 봄)</label>${p.nv ? `<select id="selNvG" aria-label="야시 등급"><option value="A" ${p.nvG === 'A' ? 'selected' : ''}>야시 A (9칸)</option><option value="B" ${p.nvG !== 'A' && p.nvG !== 'C' ? 'selected' : ''}>야시 B (${rules.nvB || 5}칸)</option><option value="C" ${p.nvG === 'C' ? 'selected' : ''}>야시 C (${rules.nvC || 2.5}칸)</option></select>` : ''}""",
"""<label class="ck" for="selVg">밤 시력</label><select id="selVg" aria-label="밤 시력 등급 (기척 · 형체 · 식별)">${['C', 'B', 'A', 'S'].map(g => `<option value="${g}" ${vgOf(p) === g ? 'selected' : ''}>${g} ${VGN[g]} — ${((rules.night || {})[g] || []).join(' · ')}</option>`).join('')}</select>""")
rep("""  if (e.target.id === 'selNv'){ p.nv = e.target.checked; if (p.nv && !p.nvG) p.nvG = 'B'; changed(); return; }
  if (e.target.id === 'selNvG'){ p.nvG = e.target.value; changed(); return; }""","""  if (e.target.id === 'selVg'){ p.vg = e.target.value; changed(); return; }   // v7.10 밤 시력 등급""")
rep("'weight', 'modBody', 'cry', 'mute'];","'weight', 'modBody', 'cry', 'mute', 'vg'];")
# 기척 로그
rep("      case 'chaseEnd': out.push(","      case 'presence': out.push(`${T(e)}👂 ${n(e.a)} 기척 — ${e.dir} 쪽 약 ${e.d}칸 (오차 ±${e.err}칸), 형체는 안 보임`); break;   // v7.10\n      case 'chaseEnd': out.push(")
rep("    case 'chaseEnd': return","    case 'presence': return { c: 'dim', s: Wd.units[e.a] && Wd.units[e.a].side === 1 ? `적 하나가 이쪽의 기척을 느낀 듯하다.` : `${ga(n(e.a))} ${e.dir} 쪽 어딘가에서 기척을 느낀다 — 형체는 안 보인다.` };   // v7.10\n    case 'chaseEnd': return")
open(f,'w').write(s); print('ok')
