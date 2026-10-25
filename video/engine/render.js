// Render frames of an episode with headless Chromium.
//   node render.js --shots=a.js,b.js --f0=0 --f1=240 --out=seg.mp4    frames [f0, f1) at 24 fps into an mp4
//   node render.js --shots=a.js --stills=1.5,7.2 --dir=out/              PNG stills at the given seconds
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=')]; }));
const FPS = +(args.fps || 24), FW = +(args.w || 1920), FH = +(args.h || 1080);
const shots = args.shots.split(',').map(f => 'file://' + path.resolve(f)).join(',');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: FW, height: FH }, deviceScaleFactor: 1 });
  let failed = false;
  page.on('console', m => console.error('[page]', m.text()));
  page.on('pageerror', e => { console.error('[pageerror]', e.message); failed = true; });
  await page.goto('file://' + path.join(__dirname, 'player.html') + `?w=${FW}&h=${FH}&shots=` + encodeURIComponent(shots));
  await page.evaluate(() => window.ready);
  if (failed) process.exit(1);

  if (args.stills) {
    fs.mkdirSync(args.dir, { recursive: true });
    for (const t of args.stills.split(',').map(Number)) {
      const b64 = await page.evaluate(t => window.pngAt(t), t);
      fs.writeFileSync(path.join(args.dir, `t${t.toFixed(2)}.png`), Buffer.from(b64, 'base64'));
    }
  } else {
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '13', '-pix_fmt', 'yuv420p', args.out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const f0 = +args.f0, f1 = +args.f1, started = Date.now();
    for (let n = f0; n < f1; n++) {
      const buf = Buffer.from(await page.evaluate(t => window.frameAt(t), n / FPS), 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (failed) process.exit(1);
      if ((n - f0) % 240 === 0) console.error(`${path.basename(args.out)}: frame ${n - f0}/${f1 - f0}, ${((Date.now() - started) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
