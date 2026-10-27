// The "tracksuit" look: a guy in a blue tracksuit and his ginger cat, flat grainy sets, fat outlined captions,
// pill badges, meters, a security-camera view and the like-or-comment end card. Loaded after flat.js.
'use strict';

const SUIT = {
  skin: '#f1c6a0', skinD: '#d9a27c', hair: '#4a2a17', suit: '#2c4aa8', suitD: '#213a88', stripe: '#eef1f7',
  shoe: '#3a3a40', mouth: '#5a1e1e',
};
const ZED = { skin: '#a3b48e', skinD: '#869a73', hair: '#2b2b26', suit: '#55615a', suitD: '#46514a', stripe: null, shoe: '#2a2a2a', mouth: '#2a0f0f' };
const TSC = { w: '#ffffff', y: '#ffd23f', r: '#ff3b30', n: '#4cd964', ink: '#111111' };
const MONT = 'Montserrat';
(window.LOADING = window.LOADING || []).push(new FontFace(MONT, 'url(fonts/Montserrat.ttf)', { weight: '100 900' }).load().then(f => document.fonts.add(f)));

// ---------- the guy ----------

// A flat figure in a tracksuit: big round head, bowl haircut, dot eyes, white stripes down the arms and legs.
// (x, y) = feet on the ground, h = height. p: face (1 right, -1 left, 0 front), lean, head [dx, dy], crouch,
// sit (1 on a chair, 'floor' knees up), armL/armR/legL/legR [angle, bend] (0 = straight down, + towards x),
// eyes ('dot', 'wide', 'closed', 'happy', 'zed'), look / lookY (-1..1), mouth (0..1), tears, shake, idle, hold(ctx, hand).
// Returns { head, R, hands: { L, R } } in canvas pixels.
function guy(ctx, x, y, h, p = {}, L = SUIT) {
  const now = window.NOW || 0, seed = (p.seed || 0) + hashStr(L.suit + L.skin), idle = p.idle !== false;
  const f = p.face ?? 1, side = f !== 0, s = f || 1;
  if (p.shake) x += (noise1(now * 30 + seed) - .5) * h * .012 * p.shake;
  const U = (u, v) => [x + u * h, y + v * h], dir = a => [Math.sin(a), Math.cos(a)];
  const crouch = p.crouch || 0, legLen = .205, floor = p.sit === 'floor';
  const lean = (p.lean || 0) + (idle ? Math.sin(now * 1.7 + seed) * .01 : 0);
  const hip = [p.dx || 0, p.hipY ?? (floor ? -.07 : p.sit ? -.27 : -(2 * legLen + .02) * (1 - crouch * .4))];
  const breath = idle ? Math.sin(now * 2.4 + seed) * .004 : 0, torso = .3;
  const neck = [hip[0] + Math.sin(lean) * torso, hip[1] - Math.cos(lean) * torso - breath];
  const R = .118, hd = p.head || [0, 0];
  const head = [neck[0] + Math.sin(lean) * .02 + hd[0], neck[1] - R * .9 + hd[1]];
  const line = (pts, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w * h; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((q, i) => { const [a, b] = U(...q); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.stroke(); };
  // a lampas: the white stripe along a limb, a little to one side of its middle
  const stripe = (pts, off) => { if (!L.stripe) return; const q = pts.map(([u, v], i) => { const [a, b] = pts[Math.min(i + 1, pts.length - 1)], [c, d] = pts[Math.max(i - 1, 0)], dx = a - c, dy = b - d, n = Math.hypot(dx, dy) || 1; return [u - dy / n * off, v + dx / n * off]; }); line(q, .009, L.stripe); };
  const leg = (k, a, col) => {
    let [ah, ak] = a || [0, 0];
    if (floor && !a) { ah = s * (Math.PI - .62) + k * .04; ak = -s * 2.15; }
    if (p.sit === 1 && !a) { ah = s * 1.5; ak = -s * 1.5; }
    const j = [hip[0] + (side ? .015 * k : .042 * k), hip[1]], d1 = dir(ah), sq = 1 - crouch * .35;
    const kn = [j[0] + d1[0] * legLen, j[1] + d1[1] * legLen * sq], d2 = dir(ah + ak), an = [kn[0] + d2[0] * legLen, kn[1] + d2[1] * legLen * sq];
    line([j, kn, an], .07, col); stripe([j, kn, an], .02 * (side ? s : k));
    ctx.fillStyle = L.shoe;
    if (side) { const [sx, sy] = U(an[0], an[1]); rrect(ctx, sx - .03 * h + Math.min(0, s) * .05 * h, sy - .012 * h, .1 * h, .042 * h, .02 * h); ctx.fill(); }
    else { const [sx, sy] = U(an[0] + k * .01, an[1] + .01); ell(ctx, sx, sy, .045 * h, .022 * h); ctx.fill(); }
    return an;
  };
  const arm = (k, a, col) => {
    const [as, ae] = a || [.08 * k * (side ? 0 : 1), 0];
    const j = [neck[0] + (side ? -.01 * s : .088 * k), neck[1] + .035], d1 = dir(as), el = [j[0] + d1[0] * .165, j[1] + d1[1] * .165];
    const d2 = dir(as + ae), wr = [el[0] + d2[0] * .155, el[1] + d2[1] * .155];
    line([j, el, wr], .054, col); stripe([j, el, wr], .014 * (side ? s : k));
    const hn = U(wr[0] + d2[0] * .012, wr[1] + d2[1] * .012);
    ctx.fillStyle = L.skin; ell(ctx, hn[0], hn[1], .03 * h, .03 * h); ctx.fill();
    return { hand: hn, dir: as + ae };
  };
  const hands = {};
  if (side) { hands.L = arm(-1, p.armL, L.suitD); leg(-1, p.legL, L.suitD); leg(1, p.legR, L.suit); }
  else { leg(-1, p.legL, L.suit); leg(1, p.legR, L.suit); }
  // torso: a slightly narrower top, rounded shoulders, a zip down the front
  const tw = side ? .075 : .1, bw = side ? .07 : .085;
  const sh = [neck[0], neck[1] + .02], hp = [hip[0], hip[1] + .03];
  const nx = Math.cos(lean), ny = Math.sin(lean);
  ctx.fillStyle = L.suit; ctx.beginPath();
  const P = (c, w) => U(c[0] + nx * w, c[1] + ny * w);
  ctx.moveTo(...P(sh, -tw)); ctx.lineTo(...P(sh, tw)); ctx.lineTo(...P(hp, bw)); ctx.lineTo(...P(hp, -bw)); ctx.closePath(); ctx.fill();
  ctx.lineJoin = 'round'; ctx.strokeStyle = L.suit; ctx.lineWidth = .05 * h; ctx.stroke();
  if (!side && L.stripe) { ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = .006 * h; ctx.beginPath(); ctx.moveTo(...U(sh[0], sh[1] + .02)); ctx.lineTo(...U(hp[0], hp[1])); ctx.stroke(); }
  if (side) hands.R = arm(1, p.armR, L.suit);
  else { hands.L = arm(-1, p.armL, L.suit); hands.R = arm(1, p.armR, L.suit); }
  // neck and head
  ctx.fillStyle = L.skinD; const nk = U(neck[0], neck[1] - .02); rrect(ctx, nk[0] - .022 * h, nk[1] - .02 * h, .044 * h, .05 * h, .01 * h); ctx.fill();
  const [hx, hy] = U(...head), r = R * h;
  ctx.fillStyle = L.skin; ell(ctx, hx, hy, r, r); ctx.fill();
  // ear(s)
  ctx.fillStyle = L.skinD;
  if (side) { ell(ctx, hx - s * .14 * r, hy + .1 * r, .2 * r, .22 * r); ctx.fill(); } else for (const k of [-1, 1]) { ell(ctx, hx + k * .97 * r, hy + .12 * r, .14 * r, .2 * r); ctx.fill(); }
  // the bowl haircut: everything above a straight fringe, and lower down at the back
  ctx.save(); ctx.beginPath(); ctx.arc(hx - (side ? s * .04 * r : 0), hy - .03 * r, 1.06 * r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = L.hair; ctx.fillRect(hx - 1.2 * r, hy - 1.2 * r, 2.4 * r, (1.2 - .2) * r);
  if (side) { ctx.beginPath(); ctx.moveTo(hx - s * .3 * r, hy - .25 * r); ctx.lineTo(hx - s * .3 * r, hy - .05 * r); ctx.quadraticCurveTo(hx - s * .55 * r, hy + .35 * r, hx - s * 1.2 * r, hy + .45 * r); ctx.lineTo(hx - s * 1.2 * r, hy - .25 * r); ctx.closePath(); ctx.fill(); }
  else for (const k of [-1, 1]) { ctx.fillRect(k < 0 ? hx - 1.2 * r : hx + .82 * r, hy - .3 * r, .38 * r, .42 * r); }
  ctx.restore();
  // eyes: two white dots with black pupils, both on the side the face looks to
  let e = p.eyes || 'dot';
  if ((e === 'dot' || e === 'wide') && idle && blinking(now, seed)) e = 'closed';
  const ex = side ? [hx + s * .34 * r, hx + s * .72 * r] : [hx - .34 * r, hx + .34 * r], ey = hy + .06 * r;
  const lk = (p.look || 0) * .07 * r + (side ? s * .05 * r : 0), lky = (p.lookY || 0) * .07 * r;
  ex.forEach((cx, i) => {
    const sc = side && i === 1 ? .86 : 1, wr = (e === 'wide' ? .23 : .17) * r * sc;
    if (e === 'closed') { ctx.strokeStyle = TSC.ink; ctx.lineWidth = .05 * r; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - wr, ey); ctx.quadraticCurveTo(cx, ey + wr * .5, cx + wr, ey); ctx.stroke(); return; }
    if (e === 'happy') { ctx.strokeStyle = TSC.ink; ctx.lineWidth = .05 * r; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - wr, ey + wr * .3); ctx.quadraticCurveTo(cx, ey - wr * .7, cx + wr, ey + wr * .3); ctx.stroke(); return; }
    ctx.fillStyle = '#ffffff'; ell(ctx, cx, ey, wr, wr); ctx.fill();
    ctx.fillStyle = e === 'zed' ? '#6b7a5a' : TSC.ink; const pr = (e === 'wide' ? .085 : e === 'zed' ? .04 : .095) * r * sc;
    ell(ctx, cx + clamp(lk, -wr + pr, wr - pr), ey + clamp(lky, -wr + pr, wr - pr), pr, pr); ctx.fill();
  });
  if (p.tears) { ctx.fillStyle = 'rgba(140,200,255,0.9)'; ex.forEach((cx, i) => { const u = ((now * .7 + i * .45) % 1); ell(ctx, cx, ey + .25 * r + u * .5 * r, .06 * r, .09 * r); ctx.fill(); }); }
  // mouth: a line, or an "o" when shocked or talking
  const m = clamp(p.mouth || 0), mx = side ? hx + s * .56 * r : hx, my = hy + .52 * r;
  ctx.fillStyle = L.mouth;
  if (m > .05) { ell(ctx, mx, my, (.07 + .05 * m) * r, (.04 + .13 * m) * r); ctx.fill(); }
  else if (p.smile) { ctx.strokeStyle = L.mouth; ctx.lineWidth = .045 * r; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(mx - .14 * r, my - .03 * r); ctx.quadraticCurveTo(mx, my + .1 * r * p.smile, mx + .14 * r, my - .03 * r); ctx.stroke(); }
  else { ctx.fillRect(mx - .09 * r, my - .015 * r, .18 * r, .035 * r); }
  if (p.hold) p.hold(ctx, hands.R.hand, hands);
  return { head: [hx, hy], R: r, hands };
}

// A walking pose for guy(): legs and arms swing with phase ph.
function stride(ph, face = 1, amt = 1, extra = {}) {
  const sn = Math.sin(ph), c = Math.cos(ph);
  return Object.assign({
    legL: [.42 * sn * face * amt, -.7 * Math.max(0, -c) * face * amt], legR: [-.42 * sn * face * amt, -.7 * Math.max(0, c) * face * amt],
    armL: [-.35 * sn * face * amt, .3 * face], armR: [.35 * sn * face * amt, .3 * face],
  }, extra);
}

// ---------- the cat ----------

// A ginger tabby sitting, facing f. o: mood ('calm', 'alert', 'hiss'), look, blinkSeed.
function kot(ctx, t, x, y, s, o = {}) {
  const f = o.face ?? 1, mood = o.mood || 'calm', hiss = mood === 'hiss' ? 1 : 0;
  const C = { fur: '#e3893b', dark: '#b8622a', light: '#f6c68f', nose: '#e88a8a' };
  ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
  // tail curling up behind
  const tw = Math.sin(t * 2.3 + (o.seed || 0)) * .25 * (1 - hiss) + hiss * Math.sin(t * 14) * .06;
  ctx.strokeStyle = C.fur; ctx.lineWidth = 16 * (1 + hiss * .6); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-40, -10); ctx.quadraticCurveTo(-110, -20, -100 + tw * 40, -90 - hiss * 30); ctx.stroke();
  ctx.strokeStyle = C.dark; ctx.lineWidth = 16 * (1 + hiss * .6); ctx.beginPath(); ctx.moveTo(-100 + tw * 40, -90 - hiss * 30); ctx.lineTo(-96 + tw * 42, -106 - hiss * 30); ctx.stroke();
  // body: a pear, arched and puffed when hissing
  ctx.fillStyle = C.fur; ctx.beginPath(); ctx.moveTo(-50, 0); ctx.quadraticCurveTo(-60, -90 - hiss * 30, 0, -110 - hiss * 20); ctx.quadraticCurveTo(50, -90, 46, 0); ctx.closePath(); ctx.fill();
  if (hiss) { ctx.strokeStyle = C.fur; ctx.lineWidth = 6; for (let i = 0; i < 9; i++) { const a = Math.PI * (.15 + i / 10); ctx.beginPath(); ctx.moveTo(Math.cos(a) * -50, -60 - Math.sin(a) * 50); ctx.lineTo(Math.cos(a) * -62, -66 - Math.sin(a) * 62); ctx.stroke(); } }
  ctx.fillStyle = C.light; ctx.beginPath(); ctx.ellipse(18, -40, 20, 36, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.dark; ctx.lineWidth = 6; for (const k of [0, 1, 2]) { ctx.beginPath(); ctx.arc(-18, -60 + k * 22, 18, Math.PI * .7, Math.PI * 1.3); ctx.stroke(); }
  ctx.fillStyle = C.fur; ell(ctx, -26, -6, 18, 10); ctx.fill(); ell(ctx, 26, -6, 18, 10); ctx.fill();
  // head
  const hx = 14, hy = -130 - hiss * 10, earBack = hiss ? .9 : mood === 'alert' ? .2 : 0;
  ctx.fillStyle = C.fur;
  for (const k of [-1, 1]) { ctx.save(); ctx.translate(hx + k * 26, hy - 26); ctx.rotate(k * (.25 + earBack * 1.1)); poly(ctx, [[-16, 8], [16, 8], [k * 4, -34 + earBack * 14]]); ctx.fill(); ctx.fillStyle = C.nose; poly(ctx, [[-8, 4], [8, 4], [k * 3, -20 + earBack * 10]]); ctx.fill(); ctx.fillStyle = C.fur; ctx.restore(); }
  ell(ctx, hx, hy, 44, 38); ctx.fill();
  ctx.strokeStyle = C.dark; ctx.lineWidth = 5; for (const k of [-12, 0, 12]) { ctx.beginPath(); ctx.moveTo(hx + k, hy - 36); ctx.lineTo(hx + k * .7, hy - 22); ctx.stroke(); }
  // face
  const wide = mood !== 'calm', bl = !hiss && blinking(t, 77 + (o.seed || 0));
  for (const k of [-1, 1]) {
    const ex = hx + 6 + k * 17, ey = hy - 4;
    if (bl) { ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ex - 7, ey); ctx.lineTo(ex + 7, ey); ctx.stroke(); continue; }
    if (hiss) { ctx.fillStyle = '#ffe680'; poly(ctx, [[ex - 10, ey - 6 * -k], [ex + 10, ey + 6 * -k], [ex + 9, ey + 8], [ex - 9, ey + 4]]); ctx.fill(); ctx.fillStyle = '#111'; ell(ctx, ex, ey + 2, 2.5, 6); ctx.fill(); continue; }
    if (wide) { ctx.fillStyle = '#ffe680'; ell(ctx, ex, ey, 10, 10); ctx.fill(); }
    ctx.fillStyle = '#1a1208'; ell(ctx, ex + (o.look || 0) * 3, ey, wide ? 5 : 5, wide ? 8 : 6); ctx.fill();
  }
  ctx.fillStyle = C.nose; poly(ctx, [[hx + 1, hy + 8], [hx + 11, hy + 8], [hx + 6, hy + 14]]); ctx.fill();
  if (hiss) { ctx.fillStyle = '#5a1a1a'; ell(ctx, hx + 6, hy + 24, 14, 10); ctx.fill(); ctx.fillStyle = '#fff'; poly(ctx, [[hx - 6, hy + 16], [hx - 1, hy + 16], [hx - 3, hy + 26]]); ctx.fill(); poly(ctx, [[hx + 13, hy + 16], [hx + 18, hy + 16], [hx + 15, hy + 26]]); ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2; for (const k of [-1, 1]) for (const d of [-4, 4]) { ctx.beginPath(); ctx.moveTo(hx + 6 + k * 12, hy + 12 + d * .5); ctx.lineTo(hx + 6 + k * 42, hy + 8 + d * 2); ctx.stroke(); }
  ctx.restore();
}

// A pet carrier with the cat looking out through the grille. (x, y) = bottom middle.
function carrier(ctx, t, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ell(ctx, 0, 6, 190, 18); ctx.fill();
  ctx.fillStyle = '#8fa3b5'; rrect(ctx, -180, -230, 360, 230, 40); ctx.fill();
  ctx.fillStyle = '#7b90a3'; rrect(ctx, -180, -120, 360, 120, [0, 0, 40, 40]); ctx.fill();
  ctx.strokeStyle = '#6c8093'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-70, -230); ctx.quadraticCurveTo(0, -300, 70, -230); ctx.stroke();
  // the door: dark inside, the cat, bars in front
  ctx.save(); rrect(ctx, -120, -200, 240, 180, 26); ctx.clip();
  ctx.fillStyle = '#1d2228'; ctx.fillRect(-130, -210, 260, 200);
  kot(ctx, t, 10, 30, 1.05, Object.assign({ face: -1 }, o));
  ctx.restore();
  ctx.strokeStyle = '#d8dee4'; ctx.lineWidth = 8; for (let i = -100; i <= 100; i += 33) { ctx.beginPath(); ctx.moveTo(i, -196); ctx.lineTo(i, -24); ctx.stroke(); }
  ctx.lineWidth = 12; rrect(ctx, -120, -200, 240, 180, 26); ctx.stroke();
  ctx.restore();
}

