// Flat vertical style (9:16): palette, cartoon characters, karaoke captions, headlines and labels.
'use strict';

const PAL = {
  night: '#0a0f18', navy: '#111827', wall: '#1a2232', wall2: '#212a3c', floor: '#131824', floor2: '#181e2b',
  door: '#6b4d37', doorD: '#5a3f2c', doorL: '#7b5a41', doorLine: '#4a3323', frame: '#262c39',
  warm: '#f4d89e', lamp: '#d9d4c8', winWarm: '#d8b988', winBlue: '#5a92e4',
  teal: '#2c5c54', tealD: '#244c46', beige: '#cdbfa3', beigeD: '#b3a68c',
  blood: '#a3212b', bloodD: '#6c121a', red: '#e8463c', yellow: '#f5c84c', green: '#3fbf6a',
  white: '#f5f5f3', grey: '#8d939e', ink: '#0c0f16',
};

// ---------- characters ----------

const LOOK = {
  hero: { skin: '#dcb197', hair: '#2a201b', top: '#3b4c62', topD: '#2f3d50', legs: '#1d2330', shoes: '#101218', pack: '#4a5238' },
  neighbour: { skin: '#d9b29a', hair: '#8a8a88', top: '#6a5a44', topD: '#574a38', legs: '#2c2f38', shoes: '#15161a', bald: .6 },
  ilya: { skin: '#b9b8ad', hair: '#1c1a19', top: '#2b2d33', topD: '#222429', legs: '#1b1d22', shoes: '#0f1013', coat: 1 },
  vera: { skin: '#e0b8a0', hair: '#3a2a20', top: '#5a3b33', topD: '#4a3029', legs: '#22262f', shoes: '#121318', long: 1 },
  boy: { skin: '#e3bba2', hair: '#4a3426', top: '#b4553c', topD: '#97452f', legs: '#2a3550', shoes: '#15161b', child: 1 },
  man1: { skin: '#d2a88f', hair: '#2b2622', top: '#4b5a3c', topD: '#3e4b31', legs: '#23262e', shoes: '#111' },
  man2: { skin: '#c99d84', hair: '#5a4a3c', top: '#3c3f4a', topD: '#31343e', legs: '#1f2129', shoes: '#111', bald: .4 },
  infected: { skin: '#a7ab9f', hair: '#2b2a28', top: '#4a4038', topD: '#3b332c', legs: '#262830', shoes: '#111' },
  lab: { skin: '#dcb39a', hair: '#2f2620', top: '#e9ebe8', topD: '#cfd3d0', legs: '#30343c', shoes: '#15161a', coat: 1 },
};

