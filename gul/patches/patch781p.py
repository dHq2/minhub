# v7.8.1 페이지 패치
import sys
D='/tmp/claude-0/-home-user-minhub/d21f98b4-0f7f-5135-a5ee-7d38f9fd42cc/scratchpad/'
f=D+'page10.tpl.html'; s=open(f).read()
def rep(old,new,cnt=1):
    global s
    n=s.count(old)
    if n!=cnt: print('COUNT',n,'!=',cnt,'::',old[:120]); sys.exit(1)
    s=s.replace(old,new)
def repline(start,new):
    global s
    i=s.find(start)
    if i<0: print('NOLINE',start[:80]); sys.exit(1)
    j=s.find('\n',i); s=s[:i]+new+s[j:]

# 노트
rep("<!-- 굴의 전투판 v7.8.0 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.\n     v7.8.0: 야전 — 밤의 진 · 잠 · 불빛 (아군 · 적 같은 규칙).",
"""<!-- 굴의 전투판 v7.8.1 (2026-10-12) — 굴의 도감만 쓰는 전투 실험판. 한 턴씩, 모두 동시에.
     v7.8.1: 설정 오류 고침 — 야영지 없앰. 적은 지치지도 잠들지도 않는 망자의 군대 (아군 · 적 같은 규칙).
             ① 야영지 · 모닥불 · 잠든 적 · 깨어남 · 불가에서 쉼 · 불빛 밖 초병 · 적의 불붙은 장작 던지기를 모두 없앰 (저장된 수치표의 camp · 장작 칸도 지움).
             ② 따로 떠도는 망자: 시작 자리는 무작위 — 우리 눈에 안 보이는 어둠이면 사방 어디든 (앞 · 옆 · 뒤). 저마다 아무 곳을 골라 제 걸음으로 떠돌고 가끔 멈춰 귀 기울임 (길 · 걸음 · 멈춤이 몸마다 다름).
               떠돌다 서로 마주치면 (5칸 · 가리지 않음) 큰 무리 쪽으로 뭉쳐 함께 떠돎 — 점점 합을 이룸. 이끄는 몸은 처진 몸을 4초까지 기다림.
             ③ 경보는 외침으로만: 처음 본 몸이 소리침 → 외침이 닿는 (들리는 거리 10칸, 싸움 소리에 줄어듦) 동료만 1초 뒤 그 자리를 알고 움직이고, 들은 쪽도 다시 소리침 (사슬). 상대를 본 몸도 소리침.
               외침이 닿지 않는 먼 몸은 계속 떠돌다 싸움 소리 · 총성을 듣거나 직접 보면 옴 (어둠 속에서 하나둘 더 나타남). 아직 떠도는 몸은 작전 · 견제사격 · 암살조에 끼지 않음 (모르니까).
             ④ [망자] (검방패기사 · 검기사 · 창병 · 궁수 · 곤봉적의 정체성): 지치지 않음 — 지침 · 탈진 · 질주 숨이 없음. 잠들지 않음. 옛 저장 · 내 설계에도 붙음.
             ⑤ 전투 일지 · 이야기 · 초전 복기를 떠도는 망자에 맞춤 (뭉침 · 경보가 번진 길 · 싸움 소리를 듣고 온 몸).
             측정 (자동 전투 · 유저 명령 없음): /*MEAS781*/
     v7.8.0: 야전 — 밤의 진 · 잠 · 불빛 (아군 · 적 같은 규칙). ①②, ④의 적 장작은 v7.8.1 에서 없앰 (설정 오류).""")
rep('<span class="ver">v7.8.0 · 야영지 (모닥불 · 잠 · 불빛 밖 초병) · 야습 · 화광 실명 · 횃불 던지기 🔥 · 적의 장작 · 전투 일지 · v7.7.0',
    '<span class="ver">v7.8.1 · 야영지 없앰 · 따로 떠도는 망자 (무작위 시작 · 마주치면 뭉침) · 경보는 외침이 닿는 데까지 · 싸움 소리를 듣고 옴 · [망자] 지치지 않음 · v7.8.0 · 화광 실명 · 횃불 던지기 🔥 · 전투 일지 · v7.7.0')
