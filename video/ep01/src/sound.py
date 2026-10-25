"""Soundtrack for episode 1: voiceover + ambience + music bed + synthesized effects.

Usage: python3 sound.py <voice.mp3> <out.wav> [end_seconds]
All effects are synthesized here; event times are seconds in the voiceover.
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np
from scipy import signal

SR = 48000


def secs(n):
    return np.arange(int(n * SR)) / SR


def noise(dur, seed):
    return np.random.default_rng(seed).standard_normal(int(dur * SR))


def band(x, lo=None, hi=None, order=4):
    if lo and hi:
        sos = signal.butter(order, [lo, hi], 'bandpass', fs=SR, output='sos')
    elif lo:
        sos = signal.butter(order, lo, 'highpass', fs=SR, output='sos')
    else:
        sos = signal.butter(order, hi, 'lowpass', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def fade(x, a=0.002, b=0.01):
    x = x.copy()
    na, nb = int(a * SR), int(b * SR)
    if na:
        x[:na] *= np.linspace(0, 1, na)
    if nb:
        x[-nb:] *= np.linspace(1, 0, nb)
    return x


def reverb(x, t60=0.6, mix=0.3, seed=7, tone=3000):
    ir = band(noise(t60, seed), hi=tone) * np.exp(-secs(t60) * 6.9 / t60)
    wet = signal.fftconvolve(x, ir)
    wet *= np.max(np.abs(x)) / (np.max(np.abs(wet)) + 1e-9)
    out = np.concatenate([x, np.zeros(len(wet) - len(x))])
    return out * (1 - mix) + wet * mix


def norm(x, peak=1.0):
    return x * peak / (np.max(np.abs(x)) + 1e-9)


# ---------- effects ----------

def knock(seed=0):
    t = secs(0.45)
    body = (np.sin(2 * np.pi * 92 * t) * np.exp(-t * 38) + 0.6 * np.sin(2 * np.pi * 151 * t) * np.exp(-t * 55)
            + 0.3 * np.sin(2 * np.pi * 233 * t) * np.exp(-t * 75))
    thump = band(noise(0.45, seed), hi=320) * np.exp(-t * 55) * 1.6
    click = band(noise(0.45, seed + 1), 500, 3200) * np.exp(-t * 170) * 0.5
    return reverb(norm(fade(body + thump + click)), 0.4, 0.22, seed)


def slam(seed=0):
    t = secs(0.9)
    body = np.sin(2 * np.pi * 58 * t) * np.exp(-t * 14) + 0.7 * np.sin(2 * np.pi * 103 * t) * np.exp(-t * 22)
    thump = band(noise(0.9, seed), hi=400) * np.exp(-t * 18) * 2
    rattle = np.zeros_like(t)
    rng = np.random.default_rng(seed)
    for k in range(7):
        i = int((0.02 + rng.random() * 0.16) * SR)
        b = band(noise(0.03, seed + k), 1500, 5000) * np.exp(-secs(0.03) * 120)
        rattle[i:i + len(b)] += b * 0.25
    return reverb(norm(fade(body + thump + rattle)), 1.1, 0.35, seed)


def latch(seed=0):
    out = np.zeros(int(0.15 * SR))
    for k, (d, f) in enumerate([(0.0, 2300), (0.07, 1800)]):
        t = secs(0.03)
        c = band(noise(0.03, seed + k), 2500, 9000) * np.exp(-t * 300) + 0.4 * np.sin(2 * np.pi * f * t) * np.exp(-t * 160)
        i = int(d * SR)
        out[i:i + len(c)] += c
    return reverb(norm(out), 0.3, 0.2, seed)


def creak(dur=0.95, seed=0):
    # stick-slip: an irregular impulse train through two resonances
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    imp = np.zeros(n)
    tpos = 0.0
    while tpos < dur:
        u = tpos / dur
        f = 180 + 260 * u + 60 * np.sin(u * 9)
        tpos += (1 / f) * (0.7 + 0.6 * rng.random())
        i = int(tpos * SR)
        if i < n:
            imp[i] = 0.5 + rng.random()
    t = secs(0.02)
    res = np.sin(2 * np.pi * 1250 * t) * np.exp(-t * 260) + 0.6 * np.sin(2 * np.pi * 2150 * t) * np.exp(-t * 320)
    x = signal.fftconvolve(imp, res)[:n]
    envl = np.sin(np.pi * np.linspace(0, 1, n)) ** 0.6
    return reverb(norm(x * envl), 0.5, 0.25, seed)


def click(seed=0, f=3500):
    t = secs(0.012)
    return norm(band(noise(0.012, seed), f, 12000) * np.exp(-t * 500))


def breath(dur=2.3, seed=0):
    t = secs(dur)
    cycle = 1.15
    ph = (t % cycle) / cycle
    envl = np.where(ph < 0.45, np.sin(np.pi * ph / 0.45) * 0.7, np.sin(np.pi * (ph - 0.45) / 0.55))
    envl = np.clip(envl, 0, None) ** 1.5
    rasp = 1 + 0.9 * band(noise(dur, seed + 1), 35, 90) / 0.15
    x = band(noise(dur, seed), 250, 1400) * envl * np.clip(rasp, 0, 3)
    x = band(x, hi=1300)  # heard through the door
    return reverb(norm(fade(x, 0.05, 0.2)), 0.4, 0.25, seed)


def heartbeat(dur, bpm=68, seed=0):
    out = np.zeros(int(dur * SR))
    t = secs(0.35)
    th = np.sin(2 * np.pi * 46 * t) * np.exp(-t * 22) + 0.5 * np.sin(2 * np.pi * 70 * t) * np.exp(-t * 30)
    th = band(fade(th), hi=180)
    k = 0.0
    while k < dur - 0.4:
        for d, a in [(0, 1.0), (0.17, 0.7)]:
            i = int((k + d) * SR)
            out[i:i + len(th)] += th[: len(out) - i] * a
        k += 60 / bpm
    return norm(out)


def boom(seed=0, dur=3.0):
    t = secs(dur)
    f = 62 * np.exp(-t * 0.6) + 28
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    x += band(noise(dur, seed), hi=220) * np.exp(-t * 3) * 0.8
    return reverb(norm(fade(x, 0.004, 0.5)), 2.0, 0.35, seed, tone=1500)


def whoosh(dur=0.9, seed=0, rev=False):
    t = secs(dur)
    x = noise(dur, seed)
    envl = (t / dur) ** 2.2
    lo = band(x, 300, 1200) * envl
    hi = band(x, 1500, 5000) * envl ** 2
    y = lo + hi * 0.6
    y = y[::-1] if rev else y
    return norm(fade(y, 0.01, 0.05))


def tick(seed=0):
    return click(seed, 3800) * 0.6


def step(seed=0, hard=1.0):
    t = secs(0.25)
    th = band(noise(0.25, seed), hi=500) * np.exp(-t * 40)
    sc = band(noise(0.25, seed + 1), 800, 4000) * np.exp(-t * 90) * 0.35 * hard
    return reverb(norm(fade(th + sc)), 0.4, 0.2, seed)


def drip(seed=0):
    t = secs(0.5)
    f = 1300 + 700 * np.random.default_rng(seed).random()
    x = np.sin(2 * np.pi * (f + 900 * np.exp(-t * 30)) * t) * np.exp(-t * 25)
    return reverb(norm(fade(x)), 1.2, 0.5, seed)


def buzz(seed=0):
    out = np.zeros(int(1.2 * SR))
    for k in range(2):
        t = secs(0.35)
        x = band(signal.square(2 * np.pi * 165 * t) * 0.5 + np.sin(2 * np.pi * 330 * t) * 0.3, 100, 900)
        x *= np.minimum(1, t / 0.02) * np.minimum(1, (0.35 - t) / 0.03)
        i = int(k * 0.6 * SR)
        out[i:i + len(x)] += x
    return norm(out)


def shing(seed=0):
    t = secs(1.2)
    x = sum(np.sin(2 * np.pi * f * t + i) * np.exp(-t * d) for i, (f, d) in enumerate([(2350, 4), (3510, 5), (4780, 6), (6200, 8)]))
    sw = band(noise(1.2, seed), 3000, 9000) * np.exp(-t * 12) * 0.6
    return reverb(norm(fade(x * 0.5 + sw, 0.01, 0.2)), 0.8, 0.3, seed)


def murmur(dur, seed=0):
    """Several voices behind a door: voiced buzz with a syllable rhythm, low-passed."""
    t = secs(dur)
    out = np.zeros_like(t)
    rng = np.random.default_rng(seed)
    for v in range(5):
        syl = band(noise(dur, seed + v), hi=6, order=2)
        syl = np.clip(syl / (np.std(syl) + 1e-9), 0, None)
        f0 = 110 + rng.random() * 130
        voiced = signal.sawtooth(2 * np.pi * f0 * t * (1 + 0.05 * np.sin(2 * np.pi * 0.7 * t + v)))
        out += band(voiced + 0.3 * noise(dur, seed + 10 + v), 200, 1500) * syl
    return norm(fade(band(out, hi=700), 0.2, 0.4))


def pump(seed=0):
    out = np.zeros(int(0.6 * SR))
    for k, (d, f) in enumerate([(0.0, 1200), (0.22, 900)]):
        t = secs(0.08)
        c = (band(noise(0.08, seed + k), 1500, 7000) * np.exp(-t * 80) + 0.5 * np.sin(2 * np.pi * f * t) * np.exp(-t * 60)
             + band(noise(0.08, seed + k + 5), hi=400) * np.exp(-t * 50) * 0.8)
        i = int(d * SR)
        out[i:i + len(c)] += c
    return reverb(norm(out), 0.4, 0.2, seed)


def thump(seed=0):
    t = secs(0.6)
    x = (np.sin(2 * np.pi * 70 * t) * np.exp(-t * 20) + band(noise(0.6, seed), hi=350) * np.exp(-t * 25) * 1.4
         + band(noise(0.6, seed + 1), 600, 3000) * np.exp(-t * 60) * 0.4)
    return reverb(norm(fade(x)), 0.7, 0.3, seed)


def glass(seed=0):
    out = np.zeros(int(1.0 * SR))
    rng = np.random.default_rng(seed)
    for k in range(14):
        t = secs(0.12)
        f = 2500 + rng.random() * 4000
        c = np.sin(2 * np.pi * f * t) * np.exp(-t * 40) + band(noise(0.12, seed + k), 3000, 10000) * np.exp(-t * 90) * 0.5
        i = int(rng.random() * 0.7 * SR)
        out[i:i + len(c)] += c * (0.3 + rng.random() * 0.7)
    return reverb(norm(out), 0.6, 0.25, seed)


def clink(seed=0):
    out = np.zeros(int(0.6 * SR))
    for k, d in enumerate([0.0, 0.12, 0.2]):
        t = secs(0.25)
        c = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dd) for f, dd in [(1850 + k * 90, 18), (3120 + k * 60, 25), (5100, 35)])
        i = int(d * SR)
        out[i:i + len(c)] += c * (1 - k * 0.25)
    return reverb(norm(out), 0.4, 0.2, seed)


def growl(dur=1.6, seed=0):
    t = secs(dur)
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.7
    am = 0.6 + 0.4 * np.sin(2 * np.pi * 31 * t + np.sin(2 * np.pi * 3 * t))
    x = band(noise(dur, seed), 80, 600) * am * shape
    x += 0.4 * signal.sawtooth(2 * np.pi * (68 + 6 * np.sin(2 * np.pi * 1.3 * t)) * t) * shape
    return reverb(norm(band(x, 60, 1200)), 0.6, 0.3, seed)


def rustle(dur=0.8, seed=0):
    t = secs(dur)
    m = np.abs(band(noise(dur, seed + 3), hi=12, order=2))
    return norm(band(noise(dur, seed), 1500, 8000) * m / (m.max() + 1e-9) * np.sin(np.pi * t / dur))


# ---------- beds ----------

def wind(dur, seed, gust=0.15):
    x = noise(dur, seed)
    m = band(noise(dur, seed + 5), hi=0.6, order=2)
    m = 0.6 + 0.4 * np.tanh(m / (np.std(m) + 1e-9) * 1.2)
    return band(x, 180, 900) * m


def room(dur, seed):
    return band(np.cumsum(noise(dur, seed)) * 0.02, 20, 160)


def drone(dur, seed=0):
    """A minor drone: detuned saws, slowly breathing low-pass."""
    t = secs(dur)
    out = np.zeros_like(t)
    for f, a in [(55, 1), (55 * 1.003, .8), (82.41, .55), (110, .35), (130.81, .25)]:
        out += a * signal.sawtooth(2 * np.pi * f * t + seed * f)
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * t / 23)
    lo = band(out, hi=260)
    hi = band(out, 260, 900) * lfo
    return lo + hi * 0.5


def shimmer(dur, seed=0):
    t = secs(dur)
    x = sum(np.sin(2 * np.pi * f * t + i) for i, f in enumerate([1760, 1771, 1864, 2489]))
    trem = 0.5 + 0.5 * np.sin(2 * np.pi * 0.31 * t)
    return x * trem / 4


# ---------- timeline ----------

# Line times from the alignment, so effects follow the voiceover: S(n) start, E(n) end, C(n) the pause before line n.
_ALIGN = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../audio/ep01/alignment.json')
_L = {x['n']: (x['start'], x['end']) for x in json.load(open(_ALIGN, encoding='utf-8'))['lines']}
S, E = (lambda n: _L[n][0]), (lambda n: _L[n][1])
C = lambda n: (_L[n - 1][1] + _L[n][0]) / 2
# the voiceover breaks off mid-word on line 223: it is muted from here, under the end card
VOICE_END = 350.4

KNOCKS = [3.15, 4.35, 5.52, 6.62, 7.25]
EVENTS = [
    # (time, sound, gain in dB)
    *[(k, ('knock', i), -4 if i < 3 else -7) for i, k in enumerate(KNOCKS)],
    (8.6, ('whoosh_rev', 1), -16),
    *[(k, ('knock_far', i), -15) for i, k in enumerate([10.0, 10.55, 11.1])],
    (11.95, ('boom', 1), -17),
    (16.5, ('breath', 1), -15),
    *[(19.95 + k, ('tick', k), -24) for k in range(1, 4)],
    (31.08, ('click', 2), -14),
    (32.15, ('knock', 9), -1),
    (39.5, ('latch', 1), -12),
    (39.62, ('creak', 1), -17),
    (40.9, ('boom', 2), -19),
    (40.9, ('heart', 1), -20),
    (50.52, ('slam', 1), -4),
    (59.25, ('boom', 3), -20),
    # scene 2: stairs, the open flat, the phone
    *[(59.7 + k * .45, ('step', k), -24) for k in range(4)],
    (S(39) + .55, ('click', 3), -14),
    (S(41) + .1, ('creak_far', 2), -15), (S(42) + .1, ('creak_far', 3), -15),
    (S(43) + .1, ('step', 7), -26), (S(43) + .7, ('step', 8), -26),
    (C(45) + .2, ('buzz', 1), -18),
    (C(48) + .1, ('boom', 4), -22),
    # scene 3: the basement
    (C(52) + .2, ('creak_far', 4), -14),
    (C(53) + .15, ('creak_short', 5), -15), (C(53) + .75, ('creak_short', 6), -15),
    *[(t0, ('drip', i), -28) for i, t0 in enumerate(np.arange(93.0, 169.0, 3.3) + np.sin(np.arange(93.0, 169.0, 3.3)) * .9)],
    (C(59) + .45, ('thump_soft', 1), -26), (C(59) + .9, ('thump_soft', 2), -26),
    (S(60), ('breath_close', 2), -14),
    (S(62) + .45, ('click', 4), -14),
    (S(62) + .6, ('heart', 2), -18),
    (S(64) + .2, ('breath_close', 3), -13), (S(66), ('breath_close', 4), -13),
    *[(C(69) + a, ('step_far', k), -12 - 3 * k) for k, a in enumerate([.35, .95, 1.55, 2.1, 2.65])],
    (C(71) + .25, ('click', 5), -14),
    (C(72) + .4, ('boom', 5), -14),
    (C(74) + .05, ('boom', 6), -18),
    (S(79) + .1, ('shing', 1), -16),
    (S(103), ('murmur', 1), -15),
    (S(109), ('boom', 7), -19),
    # scene 4: the technical room
    (169.3, ('latch', 2), -12), (169.4, ('creak_far', 6), -15),
    (S(118) + .3, ('pump', 1), -10), (S(161) + .25, ('pump', 2), -9),
    (C(126) + .2, ('boom', 8), -19),
    (S(148) + .3, ('whoosh_rev', 2), -18), (S(148) + .4, ('boom', 9), -13),
    (S(159) + .1, ('boom', 10), -18),
    (S(160) + .15, ('growl', 1), -14),
    (S(164), ('breath_close', 5), -12),
    (S(165) + .9, ('thump', 1), -4), (S(167) - .25, ('thump', 2), -3),
    (S(170), ('boom', 11), -20),
    # scene 5: the street, the supermarket
    *[(C(176) + k * .36, ('step', 20 + k % 6), -25) for k in range(int((C(180) - C(176)) / .36))],
    (S(181) + .2, ('glass', 1), -19),
    (C(184) + .5, ('clink', 1), -14),
    *[(S(189) + a, ('step_far', 10 + k), -20 + 3 * k) for k, a in enumerate([.2, .7, 1.2])],
    (S(190) + .3, ('boom', 12), -14),
    (S(191) + .2, ('growl', 2), -16),
    (S(196), ('boom', 13), -20),
    *[(S(197) + a, ('step_far', 14 + k), -16 - 4 * k) for k, a in enumerate([.1, .5, .9])],
    # scene 6: the photograph, the end card
    *[(314.5 + k * .22, ('step', 30 + k % 5), -21) for k in range(7)],
    (C(203) + .3, ('rustle', 1), -14),
    (S(205) + .2, ('boom', 14), -18),
    (S(214), ('boom', 15), -14),
    (VOICE_END + .1, ('whoosh_rev', 3), -18), (VOICE_END + .2, ('boom', 16), -11),
]

# Ambience level per stretch: (start, end, room dB, wind dB, drone dB, shimmer dB)
BEDS = [
    (0.0, 23.1, -38, -44, -27, -60),
    (16.4, 19.95, -60, -60, -60, -40),
    (23.1, 28.05, -40, -30, -26, -60),
    (28.05, 51.7, -38, -44, -27, -60),
    (51.7, 59.54, -42, -29, -25, -50),
    (59.54, 85.875, -40, -46, -27, -60),
    (C(37), C(44), -40, -46, -27, -42),
    (85.875, 169.23, -37, -60, -25, -56),
    (S(62) + .45, C(71), -36, -60, -23, -40),
    (169.23, 267.2, -41, -60, -29, -60),
    (S(158), 267.2, -41, -60, -25, -44),
    (267.2, C(180), -46, -29, -27, -60),
    (C(180), 314.435, -42, -46, -27, -60),
    (S(189), C(198), -42, -46, -25, -40),
    (314.435, VOICE_END, -44, -34, -26, -52),
    (VOICE_END, 400.0, -60, -50, -22, -46),
]


def build(voice, end):
    n = int(end * SR)
    fx = np.zeros(n + SR * 4)
    cache = {}

    def make(kind, seed):
        if kind == 'knock':
            return knock(seed)
        if kind == 'knock_far':
            return reverb(band(knock(seed), hi=900), 0.9, 0.5, seed)
        if kind == 'whoosh_rev':
            return whoosh(0.7, seed)
        if kind == 'boom':
            return boom(seed)
        if kind == 'breath':
            return breath(2.3, seed)
        if kind == 'tick':
            return tick(seed)
        if kind == 'click':
            return click(seed) * 0.8
        if kind == 'latch':
            return latch(seed)
        if kind == 'creak':
            return creak(0.95, seed)
        if kind == 'slam':
            return slam(seed)
        if kind == 'heart':
            return heartbeat(10.2, 66, seed)
        if kind == 'step':
            return step(seed)
        if kind == 'step_far':
            return reverb(band(step(seed, .6), hi=1500), 1.0, 0.45, seed)
        if kind == 'creak_far':
            return reverb(band(creak(1.1, seed), hi=2500), 1.2, 0.45, seed)
        if kind == 'creak_short':
            return creak(0.45, seed)
        if kind == 'drip':
            return drip(seed)
        if kind == 'buzz':
            return buzz(seed)
        if kind == 'breath_close':
            return reverb(norm(fade(band(noise(2.3, seed), 300, 2200) * np.clip(np.sin(np.pi * (secs(2.3) % 1.15) / 1.15), 0, None) ** 1.5, 0.05, 0.2)), 0.5, 0.25, seed)
        if kind == 'thump_soft':
            return band(thump(seed), hi=600)
        if kind == 'thump':
            return thump(seed)
        if kind == 'shing':
            return shing(seed)
        if kind == 'murmur':
            return murmur(C(105) + .3 - S(103), seed)
        if kind == 'pump':
            return pump(seed)
        if kind == 'growl':
            return growl(1.6, seed)
        if kind == 'glass':
            return glass(seed)
        if kind == 'clink':
            return clink(seed)
        if kind == 'rustle':
            return rustle(0.8, seed)
        raise ValueError(kind)

    for t0, (kind, seed), db in EVENTS:
        if t0 >= end:
            continue
        key = (kind, seed)
        s = cache.setdefault(key, make(kind, seed)) * 10 ** (db / 20)
        i = int(t0 * SR)
        m = min(len(s), len(fx) - i)
        fx[i:i + m] += s[:m]
    fx = fx[:n]

    # beds with smooth level automation
    tt = np.arange(n) / SR

    def level(col):
        g = np.full(n, -90.0)
        for row in BEDS:
            a, b, db = row[0], row[1], row[col]
            g[(tt >= a) & (tt < b)] = db
        g = band(g + 90, hi=1.5, order=2) - 90  # ~0.3 s glides between levels
        return 10 ** (g / 20)

    dur = end
    beds = (norm(room(dur, 1)) * level(2) + norm(wind(dur, 2)) * level(3)
            + norm(drone(dur, 3)) * level(4) + norm(shimmer(dur, 4)) * level(5))
    beds = beds[:n]

    # duck the beds under the voice
    v = voice[:n]
    envl = band(np.abs(v), hi=4, order=2)
    duck = 1 - 0.45 * np.clip(envl / (np.percentile(envl, 90) + 1e-9), 0, 1)
    mono = v + fx + beds * duck

    # gentle stereo: beds and effects slightly wider than the voice
    side = band(norm(wind(dur, 9)), 300, 800)[:n] * level(3) * 0.5
    left, right = mono + side, mono - side
    st = np.stack([left, right], 1)
    st *= 0.89 / (np.max(np.abs(st)) + 1e-9)
    return st


def main():
    voice_path, out = sys.argv[1], sys.argv[2]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', voice_path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    voice = np.frombuffer(raw, np.float32).astype(np.float64)
    voice = norm(voice, 0.8)
    end = float(sys.argv[3]) if len(sys.argv) > 3 else len(voice) / SR
    voice = np.concatenate([voice, np.zeros(max(0, int(end * SR) - len(voice)))])
    cut = int(VOICE_END * SR)
    if cut < len(voice):
        k = int(0.06 * SR)
        voice[cut - k:cut] *= np.linspace(1, 0, k)
        voice[cut:] = 0
    st = build(voice, end)
    with wave.open(out, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype('<i2').tobytes())


if __name__ == '__main__':
    main()
