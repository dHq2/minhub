/* ── 문서 읽기 (v0.8) — 폰 안에서 글만 뽑는다(파일은 밖으로 안 나간다) ──
   txt·md·csv·json·html / docx / xlsx / pptx / hwpx / hwp(한글) / pdf.
   PDF는 글자가 들어 있으면 글만 뽑고, 스캔본(글자가 없음)이면 쪽마다 그림으로 바꿔 캡처처럼 AI가 읽는다. */
const DOC_EXT = /\.(txt|md|csv|tsv|json|html?|xml|docx|xlsx|pptx|hwpx|hwp|pdf)$/i;
const OLD_EXT = /\.(doc|xls|ppt|rtf|odt|ods|odp|pages|numbers|key)$/i;
const extOf = n => ((n || '').match(/\.([a-z0-9]+)$/i) || [, ''])[1].toLowerCase();
/* zip 풀기 — 브라우저에 있는 압축 풀기(deflate-raw)만 쓴다 */
/* 끝에 군더더기가 붙은 압축(한글 파일에 흔함)도 — 풀린 데까지는 살린다 */
async function inflateRaw(u8){
  const rd = new Blob([u8]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader(), parts = []; let n = 0;
  try{ for (;;){ const { done, value } = await rd.read(); if (done) break; parts.push(value); n += value.length; } }
  catch(e){ if (!n) throw new Error('압축을 못 풀었어요'); }
  const out = new Uint8Array(n); let o = 0; for (const p of parts){ out.set(p, o); o += p.length; } return out;
}
async function unzip(buf){
  const dv = new DataView(buf); let e = buf.byteLength - 22;
  while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error('압축(zip) 문서가 아니에요');
  const n = dv.getUint16(e + 10, true), files = {}; let p = dv.getUint32(e + 16, true);
  const td = new TextDecoder();
  for (let i = 0; i < n; i++){
    if (dv.getUint32(p, true) !== 0x02014b50) break;
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
    files[td.decode(new Uint8Array(buf, p + 46, nl))] = { method, csize, off };
    p += 46 + nl + xl + cl;
  }
  const raw = async name => {
    const f = files[name]; if (!f) return null;
    const ln = dv.getUint16(f.off + 26, true), lx = dv.getUint16(f.off + 28, true), data = new Uint8Array(buf, f.off + 30 + ln + lx, f.csize);
    return f.method === 0 ? data : await inflateRaw(data);
  };
  return { names:Object.keys(files), text:async name => { const u = await raw(name); return u ? td.decode(u) : null; } };
}
const xml = s => new DOMParser().parseFromString(s, 'application/xml');
const kids = (el, ln) => [...el.children].filter(c => c.localName === ln);
const allText = (el, ln) => [...el.getElementsByTagName('*')].filter(c => c.localName === ln).map(c => c.textContent).join('');
async function readDocx(buf){
  const z = await unzip(buf), d = xml(await z.text('word/document.xml') || '<x/>'), out = [];
  const para = p => { let s = ''; for (const n of p.getElementsByTagName('*')){ if (n.localName === 't') s += n.textContent; else if (n.localName === 'tab') s += '\t'; else if (n.localName === 'br') s += '\n'; } return s; };
  const walk = el => {
    for (const c of el.children){
      if (c.localName === 'p') out.push(para(c));
      else if (c.localName === 'tbl') for (const tr of kids(c, 'tr')) out.push(kids(tr, 'tc').map(tc => kids(tc, 'p').map(para).join(' ').trim()).join(' | '));
      else if (c.localName === 'sdt' || c.localName === 'sdtContent' || c.localName === 'body') walk(c);
    }
  };
  const body = [...d.getElementsByTagName('*')].find(n => n.localName === 'body'); if (body) walk(body);
  return out.join('\n');
}
async function readXlsx(buf){
  const z = await unzip(buf), out = [];
  const ss = []; const sx = await z.text('xl/sharedStrings.xml');
  if (sx) for (const si of xml(sx).getElementsByTagName('*')) if (si.localName === 'si') ss.push(allText(si, 't'));
  const wb = xml(await z.text('xl/workbook.xml') || '<x/>'), rels = xml(await z.text('xl/_rels/workbook.xml.rels') || '<x/>'), rmap = {};
  for (const r of rels.getElementsByTagName('*')) if (r.localName === 'Relationship') rmap[r.getAttribute('Id')] = r.getAttribute('Target');
  const sheets = [...wb.getElementsByTagName('*')].filter(n => n.localName === 'sheet');
  const col = ref => { let n = 0; for (const ch of (ref.match(/^[A-Z]+/) || [''])[0]) n = n * 26 + ch.charCodeAt(0) - 64; return n - 1; };
  for (const sh of sheets){
    const rid = [...sh.attributes].find(a => a.localName === 'id'); let target = rmap[rid && rid.value] || '';
    target = target.replace(/^\//, ''); if (!target.startsWith('xl/')) target = 'xl/' + target;
    const sx2 = await z.text(target); if (!sx2) continue;
    out.push(`[시트: ${sh.getAttribute('name')}]`);
    let rows = 0;
    for (const row of xml(sx2).getElementsByTagName('*')){
      if (row.localName !== 'row') continue;
      if (++rows > 2000){ out.push('…(2000줄 넘어서 생략)'); break; }
      const cells = [];
      for (const c of kids(row, 'c')){
        const t = c.getAttribute('t'), v = kids(c, 'v')[0];
        let val = t === 's' ? (ss[+(v && v.textContent)] || '') : t === 'inlineStr' ? allText(c, 't') : (v ? v.textContent : '');
        cells[col(c.getAttribute('r') || 'A')] = val;
      }
      if (cells.some(x => x)) out.push([...cells].map(x => x || '').join('\t'));
    }
  }
  return out.join('\n');
}
async function readPptx(buf){
  const z = await unzip(buf), out = [];
  const slides = z.names.filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);
  for (let i = 0; i < slides.length; i++){
    const d = xml(await z.text(slides[i]));
    const paras = [...d.getElementsByTagName('*')].filter(n => n.localName === 'p' && n.namespaceURI && /drawingml/.test(n.namespaceURI)).map(p => allText(p, 't')).filter(Boolean);
    out.push(`[슬라이드 ${i + 1}]`, ...paras);
  }
  return out.join('\n');
}
async function readHwpx(buf){
  const z = await unzip(buf), out = [];
  const secs = z.names.filter(n => /^Contents\/section\d+\.xml$/i.test(n)).sort((a, b) => +a.match(/(\d+)\.xml/i)[1] - +b.match(/(\d+)\.xml/i)[1]);
  for (const s of secs){
    const d = xml(await z.text(s));
    for (const p of d.getElementsByTagName('*')) if (p.localName === 'p' && ![...p.children].some(c => c.localName === 'p')){
      let t = ''; for (const n of p.getElementsByTagName('*')){ if (n.localName === 't') t += n.textContent; else if (n.localName === 'tab') t += '\t'; else if (n.localName === 'lineBreak') t += '\n'; }
      if (!p.getElementsByTagName('*').length && p.textContent) t = p.textContent;
      out.push(t);
    }
  }
  return out.join('\n');
}
/* 한글 .hwp — 복합 파일(CFB) 안의 BodyText/Section* 를 풀어 문단 글(태그 67)만 읽는다 */
function cfb(buf){
  const dv = new DataView(buf), u8 = new Uint8Array(buf);
  if (dv.getUint32(0, true) !== 0xE011CFD0) throw new Error('한글(.hwp) 파일이 아니에요');
  const ss = 1 << dv.getUint16(0x1E, true), mss = 1 << dv.getUint16(0x20, true), cutoff = dv.getUint32(0x38, true);
  const sec = n => (n + 1) * ss;
  const fatSecs = [];
  for (let i = 0; i < 109; i++){ const v = dv.getUint32(0x4C + i * 4, true); if (v < 0xFFFFFFFA) fatSecs.push(v); }
  let di = dv.getUint32(0x44, true), guard = 0;
  while (di < 0xFFFFFFFA && guard++ < 1000){ for (let i = 0; i < ss / 4 - 1; i++){ const v = dv.getUint32(sec(di) + i * 4, true); if (v < 0xFFFFFFFA) fatSecs.push(v); } di = dv.getUint32(sec(di) + ss - 4, true); }
  const fat = []; for (const f of fatSecs) for (let i = 0; i < ss / 4; i++) fat.push(dv.getUint32(sec(f) + i * 4, true));
  const chain = (s, tbl) => { const out = []; let g = 0; while (s < 0xFFFFFFFA && g++ < 1e6){ out.push(s); s = tbl[s]; } return out; };
  const readBig = (start, size) => { const out = new Uint8Array(size); let o = 0; for (const s of chain(start, fat)){ const n = Math.min(ss, size - o); if (n <= 0) break; out.set(u8.subarray(sec(s), sec(s) + n), o); o += n; } return out; };
  const dirBytes = readBig(dv.getUint32(0x30, true), chain(dv.getUint32(0x30, true), fat).length * ss), ddv = new DataView(dirBytes.buffer);
  const ents = [];
  for (let o = 0; o + 128 <= dirBytes.length; o += 128){
    const nl = ddv.getUint16(o + 0x40, true);
    ents.push({ name:new TextDecoder('utf-16le').decode(dirBytes.subarray(o, o + Math.max(0, nl - 2))), type:dirBytes[o + 0x42],
      l:ddv.getUint32(o + 0x44, true), r:ddv.getUint32(o + 0x48, true), c:ddv.getUint32(o + 0x4C, true), start:ddv.getUint32(o + 0x74, true), size:ddv.getUint32(o + 0x78, true) });
  }
  const root = ents[0], mfat = [];
  const mfs = dv.getUint32(0x3C, true); if (mfs < 0xFFFFFFFA) for (const s of chain(mfs, fat)) for (let i = 0; i < ss / 4; i++) mfat.push(dv.getUint32(sec(s) + i * 4, true));
  const ministream = root.start < 0xFFFFFFFA ? readBig(root.start, root.size) : new Uint8Array(0);
  const readEnt = e => {
    if (e.size >= cutoff) return readBig(e.start, e.size);
    const out = new Uint8Array(e.size); let o = 0;
    for (const s of chain(e.start, mfat)){ const n = Math.min(mss, e.size - o); if (n <= 0) break; out.set(ministream.subarray(s * mss, s * mss + n), o); o += n; }
    return out;
  };
  const childrenOf = e => { const out = []; const visit = i => { if (i >= ents.length || i >= 0xFFFFFFFA) return; const x = ents[i]; visit(x.l); out.push(x); visit(x.r); }; visit(e.c); return out; };
  const find = path => { let cur = root; for (const part of path.split('/')){ cur = childrenOf(cur).find(x => x.name === part); if (!cur) return null; } return cur; };
  return { find, childrenOf, readEnt };
}
function hwpParaText(u8){
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength), lines = [];
  let o = 0;
  while (o + 4 <= u8.length){
    const h = dv.getUint32(o, true); o += 4;
    const tag = h & 0x3FF; let size = (h >>> 20) & 0xFFF;
    if (size === 0xFFF){ size = dv.getUint32(o, true); o += 4; }
    if (tag === 67){
      let s = '';
      for (let i = o; i + 1 < o + size; ){
        const ch = dv.getUint16(i, true);
        if (ch < 32){
          if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].includes(ch)){ if (ch === 9) s += '\t'; i += 16; }
          else { if (ch === 10) s += '\n'; i += 2; }
        } else { s += String.fromCharCode(ch); i += 2; }
      }
      lines.push(s);
    }
    o += size;
  }
  return lines;
}
async function readHwp(buf){
  const c = cfb(buf), fh = c.find('FileHeader');
  if (!fh) throw new Error('한글 파일 머리를 못 찾았어요');
  const head = c.readEnt(fh), flags = new DataView(head.buffer, head.byteOffset).getUint32(36, true);
  const compressed = !!(flags & 1), locked = !!(flags & 2), dist = !!(flags & 4);
  const prv = () => { const p = c.find('PrvText'); return p ? new TextDecoder('utf-16le').decode(c.readEnt(p)).replace(/\0/g, '') : ''; };
  if (locked || dist){ const t = prv(); if (t.trim()) return `(암호·배포용 문서라 앞부분 미리보기만 읽었어요)\n${t}`; throw new Error('암호가 걸리거나 배포용 한글 문서라 못 읽어요. PDF로 저장해서 주세요'); }
  const body = c.find('BodyText'); if (!body) { const t = prv(); if (t) return t; throw new Error('본문을 못 찾았어요'); }
  const secs = c.childrenOf(body).filter(e => /^Section\d+$/.test(e.name)).sort((a, b) => +a.name.slice(7) - +b.name.slice(7));
  const out = [];
  for (const s of secs){ let d = c.readEnt(s); if (compressed) d = await inflateRaw(d); out.push(...hwpParaText(d)); }
  return out.join('\n');
}
/* PDF — 처음 쓸 때만 pdf.js 를 불러온다(앱에 같이 들어 있음) */
let PDFJS = null;
async function pdfjs(){
  if (!PDFJS){ PDFJS = await import(new URL('lib/pdf.min.mjs', location.href).href);   /* v1.5.0 파일이 js/ 로 옮겨져서 주소를 문서 기준으로 */ PDFJS.GlobalWorkerOptions.workerSrc = new URL('lib/pdf.worker.min.mjs', location.href).href; }
  return PDFJS;
}
const MAX_SCAN_PAGES = 30;
async function readPdf(buf, onP){
  const lib = await pdfjs();
  const doc = await lib.getDocument({ data:new Uint8Array(buf), cMapUrl:new URL('lib/cmaps/', location.href).href, cMapPacked:true }).promise;
  const pages = [], n = doc.numPages;
  for (let i = 1; i <= n; i++){
    if (onP) onP(`글 뽑는 중 ${i}/${n}쪽`);
    const pg = await doc.getPage(i), tc = await pg.getTextContent();
    let s = '', lastY = null;
    for (const it of tc.items){ if (!('str' in it)) continue; const y = it.transform ? Math.round(it.transform[5]) : null; if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) s += '\n'; s += it.str; if (it.hasEOL) s += '\n'; lastY = y; }
    pages.push(s.replace(/\n{3,}/g, '\n\n').trim());
  }
  const chars = pages.join('').replace(/\s/g, '').length;
  if (chars >= 15 * n) return { text:pages.map((p, i) => `[${i + 1}쪽]\n${p}`).join('\n\n'), pages:n };
  /* 스캔본 — 쪽을 그림으로 */
  const imgs = [], m = Math.min(n, MAX_SCAN_PAGES);
  for (let i = 1; i <= m; i++){
    if (onP) onP(`스캔본이라 쪽을 그림으로 바꾸는 중 ${i}/${m}`);
    const pg = await doc.getPage(i), vp0 = pg.getViewport({ scale:1 }), vp = pg.getViewport({ scale:Math.min(3, 1400 / vp0.width) });
    const cv = document.createElement('canvas'); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
    await pg.render({ canvasContext:cv.getContext('2d'), viewport:vp, canvas:cv }).promise;
    imgs.push(await new Promise(r => cv.toBlob(b => r(new File([b], `page-${i}.jpg`, { type:'image/jpeg' })), 'image/jpeg', 0.9)));
    cv.width = cv.height = 0;
  }
  return { scan:imgs, pages:n, cut:n > m };
}
/* 파일 하나 → { kind:'txt', text } 또는 { kind:'scan', files } */
async function readDocFile(f, onP){
  const r = await readDocRaw(f, onP);
  if (r.kind === 'txt') r.text = r.text.split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return r;
}
async function readDocRaw(f, onP){
  const ext = extOf(f.name), buf = () => f.arrayBuffer();
  if (/^(txt|md|csv|tsv|json|xml)$/.test(ext) || /^text\/plain|^text\/csv|^application\/json/.test(f.type)) return { kind:'txt', text:await f.text() };
  if (/^html?$/.test(ext) || f.type === 'text/html'){ const d = new DOMParser().parseFromString(await f.text(), 'text/html'); d.querySelectorAll('script,style').forEach(x => x.remove()); return { kind:'txt', text:(d.body ? d.body.innerText || d.body.textContent : '').replace(/\n{3,}/g, '\n\n') }; }
  if (ext === 'docx') return { kind:'txt', text:await readDocx(await buf()) };
  if (ext === 'xlsx') return { kind:'txt', text:await readXlsx(await buf()) };
  if (ext === 'pptx') return { kind:'txt', text:await readPptx(await buf()) };
  if (ext === 'hwpx') return { kind:'txt', text:await readHwpx(await buf()) };
  if (ext === 'hwp') return { kind:'txt', text:await readHwp(await buf()) };
  if (ext === 'pdf' || f.type === 'application/pdf'){ const r = await readPdf(await buf(), onP); return r.scan ? { kind:'scan', files:r.scan, pages:r.pages, cut:r.cut } : { kind:'txt', text:r.text, pages:r.pages }; }
  if (OLD_EXT.test(f.name)) throw new Error('예전 형식이라 못 읽어요. 새 형식(docx·xlsx·pptx·hwpx)이나 PDF로 저장해서 주세요');
  throw new Error('읽을 수 없는 파일이에요');
}