// A flat cartoon person. (x, y) is between the feet, h the full height.
// Angles are radians from straight down, positive toward +x. pose: face (-1 left, 0 front, 1 right), lean, head [dx, dy],
// armL/armR/legL/legR [upper, lower-relative], crouch 0..1, sit, eyes ('dot','wide','red','closed','down'), mouth (0..1 open),
// props: knife, torch, phone, gun, pack. look: a LOOK entry plus blood, veins.
function toon(ctx, x, y, h, pose = {}, look = LOOK.hero) {
  const p = pose, L = look, side = p.face || 0, kid = L.child ? 1 : 0;
  const U = (u, v) => [x + u * h, y + v * h], dir = a => [Math.sin(a), Math.cos(a)];
  const crouch = p.crouch || 0, lean = p.lean || 0;
  const hip = [p.dx || 0, p.hipY ?? (p.sit ? -0.27 : -0.46 + crouch * 0.2)];
  const torso = kid ? 0.27 : 0.32;
  const neck = [hip[0] + Math.sin(lean) * torso, hip[1] - Math.cos(lean) * torso];
  const hr = kid ? 0.105 : 0.085, hd = p.head || [0, 0];
  const head = [neck[0] + Math.sin(lean) * 0.03 + hd[0], neck[1] - hr - 0.012 + hd[1]];
  const sw = side ? 0.08 : 0.112, hw = side ? 0.075 : 0.1;
  const stroke = (pts, w, col) => {
    ctx.strokeStyle = col; ctx.lineWidth = w * h; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach((q, i) => { const [a, b] = U(...q); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.stroke();
  };
  const legLen = kid ? 0.19 : 0.225;
  const leg = (k, a, col) => {
    let [ah, ak] = a || [0, 0];
    if (p.sit) { ah = (side || 1) * 1.45 + (k * 0.05); ak = -(side || 1) * 1.45; }
    const j = [hip[0] + (side ? 0.012 * k : 0.052 * k), hip[1]];
    const sq = 1 - crouch * 0.3, d1 = dir(ah), kn = [j[0] + d1[0] * legLen, j[1] + d1[1] * legLen * sq];
    const d2 = dir(ah + ak), an = [kn[0] + d2[0] * legLen, kn[1] + d2[1] * legLen * sq];
    stroke([j, kn, an], 0.078, col);
    const f = side || (k * 0.25);
    ctx.fillStyle = L.shoes; rrect(ctx, ...U(an[0] - 0.035 + f * 0.02, an[1] - 0.01), 0.075 * h, 0.035 * h, 0.015 * h); ctx.fill();
    return an;
  };
  const armLen = kid ? 0.14 : 0.165;
  const arm = (k, a, col) => {
    const [as, ae] = a || [0.05 * k, 0];
    const j = [neck[0] + (side ? 0.005 * k : (sw - 0.03) * k), neck[1] + 0.035];
    const d1 = dir(as), el = [j[0] + d1[0] * armLen, j[1] + d1[1] * armLen];
    const d2 = dir(as + ae), wr = [el[0] + d2[0] * armLen * .92, el[1] + d2[1] * armLen * .92];
    stroke([j, el, wr], 0.08, shade(L.top, -.38)); stroke([j, el, wr], 0.066, col);
    const hn = [wr[0] + d2[0] * 0.02, wr[1] + d2[1] * 0.02];
    ctx.fillStyle = L.skin; ell(ctx, ...U(...hn), 0.032 * h, 0.032 * h); ctx.fill();
    return { hand: U(...hn), dir: as + ae };
  };
  const back = side ? -1 : 1;
  // back limbs first, a shade darker
  const arms = {};
  if (side) { arms.L = arm(-1, p.armL, L.topD); leg(-1, p.legL, shade(L.legs, -.25)); }
  if (L.pack && side) { ctx.fillStyle = L.pack; rrect(ctx, ...U(neck[0] - side * 0.14 - 0.05, neck[1] + 0.03), 0.1 * h, 0.21 * h, 0.03 * h); ctx.fill(); }
  if (!side) { leg(-1, p.legL, L.legs); leg(1, p.legR, L.legs); } else leg(1, p.legR, L.legs);
  // torso (a long coat runs to the knees)
  const hem = L.coat ? hip[1] + 0.2 : hip[1] + 0.035;
  ctx.fillStyle = L.top;
  ctx.beginPath();
  const tl = U(neck[0] - sw, neck[1] + 0.02), tr = U(neck[0] + sw, neck[1] + 0.02);
  const bl = U(hip[0] - hw - (L.coat ? 0.02 : 0), hem), br = U(hip[0] + hw + (L.coat ? 0.02 : 0), hem);
  ctx.moveTo(tl[0] + 0.04 * h, tl[1] - 0.012 * h); ctx.lineTo(tr[0] - 0.04 * h, tr[1] - 0.012 * h);
  ctx.quadraticCurveTo(tr[0], tr[1] - 0.01 * h, tr[0], tr[1] + 0.04 * h); ctx.lineTo(br[0], br[1]);
  ctx.lineTo(bl[0], bl[1]); ctx.lineTo(tl[0], tl[1] + 0.04 * h); ctx.quadraticCurveTo(tl[0], tl[1] - 0.01 * h, tl[0] + 0.04 * h, tl[1] - 0.012 * h);
  ctx.closePath(); ctx.fill();
  // shading on the side away from the light
  ctx.save(); ctx.clip(); ctx.fillStyle = L.topD;
  if (side) { const m = U(neck[0] - side * 0.02, 0); ctx.fillRect(side > 0 ? m[0] - h : m[0], y - h, h, h); }
  else { const m = U(neck[0] + sw * 0.35, 0); ctx.fillRect(m[0], y - h, h, h); }
  ctx.restore();
  if (!side) { ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 0.008 * h; ctx.beginPath(); ctx.moveTo(...U(neck[0], neck[1] + 0.03)); ctx.lineTo(...U(hip[0], hem - 0.01)); ctx.stroke(); }
  if (L.pack && !side) { ctx.strokeStyle = shade(L.pack, -.2); ctx.lineWidth = 0.022 * h; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(...U(neck[0] + k * sw * .55, neck[1] + 0.01)); ctx.lineTo(...U(neck[0] + k * sw * .6, neck[1] + 0.2)); ctx.stroke(); } }
  // arms (front)
  if (side) arms.R = arm(1, p.armR, L.top);
  else { arms.L = arm(-1, p.armL, L.top); arms.R = arm(1, p.armR, L.topD); }
  // neck and head
  ctx.fillStyle = shade(L.skin, -.12); ctx.fillRect(...U(neck[0] - 0.025, neck[1] - 0.03), 0.05 * h, 0.05 * h);
  const [hx, hy] = U(...head), R = hr * h;
  if (L.long) { ctx.fillStyle = L.hair; rrect(ctx, hx - R * 1.08, hy - R * .6, R * 2.16, R * 2.5, R * .9); ctx.fill(); }
  ctx.fillStyle = L.skin; ell(ctx, hx, hy, R, R * 1.05); ctx.fill();
  ctx.save(); ell(ctx, hx, hy, R, R * 1.05); ctx.clip(); ctx.fillStyle = shade(L.skin, -.1);
  ctx.fillRect(hx + (side ? -side * R * .55 : R * .45), hy - R * 1.2, R * 2, R * 2.4); ctx.restore();
  // hair
  ctx.fillStyle = L.hair;
  const hb = L.bald || 0;
  ctx.beginPath(); ctx.ellipse(hx - side * R * .12, hy - R * .25, R * 1.04, R * (.85 - hb * .35), 0, Math.PI, 0); ctx.closePath(); ctx.fill();
  if (!hb) { ctx.beginPath(); ctx.ellipse(hx - side * R * .12, hy - R * .3, R * 1.02, R * .55, 0, 0, Math.PI); ctx.fill(); }
  // the face
  const fx = hx + side * R * .38, fy = hy + R * .08, eye = p.eyes || 'dot';
  const eyeAt = side ? [[fx + side * R * .22, fy]] : [[hx - R * .36, fy], [hx + R * .36, fy]];
  if (!hb) { ctx.fillStyle = L.skin; ctx.beginPath(); ctx.ellipse(hx + side * R * .2, hy + R * .25, R * .82, R * .72, 0, 0, Math.PI * 2); ctx.fill(); }
  for (const [ex, ey] of eyeAt) {
    if (eye === 'wide') { ctx.fillStyle = '#f2efe8'; ell(ctx, ex, ey, R * .2, R * .2); ctx.fill(); ctx.fillStyle = PAL.ink; ell(ctx, ex + (p.look || 0) * R * .06, ey, R * .09, R * .09); ctx.fill(); }
    else if (eye === 'red') { glow(ctx, ex, ey, R * .7, 'rgba(255,40,30,1)', .6); ctx.fillStyle = '#ff3a2e'; ell(ctx, ex, ey, R * .13, R * .13); ctx.fill(); ctx.fillStyle = '#ffd0c8'; ell(ctx, ex, ey, R * .05, R * .05); ctx.fill(); }
    else if (eye === 'closed' || eye === 'down') { ctx.strokeStyle = PAL.ink; ctx.lineWidth = R * .1; ctx.beginPath(); ctx.moveTo(ex - R * .13, ey + (eye === 'down' ? R * .06 : 0)); ctx.lineTo(ex + R * .13, ey + (eye === 'down' ? R * .06 : 0)); ctx.stroke(); }
    else { ctx.fillStyle = PAL.ink; ell(ctx, ex, ey, R * .11, R * .12); ctx.fill(); }
  }
  if (side) { ctx.fillStyle = L.skin; ell(ctx, hx + side * R * .98, hy + R * .2, R * .14, R * .14); ctx.fill(); }
  const mo = p.mouth;
  if (mo !== undefined && mo !== null) {
    const mx = side ? hx + side * R * .58 : hx, my = hy + R * .55;
    ctx.fillStyle = '#3a1414'; ell(ctx, mx, my, R * (side ? .14 : .22), R * (.04 + .18 * clamp(mo))); ctx.fill();
  }
  if (L.blood) {
    ctx.save(); ell(ctx, hx, hy, R, R * 1.05); ctx.clip(); ctx.fillStyle = PAL.blood;
    for (const [bx, by, bw, bh] of [[-.55, -.3, .22, 1.1], [-.2, -.6, .16, .7], [.35, .25, .18, .9], [-.1, .55, .5, .2]]) { rrect(ctx, hx + bx * R, hy + by * R, bw * R, bh * R, bw * R * .5); ctx.fill(); }
    ctx.restore();
  }
  if (L.veins) {
    ctx.strokeStyle = 'rgba(20,16,18,0.85)'; ctx.lineWidth = R * .05;
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + k * R * .3, hy + R * 1.2); ctx.lineTo(hx + k * R * .45, hy + R * .75); ctx.lineTo(hx + k * R * .7, hy + R * .5); ctx.moveTo(hx + k * R * .45, hy + R * .75); ctx.lineTo(hx + k * R * .3, hy + R * .45); ctx.stroke(); }
  }
  // props
  const pr = p.props || {};
  if (pr.knife) { const a = arms[pr.knife]; ctx.save(); ctx.translate(...a.hand); ctx.rotate(-a.dir + Math.PI / 2); ctx.fillStyle = '#c9ced6'; poly(ctx, [[0.01 * h, -0.012 * h], [0.13 * h, -0.006 * h], [0.15 * h, 0.004 * h], [0.01 * h, 0.012 * h]]); ctx.fill(); ctx.restore(); }
  if (pr.phone) { const a = arms[pr.phone]; glow(ctx, a.hand[0], a.hand[1] - 0.03 * h, 0.12 * h, 'rgba(90,150,255,1)', .55); ctx.fillStyle = '#7fb3ff'; rrect(ctx, a.hand[0] - 0.018 * h, a.hand[1] - 0.06 * h, 0.036 * h, 0.06 * h, 0.006 * h); ctx.fill(); }
  if (pr.torch) { const a = arms[pr.torch]; ctx.save(); ctx.translate(...a.hand); ctx.rotate(-(pr.torchDir ?? a.dir) + Math.PI / 2); ctx.fillStyle = '#2a2d33'; rrect(ctx, -0.01 * h, -0.016 * h, 0.07 * h, 0.032 * h, 0.006 * h); ctx.fill(); ctx.restore(); }
  if (pr.gun) { const a = arms[pr.gun]; ctx.save(); ctx.translate(...a.hand); ctx.rotate(-(pr.gunDir ?? a.dir) + Math.PI / 2); ctx.fillStyle = '#25272b'; rrect(ctx, -0.1 * h, -0.016 * h, 0.42 * h, 0.03 * h, 0.008 * h); ctx.fill(); ctx.fillStyle = '#5a3d2a'; rrect(ctx, -0.16 * h, -0.025 * h, 0.12 * h, 0.05 * h, 0.012 * h); ctx.fill(); ctx.restore(); }
  return { head: [hx, hy], R, hands: arms };
}

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

