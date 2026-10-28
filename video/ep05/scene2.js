// Episode 5, scene 2 (0:33–1:07): the broadcast, the line goes dead, the door and the windows, the plan, the lock,
// the wardrobe, the table and the pile, the barricade holds, the lock checked again.
'use strict';

SHOTS.push(
  // Зафиксирована массовая вспышка неизвестного вируса.
  { t0: C(17), trans: 'zoom', draw(ctx, lt, d, t) {
    const fl = pulse(t, [[Wd(17, 'вспышка'), 1]], 4);
    push(ctx, lt, d, 640, 900, 1.0, 1.1);
    outbreakMap(ctx, t, inout(clamp((t - Wd(17, 'массовая')) / 2.4)) * .95, clamp((t - C(17) - .2) / .3));
    tint(ctx, '#ff3030', .22 * fl, 'screen');
    pill(ctx, 540, 260, 'ВСПЫШКА', 'red', clamp((t - Wd(17, 'вспышка')) / .25), { icon: 'warn', size: 48 });
    pill(ctx, 540, 1520, 'НЕИЗВЕСТНЫЙ ВИРУС', 'red', clamp((t - Wd(17, 'неизвестного')) / .25), { icon: 'bio', size: 44 });
  } },
  // Не покидайте свои дома. Избегайте любого контакта с заражёнными. Закройте окна и двери.
  { t0: C(18), trans: 'flash', xfade: .2, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1.0, 1.05);
    ctx.save(); ctx.translate(0, 760); radio(ctx, t, { on: 1, speak: MOUTH(t), red: 1, needle: .55 }); ctx.restore();
    const r18 = Wd(18, 'не'), r19 = Wd(19, 'избегайте'), r20 = Wd(20, 'закройте');
    alertCard(ctx, t, [['house', 'НЕ ВЫХОДИТЬ ИЗ ДОМА', (t - r18) / .35], ['hand', 'НЕ ПОДХОДИТЬ\nК ЗАРАЖЁННЫМ', (t - r19) / .35], ['window', 'ЗАКРЫТЬ ОКНА\nИ ДВЕРИ', (t - r20) / .35]], t > r20 ? 2 : t > r19 ? 1 : 0);
  } },
  // Связь оборвалась.
  { t0: C(21), trans: 'cut', draw(ctx, lt, d, t) {
    const cut = Wd(21, 'оборвалась') + .15, dead = t > cut, lit = dead ? 0 : t > cut - .35 ? (Math.sin(t * 90) > 0 ? 1 : 0) : 1;
    push(ctx, lt, d, 600, 760, 1.08, 1.0);
    radio(ctx, t, { on: lit, stat: dead ? 0 : 1, needle: .55, red: !dead });
    if (!dead) { const r = rng(Math.floor(t * 24)); ctx.globalAlpha = .18; for (let i = 0; i < 900; i++) { const v = r() * 255 | 0; ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fillRect(r() * W, r() * H, 8, 3); } ctx.globalAlpha = 1; }
    else tint(ctx, '#202838', .35 * clamp((t - cut) / .4), 'multiply');
    pill(ctx, 540, 260, 'НЕТ СИГНАЛА', 'red', clamp((t - cut) / .25), { icon: 'cross', size: 48 });
  } },
  // Никита посмотрел на входную дверь.
  { t0: C(22), trans: 'whip', draw(ctx, lt, d, t) {
    const turn = sstep(Wd(22, 'посмотрел') - .1, Wd(22, 'посмотрел') + .2, t);
    push(ctx, lt, d, 530, 1000, 1.0, 1.08);
    hallway(ctx, t, { ring: clamp((t - Wd(22, 'дверь')) / .3) });
    guy(ctx, 900, 1890, 1000, { face: turn > .5 ? -1 : 0, eyes: 'wide', look: turn > .5 ? -1 : 0, lookY: -.1 });
  } },
  // Потом на окна.
  { t0: C(23), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.06);
    windowsWall(ctx, t, { chaos: 1, vent: 1, balcony: .6, lat: 0, curtains: 0 });
    const k = clamp((t - Wd(23, 'окна')) / .3);
    dashRing(ctx, t, 40, 300, 440, 740, clamp((t - Wd(23, 'на')) / .3)); dashRing(ctx, t, 540, 300, 500, 1320, k);
  } },
  // И понял, что времени почти нет.
  { t0: C(24), trans: 'cut', draw(ctx, lt, d, t) {
    wallpaper(ctx, 0, 0, W, H, '#c4b49a', 9);
    const beat = pulse(t, [0, 1, 2, 3, 4, 5, 6].map(i => [C(24) + i * .42, 1]), 7);
    push(ctx, lt, d, 540, 1000, 1.0 + .01 * beat, 1.1 + .01 * beat);
    const g = guy(ctx, 540, 1000 + .84 * 2300, 2300, { face: 0, eyes: 'wide', mouth: .15, look: Math.sin(t * 5) * .6 });
    const sw = (lt * .35) % 1; ctx.save(); ctx.globalAlpha = 1 - sw; icon2(ctx, 'drop', g.head[0] + g.R * .78, g.head[1] - g.R * .35 + sw * 160, 70, '#8fc6ff'); ctx.restore();
    tint(ctx, '#ff2020', .08 * beat, 'soft-light');
    const v = lerp(.5, .06, clamp((t - Wd(24, 'времени')) / (E(24) - Wd(24, 'времени'))));
    meter(ctx, 110, 300, 560, 'ВРЕМЯ', v, '#d7342c', clamp(lt / .3));
    icon2(ctx, 'clock', 880, 300, 70, '#fff');
  } },
  // Он начал действовать.
  { t0: C(25), trans: 'flash', xfade: .18, draw(ctx, lt, d, t) {
    rays(ctx, t, '#e3893b', '#d8792c', 700, 1150);
    push(ctx, lt, d, 700, 1100, 1.0, 1.06);
    const up = outBack(clamp((t - Wd(25, 'действовать')) / .3));
    guy(ctx, 720, 1960, 1300, { face: 0, eyes: 'dot', armR: [lerp(.1, 2.85, up), lerp(0, -.7, up)], armL: [-.1, 0] });
    const k = clamp((t - Wd(25, 'начал')) / .3); ctx.save(); ctx.translate(310, 300); const a = outBack(k); ctx.scale(a, a); ctx.globalAlpha = clamp(k * 3); outlined(ctx, 'ПЛАН', 0, 0, 110, TSC.w); ctx.restore();
    plan(ctx, 70, 450, [0, 0, 0, 0], clamp((t - Wd(25, 'начал')) / .5), 100, 44);
  } },
  // Сначала запер входную дверь. (two turns of the thumb-turn; the click in the voice is at 55.625)
  { t0: C(26), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(26, 'запер'), turn = sstep(a, a + .45, t) + sstep(55.15, 55.6, t);
    push(ctx, lt, d, 540, 700, 1.0, 1.06);
    lockClose(ctx, t, { turn, hand: clamp((t - C(26)) / .35) });
    sfxWord(ctx, t, 55.625, 'ЩЁЛК', 790, 330, 96, TSC.y, 1.0);
  } },
  // Потом подтащил к ней тяжёлый шкаф.
  { t0: C(27), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(27, 'подтащил') - .1, b = Wd(27, 'шкаф') + .15, k = inout(clamp((t - a) / (b - a))), wx = lerp(700, 300, k);
    const [sx, sy] = shake(t, [[b, .8]], 10);
    ctx.save(); ctx.translate(540 + sx, 1080 + sy); ctx.scale(.72, .72); ctx.translate(-720, -1100);
    hallway(ctx, t, { lockK: 1, wardrobe: (1180 - wx) / 880 });
    const fx = wx + 460 + 300, p = stride(t * (k > 0 && k < 1 ? 7 : 0), -1, .6, { face: -1, eyes: k > 0 && k < 1 ? 'closed' : 'dot', lean: -.22, idle: false, mouth: .1 });
    p.armR = reach(fx, 1890, 1000, p, wx + 470, 1150, 1); p.armL = reach(fx, 1890, 1000, p, wx + 470, 1080, 1);
    guy(ctx, fx, 1890, 1000, p);
    if (k > 0 && k < 1) for (let i = 0; i < 4; i++) { const u = (t * 2 + i / 4) % 1; ctx.fillStyle = `rgba(200,190,170,${.5 * (1 - u)})`; ell(ctx, wx + 60 + i * 110, 1640 - u * 60, 30 + u * 40, 18 + u * 20); ctx.fill(); }
    ctx.restore();
    pill(ctx, 540, 300, 'ТЯЖЁЛЫЙ ШКАФ', 'yellow', clamp((t - Wd(27, 'тяжёлый')) / .25), { size: 44 });
  } },
  // Придвинул стол.
  { t0: C(28), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(28, 'придвинул') - .05, b = Wd(28, 'стол') + .2, k = inout(clamp((t - a) / (b - a))), tx = lerp(860, 290, k);
    const [sx, sy] = shake(t, [[b, .6]], 8);
    ctx.save(); ctx.translate(540 + sx, 1080 + sy); ctx.scale(.72, .72); ctx.translate(-720, -1100);
    hallway(ctx, t, { lockK: 1, wardrobe: 1, table: (1250 - tx) / 960 });
    const fx = tx + 500 + 250, p = stride(t * (k > 0 && k < 1 ? 8 : 0), -1, .6, { face: -1, eyes: 'dot', lean: -.2, idle: false, crouch: .2 });
    p.armR = reach(fx, 1890, 1000, p, tx + 505, 1470, 1); p.armL = reach(fx, 1890, 1000, p, tx + 505, 1450, 1);
    guy(ctx, fx, 1890, 1000, p);
    ctx.restore();
  } },
  // Сверху поставил ещё несколько тяжёлых предметов.
  { t0: C(29), trans: 'cut', draw(ctx, lt, d, t) {
    const drops = [Wd(29, 'сверху'), Wd(29, 'поставил'), Wd(29, 'несколько'), Wd(29, 'тяжёлых'), Wd(29, 'предметов')];
    const [sx, sy] = shake(t, drops.map(x => [x + .22, .6]), 9);
    ctx.save(); ctx.translate(sx, 330 + sy);
    push(ctx, lt, d, 540, 1100, 1.0, 1.06);
    hallway(ctx, t, { lockK: 1, wardrobe: 1, table: 1, items: drops.map(x => t >= x ? t - x : null) });
    ctx.restore();
    pill(ctx, 540, 300, 'ГИРЯ 32 КГ', 'dark', clamp((t - drops[2] - .25) / .25), { size: 40 });
  } },
  // Теперь дверь было практически невозможно открыть снаружи.
  { t0: C(30), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(30, 'практически'), b = Wd(30, 'невозможно') + .4, m = lerp(.15, .97, inout(clamp((t - a) / (b - a))));
    push(ctx, lt, d, 500, 1000, 1.0, 1.06);
    doorSection(ctx, t, { meter: m });
    // an arrow pushing at the door from the landing, crossed out
    const ak = clamp((t - Wd(30, 'открыть')) / .3), no = clamp((t - Wd(30, 'снаружи')) / .25);
    if (ak > 0) { ctx.save(); ctx.globalAlpha = clamp(ak * 2); const x1 = lerp(120, 400, outc(ak)); ctx.fillStyle = '#fff'; ctx.fillRect(60, 1080, x1 - 60, 44); poly(ctx, [[x1, 1040], [x1 + 70, 1102], [x1, 1164]]); ctx.fill(); ctx.restore(); }
    if (no > 0) { ctx.save(); ctx.translate(300, 1102); const s = outBack(no); ctx.scale(s, s); ctx.fillStyle = TSC.r; ell(ctx, 0, 0, 70, 70); ctx.fill(); icon2(ctx, 'cross', 0, 0, 90, '#fff'); ctx.restore(); }
    pill(ctx, 760, 1500, 'НЕ ОТКРЫТЬ', 'green', clamp((t - Wd(30, 'невозможно')) / .25), { icon: 'lock', size: 44 });
  } },
  // Никита проверил замок ещё раз.
  { t0: C(31), trans: 'cut', draw(ctx, lt, d, t) {
    const ok = Wd(31, 'раз');
    push(ctx, lt, d, 540, 900, 1.06, 1.0);
    lockClose(ctx, t, { turn: 2, hand: 1, jiggle: sstep(Wd(31, 'проверил') - .1, Wd(31, 'проверил') + .1, t) * (1 - sstep(ok - .25, ok, t)), ok: clamp((t - ok) / .3) });
    plan(ctx, 70, 230, [t > ok + .2, 0, 0, 0], clamp((t - ok) / .3));
  } },
);
