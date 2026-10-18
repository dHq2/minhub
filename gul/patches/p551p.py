import sys
p='page10.tpl.html'; s=open(p,encoding='utf-8').read()
s=s.replace('굴의 전투판 v5.5 ', '굴의 전투판 v5.5.1 ').replace('굴의 전투판 v5.5 —', '굴의 전투판 v5.5.1 —').replace('굴의 전투판 v5.5 ·', '굴의 전투판 v5.5.1 ·').replace('굴의 전투판 v5.5 (', '굴의 전투판 v5.5.1 (')
pairs=[
("""     v5.5: 부위 파괴 · 절단 — 머리 · 팔에""", """     v5.5.1: [불사] (레베카) 는 죽지 않음 — 쓰러져도 재생해 피가 움직일 만큼 차면 그 적은 피로 일어남. 상대가 계속 치면 계속 제압됨. 아군이 다 쓰러지면 진짜 죽음.
             명령 (공격 · 투창) 은 아군 오사를 감수하고 쏨 (확률 싸움 — 오사 확률을 기록). 새 명령은 준비 중인 동작 · 점사를 바로 끊음. 약 명령은 자동 응급보다 먼저.
             머리 위 확인 표시 (명령을 받으면 무엇을 · 누구에게) · 이름 밑 준비 띠 (무엇을 준비하는지 + 진행 막대) · 기술 칸에 대기 시간 · 명령 중 표시.
     v5.5: 부위 파괴 · 절단 — 머리 · 팔에"""),
("""<span class="ver">v5.5 · 부위 파괴 · 절단""", """<span class="ver">v5.5.1 · 명령 반응 · 불사 · 부위 파괴 · 절단"""),
("""  '불사': '쓰러져도 몇 초 뒤 일어남 (체력 30%) · 싸우는 중에도 조금씩 재생 · 상처 (팔 · 다리) 가 남지 않음. 구급상자로 바로 일으킬 수 있음',""",
 """  '불사': '죽지 않음 — 쓰러져도 계속 재생해 피가 움직일 만큼 차면 그 적은 피로 일어남 · 상대가 계속 치면 못 일어남 (제압) · 아군이 다 쓰러지면 진짜 죽음 · 상처 · 부위가 남지 않음. 구급상자로 바로 일으킬 수 있음',"""),
# 쓰러진 [불사] 표시
("""    if (ts >= 26){ const t = `[불사] ${f2(Math.max(0, u.riseT - now))}초${pin ? ' · 눌림' : ''}`;""",
 """    if (ts >= 26){ const t = `[불사] 피 ${Math.round(u.hp)}/${Math.round(u.max * undMove(Wd))}${pin ? ' · 눌림' : ' · ' + f2(undEta(Wd, u)) + '초'}`;"""),
("""    const what = u.down ? `쓰러짐 — [불사] ${f2(Math.max(0, u.riseT - Wd.t))}초 뒤 일어남` :""",
 """    const what = u.down ? `쓰러짐 — [불사] 피 ${Math.round(u.hp)}/${Math.round(u.max * undMove(Wd))} 차면 일어남${Wd.t - (u.pinnedT == null ? -9 : u.pinnedT) < 2.5 ? ' (눌림)' : ' (' + f2(undEta(Wd, u)) + '초)'}` :"""),
# 자세한 기록
("""      case 'pinDown': out.push(`${T(e)}${n(e.a)} → 쓰러진 ${n(e.b)} 확인사살 ([불사] 일어나는 때 ${e.rise}초 뒤로)`); break;""",
 """      case 'pinDown': out.push(`${T(e)}${n(e.a)} → 쓰러진 ${n(e.b)} ${e.dmg != null ? `눌러 둠 (−${e.dmg} · 피 ${e.hp}/${e.need} — 일어나지 못하게)` : `확인사살 ([불사] 일어나는 때 ${e.rise}초 뒤로)`}`); break;
      case 'cancel': out.push(`${T(e)}${n(e.a)} 하던 ${{ atk: '공격 준비', throw: '투창 조준', skill: '약 붓기', heal: '치유', bash: '방패 밀치기', reload: '재장전', burst: '점사' }[e.was] || '동작'} 멈추고 새 명령을 따름`); break;"""),
("""      case 'down': out.push(`${T(e)}${n(e.b)} 쓰러짐 ([불사] — ${e.rise}초 뒤 일어남, ${n(e.a)}의 공격)`); break;""",
 """      case 'down': out.push(`${T(e)}${n(e.b)} 쓰러짐 ([불사] — ${e.need != null ? `피가 ${e.need}까지 차면 일어남 (~${e.eta}초)` : e.rise + '초 뒤 일어남'}, ${n(e.a)}의 공격)`); break;"""),
("""      case 'die': out.push(`${T(e)}✕ ${n(e.b)} 쓰러짐 (${n(e.a)}의 공격${e.ff ? ', 아군 오사' : ''})`); break;""",
 """      case 'die': out.push(e.alone ? `${T(e)}✕ ${n(e.b)} — 아군이 모두 쓰러져 [불사] 도 끝 (진짜 죽음)` : `${T(e)}✕ ${n(e.b)} 쓰러짐 (${n(e.a)}의 공격${e.ff ? ', 아군 오사' : ''}${e.last ? ' — 홀로 남은 [불사], 진짜 죽음' : ''})`); break;"""),
("""      case 'wind': if (e.jav){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 투창 조준 (${f2(e.end)}초에 던짐)${e.why && e.why !== '투창' ? ' · ' + e.why : ''}${e.hid ? ' [아군에겐 안 보임]' : ''}`); break; }""",
 """      case 'wind': if (e.jav){ out.push(`${T(e)}${n(e.a)} → ${n(e.b)} 투창 조준 (${f2(e.end)}초에 던짐)${e.why && e.why !== '투창' ? ' · ' + e.why : ''}${e.ffRisk ? ` · 오사 감수 (동료를 맞힐 확률 ~${Math.round(e.ffRisk * 100)}%)` : ''}${e.hid ? ' [아군에겐 안 보임]' : ''}`); break; }"""),
("""        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.heal ? '치유' : '공격'} 준비 (${f2(e.end)}초에 ${e.heal ? '치유' : '맞음'})${e.why && e.why !== '공격' ? ' · ' + e.why : ''}${e.hid ? ' [아군에겐 안 보임]' : ''}`); break;""",
 """        out.push(`${T(e)}${n(e.a)} → ${n(e.b)} ${e.heal ? '치유' : '공격'} 준비 (${f2(e.end)}초에 ${e.heal ? '치유' : '맞음'})${e.why && e.why !== '공격' ? ' · ' + e.why : ''}${e.ffRisk ? ` (동료를 맞힐 확률 ~${Math.round(e.ffRisk * 100)}%)` : ''}${e.hid ? ' [아군에겐 안 보임]' : ''}`); break;"""),
# 이야기
("""    case 'wind': { const a = U(e.a), b = U(e.b), far = isFar(a);""", """    case 'wind': { const a = U(e.a), b = U(e.b), far = isFar(a);
      if (e.ffRisk && a.side === 0) return { c: 'bad', s: `${ga(a.name)} 명령대로 동료 너머 ${reul(b.name)} ${e.jav ? '겨눠 창을 든다' : '겨눈다'} — 동료를 맞힐 수도 있다 (~${Math.round(e.ffRisk * 100)}%).` };   // v5.5.1 오사 감수"""),
("""    case 'down': return { c: U(e.b).side ? 'good' : 'dim', s: `${ga(n(e.b))} 쓰러진다… 그러나 [불사] — ${e.rise}초 뒤 다시 일어난다.` };""",
 """    case 'down': return { c: U(e.b).side ? 'good' : 'dim', s: `${ga(n(e.b))} 쓰러진다… 그러나 [불사] — 피가 차오르면 다시 일어난다.` };"""),
("""s: `${ga(n(e.a))} 쓰러진 ${reul(n(e.b))} 내리친다. [불사] 의 재생이 늦어진다 (${e.rise}초).` }; }""",
 """s: `${ga(n(e.a))} 쓰러진 ${reul(n(e.b))} 내리친다. [불사] 의 피가 차오르지 못한다.` }; }"""),
("""    case 'die': return U(e.b).side === 1 ? { c: 'good', s: `${ga(n(e.b))} 쓰러진다.` } : { c: 'bad', s: `${ga(n(e.b))} 쓰러졌다…` };""",
 """    case 'die': if (e.last) return { c: U(e.b).side ? 'good' : 'bad', s: e.alone ? `동료가 모두 쓰러졌다. ${ga(n(e.b))} 이번엔 일어나지 못한다.` : `${ga(n(e.b))} 홀로 남아 쓰러졌다 — 이번엔 일어나지 못한다.` };
      return U(e.b).side === 1 ? { c: 'good', s: `${ga(n(e.b))} 쓰러진다.` } : { c: 'bad', s: `${ga(n(e.b))} 쓰러졌다…` };"""),
# 준비 띠 (이름 밑)
("""      ctx.fillStyle = '#e9e0d2'; ctx.fillText(nm, px, py + r + 6);
    }
    ctx.globalAlpha = 1;
  }""", """      ctx.fillStyle = '#e9e0d2'; ctx.fillText(nm, px, py + r + 6);
    }
    // v5.5.1 준비 띠: 무엇을 준비하는지 (아이콘 · 이름 · 대상) + 진행 막대 — 이름 밑
    if (!ed && u.act && (u.act.phase === 'wind' || u.act.k === 'reload') && ts >= 16){
      const A = u.act, k = A.k, tb = Wd.units[A.b];
      const nm2 = k === 'skill' ? '✚ ' + (u.skill ? u.skill.name : '약') : k === 'heal' ? '✚ 치유' : k === 'throw' ? '🔱 투창' : k === 'charge' ? '💨 ' + (u.chargeName || '돌진') + ' 준비' : k === 'bash' ? '🛡 밀치기' : k === 'reload' ? '⟳ 재장전' : k === 'atk' ? (isFar(u) ? '🎯 사격' : A.mode === 'sweep' ? '⚔ 휘두르기' : A.mode === 'smash' ? '⚔ 찍기' : A.mode === 'stomp' ? '⚔ 짓밟기' : '⚔ 공격') : '';
      if (nm2){ const pr = Math.max(0, Math.min(1, (now - A.t0) / Math.max(0.05, A.end - A.t0))), lab = nm2 + (tb && tb !== u && k !== 'reload' && k !== 'atk' ? ' → ' + tb.name : tb === u ? ' (스스로)' : '');
        ctx.font = '700 10px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(lab).width + 10, y = py + r + (ts >= 30 ? 26 : 12);
        const col = k === 'skill' || k === 'heal' ? '#6fe08f' : k === 'throw' ? '#c9a8ff' : u.side ? '#ff7a5a' : '#8ccaff';
        ctx.fillStyle = 'rgba(14,12,18,.9)'; ctx.fillRect(px - tw / 2, y - 7, tw, 15); ctx.fillStyle = col; ctx.fillRect(px - tw / 2, y + 6, tw * pr, 2);
        ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.strokeRect(px - tw / 2 + 0.5, y - 6.5, tw - 1, 14); ctx.fillStyle = '#fff'; ctx.fillText(lab, px, y); }
    }
    ctx.globalAlpha = 1;
  }"""),
# 명령 확인 표시 (머리 위, 잠깐)
("""    } else if (f.k === 'sweep' && age < 0.3){   // v5.2 넓게 휘두른 자리""", """    } else if (f.k === 'ack' && age < 1.4){   // v5.5.1 명령을 받음: 머리 위 작은 띠 (무엇을 · 누구에게). 계획 중엔 다음 턴까지 남음
      const a = Wd.units[f.a]; if (!a.alive) continue; const p = { x: ox + a.x * ts, y: oy + a.y * ts - a.r * ts - (ts >= 30 ? 50 : 34) - age * 10 };
      ctx.globalAlpha = Math.min(1, 2.5 * (1 - age / 1.4)); ctx.font = '800 11px IBM Plex Sans KR, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tw = ctx.measureText(f.s).width + 12; ctx.fillStyle = f.c || '#d9a94e'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(p.x - tw / 2, p.y - 9, tw, 18, 6) : ctx.rect(p.x - tw / 2, p.y - 9, tw, 18); ctx.fill();
      ctx.fillStyle = '#14100c'; ctx.fillText(f.s, p.x, p.y + 0.5); ctx.globalAlpha = 1;
    } else if (f.k === 'sweep' && age < 0.3){   // v5.2 넓게 휘두른 자리"""),
("""function noteOrders(list){ if (mode === 'run' && world) for (const u of list) logEv(world, { k: 'order', a: u.i, o: orderTxt(u.order, u) }); }""",
 """// v5.5.1 명령을 받으면: 준비 중인 동작 · 점사를 바로 끊고 (preempt), 머리 위에 무엇을 · 누구에게 받았는지 잠깐 띄움
const ACK = o => { const t = o && o.b != null && world ? world.units[o.b] : null, tn = t ? t.name : '';
  return !o ? ['자동', '#d8cfc0'] : o.k === 'attack' ? ['⚔ ' + tn, '#ffb27a'] : o.k === 'skill' ? ['✚ ' + tn, '#6fe08f'] : o.k === 'throw' ? ['🔱 ' + tn, '#c9a8ff'] : o.k === 'charge' ? ['💨 ' + tn, '#8ccaff']
    : o.k === 'leap' ? ['↩ 도약', '#8ccaff'] : o.k === 'move' ? ['➜ 이동', '#d9a94e'] : o.k === 'amove' ? ['➜ 공격 이동', '#ff9a86'] : o.k === 'hold' ? ['■ 제자리', '#d8cfc0'] : o.k === 'pick' ? ['줍기', '#d8cfc0'] : ['명령', '#d9a94e']; };
function noteOrders(list){
  if (!world) return;
  for (const u of list){ preempt(world, u); const [s2, c2] = ACK(u.order); world.fx = world.fx.filter(f => !(f.k === 'ack' && f.a === u.i)); world.fx.push({ k: 'ack', a: u.i, s: s2, c: c2, t0: world.t }); }
  if (mode === 'run') for (const u of list) logEv(world, { k: 'order', a: u.i, o: orderTxt(u.order, u) });
}"""),
# 기술 칸: 대기 · 명령 중
("""  return skillPick ? '치유할 아군을 누르세요' : C[0].skill.name + ' (남은 ' + C.map(u => u.skill.left).join('·') + ')';""",
 """  const kcd = Math.max(0, ...C.map(u => u.skill.kit ? u.skill.cdT - Wd.t : 0)), ko = C.find(u => u.order && u.order.k === 'skill');
  return skillPick ? '치유할 아군을 누르세요' : C[0].skill.name + (ko ? ' ▶ ' + Wd.units[ko.order.b].name : '') + (kcd > 0 ? ' · ' + f2(kcd) + '초 뒤' : '') + ' (남은 ' + C.map(u => u.skill.left).join('·') + ')';   // v5.5.1 대기 · 명령 중"""),
("""  if (S2.k === 'throw') return throwPick ? '던질 적을 누르세요' : C.some(u => u.spearHeld) ? '투창' : '투창 (창 없음 — E 로 줍기)';""",
 """  if (S2.k === 'throw'){ const to = C.find(u => u.order && u.order.k === 'throw'); return throwPick ? '던질 적을 누르세요' : C.some(u => u.spearHeld) ? '투창' + (to ? ' ▶ ' + Wd.units[to.order.b].name : '') : '투창 (창 없음 — E 로 줍기)'; }"""),
("""  for (const u of C) u.order = { k: 'skill', b: t.i };
  noteOrders(C); skillPick = null; toast(`${t.name}에게 약을 쓰라고 했어요`); hud(); return true;""",
 """  for (const u of C) u.order = { k: 'skill', b: t.i };
  const cdw = Math.max(0, ...C.map(u => u.skill.kit ? u.skill.cdT - world.t : 0));
  noteOrders(C); skillPick = null; toast(cdw > 0 ? `${t.name}에게 약 — 구급상자는 ${f2(cdw)}초 뒤라 곁으로 가서 기다려요` : `${t.name}에게 약을 쓰라고 했어요 (하던 준비는 멈춤)`); hud(); return true;"""),
# 명령 선: 달리는 중에도 잘 보이게 · 투창 선
("""        const on = sel.has(u.i), al = plan ? (on ? .95 : .55) : .35;""", """        const on = sel.has(u.i), al = plan ? (on ? .95 : .55) : (on || ['skill', 'throw', 'charge'].includes(u.order.k) ? .75 : .35);   // v5.5.1 기술 명령은 진행 중에도 잘 보이게"""),
("""        if (u.order.k === 'attack' || u.order.k === 'charge'){ const t = Wd.units[u.order.b]; if (t.alive && (t.seenBy || see)){""",
 """        if (u.order.k === 'throw') ctx.strokeStyle = `rgba(201,168,255,${al})`;   // v5.5.1 투창 명령 = 보라 선
        if (u.order.k === 'attack' || u.order.k === 'charge' || u.order.k === 'throw'){ const t = Wd.units[u.order.b]; if (t.alive && (t.seenBy || see)){"""),
# 수치표
("""['undying.rise', '[불사]: 일어나기까지 (초)'], ['undying.hp', '[불사]: 일어날 때 체력 비율'],""", """['undying.move', '[불사]: 일어나 움직이는 피 (최대 체력 비율)'],"""),
("""['undying.pin', '[불사]: 쓰러진 채 맞으면 (확인사살) 일어나는 때가 밀리는 시간 (초)'],""", """['undying.pinHit', '[불사]: 쓰러진 채 맞으면 깎이는 피 (공격 ×)'],"""),
]
for o,n in pairs:
    if s.count(o)!=1: print('MISMATCH',s.count(o),o[:120]); sys.exit(1)
for o,n in pairs: s=s.replace(o,n)
open(p,'w',encoding='utf-8').write(s); print('ok')
