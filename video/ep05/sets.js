// Episode 5 "Nikita" (tracksuit look): the sets. The burning city, the block of flats in section, the kitchen and the
// view from its window, the street below, the radio and the emergency card, the outbreak map, the hallway with the
// front door and the barricade, the door in section, the windows, water and food, the light switch, the house at
// night. Loaded after engine/tracksuit_sets.js; the shots are in scene*.js.
'use strict';

// ---------- people ----------

// Passers-by in plain clothes (no stripes), the zombie walk, glowing eyes.
const FOLK = [
  { skin: '#e8b98f', skinD: '#cf9d74', hair: '#2b1a10', suit: '#a8463c', suitD: '#8a3830', stripe: null, shoe: '#2a2a2e', mouth: '#5a1e1e' },
  { skin: '#f1c6a0', skinD: '#d9a27c', hair: '#c79a4a', suit: '#3f7a5a', suitD: '#326349', stripe: null, shoe: '#2a2a2e', mouth: '#5a1e1e' },
  { skin: '#c99772', skinD: '#ad7d5b', hair: '#1a1210', suit: '#d4a23a', suitD: '#b3862c', stripe: null, shoe: '#2a2a2e', mouth: '#5a1e1e' },
  { skin: '#f0cfae', skinD: '#d6b08e', hair: '#5a3a22', suit: '#6d6a8a', suitD: '#58557a', stripe: null, shoe: '#2a2a2e', mouth: '#5a1e1e' },
];
function zedWalk(t, seed = 0, face = 1, amt = .5) {
  const sw = Math.sin(t * 3 + seed) * .08;
  return stride(t * 4.2 + seed, face, amt, { face, eyes: 'zed', lean: .1 * face, seed, armL: [face * (1.4 + sw), -face * .1], armR: [face * (1.3 - sw), -face * .05], head: [.01 * face, .015] });
}
// Red eyes over a figure drawn by guy() (g is what it returned), looking to face.
function redEyes(ctx, g, face, k = 1) {
  if (k <= 0) return;
  const [hx, hy] = g.head, r = g.R, xs = face ? [hx + face * .34 * r, hx + face * .72 * r] : [hx - .34 * r, hx + .34 * r];
  for (const x of xs) { ctx.fillStyle = `rgba(255,70,50,${clamp(k)})`; ell(ctx, x, hy + .06 * r, .11 * r, .11 * r); ctx.fill(); glow(ctx, x, hy + .06 * r, r * .7, 'rgba(255,40,30,1)', .6 * clamp(k)); }
}

// ---------- fire and smoke ----------

function flame(ctx, t, x, y, s = 1, seed = 0) {
  glow(ctx, x, y - 50 * s, 190 * s, 'rgba(255,120,40,1)', .4);
  for (const [col, k] of [['#e8562a', 1], ['#ff9a2e', .72], ['#ffd860', .42]]) {
    ctx.fillStyle = col;
    for (let i = 0; i < 3; i++) {
      const ph = t * (7 + i) + seed * 3.1 + i * 2, fx = x + (i - 1) * 26 * s * k, wd = 34 * s * k;
      const hgt = (110 + 40 * Math.sin(ph) + 30 * noise1(ph)) * s * k * (i === 1 ? 1.25 : .9);
      ctx.beginPath(); ctx.moveTo(fx - wd, y); ctx.quadraticCurveTo(fx - wd * 1.1, y - hgt * .5, fx + Math.sin(ph * 1.3) * 10 * s, y - hgt);
      ctx.quadraticCurveTo(fx + wd * 1.1, y - hgt * .5, fx + wd, y); ctx.closePath(); ctx.fill();
    }
  }
}
function smokeCol(ctx, t, x, y, s = 1, seed = 0, col = '44,38,42', a = .55) {
  for (let k = 0; k < 12; k++) {
    const u = (t * .09 + k / 12 + seed * .37) % 1, r = (50 + u * 190) * s;
    ctx.fillStyle = `rgba(${col},${a * Math.min(1, u * 6) * (1 - u)})`;
    ell(ctx, x + (Math.sin(u * 5 + seed) * 50 + u * 160) * s, y - u * 1100 * s, r, r * .9); ctx.fill();
  }
}

// ---------- the burning city (the opening) ----------

// A dusk skyline on fire: smoke columns, burning windows, zombie silhouettes in the street. o: flash (0..1), crowd.
function cityFire(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#26142a'], [.32, '#5f2333'], [.56, '#b9482e'], [.66, '#e7853a'], [.72, '#3a1f24'], [1, '#1d1216']]);
  glow(ctx, 540, 1260, 760, 'rgba(255,140,60,1)', .32 + .2 * (o.flash || 0));
  for (const [x, s, sd] of [[140, 1.2, 1], [470, 1.5, 2], [820, 1.3, 3], [1000, .9, 4]]) smokeCol(ctx, t, x, 1240, s, sd, '38,26,32', .6);
  // far skyline, then the near one with windows; some windows burn
  const far = rng(11); ctx.fillStyle = '#4a2430';
  for (let x = -20; x < W;) { const w = 70 + far() * 90, h = 260 + far() * 380; ctx.fillRect(x, 1300 - h, w, h + 20); x += w + 8; }
  const near = rng(23), fires = [];
  for (let x = -40, i = 0; x < W; i++) {
    const w = 130 + near() * 120, h = 330 + near() * 420, top = 1330 - h;
    ctx.fillStyle = '#26161d'; ctx.fillRect(x, top, w, h + 30);
    if (near() < .5) { ctx.fillRect(x + w * .4, top - 60, 8, 60); }
    for (let wy = top + 40; wy < 1290; wy += 62) for (let wx = x + 22; wx < x + w - 30; wx += 46) {
      const v = near();
      if (v < .16) { ctx.fillStyle = '#ffb04a'; ctx.fillRect(wx, wy, 26, 34); if (v < .035) fires.push([wx + 13, wy + 34]); }
      else if (v < .3) { ctx.fillStyle = '#5b2e2a'; ctx.fillRect(wx, wy, 26, 34); }
    }
    x += w + 14;
  }
  fires.forEach(([fx, fy], i) => flame(ctx, t, fx, fy, .42, i));
  // the street: dark, embers, fires on the ground, zombies walking about
  ctx.fillStyle = '#20141a'; ctx.fillRect(0, 1330, W, H - 1330);
  ctx.fillStyle = 'rgba(255,150,70,0.08)'; ctx.fillRect(0, 1330, W, 60);
  [[90, 1400, .9, 1], [980, 1420, 1.1, 2], [700, 1360, .6, 3]].forEach(([fx, fy, s, sd]) => flame(ctx, t, fx, fy, s, sd));
  if (o.crowd !== 0) [[160, 1450, 1, .9], [300, 1420, -1, .8], [790, 1440, -1, .95], [920, 1480, -1, 1.05], [620, 1405, 1, .7]].forEach(([zx, zy, f, sc], i) => {
    const g = guy(ctx, zx + Math.sin(t * .6 + i) * 30 * f, zy, 330 * sc, zedWalk(t, i * 1.7, f, .45), ZED);
    redEyes(ctx, g, f, .9);
  });
  tint(ctx, '#ff7a3a', .1 + .25 * (o.flash || 0), 'screen');
  // embers floating up
  const er = rng(5);
  for (let i = 0; i < 40; i++) { const u = (t * (.1 + er() * .1) + er()) % 1, ex = er() * W + Math.sin(t + i) * 30, ey = 1600 - u * 1500; ctx.fillStyle = `rgba(255,${160 + er() * 80 | 0},80,${(1 - u) * .9})`; ell(ctx, ex, ey, 4, 4); ctx.fill(); }
}

// ---------- the view out of a window ----------

// Clipped to the window glass by the caller. o: chaos (smoke and fire, 0..1), night (0..1), siren (0..1), seed.
function outside(ctx, t, x, y, w, h, o = {}) {
  const ch = o.chaos || 0, nt = o.night || 0, sd = o.seed || 0;
  vgrad(ctx, x, y, w, h, nt > .5 ? [[0, '#121a2e'], [1, '#4a2a30']] : ch > .5 ? [[0, '#8f8f94'], [1, '#d9a27c']] : [[0, '#9fbad0'], [1, '#e2e8ea']]);
  if (nt > .5 && ch > 0) glow(ctx, x + w * .5, y + h, w * .9, 'rgba(255,120,50,1)', .4 * ch);
  // the houses across the street: their roofs, rows of windows, a few lit at night
  const r = rng(7 + sd), sx = w / 480;
  for (let i = 0; i < 4; i++) {
    const bx = x + (i * .27 - .05 + r() * .06) * w, bw = (.2 + r() * .1) * w, bt = y + h * (.22 + r() * .25);
    ctx.fillStyle = nt > .5 ? '#232838' : ch > .5 ? '#7d7a7c' : '#8c97a2'; ctx.fillRect(bx, bt, bw, y + h - bt);
    for (let wy = bt + 20 * sx; wy < y + h; wy += 34 * sx) for (let wx = bx + 12 * sx; wx < bx + bw - 14 * sx; wx += 28 * sx) {
      const v = r(); ctx.fillStyle = nt > .5 ? (v < .12 ? '#f2c46a' : '#2d3346') : '#a9b4bd'; ctx.fillRect(wx, wy, 14 * sx, 18 * sx);
    }
  }
  if (ch > 0) {
    ctx.save(); ctx.globalAlpha = clamp(ch);
    for (let i = 0; i < 3; i++) smokeCol(ctx, t, x + w * (.15 + i * .35), y + h + 20, .5 * sx, sd + i, nt > .5 ? '20,18,24' : '60,58,62', .6);
    if (ch > .5) for (let i = 0; i < 2; i++) flame(ctx, t, x + w * (.3 + i * .45), y + h + 8, .6 * sx, sd + i);
    ctx.restore();
  }
  if (o.siren > 0) { const red = Math.sin(t * 14) > 0; ctx.fillStyle = red ? `rgba(255,40,40,${.35 * o.siren})` : `rgba(40,90,255,${.35 * o.siren})`; ctx.fillRect(x, y, w, h); }
}

// ---------- the block of flats in section ----------

