// The island series: shared art for every episode set on the island (characters, beach, shelter, radio, rule cards).
// Loaded after captions.js and before an episode's scene files; nothing here registers shots.
'use strict';

// ---------- characters and the island ----------

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
// o.look: whose arm (Anton by default); o.bare: no sleeve.
function wrist(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#d9c194'], [1, '#c3a675']]);
  const r = rng(4); ctx.fillStyle = 'rgba(0,0,0,0.05)'; for (let i = 0; i < 90; i++) { ell(ctx, r() * W, r() * H, 3 + r() * 5, 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; rrect(ctx, -60, 860, 1000, 210, 100); ctx.fill();
  const L = o.look || ANTON, sk = L.skin, tw = (o.twitch || 0) * Math.sin(t * 14) * .06;
  // sleeve and forearm
  ctx.fillStyle = sk; rrect(ctx, -60, 780, 760, 200, 90); ctx.fill();
  if (!o.bare) { ctx.fillStyle = L.top; poly(ctx, [[-60, 760], [240, 760], [270, 800], [230, 840], [260, 900], [240, 1000], [-60, 1000]]); ctx.fill(); }
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

// A thermometer on the right; v is the temperature shown.
function thermometer(ctx, x, y, v) {
  ctx.fillStyle = 'rgba(10,14,24,0.75)'; rrect(ctx, x - 70, y - 470, 140, 560, 70); ctx.fill();
  ctx.fillStyle = '#e9edf3'; rrect(ctx, x - 26, y - 440, 52, 440, 26); ctx.fill(); ell(ctx, x, y + 20, 52, 52); ctx.fill();
  const lvl = clamp((v - 0) / 40), col = v < 20 ? '#5aa9ff' : PAL.red;
  ctx.fillStyle = col; ell(ctx, x, y + 20, 38, 38); ctx.fill(); rrect(ctx, x - 14, y - 420 * lvl, 28, 420 * lvl + 20, 14); ctx.fill();
  ctx.fillStyle = '#e9edf3'; ctx.font = '800 26px Inter'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (const g of [0, 10, 20, 30, 40]) ctx.fillText(`${g}°`, x - 80, y - 420 * g / 40);
}

// Little icons for the order of things.
function icon(ctx, kind, x, y, s, col) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (kind === 'shelter') { poly(ctx, [[-90, 60], [0, -80], [90, 60]]); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-40, 60); ctx.lineTo(0, 0); ctx.lineTo(40, 60); ctx.stroke(); }
  if (kind === 'water') { ctx.beginPath(); ctx.moveTo(0, -80); ctx.quadraticCurveTo(70, 10, 0, 70); ctx.quadraticCurveTo(-70, 10, 0, -80); ctx.fill(); }
  if (kind === 'fire') { ctx.beginPath(); ctx.moveTo(0, -80); ctx.quadraticCurveTo(70, 0, 40, 60); ctx.lineTo(-40, 60); ctx.quadraticCurveTo(-70, 0, 0, -80); ctx.fill(); }
  if (kind === 'food') { rrect(ctx, -60, -60, 120, 130, 16); ctx.fill(); ctx.fillStyle = '#0c0f16'; ctx.fillRect(-60, -20, 120, 40); }
  ctx.restore();
}

function supplies(ctx, t, food, water, gone = 0) {
  vgrad(ctx, 0, 0, W, H, [[0, '#e3cb96'], [1, '#c8aa72']]);
  const r = rng(6); ctx.fillStyle = 'rgba(0,0,0,0.06)'; for (let i = 0; i < 90; i++) { ell(ctx, r() * W, r() * H, 3 + r() * 6, 2); ctx.fill(); }
  ctx.save(); ctx.globalAlpha = 1 - gone;
  [[300, 760], [470, 720], [380, 900]].forEach(([x, y], i) => {
    const k = outBack(clamp(food - i * .25)); if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ell(ctx, 10, 90, 80, 20); ctx.fill();
    ctx.fillStyle = '#9aa0a8'; rrect(ctx, -70, -90, 140, 180, 16); ctx.fill(); ctx.fillStyle = ['#b5503c', '#c9a23a', '#3f7a5a'][i]; ctx.fillRect(-70, -40, 140, 80); ctx.fillStyle = '#c7ccd3'; ell(ctx, 0, -90, 70, 14); ctx.fill();
    ctx.restore();
  });
  [[700, 700], [840, 760]].forEach(([x, y], i) => {
    const k = outBack(clamp(water - i * .3)); if (k <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ell(ctx, 10, 170, 70, 18); ctx.fill();
    ctx.fillStyle = 'rgba(120,180,230,0.75)'; rrect(ctx, -60, -120, 120, 290, 30); ctx.fill(); ctx.fillStyle = '#2d5fa8'; rrect(ctx, -26, -170, 52, 50, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(-40, -90, 14, 220);
    ctx.restore();
  });
  ctx.restore();
  vignette(ctx, .4);
}

// Radio close-up with a static display; a countdown from total (seconds) when count (seconds gone) is set.
function radioClose(ctx, t, stat, count, total = 96 * 3600) {
  vgrad(ctx, 0, 0, W, H, [[0, '#1a1f2a'], [1, '#0b0e14']]);
  ctx.save(); ctx.translate(540, 820);
  ctx.fillStyle = '#4a4436'; rrect(ctx, -440, -330, 880, 640, 40); ctx.fill(); ctx.fillStyle = '#3a3529'; rrect(ctx, -440, -330, 880, 90, [40, 40, 0, 0]); ctx.fill();
  ctx.fillStyle = '#1b1a16'; for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) { ell(ctx, -360 + i * 46, -170 + j * 56, 14, 14); ctx.fill(); }
  ctx.fillStyle = '#0d150f'; rrect(ctx, 20, -190, 380, 220, 16); ctx.fill();
  ctx.strokeStyle = '#7dff9e'; ctx.lineWidth = 4; ctx.beginPath();
  for (let x = 0; x <= 360; x += 6) { const a = (noise1(t * 30 + x * .3) - .5) * 160 * stat + Math.sin(x * .12 + t * 9) * 30 * (1 - stat) * MOUTH(t); x ? ctx.lineTo(30 + x, -80 + a) : ctx.moveTo(30, -80 + a); }
  ctx.stroke();
  ctx.fillStyle = '#cfc6b0'; for (const kx of [110, 310]) { ell(ctx, kx, 170, 60, 60); ctx.fill(); ctx.fillStyle = '#8a826c'; ctx.save(); ctx.translate(kx, 170); ctx.rotate(t * .3 + kx); ctx.fillRect(-6, -60, 12, 40); ctx.restore(); ctx.fillStyle = '#cfc6b0'; }
  ctx.fillStyle = Math.sin(t * 6) > 0 ? PAL.red : '#4a1a16'; ell(ctx, 380, -290, 14, 14); ctx.fill();
  ctx.strokeStyle = '#2a261c'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-380, -330); ctx.lineTo(-460, -620); ctx.stroke();
  ctx.restore();
  if (count !== null && count !== undefined) {
    const left = Math.max(0, total - count), h = Math.floor(left / 3600), m = Math.floor(left / 60) % 60, s = Math.floor(left) % 60;
    ctx.fillStyle = PAL.red; ctx.font = '800 110px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`, 540, 1540);
  }
  ctx.save(); ctx.globalAlpha = .08 * stat; const r = rng(Math.floor(t * 20)); for (let i = 0; i < 400; i++) { ctx.fillStyle = r() < .5 ? '#fff' : '#000'; ctx.fillRect(r() * W, r() * H, 3, 3); } ctx.restore();
  vignette(ctx, .6);
}

const LOG = { c: '#7a5532', d: '#5e4026' }, LEAF = ['#3f8a4f', '#2f7048', '#4f9a5c'];

function logLine(ctx, a, b, w, night) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = night ? '#241b15' : LOG.d; ctx.lineWidth = w + 8; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
  ctx.strokeStyle = night ? '#3b2c22' : LOG.c; ctx.lineWidth = w; ctx.stroke();
}

