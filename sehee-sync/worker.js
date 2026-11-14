/* 세희 계정·동기화 서버 v3 — Cloudflare Worker + D1
   (v2 2026-11-13: /og 대표 사진 찾기 · v3 2026-11-14: 개발 블랙박스(/log) · 비공개 GitHub 금고로 내보내기 · 보기 전용 관전석)
   ─ 하는 일
     · 암호(PIN)로 로그인 → 그 사람의 판·대화·보드·설정을 어느 브라우저에서든 연다
     · 한 사람은 한 기기에서만 열린다. 새 기기에서 로그인하면 예전 기기는 다음 확인 때 닫힌다
     · 앱이 바뀐 것만 그때그때 올린다(실시간 저장)
   ─ 넣어야 하는 것 (Cloudflare 대시보드)
     · D1 데이터베이스를 만들어 이 Worker 에 'DB' 라는 이름으로 연결
     · 비밀 변수(Secret) PINS = "이름:암호" (여러 명이면 쉼표로. 예: minsu:1234,guest:5678)
       ※ 암호는 코드에 쓰지 않는다. 이 파일은 공개 저장소에 있다
     · (v3, 선택) LOG_USERS = 개발 기록을 받을 계정 이름(쉼표로). 비우면 개발 기록을 아무것도 안 받는다
     · (v3, 선택) GH_REPO = "주인/저장소"(비공개 로그 금고), GH_TOKEN = 그 저장소에만 쓸 수 있는 GitHub 토큰(Secret)
     · (v3, 선택) 트리거 → 크론: 5분마다 한 번(크론 식은 README) — 5분마다 금고로 내보내고, 30일 지난 기록을 치운다
   ─ 지키는 것
     · 암호 5번 틀리면 그 접속(IP)은 15분 잠김. 전체로 1시간에 30번 넘게 틀리면 1시간 잠김
     · 토큰은 서버에 해시로만 남긴다 */
const ORIGINS = ['https://dhq2.github.io', 'http://localhost:8765', 'http://127.0.0.1:8765'];
const LOCK_AFTER = 5, LOCK_MS = 15 * 60e3, GLOBAL_MAX = 30, MAX_BODY = 20e6;
const OBS_MS = 30 * 86400e3, LOG_KEEP_MS = 30 * 86400e3, D1_KEEP_MS = 3 * 86400e3, LOG_BATCH = 400;   /* 금고 30일, D1 은 3일만(쓰기 한도 아끼기) */

const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
const sha = async s => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));
const rand = n => hex(crypto.getRandomValues(new Uint8Array(n)));
function same(a, b){ if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }

let ready = false;
async function setup(db){
  if (ready) return;
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS current (user TEXT PRIMARY KEY, token_hash TEXT, device TEXT, at INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS records (user TEXT, k TEXT, v TEXT, ver INTEGER, at INTEGER, PRIMARY KEY (user, k))'),
    db.prepare('CREATE TABLE IF NOT EXISTS fails (ip TEXT PRIMARY KEY, n INTEGER, until INTEGER, at INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS observers (token_hash TEXT PRIMARY KEY, user TEXT, device TEXT, at INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS logs (user TEXT, dev TEXT, n INTEGER, t INTEGER, c TEXT, m TEXT, d TEXT, sent INTEGER DEFAULT 0, PRIMARY KEY (user, dev, n))'),
    db.prepare('CREATE TABLE IF NOT EXISTS logcursor (user TEXT PRIMARY KEY, rid INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS devstate (user TEXT, dev TEXT, v TEXT, at INTEGER, PRIMARY KEY (user, dev))'),
  ]);
  ready = true;
}
function cors(req){
  const o = req.headers.get('origin') || '';
  return { 'access-control-allow-origin':ORIGINS.includes(o) ? o : ORIGINS[0], 'access-control-allow-methods':'GET,POST,OPTIONS',
    'access-control-allow-headers':'content-type,authorization', 'access-control-max-age':'600', vary:'Origin' };
}
const json = (req, status, body) => new Response(JSON.stringify(body), { status, headers:{ ...cors(req), 'content-type':'application/json' } });