// Nine floors: flats on the left (x 0..760), the stairs on the right (shared stairs()). o: camY (world y at the middle
// of the screen), chaos, night (0..1), flat(ctx, n, ceilingY) draws into floor n, over(ctx, Y) draws on top,
// door (0..1, the street door on floor 1 opens), glow7 (a green outline round Nikita's flat), all (draw every floor,
// for a zoomed-out view; the sky, the ground and the houses next door reach well past the frame).
function block(ctx, t, o = {}) {
  const Y = wy => H / 2 + wy - o.camY, nt = o.night || 0, X0 = -1600, XW = W + 3200;
  const g0 = Y(floorY(1)) + 32, top = Y(floorY(10)) - 2000;
  vgrad(ctx, X0, top, XW, g0 - top, nt > .5 ? [[0, '#0e1426'], [1, '#3a2433']] : [[0, '#8fa8bb'], [1, '#d9dfe2']]);
  // the houses next door, darker and further away
  ctx.fillStyle = nt > .5 ? '#1c2232' : '#a9b2b9';
  for (const [x, w, h] of [[-1500, 700, 2600], [-760, 640, 3300], [1180, 600, 3000], [1840, 760, 2400]]) {
    ctx.fillRect(x, g0 - h, w, h);
    const r = rng(x); ctx.fillStyle = nt > .5 ? '#2c3346' : '#c3cad0';
    for (let wy = g0 - h + 60; wy < g0 - 80; wy += 120) for (let wx = x + 50; wx < x + w - 60; wx += 110) { if (nt > .5 && r() < .1) { ctx.fillStyle = '#f2c46a'; ctx.fillRect(wx, wy, 50, 64); ctx.fillStyle = '#2c3346'; } else ctx.fillRect(wx, wy, 50, 64); }
    ctx.fillStyle = nt > .5 ? '#1c2232' : '#a9b2b9';
  }
  ctx.fillStyle = '#6b4a30'; ctx.fillRect(X0, g0, XW, 3000); const r = rng(5); ctx.fillStyle = 'rgba(0,0,0,0.14)'; for (let i = 0; i < 160; i++) { ell(ctx, X0 + r() * XW, g0 + 20 + r() * 1400, 4 + r() * 10, 3 + r() * 6); ctx.fill(); }
  ctx.fillStyle = '#55524c'; ctx.fillRect(X0, g0 - 12, XW, 20);
  ctx.fillStyle = '#5f5a52'; ctx.fillRect(-26, Y(floorY(10)) - 40, 26, g0 - Y(floorY(10)) + 40); ctx.fillRect(W, Y(floorY(10)) - 40, 26, g0 - Y(floorY(10)) + 40);
  for (let n = 1; n <= 9; n++) {
    const f = Y(floorY(n)), c = f - FH;
    if (!o.all && (f < -60 || c > H + 60)) continue;
    if (n === 1) hall1(ctx, t, c, o); else flatRoom(ctx, t, n, c, o);
    if (o.flat) o.flat(ctx, n, c);
    stairs(ctx, t, c, n);
    ctx.fillStyle = '#7d786f'; ctx.fillRect(0, f - 8, W, 40); ctx.fillStyle = '#9a958b'; ctx.fillRect(0, f - 8, W, 6);
    ctx.fillStyle = '#7d786f'; ctx.fillRect(750, c, 18, FH - 290);  // the wall between the flat and the stairs, over the door
    ctx.fillStyle = 'rgba(230,235,240,0.3)'; ctx.font = `900 76px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), 1010, c + 80);
  }
  const rf = Y(floorY(10));
  if (o.all || (rf > -80 && rf < H)) { ctx.fillStyle = '#6f6a60'; ctx.fillRect(-26, rf - 40, W + 52, 48); ctx.fillRect(-26, rf - 90, 30, 50); ctx.fillRect(W - 4, rf - 90, 30, 50); }
  if (o.glow7 > 0) {
    const f = Y(floorY(7)), k = clamp(o.glow7), p = .6 + .4 * Math.sin(t * 5);
    ctx.save(); ctx.strokeStyle = `rgba(76,217,100,${k * p})`; ctx.lineWidth = 14; ctx.setLineDash([]); ctx.strokeRect(10, f - FH + 4, 750, FH - 8); glow(ctx, 380, f - FH / 2, 520, 'rgba(76,217,100,1)', .18 * k); ctx.restore();
  }
  if (o.over) o.over(ctx, Y);
}

// A flat seen in section: wallpaper, a window with the street outside, furniture, the door to the stairs on the right.
function flatRoom(ctx, t, n, c, o) {
  const nik = n === 7, f = c + FH;
  wallpaper(ctx, 0, c, 750, FH, nik ? '#d7c79f' : ROOMS[n % ROOMS.length], 10);
  const wx = nik ? 70 : 60 + (n % 3) * 90;
  ctx.fillStyle = '#e9e6df'; ctx.fillRect(wx, c + 70, 260, 220);
  ctx.save(); ctx.beginPath(); ctx.rect(wx + 14, c + 84, 232, 192); ctx.clip();
  outside(ctx, t, wx + 14, c + 84, 232, 192, { chaos: o.chaos, night: o.night, seed: n });
  ctx.restore();
  ctx.fillStyle = '#e9e6df'; ctx.fillRect(wx + 124, c + 70, 12, 220); ctx.fillRect(wx, c + 176, 260, 10);
  if (nik && o.curtains > 0) curtainPair(ctx, wx - 20, c + 56, 300, 250, o.curtains, '#a85b4b');
  if (!nik) {
    // furniture silhouettes, different on each floor
    const r = rng(n * 13); ctx.fillStyle = 'rgba(60,48,40,0.35)';
    if (n % 2) { rrect(ctx, 420, f - 120, 260, 90, 20); ctx.fill(); ctx.fillRect(430, f - 160, 240, 50); }
    else { ctx.fillRect(440, f - 140, 200, 14); ctx.fillRect(452, f - 126, 12, 100); ctx.fillRect(616, f - 126, 12, 100); ctx.fillRect(400 + r() * 20, c + 60, 6, 120); ell(ctx, 403, c + 190, 40, 24); ctx.fill(); }
  }
  ctx.fillStyle = '#8a6a48'; ctx.fillRect(0, f - 26, 750, 26);
  // the door to the landing
  ctx.fillStyle = '#5a3a26'; ctx.fillRect(752, f - 290, 14, 290); ctx.fillStyle = '#c9a24a'; ell(ctx, 748, f - 140, 5, 5); ctx.fill();
  if ((o.night || 0) > .5 && !nik) { ctx.fillStyle = 'rgba(8,12,26,0.55)'; ctx.fillRect(0, c, 750, FH); }
}

// The ground floor: the entrance hall with mailboxes, the street door on the left.
function hall1(ctx, t, c, o) {
  const f = c + FH;
  ctx.fillStyle = '#cfcab8'; ctx.fillRect(0, c, 750, FH); ctx.fillStyle = '#6f8a72'; ctx.fillRect(0, c + FH * .5, 750, FH * .5);
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, c + FH * .5 - 6, 750, 6);
  ctx.fillStyle = '#9aa1a8'; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { ctx.fillRect(400 + i * 64, c + 110 + j * 46, 56, 38); }
  ctx.fillStyle = '#6e757c'; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) ctx.fillRect(410 + i * 64, c + 120 + j * 46, 30, 5);
  // the street door: opens inwards (o.door 0..1), the dark street beyond
  ctx.fillStyle = (o.night || 0) > .5 ? '#0d111c' : '#3a4048'; ctx.fillRect(40, f - 300, 190, 300);
  const k = clamp(o.door || 0); ctx.fillStyle = '#4c5a66'; ctx.fillRect(40, f - 300, 190 * (1 - .8 * k), 300);
  ctx.fillStyle = 'rgba(160,200,230,0.35)'; ctx.fillRect(60, f - 270, 150 * (1 - .8 * k), 120);
  ctx.fillStyle = '#2a2e33'; ctx.fillRect(30, f - 316, 210, 16);
  ctx.fillStyle = '#7a6f60'; ctx.fillRect(0, f - 26, 750, 26);
}

// Where a walker on the stairs is: p = 1 at the foot of the stairs on floor 1, 7 on the landing of floor 7.
// Returns [x, worldY, face]. Below 1 the walker crosses the entrance hall from the street door.
function stairPos(p) {
  if (p < 1) return [lerp(80, 790, clamp(p)), floorY(1) - 8, 1];
  const n = Math.floor(p), v = p - n, f = floorY(n);
  return v < .5 ? [lerp(800, 1010, v * 2), lerp(f, f - FH / 2, v * 2) - 6, 1] : [lerp(1010, 800, (v - .5) * 2), lerp(f - FH / 2, f - FH, (v - .5) * 2) - 6, -1];
}

// ---------- curtains ----------

// Two panels on a rod over (x, y, w, h): k = 0 bunched at the sides, 1 closed in the middle.
function curtainPair(ctx, x, y, w, h, k, col = '#a85b4b') {
  const pw = lerp(w * .14, w * .52, clamp(k));
  ctx.fillStyle = '#5a4030'; ctx.fillRect(x - 10, y - 12, w + 20, 10);
  for (const side of [0, 1]) {
    const px = side ? x + w - pw : x;
    ctx.fillStyle = col; ctx.fillRect(px, y, pw, h);
    ctx.fillStyle = 'rgba(0,0,0,0.14)'; const folds = Math.max(2, Math.round(pw / 26));
    for (let i = 0; i < folds; i++) ctx.fillRect(px + (i + .3) * pw / folds, y, pw / folds * .3, h);
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; for (let i = 0; i < folds; i++) ctx.fillRect(px + (i + .75) * pw / folds, y, pw / folds * .12, h);
  }
}

// ---------- the kitchen ----------

// Nikita's kitchen, front view: the window on the left with the street outside, a clock, a shelf, the table on the right.
// o: chaos, night, siren (outside), curtains (0..1), time (hours on the clock), bowl (true), radio (0..1 lit), lamp (0..1).
function kitchen(ctx, t, o = {}) {
  wallpaper(ctx, 0, 0, W, 1560, '#d7c79f', 10);
  ctx.fillStyle = '#bfae86'; ctx.fillRect(0, 1080, W, 480); ctx.fillStyle = '#a8966e'; ctx.fillRect(0, 1072, W, 12);
  ctx.fillStyle = '#8a6f55'; ctx.fillRect(0, 1560, W, H - 1560);
  ctx.fillStyle = 'rgba(0,0,0,0.06)'; for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) ctx.fillRect(i * 96 - 20, 1580 + j * 90, 96, 90);
  ctx.fillStyle = '#6f5238'; ctx.fillRect(0, 1548, W, 18);
  // the window
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(104, 306, 492, 704);
  ctx.fillStyle = '#e9e6df'; ctx.fillRect(110, 300, 480, 700);
  ctx.save(); ctx.beginPath(); ctx.rect(130, 320, 440, 660); ctx.clip();
  outside(ctx, t, 130, 320, 440, 660, { chaos: o.chaos, night: o.night, siren: o.siren, seed: 3 });
  ctx.restore();
  ctx.fillStyle = '#e9e6df'; ctx.fillRect(342, 300, 16, 700); ctx.fillRect(110, 540, 480, 16);
  ctx.fillStyle = '#c8c3b8'; ctx.fillRect(300, 760, 10, 60);  // the latch
  ctx.fillStyle = '#efece6'; ctx.fillRect(80, 1000, 540, 34); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(90, 1034, 520, 12);
  // a little radio on the sill
  ctx.fillStyle = '#c9b48a'; rrect(ctx, 450, 900, 140, 100, 14); ctx.fill(); ctx.fillStyle = '#6b5a45'; rrect(ctx, 462, 914, 58, 72, 8); ctx.fill();
  ctx.fillStyle = (o.radio || 0) > .5 ? '#ffe7a0' : '#efe2c0'; ctx.fillRect(530, 916, 48, 26); ctx.strokeStyle = '#8a7a60'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(575, 900); ctx.lineTo(640, 760); ctx.stroke();
  if ((o.radio || 0) > .5) glow(ctx, 554, 929, 70, 'rgba(255,220,120,1)', .5);
  if (o.curtains != null) curtainPair(ctx, 80, 270, 540, 760, o.curtains);
  // the clock
  const hr = o.time ?? 8;
  ctx.fillStyle = '#5a4030'; ell(ctx, 850, 330, 88, 88); ctx.fill(); ctx.fillStyle = '#fbf7ee'; ell(ctx, 850, 330, 74, 74); ctx.fill();
  ctx.fillStyle = '#333'; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ctx.fillRect(850 + Math.sin(a) * 60 - 3, 330 - Math.cos(a) * 60 - 3, 6, 6); }
  ctx.strokeStyle = '#222'; ctx.lineCap = 'round';
  const hand = (a, l, w) => { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(850, 330); ctx.lineTo(850 + Math.sin(a) * l, 330 - Math.cos(a) * l); ctx.stroke(); };
  hand(hr / 12 * Math.PI * 2, 38, 8); hand((hr % 1) * Math.PI * 2, 56, 5);
  // a shelf with jars and a plant
  ctx.fillStyle = '#8a6a48'; ctx.fillRect(700, 640, 330, 16);
  [['#d9a441', 730, 70], ['#c75b3a', 800, 54], ['#e8e0c8', 860, 80]].forEach(([c, x, h]) => { ctx.fillStyle = c; rrect(ctx, x, 640 - h, 50, h, 8); ctx.fill(); ctx.fillStyle = '#6b5a45'; ctx.fillRect(x + 4, 640 - h - 10, 42, 12); });
  ctx.fillStyle = '#b5683e'; ctx.fillRect(950, 590, 56, 50); ctx.fillStyle = '#4f8a4a'; for (const [dx, dy] of [[-20, -40], [0, -60], [22, -42]]) { ell(ctx, 978 + dx, 590 + dy, 16, 30, dx * .02); ctx.fill(); }
  // the lamp over the table
  ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(760, 0); ctx.lineTo(760, 120); ctx.stroke();
  ctx.fillStyle = '#c75b3a'; poly(ctx, [[700, 190], [820, 190], [790, 120], [730, 120]]); ctx.fill();
  if ((o.lamp ?? 1) > .5) { ctx.fillStyle = '#fff3c8'; ell(ctx, 760, 192, 34, 12); ctx.fill(); glow(ctx, 760, 210, 260, 'rgba(255,230,170,1)', .25); }
}

// The kitchen table (drawn after Nikita when he sits behind it): top at y = 1420, a bowl of porridge on it.
function kTable(ctx, t, o = {}) {
  ctx.fillStyle = '#6f5238'; ctx.fillRect(540, 1440, 26, 330); ctx.fillRect(950, 1440, 26, 330);
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ell(ctx, 760, 1790, 280, 26); ctx.fill();
  ctx.fillStyle = '#8a6a48'; ctx.fillRect(500, 1416, 500, 34); ctx.fillStyle = '#9c7b56'; ctx.fillRect(500, 1416, 500, 8);
  if (o.bowl !== false) {
    ctx.fillStyle = '#e8d3a0'; ell(ctx, 640, 1372, 74, 16); ctx.fill();
    ctx.fillStyle = '#eef0f2'; ctx.beginPath(); ctx.moveTo(560, 1372); ctx.quadraticCurveTo(570, 1418, 640, 1418); ctx.quadraticCurveTo(710, 1418, 720, 1372); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3f6fb8'; ctx.fillRect(566, 1384, 148, 7);
    if (o.steam) for (let i = 0; i < 3; i++) { const u = (t * .5 + i / 3) % 1; ctx.strokeStyle = `rgba(255,255,255,${.4 * (1 - u)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(610 + i * 30, 1350 - u * 120); ctx.quadraticCurveTo(625 + i * 30, 1320 - u * 120, 610 + i * 30, 1290 - u * 120); ctx.stroke(); }
  }
}
// The chair Nikita sits on, facing left (drawn before him).
function kChair(ctx, x = 880) {
  ctx.fillStyle = '#7a5a3c'; ctx.fillRect(x + 70, 1180, 22, 600); ctx.fillRect(x - 70, 1560, 160, 22); ctx.fillRect(x - 64, 1580, 18, 200); ctx.fillRect(x + 70, 1580, 18, 200);
}

// ---------- the street below the window ----------

// The street seen from the seventh floor: the houses across, the road, the near pavement, our windowsill at the bottom.
// o: chaos (smoke, a burning car), siren, draw(ctx) for the people (feet on the road at y ≈ 1040, far pavement ≈ 600).
function street(ctx, t, o = {}) {
  const ch = o.chaos || 0;
  vgrad(ctx, 0, 0, W, 560, [[0, '#9a958b'], [1, '#8c867b']]);
  // the house across: windows, a shop with an awning
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { ctx.fillStyle = '#c7cdd2'; ctx.fillRect(40 + c * 175, 20 + r * 100, 90, 64); ctx.fillStyle = '#7f8a94'; ctx.fillRect(48 + c * 175, 28 + r * 100, 74, 48); }
  ctx.fillStyle = '#6b6258'; ctx.fillRect(0, 410, W, 150); ctx.fillStyle = '#d7342c'; ctx.fillRect(120, 418, 380, 56);
  ctx.fillStyle = '#fff'; ctx.font = `900 40px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ПРОДУКТЫ', 310, 447);
  ctx.fillStyle = '#2f6fd6'; for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#e9e6df' : '#2f6fd6'; poly(ctx, [[600 + i * 70, 470], [670 + i * 70, 470], [660 + i * 70, 520], [610 + i * 70, 520]]); ctx.fill(); }
  ctx.fillStyle = '#3a3f46'; ctx.fillRect(140, 486, 340, 74); ctx.fillStyle = 'rgba(160,200,230,0.35)'; ctx.fillRect(150, 494, 150, 60); ctx.fillRect(320, 494, 150, 60);
  // pavement, kerb, road
  ctx.fillStyle = '#b3ad9f'; ctx.fillRect(0, 560, W, 90); ctx.fillStyle = '#8f897e'; ctx.fillRect(0, 650, W, 14);
  ctx.fillStyle = '#56595e'; ctx.fillRect(0, 664, W, 960);
  ctx.fillStyle = 'rgba(255,255,255,0.75)'; for (let x = -40; x < W; x += 200) ctx.fillRect(x, 1130, 110, 14);
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 6; i++) ctx.fillRect(760 + i * 50, 680, 28, 380);
  // a car parked across the road, burning once the chaos starts
  car(ctx, 250, 900, 1, '#c7a23a', ch);
  if (ch > 0) { ctx.save(); ctx.globalAlpha = clamp(ch * 2); flame(ctx, t, 240, 820, 1.2, 1); flame(ctx, t, 330, 830, .9, 2); smokeCol(ctx, t, 250, 800, .8, 2, '50,46,50', .7); ctx.restore(); }
  ctx.fillStyle = '#b3ad9f'; ctx.fillRect(0, 1624, W, 110); ctx.fillStyle = '#8f897e'; ctx.fillRect(0, 1610, W, 14);
  if (o.draw) o.draw(ctx);
  if (ch > 0) { ctx.save(); ctx.globalAlpha = clamp(ch); smokeCol(ctx, t, 980, 700, 1.1, 5, '60,56,60', .45); ctx.restore(); }
  if (o.siren > 0) { const red = Math.sin(t * 14) > 0; ctx.fillStyle = red ? `rgba(255,40,40,${.22 * o.siren})` : `rgba(40,90,255,${.22 * o.siren})`; ctx.fillRect(0, 0, W, H); }
  // our windowsill and the wall under it
  ctx.fillStyle = '#cfc6b4'; ctx.fillRect(0, 1760, W, 160); ctx.fillStyle = '#efece6'; ctx.fillRect(0, 1730, W, 40); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(0, 1770, W, 12);
}
// A car from the side, (x, y) = middle of its bottom.
function car(ctx, x, y, s, col, wreck = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(wreck * .05);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ell(ctx, 0, 6, 220, 16); ctx.fill();
  ctx.fillStyle = col; rrect(ctx, -210, -90, 420, 74, 26); ctx.fill(); rrect(ctx, -120, -150, 230, 80, [30, 40, 0, 0]); ctx.fill();
  ctx.fillStyle = wreck > .3 ? '#2a2a2e' : '#a9c3d4'; rrect(ctx, -104, -138, 96, 58, [20, 0, 0, 0]); ctx.fill(); rrect(ctx, 4, -138, 92, 58, [0, 28, 0, 0]); ctx.fill();
  ctx.fillStyle = '#222'; for (const k of [-130, 130]) { ell(ctx, k, -14, 42, 42); ctx.fill(); ctx.fillStyle = '#888'; ell(ctx, k, -14, 16, 16); ctx.fill(); ctx.fillStyle = '#222'; }
  ctx.fillStyle = '#ffe49a'; ctx.fillRect(196, -78, 14, 18); ctx.fillStyle = '#d7342c'; ctx.fillRect(-210, -78, 12, 18);
  ctx.restore();
}

// ---------- the radio ----------

// The little radio from the windowsill, close up. o: on (0..1, the dial lit), needle (0..1), knob (turn, radians),
// speak (0..1, the grille pulses), stat (0..1, static on the dial), hand (0..1, a hand on the right knob), red (alarm light).
function radio(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, 1100, [[0, '#cfc19c'], [1, '#bba97f']]);
  glow(ctx, 300, 300, 700, 'rgba(255,250,235,1)', .25);
  ctx.fillStyle = '#efece6'; ctx.fillRect(0, 1100, W, H - 1100); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ell(ctx, 540, 1110, 470, 40); ctx.fill();
  const on = clamp(o.on || 0), sp = clamp(o.speak || 0);
  // the antenna
  ctx.strokeStyle = '#9aa1a8'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(880, 470); ctx.lineTo(1040, 60); ctx.stroke(); ctx.strokeStyle = '#c8ccd0'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(960, 265); ctx.lineTo(1040, 60); ctx.stroke();
  // the body
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; rrect(ctx, 130, 470, 830, 640, 60); ctx.fill();
  ctx.fillStyle = '#c9b48a'; rrect(ctx, 120, 450, 830, 640, 60); ctx.fill(); ctx.fillStyle = '#b39e74'; rrect(ctx, 120, 960, 830, 130, [0, 0, 60, 60]); ctx.fill();
  ctx.fillStyle = '#e0cfa6'; rrect(ctx, 140, 466, 790, 26, 13); ctx.fill();
  // the grille
  const k = 1 + .025 * sp * Math.sin(t * 60);
  ctx.save(); ctx.translate(345, 735); ctx.scale(k, k);
  ctx.fillStyle = '#5e4e3c'; rrect(ctx, -185, -225, 370, 450, 40); ctx.fill();
  ctx.fillStyle = '#3c3126'; for (let r = 0; r < 9; r++) for (let c = 0; c < 7; c++) { ell(ctx, -144 + c * 48, -186 + r * 47, 12, 12); ctx.fill(); }
  ctx.restore();
  if (sp > .05) for (let i = 0; i < 3; i++) { const u = (t * 1.6 + i / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - u) * sp; ctx.strokeStyle = TSC.y; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(345, 735, 250 + u * 230, Math.PI * .62, Math.PI * 1.38); ctx.stroke(); ctx.restore(); }
  // the dial
  ctx.fillStyle = '#3c3126'; rrect(ctx, 580, 520, 330, 190, 22); ctx.fill();
  vgrad(ctx, 594, 534, 302, 162, on > .5 ? [[0, '#fff1c0'], [1, '#ffd77a']] : [[0, '#e9dfc3'], [1, '#d8caa6']]);
  ctx.fillStyle = '#5a4a36'; ctx.font = `800 24px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  [88, 92, 96, 100, 104, 108].forEach((f, i) => { const x = 620 + i * 50; ctx.fillText(String(f), x, 566); ctx.fillRect(x - 2, 590, 4, 28); ctx.fillRect(x + 23, 598, 3, 14); });
  const nx = 620 + clamp(o.needle ?? .45) * 250 + (o.stat ? (noise1(t * 30) - .5) * 30 * o.stat : 0);
  ctx.fillStyle = '#d7342c'; ctx.fillRect(nx - 3, 584, 6, 100);
  if (o.stat > 0) { const r = rng(Math.floor(t * 30)); for (let i = 0; i < 40; i++) { ctx.fillStyle = `rgba(60,50,40,${.5 * o.stat * r()})`; ctx.fillRect(594 + r() * 290, 534 + r() * 150, 20 + r() * 40, 3); } }
  if (on > .5) glow(ctx, 745, 615, 260, 'rgba(255,210,110,1)', .45 * on);
  ctx.fillStyle = '#5a4a36'; ctx.font = `900 34px ${MONT}`; ctx.fillText('ВОЛНА', 745, 770);
  ctx.fillStyle = on > .5 ? (o.red ? (Math.sin(t * 10) > 0 ? '#ff3b30' : '#6a1a14') : '#4cd964') : '#3a3a30'; ell(ctx, 900, 770, 12, 12); ctx.fill();
  if (on > .5) glow(ctx, 900, 770, 50, o.red ? 'rgba(255,60,40,1)' : 'rgba(76,217,100,1)', .6);
  // the knobs
  for (const [kx, rot] of [[660, .4], [830, o.knob || 0]]) {
    ctx.fillStyle = '#2b231b'; ell(ctx, kx, 880, 62, 62); ctx.fill(); ctx.fillStyle = '#3c3126'; ell(ctx, kx, 880, 50, 50); ctx.fill();
    ctx.strokeStyle = '#e0cfa6'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(kx, 880); ctx.lineTo(kx + Math.sin(rot) * 42, 880 - Math.cos(rot) * 42); ctx.stroke();
  }
  // Nikita's hand turning the right knob, coming in from the bottom right
  const hk = clamp(o.hand || 0);
  if (hk > 0) {
    const hx = lerp(1250, 900, outc(hk)), hy = lerp(1500, 930, outc(hk));
    ctx.fillStyle = SUIT.suit; ctx.save(); ctx.translate(hx, hy); ctx.rotate(-.6); ctx.fillRect(10, 40, 150, 700); ctx.fillStyle = SUIT.stripe; ctx.fillRect(110, 40, 16, 700); ctx.restore();
    ctx.fillStyle = SUIT.skin; ell(ctx, hx - 20, hy - 10, 80, 70); ctx.fill(); ctx.fillStyle = SUIT.skinD; rrect(ctx, hx - 105, hy - 60, 70, 40, 20); ctx.fill(); rrect(ctx, hx - 105, hy - 14, 70, 36, 18); ctx.fill();
  }
}

// The emergency card over the radio: a red band and the rules, one per line of the broadcast.
// rules: [[icon, text, k], ...] (k = 0..1 how far it has come in), cur = the rule being read.
function alertCard(ctx, t, rules, cur) {
  ctx.fillStyle = 'rgba(14,8,10,0.72)'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#d7342c'; ctx.fillRect(0, 150, W, 140);
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; for (let x = -80; x < W; x += 80) poly(ctx, [[x, 150], [x + 40, 150], [x + 80, 290], [x + 40, 290]]), ctx.fill();
  const bl = Math.sin(t * 8) > -.2;
  ctx.fillStyle = '#d7342c'; rrect(ctx, 90, 180, 900, 80, 40); ctx.fill();
  if (bl) { icon2(ctx, 'warn', 150, 220, 56, '#fff', '#d7342c'); icon2(ctx, 'warn', 930, 220, 56, '#fff', '#d7342c'); }
  ctx.fillStyle = '#fff'; ctx.font = `900 46px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ЭКСТРЕННОЕ ОПОВЕЩЕНИЕ', 540, 222);
  rules.forEach(([icon, text, k], i) => {
    if (k <= 0) return;
    const y = 450 + i * 210, a = outBack(clamp(k)), now = i === cur;
    ctx.save(); ctx.translate(lerp(1400, 540, a), y); ctx.globalAlpha = now ? 1 : .72;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; rrect(ctx, -460, -78, 920, 170, 34); ctx.fill();
    ctx.fillStyle = now ? '#ffffff' : '#e9e6df'; rrect(ctx, -460, -86, 920, 170, 34); ctx.fill();
    if (now) { ctx.strokeStyle = TSC.y; ctx.lineWidth = 10; rrect(ctx, -460, -86, 920, 170, 34); ctx.stroke(); }
    ctx.fillStyle = '#d7342c'; ell(ctx, -370, 0, 58, 58); ctx.fill(); icon2(ctx, icon, -370, 0, 64, '#fff', '#d7342c');
    ctx.fillStyle = '#141414'; ctx.textAlign = 'left'; let size = 44; ctx.font = `900 ${size}px ${MONT}`;
    const lines = text.split('\n'); const wmax = Math.max(...lines.map(l => ctx.measureText(l).width)); if (wmax > 700) { size *= 700 / wmax; ctx.font = `900 ${size}px ${MONT}`; }
    lines.forEach((l, j) => ctx.fillText(l, -280, (j - (lines.length - 1) / 2) * size * 1.15 + 3));
    ctx.restore();
  });
}

// ---------- the outbreak map ----------

// A town plan: blocks, a river, a park; red patches spread from a few places (k = 0..1); Nikita's house marked.
function outbreakMap(ctx, t, k, home = 1) {
  ctx.fillStyle = '#e6dfc9'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#d4cbb2'; for (let r = 0; r < 12; r++) for (let c = 0; c < 6; c++) { const x = 30 + c * 180 + (r % 2) * 30, y = 40 + r * 165; rrect(ctx, x, y, 140, 125, 12); ctx.fill(); }
  ctx.fillStyle = '#a9c08f'; rrect(ctx, 600, 1400, 420, 300, 40); ctx.fill();
  ctx.strokeStyle = '#8fb3c9'; ctx.lineWidth = 90; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-100, 520); ctx.bezierCurveTo(300, 700, 500, 300, 760, 560); ctx.bezierCurveTo(950, 750, 1000, 900, 1200, 880); ctx.stroke();
  ctx.strokeStyle = '#f3efe3'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(0, 1180); ctx.lineTo(W, 1060); ctx.moveTo(380, 0); ctx.lineTo(450, H); ctx.stroke();
  // the infection
  const src = [[230, 1500, 1], [820, 1180, .9], [520, 300, .8], [930, 1700, .7]];
  for (const [x, y, s] of src) {
    const r = Math.max(0, 520 * s * k + 18 * Math.sin(t * 3 + x));
    if (r <= 0) continue;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(215,52,44,0.75)'); g.addColorStop(.8, 'rgba(215,52,44,0.45)'); g.addColorStop(1, 'rgba(215,52,44,0)');
    ctx.fillStyle = g; ell(ctx, x, y, r, r); ctx.fill();
    ctx.save(); ctx.globalAlpha = .9; ctx.fillStyle = '#d7342c'; ell(ctx, x, y, 18, 18); ctx.fill(); ctx.restore();
  }
  // Nikita's house
  if (home > 0) { const a = outBack(clamp(home)); ctx.save(); ctx.translate(640, 900); ctx.scale(a, a); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ell(ctx, 0, 70, 70, 14); ctx.fill(); ctx.fillStyle = TSC.y; poly(ctx, [[-60, 0], [0, -60], [60, 0], [60, 60], [-60, 60]]); ctx.fill(); ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-16, 20, 32, 40); ctx.restore(); pill(ctx, 640, 1030, 'ДОМ НИКИТЫ', 'yellow', home, { size: 30 }); }
}

// ---------- the hallway and the barricade ----------

// The front door from inside the flat: brown quilted leatherette, a lock, a lever handle, a peephole; coats on hooks.
// o: lockK (0..1 bolt shut), handle (0..1 pressed), shake (0..1), wardrobe (0..1 slid in front of the door),
// table (0..1), items (seconds since each of the five things landed, or null), ring (0..1 highlight on the door).
function hallway(ctx, t, o = {}) {
  wallpaper(ctx, -900, -900, W + 1800, 2500, '#c4b49a', 9);
  ctx.fillStyle = '#7a644f'; ctx.fillRect(-900, 1600, W + 1800, 1300); ctx.fillStyle = 'rgba(0,0,0,0.08)'; for (let x = -900; x < W + 900; x += 90) ctx.fillRect(x, 1600, 4, 1300);
  ctx.fillStyle = '#5a4030'; ctx.fillRect(-900, 1590, W + 1800, 18);
  // coats on the hooks, a cap, shoes
  ctx.fillStyle = '#5a4030'; ctx.fillRect(40, 520, 200, 20);
  ctx.fillStyle = '#3d5f8a'; poly(ctx, [[70, 540], [130, 540], [150, 1020], [50, 1020]]); ctx.fill(); ctx.fillStyle = '#7a3b30'; poly(ctx, [[150, 540], [210, 540], [236, 960], [140, 960]]); ctx.fill();
  ctx.fillStyle = '#2b2b30'; ell(ctx, 100, 1580, 46, 16); ctx.fill(); ell(ctx, 190, 1584, 46, 16); ctx.fill();
  const [sx, sy] = o.shake ? [(noise1(t * 40) - .5) * 26 * o.shake, (noise1(t * 37 + 5) - .5) * 10 * o.shake] : [0, 0];
  ctx.save(); ctx.translate(sx, sy);
  // the door and its frame
  ctx.fillStyle = '#4a2c1e'; ctx.fillRect(280, 400, 500, 1200);
  ctx.fillStyle = '#6b3f2a'; ctx.fillRect(306, 426, 448, 1170);
  ctx.save(); ctx.beginPath(); ctx.rect(306, 426, 448, 1170); ctx.clip();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 4;
  for (let i = -12; i < 14; i++) { ctx.beginPath(); ctx.moveTo(306 + i * 90, 426); ctx.lineTo(306 + i * 90 + 1170, 1596); ctx.stroke(); ctx.beginPath(); ctx.moveTo(754 - i * 90, 426); ctx.lineTo(754 - i * 90 - 1170, 1596); ctx.stroke(); }
  ctx.fillStyle = '#c9a24a'; for (let i = -12; i < 14; i++) for (let j = 0; j < 14; j++) { const x = 306 + i * 90 + j * 90, y = 426 + j * 90; if (x > 300 && x < 760) { ell(ctx, x, y, 6, 6); ctx.fill(); } }
  ctx.restore();
  ctx.fillStyle = '#c9a24a'; ell(ctx, 530, 760, 16, 16); ctx.fill(); ctx.fillStyle = '#1a1210'; ell(ctx, 530, 760, 7, 7); ctx.fill();
  // the lock: a round plate with a thumb-turn
  ctx.fillStyle = '#b9bec4'; ell(ctx, 690, 960, 34, 34); ctx.fill(); ctx.save(); ctx.translate(690, 960); ctx.rotate((o.lockK || 0) * Math.PI / 2); ctx.fillStyle = '#80868c'; rrect(ctx, -9, -26, 18, 52, 8); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(690, 1110); ctx.rotate((o.handle || 0) * .45); ctx.fillStyle = '#b9bec4'; ell(ctx, 0, 0, 22, 22); ctx.fill(); rrect(ctx, -120, -12, 130, 24, 12); ctx.fill(); ctx.restore();
  if (o.ring > 0) { ctx.save(); ctx.globalAlpha = clamp(o.ring); ctx.strokeStyle = TSC.y; ctx.lineWidth = 12; ctx.setLineDash([26, 16]); ctx.lineDashOffset = -t * 50; rrect(ctx, 250, 370, 560, 1260, 30); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  // the barricade
  const wk = clamp(o.wardrobe || 0);
  if (wk > 0) {
    const wx = lerp(1180, 300, wk);
    ctx.save(); ctx.translate(wx + sx * .6, sy * .6);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ell(ctx, 230, 1650, 260, 26); ctx.fill();
    ctx.fillStyle = '#7d5c3a'; ctx.fillRect(0, 560, 460, 1080); ctx.fillStyle = '#8c6a45'; ctx.fillRect(20, 600, 205, 1000); ctx.fillRect(235, 600, 205, 1000);
    ctx.fillStyle = '#6b4c30'; ctx.fillRect(-14, 540, 488, 36); ctx.fillStyle = '#c9a24a'; ell(ctx, 205, 1100, 10, 10); ctx.fill(); ell(ctx, 255, 1100, 10, 10); ctx.fill();
    ctx.restore();
  }
  const tk = clamp(o.table || 0);
  if (tk > 0) {
    const tx = lerp(1250, 290, tk);
    ctx.save(); ctx.translate(tx + sx * .4, sy * .4);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ell(ctx, 250, 1800, 280, 24); ctx.fill();
    ctx.fillStyle = '#6f5238'; ctx.fillRect(30, 1490, 30, 300); ctx.fillRect(440, 1490, 30, 300);
    ctx.fillStyle = '#9c7b56'; ctx.fillRect(0, 1460, 500, 40); ctx.fillStyle = '#b08d64'; ctx.fillRect(0, 1460, 500, 9);
    (o.items || []).forEach((age, i) => { if (age != null && age >= 0) stackItem(ctx, t, i, age); });
    ctx.restore();
  }
}
// The things piled on the table (in table coordinates, top at y = 1460): a box, a microwave, a kettlebell, books, a box.
function stackItem(ctx, t, i, age) {
  const fall = clamp(age / .22), y0 = -700 * (1 - fall * fall), bounce = age > .22 ? Math.sin((age - .22) * 30) * 16 * Math.exp(-(age - .22) * 9) : 0;
  ctx.save(); ctx.translate(0, y0 - Math.abs(bounce));
  if (i === 0) { ctx.fillStyle = '#c49a62'; ctx.fillRect(30, 1260, 230, 200); ctx.fillStyle = '#a97f4a'; ctx.fillRect(30, 1260, 230, 40); ctx.fillStyle = '#e2d2a8'; ctx.fillRect(130, 1260, 30, 200); }
  if (i === 1) { ctx.fillStyle = '#d6d8da'; rrect(ctx, 270, 1280, 220, 180, 14); ctx.fill(); ctx.fillStyle = '#2a2e33'; rrect(ctx, 288, 1300, 140, 140, 8); ctx.fill(); ctx.fillStyle = '#9aa1a8'; ctx.fillRect(444, 1310, 30, 10); ctx.fillRect(444, 1340, 30, 10); }
  if (i === 2) { ctx.fillStyle = '#26282c'; ell(ctx, 150, 1200, 70, 62); ctx.fill(); ctx.strokeStyle = '#26282c'; ctx.lineWidth = 24; ctx.beginPath(); ctx.arc(150, 1140, 44, Math.PI, 0); ctx.stroke(); ctx.fillStyle = '#e9e6df'; ctx.font = `900 30px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('32', 150, 1204); }
  if (i === 3) { [['#2f6fd6', 0], ['#d7342c', 1], ['#2e9e4a', 2], ['#e3893b', 3]].forEach(([c, k]) => { ctx.fillStyle = c; ctx.fillRect(285 + k * 6, 1220 - k * 56, 200, 54); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(285 + k * 6, 1240 - k * 56, 200, 6); }); }
  if (i === 4) { ctx.fillStyle = '#b5885a'; ctx.fillRect(330, 990, 170, 120); ctx.fillStyle = '#e2d2a8'; ctx.fillRect(405, 990, 20, 120); }
  ctx.restore();
}

