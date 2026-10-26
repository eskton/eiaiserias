"""Synthesized sound effects and ambience beds shared by the episodes, and the final mix.

An episode's sound.py lists EVENTS [(time, (kind, seed), gain_db)] and BEDS [(start, end, room, wind, drone,
shimmer dB)], maps event kinds to samples in make(kind, seed) and calls run(make, EVENTS, BEDS). An episode can
pass its own beds (a list of functions of the duration); BEDS rows then hold one level per bed.
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


def splash(seed=0):
    """Something heavy falling into water: a wet burst, a low plunge and bubbles."""
    t = secs(2.0)
    x = band(noise(2.0, seed), 300, 5000) * np.exp(-t * 4) + band(noise(2.0, seed + 1), hi=300) * np.exp(-t * 3) * 1.5
    rng = np.random.default_rng(seed)
    for k in range(30):
        tb = secs(0.05)
        f = 500 + rng.random() * 1500
        b = np.sin(2 * np.pi * f * tb * (1 + tb * 8)) * np.exp(-tb * 60)
        i = int((0.15 + rng.random() * 1.3) * SR)
        x[i:i + len(b)] += b * 0.25 * (1 - i / len(x))
    return reverb(norm(fade(x, 0.003, 0.3)), 0.9, 0.3, seed)


def plane(dur=3.0, seed=0):
    """A plane diving: engine roar and a whine that climbs, louder and louder."""
    t = secs(dur)
    up = (t / dur) ** 1.6
    whine = sum(a * np.sin(2 * np.pi * np.cumsum(f * (1 + 0.9 * up)) / SR) for f, a in [(620, 1), (1240, .4), (931, .3)])
    roar = band(noise(dur, seed), 120, 2500) * (0.4 + up)
    return norm(fade((whine * 0.25 + roar) * (0.15 + up), 0.3, 0.02))


def crash(seed=0):
    """The impact: a boom with metal tearing and debris."""
    t = secs(2.5)
    metal = sum(np.sin(2 * np.pi * f * t + i) * np.exp(-t * d) for i, (f, d) in enumerate([(310, 3), (467, 4), (733, 5), (1190, 7)]))
    metal *= 1 + 0.5 * np.sin(2 * np.pi * 17 * t)
    burst = band(noise(2.5, seed), 200, 6000) * np.exp(-t * 6)
    x = norm(boom(seed, 2.5)[:len(t)]) * 1.2 + metal * 0.25 + burst * 0.8
    return norm(fade(x, 0.002, 0.3))


def static(dur=2.0, seed=0):
    """Radio static: hiss with a flutter and crackles."""
    t = secs(dur)
    x = band(noise(dur, seed), 400, 3800) * (0.6 + 0.4 * np.abs(band(noise(dur, seed + 1), hi=8, order=2)) / 0.05)
    rng = np.random.default_rng(seed)
    for k in range(int(dur * 25)):
        i = int(rng.random() * (len(t) - 200))
        x[i:i + 60] += rng.standard_normal(60) * 3
    return norm(fade(band(x, 300, 4000), 0.02, 0.1))


def wood(seed=0):
    """A log or a club knocking on wood."""
    t = secs(0.5)
    f = 190 + 60 * np.random.default_rng(seed).random()
    x = (np.sin(2 * np.pi * f * t) * np.exp(-t * 18) + 0.5 * np.sin(2 * np.pi * f * 2.7 * t) * np.exp(-t * 30)
         + band(noise(0.5, seed), 1000, 5000) * np.exp(-t * 120) * 0.5)
    return reverb(norm(fade(x)), 0.5, 0.25, seed)


def cans(seed=0, dur=1.4):
    """Empty tin cans on a rope, knocking together."""
    out = np.zeros(int(dur * SR))
    rng = np.random.default_rng(seed)
    for k in range(10):
        tc = secs(0.3)
        f = 900 + rng.random() * 900
        c = sum(np.sin(2 * np.pi * f * m * tc) * np.exp(-tc * (25 + 10 * m)) for m in (1, 2.31, 3.86))
        c += band(noise(0.3, seed + k), 2000, 8000) * np.exp(-tc * 70) * 0.6
        i = int((k / 10 + rng.random() * 0.06) * (dur - 0.35) * SR)
        out[i:i + len(c)] += c * (1 - k * 0.07)
    return reverb(norm(out), 0.5, 0.2, seed)


def sand_step(seed=0, hard=1.0):
    t = secs(0.3)
    m = np.minimum(1, t / 0.02) * np.exp(-t * 14)
    grit = band(noise(0.3, seed), 1500, 7000) * m * 0.5 * hard
    th = band(noise(0.3, seed + 1), hi=300) * np.exp(-t * 30)
    return norm(fade(grit + th, 0.002, 0.05))


def pop(seed=0):
    """A soft pop for things appearing on screen."""
    t = secs(0.09)
    x = np.sin(2 * np.pi * (520 + 500 * np.exp(-t * 60)) * t) * np.exp(-t * 45)
    return norm(fade(x, 0.001, 0.02))


def sting(seed=0, dur=2.2):
    """A horror sting: a dissonant string cluster swelling up and cut off."""
    t = secs(dur)
    x = sum(signal.sawtooth(2 * np.pi * f * t * (1 + 0.004 * np.sin(2 * np.pi * (5 + i) * t))) for i, f in enumerate([440, 466.2, 493.9, 659.3, 698.5]))
    x = band(x, 200, 3000) * (t / dur) ** 2
    return norm(fade(x, 0.05, 0.03))


def rain(dur, seed=0):
    t = secs(dur)
    x = band(noise(dur, seed), 2000, 9000) * 0.4 + band(noise(dur, seed + 1), 400, 2000) * 0.2
    rng = np.random.default_rng(seed)
    for k in range(int(dur * 40)):
        i = int(rng.random() * (len(t) - 600))
        x[i:i + 600] += np.sin(2 * np.pi * (2000 + rng.random() * 3000) * secs(0.0125)) * np.exp(-secs(0.0125) * 400) * 0.4
    return norm(fade(x, 0.4, 0.6))


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


def ocean(dur, seed=0):
    """Surf on a beach: waves rolling in every few seconds over a low wash."""
    t = secs(dur)
    swell = sum(np.sin(2 * np.pi * t / p + i) for i, p in enumerate([7.3, 11.1, 4.9]))
    swell = np.clip(0.35 + 0.25 * swell, 0.05, None) ** 1.5
    hi = band(noise(dur, seed), 400, 3000) * swell
    return hi + band(noise(dur, seed + 1), 40, 250) * 1.5


def insects(dur, seed=0):
    """Night crickets: a few chirping at different pitches and rates."""
    t = secs(dur)
    out = np.zeros_like(t)
    rng = np.random.default_rng(seed)
    for k in range(4):
        f, rate, ph = 3800 + rng.random() * 1400, 1.2 + rng.random() * 1.4, rng.random()
        gate = (np.sin(2 * np.pi * 32 * t) > 0.2) * (((t * rate + ph) % 1) < 0.28)
        out += np.sin(2 * np.pi * f * t) * band(gate.astype(float), hi=300, order=2) * (0.6 + 0.4 * rng.random())
    return out


def fire(dur, seed=0):
    """A campfire: a low roar and crackles."""
    t = secs(dur)
    rng = np.random.default_rng(seed)
    x = band(noise(dur, seed), 80, 400) * (0.6 + 0.4 * np.abs(band(noise(dur, seed + 1), hi=2, order=2)) / 0.02)
    for k in range(int(dur * 14)):
        i = int(rng.random() * (len(t) - 2400))
        n = int((0.004 + rng.random() * 0.03) * SR)
        x[i:i + n] += band(rng.standard_normal(n), 1000, 6000) * np.exp(-np.arange(n) / (n / 4)) * (0.5 + rng.random() * 2)
    return x


def gull(seed=0):
    """A gull's cry far off."""
    out = np.zeros(int(1.4 * SR))
    for k, d in enumerate([0.0, 0.42, 0.78]):
        t = secs(0.32)
        f = 1500 - 700 * t / 0.32 + 60 * np.sin(2 * np.pi * 28 * t)
        c = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.32) ** 1.5
        i = int(d * SR)
        out[i:i + len(c)] += band(c, 800, 4000) * (1 - k * 0.2)
    return reverb(norm(out), 1.2, 0.5, seed)


