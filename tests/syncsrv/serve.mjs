// local Cloudflare Worker + D1 stand-in for testing sehee-sync — v1.1 (2026-11-14): 가짜 GitHub 금고(/__gh)·크론 당기기(/__cron)·금고 보기(/__vault)
import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
const worker = (await import(new URL('../../sehee-sync/worker.js', import.meta.url).href)).default;
const sql = new DatabaseSync(':memory:');
const mk = (q, args = []) => ({
  bind:(...a) => mk(q, a),
  run:async () => { sql.prepare(q).run(...args); return { success:true }; },
  first:async () => sql.prepare(q).get(...args) || null,
  all:async () => ({ results:sql.prepare(q).all(...args) }),
});
const DB = { prepare:q => mk(q), batch:async stmts => { sql.exec('BEGIN'); try{ for (const s of stmts) await s.run(); sql.exec('COMMIT'); }catch(e){ sql.exec('ROLLBACK'); throw e; } return []; } };
const port0 = +(process.env.PORT || 8787);
const env = { DB, PINS:process.env.PINS || 'test:2580', LOG_USERS:'test', GH_REPO:'o/vault', GH_TOKEN:'fake', GH_API:'http://localhost:' + port0 + '/__gh' };
const VAULT = new Map();   /* 가짜 금고 — path → { text, sha } */
const port = +(process.env.PORT || 8787);
http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const r = new Request('http://localhost:' + port + req.url, { method:req.method, headers:req.headers, body:['GET', 'HEAD'].includes(req.method) ? undefined : body });
  const u = new URL(r.url);
  if (u.pathname === '/__cron'){ const done = []; await worker.scheduled({}, env, { waitUntil:p => done.push(p) }); await Promise.all(done); res.writeHead(200, { 'content-type':'application/json' }); res.end(JSON.stringify({ ok:true, files:VAULT.size })); return; }
  if (u.pathname === '/__vault'){ res.writeHead(200, { 'content-type':'application/json' }); res.end(JSON.stringify([...VAULT].map(([p, v]) => ({ path:p, text:v.text })))); return; }
  if (u.pathname.startsWith('/__gh/repos/o/vault/contents/')){
    const path = decodeURIComponent(u.pathname.slice('/__gh/repos/o/vault/contents/'.length)), m = req.method;
    const send = (st, o) => { res.writeHead(st, { 'content-type':'application/json' }); res.end(JSON.stringify(o)); };
    if (req.headers.authorization !== 'Bearer fake') return send(401, {});
    if (m === 'PUT'){ const b = JSON.parse(body.toString()); if (VAULT.has(path)) return send(422, {}); VAULT.set(path, { text:Buffer.from(b.content, 'base64').toString('utf8'), sha:'s' + VAULT.size }); return send(201, { content:{ path } }); }
    if (m === 'DELETE'){ VAULT.delete(path); return send(200, {}); }
    const kids = new Map(); for (const [p, v] of VAULT) if (p.startsWith(path + '/')){ const rest = p.slice(path.length + 1), i = rest.indexOf('/'); const name = i < 0 ? rest : rest.slice(0, i); kids.set(name, i < 0 ? { type:'file', name, path:p, sha:v.sha } : { type:'dir', name, path:path + '/' + name }); }
    return kids.size ? send(200, [...kids.values()]) : send(404, {});
  }
  const out = await worker.fetch(r, env);
  res.writeHead(out.status, Object.fromEntries(out.headers)); res.end(Buffer.from(await out.arrayBuffer()));
}).listen(port, () => console.log('sync on', port));
