// Episode 4, scene 2 (0:30–1:01): power back, the cat hisses, the broken camera, going down, who waits on the first floor.
'use strict';

// The camera dome up close: cracked glass, the red light dead.
function domeClose(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#9aa1a7'], [1, '#7c838a']]);
  ctx.fillStyle = '#868d94'; poly(ctx, [[0, 1100], [W, 900], [W, H], [0, H]]); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 1100); ctx.lineTo(W, 900); ctx.stroke();
  ctx.save(); ctx.translate(540, 640);
  ctx.fillStyle = '#d3d7da'; ell(ctx, 0, -40, 330, 90); ctx.fill(); ctx.fillStyle = '#b7bcc0'; ell(ctx, 0, -30, 300, 70); ctx.fill();
  ctx.fillStyle = '#121417'; ctx.beginPath(); ctx.arc(0, -20, 260, 0, Math.PI); ctx.fill();
  ctx.fillStyle = '#2a2e33'; ell(ctx, 40, 90, 70, 70); ctx.fill(); ctx.fillStyle = '#0a0b0d'; ell(ctx, 40, 90, 40, 40); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ell(ctx, -110, 60, 50, 22); ctx.fill();
  ctx.fillStyle = o.led ? '#ff3b30' : '#3a1513'; ell(ctx, -150, -10, 14, 14); ctx.fill();
  const c = clamp(o.cracked || 0);
  if (c > 0) { ctx.strokeStyle = 'rgba(235,240,245,0.85)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; const r = rng(4);
    for (let i = 0; i < 9; i++) { const a = r() * Math.PI, L = (90 + r() * 170) * c; ctx.beginPath(); ctx.moveTo(30, 100); let x = 30, y = 100; for (let k = 1; k <= 4; k++) { x += Math.cos(a + (r() - .5) * .6) * L / 4; y += Math.sin(a + (r() - .5) * .6) * L / 4 * .8; ctx.lineTo(x, Math.min(y, 230)); } ctx.stroke(); }
    ctx.beginPath(); ctx.arc(30, 100, 40 * c, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
}

// The complaint he wrote in spring, as a sepia flashback card.
function complaint(ctx, t, k) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(540, lerp(2300, 1560, outBack(clamp(k)))); ctx.rotate(-.05);
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(-330, -190, 680, 420);
  ctx.fillStyle = '#efe3c8'; ctx.fillRect(-340, -200, 680, 420);
  ctx.fillStyle = '#3a2e22'; ctx.font = `900 44px ${MONT}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('ЖАЛОБА', -290, -130);
  ctx.font = `700 34px ${MONT}`; [['В лифте разбита камера.', -50], ['Прошу заменить!', 0], ['кв. 41 · 12 марта', 90]].forEach(([s, y]) => ctx.fillText(s, -290, y));
  ctx.strokeStyle = 'rgba(58,46,34,0.25)'; ctx.lineWidth = 2; for (let y = -80; y < 180; y += 50) { ctx.beginPath(); ctx.moveTo(-300, y + 22); ctx.lineTo(300, y + 22); ctx.stroke(); }
  ctx.restore();
}

// The floor display: a big red number and an arrow going down.
function ledPanel(ctx, t, n, beat) {
  vgrad(ctx, 0, 0, W, H, [[0, '#9aa1a7'], [1, '#7c838a']]);
  ctx.fillStyle = '#1b1d21'; rrect(ctx, 140, 380, 800, 760, 50); ctx.fill(); ctx.fillStyle = '#0b0c0e'; rrect(ctx, 180, 420, 720, 680, 36); ctx.fill();
  const k = 1 + .08 * Math.exp(-beat * 9);
  glow(ctx, 600, 760, 420, 'rgba(255,40,30,1)', .35);
  ctx.save(); ctx.translate(600, 770); ctx.scale(k, k); ctx.fillStyle = '#ff3b30'; ctx.font = `900 520px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), 0, 0); ctx.restore();
  if (Math.sin(t * 9) > -.3) { ctx.fillStyle = '#ff3b30'; poly(ctx, [[240, 700], [340, 700], [290, 800]]); ctx.fill(); }
}

