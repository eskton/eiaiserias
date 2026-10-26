// Episode 3, scene 2 (1:04.5–1:58.0): rule eight, the night by the fire, Mirra's story, morning, 72 hours.
'use strict';

const mixHex = (a, b, k) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k))).toString(16).padStart(2, '0')).join(''); };

// Whatever draw() paints, filled flat with one colour: figures against the sun.
function silhouette(ctx, draw, color) {
  const [c, x] = scratch('silhouette', W, H);
  x.setTransform(ctx.getTransform()); draw(x); x.setTransform(1, 0, 0, 1, 0, 0);
  x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, W, H);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(c, 0, 0); ctx.restore();
}

// The camp seen from above at night: shelter, fire ten metres off, Mirra in a blanket.
function campTop(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#3c4155'], [1, '#2c3042']]);
  const r = rng(17); ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let i = 0; i < 160; i++) { ell(ctx, r() * W, r() * H, 3 + r() * 6, 2); ctx.fill(); }
  ctx.save(); ctx.translate(540, 470); ctx.rotate(Math.PI / 2);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; rrect(ctx, -270, -150, 560, 320, 20); ctx.fill();
  ctx.fillStyle = '#24402d'; ctx.fillRect(-260, -160, 520, 160); ctx.fillStyle = '#1d3626'; ctx.fillRect(-260, 0, 520, 160); logLine(ctx, [-280, 0], [280, 0], 26, true);
  ctx.fillStyle = '#05070b'; poly(ctx, [[260, -90], [330, 0], [260, 90]]); ctx.fill();
  ctx.restore();
  // the fire from above
  const fx = 540, fy = 1460, fl = .85 + .3 * noise1(t * 5);
  glow(ctx, fx, fy, 420, 'rgba(255,150,60,1)', .5 * fl);
  ctx.fillStyle = '#4a4a52'; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; ell(ctx, fx + Math.cos(a) * 90, fy + Math.sin(a) * 90, 22, 18); ctx.fill(); }
  for (const [c, rr] of [['#e8463c', 62], ['#ff9a3c', 44], ['#ffd65a', 24]]) { ctx.fillStyle = c; ell(ctx, fx + (noise1(t * 6 + rr) - .5) * 10, fy, rr * fl, rr * fl); ctx.fill(); }
  // Mirra wrapped in the blanket
  const b = outBack(clamp(o.blanket ?? 1)), mx = 760, my = 1460;
  ctx.fillStyle = MIRRA.hair; ell(ctx, mx, my - 70, 46, 46); ctx.fill();
  if (b > 0) { ctx.save(); ctx.translate(mx, my + 10); ctx.scale(b, b); ctx.fillStyle = '#8a3b32'; ell(ctx, 0, 0, 80, 66); ctx.fill(); ctx.strokeStyle = '#c9a23a'; ctx.lineWidth = 6; for (const k of [-40, 0, 40]) { ctx.beginPath(); ctx.moveTo(k, -60); ctx.lineTo(k, 60); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-76, k * .8); ctx.lineTo(76, k * .8); ctx.stroke(); } ctx.restore(); }
  const k = clamp(o.dist || 0);
  if (k > 0) { ctx.save(); ctx.strokeStyle = PAL.yellow; ctx.lineWidth = 8; ctx.setLineDash([22, 14]); ctx.lineDashOffset = -t * 30; ctx.beginPath(); ctx.moveTo(540, 800); ctx.lineTo(540, lerp(800, 1350, k)); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = PAL.yellow; ctx.font = '900 96px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('10 М', 590, 1000); ctx.restore(); }
}