// A close-up of the lock and the handle. o: turn (0..2, turns of the key: the bolt goes in on each), jiggle (0..1),
// ok (0..1, a green tick), hand (0..1).
function lockClose(ctx, t, o = {}) {
  ctx.fillStyle = '#6b3f2a'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(-200, -300); ctx.scale(2.4, 2.4);
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 3;
  for (let i = -10; i < 14; i++) { ctx.beginPath(); ctx.moveTo(i * 90, 0); ctx.lineTo(i * 90 + 1200, 1200); ctx.stroke(); ctx.beginPath(); ctx.moveTo(i * 90 + 700, 0); ctx.lineTo(i * 90 - 500, 1200); ctx.stroke(); }
  ctx.fillStyle = '#c9a24a'; for (let i = -10; i < 14; i++) for (let j = 0; j < 14; j++) { ell(ctx, i * 90 + j * 90 + 35, j * 90, 5, 5); ctx.fill(); }
  ctx.restore();
  // the lock plate with the thumb-turn
  const tr = o.turn || 0, jig = o.jiggle ? Math.sin(t * 34) * .12 * o.jiggle : 0;
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ell(ctx, 548, 618, 180, 180); ctx.fill();
  ctx.fillStyle = '#c3c8cd'; ell(ctx, 540, 610, 180, 180); ctx.fill(); ctx.fillStyle = '#d9dde1'; ell(ctx, 520, 590, 150, 150); ctx.fill();
  ctx.save(); ctx.translate(540, 610); ctx.rotate(tr * Math.PI + jig);
  ctx.fillStyle = '#8a9096'; rrect(ctx, -44, -150, 88, 300, 44); ctx.fill(); ctx.fillStyle = '#a6acb2'; rrect(ctx, -30, -140, 40, 280, 20); ctx.fill();
  ctx.restore();
  // the handle below
  ctx.save(); ctx.translate(540, 1560); ctx.rotate(o.jiggle ? Math.max(0, Math.sin(t * 17)) * .35 * o.jiggle : 0);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; rrect(ctx, -60, -40, 560, 96, 48); ctx.fill();
  ctx.fillStyle = '#c3c8cd'; ell(ctx, 0, 0, 90, 90); ctx.fill(); rrect(ctx, -40, -46, 540, 92, 46); ctx.fill(); ctx.fillStyle = '#e2e5e8'; rrect(ctx, 0, -40, 480, 26, 13); ctx.fill();
  ctx.restore();
  const hk = clamp(o.hand || 0);
  if (hk > 0) {
    const hx = lerp(1300, 700, outc(hk)), hy = lerp(1100, 700, outc(hk));
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(tr * Math.PI * .35 + jig);
    ctx.fillStyle = SUIT.suit; ctx.fillRect(90, -90, 700, 260); ctx.fillStyle = SUIT.stripe; ctx.fillRect(90, 110, 700, 22);
    ctx.fillStyle = SUIT.skin; ell(ctx, 40, 20, 140, 120); ctx.fill(); ctx.fillStyle = SUIT.skinD; rrect(ctx, -170, -70, 150, 64, 32); ctx.fill(); rrect(ctx, -150, 0, 130, 60, 30); ctx.fill();
    ctx.restore();
  }
  // the bolt: open until the second turn
  const b = clamp(tr / 2);
  pill(ctx, 540, 1040, b >= 1 ? 'ЗАПЕРТО' : 'ОТКРЫТО', b >= 1 ? 'green' : 'red', 1, { icon: b >= 1 ? 'lock' : 'cross', size: 40 });
  if (o.ok > 0) { const a = outBack(clamp(o.ok)); ctx.save(); ctx.translate(820, 330); ctx.scale(a, a); ctx.fillStyle = TSC.n; ell(ctx, 0, 0, 90, 90); ctx.fill(); icon2(ctx, 'check', 0, 0, 120, '#fff', TSC.n); ctx.restore(); }
}