// ---------- the look of a frame ----------

// A flat wall with fine vertical stripes (wallpaper) or bricks, slightly mottled.
function wallpaper(ctx, x, y, w, h, col, stripes = 0) {
  ctx.fillStyle = col; ctx.fillRect(x, y, w, h);
  if (stripes) { ctx.fillStyle = 'rgba(0,0,0,0.05)'; for (let i = x; i < x + w; i += stripes * 2) ctx.fillRect(i, y, stripes, h); }
}
function bricks(ctx, x, y, w, h, col, bw = 120, bh = 50) {
  ctx.fillStyle = col; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 4;
  for (let r = 0, yy = y; yy < y + h; r++, yy += bh) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); for (let xx = x + (r % 2) * bw / 2; xx < x + w; xx += bw) { ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + bh); ctx.stroke(); } }
}

// ---------- text ----------

function outlined(ctx, text, x, y, size, col, o = {}) {
  ctx.font = `900 ${size}px ${MONT}`; ctx.textBaseline = 'middle'; ctx.textAlign = o.align || 'center'; ctx.lineJoin = 'round'; ctx.miterLimit = 2;
  ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowOffsetY = size * .07; ctx.shadowBlur = 0;
  ctx.strokeStyle = TSC.ink; ctx.lineWidth = size * (o.stroke ?? .19); ctx.strokeText(text, x, y);
  ctx.shadowColor = 'transparent'; ctx.fillStyle = col; ctx.fillText(text, x, y);
}

