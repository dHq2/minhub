/* ── 문서·시트 파일 v1 (11-16 A) — 양식 없이, 클로드가 원래 쓰듯이 ──
   보스: "클로드의 문서 작성 능력 그대로. 양식 없이. 파일도 만들고 엑셀도 만들고 편집도."
   - 문서 카드(kind 'doc'): 세희가 마크다운으로 자유롭게 쓴 글 → A4 쪽으로 보여 주고, Word(.docx)·PDF(인쇄)·구글 문서로 내보냄.
   - 시트 카드(kind 'sheet'): 탭 여러 개 + 수식 → 표로 보여 주고, 엑셀(.xlsx)·구글 시트로 내보냄.
   - 받은 엑셀·워드 파일을 고쳐 달라면: 세희가 읽은 내용으로 시트·문서 카드를 만들고 그걸 파일로 다시 받는다.
   라이브러리(lib/docx.min.js · lib/xlsx.mini.min.js)는 내보낼 때만 불러온다. */

/* 마크다운 → 조각(token). 문서 화면·Word 가 같은 조각을 쓴다 */
function mdTokens(md){
  const L = String(md || '').replace(/\r/g, '').split('\n'), T = [];
  let i = 0;
  const isTableSep = s => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(s);
  const cells = s => s.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim());
  while (i < L.length){
    const s = L[i];
    if (!s.trim()){ i++; continue; }
    let m;
    if ((m = s.match(/^(#{1,4})\s+(.*)$/))){ T.push({ t:'h', lvl:m[1].length, text:m[2].trim() }); i++; continue; }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(s)){ T.push({ t:'hr' }); i++; continue; }
    if (/\|/.test(s) && i + 1 < L.length && isTableSep(L[i + 1])){
      const head = cells(s), rows = []; i += 2;
      while (i < L.length && /\|/.test(L[i]) && L[i].trim()){ rows.push(cells(L[i])); i++; }
      T.push({ t:'table', head, rows }); continue;
    }
    if (/^\s*>/.test(s)){ const q = []; while (i < L.length && /^\s*>/.test(L[i])){ q.push(L[i].replace(/^\s*>\s?/, '')); i++; } T.push({ t:'quote', text:q.join('\n') }); continue; }
    if ((m = s.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/))){
      const ordered = /\d/.test(m[2]), items = [];
      while (i < L.length && (m = L[i].match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/)) && /\d/.test(m[2]) === ordered){
        let text = m[3], check = null; const c = text.match(/^\[( |x|X)\]\s+(.*)$/); if (c){ check = c[1] !== ' '; text = c[2]; }
        items.push({ text, check, lvl:Math.min(3, Math.floor(m[1].replace(/\t/g, '  ').length / 2)) }); i++;
        while (i < L.length && L[i].trim() && /^\s{2,}\S/.test(L[i]) && !/^(\s*)([-*+]|\d+[.)])\s+/.test(L[i])){ items[items.length - 1].text += ' ' + L[i].trim(); i++; }
      }
      T.push({ t:ordered ? 'ol' : 'ul', items }); continue;
    }
    const p = [s.trim()]; i++;
    while (i < L.length && L[i].trim() && !/^(#{1,4}\s|\s*>|\s*([-*+]|\d+[.)])\s+|\s*(-{3,}|\*{3,})\s*$)/.test(L[i]) && !(/\|/.test(L[i]) && i + 1 < L.length && isTableSep(L[i + 1]))){ p.push(L[i].trim()); i++; }
    T.push({ t:'p', text:p.join('\n') });
  }
  return T;
}
/* 글 안 꾸밈: **굵게** *기울임* `코드` — 먼저 이스케이프 */
function mdInline(s){
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<i>$2</i>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\n/g, '<br>');
}
/* 문서 화면용 조각 HTML — 쪽 나누기가 한 조각씩 넣어 본다(목록은 줄마다, 표는 통째) */
function mdBlocksHtml(md){
  const B = [];
  for (const k of mdTokens(md)){
    if (k.t === 'h') B.push(`<h${k.lvl + 1} class="md-h md-h${k.lvl}">${mdInline(k.text)}</h${k.lvl + 1}>`);
    else if (k.t === 'p') B.push(`<p class="md-p">${mdInline(k.text)}</p>`);
    else if (k.t === 'hr') B.push('<hr class="md-hr">');
    else if (k.t === 'quote') B.push(`<blockquote class="md-q">${mdInline(k.text)}</blockquote>`);
    else if (k.t === 'ul' || k.t === 'ol') k.items.forEach((it, n) => B.push(`<div class="md-li ${k.t}${it.check !== null ? ' md-ck' : ''}" style="--lv:${it.lvl}"><span class="md-b">${it.check !== null ? (it.check ? '☑' : '☐') : k.t === 'ol' ? (n + 1) + '.' : '•'}</span><span>${mdInline(it.text)}</span></div>`));
    else if (k.t === 'table') B.push(`<div class="md-tw"><table class="md-t"><thead><tr>${k.head.map(h => `<th>${mdInline(h)}</th>`).join('')}</tr></thead><tbody>${k.rows.map(r => `<tr>${k.head.map((h, j) => `<td>${mdInline(r[j] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
  }
  return B.length ? B : ['<p class="md-p">(빈 문서)</p>'];
}
const mdPlain = md => String(md || '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');

/* 라이브러리는 내보낼 때만 */
const FILES = { libs:{} };
function filesLib(name){
  if (!FILES.libs[name]) FILES.libs[name] = new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = new URL('lib/' + name, location.href).href;
    s.onload = ok; s.onerror = () => { delete FILES.libs[name]; no(new Error('파일 도구를 못 불러왔어요(인터넷 확인)')); }; document.head.appendChild(s);
  });
  return FILES.libs[name];
}
const fileSafe = t => (String(t || '').replace(/[\\/:*?"<>|\n]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60) || 'sehee');
function fileDownload(blob, name){
  const u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 4000); dlog('파일', `내려받기 · ${name} · ${Math.round(blob.size / 1024)}KB`);
}

/* ── Word(.docx) ── */
async function docxOf(c){
  await filesLib('docx.min.js'); const D = window.docx;
  const runs = s => { const out = []; String(s).split(/(\*\*.+?\*\*)/g).forEach(seg => { if (!seg) return; const b = /^\*\*(.+)\*\*$/.exec(seg); const parts = (b ? b[1] : seg).replace(/`([^`]+)`/g, '$1').split('\n');
    parts.forEach((x, k) => out.push(new D.TextRun({ text:x, bold:!!b, break:k ? 1 : 0 }))); }); return out.length ? out : [new D.TextRun('')]; };
  const H = [D.HeadingLevel.HEADING_1, D.HeadingLevel.HEADING_2, D.HeadingLevel.HEADING_3, D.HeadingLevel.HEADING_4];
  const kids = [], md = c.kind === 'doc' ? c.md : reportText(c);
  for (const k of mdTokens(md)){
    if (k.t === 'h') kids.push(new D.Paragraph({ heading:H[k.lvl - 1], children:runs(k.text) }));
    else if (k.t === 'p') kids.push(new D.Paragraph({ children:runs(k.text), spacing:{ after:120 } }));
    else if (k.t === 'quote') kids.push(new D.Paragraph({ children:runs(k.text), indent:{ left:480 }, border:{ left:{ style:D.BorderStyle.SINGLE, size:12, color:'3A6B64', space:8 } } }));
    else if (k.t === 'hr') kids.push(new D.Paragraph({ border:{ bottom:{ style:D.BorderStyle.SINGLE, size:6, color:'999999', space:1 } } }));
    else if (k.t === 'ul' || k.t === 'ol') k.items.forEach(it => kids.push(new D.Paragraph(it.check !== null ? { children:[new D.TextRun(it.check ? '☑ ' : '☐ '), ...runs(it.text)], indent:{ left:360 + it.lvl * 360 } }
      : k.t === 'ol' ? { children:runs(it.text), numbering:{ reference:'num', level:it.lvl } } : { children:runs(it.text), bullet:{ level:it.lvl } })));
    else if (k.t === 'table'){
      const row = (cs, head) => new D.TableRow({ tableHeader:head, children:k.head.map((h, j) => new D.TableCell({ shading:head ? { fill:'EFEBE0' } : undefined, children:[new D.Paragraph({ children:runs(head ? `**${mdPlain(cs[j] || '')}**` : (cs[j] || '')) })] })) });
      kids.push(new D.Table({ width:{ size:100, type:D.WidthType.PERCENTAGE }, rows:[row(k.head, true), ...k.rows.map(r => row(r, false))] }));
      kids.push(new D.Paragraph(''));
    }
  }
  const doc = new D.Document({ creator:'세희', title:c.title, styles:{ default:{ document:{ run:{ font:'맑은 고딕', size:21 } } } },
    numbering:{ config:[{ reference:'num', levels:[0, 1, 2, 3].map(l => ({ level:l, format:D.LevelFormat.DECIMAL, text:`%${l + 1}.`, alignment:D.AlignmentType.START, style:{ paragraph:{ indent:{ left:360 + l * 360, hanging:260 } } } })) }] },
    sections:[{ properties:{ page:{ margin:{ top:1134, bottom:1134, left:1134, right:1134 } } }, children:kids }] });
  return D.Packer.toBlob(doc);
}
/* ── 엑셀(.xlsx) — 시트 카드, 표 카드, 문서 속 표 ── */
function sheetsOf(c){
  if (c.kind === 'sheet') return c.sheets || [];
  if (c.kind === 'table') return [{ name:c.title, rows:[c.columns || [], ...(c.rows || [])].filter(r => r.length) }];
  if (c.kind === 'chart') return [{ name:c.title, rows:[['항목', '값'], ...(c.labels || []).map((l, i) => [l, (c.values || [])[i]])] }];
  const md = c.kind === 'doc' ? c.md : '';
  const ts = mdTokens(md).filter(k => k.t === 'table').map((k, i) => ({ name:`표${i + 1}`, rows:[k.head.map(mdPlain), ...k.rows.map(r => r.map(mdPlain))] }));
  if (c.kind === 'report') (c.sections || []).forEach((x, i) => { if (x.rows && x.rows.length) ts.push({ name:x.heading || `표${i + 1}`, rows:[x.cols || [], ...x.rows] }); });
  return ts;
}
const numOf = v => { if (typeof v === 'number') return v; const s = String(v ?? '').trim(); return /^-?\d{1,3}(,\d{3})+(\.\d+)?$|^-?\d+(\.\d+)?$/.test(s) ? Number(s.replace(/,/g, '')) : null; };
async function xlsxOf(c){
  await filesLib('xlsx.mini.min.js'); const X = window.XLSX, wb = X.utils.book_new(), used = new Set();
  for (const sh of sheetsOf(c)){
    const rows = (sh.rows || []).map(r => (r || []).map(v => { const n = numOf(v); return n === null ? String(v ?? '') : n; }));
    const ws = X.utils.aoa_to_sheet(rows.length ? rows : [['']]);
    for (const f of sh.formulas || []){ const ref = String(f.cell || '').toUpperCase(); if (!/^[A-Z]{1,3}\d{1,6}$/.test(ref)) continue;
      const cur = ws[ref] || {}; ws[ref] = { t:cur.t === 's' ? 'n' : (cur.t || 'n'), v:cur.v ?? 0, f:String(f.f || '').replace(/^=/, '') };
      const rg = X.utils.decode_range(ws['!ref'] || 'A1'), a = X.utils.decode_cell(ref); rg.e.r = Math.max(rg.e.r, a.r); rg.e.c = Math.max(rg.e.c, a.c); ws['!ref'] = X.utils.encode_range(rg); }
    const w = []; rows.forEach(r => r.forEach((v, j) => { w[j] = Math.max(w[j] || 6, Math.min(40, [...String(v)].reduce((s, ch) => s + (ch.charCodeAt(0) > 255 ? 2 : 1), 0) + 2)); }));
    ws['!cols'] = w.map(x => ({ wch:x }));
    let nm = fileSafe(sh.name || 'Sheet').replace(/[\[\]]/g, '').slice(0, 31) || 'Sheet', k = 2; while (used.has(nm)) nm = nm.slice(0, 28) + ' ' + k++; used.add(nm);
    X.utils.book_append_sheet(wb, ws, nm);
  }
  if (!wb.SheetNames.length) throw new Error('엑셀로 만들 표가 없어요');
  return new Blob([X.write(wb, { bookType:'xlsx', type:'array' })], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
/* 보스가 고르는 「파일로 받기」 */
function fileMenu(id){
  const c = (BOARD.cards || []).find(x => x.id === id); if (!c) return;
  const hasTable = sheetsOf(c).length > 0, isText = ['doc', 'report', 'note', 'list', 'file'].includes(c.kind), gd = typeof gdReady === 'function' && gdReady();
  openSheet(`<h4>파일로 받기 — ${esc(c.title)}</h4><div class="row" style="flex-wrap:wrap;gap:6px">
    ${isText ? `<button class="chip" data-fx="docx" data-id="${id}">📝 Word (.docx)</button><button class="chip" data-fx="pdf" data-id="${id}">🖨 PDF · 인쇄</button>` : ''}
    ${hasTable ? `<button class="chip" data-fx="xlsx" data-id="${id}">📊 엑셀 (.xlsx)</button>` : ''}
    ${isText ? `<button class="chip" data-fx="md" data-id="${id}">글 파일 (.md)</button>` : ''}
    ${gd && isText ? `<button class="chip" data-fx="gdoc" data-id="${id}">📂 구글 문서로 저장</button>` : ''}
    ${gd && hasTable ? `<button class="chip" data-fx="gsheet" data-id="${id}">📂 구글 시트로 저장</button>` : ''}
  </div><p class="note" id="fxNote">고른 형식으로 바로 내려받아요. 구글로 저장하면 드라이브 「세희」 폴더에 들어가요.</p>`);
}
async function fileExport(kind, id){
  const c = (BOARD.cards || []).find(x => x.id === id); if (!c) return;
  const note = t => { const n = $('fxNote'); if (n) n.textContent = t; }, base = fileSafe(c.title);
  try{
    if (kind === 'docx'){ note('Word 파일 만드는 중…'); fileDownload(await docxOf(c), base + '.docx'); note('내려받았어요 — Word·한컴·구글 문서에서 열려요.'); }
    else if (kind === 'xlsx'){ note('엑셀 파일 만드는 중…'); fileDownload(await xlsxOf(c), base + '.xlsx'); note('내려받았어요 — 엑셀·구글 시트에서 열려요.'); }
    else if (kind === 'md') fileDownload(new Blob([c.kind === 'doc' ? c.md : reportText(c)], { type:'text/markdown;charset=utf-8' }), base + '.md');
    else if (kind === 'pdf'){ closeSheet(); if (['doc', 'report'].includes(c.kind)){ await rvOpen(id); setTimeout(() => window.print(), 400); } else window.print(); }
    else if (kind === 'gdoc' || kind === 'gsheet'){
      if (!gdHasToken() && !(await gdConnect())) return;
      note('구글에 저장하는 중…');
      const r = kind === 'gdoc' ? await runDriveTool({ name:'drive_save', args:{ as:'doc', name:c.title, text:c.kind === 'doc' ? c.md : reportText(c) } })
        : await runDriveTool({ name:'drive_save', args:{ as:'sheet', name:c.title, rows:(sheetsOf(c)[0] || {}).rows || [] } });
      note(r && r.ok ? `저장했어요 — 드라이브 「세희」 폴더의 「${c.title}」` : '저장을 못 했어요 ' + ((r && (r.error || r.note)) || ''));
    }
  }catch(e){ note('못 만들었어요 — ' + e.message); dlog('파일', `내보내기 실패 · ${kind} · ${e.message}`); }
}
$('sheet').addEventListener('click', e => { const b = e.target.closest('[data-fx]'); if (b) fileExport(b.dataset.fx, b.dataset.id); });

/* 시트 카드 보기 — 탭 */
function sheetHtml(c, full){
  const S = c.sheets || []; if (!S.length) return '<p class="cn">(빈 시트)</p>';
  const one = (sh, lim) => { const rows = sh.rows || [], fs = new Set((sh.formulas || []).map(f => String(f.cell || '').toUpperCase()));
    const col = j => { let s = '', n = j + 1; while (n){ s = String.fromCharCode(65 + (n - 1) % 26) + s; n = Math.floor((n - 1) / 26); } return s; };
    return `<div class="tw"><table class="ct sh"><thead><tr>${(rows[0] || []).map(h => `<th>${esc(String(h ?? ''))}</th>`).join('')}</tr></thead><tbody>${rows.slice(1, lim ? lim + 1 : undefined).map((r, i) => `<tr>${(rows[0] || r).map((x, j) => `<td class="${numOf(r[j]) !== null ? 'n' : ''}${fs.has(col(j) + (i + 2)) ? ' f' : ''}">${esc(String(r[j] ?? ''))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; };
  if (!full) return (S.length > 1 ? `<small class="more">탭 ${S.length}개 · ${S.map(s => esc(s.name)).join(' · ')}</small>` : '') + one(S[0], 5);
  return S.map(sh => `<h5 class="sh-tab">📄 ${esc(sh.name || '시트')}</h5>${one(sh, 0)}${(sh.formulas || []).length ? `<small class="more">수식 ${sh.formulas.length}개 — 엑셀로 받으면 살아 있어요(초록 칸)</small>` : ''}`).join('');
}