// ---------- the door in section ----------

// Cut through the wall: the stair landing outside on the left, the door edge-on, the barricade inside on the right.
// o: dark (0..1), lamp (the landing bulb, 0..1), rattle (0..1 the door shakes), who(ctx) draws on the landing,
// nik(ctx) draws inside, meter (0..1 or null).
function doorSection(ctx, t, o = {}) {
  // the landing: two-tone painted walls, a bare bulb
  ctx.fillStyle = '#cfcab8'; ctx.fillRect(0, 0, 470, 1600); ctx.fillStyle = '#6f8a72'; ctx.fillRect(0, 900, 470, 700); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0, 894, 470, 6);
  ctx.fillStyle = '#8a7f72'; ctx.fillRect(0, 1600, 470, H - 1600); ctx.fillStyle = 'rgba(0,0,0,0.1)'; for (let x = 0; x < 470; x += 80) ctx.fillRect(x, 1600, 4, H - 1600);
  ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(230, 0); ctx.lineTo(230, 230); ctx.stroke();
  const lamp = o.lamp ?? 1, fl = lamp * (Math.sin(t * 23) > .92 ? .4 : 1);
  ctx.fillStyle = fl > .5 ? '#fff6d0' : '#7a7462'; ell(ctx, 230, 260, 30, 36); ctx.fill(); if (fl > .5) glow(ctx, 230, 270, 420, 'rgba(255,240,190,1)', .3 * fl);
  // the flat inside: wallpaper, floor
  wallpaper(ctx, 530, 0, W - 530, 1600, '#c4b49a', 9); ctx.fillStyle = '#7a644f'; ctx.fillRect(530, 1600, W - 530, H - 1600);
  // the wall cut through, with the doorway
  ctx.fillStyle = '#6f6a60'; ctx.fillRect(462, 0, 76, 400); ctx.fillRect(462, 1600, 76, H - 1600);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 3; for (let y = -40; y < 400; y += 36) { ctx.beginPath(); ctx.moveTo(462, y); ctx.lineTo(538, y + 40); ctx.stroke(); }
  if (o.who) o.who(ctx);
  const rt = o.rattle ? Math.sin(t * 50) * 6 * o.rattle : 0;
  ctx.save(); ctx.translate(rt, 0);
  ctx.fillStyle = '#3e2418'; ctx.fillRect(474, 400, 52, 1200); ctx.fillStyle = '#8a8f94'; ctx.fillRect(470, 400, 8, 1200); ctx.fillRect(522, 400, 8, 1200);
  ctx.fillStyle = '#b9bec4'; rrect(ctx, 404, 1098, 70, 22, 11); ctx.fill(); rrect(ctx, 526, 1098, 70, 22, 11); ctx.fill();
  ctx.restore();
  // the barricade pressed against the door: the wardrobe on its side, the table, the pile
  ctx.save(); ctx.translate(rt * .4, 0);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ell(ctx, 700, 1606, 200, 14); ctx.fill();
  ctx.fillStyle = '#7d5c3a'; ctx.fillRect(532, 560, 170, 1040); ctx.fillStyle = '#6b4c30'; ctx.fillRect(526, 540, 186, 30);
  ctx.fillStyle = '#6f5238'; ctx.fillRect(712, 1340, 24, 260); ctx.fillRect(960, 1340, 24, 260); ctx.fillStyle = '#9c7b56'; ctx.fillRect(704, 1310, 300, 34);
  ctx.fillStyle = '#c49a62'; ctx.fillRect(720, 1130, 150, 180); ctx.fillStyle = '#e2d2a8'; ctx.fillRect(785, 1130, 20, 180);
  ctx.fillStyle = '#d6d8da'; rrect(ctx, 880, 1170, 120, 140, 10); ctx.fill(); ctx.fillStyle = '#26282c'; ell(ctx, 790, 1080, 46, 42); ctx.fill();
  ctx.restore();
  if (o.nik) o.nik(ctx);
  if (o.meter != null) meter(ctx, 90, 250, 520, 'ЗАЩИТА', o.meter, '#3fbf5a', 1);
}

