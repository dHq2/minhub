/* 세희 계정·동기화 서버 v1 — Cloudflare Worker + D1
   ─ 하는 일
     · 암호(PIN)로 로그인 → 그 사람의 판·대화·보드·설정을 어느 브라우저에서든 연다
     · 한 사람은 한 기기에서만 열린다. 새 기기에서 로그인하면 예전 기기는 다음 확인 때 닫힌다
     · 앱이 바뀐 것만 그때그때 올린다(실시간 저장)
   ─ 넣어야 하는 것 (Cloudflare 대시보드)
     · D1 데이터베이스를 만들어 이 Worker 에 'DB' 라는 이름으로 연결
     · 비밀 변수(Secret) PINS = "이름:암호" (여러 명이면 쉼표로. 예: minsu:1234,guest:5678)
       ※ 암호는 코드에 쓰지 않는다. 이 파일은 공개 저장소에 있다
   ─ 지키는 것
     · 암호 5번 틀리면 그 접속(IP)은 15분 잠김. 전체로 1시간에 30번 넘게 틀리면 1시간 잠김
     · 토큰은 서버에 해시로만 남긴다 */
const ORIGINS = ['https://dhq2.github.io', 'http://localhost:8765', 'http://127.0.0.1:8765'];
const LOCK_AFTER = 5, LOCK_MS = 15 * 60e3, GLOBAL_MAX = 30, MAX_BODY = 20e6;

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
  if (!cur || !cur.token_hash) return { bad:'logged-out' };
  if (!same(await sha(raw), cur.token_hash)) return { bad:'replaced', device:cur.device, at:cur.at };
  return { user, device:cur.device };
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

export default {
  async fetch(req, env){
    if (req.method === 'OPTIONS') return new Response(null, { status:204, headers:cors(req) });
    const url = new URL(req.url), path = url.pathname.replace(/\/+$/, '') || '/';
    try{
      if (!env.DB) return json(req, 500, { error:'D1 데이터베이스가 DB 라는 이름으로 연결돼 있지 않아요' });
      await setup(env.DB);
      if (path === '/' ) return json(req, 200, { ok:true, name:'sehee-sync', v:1 });

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
        const prev = await env.DB.prepare('SELECT device, at FROM current WHERE user = ?').bind(user).first();
        await env.DB.prepare('INSERT INTO current (user, token_hash, device, at) VALUES (?, ?, ?, ?) ON CONFLICT(user) DO UPDATE SET token_hash = excluded.token_hash, device = excluded.device, at = excluded.at')
          .bind(user, await sha(token), device, now).run();
        const cnt = await env.DB.prepare('SELECT COUNT(*) AS n, MAX(at) AS last FROM records WHERE user = ?').bind(user).first();
        return json(req, 200, { ok:true, token, user, device, prev:prev && prev.device || null, records:cnt.n || 0, last:cnt.last || 0 });
      }

      const a = await auth(req, env, url);
      if (a.bad) return json(req, 401, { error:a.bad, device:a.device || null, at:a.at || null });

      if (path === '/session') return json(req, 200, { ok:true, user:a.user, device:a.device });
      if (path === '/data' && req.method === 'GET'){
        const rows = (await env.DB.prepare('SELECT k, v, ver, at FROM records WHERE user = ?').bind(a.user).all()).results || [];
        const out = {}; for (const r of rows) out[r.k] = { v:JSON.parse(r.v), ver:r.ver, at:r.at };
        return json(req, 200, { ok:true, records:out });
      }
      if ((path === '/data' || path === '/beacon') && req.method === 'POST'){
        const len = +(req.headers.get('content-length') || 0); if (len > MAX_BODY) return json(req, 413, { error:'too-big' });
        const body = path === '/beacon' ? JSON.parse(await req.text() || '{}') : await req.json();
        return json(req, 200, await save(env, a.user, body));
      }
      if (path === '/logout' && req.method === 'POST'){
        await env.DB.prepare('UPDATE current SET token_hash = NULL WHERE user = ?').bind(a.user).run();
        return json(req, 200, { ok:true });
      }
      return json(req, 404, { error:'not-found' });
    }catch(e){ return json(req, 500, { error:String(e && e.message || e) }); }
  },
};