// ---------- camera, light, atmosphere ----------

// Put world point (cx, cy) at screen (W/2, sy), zooming z0 -> z1 over the shot.
function cam(ctx, lt, d, cx, cy, z0 = 1, z1 = 1.06, sy = H / 2) {
  const z = lerp(z0, z1, inout(clamp(lt / Math.max(d, .01))));
  ctx.setTransform(z, 0, 0, z, W / 2 - cx * z, sy - cy * z);
}

// Slow push toward (fx, fy) over the shot.
function push(ctx, lt, d, fx = W / 2, fy = H / 2, z0 = 1, z1 = 1.07) {
  const z = lerp(z0, z1, inout(clamp(lt / Math.max(d, .01))));
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx, -fy);
}
function specks(ctx, t, n = 60, seed = 3, alpha = .35) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  dust(ctx, t, n, [0, 0, W, H], seed, { alpha, size: 1.8, color: '235,235,240', speed: .6 });
  ctx.restore();
}
function vignette(ctx, k = .55) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createRadialGradient(W / 2, H * .45, H * .25, W / 2, H * .5, H * .78);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${k})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function floorGlow(ctx, x, y, w, a = 1, col = 'rgba(244,216,158,1)') {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(x, y, 0, x, y, w * .7); g.addColorStop(0, col.replace(',1)', ',0.55)')); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.save(); ctx.translate(x, y); ctx.scale(1, .16); ctx.translate(-x, -y); ctx.fillRect(x - w, y - w, w * 2, w * 2); ctx.restore();
  ctx.restore();
}