def default_beds():
    return [lambda d: room(d, 1), lambda d: wind(d, 2), lambda d: drone(d, 3), lambda d: shimmer(d, 4)]


def mix(voice, end, EVENTS, BEDS, make, beds=None):
    """Voice + effects (EVENTS) + ambience beds (BEDS), beds ducked under the voice; returns stereo samples.
    beds: functions of the duration giving each bed (room, wind, drone, shimmer by default); BEDS rows are
    (start, end, level dB of each bed)."""
    n = int(end * SR)
    fx = np.zeros(n + SR * 4)
    cache = {}

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
    gens = beds or default_beds()
    beds = sum(norm(g(dur))[:n] * level(2 + i) for i, g in enumerate(gens))

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



def run(make, EVENTS, BEDS, VOICE_END=None, beds=None):
    """Command line of an episode's sound.py: <voice.mp3> <out.wav> [end_seconds]."""
    voice_path, out = sys.argv[1], sys.argv[2]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', voice_path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    voice = np.frombuffer(raw, np.float32).astype(np.float64)
    voice = norm(voice, 0.8)
    end = float(sys.argv[3]) if len(sys.argv) > 3 else len(voice) / SR
    voice = np.concatenate([voice, np.zeros(max(0, int(end * SR) - len(voice)))])
    cut = int(VOICE_END * SR) if VOICE_END else len(voice)
    if cut < len(voice):
        k = int(0.06 * SR)
        voice[cut - k:cut] *= np.linspace(1, 0, k)
        voice[cut:] = 0
    st = mix(voice, end, EVENTS, BEDS, make, beds)
    with wave.open(out, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype('<i2').tobytes())
