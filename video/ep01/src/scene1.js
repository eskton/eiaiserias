// Episode 1, scene 1 (0:00–0:59.5): the flat, the knocking, the blood on the landing.
// Shot times are seconds in ep01_voiceover_full.mp3 (see audio/ep01/timecodes.csv).
'use strict';

// ---------- shared art ----------

function skyArt(x, w, h, hz, { warm = .6, seed = 9 } = {}) {
  vgrad(x, 0, 0, w, h, [[0, '#04070d'], [.35, '#0a111c'], [hz / h * .92, '#1d2733'], [hz / h, '#2a323c'], [1, '#15181c']]);
  const g = x.createLinearGradient(0, hz - 260, 0, hz + 30);
  g.addColorStop(0, 'rgba(150,95,60,0)'); g.addColorStop(.85, `rgba(160,100,62,${.22 * warm})`); g.addColorStop(1, 'rgba(160,100,62,0)');
  x.fillStyle = g; x.fillRect(0, hz - 260, w, 300);
  const n = noiseTex(Math.ceil(w / 6), Math.ceil(hz / 10), { seed, scale: 26, sx: 4, contrast: 2.4 });
  x.save(); x.globalAlpha = .45; x.globalCompositeOperation = 'multiply'; x.drawImage(n, 0, 0, w, hz * .95); x.restore();
}

// Leatherette door of flat 14, quilted with studs. lit = flashlight version.
function doorArt(lit) {
  const w = 440, h = 980, c = mk(w, h), x = c.getContext('2d');
  vgrad(x, 0, 0, w, h, lit ? [[0, '#6e4932'], [1, '#4e3121']] : [[0, '#2a1a11'], [1, '#1d120b']]);
  grime(x, noiseTex(110, 245, { seed: 2, scale: 10 }), 0, 0, w, h, .35);
  const cols = 4, rows = 9, sx = (w - 70) / (cols - 1), sy = (h - 100) / (rows - 1), pt = (q, r) => [35 + q * sx, 50 + r * sy];
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const [ax, ay] = pt(q, r);
    if (q < cols - 1) glow(x, ax + sx / 2, ay, sx * .4, lit ? 'rgba(255,215,175,0.20)' : 'rgba(255,215,175,0.06)', 1, 'source-over');
    if (r < rows - 1) glow(x, ax, ay + sy / 2, sx * .4, lit ? 'rgba(255,215,175,0.20)' : 'rgba(255,215,175,0.06)', 1, 'source-over');
  }
  x.strokeStyle = lit ? 'rgba(25,10,3,0.75)' : 'rgba(0,0,0,0.65)'; x.lineWidth = 3; x.lineCap = 'round';
  for (let r = 0; r < rows - 1; r++) for (let q = 0; q < cols - 1; q++) {
    const [ax, ay] = pt(q, r), [bx, by] = pt(q + 1, r + 1), [cx, cy] = pt(q + 1, r), [dx, dy] = pt(q, r + 1);
    x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.moveTo(cx, cy); x.lineTo(dx, dy); x.stroke();
  }
  const stud = (px, py, rr) => {
    ell(x, px, py, rr, rr); x.fillStyle = lit ? '#c49a5c' : '#4a3a22'; x.fill();
    ell(x, px - rr * .35, py - rr * .35, rr * .4, rr * .4); x.fillStyle = lit ? '#f4ddb0' : '#7a643e'; x.fill();
  };
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) stud(...pt(q, r), 5);
  for (let r = 0; r < rows - 1; r++) for (let q = 0; q < cols - 1; q++) { const [ax, ay] = pt(q, r); stud(ax + sx / 2, ay + sy / 2, 5); }
  for (let i = 14; i < h - 10; i += 28) { stud(14, i, 3); stud(w - 14, i, 3); }
  for (let i = 42; i < w - 30; i += 28) { stud(i, 14, 3); stud(i, h - 14, 3); }
  ell(x, 220, 150, 34, 20); x.fillStyle = lit ? '#b89a60' : '#3d321e'; x.fill();
  x.fillStyle = lit ? '#3a2a10' : '#120d06'; x.font = '600 26px Inter'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('14', 220, 151);
  ell(x, 220, 290, 17, 17); x.fillStyle = lit ? '#a08850' : '#3a3020'; x.fill();
  ell(x, 220, 290, 10, 10); x.fillStyle = '#040506'; x.fill();
  rrect(x, 384, 450, 30, 180, 8); x.fillStyle = lit ? '#7a7a78' : '#2c2c2c'; x.fill();
  rrect(x, 318, 508, 92, 22, 10); x.fillStyle = lit ? '#a2a29e' : '#3c3c3c'; x.fill();
  x.fillStyle = lit ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.16)'; x.fillRect(326, 510, 76, 2);
  ell(x, 399, 600, 8, 8); x.fillStyle = '#080808'; x.fill();
  return c;
}

// Painted steel door of a neighbouring flat.
function steelDoor(num, seed) {
  const w = 400, h = 890, c = mk(w, h), x = c.getContext('2d');
  vgrad(x, 0, 0, w, h, [[0, '#3b3532'], [1, '#2a2624']]);
  for (const [px, py, pw, ph] of [[40, 70, 320, 330], [40, 470, 320, 360]]) {
    x.fillStyle = 'rgba(0,0,0,0.28)'; x.fillRect(px, py, pw, ph);
    x.fillStyle = 'rgba(255,255,255,0.035)'; x.fillRect(px + 8, py + 8, pw - 16, ph - 16);
  }
  grime(x, noiseTex(100, 220, { seed, scale: 18, contrast: 2 }), 0, 0, w, h, .45);
  x.fillStyle = '#a9a292'; x.font = '600 30px Inter'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(num, 200, 38);
  ell(x, 200, 262, 13, 13); x.fillStyle = '#262626'; x.fill(); ell(x, 200, 262, 7, 7); x.fillStyle = '#050505'; x.fill();
  rrect(x, 350, 430, 24, 120, 6); x.fillStyle = '#1e1e1e'; x.fill(); rrect(x, 296, 476, 76, 18, 8); x.fillStyle = '#4a4a48'; x.fill();
  return c;
}

// ---------- A: hallway inside flat 14, facing the front door ----------

const A = { w: 2400, h: 1350, x0: 980, x1: 1420, y0: 160, y1: 1140, vx: 1200, vy: 640 };

