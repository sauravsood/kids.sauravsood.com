"""Makes the sung storybooks once, ahead of time: public/trace/song/.

Model: ACE-Step 1.5 (ace-step/ACE-Step-1.5, MIT), DiT "acestep-v15-turbo".
It's given a guide track of the rhyme's real tune (rendered here from the
same notes as music.js, with a soft "ooh" voice on the melody) in its *cover*
mode, plus the words, so it sings the traditional melody rather than making
up a new one.

Every song is made a few times (different seeds and cover strengths) and the
best take is kept, scored automatically on:
  - words: faster-whisper (SYSTRAN/faster-whisper, MIT) hears the take and
    it's compared with the lyric;
  - tune: the sung pitch (librosa pYIN) is compared with the guide melody.
Whisper's word times also give the moment each page starts, so the book can
turn its pages in time with the song.

Run on claude-server (see server/README.md):
  node scripts/voice/songs.mjs > /tmp/songs.json
  .venv/bin/python server/sing.py /tmp/songs.json --ace ~/ACE-Step-1.5 [--only macdonald/cow] [--takes 4]
Writes public/trace/song/<book>/<version>.mp3 and public/trace/song/index.json.
"""

import argparse
import difflib
import json
import os
import re
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "trace", "song")
SR = 44100
CAPTION = ("gentle nursery rhyme for toddlers, warm soft female vocal singing clearly, "
           "music box, celesta and soft acoustic guitar, slow, calm, lullaby, simple, sweet")

NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def midi(n):
    m = re.match(r"^([A-G])([#b]?)(-?\d)$", n)
    return 12 * (int(m[3]) + 1) + NOTE[m[1]] + (1 if m[2] == "#" else -1 if m[2] == "b" else 0)


def steps_from(melody, transpose=0):
    out = []
    for tok in melody.split():
        n, _, l = tok.partition(":")
        out.append({"notes": [midi(n) + transpose], "len": int(l or 1)})
        out.extend({"notes": [], "len": 1} for _ in range(int(l or 1) - 1))
    return out


# Old MacDonald's whole verse (music.js only plays the first half round and
# round). One line per page; "C5" notation, moved down to G like music.js.
MACDONALD = [
    "C5 C5 C5 G4 A4 A4 G4:2 E5 E5 D5 D5 C5:4",
    "G4 C5 C5 C5 G4 A4 A4 G4:2 E5 E5 D5 D5 C5:3",
    "G4 G4 C5 C5 C5:2 G4 G4 C5 C5 C5:2",
    "C5 C5 C5:2 C5 C5 C5:2 C5 C5 C5 C5 C5 C5 C5:2",
    "C5 C5 C5 G4 A4 A4 G4:2 E5 E5 D5 D5 C5:4",
]
# Where each page starts in music.js's notes (in steps).
PAGE_STEPS = {"star": [0, 8, 16, 24, 32], "baa": [0, 16, 24, 32], "boat": [0, 12, 24, 36]}


def guide(song):
    """The guide track: soft "ooh" melody + warm chords, and each page's start (s)."""
    step = song["tune"]["step"]
    if song["id"] == "macdonald":
        lines = [steps_from(l, -5) for l in MACDONALD]
        starts, steps = [], []
        for l in lines:
            starts.append(len(steps))
            steps.extend(l)
        chords = []
    else:
        steps = song["tune"]["steps"]
        starts = PAGE_STEPS[song["id"]]
        chords = [(i, s["chord"]) for i, s in enumerate(steps) if s.get("chord")]
    lead = 2 * step  # a short count-in
    total = lead + len(steps) * step + 2.5
    x = np.zeros(int(total * SR))
    t = np.arange(int(SR * 4)) / SR

    def tone(m, at, dur, level, voice):
        f = 440 * 2 ** ((m - 69) / 12)
        n = int(dur * SR)
        tt = t[:n]
        if voice:  # an "ooh": a few soft harmonics with a little vibrato
            ph = 2 * np.pi * f * tt + 0.012 * f / 5.5 * np.sin(2 * np.pi * 5.5 * tt) * (tt > 0.25)
            w = np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
            env = np.minimum(1, tt / 0.06) * np.minimum(1, (dur - tt) / 0.08)
        else:
            w = np.sin(2 * np.pi * f * tt) + 0.2 * np.sin(4 * np.pi * f * tt)
            env = np.minimum(1, tt / 0.4) * np.minimum(1, (dur - tt) / 0.5)
        a = int(at * SR)
        x[a:a + n] += level * w * env

    for i, s in enumerate(steps):
        for m in s["notes"]:
            tone(m, lead + i * step, s["len"] * step * 0.95, 0.22, True)
    for i, c in chords:
        for m in c["notes"]:
            tone(m - 12, lead + i * step, c["len"] * step, 0.05, False)
    x = x / max(1e-6, np.max(np.abs(x))) * 0.8
    melody = [(lead + i * step, s["len"] * step, s["notes"][0]) for i, s in enumerate(steps) if s["notes"]]
    return x.astype(np.float32), [lead + s * step for s in starts], melody, 60 / step


def lyrics_of(pages):
    return "[verse]\n" + "\n".join(p.replace("E-I-E-I-O", "E-I-E-I-O") for p in pages)


def words(text):
    text = text.lower().replace("e-i-e-i-o", "e i e i o")
    return re.findall(r"[a-z']+", text.replace("-", " "))


