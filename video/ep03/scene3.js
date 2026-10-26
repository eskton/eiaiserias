// Episode 3, scene 3 (1:58.0–2:46.4): rule nine, packing, the walk along the shore, Mirra sits down, too hot.
'use strict';

// The beach scrolling past: palms slide by at the walking speed (scroll px).
function shoreWalk(ctx, t, scroll, o = {}) {
  const palms = [];
  for (let k = 0; k < 5; k++) { const x = ((k * 470 - scroll * 1.0) % 2350 + 2350) % 2350 - 300; palms.push([x, (o.hz ?? 700) + 360 + (k % 2) * 30, 640 + (k % 3) * 60, k % 2 ? -.2 : .22, k + 20]); }
  island(ctx, t, { tod: o.tod || 'day', hz: o.hz ?? 700, shore: o.shore ?? 1000, sun: o.sun, palms, extra: o.extra });
}

// Anton's hand reaching in from above: skin forearm, his sleeve at the top, the hand closing to curl.
function grabHand(ctx, x, y, s, rot, curl) {
  const bx = x - Math.cos(rot) * s * 3, by = y - Math.sin(rot) * s * 3;
  ctx.lineCap = 'round'; ctx.strokeStyle = shade(ANTON.skin, -.15); ctx.lineWidth = s * .62; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(x, y); ctx.stroke();
  ctx.strokeStyle = ANTON.skin; ctx.lineWidth = s * .55; ctx.stroke();
  ctx.strokeStyle = ANTON.top; ctx.lineWidth = s * .75; ctx.beginPath(); ctx.moveTo(bx - Math.cos(rot) * s, by - Math.sin(rot) * s); ctx.lineTo(x - Math.cos(rot) * s * 1.6, y - Math.sin(rot) * s * 1.6); ctx.stroke();
  ctx.fillStyle = ANTON.skin; hand(ctx, x, y, s, rot, { curl, sleeve: false });
}

