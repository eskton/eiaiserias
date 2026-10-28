// Shared sets for the tracksuit look: the building in section (rooms, the lift shaft, the stairs), the dark, the phone.
// Loaded after tracksuit.js (episode.json "libs").
'use strict';

// ---------- the building in section: rooms on the left, the lift shaft, the stairs on the right ----------

const FH = 430, floorY = n => -(n - 1) * FH;  // world y of floor n (floor 1 at 0, up is negative)
const ROOMS = ['#c9b89c', '#b9c4a8', '#a9bccb', '#d0b2a0', '#c4b0c0'];
const NEIGHBOUR = { skin: '#2c2c30', skinD: '#232327', hair: '#141416', suit: '#26262b', suitD: '#1d1d21', stripe: null, shoe: '#111', mouth: '#000' };

function room(ctx, t, n, y, o) {
  wallpaper(ctx, 0, y, 430, FH, ROOMS[n % ROOMS.length], 10);
  // the window with the city outside
  ctx.fillStyle = '#e9e6df'; ctx.fillRect(70, y + 80, 250, 210);
  ctx.save(); ctx.beginPath(); ctx.rect(84, y + 94, 222, 182); ctx.clip();
  vgrad(ctx, 84, y + 94, 222, 182, [[0, '#9fb3c0'], [1, '#d9dfe2']]);
  const r = rng(n * 7); ctx.fillStyle = '#7f8c96'; for (let i = 0; i < 5; i++) { const bx = 84 + r() * 200, bh = 60 + r() * 110; ctx.fillRect(bx, y + 276 - bh, 26 + r() * 30, bh); }
  if (o.smoke) for (let i = 0; i < 2; i++) { const sx = 120 + r() * 160; for (let k = 0; k < 8; k++) { const u = ((t * .25 + k / 8 + i * .3) % 1); ctx.fillStyle = `rgba(60,60,64,${.55 * (1 - u) * o.smoke})`; ell(ctx, sx + Math.sin(u * 5 + i) * 14, y + 250 - u * 200, 16 + u * 30, 16 + u * 30); ctx.fill(); } }
  ctx.restore();
  ctx.fillStyle = '#e9e6df'; ctx.fillRect(190, y + 80, 10, 210); ctx.fillRect(70, y + 180, 250, 10);
  ctx.fillStyle = '#8a6a48'; ctx.fillRect(0, y + FH - 26, 430, 26);
}

function lobby(ctx, t, y, o) {
  wallpaper(ctx, 0, y, 430, FH, '#9d9789', 0);
  ctx.fillStyle = '#6f6a60'; ctx.fillRect(0, y + FH - 120, 430, 120);
  ctx.fillStyle = '#b8b2a4'; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { ctx.fillRect(50 + i * 44, y + 110 + j * 40, 38, 32); }
  ctx.fillStyle = '#4a3c2e'; ctx.fillRect(280, y + 120, 120, FH - 120); ctx.fillStyle = '#9fb3c0'; ctx.fillRect(300, y + 140, 80, 60);
  if (o.lobby) o.lobby(ctx, y + FH);
}

function stairs(ctx, t, y, n) {
  ctx.fillStyle = '#b9b2a4'; ctx.fillRect(760, y, 320, FH);
  ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(760, y + FH / 2 - 8, 320, 16);
  // one flight: treads and risers going from (x0, y0) up to (x1, y1), a solid stringer under them
  const flight = (x0, y0, x1, y1) => {
    const steps = 9, dx = (x1 - x0) / steps, dy = (y1 - y0) / steps;
    ctx.fillStyle = '#8f897e'; ctx.beginPath(); ctx.moveTo(x0, y0);
    for (let k = 0; k < steps; k++) { ctx.lineTo(x0 + dx * k, y0 + dy * (k + 1)); ctx.lineTo(x0 + dx * (k + 1), y0 + dy * (k + 1)); }
    ctx.lineTo(x1, y1 + 34); ctx.lineTo(x0, y0 + 34); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5b5750'; ctx.lineWidth = 4;
    for (let k = 0; k <= steps; k += 3) { const px = x0 + dx * k, py = y0 + dy * k; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - 70); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x0, y0 - 70); ctx.lineTo(x1, y1 - 70); ctx.stroke();
  };
  flight(780, y + FH, 1010, y + FH / 2);
  ctx.fillStyle = '#8f897e'; ctx.fillRect(1010, y + FH / 2, 70, 34);
  ctx.save(); ctx.globalAlpha = .55; flight(1010, y + FH / 2, 780, y); ctx.restore();
}

