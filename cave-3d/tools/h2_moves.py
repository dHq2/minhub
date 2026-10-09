# h2_moves.py v1.1 — (v1.1: 도감 움짤 (codex/img) 을 동작으로 — 프레임이 있는데 게임에서 멈춰 있던 인물: 용묘화 (대기 · 공격 2 · 모아 내려치기 · 파내기) · 테헤라 (날며 대기 · 앉아 쉬기). 움짤은 그린 자리 그대로 (발을 한 장 기준으로 고정) · 작으면 키우지 않고 scale 로) v1.0 — 1차 업뎃 (2026-10-09): 2 · 3기 인물 새 동작 프레임 → 인물마다 동작 묶음 그림 art/h2/mov/<slug>.webp + src/h2_mov.js (H2MOV)
#  · 원본: 드라이브 '10.08 1차업뎃' 시트를 자른 칸 (python3 -I tools/up1_cut.py <시트 폴더> <자른 칸 폴더> tools/up1_cut_spec.json → <시트 이름>/r<줄>c<칸>.png) · 흑토끼 움짤 프레임 폴더 (움짤 webp 를 장마다 png 로 푼 것)
#  · 칸 → 동작: 아래 SHEETS. 같은 동작 이름 칸이 여럿이면 순서대로 한 줄 띠 (발 맞춤 · 같은 크기 칸) → 게임이 칸 격자로 재생
#     '동작#k' 는 띠 안의 자리 (다른 시트 칸을 사이에 끼울 때) · '인물:동작' 은 여러 인물 시트 (기절 모음)
#  · 크기: 서 있는 키 420px 로 묶고 (TARGET) 게임 크기는 scale = 대기 그림 키 / 420 — 노트의 대기 그림 (h0) 은 그대로라 옛 동작과 크기가 맞음
#     시트 배율은 그 시트 속 그 인물의 기준 칸 (걷기 · 서 있는 자세 — RATIO) 키를 대기 키에 맞춘 값. 한 시트 안에서는 같은 배율 (동작 사이 크기 그대로)
#  · H2MOV = { slug: { src, replace?, poses: { 동작: { rect [x,y,w,h,W,H], w, h, ax, ay, scale, src? (둘째 장), n?, cols?, rows?, fps?, once?, pingpong?, flat? } } } }
#     묶음 그림은 인물마다 한 장 (2048 안), 넘치면 <slug>_2.webp … (줄이지 않음)
#     h2.js 가 노트 동작 위에 덮어씀 (replace 면 노트 동작은 버림 — 옐로 리뉴얼). poren.js 도 포렌 동작에 덮어씀
#  · 옐로: 새 원화로 초상화 · 얼굴도 바꿈 (옛 것은 portrait_v1 · face_v1 로 남김)
# 실행: python3 tools/h2_moves.py <자른 칸 폴더> <원본 시트 폴더> <움짤 프레임 폴더>   → 그다음 python3 tools/h2_atlas.py (얼굴 모음) · 도감 h2_poses.py
import os, sys, json
import numpy as np
from PIL import Image, ImageSequence
from scipy import ndimage
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'art', 'h2', 'mov'); NOTES = os.path.join(ROOT, 'art', 'h2', 'notes'); CODEX = os.path.join(os.path.dirname(ROOT), 'codex', 'img')
TARGET = 420; PAD = 6; MAXW = 2048; MAXH = 2048
# 기준 칸 비율 (서 있는 대기 키 = 1)
RATIO = {'idle': 1.0, 'ready': 0.95, 'walk': 0.98, 'walkB': 0.98, 'run': 0.9, 'hurt': 0.92, 'hurt2': 0.9, 'stun': 0.88, 'guard': 0.94, 'taunt': 0.98, 'shoot': 0.95}
LYING = {'down', 'dead'}
# 동작마다 재생 (여러 장일 때)
PLAY = {'walk': dict(fps=7), 'walkB': dict(fps=5), 'run': dict(fps=11), 'heal': dict(fps=2.5), 'idle': dict(fps=8),
        'dead': dict(fps=4, once=1, flat=1), 'down': dict(flat=1)}
