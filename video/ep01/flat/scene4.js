// Episode 1, vertical flat cut — scene 4 (2:49.2–4:27.2): the technical room, Vera, the boy, "the remembering".
'use strict';

const VERA = LOOK.vera, BOY = LOOK.boy;
const talk = (t, n, k = .9) => (t > S(n) && t < E(n) + .1 ? MOUTH(t) * k : 0);
const bgDark = ctx => vgrad(ctx, 0, 0, W, H, [[0, '#101415'], [1, '#090b0c']]);
function bgWarm(ctx, t) {
  vgrad(ctx, 0, 0, W, H, [[0, '#271d16'], [1, '#140e0a']]);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ctx, 260, 1500, 1100, 'rgba(255,160,70,1)', .16 * flicker(t, .2, 5, 4)); ctx.restore();
}
// warm lantern light from below-left on a close-up
function lanternLight(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  glow(ctx, 250, 1400, 1000, 'rgba(255,150,60,1)', .12 * flicker(t, .25, 5, 9)); ctx.restore();
}

function metalDoor(ctx, t, open = 0, warm = 0) {
  vgrad(ctx, 0, 0, W, H, [[0, '#1b2124'], [1, '#111517']]);
  ctx.fillStyle = '#3f4b44'; ctx.fillRect(240, 330, 600, 1100);
  ctx.fillStyle = '#070605'; ctx.fillRect(270, 360, 540, 1070);
  if (open > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(270, 360, 540, 1070); ctx.clip();
    vgrad(ctx, 270, 360, 540, 1070, [[0, '#3a2a1c'], [1, '#5a3e24']]);
    ctx.globalCompositeOperation = 'lighter'; glow(ctx, 540, 1100, 600, 'rgba(255,170,80,1)', .45 * open * flicker(t, .2, 5, 1)); ctx.restore();
  }
  const dw = 540 * (1 - .82 * open);
  ctx.fillStyle = '#4b5a50'; ctx.fillRect(270, 360, dw, 1070);
  ctx.fillStyle = '#6b746d'; for (let k = 0; k < 7; k++) { ell(ctx, 270 + 30 * (dw / 540), 400 + k * 150, 8, 8); ctx.fill(); ell(ctx, 270 + dw - 30 * (dw / 540), 400 + k * 150, 8, 8); ctx.fill(); }
  if (open < .05) { ctx.fillStyle = '#c9cbd0'; rrect(ctx, 700, 880, 70, 16, 8); ctx.fill(); }
  if (warm > 0 || open > 0) { ctx.fillStyle = `rgba(255,190,110,${.85})`; ctx.fillRect(270, 1426, 540, 6); floorGlow(ctx, 540, 1436, 560 + 300 * open, .9 + open, 'rgba(255,190,110,1)'); }
}

