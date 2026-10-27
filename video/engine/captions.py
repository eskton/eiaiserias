"""Karaoke captions for the vertical cut: short chunks (≤ 4 words, ≤ 24 letters) with a time per word.

Usage: python3 captions.py <alignment.json> <out.js> <end_seconds> [keywords.txt] [--max-chars N] [--max-words N]
Word times come from the alignment when it has them (recognised speech), otherwise they are spread
over each line by syllable count. Key words get a colour while spoken: keywords.txt lines are
"r word" (red), "y word" (yellow) or "g word" (green).
"""
import argparse
import itertools
import json
import re
import sys

VOWELS = set('аеёиоуыэюяАЕЁИОУЫЭЮЯ')
RED = {'убил', 'кровь', 'кровью', 'заразился', 'заражён', 'заражённые', 'подвал', 'подвала', 'дыхание', 'тёплой', 'свежая',
       'красными', 'чёрные', 'вены', 'оружие', 'нападал', 'превратился', 'забывают', 'ударил'}
YELLOW = {'сосед', 'шесть', 'двенадцать', 'семь', 'двадцать', 'телефон', 'сообщение', 'илья', 'илью', 'вера', 'веру',
          'живые', 'живыми', 'помнящими', 'лаборатория', 'мальчик', 'люди', 'фонарь', 'фонарик', 'нож', 'первых'}
GREEN = set()
MAX_CHARS, MAX_WORDS = 24, 5
# a caption should not end on one of these
WEAK = {'в', 'на', 'к', 'с', 'у', 'о', 'по', 'за', 'до', 'из', 'от', 'не', 'и', 'а', 'но', 'он', 'она', 'я', 'мы', 'ты', 'как',
        'что', 'это', 'мой', 'мою', 'его', 'её', 'уже', 'так', 'там', 'всё', 'ещё', 'было', 'были', 'был', 'была', 'их', 'его'}


def syl(w):
    return max(1, sum(ch in VOWELS for ch in w))


def colour(w):
    k = re.sub(r'[^\wё-]', '', w.lower())
    return 'r' if k in RED else 'y' if k in YELLOW else 'n' if k in GREEN else 'w'


def add_keywords(path):
    # optional file with lines "r word" / "y word" / "g word" for an episode's own key words
    for line in open(path, encoding='utf-8'):
        c, _, w = line.strip().partition(' ')
        {'r': RED, 'g': GREEN}.get(c, YELLOW).add(w.lower())


def split_line(words):
    """Fewest chunks within the limits, as even as possible."""
    n, best = len(words), None
    first = None
    for parts in range(1, n + 1):
        if first is not None and parts > first + 1:
            break
        for cuts in itertools.combinations(range(1, n), parts - 1):
            b = (0, *cuts, n)
            chunks = [words[b[i]:b[i + 1]] for i in range(parts)]
            lens = [len(' '.join(c)) for c in chunks]
            if max(lens) > MAX_CHARS and parts < n or max(len(c) for c in chunks) > MAX_WORDS:
                continue
            # prefer breaks after punctuation, then even lengths
            score = (max(lens) - min(lens) - 6 * sum(1 for c in chunks[:-1] if re.search(r'[,.:;!?…—]$', c[-1]))
                     + 9 * sum(1 for c in chunks[:-1] if re.sub(r'[^\wё]', '', c[-1].lower()) in WEAK) + 7 * parts)
            first = parts if first is None else first
            if best is None or score < best[0]:
                best = (score, chunks)
    return best[1] if best else [[w] for w in words]


def main():
    global MAX_CHARS, MAX_WORDS
    ap = argparse.ArgumentParser()
    ap.add_argument('alignment')
    ap.add_argument('out')
    ap.add_argument('end', type=float)
    ap.add_argument('keywords', nargs='?')
    ap.add_argument('--max-chars', type=int, default=MAX_CHARS)
    ap.add_argument('--max-words', type=int, default=MAX_WORDS)
    a = ap.parse_args()
    MAX_CHARS, MAX_WORDS = a.max_chars, a.max_words
    lines = json.load(open(a.alignment, encoding='utf-8'))['lines']
    out, end = a.out, a.end
    if a.keywords:
        add_keywords(a.keywords)
    chunks = []
    for ln in lines:
        if ln['start'] >= end:
            break
        words = ln['text'].upper().split()
        if 'words' in ln:
            # recognised speech: a real time for every word (dashes get the time of the next word)
            spoken = [w for w in words if re.sub(r'[^\wё]', '', w)]
            tm = iter(ln['words'])
            times, ends, cur = [], [], None
            for w in words:
                if re.sub(r'[^\wё]', '', w):
                    cur = next(tm)
                    times.append(cur[1]); ends.append(cur[2])
                else:
                    times.append(None); ends.append(None)
            for k in range(len(words) - 1, -1, -1):
                if times[k] is None:
                    times[k] = times[k + 1] if k + 1 < len(words) else ln['end']
                    ends[k] = times[k]
            assert len(spoken) == len(ln['words']), ln['text']
        else:
            wts = [syl(w) + 0.35 for w in words]
            tot, acc, times = sum(wts), 0.0, []
            for w in wts:
                times.append(ln['start'] + (ln['end'] - ln['start']) * acc / tot)
                acc += w
            ends = times[1:] + [ln['end']]
        i = 0
        for c in split_line(words):
            ws = [[w, round(times[i + k], 3), colour(w)] for k, w in enumerate(c)]
            last_end = ends[i + len(c) - 1]
            chunks.append([ws[0][1] - 0.05, last_end, ws])
            i += len(c)
    caps = []
    for k, (t0, t1, ws) in enumerate(chunks):
        nxt = chunks[k + 1][0] if k + 1 < len(chunks) else end
        stop = nxt if nxt - t1 < 1.5 else t1 + 0.9
        caps.append([round(t0, 3), round(min(stop, end), 3), ws])
    with open(out, 'w', encoding='utf-8') as f:
        f.write('// Generated by captions.py: [start, end, [[word, spoken_at, colour], ...]] per caption.\n')
        f.write("'use strict';\nconst CAPS = " + json.dumps(caps, ensure_ascii=False) + ';\n')
    print(f'{len(caps)} captions')


if __name__ == '__main__':
    main()