// ---------- the windows ----------

// The main room: a window on the left, the balcony door with its window on the right; radiator, curtains.
// o: chaos, night, vent (0..1 the left sash open), balcony (0..1 the balcony door open), curtains (0..1), lat / blat
// (0..1 the window's and the balcony door's handles turned shut).
function windowsWall(ctx, t, o = {}) {
  wallpaper(ctx, 0, 0, W, 1600, '#b9c4a8', 10);
  ctx.fillStyle = '#8a6f55'; ctx.fillRect(0, 1600, W, H - 1600); ctx.fillStyle = '#6f5238'; ctx.fillRect(0, 1590, W, 16);
  const pane = (x, y, w, h) => { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); outside(ctx, t, x - 200, y - 100, w + 400, h + 200, { chaos: o.chaos, night: o.night, seed: 4 }); ctx.restore(); };
  // the window: two panes, the top-left vent can stand open
  ctx.fillStyle = '#e9e6df'; ctx.fillRect(60, 330, 400, 680); pane(80, 350, 360, 640);
  ctx.fillStyle = '#e9e6df'; ctx.fillRect(252, 330, 16, 680); ctx.fillRect(60, 540, 400, 14);
  const v = clamp(o.vent || 0), fx = 80 + 172 * (1 - .7 * v);
  if (v > 0) { ctx.fillStyle = '#e9e6df'; poly(ctx, [[80, 350], [fx, 350 - 36 * v], [fx, 990 + 36 * v], [80, 990]]); ctx.fill(); ctx.fillStyle = 'rgba(160,190,210,0.45)'; poly(ctx, [[94, 366], [fx - 14, 366 - 32 * v], [fx - 14, 974 + 32 * v], [94, 974]]); ctx.fill(); }
  ctx.fillStyle = '#c8c3b8'; ctx.save(); ctx.translate(fx - 22, 760); ctx.rotate((1 - clamp(o.lat ?? 1)) * Math.PI / 2); ctx.fillRect(-6, -40, 12, 80); ctx.restore();
  ctx.fillStyle = '#efece6'; ctx.fillRect(40, 1010, 440, 30);
  ctx.fillStyle = '#e2e2de'; for (let i = 0; i < 9; i++) rrect(ctx, 90 + i * 38, 1080, 30, 220, 10), ctx.fill();
  // the balcony door and its window
  ctx.fillStyle = '#e9e6df'; ctx.fillRect(560, 330, 460, 1270);
  pane(780, 350, 220, 640);
  const bk = clamp(o.balcony || 0);
  ctx.fillStyle = '#20242b'; ctx.fillRect(580, 350, 180, 1230); pane(580, 350, 180, 1230);
  if (bk > 0) { ctx.fillStyle = '#e9e6df'; poly(ctx, [[580, 350], [580 + 180 * (1 - .55 * bk), 350 - 40 * bk], [580 + 180 * (1 - .55 * bk), 1580 + 40 * bk], [580, 1580]]); ctx.fill(); ctx.fillStyle = 'rgba(160,190,210,0.4)'; poly(ctx, [[596, 370], [580 + 166 * (1 - .55 * bk), 370 - 36 * bk], [580 + 166 * (1 - .55 * bk), 1560 + 36 * bk], [596, 1560]]); ctx.fill(); }
  else { ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(600, 370, 30, 1190); }
  ctx.fillStyle = '#e9e6df'; ctx.fillRect(760, 330, 20, 1270); ctx.fillRect(780, 990, 240, 610); ctx.fillRect(580, 960, 180, 14);
  if (bk <= 0) { ctx.fillStyle = '#c8c3b8'; ctx.save(); ctx.translate(735, 1000); ctx.rotate((1 - clamp(o.blat ?? 1)) * Math.PI / 2); ctx.fillRect(-6, -40, 12, 80); ctx.restore(); }
  if (o.curtains != null) { curtainPair(ctx, 30, 300, 460, 760, o.curtains, '#5f7d6e'); curtainPair(ctx, 540, 300, 500, 1290, o.curtains, '#5f7d6e'); }
}

