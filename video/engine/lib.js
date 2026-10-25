// Drawing helpers shared by all episodes. Everything is deterministic:
// a frame depends only on its time, so frames can be rendered in any order.
'use strict';
const W = 1920, H = 1080;

function rng(seed) {
  let a = seed | 0;
  return () => {
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const inout = t => (t = clamp(t), t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outc = t => 1 - Math.pow(1 - clamp(t), 3);
const inc = t => Math.pow(clamp(t), 3);
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const hash1 = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const noise1 = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash1(i), hash1(i + 1), u); };
const fbm = x => noise1(x) * .5 + noise1(x * 2.03 + 13) * .3 + noise1(x * 4.11 + 29) * .2;
// Light flicker around 1: amount is the depth, speed in cycles per second.
const flicker = (t, amount = .15, speed = 6, seed = 0) => 1 - amount * fbm(t * speed + seed * 17.3);

function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

// Grayscale fractal value noise, used as a surface texture.
function noiseTex(w, h, { seed = 1, scale = 64, oct = 4, contrast = 1.4, sx = 1, sy = 1 } = {}) {
  const c = mk(w, h), x = c.getContext('2d'), img = x.createImageData(w, h), d = img.data, r = rng(seed);
  const octs = [];
  for (let o = 0; o < oct; o++) {
    const s = scale / (2 ** o), gw = Math.ceil(w / (s * sx)) + 2, gh = Math.ceil(h / (s * sy)) + 2, g = new Float32Array(gw * gh);
    for (let i = 0; i < g.length; i++) g[i] = r();
    octs.push({ s, gw, g, a: 1 / (1.7 ** o) });
  }
  const tot = octs.reduce((a, o) => a + o.a, 0);
  for (let y = 0; y < h; y++) for (let X = 0; X < w; X++) {
    let v = 0;
    for (const o of octs) {
      const fx = X / (o.s * sx), fy = y / (o.s * sy), ix = fx | 0, iy = fy | 0, tx = fx - ix, ty = fy - iy;
      const ux = tx * tx * (3 - 2 * tx), uy = ty * ty * (3 - 2 * ty), i = iy * o.gw + ix, g = o.g;
      v += o.a * lerp(lerp(g[i], g[i + 1], ux), lerp(g[i + o.gw], g[i + o.gw + 1], ux), uy);
    }
    v = clamp((v / tot - .5) * contrast + .5) * 255;
    const k = (y * w + X) * 4; d[k] = d[k + 1] = d[k + 2] = v; d[k + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  return c;
}

// Multiply a texture over a region: grime, plaster, fabric.
function grime(ctx, tex, x, y, w, h, alpha = .35, op = 'multiply') {
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = op;
  ctx.drawImage(tex, x, y, w, h); ctx.restore();
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
}
function ell(ctx, x, y, rx, ry, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, Math.PI * 2); }
function poly(ctx, pts, close = true) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (close) ctx.closePath();
}

// Soft light: radial glow added on top.
function glow(ctx, x, y, r, color, alpha = 1, op = 'lighter') {
  ctx.save(); ctx.globalCompositeOperation = op; ctx.globalAlpha = alpha;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
function vgrad(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
}

// Tapered capsule between two points.
function seg(ctx, x1, y1, x2, y2, r1, r2) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1e-6, nx = -dy / L, ny = dx / L;
  poly(ctx, [[x1 + nx * r1, y1 + ny * r1], [x2 + nx * r2, y2 + ny * r2], [x2 - nx * r2, y2 - ny * r2], [x1 - nx * r1, y1 - ny * r1]]); ctx.fill();
  ell(ctx, x1, y1, r1, r1); ctx.fill(); ell(ctx, x2, y2, r2, r2); ctx.fill();
}

// Human silhouette. (x, y) is the point between the feet, h the full height in px.
// Angles are radians from straight down; positive turns the limb toward +x.
// pose: lean, head [dx,dy], armL/armR [shoulder, elbow], legL/legR [hip, knee], crouch, breathe
// build: view 'front'|'side', face ±1 (side view), bulk, coat, hood, hair, pack, child, prop
function figure(ctx, x, y, h, pose = {}, build = {}) {
  const p = pose, b = build, side = b.view === 'side', f = b.face || 1, bulk = b.bulk || 1;
  const C = (u, v) => [x + u * h, y + v * h], dir = a => [Math.sin(a), Math.cos(a)];
  const crouch = p.crouch || 0, lean = p.lean || 0, br = p.breathe || 0, hd = p.head || [0, 0];
  const hip = [p.dx || 0, -0.5 + crouch * 0.2];
  const neck = [hip[0] + Math.sin(lean) * 0.29, hip[1] - Math.cos(lean) * 0.29 - br * 0.004];
  const hs = (b.child ? 1.2 : 1) * (b.head || 1);
  const head = [neck[0] + Math.sin(lean) * 0.03 + hd[0] + (side ? 0.012 * f : 0), neck[1] - 0.082 * hs + hd[1]];
  const sh = (side ? 0.058 : 0.114) * bulk, wa = (side ? 0.056 : 0.086) * bulk, hi = (side ? 0.062 : 0.094) * bulk;
  // legs (drawn first; the jacket hem covers their tops)
  const leg = (k, a) => {
    const [ah, ak] = a || [0, 0], sq = 1 - crouch * 0.25;
    const j = [hip[0] + (side ? 0.01 * k : 0.046 * k), hip[1]];
    const d1 = dir(ah), kn = [j[0] + d1[0] * 0.25, j[1] + d1[1] * 0.25 * sq];
    const d2 = dir(ah + ak), an = [kn[0] + d2[0] * 0.235, kn[1] + d2[1] * 0.235 * sq];
    seg(ctx, ...C(...j), ...C(...kn), 0.058 * h * bulk, 0.04 * h * bulk);
    seg(ctx, ...C(...kn), ...C(...an), 0.04 * h * bulk, 0.026 * h);
    if (side) seg(ctx, ...C(an[0] - 0.012 * f, an[1] - 0.004), ...C(an[0] + 0.058 * f, an[1] + 0.012), 0.024 * h, 0.017 * h);
    else { ell(ctx, ...C(an[0] + 0.006 * k, an[1] + 0.01), 0.03 * h, 0.017 * h); ctx.fill(); }
  };
  leg(-1, p.legL); leg(1, p.legR);
  if (b.coat) {
    const cl = b.coat;
    poly(ctx, [C(hip[0] - wa, hip[1] - 0.08), C(hip[0] + wa, hip[1] - 0.08),
      C(hip[0] + hi + 0.035 * cl, hip[1] + 0.1 + 0.14 * cl), C(hip[0] - hi - 0.035 * cl, hip[1] + 0.1 + 0.14 * cl)]); ctx.fill();
  }
  // arms hang from joints inside the torso outline, so the shoulders stay smooth
  const arm = (k, a) => {
    const [as, ae] = a || [0.06 * k, 0];
    const j = [neck[0] + (side ? 0.004 * k : (sh - 0.042 * bulk) * k), neck[1] + 0.062];
    const d1 = dir(as), el = [j[0] + d1[0] * 0.16, j[1] + d1[1] * 0.16];
    const d2 = dir(as + ae), wr = [el[0] + d2[0] * 0.145, el[1] + d2[1] * 0.145];
    seg(ctx, ...C(...j), ...C(...el), 0.036 * h * bulk, 0.029 * h * bulk);
    seg(ctx, ...C(...el), ...C(...wr), 0.029 * h * bulk, 0.021 * h);
    const hn = [wr[0] + d2[0] * 0.03, wr[1] + d2[1] * 0.03];
    ell(ctx, ...C(...hn), 0.02 * h, 0.036 * h, -(as + ae)); ctx.fill();
    return { hand: hn, dir: as + ae };
  };
  const hl = arm(-1, p.armL), hr = arm(1, p.armR);
  // jacket: sloped shoulders, a slight waist and a hem over the hips
  const lx = Math.sin(lean) * 0.12;
  ctx.beginPath();
  ctx.moveTo(...C(neck[0] - 0.034, neck[1] - 0.012));
  ctx.quadraticCurveTo(...C(neck[0] - sh * 0.75, neck[1] + 0.004), ...C(neck[0] - sh, neck[1] + 0.05));
  ctx.quadraticCurveTo(...C(neck[0] - sh * 1.02, neck[1] + 0.09), ...C(neck[0] - sh + 0.012, neck[1] + 0.13));
  ctx.lineTo(...C(hip[0] - wa + lx, hip[1] - 0.1));
  ctx.lineTo(...C(hip[0] - hi - 0.006, hip[1] + 0.055));
  ctx.lineTo(...C(hip[0] + hi + 0.006, hip[1] + 0.055));
  ctx.lineTo(...C(hip[0] + wa + lx, hip[1] - 0.1));
  ctx.lineTo(...C(neck[0] + sh - 0.012, neck[1] + 0.13));
  ctx.quadraticCurveTo(...C(neck[0] + sh * 1.02, neck[1] + 0.09), ...C(neck[0] + sh, neck[1] + 0.05));
  ctx.quadraticCurveTo(...C(neck[0] + sh * 0.75, neck[1] + 0.004), ...C(neck[0] + 0.034, neck[1] - 0.012));
  ctx.closePath(); ctx.fill();
  if (b.pack) { rrect(ctx, ...C(neck[0] - (side ? 0.1 * (f > 0 ? 1 : 0) + 0.02 : sh * 0.8), neck[1] + 0.03), (side ? 0.08 : sh * 1.6) * h, 0.24 * h, 0.035 * h); ctx.fill(); }
  // neck and head
  seg(ctx, ...C(neck[0], neck[1] + 0.01), ...C(head[0] - (side ? 0.01 * f : 0), head[1] + 0.035), 0.027 * h, 0.024 * h);
  ell(ctx, ...C(...head), 0.05 * h * hs, 0.064 * h * hs); ctx.fill();
  if (side) { ell(ctx, ...C(head[0] + 0.034 * f * hs, head[1] + 0.022 * hs), 0.02 * h * hs, 0.028 * h * hs); ctx.fill(); }
  if (b.hood) { ell(ctx, ...C(head[0] - (side ? 0.014 * f : 0), head[1] - 0.004), 0.064 * h * hs, 0.078 * h * hs); ctx.fill(); }
  if (b.hair) {
    ctx.beginPath(); ctx.moveTo(...C(head[0] - 0.056 * hs, head[1] - 0.01));
    ctx.quadraticCurveTo(...C(head[0] - 0.07 * hs, head[1] + 0.09 * b.hair), ...C(head[0] - 0.035, head[1] + 0.12 * b.hair));
    ctx.lineTo(...C(head[0] + 0.035, head[1] + 0.12 * b.hair));
    ctx.quadraticCurveTo(...C(head[0] + 0.07 * hs, head[1] + 0.09 * b.hair), ...C(head[0] + 0.056 * hs, head[1] - 0.01));
    ctx.closePath(); ctx.fill();
  }
  const props = { L: hl, R: hr };
  if (b.prop) b.prop.forEach(pr => {
    const hnd = props[pr.hand || 'R'], a = pr.angle !== undefined ? pr.angle : hnd.dir, d = dir(a), [hx, hy] = C(...hnd.hand);
    if (pr.type === 'gun') { ctx.save(); ctx.translate(hx, hy); ctx.rotate(-a + Math.PI / 2); rrect(ctx, -0.02 * h, -0.014 * h, 0.36 * h, 0.026 * h, 3); ctx.fill(); rrect(ctx, -0.12 * h, -0.02 * h, 0.13 * h, 0.048 * h, 6); ctx.fill(); ctx.restore(); }
    if (pr.type === 'knife') { ctx.save(); ctx.translate(hx, hy); ctx.rotate(-a + Math.PI / 2); poly(ctx, [[0, -0.008 * h], [0.15 * h, -0.004 * h], [0.17 * h, 0.004 * h], [0, 0.01 * h]]); ctx.fill(); ctx.restore(); }
    if (pr.type === 'torch') seg(ctx, hx, hy, hx + d[0] * 0.09 * h, hy + d[1] * 0.09 * h, 0.014 * h, 0.02 * h);
  });
  return { head: C(...head), hl: C(...hl.hand), hr: C(...hr.hand), hs };
}

// Pair of glowing eyes on a head returned by figure().
function eyes(ctx, head, h, color = 'rgba(255,40,30,1)', k = 1, look = 0) {
  const r = h * 0.009 * k, dx = h * 0.02, y = head[1] - h * 0.004;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const s of [-1, 1]) { glow(ctx, head[0] + s * dx + look * h * .01, y, r * 7, color, .35 * k); ell(ctx, head[0] + s * dx + look * h * .01, y, r, r * .7); ctx.fillStyle = color; ctx.fill(); }
  ctx.restore();
}

