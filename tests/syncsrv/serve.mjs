// local Cloudflare Worker + D1 stand-in for testing sehee-sync
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
const env = { DB, PINS:process.env.PINS || 'test:2580' };
const port = +(process.env.PORT || 8787);
http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const r = new Request('http://localhost:' + port + req.url, { method:req.method, headers:req.headers, body:['GET', 'HEAD'].includes(req.method) ? undefined : body });
  const out = await worker.fetch(r, env);
  res.writeHead(out.status, Object.fromEntries(out.headers)); res.end(Buffer.from(await out.arrayBuffer()));
}).listen(port, () => console.log('sync on', port));
