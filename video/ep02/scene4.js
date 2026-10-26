// Episode 2, scene 4 (2:19.8–3:12.6): steps at night, the girl outside, rule five, "Anton, please", the end card.
'use strict';

// footsteps outside, the same times as in sound.py
const STEPS = [...Array(6)].map((_, k) => Wd(50, 'шагов') + .3 + k * .78);
const MOONLIT = '#7d8cc0', VOICE_END = 189.1;  // the voiceover ends, the end card follows

// Inside the shelter at night, looking out through the entrance. outside(ctx) draws what is out there.
function fromInside(ctx, t, outside, tri = [[540, 330], [60, 1560], [1020, 1560]]) {
  outside(ctx);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.moveTo(...tri[0]); ctx.lineTo(...tri[1]); ctx.lineTo(...tri[2]); ctx.closePath(); ctx.clip('evenodd');
  vgrad(ctx, 0, 0, W, H, [[0, '#06080d'], [1, '#0b0f14']]);
  ctx.strokeStyle = 'rgba(40,70,50,0.35)'; ctx.lineWidth = 6;
  for (let i = 0; i < 26; i++) { const y = i * 80; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y - 300); ctx.stroke(); }
  ctx.fillStyle = '#0d1a12'; ctx.fillRect(0, tri[1][1], W, H);
  ctx.restore();
  // leaf tips along the edge of the opening, catching the moon
  ctx.fillStyle = '#1f3327';
  for (const [a, b] of [[tri[0], tri[1]], [tri[0], tri[2]]]) for (let i = 0; i < 14; i++) {
    const u = (i + .5) / 14, x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u), dx = b[0] < a[0] ? 1 : -1;
    poly(ctx, [[x - 18, y - 30], [x + 18, y + 30], [x + dx * 40, y + 6]]); ctx.fill();
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, tri[1][1], 0, H); g.addColorStop(0, 'rgba(120,140,200,0.14)'); g.addColorStop(1, 'rgba(120,140,200,0)'); ctx.fillStyle = g;
  poly(ctx, [tri[1], tri[2], [W + 200, H], [-200, H]]); ctx.fill(); ctx.restore();
}

// The beach at night with the girl standing on it. o: x, y (feet), h, pose, shake, scan.
function nightBeach(ctx, t, o = {}) {
  island(ctx, t, { tod: 'night', hz: o.hz ?? 860, shore: o.shore ?? 1130, palms: o.palms ?? [[90, 1180, 700, .22, 11], [1000, 1160, 640, -.2, 12]], moon: [860, 200] });
  if (o.girl !== false) girl(ctx, t, o.x ?? 540, o.y ?? 1470, o.h ?? 600, o.pose, o.shiver ?? 1);
}

function torn(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(30,20,20,0.55)';
  poly(ctx, [[x, y], [x + 22 * s, y + 8 * s], [x + 10 * s, y + 20 * s], [x + 30 * s, y + 34 * s], [x + 4 * s, y + 40 * s], [x - 6 * s, y + 18 * s]]); ctx.fill();
}

// The girl, standing, a little torn and dirty, shivering. Drawn mirrored so armR is her right hand (on our left).
function girl(ctx, t, x, y, h, pose = {}, shiver = 1) {
  const sh = (noise1(t * 22) - .5) * h * .012 * shiver;
  ctx.save(); ctx.translate(x + sh, y); ctx.scale(-1, 1);
  const o = toon(ctx, 0, 0, h, Object.assign({ eyes: 'dot', armL: [.9, 1.9], armR: [-.9, -1.9] }, pose), GIRL);
  torn(ctx, -.06 * h, -.66 * h, h / 500); torn(ctx, .05 * h, -.52 * h, h / 600);
  ctx.fillStyle = 'rgba(40,30,25,0.35)'; ell(ctx, .02 * h, -.18 * h, .04 * h, .02 * h); ctx.fill();
  ctx.restore();
  return o;
}

// The scene is lit by the moon: a cool multiply over everything drawn so far.
const moonlight = (ctx, k = .55) => tint(ctx, MOONLIT, k, 'multiply');

