"""Soundtrack for episode 2 "The island": voiceover + surf, wind, drone, shimmer and night insects + effects.

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
_LINES = {x['n']: x for x in json.load(open(os.path.join(HERE, '../../audio/ep02/alignment.json'), encoding='utf-8'))['lines']}
S, E = (lambda n: _LINES[n]['start']), (lambda n: _LINES[n]['end'])
C = lambda n: (_LINES[n - 1]['end'] + _LINES[n]['start']) / 2


def Wd(n, p, k=0):
    hits = [w[1] for w in _LINES[n]['words'] if re.sub('[^а-яё0-9-]', '', w[0].lower()).startswith(p)]
    return hits[k] if len(hits) > k else S(n)


VOICE_END = 189.1
HIT = Wd(4, 'океан') + .2  # the plane hits the water


def rule(t):
    """A rule card slams in."""
    return [(t - .25, ('whoosh', 1), -20), (t, ('boom', 1), -16), (t, ('thump', 1), -12)]


def pops(*ts, db=-26):
    return [(t, ('pop', i), db) for i, t in enumerate(ts)]


def whip(t):
    return (t - .12, ('whoosh', 2), -22)


EVENTS = [
    # (time, sound, gain in dB)
    # the hook: a zombie walks the beach at dusk; the rules
    (0.0, ('boom', 2), -16),
    *[(0.25 + k * .7, ('sand', k), -30) for k in range(int((C(2) - .3) / .7))],
    (Wd(1, 'зомби') - .1, ('growl', 1), -19),
    *pops(Wd(1, 'зомби'), Wd(1, 'остров'), db=-24),
    whip(C(2)),
    *pops(*[C(2) + .15 + k * .18 for k in range(5)], db=-30),
    (Wd(3, 'одно'), ('scratch', 1), -20),
    (Wd(3, 'жизни'), ('boom', 3), -15),
    (Wd(3, 'жизни'), ('heart', 1), -22),
    # the crash
    whip(C(4)),
    (C(4), ('plane', 1), -10),
    (HIT, ('crash', 1), -5),
    (HIT + .05, ('splash', 1), -9),
    # waking up on the sand; the wreck
    (Wd(5, 'очнулся') - .2, ('gasp', 1), -15),
    *pops(Wd(5, 'один'), db=-26),
    whip(C(6)),
    (Wd(6, 'обломки'), ('creak', 1), -24),
    (Wd(6, 'дым') + .3, ('creak', 2), -27),
    # the pilot's voice, the virus
    (C(7) - .3, ('whoosh_rev', 1), -18),
    (C(7), ('static_long', 1), -30),
    (Wd(8, 'вирус'), ('boom', 4), -18),
    (Wd(8, 'превращ'), ('growl', 2), -17),
    # checking myself; rule one
    whip(C(9)),
    (Wd(10, 'сломана'), ('snap', 1), -14),
    (C(10) - .3, ('whoosh_rev', 2), -20),
    *rule(C(11)),
    whip(C(12)),
    (Wd(12, 'нельзя'), ('thump', 2), -16),
    (Wd(13, 'лежит'), ('pop', 7), -22),
    (Wd(14, 'палка'), ('wood', 1), -16),
    (Wd(14, 'ткань'), ('rustle', 1), -18),
    (Wd(15, 'туго'), ('rustle', 2), -22),
    whip(C(16)),
    (Wd(16, 'часы'), ('clink', 1), -22),
    (Wd(16, 'кольца'), ('clink', 2), -22),
    (Wd(17, 'выше'), ('whoosh', 3), -24),
    whip(C(18)),
    (Wd(18, 'холод'), ('rustle', 3), -22),
    # sunset, the cold night; rule two
    whip(C(20)),
    (Wd(20, 'спать'), ('rustle', 4), -26),
    (C(21) - .2, ('whoosh_rev', 3), -18),
    (C(21), ('boom', 5), -19),
    *[(t, ('tick', i), -27) for i, t in enumerate(np.arange(Wd(21, 'падает'), Wd(21, 'градусов'), .14))],
    (C(22), ('shiver', 1), -16),
    *rule(C(23)),
    whip(C(24)),
    *pops(Wd(24, 'укрытие'), db=-20),
    *pops(*[Wd(24, 'потом') + i * .15 for i in range(3)], db=-27),
    *[(C(25) + .05 + k * .22, ('tick', 20 + k), -24) for k in range(4)],
    *pops(Wd(25, 'шалаш'), db=-22),
    whip(C(26)),
    *[(Wd(26, 'еды') + k * .15, ('clink', 3 + k), -26) for k in range(3)],
    *pops(*[Wd(26, 'воды') + k * .18 for k in range(2)], db=-24),
    *pops(Wd(27, 'пару'), db=-22),
    (Wd(27, 'нет'), ('boom', 6), -19),
    whip(C(28)),
    # the radio
    (C(29) - .3, ('whoosh_rev', 4), -19),
    (Wd(29, 'рацию'), ('clink', 6), -24),
    (C(30), ('static_burst', 1), -15),
    (C(30) + .5, ('static_long', 2), -27),
    *[(t, ('tick', 40 + i), -21) for i, t in enumerate(np.arange(Wd(31, 'девяносто'), C(32) - .2, 1.0))],
    # rules three and four
    *rule(C(32)),
    whip(C(33)),
    (Wd(33, 'укус'), ('bite', 1), -10),
    (Wd(33, 'укус') + .05, ('growl', 3), -24),
    (Wd(33, 'конец'), ('boom', 7), -14),
    *[(C(34) + .3 + k / .7, ('beep', k), -28) for k in range(3)],
    *rule(C(35)),
    whip(C(36)),
    (Wd(36, 'пей'), ('thump', 3), -15),
    (Wd(36, 'соль'), ('salt', 1), -22),
    (C(37), ('rain', 1), -17),
    *[(C(37) + .4 + k * .62, ('drip', k), -26) for k in range(5)],
    whip(Wd(37, 'собирай')),
    whip(Wd(37, 'пей')),
    (Wd(37, 'сок'), ('sip', 1), -22),
    # building the camp
    whip(C(38)),
    (Wd(39, 'брёвна'), ('wood', 2), -14), (Wd(39, 'брёвна') + .25, ('wood', 3), -17),
    (Wd(39, 'верёвку'), ('rustle', 5), -20),
    (Wd(39, 'листья'), ('rustle', 6), -18),
    (Wd(40, 'каркас'), ('wood', 4), -15), (Wd(40, 'буквой'), ('wood', 5), -15), (Wd(40, 'а'), ('wood', 6), -13),
    *pops(Wd(40, 'прилива'), db=-24),
    *[(Wd(41, 'листья') + k * .45, ('rustle', 10 + k), -21) for k in range(5)],
    *[(Wd(41, 'вода') + k * .3, ('drip', 10 + k), -24) for k in range(3)],
    (Wd(42, 'пол'), ('rustle', 20), -20), (Wd(42, 'листьями'), ('rustle', 21), -21),
    (Wd(43, 'ветра') - .4, ('gust', 1), -16),
    (Wd(44, 'верёвку'), ('rustle', 22), -22),
    (Wd(44, 'банками'), ('cans', 1), -17),
    (Wd(45, 'звон'), ('cans', 2), -9),
    *pops(Wd(46, 'тепло'), Wd(46, 'вода'), Wd(46, 'еда'), Wd(46, 'сигнал'), db=-21),
    (Wd(47, 'правильно'), ('ding', 1), -20),
    (Wd(48, 'но', 1), ('stamp', 1), -8),
    (Wd(48, 'но', 1), ('boom', 8), -16),
    (Wd(49, 'ошибка'), ('boom', 9), -16),
    (Wd(49, 'перестанет'), ('heart', 2), -22),
    # night: steps outside
    (C(50) - .3, ('whoosh_rev', 5), -18),
    (Wd(50, 'просыпаюсь'), ('gasp', 2), -15),
    *[(Wd(50, 'шагов') + .3 + k * .78, ('sand_far', k), -21) for k in range(int((C(52) - Wd(50, 'шагов') - .3) / .78))],
    (Wd(52, 'молчат'), ('boom', 10), -21),
    (S(52), ('heart', 3), -19),
    (Wd(53, 'дубину'), ('wood', 7), -17),
    (Wd(53, 'выглядываю'), ('rustle', 30), -17),
    (Wd(54, 'девушка') - .1, ('sting', 1), -19),
    (Wd(55, 'дрожащая'), ('shiver', 2), -24),
    *[(C(56) + .05 + k * 1.25, ('beep', 10 + k), -28) for k in range(2)],
    (Wd(57, 'тянется'), ('rustle', 31), -22),
    (Wd(58, 'замираю'), ('boom', 11), -18),
    *rule(C(59)),
    (Wd(60, 'человек'), ('boom', 12), -17),
    (Wd(62, 'протягивает'), ('rustle', 32), -22),
    (Wd(63, 'прячет'), ('rustle', 33), -21),
    (Wd(63, 'спину'), ('sting', 2), -20),
    (Wd(64, 'шагаю'), ('sand', 40), -13),
    (Wd(64, 'шагаю') + .45, ('sand', 41), -15),
    (S(65), ('heart', 4), -16),
    (Wd(66, 'качает'), ('rustle', 34), -23),
    (S(67), ('sting_long', 3), -19),
    (S(68), ('boom', 13), -13),
    (Wd(69, 'имя') - .7, ('whoosh_rev', 6), -17),
    (Wd(69, 'имя'), ('boom', 15), -14),
    (VOICE_END + .1, ('boom', 14), -12),
    (VOICE_END + .1, ('sting', 4), -18),
]

# levels in dB: surf, wind, drone, shimmer, insects
BEDS = [
    (0.0, C(4), -33, -48, -28, -62, -90),
    (C(2), C(4), -36, -52, -25, -60, -90),
    (C(4), HIT, -36, -60, -30, -90, -90),
    (HIT, C(5), -48, -60, -26, -46, -90),
    (C(5), C(7), -29, -44, -32, -44, -90),
    (S(6), C(7), -29, -44, -32, -60, -90),
    (C(7), C(9), -60, -60, -27, -50, -90),
    (C(9), C(19), -38, -52, -30, -60, -90),
    (C(19), C(21), -31, -42, -30, -60, -90),
    (C(21), C(23), -37, -33, -28, -60, -44),
    (C(23), C(29), -40, -52, -28, -60, -90),
    (C(29), C(32), -52, -60, -27, -56, -90),
    (C(32), C(37), -40, -52, -27, -60, -90),
    (C(37), C(38), -42, -48, -30, -60, -90),
    (C(38), C(48), -31, -42, -32, -60, -90),
    (C(48), C(50), -44, -50, -24, -42, -90),
    (C(50), C(52), -41, -50, -28, -60, -38),
    (C(52), C(54), -44, -60, -26, -60, -70),
    (C(54), C(59), -40, -52, -26, -48, -48),
    (C(59), C(67), -44, -54, -24, -42, -52),
    (C(67), VOICE_END, -48, -60, -22, -38, -90),
    (VOICE_END, 400.0, -60, -60, -20, -36, -90),
]
BED_GENS = [lambda d: ocean(d, 1), lambda d: wind(d, 2), lambda d: drone(d, 3), lambda d: shimmer(d, 4), lambda d: insects(d, 5)]


def make(kind, seed):
    if kind == 'boom':
        return boom(seed)
    if kind == 'whoosh':
        return whoosh(0.35, seed)
    if kind == 'whoosh_rev':
        return whoosh(0.7, seed)
    if kind == 'thump':
        return thump(seed)
    if kind == 'pop':
        return pop(seed)
    if kind == 'sand':
        return sand_step(seed)
    if kind == 'sand_far':
        return reverb(band(sand_step(seed, .7), hi=2500), 0.8, 0.35, seed)
    if kind == 'growl':
        return growl(1.6, seed)
    if kind == 'scratch':
        return norm(band(rustle(0.45, seed), 2500, 9000))
    if kind == 'heart':
        return heartbeat(8.0, 70, seed)
    if kind == 'plane':
        return plane(HIT - C(4), seed)
    if kind == 'crash':
        return crash(seed)
    if kind == 'splash':
        return splash(seed)
    if kind == 'gasp':
        return reverb(norm(fade(band(noise(0.7, seed), 500, 3000) * np.sin(np.pi * secs(0.7) / 0.7) ** 2, 0.05, 0.1)), 0.4, 0.2, seed)
    if kind == 'creak':
        return reverb(band(creak(1.1, seed), hi=2500), 1.0, 0.4, seed)
    if kind == 'static_long':
        return static(2.4, seed) * np.linspace(1, .4, int(2.4 * SR))
    if kind == 'static_burst':
        return static(0.6, seed)
    if kind == 'snap':
        return norm(band(wood(seed), 700, 7000))
    if kind == 'wood':
        return wood(seed)
    if kind == 'rustle':
        return rustle(0.6, seed)
    if kind == 'clink':
        return clink(seed)
    if kind == 'tick':
        return tick(seed)
    if kind == 'shiver':
        t = secs(2.0)
        return norm(fade(band(noise(2.0, seed), 400, 2500) * (np.sin(2 * np.pi * 9 * t) > .3) * np.sin(np.pi * t / 2) ** 2, 0.05, 0.2))
    if kind == 'bite':
        return norm(thump(seed)[:int(.5 * SR)] + norm(band(wood(seed + 1), 600, 6000))[:int(.5 * SR)] * .8)
    if kind == 'beep':
        t = secs(0.12)
        return norm(fade(np.sin(2 * np.pi * 1760 * t) * np.exp(-t * 20), 0.003, 0.02))
    if kind == 'salt':
        return norm(band(glass(seed), 4000, 12000)) * .6
    if kind == 'rain':
        return rain(Wd(37, 'собирай') - C(37) + .6, seed)
    if kind == 'drip':
        return drip(seed)
    if kind == 'sip':
        t = secs(0.5)
        return norm(fade(band(noise(0.5, seed), 300, 1500) * (np.sin(2 * np.pi * 7 * t) > 0) * np.sin(np.pi * t / .5), 0.02, 0.05))
    if kind == 'gust':
        t = secs(2.2)
        return norm(fade(wind(2.2, seed) * np.sin(np.pi * t / 2.2) ** 2, 0.1, 0.2))
    if kind == 'cans':
        return cans(seed, 1.4 if seed == 1 else 2.0)
    if kind == 'ding':
        t = secs(1.2)
        return reverb(norm(np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 4) + .4 * np.sin(2 * np.pi * 1980 * t) * np.exp(-t * 6)), 0.8, 0.3, seed)
    if kind == 'stamp':
        x = thump(seed)
        x[:int(.6 * SR)] += .5 * band(noise(0.6, seed), 800, 4000) * np.exp(-secs(0.6) * 50)
        return norm(x)
    if kind == 'sting':
        return reverb(sting(seed), 1.5, 0.35, seed)
    if kind == 'sting_long':
        return reverb(sting(seed, E(67) - S(67) + 1.0), 1.5, 0.35, seed)
    raise ValueError(kind)


if __name__ == '__main__':
    run(make, EVENTS, BEDS, VOICE_END, BED_GENS)
