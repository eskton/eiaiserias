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
  // the switch
  const u = inout(clamp(k));
  ctx.fillStyle = on ? '#ff9500' : '#5a5e66'; rrect(ctx, 20, 112, 160, 76, 38); ctx.fill();
  ctx.fillStyle = '#ffffff'; ell(ctx, lerp(58, 142, u), 150, 32, 32); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `900 34px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(on ? 'БЕЗЗВУЧНЫЙ' : 'ЗВУК', 0, 270);
  ctx.restore();
}

// Knocks on the door from the hallway in the dark: the barricade shakes on each knock (kn = times), a word for each
// (o.word, 'ТУК' by default); o.hard for harder ones.
function knocking(ctx, t, lt, d, kn, o = {}) {
  const sh = pulse(t, kn.map(k => [k, 1]), 9), [sx, sy] = shake(t, kn.map(k => [k, o.hard ? 1.2 : .8]), o.hard ? 16 : 11);
  ctx.save(); ctx.translate(sx, sy);
  push(ctx, lt, d, 520, 1000, 1.0, 1.05);
  hallway(ctx, t, { lockK: 1, wardrobe: 1, table: 1, items: [9, 9, 9, 9, 9], shake: Math.min(1, sh * (o.hard ? 1.4 : 1)) });
  guy(ctx, 950, 1880, 1000, { face: -1, sit: 'floor', eyes: 'wide', look: -1, lookY: -.2, armR: [-1.25, -1.5], armL: [-1.05, -1.6], shake: sh * 3, idle: false });
  // dust falling from the top of the door frame
  kn.forEach(k => { const a = t - k; if (a < 0 || a > 1.2) return; const r = rng(Math.floor(k * 100)); for (let i = 0; i < 14; i++) { ctx.fillStyle = `rgba(210,200,180,${.7 * (1 - a / 1.2)})`; ell(ctx, 300 + r() * 480, 400 + a * a * 600 * (.6 + r() * .6), 4, 4); ctx.fill(); } });
  darkness(ctx, 1, [620, 1000, 820]);
  ctx.restore();
  kn.forEach((k, i) => sfxWord(ctx, t, k, o.word || 'ТУК', 280 + i * 220, 600 - i * 70, (o.hard ? 100 : 84) + i * 10 + (o.word ? 40 : 0), o.hard ? TSC.r : TSC.w, .9));
}

SHOTS.push(
  // Никита выключил свет. (the click in the voice is at 100.795)
  { t0: C(50), trans: 'cut', draw(ctx, lt, d, t) {
    const off = 100.795, a = Wd(50, 'выключил'), f = clamp((t - a + .1) / (off - a));
    push(ctx, lt, d, 540, 700, 1.0, 1.08);
    switchClose(ctx, t, { finger: outc(f), down: t > off ? 1 : 0 });
    if (t > off) darkness(ctx, 1, null);
    sfxWord(ctx, t, off, 'ЩЁЛК', 790, 330, 96, TSC.y, .9);
  } },
  // Телефон поставил на беззвучный режим.
  { t0: C(51), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0b0f1a'], [1, '#05070d']]);
    push(ctx, lt, d, 540, 820, 1.0, 1.05);
    phone(ctx, t, { time: '21:40', battery: 64, noSignal: 1, screen: c => silentCard(c, t, clamp((t - Wd(51, 'беззвучный')) / .25), clamp((t - Wd(51, 'телефон')) / .35)) });
    glow(ctx, 540, 820, 700, 'rgba(120,150,230,1)', .08);
  } },
  // Снаружи продолжались крики.
  { t0: C(52), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1.0, 1.06);
    facade(ctx, t, { mark: clamp((lt - .2) / .4), draw: x => {
      [[120, 1, 0], [420, -1, 1], [700, 1, 2], [960, -1, 3]].forEach(([zx, f, i]) => { const g = guy(x, zx + Math.sin(t * .7 + i) * 60, 1840, 260, zedWalk(t, i, f), ZED); redEyes(x, g, f, 1); });
    } });
    pill(ctx, 435, 380, 'НИКИТА', 'yellow', clamp((lt - .3) / .3), { size: 30 });
    [[103.9, 'А-А-А!', 260, 1480], [104.4, 'А-А!', 820, 1440], [104.85, 'ПОМОГИТЕ!', 540, 1560]].forEach(([s, w, x, y]) => sfxWord(ctx, t, s, w, x, y, 60, TSC.r, 1.0));
  } },
  // Но в квартире было тихо.
  { t0: C(53), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 700, 1100, 1.0, 1.05);
    kitchen(ctx, t, { time: 21.7, night: 1, chaos: 1, curtains: 1, lamp: 0 });
    kChair(ctx, 880); guy(ctx, 880, 1900, 1300, { face: -1, sit: 1, eyes: 'dot', look: -.3, lookY: .2 }); kTable(ctx, t, { bowl: false });
    darkness(ctx, 1, [350, 650, 520]);
    ctx.fillStyle = 'rgba(190,210,255,0.22)'; ctx.fillRect(345, 280, 10, 740); glow(ctx, 350, 650, 260, 'rgba(160,190,255,1)', .1);
  } },
  // Слишком тихо.
  { t0: C(54), trans: 'cut', draw(ctx, lt, d, t) {
    wallpaper(ctx, 0, 0, W, H, '#d7c79f', 10);
    push(ctx, lt, d, 540, 1000, 1.0, 1.14);
    guy(ctx, 540, 1000 + .84 * 2300, 2300, { face: 0, eyes: 'wide', look: Math.sin(t * 1.3) * .9, idle: false });
    darkness(ctx, 1, [540, 1000, 900]);
  } },
  // Никита сел подальше от окон.
  { t0: C(55), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(55, 'сел') - .4, k = clamp((t - a) / .9), x = lerp(1250, 950, outc(k)), down = Wd(55, 'окон') - .3, sit = t > down;
    push(ctx, lt, d, 600, 1100, 1.0, 1.05);
    hallway(ctx, t, { lockK: 1, wardrobe: 1, table: 1, items: [9, 9, 9, 9, 9] });
    if (sit) guy(ctx, x, 1880, 1000, { face: -1, sit: 'floor', eyes: 'wide', look: -1, armR: [-1.25, -1.5], armL: [-1.05, -1.6] });
    else guy(ctx, x, 1880, 1000, k < 1 ? stride(t * 9, -1, .7, { face: -1, eyes: 'wide', idle: false }) : { face: -1, eyes: 'wide', crouch: sstep(down - .3, down, t) });
    darkness(ctx, 1, [900, 1300, 650]);
  } },
  // Тук. (knocks in the voice: 111.79, 112.0, 112.215)
  { t0: 111.7, trans: 'cut', draw(ctx, lt, d, t) { knocking(ctx, t, lt, d, [111.79, 112.0, 112.215]); } },
  // Никита замер.
  { t0: C(57), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 880, 1450, 1.15, 1.3);
    hallway(ctx, t, { lockK: 1, wardrobe: 1, table: 1, items: [9, 9, 9, 9, 9] });
    guy(ctx, 950, 1880, 1000, { face: -1, sit: 'floor', eyes: 'wide', look: -1, lookY: -.2, armR: [-1.25, -1.5], armL: [-1.05, -1.6], idle: false });
    darkness(ctx, 1, [880, 1450, 600]);
    tint(ctx, '#808080', sstep(Wd(57, 'замер'), Wd(57, 'замер') + .8, t), 'saturation');
  } },
  // Тук. (115.155, 115.365, 115.58)
  { t0: 115.0, trans: 'cut', draw(ctx, lt, d, t) { knocking(ctx, t, lt, d, [115.155, 115.365, 115.58], { hard: true }); } },
  // Ещё один удар.
  { t0: C(59), trans: 'cut', draw(ctx, lt, d, t) {
    const hit = Wd(59, 'удар');
    knocking(ctx, t, lt, d, [hit], { hard: true, word: 'БУМ!' });
    if (t > hit) tint(ctx, '#ff2020', .45 * Math.exp(-(t - hit) * 5), 'screen');
  } },
  // Кто-то уже стоял за его дверью.
  { t0: C(60), trans: 'cut', draw(ctx, lt, d, t) {
    let who;
    push(ctx, lt, d, 330, 1000, 1.0, 1.16);
    doorSection(ctx, t, { lamp: 1, who: x => { who = guy(x, 330, 1700, 1050, { face: 1, eyes: 'closed', idle: false, lean: .04 }, NEIGHBOUR); },
      nik: x => guy(x, 960, 1880, 760, { face: -1, sit: 'floor', eyes: 'wide', look: -1, armR: [-1.25, -1.5], armL: [-1.05, -1.6], idle: false }) });
    darkness(ctx, 1, [230, 320, 620]);
    redEyes(ctx, who, 1, clamp((t - E(60) + .12) / .2));  // on the end of the last word, with the sting
  } },
  // The end card: what would you do?
  { t0: CARD, trans: 'flash', xfade: .25, fadeOut: .6, draw(ctx, lt, d, t) {
    choiceCard(ctx, t, lt, { left: (lt - .35) / .3, right: (lt - .8) / .3, leftLabel: 'ОТКРЫТЬ ДВЕРЬ', rightLabel: 'НЕ ОТКРЫВАТЬ' });
  } },
);