// The small technical room, lit by a camping lantern. who: which of the four are lit/visible.
const SEATS = { man1: [170, 1050, 500, 1], man2: [350, 1060, 480, 1], vera: [740, 1050, 500, -1], boy: [900, 1060, 330, -1] };
function techRoom(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, 1060, [[0, '#1d1814'], [1, '#2c241d']]);
  vgrad(ctx, 0, 1060, W, H - 1060, [[0, '#1b1612'], [1, '#0d0a08']]);
  ctx.fillStyle = '#3a3936'; ctx.fillRect(0, 220, W, 34); ctx.fillStyle = '#2f2f2c'; ctx.fillRect(0, 286, W, 18);
  ctx.fillStyle = '#34332f'; ctx.fillRect(120, 254, 28, 810); ctx.fillRect(960, 304, 24, 760);
  for (const [vx, vy] of [[134, 520], [972, 600]]) { ctx.strokeStyle = '#8a2a22'; ctx.lineWidth = 8; ell(ctx, vx, vy, 34, 34); ctx.stroke(); ctx.beginPath(); ctx.moveTo(vx - 34, vy); ctx.lineTo(vx + 34, vy); ctx.moveTo(vx, vy - 34); ctx.lineTo(vx, vy + 34); ctx.stroke(); }
  ctx.fillStyle = '#454440'; rrect(ctx, 790, 380, 230, 560, 110); ctx.fill(); ctx.fillStyle = '#3a3935'; ctx.fillRect(905, 380, 115, 560);
  ctx.fillStyle = '#d9d4c8'; ell(ctx, 860, 520, 34, 34); ctx.fill(); ctx.strokeStyle = PAL.red; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(860, 520); ctx.lineTo(880, 500); ctx.stroke();
  ctx.fillStyle = '#2a221b'; ctx.fillRect(200, 430, 300, 14); ctx.fillRect(200, 560, 300, 14);
  for (let k = 0; k < 5; k++) { ctx.fillStyle = k % 2 ? 'rgba(160,130,80,0.6)' : 'rgba(120,140,110,0.6)'; rrect(ctx, 215 + k * 56, 380, 40, 50, 8); ctx.fill(); rrect(ctx, 222 + k * 56, 512, 34, 48, 8); ctx.fill(); }
  // crates and the lantern
  const crate = (x, y, w, h) => { ctx.fillStyle = '#6b4a2e'; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#5a3d25'; ctx.fillRect(x, y + h * .45, w, 8); ctx.fillRect(x + w * .48, y, 8, h); };
  for (const k of ['man1', 'man2', 'vera', 'boy']) { const [x, y, h] = SEATS[k]; if (o.hide !== k && o.hide !== 'all' && o.seated !== false) crate(x - h * .14, y - h * .27, h * .28, h * .27); }
  crate(470, 900, 140, 150);
  ctx.fillStyle = '#2a2b2e'; rrect(ctx, 505, 790, 70, 110, 14); ctx.fill();
  ctx.fillStyle = '#ffd38a'; rrect(ctx, 515, 805, 50, 75, 10); ctx.fill();
  ctx.strokeStyle = '#2a2b2e'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(540, 790, 26, Math.PI, 0); ctx.stroke();
  // the four of them
  const lit = o.lit || null, pose = o.pose || {};
  for (const [k, look] of [['man1', LOOK.man1], ['man2', LOOK.man2], ['vera', VERA], ['boy', BOY]]) {
    if (o.hide === k || o.hide === 'all') continue;
    const [x, y, h, f] = SEATS[k];
    toon(ctx, x, y, h, Object.assign({ sit: o.seated === false ? 0 : 1, face: f, eyes: 'dot', armL: [f * .5, -f * .3], armR: [f * .7, -f * .5] }, pose[k] || {}), look);
  }
  if (o.extra) o.extra(ctx);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const f = flicker(t, .18, 5, 2); glow(ctx, 540, 850, 900, 'rgba(255,160,70,1)', .28 * f); glow(ctx, 540, 840, 160, 'rgba(255,220,150,1)', .7 * f);
  ctx.restore();
  if (lit) {
    // dim everyone but the one being named
    const [x, y, h] = SEATS[lit], m = ctx.getTransform(), q = m.transformPoint(new DOMPoint(x, y - h * .5));
    torchDark(ctx, q.x, q.y, h * .9 * m.a, .5);
  }
}

// Three kinds of the infected in a row; k highlights one of them.
function kinds(ctx, t, k) {
  vgrad(ctx, 0, 0, W, H, [[0, '#2a0c0e'], [1, '#12070a']]);
  const xs = [220, 540, 860], labels = ['СРАЗУ', 'ЧАСЫ', 'ДНИ'];
  xs.forEach((x, i) => {
    const on = i === k, lk = Object.assign({}, LOOK.infected, i === 2 ? { blood: 1, veins: 1, skin: '#b9b8ad' } : { blood: 1 });
    ctx.save(); ctx.globalAlpha = on ? 1 : .35;
    toon(ctx, x, 1050, 520, { eyes: 'red', lean: [.0, .2, .35][2 - i] * (i === 0 ? 1 : .5), head: [0, i === 0 ? .06 : 0], armL: [i === 0 ? .4 : -.05, i === 0 ? .4 : 0], armR: [i === 0 ? -.3 : .05, 0], mouth: i === 0 ? .8 : .1 }, lk);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = on ? 1 : .4; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.fillStyle = on ? PAL.yellow : '#fff'; ctx.fillText(labels[i], x, 1130); ctx.restore();
  });
}

