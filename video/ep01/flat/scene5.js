// Episode 1, vertical flat cut — scene 5 (4:27.2–5:14.4): the empty street, the supermarket, two of the infected.
'use strict';

const INF = Object.assign({}, LOOK.infected, { blood: 1 });

// The empty street at dawn, seen from the side; ox scrolls the background (parallax).
function street(ctx, t, ox = 0, o = {}) {
  vgrad(ctx, 0, 0, W, 1100, [[0, '#0b1220'], [.6, '#1f2a3d'], [1, '#3a3d48']]);
  const r = rng(91);
  // far blocks
  for (let k = 0; k < 12; k++) {
    const x = ((k * 230 - ox * .3) % 2760 + 2760) % 2760 - 400, bh = 380 + r() * 360, bw = 200 + r() * 60;
    ctx.fillStyle = '#1a2130'; ctx.fillRect(x, 1100 - bh, bw, bh);
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; for (let wy = 1100 - bh + 30; wy < 1080; wy += 46) for (let wx = x + 16; wx < x + bw - 20; wx += 36) ctx.fillRect(wx, wy, 18, 24);
  }
  // sidewalk, kerb, road
  ctx.fillStyle = '#2a2e36'; ctx.fillRect(0, 1060, W, 60); ctx.fillStyle = '#3a3f48'; ctx.fillRect(0, 1060, W, 8);
  ctx.fillStyle = '#16181d'; ctx.fillRect(0, 1120, W, H - 1120);
  ctx.fillStyle = '#5a5e66'; for (let k = 0; k < 8; k++) { const x = ((k * 260 - ox) % 2080 + 2080) % 2080 - 300; ctx.fillRect(x, 1420, 140, 14); }
  // dead street lamps and a traffic light
  for (let k = 0; k < 4; k++) {
    const x = ((k * 520 + 200 - ox * .9) % 2080 + 2080) % 2080 - 300;
    ctx.fillStyle = '#0f1116'; ctx.fillRect(x, 560, 12, 500); ctx.fillRect(x, 560, 110, 10); ctx.fillStyle = '#2a2d33'; rrect(ctx, x + 90, 566, 50, 16, 6); ctx.fill();
  }
  // abandoned cars on the road
  const car = (x, y, col, open) => {
    ctx.fillStyle = col; rrect(ctx, x, y - 90, 420, 90, 26); ctx.fill(); rrect(ctx, x + 70, y - 165, 240, 90, [40, 60, 0, 0]); ctx.fill();
    ctx.fillStyle = '#1b2230'; rrect(ctx, x + 92, y - 150, 90, 66, 10); ctx.fill(); rrect(ctx, x + 192, y - 150, 100, 66, 10); ctx.fill();
    ctx.fillStyle = '#0c0d10'; ell(ctx, x + 90, y, 42, 42); ctx.fill(); ell(ctx, x + 330, y, 42, 42); ctx.fill();
    if (open) { ctx.fillStyle = shade(col, -.2); poly(ctx, [[x + 190, y - 150], [x + 120, y - 190], [x + 120, y - 30], [x + 190, y - 10]]); ctx.fill(); }
  };
  if (!o.noCars) { car(((80 - ox) % 2400 + 2400) % 2400 - 500, 1330, '#6a3b34', true); car(((1250 - ox) % 2400 + 2400) % 2400 - 500, 1290, '#3d5266', false); }
  // paper and leaves in the wind
  const rr = rng(92);
  for (let i = 0; i < 26; i++) {
    const sp = 120 + rr() * 220, x = ((rr() * W + t * sp - ox * .2) % (W + 200)) - 100, y = 900 + rr() * 700 + Math.sin(t * 2 + i) * 20;
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * (rr() - .5) * 6); ctx.fillStyle = i % 3 ? '#5a4632' : '#c9c4b6'; ctx.fillRect(-8, -5, 16, 10); ctx.restore();
  }
}