// Damped oscillation after each impulse time; used for knocks and slams.
function shake(t, hits, amp = 6, freq = 38, decay = 9) {
  let x = 0, y = 0;
  for (const [tk, a = 1] of hits) {
    const d = t - tk; if (d < 0 || d > 1.2) continue;
    const e = Math.exp(-d * decay) * amp * a;
    x += e * Math.sin(d * freq * 6.283 + tk) * .6; y += e * Math.sin(d * freq * 6.283 * 1.13 + 1.7);
  }
  return [x, y];
}

// Floating dust motes in a box, deterministic in time.
function dust(ctx, t, n, box, seed, { size = 2.2, alpha = .5, color = '220,230,255', speed = 1, mask = null } = {}) {
  const r = rng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const px = r(), py = r(), ph = r() * 100, s = size * (.4 + r());
    const x = box[0] + ((px * box[2] + Math.sin(t * .23 * speed + ph) * 40 + t * 6 * speed * (r() - .3)) % box[2] + box[2]) % box[2];
    const y = box[1] + ((py * box[3] + Math.cos(t * .17 * speed + ph * 1.3) * 30 + t * 9 * speed) % box[3] + box[3]) % box[3];
    let a = alpha * (.3 + .7 * Math.abs(Math.sin(t * .8 + ph)));
    if (mask) a *= mask(x, y);
    if (a <= .01) continue;
    ctx.fillStyle = `rgba(${color},${a})`; ell(ctx, x, y, s, s); ctx.fill();
  }
  ctx.restore();
}