function envHall() {
  return env('hall', () => {
    const c = mk(A.w, A.h), x = c.getContext('2d');
    x.fillStyle = '#15120f'; x.fillRect(0, 0, A.w, A.h);
    for (let i = -20; i < A.w; i += 64) {
      x.fillStyle = 'rgba(190,160,120,0.035)'; x.fillRect(i, 0, 28, A.y1);
      x.fillStyle = 'rgba(0,0,0,0.16)'; x.fillRect(i + 31, 0, 2, A.y1);
    }
    x.fillStyle = 'rgba(190,160,120,0.03)';
    for (let i = 0; i < A.w; i += 64) for (let j = 30; j < A.y1; j += 90) { ell(x, i + 47, j + (i / 64 % 2) * 45, 6, 9); x.fill(); }
    grime(x, noiseTex(600, 300, { seed: 3, scale: 50, contrast: 1.7 }), 0, 0, A.w, A.y1, .55);
    vgrad(x, 0, 0, A.w, 320, [[0, 'rgba(0,0,0,0.65)'], [1, 'rgba(0,0,0,0)']]);
    // dim window light from the room behind the camera, falling on the left
    const lg = x.createRadialGradient(500, 500, 50, 500, 500, 1300);
    lg.addColorStop(0, 'rgba(110,130,170,0.07)'); lg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = lg; x.fillRect(0, 0, A.w, A.h);
    // parquet floor running to the door
    vgrad(x, 0, A.y1, A.w, A.h - A.y1, [[0, '#1c150f'], [1, '#0a0705']]);
    x.strokeStyle = 'rgba(0,0,0,0.5)'; x.lineWidth = 2;
    for (let xb = -1400; xb < 3800; xb += 74) {
      x.beginPath(); x.moveTo(xb, A.y1); x.lineTo(A.vx + (xb - A.vx) * (A.h - A.vy) / (A.y1 - A.vy), A.h); x.stroke();
    }
    grime(x, noiseTex(600, 60, { seed: 4, scale: 30, sx: 4 }), 0, A.y1, A.w, A.h - A.y1, .5);
    x.fillStyle = '#1d1813'; x.fillRect(0, A.y1 - 20, A.w, 20);
    x.fillStyle = 'rgba(255,230,200,0.05)'; x.fillRect(0, A.y1 - 20, A.w, 2);
    // door frame and the dark doorway behind the door
    x.fillStyle = '#1f1a16'; x.fillRect(A.x0 - 48, A.y0 - 48, A.x1 - A.x0 + 96, A.y1 - A.y0 + 48);
    x.fillStyle = 'rgba(255,230,200,0.05)'; x.fillRect(A.x0 - 48, A.y0 - 48, A.x1 - A.x0 + 96, 3); x.fillRect(A.x0 - 48, A.y0 - 48, 3, A.y1 - A.y0 + 48);
    x.fillStyle = '#060504'; x.fillRect(A.x0 - 6, A.y0 - 6, A.x1 - A.x0 + 12, A.y1 - A.y0 + 6);
    x.fillStyle = '#020202'; x.fillRect(A.x0, A.y0, A.x1 - A.x0, A.y1 - A.y0);
    // coat rack with two coats and a fur hat
    x.fillStyle = '#231a13'; x.fillRect(360, 380, 440, 24);
    x.fillStyle = '#0b0a09';
    ell(x, 545, 365, 70, 30); x.fill(); rrect(x, 480, 330, 130, 48, 20); x.fill();
    x.beginPath(); x.moveTo(500, 404); x.quadraticCurveTo(430, 430, 425, 520); x.lineTo(400, 1060); x.lineTo(665, 1060); x.lineTo(640, 520); x.quadraticCurveTo(630, 430, 580, 404); x.closePath(); x.fill();
    x.fillStyle = '#0e0c0b';
    x.beginPath(); x.moveTo(660, 404); x.quadraticCurveTo(610, 440, 612, 520); x.lineTo(600, 820); x.lineTo(790, 820); x.lineTo(780, 520); x.quadraticCurveTo(770, 430, 730, 404); x.closePath(); x.fill();
    x.fillStyle = '#141110'; x.fillRect(520, 404, 26, 520);
    x.strokeStyle = 'rgba(140,160,200,0.07)'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(500, 404); x.quadraticCurveTo(430, 430, 425, 520); x.lineTo(400, 1060); x.stroke();
    // mirror and shoe cabinet with a candle
    rrect(x, 1640, 360, 260, 460, 12); x.fillStyle = '#231c15'; x.fill();
    vgrad(x, 1656, 376, 228, 428, [[0, '#0b0e12'], [1, '#161b22']]);
    x.save(); x.globalCompositeOperation = 'lighter'; x.fillStyle = 'rgba(150,170,210,0.05)'; poly(x, [[1690, 376], [1760, 376], [1660, 700], [1656, 600]]); x.fill(); x.restore();
    rrect(x, 1590, 880, 360, 260, 6); x.fillStyle = '#17120e'; x.fill();
    x.fillStyle = '#221a13'; x.fillRect(1580, 868, 380, 16); x.fillStyle = 'rgba(255,230,200,0.06)'; x.fillRect(1580, 868, 380, 2);
    x.fillStyle = '#0c0907'; x.fillRect(1600, 960, 340, 3); ell(x, 1770, 925, 7, 7); x.fill();
    x.fillStyle = '#3a352d'; x.fillRect(1692, 790, 16, 64); ell(x, 1700, 856, 26, 7); x.fillStyle = '#2a2520'; x.fill();
    // light switch
    rrect(x, 1490, 600, 40, 64, 4); x.fillStyle = '#3f3d38'; x.fill(); x.fillStyle = '#2a2925'; x.fillRect(1504, 618, 12, 28);
    return c;
  });
}

function envFan() {
  return env('fan', () => {
    const c = mk(A.w, 300), x = c.getContext('2d');
    x.filter = 'blur(16px)';
    const g = x.createLinearGradient(0, 18, 0, 300);
    g.addColorStop(0, 'rgba(150,175,230,0.6)'); g.addColorStop(.22, 'rgba(120,150,210,0.24)'); g.addColorStop(1, 'rgba(90,120,180,0)');
    x.fillStyle = g; poly(x, [[A.x0 - 10, 18], [A.x1 + 10, 18], [A.x1 + 380, 300], [A.x0 - 380, 300]]); x.fill();
    return c;
  });
}

