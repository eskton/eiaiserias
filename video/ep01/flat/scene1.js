// Episode 1, vertical flat cut — scene 1 (0:00–0:59.5): the flat, the knocking, the blood.
// One panel per caption, roughly; panels start at the pause before a script line (C(n), see timing.js).
'use strict';
var XFADE = .18, END = 353.4;

// ---------- shared pieces ----------

function wall(ctx, top = '#1b2232', bottom = '#151b28', floorY = 1150, floor = '#11151f') {
  vgrad(ctx, 0, 0, W, floorY, [[0, top], [1, bottom]]);
  vgrad(ctx, 0, floorY, W, H - floorY, [[0, floor], [1, '#0b0e15']]);
  ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fillRect(0, floorY - 18, W, 18);
}

function lampOff(ctx, x, y) {
  ctx.fillStyle = '#2a2f3a'; ctx.fillRect(x - 2, 0, 4, y - 20);
  ctx.fillStyle = '#4b505a'; ell(ctx, x, y, 26, 26); ctx.fill();
  ctx.fillStyle = '#5c616b'; ell(ctx, x - 7, y - 7, 9, 9); ctx.fill();
}

// Flat wooden door. light: strip under it; open 0..1 swings it toward the hinge (left).
function flatDoor(ctx, x, y, w, h, o = {}) {
  ctx.fillStyle = PAL.frame; ctx.fillRect(x - 26, y - 26, w + 52, h + 26);
  ctx.fillStyle = '#05070b'; ctx.fillRect(x, y, w, h);
  const open = o.open || 0;
  if (open > 0) {
    // the landing behind the door
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    vgrad(ctx, x, y, w, h * .55, [[0, '#8d8471'], [1, '#a2977f']]); vgrad(ctx, x, y + h * .55, w, h * .32, [[0, '#2f6158'], [1, '#2a564f']]);
    ctx.fillStyle = '#3d3a37'; ctx.fillRect(x, y + h * .87, w, h * .13);
    ctx.fillStyle = 'rgba(255,240,210,0.12)'; ctx.fillRect(x, y, w, h);
    ctx.restore();
  }
  const dw = w * (1 - .8 * open);
  ctx.fillStyle = open > 0 ? PAL.doorD : PAL.door; ctx.fillRect(x, y, dw, h);
  ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(x, y, dw, 8);
  ctx.fillStyle = PAL.doorLine;
  for (let k = 1; k < 11; k++) ctx.fillRect(x + 14 * (dw / w), y + k * h / 11, dw - 28 * (dw / w), 3);
  if (open < .02) {
    ctx.fillStyle = '#20242c'; ell(ctx, x + w / 2, y + h * .23, 9, 9); ctx.fill();
    ctx.fillStyle = 'rgba(235,240,255,0.9)'; ell(ctx, x + w / 2, y + h * .23, 3.5, 3.5); ctx.fill();
    ctx.fillStyle = '#c9cbd0'; rrect(ctx, x + w - 92, y + h * .52, 62, 13, 6); ctx.fill();
    ctx.fillStyle = '#9ea2aa'; rrect(ctx, x + w - 44, y + h * .52 + 34, 12, 36, 4); ctx.fill();
  } else { ctx.fillStyle = '#3b2a1e'; ctx.fillRect(x + dw, y - 8 * open, 10 * open, h + 16 * open); }
  const L = o.light ?? 1;
  if (L > 0) {
    ctx.fillStyle = `rgba(244,216,158,${.95 * clamp(L)})`; ctx.fillRect(x + (o.gapL || 0), y + h - 4, w - (o.gapL || 0), 5);
    floorGlow(ctx, x + w / 2, y + h + 6, w * .95, L);
  }
}

function hallway(ctx, t, o = {}) {
  wall(ctx);
  lampOff(ctx, 540, 175);
  // coat on a hook and a shoe rack, like any hallway
  ctx.fillStyle = '#2b3140'; ctx.fillRect(40, 520, 150, 14);
  ctx.fillStyle = '#26476e'; rrect(ctx, 52, 540, 104, 330, 26); ctx.fill(); ctx.fillStyle = '#1f3b5c'; ctx.fillRect(98, 560, 10, 300);
  ctx.fillStyle = '#232835'; ctx.fillRect(830, 1040, 210, 110); ctx.fillStyle = '#1a1e28'; ctx.fillRect(840, 1090, 190, 6);
  for (const sx of [860, 935, 990]) { ctx.fillStyle = '#0d1016'; rrect(ctx, sx, 1060, 40, 22, 9); ctx.fill(); }
  const [sx, sy] = o.shake ? shake(t, o.shake, 5) : [0, 0];
  ctx.save(); ctx.translate(sx, sy * .4);
  flatDoor(ctx, 350, 390, 380, 760, o);
  ctx.restore();
}

