// Episode 2 "The island", vertical flat cut — scene 1 (0:00–0:48.8): the hook, the crash, rule one.
// Panels start at the pause before a script line (C(n)); Wd(n, 'слово') is the moment a word is spoken.
'use strict';
var XFADE = .2, END = 192.6;
window.OVERLAY = (ctx, t) => captions(ctx, t);
window.POST = { drift: 1, bloom: .45, grain: .1, lift: .3 };

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
