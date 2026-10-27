/* 굴 전투판 v1 · log: 매 판 이벤트 로그, 텍스트 변환, 브라우저 저장, JSON/TXT 내보내기 */
(function (root) {
  'use strict';
  const BG = root.BG;
  const U = BG.U;
  const MAX_EV = 9000;
  const KEY_RUN = 'minhub.battle.v1.run';
  const KEY_LOGS = 'minhub.battle.v1.logs';
  const KEEP_LOGS = 25;

  const L = BG.Log = {};

  L.init = function (W) {
    W.log = {
      v: BG.VERSION, id: 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36),
      startedAt: new Date().toISOString(), seed: W.seed, stage: W.stage,
      units: [], events: [], overflow: 0, result: null, summary: null
    };
  };

  L.registerUnit = function (W, u) {
    W.log.units.push({
      id: u.id, side: u.side, uid: u.uid, name: u.name, shape: u.shape, weapon: u.weapon, shield: u.shield,
      rank: BG.RANKS[u.rank].name, stats: {
        hp: Math.round(u.s.hp), atk: Math.round(u.s.atk), def: U.r1(u.s.def), spd: U.r1(u.s.spd),
        blk: Math.round(u.s.blk), stam: Math.round(u.s.stam), shoot: Math.round(u.s.shoot), cmd: Math.round(u.s.cmd)
      }
    });
  };

  L.add = function (W, k, o) {
    const lg = W.log;
    if (lg.events.length >= MAX_EV) { lg.overflow++; return; }
    const e = { t: U.r2(W.t), k: k };
    if (o) for (const key in o) e[key] = o[key];
    lg.events.push(e);
    if (L.onEvent) L.onEvent(W, e);
  };

  const SIDE = { ally: '아군', enemy: '적' };
  function nm(W, id) {
    const u = W.units[id - 1];
    if (!u) return '?';
    return (u.side === 'enemy' && u.name.charAt(0) !== '적' ? '적 ' : '') + u.name;
  }
  const ORD = { move: '이동', hold: '정지 사수', attack: '공격', charge: '돌격', retreat: '이탈', stance: '태세', clear: '명령 해제', auto: '자율' };

  L.text = function (W, e) {
    const t = '[' + U.r1(e.t).toFixed(1) + 's] ';
    switch (e.k) {
      case 'start': return t + '전투 개시';
      case 'hit': {
        const kind = { melee: '', charge: '돌격 ', proj: '사격 ', splash: '폭발 ' }[e.kind] || '';
        return t + nm(W, e.a) + ' → ' + nm(W, e.d) + ' ' + kind + (e.blk ? '막힘 ' : '명중 ') + '-' + e.dmg +
          (e.back ? ' (배후)' : '') + (e.ff ? ' [오사]' : '') + ' (남은 ' + e.hp + ')';
      }
      case 'miss': return t + nm(W, e.a) + ' 헛침';
      case 'shot': return t + nm(W, e.a) + ' 사격 (명중률 ' + Math.round(e.acc * 100) + '%)';
      case 'down': return t + nm(W, e.d) + ' 넘어짐';
      case 'guardbreak': return t + nm(W, e.d) + ' 막기 붕괴(스태미나 소진)';
      case 'dead': return t + nm(W, e.d) + ' 쓰러짐' + (e.a ? ' (' + nm(W, e.a) + ')' : '');
      case 'charge': return t + nm(W, e.a) + ' 돌격 충돌 → ' + nm(W, e.d) + (e.brace ? ' (대기창 반격)' : '');
      case 'cmd': {
        const r = { direct: '직접 전달', relay: '분대장 경유', instant: '즉시', lost: '전달 실패' }[e.route] || e.route;
        return t + (SIDE[e.side] || '') + ' 명령[' + (ORD[e.type] || e.type) + '] → ' + nm(W, e.to) + ' : ' + r +
          (e.delay != null ? ' (' + e.delay.toFixed(1) + 's)' : '') + (e.prio ? ' [우선]' : '');
      }
      case 'stance': return t + nm(W, e.u) + ' 태세 ' + (e.v === 'defend' ? '방어' : '기본');
      case 'squad': return t + (SIDE[e.side] || '') + ' 분대 편성: 분대장 ' + nm(W, e.leader) + ' (' + e.n + '명)';
      case 'squad_end': return t + (SIDE[e.side] || '') + ' 분대 해산';
      case 'main': return t + (SIDE[e.side] || '') + ' 총지휘관: ' + nm(W, e.u) + (e.why ? ' (' + e.why + ')' : '');
      case 'leader': return t + (SIDE[e.side] || '') + ' 분대장: ' + nm(W, e.u) + (e.why ? ' (' + e.why + ')' : '');
      case 'end': return t + '전투 종료: ' + ({ ally: '아군 승리', enemy: '적 승리', draw: '무승부(교착)' }[e.winner]);
      default: return t + e.k;
    }
  };

  L.fullText = function (W) {
    return W.log.events.map(e => L.text(W, e)).join('\n');
  };

  // ---- 저장 ----
  function safeGet(k) { try { return root.localStorage ? root.localStorage.getItem(k) : null; } catch (e) { return null; } }
  function safeSet(k, v) { try { root.localStorage.setItem(k, v); return true; } catch (e) { return false; } }

  L.saveRun = function (run) { return safeSet(KEY_RUN, JSON.stringify(run)); };
  L.loadRun = function () {
    const s = safeGet(KEY_RUN);
    if (!s) return null;
    try { const r = JSON.parse(s); return r && r.v === BG.VERSION ? r : null; } catch (e) { return null; }
  };
  L.clearRun = function () { try { root.localStorage.removeItem(KEY_RUN); } catch (e) { /* noop */ } };

  L.listLogs = function () {
    const s = safeGet(KEY_LOGS);
    if (!s) return [];
    try { return JSON.parse(s) || []; } catch (e) { return []; }
  };
  L.saveLog = function (W, extra) {
    const lg = W.log;
    lg.result = W.result;
    lg.summary = Object.assign({}, extra || {});
    lg.units.forEach(lu => {
      const u = W.units[lu.id - 1];
      lu.res = { alive: u.alive, hp: Math.round(Math.max(0, u.hp)), kills: u.kills, dealt: Math.round(u.dealt), taken: Math.round(u.taken) };
    });
    let list = L.listLogs();
    list.push(lg);
    list = list.slice(-KEEP_LOGS);
    // 용량 초과 시 오래된 것부터 버린다
    while (list.length && !safeSet(KEY_LOGS, JSON.stringify(list))) list.shift();
    return lg;
  };

  L.download = function (filename, text, mime) {
    const blob = new Blob([text], { type: mime || 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  L.fileName = function (lg, ext) {
    return 'battle_log_' + BG.VERSION + '_stage' + lg.stage + '_' + lg.id + '.' + ext;
  };
})(typeof window !== 'undefined' ? window : globalThis);