rep("<footer>굴의 전투판 v7.8.0 —","<footer>굴의 전투판 v7.8.1 —")
rep("return `굴의 전투판 v7.8.0 · ${title}","return `굴의 전투판 v7.8.1 · ${title}")
rep("copyText('굴의 전투판 v7.8.0 자동 판 기록","copyText('굴의 전투판 v7.8.1 자동 판 기록")
# 수치표 이전: 버전 · 없앤 칸 지움
rep("RULES_MIG = '7.8.0';","RULES_MIG = '7.8.1', RULES_GONE = [['camp'], ['flare', 'brandR'], ['flare', 'brandT'], ['flare', 'brandN'], ['flare', 'gap'], ['flare', 'grab']];   // v7.8.1 없앤 칸")
rep("if (S.rulesMig !== RULES_MIG){ const n = fixRules(S.rules, S.rulesKeys);","if (S.rulesMig !== RULES_MIG){ let n = fixRules(S.rules, S.rulesKeys); for (const p of RULES_GONE){ let o = S.rules; for (let i = 0; i < p.length - 1 && o; i++) o = o[p[i]]; if (o && typeof o === 'object' && o[p[p.length - 1]] !== undefined){ delete o[p[p.length - 1]]; n++; } }   // v7.8.1 야영지 · 장작 칸 지움\n ")
# 특성 사전 · 정체성 · 설계
rep("  '베테랑': '죽은 시대를 살아남은 숙련자","  '망자': '죽은 시대의 망자 — 지치지 않음 (지침 · 탈진 · 질주 숨 없음) · 잠들지 않음. 진도 집도 없이 어둠을 떠돎',   // v7.8.1\n  '베테랑': '죽은 시대를 살아남은 숙련자")
rep("'C-004': { traits: ['발화E', '실명:좌안', '후각B'], active: ['팜 버스트'] } })[ref] || null; }",
    "'C-004': { traits: ['발화E', '실명:좌안', '후각B'], active: ['팜 버스트'] },\n  'C-052': { traits: ['망자'] }, 'C-053': { traits: ['망자'] }, 'C-054': { traits: ['망자'] }, 'C-055': { traits: ['망자'] }, 'C-056': { traits: ['망자'] } })[ref] || null; }   // v7.8.1 죽은 시대의 기사조 = [망자]")
