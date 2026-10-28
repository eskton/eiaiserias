// Episode 5, scene 2 (0:33–1:07): the broadcast, the line goes dead, the door and the windows, the plan, the lock,
// the wardrobe, the table and the pile, the barricade holds, the lock checked again.
'use strict';

// Nikita pushing something along the floor to the left, his hands on its right edge at height hy.
function pushing(ctx, t, edge, hy, moving, extra = {}) {
  const fx = edge + 175, p = stride(moving ? t * 7 : 0, -1, .55, Object.assign({ face: -1, eyes: moving ? 'closed' : 'dot', lean: -.2, idle: false, mouth: .1 }, extra));
  p.armR = guyReach(fx, FEET, HN, p, edge + 4, hy, 1); p.armL = guyReach(fx, FEET, HN, p, edge + 4, hy - 40, 1);
  guy(ctx, fx, FEET, HN, p);
}

SHOTS.push(
  // Зафиксирована массовая вспышка неизвестного вируса.
  { t0: C(17), trans: 'cut', draw(ctx, lt, d, t) {
    const fl = pulse(t, [[Wd(17, 'вспышка'), 1]], 4);
    push(ctx, lt, d, 640, 900, 1.0, 1.08);
    outbreakMap(ctx, t, inout(clamp((t - Wd(17, 'массовая')) / 2.4)) * .95, clamp((t - C(17) - .2) / .3));
    tint(ctx, '#ff3030', .12 * fl, 'screen');
    pill(ctx, 540, 260, 'ВСПЫШКА', 'red', clamp((t - Wd(17, 'вспышка')) / .25), { icon: 'warn', size: 48 });
    pill(ctx, 540, 1520, 'НЕИЗВЕСТНЫЙ ВИРУС', 'red', clamp((t - Wd(17, 'неизвестного')) / .25), { icon: 'bio', size: 44 });
  } },
  // Не покидайте свои дома. Избегайте любого контакта с заражёнными. Закройте окна и двери.
  { t0: C(18), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1.0, 1.04);
    ctx.save(); ctx.translate(0, 760); radio(ctx, t, { on: 1, speak: MOUTH(t), red: 1, needle: .55 }); ctx.restore();
    const r18 = Wd(18, 'не'), r19 = Wd(19, 'избегайте'), r20 = Wd(20, 'закройте');
    alertCard(ctx, t, [['house', 'НЕ ВЫХОДИТЬ ИЗ ДОМА', (t - r18) / .35], ['hand', 'НЕ ПОДХОДИТЬ\nК ЗАРАЖЁННЫМ', (t - r19) / .35], ['window', 'ЗАКРЫТЬ ОКНА\nИ ДВЕРИ', (t - r20) / .35]], t > r20 ? 2 : t > r19 ? 1 : 0);
  } },
  // Связь оборвалась.
  { t0: C(21), trans: 'cut', draw(ctx, lt, d, t) {
    const cut = Wd(21, 'оборвалась') + .15, dead = t > cut, lit = dead ? 0 : t > cut - .3 ? (Math.sin(t * 40) > 0 ? 1 : 0) : 1;
    push(ctx, lt, d, 600, 760, 1.06, 1.0);
    radio(ctx, t, { on: lit, stat: dead ? 0 : 1, needle: .55, red: !dead });
    if (!dead) { const r = rng(Math.floor(t * 12)); ctx.globalAlpha = .1; for (let i = 0; i < 700; i++) { const v = r() * 255 | 0; ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fillRect(r() * W, r() * H, 8, 3); } ctx.globalAlpha = 1; }
    else tint(ctx, '#202838', .3 * clamp((t - cut) / .4), 'multiply');
    pill(ctx, 540, 260, 'НЕТ СИГНАЛА', 'red', clamp((t - cut) / .25), { icon: 'cross', size: 48 });
  } },
  // Никита посмотрел на входную дверь.
  { t0: C(22), trans: 'cut', draw(ctx, lt, d, t) {
    const turn = sstep(Wd(22, 'посмотрел') - .1, Wd(22, 'посмотрел') + .2, t);
    push(ctx, lt, d, 560, 1050, 1.0, 1.06);
    hallway(ctx, t, { ring: clamp((t - Wd(22, 'дверь')) / .3) });
    guy(ctx, 860, FEET, HN, { face: turn > .5 ? -1 : 0, eyes: 'wide', look: turn > .5 ? -1 : 0, lookY: -.1 });
  } },
  // Потом на окна.
  { t0: C(23), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1.0, 1.05);
    windowsWall(ctx, t, { chaos: 1, vent: 1, balcony: .6, lat: 0, curtains: 0 });
    dashRing(ctx, t, WIN.x - 30, WIN.y - 30, WIN.w + 60, WIN.h + 60, clamp((t - Wd(23, 'на')) / .3));
    dashRing(ctx, t, BAL.x - 20, WIN.y - 30, BAL.w + 40, FLOOR - WIN.y + 50, clamp((t - Wd(23, 'окна')) / .3));
  } },
  // И понял, что времени почти нет.
  { t0: C(24), trans: 'cut', draw(ctx, lt, d, t) {
    const beat = pulse(t, [0, 1, 2, 3, 4, 5].map(i => [C(24) + i * .42, 1]), 7);
    push(ctx, lt, d, 760, 1000, 1.14 + .006 * beat, 1.2 + .006 * beat);
    hallway(ctx, t, {});
    const g = guy(ctx, 820, FEET, HN, { face: 0, eyes: 'wide', mouth: .15, look: Math.sin(t * 5) * .6 });
    const sw = (lt * .4) % 1; ctx.save(); ctx.globalAlpha = 1 - sw; icon2(ctx, 'drop', g.head[0] + g.R * .8, g.head[1] - g.R * .3 + sw * 70, 34, '#8fc6ff'); ctx.restore();
    const v = lerp(.5, .06, clamp((t - Wd(24, 'времени')) / (E(24) - Wd(24, 'времени'))));
    meter(ctx, 110, 300, 560, 'ВРЕМЯ', v, '#d7342c', clamp(lt / .3));
  } },
  // Он начал действовать.
  { t0: C(25), trans: 'cut', draw(ctx, lt, d, t) {
    const go = Wd(25, 'действовать'), up = outBack(clamp((t - go) / .3)), nod = Math.exp(-Math.max(0, t - Wd(25, 'начал')) * 4) * Math.sin(Math.max(0, t - Wd(25, 'начал')) * 14) * .012;
    push(ctx, lt, d, 760, 1000, 1.08, 1.14);
    hallway(ctx, t, {});
    guy(ctx, 820, FEET, HN, { face: 0, eyes: 'dot', head: [0, nod], armR: [lerp(.06, 2.85, up), lerp(0, -.6, up)], armL: [-.06, 0] });
    pill(ctx, 70, 300, 'ПЛАН', 'yellow', clamp((t - Wd(25, 'начал')) / .3), { align: 'left', size: 44 });
    plan(ctx, 70, 400, [0, 0, 0, 0], clamp((t - Wd(25, 'начал') - .15) / .5), 84, 38);
  } },
  // Сначала запер входную дверь. (the voice's lock click is at 55.625)
  { t0: C(26), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(26, 'запер'), turn = sstep(a, 55.6, t), [lx, ly] = DOOR.lock, p = { face: -1, eyes: 'dot', look: -.2, lookY: .1 };
    push(ctx, lt, d, 640, 1030, 1.28, 1.34);
    hallway(ctx, t, { lockK: turn, lockRing: clamp((t - a) / .3) * (1 - clamp((t - 55.9) / .3)) });
    p.armR = guyReach(735, FEET, HN, p, lx + 8, ly + 6, 1);
    guy(ctx, 735, FEET, HN, p);
    sfxWord(ctx, t, 55.625, 'ЩЁЛК', 690, 850, 70, TSC.y, 1.0);
    pill(ctx, 540, 330, 'ЗАПЕРТО', 'green', clamp((t - 55.625) / .25), { icon: 'lock', size: 44 });
  } },
  // Потом подтащил к ней тяжёлый шкаф.
  { t0: C(27), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(27, 'подтащил') - .1, b = Wd(27, 'шкаф') + .15, k = inout(clamp((t - a) / (b - a))), bx = lerp(760, 350, k), moving = k > 0 && k < 1;
    const [sx, sy] = shake(t, [[b, .6]], 7);
    ctx.save(); ctx.translate(sx, sy);
    push(ctx, lt, d, 640, 1100, .92, .95);
    hallway(ctx, t, { lockK: 1, wardrobe: (1150 - bx) / 800 });
    pushing(ctx, t, bx + 300, 1150, moving);
    if (moving) for (let i = 0; i < 4; i++) { const u = (t * 2 + i / 4) % 1; ctx.fillStyle = `rgba(200,190,170,${.45 * (1 - u)})`; ell(ctx, bx + 40 + i * 75, 1522 - u * 40, 22 + u * 30, 12 + u * 14); ctx.fill(); }
    ctx.restore();
    pill(ctx, 540, 300, 'ТЯЖЁЛЫЙ ШКАФ', 'yellow', clamp((t - Wd(27, 'тяжёлый')) / .25), { size: 44 });
  } },
  // Придвинул стол.
  { t0: C(28), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(28, 'придвинул') - .05, b = Wd(28, 'стол') + .2, k = inout(clamp((t - a) / (b - a))), tx = lerp(860, 330, k);
    const [sx, sy] = shake(t, [[b, .5]], 6);
    ctx.save(); ctx.translate(sx, sy);
    push(ctx, lt, d, 640, 1100, .92, .95);
    hallway(ctx, t, { lockK: 1, wardrobe: 1, table: (1200 - tx) / 870 });
    pushing(ctx, t, tx + 340, 1290, k > 0 && k < 1, { crouch: .25 });
    ctx.restore();
  } },
  // Сверху поставил ещё несколько тяжёлых предметов.
  { t0: C(29), trans: 'cut', draw(ctx, lt, d, t) {
    const drops = [Wd(29, 'сверху'), Wd(29, 'поставил'), Wd(29, 'несколько'), Wd(29, 'тяжёлых'), Wd(29, 'предметов')];
    const [sx, sy] = shake(t, drops.map(x => [x + .22, .5]), 6);
    ctx.save(); ctx.translate(sx, sy);
    push(ctx, lt, d, 520, 1120, 1.2, 1.25);
    hallway(ctx, t, { lockK: 1, wardrobe: 1, table: 1, items: drops.map(x => t >= x ? t - x : null) });
    ctx.restore();
    pill(ctx, 540, 300, 'ГИРЯ 32 КГ', 'dark', clamp((t - drops[2] - .25) / .25), { size: 40 });
  } },
  // Теперь дверь было практически невозможно открыть снаружи.
  { t0: C(30), trans: 'cut', draw(ctx, lt, d, t) {
    const a = Wd(30, 'практически'), b = Wd(30, 'невозможно') + .4, m = lerp(.15, .97, inout(clamp((t - a) / (b - a))));
    push(ctx, lt, d, 520, 1050, 1.0, 1.05);
    doorSection(ctx, t, { meter: m });
    // an arrow pushing at the door from the landing, crossed out
    const ak = clamp((t - Wd(30, 'открыть')) / .3), no = clamp((t - Wd(30, 'снаружи')) / .25);
    if (ak > 0) { ctx.save(); ctx.globalAlpha = clamp(ak * 2); const x1 = lerp(120, 400, outc(ak)); ctx.fillStyle = '#fff'; ctx.fillRect(60, 1092, x1 - 60, 36); poly(ctx, [[x1, 1060], [x1 + 60, 1110], [x1, 1160]]); ctx.fill(); ctx.restore(); }
    if (no > 0) { ctx.save(); ctx.translate(290, 1110); const s = outBack(no); ctx.scale(s, s); ctx.fillStyle = TSC.r; ell(ctx, 0, 0, 62, 62); ctx.fill(); icon2(ctx, 'cross', 0, 0, 80, '#fff'); ctx.restore(); }
    pill(ctx, 780, 1560, 'НЕ ОТКРЫТЬ', 'green', clamp((t - Wd(30, 'невозможно')) / .25), { icon: 'lock', size: 44 });
  } },
  // Никита проверил замок ещё раз.
  { t0: C(31), trans: 'cut', draw(ctx, lt, d, t) {
    const ok = Wd(31, 'раз');
    push(ctx, lt, d, 540, 900, 1.05, 1.0);
    lockClose(ctx, t, { turn: 2, jiggle: sstep(Wd(31, 'проверил') - .1, Wd(31, 'проверил') + .1, t) * (1 - sstep(ok - .25, ok, t)), ok: clamp((t - ok) / .3) });
    plan(ctx, 70, 230, [t > ok + .2, 0, 0, 0], clamp((t - ok) / .3));
  } },
);
