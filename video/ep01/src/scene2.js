// Episode 1, scene 2 (0:59.5–1:25.9): down the stairs, the open flat on the second floor, the phone.
'use strict';

// Two-tone stairwell paint: whitewash above, oil paint below.
function stairPaint(x, w, h, band, seed) {
  vgrad(x, 0, 0, w, band, [[0, '#17191a'], [1, '#2d3133']]);
  vgrad(x, 0, band, w, h - band, [[0, '#1c2c2a'], [1, '#101b1a']]);
  x.fillStyle = '#0c1312'; x.fillRect(0, band - 5, w, 9);
  grime(x, noiseTex(Math.ceil(w / 3), Math.ceil(h / 3), { seed, scale: 45, contrast: 1.6 }), 0, 0, w, h, .5);
}

// ---------- H: a flight of stairs going down, seen from the top step ----------

const HS = { w: 2400, h: 1350, vx: 1200, vy: 300 };

function envStairs(kind) {
  return env('stairs_' + kind, () => {
    const c = mk(HS.w, HS.h), x = c.getContext('2d'), r = rng(kind === 'window' ? 91 : 92);
    const k = y => (y - HS.vy) / (HS.h - HS.vy), L = y => HS.vx - 760 * k(y), R = y => HS.vx + 700 * k(y);
    // walls converge on the vanishing point
    stairPaint(x, HS.w, HS.h, 520, kind === 'window' ? 93 : 94);
    x.fillStyle = 'rgba(0,0,0,0.35)'; poly(x, [[0, 0], [HS.vx - 300, HS.vy - 140], [HS.vx - 300, 560], [0, HS.h]]); x.fill();
    // the far wall at the lower landing
    const fy0 = 300, fy1 = 560, fx0 = HS.vx - 300, fx1 = HS.vx + 300;
    x.fillStyle = kind === 'window' ? '#272b2d' : '#181d1d'; x.fillRect(fx0, fy0 - 160, fx1 - fx0, fy1 - fy0 + 160);
    grime(x, noiseTex(150, 100, { seed: 95, scale: 30 }), fx0, fy0 - 160, fx1 - fx0, fy1 - fy0 + 160, .5);
    if (kind === 'window') {
      x.save(); x.beginPath(); x.rect(HS.vx - 110, 190, 220, 230); x.clip(); x.translate(HS.vx - 110, 190);
      skyArt(x, 220, 230, 190, { warm: .9, seed: 96 }); x.restore();
      x.fillStyle = '#25282a'; x.fillRect(HS.vx - 6, 190, 12, 230); x.fillRect(HS.vx - 110, 280, 220, 10);
      x.strokeStyle = '#25282a'; x.lineWidth = 14; x.strokeRect(HS.vx - 117, 183, 234, 244);
      x.fillStyle = 'rgba(200,205,200,0.5)'; x.font = '600 70px Inter'; x.textAlign = 'center'; x.fillText('2', HS.vx + 200, 260);
    } else {
      // basement door, ajar, with a stencil
      x.fillStyle = '#2a302c'; x.fillRect(HS.vx - 120, 290, 240, 270);
      x.fillStyle = '#020303'; poly(x, [[HS.vx + 40, 290], [HS.vx + 120, 290], [HS.vx + 120, 560], [HS.vx + 40, 560]]); x.fill();
      x.fillStyle = '#39413b'; poly(x, [[HS.vx - 120, 290], [HS.vx + 40, 290], [HS.vx + 70, 280], [HS.vx + 70, 572], [HS.vx + 40, 560], [HS.vx - 120, 560]]); x.fill();
      grime(x, noiseTex(80, 90, { seed: 97, scale: 12, contrast: 2 }), HS.vx - 120, 280, 190, 292, .5);
      x.fillStyle = 'rgba(190,180,150,0.55)'; x.font = '600 34px Inter'; x.textAlign = 'center'; x.fillText('ПОДВАЛ', HS.vx - 40, 262);
      for (let i = 0; i < 5; i++) { x.fillStyle = i % 2 ? '#1a1a16' : '#6a5a22'; poly(x, [[HS.vx - 120 + i * 48, 572], [HS.vx - 96 + i * 48, 572], [HS.vx - 120 + i * 48 + 24, 590], [HS.vx - 144 + i * 48 + 24, 590]]); x.fill(); }
    }
    // landing floor at the bottom of the flight
    x.fillStyle = '#1d1915'; poly(x, [[L(560), 560], [R(560), 560], [R(600), 600], [L(600), 600]]); x.fill();
    // the steps, near to far
    let y = HS.h, d = 150;
    const steps = [];
    while (y > 600) { steps.push([y - d, y]); y -= d; d *= .84; }
    steps.forEach(([y0, y1], i) => {
      const yr = y0 + (y1 - y0) * .32;
      x.fillStyle = `rgb(${46 - i * 2},${42 - i * 2},${38 - i * 2})`; poly(x, [[L(y0), y0], [R(y0), y0], [R(yr), yr], [L(yr), yr]]); x.fill();
      x.fillStyle = `rgb(${30 - i},${27 - i},${24 - i})`; poly(x, [[L(yr), yr], [R(yr), yr], [R(y1), y1], [L(y1), y1]]); x.fill();
      x.fillStyle = 'rgba(150,160,170,0.14)'; poly(x, [[L(y0), y0], [R(y0), y0], [R(y0 + 3), y0 + 3], [L(y0 + 3), y0 + 3]]); x.fill();
    });
    grime(x, noiseTex(300, 200, { seed: 98, scale: 20, contrast: 1.6 }), 0, 600, HS.w, HS.h - 600, .45);
    // railing on the right, handrail falling toward the landing
    x.fillStyle = '#121314';
    steps.forEach(([y0], i) => { const bx = R(y0) - 20 * k(y0), bh = 520 * k(y0) + 60; x.fillRect(bx, y0 - bh, 8 * k(y0) + 3, bh); });
    x.lineCap = 'round'; x.strokeStyle = '#2a1f18'; x.lineWidth = 26; x.beginPath(); x.moveTo(R(HS.h) - 20, HS.h - 600); x.lineTo(R(600) - 8, 600 - 150); x.stroke();
    x.strokeStyle = 'rgba(190,200,215,0.16)'; x.lineWidth = 4; x.beginPath(); x.moveTo(R(HS.h) - 20, HS.h - 612); x.lineTo(R(600) - 8, 600 - 156); x.stroke();
    // void beyond the railing
    x.fillStyle = 'rgba(0,0,0,0.6)'; poly(x, [[R(HS.h) + 30, 0], [HS.w, 0], [HS.w, HS.h], [R(HS.h) + 30, HS.h]]); x.fill();
    // cold window light falling down the flight
    if (kind === 'window') { x.save(); x.globalCompositeOperation = 'lighter'; glow(x, HS.vx, 330, 700, 'rgba(110,140,180,1)', .14); x.restore(); }
    else { x.save(); x.globalCompositeOperation = 'lighter'; glow(x, HS.vx + 80, 520, 260, 'rgba(90,110,140,1)', .1); x.restore(); }
    return c;
  });
}

