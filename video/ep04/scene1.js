// Episode 4 "The lift" (tracksuit look) — the cabin from the inside; scene 1 (0:00–0:30): stuck, dark, the news,
// a day in the dark, the voice in the speaker. Wd(n, 'слово') is when a word is spoken. The building in section,
// the dark and the phone are shared sets (engine/tracksuit_sets.js).
'use strict';
var XFADE = 0, END = 61.4;
window.OVERLAY = (ctx, t) => { if (t < C(23)) fatCaps(ctx, t); };  // the end card speaks for itself
window.POST = { drift: .8, bloom: .3, grain: .07, lift: .15, paper: .5 };

// ---------- the cabin from the inside ----------

// Looking at the back wall: steel panels, the buttons on the right wall, a camera dome in the top left corner,
// the hatch in the ceiling. o: light (1 on, 0 off), emergency (red light), press (a button lit), stop, hatch, camRing.
function cabinIn(ctx, t, o = {}) {
  vgrad(ctx, 190, 330, 700, 1150, [[0, '#b9bfc4'], [1, '#9ba2a8']]);
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (const x of [423, 656]) ctx.fillRect(x, 330, 6, 1150);
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; for (const x of [210, 445, 680]) ctx.fillRect(x, 330, 40, 1150);
  ctx.fillStyle = '#7c838a'; poly(ctx, [[0, 0], [190, 330], [190, 1480], [0, 1920]]); ctx.fill();
  ctx.fillStyle = '#868d94'; poly(ctx, [[W, 0], [890, 330], [890, 1480], [W, 1920]]); ctx.fill();
  ctx.fillStyle = '#9aa1a7'; poly(ctx, [[0, 0], [W, 0], [890, 330], [190, 330]]); ctx.fill();
  ctx.fillStyle = '#34373c'; poly(ctx, [[190, 1480], [890, 1480], [W, 1920], [0, 1920]]); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 6; for (let i = 1; i < 9; i++) { const u = i / 9; ctx.beginPath(); ctx.moveTo(lerp(190, 0, 0) + u * 700, 1480); ctx.lineTo(u * W, 1920); ctx.stroke(); }
  // handrail
  ctx.fillStyle = '#d7dbde'; rrect(ctx, 200, 1040, 680, 22, 11); ctx.fill(); ctx.fillStyle = '#7c838a'; ctx.fillRect(240, 1062, 12, 30); ctx.fillRect(828, 1062, 12, 30);
  // the light panel and the hatch in the ceiling
  const lit = o.light ?? 1;
  ctx.fillStyle = lit > .5 ? '#fff8de' : '#5d646c'; poly(ctx, [[330, 250], [750, 250], [790, 300], [290, 300]]); ctx.fill();
  const hk = o.hatch || 0;
  ctx.strokeStyle = hk > 0 ? `rgba(255,210,63,${.5 + .5 * Math.sin(t * 8)})` : '#6d747b'; ctx.lineWidth = hk > 0 ? 10 : 6; poly(ctx, [[400, 60], [680, 60], [720, 180], [360, 180]]); ctx.stroke();
  ctx.fillStyle = '#6d747b'; rrect(ctx, 510, 110, 60, 18, 9); ctx.fill();
  // the camera dome in the corner
  ctx.fillStyle = '#d3d7da'; ell(ctx, 235, 372, 52, 22); ctx.fill(); ctx.fillStyle = '#16181b'; ctx.beginPath(); ctx.arc(235, 376, 40, 0, Math.PI); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ell(ctx, 222, 388, 9, 6); ctx.fill();
  if (o.camRing > 0) { ctx.save(); ctx.globalAlpha = clamp(o.camRing); ctx.strokeStyle = TSC.y; ctx.lineWidth = 8; ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t * 40; ell(ctx, 235, 385, 95 * (1 + .04 * Math.sin(t * 6)), 75); ctx.stroke(); ctx.restore(); }
  // the button panel on the right wall
  ctx.fillStyle = '#c9cdd1'; poly(ctx, [[925, 600], [1010, 570], [1010, 1240], [925, 1190]]); ctx.fill();
  ctx.fillStyle = '#16181b'; poly(ctx, [[935, 625], [1000, 603], [1000, 660], [935, 678]]); ctx.fill();
  ctx.fillStyle = o.display ? '#ff3b30' : '#3a1210'; ctx.font = `900 40px ${MONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.display || '9', 968, 643);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { const bx = 950 + j * 36, by = 720 + i * 62 - j * 12; ctx.fillStyle = o.press === 'call' ? '#9aa1a8' : '#9aa1a8'; ell(ctx, bx, by, 13, 15); ctx.fill(); }
  ctx.fillStyle = o.press === 'call' ? '#ffd23f' : '#c29a2a'; ell(ctx, 950, 1120, 16, 18); ctx.fill();
  ctx.fillStyle = o.stop ? '#ff3b30' : '#a8302a'; ell(ctx, 988, 1110, 18, 20); ctx.fill();
  if (o.stop) glow(ctx, 988, 1110, 90, 'rgba(255,60,40,1)', .5 * (.6 + .4 * Math.sin(t * 9)));
  if (o.press === 'call') glow(ctx, 950, 1120, 70, 'rgba(255,210,63,1)', .5);
  // the speaker grille
  ctx.fillStyle = '#9aa1a8'; ell(ctx, 968, 1180, 26, 30); ctx.fill(); ctx.fillStyle = '#4c5258'; for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2; ell(ctx, 968 + Math.cos(a) * 13, 1180 + Math.sin(a) * 15, 3, 3); ctx.fill(); }
  if (o.speak > 0) for (let i = 0; i < 3; i++) { const u = (t * 1.6 + i / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - u) * clamp(o.speak); ctx.strokeStyle = TSC.y; ctx.lineWidth = 6; ell(ctx, 968, 1180, 30 + u * 140, 34 + u * 160); ctx.stroke(); ctx.restore(); }
}

SHOTS.push(
  // Ты застрял в лифте ровно в тот момент, когда всё началось.
  { t0: 0, fadeIn: .2, draw(ctx, lt, d, t) {
    const cab = anim(t, [[0, floorY(7)], [C(2) + .4, floorY(9) - .55 * FH]], x => x);
    building(ctx, t, { camY: cab - 240 - lt * 20, cab, smoke: sstep(Wd(1, 'началось') - .3, Wd(1, 'началось') + .6, t), inside: (x, cx, fy) => {
      guy(x, cx - 40, fy, 230, { face: 1, eyes: 'dot', armR: [-.25, -.3] }); carrier(x, t, cx + 60, fy, .22, { mood: 'calm' }); } });
    topTitle(ctx, 'ТЫ ЗАСТРЯЛ В ЛИФТЕ', 'КОГДА ВСЁ НАЧАЛОСЬ', appear(t, 0, 1e9, .3));
  } },
  // Кабина дёрнулась и встала между девятым и десятым.
  { t0: C(2), trans: 'cut', draw(ctx, lt, d, t) {
    const jolt = Wd(2, 'дёрнулась'), stop = floorY(9) - .55 * FH;
    const cab = t < jolt ? lerp(stop + 40, stop, clamp((t - C(2)) / (jolt - C(2)))) : stop + Math.sin((t - jolt) * 22) * 14 * Math.exp(-(t - jolt) * 4);
    const [sx, sy] = shake(t, [[jolt, 1.4]], 16);
    ctx.save(); ctx.translate(sx, sy);
    push(ctx, lt, d, 595, 960, 1.25, 1.35);
    building(ctx, t, { camY: stop - 165, cab, shake: t > jolt ? Math.exp(-(t - jolt) * 3) : 0, inside: (x, cx, fy) => {
      const st = t > jolt ? Math.exp(-(t - jolt) * 3) : 0;
      guy(x, cx - 40, fy, 230, { face: 1, eyes: t > jolt ? 'wide' : 'dot', mouth: st * .6, lean: -st * .3, armR: [-.25 - st, -.3], armL: [.3 + st, .2] }); carrier(x, t, cx + 60, fy, .22, { mood: t > jolt ? 'alert' : 'calm' }); } });
    ctx.restore();
    pill(ctx, 540, 300, 'МЕЖДУ 9 И 10', 'yellow', clamp((t - Wd(2, 'девятым')) / .25), { icon: 'warn' });
  } },
  // Свет погас. Кнопка вызова молчит.
  { t0: C(3), trans: 'cut', draw(ctx, lt, d, t) {
    const off = Wd(3, 'погас'), dark = t < off ? 0 : (t < off + .25 ? (Math.sin((t - off) * 60) > 0 ? 1 : .3) : 1), press = t > Wd(3, 'кнопка') && t < Wd(3, 'молчит') + .3;
    push(ctx, lt, d, 700, 1000, 1.0, 1.06);
    cabinIn(ctx, t, { light: 1 - dark, press: press ? 'call' : null });
    const reach = sstep(Wd(3, 'кнопка') - .3, Wd(3, 'кнопка') + .1, t);
    guy(ctx, 560, 1760, 1050, { face: 1, eyes: dark ? 'wide' : 'dot', armR: [lerp(-.2, 2.05, reach), lerp(-.2, .35, reach)], armL: [.2, .1], look: .6 });
    darkness(ctx, dark, press ? [950, 1120, 260] : null);
    pill(ctx, 540, 300, 'НЕТ ОТВЕТА', 'red', clamp((t - Wd(3, 'молчит')) / .25), { icon: 'cross' });
  } },
  // В телефоне двенадцать процентов. Связи нет.
  { t0: C(4), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0b0f1a'], [1, '#05070d']]);
    push(ctx, lt, d, 540, 820, 1.0, 1.06);
    phone(ctx, t, { battery: 12, noSignal: t > Wd(4, 'связи') });
    glow(ctx, 540, 820, 700, 'rgba(120,150,230,1)', .08);
    pill(ctx, 540, 1500, '12% ЗАРЯДА', 'red', clamp((t - Wd(4, 'двенадцать')) / .25), { icon: 'battery' });
    pill(ctx, 540, 1610, 'НЕТ СЕТИ', 'dark', clamp((t - Wd(4, 'связи')) / .25), { icon: 'cross' });
  } },
  // Сверху по лестнице кто-то бежит. Кричит. Потом — тишина.
  { t0: C(5), trans: 'cut', draw(ctx, lt, d, t) {
    const stop = floorY(9) - .55 * FH, run = clamp((t - Wd(5, 'кто-то') + .4) / 1.8), scream = Wd(6, 'кричит'), gone = t > Wd(7, 'тишина') - .2;
    // the runner goes up the two flights between floor 10 and 11
    const u = run, rx = u < .5 ? lerp(800, 1010, u * 2) : lerp(1010, 800, (u - .5) * 2), ry = u < .5 ? lerp(floorY(10), floorY(10) - FH / 2, u * 2) : lerp(floorY(10) - FH / 2, floorY(11), (u - .5) * 2);
    push(ctx, lt, d, 940, 760, 1.25, 1.36);
    building(ctx, t, { camY: stop - 470, cab: stop, light: 0, runner: !gone && run > 0 ? [rx, ry - 10] : null, runnerFace: u < .5 ? 1 : -1, inside: (x, cx, fy) => {
      guy(x, cx - 40, fy, 230, { face: 1, eyes: 'wide', lookY: -1, look: .5, mouth: t > scream ? .4 : 0 }); carrier(x, t, cx + 60, fy, .22, { mood: t > scream ? 'alert' : 'calm' }); } });
    tint(ctx, '#5f6a8f', .35, 'multiply');
    if (t > scream && t < scream + 1.4) { const a = t - scream; ctx.save(); ctx.globalAlpha = 1 - a / 1.4; outlined(ctx, 'А-А-А!', 900 + a * 20, 560 - a * 90, 64, TSC.r); ctx.restore(); tint(ctx, '#5a0606', .25 * Math.max(0, 1 - a * 2), 'screen'); }
    pill(ctx, 540, 1560, 'ТИШИНА', 'dark', clamp((t - Wd(7, 'тишина')) / .25));
  } },
  // Последняя новость: «Не выходите. Заражённые идут на звук».
  { t0: C(8), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0b0f1a'], [1, '#05070d']]);
    push(ctx, lt, d, 540, 820, 1.0, 1.05);
    phone(ctx, t, { battery: 11, noSignal: 1, notif: (t - Wd(8, 'новость')) / .45, lines: t > Wd(8, 'заражённые') ? 2 : t > Wd(8, 'не') ? 1 : 0 });
    if (t > Wd(8, 'звук')) for (let i = 0; i < 3; i++) { const u = (t * 1.3 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - u; ctx.strokeStyle = TSC.r; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(820, 300, 40 + u * 120, -.8, .8); ctx.stroke(); ctx.restore(); }
  } },
  // С тобой полбутылки воды, шоколадка и кот в переноске.
  { t0: C(9), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1300, 1.0, 1.05);
    cabinIn(ctx, t, { light: 0 });
    guy(ctx, 330, 1640, 1300, { face: 1, sit: 'floor', eyes: 'dot', armR: [1.55, -1.2], armL: [1.35, -1.1] });
    const pop = w => clamp((t - Wd(9, w)) / .3);
    const bw = outBack(pop('полбутылки'));
    if (bw > 0) { ctx.save(); ctx.translate(640, 1660); ctx.scale(bw, bw); ctx.fillStyle = 'rgba(170,210,240,0.55)'; rrect(ctx, -40, -170, 80, 190, 22); ctx.fill(); ctx.fillStyle = '#3f8fd8'; rrect(ctx, -36, -70, 72, 86, [0, 0, 18, 18]); ctx.fill(); ctx.fillStyle = '#2d5fa8'; rrect(ctx, -18, -200, 36, 34, 8); ctx.fill(); ctx.restore(); }
    const cw = outBack(pop('шоколадка'));
    if (cw > 0) { ctx.save(); ctx.translate(760, 1700); ctx.rotate(-.15); ctx.scale(cw, cw); ctx.fillStyle = '#6b3a1e'; rrect(ctx, -70, -26, 140, 52, 6); ctx.fill(); ctx.fillStyle = '#c23b3b'; ctx.fillRect(-70, -26, 70, 52); ctx.fillStyle = '#fff'; ctx.font = `900 18px ${MONT}`; ctx.textAlign = 'center'; ctx.fillText('ШОК', -35, 4); ctx.restore(); }
    const kw = pop('кот');
    if (kw > 0) carrier(ctx, t, 880, 1800, .62 * outBack(kw), { mood: 'calm' });
    darkness(ctx, 1, [560, 1450, 700]);
    pill(ctx, 300, 330, 'ВОДА 0,5 Л', 'blue', pop('полбутылки'), { icon: 'drop' });
    pill(ctx, 300, 430, 'ШОКОЛАДКА', 'yellow', pop('шоколадка'));
    pill(ctx, 300, 530, 'КОТ', 'orange', kw);
  } },
  // Сутки вы сидите и почти не дышите.
  { t0: C(10), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1300, 1.04, 1.1);
    cabinIn(ctx, t, { light: 0 });
    guy(ctx, 360, 1640, 1300, { face: 1, sit: 'floor', eyes: 'dot', look: .2, armR: [1.55, -1.2], armL: [1.35, -1.1], idle: true });
    carrier(ctx, t, 820, 1800, .62, { mood: 'calm' });
    const hrs = Math.floor(lerp(0, 24, clamp(lt / (d - .3))));
    darkness(ctx, 1, [520, 1300, 620 + 40 * Math.sin(t * 2)]);
    pill(ctx, 540, 320, `${String(hrs).padStart(2, '0')}:00 / 24:00`, 'yellow', clamp(lt / .3), { icon: 'bolt' });
    pill(ctx, 540, 430, '4% ЗАРЯДА', 'red', clamp((t - Wd(10, 'не')) / .3), { icon: 'battery' });
  } },
  // И вдруг в динамике щелчок.
  { t0: C(11), trans: 'cut', draw(ctx, lt, d, t) {
    const click = Wd(11, 'щелчок');
    vgrad(ctx, 0, 0, W, H, [[0, '#a9b0b6'], [1, '#868d94']]);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 3; for (let x = 0; x < W; x += 14) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 30, H); ctx.stroke(); }
    ctx.save(); ctx.translate(540, 820); const k = t > click ? 1 + .06 * Math.exp(-(t - click) * 8) : 1; ctx.scale(k, k);
    ctx.fillStyle = '#c4c9cd'; ell(ctx, 0, 0, 300, 300); ctx.fill(); ctx.fillStyle = '#9aa1a8'; ell(ctx, 0, 0, 250, 250); ctx.fill();
    ctx.fillStyle = '#3c4248'; for (let r = 0; r < 5; r++) { const n = r === 0 ? 1 : r * 8; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; ell(ctx, Math.cos(a) * r * 48, Math.sin(a) * r * 48, 14, 14); ctx.fill(); } }
    ctx.restore();
    darkness(ctx, .75, [540, 820, 700]);
    if (t > click) { const a = t - click; for (let i = 0; i < 2; i++) { const u = clamp(a * 1.2 - i * .3); if (u <= 0 || u >= 1) continue; ctx.save(); ctx.globalAlpha = 1 - u; ctx.strokeStyle = TSC.y; ctx.lineWidth = 10; ell(ctx, 540, 820, 300 + u * 300, 300 + u * 300); ctx.stroke(); ctx.restore(); }
      if (a < 1.2) { ctx.save(); ctx.globalAlpha = 1 - a / 1.2; outlined(ctx, 'ЩЁЛК', 760, 420 - a * 60, 70, TSC.y); ctx.restore(); } }
    pill(ctx, 540, 300, 'ДИНАМИК', 'dark', clamp(lt / .3));
  } },
  // «Кабина три, вы живы? Я диспетчер. Вижу вас по камере».
  { t0: C(12), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 900, 1100, 1.0, 1.08);
    cabinIn(ctx, t, { light: 0, speak: MOUTH(t) > .1 ? 1 : .3 });
    const up = sstep(C(12), C(12) + .6, t);
    guy(ctx, 520, 1760, 1050, { face: 1, eyes: 'wide', look: 1, lookY: -.3, mouth: up * .3, armL: [.2, .1], armR: [-.1, -.1], crouch: (1 - up) * .5 });
    darkness(ctx, 1, [968, 1180, 520 + 120 * MOUTH(t)]);
    pill(ctx, 540, 300, 'ДИСПЕТЧЕР', 'yellow', clamp((t - Wd(12, 'диспетчер')) / .25));
    pill(ctx, 540, 410, 'ВИДИТ ПО КАМЕРЕ', 'dark', clamp((t - Wd(12, 'камере')) / .25));
  } },
);
