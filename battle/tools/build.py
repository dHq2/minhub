#!/usr/bin/env python3
"""굴 전투판 단순판 빌드.

  python3 battle/tools/build.py            # build/rt3.node.js + dist/battle.html
  python3 battle/tools/build.py --test     # 위 + tests/*.test.js 실행

단계
  1) vendor/gul/rt3_{head,mid,tail}.js 를 이어 붙임 (원본 그대로)
  2) tools/patches/*.py 를 번호 순서로 입힘 (각 패치는 NAME · apply(text) 를 가진다. 한 번만 맞아야 하며 아니면 빌드 실패)
  3) tools/engine_exports.txt 의 이름들을 엔진 module.exports 에 덧붙임
  4) build/rt3.node.js (시험용 CommonJS) 와 dist/battle.html (한 파일 · 아티팩트용) 을 만듦
"""
import os, re, sys, glob, subprocess, importlib.util, json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
P = lambda *a: os.path.join(ROOT, *a)
VERSION = open(P('VERSION')).read().strip()


def read(path):
    with open(path, encoding='utf8') as f:
        return f.read()


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf8') as f:
        f.write(text)


def engine_text():
    s = ''.join(read(P('vendor', 'gul', f)) for f in ('rt3_head.js', 'rt3_mid.js', 'rt3_tail.js'))
    for pf in sorted(glob.glob(P('tools', 'patches', '*.py'))):
        spec = importlib.util.spec_from_file_location('patch', pf)
        m = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(m)
        try:
            s = m.apply(s)
        except Exception as e:  # noqa
            sys.exit('패치 실패: %s (%s) — 원본이 바뀌었는지 확인하세요: %s' % (os.path.basename(pf), getattr(m, 'NAME', ''), e))
        print('  패치 적용:', os.path.basename(pf), '-', getattr(m, 'NAME', ''))
    names = [l.strip() for l in read(P('tools', 'engine_exports.txt')).splitlines() if l.strip() and not l.startswith('#')]
    if names:
        s += '\n;Object.assign(module.exports, { ' + ', '.join(names) + ' });   /* build: engine_exports.txt */\n'
    return s


def build():
    eng = engine_text()
    write(P('build', 'rt3.node.js'), eng)
    manifest = [l.strip() for l in read(P('src', 'manifest.txt')).splitlines() if l.strip() and not l.startswith('#') and not l.startswith('[')]
    app = '\n'.join('/* ---- %s ---- */\n%s' % (m, read(P('src', m))) for m in manifest)
    tpl = read(P('src', 'index.template.html'))
    css = read(P('src', 'style.css'))
    html = (tpl.replace('/*VERSION*/', VERSION)
               .replace('/*STYLE*/', css)
               .replace('/*ENGINE*/', '(function(){ var module = { exports: {} };\n' + eng + '\nreturn module.exports; })()')
               .replace('/*APP*/', app))
    write(P('dist', 'battle.html'), html)
    print('빌드 완료: dist/battle.html  %.2f MB  (%s)' % (len(html.encode('utf8')) / 1e6, VERSION))


def build_engine_only():
    write(P('build', 'rt3.node.js'), engine_text())
    print('엔진만 빌드: build/rt3.node.js')


if __name__ == '__main__':
    if '--engine-only' in sys.argv:
        build_engine_only()
        sys.exit(0)
    build()
    if '--test' in sys.argv:
        tests = sorted(glob.glob(P('tests', '*.test.js')))
        bad = 0
        for t in tests:
            print('\n== %s' % os.path.basename(t))
            r = subprocess.run(['node', t], cwd=ROOT)
            bad += r.returncode != 0
        sys.exit(1 if bad else 0)