/* ── 첨부 (사진·글 파일) — 📎, 붙여넣기, 공유하기로 들어온다 ── */
const ATT = [];
const MAX_PICS = 12, MAX_DOC = 40000;
function renderTray(){
  const el = $('tray'); if (!el) return;
  el.hidden = !ATT.length;
  el.innerHTML = ATT.map((a, i) => a.kind === 'img'
      ? `<span class="att"><img src="${a.url}" alt=""><button data-att="${i}" aria-label="빼기">✕</button></span>`
      : `<span class="att doc${a.reading ? ' reading' : ''}">📄 ${esc(a.name)} · ${a.reading ? esc(a.status || '읽는 중') : a.text.length.toLocaleString('ko-KR') + '자' + (a.pages ? ` · ${a.pages}쪽` : '')}<button data-att="${i}" aria-label="빼기">✕</button></span>`).join('')
    + (ATT.length ? `<small>${ATT.some(a => a.reading) ? '문서 읽는 중 — 다 읽으면 보낼 수 있어요' : ATT.some(a => a.kind === 'img') ? '긴 캡처도 잘라서 읽어요 · 보내면 시작' : '보내면 세희가 읽고 정리해요'}</small>` : '');
  growSay();
}
async function addFiles(files){
  let skipped = 0;
  for (const f of files){
    if (/^image\//.test(f.type)){
      if (ATT.filter(a => a.kind === 'img').length >= MAX_PICS){ skipped++; continue; }
      ATT.push({ kind:'img', file:f, url:URL.createObjectURL(f), name:f.name || '사진' });
    } else {
      /* 문서 (v0.8) — 칸에 먼저 '읽는 중'으로 넣고, 다 읽으면 글자 수로 바뀐다 */
      const name = f.name || '문서', a = { kind:'txt', name, text:'', reading:true, status:'읽는 중', head:extOf(name) !== 'txt' };
      ATT.push(a); renderTray();
      const drop = () => { const i = ATT.indexOf(a); if (i >= 0) ATT.splice(i, 1); };
      try{
        const r = await readDocFile(f, st => { a.status = st; renderTray(); });
        if (r.kind === 'scan'){
          const at = ATT.indexOf(a); drop();
          ATT.splice(at < 0 ? ATT.length : at, 0, ...r.files.map((img, i) => ({ kind:'img', file:img, url:URL.createObjectURL(img), name:`${name} ${i + 1}쪽`, scan:true })));
          toast(`${name}: 스캔본이라 ${r.files.length}쪽을 사진처럼 읽어요${r.cut ? ` (앞 ${MAX_SCAN_PAGES}쪽만)` : ''}`);
        } else if (!r.text.trim()){ drop(); toast(`${name}: 글자가 없는 문서예요`); }
        else { a.text = r.text; a.reading = false; if (r.pages) a.pages = r.pages; }
      }catch(e){ drop(); toast(`${name}: ${e.message || '못 읽었어요'}`); }
    }
  }
  renderTray();
  if (skipped) toast(`${skipped}개는 못 넣었어요 (사진은 한 번에 ${MAX_PICS}장까지)`);
}
/* 너무 긴 글 — 카톡 내보내기(txt)는 최근(뒤쪽)을, 문서는 앞쪽을 남긴다 */
function clipDoc(t, head){
  if (t.length <= MAX_DOC) return t;
  const cut = (t.length - MAX_DOC).toLocaleString('ko-KR');
  return head ? t.slice(0, MAX_DOC) + `\n(뒷부분 ${cut}자 생략)` : `(앞부분 ${cut}자 생략)\n` + t.slice(-MAX_DOC);
}
/* 대화 기록 속 보스 말 → AI에 보낼 글. 최근 것만 해독본·첨부 글 전체, 오래된 건 앞부분만 */
function userContent(m, recent){
  let s = m.text || '';
  if (m.ocr !== undefined){
    if (!s) s = '(보스가 설명 없이 넘겼다)';
    s += `\n\n[${m.scanOf ? '스캔 문서 해독본: ' + m.scanOf : '카톡 캡처 해독본'} · ${m.scanOf ? '' : '사진 '}${m.pics}${m.scanOf ? '쪽' : '장'}${m.ocrMeta ? ' · ' + m.ocrMeta.lines + '줄' : ''}]\n` + (recent ? m.ocr : m.ocr.slice(0, 400) + '\n…(앞부분만. 이 해독본은 이미 정리했다)');
  }
  if (m.doc){
    if (!m.text) s = s || '(보스가 설명 없이 넘겼다)';
    s += `\n\n[첨부 문서: ${(m.docs || []).join(', ')}]\n` + (recent ? m.doc : m.doc.slice(0, 400) + '\n…(앞부분만. 이미 정리했다)');
  }
  return s;
}
const hostOf = u => { try{ return new URL(u).hostname.replace(/^www\./, ''); }catch(e){ return u; } };