// Fat captions: one to three words at a time, white with a thick black outline, key words in colour.
function fatCaps(ctx, t, y = 1270, size = 76) {
  if (typeof CAPS === 'undefined') return;
  const c = CAPS.find(c => t >= c[0] && t < c[1]);
  if (!c) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `900 ${size}px ${MONT}`;
  if (!c.fat) {
    const gap = ctx.measureText(' ').width * 1.9, maxW = W - 120, rows = [[]];
    let wsum = 0;
    for (const w of c[2]) { const ww = ctx.measureText(w[0]).width; if (rows[rows.length - 1].length && wsum + gap + ww > maxW) { rows.push([]); wsum = 0; } wsum += (rows[rows.length - 1].length ? gap : 0) + ww; rows[rows.length - 1].push([w, ww]); }
    c.fat = rows.map(r => ({ r, width: r.reduce((a, [, ww]) => a + ww, 0) + gap * (r.length - 1), gap }));
  }
  const age = t - c[0], k = clamp(age / .14), sc = .78 + .22 * outBack(k);
  ctx.translate(W / 2, y); ctx.scale(sc, sc);
  const lh = size * 1.18, y0 = -(c.fat.length - 1) * lh / 2;
  c.fat.forEach((row, i) => { let x = -row.width / 2; for (const [w, ww] of row.r) { outlined(ctx, w[0], x, y0 + i * lh, size, TSC[w[2]] || TSC.w, { align: 'left' }); x += ww + row.gap; } });
  ctx.restore();
}

