/* 저장: 런 상태와 전투 기록을 브라우저에 남긴다. localStorage 가 막힌 곳(아티팩트 미리보기 등)에서는 메모리에만 두고 조용히 넘어간다. */
GB.Store = (function () {
  const KEY_RUN = 'minhub.battle.v3.run', KEY_LOGS = 'minhub.battle.v3.logs', KEEP = 20;
  const mem = {};
  const ls = () => { try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch (e) { return null; } };
  const get = k => { const s = ls(); try { return s ? s.getItem(k) : (mem[k] || null); } catch (e) { return mem[k] || null; } };
  const set = (k, v) => { mem[k] = v; const s = ls(); try { if (s) s.setItem(k, v); return true; } catch (e) { return false; } };
  const del = k => { delete mem[k]; const s = ls(); try { if (s) s.removeItem(k); } catch (e) { /* noop */ } };
  return {
    loadRun() { const s = get(KEY_RUN); if (!s) return null; try { const r = JSON.parse(s); return r && r.v === GB.VERSION.split('.')[0] + '.' + GB.VERSION.split('.')[1] + '.x' ? r : (r && r.roster ? r : null); } catch (e) { return null; } },
    saveRun(run) { return set(KEY_RUN, JSON.stringify(run)); },
    clearRun() { del(KEY_RUN); },
    listLogs() { const s = get(KEY_LOGS); try { return s ? JSON.parse(s) || [] : []; } catch (e) { return []; } },
    saveLog(rec) {
      let list = this.listLogs(); list.push(rec); list = list.slice(-KEEP);
      while (list.length && !set(KEY_LOGS, JSON.stringify(list))) list.shift();   // 용량이 모자라면 오래된 것부터 버림
    },
    flag(k) { return get('minhub.battle.v3.' + k); },
    setFlag(k, v) { set('minhub.battle.v3.' + k, String(v)); }
  };
})();