// ---------- water and food ----------

// The tap over the sink, close: o.on (0..1 the lever up, water runs), fill (0..1 the bottle).
function sinkClose(ctx, t, o = {}) {
  ctx.fillStyle = '#dfe8ea'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(120,150,160,0.35)'; ctx.lineWidth = 4; for (let x = 0; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1500); ctx.stroke(); } for (let y = 0; y < 1500; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // the sink and the counter
  ctx.fillStyle = '#8a6a48'; ctx.fillRect(0, 1500, W, H - 1500); ctx.fillStyle = '#c3c9ce'; ctx.fillRect(0, 1480, W, 40);
  ctx.fillStyle = '#aeb5bb'; rrect(ctx, 120, 1480, 840, 120, [0, 0, 40, 40]); ctx.fill();
  // the tap: a tall neck from the back of the sink curving over
  ctx.strokeStyle = '#b9c0c6'; ctx.lineWidth = 56; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(820, 1490); ctx.lineTo(820, 560); ctx.quadraticCurveTo(820, 380, 640, 380); ctx.lineTo(560, 400); ctx.stroke();
  ctx.strokeStyle = '#dde2e6'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(806, 1480); ctx.lineTo(806, 560); ctx.quadraticCurveTo(806, 400, 640, 396); ctx.stroke();
  ctx.fillStyle = '#9aa1a8'; rrect(ctx, 520, 396, 70, 50, 14); ctx.fill();
  const on = clamp(o.on || 0);
  ctx.save(); ctx.translate(850, 1100); ctx.rotate(-.9 * on); ctx.fillStyle = '#9aa1a8'; rrect(ctx, -10, -18, 190, 36, 18); ctx.fill(); ctx.restore(); ctx.fillStyle = '#b9c0c6'; ell(ctx, 840, 1100, 40, 40); ctx.fill();
  // the bottle in the sink
  const lv = clamp(o.fill || 0), bx = 555, top = 760, bot = 1480;
  ctx.fillStyle = 'rgba(170,210,240,0.45)'; rrect(ctx, bx - 170, top + 160, 340, bot - top - 160, 50); ctx.fill(); poly(ctx, [[bx - 170, top + 200], [bx - 60, top + 40], [bx + 60, top + 40], [bx + 170, top + 200]]); ctx.fill();
  ctx.fillStyle = 'rgba(63,143,216,0.85)'; const ly = lerp(bot - 20, top + 210, lv); rrect(ctx, bx - 160, ly, 320, bot - 10 - ly, [6, 6, 40, 40]); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(bx - 140, top + 220, 22, bot - top - 300);
  ctx.fillStyle = '#2d5fa8'; rrect(ctx, bx - 60, top, 120, 50, 10); ctx.fill();
  if (on > .3) {
    const r = rng(Math.floor(t * 24)); ctx.fillStyle = 'rgba(120,180,230,0.85)'; ctx.fillRect(bx - 16 + (r() - .5) * 4, 440, 32, ly - 440);
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(bx - 6, 440, 6, ly - 440);
    for (let i = 0; i < 8; i++) { ctx.fillStyle = 'rgba(200,230,255,0.8)'; ell(ctx, bx + (r() - .5) * 120, ly - r() * 40, 6, 6); ctx.fill(); }
  }
}

