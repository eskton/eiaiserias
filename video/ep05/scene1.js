// Episode 5 "Nikita" (tracksuit look), scene 1 (0:00–0:33): the hook, Nikita on the seventh floor, the porridge, the
// screams, the street, the zombies, the radio goes on. Wd(n, 'слово') is when a word is spoken; the sets are in sets.js.
'use strict';
var XFADE = 0, END = 124;
const CARD = 120.45;  // the end card starts here
window.OVERLAY = (ctx, t) => { if (t < CARD) fatCaps(ctx, t); };  // the end card speaks for itself
window.POST = { drift: .8, bloom: .3, grain: .07, lift: .15, paper: .5 };

// Nikita at the kitchen table, eating: ph = 0 the spoon in the bowl, 1 at his mouth. Extra pose fields in o.
const EAT = { x: 880, y: 1900, h: 1300 };
function eating(ctx, t, ph, o = {}) {
  const p = Object.assign({ face: -1, sit: 1, eyes: 'happy' }, o), { x, y, h } = EAT;
  const stir = ph <= 0 && o.stir ? [Math.cos(t * 4) * 14, Math.sin(t * 4) * 4] : [0, 0];
  // the spoon tip: in the bowl or at the mouth; the hand holds the spoon about 150 px behind its tip
  const tipB = [650 + stir[0], 1360 + stir[1]], aB = Math.PI / 2 + .45, tipM = [800, 1102], aM = -.08;
  const tip = [lerp(tipB[0], tipM[0], ph), lerp(tipB[1], tipM[1], ph) - Math.sin(Math.PI * ph) * 60], a = lerp(aB, aM, ph);
  const hand = [tip[0] - Math.cos(a) * 150, tip[1] - Math.sin(a) * 150];
  p.armR = reach(x, y, h, p, hand[0], hand[1], 1);
  p.armL = p.armL || [-.55, -.9];
  p.hold = (c, hd) => spoon(c, hd, a, 1.7);
  kChair(ctx, x);
  const g = guy(ctx, x, y, h, p);
  kTable(ctx, t, { steam: o.steam });
  return g;
}

// The street below: people walking (and later running) left, zombies among them.
// Each walker: [feet y, x at t0, speed px/s, palette (FOLK index or 'z'), seed, scale].
function walkers(ctx, t, t0, list, o = {}) {
  list.forEach(([wy, x0, v, pal, seed, sc], i) => {
    const zed = pal === 'z', L = zed ? ZED : FOLK[pal % FOLK.length], f = v < 0 ? -1 : 1, run = Math.abs(v) > 150;
    let x = x0 + v * (t - t0), rot = 0;
    if (o.fall && o.fall[0] === i) { const tf = o.fall[1], k = clamp((t - tf) / .3); x = x0 + v * (Math.min(t, tf) - t0) + v * .15 * k; rot = f * 1.45 * inc(k); }
    if (x < -200 || x > W + 200) return;
    ctx.save(); ctx.translate(x, wy); ctx.rotate(rot); ctx.translate(-x, -wy);
    const pose = zed ? zedWalk(t, seed, f, .5) : stride(t * (run ? 13 : 6) + seed, f, run ? 1 : .55, { face: f, idle: false, lean: run ? .16 * f : 0, eyes: run ? 'wide' : 'dot', mouth: run ? .45 : 0, seed });
    if (rot) { pose.eyes = 'closed'; pose.legL = [.1 * f, 0]; pose.legR = [-.1 * f, 0]; }
    const g = guy(ctx, x, wy, 300 * sc, pose, L);
    ctx.restore();
    if (zed && o.eyes) redEyes(ctx, g, f, o.eyes);
  });
}

