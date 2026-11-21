"""Speaks one storybook line live, in the same voice as the recorded books.

Default engine: Kokoro-82M (hexgrad/kokoro, Apache-2.0) through kokoro-onnx,
voice af_heart at the same speed and with the same clean-up as
scripts/voice/build.py. Because it is the very model the books were recorded
with, a live line ("Maya's animal went to sea") sounds like the pages around it.

Optional engine (VOICE_ENGINE=chatterbox): Chatterbox Turbo
(resemble-ai/chatterbox, MIT), cloning the narrator from VOICE_REFERENCE, a
clean 10-20 s Kokoro af_heart recording. Only worth switching on if every book
is re-recorded with it too, or the live lines sound like a second reader.

Lines are cached on disk by a hash of engine + text, so each one is made once.
"""

import hashlib
import io
import os
import subprocess
import sys

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "scripts", "voice"))
import build  # noqa: E402  same spoken() / tidy() / VOICE / SPEED as the books

MODELS = os.environ.get("AI_MODELS", os.path.join(HERE, "models"))
CACHE = os.environ.get("AI_CACHE", os.path.join(HERE, "cache", "say"))
ENGINE = os.environ.get("VOICE_ENGINE", "kokoro")


def to_mp3(samples, sr):
    wav = io.BytesIO()
    sf.write(wav, samples, sr, format="WAV")
    # Same filter and encoder settings as the recorded pages.
    return subprocess.run(
        ["ffmpeg", "-v", "error", "-f", "wav", "-i", "pipe:0",
         "-af", "highpass=f=60,lowpass=f=11000", "-ac", "1", "-c:a", "libmp3lame", "-q:a", "6",
         "-f", "mp3", "pipe:1"],
        input=wav.getvalue(), capture_output=True, check=True).stdout


class Voice:
    def __init__(self):
        os.makedirs(CACHE, exist_ok=True)
        if ENGINE == "chatterbox":
            from chatterbox.tts_turbo import ChatterboxTurboTTS
            self.cb = ChatterboxTurboTTS.from_pretrained(device=os.environ.get("AI_DEVICE", "cpu"))
            self.ref = os.environ["VOICE_REFERENCE"]
        else:
            from kokoro_onnx import Kokoro
            self.kokoro = Kokoro(os.path.join(MODELS, "kokoro-v1.0.onnx"), os.path.join(MODELS, "voices-v1.0.bin"))

    def samples(self, text):
        spoken = build.spoken(text)
        if ENGINE == "chatterbox":
            wav = self.cb.generate(spoken, audio_prompt_path=self.ref)
            x = wav.squeeze(0).cpu().numpy()
            sr = self.cb.sr
            if sr != build.SR:
                import librosa
                x = librosa.resample(x, orig_sr=sr, target_sr=build.SR)
            return x
        audio, sr = self.kokoro.create(spoken, voice=build.VOICE, speed=build.SPEED, lang="en-us", trim=False)
        assert sr == build.SR
        return audio

    def mp3(self, text):
        key = hashlib.sha256(f"{ENGINE}|{build.VOICE}|{build.SPEED}|{text}".encode()).hexdigest()
        path = os.path.join(CACHE, key + ".mp3")
        if os.path.exists(path):
            return open(path, "rb").read()
        out = to_mp3(build.tidy(np.asarray(self.samples(text))), build.SR)
        tmp = path + ".tmp"
        open(tmp, "wb").write(out)
        os.replace(tmp, path)
        return out