SHOTS.push(
  // Правило восьмое.
  { t0: C(23), trans: 'flash', draw(ctx, lt, d, t) { ruleCard(ctx, lt, t, 8, 'ЖДАТЬ'); } },
  // Если не уверен — подожди.
  { t0: C(24), trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0e1322'], [1, '#05070d']]);
    const flip = sstep(C(24), C(24) + .5, t);
    ctx.save(); ctx.translate(540, 760); ctx.rotate(Math.PI * (1 - outBack(flip))); ctx.translate(-540, -760);
    hourglass(ctx, t, 540, 760, 1.25, clamp((t - C(24) - .5) / 3)); ctx.restore();
    tag(ctx, 90, 240, 'НЕ УВЕРЕН?', appear(t, Wd(24, 'уверен')), '#ffffff');
    headline(ctx, 'ПОДОЖДИ', appear(t, Wd(24, 'подожди')), 'y', 1500, null, 120);
    specks(ctx, t, 30, 62, .3);
  } },
  // Укушенный может выглядеть здоровым несколько часов.
  { t0: C(25), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#101826'], [1, '#080b12']]);
    const hrs = 6 * inout(clamp((t - Wd(25, 'несколько')) / 1.2)), z = sstep(Wd(25, 'часов') + .1, E(25) + .4, t);
    clockFace(ctx, 540, 470, 150, hrs);
    const L = Object.assign({}, ANTON, { skin: mixHex(ANTON.skin, LOOK.zombie.skin, z), top: mixHex(ANTON.top, '#8a9180', z * .6) });
    toon(ctx, 540, 1800, 1000, { eyes: z > .7 ? 'red' : 'dot', mouth: z * .5, lean: z * .1, armL: [-.15 - z * .9, z * .2], armR: [.15 - z * .8, z * .3] }, L);
    tag(ctx, 90, 240, 'ВЫГЛЯДИТ ЗДОРОВЫМ', appear(t, Wd(25, 'здоровым')), PAL.green);
    tag(ctx, 90, 316, 'НЕСКОЛЬКО ЧАСОВ', appear(t, Wd(25, 'несколько')), PAL.yellow);
    if (z > .7) tint(ctx, '#5a0606', .25 * (z - .7) / .3 * (.6 + .4 * Math.sin(t * 9)), 'screen');
    vignette(ctx, .55);
  } },
  // Поэтому в шалаш я её не пускаю.
  { t0: C(26), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1.0, 1.05);
    island(ctx, t, { tod: 'night', hz: 640, shore: 900, palms: [[90, 960, 640, .22, 9]], moon: [880, 200], extra: x => {
      shelter(x, t, 600, 1080, 520, { floor: 1, night: true });
      girl(x, t, 230, 1180, 480);
    } });
    moonlight(ctx, .45);
    const k = outBack(clamp((t - Wd(26, 'не')) / .35));
    if (k > 0) { ctx.save(); ctx.translate(600, 900); ctx.scale(k, k); ctx.strokeStyle = PAL.red; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-130, -130); ctx.lineTo(130, 130); ctx.moveTo(130, -130); ctx.lineTo(-130, 130); ctx.stroke(); ctx.restore(); }
    tag(ctx, 90, 240, 'В ШАЛАШ — НЕТ', appear(t, Wd(26, 'пускаю')), PAL.red);
    vignette(ctx, .55);
  } },
  // Даю одеяло и сажаю у костра в десяти метрах,
  { t0: C(27), trans: 'cut', draw(ctx, lt, d, t) {
    campTop(ctx, t, { blanket: (t - Wd(27, 'одеяло')) / .4, dist: (t - Wd(27, 'десяти')) / .6 });
    moonlight(ctx, .3);
    tag(ctx, 90, 240, 'ОДЕЯЛО', appear(t, Wd(27, 'одеяло')), PAL.yellow);
    tag(ctx, 90, 316, 'У КОСТРА', appear(t, Wd(27, 'костра')), '#ffffff');
    vignette(ctx, .5);
  } },
  // а сам остаюсь внутри с дубиной.
  { t0: C(28), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1.05, 1.12);
    fromInside(ctx, t, x => {
      nightBeach(x, t, { girl: false, palms: [[1000, 1160, 640, -.2, 12]] });
      toon(x, 640, 1330, 300, { sit: 'front', eyes: 'dot' }, MIRRA);
      x.fillStyle = '#8a3b32'; ell(x, 640, 1260, 70, 80); x.fill();
      campfire(x, t, 470, 1360, .45); moonlight(x, .45); firelight(x, t, 470, 1330, 500, .7);
    });
    logLine(ctx, [140, 2050], [420, 1180], 70, true);
    tag(ctx, 90, 240, 'Я — ВНУТРИ', appear(t, Wd(28, 'внутри')), '#ffffff');
    tag(ctx, 90, 316, 'С ДУБИНОЙ', appear(t, Wd(28, 'дубиной')), PAL.yellow);
    vignette(ctx, .6);
  } },
  // Её зовут Мирра.
  { t0: C(29), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.0, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#0a0e18'], [1, '#04060a']]);
    portrait(ctx, 540, 760, 820, { eyes: 'dot', brow: .3, look: -.2 }, MIRRA);
    firelight(ctx, t, 150, 1500, 1600);
    headline(ctx, 'МИРРА', appear(t, Wd(29, 'мирра')), 'y', 250, 'ЕЁ ЗОВУТ', 150);
    vignette(ctx, .55);
  } },
  // Она пряталась в грузовом отсеке,
  { t0: C(30), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1200, 1.0, 1.08);
    cargoHold(ctx, t);
    toon(ctx, 610, 1525, 620, { crouch: .9, eyes: 'wide', armL: [.9, 1.9], armR: [-.9, -1.9], head: [0, .02] }, MIRRA);
    ctx.fillStyle = '#5a452c'; ctx.fillRect(440, 1300, 330, 230); ctx.strokeStyle = shade('#5a452c', -.3); ctx.lineWidth = 10; ctx.strokeRect(445, 1305, 320, 220);
    tint(ctx, '#808080', .55, 'saturation'); tint(ctx, '#c9a37a', .3, 'multiply');
    tag(ctx, 90, 140, 'ГРУЗОВОЙ ОТСЕК', appear(t, Wd(30, 'грузовом')), PAL.yellow, 'ЕЁ РАССКАЗ');
    vignette(ctx, .6);
  } },
  // а после удара выбралась через трещину в обшивке.
  { t0: C(31), trans: 'cut', draw(ctx, lt, d, t) {
    const hit = Wd(31, 'удара'), [sx, sy] = shake(t, [[hit, 1.5]], 26);
    ctx.save(); ctx.translate(sx, sy);
    vgrad(ctx, 0, 0, W, H, [[0, '#8f949c'], [1, '#6c7178']]);
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 6; for (let y = 160; y < H; y += 320) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.fillStyle = '#5a5f66'; for (let y = 200; y < H; y += 320) for (let x = 60; x < W; x += 120) { ell(ctx, x, y, 9, 9); ctx.fill(); }
    // the crack opens onto the night outside
    const op = outc(clamp((t - hit - .1) / 1.0)), pts = [];
    for (let i = 0; i <= 12; i++) { const y = 300 + i * 110; pts.push([540 + (i % 2 ? 40 : -40) + Math.sin(i * 1.7) * 30, y]); }
    if (op > 0) { ctx.fillStyle = '#0d1a31'; ctx.beginPath(); pts.forEach(([x, y], i) => { const w = 150 * op * Math.sin(Math.PI * i / 12); i ? ctx.lineTo(x - w, y) : ctx.moveTo(x - w, y); }); for (let i = 12; i >= 0; i--) { const [x, y] = pts[i], w = 150 * op * Math.sin(Math.PI * i / 12); ctx.lineTo(x + w, y); } ctx.closePath(); ctx.fill();
      glow(ctx, 540, 900, 300, 'rgba(160,180,240,1)', .3 * op); }
    const go = clamp((t - Wd(31, 'выбралась')) / 1.4);
    if (go > 0 && go < 1) toon(ctx, lerp(760, 380, go), 1560, 820, walkPose(go * 9, -1, .7, { face: -1, eyes: 'dot', crouch: .4 }), Object.assign({}, MIRRA, { top: '#2a2023', topD: '#21191b', legs: '#231b1c', hair: '#0e0908', skin: '#3a2a26' }));
    ctx.restore();
    if (t > hit && t < hit + .25) screenFill(ctx, '#fff', 1 - (t - hit) / .25);
    tint(ctx, '#808080', .5, 'saturation'); tint(ctx, '#c9a37a', .25, 'multiply');
    tag(ctx, 90, 240, 'УДАР', appear(t, Wd(31, 'удара')), PAL.red);
    tag(ctx, 90, 316, 'ТРЕЩИНА В ОБШИВКЕ', appear(t, Wd(31, 'трещину')), PAL.yellow);
    vignette(ctx, .55);
  } },
  // Банки не зазвенели:
  { t0: C(32), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.08);
    vgrad(ctx, 0, 0, W, H, [[0, '#070b16'], [1, '#141a2b']]); ctx.fillStyle = '#23283a'; ctx.fillRect(0, 1100, W, H);
    ropeCans(ctx, t, [60, 1120], [1020, 1110], 240, 1, 1, -1, 1.6, true);
    glow(ctx, 900, 160, 500, 'rgba(160,180,240,1)', .12);
    tag(ctx, 90, 240, 'БАНКИ МОЛЧАЛИ', appear(t, Wd(32, 'зазвенели')), PAL.red);
    vignette(ctx, .7);
  } },
  // она перешагнула верёвку — заметила её при луне.
  { t0: C(33), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#070b16'], [1, '#141a2b']]); ctx.fillStyle = '#23283a'; ctx.fillRect(0, 1100, W, H);
    ctx.fillStyle = '#ece8d8'; ell(ctx, 860, 260, 70, 70); ctx.fill(); glow(ctx, 860, 260, 300, 'rgba(220,230,255,1)', .3);
    const shine = sstep(Wd(33, 'луне') - .2, Wd(33, 'луне') + .3, t);
    ropeCans(ctx, t, [60, 1120], [1020, 1110], 240, 1, 1, -1, 1.6, true);
    if (shine > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = `rgba(230,240,255,${.7 * shine})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(60, 880); ctx.quadraticCurveTo(540, 935, 1020, 870); ctx.stroke(); ctx.restore(); }
    const go = sstep(Wd(33, 'перешагнула') - .8, Wd(33, 'верёвку') + .6, t), x = lerp(-150, 1000, go), near = Math.max(0, 1 - Math.abs(x - 560) / 260);
    const look = Object.assign({}, MIRRA, { top: '#2a2023', topD: '#21191b', legs: '#3a3036', shoes: '#120e10', skin: '#3a2a26' });
    toon(ctx, x, 1135, 1500, walkPose(go * 16, 1, .7 + near * 1.1, { face: 1, eyes: 'dot', idle: false }), look);
    moonlight(ctx, .35);
    tag(ctx, 90, 240, 'ПЕРЕШАГНУЛА', appear(t, Wd(33, 'перешагнула')), PAL.yellow);
    tag(ctx, 90, 316, 'ЗАМЕТИЛА ПРИ ЛУНЕ', appear(t, Wd(33, 'заметила')), '#ffffff');
    vignette(ctx, .6);
  } },
  // Больше она никого не видела.
  { t0: C(34), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1.08, 1.0);
    island(ctx, t, { tod: 'night', hz: 780, shore: 1040, palms: [[90, 1100, 680, .22, 11], [1000, 1080, 600, -.2, 12]], moon: [880, 200], extra: x => {
      wreck(x, t, 720, 1180, .5, false);
      toon(x, 300, 1250, 160, { sit: 'front', eyes: 'dot' }, MIRRA);
    } });
    moonlight(ctx, .45);
    headline(ctx, 'НИКОГО', appear(t, Wd(34, 'никого')), 'w', 300, 'БОЛЬШЕ', 120);
    vignette(ctx, .65);
  } },
  // К утру ничего не меняется.
  { t0: C(35), trans: 'cut', draw(ctx, lt, d, t) {
    const k = sstep(0, d, lt);
    const scene = (x, tod, sun) => island(x, t, { tod, hz: 760, shore: 1000, sun, palms: [[90, 1100, 680, .22, 11], [1000, 1080, 600, -.2, 12]], moon: [880, 200], extra: y => {
      shelter(y, t, 380, 1180, 380, { floor: 1, rope: 1, cans: 1, swing: -1, night: tod === 'night' });
      toon(y, 820, 1240, 260, { sit: 'front', eyes: tod === 'night' ? 'closed' : 'dot' }, MIRRA); } });
    scene(ctx, 'night'); moonlight(ctx, .45 * (1 - k));
    if (k > 0) { const [c, x] = scratch('dawn', W, H); scene(x, 'dusk', [540, lerp(900, 680, k)]); ctx.save(); ctx.globalAlpha = k; ctx.drawImage(c, 0, 0); ctx.restore(); }
    const hh = Math.floor(lerp(2, 6, k)), mm = Math.floor(lerp(0, 59, (lerp(2, 6, k) % 1)));
    ctx.fillStyle = '#fff'; ctx.font = '900 110px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(`0${hh}:${String(mm).padStart(2, '0')}`, 540, 300);
    tag(ctx, 90, 140, 'К УТРУ', appear(t, Wd(35, 'утру')), PAL.yellow);
    vignette(ctx, .45);
  } },
  // Ни странностей, ни новых ран.
  { t0: C(36), trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#1c2440'], [1, '#d8695a']]);
    ctx.save(); ctx.translate(540, 680); ctx.rotate(.02);
    ctx.fillStyle = '#efe6cf'; rrect(ctx, -400, -280, 800, 560, 24); ctx.fill();
    ctx.fillStyle = '#2a2418'; ctx.font = '900 56px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('К УТРУ', 0, -190);
    [['СТРАННОСТИ', 'странностей'], ['НОВЫЕ РАНЫ', 'новых']].forEach(([lab, w], i) => { const y = -40 + i * 170;
      ctx.fillStyle = 'rgba(42,36,24,0.1)'; rrect(ctx, -340, y - 60, 680, 120, 20); ctx.fill();
      ctx.fillStyle = '#2a2418'; ctx.font = '900 52px Inter'; ctx.textAlign = 'left'; ctx.fillText(lab, -290, y + 2);
      const k = clamp((t - Wd(36, w)) / .35); ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = PAL.green; ctx.font = '900 52px Inter'; ctx.textAlign = 'right'; ctx.fillText('НЕТ', 300, y + 2); ctx.restore(); });
    ctx.restore();
    specks(ctx, t, 30, 63, .3);
  } },
  // Только тогда я разрешаю ей подойти к лагерю.
  { t0: C(37), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1.0, 1.05);
    const go = sstep(Wd(37, 'подойти') - .4, E(37) + .6, t), wave = t > Wd(37, 'разрешаю') ? Math.sin((t - Wd(37, 'разрешаю')) * 9) : 0;
    island(ctx, t, { tod: 'dusk', hz: 700, shore: 950, sun: [540, 640], palms: [[90, 1060, 640, .22, 9]], extra: x => {
      shelter(x, t, 300, 1130, 400, { floor: 1, rope: 1, cans: 1, swing: .05 });
      toon(x, 560, 1180, 380, { face: 1, eyes: 'dot', armR: [2.6 + wave * .3, -.4] }, ANTON);
      toon(x, lerp(980, 760, go), 1190, 360, go > 0 && go < 1 ? walkPose(go * 10, -1, .6, { face: -1, eyes: 'dot' }) : { face: -1, eyes: 'dot' }, MIRRA);
    } });
    tag(ctx, 90, 240, 'ТОЛЬКО ТОГДА', appear(t, Wd(37, 'только')), PAL.yellow);
    tag(ctx, 90, 316, 'МОЖНО ПОДОЙТИ', appear(t, Wd(37, 'подойти')), PAL.green);
    vignette(ctx, .4);
  } },
  // Мы делим еду, воду.
  { t0: C(38), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1100, 1.05, 1.1);
    island(ctx, t, { tod: 'dusk', hz: 700, shore: 950, sun: [540, 600], palms: [], extra: x => {
      toon(x, 300, 1300, 560, { sit: 1, face: 1, eyes: 'dot', armR: [1.9, -.6], armL: [1.4, -.8] }, ANTON);
      toon(x, 780, 1300, 540, { sit: 1, face: -1, eyes: 'dot', armR: [-1.9, .6], armL: [-1.4, .8] }, MIRRA);
      campfire(x, t, 540, 1420, .5);
      const pass = (w, k, draw) => { const u = inout(clamp((t - Wd(38, w)) / .7)); if (u <= 0 || u >= 1) return; const px = lerp(420, 660, u), py = 1000 - Math.sin(Math.PI * u) * 120; draw(px, py); };
      pass('еду', 0, (px, py) => { x.fillStyle = '#b9bec6'; rrect(x, px - 30, py - 40, 60, 80, 8); x.fill(); x.fillStyle = '#b5503c'; x.fillRect(px - 30, py - 20, 60, 36); });
      pass('воду', 1, (px, py) => { x.fillStyle = 'rgba(120,180,230,0.85)'; rrect(x, px - 26, py - 70, 52, 130, 14); x.fill(); x.fillStyle = '#2d5fa8'; x.fillRect(px - 12, py - 92, 24, 24); });
    } });
    tag(ctx, 90, 240, 'ЕДА', appear(t, Wd(38, 'еду')), '#ffffff');
    tag(ctx, 90, 316, 'ВОДА', appear(t, Wd(38, 'воду')), '#7fb0ff');
    vignette(ctx, .4);
  } },
  // Впервые за сутки я не один.
  { t0: C(39), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.06);
    island(ctx, t, { tod: 'dusk', hz: 900, shore: 1150, sun: [540, 860], palms: [[90, 1240, 760, .22, 9], [1000, 1220, 680, -.2, 10]], extra: x => {
      silhouette(x, y => { toon(y, 470, 1320, 360, { sit: 'front', back: 1, noShadow: true }, ANTON); toon(y, 615, 1320, 340, { sit: 'front', back: 1, noShadow: true }, MIRRA); }, '#24141c');
    } });
    headline(ctx, 'НЕ ОДИН', appear(t, Wd(39, 'один')), 'y', 300, 'ВПЕРВЫЕ ЗА СУТКИ', 120);
    vignette(ctx, .4);
  } },
  // Включаю рацию.
  { t0: C(40), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 820, 1.0, 1.06);
    radioClose(ctx, t, 1, null);
    tag(ctx, 90, 240, 'РАЦИЯ', appear(t, Wd(40, 'рацию')), PAL.yellow);
  } },
  // Сквозь шум: «Осталось семьдесят два часа.
  { t0: C(41), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 820, 1.04, 1.12);
    radioClose(ctx, t, .35 + .25 * noise1(t * 3), t > Wd(41, 'семьдесят') ? t - Wd(41, 'семьдесят') : null, 72 * 3600);
    tag(ctx, 90, 140, 'СКВОЗЬ ШУМ', appear(t, Wd(41, 'шум')), '#ffffff');
    headline(ctx, '«ОСТАЛОСЬ 72 ЧАСА»', appear(t, Wd(41, 'осталось')), 'y', 280, null, 84);
  } },
  // Точка эвакуации — на северной стороне острова».
  { t0: C(42), trans: 'zoom', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#2c79ad'], [1, '#1d5f8c']]);
    ctx.save(); ctx.translate(540, 700); ctx.scale(.8, .8); ctx.translate(-540, -800);
    islandMap(ctx, t, { camp: clamp(lt / .4), north: (t - Wd(42, 'северной')) / .4 });
    ctx.restore();
    headline(ctx, 'ТОЧКА ЭВАКУАЦИИ', appear(t, Wd(42, 'точка')), 'r', 1480, null, 80);
    tag(ctx, 90, 140, 'СЕВЕР ОСТРОВА', appear(t, Wd(42, 'северной')), PAL.yellow);
  } },
);