// The water put by, all in a row: o.bottles (0..1 each of five in and filled), pots (0..1 each of two), bath (0..1).
function waterStore(ctx, t, o = {}) {
  ctx.fillStyle = '#d5e3e8'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(120,150,160,0.3)'; ctx.lineWidth = 4; for (let x = 0; x < W; x += 110) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 110) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.fillStyle = '#8a6a48'; ctx.fillRect(80, 760, 920, 26); ctx.fillRect(80, 1110, 920, 26);
  (o.bottles || []).forEach((k, i) => {
    if (k <= 0) return;
    const a = outBack(clamp(k * 2.5)), x = 190 + i * 175, lv = clamp(k * 1.4 - .3);
    ctx.save(); ctx.translate(x, 760); ctx.scale(a, a);
    ctx.fillStyle = 'rgba(170,210,240,0.55)'; rrect(ctx, -55, -320, 110, 320, 26); ctx.fill();
    ctx.fillStyle = '#3f8fd8'; const h = 300 * lv; rrect(ctx, -50, -10 - h, 100, h + 6, [4, 4, 22, 22]); ctx.fill();
    ctx.fillStyle = '#2d5fa8'; rrect(ctx, -24, -360, 48, 44, 8); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(-40, -290, 12, 240);
    ctx.restore();
  });
  (o.pots || []).forEach((k, i) => {
    if (k <= 0) return;
    const a = outBack(clamp(k * 2.5)), x = 320 + i * 440, lv = clamp(k * 1.4 - .3);
    ctx.save(); ctx.translate(x, 1110); ctx.scale(a, a);
    ctx.fillStyle = '#b9c0c6'; rrect(ctx, -170, -230, 340, 230, [10, 10, 30, 30]); ctx.fill(); ctx.fillRect(-210, -200, 50, 22); ctx.fillRect(160, -200, 50, 22);
    ctx.fillStyle = '#3f8fd8'; ell(ctx, 0, -230 + (1 - lv) * 30, 160, 26); ctx.fill(); ctx.fillStyle = '#9aa1a8'; ctx.fillRect(-170, -232, 340, 10);
    ctx.restore();
  });
  const bk = clamp(o.bath || 0);
  if (bk > 0) {
    const a = outBack(clamp(bk * 2.5)), lv = clamp(bk * 1.3 - .25);
    ctx.save(); ctx.translate(540, 1820); ctx.scale(a, a);
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ell(ctx, 0, 30, 470, 30); ctx.fill();
    ctx.fillStyle = '#f4f5f6'; rrect(ctx, -450, -340, 900, 340, [30, 30, 120, 120]); ctx.fill();
    ctx.fillStyle = '#3f8fd8'; rrect(ctx, -420, -310 + (1 - lv) * 260, 840, 30 + lv * 0, 15); ctx.fill();
    ctx.fillStyle = 'rgba(63,143,216,0.35)'; rrect(ctx, -420, -300 + (1 - lv) * 260, 840, lv * 260 + 10, [0, 0, 100, 100]); ctx.fill();
    ctx.fillStyle = '#dfe2e5'; ctx.fillRect(-470, -350, 940, 30); ctx.fillStyle = '#b9c0c6'; ctx.fillRect(-380, -420, 24, 80); ctx.fillRect(-400, -430, 70, 20);
    ctx.fillStyle = '#9aa1a8'; for (const k of [-340, 340]) { ctx.fillRect(k - 20, 0, 40, 40); }
    ctx.restore();
  }
}