SHOTS.push(
  // Мы открыли дверь.
  { t0: 169.23, fadeIn: .3, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.06);
    metalDoor(ctx, t, outc((lt - .15) / .8), 1);
    specks(ctx, t, 40, 61); vignette(ctx);
  } },
  // За ней находилась маленькая техническая комната.
  { t0: C(111), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.08, 1.0);
    techRoom(ctx, t, { hide: 'all', seated: false, extra: null, lit: null, pose: {} });
    tag(ctx, 90, 140, 'ТЕХНИЧЕСКАЯ КОМНАТА', appear(lt, .2));
    specks(ctx, t, 40, 62); vignette(ctx);
  } },
  // Там сидели четыре человека.
  { t0: C(112), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1, 1.05);
    techRoom(ctx, t);
    headline(ctx, '4 ЧЕЛОВЕКА', appear(lt, .15), 'y', 180, null, 90);
    specks(ctx, t, 40, 63); vignette(ctx);
  } },
  // Двое мужчин.
  { t0: C(113), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 290, 820, 1.5, 1.6, 820);
    techRoom(ctx, t, { lit: 'man1' });
    tag(ctx, 90, 140, 'ДВОЕ МУЖЧИН', appear(lt, .15));
    vignette(ctx);
  } },
  // Женщина.
  { t0: C(114), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 720, 800, 1.7, 1.8, 820);
    techRoom(ctx, t, { lit: 'vera' });
    tag(ctx, 90, 140, 'ЖЕНЩИНА', appear(lt, .15));
    vignette(ctx);
  } },
  // И маленький мальчик.
  { t0: C(115), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 860, 900, 2.0, 2.1, 820);
    techRoom(ctx, t, { lit: 'boy' });
    tag(ctx, 90, 140, 'МАЛЬЧИК', appear(lt, .15));
    vignette(ctx);
  } },
  // Все выглядели измученными. Но живыми.
  { t0: C(116), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.02, 1.08);
    techRoom(ctx, t, { pose: { man1: { eyes: 'down' }, man2: { eyes: 'closed' }, vera: { eyes: 'down' }, boy: { eyes: 'down' } } });
    tag(ctx, 90, 140, t > S(117) ? 'НО ЖИВЫ' : 'ИЗМУЧЕНЫ', 1, t > S(117) ? PAL.yellow : '#fff');
    vignette(ctx);
  } },
  // Женщина сразу подняла оружие.
  { t0: C(118), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 600, 760, 1.1, 1.18);
    const up = outc(lt / .6);
    techRoom(ctx, t, { hide: 'vera', extra: x => toon(x, 720, 1050, 520, { face: -1, eyes: 'wide', armL: [lerp(-.2, -1.5, up), 0], armR: [lerp(.1, -1.35, up), -.1], props: { gun: 'L', gunDir: lerp(-.3, -1.57, up) } }, VERA) });
    tag(ctx, 90, 140, 'ОРУЖИЕ', appear(lt, .2), PAL.red);
    vignette(ctx);
  } },
  // Не подходи.
  { t0: C(119), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'wide', brow: -1, mouth: talk(t, 119) }, VERA);
    lanternLight(ctx, t);
    headline(ctx, '«НЕ ПОДХОДИ»', appear(t, S(119) - .1), 'y', 200, null, 100);
  } },
  // Я поднял руки. Я один.
  { t0: C(120), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1, 1.05);
    bgWarm(ctx, t);
    const up = outc(lt / .5);
    toon(ctx, 540, 1800, 1400, { eyes: 'wide', armL: [lerp(-.1, -2.7, up), lerp(0, .5, up)], armR: [lerp(.1, 2.7, up), lerp(0, -.5, up)], mouth: talk(t, 121) });
    lanternLight(ctx, t);
    if (t > S(121) - .1) headline(ctx, '«Я ОДИН»', appear(t, S(121) - .1), 'w', 200, null, 110);
  } },
  // Она посмотрела на Илью. Потом на меня.
  { t0: C(122), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    const look = t < S(123) ? -1 : lerp(-1, .2, outc((t - S(123)) / .4));
    portrait(ctx, 540, 700, 860, { eyes: 'dot', look, brow: -.5 }, VERA);
    lanternLight(ctx, t);
    tag(ctx, 90, 140, t < S(123) ? 'НА ИЛЬЮ' : 'НА МЕНЯ', 1);
  } },
  // Ты знаешь, кто он?
  { t0: C(124), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1.02, 1.07);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'dot', brow: -.6, mouth: talk(t, 124) }, VERA);
    lanternLight(ctx, t);
    headline(ctx, '«ТЫ ЗНАЕШЬ, КТО ОН?»', appear(t, S(124) - .1), 'y', 200, null, 80);
  } },
  // Я кивнул. Он заражён.
  { t0: C(125), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    const nod = t > S(125) ? Math.sin(clamp((t - S(125)) / .6) * Math.PI * 2) : 0;
    portrait(ctx, 540, 700, 860, { eyes: 'dot', nod, brow: .5 }, LOOK.hero);
    lanternLight(ctx, t);
    if (t > S(126) - .1) headline(ctx, 'ЗАРАЖЁН', appear(t, S(126) - .1), 'r', 200, null, 110);
  } },
  // В комнате стало тихо.
  { t0: C(127), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1, 1.04);
    techRoom(ctx, t, { hide: 'vera', extra: x => toon(x, 720, 1050, 520, { face: -1, armL: [-1.4, 0], armR: [-1.3, -.1], props: { gun: 'L', gunDir: -1.57 } }, VERA) });
    tag(ctx, 90, 140, 'ТИШИНА', appear(lt, .2));
    vignette(ctx);
  } },
  // Мальчик спрятался за женщину.
  { t0: C(128), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 780, 860, 1.6, 1.7, 820);
    const u = inout(lt / 1.1);
    techRoom(ctx, t, { hide: 'boy', extra: x => {
      toon(x, lerp(890, 790, u), 1050, 330, walkPose(lt * 8, -1, .6 * (1 - u), { face: -1, eyes: 'wide' }), BOY);
      toon(x, 720, 1050, 520, { face: -1, armL: [-1.4, 0], armR: [-1.3, -.1], props: { gun: 'L', gunDir: -1.57 } }, VERA);
    }, pose: {} });
    tag(ctx, 90, 140, 'СПРЯТАЛСЯ', appear(lt, .3));
    vignette(ctx);
  } },
  // Я посмотрел на Илью. Он стоял неподвижно.
  { t0: C(129), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1, 1.05);
    metalDoor(ctx, t, 1, 1);
    toon(ctx, 540, 1430, 980, { eyes: 'red', armL: [-.04, 0], armR: [.04, 0] }, ILYA);
    tag(ctx, 90, 140, t > S(130) ? 'НЕПОДВИЖНО' : 'ИЛЬЯ', 1, PAL.yellow);
    vignette(ctx);
  } },
  // Женщина сказала: Он заражён уже двое суток.
  { t0: C(131), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'dot', brow: -.4, mouth: talk(t, 132) }, VERA);
    lanternLight(ctx, t);
    if (t > S(132) - .1) headline(ctx, '«ДВОЕ СУТОК»', appear(t, S(132) - .1), 'y', 200, null, 100);
  } },
  // Я не понял. Почему он ещё не превратился?
  { t0: C(133), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'wide', brow: 1, mouth: talk(t, 134, .7) }, LOOK.hero);
    lanternLight(ctx, t);
    if (t > S(134) - .1) headline(ctx, '«ПОЧЕМУ ОН ЕЩЁ', appear(t, S(134) - .1), 'w', 170, null, 76);
    if (t > S(134) - .1) headline(ctx, 'НЕ ПРЕВРАТИЛСЯ?»', appear(t, S(134) - .1), 'w', 260, null, 76);
  } },
  // Она ничего не ответила.
  { t0: C(135), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'down' }, VERA);
    lanternLight(ctx, t);
    tag(ctx, 90, 140, 'МОЛЧИТ', appear(lt, .2));
  } },
  // Тогда мальчик тихо сказал: Потому что он помнит нас.
  { t0: C(136), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1, 1.06);
    bgWarm(ctx, t);
    portrait(ctx, 540, 760, 780, { eyes: 'dot', mouth: talk(t, 137) }, BOY);
    lanternLight(ctx, t);
    if (t > S(137) - .1) { headline(ctx, '«ПОТОМУ ЧТО', appear(t, S(137) - .1), 'y', 170, null, 84); headline(ctx, 'ОН ПОМНИТ НАС»', appear(t, S(137) - .1), 'y', 270, null, 84); }
    else tag(ctx, 90, 140, 'МАЛЬЧИК', appear(lt, .2), PAL.yellow);
  } },
  // Я посмотрел на него. Илья опустил глаза.
  { t0: C(138), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    if (t < S(139)) { bgWarm(ctx, t); portrait(ctx, 540, 700, 860, { eyes: 'dot', look: .6 }, LOOK.hero); lanternLight(ctx, t); }
    else { bgDark(ctx); portrait(ctx, 540, 700, 880, { eyes: 'down', sick: 1, veins: 1 }, ILYA); tag(ctx, 90, 140, 'ОПУСТИЛ ГЛАЗА', appear(t, S(139))); }
  } },
  // Женщину звали Вера.
  { t0: C(140), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'dot' }, VERA);
    lanternLight(ctx, t);
    tag(ctx, 90, 140, 'ВЕРА', appear(t, S(140) + .6), PAL.yellow, 'ДЕРЖИТ ГРУППУ · С РУЖЬЁМ');
  } },
  // Она объяснила всё очень быстро.
  { t0: C(141), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1.02, 1.08);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'dot', brow: -.3, mouth: MOUTH(t) * .7 }, VERA);
    lanternLight(ctx, t);
    tag(ctx, 90, 140, 'ОБЪЯСНЯЕТ', appear(lt, .2));
  } },
  // Некоторые заражённые меняются сразу. Некоторые через несколько часов. А некоторые остаются такими несколько дней.
  { t0: C(142), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.04);
    kinds(ctx, t, t < C(143) ? 0 : t < C(144) ? 1 : 2);
    headline(ctx, 'ЗАРАЖЁННЫЕ', 1, 'r', 220, null, 90);
    specks(ctx, t, 30, 64); vignette(ctx);
  } },
  // Они выглядят как заражённые. Но ещё понимают речь. Иногда даже узнают людей.
  { t0: C(145), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.06);
    bgDark(ctx);
    portrait(ctx, 540, 700, 880, { eyes: t > S(147) ? 'dot' : 'red', sick: 1, veins: 1 }, ILYA);
    torchDark(ctx, 540, 660, 640, .45);
    [[S(145), 'ВЫГЛЯДЯТ КАК ЗАРАЖЁННЫЕ', PAL.red], [S(146), 'ПОНИМАЮТ РЕЧЬ', '#ffffff'], [S(147), 'УЗНАЮТ ЛЮДЕЙ', PAL.yellow]]
      .forEach(([a, s, c], i) => tag(ctx, 90, 140 + i * 76, s, appear(t, a), c));
  } },
  // Вера называла их помнящими.
  { t0: C(148), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.08);
    vgrad(ctx, 0, 0, W, H, [[0, '#0c0d12'], [1, '#050608']]);
    ctx.save(); ctx.globalAlpha = .35; toon(ctx, 540, 1500, 1100, { eyes: 'red' }, ILYA); ctx.restore();
    glow(ctx, 540, 640, 520, 'rgba(245,200,76,1)', .12 * appear(t, S(148) + .4));
    headline(ctx, 'ПОМНЯЩИЕ', appear(t, S(148) + .4, 1e9, .4), 'y', 640, 'ТАК ИХ НАЗЫВАЛА ВЕРА', 150);
    specks(ctx, t, 40, 65);
  } },
  // Я спросил: И что потом?
  { t0: C(149), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'dot', brow: .6, mouth: talk(t, 150, .7) }, LOOK.hero);
    lanternLight(ctx, t);
    if (t > S(150) - .1) headline(ctx, '«И ЧТО ПОТОМ?»', appear(t, S(150) - .1), 'w', 200, null, 100);
  } },
  // Она посмотрела на Илью. Потом они забывают.
  { t0: C(151), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'dot', look: t < S(152) ? -1 : 0, mouth: talk(t, 152) }, VERA);
    lanternLight(ctx, t);
    if (t > S(152) - .1) headline(ctx, '«ПОТОМ ОНИ ЗАБЫВАЮТ»', appear(t, S(152) - .1), 'y', 200, null, 80);
    else tag(ctx, 90, 140, 'НА ИЛЬЮ', appear(lt, .2));
  } },
  // Я спросил: Сколько времени?
  { t0: C(153), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'dot', brow: .6, mouth: talk(t, 154, .7) }, LOOK.hero);
    lanternLight(ctx, t);
    if (t > S(154) - .1) headline(ctx, '«СКОЛЬКО ВРЕМЕНИ?»', appear(t, S(154) - .1), 'w', 200, null, 90);
  } },
  // Она ответила: По-разному.
  { t0: C(155), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgWarm(ctx, t);
    portrait(ctx, 540, 700, 860, { eyes: 'down', mouth: talk(t, 156) }, VERA);
    lanternLight(ctx, t);
    if (t > S(156) - .1) headline(ctx, '«ПО-РАЗНОМУ»', appear(t, S(156) - .1), 'y', 200, null, 100);
  } },
  // В комнате снова стало тихо.
  { t0: C(157), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.05, 1.0);
    techRoom(ctx, t, { pose: { vera: { eyes: 'down' }, boy: { eyes: 'down' } } });
    tag(ctx, 90, 140, 'СНОВА ТИШИНА', appear(lt, .2));
    vignette(ctx);
  } },
  // Затем Илья посмотрел на меня. Его глаза изменились.
  { t0: C(158), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.08);
    bgDark(ctx);
    const k = 1 + 1.4 * sstep(S(159), S(159) + .8, t);
    portrait(ctx, 540, 700, 880, { eyes: 'red', sick: 1, veins: 1, glowK: k }, ILYA);
    torchDark(ctx, 540, 660, 640, .45);
    if (t > S(159)) tag(ctx, 90, 140, 'ГЛАЗА ИЗМЕНИЛИСЬ', appear(t, S(159)), PAL.red);
  } },
  // Он резко схватился за голову.
  { t0: C(160), draw(ctx, lt, d, t) {
    const [sx, sy] = shake(t, [[S(160) + .2, 1.5]], 10);
    push(ctx, lt, d, 540 + sx, 800 + sy, 1, 1.06);
    metalDoor(ctx, t, 1, 1);
    const g = outc((t - S(160) - .1) / .35), tw = (noise1(t * 14) - .5) * 14 * g;
    toon(ctx, 540 + tw, 1430, 980, { eyes: 'red', lean: .05 * g, armL: [lerp(-.05, -2.5, g), lerp(0, 1.5, g)], armR: [lerp(.05, 2.5, g), lerp(0, -1.5, g)], mouth: .6 * g }, ILYA);
    tag(ctx, 90, 140, 'ПРИСТУП', appear(t, S(160) + .2), PAL.red);
    vignette(ctx, .7);
  } },
  // Вера подняла оружие. Отойди от него!
  { t0: C(161), draw(ctx, lt, d, t) {
    const [sx, sy] = shake(t, [[S(161) + .25, 1.2]], 8);
    push(ctx, lt, d, 540 + sx, 700 + sy, 1, 1.06);
    bgWarm(ctx, t);
    portrait(ctx, 540, 760, 820, { eyes: 'wide', brow: -1, mouth: talk(t, 162, 1) }, VERA);
    ctx.save(); ctx.translate(540, 1500); ctx.rotate(-.12); ctx.fillStyle = '#25272b'; rrect(ctx, -520, -26, 900, 52, 14); ctx.fill(); ctx.fillStyle = '#5a3d2a'; rrect(ctx, 300, -40, 300, 90, 24); ctx.fill(); ctx.restore();
    lanternLight(ctx, t);
    if (t > S(162) - .1) headline(ctx, '«ОТОЙДИ ОТ НЕГО!»', appear(t, S(162) - .1), 'r', 200, null, 90);
    else tag(ctx, 90, 140, 'ОРУЖИЕ', appear(lt, .15), PAL.red);
  } },
  // Я отступил.
  { t0: C(163), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.12, 1.0);
    techRoom(ctx, t, { hide: 'vera', extra: x => toon(x, 720, 1050, 520, { face: -1, eyes: 'wide', armL: [-1.45, 0], armR: [-1.3, -.1], props: { gun: 'L', gunDir: -1.57 } }, VERA) });
    tag(ctx, 90, 140, 'ОТСТУПИЛ', appear(lt, .2));
    vignette(ctx);
  } },
  // Илья начал тяжело дышать.
  { t0: C(164), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    bgDark(ctx);
    const br = Math.sin(t * 7) * .5 + .5;
    portrait(ctx, 540, 700 + br * 10, 880, { eyes: 'red', sick: 1, veins: 1, mouth: .3 + .4 * br, glowK: 1.6 }, ILYA);
    torchDark(ctx, 540, 660, 640, .45);
    tag(ctx, 90, 140, 'ТЯЖЕЛО ДЫШИТ', appear(lt, .2), PAL.red);
  } },
  // Потом ударил кулаком по стене. Один раз. Второй.
  { t0: C(165), draw(ctx, lt, d, t) {
    const HITS = [[S(165) + .9, 1.6], [S(167) - .25, 1.8]], n = HITS.filter(([a]) => t >= a).length;
    const [sx, sy] = shake(t, HITS, 12);
    push(ctx, lt, d, 600 + sx, 800 + sy, 1.05, 1.1);
    vgrad(ctx, 0, 0, W, H, [[0, '#22262a'], [1, '#14171a']]);
    ctx.fillStyle = '#2c3135'; ctx.fillRect(800, 0, 280, H);
    ctx.strokeStyle = '#0e1012'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    if (n > 0) { ctx.beginPath(); ctx.moveTo(800, 720); ctx.lineTo(860, 690); ctx.lineTo(900, 720); ctx.moveTo(860, 690); ctx.lineTo(880, 620); ctx.moveTo(800, 720); ctx.lineTo(850, 780); ctx.stroke(); }
    if (n > 1) { ctx.beginPath(); ctx.moveTo(880, 620); ctx.lineTo(940, 560); ctx.moveTo(850, 780); ctx.lineTo(930, 840); ctx.lineTo(1000, 830); ctx.moveTo(900, 720); ctx.lineTo(990, 700); ctx.stroke(); }
    const punch = HITS.reduce((a, [h]) => Math.max(a, Math.exp(-Math.abs(t - h) * 7)), 0);
    toon(ctx, 560, 1400, 980, { face: 1, eyes: 'red', lean: .1, armR: [lerp(.7, 1.55, punch), lerp(-.9, -.05, punch)], armL: [.2, -.3] }, ILYA);
    knockDust(ctx, t, HITS, 790, 720, 30);
    tag(ctx, 90, 140, ['УДАР', 'ОДИН РАЗ', 'ВТОРОЙ'][n], 1, PAL.red);
    vignette(ctx);
  } },
  // Потом остановился. И посмотрел на меня.
  { t0: C(168), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.06);
    bgDark(ctx);
    portrait(ctx, 540, 700, 880, { eyes: 'red', sick: 1, veins: 1, glowK: 1.2 }, ILYA);
    torchDark(ctx, 540, 660, 640, .45);
    tag(ctx, 90, 140, t > S(169) ? 'СМОТРИТ НА МЕНЯ' : 'ОСТАНОВИЛСЯ', 1);
  } },
  // Уходи.
  { t0: C(170), fadeOut: .35, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1.04, 1.12);
    bgDark(ctx);
    portrait(ctx, 540, 700, 880, { eyes: 'red', sick: 1, veins: 1, mouth: talk(t, 170, 1) }, ILYA);
    torchDark(ctx, 540, 660, 640, .45);
    headline(ctx, '«УХОДИ»', appear(t, S(170) - .1), 'y', 220, null, 140);
  } },
);