ONCE = dict(fps=8, once=1)   # 그 밖 여러 장 (공격 · 기술) = 한 번
S10 = lambda: {'r0c0': 'walk', 'r0c1': 'walk', 'r0c2': 'walk', 'r0c3': 'walk', 'r1c0': 'run', 'r1c1': 'run', 'r1c2': 'run', 'r1c3': 'run', 'r2c0': 'hurt', 'r2c1': 'down'}
W4 = lambda p='walk': {f'r0c{i}': p for i in range(4)}
# (시트 이름, 인물 (없으면 칸마다 '인물:동작'), {칸: 동작}, 덧붙임 {adj: 배율 손보기 (눈으로 본 크기 차이), ref: {칸: 비율 (키 = 대기 키 × 비율)}, refw: {칸: 비율 (가로 = 대기 키 × 비율 — 누운 몸)}, refiw: {칸: 비율 (가로 = 대기 그림 가로 × 비율 — 짐승)}, panel: 흰 칸 바탕 지움})
SHEETS = [
    # ── 벨 (인공천사): 옆 걷기 · 달리기는 전투 시트, 맞음 · 막기 · 쓰러짐 · 아픔 · 무릎은 앞뒤 시트 아래 줄
    ('인공 천사 전투 스프라이트 시트', 'bel', {**W4(), 'r0c4': 'run', 'r0c5': 'run', 'r0c6': 'run', 'r0c7': 'run', 'r1c4': 'crouch', 'r2c0': 'low'}, {'adj': 1.12}),   # 옛 대기 (날개 · 후광) 보다 작게 나와 키움
    ('a0472331-6332-4013-a97d-efc70fc15985', 'bel', {'r1c0': 'hurt', 'r1c1': 'guard', 'r1c2': 'down', 'r1c3': 'hurt2', 'r1c4': 'kneel'}, {'adj': 1.12}),
    # ── 간두: 앞 2 · 뒤 2 걷기 (카메라 쪽 · 먼 쪽) · 샷건 동작
    ('갇누 걷기, 피격', 'gandu', {'r0c0': 'walk', 'r0c1': 'walk', 'r0c2': 'walkB', 'r0c3': 'walkB', 'r1c0': 'hurt'}, {}),
    ('간두 근거리, 원거리 견제 특수 샷건', 'gandu', {'r0c0': 'shoot', 'r0c2': 'low', 'r0c3': 'crouch', 'r0c4': 'finisher', 'r1c1': 'attack', 'r1c3': 'ready'}, {'ref': {'r1c3': 0.97}}),
    # ── 기절 모음 (흑토끼 X 칸 · 펄 칸은 안 씀)
    ('개성 만점 다섯 캐릭터 스프라이트-28', None, {'r0c0': 'yellow:stun', 'r0c1': 'yongmyo:stun', 'r1c0': 'moro:stun', 'r1c1': 'goldknight:stun'}, {}),
    ('기절한 다섯 전사 스프라이트-27', None, {'r0c0': 'gari:stun', 'r0c1': 'gundevil:stun', 'r0c2': 'ohe:stun', 'r1c1': 'rook:stun'}, {}),
    ('네 전사의 지친 전투 스프라이트 시트-14', None, {'r0c0': 'poren:stun', 'r0c3': 'mstar:stun'}, {}),
    # ── 기사단장: 걷기 셋째는 X → 반대발 그림을 그 자리에
    ('걸어단장', 'knightcaptain', {'r0c0': 'walk#0', 'r0c1': 'walk#1', 'r0c3': 'walk#3'}, {}),
    ('걸어단장반대발프레임', 'knightcaptain', {'r0c0': 'walk#2'}, {'ref': {'r0c0': 0.98}}),
    ('뛰어단장', 'knightcaptain', {'r0c0': 'run', 'r0c1': 'run', 'r1c0': 'run', 'r1c1': 'run'}, {}),
    ('단장스턴', 'knightcaptain', {'r0c0': 'stun'}, {}),
    ('피격단장', 'knightcaptain', {'r0c0': 'hurt'}, {}),
    ('사망단장', 'knightcaptain', {'r0c0': 'down'}, {}),
    # ── 흑토끼: 기본 · 공중제비 내려찍기 (칸마다 흰 바탕) · 필살 (낮게)
    ('그냥 쓰는 흑토끼', 'blackrabbit', S10(), {}),
    ('공중제비3+수직찍기', 'blackrabbit', {'r0c0': 'plunge#0', 'r0c1': 'plunge#1', 'r1c0': 'plunge#2', 'r1c1': 'plunge#3'}, {'ref': {'r1c1': 0.78}, 'panel': 1}),
    ('흑토끼 필살기 점핑 내려찍기, 공중제비후 반갈죽', 'blackrabbit', {'r0c0': 'special'}, {'ref': {'r0c0': 0.42}}),
    # ── 기본 10칸 (걷기 4 · 달리기 4 · 맞음 · 쓰러짐)
    ('그냥 쓰는 금기사', 'goldknight', S10(), {}),
    ('그냥 쓰는 모로', 'moro', S10(), {}),
    ('그냥 쓰는 복스', 'gari', S10(), {}),
    ('그냥 쓰는 용묘화', 'yongmyo', S10(), {}),
    ('룩 쓸만', 'rook', S10(), {}),
    ('오헤야기본', 'ohe', S10(), {}),
    ('반대 다리 동작의 10칸 캐릭터 시트-17', 'yellow', S10(), {}),
    ('반대 다리로 걷는 전투 포즈 시트-23', 'gundevil', {**W4(), 'r1c0': 'run', 'r1c1': 'run', 'r1c2': 'run', 'r2c0': 'hurt', 'r2c1': 'down'}, {}),   # 달리기 넷째 X
    ('중갑 기사 걷기·달리기·기절 스프라이트 시트', 'tank', {**W4(), 'r1c0': 'run', 'r1c1': 'run', 'r1c2': 'run', 'r1c3': 'run', 'r2c0': 'hurt', 'r2c1': 'stun'}, {}),
    ('황동 중장기사 걷기·달리기·기절 스프라이트', 'venti', {**W4(), 'r1c0': 'run', 'r1c1': 'run', 'r1c2': 'run', 'r1c3': 'run', 'r2c0': 'hurt', 'r2c1': 'stun'}, {}),
    ('베테랑쥐 걷기', 'ratvet', {**W4(), 'r1c0': 'run', 'r1c1': 'run', 'r1c2': 'run', 'r1c3': 'run', 'r1c4': 'hurt', 'r1c5': 'down'}, {}),
    ('큰쥐들', 'ratknight', {**W4(), 'r1c0': 'run', 'r1c1': 'run', 'r1c2': 'run', 'r1c3': 'run', 'r1c4': 'hurt', 'r1c5': 'down'}, {}),
    ('별눈 모닝스타 전사 10프레임 스프라이트 시트-13', 'mstar', {**W4(), 'r0c4': 'run', 'r1c0': 'run', 'r1c1': 'run', 'r1c2': 'run', 'r1c3': 'hurt', 'r1c4': 'down'}, {}),
    ('포렌 걷뛰엎어짐', 'poren', {**W4(), 'r0c4': 'run', 'r1c0': 'run', 'r1c1': 'run', 'r1c2': 'run', 'r1c3': 'hurt', 'r1c4': 'down'}, {}),
    ('포렌 순직', 'poren', {'r0c0': 'dead'}, {'ref': {'r0c0': 0.72}}),
    # ── 마리
    ('당당한 마리 걸음', 'mari', W4(), {}),
    ('런마리런', 'mari', {'r0c0': 'run', 'r0c1': 'run', 'r1c0': 'run', 'r1c1': 'run'}, {}),
    ('마리스턴', 'mari', {'r0c0': 'stun'}, {}),
    ('피격마리', 'mari', {'r0c0': 'hurt'}, {}),
    ('엎어져마리', 'mari', {'r0c0': 'down'}, {}),
    # ── 돌쇠 · 로젤 · 칸야 · 하르겐 (쓰러지는 단계는 죽음 띠)
    ('돌쇠 걷기, 스턴, 맞기', 'dolsoe', {**W4(), 'r1c0': 'hurt', 'r1c1': 'guard', 'r1c2': 'down', 'r1c3': 'stun'}, {}),
    ('로젤', 'rozel', {**W4(), 'r1c0': 'dead', 'r1c1': 'dead', 'r1c2': 'dead'}, {}),
    ('칸야 걷기, 스턴등', 'kanya', {**W4(), 'r1c0': 'hurt', 'r1c1': 'down', 'r1c2': 'kneel'}, {}),
    ('하르겐 걷기', 'wangnim', {**W4(), 'r1c0': 'dead', 'r1c1': 'dead', 'r1c2': 'dead'}, {}),
    # ── 마당쇠 · 잉끌레이도르: 앞 2 · 뒤 2 걷기
    ('마당쇠 걷기, 스턴맞기', 'madangsoe', {'r0c0': 'walk', 'r0c1': 'walk', 'r0c2': 'walkB', 'r0c3': 'walkB', 'r1c0': 'hurt', 'r1c1': 'stun'}, {}),
    ('마당쇠 공격, 특수', 'madangsoe', {'r0c1': 'attack', 'r1c2': 'attack', 'r1c0': 'kick', 'r1c4': 'kick', 'r0c2': 'special', 'r0c3': 'special'}, {'ref': {'r1c2': 0.93}}),
    ('잉끌레걷기', 'inclador', {'r0c0': 'walk', 'r0c1': 'walk', 'r0c2': 'walkB', 'r0c3': 'walkB'}, {}),
    ('잉끌레이도르 필살기', 'inclador', {'r0c0': 'special'}, {'ref': {'r0c0': 0.9}}),
    # ── 비숏: 걷기 · 쓰러지는 다섯 단계 · 특수 (발차기)
    ('비숍 걷기, 기타', 'bishot', {**W4(), 'r1c0': 'dead', 'r1c1': 'dead', 'r1c2': 'dead', 'r1c3': 'dead', 'r1c4': 'dead'}, {}),
    ('비숏 특수', 'bishot', {'r1c1': 'attack', 'r1c2': 'attack', 'r0c0': 'attackB', 'r0c1': 'attackB'}, {'ref': {'r0c2': 0.93}}),
    ('특수 비숍', 'bishot', {'r0c1': 'ready', 'r0c2': 'crouch'}, {'ref': {'r0c0': 0.98}}),
    # ── 테헤라: 비틀 비행 · 쓰러짐
    ('비틀거리는 비행과 쓰러진 요정-11', 'tehera', {'r0c0': 'hurt', 'r0c1': 'down'}, {'refw': {'r0c1': 1.0}}),
    # ── 일반 쥐: 가운데 크기 (공격 · 죽음)
    ('공쥐,사망쥐', 'ratsmall', {'r0c1': 'attack', 'r1c1': 'dead'}, {'refiw': {'r0c1': 0.95}}),
    # ── 가리 (복스) 복싱 · 오헤 발차기
    ('금발 복서의 10가지 복싱 자세-11', 'gari', {'r0c0': 'ready', 'r0c1': 'attack', 'r0c3': 'attack', 'r1c1': 'attack2', 'r0c2': 'attack2', 'r1c0': 'attack3', 'r1c3': 'attack3', 'r1c2': 'guard'}, {'ref': {'r0c0': 0.95}, 'adj': 1.08}),
    ('오헤야기술2', 'ohe', {'r0c0': 'ready', 'r0c1': 'attack', 'r0c2': 'attack', 'r1c3': 'kick'}, {'ref': {'r0c0': 0.97}}),
    ('오헤야기술', 'ohe', {'r0c4': 'attackB', 'r1c0': 'attackB', 'r1c1': 'special'}, {'ref': {'r0c4': 0.95}}),
    # ── 옐로 (완전 리뉴얼): 갈퀴 전투 모습 (링거대를 등에 멤) — 원화 · 걷기 · 달리기 · 맞음 · 쓰러짐 · 공격 · 덮치기 · 치료 · 기절 · 어이없음
    ('옐로 리뉴얼', 'yellow', {'r0c0': 'idle'}, {}),
    ('옐로 감정표현1(얼탱없음)', 'yellow', {'r0c0': 'taunt'}, {}),
    ('옐로 근접공격', 'yellow', {'r1c1': 'windup', 'r0c0': 'attack', 'r0c2': 'attack', 'r1c3': 'attack2', 'r0c3': 'attack2', 'r1c0': 'attack2', 'r1c4': 'ready'}, {'ref': {'r1c4': 0.95}}),
    ('옐로 근접전', 'yellow', {'r0c0': 'crouch', 'r0c2': 'jump2'}, {'ref': {'r0c4': 0.95}}),
    ('옐로 특수2', 'yellow', {'r0c1': 'heal', 'r0c4': 'heal'}, {'ref': {'r0c2': 0.98}}),
]
# 흑토끼 고화질 대기 움짤 (24장 → 8장)
ANIMS = [('코퀄 흑토끼 idle', 'blackrabbit', 'idle', 3, 1.0)]   # (폴더, 인물, 동작, 몇 장마다, 첫 장 키 비율) — 24장 중 8장
# v1.1 도감 움짤 → 동작: (codex/img 아래 파일, 인물, 동작, 쓸 장 번호, (키 기준 장, 그 장 키 ÷ 서 있는 키), 발 기준 장, 재생, 띄움 (서 있는 키 비율))
#  · 장마다 발을 다시 맞추지 않음 (움짤 속 움직임 그대로) — 발 기준 장의 발 (가로 가운데 · 바닥) 이 인물 자리
#  · 용묘화 움짤은 대기만 크게 그려짐 (서 있는 키 339px), 공격 넷은 275px — 장마다 그 움짤의 첫 장 (서 있음) 으로 키를 맞춤
#  · 쓰는 곳: attack · attackB = 기본 공격 번갈아, charge → smash = 모아 내려치기 (기술 pose · pose2), dig → dig2 = 파내기 · 파묻기, sit = 나른한 꿈 · 오래 가만히 있으면 앉아 쉼 (motion.js)
CANIMS = [
    ('tomoe/tomoe_idle.webp', 'yongmyo', 'idle', list(range(16)), (0, 1.0), 0, dict(fps=8), 0),
    ('tomoe/tomoe_basic_attack.webp', 'yongmyo', 'attack', [2, 3, 4, 5, 6], (0, 1.0), 6, dict(fps=14, once=1), 0),
    ('tomoe/tomoe_dash_smash.webp', 'yongmyo', 'attackB', [6, 7, 8, 9, 10, 11, 12], (0, 1.0), 9, dict(fps=16, once=1), 0),
    ('tomoe/tomoe_charge_smash.webp', 'yongmyo', 'charge', [3, 4, 5, 6, 7, 8, 9], (0, 1.0), 3, dict(fps=12, once=1), 0),
    ('tomoe/tomoe_charge_smash.webp', 'yongmyo', 'smash', [10, 11, 12, 13, 14, 15, 16, 17], (0, 1.0), 11, dict(fps=24, once=1), 0),
    ('tomoe/tomoe_dig.webp', 'yongmyo', 'dig', [5, 6, 7, 8], (0, 1.0), 5, dict(fps=8, once=1), 0),
    ('tomoe/tomoe_dig.webp', 'yongmyo', 'dig2', [9, 10, 11, 12, 13, 14, 15, 16], (0, 1.0), 10, dict(fps=22, once=1), 0),
    ('char/tehera_fly_idle.webp', 'tehera', 'idle', list(range(0, 30, 2)), (0, 1.04), 0, dict(fps=4.5), 0.08),
    ('char/tehera_sit_idle.webp', 'tehera', 'sit', list(range(0, 28, 2)), (0, 0.95), 0, dict(fps=4), 0),
]
REPLACE = {'yellow'}   # 노트의 옛 동작을 게임에서 뺌
ALIAS = {'yellow': {'dash': 'run', 'prowl': 'crouch', 'hurt2': 'stun'}}   # 기술 · 엔진이 부르는 옛 이름 → 새 동작

