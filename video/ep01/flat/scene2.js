// Episode 1, vertical flat cut — scene 2 (0:59.5–1:25.9): down the stairs, the open flat, the phone.
'use strict';

// A flight of stairs seen from the side, going down to the right.
function stairsSide(ctx, o = {}) {
  vgrad(ctx, 0, 0, W, 760, [[0, '#6e675a'], [1, '#857b66']]);
  vgrad(ctx, 0, 760, W, H - 760, [[0, '#2b5a52'], [1, '#22473f']]);
  ctx.fillStyle = '#1e3f3a'; ctx.fillRect(0, 752, W, 12);
  const x0 = -40, y0 = 820, n = 11, sw = 100, sh = 64;
  ctx.fillStyle = '#3b3631';
  poly(ctx, [[x0, y0], ...Array.from({ length: n }, (_, k) => [[x0 + k * sw, y0 + k * sh], [x0 + (k + 1) * sw, y0 + k * sh]]).flat(), [x0 + n * sw, H], [x0, H]]); ctx.fill();
  for (let k = 0; k < n; k++) {
    ctx.fillStyle = '#4e4840'; ctx.fillRect(x0 + k * sw, y0 + k * sh - 10, sw, 10);
    ctx.fillStyle = '#2c2824'; ctx.fillRect(x0 + k * sw + sw - 6, y0 + k * sh, 6, sh);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; poly(ctx, [[x0, y0 + 160], [x0 + n * sw, y0 + n * sh + 160], [x0 + n * sw, H], [x0, H]]); ctx.fill();
  ctx.fillStyle = '#17191e'; for (let k = 0; k <= n; k += 1) ctx.fillRect(x0 + k * sw + 40, y0 + k * sh - 250, 7, 240);
  ctx.strokeStyle = '#5a3d2a'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0 + 40, y0 - 260); ctx.lineTo(x0 + n * sw + 40, y0 + n * sh - 260); ctx.stroke();
  if (o.window !== false) { ctx.fillStyle = '#4c4a44'; ctx.fillRect(640, 150, 300, 360); vgrad(ctx, 655, 165, 270, 330, [[0, '#2e4868'], [1, '#6c849c']]); ctx.fillStyle = '#4c4a44'; ctx.fillRect(785, 165, 10, 330); ctx.fillRect(655, 300, 270, 10); }
  return { step: k => [x0 + k * sw + sw / 2, y0 + k * sh - 10] };
}

// Second-floor landing with flat 8 standing open.
function landingOpen(ctx, t, o = {}) {
  landing(ctx, { door: false, stairs: true });
  const dx = 150, fy = 1180;
  ctx.fillStyle = '#5a5246'; ctx.fillRect(dx, fy - 760, 360, 760);
  ctx.fillStyle = '#07080b'; ctx.fillRect(dx + 22, fy - 740, 316, 740);
  ctx.fillStyle = '#101218'; poly(ctx, [[dx + 22, fy - 740], [dx + 90, fy - 680], [dx + 90, fy - 50], [dx + 22, fy]]); ctx.fill();
  ctx.fillStyle = PAL.doorD; poly(ctx, [[dx + 22, fy - 740], [dx + 70, fy - 760], [dx + 70, fy + 18], [dx + 22, fy]]); ctx.fill();
  ctx.fillStyle = '#d9c9a0'; rrect(ctx, dx + 145, fy - 830, 70, 40, 8); ctx.fill();
  ctx.fillStyle = '#3a2a10'; ctx.font = '800 26px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('8', dx + 180, fy - 809);
  ctx.fillStyle = 'rgba(60,56,48,0.55)'; ctx.font = '900 150px Inter'; ctx.fillText('2', 560, 560);
  if (o.walker) { const u = o.walker; ctx.fillStyle = '#000'; toon(ctx, lerp(dx + 60, dx + 320, u), fy - 40, 520, walkPose(u * 8, 1, .8, { face: 1, eyes: 'red' }), { skin: '#0a0b0e', hair: '#050506', top: '#0a0b0e', topD: '#07080a', legs: '#07080a', shoes: '#040405' }); }
  if (o.torch) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(1000, 1500, 330, 760); g.addColorStop(0, 'rgba(255,240,200,0.22)'); g.addColorStop(1, 'rgba(255,240,200,0.05)');
    ctx.fillStyle = g; poly(ctx, [[1060, 1560], [1100, 1460], [460, 560], [180, 900]]); ctx.fill();
    glow(ctx, 330, 760, 260, 'rgba(255,236,190,1)', .35); ctx.restore();
  }
}

