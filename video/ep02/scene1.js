// Episode 2 "The island", vertical flat cut — shared art and scene 1 (0:00–0:48.8): the hook, the crash, rule one.
// Panels start at the pause before a script line (C(n)); Wd(n, 'слово') is the moment a word is spoken.
'use strict';
var XFADE = .2, END = 192.6;
window.OVERLAY = (ctx, t) => captions(ctx, t);

Object.assign(LOOK, {
  anton: { skin: '#dcae8e', hair: '#3a2a1f', top: '#c7d3dc', topD: '#a7b5c0', legs: '#4a5466', shoes: '#2a2b30' },
  girl: { skin: '#e7c6b0', hair: '#231915', top: '#8d726b', topD: '#765d57', legs: '#6d5852', shoes: '#3a2f2b', long: 1 },
  pilot: { skin: '#d8b49a', hair: '#2b2622', top: '#2d3e5c', topD: '#24324b', legs: '#1f2738', shoes: '#111' },
  zombie: { skin: '#9ba491', hair: '#2a2a28', top: '#5b6656', topD: '#4a5446', legs: '#3a3f48', shoes: '#1a1b1e', blood: 1 },
});
const ANTON = LOOK.anton, GIRL = LOOK.girl;

// ---------- the island ----------

const TOD = {
  day: { sky: [[0, '#6fb0dc'], [1, '#d4ecf4']], sea: ['#2c79ad', '#3f95c6'], wave: 'rgba(225,245,255,0.55)', sand: ['#e3cb96', '#cdb17a'], palm: ['#6e5236', '#2f7048'], tint: null },
  dusk: { sky: [[0, '#2c2a5c'], [.55, '#d8695a'], [1, '#f5b55e']], sea: ['#3e4778', '#6a5a7e'], wave: 'rgba(255,200,150,0.5)', sand: ['#b88f6a', '#9c7655'], palm: ['#2a1e22', '#241c24'], tint: null },
  night: { sky: [[0, '#050a18'], [1, '#17233f']], sea: ['#0d1a31', '#13233f'], wave: 'rgba(170,190,230,0.35)', sand: ['#3c4155', '#2c3042'], palm: ['#0b0e17', '#0d1320'], tint: null },
};

function palm(ctx, t, x, y, h, lean, seed, col) {
  const sway = Math.sin(t * 1.2 + seed) * .035, n = 12;
  let px = x, py = y;
  for (let i = 0; i < n; i++) {
    const u = i / n, a = (lean + sway * u) * u * 1.7, nx = px + Math.sin(a) * h / n, ny = py - Math.cos(a) * h / n;
    const w0 = lerp(26, 14, u) * h / 700, w1 = lerp(26, 14, u + 1 / n) * h / 700;
    ctx.fillStyle = i % 2 ? col[0] : shade(col[0], -.12);
    poly(ctx, [[px - w0, py], [px + w0, py], [nx + w1, ny + 2], [nx - w1, ny + 2]]); ctx.fill();
    px = nx; py = ny;
  }
  ctx.fillStyle = col[1];
  for (let k = 0; k < 7; k++) {
    const a = -Math.PI / 2 + (k - 3) * .5 + Math.sin(t * 1.7 + seed + k) * .06, L = h * .42;
    const tx = px + Math.cos(a) * L, ty = py + Math.sin(a) * L * .55 + L * .32;
    const nx = -Math.sin(a), ny = Math.cos(a), mx = (px + tx) / 2, my = (py + ty) / 2 - L * .18;
    ctx.beginPath(); ctx.moveTo(px, py);
    ctx.quadraticCurveTo(mx + nx * L * .12, my + ny * L * .12, tx, ty);
    ctx.quadraticCurveTo(mx - nx * L * .08, my - ny * L * .08 + L * .06, px, py); ctx.fill();
  }
  ctx.fillStyle = '#4a3420'; for (const k of [-1, 0, 1]) { ell(ctx, px + k * h * .025, py + h * .03, h * .022, h * .022); ctx.fill(); }
}