SHOTS.push(
  // У тебя синдром Дауна. И только ты переживёшь этот апокалипсис.
  { t0: 0, fadeIn: .2, draw(ctx, lt, d, t) {
    const boom = Wd(2, 'апокалипсис'), fl = pulse(t, [[boom, 1]], 3), only = sstep(Wd(2, 'только') - .1, Wd(2, 'ты') + .25, t);
    const [sx, sy] = shake(t, [[boom, 1.3]], 16);
    ctx.save(); ctx.translate(sx, sy);
    push(ctx, lt, d, 540, 1400, 1.0, 1.1);
    cityFire(ctx, t, { flash: fl });
    darkness(ctx, .75 * only * (1 - .6 * fl), [540, 1420, 620]);
    if (only > 0) glow(ctx, 540, 1400, 560, 'rgba(255,230,160,1)', .18 * only);
    guy(ctx, 540, 1880, 1000, { face: 0, eyes: 'dot', smile: .35 + .4 * only, look: (1 - only) * Math.sin(t * 1.5) * .6 });
    ctx.restore();
    topTitle(ctx, 'У ТЕБЯ СИНДРОМ ДАУНА', null, appear(t, .1, 1e9, .3));
    topTitle(ctx, null, 'ТОЛЬКО ТЫ ВЫЖИВЕШЬ', appear(t, Wd(2, 'только'), 1e9, .3));
  } },
  // Это Никита.
  { t0: C(3), trans: 'whip', draw(ctx, lt, d, t) {
    rays(ctx, t, '#f2c94c', '#e9b93c', 540, 1000);
    push(ctx, lt, d, 540, 1000, 1.0, 1.06);
    const hi = Wd(3, 'никита'), wave = Math.sin((t - hi) * 11) * (t > hi - .2 ? 1 : 0);
    guy(ctx, 540, 1960, 1300, { face: 0, eyes: 'happy', smile: 1, armR: [2.75 + .22 * wave, -.35], armL: [-.12, 0] });
    const k = clamp((t - hi) / .25); ctx.save(); ctx.translate(540, 330); const a = outBack(k); ctx.scale(a, a); ctx.globalAlpha = clamp(k * 3); outlined(ctx, 'НИКИТА', 0, 0, 150, TSC.w); ctx.restore();
  } },
  // Он живёт на седьмом этаже.
  { t0: C(4), trans: 'zoom', draw(ctx, lt, d, t) {
    const k = inout(clamp((t - Wd(4, 'на')) / (Wd(4, 'этаже') - Wd(4, 'на') + .25))), z = lerp(.46, 1.18, k);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    block(ctx, t, { camY: lerp(floorY(5) - FH / 2, floorY(7) - FH / 2 + 30, k), all: true, glow7: clamp((t - Wd(4, 'седьмом')) / .3) * .7,
      flat: (x, n, c) => { if (n === 7) flat7(x, t, c, { who: (x2, fy) => guy(x2, 560, fy, 250, { face: -1, sit: 1, eyes: 'happy', armR: [-1.1, -.9] }) }); } });
    ctx.restore();
    pill(ctx, 540, 300, '7 ЭТАЖ', 'yellow', clamp((t - Wd(4, 'седьмом')) / .25), { icon: 'house', size: 44 });
  } },
  // Сегодня утром он спокойно ел кашу. (the spoon taps the bowl as the voice's clinks play)
  { t0: C(5), trans: 'whip', draw(ctx, lt, d, t) {
    const hits = [10.735, 10.9, 11.23], up = Wd(5, 'ел');
    let ph = 0;
    if (t >= up && t < up + .38) ph = inout((t - up) / .38); else if (t >= up + .38 && t < up + .58) ph = 1; else if (t >= up + .58 && t < up + .8) ph = 1 - inout((t - up - .58) / .22);
    else if (t >= up + .8) hits.forEach((b, i) => { const a = i ? hits[i - 1] : up + .8; if (t >= a && t < b) ph = .12 * Math.sin(Math.PI * (t - a) / (b - a)); });
    const chew = t > up + .4 && t < 11.4 ? .18 + .14 * Math.sin(t * 22) : 0;
    push(ctx, lt, d, 760, 1150, 1.04, 1.12);
    kitchen(ctx, t, { time: 8 });
    eating(ctx, t, ph, { stir: t < up, steam: 1, mouth: ph > .7 ? .35 : chew });
    pill(ctx, 90, 300, 'УТРО · 08:00', 'dark', clamp(lt / .3), { align: 'left' });
    hits.forEach((b, i) => sfxWord(ctx, t, b, 'ДЗЫНЬ', 470 + i * 40, 1180 - i * 50, 48, TSC.w, .6));
  } },
  // Вдруг с улицы раздался крик.
  { t0: 11.5, trans: 'cut', draw(ctx, lt, d, t) {
    const v = Wd(6, 'вдруг'), fr = sstep(v - .1, v + .15, t), cry = Wd(6, 'крик');
    push(ctx, lt, d, 520, 900, 1.0, 1.07);
    kitchen(ctx, t, { time: 8.05, chaos: .35 * sstep(cry - .2, cry + .6, t) });
    eating(ctx, t, .45 * fr, { eyes: fr > .5 ? 'wide' : 'happy', look: -1, lookY: -.2, mouth: fr * .25, idle: fr < .5, steam: 1 });
    sfxWord(ctx, t, cry, 'А-А-А!', 350, 520, 80, TSC.r, 1.3);
  } },
  // Потом ещё один.
  { t0: C(7), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 700, 1000, 1.3, 1.42);
    kitchen(ctx, t, { time: 8.05, chaos: .45 });
    eating(ctx, t, .45, { eyes: 'wide', look: -1, lookY: -.3, mouth: .3, idle: false, steam: 1 });
    sfxWord(ctx, t, Wd(7, 'один'), 'А-А-А!', 380, 700, 64, TSC.r, 1.2);
    sfxWord(ctx, t, Wd(7, 'один') + .25, 'А-А!', 250, 560, 50, TSC.r, 1.0);
  } },
  // А через несколько секунд начался настоящий хаос.
  { t0: C(8), trans: 'whip', draw(ctx, lt, d, t) {
    const go = Wd(8, 'начался'), chaos = Wd(8, 'хаос'), k = sstep(go - .1, go + .5, t);
    const [sx, sy] = shake(t, [[go, 1.2], [chaos, 1.5]], 18);
    ctx.save(); ctx.translate(sx, sy);
    push(ctx, lt, d, 540, 900, 1.0, 1.06);
    street(ctx, t, { chaos: k, draw: x => {
      // before: people stroll both ways; after: everyone runs left
      [[1040, 200, 1], [1060, 520, -1], [1030, 860, -1], [600, 300, 1], [610, 820, -1]].forEach(([wy, x0, f], i) => {
        const run = clamp((t - go - i * .08) / .2), px = x0 + (Math.min(t, go) - C(8)) * 50 * f + Math.max(0, t - go) * -420 * run;
        const sc = wy < 700 ? .65 : 1, ff = run > .5 ? -1 : f;
        guy(x, px, wy, 300 * sc, stride(t * (run > .5 ? 13 : 6) + i, ff, run > .5 ? 1 : .5, { face: ff, idle: false, lean: run * -.16, eyes: run > .5 ? 'wide' : 'dot', mouth: run * .45, seed: i }), FOLK[i % 4]);
      });
      if (t > go) [[1050, 1180, 1], [600, 1150, 2]].forEach(([wy, x0, sd]) => guy(x, x0 - (t - go) * 90, wy, wy < 700 ? 200 : 300, zedWalk(t, sd, -1), ZED));
    } });
    ctx.restore();
    if (t > go) { tint(ctx, '#ffd0a0', .6 * Math.exp(-(t - go) * 6), 'screen'); sfxWord(ctx, t, go, 'БАХ!', 300, 640, 110, TSC.y, 1.2); }
    pill(ctx, 540, 1500, 'ХАОС', 'red', clamp((t - chaos) / .25), { icon: 'warn', size: 44 });
  } },
  // Никита подошёл к окну.
  { t0: C(9), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(9, 'подошёл'), b = Wd(9, 'окну') + .1, k = clamp((t - a + .2) / (b - a + .2)), x = lerp(960, 690, inout(k)), walk = k > 0 && k < 1;
    push(ctx, lt, d, 560, 1000, 1.0, 1.06);
    kitchen(ctx, t, { time: 8.1, chaos: .8 });
    kChair(ctx, 880);
    guy(ctx, x, 1900, 1300, walk ? stride(t * 9, -1, .8, { face: -1, eyes: 'wide', idle: false }) : { face: -1, eyes: 'wide', look: -1, lookY: .3 });
    kTable(ctx, t, { steam: 1 });
  } },
  // Люди бежали по улице. Кто-то падал.
  { t0: C(10), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.04, 1.1);
    const t0 = C(10), fall = Wd(11, 'падал');
    street(ctx, t, { chaos: 1, draw: x => {
      walkers(x, t, t0, [[1040, 1150, -400, 0, 1, 1], [1060, 1450, -380, 1, 2, 1.05], [1030, 1800, -420, 2, 3, .95], [1050, 2150, -390, 3, 4, 1], [600, 1100, -300, 2, 5, .65], [610, 1500, -330, 0, 6, .65]], { fall: [1, fall] });
    } });
    pill(ctx, 540, 1500, 'ПАНИКА', 'red', clamp((t - Wd(10, 'бежали')) / .25), { size: 40 });
  } },
  // А между ними уже двигались заражённые.
  { t0: C(12), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.08);
    const t0 = C(12), zk = clamp((t - Wd(12, 'заражённые')) / .3);
    street(ctx, t, { chaos: 1, siren: sstep(24.6, 25.0, t), draw: x => {
      walkers(x, t, t0, [[1040, 700, -420, 1, 7, 1], [1060, 1100, -400, 3, 8, 1.05], [1050, 980, -90, 'z', 1, 1.05], [1030, 1250, -80, 'z', 2, 1], [1060, 420, -95, 'z', 3, 1], [600, 900, -70, 'z', 4, .65], [610, 400, -300, 2, 9, .65]], { eyes: zk });
    } });
    pill(ctx, 540, 1500, 'ЗАРАЖЁННЫЕ', 'red', zk, { icon: 'bio', size: 44 });
  } },
  // Никита сразу отошёл от окна.
  { t0: C(13), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(13, 'отошёл') - .25, k = clamp((t - a) / .7), x = lerp(690, 940, outc(k)), walk = k > 0 && k < 1;
    push(ctx, lt, d, 560, 1000, 1.06, 1.0);
    kitchen(ctx, t, { time: 8.1, chaos: 1, siren: 1 - sstep(25.9, 26.8, t) });
    const sr = (1 - sstep(25.9, 26.8, t)) * (Math.sin(t * 14) > 0 ? 1 : 0);
    glow(ctx, 350, 700, 700, Math.sin(t * 14) > 0 ? 'rgba(255,40,40,1)' : 'rgba(40,90,255,1)', .22 * (1 - sstep(25.9, 26.8, t)));
    kChair(ctx, 880);
    guy(ctx, x, 1900, 1300, walk ? stride(-t * 10, -1, .6, { face: -1, eyes: 'wide', mouth: .4, idle: false, lean: .1 }) : { face: -1, eyes: 'wide', mouth: .3, look: -1 });
    kTable(ctx, t, {});
  } },
  // Он понял, что это уже не обычная авария.
  { t0: C(14), trans: 'cut', draw(ctx, lt, d, t) {
    wallpaper(ctx, 0, 0, W, H, '#d7c79f', 10); ctx.fillStyle = '#bfae86'; ctx.fillRect(0, 1080, W, H - 1080);
    push(ctx, lt, d, 540, 1000, 1.0, 1.08);
    guy(ctx, 540, 1000 + .84 * 2300, 2300, { face: 0, eyes: 'wide', look: Math.sin(t * 2.2) * .8, mouth: .15 });
    struck(ctx, 540, 330, 'ОБЫЧНАЯ АВАРИЯ', 'white', clamp((t - Wd(14, 'обычная')) / .25), clamp((t - Wd(14, 'авария') - .15) / .3));
    pill(ctx, 540, 1520, 'ЧТО-ТО ХУЖЕ', 'red', clamp((t - E(14)) / .25), { icon: 'warn', size: 44 });
  } },
  // Он включил радио. (static) Внимание.
  { t0: C(15), trans: 'whip', draw(ctx, lt, d, t) {
    const on = Wd(15, 'радио'), turn = sstep(Wd(15, 'включил'), Wd(15, 'включил') + .4, t), lit = t > on ? (t < on + .2 ? (Math.sin(t * 80) > 0 ? 1 : 0) : 1) : 0;
    push(ctx, lt, d, 600, 760, 1.0, 1.08);
    radio(ctx, t, { on: lit, knob: turn * 1.6, needle: .3 + .25 * turn + .05 * Math.sin(t * 3), stat: sstep(31.3, 31.45, t) * (1 - sstep(31.9, 32.1, t)), hand: clamp((t - C(15)) / .3) * (1 - sstep(31.0, 31.5, t)), speak: t > S(16) - .1 ? MOUTH(t) : 0, red: t > Wd(16, 'внимание') });
    pill(ctx, 540, 260, 'ВНИМАНИЕ', 'red', clamp((t - Wd(16, 'внимание')) / .25), { icon: 'warn', size: 48 });
  } },
);