// Floating dust shaken out by a knock.
function knockDust(ctx, t, hits, x = 350, y = 1146, w = 380) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [tk, a = 1] of hits) {
    const d = t - tk; if (d < 0 || d > 2) continue;
    const r = rng(Math.round(tk * 100));
    for (let i = 0; i < 22 * a; i++) {
      const px = x + r() * w + (r() - .5) * 60 * d, py = y - r() * 30 - (20 + r() * 50) * d + 30 * d * d;
      ctx.fillStyle = `rgba(255,236,200,${.6 * Math.exp(-d * 1.6)})`; ell(ctx, px, py, 2.2, 2.2); ctx.fill();
    }
  }
  ctx.restore();
}

// Stairwell landing: teal oil paint below, whitewash above, tiled floor.
function landing(ctx, o = {}) {
  const fy = o.floorY || 1180;
  vgrad(ctx, 0, 0, W, 640, [[0, '#7d7563'], [1, '#93896f']]);
  vgrad(ctx, 0, 640, W, fy - 640, [[0, '#2d5f57'], [1, '#26514a']]);
  ctx.fillStyle = '#1f423d'; ctx.fillRect(0, 632, W, 12);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 14; j++) { ctx.fillStyle = (i + j) % 2 ? '#3a2e26' : '#4c4339'; ctx.fillRect(i * 130 - 40, fy + j * 130, 130, 130); }
  vgrad(ctx, 0, fy, W, H - fy, [[0, 'rgba(0,0,0,0.15)'], [1, 'rgba(0,0,0,0.6)']]);
  if (o.door !== false) {
    ctx.fillStyle = '#5a5246'; ctx.fillRect(o.doorX ?? 150, fy - 760, 360, 760);
    ctx.fillStyle = PAL.door; ctx.fillRect((o.doorX ?? 150) + 22, fy - 740, 316, 740);
    ctx.fillStyle = PAL.doorLine; for (let k = 1; k < 10; k++) ctx.fillRect((o.doorX ?? 150) + 34, fy - 740 + k * 74, 292, 3);
    ctx.fillStyle = '#c9cbd0'; rrect(ctx, (o.doorX ?? 150) + 250, fy - 380, 56, 12, 6); ctx.fill();
    ctx.fillStyle = '#d9c9a0'; rrect(ctx, (o.doorX ?? 150) + 145, fy - 690, 70, 40, 8); ctx.fill();
    ctx.fillStyle = '#3a2a10'; ctx.font = '800 26px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('14', (o.doorX ?? 150) + 180, fy - 669);
  }
  if (o.stairs !== false) {
    // railing going down on the right
    ctx.fillStyle = '#16191f'; for (let k = 0; k < 9; k++) ctx.fillRect(700 + k * 46, fy - 330 + k * 24, 8, 330 - k * 10);
    ctx.strokeStyle = '#5a3d2a'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(690, fy - 340); ctx.lineTo(1100, fy - 120); ctx.stroke();
  }
  // a window of cold daylight high on the wall
  if (o.window !== false) {
    ctx.fillStyle = '#4c4a44'; ctx.fillRect(700, 170, 300, 340);
    vgrad(ctx, 715, 185, 270, 310, [[0, '#3a5a84'], [1, '#7f96ad']]);
    ctx.fillStyle = '#4c4a44'; ctx.fillRect(845, 185, 10, 310); ctx.fillRect(715, 320, 270, 10);
  }
}

// A smeared trail of blood along a path, wider toward w1.
function bloodTrail(ctx, pts, w0, w1, seed = 5) {
  const path = spline(pts, 14);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [col, k] of [[PAL.bloodD, 1], [PAL.blood, .6]]) {
    ctx.strokeStyle = col;
    for (let i = 0; i < path.length - 1; i++) {
      if (k < 1 && noise1(i * .3 + 9) < .3) continue;
      ctx.lineWidth = lerp(w0, w1, i / path.length) * k * (.75 + .35 * noise1(i * .21 + (k < 1 ? 5 : 0)));
      ctx.beginPath(); ctx.moveTo(...path[i]); ctx.lineTo(...path[i + 1]); ctx.stroke();
    }
  }
  const r = rng(seed); ctx.fillStyle = PAL.blood;
  for (let i = 0; i < 26; i++) { const [x, y] = path[(r() * path.length) | 0], sz = 3 + r() * 8; ell(ctx, x + (r() - .5) * 120, y + (r() - .5) * 50, sz, sz * .6); ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,190,190,0.45)'; ctx.lineWidth = 3;
  for (let i = 4; i < path.length - 6; i += 14) { ctx.beginPath(); ctx.moveTo(...path[i]); ctx.lineTo(...path[i + 3]); ctx.stroke(); }
}