async function auth(req, env, url){
  const raw = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '') || url.searchParams.get('t') || '';
  const user = raw.split('.')[0];
  if (!user || !raw.includes('.')) return { bad:'no-token' };
  const cur = await env.DB.prepare('SELECT token_hash, device, at FROM current WHERE user = ?').bind(user).first();
  const h = await sha(raw);
  if (cur && cur.token_hash && same(h, cur.token_hash)) return { user, device:cur.device };
  /* v3 관전석 — 보기만 하는 두 번째 자리. 주 기기를 밀어내지 않는다(30일) */
  const ob = await env.DB.prepare('SELECT user, device, at FROM observers WHERE token_hash = ?').bind(h).first();
  if (ob && ob.user === user && Date.now() - ob.at < OBS_MS) return { user, device:ob.device, observer:true };
  if (!cur || !cur.token_hash) return { bad:'logged-out' };
  return { bad:'replaced', device:cur.device, at:cur.at };
}
async function save(env, user, body){
  const now = Date.now(), stmts = [];
  for (const [k, v] of Object.entries(body.puts || {})){
    if (typeof k !== 'string' || k.length > 200) continue;
    stmts.push(env.DB.prepare('INSERT INTO records (user, k, v, ver, at) VALUES (?, ?, ?, 1, ?) ON CONFLICT(user, k) DO UPDATE SET v = excluded.v, ver = records.ver + 1, at = excluded.at')
      .bind(user, k, JSON.stringify(v), now));
  }
  for (const k of (body.dels || [])) stmts.push(env.DB.prepare('DELETE FROM records WHERE user = ? AND k = ?').bind(user, String(k)));
  for (let i = 0; i < stmts.length; i += 50) await env.DB.batch(stmts.slice(i, i + 50));
  return { ok:true, at:now, n:stmts.length };
}

/* ── /og?u=주소 (v2, 2026-11-13) — 그 페이지 대표 사진·제목 ──
   세희가 웹 검색으로 찾은 상품·글의 사진을 보여 주려고. 로그인한 사람만, 공개 주소(http/https, 사설·내부 주소 막음)만,
   앞부분 300KB·6초까지만 읽는다. og:image → twitter:image → 상품 사진처럼 보이는 첫 <img> 순서로 고른다. */