// The A-frame shelter, front and right slope: (x, y) the middle of the front on the ground, s its height.
// o: frame, leaves, floor 0..1 (how far built), night, rope 0..1, cans 0..1, swing (how hard the cans rock).
function shelter(ctx, t, x, y, s, o = {}) {
  const off = [.42 * s, -.16 * s], B = p => [p[0] + off[0], p[1] + off[1]];
  const apex = [x, y - s], L0 = [x - .62 * s, y], R0 = [x + .62 * s, y];
  const f = o.frame ?? 1, lv = o.leaves ?? 1, n8 = !!o.night;
  const leaf = n8 ? ['#1d3626', '#16291d', '#24402d'] : LEAF;
  // a pole rises from lying on the sand to its place
  const rise = (base, top, k) => { const a0 = Math.atan2(top[1] - base[1], top[0] - base[0]), L = Math.hypot(top[0] - base[0], top[1] - base[1]) * 1.12;
    const a = lerp(base[0] < x ? Math.PI : 0, a0, outBack(clamp(k))); return [base[0] + Math.cos(a) * L, base[1] + Math.sin(a) * L]; };
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; poly(ctx, [[L0[0] - 20, y + 10], [R0[0] + 30, y + 10], [B(R0)[0] + 40, B(R0)[1] + 6], [B(L0)[0], B(L0)[1] + 6]]); ctx.fill();
  // back poles and ridge
  if (f > 0) {
    const kb = clamp(f * 2 - .6);
    if (kb > 0) { logLine(ctx, B(L0), rise(B(L0), B(apex), kb), .045 * s, n8); logLine(ctx, B(R0), rise(B(R0), B(apex), kb), .045 * s, n8); }
    const kr = clamp(f * 2 - 1.2);
    if (kr > 0) logLine(ctx, apex, [lerp(apex[0], B(apex)[0] + off[0] * .15, kr), lerp(apex[1], B(apex)[1] + off[1] * .15, kr)], .05 * s, n8);
  }
  // the right slope: rows of leaves laid from the bottom up
  const P = (u, v) => { const a = [lerp(R0[0], apex[0], u), lerp(R0[1], apex[1], u)], b = [lerp(B(R0)[0], B(apex)[0], u), lerp(B(R0)[1], B(apex)[1], u)]; return [lerp(a[0], b[0], v), lerp(a[1], b[1], v)]; };
  const rows = 6;
  for (let r = 0; r < rows; r++) {
    const a = clamp(lv * rows - r); if (a <= 0) continue;
    const u0 = r / rows - .04, u1 = Math.min(1, (r + 1.25) / rows), dy = (1 - outc(a)) * -60;
    ctx.save(); ctx.globalAlpha = clamp(a * 2); ctx.translate(0, dy); ctx.fillStyle = leaf[r % 3];
    ctx.beginPath(); ctx.moveTo(...P(u1, 0)); ctx.lineTo(...P(u1, 1));
    for (let j = 8; j >= 0; j--) { const q = P(u0 - (j % 2 ? .035 : 0), j / 8); ctx.lineTo(...q); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 3; for (let j = 1; j < 8; j++) { ctx.beginPath(); ctx.moveTo(...P(u0, j / 8)); ctx.lineTo(...P(u1 - .05, j / 8)); ctx.stroke(); }
    ctx.restore();
  }
  // the front: leaves around a dark entrance
  const ent = [[x - .27 * s, y], [x, y - .56 * s], [x + .27 * s, y]];
  if (lv > 0) {
    ctx.save(); poly(ctx, [L0, apex, R0]); ctx.clip();
    for (let r = 0; r < rows; r++) {
      const a = clamp(lv * rows - r); if (a <= 0) continue;
      const y0 = y - r * s / rows, y1 = y - (r + 1.25) * s / rows;
      ctx.globalAlpha = clamp(a * 2); ctx.fillStyle = leaf[(r + 1) % 3];
      ctx.beginPath(); ctx.moveTo(x - s, y1); ctx.lineTo(x + s, y1);
      for (let j = 16; j >= 0; j--) ctx.lineTo(x - s + j * s / 8, y0 + (j % 2 ? 22 : 0) * s / 560);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore(); ctx.globalAlpha = 1;
    ctx.fillStyle = n8 ? '#05070b' : '#1d1a14'; poly(ctx, ent); ctx.fill();
    if (o.floor > 0) { ctx.save(); poly(ctx, ent); ctx.clip(); ctx.fillStyle = leaf[2]; ctx.fillRect(x - .3 * s, y - .05 * s * clamp(o.floor), .6 * s, .06 * s); ctx.restore(); }
  }
  // front poles crossing at the top
  if (f > 0) { const k = clamp(f * 2); logLine(ctx, L0, rise(L0, apex, k), .055 * s, n8); logLine(ctx, R0, rise(R0, apex, k), .055 * s, n8); }
  if (o.rope > 0) ropeCans(ctx, t, [x - .95 * s, y + .06 * s], [x + 1.05 * s, y + .02 * s], .12 * s, o.rope, o.cans || 0, o.swing || 0, s / 560, n8);
}

// A rope on two stakes at shin height with tin cans hanging from it; swing < 0 holds them dead still.
function ropeCans(ctx, t, a, b, hgt, k, cans, swing, sc = 1, night = false, kick = null) {
  const st = night ? '#2a2019' : LOG.d;
  ctx.lineCap = 'round';
  for (const p of [a, b]) { ctx.strokeStyle = st; ctx.lineWidth = 14 * sc; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0], p[1] - hgt - 20 * sc); ctx.stroke(); }
  const A = [a[0], a[1] - hgt], Bp = [b[0], b[1] - hgt], sag = 26 * sc;
  // the rope point at u; kick = [u, depth] pushes it in where a foot catches it
  const R = u => { let y = lerp(A[1], Bp[1], u) + Math.sin(Math.PI * u) * sag; if (kick) y += kick[1] * Math.max(0, 1 - Math.abs(u - kick[0]) * 3); return [lerp(A[0], Bp[0], u), y]; };
  ctx.strokeStyle = night ? '#8a7f6a' : '#d8c9a4'; ctx.lineWidth = 6 * sc; ctx.beginPath();
  for (let i = 0; i <= 40 * k; i++) { const q = R(i / 40); i ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.stroke();
  const n = 5;
  for (let i = 0; i < n; i++) {
    const u = (i + 1) / (n + 1), c = outBack(clamp(cans * n - i)); if (c <= 0 || u > k) continue;
    const [px, py] = R(u), ang = swing < 0 ? 0 : Math.sin(t * 2 + i * 1.7) * .06 + swing * Math.sin(t * 11 + i * 2.1) * .7;
    ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.scale(c * sc, c * sc);
    ctx.strokeStyle = night ? '#6a6255' : '#a89c80'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.stroke();
    ctx.fillStyle = night ? '#5d636b' : '#b9bec6'; rrect(ctx, -26, 34, 52, 64, 8); ctx.fill();
    ctx.fillStyle = night ? '#4a2a22' : ['#b5503c', '#c9a23a', '#3f7a5a'][i % 3]; ctx.fillRect(-26, 50, 52, 30);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(-18, 38, 8, 56);
    ctx.restore();
  }
  return R;
}

// A pile of material on the sand, seen from above.
function material(ctx, kind, x, y, k, label) {
  if (k <= 0) return;
  const a = outBack(clamp(k));
  ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  if (kind === 'logs') {
    for (let i = 0; i < 3; i++) { const yy = -70 + i * 70; ell(ctx, 10, yy + 14, 300, 30); ctx.fill(); }
    for (let i = 0; i < 3; i++) {
      const yy = -70 + i * 70, w = [560, 520, 600][i];
      ctx.fillStyle = LOG.c; rrect(ctx, -w / 2, yy - 28, w, 56, 28); ctx.fill(); ctx.fillStyle = LOG.d; ctx.fillRect(-w / 2 + 40, yy - 4, w - 120, 6);
      ctx.fillStyle = '#c99a62'; ell(ctx, w / 2 - 6, yy, 22, 26); ctx.fill(); ctx.strokeStyle = '#8a6438'; ctx.lineWidth = 3; ell(ctx, w / 2 - 6, yy, 12, 15); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
    }
  }
  if (kind === 'rope') {
    ell(ctx, 8, 14, 150, 140); ctx.fill();
    ctx.strokeStyle = '#d8c9a4'; ctx.lineWidth = 22; ctx.lineCap = 'round';
    ctx.beginPath(); for (let i = 0; i <= 200; i++) { const a2 = i / 200 * Math.PI * 7, r = 20 + i * .55; i ? ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r) : ctx.moveTo(r, 0); } ctx.stroke();
    ctx.strokeStyle = '#b8a77e'; ctx.lineWidth = 4; ctx.stroke();
  }
  if (kind === 'leaves') {
    for (let i = 0; i < 3; i++) {
      ctx.save(); ctx.rotate(-.5 + i * .45); ctx.fillStyle = LEAF[i];
      ctx.beginPath(); ctx.moveTo(0, 160); ctx.quadraticCurveTo(-120, -40, 0, -230); ctx.quadraticCurveTo(120, -40, 0, 160); ctx.fill();
      ctx.strokeStyle = shade(LEAF[i], -.25); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 170); ctx.lineTo(0, -220); ctx.stroke();
      ctx.lineWidth = 3; for (let j = 0; j < 9; j++) { const yy = 120 - j * 38; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(-70 * Math.sin(Math.PI * (j + 1) / 10), yy - 30); ctx.moveTo(0, yy); ctx.lineTo(70 * Math.sin(Math.PI * (j + 1) / 10), yy - 30); ctx.stroke(); }
      ctx.restore();
    }
  }
  ctx.restore();
  if (label) { ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.fillStyle = '#2a2418'; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, x, y + (kind === 'logs' ? 150 : 210)); ctx.restore(); }
}

