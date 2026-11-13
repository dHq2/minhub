/* 세희 계정·동기화 서버 v2 — Cloudflare Worker + D1  (v2 2026-11-13: /og 대표 사진 찾기 추가)
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
      if (path === '/og' && req.method === 'GET') return json(req, 200, await og(url.searchParams.get('u') || ''));
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