rep("ov: { hp: 200, atk: 28 }, traits: ['베테랑'], gear","ov: { hp: 200, atk: 28 }, traits: ['베테랑', '망자'], gear")
rep("ov: { hp: 150, atk: 34 }, traits: ['공통스킬:투창', '베테랑'], gear","ov: { hp: 150, atk: 34 }, traits: ['공통스킬:투창', '베테랑', '망자'], gear")
rep("ov: { hp: 150, atk: 30 }, traits: ['베테랑', '사격S'], active","ov: { hp: 150, atk: 30 }, traits: ['베테랑', '사격S', '망자'], active")
rep("ov: { hp: 170, atk: 32 }, traits: ['베테랑'], tac: ''","ov: { hp: 170, atk: 32 }, traits: ['베테랑', '망자'], tac: ''")
rep("ov: { rng: 0.75, hp: 400, atk: 55 }, traits: ['거구', '지휘B', '베테랑'], gear","ov: { rng: 0.75, hp: 400, atk: 55 }, traits: ['거구', '지휘B', '베테랑', '망자'], gear")
# 그림: 모닥불 · 장작 · 잠
i=s.find("    if (t.fire){ ctx.fillStyle = 'rgba(120,110,100,.9)';"); j=s.find('\n',i); s=s[:i]+s[j+1:]
rep("for (const t of Wd.torches){ const tx = ox + t.x * ts, ty = oy + t.y * ts;   // v7.8 모닥불 · 장작 · 꺼진 횃불","for (const t of Wd.torches){ const tx = ox + t.x * ts, ty = oy + t.y * ts;   // v7.8 꺼진 횃불")
rep("    drawFlame(tx, ty, ts * (t.brand ? 0.24 : 0.32), t.dropped || t.brand); }","    drawFlame(tx, ty, ts * 0.32, t.dropped); }")
rep("const t = u.sleep ? '💤 잠' : u.wakeT && now < u.wakeT ? '깨는 중' : u.koT && now < u.koT","const t = u.koT && now < u.koT")
# 로그
repline("      case 'rouse': out.push(","      case 'roamJoin': out.push(`${T(e)}🕯 망자 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 떠돌다 ${n(e.b)}${jong(n(e.b)) ? '과' : '와'} 마주쳐 뭉침 (이제 ${e.n})${e.vis ? '' : ' [아군에겐 안 보임]'}`); break;   // v7.8.1\n      case 'roamHear': out.push(`${T(e)}🕯 떠돌던 망자 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 싸움 소리를 듣고 ${coord(e.x, e.y)} 쪽으로 (${e.d}칸)${e.vis ? '' : ' [아군에겐 안 보임]'}`); break;")
rep("${n(e.a)} ${e.brand ? '모닥불에서 불붙은 장작을 꺼내 던짐' : e.own ? '든 횃불을 던짐 (손엔 빛이 없음)'","${n(e.a)} ${e.own ? '든 횃불을 던짐 (손엔 빛이 없음)'")
i=s.find("      case 'brandOut': out.push("); j=s.find('\n',i); s=s[:i]+s[j+1:]
rep("📋 적의 ${e.sentry ? '초병' : e.patrol ? '순찰조' : '본대'} ${n(e.a)}","📋 ${e.grp > 1 ? '무리 (' + e.grp + ') 의 ' : '홀로 떠돌던 '}적 ${n(e.a)}")
rep("case 'alarm': out.push(`${T(e)}📋 적 경보가 퍼짐 — ${(e.n || []).map(n).join(' · ') || '모두 이미 움직이는 중'} → 본 그때의 자리로`); break;",
    "case 'alarm': out.push(`${T(e)}📋 적 경보 (외침) — ${(e.n || []).map(n).join(' · ') || '들은 몸 없음'} → 들은 그 자리로${(e.left || []).length ? ' · 못 들은 채 떠도는 몸 ' + e.left.map(n).join(' · ') : ''}`); break;   // v7.8.1 외침이 닿는 데까지 (사슬)")
# 이야기
i=s.find("    case 'rouse': return U(e.a).side === 0"); j=s.find('\n',i); s=s[:i]+"    case 'roamJoin': return e.vis ? { c: 'bad', s: `어둠 속에서 망자 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} ${n(e.b)} 곁으로 섞여든다 — 무리가 불어난다.` } : null;   // v7.8.1\n    case 'roamHear': return e.vis ? { c: 'bad', s: `적 ${n(e.a)}${jong(n(e.a)) ? '이' : '가'} 고개를 돌린다 — 싸움 소리를 들었다.` } : null;"+s[j:]
rep("    case 'flare': return e.brand ? { c: 'bad', s: `적이 모닥불에서 불붙은 장작을 꺼내 이쪽 어둠으로 던진다 — 불꽃이 호를 그린다!` } : U(e.a).side === 0","    case 'flare': return U(e.a).side === 0")
i=s.find("    case 'brandOut': return { c: 'dim',"); j=s.find('\n',i); s=s[:i]+s[j+1:]
rep("lines: [{ c: 'dim', s: '횃불 하나에 의지해 어둠 속으로 들어선다.' }] }; if (Wd.campFire) narr.lines.push({ c: 'dim', s: `멀리 ${coord(Wd.campFire.x, Wd.campFire.y)} 쪽에 모닥불이 일렁인다 — 적의 진이다.` }); }   // v7.8",
    "lines: [{ c: 'dim', s: '횃불 하나에 의지해 어둠 속으로 들어선다.' }] }; if (Wd.start && Wd.start.k === 'roam') narr.lines.push({ c: 'dim', s: '이 어둠 어딘가를 망자들이 떠돈다 — 지치지도, 잠들지도 않는다.' }); }   // v7.8.1")