// The phone: lock screen with one notification. k zooms the card.
function phoneUI(ctx, t, cx = 540, cy = 760, s = 1) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  glow(ctx, 0, 0, 640, 'rgba(70,110,220,1)', .35);
  ctx.fillStyle = '#0b0d12'; rrect(ctx, -270, -540, 540, 1080, 70); ctx.fill();
  const g = ctx.createLinearGradient(0, -520, 0, 520); g.addColorStop(0, '#1e2d4d'); g.addColorStop(1, '#0c1224');
  ctx.fillStyle = g; rrect(ctx, -250, -520, 500, 1040, 56); ctx.fill();
  ctx.fillStyle = '#05060a'; rrect(ctx, -70, -500, 140, 34, 17); ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = 'rgba(240,244,255,0.95)';
  ctx.font = '300 150px Inter'; ctx.fillText('06:14', 0, -250);
  ctx.font = '600 30px Inter'; ctx.fillStyle = 'rgba(225,232,250,0.8)'; ctx.fillText('понедельник, 26 октября', 0, -195);
  ctx.textAlign = 'right'; ctx.font = '700 24px Inter'; ctx.fillStyle = PAL.red; ctx.fillText('4%', 200, -440);
  ctx.fillStyle = 'rgba(235,240,250,0.16)'; rrect(ctx, -225, -80, 450, 190, 34); ctx.fill();
  ctx.fillStyle = PAL.green; rrect(ctx, -195, -52, 64, 64, 16); ctx.fill();
  ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = '700 28px Inter'; ctx.fillText('Неизвестный номер', -112, -14);
  ctx.fillStyle = 'rgba(210,216,230,0.75)'; ctx.font = '600 22px Inter'; ctx.fillText('сейчас', -112, 18);
  ctx.fillStyle = '#fff'; ctx.font = '700 36px Inter'; ctx.fillText('Не спускайся в подвал', -195, 78);
  ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 2.5;
  for (const pts of [[[160, -520], [100, -380], [130, -220], [40, -60], [70, 140], [-20, 330]], [[100, -380], [-60, -330], [-190, -390]], [[40, -60], [-90, 10], [-230, -10]]]) {
    ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.stroke();
  }
  ctx.restore();
}

// Looking down the stairwell: railings wind down around a dark shaft.
function shaft(ctx, t) {
  vgrad(ctx, 0, 0, W, H, [[0, '#2a2f37'], [1, '#14171d']]);
  const cx = 540, cy = 900;
  for (let k = 0; k < 9; k++) {
    const s = Math.pow(.74, k), w = 980 * s, h = 1500 * s;
    ctx.fillStyle = `rgb(${60 - k * 6},${66 - k * 6},${62 - k * 6})`; ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    ctx.fillStyle = `rgb(${44 - k * 4},${92 - k * 9},${84 - k * 8})`; ctx.fillRect(cx - w / 2 + 30 * s, cy - h / 2 + 30 * s, w - 60 * s, h - 60 * s);
    ctx.strokeStyle = `rgb(${110 - k * 9},${76 - k * 6},${52 - k * 5})`; ctx.lineWidth = 20 * s; ctx.strokeRect(cx - w / 2 + 70 * s, cy - h / 2 + 70 * s, w - 140 * s, h - 140 * s);
  }
  ctx.fillStyle = '#030405'; const s = Math.pow(.74, 9); ctx.fillRect(cx - 490 * s, cy - 750 * s, 980 * s, 1500 * s);
  glow(ctx, cx, cy, 200, 'rgba(0,0,0,1)', .8, 'source-over');
}