// Camera: put world point (cx, cy) at the screen centre with zoom z.
function camera(ctx, cx, cy, z, rot = 0) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(W / 2, H / 2); if (rot) ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-cx, -cy);
}
// Interpolate camera keyframes [[t, cx, cy, z], ...] with easing.
function camPath(t, keys, ease = inout) {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b[0]) { const u = ease((t - a[0]) / (b[0] - a[0])); return a.slice(1).map((v, j) => lerp(v, b[j + 1], u)); }
  }
  return keys[keys.length - 1].slice(1);
}

// Cached environments: built once per page on first use.
const ENV = {};
function env(name, build) { return ENV[name] || (ENV[name] = build()); }

// Fill the whole screen in screen space.
function screenFill(ctx, color, alpha = 1, op = 'source-over') {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = op;
  ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// Catmull-Rom point on segment i of polyline P at u in [0, 1].
function catmull(P, i, u) {
  const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)], u2 = u * u, u3 = u2 * u;
  return [0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3));
}
function spline(P, steps = 16) {
  const out = [];
  for (let i = 0; i < P.length - 1; i++) for (let k = 0; k < steps; k++) out.push(catmull(P, i, k / steps));
  out.push(P[P.length - 1]);
  return out;
}

// Reusable offscreen canvas, cleared and reset on every call.
function scratch(name, w, h) {
  const c = env('scratch_' + name + w + 'x' + h, () => mk(w, h)), x = c.getContext('2d');
  x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none';
  x.clearRect(0, 0, w, h);
  return [c, x];
}

