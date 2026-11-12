# 세희 계정 서버 (sehee-sync) v1

세희 앱의 암호 로그인과 실시간 저장을 맡는 작은 서버예요. Cloudflare Worker 하나와 D1 데이터베이스 하나로 돌아가요(무료 등급으로 충분).

## 설치 (대시보드에서, 10분)
1. Cloudflare 로그인 → Storage & Databases → D1 → Create → 이름 `sehee` 로 만들기
2. Workers & Pages → Create → Worker → 이름 `sehee-sync` → Deploy
3. 방금 만든 Worker → Edit code → 내용을 이 폴더의 `worker.js` 로 통째로 바꾸고 Deploy
4. Worker → Settings → Bindings → Add → D1 database → Variable name `DB`, Database `sehee`
5. Worker → Settings → Variables and Secrets → Add → Type: Secret → Name `PINS` → Value `이름:암호` (예: `minsu:0000` 형식, 여러 명이면 쉼표)
6. Worker 주소(https://sehee-sync.○○○.workers.dev)를 세희 → 설정 → 계정 → 서버 주소에 넣고 저장 → 「암호로 열기」

암호는 코드나 이 저장소에 쓰지 않아요. 5번의 Secret 에만 넣어요.

## 동작
- `POST /login {pin, device}` → 토큰. 같은 사람의 이전 토큰은 무효(한 사람 한 기기)
- `GET /session` → 아직 내 차례인지. 다른 기기가 열었으면 401 `replaced`
- `GET /data` / `POST /data {puts, dels}` → 기록 받기/올리기(바뀐 것만)
- `POST /beacon?t=토큰` → 앱을 닫는 순간 마지막 저장
- `POST /logout`
- 암호 5번 틀리면 그 접속 15분 잠금, 전체 1시간 30번 넘게 틀리면 1시간 잠금

## 변경 기록
| 버전 | 날짜 | 내용 |
| --- | --- | --- |
| v1 | 2026-11-12 | 첫 버전 — 암호 로그인, 한 기기 세션, 실시간 저장, 잠금 |
