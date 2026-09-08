/**
 * 원파인데이 허브 - 구글시트 연동 API
 *
 * 설정 방법:
 * 1. 구글시트 열기 → 확장 프로그램 → Apps Script
 * 2. 기본 코드 지우고 이 내용 전체 붙여넣기
 * 3. SHEET_NAME을 실제 시트 탭 이름으로 바꾸기 (하단 탭에 적힌 이름, 보통 "시트1")
 * 4. TOKEN 값을 아무 문자열로 바꾸기 (비밀번호처럼, 남에게 알려주지 않기)
 * 5. 저장 (Ctrl+S)
 * 6. 배포 → 새 배포 → 유형: 웹 앱
 *    - 실행할 사용자: 나
 *    - 액세스 권한이 있는 사용자: 모든 사용자
 * 7. 배포 후 나오는 URL을 복사해서 Claude에게 전달
 *
 * 시트 첫 줄(헤더)에는 반드시 이 컬럼이 있어야 함: date, section, text, done, due, note
 */

const SHEET_NAME = '시트1'; // ← 실제 탭 이름으로 수정
const TOKEN = 'REPLACE_WITH_YOUR_OWN_SECRET'; // ← Apps Script 에디터 안에서만 실제 값으로 바꾸기 (이 저장소는 공개라서, 이 파일 자체엔 진짜 토큰을 절대 적지 말 것)

// 쓰기 가능한 필드를 제한 (여기 없는 필드는 절대 수정 불가)
const WRITABLE_FIELDS = ['done', 'text', 'note', 'due'];

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tz = ss.getSpreadsheetTimeZone();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const header = values[0].map(h => String(h).trim().toLowerCase());

  const rows = values.slice(1)
    .map((r, i) => {
      const obj = { row: i + 2 };
      header.forEach((h, idx) => {
        let v = r[idx];
        // 시트가 날짜를 실제 Date로 저장한 경우 'YYYY-MM-DD' 문자열로 정리
        if (v instanceof Date) v = Utilities.formatDate(v, tz, 'yyyy-MM-dd');
        obj[h] = v;
      });
      return obj;
    })
    .filter(o => o.date); // 빈 줄 제외

  return jsonOut(rows);
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ ok: false, error: 'invalid json' });
  }

  if (body.token !== TOKEN) {
    return jsonOut({ ok: false, error: 'unauthorized' });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(h => String(h).trim().toLowerCase());

  if (body.action === 'update') {
    if (!body.row || body.row < 2) return jsonOut({ ok: false, error: 'invalid row' });
    const fields = body.fields || {};
    Object.keys(fields).forEach(key => {
      const k = key.toLowerCase();
      if (WRITABLE_FIELDS.indexOf(k) === -1) return; // 허용 안 된 필드는 무시
      const col = header.indexOf(k);
      if (col === -1) return;
      sheet.getRange(body.row, col + 1).setValue(fields[key]);
    });
    return jsonOut({ ok: true });
  }

  if (body.action === 'append') {
    const fields = body.fields || {};
    if (!fields.date || !/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) {
      return jsonOut({ ok: false, error: 'date required (YYYY-MM-DD)' });
    }
    const newRow = header.map(h => {
      if (h === 'date') return fields.date;
      if (h === 'section') return fields.section || '';
      if (WRITABLE_FIELDS.indexOf(h) !== -1) return fields[h] || '';
      return '';
    });
    sheet.appendRow(newRow);
    return jsonOut({ ok: true, row: sheet.getLastRow() });
  }

  if (body.action === 'delete') {
    if (!body.row || body.row < 2) return jsonOut({ ok: false, error: 'invalid row' });
    sheet.deleteRow(body.row);
    return jsonOut({ ok: true });
  }

  return jsonOut({ ok: false, error: 'unknown action' });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