// The basement door at the bottom of the stairs.
function basementDoor(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#1d2421'], [1, '#121614']]);
  ctx.fillStyle = '#2a332e'; ctx.fillRect(0, 1180, W, H - 1180);
  ctx.fillStyle = '#3a423c'; ctx.fillRect(230, 380, 620, 820);
  ctx.fillStyle = '#020303'; ctx.fillRect(260, 410, 560, 790);
  const open = o.open ?? .25, dw = 560 * (1 - open);
  ctx.fillStyle = '#4b5a50'; ctx.fillRect(260, 410, dw, 790);
  ctx.fillStyle = '#3d4a42'; for (const yy of [470, 1100]) ctx.fillRect(280, yy, dw - 40, 22);
  ctx.fillStyle = '#6b746d'; for (let k = 0; k < 6; k++) { ell(ctx, 290, 450 + k * 140, 7, 7); ctx.fill(); }
  ctx.fillStyle = '#2c342f'; ctx.fillRect(260 + dw, 400, 18, 810);
  ctx.fillStyle = '#c8b79a'; ctx.fillRect(330, 270, 420, 80); ctx.fillStyle = '#2a2418'; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ПОДВАЛ', 540, 312);
  for (let k = 0; k < 9; k++) { ctx.fillStyle = k % 2 ? '#1c1c18' : '#c9a21e'; poly(ctx, [[230 + k * 70, 1200], [270 + k * 70, 1200], [300 + k * 70, 1240], [260 + k * 70, 1240]]); ctx.fill(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 5; i++) { const u = (t * .07 + i / 5) % 1; glow(ctx, 700 + u * 200, 1150 - u * 120, 120 + u * 160, 'rgba(120,160,200,1)', .07 * Math.sin(Math.PI * u)); }
  ctx.restore();
}

SHOTS.push(
  // Я спустился вниз.
  { t0: 59.545, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.05);
    const st = stairsSide(ctx);
    const u = lt / d, [px, py] = st.step(2.2 + u * 2.5);
    toon(ctx, px, py, 420, walkPose(lt * 7, 1, .7, { face: 1, armR: [1.2, -.2], props: { torch: 'R' } }));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(px + 300, py + 130, 0, px + 300, py + 130, 260);
    g.addColorStop(0, 'rgba(255,236,190,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
    specks(ctx, t, 40, 31); vignette(ctx);
  } },
  // На втором этаже дверь была открыта.
  { t0: C(37), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 400, 800, 1, 1.06);
    landingOpen(ctx, t, { torch: 1 });
    tag(ctx, 640, 240, '2 ЭТАЖ', appear(lt, .2), '#ffffff', 'КВ. 8 — ОТКРЫТА');
    specks(ctx, t, 40, 32); vignette(ctx);
  } },
  // Внутри кто-то двигался.
  { t0: C(38), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 345, 800, 1.6, 1.75, 800);
    landingOpen(ctx, t, { torch: 1, walker: clamp((t - S(38) - .1) / 1.2) });
    tag(ctx, 90, 240, 'КТО-ТО ВНУТРИ', appear(lt, .3), PAL.red);
    specks(ctx, t, 30, 33); vignette(ctx);
  } },
  // Я выключил фонарик. Замер.
  { t0: C(39), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.02, 1.08);
    const off = t > S(39) + .55;
    landingOpen(ctx, t, { torch: !off });
    toon(ctx, 820, 1190, 470, { face: -1, armL: [-1.3, -.1], props: { torch: 'L', torchDir: -1.45 }, eyes: off ? 'wide' : 'dot' });
    if (off) tint(ctx, '#000', .6, 'source-over');
    if (t > C(40)) tag(ctx, 90, 240, 'ЗАМЕР', appear(t, C(40)));
    specks(ctx, t, 30, 34); vignette(ctx, .7);
  } },
  // Из квартиры донёсся скрип. Потом ещё один.
  { t0: C(41), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 420, 800, 1.3, 1.45, 820);
    landingOpen(ctx, t, {});
    tint(ctx, '#000', .55, 'source-over');
    const n = (t > S(41) + .1) + (t > S(42) + .1);
    headline(ctx, ['', 'СКРИП.', 'СКРИП. СКРИП.'][n], n ? 1 : 0, 'w', 300, n ? 'ИЗ КВАРТИРЫ' : null);
    specks(ctx, t, 30, 35); vignette(ctx, .7);
  } },
  // Я медленно отступил.
  { t0: C(43), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.06, 1.0);
    landingOpen(ctx, t, {});
    tint(ctx, '#000', .5, 'source-over');
    const u = inout(lt / d);
    toon(ctx, lerp(700, 900, u), 1190, 470, walkPose(-lt * 5, -1, .5, { face: -1, eyes: 'wide' }));
    specks(ctx, t, 30, 36); vignette(ctx, .7);
  } },
  // На лестнице лежал телефон.
  { t0: C(44), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 560, 1000, 1, 1.1);
    const st = stairsSide(ctx, { window: false });
    tint(ctx, '#000', .45, 'source-over');
    const [px, py] = st.step(6);
    glow(ctx, px, py - 10, 260, 'rgba(80,130,240,1)', .5);
    ctx.fillStyle = '#0b0d12'; rrect(ctx, px - 46, py - 22, 92, 20, 6); ctx.fill(); ctx.fillStyle = '#6f9eea'; rrect(ctx, px - 40, py - 20, 80, 14, 4); ctx.fill();
    tag(ctx, 90, 240, 'ТЕЛЕФОН', appear(lt, .25), PAL.yellow);
    specks(ctx, t, 40, 37); vignette(ctx);
  } },
  // Его экран всё ещё работал. На экране было сообщение.
  { t0: C(45), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#080b12'], [1, '#0d111b']]);
    phoneUI(ctx, t, 540, 700, .95);
    specks(ctx, t, 30, 38);
  } },
  // Не спускайся в подвал.
  { t0: C(47), draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#080b12'], [1, '#0d111b']]);
    const s = lerp(1.22, 1.3, inout(lt / d));
    phoneUI(ctx, t, 540, 420 + 540 * s, s);
    headline(ctx, '«НЕ СПУСКАЙСЯ В ПОДВАЛ»', appear(lt, .1), 'r', 250, null, 74);
    specks(ctx, t, 30, 39);
  } },
  // Я посмотрел вниз.
  { t0: C(48), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.18);
    shaft(ctx, t);
    specks(ctx, t, 40, 40); vignette(ctx);
  } },
  // Дверь подвала была открыта.
  { t0: C(49), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1, 1.06);
    basementDoor(ctx, t, { open: .3 });
    tag(ctx, 90, 150, 'ОТКРЫТА', appear(lt, .3), PAL.red);
    specks(ctx, t, 40, 41); vignette(ctx);
  } },
  // Я должен был уйти.
  { t0: C(50), fadeOut: .35, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.05);
    basementDoor(ctx, t, { open: .3 });
    toon(ctx, 820, 1600, 900, { face: -1, eyes: 'wide', armL: [-.2, -.2], props: { torch: 'L', torchDir: -.3 } });
    specks(ctx, t, 40, 42); vignette(ctx, .7);
  } },
);
