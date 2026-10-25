// Episode 1, vertical flat cut — scene 3 (1:25.9–2:49.2): the basement, the dark, Ilya.
'use strict';

const ILYA = Object.assign({}, LOOK.ilya, { blood: 1, veins: 1 });

// Darkness everywhere except a torch spot at screen (x, y).
function torchDark(ctx, x, y, r, dark = .88) {
  const [c, s] = scratch('dark', W, H);
  s.fillStyle = `rgba(3,4,8,${dark})`; s.fillRect(0, 0, W, H);
  if (r > 0) {
    s.globalCompositeOperation = 'destination-out';
    const g = s.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,0.85)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    s.fillStyle = g; s.fillRect(0, 0, W, H);
  }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(c, 0, 0);
  if (r > 0) glow(ctx, x, y, r, 'rgba(255,236,190,1)', .12);
  ctx.restore();
}

// Water bottles and boxes against the basement wall.
function storage(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, 1250, [[0, '#2b3336'], [1, '#232a2c']]);
  vgrad(ctx, 0, 1250, W, H - 1250, [[0, '#1b2022'], [1, '#111416']]);
  ctx.fillStyle = '#3b4447'; ctx.fillRect(0, 120, W, 46); ctx.fillStyle = '#4a5457'; ctx.fillRect(0, 196, W, 30);
  ctx.fillStyle = '#2f373a'; for (let k = 0; k < 8; k++) ctx.fillRect(60 + k * 140, 110, 14, 70);
  const bottle = (x, y) => {
    ctx.fillStyle = 'rgba(96,150,214,0.6)'; rrect(ctx, x, y, 116, 180, 22); ctx.fill();
    ctx.fillStyle = 'rgba(150,195,240,0.55)'; rrect(ctx, x + 30, y - 36, 56, 44, 14); ctx.fill();
    ctx.fillStyle = '#2d5fa8'; rrect(ctx, x + 40, y - 52, 36, 20, 5); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x + 14, y + 20, 10, 130);
    ctx.fillStyle = 'rgba(240,240,230,0.7)'; ctx.fillRect(x + 8, y + 76, 100, 40);
  };
  for (let row = 0; row < 2; row++) for (let k = 0; k < 4; k++) if (!(o.taken && row === 0 && k < o.taken)) bottle(150 + k * 130, 1060 - row * 230);
  const box = (x, y, w, h) => { ctx.fillStyle = '#8a6a44'; ctx.fillRect(x, y, w, h); ctx.fillStyle = '#76593a'; ctx.fillRect(x + w * .55, y, w * .45, h); ctx.fillStyle = '#c9b27f'; ctx.fillRect(x + w * .42, y, w * .12, h * .35); };
  box(700, 1000, 260, 240); box(730, 800, 200, 200); box(660, 1100, 0, 0);
}

