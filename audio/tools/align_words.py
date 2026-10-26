"""Align script lines to recognised words (transcribe.py output) and keep a time for every script word.

Usage: python3 align_words.py <script.txt> <words.json> <out_alignment.json>
The output has the same "lines" as align.py, plus "words" per line: [[word, start, end], ...].
"""
import difflib
import json
import re
import sys


def norm(w):
    return re.sub(r'[^а-я0-9]', '', w.lower().replace('ё', 'е'))


def main():
    lines = [l for l in open(sys.argv[1], encoding='utf-8').read().split('\n') if l.strip()]
    rec = json.load(open(sys.argv[2], encoding='utf-8'))['words']
    # script words, with hyphenated words split the way the recogniser hears them
    sw = []
    for li, l in enumerate(lines):
        for w in l.split():
            parts = [p for p in re.split(r'-', w) if norm(p)] if '-' in w and norm(w) not in ('ктото',) else [w]
            if not norm(w):
                continue
            for k, p in enumerate(parts):
                sw.append((li, w, k, len(parts), norm(p) if len(parts) > 1 else norm(w)))
    a, b = [x[4] for x in sw], [norm(x['w']) for x in rec]
    times = [None] * len(sw)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag == 'equal' or (tag == 'replace' and i2 - i1 == j2 - j1):
            for k in range(i2 - i1):
                times[i1 + k] = (rec[j1 + k]['start'], rec[j1 + k]['end'])
        elif tag == 'replace' and j2 > j1:
            s, e = rec[j1]['start'], rec[j2 - 1]['end']
            for k in range(i2 - i1):
                times[i1 + k] = (s + (e - s) * k / (i2 - i1), s + (e - s) * (k + 1) / (i2 - i1))
    # fill gaps from neighbours
    for i, tm in enumerate(times):
        if tm is None:
            prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
            nxt = next((times[j][0] for j in range(i + 1, len(times)) if times[j]), prev + .3)
            times[i] = (prev, min(nxt, prev + .3))
    out = []
    for li, l in enumerate(lines):
        idx = [i for i, x in enumerate(sw) if x[0] == li]
        words = []
        for i in idx:
            _, w, k, _, _ = sw[i]
            if k == 0:
                words.append([w, times[i][0], times[i][1]])
            else:
                words[-1][2] = times[i][1]
        out.append({'n': li + 1, 'start': words[0][1], 'end': words[-1][2], 'text': l, 'confidence': 'asr',
                    'words': [[w, round(s, 3), round(e, 3)] for w, s, e in words]})
    json.dump({'lines': out}, open(sys.argv[3], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{len(out)} lines, {len(sw)} script words, {len(rec)} recognised')


if __name__ == '__main__':
    main()