def alpha_bbox(im, thr=40):
    a = np.asarray(im)[..., 3] > thr; ys = np.where(a.any(1))[0]; xs = np.where(a.any(0))[0]
    return (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1) if len(xs) else (0, 0, im.width, im.height)
def crop(im):
    return im.crop(alpha_bbox(im, 24))
def clean_panel(im):
    """칸마다 흰 바탕 (그림 칸 테두리 안) — 가장자리 6px 깎고, 가장자리에서 이어진 밝은 바탕을 지움"""
    a = np.asarray(im.convert('RGBA')).copy()[6:-6, 6:-6]
    rgb = a[..., :3].astype(int); bright = (rgb.min(2) > 225) & (rgb.max(2) - rgb.min(2) < 18)
    lab, n = ndimage.label(bright); edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    kill = np.isin(lab, list(edge)); a[kill, 3] = 0
    soft = ndimage.binary_dilation(kill, iterations=2) & ~kill & (rgb.min(2) > 200); a[soft, 3] = np.minimum(a[soft, 3], 90)
    return crop(Image.fromarray(a))
def foot(im):
    a = np.asarray(im)[..., 3] > 60; h = a.shape[0]; band = a[int(h * 0.92):]
    cols = np.where(band.any(0))[0]
    return int((cols.min() + cols.max()) / 2) if len(cols) else im.width // 2