// The two-line title at the top: a small white line over a big yellow one.
function topTitle(ctx, small, big, k = 1, y = 230) {
  if (k <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(k * 2);
  const sc = .8 + .2 * outBack(clamp(k)); ctx.translate(W / 2, y); ctx.scale(sc, sc);
  const fit = (text, size) => { ctx.font = `900 ${size}px ${MONT}`; return Math.min(size, size * (W - 90) / ctx.measureText(text).width); };
  if (small) outlined(ctx, small, 0, -62, fit(small, 54), TSC.w);
  if (big) outlined(ctx, big, 0, 20, fit(big, 104), TSC.y);
  ctx.restore();
}

// A pill badge. kind: dark, yellow, red, blue, green, white; o.icon: warn, check, cross, drop, dot, down, up, bolt.
const PILL = { dark: ['#1f2226', '#ffffff'], yellow: ['#f6c533', '#1a1a1a'], red: ['#d7342c', '#ffffff'], blue: ['#2f6fd6', '#ffffff'], green: ['#2e9e4a', '#ffffff'], white: ['#ffffff', '#141414'], orange: ['#e3893b', '#ffffff'] };
function pill(ctx, x, y, text, kind = 'dark', k = 1, o = {}) {
  if (k <= 0) return;
  const [bg, fg] = PILL[kind] || PILL.dark, size = o.size || 36, hgt = size * 1.75;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `900 ${size}px ${MONT}`;
  const tw = ctx.measureText(text).width, iw = o.icon ? size * 1.05 : 0, w = tw + iw + size * 1.4;
  const cx = o.align === 'left' ? x + w / 2 : x, a = outBack(clamp(k));
  ctx.translate(cx, y); ctx.scale(a, a); ctx.globalAlpha = clamp(k * 3);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; rrect(ctx, -w / 2, -hgt / 2 + 6, w, hgt, hgt / 2); ctx.fill();
  ctx.fillStyle = bg; rrect(ctx, -w / 2, -hgt / 2, w, hgt, hgt / 2); ctx.fill();
  const ix = -w / 2 + size * .7 + iw / 2 - size * .1;
  if (o.icon) icon2(ctx, o.icon, ix, 0, size * .9, fg, bg);
  ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, -w / 2 + size * .7 + iw, size * .04);
  ctx.restore();
}