// Supermarket front: dead sign, dark windows, the glass door smashed.
function storefront(ctx, t, o = {}) {
  vgrad(ctx, 0, 0, W, H, [[0, '#0d1422'], [1, '#141820']]);
  ctx.fillStyle = '#2b303a'; ctx.fillRect(40, 420, 1000, 760);
  ctx.fillStyle = '#20242c'; ctx.fillRect(40, 420, 1000, 140);
  ctx.fillStyle = '#4a4f58'; ctx.font = '900 96px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ПРОДУКТЫ', 540, 492);
  for (const x of [90, 690]) { ctx.fillStyle = '#0b0e14'; ctx.fillRect(x, 610, 300, 470); ctx.fillStyle = 'rgba(120,150,190,0.12)'; poly(ctx, [[x + 30, 610], [x + 110, 610], [x + 20, 1080], [x, 1080], [x, 760]]); ctx.fill(); }
  ctx.fillStyle = '#05070a'; ctx.fillRect(420, 610, 240, 470);
  ctx.strokeStyle = '#9aa5b5'; ctx.lineWidth = 3;
  for (const pts of [[[420, 610], [500, 700], [470, 820], [520, 900]], [[660, 610], [600, 720], [640, 860]], [[420, 1080], [480, 980], [560, 1040], [660, 960]]]) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
  ctx.fillStyle = 'rgba(170,190,215,0.35)'; poly(ctx, [[420, 610], [520, 610], [460, 690]]); ctx.fill(); poly(ctx, [[660, 610], [660, 700], [610, 640]]); ctx.fill();
  ctx.fillStyle = '#2a2e36'; ctx.fillRect(0, 1180, W, 40); vgrad(ctx, 0, 1220, W, H - 1220, [[0, '#15181d'], [1, '#0b0c0f']]);
  const r = rng(93); ctx.fillStyle = 'rgba(180,200,225,0.55)';
  for (let i = 0; i < 40; i++) { const x = 380 + r() * 340, y = 1190 + r() * 120, s = 3 + r() * 10; poly(ctx, [[x, y], [x + s, y + s * .3], [x + s * .3, y + s * .7]]); ctx.fill(); }
  if (o.group) o.group(ctx);
}

// A supermarket aisle in perspective, shelves mostly empty.
function aisle(ctx, t, o = {}) {
  const VX = 540, VY = 840, Pz = (u, x, y) => { const z = 1 + u * 5.5; return [VX + (x - VX) / z, VY + (y - VY) / z]; };
  ctx.fillStyle = '#101317'; ctx.fillRect(0, 0, W, H);
  const q = (pts, col) => { ctx.fillStyle = col; poly(ctx, pts); ctx.fill(); };
  q([[0, H], [W, H], Pz(1, W, H), Pz(1, 0, H)], '#2a2d30');
  q([[0, 0], [W, 0], Pz(1, W, 0), Pz(1, 0, 0)], '#14171b');
  q([Pz(1, 0, 0), Pz(1, W, 0), Pz(1, W, H), Pz(1, 0, H)], '#050608');
  for (const side of [0, W]) {
    q([[side, 120], Pz(1, side, 120), Pz(1, side, 1700), [side, 1700]], '#3a4048');
    for (let s = 0; s < 6; s++) {
      const y = 260 + s * 260;
      q([[side, y], Pz(1, side, y), Pz(1, side, y + 22), [side, y + 22]], '#59606a');
      const r = rng(s * 7 + side);
      for (let k = 0; k < 14; k++) {
        if (r() > (o.full ? .9 : .28)) continue;
        const u0 = k / 14, u1 = u0 + .045, top = y - 40 - r() * 60;
        q([Pz(u0, side, top), Pz(u1, side, top), Pz(u1, side, y), Pz(u0, side, y)], ['#b5503c', '#3f7a5a', '#c9a23a', '#3d6290', '#8a8f96'][(r() * 5) | 0]);
      }
    }
  }
  // stuff on the floor
  const r = rng(94);
  for (let i = 0; i < 16; i++) { const u = r() * .7, [x, y] = Pz(u, 150 + r() * 780, H); ctx.fillStyle = ['#b5503c', '#c9a23a', '#3d6290', '#d9d4c8'][i % 4]; ctx.save(); ctx.translate(x, y - 20 / (1 + u * 5)); ctx.rotate(r() * 3); ctx.fillRect(-30 / (1 + u * 5), -18 / (1 + u * 5), 60 / (1 + u * 5), 36 / (1 + u * 5)); ctx.restore(); }
  q([Pz(.3, 820, 1700), Pz(.55, 980, 1500), Pz(.6, 940, 1450), Pz(.33, 760, 1680)], '#3a4048');
  if (o.figures) o.figures(ctx, Pz);
}

