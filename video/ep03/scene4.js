// Episode 3, scene 4 (2:46.4–3:24.6): rule ten, the fatal mistake, the bite under the sleeve, 71 hours, the end card.
'use strict';

// A blue diagram of Mirra, mirrored so her right arm is on our left. Returns her hands.
function mirraChart(ctx, x, y, h, pose = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1);
  const o = toon(ctx, 0, 0, h, Object.assign({ eyes: 'dot', armL: [-.35, 0], armR: [.35, 0], noShadow: true }, pose), Object.assign({}, MIRRA, { top: '#3a4a66', topD: '#33425c', legs: '#2c3850', skin: '#6b7a96', hair: '#26324a', shoes: '#1c2436' }));
  ctx.restore();
  const fl = p => [x - p[0], y + p[1]];
  return { her_right: fl(o.hands.R.hand), her_left: fl(o.hands.L.hand) };
}

function gridBg(ctx) {
  vgrad(ctx, 0, 0, W, H, [[0, '#101826'], [1, '#080b12']]);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

// "My rules": ten short rows, all ticked; the missed one glows red when miss > 0.
function myRules(ctx, t, miss = 0) {
  ctx.save(); ctx.translate(540, 680); ctx.rotate(-.025);
  ctx.fillStyle = '#efe6cf'; rrect(ctx, -400, -520, 800, 1040, 24); ctx.fill();
  ctx.fillStyle = '#2a2418'; ctx.font = '900 60px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('МОИ ПРАВИЛА', 0, -440);
  for (let k = 0; k < 10; k++) { const y = -340 + k * 84, bad = k === 9 && miss > 0;
    ctx.fillStyle = bad ? PAL.red : '#2a2418'; ctx.font = '900 40px Inter'; ctx.textAlign = 'left'; ctx.fillText(`${k + 1}.`, -330, y);
    ctx.fillStyle = bad ? 'rgba(232,70,60,0.35)' : 'rgba(42,36,24,0.25)'; rrect(ctx, -250, y - 14, [400, 340, 440, 300, 380, 420, 360, 330, 400, 360][k], 28, 14); ctx.fill();
    if (!bad) checkMark(ctx, 300, y - 4, 1, .7); }
  if (miss > 0) { const p = .5 + .5 * Math.sin(t * 9); ctx.globalAlpha = miss * (.5 + .5 * p); ctx.strokeStyle = PAL.red; ctx.lineWidth = 8; rrect(ctx, -360, -340 + 9 * 84 - 44, 720, 88, 18); ctx.stroke();
    ctx.fillStyle = PAL.red; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.fillText('?', 300, -340 + 9 * 84); }
  ctx.restore();
}

SHOTS.push(
  // Правило десятое.
  { t0: C(60), trans: 'flash', draw(ctx, lt, d, t) { ruleCard(ctx, lt, t, 10, 'ОБЕ РУКИ', true); } },
  // Проверяй обе руки.
  { t0: C(61), trans: 'whip', draw(ctx, lt, d, t) {
    gridBg(ctx);
    const hs = mirraChart(ctx, 540, 1700, 1200, { armL: [-2.6, -.3], armR: [2.6, .3] });
    const both = clamp((t - Wd(61, 'обе')) / .3);
    for (const [p, ok] of [[hs.her_left, true], [hs.her_right, false]]) {
      if (both > 0) { ctx.save(); ctx.globalAlpha = both; ctx.strokeStyle = ok ? PAL.green : PAL.red; ctx.lineWidth = 10; ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t * 40; ell(ctx, p[0], p[1] + 60, 120 * (1 + .05 * Math.sin(t * 6)), 170); ctx.stroke(); ctx.restore(); }
    }
    checkMark(ctx, hs.her_left[0] + 150, hs.her_left[1] + 40, clamp((t - Wd(61, 'проверяй')) / .4), 1.2);
    if (both > 0) { ctx.save(); ctx.globalAlpha = both; ctx.fillStyle = PAL.red; ctx.font = '900 130px Inter'; ctx.textAlign = 'center'; ctx.fillText('?', hs.her_right[0] - 150, hs.her_right[1] + 90); ctx.restore(); }
    ctx.fillStyle = '#c8cfe0'; ctx.font = '900 44px Inter'; ctx.textAlign = 'center';
    ctx.fillText('ПРАВАЯ', hs.her_right[0], 1820); ctx.fillText('ЛЕВАЯ', hs.her_left[0], 1820);
    headline(ctx, 'ОБЕ РУКИ', appear(t, Wd(61, 'обе')), 'r', 250, null, 110);
  } },
  // Я допустил фатальную ошибку.
  { t0: C(62), trans: 'cut', draw(ctx, lt, d, t) {
    const z = inout(clamp(lt / d));
    ctx.save(); ctx.translate(540, 900); ctx.scale(1.25 - .25 * z, 1.25 - .25 * z); ctx.translate(-540, -900);
    island(ctx, t, { tod: 'day', hz: 1100, shore: 1400, palms: [[150, 1500, 800, .22, 9], [930, 1480, 740, -.2, 10]] });
    ctx.restore();
    portrait(ctx, 540, 760, 760 * (1 + .22 * z), { eyes: 'wide', brow: .9, mouth: .25 }, ANTON);
    tint(ctx, '#5a0606', .3 * Math.max(0, Math.sin(t * 7.3)) ** 6, 'screen');
    headline(ctx, 'ФАТАЛЬНАЯ ОШИБКА', appear(t, Wd(62, 'фатальную')), 'r', 250, null, 96);
    vignette(ctx, .5);
  } },
  // Правую руку я даже не осмотрел.
  { t0: C(63), trans: 'cut', draw(ctx, lt, d, t) {
    gridBg(ctx);
    const hs = mirraChart(ctx, 540, 1700, 1200);
    glow(ctx, hs.her_left[0], hs.her_left[1] - 120, 200, 'rgba(60,255,140,1)', .45); checkMark(ctx, hs.her_left[0] + 40, hs.her_left[1] - 200, 1, 1);
    const p = .6 + .4 * Math.sin(t * 8), k = clamp((t - Wd(63, 'правую')) / .3);
    glow(ctx, hs.her_right[0], hs.her_right[1] - 120, 260, 'rgba(255,40,30,1)', .6 * k * p);
    ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = PAL.red; ctx.font = '900 140px Inter'; ctx.textAlign = 'center'; ctx.fillText('?', hs.her_right[0] - 60, hs.her_right[1] - 200); ctx.restore();
    tag(ctx, 90, 240, 'ПРАВАЯ РУКА', appear(t, Wd(63, 'правую')), PAL.red);
    tag(ctx, 90, 316, 'НЕ ОСМОТРЕЛ', appear(t, Wd(63, 'осмотрел')), '#ffffff');
  } },
  // Из-за одной пропущенной детали
  { t0: C(64), trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#121826'], [1, '#080a10']]);
    push(ctx, lt, d, 540, 1000, 1.0, 1.06);
    myRules(ctx, t, clamp((t - Wd(64, 'одной')) / .3));
    tag(ctx, 90, 1480, 'ОДНА ДЕТАЛЬ', appear(t, Wd(64, 'одной')), PAL.red);
    vignette(ctx, .6);
  } },
  // все мои правила, весь лагерь и все расчёты теряют смысл.
  { t0: C(65), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#121826'], [1, '#080a10']]);
    const fall = Math.max(0, t - Wd(65, 'теряют') + .1);
    const item = (i, word, draw) => { const k = outBack(clamp((t - Wd(65, word)) / .35)); if (k <= 0) return;
      const x = [280, 800, 540][i], y = [520, 560, 960][i], dy = fall * fall * (900 + i * 200), rot = fall * (i - 1 + .5) * 1.2;
      ctx.save(); ctx.translate(x, y + dy); ctx.rotate(rot); ctx.scale(k, k); ctx.globalAlpha = 1 - clamp(fall * .9); draw();
      if (fall > 0) { ctx.strokeStyle = '#0b0d12'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-120, -140); ctx.lineTo(-20, -20); ctx.lineTo(-60, 60); ctx.lineTo(30, 150); ctx.stroke(); }
      ctx.restore(); };
    item(0, 'правила', () => { ctx.fillStyle = '#efe6cf'; rrect(ctx, -170, -220, 340, 440, 18); ctx.fill(); ctx.fillStyle = 'rgba(42,36,24,0.3)'; for (let k = 0; k < 6; k++) { rrect(ctx, -120, -150 + k * 60, 240, 20, 10); ctx.fill(); } ctx.fillStyle = '#2a2418'; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.fillText('ПРАВИЛА', 0, -180); });
    item(1, 'лагерь', () => { shelter(ctx, t, 0, 160, 330, { floor: 1 }); });
    item(2, 'расчёты', () => { ctx.fillStyle = '#1b2030'; rrect(ctx, -260, -120, 520, 240, 30); ctx.fill(); ctx.fillStyle = PAL.red; ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('72:00', 0, 6); });
    tint(ctx, '#808080', clamp(fall * 1.2), 'saturation');
    headline(ctx, 'ТЕРЯЮТ СМЫСЛ', appear(t, Wd(65, 'смысл')), 'r', 1480, null, 100);
    vignette(ctx, .6);
  } },
  // Рукав задирается, а под ним — следы зубов.
  { t0: C(66), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 500, 880, 1.0, 1.12);
    wrist(ctx, t, { look: MIRRA, bare: true });
    biteMark(ctx, t, 400, 870, .95, 1, .6, sstep(Wd(66, 'следы'), Wd(66, 'зубов') + .8, t));
    // her sleeve slides back up the arm
    const sx = anim(t, [[Wd(66, 'рукав'), 720], [Wd(66, 'следы') - .7, 600], [Wd(66, 'следы') + .2, 60]]);
    ctx.fillStyle = MIRRA.top; poly(ctx, [[-60, 760], [sx, 760], [sx + 30, 800], [sx - 10, 850], [sx + 20, 910], [sx, 1000], [-60, 1000]]); ctx.fill();
    ctx.fillStyle = MIRRA.topD; ctx.fillRect(-60, 960, sx + 60, 40);
    const a = clamp((t - Wd(66, 'следы')) / .5);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = PAL.red; ctx.lineWidth = 8; ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t * 40; ell(ctx, 400, 880, 200, 140); ctx.stroke(); ctx.restore(); }
    headline(ctx, 'СЛЕДЫ ЗУБОВ', appear(t, Wd(66, 'следы')), 'r', 300, null, 110);
    tag(ctx, 90, 140, 'РУКАВ', appear(t, Wd(66, 'рукав')), '#ffffff');
    vignette(ctx, .5);
  } },
  // Свежие.
  { t0: C(67), trans: 'cut', draw(ctx, lt, d, t) {
    const [sx, sy] = shake(t, [[Wd(67, 'свежие'), 1.2]], 18);
    ctx.save(); ctx.translate(sx, sy);
    push(ctx, lt, d, 540, 820, 1.0, 1.1);
    skinPatch(ctx, MIRRA.skin, 9);
    biteMark(ctx, t, 540, 820, 2.3, 1, clamp((t - Wd(67, 'свежие') + .2) / .8), .3 + .5 * clamp(lt / d));
    ctx.restore();
    if (t > Wd(67, 'свежие') && t < Wd(67, 'свежие') + .3) tint(ctx, '#ff2010', .35 * (1 - (t - Wd(67, 'свежие')) / .3), 'screen');
    headline(ctx, 'СВЕЖИЕ', appear(t, Wd(67, 'свежие')), 'r', 300, null, 150);
    vignette(ctx, .55);
  } },
  // — Прости. Я боялась, что ты оставишь меня одну.
  { t0: C(68), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.0, 1.08);
    island(ctx, t, { tod: 'dusk', hz: 1100, shore: 1400, sun: [800, 1060], palms: [] });
    portrait(ctx, 540, 760, 820, { eyes: 'wide', brow: .9, tears: 1, sick: .7, mouth: t < E(68) ? MOUTH(t) : 0, shake: .6 }, Object.assign({}, MIRRA, { skin: mixHex(MIRRA.skin, '#b9b6b0', .6) }));
    if (t < Wd(68, 'я')) headline(ctx, '«ПРОСТИ»', appear(t, Wd(68, 'прости')), 'y', 250, null, 110);
    else headline(ctx, '«НЕ ХОТЕЛА ОСТАТЬСЯ ОДНА»', appear(t, Wd(68, 'я')), 'y', 250, null, 70);
    vignette(ctx, .5);
  } },
  // Рация в рюкзаке хрипит:
  { t0: C(69), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.08);
    sandTop(ctx, 10);
    backpack(ctx, t, 540, 1150, 1.1, { radio: 1, cans: 1 });
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 6; for (let i = 0; i < 3; i++) { const u = (t * 1.2 + i / 3) % 1; ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.arc(540 + 130 * 1.1, 1150 - 640 * 1.1, 40 + u * 200, -2.6, -.5); ctx.stroke(); } ctx.restore();
    tag(ctx, 90, 240, 'РАЦИЯ ХРИПИТ', appear(t, Wd(69, 'хрипит')), PAL.yellow);
    vignette(ctx, .4);
  } },
  // «Осталось семьдесят один час».
  { t0: C(70), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 820, 1.04, 1.12);
    radioClose(ctx, t, .35 + .25 * noise1(t * 3), t > Wd(70, 'семьдесят') ? t - Wd(70, 'семьдесят') : null, 71 * 3600);
    headline(ctx, '«ОСТАЛОСЬ 71 ЧАС»', appear(t, Wd(70, 'осталось')), 'r', 280, null, 90);
  } },
  // End card: what to do with Mirra?
  { t0: VOICE_END, trans: 'flash', xfade: .3, fadeOut: .8, draw(ctx, lt, d, t) {
    island(ctx, t, { tod: 'dusk', hz: 1000, shore: 1250, sun: [540, 960], palms: [[90, 1340, 760, .22, 9], [1000, 1320, 700, -.2, 10]], extra: x => {
      silhouette(x, y => { lying(y, t, 540, 1440, 420, MIRRA, { up: .85, eyes: 'open' }); const o = toon(y, 330, 1440, 480, { face: 1, armR: [.9, -.5], noShadow: true }, ANTON); logLine(y, o.hands.R.hand, [o.hands.R.hand[0] + 110, o.hands.R.hand[1] + 120], 22); }, '#1d1016');
    } });
    headline(ctx, 'ЧТО ДЕЛАТЬ', appear(lt, .2), 'w', 260, null, 110);
    headline(ctx, 'С МИРРОЙ?', appear(lt, .45), 'r', 380, null, 110);
    headline(ctx, 'НАПИШИ В КОММЕНТАРИЯХ', appear(lt, .9), 'w', 520, null, 44);
    const left = 71 * 3600 - (t - Wd(70, 'семьдесят')), h = Math.floor(left / 3600), m = Math.floor(left / 60) % 60, s = Math.floor(left) % 60;
    ctx.fillStyle = PAL.red; ctx.font = '900 80px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(`${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`, 540, 1600);
    headline(ctx, 'ПРОДОЛЖЕНИЕ СЛЕДУЕТ', appear(lt, 1.3), 'y', 1740, null, 56);
    vignette(ctx, .55);
  } },
);
