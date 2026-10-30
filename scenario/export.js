/* export.js v1.0 — (v1.0) 내보내기 (민수: 녹화는 MP4 나 GIF — 에펙에서 씀)
   ■ 화면을 찍지 않고, 박자 기록 (● 녹화 때 Space 를 누른 때) 대로 한 장씩 다시 그려 파일을 만듦 → 끊김 없음 · 30 / 60fps 정확
     박자 기록이 없거나 '자동 박자' 를 고르면: 글이 다 나온 뒤 N초 쉬고 다음 카드
   ■ MP4 — H.264 + 전자음 (AAC). MP4 는 투명이 안 돼서 바탕 색을 깖 (초록이면 에펙 Keylight 로 뺌)
   ■ PNG 묶음 (.zip) — 투명 그대로. 에펙: 파일 > 가져오기 > 파일 > 첫 장 고르고 'PNG 시퀀스' 체크. 전자음은 sound.wav 로 같이
   ■ GIF — 투명 (가장자리는 1비트라 계단이 질 수 있음) · 크기 50% 기본 · 소리 없음
   ■ 부품: lib/mp4-muxer.js (MIT · Vanilagy) · lib/gifenc.esm.js (MIT · Matt DesLauriers) */
'use strict';
const EXP = { busy: false, stop: false, lastFile: null };
const expSleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 박자: 녹화한 것 또는 자동 ---------- */
function expAutoTake(hold){
  const B = ENG.beats, starts = []; let t = 0.4;
  for (const b of B){ starts.push(t); t += (b.line ? b.line.dur : 0) + (b.line ? hold : Math.max(0.8, hold * 0.8)); }
  return { base: 0, starts, fills: {}, end: t - hold + Math.min(hold, 1.2) };
}
// 녹화한 박자를 0초부터로 옮김 (카드가 줄었으면 자름)
function expNormTake(tk){
  const n = Math.min(tk.starts.length, ENG.beats.length - (tk.base || 0)); if (n <= 0) return null;
  const sh = 0.4 - tk.starts[0], fills = {};
  for (const [k, v] of Object.entries(tk.fills || {})) if (+k < (tk.base || 0) + n) fills[k] = v + sh;
  const end = tk.end != null && tk.starts.length <= n ? tk.end + sh : null;
  return { base: tk.base || 0, starts: tk.starts.slice(0, n).map(v => v + sh), fills, end };
}
const expEndOf = tk => engTakeEnd(tk) + 0.6;

/* ---------- 한 장 그리기: 그 장에 쓰인 움짤이 다 풀릴 때까지 기다렸다가 다시 그림 ---------- */
async function expDraw(t){
  let fr = null;
  for (let k = 0; k < 30; k++){
    ENG.renderUsed = new Set(); fr = engDraw(t);
    const wait = [...ENG.renderUsed].filter(A => !A.done && A.st !== 'fail'); ENG.renderUsed = null;
    if (!wait.length) break;
    await Promise.race([Promise.all(wait.map(A => A.ready)), expSleep(4000)]);
  }
  return fr;
}

/* ---------- 전자음: 장마다 소리 낼 때를 모아 OfflineAudioContext 로 ---------- */
async function expAudio(events, dur){
  const sr = 48000, ac = new OfflineAudioContext(2, Math.max(1, Math.ceil(dur * sr)), sr), g = ac.createGain();
  g.gain.value = ENG.opt.소리크기; g.connect(ac.destination);
  for (const e of events) engBlipAt(ac, g, e.t, e.pitch, e.ch);
  return ac.startRendering();
}
function expWav(buf){
  const n = buf.length, ch = buf.numberOfChannels, sr = buf.sampleRate, dv = new DataView(new ArrayBuffer(44 + n * ch * 2));
  const w = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); dv.setUint32(4, 36 + n * ch * 2, true); w(8, 'WAVE'); w(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, ch, true);
  dv.setUint32(24, sr, true); dv.setUint32(28, sr * ch * 2, true); dv.setUint16(32, ch * 2, true); dv.setUint16(34, 16, true); w(36, 'data'); dv.setUint32(40, n * ch * 2, true);
  const d = [...Array(ch)].map((_, c) => buf.getChannelData(c)); let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++){ const v = Math.max(-1, Math.min(1, d[c][i])); dv.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2; }
  return new Blob([dv.buffer], { type: 'audio/wav' });
}

