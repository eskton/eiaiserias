"""Soundtrack for episode 1: voiceover + ambience + music bed + synthesized effects.

Usage: python3 sound.py <voice.mp3> <out.wav> [end_seconds]
Effects are synthesized in engine/sfx.py; event times are seconds in the voiceover.
"""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../engine'))
from sfx import *  # noqa: F401,F403  (synths, SR, np)


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


if __name__ == '__main__':
    run(make, EVENTS, BEDS, VOICE_END)
