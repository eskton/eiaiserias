# Эпизод 3 — озвучка

- `ep03_voiceover.mp3` — озвучка из ElevenLabs (голос Prince Nur), 3:20, MP3 128 кбит/с.
- `words.json` — распознанные слова с временем (`audio/tools/transcribe.py`, модель GigaAM v2).
- `alignment.json` — 70 строк сценария (`scripts/ep03.txt`) с временем каждого слова
  (`audio/tools/align_words.py`); все 352 слова совпали с распознанными.
- `keywords.txt` — слова, которые в субтитрах подсвечиваются красным (r) или жёлтым (y).
