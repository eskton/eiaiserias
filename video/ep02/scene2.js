// Episode 2, scene 2 (0:48.8–1:42.5): sunset and cold, rule two, the radio, rules three and four.
'use strict';

SHOTS.push(
  // Солнце садится.
  { t0: C(19), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1.0, 1.05);
    const sy = lerp(700, 880, lt / d);
    island(ctx, t, { tod: 'dusk', sun: [540, sy], extra: x => toon(x, 420, 1560, 300, { sit: 1, face: 1, eyes: 'dot', armL: [.6, -.9], armR: [.8, -1.0] }, ANTON) });
    specks(ctx, t, 30, 11, .25); vignette(ctx);
  } },
  // Кажется, на тёплом пляже можно спать без укрытия.
  { t0: C(20), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1400, 1.15, 1.22);
    island(ctx, t, { tod: 'dusk', sun: [700, 900], extra: x => lying(x, t, 330, 1600, 560, ANTON) });
    const z = clamp((t - Wd(20, 'спать')) / 2); ctx.fillStyle = `rgba(255,255,255,${.7 * z})`; ctx.font = '800 48px Inter'; ctx.textAlign = 'left';
    for (let i = 0; i < 3; i++) { const u = (t * .45 + i / 3) % 1; ctx.globalAlpha = z * Math.sin(Math.PI * u); ctx.fillText('z', 380 + u * 90 + Math.sin(u * 6) * 14, 1460 - u * 220); } ctx.globalAlpha = 1;
    tag(ctx, 90, 240, 'КАЖЕТСЯ…', appear(t, Wd(20, 'кажется')), PAL.yellow);
    tag(ctx, 90, 316, 'БЕЗ УКРЫТИЯ', appear(t, Wd(20, 'укрытия')), '#ffffff');
    vignette(ctx);
  } },
  // Но ночью температура падает до пятнадцати градусов,
  { t0: C(21), trans: 'flash', draw(ctx, lt, d, t) {
    island(ctx, t, { tod: 'night', palms: [[110, 1420, 820, .25, 1]], moon: [880, 170] });
    const v = anim(t, [[Wd(21, 'падает'), 30], [Wd(21, 'градусов'), 15]]);
    thermometer(ctx, 840, 990, v);
    headline(ctx, `+${Math.round(v)}°`, appear(t, Wd(21, 'температура')), v < 20 ? '#7fb0ff' : 'w', 330, 'НОЧЬЮ', 150);
    specks(ctx, t, 30, 12, .3); vignette(ctx);
  } },
  // а в мокрой одежде тело теряет тепло очень быстро.
  { t0: C(22), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1.0, 1.08);
    island(ctx, t, { tod: 'night', palms: [], moon: [880, 170] });
    const sh = (noise1(t * 25) - .5) * 14;
    toon(ctx, 540 + sh, 1700, 1100, { eyes: 'wide', armL: [.9, 1.9], armR: [-.9, -1.9], mouth: .25 }, ANTON);
    const r = rng(13); for (let i = 0; i < 12; i++) { const u = (t * .9 + r()) % 1; ctx.fillStyle = `rgba(160,200,255,${.8 * (1 - u)})`; ell(ctx, 400 + r() * 280, 1100 + u * 500, 6, 12); ctx.fill(); }
    ctx.save(); ctx.strokeStyle = PAL.red; ctx.lineWidth = 10; ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .45, u = (t * .7 + i / 6) % 1, r0 = 380 + u * 260; ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.moveTo(540 + Math.cos(a) * r0, 1000 + Math.sin(a) * r0 * 1.2); ctx.lineTo(540 + Math.cos(a) * (r0 + 70), 1000 + Math.sin(a) * (r0 + 70) * 1.2); ctx.stroke(); }
    ctx.restore();
    tag(ctx, 90, 240, 'МОКРАЯ ОДЕЖДА', appear(t, Wd(22, 'мокрой')), '#7fb0ff');
    tag(ctx, 90, 316, 'ТЕПЛО УХОДИТ', appear(t, Wd(22, 'теряет')), PAL.red);
    vignette(ctx, .6);
  } },
  // Правило второе.
  { t0: C(23), trans: 'flash', draw(ctx, lt, d, t) { ruleCard(ctx, lt, t, 2, 'УКРЫТИЕ'); } },
  // Сначала укрытие, потом всё остальное.
  { t0: C(24), trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#0e1322'], [1, '#05070d']]);
    const k = outBack(clamp((t - Wd(24, 'укрытие')) / .4));
    ctx.save(); ctx.translate(540, 680); ctx.scale(k, k); ctx.fillStyle = PAL.yellow; ell(ctx, 0, 0, 230, 230); ctx.fill(); icon(ctx, 'shelter', 0, 10, 1.9, '#0c0f16'); ctx.restore();
    headline(ctx, '1', appear(t, Wd(24, 'укрытие')), 'y', 370, null, 110);
    ['water', 'fire', 'food'].forEach((kd, i) => { const a = outBack(clamp((t - Wd(24, 'потом') - i * .15) / .35)); if (a > 0) { ctx.save(); ctx.globalAlpha = .45; ctx.translate(260 + i * 280, 1020); ctx.scale(a, a); ctx.fillStyle = '#2a3142'; ell(ctx, 0, 0, 90, 90); ctx.fill(); icon(ctx, kd, 0, 0, .8, '#9aa3b5'); ctx.restore(); } });
    specks(ctx, t, 30, 13, .3);
  } },
  // Нужен шалаш.
  { t0: C(25), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#123059'], [1, '#0b1d3a']]);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const u = clamp(lt / .9), segs = [[[200, 1100], [540, 480]], [[880, 1100], [540, 480]], [[300, 900], [780, 900]], [[120, 1100], [960, 1100]]];
    ctx.strokeStyle = '#e8f1ff'; ctx.lineWidth = 12; ctx.lineCap = 'round';
    segs.forEach(([a, b], i) => { const k = clamp(u * 4 - i); if (k > 0) { ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(lerp(a[0], b[0], k), lerp(a[1], b[1], k)); ctx.stroke(); } });
    ctx.fillStyle = '#e8f1ff'; ctx.font = '700 34px Inter'; ctx.textAlign = 'center'; if (u >= 1) ctx.fillText('А-ОБРАЗНЫЙ КАРКАС', 540, 1180);
    headline(ctx, 'ШАЛАШ', appear(t, Wd(25, 'шалаш')), 'y', 300, null, 120);
  } },
  // Из самолёта я взял немного еды и воды.
  { t0: C(26), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 800, 1, 1.05);
    supplies(ctx, t, (t - Wd(26, 'еды')) / .6, (t - Wd(26, 'воды')) / .6);
    tag(ctx, 90, 240, 'ИЗ САМОЛЁТА', appear(lt, .15));
  } },
  // На пару дней хватит. Дальше — нет.
  { t0: C(27), trans: 'cut', draw(ctx, lt, d, t) {
    supplies(ctx, t, 2, 2, sstep(Wd(27, 'нет') - .1, Wd(27, 'нет') + .5, t) * .7);
    headline(ctx, '2 ДНЯ', appear(t, Wd(27, 'пару')), 'y', 300, null, 130);
    if (t > Wd(27, 'дальше')) headline(ctx, 'ДАЛЬШЕ — НЕТ', appear(t, Wd(27, 'дальше')), 'r', 470, null, 90);
  } },
  // Всё остальное придётся добывать самому.
  { t0: C(28), trans: 'whip', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1100, 1.0, 1.06);
    island(ctx, t, { tod: 'day', palms: [[120, 1460, 900, .2, 4], [380, 1380, 760, .12, 5], [900, 1420, 860, -.2, 6]], extra: x => toon(x, 640, 1640, 520, { face: -1, eyes: 'dot', armR: [-.4, -.6], props: { knife: 'R' } }, ANTON) });
    tag(ctx, 90, 240, 'ВСЁ ОСТАЛЬНОЕ — САМОМУ', appear(t, Wd(28, 'добывать')), PAL.yellow);
    vignette(ctx, .4);
  } },
  // В кабине пилотов нахожу старую рацию.
  { t0: C(29), trans: 'zoom', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1150, 1.0, 1.12);
    cockpit(ctx, t, { radio: 1, tilt: .12 });
    const g = clamp((t - Wd(29, 'рацию')) / .3); if (g > 0) glow(ctx, 540, 1600, 420, 'rgba(255,220,140,1)', .22 * g * (.8 + .2 * Math.sin(t * 5)));
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 3; for (const pts of [[[600, 420], [680, 500], [650, 600]], [[680, 500], [800, 520]]]) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
    tag(ctx, 90, 240, 'СТАРАЯ РАЦИЯ', appear(t, Wd(29, 'рацию')), PAL.yellow);
  } },
  // Сквозь помехи слышу обрывки:
  { t0: C(30), trans: 'cut', draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 820, 1.0, 1.06);
    radioClose(ctx, t, 1, null);
    tag(ctx, 90, 240, 'ПОМЕХИ', appear(t, Wd(30, 'помехи')));
  } },
  // «Вирус передаётся через укус… Полная эвакуация через девяносто шесть часов».
  { t0: C(31), trans: 'cut', draw(ctx, lt, d, t) {
    const second = t > Wd(31, 'полная') - .1;
    push(ctx, lt, d, 540, 820, 1.04, 1.12);
    radioClose(ctx, t, .35 + .25 * noise1(t * 3), t > Wd(31, 'девяносто') ? t - Wd(31, 'девяносто') : null);
    if (!second) headline(ctx, '«ВИРУС — ЧЕРЕЗ УКУС»', appear(t, Wd(31, 'вирус')), 'r', 250, null, 84);
    else headline(ctx, '«ЭВАКУАЦИЯ ЧЕРЕЗ 96 ЧАСОВ»', appear(t, Wd(31, 'полная') - .1), 'y', 250, null, 72);
  } },
  // Правило третье.
  { t0: C(32), trans: 'flash', draw(ctx, lt, d, t) { ruleCard(ctx, lt, t, 3, 'УКУСЫ'); } },
  // Любой укус означает конец.
  { t0: C(33), trans: 'whip', draw(ctx, lt, d, t) {
    wrist(ctx, t, {});
    const k = clamp((t - Wd(33, 'укус')) / .25), T = Wd(33, 'укус');
    ctx.save(); ctx.translate(420, 870); ctx.globalAlpha = k;
    const g = ctx.createRadialGradient(0, 10, 20, 0, 10, 190); g.addColorStop(0, 'rgba(150,40,70,0.6)'); g.addColorStop(1, 'rgba(150,40,70,0)'); ctx.fillStyle = g; ell(ctx, 0, 10, 190, 110); ctx.fill();
    const r = rng(21);
    for (const [cy, dir] of [[-34, -1], [52, 1]]) for (let i = 0; i < 7; i++) {
      const u = (i - 3) / 3, px = u * 115, py = cy + dir * (1 - u * u) * 22, w = (Math.abs(u) < .4 ? 34 : 26) + r() * 6;
      ctx.save(); ctx.translate(px, py); ctx.rotate(-dir * u * .5);
      ctx.fillStyle = PAL.bloodD; rrect(ctx, -w / 2, -9, w, 18, 9); ctx.fill(); ctx.fillStyle = PAL.blood; rrect(ctx, -w / 2 + 4, -5, w - 8, 7, 4); ctx.fill();
      ctx.restore();
    }
    const v = clamp((t - T - .3) / 1.5); ctx.strokeStyle = 'rgba(70,25,55,0.75)'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + .3, r0 = 140; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0 * .55); for (let j = 1; j <= 4; j++) { const rr = r0 + 60 * j * v; ctx.lineTo(Math.cos(a + Math.sin(j * 2 + i) * .08) * rr, Math.sin(a + Math.sin(j * 2 + i) * .08) * rr * .55); } ctx.stroke(); }
    ctx.fillStyle = PAL.bloodD; ctx.strokeStyle = PAL.bloodD; ctx.lineWidth = 12;
    for (const [dx, dl] of [[-70, 1], [10, .7], [80, .85]]) { const L = clamp((t - T - .15) / 1.4) * 70 * dl; if (L <= 0) continue; ctx.beginPath(); ctx.moveTo(dx, 60); ctx.lineTo(dx + 2, 60 + L); ctx.stroke(); ell(ctx, dx + 2, 64 + L, 9, 12); ctx.fill(); }
    ctx.restore();
    headline(ctx, 'КОНЕЦ', appear(t, Wd(33, 'конец')), 'r', 300, null, 140);
  } },
  // Каждого встречного нужно проверять.
  { t0: C(34), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#101826'], [1, '#080b12']]);
    const xs = [250, 540, 830];
    xs.forEach((x, i) => toon(ctx, x, 1250, 560, { eyes: 'dot', seed: i }, [LOOK.girl, LOOK.man1, LOOK.man2][i]));
    const sx = lerp(60, 1020, (lt * .7) % 1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(sx - 60, 0, sx + 60, 0); g.addColorStop(0, 'rgba(60,255,140,0)'); g.addColorStop(.5, 'rgba(60,255,140,0.45)'); g.addColorStop(1, 'rgba(60,255,140,0)'); ctx.fillStyle = g; ctx.fillRect(sx - 60, 600, 120, 700); ctx.restore();
    tag(ctx, 90, 240, 'ПРОВЕРЯТЬ КАЖДОГО', appear(t, Wd(34, 'проверять')), PAL.yellow);
    specks(ctx, t, 30, 14, .3); vignette(ctx, .5);
  } },
  // Правило четвёртое.
  { t0: C(35), trans: 'flash', draw(ctx, lt, d, t) { ruleCard(ctx, lt, t, 4, 'ВОДА'); } },
  // Не пей морскую воду: соль только усиливает жажду.
  { t0: C(36), trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#6fb0dc'], [1, '#2c79ad']]);
    ctx.save(); ctx.translate(540, 820);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; poly(ctx, [[-200, -300], [200, -300], [160, 300], [-160, 300]]); ctx.fill();
    ctx.save(); poly(ctx, [[-196, -150], [196, -150], [160, 296], [-160, 296]]); ctx.clip(); vgrad(ctx, -200, -170, 400, 470, [[0, '#3f95c6'], [1, '#1d5f8c']]);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 6; ctx.beginPath(); for (let x = -200; x <= 200; x += 10) ctx.lineTo(x, -150 + Math.sin(x * .05 + t * 4) * 10); ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#fff'; const r = rng(2); for (let i = 0; i < 16; i++) { const k = clamp((t - Wd(36, 'соль')) / .5); if (k <= 0) break; ctx.save(); ctx.translate(-140 + r() * 280, -380 - r() * 160 + k * 160); ctx.rotate(r()); ctx.fillRect(-10, -10, 20, 20); ctx.restore(); }
    ctx.restore();
    const x = outBack(clamp((t - Wd(36, 'пей')) / .35));
    ctx.save(); ctx.translate(540, 820); ctx.scale(x, x); ctx.strokeStyle = PAL.red; ctx.lineWidth = 40; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-260, -260); ctx.lineTo(260, 260); ctx.moveTo(260, -260); ctx.lineTo(-260, 260); ctx.stroke(); ctx.restore();
    tag(ctx, 90, 240, 'СОЛЬ = ЖАЖДА', appear(t, Wd(36, 'жажду')), PAL.red);
    vignette(ctx, .4);
  } },
  // Лови дождь на листья,
  { t0: C(37), trans: 'cut', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#4d6276'], [1, '#2f3e4d']]);
    ctx.strokeStyle = 'rgba(200,220,240,0.6)'; ctx.lineWidth = 3; const r = rng(3);
    for (let i = 0; i < 80; i++) { const x = r() * W, y = ((r() * H + t * 1400) % H); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 8, y + 40); ctx.stroke(); }
    ctx.fillStyle = '#2f7048'; ctx.beginPath(); ctx.moveTo(100, 600); ctx.quadraticCurveTo(500, 450, 860, 820); ctx.quadraticCurveTo(480, 760, 100, 600); ctx.fill();
    ctx.strokeStyle = '#245a39'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(100, 600); ctx.quadraticCurveTo(480, 610, 860, 820); ctx.stroke();
    for (let i = 0; i < 5; i++) { const u = (t * .8 + i / 5) % 1; ctx.fillStyle = 'rgba(180,220,255,0.9)'; ell(ctx, lerp(300, 840, u), lerp(640, 820, u) + (u > .95 ? (u - .95) * 4000 : 0), 12, 16); ctx.fill(); }
    ctx.fillStyle = 'rgba(120,180,230,0.6)'; rrect(ctx, 780, 960, 150, 300, 30); ctx.fill(); ctx.fillStyle = 'rgba(80,150,220,0.8)'; const lvl = clamp(lt / 3) * 160; ctx.fillRect(790, 1250 - lvl, 130, lvl);
    tag(ctx, 90, 240, 'ДОЖДЬ', appear(lt, .15), PAL.yellow);
    vignette(ctx, .45);
  } },
  // собирай росу на плёнку,
  { t0: Wd(37, 'собирай') - .05, trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#f2c98d'], [1, '#8fb1c4']]);
    ctx.fillStyle = 'rgba(230,240,250,0.45)'; poly(ctx, [[120, 600], [960, 560], [900, 1150], [180, 1190]]); ctx.fill();
    const r = rng(5); for (let i = 0; i < 40; i++) { const x = 200 + r() * 680, y = 640 + r() * 480, s = 6 + r() * 12, tw = Math.max(0, Math.sin(t * 3 + i)) ** 6; ctx.fillStyle = 'rgba(255,255,255,0.75)'; ell(ctx, x, y, s, s * .9); ctx.fill(); if (tw > .2) glow(ctx, x - s * .3, y - s * .3, s * 2, 'rgba(255,255,255,1)', tw * .8); }
    tag(ctx, 90, 240, 'РОСА', appear(lt, .15), PAL.yellow);
    vignette(ctx, .35);
  } },
  // пей сок кокоса.
  { t0: Wd(37, 'пей') - .05, trans: 'whip', draw(ctx, lt, d, t) {
    vgrad(ctx, 0, 0, W, H, [[0, '#7fc1e3'], [1, '#e3cb96']]);
    ctx.fillStyle = '#5a3d25'; ell(ctx, 540, 880, 260, 240); ctx.fill(); ctx.fillStyle = '#6b4a2e'; ell(ctx, 500, 840, 200, 180); ctx.fill();
    ctx.fillStyle = '#efe6cf'; ell(ctx, 540, 680, 90, 34); ctx.fill();
    ctx.strokeStyle = '#e8463c'; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(560, 690); ctx.lineTo(680, 380); ctx.lineTo(760, 360); ctx.stroke();
    const sip = (Math.sin(t * 5) * .5 + .5); ctx.fillStyle = `rgba(255,255,255,${.6 * sip})`; ell(ctx, 640, 480, 10, 14); ctx.fill();
    tag(ctx, 90, 240, 'КОКОС', appear(lt, .15), PAL.yellow);
    vignette(ctx, .35);
  } },
);
