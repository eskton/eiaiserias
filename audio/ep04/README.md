# Эпизод 4 — озвучка

- `ep04_voice_draft.mp3` — черновая озвучка синтезом: рассказчик — голос Piper ru_RU-ruslan-medium,
  диспетчер (строки 12 и 14) — ru_RU-denis-medium; скорость 1.16, паузы 0,27 с. Сделано так:
  `python3 audio/tools/tts.py scripts/ep04.txt <ruslan> audio/ep04/ep04_voice_draft.mp3 --voice2 <denis> --voice2-lines 12,14 --speed 1.16 --pause 0.27`
  (голоса — архивы `vits-piper-ru_RU-*-medium` из релизов k2-fsa/sherpa-onnx, пакет `pip install piper-tts`).
- `words.json`, `alignment.json` — слова с временем (распознавание GigaAM) и разметка 25 строк сценария
  `scripts/ep04.txt`; все 155 слов совпали.
- `keywords.txt` — слова в субтитрах: жёлтые (y), красные (r), зелёные (g).
