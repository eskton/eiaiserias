"""Write timecodes.csv, the SRT and per-scene audio files from align.py output.

Usage: python3 export_timecodes.py <align.json> <voice.mp3> <out_dir>
"""
import csv
import json
import os
import subprocess
import sys

SCENES = [(1, 35, 'kvartira_stuk'), (36, 50, 'lestnica'), (51, 109, 'podval_ilya'),
          (110, 170, 'tehkomnata_vera'), (171, 200, 'ulica_supermarket'), (201, 223, 'foto_laboratoriya')]


def ts(t, sep=','):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02}{sep}{ms:03}'


def main():
    lines = json.load(open(sys.argv[1], encoding='utf-8'))['lines']
    voice, out = sys.argv[2], sys.argv[3]
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', voice]))
    with open(os.path.join(out, 'ep01_voiceover_full.srt'), 'w', encoding='utf-8') as f:
        for x in lines:
            f.write(f"{x['n']}\n{ts(x['start'])} --> {ts(x['end'])}\n{x['text']}\n\n")
    cuts = []
    for i, (a, b, name) in enumerate(SCENES, 1):
        t0 = 0.0 if a == 1 else (lines[a - 2]['end'] + lines[a - 1]['start']) / 2
        t1 = dur if b == len(lines) else (lines[b - 1]['end'] + lines[b]['start']) / 2
        cuts.append((i, name, a, b, t0, t1))
        os.makedirs(os.path.join(out, 'scenes'), exist_ok=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', voice, '-ss', f'{t0:.3f}', '-to', f'{t1:.3f}',
                        '-c:a', 'libmp3lame', '-b:a', '256k', os.path.join(out, 'scenes', f'ep01_s{i:02}_{name}.mp3')], check=True)
    with open(os.path.join(out, 'timecodes.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['line', 'scene', 'start', 'end', 'start_in_scene', 'end_in_scene', 'confidence', 'text'])
        for x in lines:
            sc = next(c for c in cuts if c[2] <= x['n'] <= c[3])
            w.writerow([x['n'], sc[0], ts(x['start'], '.'), ts(x['end'], '.'), f"{x['start'] - sc[4]:.2f}",
                        f"{x['end'] - sc[4]:.2f}", x['confidence'], x['text']])
    for c in cuts:
        print(f'scene {c[0]} {c[1]}: lines {c[2]}-{c[3]}, {ts(c[4], ".")} - {ts(c[5], ".")}, {c[5] - c[4]:.1f} s')


if __name__ == '__main__':
    main()