// ---------- text ----------

const FONT = 'Inter';
const TXT = { w: '#ffffff', g: 'rgba(255,255,255,0.42)', y: PAL.yellow, r: PAL.red, n: PAL.green };

// Big caption with words lighting up as they are spoken. CAPS comes from captions.js.
function captions(ctx, t, y = 1245) {
  if (typeof CAPS === 'undefined') return;
  const c = CAPS.find(c => t >= c[0] && t < c[1]);
  if (!c) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const size = 82, lh = size * 1.12, maxW = W - 130;
  ctx.font = `800 ${size}px ${FONT}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  if (!c.layout) {
    const space = ctx.measureText(' ').width, rows = [[]];
    let wsum = 0;
    for (const w of c[2]) {
      const ww = ctx.measureText(w[0]).width;
      if (rows[rows.length - 1].length && wsum + space + ww > maxW) { rows.push([]); wsum = 0; }
      wsum += (rows[rows.length - 1].length ? space : 0) + ww; rows[rows.length - 1].push([w, ww]);
    }
    c.layout = rows.map(r => ({ r, width: r.reduce((a, [, ww]) => a + ww, 0) + space * (r.length - 1) }));
    c.space = space;
  }
  const age = t - c[0], pop = outc(age / .14), sc = .94 + .06 * pop;
  ctx.translate(W / 2, y); ctx.scale(sc, sc); ctx.globalAlpha = clamp(age / .08);
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 4;
  const y0 = -(c.layout.length - 1) * lh / 2;
  c.layout.forEach((row, i) => {
    let x = -row.width / 2;
    for (const [w, ww] of row.r) {
      const on = t >= w[1];
      ctx.fillStyle = on ? (TXT[w[2]] || TXT.w) : TXT.g;
      ctx.fillText(w[0], x, y0 + i * lh); x += ww + c.space;
    }
  });
  ctx.restore();
}

// Headline near the top: quotes in yellow, danger in red. k = visibility 0..1.
function headline(ctx, text, k = 1, col = 'w', y = 300, sub = null, size = 96) {
  if (k <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(k);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `900 ${size}px ${FONT}`;
  const wmax = W - 110, tw = ctx.measureText(text).width;
  if (tw > wmax) { size = Math.floor(size * wmax / tw); ctx.font = `900 ${size}px ${FONT}`; }
  ctx.shadowColor = 'rgba(0,0,0,0.65)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 5;
  ctx.fillStyle = TXT[col] || col; ctx.fillText(text, W / 2, y + (1 - outc(k)) * 14);
  if (sub) { ctx.font = `700 30px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.letterSpacing = '3px'; ctx.fillText(sub, W / 2, y + size * .72); }
  ctx.restore();
}