// ---------- the block of flats ----------

const WIN = []; for (let f = 0; f < 5; f++) for (let k = 0; k < 4; k++) WIN.push([160 + k * 210, 520 + f * 200]);
const LIVE = [1, 6, 8, 11, 14, 17, 19];

function block(ctx, t, lit) {
  vgrad(ctx, 0, 0, W, H, [[0, '#070b14'], [.6, '#121a2b'], [1, '#1a2133']]);
  ctx.fillStyle = '#0e1320'; ctx.fillRect(0, 700, 120, 900); ctx.fillRect(960, 620, 120, 980);
  ctx.fillStyle = '#232a39'; ctx.fillRect(110, 430, 860, 1080);
  ctx.fillStyle = '#1b2130'; ctx.fillRect(110, 430, 860, 24); ctx.fillRect(760, 380, 120, 50);
  WIN.forEach(([x, y], i) => {
    const k = lit(i);
    ctx.fillStyle = '#141925'; ctx.fillRect(x, y, 130, 120);
    if (k > 0) {
      ctx.fillStyle = `rgba(216,185,136,${k})`; ctx.fillRect(x, y, 130, 120);
      glow(ctx, x + 65, y + 60, 160, 'rgba(230,190,120,1)', .18 * k);
    }
    ctx.fillStyle = '#2d3546'; ctx.fillRect(x + 61, y, 8, 120); ctx.fillRect(x, y + 44, 130, 7);
  });
  ctx.fillStyle = '#0c0f16'; ctx.fillRect(470, 1400, 140, 110); ctx.fillStyle = '#1b2130'; ctx.fillRect(440, 1380, 200, 20);
  vgrad(ctx, 0, 1510, W, H - 1510, [[0, '#0d1119'], [1, '#07090d']]);
  // bare trees
  ctx.strokeStyle = '#06080c'; ctx.lineCap = 'round';
  const tree = (px, py, len, ang, w, d, r) => {
    const ex = px + Math.sin(ang) * len, ey = py - Math.cos(ang) * len;
    ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ex, ey); ctx.stroke();
    if (d > 0) for (let i = 0; i < 2; i++) tree(ex, ey, len * (.68 + r() * .15), ang + (i ? 1 : -1) * (.3 + r() * .4), w * .68, d - 1, r);
  };
  tree(60, 1600, 260, .08, 22, 6, rng(4)); tree(1010, 1620, 300, -.1, 24, 6, rng(5));
}

// ---------- shots ----------

const KN1 = [[3.15, 1], [4.35, 1], [5.52, 1], [6.62, .8], [7.25, .8]], KN2 = [[32.15, 1.6]], SLAM = [[50.52, 2.2]];
const tuk = (t, hits) => hits.filter(([k]) => t >= k).length;