// Small icons drawn by hand (no emoji font needed), centred at (x, y), about s across.
function icon2(ctx, kind, x, y, s, col, bg = '#000') {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = s * .16;
  if (kind === 'warn') { poly(ctx, [[0, -s * .48], [s * .52, s * .42], [-s * .52, s * .42]]); ctx.fill(); ctx.fillStyle = bg; ctx.fillRect(-s * .05, -s * .15, s * .1, s * .32); ell(ctx, 0, s * .3, s * .06, s * .06); ctx.fill(); }
  if (kind === 'check') { ctx.beginPath(); ctx.moveTo(-s * .38, 0); ctx.lineTo(-s * .1, s * .28); ctx.lineTo(s * .4, -s * .3); ctx.stroke(); }
  if (kind === 'cross') { ctx.beginPath(); ctx.moveTo(-s * .3, -s * .3); ctx.lineTo(s * .3, s * .3); ctx.moveTo(s * .3, -s * .3); ctx.lineTo(-s * .3, s * .3); ctx.stroke(); }
  if (kind === 'drop') { ctx.beginPath(); ctx.moveTo(0, -s * .5); ctx.quadraticCurveTo(s * .45, 0, s * .3, s * .3); ctx.arc(0, s * .2, s * .32, .3, Math.PI - .3); ctx.quadraticCurveTo(-s * .45, 0, 0, -s * .5); ctx.fill(); }
  if (kind === 'dot') { ctx.fillStyle = '#ff3b30'; ell(ctx, 0, 0, s * .3, s * .3); ctx.fill(); }
  if (kind === 'down' || kind === 'up') { const d = kind === 'down' ? 1 : -1; poly(ctx, [[-s * .4, -s * .2 * d], [s * .4, -s * .2 * d], [0, s * .35 * d]]); ctx.fill(); }
  if (kind === 'bolt') poly(ctx, [[s * .1, -s * .5], [-s * .3, s * .08], [-s * .02, s * .08], [-s * .12, s * .5], [s * .3, -s * .1], [s * .02, -s * .1]]), ctx.fill();
  if (kind === 'battery') { ctx.lineWidth = s * .1; rrect(ctx, -s * .45, -s * .25, s * .8, s * .5, s * .08); ctx.stroke(); ctx.fillRect(s * .38, -s * .1, s * .1, s * .2); ctx.fillStyle = '#ff3b30'; ctx.fillRect(-s * .36, -s * .16, s * .14, s * .32); }
  ctx.restore();
}

