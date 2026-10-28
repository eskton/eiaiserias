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

// Body proportions of guy(), in units of the figure's height h (feet at 0, up is negative).
const GB = { leg: .2, torso: .31, R: .112, upper: .16, fore: .15, armW: .04, legW: .054 };

// A palette may change the build: L.build overrides GB (and may set tw, the body width factor, and belly).
const guyBuild = L => L.build ? Object.assign({}, GB, L.build) : GB;

// Hip and shoulder of a pose, in h units relative to the feet: shared by guy() and guyReach().
function guyFrame(p, idle = false, now = 0, seed = 0, B = GB) {
  const crouch = p.crouch || 0, floor = p.sit === 'floor';
  const lean = (p.lean || 0) + (idle ? Math.sin(now * 1.7 + seed) * .01 : 0);
  const hip = [p.dx || 0, p.hipY ?? (floor ? -.07 : p.sit ? -.27 : -(2 * B.leg + .02) * (1 - crouch * .4))];
  const breath = idle ? Math.sin(now * 2.4 + seed) * .004 : 0;
  const sh = [hip[0] + Math.sin(lean) * B.torso, hip[1] - Math.cos(lean) * B.torso - breath];
  return { hip, sh, lean, crouch, floor };
}

// A flat figure in a tracksuit, drawn like the reference: a slim rounded body, thin arms and legs with white stripes,
// a round head sitting right on the shoulders, a bowl haircut with a straight fringe, big dot eyes at the front of the face.
// (x, y) = feet on the ground, h = height. p: face (1 right, -1 left, 0 front), lean, head [dx, dy], crouch,
// sit (1 on a chair, 'floor' knees up), armL/armR/legL/legR [angle, bend] (0 = straight down, + towards x),
// eyes ('dot', 'wide', 'closed', 'happy', 'zed'), look / lookY (-1..1), mouth (0..1), smile, tears, shake, idle,
// hold(ctx, hand), noShadow. Returns { head, R, hands: { L, R }, eyes: [[x, y], [x, y]] } in canvas pixels.
// L is the palette (window.HERO, an episode's hero, by default); L.ds draws the face of someone with Down syndrome:
// almond eyes slanting up at the outer corners, a rounder, flatter face, a small nose, small low ears, rosy cheeks.
// Face options in L: dsEyes ('almond', 'folds' the round eyes with inner folds, 'narrow'), faceW, glasses,
// hairStyle ('bowl', 'short', 'side'), openSmile.
function guy(ctx, x, y, h, p = {}, L = window.HERO || SUIT) {
  const now = window.NOW || 0, seed = (p.seed || 0) + hashStr(L.suit + L.skin), idle = p.idle !== false;
  const f = p.face ?? 1, side = f !== 0, s = f || 1;
  if (p.shake) x += (noise1(now * 30 + seed) - .5) * h * .012 * p.shake;
  const U = (u, v) => [x + u * h, y + v * h], dir = a => [Math.sin(a), Math.cos(a)];
  const B = guyBuild(L), ds = !!L.ds, { hip, sh, lean, crouch, floor } = guyFrame(p, idle, now, seed, B);
  const R = B.R, hd = p.head || [0, 0];
  const head = [sh[0] + Math.sin(lean) * R * .6 + hd[0], sh[1] - R * .8 + hd[1]];
  const line = (pts, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w * h; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((q, i) => { const [a, b] = U(...q); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.stroke(); };
  // the white stripe along a limb, on its outer side
  const stripe = (pts, off) => { if (!L.stripe) return; const q = pts.map(([u, v], i) => { const [a, b] = pts[Math.min(i + 1, pts.length - 1)], [c, d] = pts[Math.max(i - 1, 0)], dx = a - c, dy = b - d, n = Math.hypot(dx, dy) || 1; return [u - dy / n * off, v + dx / n * off]; }); line(q, .0075, L.stripe); };
  // a soft contact shadow
  if (!p.noShadow && p.sit !== 1) { ctx.fillStyle = 'rgba(0,0,0,0.16)'; ell(ctx, x + hip[0] * h, y + .004 * h, .13 * h, .018 * h); ctx.fill(); }
  const leg = (k, a, col) => {
    let [ah, ak] = a || [0, 0];
    if (floor && !a) { ah = s * (Math.PI - .62) + k * .04; ak = -s * 2.15; }
    if (p.sit === 1 && !a) { ah = s * 1.5; ak = -s * 1.5; }
    const j = [hip[0] + (side ? .012 * k : .036 * k), hip[1]], d1 = dir(ah), sq = 1 - crouch * .35;
    const kn = [j[0] + d1[0] * B.leg, j[1] + d1[1] * B.leg * sq], d2 = dir(ah + ak), an = [kn[0] + d2[0] * B.leg, kn[1] + d2[1] * B.leg * sq];
    line([j, kn, an], B.legW, col); stripe([j, kn, an], .016 * (side ? s : k));
    ctx.fillStyle = L.shoe;
    if (side) { const [sx, sy] = U(an[0], an[1]); rrect(ctx, sx - (s > 0 ? .03 : .06) * h, sy - .016 * h, .09 * h, .034 * h, .016 * h); ctx.fill(); }
    else { const [sx, sy] = U(an[0] + k * .008, an[1] + .006); ell(ctx, sx, sy, .036 * h, .018 * h); ctx.fill(); }
    return an;
  };
  const arm = (k, a, col) => {
    const [as, ae] = a || [.06 * k * (side ? 0 : 1), 0];
    const j = [sh[0] + (side ? 0 : .066 * k * (B.tw || 1)), sh[1] + .03], d1 = dir(as), el = [j[0] + d1[0] * B.upper, j[1] + d1[1] * B.upper];
    const d2 = dir(as + ae), wr = [el[0] + d2[0] * B.fore, el[1] + d2[1] * B.fore];
    line([j, el, wr], B.armW, col); stripe([j, el, wr], .011 * (side ? s : k));
    const hn = U(wr[0] + d2[0] * .01, wr[1] + d2[1] * .01);
    ctx.fillStyle = L.skin; ell(ctx, hn[0], hn[1], .026 * h, .026 * h); ctx.fill();
    return { hand: hn, dir: as + ae };
  };
  const hands = {};
  if (side) { hands.L = arm(-1, p.armL, L.suitD); leg(-1, p.legL, L.suitD); leg(1, p.legR, L.suit); }
  else { leg(-1, p.legL, L.suit); leg(1, p.legR, L.suit); }
  // the body: a slim rounded column, a little darker at the back
  const tw = (side ? .125 : .165) * (B.tw || 1), tl = Math.hypot(sh[0] - hip[0], sh[1] - hip[1]) + .045;
  ctx.save(); ctx.translate(...U(hip[0], hip[1] + .03)); ctx.rotate(lean);
  ctx.fillStyle = L.suit; rrect(ctx, -tw / 2 * h, -tl * h, tw * h, tl * h, [tw * .5 * h, tw * .5 * h, .03 * h, .03 * h]); ctx.fill();
  if (B.belly) { if (side) { ell(ctx, s * tw * .22 * h, -tl * .34 * h, tw * .34 * h, tl * .26 * h); ctx.fill(); } else { ell(ctx, 0, -tl * .27 * h, tw * .5 * h, tl * .27 * h); ctx.fill(); } }
  if (side) { ctx.save(); ctx.clip(); ctx.fillStyle = L.suitD; ctx.globalAlpha = .55; ctx.fillRect(s > 0 ? -tw / 2 * h : tw * .12 * h, -tl * h, tw * .38 * h, tl * h); ctx.restore(); }
  else if (L.stripe) { ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = .005 * h; ctx.beginPath(); ctx.moveTo(0, -tl * h + .04 * h); ctx.lineTo(0, 0); ctx.stroke(); }
  ctx.restore();
  if (side) hands.R = arm(1, p.armR, L.suit);
  else { hands.L = arm(-1, p.armL, L.suit); hands.R = arm(1, p.armR, L.suit); }
  // the head: a circle with a thin dark rim, the bowl cut on top
  const [hx, hy] = U(...head), r = R * h, rx = r * (ds ? (L.faceW || 1.05) : 1), ry = r * (ds ? .97 : 1);
  ctx.fillStyle = L.skin; ell(ctx, hx, hy, rx, ry); ctx.fill();
  ctx.fillStyle = L.skinD;
  if (ds) { if (side) { ell(ctx, hx - s * .26 * r, hy + .24 * r, .15 * r, .16 * r); ctx.fill(); } else for (const k of [-1, 1]) { ell(ctx, hx + k * 1.0 * rx, hy + .24 * r, .11 * r, .15 * r); ctx.fill(); } }
  else if (side) { ell(ctx, hx - s * .2 * r, hy + .14 * r, .19 * r, .21 * r); ctx.fill(); } else for (const k of [-1, 1]) { ell(ctx, hx + k * .97 * r, hy + .14 * r, .14 * r, .19 * r); ctx.fill(); }
  // the hair: a bowl cut (default), a close crop ('short') or a fringe swept to one side ('side')
  const hs = L.hairStyle || 'bowl', hw = rx * 1.06, f0 = side ? -s : -1;
  ctx.save(); ctx.beginPath();
  if (hs === 'short') { ctx.ellipse(hx, hy, rx * 1.03, ry * 1.03, 0, Math.PI, 0); ctx.lineTo(hx + rx * 1.03, hy - .28 * r); ctx.quadraticCurveTo(hx, hy - .52 * r, hx - rx * 1.03, hy - .28 * r); }
  else if (hs === 'side') { ctx.ellipse(hx, hy, hw, ry * 1.06, 0, Math.PI, 0); ctx.lineTo(hx - f0 * hw, hy - .3 * r); ctx.quadraticCurveTo(hx - f0 * .1 * r, hy - .22 * r, hx + f0 * hw, hy + .02 * r); }
  else { ctx.ellipse(hx, hy, hw, ry * 1.06, 0, Math.PI, 0); ctx.lineTo(hx + hw, hy - .1 * r); ctx.lineTo(hx - hw, hy - .1 * r); }
  ctx.closePath(); ctx.fillStyle = L.hair; ctx.fill();
  ctx.restore();
  ctx.strokeStyle = 'rgba(60,32,20,0.28)'; ctx.lineWidth = Math.max(1.5, .035 * r); ell(ctx, hx, hy, rx, ry); ctx.stroke();
  if (ds) {
    // rosy round cheeks and a small, low-bridged nose
    ctx.fillStyle = 'rgba(232,118,104,0.32)';
    if (side) { ell(ctx, hx + s * .56 * r, hy + .34 * r, .17 * r, .11 * r); ctx.fill(); } else for (const k of [-1, 1]) { ell(ctx, hx + k * .56 * r, hy + .34 * r, .16 * r, .11 * r); ctx.fill(); }
    ctx.fillStyle = L.skinD; if (side) { ell(ctx, hx + s * .74 * r, hy + .3 * r, .09 * r, .075 * r); ctx.fill(); } else { ell(ctx, hx, hy + .3 * r, .1 * r, .075 * r); ctx.fill(); }
  }
  // the eyes: two white dots with black pupils, at the front of the face
  let e = p.eyes || 'dot';
  if ((e === 'dot' || e === 'wide') && idle && blinking(now, seed)) e = 'closed';
  const ex = ds ? (side ? [hx + s * .42 * r, hx + s * .86 * r] : [hx - .43 * r, hx + .43 * r]) : side ? [hx + s * .46 * r, hx + s * .86 * r] : [hx - .36 * r, hx + .36 * r];
  const ey = hy + (ds ? .08 : .06) * r;
  const lk = (p.look || 0) * .07 * r + (side ? s * .05 * r : 0), lky = (p.lookY || 0) * .07 * r;
  ex.forEach((cx, i) => {
    const sc = side && i === 1 ? .9 : 1, wr = (e === 'wide' ? .25 : .2) * r * sc;
    if (ds && e !== 'zed' && L.dsEyes === 'folds' && (e === 'dot' || e === 'wide')) {
      // the round eyes of the series with the inner corner hooded by a soft fold, so the eye opens up and outwards
      const inner = side ? (i === 0 ? s : -s) : (i === 0 ? 1 : -1), w2 = wr * .95;
      ctx.save(); ctx.translate(cx, ey);
      ctx.fillStyle = '#ffffff'; ell(ctx, 0, 0, w2, w2); ctx.fill();
      ctx.fillStyle = TSC.ink; const pr = (e === 'wide' ? .08 : .095) * r * sc; ell(ctx, clamp(lk, -w2 + pr, w2 - pr) - inner * .03 * r, clamp(lky, -w2 + pr, w2 - pr) + .01 * r, pr, pr); ctx.fill();
      const fold = () => { ctx.moveTo(inner * w2 * .1, -w2 * 1.02); ctx.quadraticCurveTo(inner * w2 * .7, -w2 * .55, inner * w2 * .95, w2 * .42); };
      ctx.save(); ell(ctx, 0, 0, w2, w2); ctx.clip(); ctx.fillStyle = L.skin; ctx.beginPath(); fold(); ctx.lineTo(inner * w2 * 1.3, w2 * .42); ctx.lineTo(inner * w2 * 1.3, -w2 * 1.3); ctx.lineTo(inner * w2 * .1, -w2 * 1.3); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.strokeStyle = TSC.ink; ctx.lineWidth = .045 * r; ctx.lineCap = 'round'; ctx.beginPath(); fold(); ctx.stroke();
      ctx.restore();
      return;
    }
    if (ds && e !== 'zed') {
      // an almond eye, its outer corner higher than the inner one ('narrow' makes it slimmer and more slanted)
      const nar = L.dsEyes === 'narrow', tilt = (i === 0 ? 1 : -1) * (side ? s * .22 : (nar ? .36 : .4));
      const w = (e === 'wide' ? .21 : nar ? .18 : .19) * r * sc, hh = (e === 'wide' ? .15 : nar ? .085 : .1) * r * sc, up = nar ? 1.7 : 1.35, dn = nar ? .55 : .95;
      const shape = () => { ctx.beginPath(); ctx.moveTo(-w, 0); ctx.bezierCurveTo(-w * .5, -hh * up, w * .5, -hh * up, w, 0); ctx.bezierCurveTo(w * .5, hh * dn, -w * .5, hh * dn, -w, 0); ctx.closePath(); };
      ctx.save(); ctx.translate(cx, ey); ctx.rotate(tilt); ctx.lineCap = 'round'; ctx.strokeStyle = TSC.ink; ctx.lineWidth = .05 * r;
      if (e === 'closed') { ctx.beginPath(); ctx.moveTo(-w, 0); ctx.quadraticCurveTo(0, hh * .7, w, 0); ctx.stroke(); ctx.restore(); return; }
      if (e === 'happy') { ctx.beginPath(); ctx.moveTo(-w, hh * .3); ctx.quadraticCurveTo(0, -hh * 1.3, w, hh * .3); ctx.stroke(); ctx.restore(); return; }
      ctx.fillStyle = '#ffffff'; shape(); ctx.fill();
      ctx.save(); shape(); ctx.clip(); ctx.rotate(-tilt); ctx.fillStyle = TSC.ink; const pr = (e === 'wide' ? .08 : .085) * r * sc;
      ell(ctx, clamp(lk, -w + pr, w - pr), clamp(lky, -hh, hh) + hh * .1, pr, pr); ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.moveTo(-w, 0); ctx.bezierCurveTo(-w * .5, -hh * up, w * .5, -hh * up, w, 0); ctx.stroke();
      // a small fold of skin over the inner corner
      const inner = (i === 0 ? 1 : -1) * (side ? s : 1); ctx.lineWidth = .03 * r; ctx.strokeStyle = 'rgba(90,50,35,0.55)';
      ctx.beginPath(); ctx.moveTo(inner * w * .55, -hh * .95); ctx.quadraticCurveTo(inner * w * 1.05, -hh * .5, inner * w * .98, hh * .35); ctx.stroke();
      ctx.restore(); return;
    }
    if (e === 'closed') { ctx.strokeStyle = TSC.ink; ctx.lineWidth = .055 * r; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - wr, ey); ctx.quadraticCurveTo(cx, ey + wr * .5, cx + wr, ey); ctx.stroke(); return; }
    if (e === 'happy') { ctx.strokeStyle = TSC.ink; ctx.lineWidth = .055 * r; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - wr, ey + wr * .3); ctx.quadraticCurveTo(cx, ey - wr * .7, cx + wr, ey + wr * .3); ctx.stroke(); return; }
    ctx.fillStyle = '#ffffff'; ell(ctx, cx, ey, wr, wr); ctx.fill();
    ctx.fillStyle = e === 'zed' ? '#6b7a5a' : TSC.ink; const pr = (e === 'wide' ? .085 : e === 'zed' ? .04 : .1) * r * sc;
    ell(ctx, cx + clamp(lk, -wr + pr, wr - pr), ey + clamp(lky, -wr + pr, wr - pr), pr, pr); ctx.fill();
  });
  if (p.tears) { ctx.fillStyle = 'rgba(140,200,255,0.9)'; ex.forEach((cx, i) => { const u = ((now * .7 + i * .45) % 1); ell(ctx, cx, ey + .25 * r + u * .5 * r, .06 * r, .09 * r); ctx.fill(); }); }
  if (L.glasses) {
    // round glasses: thin dark rims, a bridge, an arm back to the ear
    ctx.strokeStyle = '#2b2b30'; ctx.lineWidth = .045 * r; const gr = .3 * r;
    ex.forEach((cx, i) => { const sc = side && i === 1 ? .86 : 1; ell(ctx, cx, ey, gr * sc, gr * sc); ctx.stroke(); });
    ctx.beginPath();
    if (side) { ctx.moveTo(ex[0] + s * gr, ey - .05 * r); ctx.lineTo(ex[1] - s * gr * .86, ey - .05 * r); ctx.moveTo(ex[0] - s * gr, ey - .03 * r); ctx.lineTo(hx - s * .26 * r, hy + .14 * r); }
    else { ctx.moveTo(ex[0] + gr, ey - .05 * r); ctx.quadraticCurveTo(hx, ey - .14 * r, ex[1] - gr, ey - .05 * r); ctx.moveTo(ex[0] - gr, ey - .03 * r); ctx.lineTo(hx - rx * .98, ey); ctx.moveTo(ex[1] + gr, ey - .03 * r); ctx.lineTo(hx + rx * .98, ey); }
    ctx.stroke();
  }
  // the mouth: a short line, a smile, or an "o" when shocked or talking
  const m = clamp(p.mouth || 0), mx = side ? hx + s * .64 * r : hx, my = hy + .52 * r;
  const smile = p.smile ?? (ds && e === 'dot' ? .3 : 0);  // a kind face at rest
  ctx.fillStyle = L.mouth;
  if (m > .05) { ell(ctx, mx, my, (.06 + .05 * m) * r, (.04 + .12 * m) * r); ctx.fill(); }
  else if (smile && L.openSmile) { ctx.beginPath(); ctx.moveTo(mx - .14 * r, my - .05 * r); ctx.lineTo(mx + .14 * r, my - .05 * r); ctx.quadraticCurveTo(mx + .12 * r, my + .14 * r * (.6 + smile), mx, my + .14 * r * (.6 + smile)); ctx.quadraticCurveTo(mx - .12 * r, my + .14 * r * (.6 + smile), mx - .14 * r, my - .05 * r); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillRect(mx - .1 * r, my - .05 * r, .2 * r, .04 * r); }
  else if (smile) { ctx.strokeStyle = L.mouth; ctx.lineWidth = .045 * r; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(mx - .13 * r, my - .03 * r); ctx.quadraticCurveTo(mx, my + .1 * r * smile, mx + .13 * r, my - .03 * r); ctx.stroke(); }
  else { ctx.fillRect(mx - .08 * r, my - .015 * r, .16 * r, .032 * r); }
  if (p.hold) p.hold(ctx, hands.R.hand, hands);
  return { head: [hx, hy], R: r, hands, eyes: ex.map(cx => [cx, ey]) };
}

