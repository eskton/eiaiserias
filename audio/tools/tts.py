"""Draft voiceover for a script with an offline Russian TTS (a Piper voice, pip package piper-tts), for previews.

Usage: python3 tts.py <script.txt> <voice_dir> <out.mp3> [--speed 1.12] [--pause 0.32]
                      [--voice2 <voice_dir> --voice2-lines 12,14]
Each script line is spoken on its own and the lines are joined with pauses (longer after a question, a dash
or a one-word line). --voice2 speaks the listed lines (1-based) with a second voice, e.g. a voice on a radio.
The real voiceover is recorded in ElevenLabs from the same script; this one only stands in for it.
"""
import argparse
import glob
import os
import subprocess

import numpy as np
from piper import PiperVoice, SynthesisConfig


def load(voice_dir):
    """A Piper voice: the folder holds <name>.onnx and <name>.onnx.json."""
    return PiperVoice.load(glob.glob(os.path.join(voice_dir, '*.onnx'))[0])


def speak(voice, text, speed):
    chunks = list(voice.synthesize(text, SynthesisConfig(length_scale=1 / speed, noise_scale=0.6, noise_w_scale=0.7)))
    return np.concatenate([c.audio_float_array for c in chunks]).astype(np.float32), chunks[0].sample_rate


def pause_after(line, base):
    s = line.rstrip()
    if len(s.split()) <= 2 or s.endswith('?'):
        return base * 1.8
    if s.endswith('»') or s.endswith('—'):
        return base * 1.4
    return base


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('script')
    ap.add_argument('voice')
    ap.add_argument('out')
    ap.add_argument('--speed', type=float, default=1.12)
    ap.add_argument('--pause', type=float, default=0.32)
    ap.add_argument('--voice2')
    ap.add_argument('--voice2-lines', default='')
    a = ap.parse_args()
    lines = [l.strip() for l in open(a.script, encoding='utf-8') if l.strip()]
    tts = load(a.voice)
    tts2 = load(a.voice2) if a.voice2 else None
    second = {int(x) for x in a.voice2_lines.split(',') if x}
    sr, parts = None, []
    for i, line in enumerate(lines, 1):
        engine = tts2 if (tts2 and i in second) else tts
        # the TTS reads guillemets and dashes as nothing anyway; keep the words and the stops
        text = line.replace('«', '').replace('»', '').replace(' — ', ', ')
        x, rate = speak(engine, text, a.speed)
        sr = sr or rate
        if rate != sr:
            raise SystemExit('both voices must have the same sample rate')
        # trim the model's own leading and trailing silence, then add ours
        loud = np.where(np.abs(x) > 0.02)[0]
        if len(loud):
            x = x[max(0, loud[0] - int(0.03 * sr)): loud[-1] + int(0.08 * sr)]
        parts += [x, np.zeros(int(pause_after(line, a.pause) * sr), np.float32)]
        print(f'{i:2} {len(x) / sr:5.2f}s  {line}')
    y = np.concatenate(parts)
    y = y / (np.max(np.abs(y)) + 1e-9) * 0.9
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', '-',
                    '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '128k', a.out], input=y.tobytes(), check=True)
    print(f'{len(y) / sr:.2f}s -> {a.out}')


if __name__ == '__main__':
    main()
