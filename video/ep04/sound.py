"""Soundtrack for episode 4 "The lift": voiceover (the dispatcher through the cabin speaker) + lift hum, a dark pulse,
drone, shimmer + effects.

Usage: python3 sound.py <voice.mp3> <out.wav> [end_seconds]
Effects are synthesized in engine/sfx.py; event times come from the word alignment of the voiceover.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '../engine'))
from sfx import *  # noqa: F401,F403  (synths, SR, np)


# ---------- timeline ----------

# S(n), E(n): start and end of script line n; C(n): the pause before it (where the picture cuts);
# Wd(n, prefix, k): start of the k-th word of line n beginning with prefix (as in the shots).
_LINES = {x['n']: x for x in json.load(open(os.path.join(HERE, '../../audio/ep04/alignment.json'), encoding='utf-8'))['lines']}
S, E = (lambda n: _LINES[n]['start']), (lambda n: _LINES[n]['end'])
C = lambda n: (_LINES[n - 1]['end'] + _LINES[n]['start']) / 2


def Wd(n, p, k=0):
    hits = [w[1] for w in _LINES[n]['words'] if re.sub('[^а-яё0-9-]', '', w[0].lower()).startswith(p)]
    return hits[k] if len(hits) > k else S(n)


VOICE_END = 58.9
DISPATCHER = [12, 14]  # lines heard through the cabin speaker
OFF, ON = Wd(3, 'погас'), Wd(14, 'питание')  # the power goes off and comes back
STOP = Wd(2, 'дёрнулась')


def pops(*ts, db=-24):
    return [(t, ('pop', i), db) for i, t in enumerate(ts)]


EVENTS = [
    # (time, sound, gain in dB)
    (0.0, ('boom', 1), -16), (0.0, ('motor_up', 1), -18),
    (Wd(1, 'началось') - .2, ('siren', 1), -27), (Wd(1, 'началось'), ('boom', 2), -18),
    (STOP, ('clunk', 1), -7),
    (OFF, ('power_down', 1), -12),
    (Wd(3, 'кнопка') + .15, ('click', 1), -13), (Wd(3, 'кнопка') + .5, ('click', 2), -14), (Wd(3, 'вызова') + .3, ('click', 3), -15),
    (Wd(4, 'двенадцать'), ('lowbat', 1), -20),
    *[(Wd(5, 'кто-то') - .4 + k * .16, ('step_far', k), -24 + 4 * np.sin(np.pi * k / 11)) for k in range(12)],
    (Wd(6, 'кричит') - .05, ('scream', 1), -13),
    (Wd(8, 'новость'), ('notify', 1), -16),
    *pops(Wd(9, 'полбутылки'), Wd(9, 'шоколадка'), Wd(9, 'кот')), (Wd(9, 'кот') + .35, ('meow', 1), -17),
    (C(10) + .05, ('boom', 3), -20), *[(C(10) + .1 + k * .09, ('tick', k), -31) for k in range(int((C(11) - C(10) - .2) / .09))],
    (Wd(11, 'щелчок'), ('click', 4), -9), (Wd(11, 'щелчок') + .02, ('static_burst', 1), -20),
    *[(S(n) - .05, ('static_long', n), -32) for n in DISPATCHER],
    (Wd(13, 'плачешь'), ('ding', 1), -28),
    (ON, ('power_up', 1), -16), (ON + .3, ('beep', 1), -22),
    (Wd(15, 'прижимает'), ('growl', 1), -26), (Wd(15, 'шипит') - .05, ('hiss', 1), -11),
    (Wd(16, 'угол') - .2, ('whoosh', 1), -24),
    (Wd(17, 'разбита'), ('glass', 1), -17), (Wd(17, 'жалобу') - .2, ('rustle', 1), -18),
    (C(18), ('boom', 4), -11), (C(18), ('sting', 1), -18), (C(18) + .1, ('static_long', 30), -24),
    (Wd(19, 'вздрагивает'), ('clunk', 2), -9), (Wd(19, 'едет'), ('motor_down', 1), -16),
    *[(Wd(20, w), ('beep', 2 + i), -20) for i, w in enumerate(['восьмой', 'седьмой', 'шестой'])],
    (Wd(21, 'стоп'), ('click', 5), -12), (Wd(21, 'люк'), ('creak', 1), -18),
    (Wd(22, 'кто') - .3, ('crowd', 1), -17), (Wd(22, 'первом'), ('boom', 5), -12),
    (C(23) - .2, ('whoosh', 2), -20), *pops(Wd(24, 'едешь'), Wd(25, 'лезешь'), db=-20),
    (VOICE_END + .2, ('boom', 6), -16),
]

# levels in dB: lift hum, music pulse, drone, shimmer
BEDS = [
    (0.0, OFF, -30, -27, -40, -90),
    (OFF, C(5), -90, -28, -32, -70),
    (C(5), Wd(7, 'тишина'), -90, -32, -30, -70),
    (Wd(7, 'тишина'), C(8) + .4, -90, -70, -34, -60),
    (C(8) + .4, C(11), -90, -28, -31, -70),
    (C(11), ON, -90, -32, -27, -56),
    (ON, C(18), -32, -28, -33, -70),
    (C(18), C(19), -34, -70, -25, -42),
    (C(19), C(23), -30, -24, -26, -50),
    (C(23), 400.0, -60, -22, -30, -60),
]
BED_GENS = [lambda d: lift_hum(d, 1), lambda d: pulse_music(d, 96, 2), lambda d: drone(d, 3), lambda d: shimmer(d, 4)]


def voice_fx(v):
    """The dispatcher's lines come out of the cabin's little speaker."""
    v = v.copy()
    nar = np.sqrt(np.mean(v[int(S(9) * SR):int(E(10) * SR)] ** 2))  # how loud the narrator is
    for n in DISPATCHER:
        a, b = int((S(n) - .05) * SR), int((E(n) + .15) * SR)
        seg = speakerize(v[a:b], n)
        v[a:b] = seg * nar / (np.sqrt(np.mean(seg ** 2)) + 1e-9) * 0.9
    return v


def make(kind, seed):
    if kind == 'boom':
        return boom(seed)
    if kind == 'whoosh':
        return whoosh(0.5, seed)
    if kind == 'pop':
        return pop(seed)
    if kind == 'motor_up':
        return motor(STOP + .05, seed)
    if kind == 'motor_down':
        return motor(C(23) - Wd(19, 'едет'), seed)
    if kind == 'siren':
        return siren(5.0, seed)
    if kind == 'clunk':
        return clunk(seed)
    if kind == 'power_down':
        return power(seed, True)
    if kind == 'power_up':
        return power(seed, False)
    if kind == 'click':
        return click(seed) * 0.9
    if kind == 'lowbat':
        t = secs(0.5)
        return norm(fade(np.sin(2 * np.pi * 660 * t) * (np.sin(2 * np.pi * 8 * t) > 0) * np.exp(-t * 3), 0.005, 0.05))
    if kind == 'step_far':
        return reverb(band(step(seed, .6), hi=1800), 1.2, 0.5, seed)
    if kind == 'scream':
        return scream(seed)
    if kind == 'notify':
        return notify(seed)
    if kind == 'meow':
        return meow(seed)
    if kind == 'tick':
        return tick(seed)
    if kind == 'static_burst':
        return static(0.4, seed)
    if kind == 'static_long':
        dur = (E(seed) - S(seed) + .3) if seed in DISPATCHER else 1.5
        return static(dur, seed) * 0.6
    if kind == 'ding':
        t = secs(1.2)
        return reverb(norm(np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 4) + .4 * np.sin(2 * np.pi * 1980 * t) * np.exp(-t * 6)), 0.8, 0.3, seed)
    if kind == 'beep':
        t = secs(0.14)
        return norm(fade(np.sin(2 * np.pi * 1046 * t) * np.exp(-t * 12), 0.003, 0.02))
    if kind == 'growl':
        return growl(1.0, seed) * 0.5
    if kind == 'hiss':
        return hiss(seed)
    if kind == 'glass':
        return glass(seed)
    if kind == 'rustle':
        return rustle(0.6, seed)
    if kind == 'sting':
        return reverb(sting(seed), 1.5, 0.35, seed)
    if kind == 'creak':
        return reverb(band(creak(1.0, seed), hi=2500), 0.8, 0.3, seed)
    if kind == 'crowd':
        x = np.zeros(int(3.6 * SR))
        for k in range(5):
            g, i = growl(2.4, seed + k), int(k * .23 * SR)
            m = min(len(g), len(x) - i)
            x[i:i + m] += g[:m]
        return norm(band(x, hi=1200))
    raise ValueError(kind)


if __name__ == '__main__':
    run(make, EVENTS, BEDS, VOICE_END, BED_GENS, voice_fx)
