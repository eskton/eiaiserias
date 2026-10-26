"""Transcribe a Russian voiceover with word timings (sherpa-onnx + GigaAM CTC, runs offline).

Usage: python3 transcribe.py <voice.mp3> <model_dir> <out.json>
Speech is cut into chunks at pauses, each chunk is recognised separately; the model gives a time per
letter, which becomes a start and end per word. Output: {"words": [{"w", "start", "end"}], "pauses": [[a, b]]}.
"""
import json
import subprocess
import sys

import numpy as np
import sherpa_onnx

SR = 16000
HOP = 0.01


def main():
    voice, model_dir, out = sys.argv[1:4]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', voice, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, '<i2').astype(np.float32) / 32768
    hop = int(SR * HOP)
    n = len(x) // hop
    db = 20 * np.log10(np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1)) + 1e-9)
    db -= np.percentile(db, 99)
    quiet = db < -30
    # pauses of 0.2 s or more
    pauses, i = [], 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]:
                j += 1
            if (j - i) * HOP >= 0.2:
                pauses.append([i * HOP, j * HOP])
            i = j
        else:
            i += 1
    # chunks of speech up to ~14 s, cut in the middle of pauses
    cuts, last = [0.0], 0.0
    for a, b in pauses:
        mid = (a + b) / 2
        if mid - last > 8:
            cuts.append(mid)
            last = mid
    cuts.append(len(x) / SR)
    rec = sherpa_onnx.OfflineRecognizer.from_nemo_ctc(model=f'{model_dir}/model.int8.onnx', tokens=f'{model_dir}/tokens.txt', num_threads=4)
    words = []
    for a, b in zip(cuts, cuts[1:]):
        s = rec.create_stream()
        s.accept_waveform(SR, x[int(a * SR):int(b * SR)])
        rec.decode_stream(s)
        r = s.result
        cur, t0, t1 = '', None, None
        for tok, ts in zip(r.tokens, r.timestamps):
            if tok.strip() == '':
                if cur:
                    words.append({'w': cur, 'start': round(a + t0, 3), 'end': round(a + t1 + 0.08, 3)})
                cur, t0 = '', None
                continue
            if t0 is None:
                t0 = ts
            cur += tok
            t1 = ts
        if cur:
            words.append({'w': cur, 'start': round(a + t0, 3), 'end': round(a + t1 + 0.08, 3)})
    json.dump({'words': words, 'pauses': pauses, 'duration': len(x) / SR}, open(out, 'w'), ensure_ascii=False, indent=0)
    print(len(words), 'words')
    print(' '.join(w['w'] for w in words))


if __name__ == '__main__':
    main()
