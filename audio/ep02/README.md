# Эпизод 2 — озвучка

- `ep02_voiceover.mp3` — озвучка из ElevenLabs (голос Prince Nur), 3:09, MP3 128 кбит/с.
- `words.json` — распознанные слова с временем (`audio/tools/transcribe.py`, модель GigaAM v2).
- `alignment.json` — 69 строк сценария (`scripts/ep02.txt`) с началом и концом каждой строки
  и каждого слова (`audio/tools/align_words.py`); все 360 слов совпали с распознанными.
- `keywords.txt` — слова, которые в субтитрах подсвечиваются красным (r) или жёлтым (y).

Пересобрать разметку:

```
python3 audio/tools/transcribe.py audio/ep02/ep02_voiceover.mp3 <папка модели> audio/ep02/words.json
python3 audio/tools/align_words.py scripts/ep02.txt audio/ep02/words.json audio/ep02/alignment.json
```
