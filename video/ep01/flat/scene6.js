// Episode 1, vertical flat cut — scene 6 (5:14.4–end): the photograph from the laboratory, and an end card.
'use strict';

const LAB = LOOK.lab, ILYA_THEN = Object.assign({}, LOOK.lab, { skin: '#dcb39a', hair: '#1c1a19' });

// The old photograph: five people in white coats, Ilya in the middle.
function photo(ctx, t, x, y, s = 1, rot = -.04) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(-372, -262, 760, 540);
  ctx.fillStyle = '#eee6d4'; ctx.fillRect(-380, -270, 760, 540);
  ctx.save(); ctx.beginPath(); ctx.rect(-350, -240, 700, 440); ctx.clip();
  vgrad(ctx, -350, -240, 700, 440, [[0, '#a9b3ab'], [1, '#8e978f']]);
  ctx.fillStyle = '#7d877f'; ctx.fillRect(-350, 120, 700, 80);
  ctx.fillStyle = '#c9cfc9'; ctx.fillRect(-320, -200, 160, 120); ctx.fillStyle = '#5d6b70'; ctx.fillRect(-310, -190, 140, 100);
  ctx.fillStyle = '#6a746c'; ctx.fillRect(120, -190, 200, 12); ctx.fillRect(120, -120, 200, 12);
  for (let k = 0; k < 5; k++) { ctx.fillStyle = ['#86a9c4', '#c4a986', '#9cc486'][k % 3]; rrect(ctx, 130 + k * 38, -170, 24, 50, 6); ctx.fill(); }
  [[-250, LAB], [-125, Object.assign({}, LAB, { skin: '#d0a48c', hair: '#6a5240' })], [0, ILYA_THEN], [125, Object.assign({}, LAB, { long: 1, hair: '#4a3020' })], [250, Object.assign({}, LAB, { bald: .5, hair: '#9a9a96' })]]
    .forEach(([px, lk]) => toon(ctx, px, 200, 340, { eyes: 'dot', mouth: px === 0 ? .25 : .05 }, lk));
  ctx.restore();
  ctx.restore();
}
function sepia(ctx, k = .5) { tint(ctx, '#808080', .6 * k, 'saturation'); tint(ctx, '#d9b98a', .35 * k, 'multiply'); }

// A column of smoke rising from (x, y) and bending in the wind.
function smoke(ctx, t, x, y, { n = 24, hgt = 700, wind = .5, seed = 1, color = '50,52,58', a = .25 } = {}) {
  for (let i = 0; i < n; i++) {
    const ph = (t * .03 + i / n) % 1, r = 30 + ph * 240;
    const px = x + Math.pow(ph, 1.5) * hgt * wind + Math.sin(t * .4 + i * 1.7 + seed) * 18 * ph, py = y - ph * hgt;
    glow(ctx, px, py, r, `rgba(${color},1)`, a * Math.sin(Math.PI * Math.min(1, ph * 1.25)), 'source-over');
  }
}

// The city at dawn, as in scene 1, for Ilya to look at.
function cityscape(ctx, t, top = 0) {
  vgrad(ctx, 0, 0, W, H, [[0, '#060a12'], [.5, '#121b2c'], [.7, '#2c3448'], [1, '#0d111a']]);
  const r = rng(21);
  for (let layer = 0; layer < 3; layer++) {
    let x = -40;
    while (x < W) {
      const bw = 90 + r() * 150, bh = [620, 460, 300][layer] + r() * [420, 300, 200][layer], tp = [1300, 1450, 1600][layer] - bh + top;
      ctx.fillStyle = ['#1a2232', '#121826', '#0b0f18'][layer]; ctx.fillRect(x, tp, bw, H);
      for (let wy = tp + 30; wy < H; wy += 44) for (let wx = x + 16; wx < x + bw - 20; wx += 34) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(wx, wy, 16, 22);
        if (r() < .008) { ctx.fillStyle = PAL.winWarm; ctx.fillRect(wx, wy, 16, 22); }
      }
      x += bw + r() * 30;
    }
  }
  for (const [fx, fy] of [[260, 1150], [820, 1250]]) smoke(ctx, t, fx, fy, { n: 24, hgt: 700, color: '50,52,58', a: .25 });
}

