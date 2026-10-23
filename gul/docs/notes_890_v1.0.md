# v8.9.0 작업 메모 — notes_890 v1.0
- d5/poly/*.json 이름 바꿈 (polyfix → d5/fix → maps8.py). gboss1 out = 한가운데 (785,465). ruin2c1 · ruin2c2 는 d5/unused 로 (maps8.py 가 d5/fix 만 읽음) · build/art/maps 의 webp 도 지움.
- page8900.py v1.0 (page8890 위): FIX8[2] = 여덟 칸 + stairs · 칸 이름표 = 맵 이름 (bare 고정 맵) · z=1 목록에서 ruin2c1 · ruin2c2 뺌.
- 시험: ui8870.js v1.1 (여덟 칸 순서 · 이름표 · 칸마다 열기 · 낙사는 fmap2 만 · 아래 계단 → 3층) · ui8880 · ui8890 (새 이름). par890.sh · runui 그대로 (ui8870 이 이미 있음).
- mkgallery.py v1.1 → floor2_maps_v1.1.html.