SHOTS.push(
  // Я убил его вчера.
  { t0: 0, fadeIn: .5, draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 600, 900, 1.4, 1.32, 760);
    wall(ctx, '#121826', '#0f1420', 1060);
    ctx.fillStyle = PAL.bloodD; ell(ctx, 760, 1080, 130, 20); ctx.fill(); ctx.fillStyle = PAL.blood; ell(ctx, 750, 1076, 80, 11); ctx.fill();
    ctx.save(); ctx.translate(800, 1068); ctx.rotate(-.12); ctx.fillStyle = '#c9ced6'; poly(ctx, [[0, -7], [96, -3], [110, 2], [0, 7]]); ctx.fill(); ctx.fillStyle = PAL.blood; ctx.fillRect(46, -6, 50, 11); ctx.fillStyle = '#1b1d22'; rrect(ctx, -62, -10, 64, 20, 7); ctx.fill(); ctx.restore();
    toon(ctx, 430, 1070, 620, { face: 1, hipY: -.07, lean: -.12, head: [.01, .06], legL: [2.25, -2.15], legR: [2.1, -2.05], armL: [1.3, -1.4], armR: [1.1, -1.3], eyes: 'down' });
    specks(ctx, t, 40, 1, .25); vignette(ctx, .7);
  } },
  // Сегодня утром он постучал в мою дверь.
  { t0: C(2), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1, 1.05);
    hallway(ctx, t, { shake: KN1, light: 1 + .4 * pulse(t, KN1) });
    toon(ctx, 905, 1158, 300, { face: -1, armL: [-.05, 0], armR: [.05, 0] });
    knockDust(ctx, t, KN1); specks(ctx, t, 50, 2);
    headline(ctx, ['', 'ТУК.', 'ТУК. ТУК.', 'ТУК. ТУК. ТУК.'][Math.min(3, tuk(t, KN1))], tuk(t, KN1) ? 1 : 0, 'w', 300);
    vignette(ctx);
  } },
  // Три раза. Медленно.
  { t0: C(3), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.12, 1.2);
    hallway(ctx, t, { shake: KN1, light: 1 + .4 * pulse(t, KN1) });
    knockDust(ctx, t, KN1); specks(ctx, t, 50, 3);
    headline(ctx, ['', 'ТУК.', 'ТУК. ТУК.', 'ТУК. ТУК. ТУК.'][Math.min(3, tuk(t, KN1))], 1, 'w', 300, t > S(4) - .1 ? 'МЕДЛЕННО' : null);
    vignette(ctx);
  } },
  // Я не двигался.
  { t0: C(5), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.06);
    wall(ctx, '#151b29', '#121725', 1500);
    floorGlow(ctx, 540, 1520, 700, .7);
    toon(ctx, 540, 1700, 1180, { eyes: 'wide', armL: [-.04, .02], armR: [.04, -.02], mouth: .15 }, LOOK.hero);
    specks(ctx, t, 50, 4); vignette(ctx, .75);
  } },
  // Снаружи снова раздался стук.
  { t0: C(6), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.05, 1.12);
    hallway(ctx, t, { shake: KN1, light: 1 + .4 * pulse(t, KN1) });
    knockDust(ctx, t, KN1); specks(ctx, t, 50, 5);
    headline(ctx, tuk(t, KN1) >= 5 ? 'ТУК. ТУК.' : 'ТУК.', 1, 'w', 300);
    vignette(ctx);
  } },
  // Я узнал этот звук.
  { t0: C(7), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 560, 1.35, 1.45);
    hallway(ctx, t, {});
    specks(ctx, t, 40, 6);
    tag(ctx, 90, 240, 'ЗНАКОМЫЙ СТУК', appear(lt, .2));
    vignette(ctx);
  } },
  // Так стучал мой сосед.
  { t0: C(8), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 400, 900, 1, 1.05);
    landing(ctx, { stairs: false });
    const k = pulse(t, [[10.9], [11.3]], 10);
    toon(ctx, 640, 1185, 600, { face: -1, armL: [-1.9 - k * .2, -.9], armR: [.05, 0], mouth: .1 }, LOOK.neighbour);
    tint(ctx, '#808080', .75, 'saturation'); tint(ctx, '#e2c49b', .45, 'multiply'); tint(ctx, '#3a2c1c', .35, 'screen');
    specks(ctx, t, 40, 7);
    tag(ctx, 90, 240, 'СОСЕД', appear(lt, .15), '#ffffff', 'КВ. 15 · ВОСПОМИНАНИЕ');
    vignette(ctx);
  } },
  // До того, как он заразился.
  { t0: C(9), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 520, 900, 1.04, 1.12);
    landing(ctx, { stairs: false });
    const tw = (noise1(t * 7) - .5) * 8;
    toon(ctx, 640 + tw, 1185, 590, { face: -1, lean: -.22, head: [-.03, .05], armL: [.25, .2], armR: [-.15, .2], eyes: 'red', mouth: .5 }, Object.assign({}, LOOK.neighbour, { skin: '#a5aa9d', blood: 1 }));
    tint(ctx, '#808080', .6, 'saturation'); tint(ctx, '#5a6a8a', .5, 'multiply'); tint(ctx, '#5a0a0a', .25, 'screen');
    specks(ctx, t, 40, 8);
    tag(ctx, 90, 240, 'ЗАРАЖЁН', appear(lt, .15), PAL.red);
    vignette(ctx, .7);
  } },
  // Я подошёл к двери.
  { t0: C(10), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1, 1.04);
    hallway(ctx, t, {});
    const u = inout(lt / (d - .2)), x = lerp(960, 760, u);
    toon(ctx, x, 1158, 300, walkPose(lt * 7.5, -1, 1 - u * .6, { face: -1 }));
    specks(ctx, t, 50, 9); vignette(ctx);
  } },
  // Но не открыл её.
  { t0: C(11), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 620, 840, 1.9, 2.0);
    hallway(ctx, t, {});
    const reach = outc(lt / .7) - .25 * sstep(.9, 1.2, lt), hx = lerp(860, 735, reach);
    ctx.fillStyle = LOOK.hero.top; rrect(ctx, hx + 40, 850, 260, 70, 30); ctx.fill();
    ctx.fillStyle = LOOK.hero.skin; ell(ctx, hx + 22, 885, 36, 30); ctx.fill();
    ctx.fillStyle = shade(LOOK.hero.skin, -.15); rrect(ctx, hx - 20, 868, 40, 16, 8); ctx.fill(); rrect(ctx, hx - 14, 888, 34, 15, 7); ctx.fill();
    specks(ctx, t, 30, 10); vignette(ctx);
  } },
  // За дверью послышалось хриплое дыхание. Потом тишина.
  { t0: C(12), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 540, 1120, 2.3, 2.45, 860);
    const br = t < 18.75 ? Math.sin((t - 16.45) * 4.2) * 3 : 0;
    hallway(ctx, t, { light: 1.2 });
    // two feet outside cut the strip of light
    ctx.fillStyle = '#05070b';
    for (const fx of [480 + br, 575 + br * .6]) { ctx.fillRect(fx, 1144, 34, 8); ctx.globalAlpha = .55; poly(ctx, [[fx, 1152], [fx + 34, 1152], [fx + 34 + (fx - 540) * .4 + 30, 1260], [fx + (fx - 540) * .4 - 30, 1260]]); ctx.fill(); ctx.globalAlpha = 1; }
    specks(ctx, t, 30, 11);
    tag(ctx, 90, 240, t < C(13) ? 'ХРИПЛОЕ ДЫХАНИЕ' : 'ТИШИНА', 1, t < C(13) ? PAL.red : '#ffffff');
    vignette(ctx);
  } },
  // Я посмотрел на часы. Шесть двенадцать.
  { t0: C(14), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 820, 1, 1.07);
    vgrad(ctx, 0, 0, W, H, [[0, '#0e1320'], [1, '#141a28']]);
    ctx.fillStyle = LOOK.hero.top; rrect(ctx, -60, 700, 1200, 260, 120); ctx.fill();
    ctx.fillStyle = LOOK.hero.topD; ctx.fillRect(-60, 900, 1200, 60);
    ctx.fillStyle = '#2a1e18'; ctx.fillRect(330, 650, 420, 360);
    ctx.fillStyle = '#8f949c'; ell(ctx, 540, 830, 250, 250); ctx.fill();
    ctx.fillStyle = '#efe9dc'; ell(ctx, 540, 830, 222, 222); ctx.fill();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ctx.fillStyle = '#2a2d33'; ctx.save(); ctx.translate(540 + Math.sin(a) * 190, 830 - Math.cos(a) * 190); ctx.rotate(a); ctx.fillRect(-4, -14, 8, 28); ctx.restore(); }
    const hand = (a, len, w, col) => { ctx.save(); ctx.translate(540, 830); ctx.rotate(a); ctx.fillStyle = col; rrect(ctx, -w / 2, -len, w, len + 18, w / 2); ctx.fill(); ctx.restore(); };
    hand((6 + 12 / 60) / 12 * Math.PI * 2, 120, 18, '#22252b'); hand(12 / 60 * Math.PI * 2, 175, 12, '#22252b');
    hand(Math.floor(t) / 60 * Math.PI * 2, 185, 4, PAL.red);
    ctx.fillStyle = '#22252b'; ell(ctx, 540, 830, 14, 14); ctx.fill();
    headline(ctx, '06:12', appear(t, S(15) - .05), PAL.red, 330, null, 150);
    specks(ctx, t, 30, 12); vignette(ctx);
  } },
  // В городе уже четвертый день не было электричества. И почти никого не осталось.
  { t0: C(16), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.08);
    vgrad(ctx, 0, 0, W, H, [[0, '#060a12'], [.55, '#121b2c'], [.75, '#253046'], [1, '#0d111a']]);
    const r = rng(21), lights = [];
    for (let layer = 0; layer < 3; layer++) {
      let x = -40;
      while (x < W) {
        const bw = 90 + r() * 150, bh = [620, 460, 300][layer] + r() * [420, 300, 200][layer], top = [1300, 1450, 1600][layer] - bh;
        ctx.fillStyle = ['#1a2232', '#121826', '#0b0f18'][layer]; ctx.fillRect(x, top, bw, H);
        for (let wy = top + 30; wy < H; wy += 44) for (let wx = x + 16; wx < x + bw - 20; wx += 34) {
          ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(wx, wy, 16, 22);
          if (r() < .012) lights.push([wx, wy, layer]);
        }
        x += bw + r() * 30;
      }
    }
    lights.forEach(([wx, wy], i) => { const k = i % 2 && t > 27.0 + (i % 5) * .2 ? 0 : 1; if (k) { ctx.fillStyle = PAL.winWarm; ctx.fillRect(wx, wy, 16, 22); glow(ctx, wx + 8, wy + 11, 40, 'rgba(230,190,120,1)', .3); } });
    tag(ctx, 90, 240, '4-Й ДЕНЬ БЕЗ СВЕТА', appear(lt, .2), PAL.yellow);
    specks(ctx, t, 40, 13); vignette(ctx);
  } },
  // Я взял рюкзак.
  { t0: C(18), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 820, 1, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#2a2019'], [1, '#1d1611']]);
    for (let k = 0; k < 7; k++) { ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, k * 290 + 140, W, 5); }
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; rrect(ctx, 290, 480, 540, 700, [150, 150, 50, 50]); ctx.fill();
    ctx.fillStyle = LOOK.hero.pack; rrect(ctx, 270, 450, 540, 700, [150, 150, 50, 50]); ctx.fill();
    ctx.fillStyle = shade(LOOK.hero.pack, -.15); rrect(ctx, 320, 820, 440, 290, 40); ctx.fill();
    ctx.fillStyle = shade(LOOK.hero.pack, .1); rrect(ctx, 300, 470, 480, 300, [130, 130, 30, 30]); ctx.fill();
    ctx.fillStyle = shade(LOOK.hero.pack, -.3); for (const sx of [400, 640]) ctx.fillRect(sx, 520, 36, 380);
    ctx.fillStyle = '#9aa0a6'; for (const sx of [396, 636]) ctx.fillRect(sx, 860, 44, 24);
    ctx.strokeStyle = shade(LOOK.hero.pack, -.35); ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(540, 450, 70, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    specks(ctx, t, 30, 14); vignette(ctx);
  } },
  // Проверил нож.
  { t0: C(19), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 820, 1, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#2a2019'], [1, '#1d1611']]);
    for (let k = 0; k < 7; k++) { ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, k * 290 + 140, W, 5); }
    ctx.save(); ctx.translate(540, 820); ctx.rotate(-.6);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.translate(16, 20);
    poly(ctx, [[-60, -40], [380, -30], [470, 0], [380, 36], [-60, 36]]); ctx.fill(); ctx.translate(-16, -20);
    const blade = () => poly(ctx, [[-60, -40], [380, -30], [470, 0], [380, 36], [-60, 36]]);
    blade(); ctx.fillStyle = '#c5cad2'; ctx.fill();
    ctx.fillStyle = '#e4e8ee'; poly(ctx, [[-60, -40], [380, -30], [470, 0], [-60, -6]]); ctx.fill();
    ctx.save(); blade(); ctx.clip();
    const gx = lerp(-200, 600, clamp((lt - .2) / .9)); const g = ctx.createLinearGradient(gx - 60, 0, gx + 60, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(-80, -50, 600, 100);
    ctx.restore();
    ctx.fillStyle = '#4a4d54'; rrect(ctx, -86, -66, 30, 132, 8); ctx.fill();
    ctx.fillStyle = '#1d1f24'; rrect(ctx, -360, -38, 280, 76, 30); ctx.fill();
    ctx.fillStyle = '#6a5a40'; for (const rx of [-300, -220, -140]) { ell(ctx, rx, 0, 9, 9); ctx.fill(); }
    ctx.restore();
    specks(ctx, t, 30, 15); vignette(ctx);
  } },
  // Проверил фонарик.
  { t0: C(20), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 820, 1, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#2a2019'], [1, '#1d1611']]);
    for (let k = 0; k < 7; k++) { ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, k * 290 + 140, W, 5); }
    const on = t > S(20) + .55;
    if (on) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(540, 900, 540, 0); g.addColorStop(0, 'rgba(255,240,200,0.45)'); g.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.fillStyle = g; poly(ctx, [[480, 640], [600, 640], [1000, -50], [80, -50]]); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; rrect(ctx, 482, 700, 116, 560, 30); ctx.fill();
    ctx.fillStyle = '#2b2e35'; rrect(ctx, 470, 680, 116, 560, 30); ctx.fill();
    ctx.fillStyle = '#3a3e46'; poly(ctx, [[460, 690], [596, 690], [620, 600], [436, 600]]); ctx.fill();
    ctx.fillStyle = on ? '#fff6dc' : '#6c707a'; rrect(ctx, 440, 588, 176, 22, 10); ctx.fill();
    if (on) glow(ctx, 528, 600, 160, 'rgba(255,244,214,1)', .8);
    ctx.fillStyle = '#1e2026'; for (let k = 0; k < 9; k++) ctx.fillRect(476, 880 + k * 26, 104, 10);
    ctx.fillStyle = '#8a3a30'; rrect(ctx, 506, 770, 44, 60, 10); ctx.fill();
    specks(ctx, t, 30, 16); vignette(ctx);
  } },
  // Потом снова услышал стук. На этот раз всего один раз.
  { t0: C(21), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1.02, 1.1);
    hallway(ctx, t, { shake: KN2, light: 1 + .5 * pulse(t, KN2) });
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const jx = (noise1(t * 1.3) - .5) * 30, jy = (noise1(t * 1.1 + 5) - .5) * 20;
    glow(ctx, 540 + jx, 760 + jy, 240, 'rgba(255,236,190,1)', .45);
    const g = ctx.createLinearGradient(1080, 1700, 540, 760); g.addColorStop(0, 'rgba(255,240,200,0.25)'); g.addColorStop(1, 'rgba(255,240,200,0.03)');
    ctx.fillStyle = g; poly(ctx, [[1020, 1760], [1100, 1700], [700 + jx, 560 + jy], [380 + jx, 960 + jy]]); ctx.fill(); ctx.restore();
    knockDust(ctx, t, KN2); specks(ctx, t, 50, 17);
    headline(ctx, 'ТУК.', 1, 'w', 300);
    tag(ctx, 90, 420, 'ОДИН РАЗ', appear(t, S(22)), PAL.yellow);
    vignette(ctx);
  } },
  // Я посмотрел в глазок.
  { t0: C(23), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 560, 700, 1.5, 1.6);
    hallway(ctx, t, {});
    toon(ctx, 660, 1158, 620, { face: -1, lean: -.12, armL: [-1.2, -.6], armR: [.1, .1] });
    specks(ctx, t, 30, 18); vignette(ctx);
  } },
  // Коридор был пуст.
  { t0: C(24), draw(ctx, lt, d, t) {
    ctx.fillStyle = '#020305'; ctx.fillRect(0, 0, W, H);
    const R = 400 + lt * 6, cx = 540 + (noise1(t * .7) - .5) * 10, cy = 760;
    ctx.save(); ell(ctx, cx, cy, R, R); ctx.clip();
    ctx.translate(cx, cy); ctx.scale(.62, .62); ctx.translate(-540, -900);
    landing(ctx, { door: false });
    ctx.restore();
    ctx.save(); ell(ctx, cx, cy, R, R); ctx.clip();
    const vg = ctx.createRadialGradient(cx, cy, R * .55, cx, cy, R); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = vg; ctx.fillRect(cx - R, cy - R, R * 2, R * 2); ctx.restore();
    ctx.strokeStyle = '#11151d'; ctx.lineWidth = 16; ell(ctx, cx, cy, R, R); ctx.stroke();
    tag(ctx, 90, 240, 'ПУСТО', appear(lt, .2));
    specks(ctx, t, 30, 19);
  } },
  // Я открыл дверь.
  { t0: C(25), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1, 1.06);
    const open = outc((lt - .1) / .8);
    hallway(ctx, t, { open, light: 1 + 2 * open });
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ctx, 540, 1150, 700, 'rgba(255,240,210,1)', .18 * open); ctx.restore();
    specks(ctx, t, 50, 20); vignette(ctx);
  } },
  // На полу лежала кровь. Свежая.
  { t0: C(26), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 540, 1250, 1.0, 1.08, 820);
    landing(ctx, { floorY: 900 });
    bloodTrail(ctx, [[200, 1900], [330, 1700], [420, 1540], [560, 1400], [700, 1290], [840, 1200], [980, 1120]], 70, 34);
    tag(ctx, 90, 240, 'СВЕЖАЯ', appear(t, S(27) - .05), PAL.red);
    specks(ctx, t, 40, 21); vignette(ctx);
  } },
  // Она тянулась по коридору к лестнице.
  { t0: C(28), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 760, 1000, 1.0, 1.1);
    landing(ctx, { door: false, floorY: 1180 });
    bloodTrail(ctx, [[-40, 1600], [200, 1420], [430, 1330], [620, 1260], [780, 1200], [900, 1170]], 48, 26, 7);
    tag(ctx, 90, 240, 'К ЛЕСТНИЦЕ', appear(lt, .25));
    specks(ctx, t, 40, 22); vignette(ctx);
  } },
  // Я присел и коснулся её пальцем.
  { t0: C(29), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 540, 1050, 1.0, 1.06, 860);
    landing(ctx, { door: false, stairs: false, floorY: 1200 });
    ctx.fillStyle = PAL.bloodD; ell(ctx, 380, 1290, 150, 26); ctx.fill(); ctx.fillStyle = PAL.blood; ell(ctx, 370, 1286, 100, 16); ctx.fill();
    const down = outc(lt / .9);
    toon(ctx, 620, 1300, 640, { face: -1, crouch: .9 * down, lean: -.35 * down, armL: [-.4 - .5 * down, -.2], armR: [.2, .3], legL: [-.9 * down, 1.5 * down], legR: [-.5 * down, 1.3 * down] });
    specks(ctx, t, 40, 23); vignette(ctx);
  } },
  // Она была ещё тёплой.
  { t0: C(30), draw(ctx, lt, d, t) {
    cam(ctx, lt, d, 540, 1000, 1, 1.07, 760);
    vgrad(ctx, 0, 0, W, H, [[0, '#2c2620'], [1, '#1f1a16']]);
    for (let i = 0; i < 5; i++) for (let j = 0; j < 12; j++) { ctx.fillStyle = (i + j) % 2 ? '#3a2e26' : '#4a4137'; ctx.fillRect(i * 240 - 60, j * 240 - 240, 236, 236); }
    ctx.fillStyle = PAL.bloodD; ell(ctx, 520, 1180, 330, 120); ctx.fill(); ctx.fillStyle = PAL.blood; ell(ctx, 500, 1170, 250, 80); ctx.fill();
    ctx.fillStyle = 'rgba(255,210,210,0.4)'; ell(ctx, 420, 1140, 60, 12); ctx.fill();
    // a hand coming down, index finger red at the tip
    ctx.save(); ctx.translate(660, 640); ctx.rotate(.5);
    ctx.fillStyle = LOOK.hero.top; rrect(ctx, -110, -560, 230, 420, 60); ctx.fill();
    ctx.fillStyle = LOOK.hero.skin; rrect(ctx, -95, -170, 200, 230, 70); ctx.fill();
    rrect(ctx, -60, 20, 54, 330, 27); ctx.fill();
    ctx.fillStyle = shade(LOOK.hero.skin, -.12); for (const fx of [5, 52]) { rrect(ctx, fx, 0, 48, 120, 24); ctx.fill(); }
    ctx.fillStyle = PAL.blood; rrect(ctx, -60, 270, 54, 80, 27); ctx.fill();
    ctx.restore();
    tag(ctx, 90, 240, 'ЕЩЁ ТЁПЛАЯ', appear(lt, .25), PAL.red);
    specks(ctx, t, 30, 24); vignette(ctx);
  } },
  // Я сразу закрыл дверь.
  { t0: C(31), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1.04, 1.0);
    const open = 1 - inc((t - 50.15) / .37);
    hallway(ctx, t, { open: clamp(open), shake: SLAM, light: 1 + 2 * clamp(open) + pulse(t, SLAM) });
    knockDust(ctx, t, SLAM); specks(ctx, t, 50, 25);
    vignette(ctx);
  } },
  // В нашем доме оставалось семь квартир.
  { t0: C(32), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 960, 1.04, 1.0);
    block(ctx, t, i => LIVE.includes(i) ? .9 * flicker(t, .15, 3, i) : 0);
    headline(ctx, '7 КВАРТИР', appear(t, S(33) - 1.1), PAL.yellow, 250);
    specks(ctx, t, 40, 26); vignette(ctx);
  } },
  // Три дня назад их было двадцать.
  { t0: C(33), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 960, 1, 1.04);
    block(ctx, t, i => .9);
    tint(ctx, '#d8b98a', .18, 'multiply');
    headline(ctx, '20', appear(t, S(33) + .9), PAL.yellow, 250, '3 ДНЯ НАЗАД', 140);
    specks(ctx, t, 40, 27); vignette(ctx);
  } },
  // Я не знал, кто ещё жив. И не хотел это проверять.
  { t0: C(34), fadeOut: .45, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 960, 1.04, .94);
    block(ctx, t, i => LIVE.includes(i) ? .9 * (1 - .6 * sstep(57.8, 59.3, t)) * flicker(t, .15, 3, i) : 0);
    tag(ctx, 90, 240, 'КТО ЕЩЁ ЖИВ?', appear(lt, .3));
    specks(ctx, t, 40, 28); vignette(ctx);
  } },
);

window.OVERLAY = (ctx, t) => captions(ctx, t);
