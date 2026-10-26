// Episode 3 "The island, part 2" — scene 1 (0:00–1:04.5): the name on the bracelet, rules six and seven.
// Panels start at the pause before a script line (C(n)); Wd(n, 'слово') is the moment a word is spoken.
'use strict';
var XFADE = .2, END = 204.6;
window.OVERLAY = (ctx, t) => captions(ctx, t);
window.POST = { drift: 1, bloom: .45, grain: .1, lift: .3 };
const VOICE_END = 200.2;  // the voiceover ends, the end card follows

// Anton in the dark, seen from behind
const ANTON_DARK = Object.assign({}, ANTON, { top: '#1b2028', topD: '#151920', legs: '#141820', hair: '#0e0b09', skin: '#2e2622' });
const MIRRA = GIRL;

// A fist round the club, filling the frame; tr = how hard it trembles.
function clubFist(ctx, t, tr = 1) {
  const sx = (noise1(t * 26) - .5) * 14 * tr, sy = (noise1(t * 23 + 4) - .5) * 14 * tr;
  ctx.save(); ctx.translate(sx, sy);
  logLine(ctx, [330, 1950], [780, 250], 120, true);
  // forearm from the bottom right, then four fingers wrapped round the club and the thumb over them
  const a = Math.atan2(250 - 1950, 780 - 330), ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, cx = 560, cy = 1080;
  ctx.fillStyle = '#1b2028'; poly(ctx, [[cx + 60, cy + 40], [cx + 200, cy - 60], [W + 100, cy + 520], [W + 100, H + 100], [cx + 500, H + 100]]); ctx.fill();
  ctx.fillStyle = '#5a4840'; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
  rrect(ctx, -170, -40, 340, 220, 90); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = shade('#5a4840', -.06 * (i % 2)); rrect(ctx, -150 + i * 78, -110, 80, 150, 38); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-150 + i * 78 + 74, -100, 6, 120); }
  ctx.fillStyle = '#6a564c'; rrect(ctx, -200, -150, 230, 76, 38); ctx.fill();
  ctx.restore(); void ux; void uy; void nx; void ny;
  ctx.restore();
}

