/* ── 사진 해독 (v0.7) — 카톡 캡처를 글로 ──
   긴 캡처는 말풍선 사이 빈 줄을 찾아 잘라서(못 찾으면 겹치게) 조각마다 AI가 읽기 좋은 크기로 보낸다.
   조각 4개씩 묶어 두 줄로 동시에 읽고, 실패한 묶음은 다시, 말이 너무 길어 잘리면 반으로 나눠 다시 읽는다.
   조각 크기: 가로 896px · 세로는 이미지 토큰 1568 안 (줄이지 않고 그대로 읽히는 최대 크기) */
const TILE = { w:896, tok:1568, edge:1568, per:4, lanes:2 };
const OCR_SYS = `너는 메신저 캡처 해독기다. 받은 이미지 조각들은 한 화면(또는 길게 이어 붙인 캡처)을 위에서 아래로 자른 것이다. 보이는 대화를 순서대로, 빠짐없이, 글자 그대로 받아 적는다. 요약·해석·맞춤법 교정 금지.

형식 — 한 메시지 한 줄. 말풍선 안 줄바꿈은 ' / '로 잇는다.
방: 방 이름   ← 화면 맨 위에 방 이름이 보일 때만, 맨 처음 한 번
--- 2026년 11월 11일 수요일 ---   ← 날짜 구분선이 보일 때
[오후 3:12] 이름: 내용
- 카카오톡에서 오른쪽(노란) 말풍선은 '나'다. 왼쪽 말풍선은 위에 적힌 이름을 쓴다. 이름 없이 이어지는 말풍선은 바로 위 사람.
- 시각은 말풍선 옆 작은 글씨다. 같은 사람이 같은 분에 연달아 보낸 말풍선은 같은 시각을 쓴다. 안 보이면 [시각?].
- 말풍선 옆 작은 숫자(안 읽은 사람 수)는 적지 않는다.
- 사진·이모티콘·동영상·파일·링크 미리보기는 [사진] [이모티콘] [동영상] [파일: 이름] [링크: 제목].
- 답장(인용)은 '[오후 3:12] 이름: (↪ 인용한 말 앞부분) 내용'.
- 입장·퇴장·삭제된 메시지·공지는 '* 내용'.
- 안 읽히는 글자는 [?]. 조각 경계에서 잘린 말풍선은 이어서 한 번만 적는다. 조각끼리 겹친 부분도 한 번만.
- 대화 화면이 아니면(문서·영수증·메모 사진) 보이는 글자를 줄 그대로 적는다.
해독본만 출력한다. 앞뒤 설명·인사 없이.`;
const ocrModel = () => bigModel() || aiModel();
const tickMs = ms => new Promise(r => setTimeout(r, ms));
async function loadPic(file){
  try{ const b = await createImageBitmap(file); return { src:b, w:b.width, h:b.height, done:() => b.close && b.close() }; }
  catch(e){
    const url = URL.createObjectURL(file), im = new Image(); im.src = url;
    try{ await im.decode(); }catch(x){ URL.revokeObjectURL(url); throw new Error('사진을 열 수 없어요(너무 크거나 지원 안 되는 형식)'); }
    return { src:im, w:im.naturalWidth, h:im.naturalHeight, done:() => URL.revokeObjectURL(url) };
  }
}
/* 아래쪽부터 거슬러 올라가며 '한 줄이 통째로 같은 색'인 띠(말풍선 사이 빈 곳)를 찾는다 */
function findGap(src, w, y0, y1){
  const cw = 160, k = cw / w, ch = Math.max(2, Math.round((y1 - y0) * k));
  const c = document.createElement('canvas'); c.width = cw; c.height = ch;
  const x = c.getContext('2d', { willReadFrequently:true });
  x.drawImage(src, 0, y0, w, y1 - y0, 0, 0, cw, ch);
  const d = x.getImageData(0, 0, cw, ch).data, blank = [];
  for (let r = 0; r < ch; r++){
    let mn = 255, mx = 0;
    for (let cx = 4; cx < cw - 4; cx++){ const i = (r * cw + cx) * 4, l = (d[i] * 3 + d[i + 1] * 6 + d[i + 2]) / 10; if (l < mn) mn = l; if (l > mx) mx = l; }
    blank.push(mx - mn < 10);
  }
  for (let r = ch - 1; r >= 0; r--){
    if (!blank[r]) continue;
    let s = r; while (s > 0 && blank[s - 1]) s--;
    if (r - s + 1 >= 2) return y0 + Math.round(((s + r) / 2) / k);
    r = s;
  }
  return 0;
}
function planTiles(src, w, h){
  const scale = Math.min(1, TILE.w / w), tw = Math.max(1, Math.round(w * scale));
  const cols = Math.ceil(tw / 28), maxH = Math.min(TILE.edge, Math.floor(TILE.tok / cols) * 28);
  const step = Math.max(200, Math.floor(maxH / scale)), cuts = [];
  let y = 0;
  while (y < h && cuts.length < 200){
    if (h - y <= step){ cuts.push({ y, h:h - y, ov:false }); break; }
    const gap = findGap(src, w, y + Math.floor(step * 0.62), y + step);
    if (gap > y){ cuts.push({ y, h:gap - y, ov:false }); y = gap; }
    else { cuts.push({ y, h:step, ov:true }); y = y + step - Math.floor(step * 0.14); }
  }
  return { scale, tw, cuts };
}
async function tileB64(src, w, sy, sh, scale, tw){
  const th = Math.max(1, Math.round(sh * scale)), c = document.createElement('canvas');
  c.width = tw; c.height = th;
  const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.fillStyle = '#fff'; x.fillRect(0, 0, tw, th);
  x.drawImage(src, 0, sy, w, sh, 0, 0, tw, th);
  const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.86));
  c.width = c.height = 0;
  return await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(',')[1]); fr.onerror = rej; fr.readAsDataURL(blob); });
}
/* 해독 한 번 — 스트리밍으로 받는다(오래 걸려도 안 끊기게) */
async function visionCall(tiles, signal, onLen){
  const p = AI.cfg.provider, key = aiKey(), model = ocrModel();
  const t0 = performance.now(), rec = { at:Date.now(), provider:p, model, ok:false, kind:'사진', tiles:tiles.length };
  const ctl = new AbortController(); if (signal){ if (signal.aborted) ctl.abort(); signal.addEventListener('abort', () => ctl.abort()); }
  let text = '', inTok = 0, outTok = 0, finish = '';
  const label = t => `사진 ${t.pic} · 조각 ${t.part}/${t.parts}` + (t.part === 1 && t.pic > 1 ? ' (새 사진 — 앞 사진과 대화가 겹칠 수 있음)' : '') + (t.ovPrev ? ' (앞 조각과 위쪽이 겹침)' : '');
  const ask = tiles[0].part > 1 || tiles[0].pic > 1 ? '이 조각들은 더 긴 캡처의 중간부터다. 맨 위에 잘린 말풍선은 보이는 만큼 적는다. 위 조각들을 순서대로 해독본으로.' : '위 조각들을 순서대로 해독본으로.';
  const go = async (url, body, headers) => {
    let late = false; const t = setTimeout(() => { late = true; ctl.abort(); }, 60000);
    try{ return await fetch(url, { method:'POST', headers, body:JSON.stringify(body), signal:ctl.signal }); }
    catch(e){ if (late) throw new AIError(-1, '60초 동안 대답이 없었어요'); if (ctl.signal.aborted) throw new AIError(-2, ''); throw new AIError(0, e.message); }
    finally{ clearTimeout(t); }
  };
  try{
    if (p === 'anthropic'){
      const content = [];
      for (const t of tiles){ content.push({ type:'text', text:label(t) }); content.push({ type:'image', source:{ type:'base64', media_type:'image/jpeg', data:t.b64 } }); }
      content.push({ type:'text', text:ask });
      const ob = { model, max_tokens:thinkLocked(model) ? 16000 : 8000, system:OCR_SYS, messages:[{ role:'user', content }], stream:true, ...(thinkLocked(model) ? (AI.noEffort ? {} : { output_config:{ effort:'low' } }) : { thinking:{ type:'disabled' } }) };
      let r = await go('https://api.anthropic.com/v1/messages', ob, anthHeaders(key));
      if (r.status === 400 && ob.thinking && /thinking/i.test(await r.clone().text().catch(() => ''))){ lockThink(model); delete ob.thinking; ob.max_tokens = 16000; r = await go('https://api.anthropic.com/v1/messages', ob, anthHeaders(key)); }
      if (!r.ok) await apiFail(r);
      for await (const data of sseEvents(r, ctl, 60000)){
        let d; try{ d = JSON.parse(data); }catch(e){ continue; }
        if (d.type === 'message_start') inTok = (d.message && d.message.usage && d.message.usage.input_tokens) || 0;
        else if (d.type === 'content_block_delta' && d.delta && d.delta.type === 'text_delta'){ text += d.delta.text; if (onLen) onLen(text.length); }
        else if (d.type === 'message_delta'){ if (d.usage && d.usage.output_tokens) outTok = d.usage.output_tokens; if (d.delta && d.delta.stop_reason) finish = d.delta.stop_reason; }
        else if (d.type === 'error') throw new AIError(529, (d.error && d.error.message) || '해독 도중 오류');
      }
    } else {
      const parts = [];
      for (const t of tiles){ parts.push({ text:label(t) }); parts.push({ inlineData:{ mimeType:'image/jpeg', data:t.b64 } }); }
      parts.push({ text:ask });
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
      const headers = { 'content-type':'application/json', 'x-goog-api-key':key };
      const base = { systemInstruction:{ parts:[{ text:OCR_SYS }] }, contents:[{ role:'user', parts }], generationConfig:{ maxOutputTokens:8192 } };
      const rich = { ...base, generationConfig:{ ...base.generationConfig, mediaResolution:'MEDIA_RESOLUTION_HIGH', ...(/gemini-3/.test(model) ? { thinkingConfig:{ thinkingLevel:'low' } } : {}) } };
      let r = await go(url, rich, headers);
      if (!r.ok && r.status === 400){ rec.retried = true; r = await go(url, base, headers); }
      if (!r.ok) await apiFail(r);
      for await (const data of sseEvents(r, ctl, 60000)){
        let d; try{ d = JSON.parse(data); }catch(e){ continue; }
        if (d.error) throw new AIError(d.error.code || 500, d.error.message || '');
        const c = (d.candidates || [])[0] || {};
        for (const part of ((c.content || {}).parts || [])) if (part.text && !part.thought){ text += part.text; if (onLen) onLen(text.length); }
        if (c.finishReason) finish = c.finishReason;
        const um = d.usageMetadata; if (um){ inTok = um.promptTokenCount || inTok; outTok = ((um.candidatesTokenCount || 0) + (um.thoughtsTokenCount || 0)) || outTok; }
      }
    }
    rec.ok = true;
    return { text:text.trim(), finish };
  }catch(e){
    const err = e instanceof AIError ? e : new AIError(0, e.message);
    rec.code = err.code; rec.err = (err.raw || '').slice(0, 160); throw err;
  }finally{
    rec.ms = Math.round(performance.now() - t0); rec.in = inTok; rec.out = outTok; rec.finish = finish;
    try{ if (inTok || outTok) await addUsage(model, inTok, outTok); await logCall(rec); }catch(e){}
  }
}
const isCut = f => /max_tokens|MAX_TOKENS/.test(f || '');
async function readBatch(tiles, signal, onLen){
  let frozen = 0;
  for (let attempt = 0; ; attempt++){
    const h0 = PG.hides;
    try{
      const r = await visionCall(tiles, signal, onLen);
      if (isCut(r.finish) && tiles.length > 1){
        const mid = Math.ceil(tiles.length / 2);
        return (await readBatch(tiles.slice(0, mid), signal, onLen)) + '\n' + (await readBatch(tiles.slice(mid), signal, onLen));
      }
      return r.text + (isCut(r.finish) ? '\n[잘림 — 이 조각은 말이 너무 많아요]' : '');
    }catch(e){
      if (e.code === -2) throw e;
      /* 앱이 뒤로 가서 얼었다 깨며 끊긴 것 — 실패로 안 세고, 화면이 보이면 다시 */
      if ([0, -1].includes(e.code) && (PG.hides !== h0 || document.hidden) && frozen < 4){ frozen++; attempt--; await waitVisible(); continue; }
      const again = [0, -1, 429, 500, 502, 503, 504, 529].includes(e.code) && e.kind !== 'day' && !e.billing;
      if (again && attempt < 2){ await sleepFor(Math.min(Math.max(e.retryMs || 0, 4000 * (attempt + 1)), 30000), signal); continue; }
      if (!again || e.kind === 'day') throw e;   /* 키·크레딧·하루 한도 — 다른 조각도 똑같이 안 된다 */
      const a = tiles[0], b = tiles[tiles.length - 1];
      return `[⚠ 사진 ${a.pic} 조각 ${a.part}${b !== a ? '~' + (b.pic !== a.pic ? '사진 ' + b.pic + ' 조각 ' : '') + b.part : ''} 못 읽음 — ${e.message}]`;
    }
  }
}
/* 묶음 경계에서 같은 줄이 두 번 나오면 하나만 */
const normLine = s => s.replace(/^\[[^\]]*\]\s*/, '').replace(/\s+/g, '');
function joinParts(parts){
  let out = [];
  for (const part of parts){
    let lines = part.split('\n').map(s => s.trimEnd()).filter(s => s.trim());
    if (out.length){
      if (/^방:/.test(lines[0] || '')) lines = lines.slice(1);
      let best = 0;
      for (let k = Math.min(8, lines.length, out.length); k > 0; k--){
        const a = out.slice(-k).map(normLine), b = lines.slice(0, k).map(normLine);
        if (a.every((x, i) => x && x === b[i])){ best = k; break; }
      }
      lines = lines.slice(best);
      const lastDate = [...out].reverse().find(s => /^---.*---$/.test(s));
      if (lastDate && lines[0] === lastDate) lines = lines.slice(1);
    }
    out = out.concat(lines);
  }
  return out.join('\n');
}