// Right hand seen from the side: wrist at (x, y), fingers along the rot direction, s = hand length.
function hand(ctx, x, y, s, rot, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s * (o.flip ? -1 : 1));
  const curl = o.curl ?? .3;
  if (o.sleeve !== false) { rrect(ctx, -1.7, -.31, 1.72, .64, .1); ctx.fill(); rrect(ctx, -.12, -.33, .14, .68, .05); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(0, -.2); ctx.quadraticCurveTo(.25, -.27, .5, -.2); ctx.lineTo(.53, .13); ctx.quadraticCurveTo(.25, .24, 0, .19); ctx.closePath(); ctx.fill();
  const ys = [-.15, -.05, .04, .12], len = [.42, .46, .42, .34], rad = [.056, .058, .054, .046];
  for (let i = 0; i < 4; i++) {
    const c = (o.point && i === 0) ? .04 : curl * (1 + i * .22), a = c * .8;
    const kx = .48 + Math.cos(a) * len[i] * .55, ky = ys[i] + Math.sin(a) * len[i] * .55;
    const a2 = a + c * 1.5, ex = kx + Math.cos(a2) * len[i] * .45, ey = ky + Math.sin(a2) * len[i] * .45;
    seg(ctx, .46, ys[i], kx, ky, rad[i], rad[i] * .9); seg(ctx, kx, ky, ex, ey, rad[i] * .9, rad[i] * .74);
  }
  const ta = -.75 + (o.thumb || 0), tx = .12 + Math.cos(ta) * .2, ty = -.15 + Math.sin(ta) * .2;
  seg(ctx, .1, -.14, tx, ty, .075, .062); seg(ctx, tx, ty, tx + Math.cos(ta + .45) * .17, ty + Math.sin(ta + .45) * .17, .062, .052);
  ctx.restore();
}
// Fingertip of the index finger for hand() with point: true.
function handTip(x, y, s, rot, flip) {
  const lx = .48 + .42 * .98, ly = (-.15 + .02) * (flip ? -1 : 1);
  return [x + (Math.cos(rot) * lx - Math.sin(rot) * ly) * s, y + (Math.sin(rot) * lx + Math.cos(rot) * ly) * s];
}