// Sky, sea with moving waves, beach. o: tod, hz (horizon y), shore (beach y), sun [x, y], moon [x, y], palms, extra(ctx).
function island(ctx, t, o = {}) {
  const P = TOD[o.tod || 'day'], hz = o.hz ?? 860, shore = o.shore ?? 1280;
  vgrad(ctx, 0, 0, W, hz, P.sky);
  if (o.tod === 'night') {
    const r = rng(3); for (let i = 0; i < 70; i++) { const x = r() * W, y = r() * hz * .9, a = .3 + .7 * Math.abs(Math.sin(t * (.5 + r()) + i)); ctx.fillStyle = `rgba(230,235,255,${a * .8})`; ell(ctx, x, y, 1.6, 1.6); ctx.fill(); }
    const [mx, my] = o.moon || [800, 300]; glow(ctx, mx, my, 220, 'rgba(220,230,255,1)', .25); ctx.fillStyle = '#ece8d8'; ell(ctx, mx, my, 58, 58); ctx.fill();
  }
  if (o.sun) { const [sx, sy] = o.sun; glow(ctx, sx, sy, 420, 'rgba(255,200,120,1)', .45); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, hz); ctx.clip(); ctx.fillStyle = '#ffd98a'; ell(ctx, sx, sy, 95, 95); ctx.fill(); ctx.restore(); }
  if (o.clouds !== false) { ctx.fillStyle = o.tod === 'night' ? 'rgba(40,50,80,0.5)' : o.tod === 'dusk' ? 'rgba(120,70,90,0.45)' : 'rgba(255,255,255,0.55)'; for (const [cx, cy, s] of [[200, 260, 1], [760, 160, .8], [520, 420, .6]]) { const x = ((cx + t * 8 * s) % (W + 400)) - 200; for (const [dx, dy, r] of [[0, 0, 60], [60, -20, 70], [130, 0, 55], [65, 15, 60]]) { ell(ctx, x + dx * s, cy + dy * s, r * s, r * s * .7); ctx.fill(); } } }
  vgrad(ctx, 0, hz, W, shore - hz + 60, [[0, P.sea[0]], [1, P.sea[1]]]);
  if (o.sun) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 14; k++) { const y = hz + 10 + k * 24, w = 160 - k * 6 + Math.sin(t * 3 + k) * 20; ctx.fillStyle = 'rgba(255,190,110,0.25)'; ctx.fillRect(o.sun[0] - w / 2, y, w, 5); } ctx.restore(); }
  if (o.tod === 'night') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 14; k++) { const y = hz + 10 + k * 26, w = 90 - k * 3 + Math.sin(t * 2.5 + k) * 16; ctx.fillStyle = 'rgba(200,215,255,0.18)'; ctx.fillRect((o.moon || [800])[0] - w / 2, y, w, 4); } ctx.restore(); }
  ctx.strokeStyle = P.wave; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let k = 0; k < 10; k++) {
    const y = hz + 30 + k * ((shore - hz) / 10), ph = t * (.6 + k * .05) + k;
    for (let j = -1; j < 5; j++) { const x = ((j * 300 + ph * 60) % 1500 + 1500) % 1500 - 200; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 40, y - 8, x + 80, y); ctx.stroke(); }
  }
  // the beach with a foam line that comes and goes
  const sw = Math.sin(t * .8) * 18;
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.moveTo(0, shore + sw - 14);
  for (let x = 0; x <= W; x += 60) ctx.lineTo(x, shore + sw - 14 + Math.sin(x * .02 + t * 2) * 8);
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  vgrad(ctx, 0, shore + sw, W, H - shore, [[0, P.sand[0]], [1, P.sand[1]]]);
  ctx.save(); ctx.beginPath(); ctx.rect(0, shore + sw, W, H); ctx.clip();
  ctx.fillStyle = 'rgba(0,0,0,0.06)'; const r = rng(9); for (let i = 0; i < 60; i++) { ell(ctx, r() * W, shore + 30 + r() * 700, 3 + r() * 6, 2); ctx.fill(); }
  ctx.restore();
  for (const [px, py, ph, ln, sd] of (o.palms || [[110, 1420, 820, .25, 1], [960, 1380, 700, -.22, 2]])) palm(ctx, t, px, py, ph, ln, sd, P.palm);
  if (o.extra) o.extra(ctx);
}

// Someone lying on their back, seen from the side: head at (x, y), feet to the right, s = body length.
// o.up 0..1 sits them up (the upper body turns around the hip), o.eyes 'open' or closed.
function lying(ctx, t, x, y, s, L, o = {}) {
  const br = Math.sin(t * 1.6) * .006, U = (u, v) => [x + u * s, y + v * s];
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ell(ctx, ...U(.45, .01), .55 * s, .035 * s); ctx.fill();
  // legs, one knee raised
  ctx.strokeStyle = shade(L.legs, -.15); ctx.lineWidth = .075 * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(...U(.48, -.045)); ctx.lineTo(...U(.92, -.04)); ctx.stroke();
  ctx.strokeStyle = L.legs; ctx.beginPath(); ctx.moveTo(...U(.48, -.05)); ctx.lineTo(...U(.68, -.2)); ctx.lineTo(...U(.86, -.04)); ctx.stroke();
  ctx.fillStyle = L.shoes; for (const [u, v] of [[.9, -.11], [.94, -.1]]) { rrect(ctx, ...U(u, v), .045 * s, .1 * s, .015 * s); ctx.fill(); }
  // upper body: torso, arm, head, turning up around the hip
  const hp = U(.5, -.05), up = o.up || 0;
  ctx.save(); ctx.translate(...hp); ctx.rotate(up * 1.15); ctx.translate(-hp[0], -hp[1]);
  ctx.fillStyle = L.top; rrect(ctx, ...U(.1, -.13 - br), .42 * s, (.13 + br) * s, .055 * s); ctx.fill();
  ctx.fillStyle = L.topD; rrect(ctx, ...U(.1, -.05), .42 * s, .05 * s, .025 * s); ctx.fill();
  // the arm: folded under the head while lying, sliding down to prop them up on the sand as they sit up
  const a = up * 1.15, rot = ([u, v]) => { const [px, py] = U(u, v), dx = px - hp[0], dy = py - hp[1]; return [hp[0] + dx * Math.cos(a) - dy * Math.sin(a), hp[1] + dx * Math.sin(a) + dy * Math.cos(a)]; };
  const k = sstep(.15, .7, up), arm = [[.14, -.09], [.02, -.2], [-.07, -.08]].map((q, i) => { const lie = rot(q), prop = [null, U(.27, -.2), U(.22, -.01)][i]; return i ? [lerp(lie[0], prop[0], k), lerp(lie[1], prop[1], k)] : rot(q); });
  ctx.save(); ctx.translate(...hp); ctx.rotate(-a); ctx.translate(-hp[0], -hp[1]);
  ctx.strokeStyle = L.topD; ctx.lineWidth = .06 * s; ctx.beginPath(); arm.forEach((q, i) => i ? ctx.lineTo(...q) : ctx.moveTo(...q)); ctx.stroke();
  ctx.fillStyle = L.skin; ell(ctx, arm[2][0], arm[2][1] + .01 * s, .03 * s, .03 * s); ctx.fill();
  ctx.restore();
  // head facing up
  ctx.fillStyle = shade(L.skin, -.05); rrect(ctx, ...U(.06, -.1), .06 * s, .05 * s, .02 * s); ctx.fill();
  ctx.fillStyle = L.skin; ell(ctx, ...U(0, -.08), .075 * s, .07 * s); ctx.fill(); ell(ctx, ...U(-.005, -.15), .016 * s, .014 * s); ctx.fill();
  ctx.fillStyle = L.hair; ctx.beginPath(); ctx.ellipse(...U(-.01, -.07), .078 * s, .072 * s, 0, Math.PI * .55, Math.PI * 1.25); ctx.fill();
  if (o.eyes === 'open') { ctx.fillStyle = '#1b1b1f'; ell(ctx, ...U(.025, -.112), .011 * s, .011 * s); ctx.fill(); }
  else { ctx.strokeStyle = shade(L.skin, -.45); ctx.lineWidth = .007 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(...U(.02, -.115), .016 * s, Math.PI * .1, Math.PI * .9); ctx.stroke(); }
  if (o.mouth) { ctx.fillStyle = '#5a2a26'; ell(ctx, ...U(.05, -.12), .01 * s, .008 * s); ctx.fill(); }
  ctx.restore(); ctx.restore();
}