// Sand background seen from above.
function sandTop(ctx, seed = 6) {
  vgrad(ctx, 0, 0, W, H, [[0, '#e3cb96'], [1, '#c8aa72']]);
  const r = rng(seed); ctx.fillStyle = 'rgba(0,0,0,0.06)'; for (let i = 0; i < 120; i++) { ell(ctx, r() * W, r() * H, 3 + r() * 6, 2); ctx.fill(); }
}

function checkMark(ctx, x, y, k, s = 1, col = PAL.green) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-34, 0); const a = clamp(k * 2), b = clamp(k * 2 - 1);
  ctx.lineTo(-34 + 24 * a, 26 * a); if (b > 0) ctx.lineTo(-10 + 52 * b, 26 - 64 * b); ctx.stroke(); ctx.restore();
}

// The rules paper again: rows ticked off, row five left empty.
function rulesTicked(ctx, lt, t, ticks, warn = 0) {
  rulesList(ctx, 5, t, -1);
  ctx.save(); ctx.translate(540, 690); ctx.rotate(-.03);
  for (let k = 0; k < 4; k++) checkMark(ctx, 290, -250 + k * 150, clamp(ticks * 4 - k) * 1.0, 1.1);
  if (warn > 0) { const p = .5 + .5 * Math.sin(t * 10); ctx.globalAlpha = warn * (.4 + .6 * p); ctx.strokeStyle = PAL.red; ctx.lineWidth = 8; rrect(ctx, -360, 350 - 60, 720, 120, 20); ctx.stroke();
    ctx.fillStyle = PAL.red; ctx.font = '900 72px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 290, 350); }
  ctx.restore();
}

const MOONLIT = '#7d8cc0';

// Inside the shelter at night, looking out through the entrance. outside(ctx) draws what is out there.
function fromInside(ctx, t, outside, tri = [[540, 330], [60, 1560], [1020, 1560]]) {
  outside(ctx);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.moveTo(...tri[0]); ctx.lineTo(...tri[1]); ctx.lineTo(...tri[2]); ctx.closePath(); ctx.clip('evenodd');
  vgrad(ctx, 0, 0, W, H, [[0, '#06080d'], [1, '#0b0f14']]);
  ctx.strokeStyle = 'rgba(40,70,50,0.35)'; ctx.lineWidth = 6;
  for (let i = 0; i < 26; i++) { const y = i * 80; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y - 300); ctx.stroke(); }
  ctx.fillStyle = '#0d1a12'; ctx.fillRect(0, tri[1][1], W, H);
  ctx.restore();
  // leaf tips along the edge of the opening, catching the moon
  ctx.fillStyle = '#1f3327';
  for (const [a, b] of [[tri[0], tri[1]], [tri[0], tri[2]]]) for (let i = 0; i < 14; i++) {
    const u = (i + .5) / 14, x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u), dx = b[0] < a[0] ? 1 : -1;
    poly(ctx, [[x - 18, y - 30], [x + 18, y + 30], [x + dx * 40, y + 6]]); ctx.fill();
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, tri[1][1], 0, H); g.addColorStop(0, 'rgba(120,140,200,0.14)'); g.addColorStop(1, 'rgba(120,140,200,0)'); ctx.fillStyle = g;
  poly(ctx, [tri[1], tri[2], [W + 200, H], [-200, H]]); ctx.fill(); ctx.restore();
}

