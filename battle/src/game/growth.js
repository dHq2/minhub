/* 성장: 한 판에서 한 일대로 등급 특성이 오른다 — 원본 v8.8.0 GROW / growFor 를 화면 의존 없이 옮김.
 * 맞힌 사격 → 사격 · 피함 → 회피 · 걸음 → 속력 · 근접 피해 → 근력 · 막아 낸 공격 → 방어 · 치유 → 의학 · 닿은 명령 → 지휘 · 받은 피해 → 체력.
 * 한 판에 둘까지, 상한 A (속력 · 근력은 B). 재능(0.7 ~ 1.3)은 인물 · 갈래마다 달라 문턱이 다르다. */
GB.Growth = (function () {
  const GROW = {
    사격: { need: 8, cap: 'A', by: 'hits' }, 회피: { need: 4, cap: 'A', by: 'dodges' }, 속력: { need: 140, cap: 'B', by: 'moved' },
    근력: { need: 160, cap: 'B', by: 'meleeDealt' }, 방어: { need: 12, cap: 'A', by: 'blocked' }, 의학: { need: 60, cap: 'A', by: 'healed', base: 'C' },
    지휘: { need: 40, cap: 'A', by: 'cmds' }, 체력: { need: 90, step: 5, max: 20, by: 'taken' }
  };
  const GRADE_UP = { '': 'C', E: 'D', D: 'C', C: 'B', B: 'A', A: 'S' }, GRADE_N = { '': 0, E: -2, D: -1, C: 1, B: 2, A: 3, S: 4 };
  const grOf = (p, k) => ((p.traits || []).find(t => t.length === k.length + 1 && t.indexOf(k) === 0 && 'SABCDE'.indexOf(t.slice(-1)) >= 0) || '').slice(-1);
  const talent = (ref, k) => { let h = 2166136261; for (const c of String(ref) + '|' + k) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return 0.7 + ((h >>> 0) % 1000) / 1000 * 0.6; };

  // 판이 끝난 월드에서 아군마다 한 일을 센다 (원본 stageStats)
  function stats(W) {
    const dodges = {};
    for (const l of W.log) if (l.k === 'dodge') dodges[l.a] = (dodges[l.a] || 0) + 1;
    const out = {};
    for (const u of W.units) {
      if (u.side !== 0 || u.summon) continue;
      const w0 = (W.rules.weapons || {})[(u.kit0 && u.kit0.weapon) || u.weapon] || {};
      const ranged = w0.kind === '활' || w0.kind === '총포류' || w0.kind === '마법';
      out[u.pid] = {
        alive: u.alive, kills: u.kills || 0, dealt: Math.round(u.dealt || 0), taken: Math.round(u.taken || 0), blocked: u.blocked || 0,
        shots: u.shots || 0, hits: Math.max(0, (u.shots || 0) - (u.miss || 0)), healed: Math.round(u.healed || 0), moved: Math.round(u.moved || 0),
        dodges: dodges[u.i] || 0, meleeDealt: ranged ? 0 : Math.round(u.dealt || 0), cmds: u.cmdOk || 0
      };
    }
    return out;
  }

  // 설계 p 를 st (한 일) 로 키운다. 올라간 것의 글을 돌려줌 (설계 p 를 직접 고침)
  function apply(p, st, rules, lim) {
    const out = [], key = p.ref || p.name, L = lim || 2;
    p.traits = p.traits || [];
    const did = k => (st[GROW[k].by] || 0) * talent(key, k) / GROW[k].need;
    for (const k of Object.keys(GROW).filter(k => k !== '체력' && did(k) >= 1).sort((a, b) => did(b) - did(a))) {
      const G = GROW[k]; if (out.length >= L) break;
      const cur = grOf(p, k); if (cur && GRADE_N[cur] >= GRADE_N[G.cap]) continue;
      if (k === '근력' && !cur) {   // 근력은 새로 생기지 않음 — 공격 +2
        if ((p.growAtk || 0) >= 10) continue;
        p.ov = p.ov || {}; p.ov.atk = (p.ov.atk != null ? +p.ov.atk : E.statsOf({ ...p, ov: {} }, rules).atk) + 2; p.growAtk = (p.growAtk || 0) + 2;
        out.push('공격 +2 (' + p.ov.atk + ')'); continue;
      }
      const nx = GRADE_UP[cur || G.base || ''];
      if (!nx || GRADE_N[nx] > GRADE_N[G.cap]) continue;
      p.traits = p.traits.filter(t => !(t.length === k.length + 1 && t.indexOf(k) === 0 && 'SABCDE'.indexOf(t.slice(-1)) >= 0)).concat([k + nx]);
      out.push(cur ? k + ' ' + cur + ' → ' + nx : k + ' ' + nx + ' 새로 얻음');
    }
    const H = GROW.체력;
    if (out.length < L && st.taken >= H.need / talent(key, '체력') && (p.growHp || 0) < H.max) {
      p.ov = p.ov || {}; p.ov.hp = (p.ov.hp != null ? +p.ov.hp : E.statsOf({ ...p, ov: {} }, rules).hp) + H.step; p.growHp = (p.growHp || 0) + H.step;
      out.push('체력 +' + H.step + ' (' + p.ov.hp + ')');
    }
    if (out.length) p.grown = (p.grown || []).concat(out);
    return out;
  }
  return { stats: stats, apply: apply, GROW: GROW };
})();
