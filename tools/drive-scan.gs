/* 세희 폴더 훑기 v1 (2026-11-15, A)
   보스 드라이브의 앱스 스크립트로 돈다(보스 계정·보스 권한 — 구글 심사 대상 아님).
   「세희 sehee」 폴더를 10분마다 훑어서 같은 폴더의 「세희 폴더 목록」 시트에 적는다.
   세희 앱은 이 시트 하나만 한 번 골라 두면, 새로 들어온 파일·고쳐진 파일과 그 내용을 안다.
   - 「목록」 탭: 새 것부터. 이름 · 폴더 · 종류 · 고친 시각 · 처음 본 시각 · 상태(새 파일/고쳐짐) · ID · 링크
   - 「내용」 탭: 구글 문서·시트·글 파일은 내용(한 칸 4만5천 자까지). 사진·PDF·오피스 파일은 세희에서 골라야 읽음
   - 내용은 고친 시각이 바뀐 파일만 다시 읽는다
   처음 한 번: 위 메뉴에서 setup 을 골라 ▷실행 → 권한 허용. 그다음은 10분마다 저절로. */
const FOLDER_NAME = '세희 sehee';   /* 내 드라이브에서 이 이름의 폴더를 찾는다 */
const SHEET_NAME = '세희 폴더 목록';
const MAX = 45000, TZ = 'Asia/Seoul';

function setup(){
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('scan').timeBased().everyMinutes(10).create();
  scan();
}

function indexSheet_(folder){
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('sheetId');
  if (id){ try { const f = DriveApp.getFileById(id); if (!f.isTrashed()) return SpreadsheetApp.openById(id); } catch (e) {} }
  const ss = SpreadsheetApp.create(SHEET_NAME);
  DriveApp.getFileById(ss.getId()).moveTo(folder);
  props.setProperty('sheetId', ss.getId());
  return ss;
}

function tab_(ss, name, pos){
  let sh = ss.getSheetByName(name);
  if (!sh){ sh = ss.insertSheet(name, pos); }
  return sh;
}

function kind_(m){
  if (m === MimeType.GOOGLE_SHEETS) return '시트';
  if (m === MimeType.GOOGLE_DOCS) return '문서';
  if (m === MimeType.GOOGLE_SLIDES) return '슬라이드';
  if (m === MimeType.FOLDER) return '폴더';
  if (m === MimeType.PDF) return 'PDF';
  if (/^image\//.test(m)) return '사진';
  if (/^text\//.test(m)) return '글';
  if (/spreadsheetml|ms-excel/.test(m)) return '엑셀';
  if (/wordprocessingml|msword/.test(m)) return '워드';
  return '파일';
}

function text_(file){
  const m = file.getMimeType(), id = file.getId();
  try {
    if (m === MimeType.GOOGLE_DOCS) return DocumentApp.openById(id).getBody().getText();
    if (m === MimeType.GOOGLE_SHEETS){
      return SpreadsheetApp.openById(id).getSheets().slice(0, 12).map(s => {
        const v = s.getDataRange().getDisplayValues().slice(0, 300);
        return '## 탭: ' + s.getName() + '\n' + v.map((r, i) => (i + 1) + ': ' + r.join(' | ')).join('\n');
      }).join('\n\n');
    }
    if (/^text\//.test(m)) return file.getBlob().getDataAsString();
  } catch (e) { return '(못 읽음: ' + e.message + ')'; }
  return '(' + kind_(m) + ' — 세희에서 「파일 고르기」로 한 번 골라 주면 읽음)';
}

function walk_(folder, path, out, skipId){
  const fs = folder.getFiles();
  while (fs.hasNext()){ const f = fs.next(); if (f.getId() !== skipId) out.push({ f, path }); }
  const ds = folder.getFolders();
  while (ds.hasNext()){ const d = ds.next(); walk_(d, path + '/' + d.getName(), out, skipId); }
}

function folder_(){
  const props = PropertiesService.getScriptProperties(), id = props.getProperty('folderId');
  if (id){ try { const f = DriveApp.getFolderById(id); if (!f.isTrashed()) return f; } catch (e) {} }
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  if (!it.hasNext()) throw new Error('「' + FOLDER_NAME + '」 폴더가 없어요');
  const f = it.next(); props.setProperty('folderId', f.getId()); return f;
}

function scan(){
  const folder = folder_();
  const ss = indexSheet_(folder);
  const list = tab_(ss, '목록', 0), body = tab_(ss, '내용', 1);
  const def = ss.getSheetByName('시트1') || ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 2) ss.deleteSheet(def);

  /* 지난번 기록: id → { seen, upd, text } */
  const prev = {};
  list.getDataRange().getValues().slice(2).forEach(r => { if (r[6]) prev[r[6]] = { seen:r[4], upd:r[3] }; });
  body.getDataRange().getValues().slice(1).forEach(r => { if (r[0] && prev[r[0]]) prev[r[0]].text = r[3]; });

  const now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm');
  const items = []; walk_(folder, folder.getName(), items, ss.getId());
  const rows = items.map(({ f, path }) => {
    const id = f.getId(), upd = Utilities.formatDate(f.getLastUpdated(), TZ, 'yyyy-MM-dd HH:mm'), p = prev[id];
    const state = !p ? '새 파일' : (String(p.upd) !== upd ? '고쳐짐' : '');
    const text = p && !state && p.text !== undefined ? String(p.text) : String(text_(f)).slice(0, MAX);
    return { name:f.getName(), path, kind:kind_(f.getMimeType()), upd, seen:p ? p.seen : now, state, id, url:f.getUrl(), text };
  }).sort((a, b) => a.upd < b.upd ? 1 : -1);

  list.clear();
  list.getRange(1, 1).setValue('마지막으로 훑은 시각: ' + now + ' · 파일 ' + rows.length + '개 · 10분마다 저절로 갱신');
  const head = ['이름', '폴더', '종류', '고친 시각', '처음 본 시각', '상태', 'ID', '링크'];
  list.getRange(2, 1, 1, head.length).setValues([head]).setFontWeight('bold');
  if (rows.length) list.getRange(3, 1, rows.length, head.length).setNumberFormat('@')
    .setValues(rows.map(r => [r.name, r.path, r.kind, r.upd, r.seen, r.state, r.id, r.url]));

  body.clear();
  body.getRange(1, 1, 1, 4).setValues([['ID', '이름', '고친 시각', '내용']]).setFontWeight('bold');
  if (rows.length) body.getRange(2, 1, rows.length, 4).setNumberFormat('@')
    .setValues(rows.map(r => [r.id, r.name, r.upd, r.text]));
}