// A face in the dark, lit from one side by the moon.
function nightFace(ctx, t, cx, cy, s, o, look) {
  vgrad(ctx, 0, 0, W, H, [[0, '#0a0e18'], [1, '#04060a']]);
  portrait(ctx, cx, cy, s, o, look);
  moonlight(ctx, .5);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(cx + s * .5, cy - s * .3, 0, cx + s * .5, cy - s * .3, s * 1.1);
  g.addColorStop(0, 'rgba(120,140,210,0.25)'); g.addColorStop(1, 'rgba(120,140,210,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// Draws a figure's shadow flat on the sand, falling towards us and to the left from the feet at (fx, fy).
function castShadow(ctx, fx, fy, draw, alpha) {
  if (alpha <= 0) return;
  const [c, x] = scratch('shadow', W, H);
  draw(x); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#05070c'; x.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = alpha; ctx.transform(1, 0, .45, -.75, -.45 * fy, 1.75 * fy); ctx.drawImage(c, 0, 0); ctx.restore();
}

function shoePrint(ctx, x, y, s, left, k) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(left ? -.08 : .08); ctx.scale(s * outBack(clamp(k)), s * outBack(clamp(k)));
  ctx.fillStyle = 'rgba(10,12,22,0.75)'; ell(ctx, 0, -40, 34, 52); ctx.fill(); ell(ctx, 0, 52, 28, 32); ctx.fill();
  ctx.strokeStyle = 'rgba(120,130,170,0.25)'; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-26, -70 + i * 16); ctx.lineTo(26, -70 + i * 16); ctx.stroke(); }
  ctx.restore();
  if (k < 1) { ctx.fillStyle = `rgba(150,160,200,${.5 * (1 - k)})`; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; ell(ctx, x + Math.cos(a) * 70 * (1 + k), y + Math.sin(a) * 50 * (1 + k), 8, 6); ctx.fill(); } }
}

function paw(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#c8cfe0';
  ell(ctx, 0, 20, 46, 38); ctx.fill(); for (const [dx, dy] of [[-50, -30], [-18, -58], [18, -58], [50, -30]]) { ell(ctx, dx, dy, 16, 20); ctx.fill(); }
  ctx.strokeStyle = PAL.red; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-80, -90); ctx.lineTo(80, 70); ctx.moveTo(80, -90); ctx.lineTo(-80, 70); ctx.stroke();
  ctx.restore();
}