/* ---------- zip (압축 없이 담기 — PNG 는 이미 압축돼 있음) ---------- */
const EXP_CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++){ let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function expCrc(u8){ let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = EXP_CRC[(c ^ u8[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function expZip(){
  const parts = [], dir = []; let off = 0; const enc = new TextEncoder();
  return {
    async add(name, blob){
      const u8 = new Uint8Array(await blob.arrayBuffer()), nm = enc.encode(name), crc = expCrc(u8), h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true); h.setUint16(10, 0, true); h.setUint16(12, 0x21, true);
      h.setUint32(14, crc, true); h.setUint32(18, u8.length, true); h.setUint32(22, u8.length, true); h.setUint16(26, nm.length, true); h.setUint16(28, 0, true);
      parts.push(h.buffer, nm, blob); dir.push({ nm, crc, size: u8.length, off }); off += 30 + nm.length + u8.length;
    },
    blob(){
      const cd = []; let cdSize = 0;
      for (const f of dir){ const c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true); c.setUint16(12, 0, true); c.setUint16(14, 0x21, true);
        c.setUint32(16, f.crc, true); c.setUint32(20, f.size, true); c.setUint32(24, f.size, true); c.setUint16(28, f.nm.length, true); c.setUint32(42, f.off, true); cd.push(c.buffer, f.nm); cdSize += 46 + f.nm.length; }
      const e = new DataView(new ArrayBuffer(22)); e.setUint32(0, 0x06054b50, true); e.setUint16(8, dir.length, true); e.setUint16(10, dir.length, true); e.setUint32(12, cdSize, true); e.setUint32(16, off, true);
      return new Blob([...parts, ...cd, e.buffer], { type: 'application/zip' });
    },
  };
}

/* ---------- MP4 (WebCodecs H.264 · AAC + mp4-muxer) ---------- */
async function expMp4Codec(W, H, fps){
  if (typeof VideoEncoder === 'undefined' || typeof Mp4Muxer === 'undefined') return null;
  for (const codec of ['avc1.640028', 'avc1.4d0028', 'avc1.420028']){
    const cfg = { codec, width: W, height: H, bitrate: 14e6, framerate: fps, avc: { format: 'avc' } };
    try { if ((await VideoEncoder.isConfigSupported(cfg)).supported) return cfg; } catch (e) {}
  }
  return null;
}
async function expAac(){ if (typeof AudioEncoder === 'undefined') return null; const cfg = { codec: 'mp4a.40.2', sampleRate: 48000, numberOfChannels: 2, bitrate: 160000 }; try { return (await AudioEncoder.isConfigSupported(cfg)).supported ? cfg : null; } catch (e){ return null; } }

/* ---------- 내보내기 ---------- */
// o = { fmt: 'mp4' | 'png' | 'gif', take: 'rec' | 'auto', hold, fps, bg (mp4 바탕 색), scale (gif) } · prog(0~1, 글)
async function expRun(o, prog){
  if (EXP.busy) return null;
  const tk = o.take === 'rec' && ENG.recTake ? expNormTake(ENG.recTake) : expAutoTake(o.hold || 1.5);
  if (!tk || !tk.starts.length) throw new Error('내보낼 카드가 없어요');
  const fps = o.fmt === 'gif' ? 25 : [24, 30, 60].includes(o.fps) ? o.fps : 30, dur = expEndOf(tk), N = Math.ceil(dur * fps), W = ENG.W, H = ENG.H;
  let vcfg = null, acfg = null;
  if (o.fmt === 'mp4'){ vcfg = await expMp4Codec(W, H, fps); if (!vcfg) throw new Error('이 브라우저는 MP4 를 못 만들어요 — 크롬 · 엣지 최신판에서 해 주세요 (아니면 PNG 묶음)'); if (ENG.opt.소리) acfg = await expAac(); }
  EXP.busy = true; EXP.stop = false; ENG.busy = true; ENG.inspect = null;
  const keepTl = ENG.tl; ENG.tl = tk;
  const snd = [], st = { beat: -1, n: 0 }; let lastBlip = -1;
  try {
    let out = null, zip = null, mux = null, venc = null, verr = null, gif = null, GE = null, small = null;
    const bg = document.createElement('canvas'); bg.width = W; bg.height = H; const bx = bg.getContext('2d');
    if (o.fmt === 'png') zip = expZip();
    if (o.fmt === 'mp4'){
      mux = new Mp4Muxer.Muxer({ target: new Mp4Muxer.ArrayBufferTarget(), video: { codec: 'avc', width: W, height: H, frameRate: fps }, audio: acfg ? { codec: 'aac', numberOfChannels: 2, sampleRate: 48000 } : undefined, fastStart: 'in-memory', firstTimestampBehavior: 'offset' });
      venc = new VideoEncoder({ output: (c, m) => mux.addVideoChunk(c, m), error: e => { verr = e; } }); venc.configure(vcfg);
    }
    if (o.fmt === 'gif'){
      GE = await import('./lib/gifenc.esm.js'); gif = GE.GIFEncoder();
      const k = o.scale || 0.5; small = document.createElement('canvas'); small.width = Math.round(W * k); small.height = Math.round(H * k);
    }
    const t0 = tk.starts[0] - 0.4;
    for (let f = 0; f < N; f++){
      if (EXP.stop) throw new Error('그만뒀어요');
      if (verr) throw verr;
      const t = t0 + f / fps, fr = await expDraw(t);
      engSoundStep(st, fr, (pitch, ch) => { const at = f / fps; if (at - lastBlip >= 0.028){ lastBlip = at; snd.push({ t: at, pitch, ch }); } });
      if (o.fmt === 'png'){ const b = await new Promise(r => ENG.cv.toBlob(r, 'image/png')); await zip.add(`frames/frame_${String(f).padStart(5, '0')}.png`, b); }
      else if (o.fmt === 'mp4'){
        bx.globalCompositeOperation = 'source-over'; bx.fillStyle = o.bg || '#00b140'; bx.fillRect(0, 0, W, H); bx.drawImage(ENG.cv, 0, 0);
        const vf = new VideoFrame(bg, { timestamp: Math.round(f * 1e6 / fps), duration: Math.round(1e6 / fps) });
        venc.encode(vf, { keyFrame: f % (fps * 2) === 0 }); vf.close();
        while (venc.encodeQueueSize > 6) await expSleep(2);
      } else {
        const sx = small.getContext('2d', { willReadFrequently: true }); sx.clearRect(0, 0, small.width, small.height); sx.imageSmoothingQuality = 'high'; sx.drawImage(ENG.cv, 0, 0, small.width, small.height);
        // 색은 보이는 픽셀만으로 255색 (rgb565 — 투명까지 넣으면 색이 4비트로 줄어 얼룩짐), 256번째가 투명
        const data = sx.getImageData(0, 0, small.width, small.height).data, n = small.width * small.height, op = new Uint8Array(n * 4); let m = 0;
        for (let i = 0; i < n; i++) if (data[i * 4 + 3] >= 110){ op[m * 4] = data[i * 4]; op[m * 4 + 1] = data[i * 4 + 1]; op[m * 4 + 2] = data[i * 4 + 2]; op[m * 4 + 3] = 255; m++; }
        const pal = m ? GE.quantize(op.subarray(0, Math.max(4, m * 4)), 255, { format: 'rgb565' }) : [[0, 0, 0]], idx = GE.applyPalette(data, pal, 'rgb565'), ti = pal.length; pal.push([0, 0, 0]);
        for (let i = 0; i < n; i++) if (data[i * 4 + 3] < 110) idx[i] = ti;
        gif.writeFrame(idx, small.width, small.height, { palette: pal, delay: Math.round(1000 / fps), transparent: true, transparentIndex: ti, dispose: 2 });
      }
      if (f % 3 === 0){ prog(f / N, `${f + 1} / ${N}장`); await expSleep(0); }
      if (f % 90 === 0) engAnimGc(engNow());
    }
    const name = expName(o.fmt === 'png' ? 'zip' : o.fmt);
    if (o.fmt === 'png'){
      prog(0.99, '소리 · 묶는 중');
      if (ENG.opt.소리 && snd.length) await zip.add('sound.wav', expWav(await expAudio(snd, N / fps)));
      await zip.add('읽어 보기.txt', new Blob([`시나리오 편집기 내보내기 — PNG ${N}장 · ${fps}fps · 1920 × 1080 · 투명 바탕\n\n에펙: 파일 > 가져오기 > 파일 → frames 폴더의 첫 장 (frame_00000.png) 을 고르고 'PNG 시퀀스' 를 체크 → 가져오기.\n프레임 속도가 다르면 푸티지 해석 (Interpret Footage) 에서 ${fps} 으로.\n전자음은 sound.wav (0초부터, 첫 장과 같이 시작).\n`], { type: 'text/plain' }));
      out = zip.blob();
    } else if (o.fmt === 'mp4'){
      if (acfg && snd.length){
        prog(0.99, '소리 넣는 중');
        const buf = await expAudio(snd, N / fps), aenc = new AudioEncoder({ output: (c, m) => mux.addAudioChunk(c, m), error: e => { verr = e; } }); aenc.configure(acfg);
        const L = buf.getChannelData(0), R = buf.getChannelData(1);
        for (let i = 0; i < buf.length; i += 1024){ const n = Math.min(1024, buf.length - i), d = new Float32Array(n * 2); d.set(L.subarray(i, i + n), 0); d.set(R.subarray(i, i + n), n);
          const ad = new AudioData({ format: 'f32-planar', sampleRate: 48000, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round(i * 1e6 / 48000), data: d }); aenc.encode(ad); ad.close(); }
        await aenc.flush(); aenc.close();
      }
      await venc.flush(); venc.close(); if (verr) throw verr; mux.finalize(); out = new Blob([mux.target.buffer], { type: 'video/mp4' });
    } else { gif.finish(); out = new Blob([gif.bytes()], { type: 'image/gif' }); }
    EXP.lastFile = { blob: out, name, frames: N, fps, sec: N / fps, sound: !!(snd.length && (o.fmt === 'png' || acfg)) };
    // 이 브라우저가 MP4 에 소리 (AAC) 를 못 넣으면 전자음만 따로 (zip 안 sound.wav — 받을 수 있는 형식이 zip 이라서)
    if (o.fmt === 'mp4' && !acfg && ENG.opt.소리 && snd.length){ const z = expZip(); await z.add('sound.wav', expWav(await expAudio(snd, N / fps))); EXP.lastFile.snd = { blob: z.blob(), name: name.replace(/\.mp4$/, '_sound.zip') }; }
    prog(1, '다 됐어요');
    return EXP.lastFile;
  } finally { ENG.tl = keepTl; ENG.busy = false; EXP.busy = false; ENG.renderUsed = null; engReset(0, false); }
}
function expName(ext){ const d = new Date(), p = n => String(n).padStart(2, '0'); return `scenario_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.${ext}`; }