// Small label in a dark box with a coloured bar, like an annotation.
function tag(ctx, x, y, text, k = 1, bar = '#ffffff', sub = null) {
  if (k <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(k); ctx.textAlign = 'left';
  ctx.font = `800 31px ${FONT}`; ctx.textBaseline = 'middle'; ctx.letterSpacing = '1px';
  const tw = ctx.measureText(text).width;
  let sw = 0; if (sub) { ctx.font = `600 20px ${FONT}`; sw = ctx.measureText(sub).width; }
  const w = Math.max(tw, sw) + 44, hh = sub ? 82 : 58, ox = (1 - outc(k)) * -18;
  ctx.fillStyle = 'rgba(13,16,24,0.9)'; rrect(ctx, x + ox, y, w, hh, 6); ctx.fill();
  ctx.fillStyle = bar; ctx.fillRect(x + ox, y, 6, hh);
  ctx.font = `800 31px ${FONT}`; ctx.fillStyle = '#fff'; ctx.fillText(text, x + ox + 24, y + (sub ? 28 : hh / 2 + 1));
  if (sub) { ctx.font = `600 20px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillText(sub, x + ox + 24, y + 60); }
  ctx.restore();
}

// Fade-in factor for things that appear at time a (seconds), optionally gone by b.
const appear = (t, a, b = 1e9, f = .18) => clamp((t - a) / f) * (1 - clamp((t - b) / f));