SHOTS.push(
  // Правило девятое.
  { t0: C(43), trans: 'flash', draw(ctx, lt, d, t) { ruleCard(ctx, lt, t, 9, 'ПО БЕРЕГУ'); } },
  // Идти нужно по берегу, а не через лес.
  { t0: C(44), trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#2c79ad'], [1, '#1d5f8c']]);
    ctx.save(); ctx.translate(540, 700); ctx.scale(.8, .8); ctx.translate(-540, -800);
    islandMap(ctx, t, { camp: 1, north: 1, coast: (t - Wd(44, 'берегу')) / .8, forest: (t - Wd(44, 'лес') + .3) / .5, cross: (t - Wd(44, 'лес') - .2) / .35 });
    ctx.restore();
    tag(ctx, 90, 140, 'ПО БЕРЕГУ', appear(t, Wd(44, 'берегу')), PAL.green);
    tag(ctx, 90, 216, 'НЕ ЧЕРЕЗ ЛЕС', appear(t, Wd(44, 'лес')), PAL.red);
  } },
  // В лесу легко потеряться, а у воды видно далеко.
  { t0: C(45), trans: 'cut', draw(ctx, lt, d, t) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 940); ctx.clip();
    jungle(ctx, t, { mist: 1, seed: 52 });
    const r = rng(7); ctx.fillStyle = PAL.yellow; ctx.font = '900 80px Inter'; ctx.textAlign = 'center';
    for (let i = 0; i < 4; i++) ctx.fillText('?', 200 + r() * 680, 300 + r() * 500 + Math.sin(t * 3 + i) * 10);
    toon(ctx, 540 + Math.sin(t * 1.3) * 40, 860, 220, { face: Math.sin(t * 1.3) > 0 ? 1 : -1, eyes: 'wide' }, ANTON);
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(0, 940, W, H); ctx.clip();
    island(ctx, t, { tod: 'day', hz: 1360, shore: 1560, palms: [[1000, 1660, 520, -.2, 30]] });
    ctx.restore();
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 932, W, 16);
    tag(ctx, 90, 140, 'В ЛЕСУ — ПОТЕРЯЕШЬСЯ', appear(t, Wd(45, 'потеряться')), PAL.red);
    tag(ctx, 90, 1440, 'У ВОДЫ — ВИДНО ДАЛЕКО', appear(t, Wd(45, 'видно')), PAL.green);
    vignette(ctx, .35);
  } },
  // Берём воду, консервы, верёвку.
  { t0: C(46), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1.0, 1.04);
    sandTop(ctx, 9);
    backpack(ctx, t, 540, 1110, .85, {});
    [[300, 600], [420, 560]].forEach(([x, y], i) => { const k = outBack(clamp((t - Wd(46, 'воду') - i * .12) / .35)); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = 'rgba(120,180,230,0.8)'; rrect(ctx, -50, -120, 100, 240, 26); ctx.fill(); ctx.fillStyle = '#2d5fa8'; rrect(ctx, -22, -160, 44, 44, 8); ctx.fill(); ctx.restore(); });
    [[640, 600], [770, 560], [700, 700]].forEach(([x, y], i) => { const k = outBack(clamp((t - Wd(46, 'консервы') - i * .12) / .35)); if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = '#9aa0a8'; rrect(ctx, -60, -76, 120, 152, 14); ctx.fill(); ctx.fillStyle = ['#b5503c', '#c9a23a', '#3f7a5a'][i]; ctx.fillRect(-60, -30, 120, 64); ctx.restore(); });
    material(ctx, 'rope', 880, 330, (t - Wd(46, 'верёвку')) / .4);
    tag(ctx, 90, 240, 'ВОДА', appear(t, Wd(46, 'воду')), '#7fb0ff');
    tag(ctx, 90, 316, 'КОНСЕРВЫ', appear(t, Wd(46, 'консервы')), '#ffffff');
    tag(ctx, 90, 392, 'ВЕРЁВКА', appear(t, Wd(46, 'верёвку')), '#ffffff');
    vignette(ctx, .35);
  } },
  // Банки из-под тушёнки тоже берём — пригодятся.
  { t0: C(47), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.08);
    sandTop(ctx, 9);
    backpack(ctx, t, 540, 1080, 1.1, { cans: (t - Wd(47, 'банки')) / .8, swing: .3 });
    headline(ctx, 'ПРИГОДЯТСЯ', appear(t, Wd(47, 'пригодятся')), 'y', 300, 'БАНКИ ИЗ-ПОД ТУШЁНКИ', 110);
    vignette(ctx, .4);
  } },
  // Мы идём вдоль воды.
  { t0: C(48), trans: 'whip', draw(ctx, lt, d, t) {
    shoreWalk(ctx, t, t * 160, { extra: x => {
      toon(x, 380, 1180, 360, walkPose(t * 6, 1, .6, { face: 1, eyes: 'dot' }), ANTON);
      toon(x, 600, 1170, 340, walkPose(t * 6 + 1.3, 1, .55, { face: 1, eyes: 'dot' }), MIRRA);
      backpack(x, t, 330, 1010, .22, {});
    } });
    tag(ctx, 90, 240, 'ВДОЛЬ ВОДЫ', appear(t, Wd(48, 'вдоль')), PAL.yellow);
    vignette(ctx, .35);
  } },
  // Мирра молчит, держится рядом.
  { t0: C(49), trans: 'cut', draw(ctx, lt, d, t) {
    shoreWalk(ctx, t, t * 160, { hz: 560, shore: 820, extra: x => {
      toon(x, 640, 1220, 700, walkPose(t * 6, 1, .6, { face: 1, eyes: 'dot', head: [.02, 0] }), ANTON);
      toon(x, 330, 1210, 660, walkPose(t * 6 + 1.3, 1, .5, { face: 1, eyes: 'down', head: [0, .02] }), MIRRA);
    } });
    tag(ctx, 90, 240, 'МОЛЧИТ', appear(t, Wd(49, 'молчит')), '#ffffff');
    tag(ctx, 90, 316, 'РЯДОМ', appear(t, Wd(49, 'рядом')), '#ffffff');
    vignette(ctx, .35);
  } },
  // Песок обжигает ноги.
  { t0: C(50), trans: 'zoom', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#f5d58f'], [1, '#e0a85e']]);
    glow(ctx, 900, 200, 600, 'rgba(255,240,180,1)', .6);
    const r = rng(9); ctx.fillStyle = 'rgba(0,0,0,0.06)'; for (let i = 0; i < 200; i++) { ell(ctx, (r() * W - t * 300 + W * 4) % W, 1500 + r() * 420, 3 + r() * 6, 2); ctx.fill(); }
    toon(ctx, 420, 1720, 2700, walkPose(t * 6, 1, .5, { face: 1, eyes: 'dot', idle: false }), ANTON);
    toon(ctx, 860, 1760, 2500, walkPose(t * 6 + 1.3, 1, .45, { face: 1, eyes: 'dot', idle: false }), MIRRA);
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) { const x = 80 + i * 120, u = (t * .8 + i * .3) % 1; ctx.globalAlpha = Math.sin(Math.PI * u); ctx.beginPath(); for (let k = 0; k <= 8; k++) { const y = 1750 - u * 300 - k * 30; ctx.lineTo(x + Math.sin(k * 1.2 + t * 6) * 12, y); } ctx.stroke(); }
    ctx.restore();
    tag(ctx, 90, 240, 'ГОРЯЧИЙ ПЕСОК', appear(t, Wd(50, 'обжигает')), PAL.red);
    vignette(ctx, .3);
  } },
  // Я то и дело оглядываюсь на лес.
  { t0: C(51), trans: 'cut', draw(ctx, lt, d, t) {
    island(ctx, t, { tod: 'day', hz: 1100, shore: 1400, palms: [] });
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 330, H); ctx.clip(); jungle(ctx, t, { seed: 53 }); ctx.restore();
    const lk = Math.max(0, Math.sin((t - Wd(51, 'оглядываюсь')) * 3.2)) * (t > Wd(51, 'оглядываюсь') ? 1 : 0);
    portrait(ctx, 640 - lk * 30, 760, 760, { eyes: 'dot', look: -lk * 1.3, brow: .3 * lk, turn: -lk * .8 }, ANTON);
    tag(ctx, 380, 240, 'ЛЕС', appear(t, Wd(51, 'лес')), PAL.red);
    vignette(ctx, .4);
  } },
  // Оттуда тянет сыростью.
  { t0: C(52), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1.0, 1.1);
    jungle(ctx, t, { mist: 1.6, seed: 54 });
    const e = Math.max(0, Math.sin(Math.PI * clamp((t - Wd(52, 'сыростью')) / .9)));
    if (e > .05) for (const dx of [-26, 26]) { glow(ctx, 700 + dx, 700, 40, 'rgba(255,40,30,1)', .8 * e); ctx.fillStyle = `rgba(255,60,40,${e})`; ell(ctx, 700 + dx, 700, 7, 5); ctx.fill(); }
    tag(ctx, 90, 240, 'СЫРОСТЬ', appear(t, Wd(52, 'сыростью')), '#9fc7b0');
    vignette(ctx, .6);
  } },
  // Через час она вдруг садится на песок.
  { t0: C(53), trans: 'whip', draw(ctx, lt, d, t) {
    const sit = sstep(Wd(53, 'садится') - .05, Wd(53, 'садится') + .25, t), walking = 1 - clamp((t - Wd(53, 'садится')) / .3);
    shoreWalk(ctx, t, Math.min(t, Wd(53, 'садится') + .2) * 160, { extra: x => {
      toon(x, 640, 1180, 380, walkPose(t * 6 * walking, 1, .6 * walking, { face: walking > .5 ? 1 : -1, eyes: 'dot' }), ANTON);
      toon(x, 400, 1180, 360, sit > .5 ? { sit: 1, face: 1, eyes: 'down', armL: [.4, -.5], armR: [.6, -.7] } : walkPose(t * 6 + 1.3, 1, .55, { face: 1, eyes: 'dot', crouch: sit }), MIRRA);
    } });
    tag(ctx, 90, 240, '+1 ЧАС', appear(t, Wd(53, 'час')), PAL.yellow);
    tag(ctx, 90, 316, 'ВДРУГ САДИТСЯ', appear(t, Wd(53, 'садится')), PAL.red);
    vignette(ctx, .35);
  } },
  // — Просто устала.
  { t0: C(54), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.0, 1.05);
    island(ctx, t, { tod: 'day', hz: 1100, shore: 1400, palms: [] });
    portrait(ctx, 540, 760, 800, { eyes: 'dot', brow: .4, sick: .3, mouth: t < E(54) + .1 ? MOUTH(t) * .7 : 0 }, MIRRA);
    headline(ctx, '«ПРОСТО УСТАЛА»', appear(t, Wd(54, 'просто')), 'y', 250, null, 90);
    vignette(ctx, .4);
  } },
  // Голос слабый, лицо серое, губы сухие.
  { t0: C(55), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.05, 1.15);
    island(ctx, t, { tod: 'day', hz: 1100, shore: 1400, palms: [] });
    const g = sstep(Wd(55, 'лицо'), Wd(55, 'серое') + .4, t);
    const L = Object.assign({}, MIRRA, { skin: mixHex(MIRRA.skin, '#b9b6b0', g * .8) });
    portrait(ctx, 540, 760, 800, { eyes: 'dot', brow: .5, sick: .3 + .4 * g, mouth: .05 }, L);
    const lip = sstep(Wd(55, 'губы'), Wd(55, 'сухие') + .3, t);
    if (lip > 0) { ctx.save(); ctx.globalAlpha = lip; ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(490 + i * 25, 1010); ctx.lineTo(495 + i * 25, 1025); ctx.stroke(); } ctx.restore(); }
    const r = rng(12); for (let i = 0; i < 3; i++) { const u = (t * .3 + i / 3) % 1; ctx.fillStyle = `rgba(200,230,255,${.7 * Math.sin(Math.PI * u)})`; ell(ctx, 380 + r() * 320, 560 + u * 200, 8, 12); ctx.fill(); }
    tag(ctx, 90, 240, 'ГОЛОС СЛАБЫЙ', appear(t, Wd(55, 'голос')), '#ffffff');
    tag(ctx, 90, 316, 'ЛИЦО СЕРОЕ', appear(t, Wd(55, 'лицо')), '#b9b6b0');
    tag(ctx, 90, 392, 'ГУБЫ СУХИЕ', appear(t, Wd(55, 'губы')), PAL.red);
    vignette(ctx, .45);
  } },
  // Она прижимает к груди правую руку —
  { t0: C(56), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1100, 1.0, 1.08);
    island(ctx, t, { tod: 'day', hz: 700, shore: 1000, palms: [[90, 1060, 640, .22, 9]] });
    const press = outc(clamp((t - Wd(56, 'прижимает')) / .5));
    const o = girl(ctx, t, 540, 1560, 900, { sit: 'front', eyes: 'down', armR: [lerp(-.2, -.3, press), lerp(0, -1.9, press)], armL: [.2, 0] }, .6);
    void o;
    glow(ctx, 560, 1120, 220, 'rgba(255,60,40,1)', .35 * press * (.7 + .3 * Math.sin(t * 6)));
    tag(ctx, 90, 240, 'ПРАВАЯ РУКА', appear(t, Wd(56, 'правую')), PAL.yellow);
    vignette(ctx, .4);
  } },
  // ту самую, которую протянула мне первой.
  { t0: C(57), trans: 'zoom', draw(ctx, lt, d, t) {
    const out = outBack(clamp((t - Wd(57, 'протянула')) / .5));
    nightBeach(ctx, t, { x: 540, y: 1800, h: 1250, palms: [], pose: { hideL: 1, armR: [lerp(-.9, 1.25, out), lerp(-1.9, -.25, out)] } });
    moonlight(ctx, .5);
    tint(ctx, '#808080', .5, 'saturation');
    tag(ctx, 90, 140, 'ТУ САМУЮ', appear(t, Wd(57, 'ту')), PAL.yellow, 'ПРОШЛАЯ НОЧЬ');
    tag(ctx, 90, 240, 'ПРОТЯНУЛА ПЕРВОЙ', appear(t, Wd(57, 'протянула')), '#ffffff');
    vignette(ctx, .6);
  } },
  // Подхожу, беру её за запястье.
  { t0: C(58), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 600, 880, 1.0, 1.08);
    wrist(ctx, t, { look: MIRRA, swell: 0 });
    const g = outc(clamp((t - Wd(58, 'беру')) / .5));
    grabHand(ctx, lerp(500, 570, g), lerp(380, 700, g), 330, Math.PI / 2 - .25, lerp(.2, .9, g));
    tag(ctx, 90, 240, 'ЗАПЯСТЬЕ', appear(t, Wd(58, 'запястье')), '#ffffff');
    vignette(ctx, .45);
  } },
  // Кожа горячая. Слишком горячая.
  { t0: C(59), trans: 'cut', draw(ctx, lt, d, t) {
    wrist(ctx, t, { look: MIRRA });
    grabHand(ctx, 570, 700, 330, Math.PI / 2 - .25, .9);
    const hot = sstep(Wd(59, 'горячая') - .2, Wd(59, 'слишком') + .6, t), p = .6 + .4 * Math.sin(t * 8);
    glow(ctx, 640, 880, 520, 'rgba(255,60,30,1)', .45 * hot * p);
    ctx.save(); ctx.strokeStyle = `rgba(255,120,60,${.6 * hot})`; ctx.lineWidth = 8; ctx.lineCap = 'round';
    for (let i = 0; i < 7; i++) { const x = 300 + i * 90, u = (t * .9 + i * .23) % 1; ctx.globalAlpha = Math.sin(Math.PI * u) * hot; ctx.beginPath(); for (let k = 0; k <= 8; k++) ctx.lineTo(x + Math.sin(k * 1.3 + t * 7) * 12, 760 - u * 300 - k * 26); ctx.stroke(); }
    ctx.restore();
    const v = lerp(36.6, 39.8, sstep(Wd(59, 'горячая'), Wd(59, 'горячая', 1) + .3, t));
    thermometer(ctx, 900, 1810, v);
    headline(ctx, `${v.toFixed(1).replace('.', ',')}°`, appear(t, Wd(59, 'горячая')), v > 38 ? 'r' : 'w', 300, t > Wd(59, 'слишком') ? 'СЛИШКОМ ГОРЯЧАЯ' : 'ГОРЯЧАЯ', 150);
    tint(ctx, '#5a0606', .18 * hot * p, 'screen');
    vignette(ctx, .5);
  } },
);
