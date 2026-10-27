/* 전투 기록: 매 판 (설정 · 편성 · 내 명령 · 엔진 사건 · 결과)을 하나의 JSON 으로 만들고, 사람이 읽는 TXT 로도 바꾼다.
 * 엔진 사건(W.log)의 a · b 는 유닛 번호 — units 표로 이름을 찾는다. 판 재현: 같은 seed · 같은 편성 · cmds 의 순서대로 명령. */
GB.BattleLog = (function () {
  const KEEP = { hit: 1, die: 1, wound: 1, charge: 1, throw: 1, drop: 1, pickItem: 1, heal: 1, tend: 1, stomp: 1, cgOn: 1, cgOff: 1, chiefOn: 1, chiefOff: 1,
    cmdRecv: 1, cmdMiss: 1, plan: 1, stance: 1, posture: 1, mateRescue: 1, pact: 1, crit: 1, crawl: 1, knock: 1, stun: 1, lineForm: 1, lineBreak: 1, cleared: 1, equip: 1, sweep: 1 };
  const MAX_EV = 14000;

  function make(B, run, summary) {
    const W = B.W, ev = [];
    for (const l of W.log) { if (!KEEP[l.k]) continue; const o = { t: l.t, k: l.k }; for (const k in l) if (k !== 't' && k !== 'k' && k !== 'vis' && typeof l[k] !== 'object') o[k] = l[k]; ev.push(o); if (ev.length >= MAX_EV) break; }
    return {
      v: GB.VERSION, id: 'b' + Date.now().toString(36), at: new Date().toISOString(), seed: B.seed, stage: B.stage || 0, map: B.map, t: +W.t.toFixed(1), result: B.result,
      units: W.units.map(u => ({ i: u.i, side: u.side, name: u.name, kind: GB.kindOf(u), size: u.sizeCls || '', weapon: u.weapon, shield: !!u.shield, hp: u.max,
        gear: Object.keys(u.gear || {}).join('+'), medic: !!(u.skill && u.skill.kit), alive: u.alive, kills: u.kills || 0, dealt: Math.round(u.dealt || 0), taken: Math.round(u.taken || 0) })),
      cmds: B.cmdLog, events: ev, summary: summary || null, run: run ? { id: run.id, stage: run.stage, roster: run.roster.length } : null
    };
  }
  // 한 사건 → 한 줄 (없으면 null). nm(i) = 번호 → 이름
  function line(e, nm) {
    const t = '[' + e.t.toFixed(1) + 's] ';
    switch (e.k) {
      case 'hit': return t + nm(e.a) + ' → ' + nm(e.b) + (e.part ? ' ' + e.part : '') + (e.block ? ' 막힘' : ' 명중') + ' -' + e.dmg + (e.hcrit ? ' [치명]' : '') + (e.ff ? ' [오사]' : '') + ' (남은 ' + e.hp + ')';
      case 'die': return t + nm(e.b) + ' 쓰러짐' + (e.how ? ' (' + e.how + ')' : '') + (e.a != null && e.a !== e.b ? ' ← ' + nm(e.a) : '');
      case 'wound': return t + nm(e.b != null ? e.b : e.a) + ' 상처: ' + (e.txt || e.w || '');
      case 'charge': return t + nm(e.a) + ' 돌격' + (e.b != null ? ' → ' + nm(e.b) : '');
      case 'throw': return t + nm(e.a) + ' 투척 → ' + nm(e.b);
      case 'drop': return t + nm(e.a) + ' ' + (e.name || '') + ' 떨어뜨림';
      case 'pickItem': return t + nm(e.a) + ' ' + (e.name || '') + ' 주움';
      case 'heal': return t + nm(e.a) + ' 치료 → ' + nm(e.b) + ' +' + e.amt;
      case 'tend': return t + nm(e.a) + ' 돌봄 → ' + nm(e.b);
      case 'stomp': return t + nm(e.a) + ' 짓밟음 → ' + nm(e.b);
      case 'cmdRecv': return t + nm(e.a) + ' 명령 받음 (' + (e.via || '') + ' ' + (e.sec != null ? e.sec + 's' : '') + ')';
      case 'cmdMiss': return t + nm(e.a) + ' 명령 못 받음';
      case 'plan': return t + '[' + (e.side ? '적' : '아군') + ' 작전] ' + e.p + (e.why ? ' — ' + e.why : '');
      case 'cgOn': return t + '전우조: ' + (e.ids || []).map(nm).join(' + ');
      case 'mateRescue': return t + nm(e.a) + ' 전우 ' + nm(e.v) + ' 구하러 → ' + nm(e.b);
      default: return null;
    }
  }
  function text(rec) {
    const nm = i => { const u = rec.units[i]; return u ? (u.side ? '적 ' : '') + u.name : '?'; };
    const lines = [];
    lines.push('굴 전투판 단순판 ' + rec.v + ' · 전투 기록 · 단계 ' + rec.stage + ' · 시드 ' + rec.seed + ' · ' + rec.at);
    rec.units.forEach(u => lines.push((u.side ? '[적] ' : '[아군] ') + u.name + ' ' + u.kind + ' ' + u.size + ' ' + u.weapon + (u.shield ? '+방패' : '') + ' 체력' + u.hp + (u.gear ? ' 장비:' + u.gear : '') + (u.medic ? ' 의무' : '') +
      ' → ' + (u.alive ? '생존' : '쓰러짐') + ' 처치' + u.kills + ' 가한피해' + u.dealt + ' 받은피해' + u.taken));
    lines.push('----');
    for (const e of rec.events) { const l = line(e, nm); if (l) lines.push(l); }
    lines.push('----', '결과: ' + ({ win: '승리', lose: '패배', time: '시간 초과' }[rec.result] || rec.result) + ' · ' + rec.t + '초');
    return lines.join('\n');
  }
  return { make: make, text: text, line: line, KEEP: KEEP };
})();