// One-point corridor of the basement; P(u, x, y) puts a near-plane point at depth u.
const VPX = 540, VPY = 860, ZF = 6.5;
const P = (u, x, y) => { const z = 1 + u * (ZF - 1); return [VPX + (x - VPX) / z, VPY + (y - VPY) / z]; };
function corridor(ctx, t, o = {}) {
  ctx.fillStyle = '#121617'; ctx.fillRect(0, 0, W, H);
  const q = (pts, col) => { ctx.fillStyle = col; poly(ctx, pts); ctx.fill(); };
  q([[0, 0], P(1, 0, 0), P(1, 0, H), [0, H]], '#222a2c');
  q([[W, 0], P(1, W, 0), P(1, W, H), [W, H]], '#1c2325');
  q([[0, 0], [W, 0], P(1, W, 0), P(1, 0, 0)], '#161b1c');
  q([[0, H], [W, H], P(1, W, H), P(1, 0, H)], '#191e1f');
  q([P(1, 0, 0), P(1, W, 0), P(1, W, H), P(1, 0, H)], '#050607');
  // joints in the concrete
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 3;
  for (const u of [.12, .28, .46, .66]) { ctx.beginPath(); ctx.moveTo(...P(u, 0, 0)); ctx.lineTo(...P(u, 0, H)); ctx.moveTo(...P(u, W, 0)); ctx.lineTo(...P(u, W, H)); ctx.stroke(); }
  // pipes along the ceiling
  for (const [px, py, r, col] of [[900, 160, 70, '#3c4447'], [760, 90, 40, '#2e3538']]) {
    q([P(0, px, py - r), P(1, px, py - r), P(1, px, py + r), P(0, px, py + r)], col);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (const u of [.05, .2, .38, .58, .8]) { const a = P(u, px, py - r), b = P(u, px, py + r); ctx.fillRect(a[0] - 4, a[1], 8 / (1 + u * 5), b[1] - a[1]); }
  }
  // the metal door on the right wall
  const d0 = .42, d1 = .56;
  q([P(d0, W, 520), P(d1, W, 520), P(d1, W, H), P(d0, W, H)], '#3f4b44');
  q([P(d0 + .015, W, 560), P(d1 - .015, W, 560), P(d1 - .015, W, H), P(d0 + .015, W, H)], '#4b5a50');
  if (o.doorGlow) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const [gx, gy] = P(d0, W, 1500); glow(ctx, gx - 20, gy, 160, 'rgba(255,190,110,1)', .35 * o.doorGlow); ctx.restore(); }
  // puddles
  ctx.fillStyle = 'rgba(120,150,170,0.12)'; for (const [u, x] of [[.15, 300], [.35, 700], [.6, 380]]) { const [a, b] = P(u, x, H); ell(ctx, a, b, 150 / (1 + u * 5.5), 22 / (1 + u * 5.5)); ctx.fill(); }
  if (o.ilya) {
    const u = o.ilya.u, z = 1 + u * (ZF - 1), [fx, fy] = P(u, o.ilya.x ?? 540, H);
    toon(ctx, fx, fy, 1500 / z, o.ilya.pose || { eyes: 'red' }, ILYA);
  }
}

