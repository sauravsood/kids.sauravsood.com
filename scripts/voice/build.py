"""Records the Trace storybook narration as small MP3 files.

The voice is Kokoro-82M (Apache-2.0), an open neural text-to-speech model,
with its "af_heart" voice. Everything runs on this computer; nothing is
sent anywhere. Output goes to public/trace/voice/<book>/<page>.mp3.

Setup (once):
  python3 -m venv venv && venv/bin/pip install kokoro-onnx soundfile numpy
  # Kokoro-82M ONNX weights (any build of the v1.0 model, fp16 is fine)
  # and the voice .bin files from the kokoro-js npm package:
  npm pack kokoro-js && tar xzf kokoro-js-*.tgz   # -> package/voices/*.bin

Run:
  node scripts/voice/lines.mjs > lines.json
  venv/bin/python scripts/voice/build.py lines.json kokoro.onnx package/voices
  # just some lines, e.g. the animal names:  ... package/voices names/
"""

import glob
import json
import os
import re
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

VOICE = "af_heart"
SPEED = 0.8
SR = 24000
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "public", "trace", "voice")

# Say these the way a grown-up reading aloud would.
SAY = [
    ("E-I-E-I-O", "ee eye, ee eye, oh"),
    ("t-rex", "tee rex"),
    ("T-rex", "tee rex"),
    ("Long-neck", "long neck"),
    ("Pussy-cat", "pussy cat"),
    ("cock-horse", "cock horse"),
    ("Cock-Horse", "cock horse"),
    ("“", ""),
    ("”", ""),
]


def spoken(text):
    for a, b in SAY:
        text = text.replace(a, b)
    text = re.sub(r"\b(\w+)-\1\b", r"\1 \1", text)  # moo-moo -> moo moo
    return re.sub(r"\bla\b", "lah", text)


def tidy(samples):
    """Trims silence, adds a soft lead-in and evens out the loudness."""
    x = samples.astype(np.float64)
    env = np.convolve(np.abs(x), np.ones(240) / 240, mode="same")
    loud = np.where(env > 0.004)[0]
    if len(loud):
        x = x[max(0, loud[0] - 600): loud[-1] + 2400]
    # Same loudness on every page (speech RMS around -20 dBFS), peaks under -1.5 dB.
    rms = np.sqrt(np.mean(x[np.abs(x) > 0.01] ** 2)) if np.any(np.abs(x) > 0.01) else 1
    x *= 10 ** (-20 / 20) / rms
    peak = np.max(np.abs(x))
    if peak > 0.84:
        x *= 0.84 / peak
    fade = int(SR * 0.03)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    lead = np.zeros(int(SR * 0.12))
    return np.concatenate([lead, x, np.zeros(int(SR * 0.2))]).astype(np.float32)


def main(lines_path, model, voices_dir, only=""):
    lines = json.load(open(lines_path))["lines"]
    with tempfile.TemporaryDirectory() as tmp:
        voices = {os.path.basename(f)[:-4]: np.fromfile(f, dtype=np.float32).reshape(-1, 1, 256)
                  for f in glob.glob(os.path.join(voices_dir, "*.bin"))}
        np.savez(os.path.join(tmp, "voices.npz"), **voices)
        kokoro = Kokoro(model, os.path.join(tmp, "voices.npz"))
        if only:
            lines = [l for l in lines if l["file"].startswith(only)]
        for i, line in enumerate(lines):
            out = os.path.join(OUT, line["file"] + ".mp3")
            os.makedirs(os.path.dirname(out), exist_ok=True)
            audio, sr = kokoro.create(spoken(line["text"]), voice=VOICE, speed=SPEED, lang="en-us",
                                         trim=False)  # its own trim sometimes cuts everything
            assert sr == SR and len(audio) > SR // 2, line
            wav = os.path.join(tmp, "x.wav")
            sf.write(wav, tidy(audio), SR)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav,
                            "-af", "highpass=f=60,lowpass=f=11000",
                            "-ac", "1", "-c:a", "libmp3lame", "-q:a", "6", out], check=True)
            print(f"{i + 1}/{len(lines)} {line['file']}: {line['text']}")


if __name__ == "__main__":
    main(*sys.argv[1:5])