const PRIVATE_HOST = /^(localhost|.*\.local|.*\.internal|0\.0\.0\.0|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|\[?::1\]?|\[?f[cd]|\[?fe80)/i;
const absu = (u, base) => { try{ return new URL(u.replace(/&amp;/g, '&'), base).href; }catch(e){ return ''; } };
const meta = (html, key) => { const re = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*>`, 'i'), m = html.match(re); if (!m) return ''; const c = m[0].match(/content=["']([^"']+)["']/i); return c ? c[1] : ''; };
async function og(target){
  let u; try{ u = new URL(target); }catch(e){ return { error:'bad-url' }; }
  if (!/^https?:$/.test(u.protocol) || PRIVATE_HOST.test(u.hostname) || /^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)) return { error:'blocked' };
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 6000);
  let html = '';
  try{
    const r = await fetch(u.href, { signal:ctl.signal, redirect:'follow', headers:{ 'user-agent':'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36 sehee-og', 'accept':'text/html,*/*;q=0.8', 'accept-language':'ko,en;q=0.7' } });
    if (!/text\/html|xml/i.test(r.headers.get('content-type') || '')) return { error:'not-html' };
    const rd = r.body.getReader(), dec = new TextDecoder(); let n = 0;
    while (n < 300000){ const { done, value } = await rd.read(); if (done) break; n += value.length; html += dec.decode(value, { stream:true }); if (/<\/head>/i.test(html) && /og:image/i.test(html)) break; }
    try{ rd.cancel(); }catch(e){}
  }catch(e){ return { error:'fetch-failed' }; } finally { clearTimeout(timer); }
  const base = u.href;
  let img = meta(html, 'og:image') || meta(html, 'og:image:url') || meta(html, 'twitter:image') || meta(html, 'twitter:image:src');
  if (!img || /logo|favicon|sprite|default|og_?img|share_?img|blank/i.test(img)){
    const imgs = [...html.matchAll(/<img[^>]+(?:data-src|data-original|src)=["']([^"']+\.(?:jpe?g|png|webp)(?:\?[^"']*)?)["']/gi)].map(m => m[1]);
    const good = imgs.find(x => !/logo|icon|sprite|banner|btn|blank|loading|common|ad[_-]|pixel/i.test(x));
    if (good) img = good;
  }
  const title = (meta(html, 'og:title') || (html.match(/<title[^>]*>([^<]{1,200})<\/title>/i) || [])[1] || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  const site = (meta(html, 'og:site_name') || u.hostname.replace(/^www\./, '')).slice(0, 40);
  return { ok:true, img:img ? absu(img, base) : '', title, site, url:u.href };
}

/* ── v3 개발 블랙박스를 비공개 GitHub 금고로 (5분마다) ──
   한 번에 계정마다 최대 400줄을 logs/날짜(한국)/시분초-계정.jsonl 새 파일 하나로 올린다(덮어쓰기 없음). 어디까지 올렸는지는 logcursor 한 줄(줄마다 표시하면 쓰기가 두 배).
   한 시간에 한 번: D1 의 3일 지난 줄을 지우고(금고에 이미 있음), 금고의 30일 지난 날짜 폴더 파일을 몇 개씩 지운다. */
const logUser = (env, user) => String(env.LOG_USERS || '').split(',').map(x => x.trim()).filter(Boolean).includes(user);
const kst = t => new Date(t + 9 * 3600e3).toISOString();   /* '2026-11-14T23:40:00.000Z' 꼴이지만 한국 시각 */
function b64(text){ const by = enc.encode(text); let s = ''; for (let i = 0; i < by.length; i += 0x8000) s += String.fromCharCode(...by.subarray(i, i + 0x8000)); return btoa(s); }
function gh(env, path, init){
  return fetch(`${env.GH_API || 'https://api.github.com'}/repos/${env.GH_REPO}/contents/${path}`, { ...init,
    headers:{ authorization:'Bearer ' + env.GH_TOKEN, accept:'application/vnd.github+json', 'user-agent':'sehee-sync', 'content-type':'application/json', 'x-github-api-version':'2022-11-28' } });
}
async function exportLogs(env){
  const out = { users:0, lines:0, files:0, err:[] };
  if (!env.GH_REPO || !env.GH_TOKEN) return { ...out, skip:'금고 설정 없음' };
  for (const user of String(env.LOG_USERS || '').split(',').map(x => x.trim()).filter(Boolean)){
    const cur = await env.DB.prepare('SELECT rid FROM logcursor WHERE user = ?').bind(user).first();
    const rows = (await env.DB.prepare('SELECT rowid AS r, dev, n, t, c, m, d FROM logs WHERE user = ? AND rowid > ? ORDER BY rowid LIMIT ?').bind(user, cur ? cur.rid : 0, LOG_BATCH).all()).results || [];
    if (!rows.length) continue; out.users++;
    const states = (await env.DB.prepare('SELECT dev, v, at FROM devstate WHERE user = ?').bind(user).all()).results || [];
    const t0 = kst(rows[0].t), day = t0.slice(0, 10), stamp = t0.slice(11, 19).replace(/:/g, '');
    const text = [...states.map(x => JSON.stringify({ type:'state', dev:x.dev, at:kst(x.at).slice(0, 19), state:JSON.parse(x.v || '{}') })),
      ...rows.map(x => JSON.stringify({ t:kst(x.t).slice(0, 19), dev:x.dev, n:x.n, c:x.c, m:x.m, ...(x.d !== null ? { d:x.d } : {}) }))].join('\n') + '\n';
    const r = await gh(env, `logs/${day}/${stamp}-${user}-${rand(2)}.jsonl`, { method:'PUT', body:JSON.stringify({ message:`log ${user} ${day} ${stamp} (${rows.length})`, content:b64(text) }) });
    if (!r.ok){ out.err.push(user + ':' + r.status); continue; }
    await env.DB.prepare('INSERT INTO logcursor (user, rid) VALUES (?, ?) ON CONFLICT(user) DO UPDATE SET rid = excluded.rid').bind(user, rows[rows.length - 1].r).run();
    out.files++; out.lines += rows.length;
  }
  return out;
}
async function cleanLogs(env){
  const cut = Date.now() - LOG_KEEP_MS; let gone = 0;
  await env.DB.prepare('DELETE FROM logs WHERE t < ? AND rowid <= COALESCE((SELECT rid FROM logcursor WHERE logcursor.user = logs.user), 0)').bind(Date.now() - D1_KEEP_MS).run();   /* 금고로 안 간 줄은 남긴다 */
  await env.DB.prepare('DELETE FROM observers WHERE at < ?').bind(Date.now() - OBS_MS).run();
  if (!env.GH_REPO || !env.GH_TOKEN) return 0;
  const r = await gh(env, 'logs', { method:'GET' }); if (!r.ok) return 0;
  const old = (await r.json()).filter(x => x.type === 'dir' && x.name < kst(cut).slice(0, 10)).slice(0, 2);
  for (const dir of old){
    const fr = await gh(env, 'logs/' + dir.name, { method:'GET' }); if (!fr.ok) continue;
    for (const f of (await fr.json()).slice(0, 20)){ const d = await gh(env, f.path, { method:'DELETE', body:JSON.stringify({ message:'30일 지난 로그 정리', sha:f.sha }) }); if (d.ok) gone++; }
  }
  return gone;
}
async function cron(env){
  if (!env.DB) return; await setup(env.DB);
  const ex = await exportLogs(env);
  if (new Date().getUTCMinutes() < 5) ex.cleaned = await cleanLogs(env);
  return ex;
}

export default {
  async scheduled(event, env, ctx){ ctx.waitUntil(cron(env)); },
  async fetch(req, env){
    if (req.method === 'OPTIONS') return new Response(null, { status:204, headers:cors(req) });
    const url = new URL(req.url), path = url.pathname.replace(/\/+$/, '') || '/';
    try{
      if (!env.DB) return json(req, 500, { error:'D1 데이터베이스가 DB 라는 이름으로 연결돼 있지 않아요' });
      await setup(env.DB);
      if (path === '/' ) return json(req, 200, { ok:true, name:'sehee-sync', v:3, logs:!!String(env.LOG_USERS || '').trim(), vault:!!(env.GH_REPO && env.GH_TOKEN) });

      if (path === '/login' && req.method === 'POST'){
        const ip = req.headers.get('cf-connecting-ip') || 'local', now = Date.now();
        const f = await env.DB.prepare('SELECT n, until FROM fails WHERE ip = ?').bind(ip).first();
        if (f && f.until > now) return json(req, 429, { error:'locked', wait:Math.ceil((f.until - now) / 1000) });
        const g = await env.DB.prepare('SELECT SUM(n) AS n FROM fails WHERE at > ?').bind(now - 3600e3).first();
        if (g && g.n >= GLOBAL_MAX) return json(req, 429, { error:'locked', wait:3600 });
        const b = await req.json().catch(() => ({})), pin = String(b.pin || ''), device = String(b.device || '기기').slice(0, 60);
        const pins = String(env.PINS || '').split(',').map(x => x.trim()).filter(Boolean).map(x => { const i = x.indexOf(':'); return [x.slice(0, i), x.slice(i + 1)]; });
        const hit = pin.length >= 4 && pins.find(([, p]) => same(p, pin));
        if (!hit){
          const n = ((f && f.n) || 0) + 1;
          await env.DB.prepare('INSERT INTO fails (ip, n, until, at) VALUES (?, ?, ?, ?) ON CONFLICT(ip) DO UPDATE SET n = excluded.n, until = excluded.until, at = excluded.at')
            .bind(ip, n >= LOCK_AFTER ? 0 : n, n >= LOCK_AFTER ? now + LOCK_MS : 0, now).run();
          return json(req, 401, { error:'wrong', left:n >= LOCK_AFTER ? 0 : LOCK_AFTER - n, wait:n >= LOCK_AFTER ? LOCK_MS / 1000 : 0 });
        }
        await env.DB.prepare('DELETE FROM fails WHERE ip = ?').bind(ip).run();
        const user = hit[0], token = user + '.' + rand(24);
        if (b.observe === true){   /* v3 관전석 — 주 기기 자리는 그대로 */
          await env.DB.prepare('INSERT INTO observers (token_hash, user, device, at) VALUES (?, ?, ?, ?)').bind(await sha(token), user, device + ' · 관전석', now).run();
          const c2 = await env.DB.prepare('SELECT COUNT(*) AS n FROM records WHERE user = ?').bind(user).first();
          return json(req, 200, { ok:true, token, user, device:device + ' · 관전석', observer:true, records:c2.n || 0 });
        }
        const prev = await env.DB.prepare('SELECT device, at FROM current WHERE user = ?').bind(user).first();
        await env.DB.prepare('INSERT INTO current (user, token_hash, device, at) VALUES (?, ?, ?, ?) ON CONFLICT(user) DO UPDATE SET token_hash = excluded.token_hash, device = excluded.device, at = excluded.at')
          .bind(user, await sha(token), device, now).run();
        const cnt = await env.DB.prepare('SELECT COUNT(*) AS n, MAX(at) AS last FROM records WHERE user = ?').bind(user).first();
        return json(req, 200, { ok:true, token, user, device, prev:prev && prev.device || null, records:cnt.n || 0, last:cnt.last || 0 });
      }

      const a = await auth(req, env, url);
      if (a.bad) return json(req, 401, { error:a.bad, device:a.device || null, at:a.at || null });

      if (path === '/session') return json(req, 200, { ok:true, user:a.user, device:a.device, observer:!!a.observer });
      if (path === '/log' && req.method === 'POST'){   /* v3 개발 블랙박스 — 기기가 새 줄을 올린다 */
        if (!logUser(env, a.user)) return json(req, 200, { ok:true, logging:false });
        const b = await req.json().catch(() => ({})), dev = String(b.dev || a.device || '기기').slice(0, 80), now = Date.now();
        const lines = (Array.isArray(b.lines) ? b.lines : []).slice(-300).filter(l => l && Number.isFinite(+l.n));
        const st = lines.map(l => env.DB.prepare('INSERT OR IGNORE INTO logs (user, dev, n, t, c, m, d) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(a.user, dev, +l.n, +l.t || now, String(l.c || '').slice(0, 20), String(l.m || '').slice(0, 2000), l.d === undefined ? null : String(l.d).slice(0, 8000)));
        if (b.state) st.push(env.DB.prepare('INSERT INTO devstate (user, dev, v, at) VALUES (?, ?, ?, ?) ON CONFLICT(user, dev) DO UPDATE SET v = excluded.v, at = excluded.at').bind(a.user, dev, JSON.stringify(b.state).slice(0, 8000), now));
        if (st.length) await env.DB.batch(st);
        return json(req, 200, { ok:true, logging:true, got:lines.length });
      }
      if (path === '/log' && req.method === 'GET'){   /* v3 모든 기기 기록을 시간순으로 — 앱 「로그」 탭·관전석·점검용 */
        const since = +(url.searchParams.get('since') || 0), lim = Math.min(500, +(url.searchParams.get('n') || 300));
        const rows = (await env.DB.prepare('SELECT dev, n, t, c, m, d FROM logs WHERE user = ? AND t > ? ORDER BY t DESC LIMIT ?').bind(a.user, since, lim).all()).results || [];
        const states = (await env.DB.prepare('SELECT dev, v, at FROM devstate WHERE user = ?').bind(a.user).all()).results || [];
        return json(req, 200, { ok:true, logging:logUser(env, a.user), lines:rows.reverse(), states:states.map(x => ({ dev:x.dev, at:x.at, state:JSON.parse(x.v || '{}') })) });
      }
      if (path === '/og' && req.method === 'GET') return json(req, 200, await og(url.searchParams.get('u') || ''));
      if (path === '/data' && req.method === 'GET'){
        const rows = (await env.DB.prepare('SELECT k, v, ver, at FROM records WHERE user = ?').bind(a.user).all()).results || [];
        const out = {}; for (const r of rows) out[r.k] = { v:JSON.parse(r.v), ver:r.ver, at:r.at };
        return json(req, 200, { ok:true, records:out });
      }
      if ((path === '/data' || path === '/beacon') && req.method === 'POST' && a.observer) return json(req, 403, { error:'observer' });   /* 관전석은 보기만 */
      if ((path === '/data' || path === '/beacon') && req.method === 'POST'){
        const len = +(req.headers.get('content-length') || 0); if (len > MAX_BODY) return json(req, 413, { error:'too-big' });
        const body = path === '/beacon' ? JSON.parse(await req.text() || '{}') : await req.json();
        return json(req, 200, await save(env, a.user, body));
      }
      if (path === '/logout' && req.method === 'POST'){
        if (a.observer){ await env.DB.prepare('DELETE FROM observers WHERE token_hash = ?').bind(await sha((req.headers.get('authorization') || '').replace(/^Bearer\s+/i, ''))).run(); return json(req, 200, { ok:true }); }
        await env.DB.prepare('UPDATE current SET token_hash = NULL WHERE user = ?').bind(a.user).run();
        return json(req, 200, { ok:true });
      }
      return json(req, 404, { error:'not-found' });
    }catch(e){ return json(req, 500, { error:String(e && e.message || e) }); }
  },
};