# 전투 일지
rep("  if (st) out.push(st.k === 'patrol' && Wd.campFire ? `밤. ${st.desc.split(' — ')[0]} — 모닥불 곁에 적이 쉬고 있었다${(st.sleep || []).length ? ' (잠든 이 ' + st.sleep.length + ')' : ''}.` : `${st.desc}.`);",
    "  if (st) out.push(st.k === 'roam' ? `밤. 망자 ${Wd.units.filter(u => u.side === 1).length}이 어둠 곳곳을 저마다 떠돌고 있었다.` : `${st.desc}.`);   // v7.8.1\n  const jn = G.filter(e => e.k === 'roamJoin'); if (jn.length) out.push(`떠돌던 망자들이 서로 마주쳐 뭉쳤다 (${jn.length}번) — 가장 큰 무리 ${Math.max(...jn.map(e => e.n))}.`);")
rep("  const sl = new Set(st && st.sleep || []), roused = new Set(G.filter(e => e.k === 'rouse').map(e => e.a)), sk = G.filter(e => e.k === 'die' && sl.has(e.b) && !roused.has(e.b));\n  if (sk.length) out.push(`잠든 채 숨이 끊긴 적 ${sk.length} — ${sk.map(e => nm(e.b)).join(' · ')}.`);",
    "  const alv = G.filter(e => e.k === 'alarm'), al0 = alv[0]; if (al0 && (al0.left || []).length) out.push(`외침은 다 닿지 않았다 — 처음엔 ${al0.left.map(nm).join(' · ')}${al0.left.length > 1 ? '이' : jong(nm(al0.left[0])) ? '이' : '가'} 모른 채 떠돌았다.`);   // v7.8.1\n  for (const e of G.filter(e => e.k === 'roamHear').slice(0, 3)) out.push(`${ts2(e)}, 싸움 소리를 듣고 ${iga(nm(e.a))} 어둠에서 다가왔다.`);")
rep("  const fl = G.filter(e => e.k === 'flare'), fa = fl.filter(e => !e.brand), fb = fl.filter(e => e.brand);","  const fa = G.filter(e => e.k === 'flare');")
rep("  if (fb.length) out.push(`적이 모닥불에서 장작을 꺼내 던졌다 (${fb.length}번).`);\n","")
# 초전 복기
rep("who = e => e.sentry ? '초병' : e.patrol ? '순찰조' : '본대';","who = e => e.grp > 1 ? '무리 (' + e.grp + ') 의' : '홀로 떠돌던';")
rep("al && [al.t, `  ${at(al)} 경보 — ${(al.n || []).map(n).join(' · ') || '모두 이미 움직이는 중'} → 본 그 자리로`]","al && [al.t, `  ${at(al)} 경보 (외침) — ${(al.n || []).map(n).join(' · ') || '들은 몸 없음'} → 들은 그 자리로${(al.left || []).length ? ' · 못 들은 몸 ' + al.left.map(n).join(' · ') : ''}`]")
# 상세: 시선 calm
rep("calm = u.side === 1 ? !Wd.alarm1 && u.state !== 'hunt' && u.state !== 'search' : !Wd.contact0","calm = u.side === 1 ? !u.woke && u.state !== 'hunt' && u.state !== 'search' : !Wd.contact0")
open(f,'w').write(s); print('ok')
