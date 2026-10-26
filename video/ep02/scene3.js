// Episode 2, scene 3 (1:42.5–2:19.8): building the camp, the alarm on a rope, "but there was one but".
'use strict';

SHOTS.push(
  // Строю лагерь.
  { t0: C(38), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.06);
    island(ctx, t, { tod: 'day', hz: 640, shore: 900, palms: [[100, 980, 700, .22, 7], [980, 940, 620, -.2, 8]], extra: x => {
      const hx = lerp(330, 640, lt / 2.4), r = rng(4);
      ctx.strokeStyle = 'rgba(120,90,50,0.35)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx - 420, 1185); ctx.lineTo(hx - 330, 1180); ctx.stroke();
      const o = toon(x, hx, 1180, 470, walkPose(lt * 5.5, 1, .55, { face: 1, eyes: 'dot', lean: .18, armL: [-.9, .2], armR: [-.7, .1] }), ANTON);
      const hd = o.hands.R.hand; logLine(x, hd, [hd[0] - 330, 1170], 46);
      x.fillStyle = '#c99a62'; ell(x, hd[0] + 6, hd[1] - 2, 18, 22); x.fill();
      for (let i = 0; i < 6; i++) { const u = ((lt * 2 + r()) % 1); x.fillStyle = `rgba(210,180,120,${.6 * (1 - u)})`; ell(x, hd[0] - 320 - u * 60, 1170 - u * 40 - r() * 20, 6 + r() * 6, 4); x.fill(); }
    } });
    headline(ctx, 'СТРОЮ ЛАГЕРЬ', appear(t, Wd(38, 'строю')), 'y', 300, null, 100);
    vignette(ctx, .4);
  } },
  // Беру брёвна, верёвку и пальмовые листья.
  { t0: C(39), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1.0, 1.04);
    sandTop(ctx, 7);
    material(ctx, 'logs', 540, 430, (t - Wd(39, 'брёвна')) / .4, 'БРЁВНА');
    material(ctx, 'rope', 280, 810, (t - Wd(39, 'верёвку')) / .4, 'ВЕРЁВКА');
    material(ctx, 'leaves', 790, 810, (t - Wd(39, 'листья')) / .4, 'ЛИСТЬЯ');
    vignette(ctx, .35);
  } },
  // Каркас ставлю буквой «А», выше линии прилива.
  { t0: C(40), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 600, 900, 1.0, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#6fb0dc'], [1, '#d4ecf4']]);
    const gy = x => 1200 - .32 * x, tide = .5 + .5 * Math.sin(t * 1.3), wl = 1095 - 60 * tide;
    // the sea on the left, rising and falling against the slope
    vgrad(ctx, 0, wl, 700, 400, [[0, '#3f95c6'], [1, '#2c79ad']]);
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(0, wl - 4, (1200 - wl) / .32 + 6, 8);
    ctx.fillStyle = '#e3cb96'; poly(ctx, [[0, gy(0)], [W, gy(W)], [W, H], [0, H]]); ctx.fill();
    ctx.fillStyle = '#cdb17a'; poly(ctx, [[0, gy(0) + 160], [W, gy(W) + 160], [W, H], [0, H]]); ctx.fill();
    ctx.fillStyle = '#b89a64'; poly(ctx, [[0, gy(0) + 420], [W, gy(W) + 420], [W, H], [0, H]]); ctx.fill();
    // the high-tide mark
    const ty = 1030, tx = (1200 - ty) / .32;
    ctx.save(); ctx.setLineDash([22, 16]); ctx.lineDashOffset = -t * 30; ctx.strokeStyle = '#1f5f93'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(30, ty); ctx.lineTo(tx + 40, ty); ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#1f5f93'; ctx.font = '900 34px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillText('ЛИНИЯ ПРИЛИВА', 40, ty - 12);
    // the frame goes up on the high part of the beach
    const sx = 680, f = clamp((t - Wd(40, 'каркас')) / 1.4);
    shelter(ctx, t, sx, gy(sx), 430, { frame: f, leaves: 0 });
    const ak = clamp((t - Wd(40, 'а')) / .25) * (1 - sstep(Wd(40, 'а') + .7, Wd(40, 'а') + 1.2, t));
    if (ak > 0) { ctx.save(); ctx.globalAlpha = ak; ctx.strokeStyle = PAL.yellow; ctx.lineWidth = 16; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; const s = 430 * (1 + .1 * (1 - ak)), y0 = gy(sx);
      ctx.beginPath(); ctx.moveTo(sx - .62 * s, y0); ctx.lineTo(sx, y0 - s); ctx.lineTo(sx + .62 * s, y0); ctx.moveTo(sx - .34 * s, y0 - .45 * s); ctx.lineTo(sx + .34 * s, y0 - .45 * s); ctx.stroke(); ctx.restore(); }
    const ar = clamp((t - Wd(40, 'выше')) / .5);
    if (ar > 0) { ctx.save(); ctx.strokeStyle = PAL.red; ctx.fillStyle = PAL.red; ctx.lineWidth = 10; ctx.lineCap = 'round'; const x0 = tx + 60, y1 = lerp(ty, gy(sx) - 20, outc(ar));
      ctx.beginPath(); ctx.moveTo(x0, ty); ctx.lineTo(x0, y1); ctx.stroke(); poly(ctx, [[x0 - 22, y1 + 8], [x0 + 22, y1 + 8], [x0, y1 - 26]]); ctx.fill(); ctx.restore(); }
    headline(ctx, '«А»', appear(t, Wd(40, 'буквой')), 'y', 280, 'КАРКАС', 120);
    tag(ctx, 90, 420, 'ВЫШЕ ПРИЛИВА', appear(t, Wd(40, 'выше')), PAL.red);
  } },
  // Листья кладу снизу вверх, как черепицу, чтобы вода стекала.
  { t0: C(41), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1.0, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#4d6276'], [1, '#2f3e4d']]);
    const rainK = sstep(Wd(41, 'вода') - .5, Wd(41, 'вода'), t);
    ctx.fillStyle = '#c8aa72'; ctx.fillRect(0, 1150, W, H - 1150);
    const sx = 420, sy = 1150, s = 640, lv = clamp((t - Wd(41, 'листья')) / (Wd(41, 'черепицу') + .4 - Wd(41, 'листья')));
    shelter(ctx, t, sx, sy, s, { leaves: lv });
    // order arrows on the slope
    const apex = [sx, sy - s], R0 = [sx + .62 * s, sy];
    if (lv > 0 && lv < 1.2) { ctx.save(); ctx.globalAlpha = clamp((1 - lv) * 4 + .3); ctx.fillStyle = '#fff'; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let r = 0; r < 3; r++) { const u = (r * 2 + .6) / 6, px = lerp(R0[0], apex[0], u) + 200, py = lerp(R0[1], apex[1], u) - 40; if (lv * 6 > r * 2) ctx.fillText(String(r + 1), px, py); } ctx.restore(); }
    // rain: drops fall, land on the roof and run down off the bottom edge
    if (rainK > 0) {
      ctx.strokeStyle = `rgba(200,220,240,${.6 * rainK})`; ctx.lineWidth = 3; const r = rng(11);
      for (let i = 0; i < 70; i++) { const x = r() * W, y = ((r() * H + t * 1500) % H); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 36); ctx.stroke(); }
      const off = [.42 * s, -.16 * s];
      for (let i = 0; i < 14; i++) {
        const u = (t * .6 + i / 14 * 7.3) % 1, v = (i * .37) % 1, ux = 1 - u;
        const a = [lerp(R0[0], apex[0], ux), lerp(R0[1], apex[1], ux)], px = a[0] + off[0] * v, py = a[1] + off[1] * v;
        ctx.fillStyle = `rgba(190,225,255,${.9 * rainK})`; ell(ctx, px, py, 9, 12); ctx.fill();
        if (u > .9) { const fall = (u - .9) * 10; ell(ctx, R0[0] + off[0] * v + 30 * fall, R0[1] + off[1] * v + fall * 160, 8, 12); ctx.fill(); }
      }
    }
    tag(ctx, 90, 240, 'СНИЗУ ВВЕРХ', appear(t, Wd(41, 'снизу')), PAL.yellow);
    tag(ctx, 90, 316, 'КАК ЧЕРЕПИЦА', appear(t, Wd(41, 'черепицу')), '#ffffff');
    tag(ctx, 90, 392, 'ВОДА СТЕКАЕТ', appear(t, Wd(41, 'стекала')), '#7fb0ff');
    vignette(ctx, .45);
  } },
  // Пол застилаю листьями, чтобы земля не тянула тепло.
  { t0: C(42), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#1b2433'], [1, '#0d121b']]);
    // a cut through the shelter and the ground under it
    const gy = 1080;
    ctx.fillStyle = '#8a6a44'; ctx.fillRect(0, gy, W, H - gy); ctx.fillStyle = '#74583a'; ctx.fillRect(0, gy + 160, W, H); ctx.fillStyle = '#5f4830'; ctx.fillRect(0, gy + 420, W, H);
    ctx.strokeStyle = LEAF[1]; ctx.lineWidth = 36; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(130, gy); ctx.lineTo(540, gy - 640); ctx.lineTo(950, gy); ctx.stroke();
    const fl = clamp((t - Wd(42, 'застилаю')) / .7);
    if (fl > 0) { ctx.fillStyle = LEAF[0]; ctx.fillRect(170, gy - 46, 740 * outc(fl), 46); ctx.fillStyle = LEAF[2]; for (let i = 0; i < 12 * fl; i++) { ell(ctx, 200 + i * 60, gy - 40, 40, 12); ctx.fill(); } }
    lying(ctx, t, 300, gy - (fl > .95 ? 46 : 0), 460, ANTON, {});
    // heat leaving the body: into the sand before the floor, held back after
    const held = fl >= 1;
    ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const u = (t * .9 + i / 6) % 1, x = 360 + i * 60, y0 = gy - 30;
      if (!held) { ctx.strokeStyle = `rgba(255,120,60,${.85 * (1 - u)})`; ctx.lineWidth = 10; ctx.beginPath(); for (let k = 0; k <= 10; k++) { const yy = y0 + u * 360 * k / 10 + u * 40; ctx.lineTo(x + Math.sin(k * 1.2 + t * 6) * 10, yy); } ctx.stroke(); }
      else { ctx.strokeStyle = `rgba(255,150,70,${.7 * Math.sin(Math.PI * u)})`; ctx.lineWidth = 10; ctx.beginPath(); for (let k = 0; k <= 8; k++) { const yy = y0 - 60 - u * 140 * k / 8; ctx.lineTo(x + Math.sin(k * 1.3 + t * 6) * 10, yy); } ctx.stroke(); }
    }
    ctx.restore();
    tag(ctx, 90, 240, 'ПОЛ ИЗ ЛИСТЬЕВ', appear(t, Wd(42, 'пол')), PAL.yellow);
    tag(ctx, 90, 316, held ? 'ТЕПЛО ОСТАЁТСЯ' : 'ЗЕМЛЯ ТЯНЕТ ТЕПЛО', 1, held ? PAL.green : PAL.red);
    vignette(ctx, .5);
  } },
  // Вход разворачиваю от ветра.
  { t0: C(43), trans: 'whip', draw(ctx, lt, d, t) {
    sandTop(ctx, 8);
    // wind from the left
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 8; ctx.lineCap = 'round'; const r = rng(12);
    for (let i = 0; i < 14; i++) { const y = 380 + r() * 820, u = (t * .8 + r()) % 1, x = -200 + u * 1500; ctx.globalAlpha = Math.sin(Math.PI * u); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 90, y - 20, x + 180, y); ctx.stroke(); }
    ctx.restore();
    const k = outBack(clamp((t - Wd(43, 'разворачиваю')) / .9)), a = Math.PI * (1 - k);
    ctx.save(); ctx.translate(540, 800); ctx.rotate(a);
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; rrect(ctx, -270, -150, 560, 320, 20); ctx.fill();
    ctx.fillStyle = LEAF[0]; ctx.fillRect(-260, -160, 520, 160); ctx.fillStyle = LEAF[1]; ctx.fillRect(-260, 0, 520, 160);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 4; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-260 + i * 87, -160); ctx.lineTo(-260 + i * 87, 160); ctx.stroke(); }
    logLine(ctx, [-280, 0], [280, 0], 26);
    ctx.fillStyle = '#1d1a14'; poly(ctx, [[260, -90], [330, 0], [260, 90]]); ctx.fill();
    ctx.restore();
    const ex = 540 + Math.cos(a) * 380, ey = 800 + Math.sin(a) * 380;
    ctx.fillStyle = '#2a2418'; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ВХОД', ex, ey);
    ctx.fillStyle = '#fff'; ctx.font = '900 46px Inter'; ctx.textAlign = 'left'; ctx.fillText('ВЕТЕР →', 70, 330);
    tag(ctx, 90, 240, 'СПИНОЙ К ВЕТРУ', appear(t, Wd(43, 'ветра')), PAL.yellow);
    if (k > .9) checkMark(ctx, 900, 330, clamp((t - Wd(43, 'ветра')) / .4), 1.3);
    vignette(ctx, .35);
  } },
  // Вокруг шалаша тяну верёвку с банками из-под тушёнки.
  { t0: C(44), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.06);
    island(ctx, t, { tod: 'dusk', hz: 640, shore: 900, palms: [[90, 960, 640, .22, 9]], sun: [840, 600], extra: x => {
      shelter(x, t, 520, 1060, 520, { floor: 1, rope: clamp((t - Wd(44, 'тяну')) / .9), cans: clamp((t - Wd(44, 'банками')) / .7), swing: .15 });
    } });
    tag(ctx, 90, 240, 'ВЕРЁВКА ВОКРУГ', appear(t, Wd(44, 'верёвку')), '#ffffff');
    tag(ctx, 90, 316, 'БАНКИ ИЗ-ПОД ТУШЁНКИ', appear(t, Wd(44, 'тушёнки')), PAL.yellow);
    vignette(ctx, .4);
  } },
  // Подойдёт кто-то — звон меня разбудит.
  { t0: C(45), trans: 'zoom', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0d1424'], [1, '#1d2436']]);
    ctx.fillStyle = '#2c3042'; ctx.fillRect(0, 1100, W, H);
    const hit = Wd(45, 'звон'), since = t - hit, kick = since > 0 ? Math.max(0, 1 - since * 2.5) * 70 : 0;
    // someone walks in from the right, only legs and hips in the frame, and catches the rope
    const walk = sstep(Wd(45, 'подойдёт') - .6, hit, t), fx = lerp(1400, 640, walk), ph = (t < hit ? t : hit) * 6.5;
    ropeCans(ctx, t, [60, 1120], [1020, 1110], 240, 1, 1, since > 0 ? Math.max(0, 1.4 - since * .5) : .05, 1.6, true, since > 0 ? [clamp((fx - 120 - 60) / 960), kick] : null);
    const dark = { skin: '#2a2c33', hair: '#141519', top: '#24262d', topD: '#1c1e24', legs: '#2f3138', shoes: '#101114' };
    toon(ctx, fx, 1135, 1500, walkPose(ph, -1, .8, { face: -1, eyes: 'dot', idle: false }), dark);
    if (since > 0 && since < 1.2) {
      const k = outBack(clamp(since / .25)), fade = 1 - sstep(.8, 1.2, since);
      ctx.save(); ctx.globalAlpha = fade; ctx.translate(560, 520); ctx.scale(k, k); ctx.rotate(-.08);
      ctx.fillStyle = PAL.yellow; ctx.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, r = i % 2 ? 190 : 290; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .75); } ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#0c0f16'; ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ДЗЫНЬ!', 0, 8); ctx.restore();
    }
    tag(ctx, 90, 240, 'КТО-ТО ПОДОЙДЁТ', appear(t, Wd(45, 'подойдёт')), '#ffffff');
    tag(ctx, 90, 316, 'ЗВОН РАЗБУДИТ', appear(t, Wd(45, 'разбудит')), PAL.yellow);
    vignette(ctx, .55);
  } },
  // Теперь у меня есть тепло, вода, еда и сигнализация.
  { t0: C(46), trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0e1322'], [1, '#05070d']]);
    ctx.save(); ctx.translate(540, 700); ctx.rotate(.02);
    ctx.fillStyle = '#efe6cf'; rrect(ctx, -400, -470, 800, 900, 24); ctx.fill();
    ctx.fillStyle = '#2a2418'; ctx.font = '900 60px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ЛАГЕРЬ', 0, -380);
    [['ТЕПЛО', 'shelter', 'тепло'], ['ВОДА', 'water', 'вода'], ['ЕДА', 'food', 'еда'], ['СИГНАЛИЗАЦИЯ', 'bell', 'сигнал']].forEach(([lab, ic, w], i) => {
      const y = -230 + i * 170, k = clamp((t - Wd(46, w)) / .35);
      ctx.fillStyle = 'rgba(42,36,24,0.1)'; rrect(ctx, -340, y - 60, 680, 120, 20); ctx.fill();
      if (ic === 'bell') { ctx.fillStyle = '#5a5f68'; rrect(ctx, -290, y - 34, 50, 64, 8); ctx.fill(); ctx.strokeStyle = '#5a5f68'; ctx.lineWidth = 6; for (const r of [24, 40]) { ctx.beginPath(); ctx.arc(-265, y, r + 26, -.5, .5); ctx.stroke(); } }
      else icon(ctx, ic, -265, y, .42, '#5a5f68');
      ctx.fillStyle = '#2a2418'; ctx.font = '900 50px Inter'; ctx.textAlign = 'left'; ctx.fillText(lab, -190, y + 2);
      ctx.strokeStyle = '#2a2418'; ctx.lineWidth = 6; rrect(ctx, 220, y - 38, 76, 76, 14); ctx.stroke();
      checkMark(ctx, 262, y - 6, k, 1.1);
    });
    ctx.restore();
    specks(ctx, t, 30, 31, .3);
  } },
  // По бумагам всё сделано правильно.
  { t0: C(47), trans: 'cut', draw(ctx, lt, d, t) {
    rulesTicked(ctx, lt, t, clamp((t - Wd(47, 'сделано')) / .7));
    tag(ctx, 90, 140, 'ПО БУМАГАМ', appear(t, Wd(47, 'бумагам')), '#ffffff');
    headline(ctx, 'ВСЁ ПРАВИЛЬНО', appear(t, Wd(47, 'правильно')), 'n', 1480, null, 90);
  } },
  // Но было одно «но».
  { t0: C(48), trans: 'cut', draw(ctx, lt, d, t) {
    const hit = Wd(48, 'но', 1), [sx, sy] = shake(t, [[hit, 1.2]], 22);
    ctx.save(); ctx.translate(sx, sy);
    rulesTicked(ctx, lt, t, 1, sstep(Wd(48, 'но') - .1, Wd(48, 'но') + .3, t));
    if (t > hit - .05) {
      const k = clamp((t - hit + .05) / .18), sc = lerp(2.4, 1, outc(k));
      ctx.save(); ctx.translate(560, 700); ctx.rotate(-.16); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 1.5) * .92;
      ctx.strokeStyle = PAL.red; ctx.lineWidth = 22; rrect(ctx, -300, -150, 600, 300, 30); ctx.stroke();
      ctx.fillStyle = PAL.red; ctx.font = '900 230px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('НО', 0, 14); ctx.restore();
      if (k >= 1) tint(ctx, '#808080', clamp((t - hit) / .8) * .5, 'saturation');
    }
    ctx.restore();
  } },
  // Одна ошибка — и всё это перестанет иметь значение.
  { t0: C(49), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.12);
    island(ctx, t, { tod: 'dusk', hz: 640, shore: 900, palms: [[90, 960, 640, .22, 9], [990, 930, 560, -.2, 10]], sun: [840, 620], extra: x => {
      shelter(x, t, 520, 1060, 520, { floor: 1, rope: 1, cans: 1, swing: .1 });
      toon(x, 900, 1130, 330, { sit: 1, face: -1, eyes: 'dot', armL: [-.6, -.9], armR: [-.8, -1.0] }, ANTON);
    } });
    const g = sstep(Wd(49, 'перестанет') - .2, Wd(49, 'значение') + .3, t);
    tint(ctx, '#808080', g, 'saturation'); tint(ctx, '#000000', g * .35, 'source-over');
    headline(ctx, 'ОДНА ОШИБКА', appear(t, Wd(49, 'ошибка')), 'r', 300, null, 100);
    vignette(ctx, .4 + .4 * g);
  } },
);
