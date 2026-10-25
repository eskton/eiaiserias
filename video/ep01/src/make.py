"""Build episode 1: render frames, synthesize the soundtrack, burn subtitles, encode the mp4.

Usage: python3 make.py <out.mp4> [--end SECONDS] [--workers N] [--tmp DIR] [--no-subs]
"""
import argparse
import concurrent.futures
import csv
import os
import subprocess
import sys

SRC = os.path.dirname(os.path.abspath(__file__))
VIDEO = os.path.dirname(os.path.dirname(SRC))
REPO = os.path.dirname(VIDEO)
VOICE = os.path.join(REPO, 'audio/ep01/ep01_voiceover_full.mp3')
TIMECODES = os.path.join(REPO, 'audio/ep01/timecodes.csv')
SHOTS = [os.path.join(SRC, f) for f in ['scene1.js']]
FPS = 24
# The voiceover breaks off mid-word on line 223, so the episode ends after line 222.
END = 350.4


def ass_time(t):
    cs = int(round(t * 100))
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f'{h}:{m:02}:{s:02}.{cs:02}'


def write_subs(path, end):
    sec = lambda t: sum(float(x) * m for x, m in zip(t.split(':'), (3600, 60, 1)))
    rows = list(csv.DictReader(open(TIMECODES, encoding='utf-8')))
    out = ["""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter SemiBold,50,&H00F0F0F0,&H00F0F0F0,&H96000000,&H96000000,0,0,0,0,100,100,0,0,1,2.4,1.2,2,200,200,72,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"""]
    for k, r in enumerate(rows):
        s, e = sec(r['start']), sec(r['end'])
        if s >= end:
            break
        nxt = sec(rows[k + 1]['start']) if k + 1 < len(rows) else end
        e = min(max(e, s + 0.6) + 0.5, nxt, end)
        out.append(f"Dialogue: 0,{ass_time(s)},{ass_time(e)},Sub,,0,0,0,,{{\\fad(80,80)}}{r['text']}")
    open(path, 'w', encoding='utf-8').write('\n'.join(out) + '\n')


def render(f0, f1, out):
    subprocess.run(['node', os.path.join(VIDEO, 'engine/render.js'), '--shots=' + ','.join(SHOTS),
                    f'--f0={f0}', f'--f1={f1}', f'--out={out}'], check=True)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('out')
    ap.add_argument('--end', type=float, default=END)
    ap.add_argument('--workers', type=int, default=4)
    ap.add_argument('--tmp', default='/tmp/ep01_build')
    ap.add_argument('--no-subs', action='store_true')
    a = ap.parse_args()
    os.makedirs(a.tmp, exist_ok=True)
    frames = int(round(a.end * FPS))
    n = a.workers * 2
    cuts = [frames * i // n for i in range(n + 1)]
    with concurrent.futures.ThreadPoolExecutor(a.workers) as ex:
        segs = list(ex.map(lambda i: render(cuts[i], cuts[i + 1], os.path.join(a.tmp, f'seg{i:02}.mp4')), range(n)))
    lst = os.path.join(a.tmp, 'segs.txt')
    open(lst, 'w').write(''.join(f"file '{s}'\n" for s in segs))
    raw = os.path.join(a.tmp, 'raw.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', raw], check=True)
    wav = os.path.join(a.tmp, 'sound.wav')
    subprocess.run([sys.executable, os.path.join(SRC, 'sound.py'), VOICE, wav, str(a.end)], check=True)
    vf = 'vignette=angle=PI/4.4,noise=alls=5:allf=t'
    if not a.no_subs:
        subs = os.path.join(a.tmp, 'subs.ass')
        write_subs(subs, a.end)
        vf += f',ass={subs}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-i', wav, '-vf', vf,
                    '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000',
                    '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-maxrate', '4M', '-bufsize', '8M', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', a.out], check=True)
    print(a.out)


if __name__ == '__main__':
    main()
