"""Soundtrack for episode 5 "Nikita": the voiceover (ElevenLabs v4 with its own effects baked in: the spoon, the siren,
radio static, the lock, the curtains, the water, the switch, the knocks) + the radio lines through a little speaker,
a city in chaos outside, a dark pulse, a drone, a room tone + effects that the voice does not already have.

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
_LINES = {x['n']: x for x in json.load(open(os.path.join(HERE, '../../audio/ep05/alignment.json'), encoding='utf-8'))['lines']}
S, E = (lambda n: _LINES[n]['start']), (lambda n: _LINES[n]['end'])
C = lambda n: (_LINES[n - 1]['end'] + _LINES[n]['start']) / 2


def Wd(n, p, k=0):
    hits = [w[1] for w in _LINES[n]['words'] if re.sub('[^а-яё0-9-]', '', w[0].lower()).startswith(p)]
    return hits[k] if len(hits) > k else S(n)


VOICE_END = 120.38
CARD = 120.45                  # the end card
RADIO = [16, 17, 18, 19, 20]   # the announcer, through the radio
OFF = 100.795                  # the light switch (a click in the voice)
KNOCKS = [111.79, 112.0, 112.215, 115.155, 115.365, 115.58]  # the knocks in the voice
HIT = Wd(59, 'удар')
# the scene changes that get the whoosh + bass hit (the event goes 0.28 s before the cut)
CUTS = [C(3), C(5), C(8), C(15), C(22), C(25), C(32), 72.6, C(37), C(39), C(45), C(52), CARD]


def pops(*ts, db=-22):
    return [(t, ('pop', i), db) for i, t in enumerate(ts)]


def steps(t0, n, gap=.27, db=-24, seed=0):
    return [(t0 + k * gap, ('step', seed + k), db) for k in range(n)]


DROPS = [Wd(29, w) + .22 for w in ['сверху', 'поставил', 'несколько', 'тяжёлых', 'предметов']]

EVENTS = [
    # (time, sound, gain in dB)
    (0.0, ('intro', 1), -9), (0.0, ('fire', 1), -24),
    *[(c - .28, ('trans', i), -13) for i, c in enumerate(CUTS)],
    (Wd(2, 'апокалипсис'), ('boom', 1), -14),
    (Wd(3, 'никита'), ('ding', 1), -21), (Wd(4, 'седьмом'), ('pop', 30), -20),
    # the screams in the street, the chaos
    (Wd(6, 'вдруг'), ('sting', 1), -21), (Wd(6, 'крик') - .05, ('scream', 1), -13),
    (Wd(7, 'один') - .05, ('scream', 2), -15), (Wd(7, 'один') + .3, ('scream', 3), -19),
    (Wd(8, 'начался'), ('boom', 2), -8), (Wd(8, 'начался'), ('crash', 1), -12), (Wd(8, 'начался') + .05, ('glass', 1), -16),
    (Wd(8, 'хаос'), ('crash', 2), -15), (Wd(8, 'хаос') + .1, ('scream', 4), -17), (Wd(8, 'хаос') + .4, ('scream', 5), -20),
    *steps(Wd(9, 'подошёл') - .1, 3, .28),
    *[(Wd(10, 'бежали') - .3 + k * .13, ('step_far', k), -27) for k in range(14)],
    (Wd(11, 'падал'), ('thump', 1), -12), (Wd(11, 'падал') - .1, ('scream', 6), -19),
    (Wd(12, 'двигались'), ('growl', 1), -17), (Wd(12, 'заражённые'), ('growl', 2), -14), (Wd(12, 'заражённые'), ('sting', 2), -20),
    *steps(Wd(13, 'отошёл') - .2, 3, .22, -23, 10),
    (Wd(14, 'авария') + .15, ('whoosh', 1), -25), (Wd(14, 'авария') + .35, ('thump', 2), -20),
    # the radio
    (Wd(15, 'включил') + .05, ('click', 1), -14), (Wd(15, 'радио') + .02, ('click', 2), -18),
    (32.02, ('beeps', 1), -25), (S(16) - .3, ('static_bed', 1), -35),
    (Wd(17, 'вспышка'), ('boom', 3), -20), (Wd(17, 'неизвестного'), ('pop', 31), -22),
    *pops(Wd(18, 'не'), Wd(19, 'избегайте'), Wd(20, 'закройте'), db=-21),
    (Wd(21, 'оборвалась') + .15, ('power_down', 1), -17),
    # the door, the windows, no time
    (Wd(22, 'дверь'), ('sting', 3), -24), *pops(Wd(23, 'на'), Wd(23, 'окна'), db=-24),
    (C(24), ('heart', 1), -15),
    (Wd(25, 'действовать'), ('shing', 1), -19), *pops(*[Wd(25, 'начал') + .1 + .12 * k for k in range(4)], db=-27),
    # the lock, the wardrobe, the table, the pile
    (Wd(26, 'запер') + .45, ('latch', 1), -19),
    (Wd(27, 'подтащил') - .1, ('scrape', 1), -11), (Wd(27, 'шкаф') + .15, ('thump', 3), -10),
    (Wd(28, 'придвинул') - .05, ('scrape', 2), -13), (Wd(28, 'стол') + .2, ('thump', 4), -12),
    *[(t, ('thump', 10 + i), -9 if i == 2 else -12) for i, t in enumerate(DROPS)], (DROPS[2], ('subhit', 1), -14),
    (Wd(30, 'практически'), ('rise', 1), -27), (Wd(30, 'невозможно') + .4, ('clunk', 1), -14), (Wd(30, 'снаружи'), ('pop', 32), -21),
    *[(Wd(31, 'проверил') + k * .2, ('latch', 10 + k), -18) for k in range(4)], (Wd(31, 'раз'), ('ding', 2), -21),
    # windows, balcony (the curtains are in the voice)
    (Wd(32, 'закрыл') + .33, ('wood', 1), -14), (Wd(32, 'окна'), ('latch', 20), -16),
    (Wd(33, 'закрыл') + .4, ('slam', 1), -17), (Wd(33, 'балкон') + .1, ('latch', 21), -17),
    (Wd(35, 'изолирована'), ('subhit', 2), -15), (Wd(35, 'изолирована'), ('ding', 3), -22),
    (Wd(36, 'одно'), ('pop', 33), -19),
    # the zombies come in and start up the stairs; the door holds
    (Wd(37, 'внутрь') - .4, ('slam', 2), -12), (Wd(37, 'внутрь'), ('crowd', 1), -16),
    *[(Wd(37, 'дома') + k * .3, ('step_far', 30 + k), -25) for k in range(8)], (Wd(37, 'до'), ('rise', 2), -28),
    (Wd(38, 'тогда'), ('growl', 3), -17),
    *[(Wd(38, 'открыть') - .25 + k * .14, ('latch', 30 + k), -15) for k in range(5)], (Wd(38, 'открыть') + .5, ('knock', 1), -15),
    (Wd(38, 'дверь'), ('clunk', 2), -14),
    # water and food
    *steps(Wd(39, 'вернулся') - .25, 4, .26, -24, 20),
    (Wd(40, 'набрал') - .15, ('click', 3), -20), (Wd(40, 'набрал'), ('pour', 1), -24),
    (Wd(41, 'заполнил') - .3, ('pour', 2), -21), (Wd(42, 'кастрюли'), ('pour', 3), -23), (Wd(43, 'ванну'), ('pour', 4), -21),
    (Wd(44, 'пригодиться'), ('ding', 4), -22),
    (Wd(45, 'собрал') + .3, ('thump', 5), -12), (Wd(46, 'консервы'), ('cans', 1), -15), (Wd(47, 'крупы'), ('rustle', 1), -15),
    (Wd(48, 'сухие'), ('rustle', 2), -17), *pops(Wd(48, 'сухие') + .1, Wd(48, 'продукты'), db=-24), (Wd(49, 'долго'), ('ding', 5), -21),
    # the dark, the phone, the screams outside, the quiet
    (OFF + .02, ('subhit', 3), -17),
    (Wd(51, 'беззвучный'), ('click', 4), -19), (Wd(51, 'беззвучный') + .05, ('buzz', 1), -22),
    (103.9, ('scream', 7), -14), (104.4, ('scream', 8), -16), (104.85, ('scream', 9), -15), (104.0, ('growl', 4), -20),
    (Wd(55, 'сел') - .2, ('rustle', 3), -22), (Wd(55, 'окон') - .2, ('thump', 6), -21),
    # the knocks: a low body under the voice's knocks, a heartbeat, the blow, the eyes
    *[(k, ('subknock', i), -17) for i, k in enumerate(KNOCKS)],
    (112.35, ('heart_long', 1), -16),
    (HIT, ('slam', 3), -6), (HIT, ('boom', 4), -12), (HIT, ('subhit', 4), -10),
    (E(60) - .1, ('sting', 4), -15),  # just after the last word, when the eyes light up
]

# levels in dB: the city outside, the music pulse, the drone, the room tone
BEDS = [
    (0.0, C(3), -25, -30, -31, -90),
    (C(3), C(5), -60, -26, -40, -90),
    (C(5), 11.5, -90, -33, -60, -40),
    (11.5, C(8), -33, -60, -31, -44),
    (C(8), C(13), -21, -27, -33, -90),
    (C(13), C(15), -30, -29, -30, -60),
    (C(15), C(21), -40, -60, -30, -50),
    (C(21), C(22), -42, -90, -27, -60),
    (C(22), C(25), -36, -30, -30, -90),
    (C(25), C(32), -38, -25, -36, -90),
    (C(32), Wd(32, 'окна'), -30, -27, -36, -90),
    (Wd(32, 'окна'), Wd(33, 'балкон'), -42, -27, -36, -90),
    (Wd(33, 'балкон'), C(37), -52, -28, -34, -90),
    (C(37), C(39), -40, -26, -28, -90),
    (C(39), OFF, -54, -27, -36, -50),
    (OFF, C(52), -56, -90, -32, -46),
    (C(52), C(53), -25, -90, -30, -90),
    (C(53), 111.7, -60, -90, -42, -40),
    (111.7, CARD, -70, -90, -33, -50),
    (CARD, 400.0, -90, -26, -32, -90),
]
BED_GENS = [lambda d: city_chaos(d, 1), lambda d: pulse_music(d, 100, 2), lambda d: drone(d, 3), lambda d: room(d, 4)]


def voice_fx(v):
    """The announcer's lines come out of the little radio on the windowsill; the whispered last line is lifted."""
    v = v.copy()
    nar = np.sqrt(np.mean(v[int(S(13) * SR):int(E(15) * SR)] ** 2))  # how loud the narrator is
    a, b = int((S(RADIO[0]) - .1) * SR), int((E(RADIO[-1]) + .25) * SR)
    seg = reverb(speakerize(v[a:b], 5), 0.35, 0.15, 5)[:b - a]
    v[a:b] = seg * nar / (np.sqrt(np.mean(seg ** 2)) + 1e-9) * 0.85
    # the last line is whispered: lift it so that it still carries on a phone
    a, b = int((S(60) - .05) * SR), int((E(60) + .3) * SR)
    v[a:b] *= 10 ** (5 / 20)
    return v