// The beach at night with the girl standing on it. o: x, y (feet), h, pose, shake, scan.
function nightBeach(ctx, t, o = {}) {
  island(ctx, t, { tod: 'night', hz: o.hz ?? 860, shore: o.shore ?? 1130, palms: o.palms ?? [[90, 1180, 700, .22, 11], [1000, 1160, 640, -.2, 12]], moon: [860, 200] });
  if (o.girl !== false) girl(ctx, t, o.x ?? 540, o.y ?? 1470, o.h ?? 600, o.pose, o.shiver ?? 1);
}

function torn(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(30,20,20,0.55)';
  poly(ctx, [[x, y], [x + 22 * s, y + 8 * s], [x + 10 * s, y + 20 * s], [x + 30 * s, y + 34 * s], [x + 4 * s, y + 40 * s], [x - 6 * s, y + 18 * s]]); ctx.fill();
}

// The girl, standing, a little torn and dirty, shivering. Drawn mirrored so armR is her right hand (on our left).
function girl(ctx, t, x, y, h, pose = {}, shiver = 1) {
  const sh = (noise1(t * 22) - .5) * h * .012 * shiver;
  ctx.save(); ctx.translate(x + sh, y); ctx.scale(-1, 1);
  const o = toon(ctx, 0, 0, h, Object.assign({ eyes: 'dot', armL: [.9, 1.9], armR: [-.9, -1.9] }, pose), GIRL);
  torn(ctx, -.06 * h, -.66 * h, h / 500); torn(ctx, .05 * h, -.52 * h, h / 600);
  ctx.fillStyle = 'rgba(40,30,25,0.35)'; ell(ctx, .02 * h, -.18 * h, .04 * h, .02 * h); ctx.fill();
  ctx.restore();
  return o;
}

// The scene is lit by the moon: a cool multiply over everything drawn so far.
const moonlight = (ctx, k = .55) => tint(ctx, MOONLIT, k, 'multiply');