SHOTS.push(
  // Ты чуть не плачешь.
  { t0: C(13), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 820, 1.0, 1.08);
    cabinIn(ctx, t, { light: 0 });
    guy(ctx, 540, 820 + .84 * 2500, 2500, { face: 0, eyes: 'wide', tears: 1, smile: .7, lookY: -.3 });
    darkness(ctx, .8, [540, 820, 900]);
  } },
  // «Сейчас дам питание и опущу вас на первый. Только тихо».
  { t0: C(14), trans: 'cut', draw(ctx, lt, d, t) {
    const on = sstep(Wd(14, 'питание') - .1, Wd(14, 'питание') + .3, t), flick = on > 0 && on < 1 ? (Math.sin(t * 70) > 0 ? 1 : .2) : 1;
    push(ctx, lt, d, 700, 1000, 1.0, 1.06);
    cabinIn(ctx, t, { light: on * flick > .5 ? 1 : 0, display: on > .5 ? '9' : null, speak: MOUTH(t) > .1 ? 1 : .3 });
    guy(ctx, 520, 1760, 1050, { face: 1, eyes: on > .5 ? 'happy' : 'wide', smile: on > .5 ? .8 : 0, look: 1, armL: [.2, .1], armR: [-.1, -.1] });
    darkness(ctx, 1 - on * flick * .85, [968, 1180, 520]);
    tint(ctx, '#ffb070', .12 * on, 'soft-light');
    pill(ctx, 540, 300, 'ПИТАНИЕ', 'green', clamp((t - Wd(14, 'питание')) / .25), { icon: 'bolt' });
    pill(ctx, 540, 410, 'НА 1 ЭТАЖ', 'yellow', clamp((t - Wd(14, 'первый')) / .25), { icon: 'down' });
    pill(ctx, 540, 520, 'ТОЛЬКО ТИХО', 'red', clamp((t - Wd(14, 'тихо')) / .25));
  } },
  // Кот прижимает уши и шипит на динамик.
  { t0: C(15), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.0, 1.08);
    cabinIn(ctx, t, { light: 1, display: '9' });
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, 0, W, H);
    const mood = t > Wd(15, 'шипит') ? 'hiss' : t > Wd(15, 'прижимает') ? 'alert' : 'calm';
    carrier(ctx, t, 540, 1150, 2.2, { mood, look: 1 });
    if (mood === 'hiss') { const a = t - Wd(15, 'шипит'); ctx.save(); ctx.globalAlpha = clamp(1.5 - a); outlined(ctx, 'Ш-Ш-Ш!', 820, 420 - a * 40, 76, TSC.r); ctx.restore(); }
    pill(ctx, 540, 1520, 'ШИПИТ НА ДИНАМИК', 'red', clamp((t - Wd(15, 'динамик')) / .25), { icon: 'warn' });
  } },
  // Ты смотришь в угол.
  { t0: C(16), trans: 'cut', draw(ctx, lt, d, t) {
    const turn = sstep(C(16), Wd(16, 'угол'), t);
    push(ctx, lt, d, 300, 500, 1.0, 1.12);
    cabinIn(ctx, t, { light: 1, display: '9', camRing: (t - Wd(16, 'угол')) / .3 });
    guy(ctx, 620, 1760, 1050, { face: turn > .5 ? -1 : 1, eyes: 'dot', lookY: -turn, look: turn > .5 ? .6 : 0, head: [0, -.01 * turn] });
  } },
  // Камера разбита ещё с весны. Ты сам писал жалобу.
  { t0: C(17), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1.0, 1.08);
    domeClose(ctx, t, { cracked: (t - Wd(17, 'разбита') + .2) / .35, led: false });
    pill(ctx, 540, 1000, 'РАЗБИТА', 'red', clamp((t - Wd(17, 'разбита')) / .25), { icon: 'cross' });
    pill(ctx, 540, 1110, 'С ВЕСНЫ', 'yellow', clamp((t - Wd(17, 'весны')) / .25));
    if (t > Wd(17, 'жалобу') - .3) { tint(ctx, '#000000', .35 * clamp((t - Wd(17, 'жалобу') + .3) / .4), 'source-over'); complaint(ctx, t, (t - Wd(17, 'жалобу') + .3) / .5); }
  } },
  // Тогда кто тебя видит?
  { t0: C(18), trans: 'flash', xfade: .2, draw(ctx, lt, d, t) {
    cabinIn(ctx, t, { light: 1, display: '9' });
    guy(ctx, 560, 1760, 1050, { face: 1, eyes: 'wide', lookY: -.6 });
    cctv(ctx, t, { cam: 'CAM 3 · КАБИНА', time: '12.03 08:14', nosignal: 1 });
    ctx.save(); const k = outBack(clamp((t - Wd(18, 'кто')) / .3)); ctx.translate(540, 260); ctx.scale(k, k); outlined(ctx, 'КТО ТЕБЯ', 0, -50, 92, TSC.w); outlined(ctx, 'ВИДИТ?', 0, 50, 110, TSC.r); ctx.restore();
    pill(ctx, 540, 1520, 'ЗАПИСЕЙ НЕТ С 12 МАРТА', 'red', clamp(lt / .3));
  } },
  // Кабина вздрагивает и едет вниз.
  { t0: C(19), trans: 'cut', draw(ctx, lt, d, t) {
    const stop = floorY(9) - .55 * FH, jolt = Wd(19, 'вздрагивает'), go = Wd(19, 'едет');
    const cab = t < go ? stop + (t > jolt ? Math.sin((t - jolt) * 22) * 10 * Math.exp(-(t - jolt) * 4) : 0) : stop + (t - go) * 260;
    const [sx, sy] = shake(t, [[jolt, 1.2]], 14);
    ctx.save(); ctx.translate(sx, sy);
    push(ctx, lt, d, 595, 960, 1.2, 1.28);
    building(ctx, t, { camY: cab - 165, cab, shake: t > jolt && t < go ? 1 : 0, inside: (x, cx, fy) => {
      guy(x, cx - 40, fy, 230, { face: 1, eyes: 'wide', lookY: .8, mouth: .3 }); carrier(x, t, cx + 60, fy, .22, { mood: 'alert' }); } });
    ctx.restore();
    pill(ctx, 540, 300, 'ВНИЗ', 'red', clamp((t - Wd(19, 'вниз')) / .25), { icon: 'down' });
  } },
  // Восьмой. Седьмой. Шестой.
  { t0: C(20), trans: 'cut', draw(ctx, lt, d, t) {
    const w = ['восьмой', 'седьмой', 'шестой'].map(x => Wd(20, x)), i = t > w[2] ? 2 : t > w[1] ? 1 : 0;
    ledPanel(ctx, t, [8, 7, 6][i], t - w[i]);
  } },
  // Можно нажать «стоп» и вылезти через люк в шахту.
  { t0: C(21), trans: 'cut', draw(ctx, lt, d, t) {
    const up = sstep(Wd(21, 'вылезти') - .2, Wd(21, 'люк'), t);
    push(ctx, lt, d, 600, 700, 1.0, 1.08);
    cabinIn(ctx, t, { light: 1, display: '6', stop: t > Wd(21, 'стоп'), hatch: t > Wd(21, 'люк') - .1 ? 1 : 0 });
    guy(ctx, 520, 1760, 1050, { face: 1, eyes: 'wide', lookY: -up, armR: [lerp(-.1, 2.9, up), lerp(0, -.3, up)], armL: [.2, .1] });
    pill(ctx, 820, 1000, 'СТОП', 'red', clamp((t - Wd(21, 'стоп')) / .25));
    pill(ctx, 540, 260, 'ЛЮК В ШАХТУ', 'yellow', clamp((t - Wd(21, 'люк')) / .25), { icon: 'up' });
  } },
  // А можно доехать и узнать, кто ждёт на первом.
  { t0: C(22), trans: 'cut', draw(ctx, lt, d, t) {
    const pan = inout(clamp(lt / 1.3)), zoom = 1 + .45 * inout(clamp((lt - 1.1) / (d - 1.1)));
    ctx.save(); ctx.translate(215, 980); ctx.scale(zoom, zoom); ctx.translate(-215, -980);
    building(ctx, t, { camY: lerp(floorY(4), floorY(1) - FH * .5, pan), cab: floorY(5) + lt * 120, light: 1, lobby: (x, fy) => {
      x.fillStyle = 'rgba(6,10,20,0.72)'; x.fillRect(0, fy - FH, 430, FH);
      const eyes = [];
      [[70, .9], [150, 1], [230, .95], [310, 1.05], [120, 1.1], [270, 1.12]].forEach(([zx, sc], i) => { const o = guy(x, zx, fy - 6 + (sc - 1) * 60, 250 * sc, { face: 1, eyes: 'zed', armL: [-.2, .1], armR: [-.15, .1], seed: i, lean: .05 }, ZED); eyes.push(o); });
      const r = guy(x, 380, fy + 4, 280, { face: 1, eyes: 'zed', armR: [2.6, -.2], armL: [-.1, .1], seed: 9 }, ZED);
      x.fillStyle = '#141414'; rrect(x, r.hands.R.hand[0] - 14, r.hands.R.hand[1] - 40, 28, 56, 6); x.fill(); x.fillRect(r.hands.R.hand[0] + 6, r.hands.R.hand[1] - 70, 5, 34); x.fillStyle = '#ff3b30'; ell(x, r.hands.R.hand[0], r.hands.R.hand[1] - 28, 4, 4); x.fill();
      x.fillStyle = 'rgba(6,10,20,0.45)'; x.fillRect(0, fy - FH, 430, FH);
      eyes.concat([r]).forEach(o => { for (const [ex, ey] of o.eyes) glow(x, ex, ey, 14, 'rgba(220,255,200,1)', .9); });
    } });
    ctx.restore();
    tint(ctx, '#5f6a8f', .3, 'multiply');
    pill(ctx, 540, 300, '1 ЭТАЖ', 'red', clamp((t - Wd(22, 'первом')) / .25), { icon: 'warn' });
  } },
  // Что бы ты сделал? Едешь вниз — ставь лайк. Лезешь в люк — пиши в комментариях.
  { t0: C(23), trans: 'flash', xfade: .25, fadeOut: .6, draw(ctx, lt, d, t) {
    choiceCard(ctx, t, lt, { left: (t - Wd(24, 'едешь')) / .3, right: (t - Wd(25, 'лезешь')) / .3, leftLabel: 'ЕДЕШЬ ВНИЗ', rightLabel: 'ЛЕЗЕШЬ В ЛЮК' });
  } },
);