// The food shelves: o.cans, grain, dry (0..1 each group in), box (0..1 a box put down).
function pantry(ctx, t, o = {}) {
  ctx.fillStyle = '#c9a87a'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#b8966a'; for (let x = 0; x < W; x += 180) ctx.fillRect(x, 0, 8, H);
  ctx.fillStyle = '#6f5238'; ctx.fillRect(40, 760, 1000, 30); ctx.fillRect(40, 1120, 1000, 30); ctx.fillRect(40, 0, 30, 1150); ctx.fillRect(1010, 0, 30, 1150);
  const pop = (k, x, y, draw) => { if (k <= 0) return; const a = outBack(clamp(k)); ctx.save(); ctx.translate(x, y); ctx.scale(a, a); draw(); ctx.restore(); };
  const label = (s, x, y, size, col = '#141414') => { ctx.fillStyle = col; ctx.font = `900 ${size}px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); };
  // tins of stew, stacked
  const can = (x, y, c) => { ctx.fillStyle = '#c8ccd0'; ctx.fillRect(x - 70, y - 120, 140, 120); ctx.fillStyle = c; ctx.fillRect(x - 70, y - 98, 140, 76); ctx.fillStyle = '#e2e5e8'; ell(ctx, x, y - 120, 70, 14); ctx.fill(); label('ТУШЁНКА', x, y - 60, 20, '#fff'); };
  [[150, 760, '#d7342c', 0], [300, 760, '#2e9e4a', .15], [450, 760, '#d7342c', .3], [225, 640, '#e3893b', .45], [375, 640, '#2e9e4a', .6]].forEach(([x, y, c, d]) => pop(((o.cans || 0) - d) * 2.4, x, y, () => can(0, 0, c)));
  // bags of grain
  const bag = (c, s) => { ctx.fillStyle = c; poly(ctx, [[-95, 0], [95, 0], [80, -250], [-80, -250]]); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.15)'; poly(ctx, [[-80, -250], [80, -250], [70, -280], [-70, -280]]); ctx.fill(); ctx.fillStyle = '#fff'; rrect(ctx, -70, -170, 140, 60, 10); ctx.fill(); label(s, 0, -140, 26); };
  [[640, '#c49a62', 'ГРЕЧКА', 0], [840, '#e8e0c8', 'РИС', .25]].forEach(([x, c, s, d]) => pop(((o.grain || 0) - d) * 2.4, x, 760, () => bag(c, s)));
  // dry food on the lower shelf
  const box = (w, h, c, s, ls) => { ctx.fillStyle = c; ctx.fillRect(-w / 2, -h, w, h); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(-w / 2 + 12, -h * .62, w - 24, h * .3); label(s, 0, -h * .47, ls); };
  [[190, () => box(200, 300, '#2f6fd6', 'МАКАРОНЫ', 26), 0], [440, () => box(220, 220, '#e3893b', 'СУХАРИ', 30), .2], [690, () => box(200, 260, '#d4a23a', 'ГАЛЕТЫ', 30), .4], [910, () => box(160, 180, '#8a3830', 'СОЛЬ', 30), .55]].forEach(([x, d, dl]) => pop(((o.dry || 0) - dl) * 2.4, x, 1120, d));
  // the box of food on the floor
  pop(o.box || 0, 540, 1860, () => { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ell(ctx, 0, 6, 300, 22); ctx.fill(); ctx.fillStyle = '#c49a62'; ctx.fillRect(-280, -330, 560, 330); ctx.fillStyle = '#a97f4a'; poly(ctx, [[-280, -330], [-330, -400], [-60, -400], [-20, -330]]); ctx.fill(); poly(ctx, [[280, -330], [330, -400], [60, -400], [20, -330]]); ctx.fill(); label('ЕДА', 0, -170, 84, '#5a3a20'); });
}

// ---------- the light switch ----------

// A switch on the kitchen wall: o.down (0..1 pressed off), finger (0..1 the hand coming in).
function switchClose(ctx, t, o = {}) {
  wallpaper(ctx, 0, 0, W, H, '#d7c79f', 14);
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; rrect(ctx, 352, 452, 400, 520, 40); ctx.fill();
  ctx.fillStyle = '#f4f2ec'; rrect(ctx, 340, 440, 400, 520, 40); ctx.fill();
  const dn = clamp(o.down || 0);
  ctx.fillStyle = '#e4e1d8'; rrect(ctx, 420, 520, 240, 360, 26); ctx.fill();
  ctx.fillStyle = '#fbfaf6'; ctx.save(); ctx.translate(540, 700); ctx.scale(1, 1);
  poly(ctx, [[-110, -170 + dn * 20], [110, -170 + dn * 20], [110, 10 * (1 - dn) - 10 * dn], [-110, 10 * (1 - dn) - 10 * dn]]); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(-110, dn > .5 ? -10 : 10, 220, 160);
  ctx.restore();
  ctx.fillStyle = dn > .5 ? '#9aa1a8' : '#ff8a3a'; ell(ctx, 540, 580, 10, 10); ctx.fill();
  const fk = clamp(o.finger || 0);
  if (fk > 0) {
    const fx = lerp(1300, 600, outc(fk)), fy = lerp(1100, 640 + dn * 60, outc(fk));
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(-.35);
    ctx.fillStyle = SUIT.suit; ctx.fillRect(160, -110, 700, 260); ctx.fillStyle = SUIT.stripe; ctx.fillRect(160, 120, 700, 22);
    ctx.fillStyle = SUIT.skin; ell(ctx, 120, 10, 130, 115); ctx.fill(); rrect(ctx, -60, -40, 180, 64, 32); ctx.fill(); ctx.fillStyle = SUIT.skinD; rrect(ctx, 20, 30, 120, 50, 25); ctx.fill();
    ctx.restore();
  }
}

// ---------- the house at night ----------

// The block from the street at night: most windows dark, a few lit, Nikita's (floor 7) dark behind curtains; fires and
// zombies below. o: lit (seed of which windows burn), mark (0..1 a yellow ring on Nikita's window), draw(ctx) for the street.
function facade(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#0b1020'], [.6, '#2b2130'], [1, '#4a2a2a']]);
  glow(ctx, 540, 1900, 900, 'rgba(255,110,50,1)', .35);
  ctx.fillStyle = '#4a4e58'; ctx.fillRect(110, 60, 860, 1560);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 4; for (let y = 60; y < 1620; y += 170) { ctx.beginPath(); ctx.moveTo(110, y); ctx.lineTo(970, y); ctx.stroke(); }
  const r = rng(o.lit || 3);
  for (let fl = 9; fl >= 1; fl--) for (let c = 0; c < 4; c++) {
    const x = 160 + c * 205, y = 60 + (9 - fl) * 170 + 40, lit = r() < .18, nik = fl === 7 && c === 1;
    ctx.fillStyle = '#d8d4cc'; ctx.fillRect(x - 8, y - 8, 156, 106);
    if (nik) { ctx.fillStyle = '#1a1520'; ctx.fillRect(x, y, 140, 90); ctx.fillStyle = '#5a2a26'; ctx.fillRect(x, y, 140, 90); ctx.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 6; i++) ctx.fillRect(x + 8 + i * 22, y, 10, 90); }
    else if (lit) { const fk = .8 + .2 * Math.sin(t * 2 + x); ctx.fillStyle = `rgba(242,196,106,${fk})`; ctx.fillRect(x, y, 140, 90); glow(ctx, x + 70, y + 45, 120, 'rgba(255,200,110,1)', .2); }
    else { ctx.fillStyle = '#141a2a'; ctx.fillRect(x, y, 140, 90); }
    ctx.fillStyle = '#d8d4cc'; ctx.fillRect(x + 66, y, 8, 90);
    if (nik && o.mark > 0) { ctx.save(); ctx.globalAlpha = clamp(o.mark); ctx.strokeStyle = TSC.y; ctx.lineWidth = 10; ctx.setLineDash([22, 12]); ctx.lineDashOffset = -t * 40; ctx.strokeRect(x - 26, y - 26, 192, 142); ctx.restore(); }
  }
  ctx.fillStyle = '#2a2026'; ctx.fillRect(0, 1620, W, H - 1620); ctx.fillStyle = '#3a2e30'; ctx.fillRect(0, 1620, W, 26);
  [[120, 1720, .9, 1], [880, 1760, 1.1, 2], [520, 1700, .7, 3]].forEach(([x, y, s, sd]) => flame(ctx, t, x, y, s, sd));
  if (o.draw) o.draw(ctx);
}

// ---------- the plan ----------

// Four things to do, ticked off one by one: [door, windows, water, food].
const PLAN = ['ДВЕРЬ', 'ОКНА', 'ВОДА', 'ЕДА'];
function plan(ctx, x, y, done, k = 1, gap = 80, size = 34) {
  if (k <= 0) return;
  PLAN.forEach((s, i) => pill(ctx, x, y + i * gap, `${i + 1}. ${s}`, done[i] ? 'green' : 'dark', clamp(k * 1.6 - i * .15), { icon: done[i] ? 'check' : 'dot', align: 'left', size }));
}

// ---------- helpers for the shots ----------

// Nikita's flat in the block section (floor 7, ceiling at c): the table, the chair, the barricade at the door.
// o: barricade (0..1), dark (0..1), who(ctx, floorY) draws Nikita.
function flat7(ctx, t, c, o = {}) {
  const f = c + FH;
  ctx.fillStyle = '#7a5a3c'; ctx.fillRect(600, f - 190, 10, 170); ctx.fillRect(540, f - 100, 70, 10); ctx.fillRect(544, f - 92, 8, 70);
  ctx.fillStyle = '#6f5238'; ctx.fillRect(390, f - 104, 10, 80); ctx.fillRect(510, f - 104, 10, 80); ctx.fillStyle = '#8a6a48'; ctx.fillRect(376, f - 112, 160, 12);
  ctx.fillStyle = '#eef0f2'; ell(ctx, 430, f - 118, 20, 8); ctx.fill();
  if (o.who) o.who(ctx, f - 26);
  const bk = clamp(o.barricade || 0);
  if (bk > 0) { ctx.save(); ctx.globalAlpha = bk; ctx.fillStyle = '#7d5c3a'; ctx.fillRect(668, f - 250, 80, 224); ctx.fillStyle = '#6b4c30'; ctx.fillRect(664, f - 258, 88, 12); ctx.fillStyle = '#9c7b56'; ctx.fillRect(610, f - 100, 60, 10); ctx.fillStyle = '#c49a62'; ctx.fillRect(616, f - 130, 40, 30); ctx.restore(); }
  if (o.dark > 0) { ctx.fillStyle = `rgba(8,12,26,${.6 * o.dark})`; ctx.fillRect(0, c, 750, FH); }
}

// Arm angles [shoulder, elbow] for guy() so that the right hand reaches (tx, ty) on the canvas. Same body maths as
// guy(); bend = 1 or -1 chooses which way the elbow points.
function reach(x, y, h, p, tx, ty, bend = 1) {
  const s = p.face ?? 1, side = s !== 0, crouch = p.crouch || 0, floor = p.sit === 'floor', lean = p.lean || 0;
  const hip = [p.dx || 0, p.hipY ?? (floor ? -.07 : p.sit ? -.27 : -(2 * .205 + .02) * (1 - crouch * .4))];
  const j = [hip[0] + Math.sin(lean) * .3 + (side ? -.01 * (s || 1) : .088), hip[1] - Math.cos(lean) * .3 + .035];
  const dx = (tx - x) / h - j[0], dy = (ty - y) / h - j[1], L1 = .165, L2 = .167;
  const d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1e-4), ux = dx / Math.hypot(dx, dy), uy = dy / Math.hypot(dx, dy);
  const al = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), as = Math.atan2(dx, dy) + bend * al;
  return [as, Math.atan2(ux * d - Math.sin(as) * L1, uy * d - Math.cos(as) * L1) - as];
}

// A spoon in a hand, pointing at angle a (canvas radians, 0 = right).
function spoon(ctx, hand, a, s = 1) {
  ctx.save(); ctx.translate(hand[0], hand[1]); ctx.rotate(a);
  ctx.fillStyle = '#c3c8cd'; rrect(ctx, -20 * s, -5 * s, 90 * s, 10 * s, 5 * s); ctx.fill(); ell(ctx, 82 * s, 0, 22 * s, 13 * s); ctx.fill();
  ctx.restore();
}

// A bright background with turning rays (character cards).
function rays(ctx, t, bg, ray, cx = 540, cy = 900) {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * .25); ctx.fillStyle = ray;
  for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); poly(ctx, [[0, 0], [-170, -2200], [170, -2200]]); ctx.fill(); }
  ctx.restore();
}

// A pill with a red line struck through it (k = 0..1 how far the line has gone).
function struck(ctx, x, y, text, kind, k0, k) {
  pill(ctx, x, y, text, kind, k0, { size: 40 });
  if (k <= 0) return;
  ctx.font = `900 40px ${MONT}`; const w = ctx.measureText(text).width + 40 * 1.4;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = TSC.r; ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - w / 2 - 20, y + 16); ctx.lineTo(x - w / 2 - 20 + (w + 40) * clamp(k), y + 16 - 32 * clamp(k)); ctx.stroke(); ctx.restore();
}

// A sound word that pops out and fades: text at (x, y), born at time t0.
function sfxWord(ctx, t, t0, text, x, y, size = 70, col = TSC.y, life = 1.1) {
  const a = t - t0; if (a < 0 || a > life) return;
  ctx.save(); ctx.globalAlpha = clamp((life - a) / .3); const k = outBack(clamp(a / .18)); ctx.translate(x, y - a * 40); ctx.scale(k, k);
  outlined(ctx, text, 0, 0, size, col); ctx.restore();
}

// A dashed yellow frame round something to look at (k = 0..1).
function dashRing(ctx, t, x, y, w, h, k) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(k); ctx.strokeStyle = TSC.y; ctx.lineWidth = 12; ctx.setLineDash([26, 16]); ctx.lineDashOffset = -t * 50;
  const a = outBack(clamp(k)), cx = x + w / 2, cy = y + h / 2; ctx.translate(cx, cy); ctx.scale(a, a); rrect(ctx, -w / 2, -h / 2, w, h, 26); ctx.stroke(); ctx.restore();
}