// Volumetric cone of light from a to b, width w at the far end.
function beam(ctx, a, b, w, alpha = .07, color = '255,236,205') {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]);
  g.addColorStop(0, `rgba(${color},${alpha * 1.6})`); g.addColorStop(1, `rgba(${color},${alpha * .4})`);
  ctx.fillStyle = g;
  poly(ctx, [[a[0] + nx * 14, a[1] + ny * 14], [b[0] + nx * w, b[1] + ny * w], [b[0] - nx * w, b[1] - ny * w], [a[0] - nx * 14, a[1] - ny * 14]]); ctx.fill();
  ctx.restore();
}

// Sum of decaying pulses after hit times; drives light jumps on knocks.
function pulse(t, hits, decay = 8) {
  let s = 0; for (const [tk, a = 1] of hits) if (t >= tk) s += a * Math.exp(-(t - tk) * decay);
  return s;
}

// Colour grade of the whole frame, applied in screen space.
function tint(ctx, color, alpha, op) {
  if (alpha <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = op; ctx.globalAlpha = alpha;
  ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// Draw a silhouette offscreen first, so a glow (shadow) outlines the whole shape and not each part.
function sil(ctx, fill, draw, shadow) {
  const [c, x] = scratch('sil', W, H);
  x.setTransform(ctx.getTransform()); x.fillStyle = fill; draw(x);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (shadow) { ctx.shadowColor = shadow[0]; ctx.shadowBlur = shadow[1]; }
  ctx.drawImage(c, 0, 0); ctx.restore();
}