SHOTS.push(
  // Ночью просыпаюсь от шагов.
  { t0: C(50), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#06080d'], [1, '#0b0f14']]);
    // the entrance, small, up in the corner
    ctx.save(); poly(ctx, [[860, 140], [700, 560], [1020, 560]]); ctx.clip(); island(ctx, t, { tod: 'night', hz: 380, shore: 480, palms: [], moon: [900, 260] }); ctx.restore();
    const open = t > Wd(50, 'просыпаюсь'), lk = sstep(Wd(50, 'шагов') - .2, Wd(50, 'шагов') + .3, t);
    ctx.save(); ctx.translate(560, 900); ctx.rotate(Math.PI / 2);
    portrait(ctx, 0, 0, 640, { eyes: open ? 'wide' : 'closed', look: -lk * 1.2, brow: open ? .4 : 0, idle: open }, ANTON);
    ctx.restore();
    ctx.fillStyle = '#0d1a12'; rrect(ctx, -200, 180, 430, 1450, 160); ctx.fill(); ctx.fillStyle = '#132619'; for (let i = 0; i < 8; i++) { ell(ctx, 200, 280 + i * 160, 60, 26); ctx.fill(); }
    ctx.fillStyle = '#0d1a12'; ctx.fillRect(0, 1230, W, H);
    moonlight(ctx, .55);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(130,150,220,0.12)'; poly(ctx, [[860, 140], [520, 1300], [760, 1300], [1020, 560]]); ctx.fill(); ctx.restore();
    for (const s of STEPS) { const a = t - s; if (a > 0 && a < .7) { ctx.save(); ctx.globalAlpha = 1 - a / .7; ctx.fillStyle = '#e9edf3'; ctx.font = `900 ${Math.round(90 * (1 + a * .4))}px Inter`; ctx.textAlign = 'center'; ctx.fillText('ШАГ', 540, 1560); ctx.restore(); } }
    tag(ctx, 90, 240, 'НОЧЬ', appear(lt, .1), '#7fb0ff');
    vignette(ctx, .7);
  } },
  // Не звериных. Ровных. Человеческих.
  { t0: C(51), trans: 'cut', draw(ctx, lt, d, t) {
    const pan = lerp(0, 900, sstep(STEPS[1], STEPS[5] + .3, t));
    ctx.save(); ctx.translate(0, pan);
    vgrad(ctx, 0, -1200, W, H + 1200, [[0, '#3c4155'], [1, '#2c3042']]);
    const r = rng(14); ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let i = 0; i < 200; i++) { ell(ctx, r() * W, -1200 + r() * 3200, 3 + r() * 6, 2); ctx.fill(); }
    STEPS.forEach((s, k) => shoePrint(ctx, 540 + (k % 2 ? 70 : -70), 1700 - k * 300, 1.2, k % 2 === 0, (t - s) / .3));
    if (t > Wd(51, 'ровных')) { ctx.save(); ctx.strokeStyle = PAL.yellow; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); for (let k = 0; k < 5; k++) { const y0 = 1700 - k * 300, y1 = y0 - 300, a = clamp((t - Wd(51, 'ровных') - k * .1) / .3); if (a <= 0) continue; ctx.beginPath(); ctx.moveTo(800, y0); ctx.lineTo(800, lerp(y0, y1, a)); ctx.stroke(); } ctx.restore(); }
    ctx.restore();
    moonlight(ctx, .35);
    const pk = appear(t, Wd(51, 'звериных')) * (1 - sstep(Wd(51, 'ровных') - .2, Wd(51, 'ровных'), t));
    if (pk > 0) { ctx.save(); ctx.globalAlpha = pk; paw(ctx, 820, 520, 1.3 * outBack(clamp(pk))); ctx.restore(); }
    tag(ctx, 90, 240, 'НЕ ЗВЕРИНЫЕ', appear(t, Wd(51, 'звериных')), '#ffffff');
    tag(ctx, 90, 316, 'РОВНЫЕ', appear(t, Wd(51, 'ровных')), PAL.yellow);
    tag(ctx, 90, 392, 'ЧЕЛОВЕЧЕСКИЕ', appear(t, Wd(51, 'человеческих')), PAL.red);
    vignette(ctx, .6);
  } },
  // Банки молчат.
  { t0: C(52), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.1);
    vgrad(ctx, 0, 0, W, H, [[0, '#070b16'], [1, '#141a2b']]);
    ctx.fillStyle = '#23283a'; ctx.fillRect(0, 1100, W, H);
    for (const [x, y] of [[300, 1230], [420, 1290], [690, 1150], [820, 1180]]) { ctx.fillStyle = 'rgba(5,6,12,0.55)'; ell(ctx, x, y, 46, 14); ctx.fill(); }
    ropeCans(ctx, t, [60, 1120], [1020, 1110], 240, 1, 1, -1, 1.6, true);
    glow(ctx, 900, 160, 500, 'rgba(160,180,240,1)', .12);
    tag(ctx, 90, 240, 'БАНКИ МОЛЧАТ', appear(t, Wd(52, 'молчат')), PAL.red);
    if (t > Wd(52, 'молчат') + .3) headline(ctx, '?', appear(t, Wd(52, 'молчат') + .3), 'r', 520, null, 200);
    vignette(ctx, .7);
  } },
  // Беру дубину. Выглядываю.
  { t0: C(53), trans: 'cut', draw(ctx, lt, d, t) {
    const z = 1 + .55 * inout(clamp((t - Wd(53, 'выглядываю')) / 1.0));
    ctx.save(); ctx.translate(540, 900); ctx.scale(z, z); ctx.translate(-540, -900);
    fromInside(ctx, t, x => { nightBeach(x, t, { girl: false }); moonlight(x, .5); });
    const grab = outBack(clamp((t - Wd(53, 'дубину')) / .4)), bob = Math.sin(t * 2) * 6;
    const o = toon(ctx, 330, 2000 + bob, 1300, { back: 1, crouch: .5, armR: [lerp(.3, 2.4, grab), lerp(0, -.9, grab)], armL: [-.4, .3], idle: false }, Object.assign({}, ANTON, { top: '#1b2028', topD: '#151920', legs: '#141820', hair: '#0e0b09', skin: '#2e2622' }));
    const hd = o.hands.R.hand; logLine(ctx, hd, [hd[0] + 120 * grab + 40, hd[1] - 380 * grab - 20], 54, true);
    ctx.restore();
    tag(ctx, 90, 240, 'ДУБИНА', appear(t, Wd(53, 'дубину')), '#ffffff');
    vignette(ctx, .65);
  } },
  // Перед шалашом стоит молодая девушка.
  { t0: C(54), trans: 'cut', draw(ctx, lt, d, t) {
    handheld(ctx, t, 5);
    push(ctx, lt, d, 540, 900, 1.15, 1.25);
    fromInside(ctx, t, x => { nightBeach(x, t, { x: 540, y: 1450, h: 620 }); moonlight(x, .5); });
    tag(ctx, 90, 240, 'ДЕВУШКА', appear(t, Wd(54, 'девушка')), PAL.yellow);
    vignette(ctx, .6);
  } },
  // Потрёпанная, дрожащая.
  { t0: C(55), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1.0, 1.06);
    nightBeach(ctx, t, { girl: false, palms: [] });
    const sh = (noise1(t * 24) - .5) * 12;
    portrait(ctx, 540 + sh, 720, 720, { eyes: 'wide', brow: .6, shake: 1.5, mouth: .15 + .1 * Math.max(0, Math.sin(t * 9)) }, GIRL);
    torn(ctx, 220, 1180, 3); torn(ctx, 760, 1260, 2.4);
    ctx.fillStyle = 'rgba(60,45,35,0.4)'; ell(ctx, 640, 800, 40, 22); ctx.fill(); ell(ctx, 440, 640, 26, 14); ctx.fill();
    moonlight(ctx, .5);
    tag(ctx, 90, 240, 'ПОТРЁПАННАЯ', appear(t, Wd(55, 'потрёпанная')), '#ffffff');
    tag(ctx, 90, 316, 'ДРОЖИТ', appear(t, Wd(55, 'дрожащая')), '#7fb0ff');
    vignette(ctx, .6);
  } },
  // Укусов не видно.
  { t0: C(56), trans: 'cut', draw(ctx, lt, d, t) {
    nightBeach(ctx, t, { x: 540, y: 1500, h: 900, palms: [] });
    moonlight(ctx, .5);
    const sy = lerp(450, 1500, (lt * .8) % 1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, sy - 60, 0, sy + 60); g.addColorStop(0, 'rgba(60,255,140,0)'); g.addColorStop(.5, 'rgba(60,255,140,0.5)'); g.addColorStop(1, 'rgba(60,255,140,0)'); ctx.fillStyle = g; ctx.fillRect(200, sy - 60, 680, 120); ctx.restore();
    tag(ctx, 90, 240, 'УКУСОВ НЕ ВИДНО', appear(t, Wd(56, 'видно')), PAL.green);
    checkMark(ctx, 880, 250, clamp((t - Wd(56, 'видно')) / .4), 1.2);
    vignette(ctx, .55);
  } },
  // Рука сама тянется открыть вход.  /  Но я замираю.
  ...[57, 58].map(n => ({ t0: C(n), trans: 'cut', draw(ctx, lt, d, t) {
    const reach = n === 57 ? inout(clamp((t - Wd(57, 'рука')) / (E(57) - Wd(57, 'рука') + .2))) * .85 : .85 + .03 * outc(clamp(lt / .3));
    fromInside(ctx, t, x => { nightBeach(x, t, { x: 560, y: 1450, h: 600 }); moonlight(x, .5); });
    const tr = n === 58 ? (noise1(t * 30) - .5) * 8 : 0;
    ctx.fillStyle = '#5a4840'; hand(ctx, lerp(180, 470, reach) + tr, lerp(2200, 1330, reach) + tr, 460, -1.1, { curl: lerp(.5, .1, reach) });
    if (n === 58) {
      const f = clamp(lt / .25); tint(ctx, '#808080', .6 * f, 'saturation');
      tint(ctx, '#5a0606', .25 * f * (.5 + .5 * Math.sin(t * 8)), 'screen');
      tag(ctx, 90, 240, 'ЗАМИРАЮ', appear(t, Wd(58, 'замираю')), PAL.red);
    } else tag(ctx, 90, 240, 'ОТКРЫТЬ?', appear(t, Wd(57, 'открыть')), PAL.yellow);
    vignette(ctx, .6);
  } })),
  // Правило пятое.
  { t0: C(59), trans: 'flash', draw(ctx, lt, d, t) { ruleCard(ctx, lt, t, 5, 'НЕ ВПУСКАТЬ', true); } },
  // Нельзя впускать всех подряд, даже тех, кто выглядит как человек.
  { t0: C(60), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1.0, 1.08);
    nightBeach(ctx, t, { girl: false, palms: [[110, 1180, 700, .22, 11]] });
    const fx = 600, fy = 1180, h = 560, k = sstep(Wd(60, 'выглядит') - .2, Wd(60, 'человек'), t);
    const zpose = { eyes: 'dot', lean: .15, head: [0, .05], armL: [-1.25, .1], armR: [-1.1, .2] };
    castShadow(ctx, fx, fy, x => girl(x, t, fx, fy, h, {}, 0), .8 * (1 - k));
    castShadow(ctx, fx, fy, x => toon(x, fx, fy, h * 1.05, Object.assign({ face: 0 }, zpose), LOOK.zombie), .85 * k);
    girl(ctx, t, fx, fy, h);
    moonlight(ctx, .5);
    tag(ctx, 90, 240, 'НЕЛЬЗЯ ВПУСКАТЬ', appear(t, Wd(60, 'нельзя')), PAL.red);
    tag(ctx, 90, 316, 'ВСЕХ ПОДРЯД', appear(t, Wd(60, 'всех')), '#ffffff');
    headline(ctx, 'ДАЖЕ ЕСЛИ ПОХОЖ НА ЧЕЛОВЕКА', appear(t, Wd(60, 'даже')), 'y', 470, null, 64);
    vignette(ctx, .6);
  } },
  // — Руки покажи, — говорю я.
  { t0: C(61), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.0, 1.06);
    nightFace(ctx, t, 540, 720, 820, { eyes: 'dot', brow: -.7, look: -.4, mouth: t < E(61) ? MOUTH(t) * .9 : 0 }, ANTON);
    headline(ctx, '«РУКИ ПОКАЖИ»', appear(t, Wd(61, 'руки')), 'y', 260, null, 100);
    vignette(ctx, .6);
  } },
  // Правую она протягивает сразу.
  { t0: C(62), trans: 'cut', draw(ctx, lt, d, t) {
    const out = outBack(clamp((t - Wd(62, 'протягивает')) / .5));
    nightBeach(ctx, t, { x: 540, y: 1800, h: 1250, palms: [], pose: { hideL: 1, armR: [lerp(-.9, 1.25, out), lerp(-1.9, -.25, out)] } });
    moonlight(ctx, .5);
    tag(ctx, 90, 240, 'ПРАВАЯ — СРАЗУ', appear(t, Wd(62, 'правую')), PAL.green);
    checkMark(ctx, 220, 1000, clamp((t - Wd(62, 'сразу')) / .4), 1.3);
    vignette(ctx, .55);
  } },
  // Левую прячет за спину.
  { t0: C(63), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 600, 1100, 1.0, 1.12);
    nightBeach(ctx, t, { girl: false, palms: [] });
    const sh = (noise1(t * 22) - .5) * 8, hide = outc(clamp((t - Wd(63, 'прячет')) / .5));
    const o = toon(ctx, 520 + sh, 1800, 1250, { face: -1, eyes: 'dot', armL: [-.6, -1.4], armR: [lerp(-.3, .5, hide), lerp(-1.2, -1.15, hide)] }, GIRL);
    const hd = o.hands.R.hand;
    glow(ctx, hd[0], hd[1], 220, 'rgba(255,40,30,1)', .5 * hide * (.75 + .25 * Math.sin(t * 7)));
    moonlight(ctx, .45);
    if (hide > .5) { ctx.save(); ctx.globalAlpha = hide; ctx.fillStyle = PAL.red; ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.fillText('?', hd[0] + 170, hd[1] - 60); ctx.restore(); }
    tag(ctx, 90, 240, 'ЛЕВАЯ — ЗА СПИНОЙ', appear(t, Wd(63, 'левую')), PAL.red);
    vignette(ctx, .6);
  } },
  // Я шагаю вперёд.
  { t0: C(64), trans: 'cut', draw(ctx, lt, d, t) {
    const st = inout(clamp((t - Wd(64, 'шагаю')) / .7)), back = outc(clamp((t - Wd(64, 'вперёд')) / .5));
    ctx.save(); ctx.translate(540, 1300); ctx.scale(1 + .12 * st, 1 + .12 * st); ctx.translate(-540, -1300);
    nightBeach(ctx, t, { x: 700, y: 1260 - back * 20, h: 560 - back * 30, palms: [[1000, 1160, 640, -.2, 12]], pose: { hideL: 1, armR: [-.2, -.6], head: [0, .01] } });
    const dark = Object.assign({}, ANTON, { top: '#1b2028', topD: '#151920', legs: '#141820', hair: '#0e0b09', skin: '#2e2622' });
    const o = toon(ctx, 300 + st * 60, 2050, 1500, walkPose(st * Math.PI, 1, .6, { back: 1, armR: [.5, -.9], idle: false }), dark);
    const hd = o.hands.R.hand; logLine(ctx, hd, [hd[0] + 160, hd[1] - 380], 60, true);
    ctx.restore();
    moonlight(ctx, .5);
    tag(ctx, 90, 240, 'ШАГ ВПЕРЁД', appear(t, Wd(64, 'шагаю')), '#ffffff');
    vignette(ctx, .6);
  } },
  // — Левую, — повторяю тише.
  { t0: C(65), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1.05, 1.15);
    nightFace(ctx, t, 540, 680, 1000, { eyes: 'dot', brow: -.9, look: -.3, mouth: t < E(65) ? MOUTH(t) * .5 : 0 }, ANTON);
    headline(ctx, '«ЛЕВУЮ»', appear(t, Wd(65, 'левую')), 'r', 250, 'ТИШЕ', 90);
    tint(ctx, '#6a0808', .3 * Math.max(0, Math.sin(t * 7.3)) ** 6, 'screen');
    vignette(ctx, .7);
  } },
  // Она качает головой.
  { t0: C(66), trans: 'cut', draw(ctx, lt, d, t) {
    const no = sstep(Wd(66, 'качает') - .1, Wd(66, 'качает') + .2, t) * (1 - sstep(E(66), E(66) + .4, t)), sw = Math.sin(t * 9) * no;
    nightFace(ctx, t, 540, 720, 860, { eyes: 'wide', brow: .7, turn: sw * 1.2, look: sw * .8, tears: 1, mouth: .12 }, GIRL);
    vignette(ctx, .6);
  } },
  // — Антон, прошу, не заставляй меня.
  { t0: C(67), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 720, 1.0, 1.08);
    nightFace(ctx, t, 540, 720, 900, { eyes: 'wide', brow: .8, tears: 1, mouth: t < E(67) ? MOUTH(t) : 0, shake: .8 }, GIRL);
    if (t < Wd(67, 'не')) headline(ctx, '«АНТОН, ПРОШУ…»', appear(t, Wd(67, 'антон')), 'y', 250, null, 90);
    else headline(ctx, '«НЕ ЗАСТАВЛЯЙ МЕНЯ»', appear(t, Wd(67, 'не')), 'y', 250, null, 80);
    vignette(ctx, .6);
  } },
  // Я каменею.
  { t0: C(68), trans: 'cut', draw(ctx, lt, d, t) {
    const st = sstep(Wd(68, 'каменею') - .1, Wd(68, 'каменею') + .6, t);
    nightFace(ctx, t, 540, 720, 900, { eyes: 'wide', brow: .3, idle: st < .5, mouth: .05 }, ANTON);
    tint(ctx, '#808080', st, 'saturation'); tint(ctx, '#8d8d8d', st * .35, 'multiply');
    if (st > 0) { ctx.save(); ctx.globalAlpha = st; ctx.strokeStyle = 'rgba(20,20,24,0.8)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const pts of [[[380, 420], [430, 520], [410, 610], [470, 700]], [[700, 480], [660, 560], [690, 640]], [[520, 860], [560, 930], [530, 1010], [580, 1100]]]) { ctx.beginPath(); pts.forEach(([x, y], i) => { const k = clamp(st * 1.4 - i * .2); i ? ctx.lineTo(lerp(pts[i - 1][0], x, k), lerp(pts[i - 1][1], y, k)) : ctx.moveTo(x, y); }); ctx.stroke(); } ctx.restore(); }
    vignette(ctx, .7);
  } },
  // Я ни разу не называл ей своё имя.
  { t0: C(69), trans: 'cut', draw(ctx, lt, d, t) {
    const z = lerp(1, 1.25, inout(clamp(lt / (VOICE_END - C(69)))));
    ctx.save(); ctx.translate(540, 700); ctx.scale(z, z); ctx.translate(-540, -700);
    const red = sstep(Wd(69, 'имя') - .1, Wd(69, 'имя') + .35, t);
    nightFace(ctx, t, 540, 720, 860, { eyes: 'dot', brow: 0, smile: red * .6, idle: true }, GIRL);
    if (red > 0) { ctx.save(); ctx.globalAlpha = red; portrait(ctx, 540, 720, 860, { eyes: 'red', glowK: 1.2, smile: .6 }, GIRL); moonlight(ctx, .35); ctx.restore(); }
    ctx.restore();
    headline(ctx, 'ИМЯ?', appear(t, Wd(69, 'имя')), 'r', 250, null, 120);
    vignette(ctx, .6 + .3 * red);
  } },
  // End card: what is in her left hand?
  { t0: VOICE_END, trans: 'flash', xfade: .3, fadeOut: .8, draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0b0306'], [1, '#020103']]);
    const o = toon(ctx, 560, 1700, 1150, { back: 1, hideL: 0, armL: [.35, -1.0], armR: [-.1, 0], idle: true }, Object.assign({}, GIRL, { top: '#2a2023', topD: '#21191b', legs: '#231b1c', hair: '#0e0908', skin: '#3a2a26' }));
    const hd = o.hands.L.hand;
    glow(ctx, hd[0], hd[1], 260, 'rgba(255,30,20,1)', .55 + .2 * Math.sin(t * 6));
    ctx.fillStyle = '#0a0607'; ell(ctx, hd[0], hd[1], 34, 30); ctx.fill();
    headline(ctx, 'ЧТО У НЕЁ', appear(lt, .2), 'w', 260, null, 110);
    headline(ctx, 'В ЛЕВОЙ РУКЕ?', appear(lt, .45), 'r', 380, null, 110);
    headline(ctx, 'ПРОДОЛЖЕНИЕ СЛЕДУЕТ', appear(lt, 1.2), 'y', 1560, null, 60);
    specks(ctx, t, 40, 77, .3); vignette(ctx, .7);
  } },
);