// ---------- I: second-floor landing, door of flat 8 left open ----------

function envLanding2() {
  return env('landing2', () => {
    const c = mk(B.w, B.h), x = c.getContext('2d'), r = rng(101);
    stairPaint(x, B.w, B.wall, B.band, 102);
    for (let i = 0; i < 20; i++) { x.fillStyle = `rgba(0,0,0,${.08 + r() * .1})`; ell(x, r() * B.w, r() * (B.band - 40), 14 + r() * 50, 10 + r() * 20, r() * 3); x.fill(); }
    x.fillStyle = 'rgba(200,205,200,0.35)'; x.font = '600 120px Inter'; x.textAlign = 'center'; x.fillText('2', 1700, 420);
    x.fillStyle = 'rgba(200,205,200,0.25)'; x.font = '600 40px Inter'; x.fillText('ЭТАЖ', 1700, 470);
    // flat 7 (closed)
    x.fillStyle = '#121918'; x.fillRect(330, 160, 460, 920); x.drawImage(steelDoor('7', 103), 360, 190, 400, 890);
    // flat 8: the door stands open into the dark flat
    x.fillStyle = '#121918'; x.fillRect(1010, 160, 460, 920);
    vgrad(x, 1040, 190, 400, 890, [[0, '#050505'], [1, '#020202']]);
    // inside: a corridor of the flat, barely there
    x.fillStyle = '#0b0a09'; poly(x, [[1040, 190], [1160, 330], [1160, 960], [1040, 1080]]); x.fill();
    x.fillStyle = '#0d0c0b'; poly(x, [[1440, 190], [1330, 330], [1330, 960], [1440, 1080]]); x.fill();
    x.fillStyle = '#060505'; x.fillRect(1160, 330, 170, 630);
    x.fillStyle = '#100e0d'; poly(x, [[1040, 1080], [1160, 960], [1330, 960], [1440, 1080]]); x.fill();
    x.fillStyle = '#1a1614'; x.fillRect(1180, 520, 60, 80);
    x.save(); x.translate(1360, 620); x.rotate(.5); x.fillStyle = '#121010'; x.fillRect(-10, -150, 20, 300); x.restore();
    // the door leaf swung inward, seen edge-on
    x.fillStyle = '#3a3431'; poly(x, [[1040, 190], [1110, 250], [1110, 1010], [1040, 1080]]); x.fill();
    x.fillStyle = '#26221f'; poly(x, [[1110, 250], [1124, 256], [1124, 1004], [1110, 1010]]); x.fill();
    x.fillStyle = '#a9a292'; x.font = '600 26px Inter'; x.textAlign = 'center'; x.fillText('8', 1240, 150);
    // tiled floor
    const zf = 480 / 750, rows = 7, tw = 82;
    x.save(); poly(x, [[0, B.wall], [1720, B.wall], [2060, B.h], [0, B.h]]); x.clip();
    for (let n = 0; n < rows; n++) {
      const z0 = 1 - (1 - zf) * n / rows, z1 = 1 - (1 - zf) * (n + 1) / rows, y0 = B.vy + 480 / z0, y1 = B.vy + 480 / z1;
      for (let i = -18; i < 18; i++) { x.fillStyle = (i + n) % 2 ? '#38291f' : '#454036'; poly(x, [[B.vx + i * tw / z0, y0], [B.vx + (i + 1) * tw / z0, y0], [B.vx + (i + 1) * tw / z1, y1], [B.vx + i * tw / z1, y1]]); x.fill(); }
    }
    grime(x, noiseTex(600, 70, { seed: 104, scale: 24, contrast: 1.6 }), 0, B.wall, B.w, B.h - B.wall, .7);
    vgrad(x, 0, B.wall, B.w, B.h - B.wall, [[0, 'rgba(0,0,0,0.1)'], [1, 'rgba(0,0,0,0.6)']]);
    x.restore();
    x.save(); poly(x, [[1720, B.wall], [B.w, B.wall], [B.w, B.h], [2060, B.h]]); x.clip(); vgrad(x, 1700, B.wall, 700, 270, [[0, '#0b0d0d'], [1, '#030404']]); x.restore();
    x.fillStyle = '#18191a';
    for (let k = 0; k <= 12; k++) { const u = k / 12, fxp = 1720 + 340 * u, fy = B.wall + 270 * u, hy = 720 + 68 * u, bw = 6 + 5 * u; x.fillRect(fxp - bw / 2, hy, bw, fy - hy); }
    x.lineCap = 'round'; x.strokeStyle = '#2a1f18'; x.lineWidth = 18; x.beginPath(); x.moveTo(1720, 720); x.lineTo(2080, 790); x.stroke();
    vgrad(x, 0, 0, B.w, 90, [[0, 'rgba(0,0,0,0.6)'], [1, 'rgba(0,0,0,0)']]);
    x.save(); x.globalCompositeOperation = 'lighter'; glow(x, 2300, 200, 900, 'rgba(100,125,165,1)', .1); x.restore();
    return c;
  });
}

