"""Align script lines to a voiceover without speech recognition.

Speech is split into chunks at pauses; consecutive lines are matched to consecutive chunks by dynamic
programming, comparing each chunk group's duration with the lines' syllable count. Line boundaries
that fall inside a chunk are placed at the deepest dip of the loudness envelope near the estimate.

Usage: python3 align.py <voice.mp3> <script.txt> <n_lines> <out.json>
"""
import json
import re
import subprocess
import sys

import numpy as np

SR = 16000
HOP = 0.01


def envelope(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, '<i2').astype(np.float64) / 32768
    hop = int(SR * HOP)
    n = len(x) // hop
    rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    return db - np.percentile(db, 99), len(x) / SR


def pauses(db, thr=-30.0, min_len=0.06):
    quiet = db < thr
    out, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            if (j - i) * HOP >= min_len:
                out.append((i * HOP, j * HOP))
            i = j
        else:
            i += 1
    return out


def syllables(s):
    return len(re.findall('[аеёиоуыэюяАЕЁИОУЫЭЮЯ]', s)) + 0.6


def main():
    voice, script, n_lines, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
    lines = [l for l in open(script, encoding='utf-8').read().split('\n') if l.strip()][:n_lines]
    db, total = envelope(voice)
    ps = pauses(db)
    # speech chunks between pauses
    edges = [0.0] + [p for pr in ps for p in pr] + [total]
    chunks = [(edges[k], edges[k + 1]) for k in range(0, len(edges), 2) if edges[k + 1] - edges[k] > 0.08]
    M, N = len(chunks), len(lines)
    syl = np.array([syllables(l) for l in lines])
    speech = sum(b - a for a, b in chunks)
    rate = speech / syl.sum()
    csyl = np.concatenate([[0], np.cumsum(syl)])
    INF = 1e18
    cost = np.full((N + 1, M + 1), INF)
    back = {}
    cost[0, 0] = 0
    MAXL, MAXC = 4, 7
    for i in range(N):
        for j in range(M):
            c0 = cost[i, j]
            if c0 >= INF:
                continue
            for di in range(1, MAXL + 1):
                if i + di > N:
                    break
                pred = (csyl[i + di] - csyl[i]) * rate
                for dj in range(1, MAXC + 1):
                    if j + dj > M:
                        break
                    a, b = chunks[j][0], chunks[j + dj - 1][1]
                    inner = sum(chunks[k + 1][0] - chunks[k][1] for k in range(j, j + dj - 1))
                    dur = b - a - inner
                    c = ((dur - pred) / (0.25 + 0.15 * pred)) ** 2
                    c += 1.4 * (di - 1)  # a line boundary with no pause
                    c += sum(min(4.0, ((chunks[k + 1][0] - chunks[k][1]) / 0.12) ** 2) for k in range(j, j + dj - 1))
                    if c0 + c < cost[i + di, j + dj]:
                        cost[i + di, j + dj] = c0 + c
                        back[(i + di, j + dj)] = (i, j)
    i, j = N, M
    groups = []
    while (i, j) != (0, 0):
        pi, pj = back[(i, j)]
        groups.append((pi, i, pj, j))
        i, j = pi, pj
    groups.reverse()
    res = []
    for li0, li1, cj0, cj1 in groups:
        a, b = chunks[cj0][0], chunks[cj1 - 1][1]
        if li1 - li0 == 1:
            res.append({'n': li0 + 1, 'start': a, 'end': b, 'text': lines[li0], 'confidence': 'pause'})
            continue
        # several lines in one stretch of speech: split by syllables, snap to loudness dips
        tot = csyl[li1] - csyl[li0]
        cuts = [a]
        for k in range(li0 + 1, li1):
            est = a + (b - a) * (csyl[k] - csyl[li0]) / tot
            lo, hi = int((est - 0.3) / HOP), int((est + 0.3) / HOP)
            lo = max(lo, int(cuts[-1] / HOP) + 10)
            seg = db[lo:hi]
            cuts.append((lo + int(np.argmin(seg))) * HOP if len(seg) else est)
        cuts.append(b)
        for k in range(li0, li1):
            res.append({'n': k + 1, 'start': cuts[k - li0], 'end': cuts[k - li0 + 1], 'text': lines[k], 'confidence': 'dip'})
    json.dump({'rate': rate, 'lines': res}, open(out, 'w'), ensure_ascii=False, indent=1)
    print(f'{N} lines, {M} chunks, {sum(1 for r in res if r["confidence"] == "dip")} lines split at loudness dips')


if __name__ == '__main__':
    main()