// The hallway with the door state: open 0..1, light (strip strength), feet (shadow x positions),
// spot (flashlight on the door, door-art coords), peepDark (someone blocks the peephole).
function drawHall(ctx, t, o = {}) {
  ctx.drawImage(envHall(), 0, 0);
  const open = clamp(o.open || 0), L = (o.light ?? 1) * flicker(t, .1, 2.5, 3), dh = A.y1 - A.y0;
  if (open > .001) {
    ctx.save(); ctx.beginPath(); ctx.rect(A.x0, A.y0, A.x1 - A.x0, dh); ctx.clip();
    ctx.drawImage(envLanding(), 1150, 100, 560, 1250, A.x0, A.y0, A.x1 - A.x0, dh + 4);
    ctx.restore();
  }
  // door panel; when open it swings toward the hinge and its free edge comes closer (taller)
  const door = env('door0', () => doorArt(0)), dw = (A.x1 - A.x0) * (1 - .8 * open);
  if (open < .001) ctx.drawImage(door, A.x0, A.y0, dw, dh);
  else {
    const n = 24;
    for (let i = 0; i < n; i++) {
      const u = i / n, sc = 1 + .22 * open * (u + .5 / n), top = A.vy - (A.vy - A.y0) * sc, bot = A.vy + (A.y1 - A.vy) * sc;
      ctx.drawImage(door, 440 * u, 0, 440 / n + .5, 980, A.x0 + dw * u, top, dw / n + .8, bot - top);
    }
    ctx.fillStyle = `rgba(0,0,0,${.45 * open})`;
    poly(ctx, [[A.x0, A.y0], [A.x0 + dw, A.vy - (A.vy - A.y0) * (1 + .22 * open)], [A.x0 + dw, A.vy + (A.y1 - A.vy) * (1 + .22 * open)], [A.x0, A.y1]]); ctx.fill();
    ctx.fillStyle = '#2a2018';
    ctx.fillRect(A.x0 + dw, A.vy - (A.vy - A.y0) * (1 + .22 * open), 12 * open + 1, (A.y1 - A.y0) * (1 + .22 * open));
  }
  if (o.spot && open < .001) {
    const [sc, sx] = scratch('spot', 440, 980), s = o.spot;
    sx.drawImage(env('door1', () => doorArt(1)), 0, 0);
    sx.globalCompositeOperation = 'destination-in';
    const g = sx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
    g.addColorStop(0, `rgba(0,0,0,${s.a})`); g.addColorStop(.55, `rgba(0,0,0,${s.a * .6})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    sx.fillStyle = g; sx.fillRect(0, 0, 440, 980);
    ctx.drawImage(sc, A.x0, A.y0);
    glow(ctx, A.x0 + s.x, A.y0 + s.y, s.r * 2.4, 'rgba(255,225,185,0.11)', s.a);
  }
  // light through the peephole
  if (open < .001 && !o.peepDark) { glow(ctx, A.x0 + 220, A.y0 + 290, 12, 'rgba(200,220,255,0.9)', .7 * L); ell(ctx, A.x0 + 220, A.y0 + 290, 2, 2); ctx.fillStyle = `rgba(220,235,255,${.8 * L})`; ctx.fill(); }
  // strip of corridor light under the door, cut by the feet of whoever stands outside
  const [fc, fx] = scratch('fan', A.w, 300);
  fx.drawImage(envFan(), 0, 0);
  fx.fillStyle = 'rgba(225,235,255,1)'; fx.fillRect(A.x0, 15, A.x1 - A.x0, 5);
  if (o.feet) {
    fx.globalCompositeOperation = 'destination-out';
    for (const f of o.feet) {
      const g = fx.createLinearGradient(0, 10, 0, 300); g.addColorStop(0, 'rgba(0,0,0,0.95)'); g.addColorStop(1, 'rgba(0,0,0,0.15)');
      fx.fillStyle = g; poly(fx, [[f - 26, 10], [f + 26, 10], [f + (f - A.vx) * .9 + 80, 300], [f + (f - A.vx) * .9 - 80, 300]]); fx.fill();
    }
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(L * .9);
  ctx.drawImage(fc, 0, A.y1 - 20);
  ctx.fillStyle = `rgba(150,175,230,${.05 * L})`; ctx.fillRect(A.x0 - 2, A.y0, 2, dh); ctx.fillRect(A.x0, A.y0 - 2, A.x1 - A.x0, 2);
  ctx.restore();
  if (open > .001) {
    // daylight from the landing floods the hallway
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, A.y1, 0, A.h); g.addColorStop(0, `rgba(140,165,215,${.3 * open})`); g.addColorStop(1, 'rgba(140,165,215,0)');
    ctx.fillStyle = g; poly(ctx, [[A.x0 + dw, A.y1], [A.x1, A.y1], [A.x1 + 600, A.h], [A.x0 + dw - 200, A.h]]); ctx.fill();
    glow(ctx, A.vx, 700, 1300, 'rgba(120,145,190,1)', .1 * open);
    ctx.restore();
  }
}

// Dust shaken out of the gap under the door by a knock.
function knockDust(ctx, t, hits) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [tk, a = 1] of hits) {
    const d = t - tk; if (d < 0 || d > 2.5) continue;
    const r = rng(Math.round(tk * 100));
    for (let i = 0; i < 26 * a; i++) {
      const x0 = A.x0 + r() * (A.x1 - A.x0), vx = (r() - .5) * 90, vy = -30 - r() * 60;
      const x = x0 + vx * d, y = 1136 + vy * d + 40 * d * d, s = 1 + r() * 2.2;
      const al = .55 * Math.exp(-d * 1.4) * (y < 1150 ? 1 : .4);
      ctx.fillStyle = `rgba(210,225,255,${al})`; ell(ctx, x, y, s, s); ctx.fill();
    }
  }
  ctx.restore();
}

// ---------- B: stairwell landing outside the flat ----------

const B = { w: 2400, h: 1350, wall: 1080, band: 620, vx: 1200, vy: 600 };

function envLanding() {
  return env('landing', () => {
    const c = mk(B.w, B.h), x = c.getContext('2d'), r = rng(12);
    vgrad(x, 0, 0, B.w, B.band, [[0, '#191b1c'], [1, '#2f3335']]);
    vgrad(x, 0, B.band, B.w, B.wall - B.band, [[0, '#1d2d2b'], [1, '#121e1d']]);
    x.fillStyle = '#0c1312'; x.fillRect(0, B.band - 5, B.w, 9);
    vgrad(x, 0, B.band + 4, B.w, 70, [[0, 'rgba(170,210,205,0.06)'], [1, 'rgba(0,0,0,0)']]);
    grime(x, noiseTex(800, 360, { seed: 11, scale: 70, contrast: 1.9 }), 0, 0, B.w, B.wall, .65);
    for (let i = 0; i < 26; i++) {
      const px = r() * B.w, py = r() * (B.band - 40), s = 12 + r() * 50;
      x.fillStyle = `rgba(0,0,0,${.08 + r() * .1})`; ell(x, px, py, s, s * (.4 + r() * .4), r() * 3); x.fill();
    }
    // window above the stairs
    const wx = 1880, wy = 150, ww = 360, wh = 450;
    x.save(); x.beginPath(); x.rect(wx, wy, ww, wh); x.clip(); x.translate(wx, wy);
    skyArt(x, ww, wh, wh * .8, { warm: .8, seed: 14 });
    x.fillStyle = '#10161e'; for (let i = 0; i < 7; i++) { const bh = 50 + r() * 130; x.fillRect(i * 58 - 12, wh * .8 - bh + 30, 50, bh + 200); }
    x.restore();
    grime(x, noiseTex(120, 150, { seed: 13, scale: 14 }), wx, wy, ww, wh, .4);
    x.fillStyle = '#272a2c';
    x.fillRect(wx - 22, wy - 22, ww + 44, 22); x.fillRect(wx - 22, wy + wh, ww + 44, 26); x.fillRect(wx - 22, wy, 22, wh); x.fillRect(wx + ww, wy, 22, wh);
    x.fillRect(wx + ww / 2 - 9, wy, 18, wh); x.fillRect(wx, wy + wh * .36, ww, 16);
    x.strokeStyle = 'rgba(200,220,240,0.22)'; x.lineWidth = 1.5;
    x.beginPath(); x.moveTo(wx + 40, wy + 200); x.lineTo(wx + 95, wy + 240); x.lineTo(wx + 120, wy + 330); x.lineTo(wx + 150, wy + 360); x.stroke();
    // electrical box between the doors, door hanging open
    x.fillStyle = '#2b2f2e'; x.fillRect(850, 360, 130, 220); x.fillStyle = '#0d0f0f'; x.fillRect(858, 368, 114, 204);
    x.fillStyle = '#323735'; poly(x, [[858, 368], [800, 350], [800, 600], [858, 572]]); x.fill();
    x.strokeStyle = '#151817'; x.lineWidth = 4;
    for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(880 + i * 22, 470); x.bezierCurveTo(880 + i * 22, 560, 900 + i * 14, 590, 890 + i * 10, 650 + i * 20); x.stroke(); }
    // doors: 14 (the hero's, leatherette) and 15
    for (const [dx, art] of [[360, null], [1040, steelDoor('15', 15)]]) {
      x.fillStyle = '#121918'; x.fillRect(dx - 30, 160, 460, 920);
      x.fillStyle = 'rgba(255,255,255,0.04)'; x.fillRect(dx - 30, 160, 460, 3);
      if (art) x.drawImage(art, dx, 190, 400, 890);
      else { x.drawImage(env('door0', () => doorArt(0)), dx, 190, 400, 890); x.globalAlpha = .35; x.drawImage(env('door1', () => doorArt(1)), dx, 190, 400, 890); x.globalAlpha = 1; }
    }
    // tiled floor in perspective
    const zb = 1, zf = 480 / 750, rows = 7, tw = 82;
    x.save(); poly(x, [[0, B.wall], [1720, B.wall], [2060, B.h], [0, B.h]]); x.clip();
    for (let n = 0; n < rows; n++) {
      const z0 = zb - (zb - zf) * n / rows, z1 = zb - (zb - zf) * (n + 1) / rows, y0 = B.vy + 480 / z0, y1 = B.vy + 480 / z1;
      for (let i = -18; i < 18; i++) {
        x.fillStyle = (i + n) % 2 ? '#3b2b21' : '#4a4338';
        poly(x, [[B.vx + i * tw / z0, y0], [B.vx + (i + 1) * tw / z0, y0], [B.vx + (i + 1) * tw / z1, y1], [B.vx + i * tw / z1, y1]]); x.fill();
      }
    }
    x.strokeStyle = 'rgba(10,8,6,0.8)'; x.lineWidth = 3;
    for (let i = -18; i < 19; i++) { x.beginPath(); x.moveTo(B.vx + i * tw, B.wall); x.lineTo(B.vx + i * tw / zf, B.h); x.stroke(); }
    grime(x, noiseTex(600, 70, { seed: 16, scale: 24, contrast: 1.6 }), 0, B.wall, B.w, B.h - B.wall, .7);
    vgrad(x, 0, B.wall, B.w, B.h - B.wall, [[0, 'rgba(0,0,0,0.1)'], [1, 'rgba(0,0,0,0.55)']]);
    x.fillStyle = 'rgba(16,12,10,0.85)'; poly(x, [[380, 1092], [740, 1092], [760, 1135], [362, 1135]]); x.fill();
    x.restore();
    // the stairwell drops away on the right, behind a railing
    x.save(); poly(x, [[1720, B.wall], [B.w, B.wall], [B.w, B.h], [2060, B.h]]); x.clip();
    vgrad(x, 1700, B.wall, 700, 270, [[0, '#0b0d0d'], [1, '#030404']]);
    for (let k = 0; k < 7; k++) { x.fillStyle = `rgba(120,140,150,${.07 - k * .008})`; x.fillRect(1700, B.wall + 26 + k * 38, 700, 4); }
    x.restore();
    x.fillStyle = '#18191a';
    for (let k = 0; k <= 12; k++) { const u = k / 12, fxp = 1720 + 340 * u, fy = B.wall + 270 * u, hy = 720 + 68 * u, bw = 6 + 5 * u; x.fillRect(fxp - bw / 2, hy, bw, fy - hy); }
    x.lineCap = 'round'; x.strokeStyle = '#2a1f18'; x.lineWidth = 18; x.beginPath(); x.moveTo(1720, 720); x.lineTo(2080, 790); x.stroke();
    x.strokeStyle = 'rgba(190,200,215,0.18)'; x.lineWidth = 3; x.beginPath(); x.moveTo(1722, 713); x.lineTo(2080, 782); x.stroke();
    // dead bulb on its wire
    x.strokeStyle = '#0e0f10'; x.lineWidth = 3; x.beginPath(); x.moveTo(1200, 0); x.lineTo(1200, 126); x.stroke();
    ell(x, 1200, 142, 15, 18); x.fillStyle = '#34352f'; x.fill();
    vgrad(x, 0, 0, B.w, 90, [[0, 'rgba(0,0,0,0.6)'], [1, 'rgba(0,0,0,0)']]);
    // cold light from the window
    x.save(); x.globalCompositeOperation = 'lighter'; x.filter = 'blur(40px)';
    const g = x.createLinearGradient(wx, wy, 1300, 1300); g.addColorStop(0, 'rgba(120,150,190,0.11)'); g.addColorStop(1, 'rgba(120,150,190,0)');
    x.fillStyle = g; poly(x, [[wx, wy + 40], [wx + ww, wy + wh], [1750, B.h], [1050, B.h]]); x.fill();
    x.restore();
    return c;
  });
}

function envTrail() {
  return env('trail', () => {
    const c = mk(B.w, B.h), x = c.getContext('2d'), r = rng(31);
    const path = spline([[560, 1102], [700, 1150], [900, 1200], [1150, 1236], [1400, 1226], [1600, 1192], [1745, 1150]], 26);
    const persp = py => (py - B.vy) / (B.wall - B.vy);
    x.lineCap = 'round'; x.lineJoin = 'round';
    // body of the smear: wide, dark, uneven
    x.strokeStyle = '#1e0103'; x.globalAlpha = .55;
    for (let i = 0; i < path.length - 1; i++) {
      const [ax, ay] = path[i], [bx, by] = path[i + 1], wv = 26 * persp(ay) * (.5 + .7 * noise1(i * .09 + 2));
      if (noise1(i * .11 + 40) < .2) continue;
      x.lineWidth = wv; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
    }
    // drag streaks across the width
    for (let k = 0; k < 16; k++) {
      const off = k / 15 - .5;
      x.strokeStyle = ['#2a0204', '#3c0306', '#4a0508'][k % 3]; x.globalAlpha = .3 + .35 * hash1(k * 3.1); x.lineWidth = 2 + 4 * hash1(k * 7.7);
      x.beginPath(); let pen = false;
      path.forEach(([px, py], i) => {
        const wv = 26 * persp(py) * (.5 + .7 * noise1(i * .09 + 2)), o = off * wv + (noise1(i * .25 + k * 5) - .5) * 4;
        if (noise1(i * .17 + k * 13) < .28) { pen = false; return; }
        pen ? x.lineTo(px, py + o) : x.moveTo(px, py + o); pen = true;
      });
      x.stroke();
    }
    x.globalAlpha = .85;
    for (let i = 0; i < 90; i++) {
      const p = path[(r() * path.length) | 0], s = 1.5 + r() * 6, d = r() ** 2;
      x.fillStyle = r() < .5 ? '#2e0204' : '#450508'; ell(x, p[0] + (r() - .5) * 220 * d, p[1] + (r() - .5) * 60 * d, s, s * .45); x.fill();
    }
    // a smeared hand print on door 14's frame
    x.globalAlpha = .6; x.fillStyle = '#330306';
    for (let k = 0; k < 4; k++) { x.save(); x.translate(330 + k * 12, 860 - k * 4); x.rotate(-.3 + k * .12); rrect(x, -6, -60, 13, 70, 6); x.fill(); x.restore(); }
    ell(x, 352, 905, 26, 30); x.fill();
    for (let k = 0; k < 5; k++) { x.fillRect(340 + k * 7, 930, 3, 40 + k * 14); }
    x.globalAlpha = 1; x.globalCompositeOperation = 'lighter'; x.strokeStyle = 'rgba(255,170,170,0.1)'; x.lineWidth = 1.5;
    for (let i = 0; i < path.length - 1; i += 3) {
      if (noise1(i * .4 + 3) < .55) continue;
      const [ax, ay] = path[i], [bx, by] = path[i + 2] || path[i + 1]; x.beginPath(); x.moveTo(ax, ay - 4); x.lineTo(bx, by - 4); x.stroke();
    }
    c.path = path;
    return c;
  });
}

// Specular glints moving over the wet trail.
function twinkle(ctx, t, n = 24) {
  const path = envTrail().path, r = rng(77);
  for (let i = 0; i < n; i++) {
    const p = path[(r() * path.length) | 0], ph = r() * 10, a = Math.pow(Math.max(0, Math.sin(t * 1.3 + ph)), 8);
    if (a > .02) glow(ctx, p[0] + (r() - .5) * 20, p[1] - 4, 10, 'rgba(255,215,215,1)', .5 * a);
  }
}

// ---------- C: wristwatch at 6:12 ----------

function envWatch() {
  return env('watch', () => {
    const c = mk(W, H), x = c.getContext('2d'), cx = 960, cy = 540;
    x.fillStyle = '#101216'; x.fillRect(0, 0, W, H);
    grime(x, noiseTex(480, 270, { seed: 41, scale: 18, sx: 4, contrast: 1.6 }), 0, 0, W, H, .6);
    vgrad(x, 0, 250, W, 560, [[0, 'rgba(0,0,0,0)'], [.2, '#251d19'], [.5, '#33271f'], [.8, '#1f1814'], [1, 'rgba(0,0,0,0)']]);
    rrect(x, -20, 410, W + 40, 260, 30); x.fillStyle = '#1b120c'; x.fill();
    grime(x, noiseTex(480, 60, { seed: 42, scale: 6, sx: 3 }), 0, 410, W, 260, .4);
    x.strokeStyle = 'rgba(120,90,60,0.35)'; x.lineWidth = 2; x.setLineDash([10, 8]);
    for (const y of [428, 652]) { x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
    x.setLineDash([]);
    let g = x.createRadialGradient(cx - 80, cy - 90, 40, cx, cy, 345);
    g.addColorStop(0, '#8a8f96'); g.addColorStop(.7, '#3c4046'); g.addColorStop(1, '#16181b');
    ell(x, cx, cy, 345, 345); x.fillStyle = g; x.fill();
    ell(x, cx, cy, 318, 318); x.fillStyle = '#1d2024'; x.fill();
    g = x.createRadialGradient(cx, cy, 0, cx, cy, 300); g.addColorStop(0, '#171b20'); g.addColorStop(1, '#07090b');
    ell(x, cx, cy, 300, 300); x.fillStyle = g; x.fill();
    for (let i = 0; i < 60; i++) {
      const a = i / 60 * Math.PI * 2, big = i % 5 === 0, r0 = big ? 236 : 268, r1 = 286;
      x.strokeStyle = big ? '#cfe6c2' : '#4f555c'; x.lineWidth = big ? 12 : 3;
      x.beginPath(); x.moveTo(cx + Math.sin(a) * r0, cy - Math.cos(a) * r0); x.lineTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1); x.stroke();
    }
    x.fillStyle = '#bcd6b0'; x.font = '600 56px Inter'; x.textAlign = 'center'; x.textBaseline = 'middle';
    [['12', 0], ['3', 3], ['6', 6], ['9', 9]].forEach(([s, h]) => { const a = h / 12 * Math.PI * 2; x.fillText(s, cx + Math.sin(a) * 192, cy - Math.cos(a) * 192 + 2); });
    x.fillStyle = '#6d747c'; x.font = '600 20px Inter'; x.fillText('17 КАМНЕЙ', cx, cy + 112);
    x.save(); x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; glow(x, cx + Math.sin(a) * 262, cy - Math.cos(a) * 262, 34, 'rgba(160,230,150,1)', .16); }
    x.restore();
    return c;
  });
}

function drawWatch(ctx, t, sec) {
  const cx = 960, cy = 540;
  ctx.drawImage(envWatch(), 0, 0);
  const hand = (a, len, w, back, fill, lume) => {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
    poly(ctx, [[-w * .5, back], [-w * .32, -len * .8], [0, -len], [w * .32, -len * .8], [w * .5, back]]);
    ctx.fillStyle = fill; ctx.fill();
    if (lume) { poly(ctx, [[-w * .22, -len * .2], [-w * .15, -len * .78], [0, -len * .9], [w * .15, -len * .78], [w * .22, -len * .2]]); ctx.fillStyle = '#cfe8c2'; ctx.fill(); }
    ctx.restore();
  };
  const s = Math.floor(sec), tick = s;
  hand((6 + 12 / 60 + s / 3600) / 12 * Math.PI * 2, 170, 26, 30, '#2a2e33', true);
  hand((12 + s / 60) / 60 * Math.PI * 2, 252, 18, 34, '#2a2e33', true);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  glow(ctx, cx + Math.sin(3.25) * 110, cy - Math.cos(3.25) * 110, 80, 'rgba(150,230,140,1)', .1);
  glow(ctx, cx + Math.sin(1.3) * 150, cy - Math.cos(1.3) * 150, 90, 'rgba(150,230,140,1)', .1);
  ctx.restore();
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(tick / 60 * Math.PI * 2);
  ctx.fillStyle = '#b3261e'; ctx.fillRect(-2.5, -272, 5, 330); ell(ctx, 0, 40, 9, 9); ctx.fill(); ctx.restore();
  ell(ctx, cx, cy, 14, 14); ctx.fillStyle = '#3a3e44'; ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(cx - 300, cy - 300, cx + 100, cy + 100);
  g.addColorStop(0, 'rgba(180,200,230,0)'); g.addColorStop(.45, 'rgba(180,200,230,0.09)'); g.addColorStop(.55, 'rgba(180,200,230,0)');
  ell(ctx, cx, cy, 300, 300); ctx.fillStyle = g; ctx.fill(); ctx.restore();
}

// ---------- D: the dead city at dawn, three parallax layers ----------

const D = { w: 3600, h: 1350, hz: 940 };

function envCity() {
  return env('city', () => {
    const r = rng(51), o = { candles: [], fires: [[1520, 990], [2700, 1010], [700, 1030]] };
    o.sky = mk(D.w, D.h); skyArt(o.sky.getContext('2d'), D.w, D.h, D.hz, { warm: 1, seed: 52 });
    o.far = mk(D.w, D.h); let x = o.far.getContext('2d');
    for (let px = -40; px < D.w;) {
      const bw = 70 + r() * 170, bh = 140 + r() ** 2 * 460, base = D.hz + 10;
      x.fillStyle = `rgb(${27 + r() * 5 | 0},${33 + r() * 5 | 0},${44 + r() * 6 | 0})`; x.fillRect(px, base - bh, bw, bh + 500);
      x.fillStyle = 'rgba(0,0,0,0.2)';
      for (let wy = base - bh + 14; wy < base; wy += 16) for (let wx = px + 8; wx < px + bw - 8; wx += 14) if (r() < .7) x.fillRect(wx, wy, 6, 7);
      if (r() < .3) { x.fillStyle = '#1f2530'; x.fillRect(px + bw * .5, base - bh - 60, 3, 60); }
      px += bw + r() * 40;
    }
    x.fillStyle = '#1f2630'; poly(x, [[2296, D.hz - 720], [2304, D.hz - 720], [2328, D.hz + 10], [2272, D.hz + 10]]); x.fill(); x.fillRect(2284, D.hz - 440, 32, 22);
    x.globalCompositeOperation = 'source-atop'; vgrad(x, 0, D.hz - 360, D.w, 400, [[0, 'rgba(46,56,68,0)'], [1, 'rgba(46,56,68,0.6)']]);
    o.mid = mk(D.w, D.h); x = o.mid.getContext('2d');
    for (let px = -60; px < D.w;) {
      const bw = 260 + r() * 300, bh = 200 + r() * 300, base = D.hz + 170 + r() * 40;
      x.fillStyle = `rgb(${13 + r() * 4 | 0},${16 + r() * 4 | 0},${22 + r() * 4 | 0})`; x.fillRect(px, base - bh, bw, D.h);
      for (let wy = base - bh + 22; wy < D.h; wy += 34) for (let wx = px + 16; wx < px + bw - 20; wx += 30) {
        x.fillStyle = 'rgba(0,0,0,0.4)'; x.fillRect(wx, wy, 16, 20);
        if (r() < .006) o.candles.push([wx + 8, wy + 10, r()]);
      }
      x.fillStyle = '#0c0e12';
      if (r() < .6) x.fillRect(px + bw * .2, base - bh - 40, 60, 40);
      for (let k = 0; k < 3; k++) if (r() < .5) x.fillRect(px + r() * bw, base - bh - 90, 3, 90);
      px += bw + 20 + r() * 80;
    }
    o.near = mk(D.w, D.h); x = o.near.getContext('2d');
    for (let px = -80; px < D.w;) {
      const bw = 400 + r() * 500, top = 1190 + r() * 60;
      x.fillStyle = '#060709'; x.fillRect(px, top, bw, D.h);
      for (let k = 0; k < 4; k++) if (r() < .6) {
        const ax = px + r() * bw, ah = 80 + r() * 140; x.fillRect(ax, top - ah, 4, ah);
        x.fillRect(ax - 30, top - ah + 20, 64, 3); x.fillRect(ax - 20, top - ah + 45, 44, 3);
      }
      if (r() < .5) x.fillRect(px + bw * .7, top - 70, 40, 70);
      px += bw + r() * 60;
    }
    return o;
  });
}

function smoke(ctx, t, x, y, { n = 36, hgt = 760, wind = .5, seed = 1, color = '62,60,62', a = .3 } = {}) {
  for (let i = 0; i < n; i++) {
    const ph = (t * .03 + i / n) % 1, r = 30 + ph * 240;
    const px = x + Math.pow(ph, 1.5) * hgt * wind + Math.sin(t * .4 + i * 1.7 + seed) * 18 * ph, py = y - ph * hgt;
    glow(ctx, px, py, r, `rgba(${color},1)`, a * Math.sin(Math.PI * Math.min(1, ph * 1.25)), 'source-over');
  }
}

function drawCity(ctx, t, cx, cy, z, o = {}) {
  const C = envCity(), at = k => camera(ctx, D.w / 2 + (cx - D.w / 2) * k, cy, z);
  at(.12); ctx.drawImage(C.sky, 0, 0);
  at(.4); ctx.drawImage(C.far, 0, 0);
  at(.7);
  C.fires.forEach(([fx, fy], i) => {
    smoke(ctx, t, fx, fy, { seed: i });
    glow(ctx, fx, fy, 260, 'rgba(255,110,40,1)', .3 * flicker(t, .35, 5, i));
    glow(ctx, fx, fy, 90, 'rgba(255,170,80,1)', .35 * flicker(t, .4, 7, i + 3));
  });
  ctx.drawImage(C.mid, 0, 0);
  C.fires.forEach(([fx, fy], i) => glow(ctx, fx, fy - 260, 420, 'rgba(255,120,50,1)', .07 * flicker(t, .3, 4, i)));
  C.candles.forEach(([wx, wy, s], i) => {
    if (o.outAt && i === 0 && t > o.outAt) return;
    glow(ctx, wx, wy, 26, 'rgba(255,160,70,1)', .55 * flicker(t, .3, 5, i));
  });
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 3; k++) { const fx = ((t * (14 + k * 6) + k * 900) % 4200) - 600; glow(ctx, fx, D.hz + 90 + k * 40, 700, 'rgba(70,85,105,1)', .1); }
  ctx.restore();
  at(1); ctx.drawImage(C.near, 0, 0);
}

// ---------- E: the kit on the kitchen table, seen from above ----------

const KNIFE = { x: 1320, y: 600, a: -.33 }, TORCH = { x: 1890, y: 640, a: .22 };

function knifeBlade(x) { x.beginPath(); x.moveTo(0, -30); x.lineTo(300, -26); x.quadraticCurveTo(370, -22, 410, 0); x.quadraticCurveTo(360, 26, 280, 26); x.lineTo(0, 24); x.closePath(); }

function envTable() {
  return env('table', () => {
    const c = mk(2900, 1350), x = c.getContext('2d'), r = rng(61);
    for (let i = 0; i < 5; i++) { x.fillStyle = `rgb(${33 + r() * 8 | 0},${25 + r() * 6 | 0},${18 + r() * 5 | 0})`; x.fillRect(0, i * 270, 2900, 270); }
    grime(x, noiseTex(360, 340, { seed: 62, scale: 40, sx: 10, contrast: 2.2 }), 0, 0, 2900, 1350, .55);
    grime(x, noiseTex(360, 340, { seed: 63, scale: 12, sx: 12, contrast: 1.6 }), 0, 0, 2900, 1350, .3, 'overlay');
    for (let i = 1; i < 5; i++) { x.fillStyle = '#0a0705'; x.fillRect(0, i * 270 - 3, 2900, 6); }
    const sh = on => { x.shadowColor = on ? 'rgba(0,0,0,0.75)' : 'transparent'; x.shadowBlur = on ? 34 : 0; x.shadowOffsetX = on ? 20 : 0; x.shadowOffsetY = on ? 26 : 0; };
    // backpack
    sh(1); rrect(x, 430, 240, 580, 770, [170, 170, 60, 60]); x.fillStyle = '#2b3021'; x.fill(); sh(0);
    grime(x, noiseTex(150, 190, { seed: 64, scale: 6 }), 430, 240, 580, 770, .35);
    rrect(x, 452, 256, 536, 330, [150, 150, 40, 40]); x.fillStyle = '#343a29'; x.fill();
    x.strokeStyle = 'rgba(0,0,0,0.5)'; x.lineWidth = 6; x.stroke();
    for (const sx of [560, 840]) { rrect(x, sx, 300, 42, 420, 6); x.fillStyle = '#1e2219'; x.fill(); x.fillStyle = '#6a6e70'; x.fillRect(sx - 4, 660, 50, 26); x.fillStyle = '#2a2d2e'; x.fillRect(sx + 6, 668, 30, 10); }
    rrect(x, 500, 650, 440, 320, 40); x.fillStyle = '#252a1c'; x.fill();
    x.strokeStyle = 'rgba(190,200,170,0.35)'; x.lineWidth = 3; x.setLineDash([6, 5]); x.beginPath(); x.moveTo(530, 676); x.lineTo(910, 676); x.stroke(); x.setLineDash([]);
    x.lineCap = 'round'; x.strokeStyle = '#1e2219'; x.lineWidth = 24; x.beginPath(); x.arc(720, 250, 70, Math.PI * 1.1, Math.PI * 1.9); x.stroke();
    x.lineWidth = 46; x.beginPath(); x.moveTo(440, 900); x.bezierCurveTo(330, 1000, 360, 1150, 470, 1180); x.stroke();
    x.beginPath(); x.moveTo(1000, 880); x.bezierCurveTo(1110, 990, 1080, 1150, 960, 1190); x.stroke();
    // knife
    x.save(); x.translate(KNIFE.x, KNIFE.y); x.rotate(KNIFE.a);
    sh(1); knifeBlade(x); x.fillStyle = '#6b7179'; x.fill(); rrect(x, -250, -26, 240, 52, 20); x.fillStyle = '#16120f'; x.fill(); sh(0);
    knifeBlade(x); let g = x.createLinearGradient(0, -30, 0, 26); g.addColorStop(0, '#5d636b'); g.addColorStop(.45, '#a7aeb7'); g.addColorStop(.6, '#7d848d'); g.addColorStop(1, '#4b5057'); x.fillStyle = g; x.fill();
    x.strokeStyle = 'rgba(30,32,36,0.6)'; x.lineWidth = 4; x.beginPath(); x.moveTo(20, -8); x.lineTo(290, -6); x.stroke();
    rrect(x, -14, -42, 20, 84, 4); x.fillStyle = '#3c3c3c'; x.fill();
    for (const rx of [-200, -120, -50]) { ell(x, rx, 0, 7, 7); x.fillStyle = '#6a5a40'; x.fill(); }
    x.restore();
    // torch
    x.save(); x.translate(TORCH.x, TORCH.y); x.rotate(TORCH.a);
    sh(1); rrect(x, -230, -34, 340, 68, 22); x.fillStyle = '#1c1d1f'; x.fill(); poly(x, [[100, -36], [200, -58], [214, -58], [214, 58], [200, 58], [100, 36]]); x.fill(); sh(0);
    for (let k = -200; k < -40; k += 11) { x.fillStyle = '#2b2c2f'; x.fillRect(k, -32, 4, 64); }
    poly(x, [[100, -36], [200, -58], [214, -58], [214, 58], [200, 58], [100, 36]]); x.fillStyle = '#26272a'; x.fill();
    x.fillStyle = 'rgba(255,255,255,0.12)'; x.fillRect(-220, -30, 320, 3); x.fillRect(110, -38, 90, 3);
    rrect(x, -20, -42, 38, 12, 4); x.fillStyle = '#4a1d1a'; x.fill();
    rrect(x, 206, -58, 10, 116, 3); x.fillStyle = '#3e4044'; x.fill();
    x.restore();
    // batteries, matches, a candle stub
    for (const [bx, by, ba] of [[1640, 960, .4], [1720, 1010, .3]]) {
      x.save(); x.translate(bx, by); x.rotate(ba); sh(1); rrect(x, -60, -18, 120, 36, 10); x.fillStyle = '#23324a'; x.fill(); sh(0);
      x.fillStyle = '#b9b6ac'; x.fillRect(40, -18, 20, 36); x.fillStyle = '#c8c2a0'; x.fillRect(60, -6, 6, 12); x.restore();
    }
    x.save(); x.translate(1150, 1040); x.rotate(-.1); sh(1); x.fillStyle = '#5a2418'; x.fillRect(-80, -50, 160, 100); sh(0);
    x.fillStyle = '#c2a888'; x.fillRect(-60, -30, 120, 60); x.fillStyle = '#5a2418'; x.font = '600 18px Inter'; x.textAlign = 'center'; x.fillText('СПИЧКИ', 0, 7); x.restore();
    sh(1); ell(x, 2180, 330, 48, 48); x.fillStyle = '#cdc3a7'; x.fill(); sh(0); ell(x, 2180, 330, 4, 4); x.fillStyle = '#111'; x.fill();
    // cold light from the window, top left
    const lg = x.createRadialGradient(300, 0, 100, 300, 0, 2400); lg.addColorStop(0, 'rgba(150,170,210,0.16)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
    x.globalCompositeOperation = 'lighter'; x.fillStyle = lg; x.fillRect(0, 0, 2900, 1350);
    x.globalCompositeOperation = 'multiply'; const dg = x.createRadialGradient(1300, 600, 400, 1300, 700, 1900); dg.addColorStop(0, '#fff'); dg.addColorStop(1, '#333'); x.fillStyle = dg; x.fillRect(0, 0, 2900, 1350);
    return c;
  });
}

function drawTable(ctx, t, o) {
  ctx.drawImage(envTable(), 0, 0);
  if (o.glint > 0 && o.glint < 1) {
    ctx.save(); ctx.translate(KNIFE.x, KNIFE.y); ctx.rotate(KNIFE.a); knifeBlade(ctx); ctx.clip();
    const gx = -60 + o.glint * 520, g = ctx.createLinearGradient(gx - 70, 0, gx + 70, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,0.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(-20, -40, 460, 80); ctx.restore();
    const tip = [KNIFE.x + Math.cos(KNIFE.a) * gx, KNIFE.y + Math.sin(KNIFE.a) * gx];
    glow(ctx, tip[0], tip[1], 60, 'rgba(255,255,255,1)', .35 * Math.sin(Math.PI * o.glint));
  }
  if (o.torch) {
    const k = clamp(o.torch), f = flicker(t, .05, 9, 2) * k, a = TORCH.a, lx = TORCH.x + Math.cos(a) * 216, ly = TORCH.y + Math.sin(a) * 216;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const ex = lx + Math.cos(a) * 900, ey = ly + Math.sin(a) * 900;
    beam(ctx, [lx, ly], [ex, ey], 330, .12 * f);
    glow(ctx, lx + Math.cos(a) * 520, ly + Math.sin(a) * 520, 380, 'rgba(255,236,205,1)', .22 * f);
    glow(ctx, lx, ly, 70, 'rgba(255,245,225,1)', .9 * f);
    ctx.restore();
  }
}

// ---------- F: macro of the floor tile, blood and the fingertip ----------

function envMacro() {
  return env('macro', () => {
    const c = mk(W, H), x = c.getContext('2d'), r = rng(81);
    x.fillStyle = '#2a211b'; x.fillRect(0, 0, W, H);
    for (const [col, i, j] of [['#2f251e', 0, 0], ['#3a342c', 1, 0], ['#3a342c', 0, 1], ['#2f251e', 1, 1]]) { x.fillStyle = col; x.fillRect(i * 1010 - 50, j * 620 - 200, 1010, 680); }
    grime(x, noiseTex(480, 270, { seed: 82, scale: 40, contrast: 1.4 }), 0, 0, W, H, .5);
    grime(x, noiseTex(480, 270, { seed: 83, scale: 5, contrast: 1.3 }), 0, 0, W, H, .18, 'overlay');
    x.fillStyle = '#0d0a09'; x.fillRect(953, 0, 18, H); x.fillRect(0, 413, W, 18);
    const blob = (cx, cy, R, seed, fill) => {
      x.beginPath();
      for (let k = 0; k <= 96; k++) {
        const a = k / 96 * Math.PI * 2, kk = k % 96, rr = R * (.84 + .24 * noise1(kk * .13 + seed) + .07 * noise1(kk * .45 + seed * 2));
        const px = cx + Math.cos(a) * rr * 1.25, py = cy + Math.sin(a) * rr * .85; k ? x.lineTo(px, py) : x.moveTo(px, py);
      }
      x.closePath(); x.fillStyle = fill; x.fill();
    };
    blob(820, 700, 250, 5, '#1c0103');
    const g = x.createRadialGradient(760, 650, 20, 820, 700, 320); g.addColorStop(0, '#5c070b'); g.addColorStop(1, '#2c0204');
    blob(820, 700, 232, 5.2, g);
    for (let i = 0; i < 34; i++) { const a = r() * 6.28, d = 330 + r() * 280, s = 3 + r() * 13; ell(x, 820 + Math.cos(a) * d * 1.2, 700 + Math.sin(a) * d * .8, s, s * .7); x.fillStyle = r() < .5 ? '#2c0204' : '#420507'; x.fill(); }
    x.globalCompositeOperation = 'lighter';
    x.strokeStyle = 'rgba(255,210,210,0.16)'; x.lineWidth = 4; x.lineCap = 'round';
    x.beginPath(); x.arc(780, 660, 175, Math.PI * 1.12, Math.PI * 1.42); x.stroke();
    glow(x, 705, 565, 34, 'rgba(255,220,220,1)', .22);
    x.globalCompositeOperation = 'source-over';
    const vg = x.createRadialGradient(860, 600, 250, 860, 600, 1150); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.75)');
    x.fillStyle = vg; x.fillRect(0, 0, W, H);
    const lg = x.createRadialGradient(200, 0, 50, 200, 0, 1500); lg.addColorStop(0, 'rgba(120,140,180,0.10)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
    x.globalCompositeOperation = 'lighter'; x.fillStyle = lg; x.fillRect(0, 0, W, H);
    return c;
  });
}

// ---------- G: the block of flats at dawn: 20 windows, 7 still lived in ----------

const G = { w: 2400, h: 1350, ground: 1180 };
const LIVE = [1, 6, 8, 11, 14, 17, 19];

function tree(x, px, py, len, ang, wdt, depth, r) {
  const ex = px + Math.sin(ang) * len, ey = py - Math.cos(ang) * len;
  x.lineWidth = wdt; x.beginPath(); x.moveTo(px, py); x.lineTo(ex, ey); x.stroke();
  if (depth <= 0) return;
  const n = 2 + (r() < .4 ? 1 : 0);
  for (let i = 0; i < n; i++) tree(x, ex, ey, len * (.62 + r() * .2), ang + (r() - .5) * 1.3, wdt * .66, depth - 1, r);
}

function envBuilding() {
  return env('building', () => {
    const c = mk(G.w, G.h), x = c.getContext('2d'), r = rng(71), wins = [];
    skyArt(x, G.w, G.h, 1010, { warm: .7, seed: 72 });
    x.fillStyle = '#12161c'; x.fillRect(0, 520, 420, 700); x.fillRect(1990, 460, 410, 760);
    x.fillStyle = 'rgba(0,0,0,0.35)';
    for (let wy = 545; wy < 1180; wy += 60) for (let wx = 20; wx < 400; wx += 70) x.fillRect(wx, wy, 34, 30);
    for (let wy = 485; wy < 1180; wy += 60) for (let wx = 2010; wx < 2390; wx += 70) x.fillRect(wx, wy, 34, 30);
    vgrad(x, 520, 300, 1360, 880, [[0, '#2c3036'], [1, '#1e2125']]);
    grime(x, noiseTex(340, 220, { seed: 73, scale: 30, contrast: 2 }), 520, 300, 1360, 880, .6);
    x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 3;
    for (let k = 0; k <= 8; k++) { x.beginPath(); x.moveTo(520 + k * 170, 300); x.lineTo(520 + k * 170, G.ground); x.stroke(); }
    for (let k = 0; k <= 5; k++) { x.beginPath(); x.moveTo(520, 300 + k * 176); x.lineTo(1880, 300 + k * 176); x.stroke(); }
    x.fillStyle = '#191c20'; x.fillRect(505, 282, 1390, 22); x.fillRect(1500, 220, 150, 62);
    x.fillStyle = '#0f1114'; for (const ax of [700, 1120, 1720]) { x.fillRect(ax, 150, 4, 132); x.fillRect(ax - 40, 180, 84, 4); }
    const cols = [700, 1020, 1380, 1700];
    for (let f = 0; f < 5; f++) for (let k = 0; k < 4; k++) {
      const wx = cols[k] - 80, wy = 300 + f * 176 + 34, ww = 160, wh = 104;
      x.fillStyle = '#4a4e52'; x.fillRect(wx - 7, wy - 7, ww + 14, wh + 14);
      const g = x.createLinearGradient(wx, wy, wx + ww, wy + wh); g.addColorStop(0, '#1a222c'); g.addColorStop(1, '#07090c');
      x.fillStyle = g; x.fillRect(wx, wy, ww, wh); x.fillStyle = '#3a3e42'; x.fillRect(wx + ww / 2 - 3, wy, 6, wh); x.fillRect(wx, wy + 34, ww, 5);
      if (r() < .3) { x.fillStyle = 'rgba(120,110,95,0.25)'; x.fillRect(wx + 6, wy + 6, 40, wh - 12); }
      if (r() < .2) { x.strokeStyle = 'rgba(200,210,220,0.25)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(wx + 100, wy + 40); x.lineTo(wx + 130, wy + 60); x.lineTo(wx + 120, wy + 95); x.stroke(); }
      wins.push([wx, wy, ww, wh]);
      if ((k === 1 || k === 2) && f > 0) {
        x.fillStyle = '#25282c'; x.fillRect(wx - 30, wy + wh + 26, ww + 60, 14);
        x.fillStyle = '#16181b'; for (let b = 0; b <= 11; b++) x.fillRect(wx - 30 + b * 20, wy + wh - 20, 3, 46); x.fillRect(wx - 30, wy + wh - 22, ww + 60, 4);
      }
    }
    x.fillStyle = '#1b1e22'; x.fillRect(1120, 1062, 160, 16); x.fillStyle = '#08090b'; x.fillRect(1150, 1078, 100, 102);
    vgrad(x, 0, G.ground, G.w, G.h - G.ground, [[0, '#0d0f12'], [1, '#060708']]);
    for (const [px, py, pw] of [[900, 1250, 260], [1500, 1300, 340], [300, 1230, 180]]) {
      const g = x.createLinearGradient(0, py - 10, 0, py + 10); g.addColorStop(0, 'rgba(70,85,105,0)'); g.addColorStop(.5, 'rgba(70,85,105,0.5)'); g.addColorStop(1, 'rgba(70,85,105,0)');
      x.fillStyle = g; ell(x, px, py, pw, 12); x.fill();
    }
    x.fillStyle = '#050607';
    x.beginPath(); x.moveTo(1760, 1250); x.lineTo(1790, 1190); x.quadraticCurveTo(1850, 1150, 1950, 1150); x.lineTo(2040, 1150); x.quadraticCurveTo(2090, 1160, 2110, 1195); x.lineTo(2150, 1205); x.lineTo(2160, 1250); x.closePath(); x.fill();
    ell(x, 1830, 1252, 28, 28); x.fill(); ell(x, 2080, 1252, 28, 28); x.fill();
    x.strokeStyle = '#040506'; x.lineCap = 'round';
    tree(x, 260, 1240, 330, .05, 26, 6, rng(74)); tree(x, 2240, 1230, 360, -.08, 28, 6, rng(75)); tree(x, 1960, 1260, 220, .1, 16, 5, rng(76));
    c.wins = wins;
    return c;
  });
}

function drawBuilding(ctx, t, lit) {
  const c = envBuilding();
  ctx.drawImage(c, 0, 0);
  c.wins.forEach(([wx, wy, ww, wh], i) => {
    const k = lit(i); if (k <= .01) return;
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    glow(ctx, wx + ww * (.3 + .4 * hash1(i)), wy + wh * .7, ww * .9, 'rgba(255,150,60,1)', .5 * k * flicker(t, .25, 4, i));
    ctx.restore();
    glow(ctx, wx + ww / 2, wy + wh / 2, ww, 'rgba(255,140,60,1)', .06 * k);
  });
}

// ---------- shots ----------

const KN1 = [[3.15, 1], [4.35, 1], [5.52, 1], [6.62, .8], [7.25, .8]];
const KN2 = [[32.15, 1.7]];
const SLAM = [[50.52, 2.4]];

SHOTS.push(
  // Я убил его вчера. Сегодня утром он постучал в мою дверь. Три раза. Медленно.
  { t0: 0, t1: 5.58, fadeIn: 1.4, draw(ctx, t, d, g) {
    const [cx, cy, z] = camPath(t, [[0, 1200, 660, .86], [d, 1200, 640, 1.02]]), [sx, sy] = shake(g, KN1, 5);
    camera(ctx, cx + sx, cy + sy, z);
    drawHall(ctx, g, { light: 1 + .6 * pulse(g, KN1) });
    knockDust(ctx, g, KN1);
  } },
  // Я не двигался. Снаружи снова раздался стук.
  { t0: 5.58, t1: 8.85, draw(ctx, t, d, g) {
    const [sx, sy] = shake(g, KN1, 4), br = Math.sin(g * 2.1);
    camera(ctx, 1130 + t * 8 + sx, 700 + sy, .9);
    drawHall(ctx, g, { light: 1 + .6 * pulse(g, KN1) });
    knockDust(ctx, g, KN1);
    sil(ctx, '#030303', x => figure(x, 640, 1600, 1240, { breathe: br, armL: [-.07, .05], armR: [.07, -.05] }, { bulk: 1.12 }), ['rgba(100,120,165,0.3)', 22]);
  } },
  // Я узнал этот звук. Так стучал мой сосед. До того, как он заразился.
  { t0: 8.85, t1: 13.55, draw(ctx, t, d, g) {
    const sick = sstep(11.95, 12.8, g), [cx, cy, z] = camPath(t, [[0, 650, 720, 1.22], [d, 620, 700, 1.36]]);
    camera(ctx, cx, cy, z);
    ctx.drawImage(envLanding(), 0, 0);
    const kn = pulse(g, [[10.0], [10.55], [11.1]], 12) * (1 - sick), tw = sick * (noise1(g * 9) - .5) * 10;
    ctx.fillStyle = '#050505';
    figure(ctx, 520 + tw, 1190, 800, {
      lean: .2 * sick, head: [.03 * sick, .07 * sick], breathe: Math.sin(g * 3),
      armR: [lerp(.95 + kn * .12, .3, sick), lerp(1.95, .15, sick)], armL: [lerp(-.12, -.35, sick), .15 * sick],
    }, { bulk: 1.1 });
    // memory: faded and warm, then cold and red once he is sick
    tint(ctx, '#808080', .85 * (1 - sick), 'saturation');
    tint(ctx, '#d9b58c', .55 * (1 - sick), 'multiply');
    tint(ctx, '#3a2c1c', .5 * (1 - sick), 'screen');
    tint(ctx, '#5a6e94', .55 * sick, 'multiply');
    tint(ctx, '#3a0405', .35 * sick, 'screen');
    tint(ctx, '#ffffff', .5 * (1 - t / .35), 'screen');
  } },
  // Я подошёл к двери. Но не открыл её.
  { t0: 13.55, t1: 16.45, draw(ctx, t, d, g) {
    camera(ctx, 1345 + t * 5, 690, 2.35);
    drawHall(ctx, g, { light: .9 });
    glow(ctx, 1330, 640, 380, 'rgba(110,130,170,1)', .06);
    const reach = outc((g - 13.65) / 1.1) - .3 * sstep(15.25, 16.2, g), hx = lerp(1760, 1478, reach), hy = lerp(770, 712, reach);
    ctx.fillStyle = 'rgba(130,150,195,0.3)'; hand(ctx, hx - 2, hy - 3, 150, Math.PI + .08, { curl: .35 });
    ctx.fillStyle = '#050505'; hand(ctx, hx, hy, 150, Math.PI + .08, { curl: .35 });
  } },
  // За дверью послышалось хриплое дыхание. Потом тишина.
  { t0: 16.45, t1: 19.95, draw(ctx, t, d, g) {
    camera(ctx, 1200, 1088 - t * 3, 2.1 + t * .03);
    const br = g < 18.75 ? Math.sin((g - 16.45) * 4.2) * 4 : 0;
    drawHall(ctx, g, { light: 1, feet: [1150 + br, 1262 + br * .6], peepDark: true });
  } },
  // Я посмотрел на часы. Шесть двенадцать.
  { t0: 19.95, t1: 23.1, draw(ctx, t, d, g) {
    camera(ctx, 960, 540, 1.02 + t * .025, -.05 + t * .006);
    drawWatch(ctx, g, 34 + t);
  } },
  // В городе уже четвертый день не было электричества. И почти никого не осталось.
  { t0: 23.1, t1: 28.05, draw(ctx, t, d, g) { drawCity(ctx, g, lerp(1250, 2050, inout(t / d)), 760, 1.0, { outAt: 26.9 }); } },
  // Я взял рюкзак. Проверил нож. Проверил фонарик.
  { t0: 28.05, t1: 32.12, draw(ctx, t, d, g) {
    const [cx, cy, z] = camPath(g, [[28.05, 700, 650, 1.12], [28.9, 730, 650, 1.14], [29.5, 1320, 610, 1.32], [30.55, 1340, 610, 1.34], [31.0, 1880, 660, 1.2], [32.12, 1910, 665, 1.26]]);
    camera(ctx, cx, cy, z);
    drawTable(ctx, g, { glint: (g - 29.6) / .8, torch: (g - 31.1) / .06 });
  } },
  // Потом снова услышал стук. На этот раз всего один раз.
  { t0: 32.12, t1: 36.4, draw(ctx, t, d, g) {
    const [sx, sy] = shake(g, KN2, 9), jx = (noise1(g * 1.3) - .5) * 30, jy = (noise1(g * 1.1 + 5) - .5) * 24;
    camera(ctx, 1200 + sx, 650 + sy, 1.0 + t * .02);
    drawHall(ctx, g, { light: 1 + pulse(g, KN2), spot: { x: 230 + jx, y: 560 + jy, r: 270, a: .85 } });
    beam(ctx, [2150, 1550], [A.x0 + 230 + jx, A.y0 + 560 + jy], 270, .05);
    knockDust(ctx, g, KN2);
  } },
  // Я посмотрел в глазок. Коридор был пуст.
  { t0: 36.4, t1: 39.48, draw(ctx, t, d, g) { drawPeephole(ctx, g, t); } },
  // Я открыл дверь.
  { t0: 39.48, t1: 40.85, draw(ctx, t, d, g) {
    const open = outc((g - 39.62) / .95);
    camera(ctx, 1200, 660, .95 + t * .04);
    drawHall(ctx, g, { open, light: 1 + 2 * open });
  } },
  // На полу лежала кровь. Свежая. Она тянулась по коридору к лестнице.
  { t0: 40.85, t1: 45.7, draw(ctx, t, d, g) {
    const [cx, cy, z] = camPath(t, [[0, 620, 1030, 1.7], [d, 1560, 1030, 1.62]]);
    camera(ctx, cx, cy, z);
    ctx.drawImage(envLanding(), 0, 0); ctx.drawImage(envTrail(), 0, 0); twinkle(ctx, g);
  } },
  // Я присел и коснулся её пальцем. Она была ещё тёплой.
  { t0: 45.7, t1: 50.02, draw(ctx, t, d, g) {
    camera(ctx, 900, 580, 1.05 + t * .02);
    ctx.drawImage(envMacro(), 0, 0);
    const touch = 46.85, down = outc((g - 45.8) / 1.05) - inout((g - 48.55) / 1.1) * .8;
    const tip = [lerp(1300, 760, down), lerp(-120, 600, down)], rot = 2.32, s = 560;
    if (g > touch) {
      const k = (g - touch) / 1.6;
      if (k < 1) { ctx.strokeStyle = `rgba(255,190,190,${.16 * (1 - k)})`; ctx.lineWidth = 2; ell(ctx, 760, 604, 30 + k * 120, (30 + k * 120) * .62); ctx.stroke(); }
    }
    const [tx, ty] = handTip(0, 0, s, rot), hx = tip[0] - tx, hy = tip[1] - ty;
    sil(ctx, '#0b0909', x => hand(x, hx, hy, s, rot, { point: true, curl: .95 }), ['rgba(120,140,180,0.35)', 14]);
    if (g > touch) { ell(ctx, tip[0] + 6, tip[1] - 8, 24, 30, rot); ctx.fillStyle = `rgba(110,8,12,${clamp((g - touch) * 4)})`; ctx.fill(); }
  } },
  // Я сразу закрыл дверь.
  { t0: 50.02, t1: 51.72, draw(ctx, t, d, g) {
    const open = 1 - inc((g - 50.15) / .37), [sx, sy] = shake(g, SLAM, 14);
    camera(ctx, 1200 + sx, 660 + sy, 1.0);
    drawHall(ctx, g, { open: clamp(open), light: 1 + 2 * clamp(open) + pulse(g, SLAM) });
    knockDust(ctx, g, SLAM);
  } },
  // В нашем доме оставалось семь квартир. Три дня назад их было двадцать. Я не знал, кто ещё жив. И не хотел это проверять.
  { t0: 51.72, t1: 59.54, fadeOut: .5, draw(ctx, t, d, g) {
    camera(ctx, 1200, 720, lerp(1.08, .9, inout(t / d)));
    const all = sstep(54.25, 54.7, g), order = [0, 2, 3, 4, 5, 7, 9, 10, 12, 13, 15, 16, 18];
    drawBuilding(ctx, g, i => LIVE.includes(i) ? 1 - .5 * sstep(57.6, 59.4, g) : all * (1 - sstep(55.75 + order.indexOf(i) * .07, 55.95 + order.indexOf(i) * .07, g)));
    tint(ctx, '#d9b58c', .25 * all * (1 - sstep(55.7, 56.6, g)), 'multiply');
  } },
);

// The landing through the door viewer: fish-eye, built once.
function drawPeephole(ctx, g, t) {
  const img = env('peep', () => {
    const S = 1000, src = mk(S, S), sx = src.getContext('2d');
    sx.drawImage(envLanding(), 1000, 110, 1240, 1240, 0, 0, S, S);
    const sd = sx.getImageData(0, 0, S, S).data, out = mk(S, S), ox = out.getContext('2d'), od = ox.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const u = (x - S / 2) / (S / 2), v = (y - S / 2) / (S / 2), r = Math.hypot(u, v);
      if (r > 1) continue;
      const rs = Math.tan(r * 1.1) / Math.tan(1.1), k = r > 0 ? rs / r : 0;
      const px = Math.min(S - 1, Math.max(0, Math.round(S / 2 + u * k * S / 2))), py = Math.min(S - 1, Math.max(0, Math.round(S / 2 + v * k * S / 2)));
      const i = (y * S + x) * 4, j = (py * S + px) * 4;
      od.data[i] = sd[j]; od.data[i + 1] = sd[j + 1]; od.data[i + 2] = sd[j + 2]; od.data[i + 3] = 255;
    }
    ox.putImageData(od, 0, 0);
    return out;
  });
  const R = 470 + t * 8, cx = W / 2 + (noise1(g * .7) - .5) * 14, cy = H / 2 + (noise1(g * .6 + 4) - .5) * 10;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.save(); ell(ctx, cx, cy, R, R); ctx.clip();
  ctx.drawImage(img, cx - R, cy - R, R * 2, R * 2);
  const vg = ctx.createRadialGradient(cx, cy, R * .55, cx, cy, R); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.92)');
  ctx.fillStyle = vg; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
  ctx.restore();
  ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(120,40,40,0.25)'; ell(ctx, cx + 2, cy, R - 4, R - 4); ctx.stroke();
  ctx.strokeStyle = 'rgba(40,80,140,0.25)'; ell(ctx, cx - 2, cy, R - 6, R - 6); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(200,215,240,0.12)'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.arc(cx, cy, R * .82, Math.PI * 1.12, Math.PI * 1.38); ctx.stroke(); ctx.restore();
}