// ---------- J: the phone on a step ----------

const PHONE = { x: 930, y: 560, a: -.32, w: 300, h: 620 };

function envStep() {
  return env('step', () => {
    const c = mk(W, H), x = c.getContext('2d');
    vgrad(x, 0, 0, W, 260, [[0, '#121212'], [1, '#1c1b1a']]);
    grime(x, noiseTex(480, 65, { seed: 111, scale: 8, contrast: 1.3 }), 0, 0, W, 260, .5);
    x.fillStyle = '#4a4744'; x.fillRect(0, 252, W, 16); x.fillStyle = 'rgba(255,255,255,0.08)'; x.fillRect(0, 252, W, 3);
    vgrad(x, 0, 268, W, H - 268, [[0, '#2d2b28'], [1, '#1b1a18']]);
    grime(x, noiseTex(480, 205, { seed: 112, scale: 10, contrast: 1.3 }), 0, 268, W, H - 268, .5);
    grime(x, noiseTex(960, 410, { seed: 113, scale: 3, contrast: 1.3 }), 0, 268, W, H - 268, .3, 'overlay');
    const r = rng(114);
    for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(0,0,0,${.1 + r() * .2})`; ell(x, r() * W, 300 + r() * 760, 2 + r() * 8, 2 + r() * 5); x.fill(); }
    // phone body
    x.save(); x.translate(PHONE.x, PHONE.y); x.rotate(PHONE.a);
    x.shadowColor = 'rgba(0,0,0,0.8)'; x.shadowBlur = 30; x.shadowOffsetX = 14; x.shadowOffsetY = 18;
    rrect(x, -PHONE.w / 2 - 12, -PHONE.h / 2 - 12, PHONE.w + 24, PHONE.h + 24, 44); x.fillStyle = '#0d0d0f'; x.fill();
    x.restore();
    return c;
  });
}

function phoneScreen(x, t, glowK) {
  const w = PHONE.w, h = PHONE.h;
  const g = x.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#1d2a44'); g.addColorStop(1, '#0b1020');
  rrect(x, -w / 2, -h / 2, w, h, 34); x.fillStyle = g; x.fill();
  x.save(); rrect(x, -w / 2, -h / 2, w, h, 34); x.clip();
  glow(x, 40, -120, 260, 'rgba(90,120,200,1)', .35, 'source-over');
  x.fillStyle = 'rgba(240,244,255,0.95)'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  x.font = '300 92px Inter'; x.fillText('06:14', 0, -150);
  x.font = '500 20px Inter'; x.fillStyle = 'rgba(230,236,250,0.8)'; x.fillText('понедельник, 26 октября', 0, -110);
  x.font = '600 16px Inter'; x.textAlign = 'right'; x.fillText('4%', w / 2 - 22, -h / 2 + 30);
  x.strokeStyle = 'rgba(230,236,250,0.8)'; x.lineWidth = 2; x.strokeRect(w / 2 - 80, -h / 2 + 17, 26, 13); x.fillStyle = '#e04040'; x.fillRect(w / 2 - 78, -h / 2 + 19, 3, 9);
  // notification card
  rrect(x, -w / 2 + 16, -40, w - 32, 120, 20); x.fillStyle = 'rgba(235,240,250,0.18)'; x.fill();
  rrect(x, -w / 2 + 30, -26, 34, 34, 9); x.fillStyle = '#3fae5a'; x.fill();
  x.textAlign = 'left'; x.fillStyle = 'rgba(245,248,255,0.95)'; x.font = '600 15px Inter'; x.fillText('Неизвестный номер', -w / 2 + 74, -4);
  x.fillStyle = 'rgba(200,206,220,0.8)'; x.font = '500 11px Inter'; x.textAlign = 'right'; x.fillText('сейчас', w / 2 - 26, -18);
  x.textAlign = 'left'; x.fillStyle = 'rgba(245,248,255,0.95)'; x.font = '500 21px Inter'; x.fillText('Не спускайся в подвал', -w / 2 + 34, 44);
  // cracks from the top corner
  x.strokeStyle = 'rgba(255,255,255,0.22)'; x.lineWidth = 1.4;
  for (const pts of [[[100, -310], [60, -230], [80, -140], [20, -40], [40, 90], [-10, 200]], [[100, -310], [130, -200], [110, -60]], [[60, -230], [-40, -200], [-120, -240]], [[20, -40], [-60, 10], [-140, 0]]]) {
    x.beginPath(); pts.forEach(([px, py], i) => i ? x.lineTo(px, py) : x.moveTo(px, py)); x.stroke();
  }
  x.restore();
  // light from the screen on the step
  x.save(); x.globalCompositeOperation = 'lighter'; x.globalAlpha = glowK; rrect(x, -w / 2, -h / 2, w, h, 34); x.fillStyle = 'rgba(120,150,230,0.06)'; x.fill(); x.restore();
}

function drawStep(ctx, t) {
  ctx.drawImage(envStep(), 0, 0);
  const k = flicker(t, .06, 3, 7);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  glow(ctx, PHONE.x, PHONE.y, 700, 'rgba(90,120,210,1)', .22 * k); glow(ctx, PHONE.x, PHONE.y, 380, 'rgba(110,140,220,1)', .18 * k);
  ctx.restore();
  ctx.save(); ctx.translate(PHONE.x, PHONE.y); ctx.rotate(PHONE.a); phoneScreen(ctx, t, k); ctx.restore();
}

// ---------- shots ----------

SHOTS.push(
  // Я спустился вниз.
  { t0: 59.545, t1: C(37), fadeIn: .35, draw(ctx, t, d, g) {
    const bob = Math.sin(t * 6.5) * 6;
    camera(ctx, 1200, 760 + bob - t * 30, 1.0 + t * .03);
    ctx.drawImage(envStairs('window'), 0, 0);
    const sy = lerp(1180, 760, inout(t / d)), sx = 1180 + Math.sin(t * 1.7) * 40;
    torchLit(ctx, x => x.drawImage(litOf('stairs_window', envStairs('window'), 3.4), 0, 0), sx, sy, 330, .95);
    beam(ctx, [1500, 1700], [sx, sy], 220, .05);
  } },
  // На втором этаже дверь была открыта. Внутри кто-то двигался. Я выключил фонарик. Замер.
  { t0: C(37), t1: C(41), draw(ctx, t, d, g) {
    const off = g > S(39) + .55 ? 0 : 1, [cx, cy, z] = camPath(t, [[0, 1150, 700, 1.05], [d, 1200, 690, 1.12]]);
    camera(ctx, cx, cy, z);
    ctx.drawImage(envLanding2(), 0, 0);
    if (off) {
      const sx = 1230 + Math.sin(g * .9) * 50, sy = 640 + Math.sin(g * .7) * 30;
      torchLit(ctx, x => {
        x.drawImage(litOf('landing2', envLanding2(), 2.8), 0, 0);
        // someone crosses the corridor inside the flat
        const u = (g - S(38) - .2) / 1.1;
        if (u > 0 && u < 1) { x.fillStyle = '#050505'; figure(x, lerp(1120, 1380, u), 960, 560, walkPose(u * 7, 1, .8, { lean: .15 }), { view: 'side', face: 1 }); }
      }, sx, sy, 340, .95);
      beam(ctx, [600, 1600], [sx, sy], 260, .05);
    } else tint(ctx, '#000', .45, 'source-over');
  } },
  // Из квартиры донёсся скрип. Потом ещё один. Я медленно отступил.
  { t0: C(41), t1: C(44), draw(ctx, t, d, g) {
    const push = sstep(0, S(43) - C(41), t), back = inout((g - S(43)) / 1.6);
    camera(ctx, 1240, 640, 1.12 + .28 * push - .3 * back);
    ctx.drawImage(envLanding2(), 0, 0);
    tint(ctx, '#000', .45, 'source-over');
  } },
  // На лестнице лежал телефон. Его экран всё ещё работал. На экране было сообщение.
  { t0: C(44), t1: C(47), draw(ctx, t, d, g) {
    const [cx, cy, z] = camPath(t, [[0, 960, 560, 1.08], [d, 940, 560, 1.3]]);
    camera(ctx, cx, cy, z, -.03);
    drawStep(ctx, g);
  } },
  // Не спускайся в подвал.
  { t0: C(47), t1: C(48), draw(ctx, t, d, g) {
    const m = new DOMMatrix().translate(PHONE.x, PHONE.y).rotate(PHONE.a * 180 / Math.PI).transformPoint(new DOMPoint(0, 22));
    camera(ctx, m.x, m.y, 2.5 + t * .08, -PHONE.a);
    drawStep(ctx, g);
  } },
  // Я посмотрел вниз. Дверь подвала была открыта. Я должен был уйти.
  { t0: C(48), t1: 85.875, fadeOut: .45, draw(ctx, t, d, g) {
    const tilt = inout(t / 1.3), push = inout((g - S(49)) / (85.875 - S(49)));
    camera(ctx, 1200, lerp(900, 560, tilt), lerp(.95, 1.25, tilt) + .5 * push);
    ctx.drawImage(envStairs('basement'), 0, 0);
    // cold air seeping out of the basement
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) { const u = (g * .05 + i / 6) % 1; glow(ctx, 1200 + 120 * Math.sin(i * 2 + g * .3) + u * 200, 560 - u * 60, 160 + u * 200, 'rgba(120,150,190,1)', .05 * Math.sin(Math.PI * u)); }
    ctx.restore();
    dust(ctx, g, 40, [900, 300, 600, 400], 121, { alpha: .25, size: 1.6 });
  } },
);