class Ace:
    def __init__(self, root, device):
        sys.path.insert(0, root)
        from acestep.handler import AceStepHandler
        from acestep.inference import GenerationConfig, GenerationParams, generate_music
        from acestep.llm_inference import LLMHandler
        self.P, self.C, self.gen = GenerationParams, GenerationConfig, generate_music
        self.dit = AceStepHandler()
        self.dit.initialize_service(project_root=root, config_path="acestep-v15-turbo", device=device)
        self.llm = LLMHandler()  # not loaded: cover ignores the planner

    def take(self, src, pages, bpm, duration, seed, strength, outdir):
        params = self.P(task_type="cover", src_audio=src, caption=CAPTION, lyrics=lyrics_of(pages),
                        vocal_language="en", bpm=int(round(bpm)), duration=duration, seed=seed,
                        audio_cover_strength=strength, thinking=False)
        res = self.gen(self.dit, self.llm, params, self.C(batch_size=1, audio_format="wav"), save_dir=outdir)
        if not res.success:
            raise RuntimeError(res.error)
        return res.audios[0]["path"]


class Judge:
    def __init__(self, device):
        from faster_whisper import WhisperModel
        self.asr = WhisperModel("base.en", device=device, compute_type="int8")

    def hear(self, path):
        segs, _ = self.asr.transcribe(path, word_timestamps=True, language="en", vad_filter=False)
        return [(w.start, re.sub(r"[^a-z']", "", w.word.lower())) for s in segs for w in s.words]

    @staticmethod
    def tune(path, melody):
        import librosa
        y, sr = librosa.load(path, sr=22050, mono=True)
        f0, voiced, _ = librosa.pyin(y, fmin=150, fmax=1000, sr=sr, frame_length=2048)
        times = librosa.times_like(f0, sr=sr)
        hits = tot = 0
        for at, dur, m in melody:
            sel = (times >= at + 0.05) & (times < at + dur * 0.9) & voiced
            if not sel.any():
                tot += 1
                continue
            sung = np.nanmedian(librosa.hz_to_midi(f0[sel]))
            tot += 1
            hits += abs(((sung - m) + 6) % 12 - 6) <= 1  # right note, any octave
        return hits / max(1, tot)


def page_times(heard, pages, fallback):
    """When each page's first words are sung, from whisper's word times."""
    sung = [w for _, w in heard]
    times = []
    for n, page in enumerate(pages):
        first = words(page)[:3]
        best, at = 0, None
        for i in range(len(sung)):
            r = difflib.SequenceMatcher(None, first, sung[i:i + len(first)]).ratio()
            if r > best and (not times or heard[i][0] > times[-1]):
                best, at = r, heard[i][0]
        times.append(round(at, 2) if at is not None and best >= 0.6 else None)
    # Fill gaps from the guide's timing, kept in order.
    out = []
    for n, t in enumerate(times):
        t = t if t is not None else fallback[n]
        out.append(max(t, out[-1] + 0.5) if out else max(0, t))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("songs")
    ap.add_argument("--ace", required=True, help="ACE-Step-1.5 checkout (with its checkpoints)")
    ap.add_argument("--device", default="cpu")
    ap.add_argument("--only", default="")
    ap.add_argument("--takes", type=int, default=4)
    a = ap.parse_args()
    songs = json.load(open(a.songs))["songs"]
    index_path = os.path.join(OUT, "index.json")
    index = json.load(open(index_path)) if os.path.exists(index_path) else {}
    ace, judge = Ace(a.ace, a.device), Judge("cpu")
    for song in songs:
        ref, starts, melody, bpm = guide(song)
        for v in song["versions"]:
            if a.only and not v["file"].startswith(a.only):
                continue
            with tempfile.TemporaryDirectory() as tmp:
                src = os.path.join(tmp, "guide.wav")
                sf.write(src, ref, SR)
                want = words(" ".join(v["pages"]))
                best = None
                for k in range(a.takes):
                    strength = [0.7, 0.55, 0.85, 0.6][k % 4]
                    path = ace.take(src, v["pages"], bpm, len(ref) / SR, 1000 + k, strength, tmp)
                    heard = judge.hear(path)
                    said = difflib.SequenceMatcher(None, want, [w for _, w in heard]).ratio()
                    tune = judge.tune(path, melody)
                    score = 0.6 * said + 0.4 * tune
                    print(f"{v['file']} take {k}: words {said:.2f} tune {tune:.2f} -> {score:.2f}", flush=True)
                    if not best or score > best[0]:
                        best = (score, path, heard, said, tune)
                score, path, heard, said, tune = best
                out = os.path.join(OUT, v["file"] + ".mp3")
                os.makedirs(os.path.dirname(out), exist_ok=True)
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-af",
                                "silenceremove=start_periods=1:start_threshold=-50dB,loudnorm=I=-19:TP=-1.5,afade=t=out:st=0:d=0",
                                "-ac", "2", "-c:a", "libmp3lame", "-q:a", "5", out], check=True)
                # Times are measured on the take; the trim above moves them, so measure again.
                times = page_times(judge.hear(out), v["pages"], [s - starts[0] for s in starts])
                book, version = v["file"].split("/")
                index.setdefault(book, {})[version] = {"pages": times, "words": round(said, 2), "tune": round(tune, 2)}
                json.dump(index, open(index_path, "w"), indent=1, sort_keys=True)
                print(f"kept {v['file']}: pages at {times}", flush=True)


if __name__ == "__main__":
    main()