// A face in the dark, lit from one side by the moon.
function nightFace(ctx, t, cx, cy, s, o, look) {
  vgrad(ctx, 0, 0, W, H, [[0, '#0a0e18'], [1, '#04060a']]);
  portrait(ctx, cx, cy, s, o, look);
  moonlight(ctx, .5);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(cx + s * .5, cy - s * .3, 0, cx + s * .5, cy - s * .3, s * 1.1);
  g.addColorStop(0, 'rgba(120,140,210,0.25)'); g.addColorStop(1, 'rgba(120,140,210,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// Draws a figure's shadow flat on the sand, falling towards us and to the left from the feet at (fx, fy).
function castShadow(ctx, fx, fy, draw, alpha) {
  if (alpha <= 0) return;
  const [c, x] = scratch('shadow', W, H);
  draw(x); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#05070c'; x.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = alpha; ctx.transform(1, 0, .45, -.75, -.45 * fy, 1.75 * fy); ctx.drawImage(c, 0, 0); ctx.restore();
}

function shoePrint(ctx, x, y, s, left, k) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(left ? -.08 : .08); ctx.scale(s * outBack(clamp(k)), s * outBack(clamp(k)));
  ctx.fillStyle = 'rgba(10,12,22,0.75)'; ell(ctx, 0, -40, 34, 52); ctx.fill(); ell(ctx, 0, 52, 28, 32); ctx.fill();
  ctx.strokeStyle = 'rgba(120,130,170,0.25)'; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-26, -70 + i * 16); ctx.lineTo(26, -70 + i * 16); ctx.stroke(); }
  ctx.restore();
  if (k < 1) { ctx.fillStyle = `rgba(150,160,200,${.5 * (1 - k)})`; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; ell(ctx, x + Math.cos(a) * 70 * (1 + k), y + Math.sin(a) * 50 * (1 + k), 8, 6); ctx.fill(); } }
}

function paw(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#c8cfe0';
  ell(ctx, 0, 20, 46, 38); ctx.fill(); for (const [dx, dy] of [[-50, -30], [-18, -58], [18, -58], [50, -30]]) { ell(ctx, dx, dy, 16, 20); ctx.fill(); }
  ctx.strokeStyle = PAL.red; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-80, -90); ctx.lineTo(80, 70); ctx.moveTo(80, -90); ctx.lineTo(-80, 70); ctx.stroke();
  ctx.restore();
}

// ---------- part 2: fire, wounds, the plane inside, the map, the walk ----------

// A campfire on the sand: crossed logs, stones, flickering flames, sparks. (x, y) is the base, s the scale.
function campfire(ctx, t, x, y, s = 1) {
  const fl = .85 + .3 * noise1(t * 5);
  glow(ctx, x, y - 70 * s, 520 * s, 'rgba(255,150,60,1)', .45 * fl);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ell(ctx, x, y + 14 * s, 150 * s, 30 * s); ctx.fill();
  ctx.fillStyle = '#4a4a52'; for (let i = 0; i < 9; i++) { const a = Math.PI * (i / 8); ell(ctx, x + Math.cos(a) * 130 * s, y + 10 * s - Math.sin(a) * 8 * s, 26 * s, 16 * s); ctx.fill(); }
  logLine(ctx, [x - 100 * s, y + 6 * s], [x + 90 * s, y - 26 * s], 28 * s); logLine(ctx, [x + 100 * s, y + 6 * s], [x - 90 * s, y - 26 * s], 28 * s);
  [['#e8463c', 1], ['#ff9a3c', .78], ['#ffd65a', .5]].forEach(([c, k], i) => {
    for (let j = -1; j <= 1; j++) {
      const h = 190 * s * k * (.75 + .35 * noise1(t * 7 + i * 3 + j * 11)) * (j ? .7 : 1), w = 70 * s * k * (j ? .7 : 1), sx = (noise1(t * 4 + j * 5 + i) - .5) * 40 * s, bx = x + j * 50 * s * k;
      ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(bx - w, y - 10 * s);
      ctx.quadraticCurveTo(bx - w * 1.05, y - h * .45, bx + sx, y - h); ctx.quadraticCurveTo(bx + w * 1.05, y - h * .45, bx + w, y - 10 * s); ctx.closePath(); ctx.fill();
    }
  });
  const r = rng(31);
  for (let i = 0; i < 14; i++) { const u = (t * (.5 + r() * .5) + r()) % 1, px = x + (r() - .5) * 120 * s + Math.sin(u * 9 + i) * 30 * s, py = y - 120 * s - u * 520 * s;
    ctx.fillStyle = `rgba(255,${180 + r() * 60 | 0},90,${1 - u})`; ell(ctx, px, py, 4 * s, 4 * s); ctx.fill(); }
}