SHOTS.push(
  // Мы решили покинуть дом.
  { t0: 267.2, fadeIn: .3, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1300, 1.1, 1.18);
    block(ctx, t, i => LIVE.includes(i) ? .9 : 0);
    const u = clamp(lt / d);
    [[LOOK.hero, 0, 1], [VERA, 60, 1], [BOY, 100, .65], [ILYA, 180, 1]].forEach(([lk, off, sc], i) => toon(ctx, 540 - off - u * 160 + 80, 1510, 150 * sc, walkPose(lt * 7 + i, -1, .8, { face: -1, eyes: lk === ILYA ? 'red' : 'dot' }), lk));
    tag(ctx, 90, 240, 'УХОДИМ', appear(lt, .2), PAL.yellow);
    specks(ctx, t, 40, 71); vignette(ctx);
  } },
  // На улице было непривычно тихо. Никаких машин. Никаких сирен. Только ветер.
  { t0: C(172), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 1000, 1, 1.05);
    street(ctx, t, lt * 30);
    const tags = [[S(172), 'ТИШИНА', '#ffffff'], [S(173), 'НИКАКИХ МАШИН', '#ffffff'], [S(174), 'НИКАКИХ СИРЕН', '#ffffff'], [S(175), 'ТОЛЬКО ВЕТЕР', PAL.yellow]];
    tags.forEach(([a, s, c], i) => tag(ctx, 90, 240 + i * 76, s, appear(t, a), c));
    specks(ctx, t, 40, 72); vignette(ctx);
  } },
  // Мы двигались небольшими группами. Я шёл первым. Вера с мальчиком — за мной. Илья шёл последним.
  { t0: C(176), draw(ctx, lt, d, t) {
    const focus = t < S(177) ? 540 : t < S(178) ? 820 : t < S(179) ? 520 : 200;
    cam(ctx, lt, d, clamp(lerp(540, focus, sstep(0, 1, (t - S(177)) / 1)), 470, 610), 1000, 1.0, 1.15, 900);
    street(ctx, t, lt * 220, { noCars: false });
    const walk = (x, lk, sc, ph, ex = {}) => toon(ctx, x, 1100, 520 * sc, walkPose(t * 7 + ph, 1, 1, Object.assign({ face: 1 }, ex)), lk);
    walk(820, LOOK.hero, 1, 0, { armR: [.9, -.3], props: { knife: 'R' } });
    walk(560, VERA, 1, 1.3, { props: { gun: 'R', gunDir: 1.2 } });
    walk(470, BOY, .66, 2.1);
    walk(200, ILYA, 1, 3, { eyes: 'red', lean: .08 });
    const tags = [[S(177), 'Я — ПЕРВЫЙ', '#ffffff'], [S(178), 'ВЕРА И МАЛЬЧИК', PAL.yellow], [S(179), 'ИЛЬЯ — ПОСЛЕДНИЙ', PAL.red]];
    tags.forEach(([a, s, c], i) => tag(ctx, 90, 240 + i * 76, s, appear(t, a), c));
    specks(ctx, t, 40, 73); vignette(ctx);
  } },
  // Мы добрались до супермаркета. Дверь была разбита.
  { t0: C(180), draw(ctx, lt, d, t) {
    const close = sstep(S(181) - .2, S(181) + .5, t);
    push(ctx, lt, d, 540, 850, lerp(1, 1.6, close), lerp(1, 1.6, close));
    storefront(ctx, t);
    tag(ctx, 90, t > S(181) ? 470 : 240, t > S(181) ? 'РАЗБИТА' : 'СУПЕРМАРКЕТ', 1, t > S(181) ? PAL.red : PAL.yellow);
    specks(ctx, t, 40, 74); vignette(ctx);
  } },
  // Внутри всё было перевёрнуто. Но еды почти не осталось.
  { t0: C(182), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 840, 1, 1.1);
    aisle(ctx, t);
    torchDark(ctx, 540, 900, 700, .55);
    tag(ctx, 90, 240, t > S(183) ? 'ЕДЫ ПОЧТИ НЕТ' : 'ВСЁ ПЕРЕВЁРНУТО', 1, t > S(183) ? PAL.red : '#ffffff');
  } },
  // Я нашёл несколько банок.
  { t0: C(184), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.06);
    vgrad(ctx, 0, 0, W, H, [[0, '#2d333b'], [1, '#1b1f25']]);
    ctx.fillStyle = '#59606a'; ctx.fillRect(0, 980, W, 40); ctx.fillRect(0, 560, W, 30);
    const taken = lt > .5;
    for (let k = 0; k < 4; k++) {
      if (taken && k === 1) continue;
      const x = 180 + k * 200;
      ctx.fillStyle = '#9aa0a8'; rrect(ctx, x, 760, 150, 220, 18); ctx.fill();
      ctx.fillStyle = ['#b5503c', '#c9a23a', '#3f7a5a', '#3d6290'][k]; ctx.fillRect(x, 820, 150, 100);
      ctx.fillStyle = '#c7ccd3'; ell(ctx, x + 75, 762, 75, 14); ctx.fill();
    }
    const reach = outc(lt / .45) - (lt > .5 ? outc((lt - .5) / .5) : 0);
    ctx.save(); ctx.translate(lerp(1100, 455, reach), 880); ctx.fillStyle = LOOK.hero.top; rrect(ctx, 60, -60, 600, 130, 60); ctx.fill(); ctx.fillStyle = LOOK.hero.skin; ell(ctx, 40, 0, 80, 70); ctx.fill(); ctx.restore();
    tag(ctx, 90, 240, 'НЕСКОЛЬКО БАНОК', appear(lt, .25), PAL.yellow);
    torchDark(ctx, 540, 880, 700, .4);
  } },
  // Потом услышал звук. Кто-то ходил между полками.
  { t0: C(185), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 840, 1.05, 1.15);
    const u = clamp((t - S(186)) / 1.4);
    aisle(ctx, t, { figures: (x, Pz) => { if (t > S(186)) { const [fx, fy] = Pz(.75, lerp(200, 880, u), H); x.fillStyle = '#000'; toon(x, fx, fy, 1500 / 5.1, walkPose(t * 6, 1, .8, { face: 1, eyes: 'red', lean: .2 }), { skin: '#08090b', hair: '#050506', top: '#08090b', topD: '#060708', legs: '#060708', shoes: '#040405' }); } } });
    torchDark(ctx, 540, 900, 700, .62);
    tag(ctx, 90, 240, t > S(186) ? 'КТО-ТО МЕЖДУ ПОЛКАМИ' : 'ЗВУК', 1, PAL.red);
  } },
  // Я поднял руку. Все остановились.
  { t0: C(187), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.05);
    aisle(ctx, t);
    torchDark(ctx, 540, 900, 760, .6);
    const up = outc(lt / .4);
    toon(ctx, 760, 1920, 1300, { face: 1, armR: [lerp(.2, 3.0, up), lerp(0, -.3, up)], armL: [-.1, .2] });
    if (t > S(188)) { toon(ctx, 300, 1700, 640, { face: 1, eyes: 'wide', props: { gun: 'R', gunDir: 1.3 } }, VERA); toon(ctx, 170, 1720, 420, { face: 1, eyes: 'wide' }, BOY); }
    tag(ctx, 90, 240, t > S(188) ? 'ВСЕ ЗАМЕРЛИ' : 'СТОП', 1, PAL.yellow);
  } },
  // Шаги приближались. Один заражённый появился из темноты.
  { t0: C(189), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 840, 1.1, 1.2);
    const u = clamp((t - S(190)) / 2);
    aisle(ctx, t, { figures: (x, Pz) => { if (t > S(190) - .3) { const uu = lerp(.85, .5, u), [fx, fy] = Pz(uu, 540, H); toon(x, fx, fy, 1500 / (1 + uu * 5.5), walkPose(t * 4.5, 0, .6, { eyes: 'red', lean: .15, head: [0, .04], mouth: .6 }), INF); } } });
    torchDark(ctx, 540, 860, lerp(500, 700, u), .65);
    const n = [.2, .7, 1.2].filter(a => t > S(189) + a).length;
    if (t < S(190)) headline(ctx, 'ШАГ. '.repeat(Math.max(1, n)).trim(), n ? 1 : 0, 'w', 300);
    else tag(ctx, 90, 240, 'ЗАРАЖЁННЫЙ', appear(t, S(190)), PAL.red);
  } },
  // Он посмотрел на нас. Потом посмотрел на Илью. И неожиданно остановился.
  { t0: C(191), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.06);
    bgDark(ctx);
    const look = t < S(192) ? 0 : -lerp(0, 1, outc((t - S(192)) / .5));
    portrait(ctx, 540, 700, 880, { eyes: 'red', sick: 1, mouth: .55, look, glowK: 1.2, teeth: 1 }, INF);
    torchDark(ctx, 540, 660, 640, .45);
    tag(ctx, 90, 140, t > S(193) ? 'ОСТАНОВИЛСЯ' : t > S(192) ? 'НА ИЛЬЮ' : 'НА НАС', 1, t > S(193) ? PAL.yellow : PAL.red);
  } },
  // Илья тоже остановился. Они просто смотрели друг на друга.
  { t0: C(194), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1, 1.05);
    aisle(ctx, t);
    torchDark(ctx, 540, 900, 760, .55);
    toon(ctx, 300, 1500, 900, { face: 1, eyes: 'red' }, ILYA);
    toon(ctx, 790, 1500, 880, { face: -1, eyes: 'red', lean: -.12, head: [-.02, .04], mouth: .4 }, INF);
    tag(ctx, 90, 240, t > S(195) ? 'СМОТРЯТ ДРУГ НА ДРУГА' : 'ИЛЬЯ ОСТАНОВИЛСЯ', 1, PAL.yellow);
  } },
  // Заражённый медленно опустил голову. И ушёл обратно.
  { t0: C(196), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 900, 1.05, 1.0);
    aisle(ctx, t);
    torchDark(ctx, 540, 900, 760, .55);
    const bow = outc((t - S(196)) / 1.2), away = clamp((t - S(197)) / 1.3);
    toon(ctx, 300, 1500, 900, { face: 1, eyes: 'red' }, ILYA);
    ctx.save(); ctx.globalAlpha = 1 - away;
    toon(ctx, 790 + away * 200, 1500 - away * 300, 880 * (1 - away * .5), away > 0 ? walkPose(t * 4, 1, .6, { face: 1, eyes: 'red', lean: .2 }) : { face: -1, eyes: 'red', lean: -.12, head: [-.02, .04 + .1 * bow] }, INF);
    ctx.restore();
    tag(ctx, 90, 240, away > 0 ? 'УШЁЛ' : 'ОПУСТИЛ ГОЛОВУ', 1);
  } },
  // Я посмотрел на Веру. Она побледнела.
  { t0: C(198), draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1, 1.05);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a1f27'], [1, '#0e1116']]);
    const pale = sstep(S(199), S(199) + .7, t);
    portrait(ctx, 540, 700, 860, { eyes: 'wide', brow: .8 }, Object.assign({}, VERA, { skin: pale ? '#e9e2da' : VERA.skin }));
    tag(ctx, 90, 140, t > S(199) ? 'ПОБЛЕДНЕЛА' : 'ВЕРА', 1, PAL.yellow);
  } },
  // Такого раньше не было.
  { t0: C(200), fadeOut: .3, draw(ctx, lt, d, t) {
    push(ctx, lt, d, 540, 700, 1.02, 1.08);
    vgrad(ctx, 0, 0, W, H, [[0, '#1a1f27'], [1, '#0e1116']]);
    portrait(ctx, 540, 700, 860, { eyes: 'wide', brow: .8 }, Object.assign({}, VERA, { skin: '#e9e2da' }));
    headline(ctx, 'ТАКОГО НЕ БЫЛО', appear(lt, .1), 'r', 200, 'НИКОГДА РАНЬШЕ', 100);
  } },
);