def make(kind, seed):
    if kind == 'intro':
        return intro_hit(seed)
    if kind == 'trans':
        return transition(seed)
    if kind == 'fire':
        return fire(5.5, seed) * np.minimum(1, (5.5 - secs(5.5)) / 1.0)
    if kind == 'boom':
        return boom(seed)
    if kind == 'pop':
        return pop(seed)
    if kind == 'ding':
        t = secs(1.2)
        return reverb(norm(np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 4) + .4 * np.sin(2 * np.pi * 1980 * t) * np.exp(-t * 6)), 0.8, 0.3, seed)
    if kind == 'sting':
        return reverb(sting(seed), 1.5, 0.35, seed)
    if kind == 'scream':
        return band(scream(seed, 0.9 + 0.1 * (seed % 3)), hi=2600)
    if kind == 'crash':
        return crash(seed)
    if kind == 'glass':
        return glass(seed)
    if kind == 'step':
        return step(seed, .8)
    if kind == 'step_far':
        return reverb(band(step(seed, .6), hi=1800), 1.0, 0.4, seed)
    if kind == 'thump':
        return thump(seed)
    if kind == 'growl':
        return growl(1.2, seed) * 0.8
    if kind == 'whoosh':
        return whoosh(0.4, seed)
    if kind == 'click':
        return click(seed) * 0.9
    if kind == 'beeps':
        return speakerize(beeps(3, 1000, 0.18, seed), seed)
    if kind == 'static_bed':
        return static(E(RADIO[-1]) - S(RADIO[0]) + .6, seed) * 0.6
    if kind == 'power_down':
        return power(seed, True)
    if kind == 'heart':
        return heartbeat(2.3, 143, seed)
    if kind == 'heart_long':
        d = CARD - 112.35; t = secs(d)
        return heartbeat(d, 96, seed) * np.minimum(1, t / 1.5) * (1 - .5 * np.clip((t + 112.35 - S(60) + .3) / .3, 0, 1))  # softer under the whisper
    if kind == 'shing':
        return shing(seed)
    if kind == 'latch':
        return latch(seed)
    if kind == 'scrape':
        return scrape(1.5 if seed == 1 else 0.95, seed)
    if kind == 'subhit':
        return subdrop(seed, dur=0.9, decay=6.0, drive=1.8)
    if kind == 'subknock':
        return subdrop(seed, dur=0.35, decay=16.0, drive=1.5)
    if kind == 'rise':
        return rise(1.1 if seed == 1 else 2.0, 300, 1100, seed)
    if kind == 'clunk':
        return clunk(seed)
    if kind == 'wood':
        return wood(seed)
    if kind == 'slam':
        return slam(seed)
    if kind == 'crowd':
        x = np.zeros(int(3.0 * SR))
        for k in range(4):
            g, i = growl(2.0, seed + k), int(k * .25 * SR)
            m = min(len(g), len(x) - i)
            x[i:i + m] += g[:m]
        return norm(band(x, hi=1200))
    if kind == 'knock':
        return knock(seed)
    if kind == 'pour':
        return {1: lambda: pour(0.9, 300, 700, seed), 2: lambda: pour(1.3, 450, 1500, seed), 3: lambda: pour(0.7, 250, 600, seed, 40),
                4: lambda: pour(1.3, 160, 380, seed, 35)}[seed]()
    if kind == 'cans':
        return cans(seed, 1.0)
    if kind == 'rustle':
        return rustle(0.7, seed)
    if kind == 'buzz':
        return buzz(seed) * 0.7
    raise ValueError(kind)


if __name__ == '__main__':
    run(make, EVENTS, BEDS, VOICE_END, BED_GENS, voice_fx)