SHOTS.push(
  // Но в подвале хранилась вода.
  { t0: 85.875, fadeIn: .3, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1, 1.06);
    storage(ctx, t);
    tag(ctx, 90, 300, 'ВОДА', appear(lt, .2), PAL.yellow, 'ЗАПАСЫ В ПОДВАЛЕ');
    specks(ctx, t, 40, 51); vignette(ctx);
  } },
  // Именно поэтому я всё-таки спустился.
  { t0: C(52), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.05);
    basementDoor(ctx, t, { open: lerp(.3, .75, outc(lt / 1.2)) });
    const u = clamp((lt - .5) / 1.2);
    toon(ctx, lerp(820, 620, u), 1200, 560, walkPose(lt * 7, -1, .8, { face: -1, armL: [-1.3, -.1], props: { torch: 'L', torchDir: -1.5 } }));
    specks(ctx, t, 40, 52); vignette(ctx);
  } },
  // Каждая ступень скрипела.
  { t0: C(53), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.05);
    const st = stairsSide(ctx, { window: false });
    tint(ctx, '#000', .62, 'source-over');
    const k = 3 + lt * 1.6, [px, py] = st.step(k);
    toon(ctx, px, py, 420, walkPose(lt * 6, 1, .7, { face: 1, armR: [1.0, .2], props: { torch: 'R', torchDir: .6 } }));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ctx, px + 140, py + 60, 200, 'rgba(255,236,190,1)', .4); ctx.restore();
    const n = (lt > .15) + (lt > .75);
    headline(ctx, ['', 'СКРИП.', 'СКРИП. СКРИП.'][n], n ? 1 : 0, 'w', 300);
    specks(ctx, t, 30, 53); vignette(ctx, .7);
  } },
  // Я светил только под ноги.
  { t0: C(54), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.05, 1.12);
    vgrad(ctx, 0, 0, W, H, [[0, '#1d1a17'], [1, '#13110f']]);
    for (let k = 0; k < 6; k++) { ctx.fillStyle = k % 2 ? '#2e2924' : '#38322b'; ctx.fillRect(0, 300 + k * 230, W, 230); ctx.fillStyle = '#4a433a'; ctx.fillRect(0, 300 + k * 230, W, 14); }
    const step = Math.floor(lt * 1.6), fy = 760 + (lt * 1.6 % 1) * 40;
    ctx.fillStyle = LOOK.hero.legs; ctx.fillRect(380, -50, 90, fy - 60 + 50); ctx.fillRect(600, -50, 90, fy - 140 + 50 + (step % 2) * 60);
    ctx.fillStyle = LOOK.hero.shoes; rrect(ctx, 360, fy - 70, 140, 60, 18); ctx.fill(); rrect(ctx, 580, fy - 150 + (step % 2) * 60, 140, 60, 18); ctx.fill();
    torchDark(ctx, 540, 860, 420, .82);
    tag(ctx, 90, 240, 'ТОЛЬКО ПОД НОГИ', appear(lt, .2));
  } },
  // Внизу было холодно. Слишком холодно.
  { t0: C(55), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 860, 1, 1.07);
    corridor(ctx, t);
    tint(ctx, '#3a6a9a', .25, 'multiply');
    const k = t > S(56) ? 1 : 0;
    for (let i = 0; i < 5; i++) { const u = clamp((t - S(56) - i * .12) / 1.2); if (u > 0 && u < 1) glow(ctx, 520 + u * 120 + i * 20, 1250 - u * 160, 90 + u * 160, 'rgba(220,235,255,1)', .22 * Math.sin(Math.PI * u)); }
    torchDark(ctx, 540, 1000, 520, .6);
    tag(ctx, 90, 240, k ? 'СЛИШКОМ ХОЛОДНО' : 'ХОЛОДНО', 1, '#7fb0ff');
    specks(ctx, t, 50, 54);
  } },
  // Вода стояла у дальней стены.
  { t0: C(57), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1, 1.08);
    storage(ctx, t);
    const sx = lerp(860, 420, inout(lt / d));
    torchDark(ctx, sx, 950, 430, .8);
    tag(ctx, 90, 240, 'У ДАЛЬНЕЙ СТЕНЫ', appear(lt, .2));
  } },
  // Рядом лежали несколько коробок.
  { t0: C(58), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 760, 1000, 1.1, 1.16);
    storage(ctx, t);
    torchDark(ctx, 820, 1000, 420, .78);
    tag(ctx, 90, 240, 'КОРОБКИ', appear(lt, .2));
  } },
  // Я начал собирать бутылки.
  { t0: C(59), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1, 1.05);
    const taken = Math.min(3, Math.floor(lt / .45));
    storage(ctx, t, { taken });
    toon(ctx, 460, 1300, 600, { face: 1, crouch: .5, lean: .25, armR: [1.2, .3], armL: [.9, .4], props: { torch: 'L', torchDir: 1.2 } });
    torchDark(ctx, 380, 1000, 520, .72);
  } },
  // Потом услышал дыхание. Не своё.
  { t0: C(60), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1.05, 1.1);
    storage(ctx, t, { taken: 3 });
    toon(ctx, 460, 1300, 600, { face: 1, crouch: .5, lean: .1, head: [-.02, 0], armR: [.4, .3], armL: [.9, .4], eyes: 'wide', props: { torch: 'L', torchDir: 1.2 } });
    torchDark(ctx, 380, 1000, 480, .8);
    if (t > S(61)) { glow(ctx, 900, 820, 60, 'rgba(255,40,30,1)', .5 * appear(t, S(61))); }
    tag(ctx, 90, 240, t > S(61) ? 'НЕ СВОЁ' : 'ДЫХАНИЕ', 1, PAL.red);
  } },
  // Я выключил фонарь. Темнота стала абсолютной.
  { t0: C(62), draw(ctx, lt, d, t) {
    const off = t > S(62) + .45;
    storage(ctx, t, { taken: 3 });
    torchDark(ctx, 380, 1000, off ? 0 : 480, off ? .98 : .8);
    if (t > C(63)) headline(ctx, 'ТЕМНОТА', appear(t, C(63) + .2), 'w', 300);
    specks(ctx, t, 30, 55, .15);
  } },
  // Кто-то стоял рядом. Я слышал его дыхание. Тяжёлое. Медленное. Я не двигался.
  { t0: C(64), draw(ctx, lt, d, t) {
    ctx.fillStyle = '#020304'; ctx.fillRect(0, 0, W, H);
    push(ctx, lt, d, 540, 900, 1, 1.06);
    // a darker shape, barely there, with two red points
    ctx.fillStyle = '#07080b'; toon(ctx, 760, 1500, 1200, { eyes: 'red', lean: -.05 }, { skin: '#07080b', hair: '#040405', top: '#07080b', topD: '#060709', legs: '#060709', shoes: '#040405' });
    const tags = [[S(65), 'ДЫХАНИЕ'], [S(66), 'ТЯЖЁЛОЕ'], [S(67), 'МЕДЛЕННОЕ']];
    tags.forEach(([a, s], i) => tag(ctx, 90, 240 + i * 76, s, appear(t, a), PAL.red));
    if (t > C(68)) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); for (const k of [-1, 1]) { ctx.fillStyle = '#e9e5dc'; ell(ctx, 540 + k * 70, 980, 34, 26); ctx.fill(); ctx.fillStyle = PAL.ink; ell(ctx, 540 + k * 70, 980, 14, 14); ctx.fill(); } ctx.restore(); }
    specks(ctx, t, 25, 56, .12);
  } },
  // Через несколько секунд раздались шаги. Они удалялись.
  { t0: C(69), draw(ctx, lt, d, t) {
    ctx.fillStyle = '#020304'; ctx.fillRect(0, 0, W, H);
    const steps = [.35, .95, 1.55, 2.1, 2.65].filter(a => lt > a).length;
    const far = clamp((t - S(70)) / 1.2);
    headline(ctx, 'ШАГ. '.repeat(Math.max(1, steps)).trim(), steps ? 1 - far * .6 : 0, 'w', 300 + far * 40, null, 96 - far * 30);
    if (t > S(70)) tag(ctx, 90, 420, 'УДАЛЯЮТСЯ', appear(t, S(70)));
    specks(ctx, t, 25, 57, .12);
  } },
  // Я включил фонарь.
  { t0: C(71), draw(ctx, lt, d, t) {
    const on = lt > .25;
    corridor(ctx, t);
    torchDark(ctx, 540, 980, on ? 560 : 0, on ? .7 : .98);
    if (on) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ctx, 540, 980, 700, 'rgba(255,240,210,1)', .12 * (1 - clamp((lt - .25) / .4))); ctx.restore(); }
  } },
  // В конце коридора стоял мужчина.
  { t0: C(72), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 860, 1, 1.25);
    corridor(ctx, t, { ilya: { u: .72 } });
    torchDark(ctx, 540, 820, 420, .72);
    tag(ctx, 90, 240, 'МУЖЧИНА', appear(lt, .4), PAL.yellow, 'В КОНЦЕ КОРИДОРА');
  } },
  // Он смотрел прямо на меня.
  { t0: C(73), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#101415'], [1, '#090b0c']]);
    toon(ctx, 540, 1900, 1700, { eyes: 'red', armL: [-.05, 0], armR: [.05, 0] }, ILYA);
    torchDark(ctx, 540, 620, 560, .55);
  } },
  // Его лицо было покрыто кровью.
  { t0: C(74), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#101415'], [1, '#090b0c']]);
    portrait(ctx, 540, 680, 900, { eyes: 'red', sick: 1, veins: 1, mouth: .1 }, ILYA);
    torchDark(ctx, 540, 640, 640, .45);
    tag(ctx, 90, 140, 'ЛИЦО В КРОВИ', appear(lt, .2), PAL.red);
  } },
  // Но он не бросился на меня. Он просто стоял.
  { t0: C(75), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 860, 1.25, 1.3);
    corridor(ctx, t, { ilya: { u: .6, pose: { eyes: 'red', breathe: Math.sin(t * 2) } } });
    torchDark(ctx, 540, 800, 460, .72);
    tag(ctx, 90, 240, 'НЕ НАПАДАЕТ', appear(lt, .2));
  } },
  // Я сделал шаг назад. Он сделал шаг назад.
  { t0: C(77), draw(ctx, lt, d, t) {
    const back1 = inout((t - S(77)) / .9), back2 = inout((t - S(78)) / .9);
    push(ctx, lt, d, 540, 860, 1.3 - .12 * back1, 1.3 - .12 * back1);
    corridor(ctx, t, { ilya: { u: .6 + .1 * back2, pose: { eyes: 'red', legL: [.15 * Math.sin(back2 * 3), 0] } } });
    torchDark(ctx, 540, 800, 460, .72);
    if (t > S(78)) tag(ctx, 90, 240, 'ЗЕРКАЛЬНО', appear(t, S(78)), PAL.yellow);
  } },
  // Я поднял нож.
  { t0: C(79), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 860, 1.2, 1.24);
    corridor(ctx, t, { ilya: { u: .7 } });
    torchDark(ctx, 540, 800, 460, .72);
    const up = outc(lt / .5);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(760, lerp(2300, 1520, up)); ctx.rotate(-.35);
    ctx.fillStyle = LOOK.hero.top; rrect(ctx, -70, 120, 150, 500, 50); ctx.fill();
    ctx.fillStyle = LOOK.hero.skin; rrect(ctx, -80, 0, 170, 150, 60); ctx.fill();
    ctx.fillStyle = '#1d1f24'; rrect(ctx, -24, -120, 48, 150, 14); ctx.fill();
    ctx.fillStyle = '#d5dae1'; poly(ctx, [[-22, -120], [22, -120], [6, -440], [-8, -470]]); ctx.fill();
    ctx.fillStyle = '#f2f4f7'; poly(ctx, [[-22, -120], [0, -120], [-8, -470]]); ctx.fill();
    ctx.restore();
  } },
  // Он поднял руку. И показал на дверь.
  { t0: C(80), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 640, 860, 1.15, 1.2);
    const up = outc((t - S(80)) / .6), point = outc((t - S(81)) / .6);
    corridor(ctx, t, { ilya: { u: .58, pose: { eyes: 'red', armR: [lerp(.05, 2.6, up) - point * 1.0, lerp(0, .1, up)] } } });
    torchDark(ctx, 600, 820, 520, .7);
    if (t > S(81)) tag(ctx, 640, 520, 'ДВЕРЬ  →', appear(t, S(81) + .2), PAL.yellow);
  } },
  // Потом прошептал: Там… ещё есть люди.
  { t0: C(82), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#101415'], [1, '#090b0c']]);
    const talk = t > S(83) && t < E(83) + .1 ? MOUTH(t) : 0;
    portrait(ctx, 540, 700, 880, { eyes: 'red', sick: 1, veins: 1, mouth: talk * .9 }, ILYA);
    torchDark(ctx, 540, 660, 640, .45);
    if (t > S(83) - .1) headline(ctx, '«ТАМ… ЕЩЁ ЕСТЬ ЛЮДИ»', appear(t, S(83) - .1), 'y', 200, null, 76);
  } },
  // Я думал, что он заражён. Но он говорил. Плохо. Еле слышно. Но говорил.
  { t0: C(84), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 860, 1.4, 1.5);
    corridor(ctx, t, { ilya: { u: .5, pose: { eyes: 'red', mouth: .2 } } });
    torchDark(ctx, 540, 760, 460, .7);
    tag(ctx, 90, 240, 'ЗАРАЖЁН?', appear(t, S(84)), PAL.red);
    [[S(85), 'ГОВОРИТ', '#ffffff'], [S(86), 'ПЛОХО', '#ffffff'], [S(87), 'ЕЛЕ СЛЫШНО', '#ffffff']].forEach(([a, s, c], i) => tag(ctx, 90, 316 + i * 76, s, appear(t, a), c));
  } },
  // Я спросил: Ты меня понимаешь? Он кивнул.
  { t0: C(89), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#101415'], [1, '#090b0c']]);
    const nod = Math.sin(clamp((t - S(91)) / .7) * Math.PI * 2) * (t > S(91) ? 1 : 0);
    portrait(ctx, 540, 700, 880, { eyes: 'red', sick: 1, veins: 1, nod }, ILYA);
    torchDark(ctx, 540, 660, 640, .45);
    if (t > S(90) - .1) headline(ctx, '«ТЫ МЕНЯ ПОНИМАЕШЬ?»', appear(t, S(90) - .1) * (1 - appear(t, S(91) + .3)), 'w', 200, null, 70);
    if (t > S(91)) tag(ctx, 90, 140, 'КИВНУЛ', appear(t, S(91)), PAL.yellow);
  } },
  // Я спросил: Как тебя зовут? Он долго молчал. Потом сказал: Илья.
  { t0: C(92), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.08);
    vgrad(ctx, 0, 0, W, H, [[0, '#101415'], [1, '#090b0c']]);
    const talk = t > S(96) && t < E(96) + .1 ? MOUTH(t) : 0;
    portrait(ctx, 540, 700, 880, { eyes: t > S(94) && t < S(96) ? 'down' : 'red', sick: 1, veins: 1, mouth: talk * .9 }, ILYA);
    torchDark(ctx, 540, 660, 640, .45);
    if (t < S(94)) headline(ctx, '«КАК ТЕБЯ ЗОВУТ?»', appear(t, S(93) - .1), 'w', 200, null, 76);
    else if (t < S(96) - .1) tag(ctx, 90, 140, 'МОЛЧИТ', appear(t, S(94)));
    else headline(ctx, '«ИЛЬЯ»', appear(t, S(96) - .1), 'y', 220, null, 130);
  } },
  // Я посмотрел на его руки.
  { t0: C(97), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#101415'], [1, '#090b0c']]);
    const tr = (noise1(t * 9) - .5) * 6;
    for (const k of [-1, 1]) {
      ctx.save(); ctx.translate(540 + k * 220 + tr, 1000); ctx.rotate(k * .25);
      ctx.fillStyle = ILYA.top; rrect(ctx, -90, 160, 180, 600, 50); ctx.fill();
      ctx.fillStyle = ILYA.skin; rrect(ctx, -95, -150, 190, 330, 80); ctx.fill();
      ctx.fillStyle = shade(ILYA.skin, -.15); for (let f = 0; f < 4; f++) { rrect(ctx, -86 + f * 44, -330, 38, 210, 19); ctx.fill(); }
      ctx.fillStyle = '#2a2224'; for (let f = 0; f < 4; f++) { rrect(ctx, -82 + f * 44, -326, 30, 40, 12); ctx.fill(); }
      ctx.fillStyle = PAL.blood; rrect(ctx, -60, -40, 110, 30, 15); ctx.fill();
      ctx.strokeStyle = 'rgba(20,16,18,0.7)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-40, 160); ctx.lineTo(-20, 40); ctx.lineTo(10, -20); ctx.moveTo(-20, 40); ctx.lineTo(-60, -10); ctx.stroke();
      ctx.restore();
    }
    torchDark(ctx, 540, 880, 640, .5);
    tag(ctx, 90, 240, 'РУКИ', appear(lt, .2));
  } },
  // На шее были чёрные вены.
  { t0: C(98), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 540, 1300, 2.2, 2.35, 900);
    vgrad(ctx, 0, 0, W, H, [[0, '#101415'], [1, '#090b0c']]);
    portrait(ctx, 540, 700, 880, { eyes: 'red', sick: 1, veins: 1 }, ILYA);
    torchDark(ctx, 540, 880, 700, .4);
    tag(ctx, 90, 240, 'ЧЁРНЫЕ ВЕНЫ', appear(lt, .2), PAL.red);
  } },
  // Глаза были красными.
  { t0: C(99), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 540, 735, 3.2, 3.4, 820);
    vgrad(ctx, 0, 0, W, H, [[0, '#101415'], [1, '#090b0c']]);
    portrait(ctx, 540, 700, 880, { eyes: 'red', sick: 1, veins: 1, glowK: 1.4 }, ILYA);
    tag(ctx, 90, 240, 'КРАСНЫЕ ГЛАЗА', appear(lt, .2), PAL.red);
  } },
  // Но он не нападал. Я не понимал почему.
  { t0: C(100), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#141a26'], [1, '#0c1018']]);
    if (t < S(101)) { portrait(ctx, 540, 700, 880, { eyes: 'red', sick: 1, veins: 1 }, ILYA); torchDark(ctx, 540, 660, 640, .45); tag(ctx, 90, 140, 'НЕ НАПАДАЕТ', appear(lt, .2)); }
    else { portrait(ctx, 540, 700, 880, { eyes: 'wide', brow: 1, mouth: .1 }, LOOK.hero); headline(ctx, 'ПОЧЕМУ?', appear(t, S(101)), 'w', 200, null, 110); }
  } },
  // Илья снова показал на дверь.
  { t0: C(102), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 760, 860, 1.2, 1.3);
    const point = outc((t - S(102)) / .6);
    corridor(ctx, t, { ilya: { u: .48, x: 420, pose: { eyes: 'red', armR: [lerp(.05, 1.6, point), .05] } } });
    torchDark(ctx, 700, 880, 560, .7);
    tag(ctx, 90, 240, 'СНОВА', appear(lt, .2), PAL.yellow);
  } },
  // За ней послышался шум. Много голосов.
  { t0: C(103), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#1b2124'], [1, '#111517']]);
    ctx.fillStyle = '#3f4b44'; ctx.fillRect(240, 330, 600, 1100); ctx.fillStyle = '#4b5a50'; ctx.fillRect(270, 360, 540, 1070);
    ctx.fillStyle = '#6b746d'; for (let k = 0; k < 7; k++) { ell(ctx, 300, 400 + k * 150, 8, 8); ctx.fill(); ell(ctx, 780, 400 + k * 150, 8, 8); ctx.fill(); }
    ctx.fillStyle = '#c9cbd0'; rrect(ctx, 700, 880, 70, 16, 8); ctx.fill();
    ctx.fillStyle = `rgba(255,190,110,${.8})`; ctx.fillRect(270, 1426, 540, 6); floorGlow(ctx, 540, 1436, 560, .9, 'rgba(255,190,110,1)');
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { const u = (t * .9 + i / 3) % 1; ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.arc(540, 880, 120 + u * 260, -.5, .5); ctx.stroke(); ctx.beginPath(); ctx.arc(540, 880, 120 + u * 260, Math.PI - .5, Math.PI + .5); ctx.stroke(); }
    ctx.globalAlpha = 1;
    tag(ctx, 90, 140, t > S(104) ? 'МНОГО ГОЛОСОВ' : 'ШУМ', 1, PAL.yellow);
    specks(ctx, t, 30, 58); vignette(ctx);
  } },
  // Я замер. Кто там?
  { t0: C(105), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#141a26'], [1, '#0c1018']]);
    portrait(ctx, 540, 700, 880, { eyes: 'wide', brow: 1, mouth: t > S(106) && t < E(106) + .1 ? MOUTH(t) * .8 : 0 }, LOOK.hero);
    if (t > S(106) - .1) headline(ctx, '«КТО ТАМ?»', appear(t, S(106) - .1), 'w', 200, null, 110);
    else tag(ctx, 90, 140, 'ЗАМЕР', appear(lt, .15));
  } },
  // Он посмотрел на меня. И прошептал: Живые.
  { t0: C(107), fadeOut: .4, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.08);
    vgrad(ctx, 0, 0, W, H, [[0, '#101415'], [1, '#090b0c']]);
    const talk = t > S(109) && t < E(109) + .1 ? MOUTH(t) : 0;
    portrait(ctx, 540, 700, 880, { eyes: 'red', sick: 1, veins: 1, mouth: talk * .9 }, ILYA);
    torchDark(ctx, 540, 660, 640, .45);
    if (t > S(109) - .1) headline(ctx, '«ЖИВЫЕ»', appear(t, S(109) - .1), 'y', 220, null, 130);
  } },
);