// Night with a fire: everything goes dark blue, then a warm pool of light around (x, y).
function firelight(ctx, t, x, y, r = 900, k = 1) {
  tint(ctx, '#5f668f', .55 * k, 'multiply');
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const fl = .9 + .1 * noise1(t * 6);
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * fl); g.addColorStop(0, `rgba(255,140,60,${.45 * k})`); g.addColorStop(.5, `rgba(200,90,40,${.18 * k})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// Skin filling the frame, for close-ups of wounds.
function skinPatch(ctx, tone = '#e7c6b0', seed = 3) {
  vgrad(ctx, 0, 0, W, H, [[0, shade(tone, -.06)], [.5, tone], [1, shade(tone, -.12)]]);
  const r = rng(seed); ctx.fillStyle = 'rgba(120,70,50,0.07)'; for (let i = 0; i < 260; i++) { ell(ctx, r() * W, r() * H, 1.5 + r() * 2.5, 1.5 + r() * 2.5); ctx.fill(); }
  ctx.strokeStyle = 'rgba(120,70,50,0.06)'; ctx.lineWidth = 3; for (let i = 0; i < 14; i++) { const y = r() * H; ctx.beginPath(); ctx.moveTo(0, y); ctx.bezierCurveTo(300, y - 40, 700, y + 40, W, y); ctx.stroke(); }
}

// A straight cut from a to b, drawn as far as k; deep adds a dark centre and a little blood.
function cutWound(ctx, a, b, k, w = 18, deep = true) {
  if (k <= 0) return;
  const e = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(190,80,80,0.45)'; ctx.lineWidth = w * 2.4; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...e); ctx.stroke();
  ctx.strokeStyle = PAL.blood; ctx.lineWidth = w; ctx.stroke();
  if (deep) { ctx.strokeStyle = '#3a0a0e'; ctx.lineWidth = w * .4; ctx.stroke(); }
}

// Thin scratches across the skin.
function scratches(ctx, x, y, s, k) {
  for (let i = 0; i < 3; i++) { const a = clamp(k * 3 - i); if (a <= 0) continue;
    cutWound(ctx, [x - 160 * s + i * 40 * s, y - 60 * s + i * 50 * s], [x + 160 * s + i * 40 * s, y - 120 * s + i * 50 * s], a, 6 * s, false); }
}

// A bite: a bruise and two arcs of tooth marks; fresh ones are wet and run with blood. k shows it, veins spread out.
function biteMark(ctx, t, x, y, s, k, fresh = 0, veins = 0) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = clamp(k);
  const g = ctx.createRadialGradient(0, 10, 20, 0, 10, 190); g.addColorStop(0, 'rgba(150,40,70,0.6)'); g.addColorStop(1, 'rgba(150,40,70,0)'); ctx.fillStyle = g; ell(ctx, 0, 10, 190, 110); ctx.fill();
  const r = rng(21);
  for (const [cy, dir] of [[-34, -1], [52, 1]]) for (let i = 0; i < 7; i++) {
    const u = (i - 3) / 3, px = u * 115, py = cy + dir * (1 - u * u) * 22, w = (Math.abs(u) < .4 ? 34 : 26) + r() * 6;
    const a = clamp(k * 14 - (i + (dir > 0 ? 7 : 0)) * .7); if (a <= 0) continue;
    ctx.save(); ctx.translate(px, py); ctx.rotate(-dir * u * .5); ctx.scale(a, a);
    ctx.fillStyle = PAL.bloodD; rrect(ctx, -w / 2, -9, w, 18, 9); ctx.fill(); ctx.fillStyle = PAL.blood; rrect(ctx, -w / 2 + 4, -5, w - 8, 7, 4); ctx.fill();
    if (fresh) { ctx.fillStyle = `rgba(255,255,255,${.6 * fresh})`; ell(ctx, -w / 4, -4, 5, 3); ctx.fill(); }
    ctx.restore();
  }
  if (veins > 0) { ctx.strokeStyle = 'rgba(70,25,55,0.75)'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + .3, r0 = 140; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0 * .55); for (let j = 1; j <= 4; j++) { const rr = r0 + 60 * j * veins; ctx.lineTo(Math.cos(a + Math.sin(j * 2 + i) * .08) * rr, Math.sin(a + Math.sin(j * 2 + i) * .08) * rr * .55); } ctx.stroke(); } }
  if (fresh) { ctx.fillStyle = PAL.bloodD; ctx.strokeStyle = PAL.bloodD; ctx.lineWidth = 12;
    for (const [dx, dl] of [[-70, 1], [10, .7], [80, .85]]) { const L = clamp(fresh) * 80 * dl; ctx.beginPath(); ctx.moveTo(dx, 60); ctx.lineTo(dx + 2, 60 + L); ctx.stroke(); ell(ctx, dx + 2, 64 + L, 9, 12); ctx.fill(); } }
  ctx.restore();
}

// A medical bracelet across the wrist of wrist(): band at x; plate faces us.
function braceletOn(ctx, x, k = 1, shine = 0) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(k);
  ctx.fillStyle = '#2c3e5c'; rrect(ctx, x - 26, 770, 52, 220, 18); ctx.fill();
  ctx.fillStyle = '#c9ced6'; rrect(ctx, x - 40, 830, 80, 100, 14); ctx.fill(); ctx.fillStyle = PAL.red; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✱', x, 880);
  if (shine > 0) glow(ctx, x - 14, 850, 90, 'rgba(255,255,255,1)', .6 * shine);
  ctx.restore();
}

// The bracelet's plate up close: the engraved name.
function braceletPlate(ctx, t, k) {
  vgrad(ctx, 0, 0, W, H, [[0, '#1a2234'], [1, '#0b0f18']]);
  ctx.fillStyle = '#2c3e5c'; ctx.fillRect(0, 640, W, 420);
  ctx.fillStyle = 'rgba(255,255,255,0.06)'; for (let x = 0; x < W; x += 24) ctx.fillRect(x, 640, 10, 420);
  ctx.save(); ctx.translate(540, 850); const a = outBack(clamp(k)); ctx.scale(a, a);
  vgrad(ctx, -380, -170, 760, 340, [[0, '#e3e7ee'], [1, '#9aa1ad']]);
  ctx.save(); rrect(ctx, -380, -170, 760, 340, 40); ctx.clip(); vgrad(ctx, -380, -170, 760, 340, [[0, '#e3e7ee'], [1, '#9aa1ad']]);
  const sx = ((t * .35) % 1.6 - .3) * 900 - 450; const g = ctx.createLinearGradient(sx - 80, 0, sx + 80, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(-380, -170, 760, 340);
  ctx.restore();
  ctx.fillStyle = PAL.red; ctx.font = '900 150px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✱', -250, 0);
  ctx.fillStyle = '#3a3f48'; ctx.font = '900 120px Inter'; ctx.textAlign = 'left'; ctx.fillText('АНТОН', -150, -30);
  ctx.font = '800 40px Inter'; ctx.fillText('ГРУППА КРОВИ II+', -150, 80);
  ctx.restore();
}

// Inside the plane before the crash: windows, rows of seats. Sepia is added by the shot.
function cabin(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#cfc6b4'], [1, '#a99f8c']]);
  ctx.fillStyle = '#b7ad99'; ctx.fillRect(0, 0, W, 300); ctx.fillStyle = '#9d937f'; poly(ctx, [[0, 300], [W, 300], [W, 360], [0, 360]]); ctx.fill();
  for (let i = 0; i < 4; i++) { const x = 140 + i * 260; ctx.fillStyle = '#8f8572'; rrect(ctx, x - 62, 440, 124, 170, 60); ctx.fill(); vgrad(ctx, x - 50, 452, 100, 146, [[0, '#f0d8a8'], [1, '#d99a6c']]); }
  ctx.fillStyle = '#7f7766'; ctx.fillRect(0, 1500, W, H);
  for (const [x, y, s] of [[260, 1500, 1], [820, 1500, 1], [540, 1700, 1.2]]) { ctx.fillStyle = '#3e5476'; rrect(ctx, x - 150 * s, y - 520 * s, 300 * s, 560 * s, 50 * s); ctx.fill(); ctx.fillStyle = '#d9d2c2'; rrect(ctx, x - 110 * s, y - 500 * s, 220 * s, 90 * s, 20 * s); ctx.fill(); }
  if (o.extra) o.extra(ctx);
}

// The cargo hold: crates and bags in the dark.
function cargoHold(ctx, t) {
  vgrad(ctx, 0, 0, W, H, [[0, '#2a2620'], [1, '#14120f']]);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 8; for (let x = 60; x < W; x += 180) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (const [x, y, w, h, c] of [[60, 1100, 380, 420, '#6b5235'], [460, 1180, 300, 340, '#5a452c'], [760, 1050, 300, 470, '#6b5235'], [180, 820, 260, 280, '#5a452c'], [820, 820, 220, 230, '#4b3a26']]) {
    ctx.fillStyle = c; ctx.fillRect(x, y, w, h); ctx.strokeStyle = shade(c, -.3); ctx.lineWidth = 10; ctx.strokeRect(x + 5, y + 5, w - 10, h - 10); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y + h); ctx.stroke(); }
  ctx.fillStyle = '#0c0b09'; ctx.fillRect(0, 1520, W, H);
  glow(ctx, 540, 380, 400, 'rgba(255,220,150,1)', .25 * (.8 + .2 * flicker(t, .3, 7, 3)));
}

// An hourglass; k = how much sand has run down.
function hourglass(ctx, t, x, y, s, k) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#7a5532'; rrect(ctx, -200, -330, 400, 40, 14); ctx.fill(); rrect(ctx, -200, 290, 400, 40, 14); ctx.fill();
  ctx.strokeStyle = '#7a5532'; ctx.lineWidth = 18; for (const k2 of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k2 * 170, -290); ctx.lineTo(k2 * 170, 290); ctx.stroke(); }
  const glass = () => { ctx.beginPath(); ctx.moveTo(-140, -290); ctx.quadraticCurveTo(-140, -60, -12, 0); ctx.quadraticCurveTo(-140, 60, -140, 290); ctx.lineTo(140, 290); ctx.quadraticCurveTo(140, 60, 12, 0); ctx.quadraticCurveTo(140, -60, 140, -290); ctx.closePath(); };
  glass(); ctx.fillStyle = 'rgba(200,225,255,0.18)'; ctx.fill();
  ctx.save(); glass(); ctx.clip(); ctx.fillStyle = PAL.yellow;
  const top = -10 - 270 * (1 - k), bot = 290 - 250 * k;
  ctx.fillRect(-150, top, 300, -10 - top); ctx.beginPath(); ctx.moveTo(-150, 290); ctx.lineTo(-150, bot + 40); ctx.quadraticCurveTo(0, bot - 50, 150, bot + 40); ctx.lineTo(150, 290); ctx.fill();
  if (k < 1) ctx.fillRect(-5, 0, 10, 290);
  ctx.restore();
  glass(); ctx.strokeStyle = 'rgba(230,240,255,0.7)'; ctx.lineWidth = 8; ctx.stroke();
  ctx.restore();
}

// A clock face whose hands show h hours.
function clockFace(ctx, x, y, r, h) {
  ctx.fillStyle = '#efe6cf'; ell(ctx, x, y, r, r); ctx.fill(); ctx.strokeStyle = '#2a2418'; ctx.lineWidth = r * .08; ell(ctx, x, y, r, r); ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ctx.lineWidth = r * .04; ctx.beginPath(); ctx.moveTo(x + Math.sin(a) * r * .78, y - Math.cos(a) * r * .78); ctx.lineTo(x + Math.sin(a) * r * .9, y - Math.cos(a) * r * .9); ctx.stroke(); }
  const ha = h / 12 * Math.PI * 2, ma = h * Math.PI * 2;
  ctx.lineCap = 'round'; ctx.lineWidth = r * .09; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(ha) * r * .5, y - Math.cos(ha) * r * .5); ctx.stroke();
  ctx.strokeStyle = PAL.red; ctx.lineWidth = r * .05; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(ma) * r * .75, y - Math.cos(ma) * r * .75); ctx.stroke();
}

// The island from above. o: camp (marker k), north (marker k), coast and forest (route progress 0..1), cross (forest crossed out).
const ISLE = [[540, 300], [760, 360], [900, 560], [930, 820], [860, 1060], [700, 1240], [540, 1290], [360, 1230], [220, 1040], [170, 780], [230, 520], [380, 350]];
function islandMap(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#2c79ad'], [1, '#1d5f8c']]);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 4; for (let k = 0; k < 18; k++) { const y = 120 + k * 100; for (let j = 0; j < 6; j++) { const x = ((j * 230 + t * 20 + k * 70) % 1300) - 100; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 30, y - 8, x + 60, y); ctx.stroke(); } }
  const shape = (sc, col) => { ctx.save(); ctx.translate(540, 800); ctx.scale(sc, sc); ctx.translate(-540, -800); ctx.fillStyle = col; ctx.beginPath(); ISLE.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.restore(); };
  shape(1.08, 'rgba(255,255,255,0.35)'); shape(1, '#e3cb96'); shape(.82, '#2f7048'); shape(.6, '#245a39');
  const r = rng(41); ctx.fillStyle = '#1d4a2f'; for (let i = 0; i < 40; i++) { const a = r() * Math.PI * 2, d = r() * .55; ell(ctx, 540 + Math.cos(a) * 330 * d, 800 + Math.sin(a) * 440 * d, 30, 30); ctx.fill(); }
  ctx.fillStyle = '#fff'; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('С', 960, 170); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(960, 300); ctx.lineTo(960, 210); ctx.stroke(); poly(ctx, [[940, 225], [980, 225], [960, 195]]); ctx.fill();
  const route = (pts, k, col, dash) => { if (k <= 0) return; const n = Math.max(2, Math.ceil(pts.length * k)); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash(dash); ctx.lineDashOffset = -t * 40; ctx.beginPath(); pts.slice(0, n).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); };
  route([[540, 1240], [700, 1190], [820, 1030], [880, 820], [860, 580], [740, 400], [560, 345]], o.coast || 0, PAL.green, [26, 18]);
  route([[540, 1240], [560, 1000], [520, 780], [560, 560], [560, 345]], o.forest || 0, PAL.red, [26, 18]);
  if (o.cross) { const k = outBack(clamp(o.cross)); ctx.save(); ctx.translate(540, 800); ctx.scale(k, k); ctx.strokeStyle = PAL.red; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-90, -90); ctx.lineTo(90, 90); ctx.moveTo(90, -90); ctx.lineTo(-90, 90); ctx.stroke(); ctx.restore(); }
  const pin = (x, y, k, col, label) => { if (k <= 0) return; const a = outBack(clamp(k)), p = 1 + .08 * Math.sin(t * 6); ctx.save(); ctx.translate(x, y); ctx.scale(a * p, a * p);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -60, 40, Math.PI, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; ell(ctx, 0, -60, 16, 16); ctx.fill(); ctx.restore();
    if (label) { ctx.save(); ctx.globalAlpha = clamp(k); ctx.fillStyle = '#fff'; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.fillText(label, x, y + 50); ctx.restore(); } };
  pin(540, 1250, o.camp || 0, PAL.yellow, 'ЛАГЕРЬ');
  pin(560, 345, o.north || 0, PAL.red, 'ЭВАКУАЦИЯ');
}

// A wall of dark jungle with mist creeping out of it.
function jungle(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#0f1f17'], [1, '#07100b']]);
  const r = rng(o.seed || 51);
  for (let layer = 0; layer < 3; layer++) {
    const col = ['#11291b', '#173622', '#1d432a'][layer];
    for (let i = 0; i < 9; i++) { const x = r() * W, y = 300 + layer * 260 + r() * 300, h = 500 + r() * 500, sw = Math.sin(t * .8 + i + layer) * 10;
      ctx.fillStyle = shade(col, -.3); ctx.fillRect(x - 14, y, 28, H - y);
      ctx.fillStyle = col; for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .55; ctx.save(); ctx.translate(x + sw, y); ctx.rotate(a + Math.PI / 2); ctx.beginPath(); ctx.ellipse(0, -h * .18, h * .07, h * .2, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } }
  }
  if (o.mist) { for (let i = 0; i < 7; i++) { const u = (t * .05 + i / 7) % 1, x = lerp(-300, W + 300, u), y = 1100 + Math.sin(i * 2.3) * 300; glow(ctx, x, y, 420, 'rgba(170,190,180,1)', .18 * o.mist * Math.sin(Math.PI * u), 'source-over'); } }
}

// A backpack on the sand; o.radio puts the radio's aerial out of the top, o.cans hangs the tin cans on it.
function backpack(ctx, t, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ell(ctx, 0, 10, 260, 40); ctx.fill();
  if (o.radio) { ctx.strokeStyle = '#2a261c'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(60, -420); ctx.lineTo(130, -640); ctx.stroke(); ctx.fillStyle = '#4a4436'; rrect(ctx, -10, -470, 160, 110, 14); ctx.fill(); ctx.fillStyle = Math.sin(t * 6) > 0 ? PAL.red : '#4a1a16'; ell(ctx, 120, -440, 10, 10); ctx.fill(); }
  ctx.fillStyle = '#5b6b3a'; rrect(ctx, -200, -420, 400, 430, 90); ctx.fill(); ctx.fillStyle = '#4b5a2f'; rrect(ctx, -150, -200, 300, 170, 40); ctx.fill();
  ctx.fillStyle = '#3d4a26'; rrect(ctx, -200, -430, 400, 90, [90, 90, 20, 20]); ctx.fill();
  ctx.strokeStyle = '#2d3720'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-150, -110); ctx.lineTo(150, -110); ctx.stroke();
  if (o.cans) for (let i = 0; i < 4; i++) {
    const a = clamp(o.cans * 4 - i); if (a <= 0) continue;
    ctx.save(); ctx.translate(-150 + i * 100, -110); ctx.rotate(Math.sin(t * 3 + i * 1.7) * (.08 + (o.swing || 0) * .5)); ctx.scale(a, a);
    ctx.strokeStyle = '#d8c9a4'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke();
    ctx.fillStyle = '#b9bec6'; rrect(ctx, -28, 60, 56, 70, 8); ctx.fill(); ctx.fillStyle = ['#b5503c', '#c9a23a', '#3f7a5a'][i % 3]; ctx.fillRect(-28, 76, 56, 32);
    ctx.restore();
  }
  ctx.restore();
}