// o: camY (world y at the middle of the screen), cab (world y of the cabin floor, null for no cabin), inside(ctx, cx, floorY)
// draws who is in the cabin, light (0..1), smoke, lobby(ctx, floorY), room(ctx, n, ceilingY) draws into floor n,
// runner (world [x, y] or null), over(ctx, Y) draws on top of the floors (Y maps world y to the screen), shake.
function building(ctx, t, o) {
  const Y = wy => H / 2 + wy - o.camY;
  ctx.fillStyle = '#8b867d'; ctx.fillRect(0, 0, W, H);
  // the ground under the house
  const g0 = Y(floorY(1)) + 32;
  if (g0 < H) { ctx.fillStyle = '#6b4a30'; ctx.fillRect(0, g0, W, H - g0); const r = rng(5); ctx.fillStyle = 'rgba(0,0,0,0.14)'; for (let i = 0; i < 90; i++) { ell(ctx, r() * W, g0 + 20 + r() * 900, 4 + r() * 10, 3 + r() * 6); ctx.fill(); } }
  ctx.fillStyle = '#2f3237'; ctx.fillRect(430, 0, 330, Math.max(0, Math.min(H, g0)));
  ctx.fillStyle = '#55595f'; ctx.fillRect(468, 0, 8, Math.min(H, g0)); ctx.fillRect(714, 0, 8, Math.min(H, g0));
  for (let n = 1; n <= 16; n++) {
    const f = Y(floorY(n)), c = f - FH;
    if (f < -60 || c > H + 60) continue;
    if (n === 1) lobby(ctx, t, c, o); else room(ctx, t, n, c, o);
    if (o.room) o.room(ctx, n, c);
    stairs(ctx, t, c, n);
    ctx.fillStyle = '#7d786f'; ctx.fillRect(0, f - 8, 430, 40); ctx.fillRect(760, f - 8, 320, 40);
    ctx.fillStyle = '#9a958b'; ctx.fillRect(0, f - 8, 430, 6); ctx.fillRect(760, f - 8, 320, 6);
    // the landing doors on the shaft, the floor number painted on the shaft wall
    ctx.fillStyle = '#9aa1a8'; ctx.fillRect(430, f - 280, 18, 280); ctx.fillStyle = '#6e757c'; ctx.fillRect(430, f - 280, 18, 10);
    ctx.fillStyle = '#e8c547'; ell(ctx, 418, f - 150, 6, 6); ctx.fill();
    ctx.fillStyle = 'rgba(230,235,240,0.22)'; ctx.font = `900 76px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), 700, f - 330);
  }
  if (o.runner) { const [rx, ry] = o.runner; guy(ctx, rx, Y(ry), 260, stride(t * 11, rx > 900 ? 1 : -1, 1, { face: o.runnerFace || 1, idle: false, lean: .15 }), NEIGHBOUR); }
  if (o.over) o.over(ctx, Y);
  if (o.cab == null) return;
  // the cabin hanging on its cables
  const cb = Y(o.cab), ct = cb - 330, sx = o.shake ? (noise1(t * 40) - .5) * 10 * o.shake : 0;
  ctx.strokeStyle = '#17181b'; ctx.lineWidth = 5; for (const x of [585, 595, 605]) { ctx.beginPath(); ctx.moveTo(x, -10); ctx.lineTo(x + sx * .3, ct - 30); ctx.stroke(); }
  ctx.save(); ctx.translate(sx, 0);
  ctx.fillStyle = '#5d636a'; ctx.fillRect(470, ct - 30, 250, 30); ctx.fillStyle = '#41464c'; ell(ctx, 595, ct - 30, 26, 26); ctx.fill();
  ctx.fillStyle = '#8f969d'; ctx.fillRect(462, ct, 266, 330);
  const lit = o.light ?? 1;
  vgrad(ctx, 476, ct + 14, 238, 302, [[0, lit > .5 ? '#d9dcdc' : '#3b414a'], [1, lit > .5 ? '#b6bcc0' : '#2b3038']]);
  if (lit > .5) { ctx.fillStyle = 'rgba(255,250,225,0.8)'; ctx.fillRect(520, ct + 16, 150, 8); }
  ctx.fillStyle = '#3b3e44'; ctx.fillRect(476, cb - 26, 238, 12);
  if (o.inside) { ctx.save(); ctx.beginPath(); ctx.rect(476, ct + 14, 238, 302); ctx.clip(); o.inside(ctx, 595, cb - 18); ctx.restore(); }
  ctx.restore();
}

// Dark: the cabin goes navy; a phone screen or torch lights a circle. lightAt = [x, y, r] or null.
function darkness(ctx, k, lightAt, warm = false) {
  if (k <= 0) return;
  const [c, x] = scratch('dark', W, H);
  x.fillStyle = `rgba(8,12,24,${.78 * k})`; x.fillRect(0, 0, W, H);
  if (lightAt) { x.globalCompositeOperation = 'destination-out'; const [lx, ly, lr] = lightAt, g = x.createRadialGradient(lx, ly, 0, lx, ly, lr); g.addColorStop(0, 'rgba(0,0,0,0.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(c, 0, 0); ctx.restore();
  if (lightAt && warm) { const [lx, ly, lr] = lightAt; glow(ctx, lx, ly, lr * .7, 'rgba(170,200,255,1)', .12); }
}

// ---------- the phone ----------

// A phone held in a tracksuit hand. o: battery (%), noSignal, notif (0..1 card shown), lines (0..2 shown), dim,
// time ('19:42'), screen(ctx) draws on the screen (centred on 0, 0; it spans x -256..256, y -496..516).
function phone(ctx, t, o = {}) {
  ctx.fillStyle = SUIT.suit; poly(ctx, [[480, 2000], [600, 1250], [920, 1290], [900, 2000]]); ctx.fill();
  ctx.strokeStyle = SUIT.stripe; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(620, 2000); ctx.lineTo(720, 1290); ctx.stroke();
  ctx.fillStyle = SUIT.skin; ell(ctx, 720, 1250, 190, 150); ctx.fill();
  for (let i = 0; i < 4; i++) { rrect(ctx, 210 + i * 30, 900 + i * 95, 120, 70, 35); ctx.fill(); }
  ctx.save(); ctx.translate(540, 820); ctx.rotate(-.05);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; rrect(ctx, -270, -500, 560, 1060, 70); ctx.fill();
  ctx.fillStyle = '#1a1c20'; rrect(ctx, -280, -520, 560, 1060, 70); ctx.fill();
  vgrad(ctx, -256, -496, 512, 1012, [[0, '#24304a'], [1, '#141a29']]);
  ctx.save(); rrect(ctx, -256, -496, 512, 1012, 54); ctx.clip();
  vgrad(ctx, -256, -496, 512, 1012, [[0, '#2b3a5c'], [1, '#121827']]);
  ctx.fillStyle = '#fff'; ctx.font = `800 34px ${MONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(o.time || '19:42', -210, -440);
  if (o.noSignal) { ctx.fillStyle = '#ff3b30'; ctx.font = `900 30px ${MONT}`; ctx.textAlign = 'right'; ctx.fillText('НЕТ СЕТИ', 60, -440); }
  const b = o.battery ?? 12; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; rrect(ctx, 120, -458, 70, 34, 8); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(192, -448, 7, 14);
  ctx.fillStyle = b < 20 ? '#ff3b30' : '#4cd964'; ctx.fillRect(126, -452, 58 * b / 100 + 2, 22);
  ctx.fillStyle = b < 20 ? '#ff3b30' : '#fff'; ctx.font = `900 30px ${MONT}`; ctx.textAlign = 'right'; ctx.fillText(`${b}%`, 112, -440);
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = `700 150px ${MONT}`; ctx.textAlign = 'center'; ctx.fillText(o.time || '19:42', 0, -230);
  if (o.screen) o.screen(ctx);
  if (o.notif > 0) {
    const k = outBack(clamp(o.notif)); ctx.save(); ctx.translate(0, lerp(-700, 0, k));
    ctx.fillStyle = 'rgba(255,255,255,0.96)'; rrect(ctx, -230, -90, 460, 360, 36); ctx.fill();
    ctx.fillStyle = '#d7342c'; rrect(ctx, -230, -90, 460, 80, [36, 36, 0, 0]); ctx.fill(); icon2(ctx, 'warn', -190, -50, 40, '#fff', '#d7342c');
    ctx.fillStyle = '#fff'; ctx.font = `900 27px ${MONT}`; ctx.textAlign = 'left'; ctx.fillText('ЭКСТРЕННОЕ СООБЩЕНИЕ', -160, -48);
    ctx.fillStyle = '#141414'; ctx.font = `900 38px ${MONT}`;
    if ((o.lines ?? 2) > 0) { ctx.fillText('НЕ ВЫХОДИТЕ', -195, 30); ctx.fillText('ИЗ ДОМОВ.', -195, 76); }
    if ((o.lines ?? 2) > 1) { ctx.fillStyle = '#d7342c'; ctx.fillText('ЗАРАЖЁННЫЕ', -195, 150); ctx.fillText('ИДУТ НА ЗВУК', -195, 196); }
    ctx.restore();
  }
  if (o.dim) { ctx.fillStyle = `rgba(0,0,0,${o.dim})`; ctx.fillRect(-260, -500, 520, 1020); }
  ctx.restore();
  ctx.restore();
  // the thumb over the right edge
  ctx.fillStyle = SUIT.skin; ctx.save(); ctx.translate(800, 1050); ctx.rotate(-.5); rrect(ctx, -45, -150, 90, 230, 45); ctx.fill(); ctx.fillStyle = SUIT.skinD; rrect(ctx, -30, -140, 60, 50, 25); ctx.fill(); ctx.restore();
}