SHOTS.push(
  // Мы выбежали из магазина.
  { t0: 314.435, fadeIn: .25, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1, 1.04);
    street(ctx, t, lt * 420);
    const run = (x, lk, sc, ph, ex = {}) => toon(ctx, x, 1100, 520 * sc, walkPose(t * 11 + ph, 1, 1.35, Object.assign({ face: 1, lean: .18 }, ex)), lk);
    run(850, LOOK.hero, 1, 0); run(610, VERA, 1, 1.2); run(500, BOY, .66, 2.3); run(250, ILYA, 1, 3.1, { eyes: 'red' });
    tag(ctx, 90, 240, 'БЕГОМ', appear(lt, .15), PAL.yellow);
    specks(ctx, t, 40, 81); vignette(ctx);
  } },
  // На улице Вера наконец остановилась.
  { t0: C(202), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1, 1.05);
    const slow = 1 - outc(lt / 1.2);
    street(ctx, t, 40 + slow * lt * 300);
    toon(ctx, 560, 1100, 560, slow > .05 ? walkPose(t * 9, 1, slow, { face: 1 }) : { face: 1, eyes: 'dot', lean: -.05 }, VERA);
    tag(ctx, 90, 240, 'ОСТАНОВИЛАСЬ', appear(lt, .8));
    specks(ctx, t, 40, 82); vignette(ctx);
  } },
  // Она достала из кармана старую фотографию.
  { t0: C(203), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a2130'], [1, '#0e121a']]);
    const out = outc(lt / 1.4);
    photo(ctx, t, 540, lerp(1500, 840, out), lerp(.5, .95, out), lerp(.3, -.05, out));
    for (const k of [-1, 1]) { ctx.fillStyle = VERA.skin; ctx.save(); ctx.translate(540 + k * 340, lerp(1700, 1080, out)); ctx.rotate(k * .4); rrect(ctx, -60, -50, 120, 150, 50); ctx.fill(); ctx.fillStyle = VERA.top; rrect(ctx, -70, 90, 140, 600, 50); ctx.fill(); ctx.restore(); }
    tag(ctx, 90, 240, 'СТАРОЕ ФОТО', appear(lt, .3));
    specks(ctx, t, 30, 83); vignette(ctx);
  } },
  // На ней были люди в медицинских халатах.
  { t0: C(204), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 840, 1.3, 1.38);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a2130'], [1, '#0e121a']]);
    photo(ctx, t, 540, 840, .95, -.05);
    sepia(ctx, .7);
    tag(ctx, 90, 240, 'МЕДИЦИНСКИЕ ХАЛАТЫ', appear(lt, .2));
    specks(ctx, t, 30, 84); vignette(ctx);
  } },
  // В центре стоял Илья.
  { t0: C(205), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 540, 760, 2.4, 2.6, 760);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a2130'], [1, '#0e121a']]);
    photo(ctx, t, 540, 840, .95, -.05);
    sepia(ctx, .7);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = PAL.red; ctx.lineWidth = 8; ctx.globalAlpha = appear(lt, .3);
    ell(ctx, 545, 700, 230 * (1 + .1 * (1 - outc((lt - .3) / .4))), 300, -.05); ctx.stroke(); ctx.restore();
    tag(ctx, 90, 140, 'ИЛЬЯ', appear(lt, .4), PAL.yellow, 'ДО ЗАРАЖЕНИЯ');
  } },
  // Я посмотрел на неё. Кто это?
  { t0: C(206), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a1f27'], [1, '#0e1116']]);
    if (t < S(207) - .1) { portrait(ctx, 540, 700, 860, { eyes: 'down' }, VERA); }
    else { portrait(ctx, 540, 700, 860, { eyes: 'wide', brow: .6, mouth: talk(t, 207, .7) }, LOOK.hero); headline(ctx, '«КТО ЭТО?»', appear(t, S(207) - .1), 'w', 200, null, 110); }
  } },
  // Она ответила: Лаборатория.
  { t0: C(208), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 840, 1.1, 1.16);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a2130'], [1, '#0e121a']]);
    photo(ctx, t, 540, 860, .95, -.05);
    sepia(ctx, .7);
    if (t > S(209) - .1) headline(ctx, '«ЛАБОРАТОРИЯ»', appear(t, S(209) - .1), 'y', 260, null, 104);
    else tag(ctx, 90, 240, 'ВЕРА', appear(lt, .2), PAL.yellow);
  } },
  // Я спросил: Вы знали его раньше?
  { t0: C(210), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a1f27'], [1, '#0e1116']]);
    portrait(ctx, 540, 700, 860, { eyes: 'dot', brow: .6, mouth: talk(t, 211, .7) }, LOOK.hero);
    if (t > S(211) - .1) headline(ctx, '«ВЫ ЗНАЛИ ЕГО РАНЬШЕ?»', appear(t, S(211) - .1), 'w', 200, null, 80);
  } },
  // Она долго молчала. Потом сказала: Он был одним из первых.
  { t0: C(212), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.07);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a1f27'], [1, '#0e1116']]);
    portrait(ctx, 540, 700, 860, { eyes: t < S(214) ? 'down' : 'dot', mouth: talk(t, 214) }, VERA);
    if (t < S(213)) tag(ctx, 90, 140, 'ДОЛГО МОЛЧИТ', appear(lt, .2));
    if (t > S(214) - .1) { headline(ctx, '«ОН БЫЛ ОДНИМ', appear(t, S(214) - .1), 'y', 170, null, 84); headline(ctx, 'ИЗ ПЕРВЫХ»', appear(t, S(214) - .1), 'r', 270, null, 84); }
  } },
  // Я посмотрел на Илью. Он стоял у стены. И смотрел на город.
  { t0: C(215), draw(ctx, lt, d, t) {
    const wide = sstep(S(217) - .2, S(217) + .8, t);
    cam(ctx, lt, d, 540, lerp(1350, 1150, wide), lerp(1.35, 1.0, wide), lerp(1.35, 1.0, wide), 960);
    cityscape(ctx, t, 120);
    ctx.fillStyle = '#20242c'; ctx.fillRect(0, 1560, W, 400); ctx.fillStyle = '#2c313a'; ctx.fillRect(0, 1560, W, 18);
    toon(ctx, 600, 1600, 520, { back: 1, armL: [-.08, 0], armR: [.08, 0] }, Object.assign({}, ILYA, { blood: 0, veins: 0 }));
    tag(ctx, 90, 240, t > S(217) ? 'СМОТРИТ НА ГОРОД' : t > S(216) ? 'У СТЕНЫ' : 'ИЛЬЯ', 1, PAL.yellow);
    specks(ctx, t, 40, 85); vignette(ctx);
  } },
  // Вера продолжила: Он не случайно сохранил память.
  { t0: C(218), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a1f27'], [1, '#0e1116']]);
    portrait(ctx, 540, 700, 860, { eyes: 'dot', brow: -.3, mouth: talk(t, 219) }, VERA);
    if (t > S(219) - .1) { headline(ctx, '«ОН НЕ СЛУЧАЙНО', appear(t, S(219) - .1), 'y', 170, null, 82); headline(ctx, 'СОХРАНИЛ ПАМЯТЬ»', appear(t, S(219) - .1), 'y', 270, null, 82); }
  } },
  // Я спросил: Почему?
  { t0: C(220), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a1f27'], [1, '#0e1116']]);
    portrait(ctx, 540, 700, 860, { eyes: 'wide', brow: 1, mouth: talk(t, 221, .8) }, LOOK.hero);
    if (t > S(221) - .1) headline(ctx, '«ПОЧЕМУ?»', appear(t, S(221) - .1), 'w', 200, null, 120);
  } },
  // Она посмотрела мне прямо в глаза.
  { t0: C(222), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 540, 720, 1.0, 1.35, 880);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a1f27'], [1, '#0e1116']]);
    portrait(ctx, 540, 700, 860, { eyes: 'wide', brow: -.6 }, VERA);
    vignette(ctx, .6);
  } },
  // End card.
  { t0: 350.4, xfade: .6, draw(ctx, lt, d, t) {
    ctx.fillStyle = '#05060a'; ctx.fillRect(0, 0, W, H);
    glow(ctx, 540, 860, 600, 'rgba(245,200,76,1)', .1 * appear(lt, .3, 1e9, .8));
    headline(ctx, 'ПОМНЯЩИЕ', appear(lt, .3, 1e9, .6), 'y', 860, 'ПРОДОЛЖЕНИЕ СЛЕДУЕТ', 150);
    specks(ctx, t, 40, 86, .25);
  } },
);
