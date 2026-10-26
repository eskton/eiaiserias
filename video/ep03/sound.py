"""Soundtrack for episode 3 "The island, part 2": voiceover + surf, wind, drone, shimmer, insects, campfire + effects.

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
_LINES = {x['n']: x for x in json.load(open(os.path.join(HERE, '../../audio/ep03/alignment.json'), encoding='utf-8'))['lines']}
S, E = (lambda n: _LINES[n]['start']), (lambda n: _LINES[n]['end'])
C = lambda n: (_LINES[n - 1]['end'] + _LINES[n]['start']) / 2


def Wd(n, p, k=0):
    hits = [w[1] for w in _LINES[n]['words'] if re.sub('[^а-яё0-9-]', '', w[0].lower()).startswith(p)]
    return hits[k] if len(hits) > k else S(n)


VOICE_END = 200.2


def rule(t):
    """A rule card slams in (the same hit as in episode 2)."""
    return [(t - .25, ('whoosh', 1), -20), (t, ('boom', 1), -16), (t, ('thump', 1), -12)]


def pops(*ts, db=-26):
    return [(t, ('pop', i), db) for i, t in enumerate(ts)]


def whip(t):
    return (t - .12, ('whoosh', 2), -22)


def flash_back(t):
    return (t - .3, ('whoosh_rev', 1), -18)


def steps(t0, t1, every, db, kind='sand'):
    return [(t, (kind, i), db) for i, t in enumerate(np.arange(t0, t1, every))]


EVENTS = [
    # (time, sound, gain in dB)
    # the name on the bracelet
    (0.0, ('boom', 2), -15), (0.0, ('sting', 1), -21),
    (C(2), ('heart', 1), -21), (Wd(2, 'дрожит'), ('rustle', 1), -24),
    flash_back(C(5)),
    (Wd(6, 'запястье'), ('clink', 1), -24),
    flash_back(C(7)), (Wd(7, 'правда'), ('ding', 1), -21),
    (Wd(8, 'выдыхаю') - .1, ('gasp', 1), -16), whip(C(8)), (Wd(8, 'дубину'), ('wood', 1), -21),
    # rule six: a wound is not always a bite
    *rule(C(9)),
    whip(C(10)), *pops(Wd(10, 'рана'), Wd(10, 'укус'), db=-23), (Wd(10, 'не'), ('thump', 2), -18),
    *[(Wd(11, 'укус') + k * .11, ('tick', k), -27) for k in range(14)], *pops(Wd(11, 'дугу'), db=-22),
    (Wd(12, 'порез'), ('scratch', 1), -18), *[(Wd(12, 'царапина') + k * .17, ('scratch', 2 + k), -22) for k in range(3)],
    (Wd(12, 'оставляют'), ('thump', 3), -16),
    whip(C(13)), (Wd(13, 'разматывает'), ('rustle', 2), -18),
    flash_back(C(14)), (Wd(14, 'обшивки'), ('clink', 2), -20),
    *[(C(15) + .1 + k / 1.2, ('beep', k), -28) for k in range(2)], (Wd(15, 'нет'), ('ding', 2), -20),
    whip(C(16)), *pops(*[Wd(16, 'мало') + k * .08 for k in range(5)], db=-28),
    # rule seven: the whole body
    *rule(C(17)),
    whip(C(18)), *pops(Wd(18, 'шея'), Wd(18, 'плечи'), Wd(18, 'спина'), Wd(18, 'ноги'), db=-21),
    (Wd(19, 'повернуться'), ('rustle', 3), -22), (Wd(19, 'поднять'), ('rustle', 4), -22), (Wd(19, 'закатать'), ('rustle', 5), -22),
    whip(C(20)),
    whip(C(21)), *pops(*[Wd(21, 'всё') + k * .12 for k in range(4)], db=-24), (Wd(21, 'чисто'), ('ding', 3), -20),
    (Wd(22, 'гарантия'), ('stamp', 1), -10), (Wd(22, 'гарантия'), ('boom', 3), -18),
    # rule eight: wait
    *rule(C(23)),
    whip(C(24)), (C(24) + .1, ('whoosh', 3), -22), (C(24) + .5, ('sandflow', 1), -30),
    *[(Wd(25, 'несколько') + k * .15, ('tick', 20 + k), -24) for k in range(8)],
    (Wd(25, 'часов') + .4, ('growl', 1), -21), (E(25) + .2, ('boom', 4), -18),
    whip(C(26)), (Wd(26, 'не'), ('thump', 4), -14),
    *pops(Wd(27, 'одеяло'), db=-22), (Wd(27, 'одеяло'), ('rustle', 6), -22), *pops(Wd(27, 'десяти'), db=-24),
    (Wd(28, 'дубиной'), ('wood', 2), -20),
    # Mirra's story
    flash_back(C(29)), *pops(Wd(29, 'мирра'), db=-20),
    flash_back(C(30)), (C(30) + .3, ('creak', 1), -24),
    (Wd(31, 'удара'), ('crash', 1), -9), (Wd(31, 'трещину'), ('creak', 2), -17),
    whip(C(32)),
    *steps(Wd(33, 'перешагнула') - .5, Wd(33, 'верёвку') + .6, .45, -23, 'sand_far'), (Wd(33, 'луне'), ('ding', 4), -25),
    whip(C(34)), (Wd(34, 'никого') - .3, ('gust', 1), -19),
    # morning
    (C(35) + .5, ('whoosh_rev', 2), -22), (C(36) - .4, ('gull', 1), -24),
    whip(C(36)), *pops(Wd(36, 'странностей'), Wd(36, 'новых'), db=-22),
    whip(C(37)), *steps(Wd(37, 'подойти') - .3, E(37) + .6, .5, -25), (C(37) + .8, ('gull', 2), -27),
    (Wd(38, 'еду') + .6, ('clink', 3), -22), (Wd(38, 'воду') + .6, ('sip', 1), -22),
    (Wd(39, 'один'), ('ding', 5), -26),
    # the radio: 72 hours
    whip(C(40)), (C(40) + .1, ('static_burst', 1), -15), (C(41), ('static_long', 1), -27),
    *[(t, ('tick', 40 + i), -21) for i, t in enumerate(np.arange(Wd(41, 'семьдесят'), C(42) - .2, 1.0))],
    flash_back(C(42)), *pops(C(42) + .2, db=-22), (Wd(42, 'северной'), ('ding', 6), -18),
    # rule nine: along the shore
    *rule(C(43)),
    whip(C(44)), *[(Wd(44, 'берегу') + k * .1, ('tick', 60 + k), -28) for k in range(8)], (Wd(44, 'лес') + .2, ('thump', 5), -15),
    (C(45) + .2, ('rustle', 7), -22), (Wd(45, 'видно'), ('gust', 2), -24),
    whip(C(46)), *[(Wd(46, 'воду') + k * .12, ('clink', 4 + k), -25) for k in range(2)], *[(Wd(46, 'консервы') + k * .12, ('clink', 6 + k), -24) for k in range(3)],
    (Wd(46, 'верёвку'), ('rustle', 8), -22),
    (Wd(47, 'банки'), ('cans', 1), -16),
    # the walk
    whip(C(48)), *steps(C(48) + .1, C(50), .52, -27),
    (C(50) - .3, ('whoosh_rev', 3), -22), *steps(C(50) + .1, C(51), .52, -19),
    (Wd(51, 'оглядываюсь'), ('whoosh', 4), -25),
    flash_back(C(52)), (Wd(52, 'тянет'), ('gust', 3), -18), (Wd(52, 'сыростью') + .45, ('growl', 2), -26),
    whip(C(53)), *steps(C(53) + .1, Wd(53, 'садится'), .52, -26), (Wd(53, 'садится') + .1, ('thump', 6), -15),
    (S(55), ('heart', 2), -22),
    whip(C(56)), (Wd(56, 'прижимает'), ('rustle', 9), -22),
    flash_back(C(57)),
    flash_back(C(58)), (Wd(58, 'беру'), ('rustle', 10), -18),
    (Wd(59, 'горячая'), ('boom', 5), -20), *[(Wd(59, 'горячая') + k * .2, ('tick', 80 + k), -26) for k in range(12)], (Wd(59, 'слишком'), ('boom', 6), -16),
    # rule ten: both hands
    *rule(C(60)),
    whip(C(61)), *pops(Wd(61, 'обе'), db=-22),
    (Wd(62, 'фатальную'), ('boom', 7), -12), (Wd(62, 'фатальную'), ('sting', 2), -19),
    (S(63), ('heart', 3), -18),
    whip(C(64)), (Wd(64, 'одной'), ('thump', 7), -18),
    *pops(Wd(65, 'правила'), Wd(65, 'лагерь'), Wd(65, 'расчёты'), db=-22),
    (Wd(65, 'теряют'), ('thump', 8), -14), (Wd(65, 'теряют') + .2, ('glass', 1), -20), (Wd(65, 'смысл'), ('boom', 8), -16),
    flash_back(C(66)), (Wd(66, 'рукав'), ('rustle', 11), -16), (Wd(66, 'следы'), ('sting_long', 3), -17),
    (Wd(67, 'свежие'), ('boom', 9), -10), (Wd(67, 'свежие'), ('stamp', 2), -14),
    (S(68), ('shiver', 1), -23),
    whip(C(69)), (C(69) + .1, ('static_long', 2), -20),
    (C(70), ('static_burst', 2), -16), *[(t, ('tick', 100 + i), -21) for i, t in enumerate(np.arange(Wd(70, 'семьдесят'), VOICE_END + 4.2, 1.0))],
    (VOICE_END + .1, ('boom', 10), -12), (VOICE_END + .1, ('sting', 4), -18),
]

# levels in dB: surf, wind, drone, shimmer, insects, campfire
BEDS = [
    (0.0, C(9), -42, -54, -24, -48, -50, -90),
    (C(9), C(13), -50, -60, -27, -60, -62, -90),
    (C(13), C(16), -44, -58, -28, -60, -46, -30),
    (C(16), C(19), -52, -60, -27, -60, -62, -60),
    (C(19), C(21), -44, -58, -28, -60, -46, -32),
    (C(21), C(26), -52, -60, -26, -56, -62, -90),
    (C(26), C(29), -40, -54, -27, -60, -42, -36),
    (C(29), C(32), -50, -60, -26, -44, -62, -42),
    (C(32), C(34), -46, -58, -26, -54, -90, -90),
    (C(34), C(35), -40, -48, -27, -56, -44, -90),
    (C(35), C(37), -32, -44, -30, -40, -70, -90),
    (C(37), C(40), -30, -44, -34, -46, -90, -50),
    (C(40), C(43), -50, -60, -27, -56, -90, -90),
    (C(43), C(48), -40, -54, -28, -60, -90, -90),
    (C(48), C(51), -28, -40, -32, -60, -90, -90),
    (C(51), C(53), -34, -36, -27, -60, -90, -90),
    (C(53), C(60), -36, -46, -26, -44, -90, -90),
    (C(60), C(66), -46, -56, -23, -40, -90, -90),
    (C(66), VOICE_END, -44, -56, -22, -38, -90, -90),
    (VOICE_END, 400.0, -40, -56, -20, -36, -90, -90),
]
BED_GENS = [lambda d: ocean(d, 1), lambda d: wind(d, 2), lambda d: drone(d, 3), lambda d: shimmer(d, 4), lambda d: insects(d, 5), lambda d: fire(d, 6)]


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
        return heartbeat(8.0, 72, seed)
    if kind == 'crash':
        return crash(seed)
    if kind == 'gasp':
        return reverb(norm(fade(band(noise(0.9, seed), 400, 2500) * np.sin(np.pi * secs(0.9) / 0.9) ** 2, 0.05, 0.1)), 0.4, 0.2, seed)
    if kind == 'creak':
        return reverb(band(creak(1.1, seed), hi=2500), 1.0, 0.4, seed)
    if kind == 'static_long':
        return static(2.4, seed) * np.linspace(1, .4, int(2.4 * SR))
    if kind == 'static_burst':
        return static(0.6, seed)
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
    if kind == 'beep':
        t = secs(0.12)
        return norm(fade(np.sin(2 * np.pi * 1760 * t) * np.exp(-t * 20), 0.003, 0.02))
    if kind == 'sip':
        t = secs(0.5)
        return norm(fade(band(noise(0.5, seed), 300, 1500) * (np.sin(2 * np.pi * 7 * t) > 0) * np.sin(np.pi * t / .5), 0.02, 0.05))
    if kind == 'gust':
        t = secs(2.2)
        return norm(fade(wind(2.2, seed) * np.sin(np.pi * t / 2.2) ** 2, 0.1, 0.2))
    if kind == 'sandflow':
        t = secs(3.2)
        return norm(fade(band(noise(3.2, seed), 2500, 7000) * (0.7 + 0.3 * np.sin(2 * np.pi * 13 * t)), 0.3, 0.6))
    if kind == 'cans':
        return cans(seed, 1.4)
    if kind == 'gull':
        return gull(seed)
    if kind == 'glass':
        return glass(seed)
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
        return reverb(sting(seed, 3.0), 1.5, 0.35, seed)
    raise ValueError(kind)


if __name__ == '__main__':
    run(make, EVENTS, BEDS, VOICE_END, BED_GENS)