def foot_at(im):
    """판 위 발 자리 (x, y) — 그림 테두리 안에서 찾은 발을 판 좌표로"""
    x0, y0, x1, y1 = alpha_bbox(im, 60); return x0 + foot(im.crop((x0, y0, x1, y1))), y1
def strip(frames, fix=None):
    """같은 크기 칸에 발 (아래 가운데) 을 맞춰 줄 세움. 띠가 묶음 가로를 넘으면 여러 줄 격자로 접음
       fix = (발 x, 발 y — 그림 위에서부터, 띄움 px): 움짤처럼 같은 판에 그려진 장들은 발을 다시 맞추지 않고 이 자리를 발로 (v1.1)"""
    fx = [fix[0]] * len(frames) if fix else [foot(f) for f in frames]; ax = max(fx); cw = max(ax - x + f.width for f, x in zip(frames, fx)) + 2 * PAD; ch = max(f.height for f in frames) + 2 * PAD
    ax += PAD; n = len(frames); cols = max(1, min(n, int(MAXW * 0.98 // cw))); rows = -(-n // cols)
    S = Image.new('RGBA', (cw * cols, ch * rows), (0, 0, 0, 0))
    for i, (f, x) in enumerate(zip(frames, fx)):
        r, c = divmod(i, cols); S.paste(f, (c * cw + ax - x, r * ch + ch - PAD - f.height), f)
    ay = ch - PAD - 1
    if fix: hmax = max(f.height for f in frames); ay = ch - PAD - hmax + fix[1] + fix[2]
    return S, cw, ch, ax, ay, cols, rows
def shelf(items, W):
    x = y = rowh = 0; pos = {}
    for k, w, h in items:
        if x + w > W: x = 0; y += rowh + PAD; rowh = 0
        pos[k] = (x, y); x += w + PAD; rowh = max(rowh, h)
    return pos, y + rowh
def idle_fig(slug):
    if slug == 'poren':   # 포렌은 노트가 없음 — poren_sheets.js 대기 칸 높이
        s = open(os.path.join(ROOT, 'src', 'poren_sheets.js'), encoding='utf-8').read(); P = json.loads(s[s.index('{'):s.rindex('}') + 1]); return P['idle']['h'] - 2, 1.0, P['idle']['w']
    o = json.load(open(os.path.join(NOTES, slug + '.json'), encoding='utf-8')); p = o['poses']['idle']
    im = Image.open(os.path.join(ROOT, p['src'])).convert('RGBA'); x0, y0, x1, y1 = alpha_bbox(im)
    return (y1 - y0), p.get('gscale', 1.0), (x1 - x0)

def main():
    CUT, RAW, ANIM = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(OUT, exist_ok=True)
    frames = {}   # slug → pose → [(idx, image)]
    fig = {}
    FIX, MUL, PLY = {}, {}, {}   # v1.1 움짤: (인물, 동작) → 고정 발 · 게임 크기 곱 · 재생
    SRC = {}   # v1.1 (인물, 동작) → 원본 (시트 칸 · 움짤) — tools/h2_mov_sources.json (도감 h2_poses.py 가 읽음)
    def put(slug, pose, idx, im):
        frames.setdefault(slug, {}).setdefault(pose, []).append((idx, im))
    for stem, slug0, cells, opt in SHEETS:
        d = os.path.join(CUT, stem)
        ims = {}
        for c, lab in cells.items():
            im = Image.open(os.path.join(d, c + '.png')).convert('RGBA')
            im = clean_panel(im) if opt.get('panel') else crop(im)
            sl, p = lab.split(':') if ':' in lab else (slug0, lab)
            ims[c] = (sl, p, im)
        refs = {}
        for c, r in (opt.get('ref') or {}).items():
            im = ims[c][2] if c in ims else (clean_panel if opt.get('panel') else crop)(Image.open(os.path.join(d, c + '.png')).convert('RGBA'))
            sl = ims[c][0] if c in ims else slug0
            refs.setdefault(sl, []).append(('h', r, im))
        for c, r in (opt.get('refw') or {}).items(): refs.setdefault(ims[c][0], []).append(('w', r, ims[c][2]))
        for c, r in (opt.get('refiw') or {}).items(): refs.setdefault(ims[c][0], []).append(('iw', r, ims[c][2]))
        by = {}
        for c, (sl, p, im) in ims.items(): by.setdefault(sl, []).append((c, p, im))
        for sl, L in by.items():
            if sl not in fig: fig[sl] = idle_fig(sl)
            F, g0, FW = fig[sl]; D = min(1.0, TARGET / F)   # 묶음 밀도: 서 있는 키 = F × D px
            est = []
            for kind, r, im in refs.get(sl, []):
                x0, y0, x1, y1 = alpha_bbox(im); est.append((FW if kind == 'iw' else F) * D * r / ((y1 - y0) if kind == 'h' else (x1 - x0)))
            if not est:
                for c, p, im in L:
                    base = p.split('#')[0]
                    if base in RATIO:
                        x0, y0, x1, y1 = alpha_bbox(im); est.append(F * D * RATIO[base] / (y1 - y0))
            if not est:   # 누운 그림뿐: 가로 = 대기 키 × 1.05
                for c, p, im in L:
                    x0, y0, x1, y1 = alpha_bbox(im); est.append(F * D * 1.05 / (x1 - x0))
            s = float(np.median(est)) * opt.get('adj', 1.0)
            order = {}
            for c, p, im in L:
                base, _, k = p.partition('#')
                im2 = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
                n_ = order.get(base, 0); order[base] = n_ + 1
                idx = int(k) if k else 1000 + len(frames.get(sl, {}).get(base, [])) + n_
                put(sl, base, idx, im2); SRC.setdefault((sl, base), []).append(f'{stem} {c}')
            print(f'{stem[:28]:28} {sl:13} 배율 {s:.3f} (기준 {len(est)}칸) → {", ".join(sorted({p.split("#")[0] for _, p, _ in L}))}')
    for folder, sl, pose, step, r in ANIMS:
        d = os.path.join(ANIM, folder); fs = sorted(f for f in os.listdir(d) if f.endswith('.png'))[::step]
        raw = [Image.open(os.path.join(d, f)).convert('RGBA') for f in fs]
        for im in raw:
            a = np.asarray(im).copy(); a[a[..., 3] < 60] = 0; im.paste(Image.fromarray(a))
        bb = None
        for im in raw:
            b = alpha_bbox(im, 60); bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
        raw = [im.crop(bb) for im in raw]
        if sl not in fig: fig[sl] = idle_fig(sl)
        F = fig[sl][0]; D = min(1.0, TARGET / F); x0, y0, x1, y1 = alpha_bbox(raw[0], 60); s = F * D * r / (y1 - y0)
        for i, im in enumerate(raw): put(sl, pose, i, im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS))
        SRC.setdefault((sl, pose), []).append(f'움짤 {folder} ({len(raw)}장)')
        print(f'움짤 {folder} → {sl} {pose} {len(raw)}장 배율 {s:.3f}')
    for rel, sl, pose, idx, (ri, r), ai, play, lift in CANIMS:
        fr = [x.convert('RGBA') for x in ImageSequence.Iterator(Image.open(os.path.join(CODEX, rel)))]
        for im in fr:
            a = np.asarray(im).copy(); a[a[..., 3] < 60] = 0; im.paste(Image.fromarray(a))
        sel = [fr[i] for i in idx]; bb = None
        for im in sel:
            b = alpha_bbox(im, 60); bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
        if sl not in fig: fig[sl] = idle_fig(sl)
        F = fig[sl][0]; D = min(1.0, TARGET / F); x0, y0, x1, y1 = alpha_bbox(fr[ri], 60)
        s = F * D * r / (y1 - y0); k = min(1.0, s)   # 크면 줄이고, 작으면 그대로 두고 게임 크기 (scale) 로 키움
        fx, fy = foot_at(fr[ai]); std = F * D * k / s   # 서 있는 키 (묶음 px)
        for i, im in enumerate(sel):
            c = im.crop(bb); put(sl, pose, i, c.resize((max(1, round(c.width * k)), max(1, round(c.height * k))), Image.LANCZOS))
        FIX[(sl, pose)] = (round((fx - bb[0]) * k), round((fy - bb[1]) * k) - 1, round(lift * std)); MUL[(sl, pose)] = s / k; PLY[(sl, pose)] = play
        SRC.setdefault((sl, pose), []).append(f'codex:img/{rel} {idx[0]}-{idx[-1]}')
        print(f'도감 움짤 {rel} → {sl} {pose} {len(sel)}장 배율 {s:.3f} ({"그대로 · 게임에서 키움" if s > 1 else "줄임"})')
    MOV = {}
    for sl, P in frames.items():
        F, g0, _ = fig[sl]; D = min(1.0, TARGET / F)
        strips = {}
        for pose, L in P.items():
            L.sort(key=lambda t: t[0]); fr = [im for _, im in L]
            strips[pose] = (*strip(fr, FIX.get((sl, pose))), len(fr))
        # 묶음: 거의 정사각 한 장에 들면 한 장, 넘치면 가로 2048 로 여러 장 (줄이지 않음 — 화질 그대로)
        items = sorted(((n, v[0].width, v[0].height) for n, v in strips.items()), key=lambda t: -t[2])
        W = min(MAXW, max(int((sum(w * h for _, w, h in items) * 1.15) ** 0.5), max(w for _, w, _ in items)))
        pos, H = shelf(items, W)
        if H > MAXH:
            W = MAXW; pos = {}; x = y = rowh = 0; pg = 0
            for n, w, h in items:
                if x + w > W: x = 0; y += rowh + PAD; rowh = 0
                if y + h > MAXH: pg += 1; x = y = rowh = 0
                pos[n] = (x, y, pg); x += w + PAD; rowh = max(rowh, h)
        else: pos = {n: (x, y, 0) for n, (x, y) in pos.items()}
        pages = sorted({v[2] for v in pos.values()}); Q = {}; files = []
        for pg in pages:
            mine = [(n, w, h) for n, w, h in items if pos[n][2] == pg]
            PW = max(pos[n][0] + w for n, w, h in mine); PH = max(pos[n][1] + h for n, w, h in mine)
            sheet = Image.new('RGBA', (PW, PH), (0, 0, 0, 0)); name = sl + ('' if pg == 0 else f'_{pg + 1}')
            for n, w, h in mine:
                S, cw, ch, ax, ay, cols, rows, cnt = strips[n]
                x, y, _ = pos[n]; sheet.paste(S, (x, y))
                q = {'rect': [x, y, w, h, PW, PH], 'w': cw, 'h': ch, 'ax': ax, 'ay': ay, 'scale': round(g0 / D * MUL.get((sl, n), 1.0), 4)}
                if pg: q['src'] = f'art/h2/mov/{name}.webp'
                if cnt > 1: q.update({'n': cnt, 'cols': cols, 'rows': rows, **(PLY.get((sl, n)) or PLAY.get(n, ONCE))})
                elif n in PLAY and 'flat' in PLAY[n]: q['flat'] = 1
                Q[n] = q
            sheet.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=86, method=4); files.append((name, PW, PH))
        for a, b in ALIAS.get(sl, {}).items():
            if a not in Q and b in Q: Q[a] = Q[b]
        MOV[sl] = {'src': f'art/h2/mov/{sl}.webp', 'poses': Q, **({'replace': 1} if sl in REPLACE else {})}
        desc = ' '.join(n + ('x' + str(v['n']) if 'n' in v else '') for n, v in Q.items())
        print(f'  {sl:13} ' + ' + '.join(f'{PW}x{PH} {os.path.getsize(os.path.join(OUT, nm + ".webp")) // 1024}KB' for nm, PW, PH in files) + f' · 동작 {len(Q)}: {desc}')
    js = ('/* h2_mov.js — tools/h2_moves.py 가 만듦 (손으로 고치지 말 것). 1차 업뎃 (2026-10-09) 2 · 3기 새 동작 프레임: 인물 → 묶음 그림 · 동작 칸 (rect · 발 · 장 수 · 게임 크기 scale)\n'
          '   h2.js h2Build 가 노트 동작 위에 덮어씀 (replace = 노트 동작은 버림). poren.js 도 */\n'
          "'use strict';\nconst H2MOV = " + json.dumps(MOV, ensure_ascii=False, separators=(',', ':')) + ';\n')
    open(os.path.join(ROOT, 'src', 'h2_mov.js'), 'w', encoding='utf-8').write(js)
    srcs = {sl: {p: SRC.get((sl, p), []) for p in MOV[sl]['poses']} for sl in MOV}
    json.dump({'v': '1.1', 'src': srcs, 'alias': ALIAS}, open(os.path.join(HERE, 'h2_mov_sources.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    # 옐로 새 원화 → 초상화 · 얼굴 (옛 것은 _v1 로)
    Y = os.path.join(ROOT, 'art', 'h2', 'yellow')
    for f in ('portrait', 'face'):
        if not os.path.exists(os.path.join(Y, f + '_v1.webp')) and os.path.exists(os.path.join(Y, f + '.webp')): os.rename(os.path.join(Y, f + '.webp'), os.path.join(Y, f + '_v1.webp'))
    src = Image.open(os.path.join(RAW, '옐로 리뉴얼.png')).convert('RGB'); pw = round(src.width * 900 / src.height)
    src.resize((pw, 900), Image.LANCZOS).save(os.path.join(Y, 'portrait.webp'), 'WEBP', quality=88, method=4)
    cell = crop(Image.open(os.path.join(CUT, '옐로 리뉴얼', 'r0c0.png')).convert('RGBA'))
    a = np.asarray(cell)[..., 3] > 60; h = cell.height; top = int(np.where(a.any(1))[0][0])
    band = a[top:top + int(h * 0.16)]; xs = np.where(band.any(0))[0]; cx = int(np.median(xs)) if len(xs) else cell.width // 2
    side = int(h * 0.2); x0 = max(0, cx - side // 2); y0 = max(0, top - int(h * 0.01))
    face = Image.new('RGB', (side, side), (238, 236, 232)); face.paste(cell.crop((x0, y0, x0 + side, y0 + side)), (0, 0), cell.crop((x0, y0, x0 + side, y0 + side)))
    face.resize((256, 256), Image.LANCZOS).save(os.path.join(Y, 'face.webp'), 'WEBP', quality=88, method=4)
    print('src/h2_mov.js', len(MOV), '명 · 옐로 초상화 · 얼굴 새로')

if __name__ == '__main__': main()