// A labelled meter: label pill and a bar filled to v (0..1).
function meter(ctx, x, y, w, label, v, col = '#3fbf5a', k = 1) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(k * 2);
  pill(ctx, x, y, label, 'dark', 1, { align: 'left', size: 30 });
  ctx.font = `900 30px ${MONT}`; const lw = ctx.measureText(label).width + 30 * 1.4 + 18;
  ctx.fillStyle = '#1f2226'; rrect(ctx, x + lw, y - 22, w, 44, 8); ctx.fill();
  ctx.fillStyle = col; rrect(ctx, x + lw + 6, y - 16, (w - 12) * clamp(v), 32, 5); ctx.fill();
  ctx.restore();
}

// ---------- the security camera ----------

// Turns whatever is drawn into a night-vision camera picture and adds its marks. o: cam, time, live, nosignal, glitch.
function cctv(ctx, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  tint(ctx, '#808080', 1, 'saturation'); tint(ctx, '#a8c3a0', .9, 'multiply'); tint(ctx, '#1d2a1e', .5, 'lighten');
  if (o.glitch) { const [c, x] = scratch('cctvglitch', W, H); x.drawImage(ctx.canvas, 0, 0); const r = rng(Math.floor(t * 12)); for (let i = 0; i < 8; i++) { const y = r() * H, hh = 20 + r() * 90; ctx.drawImage(c, 0, y, W, hh, (r() - .5) * 80 * o.glitch, y, W, hh); } ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .25 * o.glitch; ctx.drawImage(c, 8, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  if (o.nosignal) { const r = rng(Math.floor(t * 24)); ctx.globalAlpha = o.nosignal; for (let i = 0; i < 2200; i++) { const v = r() * 255 | 0; ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fillRect(r() * W, r() * H, 6, 3); } ctx.fillStyle = 'rgba(20,24,20,0.6)'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; outlined(ctx, 'НЕТ СИГНАЛА', W / 2, H * .42, 80, '#e8efe6', { stroke: .18 }); }
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 2);
  ctx.strokeStyle = 'rgba(235,245,235,0.85)'; ctx.lineWidth = 6; const m = 50, L = 70;
  for (const [cx, cy, dx, dy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) { ctx.beginPath(); ctx.moveTo(cx, cy + dy * L); ctx.lineTo(cx, cy); ctx.lineTo(cx + dx * L, cy); ctx.stroke(); }
  ctx.font = `800 34px ${MONT}`; ctx.fillStyle = 'rgba(235,245,235,0.9)'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(o.cam || 'CAM 1', m + 30, m + 40);
  ctx.textAlign = 'right'; ctx.fillText('REC', W - m - 30, m + 40); if (Math.sin(t * 6) > -.2) { ctx.fillStyle = '#ff3b30'; ell(ctx, W - m - 120, m + 40, 11, 11); ctx.fill(); }
  if (o.time) { ctx.fillStyle = 'rgba(235,245,235,0.9)'; ctx.font = `700 34px ${MONT}`; ctx.fillText(o.time, W - m - 30, H - m - 40); }
  if (o.live) pill(ctx, W / 2, 150, 'LIVE', 'red', 1, { size: 30 });
  ctx.restore();
}

// ---------- the end card ----------

// "What would you do?": green half for a like, red half for a comment, zombie hands reaching up from below.
function choiceCard(ctx, t, lt, o) {
  vgrad(ctx, 0, 0, W / 2, H, [[0, '#123a22'], [1, '#0b2616']]); ctx.save(); ctx.translate(W / 2, 0); vgrad(ctx, 0, 0, W / 2, H, [[0, '#3d1214'], [1, '#26090b']]); ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(W / 2 - 3, 0, 6, H);
  ctx.save(); const qk = outBack(clamp(lt / .3)); ctx.translate(W / 2, 330); ctx.scale(qk, qk); outlined(ctx, 'ЧТО БЫ', 0, -55, 88, TSC.w); outlined(ctx, 'ТЫ СДЕЛАЛ?', 0, 45, 88, TSC.y); ctx.restore();
  const side = (cx, k, label, draw, word, col) => {
    if (k <= 0) return; const a = outBack(clamp(k));
    ctx.save(); ctx.translate(cx, 0); ctx.globalAlpha = clamp(k * 2);
    outlined(ctx, label, 0, 640, 48, TSC.w, { stroke: .2 });
    ctx.save(); ctx.translate(0, 840); ctx.scale(a * (1 + .05 * Math.sin(t * 5)), a * (1 + .05 * Math.sin(t * 5))); draw(); ctx.restore();
    outlined(ctx, word, 0, 1040, 56, col, { stroke: .2 });
    ctx.restore();
  };
  side(W / 4, o.left, o.leftLabel, () => { ctx.fillStyle = '#ff3b5c'; ctx.beginPath(); ctx.moveTo(0, 90); ctx.bezierCurveTo(-170, -20, -110, -150, 0, -70); ctx.bezierCurveTo(110, -150, 170, -20, 0, 90); ctx.fill(); }, 'ЛАЙК', '#ff3b5c');
  side(W * 3 / 4, o.right, o.rightLabel, () => { ctx.fillStyle = '#ffffff'; rrect(ctx, -120, -90, 240, 160, 50); ctx.fill(); poly(ctx, [[-40, 60], [0, 60], [-70, 120]]); ctx.fill(); ctx.fillStyle = '#26090b'; for (const k of [-1, 0, 1]) { ell(ctx, k * 55, -10, 16, 16); ctx.fill(); } }, 'КОММЕНТ', TSC.w);
  // hands rising out of the ground
  for (const [hx, ph] of [[150, 0], [430, 1.3], [690, 2.1], [930, .7]]) {
    const up = clamp((lt - .3) / 2.5), yb = H + 40 - up * 260 - Math.sin(t * 2 + ph) * 14;
    ctx.save(); ctx.translate(hx, yb); ctx.rotate(Math.sin(t * 1.6 + ph) * .08);
    ctx.fillStyle = ZED.suitD; ctx.fillRect(-34, 60, 68, 300); ctx.fillStyle = ZED.skin; rrect(ctx, -30, -40, 60, 110, 20); ctx.fill();
    for (let i = 0; i < 4; i++) { rrect(ctx, -30 + i * 16, -100 - (i % 3) * 8, 13, 70, 6); ctx.fill(); } rrect(ctx, 22, -50, 14, 50, 6); ctx.fill();
    ctx.restore();
  }
}
