# Trace AI server

A small Python server for three Trace features. It runs on **claude-server** (EC2, Ubuntu) and is reached through its Cloudflare tunnel at `https://ai.sauravsood.com` → `http://localhost:8000`. Trace never calls it directly: the kids Worker passes requests through at `/api/ai/*` (`src/ai.js`), only for signed-in families. Every feature still works without it.

| Feature | Model (repo, licence) | Where it runs | Without the server |
| --- | --- | --- | --- |
| The child's name in the storybooks ("Maya's animal jumped over the moon") and on the name button | [Kokoro-82M](https://github.com/hexgrad/kokoro) (Apache-2.0), voice `af_heart`, through [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx) (MIT). It's the same model and voice the books were recorded with. | Live, `POST /say`, about 1 s a line on CPU, cached | The recorded "my animal" line |
| Sung rhymes (Twinkle, Baa Baa, Row Your Boat, Old MacDonald) | [ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5) (MIT), cover mode with a guide track of the real tune | Once, ahead of time, `sing.py` → `public/trace/song/` | Read aloud over the music box |
| Photo → outline in My Animals | [Grounded SAM 2](https://github.com/IDEA-Research/Grounded-SAM-2) (Apache-2.0): [Grounding DINO](https://huggingface.co/IDEA-Research/grounding-dino-tiny) tiny finds each animal, [SAM 2.1](https://github.com/facebookresearch/sam2) small cuts it out | Live, `POST /outline`, a few seconds on CPU | U²-Net small on the iPad |

Optional: `VOICE_ENGINE=chatterbox` switches live lines to [Chatterbox Turbo](https://github.com/resemble-ai/chatterbox) (MIT), cloning the narrator from `VOICE_REFERENCE` (a clean 10–20 s Kokoro `af_heart` WAV). Its live lines then sound like a second reader next to the Kokoro pages, so turn it on only if every book is re-recorded with it too.

No forks are needed: every model is used as published, pinned in `requirements.txt` or by commit.

## Privacy

- **Photos:** Trace sends a copy shrunk to 1024 px and redrawn on a canvas, so the camera's EXIF (place, time, device) is never sent. The server keeps it in memory for that one request and stores nothing. The full photo never leaves the iPad.
- **Names:** a spoken line is cached on disk under a hash of its text (`cache/say/`), so the same line is made only once. Delete the folder at any time.
- **Who can call it:** the Worker forwards the grown-up's session token in `X-Kids-Session`, and the server checks it with `GET https://kids.sauravsood.com/api/me` (cached for 10 minutes). Limits: 300 lines and 60 photos an hour per session.

## Set up on claude-server

The box needs about 8 GB of RAM for the live server (16 GB to make songs on it too) and about 25 GB of disk.

```bash
git clone https://github.com/sauravsood/kids.sauravsood.com ~/kids.sauravsood.com
~/kids.sauravsood.com/server/setup.sh          # voice + outlines, as the kids-ai systemd service
curl -s localhost:8000/health
```

`setup.sh` installs ffmpeg, Node and [uv](https://github.com/astral-sh/uv), makes a 4 GB swap file, sets up `.venv` with Python 3.12 and CPU PyTorch, downloads Kokoro v1.0 from kokoro-onnx's releases, and lets the Hugging Face models download into `~/.cache/huggingface` on first start. Then, in the Cloudflare dashboard (Zero Trust → Networks → Tunnels → claude-server → Public hostnames), add `ai.sauravsood.com` → `http://localhost:8000`.

Update: `cd ~/kids.sauravsood.com && git pull && sudo systemctl restart kids-ai`. Logs: `journalctl -u kids-ai -f`.

## Making the songs

```bash
~/kids.sauravsood.com/server/setup.sh --songs      # clones ACE-Step 1.5 to ~/ACE-Step-1.5
cd ~/kids.sauravsood.com
node scripts/voice/songs.mjs > /tmp/songs.json
~/ACE-Step-1.5/.venv/bin/python server/sing.py /tmp/songs.json --ace ~/ACE-Step-1.5 --takes 4
```

For each song, `sing.py` renders a guide track of the traditional tune from the same notes as `music.js`. It asks ACE-Step for a few takes, then keeps the one whose words ([faster-whisper](https://github.com/SYSTRAN/faster-whisper), MIT) and notes (librosa pYIN) best match the rhyme. Whisper's word times also give the moment each page starts. The output is `public/trace/song/<book>/<version>.mp3`, with page times and scores in `public/trace/song/index.json`. Old MacDonald has one version per animal (the animal and its sound are sung). Commit the files, then bump `SONGS` in `public/trace/sw.js` if songs were re-made. A book with no entry in `index.json` is read aloud as before.
