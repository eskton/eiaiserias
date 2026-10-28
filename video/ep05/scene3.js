// Episode 5, scene 3 (1:07–1:39): the windows, the balcony, the curtains, the flat sealed, the way up for the
// zombies, the door that holds, water and food.
'use strict';

SHOTS.push(
  // Потом закрыл все окна.
  { t0: C(32), trans: 'whip', draw(ctx, lt, d, t) {
    const c1 = Wd(32, 'закрыл'), c3 = Wd(32, 'окна'), v = 1 - inout(clamp((t - c1) / .35)), fx = 80 + 172 * (1 - .7 * v);
    push(ctx, lt, d, 320, 900, 1.0, 1.06);
    windowsWall(ctx, t, { chaos: 1, vent: v, lat: clamp((t - c3) / .15), balcony: .6, blat: 0 });
    const p = { face: -1, eyes: 'dot', look: -1, lookY: -.4 };
    p.armR = reach(470, 1900, 1300, p, fx - 10, 800, 1); p.armL = [-.3, -.2];
    guy(ctx, 470, 1900, 1300, p);
  } },
  // Закрыл балкон.
  { t0: C(33), trans: 'cut', draw(ctx, lt, d, t) {
    const c = Wd(33, 'закрыл'), k = inout(clamp((t - c) / .4)), bk = .7 * (1 - k), ex = 580 + 180 * (1 - .55 * bk);
    push(ctx, lt, d, 760, 1000, 1.0, 1.06);
    windowsWall(ctx, t, { chaos: .7, lat: 1, balcony: bk, blat: clamp((t - Wd(33, 'балкон') - .1) / .15) });
    const p = { face: -1, eyes: 'dot', lean: -.08 * (1 - k) };
    p.armR = reach(ex + 235, 1900, 1200, p, ex - 4, 1080, 1); p.armL = [-.2, -.1];
    guy(ctx, ex + 235, 1900, 1200, p);
  } },
  // И задвинул занавески. (the curtains run with the voice's curtain sound, 71.48–72.68)
  { t0: C(34), trans: 'cut', draw(ctx, lt, d, t) {
    const k = .12 * sstep(Wd(34, 'задвинул'), 71.3, t) + .88 * inout(clamp((t - 71.45) / 1.1));
    push(ctx, lt, d, 540, 900, 1.06, 1.0);
    windowsWall(ctx, t, { chaos: .7, lat: 1, blat: 1, curtains: k });
    tint(ctx, '#2a3050', .3 * k, 'multiply');
    sfxWord(ctx, t, 71.5, 'ШУРХ', 540, 560, 84, TSC.w, 1.1);
  } },
  // Теперь его квартира была полностью изолирована.
  { t0: 72.6, trans: 'zoom', draw(ctx, lt, d, t) {
    const z = lerp(1.25, 1.0, inout(clamp(lt / d)));
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    block(ctx, t, { camY: floorY(7) - FH / 2 + 120, chaos: 1, curtains: 1, all: true, glow7: clamp((t - Wd(35, 'полностью')) / .4),
      flat: (x, n, c) => { if (n === 7) flat7(x, t, c, { barricade: 1, who: (x2, fy) => guy(x2, 470, fy, 250, { face: 1, eyes: 'dot' }) }); } });
    ctx.restore();
    pill(ctx, 540, 1520, 'ИЗОЛИРОВАНО', 'green', clamp((t - Wd(35, 'изолирована')) / .25), { icon: 'check', size: 48 });
    plan(ctx, 70, 230, [1, t > Wd(35, 'квартира'), 0, 0], clamp(lt / .4));
  } },
  // Никита понимал одно.
  { t0: C(36), trans: 'cut', draw(ctx, lt, d, t) {
    wallpaper(ctx, 0, 0, W, H, '#b9c4a8', 10);
    push(ctx, lt, d, 540, 900, 1.0, 1.08);
    const g = guy(ctx, 540, 1000 + .84 * 2300, 2300, { face: 0, eyes: 'dot', lookY: -.5, look: .3 });
    const k = clamp((t - Wd(36, 'одно')) / .3);
    if (k > 0) { ctx.save(); ctx.translate(g.head[0] + 300, g.head[1] - g.R - 60); const a = outBack(k); ctx.scale(a, a); glow(ctx, 0, 0, 220, 'rgba(255,220,80,1)', .4); outlined(ctx, '!', 0, 0, 280, TSC.y); ctx.restore(); }
  } },
  // Если заражённые попадут внутрь дома, до него им ещё придётся добраться.
  { t0: C(37), trans: 'whip', draw(ctx, lt, d, t) {
    const inK = Wd(37, 'внутрь'), zk = inout(clamp((t - Wd(37, 'до') + .2) / 1.3)), z = lerp(1.0, .46, zk);
    const camY = lerp(floorY(1) - FH / 2 - 60, floorY(5) - FH / 2, zk), pk = clamp((t - Wd(37, 'до')) / (Wd(37, 'добраться') + .5 - Wd(37, 'до')));
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    block(ctx, t, { camY, chaos: 1, curtains: 1, all: zk > 0, door: clamp((t - inK + .5) / .4), glow7: clamp((t - Wd(37, 'добраться')) / .4),
      flat: (x, n, c) => { if (n === 7) flat7(x, t, c, { barricade: 1, who: (x2, fy) => guy(x2, 470, fy, 250, { face: 1, eyes: 'wide' }) }); },
      over: (x, Y) => {
        // the way up to Nikita: a red dashed line up the stairs to his door on floor 7
        if (pk > 0) {
          x.save(); x.strokeStyle = TSC.r; x.lineWidth = 26; x.lineCap = 'round'; x.lineJoin = 'round'; x.setLineDash([46, 30]); x.lineDashOffset = -t * 120;
          x.beginPath(); const p1 = 7 * pk;
          for (let p = 0; p <= p1; p += .05) { const [px, py] = stairPos(p); p ? x.lineTo(px, Y(py) - 120) : x.moveTo(px, Y(py) - 120); }
          if (p1 >= 7) x.lineTo(760, Y(floorY(7)) - 120);
          x.stroke(); x.restore();
          if (pk >= 1) { x.fillStyle = TSC.r; poly(x, [[700, Y(floorY(7)) - 170], [700, Y(floorY(7)) - 70], [640, Y(floorY(7)) - 120]]); x.fill(); }
        }
        // the zombies come in through the street door and start up the stairs
        for (let i = 0; i < 5; i++) { const p = (t - inK) * .5 - i * .22; if (p < 0) continue; const [zx, zy, f] = stairPos(p); const g = guy(x, zx, Y(zy), 250, zedWalk(t, i, f, .5), ZED); redEyes(x, g, f, 1); }
      } });
    ctx.restore();
    pill(ctx, 540, 300, 'ДО 7 ЭТАЖА', 'yellow', clamp((t - Wd(37, 'придётся')) / .3), { icon: 'up', size: 44 });
  } },
  // Но даже тогда они не смогут просто открыть его дверь.
  { t0: C(38), trans: 'cut', draw(ctx, lt, d, t) {
    const pull = sstep(Wd(38, 'открыть') - .25, Wd(38, 'открыть'), t), hold = Wd(38, 'дверь');
    push(ctx, lt, d, 420, 1000, 1.0, 1.06);
    doorSection(ctx, t, { rattle: pull * (1 - sstep(hold, hold + .5, t)), who: x => {
      const g2 = guy(x, 130, 1720, 980, zedWalk(t, 4, 1, .25), ZED); redEyes(x, g2, 1, .8);
      const p = { face: 1, eyes: 'zed', seed: 2, lean: .1 - pull * .12 * Math.max(0, Math.sin(t * 15)) };
      p.armR = reach(320, 1700, 1050, p, 445, 1112, -1); p.armL = [1.25, -.3];
      const g = guy(x, 320, 1700, 1050, p, ZED); redEyes(x, g, 1, 1);
    } });
    pill(ctx, 790, 260, 'ДВЕРЬ ДЕРЖИТ', 'green', clamp((t - hold) / .25), { icon: 'check', size: 44 });
  } },
  // Никита вернулся на кухню.
  { t0: C(39), trans: 'whip', draw(ctx, lt, d, t) {
    const k = clamp((t - Wd(39, 'вернулся') + .3) / 1.0), x = lerp(1250, 820, outc(k)), walk = k < 1;
    push(ctx, lt, d, 560, 1000, 1.0, 1.05);
    kitchen(ctx, t, { time: 18.5, chaos: 1, curtains: 1 });
    guy(ctx, x, 1900, 1300, walk ? stride(t * 9, -1, .8, { face: -1, eyes: 'dot', idle: false }) : { face: -1, eyes: 'dot', look: -.5 });
    kTable(ctx, t, { bowl: false });
    plan(ctx, 70, 230, [1, 1, 0, 0], 1);
  } },
  // Первым делом он набрал воду.
  { t0: C(40), trans: 'cut', draw(ctx, lt, d, t) {
    const on = sstep(Wd(40, 'набрал') - .15, Wd(40, 'набрал') + .1, t);
    push(ctx, lt, d, 560, 900, 1.0, 1.08);
    sinkClose(ctx, t, { on, fill: clamp((t - Wd(40, 'набрал') - .1) / 2.4) });
    pill(ctx, 540, 250, 'ВОДА', 'blue', clamp((t - Wd(40, 'воду')) / .25), { icon: 'drop', size: 48 });
  } },
  // Заполнил бутылки. Кастрюли. Ванну. Всё, что могло пригодиться.
  { t0: C(41), trans: 'cut', draw(ctx, lt, d, t) {
    const b0 = Wd(41, 'заполнил'), p0 = Wd(42, 'кастрюли'), v0 = Wd(43, 'ванну'), all = Wd(44, 'пригодиться');
    push(ctx, lt, d, 540, 1000, 1.0, 1.05);
    waterStore(ctx, t, { bottles: [0, 1, 2, 3, 4].map(i => (t - b0 + .3 - i * .16) / 1.0), pots: [0, 1].map(i => (t - p0 - i * .15) / .8), bath: (t - v0) / 1.2 });
    meter(ctx, 110, 220, 560, 'ВОДА', clamp((t - b0 + .3) / (all + .3 - b0)), '#3f8fd8', clamp(lt / .3));
    pill(ctx, 540, 320, 'ЗАПАС ВОДЫ', 'green', clamp((t - all) / .25), { icon: 'check', size: 40 });
  } },
  // Потом собрал еду. Консервы. Крупы. Сухие продукты. Всё, что может храниться долго.
  { t0: C(45), trans: 'whip', draw(ctx, lt, d, t) {
    const long = Wd(49, 'долго');
    push(ctx, lt, d, 540, 900, 1.0, 1.06);
    pantry(ctx, t, { box: (t - Wd(45, 'собрал')) / .35, cans: (t - Wd(46, 'консервы')) / .7, grain: (t - Wd(47, 'крупы')) / .5, dry: (t - Wd(48, 'сухие')) / .8 });
    pill(ctx, 660, 300, 'НАДОЛГО', 'green', clamp((t - long) / .25), { icon: 'check', size: 44 });
    plan(ctx, 70, 230, [1, 1, 1, t > long + .2], clamp(lt / .3));
  } },
);
