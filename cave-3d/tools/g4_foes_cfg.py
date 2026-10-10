# g4_foes_cfg.py v1.2 (2026-10-10) — v1.2: 공격 그림 돌려 쓰기 이름 (attackB · attack2 · attack3 — motion.js 가 기본 공격 때 번갈아) · fidget (싸움 없을 때 가끔 하는 짓) · rest (오래 가만히 있으면 앉거나 쉼) · play (움짤 빠르기 · 한 번만)
# v1.1: holes (칸 안에 갇힌 흰 바탕 지우기) — GOOD WILL 은 흰 머리 때문에 빼고, 청승은 흰 별무늬 · 대검 구멍 때문에 큰 구멍만 (hole_opt)
# v1.0 — 4기 적 · 1기 영웅 새 동작 짝 표 (tools/g4_foes.py 가 읽음)
#  · 키 = 게임 SPR 키 (청승 cs · 작약 jakyak · 장군님 호레이쇼 janggun · 눈깔괴물 eyemon · 벤킨 benkin · 곤봉 거한 brute · GOOD WILL goodwill · 청광묵 cheong · 비나 (흑기사) bk)
#  · old = 지금 게임 대기 그림 (크기 기준): (파일, 첫 장 테두리 [x, y, w, h] 또는 None = 통째)
#  · keep = 그대로 두는 옛 자세 (움직이는 옛 대기 · 공격 움짤 등). 나머지는 새 그림이 덮거나 더함
#  · P · refs · sk 는 g4_moves_cfg.py 와 같은 모양 ('!칸' = 좌우 뒤집음). 모든 새 칸은 오른쪽을 봄 (f 1)
#  · fidget · rest · play: 게임 쪽 자세 고르기 (motion.js) — fidget = 싸움 없을 때 가끔 · rest = 오래 가만히 (동료 10초 · 안 들킨 적 12초) 면 하나 골라 앉거나 쉼 · play = 움짤 빠르기 (fps) · once (0 = 되풀이)
#  · erase: 칸에서 지울 것 — 'gray' = 회색 상대 인형 (GOOD WILL 마운트 파운딩, 민수: «상대캐릭터는 삭제해서 쓸거임»)
DATE = '2026-10-10'
W5 = ['r0c0', 'r0c1', 'r0c2', 'r0c3', 'r0c4']
FOES = {
  'cs': dict(name='청승', old=('art/foe/cs_idle.webp', [0, 0, 276, 340]), keep=['idle', 'attack', 'jump'],
    S=dict(A='청승추가/점프 스프라이트의 복원된 거대 대검', B='청승추가/청승 블루 오니의 액션 스프라이트 시트'),
    P=dict(walk=[('B', W5)], run=[('B', ['r1c0', 'r1c1'])], ready=[('A', ['r0c0'])], windup=[('B', ['r1c2'])], hurt=[('A', ['r0c2'])], down=[('A', ['r0c3'])],
           kneel=[('A', ['r0c4'])], rest=[('A', ['r1c0'])], guard=[('A', ['r1c1'])], guard2=[('A', ['r1c2'])], low=[('A', ['r1c3'])], attackB=[('B', ['r1c4'])]),
    refs=dict(B=[('r0c0', 0.98)], A=[('r1c1', 1.0)]), holes=['A', 'B'], hole_opt=dict(amin=300, flat_d=12), rest=['rest']),
  'jakyak': dict(name='작약', old=('art/foe/jakyak_idle.webp', [0, 0, 173, 360]), keep=['idle'],
    S=dict(A='작약추가/도끼 든 오니의 전투 포즈 스프라이트', B='작약추가/도끼를 든 오니 전사 스프라이트 시트', C='작약추가/붉은 오니 여전사의 10종 액션 스프라이트'),
    P=dict(walk=[('B', ['r0c1', 'r0c2', 'r0c3', 'r0c4'])], run=[('B', ['r1c0', 'r1c1'])], windup=[('B', ['r1c2'])], attack=[('B', ['r1c3'])], attackB=[('B', ['r1c4'])],
           hurt=[('C', ['r0c2'])], hurt2=[('C', ['r1c3'])], down=[('C', ['r0c3'])], kneel=[('C', ['r1c0'])], rest=[('C', ['r1c1'])], rest2=[('C', ['r1c2'])], guard=[('C', ['r1c4'])],
           jump=[('C', ['r1c5'])], ready=[('A', ['r0c2'])], attack3=[('A', ['r0c1'])], attack2=[('C', ['r0c0'])]),
    refs=dict(B=[('r0c1', 0.98)], A=[('r0c0', 1.0)], C=[('r0c2', 0.92)]), holes=['A', 'B', 'C'], rest=['rest', 'rest2']),
  'janggun': dict(name='장군님 호레이쇼', old=('art/foe/janggun_idle.webp', None), keep=[],
    S=dict(A='추가스프라이트/대장군 호레이쇼 3', B='추가스프라이트/대장군 호레이쇼(4성정도)', C='추가스프라이트/대장군호레이쇼2'),
    P=dict(idle=[('A', ['r0c0'])], walk=[('A', ['r0c1', 'r0c2', 'r0c3', 'r0c4'])], run=[('A', ['r1c0', 'r1c1'])], windup=[('A', ['r1c2'])], attack=[('A', ['r1c3'])], attackB=[('A', ['r1c4'])],
           slam=[('B', ['r1c1'])], windup2=[('B', ['r0c0'])], attack2=[('B', ['r0c2'])], hurt=[('C', ['r0c2'])], kneel=[('C', ['r0c3'])], down=[('C', ['r0c4'])], guard=[('C', ['r1c0'])],
           rest=[('C', ['r1c1'])], sit=[('C', ['r1c2'])], stance=[('C', ['r0c0'])], jump=[('C', ['r1c5'])]),
    refs=dict(A=[('r0c0', 1.0)], B=[('r0c0', 1.05)], C=[('r0c2', 0.92)]), holes=['A', 'B', 'C'], fidget=['stance'], rest=['sit', 'rest']),
  'eyemon': dict(name='눈깔괴물', old=('art/foe/eyemon_idle.webp', None), keep=['idle'],
    S=dict(A='추가스프라이트/눈 괴물 10종 포즈 스프라이트 시트', B='추가스프라이트/창백한 눈 괴물 10종 스프라이트 시트'),
    P=dict(walk=[('B', ['r0c1', 'r0c2', 'r0c3', 'r0c4'])], run=[('B', ['r1c0', 'r1c1'])], windup=[('B', ['r1c2'])], attack=[('B', ['r1c4'])], attack2=[('A', ['r0c1'])], crouch=[('A', ['r0c0'])],
           hurt=[('A', ['r0c2'])], hurt2=[('A', ['r0c4'])], idle2=[('A', ['r0c3'])], stance=[('B', ['r1c5'])], sit=[('A', ['r1c1'])], rest=[('A', ['r1c2'])], down=[('A', ['r1c3'])]),
    refs=dict(B=[('r0c1', 0.98)], A=[('r0c3', 0.95)]), holes=['A', 'B'], fidget=['idle2', 'stance', 'crouch'], rest=['sit', 'rest']),
  'benkin': dict(name='벤킨', old=('assets/benkin_idle.png', None), keep=['idle'],
    S=dict(A='벤킨추가/벤킨1', B='벤킨추가/벤킨2'),
    P=dict(walk=[('A', ['r0c1', 'r0c2', 'r0c3', 'r0c4'])], run=[('A', ['r1c0', 'r1c1'])], windup=[('A', ['r1c2'])], attack=[('A', ['r1c3'])], attackB=[('A', ['r1c4'])], ready=[('B', ['r0c0'])],
           spread=[('B', ['r0c1'])], hurt=[('B', ['r0c2'])], down=[('B', ['r0c3'])], kneel=[('B', ['r0c4'])], rest=[('B', ['r1c0'])], sit=[('B', ['r1c1'])], hurt2=[('B', ['r1c2'])],
           guard=[('B', ['r1c3'])], jump=[('B', ['r1c4'])]),
    refs=dict(A=[('r0c1', 0.98)], B=[('r0c0', 1.0)]), holes=['B'], fidget=['spread'], rest=['sit', 'rest']),
  'brute': dict(name='곤봉 거한', old=('assets/brute_idle.png', None), keep=['idle'],
    S=dict(A='추가스프라이트/거대 곤봉 괴물 10종 스프라이트', B='추가스프라이트/돌갑옷 거인의 다섯 가지 곤봉 공격', C='추가스프라이트/회색 거인의 클럽 전투 스프라이트'),
    P=dict(walk=[('C', W5)], run=[('C', ['r1c0', 'r1c1'])], windup=[('C', ['r1c2'])], attack=[('C', ['r1c3'])], attackB=[('C', ['r1c4'])], hurt=[('A', ['r0c2'])], down=[('A', ['r0c3'])],
           dead=[('A', ['r1c2'])], sit=[('A', ['r1c0'])], rest=[('A', ['r1c1'])], guard=[('A', ['r1c3'])], ready=[('A', ['r2c0'])], attack3=[('A', ['r0c1'])], low=[('A', ['r0c0'])],
           slam=[('B', ['r1c1'])], attack2=[('B', ['r0c1'])], windup2=[('B', ['r0c0'])]),
    refs=dict(C=[('r0c0', 0.98)], A=[('r2c0', 0.97)], B=[('r0c1', 0.95)]), holes=['A', 'B', 'C'], rest=['sit', 'rest']),
  'goodwill': dict(name='GOOD WILL', old=('assets/gw_idle.webp', [0, 0, 107, 310]), keep=['idle', 'attack', 'windup', 'knee', 'kneeHead', 'palm', 'slam', 'rise', 'dash', 'snap1', 'snap3'],
    S=dict(A='4기/굿윌 파운딩 마운트 파운딩의 상대캐릭터는 삭제해서 쓸거임', B='4기/굿윌1'),
    P=dict(walk=[('B', ['r0c0', 'r0c1', 'r0c2', 'r0c3'])], down=[('B', ['r1c0'])], kneel=[('B', ['r1c1'])], hurt=[('B', ['r1c2'])], ready=[('B', ['r2c0'])],
           pound=[('A', ['r0c0', 'r0c1', 'r0c2'])]),   # 굿윌1 r2c1 파운딩은 상대 인형이 진한 회색이라 못 지워 뺌
    refs=dict(B=[('r0c0', 0.98)], A=[('r0c1', 0.62)]),
    erase=dict(A=['r0c0', 'r0c1', 'r0c2']), play=dict(pound=dict(fps=6, once=0))),
  'cheong': dict(name='청광묵', old=('art/pro/goblin.webp', None), keep=['idle'],
    S=dict(A='청광묵추가/청광묵 팜 버스트 발동(강한 폭발과 반동, 강한 넉백과 화염데미지, 치명상시 머리 터지며 즉사)', B='청광묵추가/청광묵1',
           C='청광묵추가/청광묵의 다섯 가지 엉뚱한 일상', D='청광묵추가/청광묵의 다섯 가지 일상 포즈', E='청광묵추가/청광묵 팜 버스트준비'),
    P=dict(walk=[('B', ['r0c0', 'r0c1', 'r0c2', 'r0c3'])], run=[('B', ['r0c4', 'r0c5'])], down=[('B', ['r1c0'])], rest=[('B', ['r1c2'])], sit=[('B', ['r1c3'])],
           burstReady=[('E', ['r0c0'])], burst=[('A', ['r0c0', 'r0c1'])], eat=[('C', ['r0c1'])], snack=[('C', ['r0c0'])], bandage=[('C', ['r0c2'])], stumble=[('C', ['r1c0'])],
           stool=[('C', ['r1c1'])], idle2=[('D', ['r0c0'])], sit2=[('D', ['r0c1'])], carry=[('D', ['r0c2'])], hug=[('D', ['r1c0'])], sleep=[('D', ['r1c1'])]),
    refs=dict(B=[('r0c0', 0.98)], A=[('r0c0', 0.92)], C=[('r0c0', 1.0)], D=[('r0c0', 1.0)], E=[('r0c0', 0.95)]),
    art=dict(E='청광묵추가/청광묵 팜 버스트준비.png'), holes=['A', 'B', 'C', 'D', 'E'],
    fidget=['idle2', 'eat', 'snack', 'bandage', 'carry', 'stumble'], rest=['sit', 'sit2', 'stool', 'hug', 'sleep', 'rest'], play=dict(burst=dict(fps=5))),
  'bk': dict(name='비나 (흑기사)', old=('art/foe/bk_idle.webp', [0, 0, 226, 340]), keep=['idle', 'walk', 'attack', 'heavy', 'thrust', 'kick', 'bash'],
    S=dict(A='4기/흑기사 비나 특수5'),
    P=dict(hurt=[('A', ['r0c0'])], guard=[('A', ['r0c1'])], stun=[('A', ['r0c2'])], rest=[('A', ['r1c0'])], kneel=[('A', ['r1c1'])], down=[('A', ['r1c2'])]),
    refs=dict(A=[('r0c2', 0.97)]), holes=['A'], rest=['rest', 'kneel']),
}
