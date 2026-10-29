// Episode 5, scene 4 (1:39–2:04): the light off, the phone on silent, screams outside, the quiet, the knocks,
// someone behind the door, the end card.
'use strict';

// The silent-mode card on the phone screen (phone coordinates): a bell, a switch; k = 0..1 switched to silent.
function silentCard(ctx, t, k, show) {
  if (show <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(show * 2); ctx.translate(0, lerp(80, 0, outc(show)));
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; rrect(ctx, -220, 40, 440, 300, 40); ctx.fill();
  const on = k > .5;
  ctx.fillStyle = on ? '#ff3b30' : '#ffffff'; ell(ctx, -120, 150, 62, 62); ctx.fill();
  icon2(ctx, on ? 'mute' : 'bell', -120, 150, 70, on ? '#fff' : '#1a1c20', on ? '#ff3b30' : '#ffffff');
  const u = inout(clamp(k));
  ctx.fillStyle = on ? '#ff9500' : '#5a5e66'; rrect(ctx, 20, 112, 160, 76, 38); ctx.fill();
  ctx.fillStyle = '#ffffff'; ell(ctx, lerp(58, 142, u), 150, 32, 32); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `900 34px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(on ? 'БЕЗЗВУЧНЫЙ' : 'ЗВУК', 0, 270);
  ctx.restore();
}

// Nikita on the hallway floor, his back to the wall, knees up, arms round them.
const SITTER = { x: 880, h: HN };
function sitting(x = SITTER.x, h = SITTER.h, extra = {}) {
  const p = Object.assign({ face: -1, sit: 'floor', eyes: 'wide', look: -1, lookY: -.2 }, extra), [kx, ky] = guyKnee(x, FEET, h, -1);
  p.armR = guyReach(x, FEET, h, p, kx - .02 * h, ky + .03 * h, 1); p.armL = guyReach(x, FEET, h, p, kx + .005 * h, ky + .05 * h, 1);
  return p;
}

// Knocks on the door, seen from the hallway in the dark: the barricade shakes on each knock (kn = times), a word for
// each (o.word, 'ТУК' by default); o.hard for harder ones.
function knocking(ctx, t, lt, d, kn, o = {}) {
  const sh = pulse(t, kn.map(k => [k, 1]), 9), [sx, sy] = shake(t, kn.map(k => [k, o.hard ? 1 : .7]), o.hard ? 10 : 7);
  ctx.save(); ctx.translate(sx, sy);
  push(ctx, lt, d, 600, 1100, 1.0, 1.04);
  hallway(ctx, t, { lockK: 1, wardrobe: 1, table: 1, items: [9, 9, 9, 9, 9], shake: Math.min(1, sh * (o.hard ? 1.3 : 1)), lamp: 0 });
  guy(ctx, SITTER.x, FEET, SITTER.h, sitting(SITTER.x, SITTER.h, { shake: sh * 3, idle: false, head: [0, -.012 * Math.min(1, sh)] }));  // he flinches at each knock
  // dust falling from the top of the door frame
  kn.forEach(k => { const a = t - k; if (a < 0 || a > 1.2) return; const r = rng(Math.floor(k * 100)); for (let i = 0; i < 12; i++) { ctx.fillStyle = `rgba(210,200,180,${.6 * (1 - a / 1.2)})`; ell(ctx, DOOR.x + r() * DOOR.w, DOOR.y + a * a * 500 * (.6 + r() * .6), 3, 3); ctx.fill(); } });
  darkness(ctx, 1, [640, 1150, 760]);
  ctx.restore();
  kn.forEach((k, i) => sfxWord(ctx, t, k, o.word || 'ТУК', 300 + i * 200, 620 - i * 60, (o.hard ? 92 : 78) + i * 8 + (o.word ? 30 : 0), o.hard ? TSC.r : TSC.w, .9));
}

SHOTS.push(
  // Никита выключил свет. (the click in the voice is at 100.795)
  { t0: C(50), trans: 'cut', draw(ctx, lt, d, t) {
    const off = 100.795, a = Wd(50, 'выключил'), k = sstep(a - .1, off - .05, t), p = { face: 1, eyes: 'dot', look: .5 };
    push(ctx, lt, d, 820, 1050, 1.18, 1.24);
    kitchen(ctx, t, { time: 21.6, night: 1, chaos: 1, curtains: 1, switch: t > off ? 1 : 0 });
    kTable(ctx, t, { bowl: false });
    p.armR = guyReach(780, FEET, HN, p, lerp(800, 912, k), lerp(1200, 1062 + (t > off ? 12 : 0), k), -1);
    guy(ctx, 780, FEET, HN, p);
    if (t > off) darkness(ctx, 1, null);
    sfxWord(ctx, t, off, 'ЩЁЛК', 930, 860, 70, TSC.y, .9);
  } },
  // Телефон поставил на беззвучный режим.
  { t0: C(51), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0b0f1a'], [1, '#05070d']]);
    push(ctx, lt, d, 540, 820, 1.0, 1.04);
    phone(ctx, t, { time: '21:40', battery: 64, noSignal: 1, screen: c => silentCard(c, t, clamp((t - Wd(51, 'беззвучный')) / .25), clamp((t - Wd(51, 'телефон')) / .35)) });
    glow(ctx, 540, 820, 700, 'rgba(120,150,230,1)', .08);
  } },
  // Снаружи продолжались крики.
  { t0: C(52), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1.0, 1.05);
    facade(ctx, t, { mark: clamp((lt - .2) / .4), draw: x => {
      [[120, 1, 0], [420, -1, 1], [700, 1, 2], [960, -1, 3]].forEach(([zx, f, i]) => { const go = 35 * (t - C(52)); const g = guy(x, zx + f * go, 1840, 260, zedWalk(go + i * 30, 260, f, i), ZED); redEyes(x, g, f, 1); });
    } });
    pill(ctx, 435, 380, 'НИКИТА', 'yellow', clamp((lt - .3) / .3), { size: 30 });
    [[103.9, 'А-А-А!', 260, 1480], [104.4, 'А-А!', 820, 1440], [104.85, 'ПОМОГИТЕ!', 540, 1560]].forEach(([s, w, x, y]) => sfxWord(ctx, t, s, w, x, y, 56, TSC.r, 1.0));
  } },
  // Но в квартире было тихо.
  { t0: C(53), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 640, 1100, 1.1, 1.15);
    kitchen(ctx, t, { time: 21.7, night: 1, chaos: 1, curtains: 1, switch: 1 });
    eating(ctx, t, 0, { eyes: 'dot', look: -.3, lookY: .2, spoon: false, bowl: false, armR: [-.9, -.6] });
    darkness(ctx, 1, [290, 720, 440]);
    ctx.fillStyle = 'rgba(190,210,255,0.2)'; ctx.fillRect(286, 400, 8, 620); glow(ctx, 290, 720, 220, 'rgba(160,190,255,1)', .1);
  } },
  // Слишком тихо.
  { t0: C(54), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 800, 1050, 1.32, 1.42);
    kitchen(ctx, t, { time: 21.7, night: 1, chaos: 1, curtains: 1, switch: 1 });
    eating(ctx, t, 0, { eyes: 'wide', look: Math.sin(t * 1.3) * .9, spoon: false, bowl: false, armR: [-.9, -.6], idle: false });
    darkness(ctx, 1, [800, 1030, 520]);
  } },
  // Никита сел подальше от окон.
  { t0: C(55), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(55, 'сел') - .45, k = clamp((t - a) / .8), x = lerp(1180, SITTER.x, inout(k)), sk = clamp((t - a - .82) / .5);
    push(ctx, lt, d, 640, 1100, 1.0, 1.04);
    hallway(ctx, t, { lockK: 1, wardrobe: 1, table: 1, items: [9, 9, 9, 9, 9], lamp: 0 });
    if (sk >= 1) guy(ctx, x, FEET, SITTER.h, sitting());
    else if (sk > 0) guy(ctx, x, FEET, SITTER.h, sitDown(sk, -1, NIK, { eyes: 'wide', look: -1, idle: false, armR: [-.5 * sk, -.6 * sk], armL: [-.4 * sk, -.6 * sk] }));
    else guy(ctx, x, FEET, SITTER.h, walk(1180 - x, HN, -1, { a: sstep(0, .1, k) * (1 - sstep(.85, 1, k)), pose: { eyes: 'wide' } }));
    darkness(ctx, 1, [860, 1300, 600]);
  } },
  // Тук. (knocks in the voice: 111.79, 112.0, 112.215)
  { t0: 111.7, trans: 'cut', draw(ctx, lt, d, t) { knocking(ctx, t, lt, d, [111.79, 112.0, 112.215]); } },
  // Никита замер.
  { t0: C(57), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 860, 1380, 1.3, 1.42);
    hallway(ctx, t, { lockK: 1, wardrobe: 1, table: 1, items: [9, 9, 9, 9, 9], lamp: 0 });
    guy(ctx, SITTER.x, FEET, SITTER.h, sitting(SITTER.x, SITTER.h, { idle: false }));
    darkness(ctx, 1, [860, 1380, 520]);
    tint(ctx, '#808080', sstep(Wd(57, 'замер'), Wd(57, 'замер') + .8, t), 'saturation');
  } },
  // Тук. (115.155, 115.365, 115.58)
  { t0: 115.0, trans: 'cut', draw(ctx, lt, d, t) { knocking(ctx, t, lt, d, [115.155, 115.365, 115.58], { hard: true }); } },
  // Ещё один удар.
  { t0: C(59), trans: 'cut', draw(ctx, lt, d, t) {
    const hit = Wd(59, 'удар');
    knocking(ctx, t, lt, d, [hit], { hard: true, word: 'БУМ!' });
    if (t > hit) tint(ctx, '#ff2020', .3 * Math.exp(-(t - hit) * 5), 'screen');
  } },
  // Кто-то уже стоял за его дверью.
  { t0: C(60), trans: 'cut', draw(ctx, lt, d, t) {
    let who;
    push(ctx, lt, d, 340, 1050, 1.0, 1.12);
    doorSection(ctx, t, { lamp: 1, who: x => { who = guy(x, 330, FEET, 820, { face: 1, eyes: 'closed', idle: false, lean: .04 }, NEIGHBOUR); },
      nik: x => guy(x, 960, FEET, 700, sitting(960, 700, { idle: false })) });
    darkness(ctx, 1, [240, 400, 560]);
    redEyes(ctx, who, 1, clamp((t - E(60) + .12) / .2));  // on the end of the last word, with the sting
  } },
  // The end card: what would you do?
  { t0: CARD, trans: 'fade', xfade: .3, fadeOut: .6, draw(ctx, lt, d, t) {
    choiceCard(ctx, t, lt, { left: (lt - .35) / .3, right: (lt - .8) / .3, leftLabel: 'ОТКРЫТЬ ДВЕРЬ', rightLabel: 'НЕ ОТКРЫВАТЬ' });
  } },
);