// Arm angles [shoulder, elbow] for guy() so that the right hand reaches (tx, ty) on the canvas; bend = 1 or -1 picks
// which way the elbow points.
function guyReach(x, y, h, p, tx, ty, bend = 1, L = window.HERO || SUIT) {
  const B = guyBuild(L), side = (p.face ?? 1) !== 0, { sh } = guyFrame(p, false, 0, 0, B);
  const j = [sh[0] + (side ? 0 : .066 * (B.tw || 1)), sh[1] + .03];
  const dx = (tx - x) / h - j[0], dy = (ty - y) / h - j[1], L1 = B.upper, L2 = B.fore + .01;
  const dd = Math.hypot(dx, dy) || 1e-6, d = Math.min(dd, L1 + L2 - 1e-4), ux = dx / dd, uy = dy / dd;
  const al = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), as = Math.atan2(dx, dy) + bend * al;
  return [as, Math.atan2(ux * d - Math.sin(as) * L1, uy * d - Math.cos(as) * L1) - as];
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

// A pill badge. kind: dark, yellow, red, blue, green, white, orange; o.icon: any icon2() kind.
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

// Small icons drawn by hand (no emoji font needed), centred at (x, y), about s across: warn, check, cross, drop, dot,
// down, up, bolt, battery, house, window, hand (stop), bio (biohazard), bell, mute (the bell crossed out), lock, clock.
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
  if (kind === 'house') { poly(ctx, [[-s * .48, -s * .02], [0, -s * .46], [s * .48, -s * .02], [s * .36, -s * .02], [s * .36, s * .42], [-s * .36, s * .42], [-s * .36, -s * .02]]); ctx.fill(); ctx.fillStyle = bg; ctx.fillRect(-s * .1, s * .12, s * .2, s * .3); }
  if (kind === 'window') { ctx.lineWidth = s * .12; ctx.strokeRect(-s * .36, -s * .4, s * .72, s * .8); ctx.beginPath(); ctx.moveTo(0, -s * .4); ctx.lineTo(0, s * .4); ctx.moveTo(-s * .36, -s * .04); ctx.lineTo(s * .36, -s * .04); ctx.stroke(); }
  if (kind === 'hand') {
    rrect(ctx, -s * .3, -s * .1, s * .6, s * .52, s * .14); ctx.fill();
    for (let i = 0; i < 4; i++) { rrect(ctx, -s * .3 + i * s * .157, -s * .48 + (i === 0 || i === 3 ? s * .08 : 0), s * .13, s * .46, s * .065); ctx.fill(); }
    ctx.save(); ctx.translate(-s * .3, s * .08); ctx.rotate(-.7); rrect(ctx, -s * .065, -s * .32, s * .13, s * .34, s * .065); ctx.fill(); ctx.restore();
  }
  if (kind === 'bio') {
    for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 3; ell(ctx, Math.cos(a) * s * .19, Math.sin(a) * s * .19, s * .23, s * .23); ctx.fill(); }
    ctx.fillStyle = bg; for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 3; ell(ctx, Math.cos(a) * s * .27, Math.sin(a) * s * .27, s * .12, s * .12); ctx.fill(); }
    ell(ctx, 0, 0, s * .07, s * .07); ctx.fill();
  }
  if (kind === 'bell' || kind === 'mute') {
    ctx.beginPath(); ctx.moveTo(-s * .32, s * .22); ctx.quadraticCurveTo(-s * .26, s * .1, -s * .26, -s * .08); ctx.quadraticCurveTo(-s * .26, -s * .4, 0, -s * .4);
    ctx.quadraticCurveTo(s * .26, -s * .4, s * .26, -s * .08); ctx.quadraticCurveTo(s * .26, s * .1, s * .32, s * .22); ctx.closePath(); ctx.fill(); ell(ctx, 0, s * .3, s * .08, s * .08); ctx.fill();
    if (kind === 'bell') { ctx.restore(); return; }
    ctx.strokeStyle = bg; ctx.lineWidth = s * .2; ctx.beginPath(); ctx.moveTo(-s * .42, -s * .42); ctx.lineTo(s * .42, s * .42); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = s * .1; ctx.beginPath(); ctx.moveTo(-s * .42, -s * .42); ctx.lineTo(s * .42, s * .42); ctx.stroke();
  }
  if (kind === 'lock') { ctx.lineWidth = s * .12; ctx.beginPath(); ctx.arc(0, -s * .1, s * .2, Math.PI, 0); ctx.stroke(); rrect(ctx, -s * .32, -s * .1, s * .64, s * .5, s * .08); ctx.fill(); ctx.fillStyle = bg; ell(ctx, 0, s * .12, s * .06, s * .06); ctx.fill(); }
  if (kind === 'clock') { ctx.lineWidth = s * .1; ell(ctx, 0, 0, s * .4, s * .4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s * .25); ctx.lineTo(0, 0); ctx.lineTo(s * .18, s * .1); ctx.stroke(); }
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