SHOTS.push(
  // Я не называл ей своё имя.
  { t0: 0, fadeIn: .25, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 720, 1.12, 1.2);
    const red = 1 - sstep(.2, .7, lt);
    nightFace(ctx, t, 540, 720, 860, { eyes: 'dot', brow: .2 }, MIRRA);
    if (red > 0) { ctx.save(); ctx.globalAlpha = red; portrait(ctx, 540, 720, 860, { eyes: 'red', glowK: 1.2, smile: .6 }, MIRRA); moonlight(ctx, .35); ctx.restore(); }
    headline(ctx, 'ОНА ЗНАЕТ МОЁ ИМЯ', appear(t, Wd(1, 'имя')), 'r', 250, null, 84);
    vignette(ctx, .7);
  } },
  // Дубина дрожит в руке.
  { t0: C(2), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0a0e18'], [1, '#04060a']]);
    clubFist(ctx, t, 1);
    moonlight(ctx, .45);
    tag(ctx, 90, 240, 'ДУБИНА', appear(t, Wd(2, 'дубина')), '#ffffff');
    tag(ctx, 90, 316, 'ДРОЖИТ', appear(t, Wd(2, 'дрожит')), PAL.red);
    vignette(ctx, .7);
  } },
  // — Откуда ты знаешь? — спрашиваю.
  { t0: C(3), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 720, 1.0, 1.08);
    nightFace(ctx, t, 540, 720, 860, { eyes: 'dot', brow: -.8, look: -.3, mouth: t < Wd(3, 'спрашиваю') ? MOUTH(t) : 0 }, ANTON);
    headline(ctx, '«ОТКУДА ТЫ ЗНАЕШЬ?»', appear(t, Wd(3, 'откуда')), 'y', 250, null, 84);
    vignette(ctx, .6);
  } },
  // — На твоём браслете. Там выбито имя.
  { t0: C(4), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 720, 1.0, 1.06);
    nightFace(ctx, t, 540, 720, 860, { eyes: 'wide', brow: .7, look: .4 * sstep(Wd(4, 'браслете'), Wd(4, 'браслете') + .4, t), mouth: MOUTH(t), tears: 1 }, MIRRA);
    if (t < Wd(4, 'там')) headline(ctx, '«НА ТВОЁМ БРАСЛЕТЕ»', appear(t, Wd(4, 'на')), 'y', 250, null, 84);
    else headline(ctx, '«ТАМ ВЫБИТО ИМЯ»', appear(t, Wd(4, 'там')), 'y', 250, null, 84);
    vignette(ctx, .6);
  } },
  // Я видела его в самолёте.
  { t0: C(5), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 300, 900, 1.0, 1.14);
    ctx.translate(0, -260);
    cabin(ctx, t, { extra: x => {
      const o = toon(x, 300, 1560, 760, { sit: 'front', eyes: 'dot', armR: [-.4, -1.4], armL: [.3, -.2] }, ANTON);
      const hd = o.hands.R.hand; x.fillStyle = '#2c3e5c'; rrect(x, hd[0] - 30, hd[1] - 50, 60, 36, 10); x.fill();
      glow(x, hd[0], hd[1] - 32, 120, 'rgba(255,255,255,1)', .5 + .3 * Math.sin(t * 5));
      x.save(); x.strokeStyle = PAL.yellow; x.lineWidth = 8; x.setLineDash([16, 10]); x.lineDashOffset = -t * 30; ell(x, hd[0], hd[1] - 32, 90, 70); x.stroke(); x.restore();
      toon(x, 860, 1460, 640, { sit: 'front', eyes: 'dot', head: [-.03, 0] }, MIRRA);
    } });
    tint(ctx, '#808080', .55, 'saturation'); tint(ctx, '#c9a37a', .35, 'multiply');
    tag(ctx, 90, 140, 'В САМОЛЁТЕ', appear(lt, .15), PAL.yellow, 'ВОСПОМИНАНИЕ');
    vignette(ctx, .55);
  } },
  // Смотрю на запястье.
  { t0: C(6), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 620, 880, 1.0, 1.1);
    wrist(ctx, t, {});
    braceletOn(ctx, 600, 1, sstep(Wd(6, 'запястье'), Wd(6, 'запястье') + .4, t));
    moonlight(ctx, .45);
    tag(ctx, 90, 240, 'ЗАПЯСТЬЕ', appear(t, Wd(6, 'запястье')), '#ffffff');
    vignette(ctx, .55);
  } },
  // Правда. Медицинский браслет.
  { t0: C(7), trans: 'zoom', draw(ctx, lt, d, t) {
    braceletPlate(ctx, t, clamp(lt / .35));
    moonlight(ctx, .3);
    tag(ctx, 90, 240, 'МЕДИЦИНСКИЙ БРАСЛЕТ', appear(t, Wd(7, 'медицинский')), PAL.green);
    checkMark(ctx, 880, 470, clamp((t - Wd(7, 'правда')) / .4), 1.3);
    vignette(ctx, .55);
  } },
  // Выдыхаю, но дубину не опускаю.
  { t0: C(8), trans: 'whip', draw(ctx, lt, d, t) {
    nightBeach(ctx, t, { x: 720, y: 1260, h: 540, palms: [[1000, 1160, 640, -.2, 12]], pose: { armL: [.2, 0], armR: [-.2, 0] } });
    const o = toon(ctx, 300, 2050, 1500, { back: 1, armR: [2.3, -.6], armL: [-.3, .2], idle: true }, ANTON_DARK);
    const hd = o.hands.R.hand; logLine(ctx, hd, [hd[0] + 120, hd[1] - 420], 60, true);
    const b = t - Wd(8, 'выдыхаю');
    if (b > 0 && b < 1.6) { const hp = o.head; for (let i = 0; i < 5; i++) { const u = clamp(b / 1.6 - i * .08); glow(ctx, hp[0] + 60 + u * 260, hp[1] - 30 - u * 120 + i * 10, 60 + u * 140, 'rgba(220,230,255,1)', .22 * (1 - u), 'source-over'); } }
    moonlight(ctx, .5);
    tag(ctx, 90, 240, 'ВЫДЫХАЮ', appear(t, Wd(8, 'выдыхаю')), '#7fb0ff');
    tag(ctx, 90, 316, 'ДУБИНУ НЕ ОПУСКАЮ', appear(t, Wd(8, 'дубину')), PAL.red);
    vignette(ctx, .6);
  } },
  // Правило шестое.
  { t0: C(9), trans: 'flash', draw(ctx, lt, d, t) { ruleCard(ctx, lt, t, 6, 'РАНЫ'); } },
  // Рана не всегда значит укус.
  { t0: C(10), trans: 'whip', draw(ctx, lt, d, t) {
    skinPatch(ctx, '#e7c6b0', 4);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(536, 0, 8, H);
    cutWound(ctx, [120, 760], [440, 700], clamp((t - Wd(10, 'рана')) / .5));
    biteMark(ctx, t, 810, 740, .9, clamp((t - Wd(10, 'укус')) / .4));
    const k = outBack(clamp((t - Wd(10, 'не')) / .3));
    ctx.save(); ctx.translate(540, 730); ctx.scale(k, k); ctx.fillStyle = '#0c0f16'; ell(ctx, 0, 0, 80, 80); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '900 110px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('≠', 0, 6); ctx.restore();
    headline(ctx, 'РАНА ≠ УКУС', appear(t, Wd(10, 'не')), 'w', 250, null, 100);
    ctx.save(); ctx.globalAlpha = appear(t, Wd(10, 'укус')); ctx.fillStyle = PAL.red; ctx.font = '900 80px Inter'; ctx.textAlign = 'center'; ctx.fillText('УКУС', 810, 450); ctx.restore();
    ctx.save(); ctx.globalAlpha = appear(t, Wd(10, 'рана')); ctx.fillStyle = '#2a2418'; ctx.font = '900 80px Inter'; ctx.textAlign = 'center'; ctx.fillText('ПОРЕЗ', 280, 450); ctx.restore();
    vignette(ctx, .45);
  } },
  // Укус оставляет дугу из следов зубов.
  { t0: C(11), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.0, 1.08);
    skinPatch(ctx, '#e7c6b0', 5);
    biteMark(ctx, t, 540, 760, 1.9, clamp((t - Wd(11, 'укус')) / 1.6));
    const a = clamp((t - Wd(11, 'дугу')) / .6);
    if (a > 0) { ctx.save(); ctx.strokeStyle = PAL.yellow; ctx.lineWidth = 8; ctx.setLineDash([20, 14]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.ellipse(540, 790, 260, 150, 0, Math.PI, Math.PI + Math.PI * a); ctx.stroke(); ctx.beginPath(); ctx.ellipse(540, 790, 260, 150, 0, 0, Math.PI * a); ctx.stroke(); ctx.restore(); }
    tag(ctx, 90, 240, 'ДУГА', appear(t, Wd(11, 'дугу')), PAL.yellow);
    tag(ctx, 90, 316, 'СЛЕДЫ ЗУБОВ', appear(t, Wd(11, 'зубов')), PAL.red);
    vignette(ctx, .45);
  } },
  // Порез или царапина дуги не оставляют.
  { t0: C(12), trans: 'cut', draw(ctx, lt, d, t) {
    skinPatch(ctx, '#e7c6b0', 6);
    cutWound(ctx, [140, 560], [940, 470], clamp((t - Wd(12, 'порез')) / .5));
    scratches(ctx, 540, 900, 1.2, clamp((t - Wd(12, 'царапина')) / .5));
    const x = outBack(clamp((t - Wd(12, 'оставляют')) / .35));
    if (x > 0) { ctx.save(); ctx.translate(540, 720); ctx.scale(x, x); ctx.strokeStyle = PAL.yellow; ctx.lineWidth = 8; ctx.setLineDash([20, 14]); ctx.beginPath(); ctx.ellipse(0, 40, 300, 170, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.strokeStyle = PAL.red; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-160, -120); ctx.lineTo(160, 200); ctx.moveTo(160, -120); ctx.lineTo(-160, 200); ctx.stroke(); ctx.restore(); }
    tag(ctx, 90, 240, 'ПОРЕЗ', appear(t, Wd(12, 'порез')), '#ffffff');
    tag(ctx, 90, 316, 'ЦАРАПИНА', appear(t, Wd(12, 'царапина')), '#ffffff');
    tag(ctx, 90, 392, 'ДУГИ НЕТ', appear(t, Wd(12, 'оставляют')), PAL.green);
    vignette(ctx, .45);
  } },
  // При свете костра она разматывает повязку.
  { t0: C(13), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1100, 1.0, 1.08);
    island(ctx, t, { tod: 'night', hz: 760, shore: 1000, palms: [[90, 1100, 680, .22, 11]], moon: [880, 200] });
    const un = clamp((t - Wd(13, 'разматывает')) / .8);
    const o = toon(ctx, 660, 1400, 760, { sit: 'front', eyes: 'down', armL: [.9, -1.6], armR: [-.4, -1.2] }, MIRRA);
    const hd = o.hands.L.hand;
    ctx.strokeStyle = '#f4efe4'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hd[0] - 10, hd[1]);
    for (let i = 1; i <= 12; i++) { const u = i / 12; ctx.lineTo(hd[0] - 10 - u * 120 * un + Math.sin(u * 6 + t * 3) * 26 * un, hd[1] + u * 380 * un); } ctx.stroke();
    campfire(ctx, t, 300, 1640, 1.1);
    firelight(ctx, t, 330, 1500, 1100);
    tag(ctx, 90, 240, 'КОСТЁР', appear(t, Wd(13, 'костра')), PAL.yellow);
    tag(ctx, 90, 316, 'СНИМАЕТ ПОВЯЗКУ', appear(t, Wd(13, 'разматывает')), '#ffffff');
    vignette(ctx, .55);
  } },
  // Глубокий ровный порез — видимо, от обшивки самолёта.
  { t0: C(14), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.0, 1.06);
    skinPatch(ctx, '#e7c6b0', 7);
    cutWound(ctx, [120, 820], [960, 700], clamp((t - Wd(14, 'глубокий')) / .7), 26);
    const m = outBack(clamp((t - Wd(14, 'обшивки')) / .4));
    if (m > 0) { ctx.save(); ctx.translate(800, 380); ctx.scale(m, m); ctx.rotate(-.12);
      ctx.fillStyle = '#c9cdd3'; poly(ctx, [[-220, -110], [200, -130], [230, 60], [120, 40], [60, 110], [-20, 50], [-120, 120], [-230, 70]]); ctx.fill();
      ctx.fillStyle = '#9aa0a8'; for (const [x, y] of [[-170, -70], [-70, -80], [40, -90], [150, -95]]) { ell(ctx, x, y, 9, 9); ctx.fill(); }
      ctx.strokeStyle = PAL.blood; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(60, 110); ctx.lineTo(120, 40); ctx.stroke();
      ctx.restore(); ctx.save(); ctx.globalAlpha = m; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(800, 500); ctx.lineTo(620, 730); ctx.stroke(); ctx.restore(); }
    firelight(ctx, t, 300, 1500, 1400, .6);
    tag(ctx, 90, 240, 'ГЛУБОКИЙ', appear(t, Wd(14, 'глубокий')), '#ffffff');
    tag(ctx, 90, 316, 'РОВНЫЙ', appear(t, Wd(14, 'ровный')), '#ffffff');
    tag(ctx, 90, 392, 'ОБШИВКА САМОЛЁТА', appear(t, Wd(14, 'обшивки')), PAL.yellow);
    vignette(ctx, .5);
  } },
  // Зубов нет.
  { t0: C(15), trans: 'cut', draw(ctx, lt, d, t) {
    skinPatch(ctx, '#e7c6b0', 7);
    cutWound(ctx, [120, 820], [960, 700], 1, 26);
    const sy = lerp(500, 1100, (lt * 1.2) % 1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, sy - 50, 0, sy + 50); g.addColorStop(0, 'rgba(60,255,140,0)'); g.addColorStop(.5, 'rgba(60,255,140,0.45)'); g.addColorStop(1, 'rgba(60,255,140,0)'); ctx.fillStyle = g; ctx.fillRect(0, sy - 50, W, 100); ctx.restore();
    firelight(ctx, t, 300, 1500, 1400, .6);
    headline(ctx, 'ЗУБОВ НЕТ', appear(t, Wd(15, 'зубов')), 'n', 330, null, 110);
    checkMark(ctx, 540, 1480, clamp((t - Wd(15, 'нет')) / .4), 2);
    vignette(ctx, .5);
  } },
  // Но одной руки мало.
  { t0: C(16), trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#101826'], [1, '#080b12']]);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const o = toon(ctx, 540, 1700, 1200, { eyes: 'dot', armL: [-.35, 0], armR: [.35, 0], idle: true, noShadow: true }, Object.assign({}, MIRRA, { top: '#3a4a66', topD: '#33425c', legs: '#2c3850', skin: '#6b7a96', hair: '#26324a', shoes: '#1c2436' }));
    const hl = o.hands.L.hand; glow(ctx, hl[0], hl[1] - 100, 200, 'rgba(60,255,140,1)', .5); checkMark(ctx, hl[0] - 40, hl[1] - 160, 1, 1);
    const q = appear(t, Wd(16, 'мало'));
    if (q > 0) { ctx.save(); ctx.globalAlpha = q; ctx.fillStyle = PAL.yellow; ctx.font = '900 110px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const [x, y] of [[540, 520], [760, 900], [430, 760], [470, 1450], [640, 1450]]) ctx.fillText('?', x + Math.sin(t * 3 + x) * 6, y); ctx.restore(); }
    headline(ctx, 'ОДНОЙ РУКИ МАЛО', appear(t, Wd(16, 'одной')), 'y', 250, null, 90);
  } },
  // Правило седьмое.
  { t0: C(17), trans: 'flash', draw(ctx, lt, d, t) { ruleCard(ctx, lt, t, 7, 'ВСЁ ТЕЛО'); } },
  // Проверяй всё тело: шея, плечи, спина, ноги.
  { t0: C(18), trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#101826'], [1, '#080b12']]);
    const look = Object.assign({}, MIRRA, { top: '#3a4a66', topD: '#33425c', legs: '#2c3850', skin: '#6b7a96', hair: '#26324a', shoes: '#1c2436' });
    toon(ctx, 330, 1600, 1000, { eyes: 'dot', armL: [-.35, 0], armR: [.35, 0], noShadow: true }, look);
    toon(ctx, 780, 1600, 1000, { back: 1, armL: [-.35, 0], armR: [.35, 0], noShadow: true }, look);
    const mark = (x, y, k, label, lx) => { if (k <= 0) return; const a = outBack(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.strokeStyle = PAL.yellow; ctx.lineWidth = 8; ell(ctx, 0, 0, 56, 56); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.globalAlpha = clamp(k); ctx.fillStyle = PAL.yellow; ctx.font = '900 44px Inter'; ctx.textAlign = 'center'; ctx.fillText(label, lx ?? x, y - 80); ctx.restore(); };
    mark(330, 1600 - 780, (t - Wd(18, 'шея')) / .3, 'ШЕЯ');
    mark(330 + 100, 1600 - 740, (t - Wd(18, 'плечи')) / .3, ''); mark(330 - 100, 1600 - 740, (t - Wd(18, 'плечи')) / .3, 'ПЛЕЧИ', 230);
    mark(780, 1600 - 620, (t - Wd(18, 'спина')) / .3, 'СПИНА');
    mark(780 - 50, 1600 - 200, (t - Wd(18, 'ноги')) / .3, ''); mark(330 + 50, 1600 - 200, (t - Wd(18, 'ноги')) / .3, 'НОГИ', 540);
    headline(ctx, 'ВСЁ ТЕЛО', appear(t, Wd(18, 'тело')), 'y', 250, null, 100);
  } },
  // Я прошу её повернуться, поднять волосы, закатать штанины.
  { t0: C(19), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1100, 1.0, 1.05);
    island(ctx, t, { tod: 'night', hz: 760, shore: 1000, palms: [[90, 1100, 680, .22, 11]], moon: [880, 200] });
    const turned = t > Wd(19, 'повернуться') + .25, hair = sstep(Wd(19, 'поднять'), Wd(19, 'поднять') + .5, t), roll = sstep(Wd(19, 'закатать'), Wd(19, 'закатать') + .5, t);
    const squash = 1 - .3 * Math.max(0, 1 - Math.abs(t - Wd(19, 'повернуться') - .25) / .15);
    ctx.save(); ctx.translate(560, 1560); ctx.scale(squash, 1); ctx.translate(-560, -1560);
    const o = toon(ctx, 560, 1560, 900, turned ? { back: 1, armL: [-.2, 0], armR: [hair * 2.9, hair * -.4] } : { eyes: 'dot', armL: [-.2, 0], armR: [.2, 0] }, MIRRA);
    if (turned && hair > 0) { ctx.fillStyle = shade(MIRRA.skin, -.15); rrect(ctx, o.head[0] - 30, o.head[1] + o.R * .7, 60, 70 * hair, 14); ctx.fill(); }
    if (roll > 0) { ctx.fillStyle = MIRRA.skin; for (const k of [-1, 1]) { rrect(ctx, 560 + k * 47 - 30, 1560 - 120 * roll - 30, 60, 120 * roll + 10, 20); ctx.fill(); } }
    ctx.restore();
    campfire(ctx, t, 220, 1640, .9);
    firelight(ctx, t, 260, 1500, 1100);
    tag(ctx, 90, 240, 'ПОВЕРНУТЬСЯ', appear(t, Wd(19, 'повернуться')), '#ffffff');
    tag(ctx, 90, 316, 'ПОДНЯТЬ ВОЛОСЫ', appear(t, Wd(19, 'поднять')), '#ffffff');
    tag(ctx, 90, 392, 'ЗАКАТАТЬ ШТАНИНЫ', appear(t, Wd(19, 'закатать')), '#ffffff');
    vignette(ctx, .55);
  } },
  // Подходить не собираюсь — смотрю издали.
  { t0: C(20), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1100, 1.0, 1.04);
    island(ctx, t, { tod: 'night', hz: 700, shore: 930, palms: [], moon: [880, 200], extra: x => {
      shelter(x, t, 250, 1180, 360, { floor: 1, rope: 1, cans: 1, swing: -1, night: true });
      toon(x, 330, 1230, 300, { face: 1, eyes: 'dot', armR: [2.2, -.5] }, ANTON);
      toon(x, 860, 1250, 260, { sit: 'front', eyes: 'dot' }, MIRRA);
      campfire(x, t, 760, 1280, .55);
    } });
    firelight(ctx, t, 760, 1240, 700, .9);
    const k = clamp((t - Wd(20, 'издали')) / .5);
    if (k > 0) { ctx.save(); ctx.strokeStyle = PAL.yellow; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(400, 1100); ctx.lineTo(lerp(400, 820, k), 1100); ctx.stroke(); ctx.restore(); }
    tag(ctx, 90, 240, 'НЕ ПОДХОЖУ', appear(t, Wd(20, 'подходить')), PAL.red);
    tag(ctx, 90, 316, 'СМОТРЮ ИЗДАЛИ', appear(t, Wd(20, 'издали')), PAL.yellow);
    vignette(ctx, .55);
  } },
  // Всё чисто.  /  Но чистый осмотр — ещё не гарантия.
  ...[21, 22].map(n => ({ t0: C(n), trans: n === 21 ? 'whip' : 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0e1322'], [1, '#05070d']]);
    ctx.save(); ctx.translate(540, 700); ctx.rotate(-.02);
    ctx.fillStyle = '#efe6cf'; rrect(ctx, -400, -420, 800, 820, 24); ctx.fill();
    ctx.fillStyle = '#2a2418'; ctx.font = '900 60px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ОСМОТР', 0, -330);
    const doubt = n === 22 ? sstep(Wd(22, 'гарантия') - .3, Wd(22, 'гарантия') + .3, t) : 0;
    ['ШЕЯ', 'ПЛЕЧИ', 'СПИНА', 'НОГИ'].forEach((lab, i) => { const y = -190 + i * 150;
      ctx.fillStyle = 'rgba(42,36,24,0.1)'; rrect(ctx, -340, y - 55, 680, 110, 20); ctx.fill();
      ctx.fillStyle = '#2a2418'; ctx.font = '900 54px Inter'; ctx.textAlign = 'left'; ctx.fillText(lab, -290, y + 2);
      checkMark(ctx, 260, y - 6, n === 21 ? clamp((t - Wd(21, 'всё') - i * .12) / .3) : 1, 1.1, doubt > .5 ? '#9aa0a8' : PAL.green); });
    ctx.restore();
    if (n === 21) headline(ctx, 'ЧИСТО', appear(t, Wd(21, 'чисто')), 'n', 1520, null, 110);
    else {
      const k = clamp((t - Wd(22, 'гарантия') + .1) / .2), sc = lerp(2.2, 1, outc(k));
      if (k > 0) { ctx.save(); ctx.translate(560, 720); ctx.rotate(-.14); ctx.scale(sc, sc); ctx.globalAlpha = k * .92; ctx.strokeStyle = PAL.red; ctx.lineWidth = 18; rrect(ctx, -390, -120, 780, 240, 26); ctx.stroke();
        ctx.fillStyle = PAL.red; ctx.font = '900 96px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('НЕ ГАРАНТИЯ', 0, 8); ctx.restore(); }
    }
    specks(ctx, t, 30, 61, .3);
  } })),
);