// Pieces of the plane on the sand, smoking.
function wreck(ctx, t, x, y, s = 1, smokeOn = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (smokeOn) { smoke2(ctx, t, -60, -120, 1); smoke2(ctx, t, 220, -60, 2); }
  ctx.fillStyle = '#c9cdd3'; poly(ctx, [[-300, 0], [120, 0], [160, -60], [140, -150], [-260, -150], [-320, -80]]); ctx.fill();
  ctx.fillStyle = '#a9aeb6'; poly(ctx, [[-300, 0], [120, 0], [140, -40], [-320, -40]]); ctx.fill();
  ctx.fillStyle = '#2d3a4f'; for (let k = 0; k < 6; k++) rrect(ctx, -240 + k * 58, -120, 30, 38, 10), ctx.fill();
  ctx.fillStyle = '#c0392b'; ctx.fillRect(-300, -70, 440, 10);
  ctx.fillStyle = '#3a3d44'; poly(ctx, [[120, 0], [160, -60], [140, -150], [180, -120], [190, -40], [170, 10]]); ctx.fill();
  ctx.fillStyle = '#b5bac2'; poly(ctx, [[200, 20], [480, -10], [500, 10], [230, 50]]); ctx.fill();
  ctx.fillStyle = '#8e939b'; poly(ctx, [[-420, 30], [-360, -160], [-330, -160], [-350, 30]]); ctx.fill();
  ctx.fillStyle = '#6b4a2e'; rrect(ctx, 300, -40, 90, 60, 8); ctx.fill(); ctx.fillStyle = '#2b3d6b'; rrect(ctx, -460, -30, 70, 50, 8); ctx.fill();
  for (const [fx, fy] of [[140, -60], [-20, -10]]) { glow(ctx, fx, fy, 70, 'rgba(255,140,50,1)', .6 * flicker(t, .4, 7, fx)); ctx.fillStyle = '#ffb347'; poly(ctx, [[fx - 18, fy + 10], [fx, fy - 40 - Math.sin(t * 9 + fx) * 10], [fx + 18, fy + 10]]); ctx.fill(); }
  ctx.restore();
}
function smoke2(ctx, t, x, y, seed) {
  for (let i = 0; i < 18; i++) { const ph = (t * .05 + i / 18) % 1; glow(ctx, x + ph * 160 + Math.sin(t + i) * 10, y - ph * 700, 40 + ph * 160, 'rgba(70,70,76,1)', .35 * Math.sin(Math.PI * Math.min(1, ph * 1.2)), 'source-over'); }
}

// ---------- cards and close-ups ----------

// Full-screen rule card with a big number; red for the rule that matters.
function ruleCard(ctx, lt, t, n, topic, red) {
  vgrad(ctx, 0, 0, W, H, [[0, '#0e1322'], [1, '#05070d']]);
  const k = outBack(clamp(lt / .4)), col = red ? PAL.red : PAL.yellow;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + t * .2; ctx.fillStyle = red ? 'rgba(232,70,60,0.05)' : 'rgba(245,200,76,0.05)'; poly(ctx, [[540, 760], [540 + Math.cos(a) * 1400, 760 + Math.sin(a) * 1400], [540 + Math.cos(a + .13) * 1400, 760 + Math.sin(a + .13) * 1400]]); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = col; ell(ctx, 540, 760, 230 * k, 230 * k); ctx.fill();
  ctx.fillStyle = '#0c0f16'; ctx.font = `900 ${Math.round(300 * k)}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), 540, 775);
  headline(ctx, 'ПРАВИЛО', appear(lt, .05), 'w', 380, null, 110);
  if (topic) headline(ctx, topic, appear(lt, .35), red ? 'r' : 'y', 1080, null, 70);
  specks(ctx, t, 40, 90 + n, .3);
}

// Close-up of the right forearm and hand. o: swell, twitch, stick, wrap, loose, watch (0 off .. 1 on), cold, up, cross.
function wrist(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#d9c194'], [1, '#c3a675']]);
  const r = rng(4); ctx.fillStyle = 'rgba(0,0,0,0.05)'; for (let i = 0; i < 90; i++) { ell(ctx, r() * W, r() * H, 3 + r() * 5, 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; rrect(ctx, -60, 860, 1000, 210, 100); ctx.fill();
  const sk = ANTON.skin, tw = (o.twitch || 0) * Math.sin(t * 14) * .06;
  // sleeve and forearm
  ctx.fillStyle = sk; rrect(ctx, -60, 780, 760, 200, 90); ctx.fill();
  ctx.fillStyle = ANTON.top; poly(ctx, [[-60, 760], [240, 760], [270, 800], [230, 840], [260, 900], [240, 1000], [-60, 1000]]); ctx.fill();
  // hand: palm and fingers
  ctx.fillStyle = sk; rrect(ctx, 640, 775, 240, 200, 70); ctx.fill();
  for (let k = 0; k < 4; k++) {
    ctx.save(); ctx.translate(840, 805 + k * 48); ctx.rotate(tw * (k % 2 ? 1 : -1) + (o.curl || 0) * (1 + k * .3));
    const len = [205, 220, 205, 170][k];
    ctx.fillStyle = shade(sk, -.22); rrect(ctx, -10, -22, len + 4, 46, 23); ctx.fill();
    ctx.fillStyle = shade(sk, -.04 * k); rrect(ctx, -10, -20, len, 40, 20); ctx.fill();
    ctx.fillStyle = shade(sk, -.12); ctx.fillRect(len * .45, -18, 4, 36); ctx.fillStyle = 'rgba(255,240,230,0.5)'; rrect(ctx, len - 34, -14, 24, 20, 8); ctx.fill();
    ctx.restore();
  }
  ctx.save(); ctx.translate(700, 790); ctx.rotate(-.55); ctx.fillStyle = shade(sk, -.2); rrect(ctx, -4, -26, 168, 52, 26); ctx.fill(); ctx.fillStyle = shade(sk, -.06); rrect(ctx, -4, -24, 164, 46, 23); ctx.fill(); ctx.restore();
  if (o.blue) { ctx.save(); ctx.globalAlpha = o.blue; ctx.fillStyle = '#7d8fc9'; ctx.fillRect(850, 780, 230, 200); ctx.restore(); }
  if (o.swell) { ctx.save(); ctx.globalAlpha = o.swell; const g = ctx.createRadialGradient(660, 880, 20, 660, 880, 200); g.addColorStop(0, 'rgba(150,60,110,0.75)'); g.addColorStop(1, 'rgba(150,60,110,0)'); ctx.fillStyle = g; ctx.fillRect(400, 700, 500, 360); ell(ctx, 660, 880, 150 * (1 + .15 * o.swell), 130 * (1 + .15 * o.swell)); ctx.fill(); ctx.restore(); }
  if (o.watch > 0) {
    const off = (1 - o.watch) * 420;
    ctx.save(); ctx.globalAlpha = clamp(o.watch * 1.5); ctx.translate(520 + off, 880);
    ctx.fillStyle = '#2a2b30'; rrect(ctx, -40, -120, 80, 240, 14); ctx.fill();
    ctx.fillStyle = '#d9dde3'; ell(ctx, 0, 0, 70, 70); ctx.fill(); ctx.fillStyle = '#20232a'; ell(ctx, 0, 0, 58, 58); ctx.fill();
    ctx.strokeStyle = '#e9edf2'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -40); ctx.moveTo(0, 0); ctx.lineTo(28, 10); ctx.stroke();
    ctx.restore();
  }
  if (o.ring > 0) { const off = (1 - o.ring) * 300; ctx.save(); ctx.globalAlpha = clamp(o.ring * 1.5); ctx.strokeStyle = '#d8b04c'; ctx.lineWidth = 12; ell(ctx, 900 + off, 846, 14, 26); ctx.stroke(); ctx.restore(); }
  if (o.stick > 0) { const off = (1 - outc(o.stick)) * -900; ctx.fillStyle = '#7a5532'; rrect(ctx, 40 + off, 990, 760, 46, 20); ctx.fill(); ctx.fillStyle = '#5e4026'; for (const kx of [140, 420, 640]) { ell(ctx, kx + off, 1012, 10, 8); ctx.fill(); } }
  if (o.wrap > 0) {
    const n = 5;
    for (let k = 0; k < n; k++) {
      const a = clamp(o.wrap * n - k); if (a <= 0) continue;
      const x = 150 + k * 120, wav = o.loose ? Math.sin(t * 2 + k) * 6 : 0;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = k % 2 ? '#ece4d2' : '#e2d8c2'; poly(ctx, [[x - 40, 760 + wav], [x + 40, 760 - wav], [x + 60, 1050], [x - 20, 1050]]); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    }
  }
  if (o.cold > 0) {
    ctx.save(); ctx.globalAlpha = o.cold; ctx.fillStyle = '#ece4d2'; rrect(ctx, 470, 720, 260, 90, 24); ctx.fill();
    ctx.fillStyle = '#7fc4ec'; rrect(ctx, 490, 640, 220, 100, 30); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(510, 660, 80, 14);
    const r2 = rng(8); for (let i = 0; i < 14; i++) { const u = (t * .4 + r2()) % 1; ctx.fillStyle = `rgba(220,240,255,${1 - u})`; ell(ctx, 500 + r2() * 200, 640 - u * 120, 4, 4); ctx.fill(); }
    ctx.restore();
  }
  if (o.cross) { const k = outBack(clamp(o.cross)); ctx.save(); ctx.translate(560, 560); ctx.scale(k, k); ctx.strokeStyle = PAL.red; ctx.lineWidth = 36; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-150, -150); ctx.lineTo(150, 150); ctx.moveTo(150, -150); ctx.lineTo(-150, 150); ctx.stroke(); ctx.restore(); }
  if (o.check) { const k = clamp(o.check); ctx.save(); ctx.strokeStyle = PAL.green; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(420, 560); ctx.lineTo(420 + 90 * clamp(k * 2), 560 + 90 * clamp(k * 2)); if (k > .5) ctx.lineTo(510 + 200 * (k - .5) * 2, 650 - 220 * (k - .5) * 2); ctx.stroke(); ctx.restore(); }
  vignette(ctx, .45);
}

// The cockpit: windscreen, dials, an old radio. o: pilot, tilt (crash), radio, static.
function cockpit(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#141a26'], [1, '#0a0d14']]);
  ctx.save(); ctx.translate(540, 560); ctx.rotate(o.tilt || 0);
  ctx.save(); poly(ctx, [[-480, -260], [480, -260], [420, 160], [-420, 160]]); ctx.clip();
  vgrad(ctx, -600, -400, 1200, 400, [[0, '#2c2a5c'], [1, '#d8695a']]); vgrad(ctx, -600, 0, 1200, 300, [[0, '#3e4778'], [1, '#1d2440']]);
  ctx.restore();
  ctx.fillStyle = '#1b212c'; ctx.fillRect(-30, -270, 60, 440); ctx.lineWidth = 26; ctx.strokeStyle = '#1b212c'; poly(ctx, [[-480, -260], [480, -260], [420, 160], [-420, 160]]); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#232a36'; poly(ctx, [[0, 760], [W, 760], [W, H], [0, H]]); ctx.fill();
  for (let i = 0; i < 6; i++) { const x = 140 + i * 160, y = 860 + (i % 2) * 70; ctx.fillStyle = '#0d1016'; ell(ctx, x, y, 48, 48); ctx.fill(); ctx.strokeStyle = PAL.green; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 34, Math.PI * .8, Math.PI * (.8 + 1.4 * (.3 + .5 * noise1(t * 2 + i)))); ctx.stroke(); }
  if (o.pilot) {
    const bob = Math.sin(t * 2.2) * 4, hx = 400, hy = 760 + bob;
    ctx.fillStyle = LOOK.pilot.top; rrect(ctx, hx - 190, hy + 120, 380, 700, 120); ctx.fill();
    ctx.fillStyle = LOOK.pilot.hair; ell(ctx, hx, hy, 105, 120); ctx.fill();
    ctx.fillStyle = shade(LOOK.pilot.skin, -.1); ell(ctx, hx - 108, hy + 10, 18, 30); ctx.fill(); ell(ctx, hx + 108, hy + 10, 18, 30); ctx.fill();
    ctx.strokeStyle = '#0d0f13'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(hx, hy - 10, 118, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    ctx.fillStyle = '#0d0f13'; for (const k of [-1, 1]) { rrect(ctx, hx + k * 118 - 28, hy - 20, 56, 90, 20); ctx.fill(); }
    ctx.fillStyle = '#3a2f2a'; rrect(ctx, hx - 240, hy + 90, 480, 780, 60); ctx.fill(); ctx.fillStyle = '#2c2420'; rrect(ctx, hx - 200, hy + 130, 400, 700, 50); ctx.fill();
    ctx.fillStyle = LOOK.pilot.top; rrect(ctx, hx + 150, hy + 230, 200, 70, 35); ctx.fill(); ctx.fillStyle = LOOK.pilot.skin; ell(ctx, hx + 360, hy + 265, 40, 36); ctx.fill();
  }
  if (o.radio) {
    ctx.fillStyle = '#4a4436'; rrect(ctx, 250, 1420, 580, 360, 24); ctx.fill(); ctx.fillStyle = '#3a3529'; rrect(ctx, 250, 1420, 580, 60, [24, 24, 0, 0]); ctx.fill();
    ctx.fillStyle = '#1b1a16'; for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { ell(ctx, 320 + i * 34, 1550 + j * 44, 10, 10); ctx.fill(); }
    ctx.fillStyle = '#0d150f'; rrect(ctx, 560, 1520, 230, 120, 10); ctx.fill();
    ctx.strokeStyle = '#7dff9e'; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = 0; x <= 210; x += 5) { const a = o.static ? (noise1(t * 30 + x * .3) - .5) * 90 * o.static : Math.sin(x * .1 + t * 6) * 20; x ? ctx.lineTo(570 + x, 1580 + a) : ctx.moveTo(570, 1580 + a); }
    ctx.stroke();
    ctx.fillStyle = '#cfc6b0'; for (const kx of [620, 740]) { ell(ctx, kx, 1710, 30, 30); ctx.fill(); }
    ctx.fillStyle = Math.sin(t * 6) > 0 ? PAL.red : '#4a1a16'; ell(ctx, 790, 1450, 10, 10); ctx.fill();
  }
  vignette(ctx, .6);
}

// ---------- shots ----------

SHOTS.push(
  // Что делать, если зомби-апокалипсис застал тебя на необитаемом острове?
  { t0: 0, fadeIn: .3, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1100, 1.0, 1.1);
    island(ctx, t, { tod: 'dusk', sun: [540, 820], extra: x => {
      toon(x, lerp(820, 600, lt / d), 1560, 380, walkPose(lt * 4.5, -1, .7, { face: -1, eyes: 'red', lean: -.25, head: [-.02, .05], armL: [-1.2, -.1], armR: [-1.0, .1], mouth: .5 }), LOOK.zombie);
    } });
    headline(ctx, 'ЗОМБИ-АПОКАЛИПСИС', appear(t, Wd(1, 'зомби')), 'r', 260, null, 92);
    headline(ctx, 'НА ОСТРОВЕ', appear(t, Wd(1, 'остров')), 'w', 370, null, 92);
    specks(ctx, t, 30, 1, .25); vignette(ctx);
  } },
  // Запомни эти правила.
  { t0: C(2), trans: 'whip', draw(ctx, lt, d, t) {
    rulesList(ctx, lt, t, -1);
  } },
  // Я пропустил одно — и это почти стоило мне жизни.
  { t0: C(3), trans: 'cut', draw(ctx, lt, d, t) {
    rulesList(ctx, 5, t, clamp((t - Wd(3, 'одно')) / .5), t > Wd(3, 'жизни') ? 1 : 0);
  } },
  // Самолёт упал в океан.
  { t0: C(4), trans: 'whip', draw(ctx, lt, d, t) {
    const hit = Wd(4, 'океан') + .2, [sx, sy] = shake(t, [[hit, 2.5]], 16);
    ctx.translate(sx, sy);
    island(ctx, t, { tod: 'dusk', hz: 1100, shore: 1900, palms: [], sun: [200, 1040] });
    const u = clamp((t - C(4)) / (hit - C(4)));
    if (t < hit) {
      const px = lerp(1100, 560, u), py = lerp(300, 1120, inc(u) * .6 + u * .4), a = lerp(.35, .75, u);
      for (let i = 0; i < 24; i++) { const k = i / 24; glow(ctx, px + 300 * k * Math.cos(a) + 10, py - 300 * k * Math.sin(a) - 30, 30 + k * 60, 'rgba(60,60,66,1)', .4 * (1 - k), 'source-over'); }
      ctx.save(); ctx.translate(px, py); ctx.rotate(a + Math.PI);
      ctx.fillStyle = '#d9dde3'; rrect(ctx, -150, -22, 300, 44, 22); ctx.fill(); ctx.fillStyle = '#b5bac2'; poly(ctx, [[-20, 0], [40, 0], [-40, 120], [-80, 120]]); ctx.fill(); poly(ctx, [[-20, 0], [40, 0], [-40, -120], [-80, -120]]); ctx.fill();
      ctx.fillStyle = '#c0392b'; poly(ctx, [[110, -20], [150, -20], [150, -80]]); ctx.fill();
      glow(ctx, -30, 60, 60, 'rgba(255,140,50,1)', .8 * flicker(t, .4, 9, 1)); ctx.restore();
    } else {
      const k = t - hit;
      for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + (i - 7.5) * .12, sp = 500 + (i % 3) * 200; ctx.fillStyle = `rgba(240,248,255,${Math.max(0, 1 - k * 1.2)})`; ell(ctx, 560 + Math.cos(a) * sp * k, 1120 + Math.sin(a) * sp * k + 900 * k * k, 18, 30); ctx.fill(); }
      glow(ctx, 560, 1120, 500, 'rgba(255,255,255,1)', Math.max(0, .8 - k * 2));
    }
    vignette(ctx);
  } },
  // Я очнулся на песке. Один.
  { t0: C(5), trans: 'flash', xfade: .35, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1500, 1.2, 1.28);
    island(ctx, t, { tod: 'day', palms: [[1000, 1500, 760, -.2, 3]] });
    const up = outBack(clamp((t - Wd(5, 'очнулся')) / 1.1)), look = t > Wd(5, 'один') ? Math.sin((t - Wd(5, 'один')) * 3) * .04 : 0;
    ctx.save(); ctx.translate(540, 1700); ctx.rotate(look); ctx.translate(-540, -1700);
    lying(ctx, t, 330, 1730, 560, ANTON, { up: up * .9, eyes: up > .4 ? 'open' : 'closed', mouth: up > .2 && up < .8 });
    ctx.restore();
    tag(ctx, 90, 240, 'ОДИН', appear(t, Wd(5, 'один')), PAL.yellow);
    specks(ctx, t, 30, 2, .3); vignette(ctx, .4);
  } },
  // Вокруг — обломки и дым.
  { t0: C(6), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1300, 1.0, 1.06);
    island(ctx, t, { tod: 'day', palms: [[90, 1450, 800, .25, 1]], extra: x => {
      wreck(x, t, 640, 1450, .9);
      const look = Math.sin(lt * 2.2);
      toon(x, 260, 1600, 340, { face: look > 0 ? 1 : -1, eyes: 'wide', armR: [.4, -.4] }, ANTON);
    } });
    tag(ctx, 90, 240, 'ОБЛОМКИ', appear(t, Wd(6, 'обломки')), '#ffffff');
    tag(ctx, 90, 316, 'ДЫМ', appear(t, Wd(6, 'дым')), '#ffffff');
    specks(ctx, t, 30, 3, .3); vignette(ctx, .4);
  } },
  // Последнее, что я помню, — голос пилота.
  { t0: C(7), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.06);
    cockpit(ctx, t, { pilot: 1, talk: MOUTH(t) * .4 });
    tint(ctx, '#808080', .5, 'saturation'); tint(ctx, '#c9a37a', .3, 'multiply');
    ctx.save(); ctx.strokeStyle = 'rgba(255,220,150,0.5)'; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { const u = (t * .8 + i / 3) % 1; ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.arc(390, 680, 60 + u * 220, -.7, .7); ctx.stroke(); } ctx.restore();
    tag(ctx, 90, 140, 'ГОЛОС ПИЛОТА', appear(t, Wd(7, 'голос')), PAL.yellow, 'ПОСЛЕДНЕЕ ВОСПОМИНАНИЕ');
  } },
  // Он говорил про вирус, который превращает людей в зомби.
  { t0: C(8), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#1e0b10'], [1, '#0b0507']]);
    const turn = clamp((t - Wd(8, 'превращ')) / .9);
    toon(ctx, 300, 1250, 640, { eyes: 'dot', armL: [-.05, 0], armR: [.05, 0] }, ANTON);
    ctx.strokeStyle = PAL.red; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.globalAlpha = clamp(turn * 3);
    ctx.beginPath(); ctx.moveTo(470, 900); ctx.lineTo(610, 900); ctx.moveTo(580, 860); ctx.lineTo(615, 900); ctx.lineTo(580, 940); ctx.stroke(); ctx.globalAlpha = 1;
    if (turn > 0) toon(ctx, 780, 1250, 640, { eyes: 'red', lean: .12 * turn, head: [0, .04 * turn], armL: [-.9 * turn, .2], armR: [-.6 * turn, .3], mouth: .6 * turn }, Object.assign({}, LOOK.zombie, { top: ANTON.top, topD: ANTON.topD, legs: ANTON.legs }));
    headline(ctx, 'ВИРУС', appear(t, Wd(8, 'вирус')), 'r', 300, null, 130);
    specks(ctx, t, 30, 4, .3); vignette(ctx, .6);
  } },
  // Проверяю себя.
  { t0: C(9), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 760, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#8fc3e4'], [1, '#e2cb98']]);
    portrait(ctx, 540, 720, 860, { eyes: 'down', brow: .5, look: .3 }, ANTON);
    tag(ctx, 90, 140, 'ПРОВЕРКА', appear(lt, .15));
  } },
  // Кисть сломана. Опухла. Пальцы почти не слушаются.
  { t0: C(10), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 640, 880, 1.0, 1.08);
    wrist(ctx, t, { swell: clamp((t - Wd(10, 'опухла')) / .8) * .9 + .1, twitch: t > Wd(10, 'пальцы') ? 1 : 0, curl: t > Wd(10, 'пальцы') ? .08 : 0 });
    [['СЛОМАНА', Wd(10, 'сломана'), PAL.red], ['ОПУХЛА', Wd(10, 'опухла'), PAL.red], ['ПАЛЬЦЫ НЕ СЛУШАЮТСЯ', Wd(10, 'пальцы'), '#ffffff']].forEach(([s, a, c], i) => tag(ctx, 90, 240 + i * 76, s, appear(t, a), c));
  } },
  // Правило первое.
  { t0: C(11), trans: 'flash', draw(ctx, lt, d, t) { ruleCard(ctx, lt, t, 1, 'ПЕРЕЛОМ'); } },
  // Перелом нельзя вправлять и двигать.
  { t0: C(12), trans: 'whip', draw(ctx, lt, d, t) {
    wrist(ctx, t, { swell: 1, cross: (t - Wd(12, 'нельзя')) / .35 });
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 14; ctx.lineCap = 'round'; const a = Math.sin(t * 3) * .4;
    ctx.beginPath(); ctx.arc(860, 880, 230, -1.2 + a, -.2 + a); ctx.stroke(); ctx.restore();
    tag(ctx, 90, 240, 'НЕ ВПРАВЛЯТЬ', appear(t, Wd(12, 'вправлять')), PAL.red);
    tag(ctx, 90, 316, 'НЕ ДВИГАТЬ', appear(t, Wd(12, 'двигать')), PAL.red);
  } },
  // Фиксируем кисть так, как она лежит.
  { t0: C(13), trans: 'cut', draw(ctx, lt, d, t) {
    wrist(ctx, t, { swell: 1, check: (t - Wd(13, 'лежит')) / .5 });
    ctx.save(); ctx.setLineDash([18, 14]); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 6; ctx.lineDashOffset = -t * 40; rrect(ctx, 600, 680, 520, 360, 60); ctx.stroke(); ctx.restore();
    tag(ctx, 90, 240, 'КАК ЛЕЖИТ', appear(lt, .2), PAL.yellow);
  } },
  // Палка вдоль предплечья, ткань сверху.
  { t0: C(14), trans: 'cut', draw(ctx, lt, d, t) {
    wrist(ctx, t, { swell: 1, stick: (t - Wd(14, 'палка')) / .7, wrap: (t - Wd(14, 'ткань')) / .9 });
    tag(ctx, 90, 240, 'ПАЛКА', appear(t, Wd(14, 'палка')), '#ffffff');
    tag(ctx, 90, 316, 'ТКАНЬ СВЕРХУ', appear(t, Wd(14, 'ткань')), '#ffffff');
  } },
  // Повязка не туго, чтобы пальцы не синели.
  { t0: C(15), trans: 'cut', draw(ctx, lt, d, t) {
    const warn = sstep(Wd(15, 'синели') - .2, Wd(15, 'синели') + .4, t) * (1 - sstep(Wd(15, 'синели') + .9, Wd(15, 'синели') + 1.4, t));
    wrist(ctx, t, { swell: .8, stick: 1, wrap: 1, loose: 1, blue: warn * .55 });
    tag(ctx, 90, 240, 'НЕ ТУГО', appear(t, Wd(15, 'туго')), PAL.yellow);
    if (warn > .05) tag(ctx, 90, 316, 'СИНЕЮТ = ТУГО', warn, PAL.red);
  } },
  // Снимаем часы и кольца, пока не пошёл отёк.
  { t0: C(16), trans: 'whip', draw(ctx, lt, d, t) {
    wrist(ctx, t, { swell: .6, watch: 1 - clamp((t - Wd(16, 'часы')) / .7), ring: 1 - clamp((t - Wd(16, 'кольца')) / .6) });
    tag(ctx, 90, 240, 'ЧАСЫ И КОЛЬЦА — СНЯТЬ', appear(lt, .2), PAL.yellow);
    tag(ctx, 90, 316, 'ДО ОТЁКА', appear(t, Wd(16, 'отёк')), PAL.red);
  } },
  // Руку держим выше сердца.
  { t0: C(17), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#8fc3e4'], [1, '#e2cb98']]);
    const up = outBack(clamp((t - Wd(17, 'выше')) / .6));
    toon(ctx, 540, 1700, 1250, { eyes: 'dot', armR: [lerp(.05, 2.7, up), lerp(0, -.6, up)], armL: [-.1, 0] }, ANTON);
    const hy = 1700 - 1250 * .66; ctx.save(); ctx.setLineDash([16, 12]); ctx.strokeStyle = PAL.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(140, hy); ctx.lineTo(940, hy); ctx.stroke(); ctx.restore();
    ctx.fillStyle = PAL.red; ctx.font = '900 70px Inter'; ctx.textAlign = 'left'; ctx.fillText('♥', 120, hy - 20);
    tag(ctx, 90, 240, 'ВЫШЕ СЕРДЦА', appear(t, Wd(17, 'выше')), PAL.yellow);
  } },
  // Холод прикладываем через ткань.
  { t0: C(18), trans: 'whip', draw(ctx, lt, d, t) {
    wrist(ctx, t, { swell: .5, stick: 1, wrap: 1, cold: clamp((t - Wd(18, 'холод')) / .5) });
    tag(ctx, 90, 240, 'ХОЛОД', appear(t, Wd(18, 'холод')), '#7fb0ff');
    tag(ctx, 90, 316, 'ЧЕРЕЗ ТКАНЬ', appear(t, Wd(18, 'ткань')), '#ffffff');
  } },
);

// The list of five rules; crossed > 0 strikes out rule 5, dead marks it.
function rulesList(ctx, lt, t, crossed, dead = 0) {
  vgrad(ctx, 0, 0, W, H, [[0, '#121826'], [1, '#080a10']]);
  ctx.save(); ctx.translate(540, 690); ctx.rotate(-.03);
  ctx.fillStyle = '#efe6cf'; rrect(ctx, -400, -520, 800, 1000, 24); ctx.fill();
  ctx.fillStyle = '#2a2418'; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ПРАВИЛА', 0, -420);
  ctx.font = '700 30px Inter'; ctx.fillStyle = '#7a6a50'; ctx.fillText('ВЫЖИВАНИЯ НА ОСТРОВЕ', 0, -362);
  for (let k = 0; k < 5; k++) {
    const a = outBack(clamp((lt - .15 - k * .18) / .3)), y = -250 + k * 150;
    ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate((1 - a) * -60, 0);
    ctx.fillStyle = k === 4 && dead ? PAL.red : '#2a2418'; ctx.font = '900 56px Inter'; ctx.textAlign = 'left'; ctx.fillText(`${k + 1}.`, -330, y);
    ctx.fillStyle = 'rgba(42,36,24,0.25)'; rrect(ctx, -240, y - 18, [480, 420, 520, 380, 460][k], 36, 18); ctx.fill();
    ctx.restore();
  }
  if (crossed > 0) { ctx.strokeStyle = PAL.red; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-340, 350); ctx.lineTo(-340 + 680 * outc(crossed), 350 - 20 * outc(crossed)); ctx.stroke(); }
  ctx.restore();
  if (dead) { const p = .5 + .5 * Math.sin(t * 9); tint(ctx, '#6a0808', .25 * p, 'screen'); }
  specks(ctx, t, 30, 5, .25); vignette(ctx, .6);
}
